import AnimateIn from "@/components/ui/AnimateIn";

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface ChatMessage { role: "ai" | "user"; text: string; streaming?: boolean }

interface ShowcaseEmployee {
  initials:      string;
  name:          string;
  role:          string;
  roleLabel:     string;
  gradient:      string;
  glowColor:     string;
  borderHover:   string;
  shadowHover:   string;
  chartData:     number[];
  chartColor:    string;
  stats: { knowledge: number; conversations: number; costPerMonth: string };
  badges: { label: string; color: string }[];
  chat:          ChatMessage[];
}

/* ─── Mini analytics bar chart ────────────────────────────────────────────── */

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  const W   = data.length * 9;
  return (
    <svg
      viewBox={`0 0 ${W} 28`}
      className="w-full h-7"
      aria-label="Activity chart"
      role="img"
    >
      {data.map((v, i) => {
        const h     = Math.max(2, (v / max) * 24);
        const alpha = v > 0 ? 0.4 + (v / max) * 0.6 : 0.1;
        return (
          <rect
            key={i}
            x={i * 9 + 1.5}
            y={28 - h}
            width={6}
            height={h}
            rx={2}
            fill={color}
            fillOpacity={alpha}
          />
        );
      })}
    </svg>
  );
}

/* ─── Mini chat preview ───────────────────────────────────────────────────── */

