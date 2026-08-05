# FinCom Bench — Dataset v1

The first set of true/false questions for the two human labellers to mark by hand. This file is the ground truth the grader is scored against. Each item is one slide excerpt plus one question: "Is this a finding?" The expected label is `true` (it is a finding) or `false` (it is not).

The 5 buckets come from OPS-1454. The rule format comes from OPS-1527. The figures and conduct rules come from OPS-1451 and OPS-1449.

## How to mark

1. Read the slide excerpt.
2. Answer `true` or `false`: is this a finding?
3. If `true`, name the bucket: `stale_figure`, `never_right_fact`, `broken_question`, `conduct_breach`, or `completeness_gap`.
4. If `true`, name the authority the finding cites. A finding with no cite is at most a note.
5. Mark `arguable` when the rubric below lets a reasonable human go either way. Arguable items are still labelled `true` or `false` — the `arguable` tag says the label is soft, not that the item is skipped.

Mark alone first. Then meet, compare, and log the disagreements in `convergence-log.md`. A label only becomes ground truth when both markers agree.

---

## Item 1 — UK, stale figure

**Slide excerpt.** "Your money is protected up to £85,000 if your bank, building society or credit union fails."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `stale_figure`

**Authority.** FSCS, "Deposit limit protection increase" — https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/ — retrieved 2026-08-01. The limit moved to £120,000 on 1 December 2025.

**Rubric.**
- `true` when the figure is wrong against the named authority at the date the lesson is served. The £85,000 limit was right once and is now expired.
- `false` when the figure is correct, or when the slide carries a date that makes the old figure honest (for example, "as at 2023, the limit was £85,000").
- `arguable` when the slide cites a different authority that still publishes £85,000. No such authority exists for UK deposit protection today.

**Source.** OPS-1451 — 8 lessons carry the stale £85,000. One lesson, *Protect Your Hard-Earned Cash*, already says £120,000, so the library contradicts itself.

---

## Item 2 — UK, stale figure, the contradiction

**Slide excerpt.** "Your eligible deposits are protected up to £120,000 by the Financial Services Compensation Scheme."

**Question.** Is this a finding?

**Expected label.** `false`

**Bucket.** (no finding)

**Authority.** FSCS — same as Item 1. £120,000 is the correct limit from 1 December 2025.

**Rubric.**
- `true` when the figure is wrong. It is not.
- `false` when the figure matches the authority. It does.
- `arguable` when the temporary-high-balance rule (up to £1.4m for 6 months) is not mentioned. The slide omits it, but the core figure is right. See Item 19 for the completeness call.

**Source.** OPS-1451 — *Protect Your Hard-Earned Cash* is the one lesson that is right.

---

## Item 3 — UK, never-right fact

**Slide excerpt.** "The FSCS protects your deposits up to £120,000 per authorised institution, so if you have accounts with two banks you are covered up to £240,000."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `never_right_fact`

**Authority.** FSCS — the £120,000 limit applies per **authorised firm**, not per "institution" in the loose sense. Two brands that share one banking licence (for example, two brands under one bank) share one £120,000 pot. The rule has been per-licence for as long as the scheme has existed.

**Rubric.**
- `true` when the sentence was wrong the day it was written, not wrong because time passed. The per-institution framing was never the rule.
- `false` when the sentence is right. A slide that says "per authorised firm" is right.
- `arguable` when the slide uses "institution" but defines it as "a firm with its own banking licence". A defined term that matches the rule is not a finding.

**Source.** Constructed from the OPS-1451 contradiction. The wrong framing is common in the corpus and the right one is rare.

---

## Item 4 — UK, stale figure

**Slide excerpt.** "The pension Annual Allowance is £40,000."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `stale_figure`

**Authority.** HMRC, "Tax on your private pension" — https://www.gov.uk/tax-on-your-private-pension/annual-allowance — retrieved 2026-08-01. The allowance moved to £60,000 in April 2023.

**Rubric.**
- `true` when the figure is wrong against HMRC. £40,000 was right before April 2023.
- `false` when the slide states £60,000, or carries a date that makes the old figure honest.
- `arguable` when the slide mentions the taper for high earners. The figure itself is still stale, so the taper does not rescue it. A slide that says "£60,000, tapering to £10,000 above £260,000 income" is fully right.

