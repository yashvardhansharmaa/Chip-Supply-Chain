---json
{
  "id": "silicon-and-wafers",
  "number": 3,
  "title": "Silicon and Wafers",
  "oneLiner": "China makes almost all of the world's polysilicon and almost none of the wafers that matter. Five firms in Japan, Taiwan, Germany and South Korea hold the 300 mm substrate every AI accelerator starts on.",
  "plain": "Sand is melted and then pulled slowly out of the melt like a candle being dipped, except what comes out is a single crystal, one cylinder in which every atom sits on the same repeating grid. That cylinder is sliced into discs 300 millimetres across and polished until nothing on the surface stands more than a few atoms proud. The silicon has to be pure to about one foreign atom in a hundred billion, and the flatness has to hold right to the edge. Only five firms can do it reliably, and none of them is American or Chinese.",
  "specimen": "boule-and-wafer",
  "specimenCaption": "Right: a Czochralski ingot and a 300 mm wafer. Seed crystal and narrow neck at the top, the shoulder where the crystal opens out to full diameter, the cylindrical body, and a polished wafer sliced from that body.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Shin-Etsu Handotai", "country": "JP", "share": "Largest supplier; parent's Electronics Materials segment sold ¥750.3bn Apr-Dec 2025"},
      {"name": "SUMCO", "country": "JP", "share": "Second largest; shelved two planned Japanese fabs in 2026 to upgrade existing lines"},
      {"name": "GlobalWafers", "country": "TW", "share": "NT$60.6bn revenue in 2025"},
      {"name": "SK Siltron", "country": "KR", "share": "Third largest in 300 mm; ₩2tn revenue in 2025"},
      {"name": "Siltronic", "country": "DE", "share": "€1,346.7m revenue in 2025"}
    ],
    "countries": [
      {"code": "JP", "note": "Shin-Etsu and SUMCO crystal growth and polishing"},
      {"code": "TW", "note": "GlobalWafers headquarters and plants"},
      {"code": "DE", "note": "Siltronic Burghausen and Freiberg; Wacker semiconductor-grade polysilicon"},
      {"code": "KR", "note": "SK Siltron, being sold to Doosan"},
      {"code": "US", "note": "Hemlock polysilicon in Michigan; GlobalWafers Sherman, Texas and St Peters, Missouri"}
    ],
    "chinaStatus": "Dominates solar-grade polysilicon with 93.5% of 2024 global output, but held under 1% of the 300 mm wafer market as of 2021. NSIG and its Zing subsidiary are ramping hard: 300 mm shipments rose more than 90% in the first half of 2026.",
    "usStatus": "No US-headquartered volume wafer maker. Hemlock supplies polysilicon from Michigan; GlobalWafers took a $406m CHIPS award for a $3.5bn Texas plant that opened in May 2025.",
    "costSignal": "The entire world market was $11.4bn of wafer revenue on 12,973 million square inches shipped in 2025",
    "substitution": {"years": "5-10", "why": "Crystal pulling and final polish rest on tacit process know-how, and every wafer line has to be re-qualified per device per fab before a single production wafer ships."}
  },
  "keyFacts": [
    {"fact": "Worldwide silicon wafer shipments rose 5.8% to 12,973 million square inches in 2025 while revenue fell 1.2% to $11.4 billion", "source": "https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html"},
    {"fact": "Five companies, including SK Siltron, account for more than 90% of the global silicon wafer market", "source": "https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658"},
    {"fact": "300 mm wafers are used for 99.7% of world fab capacity capable of manufacturing chips at 45 nm and below (as of 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
    {"fact": "China produced 93.5% of global polysilicon output in 2024, and nine of the ten largest makers are Chinese", "source": "https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/"},
    {"fact": "Wacker, the only non-Chinese firm in the polysilicon top ten, is the largest producer of semiconductor-grade polysilicon at roughly 80,000 metric tons of capacity", "source": "https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/"},
    {"fact": "SUMCO shelved two planned wafer fabs at Imari and Yoshinogari, a ¥225bn project, after its state subsidy was cut from ¥75bn to ¥19.3bn", "source": "https://www.trendforce.com/news/2026/04/06/news-sumco-delays-construction-of-two-silicon-wafer-fabs-amid-market-shift/"},
    {"fact": "Siltronic booked a €77.9m net loss in 2025 on €1,346.7m of sales, with capex of €369.1m concentrated on its Singapore fab", "source": "https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html"},
    {"fact": "Doosan agreed to buy 70.6% of SK Siltron for ₩2.3 trillion ($1.6bn); SK Siltron had ₩2tn of 2025 revenue", "source": "https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658"}
  ],
  "figures": [
    {
      "id": "wafer-concentration",
      "type": "stack",
      "title": "Share of the global silicon wafer market, 2025. The five largest makers hold more than 90%",
      "unit": "%",
      "data": [["Shin-Etsu, SUMCO, GlobalWafers, Siltronic, SK Siltron", 90], ["Everyone else", 10]],
      "source": {"label": "Korea JoongAng Daily, Doosan-SK Siltron deal, 2026", "url": "https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658"}
    },
    {
      "id": "polysilicon-capacity",
      "type": "bars",
      "title": "Polysilicon capacity by manufacturer, end of 2024",
      "unit": "thousand metric tons",
      "data": [["Tongwei (CN)", 910], ["GCL Technology (CN)", 480], ["Daqo (CN)", 350], ["Xinte Energy (CN)", 300], ["Wacker (DE)", 80], ["Xinjiang Goens (CN)", 65], ["Hongyuan (CN)", 60]],
      "source": {"label": "Bernreuter Research ranking via pv magazine", "url": "https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/"}
    }
  ]
}
---
# Silicon and Wafers

