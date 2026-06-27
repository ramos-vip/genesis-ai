import Link from "next/link";
import { ROUTES } from "@/shared/constants";

const columns = [
  {
    label: "Company",
    links: [
      { label: "About",    href: ROUTES.HOME },
      { label: "Careers",  href: ROUTES.HOME },
      { label: "Contact",  href: ROUTES.AUTH.SIGNUP },
    ],
  },
  {
    label: "Product",
    links: [
      { label: "Platform", href: ROUTES.HOME + "#features" },
      { label: "Pricing",  href: ROUTES.HOME + "#pricing" },
      { label: "Security", href: ROUTES.HOME },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Documentation", href: ROUTES.HOME, soon: true },
      { label: "API Reference",  href: ROUTES.HOME, soon: true },
      { label: "Blog",           href: ROUTES.HOME, soon: true },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy", href: ROUTES.HOME },
      { label: "Terms",   href: ROUTES.HOME },
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
        <path d="M11.571 9.107L18.5 1h-1.653l-6.01 6.985L6.012 1H1l7.26 10.572L1 19.25h1.653l6.35-7.378 5.073 7.378H19L11.571 9.107zm-2.249 2.613l-.736-1.053L3.316 2.27h2.521l4.726 6.764.736 1.053 6.146 8.79H14.92l-5.597-8.158z"/>
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
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-10 lg:gap-16">

          {/* Navigation columns */}
          {columns.map((col) => (
            <div key={col.label}>
              <p className="mb-5 text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
                {col.label}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-150"
                    >
                      {link.label}
                      {"soon" in link && link.soon && (
                        <span className="text-[8px] font-bold text-text-muted border border-border rounded-full px-1.5 py-0.5">
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
          <div className="col-span-2 sm:col-span-1 flex flex-col justify-between">
            {/* Logo */}
            <div>
              <Link href={ROUTES.HOME} className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center group-hover:bg-accent-hover transition-colors shrink-0">
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white">
                    <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-white tracking-tight">Genesis AI</span>
              </Link>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[200px]">
                Build your AI workforce in minutes. No engineers required.
              </p>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:border-border-hover transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Genesis AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" aria-hidden />
            <p className="text-xs text-zinc-600">All systems operational</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
