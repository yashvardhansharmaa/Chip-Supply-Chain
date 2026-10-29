---json
{
  "id": "component-costs",
  "number": 15,
  "title": "The Economics of AI Chips",
  "oneLiner": "Epoch AI estimated in December 2025 that Nvidia's B200 AI chip cost about $6,400 to build, mostly for memory and packaging. Its processor silicon cost about $900.",
  "plain": "Most of what it costs to build Nvidia's B200, an AI chip from its Blackwell line, goes to memory and packaging that a few firms supply. A bill of materials is the list of parts inside a product and what each one costs. Epoch AI estimated in December 2025 that the B200 cost about $6,400 to build ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The two logic dies, the pieces of silicon that do the calculating, cost about $900 of that ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The stacked memory beside them accounted for about half, and the packaging that wires the dies and memory together cost more than the dies ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Three firms, SK hynix, Samsung and Micron, dominate the world market for that memory ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). One Taiwanese firm, TSMC, does that packaging ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).",
  "bridge": "The physical chain ends at a powered rack, and the next question is which part of it costs the most.",
  "specimen": "wafer-cost",
  "specimenCaption": "Epoch AI's December 2025 estimate of what it cost to build one B200, drawn as a column with each layer as tall as its share of the bill. From the bottom: $2,900 of memory in garnet, $1,100 of packaging, $1,000 of packaging yield loss drawn hollow, $900 of logic dies, $480 of power delivery, board and test. The total is about $6,400, against a selling price of $30,000 to $40,000 per chip reported in March 2024.",
  "keyFacts": [
    {
      "fact": "Epoch AI estimated in December 2025 that a B200 cost about $6,400 to build, within a range of $5,700 to $7,300. Reports in March 2024 put its selling price at $30,000 to $40,000 per chip",
      "source": "https://epoch.ai/data-insights/b200-cost-breakdown"
    },
    {
      "fact": "In that estimate memory was half the cost, $2,900 for 192 GB of HBM3E at $14 to $17 per gigabyte. The logic dies cost $900",
      "source": "https://epoch.ai/data-insights/b200-cost-breakdown"
    },
    {
      "fact": "Epoch AI's B200 model assumes a $17,000 wafer on TSMC's 4NP process, two logic dies of roughly 800 mm² each and a die yield of 40 to 70 percent, centered on 60",
      "source": "https://epoch.ai/data-insights/b200-cost-breakdown"
    },
    {
      "fact": "Epoch AI's chip sales model, with data through October 2025, puts Nvidia's compute revenue per GPU in its GB200 rack systems at $33,000 to $42,000. The figure leaves out the networking gear in those racks",
      "source": "https://epoch.ai/data/ai-chip-sales-documentation/methodology#nvidia"
    },
    {
      "fact": "In July 2026 SemiAnalysis put the cost of owning a Vera Rubin NVL72 at $3.57 per GPU-hour, against $1.84 for GB200 and $2.36 for GB300",
      "source": "https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference"
    },
    {
      "fact": "Micron's GAAP gross margin was 86.8 percent in the quarter to 3 September 2026, and 80.7 percent for fiscal 2026, up from 39.8 percent for fiscal 2025",
      "source": "https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx"
    },
    {
      "fact": "Nvidia's data center revenue was $193.7 billion in fiscal 2026, and its GAAP gross margin for the year was 71.1 percent",
      "source": "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026"
    },
    {
      "fact": "SemiAnalysis estimated in June 2024 that a cluster of 100,000 H100 GPUs needs more than 150 MW of data center capacity and uses 1.59 TWh per year",
      "source": "https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network"
    },
    {
      "fact": "In June 2026, World Semiconductor Trade Statistics put 2025 chip sales at $795.6 billion and forecast $1.51 trillion for 2026, with memory up about 250 percent and logic up 37 percent",
      "source": "https://www.wsts.org/esraCMS/extension/media/f/WST/7618/WSTS_FC-Release-2026-May.pdf"
    }
  ],
  "figures": [
    {
      "id": "b200-bom",
      "type": "stack",
      "title": "Where the ~$6,400 of B200 manufacturing cost goes, Epoch AI estimate, December 2025",
      "finding": "Memory, $2,900, is the largest line in Epoch AI's 2025 B200 estimate",
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
      "title": "Gross margin, quarters ended June to September 2026",
      "finding": "Micron's gross margin, 86.8 percent, was highest of nine firms in 2026",
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
          66.4
        ],
        [
          "KLA (non‑GAAP)",
          62.4
        ],
        [
          "ASML",
          57.5
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
          "ASE packaging and test",
          27.3
        ],
        [
          "Amkor",
          16.8
        ]
      ],
      "source": {
        "label": "Each firm's own quarterly earnings release, for quarters ending between June and September 2026 (TSMC's linked). ASE's bar is its packaging and test segment. KLA's bar is the non-GAAP figure from its shareholder letter",
        "url": "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm"
      }
    },
    {
      "id": "b200-price",
      "type": "within",
      "short": "One B200, its build cost inside its price",
      "title": "One B200, drawn to scale. Epoch AI's December 2025 estimate of what it cost to build, inside the selling price reported in March 2024",
      "finding": "Memory, $2,900, is the largest cost of building a B200, which sells for $30,000 to $40,000",
      "unit": "$",
      "mark": "Memory, HBM3E 192 GB",
      "parts": 5,
      "total": "Build cost",
      "whole": "Selling price per chip",
      "about": ["Build cost"],
      "data": [
        ["Memory, HBM3E 192 GB", 2900],
        ["CoWoS-L packaging", 1100],
        ["Packaging yield loss", 1000],
        ["Logic dies, two on 4NP", 900],
        ["Power delivery, board, test", 480],
        ["Build cost", 6400],
        ["Selling price per chip", 30000, 40000]
      ],
      "source": {
        "label": "Epoch AI B200 cost model, December 2025, and the March 2024 reports of its selling price that Epoch AI cites",
        "url": "https://epoch.ai/data-insights/b200-cost-breakdown"
      }
    }
  ]
}
---
# Component Costs

