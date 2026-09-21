# Dated figures: audit of market sizes, shares, counts and prices dated 2021 or earlier

Scope: chapter bodies and card fields in `content/01-*.md` to `content/17-*.md`, and the notes in `data/chokepoint-matrix.json`. Scan date 20 September 2026 (a script split every line into sentences and kept those that pair a year of 2021 or earlier with a dollar amount, a percentage, "billion" or "million", or the words share, units or per-wafer). A figure counts if its stated year is 2021 or earlier.

Status key: UPDATED (a newer figure for the same quantity exists within the source policy and has been swapped in, year and citation included); LEFT (no newer figure for that quantity within the policy; the sentence already states its year); PAIR (the old figure is one half of a then-and-now comparison and is the point of the sentence); METHOD (a matrix method note that names the 2019 baseline a derivation was moved on from; changing it would change the derivation).

## Inventory

| # | Chapter | Figure | Year | Source used | Newer figure within the policy? | Status |
|---|---|---|---|---|---|---|
| 1 | 06 Deposition and Etch | Physical vapor deposition market $2.4 billion | 2019 | CSET, The Semiconductor Supply Chain (2021), Table 11 | Yes: $4.9 billion in 2025, CSET Supply Chain Explorer node N42 (CSET analysis of TechInsights data, explorer updated 15 September 2026) | UPDATED |
| 2 | 06 Deposition and Etch | Plasma CVD market $3.5 billion | 2019 | CSET 2021, Table 11 (the 2019 row was plasma CVD only) | Yes: plasma CVD $7.5 billion in 2025 (node N38), inside an $11.2 billion CVD market (node N47). Sentence now gives both so the quantity stays the same | UPDATED |
| 3 | 06 Deposition and Etch | Atomic layer deposition market $1.6 billion, led by ASM International | 2019 | CSET 2021, Table 11 | Yes: $4.1 billion in 2025, ASM International 54.5 percent (node N41) | UPDATED |
| 4 | 06 Deposition and Etch | Conductor etch market $6.5 billion, led by Lam | 2019 | CSET 2021, Table 13 | Yes: $12.2 billion in 2025, Lam Research 51.2 percent (node N50) | UPDATED |
| 5 | 06 Deposition and Etch | Dielectric etch market $4.3 billion, led by Tokyo Electron | 2019 | CSET 2021, Table 13 | Yes: $8.7 billion in 2025, Tokyo Electron 55.9 percent (node N51) | UPDATED |
| 6 | 06 Deposition and Etch (key fact, body, matrix trends for deposition and etch rows) | China-based suppliers 2 percent of deposition and under 3 percent of etch in 2019, against 7 and 11 percent in 2024 | 2019 | CSET, Inside Beijing's Chipmaking Offensive (2026) | The 2019 figure is the baseline of the comparison | PAIR |
| 7 | 02 Silicon and Wafers (card chinaStatus, body) | China under 5 percent of the wafer market and under 1 percent of 300 mm | 2021 (2019 data) | CSET 2021 | No. METI's December 2025 deck (Fuji Keizai survey, 2021 and 2023) publishes country bars for silicon wafers, but only Japan's share is printed as a number (52 and 53 percent); the ETO explorer's wafer node N26 is still the 2019 split; SEMI's 2025 silicon wafer commentary says Chinese suppliers hold "a meaningful share" of 200 mm and are moving into 300 mm, with no number | LEFT |
| 8 | 02 Silicon and Wafers (body) | Chinese producers supply 12 percent of the wafers their own 300 mm fabs consume, 18 percent at 200 mm and below | 2021 (2019 data) | CSET 2021 | No newer figure found in any allowed source | LEFT |
| 9 | 02 Silicon and Wafers (key fact, body) | 300 mm wafers carry 99.7 percent of fab capacity at 45 nm and below | 2021 | CSET 2021 | No. SEMI's 300mm Fab Outlook press releases give 300 mm capacity by region (9.2 million wafers a month in 2025), not 300 mm's share of sub-45 nm capacity | LEFT |
| 10 | 02 Silicon and Wafers (body) | No major US-headquartered wafer producer | as of 2021 | CSET 2021 | Not a number; the sentence already pairs it with GlobalWafers' 2025 Sherman plant | LEFT |
| 11 | 02 Silicon and Wafers (body) | Last wafer size increase in 2002; lithography half the cost of a 300 mm wafer against a quarter of a 150 mm one | 2002 | CSET 2021 | Historical fact, no update needed | LEFT |
| 12 | 03 Chemicals, Gases and Photoresist (card chinaStatus, key fact, body, chapter close; also 17 Geopolitics and matrix photoresist note) | Japan about 90 percent of photoresist; China under 5 percent | 2021 (2019 data) | CSET 2021 | Already paired in the body and the chapter close with METI's 2023 figure (78 percent, China inside the small remainder). The card and key fact keep the CSET figure with "as of 2021" | PAIR |
| 13 | 03 Chemicals, Gases and Photoresist (body) | Five firms over 60 percent of wet chemicals | 2021 | CSET 2021 | No. SEMI's Bulk Wet Chemicals Report is paid; METI's deck gives only Japan's country share for individual chemicals (high-purity cleaning fluids 59 percent, isopropyl alcohol 55 percent in 2023), not a five-firm share | LEFT |
| 14 | 03 Chemicals, Gases and Photoresist (body) | DuPont and Cabot Microelectronics about 56 percent of a $790 million CMP slurry market | 2021 (2019 data) | CSET 2021 | No. Entegris' FY2024 and FY2025 10-Ks and DuPont's product pages claim leadership without a share or a market size; METI gives Japan's country share of CMP slurry (49 percent in 2021, 51 in 2023), a different quantity; the ETO explorer's CMP materials node N90 is still the 2019 figure | LEFT |
| 15 | 03 Chemicals, Gases and Photoresist (key fact) | Japan's 2019 licensing cut hydrogen fluoride exports to South Korea by 87.9 percent | 2019 | RIETI | An event figure, not a market size | LEFT |
| 16 | 07 Metrology and Inspection (card chinaStatus, body) | Chinese firms 3.4 percent of line-width measurement, 1.3 percent of defect inspection, none of mask or packaging inspection | 2019 | CSET 2021 | The 2019 figure is the baseline against 0.8 percent of process control in 2024 | PAIR |
| 17 | 07 Metrology and Inspection (key facts, body) | KLA's process control share up 360 basis points since 2021; 56.5 percent in 2024, up 2 points from 2021 | 2021 baseline | KLA shareholder letter and 2026 investor day | KLA's own baseline | PAIR |
| 18 | 11 Advanced Packaging (body) | JCET RMB 35.96 billion in 2024 | 2024 | JCET | Caught by the scan because of "21 percent"; current | n/a |
| 19 | 12 Substrates and PCBs (body) | Ajinomoto build-up film the reference since 1999 | 1999 | Ajinomoto | Historical fact | LEFT |
| 20 | 15 Data Centers and Power (key fact, body) | 82 percent of large power transformers put into US service in 2019 were imported; lead times under a year before the pandemic | 2019 | DOE Large Power Transformer Resilience Report (July 2024) | No. The 2024 DOE report is the newest federal statement and it uses 2019 as its import-share year | LEFT |
| 21 | 15 Data Centers and Power (key fact, body) | Strongest four-year electricity growth since 2000 | 2000 comparison | EIA (2026) | Current figure with a historical comparison | n/a |
| 22 | 17 Geopolitics (body) | Japan 76.7 percent of photoresist in 2021 and 78.4 in 2023; 52.4 percent of wafers against 53.0 | 2021 | METI, December 2025 | The 2021 figure is the baseline | PAIR |
| 23 | 17 Geopolitics (body) | Cumulative Chinese state funding since 2014 at $150 billion | since 2014 | CSIS | A cumulative figure, current source | n/a |
| 24 | Matrix, EDA row | 74 percent American and 20 percent European in 2019 (SIA/BCG 2021 report) against 68 and 25 in 2022 (2024 report) | 2019 | SIA/BCG | Already moved on to the 2024 report inside the same note | PAIR |
| 25 | Matrix, EDA and Core IP notes | CSET's 2019 EDA split (US 96 percent) and core IP split (US 52, GB 43, CN 2, TW 1 on $3.9bn), ETO nodes N84 and N85 | 2019 | CSET via ETO | ETO nodes N84 and N85 still carry 2019; the row's own 2025 estimate is derived from filed revenue | METHOD |
| 26 | Matrix, Silicon wafers note | CSET 2019 split JP 56, TW 16, DE 14, KR 10, CN 4 on a $10.9bn market (node N26); China under 5 percent, under 1 percent of 300 mm | 2019 | CSET via ETO | Node N26 still 2019 in the 15 September 2026 explorer; the row's shares are METI 2023 | METHOD |
| 27 | Matrix, Photoresist note | China under 5 percent of a $3.3bn market in 2019; Japan 90 percent on 2019 data | 2019 | CSET | Note already says the figure is on a narrower base and six years older than the METI 2023 shares it sits beside | METHOD |
| 28 | Matrix, Specialty gases method | $6bn electronic gases market in 2019, sourced by CSET to SEMI | 2019 | CSET via SEMI | Node N91 still 2019 in the explorer; SEMI's materials market report is paid | METHOD |
| 29 | Matrix, Photomasks method and note | Japan 53, US 40, TW 7 on a roughly $4bn market in 2019; captive shops 65 percent in 2017 | 2019, 2017 | CSET via ETO node N33 | Node N33 still 2019 in the explorer; the note already flags it as the oldest and weakest figure in the matrix, and says the market is now above $5bn without a citation (a separate gap) | METHOD |
| 30 | Matrix, trend fields (EDA, core IP, DUV, deposition, etch, mature logic, accelerators) | "since 2021", "from roughly 1 percent in 2019", "about 2 percent in 2019", "roughly 30 percent in 2021" | 2019, 2021 | various | Baselines of stated trends | PAIR |

