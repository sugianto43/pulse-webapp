import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api-client";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import { useTradingPlan } from "./useTradingPlan";

vi.mock("../api");

describe("useTradingPlan", () => {
  it("fetches a plan on mount using default account size/risk percent", async () => {
    vi.mocked(api.getTradingPlan).mockResolvedValue({
      ticker: "BBCA",
      plan: {} as never,
      position_sizing: null,
    });

    renderHook(() => useTradingPlan("BBCA"), { wrapper: createQueryClientWrapper() });

    await waitFor(() => expect(api.getTradingPlan).toHaveBeenCalledWith("BBCA", 100_000_000, 2));
  });

  it("applyInputs re-fetches with the parsed account size/risk percent", async () => {
    vi.mocked(api.getTradingPlan).mockResolvedValue({
      ticker: "BBCA",
      plan: {} as never,
      position_sizing: null,
    });

    const { result } = renderHook(() => useTradingPlan("BBCA"), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setAccountSizeInput("50000000"));
    act(() => result.current.setRiskPercentInput("1"));
    act(() => result.current.applyInputs());

    await waitFor(() => expect(api.getTradingPlan).toHaveBeenCalledWith("BBCA", 50_000_000, 1));
  });

  it("falls back to defaults when input parses to a non-positive number", async () => {
    vi.mocked(api.getTradingPlan).mockResolvedValue({
      ticker: "BBCA",
      plan: {} as never,
      position_sizing: null,
    });

    const { result } = renderHook(() => useTradingPlan("BBCA"), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.setAccountSizeInput("not-a-number"));
    act(() => result.current.applyInputs());

    await waitFor(() =>
      expect(api.getTradingPlan).toHaveBeenLastCalledWith("BBCA", 100_000_000, 2),
    );
  });

  it("maps a failed fetch into a readable error message", async () => {
    vi.mocked(api.getTradingPlan).mockRejectedValue(new ApiError(404, "Ticker tidak ditemukan"));

    const { result } = renderHook(() => useTradingPlan("NOTREAL"), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBe("Ticker tidak ditemukan"));
    expect(result.current.data).toBeNull();
  });
});
