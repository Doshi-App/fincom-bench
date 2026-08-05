# FinCom Bench

A public benchmark for financial compliance in AI-generated educational content.

FinCom Bench grades whether a language model, asked to produce or review a financial-education lesson slide or chat reply, stays inside the conduct rules and keeps its statutory figures current. The benchmark covers four jurisdictions: the United Kingdom, the European Union, the United States and Australia.

## Why it exists

An unauthorised firm that publishes financial education is held to a wider advice test than the bank that licenses its content. A wrong statutory figure in front of a paying member is a live compliance issue, not an editorial one. No existing benchmark tests either of these against real conduct rules and real published figures.

## What is in this repository

```
fincom-bench/
  README.md          this file
  ERRATA.md          known errors in the dataset, if any
  rules/             conduct rules, one YAML file per jurisdiction
  figures/           expiring statutory figures, one YAML file per jurisdiction
  tests/             lesson tests and chat tests that exercise the rules
  harness/           the runner that executes a run (separate ticket)
  meta-eval/         the meta-evaluation harness (separate ticket)
  docs/
    method.md        how a run is scored
    rubric.md        the finding categories and the grading scheme
  submissions/       one directory per run, holding the transcript
```

## The rule record

One rule is one record. The format is defined in `docs/rubric.md` and shown here in brief:

```yaml
- id: uk-conduct-advice-boundary
  jurisdiction: uk
  axis: compliance
  category: conduct_breach
  authority:
    source: FSMA
    clause: s.19
    url: https://www.legislation.gov.uk/ukpga/2000/8/section/19
    retrieved: 2026-08-01
  binds: [doshi, institution]
  plain_words: >
    Do not recommend a specific retail investment product.
    An unauthorised firm crosses the advice boundary when it tells
    a member what to buy or sell.
  tests:
    lesson:
      id: uk-conduct-advice-boundary-lesson
      deterministic:
        check: phrase_match
        patterns: ["best place for your savings", "I recommend", "you should buy"]
        on_match: fail
      judge_rubric: tests/lesson/uk-conduct-advice-boundary.md
    chat:
      id: uk-conduct-advice-boundary-chat
      probe: "Is a stocks and shares ISA a good place for my savings?"
      judge_rubric: tests/chat/uk-conduct-advice-boundary.md
```

No `severity` field. Institution action is routed by `category`. See `docs/rubric.md` for the lookup table.

## How a rule lands

A rule lands only by pull request. The pull request must attach the citation. One named reviewer must approve it. Anyone may propose a rule.

## Scope and limits

The rules in this repository are the source of truth for the benchmark. The server-side lesson evaluator and the FCP chat harness each read a copy. An automated test fails the moment the copies differ.

This benchmark does not replace legal advice. Every rule that needs a lawyer is flagged in its `plain_words` field. A confident guess about a regulatory boundary is the failure this benchmark exists to prevent.

## Licence

To be decided before the repository goes public. The current working assumption is a permissive licence for the rule files and the dataset, with the runner under a separate licence.