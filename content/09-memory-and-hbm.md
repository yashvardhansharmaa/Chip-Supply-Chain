---json
{
  "id": "memory-and-hbm",
  "number": 9,
  "title": "Memory and HBM",
  "oneLiner": "SK hynix, Samsung and Micron make nearly all high bandwidth memory (HBM), the stacked memory beside AI chips. SK hynix took 63.2 percent of HBM revenue in 2025.",
  "plain": "High bandwidth memory, or HBM, is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker etches tiny holes into each memory wafer, fills them with copper and grinds the wafer until the copper shows through its back. It tests each of the wafer's chips and stacks up to sixteen good ones into a cube, with every layer wired to the ones below. The cube then sits beside the processor, the chip that does the calculating. Stacking is the hard part because each chip is ground thinner than a human hair and the finished cube has to stay within a height limit of less than a millimeter. One chip that fails after stacking can scrap the whole cube. Only SK hynix, Samsung and Micron make HBM in volume. One US export rule covers HBM from all three, including the two based in South Korea.",
  "bridge": "A die that computes fast still sits idle if its data arrives slowly, and nothing on the chip itself can fix that.",
  "specimen": "hbm-stack",
  "specimenCaption": "A twelve-high HBM stack pulled apart: a logic die at the base, shown in copper, and twelve memory dies above it. The finished part is 11 by 11 mm and 0.72 mm tall. Each memory die is ground to about 30 micrometers, thinner than a human hair. The footprint is to scale, but the heights are exaggerated about fifteen times.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "SK hynix", "country": "KR", "share": "63.2% of HBM revenue in 2025", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"},
      {"name": "Samsung", "country": "KR", "share": "19.3% of HBM revenue in 2025", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"},
      {"name": "Micron", "country": "US", "share": "17.4% of HBM revenue in 2025", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"}
    ],
    "countries": [
      {"code": "KR", "note": "SK hynix in Cheongju and Icheon, Samsung in Pyeongtaek and Hwaseong"},
      {"code": "US", "note": "Micron headquarters and R&D, and an SK hynix packaging plant under construction in Indiana"},
      {"code": "TW", "note": "Micron DRAM and HBM production"},
      {"code": "JP", "note": "Micron Hiroshima, 1-gamma DRAM"},
      {"code": "SG", "note": "Micron HBM advanced packaging plant, adding capacity from 2027"}
    ],
    "chinaStatus": "In June 2026 SemiAnalysis judged that CXMT, China's strongest DRAM maker, was still struggling to stabilize supply of eight-high HBM3. The Institute for Progress had estimated in October 2025 that China would make virtually no HBM that year. Huawei said in September 2025 that its Ascend 950 chips would use two HBM designs of its own, without saying who would manufacture the memory.",
    "chinaSources": ["https://newsletter.semianalysis.com/p/chinas-cxmt-is-set-to-challenge-dram", "https://ifp.org/the-b30a-decision/", "https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech"],
    "usStatus": "Micron is the only American HBM maker. As of October 2026, License Exception HBM lets US and allied exporters ship HBM below 3.3 GB per second per square millimeter without a license, including to China when the chip designer buys it directly and it goes straight to the packaging site.",
    "usSources": ["https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm", "https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25"],
    "costSignal": "About $35B HBM market in 2025, Micron's December 2025 estimate",
    "costSources": ["https://s25.q4cdn.com/621799436/files/doc_financials/2026/q1/Micron_Q1-2026-Prepared-Remarks.pdf"],
    "substitutability": {"band": "Hard", "test": "Three firms took nearly all HBM revenue in 2025.", "testSources": ["https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"], "why": "SK hynix says only a few firms have the expertise and resources to design, make and package memory chips. It says HBM also needs advanced processes such as packaging with through-silicon vias (TSVs), the copper-filled holes that link the layers, and must pass customers' rigorous testing and approval.", "whySources": ["https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm", "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"]}
  },
  "keyFacts": [
    {"fact": "The HBM4 standard sets a 2,048-bit interface with 32 channels, 2 TB/s per stack at 8 Gb/s per pin, and up to 64 GB per stack", "source": "https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing"},
    {"fact": "An HBM3E cube has 1,024 I/O pins split into 16 independent channels, or 32 pseudo-channels. Micron's runs above 9.2 Gbps per pin for more than 1.2 TB/s per stack", "source": "https://www.micron.com/products/memory/hbm/hbm3e"},
    {"fact": "Micron HBM4 runs a 2,048-pin bus above 11.0 Gbps for more than 2.8 TB/s per stack, over double the previous generation", "source": "https://www.micron.com/products/memory/hbm/hbm4"},
    {"fact": "SK hynix completed HBM4 development in September 2025 at over 10 Gbps per pin, above the JEDEC standard of 8 Gbps, using Advanced MR-MUF", "source": "https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/"},
    {"fact": "Samsung says it began mass production and shipped the industry's first commercial HBM4 in February 2026, at 11.7 Gbps per pin with a 4 nm logic base die", "source": "https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4"},
    {"fact": "HBM package height rises from 720 to 775 micrometers starting with HBM4. SK hynix gives about 20 micrometers as the typical spacing between microbumps, against less than 1 micrometer for hybrid bonds", "source": "https://news.skhynix.com/en/tech-note-series-ep2/"},
    {"fact": "Micron forecast in December 2025 that the HBM market would grow about 40% a year through 2028, from about $35 billion in 2025 to around $100 billion in 2028", "source": "https://s25.q4cdn.com/621799436/files/doc_financials/2026/q1/Micron_Q1-2026-Prepared-Remarks.pdf"},
    {"fact": "Nvidia's Rubin GPU carries up to 288 GB of HBM4 at up to 22 TB/s using 12-high stacks", "source": "https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/"},
    {"fact": "ECCN 3A090.c, added by the rule at 89 FR 96790, controls HBM with a memory bandwidth density above 2 gigabytes per second per square millimeter of package or stack area", "source": "https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing"},
    {"fact": "SK hynix's July 2026 US prospectus, citing IDC, splits 2025 HBM revenue between SK hynix at 63.2%, Samsung at 19.3% and Micron at 17.4%", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"},
    {"fact": "The same filing puts SK hynix at 29.1% of DRAM including HBM in the first quarter of 2026 and says three firms held more than 90% of DRAM revenue in that quarter", "source": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"}
  ],
  "figures": [
    {"id": "hbm-inside", "type": "animation", "src": "hbm-stack", "title": "Inside a memory stack", "note": "Simplified cross-section. Heights follow the HBM height limits of 720 and 775 micrometers and are drawn to one vertical scale. Widths are not to scale."},
    {
      "id": "hbm-bandwidth",
      "type": "bars",
      "mark": "HBM4, advanced configurations",
      "title": "Bandwidth per HBM stack",
      "finding": "As of April 2026, HBM4 reaches up to 3,300 GB/s per stack, against 2,000 in the JEDEC standard",
      "unit": "GB/s",
      "data": [["HBM3E, 1,024-bit", 1200], ["HBM4, JEDEC standard", 2000], ["HBM4, advanced configurations", 3300]],
      "source": {"label": "Siemens EDA, HBM3E and HBM4 IC design guide, April 2026", "url": "https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/"}
    },
    {
      "id": "hbm-revenue",
      "type": "columns",
      "title": "HBM market, Micron's estimate for 2025 and forecast for 2028",
      "finding": "Micron sees HBM reaching $100 billion in 2028, from an estimated $35 billion",
      "unit": "$B",
      "data": [["2025", 35], ["2028", 100]],
      "source": {"label": "Micron prepared remarks, fiscal first quarter 2026, 17 December 2025", "url": "https://s25.q4cdn.com/621799436/files/doc_financials/2026/q1/Micron_Q1-2026-Prepared-Remarks.pdf"}
    },
    {
      "id": "hbm-suppliers",
      "type": "stack",
      "title": "Global HBM revenue by supplier, 2025",
      "finding": "SK hynix took 63.2 percent of global HBM revenue in 2025",
      "unit": "%",
      "data": [["SK hynix (KR)", 63.2], ["Samsung (KR)", 19.3], ["Micron (US)", 17.4]],
      "source": {"label": "SK hynix Form 424B4 prospectus, 10 July 2026, on IDC data", "url": "https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm"}
    }
  ]
}
---
# Memory and HBM

An AI accelerator moves numbers from memory to its arithmetic units and back. The US export control office wrote in December 2024 that a processor cannot reach its full capabilities unless its memory capacity and bandwidth rise with its speed ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)).

