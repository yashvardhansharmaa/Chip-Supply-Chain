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
