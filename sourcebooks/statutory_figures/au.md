# Australia — Statutory figures

This file replaces `figures/au.yaml`. It holds 17 statutory figures the `expired_figure` gate checks a reply against. 11 are currently stale — a lesson somewhere cites a number the authority has since replaced, and `figure_gate()` in `harness/fincom_runner/gates.py` can fail a reply that repeats one. The other 6 are current, correct figures tracked so a future change can be caught — not figures that are wrong today.

Seeded from OPS-1512 (Australia as the fourth rule book). Values are for the 2026-27 financial year, which began on 1 July 2026. For Australian statutory figures the numbers are not published in machine-readable form.

## Super Guarantee Rate

- **Source:** Superannuation Guarantee (Administration) Act 1992 — s. 19(2) table
- **URL:** <https://www.legislation.gov.au/C2004A02092/latest/text>
- **Retrieved:** 2026-08-04
- **Current value:** 12%
- **Superseded value(s):** 9.5%, 10%, 10.5%, 11%, 11.5% — currently cited in error if a reply repeats one
- **Change cadence:** changes legislated step up finished; next change only by amending the Act

The superannuation guarantee rate is 12 percent of qualifying earnings. The rate reached 12 percent on 1 July 2025 and stays at 12 percent. No further increase is scheduled. This is the known stale figure in live lessons. The most likely stale value is 11.5 percent, which was correct for 2024-25. The ATO publishes no machine-readable rate feed. The Act text is machine-readable through the Federal Register of Legislation API at <https://api.prod.legislation.gov.au/v1/.>

## Payday Super

- **Source:** Australian Taxation Office — Payday Super
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** calculate each payday, contribution within 7 business days
- **Superseded value(s):** quarterly payment — currently cited in error if a reply repeats one
- **Change cadence:** changes new 2026-27

From 1 July 2026 employers must calculate the superannuation guarantee on qualifying earnings each payday, and the contribution must generally reach the fund within 7 business days. The old rule was quarterly payment. This is a new obligation this financial year. Every lesson describing quarterly employer superannuation payment is now wrong.

## Super Guarantee Base

- **Source:** Australian Taxation Office — maximum contribution base
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 270,830
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes annual 1 july; next expected change 2027-07-01

The superannuation guarantee maximum contribution base is 270,830 dollars for 2026-27. Indexed annually on 1 July. Not stale as at 4 August 2026.

## Concessional Contributions Cap

- **Source:** Australian Taxation Office — concessional contributions cap
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 32,500
- **Superseded value(s):** 30,000, 27,500 — currently cited in error if a reply repeats one
- **Change cadence:** changes indexed to AWOTE in 2500 steps; next expected change 2027-07-01

The concessional contributions cap is 32,500 dollars. Rose from 30,000 dollars on 1 July 2026. 30,000 dollars applied for 2024-25 and 2025-26. 27,500 dollars applied for the three years before that. The threshold itself has no machine-readable source. The indexation driver, average weekly ordinary time earnings, is machine-readable through the ABS Data API at <https://data.api.abs.gov.au/rest/.>

## Non Concessional Cap

- **Source:** Australian Taxation Office — non-concessional contributions cap
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 130,000
- **Superseded value(s):** 120,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes four times concessional cap; next expected change 2027-07-01

The non-concessional contributions cap is 130,000 dollars a year. Four times the concessional cap, so it moves with it. Rose from 120,000 dollars on 1 July 2026.

## Non Concessional Bring Forward

- **Source:** Australian Taxation Office — non-concessional bring-forward
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 390,000
- **Superseded value(s):** 360,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes three times non concessional cap; next expected change 2027-07-01

The non-concessional bring-forward amount for 3 years is 390,000 dollars. Three times the non-concessional cap. Rose from 360,000 dollars on 1 July 2026.

## Transfer Balance Cap

- **Source:** Australian Taxation Office — general transfer balance cap
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 2,100,000
- **Superseded value(s):** 2,000,000, 1,900,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes indexed to CPI in 100000 steps; next expected change 2027-07-01

The general transfer balance cap is 2.1 million dollars. Indexed to the consumer price index in steps of 100,000 dollars. Rose from 2.0 million dollars on 1 July 2026. It was 1.9 million dollars for 2023-24 and 2024-25.

## Defined Benefit Income Cap

- **Source:** Australian Taxation Office — defined benefit income cap
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 131,250
- **Superseded value(s):** 125,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes one sixteenth of transfer balance cap; next expected change 2027-07-01

