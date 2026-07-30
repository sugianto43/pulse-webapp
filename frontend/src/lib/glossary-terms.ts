import type { GlossaryTerm } from "@/components/GlossaryAccordion";

// Terms reused across multiple pages (analyze + screener both show RSI/MACD)
// live here so the wording stays consistent instead of drifting per page.

export const RSI_TERM: GlossaryTerm = {
  term: "RSI (Relative Strength Index)",
  description:
    "Indikator momentum 0-100. Di bawah 30 = oversold (jenuh jual, berpotensi rebound), di atas 70 = overbought (jenuh beli, berpotensi koreksi).",
};

export const MACD_TERM: GlossaryTerm = {
  term: "MACD",
  description:
    "Selisih dua rata-rata bergerak (EMA), dipakai buat melihat perubahan momentum tren. MACD di atas garis sinyalnya = momentum menguat.",
};

export const SMA_TERM: GlossaryTerm = {
  term: "SMA (Simple Moving Average)",
  description:
    "Rata-rata harga N hari terakhir, dipakai buat melihat arah tren. Harga di atas SMA = tren naik, di bawah = tren turun.",
};

export const SUPPORT_RESISTANCE_TERM: GlossaryTerm = {
  term: "Support & Resistance",
  description:
    "Support = level harga yang cenderung 'ditahan' saat turun (area beli). Resistance = level yang cenderung 'ditahan' saat naik (area jual).",
};

export const TREND_SIGNAL_TERM: GlossaryTerm = {
  term: "Trend & Signal",
  description:
    "Trend = arah pergerakan harga (Bullish naik, Bearish turun, Sideways mendatar). Signal = rekomendasi aksi dari kombinasi indikator (Buy/Sell/Neutral).",
};

export const VOLUME_RATIO_TERM: GlossaryTerm = {
  term: "Volume Ratio",
  description:
    "Perbandingan volume transaksi hari ini vs rata-rata. Di atas 1x berarti transaksi lebih ramai dari biasanya — sering menandakan ada aksi (akumulasi/distribusi).",
};

export const SCREENER_SCORE_TERM: GlossaryTerm = {
  term: "Score",
  description:
    "Skor gabungan dari semua indikator teknikal & fundamental yang dipilih — makin tinggi, makin cocok dengan kriteria screening.",
};
