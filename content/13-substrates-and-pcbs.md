---json
{
  "id": "substrates-and-pcbs",
  "number": 13,
  "title": "Substrates and PCBs",
  "oneLiner": "A Japanese food company makes about 95% of the insulating film inside every AI accelerator, and a Japanese textile company makes about 90% of the glass cloth under it.",
  "plain": "A chip's connections come out finer than a human hair. The board underneath works in millimetres. The package substrate is the adapter in between, built like plywood: a stiff core of glass cloth and resin, with thin sheets of epoxy film laminated onto both faces, holes burned through each sheet by laser, and copper plated into the holes. Add a layer and you add another chance for a hole to open. The film and the glass cloth each come from a single Japanese supplier, which is why a shortage here stops accelerators shipping.",
  "specimen": "substrate-layers",
  "specimenCaption": "Right: an ABF build-up substrate pulled apart. A glass-cloth-reinforced core in the middle, laser-drilled microvias and plated copper in the build-up layers above and below, micro-bump pads on top, BGA balls underneath.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "Ajinomoto", "country": "JP", "share": ">95% of ABF build-up film (2025)"},
      {"name": "Nitto Boseki", "country": "JP", "share": "~90% of T-glass cloth (2025)"},
      {"name": "Ibiden", "country": "JP", "share": "~85% of AI-server build-up substrate (2023)"},
      {"name": "Unimicron", "country": "TW", "share": "~10% of AI-server build-up substrate (2023)"},
      {"name": "Samsung Electro-Mechanics", "country": "KR", "share": "Supplies Nvidia, Google and Amazon parts"}
    ],
    "countries": [
      {"code": "JP", "note": "ABF film, T-glass cloth, Ibiden and Shinko substrate plants in Gifu and Nagano"},
      {"code": "TW", "note": "Unimicron, Nan Ya PCB, Kinsus; the largest merchant substrate cluster"},
      {"code": "KR", "note": "Samsung Electro-Mechanics, LG Innotek, Absolics glass core"},
      {"code": "CN", "note": "About half of world PCB output by value; new T-glass and high-layer-count board capacity"},
      {"code": "AT", "note": "AT&S, the only European advanced substrate maker of scale"}
    ],
    "chinaStatus": "China makes roughly half of the world's PCBs by value and is now the fastest-growing supplier of AI server boards, but it has almost no share of high-end ABF substrate. Domestic firms are spending heavily to break into T-glass and build-up substrate.",
    "usStatus": "No US merchant ABF substrate maker of scale. TTM Technologies is the main US-listed PCB maker. SKC's Absolics glass-core plant in Covington, Georgia is the main US position in next-generation substrates.",
    "costSignal": "Ibiden alone is spending about JPY 500 billion, roughly US$3.3 billion, on substrate capacity across fiscal 2026 to 2028",
    "substitution": {"years": "5-7", "why": "A new build-up film or core laminate has to be requalified layer by layer at every substrate maker and every packaging house, and Ajinomoto's film has been the reference material since 1999."}
  },
  "keyFacts": [
    {"fact": "Ajinomoto holds more than 95% of the global market for ABF build-up film used in GPU and CPU substrates", "source": "https://www.trendforce.com/news/2025/04/01/news-japanese-firm-ajinomoto-to-invest-jpy-25-billion-by-2030-to-expand-abf-production-for-advanced-packaging/"},
    {"fact": "Ajinomoto's electronic materials unit earned JPY 54.6 billion of operating profit on JPY 100.7 billion of sales in the year to March 2026, a margin above 50%", "source": "https://www.trendforce.com/news/2026/05/08/news-ajinomoto-ramps-chip-packaging-push-with-%c2%a51-2b-land-buy-for-new-plant-in-2032-abf-margins-top-50-on-ai-boom/"},
    {"fact": "Nitto Boseki holds about 90% of the T-glass cloth market and 60-70% of NER-glass", "source": "https://insights.trendforce.com/p/glass-fiber-cloth-shortage"},
    {"fact": "Nittobo is spending JPY 80 billion to triple T-glass capacity from fiscal 2026 levels by March 2029", "source": "https://www.trendforce.com/news/2026/08/06/news-nittobo-raises-fy2027-net-profit-forecast-by-jpy-3b-no-further-t-glass-price-hikes-planned/"},
    {"fact": "The organic advanced IC substrate market was US$14.2 billion in 2024, with Unimicron, Ibiden, Shinko, Samsung Electro-Mechanics and AT&S the dominant suppliers", "source": "https://www.yolegroup.com/press-release/pushed-by-glass-core-and-high-end-ics-substrates-for-ai-the-advanced-ic-substrate-market-reaches-31-billion-by-2030/"},
    {"fact": "Ibiden will invest about JPY 500 billion from fiscal 2026 to fiscal 2028 in high-performance IC package substrates", "source": "https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html"},
    {"fact": "Unimicron's 2026 capital budget is NT$53.7 billion, with 80-85% going to ABF substrates", "source": "https://www.trendforce.com/news/2026/08/27/news-samsung-electro-mechanics-lg-innotek-ramp-up-ai-substrate-capacity-as-1h-utilization-reportedly-nears-90/"},
    {"fact": "China accounts for roughly 53% of global PCB production by value and Taiwan about 14% (as of 2022)", "source": "https://www.prismark.com/post/supply-chain-regionalization-update-pcb-manufacturing-in-thailand"}
  ],
  "figures": [
    {
      "id": "abf-share",
      "type": "stack",
      "title": "Build-up insulating film for high-performance IC substrates, 2025",
      "unit": "%",
      "data": [["Ajinomoto ABF", 95], ["All other films", 5]],
      "source": {"label": "TrendForce, citing Ajinomoto (the residual is the arithmetic remainder)", "url": "https://www.trendforce.com/news/2025/04/01/news-japanese-firm-ajinomoto-to-invest-jpy-25-billion-by-2030-to-expand-abf-production-for-advanced-packaging/"}
    },
    {
      "id": "substrate-share",
      "type": "bars",
      "title": "Share of AI-server build-up substrate supply, 2023 actual and 2026 forecast",
      "unit": "%",
      "data": [["Ibiden, 2023", 85], ["Unimicron, 2023", 10], ["Ibiden, 2026 forecast", 55]],
      "source": {"label": "SemiVision analysis of TPCA and company data", "url": "https://tspasemiconductor.substack.com/p/ai-server-build-up-substrate-industry"}
    }
  ]
}
---
# Substrates and PCBs

