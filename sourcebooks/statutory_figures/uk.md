# United Kingdom — Statutory figures

This file replaces `figures/uk.yaml`. It holds 26 statutory figures the `expired_figure` gate checks a reply against. 9 are currently stale — a lesson somewhere cites a number the authority has since replaced, and `figure_gate()` in `harness/fincom_runner/gates.py` can fail a reply that repeats one. The other 17 are current, correct figures tracked so a future change can be caught — not figures that are wrong today.

This list comes from a review of which figures the lesson library cites and which of those expire. Values verified against the publishing authority on 2026-08-01.

## Deposit Protection

- **Source:** FSCS — deposit limit protection increase
- **URL:** <https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/>
- **Retrieved:** 2026-08-01
- **Current value:** 120,000
- **Superseded value(s):** 85,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes irregular

The deposit protection limit is 120,000 pounds from 1 December 2025. The old value of 85,000 pounds appears in 8 lessons and is wrong. One lesson, Protect Your Hard-Earned Cash, already says 120,000 pounds, so the library contradicts itself.

## Pension Annual Allowance

- **Source:** HMRC — tax on your private pension, annual allowance
- **URL:** <https://www.gov.uk/tax-on-your-private-pension/annual-allowance>
- **Retrieved:** 2026-08-01
- **Current value:** 60,000
- **Superseded value(s):** 40,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes at budget

The pension annual allowance is 60,000 pounds since April 2023. The old value of 40,000 pounds appears in Making lump sum pension contributions and is wrong. The lesson states one number where the real figure tapers to 10,000 pounds for high earners.

## Lifetime Allowance

- **Source:** HMRC — abolition of the Lifetime Allowance
- **URL:** <https://www.gov.uk/government/publications/abolition-of-the-lifetime-allowance-from-6-april-2024/abolition-of-the-lifetime-allowance-lta>
- **Retrieved:** 2026-08-01
- **Current value:** abolished 6 April 2024, replaced by 268275 lump sum allowance
- **Superseded value(s):** 1,073,100 — currently cited in error if a reply repeats one
- **Change cadence:** changes one off

The Lifetime Allowance was abolished on 6 April 2024. It was replaced by a 268,275 pound lump sum allowance. The old value of 1,073,100 pounds appears in Making lump sum pension contributions and is wrong.

## NI Employee Rate

- **Source:** HMRC — National Insurance rates and categories
- **URL:** <https://www.gov.uk/national-insurance-rates-letters>
- **Retrieved:** 2026-08-01
- **Current value:** 8%
- **Superseded value(s):** 12% — currently cited in error if a reply repeats one
- **Change cadence:** changes at budget

The National Insurance employee rate is 8 percent. The old value of 12 percent appears in Salary sacrifice vs take-home myths. The lesson's worked example is arithmetically wrong as a result.

## NI Weekly Threshold

- **Source:** HMRC — National Insurance rates and categories
- **URL:** <https://www.gov.uk/national-insurance-rates-letters>
- **Retrieved:** 2026-08-01
- **Current value:** 242
- **Superseded value(s):** 190 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual 6 april; next expected change 2027-04-06

The National Insurance weekly threshold is 242 pounds. The old value of 190 pounds appears in National Insurance Contributions and is wrong.

## New State Pension

- **Source:** DWP — the new State Pension
- **URL:** <https://www.gov.uk/new-state-pension/what-youll-get>
- **Retrieved:** 2026-08-01
- **Current value:** 241.30
- **Superseded value(s):** 221.20, 230.25 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual april triple lock; next expected change 2027-04

The new State Pension is 241.30 pounds per week. The old values of 221.20 pounds and 230.25 pounds appear in State Pension and Understanding Government Retirement Benefits. The actual amount depends on the member's National Insurance record.

## Higher Rate Band

