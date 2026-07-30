import Link from "next/link";

export const metadata = {
  title: "Disclaimer — Pulse Web",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-zinc-50 p-4 sm:p-6 dark:bg-black">
      <main className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="text-sm text-zinc-500 underline decoration-zinc-300 hover:decoration-zinc-500"
        >
          ← Kembali
        </Link>

        <h1 className="mt-4 mb-6 text-2xl font-semibold text-black dark:text-zinc-50">
          Disclaimer
        </h1>

        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <p className="font-medium text-black dark:text-zinc-50">
            Pulse Web hanya untuk tujuan edukasi dan informasi.
          </p>

          <ul className="list-inside list-disc space-y-2">
            <li>Bukan nasihat atau rekomendasi investasi/keuangan.</li>
            <li>Performa masa lalu tidak menjamin hasil di masa depan.</li>
            <li>Selalu lakukan riset sendiri (DYOR) sebelum mengambil keputusan.</li>
            <li>Berinvestasilah secara bertanggung jawab, sesuai profil risiko Anda.</li>
          </ul>

          <p>
            Seluruh skor, sinyal, dan rekomendasi (termasuk analisis teknikal, screener, trading
            plan, SAPTA, dan broker flow) dihasilkan oleh model statistik/machine learning
            berdasarkan data historis. Model ini dapat salah, tertinggal dari kondisi pasar terkini,
            atau tidak memperhitungkan seluruh faktor fundamental/berita yang relevan.
          </p>

          <p>
            Pengembang tidak bertanggung jawab atas kerugian finansial dalam bentuk apa pun yang
            timbul dari penggunaan aplikasi ini.
          </p>
        </div>
      </main>
    </div>
  );
}