## How it works

High bandwidth memory, or HBM, is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker etches tiny holes into each memory wafer, fills them with copper and grinds the wafer until the copper shows through its back. It tests each of the wafer's chips and stacks up to sixteen good ones into a cube, with every layer wired to the ones below. The cube then sits beside the processor, the chip that does the calculating. Stacking is the hard part because each chip is ground thinner than a human hair and the finished cube has to stay within a height limit of less than a millimeter. One chip that fails after stacking can scrap the whole cube. Only SK hynix, Samsung and Micron make HBM in volume. One US export rule covers HBM from all three, including the two based in South Korea.

Each layer in the cube is a DRAM chip, the ordinary kind of computer memory. Each layer is ground thin and bonded to the one below through tiny metal bumps called microbumps. The whole stack sits on a base die, a chip that manages it. The copper-filled holes are called through-silicon vias, or TSVs. They let a signal reach any layer without a wire running around the outside.

An HBM3E cube has a 1,024-bit interface, meaning it exchanges data with the processor over 1,024 wires at once ([source](https://www.micron.com/products/memory/hbm)). That is sixteen times wider than a standard DDR5 memory module, the memory stick in a PC ([source](https://www.micron.com/products/memory/hbm)). HBM4 doubles that to 2,048 wires ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). Ordinary memory cannot be made that wide, because the pins would not fit on a circuit board. The stack can, since its wires run down through the TSVs and across a silicon interposer to the processor beside it, with no board in the way ([source](https://www.micron.com/products/memory/hbm)). The interposer is a slice of silicon carrying fine wiring, set under both the memory and the processor (see [Advanced packaging](#advanced-packaging)).

{{figure:hbm-inside}}

A chip needs the width most when it answers a prompt. Training reuses each stored number across a huge multiplication, so a chip can fetch little and compute a lot. But to generate one word of an answer, the chip reads the whole model from memory, plus the whole record of the conversation so far. Then it does a little arithmetic and waits for the next read. That record grows with the length of the conversation and the number of users served at once. So memory size and speed usually set how many people one chip can serve.

## Variants and trade-offs

| Generation | Interface | Bandwidth per stack | Capacity per stack |
|---|---|---|---|
| HBM3E | 1,024-bit, 16 channels (32 pseudo-channels) | over 1.2 TB/s | 24 GB (8 chips), 36 GB (12 chips) |
| HBM4 | 2,048-bit, 32 channels | over 2.0 TB/s, up to 3.3 TB/s | up to 64 GB (16 chips, 32 Gb dies) |

### HBM3E

Micron's HBM3E comes in two sizes, 24 GB with eight chips stacked and 36 GB with twelve ([source](https://www.micron.com/products/memory/hbm/hbm3e)).

### HBM4

All three HBM makers run their HBM4 faster than the 8 Gb/s per pin in the industry standard. The standards body JEDEC published JESD270-4 in April 2025, setting the 2,048-bit interface and 2 TB/s per stack at 8 Gb/s per pin ([source](https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing)). SK hynix says it was first to complete HBM4 development, in September 2025, at over 10 Gb/s per pin ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)). Samsung says it began mass production and shipped the first commercial HBM4 in February 2026, at 11.7 Gb/s per pin, with a 4 nm logic base die ([source](https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4)). It gives that HBM4 a maximum of 3.3 TB/s per stack ([source](https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4)). Micron's parts run above 11 Gb/s for more than 2.8 TB/s per stack ([source](https://www.micron.com/products/memory/hbm/hbm4)). Micron says it began volume production of its 36 GB twelve-high HBM4 in fiscal 2026 and expects to ramp volume of HBM4E, the next generation, in calendar 2027 ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000023/mu-20260903.htm)).

