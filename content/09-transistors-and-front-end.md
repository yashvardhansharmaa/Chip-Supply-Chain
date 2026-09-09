---json
{
  "id": "transistors-and-front-end",
  "number": 9,
  "title": "Transistors and the Front End",
  "oneLiner": "Three companies can build a 2 nm-class switch. Geometry stopped scaling for free about a decade ago, and everything since has been bought with process steps.",
  "plain": "A transistor is a valve on a pipe. Current runs from one end of a silicon channel to the other, and a voltage on the gate above it opens or shuts the flow. Make the channel short enough and the valve stops sealing: the far end pulls current through even when the gate says off, so a chip burns power doing nothing. The fix has been to wrap the gate around all four sides of the channel, a change that takes roughly a thousand process steps in exact order. Three companies can run that sequence, which is why a regulator can name them.",
  "specimen": "gaa-transistor",
  "specimenCaption": "Right: a gate-all-around nanosheet transistor. Three stacked silicon sheets run source to drain, the gate metal wraps all four sides of each sheet, inner spacers isolate the gate from the source and drain epitaxy, and the contacts land on top.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "N2 in volume since 4Q25; 77% of wafer revenue from 7 nm and below in 2Q26"},
      {"name": "Intel", "country": "US", "share": "18A in high-volume manufacturing; 18A-P in risk production"},
      {"name": "Samsung Foundry", "country": "KR", "share": "SF2 family; SF2Z with backside power slated for 2027"},
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
    "chinaStatus": "SMIC ships an N+3 node measured at 113.4 MTr/mm2 using self-aligned quadruple and double patterning instead of EUV. Cost per wafer runs 40 to 50 percent above TSMC's EUV equivalent and yields are far below.",
    "usStatus": "Intel is the only US-owned leading-edge front end. It brought gate-all-around and backside power to market together on 18A and is the first to run High-NA EUV in high-volume manufacturing.",
    "costSignal": "About $30,000 per N2 wafer against roughly $20,000 to $27,000 at N3, the first node transition where cost per transistor rises",
    "substitution": {"years": "10+", "why": "A 2 nm-class flow is over a thousand process steps tuned against a specific tool set; SMIC has spent a decade and tens of billions to reach a node TSMC retired in 2019."}
  },
  "keyFacts": [
    {"fact": "TSMC N2 entered volume production in 4Q25, its first nanosheet gate-all-around node", "source": "https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm"},
    {"fact": "N2 gives 10-15% more speed at the same power or 25-30% less power at the same speed versus N3E, with about 15% higher density on mixed designs", "source": "https://semiwiki.com/forum/threads/tsmc-quietly-begins-volume-production-of-2nm-class-chips.24283/"},
    {"fact": "TSMC A14 is planned for production in 2028 with up to 15% more speed, up to 30% less power and more than 20% higher logic density than N2", "source": "https://pr.tsmc.com/english/news/3228"},
    {"fact": "TSMC A16 with Super Power Rail backside power delivers 8-10% more speed, 15-20% less power and 8-10% more density than N2P", "source": "https://semiwiki.com/semiconductor-manufacturers/tsmc/370949-tsmc-a16-backside-power-at-vlsi-2026/"},
    {"fact": "Intel 18A shipped gate-all-around and backside power together, giving an 11% routed area reduction and a 10x reduction in dynamic voltage droop", "source": "https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future"},
    {"fact": "SRAM bit cell area was flat at 0.021 um2 from N5 through N3E and falls to 0.0175 um2 at N2", "source": "https://semiwiki.com/forum/threads/sram-scaling-isnt-dead-after-all-%E2%80%94-tsmcs-2nm-process-tech-claims-major-improvements.21414/"},
    {"fact": "Reaching 7 nm with DUV requires about 34 lithography steps against nine with EUV, and SMIC's cost per wafer runs 40-50% above TSMC's", "source": "https://www.eetimes.com/china-invests-billions-to-close-critical-chokepoints/"},
    {"fact": "SMIC N+3 measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, for 113.4 MTr/mm2", "source": "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"},
    {"fact": "China's EUV prototype generates EUV light but has not made a working chip; Beijing targets functional chips in 2028, with 2030 seen as more realistic", "source": "https://www.trendforce.com/news/2025/12/18/news-china-reportedly-builds-euv-prototype-using-older-asml-components-eyes-2028-chipmaking/"}
  ],
  "figures": [
    {
      "id": "node-roadmap",
      "type": "timeline",
      "title": "TSMC logic roadmap beyond N2, as presented April 2026",
      "unit": "",
      "data": [
        ["2027-01-01", "A16 volume production, Super Power Rail backside power"],
        ["2028-01-01", "N2U, 3-4% faster or 8-10% lower power than N2P"],
        ["2028-01-01", "A14, second-generation nanosheet"],
        ["2029-01-01", "A13, a 3% shrink of A14 for about 6% more density"],
        ["2029-01-01", "A12, full node with NanoFlex Pro, no High-NA EUV"]
      ],
      "source": {"label": "TrendForce on TSMC's 2026 North America Technology Symposium", "url": "https://www.trendforce.com/news/2026/04/23/news-tsmc-unveils-latest-roadmap-a12-a13-set-for-2029-without-high-na-euv-a16-volume-production-delayed-to-2027/"}
    },
    {
      "id": "density-by-node",
      "type": "bars",
      "title": "Transistor density, high-density standard cells, TechInsights estimates from IEDM disclosures",
      "unit": "MTr/mm2",
      "data": [["Samsung SF2", 231], ["Intel 18A", 238], ["TSMC N2", 313]],
      "source": {"label": "TechInsights estimates, reported by Tom's Hardware; no foundry publishes comparable figures", "url": "https://www.tomshardware.com/tech-industry/intels-18a-and-tsmcs-n2-process-nodes-compared-intel-is-faster-but-tsmc-is-denser"}
    },
    {
      "id": "sram-bitcell",
      "type": "bars",
      "title": "TSMC high-density SRAM bit cell area by node",
      "unit": "um2 (smaller is better)",
      "data": [["N5", 0.021], ["N3", 0.021], ["N3E", 0.021], ["N2", 0.0175]],
      "source": {"label": "TSMC IEDM disclosures, summarised on SemiWiki", "url": "https://semiwiki.com/forum/threads/sram-scaling-isnt-dead-after-all-%E2%80%94-tsmcs-2nm-process-tech-claims-major-improvements.21414/"}
    }
  ]
}
---
# Transistors and the Front End

