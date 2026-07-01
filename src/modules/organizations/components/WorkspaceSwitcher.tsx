"use client";

import { useRef, useState } from "react";
import { useClickOutside } from "@/shared/hooks";
import { initials } from "@/shared/utils/format";
import { useOrganization } from "../context/OrganizationProvider";
import { CreateOrganizationModal } from "./CreateOrganizationModal";

export function WorkspaceSwitcher() {
  const { organizations, activeOrg, setActiveOrgId, isLoading } = useOrganization();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  if (isLoading) {
    return <div className="h-9 w-40 rounded-lg bg-surface-elevated animate-pulse" />;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-surface-elevated hover:border-border-hover transition-all focus-ring max-w-[220px]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="w-6 h-6 rounded-md bg-accent/15 text-accent text-[11px] font-semibold flex items-center justify-center shrink-0">
          {activeOrg ? initials(activeOrg.name) : "—"}
        </span>
        <span className="text-sm font-medium text-text-primary truncate">
          {activeOrg ? activeOrg.name : "No workspace"}
        </span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-3.5 h-3.5 text-text-muted shrink-0"
          aria-hidden
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-64 z-50 rounded-xl border border-border bg-surface-elevated shadow-xl p-1.5">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted select-none">
            Workspaces
          </p>
          <ul className="max-h-64 overflow-y-auto">
            {organizations.length === 0 && (
              <li className="px-2 py-2 text-sm text-text-muted">No workspaces yet</li>
            )}
            {organizations.map((org) => {
              const active = activeOrg?.id === org.id;
              return (
                <li key={org.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveOrgId(org.id);
                      setOpen(false);
                    }}
                    className={[
                      "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-colors",
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-text-secondary hover:bg-white/[0.05] hover:text-text-primary",
                    ].join(" ")}
                  >
                    <span className="w-6 h-6 rounded-md bg-accent/15 text-accent text-[11px] font-semibold flex items-center justify-center shrink-0">
                      {initials(org.name)}
                    </span>
                    <span className="truncate flex-1 text-left">{org.name}</span>
                    {active && (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4 shrink-0"
                        aria-hidden
                      >
                        <path d="M13 4L6 11 3 8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border mt-1 pt-1">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setCreateOpen(true);
              }}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-text-secondary hover:bg-white/[0.05] hover:text-text-primary transition-colors"
            >
              <span className="w-6 h-6 rounded-md border border-dashed border-border flex items-center justify-center shrink-0 text-text-muted">
                +
              </span>
              Create workspace
            </button>
          </div>
        </div>
      )}

      <CreateOrganizationModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
