---json
{
 "id": "transistors-and-front-end",
 "number": 8,
 "title": "Transistors and the Front End",
 "oneLiner": "Only TSMC, Intel and Samsung make 2 nm-class transistors in volume. TSMC plans its A14 process for 2028, with more than 20 percent higher logic density than N2.",
 "plain": "The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch works like a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Shorter strips switch faster, and more of them fit on a chip. But once the strip gets short enough, the valve stops sealing. Current leaks through even when the gate is off, and the chip burns power doing nothing. The newest kind of transistor, called gate-all-around, fixes this by wrapping the gate around all four sides of the strip. Building them takes a long sequence of steps that have to run in exact order. Only three companies, TSMC, Intel and Samsung, make these switches in volume. In 2024 the United States put a worldwide license requirement on the know-how for building them, with an exception for countries that impose matching controls.",
 "bridge": "Measured and clean, the layers mean nothing on their own; laid in the right order they become switches.",
 "specimen": "gaa-transistor",
 "specimenCaption": "A gate-all-around transistor, the switch in a 2 nm-class chip, drawn at true proportions. The three silicon sheets are each 6 nm thick and 30 nm wide: a few dozen atoms from top to bottom, and roughly ten thousand times thinner than a human hair. The gold cage is the gate metal wrapping all four sides of each sheet.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "TSMC", "country": "TW", "share": "N2 in volume production since 4Q25, TSMC's first nanosheet node"},
 {"name": "Intel", "country": "US", "share": "18A in high-volume manufacturing. 18A-P adds 9% performance at the same power"},
 {"name": "Samsung Foundry", "country": "KR", "share": "First into production with gate-all-around nanosheets, starting initial 3 nm output in June 2022. In the SF2 family, SF2Z adds backside power"},
 {"name": "SMIC", "country": "CN", "share": "N+2 and N+3, printed in several passes on older deep-ultraviolet tools, no EUV"},
 {"name": "Rapidus", "country": "JP", "share": "State-backed 2 nm entrant targeting mass production in 2027"}
 ],
 "countries": [
 {"code": "TW", "note": "TSMC N2 at Fab 20 Hsinchu and Fab 22 Kaohsiung"},
 {"code": "US", "note": "Intel 18A at Fab 52, Arizona. TSMC Arizona on N4, with N3 targeted for the second half of 2027"},
 {"code": "KR", "note": "Samsung Hwaseong and Pyeongtaek"},
 {"code": "JP", "note": "Rapidus Chitose, Hokkaido"},
 {"code": "CN", "note": "SMIC Shanghai and Beijing 300 mm lines"}
 ],
 "chinaStatus": "SMIC ships a process it calls N+3, measured at 113.4 million transistors per square millimeter. It prints its tightest layers in two or four passes because it cannot buy an extreme-ultraviolet scanner. Its narrowest wires sit closer together than Intel 18A's, a comparison SemiAnalysis calls an incomplete, cherry-picked metric.",
 "usStatus": "Intel runs the only American-owned line that makes the newest transistors. Its 18A process brought gate-all-around transistors and backside power to market together. Backside power feeds the transistors from underneath. Intel is also the first to use High-NA EUV scanners, the newest kind, in volume production.",
 "costSignal": "No foundry publishes prices for its newest wafers, so cost per transistor cannot be worked out from public figures. TSMC does publish density gains. It rates N2P at 1.2 times the logic density of N3E, and A14 at more than 20 percent above N2.",
 "substitutability": {"band": "Hard", "test": "Three firms make gate-all-around transistors, the newest kind, in volume, and none sells its process recipe.", "why": "A newcomer has to work out its own process recipe, which sets the steps, their order and the tools for each. Three firms have written one. Rapidus, a state-backed newcomer in Japan, aims to move from prototypes to volume production in 2027. As of June 2026 it had raised 424.95 billion yen in equity and received state research subsidies. China cannot buy extreme-ultraviolet scanners. It made its 7 nm chips on older deep-ultraviolet machines stockpiled before export controls took effect. Relying on those machines keeps it behind the newest chips."}
 },
 "keyFacts": [
 {"fact": "TSMC N2 entered volume production in 4Q25, its first nanosheet gate-all-around node", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm"},
 {"fact": "TSMC rates N2P at 18% more speed at the same power, 36% less power at the same speed, 1.2x logic density and 1.15x chip density over N3E", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
 {"fact": "TSMC rates A16, with Super Power Rail backside power, at 8-10% more speed, 15-20% less power and up to 1.10x chip density over N2P", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
 {"fact": "TSMC A14 is planned for production in 2028, with up to 15% more speed, up to 30% less power and more than 20% higher logic density than N2", "source": "https://pr.tsmc.com/english/news/3228"},
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
 "unit": "",
 "data": [
 ["2028-01-01", "N2U, 3-4% faster or 8-10% lower power than N2P"],
 ["2028-01-01", "A14, up to 15% faster and more than 20% denser than N2"],
 ["2029-01-01", "A13, a direct shrink of A14 for 6% area savings"],
 ["2029-01-01", "A12, the A14 platform with Super Power Rail backside power"]
 ],
 "source": {"label": "TSMC, 2026 North America Technology Symposium", "url": "https://pr.tsmc.com/english/news/3302"}
 },
 {
 "id": "density-by-node",
 "type": "bars",
 "title": "TSMC's published chip density gains, each over the baseline TSMC names, with A16 at its stated maximum",
 "unit": "%",
 "data": [["N2P vs N3E", 15], ["A16 backside power vs N2P", 10]],
 "source": {"label": "TSMC advanced technologies, HPC platform", "url": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"}
 }
 ]
}
---
# Transistors and the Front End

Nvidia's Blackwell GPU holds 208 billion switches on two dies, each die the largest a lithography machine can print in one shot ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Every switch has to turn on fully, turn off completely, and keep doing it for years. Making the switches is called the front end of line. Wiring them together is the back end of line.

## How it works

The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch works like a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Shorter strips switch faster, and more of them fit on a chip. But once the strip gets short enough, the valve stops sealing. Current leaks through even when the gate is off, and the chip burns power doing nothing. The newest kind of transistor, called gate-all-around, fixes this by wrapping the gate around all four sides of the strip. Building them takes a long sequence of steps that have to run in exact order. Only three companies, TSMC, Intel and Samsung, make these switches in volume. In 2024 the United States put a worldwide license requirement on the know-how for building them, with an exception for countries that impose matching controls.

{{figure:switch-shapes}}

The front end builds the transistors in a fixed order. First it marks where each transistor will sit and fires atoms of boron or phosphorus into the silicon there. This step, called ion implantation, makes those patches conduct the way the design needs.

Next it shapes the channel. In a FinFET, the older design, the fab etches the silicon into thin fins that stand up from the wafer. The gate then goes over the top and both sides of each fin, three sides instead of one.

In a gate-all-around transistor, the fab instead grows alternating layers of silicon and silicon-germanium and cuts the stack into a narrow bar. It then dissolves the silicon-germanium away, leaving thin silicon sheets held at their ends like shelves. It coats every sheet with an insulating film a few atoms thick, so the gate can control the channel without touching it. Gate metal then fills the gaps above, below and beside each sheet, covering all four sides. Last come the contacts, small metal plugs down to the two ends of the channel and to the gate, ready for the wiring layers above.

Each of those steps is a separate deposition, etch or implant. They have to run in exact order, because later layers cover earlier ones. Once gate metal surrounds a sheet, the insulator can no longer go between them.

Current leaks two ways, straight through the gate insulator and along the channel from end to end while the gate is off. The second is called short-channel leakage, and wrapping the gate around the channel reduces it. Three fixes deal with the two leaks:

- **Better insulator.** A thicker hafnium-based film, paired with a metal gate, lets fewer electrons slip straight through yet controls the channel as tightly as before. Intel replaced the silicon dioxide insulator with it at 45 nm in 2007 ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)). It said the new film cut leakage through the insulator more than tenfold and, with the metal gate, leakage along the channel more than fivefold ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Fins and nanosheets wrap gate metal around more sides of the channel.
- **Thinner channel.** The fab thins the silicon until no current can flow where the gate cannot reach it.

