import type { TradingPlanResponse } from "../types";

function fmtRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}

const QUALITY_COLOR: Record<string, string> = {
  Excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Fair: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Poor: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export default function TradingPlanCard({ data }: { data: TradingPlanResponse }) {
  const { plan, position_sizing } = data;

  const riskRewardTotal = plan.risk_amount + plan.reward_tp1;
  const riskShare = riskRewardTotal > 0 ? (plan.risk_amount / riskRewardTotal) * 100 : 50;
  const rewardShare = 100 - riskShare;

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-zinc-50">{plan.ticker}</h2>
          <p className="text-sm text-zinc-500">
            Entry: {fmtRp(plan.entry_price)} ({plan.entry_type}) · {plan.trend} · {plan.signal}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${QUALITY_COLOR[plan.trade_quality] ?? ""}`}
        >
          {plan.trade_quality} · Confidence {plan.confidence}%
        </span>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs text-zinc-500">
          <span>Risk: {fmtRp(plan.risk_amount)}</span>
          <span>R:R 1:{plan.rr_ratio_tp1.toFixed(1)}</span>
          <span>Reward (TP1): {fmtRp(plan.reward_tp1)}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div className="bg-red-400" style={{ width: `${riskShare}%` }} />
          <div className="bg-emerald-400" style={{ width: `${rewardShare}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-lg border border-red-200 p-3 dark:border-red-900">
          <div className="text-xs text-zinc-500">Stop Loss</div>
          <div className="font-medium text-red-600 dark:text-red-400">{fmtRp(plan.stop_loss)}</div>
          <div className="text-xs text-zinc-500">{plan.stop_loss_percent.toFixed(2)}%</div>
        </div>
        <div className="rounded-lg border border-emerald-200 p-3 dark:border-emerald-900">
          <div className="text-xs text-zinc-500">TP1</div>
          <div className="font-medium text-emerald-600 dark:text-emerald-400">
            {fmtRp(plan.tp1)}
          </div>
          <div className="text-xs text-zinc-500">+{plan.tp1_percent.toFixed(2)}%</div>
        </div>
        {plan.tp2 != null && (
          <div className="rounded-lg border border-emerald-200 p-3 dark:border-emerald-900">
            <div className="text-xs text-zinc-500">TP2</div>
            <div className="font-medium text-emerald-600 dark:text-emerald-400">
              {fmtRp(plan.tp2)}
            </div>
            <div className="text-xs text-zinc-500">+{plan.tp2_percent?.toFixed(2)}%</div>
          </div>
        )}
        {plan.tp3 != null && (
          <div className="rounded-lg border border-emerald-200 p-3 dark:border-emerald-900">
            <div className="text-xs text-zinc-500">TP3</div>
            <div className="font-medium text-emerald-600 dark:text-emerald-400">
              {fmtRp(plan.tp3)}
            </div>
            <div className="text-xs text-zinc-500">+{plan.tp3_percent?.toFixed(2)}%</div>
          </div>
        )}
      </div>

      {position_sizing && (
        <div>
          <h3 className="mb-2 text-xs font-medium text-zinc-500">
            Position Sizing ({position_sizing.risk_percent}% risk)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <div className="text-xs text-zinc-500">Max Risk</div>
              <div className="text-black dark:text-zinc-50">
                {fmtRp(position_sizing.max_risk_amount)}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Lot</div>
              <div className="text-black dark:text-zinc-50">
                {position_sizing.lots.toLocaleString("id-ID")} (
                {position_sizing.shares.toLocaleString("id-ID")} lembar)
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">Nilai Posisi</div>
              <div className="text-black dark:text-zinc-50">
                {fmtRp(position_sizing.position_value)}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500">% Akun</div>
              <div className="text-black dark:text-zinc-50">
                {position_sizing.position_percent.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {plan.notes.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-medium text-zinc-500">Catatan</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            {plan.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {plan.execution_strategy.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-medium text-zinc-500">Strategi Eksekusi</h3>
          <ol className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            {plan.execution_strategy.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
