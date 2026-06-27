/**
 * Knowledge Repository
 *
 * Security contract: every query includes `clerkUserId` in the WHERE clause.
 * `meta` is stored as a JSON string and parsed by the mapper.
 */

import { and, desc, eq } from "drizzle-orm";
import { getDb, knowledgeSources } from "../db";
import { toId } from "@/shared/types";
import type {
  KnowledgeSource,
  KnowledgeSourceType,
  KnowledgeSourceStatus,
  KnowledgeMeta,
  TextMeta,
} from "@/modules/knowledge/types";
import type { CreateKnowledgeSourceInput } from "../validation/knowledge";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function generateId(): string {
  return `kn_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

function buildMeta(dto: CreateKnowledgeSourceInput): KnowledgeMeta {
  switch (dto.type) {
    case "text":
      return {
        content:   dto.content,
        wordCount: dto.content.trim().split(/\s+/).length,
      } satisfies TextMeta;
    case "url":
      return { url: dto.url };
    case "pdf":
      return { fileName: dto.fileName, fileSize: dto.fileSize, pageCount: dto.pageCount };
  }
}

function rowToKnowledgeSource(row: typeof knowledgeSources.$inferSelect): KnowledgeSource {
  let meta: KnowledgeMeta;
  try {
    meta = JSON.parse(row.meta) as KnowledgeMeta;
  } catch {
    meta = { content: "", wordCount: 0 } satisfies TextMeta;
  }

  return {
    id:         toId(row.id),
    name:       row.name,
    type:       row.type as KnowledgeSourceType,
    status:     row.status as KnowledgeSourceStatus,
    meta,
    chunkCount: row.chunkCount ?? undefined,
    createdAt:  row.createdAt.toISOString() as KnowledgeSource["createdAt"],
    updatedAt:  row.updatedAt.toISOString() as KnowledgeSource["updatedAt"],
  };
}

/* ─── Repository ──────────────────────────────────────────────────────────── */

export const knowledgeRepository = {
  async findAll(clerkUserId: string): Promise<KnowledgeSource[]> {
    const db   = getDb();
    const rows = await db
      .select()
      .from(knowledgeSources)
      .where(eq(knowledgeSources.clerkUserId, clerkUserId))
      .orderBy(desc(knowledgeSources.createdAt));

    return rows.map(rowToKnowledgeSource);
  },

  async findById(clerkUserId: string, id: string): Promise<KnowledgeSource | null> {
    const db   = getDb();
    const rows = await db
      .select()
      .from(knowledgeSources)
      .where(
        and(eq(knowledgeSources.id, id), eq(knowledgeSources.clerkUserId, clerkUserId))
      )
      .limit(1);

    return rows.length > 0 ? rowToKnowledgeSource(rows[0]) : null;
  },

  async create(clerkUserId: string, dto: CreateKnowledgeSourceInput): Promise<KnowledgeSource> {
    const db   = getDb();
    const id   = generateId();
    const now  = new Date();
    const meta = buildMeta(dto);

    const rows = await db
      .insert(knowledgeSources)
      .values({
        id,
        clerkUserId,
        name:   dto.name,
        type:   dto.type,
        status: "ready",
        meta:   JSON.stringify(meta),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (rows.length === 0) throw new Error("Failed to insert knowledge source");
    return rowToKnowledgeSource(rows[0]);
  },

  async delete(clerkUserId: string, id: string): Promise<void> {
    const db = getDb();

    const result = await db
      .delete(knowledgeSources)
      .where(
        and(eq(knowledgeSources.id, id), eq(knowledgeSources.clerkUserId, clerkUserId))
      )
      .returning({ id: knowledgeSources.id });

    if (result.length === 0) throw new Error("Knowledge source not found or access denied");
  },
};
