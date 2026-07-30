import Card from "@/components/Card";
import Skeleton from "@/components/Skeleton";

export default function SaptaDetailSkeleton() {
  return (
    <>
      <Card className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:justify-around">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="w-full text-center sm:text-left">
          <Skeleton className="mx-auto h-5 w-40 sm:mx-0" />
          <Skeleton className="mx-auto mt-2 h-4 w-28 sm:mx-0" />
        </div>
      </Card>

      <Card className="mt-6 p-4">
        <Skeleton className="mb-3 h-4 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </Card>
    </>
  );
}
