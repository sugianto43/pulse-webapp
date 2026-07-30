import { apiFetch } from "@/lib/api-client";
import type { TradingPlanResponse } from "./types";

export async function getTradingPlan(
  ticker: string,
  accountSize: number,
  riskPercent: number,
): Promise<TradingPlanResponse> {
  const query = new URLSearchParams({
    account_size: String(accountSize),
    risk_percent: String(riskPercent),
  });

  return apiFetch<TradingPlanResponse>(
    `/api/plan/${encodeURIComponent(ticker)}?${query.toString()}`,
    `Gagal membuat trading plan untuk "${ticker}".`,
  );
}
