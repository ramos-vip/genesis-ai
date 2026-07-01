/**
 * Member & Invitation Repository (EPIC-009)
 *
 * Every method is scoped by org id. Effective permissions are resolved here so
 * the RBAC guard has a single, authoritative source (system role or custom role).
 */

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  getDb,
  organizations,
  organizationMembers,
  invitations,
  customRoles,
} from "../db";
import type { InvitationRow, OrganizationMemberRow } from "../db";
import { createId, createToken } from "../db/ids";
import { parseJson } from "../db/json";
import { toId } from "@/shared/types";
import type { ISODate } from "@/shared/types";
import {
  isPermission,
  resolvePermissions,
  type Permission,
  type SystemRole,
} from "@/modules/organizations/permissions";
import type {
  Invitation,
  InvitationStatus,
  MemberListResult,
  MemberStatus,
  OrganizationMember,
} from "@/modules/organizations/types";
import type { InviteMemberInput, UpdateMemberInput } from "../validation/organization";

interface MemberQuery {
  page?:    number;
  perPage?: number;
  search?:  string;
  role?:    string;
  status?:  string;
}

function rowToMember(row: OrganizationMemberRow): OrganizationMember {
  return {
    id:             toId(row.id),
    organizationId: toId(row.orgId),
    userId:         toId(row.clerkUserId),
    role:           row.role as SystemRole,
    customRoleId:   row.customRoleId ? toId(row.customRoleId) : undefined,
    departmentId:   row.departmentId ? toId(row.departmentId) : undefined,
    status:         row.status as MemberStatus,
    title:          row.title ?? undefined,
    joinedAt:       row.joinedAt.toISOString() as ISODate,
    createdAt:      row.createdAt.toISOString() as ISODate,
    updatedAt:      row.updatedAt.toISOString() as ISODate,
  };
}

function rowToInvitation(row: InvitationRow): Invitation {
  return {
    id:             toId(row.id),
    organizationId: toId(row.orgId),
    email:          row.email,
    role:           row.role as SystemRole,
    customRoleId:   row.customRoleId ? toId(row.customRoleId) : undefined,
    status:         row.status as InvitationStatus,
    invitedBy:      toId(row.invitedByClerkUserId),
    expiresAt:      row.expiresAt.toISOString() as ISODate,
    createdAt:      row.createdAt.toISOString() as ISODate,
    updatedAt:      row.updatedAt.toISOString() as ISODate,
  };
}

