"use server";

import { auth } from "@clerk/nextjs/server";
import { knowledgeRepository } from "@/server/repositories/knowledgeRepository";
import { createKnowledgeSourceSchema } from "@/server/validation/knowledge";
import type { KnowledgeSource } from "@/modules/knowledge/types";
import type { CreateKnowledgeSourceDto } from "@/modules/knowledge/types";

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

  return knowledgeRepository.create(userId, parsed.data);
}

export async function deleteKnowledgeSourceAction(id: string): Promise<void> {
  const userId = await requireUserId();
  return knowledgeRepository.delete(userId, id);
}
