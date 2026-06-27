import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ROUTES } from "@/shared/constants";
import type { EmployeeAnalytic } from "@/server/actions/analytics";

const roleLabel: Record<string, string> = {
  support: "Support", sales: "Sales", seo: "SEO",
  content: "Content", email: "Email", operations: "Operations", custom: "Custom",
};

const statusVariant = {
  active:   "success", paused: "warning", training: "info",
  error:    "danger",  draft:  "default",
} as const;

function formatK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function formatCost(usd: number): string {
  if (usd === 0)  return "$0.00";
  if (usd < 0.01) return "<$0.01";
  return `$${usd.toFixed(3)}`;
}

const roleGradient: Record<string, string> = {
  support: "from-blue-600/20 to-blue-600/5",
  sales:   "from-violet-600/20 to-violet-600/5",
  seo:     "from-orange-600/20 to-orange-600/5",
  content: "from-emerald-600/20 to-emerald-600/5",
  email:   "from-rose-600/20 to-rose-600/5",
  operations: "from-cyan-600/20 to-cyan-600/5",
  custom:  "from-pink-600/20 to-pink-600/5",
};
const roleInitials: Record<string, string> = {
  support: "CS", sales: "SA", seo: "SE",
  content: "CO", email: "EM", operations: "OP", custom: "CU",
};

export default function EmployeeTable({ employees }: { employees: EmployeeAnalytic[] }) {
  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text-primary">Top AI Employees</h3>
        </div>
        <div className="flex items-center justify-center py-16 text-center">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">No employees yet</p>
            <p className="text-xs text-text-muted">Create your first AI employee to see performance data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Top AI Employees</h3>
        <Link
          href={ROUTES.APP.EMPLOYEES.ROOT}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Desktop table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-border">
              {["Name", "Chats", "Messages", "Tokens", "Est. Cost", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="hover:bg-surface-elevated transition-colors group"
              >
                {/* Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleGradient[emp.role] ?? "from-gray-600/20 to-gray-600/5"} border border-white/[0.08] flex items-center justify-center shrink-0`}
                    >
                      <span className="text-[10px] font-bold text-white/70">
                        {roleInitials[emp.role] ?? "??"}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={ROUTES.APP.EMPLOYEES.DETAIL(emp.id)}
                        className="text-sm font-medium text-text-primary hover:text-white transition-colors truncate block max-w-[140px]"
                      >
                        {emp.name}
                      </Link>
                      <p className="text-[10px] text-text-muted">{roleLabel[emp.role] ?? emp.role}</p>
                    </div>
                  </div>
                </td>

                {/* Chats */}
                <td className="px-5 py-3.5">
                  <span className="text-sm tabular-nums text-text-primary font-medium">
                    {emp.chatCount}
                  </span>
                </td>

                {/* Messages */}
                <td className="px-5 py-3.5">
                  <span className="text-sm tabular-nums text-text-primary font-medium">
                    {emp.messageCount}
                  </span>
                </td>

                {/* Tokens */}
                <td className="px-5 py-3.5">
                  <span className="text-sm tabular-nums text-text-secondary">
                    {formatK(emp.tokenCount)}
                  </span>
                </td>

                {/* Cost */}
                <td className="px-5 py-3.5">
                  <span className="text-sm tabular-nums text-text-secondary">
                    {formatCost(emp.costUsd)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <Badge
                    variant={statusVariant[emp.status as keyof typeof statusVariant] ?? "default"}
                    size="sm"
                    dot
                  >
                    {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
