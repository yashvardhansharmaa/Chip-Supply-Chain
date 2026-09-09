---json
{
  "id": "memory-and-hbm",
  "number": 11,
  "title": "Memory and HBM",
  "oneLiner": "Three firms make every HBM stack on Earth. The cube is the largest block of silicon in an AI package, and its height is now capped by the cooling plate above it.",
  "plain": "Think of a cook who can chop faster than anyone can fetch ingredients. The fix is not a faster runner but a wider door, so high bandwidth memory stacks up to sixteen memory chips into a cube, drills copper wires straight down through them, and sits the cube a few millimetres from the processor. Stacking is the hard part: each chip is ground thinner than a human hair, the whole cube must stay under a fixed height so it does not foul the cooling plate, and one bad layer ruins all of them. Three firms in the world can do it.",
  "specimen": "hbm-stack",
  "specimenCaption": "Right: a 12-high HBM stack, exploded. A logic base die at the bottom, twelve thinned DRAM dies above it, through-silicon vias running the full height of the cube, microbumps between every layer, molding compound filling the gaps.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "SK hynix", "country": "KR", "share": "63.2% of HBM revenue, 2025; first to complete HBM4, at over 10 Gbps per pin"},
      {"name": "Samsung", "country": "KR", "share": "19.3% of HBM revenue, 2025; Hwaseong and Pyeongtaek"},
      {"name": "Micron", "country": "US", "share": "17.4% of HBM revenue, 2025; HBM4 above 11 Gbps per pin"}
    ],
    "countries": [
      {"code": "KR", "note": "SK hynix Cheongju and Icheon; Samsung Pyeongtaek and Hwaseong"},
      {"code": "US", "note": "Micron headquarters and R&D; SK hynix packaging plant under construction in Indiana"},
      {"code": "TW", "note": "Micron DRAM and HBM packaging in Taichung; TSMC builds HBM4 logic base dies"},
      {"code": "JP", "note": "Micron Hiroshima, 1-gamma DRAM"},
      {"code": "SG", "note": "Micron HBM advanced packaging"}
    ],
    "chinaStatus": "No Chinese firm ships HBM3E or HBM4 in volume. CXMT is the only credible domestic entrant, and the export controls are written to keep it that way.",
    "usStatus": "Micron is the only US-headquartered HBM maker. BIS controls HBM above 2 GB/s per mm2 of package area under ECCN 3A090.c, which captures every stack now in production.",
    "costSignal": "An HBM cube's data interface is 16 times wider than a DDR5 module's, and that width is bought with die area and stacking yield",
    "substitution": {"years": "5-10", "why": "A new entrant needs leading-edge DRAM, a through-silicon-via and thinning line, a stacking process that holds warpage on dies ground to tens of microns, and qualification by Nvidia."}
  },
  "keyFacts": [
    {"fact": "HBM4 sets a 2,048-bit interface with 32 channels, 2 TB/s per stack at 8 Gb/s per pin, and up to 64 GB per stack", "source": "https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing"},
    {"fact": "A single HBM cube's data interface is 1,024 bits wide across 32 channels, 16 times wider than a standard DDR5 module", "source": "https://www.micron.com/products/memory/hbm"},
    {"fact": "Micron HBM4 runs a 2,048-pin bus above 11.0 Gbps for more than 2.8 TB/s per stack, over double the previous generation", "source": "https://www.micron.com/products/memory/hbm/hbm4"},
    {"fact": "SK hynix completed HBM4 development in September 2025 at over 10 Gbps per pin, above the JEDEC standard of 8 Gbps, using Advanced MR-MUF", "source": "https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/"},
    {"fact": "HBM package height rises from 720 to 775 micrometres starting with HBM4; hybrid bonding cuts the bond pitch from about 20 micrometres to under 1", "source": "https://news.skhynix.com/en/tech-note-series-ep2/"},
    {"fact": "BofA estimates the 2026 HBM market at $54.6 billion, up 58% year on year, with HBM3E about two thirds of shipments", "source": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"},
    {"fact": "Nvidia Rubin VR200 carries up to 288 GB of HBM4 at up to 22 TB/s using 12-high stacks", "source": "https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/"},
    {"fact": "BIS controls HBM with bandwidth density above 2 GB/s per square millimetre of package area under ECCN 3A090.c", "source": "https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-direct-product-rule-additions-entity-list-modifications"},
    {"fact": "SK hynix's July 2026 US prospectus splits 2025 HBM revenue between SK hynix at 63.2%, Samsung at 19.3% and Micron at 17.4%, putting Korean suppliers at 82.5% of the market", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"},
    {"fact": "The same filing puts SK hynix at 29.1% of DRAM including HBM in the first quarter of 2026 and says three firms hold more than 90% of DRAM revenue", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"}
  ],
  "figures": [
    {
      "id": "hbm-bandwidth",
      "type": "bars",
      "title": "Peak bandwidth per HBM stack",
      "unit": "GB/s",
      "data": [["HBM3E, 1,024-bit", 1200], ["HBM4, 2,048-bit", 2000], ["HBM4, advanced configurations", 3300]],
      "source": {"label": "Siemens EDA, HBM3E and HBM4 IC design guide, April 2026", "url": "https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/"}
    },
    {
      "id": "hbm-revenue",
      "type": "bars",
      "title": "HBM market revenue, BofA estimate",
      "unit": "$B",
      "data": [["2025", 34.6], ["2026", 54.6]],
      "source": {"label": "BofA estimate cited in SK hynix 2026 market outlook", "url": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"}
    },
    {
      "id": "hbm-suppliers",
      "type": "stack",
      "title": "Global HBM revenue by supplier, 2025",
      "unit": "%",
      "data": [["SK hynix (KR)", 63.2], ["Samsung (KR)", 19.3], ["Micron (US)", 17.4]],
      "source": {"label": "SK hynix Form 424B4 prospectus, 10 July 2026, on IDC data", "url": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"}
    }
  ]
}
---
# Memory and HBM

An AI accelerator is a machine for dragging numbers past arithmetic units. The arithmetic got cheap. The dragging did not. High bandwidth memory decides how fast a GPU runs, it is the largest block of silicon in the package, and three companies make all of it.

## How it works

Think of a cook who can chop faster than anyone can fetch ingredients. The fix is not a faster runner but a wider door, so high bandwidth memory stacks up to sixteen memory chips into a cube, drills copper wires straight down through them, and sits the cube a few millimetres from the processor. Stacking is the hard part: each chip is ground thinner than a human hair, the whole cube must stay under a fixed height so it does not foul the cooling plate, and one bad layer ruins all of them. Three firms in the world can do it.

The width is the whole trick. One HBM cube presents a 1,024-bit interface across 32 independent channels, sixteen times wider than a standard DDR5 module ([source](https://www.micron.com/products/memory/hbm)). Ordinary DRAM cannot be made that wide, because the pins would not fit on a board.

Inference is where that bites. Training reuses each weight across a large matrix multiplication, so it tolerates fetching few bytes per operation. Generating one token instead reads the whole weight set and the whole key-value cache, then stalls on memory, and the cache grows with context and batch size. What limits users per chip is usually capacity and bandwidth, not arithmetic.

## Variants and trade-offs

| Generation | Interface | Bandwidth per stack | Capacity per stack |
|---|---|---|---|
| HBM3E | 1,024-bit, 16 channels | over 1.2 TB/s | 24 GB (8-high), 36 GB (12-high) |
| HBM4 | 2,048-bit, 32 channels | over 2.0 TB/s, up to 3.3 TB/s | up to 64 GB (16-high, 32 Gb dies) |

### HBM3E

The workhorse. Micron ships 24 GB 8-high and 36 GB 12-high parts ([source](https://www.micron.com/products/memory/hbm/hbm3e)), and HBM3E should be about two thirds of all HBM shipments in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)).

### HBM4

JEDEC published JESD270-4 in April 2025, setting the 2,048-bit interface and 2 TB/s per stack at 8 Gb/s per pin ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). Nobody ships the baseline. SK hynix completed HBM4 at over 10 Gb/s per pin in September 2025 ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)), and Micron's parts run above 11 Gb/s for more than 2.8 TB/s per stack ([source](https://www.micron.com/products/memory/hbm/hbm4)). The standard is now a floor the buyers negotiate above.

The other HBM4 change is commercial. The base die is a logic die, so it goes to a foundry: SK hynix partnered with TSMC to build it ([source](https://news.skhynix.com/sk-hynix-partners-with-tsmc-to-strengthen-hbm-technological-leadership/)). That hands TSMC a position inside a product it does not make.

{{figure:hbm-bandwidth}}

## How a stack is built

- **Drill and thin.** Etch through-silicon vias into a DRAM wafer, fill them with copper, then grind the wafer until the vias come through the back.
- **Stack and join.** SK hynix uses Advanced MR-MUF, melting the bumps between stacked dies and moulding underfill around them in one pass, which controls heat and warpage ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)).
- **Stay under the ceiling.** A finished cube is capped at 775 micrometres, raised from 720 for HBM4, because a stack taller than the processor beside it would foul the cold plate ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

Hybrid bonding is the next step and it is not ready. Bonding copper to copper directly cuts the pitch from about 20 micrometres to under 1 and removes the underfill, but SK hynix expects full-scale adoption only at HBM4E or HBM5, where stacks pass twenty layers ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

## Who makes it

DRAM is a three-firm oligopoly, and HBM is the same three firms reordered: SK hynix, Samsung and Micron. Nobody else has leading-edge DRAM and a stacking line in the same company, and that is the barrier.

SK hynix built its lead by being first through Nvidia qualification, and expects roughly 70 percent of Rubin HBM4 in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). The Korean core is now growing an American edge: SK hynix broke ground on a $4 billion packaging plant in West Lafayette, Indiana in August 2026 ([source](https://www.purdue.edu/newsroom/2026/Q3/sk-hynix-breaks-ground-on-4-billion-advanced-packaging-production-facility-in-purdue-research-park/)). Micron packages in Taichung and Singapore.

How the three divide the market is on the record because SK hynix registered shares in the United States. Its July 2026 prospectus prints the split: of 2025 HBM revenue, SK hynix took 63.2 percent, Samsung 19.3 and Micron 17.4, which puts the two Korean suppliers at 82.5 percent of the world's HBM ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The filing attributes the figures to IDC, and they move fast. In 2024 the same three stood at 56.4, 37.8 and 5.8: Samsung halved and Micron tripled inside a year, on qualification wins rather than on capacity. By the first quarter of 2026 Micron was at 23.1 percent and Korea down to 76.9.

{{figure:hbm-suppliers}}

{{figure:hbm-revenue}}

BofA puts the 2026 HBM market at $54.6 billion, up 58 percent on the year ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). HBM is sold forward, so that revenue is contracted long before the wafers exist, and every wafer converted to HBM is a wafer not making commodity DRAM. That is the mechanism by which AI demand raises the price of a laptop.

## The chokepoint

Every leading accelerator is defined by its memory. Nvidia's GB300 NVL72 carries 20 TB of HBM3E at up to 576 TB/s ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)), Rubin's VR200 up to 288 GB of HBM4 per GPU at up to 22 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)), and AMD's MI355X 288 GB of HBM3E at 8 TB/s ([source](https://inferencex.semianalysis.com/chips/mi355x)). None exists without Korean or American HBM.

Washington noticed. The BIS rule of 5 December 2024 added ECCN 3A090.c, controlling HBM with a bandwidth density above 2 GB/s per square millimetre of package area, and extended it to stacks made outside the United States through a foreign direct product rule ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-direct-product-rule-additions-entity-list-modifications)). Read against the JEDEC numbers, that threshold captures every stack now in production, which is what makes it a clean control: there is no compliant high-end HBM to sell.

China's answer is CXMT, and it is behind. We think the gap is real but closing from a base that did not exist five years ago, and the binding constraint for a new entrant is not the DRAM die but the stacking line and the Nvidia qualification behind it.

## Key evaluation criteria

- **Bandwidth per stack** — the number that sets inference throughput. Over 1.2 TB/s on HBM3E, over 2 TB/s on HBM4 ([source](https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/)).
- **Capacity per stack** — sets how large a model and cache fit on one accelerator. Up to 64 GB at 16-high ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)).
- **Stack height** — 775 micrometres for HBM4, which is what limits layer count before the cooling plate ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).
- **Stack yield** — one bad die scraps the cube, so yield, not wafer cost, sets the price.
- **Thermal path** — the base die runs hottest, and every added layer raises resistance to the heatsink above.
- **Qualification** — passing Nvidia's data-rate bar, above 10 Gb/s rather than JEDEC's 8 ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)).

## Takeaways

HBM is the hardest chokepoint in the chain after lithography, and unlike lithography it is also the most expensive component in the box. Three firms supply all of it, and the two Korean ones sold 82.5 percent of it in 2025 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The binding constraint is no longer bandwidth alone but heat and height inside a 775-micrometre cube ([source](https://news.skhynix.com/en/tech-note-series-ep2/)), and hybrid bonding, the fix, is two generations away. Meanwhile the export control on HBM is the cleanest instrument in the whole American toolkit, because a single bandwidth-density threshold catches every part worth buying ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-direct-product-rule-additions-entity-list-modifications)).
