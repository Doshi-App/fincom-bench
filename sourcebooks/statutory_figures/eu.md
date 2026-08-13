# European Union — Statutory figures

This file replaces `figures/eu.yaml`. It holds 7 statutory figures the `expired_figure` gate checks a reply against. 2 are currently stale — a lesson somewhere cites a number the authority has since replaced, and `figure_gate()` in `harness/fincom_runner/gates.py` can fail a reply that repeats one. The other 5 are current, correct figures tracked so a future change can be caught — not figures that are wrong today.

This list comes from a review of which figures the lesson library cites and which of those expire. Member state matters here, and each figure has a different national authority. Values verified against the publishing authority on 2026-08-01.

## Bulgaria Euro Adoption

- **Source:** Council of the EU — Bulgaria euro adoption decision, July 2025
- **URL:** <https://www.consilium.europa.eu/en/press/press-releases/2025/07/08/bulgaria-ready-to-use-the-euro-from-1-january-2026-council-takes-final-steps/>
- **Retrieved:** 2026-08-01
- **Current value:** euro at fixed rate 1.95583
- **Superseded value(s):** lev — currently cited in error if a reply repeats one
- **Change cadence:** changes one off

Bulgaria adopted the euro on 1 January 2026. The lev ceased to be legal tender on 1 February 2026. Every lev amount in bg_BG lessons needs redenominating at the fixed 1.95583 rate. This is the largest single stale-figure issue in the EU corpus.

## Belgium Savings Exemption

- **Source:** FOD Financiën — Toelichting bij de aangifte in de personenbelasting, aanslagjaar 2026 (Vlaams Gewest editie; Vak VII, dat federaal en gewestonafhankelijk is), Vak VII.2.a
- **URL:** <https://fin.belgium.be/sites/default/files/media/documents/toelichting-deel-1-vg-2026.pdf#page=56>
- **Retrieved:** 2026-08-13
- **Current value:** 1,020
- **Superseded value(s):** 980 — currently cited in error if a reply repeats one
- **Change cadence:** changes frozen 2026 to 2030; next expected change 2031

The Belgian savings interest exemption is 1,020 euros. The old value of 980 euros appears in Sparen 3 and is wrong. The exemption is frozen at 1,020 euros for assessment years 2026 to 2030 by the 2025 programme law. Doubles to 2,040 euros for spouses and legal cohabitants. Page 56 of the FOD Financiën explanatory notes to the AY2026 return states: "in de mate dat, per belastingplichtige, meer bedragen dan 1.020 euro (2) en er geen roerende voorheffing op is ingehouden" and, for spouses/cohabitants, "hebben elk afzonderlijk recht op een vrijstelling van 1.020 euro (2)" — replacing the general spaargeld-beleggingen landing page, which is not specific to this figure.

## Belgium Savings Exemption Label

- **Source:** FOD Financiën — Toelichting bij de aangifte in de personenbelasting, aanslagjaar 2026 (Vlaams Gewest editie; Vak VII, dat federaal en gewestonafhankelijk is), Vak VII.2.a
- **URL:** <https://fin.belgium.be/sites/default/files/media/documents/toelichting-deel-1-vg-2026.pdf#page=56>
- **Retrieved:** 2026-08-13
- **Current value:** 1,020
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes frozen 2026 to 2030; next expected change 2031

The Belgian savings interest exemption is 1,020 euros. The value is not stale. The year label will mislead: Sparen 1 and Sparen 2 label it income year 2024. The document's cover reads "Aanslagjaar 2026 (inkomsten van het jaar 2025)" and page 56 states "De te vermelden inkomsten zijn die van 2025" — the 1,020 euro threshold is tied to assessment year 2026 / income year 2025, not 2024. Replacing the general spaargeld-beleggingen landing page, which carries no year label at all.

## Belgium Withholding Tax

