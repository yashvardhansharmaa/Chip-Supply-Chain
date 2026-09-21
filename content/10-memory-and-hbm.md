---json
{
  "id": "memory-and-hbm",
  "number": 10,
  "title": "Memory and HBM",
  "oneLiner": "Three firms make every HBM stack in the world. The cube is the largest block of silicon in an AI package, and the cooling plate above it now caps its height.",
  "plain": "High bandwidth memory, or HBM, is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker stacks up to sixteen memory chips into a cube, drills holes straight down through the stack, and fills the holes with copper so that every layer is wired to the ones below. The cube then sits beside the processor, the chip that does the calculating. Stacking is the hard part, because each chip is ground so thin that the copper in its holes shows through its back, the finished cube has to fit under the plate that cools it, and one bad chip ruins the whole cube. Only SK hynix, Samsung and Micron have made it work, and a single line in an American export control reaches all three.",
  "bridge": "A die that computes fast still sits idle if its data arrives slowly, and nothing on the chip itself can fix that.",
  "specimen": "hbm-stack",
  "specimenCaption": "A twelve-high HBM stack pulled apart: a logic die at the base, in copper, and twelve memory dies above it. The finished part is 11 by 12 mm and 0.72 mm tall; each memory die is ground to about 30 micrometers, thinner than a human hair. The footprint is to scale; the heights are exaggerated about fifteen times.",
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
    "chinaStatus": "No Chinese firm ships HBM3E or HBM4 in volume. CXMT is the only Chinese firm with a credible shot at it, and the export controls are written to keep it that way.",
    "usStatus": "Micron is the only American HBM maker. BIS, the US export control office, requires a license for HBM faster than 2 GB/s per square millimeter of package or stack area, under control number ECCN 3A090.c, and every stack now in production is faster than that.",
    "costSignal": "An HBM stack moves data over a path 16 times wider than a DDR5 memory module's, and that width costs chip area and lowers the share of stacks that come out working.",
    "substitutability": {"band": "Hard", "test": "Three firms ship HBM, and no fourth firm has both the newest DRAM and a line that stacks it.", "why": "Among the three makers, share moves as soon as a customer approves a new part: Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent by the first quarter of 2026 without adding capacity. A fourth maker is a harder problem. It would need the newest DRAM, a line that drills through and thins wafers, and a way to stack the thinned chips without warping them, all inside one company, and then its stack would have to pass Nvidia's speed test. That takes five to ten years, and no Chinese firm ships HBM3E or HBM4 in volume yet."}
  },
  "keyFacts": [
    {"fact": "HBM4 sets a 2,048-bit interface with 32 channels, 2 TB/s per stack at 8 Gb/s per pin, and up to 64 GB per stack", "source": "https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing"},
    {"fact": "A single HBM cube's data interface is 1,024 bits wide, which Micron counts as 32 independent channels (the JEDEC standard calls them 16 channels of two pseudo-channels each), 16 times wider than a standard DDR5 module", "source": "https://www.micron.com/products/memory/hbm"},
    {"fact": "Micron HBM4 runs a 2,048-pin bus above 11.0 Gbps for more than 2.8 TB/s per stack, over double the previous generation", "source": "https://www.micron.com/products/memory/hbm/hbm4"},
    {"fact": "SK hynix completed HBM4 development in September 2025 at over 10 Gbps per pin, above the JEDEC standard of 8 Gbps, using Advanced MR-MUF", "source": "https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/"},
    {"fact": "HBM package height rises from 720 to 775 micrometers starting with HBM4; hybrid bonding cuts the bond pitch from about 20 micrometers to under 1", "source": "https://news.skhynix.com/en/tech-note-series-ep2/"},
    {"fact": "BofA estimates the 2026 HBM market at $54.6 billion, up 58% year on year, with HBM3E about two thirds of shipments", "source": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"},
    {"fact": "Nvidia Rubin VR200 carries up to 288 GB of HBM4 at up to 22 TB/s using 12-high stacks", "source": "https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/"},
    {"fact": "ECCN 3A090.c, added by the rule at 89 FR 96790, controls HBM with a memory bandwidth density above 2 gigabytes per second per square millimeter of package or stack area", "source": "https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing"},
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

An AI accelerator is a machine for dragging numbers past arithmetic units, and arithmetic got cheap faster than the dragging did. High bandwidth memory now decides how fast a GPU runs.

## How it works

High bandwidth memory, or HBM, is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker stacks up to sixteen memory chips into a cube, drills holes straight down through the stack, and fills the holes with copper so that every layer is wired to the ones below. The cube then sits beside the processor, the chip that does the calculating. Stacking is the hard part, because each chip is ground so thin that the copper in its holes shows through its back, the finished cube has to fit under the plate that cools it, and one bad chip ruins the whole cube. Only SK hynix, Samsung and Micron have made it work, and a single line in an American export control reaches all three.

Each layer in the cube is a DRAM chip, ground thin and bonded to the one below with microbumps, dots of solder, and the whole stack sits on a base die that manages it. The copper-filled holes are TSVs, through-silicon vias, and they let a signal reach any layer without a wire around the outside.

One cube talks to the processor over 1,024 wires at once, a 1,024-bit interface, sixteen times wider than a standard DDR5 memory module, the memory stick in a PC ([source](https://www.micron.com/products/memory/hbm)). Ordinary memory cannot be made that wide, because the pins would not fit on a circuit board. The stack can, since its wires run down through the TSVs and across a few millimeters of silicon to the processor beside it, with no board in the way.

Answering a prompt is where the width earns its cost. Training reuses each stored number across a huge multiplication, so a chip can fetch little and compute a lot. To generate one word of an answer, the chip reads the whole model from memory, and the whole record of the conversation so far, does a little arithmetic, and waits for the next read. That record grows with the length of the conversation and the number of users served at once. So memory size and speed usually set how many people one chip can serve.

## Variants and trade-offs

| Generation | Interface | Bandwidth per stack | Capacity per stack |
|---|---|---|---|
| HBM3E | 1,024-bit, 16 channels (32 pseudo-channels) | over 1.2 TB/s | 24 GB (8 chips), 36 GB (12 chips) |
| HBM4 | 2,048-bit, 32 channels | over 2.0 TB/s, up to 3.3 TB/s | up to 64 GB (16 chips, 32 Gb dies) |

### HBM3E

Micron ships the workhorse parts, 24 GB with eight chips stacked and 36 GB with twelve ([source](https://www.micron.com/products/memory/hbm/hbm3e)), and HBM3E should be about two thirds of all HBM shipments in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)).

### HBM4

The standards body JEDEC published JESD270-4 in April 2025, setting the 2,048-bit interface and 2 TB/s per stack at 8 Gb/s per pin ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). Nobody ships at that baseline: SK hynix completed HBM4 at over 10 Gb/s per pin in September 2025 ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)), and Micron's parts run above 11 Gb/s for more than 2.8 TB/s per stack ([source](https://www.micron.com/products/memory/hbm/hbm4)).

The chip at the bottom of an HBM4 stack is now a logic chip, so it has to be made in a foundry, and SK hynix partnered with TSMC to build it ([source](https://news.skhynix.com/sk-hynix-partners-with-tsmc-to-strengthen-hbm-technological-leadership/)). That hands TSMC a position inside a product it does not make.

{{figure:hbm-bandwidth}}

## How a stack is built

- **Drill and thin.** Etch vertical holes, the through-silicon vias, into a memory wafer, fill them with copper, then grind the wafer from behind until the copper comes through.
- **Stack and join.** SK hynix uses Advanced MR-MUF, which melts the solder bumps between stacked chips and molds a filler around them in one pass, holding heat and warping in check ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)).
- **Stay under the ceiling.** HBM4 raised the cap on a finished cube from 720 micrometers to 775, still under a millimeter, because a stack taller than the processor beside it would foul the cooling plate ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

Hybrid bonding is the next step and it is not ready. Pressing copper pad straight onto copper pad, with no solder and no filler, would cut the spacing between connections from about 20 micrometers to under 1, but SK hynix expects full-scale adoption only at HBM4E or HBM5, where stacks pass twenty layers ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

## Who makes it

Ordinary computer memory, DRAM, is a three-firm oligopoly, and HBM is the same three firms reordered: SK hynix, Samsung and Micron. Nobody else has both leading-edge DRAM and a stacking line inside one company.

SK hynix built its lead by being first to pass Nvidia's qualification tests, and expects roughly 70 percent of Rubin HBM4 in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). It broke ground on a $4 billion packaging plant in West Lafayette, Indiana in August 2026 ([source](https://www.purdue.edu/newsroom/2026/Q3/sk-hynix-breaks-ground-on-4-billion-advanced-packaging-production-facility-in-purdue-research-park/)), and Micron packages in Taichung and Singapore.

The split is on the record because SK hynix registered shares in the United States: of 2025 HBM revenue, SK hynix took 63.2 percent, Samsung 19.3 and Micron 17.4, which puts the two Korean suppliers at 82.5 percent of the world's HBM ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The filing credits the research firm IDC. These shares move fast: in 2024 the same three stood at 56.4, 37.8 and 5.8, so Samsung halved and Micron tripled inside a year on qualification wins alone. By the first quarter of 2026 Micron was at 23.1 percent and Korea down to 76.9 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

{{figure:hbm-suppliers}}

{{figure:hbm-revenue}}

Bank of America puts the 2026 HBM market at $54.6 billion, up 58 percent on the year ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). HBM is sold forward, so that revenue is contracted long before the wafers exist, and every wafer turned over to HBM is a wafer not making ordinary DRAM, which is how AI demand raises the price of a laptop.

## The chokepoint

Every leading accelerator depends on Korean or American HBM. Nvidia's GB300 NVL72 carries 20 TB of HBM3E at up to 576 TB/s ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)), Rubin's VR200 up to 288 GB of HBM4 per GPU at up to 22 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)), and AMD's MI355X 288 GB of HBM3E at 8 TB/s ([source](https://inferencex.semianalysis.com/chips/mi355x)).

