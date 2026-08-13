"""Turn the phase 2 transcripts into the two published CSVs.

- `results/model_outputs.csv` — one row per model per probe: what the model was
  asked, what it replied, and how the judge marked it. This is the wide record
  a person can read or re-grade.
- `results/leaderboard.csv` — one row per model: pass rate over the probes the
  judge actually decided, plus the per-axis split.

Two honesty rules are enforced here rather than left to the reader.

- **Pass rate uses only decided items.** An item the judge errored on or left
  ungraded is counted in `ungraded`/`errors` and excluded from the denominator,
  so a model cannot climb by failing to be graded. `coverage` shows what share
  of its probes were decided — a low coverage makes the rate less trustworthy,
  and the column is there to say so.
- **A model that is also the judge is flagged.** The README says no assistant
  grades its own leaderboard row. Its row carries `self_graded=yes`.
- **The same weights on 2 inference stacks are 1 leaderboard row, not 2.**
  `merge_cross_provider` folds each pair in `MERGE_GROUPS` — currently Mistral
  Large 3 675B and both GPT-OSS sizes — into 1 row, averaging every rate
  column and summing every count column. `results/model_outputs.csv` stays
  unmerged; only the leaderboard summary combines. See `MERGE_GROUPS` for why
  a different point release does not match and stays 2 rows.
"""

from __future__ import annotations

import argparse
import csv
import json
from collections import defaultdict
from pathlib import Path

OUTPUT_FIELDS = [
    "model", "provider", "item_id", "jurisdiction", "category", "axis",
    "rule_id", "permissions", "threshold", "prompt_variant", "probe", "reply",
    "judge_verdict", "final_verdict", "decided_by", "product_risk",
    "judge_reasoning", "quoted_text", "gate_verdict", "reply_tokens",
]

LEADERBOARD_FIELDS = [
    "rank", "ranked", "model", "provider", "self_graded", "items", "decided", "passes",
    "fails", "arguable", "ungraded", "errors", "pass_rate", "fail_rate",
    "coverage", "behaviour_pass_rate", "compliance_pass_rate",
    "avg_reply_tokens", "judge",
]

# A model must have this share of its probes decided to earn a rank.
MIN_COVERAGE = 0.80

# Same weights, 2 inference stacks — these pairs fold into 1 leaderboard row.
# Keyed by the exact `provider:model` spec each side was run under, so a
# different point release (e.g. Minimax m2.5 on Bedrock vs m2.7 on Ollama)
# does not match and stays 2 separate rows; that is a different test, not the
# same model twice. See results/README.md for why the row is an average, not
# a pooled recount.
MERGE_GROUPS = {
    "mistral-large-3-675b-instruct": (
        "bedrock:mistral.mistral-large-3-675b-instruct",
        "ollama:mistral-large-3:675b",
    ),
    "gpt-oss-120b": (
        "bedrock:openai.gpt-oss-120b-1:0",
        "ollama:gpt-oss:120b",
    ),
    "gpt-oss-20b": (
        "bedrock:openai.gpt-oss-20b-1:0",
        "ollama:gpt-oss:20b",
    ),
}

# The behaviour axis is conduct toward the member; compliance is the rulebook.
# `axis_of` in the runner owns the mapping — this reads it rather than restating.


def load(path: Path) -> list[dict]:
    records = []
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def split_spec(assistant: str) -> tuple[str, str]:
    provider, _, model = assistant.partition(":")
    return (provider, model) if model else ("", assistant)


def _avg(values: list[float]) -> float | None:
    return round(sum(values) / len(values), 4) if values else None


