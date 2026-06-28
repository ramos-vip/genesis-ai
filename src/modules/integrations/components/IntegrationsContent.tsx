"use client";

import { useState, useMemo } from "react";
import { INTEGRATIONS } from "../data/catalog";
import type { IntegrationCategory, IntegrationConnection, ConnectionStatus } from "../types";
import { CATEGORY_LABELS } from "../types";
import IntegrationCard    from "./IntegrationCard";
import ConnectionDrawer   from "./ConnectionDrawer";

/* ─── Persistence ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "genesis:integrations:v1";

function loadConnections(): Record<string, IntegrationConnection> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveConnections(connections: Record<string, IntegrationConnection>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(connections)); } catch { /* quota */ }
}

/* ─── Category icon map ───────────────────────────────────────────────────── */

const CATEGORY_ICONS: Record<IntegrationCategory, string> = {
  communication: "💬",
  commerce:      "🛒",
  crm:           "🎯",
  productivity:  "📝",
  accounting:    "🧮",
  developer:     "⚙️",
};

/* ─── Status filter options ───────────────────────────────────────────────── */

type StatusFilter = "all" | "connected" | "available";

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  all:       "All",
  connected: "Connected",
  available: "Available",
};

/* ─── Main component ──────────────────────────────────────────────────────── */

export default function IntegrationsContent() {
  const [connections,   setConnections]   = useState<Record<string, IntegrationConnection>>(() => loadConnections());
  const [query,         setQuery]         = useState("");
  const [activeCategory,setActiveCategory]= useState<IntegrationCategory | "all">("all");
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>("all");
  const [drawerTarget,  setDrawerTarget]  = useState<string | null>(null);

  const drawerIntegration = INTEGRATIONS.find(i => i.id === drawerTarget) ?? null;
  const drawerConnection  = drawerTarget ? (connections[drawerTarget] ?? null) : null;

  /* ── Derived state ── */
  const connectedCount = Object.values(connections).filter(c => c.status === "connected").length;

  const filtered = useMemo(() => {
    return INTEGRATIONS.filter(i => {
      if (activeCategory !== "all" && i.category !== activeCategory) return false;
      if (statusFilter === "connected" && connections[i.id]?.status !== "connected") return false;
      if (statusFilter === "available" && connections[i.id]?.status === "connected") return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          (i.region?.toLowerCase().includes(q) ?? false)
        );
      }
      return true;
    });
  }, [activeCategory, statusFilter, query, connections]);

  /* ── Group by category for display ── */
  const grouped = useMemo(() => {
    if (activeCategory !== "all") return { [activeCategory]: filtered };
    return filtered.reduce<Partial<Record<IntegrationCategory, typeof filtered>>>((acc, i) => {
      (acc[i.category] ??= []).push(i);
      return acc;
    }, {});
  }, [filtered, activeCategory]);

  const categories = (Object.keys(CATEGORY_LABELS) as IntegrationCategory[]).filter(c => grouped[c]?.length);

  /* ── Handlers ── */
  function getStatus(id: string): ConnectionStatus {
    return connections[id]?.status ?? "disconnected";
  }

  function handleSaveConnection(id: string, conn: IntegrationConnection) {
    const updated = { ...connections, [id]: conn };
    setConnections(updated);
    saveConnections(updated);
  }

  function handleDisconnect(id: string) {
    const updated = { ...connections };
    delete updated[id];
    setConnections(updated);
    saveConnections(updated);
  }

  return (
    <>
      {/* Stats bar */}
      <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
        <div>
          <p className="text-xs text-text-muted">Total integrations</p>
          <p className="text-2xl font-bold text-white">{INTEGRATIONS.length}</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xs text-text-muted">Connected</p>
          <p className="text-2xl font-bold text-success">{connectedCount}</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xs text-text-muted">Categories</p>
          <p className="text-2xl font-bold text-white">{Object.keys(CATEGORY_LABELS).length}</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-xs text-text-muted">Region-specific</p>
          <p className="text-sm font-semibold text-text-secondary">🇹🇷 Turkish market</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" aria-hidden>
            <circle cx="7" cy="7" r="5"/>
            <path d="M11 11l3 3" strokeLinecap="round"/>
          </svg>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search integrations…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-surface-elevated text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-border-focus focus:ring-1 focus:ring-accent/30 transition-all"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1 p-1 rounded-xl border border-border bg-surface-elevated self-start">
          {(Object.entries(STATUS_FILTER_LABELS) as [StatusFilter, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setStatusFilter(k)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                statusFilter === k ? "bg-surface text-white border border-border shadow-sm" : "text-text-muted hover:text-text-secondary",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all",
            activeCategory === "all"
              ? "border-accent/50 bg-accent/[0.08] text-accent"
              : "border-border bg-surface-elevated text-text-muted hover:text-text-secondary hover:border-border-hover",
          ].join(" ")}
        >
          All
          <span className="text-[9px] bg-current rounded-full px-1 py-px text-surface font-bold">{INTEGRATIONS.length}</span>
        </button>
        {(Object.entries(CATEGORY_LABELS) as [IntegrationCategory, string][]).map(([cat, label]) => {
          const count = INTEGRATIONS.filter(i => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "border-accent/50 bg-accent/[0.08] text-accent"
                  : "border-border bg-surface-elevated text-text-muted hover:text-text-secondary hover:border-border-hover",
              ].join(" ")}
            >
              <span aria-hidden>{CATEGORY_ICONS[cat]}</span>
              {label}
              <span className="text-[9px] opacity-50">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm font-medium text-text-secondary mb-1">No integrations found</p>
          <p className="text-xs text-text-muted mb-4">Try a different search term or category filter.</p>
          <button
            onClick={() => { setQuery(""); setActiveCategory("all"); setStatusFilter("all"); }}
            className="text-xs text-accent hover:text-violet-400 transition-colors font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Integration grid — grouped by category */}
      <div className="flex flex-col gap-10">
        {categories.map(cat => (
          <section key={cat} aria-labelledby={`cat-${cat}`}>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="text-base" aria-hidden>{CATEGORY_ICONS[cat]}</span>
              <h2 id={`cat-${cat}`} className="text-sm font-bold text-white">{CATEGORY_LABELS[cat]}</h2>
              <span className="text-[10px] text-text-muted">{grouped[cat]!.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {grouped[cat]!.map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  status={getStatus(integration.id)}
                  onConnect={() => setDrawerTarget(integration.id)}
                  onSettings={() => setDrawerTarget(integration.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Connection drawer */}
      {drawerTarget && (
        <ConnectionDrawer
          integration={drawerIntegration}
          connection={drawerConnection}
          onSave={conn => handleSaveConnection(drawerTarget, conn)}
          onDisconnect={() => handleDisconnect(drawerTarget)}
          onClose={() => setDrawerTarget(null)}
        />
      )}
    </>
  );
}
