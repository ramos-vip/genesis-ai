"use client";

import {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  ReactNode,
  createContext,
  useContext,
  useId,
  useRef,
  useState,
} from "react";

export type TabsVariant = "line" | "pills" | "boxed";

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface TabsCtx {
  active:    string;
  setActive: (id: string) => void;
  variant:   TabsVariant;
  baseId:    string;
  tabIds:    string[];
  addTab:    (id: string) => void;
}

const Ctx = createContext<TabsCtx | null>(null);
function useTabsCtx() {
  const c = useContext(Ctx);
  if (!c) throw new Error("Tabs subcomponents must be used within <Tabs.Root>");
  return c;
}

/* ─── Root ─────────────────────────────────────────────────────────────────── */

interface TabsRootProps {
  defaultValue: string;
  variant?:     TabsVariant;
  children:     ReactNode;
  className?:   string;
}

function Root({ defaultValue, variant = "line", children, className = "" }: TabsRootProps) {
  const [active, setActive] = useState(defaultValue);
  const baseId = useId();
  const tabIds = useRef<string[]>([]);

  function addTab(id: string) {
    if (!tabIds.current.includes(id)) tabIds.current.push(id);
  }

  return (
    <Ctx.Provider value={{ active, setActive, variant, baseId, tabIds: tabIds.current, addTab }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

/* ─── List (tab bar) ───────────────────────────────────────────────────────── */

function List({ children, className = "" }: ComponentPropsWithoutRef<"div">) {
  const { variant } = useTabsCtx();

  const listClasses = {
    line:  "flex border-b border-border gap-1",
    pills: "flex gap-1 p-1 bg-surface-elevated rounded-xl border border-border",
    boxed: "flex gap-px bg-border rounded-lg overflow-hidden",
  }[variant];

  return (
    <div role="tablist" className={`${listClasses} ${className}`}>
      {children}
    </div>
  );
}

/* ─── Tab ──────────────────────────────────────────────────────────────────── */

interface TabProps {
  value:      string;
  children:   ReactNode;
  disabled?:  boolean;
  leading?:   ReactNode;
  trailing?:  ReactNode;
  className?: string;
}

function Tab({ value, children, disabled = false, leading, trailing, className = "" }: TabProps) {
  const { active, setActive, variant, baseId, tabIds, addTab } = useTabsCtx();
  addTab(value);
  const isActive = active === value;
  const tabId    = `${baseId}-tab-${value}`;
  const panelId  = `${baseId}-panel-${value}`;

  function handleKeyDown(e: KeyboardEvent) {
    const idx     = tabIds.indexOf(value);
    const enabled = tabIds.filter((_, i) => {
      const el = document.getElementById(`${baseId}-tab-${tabIds[i]}`);
      return !(el as HTMLButtonElement | null)?.disabled;
    });
    const curr = enabled.indexOf(value);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = enabled[(curr + 1) % enabled.length];
      if (next) { setActive(next); document.getElementById(`${baseId}-tab-${next}`)?.focus(); }
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = enabled[(curr - 1 + enabled.length) % enabled.length];
      if (prev) { setActive(prev); document.getElementById(`${baseId}-tab-${prev}`)?.focus(); }
    }
    if (e.key === "Home") { e.preventDefault(); const first = enabled[0]; if (first) { setActive(first); document.getElementById(`${baseId}-tab-${first}`)?.focus(); } }
    if (e.key === "End")  { e.preventDefault(); const last = enabled[enabled.length - 1]; if (last) { setActive(last); document.getElementById(`${baseId}-tab-${last}`)?.focus(); } }
    void idx;
  }

  const variantStyles = {
    line: [
      "px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-150 rounded-none -mb-px",
      isActive  ? "border-accent text-text-primary" : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-hover",
      disabled  ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
    ],
    pills: [
      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150",
      isActive  ? "bg-surface text-text-primary shadow-sm border border-border" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]",
      disabled  ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
    ],
    boxed: [
      "flex-1 px-4 py-2 text-sm font-medium transition-colors duration-150",
      isActive  ? "bg-surface text-text-primary" : "bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-surface",
      disabled  ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
    ],
  }[variant];

  return (
    <button
      id={tabId}
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => !disabled && setActive(value)}
      onKeyDown={handleKeyDown}
      className={[...variantStyles, "inline-flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background", className].join(" ")}
    >
      {leading && <span className="w-4 h-4" aria-hidden>{leading}</span>}
      {children}
      {trailing && <span aria-hidden>{trailing}</span>}
    </button>
  );
}

/* ─── Panel ────────────────────────────────────────────────────────────────── */

interface PanelProps {
  value:      string;
  children:   ReactNode;
  className?: string;
}

function Panel({ value, children, className = "" }: PanelProps) {
  const { active, baseId } = useTabsCtx();
  if (active !== value) return null;
  return (
    <div
      id={`${baseId}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={`outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Export ───────────────────────────────────────────────────────────────── */

export const Tabs = { Root, List, Tab, Panel };
