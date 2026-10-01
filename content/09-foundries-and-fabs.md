---json
{
 "id": "foundries-and-fabs",
 "number": 9,
 "title": "Foundries and Fabs",
 "oneLiner": "TSMC runs six plants that each print more than 100,000 wafers a month. All six are in Taiwan, and in 2025 their combined capacity passed 13 million wafers a year, out of more than 17 million for the whole company.",
 "plain": "A foundry is a fab that makes chips for other companies. Those companies send in their designs, and the foundry runs them all through the same building on the same tools. The building costs tens of billions of dollars, and the air inside is cleaner than an operating room. Even so, a wafer crosses hundreds of machines over several months inside sealed boxes, never touching that air. No chip company sells enough of one product to fill a factory like that on its own, so the world shares a handful of them. TSMC runs the biggest, and all six of its largest plants sit in Taiwan, which is why one island's politics reaches the whole chip supply.",
 "bridge": "The designers of the chip own none of these machines; they rent time in someone else's building, and that building is a business of its own.",
 "specimen": "foup",
 "specimenCaption": "A FOUP, the sealed pod that carries 25 wafers between tools. It is 388 by 342 by 332 mm, drawn to scale, and barely bigger than what it holds: the 300 mm wafers inside, each the width of a dinner plate, nearly fill it. The shell is translucent, as the real polycarbonate is. One wafer is picked out in silver.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "TSMC", "country": "TW", "share": "77% of wafer revenue from 7 nm and below, 2Q26; six gigafabs, all in Taiwan"},
 {"name": "Intel Foundry", "country": "US", "share": "$5.8bn revenue and a $2.089bn operating loss, 2Q26"},
 {"name": "Samsung Foundry", "country": "KR", "share": "Hwaseong and Pyeongtaek; a planned minimum of $17bn at Taylor, Texas"},
 {"name": "SMIC", "country": "CN", "share": "$9.327bn revenue in 2025 at 93.5% utilization"},
 {"name": "Rapidus", "country": "JP", "share": "State-backed 2 nm entrant, Chitose"}
 ],
 "countries": [
 {"code": "TW", "note": "TSMC's six gigafabs and UMC; TSMC's N2 and N3 lines"},
 {"code": "KR", "note": "Samsung Foundry, Hwaseong and Pyeongtaek"},
 {"code": "CN", "note": "SMIC and Hua Hong; the largest installed capacity of any region, almost all of it on older nodes"},
 {"code": "US", "note": "Intel Foundry, GlobalFoundries, TSMC Arizona, Samsung Taylor"},
 {"code": "JP", "note": "TSMC Kumamoto, Rapidus Chitose"}
 ],
 "chinaStatus": "SMIC and Hua Hong are China's largest foundries. SMIC had revenue of $9.327 billion in 2025 with its lines 93.5 percent full. It cannot buy an EUV scanner, so it cannot make the newest chips. China is forecast to have more fab capacity than any other region, and almost none of it can make the newest chips.",
 "usStatus": "Intel Foundry is the only American-owned foundry that makes the newest chips. It lost $2.089 billion on $5.8 billion of revenue in the second quarter of 2026. The federal government bought a 9.9 percent stake in Intel in August 2025 and takes no part in running it.",
 "costSignal": "BCG puts the ten-year cost of owning a fab completed in 2026 at $35-43 billion; TSMC's planned investment in Arizona rose to $265 billion in July 2026",
 "substitutability": {"band": "Hard", "test": "Intel and Samsung also run lines for the newest chips, but TSMC has not built one of its largest fabs outside Taiwan, and the slow part is training the workforce.", "why": "Money can buy the building. BCG puts the ten-year cost of a fab finished in 2026 at $35 to $43 billion. Intel and Samsung already run lines for the newest chips, so a newcomer is copying something that has been done. Money cannot quickly buy a workforce that has run one process for years. Even TSMC has yet to build one of its largest fabs anywhere but Taiwan."}
 },
 "keyFacts": [
 {"fact": "7 nm and below was 77% of TSMC's wafer revenue in 2Q26, on revenue of $40.20 billion at a 67.7% gross margin", "source": "https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm"},
 {"fact": "TSMC defines a GIGAFAB as a 300 mm fab with monthly capacity above 100,000 wafers; it operates six, whose combined capacity exceeded 13 million 12-inch equivalent wafers in 2025", "source": "https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab"},
 {"fact": "Annual capacity of all facilities TSMC and its subsidiaries manage exceeded 17 million 12-inch equivalent wafers in 2025, and all of its GIGAFAB facilities are in Taiwan", "source": "https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity"},
 {"fact": "In July 2026 TSMC announced plans to invest another $100 billion in four more fabs at 2 nm or below, bringing its planned investment in Arizona to $265 billion across 12 facilities", "source": "https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html"},
 {"fact": "In August 2025 the US government agreed to buy 433.3 million Intel shares at $20.47 for $8.9 billion, a 9.9% passive stake", "source": "https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to"},
 {"fact": "Intel Foundry had $5.8 billion of 2Q26 revenue and a $2.089 billion operating loss", "source": "https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results"},
 {"fact": "SMIC revenue rose 16.2% to $9.327 billion in 2025 at 93.5% average utilization, with monthly capacity above 1 million 8-inch-equivalent wafers", "source": "https://www.smics.com/en/site/news_read/7951"},
 {"fact": "SEMI forecast China at 10.1 million wafers per month of installed capacity in 2025 against Taiwan's 5.8 million, out of a global 33.7 million", "source": "https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports"},
 {"fact": "The US share of sub-10 nm logic capacity is projected to rise from near zero in 2022 to 28% in 2032, while new wafer fab investment worldwide reaches a projected $2.3 trillion in 2024-2032", "source": "https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain"}
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

TSMC calls a plant a GIGAFAB once it can run more than 100,000 wafers a month, each a 300 mm disc, twelve inches across ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)). It operates six of them, and every one is in Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)).

