import type { SaptaStatus } from "../types";

const STATUS_COLOR: Record<SaptaStatus, string> = {
  "PRE-MARKUP": "#22c55e",
  SIAP: "#3b82f6",
  WATCHLIST: "#f59e0b",
  ABAIKAN: "#71717a",
};

export default function SaptaScoreGauge({ score, status }: { score: number; status: SaptaStatus }) {
  const color = STATUS_COLOR[status] ?? STATUS_COLOR.ABAIKAN;
  const size = 140;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth="12"
          className="stroke-zinc-100 dark:stroke-zinc-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold text-black dark:text-zinc-50">
          {clamped.toFixed(0)}
        </span>
        <span className="text-xs text-zinc-500">/ 100</span>
      </div>
    </div>
  );
}
