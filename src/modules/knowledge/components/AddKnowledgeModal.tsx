"use client";

import { useRef, useState } from "react";
import Modal    from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import Input    from "@/components/ui/Input";
import Button   from "@/components/ui/Button";
import Spinner  from "@/components/ui/Spinner";
import { useToast }               from "@/shared/providers";
import { useCreateKnowledgeSource } from "../hooks/useKnowledge";
import type { KnowledgeSourceType } from "../types";

interface AddKnowledgeModalProps {
  open:    boolean;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 ** 2)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

function wordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export default function AddKnowledgeModal({ open, onClose }: AddKnowledgeModalProps) {
  const { toast }                           = useToast();
  const { mutateAsync: create, isPending }  = useCreateKnowledgeSource();

  /* ── Text form ── */
  const [textName,    setTextName]    = useState("");
  const [textContent, setTextContent] = useState("");

  /* ── URL form ── */
  const [urlName, setUrlName] = useState("");
  const [url,     setUrl]     = useState("");

  /* ── PDF form ── */
  const [pdfName,     setPdfName]     = useState("");
  const [fileName,    setFileName]    = useState("");
  const [fileSize,    setFileSize]    = useState(0);
  const [pageCount,   setPageCount]   = useState<number | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetAll() {
    setTextName(""); setTextContent("");
    setUrlName(""); setUrl("");
    setPdfName(""); setFileName(""); setFileSize(0); setPageCount(undefined);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileSize(file.size);
    if (!pdfName) setPdfName(file.name.replace(/\.pdf$/i, ""));
  }

  async function handleSubmit(type: KnowledgeSourceType) {
    try {
      if (type === "text") {
        await create({ type: "text", name: textName, content: textContent });
        toast.success("Text source added.");
      } else if (type === "url") {
        await create({ type: "url", name: urlName, url });
        toast.success("Website source added.");
      } else {
        await create({ type: "pdf", name: pdfName, fileName, fileSize, pageCount });
        toast.success("PDF metadata saved.");
      }
      resetAll();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add source.");
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add knowledge source" size="md">
      <Tabs.Root defaultValue="text" variant="pills">
        <Tabs.List className="mb-6">
          <Tabs.Tab value="text">Text</Tabs.Tab>
          <Tabs.Tab value="url">Website</Tabs.Tab>
          <Tabs.Tab value="pdf">PDF</Tabs.Tab>
        </Tabs.List>

        {/* ── Text ── */}
        <Tabs.Panel value="text">
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              placeholder="e.g., Product FAQ"
              value={textName}
              onChange={(e) => setTextName(e.target.value)}
              maxLength={100}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Content</label>
              <div className="relative">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={6}
                  maxLength={50_000}
                  placeholder="Paste your content here…"
                  className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none resize-y transition-all focus:border-border-focus focus:ring-2 focus:ring-accent/20"
                />
                <span className="absolute bottom-3 right-3 text-xs text-text-muted font-mono">
                  {wordCount(textContent)} words
                </span>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => handleSubmit("text")}
              disabled={isPending || !textName.trim() || textContent.trim().length < 10}
              className="self-end"
            >
              {isPending ? <Spinner size="xs" color="white" /> : null}
              Save text source
            </Button>
          </div>
        </Tabs.Panel>

        {/* ── URL ── */}
        <Tabs.Panel value="url">
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              placeholder="e.g., Help Center"
              value={urlName}
              onChange={(e) => setUrlName(e.target.value)}
              maxLength={100}
            />
            <Input
              label="URL"
              type="url"
              placeholder="https://example.com/docs"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-text-muted -mt-2">
              Web crawling will be available in a future update. Only the URL is stored for now.
            </p>
            <Button
              variant="primary"
              onClick={() => handleSubmit("url")}
              disabled={isPending || !urlName.trim() || !url.trim()}
              className="self-end"
            >
              {isPending ? <Spinner size="xs" color="white" /> : null}
              Save URL source
            </Button>
          </div>
        </Tabs.Panel>

        {/* ── PDF ── */}
        <Tabs.Panel value="pdf">
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              placeholder="e.g., Product Manual"
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              maxLength={100}
            />

            {/* File picker — reads metadata only, no upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">PDF file</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              {fileName ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-surface-elevated">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{fileName}</p>
                    <p className="text-xs text-text-muted mt-0.5">{formatBytes(fileSize)}</p>
                  </div>
                  <button
                    onClick={() => { setFileName(""); setFileSize(0); setPageCount(undefined); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="shrink-0 ml-3 text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Remove file"
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5"><path d="M2 2l8 8M10 2l-8 8" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 h-24 rounded-lg border border-dashed border-border hover:border-border-hover bg-surface-elevated hover:bg-surface transition-all text-sm text-text-muted hover:text-text-secondary"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v-2.25A2.25 2.25 0 015.25 12h13.5A2.25 2.25 0 0121 14.25v2.25M12 3v13.5m0-13.5L8.25 6.75M12 3l3.75 3.75"/></svg>
                  Select PDF file
                </button>
              )}
              <p className="text-xs text-text-muted">
                Only metadata (filename, size) is saved. PDF processing coming in a future update.
              </p>
            </div>

            <Input
              label="Page count (optional)"
              type="number"
              placeholder="e.g., 42"
              value={pageCount ?? ""}
              onChange={(e) => setPageCount(e.target.value ? parseInt(e.target.value) : undefined)}
            />

            <Button
              variant="primary"
              onClick={() => handleSubmit("pdf")}
              disabled={isPending || !pdfName.trim() || !fileName}
              className="self-end"
            >
              {isPending ? <Spinner size="xs" color="white" /> : null}
              Save PDF metadata
            </Button>
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </Modal>
  );
}
