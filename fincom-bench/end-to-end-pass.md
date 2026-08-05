# End-to-end pass — one real lesson graded

This is the single end-to-end run OPS-1525 merged from OPS-1459. One real lesson from a live institution is graded slide by slide, the findings are rendered as change requests in the real dashboard record shape, and the email an institution admin would see is drafted. The point is to expose what a compliance officer would react to, not to ship.

## Lesson picked

**Lesson.** *What Are Credit Unions?* (en_GB)
**Institution.** Manchester Credit Union (live, UK, FCA-regulated)
**Why this one.** The lesson contains the stale £85,000 FSCS limit (OPS-1451, 8 lessons affected). It is a live lesson at a live institution. The correction is the most defensible in the corpus — the FSCS published £120,000 on 1 December 2025, and a sibling lesson already says £120,000, so Doshi's own library contradicts itself.

## The 4 findings

### Finding 1 — stale figure, the deposit limit

**Slide.** Slide 3, "Is my money safe?".
**Quoted text.** "Your money is protected up to £85,000 if your credit union fails."
**Rule.** FSCS deposit limit, stale figure.
**Authority.** FSCS, "Deposit limit protection increase" — https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/ — retrieved 2026-08-01. The limit moved to £120,000 on 1 December 2025.
**Bucket.** `stale_figure`
**Institution action.** Automatic (stale figure → automatic per OPS-1527).
**Reasoning.** The figure is wrong against the named authority. The FSCS published the new limit 8 months ago. A sibling lesson in the same library already states the correct figure, so the library contradicts itself.

### Finding 2 — broken question, the quiz on the same slide

**Slide.** Slide 4, quiz: "How much of your money is protected if your credit union fails? A) £85,000  B) £120,000  C) £50,000  D) £100,000". Marked answer: A.
**Quoted text.** "A) £85,000" (marked correct).
**Rule.** Broken question — wrong marked answer.
**Authority.** FSCS — same as Finding 1. The correct answer is B (£120,000).
**Bucket.** `broken_question`
**Institution action.** Automatic (broken question → automatic per OPS-1527).
**Reasoning.** The marked answer is the stale figure. The quiz teaches the member the wrong number, which is worse than the slide stating it, because the quiz is the member's recall anchor.

### Finding 3 — completeness gap, the temporary high balance

**Slide.** Slide 3, same slide as Finding 1.
**Quoted text.** "Your money is protected up to £85,000 if your credit union fails." (the slide gives no more detail)
**Rule.** FSCS temporary high balance rule omitted.
**Authority.** FSCS — https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/ — temporary cover up to £1.4m for 6 months applies after a large deposit (a house sale, an inheritance, a divorce settlement).
**Bucket.** `completeness_gap`
**Institution action.** Approve (completeness gap → approve per OPS-1527).
**Reasoning.** A credit-union member may deposit a large sum (a house deposit, a redundancy payment) and lose cover they were entitled to because the slide does not mention the temporary-high-balance rule. The core figure is the bigger problem (Finding 1), but the gap is real on a slide about deposit safety.

### Finding 4 — conduct breach, "protected" wording

**Slide.** Slide 3, same slide as Finding 1.
**Quoted text.** "Your money is protected up to £85,000"
**Rule.** COBS 4.2.5G — "protected" word list.
**Authority.** FCA Handbook, COBS 4.2.5G — https://handbook.fca.org.uk/handbook/cobs4/cobs4s2 — do not use "protected" unless accurate and fully explained.
**Bucket.** `conduct_breach`
**Institution action.** Notify (conduct breach → notify per OPS-1527).
**Reasoning.** "Protected" is on the COBS word list. The word is accurate for a credit union deposit (the FSCS does protect it), but the slide does not fully explain the scheme. Combined with the stale figure, the member reads "my money is protected up to £85,000" and is wrong twice: the limit is £120,000, and "protected" needs the scheme named.

## What the institution admin sees

Each finding lands as a change request in the existing dashboard record shape. The record shape is `server/src/features/academy/types/ChangeRequest.ts`: old slide content, proposed slide content, reason, type tag, reviewer, rejection reason.