Through HBM3E, SK hynix made its own base dies, the chips at the bottom of each stack ([source](https://news.skhynix.com/sk-hynix-partners-with-tsmc-to-strengthen-hbm-technological-leadership/)). For HBM4 it chose TSMC's advanced logic process, so the base die can hold more functions ([source](https://news.skhynix.com/sk-hynix-partners-with-tsmc-to-strengthen-hbm-technological-leadership/)). As a result, TSMC, which does not make HBM, makes the base die for SK hynix's HBM4.

{{figure:hbm-bandwidth}}

## How a stack is built

- **Etch and thin.** Etch vertical holes, the through-silicon vias, into a memory wafer, fill them with copper, then grind the wafer from behind until the copper comes through.
- **Stack and join.** Makers join the chips through metal bumps by methods such as TC-NCF and MR-MUF ([source](https://news.skhynix.com/en/tech-note-series-ep2/)). In MR-MUF, short for mass reflow molded underfill, the chips are first connected through microbumps and stacked, and a liquid underfill is then injected to fill every gap at once and cured ([source](https://news.skhynix.com/en/tech-note-series-ep2/)). SK hynix uses its own version, Advanced MR-MUF, which stacks the chips, injects a liquid protective material between them and hardens it ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)). SK hynix says the process controls warping and dissipates heat well ([source](https://news.skhynix.com/en/sk-hynix-completes-worlds-first-hbm4-development-and-readies-mass-production/)). Samsung said in February 2024 that its twelve-high HBM3E uses TC-NCF, thermocompression with a thin non-conductive film between the chips ([source](https://news.samsung.com/global/samsung-develops-industry-first-36gb-hbm3e-12h-dram)). Samsung expected TC-NCF to help limit warping as chips get thinner ([source](https://news.samsung.com/global/samsung-develops-industry-first-36gb-hbm3e-12h-dram)).
- **Stay under the height limit.** The package specification for HBM4 raised the height allowed for a finished cube from 720 micrometers to 775, still under a millimeter ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

Hybrid bonding is the next step, but it is not ready. It would join the chips copper to copper and insulator to insulator, with no solder and no filler ([source](https://news.skhynix.com/en/tech-note-series-ep2/)). A tech note on SK hynix's newsroom gives about 20 micrometers as the typical spacing between microbumps, against less than 1 micrometer for hybrid bonds ([source](https://news.skhynix.com/en/tech-note-series-ep2/)). It says full-scale adoption in HBM is most likely at HBM4E or HBM5, where stacks are projected to pass twenty layers ([source](https://news.skhynix.com/en/tech-note-series-ep2/)). Taller stacks trap more heat, and removing it becomes a major challenge at 16 to 20 layers ([source](https://news.skhynix.com/en/tech-note-series-ep2/)). The same tech note says hybrid bonding manages that heat more efficiently ([source](https://news.skhynix.com/en/tech-note-series-ep2/)).

## Who makes it

Three firms took more than 90 percent of the revenue from ordinary computer memory, or DRAM, in the first quarter of 2026, according to IDC figures in SK hynix's US prospectus ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). HBM comes from the same three, SK hynix, Samsung and Micron ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). No other company has both leading-edge DRAM and a stacking line of its own. SK hynix says only a few firms have the expertise and resources to design, make and package memory chips ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). It says HBM also needs advanced production processes, such as TSV packaging, and must pass the rigorous testing and approval processes its customers set ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

SK hynix says it was the first company to mass-produce several generations of HBM, including HBM3 and HBM3E ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

SK hynix and Micron are both adding HBM capacity. SK hynix broke ground in August 2026 on an advanced packaging plant in West Lafayette, Indiana, an investment of over $4 billion ([source](https://www.purdue.edu/newsroom/2026/Q3/sk-hynix-breaks-ground-on-4-billion-advanced-packaging-production-facility-in-purdue-research-park/)). Micron is modernizing and expanding its DRAM and HBM production capacity in Taiwan ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000023/mu-20260903.htm)). It has also broken ground on an HBM advanced packaging plant in Singapore to expand its packaging capacity from early 2027 ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000023/mu-20260903.htm)).

SK hynix led HBM revenue in 2024, in 2025 and in the first quarter of 2026, and in that quarter Micron passed Samsung for second place. In 2024 SK hynix took 56.4 percent, Samsung 37.8 and Micron 5.8 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). In 2025 the three took 63.2, 19.3 and 17.4 percent ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). In the first quarter of 2026 they stood at 56.4, 20.5 and 23.1 percent, which put SK hynix back at its 2024 share ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The split is public because SK hynix registered shares in the United States, and its US prospectus credits the research firm IDC ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

{{figure:hbm-suppliers}}

{{figure:hbm-revenue}}

As HBM grows, memory makers have less factory capacity left for traditional DRAM. In December 2025 Micron put the HBM market at about $35 billion in 2025 and forecast that it would reach around $100 billion in 2028 ([source](https://s25.q4cdn.com/621799436/files/doc_financials/2026/q1/Micron_Q1-2026-Prepared-Remarks.pdf)). Micron says HBM needs more wafers than traditional DRAM, the kind used in PCs and phones, to make the same number of bits ([source](https://www.sec.gov/Archives/edgar/data/723125/000072312526000023/mu-20260903.htm)). SK hynix says the industry's shift of production capacity to HBM has left traditional DRAM undersupplied ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). The shortage, it says, helped drive a significant price recovery for that DRAM from the third quarter of 2025 ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

## The chokepoint

The leading accelerators made outside China use HBM from SK hynix, Samsung or Micron. Nvidia's GB300 NVL72 rack carries 20 TB of HBM3E at up to 576 TB/s ([source](https://www.nvidia.com/en-us/data-center/gb300-nvl72/)). Each Nvidia Rubin GPU carries up to 288 GB of HBM4 at up to 22 TB/s ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)). AMD's MI355X carries 288 GB of HBM3E at 8 TB/s ([source](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html)).

A US export rule of December 2024 covers every HBM stack that was in production when it was published. The Bureau of Industry and Security (BIS), the US export control office, published the rule on 5 December 2024 ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). It added an export classification, ECCN 3A090.c, for "High bandwidth memory (HBM) having a 'memory bandwidth density' greater than 2 gigabytes per second per square millimeter" ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). Its technical note defines that density as the memory bandwidth in gigabytes per second divided by the area of the package or stack in square millimeters ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). The rule also covers stacks made outside the United States, through a foreign direct product rule, which applies US controls to goods made abroad with American technology ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). BIS stated in the rule that all HBM stacks then in production exceeded that threshold ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)).

BIS reviews license applications to ship controlled HBM to Macau or a Country Group D:5 destination such as China according to where the buyer is headquartered ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6)). It presumes it will deny a license when the buyer or its ultimate parent is headquartered in one of those places, and presumes approval otherwise ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6)).

