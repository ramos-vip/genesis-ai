import { ROUTES } from "@/shared/constants";
import Button from "@/components/ui/Button";

/* ─── Dashboard Preview sub-components ───────────────────────────────────── */

interface MiniEmployeeCardProps {
  initials: string;
  name:     string;
  gradient: string;
}

function MiniEmployeeCard({ initials, name, gradient }: MiniEmployeeCardProps) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-white/[0.07] bg-white/[0.02] min-w-[100px]">
      <div
        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-[10px] font-bold text-white/80 border border-white/[0.06] shrink-0`}
        aria-hidden
      >
        {initials}
      </div>
      <p className="text-[11px] font-semibold text-white/90 leading-tight truncate">{name}</p>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" aria-hidden />
        <span className="text-[9px] text-white/50">Active</span>
      </div>
    </div>
  );
}

function ChatBubble({ isAI, text }: { isAI: boolean; text: string }) {
  return (
    <div className={`flex items-start gap-1.5 ${isAI ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 ${
          isAI ? "bg-violet-600/40 text-violet-300" : "bg-white/10 text-white/50"
        }`}
        aria-hidden
      >
        {isAI ? "AI" : "U"}
      </div>
      <div
        className={`max-w-[78%] px-2.5 py-1.5 rounded-xl text-[10px] leading-relaxed ${
          isAI
            ? "bg-violet-600/[0.12] border border-violet-500/20 text-white/80"
            : "bg-white/[0.04] border border-white/[0.06] text-white/55"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div
      className="relative w-full max-w-[480px] hero-preview-appear"
      aria-hidden
    >
      {/* Ambient glow behind card */}
      <div
        className="absolute inset-0 -m-8 rounded-[40px] bg-violet-600/10 blur-[60px] hero-glow-drift pointer-events-none"
      />
      <div
        className="absolute top-10 right-0 w-64 h-64 bg-indigo-600/8 blur-[50px] rounded-full pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating badges */}
      <div
        className="hero-badge-float absolute -top-4 -right-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d0d12]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md"
        style={{ animationDelay: "0.5s" }}
      >
        <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse shrink-0" />
        <span className="text-[11px] font-semibold text-white/90">24/7 Active</span>
      </div>

      <div
        className="hero-badge-float absolute -bottom-3 -left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0d0d12]/90 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md"
        style={{ animationDelay: "1s" }}
      >
        <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 text-violet-400 shrink-0">
          <path d="M7 1L8.5 5.5H13L9.5 8L11 13L7 10.5L3 13L4.5 8L1 5.5H5.5L7 1Z" fill="currentColor"/>
        </svg>
        <span className="text-[11px] font-semibold text-white/90">98% Accuracy</span>
      </div>

      {/* Main card */}
      <div
        className="relative rounded-2xl border border-white/[0.08] overflow-hidden hero-float"
        style={{
          background: "linear-gradient(135deg, rgba(13,13,18,0.95) 0%, rgba(18,18,26,0.98) 100%)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04), 0 0 80px rgba(124,58,237,0.08)",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg viewBox="0 0 10 10" fill="none" className="w-3 h-3 text-white">
                <path d="M5 0.5L6.5 3.5H9.5L7.5 5.5L8.5 9L5 7L1.5 9L2.5 5.5L0.5 3.5H3.5L5 0.5Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xs font-semibold text-white/80">Genesis AI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 hidden sm:block">Dashboard</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 cursor-pointer hover:bg-violet-600/30 transition-colors">
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-2.5 h-2.5 text-violet-400">
                <path d="M5 1v8M1 5h8" strokeLinecap="round"/>
              </svg>
              <span className="text-[9px] font-semibold text-violet-300">New</span>
            </div>
          </div>
        </div>

        {/* Employee section */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-white/70">Your AI Workforce</p>
            <span className="text-[9px] text-violet-400">View all →</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <MiniEmployeeCard initials="SA" name="Sales AI"    gradient="from-violet-600/40 to-violet-600/10" />
            <MiniEmployeeCard initials="CS" name="Support AI"  gradient="from-blue-600/40 to-blue-600/10" />
            <MiniEmployeeCard initials="CO" name="Content AI"  gradient="from-emerald-600/40 to-emerald-600/10" />
          </div>
        </div>

        {/* Bottom row: Chat + Analytics */}
        <div className="grid grid-cols-2 divide-x divide-white/[0.06]">
          {/* Chat */}
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-white/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6a4 4 0 01-4 4 3.96 3.96 0 01-1.92-.49L2 10.5l.99-2.09A4 4 0 118 2v0a4 4 0 012 4z"/>
              </svg>
              <p className="text-[9px] font-semibold text-white/50 uppercase tracking-wide">AI Chat</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <ChatBubble isAI  text="How can I help you today?" />
              <ChatBubble isAI={false} text="Hi! Need order help" />
              <ChatBubble isAI  text="Sure! Let me pull that up…" />
            </div>
          </div>

          {/* Analytics */}
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-white/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 9l2.5-3.5 2 2L9 4l1.5 2"/>
              </svg>
              <p className="text-[9px] font-semibold text-white/50 uppercase tracking-wide">Analytics</p>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { label: "Employees", value: "3", color: "bg-violet-500/60" },
                { label: "Conversations", value: "12", color: "bg-blue-500/60" },
                { label: "Responses", value: "47", color: "bg-emerald-500/60" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[9px] text-white/45">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1 w-10 rounded-full ${color}`} />
                    <span className="text-[9px] font-semibold text-white/70 tabular-nums">{value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-white/40">Est. cost</span>
                <span className="text-[9px] font-semibold text-yellow-400/80 tabular-nums">$0.02</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */

const trustBadges = [
  "No Credit Card",
  "2 Min Setup",
  "Enterprise Security",
];

const avatarColors = ["bg-violet-700", "bg-indigo-700", "bg-blue-700", "bg-cyan-700", "bg-purple-700"];

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 bg-dot-grid" aria-hidden />

      {/* Primary glow — top right */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none hero-glow-drift"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
      />
      {/* Secondary glow — bottom left */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)",
          animationDelay: "3s",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-16">

          {/* ── Left: Text content (55%) ── */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full border border-violet-500/25 bg-violet-500/[0.06] text-sm text-violet-300">
              <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-violet-400 shrink-0">
                <path d="M6 0L7.5 4.5H12L8.5 7L10 12L6 9.5L2 12L3.5 7L0 4.5H4.5L6 0Z"/>
              </svg>
              <span className="font-medium">Powered by Gemini 2.5 Flash</span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[68px] font-bold tracking-tight text-white leading-[1.05] mb-6"
            >
              Your AI Workforce.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                Built in Minutes.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-zinc-400 leading-relaxed mb-9 max-w-[520px] mx-auto lg:mx-0">
              Create AI Employees that understand your business, answer customers,
              automate work and operate 24/7.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
              <Button variant="primary" size="lg" href={ROUTES.AUTH.SIGNUP}>
                Start Free
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
              <Button variant="secondary" size="lg" href={ROUTES.AUTH.SIGNUP}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
                  <circle cx="8" cy="8" r="6.5"/>
                  <path d="M6.5 5.5l4 2.5-4 2.5V5.5Z" fill="currentColor" strokeLinejoin="round"/>
                </svg>
                Watch Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mb-10">
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-violet-400 shrink-0" aria-hidden>
                    <path d="M1.5 6l3 3 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {badge}
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5" aria-hidden>
                  {avatarColors.map((color, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-[10px] font-medium text-white/80`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    1,000+ AI conversations
                  </p>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} viewBox="0 0 10 10" fill="currentColor" className="w-3 h-3 text-yellow-400" aria-hidden>
                        <path d="M5 0.5L6.2 3.8H9.8L7 5.9L8.1 9.2L5 7.2L1.9 9.2L3 5.9L0.2 3.8H3.8L5 0.5Z"/>
                      </svg>
                    ))}
                    <span className="text-[10px] text-zinc-500 ml-1">Trusted by growing businesses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Dashboard preview (45%) ── */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:max-w-[480px] flex justify-center lg:justify-end">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
