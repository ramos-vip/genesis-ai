/**
 * Database Schema — Drizzle ORM definitions for Neon PostgreSQL
 *
 * Principles:
 * - clerkUserId on every table — enforced in every WHERE clause
 * - Flat columns where sensible; JSON text for typed-but-variable metadata
 * - Future-proofed: RAG columns exist (nullable) so no schema migration is
 *   needed when the embeddings sprint lands
 */

import { index, integer, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

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
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("employees_clerk_user_id_idx").on(table.clerkUserId),
    index("employees_status_idx").on(table.clerkUserId, table.status),
  ]
);

/* ─── Knowledge Sources ───────────────────────────────────────────────────── */

/**
 * knowledge_sources — stores source metadata for the knowledge base.
 *
 * `meta` is a JSON-encoded string whose shape is determined by `type`:
 *   text → { content: string, wordCount: number }
 *   url  → { url: string }
 *   pdf  → { fileName: string, fileSize: number, pageCount?: number }
 *
 * RAG-compatible: chunkCount is nullable — populated in the embeddings sprint.
 * Employee linkage is a future many-to-many junction table (Sprint 9+).
 */
export const knowledgeSources = pgTable(
  "knowledge_sources",
  {
    id:          text("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),

    name:   text("name").notNull(),
    /** Discriminant: 'text' | 'url' | 'pdf' */
    type:   text("type").notNull(),
    /** 'ready' | 'processing' | 'error' */
    status: text("status").notNull().default("ready"),

    /** JSON-encoded type-specific metadata (see JSDoc above) */
    meta: text("meta").notNull().default("{}"),

    /** Populated when content is chunked for vector search (embeddings sprint) */
    chunkCount: integer("chunk_count"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("knowledge_sources_clerk_user_id_idx").on(table.clerkUserId),
    index("knowledge_sources_type_idx").on(table.clerkUserId, table.type),
  ]
);

/* ─── Type inference ──────────────────────────────────────────────────────── */

export type EmployeeRow         = typeof employees.$inferSelect;
export type NewEmployeeRow      = typeof employees.$inferInsert;
export type KnowledgeSourceRow  = typeof knowledgeSources.$inferSelect;
export type NewKnowledgeSourceRow = typeof knowledgeSources.$inferInsert;
