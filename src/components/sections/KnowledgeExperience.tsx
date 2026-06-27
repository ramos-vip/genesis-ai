import AnimateIn from "@/components/ui/AnimateIn";

/* ─── Shared primitives ───────────────────────────────────────────────────── */

function StepLabel({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold shrink-0">
        {n}
      </div>
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{text}</p>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="flex flex-col items-center py-1" aria-hidden>
      <div className="w-px h-5 bg-gradient-to-b from-accent/30 to-accent/15" />
      <svg viewBox="0 0 8 5" className="w-2 h-1.5 text-accent/40 -mt-px">
        <path d="M0 0 L4 5 L8 0" fill="currentColor" />
      </svg>
    </div>
  );
}

/* ─── Left side: Source upload cards ─────────────────────────────────────── */

const SOURCES = [
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5.5L9.5 1z"/>
        <path strokeLinecap="round" d="M9 1v5h5"/>
      </svg>
    ),
    label: "HR Policy.pdf",
    meta:  "PDF · 2.4 MB",
    gradient: "from-orange-500/35 to-orange-600/10",
    accent:   "text-orange-400",
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
        <circle cx="8" cy="8" r="6.5"/>
        <path strokeLinecap="round" d="M8 1.5c-1.5 2-2.5 3.8-2.5 6.5s1 4.5 2.5 6.5M8 1.5c1.5 2 2.5 3.8 2.5 6.5S9.5 16 8 16M1.5 8h13"/>
      </svg>
    ),
    label: "help.company.com",
    meta:  "URL · Live website",
    gradient: "from-blue-500/35 to-blue-600/10",
    accent:   "text-blue-400",
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
        <path strokeLinecap="round" d="M2.5 5h11M2.5 8h11M2.5 11h7"/>
      </svg>
    ),
    label: "Product FAQ",
    meta:  "Text · 1,200 words",
    gradient: "from-emerald-500/35 to-emerald-600/10",
    accent:   "text-emerald-400",
  },
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/>
        <path strokeLinecap="round" d="M10 2v4h4"/>
      </svg>
    ),
    label: "Onboarding Guide",
    meta:  "Docs · 3.8 KB",
    gradient: "from-violet-500/35 to-violet-600/10",
    accent:   "text-violet-400",
  },
];

