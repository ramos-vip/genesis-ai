/**
 * Employee–Knowledge Repository
 *
 * Manages the many-to-many relationship between employees and knowledge sources.
 * Security: every query filters by clerkUserId — ownership is verified on every
 * operation without trusting the caller to supply IDs from the right user.
 */

import { and, desc, eq, notInArray } from "drizzle-orm";
import { getDb, employeeKnowledgeSources, knowledgeSources } from "../db";
import { toId } from "@/shared/types";
import type {
  KnowledgeSource,
  KnowledgeSourceType,
  KnowledgeSourceStatus,
  KnowledgeMeta,
  TextMeta,
} from "@/modules/knowledge/types";

/* ─── Row mapper (mirrors knowledgeRepository.rowToKnowledgeSource) ───────── */

function rowToSource(row: typeof knowledgeSources.$inferSelect): KnowledgeSource {
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

export const employeeKnowledgeRepository = {
  /** All knowledge sources currently linked to an employee, newest-linked first */
  async getLinked(clerkUserId: string, employeeId: string): Promise<KnowledgeSource[]> {
    const db = getDb();

    const rows = await db
      .select({
        id:          knowledgeSources.id,
        clerkUserId: knowledgeSources.clerkUserId,
        name:        knowledgeSources.name,
        type:        knowledgeSources.type,
        status:      knowledgeSources.status,
        meta:        knowledgeSources.meta,
        chunkCount:  knowledgeSources.chunkCount,
        createdAt:   knowledgeSources.createdAt,
        updatedAt:   knowledgeSources.updatedAt,
      })
      .from(employeeKnowledgeSources)
      .innerJoin(
        knowledgeSources,
        eq(employeeKnowledgeSources.knowledgeSourceId, knowledgeSources.id)
      )
      .where(
        and(
          eq(employeeKnowledgeSources.employeeId, employeeId),
          eq(employeeKnowledgeSources.clerkUserId, clerkUserId)
        )
      )
      .orderBy(desc(employeeKnowledgeSources.linkedAt));

    return rows.map(rowToSource);
  },

  /** All knowledge sources the user owns that are NOT yet linked to this employee */
  async getAvailable(clerkUserId: string, employeeId: string): Promise<KnowledgeSource[]> {
    const db = getDb();

    // Step 1: get IDs already linked to this employee
    const linkedRows = await db
      .select({ id: employeeKnowledgeSources.knowledgeSourceId })
      .from(employeeKnowledgeSources)
      .where(eq(employeeKnowledgeSources.employeeId, employeeId));

    const linkedIds = linkedRows.map((r) => r.id);

    // Step 2: all user's sources minus linked ones
    const rows =
      linkedIds.length === 0
        ? await db
            .select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.clerkUserId, clerkUserId))
            .orderBy(desc(knowledgeSources.createdAt))
        : await db
            .select()
            .from(knowledgeSources)
            .where(
              and(
                eq(knowledgeSources.clerkUserId, clerkUserId),
                notInArray(knowledgeSources.id, linkedIds)
              )
            )
            .orderBy(desc(knowledgeSources.createdAt));

    return rows.map(rowToSource);
  },

  /** Create a link between an employee and a knowledge source */
  async link(clerkUserId: string, employeeId: string, knowledgeSourceId: string): Promise<void> {
    const db = getDb();

    await db
      .insert(employeeKnowledgeSources)
      .values({ employeeId, knowledgeSourceId, clerkUserId })
      .onConflictDoNothing(); // idempotent — safe to call twice
  },

  /** Remove the link between an employee and a knowledge source */
  async unlink(clerkUserId: string, employeeId: string, knowledgeSourceId: string): Promise<void> {
    const db = getDb();

    await db
      .delete(employeeKnowledgeSources)
      .where(
        and(
          eq(employeeKnowledgeSources.employeeId, employeeId),
          eq(employeeKnowledgeSources.knowledgeSourceId, knowledgeSourceId),
          eq(employeeKnowledgeSources.clerkUserId, clerkUserId)
        )
      );
  },
};
