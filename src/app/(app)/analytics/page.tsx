import type { Metadata } from "next";
import PageHeader from "@/shared/components/PageHeader";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track performance across your entire AI workforce."
        breadcrumb={[{ label: "Dashboard", href: ROUTES.APP.DASHBOARD }, { label: "Analytics" }]}
      />
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-muted text-sm">
        Analytics charts coming in Sprint 5
      </div>
    </div>
  );
}
