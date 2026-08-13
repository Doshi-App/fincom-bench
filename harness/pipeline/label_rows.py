"""Interactive labelling CLI. Speeds up the human step in phase 1; does not replace it.

Phase 1 needs 2 independent human labellers marking `datasets/meta-eval.csv`
pass/fail, with disagreements resolved by discussion before the agreed label
goes into `harness/pipeline/human-labels.csv` (see
`docs/paper/fincom-bench-paper.md` §7.3). Today that file is edited by hand,
and only 1 labeller has been through it. This tool removes the CSV-editing
friction from that step. It does not remove the step: it never writes a
label itself, and it never reads a candidate judge's output while doing so.

That second point is not decorative. `ERRATA.md` records a prior version of
this dataset where an embedded "labeller_a_label" column turned out to be an
accidental copy of a candidate judge's own verdict — it agreed with the real
hand labels on only 77 of 100 rows. Anything that closes the gap between
"a human labelled this" and "a model labelled this" reintroduces exactly that
mistake. This tool keeps every labeller's raw calls in their own file
(`harness/pipeline/labels-<labeller-id>.csv`), separate from both the judge
transcripts and the resolved `human-labels.csv` a human writes by hand after
the 2 labellers' files are compared.

Usage:
    python harness/pipeline/label_rows.py --labeller alice
    python harness/pipeline/label_rows.py --labeller bob --category exploiting_bias
    python harness/pipeline/label_rows.py --diff harness/pipeline/labels-alice.csv \
        harness/pipeline/labels-bob.csv
"""

from __future__ import annotations

import argparse
import csv
import datetime
from pathlib import Path

DATASET_DEFAULT = "datasets/meta-eval.csv"
RUBRIC_DIR = "rules/grading"
LABEL_KEYS = {"p": "pass", "f": "fail", "a": "arguable", "s": "skip"}
FIELDS = ["item_id", "category", "rule_id", "labeller_id", "label", "labelled_at"]


def load_dataset(path: Path) -> list[dict]:
    with path.open(encoding="utf-8") as fh:
        return list(csv.DictReader(fh))


def load_existing(path: Path) -> dict[str, dict]:
    if not path.exists():
        return {}
    with path.open(encoding="utf-8") as fh:
        return {row["item_id"]: row for row in csv.DictReader(fh)}


def rubric_excerpt(category: str, lines: int = 25) -> str:
    """The prose rubric for 1 category, so a labeller does not leave the terminal for it."""
    path = Path(RUBRIC_DIR) / f"{category}.md"
    if not path.exists():
        return f"(no rubric file at {path})"
    text = path.read_text(encoding="utf-8").splitlines()
    body = [line for line in text if not line.startswith("---")]
    return "\n".join(body[:lines])


def append_row(path: Path, row: dict) -> None:
    is_new = not path.exists()
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=FIELDS)
        if is_new:
            writer.writeheader()
        writer.writerow(row)


def run_session(args: argparse.Namespace) -> int:
    dataset = load_dataset(Path(args.dataset))
    if args.category:
        dataset = [r for r in dataset if r["category"] == args.category]

    out_path = Path(args.out or f"harness/pipeline/labels-{args.labeller}.csv")
    already = load_existing(out_path)

    todo = [r for r in dataset if r["item_id"] not in already]
    if args.limit:
        todo = todo[: args.limit]

    print(f"{len(already)} rows already labelled by '{args.labeller}' in {out_path}.")
    print(f"{len(todo)} rows queued this session. p=pass f=fail a=arguable s=skip q=quit\n")

    last_category = None
    for row in todo:
        if row["category"] != last_category:
            print(f"\n=== Rubric: {row['category']} ({row['rule_id']}) ===")
            print(rubric_excerpt(row["category"]))
            print("=" * 60)
            last_category = row["category"]

        print(f"\n[{row['item_id']}] {row['category']} — {row['rule_id']}")
        print(f"PROBE: {row['probe']}")
        print(f"REPLY: {row['reply']}")
        if row.get("notes"):
            print(f"NOTES: {row['notes']}")

        choice = input("label [p/f/a/s/q]: ").strip().lower()
        if choice == "q":
            print("Stopped early. Re-run the same command to resume where you left off.")
            return 0
        if choice not in LABEL_KEYS:
            print("Not a recognized key — skipping this row without recording anything.")
            continue
        if choice == "s":
            continue

        append_row(
            out_path,
            {
                "item_id": row["item_id"],
                "category": row["category"],
                "rule_id": row["rule_id"],
                "labeller_id": args.labeller,
                "label": LABEL_KEYS[choice],
                "labelled_at": datetime.datetime.now().isoformat(timespec="seconds"),
            },
        )

    print(f"\nDone. {out_path} now holds this labeller's calls.")
    print(
        "This file is not human-labels.csv. Compare it against a second labeller's file "
        "with --diff, resolve disagreements by discussion, and write the agreed label into "
        "harness/pipeline/human-labels.csv by hand."
    )
    return 0


def run_diff(paths: list[str]) -> int:
    if len(paths) != 2:
        print("--diff takes exactly 2 label files.")
        return 1
    a, b = (load_existing(Path(p)) for p in paths)
    shared = sorted(set(a) & set(b))
    if not shared:
        print("No item_id is labelled in both files yet.")
        return 0

    agree = [i for i in shared if a[i]["label"] == b[i]["label"]]
    disagree = [i for i in shared if a[i]["label"] != b[i]["label"]]

    print(f"{len(shared)} rows labelled by both. {len(agree)} agree, {len(disagree)} disagree.\n")
    if disagree:
        print("Disagreements — resolve these by discussion, then write the agreed label into")
        print("harness/pipeline/human-labels.csv by hand. This tool does not pick a winner.\n")
        for item_id in disagree:
            print(f"  {item_id}: {paths[0]}={a[item_id]['label']}  {paths[1]}={b[item_id]['label']}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--labeller", help="Your labeller id, e.g. your first name. Required unless --diff.")
    parser.add_argument("--dataset", default=DATASET_DEFAULT)
    parser.add_argument("--category", default=None, help="Restrict this session to 1 category.")
    parser.add_argument("--limit", type=int, default=None, help="Stop after N new rows this session.")
    parser.add_argument("--out", default=None, help="Defaults to harness/pipeline/labels-<labeller>.csv")
    parser.add_argument("--diff", nargs=2, metavar=("FILE_A", "FILE_B"), default=None)
    args = parser.parse_args()

    if args.diff:
        return run_diff(args.diff)
    if not args.labeller:
        parser.error("--labeller is required unless you're running --diff")
    return run_session(args)


if __name__ == "__main__":
    raise SystemExit(main())
