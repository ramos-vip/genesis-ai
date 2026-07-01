/**
 * RBAC Authorization Guard (EPIC-009)
 *
 * The single choke-point for org-scoped authorization. Server Actions call
 * requireMembership / requirePermission before any mutation. Effective
 * permissions come from memberRepository (system role or custom role) and are
 * evaluated by can() from the RBAC single source of truth.
 */

import { getRequestContext, requireUserId } from "./context";
import type { RequestContext } from "./context";
import { memberRepository } from "@/server/repositories/memberRepository";
import {
  can,
  type Action,
  type Permission,
  type Resource,
  type SystemRole,
} from "@/modules/organizations/permissions";

export { requireUserId };

export interface AuthContext extends RequestContext {
  orgId:       string;
  memberId:    string;
  role:        SystemRole;
  permissions: Permission[];
}

export async function requireMembership(orgId: string): Promise<AuthContext> {
  const ctx = await getRequestContext();
  const membership = await memberRepository.getMembership(orgId, ctx.userId);
  if (!membership || membership.status !== "active") {
    throw new Error("Forbidden: you are not an active member of this organization");
  }
  const permissions = await memberRepository.getEffectivePermissions(membership);
  return {
    ...ctx,
    orgId,
    memberId:    membership.id,
    role:        membership.role as SystemRole,
    permissions,
  };
}

export async function requirePermission(
  orgId: string,
  resource: Resource,
  action: Action
): Promise<AuthContext> {
  const authCtx = await requireMembership(orgId);
  if (!can(authCtx.permissions, resource, action)) {
    throw new Error(`Forbidden: missing permission ${resource}:${action}`);
  }
  return authCtx;
}
