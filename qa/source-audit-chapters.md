# CHOKEPOINTS — Source audit, chapter by chapter

Each section records the Tier D and unsupported citations removed from a chapter, what replaced them, and
what was deleted outright because nothing above Tier D carried the fact.

---

## 17 — Component Costs

**Before:** 1,325 body words, 37 sources, **23 Tier D**. **After:** 1,335 body words, 26 sources, **0 Tier D, 0 unclassified**.
All 27 unique URLs in the file, body and front matter together, resolve to Tier A or B. Front matter parses; em-dash count 0; all three figure markers present.

The chapter's whole cost model rested on `siliconanalysts.com`, a personal cost-model site, with
`stockanalysis.com` carrying every gross margin. Both are named in the Tier D list. It has been rebuilt on
**Epoch AI's B200 cost model** (Tier A), **each firm's own earnings release** (Tier A), and TrendForce, SEMI,
Yole, LightCounting and SemiAnalysis (Tier B). This also settles open item 3 in `qa/factcheck-report.md`,
which flagged that chapter 12 calls per-unit CoWoS cost estimates untraceable while chapter 17 built a bill of
materials on them; the packaging line now comes from Epoch's top-down derivation off TSMC's advanced
packaging revenue, not from a circulated per-unit figure.

### Replacements

| Fact | Old source (tier) | New source (tier) | What changed |
|---|---|---|---|
| B200 manufacturing cost | siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown (D) | epoch.ai/data-insights/b200-cost-breakdown (A) | ~$6,750 → **~$6,400**, with the published range $5,700-7,300 |
| HBM line on a B200 | siliconanalysts.com (D) | epoch.ai (A) | $3,250 / 48% → **$2,900 / 45%**, at $14-17 per GB |
| Logic die line | siliconanalysts.com (D) | epoch.ai (A) | ~$850 / 13% → **$900 / 14%** |
| CoWoS packaging line | siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026 + gr8ham.substack.com (D) | epoch.ai (A) | $750 CoWoS-S / $1,000-1,500 CoWoS-L → a single **$1,100** CoWoS-L line for the B200 |
| Packaging scrap | siliconanalysts.com (D) | epoch.ai (A) | "60-70% interposer yield, adds ~$1,000" → **65-95% packaging yield, $1,000 line item** with range $430-1,700 |
| Wafer price for Blackwell | siliconanalysts.com/guide/semiconductor-costs (D), N5/N4 ~$18,500 | epoch.ai (A) | **$17,000 per 4NP wafer**, the price actually used in the model |
| N2 / N3 wafer price | technode.com (C) + trendforce.com (B) | trendforce.com (B) only | Same numbers; the Tier C carrier of a TrendForce report was dropped per the policy's Tier C rule |
| Die yield | fog.misty.com yield_models.pdf + ljdevice.com.tw (D) | epoch.ai (A) | Murphy's model at 0.10 defects/cm2 → **40-70% good, centred on 60**, which is what the cost model uses |
| HBM forward pricing | siliconanalysts.com/data/hbm-pricing (D) | trendforce.com Vera Rubin piece (B) | $300/stack, $12.20-16.67 per GB → **Bernstein's HBM4 at $53 per GB by 2027** |
| Vera Rubin rack cost | shanethegamer.com (D) | trendforce.com (B) | $7,803,148 (Morgan Stanley via a Tier D blog) → **Bernstein's "as much as $9.1M"**, reported by TrendForce |
| Memory share of a Rubin system | shanethegamer.com (D) | trendforce.com (B) | 26% of rack cost → **near 29% of the VR200 bill of materials against Nvidia's 20% target**, plus the SOCAMM halving that cut LPDDR5X from $1.2M to $586,000 |
| Rack power comparator | blog.barrack.ai (D) | docs.nvidia.com (A) | Rubin ">250 kW" → **GB300 NVL72 at 142 kW**, Nvidia's own reference architecture |
| Gross margins, 11 firms | stockanalysis.com × 10 (D) | 10 company earnings releases (A) | See below |
| Gartner market size | intelligentcio.com (D) | gartner.com newsroom (B) | Same $809B / $1.6T / $837B, cited to Gartner directly |
| Hyperscaler capex | 247wallst.com on UBS (D) | epoch.ai/data-insights/hyperscaler-capex-trend (A) | UBS's neocloud-inclusive $492B / $1.009T → **$448B (2025) and $770B (2026)** for Alphabet, Amazon, Meta, Microsoft and Oracle, matching chapters 01 and 16 |
| Equipment market | "Wafer fab equipment $117B" (uncited in the figure) | semi.org (A) | **$135.1B of 2025 equipment billings** |
| Advanced packaging market | "advanced packaging estimate" (uncited) | yolegroup.com (B) | **$55B in 2025** |
| Optical transceiver market | "$15B" (uncited) | lightcounting.com (B) | **$23.8B in 2025** |

Gross margin sources, one per firm, all Tier A: Micron `investors.micron.com` (Q3 FY2026 and FY2025),
Nvidia `nvidianews.nvidia.com` (Q2 FY2027 and FY2026), TSMC `pr.tsmc.com`, KLA `ir.kla.com`,
ASML `asml.com`, Lam `newsroom.lamresearch.com`, Applied Materials `ir.appliedmaterials.com`
(cross-checked against its SEC 8-K exhibit), Ibiden `ibiden.com` quarterly tanshin PDF,
ASE via its own PR Newswire release, Amkor via its SEC 8-K exhibit, SK hynix `news.skhynix.com`.

### Corrections found while re-sourcing

- **SK hynix's "76.3% gross margin" was an operating margin.** The aggregator figure the chapter carried was
  SK hynix's Q2 2026 *operating* margin. SK hynix publishes no gross margin at all in its English results, so
  it has been taken out of the gross-margin table and given its own sentence, labelled as operating margin.
- **The margin table's "Latest 12 months" column was a trailing-twelve-month aggregate that no filing states.**
  Replaced with each firm's **most recent reported quarter**, which every firm does publish. That also makes
  the table current to between May and August 2026 rather than to a mix of stale fiscal years.
- **Micron's move is far larger than the chapter said**: 39.8% for fiscal 2025 to **84.6%** in the quarter to
  May 2026, not 72.6%.

### Removals (no Tier A/B/C source found; line deleted from table, figure and prose)

