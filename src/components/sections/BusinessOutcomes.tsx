import AnimateIn from "@/components/ui/AnimateIn";

const stats = [
  {
    value:   "21",
    unit:    "hrs",
    label:   "Saved per week",
    desc:    "Per AI employee deployed, on average.",
    color:   "text-violet-400",
    bg:      "from-violet-600/15 to-violet-600/5",
    border:  "hover:border-violet-500/30",
    glow:    "rgba(124,58,237,0.08)",
    delay:   0,
  },
  {
    value:   "98",
    unit:    "%",
    label:   "AI Accuracy",
    desc:    "Knowledge-grounded responses, not hallucinations.",
    color:   "text-success",
    bg:      "from-emerald-600/15 to-emerald-600/5",
    border:  "hover:border-emerald-500/30",
    glow:    "rgba(16,185,129,0.08)",
    delay:   60,
  },
  {
    value:   "24/7",
    unit:    "",
    label:   "Availability",
    desc:    "Zero sick days, zero downtime, no overtime costs.",
    color:   "text-blue-400",
    bg:      "from-blue-600/15 to-blue-600/5",
    border:  "hover:border-blue-500/30",
    glow:    "rgba(59,130,246,0.08)",
    delay:   120,
  },
  {
    value:   "65",
    unit:    "%",
    label:   "Faster responses",
    desc:    "Average response time vs human support agents.",
    color:   "text-orange-400",
    bg:      "from-orange-600/15 to-orange-600/5",
    border:  "hover:border-orange-500/30",
    glow:    "rgba(234,88,12,0.08)",
    delay:   180,
  },
  {
    value:   "∞",
    unit:    "",
    label:   "Scalability",
    desc:    "Deploy unlimited employees without hiring overhead.",
    color:   "text-cyan-400",
    bg:      "from-cyan-600/15 to-cyan-600/5",
    border:  "hover:border-cyan-500/30",
    glow:    "rgba(6,182,212,0.08)",
    delay:   240,
  },
  {
    value:   "SOC 2",
    unit:    "",
    label:   "Enterprise ready",
    desc:    "Compliant architecture. Your data stays yours.",
    color:   "text-rose-400",
    bg:      "from-rose-600/15 to-rose-600/5",
    border:  "hover:border-rose-500/30",
    glow:    "rgba(225,29,72,0.08)",
    delay:   300,
  },
];

export default function BusinessOutcomes() {
  return (
    <section className="py-24 sm:py-32 bg-surface relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <AnimateIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              Business Outcomes
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
              Real results.{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Every single day.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Genesis AI customers see measurable outcomes from day one — fewer tickets,
              faster responses, and a team that focuses on what only humans can do.
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <AnimateIn key={s.label} delay={s.delay}>
              <div
                className={`group relative flex flex-col h-full p-6 rounded-2xl border border-border bg-background ${s.border} transition-all duration-300 overflow-hidden cursor-default`}
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${s.glow} 0%, transparent 55%)` }}
                />

                {/* Gradient top-left accent */}
                <div
                  aria-hidden
                  className={`absolute -top-12 -left-12 w-32 h-32 rounded-full bg-gradient-to-br ${s.bg} blur-xl opacity-50 pointer-events-none`}
                />

                <div className="relative z-10">
                  {/* Stat value */}
                  <div className="stat-pop mb-3" style={{ animationDelay: `${s.delay + 100}ms` }}>
                    <span className={`text-4xl sm:text-5xl font-bold tabular-nums leading-none ${s.color}`}>
                      {s.value}
                    </span>
                    {s.unit && (
                      <span className={`text-2xl font-bold ml-0.5 ${s.color}`}>{s.unit}</span>
                    )}
                  </div>

                  {/* Label */}
                  <p className="text-sm font-semibold text-white mb-1.5">{s.label}</p>

                  {/* Description */}
                  <p className="text-xs text-text-muted leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
