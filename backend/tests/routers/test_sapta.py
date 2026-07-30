from unittest.mock import AsyncMock

from pulse.core.sapta.models import SaptaResult

from app.routers import sapta as sapta_router


def test_returns_sapta_score_and_modules(client, monkeypatch):
    result = SaptaResult(ticker="BBCA", weighted_score=72.0)
    monkeypatch.setattr(sapta_router._engine, "analyze", AsyncMock(return_value=result))

    response = client.get("/api/sapta/BBCA")

    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == "BBCA"
    assert body["status"] == "ABAIKAN"
    assert "absorption" in body["modules"]


def test_404_when_insufficient_history(client, monkeypatch):
    monkeypatch.setattr(sapta_router._engine, "analyze", AsyncMock(return_value=None))

    response = client.get("/api/sapta/NOTREAL")

    assert response.status_code == 404


def test_scan_returns_results(client, monkeypatch):
    sapta_router._scan_cache._store.clear()
    results = [SaptaResult(ticker="BBCA"), SaptaResult(ticker="BBRI")]
    monkeypatch.setattr(sapta_router._engine, "scan", AsyncMock(return_value=results))

    response = client.get("/api/sapta/scan?universe=lq45&min_status=watchlist")

    assert response.status_code == 200
    body = response.json()
    assert body["cached"] is False
    assert body["count"] == 2


def test_scan_route_not_shadowed_by_ticker_param(client, monkeypatch):
    """Regression guard: /sapta/scan must not be swallowed by /sapta/{ticker}."""
    sapta_router._scan_cache._store.clear()
    monkeypatch.setattr(sapta_router._engine, "scan", AsyncMock(return_value=[]))
    analyze_mock = AsyncMock(return_value=None)
    monkeypatch.setattr(sapta_router._engine, "analyze", analyze_mock)

    response = client.get("/api/sapta/scan?universe=lq45")

    assert response.status_code == 200
    analyze_mock.assert_not_awaited()


def test_400_for_invalid_min_status(client):
    response = client.get("/api/sapta/scan?universe=lq45&min_status=not_a_status")
    assert response.status_code == 400


def test_400_for_invalid_universe_on_scan(client):
    response = client.get("/api/sapta/scan?universe=nasdaq")
    assert response.status_code == 400
