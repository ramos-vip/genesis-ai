"use server";

import { auth } from "@clerk/nextjs/server";
import { employeeKnowledgeRepository } from "@/server/repositories/employeeKnowledgeRepository";
import type { KnowledgeSource } from "@/modules/knowledge/types";

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getLinkedKnowledgeAction(employeeId: string): Promise<KnowledgeSource[]> {
  const userId = await requireUserId();
  return employeeKnowledgeRepository.getLinked(userId, employeeId);
}

export async function getAvailableKnowledgeAction(employeeId: string): Promise<KnowledgeSource[]> {
  const userId = await requireUserId();
  return employeeKnowledgeRepository.getAvailable(userId, employeeId);
}

export async function linkKnowledgeAction(
  employeeId:        string,
  knowledgeSourceId: string
): Promise<void> {
  const userId = await requireUserId();
  return employeeKnowledgeRepository.link(userId, employeeId, knowledgeSourceId);
}

export async function unlinkKnowledgeAction(
  employeeId:        string,
  knowledgeSourceId: string
): Promise<void> {
  const userId = await requireUserId();
  return employeeKnowledgeRepository.unlink(userId, employeeId, knowledgeSourceId);
}
