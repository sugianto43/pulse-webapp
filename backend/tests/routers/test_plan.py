from unittest.mock import AsyncMock

from pulse.core.models import TradingPlan

from app.routers import plan as plan_router


def _make_plan(**overrides) -> TradingPlan:
    defaults = dict(
        ticker="BBCA",
        entry_price=9500.0,
        tp1=9800.0,
        tp1_percent=3.16,
        stop_loss=9300.0,
        stop_loss_percent=-2.1,
        risk_amount=200.0,
        reward_tp1=300.0,
        rr_ratio_tp1=1.5,
    )
    defaults.update(overrides)
    return TradingPlan(**defaults)


def test_returns_plan_and_position_sizing(client, monkeypatch):
    monkeypatch.setattr(
        plan_router._generator, "generate", AsyncMock(return_value=_make_plan())
    )

    response = client.get("/api/plan/BBCA")

    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == "BBCA"
    assert body["plan"]["entry_price"] == 9500.0
    assert body["position_sizing"] is not None
    assert "lots" in body["position_sizing"]


def test_404_when_no_data(client, monkeypatch):
    monkeypatch.setattr(plan_router._generator, "generate", AsyncMock(return_value=None))

    response = client.get("/api/plan/NOTREAL")

    assert response.status_code == 404


def test_400_for_invalid_sl_method(client):
    response = client.get("/api/plan/BBCA?sl_method=not_a_method")
    assert response.status_code == 400


def test_422_for_non_positive_risk_percent(client):
    response = client.get("/api/plan/BBCA?risk_percent=0")
    assert response.status_code == 422


def test_position_sizing_null_when_stop_loss_invalid(client, monkeypatch):
    # risk_amount <= 0 means the stop loss is above entry — an invalid plan.
    # calculate_position_size() signals this via an "error" key, which the
    # router should turn into position_sizing: null rather than leaking the
    # error dict shape into the response.
    invalid_plan = _make_plan(risk_amount=0.0)
    monkeypatch.setattr(
        plan_router._generator, "generate", AsyncMock(return_value=invalid_plan)
    )

    response = client.get("/api/plan/BBCA")

    assert response.status_code == 200
    assert response.json()["position_sizing"] is None
