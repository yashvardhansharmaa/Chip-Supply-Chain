# Expert review: China-exposure data (20 October 2026)

Reviewer slug `expert-exposure`. Files edited (Edit tool only): `data/exposure.json`, `data/exposure-notes.md`. No code edited. Downloads in `qa/round2/scratch/expert-exposure/`, screenshots in `qa/round2/shots/expert-exposure/`, working notes in `qa/round2/expert-exposure-notes.md`.

## Scope and method
- `git diff`: this round added 17 rows (TSMC x5, Disco x6, Hoya x6) and changed no existing row.
- Every one of the 125 rows was checked against its cited document, not only two per firm: both amounts, unit, currency, `fiscalYear`/`fyEnd`, the share's arithmetic (exact decimal, round half up), the `basis` wording and what "China" includes. All 32 SEC R pages, the TSMC/ASML/Nvidia/Synopsys/Micron and other main 10-K/20-F texts, the Disco 決算短信, Hoya IFRS reports, Besi annual reports, Advantest IAR and slides, SCREEN 有価証券報告書, TEL statements, Samsung statements (2021 to 2025) and the SK hynix DART notes were downloaded and read.
- File after edits: 126 rows, 24 firms; `json.tool` passes; the file still equals `json.dumps(indent=2, ensure_ascii=False)` plus newline; key order unchanged.

## The 17 new rows (TSMC, Disco, Hoya)
All 34 amounts match the filings to the digit. TSMC: 2023 20-F R120 (2021, 2022) and 2025 20-F R123 (2023 to 2025), NT$ millions to one decimal. Disco: fr20220421 pp.12/13, fr20240425 p.14, fr20260422 p.12 (単一セグメント, 百万円未満切捨て, basis "売上高は顧客の所在地を基礎とし"). Hoya: note 5(4) on p.33/34 of the four reports, total equals the income-statement "Sales" line. Labels FY and `fyEnd` correct; Disco's and Hoya's own labels in the notes are correct (Disco English release: "FY2025 (April 1, 2025 - March 31, 2026)"). None of the three filings mentions Hong Kong in the revenue note.
- One fix: TSMC basis said "by the country of the customer's headquarters"; the 20-F says "mainly based on the countries where the customers are headquartered". Added "mainly".

## Changes to data/exposure.json

| Where | Before | After | Why / source |
|---|---|---|---|
| Camtek FY2022 | 142.0 / 320.9, share 44.3 | 141.959 / 320.909, share **44.2** | 20-F 2023 R90: China $141,959k of $320,909k = 44.24%. The rounded amounts had produced 44.3. |
| Besi FY2022 | 187.6 / 722.9, share 26.0 | 187.572 / 722.87, share **25.9** | AR2023 p.169 "(€ thousands) China 187,572 ... Total revenue 722,870" = 25.948%. |
| Synopsys FY2022 | 795.4 / 5081.5 (FY2022 10-K, with Software Integrity), 15.7 | 774.265 / 4615.714, **16.8**, source FY2024 10-K R117 | The FY2023 to FY2025 rows already exclude the divested Software Integrity business (discontinued operations); FY2022 mixed bases and reversed the trend. Now uses the latest filing, as the file does for Nvidia; note records the first-filed $795.405m of $5,081.542m (15.7%). |
| 50 rows filed in thousands (Besi, Cadence, Camtek, Entegris FY2021-23, KLA, Lam, Nova totals, Onto, Synopsys, Teradyne, Veeco) | amounts rounded to 0.1m (e.g. Cadence 378.2) | every filed digit kept, in millions (378.16 = $378,160k) | RULES: never round. Cross-checked by script against the R pages: 0 differences. Only the two shares above changed. |
| Micron FY2026 (new row) | none | 8,338 / 133,188 USD million, 6.3%, fyEnd 2026-09, source FY2026 10-K R85 | 10-K filed 9 Oct 2026: "Mainland China (excluding Hong Kong) 8,338 ... $133,188"; 53-week year to 3 Sep 2026; Hong Kong $6,289m in note. FY2024/25 figures unchanged in it. |
| `basis`, 17 firms (87 rows) | no statement on Hong Kong | "The filing does not say whether Hong Kong is counted in China." | Brief: every basis must say what China includes. Each filing searched; none says. |
| Samsung basis (5) | "Regional information ... Management Committee." | adds "by the region of Samsung's own operating units. Samsung's list of subsidiaries puts its Hong Kong and Taiwan sales subsidiaries in the China region." | Subsidiary lists (2021 p.22, 2023 p.22, 2025 p.23) put SEHK and SET under "China". The old wording made the table say "counted by customer location". |
| Camtek basis | "based on the customer's location" | "based on the destination of the shipment" | 20-F: "based upon the destination of shipment of products and related services". |
| Entegris / Onto / Veeco / Nova basis | no basis stated | ship-to (Entegris: "ship to location of the customer"); ship-to (Onto: "location to which the product is shipped"); customer's facility (Veeco: "location in which the customer facility is located"); customer's location (Nova: "geographic location of the customer") | Each 10-K/20-F note. |
| PDF sources (25 rows: Advantest, Besi, SCREEN, TEL, Samsung) | no page | `#page=` of the regional table | SCHEMA §2; pages verified (e.g. TEL FY2026 p.53, SCREEN 2540 p.118/119). |
| Samsung FY2022 note | "That column restates the 2022 figures on the current basis ... are the filing." | "...which repeats the figures in the 2022 statements. Samsung does not file with the SEC. The source is the English version of its audited statements..." | 2022 statements p.88 give the same 35,625,769 / 302,231,360. Nothing was restated. FY2024 note aligned the same way. |
| SCREEN FY2021 note | "SPE is about four fifths of it" | "In the year to March 2021 the semiconductor equipment segment (SPE) had 235,497m yen of the 320,322m yen." | 第81期 p.106. SPE was 73.5% that year. Replaces an approximation with filed figures. |
| Micron notes FY2021-25 | "...Mainland China plus Hong Kong was 18.2% of revenue." | "Micron reports Hong Kong separately, at $2,582m." (and so on) | A second computation (sum of two lines), outside the one-computation convention. |
| Nvidia notes FY2024-26 | "restated"; "H20 license freeze and China's own procurement restrictions" | "recast"; "followed the US license requirement for the H20 chip in April 2025, and Nvidia says the Chinese government discouraged customers from buying its data center products" | 10-K: "Prior period information has been recast"; "The Chinese government has ... discouraged customers from purchasing ... our data center products". "Restated" implies an error correction. |
| Synopsys notes FY2021, FY2024, FY2025 | BIS "suspended export licenses"; break undisclosed | FY2021 includes Software Integrity; FY2024 was a 53-week year to 2 Nov 2024; BIS "required a license ... rescinded the requirement in July 2025" | FY2025 10-K: "is-informed letter ... imposing a license requirement ... rescinded on July 2, 2025". |
| Cadence FY2025 note | "pleaded guilty ... paid $140m" | "agreed in July 2025 to plead guilty ... paid $140.6m in penalties and forfeitures" | FY2025 10-K: "aggregate net penalties and forfeitures of $140.6 million". |
| Veeco FY2025 note | "agreed in 2026 to merge" | "agreed in September 2025" | 10-K: "On September 30, 2025, we entered into an Agreement and Plan of Merger". |

