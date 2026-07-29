"""FastAPI wrapper around Pulse-CLI core analysis logic."""

import asyncio
import math
import os
import time
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from dataclasses import asdict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pulse.core.analysis.technical import TechnicalAnalyzer
from pulse.core.data.yfinance import YFinanceFetcher
from pulse.core.screener import ScreenPreset, ScreenResult, StockScreener, StockUniverse

# yfinance calls are blocking; Pulse-CLI offloads them via asyncio.to_thread.
# Default executor caps at ~12 workers (cpu_count+4) which serializes screening
# across a universe of dozens of tickers, so raise it here.
_THREAD_POOL_WORKERS = int(os.getenv("PULSE_WEB_THREAD_POOL_WORKERS", "40"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.get_event_loop().set_default_executor(
        ThreadPoolExecutor(max_workers=_THREAD_POOL_WORKERS)
    )
    yield


app = FastAPI(title="Pulse Web API", version="0.1.0", lifespan=lifespan)

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

_SCREEN_CACHE_TTL = int(os.getenv("PULSE_WEB_SCREEN_CACHE_TTL", "3600"))
_screen_cache: dict[tuple, tuple[float, list[dict]]] = {}


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
        "price": stock.model_dump(mode="json"),
        "indicators": indicators.model_dump(mode="json"),
    }


def _clean_nan(value):
    """yfinance/pandas kadang balikin NaN, bukan None — NaN gak valid di JSON."""
    if isinstance(value, float) and math.isnan(value):
        return None
    return value


def _serialize_screen_result(result: ScreenResult) -> dict:
    data = {k: _clean_nan(v) for k, v in asdict(result).items()}
    data["volume_ratio"] = _clean_nan(result.volume_ratio)
    data["market_cap_category"] = result.market_cap_category
    data["rsi_status"] = result.rsi_status
    data["macd_status"] = result.macd_status
    return data


@app.get("/api/screen/presets")
async def screen_presets():
    """Daftar preset screener + universe yang tersedia, buat dropdown UI."""
    return {
        "presets": [
            {"value": preset.value, "description": config["description"]}
            for preset, config in StockScreener.PRESETS.items()
        ],
        "universes": [u.value for u in StockUniverse],
    }


@app.get("/api/screen")
async def screen(
    universe: str = "lq45",
    preset: str | None = None,
    criteria: str | None = None,
    limit: int = 20,
):
    """Screening saham berdasarkan preset atau custom criteria, dengan cache TTL."""
    try:
        universe_type = StockUniverse(universe.lower())
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Universe tidak valid: '{universe}'. Pilihan: {', '.join(u.value for u in StockUniverse)}",
        )

    if not preset and not criteria:
        raise HTTPException(status_code=400, detail="Sertakan salah satu: 'preset' atau 'criteria'")

    cache_key = (universe_type.value, preset, criteria, limit)
    now = time.time()
    cached = _screen_cache.get(cache_key)
    if cached and now - cached[0] < _SCREEN_CACHE_TTL:
        return {"cached": True, "count": len(cached[1]), "results": cached[1]}

    screener = StockScreener(universe_type=universe_type)

    if preset:
        try:
            preset_enum = ScreenPreset(preset.lower())
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Preset tidak valid: '{preset}'")
        results = await screener.screen_preset(preset_enum, limit=limit)
    else:
        results = await screener.screen_criteria(criteria, limit=limit)

    serialized = [_serialize_screen_result(r) for r in results]
    _screen_cache[cache_key] = (now, serialized)

    return {"cached": False, "count": len(serialized), "results": serialized}
