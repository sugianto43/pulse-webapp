import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";

export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <main className="mx-auto max-w-3xl">
        <Skeleton className="h-10 w-full rounded-full" />

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

        <Card className="mt-6 p-2 sm:p-4">
          <Skeleton className="h-90 w-full" />
        </Card>

        <Card className="mt-6 p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </Card>

        <div className="mt-6">
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
