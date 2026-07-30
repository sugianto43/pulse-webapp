"use client";

import GlossaryAccordion from "@/components/GlossaryAccordion";
import ScreenerFilters from "@/features/screener/components/ScreenerFilters";
import ScreenerTable from "@/features/screener/components/ScreenerTable";
import ScreenerTableSkeleton from "@/features/screener/components/ScreenerTableSkeleton";
import { useScreener } from "@/features/screener/hooks/useScreener";
import { MACD_TERM, RSI_TERM, SCREENER_SCORE_TERM, VOLUME_RATIO_TERM } from "@/lib/glossary-terms";

export default function ScreenPage() {
  const screener = useScreener();

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <main className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-semibold text-black dark:text-zinc-50">Screener Saham</h1>
        <p className="mb-6 text-sm text-zinc-500">
          Saring saham IDX berdasarkan preset atau kriteria custom.
        </p>

        <ScreenerFilters
          universe={screener.universe}
          onUniverseChange={screener.setUniverse}
          preset={screener.preset}
          onPresetChange={screener.setPreset}
          presets={screener.presets}
          useCustom={screener.useCustom}
          onToggleCustom={() => screener.setUseCustom(!screener.useCustom)}
          criteria={screener.criteria}
          onCriteriaChange={screener.setCriteria}
          onSubmit={screener.runScreen}
          loading={screener.loading}
        />

        <div className="mt-6">
          {screener.error && (
            <div className="rounded-2xl border border-red-200/50 bg-red-50/80 p-4 text-red-700 backdrop-blur-xl dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
              {screener.error}
            </div>
          )}

          {!screener.error && screener.elapsedMs != null && (
            <p className="mb-3 text-xs text-zinc-500">
              {screener.results?.length ?? 0} hasil dalam {(screener.elapsedMs / 1000).toFixed(2)}s
              {screener.cached ? " (dari cache)" : ""}
            </p>
          )}

          {!screener.error && screener.loading && !screener.results && <ScreenerTableSkeleton />}

          {!screener.error && screener.results && <ScreenerTable data={screener.results} />}
        </div>

        <div className="mt-6">
          <GlossaryAccordion
            title="Istilah Screener"
            terms={[RSI_TERM, MACD_TERM, VOLUME_RATIO_TERM, SCREENER_SCORE_TERM]}
          />
        </div>
      </main>
    </div>
  );
}
