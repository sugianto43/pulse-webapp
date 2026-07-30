import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import type { SaptaResult } from "../types";
import { useSaptaQuery } from "./useSaptaQuery";

vi.mock("../api");

function makeSaptaResult(overrides: Partial<SaptaResult> = {}): SaptaResult {
  return {
    ticker: "BBCA",
    timeframe: "D",
    analyzed_at: "2026-01-01T00:00:00",
    final_score: 72,
    score_pct: 72,
    max_possible_score: 100,
    status: "SIAP",
    confidence: "MEDIUM",
    ml_probability: null,
    projected_breakout_window: null,
    projected_dates: null,
    days_to_window: null,
    wave_phase: null,
    fib_retracement: null,
    notes: [],
    reasons: [],
    warnings: [],
    penalties: [],
    penalty_score: 0,
    modules: {
      absorption: null,
      compression: null,
      bb_squeeze: null,
      elliott: null,
      time_projection: null,
      anti_distribution: null,
    },
    ...overrides,
  };
}

describe("useSaptaQuery", () => {
  it("fetches sapta analysis for the given ticker", async () => {
    const result = makeSaptaResult();
    vi.mocked(api.getSaptaAnalysis).mockResolvedValue(result);

    const { result: hook } = renderHook(() => useSaptaQuery("BBCA"), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(hook.current.isSuccess).toBe(true));

    expect(api.getSaptaAnalysis).toHaveBeenCalledWith("BBCA");
    expect(hook.current.data?.status).toBe("SIAP");
  });
});