export const memberRepository = {
  /** Raw membership row (used by the RBAC guard). */
  async getMembership(orgId: string, clerkUserId: string): Promise<OrganizationMemberRow | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.clerkUserId, clerkUserId)))
      .limit(1);
    return rows.length > 0 ? rows[0] : null;
  },

  async getCustomRolePermissions(orgId: string, customRoleId: string): Promise<Permission[] | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(customRoles)
      .where(and(eq(customRoles.id, customRoleId), eq(customRoles.orgId, orgId)))
      .limit(1);
    if (rows.length === 0) return null;
    return parseJson<string[]>(rows[0].permissions, []).filter(isPermission);
  },

  /** Effective permission set for a membership (custom role overrides system role). */
  async getEffectivePermissions(membership: OrganizationMemberRow): Promise<Permission[]> {
    if (membership.customRoleId) {
      const perms = await memberRepository.getCustomRolePermissions(membership.orgId, membership.customRoleId);
      if (perms && perms.length > 0) return perms;
    }
    return resolvePermissions(membership.role as SystemRole);
  },

  /** Paginated, filterable member list. */
  async list(orgId: string, params: MemberQuery): Promise<MemberListResult> {
    const db = getDb();
    const page = Math.max(1, params.page ?? 1);
    const perPage = Math.min(100, Math.max(1, params.perPage ?? 20));
    const offset = (page - 1) * perPage;

    const filters = [eq(organizationMembers.orgId, orgId)];
    if (params.role && params.role !== "all") filters.push(eq(organizationMembers.role, params.role));
    if (params.status && params.status !== "all") filters.push(eq(organizationMembers.status, params.status));
    if (params.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      const searchExpr = or(ilike(organizationMembers.title, term), ilike(organizationMembers.clerkUserId, term));
      if (searchExpr) filters.push(searchExpr);
    }
    const whereExpr = and(...filters);

    const countRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(organizationMembers)
      .where(whereExpr);
    const total = countRows[0]?.count ?? 0;

    const rows = await db
      .select()
      .from(organizationMembers)
      .where(whereExpr)
      .orderBy(desc(organizationMembers.createdAt))
      .limit(perPage)
      .offset(offset);

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    return {
      items: rows.map(rowToMember),
      meta: { page, perPage, total, totalPages, hasMore: page < totalPages },
    };
  },

  async findById(orgId: string, memberId: string): Promise<OrganizationMemberRow | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(organizationMembers)
      .where(and(eq(organizationMembers.id, memberId), eq(organizationMembers.orgId, orgId)))
      .limit(1);
    return rows.length > 0 ? rows[0] : null;
  },

  async update(orgId: string, memberId: string, dto: UpdateMemberInput): Promise<OrganizationMember> {
    const db = getDb();
    const payload: Partial<typeof organizationMembers.$inferInsert> = {};
    if (dto.role !== undefined) payload.role = dto.role;
    if (dto.status !== undefined) payload.status = dto.status;
    if (dto.title !== undefined) payload.title = dto.title;
    if (dto.departmentId !== undefined) payload.departmentId = dto.departmentId;
    if (dto.customRoleId !== undefined) payload.customRoleId = dto.customRoleId;

    if (Object.keys(payload).length === 0) {
      const existing = await memberRepository.findById(orgId, memberId);
      if (!existing) throw new Error("Member not found");
      return rowToMember(existing);
    }

    const rows = await db
      .update(organizationMembers)
      .set(payload)
      .where(and(eq(organizationMembers.id, memberId), eq(organizationMembers.orgId, orgId)))
      .returning();
    if (rows.length === 0) throw new Error("Member not found");
    return rowToMember(rows[0]);
  },

  async remove(orgId: string, memberId: string): Promise<void> {
    const db = getDb();
    const result = await db
      .delete(organizationMembers)
      .where(and(eq(organizationMembers.id, memberId), eq(organizationMembers.orgId, orgId)))
      .returning({ id: organizationMembers.id });
    if (result.length === 0) throw new Error("Member not found");
  },

  /** Demote current owner to admin, promote the target member to owner, repoint org. */
  async transferOwnership(orgId: string, currentOwnerClerkUserId: string, newOwnerMemberId: string): Promise<void> {
    const db = getDb();
    const target = await memberRepository.findById(orgId, newOwnerMemberId);
    if (!target) throw new Error("Target member not found");

    await db
      .update(organizationMembers)
      .set({ role: "admin" })
      .where(and(eq(organizationMembers.orgId, orgId), eq(organizationMembers.clerkUserId, currentOwnerClerkUserId)));

    await db
      .update(organizationMembers)
      .set({ role: "owner", status: "active" })
      .where(and(eq(organizationMembers.id, newOwnerMemberId), eq(organizationMembers.orgId, orgId)));

    await db
      .update(organizations)
      .set({ ownerClerkUserId: target.clerkUserId })
      .where(eq(organizations.id, orgId));
  },

  /* ── Invitations ── */

  async listInvitations(orgId: string, status?: string): Promise<Invitation[]> {
    const db = getDb();
    const filters = [eq(invitations.orgId, orgId)];
    if (status && status !== "all") filters.push(eq(invitations.status, status));
    const rows = await db.select().from(invitations).where(and(...filters)).orderBy(desc(invitations.createdAt));
    return rows.map(rowToInvitation);
  },

  async findPendingInvitation(orgId: string, email: string): Promise<InvitationRow | null> {
    const db = getDb();
    const rows = await db
      .select()
      .from(invitations)
      .where(and(eq(invitations.orgId, orgId), eq(invitations.email, email), eq(invitations.status, "pending")))
      .limit(1);
    return rows.length > 0 ? rows[0] : null;
  },

  async createInvitation(orgId: string, invitedByClerkUserId: string, dto: InviteMemberInput): Promise<Invitation> {
    const db = getDb();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const email = dto.email.trim().toLowerCase();

    const existing = await memberRepository.findPendingInvitation(orgId, email);
    if (existing) throw new Error("An invitation for this email is already pending");

    const rows = await db
      .insert(invitations)
      .values({
        id:                   createId("inv"),
        orgId,
        email,
        role:                 dto.role,
        customRoleId:         dto.customRoleId ?? null,
        token:                createToken(),
        status:               "pending",
        invitedByClerkUserId,
        expiresAt,
        createdAt:            now,
        updatedAt:            now,
      })
      .returning();
    if (rows.length === 0) throw new Error("Failed to create invitation");
    return rowToInvitation(rows[0]);
  },

  async revokeInvitation(orgId: string, invitationId: string): Promise<Invitation> {
    const db = getDb();
    const rows = await db
      .update(invitations)
      .set({ status: "revoked" })
      .where(
        and(
          eq(invitations.id, invitationId),
          eq(invitations.orgId, orgId),
          eq(invitations.status, "pending")
        )
      )
      .returning();
    if (rows.length === 0) throw new Error("Pending invitation not found");
    return rowToInvitation(rows[0]);
  },

  async resendInvitation(orgId: string, invitationId: string): Promise<Invitation> {
    const db = getDb();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const rows = await db
      .update(invitations)
      .set({ expiresAt, status: "pending", token: createToken() })
      .where(and(eq(invitations.id, invitationId), eq(invitations.orgId, orgId)))
      .returning();
    if (rows.length === 0) throw new Error("Invitation not found");
    return rowToInvitation(rows[0]);
  },
};
