# Security policy

## Report a vulnerability

Open a private GitHub security advisory on [`Doshi-App/fincom-bench`](https://github.com/Doshi-App/fincom-bench):

1. Go to the **Security** tab.
2. Select **Report a vulnerability**.

The advisory stays private until a fix is ready. This is the preferred route.

If advisories are turned off or you cannot reach the Security tab, email the address on the [Doshi-App GitHub profile](https://github.com/Doshi-App) instead. There is no separate security mailbox yet.

Give us the affected file or URL, the steps to reproduce, and what an attacker gains. We will confirm receipt and tell you what we plan to do.

Do not open a public issue for a vulnerability.

## What belongs here

This repository holds 3 things: a benchmark dataset, a Next.js website, and a Python harness. Report any of these:

- A secret, API key, or token committed to the repository or left in a transcript under `submissions/`.
- Command injection, path traversal, or unsafe deserialization in the harness (`harness/`).
- Cross-site scripting or content injection in the website (`app/`, `lib/`).
- A dependency vulnerability that this repository actually reaches.
- Personal data in the dataset or in a run transcript that should not be public.

## What does not belong here

A wrong figure, a misclassified finding, a mislabelled row, or any other data error is **not** a security issue. Report it by pull request that adds a row to [`ERRATA.md`](ERRATA.md). See [`CONTRIBUTING.md`](CONTRIBUTING.md).

A disagreement with a rule or a rubric is also not a security issue. Propose a rule change by pull request.

## Scope

The scope is this repository. The Doshi product, the Doshi FCP endpoint, and any third-party model provider are out of scope here. Report those to the vendor.

## Supported versions

The benchmark has one live version: the `main` branch. Fixes land on `main`. There are no maintained release branches.
