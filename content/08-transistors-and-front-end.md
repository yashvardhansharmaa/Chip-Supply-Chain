---json
{
 "id": "transistors-and-front-end",
 "number": 8,
 "title": "Transistors and the Front End",
 "oneLiner": "Three companies make 2 nm-class transistors in volume, and TSMC promises 1.2 times the logic density for N2P over N3E and more than that for A14 over N2.",
 "plain": "The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch is a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Shorter strips switch faster and more of them fit on a chip, but make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the strip, so it can squeeze the flow shut from every side, and that takes a long sequence of steps that have to run in exact order. Only three companies, TSMC, Intel and Samsung, make these switches in volume. In 2024 the United States put a worldwide license requirement on the know-how for building them, with an exception for countries that impose matching controls. In July 2025 Rapidus in Japan said it had started making 2 nm prototypes at its new plant in Hokkaido.",
 "bridge": "Measured and clean, the layers mean nothing on their own; laid in the right order they become switches.",
 "specimen": "gaa-transistor",
 "specimenCaption": "A gate-all-around transistor, the switch in a 2 nm-class chip, drawn at true proportions. The three silicon sheets are each 6 nm thick and 30 nm wide: a few dozen atoms from top to bottom, and roughly ten thousand times thinner than a human hair. The gold cage is the gate metal wrapping all four sides of each sheet.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 5,
 "leaders": [
 {"name": "TSMC", "country": "TW", "share": "N2 in volume production since 4Q25, TSMC's first nanosheet node"},
 {"name": "Intel", "country": "US", "share": "18A in high-volume manufacturing; 18A-P adds 9% performance at the same power"},
 {"name": "Samsung Foundry", "country": "KR", "share": "First into production with gate-all-around nanosheets, starting initial 3 nm output in June 2022; SF2 family, with SF2Z adding backside power"},
 {"name": "SMIC", "country": "CN", "share": "N+2 and N+3, printed in several passes on older deep-ultraviolet tools, no EUV"},
 {"name": "Rapidus", "country": "JP", "share": "State-backed 2 nm entrant targeting mass production in 2027"}
 ],
 "countries": [
 {"code": "TW", "note": "TSMC N2 at Fab 20 Hsinchu and Fab 22 Kaohsiung"},
 {"code": "US", "note": "Intel 18A at Fab 52, Arizona; TSMC Arizona on N4, with N3 targeted for the second half of 2027"},
 {"code": "KR", "note": "Samsung Hwaseong and Pyeongtaek"},
 {"code": "JP", "note": "Rapidus Chitose, Hokkaido"},
 {"code": "CN", "note": "SMIC Shanghai and Beijing 300 mm lines"}
 ],
 "chinaStatus": "SMIC ships a process it calls N+3, measured at 113.4 million transistors per square millimeter. It prints its tightest layers in two or four passes because it cannot buy an extreme-ultraviolet scanner. Its narrowest wires sit closer together than Intel 18A's, a comparison SemiAnalysis calls an incomplete, cherry-picked metric.",
 "usStatus": "Intel runs the only American-owned line that makes the newest transistors. Its 18A process brought gate-all-around transistors and backside power, where power is fed from under the transistors, to market together. Intel is also the first to use High-NA EUV scanners, the newest kind, in volume production.",
 "costSignal": "No foundry publishes prices for its newest wafers, so cost per transistor cannot be worked out from public figures. TSMC publishes 1.2 times the logic density for N2P over N3E and a gain of more than 20 percent for A14 over N2.",
 "substitutability": {"band": "Hard", "test": "Three firms make gate-all-around transistors, the newest kind, in volume, and none sells its process recipe.", "why": "The scarce thing is the process recipe: which steps, in which order, on which tools. Three firms have written one, so a newcomer knows it can be done but has to work out its own. Rapidus in Japan, backed by the state, is now finding out what it costs to go from prototypes to volume production, with 424.95 billion yen in equity as of June 2026, state research subsidies and a 2027 target. China cannot buy extreme-ultraviolet scanners. It made its 7 nm chips on older deep-ultraviolet machines stockpiled before export controls took effect, and that keeps it behind the newest chips."}
 },
 "keyFacts": [
 {"fact": "TSMC N2 entered volume production in 4Q25, its first nanosheet gate-all-around node", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm"},
 {"fact": "TSMC N2P delivers 18% more speed at the same power, 36% less power at the same speed, 1.2x logic density and 1.15x chip density over N3E", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
 {"fact": "TSMC A16 with Super Power Rail backside power delivers 8-10% more speed, 15-20% less power and up to 1.10x chip density over N2P", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
 {"fact": "TSMC A14 enters production in 2028 with up to 15% more speed, up to 30% less power and more than 20% higher logic density than N2", "source": "https://pr.tsmc.com/english/news/3228"},
 {"fact": "TSMC A13, a direct shrink of A14 giving 6% area savings, is planned for 2029, as is A12 with Super Power Rail", "source": "https://pr.tsmc.com/english/news/3302"},
 {"fact": "Intel 18A shipped gate-all-around and backside power together, giving an 11% routed area reduction and a 10x reduction in dynamic voltage droop", "source": "https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future"},
 {"fact": "SMIC N+3 measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, for 113.4 million transistors per square millimeter, against 107.7 for TSMC N6", "source": "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"},
 {"fact": "China launched its third National Integrated Circuit Fund, worth 344 billion yuan, about $47 billion, in May 2024", "source": "https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions"},
 {"fact": "China has announced $43 billion for domestic EUV development; CSIS judged in September 2025 that EUV remains firmly out of reach despite massive state investment", "source": "https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography"}
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
 "title": "TSMC's published chip density gain over the baseline it names, A16 at its upper bound",
 "unit": "%",
 "data": [["N2P vs N3E", 15], ["A16 backside power vs N2P", 10]],
 "source": {"label": "TSMC advanced technologies, HPC platform", "url": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"}
 }
 ]
}
---
# Transistors and the Front End

A Blackwell GPU is 208 billion switches on two dies, each the largest a lithography machine can print in one shot ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Every switch has to turn on fully, turn off completely, and keep doing it for years. Making the switches is the front end of line; wiring them together is the back end.

## How it works

The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch is a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Shorter strips switch faster and more of them fit on a chip, but make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the strip, so it can squeeze the flow shut from every side, and that takes a long sequence of steps that have to run in exact order. Only three companies, TSMC, Intel and Samsung, make these switches in volume. In 2024 the United States put a worldwide license requirement on the know-how for building them, with an exception for countries that impose matching controls ([source](https://www.federalregister.gov/documents/2024/09/06/2024-19633/commerce-control-list-additions-and-revisions-implementation-of-controls-on-advanced-technologies)). In July 2025 Rapidus in Japan said it had started making 2 nm prototypes at its new plant in Hokkaido ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/)).

{{figure:switch-shapes}}

The front end builds that valve in a fixed order. First it marks where each transistor will sit and fires atoms of boron or phosphorus into the silicon there, a step called ion implantation, so that those patches conduct the way the design needs.

Next it shapes the channel, in a FinFET by etching the silicon into thin fins standing up from the wafer and laying the gate over the top and both sides of each fin, three sides instead of one. In a gate-all-around transistor the fab instead grows alternating layers of silicon and silicon-germanium, cuts the stack into a narrow bar, then dissolves the silicon-germanium away, leaving thin silicon sheets held at their ends like shelves, and fills the gaps above, below and beside each sheet with gate metal, all four sides. Before the metal goes in, a film of insulator a few atoms thick is laid over every sheet, so that the gate controls the channel without touching it. Last come the contacts, small metal plugs down to the two ends of the channel and to the gate, ready for the wiring layers above.

Each of those is a deposition, an etch or an implant of its own, and they have to run in exact order, since a sheet cannot be wrapped once the metal is on, nor the insulator added once it is buried.

Current leaks two ways, straight through the gate insulator and along the channel from end to end while the gate is off. The second is called short-channel leakage, and wrapping the gate around the channel reduces it. Three fixes deal with the two leaks:

- **Better insulator.** A thicker hafnium-based film, paired with a metal gate, lets fewer electrons slip straight through yet controls the channel as tightly as before. Intel replaced silicon dioxide with it at 45 nm in 2007 and said it cut leakage through the insulator more than tenfold and, with the metal gate, leakage along the channel more than fivefold ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Wrap gate metal around more sides of the channel, as fins and nanosheets do.
- **Thinner channel.** Thin the silicon until no current can flow where the gate cannot reach it.

## Variants and trade-offs

### Planar and FinFET

A planar transistor lays the gate on one side of a flat channel, and loses control as the channel shortens. A fin stands the channel on edge so the gate covers three sides, but current then comes in whole fins: a designer who needs more adds one, and nobody gets half a fin.

### Gate-all-around nanosheets

A nanosheet lays the channel back down, stacks two to four thin sheets and threads gate metal around each one. The sheets can be drawn at different widths, so current comes in fine steps again. TSMC sells this as NanoFlex, which lets designers mix short cells for small area with tall cells for performance ([source](https://pr.tsmc.com/english/news/3136)).

N2 entered volume production in the fourth quarter of 2025, TSMC's first nanosheet node ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). TSMC rates the follow-on N2P at 18 percent more speed at the same power, 36 percent less power at the same speed, and 1.2 times the logic density of N3E ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). Intel's RibbonFET shipped on 18A, and 18A-P adds another 9 percent performance at the same power ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). Samsung began initial production of its 3 nm gate-all-around process in June 2022, more than three years before TSMC's N2 ([source](https://news.samsung.com/global/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture)).

Those numbers are vendor claims until someone measures the silicon. Each foundry picks its own baseline, and none publishes a density figure that can be set against a rival's.

{{figure:density-by-node}}

### Backside power delivery

Power and signal share one stack of copper wiring above the transistors, where wide power rails crowd out the signal wires. Backside power grinds the wafer thin and builds a second network underneath it.

Intel shipped it first as PowerVia: on 18A, an 11 percent cut in routed area and a tenfold cut in dynamic voltage droop, the sag in supply voltage when a block of logic switches on at once ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). TSMC's Super Power Rail lands that network straight on each transistor's source and drain, with no buried rail between, which is harder to build and gives more: against N2P, A16 gives 8 to 10 percent more speed, 15 to 20 percent less power and up to 1.10 times the chip density ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)).

{{figure:node-roadmap}}

### CFET and what comes after

A logic gate needs two transistors that switch on opposite signals, and today they sit side by side. The research institute imec sees complementary FETs, which stack the two on top of each other, as an attractive design for logic nodes beyond 1 nm ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)).

