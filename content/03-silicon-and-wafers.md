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
      {"name": "SUMCO", "country": "JP", "share": "¥409.7bn of 2025 net sales, but an ¥11.8bn loss"},
      {"name": "GlobalWafers", "country": "TW", "share": "NT$60.6bn revenue in 2025"},
      {"name": "SK Siltron", "country": "KR", "share": "One of the five firms behind the whole wafer market"},
      {"name": "Siltronic", "country": "DE", "share": "€1,346.7m revenue in 2025"}
    ],
    "countries": [
      {"code": "JP", "note": "Shin-Etsu and SUMCO crystal growth and polishing"},
      {"code": "TW", "note": "GlobalWafers headquarters and plants"},
      {"code": "DE", "note": "Siltronic Burghausen and Freiberg; Wacker semiconductor-grade polysilicon"},
      {"code": "KR", "note": "SK Siltron, being sold to Doosan"},
      {"code": "US", "note": "Hemlock polysilicon in Michigan; GlobalWafers Sherman, Texas and St Peters, Missouri"}
    ],
    "chinaStatus": "Made about 93% of the world's polysilicon in 2023, but 98% of that was solar-grade. Held under 1% of the 300 mm wafer market as of 2021, and supplies only 12% of the wafers its own 300 mm fabs consume.",
    "usStatus": "No US-headquartered volume wafer maker. Hemlock supplies polysilicon from Michigan; GlobalWafers took a CHIPS award of up to $406m for a $3.5bn Texas plant that opened in May 2025.",
    "costSignal": "The entire world market was $11.4bn of wafer revenue on 12,973 million square inches shipped in 2025",
    "substitution": {"years": "5-10", "why": "Crystal pulling and final polish rest on tacit process know-how, and every wafer line has to be re-qualified per device per fab before a single production wafer ships."}
  },
  "keyFacts": [
    {"fact": "Worldwide silicon wafer shipments rose 5.8% to 12,973 million square inches in 2025 while revenue fell 1.2% to $11.4 billion", "source": "https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html"},
    {"fact": "Five major suppliers stand behind the entire $11.4bn semiconductor silicon wafer market", "source": "https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf"},
    {"fact": "300 mm wafers are used for 99.7% of world fab capacity capable of manufacturing chips at 45 nm and below (as of 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
    {"fact": "China produced 1.50 Mt of polysilicon in 2023, about 93% of world output, of which 98% was solar-grade and 2% electronic-grade", "source": "https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf"},
    {"fact": "Silicon for electronic applications is a $1.4bn market with five major suppliers: Wacker, Hemlock, OCI, Tokuyama and Mitsubishi", "source": "https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf"},
    {"fact": "SUMCO's 2025 net sales were ¥409.7bn, but operating profit fell to ¥1.3bn from ¥36.9bn and it lost ¥11.8bn", "source": "https://www.sumcosi.com/english/pdf/ir/library/shareholders/27/pdf/nc_e_27.pdf"},
    {"fact": "Siltronic booked a €77.9m net loss in 2025 on €1,346.7m of sales, with capex of €369.1m concentrated on its Singapore fab", "source": "https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html"},
    {"fact": "Chinese producers supply 12% of the wafers consumed by China's own 300 mm fabs and 18% at 200 mm and below", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"}
  ],
  "figures": [
    {
      "id": "wafer-concentration",
      "type": "stack",
      "title": "Silicon wafer market by supplier headquarters. Five firms, four countries, no US producer",
      "unit": "%",
      "data": [["Japan", 56], ["Taiwan", 16], ["Europe", 14], ["South Korea", 10], ["China", 4], ["United States", 0]],
      "source": {"label": "CSET, The Semiconductor Supply Chain, January 2021", "url": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"}
    },
    {
      "id": "polysilicon-grade",
      "type": "stack",
      "title": "China's polysilicon output by grade, 2023. China made about 93% of the world's 1.5 Mt that year",
      "unit": "%",
      "data": [["Solar-grade", 98], ["Electronic-grade", 2]],
      "source": {"label": "USGS Minerals Yearbook, China, 2023", "url": "https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf"}
    }
  ]
}
---
# Silicon and Wafers

Every AI accelerator begins as a disc of silicon so pure and so flat that the industry treats it as a solved problem, then pays five companies to keep solving it. The market is small: $11.4 billion of revenue on 12,973 million square inches in 2025 ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). That is under a quarter of Nvidia's data-center revenue, and it sits beneath all of it.

## How it works

Sand is melted and then pulled slowly out of the melt like a candle being dipped, except what comes out is a single crystal, one cylinder in which every atom sits on the same repeating grid. That cylinder is sliced into discs 300 millimetres across and polished until nothing on the surface stands more than a few atoms proud. The silicon has to be pure to about one foreign atom in a hundred billion, and the flatness has to hold right to the edge. Only five firms can do it reliably, and none of them is American or Chinese.

Silicon starts as quartzite reduced with carbon in an arc furnace, then turned into trichlorosilane gas, distilled and decomposed onto heated filaments in a bell jar. That Siemens process grows the grey polysilicon rods everything downstream is made from. The same rods feed solar cells and chips, but not at the same grade: only the ultra-high-purity semiconductor grade is any use here ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf)). Solar and electronic polysilicon are separate industries with separate suppliers, and the distance between them separates a commodity from a chokepoint.

