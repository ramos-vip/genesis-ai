"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants";
import { knowledgeService } from "../services/knowledgeService";
import type { CreateKnowledgeSourceDto } from "../types";

export function useKnowledgeSources() {
  return useQuery({
    queryKey: queryKeys.knowledge.list(),
    queryFn:  () => knowledgeService.getAll(),
    staleTime: 30_000,
  });
}

export function useCreateKnowledgeSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateKnowledgeSourceDto) => knowledgeService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.all() });
    },
  });
}

export function useDeleteKnowledgeSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => knowledgeService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledge.all() });
    },
  });
}
