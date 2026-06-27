import type { Metadata } from "next";
import PageHeader    from "@/shared/components/PageHeader";
import { KnowledgeGrid } from "@/modules/knowledge";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Knowledge Base" };

export default function KnowledgePage() {
  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        description="Text, URLs, and documents your AI employees learn from."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Knowledge" },
        ]}
      />
      <KnowledgeGrid />
    </div>
  );
}
