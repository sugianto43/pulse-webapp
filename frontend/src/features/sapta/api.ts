import { apiFetch } from "@/lib/api-client";
import type { SaptaResult, SaptaScanResponse } from "./types";

export async function getSaptaAnalysis(ticker: string): Promise<SaptaResult> {
  return apiFetch<SaptaResult>(
    `/api/sapta/${encodeURIComponent(ticker)}`,
    `Gagal memuat skor SAPTA untuk "${ticker}".`,
  );
}

export async function scanSapta(params: {
  universe: string;
  minStatus?: string;
  limit?: number;
}): Promise<SaptaScanResponse> {
  const query = new URLSearchParams({ universe: params.universe });
  if (params.minStatus) query.set("min_status", params.minStatus);
  if (params.limit) query.set("limit", String(params.limit));

  return apiFetch<SaptaScanResponse>(
    `/api/sapta/scan?${query.toString()}`,
    "Gagal menjalankan scan SAPTA.",
  );
}
