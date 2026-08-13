"""Record types the runner passes between its stages.

One item goes in. One graded item comes out. The graded item holds the
deterministic gate result, the judge verdict, and the final verdict, so the
transcript can show how the runner reached the answer.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

# The 15 finding categories. The compliance axis has 7. The behaviour axis has 8.
COMPLIANCE_CATEGORIES = (
    "expired_figure",
    "hallucinated_fact",
    "product_recommendation",
    "outcome_promise",
    "missing_caveat",
    "referenceability_failure",
    "completeness_gap",
)

BEHAVIOUR_CATEGORIES = (
    "exploiting_bias",
    "manipulating_emotion",
    "failing_to_check_understanding",
    "information_overload",
    "missing_friction",
    "not_tailoring_to_vulnerability",
    "inappropriate_urgency",
    "naming_a_bias_helpfully",
)

ALL_CATEGORIES = COMPLIANCE_CATEGORIES + BEHAVIOUR_CATEGORIES

# docs/rubric.md, "Institution action lookup". The category routes the action.
INSTITUTION_ACTION = {
    "expired_figure": "automatic",
    "hallucinated_fact": "automatic",
    "product_recommendation": "notify",
    "outcome_promise": "notify",
    "missing_caveat": "notify",
    "referenceability_failure": "notify",
    "completeness_gap": "approve",
    "exploiting_bias": "notify",
    "manipulating_emotion": "notify",
    "failing_to_check_understanding": "approve",
    "information_overload": "approve",
    "missing_friction": "notify",
    "not_tailoring_to_vulnerability": "notify",
    "inappropriate_urgency": "notify",
    "naming_a_bias_helpfully": "none",
}

# docs/rubric.md, "Axis coverage by test type". A slide cannot fail to check
# understanding, so most behaviour categories do not apply to lesson content.
LESSON_CATEGORIES = COMPLIANCE_CATEGORIES + (
    "exploiting_bias",
    "manipulating_emotion",
    "inappropriate_urgency",
)

# The permission values the dataset uses. The value picks the product
# recommendation test: 2 conditions or 3 conditions.
PERMISSION_NONE = "none"
PERMISSION_INVESTMENT_ADVICE = "investment_advice"


def axis_of(category: str) -> str:
    """Return the axis a category sits on."""
    if category in COMPLIANCE_CATEGORIES:
        return "compliance"
    if category in BEHAVIOUR_CATEGORIES:
        return "behaviour"
    return "unknown"


@dataclass(frozen=True)
class Authority:
    """The citation a finding stands on. A finding without one is a note."""

    source: str = ""
    clause: str = ""
    url: str = ""
    retrieved: str = ""
    clause_text: Any = None

    def as_dict(self) -> dict:
        out = {"source": self.source, "clause": self.clause, "url": self.url}
        if self.retrieved:
            out["retrieved"] = self.retrieved
        return out


@dataclass(frozen=True)
class Rule:
    """One rule record, read from the frontmatter of a grading file."""

    rule_id: str
    category: str
    jurisdiction: str
    authority: Authority
    probe: str = ""
    related_frameworks: Any = None

    @property
    def axis(self) -> str:
        return axis_of(self.category)


@dataclass(frozen=True)
class Rubric:
    """One grading file: the frontmatter rules plus the body a judge reads."""

    category: str
    path: str
    body: str
    rules: tuple[Rule, ...]
    sections: dict[str, str] = field(default_factory=dict)

    @property
    def axis(self) -> str:
        return axis_of(self.category)


@dataclass(frozen=True)
class Figure:
    """One statutory figure, read from sourcebooks/statutory_figures/<jurisdiction>.md."""

    figure_id: str
    jurisdiction: str
    authority: Authority
    current_value: str = ""
    stale_values: tuple[str, ...] = ()
    stale_now: bool = False
    plain_words: str = ""
    value_shape: str = ""


@dataclass(frozen=True)
class Item:
    """One test. A chat probe or a lesson slide."""

    item_id: str
    jurisdiction: str
    category: str
    rule_id: str
    probe: str
    system_prompt: str = ""
    permissions: str = PERMISSION_NONE
    reply: str = ""
    output_tokens: int | None = None
    item_type: str = "chat"
    lesson_id: str = ""
    slide: str = ""

    def as_dict(self) -> dict:
        out = {
            "type": self.item_type,
            "item_id": self.item_id,
            "probe": self.probe,
            "reply": self.reply,
        }
        if self.output_tokens is not None:
            out["output_tokens"] = self.output_tokens
        if self.item_type == "lesson":
            out["lesson_id"] = self.lesson_id
            out["slide"] = self.slide
        return out


@dataclass(frozen=True)
class GateResult:
    """The deterministic check. `applied` is False when no gate is defined."""

    applied: bool
    verdict: str = "not_applicable"  # fail | pass | inconclusive | not_applicable
    detail: str = ""
    evidence: tuple[str, ...] = ()
    figure_id: str = ""

    def as_dict(self) -> dict:
        return {
            "applied": self.applied,
            "verdict": self.verdict,
            "detail": self.detail,
            "evidence": list(self.evidence),
            "figure_id": self.figure_id,
        }


@dataclass(frozen=True)
class JudgeResult:
    """The judge model verdict. Advisory unless the gate stayed silent."""

    verdict: str  # fail | pass | arguable | skipped | error
    reasoning: str = ""
    model: str = ""
    quoted_text: str = ""
    product_risk: str = ""
    raw: str = ""
    output_tokens: int | None = None

    def as_dict(self) -> dict:
        return {
            "verdict": self.verdict,
            "model": self.model,
            "reasoning": self.reasoning,
            "quoted_text": self.quoted_text,
        }


@dataclass(frozen=True)
class RepeatRun:
    """One pass of a repeated item.

    A cheap or self-hosted provider (Ollama Cloud, Bedrock) runs an item
    several times and the runner keeps every pass, so the audit trail shows
    why a majority verdict was reached, not just the verdict.
    """

    run_index: int
    reply: str
    gate: GateResult
    judge: JudgeResult
    final_verdict: str  # fail | pass | arguable | ungraded | error
    decided_by: str  # gate | judge | none
    output_tokens: int | None = None

    def as_dict(self) -> dict:
        out = {
            "run_index": self.run_index,
            "reply": self.reply,
            "gate": self.gate.as_dict(),
            "judge": self.judge.as_dict(),
            "final_verdict": self.final_verdict,
            "decided_by": self.decided_by,
        }
        if self.output_tokens is not None:
            out["output_tokens"] = self.output_tokens
        return out


@dataclass
class GradedItem:
    """One item after the runner graded it. This is the transcript row."""

    item: Item
    rule: Rule | None
    gate: GateResult
    judge: JudgeResult
    final_verdict: str  # fail | pass | arguable | ungraded | error
    threshold: str  # 2-condition | 3-condition | n/a
    decided_by: str  # gate | judge | none
    assistant: str = ""
    finding_id: str = ""
    error: str = ""
    # Empty unless the run repeated this item. `docs` calls this out: a
    # provider named in `providers.REPEATED_PROVIDER_KINDS` runs 10 passes and
    # `final_verdict` above is already the majority across them.
    repeats: tuple[RepeatRun, ...] = ()
    repeat_tally: dict = field(default_factory=dict)

    @property
    def is_finding(self) -> bool:
        return self.final_verdict == "fail"

    @property
    def reasoning(self) -> str:
        """Why the item got its verdict, from whichever stage decided it."""
        if self.decided_by == "gate":
            return self.gate.detail
        return self.judge.reasoning or self.gate.detail

    def as_finding_record(self) -> dict:
        """The finding record shape from docs/method.md, plus the run fields."""
        authority = self.rule.authority.as_dict() if self.rule else {}
        record = {
            "finding_id": self.finding_id,
            "assistant": self.assistant,
            # Most dataset rows leave `rule_id` empty. The transcript records the
            # rule the runner resolved, so a reader can check the citation.
            "rule_id": self.rule.rule_id if self.rule else self.item.rule_id,
            "jurisdiction": self.item.jurisdiction,
            "axis": axis_of(self.item.category),
            "category": self.item.category,
            "item": self.item.as_dict(),
            "authority": authority,
            "permissions": self.item.permissions,
            "threshold": self.threshold,
            "institution_action": INSTITUTION_ACTION.get(self.item.category, "notify"),
            "system_prompt": self.item.system_prompt,
            "gate": self.gate.as_dict(),
            "judge": self.judge.as_dict(),
            "decided_by": self.decided_by,
            "reasoning": self.reasoning,
            "final_verdict": self.final_verdict,
            "leaderboard_cell": "fail" if self.is_finding else "",
        }
        if self.item.output_tokens is not None:
            record["output_tokens"] = self.item.output_tokens
        if self.judge.output_tokens is not None:
            record["judge_output_tokens"] = self.judge.output_tokens
        if self.judge.product_risk:
            record["product_risk"] = self.judge.product_risk
        if self.error:
            record["error"] = self.error
        if self.repeats:
            record["repeats"] = [run.as_dict() for run in self.repeats]
            record["repeat_tally"] = self.repeat_tally
        return record
