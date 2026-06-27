"use client";

import { useQuery } from "@tanstack/react-query";
import { getOnboardingStatusAction } from "@/server/actions/onboarding";
import type { OnboardingStatus } from "@/server/actions/onboarding";

export type { OnboardingStatus };

/**
 * Fetches onboarding status with staleTime: 0 so the dashboard always
 * reflects the latest state when remounted after completing a step.
 */
export function useOnboardingStatus() {
  return useQuery({
    queryKey:       ["onboarding", "status"],
    queryFn:        () => getOnboardingStatusAction(),
    staleTime:      0,
    refetchOnMount: "always",
  });
}
