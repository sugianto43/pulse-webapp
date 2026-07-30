import type { BrokerComposition } from "../types";

const SEGMENTS: { key: keyof BrokerComposition & string; label: string; color: string }[] = [
  { key: "smart_money_percent", label: "Smart Money", color: "bg-emerald-500" },
  { key: "bandar_percent", label: "Bandar", color: "bg-blue-500" },
  { key: "local_inst_percent", label: "Institusi Lokal", color: "bg-indigo-400" },
  { key: "market_maker_percent", label: "Market Maker", color: "bg-purple-400" },
  { key: "retail_percent", label: "Retail", color: "bg-amber-500" },
  { key: "unknown_percent", label: "Lainnya", color: "bg-zinc-400" },
];

function fmtRp(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}Rp ${Math.abs(n).toLocaleString("id-ID", { maximumFractionDigits: 0 })}`;
}

export default function BrokerCompositionBar({ composition }: { composition: BrokerComposition }) {
  const netByLabel: Record<string, number> = {
    "Smart Money": composition.smart_money_net,
    Bandar: composition.bandar_net,
    "Institusi Lokal": composition.local_inst_net,
    "Market Maker": composition.market_maker_net,
    Retail: composition.retail_net,
    Lainnya: composition.unknown_net,
  };

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        {SEGMENTS.map(({ key, color }) => (
          <div key={key} className={color} style={{ width: `${Math.max(0, composition[key])}%` }} />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {SEGMENTS.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${color}`} />
            <div>
              <div className="text-black dark:text-zinc-50">
                {label} ({composition[key].toFixed(1)}%)
              </div>
              <div
                className={
                  netByLabel[label] >= 0
                    ? "text-xs text-emerald-600 dark:text-emerald-400"
                    : "text-xs text-red-600 dark:text-red-400"
                }
              >
                {fmtRp(netByLabel[label])}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
