/**
 * Embedding Repository
 *
 * Stores one embedding vector per knowledge chunk.
 * The embedding column is a JSON float array today; a future migration
 * will change it to PostgreSQL vector(N) once pgvector is enabled.
 */

import { eq, inArray } from "drizzle-orm";
import { getDb, knowledgeEmbeddings, knowledgeChunks, knowledgeSources } from "../db";
import { chunkRepository } from "./chunkRepository";

/* ─── Retrieval type ──────────────────────────────────────────────────────── */

/**
 * A chunk embedding with its content and source metadata — used by the Retriever.
 * The JOIN loads everything needed for cosine similarity in a single query.
 *
 * pgvector migration: replace the JS similarity loop with:
 *   ORDER BY embedding <-> query_vector::vector LIMIT N
 * The EmbeddingWithContext shape and Retriever interface stay identical.
 */
export interface EmbeddingWithContext {
  chunkId:           string;
  /** JSON-serialized float array: "[0.12,-0.44,...]" */
  embeddingJson:     string;
  content:           string;
  knowledgeSourceId: string;
  sourceName:        string;
}

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
   * Load all embeddings for a list of knowledge source IDs.
   * Returns one row per embedded chunk, joined with chunk content and source name.
   *
   * Used by TextRetriever to build the candidate pool for cosine similarity.
   *
   * pgvector migration:
   *   Replace this method with a single SQL vector search:
   *     SELECT ... FROM knowledge_embeddings
   *     JOIN knowledge_chunks ON ...
   *     JOIN knowledge_sources ON ...
   *     WHERE knowledge_chunks.knowledge_source_id = ANY(sourceIds)
   *     ORDER BY embedding <-> $query_vector LIMIT $limit
   *   The Retriever interface and PromptBuilder are unchanged.
   */
  async findBySourceIds(knowledgeSourceIds: string[]): Promise<EmbeddingWithContext[]> {
    if (knowledgeSourceIds.length === 0) return [];

    const db = getDb();
    const rows = await db
      .select({
        chunkId:           knowledgeEmbeddings.chunkId,
        embeddingJson:     knowledgeEmbeddings.embedding,
        content:           knowledgeChunks.content,
        knowledgeSourceId: knowledgeChunks.knowledgeSourceId,
        sourceName:        knowledgeSources.name,
      })
      .from(knowledgeEmbeddings)
      .innerJoin(
        knowledgeChunks,
        eq(knowledgeEmbeddings.chunkId, knowledgeChunks.id)
      )
      .innerJoin(
        knowledgeSources,
        eq(knowledgeChunks.knowledgeSourceId, knowledgeSources.id)
      )
      .where(inArray(knowledgeChunks.knowledgeSourceId, knowledgeSourceIds));

    return rows;
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
