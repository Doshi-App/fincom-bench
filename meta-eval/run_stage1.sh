#!/usr/bin/env bash
# Phase 1: every candidate judge marks the 100 human-labelled rows.
#
# The provider is `dataset`, so every candidate reads the same hand-written
# replies and the only thing that varies is the judge. Rows 001-100 are the
# labelled ones and the file is in item_id order, so --limit 100 is exactly the
# labelled set.
#
# Run under: op run --env-file=secrets.op.env --no-masking -- meta-eval/run_stage1.sh
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
mkdir -p logs submissions

CANDIDATES=(
  "bedrock:us.anthropic.claude-opus-4-5-20251101-v1:0"
  "bedrock:us.anthropic.claude-sonnet-4-6"
  "bedrock:us.anthropic.claude-sonnet-4-5-20250929-v1:0"
  "bedrock:us.anthropic.claude-haiku-4-5-20251001-v1:0"
  "bedrock:deepseek.v3.2"
  "bedrock:qwen.qwen3-235b-a22b-2507-v1:0@us-west-2"
  "bedrock:zai.glm-5"
  "bedrock:moonshotai.kimi-k2.5"
  "bedrock:mistral.mistral-large-3-675b-instruct"
  "bedrock:openai.gpt-oss-120b-1:0"
  "bedrock:minimax.minimax-m2.5"
  "bedrock:us.meta.llama4-maverick-17b-instruct-v1:0"
  "bedrock:us.amazon.nova-pro-v1:0"
  "bedrock:nvidia.nemotron-super-3-120b"
  "ollama:deepseek-v4-pro"
  "ollama:qwen3.5:397b"
  "ollama:nemotron-3-ultra"
  "ollama:glm-5.2"
)

MAX_PARALLEL=5

slug() { echo "$1" | tr ':/@.' '----' | tr -cd 'A-Za-z0-9-'; }

for candidate in "${CANDIDATES[@]}"; do
  while [ "$(jobs -rp | wc -l)" -ge "$MAX_PARALLEL" ]; do wait -n; done
  name="judge-$(slug "$candidate")"
  (
    cd harness || exit 1
    python3 -m fincom_runner run \
      --dataset ../fincom-bench/meta-eval.csv \
      --assistant "hand-written-replies" \
      --provider dataset \
      --judge "$candidate" \
      --limit 100 \
      --concurrency 6 \
      --run-id "$name" \
      --out ../submissions \
      --quiet >"../logs/${name}.log" 2>&1
    echo "done $candidate rc=$?" >>../logs/stage1.log
  ) &
done
wait
echo "stage 1 complete" >>logs/stage1.log
