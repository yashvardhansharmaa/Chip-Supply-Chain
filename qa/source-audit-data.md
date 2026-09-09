# Source audit — data files

Audit of every citation URL in `data/suppliers.json`, `data/landscape.json`,
`data/landscape-notes.md` and `data/export-controls-timeline.json` against
`brief/SOURCE_POLICY.md`. Tiers are assigned from `data/source-tiers.json`.

Status: IN PROGRESS (written incrementally).

## Tier counts before

Counted by URL, not by record. "A (own site)" is a supplier citing its own
corporate domain, which the policy treats as Tier A for the firm's role;
those domains were absent from `source-tiers.json` and are added under A.

| File | URLs | A | B | C | D | unmapped |
|---|---|---|---|---|---|---|
| suppliers.json | 220 | 38 | 10 | 0 | 11 | 161 |
| landscape.json (`sources`) | 59 | 29 | 12 | 15 | 3 | 0 |
| landscape-notes.md | 58 | 28 | 12 | 15 | 3 | 0 |
| export-controls-timeline.json | 45 | 33 | 7 | 0 | 0 | 5 |

Of the 161 unmapped supplier URLs, 160 are the supplier's own corporate or IR
domain (Tier A by policy) and 1 is a venture-capital marketing blog
(`wing.vc`, cited for Advantest's tester share) which is Tier D in substance.
Of the 5 unmapped timeline URLs, 1 is an official PRC State Council page
(Tier A), 2 are IEA policy-database mirrors of MOFCOM announcements and 2 are
Global Times, PRC state media.

## Replacements

(filled in below as work proceeds)

## Claims downgraded or removed

(filled in below as work proceeds)

### suppliers.json — Tokyo Electron
- Old: `https://japan-earnings.com/companies/8035/` (Tier D, transcript/earnings mirror)
- New: `https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4presentations-e.pdf` (Tier A, TEL FY2026 Q4 results presentation, 30 April 2026)
- Revenue unchanged: FY2026 net sales JPY 2,443.5bn (p.6) = $15.886b at the file's ~153.8 JPY/USD.
- shareNote corrected. Old: "Roughly 90-92% of the global coater/developer market and close to 100% for EUV tracks, per a 2026 company profile". TEL's own deck (p.28) gives coater/developer world share of **91% for CY2025**, sourced to Gartner, "Market Share: Semiconductor Wafer Fab Equipment, Worldwide, 2025" (2 April 2026); p.16 states "Market share: > 90%". No Tier A or B source supports the "close to 100% for EUV tracks" figure, so that clause was **removed**.

### suppliers.json — KLA
- Old: `https://www.maximizemarketresearch.com/news/kla-corporation-semiconductor-wafer-inspection/` (Tier D, market-research SEO site)
- New: `https://ir.kla.com/news-events/press-releases/detail/518/kla-corporation-reports-fiscal-2026-fourth-quarter-and-full` (Tier A, KLA FY2026 Q4/full-year results, 28 July 2026)
- Revenue unchanged: FY2026 total revenues $13.58b, matching the stored 13.579.
- shareNote: see below (KLA's FY2026 10-K claims only "leading competitive positions", no percentage).

### suppliers.json — DISCO Corporation
- Old: `https://en.tmt-blog.jp/articles/company-disco-en` (Tier D, anonymous company-profile blog)
- New: `https://www.disco.co.jp/eg/ir/library/doc/fr/fr20260422.pdf` (Tier A, DISCO consolidated results for the year ended 31 March 2026, published 22 April 2026)
- Revenue unchanged: net sales JPY 436,889m for the year ended 31 March 2026 = $2.84b at ~153.8 JPY/USD.

### suppliers.json — Advantest
- Old: `https://www.wing.vc/content/the-chip-testing-bottleneck` (venture-capital marketing blog; unmapped, Tier D in substance)
- New: `https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_slide.pdf` (Tier A, Advantest FY2025 results presentation, 27 April 2026)
- Revenue unchanged: FY sales JPY 1,128.6bn for the year ended 31 March 2026 (p.5) = $7.337b.
- shareNote confirmed exactly by the company's own "Tester Market Share Report" (p.18): SoC tester share **66% in CY25**, up from **56% in CY24**; overall tester share 65%.

### suppliers.json — Ajinomoto
- Old: `https://www.businessresearchinsights.com/market-reports/ajinomoto-build-up-film-abf-market-122893` (Tier D, market-research SEO site)
- New: `https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/011117/teaserItems1/01/linkList/03/link/20260630_presentation_E.pdf` (Tier A, Ajinomoto "Growth Strategy for the Electronic Materials Business" briefing, 30 June 2026)
- shareNote confirmed: the deck states ABF has "established an overwhelming position in its market, maintaining a share of over 95%" (p.3). Wording of the note tightened to cite the company briefing rather than a "2025 base year" market report.

### suppliers.json — Nvidia
- Old: `https://siliconanalysts.com/analysis/nvidia-ai-accelerator-market-share-2024-2026` (Tier D, promotional analysis blog)
- New: `https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026` (Tier A, NVIDIA FY2026 results release)
- Revenue confirmed: FY2026 revenue "$215.9 billion, up 65%" (stored 215.938).

### suppliers.json — KLA (share)
- shareNote old: "Over 56% of the process control, metrology and inspection segment, and over 85% of optical wafer inspection (2025)"
- shareNote new: "56.5% of the process control market in 2024, about 6.5 times the nearest competitor, on Gartner data published in KLA's 2026 investor day"
- Source moved to the investor-day deck `2026 Investor Day_Khan_Final_IR copy.pdf` on `d1io3yog0oux5.cloudfront.net` (Tier A per policy). Slide 9 reads "Process Control Market Share … 56.5% … KLA Share in 2024 … 6.5x nearest competitor", sourced to Gartner, April 2025. The **"over 85% of optical wafer inspection" figure was removed**: KLA's FY2026 10-K claims only "leading competitive positions", the investor-day deck gives no optical-inspection percentage, and no Tier A or B source states one.

### suppliers.json — ASE Technology Holding
- Old: `https://www.congruencemarketinsights.com/report/outsourced-semiconductor-assembly-and-test-market` (Tier D)
- New: `https://www.trendforce.com/presscenter/news/20250513-12577.html` (Tier B, TrendForce top-10 OSAT ranking for 2024)
- shareNote old: "Largest OSAT at about 28% of the market (2024)". No Tier A or B source states a 28% total-market share. Corrected to TrendForce's published figures: "$18.54B of 2024 revenue, close to 45% of the combined revenue of the top ten OSATs".
- Revenue unchanged and independently confirmed: ASE's SEC Form 6-K Q4 2025 earnings release (`https://www.sec.gov/Archives/edgar/data/1122411/000095010326001662/dp241167_6k.htm`) gives FY2025 net revenues of NT$645,388m = $20.489b at the file's ~31.5 TWD/USD.

### suppliers.json — Hua Tian Technology
- Old: `https://stockanalysis.com/quote/she/002185/` (Tier D, financial data aggregator)
- New: `https://disc.static.szse.cn/disc/disk03/finalpage/2026-03-31/a0209878-88e7-443c-b062-6a33047d9c98.PDF` (Tier A, Tianshui Huatian 2025 annual report filed on the Shenzhen Stock Exchange disclosure platform, 31 March 2026)
- Revenue unchanged and confirmed: 2025 operating revenue RMB 17.214bn (up 19.03%) = $2.559b at ~6.73 CNY/USD.

### suppliers.json — Lasertec
- Old: `https://japan-earnings.com/analysis/2026/04/6920-lasertec-analysis-20260428/` (Tier D)
- New: `https://www.lasertec.co.jp/en/ir/plan/message.html` (Tier A, Lasertec business report)
- Revenue unchanged and confirmed: FY2026 (year ended 30 June 2026) consolidated net sales JPY 230,485m, down 8.3% YoY = $1.498b.
- shareNote **removed** (was "Effectively 100% of EUV mask blank inspection, per a 2026 analysis covering results through December 2025"). Lasertec publishes no share figure in its IR materials or FAQ; no Tier A or B source gives a percentage. The `role` field already states, and the company's product line supports, that it is the only supplier of actinic inspection tools, so nothing structural is lost.

### suppliers.json — Nvidia (share)
- shareNote **removed** (was "About 81% of AI accelerator revenue in 2025, projected at about 75% for 2026"). No Tier A or B source supports it. Nearest Tier B figures are different metrics — TrendForce puts GPUs at 69.7% of 2026 AI-server shipments with CSP ASICs at 27.8%, and Nvidia at 57% of the top-ten fabless IC firms' 2025 revenue; Futurum's 92% is GPUs in early 2024. None is "share of AI accelerator revenue", so the claim was dropped rather than swapped for a near-miss.

### suppliers.json — Hoya
- Old: `https://www.intelmarketresearch.com/euv-mask-blanks-market-11463` (Tier D)
- New: `https://www.hoya.com/ir/2026/en/review/it.html` (Tier A, HOYA REPORT 2026 IT business review, FY25)
- shareNote **removed** (was "About 34% of EUV mask blanks; Hoya and AGC together hold about 93% (2024)"). HOYA's own review says only that it "holds an exceptionally high market share" and shows share in an untranscribed chart; it publishes no percentage, and no Tier A or B source gives the 34% / 93% split.

### suppliers.json — AGC Inc.
- Old: `https://www.intelmarketresearch.com/euv-mask-blanks-market-11463` (Tier D)
- New: `https://www.agc.com/en/news/detail/1201109_2814.html` (Tier A, AGC release on EUVL mask blank capacity expansion)
- shareNote **removed** (was "Over 59% of EUV mask blanks; AGC and Hoya together hold about 93% (2024)"). The only figure AGC publishes is a *target* — "target sales of 40 billion JPY or more and a global market share of 50% in 2025" — not an achieved share, so it cannot stand in for the removed number.

### suppliers.json — Disco Corporation (share)
- shareNote **removed** (was "Estimated 70-80% of dicing saws and about 70% of wafer-thinning grinders (2025)"). DISCO publishes no share figure in its results materials; the nearest Tier B datapoint is Yole's ~20% share of *back-end semiconductor equipment overall* in 2023, which is a different claim.

### suppliers.json — Dongjin Semichem
- Old: `https://stockanalysis.com/quote/kosdaq/005290/` (Tier D, financial data aggregator)
- New: `https://www.trendforce.com/news/2023/12/27/insights-analysis-of-the-global-photoresist-market-in-2023/` (Tier B; supports the role — "companies like Dongjin Semichem and SK Materials have made significant progress in the field of advanced photoresists, achieving domestic production of certain ArFi and EUV photoresists")
- `revenueUSDb` (0.891) and `revenueYear` (2025) **set to null**. The figure existed only on the Tier D aggregator; dongjin.com is unreachable from here, the SEMI directory entry returns 403, and no Tier A or B source gives Dongjin's 2025 sales.
