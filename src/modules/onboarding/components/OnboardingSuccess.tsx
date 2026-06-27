"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import { ROUTES }              from "@/shared/constants";

const CELEBRATION_KEY = "genesis:onboarding:celebrated";

interface OnboardingSuccessProps {
  employeeId: string | null;
}

export default function OnboardingSuccess({ employeeId }: OnboardingSuccessProps) {
  const router              = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(CELEBRATION_KEY, "true");
    router.refresh();
  }

  return (
    <div
      className={`min-h-[60vh] flex items-center justify-center p-6 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          {/* Outer glow rings */}
          <div className="absolute inset-0 rounded-full bg-success/10 scale-[2] animate-ping opacity-20" aria-hidden />
          <div className="absolute inset-0 rounded-full bg-success/15 scale-[1.5]" aria-hidden />
          <div className="w-24 h-24 rounded-full bg-success/10 border-2 border-success/30 flex items-center justify-center relative z-10">
            <svg
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-12 h-12 text-success"
              aria-hidden
            >
              <path d="M4 16l8 8L28 8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
          Your AI workforce is live! 🎉
        </h2>

        <p className="text-text-secondary mb-2 leading-relaxed">
          You&apos;ve completed all setup steps. Your AI employees are trained,
          connected to your knowledge base, and ready to work around the clock.
        </p>

        <p className="text-sm text-text-muted mb-10">
          This is just the beginning. Add more employees, expand your knowledge base,
          and build automations to scale further.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={dismiss}
            className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_0_24px_rgba(124,58,237,0.25)] hover:shadow-[0_0_32px_rgba(124,58,237,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <rect x="2" y="3" width="5.5" height="5.5" rx="1" />
              <rect x="8.5" y="3" width="5.5" height="5.5" rx="1" />
              <rect x="2" y="8.5" width="5.5" height="5.5" rx="1" />
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" />
            </svg>
            View Dashboard
          </button>

          {employeeId && (
            <a
              href={`${ROUTES.APP.EMPLOYEES.DETAIL(employeeId)}/chat`}
              onClick={() => localStorage.setItem(CELEBRATION_KEY, "true")}
              className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-xl border border-border bg-surface text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-hover transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 10.5A5.5 5.5 0 0113 8c0 2.485-1.57 4.615-3.799 5.402L8 15l-1.201-1.598C4.57 12.615 3 10.485 3 8a5.48 5.48 0 01.5-2.29" />
                <circle cx="12" cy="4" r="2.5" fill="currentColor" strokeWidth="0" />
              </svg>
              Chat with AI
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** Check if the user has already seen the celebration screen */
export function hasSeenCelebration(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CELEBRATION_KEY) === "true";
}
