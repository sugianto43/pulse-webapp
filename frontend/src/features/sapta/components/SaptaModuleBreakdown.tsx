import type { SaptaModules } from "../types";

const MODULE_LABELS: { key: keyof SaptaModules; label: string }[] = [
  { key: "absorption", label: "Supply Absorption" },
  { key: "compression", label: "Compression" },
  { key: "bb_squeeze", label: "BB Squeeze" },
  { key: "elliott", label: "Elliott Wave" },
  { key: "time_projection", label: "Time Projection" },
  { key: "anti_distribution", label: "Anti-Distribution" },
];

export default function SaptaModuleBreakdown({ modules }: { modules: SaptaModules }) {
  return (
    <div className="space-y-4">
      {MODULE_LABELS.map(({ key, label }) => {
        const moduleScore = modules[key];
        if (!moduleScore) return null;
        const pct =
          moduleScore.max_score > 0 ? (moduleScore.score / moduleScore.max_score) * 100 : 0;

        return (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-black dark:text-zinc-50">{label}</span>
              <span className="text-zinc-500">
                {moduleScore.score.toFixed(1)} / {moduleScore.max_score.toFixed(0)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={
                  moduleScore.status
                    ? "h-full bg-emerald-500"
                    : "h-full bg-zinc-400 dark:bg-zinc-600"
                }
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">{moduleScore.details}</p>
          </div>
        );
      })}
    </div>
  );
}
