/**
 * Chunk Repository
 *
 * Manages pre-computed text chunks for knowledge sources.
 * saveChunks() bulk-inserts all chunks and updates the source's chunkCount atomically.
 */

import { asc, eq } from "drizzle-orm";
import { getDb, knowledgeChunks, knowledgeSources } from "../db";

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface ChunkData {
  chunkIndex: number;
  content:    string;
  tokenCount: number;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function generateId(): string {
  return `ck_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

/* ─── Repository ──────────────────────────────────────────────────────────── */

export const chunkRepository = {
  /**
   * Bulk-insert chunks and update the source's chunkCount.
   * Replaces any existing chunks for this source first.
   */
  async saveChunks(knowledgeSourceId: string, chunks: ChunkData[]): Promise<void> {
    const db  = getDb();
    const now = new Date();

    // Delete existing chunks (idempotent — safe to call on re-chunk)
    await db
      .delete(knowledgeChunks)
      .where(eq(knowledgeChunks.knowledgeSourceId, knowledgeSourceId));

    if (chunks.length > 0) {
      // Bulk insert
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

    // Update chunkCount on the source row
    await db
      .update(knowledgeSources)
      .set({ chunkCount: chunks.length })
      .where(eq(knowledgeSources.id, knowledgeSourceId));
  },

  /** Retrieve all chunks for a source in document order */
  async findBySourceId(knowledgeSourceId: string): Promise<ChunkData[]> {
    const db   = getDb();
    const rows = await db
      .select({
        chunkIndex: knowledgeChunks.chunkIndex,
        content:    knowledgeChunks.content,
        tokenCount: knowledgeChunks.tokenCount,
      })
      .from(knowledgeChunks)
      .where(eq(knowledgeChunks.knowledgeSourceId, knowledgeSourceId))
      .orderBy(asc(knowledgeChunks.chunkIndex));

    return rows;
  },

  /** Hard delete — called before deleting the parent knowledge source */
  async deleteBySourceId(knowledgeSourceId: string): Promise<void> {
    const db = getDb();
    await db
      .delete(knowledgeChunks)
      .where(eq(knowledgeChunks.knowledgeSourceId, knowledgeSourceId));
  },
};
