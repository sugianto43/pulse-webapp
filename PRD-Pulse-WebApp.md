# Product Requirements Document (PRD)

## Pulse Web — Platform Analisis Saham IDX Berbasis AI

|                     |                                                            |
| ------------------- | ---------------------------------------------------------- |
| **Dokumen**         | PRD v1.0                                                   |
| **Status**          | Draft                                                      |
| **Basis**           | Migrasi/refactor dari `sukirman1901/Pulse-CLI`             |
| **Target Platform** | Next.js (frontend) + FastAPI (backend, reuse logic Python) |

---

## 1. Latar Belakang

Pulse CLI adalah tool analisis saham IDX berbasis Terminal (TUI) yang sudah punya logic inti solid: fetch data Yahoo Finance, indikator teknikal, screener, trading plan generator, engine SAPTA (deteksi pre-markup berbasis ML), dan analisis bandarmology. Masalahnya: **interface terminal membatasi adopsi** — sulit dipakai casual user, tidak ada visualisasi chart yang baik, dan tidak bisa diakses dari browser/mobile.

**Tujuan proyek:** membungkus ulang kapabilitas yang sudah ada ke dalam web app yang mudah diakses, tanpa menulis ulang logic analisis dari nol.

---

## 2. Tujuan & Sasaran (Goals)

| Goal                                             | Metrik Keberhasilan                                                |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| User bisa analisis saham IDX tanpa install CLI   | Aplikasi bisa diakses lewat browser (desktop & mobile)             |
| Visualisasi lebih baik dari output teks terminal | Chart interaktif, tabel sortable, dashboard skor                   |
| AI insight terintegrasi tanpa setup rumit        | User tidak perlu setup CLIProxyAPI manual                          |
| Reuse logic Python yang sudah teruji             | Tidak menulis ulang SAPTA/indikator teknikal dari nol di fase awal |

**Bukan tujuan (Out of Scope) di v1:**

- Eksekusi order trading otomatis (bukan sistem trading, tetap tools riset)
- Real-time streaming tick-by-tick (cukup data dengan cache/polling)
- Multi-market (fokus IDX dulu)
- Native mobile app (web-responsive cukup untuk v1)

---

## 3. Target Pengguna

- Investor/trader ritel Indonesia yang mau riset saham cepat tanpa buka banyak tab/tool
- Pengguna Pulse CLI existing yang ingin pengalaman lebih visual

---

## 4. Arsitektur Solusi (Ringkas)

```
Next.js (Vercel) ──HTTP/JSON──► FastAPI (Railway/Render) ──► yfinance, SAPTA engine, Stockbit
       │
       └──► API route sendiri untuk AI insight (panggil LLM langsung)
```

Prinsip: **Next.js tidak menyentuh logic analisis.** FastAPI hanya membungkus fungsi-fungsi yang sudah ada di `pulse/core/`.

---

## 5. Pemecahan Tahap Pengerjaan (Milestone)

> Setiap fase harus **shippable** — bisa didemokan meski fase berikutnya belum selesai.

### 🔹 Fase 0 — Fondasi Teknis (Setup)

**Tujuan:** Infrastruktur siap, belum ada fitur user-facing.

| #   | Task                                                                       | Output                                                 |
| --- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| 0.1 | Setup repo FastAPI, wrap 1 fungsi core (`analyze_technical`) jadi endpoint | `GET /api/analyze/{ticker}` bisa dipanggil via Postman |
| 0.2 | Setup CORS, deploy FastAPI ke Render/Railway (staging)                     | Endpoint bisa diakses dari luar localhost              |
| 0.3 | Setup project Next.js (App Router), struktur folder dasar                  | Halaman kosong bisa deploy ke Vercel                   |
| 0.4 | Koneksikan Next.js → FastAPI (1 endpoint, tanpa styling)                   | Data JSON tampil di halaman Next.js                    |
| 0.5 | Setup environment variables (API URL, secrets) di kedua platform           | `.env.example` terdokumentasi                          |

**Definition of Done:** Buka URL Vercel, halaman menampilkan data mentah hasil `/api/analyze/BBCA` dari backend.

---

### 🔹 Fase 1 — Core: Analisis Teknikal per Saham

**Tujuan:** Fitur pertama yang benar-benar dipakai user.

