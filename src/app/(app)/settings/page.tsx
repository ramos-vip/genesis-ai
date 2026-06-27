import type { Metadata } from "next";
import PageHeader from "@/shared/components/PageHeader";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile, team, and integrations."
        breadcrumb={[{ label: "Dashboard", href: ROUTES.APP.DASHBOARD }, { label: "Settings" }]}
      />
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-text-muted text-sm">
        Settings panels coming in Sprint 6
      </div>
    </div>
  );
}