The polysilicon is melted at about 1,420 degrees Celsius and pulled into a single crystal by the Czochralski method, starting with a thin neck that starves out dislocations at the seed. Boron or phosphorus in the melt sets resistivity and conductivity type. Wafering is subtraction: the ingot is sliced with a wire saw, lapped, etched and mirror-polished with colloidal silica, and epitaxial wafers get a further layer of near-perfect silicon grown on top at about 1,200 degrees Celsius ([source](https://www.sumcosi.com/english/products/process/)). Almost every step throws material away.

## Variants and trade-offs

### Prime versus epitaxial

A prime wafer is a uniformly doped, front-polished single crystal: cheapest, and adequate for most memory and mature logic. An epitaxial wafer adds a thin, lightly doped, defect-controlled layer on top, and the transistors live in that layer, so its quality sets the floor on leakage and latch-up. SEMI credits the 2025 shipment increase to AI demand for advanced epi and high-bandwidth memory ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). Epi costs more, and it is where the leaders' margins live.

### Silicon on insulator

A buried oxide separates a thin device layer from the bulk, and Soitec's Smart Cut process makes nearly all of it ([source](https://www.soitec.com/home/group)). SOI matters for RF and low-power logic, not for AI GPUs, which run on bulk epi.

## Who makes it

Five firms supply the whole market. Siltronic's own map of the chain puts five major suppliers behind $11.4 billion of wafer revenue ([source](https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf)), and CSET names them: Shin-Etsu, SUMCO, GlobalWafers, Siltronic and SK Siltron, headquartered in Japan, Taiwan, Germany and South Korea ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

{{figure:wafer-concentration}}

Their 2025 results split the field: an AI boom, a mature-node hangover.

- **Shin-Etsu.** Electronics Materials sold ¥750.3 billion in the nine months to December 2025, on strong AI-related wafer demand ([source](https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260127_con_E.pdf)).
- **SUMCO.** Sold ¥409.7 billion and still lost ¥11.8 billion, as operating profit fell from ¥36.9 billion to ¥1.3 billion while it added leading-edge 300 mm capacity and reorganised its weak 200 mm lines ([source](https://www.sumcosi.com/english/pdf/ir/library/shareholders/27/pdf/nc_e_27.pdf)).
- **Siltronic.** Lost €77.9 million on €1,346.7 million of sales while spending €369.1 million on its Singapore fab ([source](https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html)).
- **GlobalWafers.** NT$60.6 billion of revenue, down 3.24 percent in local currency ([source](https://www.sas-globalwafers.com/en/gwc_news_en_20260303/)).

Price explains the gap between volume and profit: area shipped rose 5.8 percent in 2025 while revenue fell 1.2 percent ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). Wafers sell on multi-year agreements that fix price and volume years ahead, so a demand spike never reaches the invoice.

Feedstock is a separate map, and the headline number misleads. China made 1.50 million tonnes of polysilicon in 2023, about 93 percent of world output ([source](https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf)). Almost none of it can go into a chip. Solar-grade material was 98 percent of that output and electronic-grade 2 percent ([source](https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf)).

{{figure:polysilicon-grade}}

The grade that matters is a small business with a short supplier list. Siltronic counts the market for silicon for electronic applications at $1.4 billion with five major suppliers: Wacker, Hemlock, OCI, Tokuyama and Mitsubishi ([source](https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf)). Not one of them is Chinese.

Crystal growth and polishing sit in Japan, Taiwan, Germany and South Korea, with no major US-headquartered producer as of 2021 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). That is changing at the margin. GlobalWafers opened a $3.5 billion plant in Sherman, Texas in May 2025, the first production line of its kind built in the United States in over twenty years, and announced another $4 billion for phases three and four the same day ([source](https://www.sas-globalwafers.com/en/gwc_news_en_20250516/)). Washington had awarded it up to $406 million under the CHIPS incentives programme ([source](https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-incentives-awards)).

## The chokepoint

China is the world's polysilicon superpower and a rounding error in the product that matters. As of 2021 Chinese firms held under 5 percent of the wafer market and under 1 percent of 300 mm ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). They cannot even feed their own fabs: Chinese producers supplied 12 percent of the wafers consumed by China's 300 mm fabs, against 18 percent at 200 mm and below ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Domestic makers are building, but from that base.

The barrier is not a machine you cannot buy. Advanced-node 300 mm wafers rest on tacit know-how, and 300 mm carried 99.7 percent of world fab capacity at 45 nm and below as of 2021 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). A new source must be proved out per device and per fab, which takes quarters, while incumbent contracts run years.

The industry's own failed attempt to change the substrate proves that inertia. The last increase in wafer size, to 300 mm, happened in 2002 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Bigger discs also make lithography a bigger share of the bill: photolithography takes half the cost of processing a 300 mm wafer against a quarter of a 150 mm one ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The push to 450 mm never reached production, and every leading-edge chip is still made on 300 mm.

What an AI accelerator asks of its wafer is narrow and unforgiving. One killer defect ruins far more silicon on a reticle-limited GPU die than on a small one, and EUV's shallow depth of focus (see Lithography) means flatness must hold across the whole disc, not on average. Both are why the qualified supplier list is five names long.

## Key evaluation criteria

- **Grade.** Electronic against solar polysilicon is the line between a Chinese commodity market and a German, American, Japanese and Korean one; solar was 98 percent of China's 2023 output ([source](https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf)).
- **Defect density** in the epi layer. Large AI dies punish defects superlinearly, which is why AI demand shows up first in advanced epi ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)).
- **Flatness and nanotopography**, because EUV exposure has almost no depth of focus to spare across a 300 mm field.
- **Diameter**, where 300 mm carries every leading-edge node and 99.7 percent of capacity at 45 nm and below ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Contract structure**, since long-term agreements set price and volume years ahead and blunt a demand spike.

## Takeaways

The wafer is the cheapest critical input in the AI chain and among the most concentrated: five firms and $11.4 billion of revenue gating trillions of downstream value ([source](https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf)) ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). China's polysilicon dominance is real but in the wrong grade, and its 300 mm position is small ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Watch epitaxial mix, not square inches: that is where AI demand lands and where the incumbents make money. And the 450 mm failure showed that this layer changes on decade timescales, not product cycles.