## The back end of line

Wiring is now as hard to make as the transistor. Copper seeps into the insulator around it, so every wire needs a barrier, a liner and a cap, and as the most critical wiring levels drop below a 20 nm pitch those extra layers take a large share of the wire's width ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). Two metals are moving into those narrow levels.

- **Ruthenium** shows promise for use without a barrier, which would keep the wire's resistance low ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). imec has demonstrated ruthenium lines at a 16 nm pitch ([source](https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene)).
- **Molybdenum** conducts worse in bulk, 5.3 against copper's 1.68 microhm-cm, but in a thin film it beats tungsten by up to 30 percent and needs no barrier either, which is moving it into some contacts and local wiring layers ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)).

## Who makes it

TSMC, Intel and Samsung build gate-all-around nodes with extreme ultraviolet lithography. SMIC builds 7 nm-class nodes without it ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). State-backed Rapidus targets 2 nm mass production in 2027. By June 2026 it had raised 424.95 billion yen in equity, the latest 150 billion yen from a state agency, and it has received government research subsidies since fiscal 2022 ([source](https://www.rapidus.inc/en/news_topics/information/20260605-2/)).

Node names describe nothing physical. SMIC's N+3, its third-generation 7 nm process, sets its narrowest wires 32.5 nm apart, tighter than Intel 18A's 36 nm, and reaches 113.4 million transistors per square millimeter against 107.7 for TSMC's N6 ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

AI accelerators have usually trailed the leading edge, since a very large die comes out working reliably only on a process that has run for years. Blackwell uses a custom TSMC 4NP ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). AMD's MI455X, launched on 23 July 2026, lists TSMC 2 nm and 3 nm silicon ([source](https://www.amd.com/en/products/accelerators/instinct/mi400/mi455x.html)). It spreads its compute across eight separate dies ([source](https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf)).

SRAM, the fast memory on the logic die, is the scaling failure that hurts AI chips most. TSMC claims 22 percent more SRAM density from N3E to N2, but the gain comes mostly from the circuits around the array, and the cell that holds one bit shrinks little or not at all ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)). See [Memory and HBM](#memory-and-hbm).

## The chokepoint

No single machine makes the front end a chokepoint. The recipe does, and a recipe is which steps run in which order on which tools.

China shows what that recipe costs. The third National Integrated Circuit Fund launched in May 2024 with 344 billion yuan, about $47 billion ([source](https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions)), so money is not the constraint; tools are. A Shanghai state firm began building domestic immersion scanners in 2026 and planned about five that year and roughly 20 in 2027 ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). Those are deep-ultraviolet machines, a generation behind EUV, and SMIC gets fine features out of them by printing its tightest layers in several passes. That volume keeps those lines running and comes nowhere near replacing ASML. EUV is further away: China has announced $43 billion for domestic development, and the Center for Strategic and International Studies judged in September 2025 that EUV remains firmly out of reach despite massive state investment ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

