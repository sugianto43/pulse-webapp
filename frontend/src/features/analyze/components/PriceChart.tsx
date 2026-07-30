"use client";

import { useEffect, useRef } from "react";
import { CandlestickSeries, ColorType, createChart, type IChartApi } from "lightweight-charts";
import type { OHLCV } from "../types";

export default function PriceChart({ history }: { history: OHLCV[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || history.length === 0) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "rgba(161,161,170,0.1)" },
        horzLines: { color: "rgba(161,161,170,0.1)" },
      },
      width: container.clientWidth,
      height: 360,
      timeScale: { borderColor: "rgba(161,161,170,0.3)" },
      rightPriceScale: { borderColor: "rgba(161,161,170,0.3)" },
    });
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    series.setData(
      history.map((bar) => ({
        time: bar.date.slice(0, 10),
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
      })),
    );

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center text-sm text-zinc-500">
        Data historis tidak tersedia.
      </div>
    );
  }

  return <div ref={containerRef} className="w-full" />;
}
