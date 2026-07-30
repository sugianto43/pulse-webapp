"use client";

import { useQuery } from "@tanstack/react-query";
import { getScreenPresets } from "../api";

export const screenerKeys = {
  presets: ["screener", "presets"] as const,
};

export function useScreenPresetsQuery() {
  return useQuery({
    queryKey: screenerKeys.presets,
    queryFn: getScreenPresets,
    staleTime: Infinity,
  });
}
