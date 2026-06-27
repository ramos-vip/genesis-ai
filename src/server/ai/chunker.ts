/**
 * Chunking Engine
 *
 * Splits text knowledge sources into fixed-size overlapping chunks
 * for storage and future vector search (RAG sprint).
 *
 * Chunking parameters:
 *   ~500 tokens per chunk  → CHUNK_CHARS = 2000 (4 chars ≈ 1 token, English prose)
 *   ~100 token overlap     → OVERLAP_CHARS = 400
 *   stride                 → CHUNK_CHARS - OVERLAP_CHARS = 1600 chars
 *
 * PDF and URL chunking are stubbed — content extraction is pending.
 */

import { chunkRepository } from "@/server/repositories/chunkRepository";
import type { KnowledgeSource, TextMeta } from "@/modules/knowledge/types";

const CHUNK_CHARS   = 2000; // target chunk size in characters
const OVERLAP_CHARS = 400;  // overlap between consecutive chunks
const STRIDE        = CHUNK_CHARS - OVERLAP_CHARS; // 1600 chars

/* ─── Text splitter ───────────────────────────────────────────────────────── */

/**
 * Split text into overlapping chunks, cutting at word boundaries.
 *
 * Sliding window advances by STRIDE characters each iteration.
 * At each window boundary, we scan up to 50 chars backward for
 * the nearest whitespace to avoid splitting mid-word.
 */
function splitText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  if (normalized.length <= CHUNK_CHARS) return [normalized];

  const chunks: string[] = [];
  let pos = 0;

  while (pos < normalized.length) {
    const rawEnd = Math.min(pos + CHUNK_CHARS, normalized.length);

    // Snap to word boundary if not at text end
    let end = rawEnd;
    if (rawEnd < normalized.length) {
      // Scan back up to 50 chars for a space or newline
      const scanStart = Math.max(pos, rawEnd - 50);
      const prevBreak = normalized.lastIndexOf(" ", rawEnd);
      const prevNewline = normalized.lastIndexOf("\n", rawEnd);
      const boundary = Math.max(prevBreak, prevNewline);

      if (boundary > scanStart) {
        end = boundary + 1; // include the space/newline character
      }
    }

    const chunk = normalized.slice(pos, end).trim();
    if (chunk) chunks.push(chunk);

    // Advance by stride; if stride would push past end, stop
    pos += STRIDE;
    if (pos >= normalized.length) break;
  }

  return chunks;
}

/**
 * Estimate token count using the 4-chars-per-token approximation.
 * Accurate enough for English prose; will be replaced with a real
 * tokeniser when embeddings are introduced.
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/* ─── Pipeline ────────────────────────────────────────────────────────────── */

export class ChunkingPipeline {
  /**
   * Chunk a knowledge source and persist the result.
   * PDF and URL sources are stubbed (extraction pending).
   */
  async process(source: KnowledgeSource): Promise<void> {
    switch (source.type) {
      case "text":
        await this.processText(source);
        break;

      case "url":
        console.log(
          `[chunker] Source "${source.name}" (URL) skipped — web crawling pending.`
        );
        break;

      case "pdf":
        console.log(
          `[chunker] Source "${source.name}" (PDF) skipped — text extraction pending.`
        );
        break;
    }
  }

  private async processText(source: KnowledgeSource): Promise<void> {
    const meta        = source.meta as TextMeta;
    const rawChunks   = splitText(meta.content);

    const chunkData = rawChunks.map((content, chunkIndex) => ({
      chunkIndex,
      content,
      tokenCount: estimateTokens(content),
    }));

    await chunkRepository.saveChunks(source.id, chunkData);

    console.log(
      `[chunker] "${source.name}" → ${chunkData.length} chunk(s), ` +
      `${chunkData.reduce((s, c) => s + c.tokenCount, 0)} total estimated tokens.`
    );
  }
}
