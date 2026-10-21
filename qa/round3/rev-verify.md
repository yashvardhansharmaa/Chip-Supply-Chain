# rev-verify: audit of the 170 filed revenue figures (20 October 2026)

Scope: `qa/round3/revenue-{us,japan,china,taiwan-korea,europe-other}.json` and the `revenue` objects merged into `data/suppliers.json`. Downloads are in `qa/round2/scratch/rev-verify/` (one folder per firm; SEC data in `facts/` and `subs/`).

## Result in one line
All 170 figures were re-read at their source. 169 are confirmed. Cerebras could only be confirmed in part. No figure was wrong, so no data file was changed.

| | Count |
|---|---|
| Re-read from the filing (48 US + 8 European firms cited to sec.gov) | 56 |
| of which confirmed | 55 |
| of which only partly verifiable (Cerebras) | 1 |
| Other 114 firms re-opened at the cited source | 114 (all, not only a sample) |
| of which confirmed on the cited page | 113 |
| of which confirmed through the matching 20-F's XBRL instead (ASML) | 1 |
| Fixed | 0 |

## 1. The 56 sec.gov firms
Method: www.sec.gov still refused this network ("Undeclared Automated Tool" with the generic User-Agent). data.sec.gov answered, so for each firm I downloaded the XBRL company facts (`api/xbrl/companyfacts/CIK…json`) and the filing index (`submissions/CIK…json`), at least 7 seconds apart. For each firm the script (`qa/round2/scratch/rev-verify/_scripts/checkfacts.py`, output in `facts-out.txt` there) checked:
- that a non-dimensional revenue fact (Revenues, RevenueFromContractWithCustomerExcludingAssessedTax and the like) in the cited accession equals amount × unit exactly,
- that the fact's period gives the same `fyStart`/`fyEnd` months (52/53-week years included: Nvidia, Broadcom, Intel, AMD, Micron, SanDisk, Onto, Cisco, Lam, K&S, Fabrinet and others),
- that the cited filing is the latest 10-K or 20-F filed by 20 October 2026.

Result: 55 of 56 match on all three. AMD's latest annual filing is a same-day 10-K/A with certifications only, as the collector noted. The XBRL values carry the precision of the recorded unit (thousands or millions), so the units agree. The XBRL check confirms the number and the period. It does not confirm the R-page wording of each `quote` letter by letter.

Cerebras: a 424B4 prospectus carries no XBRL, and the document is on www.sec.gov. EDGAR full-text search (efts.sec.gov) finds "509,991" in `cerebras-424b4.htm` (accession 0001628280-26-035214), and the 10-Q XBRL gives first-half 2025 revenue of $202,834 thousand, which fits a $509,991 thousand year. I could not open the statement page itself. The company IR site returned 403.

Jabil: the latest 10-K is still FY2025 (filed 2025-10-17). Jabil furnished FY2026 results in an 8-K (item 2.02) on 2026-09-30. That is an unaudited release, so FY2025 stays (owner question 5).

## 2. The other 114 firms
I downloaded every cited source again (MOPS through its link page, DART section pages, EDINET and IR PDFs, cninfo, HKEXnews, Companies House, Cision), extracted the cited page with pdftotext and confirmed the amount on the revenue row, in the current-year column, under the stated unit and period. I checked the column headers by hand for the 45 highest-risk firms: TEL, Nidec, Shinko, Shin-Etsu, Lasertec, Kioxia, Canon, Fujifilm, Advantest, Hoya, Sumitomo Chemical, CXMT, Luxshare, Lenovo, SMIC, Hua Hong, Biren, Iluvatar, Hygon, Naura, TSMC, Hon Hai, Quanta, Wiwynn, MediaTek, Delta, SK hynix, Samsung Electro-Mechanics, OCI, Soulbrain, Park Systems, ASMPT, Siemens Energy, Infineon, Alphawave, Asetek, Merck KGaA, AT&S, Soitec, Nova, Schneider, Air Liquide, VAT, Comet and Pfeiffer. The other 68 were checked by script, with the matched row printed. Every Chinese figure sits under 合并利润表 (or the consolidated statement for the HKEX filers), and every Korean one under 연결 손익계산서 or 연결 포괄손익계산서.

