import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import type { TradingPlanResponse } from "../types";
import { useTradingPlanQuery } from "./useTradingPlanQuery";

vi.mock("../api");

const RESPONSE: TradingPlanResponse = {
  ticker: "BBCA",
  plan: {
    ticker: "BBCA",
    generated_at: "2026-01-01T00:00:00",
    entry_price: 9500,
    entry_type: "market",
    tp1: 9800,
    tp1_percent: 3.16,
    tp2: null,
    tp2_percent: null,
    tp3: null,
    tp3_percent: null,
    stop_loss: 9300,
    stop_loss_percent: -2.1,
    stop_loss_method: "hybrid",
    risk_amount: 200,
    reward_tp1: 300,
    reward_tp2: null,
    rr_ratio_tp1: 1.5,
    rr_ratio_tp2: null,
    trade_quality: "Good",
    confidence: 70,
    validity: "Swing",
    suggested_risk_percent: 2,
    trend: "Bullish",
    signal: "Buy",
    rsi: 55,
    atr: 100,
    support_1: 9300,
    support_2: 9100,
    resistance_1: 9800,
    resistance_2: 10000,
    notes: [],
    execution_strategy: [],
  },
  position_sizing: null,
};

describe("useTradingPlanQuery", () => {
  it("fetches a plan scoped by ticker/accountSize/riskPercent", async () => {
    vi.mocked(api.getTradingPlan).mockResolvedValue(RESPONSE);

    const { result } = renderHook(() => useTradingPlanQuery("BBCA", 100_000_000, 2), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.getTradingPlan).toHaveBeenCalledWith("BBCA", 100_000_000, 2);
    expect(result.current.data?.plan.entry_price).toBe(9500);
  });
});
