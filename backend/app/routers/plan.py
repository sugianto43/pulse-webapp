"""Router for /api/plan — trading plan generator (entry/TP/SL/R:R + position sizing)."""

from fastapi import APIRouter, HTTPException, Query

from pulse.core.trading_plan import TradingPlanGenerator

from app.serializers import clean_nan_deep

router = APIRouter(prefix="/api", tags=["plan"])

_generator = TradingPlanGenerator()

_VALID_SL_METHODS = {"atr", "support", "percentage", "hybrid"}


@router.get("/plan/{ticker}")
async def plan(
    ticker: str,
    account_size: float = Query(default=TradingPlanGenerator.DEFAULT_ACCOUNT_SIZE, gt=0),
    risk_percent: float = Query(default=TradingPlanGenerator.DEFAULT_RISK_PERCENT, gt=0, le=100),
    sl_method: str = "hybrid",
):
    """Trading plan (entry, TP1-3, SL, R:R) + position sizing untuk satu ticker."""
    if sl_method not in _VALID_SL_METHODS:
        raise HTTPException(
            status_code=400,
            detail=f"sl_method tidak valid: '{sl_method}'. Pilihan: {', '.join(sorted(_VALID_SL_METHODS))}",
        )

    trading_plan = await _generator.generate(ticker, risk_percent=risk_percent, sl_method=sl_method)
    if trading_plan is None:
        raise HTTPException(status_code=404, detail=f"Data tidak ditemukan untuk ticker '{ticker}'")

    position_sizing = _generator.calculate_position_size(
        trading_plan, account_size=account_size, risk_percent=risk_percent
    )
    if "error" in position_sizing:
        position_sizing = None

    return clean_nan_deep(
        {
            "ticker": trading_plan.ticker,
            "plan": trading_plan.model_dump(mode="json"),
            "position_sizing": position_sizing,
        }
    )
