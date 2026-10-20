# pages-a notes (round two, 20 October 2026)

Task: pinpoint `#page=N` for every citation into a PDF of 10 or more pages in chapters 01 to 08. Output: `qa/round2/pages/01-design-and-eda.json` to `qa/round2/pages/08-transistors-and-front-end.json` (SCHEMA.md section 2). No chapter, data or code file was edited.

## Method
- Extracted every body `([source](URL))` (front matter skipped) with the sentence it ends. Sentence boundary: `.`/`!`/`?` (plus closing quote, paren or `**`) followed by whitespace and a capital, digit, currency sign, opening quote/paren, `**` or `[`. Paragraphs, list items, headings, tables and `{{figure}}` lines are separate blocks; list markers are not part of a sentence.
- Selected URLs containing `.pdf` (any case) plus three body URLs that serve PDFs without `.pdf` in the URL (checked by download): `arxiv.org/pdf/1912.09075` (11 pages, ch05), `finance.senate.gov/download/051425-isaacs-testimony&download=1` (11 pages, ch06), `docs.broadcom.com/doc/3-5d-xdsip-platform-technology` (9 pages, ch01, so skipped).
- Downloaded each distinct PDF once to `qa/round2/scratch/pages-a/<n>/file.pdf` (generic User-Agent, no personal data). Page counts by `pdfinfo`. Text per page by `pdftotext` (layout and raw), split on form feeds; charts with no text layer were rendered with PyMuPDF and read by eye.
- `page` is the PDF's own page index. Every `evidence` quote was checked by script against that page's text (whitespace, line-end hyphenation and quote styles normalised; segments joined by ` ... `). Quotes are at most 25 words. Five quotes start `[chart labels]`: they transcribe chart labels that have no text layer (ASML Q4 2025 deck p9) or that the text layer does not tie to their labels (TEL p28); both pages were rendered and read.
- `sentence` is the first 80 characters of the sentence's prose exactly as in the file, stopping before ` ([source](` when the prose is shorter (same convention as the pages-b files). For the list item `- **SUMCO.** Sold ¥409.7 billion ...` the sentence starts at `Sold`.
- The JSON files were rebuilt from a fresh read of each chapter at about 01:50 and checked: every excerpt occurs in the body and the next citation after it is the entry's URL.
- Scripts and decision records: `qa/round2/scratch/pages-a/work/` (`dec*.jsonl` hold page, evidence, alternatives and folio per citation; `urls.tsv` maps folder numbers to URLs).

## Counts per chapter
| Chapter | PDF citations | Page found | null | Skipped, PDF under 10 pages | Already had `#page=` (verified, left out) |
|---|---|---|---|---|---|
| 01 | 8 | 6 | 0 | 2 (Broadcom 3.5D XDSiP, 9 pp.) | 0 |
| 02 | 39 | 33 | 5 (download blocked) | 1 (USGS MCS silicon, 2 pp.) | 0 |
| 03 | 29 | 16 | 0 | 11 (USGS gallium 4, germanium 5, JIC 1, JSR 1) | 2 |
| 04 | 17 | 14 | 0 | 2 (ASML Q2 2026 press release, 3 pp.) | 1 |
| 05 | 7 | 7 | 0 | 0 | 0 |
| 06 | 30 | 28 | 0 | 2 (Intel PowerVia 5 pp., FR 2025-11-12 2 pp.) | 0 |
| 07 | 36 | 34 | 2 (figures computed) | 0 | 0 |
| 08 | 2 | 1 | 0 | 1 (AMD MI455X brochure, 2 pp.) | 0 |
| Total | 168 | 139 | 7 | 19 | 3 |

45 distinct PDF URLs: 33 searched, 10 under 10 pages, 2 could not be downloaded.

## Problems (page null)
1. **ch02, Eswin listing prospectus, 4 citations, not downloadable.** URL `https://static.sse.com.cn/disclosure/listedinfo/announcement/c/new/2025-10-22/688783_20251022_UYMD.pdf`. Both tries returned HTTP 200 with a 3.9 KB gzip HTML page (an Alibaba Cloud WAF JavaScript challenge, `acw_sc__v2` cookie) instead of the PDF. The bib-cache fetch of 2 October got the same HTML. Not bypassed. Figures unverified:
   - "In its October 2025 listing prospectus, Eswin, a Chinese wafer maker, counts seven Chinese firms, itself included, making 300 mm wafers at scale."
   - "Their combined capacity was 2.94 million wafers a month at the end of 2024."
   - "Its October 2025 Shanghai listing prospectus, drawing on SEMI data, estimates that the five largest makers shipped about 79 percent of 300 mm wafers in 2024."
   - "It puts Eswin at about 6 percent and all other makers at about 15 percent."
