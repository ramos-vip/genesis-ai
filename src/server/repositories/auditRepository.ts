/**
 * Audit & Activity Repository (EPIC-009)
 *
 * `record` writes the immutable audit trail (who / what / when / before / after
 * / ip / user-agent). `logActivity` writes the human-readable feed. Both are
 * append-only.
 */

import { and, desc, eq } from "drizzle-orm";
import { getDb, auditLogs, activityLogs } from "../db";
import type { ActivityLogRow, AuditLogRow } from "../db";
import { createId } from "../db/ids";
import { parseJson } from "../db/json";
import { toId } from "@/shared/types";
import type { ISODate } from "@/shared/types";
import type { ActivityCategory, ActivityLog, AuditLog } from "@/modules/organizations/types";

export interface RecordAuditInput {
  orgId:            string;
  actorClerkUserId: string;
  action:           string;
  resource:         string;
  resourceId?:      string | null;
  before?:          unknown;
  after?:           unknown;
  ip?:              string | null;
  userAgent?:       string | null;
}

export interface RecordActivityInput {
  orgId:            string;
  actorClerkUserId: string;
  category:         ActivityCategory;
  verb:             string;
  summary:          string;
  targetType?:      string | null;
  targetId?:        string | null;
  metadata?:        Record<string, unknown>;
}

function rowToActivity(row: ActivityLogRow): ActivityLog {
  return {
    id:             toId(row.id),
    organizationId: toId(row.orgId),
    actorId:        toId(row.actorClerkUserId),
    category:       row.category as ActivityCategory,
    verb:           row.verb,
    targetType:     row.targetType ?? undefined,
    targetId:       row.targetId ?? undefined,
    summary:        row.summary,
    metadata:       parseJson<Record<string, unknown>>(row.metadata, {}),
    createdAt:      row.createdAt.toISOString() as ISODate,
  };
}

function rowToAudit(row: AuditLogRow): AuditLog {
  return {
    id:             toId(row.id),
    organizationId: toId(row.orgId),
    actorId:        toId(row.actorClerkUserId),
    action:         row.action,
    resource:       row.resource,
    resourceId:     row.resourceId ?? undefined,
    before:         row.before ? parseJson<unknown>(row.before, null) : undefined,
    after:          row.after ? parseJson<unknown>(row.after, null) : undefined,
    ip:             row.ip ?? undefined,
    userAgent:      row.userAgent ?? undefined,
    createdAt:      row.createdAt.toISOString() as ISODate,
  };
}

export const auditRepository = {
  async record(input: RecordAuditInput): Promise<void> {
    const db = getDb();
    await db.insert(auditLogs).values({
      id:               createId("aud"),
      orgId:            input.orgId,
      actorClerkUserId: input.actorClerkUserId,
      action:           input.action,
      resource:         input.resource,
      resourceId:       input.resourceId ?? null,
      before:           input.before === undefined ? null : JSON.stringify(input.before),
      after:            input.after === undefined ? null : JSON.stringify(input.after),
      ip:               input.ip ?? null,
      userAgent:        input.userAgent ?? null,
      createdAt:        new Date(),
    });
  },

  async logActivity(input: RecordActivityInput): Promise<void> {
    const db = getDb();
    await db.insert(activityLogs).values({
      id:               createId("act"),
      orgId:            input.orgId,
      actorClerkUserId: input.actorClerkUserId,
      category:         input.category,
      verb:             input.verb,
      targetType:       input.targetType ?? null,
      targetId:         input.targetId ?? null,
      summary:          input.summary,
      metadata:         JSON.stringify(input.metadata ?? {}),
      createdAt:        new Date(),
    });
  },

  async listActivity(
    orgId: string,
    options: { category?: ActivityCategory | "all"; limit?: number } = {}
  ): Promise<ActivityLog[]> {
    const db = getDb();
    const limit = Math.min(100, Math.max(1, options.limit ?? 30));
    const filters = [eq(activityLogs.orgId, orgId)];
    if (options.category && options.category !== "all") filters.push(eq(activityLogs.category, options.category));
    const rows = await db
      .select()
      .from(activityLogs)
      .where(and(...filters))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
    return rows.map(rowToActivity);
  },

  async listAudit(orgId: string, options: { limit?: number } = {}): Promise<AuditLog[]> {
    const db = getDb();
    const limit = Math.min(200, Math.max(1, options.limit ?? 50));
    const rows = await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.orgId, orgId))
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
    return rows.map(rowToAudit);
  },
};
