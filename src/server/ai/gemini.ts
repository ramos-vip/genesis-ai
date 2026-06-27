import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, ChatOptions } from "./provider";

/**
 * Gemini provider — wraps @google/generative-ai.
 *
 * Receives a fully assembled BuiltPrompt via ChatOptions.
 * All prompt construction happens in PromptBuilder — this class only
 * maps the BuiltPrompt to Gemini's native API format.
 */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini" as const;

  constructor(
    private readonly apiKey:    string,
    private readonly modelName: string
  ) {}

  async chatStream({
    prompt,
    temperature,
    maxOutputTokens = 8192,
  }: ChatOptions): Promise<ReadableStream<Uint8Array>> {
    const { systemInstruction, history, message } = prompt;

    const genAI  = new GoogleGenerativeAI(this.apiKey);
    const model  = genAI.getGenerativeModel({
      model:             this.modelName,
      systemInstruction,
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
