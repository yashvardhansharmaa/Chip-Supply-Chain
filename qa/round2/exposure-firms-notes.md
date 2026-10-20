# exposure-firms: progress notes (round 2, 20 October 2026)

Task: add TSMC, Lasertec, Disco, Hoya and AGC to data/exposure.json from their own filings; correct wording that overstates the panel's coverage.

## Conventions read
- exposure.json: indent 2, trailing newline, rows sorted by firm name in plain code-point order (AMD, ASML, Advantest, ...).
- Yen rows: Tokyo Electron and SCREEN in `JPY million`, Advantest in `JPY billion`. Won rows in `KRW million`.
- fiscalYear: label by the calendar year in which the year ends (Advantest's year to March 2026 is FY2026, with a note giving Advantest's own label).
- check-integrity: share must be within 0.15 of chinaRevenue / totalRevenue x 100; flags exposure firms whose name is not a supplier name (Disco and AGC will be flagged, since suppliers.json uses "Disco Corporation" and "AGC Inc."; build/exposure.js already aliases both).
- Chart category order (build.js CAT_ORDER): Lithography, Deposition, Etch, Process Control, Metrology, Test, Assembly, Materials, Memory, AI Accelerator Vendor, EDA; anything else sorts last.
- suppliers.json categories: TSMC Foundry; Lasertec Metrology & Inspection; Disco Corporation Advanced Packaging & OSAT; Hoya Photomasks; AGC Inc. Photomasks.

## Research log

### TSMC (found, 20 Oct)
- Source: Form 20-F on EDGAR (CIK 1046179). Audited note "Net Revenue", disaggregation by geography, NT$ in millions to one decimal. XBRL Details pages:
  - FY2025 20-F (acc. 0001628280-26-025362, filed 2026-04-16): R123.htm, years 2023-2025.
  - FY2023 20-F (acc. 0001193125-24-099840, filed 2024-04-18): R120.htm, years 2021-2023.
  - Cross-checked: FY2024 20-F R122 (2022-2024), FY2022 20-F R120 (2020-2022), FY2021 20-F R123 (2019-2021) give the same China and total figures for every overlapping year. No restatement.
- China / total (NT$ million): 2021 164,552.1 / 1,587,415.0; 2022 245,168.8 / 2,263,891.3; 2023 267,154.1 / 2,161,735.8; 2024 331,673.3 / 2,894,307.7; 2025 327,502.8 / 3,809,054.3.
- Basis, audited note (same sentence in every 20-F 2021-2025): "The Company categorized the net revenue mainly based on the countries where the customers are headquartered."
- Item 4 of the 2025 20-F adds: headquarters basis "may be different from the countries to which we actually sell or ship our products or different from where products are actually ordered."
- Hong Kong: not mentioned in the revenue note or Item 4; the filing does not say where a Hong Kong-headquartered customer is counted.
- investor.tsmc.com returns 403 to scripted requests; not bypassed. SEC filing used instead.

### Disco (found, 20 Oct)
- English earnings releases (e.g. eg/ir/library/doc/fr/fr20260422.pdf, 8 pages) leave out the segment and regional notes. The Japanese 決算短信 carries them: セグメント情報等の注記 > 関連情報 > ２．地域ごとの情報 (1) 売上高, 単位：百万円, columns 日本 中国 韓国 台湾 アジア 米州 欧州 合計.
- Basis note in every year: "売上高は顧客の所在地を基礎とし、国又は地域に分類しております。" (customer location). Hong Kong: not mentioned; アジア is a separate column; the filing does not say where Hong Kong sits.
- Disco has one segment; 合計 equals consolidated net sales (e.g. 436,889 for the year to March 2026, same as the income statement).
- Disco's own label: year to March 2026 = "FY2025" (English release: "Consolidated results of FY2025 (April 1, 2025 - March 31, 2026)").
- Figures (JPY million), China / total, with the file and PDF page:
  - yr to 2021-03: 57,138 / 182,857 (jp fr20220421.pdf p.12; also fr20210422 p.12, same)
  - yr to 2022-03: 94,446 / 253,781 (fr20220421 p.13; also fr20230420 p.13 prior-year column, same)
  - yr to 2023-03: 88,833 / 284,135 (fr20240425 p.14; also fr20230420 p.13, same)
  - yr to 2024-03: 110,545 / 307,554 (fr20240425 p.14; also fr20250417 p.13, same)
  - yr to 2025-03: 125,375 / 393,313 (fr20260422 p.12; also fr20250417 p.13, same)
  - yr to 2026-03: 134,975 / 436,889 (fr20260422 p.12)
