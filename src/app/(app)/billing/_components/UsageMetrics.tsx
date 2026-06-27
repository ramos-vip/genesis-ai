import type { UsageMetric } from "@/server/actions/billing";

function pct(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function formatLimit(limit: number, unit?: string): string {
  if (limit < 0) return "Unlimited";
  if (limit >= 1_000_000) return `${(limit / 1_000_000).toFixed(0)}M ${unit ?? ""}`.trim();
  if (limit >= 1_000)     return `${(limit / 1_000).toFixed(0)}K ${unit ?? ""}`.trim();
  return `${limit} ${unit ?? ""}`.trim();
}

function barColor(p: number): string {
  if (p >= 90) return "bg-danger";
  if (p >= 75) return "bg-warning";
  return "bg-accent";
}

interface MetricBarProps { metric: UsageMetric }

function MetricBar({ metric }: MetricBarProps) {
  const unlimited = metric.limit < 0;
  const p         = unlimited ? 0 : pct(metric.used, metric.limit);
  const isNearFull = p >= 75;

  return (
    <div className="p-4 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-text-primary">{metric.label}</p>
        <span className={`text-xs font-semibold tabular-nums ${isNearFull ? "text-warning" : "text-text-muted"}`}>
          {unlimited ? "∞" : `${p}%`}
        </span>
      </div>

      <div className="flex items-end justify-between mb-2">
        <span className="text-xl font-bold text-white tabular-nums">
          {metric.used.toLocaleString()}
        </span>
        <span className="text-xs text-text-muted">
          {unlimited ? "no limit" : `/ ${formatLimit(metric.limit, metric.unit)}`}
        </span>
      </div>

      {!unlimited && (
        <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor(p)}`}
            style={{ width: `${p}%` }}
          />
        </div>
      )}

      {isNearFull && !unlimited && (
        <p className="text-[10px] text-warning mt-2">
          Approaching limit — consider upgrading your plan.
        </p>
      )}
    </div>
  );
}

export default function UsageMetrics({ metrics }: { metrics: UsageMetric[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Current Usage & Limits</h3>
        <p className="text-xs text-text-muted mt-0.5">Resets at the start of each billing period.</p>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((m) => <MetricBar key={m.label} metric={m} />)}
      </div>
    </div>
  );
}
