# Source audit — data files

Audit of every citation URL in `data/suppliers.json`, `data/landscape.json`,
`data/landscape-notes.md` and `data/export-controls-timeline.json` against
`brief/SOURCE_POLICY.md`. Tiers are assigned from `data/source-tiers.json`.

Run: 9 September 2026. Status: complete. All four files validate as JSON and
`node build/build.js` succeeds.

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

## Tier counts after

| File | URLs | A | B | C | D | unmapped |
|---|---|---|---|---|---|---|
| suppliers.json | 220 | 208 | 12 | 0 | 0 | 0 |
| landscape.json (`sources`) | 60 | 31 | 15 | 14 | 0 | 0 |
| landscape-notes.md | 60 | 31 | 15 | 14 | 0 | 0 |
| export-controls-timeline.json | 45 | 38 | 7 | 0 | 0 | 0 |

No Tier D and no unclassified URL remains in any of the four files. The 13
Tier D and 1 unclassified citations still reported by `dist/build-report.txt`
are all in `content/` chapters, which are outside this pass.

The 14 remaining Tier C citations in `landscape.json` / `landscape-notes.md`
are Hot Chips write-ups, hands-on teardowns and analyst detail for parts whose
vendors publish no specification at all (Google TPU v7 and 8i, Microsoft Maia
200, Meta MTIA 400, Cerebras CS-4, Moore Threads MTT S5000, AMD MI355X
interconnect and MI455X die composition, Nvidia B300 HBM stack height). No
Tier A or B source covers those facts, so under SOURCE_POLICY they stay at
Tier C. Where the prose did not already attribute the claim in text, that is
flagged under "Residual items" below rather than silently rewritten.

## Replacements

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

