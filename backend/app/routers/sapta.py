"""Router for /api/sapta — SAPTA pre-markup detection engine."""

from fastapi import APIRouter, HTTPException, Query

from pulse.core.sapta.engine import SaptaEngine
from pulse.core.sapta.models import SaptaResult, SaptaStatus
from pulse.core.screener import StockScreener, StockUniverse

from app.cache import TTLCache
from app.serializers import clean_nan_deep
from app.settings import SAPTA_SCAN_CACHE_MAX_SIZE, SAPTA_SCAN_CACHE_TTL_SECONDS

router = APIRouter(prefix="/api", tags=["sapta"])

_engine = SaptaEngine()
# Broker Flow (module 7) needs a Stockbit auth token we don't have a strategy
# for yet (PRD Fase 6, unresolved) — disable it so analyze()/scan() don't
# attempt that network call at all, rather than silently scoring it as 0.
_engine._broker_flow_enabled = False

_scan_cache = TTLCache(ttl_seconds=SAPTA_SCAN_CACHE_TTL_SECONDS, max_size=SAPTA_SCAN_CACHE_MAX_SIZE)

_MODULE_NAMES = (
    "absorption",
    "compression",
    "bb_squeeze",
    "elliott",
    "time_projection",
    "anti_distribution",
)


def _serialize_sapta_result(result: SaptaResult) -> dict:
    return clean_nan_deep(
        {
            "ticker": result.ticker,
            "timeframe": result.timeframe,
            "analyzed_at": result.analyzed_at.isoformat(),
            "final_score": round(result.final_score, 1),
            "score_pct": round(result.score_pct, 1),
            "max_possible_score": result.max_possible_score,
            "status": result.status.value,
            "confidence": result.confidence.value,
            "ml_probability": result.ml_probability,
            "projected_breakout_window": result.projected_breakout_window,
            "projected_dates": result.projected_dates,
            "days_to_window": result.days_to_window,
            "wave_phase": result.wave_phase,
            "fib_retracement": result.fib_retracement,
            "notes": result.notes,
            "reasons": result.reasons,
            "warnings": result.warnings,
            "penalties": result.penalties,
            "penalty_score": result.penalty_score,
            "modules": {name: getattr(result, name) for name in _MODULE_NAMES},
        }
    )


@router.get("/sapta/scan")
async def sapta_scan(
    universe: str = "lq45",
    min_status: str = "watchlist",
    limit: int = Query(default=30, ge=1, le=100),
):
    """Scan multi-saham buat kandidat pre-markup, dengan cache TTL.

    Registered before /sapta/{ticker} — otherwise the {ticker} path param
    would greedily match the literal "scan" segment first.
    """
    try:
        universe_type = StockUniverse(universe.lower())
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Universe tidak valid: '{universe}'. Pilihan: {', '.join(u.value for u in StockUniverse)}",
        )

    try:
        min_status_enum = SaptaStatus(min_status.upper().replace("_", "-"))
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"min_status tidak valid: '{min_status}'. Pilihan: {', '.join(s.name.lower() for s in SaptaStatus)}",
        )

    cache_key = (universe_type.value, min_status_enum.value, limit)
    cached = _scan_cache.get(cache_key)
    if cached is not None:
        return {"cached": True, "count": len(cached), "results": cached}

    screener = StockScreener(universe_type=universe_type)
    results = await _engine.scan(screener.universe, min_status=min_status_enum)

    serialized = [_serialize_sapta_result(r) for r in results[:limit]]
    _scan_cache.set(cache_key, serialized)

    return {"cached": False, "count": len(serialized), "results": serialized}


@router.get("/sapta/{ticker}")
async def sapta_analyze(ticker: str):
    """Skor SAPTA + breakdown 6 modul untuk satu ticker."""
    result = await _engine.analyze(ticker)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Data tidak cukup untuk analisis SAPTA '{ticker}' (butuh histori >= 120 hari).",
        )
    return _serialize_sapta_result(result)
