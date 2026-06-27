import type { Metadata } from "next";
import Link           from "next/link";
import PageHeader     from "@/shared/components/PageHeader";
import Button         from "@/components/ui/Button";
import { EmployeeGrid } from "@/modules/employees";
import { ROUTES }     from "@/shared/constants";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's your AI workforce at a glance."
      />

      {/* AI Workforce section */}
      <section aria-labelledby="workforce-heading">
        <div className="flex items-center justify-between mb-6">
          <h2
            id="workforce-heading"
            className="text-base font-semibold text-text-primary"
          >
            Your AI Workforce
          </h2>
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.APP.EMPLOYEES.ROOT}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              View all
            </Link>
            <Button size="sm" href={ROUTES.APP.EMPLOYEES.NEW}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
                <path d="M8 2v12M2 8h12" strokeLinecap="round" />
              </svg>
              New Employee
            </Button>
          </div>
        </div>

        {/* Shows the 3 most recent employees */}
        <EmployeeGrid limit={3} />
      </section>
    </div>
  );
}
