import { apiFetch } from "@/lib/api-client";
import type { PredictionResult } from "./types";

export async function getPrediction(ticker: string): Promise<PredictionResult> {
  return apiFetch<PredictionResult>(
    `/api/predict/${encodeURIComponent(ticker)}`,
    `Gagal memuat prediksi untuk "${ticker}".`,
  );
}
