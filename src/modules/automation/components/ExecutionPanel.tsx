"use client";

import { useState } from "react";
import type { WorkflowRun, NodeResult, NodeResultStatus } from "../runtime/types";
import { NODE_CONFIG } from "../types";

/* ─── Status visuals ──────────────────────────────────────────────────────── */

const STATUS_STYLE: Record<NodeResultStatus, { icon: string; color: string; ring: string }> = {
  pending: { icon: "○", color: "text-text-muted",    ring: "border-border" },
  running: { icon: "◎", color: "text-accent animate-pulse", ring: "border-accent/40" },
  success: { icon: "●", color: "text-success",       ring: "border-success/30" },
  failed:  { icon: "✗", color: "text-danger",        ring: "border-danger/30" },
  skipped: { icon: "–", color: "text-text-muted",    ring: "border-border" },
};

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/* ─── Node inspector ──────────────────────────────────────────────────────── */

function NodeInspector({ result }: { result: NodeResult }) {
  const [tab, setTab] = useState<"output" | "logs">("output");
  const cfg = NODE_CONFIG[result.nodeType as keyof typeof NODE_CONFIG];

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        {cfg && <span className="text-base shrink-0" aria-hidden>{cfg.icon}</span>}
        <div className="min-w-0">
          <p className="text-sm font-bold text-white truncate">{result.label}</p>
          <p className="text-[10px] text-text-muted capitalize">{result.nodeType} · {formatMs(result.duration)}</p>
        </div>
        <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
          result.status === "success" ? "text-success bg-success/10 border-success/25" :
          result.status === "failed"  ? "text-danger  bg-danger/10  border-danger/25"  :
          "text-text-muted bg-surface-elevated border-border"
        }`}>
          {result.status.toUpperCase()}
        </span>
      </div>

      {/* Branch */}
      {result.branch && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-accent/20 bg-accent/[0.06]">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-accent shrink-0" aria-hidden>
            <path d="M2 2h3v4L8 9M2 2v8" strokeLinecap="round"/>
          </svg>
          <span className="text-xs font-medium text-accent">Branch taken: <strong>{result.branch === "yes" ? "✓ Yes" : "✗ No"}</strong></span>
        </div>
      )}

      {/* Error */}
      {result.error && (
        <div className="px-3 py-2 rounded-lg border border-danger/25 bg-danger/[0.06]">
          <p className="text-xs text-danger font-medium">Error: {result.error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border pb-2">
        {(["output", "logs"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-lg text-[10px] font-semibold capitalize transition-colors ${
              tab === t ? "bg-surface-elevated text-white border border-border" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "output" ? (
        <pre className="text-[10px] text-text-secondary bg-surface-elevated rounded-lg border border-border p-3 overflow-auto max-h-40 leading-relaxed whitespace-pre-wrap break-all">
          {JSON.stringify(result.output, null, 2)}
        </pre>
      ) : (
        <div className="flex flex-col gap-1 max-h-40 overflow-auto">
          {result.logs.map((log, i) => (
            <p key={i} className="text-[10px] text-text-muted leading-relaxed font-mono">{log}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Timeline step ───────────────────────────────────────────────────────── */

function TimelineStep({ result, isActive, isCurrent, onClick }: {
  result:    NodeResult;
  isActive:  boolean;
  isCurrent: boolean;
  onClick:   () => void;
}) {
  const style = STATUS_STYLE[result.status];
  const cfg   = NODE_CONFIG[result.nodeType as keyof typeof NODE_CONFIG];

  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all",
        isActive
          ? "bg-accent/[0.06] border-accent/25"
          : "border-transparent hover:bg-surface-elevated hover:border-border",
      ].join(" ")}
    >
      {/* Icon */}
      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs shrink-0 ${style.ring}`}>
        <span className={style.color}>{style.icon}</span>
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-text-primary"}`}>
          {result.label}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {cfg && <span className="text-[9px] text-text-muted">{cfg.label}</span>}
          {result.branch && <span className="text-[9px] text-accent font-medium">→ {result.branch}</span>}
          {isCurrent && result.status === "running" && (
            <span className="text-[9px] text-accent font-medium animate-pulse">executing…</span>
          )}
        </div>
      </div>

      {/* Duration */}
      <span className="text-[9px] text-text-muted font-mono shrink-0">
        {result.duration > 0 ? formatMs(result.duration) : ""}
      </span>
    </button>
  );
}

/* ─── Main panel ──────────────────────────────────────────────────────────── */

interface ExecutionPanelProps {
  run:           WorkflowRun | null;
  currentNodeId: string | null;
  isRunning:     boolean;
  onClose:       () => void;
}

export default function ExecutionPanel({ run, currentNodeId, isRunning, onClose }: ExecutionPanelProps) {
  const [selectedResultIdx, setSelectedResultIdx] = useState<number>(0);

  if (!run) return null;

  const totalMs = run.durationMs ?? (Date.now() - new Date(run.startedAt).getTime());
  const selectedResult = run.results[selectedResultIdx] ?? null;

  return (
    <div className="border-t border-border bg-surface flex flex-col" style={{ height: 280 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
            isRunning                   ? "text-accent bg-accent/10 border-accent/25 animate-pulse" :
            run.status === "completed"  ? "text-success bg-success/10 border-success/25" :
            run.status === "failed"     ? "text-danger  bg-danger/10  border-danger/25"  :
            "text-text-muted bg-surface-elevated border-border"
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden />
            {isRunning ? "Running…" : run.status.charAt(0).toUpperCase() + run.status.slice(1)}
          </div>
          <span className="text-[10px] text-text-muted">
            {run.results.length} steps
            {!isRunning && run.durationMs && ` · ${formatMs(run.durationMs)}`}
          </span>
          <span className="text-[10px] text-text-muted">{new Date(run.startedAt).toLocaleTimeString()}</span>
        </div>

        <button
          onClick={onClose}
          className="w-6 h-6 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors"
          aria-label="Close execution panel"
        >
          <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
            <path d="M2 2l6 6M8 2L2 8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Timeline */}
        <div className="w-56 shrink-0 border-r border-border overflow-y-auto p-2">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest px-2 mb-2">Timeline</p>
          <div className="flex flex-col gap-0.5">
            {run.results.map((res, i) => (
              <TimelineStep
                key={res.nodeId}
                result={res}
                isActive={selectedResultIdx === i}
                isCurrent={res.nodeId === currentNodeId}
                onClick={() => setSelectedResultIdx(i)}
              />
            ))}

            {isRunning && (
              <div className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-7 h-7 rounded-full border-2 border-accent/40 flex items-center justify-center shrink-0">
                  <span className="text-accent text-xs animate-pulse">◎</span>
                </div>
                <p className="text-xs text-accent animate-pulse font-medium">Processing…</p>
              </div>
            )}
          </div>
        </div>

        {/* Inspector */}
        <div className="flex-1 min-w-0 overflow-y-auto p-4">
          {selectedResult ? (
            <NodeInspector result={selectedResult} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs text-text-muted">Click a step to inspect its output.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
