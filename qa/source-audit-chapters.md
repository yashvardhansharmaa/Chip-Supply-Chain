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
