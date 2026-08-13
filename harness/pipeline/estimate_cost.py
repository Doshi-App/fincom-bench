"""Add an estimated cost and time column to the leaderboard.

Neither number is exact, and this file says so on every row it cannot back
with a real, first-party rate. 2 pieces are always real, read straight from
the run's own transcript and `run.json`:

- **Output tokens** — `results/model_outputs.csv`, `reply_tokens`. This is
  what the provider's own API reported for that reply.
- **Wall-clock duration** — `submissions/runs/<run>/run.json`,
  `written_at` minus `started_at`, divided by `items * repeats`. `bedrock`
  and `ollama` run each item 10 times by default (see `harness/README.md`,
  "Repeats"); dividing by `repeats` reports the time for 1 pass, so every
  model's number means the same thing regardless of how many passes it
  actually ran.

1 piece is always an estimate, the same for every model: **input tokens**.
The runner never records what a provider billed for the prompt, so this
script estimates it once, with `tiktoken`'s `cl100k_base` encoding, over the
dataset's own `system_prompt` + `probe` columns — every run here used the
same dataset under `--permissions none`, so 1 number applies everywhere:
237.6 tokens/item. That is not any of these models' real tokenizer, so it can
be off in either direction. The 1 place this was checked against a real
number: OpenAI's org cost report showed 47,733 real input tokens for the
gpt-5.4-mini run; this estimate would have said 45,389 — an 5% undercount, in
the direction of understating cost.

Price-per-token is the least uniform piece — see `PRICING` below. Every entry
carries a `note` saying exactly where its rate came from and how much to
trust it. Read the note before quoting the row.
"""

from __future__ import annotations

import csv
import glob
import json
from datetime import datetime
from pathlib import Path

INPUT_TOKENS_PER_ITEM = 237.63874345549738

REPO_ROOT = Path(__file__).resolve().parents[2]

