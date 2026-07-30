import { apiFetch } from "@/lib/api-client";
import type { ScreenParams, ScreenPresetsResponse, ScreenResponse } from "./types";

export async function getScreenPresets(): Promise<ScreenPresetsResponse> {
  return apiFetch<ScreenPresetsResponse>(
    "/api/screen/presets",
    "Gagal memuat daftar preset screener.",
  );
}

export async function screenStocks(
  params: ScreenParams & { limit?: number },
): Promise<ScreenResponse> {
  const query = new URLSearchParams({ universe: params.universe });
  if (params.preset) query.set("preset", params.preset);
  if (params.criteria) query.set("criteria", params.criteria);
  if (params.limit) query.set("limit", String(params.limit));

  return apiFetch<ScreenResponse>(
    `/api/screen?${query.toString()}`,
    "Gagal menjalankan screening.",
  );
}
