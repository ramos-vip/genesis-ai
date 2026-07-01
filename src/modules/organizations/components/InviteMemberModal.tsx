"use client";

import { useState } from "react";
import { Button, Input, Modal, Select } from "@/components/ui";
import { useInviteMember } from "../hooks/useOrganizations";
import { ROLE_LABELS, type SystemRole } from "../permissions";

const INVITE_ROLES: SystemRole[] = ["admin", "manager", "member", "viewer", "billing", "support"];

export function InviteMemberModal({
  orgId,
  open,
  onClose,
}: {
  orgId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<SystemRole>("member");
  const mutation = useInviteMember(orgId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await mutation.mutateAsync({ email: email.trim(), role });
    setEmail("");
    setRole("member");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Invite member" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@company.com"
          autoFocus
          required
        />
        <Select label="Role" value={role} onChange={(e) => setRole(e.target.value as SystemRole)}>
          {INVITE_ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </Select>
        {mutation.isError && (
          <p className="text-sm text-danger">{(mutation.error as Error)?.message}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending} disabled={!email.trim()}>
            Send invite
          </Button>
        </div>
      </form>
    </Modal>
  );
}
