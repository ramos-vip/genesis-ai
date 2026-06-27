import type { ChatMessage } from "./provider";

/**
 * The fully-assembled prompt handed to a provider.
 *
 * Prompt assembly order (matches Gemini's native turn structure):
 *   1. systemInstruction — employee instructions + role context
 *   2. history           — prior conversation turns, oldest first
 *   3. message           — the current user message
 *
 * Future Knowledge sprint: retrieved RAG chunks are injected into
 * systemInstruction (between instructions and role) — no other file changes.
 */
export interface BuiltPrompt {
  systemInstruction: string;
  history:           ChatMessage[];
  message:           string;
}

interface PromptBuilderInput {
  /** From employee.config.systemInstructions — may be empty */
  systemInstructions: string;
  /** From employee.role — e.g. "support", "sales" */
  role:               string;
  /** From employee.name — used in default fallback */
  name:               string;
  /** Prior conversation turns, oldest first */
  history:            ChatMessage[];
  /** Current user message */
  message:            string;
}

/**
 * PromptBuilder — single source of truth for how prompts are assembled.
 *
 * All prompt composition lives here. Providers receive only the final
 * BuiltPrompt; they are never aware of employee data or business rules.
 */
export class PromptBuilder {
  build(input: PromptBuilderInput): BuiltPrompt {
    return {
      systemInstruction: this.assembleSystemInstruction(input),
      history:           input.history,
      message:           input.message,
    };
  }

  /**
   * Assemble the system instruction in the required order:
   *
   *   1. Employee System Instructions
   *      (custom instructions, or default if empty)
   *   2. Employee Role
   *      (always appended so the model stays on-task)
   *
   * Knowledge context will be injected here as step 1.5 in the RAG sprint.
   */
  private assembleSystemInstruction(input: PromptBuilderInput): string {
    const sections: string[] = [];

    // ── 1. Employee System Instructions ──────────────────────────────────
    const customInstructions = input.systemInstructions.trim();
    if (customInstructions) {
      sections.push(customInstructions);
    } else {
      sections.push(
        `You are ${input.name}, an AI ${input.role} specialist. ` +
        `Be helpful, professional, and focused on ${input.role} tasks. ` +
        `Keep responses concise and actionable.`
      );
    }

    // ── 2. Employee Role ──────────────────────────────────────────────────
    sections.push(`Role: ${input.role}`);

    return sections.join("\n\n");
  }
}
