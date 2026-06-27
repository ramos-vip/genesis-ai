"use server";

import { auth }  from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  employees,
  knowledgeSources,
  employeeKnowledgeSources,
  conversations,
  conversationMessages,
} from "@/server/db/schema";
import { getDb } from "@/server/db";

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface DashboardStats {
  employeeCount:     number;
  knowledgeCount:    number;
  conversationCount: number;
  messageCount:      number;
  /** Estimated tokens — messageCount × avg 650 tokens/exchange */
  estimatedTokens:   number;
  /** Estimated cost in USD — based on Gemini Flash blended rate */
  estimatedCostUsd:  number;
}

export type ActivityType =
  | "employee_created"
  | "knowledge_added"
  | "conversation_started"
  | "knowledge_linked";

export interface ActivityEvent {
  id:        string;
  type:      ActivityType;
  label:     string;
  meta:      string;
  timestamp: string; // ISO date
}

export interface DashboardData {
  stats:    DashboardStats;
  activity: ActivityEvent[];
  /** First employee id for quick-linking to chat */
  firstEmployeeId: string | null;
}

/* ─── Action ──────────────────────────────────────────────────────────────── */

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

const AVG_TOKENS_PER_MESSAGE = 650;
// Gemini 2.5 Flash blended rate (output-heavy approximation): ~$0.0003 / 1K tokens
const COST_PER_TOKEN = 0.0000003;

export async function getDashboardDataAction(): Promise<DashboardData> {
  const userId = await requireUserId();
  const db     = getDb();

  /* ── Parallel count queries ── */
  const [
    empRows,
    knRows,
    convRows,
    msgRows,
    // Recent activity — 5 per source, merged+sorted in JS
    recentEmps,
    recentKn,
    recentConvs,
    recentLinks,
  ] = await Promise.all([
    db.select({ c: sql<number>`cast(count(*) as integer)` })
      .from(employees).where(eq(employees.clerkUserId, userId)),

    db.select({ c: sql<number>`cast(count(*) as integer)` })
      .from(knowledgeSources).where(eq(knowledgeSources.clerkUserId, userId)),

    db.select({ c: sql<number>`cast(count(*) as integer)` })
      .from(conversations).where(eq(conversations.clerkUserId, userId)),

    db.select({ c: sql<number>`cast(count(*) as integer)` })
      .from(conversationMessages)
      .innerJoin(conversations, eq(conversationMessages.conversationId, conversations.id))
      .where(and(eq(conversations.clerkUserId, userId), eq(conversationMessages.role, "model"))),

    // Recent employees
    db.select({ id: employees.id, name: employees.name, role: employees.role, ts: employees.createdAt })
      .from(employees).where(eq(employees.clerkUserId, userId)).orderBy(desc(employees.createdAt)).limit(5),

    // Recent knowledge sources
    db.select({ id: knowledgeSources.id, name: knowledgeSources.name, type: knowledgeSources.type, ts: knowledgeSources.createdAt })
      .from(knowledgeSources).where(eq(knowledgeSources.clerkUserId, userId)).orderBy(desc(knowledgeSources.createdAt)).limit(5),

    // Recent conversations (any message exchange)
    db.select({ id: conversations.id, empId: conversations.employeeId, ts: conversations.updatedAt })
      .from(conversations).where(eq(conversations.clerkUserId, userId)).orderBy(desc(conversations.updatedAt)).limit(5),

    // Recent knowledge links
    db.select({ empId: employeeKnowledgeSources.employeeId, srcId: employeeKnowledgeSources.knowledgeSourceId, ts: employeeKnowledgeSources.linkedAt })
      .from(employeeKnowledgeSources).where(eq(employeeKnowledgeSources.clerkUserId, userId)).orderBy(desc(employeeKnowledgeSources.linkedAt)).limit(5),
  ]);

  const employeeCount     = Number(empRows[0]?.c  ?? 0);
  const knowledgeCount    = Number(knRows[0]?.c   ?? 0);
  const conversationCount = Number(convRows[0]?.c ?? 0);
  const messageCount      = Number(msgRows[0]?.c  ?? 0);
  const estimatedTokens   = messageCount * AVG_TOKENS_PER_MESSAGE;
  const estimatedCostUsd  = estimatedTokens * COST_PER_TOKEN;

  /* ── Build activity feed ── */
  const events: ActivityEvent[] = [
    ...recentEmps.map((r) => ({
      id:        `emp-${r.id}`,
      type:      "employee_created" as ActivityType,
      label:     `AI Employee created`,
      meta:      r.name,
      timestamp: r.ts.toISOString(),
    })),
    ...recentKn.map((r) => ({
      id:        `kn-${r.id}`,
      type:      "knowledge_added" as ActivityType,
      label:     `Knowledge source added`,
      meta:      r.name,
      timestamp: r.ts.toISOString(),
    })),
    ...recentConvs.map((r) => ({
      id:        `conv-${r.id}`,
      type:      "conversation_started" as ActivityType,
      label:     `AI conversation`,
      meta:      "Chat session active",
      timestamp: r.ts.toISOString(),
    })),
    ...recentLinks.map((r) => ({
      id:        `link-${r.empId}-${r.srcId}`,
      type:      "knowledge_linked" as ActivityType,
      label:     `Knowledge linked to employee`,
      meta:      "",
      timestamp: r.ts.toISOString(),
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return {
    stats: {
      employeeCount,
      knowledgeCount,
      conversationCount,
      messageCount,
      estimatedTokens,
      estimatedCostUsd,
    },
    activity:       events,
    firstEmployeeId: recentEmps[0]?.id ?? null,
  };
}
