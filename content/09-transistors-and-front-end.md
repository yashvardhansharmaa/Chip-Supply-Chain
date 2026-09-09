---json
{
  "id": "transistors-and-front-end",
  "number": 9,
  "title": "Transistors and the Front End",
  "oneLiner": "Three companies can build a 2 nm-class switch. Geometry stopped scaling for free about a decade ago, and everything since has been bought with process steps.",
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
    {"fact": "SMIC N+3 measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, for 113.4 MTr/mm2", "source": "https://newsletter.semianalysis.com/p/steel-smic-n3-teardown"}
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
      "title": "Transistor density, high-density standard cells, TechInsights estimates 2025",
      "unit": "MTr/mm2",
      "data": [["Samsung SF3", 231], ["Intel 18A", 238], ["TSMC N2", 313]],
      "source": {"label": "TechInsights estimates via TechSpot", "url": "https://www.techspot.com/news/106782-intel-18a-found-faster-but-tsmc-n2-denser.html"}
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

A Blackwell GPU is 208 billion switches spread across two reticle-limited dies ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)). Every one of them has to turn on hard, turn off completely, and survive five years of being switched a billion times a second. Building those switches is the front end of line. Wiring them together is the back end. Neither has scaled for free since roughly 2014, and everything bought since has been paid for in process steps.

## How it works

A transistor is a valve. Current wants to flow from source to drain through a channel of silicon; a voltage on the gate either opens that path or closes it. The gate does not touch the channel, it sits above a thin insulator and controls the channel through the electric field it projects.

The whole difficulty of scaling is that the gate has to win an argument with the drain. As the channel gets shorter, the drain's own field starts reaching into the channel and turning the transistor on when it should be off. That is short-channel leakage, and it is why a chip can burn watts doing nothing.

There are three ways to fight it. Make the insulator electrically thicker without making it physically thicker, which is what high-k dielectrics do. Wrap more gate around more of the channel. Or make the channel itself thinner so there is nowhere for the drain's field to hide.

The industry did the first in 2007, when Intel replaced silicon dioxide with a hafnium-based high-k dielectric and a metal gate at 45 nm, cutting gate leakage by more than ten times and source-drain leakage by more than five times while raising drive current over 20 percent ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)). It has been doing the second and third ever since. A fourth trick raises speed rather than cutting leakage: growing silicon germanium in the source and drain strains the channel lattice and raises carrier mobility.

