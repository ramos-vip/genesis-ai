/**
 * RBAC — Single Source of Truth
 *
 * Every permission decision in Genesis AI flows through this module.
 * Resources and actions are defined once; system roles map to permission sets;
 * custom roles supply their own permission arrays. `can()` is the only authority
 * used by server guards, UI gating, and API middleware.
 *
 * Extensible by design: add a Resource to RESOURCES and grant it in
 * ROLE_PERMISSIONS — no other file needs to change.
 */

/* ─── Resources ───────────────────────────────────────────────────────────── */

export const RESOURCES = [
  // Organization management
  "organization",
  "teams",
  "members",
  "roles",
  "invitations",
  "departments",
  "audit",
  // Product surfaces
  "employees",
  "knowledge",
  "marketplace",
  "billing",
  "analytics",
  "automation",
  "settings",
  "integrations",
  "api",
  "voice",
] as const;

export type Resource = (typeof RESOURCES)[number];

/* ─── Actions ─────────────────────────────────────────────────────────────── */

export const ACTIONS = ["view", "create", "update", "delete", "manage"] as const;
export type Action = (typeof ACTIONS)[number];

/* ─── Permission strings ──────────────────────────────────────────────────── */

/** e.g. "employees:view", "knowledge:*", or the super-wildcard "*" */
export type Permission = "*" | `${Resource}:*` | `${Resource}:${Action}`;

/* ─── System roles ────────────────────────────────────────────────────────── */

export const SYSTEM_ROLES = [
  "owner",
  "admin",
  "manager",
  "member",
  "viewer",
  "billing",
  "support",
] as const;

export type SystemRole = (typeof SYSTEM_ROLES)[number];

export const ROLE_LABELS: Record<SystemRole, string> = {
  owner:   "Owner",
  admin:   "Admin",
  manager: "Manager",
  member:  "Member",
  viewer:  "Viewer",
  billing: "Billing",
  support: "Support",
};

/* ─── Helpers to build permission sets ────────────────────────────────────── */

const ALL_PRODUCT_RESOURCES: Resource[] = [
  "employees", "knowledge", "marketplace", "billing",
  "analytics", "automation", "settings", "integrations", "api", "voice",
];

function viewAll(resources: Resource[]): Permission[] {
  return resources.map((r) => `${r}:view` as Permission);
}

/* ─── Role → Permission matrix ────────────────────────────────────────────── */

export const ROLE_PERMISSIONS: Record<SystemRole, Permission[]> = {
  // Full control over everything, including org deletion & ownership transfer.
  owner: ["*"],

  // Everything except destroying the org or transferring ownership.
  admin: [
    "organization:view", "organization:update",
    "teams:*", "members:*", "roles:*", "invitations:*", "departments:*",
    "audit:view",
    "employees:*", "knowledge:*", "marketplace:*", "analytics:*",
    "automation:*", "settings:*", "integrations:*", "api:*", "voice:*",
    "billing:view",
  ],

  // Operational lead: runs teams & product surfaces, no org-level admin.
  manager: [
    "organization:view",
    "teams:view", "teams:update",
    "members:view",
    "departments:view",
    "employees:*", "knowledge:*", "automation:*", "marketplace:view",
    "analytics:view", "integrations:view", "api:view", "voice:*",
  ],

  // Individual contributor: works within product surfaces.
  member: [
    "organization:view",
    "teams:view", "members:view",
    "employees:view", "employees:create", "employees:update",
    "knowledge:view", "knowledge:create", "knowledge:update",
    "automation:view", "automation:create", "automation:update",
    "marketplace:view", "analytics:view", "voice:view",
  ],

  // Read-only across the platform.
  viewer: [
    "organization:view", "teams:view", "members:view",
    ...viewAll(ALL_PRODUCT_RESOURCES),
  ],

  // Finance: full billing, read-only context.
  billing: [
    "organization:view", "billing:*", "analytics:view", "members:view",
  ],

  // Support: assist with employees & knowledge, read-only elsewhere.
  support: [
    "organization:view", "members:view",
    "employees:view", "employees:update",
    "knowledge:view", "knowledge:update",
    "analytics:view", "voice:view",
  ],
};

/* ─── Permission checks ───────────────────────────────────────────────────── */

/** Type guard — validates an arbitrary string is a well-formed Permission. */
export function isPermission(value: string): value is Permission {
  if (value === "*") return true;
  const [resource, action] = value.split(":");
  if (!resource || !action) return false;
  if (!(RESOURCES as readonly string[]).includes(resource)) return false;
  return action === "*" || (ACTIONS as readonly string[]).includes(action);
}

/**
 * Core authority. Returns true when `permissions` grant `action` on `resource`.
 *
 * Resolution order (any match wins):
 *   1. "*"                     → super admin
 *   2. "<resource>:*"          → full control of the resource
 *   3. "<resource>:<action>"   → exact grant
 *   4. "<resource>:manage"     → implies view/create/update/delete
 */
export function can(
  permissions: readonly Permission[],
  resource: Resource,
  action: Action
): boolean {
  if (permissions.includes("*")) return true;
  if (permissions.includes(`${resource}:*` as Permission)) return true;
  if (permissions.includes(`${resource}:${action}` as Permission)) return true;
  if (action !== "manage" && permissions.includes(`${resource}:manage` as Permission)) {
    return true;
  }
  return false;
}

/** Resolve the effective permission set for a member. */
export function resolvePermissions(
  role: SystemRole,
  customPermissions?: readonly Permission[] | null
): Permission[] {
  if (customPermissions && customPermissions.length > 0) {
    return [...customPermissions];
  }
  return [...(ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.member)];
}

/** True when `role` is one of the built-in system roles. */
export function isSystemRole(role: string): role is SystemRole {
  return (SYSTEM_ROLES as readonly string[]).includes(role);
}
