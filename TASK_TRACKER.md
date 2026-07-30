# Task Tracker — Pulse Web

> Turunan dari `PRD-Pulse-WebApp.md`. Update checkbox tiap task selesai. Fase 4 boleh paralel dengan Fase 2/3.

---

## Fase 0 — Fondasi Teknis

- [x] Setup repo FastAPI, wrap fungsi core `analyze_technical` (dari `pulse/core/`) jadi endpoint `GET /api/analyze/{ticker}`. Test via Postman. — `backend/app/main.py`, verified via curl.
- [x] Setup CORS di FastAPI. — done (`CORSMiddleware`, origin dari `PULSE_WEB_CORS_ORIGINS`). Deploy ke Render/Railway staging **belum** — butuh akun/kredensial user.
- [x] Setup project Next.js (App Router), buat struktur folder dasar. — `frontend/`. Deploy ke Vercel **belum** — butuh akun user.
- [x] Konekkan Next.js ke FastAPI untuk 1 endpoint (tanpa styling). Tampilkan data JSON mentah di halaman. — `frontend/src/app/page.tsx`, verified render BBCA.
- [x] Setup environment variables (API URL, secrets) di Next.js dan FastAPI. Buat `.env.example` terdokumentasi. — `backend/.env.example`, `frontend/.env.example`.

**DoD:** Buka URL Vercel, halaman menampilkan data mentah hasil `/api/analyze/BBCA` dari backend.

---

## Fase 1 — Core: Analisis Teknikal per Saham

- [x] Lengkapi endpoint `/api/analyze/{ticker}`: harga, RSI, MACD, SMA, support/resistance. Response JSON terstruktur. — sudah termasuk `history` OHLCV untuk chart.
- [x] Buat halaman `/analyze/[ticker]` dengan search box input ticker. — `frontend/src/app/analyze/[ticker]/page.tsx` + `components/SearchBox.tsx`.
- [x] Buat komponen chart candlestick pakai `lightweight-charts`, tampilkan harga historis. — `components/PriceChart.tsx` (v5 API, responsive resize).
- [x] Buat panel indikator teknikal visual (gauge/label warna bullish/bearish/neutral), bukan teks mentah. — `components/IndicatorPanel.tsx` (Trend, Signal, RSI, MACD, SMA20/50, support/resistance).
- [x] Tambahkan error handling untuk ticker invalid / data kosong — pesan jelas, bukan crash. — `lib/api.ts` (`ApiError`) + error UI di halaman analyze, search box tetap tersedia untuk cari ulang.

**DoD:** User bisa cari saham, lihat chart + indikator teknikal, tampilan jelas dan responsif di mobile.

---

## Fase 2 — Screener Saham

- [x] Buat endpoint `/api/screen`, support preset (oversold, breakout, dll) + custom criteria. — reuse `StockScreener` dari Pulse-CLI core.
- [x] Tambahkan caching hasil screening (Redis atau in-memory dengan TTL) — hindari hit Yahoo Finance berulang. — in-memory TTL 1 jam (`PULSE_WEB_SCREEN_CACHE_TTL`).
- [x] Buat halaman `/screen` dengan filter UI (dropdown preset + input custom). — `frontend/src/app/screen/page.tsx`.
- [x] Buat tabel hasil sortable/filterable pakai `@tanstack/table` (sort by RSI, PE, volume, dst). — `components/ScreenerTable.tsx`.
- [x] Tambahkan pilihan universe (LQ45/IDX80/Popular/All) dengan indikasi waktu proses. — dropdown + label estimasi kecepatan per universe, elapsed time ditampilkan setelah scan.

**DoD:** User bisa screening saham LQ45 kriteria oversold dalam <5 detik, hasil di tabel yang bisa di-sort.

---

## Fase 3 — Trading Plan Generator

- [x] Buat endpoint `/api/plan/{ticker}` dengan parameter account size. Output: TP1/TP2/TP3, SL, position sizing. — reuse `TradingPlanGenerator` dari Pulse-CLI core.
- [x] Buat komponen trading plan card — visual dengan progress bar R:R. — `components/TradingPlanCard.tsx`.
- [x] Tambahkan input account size dan risk tolerance (default 2%). — `components/TradingPlanForm.tsx`, default Rp100jt / 2%.

**DoD:** User input ticker + modal, dapat trading plan visual lengkap dengan risk/reward yang mudah dibaca.

---

## Fase 4 — AI Insight (bisa paralel dengan Fase 2/3)

- [x] Buat API route Next.js untuk panggil LLM langsung, server-side, API key aman (`/api/ai-insight`). — pakai Claude Haiku 4.5 (kontrol biaya), `ANTHROPIC_API_KEY` server-side only.
- [x] Integrasikan insight ke halaman `/analyze/[ticker]`: kirim data teknikal → LLM → tampilkan narasi otomatis. — `AiInsightCard`, auto-fetch via TanStack Query.
- [x] Tambahkan rate limiting/caching insight per ticker per jam — kontrol biaya API. — `lib/ttl-cache.ts`, TTL 1 jam per ticker di route handler.
- [x] Tambahkan disclaimer AI yang jelas di UI ("Bukan nasihat keuangan") di setiap output AI. — tampil di bawah tiap narasi AI.

**DoD:** Halaman analisis saham menampilkan ringkasan naratif AI otomatis, biaya API terkendali.

---

## Fase 5 — SAPTA (Pre-markup Detection)

