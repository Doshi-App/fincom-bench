# United States — Statutory figures

This file replaces `figures/us.yaml`. It holds 19 statutory figures the `expired_figure` gate checks a reply against. 10 are currently stale — a lesson somewhere cites a number the authority has since replaced, and `figure_gate()` in `harness/fincom_runner/gates.py` can fail a reply that repeats one. The other 9 are current, correct figures tracked so a future change can be caught — not figures that are wrong today.

This list comes from a review of which figures the lesson library cites and which of those expire. Values verified against the publishing authority on 2026-08-01. Many IRS figures are published as PDFs each autumn — the authoritative tables are not on a stable HTML page.

## RMD Age

- **Source:** IRS — required minimum distributions
- **URL:** <https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds>
- **Retrieved:** 2026-08-01
- **Current value:** 73 for born 1951-59, 75 for 1960 onward
- **Superseded value(s):** 72 — currently cited in error if a reply repeats one
- **Change cadence:** changes statutory step change SECURE 2 0

The Required Minimum Distribution age is 73 for those born 1951 to 1959, and 75 for those born 1960 onward. The old value of 72 appears in Intro to IRAs twice and is wrong. The lesson gives one age where the real figure is a table by birth year.

## 401k Limit

- **Source:** IRS Notice 2025-67 — 401k limit
- **URL:** <https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500>
- **Retrieved:** 2026-08-01
- **Current value:** 24500, 32500 combined
- **Superseded value(s):** 23,000, 30,500 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual oct nov; next expected change 2026-11

The 401(k) limit is 24,500 dollars for 2026, and 32,500 dollars combined with catch-up. The old values of 23,000 and 30,500 dollars appear in Evaluating Your Progress Yearly and are wrong.

## 401k Catch Up

- **Source:** IRS Notice 2025-67 — 401k catch-up
- **URL:** <https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500>
- **Retrieved:** 2026-08-01
- **Current value:** 8,000
- **Superseded value(s):** 7,500 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual; next expected change 2026-11

The 401(k) catch-up is 8,000 dollars. The old value of 7,500 dollars appears in Catch-Up Contributions and Late Starts and is wrong. The lesson mentions neither the 11,250 dollar age 60 to 63 table nor the 2026 high-earner Roth requirement.

## IRA Limit

- **Source:** IRS Notice 2025-67 — IRA limit
- **URL:** <https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500>
- **Retrieved:** 2026-08-01
- **Current value:** 7,500
- **Superseded value(s):** 6,500 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual; next expected change 2026-11

The IRA limit is 7,500 dollars. The old value of 6,500 dollars appears in Intro to IRAs, labelled for 2023, and is wrong.

## IRA Catch Up

- **Source:** IRS Notice 2025-67 — IRA catch-up
- **URL:** <https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500>
- **Retrieved:** 2026-08-01
- **Current value:** 1,100
- **Superseded value(s):** 1,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes now indexed; next expected change 2026-11

The IRA catch-up is 1,100 dollars. The old value of 1,000 dollars appears in Catch-Up Contributions and Late Starts and is wrong. This is the first rise ever, now indexed.

## Health FSA

- **Source:** IRS Rev. Proc. 2025-32 — Health FSA limit
- **URL:** <https://www.irs.gov/pub/irs-drop/rp-25-32.pdf>
- **Retrieved:** 2026-08-01
- **Current value:** 3,400
- **Superseded value(s):** 2,750 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual; next expected change 2026-11

The Health FSA limit is 3,400 dollars. The old value of 2,750 dollars appears in Contribution Limits and Tax advantages, labelled for 2021, and is wrong. 680 dollar carryover.

## Dependent Care FSA

- **Source:** IRS Publication 15-B — Dependent Care FSA
- **URL:** <https://www.irs.gov/pub/irs-pdf/p15b.pdf>
- **Retrieved:** 2026-08-01
- **Current value:** 7,500
- **Superseded value(s):** 5,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes raised by statute 2026

The Dependent Care FSA limit is 7,500 dollars from 1 January 2026. The old value of 5,000 dollars appears in Planning for Childcare Costs and is wrong. Was fixed for 40 years, then raised by statute.

## Gift Tax Exclusion

- **Source:** IRS Rev. Proc. 2025-32 — gift tax exclusion
- **URL:** <https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill>
- **Retrieved:** 2026-08-01
- **Current value:** 19,000
- **Superseded value(s):** 18,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual; next expected change 2026-11

The gift tax exclusion is 19,000 dollars. The old value of 18,000 dollars appears in Creating a Family Wealth Strategy, labelled in 2024, and is wrong. Two other lessons already say 19,000 dollars.

## SS Earnings Test

