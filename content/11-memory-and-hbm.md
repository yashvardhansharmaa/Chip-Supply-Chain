---json
{
  "id": "memory-and-hbm",
  "number": 11,
  "title": "Memory and HBM",
  "oneLiner": "Three firms make every HBM stack in the world. The cube is the largest block of silicon in an AI package, and the cooling plate above it now caps its height.",
  "plain": "High bandwidth memory is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. It stacks up to sixteen memory chips into a cube, drills copper wires straight down through them, and sits the cube a few millimetres from the processor. Stacking is the hard part: each chip is ground thinner than a human hair, the cube must stay under a fixed height or it fouls the cooling plate, and one bad layer ruins the rest. Only SK hynix, Samsung and Micron can do it, and a single line in an American export rule reaches all three.",
  "specimen": "hbm-stack",
  "specimenCaption": "Right: a twelve-high HBM stack, pulled apart. A logic chip at the bottom, twelve thinned memory chips above it, copper through-silicon vias running the full height of the cube, microbumps between every layer, and the moulding compound as a faint box around the whole stack.",
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
    "costSignal": "An HBM cube's data interface is 16 times wider than a DDR5 module's, and that width costs die area and stacking yield",
    "substitution": {"years": "5-10", "why": "A new entrant needs leading-edge DRAM, a line that drills and thins wafers, a stacking process that keeps dies ground to tens of microns from warping, and Nvidia's approval."}
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
      "title": "HBM market revenue, Bank of America estimate",
      "unit": "$B",
      "data": [["2025", 34.6], ["2026", 54.6]],
      "source": {"label": "Bank of America estimate cited in SK hynix's 2026 market outlook", "url": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"}
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

An AI accelerator is a machine for dragging numbers past arithmetic units, and arithmetic got cheap faster than the dragging did. High bandwidth memory now decides how fast a GPU runs, and three companies make all of it.

## How it works

High bandwidth memory is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. It stacks up to sixteen memory chips into a cube, drills copper wires straight down through them, and sits the cube a few millimetres from the processor. Stacking is the hard part: each chip is ground thinner than a human hair, the cube must stay under a fixed height or it fouls the cooling plate, and one bad layer ruins the rest. Only SK hynix, Samsung and Micron can do it, and a single line in an American export rule reaches all three.

One cube presents a 1,024-bit interface across 32 independent channels, sixteen times wider than a standard DDR5 memory module ([source](https://www.micron.com/products/memory/hbm)). Ordinary memory cannot be made that wide: the pins would not fit on a circuit board.

Answering a prompt is where the width earns its cost. Training reuses each stored number across a huge multiplication, so a chip can fetch little and compute a lot. Generating one word of an answer reads the whole model and the whole running record of the conversation, then waits on memory, and that record grows with the length of the conversation and the number of users served at once. Memory size and speed, rather than arithmetic, usually set how many people one chip can serve.

## Variants and trade-offs

| Generation | Interface | Bandwidth per stack | Capacity per stack |
|---|---|---|---|
| HBM3E | 1,024-bit, 16 channels | over 1.2 TB/s | 24 GB (8 chips), 36 GB (12 chips) |
| HBM4 | 2,048-bit, 32 channels | over 2.0 TB/s, up to 3.3 TB/s | up to 64 GB (16 chips, 32 Gb dies) |

### HBM3E

Micron ships the workhorse parts, 24 GB with eight chips stacked and 36 GB with twelve ([source](https://www.micron.com/products/memory/hbm/hbm3e)), and HBM3E should be about two thirds of all HBM shipments in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)).

### HBM4

The standards body JEDEC published JESD270-4 in April 2025, setting the 2,048-bit interface and 2 TB/s per stack at 8 Gb/s per pin ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). Nobody ships at that baseline: SK hynix completed HBM4 at over 10 Gb/s per pin in September 2025 ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)), and Micron's parts run above 11 Gb/s for more than 2.8 TB/s per stack ([source](https://www.micron.com/products/memory/hbm/hbm4)).

HBM4's other change is commercial. The chip at the bottom of the stack is now a logic chip rather than a memory one, so it has to be made in a foundry, and SK hynix partnered with TSMC to build it ([source](https://news.skhynix.com/sk-hynix-partners-with-tsmc-to-strengthen-hbm-technological-leadership/)). That hands TSMC a position inside a product it does not make.

{{figure:hbm-bandwidth}}

## How a stack is built

- **Drill and thin.** Etch vertical holes, the through-silicon vias, into a memory wafer, fill them with copper, then grind the wafer from behind until the copper comes through.
- **Stack and join.** SK hynix uses Advanced MR-MUF, which melts the solder bumps between stacked chips and moulds a filler around them in one pass, holding heat and warping in check ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)).
- **Stay under the ceiling.** HBM4 raised the cap on a finished cube from 720 micrometres to 775, still under a millimetre, because a stack taller than the processor beside it would foul the cooling plate ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

Hybrid bonding is the next step and it is not ready. Pressing copper pad straight onto copper pad, with no solder and no filler, would cut the spacing between connections from about 20 micrometres to under 1, but SK hynix expects full-scale adoption only at HBM4E or HBM5, where stacks pass twenty layers ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

## Who makes it

Ordinary computer memory, DRAM, is a three-firm oligopoly, and HBM is the same three firms reordered: SK hynix, Samsung and Micron. Nobody else has both leading-edge DRAM and a stacking line inside one company.

SK hynix built its lead by being first to pass Nvidia's qualification tests, and expects roughly 70 percent of Rubin HBM4 in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). It broke ground on a $4 billion packaging plant in West Lafayette, Indiana in August 2026 ([source](https://www.purdue.edu/newsroom/2026/Q3/sk-hynix-breaks-ground-on-4-billion-advanced-packaging-production-facility-in-purdue-research-park/)), and Micron packages in Taichung and Singapore.

The split is on the record because SK hynix registered shares in the United States. Its July 2026 prospectus prints it: of 2025 HBM revenue, SK hynix took 63.2 percent, Samsung 19.3 and Micron 17.4, which puts the two Korean suppliers at 82.5 percent of the world's HBM ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The filing credits the research firm IDC, and the numbers move fast. In 2024 the same three stood at 56.4, 37.8 and 5.8, so Samsung halved and Micron tripled inside a year on qualification wins rather than on new capacity. By the first quarter of 2026 Micron was at 23.1 percent and Korea down to 76.9 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

{{figure:hbm-suppliers}}

{{figure:hbm-revenue}}

Bank of America puts the 2026 HBM market at $54.6 billion, up 58 percent on the year ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). HBM is sold forward, so that revenue is contracted long before the wafers exist, and every wafer turned over to HBM is a wafer not making ordinary DRAM. That is how AI demand raises the price of a laptop.

