import type { Employee } from "@/modules/employees/types";
import type { AIProvider, ChatMessage } from "./provider";
import { GeminiProvider } from "./gemini";

/**
 * AIRouter — the single entry point for all AI chat requests.
 *
 * Responsibilities:
 *   1. Resolve the active provider from environment config (AI_PROVIDER)
 *   2. Translate Employee-specific config into a normalised ChatOptions struct
 *   3. Delegate to the provider
 *
 * The Route Handler owns: auth, request parsing, employee lookup, HTTP response.
 * This class owns: everything AI-specific.
 *
 * Adding a new provider (e.g. OpenAI):
 *   1. Create OpenAIProvider implementing AIProvider in openai.ts
 *   2. Add `case "openai": return new OpenAIProvider(...)` below
 *   3. Set AI_PROVIDER=openai + OPENAI_API_KEY in .env.local
 *   — No other file changes required.
 */
export class AIRouter {
  private readonly provider:     AIProvider;
  private readonly systemPrompt: string;
  private readonly temperature:  number;

  constructor(employee: Employee) {
    this.provider    = AIRouter.resolveProvider();
    this.temperature = employee.config.temperature;
    this.systemPrompt =
      employee.config.systemInstructions.trim() ||
      `You are ${employee.name}, an AI ${employee.role} specialist. ` +
      `Be helpful, professional, and focused on ${employee.role} tasks. ` +
      `Keep responses concise and actionable.`;
  }

  /**
   * Instantiate the correct provider based on AI_PROVIDER env var.
   * Throws immediately if required credentials are missing — fast fail
   * before any network call is attempted.
   */
  private static resolveProvider(): AIProvider {
    const providerName = process.env.AI_PROVIDER ?? "gemini";

    switch (providerName) {
      case "gemini": {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error(
            "GEMINI_API_KEY is not configured. Add it to .env.local.\n" +
            "Get one at: https://aistudio.google.com/apikey"
          );
        }
        const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
        return new GeminiProvider(apiKey, modelName);
      }

      default:
        throw new Error(
          `Unknown AI provider: "${providerName}". ` +
          `Set AI_PROVIDER to one of: gemini`
        );
    }
  }

  /**
   * Stream a chat response for the given conversation.
   *
   * @param history  All prior turns (oldest first), excluding the current message
   * @param message  The current user message
   * @returns ReadableStream<Uint8Array> ready to be passed to `new Response(stream)`
   */
  async chat(
    history: ChatMessage[],
    message: string
  ): Promise<ReadableStream<Uint8Array>> {
    return this.provider.chatStream({
      systemPrompt: this.systemPrompt,
      temperature:  this.temperature,
      history,
      message,
    });
  }
}
