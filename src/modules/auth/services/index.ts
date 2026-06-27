/**
 * Auth Service
 *
 * Server-side auth helpers wrapping Clerk's server SDK.
 * Import from '@/modules/auth/services' in Server Components and Route Handlers.
 *
 * Note: This file is server-only. Do not import in Client Components.
 */

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/constants";
import { toId } from "@/shared/types";
import type { User } from "../types";

/**
 * Require authentication in a Server Component.
 * Redirects to login if the user is not signed in.
 * Returns the raw Clerk auth object for the authenticated session.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session.userId) redirect(ROUTES.AUTH.LOGIN);
  return session;
}

/**
 * Get the current user as our domain User type.
 * Returns null if not authenticated.
 */
export async function getUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  return {
    id:             toId(clerkUser.id),
    email:          clerkUser.emailAddresses[0]?.emailAddress ?? "",
    name:           [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || clerkUser.username || "User",
    avatar:         clerkUser.imageUrl ?? undefined,
    role:           (clerkUser.publicMetadata?.role as User["role"]) ?? "member",
    organizationId: toId((clerkUser.publicMetadata?.organizationId as string) ?? ""),
    emailVerified:  clerkUser.emailAddresses[0]?.verification?.status === "verified",
    lastActiveAt:   clerkUser.lastActiveAt ? new Date(clerkUser.lastActiveAt).toISOString() as User["lastActiveAt"] : undefined,
    createdAt:      new Date(clerkUser.createdAt).toISOString() as User["createdAt"],
    updatedAt:      new Date(clerkUser.updatedAt).toISOString() as User["updatedAt"],
  };
}

/**
 * Check if the current user has a specific role.
 * Returns false if not authenticated or role doesn't match.
 */
export async function hasRole(role: User["role"]): Promise<boolean> {
  const user = await getUser();
  return user?.role === role;
}
