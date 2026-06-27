/**
 * Server-side Zod validation schemas for Employee operations.
 *
 * These run in Server Actions — not on the client.
 * They are the trust boundary: validate all input before touching the database.
 */

import { z } from "zod";

const EMPLOYEE_ROLES = [
  "support",
  "sales",
  "seo",
  "content",
  "email",
  "operations",
  "custom",
] as const;

const EMPLOYEE_STATUSES = [
  "active",
  "paused",
  "training",
  "error",
  "draft",
] as const;

const TONES = [
  "professional",
  "friendly",
  "concise",
  "custom",
] as const;

export const createEmployeeSchema = z.object({
  name:             z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name must be 50 characters or less"),
  role:             z.enum(EMPLOYEE_ROLES, { error: "Invalid role" }),
  description:      z.string().max(500, "Description must be 500 characters or less").default(""),
  knowledgeSources: z.array(z.string()).default([]),
});

export const updateEmployeeSchema = z.object({
  name:        z.string().trim().min(2).max(50).optional(),
  role:        z.enum(EMPLOYEE_ROLES).optional(),
  description: z.string().max(500).optional(),
  status:      z.enum(EMPLOYEE_STATUSES).optional(),
  config: z.object({
    systemInstructions: z.string().max(2000).optional(),
    toneOfVoice:        z.enum(TONES).optional(),
    temperature:        z.number().min(0).max(1).optional(),
  }).optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
