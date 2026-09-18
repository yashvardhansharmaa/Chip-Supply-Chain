---json
{
  "id": "component-costs",
  "number": 16,
  "title": "The Economics of AI Chips",
  "oneLiner": "Inside an AI accelerator the silicon is the cheap part. Memory and packaging are the bill.",
  "plain": "A bill of materials is the list of parts inside a product and what each one costs to build. For an AI accelerator, the processor itself, the chip that does the calculating, is the cheap part, about a seventh of the total. The stacked memory beside it is nearly half, and the packaging that wires the two together costs more than the chip. Three firms in the world make that memory and one Taiwanese firm does that packaging, so the costliest parts are also the scarcest, and that is where a government's rules bite hardest.",
  "bridge": "The physical chain ends at a powered rack, and the next question is which part of it holds the money.",
  "specimen": "wafer-cost",
  "specimenCaption": "A chart, not an object: what it costs to build one B200, stacked as a column, each layer as tall as its share. From the foot: $2,900 of memory in garnet, $1,100 of packaging, $1,000 of yield loss drawn hollow, $900 of logic dies, $480 of board and test. About $6,400 in all, for a part that sells for $30,000 to $40,000.",
  "keyFacts": [
    {
      "fact": "A B200 costs about $6,400 to build, in a range of $5,700 to $7,300, and sells for $30,000 to $40,000",
      "source": "https://epoch.ai/data-insights/b200-cost-breakdown"
    },
    {
      "fact": "High-bandwidth memory (HBM3E) is $2,900 of that $6,400, at $14 to $17 per gigabyte; the logic dies are $900",
      "source": "https://epoch.ai/data-insights/b200-cost-breakdown"
    },
    {
      "fact": "Epoch AI's B200 model assumes a $17,000 4NP wafer, two roughly 800 mm2 compute chiplets and a die yield of 40 to 70 percent centered on 60",
      "source": "https://epoch.ai/data-insights/b200-cost-breakdown"
    },
    {
      "fact": "SemiAnalysis puts Vera Rubin NVL72 ownership at $3.57 per GPU-hour, against $1.84 for GB200 and $2.36 for GB300",
      "source": "https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference"
    },
    {
      "fact": "Micron's GAAP gross margin went from 39.8% for fiscal 2025 to 84.6% in the quarter to May 2026",
      "source": "https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Results-for-the-Third-Quarter-of-Fiscal-2026/default.aspx"
    },
    {
      "fact": "Nvidia earned a 71.1% GAAP gross margin on $193.7B of data center revenue in fiscal 2026, and 75.0% in the quarter to July 2026",
      "source": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026"
    },
    {
      "fact": "A 100,000 H100 cluster needs about 150 MW and burns 1.59 TWh per year",
      "source": "https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network"
    },
    {
      "fact": "The Semiconductor Industry Association counted $791.7B of global semiconductor sales in 2025; World Semiconductor Trade Statistics forecasts $975B for 2026, with memory and logic each growing more than 30%",
      "source": "https://www.wsts.org/76/103/Global-Semiconductor-Market-Approaches-1T-in-2026"
    }
  ],
  "figures": [
    {
      "id": "b200-bom",
      "type": "stack",
      "title": "Where the ~$6,400 of B200 manufacturing cost goes, 2026",
      "unit": "$",
      "data": [
        [
          "HBM3E, 192 GB",
          2900
        ],
        [
          "CoWoS-L packaging",
          1100
        ],
        [
          "Packaging yield loss",
          1000
        ],
        [
          "Logic die, two on 4NP",
          900
        ],
        [
          "Substrate, board, test",
          480
        ]
      ],
      "source": {
        "label": "Epoch AI B200 cost model, from a $17,000 4NP wafer, 40-70% die yield, $14-17 per GB of memory, and a packaging line derived from TSMC's advanced packaging revenue",
        "url": "https://epoch.ai/data-insights/b200-cost-breakdown"
      }
    },
    {
      "id": "gross-margins",
      "type": "bars",
      "title": "Gross margin, each firm's most recent reported quarter",
      "unit": "%",
      "data": [
        [
          "Micron",
          84.6
        ],
        [
          "Nvidia",
          75.0
        ],
        [
          "TSMC",
          67.7
        ],
        [
          "KLA",
          61.4
        ],
        [
          "ASML",
          54.0
        ],
        [
          "Lam Research",
          51.7
        ],
        [
          "Applied Materials",
          50.3
        ],
        [
          "Ibiden",
          36.4
        ],
        [
          "ASE Technology",
          21.0
        ],
        [
          "Amkor",
          16.8
        ]
      ],
      "source": {
        "label": "Each firm's own quarterly earnings release; quarters end between May and August 2026 (TSMC shown)",
        "url": "https://pr.tsmc.com/english/news/3326"
      }
    },
    {
      "id": "market-2025",
      "type": "bars",
      "title": "Size of each layer of the chain, 2025",
      "unit": "$B",
      "data": [
        [
          "Semiconductor sales",
          792
        ],
        [
          "Hyperscaler capex",
          448
        ],
        [
          "Nvidia data center revenue",
          194
        ],
        [
          "Semiconductor equipment",
          135
        ]
      ],
      "source": {
        "label": "Semiconductor Industry Association on chip sales; Epoch AI on capital spending at Alphabet, Amazon, Meta, Microsoft and Oracle; Nvidia FY2026 results; SEMI on equipment billings",
        "url": "https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/"
      }
    }
  ]
}
---
# Component Costs

