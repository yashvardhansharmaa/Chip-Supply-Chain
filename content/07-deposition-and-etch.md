---json
{
  "id": "deposition-and-etch",
  "number": 7,
  "title": "Deposition and Etch",
  "oneLiner": "Lithography prints the pattern. Deposition and etch build the thing, over a thousand steps per wafer, and this is the one tool segment where China has taken real share.",
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

Lithography prints the pattern. Deposition and etch build the thing. Applied Materials and Lam Research, the two largest suppliers of these tools, booked $28.4 billion and $23.2 billion of revenue in their most recent fiscal years ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000006951/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)) ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)). This is also the one part of the tool chain where Chinese suppliers have taken share that shows up in the global numbers.

## How it works

A chip is built by repeating a short loop: deposit a film, coat it with resist, print a pattern, etch the pattern into the film below, strip the resist, clean, measure. CSET's 2021 map of the supply chain put a single chip at more than 1,000 process steps, with the part-finished product crossing international borders 70 or more times ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). ASML says a modern chip can carry up to 100 layers and take up to four months to make ([source](https://www.asml.com/en/technology/all-about-microchips/how-microchips-are-made)). Cleaning alone accounts for roughly 30 percent of front-end process steps ([source](https://www.rapidus.inc/en/tech/te0009/)).

Deposition tools lay down or grow films from a few atoms to a few hundred nanometres thick: the insulators between wires, the metal in the wires, the gate stack of the transistor. Etch tools remove material where the pattern says it should not be.

The hard part in both is selectivity and conformality. An etch has to attack one material and leave another sitting a nanometre away untouched. A deposition has to coat the bottom of a hole hundreds of times deeper than it is wide as evenly as it coats the flat surface beside it.

Most of this happens in a vacuum chamber with a plasma in it. A radio-frequency field strips electrons off a process gas, and the resulting ions and radicals do the chemistry. Change the gas, the pressure, the RF power and the wafer temperature, and broadly similar hardware either adds material or takes it away.

## Variants and trade-offs

### Deposition families

**Physical vapour deposition**, usually sputtering, fires argon ions at a solid target so that target atoms fly off and land on the wafer ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). It is the workhorse for metal barriers, liners and seed layers. Applied Materials leads it; PVD was a $2.4 billion market as of 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

**Chemical vapour deposition** reacts gases at the wafer surface to grow a film, and **plasma-enhanced CVD** does it at lower temperature by using a plasma to crack the precursor. Plasma CVD alone was a $3.5 billion market as of 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Tokyo Electron held 38 percent of CVD worldwide in 2025 ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).

**Atomic layer deposition** is the precision instrument of the group. It builds material a fraction of a monolayer at a time, and because each half-reaction stops when the surface is saturated, it coats vertical walls and horizontal floors to the same thickness. US export regulators describe ALD as the basis for 3D scaling in 3D DRAM, 3D NAND and gate-all-around logic ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). ASM International leads single-wafer ALD, with Tokyo Electron, Kokusai and Lam Research also in the segment; ALD was a $1.6 billion market as of 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

**Epitaxy** grows single-crystal silicon or silicon-germanium in registry with the wafer beneath, which is how the strained source and drain of a modern transistor is made. **Electrochemical deposition**, plain copper electroplating, fills the interconnect trenches; it was a $0.29 billion market as of 2019 and is supplied mainly by Lam and Applied ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

### Etch families

Dry etch splits into **conductor etch**, for gates, metals and silicon, and **dielectric etch**, for the oxides and nitrides between them. As of 2019 conductor etch was a $6.5 billion market and dielectric etch $4.3 billion ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). CSET's vendor lists put Lam first in conductor etch and Tokyo Electron first in dielectric etch ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

**High-aspect-ratio etch** is the discipline that memory lives or dies by. A 3D NAND channel or a DRAM capacitor is a hole tens of microns deep and tens of nanometres wide, and it has to come out straight, with no bowing and no twisting. Lam's cryogenic etch runs the wafer far below room temperature to sharpen the profile; the company claims Cryo 3.0 cuts profile deviation by 80 percent and carbon emissions by 90 percent, and it plans to triple the installed base in three to five years ([source](https://quartr.com/events/lam-research-corporation-lrcx-investor-day-2025_33D7JGMm)).

