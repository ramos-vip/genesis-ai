"use server";

import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import {
  employees,
  knowledgeSources,
  conversations,
  conversationMessages,
  knowledgeChunks,
} from "@/server/db/schema";
import { getDb }               from "@/server/db";
import { getBillingProvider, PLANS } from "@/server/billing/provider";
import type { Subscription, Invoice, Plan } from "@/server/billing/provider";

/* ─── Constants ────────────────────────────────────────────────────────────── */

const AVG_TOKENS_PER_MESSAGE  = 650;
const CHAT_COST_PER_TOKEN     = 0.0000003;   // Gemini 2.5 Flash blended
const EMBED_COST_PER_CHUNK    = 0.0000025;   // text-embedding-004 per chunk (~1K tokens)

/* ─── Types ───────────────────────────────────────────────────────────────── */

export interface UsageMetric {
  label:    string;
  used:     number;
  limit:    number; // -1 = unlimited
  unit?:    string;
}

export interface BillingData {
  subscription:     Subscription;
  currentPlan:      Plan;
  usage:            UsageMetric[];
  costs: {
    chatTokens:       number;
    chatCostUsd:      number;
    embeddingChunks:  number;
    embeddingCostUsd: number;
    totalCostUsd:     number;
    estimatedMonthly: number;
  };
  invoices:         Invoice[];
}

/* ─── Action ───────────────────────────────────────────────────────────────── */

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getBillingDataAction(): Promise<BillingData> {
  const userId   = await requireUserId();
  const db       = getDb();
  const provider = getBillingProvider();

  /* ── Parallel: subscription, invoices, usage counts ── */
  const [
    subscription,
    invoices,
    empResult,
    knResult,
    convResult,
    msgResult,
    chunkResult,
  ] = await Promise.all([
    provider.getSubscription(userId),
    provider.getInvoices(userId),

    db.select({ c: sql<string>`cast(count(*) as text)` })
      .from(employees).where(eq(employees.clerkUserId, userId)),

    db.select({ c: sql<string>`cast(count(*) as text)` })
      .from(knowledgeSources).where(eq(knowledgeSources.clerkUserId, userId)),

    db.select({ c: sql<string>`cast(count(*) as text)` })
      .from(conversations).where(eq(conversations.clerkUserId, userId)),

    // Model messages only — what the user "consumed"
    db.select({ c: sql<string>`cast(count(*) as text)` })
      .from(conversationMessages)
      .innerJoin(conversations, eq(conversationMessages.conversationId, conversations.id))
      .where(eq(conversations.clerkUserId, userId)),

    // Embedded chunks
    db.select({ c: sql<string>`cast(count(*) as text)` })
      .from(knowledgeChunks)
      .innerJoin(knowledgeSources, eq(knowledgeChunks.knowledgeSourceId, knowledgeSources.id))
      .where(eq(knowledgeSources.clerkUserId, userId)),
  ]);

  const empCount   = Number(empResult[0]?.c   ?? 0);
  const knCount    = Number(knResult[0]?.c    ?? 0);
  const msgCount   = Number(msgResult[0]?.c   ?? 0);
  const chunkCount = Number(chunkResult[0]?.c ?? 0);

  const currentPlan = PLANS[subscription.planId];
  const limits      = currentPlan.limits;

  /* ── Usage metrics ── */
  const usage: UsageMetric[] = [
    { label: "AI Employees",        used: empCount,   limit: limits.employees,        unit: "employees"  },
    { label: "Knowledge Sources",   used: knCount,    limit: limits.knowledgeSources, unit: "sources"    },
    { label: "Monthly Messages",    used: msgCount,   limit: limits.messagesPerMonth, unit: "messages"   },
    { label: "Knowledge Chunks",    used: chunkCount, limit: -1,                      unit: "chunks"     },
    { label: "Embedding Models",    used: 1,          limit: limits.embeddingModels,  unit: "models"     },
    { label: "Storage",             used: Math.round(chunkCount * 2),
                                                     limit: limits.storageMb,         unit: "MB"         },
  ];

  /* ── Cost estimates ── */
  const chatTokens       = msgCount   * AVG_TOKENS_PER_MESSAGE;
  const chatCostUsd      = chatTokens * CHAT_COST_PER_TOKEN;
  const embeddingCostUsd = chunkCount * EMBED_COST_PER_CHUNK;
  const totalCostUsd     = chatCostUsd + embeddingCostUsd;

  // Simple monthly estimate: scale by days remaining in the period vs days elapsed
  const periodEnd     = new Date(subscription.currentPeriodEnd);
  const now           = new Date();
  const periodStart   = new Date(periodEnd);
  periodStart.setMonth(periodStart.getMonth() - 1);
  const elapsed       = (now.getTime()      - periodStart.getTime()) / (1000 * 60 * 60 * 24);
  const totalDays     = (periodEnd.getTime()- periodStart.getTime()) / (1000 * 60 * 60 * 24);
  const daysRatio     = elapsed > 0 ? totalDays / elapsed : 1;
  const estimatedMonthly = totalCostUsd * daysRatio;

  return {
    subscription,
    currentPlan,
    usage,
    costs: {
      chatTokens:       Math.round(chatTokens),
      chatCostUsd:      Math.round(chatCostUsd * 10_000) / 10_000,
      embeddingChunks:  chunkCount,
      embeddingCostUsd: Math.round(embeddingCostUsd * 10_000) / 10_000,
      totalCostUsd:     Math.round(totalCostUsd * 10_000) / 10_000,
      estimatedMonthly: Math.round(estimatedMonthly * 100) / 100,
    },
    invoices,
  };
}
