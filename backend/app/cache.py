"""Generic in-process TTL cache, bounded so it can't grow unbounded."""

import time
from collections import OrderedDict
from typing import Any


class TTLCache:
    """LRU-bounded cache where entries also expire after ttl_seconds.

    Free-form cache keys (e.g. user-supplied criteria strings) would otherwise
    let a cache dict grow forever; max_size caps that by evicting the least
    recently used entry once the bound is hit.
    """

    def __init__(self, ttl_seconds: float, max_size: int):
        self.ttl_seconds = ttl_seconds
        self.max_size = max_size
        self._store: OrderedDict[Any, tuple[float, Any]] = OrderedDict()

    def get(self, key: Any) -> Any | None:
        entry = self._store.get(key)
        if entry is None:
            return None

        expires_at, value = entry
        if time.time() >= expires_at:
            del self._store[key]
            return None

        self._store.move_to_end(key)
        return value

    def set(self, key: Any, value: Any) -> None:
        self._evict_expired()

        self._store[key] = (time.time() + self.ttl_seconds, value)
        self._store.move_to_end(key)

        while len(self._store) > self.max_size:
            self._store.popitem(last=False)

    def _evict_expired(self) -> None:
        now = time.time()
        expired_keys = [key for key, (expires_at, _) in self._store.items() if now >= expires_at]
        for key in expired_keys:
            del self._store[key]
