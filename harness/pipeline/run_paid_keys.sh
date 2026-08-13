#!/usr/bin/env bash
# Run the paid frontier models — Anthropic and OpenAI — that bedrock and
# ollama cannot reach, then leave the transcripts for build_outputs.py.
#
# The contestant list below is deliberately short and hand-picked, not read
# from a roster like score_contestants.sh. A model already reachable through bedrock
# or ollama (the Claude 4.x family, the GPT-OSS open weights) stays off this
# list on purpose — see harness/README.md, "Anthropic and OpenAI — only the
# models bedrock and ollama cannot reach". Re-adding one here would pay for a
# reply the free lane already produced.
#
# Each of these providers runs 1 pass per item by default (see
# harness/fincom_runner/providers.py, REPEATED_PROVIDER_KINDS) — a paid
# frontier call, unlike the 10 passes bedrock/ollama get, so this list should
# stay short.
#
# Usage:
#   op run --env-file=secrets.op.env --no-masking -- \
#     harness/pipeline/run_paid_keys.sh <judge-spec>
set -uo pipefail

cd "$(dirname "$0")/../.." || exit 1
mkdir -p logs submissions/runs

JUDGE="${1:?pass the winning judge spec, e.g. bedrock:mistral.mistral-large-3-675b-instruct}"
DATASET="../datasets/benchmark-open.csv"
MAX_PARALLEL="${MAX_PARALLEL:-3}"

CONTESTANTS=(
  "anthropic:claude-opus-5"
  "anthropic:claude-sonnet-5"
  "anthropic:claude-fable-5"
  "openai:gpt-5.4"
  "openai:gpt-5.4-mini"
  "openai:gpt-5.4-nano"
)

echo "judge: $JUDGE" >logs/paid-keys.log
echo "contestants: ${#CONTESTANTS[@]}" >>logs/paid-keys.log

slug() { echo "$1" | tr ':/@.' '----' | tr -cd 'A-Za-z0-9-'; }

# `wait -n` needs bash 4.3+. macOS ships bash 3.2 at /bin/bash, which errors
# on `-n` as an invalid option and spins forever instead of blocking. Batch
# by MAX_PARALLEL and `wait` for the whole batch instead — less overlap at a
# batch edge, but it works on every bash this runs on.
running=0
for contestant in "${CONTESTANTS[@]}"; do
  name="run-$(slug "$contestant")"
  if [ -f "submissions/runs/${name}/transcript.jsonl" ]; then
    echo "skip $contestant (done)" >>logs/paid-keys.log
    continue
  fi
  (
    cd harness || exit 1
    python3 -m fincom_runner run \
      --dataset "$DATASET" \
      --assistant "$contestant" \
      --provider "$contestant" \
      --judge "$JUDGE" \
      --permissions none \
      --concurrency 4 \
      --run-id "$name" \
      --out ../submissions/runs \
      --quiet >"../logs/${name}.log" 2>&1
    echo "done $contestant rc=$?" >>../logs/paid-keys.log
  ) &
  running=$((running + 1))
  if [ "$running" -ge "$MAX_PARALLEL" ]; then
    wait
    running=0
  fi
done
wait
echo "paid-key runs complete" >>logs/paid-keys.log
