"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLinkedKnowledgeAction,
  getAvailableKnowledgeAction,
  linkKnowledgeAction,
  unlinkKnowledgeAction,
} from "@/server/actions/employeeKnowledge";

/** Stable query key factories — scoped under the employee detail cache */
const linkedKey    = (employeeId: string) => ["employees", employeeId, "knowledge"]           as const;
const availableKey = (employeeId: string) => ["employees", employeeId, "knowledge-available"] as const;

export function useLinkedKnowledge(employeeId: string) {
  return useQuery({
    queryKey: linkedKey(employeeId),
    queryFn:  () => getLinkedKnowledgeAction(employeeId),
    enabled:  !!employeeId,
    staleTime: 30_000,
  });
}

export function useAvailableKnowledge(employeeId: string) {
  return useQuery({
    queryKey: availableKey(employeeId),
    queryFn:  () => getAvailableKnowledgeAction(employeeId),
    enabled:  !!employeeId,
    staleTime: 30_000,
  });
}

export function useLinkKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, knowledgeSourceId }: { employeeId: string; knowledgeSourceId: string }) =>
      linkKnowledgeAction(employeeId, knowledgeSourceId),
    onSuccess: (_, { employeeId }) => {
      queryClient.invalidateQueries({ queryKey: linkedKey(employeeId) });
      queryClient.invalidateQueries({ queryKey: availableKey(employeeId) });
    },
  });
}

export function useUnlinkKnowledge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, knowledgeSourceId }: { employeeId: string; knowledgeSourceId: string }) =>
      unlinkKnowledgeAction(employeeId, knowledgeSourceId),
    onSuccess: (_, { employeeId }) => {
      queryClient.invalidateQueries({ queryKey: linkedKey(employeeId) });
      queryClient.invalidateQueries({ queryKey: availableKey(employeeId) });
    },
  });
}
