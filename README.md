# Radar Saham

Radar Saham adalah aplikasi web analisis saham IDX (Bursa Efek Indonesia) yang menggabungkan analisis teknikal, screener, trading plan otomatis, deteksi fase pre-markup (SAPTA), dan analisis bandarmology (broker flow) dalam satu tempat — dilengkapi ringkasan AI dan penjelasan istilah untuk pemula.

> **Disclaimer:** Aplikasi ini untuk tujuan edukasi dan informasi, **bukan nasihat keuangan**. Semua skor dan sinyal dihasilkan dari model statistik/machine learning berbasis data historis, bisa salah, dan tidak menjamin hasil di masa depan. Selalu lakukan riset sendiri (DYOR) dan berinvestasilah sesuai profil risiko Anda.

---

## Daftar Isi

- [Fitur-fitur](#fitur-fitur)
- [Tech Stack](#tech-stack)
- [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)

---

## Fitur-fitur

Setiap fitur ditulis dengan asumsi Anda baru mengenal dunia saham — istilah teknis dijelaskan singkat di tempat pertama kali muncul. Aplikasi sendiri juga punya kotak "Istilah di Halaman Ini" (bisa diklik untuk dibuka) di setiap halaman yang relevan.

### 1. Analisis Teknikal (`/analyze/[ticker]`)

Masukkan kode saham (ticker, misalnya `BBCA` untuk Bank Central Asia) untuk melihat:

- **Grafik candlestick** — grafik harga historis, tiap "lilin" mewakili pergerakan harga dalam satu hari (buka, tertinggi, terendah, tutup).
- **Indikator teknikal**, semuanya dihitung otomatis dari data harga:
  - **RSI (Relative Strength Index)** — angka 0-100 yang mengukur momentum. Di bawah 30 disebut *oversold* (jenuh jual, berpotensi rebound/pantul naik), di atas 70 disebut *overbought* (jenuh beli, berpotensi koreksi/turun).
  - **MACD** — mengukur perubahan momentum tren dari selisih dua rata-rata bergerak. Kalau garis MACD di atas garis sinyalnya, itu tanda momentum sedang menguat.
  - **SMA (Simple Moving Average)** 20 & 50 hari — rata-rata harga N hari terakhir, dipakai buat melihat arah tren secara umum. Harga di atas SMA biasanya menandakan tren naik.
  - **Support & Resistance** — Support adalah level harga yang cenderung "menahan" penurunan (area di mana pembeli biasanya masuk). Resistance adalah level yang cenderung "menahan" kenaikan (area di mana penjual biasanya muncul).
  - **Trend & Signal** — kesimpulan otomatis: Trend (Bullish/naik, Bearish/turun, atau Sideways/mendatar) dan Signal (rekomendasi aksi: Buy/Sell/Neutral) berdasarkan kombinasi indikator di atas.
- **AI Insight** — ringkasan naratif singkat dari kondisi saham saat ini, dibuat otomatis oleh Google Gemini berdasarkan angka-angka indikator di atas. Selalu disertai catatan bahwa ini bukan nasihat keuangan.

### 2. Screener Saham (`/screen`)

Menyaring ratusan saham sekaligus berdasarkan kriteria tertentu, jadi Anda tidak perlu mengecek satu-satu.

- **Universe** — cakupan saham yang di-scan: LQ45 (~45 saham paling likuid, cepat), IDX80 (~80 saham), Populer (~110 saham), atau Semua (900+ saham, bisa beberapa menit).
- **Preset** — kriteria siap pakai, misalnya "Oversold" (RSI rendah), "Breakout" (harga menembus resistance), "Momentum" (tren kuat), dll.
- **Kriteria custom** — buat kriteria sendiri dengan sintaks sederhana, misalnya `rsi<30 and volume>1000000`.
- Hasil ditampilkan sebagai tabel yang bisa diurutkan (klik header kolom), termasuk **Volume Ratio** (perbandingan volume transaksi hari ini vs rata-rata — di atas 1x berarti lebih ramai dari biasanya) dan **Score** (skor gabungan seberapa cocok saham itu dengan kriteria yang dipilih).

### 3. Trading Plan (`/plan/[ticker]`)

Menghasilkan rencana trading lengkap secara otomatis untuk satu saham:

- **Entry** — harga beli yang disarankan.
- **TP (Take Profit)** 1/2/3 — level harga untuk mengambil untung, dari target konservatif (TP1) sampai agresif (TP3) kalau tren berlanjut.
- **SL (Stop Loss)** — level harga untuk keluar posisi kalau salah arah, dihitung dari level teknikal (ATR/support), supaya kerugian terbatas.
- **R:R (Risk:Reward)** — perbandingan potensi rugi vs potensi untung. R:R 1:2 artinya kalau rugi Rp 1, potensi untungnya Rp 2 — makin tinggi makin bagus.
- **Position Sizing** — berapa lot (1 lot = 100 lembar saham) yang aman dibeli berdasarkan ukuran akun dan "Risk per Trade" (berapa persen akun yang rela Anda risikokan per transaksi) yang Anda atur sendiri. **Catatan penting:** parameter risk ini hanya mengatur *jumlah lot*, bukan level Stop Loss — SL selalu dihitung dari data teknikal, bukan dari toleransi risiko Anda.
- **Trade Quality & Confidence** — penilaian otomatis seberapa bagus setup trade ini (Excellent/Good/Fair/Poor) dan seberapa yakin sistem terhadap penilaian itu.

### 4. SAPTA — Deteksi Fase Pre-Markup (`/sapta`, `/sapta/[ticker]`)

SAPTA adalah mesin skor (0-100) yang mencoba mendeteksi saham yang sedang di **fase pre-markup** — yaitu fase sebelum harga breakout/naik signifikan, saat pihak besar biasanya masih diam-diam mengumpulkan saham. Skor ini digabung dari 6 modul analisis:

| Modul | Yang dideteksi |
|---|---|
| **Supply Absorption** | Pola akumulasi smart money — higher lows, kekuatan penutupan, dan volume. |
| **Compression** | Kontraksi volatilitas (ATR menurun) sebelum ekspansi harga. |
| **BB Squeeze** | Bollinger Band yang menyempit, menandakan potensi pergerakan besar akan datang. |
| **Elliott Wave** | Posisi gelombang Elliott dan level retracement Fibonacci. |
| **Time Projection** | Proyeksi window waktu breakout berdasarkan siklus Fibonacci. |
| **Anti-Distribution** | Filter pola distribusi (potensi *false breakout*) supaya sinyal lebih bersih. |

Status akhir dikategorikan: **PRE-MARKUP** (siap breakout), **SIAP** (hampir siap), **WATCHLIST** (pantau), atau **ABAIKAN** (skip). Ada juga fitur **scan** multi-saham (per universe) untuk mencari kandidat pre-markup sekaligus, mirip Screener tapi khusus skor SAPTA.

### 5. Broker Flow — Bandarmology (`/broker/[ticker]`)

**Bandarmology** adalah analisis pola transaksi antar broker untuk menebak apakah "pemain besar" (institusi/bandar) sedang mengumpulkan (akumulasi) atau melepas (distribusi) suatu saham — berbeda dari analisis teknikal biasa yang hanya melihat harga.

- **Smart Money & Bandar** — kelompok broker yang secara historis konsisten profit/menggerakkan harga, dianggap merepresentasikan investor besar, bukan investor retail biasa.
- **Flow Momentum & Markup Readiness** — seberapa kuat arus beli bersih belakangan ini, dan seberapa siap saham ini untuk naik berdasarkan pola akumulasi.
- **Komposisi Broker** — persentase & nilai transaksi bersih per kategori broker (Smart Money, Bandar, Institusi Lokal, Market Maker, Retail).
- **Accumulation Phase** — fase akumulasi (mengumpulkan diam-diam) vs distribusi (melepas), lengkap dengan *pattern alerts* (peringatan pola tertentu, misalnya lonjakan pembelian satu broker tertentu).
- **Catatan:** fitur ini butuh token Stockbit manual (`STOCKBIT_TOKEN`) yang harus di-refresh sendiri tiap ~24 jam — lihat bagian [instalasi](#3-siapkan-environment-variables) di bawah. Tanpa token, halaman ini akan menampilkan pesan error yang jelas (bukan crash).

### Fitur pendukung lainnya

- **Pencarian ticker** di setiap halaman (kotak cari di bagian atas) — ketik kode saham lalu tekan Enter/klik Cari, langsung menuju halaman analisis saham tersebut.
- **Navigasi antar-fitur** — navbar di bagian atas (akses cepat ke Screener & SAPTA Scan) dan tab-tab (Analisis/Trading Plan/SAPTA/Broker Flow) di setiap halaman per-saham, supaya mudah berpindah tanpa perlu ketik URL manual.
- **Kotak "Istilah di Halaman Ini"** — accordion yang bisa dibuka di tiap halaman berisi penjelasan istilah teknis yang dipakai di halaman itu, ditulis untuk pemula.
- **Halaman Disclaimer** (`/legal`) — penjelasan lengkap bahwa aplikasi ini untuk edukasi, bukan nasihat keuangan.

---

## Tech Stack

Monorepo dengan 3 bagian: `frontend/` (Next.js), `backend/` (FastAPI), dan `Pulse-CLI/` (core logic analisis saham, vendored dari repo terpisah — lihat [prasyarat](#1-clone-repository)).

### Frontend (`frontend/`)

| Teknologi | Kegunaan |
|---|---|
| [Next.js 16](https://nextjs.org) (App Router) | Framework React, routing berbasis folder |
| React 19 + TypeScript | UI dan type safety |
| [TanStack Query v5](https://tanstack.com/query) | Data fetching, caching, dan state server (setiap fitur punya hook query/mutation sendiri) |
| [TanStack Table v8](https://tanstack.com/table) | Tabel screener & SAPTA scan (sortable) |
| [axios](https://axios-http.com) | HTTP client ke backend FastAPI |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling utility-first, termasuk dark mode |
| [lightweight-charts](https://tradingview.github.io/lightweight-charts/) | Grafik candlestick di halaman analisis |
| [@google/genai](https://ai.google.dev) (Gemini `gemini-flash-lite-latest`) | AI Insight — dipanggil langsung dari route handler Next.js (server-side), API key tidak pernah sampai ke browser |
| [@sentry/nextjs](https://sentry.io) | Error tracking (opsional, disabled kalau DSN kosong) |
| [Vitest](https://vitest.dev) + React Testing Library | Unit test untuk hooks (granular query/mutation + composing hooks per fitur) |

### Backend (`backend/`)

| Teknologi | Kegunaan |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com) | REST API, satu router per domain (`analyze`, `screen`, `plan`, `sapta`, `broker`) |
| **Pulse-CLI** (vendored, lihat catatan di atas) | Semua logic analisis inti (indikator teknikal, screener, trading plan, SAPTA, bandarmology) — backend hanya membungkusnya jadi endpoint HTTP, tidak reimplement logic |
| pydantic / pydantic-settings | Validasi request & konfigurasi env var |
| yfinance | Sumber data harga saham |
| httpx (dipakai Pulse-CLI) | Client async ke Stockbit (untuk fitur broker flow) |
| scikit-learn / XGBoost (dipakai Pulse-CLI) | Model ML untuk skor SAPTA |
| [slowapi](https://github.com/laurentS/slowapi) | Rate limiting per-IP (default 60 request/menit) |
| [sentry-sdk](https://docs.sentry.io/platforms/python/integrations/fastapi/) | Error tracking (opsional, disabled kalau DSN kosong) |
| [pytest](https://pytest.org) | Unit test untuk semua router (engine di-mock) + utility (cache, serializer) |

---

## Cara Menjalankan Aplikasi

### Prasyarat

- **Node.js** 20.9+ dan npm
- **Python** 3.13 (atau 3.11+ kemungkinan besar juga jalan, tapi belum diuji)
- **Git** dengan akses SSH ke repo **Pulse-CLI** — repo ini privat/terpisah dan jadi dependency inti backend. Tanpa akses ini, `pip install` backend akan gagal.
- **(Opsional)** API key [Google Gemini](https://aistudio.google.com/apikey) — untuk fitur AI Insight. Tanpa ini, seluruh app tetap jalan normal, hanya AI Insight yang akan gagal dengan pesan error.
- **(Opsional)** Token Stockbit manual — untuk fitur Broker Flow. Tanpa ini, halaman Broker Flow menampilkan pesan error 503 yang jelas, fitur lain tidak terpengaruh.
- **(Opsional)** Akun [Sentry](https://sentry.io) — untuk error tracking di frontend & backend. Kosongkan env var terkait untuk disable, semua fitur lain tetap jalan normal.

### 1. Clone repository

```bash
git clone <url-repo-ini> pulse-webapp
cd pulse-webapp
```

Backend bergantung pada Pulse-CLI sebagai *editable git dependency* (didaftarkan di `backend/requirements.txt`), jadi akan otomatis ter-clone saat `pip install` selama SSH Anda punya akses ke repo tersebut.

### 2. Setup Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

### 3. Siapkan Environment Variables

Isi `backend/.env` (semua opsional kecuali `PULSE_WEB_CORS_ORIGINS` yang sudah punya default):

```env
PULSE_WEB_CORS_ORIGINS=http://localhost:3000
STOCKBIT_TOKEN=            # opsional — untuk fitur Broker Flow, refresh manual tiap ~24 jam
SENTRY_DSN=                 # opsional — kosongkan untuk disable
PULSE_WEB_RATE_LIMIT_DEFAULT=60/minute
```

Isi `frontend/.env.local` (copy dari `frontend/.env.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
GEMINI_API_KEY=              # opsional — untuk fitur AI Insight
SENTRY_DSN=                  # opsional
NEXT_PUBLIC_SENTRY_DSN=      # opsional, harus sama dengan SENTRY_DSN di atas
```

### 4. Jalankan Backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Backend berjalan di `http://localhost:8000`. Cek dengan `curl http://localhost:8000/api/health`.

> Catatan: saat startup mungkin muncul warning `Could not load ML model: No module named '_loss'` — ini karena mismatch versi scikit-learn dengan model `.pkl` yang sudah dilatih sebelumnya. Tidak fatal; SAPTA tetap jalan pakai skor berbasis aturan (rule-based) tanpa bobot ML.

### 5. Jalankan Frontend

Di terminal terpisah:

```bash
cd frontend
npm install
npm run dev
```

Buka `http://localhost:3000` di browser.

### 6. Menjalankan Test (opsional)

```bash
# Backend
cd backend && source .venv/bin/activate && pytest

# Frontend
cd frontend && npm run test
```

### Perintah lain yang berguna (frontend)

```bash
npm run lint          # ESLint
npm run format        # Prettier — auto-fix
npm run format:check  # Prettier — cek saja
npm run build         # Production build
```
