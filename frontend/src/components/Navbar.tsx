"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/screen", label: "Screener" },
  { href: "/sapta", label: "SAPTA Scan" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/50">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold tracking-tight text-black dark:text-zinc-50"
        >
          Radar Saham
        </Link>
        <nav className="flex flex-wrap gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "rounded-full bg-black px-3 py-1.5 text-sm font-medium text-white dark:bg-zinc-50 dark:text-black"
                    : "rounded-full px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-white/60 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
