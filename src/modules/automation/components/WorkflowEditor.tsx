"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/shared/providers";
import { ROUTES } from "@/shared/constants";
import { EXAMPLE_WORKFLOWS } from "../data/examples";
import type { Workflow, WorkflowNode, WorkflowEdge, NodeType, WorkflowStatus } from "../types";
import { NODE_CONFIG } from "../types";
import WorkflowCanvas   from "./WorkflowCanvas";
import NodePalette      from "./NodePalette";
import PropertiesPanel  from "./PropertiesPanel";

/* ─── Persistence ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "genesis:workflows:v1";

function loadWorkflows(): Workflow[] {
  if (typeof window === "undefined") return EXAMPLE_WORKFLOWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Workflow[]) : EXAMPLE_WORKFLOWS;
  } catch { return EXAMPLE_WORKFLOWS; }
}

function saveWorkflows(workflows: Workflow[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows)); } catch { /* quota */ }
}

function genId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

/* ─── Status badge ────────────────────────────────────────────────────────── */

const STATUS_COLORS: Record<WorkflowStatus, string> = {
  draft:  "text-text-muted bg-surface-elevated border-border",
  active: "text-success bg-success/10 border-success/25",
  paused: "text-warning bg-warning/10 border-warning/25",
};

/* ─── Workflow list ───────────────────────────────────────────────────────── */

