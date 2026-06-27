/**
 * AI Provider interface — the contract every AI backend must satisfy.
 *
 * Adding a new provider (OpenAI, Anthropic, etc.):
 *   1. Create a new class implementing AIProvider
 *   2. Add a case in AIRouter.resolveProvider()
 *   3. Add the required env vars
 *
 * The Route Handler and AIRouter.chat() signature never change.
 */

export interface ChatMessage {
  role:    "user" | "model";
  content: string;
}

/**
 * The assembled prompt produced by PromptBuilder.
 * Re-exported here so providers import from one place.
 */
export type { BuiltPrompt } from "./promptBuilder";

/**
 * Options passed to every provider's chatStream method.
 *
 * `prompt` is the fully-assembled BuiltPrompt from PromptBuilder —
 * providers must not add or modify prompt content; they only configure
 * generation parameters (temperature, maxOutputTokens).
 */
export interface ChatOptions {
  /** Fully assembled prompt — produced by PromptBuilder, not by the provider */
  prompt:           import("./promptBuilder").BuiltPrompt;
  /** 0.0 (precise) – 1.0 (creative) — sourced from EmployeeConfig */
  temperature:      number;
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
   * Throws if the provider is misconfigured or the upstream API fails.
   */
  chatStream(options: ChatOptions): Promise<ReadableStream<Uint8Array>>;
}
