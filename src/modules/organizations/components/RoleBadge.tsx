"use client";

import { Badge } from "@/components/ui";
import type { BadgeVariant } from "@/components/ui";
import { ROLE_LABELS, type SystemRole } from "../permissions";

const ROLE_VARIANT: Record<SystemRole, BadgeVariant> = {
  owner:   "danger",
  admin:   "primary",
  manager: "info",
  member:  "default",
  viewer:  "outline",
  billing: "warning",
  support: "success",
};

export function RoleBadge({ role }: { role: SystemRole }) {
  return (
    <Badge variant={ROLE_VARIANT[role] ?? "default"} size="sm">
      {ROLE_LABELS[role] ?? role}
    </Badge>
  );
}