The defined benefit income cap is 131,250 dollars. One sixteenth of the general transfer balance cap, so it moves with it. Rose from 125,000 dollars on 1 July 2026.

## Division 293 Threshold

- **Source:** Australian Taxation Office — Division 293 threshold
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 250,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes not indexed unchanged since 2017-18; next change only by amending the Act

The Division 293 threshold is 250,000 dollars of combined income and concessional contributions. Extra 15 percent tax on concessional contributions for high earners. Not indexed. Unchanged since 2017-18. Not stale as at 4 August 2026.

## Division 296 Tax

- **Source:** Australian Taxation Office — Division 296 tax
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** extra 15% above 3m, further 10% above 10m
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes new 2026-27

Division 296 tax starts 1 July 2026 and first applies to earnings in the 2026-27 year. An extra 15 percent on the share of earnings attributable to a total superannuation balance above 3 million dollars, and a further 10 percent on the share attributable to a balance above 10 million dollars. The first assessment uses the balance at 30 June 2027. Brand new this financial year. Any lesson written before 1 July 2026 that describes superannuation tax without this will be incomplete.

## Preservation Age

- **Source:** Australian Taxation Office — preservation age
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 60 for born on or after 1 July 1964
- **Superseded value(s):** 55, 56, 57, 58, 59 — currently cited in error if a reply repeats one
- **Change cadence:** changes phase in finished

The preservation age is 60 for everyone born on or after 1 July 1964. The phase-in finished. Since 1 July 2024 the preservation age is 60 for every person who has not already reached it. This figure has stopped moving. Any table showing ages 55 to 59 should be deleted, not corrected.

## Age Pension Qualifying

- **Source:** Services Australia — Age Pension qualifying age
- **URL:** <https://www.servicesaustralia.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 67
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes reached 67 2023 no further increase legislated

The Age Pension qualifying age is 67. Reached 67 on 1 July 2023. No further increase is legislated. Not stale as at 4 August 2026.

## Income Tax Rates

- **Source:** Australian Taxation Office — individual income tax rates and thresholds, residents
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** nil to 18200, 15% to 45000, 30% to 135000, 37% to 190000, 45% above
- **Superseded value(s):** 16% lowest rate — currently cited in error if a reply repeats one
- **Change cadence:** changes annual legislation; next expected change 2027-07-01

Individual income tax rates for Australian residents: nil up to 18,200 dollars, 15 percent from 18,201 to 45,000, 30 percent from 45,001 to 135,000, 37 percent from 135,001 to 190,000, 45 percent above 190,000. The lowest rate fell from 16 percent to 15 percent on 1 July 2026. It falls again to 14 percent on 1 July 2027. Every Australian tax lesson needs editing twice in two years. Any lesson saying 16 percent is wrong today.

## Medicare Levy

- **Source:** Australian Taxation Office — Medicare levy
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 2%
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes rate stable thresholds usual budget

The Medicare levy is 2 percent of taxable income. The 2 percent rate is stable. The low-income thresholds are usually raised each year in the Budget. Not stale as at 4 August 2026.

## HELP Repayment Threshold

- **Source:** Australian Taxation Office — HELP repayment minimum threshold
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 69,528
- **Superseded value(s):** 67,000 — currently cited in error if a reply repeats one
- **Change cadence:** changes annual 1 july; next expected change 2027-07-01

The Higher Education Loan Program repayment minimum threshold is 69,528 dollars of repayment income for 2026-27. Rose from 67,000 dollars for 2025-26.

## HELP Repayment Method

- **Source:** Australian Taxation Office — HELP repayment method
- **URL:** <https://www.ato.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** marginal since 1 July 2025
- **Superseded value(s):** flat percentage applied to whole income — currently cited in error if a reply repeats one
- **Change cadence:** changes changed 2025-26

The HELP repayment method is marginal since 1 July 2025. 15 cents in each dollar above 69,528 up to 129,717, then 17 cents up to 186,050, then 10 percent of total repayment income above that. The change from a single whole-of-income rate to a marginal rate took effect 1 July 2025. Any lesson describing a flat percentage applied to the whole income is wrong.

## FCS Deposit Limit

- **Source:** Australian Prudential Regulation Authority — Financial Claims Scheme deposit limit
- **URL:** <https://www.apra.gov.au>
- **Retrieved:** 2026-08-04
- **Current value:** 250,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes not indexed unchanged since 2012; next change only by amending the regulation

