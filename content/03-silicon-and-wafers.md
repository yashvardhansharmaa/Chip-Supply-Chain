---json
{
  "id": "silicon-and-wafers",
  "number": 3,
  "title": "Silicon and Wafers",
  "oneLiner": "China makes almost all of the world's polysilicon and almost none of the wafers that matter. Five firms in Japan, Taiwan, Germany and South Korea hold the 300 mm substrate every AI accelerator starts on.",
  "specimen": "boule-and-wafer",
  "specimenCaption": "Right: a Czochralski ingot and a 300 mm wafer. Seed crystal and narrow neck at the top, the shoulder where the crystal opens out to full diameter, the cylindrical body, and a polished wafer sliced from that body.",
  "card": {
    "concentration": "High",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Shin-Etsu Handotai", "country": "JP", "share": "Largest supplier; parent's Electronics Materials segment sold ¥750.3bn Apr-Dec 2025"},
      {"name": "SUMCO", "country": "JP", "share": "¥409.6bn revenue in FY2025"},
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
    {"fact": "Worldwide silicon wafer shipments rose 5.8% to 12,973 million square inches in 2025 while revenue fell 1.2% to $11.4 billion", "source": "https://www.semiconductor-digest.com/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results/"},
    {"fact": "Shin-Etsu, SUMCO, GlobalWafers, Siltronic and SK Siltron controlled about 85% of global 300 mm capacity in 2025", "source": "https://www.mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market"},
    {"fact": "300 mm wafers are used for 99.7% of world fab capacity capable of manufacturing chips at 45 nm and below (as of 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
    {"fact": "China produced 93.5% of global polysilicon output in 2024, and nine of the ten largest makers are Chinese", "source": "https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/"},
    {"fact": "Wacker, the only non-Chinese firm in the polysilicon top ten, is the largest producer of semiconductor-grade polysilicon at roughly 80,000 metric tons of capacity", "source": "https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/"},
    {"fact": "SUMCO's 300 mm volumes rose 9% in 2025 while full-year revenue was ¥409.6bn and operating profit only ¥1.3bn", "source": "https://www.investing.com/news/transcripts/earnings-call-transcript-sumco-q4-2025-sees-revenue-beat-eps-miss-93CH-4505681"},
    {"fact": "Siltronic booked a €77.9m net loss in 2025 on €1,346.7m of sales, with capex of €369.1m concentrated on its Singapore fab", "source": "https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html"},
    {"fact": "Doosan agreed to buy 70.6% of SK Siltron for ₩2.3 trillion ($1.6bn); SK Siltron had ₩2tn of 2025 revenue", "source": "https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658"}
  ],
  "figures": [
    {
      "id": "wafer-concentration",
      "type": "stack",
      "title": "Share of global 300 mm wafer capacity, 2025",
      "unit": "%",
      "data": [["Shin-Etsu, SUMCO, GlobalWafers, Siltronic, SK Siltron", 85], ["Everyone else", 15]],
      "source": {"label": "Mordor Intelligence, semiconductor silicon wafer market", "url": "https://www.mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market"}
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

Every AI accelerator begins as a disc of silicon so pure and so flat that the industry treats it as a solved problem and then quietly pays five companies to keep solving it. The whole world market is small: $11.4 billion of wafer revenue on 12,973 million square inches shipped in 2025 ([source](https://www.semiconductor-digest.com/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results/)). That is less than a single quarter of Nvidia's data-center revenue, and it sits under all of it.

## How it works

Silicon starts as quartzite reduced with carbon in an arc furnace to metallurgical-grade silicon, which is about 98 to 99 percent pure and useless for electronics. To go further, the silicon is converted to trichlorosilane gas, distilled, and then decomposed back onto heated silicon filaments inside a bell jar. That is the Siemens process, and it grows the rough grey rods of polysilicon that everything downstream is made from.

Purity is the point. SUMCO describes its feedstock as polysilicon purified until metal impurities are no more than a few parts per billion ([source](https://www.sumcosi.com/english/products/process/)). Solar cells tolerate roughly nine nines of purity. Electronics demand eleven nines, and the extra two orders of magnitude are the difference between a commodity and a chokepoint.

The polysilicon is then melted, at around 1,420 degrees Celsius, and pulled into a single crystal by the Czochralski method ([source](https://www.sumcosi.com/english/products/process/)). A seed crystal touches the melt and is withdrawn while rotating. The puller first draws a thin neck, which starves out the dislocations that nucleate at the seed, then opens the crystal out to a shoulder and holds it at 300 mm for the length of the body. Boron or phosphorus is added to the melt in controlled amounts to set the resistivity and the conductivity type ([source](https://www.sumcosi.com/english/products/process/)).

Wafering is subtraction. The ingot is sliced into discs roughly a millimetre thick with a wire saw, lapped flat with alumina abrasive, chemically etched to remove the saw damage, and then given a mirror finish by mechano-chemical polishing with colloidal silica ([source](https://www.sumcosi.com/english/products/process/)). For epitaxial wafers, a further layer of near-perfect silicon is grown on top of the polished surface from vaporised silicon compounds at around 1,200 degrees Celsius ([source](https://www.sumcosi.com/english/products/process/)).

Almost every step throws material away. That is why the wafer looks cheap next to the finished chip and is anything but cheap to make well.

## Variants and trade-offs

### Polished, or prime

The default. A single-crystal disc, doped uniformly, polished on the front. Cheapest per wafer, and adequate for most memory and mature logic.

### Epitaxial

A prime wafer with a thin, lightly doped, defect-controlled layer grown on top. The epi layer is where the transistors actually live, so its crystalline quality sets the floor on leakage and latch-up. SEMI attributes the 2025 shipment increase specifically to AI-related demand for advanced epitaxial wafers and high-bandwidth memory, even as prices elsewhere softened ([source](https://www.semiconductor-digest.com/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results/)). Epi costs more and is the segment where the leaders' margins live.

### Silicon on insulator

A buried oxide layer separates a thin device layer from the bulk. Soitec's Smart Cut process is used to make nearly all the SOI wafers sold in the world ([source](https://www.soitec.com/home/group)). SOI matters for RF and for fully depleted low-power logic, and GlobalWafers makes 300 mm SOI at St Peters, Missouri ([source](https://www.manufacturingdive.com/news/globalwafers-to-spend-additional-4-billion-us-operations-sherman-texas/748338/)). It is not the substrate under a mainstream AI GPU, which runs on bulk epi.

## Who makes it

Five incumbents, Shin-Etsu Chemical, SUMCO, GlobalWafers, Siltronic and SK Siltron, controlled about 85 percent of global 300 mm capacity in 2025 ([source](https://www.mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market)). Counted across all diameters, those same five account for more than 90 percent of the global market ([source](https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658)).

{{figure:wafer-concentration}}

The 2025 numbers show an industry split between an AI boom and a mature-node hangover. Shin-Etsu's Electronics Materials segment, which covers silicon wafers alongside photoresist and photomask blanks, sold ¥750.3 billion in the nine months to December 2025, up 6 percent, and the company credited strong AI-related demand for higher wafer sales ([source](https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260127_con_E.pdf)). SUMCO shipped 9 percent more 300 mm volume in 2025 but turned ¥409.6 billion of revenue into only ¥1.3 billion of operating profit, and cut capex to ¥79.9 billion from ¥214.9 billion the year before ([source](https://www.investing.com/news/transcripts/earnings-call-transcript-sumco-q4-2025-sees-revenue-beat-eps-miss-93CH-4505681)). Siltronic lost €77.9 million on €1,346.7 million of sales while spending €369.1 million, mostly on its new Singapore fab ([source](https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html)). GlobalWafers held up better, reporting NT$60.6 billion of 2025 revenue, down 3.24 percent in local currency but roughly flat in US dollars ([source](https://www.sas-globalwafers.com/en/gwc_news_en_20260303/)).

Pricing explains the gap between volume and profit. Wafers are sold on multi-year long-term agreements, and SUMCO's management said LTA prices are broadly being respected and are generally flat, adding that without a supply shortfall it is not easy to raise them ([source](https://www.investing.com/news/transcripts/earnings-call-transcript-sumco-q4-2025-sees-revenue-beat-eps-miss-93CH-4505681)). Siltronic reported the same pattern from the other side: price pressure outside existing long-term agreements ([source](https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html)).

Feedstock is a separate map. China produced 93.5 percent of global polysilicon output in 2024, and nine of the ten largest producers are Chinese, led by Tongwei at roughly 910,000 metric tons of capacity ([source](https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/)). That dominance is in solar-grade material. The only non-Chinese firm in the top ten, Wacker, ranks eighth on volume at about 80,000 metric tons while being the largest producer of semiconductor-grade polysilicon ([source](https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/)). Solar-grade prices collapsed below $4.50 per kilogram at the end of 2024, which tells you how little the two markets have in common ([source](https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/)).

{{figure:polysilicon-capacity}}

Geographically, crystal growth and polishing sit in Japan, Taiwan, Germany and South Korea, with no major US-headquartered wafer producer (as of 2021) ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). That is changing at the margin. GlobalWafers opened a $3.5 billion plant in Sherman, Texas in May 2025 with a $406 million CHIPS award and announced a further $4 billion of US investment ([source](https://www.manufacturingdive.com/news/globalwafers-to-spend-additional-4-billion-us-operations-sherman-texas/748338/)). Micron has since committed $500 million to that Texas plant as part of raising its US spending to $250 billion ([source](https://www.tomshardware.com/tech-industry/semiconductors/micron-commits-500-million-to-globalwafers-texas-wafer-plant-as-it-raises-us-spending-to-250-billion)). Ownership is moving too: Doosan agreed to buy 70.6 percent of SK Siltron for ₩2.3 trillion, about $1.6 billion, against 2025 revenue of ₩2 trillion ([source](https://www.koreajoongangdaily.com/business/doosan-to-buy-sk-siltron-in-23-trillion-won-chip-deal/12803658)).

## The chokepoint

China is the world's polysilicon superpower and a rounding error in the product that matters. As of 2021, Chinese firms held under 5 percent of the wafer market and under 1 percent of 300 mm ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). That gap is closing from a low base. National Silicon Industry Group, whose Zing subsidiary was China's first industrialised 300 mm wafer maker, reported a 36.51 percent revenue rise in the first half of 2026 as 300 mm shipments grew more than 90 percent ([source](https://www.digitimes.com/news/a20260820VL212/nsig-300mm-capacity-silicon-wafer-silicon.html)). Chinese suppliers compete where flatness targets are looser, pricing 10 to 15 percent below Japanese peers, and yield gaps still keep them away from leading-edge buyers ([source](https://www.mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market)).

The barrier is not a machine you cannot buy. It is that 300 mm wafers used for advanced nodes require considerable tacit know-how, and 300 mm accounts for 99.7 percent of world fab capacity able to make chips at 45 nm and below (as of 2021) ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Qualification compounds it. A new wafer source must be proved out per device and per fab, which takes quarters, and the incumbent contracts run for years.

The industry's own failed attempt to change the substrate is the best evidence of that inertia. The Global 450 Consortium brought Intel, TSMC, Samsung, IBM and GlobalFoundries together to move to 450 mm wafers, which Intel argued would more than double the chips per wafer, and TSMC scoped a five-year 450 mm project at an estimated $8 billion to $10 billion for a new fab ([source](https://www.theregister.com/2022/08/08/how_tsmc_killed_450mm_wafers/)). It collapsed by 2017 and every leading-edge chip today is still made on 300 mm ([source](https://www.theregister.com/2022/08/08/how_tsmc_killed_450mm_wafers/)).

What an AI accelerator asks of its wafer is narrow and unforgiving. A reticle-limited GPU die is among the largest chips in production, so a single killer defect ruins far more silicon than it would on a small die, and defect density on the epi layer translates directly into yield. EUV lithography has a shallow depth of focus (see Lithography), so wafer flatness and nanotopography have to hold across the whole 300 mm disc, not just on average. Neither requirement is exotic. Both are why the qualified supplier list is five names long.

## Key evaluation criteria

- **Purity** measured in nines. Eleven-nines electronic-grade polysilicon versus nine-nines solar grade is the line that separates a Chinese commodity market from a German, American, Japanese and Korean one ([source](https://www.pv-magazine.com/2025/11/25/china-dominates-global-polysilicon-capacity-says-bernreuter-research/)).
- **Defect density** in the epitaxial layer. Large AI dies punish defects superlinearly, which is why AI demand shows up first in advanced epi ([source](https://www.semiconductor-digest.com/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results/)).
- **Flatness and nanotopography**, because EUV exposure has almost no depth of focus to spare across a 300 mm field.
- **Diameter and volume**, where 300 mm carried 73.81 percent of wafer area shipped in 2025 and every leading-edge node ([source](https://www.mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market)).
- **Contract structure**, since long-term agreements set price and volume years ahead and blunt the effect of any single demand spike ([source](https://www.investing.com/news/transcripts/earnings-call-transcript-sumco-q4-2025-sees-revenue-beat-eps-miss-93CH-4505681)).

## Takeaways

The wafer is the cheapest critical input in the AI chain and one of the most concentrated: five firms, about 85 percent of 300 mm capacity, and an $11.4 billion market that gates trillions of dollars of downstream value ([source](https://www.mordorintelligence.com/industry-reports/semiconductor-silicon-wafer-market)) ([source](https://www.semiconductor-digest.com/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results/)). China's polysilicon dominance is real but sits in the wrong grade, and its 300 mm position is small and growing fast rather than large. Watch epitaxial mix, not total square inches: that is where AI demand lands and where the incumbents make money. And note what the 450 mm failure proved, which is that this layer of the stack changes on decade timescales, not product cycles.
