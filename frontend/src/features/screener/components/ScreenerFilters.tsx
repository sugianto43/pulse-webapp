"use client";

import type { ScreenPresetInfo } from "../types";

const UNIVERSE_INFO: Record<string, string> = {
  lq45: "~45 saham — cepat",
  idx80: "~80 saham — sedang",
  popular: "~110 saham — sedang",
  all: "900+ saham — bisa lama (menit)",
};

export default function ScreenerFilters({
  universe,
  onUniverseChange,
  preset,
  onPresetChange,
  presets,
  useCustom,
  onToggleCustom,
  criteria,
  onCriteriaChange,
  onSubmit,
  loading,
}: {
  universe: string;
  onUniverseChange: (value: string) => void;
  preset: string;
  onPresetChange: (value: string) => void;
  presets: ScreenPresetInfo[];
  useCustom: boolean;
  onToggleCustom: () => void;
  criteria: string;
  onCriteriaChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Universe</label>
          <select
            value={universe}
            onChange={(e) => onUniverseChange(e.target.value)}
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
              onClick={onToggleCustom}
              className="text-xs text-zinc-500 underline"
            >
              {useCustom ? "pakai preset" : "pakai custom"}
            </button>
          </label>
          {useCustom ? (
            <input
              value={criteria}
              onChange={(e) => onCriteriaChange(e.target.value)}
              placeholder="mis. rsi<30 and volume>1000000"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          ) : (
            <select
              value={preset}
              onChange={(e) => onPresetChange(e.target.value)}
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
        onClick={onSubmit}
        disabled={loading || (useCustom && !criteria.trim())}
        className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50 sm:w-auto dark:bg-zinc-50 dark:text-black"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>
    </div>
  );
}