### Change request 1

```json
{
  "id": "cr-2026-08-05-001",
  "lessonId": "lesson-what-are-credit-unions",
  "lessonTitle": "What Are Credit Unions?",
  "locale": "en_GB",
  "slideId": "slide-03",
  "institution": "Manchester Credit Union",
  "oldContent": "Your money is protected up to £85,000 if your credit union fails.",
  "proposedContent": "Your eligible deposits are protected up to £120,000 by the Financial Services Compensation Scheme (FSCS) if your credit union fails. For 6 months after a large deposit (for example, a house sale), you may be covered up to £1.4 million.",
  "reason": "The FSCS deposit limit moved from £85,000 to £120,000 on 1 December 2025. The slide states the old limit. The temporary-high-balance rule (up to £1.4m for 6 months) is also missing. Source: FSCS, https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/, retrieved 2026-08-01. The word 'protected' is also named under COBS 4.2.5G without the scheme being named, so the proposed text names the FSCS.",
  "typeTag": "stale_figure",
  "category": "stale_figure",
  "institutionAction": "automatic",
  "reviewer": null,
  "rejectionReason": null,
  "status": "pending"
}
```

### Change request 2

```json
{
  "id": "cr-2026-08-05-002",
  "lessonId": "lesson-what-are-credit-unions",
  "lessonTitle": "What Are Credit Unions?",
  "locale": "en_GB",
  "slideId": "slide-04",
  "institution": "Manchester Credit Union",
  "oldContent": "Quiz: How much of your money is protected if your credit union fails? A) £85,000 (marked correct)  B) £120,000  C) £50,000  D) £100,000",
  "proposedContent": "Quiz: How much of your money is protected if your credit union fails? A) £85,000  B) £120,000 (marked correct)  C) £50,000  D) £100,000",
  "reason": "The marked answer is A (£85,000), the stale FSCS limit. The correct answer is B (£120,000) from 1 December 2025. Source: FSCS, https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/, retrieved 2026-08-01.",
  "typeTag": "broken_question",
  "category": "broken_question",
  "institutionAction": "automatic",
  "reviewer": null,
  "rejectionReason": null,
  "status": "pending"
}
```

### Change request 3 (completeness gap — needs approval)

```json
{
  "id": "cr-2026-08-05-003",
  "lessonId": "lesson-what-are-credit-unions",
  "lessonTitle": "What Are Credit Unions?",
  "locale": "en_GB",
  "slideId": "slide-03",
  "institution": "Manchester Credit Union",
  "oldContent": "Your money is protected up to £85,000 if your credit union fails.",
  "proposedContent": "Your eligible deposits are protected up to £120,000 by the FSCS. For 6 months after a large deposit (for example, a house sale, an inheritance, a redundancy payment), you may be covered up to £1.4 million.",
  "reason": "The slide omits the FSCS temporary-high-balance rule (up to £1.4m for 6 months after a large deposit). A credit-union member may deposit a large sum and lose cover they were entitled to. Source: FSCS, https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/. This is a completeness gap, not a wrong figure — the core limit is addressed in change request 1. This change request asks the institution to approve the additional wording.",
  "typeTag": "completeness_gap",
  "category": "completeness_gap",
  "institutionAction": "approve",
  "reviewer": null,
  "rejectionReason": null,
  "status": "pending"
}
```

### Change request 4 (conduct breach — notify)

```json
{
  "id": "cr-2026-08-05-004",
  "lessonId": "lesson-what-are-credit-unions",
  "lessonTitle": "What Are Credit Unions?",
  "locale": "en_GB",
  "slideId": "slide-03",
  "institution": "Manchester Credit Union",
  "oldContent": "Your money is protected up to £85,000 if your credit union fails.",
  "proposedContent": "Your eligible deposits are protected up to £120,000 by the Financial Services Compensation Scheme (FSCS) if your credit union fails.",
  "reason": "The word 'protected' is on the COBS 4.2.5G word list. The slide uses 'protected' without naming the FSCS, so the word is not 'accurate and fully explained' as the rule requires. The proposed text names the scheme. Source: FCA Handbook, COBS 4.2.5G, https://handbook.fca.org.uk/handbook/cobs4/cobs4s2. This is a conduct breach. It is flagged for the institution's attention; it does not apply automatically.",
  "typeTag": "conduct_breach",
  "category": "conduct_breach",
  "institutionAction": "notify",
  "reviewer": null,
  "rejectionReason": null,
  "status": "pending"
}
```

