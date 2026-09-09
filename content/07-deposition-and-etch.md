---json
{
  "id": "deposition-and-etch",
  "number": 7,
  "title": "Deposition and Etch",
  "oneLiner": "Lithography prints the pattern. Deposition and etch build the thing, over a thousand steps per wafer, and this is the one tool segment where China has taken real share.",
  "plain": "If lithography is the printing, this is the building. A chip is made like a layer cake: spray on a film a few atoms thick, print a pattern on it, then burn away everything the pattern does not protect, and repeat more than a thousand times. The hard part is that the spray must reach the bottom of a hole hundreds of times deeper than it is wide, and the burn must eat one material while leaving the one beside it untouched. Most of these machines come from four firms in America, Japan and the Netherlands, and China has come closer to matching them here than anywhere else.",
  "specimen": "process-chamber",
  "specimenCaption": "Right: a plasma process chamber in cross-section. Gas showerhead at the top, wafer clamped to an electrostatic chuck, RF electrodes above and below, turbopump and exhaust at the bottom.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Applied Materials", "country": "US", "share": "$28.4B revenue, FY2025; leader in PVD, CVD and epitaxy"},
      {"name": "Lam Research", "country": "US", "share": "$23.2B revenue, FY2026; leader in dry etch and metal ALD"},
      {"name": "Tokyo Electron", "country": "JP", "share": "23% of dry etch, 38% of CVD, CY2025"},
      {"name": "ASM International", "country": "NL", "share": "€3.2B revenue, 2025; single-wafer ALD leader"},
      {"name": "Naura", "country": "CN", "share": "5th largest equipment vendor worldwide, 2025 estimate"}
    ],
    "countries": [
      {"code": "US", "note": "Applied Materials (Santa Clara), Lam Research (Fremont)"},
      {"code": "JP", "note": "Tokyo Electron, Kokusai Electric, Hitachi High-Tech"},
      {"code": "NL", "note": "ASM International, Almere; ALD and epitaxy"},
      {"code": "KR", "note": "Large buyer; Semes and local suppliers in wet processing"},
      {"code": "CN", "note": "Naura, AMEC, Piotech; largest equipment market at $49.3B in 2025"}
    ],
    "chinaStatus": "The strongest Chinese position in any tool segment. China-based suppliers held about 11% of dry etch and 7% of deposition in 2024, but under 1% of ALD.",
    "usStatus": "Two of the three largest suppliers are American. Washington controls dry etch, ALD and high-aspect-ratio deposition tools by ECCN and by foreign direct product rule.",
    "costSignal": "No public list prices. Global semiconductor equipment billings were $135.1B in 2025, with wafer processing up 12%.",
    "substitution": {"years": "5-10", "why": "Chinese firms have matched conductor and dielectric etch at mature nodes, but selectivity, particle control and chamber matching at 2 nm remain out of reach, and ALD share is under 1%."}
  },
  "keyFacts": [
    {"fact": "Producing one chip takes more than 1,000 process steps and 70 or more border crossings (CSET, 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
    {"fact": "Global semiconductor equipment billings reached $135.1B in 2025, up 15% from $117.1B in 2024", "source": "https://www.semiconductor-digest.com/semi-reports-global-semiconductor-equipment-billings-reached-135-billion-in-2025-up-15-year-on-year/"},
    {"fact": "China bought $49.3B of semiconductor equipment in 2025, the largest single market", "source": "https://www.semiconductor-digest.com/semi-reports-global-semiconductor-equipment-billings-reached-135-billion-in-2025-up-15-year-on-year/"},
    {"fact": "Tokyo Electron held 23% of dry etch, 38% of CVD and 15% of ALD worldwide in CY2025 (Gartner)", "source": "https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf"},
    {"fact": "China-based suppliers reached 7% of deposition and about 11% of dry etch in 2024, from 2% and under 3% in 2019", "source": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"},
    {"fact": "AMEC 2025 revenue was RMB 12.38 billion, up 36.6%, with net profit of RMB 2.11 billion", "source": "https://www.trendforce.com/news/2026/04/21/news-china-memory-expansion-lifts-domestic-equipment-suppliers-amec-wuhan-jingce-hwatsing-acm-in-focus/"},
    {"fact": "BIS controls TSV etch tools at aspect ratios of 10:1 or greater with etch rates above 7 microns per minute (ECCN 3B001.c.4)", "source": "https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf"},
    {"fact": "Lam Research fiscal 2026 revenue was $23.23 billion, up 26% from $18.44 billion", "source": "https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm"}
  ],
  "figures": [
    {
      "id": "equipment-billings",
      "type": "bars",
      "title": "Global semiconductor equipment billings",
      "unit": "$B",
      "data": [["2024", 117.1], ["2025", 135.1]],
      "source": {"label": "SEMI, reported by Semiconductor Digest", "url": "https://www.semiconductor-digest.com/semi-reports-global-semiconductor-equipment-billings-reached-135-billion-in-2025-up-15-year-on-year/"}
    },
    {
      "id": "tel-tool-share",
      "type": "bars",
      "title": "Tokyo Electron world market share by tool type, CY2025",
      "unit": "%",
      "data": [["Coater/developer", 91], ["CVD", 38], ["Oxidation/diffusion", 31], ["Batch deposition", 27], ["Dry etch", 23], ["Cleaning", 20], ["ALD", 15]],
      "source": {"label": "Gartner via Tokyo Electron FY2026 Q4 presentation", "url": "https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf"}
    },
    {
      "id": "china-tool-share",
      "type": "bars",
      "title": "China-based suppliers' share of global tool segments, 2024",
      "unit": "%",
      "data": [["Dry stripping", 35], ["Dry etch", 11], ["CMP", 11], ["PVD", 10], ["Etch and clean", 9], ["Deposition", 7], ["CVD", 7], ["Lithography (i-line)", 4]],
      "source": {"label": "CSET analysis of TechInsights equipment data", "url": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"}
    }
  ]
}
---
# Deposition and Etch

Applied Materials and Lam Research, the two largest suppliers of deposition and etch tools, booked $28.4 billion and $23.2 billion of revenue in their most recent fiscal years ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000006951/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)) ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).

