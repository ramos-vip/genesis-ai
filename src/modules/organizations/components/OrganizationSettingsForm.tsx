"use client";

import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { usePermissions } from "../hooks/usePermissions";
import { useUpdateOrganization } from "../hooks/useOrganizations";
import type { Organization, OrganizationPlan, OrganizationStatus } from "../types";

const PLANS: OrganizationPlan[] = ["free", "pro", "business", "enterprise"];
const STATUSES: OrganizationStatus[] = ["active", "suspended"];

export function OrganizationSettingsForm({ org }: { org: Organization }) {
  const { can } = usePermissions();
  const canEdit = can("organization", "update");
  const mutation = useUpdateOrganization(org.id);

  const [name, setName] = useState(org.name);
  const [plan, setPlan] = useState<string>(org.plan);
  const [status, setStatus] = useState<string>(org.status);
  const [saved, setSaved] = useState(false);

  const dirty = name.trim() !== org.name || plan !== org.plan || status !== org.status;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    await mutation.mutateAsync({
      name: name.trim(),
      plan: plan as OrganizationPlan,
      status: status as OrganizationStatus,
    });
    setSaved(true);
  }

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-5">
      <div className="rounded-xl border border-border p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">General</h3>
        <Input
          label="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!canEdit}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Plan" value={plan} onChange={(e) => setPlan(e.target.value)} disabled={!canEdit}>
            {PLANS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={!canEdit}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <p className="text-xs text-text-muted">
          Slug: <span className="font-mono">/{org.slug}</span>
        </p>
      </div>

      {canEdit ? (
        <div className="flex items-center gap-3">
          <Button type="submit" loading={mutation.isPending} disabled={!dirty}>
            Save changes
          </Button>
          {mutation.isError && (
            <span className="text-sm text-danger">{(mutation.error as Error)?.message}</span>
          )}
          {saved && !mutation.isPending && !mutation.isError && (
            <span className="text-sm text-success">Saved</span>
          )}
        </div>
      ) : (
        <p className="text-xs text-text-muted">You have read-only access to organization settings.</p>
      )}
    </form>
  );
}
