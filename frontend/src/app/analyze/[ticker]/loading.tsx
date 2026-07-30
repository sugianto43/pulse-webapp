import Skeleton from "@/components/Skeleton";

export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-black">
      <main className="mx-auto max-w-3xl">
        <Skeleton className="h-10 w-full rounded-lg" />

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
          <div className="text-right">
            <Skeleton className="ml-auto h-7 w-28" />
            <Skeleton className="mt-2 ml-auto h-4 w-20" />
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-2 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Skeleton className="h-90 w-full" />
        </div>

        <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </main>
    </div>
  );
}
