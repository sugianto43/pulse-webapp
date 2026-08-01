"use client";

import { useQuery } from "@tanstack/react-query";
import { getPrediction } from "../api";

export const predictionKeys = {
  detail: (ticker: string) => ["prediction", ticker] as const,
};

export function usePredictionQuery(ticker: string) {
  return useQuery({
    queryKey: predictionKeys.detail(ticker),
    queryFn: () => getPrediction(ticker),
  });
}
