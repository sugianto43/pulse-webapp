export type PatternAlert = {
  pattern: string;
  severity: "High" | "Medium" | "Low";
  description: string;
  brokers_involved: string[];
  value: number | null;
  is_bullish: boolean;
};

export type CumulativeFlow = {
  ticker: string;
  period_days: number;
  start_date: string;
  end_date: string;
  total_foreign_net: number;
  total_smart_money_net: number;
  total_bandar_net: number;
  total_retail_net: number;
  total_local_inst_net: number;
  accumulation_days: number;
  distribution_days: number;
  current_streak: number;
  consistent_buyers: Record<string, number>;
  consistent_sellers: Record<string, number>;
};

export type BrokerComposition = {
  smart_money_percent: number;
  smart_money_net: number;
  bandar_percent: number;
  bandar_net: number;
  retail_percent: number;
  retail_net: number;
  local_inst_percent: number;
  local_inst_net: number;
  market_maker_percent: number;
  market_maker_net: number;
  unknown_percent: number;
  unknown_net: number;
};

export type BrokerFlowResult = {
  ticker: string;
  analyzed_at: string;
  period_days: number;
  start_date: string | null;
  end_date: string | null;
  flow_momentum_score: number;
  markup_readiness_score: number;
  confidence: number;
  accumulation_phase: string;
  signal: string;
  cumulative_flow: CumulativeFlow | null;
  broker_composition: BrokerComposition | null;
  patterns: string[];
  pattern_alerts: PatternAlert[];
  foreign_net_total: number;
  smart_money_net_total: number;
  retail_net_total: number;
  accumulation_streak: number;
  distribution_warning: boolean;
  top5_consistency_score: number;
  most_consistent_buyer: string | null;
  most_consistent_buyer_days: number;
  most_consistent_seller: string | null;
  most_consistent_seller_days: number;
  insights: string[];
  risks: string[];
  recommendation: string;
};
