function ScoreBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = clamped >= 65 ? "bg-emerald-500" : clamped >= 40 ? "bg-amber-500" : "bg-zinc-400";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-black dark:text-zinc-50">{label}</span>
        <span className="text-zinc-500">{clamped.toFixed(0)} / 100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className={`h-full ${color}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

export default function BrokerScoreCards({
  flowMomentumScore,
  markupReadinessScore,
  confidence,
}: {
  flowMomentumScore: number;
  markupReadinessScore: number;
  confidence: number;
}) {
  return (
    <div className="space-y-4">
      <ScoreBar label="Flow Momentum" value={flowMomentumScore} />
      <ScoreBar label="Markup Readiness" value={markupReadinessScore} />
      <ScoreBar label="Confidence" value={confidence} />
    </div>
  );
}
