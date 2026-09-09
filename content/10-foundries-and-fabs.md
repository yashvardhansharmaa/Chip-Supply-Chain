---json
{
  "id": "foundries-and-fabs",
  "number": 10,
  "title": "Foundries and Fabs",
  "oneLiner": "One company took 73 percent of pure-foundry revenue in the second quarter of 2026, and almost all of the leading edge sits on one island.",
  "plain": "A foundry is a print shop for chips. Other companies send in designs, and the foundry runs them through the same building on the same tools. What makes it hard is that the building costs about twenty billion dollars, the air inside has to be cleaner than an operating theatre, and a wafer crosses hundreds of machines over four months without ever touching that air. Nobody sells enough chips to fill a shop like that alone, so the world shares a few of them, and most of the newest ones sit in Taiwan.",
  "specimen": "foup",
  "specimenCaption": "Right: a front-opening unified pod, the sealed carrier that moves 25 wafers between tools. Wafers never touch fab air; the FOUP is the cleanroom.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "73% of pure-foundry revenue, 2Q26"},
      {"name": "Samsung Foundry", "country": "KR", "share": "7% of pure-foundry revenue, 2Q26"},
      {"name": "SMIC", "country": "CN", "share": "5% of pure-foundry revenue, 2Q26"},
      {"name": "UMC", "country": "TW", "share": "4% of pure-foundry revenue, 2Q26"},
      {"name": "GlobalFoundries", "country": "US", "share": "3% of pure-foundry revenue, 2Q26"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC and UMC; N2 and N3 for every leading AI accelerator"},
      {"code": "KR", "note": "Samsung Foundry, Hwaseong and Pyeongtaek"},
      {"code": "CN", "note": "SMIC and Hua Hong; 10.1 million wafers per month of installed capacity in 2025"},
      {"code": "US", "note": "Intel Foundry, GlobalFoundries, TSMC Arizona, Samsung Taylor"},
      {"code": "JP", "note": "TSMC Kumamoto, Rapidus Chitose"}
    ],
    "chinaStatus": "SMIC and Hua Hong are the largest domestic foundries. SMIC turned over $9.33 billion in 2025 at 93.5% utilisation but cannot buy EUV, so it is capped below the leading edge.",
    "usStatus": "Intel Foundry is the only US-owned leading-edge foundry and lost $2.089 billion on $5.8 billion of revenue in 2Q26. The federal government holds a 9.9% passive equity stake in Intel.",
    "costSignal": "$15-25 billion to build and equip one leading-edge line; TSMC 2026 capex guided to $60-64 billion",
    "substitution": {"years": "5-10", "why": "Four to six years from groundbreaking to volume production, then years more to reach competitive yield; TSMC Arizona started construction in 2021 and its second fab reaches 3 nm volume production in 2H27."}
  },
  "keyFacts": [
    {"fact": "TSMC held 73% of pure-foundry revenue in 2Q26, with Samsung at 7%, SMIC 5%, UMC 4% and GlobalFoundries 3%", "source": "https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share"},
    {"fact": "7 nm and below was 77% of TSMC's wafer revenue in 2Q26, on total revenue of $40.20 billion", "source": "https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm"},
    {"fact": "TSMC raised 2026 capex guidance to $60-64 billion and announced a further $100 billion for the US on the 2Q26 call, on top of $165 billion", "source": "https://semiwiki.com/semiconductor-manufacturers/tsmc/371192-tsmcs-raises-the-bar-on-capex/"},
    {"fact": "The US government bought 433.3 million Intel shares at $20.47 for $8.9 billion, a 9.9% passive stake", "source": "https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to"},
    {"fact": "Intel Foundry had $5.8 billion of 2Q26 revenue and a $2.089 billion operating loss", "source": "https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results"},
    {"fact": "SMIC turned over $9.327 billion in 2025 with 1.059 million 8-inch-equivalent wafers per month of capacity and 93.5% average utilisation", "source": "https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/"},
    {"fact": "TSMC's N3 capacity rises from about 150,000 wafers per month in 1H26 to 180,000 by early 4Q26, with N2 plus N3 above 400,000 by 2028", "source": "https://www.trendforce.com/news/2026/09/07/news-tsmcs-3nm-reportedly-to-overtake-5nm-as-top-revenue-node-in-2h26-output-value-could-top-nt400b/"},
    {"fact": "The US share of sub-10 nm logic capacity is projected to rise from near zero in 2022 to 28% in 2032, on $2.3 trillion of new fab investment 2024-2032", "source": "https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain"}
  ],
  "figures": [
    {
      "id": "foundry-share",
      "type": "stack",
      "title": "Pure-foundry revenue share, 2Q26",
      "unit": "%",
      "data": [["TSMC", 73], ["Samsung", 7], ["SMIC", 5], ["UMC", 4], ["GlobalFoundries", 3], ["Others", 7]],
      "source": {"label": "Counterpoint Research", "url": "https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share"}
    },
    {
      "id": "foundry-revenue",
      "type": "bars",
      "title": "Top 10 foundry revenue, 4Q25",
      "unit": "US$ billion",
      "data": [["TSMC", 33.7], ["Samsung", 3.4], ["SMIC", 2.49], ["UMC", 2.0], ["GlobalFoundries", 1.8], ["Hua Hong Group", 1.22], ["Tower", 0.44], ["Vanguard", 0.41], ["Nexchip", 0.39], ["PSMC", 0.37]],
      "source": {"label": "TrendForce", "url": "https://www.trendforce.com/presscenter/news/20260312-12965.html"}
    },
    {
      "id": "capacity-by-region",
      "type": "bars",
      "title": "Installed wafer fab capacity by region, 2025, all nodes",
      "unit": "million 8-inch-equivalent wafers per month",
      "data": [["China", 10.1], ["Taiwan", 5.8], ["South Korea", 5.4], ["Japan", 4.7], ["Americas", 3.2], ["Europe", 2.7], ["SE Asia and ME", 1.8]],
      "source": {"label": "SEMI World Fab Forecast", "url": "https://www.creating-nanotech.com/en-US/newsc82-semi-global-wafer-fab-production-capacity-continues-to-rise-with-increases-of-6-and-7-in-2024-and-2025"}
    }
  ]
}
---
# Foundries and Fabs

