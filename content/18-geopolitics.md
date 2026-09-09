---json
{
  "id": "geopolitics",
  "number": 18,
  "title": "Geopolitics",
  "oneLiner": "Every stage in this chain sits in someone's jurisdiction. Since 2018 the United States has been converting that fact into policy, and China has been building an answer.",
  "plain": "An export control is a licence requirement, not a ban on ideas. It tells a company that a named item cannot be shipped to a named buyer without a government's permission, and Washington extends that rule to foreign-made goods built with American technology. A handful of countries can enforce it because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines in a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.",
  "specimen": "globe",
  "specimenCaption": "Right: the world with the chain's chokepoint sites marked. Veldhoven and Oberkochen for lithography, Hsinchu and Tainan for leading-edge logic, Icheon and Pyeongtaek for HBM, Shanghai and Wuhan for China's substitution effort, and the Gulf and Southeast Asian nodes where the finished accelerators now flow.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "United States", "country": "US", "share": "93% of AI accelerator design revenue; 72% of process control and 60% of deposition tool revenue"},
      {"name": "Taiwan", "country": "TW", "share": "78% of the global foundry market and 92% of capacity for the most advanced chips"},
      {"name": "China", "country": "CN", "share": "38% of 28 nm-and-above logic capacity; about 10% of deposition and etch tool revenue"},
      {"name": "Netherlands", "country": "NL", "share": "100% of EUV and 95% of DUV lithography revenue"},
      {"name": "South Korea", "country": "KR", "share": "SK hynix alone took 56% of HBM and 29% of DRAM revenue in 1Q26"}
    ],
    "countries": [
      {"code": "US", "note": "Design, EDA, three of five tool segments, and the export-control authority itself"},
      {"code": "TW", "note": "Leading-edge logic and advanced packaging, and the physical risk"},
      {"code": "CN", "note": "Mature-node capacity, critical minerals, and the target of the whole regime"},
      {"code": "NL", "note": "ASML lithography, the hardest single chokepoint in the chain"},
      {"code": "JP", "note": "Photoresist, silicon wafers, etch and clean tools, and Rapidus"}
    ],
    "chinaStatus": "Blocked at the leading edge and substituting fast below it. Domestic tools went from 25 percent of China's own equipment market in 2024 to 35 percent in 2025, and about 40 percent in etch and deposition; SMIC runs 7 nm-class logic without EUV at roughly 45,000 advanced-node wafers a month; CXMT's 2026 HBM output covers 250,000 to 300,000 Ascend packages. No EUV, no HBM at scale, no path to either before 2028.",
    "usStatus": "Holds design, EDA and most process tools, and uses the Foreign Direct Product Rule to reach foreign-made goods. Has traded parts of the fence for revenue and investment since 2025: an expected 15 percent cut of licensed H20 sales, a 9.9 percent equity stake in Intel, a 25 percent tariff on advanced chips, and case-by-case H200 licences.",
    "costSignal": "$52.7B authorised under the CHIPS Act against about $47B in the latest round of China's Big Fund alone",
    "substitution": {"years": "10+", "why": "China can copy mature tools in three to five years, but EUV optics, EUV resist and HBM stacking each took two decades and a supplier ecosystem that a single national programme cannot conjure."}
  },
  "keyFacts": [
    {"fact": "Taiwan's foundries hold 78% of the global foundry market and 92% of the manufacturing capacity for the most advanced chips", "source": "https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/"},
    {"fact": "ASML's China share of net system sales fell from 41% in 2024 to 33% in 2025", "source": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"},
    {"fact": "The 2 December 2024 rules covered 24 types of equipment and 3 software tools, added HBM controls, and made 140 Entity List additions", "source": "https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military"},
    {"fact": "From 15 January 2026 the H200 and MI325X are reviewed case by case for China, capped at 50% of US shipments", "source": "https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities"},
    {"fact": "The US government holds 433.3 million Intel shares, a 9.9% stake bought at $20.47 for $8.9 billion", "source": "https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to"},
    {"fact": "The latest round of China's Big Fund reached $47 billion", "source": "https://www.rand.org/pubs/perspectives/PEA4012-1.html"},
    {"fact": "Chinese-made tools went from 10-15% of China's domestic equipment market before 2022 to 25% in 2024 and 35% in 2025, and about 40% in etch and deposition", "source": "https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls"},
    {"fact": "SMIC's capacity at 7 nm and below is estimated at 45,000 wafers a month at end-2025, rising to 60,000 in 2026; Huawei shipped about 805,000 Ascend units in 2025", "source": "https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp"},
    {"fact": "Applied Materials paid a $252 million BIS penalty in February 2026 over $126 million of ion implanters shipped to an Entity-Listed Chinese customer", "source": "https://www.bis.gov/press-release/applied-materials-pay-252-million-penalty-bis-illegally-exporting-semiconductor-manufacturing-equipment"},
    {"fact": "TSMC's Arizona commitment reached $265 billion on 16 July 2026 after a second $100 billion tranche for at least four more 2 nm-class fabs", "source": "https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html"}
  ],
  "figures": [
    {
      "id": "china-tool-revenue",
      "type": "bars",
      "title": "China's share of revenue at the four largest chip-tool makers, peak year and latest",
      "unit": "%",
      "data": [["ASML, 2024", 41], ["ASML, 2025", 33], ["Applied Materials, FY2024", 37], ["Applied Materials, FY2025", 30], ["Lam Research, FY2024", 42], ["Lam Research, FY2025", 34], ["Tokyo Electron, Q4 FY2024", 47], ["Tokyo Electron, Q4 FY2026", 27]],
      "source": {"label": "ASML Q4 2025 investor presentation, Applied Materials and Lam Research 10-K filings, Tokyo Electron Q4 FY2026 results", "url": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"}
    },
    {
      "id": "chips-awards",
      "type": "bars",
      "title": "CHIPS Act direct funding awarded, by firm, as of July 2025",
      "unit": "$B",
      "data": [["Intel", 7.865], ["Micron", 6.44], ["TSMC", 6.565], ["Samsung", 4.745], ["Texas Instruments", 1.61], ["GlobalFoundries", 1.587], ["SK hynix", 0.458], ["Amkor", 0.407], ["GlobalWafers", 0.406], ["Hemlock Semiconductor", 0.325]],
      "source": {"label": "GAO-26-107882, Semiconductors: Information on Projects Funded to Strengthen U.S. Supply Chain", "url": "https://files.gao.gov/reports/GAO-26-107882/index.html"}
    },
    {
      "id": "control-timeline",
      "type": "timeline",
      "title": "Eight rule changes that shaped the regime",
      "data": [
        ["2019-05-16", "Huawei and 68 affiliates added to the Entity List"],
        ["2022-10-07", "First country-wide controls on AI chips and fab tools"],
        ["2023-10-17", "Performance density added; A800 and H800 captured"],
        ["2024-12-02", "24 tool types, HBM controls, 140 entity listings"],
        ["2025-01-15", "AI Diffusion rule published, three country tiers"],
        ["2025-05-13", "AI Diffusion rescinded"],
        ["2025-08-11", "US officials seek 15% of licensed H20 sales"],
        ["2026-01-13", "H200 and MI325X moved to case-by-case review"]
      ],
      "source": {"label": "BIS press releases and Federal Register rules", "url": "https://www.bis.gov/news-updates"}
    }
  ]
}
---
# Geopolitics

Since 2018 Washington has turned this supply chain into a control regime, and Beijing has built an answer. Neither is finished.

## The shape of the contest

An export control is a licence requirement, not a ban on ideas. It tells a company that a named item cannot be shipped to a named buyer without a government's permission, and Washington extends that rule to foreign-made goods built with American technology. A handful of countries can enforce it because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines in a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.

In 2022 the goal changed from staying a generation ahead to "as large a lead as possible", advertised as a small yard with a high fence ([source](https://www.csis.org/analysis/where-chips-fall-us-export-controls-under-biden-administration-2022-2024)). The October rules that followed were meant to push China backwards, not merely slow its growth ([source](https://www.csis.org/analysis/choking-chinas-access-future-ai)).

The yard has not stayed small. Licensing once asked who was buying and why; country-wide prohibition asks only where the box is going.

## Chokepoints and who holds them

| Segment | Leader | Share | Basis |
|---|---|---|---|
| EUV lithography | Netherlands | 100% | revenue, 2025 |
| DUV lithography | Netherlands | 95% | revenue, 2025 |
| Metrology and inspection | United States | 72% | revenue, 2025 |
| Deposition | United States | 60% | revenue, 2025 |
| Etch and clean | United States | 53% | revenue, 2025 |
| Photoresist | Japan | 75% | revenue, 2024 |
| Silicon wafers | Japan | 51% | revenue, 2025 |
| The most advanced logic | Taiwan | 92% | capacity, 2025 |
| Foundry, all nodes | Taiwan | 78% | market share, 2025 |
| HBM | South Korea | 56% | SK hynix alone, revenue, 1Q26 |
| AI accelerator design | United States | 93% | revenue, 2025 |
| Logic at 28 nm and above | China | 38% | capacity, 2025 |

- **Equipment.** CSET's ETO Supply Chain Explorer, TechInsights 2025 revenue by parent-company headquarters ([source](https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv)).
- **Materials.** CSET's 2021 segment map ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)).
- **Taiwan.** The Stimson Center's count of Taiwanese foundry share and of capacity for the most advanced chips ([source](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)).
- **Memory.** SK hynix's US listing prospectus, which puts its own HBM share at 56.4 percent of revenue and its DRAM share at 29.1 percent in the first quarter of 2026 ([source](https://www.sec.gov/Archives/edgar/data/0002120882/000119312526299963/d32785d424b4.htm)). Samsung holds most of the rest of the Korean HBM position, unsplit by any source we trust.
- **Design and mature nodes.** CSIS ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)).

Advanced packaging belongs in that table and is missing from it. Nobody publishes a capacity split, and TSMC will not give one.

No country in the table is independent, which is why controls work and why they hurt whoever imposes them.

## The US export-control campaign, 2018 to today

The regime was built one rule at a time, each closing a gap the last one left.

- **17 August 2020, the Foreign Direct Product Rule.** The Entity List cut Huawei and 68 affiliates off from US technology in May 2019 ([source](https://www.federalregister.gov/documents/2019/05/21/2019-10616/addition-of-entities-to-the-entity-list)), so Huawei bought foreign-made chips instead; Commerce then extended the restriction to any foreign item made with US technology and bound for Huawei ([source](https://www.federalregister.gov/documents/2020/08/20/2020-18213/addition-of-huawei-non-us-affiliates-to-the-entity-list-the-removal-of-temporary-general-license-and)). That is what makes American controls extraterritorial, and everything since is a variation on it.
- **7 October 2022, the break.** New ECCNs 3A090 and 3B090 capped exportable AI chips and set fab thresholds at 16 nm FinFET logic, 18 nm half-pitch DRAM and 128-layer NAND ([source](https://www.csis.org/analysis/choking-chinas-access-future-ai)). They also barred US persons from servicing advanced Chinese fabs, emptying them of American engineers within days ([source](https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor)).
- **17 October 2023, the density fix.** Chip designers had tuned interconnect speed to slip under the 2022 line while keeping the compute, so BIS deleted that parameter and put two in its place: total processing performance and performance density. A data-centre chip now needs a licence at 4,800 TPP, or at 1,600 TPP with a density of 5.92 ([source](https://cset.georgetown.edu/article/bis-2023-update-explainer/)).
- **2 December 2024, the widest package.** 24 equipment types, three software tools, the first controls on high-bandwidth memory and 140 Entity List additions ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)).
- **15 January 2025, AI Diffusion.** A rule sorting the world into three tiers of compute allocation ([source](https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion)), pulled on 13 May, two days before compliance began ([source](https://www.bis.gov/press-release/department-commerce-announces-rescission-biden-era-artificial-intelligence-diffusion-rule-strengthens)). No tiered replacement has appeared since.

The H20 sequence shows the drift. On 9 April 2025 the government told Nvidia it needed a licence to ship the H20 to China, to D:5 countries, and to any company headquartered or ultimately owned there ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000082/nvda-20250409.htm)). That last clause matters: the rule follows ownership, so a Chinese firm cannot buy through a subsidiary abroad. Nvidia took a $4.5 billion charge on stock it could no longer sell. Licences came back in August, and with them a price. US officials, the filing says, "have expressed an expectation that the USG will receive 15% of the revenue generated from licensed H20 sales". No regulation codifies it ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000209/nvda-20250727.htm)).

Three moves have set the current settlement.

- **13 January 2026.** BIS moved the H200 and AMD MI325X to case-by-case review, with third-party testing and a cap at 50 percent of what the exporter ships to US customers ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)).
- **15 January 2026.** A Section 232 proclamation put a 25 percent tariff on the same class of chips, then exempted almost every American use of them, from data centres and research to startups and the public sector ([source](https://www.federalregister.gov/documents/2026/01/20/2026-01052/adjusting-imports-of-semiconductors-semiconductor-manufacturing-equipment-and-their-derivative)).
- **12 February 2026.** Applied Materials paid $252 million, the statutory maximum, over $126 million of ion implanters routed through Korea to an Entity-Listed Chinese customer ([source](https://www.bis.gov/press-release/applied-materials-pay-252-million-penalty-bis-illegally-exporting-semiconductor-manufacturing-equipment)).

{{figure:control-timeline}}

## Allies: the Netherlands, Japan, Korea and Europe

Unilateral tool controls would only transfer the sales, so the campaign has always depended on The Hague and Tokyo.

- **The Netherlands.** Licensing of advanced DUV took effect on 1 September 2023, widened in September 2024 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)), and from 1 April 2025 reached measurement and inspection tools, moving the fence beyond lithography ([source](https://www.government.nl/latest/news/2025/01/15/klever-export-controls-on-advanced-semiconductor-manufacturing-equipment-to-be-tightened)).
- **Japan.** Controls on advanced manufacturing equipment took effect on 23 July 2023 and apply regardless of destination rather than naming China ([source](https://www.csis.org/analysis/csis-translation-updated-japanese-export-controls-high-performance-semiconductor)).
- **South Korea.** BIS revoked the Validated End-User status that let Samsung, SK hynix and Intel run their China fabs without individual licences, effective 31 December 2025. It will license them to keep those fabs running; it will not license expansion or a technology upgrade ([source](https://www.federalregister.gov/documents/2025/09/02/2025-16735/revocation-of-validated-end-user-authorizations-in-the-peoples-republic-of-china)).

On 30 September 2025, the day a BIS rule extended entity-list restrictions to any subsidiary half-owned by a listed firm ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)), the Dutch economy minister invoked the Goods Availability Act against Nexperia, the Nijmegen chipmaker whose parts run European car lines, citing governance failures that threatened to move technology off European soil ([source](https://www.government.nl/latest/news/2025/10/12/minister-of-economic-affairs-invokes-goods-availability-act)). Both measures lasted about six weeks. BIS suspended its rule for a year on 10 November ([source](https://www.federalregister.gov/documents/2025/11/12/2025-19846/one-year-suspension-of-expansion-of-end-user-controls-for-affiliates-of-certain-listed-entities)); the minister suspended his order on 19 November ([source](https://www.government.nl/documents/2025/11/19/update-on-invoking-goods-availability-act)). Europe's leverage at the leading edge does not reach the mature nodes its car industry runs on.

The MATCH Act, introduced on 8 April 2026, would ban immersion DUV sales to China, name CXMT, Hua Hong, Huawei, SMIC and YMTC in statute, and give allies 150 days to match before the US extends the Foreign Direct Product Rule alone ([source](https://www.foreign.senate.gov/press/rep/release/risch-ricketts-kim-introduce-match-act-level-the-global-playing-field-for-us-tech)).

## China's response

China's retaliation is asymmetric by design: it does not attack chips, it attacks the inputs beneath them. Micron was first, failed in a Cyberspace Administration security review on 21 May 2023 and cut off from critical infrastructure buyers ([source](https://www.csis.org/analysis/micron-aggression-right-response-beijings-ban-us-chipmaker)). The minerals followed.

- **3 December 2024.** MOFCOM Notice 46 banned exports of gallium, germanium, antimony and superhard materials to the United States, one day after the American chip rules ([source](https://cset.georgetown.edu/publication/china-rare-earth-export-ban/)).
- **4 April 2025.** Announcement 18 put seven medium and heavy rare earths under licensing: samarium, gadolinium, terbium, dysprosium, lutetium, scandium and yttrium, in metal, alloy, oxide, compound, target and magnet form ([source](https://english.mofcom.gov.cn/Policies/AnnouncementsOrders/art/2025/art_0dd87cbee7b045bf93fabe6ab2faceee.html)).
- **9 October 2025.** A further announcement reached foreign-made goods containing Chinese rare earths worth 0.1 percent or more of their value, which put an export licence between a foreign firm and its own product ([source](https://cset.georgetown.edu/publication/mofcom-notice-2025-61/)).
- **November 2025.** After Trump and Xi met at APEC, MOFCOM suspended the gallium ban for a year ([source](https://www.csis.org/analysis/us-china-trade-truce-has-not-solved-gallium-problem)).

Nothing was repealed. One ban was paused for twelve months; the licensing regimes stand.

The blunter lever is demand. Beijing has told its buyers to look elsewhere, and Nvidia's own filing records the result: Chinese regulators discouraged customers from buying, importing or using its data-centre products, and endorsed an action plan setting performance-per-watt and memory-bandwidth standards for accelerators in new and renovated Chinese data centres. When Washington did license H200 sales in February 2026, Beijing restricted them, and the shipments Nvidia managed came to less than 1 percent of data-centre revenue ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)). That quarter's data-centre revenue was $89.0 billion, and the next quarter's guidance assumed no China compute revenue at all ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)).

Chinese tool vendors went from 10 to 15 percent of their home market before 2022 to 25 percent in 2024 and 35 percent in 2025, and hold about 40 percent of domestic etch and deposition ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)).

The leading edge is where it stalls. SMIC runs 7 nm-class logic on multipatterned immersion DUV at an estimated 45,000 advanced-node wafers a month, and Huawei shipped about 805,000 Ascend units in 2025. The binding constraint is memory. A stockpile of roughly 13 million HBM stacks, most bought before the December 2024 rules bit, supports about 1.6 million Ascend 910C packages; CXMT's own HBM should reach about 2 million stacks in 2026, enough for 250,000 to 300,000 more ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)). Logic is not the wall. Memory is.

{{figure:china-tool-revenue}}

## Industrial policy: CHIPS, Rapidus, Big Fund and the rest

The CHIPS and Science Act authorised about $52.7 billion ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)), of which $30.9 billion of direct funding had gone to 19 companies for 40 projects by July 2025. The awards cover between 4.6 and 38.8 percent of each project's capital cost, a median of 14.2 percent ([source](https://files.gao.gov/reports/GAO-26-107882/index.html)).

On 22 August 2025 the government converted $5.7 billion of unpaid Intel grants and $3.2 billion of Secure Enclave money into a 9.9 percent stake worth $8.9 billion ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Subsidy became equity.

Tariffs became the second instrument. The 2026 US-Taiwan trade agreement cuts the tariff on Taiwanese goods to 15 percent in exchange for at least $250 billion of Taiwanese investment in US chip production ([source](https://www.cfr.org/articles/u-s-taiwan-trade-agreement-leaves-major-questions-open)). On 16 July 2026 TSMC added $100 billion for four more Arizona fabs at 2 nm and below, taking that campus to $265 billion ([source](https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html)), more than the whole CHIPS Act, spent by one foreign firm to stay on the right side of a tariff schedule.

Europe's first Chips Act did not produce a leading-edge fab, and the Chips Act 2.0 proposal adopted on 3 June 2026 widens state aid and shifts the emphasis from supply to demand without changing that ([source](https://digital-strategy.ec.europa.eu/en/library/proposal-chips-act-20)). Japan chose a national champion instead: Rapidus verified 2 nm gate-all-around transistors on its Chitose pilot line in 2025 and raised another 267.6 billion yen, about $1.7 billion, targeting mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

China spends more and spends differently. The latest round of its National Integrated Circuit Industry Investment Fund, the Big Fund, reached $47 billion ([source](https://www.rand.org/pubs/perspectives/PEA4012-1.html)). Cumulative state funding since 2014 is estimated at $150 billion, roughly triple the CHIPS authorisation ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). It has not bought a leading-edge node, but it has bought a domestic tool industry.

{{figure:chips-awards}}

## Taiwan

Taiwan is the concentration risk that no policy has reduced. Its foundries hold 78 percent of the world's foundry market and 92 percent of the capacity for the most advanced chips, and 2 nm runs nowhere else ([source](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)). The packaging is on the island too. Asked in October 2025 how much CoWoS capacity he would add, TSMC's chairman would only say the company was "working very hard to narrow the gap between the demand and supply", and that front-end and back-end capacity alike were "very tight" ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)). Every current AI accelerator passes through both.

The silicon shield argument holds that this concentration deters invasion, because destroying TSMC would cost an aggressor more than the island is worth. The counter is that a shield which depends on staying irreplaceable gives Taipei reason to slow the diversification its security guarantor wants. Taipei has acted on it: Taiwan bars the overseas production of its most advanced chips, so what TSMC builds in the United States runs a generation behind what it builds at home, and Arizona is not expected to reach 2 nm before 2028 ([source](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)).

Arizona narrows the gap in wafers, and TSMC has two advanced packaging fabs planned there, behind an OSAT partner already breaking ground ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)). A fab without its Taiwanese mask shops, chemical suppliers and trained crews is still not a substitute. We think the shield is real but decaying, and the decay is faster than the diversification.

## Where the chips go: the Gulf, Southeast Asia, and smuggling

With the fence up, the question is who stands inside it. The Gulf bought in. In November 2025 Commerce authorised G42 of the UAE and HUMAIN of Saudi Arabia to buy up to 35,000 Nvidia GB300s each, on security and reporting conditions that BIS monitors ([source](https://www.commerce.gov/news/press-releases/2025/11/statement-uae-and-saudi-chip-exports)). On 10 July 2026 the UAE moved out of Country Groups D:3 and D:4 into A:5, opening licence-free 3A090 and 4A090 exports to the UAE government and a named list including G42 and the US hyperscalers, with no quantity cap ([source](https://www.federalregister.gov/documents/2026/07/14/2026-14132/enhanced-favorable-treatment-for-the-united-arab-emirates-under-the-export-administration)). Saudi Arabia still works licence by licence.

Southeast Asia is the leak. Since 14 July 2025 Malaysia has required a permit to export, tranship or move in transit any high-performance US-origin AI chip, and 30 days' notice under the catch-all clause of its Strategic Trade Act ([source](https://www.miti.gov.my/miti/resources/Media%20Release/%5BFINAL%5D_MITI_Press_Stmt_Malaysia_Regulates_Trade_of_US_AI_Chips_2025-07-14.pdf)). On 25 March 2026 the Justice Department charged three people over about $170 million of servers bought in the names of Thai front companies for delivery to China ([source](https://www.justice.gov/opa/pr/chinese-national-and-two-us-citizens-charged-conspiring-smuggle-artificial-intelligence)).

The House Select Committee's median estimate is 140,000 chips smuggled to PRC entities in 2024 ([source](https://chinaselectcommittee.house.gov/media/press-releases/protecting-us-tech-china-committee-and-bipartisan-bicameral-leaders-unite-to-stop-ccp-ai-chip-smuggling)). Congress's answer, the Chip Security Act, would make Commerce fit location verification to controlled chips within 180 days of enactment, and make exporters report a chip they learn has been diverted or tampered with ([source](https://www.congress.gov/bill/119th-congress/senate-bill/1705/text)). The House Foreign Affairs Committee passed it 42-0 on 26 March 2026 ([source](https://huizenga.house.gov/news/documentsingle.aspx?DocumentID=404259)). It is not law yet.

## Predicted winners

Our judgment, not a source's.

- **Taiwan and Korea keep what they hold.** Nothing in the policy stack moves leading-edge logic, HBM or CoWoS out of two islands and a peninsula before 2030. Reshoring adds capacity elsewhere; it does not subtract it there.
- **The Netherlands and Japan gain leverage and lose revenue.** Their tool makers are the fence, and they pay for it: Tokyo Electron's China share fell from 47.4 to 26.8 percent of quarterly sales in two years ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).
- **The United States wins the top of the stack, not the middle.** It holds 93 percent of accelerator design revenue and will keep it; it has not built a wafer, HBM or OSAT industry, and $31 billion of grants will not.
- **China wins the bottom and stalls at the top.** Mature nodes, sub-leading-edge tools, DRAM and NAND are going domestic on a visible timetable; EUV, EUV resist and HBM at scale are not, and the stockpile arithmetic caps Ascend output near a million units a year.
- **The Gulf is the surprise winner.** UAE entities now buy advanced compute licence-free while European ones do not. Capital and alignment beat industrial base.
- **The clearest loser is the idea of a small yard.** A 25 percent tariff, an expected 15 percent cut of licensed sales, a 9.9 percent equity stake and a case-by-case licence queue are industrial policy, not a narrow security perimeter.

## What to watch

- **November 2026.** Whether China renews the one-year suspension of its gallium ban, or lets it snap back ([source](https://www.csis.org/analysis/us-china-trade-truce-has-not-solved-gallium-problem)).
- **The MATCH Act's 150-day clock.** If it passes, allied divergence on DUV becomes a statutory deadline ([source](https://www.foreign.senate.gov/press/rep/release/risch-ricketts-kim-introduce-match-act-level-the-global-playing-field-for-us-tech)).
- **CXMT's HBM ramp.** Domestic HBM, not logic wafers, is the constraint on Chinese accelerator volume ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)).
- **SMIC's advanced-node ramp.** 45,000 wafers a month at end-2025, an estimated 60,000 in 2026 and 80,000 in 2027, all of it multipatterned without EUV. Whether the yield holds as the node shrinks is the number to watch ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)).
- **Taiwan's ban on making its newest chips abroad, against the $250 billion investment commitment.** The two policies point in opposite directions and one will give.

## Takeaways

A dozen points in the chain are held by one or two countries, and export controls are the attempt to convert them into policy. They have held China below the leading edge, where EUV, EUV resist and high-bandwidth memory remain out of reach, and have not stopped substitution beneath it, where domestic tools now take a third of China's own market. The Netherlands and Japan have paid for it, their toolmakers' China revenue falling by a third or more in two years. What began as a small yard is now tariffs, equity stakes and a revenue share, and none of it has moved leading-edge logic or packaging out of Taiwan.
