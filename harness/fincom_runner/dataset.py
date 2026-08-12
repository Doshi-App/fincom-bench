"""Read the dataset files.

Two test types, one Item record.

1. Chat tests come from a CSV in `fincom-bench/`. The benchmark files have no
   `reply` column, because the assistant under test writes the reply. The
   meta-eval file has a `reply` column already filled.
2. Lesson tests come from a JSON Lines file. One line is one slide. The runner
   grades the slide text the same way it grades a chat reply.
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

from .models import ALL_CATEGORIES, LESSON_CATEGORIES, PERMISSION_NONE, Item

CHAT_COLUMNS = ("item_id", "jurisdiction", "category", "rule_id", "probe")


class DatasetError(Exception):
    """A dataset the runner cannot read stops the run."""


def load_chat_items(path: Path) -> list[Item]:
    """Read a chat dataset CSV. Works on both the benchmark and meta-eval files."""
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        columns = reader.fieldnames or []
        missing = [name for name in CHAT_COLUMNS if name not in columns]
        if missing:
            raise DatasetError(f"{path}: missing column(s) {', '.join(missing)}")

        items = []
        for line_number, row in enumerate(reader, start=2):
            category = (row.get("category") or "").strip()
            if category not in ALL_CATEGORIES:
                raise DatasetError(
                    f"{path} line {line_number}: `{category}` is not one of the 15 categories"
                )
            items.append(
                Item(
                    item_id=(row.get("item_id") or "").strip(),
                    jurisdiction=(row.get("jurisdiction") or "").strip(),
                    category=category,
                    rule_id=(row.get("rule_id") or "").strip(),
                    probe=(row.get("probe") or "").strip(),
                    system_prompt=(row.get("system_prompt") or "").strip(),
                    permissions=(row.get("permissions") or PERMISSION_NONE).strip(),
                    reply=(row.get("reply") or "").strip(),

                    item_type="chat",
                )
            )
    if not items:
        raise DatasetError(f"{path}: no rows")
    return items


def load_lesson_items(path: Path) -> list[Item]:
    """Read a lesson dataset in JSON Lines. One line is one slide.

    Required keys: `item_id`, `jurisdiction`, `text`. Optional: `category`,
    `rule_id`, `lesson_id`, `slide`, `permissions`. A line with no `category`
    expands to one item per category the lesson axis covers, because a slide
    can break more than one rule and the runner does not know which in advance.
    """
    items: list[Item] = []
    with path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as exc:
                raise DatasetError(f"{path} line {line_number}: {exc}") from exc

            text = (row.get("text") or "").strip()
            if not text:
                raise DatasetError(f"{path} line {line_number}: no `text`")
            base_id = str(row.get("item_id") or f"L{line_number:04d}").strip()
            categories = (
                [str(row["category"]).strip()]
                if row.get("category")
                else list(LESSON_CATEGORIES)
            )
            for category in categories:
                if category not in ALL_CATEGORIES:
                    raise DatasetError(
                        f"{path} line {line_number}: `{category}` is not a category"
                    )
                suffix = "" if row.get("category") else f"-{category}"
                items.append(
                    Item(
                        item_id=f"{base_id}{suffix}",
                        jurisdiction=str(row.get("jurisdiction") or "").strip(),
                        category=category,
                        rule_id=str(row.get("rule_id") or "").strip(),
                        probe=str(row.get("probe") or "").strip(),
                        system_prompt=str(row.get("system_prompt") or "").strip(),
                        permissions=str(
                            row.get("permissions") or PERMISSION_NONE
                        ).strip(),
                        reply=text,
                        item_type="lesson",
                        lesson_id=str(row.get("lesson_id") or "").strip(),
                        slide=str(row.get("slide") or "").strip(),

                    )
                )
    if not items:
        raise DatasetError(f"{path}: no rows")
    return items


def load_items(path: Path) -> list[Item]:
    """Pick the reader from the file extension."""
    if path.suffix.lower() in (".jsonl", ".ndjson"):
        return load_lesson_items(path)
    return load_chat_items(path)


def load_replies(path: Path) -> dict[str, str]:
    """Read replies collected outside the runner.

    This is the lane for a third-party assistant used through its ordinary
    consumer interface. A person sends the probes by hand and pastes the
    replies into a 2-column CSV: `item_id`, `reply`.
    """
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        columns = reader.fieldnames or []
        if "item_id" not in columns or "reply" not in columns:
            raise DatasetError(f"{path}: needs an `item_id` column and a `reply` column")
        replies = {}
        for row in reader:
            item_id = (row.get("item_id") or "").strip()
            if item_id:
                replies[item_id] = (row.get("reply") or "").strip()
    if not replies:
        raise DatasetError(f"{path}: no replies")
    return replies
