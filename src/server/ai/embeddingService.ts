/**
 * Embedding Service
 *
 * Generates dense vector embeddings for knowledge chunks using the Gemini
 * embedding API and persists them via embeddingRepository.
 *
 * Model: text-embedding-004 (768 dimensions, RETRIEVAL_DOCUMENT task type)
 * Override: set GEMINI_EMBEDDING_MODEL in .env.local
 *
 * No vector search yet — embeddings are stored for the upcoming RAG sprint.
 * Re-processing a source is safe: upsert overwrites existing embeddings.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { chunkRepository }    from "@/server/repositories/chunkRepository";
import { embeddingRepository } from "@/server/repositories/embeddingRepository";

const DEFAULT_MODEL = "text-embedding-004";

export class EmbeddingService {
  private readonly apiKey:    string;
  private readonly modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. " +
        "Add it to .env.local to enable embedding generation."
      );
    }
    this.apiKey    = apiKey;
    this.modelName = process.env.GEMINI_EMBEDDING_MODEL ?? DEFAULT_MODEL;
  }

  /**
   * Generate a single embedding vector for the given text.
   * Returns a float array (the raw embedding values).
   */
  async embed(text: string): Promise<number[]> {
    const genAI  = new GoogleGenerativeAI(this.apiKey);
    const model  = genAI.getGenerativeModel({ model: this.modelName });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  /**
   * Generate and persist embeddings for every chunk of a knowledge source.
   *
   * Processes chunks sequentially to stay within API rate limits.
   * A failed chunk is logged and skipped — other chunks continue.
   * Re-processing is idempotent: existing embeddings are overwritten.
   */
  async generateForSource(knowledgeSourceId: string): Promise<void> {
    const chunks = await chunkRepository.findBySourceId(knowledgeSourceId);

    if (chunks.length === 0) {
      console.log(`[embedding] No chunks found for source ${knowledgeSourceId} — skipping.`);
      return;
    }

    let successCount = 0;

    for (const chunk of chunks) {
      try {
        const values = await this.embed(chunk.content);
        await embeddingRepository.upsert(chunk.id, values, this.modelName);
        successCount++;
      } catch (err) {
        console.error(
          `[embedding] Failed for chunk ${chunk.id} (index ${chunk.chunkIndex}):`,
          err instanceof Error ? err.message : err
        );
      }
    }

    console.log(
      `[embedding] Source ${knowledgeSourceId}: ` +
      `${successCount}/${chunks.length} chunks embedded (model: ${this.modelName}).`
    );
  }
}
