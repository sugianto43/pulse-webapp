"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { ApiError, getScreenPresets, screenStocks } from "@/lib/api";

export function useScreener() {
  const [universe, setUniverse] = useState("lq45");
  const [preset, setPreset] = useState("oversold");
  const [useCustom, setUseCustom] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const startRef = useRef(0);

  const presetsQuery = useQuery({
    queryKey: ["screen-presets"],
    queryFn: getScreenPresets,
    staleTime: Infinity,
  });

  const screenMutation = useMutation({
    mutationFn: (vars: { universe: string; preset?: string; criteria?: string }) =>
      screenStocks({ ...vars, limit: 30 }),
    onMutate: () => {
      startRef.current = performance.now();
    },
    onSettled: () => {
      setElapsedMs(performance.now() - startRef.current);
    },
  });

  function runScreen() {
    screenMutation.mutate({
      universe,
      preset: useCustom ? undefined : preset,
      criteria: useCustom ? criteria : undefined,
    });
  }

  let error: string | null = null;
  if (screenMutation.isError) {
    error =
      screenMutation.error instanceof ApiError
        ? screenMutation.error.message
        : "Terjadi kesalahan tak terduga.";
  }

  return {
    universe,
    setUniverse,
    presets: presetsQuery.data?.presets ?? [],
    preset,
    setPreset,
    useCustom,
    setUseCustom,
    criteria,
    setCriteria,
    loading: screenMutation.isPending,
    error,
    results: screenMutation.isError ? null : (screenMutation.data?.results ?? null),
    elapsedMs,
    cached: screenMutation.data?.cached ?? false,
    runScreen,
  };
}