Building a Blackwell B200 costs about $6,400. Nvidia sells it for $30,000 to $40,000 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). That $6,400 splits into stages that are expensive because of physics, because capacity is short, or because one firm can charge.

## How it works

A bill of materials is the list of parts inside a product and what each one costs to build. For an AI accelerator, the processor itself, the chip that does the calculating, is the cheap part, about a seventh of the total. The stacked memory beside it is nearly half, and the packaging that wires the two together costs more than the chip. Three firms in the world make that memory and one Taiwanese firm does that packaging, so the costliest parts are also the scarcest, and that is where a government's rules bite hardest.

Three numbers set the cost of a die, the finished rectangle of circuitry cut out of a wafer.

- **Wafer price.** TSMC does not publish it. Epoch AI's model of Blackwell's custom TSMC 4NP process ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)) assumes about $17,000 for a 300 mm wafer ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).
- **Dies per wafer.** A wafer is a circle and dies are rectangles, so the edge of the disc goes to waste: an 800 mm2 die, near the largest a scanner can print in one shot, fits 68 times.
- **Yield.** Defects land at random, so a bigger die is likelier to catch one. Epoch AI models the Blackwell die at 40 to 70 percent good, centered on 60 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Those three numbers put the two dies inside a B200 at about $900, 14 percent of the build ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Doubling the wafer price moves the whole bill by a few hundred dollars.

## Variants and trade-offs

### Memory is the bill

The 192 GB of high-bandwidth memory beside those dies, sold as HBM3E, is the single largest line: about $2,900, 45 percent of the build, at $14 to $17 per gigabyte ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Nvidia controls that line least of all: three firms make the memory, and they sell every stack they can build.

### Packaging, substrate and test

CoWoS-L, the TSMC process that mounts dies and memory on one carrier and wires them together, adds about $1,100, more than the logic dies it carries ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Packaging yield runs 65 to 95 percent, and a package that fails after the memory goes on throws away the dies and the memory with it, adding roughly $1,000 to every B200 that ships ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Substrate, board, test and assembly add $480 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). See [Advanced packaging](#advanced-packaging) for why that capacity binds first.

### The B200 bill of materials

| Line | Estimate | Range |
|---|---|---|
| HBM3E, 192 GB in eight stacks | $2,900 | $2,800-3,100 |
| CoWoS-L packaging | $1,100 | $1,000-1,200 |
| Packaging yield loss | $1,000 | $430-1,700 |
| Logic die, two on TSMC 4NP | $900 | $720-1,200 |
| Substrate, board, test, other | $480 | $370-600 |
| Manufacturing cost | ~$6,400 | $5,700-7,300 |
| Selling price | $30,000-40,000 | |

Epoch AI models each line as a range rather than a single figure, deriving the packaging line from TSMC's advanced packaging revenue and Nvidia's share of CoWoS capacity ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Nothing of that quality exists for the H100 or Rubin.

{{figure:b200-bom}}

### From package to rack to cluster

At rack scale the number that matters is the cost of a GPU-hour. For an operator that owns the machine, SemiAnalysis puts a Vera Rubin NVL72 at $3.57, against $1.84 for a GB200 and $2.36 for a GB300 ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)). Each generation costs its owner more per hour than the last, and buyers pay because throughput rises faster than the rate.

One level up, a 100,000 H100 cluster costs over $4 billion in servers, draws about 150 MW, burns 1.59 TWh a year, pays $123.9 million for power and needs 98,304 optical transceivers ([source](https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network)).

## Who captures the value

| Firm | Stage | Quarter ended | Gross margin |
|---|---|---|---|
| Micron | HBM and DRAM | May 2026 | 84.6% |
| Nvidia | Accelerator design | July 2026 | 75.0% |
| TSMC | Wafers and CoWoS | June 2026 | 67.7% |
| KLA | Inspection | June 2026 | 61.4% |
| ASML | Lithography | June 2026 | 54.0% |
| Lam Research | Etch | June 2026 | 51.7% |
| Applied Materials | Deposition | August 2026 | 50.3% |
| Ibiden | Substrates | June 2026 | 36.4% |
| ASE Technology | OSAT | June 2026 | 21.0% |
| Amkor | OSAT | June 2026 | 16.8% |