- No restatement: every prior-year column matches the year's own release.

### Lasertec (no China line: not added, 20 Oct)
- Lasertec's yuho note 2．地域ごとの情報 (1) 売上高 (単位：百万円) has six columns: 日本, 韓国, 台湾, その他アジア, 米国, 欧州. No China column.
  - 第64期 yuho (year to June 2026, filed 2026-09-24, EDINET S100Z32V), linked from lasertec.co.jp/ir/data/securities.html and served at https://ssl4.eir-parts.net/doc/6920/yuho_pdf/S100Z32V/00.pdf : PDF pages 87 (year to June 2025: 20,687 / 53,645 / 65,268 / 23,615 / 67,938 / 20,320 = 251,477) and 88 (year to June 2026: 28,127 / 66,075 / 45,854 / 31,056 / 51,610 / 7,759 = 230,485).
  - 第62期 yuho (year to June 2024, filed 2024-09-27, EDINET S100UFKD): same six columns for the years to June 2023 (152,832 total) and June 2024 (213,506 total).
  - Lasertec's Financial Highlights workbook (English IR page, https://ssl4.eir-parts.net/doc/6920/ir_material_for_fiscal_ym9/209785/00.xlsx), sheet Yearly, "SALES BY REGION": Japan, Korea, Taiwan, Asia (その他アジア), North America (米国), Europe for FY2019 to FY2026. No China line in any year.
  - The 決算短信 for the year to June 2026 (tdnet/2865486) repeats the six-way split in its revenue-disaggregation note.
- Basis note: "売上高は顧客の所在地を基礎とし、国又は地域に分類しております。" (customer location).
- Lasertec's own documents are hosted on ssl4.eir-parts.net (Pronexus's IR hosting) and linked from lasertec.co.jp; that host is not in data/source-tiers.json.

### Hoya (found, 20 Oct)
- Source: Hoya's English "Consolidated Financial Statements under IFRS(s) and Independent Auditor's Report", on hoya.com (English IR library, past materials at hoya.com/en/investor/ifrs/). Note 5 Operating segment information, (4) Information about geographical areas, "Revenue from external customers", millions of yen. Note under the table: "Geographical areas are based on the location of the customers."
- Lines shown: Japan, U.S.A., Singapore, China, South Korea or Taiwan, Others. Hong Kong is not mentioned.
- Total = "Revenue from external customers" = the income statement's "Sales" line. The income statement also has a larger "Total revenue" line that adds finance income, share of profit of associates and other income (995,844 for the year to March 2026). The panel uses Sales.
- Hoya's own label: "FY26 Q1 Earnings Presentation, July 31, 2026" (quarter to June 2026), so FY25 = year to March 2026.
- China / total (JPY million), file, PDF page:
  - yr to 2021-03: 47,804 / 547,921: IFRS Report(2021) (2022/06/IFRS-REPORT_FY2021.pdf) p.33 prior-year column; same in IFRS Report(2020) (2022/03/12-4.pdf) p.33.
  - yr to 2022-03: 62,825 / 661,466: IFRS-REPORT_FY2021.pdf p.33; same in FY22_EnFS.pdf p.34.
  - yr to 2023-03: 72,246 / 723,582: FY22_EnFS.pdf (2023/07) p.34; same in the 2024/07 Annual-Report-Final.pdf p.34 (scanned image PDF, read visually).
  - yr to 2024-03: 78,303 / 762,610: 2025/07/Annual-Report-Final-3.pdf p.34 prior-year column; same in 2024/07 Annual-Report-Final.pdf p.34 (scanned).
  - yr to 2025-03: 80,644 / 866,032: 2026/07/Annual-Report-Final.pdf p.34; same in 2025/07/Annual-Report-Final-3.pdf p.34.
  - yr to 2026-03: 93,906 / 947,749: 2026/07/Annual-Report-Final.pdf p.34.
