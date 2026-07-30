import Link from "next/link";
import Card from "@/components/Card";
import SearchBox from "@/components/SearchBox";

const POPULAR_TICKERS = ["BBCA", "BBRI", "TLKM", "ASII", "BMRI"];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <main className="w-full max-w-md text-center">
        <h1 className="mb-2 text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Pulse Web
        </h1>
        <p className="mb-8 text-zinc-500">Analisis teknikal saham IDX — cari ticker untuk mulai.</p>

        <Card className="p-4">
          <SearchBox />
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            {POPULAR_TICKERS.map((t) => (
              <Link
                key={t}
                href={`/analyze/${t}`}
                className="rounded-full border border-black/5 bg-white/60 px-3 py-1 text-zinc-600 backdrop-blur-sm transition hover:bg-white hover:text-black dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                {t}
              </Link>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
