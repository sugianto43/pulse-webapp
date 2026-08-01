from datetime import date
from unittest.mock import AsyncMock

from pulse.core.prediction.models import PredictedAction, PredictionResult

from app.routers import predict as predict_router


def _sample_result(ticker: str = "BBCA") -> PredictionResult:
    return PredictionResult(
        ticker=ticker,
        predicted_action=PredictedAction.BUY,
        confidence=0.55,
        probabilities={"Buy": 0.55, "Hold": 0.30, "Sell": 0.15},
        as_of_date=date(2026, 1, 1),
        model_version="1.0.0",
        backtest_accuracy=0.41,
        backtest_macro_f1=0.37,
        confidence_threshold=0.5,
        is_actionable=True,
        backtest_win_rate=0.45,
        backtest_avg_return_pct=0.3,
    )


def test_returns_prediction(client, monkeypatch):
    predict_router._predict_cache._store.clear()
    monkeypatch.setattr(predict_router._predictor, "_model_loaded", True)
    monkeypatch.setattr(predict_router._predictor, "predict", AsyncMock(return_value=_sample_result()))

    response = client.get("/api/predict/BBCA")

    assert response.status_code == 200
    body = response.json()
    assert body["ticker"] == "BBCA"
    assert body["predicted_action"] == "Buy"
    assert body["probabilities"]["Buy"] == 0.55
    assert body["is_actionable"] is True


def test_404_when_insufficient_data(client, monkeypatch):
    predict_router._predict_cache._store.clear()
    monkeypatch.setattr(predict_router._predictor, "_model_loaded", True)
    monkeypatch.setattr(predict_router._predictor, "predict", AsyncMock(return_value=None))

    response = client.get("/api/predict/NOTREAL")

    assert response.status_code == 404


def test_503_when_model_not_loaded(client, monkeypatch):
    monkeypatch.setattr(predict_router._predictor, "_model_loaded", False)

    response = client.get("/api/predict/BBCA")

    assert response.status_code == 503


def test_cache_hit_on_second_call(client, monkeypatch):
    predict_router._predict_cache._store.clear()
    monkeypatch.setattr(predict_router._predictor, "_model_loaded", True)
    predict_mock = AsyncMock(return_value=_sample_result())
    monkeypatch.setattr(predict_router._predictor, "predict", predict_mock)

    first = client.get("/api/predict/BBCA")
    second = client.get("/api/predict/BBCA")

    assert first.status_code == second.status_code == 200
    assert first.json() == second.json()
    predict_mock.assert_awaited_once()
