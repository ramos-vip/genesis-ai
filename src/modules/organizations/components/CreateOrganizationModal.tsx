"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import { useCreateOrganization } from "../hooks/useOrganizations";
import { useOrganization } from "../context/OrganizationProvider";

export function CreateOrganizationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const { setActiveOrgId } = useOrganization();
  const mutation = useCreateOrganization();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const org = await mutation.mutateAsync({ name: name.trim() });
    setActiveOrgId(org.id);
    setName("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Create workspace" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Acme Inc."
          autoFocus
          required
        />
        {mutation.isError && (
          <p className="text-sm text-danger">{(mutation.error as Error)?.message}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending} disabled={name.trim().length < 2}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
}
