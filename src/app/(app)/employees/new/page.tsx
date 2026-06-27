import type { Metadata } from "next";
import Link from "next/link";
import { CreateEmployeeWizard } from "@/modules/employees";
import { ROUTES } from "@/shared/constants";

export const metadata: Metadata = { title: "Create AI Employee" };

export default function NewEmployeePage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 text-xs text-text-muted">
          <li>
            <Link href={ROUTES.APP.DASHBOARD} className="hover:text-text-secondary transition-colors">
              Dashboard
            </Link>
          </li>
          <li aria-hidden>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
              <path d="M4.5 2l3 4-3 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li>
            <Link href={ROUTES.APP.EMPLOYEES.ROOT} className="hover:text-text-secondary transition-colors">
              Employees
            </Link>
          </li>
          <li aria-hidden>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
              <path d="M4.5 2l3 4-3 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li className="text-text-secondary">Create</li>
        </ol>
      </nav>

      {/* Wizard card */}
      <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10">
        <CreateEmployeeWizard />
      </div>
    </div>
  );
}
