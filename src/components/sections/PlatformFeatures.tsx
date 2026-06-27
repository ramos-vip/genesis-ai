import AnimateIn from "@/components/ui/AnimateIn";

const features = [
  {
    title: "AI Employees",
    desc: "Deploy specialized AI for Sales, Support, Content, SEO, Email and Operations. Each trained on your knowledge, each working 24/7.",
    gradient: "from-violet-600/25 to-violet-600/5",
    glow: "rgba(124,58,237,0.1)",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5.5 h-5.5">
        <path strokeLinecap="round" d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM3 19a9 9 0 0118 0H3z"/>
      </svg>
    ),
  },
  {
    title: "Knowledge Base",
    desc: "Train your AI with your own documents, URLs, and text. RAG-powered retrieval ensures your AI always cites the right source.",
    gradient: "from-blue-600/25 to-blue-600/5",
    glow: "rgba(59,130,246,0.1)",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5.5 h-5.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h5v14H4zM13 4h5v14h-5zM9 4v14"/>
      </svg>
    ),
  },
  {
    title: "AI Chat",
    desc: "Real-time streaming conversations with your AI employees. Context-aware, knowledge-grounded, and conversation history that persists.",
    gradient: "from-emerald-600/25 to-emerald-600/5",
    glow: "rgba(16,185,129,0.08)",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5.5 h-5.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 8a8 8 0 01-8 8 7.9 7.9 0 01-3.83-.98L2 17l1.58-3.32A8 8 0 1120 8z"/>
      </svg>
    ),
  },
  {
    title: "Analytics",
    desc: "Track every conversation, measure response quality, monitor token usage, and estimate AI costs — all in one dashboard.",
    gradient: "from-orange-600/25 to-orange-600/5",
    glow: "rgba(234,88,12,0.08)",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5.5 h-5.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l3.5-5 3 3.5 3.5-7 4 5"/>
      </svg>
    ),
  },
  {
    title: "Billing & Usage",
    desc: "Transparent cost tracking with per-message and per-embedding pricing. No surprises. Monitor usage before you hit a limit.",
    gradient: "from-yellow-600/25 to-yellow-600/5",
    glow: "rgba(234,179,8,0.08)",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5.5 h-5.5">
        <circle cx="11" cy="11" r="8.5"/>
        <path strokeLinecap="round" d="M11 5.5v11M8.5 8.5C8.5 7.4 9.6 6.5 11 6.5s2.5.9 2.5 2S12.4 10 11 10s-2.5.9-2.5 2 1.1 1.5 2.5 1.5 2.5.9 2.5 2-1.1 1.5-2.5 1.5"/>
      </svg>
    ),
  },
  {
    title: "Enterprise Security",
    desc: "Every query filters by user ID. Your data stays yours — never used to train our models. SOC 2 compliant architecture.",
    gradient: "from-rose-600/25 to-rose-600/5",
    glow: "rgba(225,29,72,0.08)",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5.5 h-5.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 2L3 6v5c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6L11 2Z"/>
      </svg>
    ),
  },
];

export default function PlatformFeatures() {
  return (
    <section className="py-24 sm:py-32 bg-surface relative overflow-hidden">
      {/* Separator top */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <AnimateIn>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              Platform
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                scale with AI.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              A complete AI workforce platform — from knowledge ingestion to real-time chat,
              analytics, and billing — all in one place.
            </p>
          </div>
        </AnimateIn>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.05]">
          {features.map((f, i) => (
            <AnimateIn key={f.title} delay={i * 55}>
              <div className="group relative h-full p-8 bg-surface hover:bg-surface-elevated transition-colors duration-300 overflow-hidden">
                {/* Hover glow */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 0% 0%, ${f.glow} 0%, transparent 60%)` }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`mb-5 w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} border border-white/[0.07] flex items-center justify-center text-zinc-200 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {f.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
