"use client";

import type { ReactNode } from "react";
import type { Action, Resource } from "../permissions";
import { usePermissions } from "../hooks/usePermissions";

/**
 * Declaratively render children only when the current user can perform
 * `action` on `resource`. Renders `fallback` (default: nothing) otherwise.
 */
export function PermissionGate({
  resource,
  action,
  fallback = null,
  children,
}: {
  resource: Resource;
  action:   Action;
  fallback?: ReactNode;
  children:  ReactNode;
}) {
  const { can, isLoading } = usePermissions();
  if (isLoading) return null;
  return can(resource, action) ? <>{children}</> : <>{fallback}</>;
}