# USD per 1 million tokens. `note` says how confident to be:
# - "exact" / a named first-party page = read straight off that vendor's own
#   pricing page on 2026-08-13.
# - "fallback: ..." = that exact point release isn't listed; priced as the
#   named sibling instead.
# - "not published" = no rate exists on any page checked. Cost is left blank,
#   never guessed.
# - "market-rate stand-in" = Ollama Cloud bills by subscription, not by
#   token (see harness/README.md), so there is no Ollama price to report.
#   This is the SAME underlying open-weight model's rate on a different,
#   per-token host — a stand-in for "what this would cost at a normal API",
#   not what the Ollama Cloud run itself billed (that run's real cost was
#   inside a flat subscription, effectively $0 marginal).
# - "low-confidence source" = a third-party aggregator or reseller listing,
#   not the model vendor's own page. Treat as a rough indication only.
# - "real rate, derived from OpenAI org cost report" = not a public price
#   page at all — back-calculated from this org's own actual August 2026
#   billing data (dollars charged / tokens billed), which is more exact than
#   a list price, not less.
PRICING: dict[str, dict] = {
    "bedrock:deepseek.v3.2": {"in": 0.62, "out": 1.85, "note": "exact"},
    "bedrock:google.gemma-3-12b-it": {"in": 0.09, "out": 0.29, "note": "exact"},
    "bedrock:google.gemma-3-27b-it": {"in": 0.23, "out": 0.38, "note": "exact"},
    "bedrock:minimax.minimax-m2.1": {"in": 0.30, "out": 1.20, "note": "exact"},
    "bedrock:minimax.minimax-m2.5": {"in": 0.30, "out": 1.20, "note": "exact"},
    "bedrock:mistral.devstral-2-123b": {"in": 0.40, "out": 2.00, "note": "exact"},
    "bedrock:mistral.magistral-small-2509": {"in": 0.50, "out": 1.50, "note": "fallback: priced as Magistral Small 1.2"},
    "bedrock:mistral.ministral-3-14b-instruct": {"in": 0.20, "out": 0.20, "note": "exact"},
    "bedrock:mistral.mistral-large-3-675b-instruct": {"in": 0.50, "out": 1.50, "note": "exact"},
    "bedrock:moonshot.kimi-k2-thinking": {"in": 0.60, "out": 2.50, "note": "exact"},
    "bedrock:moonshotai.kimi-k2.5": {"in": 0.60, "out": 3.00, "note": "exact"},
    "bedrock:nvidia.nemotron-nano-12b-v2": {"in": 0.06, "out": 0.23, "note": "fallback: priced as Nemotron Nano 2"},
    "bedrock:nvidia.nemotron-super-3-120b": {"in": 0.15, "out": 0.65, "note": "exact"},
    "bedrock:openai.gpt-oss-safeguard-120b": {"in": 0.15, "out": 0.60, "note": "exact"},
    "bedrock:openai.gpt-oss-120b-1:0": {"in": 0.1545, "out": 0.618, "note": "exact, region label ambiguous on the pricing page"},
    "bedrock:openai.gpt-oss-20b-1:0": {"in": 0.0721, "out": 0.309, "note": "exact, region label ambiguous on the pricing page"},
    "bedrock:qwen.qwen3-235b-a22b-2507-v1:0@us-west-2": {"in": 0.2266, "out": 0.9064, "note": "Asia Pacific (Sydney) rate; no US on-demand price is published"},
    "bedrock:qwen.qwen3-32b-v1:0": {"in": 0.1545, "out": 0.618, "note": "Asia Pacific (Sydney) rate; no US on-demand price is published"},
    "bedrock:qwen.qwen3-coder-480b-a35b-v1:0@us-west-2": {"in": None, "out": None, "note": "not published"},
    "bedrock:qwen.qwen3-next-80b-a3b": {"in": 0.15, "out": 1.20, "note": "exact"},
    "bedrock:us.amazon.nova-lite-v1:0": {"in": 0.06, "out": 0.24, "note": "exact"},
    "bedrock:us.amazon.nova-pro-v1:0": {"in": 0.80, "out": 3.20, "note": "exact"},
    "bedrock:us.anthropic.claude-haiku-4-5-20251001-v1:0": {"in": 1.00, "out": 5.00, "note": "not published on Bedrock; using Anthropic's native API rate as a proxy"},
    "bedrock:us.anthropic.claude-opus-4-5-20251101-v1:0": {"in": 5.00, "out": 25.00, "note": "exact"},
    "bedrock:us.anthropic.claude-sonnet-4-5-20250929-v1:0": {"in": 3.00, "out": 15.00, "note": "exact"},
    "bedrock:us.anthropic.claude-sonnet-4-6": {"in": 3.00, "out": 15.00, "note": "exact"},
    "bedrock:us.deepseek.r1-v1:0": {"in": 1.35, "out": 5.40, "note": "exact"},
    "bedrock:us.meta.llama3-1-70b-instruct-v1:0": {"in": None, "out": None, "note": "not published"},
    "bedrock:us.meta.llama3-3-70b-instruct-v1:0": {"in": 0.72, "out": 0.72, "note": "exact, from an AWS blog pricing table, not the pricing page itself"},
    "bedrock:us.meta.llama4-maverick-17b-instruct-v1:0": {"in": 0.24, "out": 0.97, "note": "exact, from an AWS blog pricing table, not the pricing page itself"},
    "bedrock:us.meta.llama4-scout-17b-instruct-v1:0": {"in": None, "out": None, "note": "not published"},
    "bedrock:zai.glm-4.7": {"in": 0.60, "out": 2.20, "note": "exact"},
    "bedrock:zai.glm-4.7-flash": {"in": 0.07, "out": 0.40, "note": "exact"},
    "bedrock:zai.glm-5": {"in": 1.00, "out": 3.20, "note": "exact"},
    "anthropic:claude-opus-5": {"in": 5.00, "out": 25.00, "note": "exact"},
    "anthropic:claude-sonnet-5": {"in": 2.00, "out": 10.00, "note": "exact"},
    "anthropic:claude-fable-5": {"in": 10.00, "out": 50.00, "note": "exact"},
    "openai:gpt-5.4": {"in": 2.50, "out": 15.00, "note": "real rate, derived from OpenAI org cost report"},
    "openai:gpt-5.4-mini": {"in": 0.75, "out": 4.50, "note": "real rate, derived from OpenAI org cost report"},
    "openai:gpt-5.4-nano": {"in": 0.20, "out": 1.25, "note": "real rate, derived from OpenAI org cost report"},
    "ollama:deepseek-v4-flash:0731": {"in": 0.14, "out": 0.28, "note": "market-rate stand-in: DeepSeek first-party API"},
    "ollama:deepseek-v4-flash:preview": {"in": 0.14, "out": 0.28, "note": "market-rate stand-in: DeepSeek first-party API"},
    "ollama:deepseek-v4-pro": {"in": 0.435, "out": 0.87, "note": "market-rate stand-in: DeepSeek first-party API"},
    "ollama:gemma4:31b": {"in": 0.20, "out": 0.50, "note": "market-rate stand-in: Together AI listing, low-confidence source"},
    "ollama:glm-5.1": {"in": 1.40, "out": 4.40, "note": "market-rate stand-in: Z.ai first-party API"},
    "ollama:glm-5.2": {"in": 1.40, "out": 4.40, "note": "market-rate stand-in: Z.ai first-party API"},
    "ollama:kimi-k2.6": {"in": 0.95, "out": 4.00, "note": "market-rate stand-in: Moonshot first-party API"},
    "ollama:kimi-k2.7-code": {"in": 0.95, "out": 4.00, "note": "market-rate stand-in: OpenRouter listing, low-confidence source"},
    "ollama:minimax-m2.7": {"in": 0.30, "out": 1.20, "note": "market-rate stand-in: OpenRouter/MiniMax listing, low-confidence source"},
    "ollama:minimax-m3": {"in": 0.30, "out": 1.20, "note": "market-rate stand-in: OpenRouter/MiniMax listing, low-confidence source"},
    "ollama:nemotron-3-nano:30b": {"in": 0.05, "out": 0.20, "note": "market-rate stand-in: DeepInfra listing, low-confidence source"},
    "ollama:nemotron-3-super": {"in": 0.085, "out": 0.40, "note": "market-rate stand-in: OpenRouter listing, low-confidence source"},
    "ollama:nemotron-3-ultra": {"in": 0.50, "out": 2.20, "note": "market-rate stand-in: OpenRouter listing, low-confidence source"},
    "ollama:qwen3.5:397b": {"in": 0.60, "out": 3.60, "note": "market-rate stand-in: Alibaba DashScope listing, low-confidence source"},
    "ollama:mistral-large-3:675b": {"in": 0.50, "out": 1.50, "note": "market-rate stand-in: same weights' AWS Bedrock rate"},
    "ollama:gpt-oss:120b": {"in": 0.1545, "out": 0.618, "note": "market-rate stand-in: same weights' AWS Bedrock rate"},
    "ollama:gpt-oss:20b": {"in": 0.0721, "out": 0.309, "note": "market-rate stand-in: same weights' AWS Bedrock rate"},
}

