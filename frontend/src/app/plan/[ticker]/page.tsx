"use client";

import { useParams } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import TradingPlanCard from "@/components/TradingPlanCard";
import TradingPlanForm from "@/components/TradingPlanForm";
import { useTradingPlan } from "@/hooks/useTradingPlan";

export default function PlanPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = params.ticker;
  const plan = useTradingPlan(ticker);

  return (
    <div className="min-h-screen bg-zinc-50 p-4 dark:bg-black sm:p-6">
      <main className="mx-auto max-w-2xl">
        <SearchBox initial={ticker} />

        <h1 className="mb-1 mt-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Trading Plan — {ticker}
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          Entry, take profit, stop loss, dan position sizing otomatis.
        </p>

        <TradingPlanForm
          accountSizeInput={plan.accountSizeInput}
          onAccountSizeChange={plan.setAccountSizeInput}
          riskPercentInput={plan.riskPercentInput}
          onRiskPercentChange={plan.setRiskPercentInput}
          onSubmit={plan.applyInputs}
          loading={plan.loading}
        />

        <div className="mt-6">
          {plan.error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {plan.error}
            </div>
          )}

          {!plan.error && plan.data && <TradingPlanCard data={plan.data} />}
        </div>
      </main>
    </div>
  );
}
