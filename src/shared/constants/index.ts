export * from "./routes";
export * from "./queryKeys";

/** Application-wide magic strings (none! use these constants instead) */
export const APP_NAME = "Project Genesis" as const;
export const APP_VERSION = "1.0.0" as const;

/** Local storage keys */
export const STORAGE_KEYS = {
  SIDEBAR_COLLAPSED: "genesis:sidebar:collapsed",
  THEME:             "genesis:theme",
  LAST_VISITED:      "genesis:last-visited",
} as const;

/** Default pagination */
export const PAGINATION = {
  DEFAULT_PAGE:     1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE:     100,
} as const;
