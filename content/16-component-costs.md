---json
{
  "id": "component-costs",
  "number": 16,
  "title": "The Economics of AI Chips",
  "oneLiner": "In Epoch AI's December 2025 estimate for Nvidia's B200, the silicon is the cheap part. Memory and packaging are most of the cost.",
  "plain": "A bill of materials is the list of parts inside a product and what each one costs to build. Epoch AI estimated in December 2025 that Nvidia's B200, a Blackwell accelerator, cost about $6,400 to build. The processor itself, the chip that does the calculating, was the cheap part at about $900. The stacked memory beside it accounted for about half, and the packaging that wires the two together cost more than the chip. Three firms dominate the world market for that memory and one Taiwanese firm does that packaging, so a few firms supply the costliest parts.",
  "bridge": "The physical chain ends at a powered rack, and the next question is which part of it costs the most.",
  "specimen": "wafer-cost",
  "specimenCaption": "Epoch AI's December 2025 estimate of what it cost to build one B200, drawn as a column with each layer as tall as its share of the bill. From the foot: $2,900 of memory in garnet, $1,100 of packaging, $1,000 of yield loss drawn hollow, $900 of logic dies, $480 of power delivery, board and test. About $6,400 in all, against a reported selling price of $30,000 to $40,000 for the chip alone.",
  "keyFacts": [
    {
      "fact": "Epoch AI estimated in December 2025 that a B200 cost about $6,400 to build, in a range of $5,700 to $7,300, against a reported selling price of $30,000 to $40,000 for the chip alone",
      "source": "https://epoch.ai/data-insights/b200-cost-breakdown"
    },
    {
      "fact": "In that estimate memory was half the cost, with 192 GB of HBM3E at $2,900, priced at $14 to $17 per gigabyte; the logic dies were $900",
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
      "fact": "Micron's GAAP gross margin was 86.8% in the quarter to September 3, 2026, and 80.7% for fiscal 2026, up from 39.8% for fiscal 2025",
      "source": "https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx"
    },
    {
      "fact": "Nvidia's data center revenue was $193.7B in fiscal 2026, and its GAAP gross margin for the year was 71.1%",
      "source": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026"
    },
    {
      "fact": "A 100,000 H100 cluster needs more than 150 MW of data center capacity and uses 1.59 TWh per year",
      "source": "https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network"
    },
    {
      "fact": "World Semiconductor Trade Statistics put 2025 chip sales at $795.6B and, in June 2026, forecast $1.51 trillion for 2026, with memory up about 250% and logic up 37%",
      "source": "https://www.wsts.org/esraCMS/extension/media/f/WST/7618/WSTS_FC-Release-2026-May.pdf"
    }
  ],
  "figures": [
    {
      "id": "b200-bom",
      "type": "stack",
      "title": "Where the ~$6,400 of B200 manufacturing cost goes, Epoch AI estimate, December 2025",
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
          "Power delivery, board, test",
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
          86.8
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
          "ASE packaging and test",
          27.3
        ],
        [
          "Amkor",
          16.8
        ]
      ],
      "source": {
        "label": "Each firm's own quarterly earnings release; quarters end between June and September 2026; ASE's bar is its packaging and test segment (TSMC shown)",
        "url": "https://pr.tsmc.com/english/news/3326"
      }
    },
    {
      "id": "market-2025",
      "type": "bars",
      "title": "Selected market totals, 2025",
      "unit": "$B",
      "data": [
        [
          "Semiconductor sales",
          791.7
        ],
        [
          "Hyperscaler capex",
          448.2
        ],
        [
          "Nvidia data center revenue",
          193.7
        ],
        [
          "Semiconductor equipment",
          135.1
        ]
      ],
      "source": {
        "label": "Semiconductor Industry Association on chip sales; Epoch AI quarterly capital spending at Alphabet, Amazon, Meta, Microsoft and Oracle, summed for 2025; Nvidia data center revenue for its fiscal year to January 2026; SEMI on equipment billings",
        "url": "https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/"
      }
    }
  ]
}
---
# Component Costs

