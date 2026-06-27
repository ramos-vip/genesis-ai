"use client";

import { useEffect, useState } from "react";

/** Returns true when the media query matches. SSR-safe (returns false on server). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Responsive breakpoint hooks matching Tailwind defaults */
export const useBreakpoint = {
  sm:  () => useMediaQuery("(min-width: 640px)"),
  md:  () => useMediaQuery("(min-width: 768px)"),
  lg:  () => useMediaQuery("(min-width: 1024px)"),
  xl:  () => useMediaQuery("(min-width: 1280px)"),
  "2xl": () => useMediaQuery("(min-width: 1536px)"),
};

export function useIsMobile(): boolean {
  return !useMediaQuery("(min-width: 768px)");
}