2. **ch02, Eswin 2025 annual report summary, 1 citation, not downloadable.** URL `https://static.sse.com.cn/disclosure/listedinfo/announcement/c/new/2026-04-21/688783_20260421_6JVC.pdf`, same WAF challenge on both tries. Unverified: "SEMI estimated that 300 mm wafers made up about 78.8 percent of all wafer area shipped worldwide in 2025, according to Eswin's 2025 annual report summary."
   - Both filings should also be on cninfo.com.cn. The Eswin H1 2026 report that ch02 already cites (cninfo `2026-08-26/1225503057.PDF`, downloads fine) does not contain 79%, 78.8%, 2.94 million or the seven-firm count, so it cannot stand in.
3. **ch07, Parhami chapter, 2 citations: figures the chapter computed.** URL `https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf` (65 pp.).
   - "By the same formula, an 8 square centimeter die, about as much as one exposure can print, yields about 49 percent at 0.10 defects per square centimeter, with a set to 3." I searched all pages for 8 cm2, 0.10 and 0.1 defects/cm2, 49 percent, 0.49, and reticle and exposure in this sense: none of them appears. The PDF has only the yield formula (5.2.yield, with a = 3 to 4) on p7, and on p8 a worked example at 0.8/cm2 for 1 cm2 and 2 x 2 cm dies (0.492 and 0.113). (1 + 0.8/3)^-3 = 0.492, so the 49 percent equals the example's number, but the 8 cm2 case is the chapter's own calculation. RULES forbids computed figures.
   - "Halving the defect density to 0.05 lifts that yield to about 69 percent." I searched for 0.05 defects/cm2, 69 percent and 0.687 to 0.69. The only 0.05 is in an unrelated table on p63. (1 + 0.4/3)^-3 = 0.687 follows from the formula, but the PDF never states it.
   - If the sentences stay, the formula is on p7 (`#page=7`) and the worked example on p8.

## Partial support and other observations (page given)
- **ch07 Skyverse, p12:** "about $285 million" is not in the PDF, which gives yuan only (营业收入 2,053,298,171.74). The dollar figure is a currency conversion. The ch07 card `chinaStatus` repeats it.
- **ch06 Oct 2023 rule, p28:** "Deposition and etch chambers are separate products built from similar vacuum, gas and radio-frequency parts, and the export controls describe each tool by the process it is designed to run." Only the second clause is in the rule: the control text lists "Equipment designed for dry etching" and "deposition equipment ... designed for" each process. Nowhere does it say the two tool types share vacuum, gas and RF parts. Etch specs name RF power sources, and deposition specs name vacuum and multi-chamber platforms.
- **ch06 TEL, p28:** the 23, 27, 15 and 91 percent shares are Gartner data ("Chart created by TEL based on Gartner research"). The chapter attributes them to TEL's presentation. Gartner is on the RULES never-cite list, so this is a source-policy question, not a page question.
- **ch06 TEL, p27:** a footnote says the region percentages (China 41.7% in FY2025, 34.1% in FY2026) are shares of new equipment sales, with Field Solutions excluded. The chapter says "of sales", and the p5 transcript says "proportion of sales in China was 34.1%".
- **ch07 KLA investor day, p35:** 56.5 percent is Gartner (April 2025) data. The chapter already says so.
- Format variants, not errors: KLA gives "360 basis points" (ch07: 3.6 percentage points). SUMCO gives millions of yen: 409,670, (11,751), 36,924 and 1,342 (ch02: ¥409.7 billion, ¥11.8 billion, ¥36.9 billion, ¥1.3 billion). Parhami gives "0.492w and 0.113w" (ch07: 49.2 and 11.3 percent). "31 other countries" (ch06) comes from counting the 33-country Supplement No. 4 list on FR Dec 2024 p28. The ASML 2025 unit and share figures (ch04) exist only as chart graphics on deck p9.
- Mid-run additions by other agents: ch03 now cites the SIA PAG case study with `#page=21` and `#page=22`, and ch04 cites CSET with `#page=4`. I checked all three pages and all three are correct. They are left out of the JSON because they need no change.

