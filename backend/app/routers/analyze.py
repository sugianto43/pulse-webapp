"""Router for /api/analyze — technical analysis per ticker."""

from fastapi import APIRouter, HTTPException

from pulse.core.analysis.technical import TechnicalAnalyzer
from pulse.core.data.yfinance import YFinanceFetcher

from app.serializers import clean_nan_deep

router = APIRouter(prefix="/api", tags=["analyze"])

_fetcher = YFinanceFetcher()
_analyzer = TechnicalAnalyzer()


@router.get("/analyze/{ticker}")
async def analyze(ticker: str, period: str = "1y"):
    """Harga + indikator teknikal (RSI, MACD, SMA, support/resistance) untuk satu ticker."""
    stock = await _fetcher.fetch_stock(ticker, period=period)
    if stock is None:
        raise HTTPException(status_code=404, detail=f"Data tidak ditemukan untuk ticker '{ticker}'")

    indicators = await _analyzer.analyze(ticker, period=period)
    if indicators is None:
        raise HTTPException(
            status_code=422, detail=f"Gagal menghitung indikator teknikal untuk '{ticker}'"
        )

    return clean_nan_deep(
        {
            "ticker": stock.ticker,
            "price": stock.model_dump(mode="json"),
            "indicators": indicators.model_dump(mode="json"),
        }
    )
