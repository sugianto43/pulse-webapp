"use client";

import { useEffect, useState } from "react";
import ScreenerTable from "@/components/ScreenerTable";
import {
  ApiError,
  getScreenPresets,
  screenStocks,
  type ScreenPresetInfo,
  type ScreenResult,
} from "@/lib/api";

const UNIVERSE_INFO: Record<string, string> = {
  lq45: "~45 saham — cepat",
  idx80: "~80 saham — sedang",
  popular: "~110 saham — sedang",
  all: "900+ saham — bisa lama (menit)",
};

export default function ScreenPage() {
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

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6">
      <main className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-semibold text-black dark:text-zinc-50">
          Screener Saham
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          Saring saham IDX berdasarkan preset atau kriteria custom.
        </p>

        <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-zinc-500">Universe</label>
              <select
                value={universe}
                onChange={(e) => setUniverse(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                {Object.keys(UNIVERSE_INFO).map((u) => (
                  <option key={u} value={u}>
                    {u.toUpperCase()}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-zinc-500">{UNIVERSE_INFO[universe]}</p>
            </div>

            <div>
              <label className="mb-1 flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>{useCustom ? "Kriteria custom" : "Preset"}</span>
                <button
                  type="button"
                  onClick={() => setUseCustom((v) => !v)}
                  className="text-xs text-zinc-500 underline"
                >
                  {useCustom ? "pakai preset" : "pakai custom"}
                </button>
              </label>
              {useCustom ? (
                <input
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  placeholder="mis. rsi<30 and volume>1000000"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                />
              ) : (
                <select
                  value={preset}
                  onChange={(e) => setPreset(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                >
                  {presets.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.value} — {p.description}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <button
            onClick={runScreen}
            disabled={loading || (useCustom && !criteria.trim())}
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-black sm:w-auto"
          >
            {loading ? "Scanning..." : "Scan"}
          </button>
        </div>

        <div className="mt-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          {!error && elapsedMs != null && (
            <p className="mb-3 text-xs text-zinc-500">
              {results?.length ?? 0} hasil dalam {(elapsedMs / 1000).toFixed(2)}s
              {cached ? " (dari cache)" : ""}
            </p>
          )}

          {!error && results && <ScreenerTable data={results} />}
        </div>
      </main>
    </div>
  );
}
