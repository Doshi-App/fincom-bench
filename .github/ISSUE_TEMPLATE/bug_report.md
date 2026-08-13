---
name: Bug report
about: Something in the harness or the website does not work
title: "[bug] "
labels: bug
assignees: ''
---

<!--
A wrong figure, a mislabelled row, or a misclassified finding is NOT a bug.
That is a dataset error. Open a pull request that adds a row to ERRATA.md
instead. See CONTRIBUTING.md.

A security vulnerability is NOT a bug report. See SECURITY.md.
-->

## Where

- [ ] Harness (`harness/`)
- [ ] Website (`app/`, `lib/`)
- [ ] Rules or validator (`rules/`, `fincom_runner validate`)
- [ ] Documentation
- [ ] Other:

## What happened

<!-- One or two sentences. -->

## What you expected instead

## Steps to reproduce

The exact command you ran:

```bash

```

## Full output

<!-- Paste everything, including the traceback. Do not trim it. -->

```

```

## Environment

- Operating system and version:
- Python version (`python --version`):
- Node version (`node --version`), if the website is involved:
- Commit (`git rev-parse --short HEAD`):

## Anything else

<!-- Does `cd harness && pytest` pass on your machine? Does
`python -m fincom_runner validate --dataset ../datasets/benchmark-open.csv`
pass? Say so either way. -->
