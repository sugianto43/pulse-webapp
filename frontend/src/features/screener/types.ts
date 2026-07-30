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

export type ScreenParams = {
  universe: string;
  preset?: string;
  criteria?: string;
};
