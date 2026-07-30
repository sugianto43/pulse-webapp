from unittest.mock import AsyncMock

from pulse.core.analysis.bandarmology.models import BandarmologyResult

from app.routers import broker as broker_router


def test_returns_broker_flow_result(client, monkeypatch):
    result = BandarmologyResult(ticker="BBCA", period_days=10, flow_momentum_score=70)
    monkeypatch.setattr(broker_router._engine, "analyze", AsyncMock(return_value=result))

    response = client.get("/api/broker/BBCA")

    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == "BBCA"
    assert body["flow_momentum_score"] == 70
    assert "raw_summaries" not in body


def test_503_when_token_missing_or_expired(client, monkeypatch):
    monkeypatch.setattr(broker_router._engine, "analyze", AsyncMock(return_value=None))

    response = client.get("/api/broker/BBCA")

    assert response.status_code == 503
    assert "STOCKBIT_TOKEN" in response.json()["detail"]


def test_days_query_param_is_forwarded(client, monkeypatch):
    mock = AsyncMock(return_value=BandarmologyResult(ticker="BBCA", period_days=20))
    monkeypatch.setattr(broker_router._engine, "analyze", mock)

    client.get("/api/broker/BBCA?days=20")

    mock.assert_awaited_once_with("BBCA", days=20)


def test_422_for_days_out_of_range(client):
    response = client.get("/api/broker/BBCA?days=1")
    assert response.status_code == 422
