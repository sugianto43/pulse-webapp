import axios from "axios";
import { ApiError } from "@/lib/api-client";
import type { AiInsightRequest, AiInsightResponse } from "./types";

/**
 * Calls our own Next.js API route (same-origin), NOT the FastAPI backend —
 * this is the one feature that talks to an LLM directly from Next.js so the
 * API key stays server-side. Deliberately bypasses lib/api-client's axios
 * instance, which is baseURL'd to the FastAPI backend.
 */
export async function getAiInsight(payload: AiInsightRequest): Promise<AiInsightResponse> {
  try {
    const response = await axios.post<AiInsightResponse>("/api/ai-insight", payload);
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const detail = err.response.data?.detail;
      throw new ApiError(
        err.response.status,
        typeof detail === "string" ? detail : "Gagal membuat AI insight.",
      );
    }
    throw new ApiError(503, "Tidak bisa menghubungi server. Coba lagi nanti.");
  }
}
