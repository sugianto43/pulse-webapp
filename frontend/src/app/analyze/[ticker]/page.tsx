import IndicatorPanel from "@/components/IndicatorPanel";
import PriceChart from "@/components/PriceChart";
import SearchBox from "@/components/SearchBox";
import { ApiError, analyzeTicker } from "@/lib/api";

export default async function AnalyzePage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;

  let data;
  try {
    data = await analyzeTicker(ticker);
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Terjadi kesalahan tak terduga.";
    return (
      <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6">
        <main className="mx-auto max-w-3xl">
          <SearchBox initial={ticker} />
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {message}
          </div>
        </main>
      </div>
    );
  }

  const { price, indicators } = data;
  const isUp = price.change >= 0;

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6">
      <main className="mx-auto max-w-3xl">
        <SearchBox initial={ticker} />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
              {price.ticker}
            </h1>
            {price.name && <p className="text-sm text-zinc-500">{price.name}</p>}
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-black dark:text-zinc-50">
              {price.current_price.toLocaleString("id-ID")}
            </div>
            <div
              className={
                isUp
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              }
            >
              {isUp ? "+" : ""}
              {price.change.toLocaleString("id-ID")} ({price.change_percent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900 sm:p-4">
          <PriceChart history={price.history} />
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <IndicatorPanel indicators={indicators} currentPrice={price.current_price} />
        </div>
      </main>
    </div>
  );
}
