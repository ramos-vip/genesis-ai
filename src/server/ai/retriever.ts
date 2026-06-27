/**
 * Retrieval Engine
 *
 * Implements semantic retrieval over stored chunk embeddings using
 * cosine similarity computed in JavaScript.
 *
 * MVP strategy: load all candidate embeddings from PostgreSQL, parse JSON,
 * score with cosine similarity, return top-N.
 *
 * pgvector migration path (drop-in replacement):
 *   1. Enable pgvector extension in Neon
 *   2. Migrate embedding column: ALTER TABLE … TYPE vector(768) USING …::vector
 *   3. Replace embeddingRepository.findBySourceIds() with a single SQL query:
 *      ORDER BY embedding <-> query_vector LIMIT {limit}
 *   The Retriever interface, PromptBuilder, and all callers are UNCHANGED.
 */

import { employeeKnowledgeRepository } from "@/server/repositories/employeeKnowledgeRepository";
import { embeddingRepository }         from "@/server/repositories/embeddingRepository";
import { EmbeddingService }            from "./embeddingService";

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface RelevantChunk {
  chunkId:    string;
  content:    string;
  /** Cosine similarity score: 0 (unrelated) – 1 (identical) */
  score:      number;
  sourceId:   string;
  sourceName: string;
}

/* ─── Cosine similarity ───────────────────────────────────────────────────── */

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dot / magnitude;
}

/* ─── Retriever ───────────────────────────────────────────────────────────── */

export class TextRetriever {
  /**
   * Retrieve the most semantically relevant chunks for a query.
   *
   * @param clerkUserId - User who owns the employee (for access control)
   * @param employeeId  - Employee whose linked knowledge to search
   * @param query       - The user's current message (used as the search query)
   * @param limit       - Maximum number of chunks to return (default: 5)
   */
  async retrieve(
    clerkUserId: string,
    employeeId:  string,
    query:       string,
    limit:       number = 5
  ): Promise<RelevantChunk[]> {
    /* ── 1. Resolve linked knowledge source IDs ── */
    const linkedSources = await employeeKnowledgeRepository.getLinked(
      clerkUserId,
      employeeId
    );
    const sourceIds = linkedSources
      .filter((s) => s.status === "ready")
      .map((s) => s.id as string);

    if (sourceIds.length === 0) return [];

    /* ── 2. Load candidate embeddings (chunk content + JSON vector) ── */
    const candidates = await embeddingRepository.findBySourceIds(sourceIds);
    if (candidates.length === 0) return [];

    /* ── 3. Embed the query ── */
    const embeddingService = new EmbeddingService();
    const queryVector      = await embeddingService.embed(query);

    /* ── 4. Score each candidate with cosine similarity ── */
    const scored: RelevantChunk[] = [];

    for (const candidate of candidates) {
      let embeddingValues: number[];
      try {
        embeddingValues = JSON.parse(candidate.embeddingJson) as number[];
      } catch {
        continue; // skip corrupted rows
      }

      const score = cosineSimilarity(queryVector, embeddingValues);
      if (score <= 0) continue; // skip irrelevant chunks

      scored.push({
        chunkId:    candidate.chunkId,
        content:    candidate.content,
        score,
        sourceId:   candidate.knowledgeSourceId,
        sourceName: candidate.sourceName,
      });
    }

    /* ── 5. Sort by relevance descending, return top-N ── */
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }
}
