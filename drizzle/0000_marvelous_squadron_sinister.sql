CREATE TABLE "employees" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"system_instructions" text DEFAULT '' NOT NULL,
	"tone_of_voice" text DEFAULT 'professional' NOT NULL,
	"temperature" real DEFAULT 0.5 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "employees_clerk_user_id_idx" ON "employees" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "employees_status_idx" ON "employees" USING btree ("clerk_user_id","status");