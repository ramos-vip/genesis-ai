/**
 * AI layer — server-only exports.
 *
 * Import from "@/server/ai" in Route Handlers and Server Actions.
 * Never import in Client Components.
 */

export type { AIProvider, ChatMessage, ChatOptions } from "./provider";
export type { BuiltPrompt }                          from "./promptBuilder";
export { PromptBuilder }                             from "./promptBuilder";
export type { RelevantChunk }                        from "./retriever";
export { TextRetriever }                             from "./retriever";
export { GeminiProvider }                            from "./gemini";
export { AIRouter }                                  from "./router";
