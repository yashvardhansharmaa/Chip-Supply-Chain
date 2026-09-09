---json
{
  "id": "foundries-and-fabs",
  "number": 10,
  "title": "Foundries and Fabs",
  "oneLiner": "One company took 73 percent of pure-foundry revenue in the second quarter of 2026, and almost all of the leading edge sits on one island.",
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

Every leading AI accelerator in production is made by one company, in fabs clustered along the western edge of one island. TSMC took 73 percent of pure-foundry revenue in the second quarter of 2026, with Samsung at 7 percent, SMIC 5, UMC 4 and GlobalFoundries 3 ([source](https://counterpointresearch.com/en/insights/global-semiconductor-foundry-market-share)). At the leading edge the concentration is worse than that headline suggests.

## How it works

A foundry manufactures chips other companies design. TSMC was founded in 1987 and pioneered the pure-play model by promising never to compete with its customers; in 2025 it made 12,682 different products on 305 technologies for 534 customers, with annual capacity above 17 million 12-inch-equivalent wafers ([source](https://www.tsmc.com/english/aboutTSMC/company_profile)). The model won because of arithmetic. A leading-edge line costs $15 to $25 billion to build and equip and takes four to six years from groundbreaking to volume production ([source](https://semiconductorx.com/fabs-leading-edge.php)). No single design house sells enough silicon to fill one.

Physically a fab is a cleanroom with a machine shop above and below it. TSMC's Fab 18 in Tainan has a cleanroom of about 160,000 square metres and cost close to $20 billion across its phases; TSMC calls a site a gigafab once it exceeds 100,000 wafer starts a month ([source](https://www.asianometry.com/p/the-economics-of-tsmcs-giga-fabs)). Below the cleanroom floor sits the subfab, a second building's worth of pumps, chillers, gas cabinets, abatement and ultrapure water plant. Above it, air handlers that turn the room over continuously so particle counts stay near zero.

The tool set runs to many hundreds of machines. Fifteen or more of them are EUV scanners at roughly $200 million each, with High-NA systems above $350 million ([source](https://semiconductorx.com/fabs-leading-edge.php)). A 2 nm-class wafer passes through more than a thousand process steps and about 95 mask layers, and takes roughly sixteen weeks to finish ([source](https://semiconductorx.com/front-end-fabrication-overview.html)).

Utilities are not a footnote. TSMC consumed 8.4 percent of Taiwan's electricity in 2023, and S&P Global projects 23.7 percent by 2030 ([source](https://www.taipeitimes.com/News/taiwan/archives/2025/04/11/2003834993)). Fabs also need enormous volumes of ultrapure water, which is why Taiwan's periodic droughts are a semiconductor story.

## Variants and trade-offs

### Pure-play foundries

TSMC and UMC build only for others. TSMC's advantage compounds: 7 nm and below was 77 percent of its wafer revenue in the second quarter of 2026, split 33 percent at 5 nm, 30 percent at 3 nm and 3 percent at 2 nm, on revenue of $40.20 billion at a 67.7 percent gross margin ([source](https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm)). Nobody else earns leading-edge margins, so nobody else can fund the next node from cash flow.

### Integrated device makers turned foundry

Intel and Samsung make their own products and sell capacity. That is a harder business, because customers dislike handing designs to a competitor and because internal products absorb the good capacity. Intel Foundry booked $5.8 billion of revenue in the second quarter of 2026, up 31 percent, against a $2.089 billion operating loss ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)).

### National champions

SMIC, Hua Hong and Rapidus exist because a government decided they should. SMIC turned over $9.327 billion in 2025 at 93.5 percent average utilisation, ended the year with 1.059 million 8-inch-equivalent wafers a month of capacity, spent $8.1 billion of capex, and saw fourth-quarter gross margin fall to 19.2 percent as new depreciation landed ([source](https://www.trendforce.com/news/2026/02/11/news-smic-posts-record-9-3b-in-2025-sales-7nm-yields-reportedly-weigh-on-margins/)). Rapidus raised 267.6 billion yen in February 2026, 100 billion from Japan's IPA and 167.6 billion from 32 companies including Canon, Fujitsu, NTT, SoftBank and Sony, to carry it from R&D to 2 nm mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

### Mature-node specialists

GlobalFoundries, UMC, Vanguard, Nexchip and PSMC compete on cost, cycle time and specialty processes rather than density. In the fourth quarter of 2025 UMC turned over $2.0 billion, GlobalFoundries $1.8 billion and Hua Hong Group $1.22 billion, against TSMC's $33.7 billion ([source](https://www.trendforce.com/presscenter/news/20260312-12965.html)).

{{figure:foundry-revenue}}

## Capacity and cost

TSMC guided 2026 capex to $60 to $64 billion, raised from an initial $52 to $56 billion, and announced a further $100 billion of US investment on its second-quarter call, on top of the $165 billion already committed ([source](https://semiwiki.com/semiconductor-manufacturers/tsmc/371192-tsmcs-raises-the-bar-on-capex/)). That $165 billion figure itself came from adding $100 billion in March 2025 to an existing $65 billion, funding three more fabs, two advanced packaging facilities and an R&D centre ([source](https://pr.tsmc.com/english/news/3210)).

The physical plan behind the money: Arizona Fab 1 has been in volume production since late 2024, Fab 2 reaches 3 nm volume production in the second half of 2027, a new Tainan 3 nm fab starts in the first half of 2027, and Kumamoto's second fab follows in 2028 ([source](https://www.trendforce.com/news/2026/04/16/news-tsmc-n3-tightens-on-ai-demand-arizona-2nd-fab-3nm-volume-production-in-2h27-kumamoto-in-2028/)). N2 is ramping in phases at Hsinchu and Kaohsiung. N3 capacity goes from about 150,000 wafers a month in the first half of 2026 to 180,000 by early in the fourth quarter, and N2 plus N3 together should pass 400,000 a month by 2028 ([source](https://www.trendforce.com/news/2026/09/07/news-tsmcs-3nm-reportedly-to-overtake-5nm-as-top-revenue-node-in-2h26-output-value-could-top-nt400b/)).

Prices are rising for the first time in decades. An N2 wafer runs about $30,000 against roughly $20,000 at N3, with 5 to 10 percent increases on sub-5 nm nodes in 2026; AMD's chief executive has put the Arizona premium at 5 to 20 percent over Taiwan, and some reports put it at 30 percent for 4 nm ([source](https://www.eetasia.com/tsmc-ends-era-of-cheap-transistors-with-5-10-price-hikes-for-advanced-nodes/)). TrendForce reads the N2 increase lower, at 10 to 20 percent over N3 wafers it prices at $25,000 to $27,000 ([source](https://www.trendforce.com/news/2025/10/08/news-tsmc-2nm-reportedly-up-10-20-far-below-rumored-50-3-7nm-to-rise-single-digit-in-2026/)).

Allocation is the quiet lever. TSMC does not auction capacity; it books it years ahead against prepayments and long-term agreements, which is why Nvidia's Rubin ramp and Apple's product cycle both land on N3 without colliding. Apple and Nvidia are expected to be the first A16 customers ([source](https://www.trendforce.com/news/2026/09/07/news-tsmcs-3nm-reportedly-to-overtake-5nm-as-top-revenue-node-in-2h26-output-value-could-top-nt400b/)). AMD, Broadcom and the hyperscaler ASIC programmes queue behind them, and in practice the binding constraint is usually packaging rather than wafers. See Advanced packaging.

## Who makes it

{{figure:foundry-share}}

Intel is the interesting case, because it is now partly state-owned. In August 2025 the US government bought 433.3 million newly issued Intel shares at $20.47 for $8.9 billion, a 9.9 percent stake funded from $5.7 billion of unpaid CHIPS Act grants and $3.2 billion from the Secure Enclave programme. The stake is passive, with no board seat, and the government agreed to vote with the board. It also took a five-year warrant at $20 a share for a further 5 percent, exercisable only if Intel ceases to own at least 51 percent of the foundry business ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). That last clause is the point: Washington bought an option on Intel not spinning off its fabs.

Intel's technical position improved in 2026. It entered high-volume manufacturing on a subset of Panther Lake using ASML's EXE High-NA EUV, the first company to do so, and put 18A-P into risk production ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)). Its commercial position has not caught up: 14A capacity depends on winning external customers first.

Samsung's swing factor is Taylor, Texas. Tesla's AI5 has taped out and is to be built there on Samsung's 2 nm process, with volume production expected in the second half of 2027 ([source](https://electrek.co/2026/07/13/samsung-taylor-fab-tesla-ai5-chip-2nm/)).

## The chokepoint

Capacity is not evenly distributed, and the distribution at the leading edge is not the distribution overall. China has the most installed capacity of any region at 10.1 million wafers a month in 2025, ahead of Taiwan's 5.8 million, but almost all of it is mature ([source](https://www.creating-nanotech.com/en-US/newsc82-semi-global-wafer-fab-production-capacity-continues-to-rise-with-increases-of-6-and-7-in-2024-and-2025)). Below 10 nm the United States had essentially zero share in 2022 and is projected to reach 28 percent by 2032, on $2.3 trillion of new wafer fab investment between 2024 and 2032 against $720 billion in the prior decade ([source](https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain)). Until then, the leading edge is Taiwan.

{{figure:capacity-by-region}}

That creates three stacked risks. Seismic: Taiwan sits on an active plate boundary, and fabs are built on isolation systems precisely because significant quakes are routine, but a tool knocked out of calibration scraps work in progress across a fab. Resource: drought and grid margin, with TSMC alone heading toward roughly a quarter of national electricity demand by 2030 ([source](https://www.taipeitimes.com/News/taiwan/archives/2025/04/11/2003834993)). And political: a blockade or conflict would remove most sub-5 nm capacity from the world market at once, with no substitute available inside a decade. Geopolitics covers that in depth.

Diversification is real but slow and expensive. The Arizona ramp has depended heavily on engineers rotated in from Taiwan, and the wage, permitting and construction-cost gap shows up in the 5 to 20 percent wafer premium customers are being asked to pay ([source](https://www.eetasia.com/tsmc-ends-era-of-cheap-transistors-with-5-10-price-hikes-for-advanced-nodes/)). A fab is not just a building; it is a workforce that has run a specific process for years.

## Key evaluation criteria

- **Leading-edge share** — what fraction of a foundry's revenue comes from its newest two nodes. TSMC's 77 percent from 7 nm and below is the reason it can self-fund.
- **Yield at ramp** — the difference between a profitable node and a subsidised one. Intel Foundry's loss is a yield-and-utilisation story, not a demand story.
- **Capex per unit of capacity** — $15 to $25 billion per leading-edge line, and higher outside Taiwan.
- **Utilisation** — SMIC's 93.5 percent shows what a captive domestic market does for loading, and what it does not do for margins.
- **Customer concentration** — an IDM-owned foundry competes with its customers, which caps who will trust it with a flagship design.
- **Geographic exposure** — how much of a buyer's supply sits on one island, one grid and one fault system.

## Takeaways

The foundry model won because leading-edge fabs are too expensive for any one design house, and it concentrated because only the leader earns enough to build the next node. TSMC now takes roughly three quarters of pure-foundry revenue and nearly all of the leading edge, and is spending $60 to $64 billion in 2026 to keep it. Intel and Samsung are credible technically and unproven commercially, and Intel is now part-owned by its government. Diversification is underway and priced in, at a 5 to 20 percent premium and a decade of lead time, which means the concentration risk in Taiwan is a fact about the 2020s and 2030s rather than a problem being solved.