A B200, one of Nvidia's Blackwell AI chips, sells for far more than it costs to build. In December 2025 Epoch AI estimated that building one cost about $6,400 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI cites reports from March 2024 that put its selling price at $30,000 to $40,000 per chip ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Most B200s are sold inside Nvidia's GB200 rack systems ([source](https://epoch.ai/data/ai-chip-sales-documentation/methodology#nvidia)). Epoch AI's chip sales model, with data through October 2025, puts what Nvidia earns per GPU for the computing hardware in those racks at $33,000 to $42,000 ([source](https://epoch.ai/data/ai-chip-sales-documentation/methodology#nvidia)). That figure leaves out the networking gear in the racks ([source](https://epoch.ai/data/ai-chip-sales-documentation/methodology#nvidia)).

## How it works

Most of what it costs to build Nvidia's B200, an AI chip from its Blackwell line, goes to memory and packaging that a few firms supply. A bill of materials is the list of parts inside a product and what each one costs. Epoch AI estimated in December 2025 that the B200 cost about $6,400 to build ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The two logic dies, the pieces of silicon that do the calculating, cost about $900 of that ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The stacked memory beside them accounted for about half, and the packaging that wires the dies and memory together cost more than the dies ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Three firms, SK hynix, Samsung and Micron, dominate the world market for that memory ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). One Taiwanese firm, TSMC, does that packaging ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Three numbers set the cost of a die, the finished rectangle of circuitry cut out of a wafer.

- **Wafer price.** TSMC does not publish it. TSMC makes Nvidia's Blackwell chips on a custom-built process called 4NP ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Epoch AI estimates $17,000 for a 12-inch (300 mm) wafer on that process ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).
- **Dies per wafer.** A wafer is a circle and dies are rectangles, so the edge of the wafer goes to waste. The bigger the die, the fewer fit. Each of the two logic dies in a B200 is about 800 mm² ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Nvidia calls them reticle-limited, meaning they are near the largest size a scanner can print in one shot ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)).
- **Yield.** Yield is the share of dies that work. Defects land at random, so a bigger die is more likely to catch one. Epoch AI models Blackwell die yield at 40 to 70 percent, centered on 60 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Together, those three numbers put the two dies inside a B200 at about $900 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI's estimate for the whole B200 counts only variable costs, which rise with each chip made ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). It leaves out fixed costs such as research and development ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

## Variants and trade-offs

### Memory is the largest line

The largest line on the bill is the 192 GB of high-bandwidth memory beside those dies, a generation called HBM3E ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). At $14 to $17 per gigabyte it comes to about $2,900, which Epoch AI counts as half of the build cost ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI says HBM prices are negotiated deal by deal and can vary significantly with volume and contract length ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The $14 to $17 range dates from December 2025, before the 2026 rise in memory makers' sales and margins described below ([source](https://news.skhynix.com/en/q2-2026-business-results/)). SK hynix said DRAM and NAND flash prices rose significantly in the second quarter of 2026 from the quarter before, led by high-performance products for AI servers ([source](https://news.skhynix.com/en/q2-2026-business-results/)).

