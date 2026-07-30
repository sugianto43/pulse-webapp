"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SearchBox({ initial = "" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ticker = value.trim().toUpperCase();
    if (!ticker) return;
    router.push(`/analyze/${ticker}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari ticker, mis. BBCA"
        autoCapitalize="characters"
        className="w-full rounded-full border border-black/10 bg-white/80 px-4 py-2 text-black backdrop-blur-sm transition outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-50 dark:focus:ring-zinc-700"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-black px-4 py-2 font-medium text-white shadow-md shadow-black/10 transition hover:shadow-lg active:scale-95 dark:bg-zinc-50 dark:text-black dark:shadow-none"
      >
        Cari
      </button>
    </form>
  );
}
