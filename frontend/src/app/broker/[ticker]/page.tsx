"use client";

import { useParams } from "next/navigation";
import Card from "@/components/Card";
import SearchBox from "@/components/SearchBox";
import TickerNav from "@/components/TickerNav";
import BrokerCompositionBar from "@/features/broker/components/BrokerCompositionBar";
import BrokerFlowSkeleton from "@/features/broker/components/BrokerFlowSkeleton";
import BrokerGlossary from "@/features/broker/components/BrokerGlossary";
import BrokerPatternAlerts from "@/features/broker/components/BrokerPatternAlerts";
import BrokerScoreCards from "@/features/broker/components/BrokerScoreCards";
import { useBrokerFlowQuery } from "@/features/broker/hooks/useBrokerFlowQuery";
import { ApiError } from "@/lib/api-client";

function fmtRp(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}Rp ${Math.abs(n).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}

export default function BrokerFlowPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = params.ticker;
  const { data, isLoading, error } = useBrokerFlowQuery(ticker);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <main className="mx-auto max-w-2xl">
        <SearchBox initial={ticker} />

        <h1 className="mt-6 mb-1 text-2xl font-semibold text-black dark:text-zinc-50">
          Broker Flow — {ticker}
        </h1>
        <p className="mb-2 text-sm text-zinc-500">
          Analisis bandarmology: komposisi broker, akumulasi/distribusi, dan pattern alert.
        </p>
        <div className="mb-6">
          <TickerNav ticker={ticker} />
        </div>

        {isLoading && <BrokerFlowSkeleton />}

        {error && (
          <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-4 text-red-700 backdrop-blur-xl dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {error instanceof ApiError ? error.message : "Terjadi kesalahan tak terduga."}
          </div>
        )}

        {data && (
          <>
            <Card className="p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-lg font-semibold text-black dark:text-zinc-50">
                    {data.accumulation_phase}
                  </div>
                  <div className="text-sm text-zinc-500">Signal: {data.signal}</div>
                </div>
                <div className="text-right text-sm text-zinc-500">
                  {data.start_date} → {data.end_date} ({data.period_days} hari)
                </div>
              </div>
              <BrokerScoreCards
                flowMomentumScore={data.flow_momentum_score}
                markupReadinessScore={data.markup_readiness_score}
                confidence={data.confidence}
              />
            </Card>

            {data.distribution_warning && (
              <div className="mt-6 rounded-2xl border border-red-200/50 bg-red-50/80 p-4 text-sm text-red-700 backdrop-blur-xl dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
                ⚠️ Distribution warning — indikasi smart money mulai keluar.
              </div>
            )}

            {data.broker_composition && (
              <Card className="mt-6 p-4">
                <h2 className="mb-3 text-sm font-medium text-zinc-500">Komposisi Broker</h2>
                <BrokerCompositionBar composition={data.broker_composition} />
              </Card>
            )}

            <Card className="mt-6 grid grid-cols-2 gap-3 p-4 text-sm sm:grid-cols-3">
              <div>
                <div className="text-xs text-zinc-500">Foreign Net</div>
                <div className="text-black dark:text-zinc-50">{fmtRp(data.foreign_net_total)}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Smart Money Net</div>
                <div className="text-black dark:text-zinc-50">
                  {fmtRp(data.smart_money_net_total)}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Retail Net</div>
                <div className="text-black dark:text-zinc-50">{fmtRp(data.retail_net_total)}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Streak</div>
                <div className="text-black dark:text-zinc-50">
                  {data.accumulation_streak > 0
                    ? `+${data.accumulation_streak} hari akumulasi`
                    : `${data.accumulation_streak} hari distribusi`}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-500">Top-5 Consistency</div>
                <div className="text-black dark:text-zinc-50">
                  {data.top5_consistency_score.toFixed(1)}%
                </div>
              </div>
              {data.most_consistent_buyer && (
                <div>
                  <div className="text-xs text-zinc-500">Buyer Konsisten</div>
                  <div className="text-black dark:text-zinc-50">
                    {data.most_consistent_buyer} ({data.most_consistent_buyer_days}d)
                  </div>
                </div>
              )}
            </Card>

            <Card className="mt-6 p-4">
              <h2 className="mb-3 text-sm font-medium text-zinc-500">Pattern Alerts</h2>
              <BrokerPatternAlerts alerts={data.pattern_alerts} />
            </Card>

            {data.recommendation && (
              <Card className="mt-6 p-4 text-sm">
                <h2 className="mb-2 text-xs font-medium text-zinc-500">Rekomendasi</h2>
                <p className="text-black dark:text-zinc-50">{data.recommendation}</p>
              </Card>
            )}

            {data.insights.length > 0 && (
              <Card className="mt-6 p-4">
                <h2 className="mb-2 text-sm font-medium text-zinc-500">Insight</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {data.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              </Card>
            )}

            {data.risks.length > 0 && (
              <div className="mt-6 rounded-2xl border border-amber-200/50 bg-amber-50/80 p-4 text-sm text-amber-800 backdrop-blur-xl dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-300">
                <h2 className="mb-2 text-xs font-medium">Risiko</h2>
                <ul className="list-inside list-disc space-y-1">
                  {data.risks.map((risk) => (
                    <li key={risk}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="mt-6">
          <BrokerGlossary />
        </div>
      </main>
    </div>
  );
}
