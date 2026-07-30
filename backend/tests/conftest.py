import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.rate_limit import limiter


@pytest.fixture(autouse=True)
def _reset_rate_limiter():
    # Shared in-memory storage would otherwise let unrelated tests trip each
    # other's rate limit (default 60/minute, keyed by client IP — the
    # TestClient always uses the same fake IP).
    limiter.reset()
    yield


@pytest.fixture
def client():
    return TestClient(app)
