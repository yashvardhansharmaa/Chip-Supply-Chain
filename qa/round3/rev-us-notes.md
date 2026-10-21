# rev-us notes (round three, 20 October 2026)

Work list: `qa/round3/firms-us.json` (48 suppliers). Output: `qa/round3/revenue-us.json` (48 entries, all USD, all `scope: "company"`).

## Method
- Source for each firm: its latest annual filing on sec.gov for a completed fiscal year, filed by 20 October 2026 (10-K for 45 firms, 20-F for GlobalFoundries, IPO prospectus 424B4 for Cerebras, last 10-K for Ansys).
- The figure is the top revenue line of the consolidated statement of operations, copied as printed with the statement's unit. For 45 firms the cited page is the filing's XBRL R-page for that statement (`.../R3.htm` and so on), which prints the statement with its unit line ("$ in Millions" or "$ in Thousands").
- Lam Research and SanDisk cite the 10-K document itself: their R-pages print the row in whole dollars, while the 10-K statement prints it "(in thousands ...)" (Lam) and "(in millions ...)" (SanDisk).
- Quotes join a table row's cells with single spaces. Bracketed markers such as "[1]" are the R-page footnote markers and are kept as printed.
- `fyStart`/`fyEnd` are the months each fiscal year mostly covers. For 52/53-week years the end date from the statement's column header is given in `note`.
- Requests: generic User-Agent only, no personal data. sec.gov answered curl from this network with 403 "Request Rate Threshold Exceeded" all session (retried after 5 and 10 minutes, then once more 20+ minutes later). The last retry got 403 "Undeclared Automated Tool", so I stopped trying curl. All reads went through the WebFetch tool (EDGAR company browse pages, filing indexes, FilingSummary.xml, R-pages, and three 10-K documents). Nothing was saved under `qa/round2/scratch/rev-us/` except the blocked responses.

## Log
- 20 Oct: every firm's latest annual filing found through EDGAR company browse pages.
- Micron FY2026 10-K filed 2026-10-09 (year to 3 Sep 2026). Checked twice: R3 shows Revenue $ 133,188, cost of goods sold 25,684 and gross margin 107,504, and the 10-K's MD&A says "Total revenue for 2026 increased 256% as compared to 2025". 133,188 / 37,378 = 3.56, which matches.
- Jabil: the latest 10-K on EDGAR is FY2025 (filed 2025-10-17). The FY2026 10-K (year to Aug 2026) was not listed when checked on 20 Oct 2026.
- Qualcomm (FY to Sep 2026) and Air Products (FY to Sep 2026): FY2026 10-Ks are not yet due, so FY2025 is used.
- Cerebras: no 10-K. Its IPO prospectus (424B4 filed 2026-05-14, dated 13 May 2026, Nasdaq CBRS) gives 2025 total revenue 509,991 (in thousands) in Summary Consolidated Financial Data. The prospectus says these data are "derived from our audited consolidated financial statements". The audited F-pages lie beyond what WebFetch could read of the 8.5 MB document.
- GlobalFoundries files a 20-F. Its cover data give the accounting standard as International Financial Reporting Standards, so the basis is IFRS.
- Ansys: it was acquired by Synopsys in 2025 and files nothing now. FY2024 (10-K filed 2025-02-19) is its last annual report. Synopsys FY2025 already includes Ansys after the acquisition.
- Synopsys: the 10-K cover reads "For the fiscal year ended October 31, 2025". Fiscal 2025 began 3 Nov 2024, after a change from 52/53-week years to an Oct 31 year end.
- Cadence: the cover reads "For the fiscal year ended December 31, 2025". Photronics: "For the fiscal year ended October 31, 2025".
- AMD filed a 10-K/A on the same day as its 10-K. The 10-K/A carries only certifications (EX-31), so the original 10-K is cited.

