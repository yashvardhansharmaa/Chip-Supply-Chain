---json
{
  "id": "geopolitics",
  "number": 17,
  "title": "Geopolitics",
  "oneLiner": "Every stage in this chain sits in someone's jurisdiction. Since 2018 the United States has been converting that fact into policy, and China has been building an answer.",
  "plain": "An export control is a licence requirement. A government names an item and a buyer, and its own companies then need a licence to ship that item to that buyer; Washington stretches the rule to cover foreign-made goods built with American technology. Few governments can enforce such a rule, because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.",
  "bridge": "What is left is not how a chip gets built but who can stop it, and that answer is written into law.",
  "specimen": "globe",
  "specimenCaption": "The world with the chain's chokepoint sites marked. Veldhoven and Oberkochen for lithography, Hsinchu and Tainan for leading-edge logic, Icheon and Pyeongtaek for high-bandwidth memory, Shanghai and Wuhan for China's substitution effort, and the Gulf and Southeast Asian hubs the finished accelerators now flow through.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "United States", "country": "US", "share": "93% of AI accelerator design revenue; 72% of measurement and inspection and 60% of deposition tool revenue"},
      {"name": "Taiwan", "country": "TW", "share": "78% of the world's contract chipmaking in 2025, and an estimated 72% of capacity at 5 nm and below"},
      {"name": "China", "country": "CN", "share": "38% of world capacity for logic at 28 nm and above in 2025; about 10% of deposition and etch tool revenue"},
      {"name": "Netherlands", "country": "NL", "share": "100% of extreme-ultraviolet and 95% of deep-ultraviolet lithography revenue"},
      {"name": "South Korea", "country": "KR", "share": "82.5% of high-bandwidth memory revenue in 2025, SK hynix 63.2 and Samsung 19.3, and 69.3% of the wider DRAM market"}
    ],
    "countries": [
      {"code": "US", "note": "Chip design, design software, three of five tool segments, and the export-control authority itself"},
      {"code": "TW", "note": "Leading-edge logic and advanced packaging, and the concentration risk no policy has reduced"},
      {"code": "CN", "note": "Mature-node capacity, critical minerals, and the target of the whole regime"},
      {"code": "NL", "note": "ASML lithography, the hardest single chokepoint in the chain"},
      {"code": "JP", "note": "Photoresist, silicon wafers, etch and clean tools, and Rapidus"}
    ],
    "chinaStatus": "Blocked at the leading edge and substituting fast below it. Domestic tools went from 25 percent of China's own equipment market in 2024 to 35 percent in 2025, and about 40 percent in etch and deposition; SMIC runs 7 nm-class logic without extreme-ultraviolet machines at roughly 45,000 advanced-node wafers a month; CXMT's 2026 memory output covers 250,000 to 300,000 Ascend packages. Neither those machines nor high-bandwidth memory at scale is in reach before 2028.",
    "usStatus": "Holds chip design, design software and most process tools, and uses the Foreign Direct Product Rule to reach foreign-made goods. Has traded parts of the fence for revenue and investment since 2025: an expected 15 percent cut of licensed H20 sales, a 9.9 percent equity stake in Intel, a 25 percent tariff on advanced chips, and case-by-case H200 licences.",
    "costSignal": "$52.7B authorised under the CHIPS Act against about $47B in the latest round of China's Big Fund alone",
    "substitutability": {"band": "Very hard", "test": "Rated at the chain's hardest link: one country holds 100 percent of EUV and no substitute is in reach before 2028", "why": "A well-funded state can copy mature tools in a few years, and China's domestic tools went from 25 percent of its own equipment market in 2024 to 35 percent in 2025. Extreme-ultraviolet machines and high-bandwidth memory at scale are the two it cannot reach before 2028, and an actor still able to buy from ASML and the memory makers is buying rather than building, so this clock belongs to whoever is fenced out."}
  },
  "keyFacts": [
    {"fact": "Taiwan's foundries hold 78% of the global foundry market on the Taiwan Semiconductor Industry Association's 2025 count; the 92% often quoted for the most advanced chips is a February 2024 US International Trade Commission figure that the same Stimson explainer relays", "source": "https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/"},
    {"fact": "SK hynix's July 2026 US prospectus puts Korean suppliers at 82.5% of 2025 HBM revenue, SK hynix 63.2 and Samsung 19.3, and at 76.9% in the first quarter of 2026; the filing relays IDC's figures", "source": "https://www.sec.gov/Archives/edgar/data/0002120882/000119312526299963/d32785d424b4.htm"},
    {"fact": "ASML's China share of net system sales fell from 41% in 2024 to 33% in 2025", "source": "https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf"},
    {"fact": "The 2 December 2024 rules covered 24 types of equipment and 3 software tools, added the first controls on high-bandwidth memory, and made 140 Entity List additions", "source": "https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military"},
    {"fact": "Since 15 January 2026 Commerce has reviewed H200 and MI325X sales to China case by case, capped at 50% of what the exporter ships to US customers", "source": "https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities"},
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
        ["2026-01-13", "H200 and MI325X case-by-case review announced, effective 15 January"]
      ],
      "source": {"label": "BIS press releases and Federal Register rules", "url": "https://www.bis.gov/news-updates"}
    }
  ]
}
---
# Geopolitics

