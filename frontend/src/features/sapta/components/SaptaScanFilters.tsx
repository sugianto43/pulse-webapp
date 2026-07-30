"use client";

import Card from "@/components/Card";

export const SAPTA_UNIVERSE_INFO: Record<string, string> = {
  lq45: "~45 saham — cepat",
  idx80: "~80 saham — sedang",
  popular: "~110 saham — sedang",
  all: "900+ saham — bisa lama (menit)",
};

const MIN_STATUS_OPTIONS = [
  { value: "watchlist", label: "Watchlist ke atas" },
  { value: "siap", label: "Siap ke atas" },
  { value: "pre_markup", label: "Pre-Markup saja" },
];

export default function SaptaScanFilters({
  universe,
  onUniverseChange,
  minStatus,
  onMinStatusChange,
  onSubmit,
  loading,
}: {
  universe: string;
  onUniverseChange: (value: string) => void;
  minStatus: string;
  onMinStatusChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Universe</label>
          <select
            value={universe}
            onChange={(e) => onUniverseChange(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-black backdrop-blur-sm transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-50 dark:focus:ring-zinc-700"
          >
            {Object.keys(SAPTA_UNIVERSE_INFO).map((u) => (
              <option key={u} value={u}>
                {u.toUpperCase()}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-zinc-500">{SAPTA_UNIVERSE_INFO[universe]}</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Status Minimum</label>
          <select
            value={minStatus}
            onChange={(e) => onMinStatusChange(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-black backdrop-blur-sm transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-50 dark:focus:ring-zinc-700"
          >
            {MIN_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full rounded-full bg-black px-4 py-2 font-medium text-white shadow-md shadow-black/10 transition hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-md sm:w-auto dark:bg-zinc-50 dark:text-black dark:shadow-none"
      >
        {loading ? "Scanning..." : "Scan"}
      </button>
    </Card>
  );
}