Notes from the checks:
- Alphawave: the Companies House filing is a scanned image. Page 16, rendered and read, shows "Revenue 4 254,475 307,590" (US$'000, year ended 31 December 2025).
- Asetek: the Cision ESEF file tags ifrs-full:Revenue 41,497 (scale 3, USD) for 2025.
- Alchip: the statement prints USD and NTD columns side by side. The notes name NTD as the presentation currency, so NT$30,926,092 thousand is right.
- Delta: the first column is a US$ convenience translation. The NT$ figure is used, which is right.
- Pfeiffer prints German number format (850.063 = 850,063 thousand euros).

## 3. Sanity pass over all 170 (`_scripts/sanity.js`, per-firm rows in `_scripts/rows.json`, page checks in `_scripts/batch.log`)
- Units and currencies fit each company (JPY million, TWD thousand, CNY yuan or thousand, KRW as DART prints, USD for the dollar filers in China, Israel, Singapore, the UK, Denmark, Thailand and Canada, HKD for ASMPT).
- Every `fyStart` to `fyEnd` span is 12 months, and every `fyEnd` falls on or before 2026-09.
- Every `source` host is Tier A, and every PDF source carries `#page=`.
- Every `quote` contains its amount.
- `data/suppliers.json` matches the revenue files on all ten merged keys for all 170.
- `build/fx.js` converts every row, with no null.

Firms whose new dollar figure differs from the old `revenueUSDb` (git HEAD) by more than 10 percent:

| Firm | Old | New | Change | Reason |
|---|---|---|---|---|
| Micron Technology | $37.378B (FY to Aug 2025) | $133.188B (FY to Sep 2026) | +256% | Newer year: the FY2026 10-K was filed 2026-10-09. Confirmed in XBRL. |
| Alphawave Semi | $0.308B (2024) | $0.254B (2025) | -17% | Newer year and a real fall. Confirmed on the scan. |

Below the threshold, the changes are systematic and come from the old rates: CNY rows are 6 to 7 percent lower (old rate about 6.73, 2025 mean 7.19), KRW rows 5.5 to 5.7 percent lower, Siemens Energy and Infineon 4.9 percent lower, and Nidec 6 percent higher (the old figure was FY to March 2025).

## Owner's questions (all unchanged)
1. **CXMT:** the figure comes from the July 2026 STAR Market prospectus (audited 2025 statements, p. 209, ¥61,799,321,546.81), since there is no annual report yet. Confirmed. Keep it?
2. **Nidec:** the FY to March 2026 report carries a disclaimer of opinion. ¥2,708,705 million (continuing operations) is confirmed on p. 130. Show it with a warning, or leave it out?
3. **Shinko:** ¥215,022 million for the year to March 2025 comes from an unaudited 決算短信 (confirmed on p. 12). The company is private and filed no later consolidated report. Keep, mark it as old, or set it to null?
4. **Cerebras:** see above. The number is present in the prospectus, but its statement page could not be opened here. Re-check when sec.gov answers.
5. **Jabil:** FY2026 results are out by 8-K (unaudited) but the 10-K is not filed yet. Keep FY2025 until the 10-K lands?
6. **Scope:** whole group is used for Merck KGaA (Electronics alone: €3,515 million), Schneider (Energy Management: €33,130 million), Linde, Air Liquide, Eaton, Siemens Energy, Infineon and Wacker, matching the old site scale. Is that the scope the rows should show?
7. **ASMPT:** HK$13,736,243 thousand covers continuing operations only. The group including NEXX was HK$14,521.0 million. Which one should the row show?
8. **ASML:** the source cites the IFRS statutory report filed as a 6-K exhibit. The US GAAP 20-F tags the same €32,667.3 million. Either works.
9. **Fiscal-year labels:** the same April-to-March year is labelled "FY2025" for some Japanese firms and "FY2026" for others, following each company's usage (Shinko's "FY2025" is the year to March 2025). The display should keep labelling by `fyEnd`, as LOG.md says.
