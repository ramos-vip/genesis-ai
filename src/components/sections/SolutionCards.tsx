import AnimateIn from "@/components/ui/AnimateIn";

const solutions = [
  {
    role:        "AI Support Employee",
    shortRole:   "Support",
    gradient:    "from-blue-600/30 to-blue-600/5",
    glowColor:   "rgba(59,130,246,0.12)",
    borderHover: "group-hover:border-blue-500/30",
    desc:        "Resolves up to 80% of customer tickets automatically. Handles FAQs, processes requests, and escalates intelligently — so your team focuses on what matters.",
    badges: [
      { label: "24/7 Available",        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
      { label: "Knowledge-powered",     color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
      { label: "< 2s response",         color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
    ],
  },
  {
    role:        "AI Sales Employee",
    shortRole:   "Sales",
    gradient:    "from-violet-600/30 to-violet-600/5",
    glowColor:   "rgba(124,58,237,0.12)",
    borderHover: "group-hover:border-violet-500/30",
    desc:        "Qualifies inbound leads, sends personalized outreach sequences, and books discovery calls automatically — while your closers close.",
    badges: [
      { label: "24/7 Available",        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
      { label: "CRM-integrated",        color: "text-violet-400 bg-violet-500/10 border-violet-500/25" },
      { label: "Instant follow-up",     color: "text-orange-400 bg-orange-500/10 border-orange-500/25" },
    ],
  },
  {
    role:        "AI Operations Employee",
    shortRole:   "Operations",
    gradient:    "from-cyan-600/30 to-cyan-600/5",
    glowColor:   "rgba(6,182,212,0.12)",
    borderHover: "group-hover:border-cyan-500/30",
    desc:        "Summarizes meetings, automates data entry, tracks action items, and keeps your team aligned — without another tool in the stack.",
    badges: [
      { label: "24/7 Available",        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
      { label: "Workflow automation",   color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/25" },
      { label: "Real-time",             color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
    ],
  },
  {
    role:        "AI Marketing Employee",
    shortRole:   "Marketing",
    gradient:    "from-pink-600/30 to-pink-600/5",
    glowColor:   "rgba(236,72,153,0.10)",
    borderHover: "group-hover:border-pink-500/30",
    desc:        "Writes blog posts, social content, and email campaigns in your brand voice. Trained on your style guide, not a generic prompt.",
    badges: [
      { label: "24/7 Available",        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
      { label: "Brand voice trained",   color: "text-pink-400 bg-pink-500/10 border-pink-500/25" },
      { label: "Multi-channel",         color: "text-rose-400 bg-rose-500/10 border-rose-500/25" },
    ],
  },
];

const initials: Record<string, string> = {
  Support:    "CS",
  Sales:      "SA",
  Operations: "OP",
  Marketing:  "MK",
};

export default function SolutionCards() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 65%)" }}
      />

      {/* Separator */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              The Solution
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
              Meet your{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                AI Workforce.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Deploy specialized AI employees that work around the clock — no HR, no onboarding,
              no overhead. Just results.
            </p>
          </div>
        </AnimateIn>

        {/* Solution cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {solutions.map((sol, i) => (
            <AnimateIn key={sol.role} delay={i * 80}>
              <div
                className={`group relative flex flex-col h-full p-6 rounded-2xl border border-border ${sol.borderHover} bg-surface-elevated hover:bg-surface transition-all duration-300 overflow-hidden`}
              >
                {/* Glow on hover */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${sol.glowColor} 0%, transparent 60%)` }}
                />

                <div className="relative z-10 flex flex-col gap-4 h-full">
                  {/* Role avatar + name */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${sol.gradient} border border-white/[0.08] flex items-center justify-center text-xs font-bold text-white/80 shrink-0`}
                    >
                      {initials[sol.shortRole]}
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">{sol.role}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">{sol.desc}</p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
                    {sol.badges.map(badge => (
                      <span
                        key={badge.label}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Bottom CTA nudge */}
        <AnimateIn delay={320}>
          <p className="mt-12 text-center text-sm text-zinc-500">
            Plus SEO, Email, Content and Custom AI employees.{" "}
            <a href="/employees" className="text-accent hover:text-violet-400 transition-colors font-medium">
              Explore all roles →
            </a>
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
