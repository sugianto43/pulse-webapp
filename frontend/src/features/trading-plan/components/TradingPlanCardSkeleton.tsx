import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";

export default function TradingPlanCardSkeleton() {
  return (
    <Card className="flex flex-col gap-6 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>

      <Skeleton className="h-3 w-full rounded-full" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </Card>
  );
}