## Changes to data/exposure-notes.md
Nvidia "restated" to "recast" and the Q3 FY2026 switch; Micron "has always used it" to "uses it in every year in this file"; new Synopsys recast sentence; SK hynix rounded trillions to filed millions and "fell eleven points" to "from 30.9 percent to 19.7 percent"; "Two firms file with no US regulator" (wrong: TEL, SCREEN, Advantest, Disco, Hoya, Besi do not either) replaced with the Samsung paragraph and its Hong Kong/Taiwan point; new paragraph on full-precision amounts; Hoya total revenue also adds share of profit of associates; fiscal calendar adds Micron FY2026 and Synopsys FY2024; "Advantest FY2021 and FY2022" heading relabeled; Nova "good to one significant figure" to "precise only to the whole percentage point"; Applied/Micron FY2026 paragraph updated; one semicolon removed. Lasertec and AGC paragraphs verified (EDINET pp.74/88, AGC pp.51/31).

## Labels on the site
Screenshots of all 24 `#/exposure/<slug>` views (`<slug>.png`) and after the build (`after-micron.png`, `after-micron-mobile.png`, `after-synopsys.png`). Every caption, bar label and peak year matched its rows. After the build: Micron "China 6.3% of revenue, year to Sep 2026"; Synopsys peak "17% in year to Oct 2022"; card and supplier labels match the latest rows.

## Code proposals (not applied)
1. `src/app.js` chart tooltip: `cur.replace(/\s*million\s*/i,'')` plus a hard-coded "m" prints Advantest as "JPY billion 157.1m of 486.5m". Read the unit from `d.cur` (`/billion/i` gives "bn") and drop it from the prefix.
2. Nova shows false precision ("China 33.0% of revenue"; table "33.0%"). In `build/exposure.js` `label()`, the `short` in `build/build.js` (line ~785) and the table cell in `src/app.js`, print `Math.round(share) + '%'` when `chinaRevenue == null`.
3. `money()`/`unit()` in `exposureViz` are unused; remove.

## Links
All 59 exposure entries in `links.json` are kind ok; the 403s were re-fetched with the research User-Agent (200). The two new SEC URLs return 200. Broken links fixed: 0.

## For the owner
1. Rounding: amounts now keep every filed digit in millions (378.16). If you prefer the filing's own unit ("USD thousand", 378160), apply code proposal 1 first, or the tooltip will append "m".
2. Synopsys FY2022 now uses the recast (ex-Software Integrity) figure, following the Nvidia practice. Confirm.
3. Micron FY2026 added (126 rows). Confirm.
4. Micron's combined China-plus-Hong Kong shares were removed under the one-computation rule. Restore them only if that rule allows a sum.
5. Samsung's Hong Kong/Taiwan point rests on the subsidiary list; the segment note does not define regions.
6. Not re-checked: the ASM International paragraph, Advantest's "reconcile to the audited note" claim, SCREEN's "English materials give only percentages". Axcelis's FY2025 10-K was checked: no China figure, so the panel note stands.

## Checks (one run, after all edits)
`node build/build.js` exit 0; check-speak: no matches; check-integrity exit 0 (only the known "exposure row for Veeco Instruments has no supplier entry"); check-sources: 2516 citations, all tier A or B.

## New bibliography entries
```json
{
  "https://www.sec.gov/Archives/edgar/data/883241/000088324124000024/R117.htm": {"title": "SYNOPSYS INC, Form 10-K annual report for the period ended 2024-10-31 (financial statement R117)", "publisher": "U.S. Securities and Exchange Commission (filing by SYNOPSYS INC)", "date": "2024-12-19", "type": "filing", "accessed": "2026-10-20"},
  "https://www.sec.gov/Archives/edgar/data/723125/000072312526000023/R85.htm": {"title": "MICRON TECHNOLOGY INC, Form 10-K annual report for the period ended 2026-09-03 (financial statement R85)", "publisher": "U.S. Securities and Exchange Commission (filing by MICRON TECHNOLOGY INC)", "date": "2026-10-09", "type": "filing", "accessed": "2026-10-20"}
}
```
