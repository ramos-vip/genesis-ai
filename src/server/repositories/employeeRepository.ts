/**
 * Employee Repository
 *
 * All database interactions for the Employee entity.
 *
 * Security contract:
 * - Every method receives `clerkUserId` and includes it in every WHERE clause
 * - No query can return or modify another user's data
 * - Callers (Server Actions) are responsible for authenticating the user first
 */

import { and, desc, eq } from "drizzle-orm";
import { getDb, employees } from "../db";
import { toId } from "@/shared/types";
import type { Employee, EmployeeRole, EmployeeStatus, ToneOfVoice } from "@/modules/employees/types";
import type { CreateEmployeeInput, UpdateEmployeeInput } from "../validation/employee";

/* ─── Mapper ──────────────────────────────────────────────────────────────── */

function generateId(): string {
  return `emp_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

/**
 * Maps a flat database row to the domain Employee type.
 * Stats are zeroed — they will be computed from activity logs in a future sprint.
 */
function rowToEmployee(row: typeof employees.$inferSelect): Employee {
  return {
    id:             toId(row.id),
    name:           row.name,
    role:           row.role as EmployeeRole,
    status:         row.status as EmployeeStatus,
    description:    row.description,
    organizationId: toId(row.clerkUserId), // Treat user as org until multi-tenancy is added
    config: {
      toneOfVoice:        row.toneOfVoice as ToneOfVoice,
      language:           "en",
      temperature:        row.temperature,
      systemInstructions: row.systemInstructions,
      escalationRules:    [],
    },
    stats: {
      tasksCompleted:  0,
      tasksToday:      0,
      avgResponseTime: 0,
      successRate:     0,
    },
    knowledgeIds:   [],
    automationIds:  [],
    createdAt:      row.createdAt.toISOString() as Employee["createdAt"],
    updatedAt:      row.updatedAt.toISOString() as Employee["updatedAt"],
  };
}

/* ─── Repository ──────────────────────────────────────────────────────────── */

export const employeeRepository = {
  /** All employees owned by this user, newest first */
  async findAll(clerkUserId: string): Promise<Employee[]> {
    const db   = getDb();
    const rows = await db
      .select()
      .from(employees)
      .where(eq(employees.clerkUserId, clerkUserId))
      .orderBy(desc(employees.createdAt));

    return rows.map(rowToEmployee);
  },

  /** Single employee — returns null if not found or owned by another user */
  async findById(clerkUserId: string, id: string): Promise<Employee | null> {
    const db   = getDb();
    const rows = await db
      .select()
      .from(employees)
      .where(and(eq(employees.id, id), eq(employees.clerkUserId, clerkUserId)))
      .limit(1);

    return rows.length > 0 ? rowToEmployee(rows[0]) : null;
  },

  /** Insert a new employee row */
  async create(clerkUserId: string, dto: CreateEmployeeInput): Promise<Employee> {
    const db  = getDb();
    const id  = generateId();
    const now = new Date();

    const rows = await db
      .insert(employees)
      .values({
        id,
        clerkUserId,
        name:               dto.name,
        role:               dto.role,
        description:        dto.description,
        status:             "active",
        systemInstructions: "",
        toneOfVoice:        "professional",
        temperature:        0.5,
        createdAt:          now,
        updatedAt:          now,
      })
      .returning();

    if (rows.length === 0) throw new Error("Failed to insert employee");
    return rowToEmployee(rows[0]);
  },

  /** Update fields belonging to this user's employee */
  async update(
    clerkUserId: string,
    id:          string,
    dto:         UpdateEmployeeInput
  ): Promise<Employee> {
    const db = getDb();

    /* Build flat update payload — only include explicitly provided fields */
    const updatePayload: Partial<typeof employees.$inferInsert> = {};

    if (dto.name        !== undefined) updatePayload.name        = dto.name;
    if (dto.role        !== undefined) updatePayload.role        = dto.role;
    if (dto.description !== undefined) updatePayload.description = dto.description;
    if (dto.status      !== undefined) updatePayload.status      = dto.status;

    if (dto.config) {
      if (dto.config.systemInstructions !== undefined) {
        updatePayload.systemInstructions = dto.config.systemInstructions;
      }
      if (dto.config.toneOfVoice !== undefined) {
        updatePayload.toneOfVoice = dto.config.toneOfVoice;
      }
      if (dto.config.temperature !== undefined) {
        updatePayload.temperature = dto.config.temperature;
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      /* Nothing to update — return the current record */
      const existing = await employeeRepository.findById(clerkUserId, id);
      if (!existing) throw new Error("Employee not found");
      return existing;
    }

    const rows = await db
      .update(employees)
      .set(updatePayload)
      .where(and(eq(employees.id, id), eq(employees.clerkUserId, clerkUserId)))
      .returning();

    if (rows.length === 0) throw new Error("Employee not found or access denied");
    return rowToEmployee(rows[0]);
  },

  /** Hard delete — restricted to the owner */
  async delete(clerkUserId: string, id: string): Promise<void> {
    const db = getDb();

    const result = await db
      .delete(employees)
      .where(and(eq(employees.id, id), eq(employees.clerkUserId, clerkUserId)))
      .returning({ id: employees.id });

    if (result.length === 0) throw new Error("Employee not found or access denied");
  },
};