## How it works

If lithography is the printing, this is the building. A chip is made like a layer cake: spray on a film a few atoms thick, print a pattern on it, then burn away everything the pattern does not protect, and repeat more than a thousand times. The hard part is that the spray must reach the bottom of a hole hundreds of times deeper than it is wide, and the burn must eat one material while leaving the one beside it untouched. Most of these machines come from four firms in America, Japan and the Netherlands, and China has come closer to matching them here than anywhere else.

CSET puts a single chip at more than 1,000 process steps, with the part-finished product crossing international borders 70 or more times ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

Most of this happens in a vacuum chamber with a plasma in it: a radio-frequency field strips electrons off a process gas, and the ions and radicals do the chemistry. Change the gas, pressure, power and temperature and the same hardware either adds material or removes it, which is why export controls here are written as process specifications rather than as a ban on a machine.

## Variants and trade-offs

### Deposition families

- **Physical vapour deposition**, usually sputtering, fires argon ions at a target so its atoms fly off onto the wafer. It is the workhorse for metal barriers and seed layers, a $2.4 billion market as of 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Chemical vapour deposition** reacts gases at the wafer surface to grow a film, and the plasma-enhanced variant does it cooler. Plasma CVD alone was a $3.5 billion market as of 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Atomic layer deposition** builds a fraction of a monolayer at a time, and because each half-reaction stops when the surface saturates, it coats vertical walls and horizontal floors alike. US regulators call it the basis for 3D scaling in 3D DRAM, 3D NAND and gate-all-around logic ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). ASM International leads it, on a $1.6 billion market as of 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Epitaxy and electroplating** grow the strained silicon-germanium source and drain, and fill the copper interconnect trenches; electroplating was a $0.29 billion market as of 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

### Etch families

- **Conductor etch** cuts gates, metals and silicon, and was a $6.5 billion market as of 2019, led by Lam ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Dielectric etch** cuts the oxides and nitrides between them, a $4.3 billion market as of 2019, led by Tokyo Electron ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **High-aspect-ratio etch** is the discipline memory lives or dies by. A 3D NAND channel or DRAM capacitor is a hole far deeper than it is wide that must come out straight, and BIS treats features above a 200:1 aspect ratio as characteristic of 3D DRAM ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). Lam's cryogenic etch chills the wafer to sharpen the profile, and Lam claims Cryo 3.0 cuts profile deviation by 80 percent ([source](https://quartr.com/events/lam-research-corporation-lrcx-investor-day-2025_33D7JGMm)).
- **Atomic layer etch** removes a monolayer per cycle, slowly and expensively, so it is used only where nothing else will do.

