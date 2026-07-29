export type OHLCV = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockPrice = {
  ticker: string;
  name: string | null;
  sector: string | null;
  industry: string | null;
  current_price: number;
  previous_close: number;
  change: number;
  change_percent: number;
  volume: number;
  avg_volume: number;
  day_low: number;
  day_high: number;
  week_52_low: number;
  week_52_high: number;
  market_cap: number | null;
  shares_outstanding: number | null;
  history: OHLCV[];
  fetched_at: string;
};

export type TechnicalIndicators = {
  ticker: string;
  calculated_at: string;
  sma_20: number | null;
  sma_50: number | null;
  sma_200: number | null;
  ema_9: number | null;
  ema_21: number | null;
  ema_55: number | null;
  rsi_14: number | null;
  macd: number | null;
  macd_signal: number | null;
  macd_histogram: number | null;
  stoch_k: number | null;
  stoch_d: number | null;
  bb_upper: number | null;
  bb_middle: number | null;
  bb_lower: number | null;
  bb_width: number | null;
  atr_14: number | null;
  obv: number | null;
  vwap: number | null;
  mfi_14: number | null;
  volume_sma_20: number | null;
  support_1: number | null;
  support_2: number | null;
  resistance_1: number | null;
  resistance_2: number | null;
  trend: "Bullish" | "Bearish" | "Sideways";
  signal: "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";
};

export type AnalyzeResponse = {
  ticker: string;
  price: StockPrice;
  indicators: TechnicalIndicators;
};

export type ScreenResult = {
  ticker: string;
  name: string | null;
  sector: string | null;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  avg_volume: number;
  rsi_14: number | null;
  macd: number | null;
  macd_signal: number | null;
  macd_histogram: number | null;
  sma_20: number | null;
  sma_50: number | null;
  bb_upper: number | null;
  bb_lower: number | null;
  bb_middle: number | null;
  stoch_k: number | null;
  stoch_d: number | null;
  pe_ratio: number | null;
  pb_ratio: number | null;
  roe: number | null;
  dividend_yield: number | null;
  market_cap: number | null;
  earnings_growth: number | null;
  revenue_growth: number | null;
  support: number | null;
  resistance: number | null;
  score: number;
  signals: string[];
  volume_ratio: number;
  market_cap_category: string;
  rsi_status: string;
  macd_status: string;
};

export type ScreenResponse = {
  cached: boolean;
  count: number;
  results: ScreenResult[];
};

export type ScreenPresetInfo = { value: string; description: string };

export type ScreenPresetsResponse = {
  presets: ScreenPresetInfo[];
  universes: string[];
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function analyzeTicker(ticker: string): Promise<AnalyzeResponse> {
  const clean = ticker.trim();
  if (!clean) {
    throw new ApiError(400, "Masukkan kode ticker terlebih dahulu.");
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/analyze/${encodeURIComponent(clean)}`, {
      cache: "no-store",
    });
  } catch {
    throw new ApiError(503, "Tidak bisa menghubungi server. Coba lagi nanti.");
  }

  if (!res.ok) {
    let detail = `Gagal memuat data untuk "${clean}".`;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
    } catch {
      // ignore, use default message
    }
    throw new ApiError(res.status, detail);
  }

  return res.json();
}

export async function getScreenPresets(): Promise<ScreenPresetsResponse> {
  const res = await fetch(`${API_URL}/api/screen/presets`, { cache: "no-store" });
  if (!res.ok) {
    throw new ApiError(res.status, "Gagal memuat daftar preset screener.");
  }
  return res.json();
}

export async function screenStocks(params: {
  universe: string;
  preset?: string;
  criteria?: string;
  limit?: number;
}): Promise<ScreenResponse> {
  const query = new URLSearchParams({ universe: params.universe });
  if (params.preset) query.set("preset", params.preset);
  if (params.criteria) query.set("criteria", params.criteria);
  if (params.limit) query.set("limit", String(params.limit));

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/screen?${query.toString()}`, { cache: "no-store" });
  } catch {
    throw new ApiError(503, "Tidak bisa menghubungi server. Coba lagi nanti.");
  }

  if (!res.ok) {
    let detail = "Gagal menjalankan screening.";
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
    } catch {
      // ignore, use default message
    }
    throw new ApiError(res.status, detail);
  }

  return res.json();
}
