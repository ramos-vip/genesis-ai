import type { Metadata } from "next";
import PageHeader from "@/shared/components/PageHeader";
import Button from "@/components/ui/Button";
import EmptyState from "@/shared/components/EmptyState";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Automation" };

export default function AutomationPage() {
  return (
    <div>
      <PageHeader
        title="Automation"
        description="Build workflows that run automatically."
        breadcrumb={[{ label: "Dashboard", href: ROUTES.APP.DASHBOARD }, { label: "Automation" }]}
        actions={<Button size="sm" href={ROUTES.APP.AUTOMATION.NEW}>New Workflow</Button>}
      />
      <EmptyState
        title="No workflows yet"
        description="Create your first automation to connect your AI employees with your tools."
        action={{ label: "Create Workflow", href: ROUTES.APP.AUTOMATION.NEW }}
      />
    </div>
  );
}