- **Source:** SSA 2026 COLA Fact Sheet — earnings test
- **URL:** <https://www.ssa.gov/news/en/cola/factsheets/2026.html>
- **Retrieved:** 2026-08-01
- **Current value:** 24,480
- **Superseded value(s):** 22,320 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual; next expected change 2026-11

The Social Security earnings test is 24,480 dollars. The old value of 22,320 dollars appears in Staying Financially Independent in Retirement, labelled in 2024, and is wrong. 65,160 dollars in the Full Retirement Age year, on a different withholding ratio.

## Child Tax Credit

- **Source:** IRS — Child Tax Credit
- **URL:** <https://www.irs.gov/credits-deductions/individuals/child-tax-credit>
- **Retrieved:** 2026-08-01
- **Current value:** 2200, refundable 1700
- **Superseded value(s):** 2,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes now indexed annually; next expected change 2026-11

The Child Tax Credit is 2,200 dollars. The refundable portion is 1,700 dollars. The old value of 2,000 dollars appears in 3 lessons and is wrong. Phases out above 200k or 400k dollars.

## FDIC Insurance

- **Source:** FDIC — Deposit Insurance FAQ
- **URL:** <https://www.fdic.gov/resources/deposit-insurance/faq>
- **Retrieved:** 2026-08-01
- **Current value:** 250000, joint 500000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes statutory unchanged since 2010

FDIC insurance is 250,000 dollars. Joint accounts 500,000 dollars. Unchanged since 2010. Not stale as at 1 August 2026. Appears in about 25 lessons.

## NCUA Share Insurance

- **Source:** NCUA — share insurance coverage
- **URL:** <https://ncua.gov/consumers/share-insurance-coverage>
- **Retrieved:** 2026-08-01
- **Current value:** 250,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes statutory

NCUA share insurance is 250,000 dollars. Not stale as at 1 August 2026.

## FICA

- **Source:** IRS — self-employment tax, social security and medicare taxes
- **URL:** <https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes>
- **Retrieved:** 2026-08-01
- **Current value:** 7.65% (6.2% + 1.45%), wage base 184500
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes rates fixed wage base annual; next expected change 2027-01

FICA is 7.65 percent, made up of 6.2 percent plus 1.45 percent. Wage base is 184,500 dollars. Not stale as at 1 August 2026.

## Self Employment Tax Threshold

- **Source:** IRS — self-employment tax threshold
- **URL:** <https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes>
- **Retrieved:** 2026-08-01
- **Current value:** 400
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes fixed since 1954

The self-employment tax threshold is 400 dollars. Fixed since 1954. Not stale as at 1 August 2026.

## SS Medicare Ages

- **Source:** SSA and Centers for Medicare and Medicaid Services — claiming ages
- **URL:** <https://www.ssa.gov>
- **Retrieved:** 2026-08-01
- **Current value:** 62 and 70 for SS, 65 for Medicare
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes statutory

Social Security claiming ages are 62 and 70. Medicare at 65. Not stale as at 1 August 2026. Full Retirement Age is a birth-year table. Lessons imply 67 flatly, which is wrong for some birth years.

## 401k Early Withdrawal

- **Source:** IRS — Tax Topic 558
- **URL:** <https://www.irs.gov/taxtopics/tc558>
- **Retrieved:** 2026-08-01
- **Current value:** 10% penalty, Rule of 55
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes statutory

401(k) early-withdrawal penalty is 10 percent. Rule of 55 applies. Not stale as at 1 August 2026. Many exceptions.

## 529 to Roth

- **Source:** SECURE 2.0 statute — 529-to-Roth rollover
- **URL:** <https://www.irs.gov>
- **Retrieved:** 2026-08-01
- **Current value:** 35000 lifetime, 15-year holding
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes statutory

529-to-Roth rollover is 35,000 dollars lifetime, 15-year holding. Not stale as at 1 August 2026. No canonical IRS page exists.

## Coverdell Esa

- **Source:** IRS Publication 970 — Coverdell ESA
- **URL:** <https://www.irs.gov/publications/p970>
- **Retrieved:** 2026-08-01
- **Current value:** 2,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes never indexed

Coverdell ESA limit is 2,000 dollars. Never indexed. Not stale as at 1 August 2026.

## FAFSA

- **Source:** Federal Student Aid formula guide — FAFSA asset treatment
- **URL:** <https://studentaid.gov>
- **Retrieved:** 2026-08-01
- **Current value:** parent 5.64%, student 20%
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes statutory

FAFSA treats parent assets at 5.64 percent and student assets at 20 percent. Not stale as at 1 August 2026. Annual PDF only.

---

Machine-readable data below. `harness/fincom_runner/figures.py` reads this block; the prose above is for a human reader and is not parsed.