## How it works

A foundry is a fab that makes chips for other companies. Those companies send in their designs, and the foundry runs them all through the same building on the same tools. The building costs tens of billions of dollars, and the air inside is cleaner than an operating room. Even so, a wafer crosses hundreds of machines over several months inside sealed boxes, never touching that air. No chip company sells enough of one product to fill a factory like that on its own, so the world shares a handful of them. TSMC runs the biggest, and all six of its largest plants sit in Taiwan, which is why one island's politics reaches the whole chip supply.

Inside, the work is one loop repeated for every layer. Wafers travel in a lot, a batch of 25 in a sealed pod called a FOUP that only a machine opens. An overhead track carries the pod from tool to tool. At each tool a robot lifts one wafer out, the tool does its one job, depositing a film, printing a pattern, etching it, cleaning it or measuring it, and the robot puts the wafer back. The pod moves on to the next tool, often across the building, and the loop starts again with the next layer. A chip takes hundreds of those visits, so a wafer spends months inside.

The pod keeps the wafer clean for all of that time, because the wafer never meets the room's air, and even that air is filtered until it carries almost no dust. Every design in the building runs on the same tools because each tool is set by recipe, the list of gases, temperatures and times for one step, and a foundry offers each customer the same list of recipes on shared machines. The tools run day and night, since an idle tool earns nothing. The finished wafer is tested (see [Test and assembly](#test-and-assembly)), then cut and packaged.

TSMC, founded in 1987, pioneered the pure-play model, in which a foundry makes only its customers' products ([source](https://www.tsmc.com/english/aboutTSMC/company_profile)). BCG puts the ten-year cost of owning a fab completed in 2026 at $35 to $43 billion, 33 to 66 percent above costs in 2023, when BCG made the estimate ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)).

Every plant TSMC and its subsidiaries run came to more than 17 million wafers a year in 2025, counted as if each were the standard 12-inch size ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)). The six largest plants, called gigafabs, had a combined capacity of more than 13 million ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)). All six are in Taiwan, and the other plants are five smaller fabs in Taiwan, two fabs in China, two in the United States and one in Japan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)).

## Variants and trade-offs

### Pure-play foundries

TSMC and UMC build only for others. Chips at 7 nm and below, meaning the newest processes, were 77 percent of TSMC's wafer revenue in the second quarter of 2026, split 33 percent at 5 nm, 30 at 3 nm, 11 at 7 nm and 3 at 2 nm, on revenue of $40.20 billion at a 67.7 percent gross margin ([source](https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm)).

{{figure:foundry-share}}

### Integrated device makers turned foundry

Intel and Samsung design and sell their own chips and rent out capacity too. Renting out capacity is harder for them, because customers dislike handing designs to a competitor and the company's own products take the best capacity. Intel Foundry booked $5.8 billion of revenue in the second quarter of 2026, up 31 percent, against a $2.089 billion operating loss ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)).

### National champions

SMIC, Hua Hong and Rapidus have government backing. SMIC's revenue rose 16.2 percent to $9.327 billion in 2025 at 93.5 percent utilization, on monthly capacity above a million wafers counted in the smaller 8-inch size, and a 21 percent gross margin ([source](https://www.smics.com/en/site/news_read/7951)). Rapidus raised 267.6 billion yen from the Japanese government and 32 companies in February 2026 to carry it to 2 nm mass production by 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

### Mature-node capacity