A Blackwell GPU is 208 billion switches on two reticle-limited dies ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Every one has to turn on hard, turn off completely, and keep doing it for years. Making the switches is the front end of line. Wiring them is the back end.

## How it works

A transistor is a valve on a pipe. Current runs from one end of a silicon channel to the other, and a voltage on the gate above it opens or shuts the flow. Make the channel short enough and the valve stops sealing: the far end pulls current through even when the gate says off, so a chip burns power doing nothing. The fix has been to wrap the gate around all four sides of the channel, a change that takes roughly a thousand process steps in exact order. Three companies can run that sequence, which is why a regulator can name them.

The gate has to win an argument with the drain. As the channel shortens, the drain's field reaches in and switches the transistor on when it should be off. That is short-channel leakage, and there are three fixes:

- **Better insulator.** Make the gate insulator electrically thicker without making it thicker, as Intel first did at 45 nm in 2007 with a hafnium high-k dielectric ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Wrap gate metal around more sides of the channel, as fins and then nanosheets do.
- **Thinner channel.** Thin the channel so the drain's field has nowhere to hide.

## Variants and trade-offs

### Planar and FinFET

A planar transistor lays the channel flat with the gate on one side, and loses control as the channel shortens. The fin stands it on edge so the gate wraps three sides. Width then comes in whole fins: a designer who wants 1.5 fins of drive cannot have it.

### Gate-all-around nanosheets

