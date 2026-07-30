import Skeleton from "@/components/Skeleton";

export default function ScreenerTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50">
      <table className="w-full min-w-[640px] text-sm">
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-b border-black/5 last:border-0 dark:border-white/5">
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