1. **The entire H100 bill-of-materials column** (logic ~$300, HBM ~$1,350, packaging ~$750 CoWoS-S, test
   ~$920, total ~$3,320, price ~$27,000). The $3,320 traces to a 2023 Raymond James note that survives only
   in Tier C and Tier D carriers (Tom's Hardware, the-decoder, siliconanalysts); no per-line breakdown exists
   above Tier D. Epoch AI's model does not cover the H100.
2. **The entire Rubin VR200 bill-of-materials column** (logic ~$1,250-1,590, HBM ~$4,800 derived at
   $16.67/GB, packaging $1,500+, price ~$50,000-55,000). These were derived by the previous author from
   Tier D prices and a Tier D spec page. Rubin is now covered only at rack and system level, where Tier B
   estimates exist.
   *The BOM table therefore carries one generation instead of three, and its `###` heading changed from
   "Three generations of bill of materials" to "The B200 bill of materials".*
3. **CoWoS-S at $750 versus CoWoS-L at $1,000-1,500, and the "premium of at least 47 percent"** — no source
   above Tier D, and chapter 12 already warns these circulated per-unit figures are untraceable.
4. **"ABF substrate about 40 percent of packaging cost"** (gr8ham.substack.com). Folded into Epoch's $480
   "substrate, board, test, other" line.
5. **HBM stack prices** ($300 per 36 GB HBM3E stack, $550 per HBM4 stack, $12.20/GB in July 2026,
   $16.67/GB in January 2026) — siliconanalysts only.
6. **TSMC N5 defect density 0.10-0.11 (2020) and N3 at 0.09-0.14**, plus the semiwiki.com note that N2 is
   lower — ljdevice.com.tw and siliconanalysts; the semiwiki line was a forum thread.
7. **Murphy's yield model worked example** (47 percent at 0.10 defects/cm2 on an 800 mm2 die) — the only
   source was a course-notes PDF mirror on fog.misty.com.
8. **N5/N4 wafers near $18,500** and **A16 at up to $45,000** — siliconanalysts, and a Tom's Hardware rumour
   piece respectively.
9. **GB300 NVL72 rack priced near $5.0M** — datagravity.dev.
10. **Vera Rubin memory at $2,001,600 against $373,939 on Grace Blackwell** — shanethegamer.com.
11. **"Packaging prices rise three to four times faster than wafer prices"** — gr8ham.substack.com.
12. **"An independent estimate puts the B200 module at $5,700 to $7,300"** — gr8ham.substack.com. The same
    range is now Epoch's own confidence interval, so the sentence was redundant as well as unsourced.
13. **Rubin rack configuration detail** (two compute and two I/O dies, four-reticle CoWoS-L, 288 GB HBM4) —
    blog.barrack.ai. Chapter 15 covers the rack shape from Nvidia's own pages.

### Other edits

- `specimenCaption` no longer cites a defect density of 0.07 per cm2 (that number went with the Tier D yield
  sources); it now says "at the 60 percent die yield Epoch AI models for Blackwell, about forty survive",
  which is the same arithmetic on a Tier A input.
- `plain` and the first paragraph under "How it works (the cost model)" remain identical, 83 words. One word
  changed in both, in step: the logic die is "about a seventh" of build cost, not "about an eighth",
  because Epoch puts it at 14 percent rather than 13.
- `card.costSignal`, `card.leaders` and all eight `keyFacts` re-pointed at the new sources.
- All three figures rebuilt: `b200-bom` is now a five-line dollar stack from Epoch AI (was a percentage stack
  from siliconanalysts); `gross-margins` is ten firms' most recent reported quarter (was eleven firms' fiscal
  years from stockanalysis, including the SK hynix error); `market-2025` swaps in SEMI, Yole, LightCounting
  and Epoch for the uncited and Tier D entries.
- `data/source-tiers.json`: added `newsroom.lamresearch.com`, `ir.appliedmaterials.com`, `ir.kla.com`,
  `investors.micron.com`, `investor.tsmc.com`, `amkor.com`, `ir.amkor.com` and `aseglobal.com` to Tier A.
  The first five already resolved by suffix match; the Amkor and ASE domains were absent altogether and would
  have come back unclassified.

## 06 — Photomasks and Pellicles

Body words 1,346 → 1,103 (−18.1%). Tier D citations 3 → 0.

### Replacements