Two provisions narrow the control. License Exception HBM, at 15 CFR 740.25, applies to exporters headquartered in the United States or a Country Group A:5 ally ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25)). It lets them ship HBM below 3.3 GB per second per square millimeter without a license, including to Macau and Country Group D:5 destinations such as China ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25)). HBM sent to those destinations must be bought directly by the designer of the chip it will be packaged into ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25)). Every shipment under the exception must go straight to the packaging site ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.25)). The rule also excludes co-packaged chips that combine HBM and logic and whose main function is processing, which other chip controls may cover instead ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)).

The think tank CSIS said in December 2024 that the rules still allowed HBM2, a generation introduced in 2016, to go to China, with limits on who could buy it and what for ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). It also said Nvidia's H20, whose HBM3 is packaged with the processor, was then still exportable under the performance limits for AI chips ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)).

China's strongest DRAM maker, CXMT, was still struggling to make HBM in steady supply by June 2026. In December 2024 CSIS called CXMT one of only two Chinese firms with a credible path to producing advanced HBM, though it did not name the other ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). The Institute for Progress reported in October 2025 that CXMT was planning to produce HBM3 in 2026 ([source](https://ifp.org/the-b30a-decision/)). It also estimated that China would make virtually no HBM in 2025 ([source](https://ifp.org/the-b30a-decision/)). In June 2026 SemiAnalysis judged that CXMT was still struggling to stabilize supply of eight-high HBM3, with even greater challenges at twelve-high ([source](https://newsletter.semianalysis.com/p/chinas-cxmt-is-set-to-challenge-dram)).

