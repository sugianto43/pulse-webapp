import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api-client";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import type { ScreenResponse } from "../types";
import { useScreener } from "./useScreener";

vi.mock("../api");

describe("useScreener", () => {
  it("defaults to lq45/oversold preset mode", () => {
    vi.mocked(api.getScreenPresets).mockResolvedValue({ presets: [], universes: [] });

    const { result } = renderHook(() => useScreener(), { wrapper: createQueryClientWrapper() });

    expect(result.current.universe).toBe("lq45");
    expect(result.current.preset).toBe("oversold");
    expect(result.current.useCustom).toBe(false);
    expect(result.current.results).toBeNull();
  });

  it("runScreen uses the preset (not criteria) when useCustom is false", async () => {
    vi.mocked(api.getScreenPresets).mockResolvedValue({ presets: [], universes: [] });
    const response: ScreenResponse = { cached: false, count: 1, results: [] };
    vi.mocked(api.screenStocks).mockResolvedValue(response);

    const { result } = renderHook(() => useScreener(), { wrapper: createQueryClientWrapper() });

    act(() => result.current.runScreen());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(api.screenStocks).toHaveBeenCalledWith({
      universe: "lq45",
      preset: "oversold",
      criteria: undefined,
      limit: 30,
    });
    expect(result.current.results).toEqual([]);
  });

  it("runScreen uses criteria (not preset) once useCustom is toggled on", async () => {
    vi.mocked(api.getScreenPresets).mockResolvedValue({ presets: [], universes: [] });
    vi.mocked(api.screenStocks).mockResolvedValue({ cached: false, count: 0, results: [] });

    const { result } = renderHook(() => useScreener(), { wrapper: createQueryClientWrapper() });

    act(() => result.current.setUseCustom(true));
    act(() => result.current.setCriteria("rsi<30"));
    act(() => result.current.runScreen());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(api.screenStocks).toHaveBeenCalledWith({
      universe: "lq45",
      preset: undefined,
      criteria: "rsi<30",
      limit: 30,
    });
  });

  it("maps a failed screen into a readable error message", async () => {
    vi.mocked(api.getScreenPresets).mockResolvedValue({ presets: [], universes: [] });
    vi.mocked(api.screenStocks).mockRejectedValue(new ApiError(400, "Universe tidak valid"));

    const { result } = renderHook(() => useScreener(), { wrapper: createQueryClientWrapper() });

    act(() => result.current.runScreen());

    await waitFor(() => expect(result.current.error).toBe("Universe tidak valid"));

    expect(result.current.results).toBeNull();
  });
});
