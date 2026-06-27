/**
 * Step 4 — Knowledge Sources (placeholder, not functional)
 *
 * Displays the available source types with "Coming soon" badges.
 * The UI architecture is wired to accept real integrations in Sprint 7+
 * without changing this component — just remove the `disabled` prop.
 */

import { useWizardContext } from "../../hooks/useCreateEmployeeWizard";

interface SourceCard {
  id:    string;
  label: string;
  description: string;
  icon:  React.FC<{ className?: string }>;
}

function WebIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" d="M10 2.5c-2 2.5-3 4.5-3 7.5s1 5 3 7.5M10 2.5c2 2.5 3 4.5 3 7.5s-1 5-3 7.5M2.5 10h15" />
    </svg>
  );
}
function PDFIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  );
}
function TextIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  );
}
function DriveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 16.5 3.75-6.5L10.5 16.5H3Zm7.5 0 3.75-6.5 3.75 6.5H10.5ZM6.75 10 10.5 3.5 14.25 10H6.75Z" />
    </svg>
  );
}

const KNOWLEDGE_SOURCES: SourceCard[] = [
  { id: "website", label: "Website",      description: "Import pages and docs from any URL",   icon: WebIcon  },
  { id: "pdf",     label: "PDF / Docs",   description: "Upload PDFs, Word, or text files",     icon: PDFIcon  },
  { id: "text",    label: "Plain Text",   description: "Paste text directly into the editor",  icon: TextIcon },
  { id: "gdrive",  label: "Google Drive", description: "Sync folders and files automatically", icon: DriveIcon },
];

export default function Step4Knowledge() {
  const { state } = useWizardContext();
  const name = state.data.name || "your AI employee";

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          Train{" "}
          <span className="text-accent">{name}</span> on your data
        </h2>
        <p className="text-sm text-text-secondary">
          Add knowledge sources so your AI employee learns your business.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {KNOWLEDGE_SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <div
              key={source.id}
              aria-disabled="true"
              className="relative flex flex-col gap-3 p-5 rounded-xl border border-border bg-surface opacity-60 cursor-not-allowed select-none"
            >
              {/* Coming soon badge */}
              <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-wider uppercase text-text-muted border border-border rounded-full px-2 py-0.5">
                Soon
              </span>

              <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-text-muted">
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-text-secondary mb-0.5">{source.label}</p>
                <p className="text-xs text-text-muted leading-relaxed">{source.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-sm text-text-muted text-center leading-relaxed">
        Knowledge sources will be available after your employee is created.
        <br />
        You can skip this step for now.
      </p>
    </div>
  );
}
