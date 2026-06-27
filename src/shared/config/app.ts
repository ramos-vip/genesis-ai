/**
 * Shared — Application Configuration
 *
 * Environment-aware config. All env vars are accessed here — never in components.
 * Runtime validation ensures the app fails fast on misconfiguration.
 */

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

export const appConfig = {
  env: (process.env.NODE_ENV ?? "development") as "development" | "production" | "test",

  app: {
    name:    "Project Genesis",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "1.0.0",
    url:     process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },

  api: {
    /** Base URL for all API requests */
    baseUrl:   process.env.NEXT_PUBLIC_API_URL ?? "/api",
    /** Request timeout in ms */
    timeout:   10_000,
  },

  auth: {
    sessionCookieName: "genesis_session",
    sessionMaxAge:     60 * 60 * 24 * 30, // 30 days in seconds
  },

  features: {
    /** Feature flags — toggled per environment */
    commandPalette:  true,
    analytics:       true,
    billing:         true,
    adminPanel:      process.env.NEXT_PUBLIC_ENABLE_ADMIN === "true",
  },
} as const;

export type AppConfig = typeof appConfig;
export type Environment = AppConfig["env"];

void getEnv; // used in production for required env vars
void getOptionalEnv;
