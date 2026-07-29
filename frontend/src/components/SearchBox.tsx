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
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-black px-4 py-2 font-medium text-white dark:bg-zinc-50 dark:text-black"
      >
        Cari
      </button>
    </form>
  );
}
