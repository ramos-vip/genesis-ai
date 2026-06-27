import { defineConfig } from "drizzle-kit";

export default defineConfig({
  /** Schema file — Drizzle Kit reads this to generate migrations */
  schema: "./src/server/db/schema.ts",

  /** Output directory for generated SQL migration files */
  out: "./drizzle",

  dialect: "postgresql",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  /** Include detailed introspection logs in output */
  verbose: true,
  strict:  true,
});
