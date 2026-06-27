"use client";

import Link    from "next/link";
import Badge   from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { useEmployee }      from "../hooks/useEmployees";
import { ROLE_BY_ID }       from "../constants";
import { ROUTES }           from "@/shared/constants";
import { formatDate }       from "@/shared/utils";
import GeneralSection       from "./sections/GeneralSection";
import BehaviorSection      from "./sections/BehaviorSection";
import KnowledgeSection     from "./sections/KnowledgeSection";
import DangerZone           from "./sections/DangerZone";
import type { EmployeeRole, EmployeeStatus } from "../types";

const statusVariant: Record<EmployeeStatus, "success" | "warning" | "info" | "danger" | "default"> = {
  active:   "success",
  paused:   "warning",
  training: "info",
  error:    "danger",
  draft:    "default",
};

interface EmployeeDetailViewProps {
  id: string;
}

export default function EmployeeDetailView({ id }: EmployeeDetailViewProps) {
  const { data: employee, isLoading, isError } = useEmployee(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" color="accent" label="Loading employee…" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="mb-4 w-14 h-14 rounded-2xl bg-danger-bg border border-danger-border flex items-center justify-center">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-danger" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l.509 3.495m0 0l.509-3.495m-.509 3.495H10m-.25-7.5a.25.25 0 100-.5.25.25 0 000 .5zM10 17.5A7.5 7.5 0 1110 2.5a7.5 7.5 0 010 15z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2">Employee not found</h2>
        <p className="text-sm text-text-secondary mb-6">
          This employee may have been deleted or the link is invalid.
        </p>
        <Link
          href={ROUTES.APP.EMPLOYEES.ROOT}
          className="text-sm font-medium text-accent hover:text-violet-400 transition-colors"
        >
          ← Back to Employees
        </Link>
      </div>
    );
  }

  const roleData = ROLE_BY_ID[employee.role as EmployeeRole];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 text-xs text-text-muted">
          <li>
            <Link href={ROUTES.APP.DASHBOARD} className="hover:text-text-secondary transition-colors">
              Dashboard
            </Link>
          </li>
          <li aria-hidden>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
              <path d="M4.5 2l3 4-3 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li>
            <Link href={ROUTES.APP.EMPLOYEES.ROOT} className="hover:text-text-secondary transition-colors">
              Employees
            </Link>
          </li>
          <li aria-hidden>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
              <path d="M4.5 2l3 4-3 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </li>
          <li className="text-text-secondary truncate max-w-[160px]">{employee.name}</li>
        </ol>
      </nav>

      {/* Employee header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white tracking-tight truncate">
              {employee.name}
            </h1>
            <Badge variant={statusVariant[employee.status]} dot size="sm">
              {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>{roleData?.label ?? employee.role}</span>
            <span aria-hidden className="w-1 h-1 rounded-full bg-text-muted" />
            <span>Created {formatDate(employee.createdAt, "short")}</span>
          </div>
          {employee.description && (
            <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-xl">
              {employee.description}
            </p>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        <GeneralSection   employee={employee} />
        <BehaviorSection  employee={employee} />
        <KnowledgeSection employeeId={employee.id} />
        <DangerZone       employee={employee} />
      </div>
    </div>
  );
}
