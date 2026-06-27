CREATE TABLE "knowledge_embeddings" (
	"chunk_id" text PRIMARY KEY NOT NULL,
	"embedding" text NOT NULL,
	"model" text NOT NULL,
	"dimensions" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "embeddings_chunk_idx" ON "knowledge_embeddings" USING btree ("chunk_id");