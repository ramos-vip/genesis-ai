"use client";

import { useCommand } from "@/shared/providers";
import UserMenu from "./UserMenu";

export default function TopBar() {
  const { open: openCommand } = useCommand();

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-surface shrink-0">
      {/* Command palette trigger */}
      <button
        onClick={openCommand}
        className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-surface-elevated text-text-muted text-sm hover:border-border-hover hover:text-text-primary transition-all duration-150 focus-ring"
        aria-label="Open command palette (⌘K)"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-3.5 h-3.5 shrink-0"
          aria-hidden
        >
          <circle cx="7" cy="7" r="4.5" />
          <path d="M10.5 10.5L13.5 13.5" strokeLinecap="round" />
        </svg>
        <span className="hidden sm:block text-xs">Search anything…</span>
        <kbd className="hidden sm:flex items-center gap-0.5 ml-6 text-[10px] text-text-muted border border-border rounded px-1.5 py-0.5 font-mono">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Right slot */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.05] transition-all focus-ring"
          aria-label="Notifications"
        >
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-5 h-5"
            aria-hidden
          >
            <path strokeLinecap="round" d="M10 2a6 6 0 00-6 6v2.5l-1.5 2.5h15L16 10.5V8a6 6 0 00-6-6zM8.5 17a1.5 1.5 0 003 0" />
          </svg>
          {/* Indicator dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border-2 border-surface"
            aria-hidden
          />
        </button>

        {/* User dropdown */}
        <UserMenu />
      </div>
    </header>
  );
}
