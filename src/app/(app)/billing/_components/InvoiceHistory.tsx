import { formatDate } from "@/shared/utils";
import type { Invoice } from "@/server/billing/provider";

const statusVariant: Record<Invoice["status"], { label: string; color: string; bg: string }> = {
  paid: { label: "Paid",   color: "text-success", bg: "bg-success/10 border-success/20" },
  open: { label: "Open",   color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  void: { label: "Void",   color: "text-text-muted", bg: "bg-surface-elevated border-border" },
};

function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function InvoiceHistory({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-text-primary">Invoice History</h3>
        <p className="text-xs text-text-muted mt-0.5">Downloadable PDF invoices appear here after payment.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center mb-4">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-text-muted" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-secondary mb-1">No invoices yet</p>
          <p className="text-xs text-text-muted max-w-xs leading-relaxed">
            You&apos;re on the free plan. Invoices will appear here when you upgrade to a paid subscription.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-border">
                {["Date", "Amount", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => {
                const sv = statusVariant[inv.status];
                return (
                  <tr key={inv.id} className="hover:bg-surface-elevated transition-colors">
                    <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap">
                      {formatDate(inv.date, "medium")}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white tabular-nums">
                      {formatAmount(inv.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${sv.color} ${sv.bg}`}>
                        {sv.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent hover:text-violet-400 transition-colors font-medium"
                        >
                          Download PDF →
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
