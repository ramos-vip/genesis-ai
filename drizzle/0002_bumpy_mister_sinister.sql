CREATE TABLE "employee_knowledge_sources" (
	"employee_id" text NOT NULL,
	"knowledge_source_id" text NOT NULL,
	"clerk_user_id" text NOT NULL,
	"linked_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employee_knowledge_sources_employee_id_knowledge_source_id_pk" PRIMARY KEY("employee_id","knowledge_source_id")
);
--> statement-breakpoint
CREATE INDEX "eks_employee_idx" ON "employee_knowledge_sources" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "eks_source_idx" ON "employee_knowledge_sources" USING btree ("knowledge_source_id");