**Atomic layer etch** does the reverse of ALD, removing a monolayer per cycle. It is slow and expensive, so it is used only where nothing else will do.

The AI-specific pull comes from three places. Gate-all-around needs *isotropic* etch, which removes material sideways rather than downwards, to release the silicon nanosheets from the sacrificial silicon-germanium between them; BIS explicitly ties its dry etch controls to this, and separately controls wet processing with silicon-germanium-to-silicon selectivity of 100:1 or better ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). HBM needs deep through-silicon vias, which BIS defines as etch at an aspect ratio of 10:1 or greater, non-uniformity under 2 percent and an etch rate above 7 microns per minute ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)). Backside power delivery adds wafer thinning, backside vias and a second metal stack. Lam expects wafer fab equipment intensity per leading-edge wafer to rise more than 50 percent as these architectures land ([source](https://quartr.com/events/lam-research-corporation-lrcx-investor-day-2025_33D7JGMm)).

{{figure:tel-tool-share}}

## Who makes it

Global semiconductor equipment billings hit $135.1 billion in 2025, up 15 percent from $117.1 billion in 2024, with wafer processing up 12 percent and assembly and packaging up 21 percent ([source](https://www.semiconductor-digest.com/semi-reports-global-semiconductor-equipment-billings-reached-135-billion-in-2025-up-15-year-on-year/)). TechInsights put the 2025 IC manufacturing equipment market at $136.2 billion and kept the same top five as 2024: ASML at $27.5 billion, then Applied Materials, Lam Research, Tokyo Electron and KLA ([source](https://www.techinsights.com/blog/top-ic-manufacturing-equipment-suppliers-2025)).

Within deposition and etch there is no single ASML. Tokyo Electron's own Gartner-sourced numbers show it holding 23 percent of dry etch, 27 percent of batch deposition and 15 percent of ALD in 2025, against 91 percent of coater/developer ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)). That gap is the point: TEL has a near-monopoly in track tools and a normal competitive share in etch and deposition.

ASM International is the specialist. Its 2025 revenue was a record €3.2 billion, up 12 percent at constant currency, driven by customers building 2 nm gate-all-around capacity, with molybdenum ALD and area-selective deposition entering volume production at that node ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)). Lam's product families run across the same ground: Striker for dielectric ALD, ALTUS for metal ALD, Aether for dry resist and a cryogenic etch line ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000037/lrcx-20260628.htm)).

Demand is running ahead of the tool makers. KLA raised its wafer equipment forecast to the low $150 billion range for calendar 2026, up from roughly $120 billion in calendar 2025 ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf)). Tokyo Electron sees $150 billion to $170 billion per year in 2026 and 2027, with leading-edge spending up more than 30 percent ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).

{{figure:equipment-billings}}

## China and the controls

China is the largest customer and the fastest-improving competitor at once. It bought $49.3 billion of equipment in 2025, essentially flat year on year, while China, Taiwan and Korea together took 79 percent of the global market ([source](https://www.semiconductor-digest.com/semi-reports-global-semiconductor-equipment-billings-reached-135-billion-in-2025-up-15-year-on-year/)).

The suppliers' exposure has fallen from its peak but is still large. China was 34.1 percent of Tokyo Electron's sales in the year to March 2026, down from 41.7 percent and 44.4 percent in the two prior years ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)). It was 26 percent of Lam's June 2026 quarter, behind Taiwan at 27 percent ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)), and 28 percent of Applied Materials' third fiscal quarter of 2026, down from 35 percent a year earlier ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)). More than 30 percent of ASM's 2025 revenue came from China ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