See [Lithography](#lithography) and [Geopolitics](#geopolitics).

## Key evaluation criteria

- **Electrostatic control.** How far the gate wraps the channel. It sets how much the switch leaks when off, and the lowest supply voltage it can run on.
- **Density.** Transistors per square millimeter, comparable only inside one foundry's own numbering and for one kind of cell.
- **Interconnect resistance.** Below a 20 nm wire spacing, copper wiring adds more and more delay from its resistance and capacitance ([source](https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene)).
- **Power delivery.** The voltage lost carrying power across the die. Backside power frees area and cuts the droop tenfold ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).
- **SRAM scaling.** The cell that holds one bit has barely shrunk since the 5 nm node, which caps how much cache an accelerator can afford ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)).
- **Cost per transistor.** No foundry publishes wafer prices, so it cannot be worked out from public figures.

## Takeaways

TSMC's N2 process, which it calls the industry's most advanced, entered volume production in late 2025 with its first nanosheet transistors ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). TSMC's own figures give N2P 1.2 times the logic density of N3E, and A16, which adds backside power, up to 1.10 times the chip density of N2P ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). TSMC says its A14 process, planned for production in 2028, will raise logic density by more than 20 percent over N2 ([source](https://pr.tsmc.com/english/news/3228)). China made its most advanced chips, at 7 nm, with older deep ultraviolet machines stockpiled before export controls took effect, and in September 2025 CSIS judged that EUV remained firmly out of China's reach ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).
