"use client";

import { useLocalStorage } from "@/shared/hooks";

interface NotifPrefs {
  productUpdates: boolean;
  billingEmails:  boolean;
  aiActivity:     boolean;
  securityAlerts: boolean;
}

const DEFAULT_NOTIF: NotifPrefs = {
  productUpdates: true,
  billingEmails:  true,
  aiActivity:     false,
  securityAlerts: true,
};

interface NotifRow {
  key:   keyof NotifPrefs;
  label: string;
  sub:   string;
  locked?: boolean;
}

const ROWS: NotifRow[] = [
  { key: "productUpdates", label: "Product updates",    sub: "New features, improvements and announcements." },
  { key: "billingEmails",  label: "Billing emails",     sub: "Invoices, payment confirmations and plan changes.", locked: true },
  { key: "aiActivity",     label: "AI activity digest", sub: "Weekly summary of your AI employees' performance." },
  { key: "securityAlerts", label: "Security alerts",    sub: "Sign-ins from new devices and suspicious activity.", locked: true },
];

export default function NotificationsSection() {
  const [prefs, setPrefs] = useLocalStorage<NotifPrefs>("genesis:settings:notifications", DEFAULT_NOTIF);

  function toggle(key: keyof NotifPrefs) {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden" id="notifications">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <p className="text-xs text-text-muted mt-0.5">Control what emails you receive from Genesis AI.</p>
      </div>

      <div className="px-6 divide-y divide-border">
        {ROWS.map(({ key, label, sub, locked }) => (
          <div key={key} className="flex items-start justify-between gap-6 py-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-primary">{label}</p>
                {locked && (
                  <span className="text-[10px] font-semibold text-text-muted border border-border rounded-full px-1.5 py-0.5">Required</span>
                )}
              </div>
              <p className="text-xs text-text-muted mt-0.5">{sub}</p>
            </div>

            <button
              role="switch"
              aria-checked={locked ? true : prefs[key]}
              onClick={() => !locked && toggle(key)}
              disabled={locked}
              className={`shrink-0 relative w-10 h-5 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                (locked || prefs[key]) ? "bg-accent border-accent/50" : "bg-surface-elevated border-border"
              } ${locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  (locked || prefs[key]) ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
