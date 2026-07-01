"use client";

/**
 * usePermissions (EPIC-009)
 *
 * Resolves the current user's effective permissions for the active workspace
 * and exposes a can(resource, action) helper backed by the RBAC SSOT.
 */

import { useMemo } from "react";
import { can, type Action, type Permission, type Resource } from "../permissions";
import { useOrganization } from "../context/OrganizationProvider";
import { useMyPermissions } from "./useOrganizations";

export function usePermissions() {
  const { activeOrgId } = useOrganization();
  const { data, isLoading } = useMyPermissions(activeOrgId);
  const permissions: Permission[] = data ?? [];

  return useMemo(
    () => ({
      permissions,
      isLoading,
      can: (resource: Resource, action: Action) => can(permissions, resource, action),
    }),
    [permissions, isLoading]
  );
}
