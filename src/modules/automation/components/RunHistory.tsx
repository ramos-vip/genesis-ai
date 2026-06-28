import type { WorkflowRun, RunStatus } from "../runtime/types";

const RUN_STATUS_STYLE: Record<RunStatus, { color: string; bg: string; border: string; dot: string }> = {
  pending:   { color: "text-text-muted",  bg: "bg-surface-elevated",  border: "border-border",      dot: "bg-text-muted"  },
  running:   { color: "text-accent",      bg: "bg-accent/10",         border: "border-accent/25",   dot: "bg-accent"      },
  completed: { color: "text-success",     bg: "bg-success/10",        border: "border-success/25",  dot: "bg-success"     },
  failed:    { color: "text-danger",      bg: "bg-danger/10",         border: "border-danger/25",   dot: "bg-danger"      },
  cancelled: { color: "text-text-muted",  bg: "bg-surface-elevated",  border: "border-border",      dot: "bg-text-muted"  },
};

function formatDuration(ms?: number): string {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

interface RunHistoryProps {
  runs:     WorkflowRun[];
  onSelect: (run: WorkflowRun) => void;
  onClear:  () => void;
}

export default function RunHistory({ runs, onSelect, onClear }: RunHistoryProps) {
  if (runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-4">
        <p className="text-xs font-medium text-text-secondary mb-1">No runs yet</p>
        <p className="text-[10px] text-text-muted">Click ▶ Run to execute this workflow.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <p className="text-xs font-semibold text-white">{runs.length} run{runs.length !== 1 ? "s" : ""}</p>
        <button
          onClick={onClear}
          className="text-[10px] text-text-muted hover:text-text-secondary transition-colors"
        >
          Clear history
        </button>
      </div>

      <div className="flex flex-col divide-y divide-border">
        {runs.map(run => {
          const style = RUN_STATUS_STYLE[run.status];
          return (
            <button
              key={run.id}
              onClick={() => onSelect(run)}
              className="flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-elevated transition-colors"
            >
              <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${style.dot}`} aria-hidden />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${style.color} ${style.bg} ${style.border}`}>
                    {run.status.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-text-muted">{formatDuration(run.durationMs)}</span>
                  <span className="text-[10px] text-text-muted">{run.results.length} steps</span>
                </div>
                <p className="text-[10px] text-text-muted">
                  {new Date(run.startedAt).toLocaleString()} · Simulated
                </p>
              </div>

              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-text-muted shrink-0 mt-1" aria-hidden>
                <path d="M3 2l4 3-4 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
