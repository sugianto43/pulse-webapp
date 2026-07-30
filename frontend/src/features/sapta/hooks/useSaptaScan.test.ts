import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api-client";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import { useSaptaScan } from "./useSaptaScan";

vi.mock("../api");

describe("useSaptaScan", () => {
  it("defaults to lq45/watchlist", () => {
    const { result } = renderHook(() => useSaptaScan(), { wrapper: createQueryClientWrapper() });

    expect(result.current.universe).toBe("lq45");
    expect(result.current.minStatus).toBe("watchlist");
    expect(result.current.results).toBeNull();
  });

  it("runScan forwards the selected universe/minStatus with a fixed limit", async () => {
    vi.mocked(api.scanSapta).mockResolvedValue({ cached: false, count: 0, results: [] });

    const { result } = renderHook(() => useSaptaScan(), { wrapper: createQueryClientWrapper() });

    act(() => result.current.setUniverse("idx80"));
    act(() => result.current.setMinStatus("siap"));
    act(() => result.current.runScan());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(api.scanSapta).toHaveBeenCalledWith({
      universe: "idx80",
      minStatus: "siap",
      limit: 30,
    });
  });

  it("maps a failed scan into a readable error message", async () => {
    vi.mocked(api.scanSapta).mockRejectedValue(new ApiError(400, "Universe tidak valid"));

    const { result } = renderHook(() => useSaptaScan(), { wrapper: createQueryClientWrapper() });

    act(() => result.current.runScan());

    await waitFor(() => expect(result.current.error).toBe("Universe tidak valid"));
    expect(result.current.results).toBeNull();
  });
});