Every leading AI accelerator in production is made by one company, in fabs clustered along the western edge of one island. TSMC took 73 percent of pure-foundry revenue in the second quarter of 2026 ([source](https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share)). At the leading edge the concentration is worse than that headline suggests.

## How it works

A foundry is a print shop for chips. Other companies send in designs, and the foundry runs them through the same building on the same tools. What makes it hard is that the building costs about twenty billion dollars, the air inside has to be cleaner than an operating theatre, and a wafer crosses hundreds of machines over four months without ever touching that air. Nobody sells enough chips to fill a shop like that alone, so the world shares a few of them, and most of the newest ones sit in Taiwan.

TSMC was founded in 1987 and pioneered the pure-play model by promising never to compete with its customers. In 2025 it made 12,682 products for 534 customers ([source](https://www.tsmc.com/english/aboutTSMC/company_profile)). The model won on arithmetic: a leading-edge line costs $15 to $25 billion to build and equip and takes four to six years from groundbreaking to volume production ([source](https://semiconductorx.com/fabs-leading-edge.php)).

TSMC's Fab 18 in Tainan has a cleanroom of about 160,000 square metres and cost close to $20 billion across its phases, and TSMC calls a site a gigafab once it exceeds 100,000 wafer starts a month ([source](https://www.asianometry.com/p/the-economics-of-tsmcs-giga-fabs)). The tool set runs to many hundreds of machines, fifteen or more of them EUV scanners ([source](https://semiconductorx.com/fabs-leading-edge.php)). See Lithography for what those cost.

## Variants and trade-offs

### Pure-play foundries

TSMC and UMC build only for others. Chips at 7 nm and below were 77 percent of TSMC's wafer revenue in the second quarter of 2026, split 33 percent at 5 nm, 30 percent at 3 nm and 3 percent at 2 nm, on revenue of $40.20 billion at a 67.7 percent gross margin ([source](https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm)). Nobody else earns leading-edge margins, so nobody else can fund the next node from cash flow.

### Integrated device makers turned foundry

Intel and Samsung make their own products and sell capacity. That is a harder business, because customers dislike handing designs to a competitor and internal products absorb the good capacity. Intel Foundry booked $5.8 billion of revenue in the second quarter of 2026, up 31 percent, against a $2.089 billion operating loss ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)).

