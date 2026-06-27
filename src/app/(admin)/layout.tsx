/**
 * Admin layout — internal tooling, ops panel.
 * Gated by admin role check in proxy.ts (Sprint 4).
 */
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 flex items-center px-6 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-danger/20 flex items-center justify-center">
            <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-danger" aria-hidden>
              <path d="M6 1L7.5 4.5H11L8.5 6.5L9.5 10.5L6 8.5L2.5 10.5L3.5 6.5L1 4.5H4.5L6 1Z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white">Genesis Admin</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger-border">
            INTERNAL
          </span>
        </div>
      </header>
      <main className="p-6 lg:p-8">{children}</main>
    </div>
  );
}
