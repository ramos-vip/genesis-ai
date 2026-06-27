"use client";

import { useState } from "react";
import { ROUTES } from "@/shared/constants";
import AnimateIn from "@/components/ui/AnimateIn";

/* ─── Plan data ───────────────────────────────────────────────────────────── */

const PLANS = [
  {
    id:       "free",
    name:     "Starter",
    desc:     "Explore Genesis AI and deploy your first employee.",
    monthly:  0,
    annual:   0,
    cta:      "Start for free",
    href:     ROUTES.AUTH.SIGNUP,
    featured: false,
    badge:    undefined as string | undefined,
    features: [
      "3 AI Employees",
      "5 Knowledge Sources",
      "1,000 messages / month",
      "50 MB storage",
      "Community support",
      "Gemini 2.5 Flash",
    ],
  },
  {
    id:       "pro",
    name:     "Pro",
    desc:     "For growing teams that need scale and flexibility.",
    monthly:  49,
    annual:   39,
    cta:      "Get started",
    href:     ROUTES.AUTH.SIGNUP,
    featured: true,
    badge:    "Most Popular",
    features: [
      "20 AI Employees",
      "100 Knowledge Sources",
      "50,000 messages / month",
      "5 GB storage",
      "Email support",
      "API access",
      "Custom training",
      "3 embedding models",
    ],
  },
  {
    id:       "business",
    name:     "Business",
    desc:     "Unlimited scale for enterprises running their full AI workforce.",
    monthly:  199,
    annual:   159,
    cta:      "Contact sales",
    href:     ROUTES.AUTH.SIGNUP,
    featured: false,
    badge:    undefined as string | undefined,
    features: [
      "Unlimited AI Employees",
      "Unlimited Knowledge Sources",
      "500,000 messages / month",
      "50 GB storage",
      "Priority support",
      "SSO & SAML",
      "SLA guarantee",
      "Custom integrations",
    ],
  },
] as const;

/* ─── Pricing cards ───────────────────────────────────────────────────────── */