- **Source:** HMRC — Income Tax rates
- **URL:** <https://www.gov.uk/income-tax-rates>
- **Retrieved:** 2026-08-01
- **Current value:** upper end 125140
- **Superseded value(s):** 150,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes at budget

The higher-rate 40 percent band runs to 125,140 pounds since April 2023. The old value of 150,000 pounds appears in Income Tax. Scotland differs and the lesson does not say so.

## Child Benefit

- **Source:** HMRC — Child Benefit rates
- **URL:** <https://www.gov.uk/child-benefit-rates>
- **Retrieved:** 2026-08-01
- **Current value:** 27.05 eldest, 17.90 additional
- **Superseded value(s):** 26.05, 17.25 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual april; next expected change 2027-04

Child Benefit is 27.05 pounds for the eldest child and 17.90 pounds for each additional child. The old values of 26.05 and 17.25 pounds appear in 4 lessons and are wrong.

## High Income Child Benefit Charge

- **Source:** HMRC — Child Benefit tax charge
- **URL:** <https://www.gov.uk/child-benefit-tax-charge>
- **Retrieved:** 2026-08-01
- **Current value:** 60,000
- **Superseded value(s):** 50,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes at budget

The High Income Child Benefit Charge starts at 60,000 pounds since April 2024. The old value of 50,000 pounds appears in How Much Does It Really Cost to Have a Baby? and is wrong. The charge tapers to 80,000 pounds.

## ISA Subscription Limit

- **Source:** HMRC — individual savings accounts
- **URL:** <https://www.gov.uk/individual-savings-accounts>
- **Retrieved:** 2026-08-01
- **Current value:** 20,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

The ISA subscription limit is 20,000 pounds. Not stale as at 1 August 2026. Appears in 20 or more lessons.

## Lifetime ISA

- **Source:** HMRC — lifetime ISA
- **URL:** <https://www.gov.uk/lifetime-isa>
- **Retrieved:** 2026-08-01
- **Current value:** 4000 cap, 25% bonus, 1000 max, 450000 property cap, ages 18-39, stops at 50
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

The Lifetime ISA rules: 4,000 pound cap, 25 percent bonus, 1,000 pound maximum bonus, 450,000 pound property cap, ages 18 to 39, stops at 50. Not stale as at 1 August 2026.

## Junior ISA

- **Source:** HMRC — junior individual savings accounts
- **URL:** <https://www.gov.uk/junior-individual-savings-accounts>
- **Retrieved:** 2026-08-01
- **Current value:** 9,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

The Junior ISA limit is 9,000 pounds. The value is not stale. The year labels are stale: different lessons label it 2024/25 and 2025/26.

## Personal Allowance

- **Source:** HMRC — Income Tax rates
- **URL:** <https://www.gov.uk/income-tax-rates>
- **Retrieved:** 2026-08-01
- **Current value:** 12,570
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget frozen to 2031; next expected change 2031-04

The Personal Allowance is 12,570 pounds. The value is not stale. The year labels are stale: different lessons label it 2022/23 and 2024/25. The allowance is frozen to 2031.

## CGT Annual Exempt

- **Source:** HMRC — capital gains tax, allowances
- **URL:** <https://www.gov.uk/capital-gains-tax/allowances>
- **Retrieved:** 2026-08-01
- **Current value:** 3,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

The Capital Gains Tax annual exempt amount is 3,000 pounds. Not stale as at 1 August 2026. 1,500 pounds for trusts.

## Inheritance Tax

- **Source:** HMRC — inheritance tax
- **URL:** <https://www.gov.uk/inheritance-tax>
- **Retrieved:** 2026-08-01
- **Current value:** 325000 nil-rate band, 650000 couple, 175000 residence, 40% rate
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes frozen to 2030; next expected change 2030-04

Inheritance Tax: 325,000 pound nil-rate band, 650,000 pounds a couple, 175,000 pound residence nil-rate band, 40 percent rate. Frozen to April 2030. Not stale as at 1 August 2026.

