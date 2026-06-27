/**
 * Database Schema — Drizzle ORM definitions for Neon PostgreSQL
 *
 * Design principles:
 * - Flat columns for all employee fields (no JSON blobs)
 * - clerkUserId ties every row to a Clerk user — enforced on every query
 * - timestamps with timezone for accuracy across regions
 */

import { index, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

export const employees = pgTable(
  "employees",
  {
    id: text("id").primaryKey(),

    /** Clerk user ID — the row owner. Never null. */
    clerkUserId: text("clerk_user_id").notNull(),

    // ── Core fields ─────────────────────────────────────────────────────────
    name:        text("name").notNull(),
    role:        text("role").notNull(),
    description: text("description").notNull().default(""),
    status:      text("status").notNull().default("active"),

    // ── Behavior config (flat — no nested JSON) ──────────────────────────────
    systemInstructions: text("system_instructions").notNull().default(""),
    toneOfVoice:        text("tone_of_voice").notNull().default("professional"),
    /** 0.0 (precise) – 1.0 (creative) */
    temperature:        real("temperature").notNull().default(0.5),

    // ── Timestamps ──────────────────────────────────────────────────────────
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    /** Optimises "list all employees for user" — the most common query */
    index("employees_clerk_user_id_idx").on(table.clerkUserId),
    /** Optimises status-filtered queries (active employees, etc.) */
    index("employees_status_idx").on(table.clerkUserId, table.status),
  ]
);

/** Type inference helpers */
export type EmployeeRow        = typeof employees.$inferSelect;
export type NewEmployeeRow     = typeof employees.$inferInsert;
