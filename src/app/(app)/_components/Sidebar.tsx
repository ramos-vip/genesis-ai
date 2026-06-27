"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES, STORAGE_KEYS } from "@/shared/constants";
import { useLocalStorage } from "@/shared/hooks";

/* ─── Nav Item Data ─────────────────────────────────────────────────────── */

interface NavItem {
  label:   string;
  href:    string;
  icon:    React.FC<{ className?: string }>;
  badge?:  string;
}

interface NavSection {
  label?: string;
  items:  NavItem[];
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="3" y="3" width="5.5" height="5.5" rx="1" /><rect x="11.5" y="3" width="5.5" height="5.5" rx="1" />
      <rect x="3" y="11.5" width="5.5" height="5.5" rx="1" /><rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1" />
    </svg>
  );
}
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path strokeLinecap="round" d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM3 17a7 7 0 0114 0" />
    </svg>
  );
}
function BookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h5v12H4zM11 4h5v12h-5zM9 4v12" />
    </svg>
  );
}
function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 3L5 11h6l-2 6 8-9h-6l2-5z" />
    </svg>
  );
}
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l4-5 3 3 4-6 3 3" />
    </svg>
  );
}
function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <rect x="2" y="5" width="16" height="11" rx="2" /><path d="M2 9h16" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="10" cy="10" r="2.5" />
      <path strokeLinecap="round" d="M10 3v1.5M10 15.5V17M3 10h1.5M15.5 10H17M5.05 5.05l1.06 1.06M13.89 13.89l1.06 1.06M5.05 14.95l1.06-1.06M13.89 6.11l1.06-1.06" />
    </svg>
  );
}

const navSections: NavSection[] = [
  {
    items: [
      { label: "Dashboard",  href: ROUTES.APP.DASHBOARD,  icon: GridIcon },
    ],
  },
  {
    label: "Workforce",
    items: [
      { label: "Employees",  href: ROUTES.APP.EMPLOYEES.ROOT,  icon: UsersIcon },
      { label: "Knowledge",  href: ROUTES.APP.KNOWLEDGE.ROOT,  icon: BookIcon },
      { label: "Automation", href: ROUTES.APP.AUTOMATION.ROOT, icon: BoltIcon },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Analytics",  href: ROUTES.APP.ANALYTICS,       icon: ChartIcon },
      { label: "Billing",    href: ROUTES.APP.BILLING.ROOT,     icon: CreditCardIcon },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Settings",   href: ROUTES.APP.SETTINGS.ROOT,   icon: SettingsIcon },
    ],
  },
];

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function Sidebar() {
  const pathname   = usePathname();
  const [collapsed, setCollapsed] = useLocalStorage<boolean>(STORAGE_KEYS.SIDEBAR_COLLAPSED, false);

  function isActive(href: string): boolean {
    if (href === ROUTES.APP.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={[
        "relative flex flex-col h-full border-r border-border bg-surface",
        "transition-[width] duration-300 ease-in-out shrink-0",
        collapsed ? "w-16" : "w-60",
      ].join(" ")}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-border shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-white" aria-hidden>
            <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 12L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="currentColor" />
          </svg>
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-white truncate">Project Genesis</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section, si) => (
          <div key={si}>
            {section.label && !collapsed && (
              <p className="mb-2 px-2 text-[10px] font-semibold tracking-widest uppercase text-text-muted select-none">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5" role="list">
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon   = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={[
                        "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium",
                        "transition-all duration-150 group",
                        active
                          ? "bg-accent/10 text-accent"
                          : "text-text-secondary hover:text-text-primary hover:bg-white/[0.05]",
                      ].join(" ")}
                      aria-current={active ? "page" : undefined}
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-border shrink-0">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-all duration-150"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeftIcon
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </aside>
  );
}
