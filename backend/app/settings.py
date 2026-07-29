"""App-wide configuration read once from environment variables."""

import os


def _split_origins(raw: str) -> list[str]:
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


CORS_ORIGINS = _split_origins(os.getenv("PULSE_WEB_CORS_ORIGINS", "http://localhost:3000"))

# yfinance calls are blocking; Pulse-CLI offloads them via asyncio.to_thread.
# Default executor caps at ~12 workers (cpu_count+4), which serializes screening
# across a universe of dozens of tickers, so this raises it at app startup.
THREAD_POOL_WORKERS = int(os.getenv("PULSE_WEB_THREAD_POOL_WORKERS", "40"))

SCREEN_CACHE_TTL_SECONDS = int(os.getenv("PULSE_WEB_SCREEN_CACHE_TTL", "3600"))
SCREEN_CACHE_MAX_SIZE = int(os.getenv("PULSE_WEB_SCREEN_CACHE_MAX_SIZE", "256"))
