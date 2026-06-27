import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, ChatOptions } from "./provider";

/**
 * Gemini provider — wraps @google/generative-ai.
 *
 * Constructed by AIRouter.resolveProvider(); never instantiated directly
 * outside the ai/ package.
 */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini" as const;

  constructor(
    private readonly apiKey:    string,
    private readonly modelName: string
  ) {}

  async chatStream({
    systemPrompt,
    temperature,
    history,
    message,
    maxOutputTokens = 8192,
  }: ChatOptions): Promise<ReadableStream<Uint8Array>> {
    const genAI = new GoogleGenerativeAI(this.apiKey);

    const model = genAI.getGenerativeModel({
      model:             this.modelName,
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history: history.map((m) => ({
        role:  m.role,
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature, maxOutputTokens },
    });

    const streamResult = await chat.sendMessageStream(message);

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  }
}
