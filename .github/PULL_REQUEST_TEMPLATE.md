<!--
Thank you for the pull request. Fill in the summary, then check every box that
applies. Delete the sections that do not apply.

See CONTRIBUTING.md for the full process.
-->

## What this changes

<!-- One or two sentences. -->

## Type of change

- [ ] New rule, or a change to a rule (`rules/grading/`)
- [ ] Dataset fix (`datasets/`)
- [ ] Harness (`harness/`)
- [ ] Website (`app/`, `lib/`)
- [ ] Documentation

## Checklist

Every pull request:

- [ ] `cd harness && pip install -r requirements.txt -r requirements-dev.txt && pytest` passes locally.
- [ ] `python -m fincom_runner validate --dataset <path>` passes for every dataset this touches, run from `harness/`. It reports no problem.
- [ ] `npm run lint` and `npm run build` pass, if this changes the website.

If this is a rule change:

- [ ] The citation is attached. Every new or changed rule has an `authority.url` that points at the published text of the authority itself.
- [ ] Every new or changed rule names a `jurisdiction` (one of `uk`, `eu`, `us`, `au`).
- [ ] The rubric body holds both a `## Pass criteria` and a `## Fail criteria` section.
- [ ] No `severity`, `binds`, or `deterministic` field was added.
- [ ] One named reviewer is requested. A rule lands only with that approval.

If this fixes a data error:

- [ ] `ERRATA.md` has a new row for it, with all 5 columns filled in and an ISO date.
- [ ] The row says what was wrong **and** what changed to fix it.
- [ ] The effect on any published score is stated below.

## Effect on published scores

<!-- Does any leaderboard number move? Which models, which categories, by how
much? Write "None" if nothing moves. -->

None.

## Reviewer

<!-- Name the reviewer you want. A rule change needs one named approval. -->