In December 2025 Epoch AI estimated that building a Blackwell B200 cost about $6,400, and reports put its selling price at $30,000 to $40,000 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). That $6,400 splits into stages that are expensive because of physics, because capacity is short, or because one firm sets the price.

## How it works

A bill of materials is the list of parts inside a product and what each one costs to build. In Epoch AI's estimate for the B200, the processor itself, the chip that does the calculating, is the cheap part, about $900 of the roughly $6,400 build ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The stacked memory beside it accounts for about half, and the packaging that wires the two together costs more than the chip ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Three firms dominate the world market for that memory ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). One Taiwanese firm, TSMC, does that packaging, so a few firms supply the costliest parts ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Three numbers set the cost of a die, the finished rectangle of circuitry cut out of a wafer.

- **Wafer price.** TSMC does not publish it. Nvidia makes Blackwell chips on a custom-built TSMC 4NP process ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Epoch AI estimates $17,000 for a 12-inch (300 mm) wafer on that process ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).
- **Dies per wafer.** A wafer is a circle and dies are rectangles, so the edge of the disc goes to waste, and the bigger the die, the fewer fit. Each of the two compute dies in a B200 is about 800 mm2 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Nvidia calls them reticle-limited, meaning near the largest a scanner can print in one shot ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)).
- **Yield.** Defects land at random, so a bigger die is likelier to catch one. Epoch AI models the Blackwell die at 40 to 70 percent good, centered on 60 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Those three numbers put the two dies inside a B200 at about $900 of the roughly $6,400 build ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The estimate counts only variable costs and leaves out fixed costs such as research and development ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

## Variants and trade-offs

### Memory is the largest line

The 192 GB of high-bandwidth memory beside those dies, sold as HBM3E, is the single largest line, about $2,900 at $14 to $17 per gigabyte ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI notes that HBM pricing is negotiated individually and can vary significantly by volume and contract length ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The $14 to $17 range dates from December 2025, before the 2026 rise in memory makers' sales and margins described below ([source](https://news.skhynix.com/en/q2-2026-business-results/)). Epoch AI says memory accounts for half of the roughly $6,400 build ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Three firms, SK hynix, Samsung and Micron, dominate the world market for that memory ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). SK hynix says demand for its products has exceeded its available supply in recent quarters ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

### Packaging, substrate and test

CoWoS-L, the TSMC process that mounts dies and memory on one carrier and wires them together, adds about $1,100, more than the logic dies it carries ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI models packaging yield at 65 to 95 percent ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). A package that fails testing loses its logic dies and memory stacks, and spreading that loss over the good units adds about $1,000 to each B200 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Power delivery hardware, the circuit board, and final assembly and testing add $480 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). See [Advanced packaging](#advanced-packaging) for why packaging capacity runs out first.

### The B200 bill of materials

| Line | Estimate | Range |
|---|---|---|
| HBM3E, 192 GB | $2,900 | $2,800-3,100 |
| CoWoS-L packaging | $1,100 | $1,000-1,200 |
| Packaging yield loss | $1,000 | $430-1,700 |
| Logic die, two on TSMC 4NP | $900 | $720-1,200 |
| Power delivery, board, assembly and test | $480 | $370-600 |
| Manufacturing cost | ~$6,400 | $5,700-7,300 |
| Reported selling price | $30,000-40,000 | |

Epoch AI models each line as a range, deriving the packaging line from TSMC's advanced packaging revenue and Nvidia's share of CoWoS capacity ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The estimate covers the accelerator module only and leaves out servers and rack-scale systems ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI notes that most Blackwell revenue comes from those systems, which may carry lower margins, so Nvidia's realized margin on Blackwell may be lower than the gap between this cost and the reported chip price suggests ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

The B200 is used here because Epoch AI's line-by-line estimate covers it. In its results for the quarter to July 2026, Nvidia said its Vera Rubin platform was ramping into full production ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)). Each Rubin GPU carries up to 288 GB of HBM4, a newer generation of the stacked memory ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)).

{{figure:b200-bom}}

### From package to rack to cluster

At rack scale the number that matters is the cost of a GPU-hour. For an operator that owns the machine, SemiAnalysis puts a Vera Rubin NVL72 at $3.57, against $1.84 for a GB200 and $2.36 for a GB300 ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)). Each generation costs its owner more per hour than the last, yet SemiAnalysis, working from early CoreWeave results on DeepSeek R1 that it has not verified, finds Rubin cheaper per token than GB200 and GB300 at every interactivity level it compared ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)).

