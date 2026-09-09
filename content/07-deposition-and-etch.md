---json
{
  "id": "deposition-and-etch",
  "number": 7,
  "title": "Deposition and Etch",
  "oneLiner": "Lithography prints the pattern. Deposition and etch build the thing, over a thousand steps per wafer, and this is the one tool segment where China has taken real share.",
  "plain": "If lithography is the printing, this is the building. A chip is built like a layer cake: lay down a film a few atoms thick, print a pattern on it, burn away what the pattern does not protect, and repeat more than a thousand times. The film has to reach the bottom of a hole hundreds of times deeper than it is wide, and the burn has to eat one material and leave the one beside it. Four firms in America, Japan and the Netherlands make most of these machines, and China has come closer to matching them here than anywhere else.",
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
    {"fact": "Global semiconductor equipment billings reached $135.1B in 2025, up 15% from $117.1B in 2024, with wafer processing equipment up 12% (SEMI)", "source": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"},
    {"fact": "China bought $49.3B of semiconductor equipment in 2025, still the largest single market but down 0.5%, while Taiwan rose 90% to a record $31.5B (SEMI)", "source": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"},
    {"fact": "Tokyo Electron held 23% of dry etch, 38% of CVD and 15% of ALD worldwide in CY2025, against 91% of coater/developer, on the share chart in its own FY2026 results presentation", "source": "https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf"},
    {"fact": "China-based suppliers reached 7% of deposition and about 11% of dry etch in 2024, from 2% and under 3% in 2019", "source": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"},
    {"fact": "AMEC 2025 revenue was RMB 12.385 billion, up 36.6%, with R&D at RMB 3.744 billion or 30.2% of sales and thin-film tool revenue up 224%", "source": "https://www.amec-inc.com/news/708.html"},
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
      "source": {"label": "SEMI, Worldwide Semiconductor Equipment Market Statistics", "url": "https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025"}
    },
    {
      "id": "tel-tool-share",
      "type": "bars",
      "title": "Tokyo Electron world market share by tool type, CY2025",
      "unit": "%",
      "data": [["Coater/developer", 91], ["CVD", 38], ["Oxidation/diffusion", 31], ["Deposition systems", 27], ["Dry etch", 23], ["Cleaning", 20], ["ALD", 15]],
      "source": {"label": "Tokyo Electron FY2026 Q4 results presentation", "url": "https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf"}
    },
    {
      "id": "china-tool-share",
      "type": "bars",
      "title": "China-based suppliers' share of global tool segments, 2024",
      "unit": "%",
      "data": [["Dry stripping", 35], ["Dry etch", 11], ["CMP", 11], ["PVD", 10], ["Etch and clean", 9], ["Deposition", 7], ["CVD", 7], ["Lithography (i-line)", 4]],
      "source": {"label": "CSET, Inside Beijing’s Chipmaking Offensive", "url": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"}
    }
  ]
}
---
# Deposition and Etch

Applied Materials and Lam Research, the two largest deposition and etch suppliers, booked $28.4 billion and $23.2 billion of revenue in their latest fiscal years ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0000006951/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)) ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).

## How it works

If lithography is the printing, this is the building. A chip is built like a layer cake: lay down a film a few atoms thick, print a pattern on it, burn away what the pattern does not protect, and repeat more than a thousand times. The film has to reach the bottom of a hole hundreds of times deeper than it is wide, and the burn has to eat one material and leave the one beside it. Four firms in America, Japan and the Netherlands make most of these machines, and China has come closer to matching them here than anywhere else.

CSET puts a single chip at more than 1,000 process steps, with the part-finished product crossing international borders 70 or more times ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

Most of those steps happen in a vacuum chamber: a radio-frequency field strips electrons off a process gas, and the ions and radicals do the chemistry. Change the gas, pressure, power and temperature and the same hardware adds material or removes it. That is why the export controls here name process specifications rather than machines.

## Variants and trade-offs

### Deposition families

- **Physical vapour deposition** sputters atoms off a target onto the wafer, the workhorse for metal barriers and seed layers, $2.4 billion in 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Chemical vapour deposition** reacts gases at the wafer surface to grow a film; the plasma-enhanced version runs cooler, $3.5 billion in 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Atomic layer deposition** lays down a fraction of a monolayer at a time, so it coats vertical walls and horizontal floors alike. US regulators call it the basis for 3D scaling in 3D DRAM, 3D NAND and gate-all-around logic ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)); ASM International leads it, $1.6 billion in 2019 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Epitaxy and electroplating** grow the strained silicon-germanium source and drain and fill the copper trenches ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

### Etch families

- **Conductor etch** cuts gates, metals and silicon, $6.5 billion in 2019, led by Lam ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Dielectric etch** cuts the oxides and nitrides between them, $4.3 billion in 2019, led by Tokyo Electron ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **High-aspect-ratio etch** decides whether memory works at all: a 3D NAND channel or DRAM capacitor is a hole far deeper than it is wide that has to come out straight. Lam chills the wafer to sharpen the profile, and says Cryo 3.0 holds critical-dimension deviation under 0.1 percent down channels 10 microns deep ([source](https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era)).

AI hardware asks for sideways cuts, deeper holes and a second metal stack on the wafer's back.

