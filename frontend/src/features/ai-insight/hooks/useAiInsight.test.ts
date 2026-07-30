import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import type { AiInsightRequest } from "../types";
import { useAiInsight } from "./useAiInsight";

vi.mock("../api");

const REQUEST: AiInsightRequest = {
  ticker: "BBCA",
  current_price: 9500,
  change_percent: 1.2,
  trend: "Bullish",
  signal: "Buy",
  rsi_14: 55,
  macd: 10,
  macd_signal: 8,
  sma_20: 9400,
  sma_50: 9200,
  support_1: 9300,
  resistance_1: 9700,
};

describe("useAiInsight", () => {
  it("fetches a narrative scoped to the ticker's query key", async () => {
    vi.mocked(api.getAiInsight).mockResolvedValue({ narrative: "Momentum bullish", cached: false });

    const { result } = renderHook(() => useAiInsight(REQUEST), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.getAiInsight).toHaveBeenCalledWith(REQUEST);
    expect(result.current.data?.narrative).toBe("Momentum bullish");
  });

  it("does not retry on failure", async () => {
    vi.mocked(api.getAiInsight).mockRejectedValue(new Error("rate limited"));

    const { result } = renderHook(() => useAiInsight(REQUEST), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(api.getAiInsight).toHaveBeenCalledTimes(1);
  });
});
