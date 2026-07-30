from app.cache import TTLCache


def test_get_returns_none_for_missing_key():
    cache = TTLCache(ttl_seconds=60, max_size=10)
    assert cache.get("missing") is None


def test_set_then_get_returns_value():
    cache = TTLCache(ttl_seconds=60, max_size=10)
    cache.set("key", {"result": 1})
    assert cache.get("key") == {"result": 1}


def test_entry_expires_after_ttl(monkeypatch):
    fake_time = [1000.0]
    monkeypatch.setattr("app.cache.time.time", lambda: fake_time[0])

    cache = TTLCache(ttl_seconds=5, max_size=10)
    cache.set("key", "value")

    fake_time[0] += 4
    assert cache.get("key") == "value"

    fake_time[0] += 2
    assert cache.get("key") is None


def test_evicts_least_recently_used_when_over_max_size():
    cache = TTLCache(ttl_seconds=60, max_size=2)
    cache.set("a", 1)
    cache.set("b", 2)
    cache.set("c", 3)

    assert cache.get("a") is None
    assert cache.get("b") == 2
    assert cache.get("c") == 3


def test_get_refreshes_recency_order():
    cache = TTLCache(ttl_seconds=60, max_size=2)
    cache.set("a", 1)
    cache.set("b", 2)

    cache.get("a")  # "a" is now most-recently-used
    cache.set("c", 3)  # should evict "b", not "a"

    assert cache.get("a") == 1
    assert cache.get("b") is None
    assert cache.get("c") == 3
