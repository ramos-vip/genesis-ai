"use client";

import { useState } from "react";
import { Badge, Button, Spinner, Tabs } from "@/components/ui";
import { useOrganization } from "../context/OrganizationProvider";
import { OrganizationSettingsForm } from "./OrganizationSettingsForm";
import { MembersPanel } from "./MembersPanel";
import { PermissionMatrix } from "./PermissionMatrix";
import { ActivityFeed } from "./ActivityFeed";
import { CreateOrganizationModal } from "./CreateOrganizationModal";

/**
 * Organization Center (EPIC-009 — Phase 2)
 *
 * The product surface that ties the vertical slice together: overview/settings,
 * member management + invitations, the RBAC permission matrix, and the activity
 * feed — all scoped to the active workspace from OrganizationProvider.
 */
export function OrganizationCenter() {
  const { activeOrg, isLoading } = useOrganization();
  const [createOpen, setCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" label="Loading organization…" />
      </div>
    );
  }

  if (!activeOrg) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-7 h-7"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 20V6a1 1 0 011-1h7a1 1 0 011 1v14M13 20v-9h4a1 1 0 011 1v8M3 20h18M7.5 8h2M7.5 11h2M7.5 14h2"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-text-primary">No workspace yet</h2>
        <p className="mt-1 text-sm text-text-secondary max-w-sm">
          Create your first organization to invite teammates, assign roles and manage everything in
          one place.
        </p>
        <Button className="mt-5" onClick={() => setCreateOpen(true)}>
          Create workspace
        </Button>
        <CreateOrganizationModal open={createOpen} onClose={() => setCreateOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-text-primary truncate">{activeOrg.name}</h1>
            <Badge variant="outline" size="sm">
              {activeOrg.plan}
            </Badge>
            <Badge variant={activeOrg.status === "active" ? "success" : "warning"} size="sm">
              {activeOrg.status}
            </Badge>
          </div>
          <p className="text-sm text-text-muted mt-0.5 font-mono">/{activeOrg.slug}</p>
        </div>
      </header>

      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="members">Members</Tabs.Tab>
          <Tabs.Tab value="roles">Roles &amp; Permissions</Tabs.Tab>
          <Tabs.Tab value="activity">Activity</Tabs.Tab>
        </Tabs.List>
        <div className="mt-6">
          <Tabs.Panel value="overview">
            <OrganizationSettingsForm org={activeOrg} />
          </Tabs.Panel>
          <Tabs.Panel value="members">
            <MembersPanel orgId={activeOrg.id} />
          </Tabs.Panel>
          <Tabs.Panel value="roles">
            <PermissionMatrix />
          </Tabs.Panel>
          <Tabs.Panel value="activity">
            <ActivityFeed orgId={activeOrg.id} />
          </Tabs.Panel>
        </div>
      </Tabs.Root>
    </div>
  );
}