function WorkflowList({ workflows, onOpen, onNew }: {
  workflows: Workflow[];
  onOpen:    (id: string) => void;
  onNew:     () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-white">Your Workflows</h2>
          <p className="text-xs text-text-muted mt-0.5">{workflows.length} workflow{workflows.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-all shadow-[0_0_16px_rgba(124,58,237,0.2)]"
        >
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
            <path d="M6 1v10M1 6h10" strokeLinecap="round"/>
          </svg>
          New Workflow
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {workflows.map(wf => (
          <div
            key={wf.id}
            className="group flex items-start justify-between gap-4 p-5 rounded-2xl border border-border bg-surface hover:border-white/[0.12] hover:bg-surface-elevated transition-all duration-200 cursor-pointer"
            onClick={() => onOpen(wf.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <h3 className="text-sm font-semibold text-white">{wf.name}</h3>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[wf.status]}`}>
                  {wf.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed mb-3">{wf.description}</p>
              <div className="flex items-center gap-4 text-[10px] text-text-muted">
                <span>{wf.nodes.length} nodes</span>
                <span>{wf.edges.length} connections</span>
                <span>Updated {new Date(wf.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="h-8 px-3 rounded-lg border border-border text-xs font-medium text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
                onClick={e => { e.stopPropagation(); onOpen(wf.id); }}
              >
                Open editor
              </button>
            </div>
          </div>
        ))}

        {workflows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border">
            <p className="text-sm font-medium text-text-secondary mb-1">No workflows yet</p>
            <p className="text-xs text-text-muted mb-4">Create your first automation workflow to connect AI employees with business events.</p>
            <button onClick={onNew} className="text-xs text-accent hover:text-violet-400 transition-colors font-medium">Create your first workflow →</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Toolbar ─────────────────────────────────────────────────────────────── */

function EditorToolbar({ workflow, zoom, onZoomIn, onZoomOut, onFit, onSave, onClose, onStatusChange }: {
  workflow: Workflow; zoom: number;
  onZoomIn: () => void; onZoomOut: () => void; onFit: () => void;
  onSave:   () => void; onClose:   () => void;
  onStatusChange: (s: WorkflowStatus) => void;
}) {
  return (
    <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border bg-surface gap-4">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
            <path d="M8 2L4 6l4 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Workflows
        </button>
        <span className="text-border" aria-hidden>|</span>
        <p className="text-sm font-semibold text-white">{workflow.name}</p>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[workflow.status]}`}>
          {workflow.status.toUpperCase()}
        </span>
      </div>

      {/* Center: zoom controls */}
      <div className="flex items-center gap-1">
        <button onClick={onZoomOut} className="w-7 h-7 rounded-lg border border-border bg-surface-elevated flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-all text-sm" aria-label="Zoom out">−</button>
        <span className="text-xs text-text-muted w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
        <button onClick={onZoomIn} className="w-7 h-7 rounded-lg border border-border bg-surface-elevated flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-all text-sm" aria-label="Zoom in">+</button>
        <button onClick={onFit} className="px-2 h-7 rounded-lg border border-border bg-surface-elevated text-[10px] font-medium text-text-muted hover:text-text-primary hover:border-border-hover transition-all ml-1" aria-label="Fit to view">Fit</button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <select
          value={workflow.status}
          onChange={e => onStatusChange(e.target.value as WorkflowStatus)}
          className="h-7 rounded-lg border border-border bg-surface-elevated text-xs text-text-secondary px-2 pr-7 outline-none appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%2371717a' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center", backgroundSize: "10px" }}
          aria-label="Workflow status"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
        <button
          onClick={onSave}
          className="h-8 px-4 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover transition-all shadow-[0_0_12px_rgba(124,58,237,0.2)]"
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* ─── Main orchestrator ───────────────────────────────────────────────────── */

export default function WorkflowEditor() {
  const { toast } = useToast();
  const [workflows,     setWorkflows]     = useState<Workflow[]>(() => loadWorkflows());
  const [editingId,     setEditingId]     = useState<string | null>(null);
  const [selectedNodeId,setSelectedNodeId]= useState<string | null>(null);
  const [zoom,          setZoom]          = useState(1);
  const [pan,           setPan]           = useState({ x: 60, y: 60 });

  const editingWorkflow = workflows.find(w => w.id === editingId) ?? null;

  function updateWorkflow(updated: Workflow) {
    const now = new Date().toISOString();
    const list = workflows.map(w => w.id === updated.id ? { ...updated, updatedAt: now } : w);
    setWorkflows(list);
    saveWorkflows(list);
  }

  function handleSave() {
    if (editingWorkflow) {
      updateWorkflow(editingWorkflow);
      toast.success("Workflow saved.");
    }
  }

  function handleNewWorkflow() {
    const wf: Workflow = {
      id:          `wf-${genId()}`,
      name:        "Untitled Workflow",
      description: "New automation workflow",
      nodes:       [],
      edges:       [],
      status:      "draft",
      createdAt:   new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };
    setWorkflows(prev => [wf, ...prev]);
    saveWorkflows([wf, ...workflows]);
    setEditingId(wf.id);
    setSelectedNodeId(null);
    setZoom(1);
    setPan({ x: 60, y: 60 });
  }

  function handleAddNode(type: NodeType) {
    if (!editingWorkflow) return;
    const cfg = NODE_CONFIG[type];
    const node: WorkflowNode = {
      id:       `n-${genId()}`,
      type,
      position: {
        x: 200 + Math.round(Math.random() * 200),
        y: 200 + Math.round(Math.random() * 200),
      },
      label:    cfg.label,
      data:     {},
    };
    const updated = { ...editingWorkflow, nodes: [...editingWorkflow.nodes, node] };
    updateWorkflow(updated);
    setSelectedNodeId(node.id);
  }

  const handleUpdateNodes = useCallback((nodes: WorkflowNode[]) => {
    if (!editingWorkflow) return;
    setWorkflows(prev => prev.map(w => w.id === editingWorkflow.id ? { ...w, nodes } : w));
  }, [editingWorkflow]);

  function handleUpdateNode(node: WorkflowNode) {
    if (!editingWorkflow) return;
    updateWorkflow({ ...editingWorkflow, nodes: editingWorkflow.nodes.map(n => n.id === node.id ? node : n) });
  }

  function handleDeleteNode(id: string) {
    if (!editingWorkflow) return;
    updateWorkflow({
      ...editingWorkflow,
      nodes: editingWorkflow.nodes.filter(n => n.id !== id),
      edges: editingWorkflow.edges.filter(e => e.source !== id && e.target !== id),
    });
    setSelectedNodeId(null);
  }

  function handleAddEdge(edge: WorkflowEdge) {
    if (!editingWorkflow) return;
    updateWorkflow({ ...editingWorkflow, edges: [...editingWorkflow.edges, edge] });
  }

  function handleDeleteEdge(id: string) {
    if (!editingWorkflow) return;
    updateWorkflow({ ...editingWorkflow, edges: editingWorkflow.edges.filter(e => e.id !== id) });
  }

  const handleFit = useCallback(() => {
    if (!editingWorkflow || editingWorkflow.nodes.length === 0) { setPan({ x: 60, y: 60 }); setZoom(1); return; }
    const xs = editingWorkflow.nodes.map(n => n.position.x);
    const ys = editingWorkflow.nodes.map(n => n.position.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    setPan({ x: -minX + 80, y: -minY + 80 });
    setZoom(0.85);
  }, [editingWorkflow]);

  /* ── Render: Editor mode ── */
  if (editingWorkflow) {
    const selectedNode = editingWorkflow.nodes.find(n => n.id === selectedNodeId) ?? null;

    return (
      <div className="flex flex-col -mx-6 lg:-mx-8 -mt-2 overflow-hidden" style={{ height: "calc(100dvh - 4rem - 3.5rem)" }}>
        {/* Toolbar */}
        <EditorToolbar
          workflow={editingWorkflow}
          zoom={zoom}
          onZoomIn={() => setZoom(z => Math.min(2, z + 0.1))}
          onZoomOut={() => setZoom(z => Math.max(0.3, z - 0.1))}
          onFit={handleFit}
          onSave={handleSave}
          onClose={() => { setEditingId(null); setSelectedNodeId(null); }}
          onStatusChange={status => updateWorkflow({ ...editingWorkflow, status })}
        />

        {/* Three-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Node palette */}
          <NodePalette onAddNode={handleAddNode} />

          {/* Canvas */}
          <WorkflowCanvas
            workflow={editingWorkflow}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onUpdateNodes={handleUpdateNodes}
            onAddEdge={handleAddEdge}
            onDeleteNode={handleDeleteNode}
            zoom={zoom}
            pan={pan}
            onZoomChange={setZoom}
            onPanChange={setPan}
          />

          {/* Properties panel */}
          <PropertiesPanel
            node={selectedNode}
            edges={editingWorkflow.edges}
            onUpdateNode={handleUpdateNode}
            onDeleteNode={handleDeleteNode}
            onDeleteEdge={handleDeleteEdge}
          />
        </div>

        {/* Mini-map placeholder */}
        <div className="absolute bottom-3 right-60 w-36 h-24 rounded-xl border border-border bg-surface/80 backdrop-blur-sm pointer-events-none">
          <div className="p-2">
            <p className="text-[8px] font-semibold text-text-muted uppercase tracking-wider mb-1">Mini-map</p>
            <div className="w-full h-16 rounded bg-surface-elevated flex items-center justify-center">
              <p className="text-[8px] text-text-muted">Overview preview</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Render: List mode ── */
  return <WorkflowList workflows={workflows} onOpen={(id) => { setEditingId(id); setSelectedNodeId(null); setZoom(0.85); setPan({ x: 60, y: 60 }); setTimeout(handleFit, 50); }} onNew={handleNewWorkflow} />;
}
