"use server";

import { auth }                    from "@clerk/nextjs/server";
import { and, eq }                 from "drizzle-orm";
import {
  employees,
  knowledgeSources,
  employeeKnowledgeSources,
  conversations,
  conversationMessages,
} from "@/server/db/schema";
import { getDb } from "@/server/db";

export interface OnboardingStatus {
  hasEmployee:         boolean;
  hasKnowledge:        boolean;
  hasLinkedKnowledge:  boolean;
  hasChatted:          boolean;
  isComplete:          boolean;
  completedSteps:      number;
  totalSteps:          4;
  /** First employee id — used to deep-link checklist steps */
  firstEmployeeId:     string | null;
}

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/**
 * Single-round-trip onboarding status check.
 * Uses LIMIT 1 instead of COUNT(*) — only needs existence, not quantity.
 */
export async function getOnboardingStatusAction(): Promise<OnboardingStatus> {
  const userId = await requireUserId();
  const db     = getDb();

  const [empRows, knRows, linkRows, chatRows] = await Promise.all([
    // 1. Has at least one employee?
    db.select({ id: employees.id })
      .from(employees)
      .where(eq(employees.clerkUserId, userId))
      .limit(1),

    // 2. Has at least one knowledge source?
    db.select({ id: knowledgeSources.id })
      .from(knowledgeSources)
      .where(eq(knowledgeSources.clerkUserId, userId))
      .limit(1),

    // 3. Has any employee↔knowledge link?
    db.select({ employeeId: employeeKnowledgeSources.employeeId })
      .from(employeeKnowledgeSources)
      .where(eq(employeeKnowledgeSources.clerkUserId, userId))
      .limit(1),

    // 4. Has any real AI response in chat? (role = 'model' means Gemini replied)
    db.select({ id: conversationMessages.id })
      .from(conversationMessages)
      .innerJoin(
        conversations,
        eq(conversationMessages.conversationId, conversations.id)
      )
      .where(
        and(
          eq(conversations.clerkUserId, userId),
          eq(conversationMessages.role, "model")
        )
      )
      .limit(1),
  ]);

  const hasEmployee        = empRows.length  > 0;
  const hasKnowledge       = knRows.length   > 0;
  const hasLinkedKnowledge = linkRows.length > 0;
  const hasChatted         = chatRows.length > 0;
  const completedSteps     = [hasEmployee, hasKnowledge, hasLinkedKnowledge, hasChatted]
    .filter(Boolean).length;

  return {
    hasEmployee,
    hasKnowledge,
    hasLinkedKnowledge,
    hasChatted,
    isComplete:      completedSteps === 4,
    completedSteps,
    totalSteps:      4,
    firstEmployeeId: empRows[0]?.id ?? null,
  };
}
