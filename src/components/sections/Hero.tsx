import Button from "@/components/ui/Button";
import { ROUTES } from "@/shared/constants";

const avatarColors = [
  "bg-violet-700",
  "bg-indigo-700",
  "bg-blue-700",
  "bg-cyan-700",
  "bg-purple-700",
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Dot grid */}
      <div className="absolute inset-0 bg-dot-grid" />

      {/* Radial glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] hero-glow pointer-events-none"
      />

      {/* Secondary glow offset */}
      <div
        aria-hidden
        className="absolute left-[30%] top-[40%] w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[80px] pointer-events-none"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-sm text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
          <span>Introducing AI Workforce Platform</span>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-3 h-3 text-zinc-600"
          >
            <path d="M1.5 6h9M6 1.5L10.5 6 6 10.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold tracking-tight text-white leading-[1.05] mb-6">
          Build Your AI Workforce
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            in Minutes.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed mb-10">
          Create AI employees for Sales, Support, SEO, Content and Operations
          in one platform. Ship faster, scale smarter.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" size="lg" href={ROUTES.AUTH.SIGNUP}>
            Start Free
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-4 h-4"
            >
              <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
          <Button variant="secondary" size="lg" href={ROUTES.AUTH.SIGNUP}>
            Book Demo
          </Button>
        </div>

        {/* Social proof */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-zinc-500">
          <div className="flex -space-x-2.5">
            {avatarColors.map((color, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ${color} border-2 border-background flex items-center justify-center text-xs font-medium text-white/80`}
                aria-hidden
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <p>
            Trusted by <span className="text-zinc-300 font-medium">500+</span> companies worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
