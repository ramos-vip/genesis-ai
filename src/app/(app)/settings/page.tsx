import type { Metadata } from "next";
import PageHeader  from "@/shared/components/PageHeader";
import ComingSoon  from "@/shared/components/ComingSoon";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile, team, and integrations."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Settings" },
        ]}
      />
      <ComingSoon
        title="Settings are being expanded"
        description="Full workspace configuration — profile, organization, team members, integrations, and API keys — all in one place."
        features={[
          "Profile and avatar management",
          "Organization settings and branding",
          "Team member invitations and roles",
          "Third-party integrations (Slack, Salesforce, HubSpot)",
          "API key management",
        ]}
        eta="Coming soon"
      />
    </div>
  );
}
