import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import type { PredictionResult } from "../types";
import { usePredictionQuery } from "./usePredictionQuery";

vi.mock("../api");

function makePredictionResult(overrides: Partial<PredictionResult> = {}): PredictionResult {
  return {
    ticker: "BBCA",
    predicted_action: "Buy",
    confidence: 0.55,
    probabilities: { Buy: 0.55, Hold: 0.3, Sell: 0.15 },
    as_of_date: "2026-01-01",
    model_version: "1.0.0",
    backtest_accuracy: 0.41,
    backtest_macro_f1: 0.37,
    confidence_threshold: 0.5,
    is_actionable: true,
    backtest_win_rate: 0.45,
    backtest_avg_return_pct: 0.3,
    backtest_max_drawdown_pct: 12.5,
    backtest_sharpe_annualized: 0.8,
    ticker_backtest_trades: 8,
    ticker_backtest_win_rate: 0.5,
    ticker_backtest_avg_return_pct: 0.4,
    ...overrides,
  };
}

describe("usePredictionQuery", () => {
  it("fetches the prediction for the given ticker", async () => {
    const result = makePredictionResult();
    vi.mocked(api.getPrediction).mockResolvedValue(result);

    const { result: hook } = renderHook(() => usePredictionQuery("BBCA"), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(hook.current.isSuccess).toBe(true));

    expect(api.getPrediction).toHaveBeenCalledWith("BBCA");
    expect(hook.current.data?.predicted_action).toBe("Buy");
  });
});
