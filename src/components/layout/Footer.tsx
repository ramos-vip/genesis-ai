import Link from "next/link";
import { ROUTES } from "@/shared/constants";

const columns = [
  {
    label: "Product",
    links: [
      { label: "Features",  href: ROUTES.HOME + "#features" },
      { label: "Pricing",   href: ROUTES.HOME + "#pricing"  },
      { label: "AI Employees", href: ROUTES.HOME + "#ai-employees" },
      { label: "FAQ",       href: ROUTES.HOME + "#faq"      },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About",    href: ROUTES.HOME },
      { label: "Blog",     href: ROUTES.HOME },
      { label: "Careers",  href: ROUTES.HOME },
      { label: "Press",    href: ROUTES.HOME },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "Docs",          href: ROUTES.HOME },
      { label: "API Reference", href: ROUTES.HOME },
      { label: "Status",        href: ROUTES.HOME },
      { label: "Community",     href: ROUTES.HOME },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy",  href: ROUTES.HOME },
      { label: "Terms",    href: ROUTES.HOME },
      { label: "Security", href: ROUTES.HOME },
      { label: "Cookies",  href: ROUTES.HOME },
    ],
  },
];

const socials = [
  { label: "GitHub",   href: "https://github.com/ramos-vip/genesis-ai" },
  { label: "X (Twitter)", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-20">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white">
                  <path
                    d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-white">Project Genesis</span>
            </Link>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[180px]">
              Build your AI workforce and scale without limits.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.label}>
              <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-zinc-500">
                {col.label}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Project Genesis. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
