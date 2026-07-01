/**
 * Server — Request context
 *
 * Centralises authentication + request metadata capture for Server Actions.
 * IP and User-Agent are best-effort placeholders sourced from forwarded headers
 * (fulfils the EPIC-009 audit requirement for who / from where).
 */

import { auth } from "@clerk/nextjs/server";
import { headers } from "next/headers";

export interface RequestContext {
  userId: string;
  ip: string | null;
  userAgent: string | null;
}

/** Throws when the caller is not authenticated. */
export async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getRequestContext(): Promise<RequestContext> {
  const userId = await requireUserId();
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() ?? null : h.get("x-real-ip") ?? null;
  const userAgent = h.get("user-agent") ?? null;
  return { userId, ip, userAgent };
}
