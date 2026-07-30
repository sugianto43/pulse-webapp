import Skeleton from "@/components/Skeleton";

export default function SaptaDetailSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center gap-4 rounded-lg border border-zinc-200 bg-white p-6 sm:flex-row sm:justify-around dark:border-zinc-800 dark:bg-zinc-900">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="w-full text-center sm:text-left">
          <Skeleton className="mx-auto h-5 w-40 sm:mx-0" />
          <Skeleton className="mx-auto mt-2 h-4 w-28 sm:mx-0" />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </>
  );
}
