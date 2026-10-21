# Round three (20 October 2026): supplier revenue as filed, with a stated dollar conversion

The owner's decision: the Suppliers page and the Index show each company's revenue in the currency it files in, as filed, and add a US-dollar figure converted at a published exchange rate, with the method named on the page. Until now `data/suppliers.json` held only `revenueUSDb`, a dollar figure earlier agents converted at rates nobody recorded, and for some firms not even from a filing.

`qa/round2/RULES.md` stays binding (sources, writing, no personal data in requests, Edit tool for repo files, no servers, no in-app browser). What is new is below.

## 1. The filed figure (collectors)

For every supplier in your work list (`qa/round3/firms-<group>.json`, 170 in all), find total revenue for the latest completed fiscal year whose annual report or annual results were published by 20 October 2026, in the company's own filing.
- **Source:** the company's annual report, annual securities report (Japan: 有価証券報告書 on EDINET or the company's IR site), 10-K or 20-F, DART business report (Korea), the annual report filed with the exchange (China: cninfo or SSE/SZSE; Taiwan: MOPS or the company's IR site), or the audited annual results release. Tier A only. Never a data aggregator, a stock site, Wikipedia or press.
- **Scope:** match what the site describes. Most rows are the whole company. Where the row is a business inside a larger group (for example "Samsung Memory", "Siemens Energy", "Merck KGaA" for electronics), compare the current `revenueUSDb_now` with the filing to see which scope earlier agents used, use that scope if the filing states it, and say so in `scope` ("segment: Memory"). If the right scope is unclear, use the whole company and explain in `note`.
- **Exactly as filed:** the number and unit the filing prints (2,429,445 in millions of yen stays 2,429,445 with unit "million"). No rounding, no unit conversion, no arithmetic. If the filing gives it in two units (a summary in billions and a table in millions), use the table's.
- **Revenue line:** consolidated net sales, revenue or operating revenue, whichever the filing calls its top line. Name it in `basis`, with the accounting standard ("Net sales, consolidated, IFRS").
- **Fiscal year:** the company's own label (`fiscalYear`: "FY2025", "2025", "FY2026"), with `fyStart` and `fyEnd` as "YYYY-MM" (the first and last months of the year). A 52- or 53-week year: use the months it mostly covers and say so in `note`.
- **Page:** for a PDF, add `#page=N` (the PDF's page index, as viewers show it) to `source`.
- **Quote:** the short line or table row that shows the figure, copied verbatim, in `quote`.
- A company with no public filing (private, or a subsidiary that files nothing): set `"amount": null` and explain in `note`. Do not use an estimate.

Write your results to `qa/round3/revenue-<group>.json`, one object keyed by the supplier `name` exactly as in the work list:
```json
{
  "Tokyo Electron": {
    "amount": 2443533, "unit": "million", "currency": "JPY",
    "scope": "company", "basis": "Net sales, consolidated, J-GAAP",
    "fiscalYear": "FY2026", "fyStart": "2025-04", "fyEnd": "2026-03",
    "source": "https://…pdf#page=53", "quote": "Net sales 2,443,533",
    "note": ""
  }
}
```
`unit` is one of "one", "thousand", "million", "billion". `currency` is the ISO 4217 code of the filing (USD for firms that file in dollars, wherever they are). Keep the file valid JSON (`python3 -m json.tool`). Write a short notes file `qa/round3/<your slug>-notes.md` as you go. Do not edit `data/suppliers.json`; the main session merges.

## 2. The dollar conversion (rates agent and code)

- **Rates:** the US Federal Reserve's monthly average foreign exchange rates (releases G.5 and H.10, from the Board's Data Download Program on federalreserve.gov), for every month from January 2023 to the latest published month, for each currency the collectors need (JPY, CNY, TWD, KRW, EUR, GBP, CHF, SGD, HKD, THB, CAD, DKK and any other that turns up). Stored in `data/fx-rates.json` exactly as the Board publishes them, with each series' unit ("currency units per US dollar" or "US dollars per currency unit"), the series identifier and the download URL.
- **Conversion:** dollars = the filed amount divided by the average of the Board's monthly rates over the company's fiscal year (`fyStart` to `fyEnd`), or multiplied by it for currencies quoted in dollars per unit. This is the one computation on the page, approved by the owner, and the page names it. The build computes it (`build/fx.js`); no converted figure is typed into a data file.
- **Display:** "Revenue ¥2,443,533 million (FY2026, year to March 2026), about $16.4 billion" on the Suppliers row and the Index firm card; the converted figure to three significant figures, always with "about". Dollar filers show only their filed figure. The CSV export carries the filed amount, unit, currency, fiscal year, source and the converted figure with its rate basis. One note on the Suppliers page and in `data/suppliers-revenue-notes.md` explains the method in two plain sentences.
