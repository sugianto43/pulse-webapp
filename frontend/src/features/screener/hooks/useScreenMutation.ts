"use client";

import { useMutation } from "@tanstack/react-query";
import { screenStocks } from "../api";
import type { ScreenParams } from "../types";

export function useScreenMutation() {
  return useMutation({
    mutationFn: (params: ScreenParams) => screenStocks({ ...params, limit: 30 }),
  });
}
