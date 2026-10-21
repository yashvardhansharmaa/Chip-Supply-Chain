# rev-china notes (round three, 20 October 2026)

Task: filed 2025 revenue for the 26 suppliers in `qa/round3/firms-china.json`, written to `qa/round3/revenue-china.json`.

## Method
- A-share firms: cninfo full-text query (`category_ndbg_szsh`, 2026-01-01 to 2026-10-20) for each code's 2025 annual report (年度报告); PDFs from static.cninfo.com.cn, saved under `qa/round2/scratch/rev-china/` and read with `pdftotext -layout` (python3 -I only).
- Figure taken from the consolidated income statement (合并利润表), row 其中：营业收入, as printed in 元. For every A-share firm 一、营业总收入 equals 营业收入, and both match row 营业收入 in the key-data table (主要会计数据和财务指标). The income statement was chosen because it is the audited table and always in 元 (NSIG's key-data table is in 万元; Naura's and Eoptolink's wrap the figure across two lines).
- Hong Kong filers (SMIC, Hua Hong, Lenovo, Biren, Iluvatar CoreX): annual report on hkexnews.hk, consolidated statement of profit or loss, in thousands.
- Each figure re-checked by extracting only the cited PDF page (`pdftotext -f N -l N`) and finding the number on it.
- Generic User-Agent, about 1.5 to 2 seconds between requests per host. hkexnews truncated large PDFs over HTTP/2; re-downloaded over HTTP/1.1.

## Results (26 of 26 with a filed figure)
- 20 A-share firms: 2025 annual report on cninfo, CNY, unit "one".
- CXMT (688825): listed on the STAR Market in July 2026, so no 2025 annual report. Figure from its final prospectus (招股说明书, 2026-07-22), consolidated income statement on PDF page 209 (61,799,321,546.81 元); the financial section cites Deloitte's standard unqualified audit report for 2023 to 2025. Flag for the owner: a prospectus, not an annual report.
- SMIC, Hua Hong: USD from the HK annual reports (IFRS / HKFRS), matching the site's dollar scope. Their A-share CAS figures in RMB are given in `note`.
- Lenovo: FY2025/26 (April 2025 to March 2026), USD thousands, HKFRS.
- Biren, Iluvatar CoreX: RMB thousands, IFRS / HKFRS.
- Scope: all 26 are whole company. For every CNY row, `revenueUSDb_now` equals the filed figure divided by about 6.72 to 6.74, so earlier agents used the same whole-company figures (at an unrecorded rate near 6.73 CNY per dollar). The USD rows match exactly.

## Doubts
- CXMT source type (prospectus) as above.
- Hua Hong filed a revised A-share annual report (修订版) on 15 May 2026; not used, since the HK report carries the USD figure.
