"use client";

import Link from "next/link";
import { ROUTES } from "@/shared/constants";
import type { OnboardingStatus } from "../hooks/useOnboarding";

interface ChecklistStep {
  id:          string;
  label:       string;
  description: string;
  cta:         string;
  href:        (status: OnboardingStatus) => string;
  isComplete:  (status: OnboardingStatus) => boolean;
  isLocked:    (status: OnboardingStatus) => boolean;
}

const STEPS: ChecklistStep[] = [
  {
    id:          "create_employee",
    label:       "Create your first AI Employee",
    description: "Set up a Sales, Support, Content, or other AI specialist.",
    cta:         "Create AI Employee",
    href:        () => ROUTES.APP.EMPLOYEES.NEW,
    isComplete:  (s) => s.hasEmployee,
    isLocked:    () => false,
  },
  {
    id:          "add_knowledge",
    label:       "Add a Knowledge Source",
    description: "Upload text, paste a URL, or add a PDF for your AI to learn from.",
    cta:         "Add Knowledge",
    href:        () => ROUTES.APP.KNOWLEDGE.ROOT,
    isComplete:  (s) => s.hasKnowledge,
    isLocked:    (s) => !s.hasEmployee,
  },
  {
    id:          "link_knowledge",
    label:       "Link Knowledge to your Employee",
    description: "Connect your knowledge base so the AI uses it in every conversation.",
    cta:         "Link Knowledge",
    href:        (s) => s.firstEmployeeId
      ? ROUTES.APP.EMPLOYEES.DETAIL(s.firstEmployeeId)
      : ROUTES.APP.EMPLOYEES.ROOT,
    isComplete:  (s) => s.hasLinkedKnowledge,
    isLocked:    (s) => !s.hasKnowledge,
  },
  {
    id:          "test_chat",
    label:       "Test your AI Employee in chat",
    description: "Start a conversation and see your AI workforce in action.",
    cta:         "Open Chat",
    href:        (s) => s.firstEmployeeId
      ? `${ROUTES.APP.EMPLOYEES.DETAIL(s.firstEmployeeId)}/chat`
      : ROUTES.APP.EMPLOYEES.ROOT,
    isComplete:  (s) => s.hasChatted,
    isLocked:    (s) => !s.hasLinkedKnowledge,
  },
];

interface OnboardingChecklistProps {
  status:    OnboardingStatus;
  compact?:  boolean;
}

function StepIcon({ complete, locked, active }: { complete: boolean; locked: boolean; active: boolean }) {
  if (complete) {
    return (
      <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center shrink-0">
        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" className="w-3.5 h-3.5" aria-hidden>
          <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  if (locked) {
    return (
      <div className="w-7 h-7 rounded-full border border-border bg-surface-elevated flex items-center justify-center shrink-0">
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-text-muted" aria-hidden>
          <rect x="2.5" y="5" width="7" height="5.5" rx="1" />
          <path d="M4 5V3.5a2 2 0 014 0V5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
      active ? "border-accent bg-accent/10" : "border-border bg-surface-elevated"
    }`}>
      <div className={`w-2 h-2 rounded-full ${active ? "bg-accent" : "bg-text-muted"}`} />
    </div>
  );
}

export default function OnboardingChecklist({ status, compact = false }: OnboardingChecklistProps) {
  const nextIncompleteIdx = STEPS.findIndex((s) => !s.isComplete(status));

  return (
    <div className={`rounded-2xl border bg-surface overflow-hidden ${
      compact ? "border-border" : "border-accent/20"
    }`}>
      {!compact && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" aria-hidden />
            <span className="text-sm font-semibold text-white">
              Getting started — {status.completedSteps}/{status.totalSteps} steps complete
            </span>
          </div>
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(status.completedSteps / status.totalSteps) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-muted tabular-nums">
              {Math.round((status.completedSteps / status.totalSteps) * 100)}%
            </span>
          </div>
        </div>
      )}

      <ul className={compact ? "divide-y divide-border" : "divide-y divide-border"}>
        {STEPS.map((step, i) => {
          const complete = step.isComplete(status);
          const locked   = step.isLocked(status);
          const active   = i === nextIncompleteIdx && !locked;

          return (
            <li
              key={step.id}
              className={`flex items-start gap-4 px-5 py-4 transition-colors ${
                complete ? "opacity-70" : locked ? "opacity-40" : ""
              } ${active ? "bg-accent/[0.03]" : ""}`}
            >
              <StepIcon complete={complete} locked={locked} active={active} />

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium leading-tight ${complete ? "line-through text-text-muted" : "text-text-primary"}`}>
                  {step.label}
                </p>
                {!compact && (
                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{step.description}</p>
                )}
              </div>

              {active && (
                <Link
                  href={step.href(status)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {step.cta}
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
                    <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