Domestic toolmakers are the reason those shares matter both ways. Between 2019 and 2024, China-based suppliers went from 2 percent to 7 percent of deposition and from under 3 percent to about 9 percent of etch and clean, reaching roughly 11 percent of dry etch alone and over 10 percent of PVD, where Naura went from 1 percent to 10 percent ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). They gained nothing in ALD and held under 1 percent of it in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). AMEC's 2025 revenue was RMB 12.38 billion, up 36.6 percent, with cumulative etch tool shipments past 6,800 units and a product line now including tungsten CVD, PECVD and silicon-germanium epitaxy ([source](https://www.trendforce.com/news/2026/04/21/news-china-memory-expansion-lifts-domestic-equipment-suppliers-amec-wuhan-jingce-hwatsing-acm-in-focus/)). Analysts put Naura's 2025 revenue at RMB 46.8 billion to 52 billion, which would rank it fifth worldwide, up from eighth in 2022 ([source](https://www.chinadailyhk.com/hk/article/628318)). Piotech is the third name, in PECVD and ALD ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).

The controls have tightened in four moves. The October 7, 2022 interim final rule first put semiconductor manufacturing items and US person support activities under licence, and widened foreign-produced item rules for 28 listed Chinese entities ([source](https://www.govinfo.gov/content/pkg/FR-2022-10-13/pdf/2022-21658.pdf)). The October 2023 rule, effective November 17, 2023, rewrote the equipment entries: new controls on isotropic and anisotropic dry etch under ECCN 3B001.c.1, spatial ALD under 3B001.d.9, low-fluorine tungsten ALD and CVD under 3B001.d.10 and carbon hard mask PECVD under 3B001.d.5 ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)). The December 2024 interim final rule added eight new ECCNs and put 140 entities on the Entity List, extending a foreign direct product rule to tools made outside the United States ([source](https://www.cov.com/en/news-and-insights/insights/2024/12/us-department-of-commerce-strengthens-export-controls-on-advanced-computing-and-semiconductor-manufacturing-items)), and reached specific processes such as TSV etch and deposition into features above 200:1 aspect ratio for 3D DRAM ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).

Since then the direction has wobbled. The Affiliates Rule of September 29, 2025 automatically extended Entity List restrictions to any company at least 50 percent owned by a listed entity ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf)), then BIS stayed it for a year to November 9, 2026 ([source](https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf)). On January 15, 2026 BIS moved licences for chips such as the Nvidia H200 from presumption of denial to case-by-case review, a loosening that applies to accelerators and not to tools ([source](https://www.govinfo.gov/content/pkg/FR-2026-01-15/pdf/2026-00789.pdf)). Enforcement still has bite: Applied Materials took a $253 million charge to settle an export controls matter with Commerce ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).

{{figure:china-tool-share}}

## The chokepoint

This is a real chokepoint but a softer one than lithography. Three or four credible vendors exist for most etch and deposition steps, which is why the controls are written as process specifications rather than as a ban on a machine. The narrow points are ALD, where China holds under 1 percent, and the extreme aspect ratios that HBM and 3D memory need. Those are exactly where the December 2024 rule aims.

## Key evaluation criteria

- **Selectivity** — how strongly the process attacks one material and spares another. BIS uses a silicon-germanium-to-silicon ratio of 100:1 as a control threshold ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **Conformality and aspect ratio** — whether a film reaches the bottom of a deep hole. Controls start at 10:1 for TSV etch and 200:1 for 3D DRAM deposition ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Uniformity** — variation across a 300 mm wafer. Regulators treat under 2 percent as an advanced-manufacturing marker ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Throughput** — wafers per hour, which sets cost per layer. Etch rate above 7 microns per minute is the stated threshold for high-volume TSV work ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Particles and chamber matching** — the defect budget these tools consume, which is measured by the tools in the next chapter.

## Takeaways

Deposition and etch are the volume business of a fab: over a thousand steps per wafer, four American, Japanese and Dutch firms taking most of the money, and no single-vendor monopoly of the kind ASML has in lithography. The AI roadmap raises the difficulty faster than it raises the tool count, because gate-all-around, HBM and backside power all demand better selectivity and deeper holes rather than simply more chambers. China has closed the gap fastest here, reaching double-digit share in dry etch and PVD, and has closed it least in ALD, which is where the next two logic nodes are won.
