"use client";

import {
  KeyboardEvent,
  ReactNode,
  RefObject,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface DropdownCtx {
  open:       boolean;
  setOpen:    (v: boolean | ((prev: boolean) => boolean)) => void;
  close:      () => void;
  triggerId:  string;
  menuId:     string;
  activeIdx:  number;
  setActive:  (i: number) => void;
  itemCount:  RefObject<number>;
}

const Ctx = createContext<DropdownCtx | null>(null);
function useDropdownCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Dropdown compound components must be used within <Dropdown>");
  return ctx;
}

/* ─── Root ─────────────────────────────────────────────────────────────────── */

interface DropdownProps {
  children: ReactNode;
  align?:   "start" | "end" | "center";
}

function useDropdown(align: "start" | "end" | "center" = "start") {
  const id         = useId();
  const triggerId  = `dropdown-trigger-${id}`;
  const menuId     = `dropdown-menu-${id}`;
  const [open, setOpen] = useState(false);
  const [activeIdx, setActive] = useState(-1);
  const itemCount  = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef    = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setActive(-1);
    triggerRef.current?.focus();
  }, []);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !triggerRef.current?.contains(t)) close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return { open, setOpen, close, triggerId, menuId, activeIdx, setActive, itemCount, triggerRef, menuRef, align };
}

/* ─── Trigger ──────────────────────────────────────────────────────────────── */

interface TriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

function Trigger({ children }: TriggerProps) {
  const { open, setOpen, triggerId, menuId, activeIdx, setActive, itemCount } = useDropdownCtx();

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setOpen(true);
      setActive(0);
    }
    if (e.key === "ArrowUp") { e.preventDefault(); setOpen(true); setActive(itemCount.current - 1); }
  }

  return (
    <button
      id={triggerId}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? menuId : undefined}
      onClick={() => { setOpen((prev: boolean) => !prev); if (!open) setActive(-1); }}
      onKeyDown={onKeyDown}
      className="focus-ring rounded-lg"
    >
      {children}
    </button>
  );
}

/* ─── Menu ─────────────────────────────────────────────────────────────────── */

interface MenuProps {
  children: ReactNode;
}

function Menu({ children }: MenuProps) {
  const { open, menuId, triggerId } = useDropdownCtx();
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      id={menuId}
      role="menu"
      aria-labelledby={triggerId}
      className="fixed z-dropdown min-w-[180px] rounded-xl border border-border bg-surface-elevated shadow-[0_10px_15px_rgba(0,0,0,0.4),0_4px_6px_rgba(0,0,0,0.2)] animate-scale-in p-1"
      style={{ top: "var(--dropdown-y)", left: "var(--dropdown-x)" }}
    >
      {children}
    </div>,
    document.body
  );
}

/* ─── Item ─────────────────────────────────────────────────────────────────── */

interface ItemProps {
  children:   ReactNode;
  onClick?:   () => void;
  disabled?:  boolean;
  danger?:    boolean;
  leading?:   ReactNode;
  trailing?:  ReactNode;
  idx:        number;
}

function Item({ children, onClick, disabled = false, danger = false, leading, trailing, idx }: ItemProps) {
  const { close, activeIdx, setActive } = useDropdownCtx();
  const isActive = activeIdx === idx;

  function handleClick() {
    if (disabled) return;
    onClick?.();
    close();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleClick(); }
  }

  return (
    <button
      role="menuitem"
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setActive(idx)}
      className={[
        "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-left",
        "transition-colors duration-100 outline-none",
        disabled ? "opacity-40 cursor-not-allowed" :
          danger  ? "text-danger hover:bg-danger-bg" :
                    "text-text-primary hover:bg-white/[0.06]",
        isActive && !disabled ? (danger ? "bg-danger-bg" : "bg-white/[0.06]") : "",
      ].join(" ")}
    >
      {leading  && <span className="w-4 h-4 shrink-0 text-text-muted" aria-hidden>{leading}</span>}
      <span className="flex-1">{children}</span>
      {trailing && <span className="ml-auto text-text-muted" aria-hidden>{trailing}</span>}
    </button>
  );
}

/* ─── Separator ────────────────────────────────────────────────────────────── */

function DropdownSeparator() {
  return <div role="separator" className="my-1 h-px bg-border mx-1" />;
}

/* ─── Label ────────────────────────────────────────────────────────────────── */

function Label({ children }: { children: ReactNode }) {
  return (
    <p className="px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase text-text-muted select-none">
      {children}
    </p>
  );
}

/* ─── Root compound ────────────────────────────────────────────────────────── */

interface DropdownRootProps {
  children: (api: ReturnType<typeof useDropdown>) => ReactNode;
  align?:   "start" | "end" | "center";
}

function DropdownRoot({ children, align = "start" }: DropdownRootProps) {
  const api = useDropdown(align);
  return (
    <Ctx.Provider value={{
      open:      api.open,
      setOpen:   api.setOpen,
      close:     api.close,
      triggerId: api.triggerId,
      menuId:    api.menuId,
      activeIdx: api.activeIdx,
      setActive: api.setActive,
      itemCount: api.itemCount,
    }}>
      <div className="relative inline-block">
        {children(api)}
      </div>
    </Ctx.Provider>
  );
}

/* ─── Export ───────────────────────────────────────────────────────────────── */

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger,
  Menu,
  Item,
  Separator: DropdownSeparator,
  Label,
});
