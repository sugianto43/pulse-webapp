export type PredictedAction = "Buy" | "Hold" | "Sell";

export type PredictionResult = {
  ticker: string;
  predicted_action: PredictedAction;
  confidence: number;
  probabilities: Record<PredictedAction, number>;
  as_of_date: string;
  model_version: string;
  backtest_accuracy: number | null;
  backtest_macro_f1: number | null;
  confidence_threshold: number | null;
  is_actionable: boolean;
  backtest_win_rate: number | null;
  backtest_avg_return_pct: number | null;
  backtest_max_drawdown_pct: number | null;
  backtest_sharpe_annualized: number | null;
  ticker_backtest_trades: number | null;
  ticker_backtest_win_rate: number | null;
  ticker_backtest_avg_return_pct: number | null;
};