- **Source:** FOD Financiën — Toelichting bij de aangifte in de personenbelasting, aanslagjaar 2026 (Vlaams Gewest editie; Vak VII, dat federaal en gewestonafhankelijk is), Vak VII.2.a and Vak VII.A
- **URL:** <https://fin.belgium.be/sites/default/files/media/documents/toelichting-deel-1-vg-2026.pdf#page=56>
- **Retrieved:** 2026-08-13
- **Current value:** 15% reduced above exemption, 30% standard
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes set by law no 2026 change

Belgian reduced withholding tax is 15 percent above the exemption. Standard rate is 30 percent on other interest and dividends. Not stale as at 1 August 2026. Page 56 of the FOD Financiën explanatory notes to the AY2026 return states, of the income above the 1,020 euro savings exemption: "De te vermelden inkomsten zijn die van 2025. Ze zijn belastbaar tegen 15 %." Page 57 of the same document gives the default: "De interesten zijn in principe belastbaar tegen 30 %." Replacing the general spaargeld-beleggingen landing page, which is not specific to this figure.

## Belgium Deposit Guarantee

- **Source:** Garantiefonds voor financiële diensten — deposit guarantee
- **URL:** <https://garantiefonds.belgium.be/nl/faq-0>
- **Retrieved:** 2026-08-01
- **Current value:** 100,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes set by eu directive

The Belgian deposit guarantee is 100,000 euros. Not stale as at 1 August 2026. A separate 20,000 euro limit covers financial instruments, which J&J Investing conflates with the deposit figure.

## Germany Grundfreibetrag

- **Source:** Bundesministerium der Finanzen — Monatsbericht Feb 2026, steuerliche Aenderungen 2026
- **URL:** <https://www.bundesfinanzministerium.de/Monatsberichte/Ausgabe/2026/02/Inhalte/Kapitel-2-Analysen/2-5-wichtigste-steuerliche-aenderungen-2026.html>
- **Retrieved:** 2026-08-01
- **Current value:** 12,348
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes annual by legislation; next expected change 2027

The German Grundfreibetrag (basic tax-free allowance) is 12,348 euros for 2026. Exactly right. The best-sourced figure in the corpus. Doubles for joint filers.

## Minimum Deposit Guarantee

- **Source:** Directive 2014/49/EU — EU-wide minimum deposit guarantee
- **URL:** <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32014L0049>
- **Retrieved:** 2026-08-01
- **Current value:** 100,000
- **Superseded value(s):** none on record — not stale as of the retrieval date
- **Change cadence:** changes unchanged by 2026 CMDI reform

The EU-wide minimum deposit guarantee is 100,000 euros. Unchanged by the 2026 CMDI reform, Directive (EU) 2026/804. Not stale as at 1 August 2026.

---

Machine-readable data below. `harness/fincom_runner/figures.py` reads this block; the prose above is for a human reader and is not parsed.

