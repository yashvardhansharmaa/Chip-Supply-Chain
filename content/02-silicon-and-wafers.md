---json
{
 "id": "silicon-and-wafers",
 "number": 2,
 "title": "Silicon and Wafers",
 "oneLiner": "China makes almost all of the world's polysilicon and almost none of the wafers that matter. Five firms in Japan, Taiwan, Germany and South Korea hold the 300 mm wafer every AI accelerator starts on.",
 "plain": "Every chip is built on a wafer, a thin round slice of silicon about 30 centimeters across that carries hundreds of chips at once. Making one starts with sand, which is silicon bound to oxygen. The sand is refined until, of every hundred billion atoms, fewer than one is anything other than silicon. The silicon is melted, a small seed crystal is lowered to the surface and drawn slowly back up, and the melt freezes onto it as one long cylinder, a single crystal with its atoms in one unbroken orderly pattern from end to end. Saws cut the cylinder into discs, and each disc is polished until its surface is flat to within a few atoms, right out to the edge. Only five companies in the world make these wafers to that standard, and none of them is American or Chinese.",
 "bridge": "Nothing in a file computes; the drawing has to be printed onto something, and that something is a disc of pure silicon.",
 "specimen": "boule-and-wafer",
 "specimenCaption": "A silicon ingot, one crystal pulled whole from a melt, with two wafers sawn from it. It is 2.1 m long, 300 mm across and about 265 kg: taller than a door and about as heavy as three grown men, hanging from a neck about 10 mm wide. Drawn to scale. The wafer on its rim is silver.",
 "card": {
 "concentration": "High",
 "chokepointScore": 4,
 "leaders": [
 {"name": "Shin-Etsu Handotai", "country": "JP", "share": "Largest supplier; the parent's electronics materials arm sold ¥750.3bn from April to December 2025"},
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
 "chinaStatus": "Made about 93% of the world's polysilicon in 2023, but 98% of that was solar-grade, too impure for chips. Held under 1% of the 300 mm wafer market as of 2021, and supplies only 12% of the wafers its own 300 mm fabs consume.",
 "usStatus": "No US-headquartered volume wafer maker. Hemlock supplies polysilicon from Michigan; GlobalWafers took a CHIPS award of up to $406m for a $3.5bn Texas plant that opened in May 2025.",
 "costSignal": "The entire world market was $11.4bn of wafer revenue on 12,973 million square inches shipped in 2025",
 "substitutability": {"band": "Moderate", "test": "Five firms already qualify at 300 mm, but a fab has to requalify a new source for every chip it makes", "why": "Five firms qualify leading-edge 300 mm today, so losing one leaves four, and GlobalWafers showed money can still build a line: a $3.5 billion plant in Texas, the first of its kind in the United States in over twenty years. Qualification sets the clock, run per chip and counted in quarters against contracts already fixed years ahead, so a well-funded actor needs two to five years to close the gap."}
 },
 "keyFacts": [
 {"fact": "Worldwide silicon wafer shipments rose 5.8% to 12,973 million square inches in 2025 while revenue fell 1.2% to $11.4 billion", "source": "https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html"},
 {"fact": "Five major suppliers stand behind the entire $11.4bn semiconductor silicon wafer market", "source": "https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf"},
 {"fact": "300 mm wafers carry 99.7% of world fab capacity able to make chips at 45 nm and below (as of 2021)", "source": "https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf"},
 {"fact": "China produced 1.50 Mt of polysilicon in 2023, about 93% of world output, of which 98% was solar-grade and 2% electronic-grade", "source": "https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf"},
 {"fact": "Electronic-grade silicon is a $1.4bn market with five major suppliers: Wacker, Hemlock, OCI, Tokuyama and Mitsubishi", "source": "https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf"},
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
 "title": "China's polysilicon output by grade, 2023. China made about 93% of the world's 1.5 million metric tons that year",
 "unit": "%",
 "data": [["Solar-grade", 98], ["Electronic-grade", 2]],
 "source": {"label": "USGS Minerals Yearbook, China, 2023", "url": "https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf"}
 }
 ]
}
---
# Silicon and Wafers

