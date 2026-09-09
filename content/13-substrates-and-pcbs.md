---json
{
  "id": "substrates-and-pcbs",
  "number": 13,
  "title": "Substrates and PCBs",
  "oneLiner": "A Japanese food company makes 95 percent of the insulating film inside high-performance chip packages, and a Japanese textile company makes the glass cloth under it.",
  "plain": "A chip's connections come out finer than a human hair. The board underneath works in millimetres. The package substrate is the adapter in between, built like plywood: a stiff core of glass cloth and resin, with thin sheets of epoxy film laminated onto both faces, holes burned through each sheet by laser, and copper plated into the holes. Add a layer and you add another chance for a hole to open. The film and the glass cloth each come from a single Japanese supplier, which is why a shortage here stops accelerators shipping.",
  "specimen": "substrate-layers",
  "specimenCaption": "Right: an ABF build-up substrate with a quarter cut away. A glass-cloth core drilled with plated through-holes, eight layers of build-up film laminated onto each face with their own copper wiring and laser-drilled microvias, landing pads above and solder balls underneath, with the film itself drawn in copper.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "Ajinomoto", "country": "JP", "share": "95% of the global FC-BGA insulating film market, on the company's own account"},
      {"name": "Nitto Boseki", "country": "JP", "share": "Claims an overwhelming advantage in low-expansion glass cloth"},
      {"name": "Ibiden", "country": "JP", "share": "Says it takes close to 100% of each new interposer-substrate generation at launch"},
      {"name": "Unimicron", "country": "TW", "share": "ABF was 52% of sales in Q2 2026"},
      {"name": "Samsung Electro-Mechanics", "country": "KR", "share": "Package solution sales KRW 771.6bn in Q2 2026, up 37%"}
    ],
    "countries": [
      {"code": "JP", "note": "ABF film, T-glass cloth, Ibiden and Shinko substrate plants in Gifu and Nagano"},
      {"code": "TW", "note": "Unimicron, Nan Ya PCB, Kinsus; the largest merchant substrate cluster"},
      {"code": "KR", "note": "Samsung Electro-Mechanics, LG Innotek, and a glass-core joint venture with Sumitomo Chemical"},
      {"code": "CN", "note": "Where most PCB competition sits, alongside Taiwan; now pushing into glass cloth and build-up film"},
      {"code": "AT", "note": "AT&S, the only European advanced substrate maker of scale"}
    ],
    "chinaStatus": "China and Taiwan are where the PCB competition sits, and Chinese and Taiwanese firms are, in Nitto Boseki's own words, catching up aggressively in special glass. China still has almost no position in high-end build-up film.",
    "usStatus": "No US merchant ABF substrate maker of scale. TTM Technologies is the main US-listed PCB maker; data centre computing reached 24% of its sales in 2025, up from 14% in 2023. Intel is pushing glass substrates for the second half of the decade.",
    "costSignal": "Ibiden alone is spending about JPY 500 billion on high-performance substrate capacity across fiscal 2026 to 2028, with JPY 220 billion in the first phase",
    "substitution": {"years": "5-7", "why": "A new build-up film or core laminate has to be requalified layer by layer at every substrate maker and every packaging house, and Ajinomoto's film has been the reference material since 1999."}
  },
  "keyFacts": [
    {"fact": "TSMC's chief executive told the July 2026 earnings call that packaging capacity is so tight it now limits customers' growth", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf"},
    {"fact": "ABF was first adopted by a major semiconductor manufacturer in 1999 and Ajinomoto describes it as the de facto standard insulating material for package development ever since", "source": "https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf"},
    {"fact": "Ajinomoto's own electronic materials staff put ABF at 95% of the global market for FC-BGA insulating film, and say practically all high-performance computers and servers rely on it", "source": "https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience"},
    {"fact": "Ibiden told investors in May 2026 that it typically secures a market share close to 100% at the launch of a new generation of interposer-type substrates, falling by 20 to 30% after three to six months, and expects to hold its lead in silicon-bridge substrates through fiscal 2030", "source": "https://www.ibiden.com/ir/items/en_QA_FY25Q4.pdf"},
    {"fact": "A high-performance computing substrate uses 18 layers of ABF against 6 in a PC substrate, on a body 3.5 times the area", "source": "https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf"},
    {"fact": "Ajinomoto planned about JPY 25 billion of growth investment in ABF production from fiscal 2023, aimed at demand through 2030", "source": "https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf"},
    {"fact": "Ajinomoto's Healthcare and Others segment lifted business profit 45.1% to JPY 66.2 billion in the year to March 2026, mainly on higher electronic materials revenue", "source": "https://www.ajinomoto.co.jp/company/en/ir/library/result/main/014/teaserItems1/0/linkList/06/link/FY25Q4_Tanshin_E.pdf"},
    {"fact": "Nitto Boseki plans JPY 80 billion of capital spending over the four years of its fiscal 2024 to 2027 plan and says demand has risen two to three times since the plan was set", "source": "https://www.nittobo.co.jp/eng/ir/pdf/Nittobo_Integrated-Report_2025.pdf"},
    {"fact": "Ibiden will invest about JPY 500 billion from fiscal 2026 to fiscal 2028 in high-performance IC package substrates, JPY 220 billion of it in a first phase at the Gama plant", "source": "https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html"},
    {"fact": "ABF substrates were 52% of Unimicron's Q2 2026 sales of NT$42.9 billion, and AI data centre work was 61%", "source": "https://www.unimicron.com/files/money/Earnings/en/2026-Q2-consolidated-en.pdf"},
    {"fact": "TTM Technologies took US$2.91 billion of revenue in fiscal 2025 and regularly builds boards of more than 30 layers, up to over 70", "source": "https://www.sec.gov/Archives/edgar/data/1116942/000119312526051976/ttmi-20251229.htm"}
  ],
  "figures": [
    {
      "id": "abf-layers",
      "type": "bars",
      "title": "Layers of build-up film in one package substrate",
      "unit": "layers",
      "data": [["PC substrate", 6], ["HPC substrate", 18]],
      "source": {"label": "Ajinomoto business briefing on ABF, June 2023", "url": "https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf"}
    },
    {
      "id": "unimicron-mix",
      "type": "stack",
      "title": "Unimicron sales by technology, second quarter 2026",
      "unit": "%",
      "data": [["ABF substrate", 52], ["PCB", 27], ["BT substrate", 9], ["HDI", 9], ["FPC", 2], ["Other", 1]],
      "source": {"label": "Unimicron 2026 Q2 earnings conference", "url": "https://www.unimicron.com/files/money/Earnings/en/2026-Q2-consolidated-en.pdf"}
    }
  ]
}
---
# Substrates and PCBs

