"""App-wide configuration read once from environment variables."""

import os

from dotenv import load_dotenv

# Load backend/.env into the actual process environment. Without this, only
# vars exported in the shell before `uvicorn` starts are visible to os.getenv
# — .env.example was previously just documentation, not something read at
# runtime. Also required for STOCKBIT_TOKEN (Pulse-CLI's stockbit.py reads it
# via plain os.getenv, not through pydantic-settings' own .env loading, which
# only populates its own model and never touches os.environ).
load_dotenv()


def _split_origins(raw: str) -> list[str]:
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


CORS_ORIGINS = _split_origins(os.getenv("PULSE_WEB_CORS_ORIGINS", "http://localhost:3000"))

# yfinance calls are blocking; Pulse-CLI offloads them via asyncio.to_thread.
# Default executor caps at ~12 workers (cpu_count+4), which serializes screening
# across a universe of dozens of tickers, so this raises it at app startup.
THREAD_POOL_WORKERS = int(os.getenv("PULSE_WEB_THREAD_POOL_WORKERS", "40"))

SCREEN_CACHE_TTL_SECONDS = int(os.getenv("PULSE_WEB_SCREEN_CACHE_TTL", "3600"))
SCREEN_CACHE_MAX_SIZE = int(os.getenv("PULSE_WEB_SCREEN_CACHE_MAX_SIZE", "256"))

SAPTA_SCAN_CACHE_TTL_SECONDS = int(os.getenv("PULSE_WEB_SAPTA_SCAN_CACHE_TTL", "3600"))
SAPTA_SCAN_CACHE_MAX_SIZE = int(os.getenv("PULSE_WEB_SAPTA_SCAN_CACHE_MAX_SIZE", "64"))

# Prediction is daily-cadence (next-day action) — result doesn't change until
# tomorrow's candle closes, so this can cache far longer than screen/sapta.
PREDICT_CACHE_TTL_SECONDS = int(os.getenv("PULSE_WEB_PREDICT_CACHE_TTL", "21600"))
PREDICT_CACHE_MAX_SIZE = int(os.getenv("PULSE_WEB_PREDICT_CACHE_MAX_SIZE", "256"))

# Empty/unset disables the SDK (sentry_sdk.init no-ops with dsn=None) — safe
# default for local dev without a Sentry account.
SENTRY_DSN = os.getenv("SENTRY_DSN") or None
SENTRY_TRACES_SAMPLE_RATE = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1"))

# Applied per-IP to every route via SlowAPIMiddleware (see app/rate_limit.py).
RATE_LIMIT_DEFAULT = os.getenv("PULSE_WEB_RATE_LIMIT_DEFAULT", "60/minute")
