import type { DayPoint } from "@/server/actions/analytics";

/* ─── Mini SVG bar chart ──────────────────────────────────────────────────── */

interface BarChartProps {
  data:    DayPoint[];
  color?:  string;
  label?:  string;
}

function BarChart({ data, color = "#7c3aed", label }: BarChartProps) {
  const max  = Math.max(...data.map(d => d.count), 1);
  const W    = 540;
  const H    = 120;
  const pad  = { t: 8, b: 28, l: 28, r: 4 };
  const cW   = W - pad.l - pad.r;
  const cH   = H - pad.t - pad.b;
  const bW   = Math.max(2, cW / data.length - 3);
  const step = cW / data.length;

  // Y-axis labels
  const yLabels = max <= 1 ? [0, 1] : [0, Math.round(max / 2), max];

  return (
    <div>
      {label && <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">{label}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={label}>
        {/* Grid lines */}
        {yLabels.map((v) => {
          const y = pad.t + cH - (v / max) * cH;
          return (
            <g key={v}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
              <text x={pad.l - 4} y={y + 3} textAnchor="end" fontSize={9} fill="#52525b">{v}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x   = pad.l + i * step + (step - bW) / 2;
          const bH  = d.count > 0 ? Math.max(2, (d.count / max) * cH) : 0;
          const y   = pad.t + cH - bH;
          const day = d.date.slice(8); // DD
          const active = d.count > 0;
          return (
            <g key={d.date}>
              {active && (
                <rect x={x} y={y} width={bW} height={bH} rx={2}
                  fill={color} fillOpacity={0.75}
                  className="hover:fill-opacity-100 transition-all"
                />
              )}
              {!active && (
                <rect x={x} y={pad.t + cH - 2} width={bW} height={2} rx={1}
                  fill="rgba(255,255,255,0.06)"
                />
              )}
              {/* Only show every other label to avoid crowding */}
              {i % 2 === 0 && (
                <text x={x + bW / 2} y={H - 6} textAnchor="middle" fontSize={9} fill="#52525b">
                  {day}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Combined chart card ─────────────────────────────────────────────────── */

interface ConversationChartProps {
  convsByDay: DayPoint[];
  msgsByDay:  DayPoint[];
}

export default function ConversationChart({ convsByDay, msgsByDay }: ConversationChartProps) {
  const totalConvs = convsByDay.reduce((s, d) => s + d.count, 0);
  const totalMsgs  = msgsByDay.reduce((s, d) => s + d.count, 0);

  if (totalConvs === 0 && totalMsgs === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm font-semibold text-text-primary mb-1">Conversations over time</p>
        <p className="text-xs text-text-muted mb-6">Last 14 days</p>
        <div className="flex items-center justify-center h-32 rounded-xl border border-dashed border-border">
          <div className="text-center">
            <p className="text-sm font-medium text-text-secondary mb-1">No conversations yet</p>
            <p className="text-xs text-text-muted">Chat with an AI employee to see data here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-text-primary">Conversations over time</p>
          <p className="text-xs text-text-muted mt-0.5">Last 14 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-accent/70" />
            Conversations
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
            AI Responses
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <BarChart data={convsByDay} color="#7c3aed" label="Conversations" />
        <BarChart data={msgsByDay}  color="#10b981" label="AI Responses" />
      </div>
    </div>
  );
}