## What was changed

`content/06-deposition-and-etch.md`, section "Variants and trade-offs":

- A lead sentence was added under "Deposition families" saying that the sizes and shares that follow are CSET's for 2025, built from TechInsights data, and giving the two parent markets: deposition tools $26.2 billion (node N36) and dry etch $21.9 billion (node N103). This carries the policy's "relayed" disclosure once for the whole list, the way chapter 07 does for process control.
- Rows 1 to 5 above: figure, year and citation replaced. The two "led by" claims now carry the leader's share, which the source publishes. No card field, key fact or matrix note carried these five figures, so nothing else changed. The `plain` field and the first How it works paragraph are byte-identical to before (checked by diff).

Register: plain words, "percent" in prose, "$" not "US$", no em dashes. `check-speak` reports no matches.

Citations added (all Tier A, host chipexplorer.eto.tech, already in `data/source-tiers.json`):

- https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N36
- https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N38
- https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N41
- https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N42
- https://chipexplorer.eto.tech/?parentNode=N35&selectedNode=N47
- https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N103
- https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N50
- https://chipexplorer.eto.tech/?parentNode=N46&selectedNode=N51

Each returns HTTP 200 and the deep link opens on the named node (checked in a browser for N42 and N50). The same figures are in the machine-readable copy at https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/inputs.csv and provision.csv, which the matrix already cites for its deposition and etch rows.

