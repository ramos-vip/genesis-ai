/**
 * cn — ClassName utility
 *
 * Merges class strings, filtering out falsy values.
 * Compatible with Tailwind v4 (no tailwind-merge needed for v4's cascade).
 */

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input && input !== 0) continue;
    if (typeof input === "string") {
      classes.push(input.trim());
    } else if (typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    }
  }

  return classes.join(" ");
}
