"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, Badge, Button, Input, Select, Spinner } from "@/components/ui";
import { formatDate, initials } from "@/shared/utils/format";
import { RoleBadge } from "./RoleBadge";
import { InviteMemberModal } from "./InviteMemberModal";
import { usePermissions } from "../hooks/usePermissions";
import {
  useInvitations,
  useOrganizationMembers,
  useRemoveMember,
  useResendInvitation,
  useRevokeInvitation,
  useTransferOwnership,
  useUpdateMember,
} from "../hooks/useOrganizations";
import { ROLE_LABELS, SYSTEM_ROLES, type SystemRole } from "../permissions";
import type { MemberStatus } from "../types";

const PER_PAGE = 10;

export function MembersPanel({ orgId }: { orgId: string }) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);

  // Debounce the search box (300ms) without external deps.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const params = useMemo(
    () => ({
      page,
      perPage: PER_PAGE,
      search: search || undefined,
      role: role as SystemRole | "all",
      status: status as MemberStatus | "all",
    }),
    [page, search, role, status]
  );

  const { data, isLoading, isError, error } = useOrganizationMembers(orgId, params);
  const invitationsQuery = useInvitations(orgId);
  const { can } = usePermissions();

  const updateMember = useUpdateMember(orgId);
  const removeMember = useRemoveMember(orgId);
  const transferOwnership = useTransferOwnership(orgId);
  const resendInvitation = useResendInvitation(orgId);
  const revokeInvitation = useRevokeInvitation(orgId);

  const members = data?.items ?? [];
  const meta = data?.meta;
  const pendingInvites = (invitationsQuery.data ?? []).filter((i) => i.status === "pending");

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search members…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            size="md"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
            className="min-w-[130px]"
          >
            <option value="all">All roles</option>
            {SYSTEM_ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </Select>
          <Select
            size="md"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="min-w-[130px]"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </Select>
          {can("invitations", "create") && (
            <Button onClick={() => setInviteOpen(true)}>Invite</Button>
          )}
        </div>
      </div>

      {/* Members table */}
      <div className="rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Spinner label="Loading members…" />
          </div>
        ) : isError ? (
          <p className="p-6 text-sm text-danger">
            {(error as Error)?.message ?? "Failed to load members"}
          </p>
        ) : members.length === 0 ? (
          <p className="p-6 text-sm text-text-muted">No members match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-text-muted">
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const isOwner = m.role === "owner";
                  const label = m.title || m.userId;
                  return (
                    <tr key={m.id} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={initials(label)} size="sm" />
                          <div className="min-w-0">
                            <p className="font-medium text-text-primary truncate max-w-[200px]">{label}</p>
                            <p className="text-xs text-text-muted truncate max-w-[200px]">{m.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isOwner || !can("roles", "update") ? (
                          <RoleBadge role={m.role} />
                        ) : (
                          <Select
                            size="sm"
                            value={m.role}
                            className="min-w-[120px]"
                            onChange={(e) =>
                              updateMember.mutate({
                                memberId: m.id,
                                dto: { role: e.target.value as SystemRole },
                              })
                            }
                          >
                            {SYSTEM_ROLES.filter((r) => r !== "owner").map((r) => (
                              <option key={r} value={r}>
                                {ROLE_LABELS[r]}
                              </option>
                            ))}
                          </Select>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            m.status === "active"
                              ? "success"
                              : m.status === "suspended"
                              ? "warning"
                              : "default"
                          }
                          size="sm"
                        >
                          {m.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {formatDate(m.joinedAt, "relative")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isOwner && can("members", "update") && (
                            m.status === "active" ? (
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  updateMember.mutate({ memberId: m.id, dto: { status: "suspended" } })
                                }
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button
                                size="xs"
                                variant="ghost"
                                onClick={() =>
                                  updateMember.mutate({ memberId: m.id, dto: { status: "active" } })
                                }
                              >
                                Reactivate
                              </Button>
                            )
                          )}
                          {!isOwner && can("organization", "manage") && (
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Transfer ownership to ${label}? You will become an admin.`
                                  )
                                )
                                  transferOwnership.mutate(m.id);
                              }}
                            >
                              Make owner
                            </Button>
                          )}
                          {!isOwner && can("members", "delete") && (
                            <Button
                              size="xs"
                              variant="danger"
                              onClick={() => {
                                if (window.confirm(`Remove ${label}?`)) removeMember.mutate(m.id);
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            Page {meta.page} of {meta.totalPages} · {meta.total} members
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={meta.page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={!meta.hasMore}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Pending invitations */}
      {pendingInvites.length > 0 && (
        <div className="rounded-xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Pending invitations</h3>
          <ul className="divide-y divide-border/60">
            {pendingInvites.map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary truncate">{inv.email}</p>
                  <p className="text-xs text-text-muted">Invited {formatDate(inv.createdAt, "relative")}</p>
                </div>
                <RoleBadge role={inv.role} />
                {can("invitations", "create") && (
                  <Button size="xs" variant="ghost" onClick={() => resendInvitation.mutate(inv.id)}>
                    Resend
                  </Button>
                )}
                {can("invitations", "update") && (
                  <Button size="xs" variant="danger" onClick={() => revokeInvitation.mutate(inv.id)}>
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <InviteMemberModal orgId={orgId} open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
