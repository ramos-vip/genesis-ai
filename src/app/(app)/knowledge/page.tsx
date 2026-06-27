import type { Metadata } from "next";
import PageHeader from "@/shared/components/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/shared/components/EmptyState";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Knowledge Base" };

export default function KnowledgePage() {
  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        description="Documents and data your AI employees learn from."
        breadcrumb={[{ label: "Dashboard", href: ROUTES.APP.DASHBOARD }, { label: "Knowledge" }]}
        actions={<Button size="sm" href={ROUTES.APP.KNOWLEDGE.NEW}>Upload Document</Button>}
      />
      <EmptyState
        title="Knowledge base is empty"
        description="Upload documents, PDFs, or connect data sources to train your AI employees."
        action={{ label: "Upload Document", href: ROUTES.APP.KNOWLEDGE.NEW }}
      />
    </div>
  );
}
