import { auth }                from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { employeeRepository }  from "@/server/repositories/employeeRepository";

interface HistoryMessage {
  role:    "user" | "model";
  content: string;
}

interface ChatRequestBody {
  history: HistoryMessage[];
  message: string;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ employeeId: string }> }
) {
  /* ── Auth ── */
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { employeeId } = await params;

  /* ── Parse body ── */
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { history = [], message } = body;
  if (!message?.trim()) {
    return new Response("Message is required", { status: 400 });
  }

  /* ── Load employee — verifies ownership ── */
  const employee = await employeeRepository.findById(userId, employeeId);
  if (!employee) {
    return new Response("Employee not found", { status: 404 });
  }

  /* ── Gemini setup ── */
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      "GEMINI_API_KEY is not configured. Add it to .env.local.",
      { status: 500 }
    );
  }

  const modelName  = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const systemPrompt =
    employee.config.systemInstructions.trim() ||
    `You are ${employee.name}, an AI ${employee.role} specialist. Be helpful, professional, and focused on ${employee.role} tasks. Keep responses concise and actionable.`;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
  });

  const chat = model.startChat({
    history: history.map((m) => ({
      role:  m.role,
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      temperature:     employee.config.temperature,
      maxOutputTokens: 8192,
    },
  });

  /* ── Stream response ── */
  try {
    const streamResult = await chat.sendMessageStream(message.trim());

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type":           "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control":          "no-cache, no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gemini request failed";
    return new Response(message, { status: 502 });
  }
}
