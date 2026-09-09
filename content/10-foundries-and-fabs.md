---json
{
  "id": "foundries-and-fabs",
  "number": 10,
  "title": "Foundries and Fabs",
  "oneLiner": "TSMC runs six factories big enough to be called gigafabs. All six are in Taiwan, and they hold 13 of the 17 million wafers a year the company can make.",
  "plain": "A foundry is a print shop for chips. Other companies send in designs, and the foundry runs them through the same building on the same tools. What makes it hard is that the building costs tens of billions of dollars, the air inside has to be cleaner than an operating theatre, and a wafer crosses hundreds of machines over several months without ever touching that air. Nobody sells enough chips to fill a shop like that alone, so the world shares a few of them, and most of the newest ones sit in Taiwan.",
  "specimen": "foup",
  "specimenCaption": "Right: a front-opening unified pod, the sealed carrier that moves 25 wafers between tools. Wafers never touch fab air; the FOUP is the cleanroom.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "77% of wafer revenue from 7 nm and below, 2Q26; six gigafabs, all in Taiwan"},
      {"name": "Intel Foundry", "country": "US", "share": "$5.8bn revenue and a $2.089bn operating loss, 2Q26"},
      {"name": "Samsung Foundry", "country": "KR", "share": "Hwaseong and Pyeongtaek; a minimum $17bn build-out at Taylor, Texas"},
      {"name": "SMIC", "country": "CN", "share": "$9.327bn revenue in 2025 at 93.5% utilisation"},
      {"name": "Rapidus", "country": "JP", "share": "State-backed 2 nm entrant, Chitose"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC's six gigafabs and UMC; N2 and N3 for every leading AI accelerator"},
      {"code": "KR", "note": "Samsung Foundry, Hwaseong and Pyeongtaek"},
      {"code": "CN", "note": "SMIC and Hua Hong; the largest installed capacity of any region, almost all of it mature"},
      {"code": "US", "note": "Intel Foundry, GlobalFoundries, TSMC Arizona, Samsung Taylor"},
      {"code": "JP", "note": "TSMC Kumamoto, Rapidus Chitose"}
    ],
    "chinaStatus": "SMIC and Hua Hong are the largest domestic foundries. SMIC turned over $9.327 billion in 2025 at 93.5% utilisation but cannot buy EUV, so it is capped below the leading edge. China is forecast to hold the largest installed capacity of any region, and almost none of it is leading-edge.",
    "usStatus": "Intel Foundry is the only US-owned leading-edge foundry and lost $2.089 billion on $5.8 billion of revenue in 2Q26. The federal government holds a 9.9% passive equity stake in Intel.",
    "costSignal": "BCG puts the ten-year cost of owning a fab completed in 2026 at $35-43 billion; TSMC intends to spend $165 billion in the United States alone",
    "substitution": {"years": "5-10", "why": "TSMC's six gigafabs are all in Taiwan and took decades to build; Arizona, Kumamoto and Nanjing are subsidiaries, and none of them is a gigafab."}
  },
  "keyFacts": [
    {"fact": "7 nm and below was 77% of TSMC's wafer revenue in 2Q26, on revenue of $40.20 billion at a 67.7% gross margin", "source": "https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm"},
    {"fact": "TSMC defines a GIGAFAB as a 300 mm fab running more than 100,000 wafers a month; it operates six, whose combined capacity exceeded 13 million 12-inch equivalent wafers in 2025", "source": "https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab"},
    {"fact": "Annual capacity of all facilities TSMC and its subsidiaries manage exceeded 17 million 12-inch equivalent wafers in 2025", "source": "https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity"},
    {"fact": "TSMC intends to invest US$165 billion in the United States, adding $100 billion in March 2025 to $65 billion already committed in Phoenix, for three new fabs, two packaging plants and an R&D centre", "source": "https://pr.tsmc.com/english/news/3210"},
    {"fact": "The US government bought 433.3 million Intel shares at $20.47 for $8.9 billion, a 9.9% passive stake", "source": "https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to"},
    {"fact": "Intel Foundry had $5.8 billion of 2Q26 revenue and a $2.089 billion operating loss", "source": "https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results"},
    {"fact": "SMIC revenue rose 16.2% to $9.327 billion in 2025 at 93.5% average utilisation, with monthly capacity above 1 million 8-inch-equivalent wafers", "source": "https://www.smics.com/en/site/news_read/7951"},
    {"fact": "SEMI forecast China at 10.1 million wafers per month of installed capacity in 2025 against Taiwan's 5.8 million, out of a global 33.7 million", "source": "https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports"},
    {"fact": "The US share of sub-10 nm logic capacity is projected to rise from near zero in 2022 to 28% in 2032, on $2.3 trillion of new fab investment 2024-2032", "source": "https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain"}
  ],
  "figures": [
    {
      "id": "foundry-share",
      "type": "stack",
      "title": "TSMC wafer revenue by node, 2Q26",
      "unit": "% of wafer revenue",
      "data": [["2 nm", 3], ["3 nm", 30], ["5 nm", 33], ["7 nm", 11], ["10 nm and above", 23]],
      "source": {"label": "TSMC 2Q26 results, filed with the SEC", "url": "https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm"}
    },
    {
      "id": "capacity-by-region",
      "type": "bars",
      "title": "Installed wafer fab capacity by region, 2025 forecast, all nodes",
      "unit": "million 8-inch-equivalent wafers per month",
      "data": [["China", 10.1], ["Taiwan", 5.8], ["South Korea", 5.4], ["Japan", 4.7], ["Americas", 3.2], ["Europe and Mideast", 2.7], ["SE Asia", 1.8]],
      "source": {"label": "SEMI World Fab Forecast", "url": "https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports"}
    }
  ]
}
---
# Foundries and Fabs

