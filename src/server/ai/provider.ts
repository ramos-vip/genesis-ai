/**
 * AI Provider interface — the contract every AI backend must satisfy.
 *
 * Adding a new provider (OpenAI, Anthropic, etc.):
 *   1. Create a new class implementing AIProvider
 *   2. Add a case in AIRouter.resolveProvider()
 *   3. Add the required env vars
 *
 * The Route Handler and AIRouter never change.
 */

export interface ChatMessage {
  role:    "user" | "model";
  content: string;
}

export interface ChatOptions {
  /** Fully-resolved system prompt (already merged with employee defaults) */
  systemPrompt:     string;
  /** 0.0 (precise) – 1.0 (creative) — sourced from EmployeeConfig */
  temperature:      number;
  /** Conversation turns BEFORE the current message — oldest first */
  history:          ChatMessage[];
  /** The current user message to respond to */
  message:          string;
  /** Provider-level output cap (default chosen by each provider) */
  maxOutputTokens?: number;
}

export interface AIProvider {
  /** Human-readable identifier — used in logs and error messages */
  readonly name: string;

  /**
   * Stream a chat completion.
   *
   * Returns a ReadableStream of UTF-8 encoded text chunks.
   * The stream is fully compatible with `new Response(stream)`.
   * Throws if the provider is misconfigured or the upstream API fails.
   */
  chatStream(options: ChatOptions): Promise<ReadableStream<Uint8Array>>;
}
