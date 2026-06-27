"use client";

import Link from "next/link";
import { ROUTES } from "@/shared/constants";
import OnboardingChecklist from "./OnboardingChecklist";
import type { OnboardingStatus } from "../hooks/useOnboarding";

const roleCards = [
  { label: "Sales AI",    gradient: "from-violet-600/20 to-violet-600/5", initial: "SA", desc: "Qualify leads & book meetings" },
  { label: "Support AI",  gradient: "from-blue-600/20 to-blue-600/5",     initial: "CS", desc: "Resolve tickets 24/7" },
  { label: "Content AI",  gradient: "from-emerald-600/20 to-emerald-600/5", initial: "CO", desc: "Write in your brand voice" },
  { label: "SEO AI",      gradient: "from-orange-600/20 to-orange-600/5",  initial: "SE", desc: "Rank higher, faster" },
];

interface WelcomeDashboardProps {
  status: OnboardingStatus;
  userName?: string;
}

export default function WelcomeDashboard({ status, userName }: WelcomeDashboardProps) {
  const firstName = userName?.split(" ")[0];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero welcome block */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-accent" aria-hidden>
              <path d="M10 1l2.5 5H18l-4.5 3.5 1.5 5L10 12 5 14.5l1.5-5L2 6h5.5L10 1z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-accent">Welcome to Project Genesis</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          {firstName ? `Hey ${firstName}, let's build your AI workforce.` : "Let's build your AI workforce."}
        </h1>

        <p className="text-text-secondary leading-relaxed max-w-xl">
          You&apos;re minutes away from deploying AI employees that handle sales, support, content,
          and operations — automatically, around the clock.
        </p>
      </div>

      {/* Role preview cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {roleCards.map((role) => (
          <div
            key={role.label}
            className={`p-4 rounded-xl bg-gradient-to-br ${role.gradient} border border-white/[0.06] flex flex-col gap-2`}
          >
            <span className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
              {role.initial}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{role.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{role.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Primary CTA */}
      <div className="mb-8">
        <Link
          href={ROUTES.APP.EMPLOYEES.NEW}
          className={[
            "flex items-center justify-center gap-3 w-full sm:w-auto sm:inline-flex",
            "h-12 px-8 rounded-xl bg-accent text-white text-sm font-semibold",
            "hover:bg-accent-hover transition-all",
            "shadow-[0_0_24px_rgba(124,58,237,0.25)] hover:shadow-[0_0_32px_rgba(124,58,237,0.4)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          ].join(" ")}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
            <path d="M8 2v12M2 8h12" strokeLinecap="round" />
          </svg>
          Create your first AI Employee
        </Link>
      </div>

      {/* Onboarding checklist */}
      <div>
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          Setup checklist
        </p>
        <OnboardingChecklist status={status} />
      </div>
    </div>
  );
}
