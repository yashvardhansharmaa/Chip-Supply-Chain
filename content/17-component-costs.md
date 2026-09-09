---json
{
  "id": "component-costs",
  "number": 17,
  "title": "Component Costs",
  "oneLiner": "Follow the money through an AI accelerator and the silicon turns out to be the cheap part. Memory and packaging are the bill.",
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

An accelerator is an assembly of purchased things, and the receipt is more informative than the datasheet. Follow the money and you learn which stages are expensive because of physics, which because capacity is short, and which because a firm can charge.

## How it works (the cost model)

Die cost has three inputs: wafer price, dies per wafer, and yield.

**Wafer price.** TSMC does not publish prices. Supply chain reporting in October 2025 put N3 at $25,000 to $27,000 per 300 mm wafer and N2 at roughly $30,000, a 10 to 20 percent step rather than the rumoured 50 percent ([source](https://technode.com/2025/10/09/tsmc-sets-2nm-wafer-price-at-30000-far-below-earlier-50-increase-speculation/)). TrendForce reported the same step and single-digit rises on 3 nm to 7 nm nodes in 2026 ([source](https://www.trendforce.com/news/2025/10/08/news-tsmc-2nm-reportedly-up-10-20-far-below-rumored-50-3-7nm-to-rise-single-digit-in-2026/)). Cost models put N5 and N4 at about $18,500 in 2026, range $16,000 to $21,300 ([source](https://siliconanalysts.com/guide/semiconductor-costs)), against $17,000 for N5 in 2020 ([source](https://siliconanalysts.com/market-data/wafer-price-tsmc)). A16 has been reported at up to $45,000 ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmc-could-charge-up-to-usd45-000-for-1-6nm-wafers-rumors-allege-a-50-percent-increase-in-pricing-over-prior-gen-wafers)).

**Dies per wafer.** A 300 mm wafer offers 70,686 mm2, but dies are rectangles and the wafer is a circle. Step an 800 mm2 die, about 26.0 by 30.8 mm, across a 294 mm usable diameter, keeping only dies that fall wholly inside: 68 gross dies.

**Yield.** Defects land at random, so a bigger die is likelier to catch one. Poisson gives survival as e to the power of minus A times D0, for die area A and defect density D0 per cm2. It is too harsh at large dies because real defects cluster. Murphy's model, the default, averages Poisson over a spread of densities: on an 800 mm2 die at D0 of 0.10 it gives 47 percent against Poisson's 45 ([source](https://fog.misty.com/perry/cod/references/yield_models.pdf)).

TSMC's N5 sat at 0.10 to 0.11 defects per cm2 in 2020 ([source](https://ljdevice.com.tw/en/better-yield-5nm-7nm-tsmc-update-defect-rates-n5/)). Estimates put N3 at 0.09 to 0.14 early to mature, and the H100's 814 mm2 die at 40 to 50 percent yield ([source](https://siliconanalysts.com/guide/semiconductor-costs)). TSMC says N2 sits below all three ([source](https://semiwiki.com/forum/threads/tsmc-discloses-n2-defect-density-lower-than-n3-at-the-same-stage-of-development.22699/)).

**Blackwell.** A B200 is two reticle-limited dies on custom TSMC 4NP, 208 billion transistors, joined by a 10 TB/s link ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Take 68 gross dies, D0 of 0.07 and Murphy: 59 percent yield, 40 good dies, and at an $18,000 wafer that is $450 per die, $900 the pair. At D0 of 0.10, $560 each. A model at 70 to 75 percent yield gives $350 to $425 ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)).

**Rubin.** Rubin puts two compute dies and two I/O dies on a four-reticle CoWoS-L interposer on TSMC 3 nm, 336 billion transistors, 288 GB of HBM4 ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)). At a $25,000 N3P wafer and 59 percent yield each compute die is $625; at $27,000 and 50 percent yield, $795. Doubling the wafer price from N5 to N2 moves the die line by a few hundred dollars. Nothing else on the bill is that forgiving.

## Variants and trade-offs (the BOMs)

### Memory is the bill

A 12-high 36 GB HBM3E stack is modelled at about $300 at the factory gate, $8.33 per GB, and HBM4 at $550 and $15.28; contract prices run near double, $12.20 per GB for HBM3E in July 2026 and $16.67 for HBM4 in January 2026 ([source](https://siliconanalysts.com/data/hbm-pricing)). At $17 per GB the eight 24 GB HBM3E stacks on a B200 come to $3,250, about 48 percent of manufacturing cost ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)).

TrendForce notes HBM3E once priced at four to five times server DDR5, with the gap narrowing to one or two times by end-2026 ([source](https://www.trendforce.com/presscenter/news/20251218-12843.html)), and forecasts HBM contract prices rising by multiples in 2027 on HBM4 ([source](https://www.trendforce.com/presscenter/news/20260602-13074.html)).

### Packaging, substrate and test

CoWoS-S runs about $750 per package on H100-class designs and CoWoS-L $1,000 to $1,100 on a B200, a 47 percent premium for the multi-die build ([source](https://siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026)). Another estimate puts CoWoS-L at $1,100 to $1,500, the interposer at 50 to 70 percent of packaging cost and the ABF substrate at about 40 percent ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)). Interposer yields are 60 to 70 percent; LSI bridges yield near 90 percent against roughly 60 for a large monolithic interposer, the argument for CoWoS-L ([source](https://siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026)).

Yield loss at packaging scraps the dies and the HBM together. On B200-class parts that adds roughly $1,000 per shipped unit, and H100 test and assembly is about $920, 28 percent of cost of goods ([source](https://siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026)). TSMC raised CoWoS prices 15 to 20 percent in 2025, with 10 to 20 percent more expected in 2026 against roughly 5 percent a year on logic wafers ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)). See Advanced packaging on why capacity binds first.

### Three generations of bill of materials

| Line | H100 (2023) | B200 (2025-26) | Rubin VR200 (2026) |
|---|---|---|---|
| Logic die | ~$300 | ~$850 | ~$1,250-1,590, two N3P dies, modelled |
| HBM | ~$1,350 | ~$3,250 | ~$4,800, derived at $16.67/GB |
| Packaging | ~$750 CoWoS-S | ~$1,100 CoWoS-L | $1,500+, 4x reticle CoWoS-L |
| Test, assembly, other | ~$920 | ~$1,550 | not published |
| Total manufacturing cost | ~$3,320 | ~$6,750 | not published |
| Selling price | ~$27,000 | ~$40,000 | ~$50,000-55,000 |

H100 and B200 lines are from a cost model built on Raymond James and TrendForce inputs ([source](https://siliconanalysts.com/data/ai-chip-costs)) ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)); an independent estimate puts B200 module cost at $5,700 to $7,300 ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)). Rubin's die and HBM lines are derived from the prices above and its configuration ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)); its price is the reported volume figure ([source](https://www.shanethegamer.com/pc-mac/nvidia-vera-rubins-memory-bill-hits-2m-more-than-doubling-grace-blackwells-cost/)).

{{figure:b200-bom}}

### From package to rack to cluster

A GB300 NVL72 rack is priced near $5.0M, compute trays roughly 87 percent of the value, Nvidia content above 92 percent, and liquid cooling a Morgan Stanley-estimated $49,860 ([source](https://www.datagravity.dev/p/how-much-does-an-nvidia-nvl72-cost)). A Vera Rubin NVL72 is estimated at $7,803,148, of which $2,001,600 is memory against $373,939 on Grace Blackwell, lifting memory from about 9 percent of the rack to 26; the GPUs are roughly $4M and the boards $116,730 against $35,100 ([source](https://www.shanethegamer.com/pc-mac/nvidia-vera-rubins-memory-bill-hits-2m-more-than-doubling-grace-blackwells-cost/)).

A 100,000 H100 build carries over $4B of server capex alone, needs about 150 MW at roughly 1,275 W per GPU once CPUs, NICs and supplies are counted, burns 1.59 TWh a year and pays $123.9M for power at $0.078 per kWh; rail-optimised networking needs 98,304 optical transceivers, which is why operators substitute copper where reach allows ([source](https://newsletter.semianalysis.com/p/100000-h100-clusters-power-network)).

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

Gross margin. Nvidia's are its own ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026)) ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)); SK hynix's operating margin was 49 percent in 2025 and 76 in Q2 2026 ([source](https://news.skhynix.com/en/sk-hynix-announces-fy25-financial-results/)) ([source](https://news.skhynix.com/en/q2-2026-business-results/)); the rest are filings ([source](https://stockanalysis.com/stocks/tsm/financials/)) ([source](https://stockanalysis.com/quote/krx/000660/financials/)) ([source](https://stockanalysis.com/stocks/mu/financials/)) ([source](https://stockanalysis.com/stocks/asml/financials/)) ([source](https://stockanalysis.com/stocks/klac/financials/)) ([source](https://stockanalysis.com/stocks/lrcx/financials/)) ([source](https://stockanalysis.com/stocks/amat/financials/)) ([source](https://stockanalysis.com/quote/tyo/4062/financials/)) ([source](https://stockanalysis.com/stocks/asx/financials/)) ([source](https://stockanalysis.com/stocks/amkr/financials/)).

{{figure:gross-margins}}

Design, memory, inspection and leading-edge wafers earn 60 to 75 points. Substrates earn about 30. Assembly and test earn 14 to 20 and are, in margin terms, contract manufacturing. The 2026 change is that memory joined the top tier: Micron went from 39.8 to 72.6 percent in nine months ([source](https://stockanalysis.com/stocks/mu/financials/)), moving value to Nvidia's suppliers.

Gartner put 2025 semiconductor revenue at $809B and forecasts $1.6T for 2026, memory alone $837B ([source](https://www.intelligentcio.com/north-america/2026/09/01/gartner-forecasts-semiconductor-revenue-to-hit-us1-6-trillion-in-2026/)); WSTS, a year earlier, had forecast $772B and $975B ([source](https://www.wsts.org/76/103/Global-Semiconductor-Market-Approaches-1T-in-2026)), and SIA reported actual 2025 sales of $791.7B ([source](https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/)). Take the spread between the measurers as the error bar on every total in this section. DRAM alone hit $154.73B in 2Q26, up 59.5 percent sequentially ([source](https://www.trendforce.com/presscenter/news/20260907-13219.html)). Wafer fab equipment was a record $116.9B in 2025, forecast $143.9B in 2026 ([source](https://www.semi.org/en/semi-press-release/global-semiconductor-equipment-sales-projected-to-reach-a-record-of-156-billion-dollars-in-2027-semi-reports)). Advanced packaging is $40B to $50B, reaching $79B to $90B by 2030 ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)). Optical transceivers were $15.4B in 2025 and $17.6B in 2026, $34.4B by 2031 ([source](https://finance.yahoo.com/technology/articles/global-optical-transceiver-market-reach-103700630.html)). UBS projects total hyperscaler capex, a broader definition than the five largest cloud firms because it includes neoclouds, at $492B in 2025 rising to $1.009T in 2026 ([source](https://247wallst.com/investing/2026/08/22/ais-absurd-spending-boom-hyperscalers-are-spending-102-of-cloud-revenue-on-capex/)); on the narrower five-firm basis used in the Introduction the 2025 figure is $448.2B ([source](https://epoch.ai/data-insights/hyperscaler-capex-trend)). Dell'Oro expects data centre capex above $3T by 2030 ([source](https://finance.yahoo.com/technology/ai/articles/ai-buildout-maintains-momentum-data-120000543.html)).

{{figure:market-2025}}

## The chokepoint (what is structurally expensive)

Per unit of compute, logic still deflates. What is wrapped around the die does not. HBM went from 41 percent of H100 cost to 48 percent of B200 cost and 26 percent of a Rubin rack ([source](https://www.shanethegamer.com/pc-mac/nvidia-vera-rubins-memory-bill-hits-2m-more-than-doubling-grace-blackwells-cost/)). Packaging prices rise three to four times faster than wafer prices ([source](https://gr8ham.substack.com/p/cowos-chip-on-wafer-on-substrate)). A Rubin rack draws more than 250 kW ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)) where a GB200 rack drew about 124 kW ([source](https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component)), so the power plant outgrows the compute.

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

The classification is ours; the interposer yield and OSAT margin figures in it are the ones cited above ([source](https://siliconanalysts.com/analysis/cowos-packaging-cost-chiplet-vs-monolithic-2026)) ([source](https://stockanalysis.com/stocks/asx/financials/)).

## Key evaluation criteria

- **Cost per good die, not per wafer.** A 30 percent wafer price rise at constant yield is survivable. A ten-point yield drop on an 800 mm2 die is not.
- **HBM dollars per GB, and GB per part.** The largest and fastest-growing line, set by three firms.
- **Packaging yield.** Failing after HBM attach throws away the most valuable parts.
- **Share of the bill the vendor does not control.** Nvidia sets its own margin but buys HBM, CoWoS and substrates at another firm's price.
- **Rack dollars per watt.** Past 250 kW per rack, power and cooling capex grows faster than accelerator capex ([source](https://blog.barrack.ai/nvidia-rubin-specs-architecture-2026/)).
- **Compressibility class.** Ask whether the line falls when volume doubles. If not, capacity is the constraint.

## Takeaways

The silicon is the cheap part. On a B200 the logic dies are about 13 percent of manufacturing cost, HBM 48, packaging and substrate another 16, and every generation pushes further that way ([source](https://siliconanalysts.com/analysis/nvidia-b200-blackwell-cost-breakdown)). Nvidia's 71 to 75 percent gross margin is the most visible number in the chain and the most contestable ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)), because a custom ASIC buys the same wafers and the same HBM. What is not contestable sits underneath: HBM stacking yield, CoWoS interposer yield, and the megawatts. Those do not get cheaper when you order more, which is what makes them chokepoints.
