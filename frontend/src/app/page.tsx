import Link from "next/link";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import SearchBox from "@/components/SearchBox";

const POPULAR_TICKERS = ["BBCA", "BBRI", "TLKM", "ASII", "BMRI"];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <main className="w-full max-w-md text-center">
        <div className="mb-2 flex items-center justify-center gap-3">
          <Logo className="h-11 w-11" />
          <h1 className="animate-gradient-text bg-linear-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-5xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400">
            Radar Saham
          </h1>
        </div>
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

        <p className="mt-6 mb-2 text-xs font-medium text-zinc-500">Atau jelajahi fitur</p>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/screen">
            <Card className="p-4 text-left transition hover:bg-white/80 dark:hover:bg-zinc-900/80">
              <div className="font-medium text-black dark:text-zinc-50">Screener</div>
              <p className="mt-1 text-xs text-zinc-500">Saring ratusan saham sekaligus</p>
            </Card>
          </Link>
          <Link href="/sapta">
            <Card className="p-4 text-left transition hover:bg-white/80 dark:hover:bg-zinc-900/80">
              <div className="font-medium text-black dark:text-zinc-50">SAPTA Scan</div>
              <p className="mt-1 text-xs text-zinc-500">Cari kandidat pre-markup</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