Most wafers come off older lines. In June 2024 the industry association SEMI forecast that foundry capacity alone would reach 12.7 million wafers a month by 2026, counted in the 8-inch size, driven largely by Intel's new foundry business and China's expansion ([source](https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports)). Those lines make power devices, analog chips and microcontrollers, and compete on price.

## Capacity and cost

TSMC added $100 billion in March 2025 to the $65 billion already committed in Phoenix, for three more fabs, two packaging plants and an R&D center ([source](https://pr.tsmc.com/english/news/3210)). In July 2026 it added another $100 billion for four more fabs at 2 nm or below, taking its total investment in Arizona to $265 billion across 12 facilities ([source](https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html)). All of TSMC's gigafabs are still in Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)).

Customers paid TSMC in advance to retain its capacity, according to the company's 2022 annual report ([source](https://investor.tsmc.com/static/annualReports/2022/english/ebook/files/basic-html/page237.html)). In 2025 the four largest AI chip designers used around 90 percent of the world's CoWoS packaging capacity and HBM memory supply, against only 12 percent of advanced logic production ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). See [Advanced packaging](#advanced-packaging).

## Who makes it

Intel is now partly state-owned. In August 2025 Washington bought 433.3 million newly issued Intel shares at $20.47, or $8.9 billion, for a 9.9 percent stake, paid out of $5.7 billion of unpaid CHIPS Act grants and $3.2 billion from the Secure Enclave program. The stake carries no control, and it came with a five-year warrant for a further 5 percent that Washington can exercise only if Intel drops below 51 percent ownership of the foundry business ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). That makes the warrant an option on Intel keeping its fabs.

Intel's technical position improved in 2026. It reached high-volume manufacturing on part of Panther Lake using ASML's High-NA extreme ultraviolet scanners, and put 18A-P into risk production, the trial runs a process goes through before it is signed off ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)).

Samsung is building a plant in Taylor, Texas, with a planned minimum of $17 billion, $6 billion of buildings and $11 billion of equipment ([source](https://semiconductor.samsung.com/sas/company/taylor/)). Its CHIPS Act plan includes two new leading-edge logic fabs and research and development in Taylor, and an expansion of its existing plant in Austin ([source](https://semiconductor.samsung.com/sas/company/taylor/)).

## The chokepoint

SEMI forecast China at 10.1 million wafers a month in 2025, the most of any region, against Taiwan's 5.8 million out of a world total of 33.7 million ([source](https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports)). Little of China's is advanced; in 2022 South Korea and Taiwan held almost all of the world's logic capacity below 10 nm ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). The United States had almost no capacity below 10 nm in 2022 and is projected to hold 28 percent of it by 2032, while new fab investment worldwide reaches a projected $2.3 trillion from 2024 to 2032 ([source](https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain)).

{{figure:capacity-by-region}}

Three risks meet on one island:

- **Seismic.** Taiwan sits on an active plate boundary, and after an earthquake in January 2025 TSMC had to scrap a number of wafers in process ([source](https://pr.tsmc.com/english/news/3204)).
- **Power.** A gigafab is a large industrial load on a small island grid.
- **Political.** Taiwan makes over 70 percent of the world's chips below 10 nm, so a blockade or conflict would cut most of that output off from the world market at once ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). See [Geopolitics](#geopolitics).

Diversification is slow, and TSMC has yet to build a gigafab anywhere but Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)).

## Key evaluation criteria

- **Leading-edge share.** The share of revenue from the newest processes, 77 percent of TSMC's wafer revenue at 7 nm and below in the second quarter of 2026 ([source](https://www.sec.gov/Archives/edgar/data/0001046179/000104617926000451/a2q26e_withguidancexfinal.htm)).
- **Yield at ramp.** How many good chips a new process gives in its first year, which separates a profitable node from a subsidized one.
- **Ten-year cost of ownership.** $35 to $43 billion for a fab finished in 2026, and rising ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)).
- **Utilization.** How full the lines run. SMIC's lines ran 93.5 percent full in 2025, at a 21 percent gross margin ([source](https://www.smics.com/en/site/news_read/7951)).
- **Customer concentration.** A foundry owned by a chipmaker competes with its own customers, which caps who will trust it with a flagship design.
- **Geographic exposure.** How much of a buyer's supply sits on one island, one grid, one fault system.

## Takeaways

Taiwan, home of TSMC, makes over 70 percent of the world's chips on the most advanced processes, those below 10 nanometers ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). All six of TSMC's largest plants, which it calls gigafabs, are in Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)). TSMC is building more plants in Arizona, and once they are finished around 30 percent of its 2-nanometer and more advanced capacity will be there ([source](https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html)).