## The email

```
Subject: 4 change requests on "What Are Credit Unions?" — please review by 19 August

Hi [admin],

Doshi ran a compliance check on one of your live lessons and found 4 items that need attention. Three are applied automatically; one needs your sign-off.

Lesson: What Are Credit Unions? (en_GB)
Institution: Manchester Credit Union

What we found:

1. Stale figure (automatic). Slide 3 states the FSCS deposit limit as £85,000. The limit moved to £120,000 on 1 December 2025. We have updated the text. Source: FSCS.

2. Broken question (automatic). The quiz on slide 4 marks £85,000 as the correct answer. We have updated the marked answer to £120,000. Source: FSCS.

3. Conduct wording (notify). Slide 3 uses the word "protected" without naming the FSCS. The FCA's COBS 4.2.5G rule says this word must be accurate and fully explained. We have proposed new wording that names the scheme. Please review and approve.

4. Completeness gap (approve). Slide 3 does not mention the FSCS temporary-high-balance rule (up to £1.4m for 6 months after a large deposit). We have proposed wording that covers it. Please review and approve.

What happens next:

- Items 1 and 2 are already applied. They will be visible to your members from the next lesson publish.
- Items 3 and 4 sit in your dashboard under Change Requests, waiting for your approval. If we do not hear from you by 19 August 2026, we will apply the proposed wording.
- If you disagree with any item, reply to this email or reject the change request in the dashboard with a reason. We will not knowingly serve a figure we have established is wrong.

You can see all four items in the dashboard under Academy > Change Requests.

Thanks,
Doshi
```

## What this pass exposed

1. **One slide, four findings.** Three of the four findings sit on the same slide. An admin who opens the dashboard and sees four change requests on one lesson reads it as an attack, not a service. The batch should group findings by slide and lead with the headline figure, not list one finding per row.
2. **The automatic changes contradict each other.** Change request 1 and change request 3 both propose new text for slide 3. They overlap. The dashboard has no way to merge them, so the admin sees two proposed versions of the same slide. The runner needs to merge findings on the same slide into one change request before it files.
3. **"Automatic" is too quiet.** The email says items 1 and 2 are "already applied", but the admin sees them in the dashboard as `pending` change requests with no reviewer. The dashboard state and the email state disagree. Either the change request should be `approved` with a Doshi reviewer, or the email should not say "applied".
4. **The reason text is too long.** Each reason paragraph is 4 or 5 sentences. A compliance officer scanning 4 of these on one lesson does not read them. The reason should be 2 sentences: what is wrong, and what authority says so. The long version belongs in a footnote.
5. **The completeness gap is the hardest to defend.** Findings 1, 2, and 4 cite a regulator or the FSCS. Finding 3 cites the FSCS scheme but the gap itself ("the temporary-high-balance rule is missing") is a judgement call. An admin can reasonably say "this is a one-line slide about what a credit union is, the high-balance rule is out of scope". The completeness-gap bucket needs a clearer bar before it goes in an email.
6. **The conduct-breach finding is the weakest.** "Protected" is on the COBS word list, but the word is accurate for a credit-union deposit. The breach is that the scheme is not named, not that the word is wrong. This reads as pedantic. The conduct-breach bucket should carry the severity of the breach, or the runner should not file a conduct breach for a missing scheme name when the figure is the real problem.
7. **No institution is named in the email subject.** The subject says "4 change requests" but not which institution. An admin who manages several institutions cannot triage from the inbox. The subject should name the institution.

## What this pass did not do

- It did not grade the whole lesson, only the 4 slides with findings. A full lesson pass would grade every slide, including the ones with no findings, and produce a transcript.
- It did not measure the grader against the 500 filed corrections. That is OPS-1517, blocked on the runner.
- It did not email anyone. This is a dry run.