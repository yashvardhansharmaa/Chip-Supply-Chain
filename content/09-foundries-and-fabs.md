---json
{
 "id": "foundries-and-fabs",
 "number": 9,
 "title": "Foundries and Fabs",
 "oneLiner": "A foundry builds other companies' chip designs in factories it owns, so those companies can share a factory instead of each building their own. TSMC runs the biggest, and its six largest plants are all in Taiwan.",
 "plain": "A foundry is a company that makes chips for other companies in its chip factories, or fabs. Those companies send in their designs, and the foundry runs them all through the same building on the same tools. The building costs tens of billions of dollars, and the air inside is cleaner than in an operating room. Even so, each wafer, the silicon disc the chips are built on, moves from machine to machine inside sealed boxes and never touches that air. No chip company sells enough of one product to fill such a factory on its own, so chip companies share a handful of them. TSMC runs the biggest of these shared factories, and all six of its largest plants are in Taiwan. Taiwan also held most of the world's capacity for the most advanced logic chips in 2022. So a political crisis over Taiwan would put most of the supply of those chips at risk. This chapter covers the factories where advanced semiconductors and AI GPUs are actually built, how many chips they can make and where they are. Chapter 8 covers the know-how for building the newest switches inside them. Today TSMC, Intel and Samsung lead both. Still, know-how alone is not enough, because the newest chips also need factories that cost tens of billions of dollars each.",
 "bridge": "The chip's designers own none of these machines. They rent time in a building that another company owns and runs as its own business.",
 "specimen": "foup",
 "specimenCaption": "A FOUP, the sealed pod that carries 25 wafers between tools, drawn to scale. The 300 mm wafers inside, each the width of a dinner plate, nearly fill it. The shell is translucent, as the real polycarbonate is. One wafer is picked out in silver.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "TSMC", "country": "TW", "share": "79% of its wafer revenue from 7 nm and below, 3Q26", "source": "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm"},
 {"name": "Intel Foundry", "country": "US", "share": "$5.8bn segment revenue in 2Q26, only $293m of it from outside customers", "source": "https://www.sec.gov/Archives/edgar/data/50863/000005086326000157/intc-20260627.htm"},
 {"name": "Samsung Foundry", "country": "KR", "share": "Over $37bn planned in Texas (CHIPS award, Dec 2024)", "source": "https://www.nist.gov/news-events/news/2024/12/biden-harris-administration-announces-chips-incentives-award-samsung"},
 {"name": "SMIC", "country": "CN", "share": "$9.327bn revenue in 2025", "source": "https://www.smics.com/en/site/news_read/7951"},
 {"name": "Rapidus", "country": "JP", "share": "Raised 267.6 billion yen in February 2026 to reach 2 nm mass production by 2027", "source": "https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/"}
 ],
 "countries": [
 {"code": "TW", "note": "TSMC (six gigafabs, N2 and N3 lines) and UMC"},
 {"code": "KR", "note": "Samsung Foundry, Hwaseong and Pyeongtaek"},
 {"code": "CN", "note": "SMIC and Hua Hong"},
 {"code": "US", "note": "Intel Foundry, GlobalFoundries, TSMC Arizona, Samsung Taylor"},
 {"code": "JP", "note": "TSMC Kumamoto, Rapidus Chitose"}
 ],
 "chinaStatus": "Georgetown University's CSET reported in June 2024 that Huawei's Ascend 910B AI chip is believed to be made on SMIC's 7 nm-class N+2 process. But SemiAnalysis judged in April 2025 that most 910B and 910C chips were made at TSMC.",
 "chinaSources": ["https://cset.georgetown.edu/publication/pushing-the-limits-huaweis-ai-chip-tests-u-s-export-controls/", "https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72"],
 "usStatus": "The US government agreed in August 2025 to buy a passive 9.9 percent stake in Intel, with no board seat. Announcing the deal, Intel called itself the only chipmaker that both develops and manufactures leading-edge logic chips in the United States. Intel Foundry lost $2.089 billion in the second quarter of 2026.",
 "usSources": ["https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to", "https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to", "https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results"],
 "costSignal": "$35-43 billion over ten years to own a new 2 nm-class fab completed in 2026, BCG's 2023 estimate",
 "costSources": ["https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs"],
 "substitutability": {"band": "Hard", "test": "TSMC has not built one of its six largest fabs outside Taiwan.", "testSources": ["https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity"], "why": "In March 2026 the Semiconductor Industry Association (SIA) put the cost to build and equip a leading-edge fab at as much as $20 to $25 billion. SemiAnalysis judged in December 2025 that finding the highly skilled engineers a foundry needs remained a major challenge for TSMC in Arizona.", "whySources": ["https://www.epw.senate.gov/public/_cache/files/a/c/ac4552ff-551b-40d5-bea6-19dd17a1cfea/1F7BCD91016CBE352434701BE58395874BEA6A892A23ABEE1D7214EC924EC0EB.03-04-2026-isaacs-testimony.pdf#page=3", "https://newsletter.semianalysis.com/p/tsmc-overseas-fabs-a-success"]}
 },
 "keyFacts": [
 {"fact": "7 nm and below was 79% of TSMC's wafer revenue in 3Q26, on revenue of $46.72 billion at a 66.4% gross margin", "source": "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm"},
 {"fact": "TSMC defines a GIGAFAB as a 300 mm fab with monthly capacity above 100,000 wafers. It operates six, whose combined capacity exceeded 13 million 12-inch equivalent wafers in 2025", "source": "https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab"},
 {"fact": "The facilities TSMC and its subsidiaries manage had annual capacity of more than 17 million 12-inch equivalent wafers in 2025, and all of its GIGAFAB facilities are in Taiwan", "source": "https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity"},
 {"fact": "In July 2026 TSMC announced plans to invest another $100 billion in four more fabs at 2 nm or below, bringing its planned investment in Arizona to $265 billion across 12 facilities", "source": "https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html"},
 {"fact": "In August 2025 the US government agreed to buy 433.3 million Intel shares at $20.47 for $8.9 billion, a 9.9% passive stake", "source": "https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to"},
 {"fact": "Intel Foundry had $5.765 billion of 2Q26 segment revenue, of which $293 million came from external customers, and a $2.089 billion operating loss", "source": "https://www.sec.gov/Archives/edgar/data/50863/000005086326000157/intc-20260627.htm"},
 {"fact": "SMIC revenue rose 16.2% to $9.327 billion in 2025 at 93.5% average utilization, with monthly capacity above 1 million 8-inch-equivalent wafers", "source": "https://www.smics.com/en/site/news_read/7951"},
 {"fact": "In June 2024 SEMI forecast China at 10.1 million wafers per month of installed capacity in 2025 against Taiwan's 5.8 million, out of a global 33.7 million", "source": "https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports"},
 {"fact": "In May 2024 SIA and BCG projected that the US share of sub-10 nm logic capacity would rise from near zero in 2022 to 28% in 2032. They projected new wafer fab investment worldwide of around $2.3 trillion in 2024-2032", "source": "https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf"}
 ],
 "figures": [
    {"id": "fab-loop", "type": "animation", "src": "fab-loop", "title": "How a fab builds a chip, layer by layer", "note": "Simplified. A real fab has many tools of each kind, spread across the building, and a chip has far more layers than the seven shown. The layers are drawn far thicker than they are."},
 {
 "id": "foundry-share",
 "type": "stack",
 "title": "TSMC wafer revenue by node, 3Q26",
 "finding": "3 nm led TSMC's wafer revenue in third-quarter 2026, at 33 percent",
 "unit": "% of wafer revenue",
 "data": [["2 nm", 8], ["3 nm", 33], ["5 nm", 28], ["7 nm", 10], ["10 nm and above", 21]],
 "source": {"label": "TSMC 3Q26 results, filed with the SEC", "url": "https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm"}
 },
 {
 "id": "capacity-by-region",
 "type": "bars",
 "title": "SEMI's June 2024 forecast of installed wafer fab capacity by region in 2025, all nodes",
 "finding": "China led SEMI's 2025 capacity forecast at 10.1 million 8-inch-equivalent wafers monthly",
 "unit": "million 8-inch-equivalent wafers per month",
 "data": [["China", 10.1], ["Taiwan", 5.8], ["South Korea", 5.4], ["Japan", 4.7], ["Americas", 3.2], ["Europe and Mideast", 2.7], ["SE Asia", 1.8]],
 "source": {"label": "SEMI World Fab Forecast, June 2024", "url": "https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports"}
 }
 ]
}
---
# Foundries and Fabs

