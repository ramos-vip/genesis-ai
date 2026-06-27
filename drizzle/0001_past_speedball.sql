CREATE TABLE "knowledge_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'ready' NOT NULL,
	"meta" text DEFAULT '{}' NOT NULL,
	"chunk_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "knowledge_sources_clerk_user_id_idx" ON "knowledge_sources" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "knowledge_sources_type_idx" ON "knowledge_sources" USING btree ("clerk_user_id","type");