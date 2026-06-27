import type { AIHealth, KnowledgeUsage } from "@/server/actions/analytics";

/* ─── Radial score ring ───────────────────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;

  const color =
    score >= 80 ? "#4ade80"  :
    score >= 50 ? "#fbbf24"  : "#f87171";

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" aria-label={`Health score: ${score}%`}>
      {/* Track */}
      <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
      {/* Progress */}
      <circle
        cx="48" cy="48" r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        strokeDashoffset={c * 0.25}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x="48" y="45" textAnchor="middle" fontSize="18" fontWeight="700" fill="white">{score}</text>
      <text x="48" y="60" textAnchor="middle" fontSize="9"  fill="#71717a">/ 100</text>
    </svg>
  );
}

/* ─── Progress bar ────────────────────────────────────────────────────────── */

function MetricRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="text-xs font-semibold text-text-primary tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Knowledge chart ─────────────────────────────────────────────────────── */

function KnowledgeBar({ sources }: { sources: KnowledgeUsage[] }) {
  if (sources.length === 0) return null;
  const max = Math.max(...sources.map(s => s.chunkCount), 1);
  const typeColors: Record<string, string> = { text: "bg-emerald-500", url: "bg-blue-500", pdf: "bg-orange-500" };

  return (
    <div className="space-y-2.5">
      {sources.slice(0, 5).map(src => (
        <div key={src.id}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeColors[src.type] ?? "bg-text-muted"}`} />
              <span className="text-xs text-text-secondary truncate max-w-[120px]">{src.name}</span>
            </div>
            <span className="text-[10px] text-text-muted tabular-nums shrink-0 ml-2">
              {src.chunkCount} chunks
            </span>
          </div>
          <div className="h-1 rounded-full bg-surface-elevated overflow-hidden">
            <div
              className={`h-full rounded-full ${typeColors[src.type] ?? "bg-text-muted"} opacity-70`}
              style={{ width: `${(src.chunkCount / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */

interface AIHealthPanelProps {
  health:   AIHealth;
  knowledge: KnowledgeUsage[];
}

export default function AIHealthPanel({ health, knowledge }: AIHealthPanelProps) {
  const avgWords = Math.round(health.avgResponseLength / 5); // rough word count

  return (
    <div className="space-y-4">
      {/* Health score */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-semibold text-text-primary mb-4">AI Health</p>
        <div className="flex items-center gap-5 mb-5">
          <ScoreRing score={health.healthScore} />
          <div className="min-w-0">
            <p className="text-base font-bold text-white">
              {health.healthScore >= 80 ? "Excellent" : health.healthScore >= 50 ? "Good" : "Getting started"}
            </p>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              {health.healthScore >= 80
                ? "Your AI workforce is healthy and performing well."
                : health.healthScore >= 50
                ? "A few more steps will improve your score."
                : "Complete setup to improve your score."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <MetricRow
            label="Response Rate"
            value={`${health.responseRate}%`}
            pct={health.responseRate}
            color="bg-emerald-500"
          />
          <MetricRow
            label="Knowledge Coverage"
            value={`${health.knowledgeCoverage}%`}
            pct={health.knowledgeCoverage}
            color="bg-blue-500"
          />
        </div>
      </div>

      {/* Response metrics */}
      <div className="rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm font-semibold text-text-primary mb-4">Response Metrics</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Avg Length",   value: health.avgResponseLength > 0 ? `~${health.avgResponseLength} chars` : "—" },
            { label: "Avg Words",    value: avgWords > 0 ? `~${avgWords}` : "—" },
            { label: "Total Chunks", value: String(health.totalKnowledgeChunks) },
            { label: "Sources",      value: String(knowledge.length) },
          ].map(m => (
            <div key={m.label} className="p-3 rounded-xl bg-surface-elevated border border-border">
              <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider mb-1">{m.label}</p>
              <p className="text-base font-bold text-white tabular-nums">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge breakdown */}
      {knowledge.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-text-primary mb-4">Knowledge Breakdown</p>
          <KnowledgeBar sources={knowledge} />
        </div>
      )}
    </div>
  );
}