Washington's control regime and Beijing's answer to it are both unfinished.

## The shape of the contest

An export control is a licence requirement. A government names an item and a buyer, and its own companies then need a licence to ship that item to that buyer; Washington stretches the rule to cover foreign-made goods built with American technology. Few governments can enforce such a rule, because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.

In 2022 Washington changed the goal from staying a generation ahead to "as large a lead as possible", sold as a small yard with a high fence ([source](https://www.csis.org/analysis/where-chips-fall-us-export-controls-under-biden-administration-2022-2024)). The October rules that followed aimed to push China backwards rather than merely slow it ([source](https://www.csis.org/analysis/choking-chinas-access-future-ai)). Licensing once asked who was buying and why; country-wide prohibition asks only where the box is going.

## Chokepoints and who holds them

| Segment | Leader | Share | Basis |
|---|---|---|---|
| EUV lithography | Netherlands | 100% | revenue, 2025 |
| DUV lithography | Netherlands | 95% | revenue, 2025 |
| Metrology and inspection | United States | 72% | revenue, 2025 |
| Deposition | United States | 60% | revenue, 2025 |
| Etch and clean | United States | 53% | revenue, 2025 |
| Photoresist | Japan | 78.4% | revenue, 2023 |
| Silicon wafers | Japan | 53% | revenue, 2023 |
| Leading-edge logic, 5 nm and below | Taiwan | 72% | capacity, 2025, site estimate |
| Foundry, all nodes | Taiwan | 78% | market share, 2025 |
| HBM | South Korea | 82.5% | revenue, 2025: SK hynix 63.2, Samsung 19.3, Micron 17.4 |
| AI accelerator design | United States | 93% | revenue, 2025 |
| Mature logic, 28 nm and above | China | 38% | capacity, 2025, site estimate |

- **Equipment.** CSET's ETO Supply Chain Explorer, TechInsights 2025 revenue by parent-company headquarters ([source](https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv)).
- **Materials.** Country shares of photoresist and silicon wafers as Japan's Ministry of Economy, Trade and Industry published them in December 2025, from Fuji Keizai's materials survey, by parent-company headquarters ([source](https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf)). Japan held 76.7 percent of photoresist in 2021 and 78.4 in 2023, and 52.4 percent of wafers against 53.0, so neither position is moving.
- **Taiwan.** The 78 percent is the Taiwan Semiconductor Industry Association's 2025 count, as the Stimson Center gives it ([source](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)). The 72 percent is a Chip Supply Chain estimate for capacity at 5 nm and below, rolled forward from the 2022 industry baseline because nobody publishes a current measurement ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). The 92 percent quoted more often is a February 2024 US International Trade Commission figure, relayed by that same Stimson piece, on a wider reading of "most advanced" ([source](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)).
- **Memory.** SK hynix's US listing prospectus splits 2025 high-bandwidth memory revenue between SK hynix at 63.2 percent, Samsung at 19.3 and Micron at 17.4, so Korea holds 82.5; by the first quarter of 2026 Korea was down to 76.9 ([source](https://www.sec.gov/Archives/edgar/data/0002120882/000119312526299963/d32785d424b4.htm)). The underlying figures are IDC's, relayed by the prospectus.
- **Design.** CSIS ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)).
- **China's mature nodes.** The 38 percent is a Chip Supply Chain reading of logic capacity at 28 nm and above. It sits between the 2022 industry measurement ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)) and CSIS's finding that China now holds about half of global mature-node capacity, on a broader definition that sweeps in discrete, analog and power chips ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)).