function SourceCard({ src, delay }: { src: typeof SOURCES[number]; delay: number }) {
  return (
    <div
      className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-surface-elevated step-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${src.gradient} border border-white/[0.07] flex items-center justify-center shrink-0 ${src.accent}`}>
        {src.icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-primary truncate">{src.label}</p>
        <p className="text-[9px] text-text-muted">{src.meta}</p>
      </div>
      <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5 text-success shrink-0" aria-label="Uploaded">
        <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

/* ─── Left side: Processing pipeline ─────────────────────────────────────── */

const PIPELINE = [
  { label: "Chunking",  icon: "✂", delay: 0   },
  { label: "Embedding", icon: "⚡", delay: 300 },
  { label: "Indexing",  icon: "📇", delay: 600 },
  { label: "Ready",     icon: "✓",  delay: 900, done: true },
];

function Pipeline() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PIPELINE.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-semibold step-fade-in ${
              step.done
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-surface-elevated text-text-secondary"
            }`}
            style={{ animationDelay: `${step.delay}ms` }}
          >
            <span aria-hidden>{step.icon}</span>
            {step.label}
          </div>
          {i < PIPELINE.length - 1 && (
            <svg
              viewBox="0 0 12 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-3 h-2 text-accent/30 step-fade-in"
              style={{ animationDelay: `${step.delay + 150}ms` }}
              aria-hidden
            >
              <path d="M1 4h10M7 1l4 3-4 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Left side: Knowledge pipeline column ────────────────────────────────── */

function KnowledgePipeline() {
  return (
    <div className="flex flex-col gap-4">
      {/* Step 1 */}
      <AnimateIn delay={0}>
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <StepLabel n={1} text="Upload company knowledge" />
          <div className="grid grid-cols-2 gap-2">
            {SOURCES.map((src, i) => <SourceCard key={src.label} src={src} delay={i * 100} />)}
          </div>
        </div>
      </AnimateIn>

      <StepArrow />

      {/* Step 2 */}
      <AnimateIn delay={80}>
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <StepLabel n={2} text="AI processes your knowledge" />
          <Pipeline />
          <p className="mt-2 text-[9px] text-text-muted">
            Content split into chunks → dense vectors created → stored in index
          </p>
        </div>
      </AnimateIn>

      <StepArrow />

      {/* Step 3 */}
      <AnimateIn delay={160}>
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <StepLabel n={3} text="Knowledge connected to AI employee" />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/35 to-blue-600/10 border border-white/[0.07] flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
              CS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white">Sarah</p>
              <p className="text-[9px] text-text-muted">Customer Support AI</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-success/30 bg-success/10">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden />
              <span className="text-[9px] font-semibold text-success">4 sources linked</span>
            </div>
          </div>
        </div>
      </AnimateIn>

      <StepArrow />

      {/* Step 4 */}
      <AnimateIn delay={240}>
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <StepLabel n={4} text="User asks a question" />
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-surface-elevated">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white/50 shrink-0">U</div>
            <p className="text-xs text-text-primary italic">&ldquo;What is our refund policy?&rdquo;</p>
          </div>
        </div>
      </AnimateIn>

      <StepArrow />

      {/* Step 5 */}
      <AnimateIn delay={320}>
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <StepLabel n={5} text="Relevant knowledge retrieved" />
          <div className="flex flex-col gap-1.5">
            {["HR Policy.pdf · 97% match", "Product FAQ · 93% match", "help.company.com · 89% match"].map((s, i) => (
              <div key={s} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-surface-elevated step-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden />
                <span className="text-[10px] text-text-secondary">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>

      <StepArrow />

      {/* Step 6 */}
      <AnimateIn delay={400}>
        <div className="p-4 rounded-2xl border border-border bg-surface">
          <StepLabel n={6} text="Accurate answer generated" />
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-success/30 bg-success/10 text-[10px] font-semibold text-success">
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-2.5 h-2.5" aria-hidden>
                <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              98% Grounded
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-[10px] font-semibold text-accent">
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-2.5 h-2.5" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 5.5h6M5 2l3 3.5-3 3.5"/>
              </svg>
              Retrieved 3 Sources
            </div>
          </div>
        </div>
      </AnimateIn>
    </div>
  );
}

/* ─── Right side: Live RAG conversation ───────────────────────────────────── */

const SNIPPETS = [
  {
    source:    "HR Policy.pdf",
    excerpt:   "Returns accepted within 30 days of purchase with original receipt or order number.",
    relevance: 97,
    color:     "text-orange-400",
    bg:        "bg-orange-500/[0.06] border-orange-500/20",
  },
  {
    source:    "Product FAQ",
    excerpt:   "To start a return, email support@company.com or use the portal at returns.company.com.",
    relevance: 93,
    color:     "text-emerald-400",
    bg:        "bg-emerald-500/[0.06] border-emerald-500/20",
  },
  {
    source:    "help.company.com",
    excerpt:   "Refunds are processed within 3–5 business days back to the original payment method.",
    relevance: 89,
    color:     "text-blue-400",
    bg:        "bg-blue-500/[0.06] border-blue-500/20",
  },
];

function LiveConversation() {
  return (
    <div className="relative">
      {/* Floating chip — hidden on small screens */}
      <div
        className="hero-badge-float absolute -top-6 -right-4 z-20 hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d0d12]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
        style={{ animationDelay: "0.8s" }}
        aria-hidden
      >
        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-2.5 h-2.5 text-success">
          <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[10px] font-semibold text-white/90">98% Grounded</span>
      </div>

      <div
        className="hero-badge-float absolute -bottom-4 -left-4 z-20 hidden xl:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d0d12]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md"
        style={{ animationDelay: "1.2s" }}
        aria-hidden
      >
        <span className="w-2 h-2 rounded-full bg-accent" />
        <span className="text-[10px] font-semibold text-white/90">3 sources retrieved</span>
      </div>

      {/* Main chat card */}
      <div
        className="rounded-2xl border border-border bg-surface overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/35 to-blue-600/10 border border-white/[0.07] flex items-center justify-center text-xs font-bold text-white/70 shrink-0">
            CS
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4ade80] border-2 border-surface" aria-hidden>
              <div className="w-full h-full rounded-full bg-[#4ade80] animate-ping opacity-70" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white">Sarah — Support AI</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-text-muted">Knowledge-powered</span>
              <span className="text-[9px] text-text-muted">·</span>
              <span className="text-[9px] text-text-muted">Gemini 2.5 Flash</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent/30 bg-accent/10 shrink-0">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-2.5 h-2.5 text-accent" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 5.5h6M5 2l3 3.5-3 3.5"/>
            </svg>
            <span className="text-[9px] font-semibold text-accent">3 Retrieved</span>
          </div>
        </div>

        {/* Messages */}
        <div className="p-5 flex flex-col gap-4">
          {/* User message */}
          <div className="flex gap-2 items-start flex-row-reverse">
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] text-white/50 shrink-0 mt-0.5" aria-hidden>U</div>
            <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm border border-white/[0.06] bg-white/[0.04] text-xs text-white/60 leading-relaxed">
              What is our refund policy?
            </div>
          </div>

          {/* AI response */}
          <div className="flex gap-2 items-start">
            <div className="w-6 h-6 rounded-full bg-violet-600/40 flex items-center justify-center text-[8px] font-bold text-violet-300 shrink-0 mt-0.5" aria-hidden>AI</div>
            <div
              className="flex-1 px-3.5 py-2.5 rounded-2xl rounded-tl-sm border border-violet-500/20 bg-violet-600/[0.09] text-xs text-white/80 leading-relaxed step-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              Based on our knowledge base, we offer a{" "}
              <strong className="text-white font-semibold">30-day hassle-free return window</strong>{" "}
              from the date of purchase. To start a return, contact our support team at support@company.com
              or use the self-service portal. Refunds are typically processed within{" "}
              <strong className="text-white font-semibold">3–5 business days</strong>.
              <span
                className="inline-block w-0.5 h-3.5 bg-accent align-middle ml-0.5 animate-pulse"
                aria-hidden
              />
            </div>
          </div>

          {/* Knowledge snippets */}
          <div
            className="flex flex-col gap-2 step-fade-in"
            style={{ animationDelay: "700ms" }}
          >
            <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Retrieved knowledge sources</p>
            {SNIPPETS.map((s, i) => (
              <div
                key={s.source}
                className={`p-3 rounded-xl border ${s.bg} step-fade-in`}
                style={{ animationDelay: `${700 + i * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[9px] font-semibold ${s.color}`}>{s.source}</span>
                  <span className="text-[9px] text-text-muted">{s.relevance}% match</span>
                </div>
                <p className="text-[10px] text-text-secondary leading-relaxed line-clamp-2">{s.excerpt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 border-t border-border flex items-center justify-between step-fade-in"
          style={{ animationDelay: "1000ms" }}
        >
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-2.5 h-2.5 text-success" aria-hidden>
              <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[9px] font-semibold text-success">98% Grounded in your knowledge</span>
          </div>
          <span className="text-[9px] text-text-muted">Not hallucinated</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

export default function KnowledgeExperience() {
  return (
    <section className="py-24 sm:py-32 bg-surface relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              Knowledge Intelligence
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
              Your AI learns your business.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Never guesses.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Upload your documents, connect your URLs, paste your text. Genesis AI chunks,
              embeds, and indexes everything — so every response is grounded in your knowledge.
            </p>
          </div>
        </AnimateIn>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Left: Interactive pipeline */}
          <KnowledgePipeline />

          {/* Right: Live conversation (sticky on desktop) */}
          <div className="lg:sticky lg:top-24">
            <LiveConversation />
          </div>
        </div>
      </div>
    </section>
  );
}
