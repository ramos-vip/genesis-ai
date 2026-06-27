/**
 * Embedding Repository
 *
 * Stores one embedding vector per knowledge chunk.
 * The embedding column is a JSON float array today; a future migration
 * will change it to PostgreSQL vector(N) once pgvector is enabled.
 */

import { eq, inArray } from "drizzle-orm";
import { getDb, knowledgeEmbeddings } from "../db";
import { chunkRepository } from "./chunkRepository";

export const embeddingRepository = {
  /**
   * Upsert an embedding for a chunk.
   * If a row already exists for this chunkId it is overwritten — safe for re-processing.
   *
   * @param chunkId   - Row ID from knowledge_chunks
   * @param values    - Raw float array from the embedding model
   * @param model     - Model identifier, e.g. "text-embedding-004"
   */
  async upsert(chunkId: string, values: number[], model: string): Promise<void> {
    const db = getDb();

    await db
      .insert(knowledgeEmbeddings)
      .values({
        chunkId,
        embedding:  JSON.stringify(values),
        model,
        dimensions: values.length,
        createdAt:  new Date(),
      })
      .onConflictDoUpdate({
        target: knowledgeEmbeddings.chunkId,
        set: {
          embedding:  JSON.stringify(values),
          model,
          dimensions: values.length,
          createdAt:  new Date(),
        },
      });
  },

  /**
   * Delete all embeddings for a knowledge source.
   * Resolves chunk IDs internally — callers only need the source ID.
   * Call before chunkRepository.deleteBySourceId() to avoid orphaned lookups.
   */
  async deleteBySourceId(knowledgeSourceId: string): Promise<void> {
    const db     = getDb();
    const chunks = await chunkRepository.findBySourceId(knowledgeSourceId);

    if (chunks.length === 0) return;

    const chunkIds = chunks.map((c) => c.id);
    await db
      .delete(knowledgeEmbeddings)
      .where(inArray(knowledgeEmbeddings.chunkId, chunkIds));
  },
};
