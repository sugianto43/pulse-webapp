"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import { useTradingPlanQuery } from "./useTradingPlanQuery";

const DEFAULT_ACCOUNT_SIZE = 100_000_000;
const DEFAULT_RISK_PERCENT = 2;

export function useTradingPlan(ticker: string) {
  const [accountSizeInput, setAccountSizeInput] = useState(String(DEFAULT_ACCOUNT_SIZE));
  const [riskPercentInput, setRiskPercentInput] = useState(String(DEFAULT_RISK_PERCENT));
  const [accountSize, setAccountSize] = useState(DEFAULT_ACCOUNT_SIZE);
  const [riskPercent, setRiskPercent] = useState(DEFAULT_RISK_PERCENT);

  const query = useTradingPlanQuery(ticker, accountSize, riskPercent);

  function applyInputs() {
    const parsedAccountSize = Number(accountSizeInput);
    const parsedRiskPercent = Number(riskPercentInput);
    setAccountSize(parsedAccountSize > 0 ? parsedAccountSize : DEFAULT_ACCOUNT_SIZE);
    setRiskPercent(parsedRiskPercent > 0 ? parsedRiskPercent : DEFAULT_RISK_PERCENT);
  }

  let error: string | null = null;
  if (query.isError) {
    error =
      query.error instanceof ApiError ? query.error.message : "Terjadi kesalahan tak terduga.";
  }

  return {
    accountSizeInput,
    setAccountSizeInput,
    riskPercentInput,
    setRiskPercentInput,
    applyInputs,
    loading: query.isFetching,
    error,
    data: query.isError ? null : (query.data ?? null),
  };
}
