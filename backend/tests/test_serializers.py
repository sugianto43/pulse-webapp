import math

from app.serializers import clean_nan_deep


def test_replaces_top_level_nan_with_none():
    assert clean_nan_deep(float("nan")) is None


def test_leaves_normal_float_untouched():
    assert clean_nan_deep(3.14) == 3.14


def test_leaves_non_float_scalars_untouched():
    assert clean_nan_deep("BBCA") == "BBCA"
    assert clean_nan_deep(42) == 42
    assert clean_nan_deep(None) is None
    assert clean_nan_deep(True) is True


def test_cleans_nan_inside_nested_dict():
    value = {"revenue_growth": float("nan"), "pe_ratio": 12.5, "ticker": "BBCA"}
    assert clean_nan_deep(value) == {
        "revenue_growth": None,
        "pe_ratio": 12.5,
        "ticker": "BBCA",
    }


def test_cleans_nan_inside_nested_list():
    value = [1.0, float("nan"), 3.0]
    assert clean_nan_deep(value) == [1.0, None, 3.0]


def test_cleans_nan_in_deeply_nested_structure():
    value = {
        "results": [
            {"score": float("nan"), "notes": ["ok", float("nan")]},
            {"score": 88.0, "notes": []},
        ]
    }
    cleaned = clean_nan_deep(value)
    assert cleaned["results"][0]["score"] is None
    assert cleaned["results"][0]["notes"] == ["ok", None]
    assert cleaned["results"][1]["score"] == 88.0


def test_does_not_mutate_input():
    original = {"score": float("nan")}
    clean_nan_deep(original)
    assert math.isnan(original["score"])
