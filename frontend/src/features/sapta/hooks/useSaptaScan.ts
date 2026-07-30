"use client";

import { useRef, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { useSaptaScanMutation } from "./useSaptaScanMutation";

export function useSaptaScan() {
  const [universe, setUniverse] = useState("lq45");
  const [minStatus, setMinStatus] = useState("watchlist");
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const startRef = useRef(0);

  const scanMutation = useSaptaScanMutation();
  const { mutate } = scanMutation;

  function runScan() {
    startRef.current = performance.now();
    mutate(
      { universe, minStatus },
      { onSettled: () => setElapsedMs(performance.now() - startRef.current) },
    );
  }

  let error: string | null = null;
  if (scanMutation.isError) {
    error =
      scanMutation.error instanceof ApiError
        ? scanMutation.error.message
        : "Terjadi kesalahan tak terduga.";
  }

  return {
    universe,
    setUniverse,
    minStatus,
    setMinStatus,
    loading: scanMutation.isPending,
    error,
    results: scanMutation.isError ? null : (scanMutation.data?.results ?? null),
    elapsedMs,
    cached: scanMutation.data?.cached ?? false,
    runScan,
  };
}
