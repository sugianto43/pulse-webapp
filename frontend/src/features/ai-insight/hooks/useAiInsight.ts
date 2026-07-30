"use client";

import { useQuery } from "@tanstack/react-query";
import { getAiInsight } from "../api";
import type { AiInsightRequest } from "../types";

export function useAiInsight(request: AiInsightRequest) {
  return useQuery({
    queryKey: ["ai-insight", request.ticker],
    queryFn: () => getAiInsight(request),
    staleTime: 60 * 60 * 1000, // matches server-side cache TTL
    retry: false,
  });
}
