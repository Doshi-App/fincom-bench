# The runner

The runner reads the rule files, reads the dataset, executes each test, and
writes a transcript that can be published or audited.

## Start here

```bash
cd harness
pip install -r requirements.txt

# 1. Check the rules and a dataset. No model, no network, no key.
python -m fincom_runner validate --dataset ../fincom-bench/benchmark-open.csv

# 2. Grade the replies the meta-eval set already holds, with the
#    deterministic gate only.
python -m fincom_runner run \
  --dataset ../fincom-bench/meta-eval.csv \
  --assistant hand-written-replies \
  --provider dataset \
  --judge none \
  --out ../submissions
```

Step 2 needs no API key. It finds every expired figure in the set and writes a
transcript. Add `--judge anthropic:<model>` to mark the other 14 categories.

## What one run does

1. Read the rule files from `rules/grading/`. One file is one category. The
   frontmatter gives the rule IDs, the jurisdictions and the citations. The body
   is the pass and fail criteria a person wrote.
2. Read the dataset.
3. For each item:
   1. Get the reply from the provider.
   2. Run the deterministic check, if the category defines one.
   3. Stop if the check failed the item. The check reads published data, so it
      decides.
   4. Otherwise send the rubric, the item and the check result to the judge.
   5. Record the verdict, the citation and the reasoning.
4. Write the transcript.
5. Compare the findings against the corrections people filed, if a corrections
   file is supplied, and compute the miss rate.
6. Produce the leaderboard row for the assistant.

## Providers — where a reply comes from

| Provider | What it does | Needs |
|---|---|---|
| `dataset` | Grade the reply already in the dataset `reply` column. | nothing |
| `replies:<csv>` | Grade replies a person collected by hand. The CSV has an `item_id` column and a `reply` column. | nothing |
| `http:<url>` | Post `{"system", "prompt", "item_id"}` to a JSON endpoint and read `reply` back. | the endpoint |
| `anthropic:<model>` | Call the Anthropic API. | `anthropic`, `ANTHROPIC_API_KEY` |
| `openai:<model>` | Call the OpenAI API. | `openai`, `OPENAI_API_KEY` |

The `replies` provider is the lane for a third-party assistant used through its
ordinary consumer interface. Send the probes by hand, paste the replies into a
2-column CSV, and the assistant scores on the same rules as every other one.

Install the API packages only when you need them:

```bash
pip install -r requirements-providers.txt
```

Set `FINCOM_HTTP_AUTH` to send an `Authorization` header with the `http`
provider. No key is ever written to a transcript.

## The deterministic checks

A check reads published data and answers without a model. Two categories have
published data behind them, so two checks exist.

| Category | Check | Can it fail an item on its own? |
|---|---|---|
| `expired_figure` | Match the reply against `current_value` and `stale_values` in `sourcebooks/statutory_figures/*.md`. | Yes |
| `referenceability_failure` | Look for a named consultancy (PwC, Accenture, Deloitte, McKinsey). | No — evidence only |

Every other category has no published data to check, so the judge decides alone.

A check returns one of 4 verdicts.

- `fail` — the reply states an expired value. Blocking. The judge is skipped,
  unless you pass `--confirm-gate-fails`.
- `pass` — the reply states the value the authority publishes now.
- `inconclusive` — the check saw something but cannot decide. The evidence goes
  into the judge prompt.
- `not_applicable` — nothing the check tracks appears in the reply.

`docs/method.md` says the run errs toward missing findings rather than toward
false positives. So a short number, such as an age, only fails the item when the
reply also names what the figure is about. "You must take Required Minimum
Distributions from age 72" fails. "You will need to think about this when you
turn 72" is inconclusive and goes to the judge.

## The judge

The judge is a model that reads the rubric and marks one reply. The prompt holds
4 parts: the rule and its citation, the threshold, the item, and the check
result. The judge answers in JSON. A judge that answers anything else is
recorded as an error, never as a pass.

Two prompt rules protect the run:

