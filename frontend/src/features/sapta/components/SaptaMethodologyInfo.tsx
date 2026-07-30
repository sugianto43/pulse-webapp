import GlossaryAccordion from "@/components/GlossaryAccordion";

const MODULES = [
  {
    term: "Supply Absorption",
    description:
      "Mendeteksi pola akumulasi smart money — higher lows, kekuatan penutupan, dan volume.",
  },
  {
    term: "Compression",
    description: "Kontraksi volatilitas (ATR menurun) sebelum ekspansi harga.",
  },
  {
    term: "BB Squeeze",
    description: "Bollinger Band menyempit, menandakan potensi pergerakan besar akan datang.",
  },
  {
    term: "Elliott Wave",
    description: "Posisi gelombang Elliott dan level retracement Fibonacci.",
  },
  {
    term: "Time Projection",
    description: "Proyeksi window waktu breakout berdasarkan siklus Fibonacci.",
  },
  {
    term: "Anti-Distribution",
    description: "Filter pola distribusi (false breakout) supaya sinyal lebih bersih.",
  },
];

export default function SaptaMethodologyInfo() {
  return (
    <GlossaryAccordion
      title="Cara Kerja SAPTA"
      terms={MODULES}
      intro={
        <p>
          SAPTA menggabungkan 6 modul analisis teknikal jadi satu skor 0-100 buat mendeteksi fase{" "}
          <em>pre-markup</em> (sebelum harga breakout). Status ditentukan dari skor akhir:
          PRE-MARKUP (siap breakout), SIAP (hampir siap), WATCHLIST (pantau), ABAIKAN (skip).
        </p>
      }
      footer="Skor bukan jaminan — ini alat riset, bukan nasihat keuangan. Model machine learning (kalau tersedia) melengkapi skor berbasis aturan di atas."
    />
  );
}