# Same-model pairs that build_outputs.py folds into 1 leaderboard row. Cost
# sums (both hosts really were called); time averages 50/50 — matching how
# build_outputs.py treats count columns vs rate columns for these pairs.
MERGE_GROUPS = {
    "mistral-large-3-675b-instruct": ("bedrock:mistral.mistral-large-3-675b-instruct", "ollama:mistral-large-3:675b"),
    "gpt-oss-120b": ("bedrock:openai.gpt-oss-120b-1:0", "ollama:gpt-oss:120b"),
    "gpt-oss-20b": ("bedrock:openai.gpt-oss-20b-1:0", "ollama:gpt-oss:20b"),
}


def _parse(ts: str) -> datetime:
    return datetime.strptime(ts, "%Y-%m-%dT%H:%M:%SZ")


def load_timing() -> dict[str, dict]:
    timing = {}
    for path in glob.glob(str(REPO_ROOT / "submissions/runs/run-*/run.json")):
        d = json.loads(Path(path).read_text())
        assistant = d["assistant"]
        items = d.get("items", 0)
        repeats = d.get("repeats", 1)
        passes = items * repeats
        try:
            dur = (_parse(d["written_at"]) - _parse(d["started_at"])).total_seconds()
        except KeyError:
            dur = None
        timing[assistant] = {
            "items": items,
            "avg_time_s": (dur / passes) if (dur and passes) else None,
        }
    return timing


