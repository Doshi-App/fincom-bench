# What the next run has to fix

The v1.1 run (12–13 August 2026) proved the machinery end to end and produced a
leaderboard nobody should yet quote an ordering from. This is the queue, in
rough order of how much each item would change the table.

Paper section 8.4 states the same limits in the paper's voice. This file is the
work list.

## 1. Labels — the cheapest thing with the biggest effect

The judge was chosen against 100 hand-labelled rows, **8 of which are pass**.
Every pass-side precision and recall, and therefore the choice of judge itself,
stands on those 8.

- [ ] Label the remaining 174 rows.
- [ ] Deliberately raise the pass count. The set was written to contain
      findings, so it is 92 per cent fail, and that lopsidedness is what makes
      accuracy useless and kappa mandatory. Compliant replies to the same probes
      would balance it. Writing them is a labelling job, not a modelling one.
- [ ] Get a second labeller over the same rows and report inter-labeller
      agreement. The paper reserves a slot for it (§7) and Appendix C lists it
      as not measured. Until it exists, "the human labels" is one person's
      judgement and the benchmark cannot say how reproducible that is.
- [ ] Retire `labeller_a_label`. It is not a human label — see `ERRATA.md`. Leaving a
      contaminated column named after a person in a public dataset is a trap for
      anyone who clones this.

## 2. A stricter meta-evaluation

Phase 1 currently asks one question: does this judge's pass/fail agree with a
person's? That is necessary and not sufficient. A judge can agree on the label
and be right for the wrong reason, and nothing in the current design would
notice.

- [ ] **Report per-category agreement.** A judge that is excellent on
      `expired_figure` and poor on `product_recommendation` looks fine in
      aggregate. 15 categories over 100 rows is too thin to support this today,
      which is itself an argument for item 1.
- [ ] **Score the citation, not just the verdict.** A finding must name the
      clause it breaks. A judge that returns `fail` while citing the wrong
      authority is wrong in a way the current metric scores as correct.
- [ ] **Check the quoted span.** The judge already returns `quoted_text`. Nobody
      checks that the quoted words appear in the reply, or that they are the
      words the finding actually turns on. This is cheap and catches confabulated
      justifications behind correct-looking verdicts.
- [ ] **Measure run-to-run variance.** Mark the same rows n times at temperature
      0 and report the spread. HealthBench reports this; v1.1 does not. A judge
      that flips on 5 per cent of rows between identical runs puts a floor under
      every leaderboard gap.
- [ ] **Test for position and verbosity bias.** Longer replies and hedged
      replies are known to move LLM judges. The rubric says a false positive
      costs more than a missed finding, which pushes toward `pass` — check
      whether that lands evenly across reply lengths.
- [ ] **Probe self-preference directly.** §9.5 records that the meta-eval set
      cannot detect it, because every reply in it is human-written. A set of
      model-written replies, each marked by its own author and by the others,
      would measure it instead of mitigating it procedurally.
- [ ] **Decide what `arguable` means before the run, not after.** The scorer
      currently folds it into `pass`, following the rubric's stance on false
      positives. It is a defensible default and it is a scoring decision made
      downstream of the judge, which is the wrong place for it.

## 3. Repeats, so a gap means something

- [ ] Run every model n≥3 times and publish mean and spread per row.
- [ ] State a minimum detectable difference on the leaderboard, so a reader
      knows when two rows are tied. Right now they frequently are, and the table
      does not say so.

## 4. The serving host

The strongest single finding of v1.1 is not on the leaderboard: **Mistral Large
3 675B scored 65.4 per cent on one host and 59.6 on another** — same weights,
probes, prompt and judge, 5.8 points apart, wider than most adjacent rows.

- [ ] Run a handful of open-weight models across every host that serves them and
      publish the spread as measurement error.
- [ ] Put the host on the leaderboard row. A row currently names a model; it
      should name a model, a host and a date.
- [ ] Record whatever each host discloses about sampling defaults and
      quantisation, and say plainly where it discloses nothing.

## 5. Coverage of the field

- [ ] Add the frontier closed models. They are absent because the account used
      had no entitlement, not because they were excluded. Until they are in, the
      table is open-weight-heavy for a reason that has nothing to do with the
      models.
- [ ] `ollama:kimi-k3` returns HTTP 402 — it bills to extra usage and that
      balance is empty. Add credit and it runs.
- [ ] `bedrock:us.writer.palmyra-x5-v1:0` returns HTTP 429 on most items even at
      concurrency 2. Needs a quota increase or a slower lane.
- [ ] Score the assistants the benchmark was built for: Doshi FCP, a
      general-purpose assistant with and without the benchmark system prompt,
      and a regulated institution's assistant on the 3-condition test. Paper
      §8.1 names these four baselines and none of them has run.

## 6. Things the paper reserves and the run has not touched

- [ ] Recall against the filed corrections. `missrate` is built and the
      corrections file is not in the repository.
- [ ] The holdout split (83 probes) has never been run; only the 191 open probes
      have.
- [ ] Multi-turn probes. v1 grades first turns only, so a caveat given once and
      dropped later is invisible (§9.4).
