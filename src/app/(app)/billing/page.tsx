import type { Metadata } from "next";
import PageHeader  from "@/shared/components/PageHeader";
import ComingSoon  from "@/shared/components/ComingSoon";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Billing" };

export default function BillingPage() {
  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your subscription, usage, and invoices."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Billing" },
        ]}
      />
      <ComingSoon
        title="Billing management is being built"
        description="Manage your subscription plan, view usage, and download invoices — all from one dashboard. No surprise charges, ever."
        features={[
          "Subscription plan management",
          "Real-time usage and quota tracking",
          "Invoice history and PDF downloads",
          "Payment method management",
          "Usage alerts and spend limits",
        ]}
        eta="Coming soon"
      />
    </div>
  );
}
