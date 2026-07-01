/**
 * Shared — Route Constants
 *
 * Single source of truth for all application routes.
 * Never hardcode paths in components or navigation.
 */

export const ROUTES = {
  // ── Public ─────────────────────────────────────────
  HOME:    "/",
  PRICING: "/#pricing",
  DOCS:    "/docs",

  // ── Auth ───────────────────────────────────────────
  AUTH: {
    LOGIN:          "/login",
    SIGNUP:         "/signup",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL:   "/verify-email",
    CALLBACK:       "/auth/callback",
  },

  // ── App (protected) ──────────────────────────────────
  APP: {
    DASHBOARD:  "/dashboard",
    ORGANIZATION: {
      ROOT:     "/organization",
      MEMBERS:  "/organization/members",
      TEAMS:    "/organization/teams",
      ROLES:    "/organization/roles",
      SETTINGS: "/organization/settings",
      ACTIVITY: "/organization/activity",
      AUDIT:    "/organization/audit",
    },
    EMPLOYEES: {
      ROOT:    "/employees",
      NEW:     "/employees/new",
      DETAIL:  (id: string) => `/employees/${id}`,
      EDIT:    (id: string) => `/employees/${id}/edit`,
    },
    KNOWLEDGE: {
      ROOT:    "/knowledge",
      NEW:     "/knowledge/new",
      DETAIL:  (id: string) => `/knowledge/${id}`,
    },
    AUTOMATION: {
      ROOT:    "/automation",
      NEW:     "/automation/new",
      DETAIL:  (id: string) => `/automation/${id}`,
    },
    ANALYTICS:    "/analytics",
    MARKETPLACE:  "/marketplace",
    INTEGRATIONS: "/integrations",
    BILLING: {
      ROOT:     "/billing",
      PLANS:    "/billing/plans",
      INVOICES: "/billing/invoices",
    },
    SETTINGS: {
      ROOT:         "/settings",
      PROFILE:      "/settings/profile",
      ORGANIZATION: "/settings/organization",
      TEAM:         "/settings/team",
      INTEGRATIONS: "/settings/integrations",
      API:          "/settings/api",
    },
  },

  // ── Admin ──────────────────────────────────────────
  ADMIN: {
    ROOT:  "/admin",
    USERS: "/admin/users",
    ORGS:  "/admin/organizations",
    LOGS:  "/admin/logs",
  },
} as const;

/** Routes that are accessible without authentication */
export const PUBLIC_ROUTES: string[] = [
  ROUTES.HOME,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.CALLBACK,
];

/** Routes that require admin role */
export const ADMIN_ROUTES: string[] = [
  ROUTES.ADMIN.ROOT,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.ORGS,
  ROUTES.ADMIN.LOGS,
];
