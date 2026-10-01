---json
{
  "id": "memory-and-hbm",
  "number": 10,
  "title": "Memory and HBM",
  "oneLiner": "Three firms make nearly all the HBM sold worldwide. From HBM4 on, the package specification lets a finished stack stand 775 micrometers tall.",
  "plain": "High bandwidth memory, or HBM, is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker etches tiny holes into each memory wafer, fills them with copper, grinds the wafer until the copper shows through its back, tests each chip, and stacks up to sixteen good chips into a cube so that every layer is wired to the ones below. The cube then sits beside the processor, the chip that does the calculating. Stacking is the hard part, because each chip is ground very thin, the finished cube has to stay within a set height, and a chip that fails after stacking can scrap the whole cube. Only SK hynix, Samsung and Micron have made it work at scale, and a single line in an American export control reaches all three.",
  "bridge": "A die that computes fast still sits idle if its data arrives slowly, and nothing on the chip itself can fix that.",
  "specimen": "hbm-stack",
  "specimenCaption": "A twelve-high HBM stack pulled apart: a logic die at the base, in copper, and twelve memory dies above it. The finished part is 11 by 12 mm and 0.72 mm tall; each memory die is ground to about 30 micrometers, thinner than a human hair. The footprint is to scale; the heights are exaggerated about fifteen times.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "SK hynix", "country": "KR", "share": "63.2% of HBM revenue, 2025; says it was first to complete HBM4 development, September 2025, at over 10 Gbps per pin"},
      {"name": "Samsung", "country": "KR", "share": "19.3% of HBM revenue, 2025; says it shipped the industry's first commercial HBM4 in February 2026, at 11.7 Gbps per pin on a 4 nm logic base die"},
      {"name": "Micron", "country": "US", "share": "17.4% of HBM revenue, 2025; HBM4 above 11 Gbps per pin"}
    ],
    "countries": [
      {"code": "KR", "note": "SK hynix Cheongju and Icheon; Samsung Pyeongtaek and Hwaseong"},
      {"code": "US", "note": "Micron headquarters and R&D; SK hynix packaging plant under construction in Indiana"},
      {"code": "TW", "note": "Micron DRAM and HBM production; TSMC builds the HBM4 base die for SK hynix"},
      {"code": "JP", "note": "Micron Hiroshima, 1-gamma DRAM"},
      {"code": "SG", "note": "Micron HBM advanced packaging plant, adding capacity from 2027"}
    ],
    "chinaStatus": "No Chinese firm ships HBM3E or HBM4 in volume. CXMT, China's strongest DRAM maker, was planning in October 2025 to produce HBM3 in 2026, and CSIS called it in December 2024 one of only two Chinese firms with a credible path to producing advanced HBM. Huawei said in September 2025 that its Ascend 950 chips would use two HBM designs of its own, HiBL 1.0 and HiZQ 2.0, and that the 950DT, due in the fourth quarter of 2026, would carry 144 GB of HiZQ 2.0 at 4 TB/s. The announcement did not say who would manufacture the memory.",
    "usStatus": "Micron is the only American HBM maker. BIS, the US export control office, controls HBM with a memory bandwidth density above 2 GB per second per square millimeter under control number ECCN 3A090.c, and shipping it to Macau or a Country Group D:5 destination such as China needs a license unless an exception applies. BIS said in December 2024 that every HBM stack then in production exceeded that threshold. License Exception HBM (15 CFR 740.25) lets an exporter headquartered in the United States or a Country Group A:5 ally ship HBM below 3.3 GB per second per square millimeter without a license, if the designer of the co-packaged chip buys it directly and it goes straight to the packaging site. The control excludes co-packaged chips that combine HBM and logic and whose main function is processing, which the accelerator rules may cover instead.",
    "costSignal": "An HBM stack moves data over a path 16 times wider than a DDR5 memory module's. That width costs chip area and lowers the share of stacks that come out working.",
    "substitutability": {"band": "Hard", "test": "Three firms ship nearly all HBM, and no fourth firm has both the newest DRAM and a line that stacks it.", "why": "Among the three HBM makers, market share moves quickly, and Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent in the first quarter of 2026. A fourth maker would be harder. It would need the newest DRAM, a line that drills through and thins wafers, and a way to stack the thinned chips without warping them, all inside one company. Its stack would then have to pass a customer's qualification tests, and no Chinese firm ships HBM3E or HBM4 in volume yet."}
  },
  "keyFacts": [
    {"fact": "HBM4 sets a 2,048-bit interface with 32 channels, 2 TB/s per stack at 8 Gb/s per pin, and up to 64 GB per stack", "source": "https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing"},
    {"fact": "An HBM3E cube has 1,024 I/O pins split into 16 independent channels, or 32 pseudo-channels, and Micron's runs above 9.2 Gbps per pin for more than 1.2 TB/s per stack", "source": "https://www.micron.com/products/memory/hbm/hbm3e"},
    {"fact": "Micron HBM4 runs a 2,048-pin bus above 11.0 Gbps for more than 2.8 TB/s per stack, over double the previous generation", "source": "https://www.micron.com/products/memory/hbm/hbm4"},
    {"fact": "SK hynix completed HBM4 development in September 2025 at over 10 Gbps per pin, above the JEDEC standard of 8 Gbps, using Advanced MR-MUF", "source": "https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/"},
    {"fact": "Samsung says it began mass production and shipped the industry's first commercial HBM4 in February 2026, at 11.7 Gbps per pin with a 4 nm logic base die", "source": "https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4"},
    {"fact": "HBM package height rises from 720 to 775 micrometers starting with HBM4; hybrid bonding cuts the bond pitch from about 20 micrometers to under 1", "source": "https://news.skhynix.com/en/tech-note-series-ep2/"},
    {"fact": "Bank of America, as quoted in SK hynix's January 2026 market outlook, estimates the 2026 HBM market at $54.6 billion, up 58% year on year; the same outlook says major analysts expect HBM3E to be about two thirds of 2026 HBM shipments", "source": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"},
    {"fact": "Nvidia's Rubin GPU carries up to 288 GB of HBM4 at up to 22 TB/s using 12-high stacks", "source": "https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/"},
    {"fact": "ECCN 3A090.c, added by the rule at 89 FR 96790, controls HBM with a memory bandwidth density above 2 gigabytes per second per square millimeter of package or stack area", "source": "https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing"},
    {"fact": "SK hynix's July 2026 US prospectus, citing IDC, splits 2025 HBM revenue between SK hynix at 63.2%, Samsung at 19.3% and Micron at 17.4%", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"},
    {"fact": "The same filing puts SK hynix at 29.1% of DRAM including HBM in the first quarter of 2026 and says three firms held more than 90% of DRAM revenue in that quarter", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"}
  ],
  "figures": [
    {"id": "hbm-inside", "type": "animation", "src": "hbm-stack", "title": "Inside a memory stack", "note": "Simplified cross-section. Heights follow the published limits and are drawn to one vertical scale; widths are not to scale."},
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
      "title": "HBM market forecast for 2026, Bank of America",
      "unit": "$B",
      "data": [["2026", 54.6]],
      "source": {"label": "Bank of America estimate cited in SK hynix's 2026 market outlook, January 2026", "url": "https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/"}
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

An AI accelerator is a machine for moving numbers past arithmetic units, and arithmetic got cheap faster than the moving did. The US export control office notes that a processor cannot reach its full capabilities unless its memory capacity and bandwidth rise with its speed ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)).

## How it works

High bandwidth memory, or HBM, is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker etches tiny holes into each memory wafer, fills them with copper, grinds the wafer until the copper shows through its back, tests each chip, and stacks up to sixteen good chips into a cube so that every layer is wired to the ones below. The cube then sits beside the processor, the chip that does the calculating. Stacking is the hard part, because each chip is ground very thin, the finished cube has to stay within a set height, and a chip that fails after stacking can scrap the whole cube. Only SK hynix, Samsung and Micron have made it work at scale, and a single line in an American export control reaches all three.

Each layer in the cube is a DRAM chip, ground thin and bonded to the one below through microbumps, tiny metal bumps, and the whole stack sits on a base die that manages it. The copper-filled holes are TSVs, through-silicon vias, and they let a signal reach any layer without a wire around the outside.

An HBM3E cube talks to the processor over 1,024 wires at once, a 1,024-bit interface, sixteen times wider than a standard DDR5 memory module, the memory stick in a PC ([source](https://www.micron.com/products/memory/hbm)). HBM4 doubles that to 2,048 wires ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). Ordinary memory cannot be made that wide, because the pins would not fit on a circuit board. The stack can, since its wires run down through the TSVs and across a silicon interposer to the processor beside it, with no board in the way ([source](https://www.micron.com/products/memory/hbm)).

{{figure:hbm-inside}}

Answering a prompt is what the width is for. Training reuses each stored number across a huge multiplication, so a chip can fetch little and compute a lot. To generate one word of an answer, the chip reads the whole model from memory, and the whole record of the conversation so far, does a little arithmetic, and waits for the next read. That record grows with the length of the conversation and the number of users served at once. So memory size and speed usually set how many people one chip can serve.

## Variants and trade-offs

| Generation | Interface | Bandwidth per stack | Capacity per stack |
|---|---|---|---|
| HBM3E | 1,024-bit, 16 channels (32 pseudo-channels) | over 1.2 TB/s | 24 GB (8 chips), 36 GB (12 chips) |
| HBM4 | 2,048-bit, 32 channels | over 2.0 TB/s, up to 3.3 TB/s | up to 64 GB (16 chips, 32 Gb dies) |

### HBM3E

Micron ships the high-volume parts, 24 GB with eight chips stacked and 36 GB with twelve ([source](https://www.micron.com/products/memory/hbm/hbm3e)). SK hynix's January 2026 market outlook says major research and brokerage analysts expect HBM3E to be about two thirds of all HBM shipments in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)).

### HBM4

The standards body JEDEC published JESD270-4 in April 2025, setting the 2,048-bit interface and 2 TB/s per stack at 8 Gb/s per pin ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). SK hynix says it was first to complete HBM4 development, in September 2025, at over 10 Gb/s per pin ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)). Samsung says it began mass production and shipped the first commercial HBM4 in February 2026, at 11.7 Gb/s per pin, with a 4 nm logic base die ([source](https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4)). Micron's parts run above 11 Gb/s for more than 2.8 TB/s per stack ([source](https://www.micron.com/products/memory/hbm/hbm4)).

The chip at the bottom of the stack is a base die, and SK hynix, which made its own base dies up to HBM3E, chose TSMC's advanced logic process for the HBM4 base die so it can hold more functions ([source](https://news.skhynix.com/sk-hynix-partners-with-tsmc-to-strengthen-hbm-technological-leadership/)). That gives TSMC a role inside a product it does not make.

{{figure:hbm-bandwidth}}

## How a stack is built

- **Drill and thin.** Etch vertical holes, the through-silicon vias, into a memory wafer, fill them with copper, then grind the wafer from behind until the copper comes through.
- **Stack and join.** The chips are joined by thermocompression bonding, which connects them through metal bumps under heat and pressure and comes in several forms ([source](https://news.skhynix.com/en/tech-note-series-ep2/)). SK hynix uses Advanced MR-MUF, which stacks the chips, injects a liquid protective material between them and hardens it, and the company says the process controls warping and dissipates heat well ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)). Samsung said in February 2024 that its twelve-high HBM3E uses TC-NCF, thermocompression with a thin non-conductive film between the chips, which it expected to help limit warping as chips get thinner ([source](https://news.samsung.com/global/samsung-develops-industry-first-36gb-hbm3e-12h-dram)).
- **Stay under the height limit.** HBM4 raised the package specification height of a finished cube from 720 micrometers to 775, still under a millimeter ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

Hybrid bonding is the next step and it is not ready. Pressing copper pad straight onto copper pad, with no solder and no filler, would cut the spacing between connections from about 20 micrometers to under 1, but a tech note on SK hynix's newsroom says full-scale adoption in HBM is most likely at HBM4E or HBM5, where stacks are projected to pass twenty layers ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

## Who makes it

Ordinary computer memory, DRAM, is a three-firm oligopoly, and HBM is the same three firms reordered: SK hynix, Samsung and Micron ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). Nobody else has both leading-edge DRAM and a stacking line inside one company.

SK hynix was the first company to mass-produce several generations of HBM, including HBM3 and HBM3E ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). UBS, as quoted in SK hynix's January 2026 market outlook, expected SK hynix to take about 70 percent of the HBM4 market for Nvidia's Rubin platform in 2026 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). Samsung says it shipped the first commercial HBM4 in February 2026 ([source](https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4)). SK hynix broke ground in August 2026 on an advanced packaging plant in West Lafayette, Indiana, an investment of over $4 billion ([source](https://www.purdue.edu/newsroom/2026/Q3/sk-hynix-breaks-ground-on-4-billion-advanced-packaging-production-facility-in-purdue-research-park/)). Micron is modernizing its DRAM and HBM production capacity in Taiwan and has broken ground on an HBM advanced packaging plant in Singapore to expand its packaging capacity from 2027 ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312525000028/mu-20250828.htm)).

The split is on the record because SK hynix registered shares in the United States: of 2025 HBM revenue, SK hynix took 63.2 percent, Samsung 19.3 and Micron 17.4 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The filing credits the research firm IDC. These shares move fast, and in 2024 the same three stood at 56.4, 37.8 and 5.8 percent ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). In the first quarter of 2026 they stood at 56.4, 20.5 and 23.1 percent ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

{{figure:hbm-suppliers}}

{{figure:hbm-revenue}}

Bank of America, in an estimate SK hynix quoted in January 2026, put the 2026 HBM market at $54.6 billion, up 58 percent on 2025 ([source](https://news.skhynix.com/en/2026-market-outlook-focus-on-the-hbm-led-memory-supercycle/)). SK hynix says HBM requires greater wafer input than traditional DRAM ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). It also says the industry-wide reallocation of production capacity to HBM has left traditional DRAM, the kind used in PCs and phones, undersupplied, which helped drive a significant price recovery in that market from the third quarter of 2025 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

## The chokepoint

Every leading accelerator made outside China depends on Korean or American HBM. Nvidia's GB300 NVL72 carries 20 TB of HBM3E at up to 576 TB/s ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)), Rubin up to 288 GB of HBM4 per GPU at up to 22 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)), and AMD's MI355X 288 GB of HBM3E at 8 TB/s ([source](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html)).

The Bureau of Industry and Security rule of 5 December 2024, at 89 FR 96790, added an export classification, ECCN 3A090.c, for "High bandwidth memory (HBM) having a 'memory bandwidth density' greater than 2 gigabytes per second per square millimeter". Its technical note defines that density as the memory bandwidth in gigabytes per second divided by the area of the package or stack in square millimeters. The rule also reaches stacks made outside the United States, through a foreign direct product rule that catches goods made abroad with American technology ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). BIS stated in the rule that all HBM stacks then in production exceeded that threshold ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). Under 15 CFR 742.6(b)(10)(ii) BIS reviews applications for 3A090.c to Macau or a Country Group D:5 destination such as China with a presumption of approval when neither the buyer nor its ultimate parent is headquartered in one of those places, and with a presumption of denial otherwise ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6)).

Two provisions narrow the control. License Exception HBM, at 15 CFR 740.25, lets an exporter headquartered in the United States or a Country Group A:5 ally ship HBM below 3.3 GB per second per square millimeter without a license, if the designer of the co-packaged chip buys it directly and it goes straight to the packaging site ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25)). The rule also excludes co-packaged chips that combine HBM and logic and whose main function is processing, which other chip controls may cover instead ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). CSIS said in December 2024 that the rules still allowed HBM2 to go to China with end-use and end-user restrictions, and that Nvidia's H20, whose HBM3 is packaged with the processor, was then still exportable under the accelerator thresholds ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)).

