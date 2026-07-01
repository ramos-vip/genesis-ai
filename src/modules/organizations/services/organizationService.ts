"use client";

/**
 * Organization Service (client)
 *
 * Thin, typed wrapper over the EPIC-009 Server Actions. Components/hooks call
 * the service; the service calls the actions (RPC). Keeps React Query hooks free
 * of direct action imports and gives us one place to adapt call signatures.
 */

import {
  createOrganizationAction,
  getMyOrganizationsAction,
  getOrganizationAction,
  updateOrganizationAction,
} from "@/server/actions/organizations";
import {
  getActivityAction,
  getAuditAction,
  getInvitationsAction,
  getMembersAction,
  getMyPermissionsAction,
  inviteMemberAction,
  removeMemberAction,
  resendInvitationAction,
  revokeInvitationAction,
  transferOwnershipAction,
  updateMemberAction,
} from "@/server/actions/members";
import type {
  CreateOrganizationDto,
  InviteMemberDto,
  MemberListParams,
  UpdateMemberDto,
  UpdateOrganizationDto,
} from "../types";

export const organizationService = {
  getMyOrganizations: () => getMyOrganizationsAction(),
  getOrganization:    (orgId: string) => getOrganizationAction(orgId),
  createOrganization: (dto: CreateOrganizationDto) => createOrganizationAction(dto),
  updateOrganization: (orgId: string, dto: UpdateOrganizationDto) => updateOrganizationAction(orgId, dto),

  getMembers:       (orgId: string, params: MemberListParams) => getMembersAction(orgId, params),
  getMyPermissions: (orgId: string) => getMyPermissionsAction(orgId),

  inviteMember:     (orgId: string, dto: InviteMemberDto) => inviteMemberAction(orgId, dto),
  getInvitations:   (orgId: string) => getInvitationsAction(orgId),
  resendInvitation: (orgId: string, invitationId: string) => resendInvitationAction(orgId, invitationId),
  revokeInvitation: (orgId: string, invitationId: string) => revokeInvitationAction(orgId, invitationId),

  updateMember:      (orgId: string, memberId: string, dto: UpdateMemberDto) => updateMemberAction(orgId, memberId, dto),
  removeMember:      (orgId: string, memberId: string) => removeMemberAction(orgId, memberId),
  transferOwnership: (orgId: string, memberId: string) => transferOwnershipAction(orgId, memberId),

  getActivity: (orgId: string, limit?: number) => getActivityAction(orgId, limit),
  getAudit:    (orgId: string, limit?: number) => getAuditAction(orgId, limit),
};