def load_output_tokens() -> dict[str, int]:
    totals: dict[str, int] = {}
    with (REPO_ROOT / "results/model_outputs.csv").open(encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            key = f"{row['provider']}:{row['model']}"
            rt = row.get("reply_tokens", "")
            if rt and str(rt).isdigit():
                totals[key] = totals.get(key, 0) + int(rt)
    return totals


def cost_for(key: str, timing: dict, output_tokens: dict) -> float | None:
    price = PRICING.get(key)
    if not price or price["in"] is None or price["out"] is None:
        return None
    items = timing[key]["items"]
    in_tok = items * INPUT_TOKENS_PER_ITEM
    out_tok = output_tokens.get(key, 0)
    return (in_tok / 1e6) * price["in"] + (out_tok / 1e6) * price["out"]


def build_rows() -> dict[str, dict]:
    timing = load_timing()
    output_tokens = load_output_tokens()
    merged_keys = {k for pair in MERGE_GROUPS.values() for k in pair}

    rows: dict[str, dict] = {}
    for name, (a, b) in MERGE_GROUPS.items():
        ca, cb = cost_for(a, timing, output_tokens), cost_for(b, timing, output_tokens)
        ta = timing[a]["avg_time_s"] if a in timing else None
        tb = timing[b]["avg_time_s"] if b in timing else None
        cost = None if (ca is None or cb is None) else ca + cb
        avg_time = None if (ta is None or tb is None) else (ta + tb) / 2
        rows[name] = {"cost_usd": cost, "avg_time_s": avg_time}

    for key in timing:
        if key in merged_keys:
            continue
        _, _, model = key.partition(":")
        rows[model] = {
            "cost_usd": cost_for(key, timing, output_tokens),
            "avg_time_s": timing[key]["avg_time_s"],
        }
    return rows


def main() -> int:
    rows = build_rows()
    leaderboard_path = REPO_ROOT / "results/leaderboard.csv"
    with leaderboard_path.open(encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        fieldnames = list(reader.fieldnames or [])
        records = list(reader)

    for field in ("est_cost_usd_1pass", "avg_time_s_1pass"):
        if field not in fieldnames:
            fieldnames.append(field)

    missing = []
    for record in records:
        row = rows.get(record["model"])
        if row is None:
            missing.append(record["model"])
            continue
        record["est_cost_usd_1pass"] = "" if row["cost_usd"] is None else f"{row['cost_usd']:.6f}"
        record["avg_time_s_1pass"] = "" if row["avg_time_s"] is None else f"{row['avg_time_s']:.3f}"

    with leaderboard_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)

    total = sum(
        float(r["est_cost_usd_1pass"]) for r in records if r.get("est_cost_usd_1pass")
    )
    no_price = [r["model"] for r in records if not r.get("est_cost_usd_1pass")]
    print(f"{len(records)} rows updated -> {leaderboard_path}")
    print(f"total estimated cost (1 pass per model): ${total:.2f}")
    if no_price:
        print(f"no published price for {len(no_price)} model(s): {', '.join(no_price)}")
    if missing:
        print(f"WARNING: no run data at all for {len(missing)} row(s): {', '.join(missing)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