Few firms make this memory, and one of them says demand has outrun its supply. SK hynix, Samsung and Micron dominate the world market for it ([source](https://www.csis.org/analysis/understanding-biden-administrations-updated-export-controls)). SK hynix said in July 2026 that demand for its products had exceeded its available supply in recent quarters ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)).

### Packaging, substrate and test

CoWoS-L, the TSMC process that mounts dies and memory on one carrier and wires them together, adds about $1,100, more than the logic dies it carries ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI models packaging yield at 65 to 95 percent ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). A package that fails testing loses its logic dies and memory stacks ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Spreading that loss over the good units adds about $1,000 to each B200 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Power delivery hardware, the circuit board, and final assembly and testing add $480 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). See [Advanced packaging](#advanced-packaging) for how tight packaging capacity has been.

### The B200 bill of materials

| Line | Estimate | Range |
|---|---|---|
| HBM3E, 192 GB | $2,900 | $2,800-3,100 |
| CoWoS-L packaging | $1,100 | $1,000-1,200 |
| Packaging yield loss | $1,000 | $430-1,700 |
| Logic die, two on TSMC 4NP | $900 | $720-1,200 |
| Power delivery, board, assembly and test | $480 | $370-600 |
| Manufacturing cost | ~$6,400 | $5,700-7,300 |
| Reported selling price per chip, March 2024 | $30,000-40,000 | |
| Nvidia compute revenue per GPU in GB200 racks, data to October 2025 | $33,000-42,000 | |

Epoch AI models each line as a range, deriving the packaging line from TSMC's advanced packaging revenue and Nvidia's share of CoWoS capacity ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Epoch AI says Nvidia's actual margin on Blackwell may be lower than the gap between the B200's build cost and its reported chip price suggests ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). The estimate covers the accelerator module only and leaves out servers and rack-scale systems ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI notes that most Blackwell revenue comes from those systems, which may carry lower margins ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

Epoch AI's line-by-line estimate covers the B200, which is no longer Nvidia's newest chip. In its results for the quarter to July 2026, Nvidia said its Vera Rubin platform was ramping into full production ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)). Each Rubin GPU carries up to 288 GB of HBM4, a newer generation of the stacked memory ([source](https://developer.nvidia.com/blog/inside-nvidia-rubin-gpu-architecture-powering-the-era-of-agentic-ai/)).

{{figure:b200-bom}}

### From package to rack to cluster

Each new generation of Nvidia rack costs its owner more per hour than the last ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)). At rack scale, cost is measured per GPU-hour, one GPU running for one hour. For an operator that owns the machine, SemiAnalysis put a Vera Rubin NVL72 at $3.57 per GPU-hour in July 2026, against $1.84 for a GB200 and $2.36 for a GB300 ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)).

