"use server";

import { auth } from "@clerk/nextjs/server";
import { knowledgeRepository }  from "@/server/repositories/knowledgeRepository";
import { chunkRepository }      from "@/server/repositories/chunkRepository";
import { ChunkingPipeline }     from "@/server/ai/chunker";
import { createKnowledgeSourceSchema } from "@/server/validation/knowledge";
import type { KnowledgeSource, CreateKnowledgeSourceDto } from "@/modules/knowledge/types";

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getKnowledgeSourcesAction(): Promise<KnowledgeSource[]> {
  const userId = await requireUserId();
  return knowledgeRepository.findAll(userId);
}

export async function getKnowledgeSourceAction(id: string): Promise<KnowledgeSource | null> {
  const userId = await requireUserId();
  return knowledgeRepository.findById(userId, id);
}

export async function createKnowledgeSourceAction(
  dto: CreateKnowledgeSourceDto
): Promise<KnowledgeSource> {
  const userId = await requireUserId();

  const parsed = createKnowledgeSourceSchema.safeParse(dto);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid knowledge source data");
  }

  const created = await knowledgeRepository.create(userId, parsed.data);

  /* ── Chunking pipeline — text sources only ──────────────────────────────── */
  if (parsed.data.type === "text") {
    try {
      const pipeline = new ChunkingPipeline();
      await pipeline.process(created);
    } catch (err) {
      // Chunking failure is non-fatal — source is usable without chunks.
      // PromptBuilder falls back to full meta.content injection.
      console.error("[chunking] Pipeline failed for source", created.id, err);
    }
  }

  return created;
}

export async function deleteKnowledgeSourceAction(id: string): Promise<void> {
  const userId = await requireUserId();

  // Remove chunks before deleting the source (no DB-level cascade constraint)
  await chunkRepository.deleteBySourceId(id);

  return knowledgeRepository.delete(userId, id);
}
