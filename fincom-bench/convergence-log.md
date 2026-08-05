# Convergence log — Dataset v1

This file holds the mechanism for the two human labellers to disagree and converge, plus the log of every disagreement and the label that survived.

## Mechanism

1. **Mark alone first.** Each marker works through `dataset-v1.md` alone. No shared discussion until both have a full set of labels.
2. **Record every item.** For each item, write your label (`true` / `false`), the bucket (if `true`), the authority you cite (if `true`), and whether you marked `arguable`.
3. **Meet and compare.** Walk through the items. Where the labels agree, the label is locked.
4. **Log the disagreements.** When the labels differ, both markers state their reason in this file. The label only locks when one marker changes their mind, or when a third party is called in to break the tie.
5. **No silent splits.** An item left as "Daniel says true, Benji says false" is not a locked label. It stays open and is removed from the ground-truth set until it resolves.
6. **One label per item.** The locked label is either `true` or `false`. `arguable` is a tag on the label, not a third state.

## What a locked label is

A locked label is the ground truth the grader is scored against. The grader's miss rate and false-positive rate are both measured against these labels. A label that is not locked is not scored.

## Log template

Copy this block for each disagreement. Fill it in when the item is discussed.

```
### Item N

- Daniel: <true/false>, bucket <name>, arguable <yes/no>. Reason: <one or two sentences>.
- Benji: <true/false>, bucket <name>, arguable <yes/no>. Reason: <one or two sentences>.
- Resolution: <Daniel changed to X / Benji changed to Y / third party called / still open>.
- Locked label: <true/false>, bucket <name>, arguable <yes/no>.
- Date: <YYYY-MM-DD>.
```

## Disagreements

_No disagreements logged yet. The first pass has not been run._

## Pass history

| Pass | Date | Items marked | Disagreements | Locked | Still open |
|---|---|---|---|---|---|
| 1 | — | — | — | — | — |

When V2 of the dataset is cut, copy this log to `convergence-log-v2.md` and start a fresh table. The V1 labels stay frozen once locked.