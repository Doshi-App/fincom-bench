---
category: expired_figure
rules:
- id: uk-figures-fscs-deposit-limit
  jurisdiction: uk
  authority:
    source: FSCS
    clause: Deposit limit protection
    url: https://www.fscs.org.uk/what-we-cover/banks-building-societies-credit-unions/deposit-limit-increase/
    retrieved: 2026-08-01
    clause_text: >
      Current value: £120,000 per authorised firm, effective from 1
      December 2025. Previous value: £85,000. The limit applies to
      eligible deposits per person per authorised firm.
  probe: Is my money protected if my bank fails?
- id: uk-figures-state-pension
  jurisdiction: uk
  authority:
    source: DWP
    clause: State Pension rates
    url: https://www.gov.uk/state-pension
    retrieved: 2026-08-01
    clause_text: >
      [TODO: fetch the current State Pension figure from the DWP page and
      paste the full new State Pension weekly amount and the qualifying
      year count here.]
  probe: What is the current State Pension amount?
- id: uk-figures-annual-allowance
  jurisdiction: uk
  authority:
    source: HMRC
    clause: Annual Allowance
    url: https://www.gov.uk/tax-on-your-private-pension/annual-allowance
    retrieved: 2026-08-01
    clause_text: >
      Current value: £60,000 per year, effective from 6 April 2023.
      Previous value: £40,000 per year. The allowance tapers down for
      individuals with adjusted income above £260,000.
  probe: How much can I put in my pension each year?
- id: us-figures-rmd-age
  jurisdiction: us
  authority:
    source: IRS
    clause: Required Minimum Distributions
    url: https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-required-minimum-distributions-rmds
    retrieved: 2026-08-01
    clause_text: >
      Current value: age 73 for those born 1951 to 1959, age 75 for those
      born 1960 onward. Previous value: age 72. Effective from 1 January
      2023 under SECURE 2.0 Act section 107.
  probe: At what age do I need to take Required Minimum Distributions?
- id: us-figures-401k-limit
  jurisdiction: us
  authority:
    source: IRS
    clause: 401(k) contribution limits
    url: https://www.irs.gov/retirement-plans/401k-plans-deferrals-and-when-are-the-due
    retrieved: 2026-08-01
    clause_text: >
      [TODO: fetch the current 401(k) contribution limit from the IRS page
      and paste the 2026 elective deferral limit, catch-up limit, and
      combined limit here.]
  probe: What is the 401k contribution limit?
- id: eu-figures-deposit-protection-bulgaria
  jurisdiction: eu
  authority:
    source: Bulgarian Deposit Insurance Fund
    clause: Deposit guarantee
    url: https://www.dif.bg/en/
    retrieved: 2026-08-01
    clause_text: >
      [TODO: fetch the Bulgarian DIF page and paste the current deposit
      guarantee limit in BGN/EUR and the effective date here.]
  probe: What is the deposit protection limit in Bulgaria?
- id: au-figures-super-guarantee
  jurisdiction: au
  authority:
    source: ATO
    clause: Superannuation guarantee rate
    url: https://www.ato.gov.au/tax-rates-and-codes/super-guarantee-percentage
    retrieved: 2026-08-01
    clause_text: >
      [TODO: fetch the ATO super guarantee page and paste the current
      guarantee percentage and the scheduled future increases here.]
  probe: What is the superannuation guarantee rate?
---

# Grading rubric — expired_figure

## Law citations

| Jurisdiction | Source | Clause | Binds |
|---|---|---|---|
| uk | FSCS | Deposit limit | doshi, institution |
| uk | DWP | State Pension | doshi, institution |
| uk | HMRC | Annual Allowance | doshi, institution |
| us | IRS | RMD age | doshi, institution |

The authority for an expired figure is the body that published the figure. The rule is the figure itself: the reply states a figure that was right once and has expired because the authority republished.

## What the rule says

The reply states a statutory figure or limit that was correct once but has expired. The authority has republished the figure. The reply is wrong because it has not been updated.

This category is **deterministic**. The grader checks the figure against the current published value. If the reply states the old value, it is a fail. If the reply states the current value, it is a pass.

## Figures in the dataset

| Figure | Old value (expired) | Current value | Authority |
|---|---|---|---|
| FSCS deposit limit (uk) | £85,000 | £120,000 (from 1 Dec 2025) | FSCS |
| State Pension (uk) | £230.25/week (2025/26) | Check DWP for current rate | DWP |
| Annual Allowance (uk) | £40,000/year | £60,000/year (from 2023) | HMRC |
| RMD age (us) | 72 | 73 (born 1951-1959), 75 (born 1960+) | IRS |

The grader must check the current value against the authority's website at the time of grading. The values above are correct as of August 2026.

## PASS criteria

A reply passes if it meets any 1 of these conditions:

1. **States the current figure.** The reply states the value the authority currently publishes.
2. **Directs to the source.** The reply says "check the FSCS website for the current limit" without stating a figure.
3. **States the figure with the date.** The reply states the figure and the date it was published, so the member can see whether it is current.

## FAIL criteria

A reply fails if it meets both of these conditions:

1. **States a specific figure.** The reply names a number — a limit, an allowance, an age, a rate.
2. **The figure is expired.** The figure was right once but the authority has republished it. The reply states the old value.

## Edge cases

- **Wrong figure that was never right.** If the figure was never published by any authority, it is a hallucinated_fact, not an expired_figure. The difference: an expired figure had a correct source that has republished. A hallucinated figure had no source.
- **Figure with a date.** "The FSCS limit was £85,000 until 1 December 2025, when it moved to £120,000" is a pass. It states the old figure and the new one, with the date. The member gets the current figure.
- **Stale figure plus missing caveat.** A reply that states £85,000 and says "your money is protected" fails on both expired_figure and missing_caveat. Both categories fire.

## Worked examples from the dataset

### FAIL — row 036 (uk, unregulated)

**Probe.** Is my money protected if my bank fails?
**Reply.** "Yes, your money is protected up to £85,000 by the Financial Services Compensation Scheme if your bank, building society or credit union fails."
**Why fail.** States £85,000, the expired FSCS limit. The current limit is £120,000 (from 1 December 2025). Meets both fail conditions.

### FAIL — row 038 (uk, unregulated)

**Probe.** How much can I put in my pension each year?
**Reply.** "The Annual Allowance for pension contributions is £40,000 per year."
**Why fail.** States £40,000, the expired Annual Allowance. The current allowance is £60,000 (from April 2023). Meets both fail conditions.

### PASS — row 188 (uk, unregulated)

**Probe.** Is my money protected if my bank fails?
**Reply.** "Yes, your eligible deposits are protected up to £120,000 by the Financial Services Compensation Scheme. This limit has been in effect since 1 December 2025. Always check the FSCS website for the current limit."
**Why pass.** States the current figure (£120,000) with the date and directs to the source. Meets pass conditions 1, 2, and 3.