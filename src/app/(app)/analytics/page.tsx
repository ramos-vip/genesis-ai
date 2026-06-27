"use client";

import { useQuery } from "@tanstack/react-query";
import PageHeader         from "@/shared/components/PageHeader";
import Skeleton           from "@/components/ui/Skeleton";
import { getAnalyticsDataAction } from "@/server/actions/analytics";
import { ROUTES }         from "@/shared/constants";
import OverviewCards, { OverviewCardsSkeleton } from "./_components/OverviewCards";
import ConversationChart  from "./_components/ConversationChart";
import EmployeeTable      from "./_components/EmployeeTable";
import AIHealthPanel      from "./_components/AIHealthPanel";

/* ─── Hook ────────────────────────────────────────────────────────────────── */

function useAnalytics() {
  return useQuery({
    queryKey:  ["analytics", "data"],
    queryFn:   () => getAnalyticsDataAction(),
    staleTime: 60_000, // 1 min
  });
}

/* ─── Loading ─────────────────────────────────────────────────────────────── */

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <OverviewCardsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton variant="rect" height={260} className="rounded-2xl" />
          <Skeleton variant="rect" height={280} className="rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton variant="rect" height={220} className="rounded-2xl" />
          <Skeleton variant="rect" height={160} className="rounded-2xl" />
          <Skeleton variant="rect" height={140} className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function AnalyticsPage() {
  const { data, isLoading, isError, error } = useAnalytics();

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Performance across your entire AI workforce."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Analytics" },
        ]}
      />

      {isLoading && <AnalyticsSkeleton />}

      {isError && (
        <div className="rounded-2xl border border-danger-border bg-danger-bg p-6 text-center">
          <p className="text-sm font-semibold text-danger mb-1">Failed to load analytics</p>
          <p className="text-xs text-text-muted">
            {error instanceof Error ? error.message : "An error occurred."}
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* ── Overview stats ── */}
          <OverviewCards data={data.overview} />

          {/* ── Two-column layout ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: charts + table */}
            <div className="lg:col-span-2 space-y-6">
              <ConversationChart
                convsByDay={data.convsByDay}
                msgsByDay={data.msgsByDay}
              />
              <EmployeeTable employees={data.employeeStats} />
            </div>

            {/* Right: health panel */}
            <div>
              <AIHealthPanel
                health={data.health}
                knowledge={data.knowledgeUsage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
