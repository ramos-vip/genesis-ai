"use client";

import {
  getKnowledgeSourcesAction,
  getKnowledgeSourceAction,
  createKnowledgeSourceAction,
  deleteKnowledgeSourceAction,
} from "@/server/actions/knowledge";
import type { KnowledgeSource, CreateKnowledgeSourceDto } from "../types";

export const knowledgeService = {
  getAll:   (): Promise<KnowledgeSource[]>          => getKnowledgeSourcesAction(),
  getById:  (id: string): Promise<KnowledgeSource | null> => getKnowledgeSourceAction(id),
  create:   (dto: CreateKnowledgeSourceDto): Promise<KnowledgeSource> => createKnowledgeSourceAction(dto),
  delete:   (id: string): Promise<void>             => deleteKnowledgeSourceAction(id),
} as const;