On TSMC's July 2026 earnings call, chief executive C.C. Wei said the company's packaging capacity is now so tight that it limits its customers' growth ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)). The interposer carries signals a few millimetres. Everything after it is organic chemistry: an epoxy build-up substrate, then a printed circuit board with thirty layers, then a rack.

## How it works

A chip's connections come out finer than a human hair. The board underneath works in millimetres. The package substrate is the adapter in between, built like plywood: a stiff core of glass cloth and resin, with thin sheets of epoxy film laminated onto both faces, holes burned through each sheet by laser, and copper plated into the holes. Add a layer and you add another chance for a hole to open. The film and the glass cloth each come from a single Japanese supplier, which is why a shortage here stops accelerators shipping.

The substrate maker drills the core through and plates it with copper before the build-up starts. Each build-up cycle then laminates a film of epoxy about 10 micrometres thick, burns microvias through it with a laser, plates copper into the vias, and patterns the traces ([source](https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience)). A human hair is ten times thicker than one of those films ([source](https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf)).

The hard part is that silicon and epoxy expand at different rates when heated, and warpage grows with area. Ajinomoto counts 18 layers of its film in a high-performance computing substrate against six in a PC part, on a body three and a half times the area ([source](https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf)). The fix is a core that barely moves: low-expansion glass cloth and tighter control of the resin.

## Variants and trade-offs

### BT substrates

