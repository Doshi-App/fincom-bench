"""Score candidate judges against the human labels. Phase 1 of the benchmark.

The README picks the judge on **macro-F1** against the human labels, so macro-F1
is the headline and the sort order. Three more numbers ride along because the
label set is lopsided — 92 fail to 8 pass in the labelled 100:

- **Cohen's kappa** and **MCC** are chance-corrected. A judge that answers `fail`
  every time scores 92 percent accuracy on this set and 0.00 on both of these.
  The `always-fail` baseline row is written into the output so that trap is
  visible rather than implied.
- **Balanced accuracy** is the mean of the two per-class recalls, so the 8 pass
  rows weigh as much as the 92 fail rows.

A judge is only compared on the rows it actually decided. `coverage` reports how
many of the labelled rows that was, and `error_rate` how often it failed to
answer. A judge that skips the hard rows can flatter itself on the rest, so read
the headline next to the coverage.

Usage:
    python meta-eval/score_judges.py submissions/<run-id>/transcript.jsonl ... \
        --labels meta-eval/human-labels.csv --out results/judge_selection.csv
"""

from __future__ import annotations

import argparse
import csv
import json
import math
from collections import Counter
from pathlib import Path

# An `arguable` verdict is not a third label. The rubric says a false positive
# costs more than a missed finding, so an arguable reply is not a finding.
ARGUABLE_MEANS = "pass"


def load_labels(path: Path) -> dict[str, str]:
    with path.open(encoding="utf-8") as fh:
        return {
            row["item_id"].strip(): row["human_label"].strip().lower()
            for row in csv.DictReader(fh)
            if row.get("human_label", "").strip().lower() in ("pass", "fail")
        }


def load_transcript(path: Path) -> tuple[str, dict[str, dict]]:
    """Return the judge name and one record per item."""
    judge_name = ""
    records: dict[str, dict] = {}
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            record = json.loads(line)
            item_id = str(record.get("item", {}).get("item_id", "")).strip()
            if not item_id:
                continue
            records[item_id] = record
            judge_name = judge_name or record.get("judge", {}).get("model", "")
    return judge_name, records


def _rates(tp: int, fp: int, fn: int) -> tuple[float, float, float]:
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return precision, recall, f1


def score(pairs: list[tuple[str, str]]) -> dict:
    """Compare (human, judge) label pairs. `fail` is the positive class."""
    n = len(pairs)
    if not n:
        return {}
    tp = sum(1 for h, j in pairs if h == "fail" and j == "fail")
    tn = sum(1 for h, j in pairs if h == "pass" and j == "pass")
    fp = sum(1 for h, j in pairs if h == "pass" and j == "fail")
    fn = sum(1 for h, j in pairs if h == "fail" and j == "pass")

    fail_p, fail_r, fail_f1 = _rates(tp, fp, fn)
    pass_p, pass_r, pass_f1 = _rates(tn, fn, fp)
    macro_f1 = (fail_f1 + pass_f1) / 2
    accuracy = (tp + tn) / n
    balanced = (fail_r + pass_r) / 2

    # Cohen's kappa: agreement above what the two label distributions would
    # produce by chance alone.
    human_fail = (tp + fn) / n
    judge_fail = (tp + fp) / n
    chance = human_fail * judge_fail + (1 - human_fail) * (1 - judge_fail)
    kappa = (accuracy - chance) / (1 - chance) if chance < 1 else 0.0

    denominator = math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn))
    mcc = ((tp * tn) - (fp * fn)) / denominator if denominator else 0.0

    return {
        "compared": n,
        "macro_f1": round(macro_f1, 4),
        "cohens_kappa": round(kappa, 4),
        "mcc": round(mcc, 4),
        "balanced_accuracy": round(balanced, 4),
        "accuracy": round(accuracy, 4),
        "fail_precision": round(fail_p, 4),
        "fail_recall": round(fail_r, 4),
        "fail_f1": round(fail_f1, 4),
        "pass_precision": round(pass_p, 4),
        "pass_recall": round(pass_r, 4),
        "pass_f1": round(pass_f1, 4),
        "tp_fail": tp,
        "tn_pass": tn,
        "fp_false_finding": fp,
        "fn_missed_finding": fn,
    }


