"""Router for /api/broker — bandarmology (broker flow) analysis.

Reuses Pulse-CLI's BandarmologyEngine, which talks to Stockbit via a manual
token (STOCKBIT_TOKEN env var, expires ~24h) rather than automated login —
see Pulse-CLI/.env.example ("Option 1: Manual Token (RECOMMENDED)"). No
scheduled re-login is implemented; refresh the token by hand when this
endpoint starts returning 503.
"""

from fastapi import APIRouter, HTTPException, Query

from pulse.core.analysis.bandarmology import BandarmologyEngine

from app.serializers import clean_nan_deep

router = APIRouter(prefix="/api", tags=["broker"])

_engine = BandarmologyEngine()


@router.get("/broker/{ticker}")
async def broker_flow(ticker: str, days: int = Query(default=10, ge=3, le=30)):
    """Broker flow (bandarmology) untuk satu ticker — butuh STOCKBIT_TOKEN valid."""
    result = await _engine.analyze(ticker, days=days)
    if result is None:
        raise HTTPException(
            status_code=503,
            detail=(
                f"Data broker flow untuk '{ticker}' tidak tersedia. Cek STOCKBIT_TOKEN di "
                "backend/.env — token manual, expired tiap ~24 jam."
            ),
        )
    return clean_nan_deep(result.model_dump(mode="json", exclude={"raw_summaries"}))
