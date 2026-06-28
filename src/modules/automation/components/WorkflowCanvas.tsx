"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Workflow, WorkflowNode, WorkflowEdge } from "../types";
import { NODE_CONFIG, NODE_W, NODE_H } from "../types";

/* ─── Edge rendering ──────────────────────────────────────────────────────── */

function getHandlePos(node: WorkflowNode, handle: "in" | "out-yes" | "out-no" | "out") {
  const cx = node.position.x + NODE_W / 2;
  const by = node.position.y + NODE_H;

  if (handle === "in")      return { x: cx, y: node.position.y };
  if (handle === "out")     return { x: cx, y: by };
  if (handle === "out-yes") return { x: node.position.x + NODE_W * 0.75, y: by };
  if (handle === "out-no")  return { x: node.position.x + NODE_W * 0.25, y: by };
  return { x: cx, y: by };
}

function bezier(sx: number, sy: number, tx: number, ty: number): string {
  const dy   = Math.abs(ty - sy);
  const ctrl = Math.max(dy * 0.5, 60);
  return `M ${sx} ${sy} C ${sx} ${sy + ctrl} ${tx} ${ty - ctrl} ${tx} ${ty}`;
}

function EdgeLayer({ nodes, edges, pendingFrom, cursorPos }: {
  nodes:      WorkflowNode[];
  edges:      WorkflowEdge[];
  pendingFrom: string | null;
  cursorPos:  { x: number; y: number };
}) {
  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <svg className="absolute inset-0 overflow-visible pointer-events-none" style={{ width: 2400, height: 2000 }}>
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="rgba(124,58,237,0.5)" />
        </marker>
        <marker id="arrow-pending" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      {/* Committed edges */}
      {edges.map(edge => {
        const src = nodeById[edge.source];
        const tgt = nodeById[edge.target];
        if (!src || !tgt) return null;

        const srcHandle = src.type === "condition"
          ? edge.branch === "yes" ? "out-yes" : "out-no"
          : "out";

        const sp = getHandlePos(src, srcHandle);
        const tp = getHandlePos(tgt, "in");
        const d  = bezier(sp.x, sp.y, tp.x, tp.y);

        const mx = (sp.x + tp.x) / 2;
        const my = (sp.y + tp.y) / 2;

        return (
          <g key={edge.id}>
            <path d={d} fill="none" stroke="rgba(124,58,237,0.35)" strokeWidth={2} markerEnd="url(#arrow)" />
            {edge.label && (
              <g>
                <rect x={mx - 18} y={my - 9} width={36} height={18} rx={4} fill="rgba(13,13,18,0.9)" stroke="rgba(124,58,237,0.3)" strokeWidth={1} />
                <text x={mx} y={my + 4} textAnchor="middle" fontSize={9} fontWeight="600" fill="rgba(255,255,255,0.7)">
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Pending connection line */}
      {pendingFrom && (() => {
        const src = nodeById[pendingFrom];
        if (!src) return null;
        const sp = getHandlePos(src, "out");
        const d  = bezier(sp.x, sp.y, cursorPos.x, cursorPos.y);
        return <path d={d} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="6 4" markerEnd="url(#arrow-pending)" />;
      })()}
    </svg>
  );
}

/* ─── Individual node ─────────────────────────────────────────────────────── */

function NodeCard({
  node, selected, connecting, onSelect, onDragStart, onStartConnect, onEndConnect,
}: {
  node:          WorkflowNode;
  selected:      boolean;
  connecting:    boolean;
  onSelect:      () => void;
  onDragStart:   (e: React.MouseEvent) => void;
  onStartConnect:(nodeId: string) => void;
  onEndConnect:  (nodeId: string) => void;
}) {
  const cfg = NODE_CONFIG[node.type];

  const isCondition = node.type === "condition";

  return (
    <div
      className={[
        "absolute select-none cursor-grab active:cursor-grabbing",
        "rounded-xl border transition-all duration-100",
        cfg.bg, cfg.border,
        selected ? `ring-2 ${cfg.selectedRing}` : "",
        connecting ? "cursor-crosshair" : "",
      ].join(" ")}
      style={{ left: node.position.x, top: node.position.y, width: NODE_W, height: NODE_H }}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (e.button !== 0) return;
        onSelect();
        onDragStart(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (connecting) {
          onEndConnect(node.id);
        } else {
          onSelect();
        }
      }}
    >
      {/* Input handle (top) */}
      {node.type !== "trigger" && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-surface-elevated border-2 border-accent/60 hover:bg-accent/30 transition-colors cursor-crosshair z-10"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onEndConnect(node.id); }}
          title="Connect to this node"
        />
      )}

      {/* Node content */}
      <div className="px-3 py-2 h-full flex flex-col justify-center gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm leading-none" aria-hidden>{cfg.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{cfg.label}</span>
        </div>
        <p className={`text-xs font-semibold truncate ${cfg.color}`}>{node.label}</p>
      </div>

      {/* Output handle(s) (bottom) */}
      {node.type !== "end" && !isCondition && (
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent/40 border-2 border-accent/70 hover:bg-accent/70 transition-colors cursor-crosshair z-10"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onStartConnect(node.id); }}
          title="Drag to connect"
        />
      )}
      {isCondition && (
        <>
          <div
            className="absolute -bottom-2 left-1/4 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500/50 border-2 border-red-500/80 hover:bg-red-500/80 transition-colors cursor-crosshair z-10"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onStartConnect(node.id + ":no"); }}
            title="No branch"
          >
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-red-400 font-bold whitespace-nowrap">
              {node.data.falseLabel ?? "No"}
            </span>
          </div>
          <div
            className="absolute -bottom-2 left-3/4 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500/50 border-2 border-emerald-500/80 hover:bg-emerald-500/80 transition-colors cursor-crosshair z-10"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onStartConnect(node.id + ":yes"); }}
            title="Yes branch"
          >
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-emerald-400 font-bold whitespace-nowrap">
              {node.data.trueLabel ?? "Yes"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Canvas ──────────────────────────────────────────────────────────────── */

interface WorkflowCanvasProps {
  workflow:        Workflow;
  selectedNodeId:  string | null;
  onSelectNode:    (id: string | null) => void;
  onUpdateNodes:   (nodes: WorkflowNode[]) => void;
  onAddEdge:       (edge: WorkflowEdge) => void;
  onDeleteNode:    (id: string) => void;
  zoom:            number;
  pan:             { x: number; y: number };
  onZoomChange:    (z: number) => void;
  onPanChange:     (p: { x: number; y: number }) => void;
}

export default function WorkflowCanvas({
  workflow, selectedNodeId, onSelectNode, onUpdateNodes, onAddEdge, onDeleteNode,
  zoom, pan, onZoomChange, onPanChange,
}: WorkflowCanvasProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const [dragging,     setDragging]     = useState<{ nodeId: string; ox: number; oy: number; nx: number; ny: number } | null>(null);
  const [panning,      setPanning]      = useState<{ sx: number; sy: number; px: number; py: number } | null>(null);
  const [pendingFrom,  setPendingFrom]  = useState<string | null>(null);
  const [cursorPos,    setCursorPos]    = useState({ x: 0, y: 0 });

  /* ── Drag nodes ── */
  const startDrag = useCallback((nodeId: string, e: React.MouseEvent) => {
    const node = workflow.nodes.find(n => n.id === nodeId);
    if (!node) return;
    setDragging({ nodeId, ox: e.clientX, oy: e.clientY, nx: node.position.x, ny: node.position.y });
  }, [workflow.nodes]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.ox) / zoom;
      const dy = (e.clientY - dragging.oy) / zoom;
      onUpdateNodes(workflow.nodes.map(n =>
        n.id === dragging.nodeId
          ? { ...n, position: { x: Math.round((dragging.nx + dx) / 10) * 10, y: Math.round((dragging.ny + dy) / 10) * 10 } }
          : n
      ));
    };
    const onUp = () => setDragging(null);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",  onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [dragging, zoom, workflow.nodes, onUpdateNodes]);

  /* ── Pan canvas ── */
  useEffect(() => {
    if (!panning) return;
    const onMove = (e: MouseEvent) => {
      onPanChange({ x: panning.px + (e.clientX - panning.sx), y: panning.py + (e.clientY - panning.sy) });
    };
    const onUp = () => setPanning(null);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup",  onUp);
    return () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
  }, [panning, onPanChange]);

  /* ── Track cursor for pending edge ── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!pendingFrom || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top  - pan.y) / zoom,
    });
  }, [pendingFrom, pan, zoom]);

  /* ── Keyboard delete ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedNodeId) {
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          onDeleteNode(selectedNodeId);
        }
      }
      if (e.key === "Escape") { setPendingFrom(null); onSelectNode(null); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedNodeId, onDeleteNode, onSelectNode]);

  /* ── Connect nodes ── */
  function handleStartConnect(raw: string) {
    setPendingFrom(raw);
    onSelectNode(null);
  }

  function handleEndConnect(targetId: string) {
    if (!pendingFrom) return;
    const [srcId, branch] = pendingFrom.includes(":") ? pendingFrom.split(":") as [string, "yes" | "no"] : [pendingFrom, undefined];
    if (srcId === targetId) { setPendingFrom(null); return; }
    const newEdge: WorkflowEdge = {
      id:     `e-${Date.now()}`,
      source: srcId,
      target: targetId,
      branch,
      label:  branch === "yes" ? (workflow.nodes.find(n => n.id === srcId)?.data.trueLabel ?? "Yes")
             : branch === "no"  ? (workflow.nodes.find(n => n.id === srcId)?.data.falseLabel ?? "No")
             : undefined,
    };
    onAddEdge(newEdge);
    setPendingFrom(null);
  }

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden bg-background"
      style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      onMouseMove={handleMouseMove}
      onMouseDown={(e) => {
        if (e.button !== 0) return;
        if (pendingFrom) { setPendingFrom(null); return; }
        onSelectNode(null);
        setPanning({ sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y });
      }}
      onWheel={(e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        onZoomChange(Math.min(2, Math.max(0.3, zoom + delta)));
      }}
    >
      {/* Transformed canvas content */}
      <div
        className="absolute origin-top-left"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, width: 2400, height: 2000 }}
      >
        {/* SVG edges */}
        <EdgeLayer nodes={workflow.nodes} edges={workflow.edges} pendingFrom={pendingFrom} cursorPos={cursorPos} />

        {/* Nodes */}
        {workflow.nodes.map(node => (
          <NodeCard
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            connecting={!!pendingFrom}
            onSelect={() => onSelectNode(node.id)}
            onDragStart={(e) => startDrag(node.id, e)}
            onStartConnect={handleStartConnect}
            onEndConnect={handleEndConnect}
          />
        ))}
      </div>

      {/* Pending connect mode overlay */}
      {pendingFrom && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 text-xs font-medium text-accent pointer-events-none">
          Click a node to connect · Esc to cancel
        </div>
      )}

      {/* Empty state */}
      {workflow.nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
          <div>
            <p className="text-sm font-medium text-text-secondary mb-1">Empty workflow</p>
            <p className="text-xs text-text-muted">Click a node in the left panel to add it to the canvas.</p>
          </div>
        </div>
      )}
    </div>
  );
}
