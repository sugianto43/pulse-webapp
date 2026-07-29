"""Router for /api/screen — stock screener (preset or custom criteria)."""

from dataclasses import asdict

from fastapi import APIRouter, HTTPException, Query

from pulse.core.screener import ScreenPreset, ScreenResult, StockScreener, StockUniverse

from app.cache import TTLCache
from app.serializers import clean_nan_deep
from app.settings import SCREEN_CACHE_MAX_SIZE, SCREEN_CACHE_TTL_SECONDS

router = APIRouter(prefix="/api", tags=["screen"])

_cache = TTLCache(ttl_seconds=SCREEN_CACHE_TTL_SECONDS, max_size=SCREEN_CACHE_MAX_SIZE)


def _serialize_screen_result(result: ScreenResult) -> dict:
    data = asdict(result)
    data["volume_ratio"] = result.volume_ratio
    data["market_cap_category"] = result.market_cap_category
    data["rsi_status"] = result.rsi_status
    data["macd_status"] = result.macd_status
    return clean_nan_deep(data)


@router.get("/screen/presets")
async def screen_presets():
    """Daftar preset screener + universe yang tersedia, buat dropdown UI."""
    return {
        "presets": [
            {"value": preset.value, "description": config["description"]}
            for preset, config in StockScreener.PRESETS.items()
        ],
        "universes": [u.value for u in StockUniverse],
    }


@router.get("/screen")
async def screen(
    universe: str = "lq45",
    preset: str | None = None,
    criteria: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
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
    cached = _cache.get(cache_key)
    if cached is not None:
        return {"cached": True, "count": len(cached), "results": cached}

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
    _cache.set(cache_key, serialized)

    return {"cached": False, "count": len(serialized), "results": serialized}
