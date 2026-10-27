---json
{
 "id": "transistors-and-front-end",
 "number": 8,
 "title": "Transistors and the Front End",
 "oneLiner": "The front end builds the transistors, the switches inside every chip. Only TSMC, Intel and Samsung can build 2 nm-class ones in volume.",
 "plain": "The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch works like a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. For decades chipmakers made the strips shorter, so the transistors switched faster and more of them fit on a chip. But once the strip gets short enough, the valve stops sealing. Current leaks through even when the gate is off, and the chip burns power doing nothing. The newest kind of transistor, called gate-all-around, cuts this leak by wrapping the gate around all four sides of the strip. Building them takes a long sequence of steps that have to run in exact order. Only three companies, TSMC, Intel and Samsung, make these switches in volume. In 2024 the United States began requiring a license to share the know-how for building them, except with countries that impose matching controls.",
 "bridge": "Measured and clean, the layers mean nothing on their own. Laid in the right order, they become switches.",
 "specimen": "gaa-transistor",
 "specimenCaption": "A gate-all-around transistor, the switch in a 2 nm-class chip, drawn at true proportions. The three silicon sheets are each 6 nm thick and 30 nm wide. Each sheet is a few dozen atoms from top to bottom, roughly ten thousand times thinner than a human hair. The gold cage is the gate metal wrapping all four sides of each sheet.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "TSMC", "country": "TW", "share": "N2 in volume production since 4Q25, TSMC's first nanosheet node", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm"},
 {"name": "Intel", "country": "US", "share": "18A in high-volume production in the United States, as of 2026", "source": "https://www.intel.com/content/www/us/en/foundry/process/18a.html"},
 {"name": "Samsung Foundry", "country": "KR", "share": "Started initial production of its 3 nm gate-all-around process in June 2022", "source": "https://news.samsung.com/global/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture"},
 {"name": "SMIC", "country": "CN", "share": "N+3, a 7 nm-class process made without EUV, SemiAnalysis found in June 2026", "source": "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"},
 {"name": "Rapidus", "country": "JP", "share": "Said in July 2025 it would begin 2 nm mass production in 2027", "source": "https://www.rapidus.inc/en/news_topics/information/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/"}
 ],
 "countries": [
 {"code": "TW", "note": "TSMC N2 at Fab 20 Hsinchu and Fab 22 Kaohsiung"},
 {"code": "US", "note": "Intel 18A at Fab 52, Arizona"},
 {"code": "KR", "note": "Samsung Hwaseong and Pyeongtaek"},
 {"code": "JP", "note": "Rapidus Chitose, Hokkaido"},
 {"code": "CN", "note": "SMIC Shanghai and Beijing 300 mm lines"}
 ],
 "chinaStatus": "SMIC makes chips on its N+3 process, which SemiAnalysis measured in June 2026 at 113.4 million transistors per square millimeter, against 107.7 million for TSMC's N6. It builds its tightest layers in several patterning steps because it cannot buy an extreme-ultraviolet scanner.",
 "chinaSources": ["https://newsletter.semianalysis.com/p/steel-smic-n3-teardown", "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"],
 "usStatus": "In August 2025 Intel called itself the only chipmaker that both develops and manufactures leading-edge logic chips in the United States. It says its 18A process brought gate-all-around transistors and backside power to market together in 2025.",
 "usSources": ["https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to", "https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future"],
 "costSignal": "$17,000 per 300 mm wafer on TSMC's 4NP process, Epoch AI's December 2025 estimate",
 "costSources": ["https://epoch.ai/data-insights/b200-cost-breakdown"],
 "substitutability": {"band": "Hard", "test": "TSMC, Intel and Samsung all make chips with gate-all-around transistors, the newest kind.", "testSources": ["https://newsletter.semianalysis.com/p/intel-panther-lake-teardown"], "why": "Rapidus, a newcomer, is building on IBM's 2 nm technology under a December 2022 agreement. Since September 2024 the United States has required a license to share the know-how for building these transistors, except with countries that impose matching controls.", "whySources": ["https://www.rapidus.inc/en/news_topics/information/ibm-and-rapidus-form-strategic-partnership-to-build-advanced-semiconductor-technology-and-ecosystem-in-japan/", "https://www.federalregister.gov/documents/2024/09/06/2024-19633/commerce-control-list-additions-and-revisions-implementation-of-controls-on-advanced-technologies"]}
 },
 "keyFacts": [
 {"fact": "TSMC N2 entered volume production in 4Q25, its first nanosheet gate-all-around node", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm"},
 {"fact": "TSMC rates N2P at 18% more speed at the same power, 36% less power at the same speed, 1.2x logic density and 1.15x chip density over N3E", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
 {"fact": "TSMC rates A16, with Super Power Rail backside power, at 8-10% more speed, 15-20% less power and up to 1.10x chip density over N2P", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
 {"fact": "TSMC A14 is planned for production in 2028, with up to 15% more speed or up to 30% less power, and more than 20% higher logic density than N2", "source": "https://pr.tsmc.com/english/news/3228"},
 {"fact": "TSMC A13, a direct shrink of A14 giving 6% area savings, is planned for 2029, as is A12 with Super Power Rail", "source": "https://pr.tsmc.com/english/news/3302"},
 {"fact": "Intel 18A shipped gate-all-around and backside power together, giving an 11% routed area reduction and a 10x reduction in dynamic voltage droop", "source": "https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future"},
 {"fact": "SMIC N+3 measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, for 113.4 million transistors per square millimeter, against 107.7 for TSMC N6", "source": "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"},
 {"fact": "China launched its third National Integrated Circuit Fund, worth 344 billion yuan, about $47 billion, in May 2024", "source": "https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions"},
 {"fact": "China has announced $43 billion for domestic EUV development. CSIS judged in September 2025 that EUV remains firmly out of reach despite massive state investment", "source": "https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography"}
 ],
 "figures": [
 {"id": "switch-shapes", "type": "animation", "src": "transistor", "title": "Why the gate wraps around the channel", "note": "Simplified. The channel is seen end on, cut across the gate, with current drawn as points of light. Not to scale."},
 {
 "id": "node-roadmap",
 "type": "timeline",
 "title": "TSMC's logic roadmap beyond N2, from its own announcements",
 "finding": "TSMC plans four logic nodes beyond N2 for 2028 and 2029",
 "unit": "",
 "data": [
 ["2028", "N2U, 3-4% faster or 8-10% lower power than N2P"],
 ["2028", "A14, the base node for A13 and A12"],
 ["2029", "A13, a direct shrink of A14 for 6% area savings"],
 ["2029", "A12, the A14 platform with Super Power Rail backside power"]
 ],
 "source": {"label": "TSMC, 2026 North America Technology Symposium", "url": "https://pr.tsmc.com/english/news/3302"}
 },
 {
 "id": "density-by-node",
 "type": "bars",
 "title": "TSMC's published chip density gains, each over the node TSMC names, with A16 at its stated maximum",
 "finding": "N2P gains 15 percent chip density and A16 up to 10 percent",
 "unit": "%",
 "data": [["N2P vs N3E, chip density", 15], ["A16 vs N2P, chip density", 10]],
 "source": {"label": "TSMC advanced technologies, HPC platform", "url": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"}
 }
 ]
}
---
# Transistors and the Front End

Nvidia's Blackwell GPU holds 208 billion switches on two dies, each die the largest a lithography machine can print in one shot ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Every switch has to turn on fully, let almost no current through when off, and keep doing it for years. Making the switches is called the front end of line. Wiring them together is the back end of line.

## How it works

The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch works like a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. For decades chipmakers made the strips shorter, so the transistors switched faster and more of them fit on a chip. But once the strip gets short enough, the valve stops sealing. Current leaks through even when the gate is off, and the chip burns power doing nothing. The newest kind of transistor, called gate-all-around, cuts this leak by wrapping the gate around all four sides of the strip. Building them takes a long sequence of steps that have to run in exact order. Only three companies, TSMC, Intel and Samsung, make these switches in volume. In 2024 the United States began requiring a license to share the know-how for building them, except with countries that impose matching controls.

{{figure:switch-shapes}}

The front end builds the transistors in a fixed order, starting with the channel. In a FinFET, the older design, the fab etches the silicon into thin fins that stand up from the wafer. The gate then goes over the top and both sides of each fin, three sides instead of one.

In a gate-all-around transistor, the fab instead grows alternating layers of silicon and silicon-germanium and cuts the stack into narrow bars ([source](https://www.imec-int.com/en/articles/entering-nanosheet-transistor-era-0)). It lays a placeholder, called a dummy gate, across each bar where the real gate will go ([source](https://arxiv.org/abs/2201.04725)). On either side of the placeholder it cuts deep trenches where the source and drain, the two ends of the channel, will go ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-unveils-next-gen-chipmaking-products)). Through those trenches it etches the silicon-germanium layers back a little and fills the gaps with an insulator, the inner spacer, which keeps the gate apart from the source and drain ([source](https://www.imec-int.com/en/articles/entering-nanosheet-transistor-era-0)). Then it grows the source and drain as crystal inside the trenches, a step called epitaxy ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-unveils-next-gen-chipmaking-products)).

Only then does the fab remove the placeholder and etch away the silicon-germanium, leaving thin silicon sheets that hang between the source and drain like shelves ([source](https://www.imec-int.com/en/articles/entering-nanosheet-transistor-era-0)). The inner spacer shields the source and drain from that etch ([source](https://arxiv.org/abs/2201.04725)). The fab coats every sheet with an insulating film a few atoms thick, so the gate can control the channel without touching it. Gate metal then fills the gaps above, below and beside each sheet, covering all four sides ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-technologies-enable-2d-scaling-euv-and-3d-gate)). Last come the contacts, small metal plugs down to the source, the drain and the gate, ready for the wiring layers above.

The steps have to run in exact order, because later layers cover earlier ones. Once gate metal surrounds a sheet, the insulating film can no longer go between the sheet and the metal. Each step is a separate deposition, etch or implant. An implant step, called ion implantation, fires atoms of boron or phosphorus into chosen patches of silicon so they conduct the way the design needs.

Current leaks in two main ways, straight through the gate insulator and along the channel from end to end while the gate is off. The second grows as the channel gets shorter, and wrapping the gate around the channel reduces it. Three fixes deal with the two leaks:

- **Better insulator.** A thicker hafnium-based film, paired with a metal gate, lets fewer electrons slip straight through yet controls the channel as tightly as before. Intel replaced the silicon dioxide insulator with it at 45 nm in 2007 ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)). It said the new film cut leakage through the insulator more than tenfold ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)). With the metal gate, it could either raise the current a switch carries when on by more than 20 percent or cut leakage along the channel more than fivefold ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Fins and nanosheets wrap gate metal around more sides of the channel.
- **Thinner channel.** The fab thins the silicon until no current can flow where the gate cannot reach it.

## Variants and trade-offs

### Planar and FinFET

A planar transistor lays the gate on one side of a flat channel. As the channel shortens, the gate loses control of it. A fin stands the channel on edge so the gate covers three sides. But each fin adds a fixed amount of current, so a designer who needs more current has to add a whole fin.

### Gate-all-around nanosheets

A nanosheet transistor lays the channel flat again, stacks two to four thin sheets and wraps gate metal around each one. The sheets can be drawn at different widths, so current can be set in finer steps. On N2, TSMC offers NanoFlex, which lets designers mix short and tall standard cells, the basic building blocks of chip design ([source](https://pr.tsmc.com/english/news/3136)). Short cells save area and power, and tall cells give the most performance ([source](https://pr.tsmc.com/english/news/3136)).

TSMC's N2, its first nanosheet node, entered volume production in the fourth quarter of 2025 ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). TSMC rates the follow-on N2P at 18 percent more speed at the same power and 36 percent less power at the same speed than its earlier N3E ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). It gives N2P 1.2 times the logic density of N3E and 1.15 times its chip density, but its technology page does not define either measure ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)).

Intel and Samsung also make gate-all-around transistors. Intel's version, called RibbonFET, is built into its 18A process, which Intel says is in high-volume production in the United States ([source](https://www.intel.com/content/www/us/en/foundry/process/18a.html)). An improved version, 18A-P, adds another 9 percent performance at the same power ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). Samsung got there first, starting initial production of its 3 nm gate-all-around process in June 2022 ([source](https://news.samsung.com/global/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture)). But SemiAnalysis reported in February 2023 that, because of yield problems, high-volume chips on Samsung's 3 nm gate-all-around technology were expected only in 2024 ([source](https://newsletter.semianalysis.com/p/the-future-of-the-transistor)).

Those numbers are the foundries' own claims until someone measures the silicon. Each foundry picks its own baseline, and none publishes a density figure that can be compared with a rival's.

{{figure:density-by-node}}

### Backside power delivery

In a conventional chip, power and signal share one stack of copper wiring above the transistors, where wide power rails crowd out the signal wires. With backside power, the fab grinds the wafer thin and builds a second network for power underneath it.

Intel's version, PowerVia, is part of 18A, and Intel calls it an industry first ([source](https://www.intel.com/content/www/us/en/foundry/process/18a.html)). It cut routed area, the space a block of circuits takes once its wiring is laid out, by 11 percent and dynamic voltage droop tenfold ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). Droop is the sag in supply voltage when a block of logic switches on at once. TSMC's Super Power Rail connects the backside network directly to each transistor's source and drain, the two ends of its channel ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)). Against N2P, TSMC rates A16, which uses Super Power Rail, at 8 to 10 percent more speed, 15 to 20 percent less power and up to 1.10 times the chip density ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)).

TSMC plans to start A14 production in 2028, with more than 20 percent higher logic density than N2 ([source](https://pr.tsmc.com/english/news/3228)). It said in April 2026 that two more processes, A13 and A12, are scheduled to enter production in 2029 ([source](https://pr.tsmc.com/english/news/3302)). A13 is a direct shrink of A14 with 6 percent area savings, and A12 adds Super Power Rail to the A14 platform ([source](https://pr.tsmc.com/english/news/3302)).

{{figure:node-roadmap}}

### CFET and what comes after

A basic logic circuit needs two transistors that switch on opposite signals, and in production chips the two sit side by side. Complementary field-effect transistors, or CFETs, stack the two on top of each other ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)). The research institute imec sees them as an attractive design for logic nodes beyond 1 nm ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)).

## The back end of line

Wiring has become as hard to make as the transistor. Copper seeps into the insulator around it, so every wire needs a barrier, a liner and a cap ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). As the most critical wiring levels drop below a 20 nm pitch, those extra layers take a large share of the wire's width ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). Pitch is the distance from the center of one wire to the center of the next. Two metals are moving into those narrow levels.

- **Ruthenium** shows promise for use without a barrier, which would keep the wire's resistance low ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). imec has demonstrated ruthenium lines at a 16 nm pitch ([source](https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene)).
- **Molybdenum** conducts worse than copper in bulk, with a resistivity of 5.3 microhm-cm against copper's 1.68 ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)). But in a thin film it has up to 30 percent lower resistivity than tungsten, the metal it is replacing in contacts ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)). It needs no barrier either, so chipmakers are putting it into some contacts and local wiring layers ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)).

## Who makes it

TSMC, Intel and Samsung build gate-all-around nodes with extreme-ultraviolet (EUV) lithography. China's SMIC builds 7 nm-class nodes without it ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

SemiAnalysis reported in September 2026 that Intel's Panther Lake, Samsung's Exynos 2600 and Apple's A20 Pro, which is made on TSMC's N2, all use gate-all-around transistors ([source](https://newsletter.semianalysis.com/p/intel-panther-lake-teardown)). In August 2025 Intel called itself the only semiconductor company that both develops and manufactures leading-edge logic chips in the United States ([source](https://www.intc.com/news-events/press-releases/detail/1748/intel-and-trump-administration-reach-historic-agreement-to)).

In July 2025 Rapidus, a state-backed newcomer in Japan, said it had started making 2 nm prototypes at its plant in Chitose, Hokkaido, and would begin mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/)). Its process builds on IBM's 2 nm technology, which the two firms agreed in December 2022 to develop further for production at Rapidus's plant in Japan ([source](https://www.rapidus.inc/en/news_topics/information/ibm-and-rapidus-form-strategic-partnership-to-build-advanced-semiconductor-technology-and-ecosystem-in-japan/)). By June 2026 Rapidus had raised 424.95 billion yen in equity ([source](https://www.rapidus.inc/en/news_topics/information/20260605-2/)). The most recent 150 billion yen came from the Information-Technology Promotion Agency, a state agency under Japan's industry ministry ([source](https://www.rapidus.inc/en/news_topics/information/20260605-2/)). It has also received government research subsidies since fiscal 2022 ([source](https://www.rapidus.inc/en/news_topics/information/20260605-2/)).

A node's name, such as 7 nm, does not measure any feature on the chip. Applied Materials, a toolmaker, said in 2022 that chipmakers raise density in two ways, by printing smaller features and by laying out each logic cell more tightly ([source](https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-technologies-enable-2d-scaling-euv-and-3d-gate)). SMIC's N+3, its third-generation 7 nm process, sets its narrowest wires 32.5 nm apart, tighter than the 36 nm in Intel's Panther Lake chips on 18A ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). But the 18A process itself allows wires 32 nm apart ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). SemiAnalysis called the comparison an incomplete, cherry-picked metric ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). N+3 packs 113.4 million transistors per square millimeter, against 107.7 for TSMC's N6 ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

AI accelerators have usually trailed the leading edge. A die as large as theirs is more likely to hold a defect ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf#page=8)). So the share of dies that work, called the yield, gets high enough only once a process has run long enough to cut its defect rate.

Nvidia's Blackwell is made on an older TSMC process than AMD's MI455X. Blackwell uses a custom TSMC 4NP process ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Epoch AI estimated in December 2025 that a 300 mm wafer on that process costs $17,000 ([source](https://epoch.ai/data-insights/b200-cost-breakdown)). AMD's MI455X, launched on 23 July 2026, is made on TSMC's 2 nm and 3 nm processes ([source](https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html)). It spreads its compute across eight separate dies ([source](https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf)).

SemiAnalysis reported in 2024 that the SRAM cell, which holds one bit in the fast memory on a logic die, had barely shrunk since the 5 nm node ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)). TSMC said in 2025 that its 2 nm SRAM uses a 0.021 square-micrometer cell and gets 1.1 times the density of its previous node by tuning design and process together ([source](https://research.tsmc.com/page/memory/4.html)). See [Memory and HBM](#memory-and-hbm).

## The chokepoint

TSMC, Intel and Samsung do not sell their leading-edge process flows, which set the steps, their order and the tools for each. In September 2024 the United States began requiring a license to share the know-how for building gate-all-around transistors, except with countries that impose matching controls ([source](https://www.federalregister.gov/documents/2024/09/06/2024-19633/commerce-control-list-additions-and-revisions-implementation-of-controls-on-advanced-technologies)).

China has money for chipmaking but cannot buy EUV scanners. It launched its third National Integrated Circuit Fund in May 2024 with 344 billion yuan, about $47 billion ([source](https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions)). China's 7 nm chips have been made on deep-ultraviolet machines, a generation behind EUV ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). China had stockpiled those machines from ASML, the Dutch scanner maker, before export restrictions took effect ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). SMIC gets fine features out of them by building its tightest layers in several patterning steps ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

In July 2026 Reuters reported that a Shanghai state firm had begun making home-grown immersion deep-ultraviolet scanners ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). Citing The Information, it said the firm planned about five that year and roughly 20 in 2027 ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). Reuters's own source said the firm's machine still needed testing and was far from matching ASML's models ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)).

Domestic EUV is further off. China has announced $43 billion to develop it ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). In September 2025 the Center for Strategic and International Studies (CSIS) judged that EUV remains firmly out of reach despite massive state investment ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

See [Lithography](#lithography) and [Who Controls the Chain](#geopolitics).

## Takeaways

Intel's 18A process shipped gate-all-around transistors together with backside power, a second power network built underneath them ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). TSMC says its A14 process will give up to 15 percent more speed or up to 30 percent less power than N2 ([source](https://pr.tsmc.com/english/news/3228)). Rapidus, a state-backed newcomer in Japan, said in July 2025 that it would begin 2 nm mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/)).

China's SMIC makes 7 nm-class chips without extreme-ultraviolet (EUV) lithography, the most advanced way to print chip patterns ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). China has announced $43 billion to develop its own EUV ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). In September 2025 the Center for Strategic and International Studies judged that EUV remains firmly out of reach ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).
