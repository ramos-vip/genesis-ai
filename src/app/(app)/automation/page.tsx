import type { Metadata } from "next";
import PageHeader  from "@/shared/components/PageHeader";
import ComingSoon  from "@/shared/components/ComingSoon";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Automation" };

export default function AutomationPage() {
  return (
    <div>
      <PageHeader
        title="Automation"
        description="Build workflows that run automatically."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Automation" },
        ]}
      />
      <ComingSoon
        title="Workflow automation is coming"
        description="Connect your AI employees to triggers, schedules, and external events. Build workflows that run without any human input."
        features={[
          "Schedule-based and webhook-triggered workflows",
          "Connect employees to Slack, email, and CRMs",
          "Multi-step workflows with conditional logic",
          "Run history and failure alerts",
          "No-code workflow builder",
        ]}
        eta="Coming soon"
      />
    </div>
  );
}
