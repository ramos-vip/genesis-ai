"use client";

import Link  from "next/link";
import { useEffect, useState } from "react";
import { ROUTES } from "@/shared/constants";

/* ─── Nav data ────────────────────────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Platform",   href: "/#platform" },
  { label: "Solutions",  href: "/#solutions" },
  { label: "Pricing",    href: ROUTES.PRICING },
  { label: "Resources",  href: "#",          soon: true },
  { label: "Enterprise", href: "#",          soon: true },
] as const;

/* ─── Logo ────────────────────────────────────────────────────────────────── */

function Logo() {
  return (
    <Link
      href={ROUTES.HOME}
      className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
      aria-label="Genesis AI — home"
    >
      <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_12px_rgba(124,58,237,0.35)]">
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white" aria-hidden>
          <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor"/>
        </svg>
      </div>
      <span className="text-[15px] font-semibold text-white tracking-tight">Genesis AI</span>
    </Link>
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else            document.body.style.overflow = "";
    return ()      => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Skip to main content — screen reader / keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-white focus:text-sm focus:font-medium focus:outline-none"
      >
        Skip to main content
      </a>

      <nav
        role="navigation"
        aria-label="Main navigation"
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#07070a]/88 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5" role="menubar">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                role="menuitem"
                className="nav-link relative flex items-center gap-1.5 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
                aria-disabled={"soon" in link && link.soon}
              >
                {link.label}
                {"soon" in link && link.soon && (
                  <span className="text-[8px] font-bold text-text-muted border border-border rounded-full px-1 py-px leading-none">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Log in
            </Link>
            <Link
              href={ROUTES.AUTH.SIGNUP}
              className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_0_16px_rgba(124,58,237,0.2)] hover:shadow-[0_0_22px_rgba(124,58,237,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start Free
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
                <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-white/[0.06] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent gap-1.5"
          >
            <span className={`block w-5 h-px bg-zinc-300 transition-all duration-250 origin-center ${mobileOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
            <span className={`block w-5 h-px bg-zinc-300 transition-all duration-250 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-5 h-px bg-zinc-300 transition-all duration-250 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#07070a]/95 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />

          {/* Content */}
          <div className="relative pt-20 px-6 pb-8 flex flex-col h-full menu-slide">
            {/* Nav links */}
            <nav className="flex flex-col flex-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="nav-item flex items-center justify-between py-4 border-b border-border text-base font-medium text-zinc-300 hover:text-white transition-colors focus:outline-none focus-visible:text-accent"
                  style={{ animationDelay: `${i * 50}ms` }}
                  aria-disabled={"soon" in link && link.soon}
                >
                  <span>{link.label}</span>
                  <div className="flex items-center gap-2">
                    {"soon" in link && link.soon && (
                      <span className="text-[9px] font-bold text-text-muted border border-border rounded-full px-2 py-0.5">
                        Soon
                      </span>
                    )}
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-text-muted" aria-hidden>
                      <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Mobile CTAs */}
            <div
              className="nav-item flex flex-col gap-3 mt-8"
              style={{ animationDelay: `${NAV_LINKS.length * 50}ms` }}
            >
              <Link
                href={ROUTES.AUTH.LOGIN}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center h-12 rounded-xl border border-border text-sm font-semibold text-text-secondary hover:text-text-primary hover:border-border-hover transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Log in
              </Link>
              <Link
                href={ROUTES.AUTH.SIGNUP}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-hover transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Start Free — no credit card
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
                  <path d="M2 6h8M6 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