| #   | Task                                                                                 | Output                                      |
| --- | ------------------------------------------------------------------------------------ | ------------------------------------------- |
| 1.1 | Endpoint `/api/analyze/{ticker}` lengkap (harga, RSI, MACD, SMA, support/resistance) | Response JSON terstruktur                   |
| 1.2 | Halaman `/analyze/[ticker]` — search box input ticker                                | User bisa input "BBCA" dan submit           |
| 1.3 | Komponen chart candlestick (lightweight-charts)                                      | Chart harga historis tampil                 |
| 1.4 | Panel indikator teknikal (RSI, MACD, dst) dalam bentuk visual, bukan teks            | Gauge/label warna (bullish/bearish/neutral) |
| 1.5 | Error handling (ticker invalid, data kosong)                                         | Pesan error yang jelas, bukan crash         |

**Definition of Done:** User bisa cari saham, lihat chart + indikator teknikal dengan tampilan yang jelas dan responsif di mobile.

---

### 🔹 Fase 2 — Screener Saham

**Tujuan:** User bisa menyaring 900+ saham berdasarkan kriteria.

| #   | Task                                                                               | Output                                              |
| --- | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| 2.1 | Endpoint `/api/screen` (support preset: oversold, breakout, dll + custom criteria) | Backend bisa filter sesuai query                    |
| 2.2 | Caching hasil screening (Redis atau in-memory dengan TTL)                          | Tidak hit Yahoo Finance berulang untuk request sama |
| 2.3 | Halaman `/screen` dengan filter UI (dropdown preset + input custom)                | User pilih kriteria lewat UI, bukan command         |
| 2.4 | Tabel hasil sortable/filterable (`@tanstack/table`)                                | Bisa sort by RSI, PE, volume, dst                   |
| 2.5 | Pilihan universe (LQ45/IDX80/Popular/All) dengan indikasi waktu proses             | User tahu "All" akan lebih lambat                   |

**Definition of Done:** User bisa screening saham LQ45 dengan kriteria oversold dalam <5 detik, hasil di tabel yang bisa di-sort.

---

### 🔹 Fase 3 — Trading Plan Generator

**Tujuan:** Output actionable, bukan cuma data mentah.

| #   | Task                                                        | Output                              |
| --- | ----------------------------------------------------------- | ----------------------------------- |
| 3.1 | Endpoint `/api/plan/{ticker}` dengan parameter account size | TP1/TP2/TP3, SL, position sizing    |
| 3.2 | Halaman/komponen trading plan card                          | Visual card dengan progress bar R:R |
| 3.3 | Input account size dan risk tolerance (default 2%)          | User bisa custom position sizing    |

**Definition of Done:** User input ticker + modal, dapat trading plan visual lengkap dengan risk/reward yang mudah dibaca.

---

### 🔹 Fase 4 — AI Insight

**Tujuan:** Analisis naratif otomatis, tanpa setup rumit dari sisi user.

| #   | Task                                                                                   | Output                                                 |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 4.1 | API route Next.js untuk panggil LLM langsung (server-side, API key aman)               | `/api/ai-insight`                                      |
| 4.2 | Integrasikan insight ke halaman analisis (kirim data teknikal → AI → tampilkan narasi) | Insight muncul otomatis di halaman `/analyze/[ticker]` |
| 4.3 | Rate limiting / caching insight per ticker per jam (kontrol biaya API)                 | Tidak boleh generate ulang tiap refresh                |
| 4.4 | Disclaimer AI yang jelas di UI                                                         | "Bukan nasihat keuangan" tampil di setiap output AI    |

**Definition of Done:** Halaman analisis saham menampilkan ringkasan naratif AI otomatis, dengan biaya API terkendali.

---

### 🔹 Fase 5 — SAPTA (Pre-markup Detection)

**Tujuan:** Fitur diferensiasi paling kompleks — dikerjakan setelah fondasi stabil.

| #   | Task                                                                                   | Output                                |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------- |
| 5.1 | Endpoint `/api/sapta/{ticker}` (wrap engine + model .pkl yang sudah ada)               | Skor + breakdown 6 modul              |
| 5.2 | Halaman detail SAPTA dengan visualisasi skor (radial gauge, bar chart breakdown modul) | Tampilan visual, bukan teks ASCII     |
| 5.3 | Fitur scan multi-saham (LQ45/IDX80/dst) dengan progress indicator                      | User tahu proses scan sedang berjalan |
| 5.4 | Dokumentasi metodologi SAPTA untuk user (transparansi)                                 | Tooltip/halaman "Cara Kerja SAPTA"    |