Every figure is the firm's own reported gross margin ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Results-for-the-Third-Quarter-of-Fiscal-2026/default.aspx)) ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)) ([source](https://pr.tsmc.com/english/news/3326)) ([source](https://ir.kla.com/news-events/press-releases/detail/518/kla-corporation-reports-fiscal-2026-fourth-quarter-and-full)) ([source](https://www.asml.com/en/news/press-releases/2026/q2-2026-financial-results)) ([source](https://newsroom.lamresearch.com/2026-07-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-June-28,-2026)) ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-third-quarter-2026-results)) ([source](https://www.ibiden.com/ir/items/tannshinn2026Q1.pdf)) ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-second-quarter-of-2026-302838714.html)) ([source](https://www.sec.gov/Archives/edgar/data/0001047127/000104712726000043/amkr6302026erex-991.htm)).

SK hynix publishes no gross margin. Its operating margin hit 76 percent in the June quarter, on revenue up 257 percent in a year ([source](https://news.skhynix.com/en/q2-2026-business-results/)).

{{figure:gross-margins}}

Design, inspection and leading-edge wafers earn gross margins of 50 to 75 percent, substrates 36, assembly and test 17 to 21. In 2026 memory passed all of them: Micron earned 39.8 percent for the year to August 2025 ([source](https://investors.micron.com/news/press-release/2025/Micron-Technology-Inc--Reports-Results-for-the-Fourth-Quarter-and-Full-Year-of-Fiscal-2025-09-23-2025/default.aspx)) and 84.6 percent in the quarter to May 2026 ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Results-for-the-Third-Quarter-of-Fiscal-2026/default.aspx)). The margin moved up the chain, to Nvidia's suppliers.

The two bodies that count this industry disagree. World Semiconductor Trade Statistics forecast $772 billion of global chip sales for 2025 ([source](https://www.wsts.org/76/103/Global-Semiconductor-Market-Approaches-1T-in-2026)); the Semiconductor Industry Association counted $791.7 billion ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)). The forecasters put 2026 at $975 billion, with memory and logic each growing more than 30 percent ([source](https://www.wsts.org/76/103/Global-Semiconductor-Market-Approaches-1T-in-2026)). Below those totals sit $135.1 billion of equipment billings ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)) and $448.3 billion of 2025 capital spending at Alphabet, Amazon, Meta, Microsoft and Oracle, on track for $770 billion in 2026 ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)).

{{figure:market-2025}}

## Where the money sits

Per unit of compute, logic keeps getting cheaper and everything wrapped around it gets dearer. Packaging and its scrap cost more than twice the logic dies ([source](https://epoch.ai/data-insights/b200-cost-breakdown)), and a GB300 NVL72 rack already draws 142 kW ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).

| Stage | Class | Why |
|---|---|---|
| EUV lithography | Structurally expensive | One supplier; price set by a twenty-year optics curve. |
| Masks and pellicles | Structurally expensive | Scales with layer count; every design pays again. |
| Metrology and inspection | Structurally expensive | Inspection time rises faster than throughput. |
| HBM | Structurally expensive | Stacking and through-silicon vias cut good die per wafer. |
| Advanced packaging, CoWoS-L | Structurally expensive | 65 to 95 percent packaging yield; scrap destroys dies and memory. |
| Power and cooling plant | Structurally expensive | Priced by grid queues and turbine lead times. |
| Leading-edge logic wafers | Compressible with scale | Defect density and utilization improve through a ramp. |
| Design and EDA | Compressible with scale | Engineering cost amortises across volume. |
| Deposition and etch tools | Compressible with scale | Credible second sources in most steps. |
| ABF substrates | Compressible with scale | A laminate line, not a physics frontier. |
| Optical transceivers | Compressible with scale | Copper and co-packaged optics cap the price. |
| Test and assembly (OSAT) | Already commoditized | 17 to 21 percent margins; clears on price. |
| Wafers and bulk gases | Already commoditized | Multi-supplier, long-qualified, thin spreads. |
| Rack integration (ODM) | Already commoditized | Low-teens margins on specified content. |

## Key evaluation criteria

- **Cost per good die.** A 30 percent wafer price rise at constant yield is survivable. A ten-point yield drop on an 800 mm2 die is not.
- **Memory dollars per gigabyte, and gigabytes per part.** The largest line on the bill, set by three firms.
- **Packaging yield.** Every point lost throws away finished dies and the memory attached to them ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).
- **Share of the bill the vendor does not control.** Nvidia sets its own margin but buys memory, packaging and substrates at another firm's price.
- **Rack watts.** Past about 140 kW a rack, power and cooling capex grows faster than accelerator capex ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Compressibility class.** Whether the line falls when volume doubles. If it does not, capacity is the constraint.

## Takeaways

On a B200 the logic dies are 14 percent of the build, memory 45, and packaging with its scrap another 33 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Nvidia's 75 percent gross margin is the most visible number in the chain ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)), and a custom chip can attack it by buying the same wafers and the same memory. The lines underneath are harder to attack: memory stacking yield, CoWoS interposer yield and the megawatts do not get cheaper as volume rises.
