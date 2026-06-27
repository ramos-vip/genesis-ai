import type { ID, ISODate } from "@/shared/types";

/* ─── Source types ────────────────────────────────────────────────────────── */

export type KnowledgeSourceType   = "text" | "url" | "pdf";
export type KnowledgeSourceStatus = "ready" | "processing" | "error";

/* ─── Typed metadata shapes (discriminated by source type) ───────────────── */

export interface TextMeta {
  content:   string;
  wordCount: number;
}

export interface UrlMeta {
  url: string;
}

export interface PdfMeta {
  fileName:   string;
  /** Raw byte size */
  fileSize:   number;
  pageCount?: number;
}

export type KnowledgeMeta = TextMeta | UrlMeta | PdfMeta;

/* ─── Domain entity ───────────────────────────────────────────────────────── */

export interface KnowledgeSource {
  id:         ID;
  name:       string;
  type:       KnowledgeSourceType;
  status:     KnowledgeSourceStatus;
  meta:       KnowledgeMeta;
  /** Populated in embeddings sprint — null until then */
  chunkCount?: number;
  createdAt:  ISODate;
  updatedAt:  ISODate;
}

/* ─── DTOs ────────────────────────────────────────────────────────────────── */

export type CreateKnowledgeSourceDto =
  | { type: "text"; name: string; content: string }
  | { type: "url";  name: string; url: string }
  | { type: "pdf";  name: string; fileName: string; fileSize: number; pageCount?: number };

export type DeleteKnowledgeSourceDto = { id: string };
