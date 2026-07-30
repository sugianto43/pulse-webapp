import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-black">
      Pulse Web — untuk tujuan edukasi, bukan nasihat keuangan.{" "}
      <Link href="/legal" className="underline decoration-zinc-300 hover:decoration-zinc-500">
        Disclaimer
      </Link>
    </footer>
  );
}
