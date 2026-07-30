export type SaptaModule = {
  score: number;
  max_score: number;
  status: boolean;
  details: string;
  signals: string[];
};

export type SaptaModules = {
  absorption: SaptaModule | null;
  compression: SaptaModule | null;
  bb_squeeze: SaptaModule | null;
  elliott: SaptaModule | null;
  time_projection: SaptaModule | null;
  anti_distribution: SaptaModule | null;
};

export type SaptaStatus = "PRE-MARKUP" | "SIAP" | "WATCHLIST" | "ABAIKAN";

export type SaptaResult = {
  ticker: string;
  timeframe: string;
  analyzed_at: string;
  final_score: number;
  score_pct: number;
  max_possible_score: number;
  status: SaptaStatus;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  ml_probability: number | null;
  projected_breakout_window: string | null;
  projected_dates: [string, string] | null;
  days_to_window: number | null;
  wave_phase: string | null;
  fib_retracement: number | null;
  notes: string[];
  reasons: string[];
  warnings: string[];
  penalties: string[];
  penalty_score: number;
  modules: SaptaModules;
};

export type SaptaScanResponse = {
  cached: boolean;
  count: number;
  results: SaptaResult[];
};
