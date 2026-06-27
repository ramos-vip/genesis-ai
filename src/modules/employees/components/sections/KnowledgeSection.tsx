"use client";

import { useState } from "react";
import Link    from "next/link";
import Button  from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Skeleton from "@/components/ui/Skeleton";
import Modal   from "@/components/ui/Modal";
import { useToast } from "@/shared/providers";
import { ROUTES }   from "@/shared/constants";
import {
  useLinkedKnowledge,
  useAvailableKnowledge,
  useLinkKnowledge,
  useUnlinkKnowledge,
} from "../../hooks/useEmployeeKnowledge";
import type { KnowledgeSource, TextMeta, UrlMeta, PdfMeta } from "@/modules/knowledge/types";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const typeGradient: Record<KnowledgeSource["type"], string> = {
  text: "from-emerald-600/20 to-emerald-600/5",
  url:  "from-blue-600/20 to-blue-600/5",
  pdf:  "from-orange-600/20 to-orange-600/5",
};

const typeLabel: Record<KnowledgeSource["type"], string> = {
  text: "Text",
  url:  "Website",
  pdf:  "PDF",
};

function sourceSummary(source: KnowledgeSource): string {
  switch (source.type) {
    case "text": return `${(source.meta as TextMeta).wordCount.toLocaleString()} words`;
    case "url":  return (source.meta as UrlMeta).url;
    case "pdf":  return (source.meta as PdfMeta).fileName;
  }
}

function TypeBadge({ type }: { type: KnowledgeSource["type"] }) {
  return (
    <span className={`shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${typeGradient[type]} border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/70`}>
      {typeLabel[type][0]}
    </span>
  );
}

/* ─── Add-source modal ────────────────────────────────────────────────────── */

function SourceSelectorModal({
  open,
  onClose,
  employeeId,
  available,
  isPending,
}: {
  open:       boolean;
  onClose:    () => void;
  employeeId: string;
  available:  KnowledgeSource[];
  isPending:  boolean;
}) {
  const { mutate: link } = useLinkKnowledge();
  const { toast }        = useToast();

  function handleLink(sourceId: string, sourceName: string) {
    link(
      { employeeId, knowledgeSourceId: sourceId },
      {
        onSuccess: () => toast.success(`"${sourceName}" linked.`),
        onError:   () => toast.error("Failed to link source."),
      }
    );
  }

  return (
    <Modal open={open} onClose={onClose} title="Add knowledge source" size="sm">
      {available.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-sm text-text-secondary mb-4">
            All your knowledge sources are already linked, or your knowledge base is empty.
          </p>
          <Link
            href={ROUTES.APP.KNOWLEDGE.ROOT}
            className="text-sm font-medium text-accent hover:text-violet-400 transition-colors"
            onClick={onClose}
          >
            Go to Knowledge Base →
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {available.map((source) => (
            <li key={source.id}>
              <button
                onClick={() => { handleLink(source.id, source.name); onClose(); }}
                disabled={isPending}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface-elevated hover:border-border-hover hover:bg-surface transition-all text-left focus-ring disabled:opacity-50"
              >
                <TypeBadge type={source.type} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">{source.name}</p>
                  <p className="text-xs text-text-muted truncate">{sourceSummary(source)}</p>
                </div>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-text-muted shrink-0" aria-hidden>
                  <path d="M8 2v12M2 8h12" strokeLinecap="round"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

interface KnowledgeSectionProps {
  employeeId: string;
}

export default function KnowledgeSection({ employeeId }: KnowledgeSectionProps) {
  const [addOpen, setAddOpen] = useState(false);
  const { toast }             = useToast();

  const { data: linked,    isLoading: loadingLinked }    = useLinkedKnowledge(employeeId);
  const { data: available, isLoading: loadingAvailable } = useAvailableKnowledge(employeeId);
  const { mutate: unlink,  isPending: unlinking }        = useUnlinkKnowledge();
  const { isPending: linking }                           = useLinkKnowledge();

  const isLoading = loadingLinked || loadingAvailable;

  function handleUnlink(sourceId: string, sourceName: string) {
    unlink(
      { employeeId, knowledgeSourceId: sourceId },
      {
        onSuccess: () => toast.success(`"${sourceName}" unlinked.`),
        onError:   () => toast.error("Failed to unlink source."),
      }
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Knowledge</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            Sources this AI employee learns from.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setAddOpen(true)}
          disabled={isLoading}
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5" aria-hidden>
            <path d="M8 2v12M2 8h12" strokeLinecap="round"/>
          </svg>
          Add source
        </Button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border">
              <Skeleton variant="rect" width={32} height={32} className="rounded-lg shrink-0" />
              <div className="flex-1">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" className="mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : linked?.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-border">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-text-muted mb-3" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <p className="text-sm font-medium text-text-secondary mb-1">No sources linked</p>
          <p className="text-xs text-text-muted max-w-[220px] leading-relaxed">
            Add knowledge sources so this AI employee can learn from your content.
          </p>
        </div>
      ) : (
        /* Linked sources list */
        <ul className="flex flex-col gap-2">
          {linked?.map((source) => (
            <li
              key={source.id}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface-elevated"
            >
              <TypeBadge type={source.type} />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">{source.name}</p>
                <p className="text-xs text-text-muted truncate">{sourceSummary(source)}</p>
              </div>

              {/* Unlink button */}
              <button
                onClick={() => handleUnlink(source.id, source.name)}
                disabled={unlinking}
                aria-label={`Unlink ${source.name}`}
                className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger-bg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 focus-ring"
              >
                {unlinking
                  ? <Spinner size="xs" color="danger" />
                  : (
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3" aria-hidden>
                      <path d="M2 2l8 8M10 2L2 10" strokeLinecap="round"/>
                    </svg>
                  )
                }
              </button>
            </li>
          ))}
        </ul>
      )}

      <SourceSelectorModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        employeeId={employeeId}
        available={available ?? []}
        isPending={linking}
      />
    </div>
  );
}