1. **Photronics fiscal 2025 revenue** — `nasdaq.com/press-release/photronics-reports-full-year-and-fourth-quarter-fiscal-2025-results-2025-12-10`
   → `globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html`
   (Tier A, the company's own wire release). Nasdaq was a mirror of the same text. Verified by WebFetch:
   revenue $849.3M, IC $615.1M, FPD $234.2M. **No number changed.** Swapped in `keyFacts` and in the body.

### Removals (no Tier A/B source found)

2. **"A 2026 survey is lower, at $10 million to $20 million over 70 to 100 layers at 3 to 5 nm"**
   (semiconductorinsight.com). No Tier A/B or C source carries that range; searches returned only
   market-research SEO pages and aggregators. Sentence deleted. The `$10M to $40M` range in the text,
   in `card.costSignal` and in the `mask-set-cost` figure now rests entirely on SemiAnalysis (Tier B),
   which already spans $10M at 7 nm to $40M at 3 nm, so the figures stay consistent.
3. **"Newway of Shenzhen began 40 nm trial production in the second half of 2025"** (newwaymask.com — the
   company's own promotional site, listed Tier D). The claim traces only to Newway's own investor page and
   to aggregator mirrors of it (MarketScreener, stockanalysis, PatSnap). The underlying document is a
   Shanghai Stock Exchange filing for 688401.SH that is not fetchable, and neither TrendForce nor Reuters
   nor any Tier C trade outlet I could verify covers it. Sentence deleted, and the Newway clause removed
   from `card.chinaStatus`, which now reads: "No EUV mask capability. SMIC runs two captive mask shops in
   Shanghai for g-line, i-line, KrF and ArF tools. There is no Chinese EUV blank, no Chinese actinic
   inspection tool and no Chinese multi-beam writer." The China paragraph keeps the SMIC citation
   (smics.com, Tier A) and the three "no Chinese X" claims, so the chapter's China argument is unchanged.

### Tier C hedges added

- `dri.co.jp` (Tier C) carries the two headline numbers, $259.25M and 93.7%. The sentences now name the
  analyst: "QY Research puts that blank market at $259.25 million in 2024" and "On QY Research's numbers
  AGC and Hoya held about 93.7%". The `keyFacts` entry gained "(QY Research estimate)".
- `semiengineering.com` (Tier C) attributions named in-line where the claim is an opinion rather than a
  measurement ("D2S told Semiconductor Engineering").

### Prose

Cut Hoya's "competition will intensify" quote (a hedged corporate statement with no number, and the point
is already made by 93.7%); cut the D2S resist-speed paragraph, which duplicated the "Write time and
placement" criterion verbatim; merged the pellicle definition and folded the four-paragraph pellicle
section to the same four ideas in 160 words. `plain` reworked and kept byte-identical to the first
paragraph under "How it works", 95 words: the inverted "For the shortest light now in use no glass is
transparent" became "No glass is transparent to the short light now in use".

## 07 — Deposition and Etch

Body words 1,327 → 1,127 (−15.1%). Tier D citations 1 → 0.

### Replacements

1. **"Lam claims Cryo 3.0 cuts profile deviation by 80 percent"** —
   `quartr.com/events/lam-research-corporation-lrcx-investor-day-2025_33D7JGMm`
   → `newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era`
   (Tier A, Lam's own release; resolves by suffix to `lamresearch.com`).
   **The number was wrong and is corrected.** Lam does not claim an 80 percent reduction. Verified by
   WebFetch, Lam claims "less than 0.1% deviation in the feature's critical dimension from the top to the
   bottom" on channels "up to 10 microns" deep and "more than 50 times deeper than their width". The
   sentence now reads: "Lam chills the wafer to sharpen the profile, and says Cryo 3.0 holds
   critical-dimension deviation under 0.1 percent down channels 10 microns deep."
2. **"Lam expects equipment intensity per leading-edge wafer to rise more than 50 percent"** — same quartr
   URL. The figure comes from Lam's February 2025 investor day; Lam's own deck
   (`filecache.investorroom.com/mr5ir_lamresearch2/1435/…`) returns HTTP 403, the SEC full-text search for
   "intensity per leading-edge wafer" returns zero hits, and Lam issued no press release carrying it, so
   the claim could not be verified against a Tier A or B source. **The 50 percent number is deleted.**
   The backside-power bullet now carries a verified Tier A equivalent from the other side of the trade:
   `globenewswire.com/news-release/2024/07/08/2909540/0/en/applied-materials-unveils-chip-wiring-innovations-for-more-energy-efficient-computing.html`
   — "the introduction of backside power delivery is expected to increase Applied's wiring opportunity by
   another $1 billion per 100K WSPM". Same point (backside power raises tool intensity), verified number.

### Tier C hedge added

- `semiconductor-digest.com` (Tier C) is reporting SEMI. SEMI's own release
  (`semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025`) carries
  the identical figures ($135.1B, +15%, $117.1B, China $49.3B, China+Taiwan+Korea 79%) but semi.org returns
  HTTP 403 to WebFetch, so I could not verify the URL and left the citation where it is. The sentence now
  names the underlying source: "SEMI put global equipment billings at $135.1 billion in 2025."

### Prose

Removed the Tokyo Electron $150-170bn spending forecast (a market projection that did not bear on the
chokepoint argument, and the `equipment-billings` figure already shows the trend); removed the atomic layer
etch bullet (the only uncited item in the taxonomy); converted the "AI-specific pull" paragraph into three
bulleted items per the editing brief; deleted the duplicate 7 microns/minute threshold from the
"Throughput" criterion, which repeated the HBM bullet. `plain` shortened to 102 words and kept identical to
the first paragraph under "How it works", with "Most of these machines come from four firms" made active
("Four firms in America, Japan and the Netherlands make most of these machines").

## 08 — Metrology and Inspection

Body words 1,338 → 1,132 (−15.4%). Tier D citations 1 → 0.

### Replacements

1. **The yield model, cited five times** — `fog.misty.com/perry/cod/references/yield_models.pdf`
   (a personal-domain mirror of Prof. Robert Leachman's UC Berkeley IEOR 130 handout; no Berkeley-hosted
   original exists any more) → `web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf`
   (Tier A, Behrooz Parhami, *Dependable Computing: A Multilevel Approach*, UCSB, Part II "Defects:
   Physical Imperfections"). Verified by extracting the PDF text locally.
   **The model changed, so the numbers changed with it.** The old text used the Poisson form
   `DY = exp(-D0 x A)`. Parhami gives the negative-binomial form
   `Die yield = [1 + (defect density x die area)/a]^-a`, with `a` between 3 and 4 for modern CMOS, plus a
   worked example: at 0.8 defects/cm2 a 1 cm2 die yields 49 percent and a 2x2 cm die 11 percent, and
   because die cost is area divided by yield the larger die costs about 20 times as much. Consequences:
   - `keyFacts[0]` now reads "Die yield is (1 + D0A/a) to the power minus a, with a of 3 to 4 for modern
     CMOS, so defect density and die area alone set the ceiling".
   - The 8 cm2 accelerator example moves from "roughly 45 percent at 0.10 and roughly 67 percent at 0.05"
     to **about 49 percent at 0.10 and about 69 percent at 0.05**, which is the same arithmetic on the new
     formula (0.10 x 8 is the same lambda as the source's own 0.8 x 1 case).
   - `plain`, and the identical first paragraph under "How it works", change from "from under half to about
     two-thirds" to **"from about half to about seven in ten"**.
   - The old line "Defect density is additive across layers, so total yield is the product of each layer's
     contribution" is **deleted**: Parhami does not state it and no better source was found.
   - The defect taxonomy is re-cast in the source's own terms: gross-area defects (mishandling,
     misalignment, over-etching) versus spot defects (stray material, airborne particles).
   - The `Time to result` criterion lost its citation; it makes no numeric claim, so it now stands
     uncited alongside `Nuisance rate` and `Sampling plan`.

### Tier C hedge added

- `drrobertcastellano.substack.com` (Tier C) carries KLA's 64.1 percent share, which is the chapter's
  headline. The lead now names the underlying dataset: "on The Information Network's data KLA held 64.1
  percent of metrology and inspection in 2025". The `pc-share` figure already labelled it that way.

### Prose

Cut the paragraph restating KLA's revenue mix, which the `kla-mix` figure already shows (kept the two
numbers the figure does not carry: patterning +61 percent year on year, and the Taiwan 31 / China 26 split);
cut the sentence restating the e-beam bullet's 15x throughput; dropped the voltage-contrast clause, a third
capability claim after two. `plain` is 93 words and byte-identical to the first paragraph under "How it
works".

## Source tiers

`data/source-tiers.json`: added `ucsb.edu` to Tier A, next to `purdue.edu`, for the Parhami dependable-
computing chapter now cited in 08. No other new domain was needed: `globenewswire.com` was already Tier A,
and `newsroom.lamresearch.com` resolves by suffix to `lamresearch.com`.

---

## 12 — Advanced Packaging

**Before:** 1,336 body words, 14 sources, **1 Tier D**. **After:** 1,133 body words, 14 sources, **0 Tier D, 0 unclassified** (15.2% of the words cut). Front matter parses; six em dashes, all in Key-evaluation-criteria bullets; both figure markers present.

The chapter's capacity spine, including the `cowos-capacity` figure, rested on `xenospectrum.com`, which was
itself compiling TrendForce and SemiWiki numbers. It has been rebuilt from TrendForce's own press releases,
one release per year, and the years TrendForce never published have been dropped rather than carried.

### Replacements

| Fact | Old source (tier) | New source (tier) | What changed |
|---|---|---|---|
| CoWoS capacity, end-2023 | xenospectrum.com/en/cowos-packaging-bottleneck-nvidia (D) | none found | **Deleted.** No TrendForce release states an end-2023 monthly figure; the August 2023 release quotes ~11,000 wpm from Morgan Stanley, which is a bank estimate carried by a press item, not a TrendForce number. The 2023 bar left the figure. |
| CoWoS capacity, 2024 | xenospectrum.com (D), 35,000-40,000 | trendforce.com/news/2024/12/13 (B) | **35,000 wafers a month**, TrendForce's own wording ("reaches 35,000 wafers this year") |
| CoWoS capacity, 2025 | xenospectrum.com (D), ~75,000 | trendforce.com/news/2025/01/02 (B) | **75,000**, unchanged, now cited to the release that states it |
| CoWoS capacity, 2026 | xenospectrum.com (D) | trendforce.com/news/2026/06/15 (B), already in the chapter | **120,000-140,000**, unchanged |
| Nvidia's share of CoWoS | xenospectrum.com (D) on a Morgan Stanley estimate, ~60% and ~595,000 wafers across TSMC and its OSATs; plus digitimes.com (C) "more than half of the 2026-2027 expansion" | trendforce.com/news/2026/08/05 (B) | **800,000 to 850,000 wafers of TSMC's 2026 CoWoS capacity, more than 50% of the total.** Both the number and its basis changed: it is TSMC capacity for one year, not TSMC-plus-OSAT capacity across an expansion. The Tier C DigiTimes citation went with it. |

`figures.cowos-capacity` was `[["2023",15],["2024",38],["2025",75],["2026",130]]` sourced to XenoSpectrum;
it is now `[["2024",35],["2025",75],["2026",130]]` sourced to TrendForce, with the label naming all three
releases and saying the 2026 bar is the midpoint of 120,000-140,000.

### Removals

- The paragraph beginning "Public per-unit cost estimates for a finished package do not trace to a primary
  source" — a hedge carrying no sourced number, and its second sentence made an uncited growth claim.
- The COUPE silicon-photonics paragraph (TrendForce, Tier B). Sound source, but it is a fourth subject in a
  section about China and the interposer roadmap; its citation went with it.
- Restated context: the CoWoS-S 3.3x ceiling in prose (the table above it already gives it), the C4-bump and
  lidding step, and "Stacking logic on logic is the vertical axis" under a heading that says 3D.
- Takeaways: "grew roughly ninefold in three years" → **"roughly quadrupled between 2024 and 2026"**, which is
  what the surviving TrendForce series supports.

---

## 14 — Test and Assembly

**Before:** 1,337 body words, 25 sources, **1 Tier D**. **After:** 1,133 body words, 23 sources, **0 Tier D, 0 unclassified** (15.3% of the words cut). Front matter parses; no em dashes; all three figure markers present.

Every tester-market number came from an `investing.com` write-up of Advantest's FY2025 slides. Advantest
publishes the same slides and a bilingual speaker's note itself, so the note is now the source, and reading it
corrected one share and replaced a growth rate the chapter had rounded from the wrong series.

### Replacements

All four go to Advantest's FY2025 results briefing note, `advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf` (Tier A).

| Fact | Old (tier) | What changed |
|---|---|---|
| Advantest overall tester share | investing.com (D), "65% in 2025, up from 58% in 2024" | **65% confirmed.** The 58% comparator is gone: Advantest's briefing states no CY2024 overall share. Replaced with the gain it does state, **66% of SoC test, up about ten points year on year**. |
| Advantest memory tester share | investing.com (D), 61% | **Corrected to about 60%** ("although our market share declined by approximately 2 percentage points, it remained at around 60%") |
| Tester market size | investing.com (D), "grew about 50% in 2025 to roughly US$9.0 billion" | **US$9.0 billion confirmed** (SoC US$6.9B + memory US$2.1B). The 50% growth figure is not in Advantest's note; the Takeaways now use the growth rate Advantest does publish, **the SoC tester market up about 68% year on year**. |
| `ate-share` figure source | investing.com (D) | Relabelled "Advantest FY2025 results briefing, April 2026" with the Advantest URL |

The two Advantest claims already sourced to `Investors_Guide_2504E.pdf` (the ~80% combined share, and the
switching-cost argument) were left alone: that guide is Advantest's own, already Tier A.

### Removals

- **Disco's "more than 4,000 laser saws shipped"** and its `disco.co.jp/eg/news/corp/20260302.html` citation:
  a third statistic in a bullet that already establishes Disco's lead and its 400 mm panel saw.
- **The 5.5-reticle 98% yield restatement** — chapter 12 carries it; the TrendForce citation stays on the 2028
  package fact in the same sentence.
- **"up 3%" on 2024 OSAT revenue and ASE's absolute US$18.54 billion** — both in chapter 12; the 44.6% share
  that does work here survives.
- **Amkor's separate ground-breaking citation** (trendforce.com/news/2025/10/14) folded into the ten-year TSMC
  partnership sentence; chapter 12 carries the ground-breaking.
- **"Probe cards have the same property one level down"** — restates the probe-card paragraph two sections up.
- **"which is why tester revenue grew faster than unit volumes in 2025"** — an uncited claim inside a criterion
  bullet.
- The wafer-level burn-in paragraph merged into the known-good-die paragraph under "How it works", keeping both
  Aehr citations and the nine-wafers-at-once number, dropping the FOX-XP model name.

---

## 15 — Systems and Networking

**Before:** 1,313 body words, 16 sources, **1 Tier D**. **After:** 1,114 body words, 15 sources, **0 Tier D, 0 unclassified** (15.2% of the words cut). Front matter parses; five em dashes, all in Key-evaluation-criteria bullets; all three figure markers present.

### Replacements

| Fact | Old source (tier) | New source (tier) | What changed |
|---|---|---|---|
| Broadcom AI semiconductor revenue | finance.yahoo.com earnings-call write-up (D) | sec.gov 8-K exhibit 99.1, Q3 FY2026, filed 2 September 2026 (A) | **$16.7 billion, up 221% year over year** — both confirmed verbatim in the exhibit ("Q3 AI semiconductor revenue of $16.7 billion grew 221% year-over-year, and 54% quarter-over-quarter"). The quarter-over-quarter figure was added to the keyFact. |
| "Custom XPUs 73% of AI revenue" | finance.yahoo.com (D) | none found | **Deleted.** Broadcom's 8-K gives no XPU-versus-networking split; the CEO's quoted line is qualitative ("Demand for our custom AI accelerators and networking continues to be very strong"). No Tier A or B source states the 73%. The sentence now stops at the revenue and its growth. |

### Removals

- **The AMD Helios paragraph** (72 MI450-series GPUs, 260 TB/s, Oracle's 50,000 sockets) and its
  `nextplatform.com` (C) citation: a second example of the open scale-up approach that the UALink bullet
  already makes, and the chapter's own argument is that scale-up leverage sits with NVLink.
- **The Quantum-X Photonics bullet** (144 ports of 800G): a second Nvidia co-packaged-optics product. The
  Spectrum-X line survives because its "four times fewer lasers" is the fact that bears on the chapter's
  thesis; its `nvidianews.nvidia.com` citation carries both.
- **The voltage-regulator sentence** under "How it works": the thousand-amp fact is already in the `plain`
  paragraph directly above it.
- Tomahawk 6 Davisson's "sixteen 6.4 Tbps optical engines at 200 Gbps per channel" cut back to the power
  number; the globenewswire citation stays and still carries the 3.5x in the criteria list.

---

## 16 — Data Centers and Power

**Before:** 1,309 body words, 17 sources, **4 Tier D**. **After:** 1,106 body words, 15 sources, **0 Tier D, 0 unclassified** (15.5% of the words cut). Front matter parses; five em dashes, all in Key-evaluation-criteria bullets; all three figure markers present.

Four Tier D domains carried the cost model, the cooling market and the whole rack-power figure. Two were
replaced with analysts who publish the same series (Dell'Oro, TrendForce), one with JLL's own outlook, and the
numbers moved materially in three of the four cases.

### Replacements

| Fact | Old source (tier) | New source (tier) | What changed |
|---|---|---|---|
| Liquid cooling market | gminsights.com (D), "$4.8B in 2025" | delloro.com, January 2026 (B) | **Close to $3 billion in 2025, roughly double 2024, approaching $7 billion by 2029.** The market is about 40% smaller than the chapter said, which strengthens rather than weakens the point it was making. |
| Liquid cooling vendor shares | gminsights.com (D), "Vertiv 11.3%, top five 35%" | delloro.com (B) | **Deleted.** Dell'Oro names Vertiv as the leader with CoolIT, nVent, Boyd and Aaon behind it, and publishes no percentages in the release. The card's Vertiv line changed from "11.3% of data center liquid cooling (2025)" to "Leads the data center liquid cooling market (2025)". |
| Cost per critical IT megawatt | globaldatacenterhub.com (D), "$8-14M air-cooled, $17-25M liquid-cooled" | jll.com, 2026 Global Data Center Market Outlook (B) | **$10.7M per MW in 2025, up from $7.7M in 2020, forecast $11.3M in 2026 — shell and core only — plus up to $25M per MW for an AI tech fit-out.** Card `costSignal` and the "Cost per megawatt" criterion were rewritten to match, and the criterion renamed from "Cost per critical IT megawatt" because JLL's basis is not critical IT load. |
| "GPUs cost $500M-$1B against a $200-300M building in a 20 MW hall" | globaldatacenterhub.com (D) | none found | **Deleted**, with its keyFact. The point it carried, that the building is the cheap part, now rests on JLL's fit-out figure being more than twice the shell and core. |
| "Liquid cooling adds 7-10% to construction cost, cuts floor area 70-85%" | globaldatacenterhub.com (D) | none found | **Deleted.** Nothing above Tier D was found for either number. |
| Rack power by generation | introl.com (D) for 600 kW Kyber, blog.barrack.ai (D) for Vera Rubin ">250 kW" and "GPUs rated 1,800-2,300 W" | trendforce.com press release, 25 June 2026 (B) | **About 150 kW for GB300, about 225 kW for Vera Rubin VR200, about 660 kW for Rubin Ultra in 2H27.** All three numbers changed. The GPU wattage range was deleted. |

Nvidia's own pages were checked first for the rack figures and do not carry them: the OCP/Vera Rubin blog
gives 800 VDC, 45 °C water and 576 GPUs but no kilowatts, and the 800 VDC developer blog gives only "racks
ranging from 100 kW to over 1 MW". Nvidia's reference architecture figure of **142 kW for a GB300 NVL72**
(docs.nvidia.com, Tier A) is kept where precision matters, in "How it works" and in the rack-density
criterion; the generational series in the figure and the trajectory sentence is attributed to TrendForce in
the text, so the two numbers do not read as a contradiction.

`figures.rack-power` was `[["GB200 NVL72 (2024)",120],["Vera Rubin NVL72 (2026)",250],["Rubin Ultra Kyber NVL576 (2027)",600]]`
across two Tier D blogs; it is now `[["GB300 NVL72 (2025)",150],["Vera Rubin VR200 (2026)",225],["Rubin Ultra (2027)",660]]`
on one TrendForce release.

### Removals

- **The Southern Company paragraph** (17 GW of signed contracts against 1.2 GW operating, ~$2B per GW,
  generation arriving around 2031) and its `datacenterfrontier.com` citation: a second example of the
  announced-versus-energised gap that ERCOT's 438 GW against 5.9 GW already makes harder.
- Ironwood's "30 times its 2018 part" (the doubling per watt survives, same citation).
- The 2014 figure of 58 TWh in prose; the `us-dc-electricity` figure still carries it.
- "Voltage changes next" and similar throat-clearing openers across "How it works".

---

## Source tiers (second addition)

`data/source-tiers.json`: added **`jll.com` to Tier B**, placed with the named-methodology analysts. JLL
publishes its own annual data center construction-cost series with a stated basis (shell and core, global
average, per MW) and is the standard citation for it in the trade press, which puts it alongside Gartner and
IDC rather than with the SEO market-research sites in Tier D. No other new domain was needed: `delloro.com`,
`trendforce.com`, `advantest.com` and `sec.gov` were already classified.

---

# 02 · Chip Design, EDA and IP

**Words: 1,319 → 1,116 (-15.4%). Tier D citations: 3 → 0.**

### Replacements

**`siliconanalysts.com/market-data/nre-design-cost` → `newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor` (Tier B, verified).**
The Tier D site was the only support for the IBS series ($257M at 7 nm, $479M at 5 nm, $585M at 3 nm), and it
appeared four times: in `keyFacts`, as the source of `figures.design-cost`, in the "How it works" cost paragraph
and in the Takeaways. No Tier A or B source carries that series. The SIA design-cost slides (semiconductors.org,
Tier A) and the SemiEngineering pieces that carry IBS numbers both refuse WebFetch and curl (403), so the IBS
figures could not be verified anywhere above Tier D and were removed rather than re-hedged.

What replaced them, from a SemiAnalysis piece that was verified in full: photomask set cost by node (over $1M at
28 nm, over $10M at 7 nm, about $40M at 3 nm) and the observation that startups have carried a leading-edge design
to tape-out on TSMC 7 nm for $50M to $75M, software and validation included. The figure `design-cost` is therefore
retired and replaced by `mask-cost` (bars: 28 nm 1, 7 nm 10, 3 nm 40, titled so the first two read as floors), and
`card.costSignal` now reads "A 3 nm photomask set runs about $40M, and startups have taken a 7 nm design all the way
to tape-out for $50-75M". This is a better fact for the chapter than the IBS series: it is verifiable, it is not
contested by practitioners, and it quantifies the thing the `plain` paragraph already promises the reader ("changing
one street costs a new set of printing plates").

**`finance.yahoo.com/.../broadcom-q3-earnings-call-highlights` → `sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm` (Tier A, verified).**
Broadcom's own Q3 FY2026 earnings release, filed as an 8-K exhibit, confirms $16.7bn of AI semiconductor revenue,
up 221% year on year. **Number changed:** the claim that XPUs were "73% of it" is dropped. That split comes from the
earnings call, not the release; the release says only "demand for our custom AI accelerators and networking continues
to be very strong", and no Tier A or B source reporting the 73% could be verified. The `keyFacts` entry and the
`card.leaders` Broadcom line were rewritten to match.

**`semiconhunt.com/.../india-employs-20-percent-global-chip-design-workforce` → `pib.gov.in/PressReleasePage.aspx?PRID=2148393` (Tier A).**
India's Press Information Bureau, releasing for the Ministry of Electronics and IT, states: "India is home to nearly
20% of the world's chip design engineers." **Number changed:** the headcount of 125,000 is dropped, because PIB gives
the share and not the count, and no government or Tier B source verified the absolute number. `card.countries.IN` now
reads "Nearly 20% of the world's chip design engineers, on the Indian government's count". Verified by curl rather
than WebFetch, which pib.gov.in answers with 403.

### Hedges added

`tomshardware.com` is Tier C and carries four numbers in this chapter (Google's 44% TCO claim, the Broadcom-Marvell
95% share, Broadcom's 3.5D package area, the Huawei and Cambricon unit targets). The two load-bearing share claims
now say "on trade-press figures" and "on trade-press estimates" in the sentence.

### Removals

- The "Where the designers sit" section (four bullets restating `card.countries`); the one fact in it not in the card,
  India's share of the design workforce, moved into "Who makes it" with the new Tier A source.
- The per-segment share list in "The EDA flow" (90% static timing, 84-85% synthesis, 85% physical verification, 55-60%
  emulation), which `figures.tool-lock` prints immediately below it. One anchor number survives in the prose.
- The per-vendor revenue split in the first paragraph of "Who makes it", for the same reason: `figures.eda-share` has it.
- "The cut-off lasted five weeks" in "The chokepoint", already said in the lead.

### New domains

`pib.gov.in` → Tier A, with the other government and ministry sources.

---

# 03 · Silicon and Wafers

**Words: 1,330 → 1,133 (-14.8%). Tier D citations: 2 → 0.**

### Replacements

**`mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market` → `koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658` (Tier B, verified).**
Mordor supported the chapter in six places. The concentration claim is now sourced to Korea JoongAng Daily, which was
already cited in the chapter and states: "The global silicon wafer market is also highly concentrated, with five
companies — including SK siltron — accounting for more than 90 percent of global market share." **Number changed:**
"about 85 percent of global 300 mm capacity" becomes "more than 90 percent of the global wafer market", and
`figures.wafer-concentration` moves from 85/15 to 90/10 with a retitled axis and the new source. The `keyFacts` entry
was rewritten to match.

Two other Mordor numbers had no replacement and were deleted with their sentences: **"Chinese suppliers price 10 to 15
percent below Japanese peers where flatness targets are looser"**, and **"300 mm carried 73.81 percent of wafer area
shipped in 2025"**. The **Diameter** criterion now carries CSET's 99.7% of fab capacity at 45 nm and below instead,
which is Tier A and already in the chapter.

**`investing.com/news/transcripts/earnings-call-transcript-sumco-q4-2025-...` → `trendforce.com/news/2026/04/06/news-sumco-delays-construction-of-two-silicon-wafer-fabs-amid-market-shift/` (Tier B, verified).**
The transcript mirror supported SUMCO's FY2025 revenue (¥409.6bn), operating profit (¥1.3bn), the 9% rise in 300 mm
volume, and the long-term-agreement pricing commentary. SUMCO's own results are published through eir-parts.net rather
than sumcosi.com, and every sumcosi.com IR page is JavaScript-rendered and returns navigation only to WebFetch and
curl; no Tier A or B mirror of the FY2025 numbers could be verified. **Numbers changed:** the revenue, profit and
volume figures are gone. The SUMCO bullet now carries a verified TrendForce fact instead, which makes the same point
harder: SUMCO shelved a ¥225bn plan for two new fabs at Imari and Yoshinogari to upgrade existing lines, after its
state subsidy was cut from ¥75bn to ¥19.3bn. `card.leaders` and the `keyFacts` entry were rewritten to match.

The pricing paragraph is now built on SEMI instead of the call transcript, and says the same thing with Tier A
support: area shipped rose 5.8% in 2025 while revenue fell 1.2%.

### Upgrade (not required, but free)

**`semiconductor-digest.com/...` (Tier C, three uses) → `prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html` (Tier A, verified).**
SEMI's own release carries the same numbers (12,973 MSI, +5.8%; $11.4bn, -1.2%) and the epitaxial-and-HBM attribution,
so the chapter no longer leans on a trade-press retelling of it. This removes the need for a Tier C hedge in three places.

### Hedges added

`pv-magazine.com`, `digitimes.com` and `theregister.com` are Tier C. The polysilicon ranking now says "on a Bernreuter
ranking reported in the trade press", NSIG's growth says "per the trade press", and the 450 mm cost estimate says "on
one trade account".

### Removals

- The "Polished, or prime" subsection, folded into a single clause of a merged "Prime versus epitaxial".
- The GlobalWafers St Peters SOI sentence (the Missouri plant is still in `card.countries`); the SOI subsection is now
  two sentences, because the chapter itself says SOI is not the substrate under an AI GPU.
- Tongwei's 910,000 t and Wacker's 80,000 t from the prose: `figures.polysilicon-capacity` prints both directly below.
- NSIG's 36.51% first-half revenue rise, which said the same thing as the 90% shipment growth in the same sentence.

### New domains

None. `prnewswire.com`, `koreajoongangdaily.com` and `trendforce.com` were already classified.

---

# 04 · Chemicals, Gases and Photoresist

**Words: 1,343 → 1,143 (-14.9%). Tier D citations: 6 → 0.**

### Replacements

**`gminsights.com/industry-analysis/high-purity-specialty-gases-market` → deleted; `figures.gas-share` replaced by `figures.germanium-price` on `pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf` (Tier A, verified).**
The Tier D market-research page was the only support for the whole share table (Linde 18.8%, Air Liquide 16.5%,
Air Products 8.4%, Taiyo Nippon Sanso 6.1%, Messer 4.1%, 53.9% together, a $12.1bn market). SEMI's blog on electronic
specialty gases, TechInsights' gases page and Yole were all checked; SEMI is behind Cloudflare, TechInsights publishes
no numbers on its landing page, and neither Yole nor TrendForce has a public electronic-gas share release.
**Numbers deleted:** all five percentages and the market size. The prose still names the five firms, which is a
roll-call rather than a share claim, and anchors the scale on Air Liquide's own disclosure (€2,465m of electronics
revenue in 2025, 9.1% of group revenue), verified on airliquide.com. `card.leaders` for Air Liquide was rewritten
from "16.5% of high-purity specialty gases" to that company figure.

The retired figure is replaced by a stronger one for the same chapter: USGS Mineral Commodity Summaries, February 2026,
germanium metal annual average price, $1,187/kg (2021) to $4,100/kg (2025). It sits in "The chokepoint", where it
shows what an export control does to a price, which is the argument the section was already making.

**`gminsights.com/industry-analysis/photoresist-chemicals-for-advanced-lithography-market` → `fujifilm.com/jp/en/news/hq/11942` and `fujifilm.com/jp/en/news/hq/11842` (Tier A, verified), plus `prnewswire.com/.../global-semiconductor-materials-market-revenue-reaches-record-73-2-billion-in-2025--semi-reports-302768700.html` (Tier A, verified).**
This one was also wrong on the facts. The Tier D page said Fujifilm's June 2025 Kumamoto expansion raised **EUV resist**
capacity by 30% next to TSMC's Japanese fab. Fujifilm's own releases say the Kumamoto investment is a roughly 30%
increase in **CMP slurry** capacity, operational January 2025, and that the EUV resist and developer capacity went into
**Shizuoka and Pyeongtaek**, operational October 2025. The bullet was rewritten to the company's version.
**Number deleted:** the "$6.1bn advanced-lithography resist market in 2025, top five about half". `card.costSignal` and
the market-size sentence now use SEMI's materials figures instead: $45.8bn of wafer fabrication materials and $27.4bn
of packaging materials in 2025, $73.2bn together.

**`en.tmt-blog.jp/articles/company-jsr-en` → `jsr.co.jp/jsr_e/news/2021/20210917.html` (Tier A, verified).**
JSR's own announcement of the Inpria acquisition confirms the deal and that Inpria "has been developing its
non-chemically amplified metal oxide EUV resists since the company was established in 2007". **Number deleted:** the
$514m price, which JSR's release does not give; the Business Wire release that does carry it returns 403 to both
WebFetch and curl. The second use of this source, in the **Photon efficiency** criterion, needed no citation once the
number went, since the bullet makes no numeric claim.

**`factmr.com/report/nitrogen-trifluoride-market` → citation removed.** It sat on a sentence describing what NF3 does
(cracked in a plasma to strip chamber walls). No number, so no source is required.

**`businessresearchinsights.com/market-reports/ultra-high-purity-hydrofluoric-acid-market-107517` → citation removed.**
Same case: a list of four supplier names with no number attached. Stella Chemifa's own site 404s on its English index.

**`strategicmetalsinvest.com/germanium-prices/` → `pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf` (Tier A, verified).**
**Numbers changed:** the spot quotes of $8,597.50/kg in September 2026 against $4,120.80 at the start of 2025 become
USGS annual averages, $4,100/kg in 2025 against $1,392 in 2023, with the added Tier A fact that US imports of germanium
metal fell 67% in 2025 on China's ban. Annual averages from the USGS series (sourced to Argus Media) are both better
sourced and more useful to a policy reader than a spot print on an unnamed date.

### Correction found while verifying

The sentence "Again no fab stopped, because excimer lasers had been re-engineered to use less neon after a 2014 price
shock" was cited to CSIS. The CSIS piece says nothing about excimer lasers or a 2014 shock; the SFA Oxford page does not
support it either. The claim is removed. What CSIS does support, and now carries, is that Ukraine supplied about 70% of
the world's neon and 90% of the semiconductor-grade neon used by US industry. The `keyFacts` entry that quoted SFA's 70%
of neon demand and 54% supply loss was replaced with the CSIS figures, which moves that fact from Tier C to Tier A and
keeps `keyFacts` consistent with the body.

### Hedges added

`sfa-oxford.com` (Tier C) keeps two numbers: China's share of air separation capacity now says "on one specialist's
count", and the byproduct criterion is unchanged in substance. `evertiq.com` (Tier C) carries JSR's 27% share, which
now says "on trade-press estimates".

### Removals

- The gas transportability paragraph in "Variants and trade-offs", which restated the **Transportability** criterion.
- The Shin-Etsu Isesaki bullet, a third example of the same point as Tokyo Ohka and Fujifilm.
- The Entegris revenue sentence from "Who makes it" (the figure is still in `card.leaders`).
- Neon's 1-part-in-65,000 concentration and the 54% supply-loss figure, both from the Tier C page, now that CSIS
  carries the Ukraine share at Tier A.

### New domains

`pubs.usgs.gov` and `usgs.gov` → Tier A, with the other government and institutional sources.
`jsr.co.jp` and `fujifilm.com` → Tier A, with the other company IR and newsroom domains.

---

## Verification notes for these three chapters

Every replacement URL above was opened and read before it was cited. WebFetch was the default; where a host refuses it
(`pib.gov.in`, `pubs.usgs.gov`) the same URL was fetched with curl and, for the USGS PDF, the text extracted locally.
Sources that could not be read at all and were therefore not used: `semiengineering.com`, `semiconductors.org`,
`blog.semi.org`, `businesswire.com`, `investindia.gov.in`, `ism.gov.in`, and every JavaScript-rendered SUMCO IR page.

---

## 09 — Transistors and the Front End

**Before:** 1,326 body words, 21 sources, **3 Tier D** on the old tier list (`semiconductorx.com`, `blog.aifutures.org`, `techspot.com`).
**After:** 1,094 body words (17.5% removed), 16 sources, **0 disallowed, 0 unclassified** under the strict policy of 9 September 2026.

The old-policy pass was done first and reached D 0 on the old tiers. The strict policy landed mid-task and
re-disallowed SemiWiki, EE Times, EE Times Asia, TrendForce, Tom's Hardware, TechInsights, patsnap and
Isaiah Research, so the chapter was re-sourced a second time onto TSMC's, Intel's and imec's own pages plus
SemiAnalysis, Nikkei and CSIS. Front matter parses; `plain` is 91 words and byte-identical to the first
paragraph under "How it works"; em-dash count 6, all in Key evaluation criteria.

### Replacements

| Fact | Old source (tier) | New source (tier) | What changed |
|---|---|---|---|
| 2 nm flow runs ~95 mask layers, ~16 weeks in the fab | semiconductorx.com/front-end-fabrication-overview.html (D) | — | **Deleted.** No allowed source states either number. |
| SMIC testing a domestic 28 nm-class immersion prototype | blog.aifutures.org (D) | reuters.com (B) | Kept the Reuters line already in the chapter: a Shanghai state firm building immersion scanners in 2026 at single-digit volumes |
| Chinese EUV prototype has produced EUV light | blog.aifutures.org (D) → trendforce.com (B, then disallowed) | csis.org (A) | Replaced the prototype-status claim with CSIS: **$43 billion announced for domestic EUV**, and EUV "firmly out of reach despite massive state investment" |
| Domestic 7 nm DUV mid-2030s, 5 nm EUV late-2030s | blog.aifutures.org (D) | — | **Deleted.** A single forecaster's dates; no allowed source carries them |
| N2 density 313 / 238 / 231 MTr/mm2 | techspot.com (D) → tomshardware.com (C, then disallowed) | tsmc.com HPC advanced technologies (A) | Figure `density-by-node` **rebuilt**: TSMC's own node-over-node density gains, N2P 1.2x logic and 1.15x chip over N3E, A16 up to 1.10x chip over N2P. The cross-foundry comparison is gone; the chapter now says plainly that no foundry publishes a comparable figure |
| N2 vs N3E: 10-15% speed, 25-30% power, ~15% density | semiwiki.com (C, then disallowed) | tsmc.com HPC advanced technologies (A) | Corrected to TSMC's published **N2P vs N3E: 18% speed, 36% power, 1.2x logic density** |
| A16 vs N2P: 8-10% speed, 15-20% power, 8-10% density | semiwiki.com (C, then disallowed) | tsmc.com HPC advanced technologies (A) | Density corrected to **up to 1.10x chip density**, TSMC's own wording |
| Backside power, general benefit | — | newsletter.semianalysis.com (B) | Added: **15-20% power improvement** on high-performance designs |
| SRAM bit cell 0.021 → 0.0175 um2, N5 to N2 | semiwiki.com (C, then disallowed) | newsletter.semianalysis.com (B) | Replaced with **TSMC's claimed 22% SRAM density gain from N3E to N2, which comes from the periphery, not the bit cell**. Figure `sram-bitcell` removed with its marker and front-matter entry per the strict policy's figure rule |
| Copper resistivity 1.7 microhm-cm below 40 nm width; ruthenium wins at 10-17 nm | patsnap.com (C, then disallowed) | imec-int.com semi-damascene (A) and imec 16 nm Ru press release (A) | Rewritten to imec's framing: barrier, liner and cap eat the line **below a 20 nm metal pitch**, and imec has demonstrated **ruthenium lines at 16 nm pitch** |
| Rubin on TSMC's 3 nm family | isaiahresearch.com (B-other, then disallowed) | — | **Deleted.** Blackwell's 4NP, cited to Nvidia, carries the point |
| N2 wafer ~$30,000 vs ~$20,000 at N3; TrendForce's $25-27k and +10-20% | eetasia.com and trendforce.com (both disallowed) | — | **Deleted**, with the paragraph. Card `costSignal` rewritten to the one cost signal that is public: TSMC's density gain per node step falling from 1.2x at N2P to about 1.1x at A16 |
| 7 nm needs 34 DUV litho steps vs nine EUV; SMIC yields below 50%; Big Fund III 344bn yuan | eetimes.com (disallowed) | asia.nikkei.com (B) for the fund | Litho-step and yield numbers **deleted**. The fund is now **344 billion yuan, about $47 billion, May 2024**, from Nikkei Asia |
| TSMC roadmap figure rows | trendforce.com (B, then disallowed) | pr.tsmc.com/english/news/3302 (A) and /3228 (A) | Figure `node-roadmap` rebuilt from TSMC's own 2026 symposium release. The unsupported **A16-in-2027 row was dropped**; N2U, A14, A13 and A12 rows now match TSMC's stated years and figures |

### Removals

- The mask-layer and cycle-time sentence, the wafer-price paragraph, the Rubin-node clause, and the
  China litho-step and yield numbers, all for want of an allowed source.
- Figure `sram-bitcell`, with its `{{figure:sram-bitcell}}` marker and front-matter entry.

---

## 10 — Foundries and Fabs

**Before:** 1,339 body words, 18 sources, **2 Tier D** on the old list (`creating-nanotech.com`, `semiconductorx.com`); **12 disallowed** under the strict policy.
**After:** 1,141 body words (14.8% removed), 12 sources, **0 disallowed, 0 unclassified**.

The chapter had been built on a market-share number and a capex number that only analysts publish. It is now
built on TSMC's own manufacturing pages and SEC filing, SMIC's own annual results, Intel's own releases,
Samsung's own Taylor page, SEMI and BCG. The argument is stronger for it: instead of "TSMC has 73 percent of
pure-foundry revenue", the chapter now opens on TSMC's own definition of a gigafab and the fact that all six
of them are in Taiwan. Front matter parses; `plain` is 94 words and byte-identical; em-dash count 6, all in
Key evaluation criteria.

### Replacements

| Fact | Old source (tier) | New source (tier) | What changed |
|---|---|---|---|
| Installed capacity by region, 2025 | creating-nanotech.com (D) | semi.org press release, 18 June 2024 (A) | Same numbers, verified at source: **China 10.1M wpm, Taiwan 5.8, Korea 5.4, Japan 4.7, Americas 3.2, Europe and Mideast 2.7, SE Asia 1.8, world 33.7M**. Figure `capacity-by-region` re-sourced |
| Leading-edge line costs $15-25bn, four to six years to build | semiconductorx.com/fabs-leading-edge.php (D) | bcg.com (A) | Replaced with BCG's **ten-year cost of ownership of $35-43 billion for a fab completed in 2026**, a third to two thirds above one finished three years earlier. Card `costSignal` and the matching criteria bullet updated |
| Fab tool set is "many hundreds of machines, fifteen or more EUV scanners" | semiconductorx.com (D) | — | **Deleted.** No allowed source gives a per-fab EUV count |
| Fab 18 cleanroom ~160,000 m2, ~$20bn, gigafab above 100k wafer starts | asianometry.com (disallowed) | tsmc.com/dedicatedFoundry/manufacturing/gigafab (A) | Replaced with TSMC's own definition and totals: a **GIGAFAB runs more than 100,000 300 mm wafers a month; six of them; combined output above 13 million 12-inch equivalent wafers in 2025**, against **more than 17 million across everything TSMC manages** (fab_capacity page, A). This is now the chapter's lead |
| TSMC 73% of pure-foundry revenue, 2Q26 | counterpointresearch.com (disallowed) | sec.gov TSMC 2Q26 results (A) | **Deleted as a share number.** Figure `foundry-share` rebuilt as **TSMC wafer revenue by node, 2Q26: 2 nm 3%, 3 nm 30%, 5 nm 33%, 7 nm 11%**, from the SEC filing |
| Top-10 foundry revenue, 4Q25 | trendforce.com presscenter (disallowed) | — | Figure `foundry-revenue` **removed** with its marker and front-matter entry. No allowed source publishes a comparable ranking |
| TSMC 2026 capex $60-64bn; $100bn US on top of $165bn | semiwiki.com (disallowed) | pr.tsmc.com/english/news/3210 (A) | Capex guidance **deleted**. US investment corrected to TSMC's own wording: **$165 billion total, $100 billion added in March 2025 to $65 billion in Phoenix, for three fabs, two packaging plants and an R&D centre** |
| SMIC 2025 revenue, utilisation, capacity | trendforce.com (disallowed) | smics.com annual results (A) | Verified at source and slightly corrected: **revenue up 16.2% to $9.327bn, gross margin 21.0%, utilisation 93.5%, monthly capacity above 1 million 8-inch equivalent wafers**. The "1.059 million" figure is not in SMIC's release, so it is gone |
| Mature-node vendor revenues, 4Q25 | trendforce.com (disallowed) | semi.org (A) | Section rewritten around SEMI's **12.7 million wafers a month of foundry capacity by 2026**, growth led by China |
| Arizona Fab 2 3 nm in 2H27, Tainan 1H27, Kumamoto 2028; N3 150k → 180k wpm; A16 customer queue | trendforce.com (disallowed) | pr.tsmc.com (A) | All **deleted**. The TSMC US press release carries the investment; per-fab schedules and wafer-start ramps have no allowed source |
| Arizona premium 5-20%, up to 30% at 4 nm | eetasia.com (disallowed) | — | **Deleted** |
| Samsung Taylor building Tesla AI5 on 2 nm, 2H27 | electrek.co (disallowed) | semiconductor.samsung.com Taylor page (A) | Replaced with Samsung's own commitment: **a minimum $17 billion, $6bn buildings and $11bn equipment**, for leading-edge and mature logic. The Tesla claim is gone |
| TSMC 8.4% of Taiwan's electricity, 23.7% by 2030 | taipeitimes.com (disallowed) | — | **Deleted.** TSMC's ESG pages could not be read (403 to WebFetch, Cloudflare block to the browser), so nothing was cited in their place. The "Power" bullet is now labelled as our judgment, with no number |

---

## 11 — Memory and HBM

**Before:** 1,334 body words, 21 sources, **2 Tier D** on the old list (`finance.yahoo.com`, `earningscall.ai`); **12 disallowed** under the strict policy.
**After:** 1,070 body words (19.8% removed), 14 sources, **0 disallowed, 0 unclassified**.

Almost every number in this chapter came from TrendForce, Counterpoint or Tom's Hardware. It has been rebuilt
on JEDEC, SK hynix's newsroom, Micron's product pages, Nvidia, Siemens EDA, the Federal Register, Purdue and
SemiAnalysis. The market-share and DRAM-price material is gone; the physics, the standard and the control are
better sourced than before. Front matter parses; `plain` is 101 words and byte-identical; em-dash count 6, all
in Key evaluation criteria.

### Replacements

| Fact | Old source (tier) | New source (tier) | What changed |
|---|---|---|---|
| Micron committed its whole calendar 2026 HBM supply; HBM TAM $35bn 2025 → $100bn 2028 | earningscall.ai (D) | — | Verified on TrendForce (B at the time) and CNBC, then **deleted** when both became disallowed. Micron's own 10-Q and FQ1 26 press release do not carry either statement; the prepared-remarks PDF redirects. The chapter now says only that HBM is sold forward |
| Jensen Huang confirmed all three passed Vera Rubin certification, June 2026 | finance.yahoo.com (D) | — | Verified on `en.sedaily.com` (B at the time), then **deleted** when that became disallowed. Replaced by SK hynix's own statement that it expects **roughly 70 percent of Rubin HBM4 in 2026** |
| HBM revenue share 2Q26: SK hynix 50%, Samsung 33%, Micron 18% | counterpointresearch.com (disallowed) | — | **Deleted**, with the SK-hynix-slipping-from-57% narrative. Figure `hbm-share` removed with its marker and front-matter entry. No allowed source publishes vendor share |
| DDR5 die 8 GB/s vs HBM3E die 256 GB/s; HBM needs 3x wafer area and 5x price per bit; memory ~90% of package silicon; compute scaling 3x/2yr vs bandwidth under 2x | tomshardware.com (disallowed) | micron.com/products/memory/hbm (A) | Replaced with Micron's own framing: **an HBM cube presents a 1,024-bit interface across 32 channels, sixteen times wider than a standard DDR5 module**. The area and price ratios have no allowed source and are gone, including from the card `costSignal` |
| DRAM prices +93-98% QoQ in 1Q26, then +58-63%; $97bn DRAM market; Samsung 38.5% / SK hynix 28.8% / Micron 22.4%; HP's build-cost jump | trendforce.com and tomshardware.com (disallowed) | — | **Deleted**, and the "Price, contracts and the DRAM shortage" section folded into "Who makes it". The qualitative point that HBM wafers displace commodity DRAM survives without the price series |
| Nvidia demanded above 10 Gb/s for Rubin | trendforce.com (disallowed) | news.skhynix.com HBM4 completion (A) | Replaced with SK hynix's own **over 10 Gb/s per pin against JEDEC's 8**, announced 12 September 2025 |
| Micron HBM4 above 11 Gb/s, over 2.8 TB/s per stack | tomshardware.com (disallowed) | micron.com/products/memory/hbm/hbm4 (A) | Same numbers, from Micron's own product page |
| SK hynix HBM4 base dies built by TSMC on 12 nm, 3-4x the cost of core dies, Intel evaluated for HBM4E | trendforce.com (disallowed) | news.skhynix.com TSMC partnership (A) | Reduced to what SK hynix states: it **adopts TSMC's foundry process for the HBM4 base die**. The cost multiple and the Intel evaluation are gone |
| TSV thinning to ~50 microns; Samsung thermal compression vs SK hynix single reflow; 775-micron ceiling raised from 720; hybrid bonding ruled out for HBM4E | tomshardware.com (disallowed) | news.skhynix.com hybrid bonding tech note (A) and HBM4 release (A) | Rebuilt on SK hynix's own material: **height rises from 720 to 775 micrometres starting with HBM4**, **Advanced MR-MUF** is the joining process, and **hybrid bonding cuts bond pitch from about 20 micrometres to under 1** with full adoption expected only at **HBM4E or HBM5, past twenty layers**. The 50-micron thinning figure is gone |
| Samsung HBM4 yield under 60% at launch, ~80% by August 2026 | trendforce.com (disallowed) | — | **Deleted.** The criteria bullet on stack yield now makes the structural point without a number |
| Micron Hiroshima 1.5 trillion yen expansion | trendforce.com (disallowed) | — | **Deleted.** Micron's English-language release for the Hiroshima cleanroom could not be verified in time |
| CXMT HBM3 mass production 2026, XMC at ~3,000 wpm | tomshardware.com (disallowed) | — | **Deleted.** The China paragraph is now explicitly our judgment, naming CXMT without a production figure |
| Foreign direct product rule extension | cov.com (disallowed) | federalregister.gov (A) | Folded into the existing Federal Register citation, which contains the rule itself |
| JEDEC HBM4 publication date | jedec.org (A) | jedec.org (A) | Kept. "16 April 2025" softened to "April 2025", the month the release supports |

---

## Verification notes for chapters 09, 10 and 11

Every new URL above was opened and read before it was cited, with WebFetch as the default. Where a host
refused WebFetch, the same page was read through the browser tool: `semi.org` (403 to WebFetch) and
`tomshardware.com` were both read that way during the intermediate pass.

Sources that could not be read at all, and were therefore not cited: `reuters.com` (blocked to this agent, so
the one pre-existing Reuters URL in chapter 09 was left in place but could not be re-verified here),
`esg.tsmc.com` and `investors.micron.com` static-file PDFs (403 or redirect to the IR landing page),
`cnbc.com`, `techinsights.com` library assets, and `library.techinsights.com`.

No new domains needed adding to `data/source-tiers.json`: every domain cited across the three chapters was
already classified, and the build reports 0 unclassified for all three.

**Note on the policy change.** These chapters were first taken to D 0 against the tier list as it stood at the
start of the task (Tiers A/B/C allowed, Tier D never). Commit `c7fc8ef`, "Strict source policy: Tier A plus
SemiAnalysis, Reuters, FT and Nikkei only", landed mid-task and re-disallowed TrendForce, Counterpoint,
TechInsights, SemiWiki, EE Times, Tom's Hardware and every other trade title. All three chapters were then
re-sourced a second time against the strict list, which is what the tables above record. The strict policy's
rule 3, that a figure whose data cannot be rebuilt from allowed sources is removed with its marker and
front-matter entry, cost three figures: `sram-bitcell` in 09, `foundry-revenue` in 10 and `hbm-share` in 11.
Each of the three chapters keeps two figures, all markers present and all front-matter entries matching.
