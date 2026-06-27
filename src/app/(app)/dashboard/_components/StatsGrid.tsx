import type { DashboardStats } from "@/server/actions/dashboard";
import Skeleton from "@/components/ui/Skeleton";

interface StatCardProps {
  label:    string;
  value:    string;
  subtext?: string;
  icon:     React.ReactNode;
  accent?:  string;
}

function StatCard({ label, value, subtext, icon, accent = "text-accent" }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-surface hover:border-white/[0.1] hover:bg-surface-elevated transition-all duration-200">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center ${accent}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        {subtext && <p className="text-xs text-text-muted mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}

function UsersIcon() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden><path strokeLinecap="round" d="M11 7a3 3 0 11-6 0 3 3 0 016 0zM2 14a6 6 0 0112 0" /></svg>;
}
function BookIcon() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h4v10H3zM9 3h4v10H9zM7 3v10" /></svg>;
}
function ChatIcon() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M2 10.5C2 7.46 4.69 5 8 5s6 2.46 6 5.5c0 1.98-1.14 3.71-2.86 4.67L10 16l-1.14-1.35C5.14 14.21 2 12.73 2 10.5Z" /></svg>;
}
function MessageIcon() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M13 3H3a1 1 0 00-1 1v7a1 1 0 001 1h2v2.5L8 12h5a1 1 0 001-1V4a1 1 0 00-1-1z" /></svg>;
}
function CostIcon() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden><circle cx="8" cy="8" r="6.5" /><path strokeLinecap="round" d="M8 4.5v7M5.5 6.5A2.5 1.5 0 018 5a2.5 1.5 0 012.5 1.5A2.5 1.5 0 018 8a2.5 1.5 0 01-2.5 1.5A2.5 1.5 0 018 11a2.5 1.5 0 002.5-1.5" /></svg>;
}
function TokenIcon() {
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M8 1L10 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H6L8 1Z" /></svg>;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(usd: number): string {
  if (usd < 0.01) return usd === 0 ? "$0.00" : "<$0.01";
  return `$${usd.toFixed(2)}`;
}

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl border border-border bg-surface space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton variant="rect" width={80} height={12} className="rounded" />
            <Skeleton variant="rect" width={32} height={32} className="rounded-lg" />
          </div>
          <Skeleton variant="rect" width={60} height={24} className="rounded" />
        </div>
      ))}
    </div>
  );
}

export default function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      <StatCard
        label="AI Employees"
        value={String(stats.employeeCount)}
        subtext={stats.employeeCount === 1 ? "1 specialist" : `${stats.employeeCount} specialists`}
        icon={<UsersIcon />}
        accent="text-violet-400"
      />
      <StatCard
        label="Knowledge"
        value={String(stats.knowledgeCount)}
        subtext="sources"
        icon={<BookIcon />}
        accent="text-blue-400"
      />
      <StatCard
        label="Conversations"
        value={String(stats.conversationCount)}
        subtext="chat sessions"
        icon={<ChatIcon />}
        accent="text-emerald-400"
      />
      <StatCard
        label="AI Responses"
        value={String(stats.messageCount)}
        subtext="messages"
        icon={<MessageIcon />}
        accent="text-cyan-400"
      />
      <StatCard
        label="Est. Cost"
        value={formatCost(stats.estimatedCostUsd)}
        subtext="this session"
        icon={<CostIcon />}
        accent="text-yellow-400"
      />
      <StatCard
        label="Tokens Used"
        value={formatTokens(stats.estimatedTokens)}
        subtext="estimated"
        icon={<TokenIcon />}
        accent="text-orange-400"
      />
    </div>
  );
}
