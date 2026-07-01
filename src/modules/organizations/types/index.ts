import type { ID, ISODate, Timestamps } from "@/shared/types";
import type { Permission, SystemRole } from "../permissions";

/* ─── Organization ────────────────────────────────────────────────────────── */

export type OrganizationPlan = "free" | "pro" | "business" | "enterprise";
export type OrganizationStatus = "active" | "suspended";

export interface OrganizationSettings {
  defaultMemberRole?: SystemRole;
  allowPublicInvites?: boolean;
  [key: string]: unknown;
}

export interface Organization extends Timestamps {
  id:       ID;
  name:     string;
  slug:     string;
  ownerId:  ID;
  plan:     OrganizationPlan;
  status:   OrganizationStatus;
  settings: OrganizationSettings;
}

export interface CreateOrganizationDto {
  name:  string;
  slug?: string;
}

export type UpdateOrganizationDto = Partial<
  Pick<Organization, "name" | "plan" | "status"> & {
    settings: OrganizationSettings;
  }
>;

/* ─── Members ─────────────────────────────────────────────────────────────── */

export type MemberStatus = "active" | "suspended" | "invited";

export interface OrganizationMember extends Timestamps {
  id:             ID;
  organizationId: ID;
  userId:         ID;
  role:           SystemRole;
  customRoleId?:  ID;
  departmentId?:  ID;
  status:         MemberStatus;
  title?:         string;
  joinedAt:       ISODate;
}

export interface InviteMemberDto {
  email:         string;
  role:          SystemRole;
  customRoleId?: string;
}

export type UpdateMemberDto = Partial<{
  role:         SystemRole;
  customRoleId: string | null;
  departmentId: string | null;
  status:       MemberStatus;
  title:        string;
}>;

/* ─── Custom Roles ────────────────────────────────────────────────────────── */

export interface CustomRole extends Timestamps {
  id:             ID;
  organizationId: ID;
  name:           string;
  description:    string;
  permissions:    Permission[];
}

export interface CreateCustomRoleDto {
  name:         string;
  description?: string;
  permissions:  Permission[];
}

export type UpdateCustomRoleDto = Partial<CreateCustomRoleDto>;

/* ─── Departments ─────────────────────────────────────────────────────────── */

export interface Department extends Timestamps {
  id:             ID;
  organizationId: ID;
  name:           string;
}

/* ─── Teams ───────────────────────────────────────────────────────────────── */

export type TeamStatus = "active" | "archived";

export interface Team extends Timestamps {
  id:             ID;
  organizationId: ID;
  name:           string;
  description:    string;
  status:         TeamStatus;
}

export interface CreateTeamDto {
  name:         string;
  description?: string;
}

export type UpdateTeamDto = Partial<Pick<Team, "name" | "description" | "status">>;

export type TeamAssignmentKind = "employee" | "knowledge" | "workflow" | "member";

/* ─── Invitations ─────────────────────────────────────────────────────────── */

export type InvitationStatus = "pending" | "accepted" | "revoked" | "expired";

export interface Invitation extends Timestamps {
  id:             ID;
  organizationId: ID;
  email:          string;
  role:           SystemRole;
  customRoleId?:  ID;
  status:         InvitationStatus;
  invitedBy:      ID;
  expiresAt:      ISODate;
}

/* ─── Audit & Activity ────────────────────────────────────────────────────── */

export interface AuditLog {
  id:             ID;
  organizationId: ID;
  actorId:        ID;
  action:         string;
  resource:       string;
  resourceId?:    string;
  before?:        unknown;
  after?:         unknown;
  ip?:            string;
  userAgent?:     string;
  createdAt:      ISODate;
}

export type ActivityCategory =
  | "organization"
  | "member"
  | "team"
  | "employee"
  | "knowledge"
  | "workflow";

export interface ActivityLog {
  id:             ID;
  organizationId: ID;
  actorId:        ID;
  category:       ActivityCategory;
  verb:           string;
  targetType?:    string;
  targetId?:      string;
  summary:        string;
  metadata:       Record<string, unknown>;
  createdAt:      ISODate;
}
