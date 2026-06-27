/**
 * Conversation Repository
 *
 * Manages chat conversations and their messages.
 * One conversation per (clerkUserId, employeeId) pair — auto-created on first access.
 *
 * Security: every query includes clerkUserId in the WHERE clause.
 */

import { and, asc, eq } from "drizzle-orm";
import { getDb, conversations, conversationMessages } from "../db";
import type { ChatMessage } from "@/server/ai";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

/* ─── Repository ──────────────────────────────────────────────────────────── */

export const conversationRepository = {
  /**
   * Get the existing conversation for this user+employee pair, or create one.
   * Returns the conversation ID.
   */
  async findOrCreate(clerkUserId: string, employeeId: string): Promise<string> {
    const db = getDb();

    // Try to find an existing conversation
    const existing = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        and(
          eq(conversations.clerkUserId, clerkUserId),
          eq(conversations.employeeId,  employeeId)
        )
      )
      .limit(1);

    if (existing.length > 0) return existing[0].id;

    // Create a new conversation
    const id  = generateId("conv");
    const now = new Date();
    await db.insert(conversations).values({
      id,
      clerkUserId,
      employeeId,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },

  /**
   * Load all messages for a conversation, ordered oldest→newest.
   * Verifies the conversation belongs to the given user before returning data.
   */
  async getMessages(clerkUserId: string, conversationId: string): Promise<ChatMessage[]> {
    const db = getDb();

    // Ownership check — the conversation must belong to this user
    const conv = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        and(
          eq(conversations.id,          conversationId),
          eq(conversations.clerkUserId, clerkUserId)
        )
      )
      .limit(1);

    if (conv.length === 0) return [];

    const rows = await db
      .select({
        role:    conversationMessages.role,
        content: conversationMessages.content,
      })
      .from(conversationMessages)
      .where(eq(conversationMessages.conversationId, conversationId))
      .orderBy(asc(conversationMessages.createdAt));

    return rows.map((r) => ({
      role:    r.role as ChatMessage["role"],
      content: r.content,
    }));
  },

  /**
   * Append a single message to a conversation.
   * Does NOT check ownership — callers must verify before calling.
   */
  async addMessage(
    conversationId: string,
    role:           ChatMessage["role"],
    content:        string
  ): Promise<void> {
    const db = getDb();
    await db.insert(conversationMessages).values({
      id:   generateId("msg"),
      conversationId,
      role,
      content,
      createdAt: new Date(),
    });
  },
};
