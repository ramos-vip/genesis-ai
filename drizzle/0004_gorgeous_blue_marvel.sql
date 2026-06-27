CREATE TABLE "knowledge_chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"knowledge_source_id" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"content" text NOT NULL,
	"token_count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "chunks_source_idx" ON "knowledge_chunks" USING btree ("knowledge_source_id");--> statement-breakpoint
CREATE INDEX "chunks_source_order_idx" ON "knowledge_chunks" USING btree ("knowledge_source_id","chunk_index");