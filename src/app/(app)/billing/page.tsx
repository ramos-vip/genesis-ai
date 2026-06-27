"use client";

import { useQuery } from "@tanstack/react-query";
import PageHeader   from "@/shared/components/PageHeader";
import Skeleton     from "@/components/ui/Skeleton";
import { getBillingDataAction } from "@/server/actions/billing";
import { ROUTES } from "@/shared/constants";
import CurrentPlan  from "./_components/CurrentPlan";
import UsageMetrics from "./_components/UsageMetrics";
import UpgradePlans from "./_components/UpgradePlans";
import InvoiceHistory from "./_components/InvoiceHistory";

/* ─── Hook ────────────────────────────────────────────────────────────────── */

function useBillingData() {
  return useQuery({
    queryKey:  ["billing", "data"],
    queryFn:   () => getBillingDataAction(),
    staleTime: 60_000,
  });
}

/* ─── Skeleton ────────────────────────────────────────────────────────────── */

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton variant="rect" height={200} className="rounded-2xl" />
      <Skeleton variant="rect" height={280} className="rounded-2xl" />
      <Skeleton variant="rect" height={420} className="rounded-2xl" />
      <Skeleton variant="rect" height={200} className="rounded-2xl" />
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function BillingPage() {
  const { data, isLoading, isError, error } = useBillingData();

  return (
    <div>
      <PageHeader
        title="Billing & Usage"
        description="Monitor usage, manage your plan, and view invoice history."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Billing" },
        ]}
      />

      {isLoading && <BillingSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-danger-border bg-danger-bg p-6 text-center">
          <p className="text-sm font-semibold text-danger mb-1">Failed to load billing data</p>
          <p className="text-xs text-text-muted">
            {error instanceof Error ? error.message : "An error occurred."}
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Current plan + cost breakdown */}
          <CurrentPlan data={data} />

          {/* Usage vs limits */}
          <UsageMetrics metrics={data.usage} />

          {/* Plan cards */}
          <UpgradePlans currentPlan={data.subscription.planId} />

          {/* Invoice history */}
          <InvoiceHistory invoices={data.invoices} />
        </div>
      )}
    </div>
  );
}
