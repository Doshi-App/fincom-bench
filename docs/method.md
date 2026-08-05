# Method

## How a run is scored

A run takes one item — a lesson slide or a chat reply — and produces zero or more findings. A finding is a record that says: this item broke this rule, and here is the authority behind the rule.

The runner is built on a separate ticket. This document describes the scoring method the runner implements.

## Finding categories

Every finding carries one of five categories. The category decides what happens next for the institution.

| Category | What it means | Institution action |
|---|---|---|
| Stale figure | The figure was right once and has expired. | Automatic |
| Never-right fact | The figure was wrong from the day it was written. | Automatic |
| Broken question | The marked answer is wrong, the calculation is impossible, or two options are right. | Automatic |
| Conduct breach | The content recommends a product, promises an outcome, or misses a required caveat. | Notify |
| Completeness gap | The content is true but short of what a competent explanation includes. | Approve |

A pass produces no record. The leaderboard cell is empty for a pass and "fail" for a finding.

## Deterministic checks and judge-model scores

A deterministic check is a hard gate. A judge-model score is advisory. The two combine as follows.

1. Run the deterministic check first. If it fails, the item fails. No judge model runs.
2. If the deterministic check passes (or if there is no deterministic check for the rule), run the judge model. The judge model scores the item against the rubric for the rule.
3. A human reviews every finding before it is filed. The human is the final gate, not the model.

## What a finding record looks like

```json
{
  "finding_id": "f-2026-08-05-uk-lesson-001-01",
  "rule_id": "uk-conduct-advice-boundary",
  "jurisdiction": "uk",
  "axis": "compliance",
  "category": "conduct_breach",
  "item": {
    "type": "lesson",
    "id": "lesson-abc123",
    "title": "ISAs explained",
    "locale": "en_GB",
    "slide_id": "slide-04"
  },
  "quoted_text": "a stocks and shares ISA is the best place for your savings",
  "authority": {
    "source": "FSMA",
    "clause": "s.19",
    "url": "https://www.legislation.gov.uk/ukpga/2000/8/section/19"
  },
  "binds": ["doshi", "institution"],
  "judge": "claude-opus-4",
  "reasoning": "Slide states a recommendation; an unauthorised firm cannot make this.",
  "institution_action": "notify",
  "leaderboard_cell": "fail"
}
```

The `institution_action` field is derived from the `category` by the lookup table above. It is not set by the judge and not a separate field on the rule.

## Accuracy bar

The grader must rediscover the roughly 500 filed change requests that real people found and labelled by hand. The miss rate is a published number on the benchmark. The bar set at charting: find at least 19 of every 20 (95 percent).

The run errs toward missing findings rather than toward false positives. If the run flags 50 items at one institution and 8 are wrong, the compliance officer stops trusting the other 42. False positives cost more than false negatives here.