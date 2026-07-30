"use client";

import { useMutation } from "@tanstack/react-query";
import { scanSapta } from "../api";

export function useSaptaScanMutation() {
  return useMutation({
    mutationFn: (params: { universe: string; minStatus: string }) =>
      scanSapta({ ...params, limit: 30 }),
  });
}