In December 2024 CSIS called China's strongest DRAM maker, CXMT, one of only two Chinese firms with a credible path to producing advanced HBM ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). The Institute for Progress reported in October 2025 that CXMT was planning to produce HBM3 in 2026 ([source](https://ifp.org/the-b30a-decision/)). Huawei said in September 2025 that its Ascend 950 chips would use two HBM designs of its own, HiBL 1.0 and HiZQ 2.0, and that the 950DT, due in the fourth quarter of 2026, would carry 144 GB of HiZQ 2.0 at 4 TB/s ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). The announcement did not say who would manufacture the memory ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). SK hynix says HBM requires advanced production processes such as TSV packaging and compliance with the rigorous testing and approval processes its customers set ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

## Key evaluation criteria

- **Bandwidth per stack** sets how fast a chip can serve answers: over 1.2 TB/s on HBM3E, over 2 TB/s on HBM4 ([source](https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/)).
- **Capacity per stack** decides how large a model fits on one accelerator, up to 64 GB with sixteen chips stacked in the JEDEC HBM4 standard ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). Samsung said in February 2026 that its twelve-high HBM4 comes in 24 to 36 GB and that sixteen-high parts would take it to 48 GB ([source](https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4)).
- **Stack height**, 775 micrometers in the HBM4 package specification, caps how many layers fit in a stack ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).
- **Stack yield** matters because a chip that fails after stacking can scrap the whole cube. Micron sends only dies that pass testing on to assembly and tests the finished cube again ([source](https://www.micron.com/products/memory/hbm/hbm4)).
- **Thermal path** gets harder with every layer, and heat dissipation becomes a major challenge at 16 to 20 layers as heat builds up in the stack ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).
- **Qualification** means passing each customer's tests, and SK hynix credits its experience with complex qualification processes for its standing as a trusted HBM supplier ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

## Takeaways

Three companies, SK hynix, Samsung and Micron, make nearly all high-bandwidth memory (HBM), the stacked memory chips that sit beside an AI processor, and SK hynix alone sold 63.2 percent of it in 2025 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). Since December 2024, HBM with a bandwidth density above 2 GB per second per square millimeter has been a controlled export to China under ECCN 3A090.c, including stacks made outside the United States, and BIS said every stack then in production crossed that line ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). A license exception still lets exporters headquartered in the United States or a close ally ship HBM below 3.3 GB per second per square millimeter without a license, if the chip's designer buys it directly and it goes straight to the packaging site ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25)). CSIS noted in December 2024 that HBM already packaged with a processor is judged by the chip performance rules instead, which then kept Nvidia's H20, with its HBM3, exportable to China ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). In late 2024, China's main memory maker, CXMT, was working toward mass production of HBM2, a generation introduced in 2016 ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). The Institute for Progress estimated in October 2025 that, even with CXMT planning to produce HBM3 in 2026, the United States and its partners would make 70 times as much HBM as China that year ([source](https://ifp.org/the-b30a-decision/)).