**Source.** OPS-1451 — *Making lump sum pension contributions*.

---

## Item 5 — UK, never-right fact

**Slide excerpt.** "The Lifetime Allowance for pensions is £1,073,100."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `never_right_fact`

**Authority.** HMRC, "Abolition of the Lifetime Allowance" — https://www.gov.uk/government/publications/abolition-of-the-lifetime-allowance-from-6-april-2024/ — the allowance was abolished on 6 April 2024 and replaced by a £268,275 lump sum allowance.

**Rubric.**
- `true` when the slide names a thing that no longer exists as if it still does. The Lifetime Allowance is gone. A slide that says "the Lifetime Allowance is £1,073,100" is wrong today, and a slide that says "the Lifetime Allowance was £1,073,100 before April 2024" is right.
- `false` when the slide uses the post-2024 vocabulary (lump sum allowance, overseas transfer allowance) correctly. The CII R04 grid is the controlled vocabulary for this.
- `arguable` when the slide says the allowance "is being abolished". That was right during 2023 and is wrong now. Mark it stale, not never-right, when the tense carries a date.

**Source.** OPS-1451 — *Making lump sum pension contributions*. The CII R04 grid still lists the abolished allowance alongside its replacements (OPS-1450), which is a warning that a syllabus can lag the rule.

---

## Item 6 — UK, stale figure

**Slide excerpt.** "National Insurance is charged at 12% on your earnings between £242 a week and £967 a week."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `stale_figure`

**Authority.** HMRC, "National Insurance rates and categories" — https://www.gov.uk/national-insurance-rates-letters — retrieved 2026-08-01. The main employee rate moved to 8%.

**Rubric.**
- `true` when the rate is wrong. 12% was right before the January 2024 cut.
- `false` when the rate matches HMRC. 8% is the current main rate.
- `arguable` when the slide states the old rate under a clear date label. A worked example labelled "2023/24" using 12% is honest. A worked example with no date using 12% is stale.

**Source.** OPS-1451 — *Salary sacrifice vs take-home myths*. The worked example (£100 costs £68) is also arithmetically wrong at 8%.

---

## Item 7 — UK, stale figure

**Slide excerpt.** "The new State Pension is £230.25 a week."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `stale_figure`

**Authority.** DWP, "The new State Pension" — https://www.gov.uk/new-state-pension/what-youll-get — retrieved 2026-08-01. The 2026/27 rate is £241.30 a week.

**Rubric.**
- `true` when the figure is wrong. £230.25 was the 2025/26 rate.
- `false` when the figure is £241.30, or when the slide carries a year label that makes the old figure honest.
- `arguable` when the slide says "as of 2026" and gives a 2025/26 figure. *Understanding Government Retirement Benefits* does exactly this. That is a never-right fact, not a stale one, because the slide names the year and gets it wrong.

**Source.** OPS-1451 — two lessons, one stale, one with a wrong year label.

---

## Item 8 — UK, never-right fact

**Slide excerpt.** "If you earn over £50,000, the High Income Child Benefit Charge starts to reduce your Child Benefit."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `never_right_fact`

**Authority.** HMRC, "Child Benefit tax charge" — https://www.gov.uk/child-benefit-tax-charge — the threshold moved to £60,000 in April 2024.

**Rubric.**
- `true` when the figure was wrong the day it was written if the lesson was published after April 2024. If the lesson predates the change, this is a stale figure, not a never-right fact. Mark `arguable` when you cannot tell the lesson's publish date.
- `false` when the figure is £60,000 and the taper to £80,000 is shown.
- `arguable` when the slide gives no date and no threshold. That is a completeness gap, not a never-right fact.

**Source.** OPS-1451 — *How Much Does It Really Cost to Have a Baby?*

---

## Item 9 — UK, conduct breach

**Slide excerpt.** "A stocks and shares ISA is the best place for your savings."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `conduct_breach`

**Authority.** FSMA s.19 and s.21 — https://www.legislation.gov.uk/ukpga/2000/8/section/19 — Doshi is not an authorised firm, so the advice boundary is wider for Doshi than for its bank clients. A recommendation about a particular investment is a regulated activity for Doshi even when it would be lawful for the bank. PERG 8.28 says a "significant element of evaluation, value judgment or persuasion" is advice, not information.

