"use client";

import Card from "@/components/Card";
import { ApiError } from "@/lib/api-client";
import { usePredictionQuery } from "../hooks/usePredictionQuery";
import type { PredictedAction, PredictionResult } from "../types";
import PredictionCardSkeleton from "./PredictionCardSkeleton";

const ACTION_STYLE: Record<PredictedAction, string> = {
  Buy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  Hold: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  Sell: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const WEAK_SIGNAL_STYLE = "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";

const ACTION_LABEL: Record<PredictedAction, string> = {
  Buy: "Beli",
  Hold: "Tahan",
  Sell: "Jual",
};

const BAR_STYLE: Record<PredictedAction, string> = {
  Buy: "bg-emerald-500",
  Hold: "bg-zinc-400 dark:bg-zinc-600",
  Sell: "bg-red-500",
};

function badgeStyle(data: PredictionResult): string {
  if (data.predicted_action === "Buy" && !data.is_actionable) return WEAK_SIGNAL_STYLE;
  return ACTION_STYLE[data.predicted_action];
}

function badgeLabel(data: PredictionResult): string {
  if (data.predicted_action === "Buy" && !data.is_actionable) {
    return `${ACTION_LABEL.Buy} (sinyal lemah)`;
  }
  return ACTION_LABEL[data.predicted_action];
}

export default function PredictionCard({ ticker }: { ticker: string }) {
  const { data, isLoading, error } = usePredictionQuery(ticker);

  if (isLoading) return <PredictionCardSkeleton />;

  if (error) {
    return (
      <Card className="p-4">
        <h3 className="mb-2 text-sm font-medium text-zinc-500">Prediksi Besok</h3>
        <p className="text-sm text-zinc-500">
          {error instanceof ApiError ? error.message : "Gagal memuat prediksi."}
        </p>
      </Card>
    );
  }

  if (!data) return null;

  const order: PredictedAction[] = ["Buy", "Hold", "Sell"];

  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-500">Prediksi Besok</h3>

      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeStyle(data)}`}>
          {badgeLabel(data)}
        </span>
        <span className="text-sm text-zinc-500">
          Confidence: {(data.confidence * 100).toFixed(0)}%
        </span>
      </div>

      {data.predicted_action === "Buy" && !data.is_actionable && (
        <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
          Confidence di bawah ambang batas backtest — perlakukan sebagai Tahan.
        </p>
      )}

      <div className="mt-4 space-y-2">
        {order.map((action) => (
          <div key={action} className="flex items-center gap-2">
            <span className="w-10 text-xs text-zinc-500">{ACTION_LABEL[action]}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full ${BAR_STYLE[action]}`}
                style={{ width: `${Math.round(data.probabilities[action] * 100)}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs text-zinc-500">
              {Math.round(data.probabilities[action] * 100)}%
            </span>
          </div>
        ))}
      </div>

      {(data.backtest_accuracy !== null || data.backtest_win_rate !== null) && (
        <div className="mt-3 space-y-0.5 text-xs text-zinc-500">
          {data.backtest_accuracy !== null && (
            <p>Akurasi model (backtest): {(data.backtest_accuracy * 100).toFixed(0)}%</p>
          )}
          {data.backtest_win_rate !== null && (
            <p>
              Win rate sinyal Beli (backtest, net biaya transaksi):{" "}
              {(data.backtest_win_rate * 100).toFixed(0)}%
              {data.backtest_avg_return_pct !== null && (
                <>
                  {" "}
                  · Return rata-rata/trade: {data.backtest_avg_return_pct >= 0 ? "+" : ""}
                  {data.backtest_avg_return_pct.toFixed(2)}%
                </>
              )}
            </p>
          )}
          {data.backtest_max_drawdown_pct !== null && (
            <p>
              Max drawdown portofolio: -{data.backtest_max_drawdown_pct.toFixed(1)}%
              {data.backtest_sharpe_annualized !== null && (
                <> · Sharpe (tahunan): {data.backtest_sharpe_annualized.toFixed(2)}</>
              )}
            </p>
          )}
          {data.ticker_backtest_trades !== null && data.ticker_backtest_trades > 0 && (
            <p>
              Rekam jejak {data.ticker} sendiri: {data.ticker_backtest_trades} trade, win rate{" "}
              {((data.ticker_backtest_win_rate ?? 0) * 100).toFixed(0)}%
              {data.ticker_backtest_avg_return_pct !== null && (
                <>
                  {" "}
                  · rata-rata {data.ticker_backtest_avg_return_pct >= 0 ? "+" : ""}
                  {data.ticker_backtest_avg_return_pct.toFixed(2)}%/trade
                </>
              )}
            </p>
          )}
        </div>
      )}

      <p className="mt-3 rounded-xl bg-amber-50/80 px-3 py-2 text-xs text-amber-800 backdrop-blur-sm dark:bg-amber-500/10 dark:text-amber-400">
        ⚠️ Prediksi berbasis statistik, bukan jaminan — pergerakan harga 1 hari sulit diprediksi.
        Sinyal Jual tidak disimulasikan sebagai transaksi (short selling retail terbatas di IDX).
        Selalu lakukan riset sendiri sebelum mengambil keputusan.
      </p>
    </Card>
  );
}
