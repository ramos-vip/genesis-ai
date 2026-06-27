import type { Metadata } from "next";
import PageHeader        from "@/shared/components/PageHeader";
import { MarketplaceContent } from "@/modules/marketplace";
import { ROUTES }        from "@/shared/constants";

export const metadata: Metadata = { title: "AI Marketplace" };

export default function MarketplacePage() {
  return (
    <div>
      <PageHeader
        title="AI Marketplace"
        description="Install pre-built AI employees in one click. Each template comes with optimised prompts, temperature settings, and recommended knowledge sources."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Marketplace" },
        ]}
      />
      <MarketplaceContent />
    </div>
  );
}
