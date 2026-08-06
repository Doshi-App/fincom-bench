"""Read the expiring statutory figures.

Each file in `figures/` holds the figures for one jurisdiction. A figure record
carries the value the authority publishes now and the values that have expired.
The deterministic gate reads these records. No model is involved.
"""

from __future__ import annotations

from pathlib import Path

import yaml

from .models import Authority, Figure


class FigureError(Exception):
    """A figure file that does not parse stops the run."""


def _as_tuple(value) -> tuple[str, ...]:
    if value is None:
        return ()
    if isinstance(value, (list, tuple)):
        return tuple(str(item).strip() for item in value if str(item).strip())
    text = str(value).strip()
    return (text,) if text else ()


def parse_figure_file(path: Path) -> list[Figure]:
    """Parse one figures file into figure records."""
    try:
        raw = yaml.safe_load(path.read_text(encoding="utf-8")) or []
    except yaml.YAMLError as exc:
        raise FigureError(f"{path}: not valid YAML: {exc}") from exc
    if not isinstance(raw, list):
        raise FigureError(f"{path}: expected a list of figure records")

    figures = []
    for record in raw:
        figure_id = str(record.get("id", "")).strip()
        if not figure_id:
            raise FigureError(f"{path}: a figure record has no `id`")
        authority = record.get("authority") or {}
        figures.append(
            Figure(
                figure_id=figure_id,
                jurisdiction=str(record.get("jurisdiction", "")).strip(),
                authority=Authority(
                    source=str(authority.get("source", "")),
                    clause=str(authority.get("clause", "")),
                    url=str(authority.get("url", "")),
                    retrieved=str(authority.get("retrieved", "")),
                ),
                current_value=str(record.get("current_value", "")).strip(),
                stale_values=_as_tuple(record.get("stale_values")),
                stale_now=bool(record.get("stale_now", False)),
                plain_words=str(record.get("plain_words", "")).strip(),
                value_shape=str(record.get("value_shape", "")).strip(),
            )
        )
    return figures


class FigureBook:
    """Every figure, indexed by jurisdiction."""

    def __init__(self, figures: list[Figure]):
        self.figures = figures
        self.by_jurisdiction: dict[str, list[Figure]] = {}
        for figure in figures:
            self.by_jurisdiction.setdefault(figure.jurisdiction, []).append(figure)

    @classmethod
    def load(cls, figures_dir: Path) -> "FigureBook":
        paths = sorted(figures_dir.glob("*.yaml")) + sorted(figures_dir.glob("*.yml"))
        if not paths:
            raise FigureError(f"{figures_dir}: no figure files found")
        figures: list[Figure] = []
        for path in paths:
            figures.extend(parse_figure_file(path))
        return cls(figures)

    def for_jurisdiction(self, jurisdiction: str) -> list[Figure]:
        return self.by_jurisdiction.get(jurisdiction, [])

    def gateable(self, jurisdiction: str) -> list[Figure]:
        """Figures the gate can check: they name at least one expired value."""
        return [f for f in self.for_jurisdiction(jurisdiction) if f.stale_values]
