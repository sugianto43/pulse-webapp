import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api-client";
import { createQueryClientWrapper } from "@/test/react-query";
import * as api from "../api";
import type { BrokerFlowResult } from "../types";
import { useBrokerFlowQuery } from "./useBrokerFlowQuery";

vi.mock("../api");

describe("useBrokerFlowQuery", () => {
  it("fetches broker flow for the given ticker", async () => {
    const response = { ticker: "BBCA", flow_momentum_score: 70 } as BrokerFlowResult;
    vi.mocked(api.getBrokerFlow).mockResolvedValue(response);

    const { result } = renderHook(() => useBrokerFlowQuery("BBCA"), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.getBrokerFlow).toHaveBeenCalledWith("BBCA");
    expect(result.current.data?.flow_momentum_score).toBe(70);
  });

  it("does not retry on failure (503 without a Stockbit token is expected, not transient)", async () => {
    vi.mocked(api.getBrokerFlow).mockRejectedValue(new ApiError(503, "Token belum tersedia"));

    const { result } = renderHook(() => useBrokerFlowQuery("BBCA"), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(api.getBrokerFlow).toHaveBeenCalledTimes(1);
  });
});
