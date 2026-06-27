"use client";

import { useState } from "react";
import { PLANS } from "@/server/billing/provider";
import type { PlanId } from "@/server/billing/provider";

const checkIcon = (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 shrink-0" aria-hidden>
    <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FEATURES: Record<PlanId, string[]> = {
  free: [
    "3 AI Employees",
    "5 Knowledge Sources",
    "1,000 messages / month",
    "50 MB storage",
    "Community support",
    "Gemini 2.5 Flash",
  ],
  pro: [
    "20 AI Employees",
    "100 Knowledge Sources",
    "50,000 messages / month",
    "5 GB storage",
    "Email support",
    "API access",
    "3 embedding models",
    "Priority queue",
  ],
  business: [
    "Unlimited AI Employees",
    "Unlimited Knowledge Sources",
    "500,000 messages / month",
    "50 GB storage",
    "Priority support",
    "Full API access",
    "10 embedding models",
    "Custom integrations",
    "SLA guarantee",
  ],
};

interface PlanCardProps {
  planId:      PlanId;
  currentPlan: PlanId;
  annual:      boolean;
}

function PlanCard({ planId, currentPlan, annual }: PlanCardProps) {
  const plan       = PLANS[planId];
  const isCurrent  = planId === currentPlan;
  const price      = annual ? plan.price.annual : plan.price.monthly;
  const features   = FEATURES[planId];

  return (
    <div
      className={[
        "relative flex flex-col rounded-2xl border p-6 transition-all duration-200",
        plan.highlighted
          ? "border-accent/40 bg-accent/[0.04] shadow-[0_0_40px_rgba(124,58,237,0.08)]"
          : "border-border bg-surface hover:border-white/[0.1]",
      ].join(" ")}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-white">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <p className="text-base font-bold text-white mb-0.5">{plan.name}</p>
        <p className="text-xs text-text-muted leading-relaxed">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-bold text-white tabular-nums">
            {price === 0 ? "Free" : `$${price}`}
          </span>
          {price > 0 && (
            <span className="text-text-muted text-sm mb-1">/mo</span>
          )}
        </div>
        {annual && price > 0 && (
          <p className="text-xs text-text-muted mt-0.5">
            Billed annually — save ${(plan.price.monthly - plan.price.annual) * 12}/year
          </p>
        )}
      </div>

      {/* CTA */}
      {isCurrent ? (
        <button
          disabled
          className="w-full h-10 rounded-xl border border-border text-sm font-medium text-text-muted cursor-default mb-5"
        >
          Current plan
        </button>
      ) : (
        <a
          href="#upgrade"
          className={[
            "flex items-center justify-center h-10 rounded-xl text-sm font-semibold transition-all mb-5",
            plan.highlighted
              ? "bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.2)]"
              : "border border-border hover:border-border-hover text-text-primary hover:bg-surface-elevated",
          ].join(" ")}
        >
          {planId === "business" ? "Contact sales" : "Upgrade to " + plan.name}
        </a>
      )}

      {/* Features */}
      <ul className="flex flex-col gap-2.5 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-xs text-text-secondary">
            <span className={plan.highlighted ? "text-accent" : "text-success"}>
              {checkIcon}
            </span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UpgradePlans({ currentPlan }: { currentPlan: PlanId }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Plans</h3>
          <p className="text-xs text-text-muted mt-0.5">Upgrade or change your plan at any time.</p>
        </div>

        {/* Annual toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            role="switch"
            aria-checked={annual}
            className={`relative w-10 h-5 rounded-full border transition-colors ${
              annual ? "bg-accent border-accent/50" : "bg-surface-elevated border-border"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                annual ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className="text-xs text-text-muted">
            Annual <span className="text-success font-medium">Save 20%</span>
          </span>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["free", "pro", "business"] as PlanId[]).map((id) => (
          <PlanCard key={id} planId={id} currentPlan={currentPlan} annual={annual} />
        ))}
      </div>
    </div>
  );
}