But SemiAnalysis found Rubin cheaper than GB200 and GB300 per token, a short chunk of text ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)). Rubin stayed cheaper at every level of interactivity SemiAnalysis compared, where interactivity is the number of tokens per second each user receives ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)). That finding rests on early results from the cloud provider CoreWeave running the DeepSeek R1 model, and SemiAnalysis said it had not verified them ([source](https://inferencex.semianalysis.com/blog/vera-rubin-nvl72-vs-gb200-nvl72-inference)).

One level up, a cluster needs power and a network as well as servers. SemiAnalysis estimated in June 2024 that a cluster of 100,000 of Nvidia's earlier H100 GPUs cost over $4 billion in servers ([source](https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network)). The cluster needs more than 150 MW of data center capacity and uses 1.59 TWh a year, which costs $123.9 million at $0.078 per kWh ([source](https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network)). In the network design Nvidia recommended, 98,304 optical transceivers link the cluster's GPUs to the first layer of switches, called leaf switches ([source](https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network)).

## Who captures the value

| Firm | Stage | Quarter ended | Gross margin |
|---|---|---|---|
| Micron | HBM and DRAM | September 2026 | 86.8% ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx)) |
| Nvidia | Accelerator design | July 2026 | 75.0% ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)) |
| TSMC | Wafers and CoWoS | September 2026 | 66.4% ([source](https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm)) |
| KLA (non‑GAAP) | Inspection | June 2026 | 62.4% ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf#page=3)) |
| ASML | Lithography | September 2026 | 57.5% ([source](https://www.sec.gov/Archives/edgar/data/937966/000162828026065813/pressreleasefinancialresul.htm)) |
| Lam Research | Etch | June 2026 | 51.7% ([source](https://newsroom.lamresearch.com/2026-07-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-June-28,-2026)) |
| Applied Materials | Deposition | July 2026 | 50.3% ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-third-quarter-2026-results)) |
| ASE Technology | Packaging and test segment | June 2026 | 27.3% ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-second-quarter-of-2026-302838714.html)) |
| Amkor | OSAT | June 2026 | 16.8% ([source](https://www.sec.gov/Archives/edgar/data/0001047127/000104712726000043/amkr6302026erex-991.htm)) |

Gross margin is highest at the memory maker Micron and lowest in assembly and test. The firms in design, equipment and leading-edge wafers earn gross margins of 50.3 to 75.0 percent, and those in assembly and test 16.8 to 27.3 percent. Micron's gross margin rose from 39.8 percent for the year to August 2025 to 80.7 percent for the year to September 2026 ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx)). It reached 86.8 percent in the last quarter of that year ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx)).

Each figure except KLA's comes from the firm's own earnings release. KLA's shareholder letter gives only a non-GAAP gross margin for the quarter, 62.4 percent ([source](https://d1io3yog0oux5.cloudfront.net/_b9ee755a5f60dd0fb3f9e27967aed6af/klatencor/db/1117/10668/letter_to_shareholders/KLA+Earnings+Shareholder+Letter+-+Q4+FY26.pdf#page=3)). KLA's non-GAAP figures adjust its results under US accounting rules, known as GAAP, to leave out items such as acquisition-related charges and restructuring, severance and other charges ([source](https://ir.kla.com/news-events/press-releases/detail/518/kla-corporation-reports-fiscal-2026-fourth-quarter-and-full)). For ASE the figure is its packaging and test segment ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-second-quarter-of-2026-302838714.html)). The company as a whole had a gross margin of 21.0 percent, because about a third of its revenue came from electronics manufacturing services, which earned 8.9 percent ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-second-quarter-of-2026-302838714.html)).

Two other firms' results give no gross margin. SK hynix's operating margin was 76 percent in the quarter to June 2026, and its revenue was up 257 percent from a year earlier ([source](https://news.skhynix.com/en/q2-2026-business-results/)). The substrate maker Ibiden's operating profit was 21.8 percent of net sales in the quarter to June 2026 ([source](https://www.ibiden.com/ir/items/outline2026Q1.pdf)).

{{figure:gross-margins}}

{{figure:b200-price}}

World chip sales are forecast to jump in 2026, with memory growing far faster than logic. The Semiconductor Industry Association, using monthly data compiled by World Semiconductor Trade Statistics, counted $791.7 billion of global chip sales in 2025 ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)). In its June 2026 forecast, World Semiconductor Trade Statistics put 2025 slightly higher, at $795.6 billion ([source](https://www.wsts.org/esraCMS/extension/media/f/WST/7618/WSTS_FC-Release-2026-May.pdf)). It forecast $1.51 trillion for 2026, with memory growing about 250 percent and logic 37 percent ([source](https://www.wsts.org/esraCMS/extension/media/f/WST/7618/WSTS_FC-Release-2026-May.pdf)).

In 2025 capital spending at five large tech firms far exceeded the world's sales of chipmaking equipment. The industry group SEMI counted $135.1 billion of semiconductor equipment billings in 2025 ([source](https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025)). Capital spending at Alphabet, Amazon, Meta, Microsoft and Oracle came to $448.2 billion in 2025, the sum of Epoch AI's quarterly figures ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). Epoch AI says that spending would reach $770 billion in 2026 if the trend continues ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). These totals overlap, so they cannot be added together.

## Where the money goes

Each stage falls into one of three classes, by whether its cost falls as volume grows. A structurally expensive stage stays costly because the work is hard, capacity is short or one firm sets the price. A stage compressible with scale gets cheaper as volume grows. An already commoditized stage has several competing suppliers. The classes are a judgment drawn from the sources in this chapter and the stage chapters.

| Stage | Class | Why |
|---|---|---|
| EUV lithography | Structurally expensive | One supplier, ASML. See [Lithography](#lithography). |
| Masks and pellicles | Structurally expensive | Every design needs its own mask set, and every EUV layer a flawless mask. See [Photomasks and pellicles](#photomasks-and-pellicles). |
| Metrology and inspection | Structurally expensive | KLA held 56.8 percent of the market for these tools in 2025, by CSET's analysis of TechInsights data ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60)). See [Metrology and inspection](#metrology-and-inspection). |
| HBM | Structurally expensive | SK hynix says HBM needs more wafer input than ordinary DRAM ([source](https://www.sec.gov/Archives/edgar/data/2120882/000119312526299963/d32785d424b4.htm)). See [Memory and HBM](#memory-and-hbm). |
| Advanced packaging, CoWoS-L | Structurally expensive | Modeled packaging yield is 65 to 95 percent, and a failed package loses its dies and memory. |
| ABF substrates | Structurally expensive | Investment can add substrate lines, but Ajinomoto said in June 2026 that the insulating film it makes for these substrates has held over 95 percent of its market since launch ([source](https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/011117/teaserItems1/01/linkList/03/link/20260630_presentation_E.pdf#page=3)). See [Substrates and PCBs](#substrates-and-pcbs). |
| Power and cooling plant | Structurally expensive | In the United States, grid connections face long queues, so at least three of OpenAI's seven Stargate sites will use on-site natural gas plants ([source](https://epoch.ai/publications/openai-stargate-where-the-us-sites-stand)). GE Vernova's backlog of gas power equipment, together with agreements reserving future production slots, grew from 100 GW to 116 GW in the second quarter of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1996810/000199681026000147/gevpressrelease2q26.htm)). See [Data centers and power](#data-centers-and-power). |
| Optical transceivers | Structurally expensive | In May 2026 Nikkei reported that building AI data centers had caused shortages and price rises for lasers, optical fibers and other optical parts ([source](https://asia.nikkei.com/business/technology/tech-asia/ai-demand-strains-supplies-of-lasers-fiber-and-other-optical-tech)). Nvidia agreed in March 2026 to invest $2 billion in the laser maker Lumentum, with rights to future capacity ([source](https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology)). It agreed a similar $2 billion deal with Coherent ([source](https://nvidianews.nvidia.com/news/nvidia-and-coherent-announce-strategic-partnership-to-develop-optics-technology-to-scale-next-generation-data-center-architecture)). See [Systems and networking](#systems-and-networking). |
| Leading-edge logic wafers | Compressible with scale | A very large die yields well only once a process matures. See [Foundries and fabs](#foundries-and-fabs). |
| Design and EDA | Compressible with scale | A design is paid for once, and its cost is spread across every chip sold. See [Chip design, EDA and IP](#design-and-eda). |
| Deposition and etch tools | Compressible with scale | Most deposition and etch steps have three or four established tool makers. See [Deposition and etch](#deposition-and-etch). |
| Test and assembly (OSAT) | Already commoditized | Gross margins of 16.8 to 27.3 percent at Amkor and ASE's packaging and test segment in the quarter to June 2026. |
| Wafers and bulk gases | Already commoditized | Several firms make approved 300 mm wafers. By Siltronic's estimate, the five largest wafer makers served around 75 percent of the market in the first three quarters of 2025 ([source](https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf#page=6)). See [Silicon and wafers](#silicon-and-wafers). |
| Rack integration (ODM) | Already commoditized | In October 2025 Nvidia said more than 50 makers of systems and components were gearing up for the Vera Rubin NVL72 ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). See [Systems and networking](#systems-and-networking). |

## Takeaways

Epoch AI says Nvidia's margin on Blackwell may be lower than the gap between the B200's build cost and its selling price suggests ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). It cites reports from March 2024 that put the B200's selling price at $30,000 to $40,000 per chip ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). Epoch AI notes that most Blackwell revenue comes from servers and rack-scale systems, which may carry lower margins ([source](https://epoch.ai/data-insights/b200-cost-breakdown)).

In 2026 Micron's gross margin, the share of sales left after production costs, passed Nvidia's. Micron's rose from 39.8 percent for the year to August 2025 to 80.7 percent for the year to September 2026 ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx)). It reached 86.8 percent in the last quarter of that year ([source](https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx)). Nvidia's was 75.0 percent in the quarter to July 2026 ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)). Epoch AI's estimate priced memory at $14 to $17 per gigabyte, before the 2026 rise in memory makers' sales and margins ([source](https://news.skhynix.com/en/q2-2026-business-results/)).