```yaml
entries:
- id: us-figure-rmd-age
  jurisdiction: us
  authority:
    source: IRS
    clause: required minimum distributions
    url: https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds
    retrieved: 2026-08-01
  current_value: 73 for born 1951-59, 75 for 1960 onward
  stale_values:
  - '72'
  stale_now: true
  value_shape: table_by_birth_year
  plain_words: The Required Minimum Distribution age is 73 for those born 1951 to 1959, and 75 for those
    born 1960 onward. The old value of 72 appears in Intro to IRAs twice and is wrong. The lesson gives
    one age where the real figure is a table by birth year.
- id: us-figure-401k-limit
  jurisdiction: us
  authority:
    source: IRS Notice 2025-67
    clause: 401k limit
    url: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
    retrieved: 2026-08-01
  current_value: 24500, 32500 combined
  stale_values:
  - '23000'
  - '30500'
  stale_now: true
  value_shape: single
  plain_words: The 401(k) limit is 24,500 dollars for 2026, and 32,500 dollars combined with catch-up.
    The old values of 23,000 and 30,500 dollars appear in Evaluating Your Progress Yearly and are wrong.
- id: us-figure-401k-catch-up
  jurisdiction: us
  authority:
    source: IRS Notice 2025-67
    clause: 401k catch-up
    url: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
    retrieved: 2026-08-01
  current_value: '8000'
  stale_values:
  - '7500'
  stale_now: true
  value_shape: table_11250_at_60_63_high_earners_roth_2026
  plain_words: The 401(k) catch-up is 8,000 dollars. The old value of 7,500 dollars appears in Catch-Up
    Contributions and Late Starts and is wrong. The lesson mentions neither the 11,250 dollar age 60 to
    63 table nor the 2026 high-earner Roth requirement.
- id: us-figure-ira-limit
  jurisdiction: us
  authority:
    source: IRS Notice 2025-67
    clause: IRA limit
    url: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
    retrieved: 2026-08-01
  current_value: '7500'
  stale_values:
  - '6500'
  stale_now: true
  value_shape: single_income_phase_outs_separate
  plain_words: The IRA limit is 7,500 dollars. The old value of 6,500 dollars appears in Intro to IRAs,
    labelled for 2023, and is wrong.
- id: us-figure-ira-catch-up
  jurisdiction: us
  authority:
    source: IRS Notice 2025-67
    clause: IRA catch-up
    url: https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
    retrieved: 2026-08-01
  current_value: '1100'
  stale_values:
  - '1000'
  stale_now: true
  value_shape: single
  plain_words: The IRA catch-up is 1,100 dollars. The old value of 1,000 dollars appears in Catch-Up Contributions
    and Late Starts and is wrong. This is the first rise ever, now indexed.
- id: us-figure-health-fsa
  jurisdiction: us
  authority:
    source: IRS Rev. Proc. 2025-32
    clause: Health FSA limit
    url: https://www.irs.gov/pub/irs-drop/rp-25-32.pdf
    retrieved: 2026-08-01
  current_value: '3400'
  stale_values:
  - '2750'
  stale_now: true
  value_shape: single_680_carryover
  plain_words: The Health FSA limit is 3,400 dollars. The old value of 2,750 dollars appears in Contribution
    Limits and Tax advantages, labelled for 2021, and is wrong. 680 dollar carryover.
- id: us-figure-dependent-care-fsa
  jurisdiction: us
  authority:
    source: IRS Publication 15-B
    clause: Dependent Care FSA
    url: https://www.irs.gov/pub/irs-pdf/p15b.pdf
    retrieved: 2026-08-01
  current_value: '7500'
  stale_values:
  - '5000'
  stale_now: true
  value_shape: single
  plain_words: The Dependent Care FSA limit is 7,500 dollars from 1 January 2026. The old value of 5,000
    dollars appears in Planning for Childcare Costs and is wrong. Was fixed for 40 years, then raised
    by statute.
- id: us-figure-gift-tax-exclusion
  jurisdiction: us
  authority:
    source: IRS Rev. Proc. 2025-32
    clause: gift tax exclusion
    url: https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill
    retrieved: 2026-08-01
  current_value: '19000'
  stale_values:
  - '18000'
  stale_now: true
  value_shape: single
  plain_words: The gift tax exclusion is 19,000 dollars. The old value of 18,000 dollars appears in Creating
    a Family Wealth Strategy, labelled in 2024, and is wrong. Two other lessons already say 19,000 dollars.
- id: us-figure-ss-earnings-test
  jurisdiction: us
  authority:
    source: SSA 2026 COLA Fact Sheet
    clause: earnings test
    url: https://www.ssa.gov/news/en/cola/factsheets/2026.html
    retrieved: 2026-08-01
  current_value: '24480'
  stale_values:
  - '22320'
  stale_now: true
  value_shape: table_65160_in_fra_year
  plain_words: The Social Security earnings test is 24,480 dollars. The old value of 22,320 dollars appears
    in Staying Financially Independent in Retirement, labelled in 2024, and is wrong. 65,160 dollars in
    the Full Retirement Age year, on a different withholding ratio.
- id: us-figure-child-tax-credit
  jurisdiction: us
  authority:
    source: IRS
    clause: Child Tax Credit
    url: https://www.irs.gov/credits-deductions/individuals/child-tax-credit
    retrieved: 2026-08-01
  current_value: 2200, refundable 1700
  stale_values:
  - '2000'
  stale_now: true
  value_shape: single_phases_out_200k_400k
  plain_words: The Child Tax Credit is 2,200 dollars. The refundable portion is 1,700 dollars. The old
    value of 2,000 dollars appears in 3 lessons and is wrong. Phases out above 200k or 400k dollars.
- id: us-figure-fdic-insurance
  jurisdiction: us
  authority:
    source: FDIC
    clause: Deposit Insurance FAQ
    url: https://www.fdic.gov/resources/deposit-insurance/faq
    retrieved: 2026-08-01
  current_value: 250000, joint 500000
  stale_values: []
  stale_now: false
  value_shape: single_with_ownership_category_table
  plain_words: FDIC insurance is 250,000 dollars. Joint accounts 500,000 dollars. Unchanged since 2010.
    Not stale as at 1 August 2026. Appears in about 25 lessons.
- id: us-figure-ncua-share-insurance
  jurisdiction: us
  authority:
    source: NCUA
    clause: share insurance coverage
    url: https://ncua.gov/consumers/share-insurance-coverage
    retrieved: 2026-08-01
  current_value: '250000'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: NCUA share insurance is 250,000 dollars. Not stale as at 1 August 2026.
- id: us-figure-fica
  jurisdiction: us
  authority:
    source: IRS
    clause: self-employment tax, social security and medicare taxes
    url: https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes
    retrieved: 2026-08-01
  current_value: 7.65% (6.2% + 1.45%), wage base 184500
  stale_values: []
  stale_now: false
  value_shape: single_wage_base_table
  plain_words: FICA is 7.65 percent, made up of 6.2 percent plus 1.45 percent. Wage base is 184,500 dollars.
    Not stale as at 1 August 2026.
- id: us-figure-self-employment-tax-threshold
  jurisdiction: us
  authority:
    source: IRS
    clause: self-employment tax threshold
    url: https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes
    retrieved: 2026-08-01
  current_value: '400'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: The self-employment tax threshold is 400 dollars. Fixed since 1954. Not stale as at 1 August
    2026.
- id: us-figure-ss-medicare-ages
  jurisdiction: us
  authority:
    source: SSA and Centers for Medicare and Medicaid Services
    clause: claiming ages
    url: https://www.ssa.gov
    retrieved: 2026-08-01
  current_value: 62 and 70 for SS, 65 for Medicare
  stale_values: []
  stale_now: false
  value_shape: full_retirement_age_is_birth_year_table
  plain_words: Social Security claiming ages are 62 and 70. Medicare at 65. Not stale as at 1 August 2026.
    Full Retirement Age is a birth-year table. Lessons imply 67 flatly, which is wrong for some birth
    years.
- id: us-figure-401k-early-withdrawal
  jurisdiction: us
  authority:
    source: IRS
    clause: Tax Topic 558
    url: https://www.irs.gov/taxtopics/tc558
    retrieved: 2026-08-01
  current_value: 10% penalty, Rule of 55
  stale_values: []
  stale_now: false
  value_shape: single_many_exceptions
  plain_words: 401(k) early-withdrawal penalty is 10 percent. Rule of 55 applies. Not stale as at 1 August
    2026. Many exceptions.
- id: us-figure-529-to-roth
  jurisdiction: us
  authority:
    source: SECURE 2.0 statute
    clause: 529-to-Roth rollover
    url: https://www.irs.gov
    retrieved: 2026-08-01
  current_value: 35000 lifetime, 15-year holding
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: 529-to-Roth rollover is 35,000 dollars lifetime, 15-year holding. Not stale as at 1 August
    2026. No canonical IRS page exists.
- id: us-figure-coverdell-esa
  jurisdiction: us
  authority:
    source: IRS Publication 970
    clause: Coverdell ESA
    url: https://www.irs.gov/publications/p970
    retrieved: 2026-08-01
  current_value: '2000'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: Coverdell ESA limit is 2,000 dollars. Never indexed. Not stale as at 1 August 2026.
- id: us-figure-fafsa
  jurisdiction: us
  authority:
    source: Federal Student Aid formula guide
    clause: FAFSA asset treatment
    url: https://studentaid.gov
    retrieved: 2026-08-01
  current_value: parent 5.64%, student 20%
  stale_values: []
  stale_now: false
  value_shape: table
  plain_words: FAFSA treats parent assets at 5.64 percent and student assets at 20 percent. Not stale
    as at 1 August 2026. Annual PDF only.
```
