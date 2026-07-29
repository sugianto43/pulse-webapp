import Link from "next/link";
import SearchBox from "@/components/SearchBox";

const POPULAR_TICKERS = ["BBCA", "BBRI", "TLKM", "ASII", "BMRI"];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-black">
      <main className="w-full max-w-md text-center">
        <h1 className="mb-2 text-3xl font-semibold text-black dark:text-zinc-50">Pulse Web</h1>
        <p className="mb-6 text-zinc-500">
          Analisis teknikal saham IDX — cari ticker untuk mulai.
        </p>
        <SearchBox />
        <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
          {POPULAR_TICKERS.map((t) => (
            <Link
              key={t}
              href={`/analyze/${t}`}
              className="rounded-full border border-zinc-200 px-3 py-1 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              {t}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