A nanosheet lays the channel back down, stacks two to four thin sheets and threads gate metal around each. The gate now surrounds the channel, and width is continuous again. TSMC sells that as NanoFlex.

N2 entered volume production in the fourth quarter of 2025, TSMC's first nanosheet node ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). Against N3E it buys 10 to 15 percent more speed at the same power, 25 to 30 percent less power at the same speed, and about 15 percent more density ([source](https://semiwiki.com/forum/threads/tsmc-quietly-begins-volume-production-of-2nm-class-chips.24283/)). Intel's version, RibbonFET, shipped on 18A, and 18A-P adds another 9 percent performance at the same power ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).

No foundry publishes a comparable density figure, so the cross-foundry numbers are estimates. TechInsights puts N2's high-density cells at 313 million transistors per square millimetre, against 238 for 18A and 231 for Samsung SF2 ([source](https://www.tomshardware.com/tech-industry/intels-18a-and-tsmcs-n2-process-nodes-compared-intel-is-faster-but-tsmc-is-denser)).

{{figure:density-by-node}}

### Backside power delivery

Power and signal normally share one stack of copper, and the wide power rails crowd out signal routing. Backside power flips the wafer, thins it, and builds a separate power network underneath.

Intel shipped this first as PowerVia, and on 18A reports an 11 percent cut in routed area and a tenfold cut in dynamic voltage droop ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)). TSMC's Super Power Rail lands the network on the source and drain rather than a buried rail: harder to build, and worth more. Against N2P, A16 delivers 8 to 10 percent more speed, 15 to 20 percent less power and 8 to 10 percent more density ([source](https://semiwiki.com/semiconductor-manufacturers/tsmc/370949-tsmc-a16-backside-power-at-vlsi-2026/)).

{{figure:node-roadmap}}

### CFET and what comes after

Nanosheets still put the n-type and p-type devices side by side. imec expects complementary FETs to stack them and roughly halve a CMOS pair's area beyond the 1 nm nodes ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)).

## The back end of line

