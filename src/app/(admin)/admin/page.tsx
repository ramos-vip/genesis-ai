import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Project Genesis" };

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
      <p className="text-sm text-text-secondary mb-8">Internal operations dashboard.</p>
      <div className="rounded-2xl border border-danger-border bg-danger-bg p-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger-border flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-danger" aria-hidden>
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-danger mb-1">Restricted access</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              This panel is for internal use only. Full admin tooling is under development and
              will be accessible to accounts with the <code className="text-xs bg-danger/10 px-1.5 py-0.5 rounded font-mono">genesis:admin</code> role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
