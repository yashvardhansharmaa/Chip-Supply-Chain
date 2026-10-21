# rev-europe notes (round three, 20 October 2026)

Work list: `qa/round3/firms-europe-other.json` (30 firms). Output: `qa/round3/revenue-europe-other.json`. Downloads: `qa/round2/scratch/rev-europe/`.

## Result (final)

All 30 firms have a filed figure in `qa/round3/revenue-europe-other.json` (valid JSON, keyed in work-list order). Currencies: EUR (16), USD (11), CHF (2), HKD (1).

### Scope decisions
- Group-wide figures, matching the scale of `revenueUSDb_now`: Merck KGaA (net sales 21,102 € million; Electronics alone 3,515), Linde, Air Liquide, Schneider Electric (Energy Management alone 33,130), Eaton, Siemens Energy (segments listed in the note), Infineon, Wacker, Jenoptik.
- ASMPT: the consolidated statement shows continuing operations only (13,736,243 HK$'000), because ASMPT NEXX is held for divestment. Including NEXX the report gives 14,521.0 HK$ million. The site figure matches the continuing-operations scale. Scope recorded as "company (continuing operations)".
- Every euro row's `revenueUSDb_now` equals the filed euro figure times about 1.162, a single rate for every fiscal year, which suggests earlier agents used one recent spot rate rather than period averages.

### Points to check
- Alphawave Semi: the site shows 2024 ($0.308 billion). The 2025 group accounts (filed at Companies House on 6 June 2026, scanned) give revenue of 254,475 US$'000, so the row moves to 2025 and falls. Qualcomm took control on 18 December 2025.
- ASML: cited the statutory EU-IFRS Annual Report 2025 (exhibit 99.1 to the 6-K, the source the site already uses). The 20-F (US GAAP) tags the same 32,667.3 € million total in XBRL, but its page could not be opened.
- Eight SEC filers (Arm, Linde, Celestica, Eaton, Camtek, Tower, Kulicke and Soffa, Fabrinet) cite the SEC rendering of the filing's income statement (`R3.htm`/`R4.htm`/`R5.htm` in the filing folder), read through the fetch tool because www.sec.gov returned 403 to curl for the whole session. Each value matches the XBRL fact from data.sec.gov. The notes give each primary document URL. Nova cites the company's PDF copy of its 20-F with a page number.
- Pfeiffer Vacuum publishes its 2025 annual report in German only. The quote is in German, and the figure 850.063 in T € (German format) is recorded as 850063 thousand.
- Asetek: cited the ESEF annual report as distributed by Cision with the company's results announcement, because the company's q4cdn file server returned 403. The report says the takeover by CQXA Holdings (Suzhou Chunqiu) was to close on 21 April 2026.
- Infineon and Siemens Energy fiscal 2026 (to September 2026) and Kulicke and Soffa fiscal 2026 (to early October 2026) have ended, but their annual results are not out by 20 October 2026, so fiscal 2025 is used.

## Progress log

- data.sec.gov submissions API answered the generic User-Agent; the first batch of www.sec.gov Archives requests returned 403 ("Undeclared Automated Tool"). Moving to the European filings first and retrying sec.gov later.
- data.sec.gov XBRL companyfacts also answers; used to read the tagged annual revenue of each SEC filer as a cross-check (values below). web.archive.org returned 503 "Temporarily Offline" at first try.
- Done from company PDFs (working list in scratchpad results.json): Siltronic, Wacker, Soitec, Merck KGaA (group), Jenoptik, Air Liquide (group), VAT, Comet, Pfeiffer (German report only), Besi, ASM International, SUSS, AT&S, Technoprobe, Schneider (group), Infineon (group, FY to Sep 2025), Siemens Energy (group, FY to Sep 2025), ASMPT (continuing operations), Asetek (via Cision copy), Alphawave (2025 accounts at Companies House, scanned).
- Blocks met: www.se.com and its asset paths (403; used download.se.com, the file server the se.com 2025-URD page names), ir.pfeiffer-vacuum.com (403; s1.q4cdn.com worked), Asetek's q4cdn (403; used the Cision copy of the ESEF report), corporate.celestica.com static files (403), awavesemi.com (redirects to qualcomm.com).

### XBRL cross-check values (data.sec.gov companyfacts, tagged in the filing named)
- Arm 20-F FY to 2026-03-31 (0001973239-26-000097): RevenueFromContractWithCustomerExcludingAssessedTax 4,920,000,000 USD
- Linde 10-K 2025 (0001628280-26-011430): 33,986,000,000 USD
- ASML 20-F 2025 (0001628280-26-011378): 32,667,300,000 EUR
- Nova 20-F 2025 (0001178913-26-000504): Revenues 880,577,000 USD
- Camtek 20-F 2025 (0001178913-26-001561): Revenues 496,072,000 USD
- Tower 20-F 2025 (0001178913-26-002318): Revenues 1,566,104,000 USD
- Kulicke & Soffa 10-K FY 2024-09-29 to 2025-10-04 (0000056978-25-000081): Revenues 654,081,000 USD
- Fabrinet 10-K FY 2025-06-28 to 2026-06-26 (0001408710-26-000028): Revenues 4,641,097,000 USD
- Celestica 10-K 2025 (0001030894-26-000011): 12,390,900,000 USD
- Eaton 10-K 2025 (0001551182-26-000007): 27,448,000,000 USD
