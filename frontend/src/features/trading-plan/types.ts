export type TradingPlan = {
  ticker: string;
  generated_at: string;
  entry_price: number;
  entry_type: string;
  tp1: number;
  tp1_percent: number;
  tp2: number | null;
  tp2_percent: number | null;
  tp3: number | null;
  tp3_percent: number | null;
  stop_loss: number;
  stop_loss_percent: number;
  stop_loss_method: string;
  risk_amount: number;
  reward_tp1: number;
  reward_tp2: number | null;
  rr_ratio_tp1: number;
  rr_ratio_tp2: number | null;
  trade_quality: "Excellent" | "Good" | "Fair" | "Poor";
  confidence: number;
  validity: "Intraday" | "Swing" | "Position";
  suggested_risk_percent: number;
  trend: "Bullish" | "Bearish" | "Sideways";
  signal: "Strong Buy" | "Buy" | "Neutral" | "Sell" | "Strong Sell";
  rsi: number | null;
  atr: number;
  support_1: number;
  support_2: number;
  resistance_1: number;
  resistance_2: number;
  notes: string[];
  execution_strategy: string[];
};

export type PositionSizing = {
  account_size: number;
  risk_percent: number;
  max_risk_amount: number;
  risk_per_share: number;
  shares: number;
  lots: number;
  position_value: number;
  position_percent: number;
};

export type TradingPlanResponse = {
  ticker: string;
  plan: TradingPlan;
  position_sizing: PositionSizing | null;
};
