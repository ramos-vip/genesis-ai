import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Project Genesis" };

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Admin Panel</h1>
      <p className="text-sm text-text-secondary mb-8">Internal operations dashboard.</p>
      <div className="rounded-2xl border border-danger-border bg-danger-bg p-8 text-center text-danger text-sm">
        Admin UI coming in a future sprint. Access is restricted to genesis:admin role.
      </div>
    </div>
  );
}