Wiring is now as hard as the transistor. Copper needs a tantalum nitride barrier that eats most of a narrow trench, and below about 40 nm of width scattering drives its resistivity far above the 1.7 microhm-cm bulk figure ([source](https://www.patsnap.com/resources/blog/articles/ruthenium-interconnects-at-sub-10nm-beol-nodes/)). Copper keeps the wide upper levels. Two metals are taking the narrow ones:

- **Ruthenium** needs no barrier and beats copper below roughly 10 to 17 nm of line width ([source](https://www.patsnap.com/resources/blog/articles/ruthenium-interconnects-at-sub-10nm-beol-nodes/)).
- **Molybdenum** is the worse bulk conductor, 5.3 against copper's 1.68 microhm-cm, but in thin films it beats tungsten by up to 30 percent and needs no barrier, which moves it into contacts ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)).

## Who makes it

Three companies build gate-all-around nodes with EUV: TSMC, Intel and Samsung. SMIC builds 7 and 5 nm-class nodes without it. Rapidus is a state-backed fourth, targeting 2 nm mass production in 2027 after raising 267.6 billion yen in February 2026 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

Node names mean nothing physical. SMIC's N+3, marketed as 5 nm-class, measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, tighter than the 36 nm on Intel's 18A, and yields 113.4 MTr/mm2 against 107.7 for TSMC's N6 ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

AI accelerators sit a node behind the leading edge, because a reticle-limited die needs a mature process to yield at all. Blackwell uses a custom TSMC 4NP process ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)) and Rubin moves to the 3 nm family ([source](https://www.isaiahresearch.com/Insight/Detail/107)).

SRAM is the scaling failure that matters most for AI chips. The high-density bit cell sat at 0.021 square micrometres from N5 through N3E, then fell to 0.0175 at N2 ([source](https://semiwiki.com/forum/threads/sram-scaling-isnt-dead-after-all-%E2%80%94-tsmcs-2nm-process-tech-claims-major-improvements.21414/)). Logic kept shrinking while cache did not, so cache eats a growing share of an expensive die. That is much of why accelerators push memory off-die. See Memory and HBM.

{{figure:sram-bitcell}}

Cost has turned. An N2 wafer runs around $30,000 against roughly $20,000 at N3, which EE Times argues makes this the first node transition where cost per transistor rises ([source](https://www.eetasia.com/tsmc-ends-era-of-cheap-transistors-with-5-10-price-hikes-for-advanced-nodes/)). TrendForce prices N3 higher, at $25,000 to $27,000, and puts the N2 rise at 10 to 20 percent ([source](https://www.trendforce.com/news/2025/10/08/news-tsmc-2nm-reportedly-up-10-20-far-below-rumored-50-3-7nm-to-rise-single-digit-in-2026/)).

## The chokepoint

The front end is not a single chokepoint the way EUV is. It is where every other chokepoint gets cashed in, and what is scarce is the recipe.

China shows what the recipe costs without EUV. Reaching 7 nm with DUV takes about 34 lithography steps where EUV needs nine, SMIC's wafer cost runs 40 to 50 percent above TSMC's, and its 7 nm yields sit below 50 percent with 5 nm projected at 30 to 40 against TSMC's 80 to 90 ([source](https://www.eetimes.com/china-invests-billions-to-close-critical-chokepoints/)). Money is not the binding constraint: the third National Integrated Circuit Fund is 344 billion yuan, about $47.5 billion ([source](https://www.eetimes.com/china-invests-billions-to-close-critical-chokepoints/)). Tools are:

- **Immersion DUV.** Yuliangsheng, a Shanghai state firm, began building domestic immersion scanners in 2026 at single-digit annual volumes ([source](https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/)). SMIC has tested one since September 2025; it prints 28 nm in a single exposure and reaches 7 nm-class only by multipatterning ([source](https://www.trendforce.com/news/2026/07/28/news-china-reportedly-starts-mass-producing-immersion-duv-tools-smic-hua-hong-cxmt-deliveries-expected-this-year/)).
- **EUV.** A prototype assembled from older ASML parts generates EUV light and has not yet made a working chip ([source](https://www.trendforce.com/news/2025/12/18/news-china-reportedly-builds-euv-prototype-using-older-asml-components-eyes-2028-chipmaking/)).
- **Timing.** Beijing wants chips off that prototype in 2028; 2030 is the realistic date ([source](https://www.trendforce.com/news/2025/12/18/news-china-reportedly-builds-euv-prototype-using-older-asml-components-eyes-2028-chipmaking/)). China has announced $43 billion for domestic EUV, and CSIS still reads the machines as out of reach ([source](https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography)).

See Lithography and Geopolitics.

## Key evaluation criteria

- **Electrostatic control** — how completely the gate surrounds the channel, which sets off-state leakage and the floor on supply voltage.
- **Density** — transistors per square millimetre, comparable only within one library type. High-density and high-performance cells answer differently for the same node.
- **Interconnect resistance** — below 10 to 17 nm of line width the wire, not the transistor, sets the delay ([source](https://www.patsnap.com/resources/blog/articles/ruthenium-interconnects-at-sub-10nm-beol-nodes/)).
- **Power delivery** — IR drop across the die. Backside power buys back routed area and cuts dynamic droop tenfold.
- **SRAM scaling** — flat since N5. Sets how much cache an accelerator can afford and how much work HBM has to do.
- **Cost per transistor** — rising at the leading edge for the first time, which changes every design decision downstream.

## Takeaways

Every gain since the FinFET era has been bought with steps and materials: high-k metal gates, nanosheets, ruthenium wires, a second power network on the back of the wafer. Three companies can run a 2 nm-class flow, and only TSMC does it at scale for merchant customers. SRAM's refusal to shrink is the quiet reason accelerators keep their memory outside the logic die. China proves you can reach 5 nm-class geometry without EUV, at roughly half the yield and half again the cost, which is a business only a state can fund ([source](https://www.eetimes.com/china-invests-billions-to-close-critical-chokepoints/)).