def judge_label(record: dict) -> tuple[str, str]:
    """Map one transcript record to a pass/fail call, or say why it has none."""
    verdict = (record.get("judge", {}).get("verdict") or "").strip().lower()
    final = (record.get("final_verdict") or "").strip().lower()
    decided_by = (record.get("decided_by") or "").strip().lower()

    # The deterministic gate decides some items without the judge. That decision
    # is the same for every candidate, so it stays in the comparison.
    if decided_by == "gate" and final in ("pass", "fail"):
        return final, ""
    if verdict in ("pass", "fail"):
        return verdict, ""
    if verdict == "arguable":
        return ARGUABLE_MEANS, "arguable"
    if verdict == "error":
        return "", "error"
    return "", "ungraded"


def score_run(path: Path, labels: dict[str, str], name_override: str = "") -> dict:
    judge_name, records = load_transcript(path)
    pairs: list[tuple[str, str]] = []
    reasons: Counter = Counter()
    for item_id, human in labels.items():
        record = records.get(item_id)
        if record is None:
            reasons["absent"] += 1
            continue
        call, reason = judge_label(record)
        if reason:
            reasons[reason] += 1
        if call:
            pairs.append((human, call))

    row = {"judge": name_override or judge_name or path.parent.name}
    row.update(score(pairs))
    labelled = len(labels)
    row["labelled_rows"] = labelled
    row["coverage"] = round(len(pairs) / labelled, 4) if labelled else 0.0
    row["arguable"] = reasons["arguable"]
    row["error_rate"] = round(reasons["error"] / labelled, 4) if labelled else 0.0
    row["ungraded"] = reasons["ungraded"] + reasons["absent"]
    row["transcript"] = str(path)
    return row


def baseline_rows(labels: dict[str, str]) -> list[dict]:
    """Two degenerate judges, so the imbalance trap is on the page."""
    rows = []
    for name, call in (("baseline:always-fail", "fail"), ("baseline:always-pass", "pass")):
        pairs = [(human, call) for human in labels.values()]
        row = {"judge": name}
        row.update(score(pairs))
        row["labelled_rows"] = len(labels)
        row["coverage"] = 1.0
        row["arguable"] = 0
        row["error_rate"] = 0.0
        row["ungraded"] = 0
        row["transcript"] = "(not a model)"
        rows.append(row)
    return rows


FIELDS = [
    "rank", "judge", "macro_f1", "cohens_kappa", "mcc", "balanced_accuracy",
    "accuracy", "fail_precision", "fail_recall", "fail_f1", "pass_precision",
    "pass_recall", "pass_f1", "tp_fail", "tn_pass", "fp_false_finding",
    "fn_missed_finding", "compared", "coverage", "labelled_rows", "arguable",
    "error_rate", "ungraded", "transcript",
]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("transcript", nargs="+")
    parser.add_argument("--labels", default="meta-eval/human-labels.csv")
    parser.add_argument("--out", default="results/judge_selection.csv")
    args = parser.parse_args()

    labels = load_labels(Path(args.labels))
    if not labels:
        print("No human labels found.")
        return 1

    rows = [score_run(Path(p), labels) for p in args.transcript]
    rows = [r for r in rows if r.get("compared")]
    rows += baseline_rows(labels)
    # Macro-F1 decides, per the README. Coverage breaks a tie: a judge that
    # answered more rows earned the same number on more evidence.
    rows.sort(key=lambda r: (r.get("macro_f1", 0), r.get("coverage", 0)), reverse=True)
    for index, row in enumerate(rows, start=1):
        row["rank"] = index

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    print(f"{len(labels)} human-labelled rows, {len(rows)} candidates.\n")
    print(f"{'#':>2}  {'judge':<44} {'macroF1':>8} {'kappa':>7} {'MCC':>7} {'balAcc':>7} {'cov':>6}")
    for row in rows:
        print(
            f"{row['rank']:>2}  {row['judge']:<44} {row['macro_f1']:>8.4f} "
            f"{row['cohens_kappa']:>7.3f} {row['mcc']:>7.3f} "
            f"{row['balanced_accuracy']:>7.3f} {row['coverage']:>6.2f}"
        )
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
