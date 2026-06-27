import AnimateIn from "@/components/ui/AnimateIn";
import { ROUTES } from "@/shared/constants";

/* ─── Product preview cards ───────────────────────────────────────────────── */

function WizardPreview() {
  const roles = ["Sales", "Support", "Content", "SEO", "Email", "Ops"];
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold text-white">Create AI Employee</p>
        <span className="text-[10px] font-medium text-text-muted border border-border rounded-full px-2 py-0.5">Step 1 of 5</span>
      </div>

      <p className="text-xs text-text-secondary mb-2">What should we call your AI employee?</p>
      <div className="h-10 rounded-lg border border-accent/30 bg-surface-elevated px-3 flex items-center mb-1 ring-2 ring-accent/10">
        <span className="text-sm text-white">Sarah</span>
        <span className="ml-0.5 w-0.5 h-4 bg-accent animate-pulse" />
        <span className="ml-auto text-[10px] text-text-muted font-mono">5/50</span>
      </div>
      <p className="text-[10px] text-text-muted mb-4 text-right">Short and memorable ✓</p>

      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">Select role</p>
      <div className="grid grid-cols-3 gap-1.5 mb-5">
        {roles.map((role, i) => (
          <div
            key={role}
            className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-medium text-center transition-colors ${
              i === 1
                ? "border-accent/40 bg-accent/10 text-accent"
                : "border-border bg-surface-elevated text-text-muted"
            }`}
          >
            {role}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 mb-4">
        {[1,2,3,4,5].map(n => (
          <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${n === 1 ? "bg-accent" : "bg-surface-elevated"}`} />
        ))}
      </div>

      <div className="flex justify-end">
        <div className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-accent text-white text-xs font-semibold cursor-pointer hover:bg-accent-hover transition-colors">
          Continue
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
            <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function KnowledgeUploadPreview() {
  const sources = [
    { init: "T", name: "Product FAQ",       sub: "2,450 words",        color: "from-emerald-600/30 to-emerald-600/5", status: "Ready" },
    { init: "W", name: "Help Center",       sub: "https://help.co...", color: "from-blue-600/30 to-blue-600/5",    status: "Ready" },
    { init: "P", name: "Returns Policy.pdf", sub: "4 pages",            color: "from-orange-600/30 to-orange-600/5",status: "Processing" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">Knowledge Base</p>
        <div className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg border border-border bg-surface-elevated text-xs text-text-secondary cursor-pointer hover:border-border-hover transition-colors">
          <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5" aria-hidden>
            <path d="M5 1v8M1 5h8" strokeLinecap="round"/>
          </svg>
          Add Source
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {sources.map(s => (
          <div key={s.name} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-elevated">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} border border-white/[0.07] flex items-center justify-center text-[10px] font-bold text-white/70 shrink-0`}>
              {s.init}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{s.name}</p>
              <p className="text-[9px] text-text-muted truncate">{s.sub}</p>
            </div>
            <span className={`text-[9px] font-semibold shrink-0 ${s.status === "Ready" ? "text-success" : "text-warning"}`}>
              {s.status === "Ready" ? "✓ Ready" : "⏳"}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-text-muted text-center">3 sources · 2,900+ words indexed</p>
    </div>
  );
}

function KnowledgeLinkedPreview() {
  const linked = [
    { init: "T", name: "Product FAQ",  sub: "2,450 words",        color: "from-emerald-600/30 to-emerald-600/5" },
    { init: "W", name: "Help Center",  sub: "https://help.co...", color: "from-blue-600/30 to-blue-600/5" },
  ];
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600/30 to-blue-600/5 border border-white/[0.07] flex items-center justify-center text-[10px] font-bold text-white/70">CS</div>
            <p className="text-sm font-semibold text-white">Sarah</p>
            <span className="text-[9px] font-medium text-success bg-success/10 border border-success/20 rounded-full px-2 py-0.5">Active</span>
          </div>
          <p className="text-xs text-text-muted">Customer Support AI</p>
        </div>
      </div>

      <div className="px-5 py-4 border-b border-border flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-white mb-0.5">Knowledge</p>
          <p className="text-[10px] text-text-muted">Sources Sarah learns from</p>
        </div>
        <div className="inline-flex items-center gap-1 h-6 px-2.5 rounded-lg border border-border bg-surface-elevated text-[10px] text-text-secondary cursor-pointer">
          + Add
        </div>
      </div>

      <div className="p-4 space-y-2">
        {linked.map(s => (
          <div key={s.name} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-surface-elevated">
            <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${s.color} border border-white/[0.07] flex items-center justify-center text-[9px] font-bold text-white/70 shrink-0`}>
              {s.init}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-text-primary truncate">{s.name}</p>
              <p className="text-[9px] text-text-muted truncate">{s.sub}</p>
            </div>
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5 text-text-muted shrink-0" aria-hidden>
              <path d="M2 2l6 6M8 2L2 8" strokeLinecap="round"/>
            </svg>
          </div>
        ))}
      </div>
      <p className="px-5 pb-4 text-[10px] text-text-muted">Sarah references 2 knowledge sources in every response.</p>
    </div>
  );
}

function ChatPreview() {
  return (
    <div
      className="rounded-2xl border border-border bg-background overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col"
      style={{ minHeight: "260px" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface shrink-0">
        <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0">S</div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-white truncate">Sarah</p>
          <p className="text-[9px] text-text-muted">Support AI · Powered by Gemini</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden />
          <span className="text-[9px] text-text-muted">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-3 flex flex-col gap-2.5 overflow-hidden">
        <div className="flex gap-2 items-start">
          <div className="w-5 h-5 rounded-full bg-violet-600/40 flex items-center justify-center text-[7px] font-bold text-violet-300 shrink-0 mt-0.5">AI</div>
          <div className="max-w-[82%] bg-violet-600/[0.1] border border-violet-500/20 px-3 py-2 rounded-2xl rounded-tl-sm text-[10px] text-white/80 leading-relaxed">
            Hi! I&apos;m Sarah. How can I help you today?
          </div>
        </div>
        <div className="flex gap-2 items-start flex-row-reverse">
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[7px] text-white/50 shrink-0 mt-0.5">U</div>
          <div className="max-w-[82%] bg-white/[0.04] border border-white/[0.06] px-3 py-2 rounded-2xl rounded-tr-sm text-[10px] text-white/55 leading-relaxed">
            What&apos;s your return policy?
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <div className="w-5 h-5 rounded-full bg-violet-600/40 flex items-center justify-center text-[7px] font-bold text-violet-300 shrink-0 mt-0.5">AI</div>
          <div className="max-w-[82%] bg-violet-600/[0.1] border border-violet-500/20 px-3 py-2 rounded-2xl rounded-tl-sm text-[10px] text-white/80 leading-relaxed">
            Based on our knowledge base, we offer 30-day hassle-free returns.
            <span className="inline-block w-0.5 h-3 bg-accent ml-0.5 animate-pulse align-middle" aria-hidden />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-border bg-surface shrink-0">
        <div className="flex items-center gap-2 h-8 rounded-lg border border-border bg-surface-elevated px-3">
          <span className="text-[10px] text-text-muted flex-1">Ask Sarah anything…</span>
          <div className="w-5 h-5 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5 text-accent" aria-hidden>
              <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step data ───────────────────────────────────────────────────────────── */

const steps = [
  {
    label:   "Create AI Employee",
    desc:    "Choose a role, give it a name, and configure its behavior in under 5 minutes. No code, no engineers.",
    icon:    (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM3 17a7 7 0 0114 0"/>
        <path strokeLinecap="round" d="M17 4v4M15 6h4"/>
      </svg>
    ),
    preview: <WizardPreview />,
  },
  {
    label:   "Upload Knowledge",
    desc:    "Add your documents, URLs, or text. Your AI is embedded and indexed — ready to retrieve the right answer instantly.",
    icon:    (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 13V15h13V13M10 3v9M7 6l3-3 3 3"/>
      </svg>
    ),
    preview: <KnowledgeUploadPreview />,
  },
  {
    label:   "Connect Knowledge",
    desc:    "Link knowledge sources to your AI employee. Now every response is grounded in YOUR data, not hallucinated facts.",
    icon:    (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5l-3.5 2v7L9 16M11 4.5l3.5 2v7L11 16M9 8.5l2 1.5M11 8.5l-2 1.5"/>
      </svg>
    ),
    preview: <KnowledgeLinkedPreview />,
  },
  {
    label:   "Start AI Conversations",
    desc:    "Chat with your AI employee. Responses stream in real-time, draw from your knowledge base, and remember context.",
    icon:    (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9a6 6 0 01-6 6 5.96 5.96 0 01-2.87-.73L3 15.5l1.22-3.27A6 6 0 1117 9z"/>
      </svg>
    ),
    preview: <ChatPreview />,
  },
];

/* ─── Section ─────────────────────────────────────────────────────────────── */

export default function HowItWorks() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <AnimateIn>
          <div className="text-center mb-20">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
              From zero to AI workforce
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                in 4 steps.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              No engineers. No months of setup. Deploy your first AI employee
              and have it working in under 5 minutes.
            </p>
          </div>
        </AnimateIn>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop only */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px hidden lg:block"
            style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(124,58,237,0.25) 10%, rgba(124,58,237,0.35) 50%, rgba(124,58,237,0.25) 90%, transparent 100%)" }}
          />

          <div className="flex flex-col gap-20 lg:gap-24">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0; // even = preview left, content right
              return (
                <div key={step.label} className="relative">
                  {/* Desktop: two-column alternating */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                    {/* Left column */}
                    <AnimateIn delay={80}>
                      <div className={isEven ? "" : "lg:order-2"}>
                        {isEven ? step.preview : (
                          <StepContent step={step} index={i} align="left" />
                        )}
                      </div>
                    </AnimateIn>

                    {/* Right column */}
                    <AnimateIn delay={160}>
                      <div className={isEven ? "" : "lg:order-1"}>
                        {isEven ? (
                          <StepContent step={step} index={i} align="right" />
                        ) : step.preview}
                      </div>
                    </AnimateIn>
                  </div>

                  {/* Timeline node — centered between columns, desktop only */}
                  <div
                    className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    aria-hidden
                  >
                    <div className="w-12 h-12 rounded-full bg-accent border-[3px] border-background flex items-center justify-center text-white font-bold text-sm shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                      {i + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <AnimateIn delay={100}>
          <div className="mt-20 text-center">
            <a
              href={ROUTES.AUTH.SIGNUP}
              className="inline-flex items-center gap-2.5 h-12 px-8 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover transition-all shadow-[0_0_24px_rgba(124,58,237,0.25)] hover:shadow-[0_0_32px_rgba(124,58,237,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Start for free — no credit card
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

/* ─── Step content block ──────────────────────────────────────────────────── */

interface Step { label: string; desc: string; icon: React.ReactNode; preview: React.ReactNode }

function StepContent({ step, index, align }: { step: Step; index: number; align: "left" | "right" }) {
  return (
    <div className={`flex flex-col gap-4 ${align === "right" ? "lg:items-end lg:text-right" : ""}`}>
      {/* Mobile step number */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
          {index + 1}
        </div>
        <span className="text-xs text-text-muted font-medium">Step {index + 1} of 4</span>
      </div>

      {/* Desktop step label */}
      <p className="hidden lg:block text-[10px] font-semibold tracking-[0.18em] uppercase text-accent/70">
        Step {String(index + 1).padStart(2, "0")}
      </p>

      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent ${
          align === "right" ? "lg:self-end" : ""
        }`}
      >
        {step.icon}
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{step.label}</h3>

      {/* Description */}
      <p className="text-base text-zinc-400 leading-relaxed max-w-sm">
        {step.desc}
      </p>
    </div>
  );
}
