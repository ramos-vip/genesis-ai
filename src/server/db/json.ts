/**
 * Server — JSON column helpers
 *
 * EPIC-009 stores settings / permissions / metadata / audit snapshots as JSON
 * text columns (matching the existing `meta` convention). These helpers keep
 * parse/stringify behaviour consistent and never throw on malformed data.
 */

export function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function stringifyJson(value: unknown): string {
  return JSON.stringify(value ?? null);
}
