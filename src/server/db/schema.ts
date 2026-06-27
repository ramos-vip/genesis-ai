import {
  index,
  integer,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/* ─── Employees ───────────────────────────────────────────────────────────── */

export const employees = pgTable(
  "employees",
  {
    id:          text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    name:        text("name").notNull(),
    role:        text("role").notNull(),
    description: text("description").notNull().default(""),
    status:      text("status").notNull().default("active"),
    systemInstructions: text("system_instructions").notNull().default(""),
    toneOfVoice:        text("tone_of_voice").notNull().default("professional"),
    temperature:        real("temperature").notNull().default(0.5),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("employees_clerk_user_id_idx").on(table.clerkUserId),
    index("employees_status_idx").on(table.clerkUserId, table.status),
  ]
);

/* ─── Knowledge Sources ───────────────────────────────────────────────────── */

export const knowledgeSources = pgTable(
  "knowledge_sources",
  {
    id:          text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    name:        text("name").notNull(),
    type:        text("type").notNull(),
    status:      text("status").notNull().default("ready"),
    meta:        text("meta").notNull().default("{}"),
    chunkCount:  integer("chunk_count"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("knowledge_sources_clerk_user_id_idx").on(table.clerkUserId),
    index("knowledge_sources_type_idx").on(table.clerkUserId, table.type),
  ]
);

/* ─── Knowledge Chunks ────────────────────────────────────────────────────── */

/**
 * Pre-computed text chunks for knowledge sources.
 *
 * Text sources are split into ~500-token chunks (≈2000 chars) with
 * ~100-token overlap (≈400 chars) at creation time.
 *
 * RAG sprint: these chunks will be embedded and stored in a vector index.
 * The chunkIndex preserves original document order for reconstruction.
 */
export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id:                text("id").primaryKey(),
    knowledgeSourceId: text("knowledge_source_id").notNull(),
    chunkIndex:        integer("chunk_index").notNull(),
    content:           text("content").notNull(),
    /** Estimated token count (length ÷ 4) — accurate for English prose */
    tokenCount:        integer("token_count").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    /** Primary lookup: all chunks for a source */
    index("chunks_source_idx").on(table.knowledgeSourceId),
    /** Ordered retrieval: chunks for a source in document order */
    index("chunks_source_order_idx").on(table.knowledgeSourceId, table.chunkIndex),
  ]
);

/* ─── Employee ↔ Knowledge Sources (many-to-many) ─────────────────────────── */

export const employeeKnowledgeSources = pgTable(
  "employee_knowledge_sources",
  {
    employeeId:        text("employee_id").notNull(),
    knowledgeSourceId: text("knowledge_source_id").notNull(),
    clerkUserId:       text("clerk_user_id").notNull(),
    linkedAt: timestamp("linked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.employeeId, table.knowledgeSourceId] }),
    index("eks_employee_idx").on(table.employeeId),
    index("eks_source_idx").on(table.knowledgeSourceId),
  ]
);

/* ─── Conversations ───────────────────────────────────────────────────────── */

export const conversations = pgTable(
  "conversations",
  {
    id:          text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    employeeId:  text("employee_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("conversations_user_employee_unique").on(table.clerkUserId, table.employeeId),
    index("conversations_employee_idx").on(table.employeeId),
  ]
);

export const conversationMessages = pgTable(
  "conversation_messages",
  {
    id:             text("id").primaryKey(),
    conversationId: text("conversation_id").notNull(),
    role:           text("role").notNull(),
    content:        text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("messages_conversation_idx").on(table.conversationId),
  ]
);

/* ─── Type inference ──────────────────────────────────────────────────────── */

export type EmployeeRow              = typeof employees.$inferSelect;
export type NewEmployeeRow           = typeof employees.$inferInsert;
export type KnowledgeSourceRow       = typeof knowledgeSources.$inferSelect;
export type NewKnowledgeSourceRow    = typeof knowledgeSources.$inferInsert;
export type KnowledgeChunkRow        = typeof knowledgeChunks.$inferSelect;
export type EmployeeKnowledgeRow     = typeof employeeKnowledgeSources.$inferSelect;
export type ConversationRow          = typeof conversations.$inferSelect;
export type ConversationMessageRow   = typeof conversationMessages.$inferSelect;
