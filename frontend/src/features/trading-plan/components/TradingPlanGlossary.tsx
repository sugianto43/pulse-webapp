import GlossaryAccordion from "@/components/GlossaryAccordion";

const TERMS = [
  {
    term: "Entry",
    description: "Harga beli yang disarankan untuk masuk posisi.",
  },
  {
    term: "TP (Take Profit)",
    description:
      "Level harga untuk mengambil untung. TP1 target konservatif, TP2/TP3 target lebih agresif kalau tren berlanjut.",
  },
  {
    term: "SL (Stop Loss)",
    description:
      "Level harga untuk keluar posisi kalau salah arah, supaya kerugian terbatas. Dihitung dari level teknikal (ATR/support), bukan dari toleransi risiko.",
  },
  {
    term: "R:R (Risk:Reward)",
    description:
      "Perbandingan potensi rugi vs potensi untung. R:R 1:2 artinya kalau rugi Rp 1, potensi untungnya Rp 2 — makin tinggi makin baik.",
  },
  {
    term: "Trade Quality & Confidence",
    description:
      "Penilaian otomatis seberapa bagus setup trade ini (Excellent/Good/Fair/Poor) dan seberapa yakin sistem terhadap penilaian itu (0-100%).",
  },
  {
    term: "Position Sizing & Lot",
    description:
      "Jumlah saham yang aman dibeli (1 lot = 100 lembar) supaya kerugian maksimal sesuai 'Risk per Trade' yang kamu atur, bukan asal beli sebanyak-banyaknya.",
  },
];

export default function TradingPlanGlossary() {
  return <GlossaryAccordion title="Istilah Trading Plan" terms={TERMS} />;
}
