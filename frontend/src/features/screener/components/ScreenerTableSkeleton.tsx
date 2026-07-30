import Skeleton from "@/components/Skeleton";

export default function ScreenerTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-sm">
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
              {Array.from({ length: 7 }).map((_, j) => (
                <td key={j} className="px-3 py-2">
                  <Skeleton className="h-4 w-16" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
