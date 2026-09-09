---json
{
  "id": "component-costs",
  "number": 17,
  "title": "Component Costs",
  "oneLiner": "Follow the money through an AI accelerator and the silicon turns out to be the cheap part. Memory and packaging are the bill.",
  "plain": "Think of the receipt for a new car. The engine is the famous part, but the battery, the gearbox and the assembly line are what the bill is made of. An accelerator is the same. The logic chip everyone names is about an eighth of the cost of building one, the stacked memory beside it is nearly half, and the packaging that binds them costs more than the chip. Those parts come from very few firms, which is where a regulator finds leverage.",
  "specimen": "wafer-cost",
  "specimenCaption": "Right: a 300 mm wafer stepped with an 800 mm2 die. Sixty-eight dies fit inside the usable circle; at a defect density of 0.07 per cm2 roughly forty survive. Everything about die cost falls out of that picture.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Nvidia", "country": "US", "share": "71.1% GAAP gross margin in FY2026; $193.7B data centre revenue"},
      {"name": "TSMC", "country": "TW", "share": "59.9% gross margin in 2025, 64.2% in the year to June 2026"},
      {"name": "SK hynix", "country": "KR", "share": "60.4% gross margin in 2025, 76.3% in the year to June 2026"},
      {"name": "ASE Technology", "country": "TW", "share": "17.7% gross margin in 2025, the thin end of the chain"}
    ],
    "countries": [
      {"code": "US", "note": "Accelerator design and the largest single margin pool"},
      {"code": "TW", "note": "Wafers, CoWoS packaging, OSAT and server assembly"},
      {"code": "KR", "note": "HBM, now the single largest line on the bill of materials"},
      {"code": "JP", "note": "ABF substrate film and build-up substrates"},
      {"code": "NL", "note": "Lithography, the largest single line in fab capital cost"}
    ],
    "chinaStatus": "Domestic accelerators avoid the Nvidia margin but pay a worse cost structure: no CoWoS-class capacity at volume, HBM sourced from stockpiles or CXMT's early product, and yields on SMIC N+2 that make the die the expensive part rather than the cheap one.",
    "usStatus": "Captures the design margin and the equipment margin. Owns almost none of the wafer, HBM, substrate or assembly cost lines, which is why export controls target access rather than production.",
    "costSignal": "~$6,750 of manufacturing cost inside a B200 that sells for ~$40,000; ~$7.8M for a Vera Rubin NVL72 rack",
    "substitution": {"years": "3-5", "why": "Nvidia's margin is contestable by custom ASICs on the same TSMC and HBM inputs, but the HBM and CoWoS lines underneath it are not, because they are set by physically scarce capacity."}
  },
  "keyFacts": [
    {"fact": "TSMC N2 wafers priced at about $30,000 and N3 at $25,000 to $27,000 as of October 2025", "source": "https://technode.com/2025/10/09/tsmc-sets-2nm-wafer-price-at-30000-far-below-earlier-50-increase-speculation/"},
    {"fact": "TSMC N5 defect density was 0.10 to 0.11 defects per cm2 in 2020", "source": "https://ljdevice.com.tw/en/better-yield-5nm-7nm-tsmc-update-defect-rates-n5/"},
    {"fact": "HBM is about 48% of B200 manufacturing cost, versus 41% on H100", "source": "https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown"},
    {"fact": "CoWoS-L runs $1,000 to $1,500 per package versus about $750 for CoWoS-S", "source": "https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate"},
    {"fact": "A Vera Rubin NVL72 rack is estimated at $7.80M, of which $2.00M is memory", "source": "https://www.shanethegamer.com/pc-mac/nvidia-vera-rubins-memory-bill-hits-2m-more-than-doubling-grace-blackwells-cost/"},
    {"fact": "A 100,000 H100 cluster needs about 150 MW and burns 1.59 TWh per year", "source": "https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network"},
    {"fact": "UBS projects total hyperscaler capex, a definition that includes neocloud providers, at $492B in 2025 and $1.009T in 2026", "source": "https://247wallst.com/investing/2026/08/22/ais-absurd-spending-boom-hyperscalers-are-spending-102-of-cloud-revenue-on-capex/"},
    {"fact": "Gartner puts 2025 semiconductor revenue at $809B and forecasts $1.6T for 2026", "source": "https://www.intelligentcio.com/north-america/2026/09/01/gartner-forecasts-semiconductor-revenue-to-hit-us1-6-trillion-in-2026/"}
  ],
  "figures": [
    {
      "id": "b200-bom",
      "type": "stack",
      "title": "Where the ~$6,750 of B200 manufacturing cost goes, 2026",
      "unit": "%",
      "data": [["HBM3E (8 stacks)", 48], ["Test, assembly, other", 23], ["Logic die (2x ~800 mm2)", 13], ["CoWoS-L packaging", 10], ["ABF substrate", 6]],
      "source": {"label": "B200 cost model (die, HBM, packaging, test lines); substrate split at ~40% of packaging cost per CoWoS cost analysis", "url": "https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown"}
    },
    {
      "id": "gross-margins",
      "type": "bars",
      "title": "Reported gross margin, last completed fiscal year (FY2025, or FY ending March 2026 for Ibiden)",
      "unit": "%",
      "data": [["Nvidia", 71.1], ["KLA", 60.9], ["SK hynix", 60.4], ["TSMC", 59.9], ["ASML", 52.8], ["Lam Research", 48.7], ["Applied Materials", 48.7], ["Micron", 39.8], ["Ibiden", 31.6], ["ASE Technology", 17.7], ["Amkor", 14.0]],
      "source": {"label": "Company annual filings, compiled", "url": "https://stockanalysis.com/stocks/tsm/financials/"}
    },
    {
      "id": "market-2025",
      "type": "bars",
      "title": "Size of each layer of the chain, 2025",
      "unit": "$B",
      "data": [["Total semiconductor revenue", 809], ["Hyperscaler capex (UBS)", 492], ["Nvidia data centre revenue (FY2026)", 194], ["Wafer fab equipment", 117], ["Advanced packaging", 45], ["Optical transceivers", 15]],
      "source": {"label": "Gartner, UBS via 24/7 Wall St on hyperscaler capex (its definition includes neoclouds), Nvidia filings, SEMI, advanced packaging estimate", "url": "https://www.intelligentcio.com/north-america/2026/09/01/gartner-forecasts-semiconductor-revenue-to-hit-us1-6-trillion-in-2026/"}
    }
  ]
}
---
# Component Costs

