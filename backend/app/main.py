"""FastAPI wrapper around Pulse-CLI core analysis logic."""

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pulse.core.analysis.technical import TechnicalAnalyzer
from pulse.core.data.yfinance import YFinanceFetcher

app = FastAPI(title="Pulse Web API", version="0.1.0")

_allowed_origins = os.getenv("PULSE_WEB_CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fetcher = YFinanceFetcher()
analyzer = TechnicalAnalyzer()


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/analyze/{ticker}")
async def analyze(ticker: str, period: str = "1y"):
    """Harga + indikator teknikal (RSI, MACD, SMA, support/resistance) untuk satu ticker."""
    stock = await fetcher.fetch_stock(ticker, period=period)
    if stock is None:
        raise HTTPException(status_code=404, detail=f"Data tidak ditemukan untuk ticker '{ticker}'")

    indicators = await analyzer.analyze(ticker, period=period)
    if indicators is None:
        raise HTTPException(
            status_code=422, detail=f"Gagal menghitung indikator teknikal untuk '{ticker}'"
        )

    return {
        "ticker": stock.ticker,
        "price": stock.model_dump(mode="json", exclude={"history"}),
        "indicators": indicators.model_dump(mode="json"),
    }
