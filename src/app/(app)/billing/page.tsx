import type { Metadata } from "next";
import PageHeader from "@/shared/components/PageHeader";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your subscription, usage, and invoices."
        breadcrumb={[{ label: "Dashboard", href: ROUTES.APP.DASHBOARD }, { label: "Billing" }]}
      />
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-muted text-sm">
        Billing management coming in Sprint 6
      </div>
    </div>
  );
}
