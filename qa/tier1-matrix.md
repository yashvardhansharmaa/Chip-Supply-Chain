# Tier 1 — the country-share matrix

10 September 2026, `data/chokepoint-matrix.json`. Every row gained `basis`, `sources`, `asOf`, `method`, `hhi` and `top2`; eight gained `relayedVia`. `source` is kept and holds `sources[0]`. Every URL in `sources` was read against the row it supports.

## What CSET's brief actually contains

Five rows cited it. Through ETO's provision table it gives EDA the US at 96 percent for 2019, core IP US 52 / GB 43, wafers JP 56, photomasks JP 53 / US 40 / TW 7; for photoresists and gases every share field is blank, because the paper split those by sub-category. Four citations were wrong; photomasks was right and pointed at a landing page.

**Photoresist and wafers, re-sourced.** METI's December 2025 strategy deck publishes Fuji Keizai's country shares for twenty-four front-end materials, 2021 and 2023. Photoresist becomes JP 78.4 / US 12.8 / KR 6.4 / Other 2.4; wafers JP 53 / TW 19 / KR 13 / DE 10 / Other 5, both `relayed` via Fuji Keizai. Japan's share is printed on each bar; the rest is measured off the chart's vector geometry, checked against every printed label. Neither shows a China column; China sits in Other.

**EDA and core IP keep their shares and become `estimate`.** SIA and BCG measure the two together, never apart: US 74 in 2019, 68 with Europe at 25 in 2022. Splitting that line rests on Synopsys's, Cadence's and Arm's filed segment revenue and on a German column Siemens does not disclose. **Specialty gases** stays an estimate: nothing splits the category by country, and METI's molecule shares, now cited, say it understates Japan and China.

## Nulls and stale dates

Six rows are `estimate`; the three with no shares have `basis`, `asOf`, `hhi` and `top2` null. ATP stays 2022: ETO, both SIA/BCG reports, the 2025 SIA Factbook and SEMI have nothing newer, and half the stage is captive, so OSAT filings cannot rebuild the denominator. Photomasks stays 2019. Both say so.

## Notes corrected

Arm's 48 points move from GB to JP under an ownership cut, not from Other. "Read Other in the metrology row as Israel" was stale; Israel has a column. Nvidia's data-centre revenue is $193.7bn, not "roughly $190bn". The packaging note now discloses that Epoch's CoWoS estimate rests on SemiWiki and TrendForce.

## For the front-end

The country panels flag "site estimate" by testing `/estimate/i` against `metric` plus `note`'s first 40 characters (`build/modules/summary-a.js`); that now catches only leading-edge logic and misses five estimates. Read `r.basis`: label `estimate` "site estimate", `relayed` "reported by <relayedVia>", `derived` "computed here", leave `measured` bare. Show `asOf`, not `year`, after each percentage, and flag rows three or more years stale (ATP 2022, photomasks 2019) as plainly. `hhi` and `top2` are ready for the concentration chart, and `method` fits a tooltip.

## Open items

Not mine: `build/modules/methods.js`'s data dictionary knows none of the six new fields, and chapter 3 still prints Japan at 90 percent of photoresist for 2021 against the matrix's 78.4 for 2023.

| Segment | basis | asOf | sources | What changed |
|---|---|---|---|---|
| EDA software | estimate | 2025 | 4 | Re-sourced to SIA/BCG 2021 and 2024 plus Synopsys and Cadence 10-Ks; note rewritten |
| Core IP | estimate | 2025 | 4 | Re-sourced to Arm 20-F, Synopsys, Cadence, ETO; GB/JP note error fixed |
| Silicon wafers | relayed | 2023 | 2 | New shares and year from METI/Fuji Keizai; note and trend rewritten |
| Photoresist | relayed | 2023 | 2 | New shares and year from METI/Fuji Keizai; note and trend rewritten |
| Specialty gases | estimate | 2024 | 2 | Marked estimate; METI molecule shares added as the check |
| EUV lithography tools | relayed | 2025 | 2 | ASML annual report added for the 48 systems |
| DUV lithography tools | derived | 2025 | 2 | Weighting stated; ASML unit and revenue figures added |
| Deposition tools | relayed | 2025 | 1 | Firm-level shares added to the note |
| Etch tools | relayed | 2025 | 2 | Firm-level shares added; CSIS cited |
| Metrology & inspection tools | relayed | 2025 | 1 | Firm-level shares added to the note |
| Photomasks | measured | 2019 | 2 | Source repointed to ETO's provision table, which carries the figure |
| Leading-edge logic (≤5 nm) | estimate | 2025 | 1 | Anchor moved into `method`; note trimmed |
| Mature logic (≥28 nm) | estimate | 2025 | 2 | Source repointed to SIA/BCG; CSIS second |
| DRAM manufacturing | relayed | 2025 | 1 | `relayedVia: IDC`; method split out of note |
| HBM | relayed | 2025 | 1 | `relayedVia: IDC`; method split out of note |
| Advanced packaging (2.5D/3D) | n/a | n/a | 2 | Epoch's reliance on SemiWiki and TrendForce disclosed |
| Assembly, test and packaging | measured | 2022 | 2 | 2022 flagged in `asOf` and note after a search for newer |
| IC substrates | n/a | n/a | 2 | Method split out; Ibiden figure marked as uncited |
| AI accelerator design | estimate | 2025 | 3 | Nvidia and Broadcom filings added; CSIS's TrendForce relay disclosed |
| Server assembly | n/a | n/a | 1 | Method split out of note |