Every AI accelerator begins as a disc of silicon so pure and so flat that the industry treats it as a solved problem, then pays five companies to keep solving it. The market is small: $11.4 billion of revenue on 12,973 million square inches in 2025 ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). That is under a quarter of Nvidia's data-center revenue, and it sits beneath all of it.

## How it works

Sand is melted and then pulled slowly out of the melt like a candle being dipped, except what comes out is a single crystal, one cylinder in which every atom sits on the same repeating grid. That cylinder is sliced into discs 300 millimetres across and polished until nothing on the surface stands more than a few atoms proud. The silicon has to be pure to about one foreign atom in a hundred billion, and the flatness has to hold right to the edge. Only five firms can do it reliably, and none of them is American or Chinese.

Silicon starts as quartzite reduced with carbon in an arc furnace, then turned into trichlorosilane gas, distilled and decomposed onto heated filaments in a bell jar. That Siemens process grows the grey polysilicon rods everything downstream is made from. Solar cells tolerate nine nines of purity; electronics demand eleven ([source](https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/)). Those two orders of magnitude separate a commodity from a chokepoint.

The polysilicon is melted at about 1,420 degrees Celsius and pulled into a single crystal by the Czochralski method, starting with a thin neck that starves out dislocations at the seed. Boron or phosphorus in the melt sets resistivity and conductivity type. Wafering is subtraction: the ingot is sliced with a wire saw, lapped, etched and mirror-polished with colloidal silica, and epitaxial wafers get a further layer of near-perfect silicon grown on at about 1,200 degrees Celsius ([source](https://www.sumcosi.com/english/products/process/)). Almost every step throws material away.

## Variants and trade-offs

### Prime versus epitaxial

A prime wafer is a uniformly doped, front-polished single crystal: cheapest, and adequate for most memory and mature logic. An epitaxial wafer adds a thin, lightly doped, defect-controlled layer on top, and the transistors live in that layer, so its quality sets the floor on leakage and latch-up. SEMI credits the 2025 shipment increase to AI demand for advanced epi and high-bandwidth memory ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). Epi costs more, and it is where the leaders' margins live.

### Silicon on insulator

A buried oxide separates a thin device layer from the bulk, and Soitec's Smart Cut process makes nearly all of it ([source](https://www.soitec.com/home/group)). SOI matters for RF and low-power logic, not for AI GPUs, which run on bulk epi.

## Who makes it

Five firms hold more than 90 percent of the global wafer market: Shin-Etsu, SUMCO, GlobalWafers, Siltronic and SK Siltron ([source](https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658)).

{{figure:wafer-concentration}}

Their 2025 results split the field: an AI boom, a mature-node hangover.

- **Shin-Etsu.** Electronics Materials sold ¥750.3 billion in the nine months to December 2025, on strong AI-related wafer demand ([source](https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260127_con_E.pdf)).
- **SUMCO.** Shelved a ¥225 billion plan for two new fabs, upgrading existing lines instead, after its state subsidy fell from ¥75 billion to ¥19.3 billion ([source](https://www.trendforce.com/news/2026/04/06/news-sumco-delays-construction-of-two-silicon-wafer-fabs-amid-market-shift/)).
- **Siltronic.** Lost €77.9 million on €1,346.7 million of sales while spending €369.1 million on its Singapore fab ([source](https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html)).
- **GlobalWafers.** NT$60.6 billion of revenue, down 3.24 percent in local currency ([source](https://www.sas-globalwafers.com/en/gwc_news_en_20260303/)).

Price explains the gap between volume and profit: area shipped rose 5.8 percent in 2025 while revenue fell 1.2 percent ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). Wafers sell on multi-year agreements that fix price and volume years ahead, so a demand spike never reaches the invoice.

Feedstock is a separate map. China produced 93.5 percent of the world's polysilicon in 2024, and nine of the ten largest producers are Chinese, on a Bernreuter ranking reported in the trade press. That dominance is in solar-grade material: the one non-Chinese firm in the top ten, Wacker, ranks eighth by volume and makes more semiconductor-grade polysilicon than anyone ([source](https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/)).

{{figure:polysilicon-capacity}}

Crystal growth and polishing sit in Japan, Taiwan, Germany and South Korea, with no major US-headquartered producer as of 2021 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). GlobalWafers opened a $3.5 billion plant in Sherman, Texas in May 2025 on a $406 million CHIPS award ([source](https://www.manufacturingdive.com/news/globalwafers-to-spend-additional-4-billion-us-operations-sherman-texas/748338/)), and Doosan agreed to buy 70.6 percent of SK Siltron for ₩2.3 trillion, about $1.6 billion ([source](https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658)).

## The chokepoint

China is the world's polysilicon superpower and a rounding error in the product that matters. As of 2021 Chinese firms held under 5 percent of the wafer market and under 1 percent of 300 mm ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The gap is closing from a low base: National Silicon Industry Group, whose Zing subsidiary was China's first industrialised 300 mm maker, grew 300 mm shipments more than 90 percent in the first half of 2026, per the trade press ([source](https://www.digitimes.com/news/a20260820VL212/nsig-300mm-capacity-silicon-wafer-silicon.html)).

The barrier is not a machine you cannot buy. Advanced-node 300 mm wafers rest on tacit know-how, and 300 mm carried 99.7 percent of world fab capacity at 45 nm and below as of 2021 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). A new source must be proved out per device and per fab, which takes quarters, while incumbent contracts run years.

The industry's own failed attempt to change the substrate proves that inertia. The Global 450 Consortium put Intel, TSMC, Samsung, IBM and GlobalFoundries behind 450 mm wafers, and on one trade account TSMC scoped a single new fab at $8 billion to $10 billion. It collapsed by 2017, and every leading-edge chip is still made on 300 mm ([source](https://www.theregister.com/2022/08/08/how_tsmc_killed_450mm_wafers/)).

What an AI accelerator asks of its wafer is narrow and unforgiving. One killer defect ruins far more silicon on a reticle-limited GPU die than on a small one, and EUV's shallow depth of focus (see Lithography) means flatness must hold across the whole disc, not on average. Both are why the qualified supplier list is five names long.

## Key evaluation criteria

- **Purity** in nines. Eleven-nines electronic grade against nine-nines solar grade is the line between a Chinese commodity market and a German, Japanese and Korean one ([source](https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/)).
- **Defect density** in the epi layer. Large AI dies punish defects superlinearly, which is why AI demand shows up first in advanced epi ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)).
- **Flatness and nanotopography**, because EUV exposure has almost no depth of focus to spare across a 300 mm field.
- **Diameter**, where 300 mm carries every leading-edge node and 99.7 percent of capacity at 45 nm and below ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Contract structure**, since long-term agreements set price and volume years ahead and blunt a demand spike.

## Takeaways

The wafer is the cheapest critical input in the AI chain and among the most concentrated: five firms, more than 90 percent of the market, $11.4 billion of revenue gating trillions of downstream value ([source](https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658)) ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). China's polysilicon dominance is real but in the wrong grade, and its 300 mm position is small and growing fast, not large. Watch epitaxial mix, not square inches: that is where AI demand lands and where the incumbents make money. And the 450 mm failure showed that this layer changes on decade timescales, not product cycles.
