/**
 * Shared — Type Assertion Utilities
 *
 * Runtime guards that narrow types. Use instead of `as` casts.
 */

/** Asserts a condition is true. Throws in development, no-ops in production builds. */
export function assert(
  condition: boolean,
  message:   string
): asserts condition {
  if (!condition) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error(`Assertion failed: ${message}`);
    }
  }
}

/** Marks code that should never be reached. Useful for exhaustive switch/if. */
export function unreachable(value: never, message?: string): never {
  throw new Error(message ?? `Unexpected value: ${String(value)}`);
}

/** Type guard for non-null, non-undefined values. Useful in .filter() chains. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** Type guard for checking if an unknown value is an object */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Type guard for Error instances */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/** Safe JSON parse — returns null on failure */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
