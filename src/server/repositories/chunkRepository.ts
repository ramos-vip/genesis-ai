/**
 * Chunk Repository
 *
 * Manages pre-computed text chunks for knowledge sources.
 */

import { asc, eq } from "drizzle-orm";
import { getDb, knowledgeChunks, knowledgeSources } from "../db";

/* ─── Types ───────────────────────────────────────────────────────────────── */

/** Input shape used when inserting chunks */
export interface ChunkData {
  chunkIndex: number;
  content:    string;
  tokenCount: number;
}

/** Full chunk record as retrieved from the database — includes the row id */
export interface ChunkRecord extends ChunkData {
  id: string;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function generateId(): string {
  return `ck_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

/* ─── Repository ──────────────────────────────────────────────────────────── */

export const chunkRepository = {
  /**
   * Bulk-insert chunks and update the source's chunkCount.
   * Replaces any existing chunks for this source first (idempotent).
   */
  async saveChunks(knowledgeSourceId: string, chunks: ChunkData[]): Promise<void> {
    const db  = getDb();
    const now = new Date();

    await db
      .delete(knowledgeChunks)
      .where(eq(knowledgeChunks.knowledgeSourceId, knowledgeSourceId));

    if (chunks.length > 0) {
      await db.insert(knowledgeChunks).values(
        chunks.map((c) => ({
          id:                generateId(),
          knowledgeSourceId,
          chunkIndex:        c.chunkIndex,
          content:           c.content,
          tokenCount:        c.tokenCount,
          createdAt:         now,
        }))
      );
    }

    await db
      .update(knowledgeSources)
      .set({ chunkCount: chunks.length })
      .where(eq(knowledgeSources.id, knowledgeSourceId));
  },

  /**
   * All chunks for a source in document order — includes `id` so callers
   * can reference individual chunks (e.g. for embedding storage).
   */
  async findBySourceId(knowledgeSourceId: string): Promise<ChunkRecord[]> {
    const db   = getDb();
    const rows = await db
      .select({
        id:         knowledgeChunks.id,
        chunkIndex: knowledgeChunks.chunkIndex,
        content:    knowledgeChunks.content,
        tokenCount: knowledgeChunks.tokenCount,
      })
      .from(knowledgeChunks)
      .where(eq(knowledgeChunks.knowledgeSourceId, knowledgeSourceId))
      .orderBy(asc(knowledgeChunks.chunkIndex));

    return rows;
  },

  /** Hard delete — call before deleting the parent knowledge source */
  async deleteBySourceId(knowledgeSourceId: string): Promise<void> {
    const db = getDb();
    await db
      .delete(knowledgeChunks)
      .where(eq(knowledgeChunks.knowledgeSourceId, knowledgeSourceId));
  },
};
