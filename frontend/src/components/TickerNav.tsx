"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function tabsFor(ticker: string) {
  return [
    { href: `/analyze/${ticker}`, label: "Analisis" },
    { href: `/plan/${ticker}`, label: "Trading Plan" },
    { href: `/sapta/${ticker}`, label: "SAPTA" },
    { href: `/broker/${ticker}`, label: "Broker Flow" },
  ];
}

export default function TickerNav({ ticker }: { ticker: string }) {
  const pathname = usePathname();
  const tabs = tabsFor(ticker);

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={
              active
                ? "rounded-full bg-black px-3 py-1 text-sm text-white dark:bg-zinc-50 dark:text-black"
                : "rounded-full border border-black/5 bg-white/60 px-3 py-1 text-sm text-black backdrop-blur-sm transition hover:bg-white dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-50 dark:hover:bg-zinc-800"
            }
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
