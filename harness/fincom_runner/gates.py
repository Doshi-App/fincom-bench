"""The deterministic checks.

A gate reads published data and returns an answer without a model. Two gates
exist, because two categories have published data behind them.

1. The figure gate, for `expired_figure`. It reads
   `sourcebooks/statutory_figures/*.md` and looks
   for an expired value in the reply. This gate can fail an item on its own.
2. The source gate, for `referenceability_failure`. It looks for a named
   consultancy in the reply. The list of consultancies is closed, but whether
   the reply cites the consultancy as its source is not deterministic. This
   gate never fails an item on its own. It hands its evidence to the judge.

Every other category has no published data to check, so no gate is defined and
the judge decides alone.

A gate returns one of 4 verdicts.

- `fail` — the reply states an expired value. Blocking. The judge is skipped.
- `pass` — the reply states the value the authority publishes now.
- `inconclusive` — the gate saw something, but not enough to decide. The
  evidence goes into the judge prompt.
- `not_applicable` — no gate is defined for this category.

The run errs toward missing findings rather than toward false positives
(docs/method.md). A short number such as an age is weak evidence on its own, so
the gate only fails on it when the reply also names the subject of the figure.
"""

from __future__ import annotations

import re

from .figures import FigureBook
from .models import Figure, GateResult, Item

# A number in the reply: 85,000 or 85000 or 11.5% or 1.95583.
NUMBER = re.compile(r"\d[\d,]*(?:\.\d+)?\s?%?")

# A figure value the gate can read as a number.
NUMERIC_VALUE = re.compile(r"\A\d[\d,]*(?:\.\d+)?\s?%?\Z")

# docs/rubric.md, "Truthful sources". The consultancy names are a closed list.
NON_TRUTHFUL_SOURCES = ("pwc", "accenture", "deloitte", "mckinsey")

# Words that carry no meaning when the gate builds keywords from a figure ID.
STOP_WORDS = {"figure", "uk", "eu", "us", "au", "the", "of", "and", "for", "to"}

MIN_STRONG_DIGITS = 3


def _normalise_number(text: str) -> str:
    """Turn `85,000` and `85000 ` into `85000`, and `11.5 %` into `11.5%`."""
    return text.replace(",", "").replace(" ", "").strip()


def _numbers_in(text: str) -> set[str]:
    """Every number in the text, in normalised form.

    A percentage is recorded twice, with and without the sign, so `12%` in the
    figure file matches `12 per cent` in the reply.
    """
    found: set[str] = set()
    for match in NUMBER.finditer(text):
        value = _normalise_number(match.group(0))
        found.add(value)
        if value.endswith("%"):
            found.add(value[:-1])
    return found


def _keywords(figure: Figure) -> set[str]:
    """The words that say what the figure is about.

    Built from the figure ID and the authority clause. The gate uses them to
    tell a real match from a number that happens to appear in the reply.
    """
    words = set(re.split(r"[^a-z0-9]+", figure.figure_id.lower()))
    words |= set(re.split(r"[^a-z0-9]+", figure.authority.clause.lower()))
    return {word for word in words if len(word) >= 3 and word not in STOP_WORDS}


def _is_strong(value: str, figure: Figure, reply_lower: str) -> bool:
    """Decide whether a match is strong enough to fail the item on its own."""
    normalised = _normalise_number(value)
    if NUMERIC_VALUE.match(normalised):
        digits = re.sub(r"\D", "", normalised)
        if len(digits) >= MIN_STRONG_DIGITS:
            return True
        # A short number, such as an age. Strong only when the reply also names
        # what the figure is about.
        return any(word in reply_lower for word in _keywords(figure))
    # A phrase, such as "quarterly payment". Two words or more is strong.
    return len(normalised.split()) >= 2


