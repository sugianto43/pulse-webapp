"""Generic per-IP rate limiter — applied globally via SlowAPIMiddleware in main.py.

Guards against scraping/abuse on public endpoints (screener/scan especially, since
they fan out to dozens of yfinance/Stockbit calls per request).
"""

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from app.settings import RATE_LIMIT_DEFAULT

limiter = Limiter(key_func=get_remote_address, default_limits=[RATE_LIMIT_DEFAULT])

__all__ = ["limiter", "RateLimitExceeded", "SlowAPIMiddleware", "_rate_limit_exceeded_handler"]