TSMC calls a plant a GIGAFAB once it runs more than 100,000 300 mm wafers a month. It operates six of them, their combined output passed 13 million 12-inch equivalent wafers in 2025, and every one is in Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)).

## How it works

A foundry is a print shop for chips. Other companies send in designs, and the foundry runs them through the same building on the same tools. What makes it hard is that the building costs tens of billions of dollars, the air inside has to be cleaner than an operating theatre, and a wafer crosses hundreds of machines over several months without ever touching that air. Nobody sells enough chips to fill a shop like that alone, so the world shares a few of them, and most of the newest ones sit in Taiwan.

TSMC was founded in 1987 and pioneered the pure-play model by promising never to compete with its customers. The model won on arithmetic. BCG puts the ten-year cost of owning a fab completed in 2026 at $35 to $43 billion, a third to two thirds above one finished three years earlier ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)). No design house sells enough of one product to fill that.

Everything TSMC and its subsidiaries manage came to more than 17 million 12-inch equivalent wafers a year in 2025 ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)). The Taiwanese gigafabs are 13 million of it. Arizona, Kumamoto, Nanjing and Washington are the rest.

## Variants and trade-offs

### Pure-play foundries

TSMC and UMC build only for others. Chips at 7 nm and below were 77 percent of TSMC's wafer revenue in the second quarter of 2026, split 33 percent at 5 nm, 30 at 3 nm and 3 at 2 nm, on revenue of $40.20 billion at a 67.7 percent gross margin ([source](https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm)). Nobody else earns leading-edge margins, so nobody else can fund the next node from cash flow.

{{figure:foundry-share}}

### Integrated device makers turned foundry

Intel and Samsung make their own products and sell capacity too. That is harder: customers dislike handing designs to a competitor, and internal products absorb the good capacity. Intel Foundry booked $5.8 billion of revenue in the second quarter of 2026, up 31 percent, against a $2.089 billion operating loss ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)).

### National champions

SMIC, Hua Hong and Rapidus exist because a government decided they should. SMIC's revenue rose 16.2 percent to $9.327 billion in 2025 at 93.5 percent utilisation, on monthly capacity above a million 8-inch-equivalent wafers and a 21 percent gross margin ([source](https://www.smics.com/en/site/news_read/7951)). Rapidus raised 267.6 billion yen in February 2026 to carry it to 2 nm mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

### Mature-node capacity