- [x] Buat endpoint `/api/sapta/{ticker}`, wrap engine + model `.pkl` yang sudah ada. Output skor + breakdown 6 modul. — reuse `SaptaEngine`, Broker Flow (modul 7) di-disable (butuh Stockbit, Fase 6).
- [x] Buat halaman detail SAPTA dengan visualisasi skor (radial gauge, bar chart breakdown modul). — `SaptaScoreGauge` (SVG) + `SaptaModuleBreakdown`.
- [x] Buat fitur scan multi-saham (LQ45/IDX80/dst) dengan progress indicator. — `/sapta`, indikator "sedang scan" + elapsed time.
- [x] Buat dokumentasi metodologi SAPTA untuk user (tooltip/halaman "Cara Kerja SAPTA"). — `SaptaMethodologyInfo` (accordion).

**DoD:** User bisa scan LQ45 untuk kandidat pre-markup dan lihat breakdown skor per saham secara visual.

---

## Fase 6 — Bandarmology (Broker Flow) — kondisional

- [x] **Keputusan awal dulu:** evaluasi solusi autentikasi Stockbit non-manual per-user. Putuskan: proxy internal, atau drop fitur ini untuk v1 (risiko besar, lihat Section 7 PRD). — pakai manual token (`STOCKBIT_TOKEN`, expired ~24 jam), sesuai rekomendasi resmi Pulse-CLI sendiri (`.env.example` Option 1). Auto-login (Playwright) ditolak — risiko ban akun ToS violation. User pakai akun Stockbit sampingan untuk mitigasi.
- [x] Buat endpoint `/api/broker/{ticker}` — data broker summary + bandar detector. — reuse `BandarmologyEngine`, 503 graceful kalau token belum/expired.
- [x] Buat halaman visualisasi broker flow + pattern alerts (chart komposisi broker, alert list). — `BrokerScoreCards`, `BrokerCompositionBar`, `BrokerPatternAlerts` di `/broker/[ticker]`, link ditambahkan dari halaman analyze.

**DoD:** Kondisional — tergantung hasil evaluasi keputusan auth Stockbit. Selesai dengan strategi manual-token.

---

## Fase 7 — Polish & Production Readiness

- [x] Tambahkan loading states & skeleton UI di semua halaman. — `Skeleton` primitive (`components/Skeleton.tsx`) + per-feature skeleton komponen (analyze via Next `loading.tsx`, plan/sapta/broker/screener via isLoading branch).
- [x] Audit responsive design (mobile-first check) di semua fitur. — sudah konsisten pakai grid-cols-1/2 sm:grid-cols-N, flex-wrap, overflow-x-auto sejak fase-fase sebelumnya; tidak ada fix yang diperlukan.
- [x] Setup monitoring/error tracking (Sentry atau sejenis). — `@sentry/nextjs` (instrumentation.ts + instrumentation-client.ts) di frontend, `sentry-sdk[fastapi]` di backend (`app/main.py`). Disabled secara default (DSN kosong), aman untuk local dev.
- [x] Tambahkan rate limiting API publik — cegah abuse/scraping berlebihan. — `slowapi` `SlowAPIMiddleware`, default 60/menit per-IP (`app/rate_limit.py`), didaftarkan sebelum `CORSMiddleware` supaya CORS tetap membungkus response 429.
- [x] Buat halaman legal/disclaimer sesuai disclaimer asli Pulse CLI (bukan nasihat keuangan). — `/legal`, linked dari `Footer` global di root layout.

---

## Fase 8 — Automated Test Suite

Ditambahkan di luar rencana awal PRD — sebelum Fase 7, seluruh proyek nol automated test (hanya manual `tsc`/`eslint`/curl per fase). Gap ini ditemukan saat retrospektif "apa langkah selanjutnya" setelah Fase 7 selesai.

- [x] Setup pytest di backend (`pytest.ini`, `tests/conftest.py` dengan `TestClient` + rate-limiter reset per test).
- [x] Test `app/serializers.py` (`clean_nan_deep`) dan `app/cache.py` (`TTLCache`) — pure logic, 12 test.
- [x] Test semua router (`analyze`, `screen`, `plan`, `sapta`, `broker`) dengan Pulse-CLI engine di-mock (`monkeypatch` + `AsyncMock`) — termasuk regression guard untuk bug route-ordering `/sapta/scan` vs `/sapta/{ticker}` dari Fase 5. 26 test.
- [x] Setup Vitest di frontend (`vitest.config.ts` pakai `resolve.tsconfigPaths` native, `@testing-library/react`, `jsdom`), shared `createQueryClientWrapper` di `src/test/react-query.tsx`.
- [x] Test granular hooks (query/mutation, satu per fitur: screener/sapta/trading-plan/broker/ai-insight) dan composing hooks (`useScreener`, `useSaptaScan`, `useTradingPlan`) — 20 test, meng-cover sukses, error mapping ke pesan `ApiError`, dan parameter yang di-forward ke `api.ts`.

**DoD:** `pytest` (backend) dan `vitest run` (frontend) hijau, jadi regresi di router/hook logic tertangkap otomatis, bukan cuma lewat review manual.

---

## Risiko Perlu Keputusan Awal (Section 7 PRD)

- Rate limit Yahoo Finance saat screening 900+ saham → mitigasi: caching agresif (TTL 1 jam), batch processing.
- Token Stockbit manual, expired 24 jam → keputusan: drop fitur bandarmology di v1, atau single-token internal.
- Biaya API LLM membengkak → mitigasi: cache insight per ticker/jam, rate limit per user.
- Model SAPTA (.pkl) data lama → catat sebagai tech debt, jadwalkan retraining di luar scope v1.
- Ekspektasi user soal "trading otomatis" → disclaimer jelas di tiap halaman output AI/plan.
