"""Rank unlabelled meta-eval rows by how much the candidate judges disagree on them.

A human labeller's time is scarce; the 274 rows are not equally informative to
spend it on. `score_judges.py` already ran ~18 candidate judges over the same
100-row labelled set to choose a judge — this script re-reads those same
transcripts (`submissions/judges/*/transcript.jsonl`) and asks a different
question: on the rows nobody has hand-labelled yet, where do the candidates
already agree with each other, and where do they split?

A row where 17 of 18 candidates say `fail` is low-priority for a human to
label next — whichever way it resolves, it will not move which judge wins.
A row where the candidates split close to evenly is exactly the row whose
label could flip the ranking. This produces a worklist ordered by that split,
so a labelling session spends its first hour on the rows that matter most.

This is a priority order, not a label. It never writes to
`harness/pipeline/human-labels.csv` or any per-labeller file `label_rows.py`
writes — the guardrail is the same as `label_rows.py`'s: candidate-judge
output does not become a human label, ever, not even as a tiebreaker.

Usage:
    python harness/pipeline/triage_disagreement.py \
        submissions/judges/*/transcript.jsonl \
        --dataset datasets/meta-eval.csv \
        --out results/triage_worklist.csv
"""

from __future__ import annotations

import argparse
import csv
import sys
from collections import Counter, defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from score_judges import judge_label, load_transcript  # noqa: E402


def load_dataset_meta(path: Path) -> dict[str, dict]:
    with path.open(encoding="utf-8") as fh:
        return {row["item_id"]: row for row in csv.DictReader(fh)}


def load_already_labelled(path: Path) -> set[str]:
    if not path.exists():
        return set()
    with path.open(encoding="utf-8") as fh:
        return {row["item_id"].strip() for row in csv.DictReader(fh) if row.get("human_label")}


def collect_calls(transcript_paths: list[Path]) -> dict[str, Counter]:
    """item_id -> Counter of {"pass": n, "fail": n, "other": n} across candidate judges."""
    calls: dict[str, Counter] = defaultdict(Counter)
    for path in transcript_paths:
        _judge_name, records = load_transcript(path)
        for item_id, record in records.items():
            call, reason = judge_label(record)
            bucket = call if call in ("pass", "fail") else "other"
            calls[item_id][bucket] += 1
    return calls


def disagreement_score(counter: Counter) -> tuple[float, str, int]:
    """0.0 = unanimous, 1.0 = perfect 50/50 split. Decided (pass/fail) judges only."""
    decided = counter["pass"] + counter["fail"]
    if decided == 0:
        return 0.0, "no_decision", 0
    fail_frac = counter["fail"] / decided
    score = 1.0 - abs(fail_frac - 0.5) * 2
    majority = "fail" if counter["fail"] >= counter["pass"] else "pass"
    return round(score, 4), majority, decided


FIELDS = [
    "priority", "item_id", "category", "rule_id", "disagreement_score",
    "majority_label", "n_fail", "n_pass", "n_other", "n_decided",
]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("transcripts", nargs="+", help="submissions/judges/*/transcript.jsonl")
    parser.add_argument("--dataset", default="datasets/meta-eval.csv")
    parser.add_argument("--labels", default="harness/pipeline/human-labels.csv")
    parser.add_argument("--out", default="results/triage_worklist.csv")
    parser.add_argument("--top", type=int, default=20, help="How many rows to print to the console.")
    args = parser.parse_args()

    dataset = load_dataset_meta(Path(args.dataset))
    already = load_already_labelled(Path(args.labels))
    calls = collect_calls([Path(p) for p in args.transcripts])

    rows = []
    for item_id, counter in calls.items():
        if item_id in already:
            continue
        meta = dataset.get(item_id, {})
        score, majority, decided = disagreement_score(counter)
        rows.append(
            {
                "item_id": item_id,
                "category": meta.get("category", ""),
                "rule_id": meta.get("rule_id", ""),
                "disagreement_score": score,
                "majority_label": majority,
                "n_fail": counter["fail"],
                "n_pass": counter["pass"],
                "n_other": counter["other"],
                "n_decided": decided,
            }
        )

    rows.sort(key=lambda r: r["disagreement_score"], reverse=True)
    for i, row in enumerate(rows, start=1):
        row["priority"] = i

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)

    print(f"{len(calls)} rows seen across {len(args.transcripts)} transcripts.")
    print(f"{len(already)} already human-labelled, excluded. {len(rows)} rows in the worklist.\n")
    print(f"{'#':>3}  {'item_id':<10} {'category':<28} {'split':>7}  {'fail/pass/other'}")
    for row in rows[: args.top]:
        print(
            f"{row['priority']:>3}  {row['item_id']:<10} {row['category']:<28} "
            f"{row['disagreement_score']:>7.3f}  {row['n_fail']}/{row['n_pass']}/{row['n_other']}"
        )
    print(f"\nWrote {out_path}")
    print("Highest-scoring rows first are where labelling time moves the judge ranking most.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
