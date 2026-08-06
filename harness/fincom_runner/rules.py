"""Read the rule files.

One rule file is one category. The file has YAML frontmatter at the top and a
grading rubric in the body. The frontmatter gives the runner the rule IDs, the
jurisdictions and the citations. The body goes to the judge model, because the
body is the pass and fail criteria a person wrote.
"""

from __future__ import annotations

import re
from pathlib import Path

import yaml

from .models import ALL_CATEGORIES, Authority, Rubric, Rule

FRONTMATTER = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n(.*)\Z", re.S)
HEADING = re.compile(r"^##\s+(.+?)\s*$", re.M)


class RuleError(Exception):
    """The rule files are the source of truth. A bad file stops the run."""


def _authority(raw: dict | None) -> Authority:
    raw = raw or {}
    return Authority(
        source=str(raw.get("source", "")),
        clause=str(raw.get("clause", "")),
        url=str(raw.get("url", "")),
        retrieved=str(raw.get("retrieved", "")),
        clause_text=raw.get("clause_text"),
    )


def _split_sections(body: str) -> dict[str, str]:
    """Split the rubric body on its `##` headings, so the judge prompt can
    take the pass criteria and the fail criteria without the worked examples."""
    sections: dict[str, str] = {}
    matches = list(HEADING.finditer(body))
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(body)
        sections[match.group(1).strip()] = body[start:end].strip()
    return sections


def parse_rule_file(path: Path) -> Rubric:
    """Parse one grading file into a Rubric."""
    text = path.read_text(encoding="utf-8")
    match = FRONTMATTER.match(text)
    if not match:
        raise RuleError(f"{path}: no YAML frontmatter")

    try:
        front = yaml.safe_load(match.group(1)) or {}
    except yaml.YAMLError as exc:
        raise RuleError(f"{path}: frontmatter is not valid YAML: {exc}") from exc

    category = str(front.get("category", "")).strip()
    if not category:
        raise RuleError(f"{path}: frontmatter has no `category`")
    if category not in ALL_CATEGORIES:
        raise RuleError(f"{path}: `{category}` is not one of the 15 categories")

    body = match.group(2)
    rules = []
    for raw in front.get("rules") or []:
        rule_id = str(raw.get("id", "")).strip()
        if not rule_id:
            raise RuleError(f"{path}: a rule has no `id`")
        authority = _authority(raw.get("authority"))
        if not authority.source or not authority.clause:
            raise RuleError(f"{path}: rule `{rule_id}` has no authority citation")
        rules.append(
            Rule(
                rule_id=rule_id,
                category=category,
                jurisdiction=str(raw.get("jurisdiction", "")).strip(),
                authority=authority,
                probe=str(raw.get("probe", "")).strip(),
                related_frameworks=front.get("related_frameworks"),
            )
        )

    if not rules:
        raise RuleError(f"{path}: frontmatter lists no rules")

    return Rubric(
        category=category,
        path=str(path),
        body=body.strip(),
        rules=tuple(rules),
        sections=_split_sections(body),
    )


class RuleBook:
    """Every rule file, indexed by category and by rule ID."""

    def __init__(self, rubrics: dict[str, Rubric]):
        self.rubrics = rubrics
        self.rules: dict[str, Rule] = {}
        for rubric in rubrics.values():
            for rule in rubric.rules:
                self.rules[rule.rule_id] = rule

    @classmethod
    def load(cls, rules_dir: Path) -> "RuleBook":
        """Read every markdown file in the grading directory."""
        grading = rules_dir / "grading" if (rules_dir / "grading").is_dir() else rules_dir
        paths = sorted(grading.glob("*.md"))
        if not paths:
            raise RuleError(f"{grading}: no rule files found")
        rubrics: dict[str, Rubric] = {}
        for path in paths:
            rubric = parse_rule_file(path)
            if rubric.category in rubrics:
                raise RuleError(f"{path}: category `{rubric.category}` is defined twice")
            rubrics[rubric.category] = rubric
        return cls(rubrics)

    def rubric_for(self, category: str) -> Rubric | None:
        return self.rubrics.get(category)

    def rule_for(self, rule_id: str) -> Rule | None:
        return self.rules.get(rule_id)

    def rule_for_item(
        self, rule_id: str, category: str, jurisdiction: str
    ) -> Rule | None:
        """Find the rule an item is graded against.

        Most dataset rows leave `rule_id` empty, because the category and the
        jurisdiction already name one rule. When `rule_id` is empty, take the
        first rule in the category that cites the item's jurisdiction. When the
        category cites nothing in that jurisdiction, return None — the item must
        not be scored there (docs/method.md).
        """
        if rule_id:
            rule = self.rules.get(rule_id)
            if rule:
                return rule
        rubric = self.rubrics.get(category)
        if not rubric:
            return None
        for rule in rubric.rules:
            if rule.jurisdiction == jurisdiction:
                return rule
        return None

    def categories(self) -> list[str]:
        return sorted(self.rubrics)

    def jurisdictions_for(self, category: str) -> set[str]:
        """A rule with no citation for a jurisdiction must not be scored there."""
        rubric = self.rubrics.get(category)
        if not rubric:
            return set()
        return {rule.jurisdiction for rule in rubric.rules if rule.jurisdiction}