One level up, a 100,000 H100 cluster costs over $4 billion in servers, needs more than 150 MW of data center capacity, uses 1.59 TWh a year, costs $123.9 million a year in power at $0.078 per kWh, and in a rail-optimized design links its GPUs to leaf switches with 98,304 optical transceivers ([source](https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network)).

## Who captures the value

| Firm | Stage | Quarter ended | Gross margin |
|---|---|---|---|
| Micron | HBM and DRAM | September 2026 | 86.8% |
| Nvidia | Accelerator design | July 2026 | 75.0% |
| TSMC | Wafers and CoWoS | June 2026 | 67.7% |
| KLA | Inspection | June 2026 | 61.4% |
| ASML | Lithography | June 2026 | 54.0% |
| Lam Research | Etch | June 2026 | 51.7% |
| Applied Materials | Deposition | July 2026 | 50.3% |
| Ibiden | Substrates | June 2026 | 36.4% |
| ASE Technology | Packaging and test segment | June 2026 | 27.3% |
| Amkor | OSAT | June 2026 | 16.8% |

Each figure comes from the firm's own earnings release; for KLA and Ibiden it is gross profit divided by revenue, since those releases give no percentage ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx)) ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)) ([source](https://pr.tsmc.com/english/news/3326)) ([source](https://ir.kla.com/news-events/press-releases/detail/518/kla-corporation-reports-fiscal-2026-fourth-quarter-and-full)) ([source](https://www.asml.com/en/news/press-releases/2026/q2-2026-financial-results)) ([source](https://newsroom.lamresearch.com/2026-07-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-June-28,-2026)) ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-third-quarter-2026-results)) ([source](https://www.ibiden.com/ir/items/tannshinn2026Q1.pdf)) ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-second-quarter-of-2026-302838714.html)) ([source](https://www.sec.gov/Archives/edgar/data/0001047127/000104712726000043/amkr6302026erex-991.htm)). For ASE the table shows its packaging and test segment; the company as a whole earned 21.0 percent, because about a third of its revenue came from electronics manufacturing services, which earned 8.9 percent ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-second-quarter-of-2026-302838714.html)).

SK hynix's earnings release gives no gross margin. Its operating margin was 76 percent in the June quarter, on revenue up 257 percent in a year ([source](https://news.skhynix.com/en/q2-2026-business-results/)).

{{figure:gross-margins}}

In the table, design, equipment and leading-edge wafers earn gross margins of 50.3 to 75.0 percent, substrates 36.4 percent, and assembly and test 16.8 to 27.3 percent. In 2026 Micron passed all of them. Its gross margin rose from 39.8 percent for the year to August 2025 to 86.8 percent in the quarter to September 2026 ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx)). Nvidia's was 75.0 percent in the quarter to July 2026 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)).