The front end builds all of this: wells, isolation, the fin or nanosheet stack, the gate stack, the source and drain epitaxy, and the contacts. The back end builds the wiring above it. A 2 nm-class flow runs over a thousand discrete process steps and roughly 95 mask layers, and a wafer spends about sixteen weeks in the fab ([source](https://semiconductorx.com/front-end-fabrication-overview.html)).

## Variants and trade-offs

### Planar and FinFET

Planar transistors put the channel flat on the wafer with the gate on one side. They ran out of electrostatic control around the 28 nm generation. The fin stands the channel on edge so the gate wraps three sides of it. Channel width then comes in quanta: one fin, two fins, three fins. A designer who wants 1.5 fins of drive cannot have it.

### Gate-all-around nanosheets

A nanosheet lays the channel back down but stacks two to four thin sheets on top of each other and threads gate metal around each one. Control improves because the gate surrounds the channel, and width becomes continuous again because the sheets can be drawn wider. TSMC sells that flexibility as NanoFlex.

TSMC's N2 started volume production in the fourth quarter of 2025, its first nanosheet node ([source](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm)). Against N3E it offers 10 to 15 percent more speed at the same power, 25 to 30 percent less power at the same speed, and about 15 percent more density on a mixed design, up to 20 percent for logic only ([source](https://semiwiki.com/forum/threads/tsmc-quietly-begins-volume-production-of-2nm-class-chips.24283/)). Intel brought its own gate-all-around device, RibbonFET, to market on 18A, and 18A-P adds a further 9 percent performance at the same power or 18 percent lower power at the same performance ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).

{{figure:density-by-node}}

### Backside power delivery

On a conventional chip, power and signal share the same stack of copper above the transistors. Power rails are wide, so they crowd out signal routing, and the current travels down through a dozen metal levels, losing voltage on the way.

Backside power flips the wafer, thins it, and builds a separate power network underneath, connected up through nano-scale through-silicon vias. Intel shipped this first as PowerVia. On its Blue Sky Creek test vehicle it demonstrated over 90 percent standard-cell utilisation, a frequency benefit of a few percent, and more than a 30 percent improvement in platform voltage droop ([source](https://www.insidedeeptech.com/backside-power-delivery-powervia-full-guide/)). In production on 18A, Intel reports an 11 percent routed area reduction and a tenfold reduction in dynamic voltage droop ([source](https://www.intc.com/news-events/press-releases/detail/1772/intel-foundry-details-process-milestones-and-future)).

TSMC's version, Super Power Rail, lands the backside network directly on the transistor source and drain rather than on a buried rail. It is harder to build and gives more back: against N2P, A16 delivers 8 to 10 percent more speed at the same power, 15 to 20 percent less power at the same speed, and 8 to 10 percent more chip density ([source](https://semiwiki.com/semiconductor-manufacturers/tsmc/370949-tsmc-a16-backside-power-at-vlsi-2026/)). TSMC's April 2026 roadmap moved A16 volume production from the second half of 2026 into 2027 ([source](https://www.trendforce.com/news/2026/04/23/news-tsmc-unveils-latest-roadmap-a12-a13-set-for-2029-without-high-na-euv-a16-volume-production-delayed-to-2027/)). Samsung's SF2Z adds backside power for mass production in 2027, claiming up to a 17 percent die area reduction and 9.2 percent shorter wiring ([source](https://www.mckinsey-electronics.com/post/the-best-kept-secret-in-semiconductor-innovation-backside-power-delivery)).

{{figure:node-roadmap}}

### CFET and what comes after

The nanosheet still puts the n-type and p-type devices side by side. A complementary FET stacks one directly on the other, roughly halving the area of a CMOS pair. imec places CFET beyond the 1 nm nodes and describes two routes, neither comfortable: a monolithic flow with very high aspect ratio vertical structures that make fin, gate, spacer and contact patterning severe, or a sequential flow that must hold the top tier below about 500 degrees Celsius while a good gate stack wants roughly 900 ([source](https://www.imec-int.com/en/articles/imec-puts-complementary-fet-cfet-logic-technology-roadmap)).

## The back end of line

Wiring is now as hard as the transistor. Copper needs a tantalum nitride barrier and a liner to stop it diffusing into the dielectric, and at narrow pitches that barrier eats most of the trench. Worse, copper's electron mean free path is about 40 nm; below that width, surface and grain-boundary scattering dominate and effective resistivity climbs far above the 1.7 microhm-cm bulk figure ([source](https://www.patsnap.com/resources/blog/articles/ruthenium-interconnects-at-sub-10nm-beol-nodes/)).

Two metals are taking over the narrowest lines. Ruthenium needs no barrier and beats copper at line widths of roughly 10 to 17 nm and below, with the ruthenium liner deposited at about 5 angstroms and a cobalt cap under 20 angstroms ([source](https://www.patsnap.com/resources/blog/articles/ruthenium-interconnects-at-sub-10nm-beol-nodes/)). Molybdenum has a bulk resistivity of about 5.3 microhm-cm against copper's 1.68, but in thin films it runs up to 30 percent below tungsten and, like ruthenium, needs no barrier, which is why it is moving into contacts and local interconnect ([source](https://blog.entegris.com/molybdenums-role-in-ultra-fast-computing-the-metal-behind-the-speed)). Copper stays on the wide upper levels where its bulk conductivity still wins.

The other half of the problem is capacitance between adjacent wires. The answer is low-k dielectrics, porous carbon-doped oxides that trade mechanical strength for a lower dielectric constant, and at the tightest pitches air gaps, where the process deliberately leaves a void between lines. Both are fragile, and both make packaging and dicing harder.

## Who makes it

Four organisations run a leading-edge front end, and one of them is not competitive at the leading edge. TSMC, Intel and Samsung build gate-all-around nodes with EUV. SMIC builds 7 and 5 nm-class nodes without it. Rapidus is a fifth, state-backed and not yet in production, targeting 2 nm mass production in 2027 after raising 267.6 billion yen from the Japanese government and 32 companies in February 2026 ([source](https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/)).

The node names mean nothing physical. SMIC's N+3, marketed as 5 nm-class, measures a 57 nm contacted gate pitch and a 32.5 nm minimum metal pitch, which is actually tighter than the 36 nm minimum metal pitch on Intel's 18A in Panther Lake, and yields 113.4 MTr/mm2 against 107.7 for TSMC's N6 ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)). Density comparisons also depend on which library you count: the same analysis puts Intel 18A's high-performance library near 177.7 MTr/mm2, while TechInsights' high-density estimates put 18A at 238 and TSMC N2 at 313 ([source](https://www.techspot.com/news/106782-intel-18a-found-faster-but-tsmc-n2-denser.html)).

AI accelerators sit one node behind the leading edge, because a reticle-limited die needs a mature process to yield at all. Blackwell is built on a custom TSMC 4NP process ([source](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/)), and Rubin moves to TSMC's 3 nm family ([source](https://www.isaiahresearch.com/Insight/Detail/107)). TSMC is lifting N3 capacity from about 150,000 wafers per month in the first half of 2026 to 180,000 by early in the fourth quarter, with Apple and Nvidia expected to be the first A16 customers ([source](https://www.trendforce.com/news/2026/09/07/news-tsmcs-3nm-reportedly-to-overtake-5nm-as-top-revenue-node-in-2h26-output-value-could-top-nt400b/)).

The most consequential failure of scaling for AI chips is SRAM. The high-density bit cell sat at 0.021 square micrometres from N5 through N3 and N3E, then fell to 0.0175 at N2 ([source](https://semiwiki.com/forum/threads/sram-scaling-isnt-dead-after-all-%E2%80%94-tsmcs-2nm-process-tech-claims-major-improvements.21414/)). Logic kept shrinking while cache did not, so cache eats a growing share of an expensive die. That is a large part of why accelerators push capacity off-die into HBM and split memory-heavy blocks onto separate chiplets. See Memory and HBM and Advanced packaging.

{{figure:sram-bitcell}}

Cost has turned. An N2 wafer runs around $30,000 against roughly $20,000 at N3, which EE Times argues makes this the first major node transition where cost per transistor rises, with 5 to 10 percent price increases on sub-5 nm nodes in 2026 ([source](https://www.eetasia.com/tsmc-ends-era-of-cheap-transistors-with-5-10-price-hikes-for-advanced-nodes/)). TrendForce puts the N2 increase lower, at 10 to 20 percent over N3 wafers it prices at $25,000 to $27,000 ([source](https://www.trendforce.com/news/2025/10/08/news-tsmc-2nm-reportedly-up-10-20-far-below-rumored-50-3-7nm-to-rise-single-digit-in-2026/)).

## The chokepoint

The front end is not a single chokepoint the way EUV is. It is the place where every other chokepoint gets cashed in. What is genuinely scarce is the recipe: a thousand-step flow tuned against one specific set of tools, with defect budgets measured in particles per wafer.

China's position shows what the recipe costs without EUV. Reaching 7 nm with DUV takes about 34 lithography steps where EUV needs nine, SMIC's cost per wafer runs 40 to 50 percent above TSMC's, and its 7 nm yields sit below 50 percent with 5 nm projected at 30 to 40 percent against TSMC's 80 to 90 ([source](https://www.eetimes.com/china-invests-billions-to-close-critical-chokepoints/)). SMIC gets there with self-aligned quadruple patterning on M0 and double patterning on M1 and M2, and the same analysis notes that further scaling without EUV leaves few levers ([source](https://newsletter.semianalysis.com/p/steel-smic-n3-teardown)).

Money is not the binding constraint. The third National Integrated Circuit Fund is 344 billion yuan, about $47.5 billion ([source](https://www.eetimes.com/china-invests-billions-to-close-critical-chokepoints/)). Tools are. As of mid-2026 the verified state of Chinese lithography is that SMIC is testing a domestic 28 nm-class immersion DUV prototype and that a state-backed EUV prototype has produced some EUV light but is far from producing working chips; one careful forecast anchors domestic 7 nm-capable immersion DUV in the mid-2030s and 5 nm-capable EUV in the late 2030s ([source](https://blog.aifutures.org/p/a-forecast-of-chinese-duv-and-euv)). See Lithography and Geopolitics.

## Key evaluation criteria

- **Electrostatic control** — how completely the gate surrounds the channel, which sets off-state leakage and how low the supply voltage can go. Nanosheets beat fins; CFET stacks them.
- **Density** — transistors per square millimetre, but only comparable within the same library type. High-density and high-performance cells differ by a factor approaching two.
- **Interconnect resistance** — below about 15 nm line width the wire, not the transistor, sets the delay. Barrier-free ruthenium and molybdenum are the fix.
- **Power delivery** — IR drop across the die. Backside power buys roughly 10 percent area and an order of magnitude in dynamic droop.
- **SRAM scaling** — flat since N5. Determines how much cache an accelerator can afford and how much work HBM has to do.
- **Cost per transistor** — now rising at the leading edge for the first time, which changes the economics of every design decision downstream.
- **Cycle time and yield** — sixteen weeks and a thousand steps means a defect found late costs a quarter of production.

## Takeaways

Geometry stopped being free around the FinFET era, and every gain since has been bought by adding steps, materials and complexity: high-k metal gates, strain, fins, nanosheets, ruthenium wires, and now a second power network on the back of the wafer. Three companies can run a 2 nm-class flow and only TSMC does it at scale for merchant customers. SRAM's refusal to shrink is the quiet reason AI accelerators look the way they do, with most of their memory outside the logic die. And China's front end is a working demonstration that you can reach 7 or 5 nm-class geometry without EUV, at roughly half the yield and half again the cost, which is a business only a state can fund.