## Variants and trade-offs

### Planar and FinFET

A planar transistor lays the gate on one side of a flat channel. As the channel shortens, the gate loses control of it. A fin stands the channel on edge so the gate covers three sides. But each fin adds a fixed amount of current, so a designer who needs more current has to add a whole fin.

### Gate-all-around nanosheets

A nanosheet transistor lays the channel flat again, stacks two to four thin sheets and wraps gate metal around each one. The sheets can be drawn at different widths, so current can be set in finer steps. TSMC sells this as NanoFlex, which lets designers mix short logic cells for small area with tall cells for performance ([source](https://pr.tsmc.com/english/news/3136)).

TSMC's N2, its first nanosheet node, entered volume production in the fourth quarter of 2025 ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). TSMC rates the follow-on N2P at 18 percent more speed at the same power, 36 percent less power at the same speed, and 1.2 times the logic density of its earlier N3E ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). Intel's version, called RibbonFET, shipped on its 18A process ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). An improved version, 18A-P, adds another 9 percent performance at the same power ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). Samsung began initial production of its 3 nm gate-all-around process in June 2022, more than three years before TSMC's N2 ([source](https://news.samsung.com/global/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture)).

Those numbers are the foundries' own claims until someone measures the silicon. Each foundry picks its own baseline, and none publishes a density figure that can be compared with a rival's.

