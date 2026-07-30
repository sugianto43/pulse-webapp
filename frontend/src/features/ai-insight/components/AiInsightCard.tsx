"use client";

import Card from "@/components/Card";
import { ApiError } from "@/lib/api-client";
import { useAiInsight } from "../hooks/useAiInsight";
import type { AiInsightRequest } from "../types";

export default function AiInsightCard({ request }: { request: AiInsightRequest }) {
  const { data, isLoading, error } = useAiInsight(request);

  return (
    <Card className="p-4">
      <h3 className="mb-2 text-sm font-medium text-zinc-500">AI Insight</h3>

      {isLoading && (
        <div className="animate-pulse space-y-2">
          <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      )}

      {error && (
        <p className="text-sm text-zinc-500">
          {error instanceof ApiError ? error.message : "Gagal memuat AI insight."}
        </p>
      )}

      {data && (
        <>
          <p className="text-sm leading-relaxed text-black dark:text-zinc-50">{data.narrative}</p>
          <p className="mt-3 rounded-xl bg-amber-50/80 px-3 py-2 text-xs text-amber-800 backdrop-blur-sm dark:bg-amber-500/10 dark:text-amber-400">
            ⚠️ Ringkasan ini dibuat otomatis oleh AI dan bukan nasihat keuangan. Selalu lakukan
            riset sendiri sebelum mengambil keputusan investasi.
          </p>
        </>
      )}
    </Card>
  );
}