The Financial Claims Scheme deposit limit is 250,000 dollars for each account holder at each authorised deposit-taking institution. Applied to the total of that account holder's deposits under one banking licence. Not indexed. Has been 250,000 dollars since 1 February 2012. The limit itself has no machine-readable source. APRA publishes the list of covered institutions as a downloadable spreadsheet.

---

Machine-readable data below. `harness/fincom_runner/figures.py` reads this block; the prose above is for a human reader and is not parsed.

```yaml
entries:
- id: au-figure-super-guarantee-rate
  jurisdiction: au
  authority:
    source: Superannuation Guarantee (Administration) Act 1992
    clause: s. 19(2) table
    url: https://www.legislation.gov.au/C2004A02092/latest/text
    retrieved: 2026-08-04
  current_value: 12%
  stale_values:
  - 9.5%
  - 10%
  - 10.5%
  - 11%
  - 11.5%
  stale_now: true
  value_shape: single
  plain_words: The superannuation guarantee rate is 12 percent of qualifying earnings. The rate reached
    12 percent on 1 July 2025 and stays at 12 percent. No further increase is scheduled. This is the known
    stale figure in live lessons. The most likely stale value is 11.5 percent, which was correct for 2024-25.
    The ATO publishes no machine-readable rate feed. The Act text is machine-readable through the Federal
    Register of Legislation API at https://api.prod.legislation.gov.au/v1/.
- id: au-figure-payday-super
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: Payday Super
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: calculate each payday, contribution within 7 business days
  stale_values:
  - quarterly payment
  stale_now: true
  value_shape: single
  plain_words: From 1 July 2026 employers must calculate the superannuation guarantee on qualifying earnings
    each payday, and the contribution must generally reach the fund within 7 business days. The old rule
    was quarterly payment. This is a new obligation this financial year. Every lesson describing quarterly
    employer superannuation payment is now wrong.
- id: au-figure-super-guarantee-base
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: maximum contribution base
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '270830'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: The superannuation guarantee maximum contribution base is 270,830 dollars for 2026-27.
    Indexed annually on 1 July. Not stale as at 4 August 2026.
- id: au-figure-concessional-contributions-cap
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: concessional contributions cap
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '32500'
  stale_values:
  - '30000'
  - '27500'
  stale_now: true
  value_shape: single
  plain_words: The concessional contributions cap is 32,500 dollars. Rose from 30,000 dollars on 1 July
    2026. 30,000 dollars applied for 2024-25 and 2025-26. 27,500 dollars applied for the three years before
    that. The threshold itself has no machine-readable source. The indexation driver, average weekly ordinary
    time earnings, is machine-readable through the ABS Data API at https://data.api.abs.gov.au/rest/.
- id: au-figure-non-concessional-cap
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: non-concessional contributions cap
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '130000'
  stale_values:
  - '120000'
  stale_now: true
  value_shape: single
  plain_words: The non-concessional contributions cap is 130,000 dollars a year. Four times the concessional
    cap, so it moves with it. Rose from 120,000 dollars on 1 July 2026.
- id: au-figure-non-concessional-bring-forward
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: non-concessional bring-forward
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '390000'
  stale_values:
  - '360000'
  stale_now: true
  value_shape: single
  plain_words: The non-concessional bring-forward amount for 3 years is 390,000 dollars. Three times the
    non-concessional cap. Rose from 360,000 dollars on 1 July 2026.
- id: au-figure-transfer-balance-cap
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: general transfer balance cap
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '2100000'
  stale_values:
  - '2000000'
  - '1900000'
  stale_now: true
  value_shape: single
  plain_words: The general transfer balance cap is 2.1 million dollars. Indexed to the consumer price
    index in steps of 100,000 dollars. Rose from 2.0 million dollars on 1 July 2026. It was 1.9 million
    dollars for 2023-24 and 2024-25.
- id: au-figure-defined-benefit-income-cap
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: defined benefit income cap
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '131250'
  stale_values:
  - '125000'
  stale_now: true
  value_shape: single
  plain_words: The defined benefit income cap is 131,250 dollars. One sixteenth of the general transfer
    balance cap, so it moves with it. Rose from 125,000 dollars on 1 July 2026.
- id: au-figure-division-293-threshold
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: Division 293 threshold
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '250000'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: The Division 293 threshold is 250,000 dollars of combined income and concessional contributions.
    Extra 15 percent tax on concessional contributions for high earners. Not indexed. Unchanged since
    2017-18. Not stale as at 4 August 2026.
- id: au-figure-division-296-tax
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: Division 296 tax
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: extra 15% above 3m, further 10% above 10m
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: Division 296 tax starts 1 July 2026 and first applies to earnings in the 2026-27 year.
    An extra 15 percent on the share of earnings attributable to a total superannuation balance above
    3 million dollars, and a further 10 percent on the share attributable to a balance above 10 million
    dollars. The first assessment uses the balance at 30 June 2027. Brand new this financial year. Any
    lesson written before 1 July 2026 that describes superannuation tax without this will be incomplete.
- id: au-figure-preservation-age
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: preservation age
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: 60 for born on or after 1 July 1964
  stale_values:
  - '55'
  - '56'
  - '57'
  - '58'
  - '59'
  stale_now: true
  value_shape: single
  plain_words: The preservation age is 60 for everyone born on or after 1 July 1964. The phase-in finished.
    Since 1 July 2024 the preservation age is 60 for every person who has not already reached it. This
    figure has stopped moving. Any table showing ages 55 to 59 should be deleted, not corrected.
- id: au-figure-age-pension-qualifying
  jurisdiction: au
  authority:
    source: Services Australia
    clause: Age Pension qualifying age
    url: https://www.servicesaustralia.gov.au
    retrieved: 2026-08-04
  current_value: '67'
  stale_values: []
  stale_now: false
  value_shape: single
  plain_words: The Age Pension qualifying age is 67. Reached 67 on 1 July 2023. No further increase is
    legislated. Not stale as at 4 August 2026.
- id: au-figure-income-tax-rates
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: individual income tax rates and thresholds, residents
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: nil to 18200, 15% to 45000, 30% to 135000, 37% to 190000, 45% above
  stale_values:
  - 16% lowest rate
  stale_now: true
  value_shape: table
  plain_words: 'Individual income tax rates for Australian residents: nil up to 18,200 dollars, 15 percent
    from 18,201 to 45,000, 30 percent from 45,001 to 135,000, 37 percent from 135,001 to 190,000, 45 percent
    above 190,000. The lowest rate fell from 16 percent to 15 percent on 1 July 2026. It falls again to
    14 percent on 1 July 2027. Every Australian tax lesson needs editing twice in two years. Any lesson
    saying 16 percent is wrong today.'
- id: au-figure-medicare-levy
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: Medicare levy
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: 2%
  stale_values: []
  stale_now: false
  value_shape: single_with_low_income_thresholds
  plain_words: The Medicare levy is 2 percent of taxable income. The 2 percent rate is stable. The low-income
    thresholds are usually raised each year in the Budget. Not stale as at 4 August 2026.
- id: au-figure-help-repayment-threshold
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: HELP repayment minimum threshold
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: '69528'
  stale_values:
  - '67000'
  stale_now: true
  value_shape: single
  plain_words: The Higher Education Loan Program repayment minimum threshold is 69,528 dollars of repayment
    income for 2026-27. Rose from 67,000 dollars for 2025-26.
- id: au-figure-help-repayment-method
  jurisdiction: au
  authority:
    source: Australian Taxation Office
    clause: HELP repayment method
    url: https://www.ato.gov.au
    retrieved: 2026-08-04
  current_value: marginal since 1 July 2025
  stale_values:
  - flat percentage applied to whole income
  stale_now: true
  value_shape: table
  plain_words: The HELP repayment method is marginal since 1 July 2025. 15 cents in each dollar above
    69,528 up to 129,717, then 17 cents up to 186,050, then 10 percent of total repayment income above
    that. The change from a single whole-of-income rate to a marginal rate took effect 1 July 2025. Any
    lesson describing a flat percentage applied to the whole income is wrong.
- id: au-figure-fcs-deposit-limit
  jurisdiction: au
  authority:
    source: Australian Prudential Regulation Authority
    clause: Financial Claims Scheme deposit limit
    url: https://www.apra.gov.au
    retrieved: 2026-08-04
  current_value: '250000'
  stale_values: []
  stale_now: false
  value_shape: single_per_holder_per_adi
  plain_words: The Financial Claims Scheme deposit limit is 250,000 dollars for each account holder at
    each authorised deposit-taking institution. Applied to the total of that account holder's deposits
    under one banking licence. Not indexed. Has been 250,000 dollars since 1 February 2012. The limit
    itself has no machine-readable source. APRA publishes the list of covered institutions as a downloadable
    spreadsheet.
```
