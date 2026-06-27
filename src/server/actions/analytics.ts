"use server";

import { auth } from "@clerk/nextjs/server";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import {
  employees,
  knowledgeSources,
  employeeKnowledgeSources,
  knowledgeChunks,
  conversations,
  conversationMessages,
} from "@/server/db/schema";
import { getDb } from "@/server/db";

/* ─── Constants ────────────────────────────────────────────────────────────── */

const AVG_TOKENS_PER_MESSAGE = 650;
const COST_PER_TOKEN         = 0.0000003; // Gemini 2.5 Flash blended

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface AnalyticsOverview {
  employeeCount:     number;
  conversationCount: number;
  messageCount:      number;
  knowledgeCount:    number;
  estimatedTokens:   number;
  estimatedCostUsd:  number;
}

export interface DayPoint {
  date:  string; // YYYY-MM-DD
  count: number;
}

export interface EmployeeAnalytic {
  id:           string;
  name:         string;
  role:         string;
  status:       string;
  chatCount:    number;
  messageCount: number;
  tokenCount:   number;
  costUsd:      number;
}

export interface KnowledgeUsage {
  id:         string;
  name:       string;
  type:       string;
  chunkCount: number;
  linkedTo:   number;
}

export interface AIHealth {
  responseRate:       number; // % conversations with model responses
  knowledgeCoverage:  number; // % employees with linked knowledge
  avgResponseLength:  number; // avg chars per model message
  totalKnowledgeChunks: number;
  healthScore:        number; // 0-100 composite
}

