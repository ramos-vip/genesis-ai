import Link from "next/link";
import Badge  from "@/components/ui/Badge";
import { ROLE_BY_ID } from "../constants";
import { ROUTES }     from "@/shared/constants";
import type { Employee, EmployeeRole } from "../types";

interface EmployeeCardProps {
  employee: Employee;
}

const roleGradients: Record<EmployeeRole, string> = {
  support:    "from-blue-600/20 to-blue-600/5",
  sales:      "from-violet-600/20 to-violet-600/5",
  seo:        "from-orange-600/20 to-orange-600/5",
  content:    "from-emerald-600/20 to-emerald-600/5",
  email:      "from-rose-600/20 to-rose-600/5",
  operations: "from-cyan-600/20 to-cyan-600/5",
  custom:     "from-pink-600/20 to-pink-600/5",
};

const roleInitials: Record<EmployeeRole, string> = {
  support:    "CS",
  sales:      "SA",
  seo:        "SE",
  content:    "CO",
  email:      "EM",
  operations: "OP",
  custom:     "CU",
};

const statusVariant = {
  active:   "success",
  paused:   "warning",
  training: "info",
  error:    "danger",
  draft:    "default",
} as const;

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const roleData = ROLE_BY_ID[employee.role];
  const gradient = roleGradients[employee.role];
  const initials = roleInitials[employee.role];

  return (
    <div className="group relative flex flex-col h-full p-6 rounded-2xl border border-border bg-surface hover:border-white/[0.12] hover:bg-surface-elevated transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        {/* Role avatar */}
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center border border-white/[0.08] shrink-0`}
        >
          <span className="text-xs font-bold text-white/80">{initials}</span>
        </div>

        {/* Status */}
        <Badge
          variant={statusVariant[employee.status]}
          size="sm"
          dot
        >
          {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
        </Badge>
      </div>

      {/* Name + Role */}
      <h3 className="text-base font-semibold text-white mb-0.5 truncate">
        {employee.name}
      </h3>
      <p className="text-sm text-text-secondary mb-4 truncate">
        {roleData?.label ?? employee.role}
      </p>

      {/* Description */}
      {employee.description && (
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mb-5 flex-1">
          {employee.description}
        </p>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 py-4 border-t border-border mb-5">
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">
            Tasks done
          </p>
          <p className="text-lg font-bold text-white tabular-nums">
            {employee.stats.tasksCompleted.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">
            Success rate
          </p>
          <p className="text-lg font-bold text-white tabular-nums">
            {employee.stats.successRate}%
          </p>
        </div>
      </div>

      {/* Action */}
      <Link
        href={ROUTES.APP.EMPLOYEES.DETAIL(employee.id)}
        className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg border border-border bg-surface text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-hover hover:bg-surface-elevated transition-all duration-150 focus-ring"
      >
        Configure
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden>
          <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
