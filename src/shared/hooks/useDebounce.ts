"use client";

import { useEffect, useRef, useState } from "react";

/** Returns a debounced version of `value` that updates after `delay` ms. */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/** Returns a debounced callback. Stable reference across renders. */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay:    number = 300
): T {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const debounced = useRef((...args: Parameters<T>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return debounced.current as T;
}
