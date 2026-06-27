import Badge  from "@/components/ui/Badge";
import { formatDate } from "@/shared/utils";
import type { BillingData } from "@/server/actions/billing";

function formatCost(usd: number): string {
  if (usd === 0)  return "$0.00";
  if (usd < 0.01) return "<$0.01";
  return `$${usd.toFixed(2)}`;
}
function formatK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

interface CostCardProps { label: string; value: string; sub?: string; color: string }

function CostCard({ label, value, sub, color }: CostCardProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-surface-elevated">
      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export default function CurrentPlan({ data }: { data: BillingData }) {
  const { subscription, currentPlan, costs } = data;
  const isFree = currentPlan.id === "free";

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Plan header */}
      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border ${
            isFree ? "bg-surface-elevated border-border text-text-secondary" :
            currentPlan.id === "pro" ? "bg-accent/10 border-accent/30 text-accent" :
            "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
          }`}>
            {isFree ? "F" : currentPlan.id === "pro" ? "P" : "B"}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-white">{currentPlan.name} Plan</h3>
              <Badge
                variant={subscription.status === "active" ? "success" : subscription.status === "trialing" ? "info" : "warning"}
                size="sm" dot
              >
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
            </div>
            <p className="text-xs text-text-muted">
              {isFree
                ? "Free forever — upgrade to unlock more"
                : `Renews ${formatDate(subscription.currentPeriodEnd, "short")}`
              }
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <p className="text-2xl font-bold text-white tabular-nums">
            {currentPlan.price.monthly === 0 ? "Free" : `$${currentPlan.price.monthly}`}
          </p>
          {currentPlan.price.monthly > 0 && (
            <p className="text-xs text-text-muted">per month</p>
          )}
        </div>
      </div>

      {/* Cost breakdown */}
      <div className="p-6">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          This period&apos;s usage cost
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <CostCard
            label="Chat Tokens"
            value={formatK(costs.chatTokens)}
            sub="estimated"
            color="text-violet-400"
          />
          <CostCard
            label="Chat Cost"
            value={formatCost(costs.chatCostUsd)}
            sub="Gemini Flash"
            color="text-blue-400"
          />
          <CostCard
            label="Embeddings"
            value={formatK(costs.embeddingChunks)}
            sub={`chunks @ text-embed-004`}
            color="text-emerald-400"
          />
          <CostCard
            label="Total Cost"
            value={formatCost(costs.totalCostUsd)}
            sub={costs.estimatedMonthly > 0 ? `~${formatCost(costs.estimatedMonthly)}/mo` : "this period"}
            color="text-yellow-400"
          />
        </div>

        {isFree && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-accent/[0.06] border border-accent/20 text-sm text-accent/90">
            You&apos;re on the free plan — AI usage is on us while you&apos;re getting started.
          </div>
        )}
      </div>
    </div>
  );
}