The AI-specific pull comes from three places. Gate-all-around needs isotropic etch, which cuts sideways, to release the silicon nanosheets from the silicon-germanium between them; BIS ties its dry etch controls to this and controls wet processing at silicon-germanium-to-silicon selectivity of 100:1 or better ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). HBM needs deep through-silicon vias, which BIS defines as etch at 10:1 or greater with a rate above 7 microns per minute ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). Backside power delivery adds thinning, backside vias and a second metal stack, and Lam expects equipment intensity per leading-edge wafer to rise more than 50 percent as these arrive ([source](https://quartr.com/events/lam-research-corporation-lrcx-investor-day-2025_33D7JGMm)).

{{figure:tel-tool-share}}

## Who makes it

Global semiconductor equipment billings hit $135.1 billion in 2025, up 15 percent from $117.1 billion in 2024 ([source](https://www.semiconductor-digest.com/semi-reports-global-semiconductor-equipment-billings-reached-135-billion-in-2025-up-15-year-on-year/)).

Within deposition and etch there is no single ASML. Tokyo Electron's Gartner-sourced numbers show it holding 23 percent of dry etch, 27 percent of batch deposition and 15 percent of ALD in 2025, against 91 percent of coater/developer ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)). That gap is the point: a near-monopoly in track tools, an ordinary share in etch and deposition.

ASM International is the specialist. Its 2025 revenue was a record EUR 3.2 billion, driven by customers building 2 nm gate-all-around capacity, with molybdenum ALD entering volume production ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

Demand is running ahead of supply: Tokyo Electron sees $150 billion to $170 billion of equipment spending a year in 2026 and 2027, with leading-edge spending up more than 30 percent ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).

{{figure:equipment-billings}}

## China and the controls

China is the largest customer and the fastest-improving competitor at once. It bought $49.3 billion of equipment in 2025, and China, Taiwan and Korea together took 79 percent of the global market ([source](https://www.semiconductor-digest.com/semi-reports-global-semiconductor-equipment-billings-reached-135-billion-in-2025-up-15-year-on-year/)). Supplier exposure has fallen but is still large.

- **Tokyo Electron**: 34.1 percent of sales in the year to March 2026, down from 41.7 percent ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).
- **Lam Research**: 26 percent in the June 2026 quarter, behind Taiwan at 27 percent ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).
- **Applied Materials**: 28 percent in the third fiscal quarter of 2026, down from 35 percent a year earlier ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).
- **ASM International**: more than 30 percent of 2025 revenue ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

Domestic toolmakers are why those shares matter both ways. Between 2019 and 2024, China-based suppliers went from 2 percent to 7 percent of deposition and from under 3 percent to about 9 percent of etch and clean, reaching roughly 11 percent of dry etch alone. They gained nothing in ALD and held under 1 percent of it in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). AMEC's 2025 revenue was RMB 12.38 billion, up 36.6 percent, with cumulative etch tool shipments past 6,800 units ([source](https://www.trendforce.com/news/2026/04/21/news-china-memory-expansion-lifts-domestic-equipment-suppliers-amec-wuhan-jingce-hwatsing-acm-in-focus/)).

The controls tightened in four moves.

- **October 2022.** The interim final rule of 7 October put manufacturing equipment and US person support under licence and widened foreign-produced item rules for 28 listed Chinese entities ([source](https://www.govinfo.gov/content/pkg/FR-2022-10-13/pdf/2022-21658.pdf)).
- **October 2023.** The rule effective 17 November 2023 rewrote the equipment entries, adding controls on isotropic and anisotropic dry etch (ECCN 3B001.c.1), spatial ALD (3B001.d.9), low-fluorine tungsten ALD and CVD (3B001.d.10) and carbon hard mask PECVD (3B001.d.5) ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **December 2024.** The interim final rule added eight ECCNs, listed 140 entities and extended a foreign direct product rule to tools made outside the United States ([source](https://www.cov.com/en/news-and-insights/insights/2024/12/us-department-of-commerce-strengthens-export-controls-on-advanced-computing-and-semiconductor-manufacturing-items)), reaching TSV etch and deposition above 200:1 ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **September 2025.** The Affiliates Rule extended Entity List restrictions to any company at least 50 percent owned by a listed entity ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf)), and BIS then stayed it to 9 November 2026 ([source](https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf)).

Enforcement has bite: Applied Materials took a $253 million charge to settle an export controls matter ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).

{{figure:china-tool-share}}

## The chokepoint

This is a real chokepoint but a softer one than lithography. Three or four credible vendors exist for most etch and deposition steps. The narrow points are ALD, where China holds under 1 percent ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)), and the extreme aspect ratios that HBM and 3D memory need. Those are exactly where the December 2024 rule aims ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).

## Key evaluation criteria

- **Selectivity** — how strongly the process attacks one material and spares another. BIS uses a silicon-germanium-to-silicon ratio of 100:1 as a control threshold ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **Conformality and aspect ratio** — whether a film reaches the bottom of a deep hole. Controls start at 10:1 for TSV etch and 200:1 for 3D DRAM deposition ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Uniformity** — variation across a 300 mm wafer. Regulators treat under 2 percent as an advanced-manufacturing marker ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Throughput** — wafers per hour, which sets cost per layer. Etch rate above 7 microns per minute is the stated threshold for high-volume TSV work ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Particles and chamber matching** — the defect budget these tools consume, which is measured by the tools in the next chapter.

## Takeaways

Deposition and etch are the volume business of a fab: over a thousand steps per wafer, four American, Japanese and Dutch firms taking most of the money, and no monopoly of the kind ASML has in lithography. The AI roadmap raises difficulty faster than tool count, because gate-all-around, HBM and backside power demand better selectivity and deeper holes rather than more chambers. China has closed the gap fastest here, reaching double-digit share in dry etch, and least in ALD, which is where the next two logic nodes are won.