**Rubric.**
- `true` when the slide expresses an opinion or recommendation about a **particular** investment. "A stocks and shares ISA is the best place" is a recommendation. "A stocks and shares ISA is one type of investment account" is information.
- `false` when the slide stays at the asset-class level with no opinion. "Equities have historically returned more than cash over long periods" is information if it carries the past-performance warning.
- `arguable` when the slide compares asset classes and names a winner without naming a product. "Over 20 years, equities have beaten cash" is close to the line. The line is persuasion: if the slide urges the member to act, it is advice; if it states a fact with a caveat, it is information.

**Source.** OPS-1449 — the UK advice boundary is the rule the whole map leans on. This is Case B from OPS-1454.

---

## Item 10 — UK, conduct breach

**Slide excerpt.** "Don't leave your money losing value in cash — act now."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `conduct_breach`

**Authority.** FSMA s.21 — https://www.legislation.gov.uk/ukpga/2000/8/section/21 — an unauthorised firm must not communicate an invitation or inducement to engage in investment activity unless an authorised approver signs it off. PERG 8.4.4 sets the objective test: would a reasonable observer think the communicator intended to persuade or incite?

**Rubric.**
- `true` when the slide urges the member to act on an investment. "Act now" is incitement.
- `false` when the slide states a fact with no call to action. "Inflation reduces the real value of cash over time" is information.
- `arguable` when the slide uses soft language. "It might be worth reviewing your savings" is close to the line. The test is whether a reasonable observer reads it as persuasion.

**Source.** OPS-1449 — PERG 8.4.4. This is the test that sits next to the advice boundary in Item 9.

---

## Item 11 — UK, conduct breach

**Slide excerpt.** "Your money is protected in a stocks and shares ISA."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `conduct_breach`

**Authority.** COBS 4.2.5G — https://handbook.fca.org.uk/handbook/cobs4/cobs4s2 — do not use "guaranteed", "protected", or "secure" unless accurate and fully explained. A stocks and shares ISA is an investment account; its value can fall.

