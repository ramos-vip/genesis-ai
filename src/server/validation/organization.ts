/**
 * Server-side Zod validation for EPIC-009 Organization operations.
 *
 * Trust boundary: Server Actions validate every input here before touching the
 * database. Owner is never assignable via invite/update — ownership moves only
 * through the explicit transfer flow.
 */

import { z } from "zod";

const ASSIGNABLE_ROLES = [
  "admin",
  "manager",
  "member",
  "viewer",
  "billing",
  "support",
] as const;

const ORG_PLANS = ["free", "pro", "business", "enterprise"] as const;
const ORG_STATUSES = ["active", "suspended"] as const;
const MEMBER_STATUSES = ["active", "suspended"] as const;

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60, "Name must be 60 characters or less"),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens")
    .optional(),
});

export const updateOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  plan: z.enum(ORG_PLANS).optional(),
  status: z.enum(ORG_STATUSES).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  role: z.enum(ASSIGNABLE_ROLES),
  customRoleId: z.string().optional(),
});

export const updateMemberSchema = z.object({
  role: z.enum(ASSIGNABLE_ROLES).optional(),
  status: z.enum(MEMBER_STATUSES).optional(),
  departmentId: z.string().nullable().optional(),
  customRoleId: z.string().nullable().optional(),
  title: z.string().trim().max(80).optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
