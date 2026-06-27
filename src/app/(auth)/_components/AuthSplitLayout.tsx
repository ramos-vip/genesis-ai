import { ReactNode } from "react";
import Link from "next/link";
import { ROUTES } from "@/shared/constants";

interface Feature {
  text: string;
}

interface Quote {
  text:   string;
  author: string;
  role:   string;
}

interface AuthSplitLayoutProps {
  /** Metadata */
  title:       string;
  /** Custom heading shown above Clerk component on the right panel */
  heading:     string;
  subheading:  string;
  /** Left panel content */
  headline:    ReactNode;
  description: string;
  features:    Feature[];
  quote?:      Quote;
  /** Navigation */
  backLabel?:  string;
  switchHref:  string;
  switchPrompt: string;
  switchLabel: string;
  /** Clerk component */
  children:    ReactNode;
}

/* ─── Logo ────────────────────────────────────────────────────────────────── */

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href={ROUTES.HOME}
      className={`flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg ${className}`}
    >
      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/15 transition-colors">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white" aria-hidden>
          <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor" />
        </svg>
      </div>
      <span className="text-sm font-semibold text-white tracking-tight">Project Genesis</span>
    </Link>
  );
}

/* ─── Check icon ──────────────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <div className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-400/30 flex items-center justify-center shrink-0 mt-0.5">
      <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5 text-violet-300" aria-hidden>
        <path d="M1.5 5l2.5 2.5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function AuthSplitLayout({
  heading,
  subheading,
  headline,
  description,
  features,
  quote,
  switchHref,
  switchPrompt,
  switchLabel,
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Left panel — branding ────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-col justify-between p-12 xl:p-16"
        style={{
          background: "linear-gradient(135deg, #1e0b4a 0%, #0f0628 40%, #07050f 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #4f46e5 0%, transparent 70%)" }}
        />
        {/* Subtle grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Logo />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          {/* Headline */}
          <div className="mb-8">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-5">
              {headline}
            </h1>
            <p className="text-violet-200/80 text-base leading-relaxed max-w-sm">
              {description}
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3.5">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-sm text-violet-100/80 leading-relaxed">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        {quote && (
          <div className="relative z-10 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-sm text-violet-100/90 leading-relaxed mb-3 italic">
              &ldquo;{quote.text}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-600/40 border border-violet-400/30 flex items-center justify-center text-xs font-semibold text-white">
                {quote.author[0]}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{quote.author}</p>
                <p className="text-[10px] text-violet-300/70">{quote.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right panel — form ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Mobile-only top bar */}
        <div className="lg:hidden flex items-center justify-between h-16 px-6 border-b border-border">
          <Logo />
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center p-6 py-10 overflow-y-auto">
          <div className="w-full max-w-[400px]">
            {/* Back link */}
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors mb-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            >
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
                <path d="M8 1.5L4 6l4 4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Genesis AI
            </Link>

            {/* Custom heading — replaces Clerk's "Sign in to My Application" */}
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">{heading}</h2>
              <p className="text-sm text-text-secondary">{subheading}</p>
            </div>

            {/* Clerk component */}
            {children}

            {/* Switch link */}
            <p className="mt-6 text-center text-sm text-text-secondary">
              {switchPrompt}{" "}
              <Link
                href={switchHref}
                className="font-medium text-accent hover:text-violet-400 transition-colors focus:outline-none focus-visible:underline"
              >
                {switchLabel}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-5 border-t border-border text-center text-xs text-text-muted">
          © {new Date().getFullYear()} Project Genesis.{" "}
          <Link href={ROUTES.HOME} className="hover:text-text-secondary transition-colors">Privacy</Link>
          {" · "}
          <Link href={ROUTES.HOME} className="hover:text-text-secondary transition-colors">Terms</Link>
        </footer>
      </div>
    </div>
  );
}