export interface AnalyticsData {
  overview:        AnalyticsOverview;
  convsByDay:      DayPoint[];   // last 14 days
  msgsByDay:       DayPoint[];   // last 14 days
  employeeStats:   EmployeeAnalytic[];
  knowledgeUsage:  KnowledgeUsage[];
  health:          AIHealth;
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

function last14Days(): DayPoint[] {
  const days: DayPoint[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  return days;
}

function formatCost(usd: number): number {
  return Math.round(usd * 10_000) / 10_000;
}

/* ─── Action ────────────────────────────────────────────────────────────────── */

export async function getAnalyticsDataAction(): Promise<AnalyticsData> {
  const userId = await requireUserId();
  const db     = getDb();

  /* ── Parallel queries ── */
  const [
    empList,
    allConvs,
    allMsgs,
    knList,
    empConvCounts,
    empMsgCounts,
    knChunkCounts,
    knLinkCounts,
    msgLengths,
  ] = await Promise.all([
    // All employees
    db.select({ id: employees.id, name: employees.name, role: employees.role, status: employees.status })
      .from(employees)
      .where(eq(employees.clerkUserId, userId))
      .orderBy(asc(employees.createdAt)),

    // All conversations with timestamp
    db.select({ id: conversations.id, ts: conversations.updatedAt, empId: conversations.employeeId })
      .from(conversations)
      .where(eq(conversations.clerkUserId, userId))
      .orderBy(asc(conversations.updatedAt)),

    // All model messages with timestamp
    db.select({ id: conversationMessages.id, ts: conversationMessages.createdAt, convId: conversationMessages.conversationId })
      .from(conversationMessages)
      .innerJoin(conversations, eq(conversationMessages.conversationId, conversations.id))
      .where(and(eq(conversations.clerkUserId, userId), eq(conversationMessages.role, "model")))
      .orderBy(asc(conversationMessages.createdAt)),

    // All knowledge sources
    db.select({ id: knowledgeSources.id, name: knowledgeSources.name, type: knowledgeSources.type, chunkCount: knowledgeSources.chunkCount })
      .from(knowledgeSources)
      .where(eq(knowledgeSources.clerkUserId, userId))
      .orderBy(desc(knowledgeSources.createdAt)),

    // Per-employee conversation count
    db.select({
        empId: conversations.employeeId,
        cnt:   sql<string>`cast(count(*) as text)`,
      })
      .from(conversations)
      .where(eq(conversations.clerkUserId, userId))
      .groupBy(conversations.employeeId),

    // Per-employee model message count
    db.select({
        empId: conversations.employeeId,
        cnt:   sql<string>`cast(count(${conversationMessages.id}) as text)`,
      })
      .from(conversationMessages)
      .innerJoin(conversations, eq(conversationMessages.conversationId, conversations.id))
      .where(and(eq(conversations.clerkUserId, userId), eq(conversationMessages.role, "model")))
      .groupBy(conversations.employeeId),

    // Per-knowledge-source chunk counts (from DB column)
    db.select({ id: knowledgeChunks.knowledgeSourceId, cnt: sql<string>`cast(count(*) as text)` })
      .from(knowledgeChunks)
      .groupBy(knowledgeChunks.knowledgeSourceId),

    // Per-knowledge-source link counts (how many employees use it)
    db.select({ srcId: employeeKnowledgeSources.knowledgeSourceId, cnt: sql<string>`cast(count(*) as text)` })
      .from(employeeKnowledgeSources)
      .where(eq(employeeKnowledgeSources.clerkUserId, userId))
      .groupBy(employeeKnowledgeSources.knowledgeSourceId),

    // Average model message length for health metric
    db.select({ avg: sql<string>`cast(avg(length(${conversationMessages.content})) as text)` })
      .from(conversationMessages)
      .innerJoin(conversations, eq(conversationMessages.conversationId, conversations.id))
      .where(and(eq(conversations.clerkUserId, userId), eq(conversationMessages.role, "model"))),
  ]);

  /* ── Overview ── */
  const msgCount = allMsgs.length;
  const overview: AnalyticsOverview = {
    employeeCount:     empList.length,
    conversationCount: allConvs.length,
    messageCount:      msgCount,
    knowledgeCount:    knList.length,
    estimatedTokens:   msgCount * AVG_TOKENS_PER_MESSAGE,
    estimatedCostUsd:  formatCost(msgCount * AVG_TOKENS_PER_MESSAGE * COST_PER_TOKEN),
  };

  /* ── Days buckets ── */
  const convDays = last14Days();
  const msgDays  = last14Days();
  const dayMap   = new Map(convDays.map(d => [d.date, d]));
  const msgDayMap= new Map(msgDays.map(d => [d.date, d]));

  for (const { ts } of allConvs) {
    const key = ts.toISOString().slice(0, 10);
    const entry = dayMap.get(key);
    if (entry) entry.count++;
  }
  for (const { ts } of allMsgs) {
    const key = ts.toISOString().slice(0, 10);
    const entry = msgDayMap.get(key);
    if (entry) entry.count++;
  }

  /* ── Per-employee stats ── */
  const convMap = new Map(empConvCounts.map(r => [r.empId, Number(r.cnt)]));
  const msgMap  = new Map(empMsgCounts.map(r => [r.empId, Number(r.cnt)]));

  const employeeStats: EmployeeAnalytic[] = empList
    .map(emp => {
      const msgs = msgMap.get(emp.id) ?? 0;
      return {
        id:           emp.id,
        name:         emp.name,
        role:         emp.role,
        status:       emp.status,
        chatCount:    convMap.get(emp.id) ?? 0,
        messageCount: msgs,
        tokenCount:   msgs * AVG_TOKENS_PER_MESSAGE,
        costUsd:      formatCost(msgs * AVG_TOKENS_PER_MESSAGE * COST_PER_TOKEN),
      };
    })
    .sort((a, b) => b.messageCount - a.messageCount);

  /* ── Knowledge usage ── */
  const chunkCountMap = new Map(knChunkCounts.map(r => [r.id, Number(r.cnt)]));
  const linkCountMap  = new Map(knLinkCounts.map(r => [r.srcId, Number(r.cnt)]));

  const knowledgeUsage: KnowledgeUsage[] = knList.map(kn => ({
    id:         kn.id,
    name:       kn.name,
    type:       kn.type,
    chunkCount: kn.chunkCount ?? chunkCountMap.get(kn.id) ?? 0,
    linkedTo:   linkCountMap.get(kn.id) ?? 0,
  }));

  /* ── AI Health ── */
  const convsWithResponses = allConvs.filter(c =>
    allMsgs.some(m => m.convId === c.id)
  ).length;

  const empIds = new Set(empList.map(e => e.id));
  const linkedEmpIds = new Set(
    (await db.select({ empId: employeeKnowledgeSources.employeeId })
      .from(employeeKnowledgeSources)
      .where(eq(employeeKnowledgeSources.clerkUserId, userId))).map(r => r.empId)
  );
  const knowledgeCoverage = empList.length > 0
    ? Math.round((linkedEmpIds.size / empList.length) * 100)
    : 0;

  const responseRate = allConvs.length > 0
    ? Math.round((convsWithResponses / allConvs.length) * 100)
    : 0;

  const avgResponseLength = Math.round(Number(msgLengths[0]?.avg ?? 0));
  const totalChunks       = knList.reduce((s, k) => s + (k.chunkCount ?? 0), 0);

  const healthScore = Math.round(
    (responseRate * 0.4) + (knowledgeCoverage * 0.4) + (empList.length > 0 ? 20 : 0)
  );

  const health: AIHealth = {
    responseRate,
    knowledgeCoverage,
    avgResponseLength,
    totalKnowledgeChunks: totalChunks,
    healthScore: Math.min(100, healthScore),
  };

  void empIds; // used implicitly via empList

  return { overview, convsByDay: convDays, msgsByDay: msgDays, employeeStats, knowledgeUsage, health };
}