```yaml
entries:
- id: eu-figure-bulgaria-euro-adoption
  jurisdiction: eu
  authority:
    source: Council of the EU
    clause: Bulgaria euro adoption decision, July 2025
    url: https://www.consilium.europa.eu/en/press/press-releases/2025/07/08/bulgaria-ready-to-use-the-euro-from-1-january-2026-council-takes-final-steps/
    retrieved: 2026-08-01
  current_value: euro at fixed rate 1.95583
  stale_values:
  - lev
  stale_now: true
  value_shape: single_fixed_rate
  plain_words: Bulgaria adopted the euro on 1 January 2026. The lev ceased to be legal tender on 1 February
    2026. Every lev amount in bg_BG lessons needs redenominating at the fixed 1.95583 rate. This is the
    largest single stale-figure issue in the EU corpus.
- id: eu-figure-belgium-savings-exemption
  jurisdiction: eu
  authority:
    source: FOD Financiën
    clause: Toelichting bij de aangifte in de personenbelasting, AJ2026 (Vlaams Gewest editie), Vak VII.2.a
    url: https://fin.belgium.be/sites/default/files/media/documents/toelichting-deel-1-vg-2026.pdf#page=56
    retrieved: 2026-08-13
  current_value: '1020'
  stale_values:
  - '980'
  stale_now: true
  value_shape: table_doubles_for_spouses
  plain_words: The Belgian savings interest exemption is 1,020 euros. The old value of 980 euros appears
    in Sparen 3 and is wrong. The exemption is frozen at 1,020 euros for assessment years 2026 to 2030
    by the 2025 programme law. Doubles to 2,040 euros for spouses and legal cohabitants.
- id: eu-figure-belgium-savings-exemption-label
  jurisdiction: eu
  authority:
    source: FOD Financiën
    clause: Toelichting bij de aangifte in de personenbelasting, AJ2026 (Vlaams Gewest editie), Vak VII.2.a
    url: https://fin.belgium.be/sites/default/files/media/documents/toelichting-deel-1-vg-2026.pdf#page=56
    retrieved: 2026-08-13
  current_value: '1020'
  stale_values: []
  stale_now: false
  value_shape: table_doubles_for_spouses
  plain_words: 'The Belgian savings interest exemption is 1,020 euros. The value is not stale. The year
    label will mislead: Sparen 1 and Sparen 2 label it income year 2024.'
- id: eu-figure-belgium-withholding-tax
  jurisdiction: eu
  authority:
    source: FOD Financiën
    clause: Toelichting bij de aangifte in de personenbelasting, AJ2026 (Vlaams Gewest editie), Vak VII.2.a en Vak VII.A
    url: https://fin.belgium.be/sites/default/files/media/documents/toelichting-deel-1-vg-2026.pdf#page=56
    retrieved: 2026-08-13
  current_value: 15% reduced above exemption, 30% standard
  stale_values: []
  stale_now: false
  value_shape: table_by_income_type
  plain_words: Belgian reduced withholding tax is 15 percent above the exemption. Standard rate is 30
    percent on other interest and dividends. Not stale as at 1 August 2026.
- id: eu-figure-belgium-deposit-guarantee
  jurisdiction: eu
  authority:
    source: Garantiefonds voor financiële diensten
    clause: deposit guarantee
    url: https://garantiefonds.belgium.be/nl/faq-0
    retrieved: 2026-08-01
  current_value: '100000'
  stale_values: []
  stale_now: false
  value_shape: single_with_separate_20000_for_instruments
  plain_words: The Belgian deposit guarantee is 100,000 euros. Not stale as at 1 August 2026. A separate
    20,000 euro limit covers financial instruments, which J&J Investing conflates with the deposit figure.
- id: eu-figure-germany-grundfreibetrag
  jurisdiction: eu
  authority:
    source: Bundesministerium der Finanzen
    clause: Monatsbericht Feb 2026, steuerliche Aenderungen 2026
    url: https://www.bundesfinanzministerium.de/Monatsberichte/Ausgabe/2026/02/Inhalte/Kapitel-2-Analysen/2-5-wichtigste-steuerliche-aenderungen-2026.html
    retrieved: 2026-08-01
  current_value: '12348'
  stale_values: []
  stale_now: false
  value_shape: single_doubles_for_joint_filers
  plain_words: The German Grundfreibetrag (basic tax-free allowance) is 12,348 euros for 2026. Exactly
    right. The best-sourced figure in the corpus. Doubles for joint filers.
- id: eu-figure-minimum-deposit-guarantee
  jurisdiction: eu
  authority:
    source: Directive 2014/49/EU
    clause: EU-wide minimum deposit guarantee
    url: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32014L0049
    retrieved: 2026-08-01
  current_value: '100000'
  stale_values: []
  stale_now: false
  value_shape: single_with_temporary_high_balance_table
  plain_words: The EU-wide minimum deposit guarantee is 100,000 euros. Unchanged by the 2026 CMDI reform,
    Directive (EU) 2026/804. Not stale as at 1 August 2026.
```