- No restatement across the six documents. The 2026/07/Annual-Report-Final-1.pdf on the Japanese library page is byte-identical to Annual-Report-Final.pdf.
- Segment context: Information Technology (mask blanks, HDD glass, imaging) had 354,751m yen of 947,749m yen external revenue in the year to March 2026; Life Care 590,680m yen.

### AGC (no China line: not added, 20 Oct)
- AGC's English Financial Review (audited IFRS statements with the independent auditor's report), https://www.agc.com/en/ir/library/financial/pdf/financial2025e.pdf (97 pages), note 4 (4) Geographical segments, PDF p.51: "The analysis of sales by geographical area" gives Japan, Asia, America(s) and Europe only. FY2024 / FY2025 (millions of yen): Japan 649,856 / 652,144; Asia 668,218 / 646,856; America 256,889 / 244,006; Europe 492,639 / 515,825; total 2,067,603 / 2,058,832.
- Note under the table: "Sales are based on the location of each company, and "Brazil" is included in "Americas."" So the split is by the selling group company, and no China line exists.
- Same four regions, same note, in Financial Review 2021 (FY2020-FY2021), 2022, 2023 and 2024 editions (financial2021e.pdf to financial2024e.pdf at the same path).
- The revenue-disaggregation note (note on revenue, ii) uses Japan/Asia combined, America, Europe.
- AGC Data Book (reference.pdf) has no sales-by-country table.
- The Financial Review carries the consolidated IFRS statements with the independent auditor's report (2025 edition, report dated March 24, 2026). The Japanese yuho on EDINET was not checked (document ID not found).

