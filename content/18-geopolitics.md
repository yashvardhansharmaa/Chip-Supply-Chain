---json
{
  "id": "geopolitics",
  "number": 18,
  "title": "Geopolitics",
  "oneLiner": "Every stage in this chain sits in someone's jurisdiction. Since 2018 the United States has been converting that fact into policy, and China has been building an answer.",
  "specimen": "globe",
  "specimenCaption": "Right: the world with the chain's chokepoint sites marked. Veldhoven and Oberkochen for lithography, Hsinchu and Tainan for leading-edge logic, Icheon and Pyeongtaek for HBM, Shanghai and Wuhan for China's substitution effort, and the Gulf and Southeast Asian nodes where the finished accelerators now flow.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "United States", "country": "US", "share": "93% of AI accelerator design revenue; 72% of process control and 60% of deposition tool revenue"},
      {"name": "Taiwan", "country": "TW", "share": "72% of sub-5 nm logic capacity; TSMC runs roughly two-thirds of world CoWoS capacity"},
      {"name": "China", "country": "CN", "share": "38% of 28 nm-and-above logic capacity; about 10% of deposition and etch tool revenue"},
      {"name": "Netherlands", "country": "NL", "share": "100% of EUV and 95% of DUV lithography revenue"},
      {"name": "South Korea", "country": "KR", "share": "83% of HBM revenue and 63% of DRAM revenue"}
    ],
    "countries": [
      {"code": "US", "note": "Design, EDA, three of five tool segments, and the export-control authority itself"},
      {"code": "TW", "note": "Leading-edge logic and advanced packaging, and the physical risk"},
      {"code": "CN", "note": "Mature-node capacity, critical minerals, and the target of the whole regime"},
      {"code": "NL", "note": "ASML lithography, the hardest single chokepoint in the chain"},
      {"code": "JP", "note": "Photoresist, silicon wafers, etch and clean tools, and Rapidus"}
    ],
    "chinaStatus": "Blocked at the leading edge and substituting fast below it. Domestic tools took 25 to 35 percent of China's own equipment market by 2025 and about 40 percent in etch and deposition; SMIC runs 7 nm-class logic without EUV at roughly 45,000 advanced-node wafers a month; CXMT passed 10 percent of global DRAM. No EUV, no HBM at scale, no path to either before 2028.",
    "usStatus": "Holds design, EDA and most process tools, and uses the Foreign Direct Product Rule to reach foreign-made goods. Has traded parts of the fence for revenue and investment since 2025: a 15 percent cut of H20 sales, a 9.9 percent equity stake in Intel, a 25 percent tariff on advanced chips, and case-by-case H200 licences.",
    "costSignal": "$52.7B authorised under the CHIPS Act against 344 billion yuan, about $47.5B, in China's Big Fund III alone",
    "substitution": {"years": "10+", "why": "China can copy mature tools in three to five years, but EUV optics, EUV resist and HBM stacking each took two decades and a supplier ecosystem that a single national programme cannot conjure."}
  },
  "keyFacts": [
    {"fact": "Taiwan holds about 72% of global logic capacity at 5 nm and below", "source": "https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf"},
    {"fact": "ASML's China share of net system sales fell from 41% in 2024 to 33% in 2025", "source": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"},
    {"fact": "Tokyo Electron's China share fell from 47.4% of Q4 FY2024 sales to 26.8% in Q4 FY2026", "source": "https://www.investing.com/news/company-news/tokyo-electron-fy2026-slides-q4-beats-fuel-40-growth-outlook-93CH-4654520"},
    {"fact": "The 2 December 2024 rules covered 24 types of equipment and 3 software tools, added HBM controls, and made 140 Entity List additions", "source": "https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military"},
    {"fact": "From 15 January 2026 the H200 and MI325X are reviewed case by case for China, capped at 50% of US shipments", "source": "https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities"},
    {"fact": "The US government holds 433.3 million Intel shares, a 9.9% stake bought at $20.47 for $8.9 billion", "source": "https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to"},
    {"fact": "China's Big Fund III was registered at 344 billion yuan, about $47.5 billion, in May 2024", "source": "https://www.caixinglobal.com/2024-05-28/china-piles-475-billion-into-big-fund-iii-to-boost-chip-development-102200633.html"},
    {"fact": "Chinese-made tools went from 10-15% of China's domestic equipment market before 2022 to 25-35% in 2024-25, and about 40% in etch and deposition", "source": "https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls"},
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
      "source": {"label": "Company filings and investor presentations, compiled", "url": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"}
    },
    {
      "id": "chips-awards",
      "type": "bars",
      "title": "CHIPS Act direct funding awarded, by firm",
      "unit": "$B",
      "data": [["Intel", 7.87], ["TSMC", 6.6], ["Micron", 6.2], ["Samsung", 4.7], ["Texas Instruments", 1.6], ["GlobalFoundries", 1.5], ["SK hynix", 0.458], ["Amkor", 0.407], ["GlobalWafers", 0.406], ["Hemlock Semiconductor", 0.325]],
      "source": {"label": "Manufacturing Dive CHIPS award tracker", "url": "https://www.manufacturingdive.com/news/chips-and-science-act-tracker-semiconductor-manufacturing/734039/"}
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
        ["2025-08-11", "15% revenue share attached to H20 licences"],
        ["2026-01-13", "H200 and MI325X moved to case-by-case review"]
      ],
      "source": {"label": "BIS press releases and Federal Register rules", "url": "https://www.bis.gov/news-updates"}
    }
  ]
}
---
# Geopolitics

