import type { AnalyticsOverview } from "@/server/actions/analytics";
import Skeleton from "@/components/ui/Skeleton";

interface CardProps {
  label:    string;
  value:    string;
  sub?:     string;
  color:    string;
  icon:     React.ReactNode;
}

function Card({ label, value, sub, color, icon }: CardProps) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-surface hover:bg-surface-elevated transition-colors duration-200">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</p>
        <div className={`w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

function formatK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function formatCost(usd: number): string {
  if (usd === 0)  return "$0.00";
  if (usd < 0.01) return "<$0.01";
  return `$${usd.toFixed(2)}`;
}

export function OverviewCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border border-border bg-surface space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton variant="rect" width={80} height={10} className="rounded" />
            <Skeleton variant="rect" width={32} height={32} className="rounded-lg" />
          </div>
          <Skeleton variant="rect" width={56} height={26} className="rounded" />
        </div>
      ))}
    </div>
  );
}

export default function OverviewCards({ data }: { data: AnalyticsOverview }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      <Card label="AI Employees"   value={String(data.employeeCount)}     sub="active specialists" color="text-violet-400"
        icon={<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path strokeLinecap="round" d="M9.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM2 12.5a5 5 0 0110 0"/></svg>} />
      <Card label="Conversations"  value={String(data.conversationCount)} sub="chat sessions"       color="text-blue-400"
        icon={<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7a5 5 0 01-5 5 4.95 4.95 0 01-2.39-.61L2 12.5 3 10a5 5 0 114.5 7H7a5 5 0 005-5z"/></svg>} />
      <Card label="AI Responses"   value={String(data.messageCount)}      sub="messages generated" color="text-emerald-400"
        icon={<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.5 2.5H2.5a1 1 0 00-1 1v6a1 1 0 001 1H4v2.5L7 10.5h4.5a1 1 0 001-1v-6a1 1 0 00-1-1z"/></svg>} />
      <Card label="Knowledge"      value={String(data.knowledgeCount)}    sub="sources"            color="text-cyan-400"
        icon={<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 2h4v10h-4zM7.5 2H12v10H7.5zM6 2v10"/></svg>} />
      <Card label="Tokens Used"    value={formatK(data.estimatedTokens)}  sub="estimated"          color="text-orange-400"
        icon={<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M7 1L9 5.5H13.5L10 8.5L11.5 13L7 10.5L2.5 13L4 8.5L0.5 5.5H5L7 1Z"/></svg>} />
      <Card label="Est. Cost"      value={formatCost(data.estimatedCostUsd)} sub="Gemini Flash"     color="text-yellow-400"
        icon={<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><circle cx="7" cy="7" r="6"/><path strokeLinecap="round" d="M7 3.5v7M5 5.5C5 4.67 5.9 4 7 4s2 .67 2 1.5S8.1 7 7 7s-2 .67-2 1.5S5.9 10 7 10s2-.67 2-1.5"/></svg>} />
    </div>
  );
}
