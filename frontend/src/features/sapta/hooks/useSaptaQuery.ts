"use client";

import { useQuery } from "@tanstack/react-query";
import { getSaptaAnalysis } from "../api";

export const saptaKeys = {
  detail: (ticker: string) => ["sapta", ticker] as const,
};

export function useSaptaQuery(ticker: string) {
  return useQuery({
    queryKey: saptaKeys.detail(ticker),
    queryFn: () => getSaptaAnalysis(ticker),
  });
}
