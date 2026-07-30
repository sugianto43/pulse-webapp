/** Minimal technical snapshot sent to the AI insight route — just enough for a narrative. */
export type AiInsightRequest = {
  ticker: string;
  current_price: number;
  change_percent: number;
  trend: string;
  signal: string;
  rsi_14: number | null;
  macd: number | null;
  macd_signal: number | null;
  sma_20: number | null;
  sma_50: number | null;
  support_1: number | null;
  resistance_1: number | null;
};

export type AiInsightResponse = {
  narrative: string;
  cached: boolean;
};