The seventeen chapters before this one describe a supply chain. This one describes what governments have done with it. Since 2018 the United States has been converting a set of industrial facts, which country makes which machine, into a control regime. China has been building an answer. Neither is finished, and the shape of the AI industry for the next decade depends on how far each gets.

## The shape of the contest

The American premise is simple. AI capability is a function of compute, compute is a function of a small number of physical inputs, and most of those inputs pass through countries that will take a call from Washington.

CSET's 2021 map of the chain is the document that made this legible. It broke the industry into segments and gave a country share for each, and the finding has held for five years: a handful of segments have one or two countries holding most of the market, and those are the places where policy has leverage ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)).

The strategic goal changed in 2022. In September of that year the national security adviser said the United States would seek "as large a lead as possible" in force-multiplier technologies, replacing decades of policy that aimed only at staying a generation or two ahead ([source](https://www.csis.org/analysis/where-chips-fall-us-export-controls-under-biden-administration-2022-2024)). "Small yard, high fence" was the intended shape: restrict the narrow set of things that decide national security, leave the rest of the trade alone ([source](https://www.csis.org/analysis/where-chips-fall-us-export-controls-under-biden-administration-2022-2024)).

Gregory Allen's reading of the October 2022 rules is the standard one. They attacked four chokepoints at once, AI chip sales, EDA software, manufacturing equipment, and the components inside that equipment, and they were written to push China's capability below where it already stood rather than merely slow its growth ([source](https://www.csis.org/analysis/choking-chinas-access-future-ai)).

The yard has not stayed small. The regime moved from end-use licensing, where the question was who is buying and why, to country-wide prohibitions, where the question is only where the box is going.

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
| Logic at 5 nm and below | Taiwan | 72% | capacity, 2025 |
| 2.5D advanced packaging | Taiwan | 60-75% | TSMC capacity share, 2026 |
| HBM | South Korea | 83% | revenue, 2026 |
| AI accelerator design | United States | 93% | revenue, 2025 |
| Logic at 28 nm and above | China | 38% | capacity, 2025 |

Equipment shares come from CSET's ETO Supply Chain Explorer using TechInsights 2025 data ([source](https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv)); materials from CSET's 2021 segment map ([source](https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/)); leading-edge logic capacity from SIA and BCG ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)); HBM and DRAM from Counterpoint's Q2 2026 count, which puts SK hynix at 50 percent of HBM revenue and Samsung at 33 ([source](https://counterpointresearch.com/en/insights/global-dram-and-hbm-market-share)); accelerator design and mature-node capacity from CSIS ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). The packaging row is this site's estimate rather than a published figure: TSMC is expected to run 120,000 to 140,000 CoWoS wafers a month in 2026 against 50,000 to 60,000 at its OSAT partners, and almost all of TSMC's is in Taiwan ([source](https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/)).

Read down the column and the structure of the contest falls out. The United States holds design and three of five tool categories. The Netherlands holds the one machine nobody can copy. Japan holds the consumables. Korea holds the memory. Taiwan holds the manufacturing. China holds the low end and the minerals underneath everything. No country holds enough to be independent, which is why controls work at all and also why they hurt the country imposing them.

## The US export-control campaign, 2018 to today

The first move was an entity listing, not a chip rule. Huawei and 68 affiliates went onto the Entity List effective 16 May 2019 with a presumption of denial on everything subject to US regulation ([source](https://www.federalregister.gov/documents/2019/05/21/2019-10616/addition-of-entities-to-the-entity-list)). That alone did not work, because Huawei bought foreign-made chips instead. So on 17 August 2020 Commerce extended the Foreign Direct Product Rule to any foreign item made with US technology and destined for Huawei, and added 38 more affiliates ([source](https://www.federalregister.gov/documents/2020/08/20/2020-18213/addition-of-huawei-non-us-affiliates-to-the-entity-list-the-removal-of-temporary-general-license-and)). The FDP rule is the instrument that makes American controls extraterritorial, and everything after this is a variation on it.

The 7 October 2022 package was the break. It created ECCNs 3A090 and 3B090, restricted chips above 300 tera-operations per second with 600 GB/s or faster interconnect, and set fab thresholds at 16 nm FinFET logic, 18 nm half-pitch DRAM and 128-layer NAND ([source](https://www.csis.org/analysis/choking-chinas-access-future-ai)). It also barred US persons from supporting advanced Chinese fabs without a licence, which pulled American engineers out of Chinese fabs within days ([source](https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor)).

Nvidia answered with the A800 and H800, which cut interconnect bandwidth below the line while keeping the compute. The 17 October 2023 update closed that. It replaced the old metric with total processing performance and added performance density, so a chip cannot escape by spreading the same compute over a larger die: 3A090.a now catches anything at 4,800 TPP or above, or at 1,600 TPP with performance density of 5.92 or above ([source](https://www.klgates.com/US-Government-Revises-Comprehensive-Export-Controls-on-Semiconductors-and-Semiconductor-Manufacturing-Equipment-10-27-2023)). It took effect on 17 November 2023 and extended the country scope well beyond China and Macau ([source](https://www.federalregister.gov/documents/2023/10/25/2023-23055/implementation-of-additional-export-controls-certain-advanced-computing-items-supercomputer-and)).

The 2 December 2024 package was the widest. It added 24 types of semiconductor manufacturing equipment and three software tools, controlled high-bandwidth memory for the first time, created two new foreign direct product rules, and made 140 Entity List additions across Chinese toolmakers, fabs and investment vehicles ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)).

Then the regime became unstable. The AI Diffusion rule, published 15 January 2025, would have put the whole world into three tiers, with a cumulative allocation of 790 million TPP through 2027 for tier-two countries ([source](https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion)). It was rescinded on 13 May 2025 before its compliance date, alongside guidance warning that using Huawei Ascend chips anywhere risked violating US rules ([source](https://www.bis.gov/press-release/department-commerce-announces-rescission-biden-era-artificial-intelligence-diffusion-rule-strengthens)).

The H20 sequence is the clearest illustration of the drift. On 9 April 2025 the government told Nvidia the H20 needed a licence for China, made it indefinite on 14 April, and cost Nvidia up to $5.5 billion in charges ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000082/nvda-20250409.htm)). Licences resumed in July. On 11 August 2025 Nvidia and AMD agreed to hand the US government 15 percent of their China revenue on the H20 and MI308 in exchange for those licences, an arrangement several members of Congress called an unconstitutional export tax ([source](https://www.pbs.org/newshour/politics/under-new-unusual-agreement-u-s-will-get-a-15-cut-of-nvidia-and-amd-chip-sales-to-china)).

Beijing then removed the demand. In September 2025 the Cyberspace Administration barred ByteDance, Alibaba and others from buying the RTX Pro 6000D, the part Nvidia had designed specifically to fit under the threshold using GDDR7 instead of HBM ([source](https://www.trendforce.com/news/2025/09/23/news-china-reportedly-blocks-nvidia-rtx-pro-6000d-samsung-sk-hynix-impact-seen-as-limited/)).

The current settlement dates from 13 January 2026, when BIS moved the H200 and AMD MI325X from presumption of denial to case-by-case review, subject to third-party testing, know-your-customer controls, and a cap of 50 percent of what the exporter ships to US customers ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)). The next day a Section 232 proclamation put a 25 percent tariff on the same class of chips, effective 15 January 2026, with exemptions for US data centres, research and startups ([source](https://globaltaxnews.ey.com/news/2026-0209-us-section-232-proclamation-imposes-25-percent-tariff-on-certain-semiconductors)). On 1 June 2026 BIS clarified that the licence requirement follows ownership, so Chinese-headquartered firms cannot buy Blackwell-class parts through overseas subsidiaries ([source](https://www.aljazeera.com/economy/2026/6/1/us-says-ban-on-ai-chip-shipments-applies-to-chinese-firms-outside-china)). Blackwell itself has never been licensed for China.

Enforcement caught up in parallel. On 12 February 2026 Applied Materials agreed to pay $252 million, the statutory maximum, over roughly $126 million of ion implanters routed through Korea to an Entity-Listed Chinese customer ([source](https://www.bis.gov/press-release/applied-materials-pay-252-million-penalty-bis-illegally-exporting-semiconductor-manufacturing-equipment)).

{{figure:control-timeline}}

## Allies: the Netherlands, Japan, Korea, Taiwan and Europe

Unilateral controls on tools would only transfer the sales. So the campaign has always depended on The Hague and Tokyo.

Dutch national licensing of advanced DUV took effect on 1 September 2023 and was widened on 6 September 2024 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)). A third expansion announced on 15 January 2025 and effective 1 April 2025 pulled in measurement and inspection equipment, moving the fence beyond lithography for the first time ([source](https://www.government.nl/latest/news/2025/01/15/klever-export-controls-on-advanced-semiconductor-manufacturing-equipment-to-be-tightened)). Japan's controls on advanced semiconductor manufacturing equipment took effect on 23 July 2023 and, unlike the American rules, apply regardless of destination rather than naming China ([source](https://www.csis.org/analysis/csis-translation-updated-japanese-export-controls-high-performance-semiconductor)).

Korea's exposure is different. Samsung and SK hynix ran large fabs inside China under Validated End-User authorisations that let tools flow without individual licences. BIS revoked those authorisations effective 31 December 2025, replacing them with annual licence reviews that permit maintaining existing lines but not expanding capacity or upgrading technology ([source](https://www.trendforce.com/news/2025/12/30/news-samsung-sk-hynix-escape-worst-case-as-china-veu-ends-annual-review-risks-loom)).

Europe learned its own lesson in October 2025. The Dutch government invoked the 1952 Goods Availability Act to take control of Nexperia, a Dutch chipmaker owned by China's Wingtech, days after BIS extended entity-list controls to majority-owned affiliates. China responded by blocking exports from Nexperia's Chinese packaging plants, and European car assembly lines began stopping within weeks. The order was suspended on 19 November 2025 as a goodwill gesture, with the minister retaining the power to reinstate it ([source](https://ioplus.nl/en/posts/dutch-government-suspends-intervention-at-chipmaker-nexperia)). The episode showed that Europe's leverage at the leading edge does not extend to the mature nodes its car industry runs on.

Washington's patience with allied divergence is thinning. The MATCH Act, introduced on 8 April 2026, would impose country-wide prohibitions on DUV immersion sales to China, name CXMT, Hua Hong, Huawei, SMIC and YMTC as covered entities in statute, and give allies 150 days to match before the US extends the Foreign Direct Product Rule unilaterally ([source](https://www.foreign.senate.gov/press/rep/release/risch-ricketts-kim-introduce-match-act-level-the-global-playing-field-for-us-tech)).

## China's response

China's retaliation has been asymmetric by design: it does not attack chips, it attacks the inputs beneath them.

Micron was first. On 21 May 2023 the Cyberspace Administration failed it in a security review and ordered critical information infrastructure operators to stop buying its products, a precedent Beijing has since applied to other US firms ([source](https://www.csis.org/analysis/micron-aggression-right-response-beijings-ban-us-chipmaker)).

The minerals followed. MOFCOM Notice 46 of 3 December 2024 banned exports of gallium, germanium, antimony and superhard materials to the United States outright and tightened end-user checks on graphite, one day after the December 2024 chip rules ([source](https://cset.georgetown.edu/publication/china-rare-earth-export-ban/)). Announcement 18 of 2025 put seven medium and heavy rare earths under licensing, and a package of six further announcements in October 2025 extended controls to processing technology and to foreign-made goods containing Chinese-origin material ([source](https://www.clarkhill.com/news-events/news/china-hits-pause-on-rare-earth-export-controls-and-what-it-means-for-supply-chains/)).

Then both sides stepped back. After the November 2025 leaders' meeting, MOFCOM suspended the six October announcements until 10 November 2026 and the gallium, germanium and antimony ban until 27 November 2026, while the seven-element licensing regime and the ban on exports to US military end users both stay permanently in force ([source](https://www.clarkhill.com/news-events/news/china-hits-pause-on-rare-earth-export-controls-and-what-it-means-for-supply-chains/)). Nothing was repealed. The controls were paused, with the expiry dates published.

Regulatory pressure runs alongside. On 15 September 2025 China's market regulator found Nvidia had violated the conditions attached to its 2020 approval of the $6.9 billion Mellanox acquisition, and escalated to a formal investigation that can end in fines and restrictions on how Nvidia sells in China ([source](https://www.theregister.com/2025/09/15/china_nvidia_antitrust/)).

Demand-side policy has been the most effective lever. Publicly owned computing centres were told in 2025 to source more than half their chips domestically ([source](https://www.scmp.com/tech/tech-war/article/3322119/china-mandates-more-domestic-ai-chips-data-centres-cut-reliance-nvidia)). The result is visible in Nvidia's accounts: first H200 shipments under the new licences amounted to less than 1 percent of $89 billion of quarterly data-centre revenue in the three months to 26 July 2026, and Nvidia's forward guidance still assumes zero China data-centre compute revenue ([source](https://www.scmp.com/tech/big-tech/article/3365383/nvidia-ships-first-h200s-china-forecasts-no-data-centre-computing-revenue)).

Substitution below the leading edge is real and measurable. Chinese tool vendors went from 10 to 15 percent of their home market before 2022 to 25 to 35 percent in 2024 and 2025, passing the Made in China 2025 target, and hold about 40 percent of domestic etch and deposition ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). Naura was the only Chinese firm in the global top ten equipment vendors in 2024, at sixth ([source](https://www.scmp.com/tech/big-tech/article/3302104/chinas-naura-climbs-ranks-worlds-top-chipmaking-equipment-suppliers)). CXMT passed 10 percent of the global DRAM market at roughly 300,000 wafers a month and is sampling HBM3 ([source](https://en.sedaily.com/finance/2026/09/04/chinas-cxmt-tops-10-percent-of-dram-market-nears-sk-hynix)).

The leading edge is where it stalls. SMIC runs 7 nm-class logic on multipatterned immersion DUV at an estimated 45,000 advanced-node wafers a month at end-2025, going to 60,000 in 2026, and Huawei shipped about 805,000 Ascend units in 2025 against 507,000 in 2024. The binding constraint is memory: a stockpile of roughly 13 million HBM stacks, most bought from Samsung in the weeks between the December 2024 announcement and its enforcement date, supports about 1.6 million Ascend 910C packages, and domestic HBM will not close that gap in 2026 ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)). Reported plans to lift combined 7 nm and 5 nm output from fewer than 20,000 wafers a year to 100,000 within two years remain unconfirmed by any official source ([source](https://www.trendforce.com/news/2026/02/25/news-china-reportedly-aims-to-boost-7nm-5nm-output-fivefold-in-two-years-driven-by-smic-and-hua-hong/)). Domestic lithography is further behind still: immersion DUV at single-digit annual volumes and an EUV prototype that has not made a working chip ([source](https://www.tomshardware.com/tech-industry/semiconductors/chinese-chipmaking-tool-roadmap-examined)).

{{figure:china-tool-revenue}}

## Industrial policy: CHIPS, Rapidus, Big Fund and the rest

The CHIPS and Science Act authorised about $52.7 billion ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). Roughly $23 billion of direct funding had been finalised across two dozen awards by mid-2026, led by Intel at $7.87 billion awarded, TSMC at $6.6 billion, Micron at $6.2 billion and Samsung at $4.7 billion ([source](https://www.manufacturingdive.com/news/chips-and-science-act-tracker-semiconductor-manufacturing/734039/)).

The instrument changed in 2025. On 22 August the government converted $5.7 billion of unpaid Intel grants and $3.2 billion of Secure Enclave money into 433.3 million shares at $20.47, a 9.9 percent passive stake worth $8.9 billion, plus a warrant for another 5 percent if Intel drops below majority ownership of its foundry ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)). Subsidy became equity.

Tariffs became the second instrument. The 2026 US-Taiwan trade agreement cuts the reciprocal tariff on Taiwanese goods to 15 percent in exchange for at least $250 billion of Taiwanese investment in US semiconductor production plus $250 billion in credit guarantees ([source](https://www.cfr.org/articles/u-s-taiwan-trade-agreement-leaves-major-questions-open)). TSMC had already taken its Arizona commitment to $165 billion in March 2025 with three more fabs, two packaging plants and an R&D centre ([source](https://evertiq.com/design/2025-03-04-tsmc-details-its-100-billion-arizona-investment)), and on 16 July 2026 added another $100 billion for at least four more fabs at 2 nm and below, taking the campus to $265 billion ([source](https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html)). That is a larger sum than the entire CHIPS Act, spent by one foreign firm to stay on the right side of a tariff schedule.

Japan chose a national champion. Rapidus verified 2 nm gate-all-around transistors on its Chitose pilot line in 2025 and raised a further 267.6 billion yen, about $1.7 billion, in February 2026 from the state technology agency and 32 private firms including Canon, Fujitsu, NTT, SoftBank and Sony, targeting mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

China spends more and spends differently. Big Fund III was registered in May 2024 at 344 billion yuan, about $47.5 billion, from 19 state investors led by the Ministry of Finance, aimed squarely at equipment and materials ([source](https://www.caixinglobal.com/2024-05-28/china-piles-475-billion-into-big-fund-iii-to-boost-chip-development-102200633.html)). Cumulative Chinese state funding since 2014 is estimated at $150 billion, roughly triple the CHIPS authorisation ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). It has not bought a leading-edge node, but it has bought a domestic tool industry.

{{figure:chips-awards}}

## Taiwan

Taiwan is the concentration risk that no policy has reduced. It holds about 72 percent of logic capacity at 5 nm and below ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)), and TSMC alone will run 120,000 to 140,000 CoWoS wafers a month in 2026 against 50,000 to 60,000 at every OSAT partner combined ([source](https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/)). Every current AI accelerator passes through both.

The silicon shield argument holds that this concentration deters invasion, because destroying TSMC would cost the aggressor more than the island is worth. The counter-argument is that a shield which depends on staying irreplaceable gives Taipei an incentive to slow the diversification its main security guarantor wants. Taipei has acted on that incentive. Taiwan's amended Industrial Innovation Act enforces an N-2 rule, allowing overseas fabs only technologies two generations behind the most advanced node running domestically, tightened from the earlier N-1 convention and reaffirmed by the National Science and Technology Council on 18 December 2025 ([source](https://taiwannews.com.tw/news/6267804)).

Both arguments are weaker than they look. Arizona narrows the gap in wafers but not in packaging, and a fab without its Taiwanese supply base, its mask shops, its chemical suppliers and its trained crews is not a substitute. On the CHOKEPOINTS view the shield is real but decaying, and the decay is faster than the diversification.

## Where the chips go: the Gulf, Southeast Asia, and smuggling

Once the fence is up, the interesting question is who stands inside it.

The Gulf bought in. Frameworks agreed during the May 2025 presidential visit were followed on 20 November 2025 by BIS authorisations for up to 35,000 Nvidia GB300s each to G42 of the UAE and HUMAIN of Saudi Arabia, subject to security and reporting conditions ([source](https://www.middleeastainews.com/p/us-approves-up-to-70000-advanced)). On 10 July 2026 the UAE was moved out of Country Groups D:3 and D:4 into A:5, making the government and approved firms eligible for licence-free AI chips and servers ([source](https://www.bis.gov/press-release/department-commerce-eases-export-controls-uae)). That is the first time a non-treaty partner has been granted something close to allied status on compute.

Southeast Asia is the leak. Singapore charged three men in March 2025 over servers containing restricted Nvidia chips declared for Malaysia and diverted elsewhere ([source](https://techcrunch.com/2025/03/03/singapore-arrests-alleged-nvidia-chip-smugglers/)). CSIS estimates individual smuggling operations above $100 million ([source](https://www.csis.org/analysis/where-chips-fall-us-export-controls-under-biden-administration-2022-2024)). Congress's answer is the Chip Security Act, which would require location-verification on exported advanced chips and mandatory diversion reporting; the House Foreign Affairs Committee passed it on 26 March 2026 ([source](https://chinaselectcommittee.house.gov/media/press-releases/house-committee-passes-chip-security-act)).

India is the slowest-moving entrant and the one with the longest horizon. Twelve manufacturing units have been approved under the India Semiconductor Mission, one silicon fab among them, with first fab commissioning targeted for 2028 ([source](https://www.investindia.gov.in/team-india-blogs/semiconductor-opportunity-india-semicon-india-mission-new-fabs-global-partnerships)). It is a packaging and design story this decade, not a fabrication one.

## Predicted winners

This section is the site's judgment, not a source's.

**Taiwan and Korea keep what they hold.** Nothing in the policy stack moves leading-edge logic, HBM or CoWoS out of two islands and a peninsula before 2030. Reshoring adds capacity elsewhere; it does not subtract capacity there.

**The Netherlands and Japan gain leverage and lose revenue.** Their tool makers are the fence, so they are consulted. They also carry the cost: Tokyo Electron's China share fell from 47.4 percent to 26.8 percent of quarterly sales in two years ([source](https://www.investing.com/news/company-news/tokyo-electron-fy2026-slides-q4-beats-fuel-40-growth-outlook-93CH-4654520)).

**The United States wins the top of the stack and does not win the middle.** It holds 93 percent of accelerator design revenue and will keep it. It has not built a wafer industry, an HBM industry or an OSAT industry, and $23 billion of finalised grants will not.

**China wins the bottom and stalls at the top.** Mature nodes, tools below the leading edge, DRAM and NAND are all going domestic on a visible timetable. EUV, EUV resist and HBM at scale are not, and the HBM stockpile arithmetic caps Ascend output near a million units a year until CXMT delivers.

**The Gulf is the surprise winner.** UAE entities now buy advanced compute licence-free while European ones do not. Capital plus alignment beat industrial base.

**The clearest loser is the idea of a small yard.** A 25 percent tariff, a 15 percent revenue share, a 9.9 percent equity stake and a case-by-case licence queue are industrial policy, not a narrow security perimeter.

## What to watch

- **10 and 27 November 2026.** China's suspensions of the October 2025 rare-earth package and the gallium ban expire. Whether they are renewed is the single best read on the state of the relationship ([source](https://www.clarkhill.com/news-events/news/china-hits-pause-on-rare-earth-export-controls-and-what-it-means-for-supply-chains/)).
- **The MATCH Act's 150-day clock.** If it passes, allied divergence on DUV becomes a statutory deadline rather than a negotiation ([source](https://www.foreign.senate.gov/press/rep/release/risch-ricketts-kim-introduce-match-act-level-the-global-playing-field-for-us-tech)).
- **CXMT's HBM3E ramp.** Domestic HBM is the constraint on Chinese accelerator volume, not logic wafers ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)).
- **Whether any Blackwell-class part is ever licensed for China.** The H200 opening was capped and largely unused; the next threshold decision is the real one.
- **SMIC's 5 nm-class yield.** Output plans of 100,000 wafers a year at 7 and 5 nm are unverified, and yield without EUV is the reason to doubt them ([source](https://www.trendforce.com/news/2026/02/25/news-china-reportedly-aims-to-boost-7nm-5nm-output-fivefold-in-two-years-driven-by-smic-and-hua-hong/)).
- **Location verification.** If the Chip Security Act becomes law, every advanced accelerator acquires a reporting obligation, and the smuggling economics change ([source](https://chinaselectcommittee.house.gov/media/press-releases/house-committee-passes-chip-security-act)).
- **Taiwan's N-2 rule against the $250 billion investment commitment.** The two policies point in opposite directions and one of them will give.