function PricingCards({ annual }: { annual: boolean }) {
  const checkIcon = (
    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 shrink-0" aria-hidden>
      <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {PLANS.map((plan) => {
        const price   = annual ? plan.annual : plan.monthly;
        const savings = plan.monthly > 0 && annual ? (plan.monthly - plan.annual) * 12 : 0;

        return (
          <div
            key={plan.id}
            className={[
              "relative flex flex-col rounded-2xl border p-7 transition-all duration-200",
              plan.featured
                ? "border-accent/40 bg-accent/[0.04] shadow-[0_0_60px_rgba(124,58,237,0.10)]"
                : "border-border bg-surface hover:border-white/[0.1]",
            ].join(" ")}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-accent text-white shadow-[0_0_16px_rgba(124,58,237,0.4)]">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-5">
              <p className="text-base font-bold text-white mb-0.5">{plan.name}</p>
              <p className="text-xs text-text-muted leading-relaxed">{plan.desc}</p>
            </div>

            <div className="mb-5">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-bold text-white tabular-nums">
                  {price === 0 ? "Free" : `$${price}`}
                </span>
                {price > 0 && <span className="text-text-muted text-sm mb-1.5">/month</span>}
              </div>
              {savings > 0 && (
                <p className="text-xs text-success mt-1">Save ${savings}/year with annual billing</p>
              )}
              {price === 0 && <p className="text-xs text-text-muted mt-1">Forever free, no card needed</p>}
            </div>

            <a
              href={plan.href}
              className={[
                "flex items-center justify-center h-11 rounded-xl text-sm font-semibold mb-6 transition-all",
                plan.featured
                  ? "bg-accent hover:bg-accent-hover text-white shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_28px_rgba(124,58,237,0.35)]"
                  : "border border-border hover:border-border-hover text-text-primary hover:bg-surface-elevated",
              ].join(" ")}
            >
              {plan.cta}
            </a>

            <ul className="flex flex-col gap-2.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-xs text-text-secondary">
                  <span className={plan.featured ? "text-accent" : "text-success"}>
                    {checkIcon}
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ─── ROI Calculator ──────────────────────────────────────────────────────── */

function ROICalculator() {
  const [teamSize,  setTeamSize]  = useState(10);
  const [daily,     setDaily]     = useState(100);

  const aiHandledPct   = 0.80;
  const minutesSaved   = 4;    // per request
  const hourlyRate     = 25;   // USD/hr support cost

  const handledMonthly = Math.round(daily * 30 * aiHandledPct);
  const hoursSaved     = Math.round((handledMonthly * minutesSaved) / 60);
  const moneySaved     = hoursSaved * hourlyRate;

  function Slider({
    label, min, max, value, onChange, fmt,
  }: { label: string; min: number; max: number; value: number; onChange: (n: number) => void; fmt: (n: number) => string }) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-text-primary">{label}</label>
          <span className="text-sm font-bold text-white tabular-nums">{fmt(value)}</span>
        </div>
        <input
          type="range"
          min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
          style={{ "--slider-progress": `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between mt-1">
          <span className="text-[9px] text-text-muted">{fmt(min)}</span>
          <span className="text-[9px] text-text-muted">{fmt(max)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-base font-bold text-white mb-0.5">ROI Calculator</h3>
        <p className="text-xs text-text-muted">See your estimated monthly savings from AI automation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Inputs */}
        <div className="p-6 flex flex-col gap-6">
          <Slider
            label="Team size"
            min={1} max={100} value={teamSize}
            onChange={setTeamSize}
            fmt={(n) => `${n} ${n === 1 ? "person" : "people"}`}
          />
          <Slider
            label="Customer requests per day"
            min={10} max={500} value={daily}
            onChange={setDaily}
            fmt={(n) => `${n} req/day`}
          />
          <p className="text-[9px] text-text-muted leading-relaxed">
            Assumes AI handles 80% of requests at 4 min/request. Support cost: $25/hr.
          </p>
        </div>

        {/* Outputs */}
        <div className="p-6 grid grid-cols-1 gap-4">
          {[
            {
              label:  "Hours saved / month",
              value:  `${hoursSaved.toLocaleString()} hrs`,
              sub:    "Your team works on what matters",
              color:  "text-violet-400",
              bg:     "bg-violet-500/10 border-violet-500/20",
            },
            {
              label:  "Cost savings / month",
              value:  `$${moneySaved.toLocaleString()}`,
              sub:    "Est. support labor cost offset",
              color:  "text-success",
              bg:     "bg-success/10 border-success/20",
            },
            {
              label:  "AI conversations / month",
              value:  handledMonthly.toLocaleString(),
              sub:    "Handled automatically, 24/7",
              color:  "text-blue-400",
              bg:     "bg-blue-500/10 border-blue-500/20",
            },
          ].map((o) => (
            <div key={o.label} className={`p-4 rounded-xl border ${o.bg}`}>
              <p className="text-xs text-text-muted mb-1">{o.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${o.color}`}>{o.value}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{o.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Comparison table ────────────────────────────────────────────────────── */

const COMPARISON = [
  { feature: "Setup time",        trad: "2–3 months",      ai: "< 5 minutes" },
  { feature: "Availability",      trad: "9–5 weekdays",    ai: "24/7 · 365 days" },
  { feature: "Monthly cost",      trad: "$3,000–8,000",    ai: "From $0" },
  { feature: "Scalability",       trad: "Weeks to hire",   ai: "Instant" },
  { feature: "Training",          trad: "Manual onboarding", ai: "Auto-sync from docs" },
  { feature: "Knowledge updates", trad: "Outdated often",  ai: "Real-time" },
  { feature: "Sick days / leave", trad: "Yes",             ai: "Never" },
  { feature: "ROI timeline",      trad: "6–12 months",     ai: "Same day" },
];

function ComparisonTable() {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="grid grid-cols-3 border-b border-border text-xs font-semibold">
        <div className="px-5 py-4 text-text-muted">Feature</div>
        <div className="px-5 py-4 text-center border-l border-border text-text-secondary">Traditional Hiring</div>
        <div className="px-5 py-4 text-center border-l border-accent/20 bg-accent/[0.03] text-accent">Genesis AI</div>
      </div>
      <div className="divide-y divide-border">
        {COMPARISON.map(({ feature, trad, ai }, i) => (
          <div key={feature} className={`grid grid-cols-3 text-xs ${i % 2 === 0 ? "" : "bg-surface-elevated/40"}`}>
            <div className="px-5 py-3.5 font-medium text-text-secondary">{feature}</div>
            <div className="px-5 py-3.5 text-center border-l border-border text-text-muted flex items-center justify-center gap-1.5">
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5 text-danger/60 shrink-0" aria-hidden>
                <path d="M2 2l6 6M8 2L2 8" strokeLinecap="round"/>
              </svg>
              {trad}
            </div>
            <div className="px-5 py-3.5 text-center border-l border-accent/20 bg-accent/[0.02] text-success flex items-center justify-center gap-1.5 font-medium">
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 shrink-0" aria-hidden>
                <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {ai}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Trust badges ────────────────────────────────────────────────────────── */

const TRUST = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
      </svg>
    ),
    title: "Enterprise Security",
    desc:  "SOC 2 compliant architecture. Row-level access controls on every query.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3h-.75A2.25 2.25 0 001 5.25v1.5A2.25 2.25 0 003.25 9h.75m0-6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0116 3v6a2.25 2.25 0 01-2.25 2.25H9.75m-6-4.5a2.25 2.25 0 01-2.25-2.25V5.25A2.25 2.25 0 013.75 3h.75"/>
      </svg>
    ),
    title: "GDPR Ready",
    desc:  "Your data stays yours. We never use it to train our models without consent.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
      </svg>
    ),
    title: "Modern AI Infrastructure",
    desc:  "Built on Gemini 2.5 Flash. Real-time streaming. Vector search via semantic RAG.",
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75"/>
      </svg>
    ),
    title: "No Surprise Charges",
    desc:  "Transparent per-message pricing. Usage caps on every plan. Upgrade any time.",
  },
];

/* ─── Final CTA ───────────────────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-accent/20">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(99,102,241,0.08) 50%, rgba(124,58,237,0.05) 100%)" }}
        aria-hidden
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-[80px] pointer-events-none"
        style={{ background: "rgba(124,58,237,0.2)" }}
        aria-hidden
      />

      <div className="relative z-10 px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 text-sm text-accent font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" aria-hidden />
          Start today — no credit card required
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
          Ready to Build Your
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            AI Workforce?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto mb-9 leading-relaxed">
          Join growing businesses that run their support, sales, content, and operations
          on AI that never sleeps. Deploy your first employee in under 5 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={ROUTES.AUTH.SIGNUP}
            className="inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_0_24px_rgba(124,58,237,0.3)] hover:shadow-[0_0_36px_rgba(124,58,237,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Start Free
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href={ROUTES.AUTH.SIGNUP}
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-white/[0.03] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <circle cx="8" cy="8" r="6.5"/>
              <path d="M6.5 5.5l4 2.5-4 2.5V5.5Z" fill="currentColor" strokeLinejoin="round"/>
            </svg>
            Book Demo
          </a>
        </div>

        <p className="mt-6 text-xs text-text-muted">
          Free plan available forever · Upgrade any time · Cancel in 1 click
        </p>
      </div>
    </div>
  );
}

/* ─── Main section ────────────────────────────────────────────────────────── */

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden" id="pricing">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 space-y-20">

        {/* ── 1. Pricing cards ── */}
        <div>
          <AnimateIn>
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">Pricing</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
                Simple, transparent pricing.
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-8">
                Start for free. Scale when you grow. No hidden fees, no surprise invoices.
              </p>

              {/* Toggle */}
              <div className="inline-flex items-center gap-3 p-1 rounded-xl border border-border bg-surface-elevated">
                <button
                  onClick={() => setAnnual(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-surface text-white shadow-sm border border-border" : "text-text-muted hover:text-text-secondary"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-surface text-white shadow-sm border border-border" : "text-text-muted hover:text-text-secondary"}`}
                >
                  Annual
                  <span className="text-[9px] font-bold text-success bg-success/10 border border-success/20 rounded-full px-1.5 py-0.5">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={80}>
            <PricingCards annual={annual} />
          </AnimateIn>
        </div>

        {/* ── 2. ROI Calculator ── */}
        <div>
          <AnimateIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-3">ROI Calculator</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                How much will you save?
              </h3>
              <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                Move the sliders to estimate your monthly savings from automating with Genesis AI.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={80}>
            <ROICalculator />
          </AnimateIn>
        </div>

        {/* ── 3. Comparison table ── */}
        <div>
          <AnimateIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-3">Comparison</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Traditional hiring vs Genesis AI
              </h3>
              <p className="text-sm text-zinc-400 max-w-lg mx-auto">
                Every hour you spend hiring, onboarding, or managing is an hour Genesis AI saves you.
              </p>
            </div>
          </AnimateIn>
          <AnimateIn delay={80}>
            <ComparisonTable />
          </AnimateIn>
        </div>

        {/* ── 4. Trust section ── */}
        <div>
          <AnimateIn>
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-3">Trust & Security</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Built for serious businesses.</h3>
            </div>
          </AnimateIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST.map((t, i) => (
              <AnimateIn key={t.title} delay={i * 60}>
                <div className="p-5 rounded-2xl border border-border bg-surface hover:bg-surface-elevated hover:border-white/[0.1] transition-all duration-200 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    {t.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{t.title}</p>
                    <p className="text-xs text-text-muted leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>

        {/* ── 5. Final CTA ── */}
        <AnimateIn>
          <FinalCTA />
        </AnimateIn>
      </div>
    </section>
  );
}