## IHT Gift Exemption

- **Source:** HMRC — inheritance tax, gifts
- **URL:** <https://www.gov.uk/inheritance-tax/gifts>
- **Retrieved:** 2026-08-01
- **Current value:** 3,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

The Inheritance Tax annual gift exemption is 3,000 pounds and carries forward one year. The value is not stale. The year label is stale: one lesson labels it 2023/24.

## Adult Social Care

- **Source:** Department of Health and Social Care — social care charging circular
- **URL:** <https://www.gov.uk/government/publications/social-care-charging-for-local-authorities-2025-to-2026/social-care-charging-for-care-and-support-2025-to-2026-local-authority-circular>
- **Retrieved:** 2026-08-01
- **Current value:** 23,250
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes reviewed annually frozen since 2010

The adult social care upper capital limit is 23,250 pounds. England only. The lesson says the council's, implying UK-wide, which is wrong. Frozen since 2010. Not stale as at 1 August 2026.

## App Fraud Cap

- **Source:** Payment Systems Regulator — APP fraud reimbursement
- **URL:** <https://www.psr.org.uk/information-for-consumers/app-fraud-reimbursement-protections/>
- **Retrieved:** 2026-08-01
- **Current value:** 85,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes irregular

The Authorised Push Payment fraud reimbursement cap is 85,000 pounds. Not stale as at 1 August 2026.

## Student Loan

- **Source:** HMRC and Student Loans Company — repaying your student loan
- **URL:** <https://www.gov.uk/repaying-your-student-loan/what-you-pay>
- **Retrieved:** 2026-08-01
- **Current value:** 9% undergraduate, 6% postgraduate
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes annual april; next expected change 2027-04

Student loan repayment is 9 percent undergraduate and 6 percent postgraduate. Not stale as at 1 August 2026. The lessons never state the five plan thresholds, which range from 21,000 to 33,795 pounds.

## Marriage Allowance

- **Source:** HMRC — marriage allowance
- **URL:** <https://www.gov.uk/marriage-allowance>
- **Retrieved:** 2026-08-01
- **Current value:** 1260 transferable, worth 252
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

Marriage Allowance is 1,260 pounds transferable, worth 252 pounds. Not stale as at 1 August 2026.

## Pension Credit

- **Source:** DWP — pension credit, eligibility
- **URL:** <https://www.gov.uk/pension-credit/eligibility>
- **Retrieved:** 2026-08-01
- **Current value:** ignores first 10000 of savings
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes irregular

Pension Credit ignores the first 10,000 pounds of savings. Not stale as at 1 August 2026. Then 1 pound per week per 500 pounds above.

## State Pension Deferral

- **Source:** DWP — deferring state pension
- **URL:** <https://www.gov.uk/deferring-state-pension>
- **Retrieved:** 2026-08-01
- **Current value:** about 5.8% a year
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes irregular

State Pension deferral raises payments by about 5.8 percent a year. Derived from the published 1 percent per 9 weeks rule. Not stale as at 1 August 2026.

## SDLT Non Resident Surcharge

- **Source:** HMRC — rates of Stamp Duty Land Tax for non-UK residents
- **URL:** <https://www.gov.uk/guidance/rates-of-stamp-duty-land-tax-for-non-uk-residents>
- **Retrieved:** 2026-08-01
- **Current value:** 2% non-resident surcharge
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

The Stamp Duty Land Tax non-resident surcharge is 2 percent. Not stale as at 1 August 2026. Surcharge on a band table.

## Universal Credit Childcare

- **Source:** DWP — help with childcare costs, universal credit
- **URL:** <https://www.gov.uk/help-with-childcare-costs/universal-credit>
- **Retrieved:** 2026-08-01
- **Current value:** 85% of childcare costs
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

Universal Credit covers up to 85 percent of childcare costs. Not stale as at 1 August 2026. With monthly caps.

## Auto Enrolment

