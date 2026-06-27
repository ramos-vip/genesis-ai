"use client";

import { useState } from "react";
import Badge   from "@/components/ui/Badge";
import Button  from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Spinner  from "@/components/ui/Spinner";
import Modal    from "@/components/ui/Modal";
import { useToast }               from "@/shared/providers";
import { useKnowledgeSources, useDeleteKnowledgeSource } from "../hooks/useKnowledge";
import AddKnowledgeModal from "./AddKnowledgeModal";
import { formatDate, formatFileSize } from "@/shared/utils";
import type { KnowledgeSource, TextMeta, UrlMeta, PdfMeta } from "../types";

/* ─── Source card ─────────────────────────────────────────────────────────── */

function SourceTypeIcon({ type }: { type: KnowledgeSource["type"] }) {
  if (type === "text") return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  );
  if (type === "url") return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <circle cx="10" cy="10" r="7.5"/><path strokeLinecap="round" d="M10 2.5c-2 2.5-3 4.5-3 7.5s1 5 3 7.5M10 2.5c2 2.5 3 4.5 3 7.5s-1 5-3 7.5M2.5 10h15"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9Z" />
    </svg>
  );
}

function metaDescription(source: KnowledgeSource): string {
  switch (source.type) {
    case "text": {
      const m = source.meta as TextMeta;
      return `${m.wordCount.toLocaleString()} words`;
    }
    case "url":
      return (source.meta as UrlMeta).url;
    case "pdf": {
      const m = source.meta as PdfMeta;
      return `${m.fileName} · ${formatFileSize(m.fileSize)}${m.pageCount ? ` · ${m.pageCount} pages` : ""}`;
    }
  }
}

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

function KnowledgeSourceCard({ source }: { source: KnowledgeSource }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toast } = useToast();
  const { mutate: deleteSource, isPending } = useDeleteKnowledgeSource();

  function handleDelete() {
    deleteSource(source.id, {
      onSuccess: () => { setConfirmOpen(false); toast.success(`"${source.name}" removed.`); },
      onError:   () => { setConfirmOpen(false); toast.error("Failed to delete source."); },
    });
  }

  return (
    <>
      <div className="group flex flex-col gap-4 p-5 rounded-2xl border border-border bg-surface hover:border-white/[0.12] hover:bg-surface-elevated transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeGradient[source.type]} border border-white/[0.08] flex items-center justify-center text-zinc-300 shrink-0`}>
            <SourceTypeIcon type={source.type} />
          </div>
          <Badge variant={source.status === "ready" ? "success" : source.status === "error" ? "danger" : "info"} size="sm" dot>
            {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-text-muted">{typeLabel[source.type]}</span>
          </div>
          <h3 className="text-sm font-semibold text-white truncate">{source.name}</h3>
          <p className="text-xs text-text-muted mt-1 truncate">{metaDescription(source)}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-text-muted">{formatDate(source.createdAt, "short")}</span>
          <button
            onClick={() => setConfirmOpen(true)}
            className="text-xs text-text-muted hover:text-danger transition-colors focus-ring rounded px-1"
            aria-label={`Delete ${source.name}`}
          >
            Delete
          </button>
        </div>
      </div>

      <Modal open={confirmOpen} onClose={() => !isPending && setConfirmOpen(false)} title="Delete source?" size="sm" persistent={isPending}>
        <div className="flex flex-col gap-6">
          <p className="text-sm text-text-secondary leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-text-primary">&ldquo;{source.name}&rdquo;</span>?
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" size="md" onClick={() => setConfirmOpen(false)} disabled={isPending}>Cancel</Button>
            <Button variant="danger" size="md" onClick={handleDelete} disabled={isPending}>
              {isPending ? <Spinner size="xs" color="danger" /> : null}
              {isPending ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── Grid ────────────────────────────────────────────────────────────────── */

export default function KnowledgeGrid() {
  const [addOpen, setAddOpen] = useState(false);
  const { data: sources, isLoading, isError, error } = useKnowledgeSources();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-border bg-surface space-y-4">
            <Skeleton variant="rect" width={40} height={40} className="rounded-xl" />
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-danger-border bg-danger-bg p-6 text-center">
        <p className="text-sm text-danger font-medium">Failed to load knowledge sources</p>
        <p className="text-xs text-text-muted mt-1">
          {error instanceof Error ? error.message : "An error occurred."}
        </p>
      </div>
    );
  }

  const list = sources ?? [];

  return (
    <>
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border">
          <div className="mb-4 w-14 h-14 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-text-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-2">Knowledge base is empty</h3>
          <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-6">
            Add text content, website URLs, or PDF metadata to train your AI employees.
          </p>
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden>
              <path d="M8 2v12M2 8h12" strokeLinecap="round"/>
            </svg>
            Add knowledge source
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((source) => (
            <KnowledgeSourceCard key={source.id} source={source} />
          ))}

          {/* Add new tile */}
          <button
            onClick={() => setAddOpen(true)}
            className="flex flex-col items-center justify-center gap-2 h-40 rounded-2xl border border-dashed border-border hover:border-border-hover bg-surface hover:bg-surface-elevated transition-all text-sm text-text-muted hover:text-text-secondary"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden>
              <path d="M10 4v12M4 10h12" strokeLinecap="round"/>
            </svg>
            Add source
          </button>
        </div>
      )}

      <AddKnowledgeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  );
}
