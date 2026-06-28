import type { Metadata } from "next";
import PageHeader         from "@/shared/components/PageHeader";
import { WorkflowEditor } from "@/modules/automation";
import { ROUTES }         from "@/shared/constants";

export const metadata: Metadata = { title: "Automation" };

export default function AutomationPage() {
  return (
    <div>
      <PageHeader
        title="Automation"
        description="Build visual workflows that connect AI Employees with business events."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Automation" },
        ]}
      />
      <WorkflowEditor />
    </div>
  );
}
