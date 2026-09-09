---json
{
  "id": "transistors-and-front-end",
  "number": 9,
  "title": "Transistors and the Front End",
  "oneLiner": "Three companies can build a 2 nm-class switch. Geometry stopped scaling for free about a decade ago, and everything since has been bought with process steps.",
  "plain": "A transistor is a valve on a pipe. Current runs along a silicon channel, and a voltage on the gate above it opens or shuts the flow. Make the channel short enough and the valve stops sealing: current leaks through even when the gate says off, so a chip burns power doing nothing. The fix is to wrap the gate around all four sides of the channel, which takes about a thousand process steps in exact order. Three companies can run that sequence, which is why a regulator can name them.",
  "specimen": "gaa-transistor",
  "specimenCaption": "Right: a gate-all-around nanosheet transistor. Three stacked silicon sheets run source to drain, the gate metal wraps all four sides of each sheet, inner spacers isolate the gate from the source and drain epitaxy, and the contacts land on top.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "N2 in volume production since 4Q25, the first nanosheet node"},
      {"name": "Intel", "country": "US", "share": "18A in high-volume manufacturing; 18A-P adds 9% performance at the same power"},
      {"name": "Samsung Foundry", "country": "KR", "share": "SF2 family; SF2Z adds backside power"},
      {"name": "SMIC", "country": "CN", "share": "N+2 and N+3 built with DUV multipatterning, no EUV"},
      {"name": "Rapidus", "country": "JP", "share": "State-backed 2 nm entrant targeting mass production in 2027"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC N2 at Fab 20 Hsinchu and Fab 22 Kaohsiung"},
      {"code": "US", "note": "Intel 18A at Fab 52, Arizona; TSMC Arizona on N4 and N3"},
      {"code": "KR", "note": "Samsung Hwaseong and Pyeongtaek"},
      {"code": "JP", "note": "Rapidus Chitose, Hokkaido"},
      {"code": "CN", "note": "SMIC Shanghai and Beijing 300 mm lines"}
    ],
    "chinaStatus": "SMIC ships an N+3 node measured at 113.4 MTr/mm2 using self-aligned quadruple and double patterning instead of EUV. Its minimum metal pitch is tighter than Intel 18A's, which is what a decade of state money buys without an EUV scanner.",
    "usStatus": "Intel is the only US-owned leading-edge front end. It brought gate-all-around and backside power to market together on 18A and is the first to run High-NA EUV in high-volume manufacturing.",
    "costSignal": "No foundry publishes leading-edge wafer prices. The public signal is TSMC's own density gain per node step, which falls from 1.2x at N2P to about 1.1x at A16",
    "substitution": {"years": "10+", "why": "A 2 nm-class flow is over a thousand process steps tuned against a specific tool set; SMIC has spent a decade and tens of billions to reach a node TSMC retired in 2019."}
  },
  "keyFacts": [
    {"fact": "TSMC N2 entered volume production in 4Q25, its first nanosheet gate-all-around node", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm"},
    {"fact": "TSMC N2P delivers 18% more speed at the same power, 36% less power at the same speed, 1.2x logic density and 1.15x chip density over N3E", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
    {"fact": "TSMC A16 with Super Power Rail backside power delivers 8-10% more speed, 15-20% less power and up to 1.10x chip density over N2P", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech"},
    {"fact": "TSMC A14 enters production in 2028 with up to 15% more speed, up to 30% less power and more than 20% higher logic density than N2", "source": "https://pr.tsmc.com/english/news/3228"},
    {"fact": "TSMC A13, a direct shrink of A14 giving 6% area savings, is planned for 2029, as is A12 with Super Power Rail", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "Intel 18A shipped gate-all-around and backside power together, giving an 11% routed area reduction and a 10x reduction in dynamic voltage droop", "source": "https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future"},
    {"fact": "SMIC N+3 measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, for 113.4 MTr/mm2, against 107.7 for TSMC N6", "source": "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"},
    {"fact": "China's third National Integrated Circuit Fund raised 344 billion yuan, about $47 billion, in May 2024", "source": "https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions"},
    {"fact": "China has announced $43 billion for domestic EUV development; CSIS judges working EUV systems still out of reach", "source": "https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography"}
  ],
  "figures": [
    {
      "id": "node-roadmap",
      "type": "timeline",
      "title": "TSMC logic roadmap beyond N2, from TSMC's own announcements",
      "unit": "",
      "data": [
        ["2028-01-01", "N2U, 3-4% faster or 8-10% lower power than N2P"],
        ["2028-01-01", "A14, up to 15% faster and more than 20% denser than N2"],
        ["2029-01-01", "A13, a direct shrink of A14 for 6% area savings"],
        ["2029-01-01", "A12, A14 platform with Super Power Rail backside power"]
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

A Blackwell GPU is 208 billion switches on two reticle-limited dies ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Each has to turn on hard, turn off completely, and keep doing it for years. Making them is the front end of line; wiring them is the back end.

## How it works

A transistor is a valve on a pipe. Current runs along a silicon channel, and a voltage on the gate above it opens or shuts the flow. Make the channel short enough and the valve stops sealing: current leaks through even when the gate says off, so a chip burns power doing nothing. The fix is to wrap the gate around all four sides of the channel, which takes about a thousand process steps in exact order. Three companies can run that sequence, which is why a regulator can name them.

That leak is short-channel leakage. It has three fixes:

- **Better insulator.** Electrically thicker without being physically thicker: Intel's hafnium high-k dielectric at 45 nm in 2007 ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Wrap gate metal around more sides of the channel, as fins and nanosheets do.
- **Thinner channel.** Thin it so the drain's field has nowhere to hide.

## Variants and trade-offs

### Planar and FinFET

A planar transistor puts the gate on one side of a flat channel and loses control as the channel shortens. The fin stands it on edge for three-sided control, but width then comes in whole fins: nobody gets 1.5 fins of drive.

### Gate-all-around nanosheets

A nanosheet lays the channel back down, stacks two to four thin sheets and threads gate metal around each one. Width is continuous again, which TSMC sells as NanoFlex.

N2 entered volume production in the fourth quarter of 2025, TSMC's first nanosheet node ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). TSMC rates the follow-on N2P at 18 percent more speed at the same power, 36 percent less power at the same speed, and 1.2 times the logic density of N3E ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). Intel's RibbonFET shipped on 18A, and 18A-P adds another 9 percent performance at the same power ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).

Read those numbers as marketing until someone measures the silicon. Each foundry picks its own baseline, and none publishes a density figure you can set against a rival's.

{{figure:density-by-node}}

### Backside power delivery

Power and signal normally share one copper stack, where wide power rails crowd out routing. Backside power builds a separate network on the wafer's thinned back.

Intel shipped it first as PowerVia: on 18A, an 11 percent cut in routed area and a tenfold cut in dynamic voltage droop ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). TSMC's Super Power Rail lands the network on the source and drain rather than a buried rail, which is harder to build and worth more: against N2P, A16 gives 8 to 10 percent more speed, 15 to 20 percent less power and up to 1.10 times the chip density ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). SemiAnalysis puts the generic gain at 15 to 20 percent on power for high-performance designs ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)).

{{figure:node-roadmap}}

### CFET and what comes after

imec expects complementary FETs to stack the n-type and p-type devices, which sit side by side today, and roughly halve a CMOS pair's area beyond the 1 nm nodes ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)).

## The back end of line

Wiring is now as hard as the transistor. Copper needs a barrier, a liner and a cap to stop it diffusing into the dielectric, and those layers eat a large share of the line once the critical metal pitches fall below 20 nm ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)). Two metals are taking the narrow levels:

- **Ruthenium** runs without a barrier, which is why imec builds its semi-damascene scheme around it and has demonstrated ruthenium lines at a 16 nm pitch ([source](https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene)).
- **Molybdenum** conducts worse in bulk, 5.3 against copper's 1.68 microhm-cm, but in thin films beats tungsten by up to 30 percent with no barrier, moving it into contacts ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)).

## Who makes it

Three companies build gate-all-around nodes with EUV: TSMC, Intel and Samsung. SMIC builds 7 and 5 nm-class nodes without it. State-backed Rapidus targets 2 nm mass production in 2027 on 267.6 billion yen raised in February 2026 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

Node names mean nothing physical. SMIC's N+3, sold as 5 nm-class, has a 32.5 nm minimum metal pitch, tighter than Intel 18A's 36 nm, and yields 113.4 MTr/mm2 against 107.7 for TSMC's N6 ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

AI accelerators sit a node behind: a reticle-limited die needs a mature process to yield. Blackwell uses a custom TSMC 4NP ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)).

