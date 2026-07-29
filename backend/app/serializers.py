"""Response sanitization shared across routers."""

import math
from typing import Any


def clean_nan_deep(value: Any) -> Any:
    """Recursively replace NaN floats with None.

    yfinance/pandas often return NaN instead of None for missing numeric
    fields (e.g. `info.get("revenueGrowth", 0) * 100` when the source value
    is NaN). NaN isn't valid JSON, so anything reaching a response — dataclass
    dumps, pydantic model_dump output, nested dicts/lists — needs this before
    FastAPI serializes it.
    """
    if isinstance(value, float):
        return None if math.isnan(value) else value
    if isinstance(value, dict):
        return {k: clean_nan_deep(v) for k, v in value.items()}
    if isinstance(value, list):
        return [clean_nan_deep(v) for v in value]
    return value