The Bureau of Industry and Security rule of 5 December 2024, at 89 FR 96790, added an export classification, ECCN 3A090.c, for "High bandwidth memory (HBM) having a 'memory bandwidth density' greater than 2 gigabytes per second per square millimeter". Its technical note defines that density as the memory bandwidth in gigabytes per second divided by the area of the package or stack in square millimeters. The rule also reaches stacks made outside the United States, through a foreign direct product rule that catches goods made abroad with American technology ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). Against the JEDEC numbers, that threshold captures every stack now in production, so there is no compliant high-end HBM to sell. Under 15 CFR 742.6(b)(10)(ii) BIS reads applications for 3A090.c into China or Macau with a presumption of approval when the buyer is not headquartered there, and a presumption of denial when it is. That split is what keeps the Chinese sites of Korean and American firms, and the allied packaging houses on the mainland, inside the trade ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)) ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6)).

China's answer is CXMT, and it is behind. The gap is closing from a base that did not exist five years ago, and the barrier for a new entrant is the stacking line and Nvidia's approval.

## Key evaluation criteria

- **Bandwidth per stack** sets how fast a chip can serve answers: over 1.2 TB/s on HBM3E, over 2 TB/s on HBM4 ([source](https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/)).
- **Capacity per stack** decides how large a model fits on one accelerator, up to 64 GB with sixteen chips stacked ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)).
- **Stack height**, 775 micrometers for HBM4, caps the number of layers before the cooling plate ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).
- **Stack yield** sets the price more than wafer cost does, because one bad die scraps the cube.
- **Thermal path** gets worse with every layer: the chip at the bottom runs hottest, and each one added above it makes the heat harder to get out.
- **Qualification** means passing Nvidia's data-rate bar, above 10 Gb/s, against JEDEC's 8 ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)).

## Takeaways

HBM is the most expensive component in an AI accelerator, and three firms supply all of it: the two Korean ones sold 82.5 percent in 2025 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The limit now is heat and height inside a 775-micrometer cube ([source](https://news.skhynix.com/en/tech-note-series-ep2/)), and the fix, hybrid bonding, is two generations away. The export control on HBM works because one bandwidth-density threshold catches every part worth buying ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)).