SRAM is the scaling failure that hurts AI chips most. TSMC claims 22 percent more SRAM density from N3E to N2, but the gain comes from the periphery, not the bit cell ([source](https://newsletter.semianalysis.com/p/clash-of-the-foundries)). Logic shrank; cache did not, which is much of why accelerators push memory off-die. See Memory and HBM.

## The chokepoint

No single machine makes the front end a chokepoint. The scarce thing is the recipe: which steps, in which order, on which tools.

China shows what that recipe costs. It has the money. The third National Integrated Circuit Fund raised 344 billion yuan, about $47 billion, in May 2024 ([source](https://asia.nikkei.com/spotlight/supply-chain/china-launches-47bn-chip-fund-to-counter-u.s.-restrictions)). What it lacks is tools. A Shanghai state firm began building domestic immersion scanners in 2026, at single-digit annual volumes ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)), enough to keep SMIC's DUV multipatterning lines running and nowhere near enough to replace ASML. EUV is further off again: China has announced $43 billion for domestic development, and CSIS still reads working systems as out of reach ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

See Lithography and Geopolitics.

## Key evaluation criteria

- **Electrostatic control** — how far the gate wraps the channel. Sets off-state leakage and the minimum supply voltage.
- **Density** — transistors per square millimetre, comparable only within one library type and one foundry's own baseline.
- **Interconnect resistance** — below a 20 nm metal pitch the wire, not the transistor, sets the delay ([source](https://www.imec-int.com/en/articles/semi-damascene-metallization-inflection-point-back-end-line-processing)).
- **Power delivery** — IR drop across the die. Backside power buys back area and cuts droop tenfold ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).
- **SRAM scaling** — the bit cell has stopped shrinking, which sets how much cache an accelerator can afford.
- **Cost per transistor** — no foundry publishes wafer prices, so read the shrinking density gain per node as the proxy. We think this is the first era where cost per transistor rises.

## Takeaways

Every gain since the FinFET era has been bought with process steps and new materials, not geometry. TSMC's own numbers show the density gain per node step falling from 1.2 times at N2P to about 1.1 at A16 ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech)). Three companies can run a 2 nm-class flow, and only TSMC runs it at scale for merchant customers. SRAM has stopped shrinking, which is why accelerators keep their memory off the logic die. China can reach 5 nm-class geometry without EUV, and CSIS still reads working EUV systems as out of reach, which is the gap the export controls defend ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).
