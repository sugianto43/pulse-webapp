import type { TechnicalIndicators } from "@/lib/api";

type Status = "bullish" | "bearish" | "neutral";

const BADGE_CLASS: Record<Status, string> = {
  bullish: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  bearish: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-400",
};

function rsiStatus(rsi: number | null): Status {
  if (rsi == null) return "neutral";
  if (rsi < 30) return "bullish";
  if (rsi > 70) return "bearish";
  return "neutral";
}

function macdStatus(macd: number | null, signal: number | null): Status {
  if (macd == null || signal == null) return "neutral";
  return macd > signal ? "bullish" : "bearish";
}

function priceVsStatus(price: number, level: number | null): Status {
  if (level == null) return "neutral";
  return price > level ? "bullish" : "bearish";
}

function trendStatus(trend: string): Status {
  if (trend === "Bullish") return "bullish";
  if (trend === "Bearish") return "bearish";
  return "neutral";
}

function signalStatus(signal: string): Status {
  if (signal.includes("Buy")) return "bullish";
  if (signal.includes("Sell")) return "bearish";
  return "neutral";
}

function fmt(n: number | null): string {
  return n == null ? "-" : n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

export default function IndicatorPanel({
  indicators,
  currentPrice,
}: {
  indicators: TechnicalIndicators;
  currentPrice: number;
}) {
  const items: { label: string; value: string; status: Status }[] = [
    { label: "Trend", value: indicators.trend, status: trendStatus(indicators.trend) },
    { label: "Signal", value: indicators.signal, status: signalStatus(indicators.signal) },
    {
      label: "RSI (14)",
      value: indicators.rsi_14 != null ? indicators.rsi_14.toFixed(1) : "-",
      status: rsiStatus(indicators.rsi_14),
    },
    {
      label: "MACD",
      value: indicators.macd != null ? indicators.macd.toFixed(2) : "-",
      status: macdStatus(indicators.macd, indicators.macd_signal),
    },
    {
      label: "SMA 20",
      value: fmt(indicators.sma_20),
      status: priceVsStatus(currentPrice, indicators.sma_20),
    },
    {
      label: "SMA 50",
      value: fmt(indicators.sma_50),
      status: priceVsStatus(currentPrice, indicators.sma_50),
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
          >
            <div className="text-xs text-zinc-500">{item.label}</div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="font-medium text-black dark:text-zinc-50">{item.value}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${BADGE_CLASS[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <div className="text-xs text-zinc-500">Support 1</div>
          <div className="text-black dark:text-zinc-50">{fmt(indicators.support_1)}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Support 2</div>
          <div className="text-black dark:text-zinc-50">{fmt(indicators.support_2)}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Resistance 1</div>
          <div className="text-black dark:text-zinc-50">{fmt(indicators.resistance_1)}</div>
        </div>
        <div>
          <div className="text-xs text-zinc-500">Resistance 2</div>
          <div className="text-black dark:text-zinc-50">{fmt(indicators.resistance_2)}</div>
        </div>
      </div>
    </div>
  );
}
