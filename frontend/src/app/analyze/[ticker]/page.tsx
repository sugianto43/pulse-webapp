import Card from "@/components/Card";
import GlossaryAccordion from "@/components/GlossaryAccordion";
import SearchBox from "@/components/SearchBox";
import TickerNav from "@/components/TickerNav";
import { analyzeTicker } from "@/features/analyze/api";
import IndicatorPanel from "@/features/analyze/components/IndicatorPanel";
import PriceChart from "@/features/analyze/components/PriceChart";
import AiInsightCard from "@/features/ai-insight/components/AiInsightCard";
import { ApiError } from "@/lib/api-client";
import {
  MACD_TERM,
  RSI_TERM,
  SMA_TERM,
  SUPPORT_RESISTANCE_TERM,
  TREND_SIGNAL_TERM,
} from "@/lib/glossary-terms";

export default async function AnalyzePage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;

  let data;
  try {
    data = await analyzeTicker(ticker);
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Terjadi kesalahan tak terduga.";
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <main className="mx-auto max-w-3xl">
          <SearchBox initial={ticker} />
          <div className="mt-6 rounded-2xl border border-red-200/50 bg-red-50/80 p-4 text-red-700 backdrop-blur-xl dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {message}
          </div>
        </main>
      </div>
    );
  }

  const { price, indicators } = data;
  const isUp = price.change >= 0;

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <main className="mx-auto max-w-3xl">
        <SearchBox initial={ticker} />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">{price.ticker}</h1>
            {price.name && <p className="text-sm text-zinc-500">{price.name}</p>}
            <TickerNav ticker={price.ticker} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-black dark:text-zinc-50">
              {price.current_price.toLocaleString("id-ID")}
            </div>
            <div
              className={
                isUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }
            >
              {isUp ? "+" : ""}
              {price.change.toLocaleString("id-ID")} ({price.change_percent.toFixed(2)}%)
            </div>
          </div>
        </div>

        <Card className="mt-6 p-2 sm:p-4">
          <PriceChart history={price.history} />
        </Card>

        <Card className="mt-6 p-4">
          <IndicatorPanel indicators={indicators} currentPrice={price.current_price} />
        </Card>

        <div className="mt-6">
          <GlossaryAccordion
            title="Istilah Indikator Teknikal"
            terms={[RSI_TERM, MACD_TERM, SMA_TERM, SUPPORT_RESISTANCE_TERM, TREND_SIGNAL_TERM]}
          />
        </div>

        <div className="mt-6">
          <AiInsightCard
            request={{
              ticker: price.ticker,
              current_price: price.current_price,
              change_percent: price.change_percent,
              trend: indicators.trend,
              signal: indicators.signal,
              rsi_14: indicators.rsi_14,
              macd: indicators.macd,
              macd_signal: indicators.macd_signal,
              sma_20: indicators.sma_20,
              sma_50: indicators.sma_50,
              support_1: indicators.support_1,
              resistance_1: indicators.resistance_1,
            }}
          />
        </div>
      </main>
    </div>
  );
}
