import { employeeKnowledgeRepository } from "@/server/repositories/employeeKnowledgeRepository";
import type { KnowledgeSource, TextMeta, UrlMeta, PdfMeta } from "@/modules/knowledge/types";
import type { ChatMessage } from "./provider";

/**
 * The fully-assembled prompt handed to a provider.
 *
 * Assembly order:
 *   1. systemInstruction — system instructions + knowledge context + role
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
  /** Used to load linked knowledge sources */
  employeeId:         string;
  /** clerkUserId — equals employee.organizationId until multi-tenancy is added */
  clerkUserId:        string;
  history:            ChatMessage[];
  message:            string;
}

/**
 * PromptBuilder — single source of truth for prompt assembly.
 *
 * Assembles the system instruction in this order:
 *   1. Employee System Instructions (custom, or auto-generated fallback)
 *   2. Knowledge Context            (linked sources — this sprint)
 *   3. Employee Role
 *
 * Providers receive only the final BuiltPrompt.
 * Future RAG sprint: replace full content with retrieved chunks — no other file changes.
 */
export class PromptBuilder {
  async build(input: PromptBuilderInput): Promise<BuiltPrompt> {
    const sources = await this.loadKnowledge(input.clerkUserId, input.employeeId);

    return {
      systemInstruction: this.assembleSystemInstruction(input, sources),
      history:           input.history,
      message:           input.message,
    };
  }

  /* ─── System instruction assembly ──────────────────────────────────────── */

  private assembleSystemInstruction(
    input:   PromptBuilderInput,
    sources: KnowledgeSource[]
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

    // ── 2. Knowledge Context ──────────────────────────────────────────────
    const readySources = sources.filter((s) => s.status === "ready");
    if (readySources.length > 0) {
      sections.push(this.buildKnowledgeContext(readySources));
    }

    // ── 3. Employee Role ──────────────────────────────────────────────────
    sections.push(`Role: ${input.role}`);

    return sections.join("\n\n");
  }

  /* ─── Knowledge context formatter ──────────────────────────────────────── */

  /**
   * Formats linked knowledge sources into the required block:
   *
   *   === KNOWLEDGE ===
   *
   *   Source: [Name]
   *   Type: [Text|URL|PDF]
   *
   *   Content...
   *
   *   ==================
   */
  private buildKnowledgeContext(sources: KnowledgeSource[]): string {
    const lines: string[] = ["=== KNOWLEDGE ==="];

    for (const source of sources) {
      lines.push("");
      lines.push(`Source: ${source.name}`);
      lines.push(`Type: ${this.typeLabel(source.type)}`);
      lines.push("");

      switch (source.type) {
        case "text": {
          const meta = source.meta as TextMeta;
          lines.push(meta.content);
          break;
        }
        case "url": {
          const meta = source.meta as UrlMeta;
          lines.push(`Reference: ${meta.url}`);
          lines.push("(Content not yet fetched — web crawling is pending.)");
          break;
        }
        case "pdf": {
          const meta = source.meta as PdfMeta;
          lines.push(`File: ${meta.fileName}`);
          if (meta.pageCount) lines.push(`Pages: ${meta.pageCount}`);
          lines.push("(Full text extraction is pending.)");
          break;
        }
      }
    }

    lines.push("");
    lines.push("==================");
    return lines.join("\n");
  }

  private typeLabel(type: KnowledgeSource["type"]): string {
    return { text: "Text", url: "URL", pdf: "PDF" }[type];
  }

  /* ─── Data loading ──────────────────────────────────────────────────────── */

  private async loadKnowledge(
    clerkUserId: string,
    employeeId:  string
  ): Promise<KnowledgeSource[]> {
    try {
      return await employeeKnowledgeRepository.getLinked(clerkUserId, employeeId);
    } catch {
      // Knowledge loading must never break the chat flow
      return [];
    }
  }
}
