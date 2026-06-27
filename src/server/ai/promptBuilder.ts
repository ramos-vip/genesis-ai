import { TextRetriever } from "./retriever";
import type { RelevantChunk } from "./retriever";
import type { ChatMessage } from "./provider";

/**
 * The fully-assembled prompt handed to a provider.
 *
 * Assembly order:
 *   1. systemInstruction — system instructions + retrieved knowledge + role
 *   2. history           — prior conversation turns, oldest first
 *   3. message           — the current user message
 */
export interface BuiltPrompt {
  systemInstruction: string;
  history:           ChatMessage[];
  message:           string;
}

export interface PromptBuilderInput {
  systemInstructions: string;
  role:               string;
  name:               string;
  employeeId:         string;
  clerkUserId:        string;
  history:            ChatMessage[];
  message:            string;
}

/**
 * PromptBuilder — single source of truth for prompt assembly.
 *
 * Assembly order:
 *   1. Employee System Instructions
 *   2. Retrieved Knowledge Context  (top-N semantically relevant chunks)
 *   3. Employee Role
 *
 * Knowledge injection uses semantic retrieval (cosine similarity over
 * stored embeddings) rather than dumping all linked source content.
 * This keeps the context window focused on what is actually relevant.
 *
 * Providers receive only the final BuiltPrompt.
 */
export class PromptBuilder {
  async build(input: PromptBuilderInput): Promise<BuiltPrompt> {
    const chunks = await this.retrieveKnowledge(input);

    return {
      systemInstruction: this.assembleSystemInstruction(input, chunks),
      history:           input.history,
      message:           input.message,
    };
  }

  /* ─── System instruction assembly ──────────────────────────────────────── */

  private assembleSystemInstruction(
    input:  PromptBuilderInput,
    chunks: RelevantChunk[]
  ): string {
    const sections: string[] = [];

    // ── 1. Employee System Instructions ──────────────────────────────────
    const custom = input.systemInstructions.trim();
    sections.push(
      custom ||
      `You are ${input.name}, an AI ${input.role} specialist. ` +
      `Be helpful, professional, and focused on ${input.role} tasks. ` +
      `Keep responses concise and actionable.`
    );

    // ── 2. Retrieved Knowledge Context ───────────────────────────────────
    if (chunks.length > 0) {
      sections.push(this.buildKnowledgeContext(chunks));
    }

    // ── 3. Employee Role ──────────────────────────────────────────────────
    sections.push(`Role: ${input.role}`);

    return sections.join("\n\n");
  }

  /* ─── Knowledge context formatter ──────────────────────────────────────── */

  /**
   * Formats semantically retrieved chunks into the knowledge block.
   *
   *   === KNOWLEDGE ===
   *
   *   Source: Product FAQ  (relevance: 0.91)
   *
   *   ...chunk content...
   *
   *   Source: Help Center  (relevance: 0.84)
   *
   *   ...chunk content...
   *
   *   ==================
   */
  private buildKnowledgeContext(chunks: RelevantChunk[]): string {
    const lines: string[] = ["=== KNOWLEDGE ==="];

    for (const chunk of chunks) {
      lines.push("");
      lines.push(`Source: ${chunk.sourceName}  (relevance: ${chunk.score.toFixed(2)})`);
      lines.push("");
      lines.push(chunk.content);
    }

    lines.push("");
    lines.push("==================");
    return lines.join("\n");
  }

  /* ─── Retrieval ─────────────────────────────────────────────────────────── */

  private async retrieveKnowledge(input: PromptBuilderInput): Promise<RelevantChunk[]> {
    try {
      const retriever = new TextRetriever();
      return await retriever.retrieve(
        input.clerkUserId,
        input.employeeId,
        input.message,
        5 // top-5 chunks
      );
    } catch {
      // Retrieval failure must never break the chat flow
      return [];
    }
  }
}
