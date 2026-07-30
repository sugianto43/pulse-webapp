"use client";

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
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-500">Ukuran Akun (Rp)</label>
          <input
            type="number"
            min={0}
            value={accountSizeInput}
            onChange={(e) => onAccountSizeChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
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
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
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
        className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white disabled:opacity-50 sm:w-auto dark:bg-zinc-50 dark:text-black"
      >
        {loading ? "Menghitung..." : "Hitung Ulang"}
      </button>
    </div>
  );
}
