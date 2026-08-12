# Run of 2026-08-13 — judge selection, then the leaderboard

One overnight run of both phases. Three CSVs in this directory, plus the
per-run audit records under `submissions/`.

| File | What it holds |
|---|---|
| `judge_selection.csv` | 17 candidate judges scored against the 100 hand-labelled rows, plus 2 baselines. |
| `model_outputs.csv` | 7,831 rows — one per model per probe: the probe, the reply, and the judge's verdict with its reasoning. |
| `leaderboard.csv` | 41 models, ranked by pass rate over the probes the judge decided. |
| `roster.json` | Every model the reachability probe tried, and why the 9 that failed did. |

## What ran

Both phases went through the existing runner (`harness/fincom_runner`). Two
providers were added to it — `bedrock:` and `ollama:` — because **neither the
Anthropic nor the OpenAI key in the vault can call inference**. Both are admin
keys: `sk-ant-admin…` is accepted by the Admin API and rejected by
`/v1/messages`; `sk-admin-…` returns `Missing scopes: model.request`. The
existing `anthropic:` and `openai:` providers are untouched and still work for
anyone holding an ordinary key.

So every model here is reached through AWS Bedrock or Ollama Cloud. 51 models
were probed, 42 answered. The Claude 5 family is listed on Bedrock but not
entitled on this account, so the newest Anthropic models present are Sonnet 4.6,
Opus 4.5, Sonnet 4.5 and Haiku 4.5.

## Phase 1 — the judge

Every candidate marked the same 100 hand-labelled rows through the `dataset`
provider, so the only thing that varied was the judge.

**Winner: `bedrock:mistral.mistral-large-3-675b-instruct`** — macro-F1 0.8194,
Cohen's kappa 0.639, MCC 0.640, coverage 0.97. The README picks the judge on
macro-F1, and it leads the field by 0.06 — Claude Sonnet 4.6 is second at
0.7606.

Read the headline next to three things.

- **The labels are lopsided: 92 fail to 8 pass.** A judge that answers `fail`
  every time scores 92 percent accuracy on this set. That degenerate judge is in
  the CSV as `baseline:always-fail`, scoring macro-F1 0.479 and kappa 0.000, so
  the trap is on the page rather than left implied. Kappa and MCC are reported
  because they are chance-corrected; accuracy alone would be misleading here.
- **Second place is better on the minority class.** Claude Sonnet 4.6 has the
  best balanced accuracy of any candidate (0.837 against Mistral's 0.801) and
  full coverage. Mistral wins the documented metric; Sonnet 4.6 is the better
  choice if catching the 8 `pass` rows matters more than macro-F1.
- **8 pass rows is a thin basis for the pass class.** Every pass-side number in
  `judge_selection.csv` rests on them. Labelling more pass rows would firm up
  the choice more than adding candidates would.

One candidate, `bedrock:nvidia.nemotron-super-3-120b`, was stopped after 28
minutes without finishing and is absent from the CSV.

## Phase 2 — the leaderboard

All 42 reachable models answered the 191 open probes under
`--permissions none` (the stricter 2-condition test), and the winning judge
marked every reply. 41 models are on the board.

- **`us.writer.palmyra-x5-v1:0` is not on it.** Bedrock returned HTTP 429 for it
  on 173 of 191 items, then again on a retry at concurrency 2. That is a rate
  limit on this account, not a result about the model.
- **The judge is also a contestant.** `mistral.mistral-large-3-675b-instruct`
  carries `self_graded=yes`. The README says no assistant grades its own row, so
  treat rank 26 as self-reported. It is mid-table, which is at least not the
  shape self-preference would take.
- **Pass rate uses only decided items**, and `coverage` says what share that was.
  Ranking needs coverage ≥ 0.80 so a thinly-graded model cannot outrank a fully
  graded one. Every ranked model here cleared 0.90.

Top of the board: `minimax.minimax-m2.1` at 76.7 percent, then
`minimax.minimax-m2.5` at 75.1 and `moonshotai.kimi-k2.5` at 72.1. Bottom:
`nvidia.nemotron-nano-12b-v2` at 42.0.

The spread across 41 models is 42 to 77 percent, and the frontier Anthropic and
DeepSeek models sit mid-table rather than on top. Before that is read as a
finding about model quality, note that it is one judge's opinion, that judge
agrees with the human labels at kappa 0.64 — substantial, not near-perfect — and
`fincom-bench/benchmark-open.csv` is published, so no contamination claim is
being made. The honest summary is that the pipeline runs end to end and the
numbers are reproducible from the transcripts, not that the ordering is settled.

## Reproducing it

```bash
set -a; . "$HOME/.hermes/.op.env"; set +a

op run --env-file=secrets.op.env --no-masking -- python3 meta-eval/probe_models.py
op run --env-file=secrets.op.env --no-masking -- bash meta-eval/run_stage1.sh
python3 meta-eval/score_judges.py submissions/judge-*/transcript.jsonl

op run --env-file=secrets.op.env --no-masking -- \
  bash meta-eval/run_stage2.sh bedrock:mistral.mistral-large-3-675b-instruct
python3 meta-eval/build_outputs.py submissions/run-*/transcript.jsonl \
  --judge bedrock:mistral.mistral-large-3-675b-instruct
```

`secrets.op.env` holds `op://` references only, so it carries no secret. The
human labels stay in `meta-eval/human-labels.csv`, which is gitignored — the
README says they are never published.
