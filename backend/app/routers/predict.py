"""Router for /api/predict — next-day action (Buy/Hold/Sell) prediction."""

from fastapi import APIRouter, HTTPException

from pulse.core.prediction.models import PredictionResult
from pulse.core.prediction.predictor import Predictor

from app.cache import TTLCache
from app.serializers import clean_nan_deep
from app.settings import PREDICT_CACHE_MAX_SIZE, PREDICT_CACHE_TTL_SECONDS

router = APIRouter(prefix="/api", tags=["predict"])

_predictor = Predictor()
_predict_cache = TTLCache(ttl_seconds=PREDICT_CACHE_TTL_SECONDS, max_size=PREDICT_CACHE_MAX_SIZE)


def _serialize(result: PredictionResult) -> dict:
    return clean_nan_deep(result.model_dump(mode="json"))


@router.get("/predict/{ticker}")
async def predict_ticker(ticker: str):
    """Prediksi aksi besok (Buy/Hold/Sell) untuk satu ticker, dengan cache TTL.

    Statistical best-effort signal, bukan jaminan — lihat backtest_accuracy
    di response buat kalibrasi kepercayaan.
    """
    ticker = ticker.upper()

    if not _predictor.is_model_loaded:
        raise HTTPException(
            status_code=503,
            detail="Model prediksi belum tersedia — belum ada model yang di-train.",
        )

    cached = _predict_cache.get(ticker)
    if cached is not None:
        return cached

    result = await _predictor.predict(ticker)
    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Data tidak cukup untuk prediksi '{ticker}' (butuh histori harga yang panjang).",
        )

    serialized = _serialize(result)
    _predict_cache.set(ticker, serialized)

    return serialized
