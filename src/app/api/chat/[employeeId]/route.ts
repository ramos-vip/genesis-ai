import { auth }                from "@clerk/nextjs/server";
import { employeeRepository }  from "@/server/repositories/employeeRepository";
import { AIRouter }            from "@/server/ai";
import type { ChatMessage }    from "@/server/ai";

interface ChatRequestBody {
  history: ChatMessage[];
  message: string;
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

  const { history = [], message } = body;
  if (!message?.trim()) return new Response("Message is required", { status: 400 });

  /* ── Load employee — verifies ownership ── */
  const employee = await employeeRepository.findById(userId, employeeId);
  if (!employee) return new Response("Employee not found", { status: 404 });

  /* ── Delegate to AI router ── */
  try {
    const router = new AIRouter(employee);
    const stream = await router.chat(history, message.trim());

    return new Response(stream, {
      headers: {
        "Content-Type":           "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control":          "no-cache, no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "AI request failed";
    return new Response(msg, { status: 502 });
  }
}