**Definition of Done:** User bisa scan LQ45 untuk kandidat pre-markup dan lihat breakdown skor per saham secara visual.

---

### 🔹 Fase 6 — Bandarmology (Broker Flow)

**Tujuan:** Fitur paling kompleks secara operasional — dikerjakan terakhir.

| #   | Task                                                                                                        | Output                                                     |
| --- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 6.1 | Solusi autentikasi Stockbit yang tidak manual per-user (evaluasi ulang, ini risiko besar — lihat Section 7) | Keputusan: proxy internal, atau fitur ini di-drop untuk v1 |
| 6.2 | Endpoint `/api/broker/{ticker}`                                                                             | Data broker summary + bandar detector                      |
| 6.3 | Halaman visualisasi broker flow + pattern alerts                                                            | Chart komposisi broker, alert list                         |

**Definition of Done:** _(kondisional — tergantung hasil evaluasi 6.1)_

---

### 🔹 Fase 7 — Polish & Production Readiness

| #   | Task                                            | Output                                                    |
| --- | ----------------------------------------------- | --------------------------------------------------------- |
| 7.1 | Loading states & skeleton UI di semua halaman   | UX tidak terasa "kosong" saat fetch                       |
| 7.2 | Responsive design audit (mobile-first check)    | Semua fitur usable di layar kecil                         |
| 7.3 | Monitoring/error tracking (Sentry atau sejenis) | Tim tahu kalau ada error production                       |
| 7.4 | Rate limiting API publik (cegah abuse)          | Backend tidak down karena scraping berlebihan             |
| 7.5 | Legal/disclaimer page                           | Sesuai disclaimer asli Pulse CLI (bukan nasihat keuangan) |

---

## 6. Ringkasan Urutan (Roadmap View)

```
Fase 0: Setup           ──► Fase 1: Technical Analysis ──► Fase 2: Screener
                                                                    │
Fase 5: SAPTA  ◄──────────────── Fase 3: Trading Plan ◄────────────┘
    │
    ▼
Fase 6: Bandarmology (kondisional) ──► Fase 7: Polish & Production
                                              ▲
                          Fase 4: AI Insight ─┘ (bisa paralel dengan Fase 2/3)
```

**Catatan urutan:** Fase 4 (AI Insight) bisa dikerjakan paralel dengan Fase 2/3 karena tidak saling bergantung — cocok untuk kerja dua track sekaligus kalau ada lebih dari satu kontributor.

---

## 7. Risiko & Keputusan yang Perlu Diambil Lebih Awal

| Risiko                                             | Dampak                                          | Mitigasi                                                                                                           |
| -------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Rate limit Yahoo Finance saat screening 900+ saham | Screener gagal/lambat                           | Caching agresif (TTL 1 jam), batch processing                                                                      |
| Token Stockbit manual, expired tiap 24 jam         | Fitur bandarmology tidak scalable ke multi-user | **Keputusan awal diperlukan:** apakah fitur ini di-drop di v1, atau dibuat single-token internal (bukan per-user)? |
| Biaya API LLM membengkak                           | Cost tidak terkendali                           | Cache insight per ticker/jam, rate limit per user                                                                  |
| SAPTA model (.pkl) sudah di-train dengan data lama | Akurasi menurun seiring waktu                   | Jadwalkan retraining berkala (di luar scope v1, catat sebagai tech debt)                                           |
| Ekspektasi user soal "trading otomatis"            | Miskomunikasi produk, risiko reputasi/hukum     | Disclaimer jelas di setiap halaman output AI/plan                                                                  |

---

## 8. Yang TIDAK Termasuk di Dokumen Ini

- Spesifikasi UI/UX detail (wireframe, design system) — dokumen terpisah
- Estimasi waktu per task (durasi tergantung kapasitas tim/individu, PM perlu isi setelah kickoff)
- Skema database detail (kalau nanti butuh user accounts/watchlist tersimpan)

---

_Dokumen ini adalah living document — update tiap fase selesai dengan catatan retrospektif singkat sebelum lanjut ke fase berikutnya._