Advanced packaging is missing because nobody publishes a capacity split and TSMC will not give one. No country is self-sufficient, so controls bite in both directions.

## The US export-control campaign, 2018 to today

Commerce built the regime one rule at a time, each closing a gap the last one left.

- **17 August 2020, the Foreign Direct Product Rule.** The Entity List, Commerce's roster of buyers that need a licence, cut Huawei and 68 affiliates off from US technology in May 2019 ([source](https://www.federalregister.gov/documents/2019/05/21/2019-10616/addition-of-entities-to-the-entity-list)), so Huawei bought foreign chips instead. Commerce then extended the rule to any foreign item made with US technology and bound for Huawei ([source](https://www.federalregister.gov/documents/2020/08/20/2020-18213/addition-of-huawei-non-us-affiliates-to-the-entity-list-the-removal-of-temporary-general-license-and)). That reach makes American controls extraterritorial.
- **7 October 2022, the break.** Two new export classifications, 3A090 and 3B090, capped exportable AI chips and set fab thresholds at 16 nm FinFET logic, 18 nm half-pitch DRAM and 128-layer NAND ([source](https://www.csis.org/analysis/choking-chinas-access-future-ai)). They also barred US persons from servicing advanced Chinese fabs, emptying them of American engineers within days ([source](https://www.federalregister.gov/documents/2022/10/13/2022-21658/implementation-of-additional-export-controls-certain-advanced-computing-and-semiconductor)).
- **17 October 2023, the density fix.** Chip designers had tuned interconnect speed to slip under the 2022 line while keeping the compute, so Commerce's Bureau of Industry and Security (BIS) dropped that parameter for two others: total processing performance and performance density. A data-centre chip now needs a licence at 4,800 points of that performance score, or at 1,600 with a density of 5.92 ([source](https://cset.georgetown.edu/article/bis-2023-update-explainer/)).
- **2 December 2024, the widest package.** 24 equipment types, three software tools, the first controls on high-bandwidth memory and 140 Entity List additions ([source](https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military)).
- **15 January 2025, AI Diffusion.** A rule requiring a licence for the top band of accelerators, 3A090.a and 4A090.a, to any destination worldwide, then reopening it by exception: License Exception AIA to the nineteen destinations named in supplement no. 5 to part 740, License Exception LPP in capped volumes elsewhere, nothing to China ([source](https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion)). BIS said on 13 May that it would not enforce the framework, two days before the compliance date ([source](https://www.bis.gov/press-release/department-commerce-announces-rescission-biden-era-artificial-intelligence-diffusion-rule-strengthens)). It withdrew none of the text. The worldwide licence requirement, License Exceptions AIA, ACM and LPP, supplement no. 5 and the 790 million TPP per-country allocation all stand in the Code today, and BIS says it enforces the requirement only against Country Groups D:1, D:4 and D:5 and against firms headquartered in D:5 or Macau ([source](https://www.federalregister.gov/documents/2026/07/14/2026-14132/enhanced-favorable-treatment-for-the-united-arab-emirates-under-the-export-administration)) ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6)). No tiered replacement has appeared; bilateral deals took the place of the caps.

On 9 April 2025 the government told Nvidia it needed a licence to ship the H20 to China, to the D:5 group of arms-embargoed countries, and to any company headquartered or ultimately owned there, so no Chinese buyer could route the order through a foreign subsidiary ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000082/nvda-20250409.htm)). Nvidia took a $4.5 billion charge on stock it could no longer sell. Licences came back in August at a price: US officials, the filing says, "have expressed an expectation that the USG will receive 15 percent of the revenue generated from licensed H20 sales", though no regulation codifies it ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000209/nvda-20250727.htm)).

Early 2026 set the current settlement.

