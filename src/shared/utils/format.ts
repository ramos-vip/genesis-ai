/**
 * Shared — Formatting Utilities
 *
 * Pure functions for displaying data. No side effects.
 */

/* ─── Numbers ────────────────────────────────────────────────────────────── */

export function formatNumber(
  value:   number,
  options: Intl.NumberFormatOptions = {}
): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

export function formatCurrency(
  value:    number,
  currency: string = "USD",
  compact:  boolean = false
): string {
  return new Intl.NumberFormat("en-US", {
    style:    "currency",
    currency,
    notation: compact ? "compact" : "standard",
  }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/* ─── Dates ──────────────────────────────────────────────────────────────── */

export function formatDate(
  date:   string | Date,
  format: "short" | "medium" | "long" | "relative" = "medium"
): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "relative") return formatRelativeTime(d);

  const optionsMap: Record<"short" | "medium" | "long", Intl.DateTimeFormatOptions> = {
    short:  { month: "short", day: "numeric", year: "numeric" },
    medium: { month: "long",  day: "numeric", year: "numeric" },
    long:   { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  };
  const options = optionsMap[format];

  return new Intl.DateTimeFormat("en-US", options).format(d);
}

export function formatRelativeTime(date: Date): string {
  const now      = Date.now();
  const diffMs   = now - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs  = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSecs < 60)  return "just now";
  if (diffMins < 60)  return `${diffMins}m ago`;
  if (diffHrs  < 24)  return `${diffHrs}h ago`;
  if (diffDays < 7)   return `${diffDays}d ago`;
  if (diffDays < 30)  return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const hrs  = Math.floor(mins / 60);

  if (hrs  > 0)  return `${hrs}h ${mins % 60}m`;
  if (mins > 0)  return `${mins}m ${secs % 60}s`;
  return `${secs}s`;
}

/* ─── Strings ────────────────────────────────────────────────────────────── */

export function truncate(str: string, maxLength: number, suffix = "…"): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function initials(name: string, max = 2): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, max)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
}

/** Mask a string except the last N characters */
export function mask(str: string, visibleEnd = 4, char = "•"): string {
  if (str.length <= visibleEnd) return str;
  return char.repeat(str.length - visibleEnd) + str.slice(-visibleEnd);
}

/* ─── File sizes ─────────────────────────────────────────────────────────── */

export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let value = bytes;
  while (value >= 1024 && i < units.length - 1) { value /= 1024; i++; }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
