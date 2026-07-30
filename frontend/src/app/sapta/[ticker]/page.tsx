"use client";

import { useParams } from "next/navigation";
import SearchBox from "@/components/SearchBox";
import SaptaMethodologyInfo from "@/features/sapta/components/SaptaMethodologyInfo";
import SaptaModuleBreakdown from "@/features/sapta/components/SaptaModuleBreakdown";
import SaptaScoreGauge from "@/features/sapta/components/SaptaScoreGauge";
import { useSaptaQuery } from "@/features/sapta/hooks/useSaptaQuery";
import { ApiError } from "@/lib/api-client";

const STATUS_LABEL: Record<string, string> = {
  "PRE-MARKUP": "Siap breakout",
  SIAP: "Hampir siap",
  WATCHLIST: "Pantau",
  ABAIKAN: "Abaikan",
};

export default function SaptaDetailPage() {
  const params = useParams<{ ticker: string }>();
  const ticker = params.ticker;
  const { data, isLoading, error } = useSaptaQuery(ticker);

  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-black">
      <main className="mx-auto max-w-2xl">
        <SearchBox initial={ticker} />

        <h1 className="mt-6 mb-1 text-2xl font-semibold text-black dark:text-zinc-50">
          SAPTA — {ticker}
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          Deteksi fase pre-markup berbasis 6 modul analisis teknikal.
        </p>

        {isLoading && <div className="animate-pulse text-sm text-zinc-500">Menganalisis...</div>}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error instanceof ApiError ? error.message : "Terjadi kesalahan tak terduga."}
          </div>
        )}

        {data && (
          <>
            <div className="flex flex-col items-center gap-4 rounded-lg border border-zinc-200 bg-white p-6 sm:flex-row sm:justify-around dark:border-zinc-800 dark:bg-zinc-900">
              <SaptaScoreGauge score={data.final_score} status={data.status} />
              <div className="text-center sm:text-left">
                <div className="text-lg font-semibold text-black dark:text-zinc-50">
                  {data.status} — {STATUS_LABEL[data.status] ?? data.status}
                </div>
                <div className="text-sm text-zinc-500">Confidence: {data.confidence}</div>
                {data.projected_breakout_window && (
                  <div className="text-sm text-zinc-500">
                    Proyeksi window: {data.projected_breakout_window}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-3 text-sm font-medium text-zinc-500">Breakdown 6 Modul</h2>
              <SaptaModuleBreakdown modules={data.modules} />
            </div>

            {data.notes.length > 0 && (
              <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="mb-2 text-sm font-medium text-zinc-500">Catatan</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {data.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {data.warnings.length > 0 && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
                {data.warnings.join(" · ")}
              </div>
            )}

            <div className="mt-6">
              <SaptaMethodologyInfo />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
