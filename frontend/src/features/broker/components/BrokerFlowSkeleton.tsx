import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";

export default function BrokerFlowSkeleton() {
  return (
    <>
      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </Card>

      <Card className="mt-6 grid grid-cols-2 gap-3 p-4 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </Card>
    </>
  );
}
