from unittest.mock import AsyncMock

import pytest
from pulse.core.screener import ScreenResult, StockScreener

from app.routers import screen as screen_router


@pytest.fixture(autouse=True)
def _clear_screen_cache():
    # Module-level cache singleton persists across tests in this file — clear
    # it so one test's cached result can't leak into another's assertions.
    screen_router._cache._store.clear()
    yield


def test_screen_by_preset_returns_results(client, monkeypatch):
    results = [ScreenResult(ticker="BBCA", score=88.0), ScreenResult(ticker="BBRI", score=76.0)]
    monkeypatch.setattr(
        StockScreener, "screen_preset", AsyncMock(return_value=results), raising=True
    )

    response = client.get("/api/screen?universe=lq45&preset=oversold")

    assert response.status_code == 200
    body = response.json()
    assert body["cached"] is False
    assert body["count"] == 2
    assert {r["ticker"] for r in body["results"]} == {"BBCA", "BBRI"}


def test_screen_by_custom_criteria(client, monkeypatch):
    results = [ScreenResult(ticker="TLKM")]
    monkeypatch.setattr(
        StockScreener, "screen_criteria", AsyncMock(return_value=results), raising=True
    )

    response = client.get("/api/screen?universe=lq45&criteria=rsi<30")

    assert response.status_code == 200
    assert response.json()["results"][0]["ticker"] == "TLKM"


def test_400_when_neither_preset_nor_criteria_given(client):
    response = client.get("/api/screen?universe=lq45")
    assert response.status_code == 400


def test_400_for_invalid_universe(client):
    response = client.get("/api/screen?universe=nasdaq&preset=oversold")
    assert response.status_code == 400


def test_400_for_invalid_preset(client):
    response = client.get("/api/screen?universe=lq45&preset=not_a_real_preset")
    assert response.status_code == 400


def test_second_identical_request_is_served_from_cache(client, monkeypatch):
    results = [ScreenResult(ticker="BBCA")]
    mock = AsyncMock(return_value=results)
    monkeypatch.setattr(StockScreener, "screen_preset", mock, raising=True)

    first = client.get("/api/screen?universe=lq45&preset=oversold")
    second = client.get("/api/screen?universe=lq45&preset=oversold")

    assert first.json()["cached"] is False
    assert second.json()["cached"] is True
    mock.assert_awaited_once()


def test_nan_fundamental_fields_are_cleaned_to_null(client, monkeypatch):
    results = [ScreenResult(ticker="BBCA", pe_ratio=float("nan"))]
    monkeypatch.setattr(StockScreener, "screen_preset", AsyncMock(return_value=results))

    response = client.get("/api/screen?universe=lq45&preset=oversold")

    assert response.json()["results"][0]["pe_ratio"] is None