## Old figures compared with the filings
Every `revenueUSDb_now` equals the filed figure to rounding, except one:
- **Micron Technology**: the site has 37.378 ($ billion, FY2025). The FY2026 10-K (filed 2026-10-09) gives Revenue $ 133,188 million. The old number was correct for FY2025. It is out of date, not a copying error.

No old figure was wrong in value. The earlier rows cited secondary or product pages (SemiAnalysis, company product pages, ETO, an investor-day deck), but their dollar numbers match the filings.

## Doubtful or worth a look
- Micron's jump from $37.4 billion to $133.2 billion is large but checks out on the filing's own arithmetic and MD&A.
- Cerebras is cited from the prospectus summary table, not from the audited statement page.
- All figures were read through WebFetch's text extraction, not from raw downloads, because sec.gov blocked curl. Each figure matched the site's existing number or passed an internal check (Micron).

## New bibliography entries
```json
{
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=3661&filename=202504_3661_AIA.pdf": {
  "title": "Alchip Technologies, consolidated financial statements for 2025 (English translation, 202504_3661_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-09",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=3443&filename=202504_3443_AIA.pdf": {
  "title": "Global Unichip, consolidated financial statements for 2025 (English translation, 202504_3443_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-01-29",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2454&filename=202504_2454_AIA.pdf": {
  "title": "MediaTek, consolidated financial statements for 2025 (English translation, 202504_2454_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-02-26",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=6488&filename=202504_6488_AIA.pdf": {
  "title": "GlobalWafers, consolidated financial statements for 2025 (English translation, 202504_6488_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-15",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://dart.fss.or.kr/report/viewer.do?rcpNo=20260318000617&dcmNo=11136858&eleId=21&offset=503877&length=26152&dtd=dart4.xsd": {
  "title": "OCI Holdings, consolidated income statement (연결 손익계산서), business report (사업보고서) for fiscal year 2025",
  "publisher": "Financial Supervisory Service (DART)",
  "date": "2026-03-18",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://dart.fss.or.kr/report/viewer.do?rcpNo=20260316001567&dcmNo=11129507&eleId=21&offset=259551&length=31561&dtd=dart4.xsd": {
  "title": "Soulbrain, consolidated income statement (연결 포괄손익계산서), business report (사업보고서) for fiscal year 2025",
  "publisher": "Financial Supervisory Service (DART)",
  "date": "2026-03-16",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://dart.fss.or.kr/report/viewer.do?rcpNo=20260319000022&dcmNo=11145726&eleId=21&offset=268686&length=26691&dtd=dart4.xsd": {
  "title": "Park Systems, consolidated income statement (연결 포괄손익계산서), business report (사업보고서) for fiscal year 2025",
  "publisher": "Financial Supervisory Service (DART)",
  "date": "2026-03-19",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2330&filename=202504_2330_AIA.pdf": {
  "title": "TSMC, consolidated financial statements for 2025 (English translation, 202504_2330_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-02-26",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2303&filename=202504_2303_AIA.pdf": {
  "title": "UMC, consolidated financial statements for 2025 (English translation, 202504_2303_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-02-25",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://dart.fss.or.kr/report/viewer.do?rcpNo=20260317000635&dcmNo=11132576&eleId=21&offset=371607&length=31668&dtd=dart4.xsd": {
  "title": "SK hynix, consolidated income statement (연결 포괄손익계산서), business report (사업보고서) for fiscal year 2025",
  "publisher": "Financial Supervisory Service (DART)",
  "date": "2026-03-17",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2408&filename=202504_2408_AIA.pdf": {
  "title": "Nanya Technology, consolidated financial statements for 2025 (English translation, 202504_2408_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-02",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2344&filename=202504_2344_AIA.pdf": {
  "title": "Winbond Electronics, consolidated financial statements for 2025 (English translation, 202504_2344_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-03-18",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=3711&filename=202504_3711_AIA.pdf": {
  "title": "ASE Technology Holding, consolidated financial statements for 2025 (English translation, 202504_3711_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-03-18",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=6239&filename=202504_6239_AIA.pdf": {
  "title": "Powertech Technology, consolidated financial statements for 2025 (English translation, 202504_6239_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-03-11",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2449&filename=202504_2449_AIA.pdf": {
  "title": "King Yuan Electronics, consolidated financial statements for 2025 (English translation, 202504_2449_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-05-08",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=6147&filename=202504_6147_AIA.pdf": {
  "title": "Chipbond Technology, consolidated financial statements for 2025 (English translation, 202504_6147_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-03-13",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=3037&filename=202504_3037_AIA.pdf": {
  "title": "Unimicron, consolidated financial statements for 2025 (English translation, 202504_3037_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-08",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=3189&filename=202504_3189_AIA.pdf": {
  "title": "Kinsus Interconnect, consolidated financial statements for 2025 (English translation, 202504_3189_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-03-03",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=8046&filename=202504_8046_AIA.pdf": {
  "title": "Nan Ya PCB, consolidated financial statements for 2025 (English translation, 202504_8046_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-03-27",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://dart.fss.or.kr/report/viewer.do?rcpNo=20260310003071&dcmNo=11105795&eleId=21&offset=341261&length=44392&dtd=dart4.xsd": {
  "title": "Samsung Electro-Mechanics, consolidated income statement (연결 포괄손익계산서), business report (사업보고서) for fiscal year 2025",
  "publisher": "Financial Supervisory Service (DART)",
  "date": "2026-03-10",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://dart.fss.or.kr/report/viewer.do?rcpNo=20260312001270&dcmNo=11116775&eleId=21&offset=303972&length=21173&dtd=dart4.xsd": {
  "title": "LG Innotek, consolidated income statement (연결 손익계산서), business report (사업보고서) for fiscal year 2025",
  "publisher": "Financial Supervisory Service (DART)",
  "date": "2026-03-12",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2368&filename=202504_2368_AIA.pdf": {
  "title": "Gold Circuit Electronics, consolidated financial statements for 2025 (English translation, 202504_2368_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-01",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=6223&filename=202504_6223_AIA.pdf": {
  "title": "MPI Corporation, consolidated financial statements for 2025 (English translation, 202504_6223_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-05-08",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2360&filename=202504_2360_AIA.pdf": {
  "title": "Chroma ATE, consolidated financial statements for 2025 (English translation, 202504_2360_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-24",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2345&filename=202504_2345_AIA.pdf": {
  "title": "Accton Technology, consolidated financial statements for 2025 (English translation, 202504_2345_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-05-13",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2317&filename=202504_2317_AIA.pdf": {
  "title": "Hon Hai Precision, consolidated financial statements for 2025 (English translation, 202504_2317_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-05-07",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2382&filename=202504_2382_AIA.pdf": {
  "title": "Quanta Computer, consolidated financial statements for 2025 (English translation, 202504_2382_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-24",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=3231&filename=202504_3231_AIA.pdf": {
  "title": "Wistron, consolidated financial statements for 2025 (English translation, 202504_3231_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-14",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=6669&filename=202504_6669_AIA.pdf": {
  "title": "Wiwynn, consolidated financial statements for 2025 (English translation, 202504_6669_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-02-26",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2356&filename=202504_2356_AIA.pdf": {
  "title": "Inventec, consolidated financial statements for 2025 (English translation, 202504_2356_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-14",
  "type": "filing",
  "accessed": "2026-10-20"
 },
 "https://doc.twse.com.tw/server-java/t57sb01?step=9&kind=A&co_id=2308&filename=202504_2308_AIA.pdf": {
  "title": "Delta Electronics, consolidated financial statements for 2025 (English translation, 202504_2308_AIA.pdf)",
  "publisher": "Taiwan Stock Exchange (MOPS)",
  "date": "2026-04-15",
  "type": "filing",
  "accessed": "2026-10-20"
 }
}
```
