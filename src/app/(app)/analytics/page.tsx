import type { Metadata } from "next";
import PageHeader  from "@/shared/components/PageHeader";
import ComingSoon  from "@/shared/components/ComingSoon";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track performance across your entire AI workforce."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Analytics" },
        ]}
      />
      <ComingSoon
        title="Workforce analytics are on their way"
        description="Deep insights into how your AI employees are performing — tasks completed, success rates, response times, and cost savings — all in one place."
        features={[
          "Real-time task completion metrics",
          "Success rate trends by employee and role",
          "Response time distributions",
          "Cost savings vs. human equivalents",
          "Exportable CSV and PDF reports",
        ]}
        eta="Coming soon"
      />
    </div>
  );
}