function MiniChat({ messages, accentColor }: { messages: ChatMessage[]; accentColor: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {messages.map((m, i) => (
        <div key={i} className={`flex gap-1.5 items-start ${m.role === "user" ? "flex-row-reverse" : ""}`}>
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold shrink-0 mt-0.5 ${
              m.role === "ai"
                ? `text-white/70 border border-white/10`
                : "bg-white/10 text-white/50"
            }`}
            style={m.role === "ai" ? { backgroundColor: accentColor + "33", borderColor: accentColor + "44" } : {}}
            aria-hidden
          >
            {m.role === "ai" ? "AI" : "U"}
          </div>
          <div
            className={`max-w-[80%] px-2 py-1 rounded-xl text-[9px] leading-relaxed ${
              m.role === "ai"
                ? "text-white/75 border border-white/[0.07]"
                : "bg-white/[0.04] border border-white/[0.05] text-white/45"
            }`}
            style={m.role === "ai" ? { backgroundColor: accentColor + "18", borderColor: accentColor + "28" } : {}}
          >
            {m.text}
            {m.streaming && (
              <span className="inline-block w-0.5 h-2.5 align-middle ml-0.5 animate-pulse" style={{ backgroundColor: accentColor }} aria-hidden />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Individual showcase card ────────────────────────────────────────────── */

function AIShowcaseCard({ emp }: { emp: ShowcaseEmployee }) {
  return (
    <div
      className={`group relative flex flex-col h-full rounded-2xl border border-border bg-surface ${emp.borderHover} transition-all duration-300 overflow-hidden`}
      style={{ "--hover-shadow": emp.shadowHover } as React.CSSProperties}
    >
      {/* Hover glow overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 15% 15%, ${emp.glowColor} 0%, transparent 55%)` }}
      />

      {/* ── Header: avatar + role + online ── */}
      <div className="relative z-10 flex items-start justify-between p-5 pb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${emp.gradient} border border-white/[0.08] flex items-center justify-center text-sm font-bold text-white/80 shrink-0 transition-transform duration-300 group-hover:scale-105`}
          >
            {emp.initials}
            {/* Online indicator */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#4ade80] border-2 border-surface"
              aria-hidden
            >
              <div className="w-full h-full rounded-full bg-[#4ade80] animate-ping opacity-75" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white leading-tight">{emp.name}</p>
            <p className="text-[10px] text-text-muted">{emp.roleLabel}</p>
          </div>
        </div>

        {/* Online status badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" aria-hidden />
          <span className="text-[9px] font-semibold text-[#4ade80]">Online</span>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="relative z-10 grid grid-cols-3 gap-0 mx-5 mb-4 rounded-xl border border-border bg-surface-elevated divide-x divide-border overflow-hidden">
        {[
          { label: "Knowledge", value: String(emp.stats.knowledge), unit: "sources" },
          { label: "Chats",     value: String(emp.stats.conversations), unit: "total" },
          { label: "Est. Cost", value: emp.stats.costPerMonth, unit: "/month" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="flex flex-col items-center py-2.5">
            <p className="text-sm font-bold text-white tabular-nums leading-tight">{value}</p>
            <p className="text-[9px] text-text-muted">{unit}</p>
            <p className="text-[8px] text-text-muted mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Mini analytics chart ── */}
      <div className="relative z-10 mx-5 mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">7-day activity</p>
          <p className="text-[9px] text-text-muted">messages</p>
        </div>
        <div className="p-2.5 rounded-xl border border-border bg-surface-elevated">
          <MiniChart data={emp.chartData} color={emp.chartColor} />
        </div>
      </div>

      {/* ── Chat preview ── */}
      <div className="relative z-10 mx-5 mb-4 flex-1">
        <p className="text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-2">Live conversation</p>
        <div className="p-3 rounded-xl border border-border bg-surface-elevated">
          <MiniChat messages={emp.chat} accentColor={emp.chartColor} />
        </div>
      </div>

      {/* ── Action badges ── */}
      <div className="relative z-10 mx-5 mb-5 flex flex-wrap gap-1.5">
        {emp.badges.map(b => (
          <span
            key={b.label}
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold border ${b.color}`}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Employee data ───────────────────────────────────────────────────────── */

const employees: ShowcaseEmployee[] = [
  {
    initials:    "CS",
    name:        "Sarah",
    role:        "support",
    roleLabel:   "Customer Support Specialist",
    gradient:    "from-blue-500/40 to-blue-600/15",
    glowColor:   "rgba(59,130,246,0.10)",
    borderHover: "hover:border-blue-500/30",
    shadowHover: "0 0 40px rgba(59,130,246,0.12)",
    chartData:   [3, 5, 2, 8, 6, 10, 7],
    chartColor:  "#3b82f6",
    stats: { knowledge: 5, conversations: 23, costPerMonth: "$0.02" },
    badges: [
      { label: "24/7 Available",     color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      { label: "Knowledge-powered",  color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
      { label: "< 2s response",      color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
    ],
    chat: [
      { role: "ai",   text: "Hi! How can I help you today?" },
      { role: "user", text: "I need to process a return" },
      { role: "ai",   text: "Sure! Per our 30-day policy, I'll generate a return label now…", streaming: true },
    ],
  },
  {
    initials:    "SA",
    name:        "Alex",
    role:        "sales",
    roleLabel:   "Sales Development Rep",
    gradient:    "from-violet-500/40 to-violet-600/15",
    glowColor:   "rgba(124,58,237,0.10)",
    borderHover: "hover:border-violet-500/30",
    shadowHover: "0 0 40px rgba(124,58,237,0.12)",
    chartData:   [4, 2, 6, 3, 9, 5, 8],
    chartColor:  "#7c3aed",
    stats: { knowledge: 3, conversations: 18, costPerMonth: "$0.01" },
    badges: [
      { label: "24/7 Available",    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      { label: "CRM-ready",         color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
      { label: "Auto-qualify",      color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
    ],
    chat: [
      { role: "ai",   text: "Thanks for your interest in Genesis AI!" },
      { role: "user", text: "We have a 50-person marketing team" },
      { role: "ai",   text: "Perfect for Business plan. I can book a demo now…", streaming: true },
    ],
  },
  {
    initials:    "MK",
    name:        "Maya",
    role:        "marketing",
    roleLabel:   "Marketing & Content AI",
    gradient:    "from-rose-500/40 to-pink-600/15",
    glowColor:   "rgba(244,63,94,0.08)",
    borderHover: "hover:border-rose-500/30",
    shadowHover: "0 0 40px rgba(244,63,94,0.10)",
    chartData:   [8, 11, 6, 14, 9, 12, 16],
    chartColor:  "#f43f5e",
    stats: { knowledge: 7, conversations: 41, costPerMonth: "$0.03" },
    badges: [
      { label: "24/7 Available",     color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      { label: "Brand voice trained",color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
      { label: "Multi-channel",      color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
    ],
    chat: [
      { role: "ai",   text: "Ready to create content! What do you need?" },
      { role: "user", text: "Write a LinkedIn post about AI automation" },
      { role: "ai",   text: "🚀 AI isn't replacing your team — it's doubling it. Here's how…", streaming: true },
    ],
  },
  {
    initials:    "OP",
    name:        "Jordan",
    role:        "operations",
    roleLabel:   "Operations Automation AI",
    gradient:    "from-cyan-500/40 to-cyan-600/15",
    glowColor:   "rgba(6,182,212,0.08)",
    borderHover: "hover:border-cyan-500/30",
    shadowHover: "0 0 40px rgba(6,182,212,0.10)",
    chartData:   [2, 4, 3, 6, 4, 7, 5],
    chartColor:  "#06b6d4",
    stats: { knowledge: 4, conversations: 12, costPerMonth: "$0.01" },
    badges: [
      { label: "24/7 Available",    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
      { label: "Workflow automation",color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
      { label: "Real-time digest",  color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    ],
    chat: [
      { role: "ai",   text: "Operations dashboard ready. What needs attention?" },
      { role: "user", text: "Summarize yesterday's team standups" },
      { role: "ai",   text: "📋 Daily digest: 3 blockers, 7 action items, 2 shipped…", streaming: true },
    ],
  },
];

/* ─── Section ─────────────────────────────────────────────────────────────── */

export default function AIShowcase() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <AnimateIn>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent/80 mb-4">
              In Action
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.1] mb-5">
              AI Employees{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                working right now.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              See exactly what your AI workforce does — every conversation, every action,
              every decision. Grounded in your knowledge base. Running 24/7.
            </p>
          </div>
        </AnimateIn>

        {/* 2×2 card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {employees.map((emp, i) => (
            <AnimateIn key={emp.name} delay={i * 90}>
              <AIShowcaseCard emp={emp} />
            </AnimateIn>
          ))}
        </div>

        {/* Footer note */}
        <AnimateIn delay={360}>
          <p className="mt-10 text-center text-xs text-text-muted">
            All conversations are grounded in your connected knowledge sources via RAG.
            Responses shown are illustrative examples.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
