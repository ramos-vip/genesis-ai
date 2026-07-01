"use client";

/**
 * React Query hooks for the Organization Center (EPIC-009).
 * Reads use queryKeys.organizations.*; mutations invalidate the whole
 * organizations subtree for simplicity and correctness.
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants";
import { organizationService } from "../services/organizationService";
import type {
  CreateOrganizationDto,
  InviteMemberDto,
  MemberListParams,
  UpdateMemberDto,
  UpdateOrganizationDto,
} from "../types";

/* ── Queries ── */

export function useMyOrganizations() {
  return useQuery({
    queryKey: queryKeys.organizations.list(),
    queryFn:  () => organizationService.getMyOrganizations(),
  });
}

export function useMyPermissions(orgId: string | null) {
  return useQuery({
    queryKey: queryKeys.organizations.permissions(orgId ?? "none"),
    queryFn:  () => organizationService.getMyPermissions(orgId as string),
    enabled:  !!orgId,
  });
}

export function useOrganizationMembers(orgId: string | null, params: MemberListParams) {
  return useQuery({
    queryKey: queryKeys.organizations.members(orgId ?? "none", params),
    queryFn:  () => organizationService.getMembers(orgId as string, params),
    enabled:  !!orgId,
  });
}

export function useInvitations(orgId: string | null) {
  return useQuery({
    queryKey: queryKeys.organizations.invitations(orgId ?? "none"),
    queryFn:  () => organizationService.getInvitations(orgId as string),
    enabled:  !!orgId,
  });
}

export function useActivityFeed(orgId: string | null, limit = 30) {
  return useQuery({
    queryKey: queryKeys.organizations.activity(orgId ?? "none"),
    queryFn:  () => organizationService.getActivity(orgId as string, limit),
    enabled:  !!orgId,
  });
}

/* ── Mutations ── */

function useInvalidateOrganizations() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.organizations.all() });
}

export function useCreateOrganization() {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (dto: CreateOrganizationDto) => organizationService.createOrganization(dto),
    onSuccess:  invalidate,
  });
}

export function useUpdateOrganization(orgId: string) {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (dto: UpdateOrganizationDto) => organizationService.updateOrganization(orgId, dto),
    onSuccess:  invalidate,
  });
}

export function useInviteMember(orgId: string) {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (dto: InviteMemberDto) => organizationService.inviteMember(orgId, dto),
    onSuccess:  invalidate,
  });
}

export function useResendInvitation(orgId: string) {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (invitationId: string) => organizationService.resendInvitation(orgId, invitationId),
    onSuccess:  invalidate,
  });
}

export function useRevokeInvitation(orgId: string) {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (invitationId: string) => organizationService.revokeInvitation(orgId, invitationId),
    onSuccess:  invalidate,
  });
}

export function useUpdateMember(orgId: string) {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (vars: { memberId: string; dto: UpdateMemberDto }) =>
      organizationService.updateMember(orgId, vars.memberId, vars.dto),
    onSuccess: invalidate,
  });
}

export function useRemoveMember(orgId: string) {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (memberId: string) => organizationService.removeMember(orgId, memberId),
    onSuccess:  invalidate,
  });
}

export function useTransferOwnership(orgId: string) {
  const invalidate = useInvalidateOrganizations();
  return useMutation({
    mutationFn: (memberId: string) => organizationService.transferOwnership(orgId, memberId),
    onSuccess:  invalidate,
  });
}