def merge_cross_provider(board: list[dict]) -> list[dict]:
    """Fold each exact pair in `MERGE_GROUPS` into 1 row, averaged.

    Rate columns (`pass_rate`, `fail_rate`, `coverage`, the 2 axis rates,
    `avg_reply_tokens`) average the 2 providers' numbers 50/50. Count columns
    (`items`, `decided`, `passes`, ...) sum, since they describe how much ran,
    not how well it did. `self_graded` carries over if either side is the
    judge. A pair with only 1 side present (the other never ran, or errored
    out entirely) is left as its own unmerged row rather than merged with
    nothing.
    """
    by_key = {f"{row['provider']}:{row['model']}": row for row in board}
    consumed: set[str] = set()
    merged: list[dict] = []
    for name, members in MERGE_GROUPS.items():
        rows = [by_key[key] for key in members if key in by_key]
        if len(rows) < 2:
            continue
        consumed.update(members)
        behaviour = [float(r["behaviour_pass_rate"]) for r in rows if r["behaviour_pass_rate"] not in ("", None)]
        compliance = [float(r["compliance_pass_rate"]) for r in rows if r["compliance_pass_rate"] not in ("", None)]
        tokens = [r["avg_reply_tokens"] for r in rows if r["avg_reply_tokens"] not in ("", None)]
        merged.append({
            "model": name,
            "provider": "+".join(sorted({r["provider"] for r in rows})),
            "self_graded": "yes" if any(r["self_graded"] == "yes" for r in rows) else "no",
            "items": sum(r["items"] for r in rows),
            "decided": sum(r["decided"] for r in rows),
            "passes": sum(r["passes"] for r in rows),
            "fails": sum(r["fails"] for r in rows),
            "arguable": sum(r["arguable"] for r in rows),
            "ungraded": sum(r["ungraded"] for r in rows),
            "errors": sum(r["errors"] for r in rows),
            "pass_rate": _avg([r["pass_rate"] for r in rows if r["pass_rate"] is not None]),
            "fail_rate": _avg([r["fail_rate"] for r in rows if r["fail_rate"] is not None]),
            "coverage": _avg([r["coverage"] for r in rows if r["coverage"] is not None]) or 0.0,
            "behaviour_pass_rate": str(_avg(behaviour)) if behaviour else "",
            "compliance_pass_rate": str(_avg(compliance)) if compliance else "",
            "avg_reply_tokens": round(sum(tokens) / len(tokens)) if tokens else "",
            "judge": rows[0]["judge"],
        })
    survivors = [row for row in board if f"{row['provider']}:{row['model']}" not in consumed]
    return survivors + merged


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("transcript", nargs="+")
    parser.add_argument("--judge", default="", help="The judge spec, to flag self-grading.")
    parser.add_argument("--outputs", default="results/model_outputs.csv")
    parser.add_argument("--leaderboard", default="results/leaderboard.csv")
    args = parser.parse_args()

    import sys
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from fincom_runner.models import axis_of  # noqa: PLC0415

    rows: list[dict] = []
    per_model: dict[str, list[dict]] = defaultdict(list)

    for raw in args.transcript:
        path = Path(raw)
        for record in load(path):
            assistant = record.get("assistant", "") or path.parent.name
            provider, model = split_spec(assistant)
            item = record.get("item", {})
            judge = record.get("judge", {})
            gate = record.get("gate", {})
            category = record.get("category", "")
            row = {
                "model": model,
                "provider": provider,
                "item_id": item.get("item_id", ""),
                "jurisdiction": record.get("jurisdiction", ""),
                "category": category,
                "axis": axis_of(category) if category else "",
                "rule_id": record.get("rule_id", ""),
                "permissions": record.get("permissions", ""),
                "threshold": record.get("threshold", ""),
                "prompt_variant": item.get("prompt_variant", ""),
                "probe": item.get("probe", ""),
                "reply": item.get("reply", ""),
                "judge_verdict": judge.get("verdict", ""),
                "final_verdict": record.get("final_verdict", ""),
                "decided_by": record.get("decided_by", ""),
                "product_risk": record.get("product_risk", ""),
                "judge_reasoning": judge.get("reasoning", ""),
                "quoted_text": judge.get("quoted_text", ""),
                "gate_verdict": gate.get("verdict", ""),
                "reply_tokens": item.get("output_tokens") or "",
            }
            rows.append(row)
            per_model[assistant].append(row)

    rows.sort(key=lambda r: (r["model"], r["item_id"]))
    out_path = Path(args.outputs)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=OUTPUT_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    board = []
    for assistant, items in per_model.items():
        provider, model = split_spec(assistant)
        decided = [r for r in items if r["final_verdict"] in ("pass", "fail", "arguable")]
        passes = sum(1 for r in decided if r["final_verdict"] == "pass")
        fails = sum(1 for r in decided if r["final_verdict"] == "fail")
        arguable = sum(1 for r in decided if r["final_verdict"] == "arguable")
        tokens = [int(r["reply_tokens"]) for r in items if str(r["reply_tokens"]).isdigit()]

        def axis_rate(axis: str) -> str:
            subset = [r for r in decided if r["axis"] == axis]
            if not subset:
                return ""
            return str(round(sum(1 for r in subset if r["final_verdict"] == "pass") / len(subset), 4))

        board.append({
            "model": model,
            "provider": provider,
            "self_graded": "yes" if assistant == args.judge else "no",
            "items": len(items),
            "decided": len(decided),
            "passes": passes,
            "fails": fails,
            "arguable": arguable,
            "ungraded": sum(1 for r in items if r["final_verdict"] == "ungraded"),
            "errors": sum(1 for r in items if r["final_verdict"] == "error"),
            "pass_rate": round(passes / len(decided), 4) if decided else None,
            "fail_rate": round(fails / len(decided), 4) if decided else None,
            "coverage": round(len(decided) / len(items), 4) if items else 0.0,
            "behaviour_pass_rate": axis_rate("behaviour"),
            "compliance_pass_rate": axis_rate("compliance"),
            "avg_reply_tokens": round(sum(tokens) / len(tokens)) if tokens else "",
            "judge": args.judge,
        })

    board = merge_cross_provider(board)

    # A model graded on a handful of probes is not comparable to one graded on
    # all of them, however good its rate looks. Rank the ones with real
    # coverage; list the rest below, unranked, with the reason visible.
    for row in board:
        row["ranked"] = "yes" if row["coverage"] >= MIN_COVERAGE else "no"
    board.sort(
        key=lambda r: (
            r["ranked"] == "yes",
            r["pass_rate"] if r["pass_rate"] is not None else -1,
        ),
        reverse=True,
    )
    rank = 0
    for row in board:
        if row["ranked"] == "yes":
            rank += 1
            row["rank"] = rank
        else:
            row["rank"] = ""

    board_path = Path(args.leaderboard)
    with board_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=LEADERBOARD_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(board)

    print(f"{len(rows)} model-item rows across {len(per_model)} models -> {out_path}")
    print(f"\n{'#':>2}  {'model':<46} {'pass':>6} {'fail':>5} {'rate':>7} {'cov':>6}")
    for row in board:
        rate = "—" if row["pass_rate"] is None else f"{row['pass_rate'] * 100:.1f}%"
        flag = " *" if row["self_graded"] == "yes" else ""
        if row["ranked"] == "no":
            flag += "  (unranked: coverage below "f"{MIN_COVERAGE:.0%})"
        print(
            f"{str(row['rank']):>2}  {row['model'][:44]:<46} {row['passes']:>6} "
            f"{row['fails']:>5} {rate:>7} {row['coverage']:>6.2f}{flag}"
        )
    print(f"\nWrote {board_path}   (* = graded by itself)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
