import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/40 px-4 py-3 text-center text-xs text-zinc-500 backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
      Radar Saham — untuk tujuan edukasi, bukan nasihat keuangan.{" "}
      <Link href="/legal" className="underline decoration-zinc-300 hover:decoration-zinc-500">
        Disclaimer
      </Link>
    </footer>
  );
}
