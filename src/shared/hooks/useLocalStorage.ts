"use client";

import { useCallback, useEffect, useState } from "react";
import { safeJsonParse } from "@/shared/utils";

/**
 * Synced localStorage hook. SSR-safe.
 *
 * @example
 * const [collapsed, setCollapsed] = useLocalStorage('sidebar:collapsed', false);
 */
export function useLocalStorage<T>(
  key:          string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    const item = localStorage.getItem(key);
    return item !== null ? (safeJsonParse<T>(item) ?? initialValue) : initialValue;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === "function"
          ? (value as (prev: T) => T)(prev)
          : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // QuotaExceededError — fail silently
        }
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  /* Sync across tabs */
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== key || e.storageArea !== localStorage) return;
      setStoredValue(e.newValue !== null
        ? (safeJsonParse<T>(e.newValue) ?? initialValue)
        : initialValue
      );
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}
