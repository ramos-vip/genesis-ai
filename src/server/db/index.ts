/**
 * Database Connection — Neon + Drizzle
 *
 * Uses neon-http (HTTP transport) for edge-compatible, serverless connections.
 * A new HTTP request is made per query — no persistent connection pool needed.
 * This is the recommended approach for Next.js + Neon.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDatabase() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      [
        "DATABASE_URL is not set.",
        "Copy .env.local.example to .env.local and add your Neon connection string.",
        "Get it from: https://console.neon.tech → your project → Connection Details",
      ].join("\n")
    );
  }

  const sql = neon(url);
  return drizzle(sql, { schema });
}

/**
 * Drizzle database instance — import this wherever you need to run queries.
 *
 * Lazy-evaluated: throws only when a query is attempted, not at module load.
 * This keeps the build from failing if DATABASE_URL is absent in CI/CD environments
 * that don't supply runtime env vars at build time.
 */
let _db: ReturnType<typeof createDatabase> | null = null;

export function getDb() {
  if (!_db) _db = createDatabase();
  return _db;
}

/** Convenience re-export of schema types */
export * from "./schema";
