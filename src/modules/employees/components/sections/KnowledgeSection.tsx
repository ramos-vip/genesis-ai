/**
 * Knowledge Section — placeholders only.
 * Real integrations: Sprint 7+.
 */

import Badge from "@/components/ui/Badge";

interface Source {
  id:          string;
  label:       string;
  description: string;
  icon:        React.FC<{ className?: string }>;
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

const SOURCES: Source[] = [
  { id: "website", label: "Website",      description: "Import pages from any URL",    icon: WebIcon  },
  { id: "pdf",     label: "PDF / Docs",   description: "Upload files directly",        icon: PDFIcon  },
  { id: "text",    label: "Plain Text",   description: "Paste content manually",       icon: TextIcon },
  { id: "gdrive",  label: "Google Drive", description: "Sync folders automatically",  icon: DriveIcon },
];

export default function KnowledgeSection() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white">Knowledge</h3>
        <p className="text-sm text-text-secondary mt-0.5">
          Connect data sources to train this AI employee on your content.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <div
              key={source.id}
              aria-disabled="true"
              className="relative flex items-start gap-3 p-4 rounded-xl border border-border bg-surface-elevated opacity-60 cursor-not-allowed select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-text-muted shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-text-secondary truncate">{source.label}</p>
                </div>
                <p className="text-xs text-text-muted">{source.description}</p>
              </div>
              <Badge variant="default" size="sm" className="shrink-0 absolute top-3 right-3">
                Soon
              </Badge>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-text-muted text-center">
        Knowledge source integrations are coming in a future update.
      </p>
    </div>
  );
}
