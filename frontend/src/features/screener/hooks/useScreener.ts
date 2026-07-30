"use client";

import { useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { useScreenMutation } from "./useScreenMutation";
import { useScreenPresetsQuery } from "./useScreenPresetsQuery";

export function useScreener() {
  const [universe, setUniverse] = useState("lq45");
  const [preset, setPreset] = useState("oversold");
  const [useCustom, setUseCustom] = useState(false);
  const [criteria, setCriteria] = useState("");
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const startRef = useRef(0);

  const presetsQuery = useScreenPresetsQuery();

  const screenMutation = useScreenMutation();
  const { mutate } = screenMutation;

  function runScreen() {
    startRef.current = performance.now();
    mutate(
      {
        universe,
        preset: useCustom ? undefined : preset,
        criteria: useCustom ? criteria : undefined,
      },
      { onSettled: () => setElapsedMs(performance.now() - startRef.current) },
    );
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
