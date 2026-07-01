"use client";

/**
 * OrganizationProvider (EPIC-009)
 *
 * Holds the active workspace for the whole (app) subtree. The active org id is
 * persisted to localStorage and auto-falls back to the first available org.
 * Sits under the root QueryProvider, so useMyOrganizations() works here.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMyOrganizations } from "../hooks/useOrganizations";
import type { Organization } from "../types";

const STORAGE_KEY = "genesis:active-org";

interface OrganizationContextValue {
  organizations:  Organization[];
  activeOrg:      Organization | null;
  activeOrgId:    string | null;
  setActiveOrgId: (id: string) => void;
  isLoading:      boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { data: organizations = [], isLoading } = useMyOrganizations();
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);

  // Hydrate persisted selection on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) setActiveOrgIdState(stored);
  }, []);

  // Keep selection valid: fall back to the first org when needed.
  useEffect(() => {
    if (organizations.length === 0) return;
    setActiveOrgIdState((current) => {
      if (current && organizations.some((o) => o.id === current)) return current;
      return organizations[0].id;
    });
  }, [organizations]);

  const setActiveOrgId = useCallback((id: string) => {
    setActiveOrgIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const activeOrg = useMemo(
    () => organizations.find((o) => o.id === activeOrgId) ?? null,
    [organizations, activeOrgId]
  );

  const value = useMemo<OrganizationContextValue>(
    () => ({ organizations, activeOrg, activeOrgId, setActiveOrgId, isLoading }),
    [organizations, activeOrg, activeOrgId, setActiveOrgId, isLoading]
  );

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
}

export function useOrganization(): OrganizationContextValue {
  const ctx = useContext(OrganizationContext);
  if (!ctx) throw new Error("useOrganization must be used within an OrganizationProvider");
  return ctx;
}
