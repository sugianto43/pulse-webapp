import { apiFetch } from "@/lib/api-client";
import type { BrokerFlowResult } from "./types";

export async function getBrokerFlow(ticker: string): Promise<BrokerFlowResult> {
  return apiFetch<BrokerFlowResult>(
    `/api/broker/${encodeURIComponent(ticker)}`,
    `Gagal memuat broker flow untuk "${ticker}".`,
  );
}