An accelerator is an assembly of purchased things. Follow the money and you learn which stages are expensive because of physics, which because capacity is short, and which because a firm can charge.

## How it works (the cost model)

Think of the receipt for a new car. The engine is the famous part, but the battery, the gearbox and the assembly line are what the bill is made of. An accelerator is the same. The logic chip everyone names is about an eighth of the cost of building one, the stacked memory beside it is nearly half, and the packaging that binds them costs more than the chip. Those parts come from very few firms, which is where a regulator finds leverage.

Die cost has three inputs.

- **Wafer price.** TSMC does not publish it. Reporting in October 2025 put N3 at $25,000 to $27,000 per 300 mm wafer and N2 at roughly $30,000, a 10 to 20 percent step ([source](https://technode.com/2025/10/09/tsmc-sets-2nm-wafer-price-at-30000-far-below-earlier-50-increase-speculation/)) ([source](https://www.trendforce.com/news/2025/10/08/news-tsmc-2nm-reportedly-up-10-20-far-below-rumored-50-3-7nm-to-rise-single-digit-in-2026/)). N5 and N4 sit near $18,500 and A16 at up to $45,000 ([source](https://siliconanalysts.com/guide/semiconductor-costs)) ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-could-charge-up-to-usd45-000-for-1-6nm-wafers-rumors-allege-a-50-percent-increase-in-pricing-over-prior-gen-wafers)).
- **Dies per wafer.** A wafer is a circle and dies are rectangles, so an 800 mm2 die steps out to 68 whole dies.
- **Yield.** Defects land at random, so a bigger die is likelier to catch one. Murphy's model, the industry default, puts an 800 mm2 die at 47 percent at a defect density of 0.10 per cm2 ([source](https://fog.misty.com/perry/cod/references/yield_models.pdf)). TSMC's N5 ran 0.10 to 0.11 in 2020 and N3 is estimated at 0.09 to 0.14 ([source](https://ljdevice.com.tw/en/better-yield-5nm-7nm-tsmc-update-defect-rates-n5/)) ([source](https://siliconanalysts.com/guide/semiconductor-costs)); TSMC says N2 is lower still ([source](https://semiwiki.com/forum/threads/tsmc-discloses-n2-defect-density-lower-than-n3-at-the-same-stage-of-development.22699/)).

Run that on a B200, two reticle-limited dies on custom TSMC 4NP ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)): at 68 gross dies, a defect density of 0.07 and an $18,000 wafer, 40 survive at $450 each, $900 the pair, and a published model gives $350 to $425 ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)). Doubling the wafer price moves that line by a few hundred dollars. Nothing else on the bill is that forgiving.

## Variants and trade-offs (the BOMs)

### Memory is the bill

