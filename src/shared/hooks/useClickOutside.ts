"use client";

import { RefObject, useEffect } from "react";

/**
 * Calls `handler` when a pointer event occurs outside the referenced element(s).
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setOpen(false));
 */
export function useClickOutside<T extends HTMLElement>(
  ref:     RefObject<T | null> | RefObject<T | null>[],
  handler: (event: PointerEvent) => void,
  /** Set to false to temporarily disable */
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const refs = Array.isArray(ref) ? ref : [ref];

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      const isOutside = refs.every((r) => r.current && !r.current.contains(target));
      if (isOutside) handler(event);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, handler, enabled]);
}
