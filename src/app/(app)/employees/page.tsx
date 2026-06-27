import type { Metadata } from "next";
import PageHeader    from "@/shared/components/PageHeader";
import Button        from "@/components/ui/Button";
import { EmployeeGrid } from "@/modules/employees";
import { ROUTES }    from "@/shared/constants";

export const metadata: Metadata = { title: "AI Employees" };

export default function EmployeesPage() {
  return (
    <div>
      <PageHeader
        title="AI Employees"
        description="Your AI workforce — create, configure, and monitor your team."
        breadcrumb={[
          { label: "Dashboard", href: ROUTES.APP.DASHBOARD },
          { label: "Employees" },
        ]}
        actions={
          <Button size="sm" href={ROUTES.APP.EMPLOYEES.NEW}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <path d="M8 2v12M2 8h12" strokeLinecap="round" />
            </svg>
            New Employee
          </Button>
        }
      />

      <EmployeeGrid />
    </div>
  );
}
