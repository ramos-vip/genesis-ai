/**
 * Shared — TanStack Query Key Factory
 *
 * Centralised, typed query keys. Using factory functions ensures:
 * - No typos (TypeScript checks the key shape)
 * - Easy invalidation by prefix: queryClient.invalidateQueries({ queryKey: queryKeys.employees.all() })
 * - Consistent cache segmentation
 */

export const queryKeys = {
  // ── Auth ───────────────────────────────────────────────
  auth: {
    session: ()  => ["auth", "session"] as const,
    user:    ()  => ["auth", "user"]    as const,
  },

  // ── Employees ─────────────────────────────────────────
  employees: {
    all:    ()         => ["employees"]              as const,
    list:   (params?:  object) => ["employees", "list", params] as const,
    detail: (id: string) => ["employees", id]        as const,
    stats:  ()         => ["employees", "stats"]     as const,
  },

  // ── Knowledge ─────────────────────────────────────────
  knowledge: {
    all:    ()           => ["knowledge"]               as const,
    list:   (params?: object) => ["knowledge", "list", params] as const,
    detail: (id: string)  => ["knowledge", id]          as const,
  },

  // ── Automation ───────────────────────────────────────
  automation: {
    all:    ()           => ["automation"]                  as const,
    list:   (params?: object) => ["automation", "list", params] as const,
    detail: (id: string)  => ["automation", id]             as const,
    runs:   (id: string)  => ["automation", id, "runs"]     as const,
  },

  // ── Analytics ─────────────────────────────────────────
  analytics: {
    overview:    (period?: string) => ["analytics", "overview", period] as const,
    employees:   (id: string)      => ["analytics", "employees", id]    as const,
    usage:       (period?: string) => ["analytics", "usage", period]    as const,
  },

  // ── Billing ───────────────────────────────────────────
  billing: {
    subscription: () => ["billing", "subscription"] as const,
    invoices:     () => ["billing", "invoices"]     as const,
    plans:        () => ["billing", "plans"]        as const,
    usage:        () => ["billing", "usage"]        as const,
  },

  // ── Organizations (EPIC-009) ──────────────────────────────────
  organizations: {
    all:         ()                          => ["organizations"]                          as const,
    list:        ()                          => ["organizations", "list"]                  as const,
    detail:      (id: string)                => ["organizations", id]                      as const,
    permissions: (id: string)                => ["organizations", id, "permissions"]       as const,
    members:     (id: string, params?: object) => ["organizations", id, "members", params]  as const,
    invitations: (id: string)                => ["organizations", id, "invitations"]       as const,
    activity:    (id: string)                => ["organizations", id, "activity"]          as const,
    audit:       (id: string)                => ["organizations", id, "audit"]             as const,
  },

  // ── Settings ───────────────────────────────────────────
  settings: {
    profile:      () => ["settings", "profile"]      as const,
    organization: () => ["settings", "organization"] as const,
    team:         () => ["settings", "team"]         as const,
    integrations: () => ["settings", "integrations"] as const,
    apiKeys:      () => ["settings", "api-keys"]     as const,
  },
} as const;