Bismaleimide-triazine laminate is the cheaper, older family. It dominates by unit volume and suits memory stacks and mobile parts, but it cannot hold the line width or the flatness a reticle-sized logic die needs.

### ABF build-up substrates

ABF sits under every high-end CPU, GPU and AI accelerator. A major chipmaker first adopted Ajinomoto Build-up Film in 1999, and the company says it has been the de facto standard in package development ever since ([source](https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf)). Asked on Ajinomoto's own site whether its share of the flip-chip BGA insulating market was nearer 30 or 50 percent, the electronics materials division answered: "More like 95% market share," and said practically all high-performance computers and servers rely on the film ([source](https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience)).

{{figure:abf-layers}}

### Glass core substrates

Replace the resin core with glass and the expansion problem mostly goes away, which is why everyone is trying.

- **Intel** announced glass substrates in September 2023 for the latter part of this decade, arguing that organic materials run into shrinkage and warping limits as packages grow ([source](https://download.intel.com/newsroom/archive/2025/en-us-2023-09-18-intel-unveils-industryleading-glass-substrates-to-meet-demand-for-more-powerful-compute.pdf)).
- **Samsung Electro-Mechanics** signed a joint venture with Sumitomo Chemical in November 2025 to make glass core, with a main agreement due in 2026 and mass production after 2027 ([source](https://samsungsem.com/global/newsroom/news/view.do?id=9850)).

Both programmes point past 2027, so glass answers the next problem rather than this one.

## The materials underneath

Ajinomoto's film is a rounding error in a food company's accounts and a chokepoint in everyone else's. Its Healthcare and Others segment, which carries electronic materials, lifted business profit 45.1% to JPY 66.2 billion in the year to March 2026, and the company attributes that mainly to electronic materials revenue ([source](https://www.ajinomoto.co.jp/company/en/ir/library/result/main/014/teaserItems1/0/linkList/06/link/FY25Q4_Tanshin_E.pdf)). It expands on a slow clock: about JPY 25 billion of growth investment from fiscal 2023, sized against demand out to 2030, with varnish made in Japan and coating outsourced ([source](https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf)).

The core laminate has the same problem one level down. Nitto Boseki's T-glass has high elasticity and low thermal expansion, which is what a high-density package substrate needs ([source](https://www.nittobo.co.jp/eng/business/electronicmaterials/t-glass.htm)). The company claims an overwhelming advantage in both quality and capacity for low-expansion glass, says demand has run two to three times ahead of the plan it wrote for fiscal 2024 to 2027, and is spending JPY 80 billion over those four years to catch up ([source](https://www.nittobo.co.jp/eng/ir/pdf/Nittobo_Integrated-Report_2025.pdf)). Apple and Qualcomm are both among the customers worried about Japanese glass cloth supply ([source](https://asia.nikkei.com/business/technology/tech-asia/apple-and-qualcomm-fret-over-strained-supplies-of-japan-s-glass-cloth)).

China is attacking this layer, and Nitto Boseki says so itself, naming Chinese and Taiwanese firms as aggressive fast followers in special glass ([source](https://www.nittobo.co.jp/eng/ir/pdf/Nittobo_Integrated-Report_2025.pdf)). The prize is a chip materials market Nikkei sizes at $73 billion ([source](https://asia.nikkei.com/business/tech/semiconductors/china-chip-material-makers-battle-japan-rivals-for-73bn-market)).

## Who makes it

The substrate fabs are an entirely Asian oligopoly, and all of the large merchant makers are expanding. The 2021 hundred-day supply chain review recorded ABF substrate among the materials commenters flagged as vulnerable, and listed the substrate makers as Ibiden, Shinko, Nanya, Samsung, Unimicron, Shennan Circuits, Zhuhai Yueya and AKM, with no American name among them ([source](https://bidenwhitehouse.archives.gov/wp-content/uploads/2021/06/100-day-supply-chain-review-report.pdf)).

- **Ibiden** will invest about JPY 500 billion from fiscal 2026 to fiscal 2028, starting with JPY 220 billion at its Gama plant and mass production from fiscal 2027 ([source](https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html)). In May 2026 management said that on interposer-type substrates it typically takes a share close to 100 percent at the launch of a new generation, losing 20 to 30 points three to six months later, and that on silicon-bridge substrates the backside interconnection is hard enough that it expects to keep its technical lead through fiscal 2030 ([source](https://www.ibiden.com/ir/items/en_QA_FY25Q4.pdf)).
- **Unimicron** took NT$42.9 billion of sales in the second quarter of 2026, 52% of it ABF substrates and 61% of it AI data centre work, and spent NT$11.7 billion on fixed assets in the half ([source](https://www.unimicron.com/files/money/Earnings/en/2026-Q2-consolidated-en.pdf)).
- **Samsung Electro-Mechanics** grew package solution sales 37% year on year to KRW 771.6 billion in the second quarter, on substrates for AI accelerators and server CPUs ([source](https://m.samsungsem.com/global/newsroom/news/view.do?id=10462)).

Shinko changed hands: Fujitsu sold its 50.02% stake to a vehicle of the state-backed Japan Investment Corporation, with Mitsui Chemicals and Dai Nippon Printing as co-investors ([source](https://www.jiccapital.co.jp/en/news/.assets/E_20250217_JIC_JICC_PressRelease.pdf)).

{{figure:unimicron-mix}}

## The boards under the GPU

Under the substrate is a board that has become an engineering problem of its own. TTM Technologies says it regularly builds printed circuit boards of more than 30 layers and can go past 70 ([source](https://www.sec.gov/Archives/edgar/data/1116942/000119312526051976/ttmi-20251229.htm)). Those layers carry hundreds of amps to the GPUs and route the fabric fast enough that the laminate's dielectric properties become a first-order design variable.

Data centre computing was 24% of its US$2.91 billion of fiscal 2025 revenue, against 14% two years earlier ([source](https://www.sec.gov/Archives/edgar/data/1116942/000119312526051976/ttmi-20251229.htm)) ([source](https://data.sec.gov/api/xbrl/companyconcept/CIK0001116942/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax.json)). TTM names its competition as mostly Chinese and Taiwanese ([source](https://www.sec.gov/Archives/edgar/data/1116942/000119312526051976/ttmi-20251229.htm)), and the hedge against that is Southeast Asia, where Thailand has built an AI board industry ([source](https://asia.nikkei.com/business/technology/tech-asia/thailand-carves-out-a-less-glamorous-ai-niche-printed-circuit-boards)).

## The chokepoint

Money can expand an oligopoly of substrate fabs, and it is being spent. The single points of failure are one layer down: one company's film and one company's glass cloth, both Japanese, both running flat out, both adding capacity on construction schedules measured in years while AI demand compounds quarterly.

Flatness breaks first as packages grow. TSMC has told investors its CoWoS roadmap goes beyond 14 times reticle size ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)). Bigger bodies mean more warpage, more layers, more chances for a via to open, and lower yield on a part that already costs hundreds of dollars before a die touches it.

## Key evaluation criteria

- **Layer count** sets how much current and how many signals the substrate can carry. Each added build-up layer multiplies the yield risk.
- **Body size** drives everything else. Once a body is much larger than the dies it carries, warpage and handling, not wiring, set the process window.
- **Coefficient of thermal expansion** must be close enough to silicon that the package survives thermal cycling, which is what T-glass buys and why its supply matters.
- **Dielectric properties** of the core laminate set achievable signal rates on both the substrate and the board underneath.
- **Qualification time** is what protects the incumbents. Second-sourcing a film or a laminate takes years.

## Takeaways

TSMC says packaging capacity already caps what its customers can ship, and the two materials that make a substrate possible come from single Japanese suppliers: Ajinomoto puts its own film at 95 percent of the market it serves, and Nitto Boseki claims an overwhelming advantage in the glass cloth beneath it. Substrate fabs in Japan, Taiwan and Korea are spending billions, but film and glass cloth expand on a slower clock than GPUs do. Glass cores fix the physics eventually; on Intel's and Samsung's own dates, they do not fix 2027.