- **13 January 2026, effective 15 January.** BIS announced on 13 January that it would move the H200 and AMD MI325X to case-by-case review, with third-party testing and a cap at 50 percent of what the exporter ships to US customers ([source](https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china)). The rule, at 91 FR 1685, took effect on publication two days later ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)).
- **15 January 2026.** A national-security proclamation under Section 232 put a 25 percent tariff on the same class of chips, then exempted almost every American use, from data centres to startups ([source](https://www.federalregister.gov/documents/2026/01/20/2026-01052/adjusting-imports-of-semiconductors-semiconductor-manufacturing-equipment-and-their-derivative)).
- **12 February 2026.** Applied Materials paid $252 million, the statutory maximum, over $126 million of ion implanters routed through Korea to an Entity-Listed Chinese customer ([source](https://www.bis.gov/press-release/applied-materials-pay-252-million-penalty-bis-illegally-exporting-semiconductor-manufacturing-equipment)).

{{figure:control-timeline}}

## Cloud and remote access

Renting a chip is not exporting it. An export, at 15 CFR 734.13, is a shipment or transmission out of the United States or a release of technology or source code to a foreign person, so a Singapore data centre selling time on an H200 already installed there moves nothing across a border ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.13)).

The rules reach that trade through the people holding the chips. A January 2026 licence for China or Macau is conditioned on the applicant getting the consignee's know-your-customer procedures and its list of Infrastructure-as-a-Service customers in Belarus, China, Cuba, Iran, Macau, North Korea, Russia and Venezuela, "necessary to prevent unauthorized remote access from end users described in paragraph (dd)(1)(iv)", and on a promise that no algorithm trained on the chips is served back to those users ([source](https://www.govinfo.gov/content/pkg/FR-2026-01-15/html/2026-00789.htm)).

The diffusion rule went at the other end, the output. It classified frontier model weights as ECCN 4E091, warned American cloud providers that training such a model for the US subsidiary of a foreign-headquartered customer raises a red flag that the weights will leave without a licence, and barred its validated end users from training one abroad, while saying that API access to a model, and rented capacity for inference, "are not prohibited" ([source](https://www.federalregister.gov/documents/2025/01/15/2025-00636/framework-for-artificial-intelligence-diffusion)).

So the controls reach the chip, the weights above the line, and the promises a licensed consignee signs. Compute sold by the hour on chips lawfully installed abroad sits outside them.

## Allies: the Netherlands, Japan, Korea and Europe

Unilateral tool controls would only transfer the sales, so the campaign depends on The Hague and Tokyo.

- **The Netherlands.** The Dutch began licensing advanced deep-ultraviolet tools on 1 September 2023, widened that in September 2024 ([source](https://www.government.nl/latest/news/2024/09/06/the-netherlands-expands-export-control-measure-advanced-semiconductor-manufacturing-equipment)) and reached measurement and inspection tools on 1 April 2025 ([source](https://www.government.nl/latest/news/2025/01/15/klever-export-controls-on-advanced-semiconductor-manufacturing-equipment-to-be-tightened)).
- **Japan.** Controls on advanced manufacturing equipment took effect on 23 July 2023 and apply to all destinations rather than naming China ([source](https://www.csis.org/analysis/csis-translation-updated-japanese-export-controls-high-performance-semiconductor)).
- **South Korea.** BIS revoked the Validated End-User status that let Samsung, SK hynix and Intel run their China fabs without individual licences, effective 31 December 2025. It will license those fabs to keep running, but not to expand or upgrade ([source](https://www.federalregister.gov/documents/2025/09/02/2025-16735/revocation-of-validated-end-user-authorizations-in-the-peoples-republic-of-china)).

On 30 September 2025 a BIS rule extended Entity List restrictions to any subsidiary half-owned by a listed firm ([source](https://www.federalregister.gov/documents/2025/09/30/2025-19001/expansion-of-end-user-controls-to-cover-affiliates-of-certain-listed-entities)). The same day the Dutch economy minister invoked the Goods Availability Act against Nexperia, the Nijmegen chipmaker that supplies European car lines, citing governance failures that risked moving technology out of Europe ([source](https://www.government.nl/latest/news/2025/10/12/minister-of-economic-affairs-invokes-goods-availability-act)). Neither lasted: BIS suspended its rule for a year on 10 November ([source](https://www.federalregister.gov/documents/2025/11/12/2025-19846/one-year-suspension-of-expansion-of-end-user-controls-for-affiliates-of-certain-listed-entities)) and the minister suspended his order on 19 November ([source](https://www.government.nl/documents/2025/11/19/update-on-invoking-goods-availability-act)). Europe holds a chokepoint at the leading edge and none at the mature nodes its car industry runs on.

The MATCH Act, introduced on 8 April 2026, would ban sales of immersion deep-ultraviolet scanners to China, name CXMT, Hua Hong, Huawei, SMIC and YMTC in statute, and give allies 150 days to match before the US extends the Foreign Direct Product Rule alone ([source](https://www.foreign.senate.gov/press/rep/release/risch-ricketts-kim-introduce-match-act-level-the-global-playing-field-for-us-tech)).

## China's response

Five bodies run Beijing's side. The Ministry of Industry and Information Technology (MIIT) sets substitution targets, and in 2024 reportedly told Chinese telecom operators to strip foreign chips out of their networks by 2027 ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). The National Development and Reform Commission (NDRC) plans the compute build-out and co-issued the national computing-power network plan ([source](https://english.www.gov.cn/news/202312/27/content_WS658b72afc6d0868f4e8e28ba.html)). The Ministry of Commerce (MOFCOM) writes and administers the export controls, including the mineral rules below ([source](https://english.mofcom.gov.cn/Policies/AnnouncementsOrders/art/2025/art_0dd87cbee7b045bf93fabe6ab2faceee.html)). The State Administration for Market Regulation (SAMR) is the antitrust lever, and opened its Nvidia investigation in December 2024 ([source](https://www.cfr.org/articles/cyber-week-review-december-13-2024)). The Cyberspace Administration of China (CAC) runs the security reviews, and in September 2025 told firms including ByteDance and Alibaba to cancel Nvidia orders ([source](https://cset.georgetown.edu/newsletter/september-18-2025/)).

The retaliation itself goes at the inputs rather than the chips. Micron was first, failing a CAC review on 21 May 2023 and losing its critical infrastructure buyers ([source](https://www.csis.org/analysis/micron-aggression-right-response-beijings-ban-us-chipmaker)). Mineral controls followed.

- **3 December 2024.** Notice 46, from MOFCOM, banned exports of gallium, germanium, antimony and superhard materials to the United States, one day after the American chip rules ([source](https://cset.georgetown.edu/publication/china-rare-earth-export-ban/)).
- **4 April 2025.** Announcement 18 put seven medium and heavy rare earths under licensing, from samarium to yttrium, as metal, oxide, compound or finished magnet ([source](https://english.mofcom.gov.cn/Policies/AnnouncementsOrders/art/2025/art_0dd87cbee7b045bf93fabe6ab2faceee.html)).
- **9 October 2025.** A further announcement reached foreign-made goods containing Chinese rare earths worth 0.1 percent or more of their value, putting a Chinese export licence between a foreign firm and its own product ([source](https://cset.georgetown.edu/publication/mofcom-notice-2025-61/)).
- **November 2025.** After Trump and Xi met at the Asia-Pacific summit, the ministry suspended the gallium ban for a year ([source](https://www.csis.org/analysis/us-china-trade-truce-has-not-solved-gallium-problem)).

Nothing was repealed; the gallium ban is paused and the licensing regimes stand.

The blunter lever is demand. Chinese regulators discouraged customers from buying, importing or using Nvidia's data-centre products, and endorsed performance-per-watt and bandwidth standards for accelerators in Chinese data centres ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)). When Washington licensed H200 sales in February 2026, Beijing restricted them, and Nvidia's shipments came to less than 1 percent of data-centre revenue ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm)). That quarter's data-centre revenue was $89.0 billion, and the next quarter's guidance assumed no China compute revenue ([source](https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027)).

Chinese tool vendors held 10 to 15 percent of their home market before 2022, took 25 percent in 2024 and 35 percent in 2025, and hold about 40 percent of domestic etch and deposition ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)).

The leading edge is where it stalls. SMIC prints 7 nm-class logic on older deep-ultraviolet scanners, exposing each layer several times because it cannot buy the finer light, and Huawei shipped about 805,000 Ascend units in 2025 on that silicon. The binding constraint is memory. A stockpile of roughly 13 million memory stacks, most bought before the December 2024 rules bit, supports about 1.6 million Ascend 910C packages; CXMT, China's own memory maker, should reach about 2 million stacks in 2026, enough for 250,000 to 300,000 more ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)).

{{figure:china-tool-revenue}}

## Industrial policy: CHIPS, Rapidus, Big Fund and the rest

The CHIPS and Science Act authorised about $52.7 billion ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). By July 2025 $30.9 billion of direct funding had reached 19 companies for 40 projects, a median 14.2 percent of each project's capital cost ([source](https://files.gao.gov/reports/GAO-26-107882/index.html)).

On 22 August 2025 the government converted $5.7 billion of unpaid Intel grants and $3.2 billion of Secure Enclave defence money into a 9.9 percent stake worth $8.9 billion ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)).

Tariffs became the second instrument. The 2026 US-Taiwan trade agreement cuts the tariff on Taiwanese goods to 15 percent in exchange for at least $250 billion of Taiwanese investment in US chip production ([source](https://www.cfr.org/articles/u-s-taiwan-trade-agreement-leaves-major-questions-open)). On 16 July 2026 TSMC added $100 billion for four more Arizona fabs at 2 nm and below, taking that campus to $265 billion ([source](https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html)), more than the whole CHIPS Act authorisation.

Europe's first Chips Act produced no leading-edge fab, and the Chips Act 2.0 proposal adopted on 3 June 2026 widens state aid and shifts the emphasis from supply to demand without changing that ([source](https://digital-strategy.ec.europa.eu/en/library/proposal-chips-act-20)). Japan chose a national champion instead: Rapidus verified 2 nm gate-all-around transistors on its Chitose pilot line in 2025 and raised another 267.6 billion yen, about $1.7 billion, targeting mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

China spends more, and differently. The latest round of its National Integrated Circuit Industry Investment Fund, the Big Fund, reached $47 billion ([source](https://www.rand.org/pubs/perspectives/PEA4012-1.html)). CSIS puts cumulative state funding since 2014 at $150 billion, roughly triple the CHIPS authorisation ([source](https://www.csis.org/analysis/chinas-localization-drive-semiconductors-gains-impetus-allied-chip-export-controls)). The money has produced a domestic tool industry rather than a leading-edge node.

{{figure:chips-awards}}

## Taiwan

Taiwan is the concentration risk that no policy has reduced. Its foundries hold 78 percent of the world's contract chipmaking on the industry association's 2025 count, and 2 nm runs nowhere else ([source](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)). At 5 nm and below the island holds an estimated 72 percent of capacity in 2025, a Chip Supply Chain figure rather than a published measurement ([source](https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf)). The packaging is on the island too. Asked in October 2025 how much CoWoS capacity he would add, TSMC's chairman said only that it was "working very hard to narrow the gap between the demand and supply", with wafer and packaging capacity both "very tight" ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)).

The silicon shield argument holds that this concentration deters invasion: destroying TSMC would cost an aggressor more than the island is worth. The counter is that staying irreplaceable gives Taipei reason to slow the diversification Washington wants. Taiwan bars the overseas production of its most advanced chips, so what TSMC builds in the United States runs a generation behind what it builds at home, and nobody expects Arizona to reach 2 nm before 2028 ([source](https://www.stimson.org/2025/why-taiwan-fears-america-first-risks-eroding-its-silicon-shield/)).

Arizona narrows the gap in wafers, and TSMC has two advanced packaging fabs planned there ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)). But a fab without its Taiwanese mask shops, chemical suppliers and trained crews is not a substitute. The shield is real and weakening, and diversification is not keeping up.

## Where the chips go: the Gulf, Southeast Asia, and smuggling

The Gulf bought its way inside the fence. In November 2025 Commerce authorised G42 of the United Arab Emirates and HUMAIN of Saudi Arabia to buy up to 35,000 Nvidia GB300s each under security and reporting conditions ([source](https://www.commerce.gov/news/press-releases/2025/11/statement-uae-and-saudi-chip-exports)). On 10 July 2026 it moved the Emirates from Country Groups D:3 and D:4 into A:5, the tier that holds Washington's close allies, and named the Emirati government alongside G42 and the US hyperscalers as consignees who can take controlled AI chips and systems with no quantity cap. Licences survive for the top-tier items, 3A090.a and 4A090.a, so the favour attaches to the named list rather than to the country ([source](https://www.federalregister.gov/documents/2026/07/14/2026-14132/enhanced-favorable-treatment-for-the-united-arab-emirates-under-the-export-administration)). Saudi Arabia still works licence by licence.

Southeast Asia is where the controls leak. Since 14 July 2025 Malaysia has required a permit to export, tranship or transit any high-performance US-origin AI chip, plus 30 days' notice under its Strategic Trade Act ([source](https://www.miti.gov.my/miti/resources/Media%20Release/%5BFINAL%5D_MITI_Press_Stmt_Malaysia_Regulates_Trade_of_US_AI_Chips_2025-07-14.pdf)). On 25 March 2026 the Justice Department charged three people over about $170 million of servers bought through Thai front companies for delivery to China ([source](https://www.justice.gov/opa/pr/chinese-national-and-two-us-citizens-charged-conspiring-smuggle-artificial-intelligence)).

The House select committee on China puts the median estimate at 140,000 chips smuggled to Chinese entities in 2024 ([source](https://chinaselectcommittee.house.gov/media/press-releases/protecting-us-tech-china-committee-and-bipartisan-bicameral-leaders-unite-to-stop-ccp-ai-chip-smuggling)). Congress's answer, the Chip Security Act, would require location verification on controlled chips within 180 days of enactment ([source](https://www.congress.gov/bill/119th-congress/senate-bill/1705/text)). The House Foreign Affairs Committee passed it 42-0 on 26 March 2026 ([source](https://huizenga.house.gov/news/documentsingle.aspx?DocumentID=404259)); it has not become law.

## Who gains and who pays

- **Taiwan and Korea.** Nothing in the policy mix moves leading-edge logic, memory stacking or advanced packaging off an island and a peninsula before 2030; reshoring adds capacity elsewhere without subtracting it there.
- **The Netherlands and Japan.** Their tool makers are the fence, so they gain a say in who gets what and lose the business that paid for it: Tokyo Electron's China share fell from 47.4 to 26.8 percent of quarterly sales in two years ([source](https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf)).
- **The United States.** It holds 93 percent of accelerator design revenue and will keep it. It has built no wafer, memory or assembly industry, and $30.9 billion of grants will not.
- **China.** Mature nodes, sub-leading-edge tools, DRAM and NAND are going domestic on a visible timetable. Extreme-ultraviolet machines, their resist and high-bandwidth memory at scale are not, and stockpile arithmetic caps Ascend output near a million units a year.

The Gulf comes out ahead without making anything: named Emirati buyers take advanced compute on terms European ones do not get. And Washington's instruments now reach past licensing: a 25 percent tariff on advanced chips ([source](https://www.federalregister.gov/documents/2026/01/20/2026-01052/adjusting-imports-of-semiconductors-semiconductor-manufacturing-equipment-and-their-derivative)), a 9.9 percent federal stake in Intel ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)), an expected 15 percent cut of licensed H20 sales ([source](https://www.sec.gov/Archives/edgar/data/1045810/000104581025000209/nvda-20250727.htm)) and a case-by-case queue for the H200 ([source](https://www.federalregister.gov/documents/2026/01/15/2026-00789/revision-to-license-review-policy-for-advanced-computing-commodities)).

## What to watch

- **November 2026.** Whether China renews the one-year suspension of its gallium ban or lets it expire ([source](https://www.csis.org/analysis/us-china-trade-truce-has-not-solved-gallium-problem)).
- **The MATCH Act's 150-day clock.** If it passes, allied divergence on deep-ultraviolet tools gets a statutory deadline ([source](https://www.foreign.senate.gov/press/rep/release/risch-ricketts-kim-introduce-match-act-level-the-global-playing-field-for-us-tech)).
- **CXMT's memory ramp.** Domestic memory rather than logic wafers caps Chinese accelerator volume ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)).
- **SMIC's advanced-node ramp.** 45,000 wafers a month at end-2025, an estimated 60,000 in 2026 and 80,000 in 2027, every one of them multiply exposed for want of an extreme-ultraviolet machine ([source](https://newsletter.semianalysis.com/p/huawei-ascend-production-ramp)). Yield is the open question.
- **Taiwan's overseas-production ban against its $250 billion investment promise.** The two contradict each other, and one will be dropped.

## Takeaways

One or two countries hold a dozen points in the chain, and export controls try to turn that into leverage. They have held China below the leading edge, where extreme-ultraviolet machines, their resist and high-bandwidth memory stay out of reach. They have not stopped substitution beneath it, where domestic tools now take a third of China's own market. The Netherlands and Japan paid for that, their toolmakers' China share of sales down from 41 to 33 percent at ASML and from 47 to 27 percent at Tokyo Electron. What began as a small yard is now tariffs, equity stakes and a cut of licensed sales, and none of it has moved leading-edge logic or packaging out of Taiwan.
