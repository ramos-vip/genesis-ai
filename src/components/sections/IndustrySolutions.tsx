import AnimateIn from "@/components/ui/AnimateIn";

const industries = [
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 3h17l-1.5 12H4L2.5 3zM8 17a1.5 1.5 0 103 0m0 0a1.5 1.5 0 103 0M8 17h7"/>
      </svg>
    ),
    industry: "E-commerce",
    gradient: "from-violet-600/30 to-violet-600/5",
    glow:     "rgba(124,58,237,0.08)",
    border:   "hover:border-violet-500/25",
    roles:    ["Support AI", "Sales AI"],
    useCase:  "Handle returns 24/7, qualify high-intent shoppers, and automate abandoned cart follow-ups.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h16v12H3V7zm8-4v4M7 3v4m8-4v4"/>
      </svg>
    ),
    industry: "Hospitality",
    gradient: "from-blue-600/30 to-blue-600/5",
    glow:     "rgba(59,130,246,0.08)",
    border:   "hover:border-blue-500/25",
    roles:    ["Support AI", "Operations AI"],
    useCase:  "Answer guest inquiries instantly, automate booking confirmations, and coordinate housekeeping.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 2a7 7 0 100 14A7 7 0 0011 2zm0 0v14M7 6h8M5 10h12"/>
      </svg>
    ),
    industry: "Healthcare",
    gradient: "from-emerald-600/30 to-emerald-600/5",
    glow:     "rgba(16,185,129,0.08)",
    border:   "hover:border-emerald-500/25",
    roles:    ["Support AI", "Operations AI"],
    useCase:  "Answer patient FAQs, send appointment reminders, and automate admin paperwork.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 17V6l7-4 7 4v11M8 17V9h6v8"/>
      </svg>
    ),
    industry: "Education",
    gradient: "from-yellow-600/30 to-yellow-600/5",
    glow:     "rgba(234,179,8,0.07)",
    border:   "hover:border-yellow-500/25",
    roles:    ["Support AI", "Content AI"],
    useCase:  "Support students 24/7, create course content, and automate enrollment communication.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17V8l9-5 9 5v9M7 17V10h8v7"/>
      </svg>
    ),
    industry: "Real Estate",
    gradient: "from-orange-600/30 to-orange-600/5",
    glow:     "rgba(234,88,12,0.08)",
    border:   "hover:border-orange-500/25",
    roles:    ["Sales AI", "Content AI"],
    useCase:  "Qualify buyer leads, write property descriptions, and automate viewing follow-ups.",
  },
  {
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
        <rect x="2" y="3" width="18" height="16" rx="2"/>
        <path strokeLinecap="round" d="M2 8h18M8 8v11"/>
      </svg>
    ),
    industry: "Enterprise",
    gradient: "from-cyan-600/30 to-cyan-600/5",
    glow:     "rgba(6,182,212,0.08)",
    border:   "hover:border-cyan-500/25",
    roles:    ["All AI types"],
    useCase:  "Full workforce automation across every department — support, sales, ops, and content.",
  },
];

const roleColors: Record<string, string> = {
  "Support AI":    "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Sales AI":      "text-violet-400 bg-violet-500/10 border-violet-500/20",
  "Operations AI": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  "Content AI":    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "All AI types":  "text-accent bg-accent/10 border-accent/20",
};

export default function IndustrySolutions() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <AnimateIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              Industry Solutions
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
              Built for every{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                industry.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Genesis AI adapts to your business model. Deploy the right AI employee for your industry
              in minutes, trained on your specific workflows and knowledge.
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((ind, i) => (
            <AnimateIn key={ind.industry} delay={i * 65}>
              <div
                className={`group relative flex flex-col h-full p-6 rounded-2xl border border-border bg-surface ${ind.border} transition-all duration-300 overflow-hidden`}
              >
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${ind.glow} 0%, transparent 60%)` }}
                />

                <div className="relative z-10 flex flex-col h-full gap-4">
                  {/* Icon + name */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ind.gradient} border border-white/[0.08] flex items-center justify-center text-zinc-200 shrink-0 group-hover:scale-105 transition-transform duration-300`}
                    >
                      {ind.icon}
                    </div>
                    <h3 className="text-base font-bold text-white">{ind.industry}</h3>
                  </div>

                  {/* Use case */}
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">{ind.useCase}</p>

                  {/* Role badges */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border">
                    {ind.roles.map((role) => (
                      <span
                        key={role}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${roleColors[role] ?? "text-text-secondary bg-surface-elevated border-border"}`}
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
