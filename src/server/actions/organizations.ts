"use server";

/**
 * Organization Server Actions (EPIC-009)
 *
 * Auth: requireUserId / RBAC guard on every entry point.
 * Validation: Zod parses all mutating input.
 * Every mutation records an audit entry and an activity feed entry.
 */

import { requireUserId, requireMembership, requirePermission } from "@/server/auth/authorize";
import { organizationRepository } from "@/server/repositories/organizationRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "@/server/validation/organization";
import type {
  CreateOrganizationDto,
  Organization,
  UpdateOrganizationDto,
} from "@/modules/organizations/types";

export async function getMyOrganizationsAction(): Promise<Organization[]> {
  const userId = await requireUserId();
  return organizationRepository.findAllForUser(userId);
}

export async function getOrganizationAction(orgId: string): Promise<Organization | null> {
  const { userId } = await requireMembership(orgId);
  return organizationRepository.findById(userId, orgId);
}

export async function createOrganizationAction(dto: CreateOrganizationDto): Promise<Organization> {
  const userId = await requireUserId();
  const parsed = createOrganizationSchema.safeParse(dto);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid organization data");

  const org = await organizationRepository.create(userId, parsed.data);

  await auditRepository.record({
    orgId:            org.id,
    actorClerkUserId: userId,
    action:           "organization.create",
    resource:         "organization",
    resourceId:       org.id,
    after:            org,
  });
  await auditRepository.logActivity({
    orgId:            org.id,
    actorClerkUserId: userId,
    category:         "organization",
    verb:             "created",
    summary:          `Created organization \u201C${org.name}\u201D`,
    targetType:       "organization",
    targetId:         org.id,
  });

  return org;
}

export async function updateOrganizationAction(
  orgId: string,
  dto: UpdateOrganizationDto
): Promise<Organization> {
  const ctx = await requirePermission(orgId, "organization", "update");
  const parsed = updateOrganizationSchema.safeParse(dto);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid organization data");

  const before = await organizationRepository.findByIdUnsafe(orgId);
  const updated = await organizationRepository.update(orgId, parsed.data);

  await auditRepository.record({
    orgId,
    actorClerkUserId: ctx.userId,
    action:           "organization.update",
    resource:         "organization",
    resourceId:       orgId,
    before,
    after:            updated,
    ip:               ctx.ip,
    userAgent:        ctx.userAgent,
  });
  await auditRepository.logActivity({
    orgId,
    actorClerkUserId: ctx.userId,
    category:         "organization",
    verb:             "updated",
    summary:          "Updated organization settings",
    targetType:       "organization",
    targetId:         orgId,
  });

  return updated;
}
