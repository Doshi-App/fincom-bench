# KYC side study — method

This documents the study summarised at `/kyc`: seven frontier models reviewing one
corporate onboarding pack against a planted defect key, run by Steward in July 2026.
It is a side study published alongside the benchmark — it did not use the FinCom Bench
harness, its probes, or its judge, and its numbers appear nowhere in the benchmark's
results.

## What the study scores

Each model received the same corporate onboarding file a KYC analyst would receive,
and produced a full review: findings, a risk verdict, and the reasoning behind both.
The review was scored two ways:

1. **Recall** — for each of the 14 planted defects, did the model's review catch it?
   A countable credit decision per defect.
2. **Reasoning quality** — how well does the review argue its findings, rank its risks,
   and say what a competent analyst would do next? A judgement, rated out of 10.

The two are reported separately and never combined into one score.

## The pack

A synthetic but realistic corporate onboarding pack for a fund structure with offshore
holding layers: 22 source documents — constitutional documents, registers, passports
and proof-of-address for the named principals, a trust deed, bank references, source-of-
wealth material, screening results. Constructed so that a correct review reaches a
defensible Reject: the structure is deliberately opaque and the risk story does not
close.

The pack is synthetic because scoring recall requires a key. There is no answer sheet
for a live client file — a model cannot be credited against a defect nobody knows is
there. The cost of that choice is a limit, and it is stated under
[What this study does not establish](#what-this-study-does-not-establish).

## The defect key

14 planted defects, each a specific document-level problem a competent reviewer should
find:

- **5 Critical** — defects that on their own justify rejecting the file (an impossible
  date in a trust deed, an unexplained nationality mismatch against a passport, an
  unverifiable source-of-wealth claim, a sanctions near-hit requiring disposition,
  a materially wrong ownership percentage).
- **9 Material** — defects that must be resolved before onboarding can complete
  (missing CDD on registered 10% holders, an outdated register, an unsigned document,
  and so on).

Severity drives what a miss means, not the score: recall counts a caught defect the
same whether it is Critical or Material.

## The clean controls

Two facts in the pack were built to look suspicious and are not: a screening name-match
that clears on date of birth and nationality, and a documented dual national whose
passport pair is consistent. A review that flags either has cried wolf.

Over-flagging is scored because in production it is the failure mode that costs the
most analyst time per incident: a false positive triggers the same escalation path as
a true one. The study reports it as its own number — 0 of 7 models flagged either
control — rather than folding it into recall.

## Blinding

Model identity was sealed before grading. Reviews were shuffled and stripped of
self-identification, and a scan for self-identification (a model naming itself, its
lab, or its distinctive phrasing) gated the human experts' read: no review reached
them carrying its author's name. The two human experts graded independently, from the
same shuffled order, without conferring.

## Two graders, two different jobs

**Recall was graded by two AI judges** — Grok 4.3 and DeepSeek v4-pro — chosen from
different labs and from outside the seven contestants, so no model grades itself or a
sibling. Each judge made every credit decision independently: for each of the 98
model-defect pairs (7 models × 14 defects), a binary caught/not-caught.

**Reasoning quality was rated by the two human experts**, blinded as above, each
producing an independent rating out of 10 and an independent ranking.

## Reliability

The judge layer is strong enough that the recall column does not depend on which judge
produced it:

- The judges agreed on 95 of 98 credit decisions — 96.9% agreement, Cohen's κ 0.93
  across all cells, κ 0.90 on the non-trivial cells (where at least one judge credited
  the catch).
- Their recall rankings correlate at Spearman 0.95.

The human layer agrees at the ends and reorders the middle:

- The two experts' rankings correlate at Spearman 0.64.
- They agreed on last place (Llama 4 Maverick) and disagreed on first: one ranked
  MiniMax M3 top, the other Claude Opus 4.8.

Read that as the honest ceiling of the study: recall is a settled measurement;
reasoning quality is one blinded read, and the second blinded read does not confirm
it beyond the ends of the field.

## The supplementary arm

After the scored results were recorded, two later flagships — Claude Fable 5 and
GPT-5.6 Sol — ran the identical pack and prompt. They were judge-graded only: no human
rating exists for them and none is implied. They are reported beside the scorecard,
not in it, and never ranked against the seven.

## Robustness

A vision variant of the same pack (documents as page images rather than extracted
text) was run as a check: six of the seven models produced a comparable review;
Mistral Large 2512 did not.

## What this study does not establish

- **Not a capability claim.** One pack, one review per model, temperature zero. A
  recall of twelve is a single draw.
- **Not a live-file result.** The pack is synthetic and the defect key is the study's
  own construction.
- **Not a ranking of reasoning quality.** The two human graders disagreed on the
  winner; only the bottom of the field is settled.
- **Not comparable with FinCom Bench.** Different unit of test (a document review
  against a defect key, not a chat reply against conduct rules), different grader,
  different roster, n=1. No number on `/kyc` belongs next to a number on the
  leaderboard.
- **Not a verdict on model generations.** The roster is pinned to 1 July 2026. The
  supplementary arm exists precisely because the frontier moves.

The pipeline that produced these results — pack construction, judge prompts, grading
sheets, and the sealed blinding key — is available on request via the study page,
[Which LLM is the best KYC analyst?](https://getsteward.ai/resources/whitepaper/which-ai-can-do-kyc?utm_source=fincom-bench&utm_medium=referral&utm_campaign=kyc-llm-study)
