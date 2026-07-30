import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/5 bg-white/70 shadow-lg shadow-zinc-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-black/40 ${className}`}
    >
      {children}
    </div>
  );
}