### National champions

SMIC, Hua Hong and Rapidus exist because a government decided they should. SMIC turned over $9.327 billion in 2025 at 93.5 percent average utilisation, ended the year with 1.059 million 8-inch-equivalent wafers a month of capacity, and saw fourth-quarter gross margin fall to 19.2 percent as new depreciation landed ([source](https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/)). Rapidus raised 267.6 billion yen in February 2026 to carry it from research to 2 nm mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

### Mature-node specialists

GlobalFoundries, UMC, Vanguard, Nexchip and PSMC compete on cost, cycle time and specialty processes rather than density. In the fourth quarter of 2025 UMC turned over $2.0 billion, GlobalFoundries $1.8 billion and Hua Hong Group $1.22 billion, against TSMC's $33.7 billion ([source](https://www.trendforce.com/presscenter/news/20260312-12965.html)).

{{figure:foundry-revenue}}

## Capacity and cost

TSMC guided 2026 capex to $60 to $64 billion and announced a further $100 billion of US investment on its second-quarter call, on top of $165 billion already committed ([source](https://semiwiki.com/semiconductor-manufacturers/tsmc/371192-tsmcs-raises-the-bar-on-capex/)). The physical plan behind the money:

- **Arizona.** Fab 1 has been in volume production since late 2024, and Fab 2 reaches 3 nm volume production in the second half of 2027 ([source](https://www.trendforce.com/news/2026/04/16/news-tsmc-n3-tightens-on-ai-demand-arizona-2nd-fab-3nm-volume-production-in-2h27-kumamoto-in-2028/)).
- **Tainan.** A new 3 nm fab starts in the first half of 2027, alongside the N2 ramp at Hsinchu and Kaohsiung ([source](https://www.trendforce.com/news/2026/04/16/news-tsmc-n3-tightens-on-ai-demand-arizona-2nd-fab-3nm-volume-production-in-2h27-kumamoto-in-2028/)).
- **Kumamoto.** The second Japanese fab follows in 2028 ([source](https://www.trendforce.com/news/2026/04/16/news-tsmc-n3-tightens-on-ai-demand-arizona-2nd-fab-3nm-volume-production-in-2h27-kumamoto-in-2028/)).

N3 capacity goes from about 150,000 wafers a month in the first half of 2026 to 180,000 by early in the fourth quarter, and N2 plus N3 should pass 400,000 by 2028 ([source](https://www.trendforce.com/news/2026/09/07/news-tsmcs-3nm-reportedly-to-overtake-5nm-as-top-revenue-node-in-2h26-output-value-could-top-nt400b/)).

Geography now carries a premium of its own. AMD's chief executive has put the Arizona premium at 5 to 20 percent over Taiwan, and some reports put it at 30 percent for 4 nm ([source](https://www.eetasia.com/tsmc-ends-era-of-cheap-transistors-with-5-10-price-hikes-for-advanced-nodes/)). See Transistors and the front end for wafer prices by node.

Allocation is the quiet lever. TSMC does not auction capacity; it books it years ahead against prepayments, which is why Apple and Nvidia are expected to be the first A16 customers ([source](https://www.trendforce.com/news/2026/09/07/news-tsmcs-3nm-reportedly-to-overtake-5nm-as-top-revenue-node-in-2h26-output-value-could-top-nt400b/)) and AMD, Broadcom and the hyperscaler ASIC programmes queue behind them. The binding constraint is usually packaging rather than wafers. See Advanced packaging.

## Who makes it

{{figure:foundry-share}}

Intel is now partly state-owned. In August 2025 the US government bought 433.3 million newly issued Intel shares at $20.47 for $8.9 billion, a 9.9 percent stake funded from $5.7 billion of unpaid CHIPS Act grants and $3.2 billion from the Secure Enclave programme. The stake is passive, and it came with a five-year warrant for a further 5 percent, exercisable only if Intel ceases to own at least 51 percent of the foundry business ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Washington bought an option on Intel not spinning off its fabs.

Intel's technical position improved in 2026: it entered high-volume manufacturing on a subset of Panther Lake using ASML's High-NA EUV, the first company to do so, and put 18A-P into risk production ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)). Its commercial position has not caught up, because 14A depends on winning external customers first.

Samsung's swing factor is Taylor, Texas, where Tesla's AI5 is to be built on its 2 nm process, with volume production expected in the second half of 2027 ([source](https://electrek.co/2026/07/13/samsung-taylor-fab-tesla-ai5-chip-2nm/)).

## The chokepoint

The distribution at the leading edge is not the distribution overall. China has the most installed capacity of any region, 10.1 million wafers a month in 2025 against Taiwan's 5.8 million, but almost all of it is mature ([source](https://www.creating-nanotech.com/en-US/newsc82-semi-global-wafer-fab-production-capacity-continues-to-rise-with-increases-of-6-and-7-in-2024-and-2025)). Below 10 nm the United States had essentially zero share in 2022 and is projected to reach 28 percent by 2032, on $2.3 trillion of new fab investment between 2024 and 2032 ([source](https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain)). Until then, the leading edge is Taiwan.

{{figure:capacity-by-region}}

That stacks three risks on one island:

- **Seismic.** Taiwan sits on an active plate boundary, and a tool knocked out of calibration scraps the work in progress across a whole fab.
- **Resource.** Drought and grid margin both bind. TSMC consumed 8.4 percent of Taiwan's electricity in 2023, and S&P Global projects 23.7 percent by 2030 ([source](https://www.taipeitimes.com/News/taiwan/archives/2025/04/11/2003834993)).
- **Political.** A blockade or conflict would remove most sub-5 nm capacity from the world market at once, with no substitute available inside a decade. See Geopolitics.

Diversification is real but slow. The Arizona ramp has leaned on engineers rotated in from Taiwan, and the wage, permitting and construction-cost gap shows up in the premium customers pay ([source](https://www.eetasia.com/tsmc-ends-era-of-cheap-transistors-with-5-10-price-hikes-for-advanced-nodes/)). A fab is not just a building. It is a workforce that has run one specific process for years.

## Key evaluation criteria

- **Leading-edge share** — what fraction of revenue comes from the newest two nodes. TSMC's 77 percent from 7 nm and below is why it can self-fund ([source](https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm)).
- **Yield at ramp** — the difference between a profitable node and a subsidised one. Intel Foundry's loss is a yield-and-utilisation story, not a demand story.
- **Capex per unit of capacity** — $15 to $25 billion per leading-edge line, and higher outside Taiwan ([source](https://semiconductorx.com/fabs-leading-edge.php)).
- **Utilisation** — SMIC's 93.5 percent shows what a captive domestic market does for loading, and what it does not do for margins ([source](https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/)).
- **Customer concentration** — an IDM-owned foundry competes with its customers, which caps who will trust it with a flagship design.
- **Geographic exposure** — how much of a buyer's supply sits on one island, one grid and one fault system.

## Takeaways

The foundry model won because leading-edge fabs are too expensive for any one design house, and it concentrated because only the leader earns enough to build the next node. TSMC takes roughly three quarters of pure-foundry revenue and nearly all of the leading edge ([source](https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share)), and is spending $60 to $64 billion in 2026 to keep it ([source](https://semiwiki.com/semiconductor-manufacturers/tsmc/371192-tsmcs-raises-the-bar-on-capex/)). Intel and Samsung are credible technically and unproven commercially, and Intel is now part-owned by its government ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Diversification is underway and priced in, at a 5 to 20 percent premium and a decade of lead time, which makes the concentration in Taiwan a fact about the 2020s and 2030s rather than a problem being solved.