The whole world market for silicon wafers came to $11.4 billion of revenue on 12,973 million square inches in 2025 ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). That is a small fraction of Nvidia's data center revenue, and every leading-edge chip behind it was built on one of these discs.

## How it works

Every chip is built on a wafer, a thin round slice of silicon about 30 centimeters across that carries hundreds of chips at once. Making one starts with sand, which is silicon bound to oxygen. The sand is refined until, of every hundred billion atoms, fewer than one is anything other than silicon. The silicon is melted, a small seed crystal is lowered to the surface and drawn slowly back up, and the melt freezes onto it as one long cylinder, a single crystal with its atoms in one unbroken orderly pattern from end to end. Saws cut the cylinder into discs, and each disc is polished until its surface is flat to within a few atoms, right out to the edge. Only five companies in the world make these wafers to that standard, and none of them is American or Chinese.

Silicon starts as quartzite, a rock that is silicon bound to oxygen. An arc furnace melts it with carbon, and the carbon takes the oxygen away as gas, leaving rough silicon metal. Refiners turn the metal into a gas, trichlorosilane, and distill it the way a still separates spirit from wash, because the impurities boil at other temperatures and stay behind. The clean gas then flows over silicon filaments heated inside a bell jar. On the hot surface the gas breaks apart, its silicon settles onto the filaments, and over days the filaments thicken into gray rods of polysilicon, the Siemens process. Everything downstream is made from those rods. The same process serves solar cells and chips, but only the ultra-pure semiconductor grade is any use here ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf)), and the two grades are separate industries with separate suppliers.

A grower melts the polysilicon at about 1,420 degrees Celsius, hotter than lava, and pulls a single crystal out of it by the Czochralski method. The grower lowers a small seed crystal on the end of a rod to the surface of the melt and draws it back up, slowly turning. Silicon freezes onto the seed in the seed's own atomic pattern, and a cylinder grows beneath it, the ingot. The pull starts with a thin neck so that the flaws formed where the seed first touched the melt end in the neck and never reach the ingot. Boron or phosphorus stirred into the melt, a step called doping, sets how readily the wafer conducts and whether the current in it is carried by negative charges or positive ones.

A wire saw, a web of fine wire running through abrasive, slices the ingot into discs. The maker then laps each disc, grinding both faces flat between rotating plates, etches off the damaged surface with acid, and polishes it to a mirror with colloidal silica, a slurry of silica particles far too small to see. Epitaxial wafers get one more layer of near-perfect silicon grown on top at about 1,200 degrees Celsius ([source](https://www.sumcosi.com/english/products/process/)), still hot enough to glow orange, and almost every step throws material away.

## Variants and trade-offs

### Prime versus epitaxial

A prime wafer is a uniformly doped, front-polished single crystal: cheapest, and adequate for most memory and mature logic. An epitaxial wafer adds a thin, lightly doped, defect-controlled layer on top. The transistors live in that layer, so its quality sets the floor on leakage and on latch-up, a parasitic short between power and ground. SEMI, the industry association, credits the 2025 rise in shipments to AI demand for advanced epitaxial wafers and high-bandwidth memory ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)).

### Silicon on insulator

A buried layer of oxide, which is glass, separates a thin working layer of silicon from the bulk beneath, and Soitec's Smart Cut process makes nearly all of it ([source](https://www.soitec.com/home/group)). It matters for radio and low-power chips. AI GPUs run on plain epitaxial silicon.

## Who makes it

Siltronic's own map of the chain puts five major suppliers behind the whole market ([source](https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf)). CSET at Georgetown names them: Shin-Etsu, SUMCO, GlobalWafers, Siltronic and SK Siltron, headquartered in Japan, Taiwan, Germany and South Korea ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

{{figure:wafer-concentration}}

Their 2025 results split between an AI boom and a slump in the older, mature nodes.

