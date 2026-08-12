"""Execute a run.

The order for one item is fixed.

1. Get the reply from the provider.
2. Run the deterministic gate, if the category defines one.
3. If the gate failed the item, stop. The gate is published data, so it decides.
4. Otherwise send the rubric, the item and the gate evidence to the judge.
5. Record the final verdict, the citation and the reasoning.

The runner never guesses. An item it cannot grade is recorded as `ungraded` or
`error`, never as a pass.
"""

from __future__ import annotations

import hashlib
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass

from .figures import FigureBook
from .gates import run_gate
from .judge import Judge, build_prompt, threshold_for
from .models import GateResult, GradedItem, Item, JudgeResult
from .providers import Provider, ProviderError, Reply
from .rules import RuleBook


@dataclass
class RunConfig:
    """Everything a run needs that is not the data itself."""

    assistant: str
    run_id: str
    permissions_override: str = ""
    confirm_gate_fails: bool = False
    include_examples: bool = False
    concurrency: int = 4
    allow_uncited: bool = False


def finding_id(run_id: str, item: Item) -> str:
    """A stable ID for one graded item in one run."""
    digest = hashlib.sha1(
        f"{run_id}|{item.item_id}|{item.category}".encode("utf-8")
    ).hexdigest()[:8]
    return f"f-{run_id}-{item.jurisdiction}-{item.item_id}-{digest}"


def _apply_permissions(item: Item, override: str) -> Item:
    """The submission declares its permissions. That declaration wins.

    `docs/rubric.md` says the threshold is a property of the submission. The
    dataset column carries a default for the row. When a run declares the
    permissions of the assistant under test, the declaration replaces the
    column for every row.
    """
    if not override or override == item.permissions:
        return item
    return Item(**{**item.__dict__, "permissions": override})


def grade_item(
    item: Item,
    config: RunConfig,
    provider: Provider,
    judge: Judge,
    rule_book: RuleBook,
    figure_book: FigureBook | None,
) -> GradedItem:
    """Run one item all the way through."""
    item = _apply_permissions(item, config.permissions_override)
    rule = rule_book.rule_for_item(item.rule_id, item.category, item.jurisdiction)
    rubric = rule_book.rubric_for(item.category)
    threshold = (
        threshold_for(item.permissions)
        if item.category == "product_recommendation"
        else "n/a"
    )

    def failed(reason: str, gate: GateResult | None = None) -> GradedItem:
        return GradedItem(
            item=item,
            rule=rule,
            gate=gate or GateResult(applied=False, detail=reason),
            judge=JudgeResult(verdict="error", model=judge.name, reasoning=reason),
            final_verdict="error",
            threshold=threshold,
            decided_by="none",
            assistant=config.assistant,
            finding_id=finding_id(config.run_id, item),
            error=reason,
        )

    if rubric is None:
        return failed(f"No rule file defines the category `{item.category}`.")

    if rule is None and not config.allow_uncited:
        # A finding must cite its authority (docs/rubric.md). When the category
        # cites nothing in this jurisdiction, the item is not scored there.
        return GradedItem(
            item=item,
            rule=None,
            gate=GateResult(
                applied=False,
                detail=f"`{item.category}` has no rule for `{item.jurisdiction}`.",
            ),
            judge=JudgeResult(
                verdict="skipped",
                model=judge.name,
                reasoning=(
                    f"The category `{item.category}` cites no authority in "
                    f"`{item.jurisdiction}`, so this item cannot produce a finding "
                    f"that names its authority."
                ),
            ),
            final_verdict="ungraded",
            threshold=threshold,
            decided_by="none",
            assistant=config.assistant,
            finding_id=finding_id(config.run_id, item),
        )

    try:
        reply = provider.reply_for(item)
    except ProviderError as exc:
        return failed(str(exc))

    item = Item(**{**item.__dict__, "reply": reply.text, "output_tokens": reply.output_tokens})
    gate = run_gate(item, reply.text, figure_book)

    if gate.verdict == "fail" and not config.confirm_gate_fails:
        return GradedItem(
            item=item,
            rule=rule,
            gate=gate,
            judge=JudgeResult(
                verdict="skipped",
                model=judge.name,
                reasoning="The deterministic check failed the item, so the judge did not run.",
            ),
            final_verdict="fail",
            threshold=threshold,
            decided_by="gate",
            assistant=config.assistant,
            finding_id=finding_id(config.run_id, item),
        )

    prompt = build_prompt(item, reply.text, rubric, rule, gate, config.include_examples)
    verdict = judge.mark(prompt)

    if verdict.verdict in ("fail", "pass", "arguable"):
        final = verdict.verdict
        decided_by = "judge"
    elif gate.verdict == "fail":
        # The judge was asked to confirm the gate and could not answer. The gate
        # stands, because the gate reads published data.
        final = "fail"
        decided_by = "gate"
    elif gate.verdict == "pass":
        final = "pass"
        decided_by = "gate"
    else:
        final = "ungraded"
        decided_by = "none"

    return GradedItem(
        item=item,
        rule=rule,
        gate=gate,
        judge=verdict,
        final_verdict=final,
        threshold=threshold,
        decided_by=decided_by,
        assistant=config.assistant,
        finding_id=finding_id(config.run_id, item),
        error=verdict.reasoning if verdict.verdict == "error" else "",
    )


def grade_items(
    items: list[Item],
    config: RunConfig,
    provider: Provider,
    judge: Judge,
    rule_book: RuleBook,
    figure_book: FigureBook | None,
    on_progress=None,
) -> list[GradedItem]:
    """Grade every item. Order in equals order out."""

    def work(item: Item) -> GradedItem:
        graded = grade_item(item, config, provider, judge, rule_book, figure_book)
        if on_progress:
            on_progress(graded)
        return graded

    if config.concurrency <= 1:
        return [work(item) for item in items]
    with ThreadPoolExecutor(max_workers=config.concurrency) as pool:
        return list(pool.map(work, items))