Most wafers are not leading-edge. SEMI expects the foundry segment alone to reach 12.7 million wafers a month by 2026, with the fastest growth in China ([source](https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports)). Those lines run power devices, analogue and microcontrollers, and compete on cost, not density.

## Capacity and cost

TSMC intends to spend $165 billion in the United States, adding $100 billion in March 2025 to the $65 billion already committed in Phoenix, for three more fabs, two packaging plants and an R&D centre ([source](https://pr.tsmc.com/english/news/3210)). That is the largest foreign direct investment in US history, and it still does not move a gigafab.

Allocation matters as much as capacity. TSMC does not auction capacity; it books it years ahead against prepayments, so the queue for a node is set before the node exists. The binding constraint is usually packaging, not wafers. See Advanced packaging.

## Who makes it

Intel is now partly state-owned. In August 2025 Washington bought 433.3 million newly issued Intel shares at $20.47 for $8.9 billion, a 9.9 percent stake funded from $5.7 billion of unpaid CHIPS Act grants and $3.2 billion from the Secure Enclave programme. The stake is passive and came with a five-year warrant for a further 5 percent, exercisable only if Intel ceases to own 51 percent of the foundry business ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Washington bought an option on Intel not spinning off its fabs.

Intel's technical position improved in 2026. It reached high-volume manufacturing on part of Panther Lake using ASML's High-NA EUV, the first company to do so, and put 18A-P into risk production ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)). The commercial position has not caught up: 14A depends on winning external customers first.

Samsung's swing factor is Taylor, Texas: a committed minimum of $17 billion, $6 billion of buildings and $11 billion of equipment, for leading-edge and mature logic ([source](https://semiconductor.samsung.com/sas/company/taylor/)).

## The chokepoint

SEMI forecast China at 10.1 million wafers a month in 2025, the most of any region, against Taiwan's 5.8 million out of a world total of 33.7 million ([source](https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports)). Almost none of China's is advanced. Below 10 nm the United States had almost no share in 2022 and is projected to reach 28 percent by 2032, on $2.3 trillion of new fab investment ([source](https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain)). Until then, the leading edge is Taiwan.

{{figure:capacity-by-region}}

That stacks three risks on one island. We think the first two are manageable and the third is not:

- **Seismic.** Taiwan sits on an active plate boundary, and a tool knocked out of calibration scraps the work in progress across a whole fab.
- **Power.** A gigafab is a large industrial load on a small island grid. We think grid margin, not silicon, sets how fast Taiwan can add fabs.
- **Political.** A blockade or conflict would remove most sub-5 nm capacity from the world market at once, with no substitute available inside a decade. See Geopolitics.

Diversification is real and slow. The hard part of a fab is a workforce that has run one process for years, and TSMC has yet to build a gigafab anywhere but Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)).

## Key evaluation criteria

- **Leading-edge share** — TSMC's 77 percent of wafer revenue from 7 nm and below is why it can self-fund the next node ([source](https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm)).
- **Yield at ramp** — the difference between a profitable node and a subsidised one. Intel Foundry's loss is a yield story, not a demand story.
- **Ten-year cost of ownership** — $35 to $43 billion for a fab finished in 2026, and rising ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)).
- **Utilisation** — SMIC's 93.5 percent shows what a captive home market does for loading, and not for margins ([source](https://www.smics.com/en/site/news_read/7951)).
- **Customer concentration** — an IDM-owned foundry competes with its customers, which caps who trusts it with a flagship design.
- **Geographic exposure** — how much of a buyer's supply sits on one island, one grid, one fault system.

## Takeaways

The foundry model won because leading-edge fabs are too expensive for one design house, and it concentrated because only the leader earns enough to build the next node. TSMC's six gigafabs hold 13 of the 17 million wafers a year it can make, and all six are in Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)). Intel and Samsung are credible technically and unproven commercially, and Intel is now part-owned by its government ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Diversification costs $165 billion and a decade in the American case alone ([source](https://pr.tsmc.com/english/news/3210)), which makes the concentration in Taiwan a fact about the 2020s and 2030s rather than a problem being solved.