- The worked examples in the rubric name dataset rows and their answers. They
  are dropped from the prompt by default. `--include-examples` puts them back.
  Never use it on the meta-eval set.
- For `product_recommendation`, only the threshold that applies is sent, so the
  judge cannot apply the wrong test.

The run works with `--judge none`. Items no check decided are recorded as
`ungraded`, never as passes.

## Permissions and the threshold

`docs/rubric.md` says the product recommendation threshold is a property of the
submission, not of the rule. The dataset `permissions` column carries a default
per row. `--permissions none|investment_advice` declares what the assistant
under test holds and replaces the column for every row.

- `none` → the 2-condition test.
- `investment_advice` → the 3-condition test.

Doshi FCP holds no advice permission, so a Doshi run declares
`--permissions none`.

## Items the runner refuses to score

A finding must cite its authority. When a category cites no authority in an
item's jurisdiction, the item is recorded as `ungraded` and no finding is
produced. `validate` lists these before a run starts. `--allow-uncited` grades
them anyway, and the finding then carries no citation.

## What a run writes

One run writes one directory under `submissions/<run-id>/`.

| File | What it holds |
|---|---|
| `run.json` | What was run, against what, with what judge, plus the leaderboard. |
| `transcript.jsonl` | One line per item, pass and fail alike, with the check result, the judge verdict and the final verdict. This is the audit record. |
| `report.md` | The same run in human words. Findings first, highest product risk first. |

The finding record follows the shape in `docs/method.md`.

## The other subcommands

```bash
# Rebuild the leaderboard from one or more transcripts.
python -m fincom_runner leaderboard ../submissions/*/transcript.jsonl

# Score a run against the corrections people filed by hand.
python -m fincom_runner missrate ../submissions/<run-id>/transcript.jsonl \
  --corrections corrections.csv

# Rebuild the system_prompt column of a dataset from the prompt builder in
# fincom_runner/prompts.py. The rebuild changes the prompt only — a reply
# collected under an older prompt stays, so regenerate replies after a
# rebuild and before anyone labels them.
python -m fincom_runner prompts ../fincom-bench/benchmark-open.csv
```

The corrections file is a CSV with a `category` column and at least one of
`item_id`, `rule_id` or `lesson_id`. A correction counts as rediscovered when
the run produced a finding in the same category on the same item, rule or
lesson. `docs/method.md` sets the bar at 95 percent, and `missrate` exits
non-zero when the run misses it. See `examples/corrections-sample.csv`.

The roughly 500 filed corrections are not in this repository. Supply the file on
the command line.

## Lesson content

The runner grades lesson slides as well as chat replies. A lesson dataset is a
JSON Lines file, one line per slide. Required keys: `item_id`, `jurisdiction`,
`text`. A line with no `category` expands to one item per category the lesson
axis covers — the 7 compliance categories plus exploiting bias, manipulating
emotion and inappropriate urgency.

```bash
python -m fincom_runner run \
  --dataset examples/lesson-sample.jsonl \
  --assistant doshi-lesson-library \
  --provider dataset \
  --judge none \
  --corrections examples/corrections-sample.csv \
  --out ../submissions
```

## Tests

```bash
cd harness
python -m unittest discover -s tests -t .
```

The suite runs against the real rule files, the real figures and the real
datasets. It makes no network call and needs no API key.

## Why this and not Promptfoo

The academy LLM passes in the server repository use Promptfoo, and that stays
the right choice there. It is not the right choice here, for 4 reasons.

1. The benchmark must score an assistant that has no API. Promptfoo has no lane
   for replies a person collected from a consumer chat interface.
2. The deterministic check reads `sourcebooks/statutory_figures/*.md` and must
   run before any model and independently of one. It is a hard gate, not an
   assertion on a model output.
3. The output is a finding record with a citation, a leaderboard row and a miss
   rate against filed corrections — not a pass/fail matrix.
4. This repository goes public. A clone-and-run story with 1 dependency and no
   Node toolchain is worth more here than a shared config format.
