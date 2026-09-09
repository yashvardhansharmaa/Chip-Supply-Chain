---json
{
  "id": "memory-and-hbm",
  "number": 11,
  "title": "Memory and HBM",
  "oneLiner": "Three firms make every HBM stack on Earth. In a two-GPU package the memory is about 90% of the silicon, and it now sets the price of the machine.",
  "plain": "Think of a cook who can chop faster than anyone can fetch ingredients. The fix is not a faster runner but a wider door, so high bandwidth memory stacks up to sixteen memory chips into a cube, drills copper wires straight down through them, and sits the cube a few millimetres from the processor. Stacking is the hard part: each chip is ground thinner than a human hair, the whole cube must stay under a fixed height so it does not foul the cooling plate, and one bad layer ruins all of them. Three firms in the world can do it.",
  "specimen": "hbm-stack",
  "specimenCaption": "Right: a 12-high HBM stack, exploded. A logic base die at the bottom, twelve thinned DRAM dies above it, through-silicon vias running the full height of the cube, microbumps between every layer, molding compound filling the gaps.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "SK hynix", "country": "KR", "share": "50% of HBM revenue, 2Q26"},
      {"name": "Samsung", "country": "KR", "share": "33% of HBM revenue, 2Q26"},
      {"name": "Micron", "country": "US", "share": "18% of HBM revenue, 2Q26"}
    ],
    "countries": [
      {"code": "KR", "note": "SK hynix Cheongju and Icheon; Samsung Pyeongtaek and Hwaseong"},
      {"code": "US", "note": "Micron headquarters and R&D; SK hynix packaging plant under construction in Indiana"},
      {"code": "TW", "note": "Micron DRAM and HBM packaging in Taichung; TSMC builds HBM4 logic base dies"},
      {"code": "JP", "note": "Micron Hiroshima, 1-gamma DRAM and HBM4"},
      {"code": "SG", "note": "Micron HBM advanced packaging"}
    ],
    "chinaStatus": "CXMT aims to mass-produce HBM3 in 2026 and has sampled stacks to Chinese AI developers including Huawei. No HBM3E or HBM4 in volume. XMC is building domestic HBM stacking at about 3,000 wafers per month.",
    "usStatus": "Micron is the only US-headquartered HBM maker. BIS controls HBM above 2 GB/s per mm2 of package area under ECCN 3A090.c, which captures every stack now in production.",
    "costSignal": "HBM sells for roughly five times the price per bit of DDR5, and consumes about three times the wafer area per bit",
    "substitution": {"years": "5-10", "why": "A new entrant needs leading-edge DRAM, a TSV and thinning line, a stacking process that holds warpage on 50-micron dies, and qualification by Nvidia. CXMT started in 2016 and is still short of HBM3E."}
  },
  "keyFacts": [
    {"fact": "HBM revenue share 2Q26: SK hynix 50%, Samsung 33%, Micron 18%", "source": "https://counterpointresearch.com/en/insights/global-dram-and-hbm-market-share"},
    {"fact": "HBM4 delivers 2 TB/s per stack over a 2,048-bit interface with 32 channels, and up to 64 GB per stack", "source": "https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing"},
    {"fact": "HBM needs about 3x the wafer area of DDR5 for the same bits, and sells for about 5x the price per bit", "source": "https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation"},
    {"fact": "Conventional DRAM contract prices rose 93% to 98% quarter over quarter in 1Q26; DRAM industry revenue hit $97B, up 81% QoQ", "source": "https://www.trendforce.com/presscenter/news/20260601-13070.html"},
    {"fact": "Samsung, SK hynix and Micron held 38.5%, 28.8% and 22.4% of DRAM revenue in 1Q26", "source": "https://www.trendforce.com/presscenter/news/20260601-13070.html"},
    {"fact": "BofA estimates the 2026 HBM market at $54.6 billion, up 58% year on year", "source": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"},
    {"fact": "Micron forecasts the HBM TAM growing from about $35B in 2025 to about $100B in 2028, and has committed its entire calendar 2026 HBM supply on price and volume", "source": "https://www.earningscall.ai/stock/transcript/MU-2026-Q1"},
    {"fact": "Nvidia Rubin VR200 carries up to 288 GB of HBM4 at up to 22 TB/s using 12-high stacks", "source": "https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/"}
  ],
  "figures": [
    {
      "id": "hbm-share",
      "type": "stack",
      "title": "HBM revenue share by vendor, 2Q26",
      "unit": "%",
      "data": [["SK hynix", 50], ["Samsung", 33], ["Micron", 18]],
      "source": {"label": "Counterpoint Research, quarterly DRAM and HBM market share", "url": "https://counterpointresearch.com/en/insights/global-dram-and-hbm-market-share"}
    },
    {
      "id": "hbm-bandwidth",
      "type": "bars",
      "title": "Peak bandwidth per HBM stack, GB/s",
      "unit": "GB/s",
      "data": [["HBM3E, 1,024-bit", 1200], ["HBM4, 2,048-bit", 2000], ["HBM4, advanced configurations", 3300]],
      "source": {"label": "Siemens EDA, HBM3E and HBM4 IC design guide, April 2026", "url": "https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/"}
    },
    {
      "id": "hbm-revenue",
      "type": "bars",
      "title": "HBM market revenue, $B (BofA estimate)",
      "unit": "$B",
      "data": [["2025", 34.6], ["2026", 54.6]],
      "source": {"label": "BofA estimate cited in SK hynix 2026 market outlook", "url": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"}
    }
  ]
}
---
# Memory and HBM

An AI accelerator is a machine for dragging numbers past arithmetic units. The arithmetic got cheap. The dragging did not. High bandwidth memory decides how fast a GPU runs, it is the largest block of silicon in the package, and three companies make all of it.

## How it works

Think of a cook who can chop faster than anyone can fetch ingredients. The fix is not a faster runner but a wider door, so high bandwidth memory stacks up to sixteen memory chips into a cube, drills copper wires straight down through them, and sits the cube a few millimetres from the processor. Stacking is the hard part: each chip is ground thinner than a human hair, the whole cube must stay under a fixed height so it does not foul the cooling plate, and one bad layer ruins all of them. Three firms in the world can do it.

The memory wall is widening. Micron told Hot Chips 2026 that compute performance is scaling roughly three times every two years while HBM bandwidth scales under two times ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation)).

