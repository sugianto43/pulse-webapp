"use client";

import { useState } from "react";

const MODULES = [
  {
    name: "Supply Absorption",
    desc: "Mendeteksi pola akumulasi smart money — higher lows, kekuatan penutupan, dan volume.",
  },
  {
    name: "Compression",
    desc: "Kontraksi volatilitas (ATR menurun) sebelum ekspansi harga.",
  },
  {
    name: "BB Squeeze",
    desc: "Bollinger Band menyempit, menandakan potensi pergerakan besar akan datang.",
  },
  {
    name: "Elliott Wave",
    desc: "Posisi gelombang Elliott dan level retracement Fibonacci.",
  },
  {
    name: "Time Projection",
    desc: "Proyeksi window waktu breakout berdasarkan siklus Fibonacci.",
  },
  {
    name: "Anti-Distribution",
    desc: "Filter pola distribusi (false breakout) supaya sinyal lebih bersih.",
  },
];

export default function SaptaMethodologyInfo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-zinc-500"
      >
        Cara Kerja SAPTA
        <span>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <p className="mb-3 text-zinc-600 dark:text-zinc-400">
            SAPTA menggabungkan 6 modul analisis teknikal jadi satu skor 0-100 buat mendeteksi fase{" "}
            <em>pre-markup</em> (sebelum harga breakout). Status ditentukan dari skor akhir:
            PRE-MARKUP (siap breakout), SIAP (hampir siap), WATCHLIST (pantau), ABAIKAN (skip).
          </p>
          <ul className="space-y-2">
            {MODULES.map((m) => (
              <li key={m.name}>
                <span className="font-medium text-black dark:text-zinc-50">{m.name}</span>
                <span className="text-zinc-500"> — {m.desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-zinc-500">
            Skor bukan jaminan — ini alat riset, bukan nasihat keuangan. Model machine learning
            (kalau tersedia) melengkapi skor berbasis aturan di atas.
          </p>
        </div>
      )}
    </div>
  );
}
