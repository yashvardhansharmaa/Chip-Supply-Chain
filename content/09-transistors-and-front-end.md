---json
{
  "id": "transistors-and-front-end",
  "number": 9,
  "title": "Transistors and the Front End",
  "oneLiner": "Three companies can build a 2 nm-class switch. Shrinking stopped paying for itself about a decade ago, and every gain since has been bought with extra process steps.",
  "plain": "The front end of a chip factory builds the switches. Each one is a valve on a pipe: current runs along a silicon channel, and a voltage on the gate above it opens or shuts the flow. Make the channel short enough and the valve stops sealing, so current leaks through even when the gate is off and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the channel, which takes about a thousand steps in exact order. Only TSMC, Intel and Samsung can run that sequence, which is why an export rule can name them all.",
  "specimen": "gaa-transistor",
  "specimenCaption": "Right: a gate-all-around nanosheet transistor. Three stacked silicon sheets run from the source at one end to the drain at the other, the gate metal in amber wraps all four sides of each sheet, inner spacers keep that metal from touching the two ends, and the contacts land on top.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "N2 in volume production since 4Q25, the first nanosheet node"},
      {"name": "Intel", "country": "US", "share": "18A in high-volume manufacturing; 18A-P adds 9% performance at the same power"},
      {"name": "Samsung Foundry", "country": "KR", "share": "SF2 family; SF2Z adds backside power"},
      {"name": "SMIC", "country": "CN", "share": "N+2 and N+3, printed in several passes on older deep-ultraviolet tools, no EUV"},
      {"name": "Rapidus", "country": "JP", "share": "State-backed 2 nm entrant targeting mass production in 2027"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC N2 at Fab 20 Hsinchu and Fab 22 Kaohsiung"},
      {"code": "US", "note": "Intel 18A at Fab 52, Arizona; TSMC Arizona on N4 and N3"},
      {"code": "KR", "note": "Samsung Hwaseong and Pyeongtaek"},
      {"code": "JP", "note": "Rapidus Chitose, Hokkaido"},
      {"code": "CN", "note": "SMIC Shanghai and Beijing 300 mm lines"}
    ],
    "chinaStatus": "SMIC ships an N+3 node measured at 113.4 million transistors per square millimetre, printing each layer in two or four passes because it cannot buy an extreme-ultraviolet scanner. Its narrowest wires sit closer together than Intel 18A's, which is what a decade of state money buys without one.",
    "usStatus": "Intel runs the only leading-edge transistor line owned by an American company. It brought gate-all-around and backside power to market together on 18A and is the first to run High-NA EUV in high-volume manufacturing.",
    "costSignal": "No foundry publishes leading-edge wafer prices, so the public signal is TSMC's own density gain per node, which falls from 1.2x at N2P to about 1.1x at A16",
    "substitution": {"years": "10+", "why": "A 2 nm-class process is over a thousand steps tuned to one specific set of tools; SMIC has spent a decade and tens of billions to reach a node TSMC retired in 2019."}
  },
  "keyFacts": [
    {"fact": "TSMC N2 entered volume production in 4Q25, its first nanosheet gate-all-around node", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm"},
    {"fact": "TSMC N2P delivers 18% more speed at the same power, 36% less power at the same speed, 1.2x logic density and 1.15x chip density over N3E", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
    {"fact": "TSMC A16 with Super Power Rail backside power delivers 8-10% more speed, 15-20% less power and up to 1.10x chip density over N2P", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
    {"fact": "TSMC A14 enters production in 2028 with up to 15% more speed, up to 30% less power and more than 20% higher logic density than N2", "source": "https://pr.tsmc.com/english/news/3228"},
    {"fact": "TSMC A13, a direct shrink of A14 giving 6% area savings, is planned for 2029, as is A12 with Super Power Rail", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "Intel 18A shipped gate-all-around and backside power together, giving an 11% routed area reduction and a 10x reduction in dynamic voltage droop", "source": "https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future"},
    {"fact": "SMIC N+3 measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, for 113.4 million transistors per square millimetre, against 107.7 for TSMC N6", "source": "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"},
    {"fact": "China's third National Integrated Circuit Fund raised 344 billion yuan, about $47 billion, in May 2024", "source": "https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions"},
    {"fact": "China has announced $43 billion for domestic EUV development; CSIS judges working EUV systems still out of reach", "source": "https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography"}
  ],
  "figures": [
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
      "title": "TSMC's published density gain, node over node",
      "unit": "x versus the baseline node",
      "data": [["N2P logic vs N3E", 1.2], ["N2P chip vs N3E", 1.15], ["A16 chip vs N2P", 1.1]],
      "source": {"label": "TSMC advanced technologies, HPC platform", "url": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"}
    }
  ]
}
---
# Transistors and the Front End

A Blackwell GPU is 208 billion switches on two dies, each as large as a lithography machine can print in one shot ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Every switch has to turn on hard, turn off completely, and keep doing it for years. Making the switches is the front end of line; wiring them together is the back end.

## How it works

The front end of a chip factory builds the switches. Each one is a valve on a pipe: current runs along a silicon channel, and a voltage on the gate above it opens or shuts the flow. Make the channel short enough and the valve stops sealing, so current leaks through even when the gate is off and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the channel, which takes about a thousand steps in exact order. Only TSMC, Intel and Samsung can run that sequence, which is why an export rule can name them all.

That leak is short-channel leakage, and it has three fixes:

- **Better insulator.** A layer physically thicker, so less current tunnels through it, but gripping the channel as tightly as before: Intel replaced the gate's silicon-dioxide insulator with a hafnium one at 45 nm in 2007 ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Wrap the gate metal around more sides of the channel, as fins and then nanosheets do.
- **Thinner channel.** Thin the silicon until no current has a path through the middle that the gate cannot reach.

## Variants and trade-offs

### Planar and FinFET

A planar transistor lays the gate on one side of a flat channel, and loses control as the channel shortens. A fin stands the channel on edge so the gate covers three sides. The cost is that current then comes in whole fins: a designer who needs more adds another fin, and nobody gets one and a half.

### Gate-all-around nanosheets

A nanosheet lays the channel back down, stacks two to four thin sheets and threads gate metal all the way around each one. The sheets can be drawn to any width, so current is back in fine increments, which TSMC sells as NanoFlex.

N2 entered volume production in the fourth quarter of 2025, TSMC's first nanosheet node ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). TSMC rates the follow-on N2P at 18 percent more speed at the same power, 36 percent less power at the same speed, and 1.2 times the logic density of N3E ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). Intel's RibbonFET shipped on 18A, and 18A-P adds another 9 percent performance at the same power ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).

Those numbers are vendor claims until someone measures the silicon. Each foundry picks its own baseline, and none publishes a density figure you can set against a rival's.

{{figure:density-by-node}}

### Backside power delivery

Power and signal share one stack of copper wiring above the transistors, where the wide power rails crowd out the signal wires. Backside power grinds the wafer thin and builds a second network underneath, so power arrives from below.

Intel shipped it first as PowerVia: on 18A, an 11 percent cut in routed area and a tenfold cut in dynamic voltage droop, the sag in supply voltage when a block of logic switches on at once ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). TSMC's Super Power Rail lands that network straight on each transistor's source and drain rather than on a buried rail, which is harder to build and buys more: against N2P, A16 gives 8 to 10 percent more speed, 15 to 20 percent less power and up to 1.10 times the chip density ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). SemiAnalysis puts the saving at 15 to 20 percent on power for high-performance designs whoever builds them ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)).