### export-controls-timeline.json — Micron barred from critical information infrastructure (2023-05-21)
- Old: `https://www.globaltimes.cn/page/202305/1291098.shtml` (PRC state media; unmapped, below the bar for a quantified claim)
- New: `https://www.sec.gov/Archives/edgar/data/723125/000072312523000041/mu-20230601.htm` (Tier A, Micron Q3 FY2023 Form 10-Q)
- **Number corrected.** The summary said the revenue at risk was "a low-to-high single-digit percentage of total company revenue". Micron's 10-Q says the opposite scale: "we currently estimate that approximately half of that China-headquartered customer revenue, which equates to a **low-double-digit percentage** of our worldwide revenue, is at risk of being impacted", and that mainland China and Hong Kong customers are "approximately a quarter of our worldwide revenue". The summary now reports both figures as filed.
- (Micron's 8-K of 22 May 2023, `.../000072312523000028/mu-20230522.htm`, confirms the CAC conclusion and the CII instruction but carries no quantification.)

### export-controls-timeline.json — Gallium and germanium export licensing (2023-07-03)
- Old: `https://www.iea.org/policies/17893-...` (IEA policy-database mirror; a ministry page obviously exists)
- New: `http://exportcontrol.mofcom.gov.cn/article/zcfg/gnzcfg/zcfggzqd/202307/847.html` (Tier A, MOFCOM/GAC Announcement No. 23 of 2023 on the ministry's own export-control portal)
- Verified against the announcement: issued 3 July 2023, effective 1 August 2023; eight gallium items (metal gallium, GaN, gallium oxide, GaP, GaAs, InGaAs, gallium selenide, gallium antimonide) and six germanium items (metal germanium, zone-refined ingots, phosphorus germanium zinc, Ge epitaxial substrates, germanium dioxide, germanium tetrachloride). No number changed.

### export-controls-timeline.json — Export controls on seven medium and heavy rare earths (2025-04-04)
- Old: `https://www.iea.org/policies/26796-...` (IEA policy-database mirror)
- New: `https://english.mofcom.gov.cn/Policies/AnnouncementsOrders/art/2025/art_0dd87cbee7b045bf93fabe6ab2faceee.html` (Tier A, MOFCOM/GAC Announcement No. 18 of 2025, English text)
- Verified: samarium, gadolinium, terbium, dysprosium, lutetium, scandium and yttrium, with their metals, alloys, targets, oxides, compounds and permanent magnet materials; announced and effective 4 April 2025. No number changed.

### export-controls-timeline.json — China hits Japanese dichlorosilane with duties of up to 99.2 percent (2026-09-07)
- Old: `https://www.globaltimes.cn/page/202609/1369988.shtml` (PRC state media)
- New: `https://www.mofcom.gov.cn/zwgk/zcfb/art/2026/art_01c15948864a45d186abb146fe30a42b.html` (Tier A, MOFCOM Announcement No. 37 of 2026, the preliminary anti-dumping determination)
- Verified: announced 7 September 2026, deposits payable from 8 September 2026, 80.8% for Denal Silane and 99.2% for Shin-Etsu Chemical and all other Japanese exporters. No number changed.

### export-controls-timeline.json — Big Fund III capitalised at 344 billion yuan (2024-05-24)
- URL unchanged: `https://english.www.gov.cn/news/202405/29/content_WS66569746c6d0868f4e8e7987.html`. This is the PRC State Council's own English site, Tier A under "official embassy or ministry pages"; it was simply missing from `source-tiers.json` and has been added. Verified: 344 billion yuan registered capital, six state banks at 33.14% combined, 21.5 billion yuan each from ICBC, Agricultural Bank, Bank of China and China Construction Bank.

### landscape.json / landscape-notes.md — Nvidia B200 price
- Old: `https://modal.com/blog/nvidia-b200-pricing` (Tier D, vendor blog)
- New: `https://www.cnbc.com/2024/03/19/nvidias-blackwell-ai-chip-will-cost-more-than-30000-ceo-says.html` (Tier B, the interview the Modal post was summarising)
- Verified wording: "Blackwell, will cost between $30,000 and $40,000 per unit, CEO Jensen Huang told CNBC's Jim Cramer on Tuesday on 'Squawk on the Street.'"
- **Claim removed**: "a GB200 superchip of one Grace CPU and two B200 at $60,000 to $70,000". CNBC's report carries no GB200 price; no Tier A or B source gives one. `priceEstimate` now reads "$30,000-40,000 per GPU, the range Jensen Huang gave CNBC in March 2024".

### landscape.json / landscape-notes.md — AMD Instinct MI455X throughput
- Old: `https://xenospectrum.com/en/amd-mi455x-helios-launch/` (Tier D)
- New: `https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf` (Tier A, AMD's own MI455X datasheet)
- **Numbers corrected** to the datasheet: `fp4TFLOPS` 40260 → **40265**, `fp8TFLOPS` 20130 → **20133**, `fp16TFLOPS` 5030 → **5033**.
- **Claim corrected**: the note said "AMD has not said whether these are dense or sparse". AMD's datasheet has a dedicated "w/structured sparsity" column: FP16, BF16 and INT8 double to 10,066 TFLOPS, while MXFP4, MXFP6, MXFP8 and FP8 show no sparsity figure. `precisionNote` and the prose now say so.
- Datasheet also confirms 432 GB HBM4 at 23.3 TB/s, 256 CUs, 8 XCDs, 2 IODs, TSMC 2nm/3nm and 2.4 GHz, and publishes no TDP — so "AMD has not disclosed a per-GPU TDP" stands.

### landscape.json / landscape-notes.md — OpenAI Jalapeño throughput
- Old: `https://taekim.substack.com/p/hot-chips-openai-jalapeno-presentation` (Tier D, personal Substack)
- New: `https://newsletter.semianalysis.com/p/openai-jalapeno-better-than-nvidia` (Tier B, the InferenceX benchmark itself) plus `https://openai.com/index/jalapeno-first-results/` (Tier A, OpenAI's own results post)
- **Number corrected**: "about 1,500 tokens per second per user on open-weight models" → **about 1,400** on Kimi-K2.5 and GPT-OSS; "about 700 on DeepSeek" confirmed as **over 700 tok/s/user on DeepSeek R1 at concurrency 1**.
- **Claim removed**: "from lab parts running at 1.7 GHz with 1.8 GHz targeted". No Tier A or B source gives clock speeds.
- **Claim corrected**: `interconnect.chipToChip` said "200 Gb/s Ethernet running a scale-up protocol", which no A or B source supports. Replaced with SemiAnalysis's measured figures: 4.8 Tb/s per chip inside a 128-accelerator local domain and 1.6 Tb/s across domains, up to 2,048 accelerators over 16 racks.
- The 700 W rating and the efficiency claim now stand on sources: SemiAnalysis gives a 700 W per-chip TDP, and OpenAI's results post gives 1.5x to 1.9x the throughput per kilowatt of GB200 and GB300 racks. The prose previously said "a claimed 1.9x"; it now gives the published range. ServeTheHome's launch piece, still cited for the Broadcom and Celestica relationships, carries none of these numbers.

### landscape-notes.md — Nvidia Rubin memory bandwidth (Tier C split)
- The 19.2 TB/s per-GPU figure was carried only by `techpowerup.com` (Tier C). Nvidia's own Vera Rubin NVL72 page — already cited in the same paragraph — publishes "288 GB HBM4" and "19.2 TB/s", so the specification now cites Nvidia (Tier A).
- TechPowerUp is retained only for the claim it uniquely supports, that suppliers missed an original 22 TB/s pin-speed target, and the sentence now carries the hedge SOURCE_POLICY requires for Tier C ("Industry press reports that... Nvidia has not confirmed the earlier target").

### landscape.json / landscape-notes.md — Huawei Ascend 910C teardown (Tier C upgraded)
- Old: `https://www.digitimes.com/news/a20251005PD200/huawei-ascend-tsmc-techinsights-samsung.html` (Tier C, reporting a TechInsights finding)
- New: `https://www.scmp.com/tech/tech-war/article/3328414/beijing-targets-consultancy-does-teardown-reports-huawei-chips-tech-war-widens` (Tier B, 9 October 2025)
- SOURCE_POLICY's Tier C rule requires citing the underlying source where the article is reporting one. TechInsights' own teardown sits behind its paid library, so the best available A/B source is SCMP, which reports both the finding and MOFCOM's unreliable-entity-list response.
- **Wording narrowed to the source**: SCMP says TechInsights found TSMC, Samsung and SK hynix components in Huawei's *Ascend processors*, not specifically the 910C, so the sentence now says that.

## Claims downgraded or removed — summary

| File | Record | Field | What went |
|---|---|---|---|
| suppliers.json | Nvidia | `shareNote` | "About 81% of AI accelerator revenue in 2025, projected at about 75% for 2026" → `null` |
| suppliers.json | Hoya | `shareNote` | "About 34% of EUV mask blanks; Hoya and AGC together about 93% (2024)" → `null` |
| suppliers.json | AGC Inc. | `shareNote` | "Over 59% of EUV mask blanks; AGC and Hoya together about 93% (2024)" → `null` |
| suppliers.json | Lasertec | `shareNote` | "Effectively 100% of EUV mask blank inspection" → `null` |
| suppliers.json | Disco Corporation | `shareNote` | "Estimated 70-80% of dicing saws and about 70% of wafer-thinning grinders (2025)" → `null` |
| suppliers.json | KLA | `shareNote` | "over 85% of optical wafer inspection" clause dropped; process-control share restated at Gartner's 56.5% |
| suppliers.json | Tokyo Electron | `shareNote` | "close to 100% for EUV tracks" clause dropped; coater/developer share restated at Gartner's 91% |
| suppliers.json | ASE Technology Holding | `shareNote` | "about 28% of the market" replaced with TrendForce's $18.54B / ~45% of the top ten |
| suppliers.json | Dongjin Semichem | `revenueUSDb`, `revenueYear` | 0.891 / 2025 → `null` |
| landscape.json | nvidia-b200 | `priceEstimate` | "$60,000-70,000 for a GB200 superchip" dropped |
| landscape.json | openai-jalapeno | `compute.precisionNote` | 1.7 GHz / 1.8 GHz clock claim dropped |
| landscape.json | openai-jalapeno | `interconnect.chipToChip` | "200 Gb/s Ethernet" replaced with the measured 4.8 Tb/s / 1.6 Tb/s figures |
| landscape-notes.md | Nvidia B200 | prose | GB200 superchip price sentence clause deleted |
| landscape-notes.md | OpenAI Jalapeño | prose | clock-speed clause deleted; token figures corrected |

## Figures re-verified and left unchanged

Every revenue figure attached to a replaced source was checked against the new
primary source and matched:

| Firm | Figure | Primary source |
|---|---|---|
| Nvidia | $215.9B FY2026 revenue | NVIDIA FY2026 results release |
| KLA | $13.58B FY2026 revenue | KLA FY2026 Q4 release |
| Tokyo Electron | JPY 2,443.5bn FY2026 net sales | TEL FY2026 Q4 presentation, p.6 |
| Advantest | JPY 1,128.6bn FY ended 3/2026 | Advantest FY2025 results deck, p.5 |
| DISCO | JPY 436,889m FY ended 3/2026 | DISCO consolidated results, 22 Apr 2026 |
| Lasertec | JPY 230,485m FY ended 6/2026 | Lasertec business report |
| ASE | NT$645,388m FY2025 | ASE SEC Form 6-K, 5 Feb 2026 |
| Hua Tian | RMB 17.214bn 2025 | 2025 annual report, SZSE disclosure platform |
| Advantest | 66% / 56% SoC tester share | Advantest tester market share report, p.18 |
| Tokyo Electron | 91% coater/developer share CY2025 | Gartner via TEL deck, p.28 |
| KLA | 56.5% process control share | Gartner via KLA 2026 investor day, slide 9 |
| Ajinomoto | over 95% ABF share | Ajinomoto electronic materials briefing, 30 Jun 2026, p.3 |
| AMD MI455X | 432 GB HBM4 at 23.3 TB/s | AMD MI455X datasheet |
| Nvidia Rubin | 288 GB HBM4 at 19.2 TB/s | Nvidia Vera Rubin NVL72 page |

The implied FX rates in `suppliers.json` are consistent across records
(~153.8 JPY/USD, ~31.5 TWD/USD, ~6.73 CNY/USD), so no revenue figure needed
restating.

## source-tiers.json

162 domains added, all under Tier A:

- 159 supplier corporate or IR domains (a supplier's own site is Tier A for
  the firm's role under the brief). Most were already cited but unmapped, so
  adding them only makes the tier map complete enough for the Sources page to
  label them; three — `agc.com`, `ajinomoto.co.jp` and `hoya.com` — are newly
  cited by this pass.
- 3 institutional domains newly cited by this pass: `english.www.gov.cn` (PRC
  State Council), `mofcom.gov.cn` (Ministry of Commerce, which also covers the
  `exportcontrol.` subdomain) and `szse.cn` (Shenzhen Stock Exchange disclosure
  platform, which covers `disc.static.szse.cn`).

Nothing was added to Tier B, C or D. `wing.vc` was not added to Tier D because
it is no longer cited anywhere.

## Residual items for a later pass

These are outside the brief for this pass but worth recording:

1. **`content/` chapters still carry 13 Tier D and 1 unclassified citation**
   (chapters 04, 09, 10, 11 and 18 per `dist/build-report.txt`). Not touched.
2. **Unhedged Tier C citations in `landscape-notes.md`.** SOURCE_POLICY says a
   Tier C citation must be flagged in the sentence. Several already are
   ("ServeTheHome's hands-on...", "The Next Platform reports..."). These are
   not: the B300 12-high HBM3E sentence (The Register), the MI355X Infinity
   Fabric sentence (glennklockwood.com), the MI455X die-composition sentence
   (StorageReview), the TPU 8i MediaTek sentence (The Next Platform), the MTIA
   400 spec and rack sentences (ServeTheHome, DataCenterDynamics), the Cerebras
   CS-4 rack sentence (ServeTheHome) and the Moore Threads FlagOS sentence
   (TechNode). Adding the hedge is a prose edit, not a source swap.
3. **`openai.com` blocks automated fetches** (HTTP 403 to any non-browser
   client), so `openai.com/index/jalapeno-first-results/` could not be read
   directly; its figures were confirmed through search indexing and
   independently corroborated by SemiAnalysis's InferenceX benchmark, which is
   cited alongside it. The same block applies to the OpenAI/Broadcom
   announcement URL already in the file.
4. **Unsourced supporting statistics in timeline summaries.** The gallium and
   germanium entry states China produced "roughly 98 percent of the world's
   primary gallium and about 60 percent of refined germanium"; the rare earth
   entry states China refines "roughly 90 percent of global rare earth output".
   The MOFCOM announcements now cited do not contain these figures. They are
   standard USGS numbers and a USGS Mineral Commodity Summary would carry them,
   but they are currently uncited.
5. **SemiAnalysis reports HBM4 at 15.4 TB/s per package for Jalapeño.**
   `landscape.json` still has `memory.type` "HBM" and `bandwidthTBs` null for
   that part. Filling those in is data enrichment rather than a source fix, so
   it was left alone.
