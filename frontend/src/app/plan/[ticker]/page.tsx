"use client";

import { useParams } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import TradingPlanCard from "@/features/trading-plan/components/TradingPlanCard";
import TradingPlanCardSkeleton from "@/features/trading-plan/components/TradingPlanCardSkeleton";
import TradingPlanForm from "@/features/trading-plan/components/TradingPlanForm";
import TradingPlanGlossary from "@/features/trading-plan/components/TradingPlanGlossary";
import { useTradingPlan } from "@/features/trading-plan/hooks/useTradingPlan";

export default function PlanPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = params.ticker;
  const plan = useTradingPlan(ticker);

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <main className="mx-auto max-w-2xl">
        <SearchBox initial={ticker} />

        <h1 className="mt-6 mb-1 text-2xl font-semibold text-black dark:text-zinc-50">
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
            <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-4 text-red-700 backdrop-blur-xl dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              {plan.error}
            </div>
          )}

          {!plan.error && plan.loading && !plan.data && <TradingPlanCardSkeleton />}

          {!plan.error && plan.data && <TradingPlanCard data={plan.data} />}
        </div>

        <div className="mt-6">
          <TradingPlanGlossary />
        </div>
      </main>
    </div>
  );
}
