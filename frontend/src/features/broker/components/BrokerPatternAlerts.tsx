import type { PatternAlert } from "../types";

const SEVERITY_COLOR: Record<PatternAlert["severity"], string> = {
  High: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Low: "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-400",
};

export default function BrokerPatternAlerts({ alerts }: { alerts: PatternAlert[] }) {
  if (alerts.length === 0) {
    return <p className="text-sm text-zinc-500">Tidak ada pattern terdeteksi.</p>;
  }

  return (
    <ul className="space-y-2">
      {alerts.map((alert) => (
        <li
          key={`${alert.pattern}-${alert.description}`}
          className="flex items-start gap-2 rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800"
        >
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${SEVERITY_COLOR[alert.severity]}`}
          >
            {alert.severity}
          </span>
          <div>
            <span
              className={
                alert.is_bullish
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : "font-medium text-red-600 dark:text-red-400"
              }
            >
              {alert.pattern}
            </span>
            <span className="text-black dark:text-zinc-50"> — {alert.description}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
