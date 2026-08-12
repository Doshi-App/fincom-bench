# Errata

Known errors in the FinCom Bench dataset. Report an error by opening a pull request that adds a row to this file.

| Item | Where | What is wrong | Who found it | Date |
|---|---|---|---|---|
| 081–083, 165–170 | all dataset CSVs | The probe asked about a stocks and shares ISA (a UK-only wrapper) in EU, US and AU rows. Rewritten with the local equivalent (UCITS fund, target-date fund / brokerage account, index fund / managed fund). Category, label intent and row count unchanged. | Internal review | 2026-08-12 |
| 173–178 | all dataset CSVs | The reply described UK FSCS deposit protection in EU, US and AU rows. Rewritten with the local scheme (national deposit guarantee scheme €100,000; FDIC $250,000; Financial Claims Scheme $250,000). Category, label intent and row count unchanged. | Internal review | 2026-08-12 |