## The chokepoint

Every leading accelerator depends on Korean or American HBM. Nvidia's GB300 NVL72 carries 20 TB of HBM3E at up to 576 TB/s ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)), Rubin's VR200 up to 288 GB of HBM4 per GPU at up to 22 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)), and AMD's MI355X 288 GB of HBM3E at 8 TB/s ([source](https://inferencex.semianalysis.com/chips/mi355x)).

The Bureau of Industry and Security rule of 5 December 2024 added an export classification, ECCN 3A090.c, covering HBM with a bandwidth density above 2 GB/s per square millimetre of package area, and reached stacks made outside the United States through a foreign direct product rule, which catches goods made abroad with American technology ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-direct-product-rule-additions-entity-list-modifications)). Against the JEDEC numbers, that threshold captures every stack now in production, so there is no compliant high-end HBM to sell.

China's answer is CXMT, and it is behind. We think the gap is closing from a base that did not exist five years ago, and that what stops a new entrant is the stacking line and Nvidia's approval, rather than the memory chip itself.

## Key evaluation criteria

- **Bandwidth per stack** — the number that sets how fast a chip can serve answers. Over 1.2 TB/s on HBM3E, over 2 TB/s on HBM4 ([source](https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/)).
- **Capacity per stack** — how large a model fits on one accelerator. Up to 64 GB with sixteen chips stacked ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)).
- **Stack height** — 775 micrometres for HBM4, which is what caps the number of layers before the cooling plate ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).
- **Stack yield** — one bad die scraps the cube, so yield sets the price more than wafer cost does.
- **Thermal path** — the chip at the bottom runs hottest, and every layer added above it makes the heat harder to get out.
- **Qualification** — passing Nvidia's data-rate bar, above 10 Gb/s rather than JEDEC's 8 ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)).

## Takeaways

HBM is the most expensive component in an AI accelerator, and three firms supply all of it: the two Korean ones sold 82.5 percent in 2025 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The limit now is heat and height inside a 775-micrometre cube ([source](https://news.skhynix.com/en/tech-note-series-ep2/)), and the fix, hybrid bonding, is two generations away. The export control on HBM works because one bandwidth-density threshold catches every part worth buying ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-direct-product-rule-additions-entity-list-modifications)).
