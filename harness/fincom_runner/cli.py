"""The command line.

5 subcommands.

- `validate` — read the rules, the figures and a dataset, and report anything
  that does not line up. No model, no network.
- `run` — execute a run and write a transcript.
- `leaderboard` — rebuild the leaderboard from one or more transcripts.
- `missrate` — compare a transcript against the corrections people filed.
- `prompts` — rebuild the `system_prompt` column of a dataset from the
  prompt builder. A rebuild changes the prompt only. Replies collected under
  an older prompt stay as they are — regenerate them before labelling.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from .dataset import DatasetError, load_items
from .figures import FigureBook, FigureError
from .judge import build_judge
from .leaderboard import leaderboard, load_corrections, miss_rate
from .models import GateResult, GradedItem, Item, JudgeResult, RepeatRun
from .prompts import PromptError, rebuild_dataset_prompts
from .providers import (
    DEFAULT_REPEATS,
    REPEATED_PROVIDER_KINDS,
    ProviderError,
    build_provider,
    provider_kind,
)
from .rules import RuleBook, RuleError
from .runner import RunConfig, grade_items
from .transcript import now_stamp, run_id_for, write_transcript

REPO_ROOT = Path(__file__).resolve().parents[2]


def _repo_paths(args) -> tuple[Path, Path]:
    root = Path(args.repo).resolve() if args.repo else REPO_ROOT
    return root / "rules", root / "sourcebooks" / "statutory_figures"


def _load_books(args) -> tuple[RuleBook, FigureBook | None]:
    rules_dir, figures_dir = _repo_paths(args)
    rule_book = RuleBook.load(rules_dir)
    figure_book = None
    if figures_dir.is_dir():
        figure_book = FigureBook.load(figures_dir)
    return rule_book, figure_book


# --------------------------------------------------------------------------
# validate


def cmd_validate(args) -> int:
    rule_book, figure_book = _load_books(args)
    problems: list[str] = []

    print(f"Rules: {len(rule_book.rubrics)} categories, {len(rule_book.rules)} rules.")
    if figure_book:
        gateable = sum(1 for f in figure_book.figures if f.stale_values)
        print(
            f"Figures: {len(figure_book.figures)} records, {gateable} with an expired "
            f"value the gate can check."
        )

    for rubric in [rule_book.rubrics[name] for name in sorted(rule_book.rubrics)]:
        for needed in ("PASS criteria", "FAIL criteria"):
            if needed not in rubric.sections:
                problems.append(f"{rubric.path}: the body has no `## {needed}` section")
        for rule in rubric.rules:
            if not rule.jurisdiction:
                problems.append(f"{rubric.path}: rule `{rule.rule_id}` names no jurisdiction")
            if not rule.authority.url:
                problems.append(f"{rubric.path}: rule `{rule.rule_id}` has no authority URL")

    if args.dataset:
        for raw in args.dataset:
            path = Path(raw)
            items = load_items(path)
            print(f"Dataset {path}: {len(items)} items.")
            uncited: list[str] = []
            for item in items:
                if item.category not in rule_book.rubrics:
                    problems.append(
                        f"{path}: item {item.item_id} names category "
                        f"`{item.category}`, which no rule file defines"
                    )
                    continue
                if item.rule_id and not rule_book.rule_for(item.rule_id):
                    problems.append(
                        f"{path}: item {item.item_id} names rule `{item.rule_id}`, "
                        f"which no rule file defines"
                    )
                if not rule_book.rule_for_item(
                    item.rule_id, item.category, item.jurisdiction
                ):
                    uncited.append(f"{item.item_id} ({item.category}/{item.jurisdiction})")
            if uncited:
                problems.append(
                    f"{path}: {len(uncited)} item(s) cite no authority in their "
                    f"jurisdiction and will not be scored: {', '.join(uncited)}"
                )

    if problems:
        print(f"\n{len(problems)} problem(s):")
        for line in problems:
            print(f"  - {line}")
        return 1
    print("\nNo problem found.")
    return 0


# --------------------------------------------------------------------------
# run


def cmd_run(args) -> int:
    rule_book, figure_book = _load_books(args)
    dataset_path = Path(args.dataset)
    items = load_items(dataset_path)

    if args.categories:
        wanted = set(args.categories)
        items = [item for item in items if item.category in wanted]
    if args.jurisdictions:
        wanted = set(args.jurisdictions)
        items = [item for item in items if item.jurisdiction in wanted]
    if args.limit:
        items = items[: args.limit]
    if not items:
        print("No item matched the filters.", file=sys.stderr)
        return 1

    provider = build_provider(
        args.provider, Path(args.replies) if args.replies else None
    )
    judge = build_judge(args.judge)

    # A cheap or self-hosted provider (ollama, bedrock) runs each item 10
    # times and takes the majority verdict, because one flaky reply should
    # not decide a finding. A paid frontier key (anthropic, openai) runs
    # once, because each call costs real money. --repeats overrides either.
    if args.repeats is not None:
        repeats = args.repeats
    elif provider_kind(args.provider) in REPEATED_PROVIDER_KINDS:
        repeats = DEFAULT_REPEATS
    else:
        repeats = 1

    run_id = args.run_id or run_id_for(args.assistant)
    config = RunConfig(
        assistant=args.assistant,
        run_id=run_id,
        permissions_override=args.permissions or "",
        confirm_gate_fails=args.confirm_gate_fails,
        include_examples=args.include_examples,
        concurrency=args.concurrency,
        allow_uncited=args.allow_uncited,
        repeats=repeats,
    )

    started_at = now_stamp()
    done = 0
    total = len(items)

    show_progress = not args.quiet and sys.stderr.isatty()

    def progress(_graded: GradedItem) -> None:
        nonlocal done
        done += 1
        if show_progress:
            print(f"\r  graded {done}/{total}", end="", file=sys.stderr, flush=True)

    if not args.quiet:
        repeat_note = f", {repeats} repeats per item" if repeats > 1 else ""
        print(
            f"Run {run_id}: {total} items, provider `{args.provider}`{repeat_note}, "
            f"judge `{args.judge}`.",
            file=sys.stderr,
        )

    graded = grade_items(
        items, config, provider, judge, rule_book, figure_book, on_progress=progress
    )
    if show_progress:
        print("", file=sys.stderr)

    rules_dir, _ = _repo_paths(args)
    metadata = {
        "run_id": run_id,
        "assistant": args.assistant,
        "started_at": started_at,
        "dataset": str(dataset_path),
        "provider": args.provider,
        "judge": judge.name,
        "permissions": args.permissions or "from the dataset",
        "rules_dir": str(rules_dir),
        "items": total,
        "confirm_gate_fails": args.confirm_gate_fails,
        "include_examples": args.include_examples,
        "repeats": repeats,
    }

    if args.corrections:
        metadata["miss_rate"] = miss_rate(
            graded, load_corrections(Path(args.corrections))
        )

    out_dir = Path(args.out) / run_id
    paths = write_transcript(out_dir, graded, metadata)

    fails = sum(1 for g in graded if g.final_verdict == "fail")
    ungraded = sum(1 for g in graded if g.final_verdict in ("ungraded", "error"))
    print(f"{total} items, {fails} findings, {ungraded} not graded.")
    print(f"Transcript: {paths['transcript']}")
    print(f"Report:     {paths['report']}")
    return 0


# --------------------------------------------------------------------------
# prompts


def cmd_prompts(args) -> int:
    for raw in args.dataset:
        path = Path(raw)
        result = rebuild_dataset_prompts(path)
        variants = ", ".join(
            f"{name}: {count}" for name, count in sorted(result["variants"].items())
        )
        print(f"{path}: {result['rows']} rows rebuilt ({variants})")
    return 0


# --------------------------------------------------------------------------
# leaderboard and missrate


def _graded_from_transcript(path: Path) -> list[GradedItem]:
    """Rebuild graded items from a transcript, enough for scoring."""
    graded = []
    with path.open(encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            record = json.loads(line)
            item_record = record.get("item", {})
            item = Item(
                item_id=item_record.get("item_id", ""),
                jurisdiction=record.get("jurisdiction", ""),
                category=record.get("category", ""),
                rule_id=record.get("rule_id", ""),
                probe=item_record.get("probe", ""),
                permissions=record.get("permissions", "none"),
                reply=item_record.get("reply", ""),
                output_tokens=item_record.get("output_tokens"),
                item_type=item_record.get("type", "chat"),
                lesson_id=item_record.get("lesson_id", ""),
                slide=item_record.get("slide", ""),
            )
            judge = record.get("judge", {})
            gate = record.get("gate", {})
            repeats = tuple(
                RepeatRun(
                    run_index=raw_run.get("run_index", index),
                    reply=raw_run.get("reply", ""),
                    gate=GateResult(
                        applied=bool(raw_run.get("gate", {}).get("applied")),
                        verdict=raw_run.get("gate", {}).get("verdict", "not_applicable"),
                        detail=raw_run.get("gate", {}).get("detail", ""),
                        evidence=tuple(raw_run.get("gate", {}).get("evidence", ())),
                        figure_id=raw_run.get("gate", {}).get("figure_id", ""),
                    ),
                    judge=JudgeResult(
                        verdict=raw_run.get("judge", {}).get("verdict", "skipped"),
                        model=raw_run.get("judge", {}).get("model", ""),
                        reasoning=raw_run.get("judge", {}).get("reasoning", ""),
                        quoted_text=raw_run.get("judge", {}).get("quoted_text", ""),
                    ),
                    final_verdict=raw_run.get("final_verdict", "ungraded"),
                    decided_by=raw_run.get("decided_by", "none"),
                    output_tokens=raw_run.get("output_tokens"),
                )
                for index, raw_run in enumerate(record.get("repeats", ()))
            )
            graded.append(
                GradedItem(
                    item=item,
                    rule=None,
                    gate=GateResult(
                        applied=bool(gate.get("applied")),
                        verdict=gate.get("verdict", "not_applicable"),
                        detail=gate.get("detail", ""),
                        evidence=tuple(gate.get("evidence", ())),
                        figure_id=gate.get("figure_id", ""),
                    ),
                    judge=JudgeResult(
                        verdict=judge.get("verdict", "skipped"),
                        model=judge.get("model", ""),
                        reasoning=judge.get("reasoning", ""),
                        quoted_text=judge.get("quoted_text", ""),
                        product_risk=record.get("product_risk", ""),
                        output_tokens=record.get("judge_output_tokens"),
                    ),
                    final_verdict=record.get("final_verdict", "ungraded"),
                    threshold=record.get("threshold", "n/a"),
                    decided_by=record.get("decided_by", "none"),
                    assistant=record.get("assistant", ""),
                    finding_id=record.get("finding_id", ""),
                    error=record.get("error", ""),
                    repeats=repeats,
                    repeat_tally=dict(record.get("repeat_tally", {})),
                )
            )
    return graded


def cmd_leaderboard(args) -> int:
    graded: list[GradedItem] = []
    for raw in args.transcript:
        graded.extend(_graded_from_transcript(Path(raw)))
    rows = leaderboard(graded)
    if args.json:
        print(json.dumps(rows, ensure_ascii=False, indent=2))
        return 0
    print("| Assistant | Threshold | Items | Graded | Fails | Fail rate |")
    print("|---|---|---|---|---|---|")
    for row in rows:
        rate = "—" if row["fail_rate"] is None else f"{row['fail_rate'] * 100:.1f}%"
        print(
            f"| {row['assistant']} | {row['threshold']} | {row['items']} | "
            f"{row['graded']} | {row['fails']} | {rate} |"
        )
    return 0


def cmd_missrate(args) -> int:
    graded: list[GradedItem] = []
    for raw in args.transcript:
        graded.extend(_graded_from_transcript(Path(raw)))
    result = miss_rate(graded, load_corrections(Path(args.corrections)))
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    print(f"Filed corrections: {result['filed']}")
    print(f"Rediscovered:      {result['rediscovered']}")
    print(f"Missed:            {result['missed']}")
    print(f"Miss rate:         {result['miss_rate']}")
    print(f"Bar (95 percent):  {'met' if result['meets_bar'] else 'not met'}")
    if result["missed_records"] and args.show_missed:
        print("\nMissed:")
        for record in result["missed_records"]:
            print(f"  - {record}")
    return 0 if result["meets_bar"] else 1


# --------------------------------------------------------------------------


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="fincom_runner",
        description="The FinCom Bench runner: read the rules, execute the tests, write a transcript.",
    )
    parser.add_argument(
        "--repo",
        help="The benchmark repository root. Defaults to the repository this runner sits in.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    validate = sub.add_parser("validate", help="Check the rules, figures and a dataset.")
    validate.add_argument("--dataset", action="append", help="A dataset to check. Repeatable.")
    validate.set_defaults(func=cmd_validate)

    run = sub.add_parser("run", help="Execute a run and write a transcript.")
    run.add_argument("--dataset", required=True, help="The dataset CSV or lesson JSONL.")
    run.add_argument("--assistant", required=True, help="The name on the leaderboard row.")
    run.add_argument(
        "--provider",
        default="dataset",
        help="Where the reply comes from: dataset | replies:<csv> | http:<url> | "
        "anthropic:<model> | openai:<model> | bedrock:<model> | ollama:<model>. "
        "Default: dataset.",
    )
    run.add_argument("--replies", help="A replies CSV, for the `replies` provider.")
    run.add_argument(
        "--judge",
        default="none",
        help="The judge: none | anthropic:<model> | openai:<model> | "
        "bedrock:<model> | ollama:<model>. Default: none.",
    )
    run.add_argument(
        "--permissions",
        choices=["none", "investment_advice"],
        help="The permissions the assistant under test holds. Overrides the dataset "
        "column for every row. Leave unset to use the column.",
    )
    run.add_argument("--out", default="submissions", help="Where to write the run directory.")
    run.add_argument("--run-id", help="Override the generated run ID.")
    run.add_argument("--limit", type=int, help="Grade the first N items only.")
    run.add_argument("--categories", nargs="*", help="Grade these categories only.")
    run.add_argument("--jurisdictions", nargs="*", help="Grade these jurisdictions only.")
    run.add_argument("--concurrency", type=int, default=4, help="Items in flight. Default: 4.")
    run.add_argument(
        "--repeats",
        type=int,
        help="Passes per item, decided by majority vote. Default: 10 for the "
        "ollama and bedrock providers, 1 for every other provider.",
    )
    run.add_argument(
        "--confirm-gate-fails",
        action="store_true",
        help="Send items the deterministic gate failed to the judge as well.",
    )
    run.add_argument(
        "--include-examples",
        action="store_true",
        help="Put the worked examples in the judge prompt. Leaks dataset answers — "
        "never use this on the meta-eval set.",
    )
    run.add_argument(
        "--allow-uncited",
        action="store_true",
        help="Grade items whose category cites no authority in their jurisdiction. "
        "Off by default: a finding must name its authority.",
    )
    run.add_argument("--corrections", help="A CSV of filed corrections, to compute the miss rate.")
    run.add_argument("--quiet", action="store_true", help="No progress output.")
    run.set_defaults(func=cmd_run)

    prompts = sub.add_parser(
        "prompts",
        help="Rebuild the system_prompt column of a dataset from the prompt builder.",
    )
    prompts.add_argument(
        "dataset", nargs="+", help="One or more chat dataset CSV files. Rewritten in place."
    )
    prompts.set_defaults(func=cmd_prompts)

    board = sub.add_parser("leaderboard", help="Rebuild the leaderboard from transcripts.")
    board.add_argument("transcript", nargs="+", help="One or more transcript.jsonl files.")
    board.add_argument("--json", action="store_true", help="Print JSON instead of a table.")
    board.set_defaults(func=cmd_leaderboard)

    missed = sub.add_parser("missrate", help="Score a run against the filed corrections.")
    missed.add_argument("transcript", nargs="+", help="One or more transcript.jsonl files.")
    missed.add_argument("--corrections", required=True, help="The filed corrections CSV.")
    missed.add_argument("--json", action="store_true", help="Print JSON instead of a summary.")
    missed.add_argument("--show-missed", action="store_true", help="List every missed correction.")
    missed.set_defaults(func=cmd_missrate)

    return parser


def main(argv: list[str] | None = None) -> int:
    args = build_parser().parse_args(argv)
    try:
        return args.func(args)
    except (
        RuleError,
        FigureError,
        DatasetError,
        ProviderError,
        PromptError,
        ValueError,
    ) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    except FileNotFoundError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
