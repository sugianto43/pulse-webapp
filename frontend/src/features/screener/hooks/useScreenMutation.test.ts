import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api-client";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import type { ScreenResponse } from "../types";
import { useScreenMutation } from "./useScreenMutation";

vi.mock("../api");

const RESPONSE: ScreenResponse = { cached: false, count: 0, results: [] };

describe("useScreenMutation", () => {
  it("forwards params with a fixed limit of 30", async () => {
    vi.mocked(api.screenStocks).mockResolvedValue(RESPONSE);

    const { result } = renderHook(() => useScreenMutation(), {
      wrapper: createQueryClientWrapper(),
    });

    act(() => {
      result.current.mutate({ universe: "lq45", preset: "oversold" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.screenStocks).toHaveBeenCalledWith({
      universe: "lq45",
      preset: "oversold",
      limit: 30,
    });
  });

  it("surfaces ApiError on failure", async () => {
    vi.mocked(api.screenStocks).mockRejectedValue(new ApiError(400, "Kriteria tidak valid"));

    const { result } = renderHook(() => useScreenMutation(), {
      wrapper: createQueryClientWrapper(),
    });

    act(() => {
      result.current.mutate({ universe: "lq45", criteria: "rsi<invalid" });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(ApiError);
    expect((result.current.error as ApiError).message).toBe("Kriteria tidak valid");
  });
});