## Rows written (20 Oct)
- data/exposure.json: 17 rows added with Edit (Disco x6 after Camtek, Hoya x6 after Entegris, TSMC x5 after Synopsys). 125 rows, 24 firms. json.tool passes; file still equals json.dumps(indent=2, ensure_ascii=False) + newline, so formatting is unchanged.
- Categories: TSMC "Foundry" (new to exposure.json), Hoya "Photomasks" (new), Disco "Advanced Packaging & OSAT" (existing, Besi's). All three match suppliers.json.

## Rows added to data/exposure.json (17)

Share = chinaRevenue / totalRevenue x 100, one decimal. Every amount was re-read from the cited page after writing (script check: both numbers present on the cited page or R page).

| Firm | Year (fyEnd) | China | Total | Unit | Share | Source |
|---|---|---|---|---|---|---|
| TSMC | FY2021 (2021-12) | 164,552.1 | 1,587,415.0 | TWD million | 10.4 | 2023 20-F R120 |
| TSMC | FY2022 (2022-12) | 245,168.8 | 2,263,891.3 | TWD million | 10.8 | 2023 20-F R120 |
| TSMC | FY2023 (2023-12) | 267,154.1 | 2,161,735.8 | TWD million | 12.4 | 2025 20-F R123 |
| TSMC | FY2024 (2024-12) | 331,673.3 | 2,894,307.7 | TWD million | 11.5 | 2025 20-F R123 |
| TSMC | FY2025 (2025-12) | 327,502.8 | 3,809,054.3 | TWD million | 8.6 | 2025 20-F R123 |
| Disco | FY2021 (2021-03) | 57,138 | 182,857 | JPY million | 31.2 | fr20220421.pdf p.12 |
| Disco | FY2022 (2022-03) | 94,446 | 253,781 | JPY million | 37.2 | fr20220421.pdf p.13 |
| Disco | FY2023 (2023-03) | 88,833 | 284,135 | JPY million | 31.3 | fr20240425.pdf p.14 |
| Disco | FY2024 (2024-03) | 110,545 | 307,554 | JPY million | 35.9 | fr20240425.pdf p.14 |
| Disco | FY2025 (2025-03) | 125,375 | 393,313 | JPY million | 31.9 | fr20260422.pdf p.12 |
| Disco | FY2026 (2026-03) | 134,975 | 436,889 | JPY million | 30.9 | fr20260422.pdf p.12 |
| Hoya | FY2021 (2021-03) | 47,804 | 547,921 | JPY million | 8.7 | IFRS-REPORT_FY2021.pdf p.33 |
| Hoya | FY2022 (2022-03) | 62,825 | 661,466 | JPY million | 9.5 | IFRS-REPORT_FY2021.pdf p.33 |
| Hoya | FY2023 (2023-03) | 72,246 | 723,582 | JPY million | 10.0 | FY22_EnFS.pdf p.34 |
| Hoya | FY2024 (2024-03) | 78,303 | 762,610 | JPY million | 10.3 | 2025/07 Annual-Report-Final-3.pdf p.34 |
| Hoya | FY2025 (2025-03) | 80,644 | 866,032 | JPY million | 9.3 | 2026/07 Annual-Report-Final.pdf p.34 |
| Hoya | FY2026 (2026-03) | 93,906 | 947,749 | JPY million | 9.9 | 2026/07 Annual-Report-Final.pdf p.34 |

Quotes: TSMC (audited revenue note, every 20-F 2021-2025): "The Company categorized the net revenue mainly based on the countries where the customers are headquartered." Disco (地域ごとの情報 note): "売上高は顧客の所在地を基礎とし、国又は地域に分類しております。" Hoya (note 5(4)): "Geographical areas are based on the location of the customers."

Hong Kong: none of the three filings says where Hong Kong is counted. TSMC's lines are Taiwan, United States, China, Japan, EMEA, Others. Disco's are Japan, China, Korea, Taiwan, other Asia, Americas, Europe. Hoya's are Japan, U.S.A., Singapore, China, South Korea (or Taiwan), Others. Each row's basis says the filing does not say.

## Firms not added
- Lasertec: six regions (Japan, Korea, Taiwan, other Asia, US, Europe), no China line, FY2019-FY2026. Paragraph added under "Firms not covered, and why".
- AGC: four regions (Japan, Asia, Americas, Europe) by location of the selling group company, FY2020-FY2025. Paragraph added under "Firms not covered, and why".

## Wording changes (all with Edit)
1. build/build.js, EXPOSURE_NOTE string only (now a template literal so the firm count follows the data; renders "24").
   - Before: "Each share is computed from the revenue amounts the firm filed. Firms count China differently: where the goods ship, where they are billed, or where the customer is based. Fiscal years are labeled by the calendar year in which they end."
   - After: "The charts cover 24 firms, each of which gives a figure for China in its own filings. Other firms are not shown, and some, such as Lasertec, AGC and Axcelis, give no China figure. Each share is computed from the revenue amounts the firm filed, except Nova's, which its filings give only as a rounded percentage. Firms count China differently, for example by where the goods ship, where they are billed, or where the customer is based. Fiscal years are labeled by the calendar year in which they end."
2. data/exposure-notes.md, ship-to paragraph.
   - Before: "Every equipment and materials vendor here uses it except Besi."
   - After: "Every equipment and materials vendor here uses it or counts by the customer's location, except Besi."
   - Why: Disco and Hoya say only "customer's location"; the old sentence would have called them ship-to.
3. data/exposure-notes.md, fiscal-year paragraph.
   - Before: "`fiscalYear` uses each company's own label; `fyEnd` gives the month the year closed. The labels collide. Tokyo Electron and SCREEN call the year ended March 2026 FY2026; Advantest calls the same twelve months FY2025."
   - After: "`fiscalYear` names each year by the calendar year in which it ends, and `fyEnd` gives the month the year closed. Company labels collide. Tokyo Electron and SCREEN call the year ended March 2026 FY2026, and Advantest, Disco and Hoya call the same twelve months FY2025. This file labels it FY2026 for all five, and the notes on the Advantest, Disco and Hoya rows give each firm's own label."
4. data/exposure-notes.md, new section "## TSMC, Disco and Hoya" (three paragraphs) after the chinaShare paragraph, and new **Lasertec.** and **AGC.** paragraphs after **ASM International.**

Searched with no overstatement found: src/template.html (heading "China share of revenue, from company filings", tab "China revenue share"), data/glossary.json, content/*.md, data/chokepoint-matrix-notes.md, data/landscape-notes.md, data/control-thresholds-notes.md.

## Overstatements outside my files (not edited)
- build/build.js `CONTROLS_DEK`: "Every rule since 2018, what can still be sold to China, and each firm's China sales." (the dek above the panel; the equity review's item 5). Suggest: "Every rule since 2018, what can still be sold to China, and China's share of revenue at 24 firms, from their filings."
- build/modules/social.js line 124, social card line for Export Controls: same sentence.
- build/modules/walk.js line 92: "Every US and allied rule since 2018, what can still be sold to China, and how much each company sells there." Suggest ending "...and China's share of revenue at 24 firms, from their filings."

## Pre-existing points in exposure-notes.md, left alone
- "Two firms file with no US regulator." Tokyo Electron, SCREEN, Advantest, Disco and Hoya file with none either, and the same note says SK hynix filed a Form 424B4 with the SEC in July 2026.
- "**Advantest FY2021 and FY2022.** ... The FY2023 to FY2025 rows" uses Advantest's own labels. The rows are FY2024 to FY2026 in the file.
- The ship-to sentence still covers Entegris, Onto, Veeco and Nova, whose basis text in the file names no basis. Not re-checked.

## For the chart and card code (other owners)
- New categories: "Foundry" (TSMC) and "Photomasks" (Hoya). Disco uses the existing "Advanced Packaging & OSAT". The current CAT_ORDER in build.js already contains 'Packaging', 'Photomask' and 'Foundry', and the built page shows each category once.
- Currency "TWD million" is new. build.js `unit()` has no TWD case and falls back to "TWD ...m"; the app.js tooltip prints "TWD 327,502.8m of 3,809,054.3m". Both readable.
- Hoya's share is group-wide (Life Care is most of revenue). Card leader lines now show "China 9.9% of revenue, year to Mar 2026" under Hoya on the Photomasks card.
- The chart rounds 11.5 to 12, so TSMC FY2023 (12.4) and FY2024 (11.5) both print "12%". The table shows 12.4% and 11.5%.

## Checks (20 Oct, after the last edit)
- python3 -m json.tool data/exposure.json: OK. File equals json.dumps(indent=2, ensure_ascii=False) + "\n".
- node --check build/build.js: OK. node build/build.js: exit 0, "exposure: 125".
- check-integrity: exit 0. Only exposure line: "exposure row for Veeco Instruments has no supplier entry" (known). No share mismatch. The other lines are card warnings from other agents' work.
- check-sources: "2322 citations, all tier A or B".
- check-speak: first run exit 1, 51 matches, all "[rhetorical question]" under "Questions for discussion" (another agent's work), none from this task. Final run: "check-speak: no matches".
- Final run also: check-integrity exit 0 (only the known Veeco line), check-sources "2379 citations, all tier A or B", build renders "The charts cover 24 firms".

## Screenshots (qa/round2/shots/exposure-firms/)
- exposure-desktop-full.png, exposure-desktop-dark-full.png, exposure-desktop-table.png (table opened)
- exposure-mobile-full.png, exposure-mobile-disco.png, exposure-mobile-hoya.png, exposure-mobile-tsmc.png, exposure-mobile-dark-hoya.png

## New bibliography entries
```json
{
  "https://www.sec.gov/Archives/edgar/data/1046179/000119312524099840/R120.htm": {"title": "TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD, Form 20-F annual report for the period ended 2023-12-31 (financial statement R120)", "publisher": "U.S. Securities and Exchange Commission (filing by TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD)", "date": "2024-04-18", "type": "filing", "accessed": "2026-10-20"},
  "https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/R123.htm": {"title": "TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD, Form 20-F annual report for the period ended 2025-12-31 (financial statement R123)", "publisher": "U.S. Securities and Exchange Commission (filing by TAIWAN SEMICONDUCTOR MANUFACTURING CO LTD)", "date": "2026-04-16", "type": "filing", "accessed": "2026-10-20"},
  "https://www.disco.co.jp/jp/ir/library/doc/fr/fr20220421.pdf": {"title": "DISCO, 2022年3月期 決算短信〔日本基準〕（連結） (consolidated earnings release, year ended March 2022)", "publisher": "DISCO Corporation", "date": "2022-04-21", "type": "filing", "accessed": "2026-10-20"},
  "https://www.disco.co.jp/jp/ir/library/doc/fr/fr20240425.pdf": {"title": "DISCO, 2024年3月期 決算短信〔日本基準〕（連結） (consolidated earnings release, year ended March 2024)", "publisher": "DISCO Corporation", "date": "2024-04-25", "type": "filing", "accessed": "2026-10-20"},
  "https://www.disco.co.jp/jp/ir/library/doc/fr/fr20260422.pdf": {"title": "DISCO, 2026年3月期 決算短信〔日本基準〕(連結) (consolidated earnings release, year ended March 2026)", "publisher": "DISCO Corporation", "date": "2026-04-22", "type": "filing", "accessed": "2026-10-20"},
  "https://www.hoya.com/wp-content/uploads/2022/06/IFRS-REPORT_FY2021.pdf": {"title": "HOYA, Consolidated Financial Statements under IFRSs and Independent Auditor's Report, for the year ended 31 March 2022", "publisher": "HOYA", "date": "2022-06-24", "type": "pdf", "accessed": "2026-10-20"},
  "https://www.hoya.com/wp-content/uploads/2023/07/FY22_EnFS.pdf": {"title": "HOYA, Consolidated Financial Statements under IFRSs and Independent Auditor's Report, for the year ended 31 March 2023", "publisher": "HOYA", "date": "2023-06-23", "type": "pdf", "accessed": "2026-10-20"},
  "https://www.hoya.com/wp-content/uploads/2025/07/Annual-Report-Final-3.pdf": {"title": "HOYA, Consolidated Financial Statements under IFRS Accounting Standards and Independent Auditor's Report, for the year ended 31 March 2025", "publisher": "HOYA", "date": "2025-07-04", "type": "pdf", "accessed": "2026-10-20"},
  "https://www.hoya.com/wp-content/uploads/2026/07/Annual-Report-Final.pdf": {"title": "HOYA, Consolidated Financial Statements under IFRS Accounting Standards and Independent Auditor's Report, for the year ended 31 March 2026", "publisher": "HOYA", "date": "2026-07-15", "type": "pdf", "accessed": "2026-10-20"},
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100Z32V.pdf": {"title": "Lasertec, securities report (有価証券報告書), 64th fiscal year (year ended June 2026)", "publisher": "Financial Services Agency (EDINET)", "date": "2026-09-24", "type": "filing", "accessed": "2026-10-20"},
  "https://disclosure2dl.edinet-fsa.go.jp/searchdocument/pdf/S100UFKD.pdf": {"title": "Lasertec, securities report (有価証券報告書), 62nd fiscal year (year ended June 2024)", "publisher": "Financial Services Agency (EDINET)", "date": "2024-09-27", "type": "filing", "accessed": "2026-10-20"},
  "https://ssl4.eir-parts.net/doc/6920/ir_material_for_fiscal_ym9/209785/00.xlsx": {"title": "Lasertec, Financial Highlights [Excel], fiscal year ended June 2026", "publisher": "Lasertec", "type": "dataset", "accessed": "2026-10-20"},
  "https://www.agc.com/en/ir/library/financial/pdf/financial2025e.pdf": {"title": "AGC, Financial Review 2025", "publisher": "AGC Inc.", "date": "2026-03-24", "type": "pdf", "accessed": "2026-10-20"},
  "https://www.agc.com/en/ir/library/financial/pdf/financial2021e.pdf": {"title": "AGC, Financial Review 2021", "publisher": "AGC Inc.", "type": "pdf", "accessed": "2026-10-20"}
}
```
Hosts: the EDINET (disclosure2dl.edinet-fsa.go.jp) and eir-parts.net links appear only in data/exposure-notes.md, which the build does not render or check. Neither host is in data/source-tiers.json. EDINET is Japan's statutory filing system (the counterpart of DART, which is tier A); ssl4.eir-parts.net is the IR host Lasertec and AGC link from their own sites. Classify them before citing either anywhere rendered. The EDINET copy of S100Z32V is byte-identical to the one Lasertec links.
