"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface CommandItem {
  id:       string;
  label:    string;
  group?:   string;
  shortcut?: string[];
  icon?:    ReactNode;
  action:   () => void;
  /** Filter keywords in addition to label */
  keywords?: string[];
}

interface CommandContextValue {
  isOpen:  boolean;
  open:    () => void;
  close:   () => void;
  toggle:  () => void;
  /** Register commands dynamically (e.g. from a page component) */
  register:   (items: CommandItem[]) => () => void;
  /** All registered commands */
  commands: CommandItem[];
}

/* ─── Context ────────────────────────────────────────────────────────────── */

const CommandContext = createContext<CommandContextValue | null>(null);

export function useCommand(): CommandContextValue {
  const ctx = useContext(CommandContext);
  if (!ctx) throw new Error("useCommand must be used inside <CommandProvider>");
  return ctx;
}

/* ─── Provider ───────────────────────────────────────────────────────────── */

export default function CommandProvider({ children }: { children: ReactNode }) {
  const [isOpen,   setOpen]    = useState(false);
  const [commandSets, setCommandSets] = useState<Map<string, CommandItem[]>>(new Map());

  const open   = useCallback(() => setOpen(true),  []);
  const close  = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  /** Register a set of commands. Returns a cleanup function. */
  const register = useCallback((items: CommandItem[]): (() => void) => {
    const key = `cmd-${Math.random().toString(36).slice(2)}`;
    setCommandSets((prev) => new Map(prev).set(key, items));
    return () => setCommandSets((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const commands: CommandItem[] = Array.from(commandSets.values()).flat();

  /* Global keyboard shortcut: ⌘K / Ctrl+K */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape" && isOpen) {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, toggle, close]);

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <CommandContext.Provider value={{ isOpen, open, close, toggle, register, commands }}>
      {children}
      {/*
        Command palette UI is rendered here in Sprint 4.
        The provider wires up the keyboard shortcut and state.
        Components can call useCommand().open() to trigger it.
      */}
    </CommandContext.Provider>
  );
}
