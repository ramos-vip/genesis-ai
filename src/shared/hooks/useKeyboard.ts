"use client";

import { useEffect } from "react";

type ModifierKey = "meta" | "ctrl" | "shift" | "alt";

interface KeyBinding {
  key:       string;
  modifiers?: ModifierKey[];
  handler:   (event: KeyboardEvent) => void;
  /** Only fire when this element (or document) is focused. Default: document */
  target?:   EventTarget;
  enabled?:  boolean;
}

/**
 * Declarative keyboard shortcut binding.
 *
 * @example
 * useKeyboard([
 *   { key: 'k', modifiers: ['meta'], handler: openCommand },
 *   { key: 'Escape', handler: closeModal, enabled: isOpen },
 * ]);
 */
export function useKeyboard(bindings: KeyBinding[]): void {
  useEffect(() => {
    const activeBindings = bindings.filter((b) => b.enabled !== false);

    function onKeyDown(event: KeyboardEvent) {
      for (const binding of activeBindings) {
        const keyMatch = event.key.toLowerCase() === binding.key.toLowerCase();
        if (!keyMatch) continue;

        const mods = binding.modifiers ?? [];
        const metaMatch  = mods.includes("meta")  ? (event.metaKey  || event.ctrlKey)  : !event.metaKey  && !event.ctrlKey;
        const shiftMatch = mods.includes("shift") ? event.shiftKey  : !event.shiftKey;
        const altMatch   = mods.includes("alt")   ? event.altKey    : !event.altKey;

        // For meta, allow either Cmd (macOS) or Ctrl (Windows)
        const ctrlMatch  = mods.includes("ctrl")  ? (event.ctrlKey  || event.metaKey)  : true;

        const allModsMatch = mods.includes("meta")
          ? metaMatch && shiftMatch && altMatch
          : ctrlMatch && shiftMatch && altMatch;

        if (allModsMatch) {
          event.preventDefault();
          binding.handler(event);
          return;
        }
      }
    }

    const targets = new Set(activeBindings.map((b) => b.target ?? document));
    targets.forEach((t) => t.addEventListener("keydown", onKeyDown as EventListener));
    return () => targets.forEach((t) => t.removeEventListener("keydown", onKeyDown as EventListener));
  }, [bindings]);
}
