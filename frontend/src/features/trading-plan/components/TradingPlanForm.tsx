"use client";

import Card from "@/components/Card";

export default function TradingPlanForm({
  accountSizeInput,
  onAccountSizeChange,
  riskPercentInput,
  onRiskPercentChange,
  onSubmit,
  loading,
}: {
  accountSizeInput: string;
  onAccountSizeChange: (value: string) => void;
  riskPercentInput: string;
  onRiskPercentChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Ukuran Akun (Rp)</label>
          <input
            type="number"
            min={0}
            value={accountSizeInput}
            onChange={(e) => onAccountSizeChange(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-black backdrop-blur-sm transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-50 dark:focus:ring-zinc-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">
            Risk per Trade (% akun)
          </label>
          <input
            type="number"
            min={0.1}
            step={0.1}
            value={riskPercentInput}
            onChange={(e) => onRiskPercentChange(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2 text-black backdrop-blur-sm transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 focus:outline-none dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-50 dark:focus:ring-zinc-700"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Mengatur jumlah lot (Position Sizing), bukan level Stop Loss — SL dihitung teknikal dari
            ATR/support.
          </p>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full rounded-full bg-black px-4 py-2 font-medium text-white shadow-md shadow-black/10 transition hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-md sm:w-auto dark:bg-zinc-50 dark:text-black dark:shadow-none"
      >
        {loading ? "Menghitung..." : "Hitung Ulang"}
      </button>
    </Card>
  );
}