{{figure:node-roadmap}}

### CFET and what comes after

Every logic gate needs a pair of transistors, one that conducts when its gate goes high and one that conducts when it goes low, and today the two sit side by side. The research institute imec expects complementary FETs to stack them instead, roughly halving the pair's area beyond the 1 nm nodes ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)).

## The back end of line

Wiring is now as hard as the transistor. Copper seeps into the insulator around it unless a barrier, a liner and a cap wrap the wire, and once the narrowest wires sit less than 20 nm apart those wrappers take a large share of the cross-section that should be carrying current ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). Two metals are moving into those narrow levels.

- **Ruthenium** needs no barrier, so the whole wire conducts; imec has demonstrated ruthenium lines at a 16 nm pitch ([source](https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene)).
- **Molybdenum** conducts worse in bulk, 5.3 against copper's 1.68 microhm-cm, but in a thin film it beats tungsten by up to 30 percent and also needs no barrier, which is moving it into the contacts that land on each transistor ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)).

## Who makes it

Three companies build gate-all-around nodes with extreme ultraviolet lithography: TSMC, Intel and Samsung. SMIC builds 7 and 5 nm-class nodes without it. State-backed Rapidus targets 2 nm mass production in 2027 on 267.6 billion yen raised in February 2026 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

Node names describe nothing physical. SMIC's N+3, sold as 5 nm-class, sets its narrowest wires 32.5 nm apart, tighter than Intel 18A's 36 nm, and reaches 113.4 million transistors per square millimetre against 107.7 for TSMC's N6 ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