TSMC calls a plant a GIGAFAB once it can run more than 100,000 wafers a month, each a 300 mm disc, twelve inches across ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)). It operates six of them, and every one is in Taiwan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)).

## How it works

A foundry is a company that makes chips for other companies in its chip factories, or fabs. Those companies send in their designs, and the foundry runs them all through the same building on the same tools. The building costs tens of billions of dollars, and the air inside is cleaner than in an operating room. Even so, each wafer, the silicon disc the chips are built on, moves from machine to machine inside sealed boxes and never touches that air. No chip company sells enough of one product to fill such a factory on its own, so chip companies share a handful of them. TSMC runs the biggest of these shared factories, and all six of its largest plants are in Taiwan. Taiwan also held most of the world's capacity for the most advanced logic chips in 2022. So a political crisis over Taiwan would put most of the supply of those chips at risk. This chapter covers the factories where advanced semiconductors and AI GPUs are actually built, how many chips they can make and where they are. Chapter 8 covers the know-how for building the newest switches inside them. Today TSMC, Intel and Samsung lead both. Still, know-how alone is not enough, because the newest chips also need factories that cost tens of billions of dollars each.

Inside, a chip is built up in layers, and a similar loop of steps repeats for each one. Wafers travel in batches, called lots, inside a sealed pod called a FOUP, short for front-opening unified pod. Entegris, a US maker of these pods, offers a standard version that holds 25 wafers ([source](https://www.entegris.com/content/dam/product-assets/a300foups/datasheet-a300foups.pdf)). An overhead track carries the pod from tool to tool.

At each tool a robot lifts one wafer out and the tool does its one job, such as depositing a film, printing a pattern, etching it, cleaning it or measuring it. Then the robot puts the wafer back. The pod moves on to the next tool, often across the building. When a layer is finished, the loop starts again with the next one.

Turning silicon into a finished, packaged chip takes 1,000 to 1,500 steps, depending on how complex the chip is, the Semiconductor Industry Association said in 2025 ([source](https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1#page=2)). In 2021 the association put the time to make a finished wafer at about 12 weeks on average, and up to 14 to 20 weeks for advanced processes ([source](https://www.semiconductors.org/chipmakers-are-ramping-up-production-to-address-semiconductor-shortage-heres-why-that-takes-time/)).

{{figure:fab-loop}}

The pod keeps the wafer clean for all of that time because the wafer never meets the room's air. The room around the pods is kept clean as well. Intel said in 2018 that the air in its fab cleanrooms is filtered to 1,000 times fewer airborne particles than a sterile hospital operating room ([source](https://www.intc.com/news-events/press-releases/detail/165/inside-an-intel-chip-fab-one-of-the-cleanest-conference)).

Each tool is set by a recipe, the list of gases, temperatures and times for one step. A foundry offers every customer the same list of recipes, so every design in the building can run on the same shared tools. The tools run day and night, because an idle tool earns nothing. The finished wafer is tested (see [Test and assembly](#test-and-assembly)), then cut and packaged.

A new leading-edge fab costs tens of billions of dollars. In 2023 the Boston Consulting Group (BCG) estimated that a new fab for chips at 2 nm and below, completed in 2026, would cost $35 to $43 billion to build, equip and run over ten years ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)). BCG said that was 33 to 66 percent more than the same cost in 2023 ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)). Building and equipping alone takes as much as $20 to $25 billion of capital for a leading-edge fab, the Semiconductor Industry Association (SIA) told the US Senate in March 2026 ([source](https://www.epw.senate.gov/public/_cache/files/a/c/ac4552ff-551b-40d5-bea6-19dd17a1cfea/1F7BCD91016CBE352434701BE58395874BEA6A892A23ABEE1D7214EC924EC0EB.03-04-2026-isaacs-testimony.pdf#page=3)).

Most of TSMC's capacity is in its six largest plants, all of them in Taiwan. Together, the plants TSMC and its subsidiaries run had capacity for more than 17 million wafers a year in 2025, counted as if each were the standard 12-inch size ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)). The six largest plants had a combined capacity of more than 13 million ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)). The other plants are five smaller fabs in Taiwan, two in China, two in the United States and one in Japan ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)).

## Variants and trade-offs

### Pure-play foundries

TSMC and UMC, both based in Taiwan, make chips only for other companies. TSMC, founded in 1987, pioneered this pure-play model ([source](https://www.tsmc.com/english/aboutTSMC/company_profile)). Chips at 7 nm and below, meaning the newest processes, were 79 percent of TSMC's wafer revenue in the third quarter of 2026 ([source](https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm)). That share split into 33 percent at 3 nm, 28 at 5 nm, 10 at 7 nm and 8 at 2 nm ([source](https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm)). TSMC's revenue for the quarter was $46.72 billion, at a 66.4 percent gross margin ([source](https://www.sec.gov/Archives/edgar/data/1046179/000104617926000726/a3q26e_withguidancexfinal.htm)).

{{figure:foundry-share}}

### Integrated device makers turned foundry

Intel and Samsung design and sell their own chips and rent out capacity too. Renting out capacity is harder for them, for two reasons. Customers dislike handing their designs to a competitor, and each company's own products take its best capacity. Intel Foundry reported $5.8 billion of segment revenue in the second quarter of 2026 and an operating loss of $2.089 billion ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)). Only $293 million of that revenue came from outside customers ([source](https://www.sec.gov/Archives/edgar/data/50863/000005086326000157/intc-20260627.htm)). Intel says substantially all of its foundry business still makes Intel's own products ([source](https://www.sec.gov/Archives/edgar/data/50863/000005086326000157/intc-20260627.htm)).

### National champions

China's SMIC and Hua Hong and Japan's Rapidus have government backing. SMIC cannot buy an extreme ultraviolet (EUV) scanner, the machine that prints the finest layers ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). Yet it makes 7 nm-class chips on its N+2 and N+3 processes by printing those layers in several passes on older deep-ultraviolet scanners ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). SMIC's revenue rose 16.2 percent to $9.327 billion in 2025, at a 21 percent gross margin ([source](https://www.smics.com/en/site/news_read/7951)). Its lines ran 93.5 percent full, on monthly capacity above a million wafers counted in the smaller 8-inch size ([source](https://www.smics.com/en/site/news_read/7951)).

Two research groups disagree about where Huawei's Ascend AI chips are made. Georgetown University's Center for Security and Emerging Technology (CSET) reported in June 2024 that Huawei's Ascend 910B AI chip was believed to be made on SMIC's N+2 process ([source](https://cset.georgetown.edu/publication/pushing-the-limits-huaweis-ai-chip-tests-u-s-export-controls/)). It also reported that SMIC's limited 7 nm capacity forced Huawei to choose between its most advanced phone chips and its AI chips ([source](https://cset.georgetown.edu/publication/pushing-the-limits-huaweis-ai-chip-tests-u-s-export-controls/)). But the research firm SemiAnalysis judged in April 2025 that most Ascend 910B and 910C chips were made on TSMC's 7 nm process ([source](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72)). It said Huawei got around the sanctions that barred it from TSMC by buying about $500 million of 7 nm wafers through another company, Sophgo ([source](https://newsletter.semianalysis.com/p/huawei-ai-cloudmatrix-384-chinas-answer-to-nvidia-gb200-nvl72)).

In February 2026 Rapidus raised 267.6 billion yen from the Japanese government and 32 companies to reach 2 nm mass production by 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

### Mature-node capacity

Most wafers come off older lines. These lines make power devices, analog chips and microcontrollers, and the foundries that run them compete on price.

The industry association SEMI had expected part of the growth in foundry capacity to come from Intel, which later scaled back. In January 2025 SEMI forecast that foundry capacity at all nodes would rise from 11.3 million wafers a month in 2024 to a record 12.6 million in 2025, counted in the 8-inch size ([source](https://www.semi.org/en/semi-press-release/eighteen-new-semiconductor-fabs-to-start-construction-in-2025-semi-reports)). SEMI's earlier forecast, from June 2024, had credited much of the expected growth to Intel's new foundry business and China's expansion ([source](https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports)). But in July 2025 Intel scaled back its own expansion plans, saying it would no longer go ahead with planned projects in Germany and Poland and would slow construction in Ohio ([source](https://www.intc.com/news-events/press-releases/detail/1745/intel-reports-second-quarter-2025-financial-results)).

## Capacity and cost

In March 2025 TSMC announced plans to add $100 billion to the $65 billion it was already investing in Phoenix, for three more fabs, two packaging plants and an R&D center ([source](https://pr.tsmc.com/english/news/3210)). In July 2026 it announced another $100 billion for four more fabs at 2 nm or below, taking its planned investment in Arizona to $265 billion across 12 facilities ([source](https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html)).

Some customers pay TSMC in advance to hold capacity at its fabs ([source](https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm)). These deposits stood at NT$189,858.2 million at the end of 2025, down from NT$291,101.8 million a year earlier ([source](https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm)).

In 2025 the biggest AI chip designers used most of the world's supply of two inputs but only a small share of its advanced chipmaking. Epoch AI estimated that the four largest used around 90 percent of the world's CoWoS packaging capacity and HBM memory supply ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). CoWoS is TSMC's packaging for AI chips, and HBM is the stacked memory that sits beside them. The same four used only 12 percent of advanced logic production ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). See [Advanced packaging](#advanced-packaging).

## Who makes it

In August 2025 the US government agreed to buy 433.3 million newly issued Intel shares at $20.47 each, or $8.9 billion in all, for a 9.9 percent stake ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). It would pay with $5.7 billion of CHIPS Act grants that Intel had not yet received and $3.2 billion awarded to Intel under the Secure Enclave program ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Intel said it would keep meeting its Secure Enclave obligations and delivering trusted and secure chips to the US Department of Defense ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Announcing the deal, Intel's chief executive, Lip-Bu Tan, called Intel the only semiconductor company that both develops and manufactures leading-edge logic chips in the United States ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). The deal closed on 27 August 2025 and made the government one of Intel's largest stockholders, Intel said in its annual report for 2025 ([source](https://www.sec.gov/Archives/edgar/data/50863/000005086326000011/intc-20251227.htm)).

The stake is passive, with no board seat ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). The government agreed to vote with Intel's board on matters that need shareholder approval, with limited exceptions ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). The deal also gave the government a five-year warrant, a right to buy a further 5 percent of Intel at $20 a share ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). The government can use that right only if Intel's ownership of its foundry business falls below 51 percent ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)).

In 2026 Intel began high-volume manufacturing of some of its Panther Lake processors using ASML's High-NA extreme ultraviolet scanners ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)). It also put its 18A-P process into risk production, the trial runs a process goes through before it is signed off ([source](https://www.intc.com/news-events/press-releases/detail/1776/intel-reports-second-quarter-2026-financial-results)).

In 2022 Samsung broke ground in Taylor, Texas, on a plant with an initial minimum investment of $17 billion, split into $6 billion for buildings and $11 billion for equipment ([source](https://semiconductor.samsung.com/sas/company/taylor/)). In December 2024 the US Commerce Department awarded Samsung up to $4.745 billion of CHIPS Act funding, to support more than $37 billion of planned investment in Central Texas ([source](https://www.nist.gov/news-events/news/2024/12/biden-harris-administration-announces-chips-incentives-award-samsung)). That plan covers two new leading-edge logic fabs and a research fab in Taylor, and an expansion of Samsung's existing plant in Austin ([source](https://www.nist.gov/news-events/news/2024/12/biden-harris-administration-announces-chips-incentives-award-samsung)).

## The chokepoint

In 2022 South Korea and Taiwan held almost all of the world's logic capacity below 10 nm ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=13)). The United States had almost no capacity below 10 nm that year ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=13)). In May 2024 SIA and BCG projected that the US share of that capacity would reach 28 percent by 2032 ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=14)). They also projected that new fab investment worldwide would reach around $2.3 trillion from 2024 to 2032 ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=4)).

China leads the world in capacity for logic chips made at 28 nm or older, but little of its capacity is advanced ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=30)). Across all nodes, old and new, SEMI forecast in June 2024 that China would have installed capacity of 10.1 million wafers a month in 2025, the most of any region ([source](https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports)). It forecast 5.8 million for Taiwan, out of a world total of 33.7 million, all counted in the 8-inch size ([source](https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports)). In the third-quarter 2026 update of its World Fab Forecast, SEMI projected that China would keep the largest installed capacity in 2026 and 2027 ([source](https://www.semi.org/en/products-services/market-data/world-fab-forecast)).

{{figure:capacity-by-region}}

Chip production in Taiwan faces three risks:

- **Seismic.** Taiwan sits on an active plate boundary, and after an earthquake in January 2025 TSMC had to scrap some wafers in process ([source](https://pr.tsmc.com/english/news/3204)).
- **Power.** TSMC says power outages, dips or surges caused by problems at its electricity supplier have at times interrupted its operations ([source](https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm)). It warns that power outages or shortages could also limit its expansion ([source](https://www.sec.gov/Archives/edgar/data/1046179/000162828026025362/tsm-20251231.htm)).
- **Political.** Taiwan held 69 percent of the world's logic capacity below 10 nm in 2022 ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=14)). In December 2025 SemiAnalysis put Taiwan's share of the world's advanced-node capacity at over 90 percent, though it did not say which node sizes count as advanced ([source](https://newsletter.semianalysis.com/p/tsmc-overseas-fabs-a-success)). So a blockade or conflict would cut most of that output off from the world market at once. See [Who Controls the Chain](#geopolitics).

Building capacity outside Taiwan is slow, and TSMC has yet to build a gigafab anywhere else ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)). SemiAnalysis wrote in December 2025 that a foundry needs highly skilled engineers to get the most working chips from each wafer ([source](https://newsletter.semianalysis.com/p/tsmc-overseas-fabs-a-success)). It judged that finding enough workers remained a major challenge for TSMC in Arizona ([source](https://newsletter.semianalysis.com/p/tsmc-overseas-fabs-a-success)).

## Takeaways

In 2022 Taiwan held 69 percent of the world's capacity for advanced logic chips, those below 10 nanometers, and the United States almost none ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf#page=14)). In July 2026 TSMC raised its planned investment in Arizona to $265 billion across 12 facilities ([source](https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html)).

The industry association SEMI projected in 2026 that China would keep the world's largest installed fab capacity in 2026 and 2027 ([source](https://www.semi.org/en/products-services/market-data/world-fab-forecast)). China's SMIC cannot buy an EUV scanner, the machine that prints the finest layers, yet it makes 7 nm-class chips by printing those layers in several passes on older deep-ultraviolet scanners ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).
