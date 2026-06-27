import Link from "next/link";
import { ROUTES } from "@/shared/constants";

const columns = [
  {
    label: "Company",
    links: [
      { label: "About",    href: ROUTES.HOME },
      { label: "Careers",  href: ROUTES.HOME },
      { label: "Contact",  href: ROUTES.AUTH.SIGNUP },
      { label: "Press",    href: ROUTES.HOME },
    ],
  },
  {
    label: "Platform",
    links: [
      { label: "AI Employees",   href: "/#solutions" },
      { label: "Knowledge Base", href: "/#platform"  },
      { label: "Analytics",      href: "/#platform"  },
      { label: "Pricing",        href: ROUTES.PRICING },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Documentation", href: ROUTES.HOME, soon: true },
      { label: "API Reference",  href: ROUTES.HOME, soon: true },
      { label: "Blog",           href: ROUTES.HOME, soon: true },
      { label: "Community",      href: ROUTES.HOME, soon: true },
    ],
  },
  {
    label: "Enterprise",
    links: [
      { label: "Security",     href: ROUTES.HOME },
      { label: "Compliance",   href: ROUTES.HOME },
      { label: "Contact Sales",href: ROUTES.AUTH.SIGNUP },
      { label: "SLA",          href: ROUTES.HOME, soon: true },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy Policy", href: ROUTES.HOME },
      { label: "Terms of Service", href: ROUTES.HOME },
      { label: "Cookie Policy",  href: ROUTES.HOME },
      { label: "GDPR",           href: ROUTES.HOME },
    ],
  },
];

const socials = [
  {
    label: "GitHub",
    href:  "https://github.com/ramos-vip/genesis-ai",
    icon:  (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd"/>
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href:  "https://x.com",
    icon:  (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d="M11.571 9.107L18.5 1h-1.653l-6.01 6.985L6.012 1H1l7.26 10.572L1 19.25h1.653l6.35-7.378 5.073 7.378H19L11.571 9.107z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href:  "https://linkedin.com",
    icon:  (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 pt-16 sm:pt-20 pb-10">

        {/* Top grid: nav columns + brand */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10 mb-14">
          {/* Navigation columns */}
          {columns.map((col) => (
            <div key={col.label}>
              <p className="mb-4 text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-600">
                {col.label}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-150 focus:outline-none focus-visible:text-accent"
                    >
                      {link.label}
                      {"soon" in link && link.soon && (
                        <span className="text-[8px] font-bold text-zinc-600 border border-zinc-800 rounded-full px-1.5 py-px">
                          Soon
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-5">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              aria-label="Genesis AI home"
            >
              <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center group-hover:bg-accent-hover transition-colors">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white" aria-hidden>
                  <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-white">Genesis AI</span>
            </Link>

            <p className="text-sm text-zinc-500 leading-relaxed">
              Build your AI workforce in minutes. No engineers required.
            </p>

            {/* Security badges */}
            <div className="flex flex-col gap-2">
              {[
                { label: "SOC 2 Compliant", icon: "🛡" },
                { label: "GDPR Ready",       icon: "🔒" },
                { label: "Gemini 2.5 Flash", icon: "⚡" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-[10px] font-medium text-zinc-600">
                  <span aria-hidden>{b.icon}</span>
                  {b.label}
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:border-border-hover transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600 order-2 sm:order-1">
            © {new Date().getFullYear()} Genesis AI. All rights reserved.
          </p>

          <div className="flex items-center gap-4 order-1 sm:order-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden />
              <span className="text-xs text-zinc-600">All systems operational</span>
            </div>
            <span className="text-zinc-800 text-xs hidden sm:block" aria-hidden>·</span>
            <span className="text-xs text-zinc-700">v1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