- **Shin-Etsu.** Its electronics materials arm sold ¥750.3 billion in the nine months to December 2025, on strong AI-related wafer demand ([source](https://www.shinetsu.co.jp/wp-content/uploads/2025/07/20260127_con_E.pdf)).
- **SUMCO.** Sold ¥409.7 billion and still lost ¥11.8 billion, as operating profit fell from ¥36.9 billion to ¥1.3 billion while it added leading-edge 300 mm capacity and reorganized its weak 200 mm lines ([source](https://www.sumcosi.com/english/pdf/ir/library/shareholders/27/pdf/nc_e_27.pdf)).
- **Siltronic.** Lost €77.9 million on €1,346.7 million of sales while spending €369.1 million on its Singapore fab ([source](https://www.siltronic.com/en/press/press-releases/siltronic-ag-robust-business-performance-in-2025-demonstrates-resilience-despite-challenging-conditions.html)).
- **GlobalWafers.** NT$60.6 billion of revenue, down 3.24 percent in local currency ([source](https://www.sas-globalwafers.com/en/gwc_news_en_20260303/)).

Area shipped rose 5.8 percent in 2025 while revenue fell 1.2 percent ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). Wafers sell on multi-year agreements that fix price and volume years ahead, so a demand spike never reaches the invoice.

China made 1.50 million metric tons of polysilicon, the raw material, in 2023, about 93 percent of world output ([source](https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf)). Solar-grade material was 98 percent of that output and electronic-grade 2 percent ([source](https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf)), so almost none of it can go into a chip.

{{figure:polysilicon-grade}}

Siltronic sizes electronic-grade silicon at $1.4 billion, with five major suppliers, none of them Chinese: Wacker, Hemlock, OCI, Tokuyama and Mitsubishi ([source](https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf)).

Crystal growth and polishing sit in Japan, Taiwan, Germany and South Korea, with no major US-headquartered producer as of 2021 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). GlobalWafers opened a $3.5 billion plant in Sherman, Texas in May 2025, the first production line of its kind built in the United States in over twenty years, and announced another $4 billion for phases three and four the same day ([source](https://www.sas-globalwafers.com/en/gwc_news_en_20250516/)). Washington had awarded it up to $406 million under the CHIPS incentives program ([source](https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-incentives-awards)).

## The chokepoint

China dominates polysilicon and barely registers in wafers. As of 2021 Chinese firms held under 5 percent of the wafer market and under 1 percent of 300 mm ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Chinese producers supplied 12 percent of the wafers consumed by China's own 300 mm fabs, against 18 percent at 200 mm and below ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

Leading-edge 300 mm wafers rest on know-how that was never written down and that no machine a rival could buy contains, and 300 mm carried 99.7 percent of world fab capacity at 45 nm and below as of 2021 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). A fab has to qualify each new wafer source for every chip it makes, which takes quarters, while the contracts already in place run for years.

The last increase in wafer size, to 300 mm, happened in 2002 ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Bigger discs make printing a bigger share of the bill: photolithography takes half the cost of processing a 300 mm wafer against a quarter of a 150 mm one ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The push to 450 mm never reached production, and every leading-edge chip is still made on 300 mm.

One fatal defect ruins far more silicon on a GPU die that fills a whole printed field than on a small chip, and extreme-ultraviolet printing has almost no depth of focus to give (see [Lithography](#lithography)), so flatness has to hold at every point on the disc.

## Key evaluation criteria

- **Grade.** Electronic against solar polysilicon is the line between a Chinese commodity market and a German, American, Japanese and Korean one; solar was 98 percent of China's 2023 output ([source](https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf)).
- **Defect density** in the epitaxial layer. A big AI die loses more good silicon per defect than a small chip does, which is why AI demand shows up first in advanced epitaxial wafers ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)).
- **Flatness and nanotopography**, the fine ripple across the surface, because extreme-ultraviolet exposure has almost no depth of focus to spare across a 300 mm wafer.
- **Diameter**, where 300 mm carries every leading-edge node and 99.7 percent of capacity at 45 nm and below ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).
- **Contract structure**, since long-term agreements set price and volume years ahead and blunt a demand spike.

## Takeaways

The wafer is a cheap input and a concentrated one: five firms and $11.4 billion of revenue sit under every leading-edge chip ([source](https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf)) ([source](https://www.prnewswire.com/news-releases/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results-302683028.html)). China's polysilicon dominance is real but in the wrong grade, and its 300 mm position is small ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The epitaxial mix matters more than the square inches, because that is where AI demand lands and where the incumbents make money. The failed move to 450 mm showed that this layer changes over decades.
