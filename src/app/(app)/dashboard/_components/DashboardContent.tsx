"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser }  from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { EmployeeGrid }        from "@/modules/employees";
import {
  useOnboardingStatus,
  WelcomeDashboard,
  OnboardingChecklist,
  OnboardingSuccess,
  hasSeenCelebration,
} from "@/modules/onboarding";
import { getDashboardDataAction } from "@/server/actions/dashboard";
import { ROUTES } from "@/shared/constants";
import StatsGrid, { StatsGridSkeleton } from "./StatsGrid";
import ActivityFeed, { ActivityFeedSkeleton } from "./ActivityFeed";
import QuickActions from "./QuickActions";

/* ─── Dashboard data hook ─────────────────────────────────────────────────── */

function useDashboardData() {
  return useQuery({
    queryKey:       ["dashboard", "data"],
    queryFn:        () => getDashboardDataAction(),
    staleTime:      30_000,
    refetchOnMount: true,
  });
}

/* ─── Loading skeleton ────────────────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton variant="rect" height={28} width={220} className="rounded-xl" />
          <Skeleton variant="rect" height={14} width={160} className="rounded" />
        </div>
        <Skeleton variant="rect" width={110} height={36} className="rounded-xl" />
      </div>
      {/* Stats */}
      <StatsGridSkeleton />
      {/* Two-col area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1,2,3].map(i => (
            <Skeleton key={i} variant="rect" height={90} className="rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton variant="rect" height={220} className="rounded-2xl" />
          <Skeleton variant="rect" height={180} className="rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Normal dashboard (has employees) ────────────────────────────────────── */

function NormalDashboard({
  hasIncomplete,
  userName,
}: {
  hasIncomplete: boolean;
  userName:      string | undefined;
}) {
  const { data: status }  = useOnboardingStatus();
  const { data: dashData, isLoading: loadingDash } = useDashboardData();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = userName?.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {greeting}{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Here&apos;s your AI workforce at a glance.
          </p>
        </div>
        <Button size="sm" href={ROUTES.APP.EMPLOYEES.NEW}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
            <path d="M8 2v12M2 8h12" strokeLinecap="round" />
          </svg>
          New Employee
        </Button>
      </div>

      {/* ── Stats ── */}
      {loadingDash
        ? <StatsGridSkeleton />
        : dashData && <StatsGrid stats={dashData.stats} />
      }

      {/* ── Two-column: Employees + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee grid (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Your AI Workforce</h2>
            <Link
              href={ROUTES.APP.EMPLOYEES.ROOT}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              View all →
            </Link>
          </div>
          <EmployeeGrid limit={4} />
        </div>

        {/* Sidebar (1/3 width) */}
        <div className="flex flex-col gap-5">
          <QuickActions firstEmployeeId={dashData?.firstEmployeeId ?? null} />
          {loadingDash
            ? <ActivityFeedSkeleton />
            : dashData && <ActivityFeed events={dashData.activity} />
          }
        </div>
      </div>

      {/* ── Compact onboarding checklist while not complete ── */}
      {hasIncomplete && status && (
        <section aria-labelledby="setup-heading">
          <div className="flex items-center justify-between mb-3">
            <h2
              id="setup-heading"
              className="text-xs font-semibold text-text-muted uppercase tracking-wider"
            >
              Setup checklist — {status.completedSteps}/{status.totalSteps} complete
            </h2>
          </div>
          <OnboardingChecklist status={status} compact />
        </section>
      )}
    </div>
  );
}

/* ─── Main orchestrator ───────────────────────────────────────────────────── */

export default function DashboardContent() {
  const { user }                                   = useUser();
  const { data: status, isLoading }                = useOnboardingStatus();
  const [celebrationSeen, setCelebrationSeen]      = useState<boolean | null>(null);

  useEffect(() => {
    setCelebrationSeen(hasSeenCelebration());
  }, []);

  const userName = user?.fullName ?? user?.username ?? undefined;

  if (isLoading || celebrationSeen === null) {
    return <DashboardSkeleton />;
  }

  if (status?.isComplete && !celebrationSeen) {
    return <OnboardingSuccess employeeId={status.firstEmployeeId} />;
  }

  if (!status?.hasEmployee) {
    return <WelcomeDashboard status={status!} userName={userName} />;
  }

  return <NormalDashboard hasIncomplete={!status.isComplete} userName={userName} />;
}