- **Gate-all-around** needs isotropic etch, which cuts sideways, to release the silicon nanosheets from the silicon-germanium between them, and BIS ties its dry etch controls to exactly that ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **HBM** needs deep through-silicon vias, which BIS defines as etch at 10:1 or greater above 7 microns per minute ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Backside power delivery** adds thinning, backside vias and a second metal stack. Applied Materials expects it to add about $1 billion per 100,000 wafer starts a month to its wiring business ([source](https://www.globenewswire.com/news-release/2024/07/08/2909540/0/en/applied-materials-unveils-chip-wiring-innovations-for-more-energy-efficient-computing.html)).

{{figure:tel-tool-share}}

## Who makes it

SEMI put global equipment billings at $135.1 billion in 2025, up 15 percent from $117.1 billion, with wafer processing equipment up 12 percent ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)).

Within deposition and etch there is no single ASML. The share chart in Tokyo Electron's own results presentation puts it at 23 percent of dry etch, 27 percent of deposition systems and 15 percent of ALD in 2025, against 91 percent of coater/developer ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).

ASM International is the specialist. Its 2025 revenue reached a record EUR 3.2 billion as customers built 2 nm gate-all-around capacity, with molybdenum ALD entering volume production ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

{{figure:equipment-billings}}

## China and the controls

China is the largest customer and the fastest-improving competitor. It bought $49.3 billion of equipment in 2025, still the biggest single market, though its spending fell half a percent while Taiwan's rose 90 percent to $31.5 billion ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)). China still takes a large share of every major vendor's sales.

- **Tokyo Electron**: 34.1 percent of sales in the year to March 2026, down from 41.7 percent ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).
- **Lam Research**: 26 percent in the June 2026 quarter, behind Taiwan at 27 percent ([source](https://www.sec.gov/Archives/edgar/data/707549/000070754926000033/lrcx_exhibitx991xq4x2026.htm)).
- **Applied Materials**: 28 percent in the third fiscal quarter of 2026, down from 35 percent ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).
- **ASM International**: more than 30 percent of 2025 revenue ([source](https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf)).

Between 2019 and 2024 China-based suppliers went from 2 to 7 percent of deposition and from under 3 to about 9 percent of etch and clean, 11 percent in dry etch alone. In ALD they gained nothing and stayed under 1 percent ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). AMEC, the biggest of them, turned over RMB 12.385 billion in 2025, up 36.6 percent, and spent RMB 3.744 billion on research, 30.2 percent of sales ([source](https://www.amec-inc.com/news/708.html)).

The controls tightened in stages.

- **October 2022.** The 7 October interim final rule put manufacturing equipment and US person support under licence and widened foreign-produced item rules for 28 listed Chinese entities ([source](https://www.govinfo.gov/content/pkg/FR-2022-10-13/pdf/2022-21658.pdf)).
- **October 2023.** The rule effective 17 November rewrote the equipment entries, adding isotropic and anisotropic dry etch (ECCN 3B001.c.1), spatial ALD (3B001.d.9), low-fluorine tungsten ALD and CVD (3B001.d.10) and carbon hard mask PECVD (3B001.d.5) ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **December 2024.** BIS controlled 24 more types of equipment and three types of software, added 140 entities and wrote a foreign direct product rule that reaches tools built outside the United States ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)). The new entries take in TSV etch and deposition into features deeper than 200:1 ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **September 2025.** The Affiliates Rule extended Entity List restrictions to any company at least 50 percent owned by a listed entity ([source](https://www.govinfo.gov/content/pkg/FR-2025-09-30/pdf/2025-19001.pdf)); BIS then stayed it to 9 November 2026 ([source](https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf)).

The rules reach the vendors too: Applied Materials took a $253 million charge to settle an export controls matter ([source](https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html)).

{{figure:china-tool-share}}

## The chokepoint

This is a real chokepoint but a softer one than lithography. Three or four credible vendors exist for most etch and deposition steps. The narrow points are ALD, where China holds under 1 percent ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)), and the extreme aspect ratios HBM and 3D memory need. That is where the December 2024 rule aims ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).

## Key evaluation criteria

- **Selectivity** — how hard the process attacks one material and spares another. BIS controls wet processing at a silicon-germanium-to-silicon ratio of 100:1 ([source](https://www.govinfo.gov/content/pkg/FR-2023-10-25/pdf/2023-23049.pdf)).
- **Conformality and aspect ratio** — whether a film reaches the bottom of a deep hole. Controls start at 10:1 for TSV etch and 200:1 for 3D DRAM deposition ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Uniformity** — variation across a 300 mm wafer, with under 2 percent treated as an advanced-manufacturing marker ([source](https://www.govinfo.gov/content/pkg/FR-2024-12-05/pdf/2024-28270.pdf)).
- **Throughput** — wafers per hour, which sets cost per layer and decides how many lots a fab can run.
- **Particles and chamber matching** — the defect budget these tools consume, measured by the tools in the next chapter.

## Takeaways

Deposition and etch are the volume business of a fab: over a thousand steps per wafer, four American, Japanese and Dutch firms taking most of the money, and no monopoly like ASML's in lithography. The AI roadmap raises difficulty faster than tool count, because gate-all-around, HBM and backside power need better selectivity and deeper holes rather than more chambers. China has closed the gap fastest here and slowest in ALD, the tool the next two logic nodes depend on.
