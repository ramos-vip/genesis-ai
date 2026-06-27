import { index, integer, pgTable, primaryKey, real, text, timestamp } from "drizzle-orm/pg-core";

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

/* ─── Employee ↔ Knowledge Sources (many-to-many) ─────────────────────────── */

/**
 * Junction table linking employees to knowledge sources.
 *
 * clerkUserId is denormalised onto every row so that every query can enforce
 * ownership without an extra JOIN to employees or knowledge_sources.
 *
 * RAG pipeline hook: when the embeddings sprint lands, the pipeline reads
 * this table to know which chunks to retrieve for a given employee context.
 */
export const employeeKnowledgeSources = pgTable(
  "employee_knowledge_sources",
  {
    employeeId:        text("employee_id").notNull(),
    knowledgeSourceId: text("knowledge_source_id").notNull(),
    /** Denormalised — both parent rows must belong to the same Clerk user */
    clerkUserId: text("clerk_user_id").notNull(),
    linkedAt: timestamp("linked_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.employeeId, table.knowledgeSourceId] }),
    index("eks_employee_idx").on(table.employeeId),
    index("eks_source_idx").on(table.knowledgeSourceId),
  ]
);

/* ─── Type inference ──────────────────────────────────────────────────────── */

export type EmployeeRow              = typeof employees.$inferSelect;
export type NewEmployeeRow           = typeof employees.$inferInsert;
export type KnowledgeSourceRow       = typeof knowledgeSources.$inferSelect;
export type NewKnowledgeSourceRow    = typeof knowledgeSources.$inferInsert;
export type EmployeeKnowledgeRow     = typeof employeeKnowledgeSources.$inferSelect;
