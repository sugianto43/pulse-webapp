"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrokerFlow } from "../api";

export const brokerKeys = {
  detail: (ticker: string) => ["broker", ticker] as const,
};

export function useBrokerFlowQuery(ticker: string) {
  return useQuery({
    queryKey: brokerKeys.detail(ticker),
    queryFn: () => getBrokerFlow(ticker),
    retry: false,
  });
}