{{figure:density-by-node}}

### Backside power delivery

In a conventional chip, power and signal share one stack of copper wiring above the transistors, where wide power rails crowd out the signal wires. With backside power, the fab grinds the wafer thin and builds a second network for power underneath it.

Intel shipped backside power first, as PowerVia on 18A ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). It cut routed area by 11 percent and dynamic voltage droop tenfold ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). Droop is the sag in supply voltage when a block of logic switches on at once. TSMC's Super Power Rail connects the backside network directly to each transistor's source and drain, the two ends of its channel. Against N2P, TSMC rates A16, which uses Super Power Rail, at 8 to 10 percent more speed, 15 to 20 percent less power and up to 1.10 times the chip density ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)).

TSMC said in April 2026 that two more processes, A13 and A12, are scheduled to enter production in 2029 ([source](https://pr.tsmc.com/english/news/3302)). A13 is a direct shrink of A14 with 6 percent area savings, and A12 adds Super Power Rail to the A14 platform ([source](https://pr.tsmc.com/english/news/3302)).

{{figure:node-roadmap}}

### CFET and what comes after

A basic logic circuit needs two transistors that switch on opposite signals, and in production chips the two sit side by side. Complementary field-effect transistors, or CFETs, stack the two on top of each other ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)). The research institute imec sees them as an attractive design for logic nodes beyond 1 nm ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)).

## The back end of line

Wiring has become as hard to make as the transistor. Copper seeps into the insulator around it, so every wire needs a barrier, a liner and a cap ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). As the most critical wiring levels drop below a 20 nm pitch, those extra layers take a large share of the wire's width ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). Pitch is the distance from the center of one wire to the center of the next. Two metals are moving into those narrow levels.

- **Ruthenium** shows promise for use without a barrier, which would keep the wire's resistance low ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). imec has demonstrated ruthenium lines at a 16 nm pitch ([source](https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene)).
- **Molybdenum** conducts worse than copper in bulk, with a resistivity of 5.3 microhm-cm against copper's 1.68 ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)). But in a thin film it beats tungsten by up to 30 percent and needs no barrier either, so chipmakers are putting it into some contacts and local wiring layers ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)).

## Who makes it

