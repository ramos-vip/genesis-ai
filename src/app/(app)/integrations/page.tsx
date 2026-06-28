import type { Metadata } from "next";
import PageHeader            from "@/shared/components/PageHeader";
import { IntegrationsContent } from "@/modules/integrations";
import { ROUTES }            from "@/shared/constants";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect Genesis AI to your existing tools, platforms, and services."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Integrations" },
        ]}
      />
      <IntegrationsContent />
    </div>
  );
}
