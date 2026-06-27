"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
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
import { ROUTES } from "@/shared/constants";

/* ─── Loading skeleton ────────────────────────────────────────────────────── */

function DashboardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-3">
        <Skeleton variant="rect" height={32} width="55%" className="rounded-xl" />
        <Skeleton variant="text" lines={2} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <Skeleton key={i} variant="rect" height={88} className="rounded-xl" />)}
      </div>
      <Skeleton variant="rect" height={200} className="rounded-2xl" />
    </div>
  );
}

/* ─── Normal dashboard (has employees) ────────────────────────────────────── */

function NormalDashboard({ hasIncomplete }: { hasIncomplete: boolean }) {
  const { data: status } = useOnboardingStatus();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-text-secondary">Your AI workforce at a glance.</p>
        </div>
        <Button size="sm" href={ROUTES.APP.EMPLOYEES.NEW}>
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
            <path d="M8 2v12M2 8h12" strokeLinecap="round" />
          </svg>
          New Employee
        </Button>
      </div>

      {/* Employee grid */}
      <section aria-labelledby="workforce-heading" className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 id="workforce-heading" className="text-sm font-semibold text-text-primary">
            Your AI Workforce
          </h2>
          <Link
            href={ROUTES.APP.EMPLOYEES.ROOT}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            View all →
          </Link>
        </div>
        <EmployeeGrid limit={3} />
      </section>

      {/* Compact onboarding checklist while not complete */}
      {hasIncomplete && status && (
        <section aria-labelledby="setup-heading" className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 id="setup-heading" className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Setup checklist
            </h2>
            <span className="text-xs text-text-muted">
              {status.completedSteps}/{status.totalSteps} complete
            </span>
          </div>
          <OnboardingChecklist status={status} compact />
        </section>
      )}
    </div>
  );
}

/* ─── Main orchestrator ───────────────────────────────────────────────────── */

export default function DashboardContent() {
  const { user }                          = useUser();
  const { data: status, isLoading }       = useOnboardingStatus();
  const [celebrationSeen, setCelebrationSeen] = useState<boolean | null>(null);

  /* Read localStorage after hydration to avoid SSR mismatch */
  useEffect(() => {
    setCelebrationSeen(hasSeenCelebration());
  }, []);

  /* ── Loading ── */
  if (isLoading || celebrationSeen === null) {
    return <DashboardSkeleton />;
  }

  /* ── All steps complete, celebration not yet seen ── */
  if (status?.isComplete && !celebrationSeen) {
    return (
      <OnboardingSuccess
        employeeId={status.firstEmployeeId}
      />
    );
  }

  /* ── No employees — first-time user ── */
  if (!status?.hasEmployee) {
    return (
      <WelcomeDashboard
        status={status!}
        userName={user?.fullName ?? user?.username ?? undefined}
      />
    );
  }

  /* ── Has employees, may still be incomplete ── */
  return <NormalDashboard hasIncomplete={!status.isComplete} />;
}
