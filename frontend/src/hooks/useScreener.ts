"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  getScreenPresets,
  screenStocks,
  type ScreenPresetInfo,
  type ScreenResult,
} from "@/lib/api";

export function useScreener() {
  const [universe, setUniverse] = useState("lq45");
  const [presets, setPresets] = useState<ScreenPresetInfo[]>([]);
  const [preset, setPreset] = useState("oversold");
  const [useCustom, setUseCustom] = useState(false);
  const [criteria, setCriteria] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScreenResult[] | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [cached, setCached] = useState(false);

  useEffect(() => {
    getScreenPresets()
      .then((data) => setPresets(data.presets))
      .catch(() => setPresets([]));
  }, []);

  async function runScreen() {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const data = await screenStocks({
        universe,
        preset: useCustom ? undefined : preset,
        criteria: useCustom ? criteria : undefined,
        limit: 30,
      });
      setResults(data.results);
      setCached(data.cached);
    } catch (err) {
      setResults(null);
      setError(err instanceof ApiError ? err.message : "Terjadi kesalahan tak terduga.");
    } finally {
      setElapsedMs(performance.now() - start);
      setLoading(false);
    }
  }

  return {
    universe,
    setUniverse,
    presets,
    preset,
    setPreset,
    useCustom,
    setUseCustom,
    criteria,
    setCriteria,
    loading,
    error,
    results,
    elapsedMs,
    cached,
    runScreen,
  };
}
