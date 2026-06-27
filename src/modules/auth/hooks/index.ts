"use client";

import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ROUTES } from "@/shared/constants";
import { toId } from "@/shared/types";
import type { User } from "../types";

/**
 * Returns the currently signed-in user mapped to our domain User type.
 * Returns null while loading or when not authenticated.
 */
export function useCurrentUser(): { user: User | null; isLoaded: boolean } {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) return { user: null, isLoaded };

  const mapped: User = {
    id:             toId(user.id),
    email:          user.primaryEmailAddress?.emailAddress ?? "",
    name:           user.fullName ?? user.username ?? "User",
    avatar:         user.imageUrl ?? undefined,
    role:           (user.publicMetadata?.role as User["role"]) ?? "member",
    organizationId: toId((user.publicMetadata?.organizationId as string) ?? ""),
    emailVerified:  !!user.primaryEmailAddress?.verification?.status,
    lastActiveAt:   user.lastSignInAt?.toISOString() as User["lastActiveAt"],
    createdAt:      user.createdAt?.toISOString() as User["createdAt"],
    updatedAt:      user.updatedAt?.toISOString() as User["updatedAt"],
  };

  return { user: mapped, isLoaded: true };
}

/**
 * Returns authentication state: whether the user is loaded and signed in.
 */
export function useAuthState(): {
  isLoaded:      boolean;
  isSignedIn:    boolean;
  userId:        string | null;
  sessionId:     string | null;
} {
  const { isLoaded, isSignedIn, userId, sessionId } = useAuth();
  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    userId:     userId ?? null,
    sessionId:  sessionId ?? null,
  };
}

/**
 * Returns a sign-out function that clears the session and redirects to login.
 */
export function useSignOut(): { signOut: () => Promise<void>; isPending: boolean } {
  const { signOut } = useClerk();
  const router      = useRouter();

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.push(ROUTES.AUTH.LOGIN);
  }, [signOut, router]);

  return { signOut: handleSignOut, isPending: false };
}