Inference is where that bites. Training reuses each weight across a large matrix multiplication, so it tolerates fetching few bytes per operation. Generating one token instead reads the whole weight set and the whole key-value cache, then stalls on memory, and the cache grows with context and batch size. What limits users per chip is usually capacity and bandwidth, not FLOPS.

Ordinary DRAM cannot supply that. A single DDR5 die delivers about 8 GB/s; a single HBM3E die delivers 256 GB/s ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation)). HBM buys that factor of thirty with die area.

## Variants and trade-offs

| Generation | Interface | Bandwidth per stack | Capacity per stack |
|---|---|---|---|
| HBM3E | 1,024-bit, 16 channels | over 1.2 TB/s | 24 GB (8-high), 36 GB (12-high) |
| HBM4 | 2,048-bit, 32 channels | over 2.0 TB/s, up to 3.3 TB/s | up to 64 GB (16-high, 32 Gb dies) |

Per-pin rates run 9.2 to 12.4 Gbps on HBM3E and 6.4 to 12.8 Gbps on HBM4 ([source](https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/)).

### HBM3E

The workhorse. Micron ships 24 GB 8-high and 36 GB 12-high parts ([source](https://www.micron.com/products/memory/hbm/hbm3e)), and HBM3E should be about two thirds of all HBM shipments in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)).

### HBM4

JEDEC published JESD270-4 on 16 April 2025, setting the 2,048-bit interface and 2 TB/s per stack at 8 Gb/s per pin ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). Nobody ships the baseline. Nvidia demanded above 10 Gb/s for Rubin ([source](https://www.trendforce.com/news/2026/03/09/news-samsung-sk%E2%80%AFhynix-reportedly-tapped-as-nvidia-rubin-hbm4-suppliers-shipments-could-start-in-march/)), and Micron's parts run above 11 Gb/s per pin for more than 2.8 TB/s per stack ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation)).

The other HBM4 change is commercial. The base die is now a logic die, so it goes to a foundry. SK hynix's HBM4 base dies are built by TSMC on a 12 nm-class process and cost an estimated three to four times more than the DRAM core dies SK hynix makes itself, which is why it is reported to be evaluating Intel Foundry for HBM4E ([source](https://www.trendforce.com/news/2026/08/31/news-sk-hynix-reportedly-weighs-intel-for-hbm4e-base-dies-amid-tsmc-cost-pressure-and-supply-diversification/)). That hands TSMC a position inside a product it does not make.

## How a stack is built

- **Drill and thin.** Etch through-silicon vias into a DRAM wafer, fill them with copper, then grind the wafer until the vias come through the back, down to around 50 microns for 16-high HBM4 ([source](https://www.tomshardware.com/tech-industry/semiconductors/sk-hynix-says-hybrid-bonding-wont-be-ready-for-hbm4e-as-ai-memory-runs-into-a-775-micron-ceiling)).
- **Stack and join.** Samsung bonds one die at a time with thermal compression; SK hynix joins the whole stack in a single reflow, which controls heat and warpage better.
- **Stay under the ceiling.** A finished cube is capped at 775 microns, raised from 720 for HBM4, because a stack taller than the processor beside it would foul the cold plate ([source](https://www.tomshardware.com/tech-industry/semiconductors/sk-hynix-says-hybrid-bonding-wont-be-ready-for-hbm4e-as-ai-memory-runs-into-a-775-micron-ceiling)).

Hybrid bonding would remove the microbumps and cut thermal resistance, but SK hynix has ruled it out for HBM4E, leaving HBM5 as the earliest slot.

A stack is only as good as its worst die. Samsung's HBM4 yield was below 60 percent when mass production started in February 2026 and reached about 80 percent by August, with SK hynix in the same range ([source](https://www.trendforce.com/news/2026/08/10/news-samsungs-hbm4-yield-reportedly-hits-80-as-race-to-supply-vera-rubin-heats-up-sk-hynix-labor-talks-add-a-twist/)). And the silicon cost is the part people miss: in a two-GPU package the memory is around 90 percent of the silicon, roughly eight times the area of the GPU dies ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation)).

## Who makes it

{{figure:hbm-share}}

DRAM is a three-firm oligopoly, and HBM is the same three firms reordered. In 1Q26 Samsung, SK hynix and Micron took 38.5, 28.8 and 22.4 percent of a $97 billion DRAM market ([source](https://www.trendforce.com/presscenter/news/20260601-13070.html)). In HBM the order flips, and it is moving: SK hynix has slipped from 57 percent in 4Q25 to 50 in 2Q26 as Samsung climbed from 22 to 33 ([source](https://counterpointresearch.com/en/insights/global-dram-and-hbm-market-share)).

SK hynix built the lead by being first through every Nvidia qualification, and Samsung lost two years failing them. Jensen Huang confirmed in June 2026 that all three had passed certification for Vera Rubin ([source](https://finance.yahoo.com/sectors/technology/articles/nvidia-certifies-samsung-sk-hynix-133001560.html)), though SK hynix still expects roughly 70 percent of Rubin HBM4 in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)).

This is a Korean industry with American and Japanese edges:

- **SK hynix** concentrates HBM in Cheongju, and broke ground on a $4 billion packaging plant in West Lafayette, Indiana in August 2026 ([source](https://www.purdue.edu/newsroom/2026/Q3/sk-hynix-breaks-ground-on-4-billion-advanced-packaging-production-facility-in-purdue-research-park/)).
- **Micron** packages in Taichung and Singapore, and broke ground in July 2026 on a 1.5 trillion yen Hiroshima expansion for 1-gamma DRAM and HBM4 ([source](https://www.trendforce.com/news/2026/07/06/news-micron-breaks-ground-on-hiroshima-fab-expansion-scaling-1%CE%B3-dram-and-hbm-output-as-equipment-set-for-2h28/)).

## Price, contracts and the DRAM shortage

{{figure:hbm-revenue}}

HBM is sold forward. Micron told investors in December 2025 that it had agreed price and volume for its entire calendar 2026 HBM supply, and forecast the market growing from about $35 billion in 2025 to about $100 billion in 2028 ([source](https://www.earningscall.ai/stock/transcript/MU-2026-Q1)).

The rest of the memory market is paying for it. Because HBM needs three times the wafer area per bit and sells for five times the price per bit, every wafer converted removes a disproportionate quantity of commodity DRAM from the world ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation)). Conventional DRAM contract prices rose 93 to 98 percent quarter over quarter in 1Q26 ([source](https://www.trendforce.com/presscenter/news/20260601-13070.html)), then a further 58 to 63 percent in 2Q26, and HP told investors that DRAM had gone from 15 to 18 percent of its PC build cost to 35 percent ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation)). That is what an AI capex cycle looks like from the consumer end.

## The chokepoint

{{figure:hbm-bandwidth}}

Every leading accelerator is defined by its memory. Nvidia's GB300 NVL72 carries 20 TB of HBM3E at up to 576 TB/s ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)), Rubin's VR200 up to 288 GB of HBM4 per GPU at up to 22 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)), and AMD's MI355X 288 GB of HBM3E at 8 TB/s ([source](https://inferencex.semianalysis.com/chips/mi355x)). None exists without Korean or American HBM.

Washington noticed. The BIS rule of 5 December 2024 added ECCN 3A090.c, controlling HBM with a bandwidth density above 2 GB/s per square millimetre of package area ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-direct-product-rule-additions-entity-list-modifications)). That captures every stack now in production, and a foreign direct product rule extends it to stacks made outside the United States ([source](https://www.cov.com/en/news-and-insights/insights/2024/12/us-department-of-commerce-strengthens-export-controls-on-advanced-computing-and-semiconductor-manufacturing-items)).

China's answer is CXMT, which plans HBM3 mass production in 2026, with XMC building HBM packaging at around 3,000 wafers per month ([source](https://www.tomshardware.com/pc-components/dram/chinese-semiconductor-industry-gears-up-for-domestic-hbm3-production-by-the-end-of-2026-cxmt-to-produce-chips-while-naura-maxwell-and-u-preseason-design-tools-for-assembly)). HBM3 in 2026 is roughly where SK hynix was in 2022: a real gap, closing from a base that did not exist five years ago.

## Key evaluation criteria

- **Bandwidth per stack** — the number that sets inference throughput. 1.2 TB/s on HBM3E, over 2 TB/s on HBM4 ([source](https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/)).
- **Capacity per stack** — sets how large a model and cache fit on one accelerator. 36 GB at 12-high, up to 64 GB at 16-high ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)).
- **Stack yield** — the economics. Samsung went from under 60 percent to about 80 percent on HBM4 in six months ([source](https://www.trendforce.com/news/2026/08/10/news-samsungs-hbm4-yield-reportedly-hits-80-as-race-to-supply-vera-rubin-heats-up-sk-hynix-labor-talks-add-a-twist/)).
- **Wafer penalty** — how much commodity DRAM each HBM bit destroys. About 3:1 against DDR5 and worsening ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-says-the-silicon-gap-between-hbm-and-ddr5-is-widening-with-every-generation)).
- **Thermal path** — the base die runs hottest, and every added layer raises resistance to the heatsink above.
- **Qualification** — passing Nvidia's data-rate bar, above 10 Gb/s for Rubin rather than JEDEC's 8 ([source](https://www.trendforce.com/news/2026/03/09/news-samsung-sk%E2%80%AFhynix-reportedly-tapped-as-nvidia-rubin-hbm4-suppliers-shipments-could-start-in-march/)).

## Takeaways

HBM is the hardest chokepoint in the chain after lithography, and unlike lithography it is also the most expensive component in the box. Three firms, two of them Korean, supply all of it, and their entire 2026 output is already sold. The binding constraint is no longer bandwidth alone but heat and height inside a 775-micron cube. Meanwhile HBM's silicon penalty against commodity DRAM is widening, and that penalty is the mechanism by which AI demand raises the price of a laptop.
