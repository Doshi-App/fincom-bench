"""Write the transcript.

One run writes one directory under `submissions/`. The directory holds 3 files.

- `run.json` — what was run, against what, with what judge. No secrets.
- `transcript.jsonl` — one line per item, machine-readable. Every item is here,
  pass and fail alike, with the gate result, the judge verdict and the final
  verdict. This is the audit record.
- `report.md` — the same run in human words, findings first, highest product
  risk first.

The transcript holds the system prompt and the reply for every item, so a reader
can check the run without rerunning it.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from .leaderboard import leaderboard
from .models import GradedItem, axis_of

RISK_ORDER = {"high": 0, "medium": 1, "low": 2, "": 3}
VERDICT_ORDER = {"fail": 0, "arguable": 1, "error": 2, "ungraded": 3, "pass": 4}


def now_stamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def run_id_for(assistant: str, stamp: str | None = None) -> str:
    """A run ID that sorts by date and names the assistant."""
    stamp = stamp or datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    safe = "".join(c if c.isalnum() or c in "-_" else "-" for c in assistant.lower())
    return f"{stamp}-{safe}"


def write_transcript(
    out_dir: Path,
    graded: list[GradedItem],
    metadata: dict,
) -> dict[str, Path]:
    """Write the 3 transcript files and return their paths."""
    out_dir.mkdir(parents=True, exist_ok=True)

    transcript_path = out_dir / "transcript.jsonl"
    with transcript_path.open("w", encoding="utf-8") as handle:
        for item in graded:
            handle.write(json.dumps(item.as_finding_record(), ensure_ascii=False) + "\n")

    rows = leaderboard(graded)
    run_record = {**metadata, "written_at": now_stamp(), "leaderboard": rows}
    run_path = out_dir / "run.json"
    run_path.write_text(
        json.dumps(run_record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    report_path = out_dir / "report.md"
    report_path.write_text(render_report(graded, run_record), encoding="utf-8")

    return {"run": run_path, "transcript": transcript_path, "report": report_path}


def _sort_key(item: GradedItem):
    return (
        VERDICT_ORDER.get(item.final_verdict, 9),
        RISK_ORDER.get(item.judge.product_risk, 3),
        item.item.jurisdiction,
        item.item.item_id,
    )


def render_report(graded: list[GradedItem], run_record: dict) -> str:
    """Render the human-readable report."""
    lines = ["# FinCom Bench run", ""]
    lines += [
        f"- Run ID: `{run_record.get('run_id', '')}`",
        f"- Started: {run_record.get('started_at', '')}",
        f"- Dataset: `{run_record.get('dataset', '')}`",
        f"- Provider: `{run_record.get('provider', '')}`",
        f"- Judge: `{run_record.get('judge', '')}`",
        f"- Permissions applied: `{run_record.get('permissions', 'from the dataset')}`",
        f"- Rules read from: `{run_record.get('rules_dir', '')}`",
        f"- Repeats per item: `{run_record.get('repeats', 1)}`",
        "",
    ]

    lines += ["## Leaderboard", ""]
    lines += [
        "| Assistant | Threshold | Items | Graded | Fails | Fail rate | Ungraded | Errors |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for row in run_record.get("leaderboard", []):
        rate = "—" if row["fail_rate"] is None else f"{row['fail_rate'] * 100:.1f}%"
        lines.append(
            f"| {row['assistant']} | {row['threshold']} | {row['items']} | "
            f"{row['graded']} | {row['fails']} | {rate} | {row['ungraded']} | "
            f"{row['errors']} |"
        )
    lines.append("")

    lines += ["## Fails by category", "", "| Category | Axis | Items | Fails |", "|---|---|---|---|"]
    for row in run_record.get("leaderboard", []):
        for category, cell in sorted(
            row["categories"].items(), key=lambda pair: -pair[1]["fails"]
        ):
            lines.append(
                f"| {category} | {cell['axis']} | {cell['items']} | {cell['fails']} |"
            )
    lines.append("")

    miss = run_record.get("miss_rate")
    if miss:
        lines += [
            "## Miss rate against the filed corrections",
            "",
            f"- Filed corrections: {miss['filed']}",
            f"- Rediscovered: {miss['rediscovered']}",
            f"- Missed: {miss['missed']}",
            f"- Miss rate: {miss['miss_rate']}",
            f"- Bar: find at least {int(miss['bar'] * 100)} percent. "
            f"{'Met.' if miss['meets_bar'] else 'Not met.'}",
            "",
        ]

    findings = [item for item in graded if item.is_finding]
    lines += [f"## Findings ({len(findings)})", ""]
    if not findings:
        lines += ["No finding. A pass produces no record.", ""]

    for item in sorted(findings, key=_sort_key):
        authority = item.rule.authority if item.rule else None
        citation = (
            f"{authority.source} {authority.clause} — {authority.url}"
            if authority
            else "no citation on file"
        )
        quoted = item.judge.quoted_text or ", ".join(item.gate.evidence)
        rule_id = item.rule.rule_id if item.rule else (item.item.rule_id or "not stated")
        lines += [
            f"### {item.finding_id}",
            "",
            f"- **Category.** {item.item.category} ({axis_of(item.item.category)})",
            f"- **Jurisdiction.** {item.item.jurisdiction}",
            f"- **Rule.** `{rule_id}`",
            f"- **Authority.** {citation}",
            f"- **Threshold.** {item.threshold}",
            f"- **Decided by.** {item.decided_by}",
        ]
        if item.repeat_tally:
            tally_text = ", ".join(
                f"{count} {verdict}"
                for verdict, count in sorted(item.repeat_tally.items(), key=lambda pair: -pair[1])
            )
            lines.append(f"- **Repeats.** {len(item.repeats)} runs ({tally_text}).")
        if item.judge.product_risk:
            lines.append(f"- **Product risk.** {item.judge.product_risk}")
        if item.item.probe:
            lines.append(f"- **Probe.** {item.item.probe}")
        if quoted:
            lines.append(f"- **Quoted text.** {quoted}")
        lines += [f"- **Reasoning.** {item.reasoning}", ""]

    problems = [
        item for item in graded if item.final_verdict in ("ungraded", "error", "arguable")
    ]
    if problems:
        lines += [f"## Items that produced no verdict ({len(problems)})", ""]
        lines += ["| Item | Category | Verdict | Why |", "|---|---|---|---|"]
        for item in sorted(problems, key=_sort_key):
            why = item.error or item.reasoning
            lines.append(
                f"| {item.item.item_id} | {item.item.category} | "
                f"{item.final_verdict} | {why.replace('|', '/')} |"
            )
        lines.append("")

    return "\n".join(lines)