Huawei plans to use HBM of its own design in its Ascend 950 AI chips, but when it announced the designs in September 2025 it did not say who would make the memory ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). The two designs are called HiBL 1.0 and HiZQ 2.0 ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)). Huawei said the 950DT, due in the fourth quarter of 2026, would carry 144 GB of HiZQ 2.0 at 4 TB/s ([source](https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech)).

## Takeaways

US-based Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent in the first quarter of 2026, according to IDC figures in SK hynix's US prospectus ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). Over the same period, Samsung's share fell from 37.8 percent to 20.5 percent ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

Since December 2024, a US license has been required, unless an exception applies, to export to China any HBM moving more than 2 GB per second per square millimeter of its area ([source](https://www.federalregister.gov/documents/2024/12/05/2024-28270/foreign-produced-direct-product-rule-additions-and-refinements-to-controls-for-advanced-computing)). The Institute for Progress reported in October 2025 that China's CXMT planned to produce HBM3 in 2026 ([source](https://ifp.org/the-b30a-decision/)). Even so, working from TrendForce's estimate of world HBM shipments, the institute projected that producers outside China would make 70 times as much HBM as China in 2026 ([source](https://ifp.org/the-b30a-decision/)). In June 2026 SemiAnalysis judged that CXMT was still struggling to stabilize supply of eight-high HBM3 ([source](https://newsletter.semianalysis.com/p/chinas-cxmt-is-set-to-challenge-dram)).
