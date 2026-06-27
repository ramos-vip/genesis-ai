"use server";

import { auth } from "@clerk/nextjs/server";
import { knowledgeRepository }  from "@/server/repositories/knowledgeRepository";
import { chunkRepository }      from "@/server/repositories/chunkRepository";
import { embeddingRepository }  from "@/server/repositories/embeddingRepository";
import { ChunkingPipeline }     from "@/server/ai/chunker";
import { EmbeddingService }     from "@/server/ai/embeddingService";
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

  /* ── Text pipeline: chunk → embed ──────────────────────────────────────── */
  if (parsed.data.type === "text") {
    try {
      // 1. Split into chunks and persist
      await new ChunkingPipeline().process(created);

      // 2. Generate and store embeddings for every chunk
      await new EmbeddingService().generateForSource(created.id);
    } catch (err) {
      // Pipeline failure is non-fatal:
      // - PromptBuilder still injects full meta.content as fallback
      // - Embeddings can be regenerated later
      console.error("[knowledge] Pipeline failed for source", created.id, err);
    }
  }

  return created;
}

export async function deleteKnowledgeSourceAction(id: string): Promise<void> {
  const userId = await requireUserId();

  // Deletion order: embeddings → chunks → source
  // (no DB-level cascades; must be done explicitly in this order)
  await embeddingRepository.deleteBySourceId(id);
  await chunkRepository.deleteBySourceId(id);

  return knowledgeRepository.delete(userId, id);
}