TSMC, Intel and Samsung build gate-all-around nodes with extreme-ultraviolet (EUV) lithography. China's SMIC builds 7 nm-class nodes without it ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). In July 2025 Rapidus, a state-backed newcomer in Japan, said it had started making 2 nm prototypes at its plant in Chitose, Hokkaido, and would begin mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/)). By June 2026 it had raised 424.95 billion yen in equity, the latest 150 billion yen from a state agency ([source](https://www.rapidus.inc/en/news_topics/information/20260605-2/)). It has also received government research subsidies since fiscal 2022 ([source](https://www.rapidus.inc/en/news_topics/information/20260605-2/)).

A node's name, such as 7 nm, does not measure any feature on the chip. SMIC's N+3, its third-generation 7 nm process, sets its narrowest wires 32.5 nm apart, tighter than Intel 18A's 36 nm ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). It packs 113.4 million transistors per square millimeter, against 107.7 for TSMC's N6 ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

AI accelerators have usually trailed the leading edge, because a die as large as theirs comes out working reliably only on a process that has run for years. Blackwell uses a custom TSMC 4NP process ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). AMD's MI455X, launched on 23 July 2026, lists TSMC 2 nm and 3 nm silicon ([source](https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html)). It spreads its compute across eight separate dies ([source](https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf)).

SRAM, the fast memory on the logic die, is the part whose failure to shrink hurts AI chips most. TSMC claims 22 percent more SRAM density from N3E to N2 ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)). But the gain comes mostly from the circuits around the memory array, and the cell that holds one bit shrinks little or not at all ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)). See [Memory and HBM](#memory-and-hbm).

## The chokepoint

TSMC, Intel and Samsung do not sell their process recipes, which set the steps, their order and the tools for each. In September 2024 the United States put a worldwide license requirement on the know-how for building gate-all-around transistors, with an exception for countries that impose matching controls ([source](https://www.federalregister.gov/documents/2024/09/06/2024-19633/commerce-control-list-additions-and-revisions-implementation-of-controls-on-advanced-technologies)).

China launched its third National Integrated Circuit Fund in May 2024 with 344 billion yuan, about $47 billion ([source](https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions)). But China cannot buy EUV scanners.

A Shanghai state firm began building domestic immersion scanners in 2026 and planned about five that year and roughly 20 in 2027 ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). Those are deep-ultraviolet machines, a generation behind EUV. SMIC gets fine features out of them by printing its tightest layers in several passes. That many scanners keep those lines running but come nowhere near replacing ASML, the Dutch scanner maker.

Domestic EUV is further off. China has announced $43 billion to develop it ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). In September 2025 the Center for Strategic and International Studies (CSIS) judged that EUV remains firmly out of reach despite massive state investment ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

See [Lithography](#lithography) and [Geopolitics](#geopolitics).

## Key evaluation criteria

- **Electrostatic control.** How far the gate wraps the channel. It sets how much the switch leaks when off, and the lowest supply voltage it can run on.
- **Density.** Transistors per square millimeter, comparable only inside one foundry's own numbering and for one kind of cell.
- **Interconnect resistance.** Below a 20 nm pitch, copper wiring adds more and more delay from its resistance and capacitance ([source](https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene)).
- **Power delivery.** The voltage lost carrying power across the die. On Intel's 18A, backside power frees area and cuts the droop tenfold ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).
- **SRAM scaling.** The cell that holds one bit has barely shrunk since the 5 nm node, which caps how much SRAM an accelerator can afford ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)).
- **Cost per transistor.** No foundry publishes wafer prices, so it cannot be worked out from public figures.

## Takeaways

Intel's 18A process shipped gate-all-around transistors together with backside power, a second power network built underneath them ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). TSMC says its A14 process will give up to 15 percent more speed or up to 30 percent less power than N2 ([source](https://pr.tsmc.com/english/news/3228)). Rapidus, a state-backed newcomer in Japan, said in July 2025 that it would begin 2 nm mass production in 2027 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/)).

China's SMIC makes 7 nm-class chips without extreme-ultraviolet (EUV) lithography, one way of printing chip patterns ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). China has announced $43 billion to develop its own EUV ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)). In September 2025 the Center for Strategic and International Studies judged that EUV remains firmly out of reach ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).