## What was searched and not found

- Silicon wafers, China's share and 300 mm share (rows 7 to 9): SEMI press releases and blog on the 2025 silicon wafer market and the 300mm Fab Outlook (capacity by region only); SIA; CSET and ETO (node N26 unchanged at 2019); METI's December 2025 deck (the chart is a stacked bar with Japan's number printed and the other countries unlabeled, so only Japan's share is citable, and the matrix already uses it).
- Wet chemicals concentration (row 13): SEMI (Bulk Wet Chemicals Report, paid), SIA, CSET, SEC filings. Nothing public gives a top-five share.
- CMP slurry market size and DuPont plus Cabot share (row 14): Entegris FY2024 and FY2025 10-Ks and 2025 annual report (leadership claims, no share or size), DuPont product pages, SEMI, METI (Japan's country share only), ETO node N90 (2019).
- Large power transformers (row 20): DOE's July 2024 report is the newest federal figure.

## Two things the author should know

1. Chapter 07 cited the same explorer URL (node N60) for 2024 figures that the link no longer shows since the explorer's 15 September 2026 update. At the coordinator's request it was moved to 2025; see "Chapter 07 follow-up" below.
2. `node build/harvest-bibliography.js --only=<substring>` rewrites `data/bibliography.json` with only the matching URLs (it collected 9 and wrote 9). Running it that way during this task emptied the file; it was restored from `dist/data/bibliography.json` and the full harvest was then run without `--only`, which rebuilt 711 entries from the cache (706 before, plus the 8 new explorer URLs and one eCFR URL that was cited but missing, minus four URLs no longer cited anywhere: two Epoch posts, the OpenAI charter and the EU AI Act). One existing entry gained a date (Panasonic Megtron page). The header of the script should say that `--only` is for listing, or the write should merge.

## Chapter 07 follow-up: Metrology and Inspection moved from 2024 to 2025

Requested after the first pass. Every value chapter 07 took from explorer node N60 (same URL, https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60, unchanged) now carries the 2025 data the link shows, read from the explorer's public CSVs (inputs.csv and provision.csv, "CSET analysis of TechInsights data (2025), published July 3, 2026") and checked against the live page. KLA's own 56.5 percent 2024 count from its March 2026 investor day is KLA's figure and stays as it was. The `plain` field and the first How it works paragraph are byte-identical (checked by diff). The matrix process control row already carried the 2025 data ($15.7bn) and needed no change; no other chapter or data file states the 2024 values.

| Where | 2024 (before) | 2025 (now) |
|---|---|---|
| Card costSignal, key fact, body ("Who makes it") | $13.4B market, KLA 57.2 percent | $15.7B market, KLA 56.8 percent |
| Card leaders | Applied Materials 10.5, Lasertec 7.7, ASML 5.2, Nova 3.7, Onto 3.0 | 11.2, 6.4, 5.9, 4.3, 2.6 |
| Card usStatus | American firms 72 percent, Japanese 15 | American 72 (71.7), Japanese 14 (14.1) |
| Card countries (CN), chinaStatus, substitutability, body ("China and the controls") | Chinese firms 0.8 percent in 2024 ("five years later" than 2019) | 0.7 percent in 2025 ("six years later") |
| Body, "Variants and trade-offs" lead | CSET's sizes and shares for 2024 | for 2025 |
| Defect inspection | $5.9B, KLA 84.6 percent | $6.7B, KLA 85.9 percent |
| Film and shape metrology | $2.3B; KLA 47, Nova 20.6, Onto 13.6 | $2.6B; KLA 45.6, Nova 24.6, Onto 10.9 |
| Mask inspection and repair | $2.1B; Lasertec 45.6 led, KLA 40.7, Zeiss 11 | $2.2B; KLA 45.9, Lasertec 42.0, Zeiss 10.1. KLA now leads, so the sentence no longer calls it the one family KLA does not lead |
| Overlay metrology | $907M; KLA 54.2, ASML 45.1 | $991M; KLA 51.5, ASML 47.9 |
| Critical dimension metrology | $870M; Hitachi 69, Applied 30 | $1.2B; Hitachi 71.9, Applied 27.5 |
| E-beam metrology | $770M; Applied 49.5, ASML 37.6, KLA 11.9 | $1.3B; Applied 45.1, ASML 35.6, KLA 18.8 |
| Figure pc-segments (title and data) | 2024 sizes | 2025: defect inspection 6,700; film and shape 2,600; mask inspection 2,200; e-beam 1,300; CD 1,200; overlay 991.4; defect review 729.1 ($M) |
| Figure pc-share (title and data) | 2024 shares, others 4.4 | KLA 56.8, Applied 11.2, Lasertec 6.4, Hitachi 6.2, ASML 5.9, Nova 4.3, Onto 2.6, Camtek 1.6, Rigaku 1.2, all others 3.8 |

After these edits: `build.js` disallowed 0 (chapter 07: 15 sources, 3 figures); `check-speak` no matches; `check-integrity` clean apart from the known "has no supplier entry" lines.

## Checks run after the edits

- `node build/harvest-bibliography.js` (full run): 711 urls, 709 verified, 2 unverified, 233 overrides.
- `node build/build.js`: source tiers A 335, B 22, disallowed 0, unclassified 0.
- `node build/audit-data-sources.js`: 0 disallowed in every data file.
- `node qa/scripts/check-speak.js`: no matches.
- `node qa/scripts/check-integrity.js`: clean apart from the known "has no supplier entry" lines.
- `qa/scripts/check-links.js` takes no list (it scans dist and data); the eight new URLs were probed by hand, all HTTP 200.

## Counts

- Figures dated 2021 or earlier found: 30 rows (some rows cover the same figure in several places).
- Updated: 5 (all in chapter 06), plus the chapter 07 follow-up, which moved 2024 values to 2025 on the coordinator's request (outside the 2021-or-earlier scope, so not counted here).
- Left with the year visible: 10 (rows 7 to 11, 13 to 15, 19, 20).
- Already a dated pair or a stated trend baseline: 7 (rows 6, 12, 16, 17, 22, 24, 30).
- Method notes naming a 2019 baseline: 5 (rows 25 to 29).
- Caught by the scan but current: 3 (rows 18, 21, 23).