A 12-high 36 GB HBM3E stack is modelled at about $300 and HBM4 at $550, with contract prices near double: $12.20 per GB for HBM3E in July 2026 and $16.67 for HBM4 in January 2026 ([source](https://siliconanalysts.com/data/hbm-pricing)). At $17 per GB the eight HBM3E stacks on a B200 come to $3,250, about 48 percent of manufacturing cost ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)), and TrendForce expects HBM4 to lift prices by multiples again in 2027 ([source](https://www.trendforce.com/presscenter/news/20260602-13074.html)).

### Packaging, substrate and test

CoWoS-S runs about $750 per package on H100-class designs and CoWoS-L $1,000 to $1,500 on a B200, a premium of at least 47 percent for the multi-die build, with the ABF substrate about 40 percent of packaging cost ([source](https://siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026)) ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)).

Interposer yields are 60 to 70 percent, and scrapping a package after memory attach throws away the dies and the HBM together, adding roughly $1,000 to each shipped B200 ([source](https://siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026)). See Advanced packaging on why capacity binds first.

### Three generations of bill of materials

| Line | H100 (2023) | B200 (2025-26) | Rubin VR200 (2026) |
|---|---|---|---|
| Logic die | ~$300 | ~$850 | ~$1,250-1,590, two N3P dies, modelled |
| HBM | ~$1,350 | ~$3,250 | ~$4,800, derived at $16.67/GB |
| Packaging | ~$750 CoWoS-S | ~$1,100 CoWoS-L | $1,500+, 4x reticle CoWoS-L |
| Test, assembly, other | ~$920 | ~$1,550 | not published |
| Total manufacturing cost | ~$3,320 | ~$6,750 | not published |
| Selling price | ~$27,000 | ~$40,000 | ~$50,000-55,000 |

H100 and B200 lines come from a cost model on Raymond James and TrendForce inputs ([source](https://siliconanalysts.com/data/ai-chip-costs)) ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)); an independent estimate puts the B200 module at $5,700 to $7,300 ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)). Rubin's are derived from those prices and its configuration, two compute and two I/O dies on a four-reticle CoWoS-L interposer with 288 GB of HBM4 ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)), and its price is the reported volume figure ([source](https://www.shanethegamer.com/pc-mac/nvidia-vera-rubins-memory-bill-hits-2m-more-than-doubling-grace-blackwells-cost/)).

{{figure:b200-bom}}

### From package to rack to cluster

A GB300 NVL72 rack is priced near $5.0M ([source](https://www.datagravity.dev/p/how-much-does-an-nvidia-nvl72-cost)). A Vera Rubin NVL72 is estimated at $7.80M, of which $2.00M is memory against $373,939 on Grace Blackwell, lifting memory from about 9 percent of the rack to 26 ([source](https://www.shanethegamer.com/pc-mac/nvidia-vera-rubins-memory-bill-hits-2m-more-than-doubling-grace-blackwells-cost/)).

A 100,000 H100 build carries over $4B of server capex, needs about 150 MW, burns 1.59 TWh a year and pays $123.9M for power, and needs 98,304 optical transceivers for its rail-optimised network ([source](https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network)).

## Who captures the value

| Firm | Stage | Last full year | Latest 12 months |
|---|---|---|---|
| Nvidia | Design | 71.1% (FY2026) | 75.0% (Q2 FY2027) |
| KLA | Inspection | 60.9% (FY2025) | 61.3% |
| SK hynix | HBM | 60.4% (2025) | 76.3% |
| TSMC | Wafers, CoWoS | 59.9% (2025) | 64.2% |
| ASML | Lithography | 52.8% (2025) | 52.7% |
| Lam Research | Etch | 48.7% (FY2025) | 50.5% |
| Applied Materials | Deposition | 48.7% (FY2025) | 49.4% |
| Micron | HBM | 39.8% (FY2025) | 72.6% |
| Ibiden | Substrates | 31.6% (FY Mar 2026) | 32.0% |
| ASE Technology | OSAT | 17.7% (2025) | 19.5% |
| Amkor | OSAT | 14.0% (2025) | 15.5% |

Gross margin, from company releases ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026)) ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)) ([source](https://news.skhynix.com/en/sk-hynix-announces-fy25-financial-results/)) ([source](https://news.skhynix.com/en/q2-2026-business-results/)) and filings ([source](https://stockanalysis.com/stocks/tsm/financials/)) ([source](https://stockanalysis.com/quote/krx/000660/financials/)) ([source](https://stockanalysis.com/stocks/mu/financials/)) ([source](https://stockanalysis.com/stocks/asml/financials/)) ([source](https://stockanalysis.com/stocks/klac/financials/)) ([source](https://stockanalysis.com/stocks/lrcx/financials/)) ([source](https://stockanalysis.com/stocks/amat/financials/)) ([source](https://stockanalysis.com/quote/tyo/4062/financials/)) ([source](https://stockanalysis.com/stocks/asx/financials/)) ([source](https://stockanalysis.com/stocks/amkr/financials/)).

{{figure:gross-margins}}

Design, memory, inspection and leading-edge wafers earn 60 to 75 points, substrates about 30, assembly and test 14 to 20. The 2026 change is that memory joined the top tier: Micron went from 39.8 to 72.6 percent in nine months ([source](https://stockanalysis.com/stocks/mu/financials/)), moving value to Nvidia's suppliers.

Gartner put 2025 semiconductor revenue at $809B and forecasts $1.6T for 2026, memory alone $837B ([source](https://www.intelligentcio.com/north-america/2026/09/01/gartner-forecasts-semiconductor-revenue-to-hit-us1-6-trillion-in-2026/)). WSTS had forecast $772B ([source](https://www.wsts.org/76/103/Global-Semiconductor-Market-Approaches-1T-in-2026)) and SIA reported actual sales of $791.7B ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)); take the spread between the measurers as the error bar on every total here. UBS projects hyperscaler capex, on a definition that includes neoclouds, at $492B in 2025 and $1.009T in 2026 ([source](https://247wallst.com/investing/2026/08/22/ais-absurd-spending-boom-hyperscalers-are-spending-102-of-cloud-revenue-on-capex/)).

{{figure:market-2025}}

## The chokepoint (what is structurally expensive)

Per unit of compute, logic still deflates; what is wrapped around the die does not. HBM went from 41 percent of H100 cost to 48 percent on a B200 and 26 percent of a Rubin rack ([source](https://www.shanethegamer.com/pc-mac/nvidia-vera-rubins-memory-bill-hits-2m-more-than-doubling-grace-blackwells-cost/)), packaging prices rise three to four times faster than wafer prices ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)), and a Rubin rack draws more than 250 kW ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)) against about 124 kW for a GB200 rack ([source](https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component)), so the power plant outgrows the compute.

Three classes result.

| Stage | Class | Why |
|---|---|---|
| EUV lithography | Structurally expensive | One supplier; price set by a twenty-year optics curve. |
| Masks and pellicles | Structurally expensive | Scales with layer count; every design pays again. |
| Metrology and inspection | Structurally expensive | Inspection time rises faster than throughput. |
| HBM | Structurally expensive | Stacking and TSVs cut good die per wafer. |
| Advanced packaging, CoWoS-L | Structurally expensive | 60 to 70 percent interposer yield; scrap kills dies and HBM. |
| Power and cooling plant | Structurally expensive | Priced by grid queues and turbine lead times. |
| Leading-edge logic wafers | Compressible with scale | Defect density and utilisation improve through a ramp. |
| Design and EDA | Compressible with scale | Engineering cost amortises across volume. |
| Deposition and etch tools | Compressible with scale | Credible second sources in most steps. |
| ABF substrates | Compressible with scale | A laminate line, not a physics frontier. |
| Optical transceivers | Compressible with scale | Copper and co-packaged optics cap the price. |
| Test and assembly (OSAT) | Already commoditised | 14 to 20 percent margins; clears on price. |
| Wafers and bulk gases | Already commoditised | Multi-supplier, long-qualified, thin spreads. |
| Rack integration (ODM) | Already commoditised | Low-teens margins on specified content. |

The classification is ours; its interposer yield and OSAT margin figures are cited above ([source](https://siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026)) ([source](https://stockanalysis.com/stocks/asx/financials/)).

## Key evaluation criteria

- **Cost per good die, not per wafer.** A 30 percent wafer price rise at constant yield is survivable. A ten-point yield drop on an 800 mm2 die is not.
- **HBM dollars per GB, and GB per part.** The largest and fastest-growing line, set by three firms.
- **Packaging yield.** Failing after HBM attach throws away the most valuable parts.
- **Share of the bill the vendor does not control.** Nvidia sets its own margin but buys HBM, CoWoS and substrates at another firm's price.
- **Rack dollars per watt.** Past 250 kW per rack, power and cooling capex grows faster than accelerator capex ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)).
- **Compressibility class.** Ask whether the line falls when volume doubles. If not, capacity is the constraint.

## Takeaways

The silicon is the cheap part. On a B200 the logic dies are about 13 percent of manufacturing cost, HBM 48, and packaging and substrate another 16 ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)). Nvidia's 71 to 75 percent gross margin is the most visible number in the chain and the most contestable ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)), because a custom ASIC buys the same wafers and the same HBM. What is not contestable sits underneath: HBM stacking yield, CoWoS interposer yield, and the megawatts. Those do not get cheaper with volume, which is what makes them chokepoints.
