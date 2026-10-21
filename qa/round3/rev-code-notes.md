# rev-code notes (round three, SPEC section 2: wiring the filed revenue and the dollar conversion into the build and the pages)

Slug `rev-code`. Screenshots and the export check in `qa/round2/shots/rev-code/`. Scratch scripts in the session scratchpad only.

## What the build does now (build/build.js, block "supplier revenue", just before `suppliersData`)
- Loads `data/fx-rates.json` and `build/fx.js`. For every supplier with a `revenue` object it computes, in memory only:
  - `revenueUSD` (dollars, from `fx.toUSD`), `revenueUSDb` (the same in billions, to the nearest million; null when the currency or a month has no rate), `revenueUSDBasis` (fx.js's basis string: months, series, mean rate; "Filed in US dollars, no conversion" for dollar filers), and `revenueYear` from `fyEnd`.
  - `revenueShown`: `filed` ("¥2,443,533 million"), `year` ("year to March 2026", or "2025" for a December year), `about` (fx.label, non-dollar filers only), `href` (the filing), `amount` (the amount exactly as typed in suppliers.json, so "2054.0" keeps its zero; JSON.parse drops it), and `note` (the revenue note for the Index card, see below).
- No converted figure is written to any data file. `dist/data/suppliers.json` is still the plain copy of the data file, so it carries the earlier `revenueUSDb` values beside the new `revenue` objects (for example Tokyo Electron 15.9 there, 16.21 on the page). The main session may want to drop `revenueUSDb` from the data file once the owner approves.
- A supplier with no `revenue` object keeps its earlier `revenueUSDb` and shows it as before ("$X.XB (year)"); the build warns with their names. After the merge of the last 30, there are none.
- A revenue object whose conversion fails gets `revenueUSDb: null`, shows only its filed figure, and the build warns. None fail now (all 170 convert).
- The Suppliers method note is the first paragraph of `data/suppliers-revenue-notes.md`, rendered with `inline()` (a named link, so no citation numbering is touched), into `{{SUPPLIERS_REVENUE_NOTE}}` in `src/template.html`, under the ladder and table.

## Index card notes (coordinator request, 20 Oct)
Each `revenue.note` shows on the Index firm card after the revenue line, as "About the revenue figure." The build leaves out the sentences and clauses that speak to the editors (fetch problems such as "refused direct downloads from this machine", "WebFetch", "HTTP 403", scratch paths, "earlier agents", `revenueUSDb_now`, and comparisons with "the site figure"). Everything kept is word for word. 28 of 170 notes are shortened; none becomes empty. Examples:
- Nidec keeps its caution: "Caution: the auditor, PwC Japan, gave a disclaimer of opinion (意見不表明) on these consolidated statements (report p. 244), so the figure is as filed but unaudited in effect." It drops "The site's current dollar figure matches the prior year as first reported (...)".
- Shinko's note (unaudited release, a year older, delisted) is shown in full.
- Linde becomes "Whole Linde group." Merck KGaA keeps "Whole Merck KGaA group." and its Electronics segment sentence, without "if the row should show only the division the site describes".
- Arm keeps "The rendering also splits it into ..." although the sentence naming the rendering was dropped. Worth a hand edit.
For the owner: the notes were written as collectors' provenance. Even shortened, many read as filing references (EDINET codes, accession numbers, 当連結会計年度 column). A reader-facing note field, written for the page, would serve the Index card better. check-speak already flags 8 of these notes in data/suppliers.json (before and after this change).

## Display
- Suppliers row (ladder panel, `Suppliers.detail` in src/app.js) and Index firm card (src/modules/lookup.js) both print `Suppliers.revenueHTML`: the filed figure linked to the filing (with a screen-reader suffix ", opens the filing"), the year in parentheses, then ", about $16.2 billion" for non-dollar filers. The filed figure and the dollar figure never break inside (`.rev-filed`, `.rev-usd`).
- The table view never showed revenue and still does not (unchanged).
- The year follows the rev-japan instruction and the lead's brief: by `fyEnd` only. The SPEC example also prints the company's own label ("FY2026, year to March 2026"); the label stays in the export as `revenueFiscalYear`.
- Home page: the only revenue sentence in build/modules/summary-a.js (the "largest equipment vendor" number) now prints "about $36.9 billion" style text for a converted firm, or the filed figure for a dollar filer. That block (`SUMMARY_A`) has no placeholder in the template, so it is not on the site. The home map's country panels print no revenue.
- Static pages: `/suppliers/` (build/modules/social.js) is a forwarding page with one paragraph and no rows, so it has nothing to change.

## CSV (Copy table)
Existing 16 columns unchanged and first, then `revenueAmount` (as filed, without commas), `revenueUnit`, `revenueCurrency`, `revenueFiscalYear`, `revenueFyEnd`, `revenueSource`, `revenueUSD` (whole dollars) and `revenueUSDBasis`. `revenueUSDb` and `revenueYear` now carry the converted figure and the fyEnd year. Captured export: `qa/round2/shots/rev-code/suppliers-export.tsv` (226 rows).

## Rows on old figures
None. All 170 suppliers with revenue have a `revenue` object and all convert. 56 suppliers have no revenue at all (unchanged).

## Values checked
- Tokyo Electron: ¥2,443,533 million (year to March 2026), about $16.2 billion; revenueUSD 16,210,279,905; mean 150.7397 JPY per USD.
- Naura Technology: CN¥39,353,112,419.78 (2025), about $5.48 billion.
- Micron Technology: $133,188 million (year to August 2026).
- TSMC: NT$3,809,054,272 thousand (2025), about $122 billion (the brief's example read 3,809,054,315; the data file has 3809054272).
- Ultra Clean Holdings: $2,054.0 million (2025), trailing zero kept.
