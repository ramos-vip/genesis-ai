-- Project Genesis — Initial Migration
-- Sprint 7: Employee persistence with Neon PostgreSQL
-- Generated for reference; run via: npm run db:migrate

CREATE TABLE IF NOT EXISTS "employees" (
  "id"                  text        PRIMARY KEY,
  "clerk_user_id"       text        NOT NULL,
  "name"                text        NOT NULL,
  "role"                text        NOT NULL,
  "description"         text        NOT NULL DEFAULT '',
  "status"              text        NOT NULL DEFAULT 'active',
  "system_instructions" text        NOT NULL DEFAULT '',
  "tone_of_voice"       text        NOT NULL DEFAULT 'professional',
  "temperature"         real        NOT NULL DEFAULT 0.5,
  "created_at"          timestamptz NOT NULL DEFAULT now(),
  "updated_at"          timestamptz NOT NULL DEFAULT now()
);

-- Indexes for the most common access patterns
CREATE INDEX IF NOT EXISTS "employees_clerk_user_id_idx"
  ON "employees" ("clerk_user_id");

CREATE INDEX IF NOT EXISTS "employees_status_idx"
  ON "employees" ("clerk_user_id", "status");