The Semiconductor Industry Association, using monthly data compiled by World Semiconductor Trade Statistics, counted $791.7 billion of global chip sales in 2025 ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)). In its June 2026 forecast, World Semiconductor Trade Statistics put 2025 at $795.6 billion and 2026 at $1.51 trillion, with memory growing about 250 percent and logic 37 percent ([source](https://www.wsts.org/esraCMS/extension/media/f/WST/7618/WSTS_FC-Release-2026-May.pdf)). Other totals include $135.1 billion of 2025 equipment billings ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)) and $448.2 billion of 2025 capital spending at Alphabet, Amazon, Meta, Microsoft and Oracle, the sum of Epoch AI's quarterly figures, which Epoch says would reach $770 billion in 2026 if the trend continues ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). These totals overlap, so they cannot be added together.

{{figure:market-2025}}

## Where the money goes

In the B200, packaging and its scrap, $1,100 and $1,000 in Epoch AI's estimate, cost more than twice the $900 of logic dies ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). A GB300 NVL72 rack can draw up to 142 kW ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).

The classes below are a judgment of whether each stage's cost falls as volume grows, drawn from the sources in this chapter and the stage chapters.

| Stage | Class | Why |
|---|---|---|
| EUV lithography | Structurally expensive | One supplier, ASML. See [Lithography](#lithography). |
| Masks and pellicles | Structurally expensive | Every design needs its own mask set, and every EUV layer a flawless mask. See [Photomasks and pellicles](#photomasks-and-pellicles). |
| Metrology and inspection | Structurally expensive | KLA held about five times its nearest rival's share of these tools in 2025, by CSET's count. See [Metrology and inspection](#metrology-and-inspection). |
| HBM | Structurally expensive | SK hynix says HBM needs more wafer input than ordinary DRAM. See [Memory and HBM](#memory-and-hbm). |
| Advanced packaging, CoWoS-L | Structurally expensive | Modeled packaging yield of 65 to 95 percent; a failed package loses its dies and memory. |
| ABF substrates | Structurally expensive | Money can add substrate lines, but Ajinomoto said in June 2026 that the insulating film it makes for these substrates has held over 95 percent of its market since launch ([source](https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/011117/teaserItems1/01/linkList/03/link/20260630_presentation_E.pdf)). See [Substrates and PCBs](#substrates-and-pcbs). |
| Power and cooling plant | Structurally expensive | Grid connections face lengthy queues, and GE Vernova's gas equipment backlog and slot reservations reached 116 GW in mid-2026. See [Data centers and power](#data-centers-and-power). |
| Leading-edge logic wafers | Compressible with scale | A very large die yields well only once a process matures. See [Transistors and the front end](#transistors-and-front-end). |
| Design and EDA | Compressible with scale | A design is paid for once, and its cost is spread across every chip sold. See [Chip design, EDA and IP](#design-and-eda). |
| Deposition and etch tools | Compressible with scale | Most deposition and etch steps have three or four established tool makers. See [Deposition and etch](#deposition-and-etch). |
| Optical transceivers | Compressible with scale | Nvidia agreed in March 2026 to invest $2 billion each in laser makers Coherent and Lumentum, with rights to future capacity. See [Systems and networking](#systems-and-networking). |
| Test and assembly (OSAT) | Already commoditized | Gross margins of 16.8 to 27.3 percent at Amkor and ASE's packaging and test segment, in the table above. |
| Wafers and bulk gases | Already commoditized | Several firms make approved 300 mm wafers, and the top five served about 75 percent of the market in 2025. See [Silicon and wafers](#silicon-and-wafers). |
| Rack integration (ODM) | Already commoditized | Several contract manufacturers on three continents assemble racks. See [Systems and networking](#systems-and-networking). |

## Key evaluation criteria

- **Cost per good die.** The wafer price divided by the dies on that wafer that work. A larger die or a lower yield raises it.
- **Memory dollars per gigabyte, and gigabytes per part.** The largest line on the bill, set by three firms.
- **Packaging yield.** Every point lost throws away finished dies and the memory attached to them ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).
- **Share of the bill the vendor does not control.** Nvidia sets its own margin but buys memory, packaging and substrates at another firm's price.
- **Rack watts.** A GB300 NVL72 rack can draw up to 142 kW, and the data center has to supply and cool all of it ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).
- **Compressibility class.** Whether the line falls when volume doubles. If it does not, capacity is the constraint.

## Takeaways

Epoch AI estimated in December 2025 that an Nvidia B200 cost around $6,400 to build, against a reported selling price of $30,000 to $40,000 for the chip alone ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Memory and advanced packaging make up most of that cost, and the two processor dies cost less than the packaging that joins them to the memory ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Three companies, SK hynix, Samsung and Micron, dominate the world market for that kind of memory ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)).
