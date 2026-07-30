from unittest.mock import AsyncMock

from pulse.core.models import StockData, TechnicalIndicators

from app.routers import analyze as analyze_router


def test_returns_price_and_indicators(client, monkeypatch):
    stock = StockData(ticker="BBCA", current_price=9500.0)
    indicators = TechnicalIndicators(ticker="BBCA", rsi_14=55.5)

    monkeypatch.setattr(analyze_router._fetcher, "fetch_stock", AsyncMock(return_value=stock))
    monkeypatch.setattr(analyze_router._analyzer, "analyze", AsyncMock(return_value=indicators))

    response = client.get("/api/analyze/BBCA")

    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == "BBCA"
    assert body["price"]["current_price"] == 9500.0
    assert body["indicators"]["rsi_14"] == 55.5


def test_404_when_stock_not_found(client, monkeypatch):
    monkeypatch.setattr(analyze_router._fetcher, "fetch_stock", AsyncMock(return_value=None))

    response = client.get("/api/analyze/NOTREAL")

    assert response.status_code == 404


def test_422_when_indicators_cannot_be_computed(client, monkeypatch):
    stock = StockData(ticker="BBCA")
    monkeypatch.setattr(analyze_router._fetcher, "fetch_stock", AsyncMock(return_value=stock))
    monkeypatch.setattr(analyze_router._analyzer, "analyze", AsyncMock(return_value=None))

    response = client.get("/api/analyze/BBCA")

    assert response.status_code == 422


def test_nan_indicator_fields_are_cleaned_to_null(client, monkeypatch):
    stock = StockData(ticker="BBCA")
    indicators = TechnicalIndicators(ticker="BBCA", rsi_14=float("nan"))

    monkeypatch.setattr(analyze_router._fetcher, "fetch_stock", AsyncMock(return_value=stock))
    monkeypatch.setattr(analyze_router._analyzer, "analyze", AsyncMock(return_value=indicators))

    response = client.get("/api/analyze/BBCA")

    assert response.status_code == 200
    assert response.json()["indicators"]["rsi_14"] is None
