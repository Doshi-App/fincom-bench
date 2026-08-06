"""The leaderboard row and the miss rate.

A leaderboard row is one assistant. The row shows which threshold the assistant
was scored against, how many items it was sent, and one cell per category. A
pass produces no record, so a cell holds the number of fails and nothing else.

The miss rate answers a different question: of the findings people already filed
by hand, how many did the run rediscover? `docs/method.md` sets the bar at 95
percent. The filed corrections are not in this repository, so the file is
supplied on the command line.
"""

from __future__ import annotations

import csv
from pathlib import Path

from .models import ALL_CATEGORIES, GradedItem, axis_of

MATCH_KEYS = ("item_id", "rule_id", "lesson_id")


def leaderboard_row(assistant: str, graded: list[GradedItem]) -> dict:
    """Build one leaderboard row from the graded items for one assistant."""
    mine = [g for g in graded if g.assistant == assistant]
    thresholds = sorted({g.threshold for g in mine if g.threshold != "n/a"})

    cells: dict[str, dict] = {}
    for category in ALL_CATEGORIES:
        items = [g for g in mine if g.item.category == category]
        if not items:
            continue
        fails = [g for g in items if g.final_verdict == "fail"]
        cells[category] = {
            "axis": axis_of(category),
            "items": len(items),
            "fails": len(fails),
            "arguable": sum(1 for g in items if g.final_verdict == "arguable"),
            "ungraded": sum(1 for g in items if g.final_verdict == "ungraded"),
            "errors": sum(1 for g in items if g.final_verdict == "error"),
            "cell": "fail" if fails else "",
        }

    graded_count = sum(1 for g in mine if g.final_verdict in ("fail", "pass", "arguable"))
    fail_count = sum(1 for g in mine if g.final_verdict == "fail")
    return {
        "assistant": assistant,
        "threshold": ", ".join(thresholds) or "n/a",
        "items": len(mine),
        "graded": graded_count,
        "fails": fail_count,
        "passes": sum(1 for g in mine if g.final_verdict == "pass"),
        "arguable": sum(1 for g in mine if g.final_verdict == "arguable"),
        "ungraded": sum(1 for g in mine if g.final_verdict == "ungraded"),
        "errors": sum(1 for g in mine if g.final_verdict == "error"),
        "fail_rate": round(fail_count / graded_count, 4) if graded_count else None,
        "decided_by_gate": sum(1 for g in mine if g.decided_by == "gate"),
        "decided_by_judge": sum(1 for g in mine if g.decided_by == "judge"),
        "categories": cells,
    }


def leaderboard(graded: list[GradedItem]) -> list[dict]:
    """One row per assistant, worst fail rate first."""
    assistants = sorted({g.assistant for g in graded})
    rows = [leaderboard_row(name, graded) for name in assistants]
    return sorted(rows, key=lambda row: (row["fail_rate"] is None, -(row["fail_rate"] or 0)))


def load_corrections(path: Path) -> list[dict]:
    """Read the corrections people filed by hand.

    The file is a CSV. It needs a `category` column and at least one of
    `item_id`, `rule_id` or `lesson_id` so a filed correction can be matched to
    a graded item. Any other column is carried through to the report.
    """
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        columns = reader.fieldnames or []
        if "category" not in columns:
            raise ValueError(f"{path}: needs a `category` column")
        if not any(key in columns for key in MATCH_KEYS):
            raise ValueError(
                f"{path}: needs one of {', '.join(MATCH_KEYS)} so a correction "
                f"can be matched to a graded item"
            )
        return [dict(row) for row in reader]


def _keys_for(record: dict, category: str) -> set[tuple[str, str, str]]:
    """Every (key name, value, category) a record can be matched on."""
    keys = set()
    for name in MATCH_KEYS:
        value = (record.get(name) or "").strip()
        if value:
            keys.add((name, value, category))
    return keys


def miss_rate(graded: list[GradedItem], corrections: list[dict]) -> dict:
    """Compare the run's findings against the corrections people filed.

    A correction counts as rediscovered when the run produced a finding in the
    same category on the same item, rule or lesson.
    """
    found_keys: set[tuple[str, str, str]] = set()
    for item in graded:
        if item.final_verdict != "fail":
            continue
        record = {
            "item_id": item.item.item_id,
            "rule_id": item.item.rule_id,
            "lesson_id": item.item.lesson_id,
        }
        found_keys |= _keys_for(record, item.item.category)

    rediscovered, missed = [], []
    for correction in corrections:
        category = (correction.get("category") or "").strip()
        keys = _keys_for(correction, category)
        if keys & found_keys:
            rediscovered.append(correction)
        else:
            missed.append(correction)

    total = len(corrections)
    return {
        "filed": total,
        "rediscovered": len(rediscovered),
        "missed": len(missed),
        "miss_rate": round(len(missed) / total, 4) if total else None,
        "recall": round(len(rediscovered) / total, 4) if total else None,
        "bar": 0.95,
        "meets_bar": (len(rediscovered) / total >= 0.95) if total else None,
        "missed_records": missed,
    }
