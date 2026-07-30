"use client";

import { useQuery } from "@tanstack/react-query";
import { getTradingPlan } from "../api";

export const tradingPlanKeys = {
  detail: (ticker: string, accountSize: number, riskPercent: number) =>
    ["trading-plan", ticker, accountSize, riskPercent] as const,
};

export function useTradingPlanQuery(ticker: string, accountSize: number, riskPercent: number) {
  return useQuery({
    queryKey: tradingPlanKeys.detail(ticker, accountSize, riskPercent),
    queryFn: () => getTradingPlan(ticker, accountSize, riskPercent),
  });
}
