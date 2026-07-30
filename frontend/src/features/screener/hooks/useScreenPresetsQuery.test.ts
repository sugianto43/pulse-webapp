import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import { useScreenPresetsQuery } from "./useScreenPresetsQuery";

vi.mock("../api");

describe("useScreenPresetsQuery", () => {
  it("returns presets on success", async () => {
    vi.mocked(api.getScreenPresets).mockResolvedValue({
      presets: [{ value: "oversold", description: "RSI < 30" }],
      universes: ["lq45"],
    });

    const { result } = renderHook(() => useScreenPresetsQuery(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.presets).toEqual([{ value: "oversold", description: "RSI < 30" }]);
  });
});