AI accelerators sit a node behind the leading edge: a die that large only comes out working often enough on a process that has been running for years. Blackwell uses a custom TSMC 4NP ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)).

SRAM, the fast memory built on the logic die itself, is the scaling failure that hurts AI chips most. TSMC claims 22 percent more SRAM density from N3E to N2, but the gain comes from the circuits around the array rather than from the cell that holds one bit ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)). That is much of why accelerators push their memory off the logic die. See Memory and HBM.

## The chokepoint

No single machine makes the front end a chokepoint. The scarce thing is the recipe: which steps, in which order, on which tools.

China shows what that recipe costs. The money is there: the third National Integrated Circuit Fund raised 344 billion yuan, about $47 billion, in May 2024 ([source](https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions)). The tools are not. A Shanghai state firm began building domestic immersion scanners in 2026, in single-digit annual volumes ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). Those are deep-ultraviolet machines, a generation behind EUV, and SMIC gets fine features out of them by printing each layer in several passes. Single digits keeps those lines running and comes nowhere near replacing ASML. EUV is further off again: China has announced $43 billion for domestic development, and the Center for Strategic and International Studies still reads working systems as out of reach ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

See Lithography and Geopolitics.

## Key evaluation criteria

- **Electrostatic control** — how far the gate wraps the channel. It sets how much current leaks when the switch is off, and the lowest voltage the chip can run on.
- **Density** — transistors per square millimetre, comparable only inside one foundry's own numbering and for one kind of cell.
- **Interconnect resistance** — once the narrowest wires sit less than 20 nm apart, the wire rather than the transistor sets the delay ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)).
- **Power delivery** — how much voltage is lost carrying power across the die. Backside power buys back area and cuts the droop tenfold ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).
- **SRAM scaling** — the cell that holds one bit has stopped shrinking, which caps how much memory an accelerator can afford on the logic die.
- **Cost per transistor** — no foundry publishes wafer prices, so the shrinking density gain per node is the proxy. We think this is the first era where cost per transistor rises.

## Takeaways

Every gain since the FinFET era has been bought with process steps and new materials rather than with geometry. TSMC's own numbers show the density gain per node falling from 1.2 times at N2P to about 1.1 at A16 ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). Three companies can run a 2 nm-class process, and only TSMC runs it at volume for outside customers. SRAM has stopped shrinking, which is why accelerators keep their memory off the logic die. China can reach 5 nm-class geometry without EUV, and CSIS still reads working EUV systems as out of reach, which is the gap the export controls defend ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).
