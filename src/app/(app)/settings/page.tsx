"use client";

import { useState } from "react";
import PageHeader from "@/shared/components/PageHeader";
import ComingSoon from "@/shared/components/ComingSoon";
import { ROUTES }    from "@/shared/constants";
import ProfileSection      from "./_components/ProfileSection";
import OrganizationSection from "./_components/OrganizationSection";
import AIDefaultsSection   from "./_components/AIDefaultsSection";
import NotificationsSection from "./_components/NotificationsSection";
import AppearanceSection   from "./_components/AppearanceSection";
import SecuritySection     from "./_components/SecuritySection";

/* ─── Navigation ──────────────────────────────────────────────────────────── */

type SectionId =
  | "profile" | "organization" | "ai-defaults"
  | "notifications" | "appearance" | "security" | "api-keys";

interface NavItem {
  id:    SectionId;
  label: string;
  icon:  React.ReactNode;
}

const NAV: NavItem[] = [
  { id: "profile",       label: "Profile",        icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><circle cx="8" cy="5.5" r="2.5"/><path strokeLinecap="round" d="M2 14a6 6 0 0112 0"/></svg> },
  { id: "organization",  label: "Organization",   icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2 14V6l6-4 6 4v8M6 14V9h4v5"/></svg> },
  { id: "ai-defaults",   label: "AI Defaults",    icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 1L9.5 5.5H14L10.5 8.5l1.5 5L8 11l-4 2.5 1.5-5L2 5.5h4.5L8 1Z"/></svg> },
  { id: "notifications", label: "Notifications",  icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" d="M8 2a5 5 0 00-5 5v2.5L1.5 11h13L13 9.5V7a5 5 0 00-5-5zM6.5 13a1.5 1.5 0 003 0"/></svg> },
  { id: "appearance",    label: "Appearance",     icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><circle cx="8" cy="8" r="6.5"/><path strokeLinecap="round" d="M8 1.5v13M1.5 8h13"/></svg> },
  { id: "security",      label: "Security",       icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8 1.5L2 4v4c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1.5Z"/></svg> },
  { id: "api-keys",      label: "API Keys",       icon: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><circle cx="5.5" cy="10.5" r="3"/><path strokeLinecap="round" d="M8 8l5.5-5.5M11 2l3 3M9.5 3.5l3 3"/></svg> },
];

/* ─── Content renderer ────────────────────────────────────────────────────── */

function SectionContent({ id }: { id: SectionId }) {
  switch (id) {
    case "profile":       return <ProfileSection />;
    case "organization":  return <OrganizationSection />;
    case "ai-defaults":   return <AIDefaultsSection />;
    case "notifications": return <NotificationsSection />;
    case "appearance":    return <AppearanceSection />;
    case "security":      return <SecuritySection />;
    case "api-keys":
      return (
        <ComingSoon
          title="API Keys"
          description="Generate and manage API keys to integrate Genesis AI into your own applications and workflows."
          features={[
            "Create scoped API keys per use-case",
            "Read-only or full-access permissions",
            "Revoke keys instantly",
            "Usage logging per key",
          ]}
          eta="Coming soon"
        />
      );
  }
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function SettingsPage() {
  const [active, setActive] = useState<SectionId>("profile");

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile, workspace, and preferences."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Settings" },
        ]}
      />

      <div className="flex gap-6 items-start">
        {/* ── Sidebar nav (desktop) ── */}
        <nav
          className="hidden lg:flex flex-col gap-0.5 w-52 shrink-0 sticky top-4"
          aria-label="Settings navigation"
        >
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                active === item.id
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]",
              ].join(" ")}
              aria-current={active === item.id ? "page" : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* ── Mobile: horizontal scroll nav ── */}
        <div className="lg:hidden -mx-6 px-6 mb-6 overflow-x-auto w-screen">
          <div className="flex gap-1 pb-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={[
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0",
                  active === item.id
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-text-primary bg-surface border border-border",
                ].join(" ")}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 min-w-0">
          <SectionContent id={active} />
        </div>
      </div>
    </div>
  );
}
