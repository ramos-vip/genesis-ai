import { auth }                    from "@clerk/nextjs/server";
import { employeeRepository }       from "@/server/repositories/employeeRepository";
import { conversationRepository }   from "@/server/repositories/conversationRepository";
import { AIRouter }                 from "@/server/ai";
import type { ChatMessage }         from "@/server/ai";

/* ─── GET — load conversation ─────────────────────────────────────────────── */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { employeeId } = await params;

  const employee = await employeeRepository.findById(userId, employeeId);
  if (!employee) return new Response("Employee not found", { status: 404 });

  const conversationId = await conversationRepository.findOrCreate(userId, employeeId);
  const messages       = await conversationRepository.getMessages(userId, conversationId);

  return Response.json({ conversationId, messages });
}

/* ─── POST — send message, stream response, persist ──────────────────────── */

interface ChatRequestBody {
  conversationId: string;
  message:        string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  /* ── Auth ── */
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { employeeId } = await params;

  /* ── Parse body ── */
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { conversationId, message } = body;
  if (!message?.trim())      return new Response("Message is required", { status: 400 });
  if (!conversationId)       return new Response("conversationId is required", { status: 400 });

  /* ── Load employee — verifies ownership ── */
  const employee = await employeeRepository.findById(userId, employeeId);
  if (!employee) return new Response("Employee not found", { status: 404 });

  /* ── Persist user message ── */
  await conversationRepository.addMessage(conversationId, "user", message.trim());

  /* ── Load full history for AI context (excludes the just-saved user message) ── */
  const allHistory = await conversationRepository.getMessages(userId, conversationId);
  const priorHistory: ChatMessage[] = allHistory.slice(0, -1); // all turns before current

  /* ── Delegate to AI router (unchanged) ── */
  try {
    const router = new AIRouter(employee);
    const stream = await router.chat(priorHistory, message.trim());

    /* Tee the stream:
     * - clientStream  → returned to the browser immediately
     * - persistStream → read in background to save the full AI response to DB
     *
     * ReadableStream.tee() is available in Node.js 18+ and all modern browsers. */
    const [clientStream, persistStream] = stream.tee();

    // Non-blocking: save AI response after streaming completes
    void saveAiResponse(conversationId, persistStream);

    return new Response(clientStream, {
      headers: {
        "Content-Type":           "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control":          "no-cache, no-store",
        /** Client reads this to confirm the conversationId (useful on first message) */
        "X-Conversation-Id":      conversationId,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI request failed";
    return new Response(msg, { status: 502 });
  }
}

/* ─── Background helper: accumulate streamed text and save to DB ──────────── */

async function saveAiResponse(
  conversationId: string,
  stream:         ReadableStream<Uint8Array>
): Promise<void> {
  const reader  = stream.getReader();
  const decoder = new TextDecoder();
  let   content = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      content += decoder.decode(value, { stream: true });
    }
    if (content.trim()) {
      await conversationRepository.addMessage(conversationId, "model", content);
    }
  } catch (err) {
    console.error("[chat] Failed to persist AI response:", err);
  } finally {
    reader.releaseLock();
  }
}