**Rubric.**
- `true` when the word "protected" is used and the product is not capital-guaranteed. A stocks and shares ISA is not.
- `false` when the word is accurate. A cash ISA held with a bank is covered by the FSCS up to £120,000, so "protected up to £120,000" is right if the slide also names the scheme.
- `arguable` when the slide says "protected from tax" (the ISA wrapper's tax treatment is real) but does not say "protected from loss". Read the whole sentence. If the member could read it as "your capital is safe", it is a finding.

**Source.** OPS-1449 — COBS 4.2.5G is the mechanical word-list rule.

---

## Item 12 — UK, conduct breach

**Slide excerpt.** "£100 a month grows to £48,000 in 20 years."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `conduct_breach`

**Authority.** COBS 4.6.2R — https://handbook.fca.org.uk/handbook/cobs4/cobs4s6 — future performance must rest on reasonable assumptions, show negative as well as positive scenarios, and warn that forecasts are unreliable. A single projected figure with no warning is a breach.

**Rubric.**
- `true` when the slide gives a projected figure with no risk warning and no negative scenario.
- `false` when the slide states the assumption (for example, "assuming 6% annual growth"), shows a negative scenario, and carries the past-performance warning.
- `arguable` when the slide gives a range, not a single figure. A range is better, but the warning is still required. Mark `arguable` if the range is shown but the warning is missing, and `true` if neither range nor warning is shown.

**Source.** OPS-1449 — COBS 4.6.2R / 4.6.7R. Mostly mechanical: detect a projected figure, then require the warning string.

---

## Item 13 — EU, stale figure

**Slide excerpt.** (Bulgarian) "Първоначална вноска за жилище: 200 000 лева." ("Down payment for a home: 200,000 leva.")

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `stale_figure`

**Authority.** Council of the EU decision, July 2025 — https://www.consilium.europa.eu/en/press/press-releases/2025/07/08/bulgaria-ready-to-use-the-euro-from-1-january-2026-council-takes-final-steps/ — Bulgaria adopted the euro on 1 January 2026. The lev ceased to be legal tender on 1 February 2026. Every lev amount must be redenominated at the fixed rate of 1.95583.

**Rubric.**
- `true` when the slide states a lev amount and the lesson is served after 1 February 2026. The lev is gone.
- `false` when the slide states the euro equivalent, or when the slide carries a clear "pre-2026" date label.
- `arguable` when the slide gives both the lev and the euro amount. If the euro figure is wrong (wrong rate, wrong rounding), it is a never-right fact. If the euro figure is right, the slide is right even if the lev figure is shown for context.

**Source.** OPS-1451 — every `bg_BG` lesson that states a lev amount. This is the single largest cluster of stale figures in the corpus.

---

## Item 14 — EU, never-right fact

**Slide excerpt.** (Bulgarian) "Кредитният рейтинг се състои от 35% история на плащанията, 30% дължими суми, 15% дължина на кредитната история, 10% видове кредити и 10% нови кредити." ("Credit score: 35% payment history, 30% amounts owed, 15% length, 10% credit mix, 10% new credit.")

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `never_right_fact`

**Authority.** None. FICO is a private US company and does not operate in Bulgaria. The weights are FICO's own approximation and vary by scorecard. No Bulgarian authority publishes a credit-score composition.

**Rubric.**
- `true` when the slide states FICO weights as fact in a market where FICO does not operate. This is a localisation error, not staleness. The weights were never right for Bulgaria.
- `false` when the slide is in `en_US` and clearly labels the weights as FICO's. Even then, FICO is not an authority, so the slide is at best a note. Mark `arguable` in `en_US` if the slide labels the source; mark `true` in `en_US` if it presents the weights as a general fact.
- `arguable` when the slide says "a typical scoring model weighs payment history most heavily". That is hedged and closer to information. Mark `arguable` rather than `true` because the claim is vague enough to be defensible.

**Source.** OPS-1451 — ~15 `en_US` lessons and several `bg_BG` lessons. One of the 6 figures with no publishing authority.

---

## Item 15 — EU, conduct breach

**Slide excerpt.** "European bank shares look cheap right now."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `conduct_breach`

**Authority.** MAR art. 20(1) with art. 3(1)(35) — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32014R0596 — "persons who produce or disseminate investment recommendations shall take reasonable care to ensure that such information is objectively presented, and to disclose their interests or indicate conflicts of interest." This binds Doshi directly, not through the institution.

**Rubric.**
- `true` when the slide names an instrument or issuer and gives an opinion on its value. "European bank shares look cheap" names a sector and calls it cheap.
- `false` when the slide states a fact with no opinion. "European bank shares fell 3% last quarter" is information.
- `arguable` when the slide compares asset classes without naming a product. "European equities have a lower price-to-book ratio than US equities" is information if it cites the source. It becomes a finding if the slide then says "so European equities are a better buy".

**Source.** OPS-1449 — MAR art. 20 is the one EU rule that binds Doshi directly.

---

## Item 16 — EU, completeness gap

**Slide excerpt.** "Income protection pays out if you can't work."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `completeness_gap`

**Authority.** CII R05 learning outcome 3 — https://media.umbraco.io/ciigroup-dxp/ssbou4bu/r05-indicative-content-2026-2027.pdf — a protection explanation is incomplete against the profession's own standard if it does not cover State support. Also IDD art. 17 — https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016L0097 — insurance information must be fair, clear and not misleading; omitting the deferred period and the exclusions is misleading.

**Rubric.**
- `true` when the slide states the headline benefit and omits the conditions that decide whether the member will actually get it. The deferred period, the exclusions, and the State benefit alternative are all required for a complete explanation.
- `false` when the slide covers the deferred period, the main exclusions, and the State alternative. A slide that says "income protection pays out after a waiting period, excludes pre-existing conditions, and State benefits may also help" is complete.
- `arguable` when the slide is short but mentions one of the three. The completeness bar is the CII R05 grid; one of three is a gap, not a pass. Mark `arguable` only if the slide is a summary slide that points to a longer lesson covering the rest.

**Source.** OPS-1450 — CII R05. This is the hardest bucket to cite, and the CII grid is the citation that keeps it gradeable.

---

## Item 17 — US, stale figure

**Slide excerpt.** "The age for Required Minimum Distributions from your IRA is 72."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `stale_figure`

**Authority.** IRS, "Required minimum distributions" — https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds — SECURE 2.0 moved the age to 73 for those born 1951–59 and 75 for those born 1960 or later.

**Rubric.**
- `true` when the slide gives one age and the rule is a table by birth year. 72 was right before SECURE 2.0 and is wrong now.
- `false` when the slide gives the table or names the two ages (73 and 75) with the birth-year split.
- `arguable` when the slide says "age 73" without the 75 half. That is half right. Mark `true` because the slide is wrong for anyone born 1960 or later.

**Source.** OPS-1451 — *Intro to IRAs* states 72 twice.

---

## Item 18 — US, stale figure

**Slide excerpt.** "The 401(k) contribution limit is $23,000."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `stale_figure`

**Authority.** IRS Notice 2025-67 — https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500 — the 2026 limit is $24,500, with a $32,500 combined limit for catch-up.

**Rubric.**
- `true` when the figure is wrong. $23,000 was the 2024 limit.
- `false` when the figure is $24,500 (2026) and the catch-up limit is shown for those 50 and over.
- `arguable` when the slide carries a year label. "$23,000 in 2024" is honest. "$23,000" with no label is stale.

**Source.** OPS-1451 — *Evaluating Your Progress Yearly*.

---

## Item 19 — UK, completeness gap

**Slide excerpt.** "Your eligible deposits are protected up to £120,000 by the Financial Services Compensation Scheme."

**Question.** Is this a finding?

**Expected label.** `arguable` (lean `true`)

**Bucket.** `completeness_gap`

**Authority.** FSCS — https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/ — the £120,000 limit is right. The temporary-high-balance rule (up to £1.4m for 6 months after a large deposit) is not mentioned.

**Rubric.**
- `true` when the slide covers a deposit scenario where the temporary-high-balance rule matters (for example, a house sale) and omits it. The member could lose cover they were entitled to.
- `false` when the slide is a general introduction and the temporary rule is out of scope. A one-line "your money is protected up to £120,000" on a slide about what a credit union is does not need the high-balance rule.
- `arguable` when the slide is general but the lesson as a whole covers large deposits. Lean `true` if the lesson mentions house deposits anywhere; lean `false` if it does not.

**Source.** Item 2 in this dataset. The core figure is right; the completeness call is the open question.

---

## Item 20 — broken question

**Slide excerpt.** Quiz question: "What is the FSCS deposit limit? A) £85,000  B) £120,000  C) £100,000  D) £50,000". Marked answer: A.

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `broken_question`

**Authority.** FSCS — https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/ — the correct answer is B (£120,000). The marked answer A (£85,000) is the stale figure.

**Rubric.**
- `true` when the marked answer is wrong. A is wrong.
- `false` when the marked answer is right and no other option is also right.
- `arguable` when two options are right. If both A and B are marked as right, or if the lesson was written when £85,000 was correct and the question was not updated, mark `arguable` and note the double-right issue. Two right options is a separate broken-question failure.

**Source.** Constructed from the OPS-1451 contradiction. The stale figure propagates into the quiz, which is the most common way a broken question appears in this corpus.

---

## Item 21 — control, no finding

**Slide excerpt.** "An ISA is a tax-efficient wrapper for savings and investments. The UK government sets the annual limit."

**Question.** Is this a finding?

**Expected label.** `false`

**Bucket.** (no finding)

**Authority.** HMRC — https://www.gov.uk/individual-savings-accounts — the statement is correct and carries no opinion.

**Rubric.**
- `true` when the slide states a wrong figure, names a product, or urges an action. This slide does none of those.
- `false` when the slide is a correct, opinion-free definition. This one is.
- `arguable` when "tax-efficient" could be read as advice. It is not; it is the standard description of the ISA wrapper, used by HMRC itself.

**Source.** Control item. Every dataset needs items where the right answer is `false`, or the grader learns to say `true` to everything.

---

## Item 22 — control, no finding

**Slide excerpt.** "Compound interest is when you earn interest on your interest as well as on your original amount."

**Question.** Is this a finding?

**Expected label.** `false`

**Bucket.** (no finding)

**Authority.** No authority needed — this is a definition, not a figure or a recommendation.

**Rubric.**
- `true` when the definition is wrong. It is not.
- `false` when the definition is right. It is.
- `arguable` when the slide says "compound interest is the best way to grow your money". That is advice. This slide does not say that.

**Source.** Control item. This is Case C from OPS-1454 (the compound-interest example), but stripped of the inflation omission that made Case C a completeness gap. A bare definition is not a finding.

---

## Item 23 — UK, completeness gap

**Slide excerpt.** "Compound interest is when you earn interest on your interest. Over time, your money grows faster than with simple interest."

**Question.** Is this a finding?

**Expected label.** `arguable` (lean `true`)

**Bucket.** `completeness_gap`

**Authority.** CII R02 indicative content — https://media.umbraco.io/ciigroup-dxp/eyfd3rya/r02-indicative-content-2026-2027.pdf — a competent explanation of compounding covers the effect of inflation on real returns. The R02 grid lists "the impact of inflation on returns" as required knowledge.

**Rubric.**
- `true` when the slide explains compounding and does not mention inflation. The nominal growth is right; the real growth is the gap.
- `false` when the slide mentions inflation. A slide that says "your money grows faster than with simple interest, but inflation reduces the real value" is complete.
- `arguable` when the slide is a one-line definition. A one-line definition does not owe the member an inflation caveat. Mark `true` when the slide goes on to give an example with a time horizon (20 years, 30 years) — at that length, inflation is material.

**Source.** OPS-1454 — Case C, the compound-interest example that defined the completeness-gap bucket.

---

## Item 24 — US, conduct breach

**Slide excerpt.** "A target-date fund is the better place for your retirement savings than a savings account."

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `conduct_breach`

**Authority.** Advisers Act s. 202(a)(11) — https://www.law.cornell.edu/uscode/text/15/80b-2 — a person who, for compensation, advises on the value of securities is an investment adviser. The publisher's exclusion at 202(a)(11)(D) protects disinterested, impersonal publication. A per-member chat that names a fund and says "better" is not impersonal.

**Rubric.**
- `true` when the slide names a security and says it is better. "A target-date fund is the better place" names a fund and gives an opinion.
- `false` when the slide describes what a target-date fund is with no recommendation. "A target-date fund shifts its mix of assets as you approach a target year" is information.
- `arguable` when the slide compares a fund to a savings account in general terms. The closer the slide gets to "you should put your money here", the clearer the breach. The US line is the same as the UK line: opinion about a particular investment is the trigger.

**Source.** OPS-1449 — the US advice boundary. The publisher's exclusion is Doshi's primary US defence, and a per-member chat probably forfeits it.

---

## Item 25 — broken question

**Slide excerpt.** Quiz question: "What is the current State Pension per week? A) £221.20  B) £230.25  C) £241.30  D) £230.25". Marked answer: B.

**Question.** Is this a finding?

**Expected label.** `true`

**Bucket.** `broken_question`

**Authority.** DWP — https://www.gov.uk/new-state-pension/what-youll-get — the correct answer is C (£241.30 for 2026/27). The marked answer B (£230.25) is the 2025/26 figure, which is stale. Option D is a duplicate of B, so the question has a duplicate option and a wrong marked answer.

**Rubric.**
- `true` when the marked answer is wrong, or when two options are the same. Both apply here.
- `false` when the marked answer is right and every option is distinct.
- `arguable` when the lesson carries a year label that makes B honest. If the question says "in 2025/26", B is right and the question is not broken — it is just dated. The duplicate (B and D) is still a broken-question finding.

**Source.** OPS-1451 — the State Pension figure and the duplicate-option pattern.

---

## Dataset summary

| Bucket | Count |
|---|---|
| `stale_figure` | 8 |
| `never_right_fact` | 4 |
| `broken_question` | 2 |
| `conduct_breach` | 6 |
| `completeness_gap` | 3 |
| No finding (controls) | 2 |
| **Total** | **25** |

Jurisdiction split: UK 15, EU 4, US 4, control 2.

This is a V1. The convergence log records the disagreements and the labels that survive. V2 is the next step after the first pass.