- **Source:** The Pensions Regulator / DWP — workplace pensions, what you pay
- **URL:** <https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay>
- **Retrieved:** 2026-08-01
- **Current value:** 8% total, 3% employer minimum
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes percentages 2019 earnings band annual; next expected change 2027-04

Auto-enrolment is 8 percent total, 3 percent employer minimum. Not stale as at 1 August 2026. Correctly worded as a minimum, which is the exact fix the Australian example needs. Qualifying earnings 6,240 to 50,270 pounds.

## Personal Savings Dividend Allowance

- **Source:** HMRC — apply tax-free interest on savings
- **URL:** <https://www.gov.uk/apply-tax-free-interest-on-savings>
- **Retrieved:** 2026-08-01
- **Current value:** 1000 or 500 Personal Savings, 500 Dividend
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes at budget

Personal Savings Allowance is 1,000 or 500 pounds. Dividend Allowance is 500 pounds. Not stale as at 1 August 2026. Table by tax band.

---

Machine-readable data below. `harness/fincom_runner/figures.py` reads this block; the prose above is for a human reader and is not parsed.

```yaml
entries:
- id: uk-figure-deposit-protection
  jurisdiction: uk
  authority:
    source: FSCS
    clause: deposit limit protection increase
    url: https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/
    retrieved: 2026-08-01
  current_value: '120000'
  stale_values:
  - '85000'
  stale_now: true
  value_shape: single_with_temporary_high_balances
  plain_words: The deposit protection limit is 120,000 pounds from 1 December 2025. The old value of 85,000
    pounds appears in 8 lessons and is wrong. One lesson, Protect Your Hard-Earned Cash, already says
    120,000 pounds, so the library contradicts itself.
- id: uk-figure-pension-annual-allowance
  jurisdiction: uk
  authority:
    source: HMRC
    clause: tax on your private pension, annual allowance
    url: https://www.gov.uk/tax-on-your-private-pension/annual-allowance
    retrieved: 2026-08-01
  current_value: '60000'
  stale_values:
  - '40000'
  stale_now: true
  value_shape: table_tapers_to_10000
  plain_words: The pension annual allowance is 60,000 pounds since April 2023. The old value of 40,000
    pounds appears in Making lump sum pension contributions and is wrong. The lesson states one number
    where the real figure tapers to 10,000 pounds for high earners.
- id: uk-figure-lifetime-allowance
  jurisdiction: uk
  authority:
    source: HMRC
    clause: abolition of the Lifetime Allowance
    url: https://www.gov.uk/government/publications/abolition-of-the-lifetime-allowance-from-6-april-2024/abolition-of-the-lifetime-allowance-lta
    retrieved: 2026-08-01
  current_value: abolished 6 April 2024, replaced by 268275 lump sum allowance
  stale_values:
  - '1073100'
  stale_now: true
  value_shape: single
  plain_words: The Lifetime Allowance was abolished on 6 April 2024. It was replaced by a 268,275 pound
    lump sum allowance. The old value of 1,073,100 pounds appears in Making lump sum pension contributions
    and is wrong.
- id: uk-figure-ni-employee-rate
  jurisdiction: uk
  authority:
    source: HMRC
    clause: National Insurance rates and categories
    url: https://www.gov.uk/national-insurance-rates-letters
    retrieved: 2026-08-01
  current_value: 8%
  stale_values:
  - 12%
  stale_now: true
  value_shape: table_by_earnings_band
  plain_words: The National Insurance employee rate is 8 percent. The old value of 12 percent appears
    in Salary sacrifice vs take-home myths. The lesson's worked example is arithmetically wrong as a result.
- id: uk-figure-ni-weekly-threshold
  jurisdiction: uk
  authority:
    source: HMRC
    clause: National Insurance rates and categories
    url: https://www.gov.uk/national-insurance-rates-letters
    retrieved: 2026-08-01
  current_value: '242'
  stale_values:
  - '190'
  stale_now: true
  value_shape: table
  plain_words: The National Insurance weekly threshold is 242 pounds. The old value of 190 pounds appears
    in National Insurance Contributions and is wrong.
- id: uk-figure-new-state-pension
  jurisdiction: uk
  authority:
    source: DWP
    clause: the new State Pension
    url: https://www.gov.uk/new-state-pension/what-youll-get
    retrieved: 2026-08-01
  current_value: '241.30'
  stale_values:
  - '221.20'
  - '230.25'
  stale_now: true
  value_shape: table_depends_on_NI_record
  plain_words: The new State Pension is 241.30 pounds per week. The old values of 221.20 pounds and 230.25
    pounds appear in State Pension and Understanding Government Retirement Benefits. The actual amount
    depends on the member's National Insurance record.
- id: uk-figure-higher-rate-band
  jurisdiction: uk
  authority:
    source: HMRC
    clause: Income Tax rates
    url: https://www.gov.uk/income-tax-rates
    retrieved: 2026-08-01
  current_value: upper end 125140
  stale_values:
  - '150000'
  stale_now: true
  value_shape: table_scotland_differs
  plain_words: The higher-rate 40 percent band runs to 125,140 pounds since April 2023. The old value
    of 150,000 pounds appears in Income Tax. Scotland differs and the lesson does not say so.
- id: uk-figure-child-benefit
  jurisdiction: uk
  authority:
    source: HMRC
    clause: Child Benefit rates
    url: https://www.gov.uk/child-benefit-rates
    retrieved: 2026-08-01
  current_value: 27.05 eldest, 17.90 additional
  stale_values:
  - '26.05'
  - '17.25'
  stale_now: true
  value_shape: two_values
  plain_words: Child Benefit is 27.05 pounds for the eldest child and 17.90 pounds for each additional
    child. The old values of 26.05 and 17.25 pounds appear in 4 lessons and are wrong.
- id: uk-figure-high-income-child-benefit-charge
  jurisdiction: uk
  authority:
    source: HMRC
    clause: Child Benefit tax charge
    url: https://www.gov.uk/child-benefit-tax-charge
    retrieved: 2026-08-01
  current_value: '60000'
  stale_values:
  - '50000'
  stale_now: true
  value_shape: taper_table_to_80000
  plain_words: The High Income Child Benefit Charge starts at 60,000 pounds since April 2024. The old
    value of 50,000 pounds appears in How Much Does It Really Cost to Have a Baby? and is wrong. The charge
    tapers to 80,000 pounds.
- id: uk-figure-isa-subscription-limit
  jurisdiction: uk
  authority:
    source: HMRC
    clause: individual savings accounts
    url: https://www.gov.uk/individual-savings-accounts
    retrieved: 2026-08-01
  current_value: '20000'
  stale_values: []
  stale_now: false
  value_shape: single_with_sub_limits
  plain_words: The ISA subscription limit is 20,000 pounds. Not stale as at 1 August 2026. Appears in
    20 or more lessons.
- id: uk-figure-lifetime-isa
  jurisdiction: uk
  authority:
    source: HMRC
    clause: lifetime ISA
    url: https://www.gov.uk/lifetime-isa
    retrieved: 2026-08-01
  current_value: 4000 cap, 25% bonus, 1000 max, 450000 property cap, ages 18-39, stops at 50
  stale_values: []
  stale_now: false
  value_shape: set_of_values
  plain_words: 'The Lifetime ISA rules: 4,000 pound cap, 25 percent bonus, 1,000 pound maximum bonus,
    450,000 pound property cap, ages 18 to 39, stops at 50. Not stale as at 1 August 2026.'
- id: uk-figure-junior-isa
  jurisdiction: uk
  authority:
    source: HMRC
    clause: junior individual savings accounts
    url: https://www.gov.uk/junior-individual-savings-accounts
    retrieved: 2026-08-01
  current_value: '9000'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: 'The Junior ISA limit is 9,000 pounds. The value is not stale. The year labels are stale:
    different lessons label it 2024/25 and 2025/26.'
- id: uk-figure-personal-allowance
  jurisdiction: uk
  authority:
    source: HMRC
    clause: Income Tax rates
    url: https://www.gov.uk/income-tax-rates
    retrieved: 2026-08-01
  current_value: '12570'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: 'The Personal Allowance is 12,570 pounds. The value is not stale. The year labels are stale:
    different lessons label it 2022/23 and 2024/25. The allowance is frozen to 2031.'
- id: uk-figure-cgt-annual-exempt
  jurisdiction: uk
  authority:
    source: HMRC
    clause: capital gains tax, allowances
    url: https://www.gov.uk/capital-gains-tax/allowances
    retrieved: 2026-08-01
  current_value: '3000'
  stale_values: []
  stale_now: false
  value_shape: single_1500_for_trusts
  plain_words: The Capital Gains Tax annual exempt amount is 3,000 pounds. Not stale as at 1 August 2026.
    1,500 pounds for trusts.
- id: uk-figure-inheritance-tax
  jurisdiction: uk
  authority:
    source: HMRC
    clause: inheritance tax
    url: https://www.gov.uk/inheritance-tax
    retrieved: 2026-08-01
  current_value: 325000 nil-rate band, 650000 couple, 175000 residence, 40% rate
  stale_values: []
  stale_now: false
  value_shape: single_values_many_reliefs
  plain_words: 'Inheritance Tax: 325,000 pound nil-rate band, 650,000 pounds a couple, 175,000 pound residence
    nil-rate band, 40 percent rate. Frozen to April 2030. Not stale as at 1 August 2026.'
- id: uk-figure-iht-gift-exemption
  jurisdiction: uk
  authority:
    source: HMRC
    clause: inheritance tax, gifts
    url: https://www.gov.uk/inheritance-tax/gifts
    retrieved: 2026-08-01
  current_value: '3000'
  stale_values: []
  stale_now: false
  value_shape: single_carries_forward_one_year
  plain_words: 'The Inheritance Tax annual gift exemption is 3,000 pounds and carries forward one year.
    The value is not stale. The year label is stale: one lesson labels it 2023/24.'
- id: uk-figure-adult-social-care
  jurisdiction: uk
  authority:
    source: Department of Health and Social Care
    clause: social care charging circular
    url: https://www.gov.uk/government/publications/social-care-charging-for-local-authorities-2025-to-2026/social-care-charging-for-care-and-support-2025-to-2026-local-authority-circular
    retrieved: 2026-08-01
  current_value: '23250'
  stale_values: []
  stale_now: false
  value_shape: england_only
  plain_words: The adult social care upper capital limit is 23,250 pounds. England only. The lesson says
    the council's, implying UK-wide, which is wrong. Frozen since 2010. Not stale as at 1 August 2026.
- id: uk-figure-app-fraud-cap
  jurisdiction: uk
  authority:
    source: Payment Systems Regulator
    clause: APP fraud reimbursement
    url: https://www.psr.org.uk/information-for-consumers/app-fraud-reimbursement-protections/
    retrieved: 2026-08-01
  current_value: '85000'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: The Authorised Push Payment fraud reimbursement cap is 85,000 pounds. Not stale as at 1
    August 2026.
- id: uk-figure-student-loan
  jurisdiction: uk
  authority:
    source: HMRC and Student Loans Company
    clause: repaying your student loan
    url: https://www.gov.uk/repaying-your-student-loan/what-you-pay
    retrieved: 2026-08-01
  current_value: 9% undergraduate, 6% postgraduate
  stale_values: []
  stale_now: false
  value_shape: table_five_plan_thresholds
  plain_words: Student loan repayment is 9 percent undergraduate and 6 percent postgraduate. Not stale
    as at 1 August 2026. The lessons never state the five plan thresholds, which range from 21,000 to
    33,795 pounds.
- id: uk-figure-marriage-allowance
  jurisdiction: uk
  authority:
    source: HMRC
    clause: marriage allowance
    url: https://www.gov.uk/marriage-allowance
    retrieved: 2026-08-01
  current_value: 1260 transferable, worth 252
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: Marriage Allowance is 1,260 pounds transferable, worth 252 pounds. Not stale as at 1 August
    2026.
- id: uk-figure-pension-credit
  jurisdiction: uk
  authority:
    source: DWP
    clause: pension credit, eligibility
    url: https://www.gov.uk/pension-credit/eligibility
    retrieved: 2026-08-01
  current_value: ignores first 10000 of savings
  stale_values: []
  stale_now: false
  value_shape: single_then_1_per_500_above
  plain_words: Pension Credit ignores the first 10,000 pounds of savings. Not stale as at 1 August 2026.
    Then 1 pound per week per 500 pounds above.
- id: uk-figure-state-pension-deferral
  jurisdiction: uk
  authority:
    source: DWP
    clause: deferring state pension
    url: https://www.gov.uk/deferring-state-pension
    retrieved: 2026-08-01
  current_value: about 5.8% a year
  stale_values: []
  stale_now: false
  value_shape: derived_from_1_per_9_weeks
  plain_words: State Pension deferral raises payments by about 5.8 percent a year. Derived from the published
    1 percent per 9 weeks rule. Not stale as at 1 August 2026.
- id: uk-figure-sdlt-non-resident-surcharge
  jurisdiction: uk
  authority:
    source: HMRC
    clause: rates of Stamp Duty Land Tax for non-UK residents
    url: https://www.gov.uk/guidance/rates-of-stamp-duty-land-tax-for-non-uk-residents
    retrieved: 2026-08-01
  current_value: 2% non-resident surcharge
  stale_values: []
  stale_now: false
  value_shape: surcharge_on_band_table
  plain_words: The Stamp Duty Land Tax non-resident surcharge is 2 percent. Not stale as at 1 August 2026.
    Surcharge on a band table.
- id: uk-figure-universal-credit-childcare
  jurisdiction: uk
  authority:
    source: DWP
    clause: help with childcare costs, universal credit
    url: https://www.gov.uk/help-with-childcare-costs/universal-credit
    retrieved: 2026-08-01
  current_value: 85% of childcare costs
  stale_values: []
  stale_now: false
  value_shape: single_with_monthly_caps
  plain_words: Universal Credit covers up to 85 percent of childcare costs. Not stale as at 1 August 2026.
    With monthly caps.
- id: uk-figure-auto-enrolment
  jurisdiction: uk
  authority:
    source: The Pensions Regulator / DWP
    clause: workplace pensions, what you pay
    url: https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay
    retrieved: 2026-08-01
  current_value: 8% total, 3% employer minimum
  stale_values: []
  stale_now: false
  value_shape: table_qualifying_earnings_6240_to_50270
  plain_words: Auto-enrolment is 8 percent total, 3 percent employer minimum. Not stale as at 1 August
    2026. Correctly worded as a minimum, which is the exact fix the Australian example needs. Qualifying
    earnings 6,240 to 50,270 pounds.
- id: uk-figure-personal-savings-dividend-allowance
  jurisdiction: uk
  authority:
    source: HMRC
    clause: apply tax-free interest on savings
    url: https://www.gov.uk/apply-tax-free-interest-on-savings
    retrieved: 2026-08-01
  current_value: 1000 or 500 Personal Savings, 500 Dividend
  stale_values: []
  stale_now: false
  value_shape: table_by_tax_band
  plain_words: Personal Savings Allowance is 1,000 or 500 pounds. Dividend Allowance is 500 pounds. Not
    stale as at 1 August 2026. Table by tax band.
```
