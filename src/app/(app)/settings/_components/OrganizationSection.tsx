"use client";

import { useUser } from "@clerk/nextjs";
import { useEmployees } from "@/modules/employees/hooks/useEmployees";
import { useKnowledgeSources } from "@/modules/knowledge/hooks/useKnowledge";
import Skeleton from "@/components/ui/Skeleton";

function StatBlock({ label, value, loading }: { label: string; value: number | string; loading?: boolean }) {
  return (
    <div className="p-4 rounded-xl border border-border bg-surface-elevated">
      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">{label}</p>
      {loading ? (
        <Skeleton variant="rect" width={40} height={22} className="rounded" />
      ) : (
        <p className="text-xl font-bold text-white tabular-nums">{value}</p>
      )}
    </div>
  );
}

export default function OrganizationSection() {
  const { user }                         = useUser();
  const { data: employees, isLoading: le } = useEmployees();
  const { data: knowledge, isLoading: lk } = useKnowledgeSources();

  const orgName = user
    ? `${user.firstName ?? user.username ?? "My"}'s Workspace`
    : "Your Workspace";

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden" id="organization">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-white">Organization</h3>
        <p className="text-xs text-text-muted mt-0.5">Workspace overview and resource usage.</p>
      </div>

      <div className="p-6">
        {/* Workspace name */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-lg shrink-0">
            {orgName[0].toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-white">{orgName}</p>
            <p className="text-xs text-text-muted mt-0.5">Personal workspace</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBlock label="AI Employees"     value={employees?.length ?? 0}  loading={le} />
          <StatBlock label="Knowledge Sources" value={knowledge?.length ?? 0}  loading={lk} />
          <StatBlock label="Team Members"      value="1 (you)"                loading={false} />
          <StatBlock label="Plan"              value="Free"                   loading={false} />
        </div>

        <p className="mt-4 text-xs text-text-muted">
          Team collaboration and multi-member workspaces are available on the Pro plan.
        </p>
      </div>
    </div>
  );
}
