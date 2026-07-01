"use server";

/**
 * Member & Invitation Server Actions (EPIC-009)
 *
 * Role/custom-role changes require roles:update; other member changes require
 * members:update. The owner cannot be modified or removed — ownership moves only
 * via transferOwnershipAction (organization:manage → owner only). Every mutation
 * is audited and added to the activity feed.
 */

import { requireMembership, requirePermission } from "@/server/auth/authorize";
import { memberRepository } from "@/server/repositories/memberRepository";
import { auditRepository } from "@/server/repositories/auditRepository";
import { inviteMemberSchema, updateMemberSchema } from "@/server/validation/organization";
import type { Permission } from "@/modules/organizations/permissions";
import type {
  ActivityLog,
  AuditLog,
  Invitation,
  InviteMemberDto,
  MemberListParams,
  MemberListResult,
  OrganizationMember,
  UpdateMemberDto,
} from "@/modules/organizations/types";

export async function getMembersAction(
  orgId: string,
  params: MemberListParams = {}
): Promise<MemberListResult> {
  await requirePermission(orgId, "members", "view");
  return memberRepository.list(orgId, {
    page:    params.page ?? 1,
    perPage: params.perPage ?? 20,
    search:  params.search,
    role:    params.role,
    status:  params.status,
  });
}

export async function getMyPermissionsAction(orgId: string): Promise<Permission[]> {
  const ctx = await requireMembership(orgId);
  return ctx.permissions;
}

export async function inviteMemberAction(orgId: string, dto: InviteMemberDto): Promise<Invitation> {
  const ctx = await requirePermission(orgId, "invitations", "create");
  const parsed = inviteMemberSchema.safeParse(dto);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid invitation");

  const invitation = await memberRepository.createInvitation(orgId, ctx.userId, parsed.data);

  await auditRepository.record({
    orgId, actorClerkUserId: ctx.userId, action: "member.invite",
    resource: "invitations", resourceId: invitation.id, after: invitation,
    ip: ctx.ip, userAgent: ctx.userAgent,
  });
  await auditRepository.logActivity({
    orgId, actorClerkUserId: ctx.userId, category: "member", verb: "invited",
    summary: `Invited ${invitation.email} as ${invitation.role}`,
    targetType: "invitation", targetId: invitation.id,
  });

  return invitation;
}

export async function getInvitationsAction(orgId: string): Promise<Invitation[]> {
  await requirePermission(orgId, "invitations", "view");
  return memberRepository.listInvitations(orgId);
}

export async function resendInvitationAction(orgId: string, invitationId: string): Promise<Invitation> {
  const ctx = await requirePermission(orgId, "invitations", "create");
  const invitation = await memberRepository.resendInvitation(orgId, invitationId);

  await auditRepository.record({
    orgId, actorClerkUserId: ctx.userId, action: "member.invite.resend",
    resource: "invitations", resourceId: invitationId, after: invitation,
    ip: ctx.ip, userAgent: ctx.userAgent,
  });
  await auditRepository.logActivity({
    orgId, actorClerkUserId: ctx.userId, category: "member", verb: "resent_invite",
    summary: `Resent invitation to ${invitation.email}`,
    targetType: "invitation", targetId: invitationId,
  });

  return invitation;
}

export async function revokeInvitationAction(orgId: string, invitationId: string): Promise<Invitation> {
  const ctx = await requirePermission(orgId, "invitations", "update");
  const invitation = await memberRepository.revokeInvitation(orgId, invitationId);

  await auditRepository.record({
    orgId, actorClerkUserId: ctx.userId, action: "member.invite.revoke",
    resource: "invitations", resourceId: invitationId, after: invitation,
    ip: ctx.ip, userAgent: ctx.userAgent,
  });
  await auditRepository.logActivity({
    orgId, actorClerkUserId: ctx.userId, category: "member", verb: "revoked_invite",
    summary: `Revoked invitation to ${invitation.email}`,
    targetType: "invitation", targetId: invitationId,
  });

  return invitation;
}

export async function updateMemberAction(
  orgId: string,
  memberId: string,
  dto: UpdateMemberDto
): Promise<OrganizationMember> {
  const changesRole = dto.role !== undefined || dto.customRoleId !== undefined;
  const ctx = changesRole
    ? await requirePermission(orgId, "roles", "update")
    : await requirePermission(orgId, "members", "update");

  const parsed = updateMemberSchema.safeParse(dto);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid member update");

  const before = await memberRepository.findById(orgId, memberId);
  if (!before) throw new Error("Member not found");
  if (before.role === "owner") throw new Error("The owner cannot be modified. Transfer ownership first.");

  const updated = await memberRepository.update(orgId, memberId, parsed.data);

  await auditRepository.record({
    orgId, actorClerkUserId: ctx.userId, action: "member.update",
    resource: "members", resourceId: memberId, before, after: updated,
    ip: ctx.ip, userAgent: ctx.userAgent,
  });
  await auditRepository.logActivity({
    orgId, actorClerkUserId: ctx.userId, category: "member", verb: "updated",
    summary: `Updated member ${updated.title ?? updated.userId}`,
    targetType: "member", targetId: memberId,
  });

  return updated;
}

export async function suspendMemberAction(orgId: string, memberId: string): Promise<OrganizationMember> {
  return updateMemberAction(orgId, memberId, { status: "suspended" });
}

export async function reactivateMemberAction(orgId: string, memberId: string): Promise<OrganizationMember> {
  return updateMemberAction(orgId, memberId, { status: "active" });
}

export async function removeMemberAction(orgId: string, memberId: string): Promise<void> {
  const ctx = await requirePermission(orgId, "members", "delete");
  const before = await memberRepository.findById(orgId, memberId);
  if (!before) throw new Error("Member not found");
  if (before.role === "owner") throw new Error("The owner cannot be removed. Transfer ownership first.");

  await memberRepository.remove(orgId, memberId);

  await auditRepository.record({
    orgId, actorClerkUserId: ctx.userId, action: "member.remove",
    resource: "members", resourceId: memberId, before,
    ip: ctx.ip, userAgent: ctx.userAgent,
  });
  await auditRepository.logActivity({
    orgId, actorClerkUserId: ctx.userId, category: "member", verb: "removed",
    summary: "Removed a member", targetType: "member", targetId: memberId,
  });
}

export async function transferOwnershipAction(orgId: string, memberId: string): Promise<void> {
  const ctx = await requirePermission(orgId, "organization", "manage");
  const before = await memberRepository.findById(orgId, memberId);
  if (!before) throw new Error("Member not found");

  await memberRepository.transferOwnership(orgId, ctx.userId, memberId);

  await auditRepository.record({
    orgId, actorClerkUserId: ctx.userId, action: "organization.transfer_ownership",
    resource: "organization", resourceId: orgId, before,
    ip: ctx.ip, userAgent: ctx.userAgent,
  });
  await auditRepository.logActivity({
    orgId, actorClerkUserId: ctx.userId, category: "organization", verb: "transferred_ownership",
    summary: "Transferred organization ownership", targetType: "member", targetId: memberId,
  });
}

export async function getActivityAction(orgId: string, limit = 30): Promise<ActivityLog[]> {
  await requireMembership(orgId);
  return auditRepository.listActivity(orgId, { limit });
}

export async function getAuditAction(orgId: string, limit = 50): Promise<AuditLog[]> {
  await requirePermission(orgId, "audit", "view");
  return auditRepository.listAudit(orgId, { limit });
}
