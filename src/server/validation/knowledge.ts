import { z } from "zod";

const textSchema = z.object({
  type:    z.literal("text"),
  name:    z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  content: z.string().min(10, "Content must be at least 10 characters").max(50_000),
});

const urlSchema = z.object({
  type: z.literal("url"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  url:  z.string().url("Enter a valid URL (include https://)"),
});

const pdfSchema = z.object({
  type:      z.literal("pdf"),
  name:      z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  fileName:  z.string().min(1).max(255),
  fileSize:  z.number().int().positive("File size must be positive"),
  pageCount: z.number().int().positive().optional(),
});

export const createKnowledgeSourceSchema = z.discriminatedUnion("type", [
  textSchema,
  urlSchema,
  pdfSchema,
]);

export type CreateKnowledgeSourceInput = z.infer<typeof createKnowledgeSourceSchema>;
