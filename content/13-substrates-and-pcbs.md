---json
{
  "id": "substrates-and-pcbs",
  "number": 13,
  "title": "Substrates and PCBs",
  "oneLiner": "A Japanese food company makes about 95% of the insulating film inside every AI accelerator, and a Japanese textile company makes about 90% of the glass cloth under it.",
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
    "usStatus": "No US merchant ABF substrate maker of scale. TTM Technologies is the largest domestic PCB maker. SKC's Absolics glass-core plant in Covington, Georgia is the main US position in next-generation substrates.",
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
    {"fact": "China accounts for roughly 53% of global PCB production by value and Taiwan about 14%", "source": "https://www.prismark.com/post/supply-chain-regionalization-update-pcb-manufacturing-in-thailand"}
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

The interposer described in Advanced packaging carries signals a few millimetres. Everything after that is organic chemistry: an epoxy build-up substrate, then a printed circuit board with thirty layers, then a rack. In August 2026 TSMC named memory and ABF substrates as the two things holding back AI supply, and said it expects substrate supply to stay tight for years ([source](https://www.trendforce.com/news/2026/08/11/news-tsmcs-5-5-reticle-cowos-reportedly-tops-99-yield-flags-memory-abf-as-ai-bottlenecks/)).

## How it works

A GPU die talks to the outside world through micro-bumps spaced tens of micrometres apart. The motherboard underneath uses solder balls spaced closer to a millimetre. Something has to fan out between those two pitches, spread the power planes, and hold the whole assembly flat. That is the package substrate.

It is built like a very small, very precise circuit board. Start with a rigid core: epoxy resin reinforced with woven glass cloth, drilled through and plated with copper. Then add build-up layers to both faces, one at a time. Laminate a thin film of epoxy resin over the copper, burn microvias through it with a laser, plate copper into the vias and across the surface, pattern the traces, repeat. Each film layer is about 10 micrometres thick ([source](https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience)).

The hard part is that silicon and epoxy expand at different rates when heated. Warpage grows with area, so as AI packages get bigger the substrate fights back harder. The fix is a core that barely moves, which means low-expansion glass cloth, more layers to carry the current, and tighter control of the resin. Unimicron's chairman described exactly this combination in September 2026: larger substrates, higher layer counts, lower coefficients of thermal expansion, all at once ([source](https://www.trendforce.com/news/2026/09/03/news-tsmc-equipment-demand-reportedly-jumps-90-in-just-over-half-a-year-substrate-capacity-faces-ai-squeeze/)).

## Variants and trade-offs

### BT substrates

Bismaleimide-triazine laminate is the cheaper, older family. It is fine for memory stacks and mobile parts and it dominates by unit volume, but it cannot hold the line width or the flatness that a reticle-sized logic die needs.

### ABF build-up substrates

This is what sits under every high-end CPU, GPU and AI accelerator. Ajinomoto Build-up Film was first adopted by a major chipmaker in 1999 and has been the default insulator ever since ([source](https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience)). The trade-off is cost and cycle time. Every added layer is another lamination, laser-drill, plate and pattern loop, and yield compounds down the stack.

### Glass core substrates

Replace the resin core with glass and the expansion problem mostly goes away, which is why everyone is trying. Shinko has demonstrated a 22-layer glass substrate with 11 copper wiring layers on each side, Dai Nippon Printing opened a through-glass-via pilot line in Saitama in December 2025 and targets mass production in 2028, and Samsung Electro-Mechanics is aiming at glass core material in the second half of 2027 with finished substrates in 2028 ([source](https://www.trendforce.com/news/2026/08/18/news-glass-substrate-war-heats-up-shinko-electric-advances-22-layer-product-as-samsung-reportedly-faces-ramp-up-uncertainty/)). SKC's Absolics unit has been the closest to first commercial supply ([source](https://www.trendforce.com/news/2026/02/03/news-samsung-reportedly-shifts-glass-substrate-project-to-business-unit-eyes-2027-ramp-up/)). Yole still forecasts the glass core market at only a few hundred million dollars by 2030 ([source](https://www.yolegroup.com/press-release/pushed-by-glass-core-and-high-end-ics-substrates-for-ai-the-advanced-ic-substrate-market-reaches-31-billion-by-2030/)). Glass is the answer to the next problem, not this one.

{{figure:abf-share}}

## The materials underneath

Ajinomoto holds more than 95% of the global market for the ABF materials used in GPU and CPU substrates ([source](https://www.trendforce.com/news/2025/04/01/news-japanese-firm-ajinomoto-to-invest-jpy-25-billion-by-2030-to-expand-abf-production-for-advanced-packaging/)). In the year to March 2026 its electronic materials unit turned JPY 100.7 billion of sales into JPY 54.6 billion of operating profit, a margin above 50% ([source](https://www.trendforce.com/news/2026/05/08/news-ajinomoto-ramps-chip-packaging-push-with-%c2%a51-2b-land-buy-for-new-plant-in-2032-abf-margins-top-50-on-ai-boom/)). It is expanding, slowly: JPY 25 billion to lift output 50% by 2030, and a JPY 1.2 billion land purchase for a third plant that will not start construction until 2028 or operate until 2032 ([source](https://www.trendforce.com/news/2025/04/01/news-japanese-firm-ajinomoto-to-invest-jpy-25-billion-by-2030-to-expand-abf-production-for-advanced-packaging/)) ([source](https://www.trendforce.com/news/2026/05/08/news-ajinomoto-ramps-chip-packaging-push-with-%c2%a51-2b-land-buy-for-new-plant-in-2032-abf-margins-top-50-on-ai-boom/)).

The core laminate has the same shape of problem one level down. Low-expansion T-glass cloth is made almost entirely by Nitto Boseki, which holds about 90% of T-glass and 60-70% of NER-glass, and the constraint is not expected to ease until mid-2027 ([source](https://insights.trendforce.com/p/glass-fiber-cloth-shortage)). Nittobo is spending JPY 80 billion, about US$550 million, to triple T-glass capacity from fiscal 2026 levels by March 2029, and doubling its Taiwan capacity from 2025 levels by March 2028; Nvidia, Microsoft, Google, Amazon and Apple have reportedly booked capacity ([source](https://www.trendforce.com/news/2026/08/06/news-nittobo-raises-fy2027-net-profit-forecast-by-jpy-3b-no-further-t-glass-price-hikes-planned/)). Demand ran ahead of that because 2026 substrates are both larger and thicker in the core, which roughly doubles glass cloth content per unit ([source](https://www.trendforce.com/news/2025/11/24/news-what-is-glass-fiber-fabric-and-why-is-t-glass-critical-for-ai-servers-a-deep-dive/)).

China is attacking this layer directly. Guangyuan New Material is building a US$1 billion T-glass plant in Henan targeting a million metres a month, and Shengyi Technology is spending RMB 5.2 billion in Guangdong and RMB 1.4 billion in Thailand ([source](https://www.trendforce.com/news/2026/07/03/news-chinas-chip-material-suppliers-challenge-japanese-dominance-guangyuan-invests-us1b-in-t-glass/)).

## Who makes it

The organic advanced IC substrate market was US$14.2 billion in 2024, and Yole names Unimicron, Ibiden, Shinko, Samsung Electro-Mechanics and AT&S as the dominant suppliers ([source](https://www.yolegroup.com/press-release/pushed-by-glass-core-and-high-end-ics-substrates-for-ai-the-advanced-ic-substrate-market-reaches-31-billion-by-2030/)). Inside that, the AI-server slice is far more concentrated: one analysis of TPCA and company data puts Ibiden at about 85% of AI-server build-up substrate in 2023 with Unimicron at 10%, and expects Ibiden to fall to roughly 55% by 2026 as others qualify ([source](https://tspasemiconductor.substack.com/p/ai-server-build-up-substrate-industry)).

Everyone is building. Ibiden will invest about JPY 500 billion from fiscal 2026 to fiscal 2028, starting with JPY 220 billion at its Gama plant in Ogaki, with mass production from fiscal 2027 ([source](https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html)), which is about US$3.3 billion ([source](https://www.digitimes.com/news/a20260204PD227/ibiden-expansion-capacity-production-plant.html)) and is meant to take capacity to 2.5 times current levels by fiscal 2028 ([source](https://www.trendforce.com/news/2026/08/27/news-samsung-electro-mechanics-lg-innotek-ramp-up-ai-substrate-capacity-as-1h-utilization-reportedly-nears-90/)). Unimicron's 2026 capital budget is NT$53.7 billion with 80-85% aimed at ABF ([source](https://www.trendforce.com/news/2026/08/27/news-samsung-electro-mechanics-lg-innotek-ramp-up-ai-substrate-capacity-as-1h-utilization-reportedly-nears-90/)).

The Korean pair are the fastest movers. Samsung Electro-Mechanics ran its substrate lines at 89% utilisation in the first half of 2026 and LG Innotek at 94%, with Samsung's packaging solutions sales up 41% year on year to KRW 1.497 trillion; Samsung supplies Nvidia, Google and Amazon parts, while LG Innotek is in talks with Intel and Broadcom ([source](https://www.trendforce.com/news/2026/08/27/news-samsung-electro-mechanics-lg-innotek-ramp-up-ai-substrate-capacity-as-1h-utilization-reportedly-nears-90/)).

Shinko changed hands. Fujitsu, which held 50.02%, sold it through a tender offer by JICC-04, a vehicle of the state-backed Japan Investment Corporation, with Mitsui Chemicals and Dai Nippon Printing as co-investors ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20250217_JIC_JICC_PressRelease.pdf)); the company was delisted in mid-June 2025 and is looking at back-end materials tie-ups with those two shareholders ([source](https://www.digitimes.com/news/a20250321PD206/shinko-electric-mitsui-chemicals-materials-partnership-fujitsu.html)). Supply is tight enough that Intel has asked EMIB customers to prepay for substrate capacity, with four Taiwanese and two Japanese suppliers seeking commitments ([source](https://www.trendforce.com/news/2026/05/20/news-intel-says-emib-customers-back-substrate-prepayments-4-taiwan-and-2-japan-suppliers-reportedly-seek-commitments/)).

{{figure:substrate-share}}

## The boards under the GPU

Below the substrate is an ordinary-looking board doing an extraordinary job. A traditional server PCB runs 14 to 24 layers; an AI server board runs 20 to more than 30 ([source](https://www.trendforce.com/news/2026/07/09/news-chinas-pcb-makers-boost-investment-to-record-highs-on-ai-demand-victory-giant-lifts-1q26-capex-nearly-5x-yoy/)). Those extra layers carry hundreds of amps to the GPUs and route NVLink at rates that make the dielectric constant of the laminate a first-order design variable.

China dominates this layer. It accounts for roughly 53% of global PCB production by value against Taiwan's 14% ([source](https://www.prismark.com/post/supply-chain-regionalization-update-pcb-manufacturing-in-thailand)). Chinese board makers are spending accordingly: Victory Giant lifted first-quarter 2026 capital spending to RMB 3.6 billion, about US$530 million, from RMB 730.1 million a year earlier, WUS more than doubled to RMB 1.5 billion, and Shennan Circuits is raising up to RMB 4.88 billion ([source](https://www.trendforce.com/news/2026/07/09/news-chinas-pcb-makers-boost-investment-to-record-highs-on-ai-demand-victory-giant-lifts-1q26-capex-nearly-5x-yoy/)). Victory Giant raised HK$17.49 billion, about US$2.2 billion, in a Hong Kong listing ([source](https://www.scmp.com/tech/tech-trends/article/3349924/victory-giant-joins-ipo-push-chinas-circuit-board-makers-amid-ai-frenzy)) and is putting at least RMB 3 billion, about US$444 million, into a new plant on a 100,000 square metre site ([source](https://www.scmp.com/tech/article/3363178/unrelenting-ai-demand-spawns-new-plant-chinese-pcb-maker-victory-giant)).

The hedge is Southeast Asia. WUS built a US$280 million plant in Thailand, and 16 of the world's top 100 PCB suppliers now manufacture there ([source](https://www.prismark.com/post/supply-chain-regionalization-update-pcb-manufacturing-in-thailand)). Among non-Chinese makers, TTM Technologies is the largest US name, at US$2.91 billion of revenue in fiscal 2025 ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001116942/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)).

## The chokepoint

The substrate fabs are an oligopoly, and oligopolies can be expanded with money. The real single points of failure are one layer down: one company's film and one company's glass cloth, both Japanese, both running flat out, both adding capacity on three-to-five-year construction clocks while AI demand compounds quarterly. A new film or laminate has to be requalified layer by layer at every substrate maker and every packaging house, which is why Ajinomoto's 1999 product still has the market.

What breaks first as packages grow is flatness. TSMC is pushing panel formats of 310 by 310 millimetres with 510 by 515 and 600 by 600 under standardisation, and equipment is following: Disco's DFD6080 dicing saw handles workpieces up to 400 by 400 millimetres ([source](https://www.trendforce.com/news/2026/05/19/news-equipment-maker-schmid-flags-tsmc-panel-level-packaging-push-310x310mm-progress-glass-integration-under-review/)) ([source](https://www.disco.co.jp/eg/news/corp/20251215_1.html)). Bigger bodies mean more warpage, more layers, more chances for a via to open, and lower yield on a part that already costs hundreds of dollars before a die touches it.

## Key evaluation criteria

- **Layer count** determines how much current and how many signals the substrate can carry. AI substrates keep adding build-up layers, and each one multiplies the yield risk.
- **Body size** drives everything else. Past roughly 100 millimetres a side, warpage and handling dominate the process window.
- **Coefficient of thermal expansion** must be close enough to silicon that the package survives thermal cycling, which is what T-glass buys and why its supply matters.
- **Dielectric properties** of the core laminate set achievable signal rates on both the substrate and the board underneath.
- **Qualification time** is the commercial moat. Second-sourcing a film or a laminate takes years, not quarters.

## Takeaways

The substrate is the least glamorous and most binding part of an AI package. TSMC now names it alongside memory as a limit on supply, and the two materials that make it possible come from single Japanese suppliers with roughly 95% and 90% shares. Substrate fabs in Japan, Taiwan and Korea are spending billions to add capacity, but film and glass cloth expand on a slower clock than GPUs do. Glass cores fix the physics eventually; they do not fix 2027.