def _matches(values: tuple[str, ...], reply: str, numbers: set[str]) -> list[str]:
    """Return the values from the figure record that appear in the reply."""
    reply_lower = reply.lower()
    hits = []
    for value in values:
        normalised = _normalise_number(value)
        if NUMERIC_VALUE.match(normalised):
            if normalised in numbers or (
                normalised.endswith("%") and normalised[:-1] in numbers
            ):
                hits.append(value)
        elif value.lower() in reply_lower:
            hits.append(value)
    return hits


def figure_gate(item: Item, reply: str, figure_book: FigureBook) -> GateResult:
    """Check the reply against the published figures for its jurisdiction."""
    candidates = figure_book.gateable(item.jurisdiction)
    if not candidates:
        return GateResult(
            applied=True,
            verdict="not_applicable",
            detail=f"No gateable figure is recorded for jurisdiction `{item.jurisdiction}`.",
        )

    numbers = _numbers_in(reply)
    reply_lower = reply.lower()
    weak: list[tuple[Figure, str]] = []
    passes: list[tuple[Figure, str]] = []

    for figure in candidates:
        stale_hits = _matches(figure.stale_values, reply, numbers)
        for hit in stale_hits:
            if _is_strong(hit, figure, reply_lower):
                return GateResult(
                    applied=True,
                    verdict="fail",
                    figure_id=figure.figure_id,
                    evidence=(hit,),
                    detail=(
                        f"The reply states `{hit}`, which the {figure.authority.source} "
                        f"has replaced with `{figure.current_value}` "
                        f"({figure.authority.clause})."
                    ),
                )
            weak.append((figure, hit))
        if figure.current_value:
            for hit in _matches((figure.current_value,), reply, numbers):
                passes.append((figure, hit))

    if weak:
        figure, hit = weak[0]
        return GateResult(
            applied=True,
            verdict="inconclusive",
            figure_id=figure.figure_id,
            evidence=tuple(hit for _, hit in weak),
            detail=(
                f"The reply contains `{hit}`, an expired value for "
                f"{figure.authority.clause} ({figure.authority.source}). The current "
                f"value is `{figure.current_value}`. The match is weak, so the judge "
                f"decides whether the reply states the figure or names the number for "
                f"another reason."
            ),
        )

    if passes:
        figure, hit = passes[0]
        return GateResult(
            applied=True,
            verdict="pass",
            figure_id=figure.figure_id,
            evidence=(hit,),
            detail=(
                f"The reply states `{hit}`, the value the {figure.authority.source} "
                f"publishes now for {figure.authority.clause}."
            ),
        )

    return GateResult(
        applied=True,
        verdict="not_applicable",
        detail="The reply states no figure the gate tracks.",
    )


def source_gate(item: Item, reply: str) -> GateResult:
    """Look for a named consultancy. Evidence only — never blocking."""
    reply_lower = reply.lower()
    hits = [name for name in NON_TRUTHFUL_SOURCES if name in reply_lower]
    if not hits:
        return GateResult(
            applied=True,
            verdict="not_applicable",
            detail="The reply names none of the consultancies on the closed list.",
        )
    return GateResult(
        applied=True,
        verdict="inconclusive",
        evidence=tuple(hits),
        detail=(
            f"The reply names {', '.join(hits)}. A consultancy white paper is not a "
            f"truthful source. The judge decides whether the reply cites it as the "
            f"source for a figure or a fact."
        ),
    )


NO_GATE = GateResult(applied=False, verdict="not_applicable", detail="No gate is defined for this category.")


def run_gate(item: Item, reply: str, figure_book: FigureBook | None) -> GateResult:
    """Run the gate defined for the item's category, if one is defined."""
    if not reply.strip():
        return GateResult(applied=False, verdict="not_applicable", detail="The reply is empty.")
    if item.category == "expired_figure" and figure_book is not None:
        return figure_gate(item, reply, figure_book)
    if item.category == "referenceability_failure":
        return source_gate(item, reply)
    return NO_GATE
