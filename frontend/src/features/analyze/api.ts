import { apiFetch, ApiError } from "@/lib/api-client";
import type { AnalyzeResponse } from "./types";

export async function analyzeTicker(ticker: string): Promise<AnalyzeResponse> {
  const clean = ticker.trim();
  if (!clean) {
    throw new ApiError(400, "Masukkan kode ticker terlebih dahulu.");
  }

  return apiFetch<AnalyzeResponse>(
    `/api/analyze/${encodeURIComponent(clean)}`,
    `Gagal memuat data untuk "${clean}".`
  );
}