The interposer in Advanced packaging carries signals a few millimetres. Everything after it is organic chemistry: an epoxy build-up substrate, then a printed circuit board with thirty layers, then a rack. In August 2026 TSMC named memory and ABF substrates as the two things holding back AI supply ([source](https://www.trendforce.com/news/2026/08/11/news-tsmcs-5-5-reticle-cowos-reportedly-tops-99-yield-flags-memory-abf-as-ai-bottlenecks/)).

## How it works

A chip's connections come out finer than a human hair. The board underneath works in millimetres. The package substrate is the adapter in between, built like plywood: a stiff core of glass cloth and resin, with thin sheets of epoxy film laminated onto both faces, holes burned through each sheet by laser, and copper plated into the holes. Add a layer and you add another chance for a hole to open. The film and the glass cloth each come from a single Japanese supplier, which is why a shortage here stops accelerators shipping.

The core is epoxy resin reinforced with woven glass cloth, drilled through and plated with copper. Build-up layers go onto both faces one at a time: laminate a thin film of epoxy, burn microvias through it with a laser, plate copper into the vias, pattern the traces, repeat. Each film layer is about 10 micrometres thick ([source](https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience)).

The hard part is that silicon and epoxy expand at different rates when heated, and warpage grows with area. The fix is a core that barely moves: low-expansion glass cloth, more layers to carry the current, tighter control of the resin. Unimicron's chairman named that combination in September 2026, larger substrates with higher layer counts and lower expansion all at once ([source](https://www.trendforce.com/news/2026/09/03/news-tsmc-equipment-demand-reportedly-jumps-90-in-just-over-half-a-year-substrate-capacity-faces-ai-squeeze/)).

## Variants and trade-offs

### BT substrates

Bismaleimide-triazine laminate is the cheaper, older family. It dominates by unit volume and suits memory stacks and mobile parts, but it cannot hold the line width or the flatness a reticle-sized logic die needs.

### ABF build-up substrates

It sits under every high-end CPU, GPU and AI accelerator. Ajinomoto Build-up Film was first adopted by a major chipmaker in 1999 and has been the default insulator ever since ([source](https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience)). Every added layer is another lamination, drill, plate and pattern loop, and yield compounds down the stack.

### Glass core substrates

Replace the resin core with glass and the expansion problem mostly goes away, which is why everyone is trying.

- **Shinko** has demonstrated a 22-layer glass substrate with 11 copper wiring layers on each side ([source](https://www.trendforce.com/news/2026/08/18/news-glass-substrate-war-heats-up-shinko-electric-advances-22-layer-product-as-samsung-reportedly-faces-ramp-up-uncertainty/)).
- **Dai Nippon Printing** opened a through-glass-via pilot line in Saitama in December 2025 and targets mass production in 2028 ([source](https://www.trendforce.com/news/2026/08/18/news-glass-substrate-war-heats-up-shinko-electric-advances-22-layer-product-as-samsung-reportedly-faces-ramp-up-uncertainty/)).
- **Samsung Electro-Mechanics** is aiming at glass core material in the second half of 2027 and finished substrates in 2028 ([source](https://www.trendforce.com/news/2026/02/03/news-samsung-reportedly-shifts-glass-substrate-project-to-business-unit-eyes-2027-ramp-up/)).

Yole still forecasts the glass core market at only a few hundred million dollars by 2030 ([source](https://www.yolegroup.com/press-release/pushed-by-glass-core-and-high-end-ics-substrates-for-ai-the-advanced-ic-substrate-market-reaches-31-billion-by-2030/)). Glass is the answer to the next problem, not this one.

{{figure:abf-share}}

## The materials underneath

Ajinomoto holds more than 95% of the global market for the ABF materials used in GPU and CPU substrates ([source](https://www.trendforce.com/news/2025/04/01/news-japanese-firm-ajinomoto-to-invest-jpy-25-billion-by-2030-to-expand-abf-production-for-advanced-packaging/)). In the year to March 2026 its electronic materials unit turned JPY 100.7 billion of sales into JPY 54.6 billion of operating profit, a margin above 50% ([source](https://www.trendforce.com/news/2026/05/08/news-ajinomoto-ramps-chip-packaging-push-with-%c2%a51-2b-land-buy-for-new-plant-in-2032-abf-margins-top-50-on-ai-boom/)). It is expanding slowly: JPY 25 billion to lift output 50% by 2030, and a third plant that will not operate until 2032 ([source](https://www.trendforce.com/news/2025/04/01/news-japanese-firm-ajinomoto-to-invest-jpy-25-billion-by-2030-to-expand-abf-production-for-advanced-packaging/)) ([source](https://www.trendforce.com/news/2026/05/08/news-ajinomoto-ramps-chip-packaging-push-with-%c2%a51-2b-land-buy-for-new-plant-in-2032-abf-margins-top-50-on-ai-boom/)).

The core laminate has the same problem one level down. Low-expansion T-glass cloth is made almost entirely by Nitto Boseki, which holds about 90% of T-glass and 60 to 70% of NER-glass, and the constraint is not expected to ease until mid-2027 ([source](https://insights.trendforce.com/p/glass-fiber-cloth-shortage)). Nittobo is spending JPY 80 billion, about US$550 million, to triple T-glass capacity by March 2029, and Nvidia, Microsoft, Google, Amazon and Apple have reportedly booked it ([source](https://www.trendforce.com/news/2026/08/06/news-nittobo-raises-fy2027-net-profit-forecast-by-jpy-3b-no-further-t-glass-price-hikes-planned/)). Demand ran ahead because 2026 substrates are larger and thicker in the core, roughly doubling glass cloth content per unit ([source](https://www.trendforce.com/news/2025/11/24/news-what-is-glass-fiber-fabric-and-why-is-t-glass-critical-for-ai-servers-a-deep-dive/)).

China is attacking this layer directly. Guangyuan New Material is building a US$1 billion T-glass plant in Henan, and Shengyi Technology is spending RMB 5.2 billion in Guangdong and RMB 1.4 billion in Thailand ([source](https://www.trendforce.com/news/2026/07/03/news-chinas-chip-material-suppliers-challenge-japanese-dominance-guangyuan-invests-us1b-in-t-glass/)).

## Who makes it

The organic advanced IC substrate market was US$14.2 billion in 2024, and Yole names Unimicron, Ibiden, Shinko, Samsung Electro-Mechanics and AT&S as the dominant suppliers ([source](https://www.yolegroup.com/press-release/pushed-by-glass-core-and-high-end-ics-substrates-for-ai-the-advanced-ic-substrate-market-reaches-31-billion-by-2030/)). The AI-server slice is far more concentrated: one analysis of TPCA and company data puts Ibiden at about 85% of AI-server build-up substrate in 2023 with Unimicron at 10%, and expects Ibiden to fall to roughly 55% by 2026 as others qualify ([source](https://tspasemiconductor.substack.com/p/ai-server-build-up-substrate-industry)).

Everyone is building.

- **Ibiden** will invest about JPY 500 billion, roughly US$3.3 billion, from fiscal 2026 to fiscal 2028, taking capacity to 2.5 times current levels ([source](https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html)) ([source](https://www.digitimes.com/news/a20260204PD227/ibiden-expansion-capacity-production-plant.html)) ([source](https://www.trendforce.com/news/2026/08/27/news-samsung-electro-mechanics-lg-innotek-ramp-up-ai-substrate-capacity-as-1h-utilization-reportedly-nears-90/)).
- **Unimicron** has a 2026 capital budget of NT$53.7 billion, 80 to 85% of it aimed at ABF ([source](https://www.trendforce.com/news/2026/08/27/news-samsung-electro-mechanics-lg-innotek-ramp-up-ai-substrate-capacity-as-1h-utilization-reportedly-nears-90/)).
- **Samsung Electro-Mechanics and LG Innotek** ran substrate lines at 89% and 94% utilisation in the first half of 2026, with Samsung's packaging solutions sales up 41% to KRW 1.497 trillion ([source](https://www.trendforce.com/news/2026/08/27/news-samsung-electro-mechanics-lg-innotek-ramp-up-ai-substrate-capacity-as-1h-utilization-reportedly-nears-90/)).

Shinko changed hands: Fujitsu sold its 50.02% stake to a vehicle of the state-backed Japan Investment Corporation, with Mitsui Chemicals and Dai Nippon Printing as co-investors, and the company was delisted in June 2025 ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20250217_JIC_JICC_PressRelease.pdf)) ([source](https://www.digitimes.com/news/a20250321PD206/shinko-electric-mitsui-chemicals-materials-partnership-fujitsu.html)). Supply is tight enough that Intel has asked EMIB customers to prepay for substrate capacity ([source](https://www.trendforce.com/news/2026/05/20/news-intel-says-emib-customers-back-substrate-prepayments-4-taiwan-and-2-japan-suppliers-reportedly-seek-commitments/)).

{{figure:substrate-share}}

## The boards under the GPU

A traditional server board runs 14 to 24 layers; an AI server board runs 20 to more than 30 ([source](https://www.trendforce.com/news/2026/07/09/news-chinas-pcb-makers-boost-investment-to-record-highs-on-ai-demand-victory-giant-lifts-1q26-capex-nearly-5x-yoy/)). Those extra layers carry hundreds of amps to the GPUs and route NVLink fast enough that the laminate's dielectric constant becomes a first-order design variable.

China dominates this layer: roughly 53% of global PCB production by value against Taiwan's 14% as of 2022 ([source](https://www.prismark.com/post/supply-chain-regionalization-update-pcb-manufacturing-in-thailand)). Its board makers are spending accordingly.

- **Victory Giant** lifted first-quarter 2026 capital spending to RMB 3.6 billion, about US$530 million, from RMB 730.1 million a year earlier ([source](https://www.trendforce.com/news/2026/07/09/news-chinas-pcb-makers-boost-investment-to-record-highs-on-ai-demand-victory-giant-lifts-1q26-capex-nearly-5x-yoy/)).
- **WUS** more than doubled its spending to RMB 1.5 billion ([source](https://www.trendforce.com/news/2026/07/09/news-chinas-pcb-makers-boost-investment-to-record-highs-on-ai-demand-victory-giant-lifts-1q26-capex-nearly-5x-yoy/)).
- **Shennan Circuits** is raising up to RMB 4.88 billion ([source](https://www.trendforce.com/news/2026/07/09/news-chinas-pcb-makers-boost-investment-to-record-highs-on-ai-demand-victory-giant-lifts-1q26-capex-nearly-5x-yoy/)).

The hedge is Southeast Asia: WUS built a US$280 million plant in Thailand, and 16 of the world's top 100 PCB suppliers now manufacture there ([source](https://www.prismark.com/post/supply-chain-regionalization-update-pcb-manufacturing-in-thailand)). Among non-Chinese makers, TTM Technologies took US$2.91 billion of revenue in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001116942/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)).

## The chokepoint

The substrate fabs are an oligopoly, and oligopolies can be expanded with money. The real single points of failure are one layer down: one company's film and one company's glass cloth, both Japanese, both running flat out, both adding capacity on construction schedules measured in years while AI demand compounds quarterly. A new film or laminate has to be requalified layer by layer at every substrate maker and every packaging house, which is why Ajinomoto's 1999 product still has the market.

What breaks first as packages grow is flatness. TSMC is pushing panel formats of 310 by 310 millimetres, with 510 by 515 and 600 by 600 under standardisation ([source](https://www.trendforce.com/news/2026/05/19/news-equipment-maker-schmid-flags-tsmc-panel-level-packaging-push-310x310mm-progress-glass-integration-under-review/)). Bigger bodies mean more warpage, more layers, more chances for a via to open, and lower yield on a part that already costs hundreds of dollars before a die touches it.

## Key evaluation criteria

- **Layer count** sets how much current and how many signals the substrate can carry. Each added build-up layer multiplies the yield risk.
- **Body size** drives everything else. Once a body is much larger than the dies it carries, warpage and handling, not wiring, set the process window.
- **Coefficient of thermal expansion** must be close enough to silicon that the package survives thermal cycling, which is what T-glass buys and why its supply matters.
- **Dielectric properties** of the core laminate set achievable signal rates on both the substrate and the board underneath.
- **Qualification time** is the commercial moat. Second-sourcing a film or a laminate takes years, not quarters.

## Takeaways

The substrate is the least glamorous and most binding part of an AI package. TSMC now names it alongside memory as a limit on supply ([source](https://www.trendforce.com/news/2026/08/11/news-tsmcs-5-5-reticle-cowos-reportedly-tops-99-yield-flags-memory-abf-as-ai-bottlenecks/)), and the two materials that make it possible come from single Japanese suppliers with roughly 95% and 90% shares ([source](https://www.trendforce.com/news/2025/04/01/news-japanese-firm-ajinomoto-to-invest-jpy-25-billion-by-2030-to-expand-abf-production-for-advanced-packaging/)) ([source](https://insights.trendforce.com/p/glass-fiber-cloth-shortage)). Substrate fabs in Japan, Taiwan and Korea are spending billions, but film and glass cloth expand on a slower clock than GPUs do. Glass cores fix the physics eventually; they do not fix 2027.
