import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";

export default function PredictionCardSkeleton() {
  return (
    <Card className="p-4">
      <Skeleton className="mb-3 h-4 w-28" />
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="mt-4 space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-2 w-full rounded-full" />
        ))}
      </div>
    </Card>
  );
}
