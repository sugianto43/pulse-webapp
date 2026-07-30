"use client";

import SaptaScanFilters, {
  SAPTA_UNIVERSE_INFO,
} from "@/features/sapta/components/SaptaScanFilters";
import SaptaScanTable from "@/features/sapta/components/SaptaScanTable";
import { useSaptaScan } from "@/features/sapta/hooks/useSaptaScan";

export default function SaptaScanPage() {
  const scan = useSaptaScan();

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <main className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-semibold text-black dark:text-zinc-50">SAPTA Scan</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Scan multi-saham buat kandidat fase pre-markup.
        </p>

        <SaptaScanFilters
          universe={scan.universe}
          onUniverseChange={scan.setUniverse}
          minStatus={scan.minStatus}
          onMinStatusChange={scan.setMinStatus}
          onSubmit={scan.runScan}
          loading={scan.loading}
        />

        <div className="mt-6">
          {scan.loading && (
            <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
              Sedang scan {SAPTA_UNIVERSE_INFO[scan.universe]}...
            </div>
          )}

          {scan.error && (
            <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-4 text-red-700 backdrop-blur-xl dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              {scan.error}
            </div>
          )}

          {!scan.error && !scan.loading && scan.elapsedMs != null && (
            <p className="mb-3 text-xs text-zinc-500">
              {scan.results?.length ?? 0} kandidat dalam {(scan.elapsedMs / 1000).toFixed(2)}s
              {scan.cached ? " (dari cache)" : ""}
            </p>
          )}

          {!scan.error && !scan.loading && scan.results && <SaptaScanTable data={scan.results} />}
        </div>
      </main>
    </div>
  );
}
