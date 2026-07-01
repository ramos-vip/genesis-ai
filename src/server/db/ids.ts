/**
 * Server — ID & token generation
 *
 * Mirrors the private id scheme used by the employee repository, promoted to a
 * shared helper so every EPIC-009 repository produces consistent, prefixed ids.
 */

export function createId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, "").slice(0, 8)}`;
}

/** Opaque, URL-safe invitation token. */
export function createToken(): string {
  return `${crypto.randomUUID()}${crypto.randomUUID()}`.replace(/-/g, "");
}