## For whoever applies the pages
- The `plain` front matter field repeats a PDF citation in ch02 (Siltronic, "In 2025 the top five wafer makers ..."), ch03 (METI, "Japanese companies held 78 percent ...") and ch06 (Senate testimony, "Making one chip takes 1,000 to 1,500 steps ..."). `plain` must stay identical to the first How it works paragraph, so it needs the same `#page=` edit. These are the excerpts that occur twice (ch03's three times, because the oneLiner repeats the prose).
- Card source fields (`leaders[].source`, `costSources`, `chinaSources`, fact `source` values and so on) that point at these PDFs must copy the body URL exactly, `#page=N` included (SCHEMA section 1).
- To find each spot, match `sentence + ' ([source](' + url` for short sentences, or the excerpt followed by the first `[source](url)`.
- Two body sentences in ch02 cite Eswin H1 2026 (cninfo, p18) and two in ch03 cite USGS germanium. Each pair is near-identical text, so each pair yields two entries with the same excerpt.

## Printed folios that differ from the PDF index
- Federal Register PDFs print FR page numbers. Oct 2022 rule (87 FR): FR page = 62185 + index. Oct 2023 rule (88 FR): 73423 + index. Dec 2024 rule (89 FR): 96789 + index. Sep 2025 Affiliates rule (90 FR): 47200 + index.
- ASML 2025 annual report sections: financial performance PDF, AR page = index + 48 (p5 = 53, p7 = 55). Strategic report PDF, AR page = index + 1 (p16 = 17, p17 = 18, p30 = 31).
- KLA shareholder letters (Q3 and Q4 FY26): printed "Page N" = index - 1.
- Index minus 2: Shin-Etsu results (p6 = 4, p20 = 18), TOK (p4 = "-2-") and Canon (p22 = 20).
- Index minus 1: Empyrean annual report (p14 = 13, p15 = 14, p18 = 17) and AGC June 2026 transcript (p17 = 16).
- Parhami: book page = index + 127 (p8 = 135, p10 = 137, p23 = 150). USGS Minerals Yearbook China: p7 = 9.5.
- All others (CSET, Siltronic, METI, SUMCO, Eswin H1, Dinglong, Nikon, AGC data book, AGC briefing, AGC overview, TEL, ASM, KLA investor day, arXiv paper, Senate testimony, SIA case study): index = printed page.

## PDF index (folder n under qa/round2/scratch/pages-a/)
| n | pages | URL |
|---|---|---|
| 1 | 98 | https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf |
| 2 | 196 | https://static.cninfo.com.cn/finalpage/2026-04-28/1225217315.PDF |
| 3 | 32 | https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf |
| 4 | 2 | https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf |
| 5 | n/a | https://static.sse.com.cn/disclosure/listedinfo/announcement/c/new/2025-10-22/688783_20251022_UYMD.pdf |
| 6 | 111 | https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf |
| 7 | 28 | https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260428_con_E.pdf |
| 8 | 51 | https://www.sumcosi.com/english/pdf/ir/library/shareholders/27/pdf/nc_e_27.pdf |
| 9 | 44 | https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf |
| 10 | 208 | https://static.cninfo.com.cn/finalpage/2026-08-26/1225503057.PDF |
| 11 | n/a | https://static.sse.com.cn/disclosure/listedinfo/announcement/c/new/2026-04-21/688783_20260421_6JVC.pdf |
| 12 | 13 | https://static.cninfo.com.cn/finalpage/2026-03-27/1225036148.PDF |
| 13 | 9 | https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf |
| 14 | 1 | https://www.jsr.co.jp/jsr_e/news/assets/pdf/20240624_01_e.pdf |
| 15 | 10 | https://www.tok.co.jp/application/files/7417/8598/0069/q2_2612_en.pdf |
| 16 | 2 | https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf |
| 17 | 2 | https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf |
| 18 | 10 | https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf |
| 19 | 72 | https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf |
| 20 | 24 | https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf |
| 21 | 3 | https://ourbrand.asml.com/asset/c8dbf3fc-4c5e-4406-83f6-27694b138245/Press-Release-Financial-Results-Q2-2026.pdf |
| 22 | 43 | https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf |
| 23 | 22 | https://global.canon/en/ir/conference/pdf/conf2025e.pdf |
| 24 | 91 | https://www.agc.com/en/ir/library/outline/pdf/reference.pdf |
| 25 | 83 | https://www.agc.com/en/ir/library/briefing/pdf/2025_0207e_1.pdf |
| 26 | 40 | https://www.agc.com/en/ir/library/bizbriefing/pdf/2026_0602esemiconductor_transcript.pdf |
| 27 | 70 | https://www.agc.com/en/ir/library/outline/pdf/c_overview.pdf |
| 28 | 32 | https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf |
| 29 | 41 | https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf |
| 30 | 5 | https://download.intel.com/newsroom/archive/2025/en-us-2023-06-05-powervia-test-shows-industryleading-performance.pdf |
| 31 | 29 | https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf |
| 32 | 17 | https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf |
| 33 | 30 | https://www.govinfo.gov/content/pkg/FR-2022-10-13/pdf/2022-21658.pdf |
| 34 | 14 | https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf |
| 35 | 2 | https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf |
| 36 | 15 | https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf |
| 37 | 173 | https://d1io3yog0oux5.cloudfront.net/_7791115a123b86b3f10b1a5eb5210224/klatencor/db/1166/10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf |
| 38 | 17 | https://d1io3yog0oux5.cloudfront.net/_a357bfc9113388e37f3bfcb2ea2f0b64/klatencor/db/1117/10655/letter_to_shareholders/KLA+Shareholder+Letter+-+Q3+FY26.pdf |
| 39 | 65 | https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf |
| 40 | 16 | https://static.cninfo.com.cn/finalpage/2026-04-25/1225182755.PDF |
| 41 | 2 | https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf |
| 42 | 11 | https://arxiv.org/pdf/1912.09075 |
| 43 | 9 | https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology |
| 44 | 11 | https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1 |
| 45 | 28 | https://www.semiconductors.org/wp-content/uploads/2023/06/FINAL-PAG-Case-Study.pdf |

## Every entry: [PDF n] page/pages, sentence excerpt, folio, alternatives, notes
### 01-design-and-eda
- [1] p50/98 "In a January 2021 report built on 2019 market data, CSET at Georgetown Universit"
- [1] p50/98 "For all other chips, Chinese designers then relied on US tools"
- [1] p50/98 "The report found that other Chinese tools covered only narrow parts of the desig"
- [2] p18/196 "In its 2025 annual report, filed in April 2026, Empyrean says it now has complet" | printed folio 17; alt: p15-16 (same list, split across the page break)
- [2] p14/196 "It says its digital tools cover 80 percent of the main tools for digital design" | printed folio 13
- [2] p15/196 "The same report lists foundry certifications for its circuit simulator at 8, 5 a" | printed folio 14

### 02-silicon-and-wafers
- [3] p6/32 "In 2025 the top five wafer makers served around 75 percent of the world market,"
- [1] p55/98 "The Center for Security and Emerging Technology (CSET) at Georgetown University" | alt: p57 (Figure 29 and text on wafer firms headquartered in Japan, Taiwan, Germany and South Korea)
- [1] p55/98 "They were Shin-Etsu and SUMCO of Japan, GlobalWafers of Taiwan, Siltronic of Ger"
- [1] p55/98 "CSET also listed nine Chinese-owned producers, among them Zhonghuan, Simgui, Zin" | alt: p57 for 'Chinese wafer producers generate little revenue in comparison'; p92 note 221 calls Okmetic a Finnish firm acquired by a Chinese state fund
- [1] p57/98 "As of 2018, five Chinese firms were making or planning 300 mm wafers"
- [5] NULL "In its October 2025 listing prospectus, Eswin, a Chinese wafer maker, counts sev" | download blocked
- [5] NULL "Their combined capacity was 2.94 million wafers a month at the end of 2024" | download blocked
- [6] p8/111 "The chart shows shares of 2023 sales from a survey by Fuji Keizai, a Japanese re"
- [6] p8/111 "Japan's Ministry of Economy, Trade and Industry reproduced the figures in a Dece" | note: deck dated 令和7年12月23日 (23 December 2025) on p1
- [6] p8/111 "The deck prints only Japan's 53 percent, so the other shares are read off its ch" | note: only the Japan segment is labelled; other segments are unlabelled bars
- [6] p8/111 "The chart gives no separate share to Chinese or US companies" | note: the silicon wafer bars have no US or China segment
- [3] p6/32 "Siltronic's April 2026 investor presentation says the top five wafer makers serv"
- [3] p6/32 "It names the five as Shin-Etsu, SUMCO, GlobalWafers, SK Siltron and Siltronic it" | note: sentence added mid-run; Siltronic's own segment carries its logo, the slide title names Siltronic
- [7] p6/28 "Its parent's electronics materials segment sold ¥1,015.7 billion in the year to" | printed folio 4; alt: p5 (segment summary table)
- [7] p6/28 "AI-related demand stayed strong and demand in other sectors began to rise, lifti" | printed folio 4
- [7] p20/28 "The segment also sells rare earth magnets and other materials, and the results r" | printed folio 18
- [8] p26/51 "Sold ¥409.7 billion and still lost ¥11.8 billion, as operating profit fell from" | alt: p24 (2025 figures in prose, without the 2024 operating profit)
- [8] p24/51 "In the same year it added leading-edge 300 mm capacity and reorganized productio"
- [9] p7/44 "China made 1.50 million metric tons of polysilicon, the raw material, in 2023, a" | printed folio 9.5
- [9] p7/44 "Solar-grade material was an estimated 98 percent of that output and electronic-g" | printed folio 9.5
- [3] p5/32 "Siltronic put the 2025 market for electronic-grade silicon at $1.4 billion, with"
- [3] p6/32 "Siltronic of Germany describes itself as the only Western-based maker among the"
- [1] p55/98 "As of 2019 Chinese firms held under 5 percent of the wafer market and under 1 pe"
- [1] p58/98 "As of 2018, Chinese producers made 12 percent of the wafers for Chinese-headquar"
- [10] p18/208 "Eswin, mainland China's largest maker of 300 mm wafers, says it ranked sixth in"
- [5] NULL "Its October 2025 Shanghai listing prospectus, drawing on SEMI data, estimates th" | download blocked
- [5] NULL "It puts Eswin at about 6 percent and all other makers at about 15 percent" | download blocked
- [1] p57/98 "Making the smoothest, high-purity 300 mm wafers takes considerable know-how that"
- [3] p12/32 "Customers have to qualify a new wafer plant before they buy from it, and Siltron"
- [1] p57/98 "In SEMI figures from November 2020 cited by CSET, 99.7 percent of world fab capa"
- [11] NULL "SEMI estimated that 300 mm wafers made up about 78.8 percent of all wafer area s" | download blocked
- [1] p80/98 "The last increase in wafer size, to 300 mm, happened in 2002" | endnote
- [1] p80/98 "Bigger discs make printing, or photolithography, a bigger share of the processin" | endnote
- [1] p80/98 "A 2013 University of Texas lecture cited by CSET put photolithography at half th" | endnote
- [6] p8/111 "Japanese companies held 53 percent of the world's silicon wafer sales in 2023, b" | alt: p4 (wafer bar 53 / 10 / 37, 2023, Fuji Keizai 2024 edition)
- [6] p8/111 "Firms based in Taiwan, South Korea and Europe held most of the rest" | note: Europe, South Korea and Taiwan segments are unlabelled bars
- [10] p18/208 "China's largest maker of 300 mm wafers, Eswin, says it ranked sixth in the world"
- [3] p5/32 "Chips also need electronic-grade polysilicon, the raw material for wafers, and n"

### 03-chemicals-gases-and-photoresist
- [6] p8/111 "Japanese companies held 78 percent of world photoresist sales in 2023"
- [1] p59/98 "Each resist class is made for one kind of lithography, such as EUV, ArF immersio"
- [1] p59/98 "In a January 2021 brief, Georgetown University's Center for Security and Emergin" | note: note 244 (p95) is a USITC working paper of October 2019
- [1] p59/98 "The brief put most of the rest with US and South Korean firms"
- [6] p8/111 "In a December 2025 strategy presentation, Japan's Ministry of Economy, Trade and" | note: deck dated 23 December 2025 on p1
- [6] p8/111 "That survey counts sales by company nationality and puts Japanese companies at 7"
- [1] p56/98 "CSET's January 2021 brief lists five Japanese resist makers: JSR, Tokyo Ohka Kog"
- [1] p56/98 "It also lists Dongjin of South Korea, the American firms DuPont, EMD Performance"
- [12] p2/13 "In its 2025 annual report summary, the Chinese firm Hubei Dinglong said China ha"
- [12] p8/13 "The firm also said three of its own resists for 248 nm and 193 nm printing had m"
- [15] p4/10 "Tokyo Ohka Kogyo sold ¥139,668 million in the first half of fiscal 2026, up 25.1" | printed folio -2-; alt: p1 (summary table)
- [1] p60/98 "In electronic gases, CSET named Merck, Air Products and Air Liquide as the marke"
- [1] p60/98 "CSET's January 2021 brief, drawing on 2019 market reports, put five firms at mor"
- [1] p59/98 "It put DuPont and Cabot Microelectronics at about 56 percent of a $790 million m"
- [6] p8/111 "Counting by company nationality, the same Fuji Keizai survey puts Japanese compa"
- [6] p8/111 "Both shares were 49 percent in 2021"
- (left out, already `#page=21`, verified) [45] "The Semiconductor Industry Association wrote in 2023 that photoresist needs the most rigorous qualification ..."
- (left out, already `#page=22`, verified) [45] "The resist maker adjusts its formula over rounds of tests in the fab ..."

### 04-lithography
- [18] p5/10 "ASML sold 327 lithography systems in 2025, 48 of them extreme ultraviolet (EUV)" | AR page 53
- [19] p16/72 "Nobody else makes EUV systems" | AR page 17
- [19] p16/72 "ASML says one EUV exposure per layer cuts masks and process steps and lowers cos" | AR page 17
- [20] p9/24 "Of the systems ASML sold in 2025, 131 were ArF immersion, 78 KrF and 16 ArF dry," | chart graphics, no text layer
- [20] p9/24 "In 2025, those 131 ArF immersion tools made up 42 percent of ASML's system sales" | chart graphics, no text layer
- [19] p30/72 "Brighter light means more wafers an hour, and ASML ran the first 1,000-watt EUV" | AR page 31
- [19] p17/72 "Its TWINSCAN NXE:3800E ships at its full 220 wafers an hour, 37 percent more tha" | AR page 18
- [19] p16/72 "The second-generation TWINSCAN EXE:5200B runs at 175 wafers an hour, 60 percent" | AR page 17
- [18] p7/10 "ASML sold four High-NA (EXE) systems in 2025, against two in 2024" | AR page 55
- [18] p5/10 "ASML's net sales were EUR 32.7 billion in 2025, at a 52.8 percent gross margin" | AR page 53; alt: p3, p6
- [22] p8/43 "Nikon sold 22 new chip lithography systems in the year to March 2026, in a marke" | alt: p38 (22 units of new systems in FY2026/3)
- [22] p6/43 "Its Precision Equipment business made an operating loss in the year to March 202" | alt: p8 (business page, operating profit -4.5)
- [23] p22/22 "Canon sold 234 chip lithography systems in 2025, 188 of them i-line and 46 KrF" | printed folio 20
- [20] p9/24 "China's share of ASML's net system sales fell from 41 percent in 2024 to 33 perc" | chart graphics, no text layer
- (left out, already `#page=4`, verified) [1] "In January 2021 CSET, a research center at Georgetown University, found that the United States lacked firms ..."

### 05-photomasks-and-pellicles
- [42] p2/11 "For EUV the blank is a mirror of about 40 molybdenum and silicon layer pairs, 7"
- [42] p1/11 "A dark tantalum film on top, called the absorber, will carry the pattern" | alt: p2 (TaBN-TaBO absorber bi-layer, 58 nm and 2 nm)
- [24] p8/91 "In its data book, AGC ranks itself No.2 worldwide in EUV lithography photomask b"
- [25] p45/83 "In February 2025 AGC reported that the sales reached ¥40 billion in 2024, a year"
- [26] p17/40 "The sales then declined in 2025 and were recovering in 2026, AGC said in June 20" | printed folio 16; alt: p37 (Q&A)
- [27] p52/70 "In August 2026 AGC set out capacity expansions of 20 to 50 percent across EUV bl"
- [27] p52/70 "It gave no separate figure for the blanks, and mass production on the added capa"

### 06-deposition-and-etch
- [44] p2/11 "Making one chip takes 1,000 to 1,500 steps, the Semiconductor Industry Associati" | the quoted sentence begins at the foot of p1
- [28] p16/32 "Each cycle adds a fraction of a layer of atoms wherever the gas reached, so the" | 88 FR 73439
- [28] p28/32 "Deposition and etch chambers are separate products built from similar vacuum, ga" | 88 FR 73451; partial support, see above
- [44] p2/11 "Accenture and the Global Semiconductor Alliance estimated in 2020 that a part-fi"
- [44] p2/11 "The Semiconductor Industry Association repeated the figure in 2025"
- [28] p16/32 "US regulators say that even coating makes it important for building 3D structure"
- [1] p39/98 "**Electroplating** deposits the copper used for wiring across the wafer"
- [28] p15/32 "**Gate-all-around** transistors need highly selective isotropic etch, which cuts"
- [28] p28/32 "The US Bureau of Industry and Security (BIS) controls isotropic dry etch tools t"
- [29] p15/41 "**HBM** (high-bandwidth memory) needs holes etched straight through the silicon,"
- [29] p32/41 "BIS controls the tools that etch these holes at aspect ratios (depth to width) o" | both figures in the 3B001.c.4 control text; alt: p15-16 (preamble: 10:1 on p15, 7 microns per minute on p16)
- [31] p28/29 "Tokyo Electron's own results presentation gives it 23 percent of dry etch, 27 pe" | Gartner data
- [31] p28/29 "The same presentation gives it 91 percent of coater/developers in 2025" | Gartner data
- [32] p2/17 "ASM International, the atomic layer deposition specialist, reached a record EUR"
- [32] p2/17 "Molybdenum ALD, a new use of its tools that deposits the metal molybdenum, enter"
- [31] p27/29 "**Tokyo Electron**: 34.1 percent of sales in the year to March 2026, down from 4" | alt: p5; new-equipment-sales footnote, see above
- [32] p2/17 "**ASM International**: more than 30 percent of 2025 revenue"
- [33] p1/30 "The 7 October interim final rule required a license for certain chipmaking equip"
- [33] p1/30 "It also widened foreign-produced item rules for 28 Chinese entities already on t" | p1 writes "twenty-eight"; alt: p2, p6, p7 (numeral 28)
- [28] p1/32 "The October rule, effective 17 November, rewrote the equipment entries" | alt: p15-16 (revisions to ECCN 3B001)
- [28] p16/32 "It added sideways (isotropic) and vertical (anisotropic) dry etch (ECCN 3B001.c." | d.5, d.9, d.10 on p16; 3B001.c.1 at the end of p15
- [29] p16/41 "The new equipment entries include TSV etch, and deposition into features with as" | 200:1 on p16; TSV etch entry on p15; control text pp. 32-33
- [29] p28/41 "The rule largely exempts foreign-made tools exported by firms located in Japan," | 33-country list; alt: p6 (exemption for exports by entities located in those countries), p5 (their governments can control SME)
- [29] p21/41 "Japan added advanced chipmaking equipment to its control list on 23 July 2023"
- [34] p1/14 "The Affiliates Rule extended Entity List restrictions to any company at least 50" | 90 FR 47201
- [29] p33/41 "The December 2024 rule targets advanced atomic layer deposition tools and the ex" | d.18 (ALD of Mo/Ru) and d.19 (200:1); alt: p15-16 preamble, p32 TSV etch
- [28] p16/32 "Atomic layer deposition tools coat a hole's walls and floor as evenly as its rim"
- [29] p33/41 "The December 2024 US export rule targets advanced atomic layer deposition tools" | same as the line above

### 07-metrology-and-inspection
- [36] p7/15 "KLA puts the whole wafer equipment market, including advanced packaging, at abou" | printed Page 6
- [37] p35/173 "At its March 2026 investor day KLA cited Gartner's figures for 2024, which put i" | alt: p50 (same chart)
- [38] p3/17 "In April 2026 KLA said its 2025 share was about 7 times the nearest competitor's" | printed Page 2
- [39] p10/65 "A wafer loses value two ways: whole regions ruined by mishandling, misalignment" | book page 137
- [39] p8/65 "At a defect density of 0.8 per square centimeter, with a set to 3, a 1 square ce" | book page 135
- [39] p8/65 "Because the bigger die yields less and fits fewer times on a wafer, it costs 20." | book page 135
- [39] NULL "By the same formula, an 8 square centimeter die, about as much as one exposure c" | computed, see Problems
- [39] NULL "Halving the defect density to 0.05 lifts that yield to about 69 percent" | computed, see Problems
- [39] p23/65 "A chip built from many identical blocks can carry spares and switch off a faulty" | book page 150
- [37] p91/173 "KLA's own actinic mask inspection tool was still at an early demo stage at its M"
- [38] p3/17 "KLA says its share grew 3.6 percentage points from 2021 to 2025" | printed Page 2; the letter says 360 basis points
- [38] p3/17 "It says it gained share again in 2025 across mask, optical wafer and e-beam insp" | printed Page 2
- [36] p5/15 "KLA's patterning line, which includes several metrology products and mask inspec" | printed Page 4
- [36] p5/15 "In that quarter Taiwan took 31 percent of KLA's revenue and China 26 percent" | printed Page 4
- [38] p4/17 "KLA says process control's share of fab spending is still rising" | printed Page 3; the letter says "process control intensity"; alt: p12
- [38] p4/17 "In memory chips, KLA credits the rise to higher performance specifications, less" | printed Page 3
- [38] p4/17 "KLA's systems analyze data with AI and also filter out noise" | printed Page 3
- [38] p4/17 "In April 2026 KLA said it had added AI to every product line over the previous f" | printed Page 3
- [36] p2/15 "KLA says the AI build-out is making advanced packaging, and the process control" | printed Page 1
- [38] p3/17 "KLA became the largest supplier of process control tools for advanced wafer-leve" | printed Page 2
- [36] p2/15 "It expects about $1.1 billion of packaging process control revenue in 2026, up m" | printed Page 1
- [40] p12/16 "Skyverse (Shenzhen Zhongke Feice), a maker of wafer inspection and metrology too" | alt: p16 (prose figure); "$285 million" not in PDF
- [40] p12/16 "That was up 48.75 percent on 2024 and more than double its 2023 revenue" | table columns are 2025, 2024, change %, 2023
- [40] p11/16 "In its 2025 annual report Skyverse says Chinese makers still hold a low share of"
- [33] p5/30 "In October 2022 the US began requiring a license for any US-made item, process c" | 87 FR 62190; alt: pp. 15-16 (§ 744.23 text)
- [33] p16/30 "The rule covered fabs that made logic chips at 16/14 nm or below, NAND memory wi" | 87 FR 62201; alt: p14 (same criteria in the US persons provision)
- [29] p37/41 "It controls tools for defect inspection and measurement of patterned 300 mm wafe" | 3B993.q.1 control text; alt: p18 (preamble)
- [29] p37/41 "They must do this using light with a wavelength below 400 nm, an electron beam r" | alt: p18
- [29] p37/41 "The same rule controls overlay metrology accurate to 0.5 nm or better if the too" | the two options (track, fast wavelength switching) are at the top of p38; alt: p18
- [29] p37/41 "It also controls stand-alone wafer shape metrology that feeds corrections to imm" | alt: p18
- [29] p38/41 "A separate new entry, 3B994, covers optical film and line-width metrology for 30" | alt: p18
- [29] p17/41 "BIS, the US Commerce Department bureau that wrote the rule, placed these tools i" | alt: p18 (same wording for 3B994)
- [29] p17/41 "So they carry narrower license requirements than tools built only for advanced c"
- [36] p5/15 "Yet China took 26 percent of KLA's revenue in the June 2026 quarter" | printed Page 4
- [33] p5/30 "Since October 2022 the US has required a license for any US-made tool bound for" | alt: p16 (fab criteria)
- [29] p18/41 "A December 2024 rule added specific tools to the export control list, among them" | alt: p37 (control text)

### 08-transistors-and-front-end
- [39] p8/65 "A die as large as theirs is more likely to hold a defect" | book page 135; alt: p7 (yield formula)
