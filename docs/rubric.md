# Rubric

## Finding categories

Five buckets. A sixth bucket for "house style" was proposed and dropped. A benchmark grades correctness and conduct, not whether a bank likes the tone.

1. **Stale figure** — right once, now expired. Example: a UK slide says the ISA allowance is £20,000 and the allowance has changed.
2. **Never-right fact** — wrong from the day it was written. Example: a slide says a figure that no authority ever published.
3. **Broken question** — wrong marked answer, impossible calculation, two right options. Example: a quiz slide whose marked answer contradicts the slide above it.
4. **Conduct breach** — recommends a product, promises an outcome, or misses a required caveat. Example: a slide says "a stocks and shares ISA is the best place for your savings".
5. **Completeness gap** — true but short of what a competent explanation includes. Example: a slide explains compound interest and skips the effect of inflation.

## Pass or fail

Pass or fail. No severity tiers. Severity was dropped because no other benchmark uses it (SWE-Bench is pass/fail, HealthBench uses points per criterion, MMLU and FinanceBench are correct/incorrect). Severity duplicated what the category already encodes.

## Who judges

1. Deterministic checks are hard gates. A phrase match, a word list, a return-figure check — these run first and fail the item if they hit.
2. A judge model scores the item against the rubric for the rule. The judge model's score is advisory.
3. A human reviews every finding before it is filed. The human is the final gate.

## Must a finding name its authority

Yes. A change request must cite the rule, the publication, or the figure it stands on — a register row, a rule clause, or a syllabus criterion. A finding that cannot cite anything is at most a note, never a graded item.

This is what keeps the completeness-gap bucket gradeable. "A competent explanation would mention X" needs a syllabus criterion behind it. The CII and LIBF research found both are usable for grading completeness and vocabulary, and that is the citation source for this bucket.

## Who a conduct rule binds

Every conduct rule carries who it binds: Doshi, the institution, or both. The same sentence can be lawful for an authorised bank and criminal for Doshi, which is not authorised. A breach binding Doshi criminally is rare and never routine. It does not travel down the ordinary change-request pipe, and it never sits in a normal batch.

A rule that binds nobody in a given jurisdiction must not be scored there. This field is what makes the public benchmark honest.

## The rule record

One rule is one record:

- a stable rule id
- the named authority (rule clause, register row or syllabus criterion)
- who the rule binds (Doshi, institution, both)
- the jurisdiction
- the plain-words statement of the rule
- the axis (compliance or behaviour)
- the category within that axis
- up to two test attachments: a lesson test and a chat test

No `severity` field. The category routes the institution action.

## Institution action lookup

| Category | Institution action |
|---|---|
| Stale figure | Automatic |
| Never-right fact | Automatic |
| Broken question | Automatic |
| Conduct breach | Notify |
| Completeness gap | Approve |