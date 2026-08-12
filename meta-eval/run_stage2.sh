#!/usr/bin/env bash
# Phase 2: every contestant answers the 191 open probes, and the judge that won
# phase 1 marks every reply.
#
# Generation and marking happen in one pass per contestant, so one transcript
# holds both the reply and the verdict for each item — that is the audit record
# the leaderboard and the outputs CSV are both built from.
#
# Usage:
#   op run --env-file=secrets.op.env --no-masking -- meta-eval/run_stage2.sh <judge-spec>
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
mkdir -p logs submissions

JUDGE="${1:?pass the winning judge spec, e.g. bedrock:mistral.mistral-large-3-675b-instruct}"
DATASET="../fincom-bench/benchmark-open.csv"
MAX_PARALLEL="${MAX_PARALLEL:-4}"

# Every model the reachability probe cleared. Read from the roster so the two
# stages cannot drift apart.
mapfile -t CONTESTANTS < <(python3 -c "
import json
for r in json.load(open('results/roster.json')):
    if r['ok']:
        print(f\"{r['kind']}:{r['model']}\")
")

echo "judge: $JUDGE" >logs/stage2.log
echo "contestants: ${#CONTESTANTS[@]}" >>logs/stage2.log

slug() { echo "$1" | tr ':/@.' '----' | tr -cd 'A-Za-z0-9-'; }

for contestant in "${CONTESTANTS[@]}"; do
  while [ "$(jobs -rp | wc -l)" -ge "$MAX_PARALLEL" ]; do wait -n; done
  name="run-$(slug "$contestant")"
  [ -f "submissions/${name}/transcript.jsonl" ] && { echo "skip $contestant (done)" >>logs/stage2.log; continue; }
  (
    cd harness || exit 1
    python3 -m fincom_runner run \
      --dataset "$DATASET" \
      --assistant "$contestant" \
      --provider "$contestant" \
      --judge "$JUDGE" \
      --permissions none \
      --concurrency 6 \
      --run-id "$name" \
      --out ../submissions \
      --quiet >"../logs/${name}.log" 2>&1
    echo "done $contestant rc=$?" >>../logs/stage2.log
  ) &
done
wait
echo "stage 2 complete" >>logs/stage2.log
