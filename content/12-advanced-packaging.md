---json
{
  "id": "advanced-packaging",
  "number": 12,
  "title": "Advanced Packaging",
  "oneLiner": "Lithography stopped being the limit on chip size in 2022. What replaced it is how large an interposer TSMC can build, and through 2025 how many it could build a month.",
  "plain": "Packaging wires finished chips into one component and mounts them on a board the size of a playing card, built to the tolerances of a chip. A lithography machine can print only a rectangle about the size of a postage stamp in one shot, so a modern accelerator is cut into pieces and stitched back together on a shared slab of silicon, with its memory a few millimetres away. Slab, chips and board all expand at different rates when heated, so the package warps and the joints crack. Getting that right in volume is why TSMC packages nearly every AI accelerator, in Taiwan.",
  "specimen": "cowos-exploded",
  "specimenCaption": "Right: a CoWoS package pulled apart. A stiffener frame at the top, then two reticle-sized logic dies and eight HBM stacks, microbumps, the silicon interposer with its vertical vias and the wiring that stitches the dies together and fans out to the memory, then the larger solder bumps beneath it and the resin build-up substrate at the bottom.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "Effectively all CoWoS for leading AI accelerators"},
      {"name": "ASE Technology", "country": "TW", "share": "NT$645.4B revenue, 2025; the largest outsourced assembly and test firm"},
      {"name": "Amkor", "country": "US", "share": "$6.71B net sales, 2025; the largest American one"},
      {"name": "JCET", "country": "CN", "share": "RMB 35.96B revenue, 2024; the largest Chinese one"},
      {"name": "ASMPT", "country": "SG", "share": "$532.1M advanced packaging revenue, 2025; thermocompression bonders"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC AP fabs and the OSAT cluster; almost all 2.5D capacity for AI accelerators"},
      {"code": "US", "note": "Amkor Peoria, Arizona from 2028; two TSMC advanced packaging plants planned in Arizona"},
      {"code": "CN", "note": "JCET, Tongfu and HT-Tech, strong in conventional assembly and test, weak in 2.5D"},
      {"code": "NL", "note": "Besi hybrid and die bonders"},
      {"code": "JP", "note": "Disco grinders and dicers; TEL and Shibaura bonding tools"}
    ],
    "chinaStatus": "China's back end is far stronger than its front end. JCET alone billed RMB 35.96 billion in 2024, and Chinese suppliers gained share in packaging and test tools while gaining none in atomic layer deposition or lithography. Almost none of it is silicon-interposer 2.5D for AI accelerators.",
    "usStatus": "No domestic CoWoS at volume. Amkor is building a $7B packaging and test plant in Peoria with up to $407M of CHIPS funding, production from early 2028.",
    "costSignal": "No public wafer counts. TSMC guided investors to 60% compound annual growth in CoWoS capacity and adds more every year, but will not publish the absolute number. Epoch AI estimates Nvidia alone consumed 60.3% of the world's CoWoS capacity in 2025",
    "substitution": {"years": "3-5", "why": "The individual steps are not exotic. What is scarce is getting a 5.5-reticle interposer and its HBM stacks to come out working, and owning enough tools to do it at the volume Nvidia alone orders."}
  },
  "keyFacts": [
    {"fact": "A scanner's maximum exposure field is 26 mm by 33 mm, or 858 mm2", "source": "https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400c"},
    {"fact": "TSMC is now producing 5.5-reticle CoWoS, having certified it in 2025 and started volume production in 2026", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "CoWoS-S silicon interposers reach 3.3x reticle size, about 2,700 mm2; larger designs must use CoWoS-R or CoWoS-L", "source": "https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm"},
    {"fact": "TSMC told its 2024 symposium that CoWoS capacity would grow at a 60% CAGR over the following years, and C.C. Wei said in July 2024 that he could not reach supply and demand balance", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf"},
    {"fact": "In October 2025 Wei would still not give an absolute CoWoS number for 2026, and said Amkor's Arizona plant would open before TSMC's own two packaging fabs there", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf"},
    {"fact": "A 14-reticle CoWoS carrying about 10 large compute dies and 20 HBM stacks is slated for production in 2028, with more than 14 reticles in 2029 and a 40-reticle System-on-Wafer the same year", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "ASE Technology Holding billed NT$645.4 billion in 2025 with assembly and test revenue up 23%; Amkor billed $6.71 billion, up 6%", "source": "https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html"},
    {"fact": "JCET, China's largest OSAT, billed RMB 35.96 billion in 2024, up 21.2%", "source": "https://www.jcetglobal.com/en/site/news-detail?id=1952"},
    {"fact": "ASMPT advanced packaging revenue was $532.1M in 2025, up 30.2%, with TCB revenue up about 146%; it targets 35-40% of the TCB market", "source": "https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/"},
    {"fact": "Amkor broke ground in Peoria, Arizona in October 2025 on a $7B two-phase packaging and test campus, with up to $407M of CHIPS funding and production from early 2028", "source": "https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced"},
    {"fact": "TSMC's Arizona commitment reached $265 billion covering 10 fabs and 2 advanced packaging facilities", "source": "https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/"},
    {"fact": "Epoch AI estimates Nvidia consumed 60.3% of the world's CoWoS packaging capacity in 2025, with a 90% confidence interval of 56.5 to 64.3, and that Nvidia, Google, AMD and Amazon together took around 90% of it while using only about 12% of advanced logic die production", "source": "https://epoch.ai/data-insights/ai-chip-supply-chain-constraints"}
  ],
  "figures": [
    {
      "id": "cowos-reticles",
      "type": "bars",
      "title": "CoWoS interposer size on TSMC's roadmap",
      "unit": "reticles",
      "data": [["2024, CoWoS-L", 3.5], ["2026, in production", 5.5], ["In development", 9.5], ["2028", 14]],
      "source": {"label": "TSMC 2025 annual report and 2026 technology symposium", "url": "https://pr.tsmc.com/english/news/3302"}
    },
    {
      "id": "china-backend-tools",
      "type": "bars",
      "title": "China-based suppliers' share of back-end tool segments, 2024",
      "unit": "%",
      "data": [["Test, linear and discrete", 69], ["Burn-in test", 9], ["Advanced packaging tools", 7], ["SoC test", 5], ["Atomic layer deposition", 1]],
      "source": {"label": "CSET, Inside Beijing’s Chipmaking Offensive (ALD shown for contrast, under 1%)", "url": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"}
    },
    {
      "id": "cowos-buyers",
      "type": "stack",
      "title": "Who consumed the world's CoWoS capacity, 2025",
      "unit": "%",
      "data": [["Nvidia", 60.3], ["Google", 13.5], ["AMD", 8.4], ["Amazon", 7.4], ["Everyone else", 10.4]],
      "source": {"label": "Epoch AI, advanced packaging and HBM were the bottlenecks on AI chip production in 2025", "url": "https://epoch.ai/data-insights/ai-chip-supply-chain-constraints"}
    }
  ]
}
---
# Advanced Packaging

A lithography scanner prints a rectangle 26 mm by 33 mm, or 858 mm2, in one exposure ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400c)). Every AI accelerator worth buying is bigger than that. Packaging is how the industry got around that reticle limit, and through 2024 and 2025 it capped how many accelerators the world could build.

## How it works

Packaging wires finished chips into one component and mounts them on a board the size of a playing card, built to the tolerances of a chip. A lithography machine can print only a rectangle about the size of a postage stamp in one shot, so a modern accelerator is cut into pieces and stitched back together on a shared slab of silicon, with its memory a few millimetres away. Slab, chips and board all expand at different rates when heated, so the package warps and the joints crack. Getting that right in volume is why TSMC packages nearly every AI accelerator, in Taiwan.

High bandwidth memory gives a second reason to split the package: its 1,024-bit or 2,048-bit connection is too wide for a resin base board to carry, so the memory sits beside the logic on a shared silicon carrier, the interposer.

The name CoWoS says the order: chip onto wafer, then wafer onto substrate. TSMC makes a thin silicon wafer carrying wiring and vertical copper vias but no transistors, bonds logic dies and memory stacks face down onto it with microbumps 30 to 40 microns apart, then cuts the interposer out and attaches it to the resin substrate.

The individual steps are ordinary. But one cracked joint scraps a package holding eight qualified HBM stacks and two of the most expensive logic dies ever made.

## Variants and trade-offs

| Family | Carrier | Ceiling | Used for |
|---|---|---|---|
| CoWoS-S | Full silicon interposer | 3.3x reticle, about 2,700 mm2 | H100-class parts |
| CoWoS-R | Resin interposer with fine redistribution wiring | Above 3.3x reticle | Cost-sensitive, fewer HBM stacks |
| CoWoS-L | Redistribution wiring with local silicon bridges | 5.5x reticle in production, 9.5x in development | Blackwell, Rubin |

### 2.5D: silicon, RDL and bridges

TSMC has run CoWoS in volume since 2012 ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)). CoWoS-S wires most finely, but its interposer is one unbroken piece of silicon whose yield falls as the area grows, so CoWoS-L replaces the slab with layers of fine wiring and small silicon bridges only where the wiring is dense. Intel's EMIB buries the same bridge idea in the resin substrate, and is the one credible second source when CoWoS is tight.

Blackwell was the first high-volume design on CoWoS-L, and it went badly. The bridges carry the 10 TB/s link between the two compute dies, and they have to be placed to a tolerance that the package's warping fights ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)).

### 3D: SoIC, Foveros, X-Cube

TSMC's SoIC and Intel's Foveros bond dies face to face, copper pad to copper pad with no solder, which puts the connections far closer together than microbumps allow. TSMC put 3 nm SoIC into volume production in 2025 ([source](https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf)), with an A14-on-A14 version due in 2029 carrying 1.8 times as many connections between the dies as the 2 nm generation ([source](https://pr.tsmc.com/english/news/3302)). Heat decides the layout: the bottom die overheats and the top is hard to power, so 3D designs often put cache underneath rather than compute.

### The escape routes

Panel-level packaging swaps the round wafer for a rectangular panel and wastes far less area; see Test and assembly. JEDEC published SPHBM4 on 13 July 2026: HBM4 memory on a base chip carrying 512 data signals instead of 2,048, which spaces the connections widely enough to mount the stack on a standard resin substrate ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)) and would take the memory off the silicon interposer altogether.

## Capacity

TSMC does not publish a CoWoS wafer number, and the omission is deliberate. Its 2024 symposium told investors capacity would grow at a 60 percent compound rate, and on the July 2024 earnings call C.C. Wei said he could not reach supply and demand balance ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf)).

Fifteen months later he had still not given a number. In October 2025 Wei would say only that TSMC would add capacity again in 2026, would give the real figure the year after, and that front end and back end were both, in his word, tight ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)).

The split is public; the total is not. Epoch AI weighs each designer's component use against world supply and puts Nvidia at 60.3 percent of the world's CoWoS in 2025, with a 90 percent confidence interval of 56.5 to 64.3; Google took 13.5, AMD 8.4 and Amazon 7.4 ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). Those four absorbed around 90 percent of all CoWoS and all HBM by value while taking about 12 percent of the world's advanced logic wafers, which is why packaging ran out and logic did not.

{{figure:cowos-buyers}}

The ordering has since flipped. SemiAnalysis reported in March 2026 that front-end wafer capacity is now the dominant bottleneck and that CoWoS constraints are easing, partly because TSMC has no reason to build interposer lines its N3 output cannot feed ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)). The queue has eased and the concentration has not.

## Who makes it

{{figure:cowos-reticles}}

The word packaging covers two industries. TSMC does the 2.5D work, chips side by side on a shared carrier, in its own back-end fabs; everything else goes to outsourced assembly and test firms. ASE Technology Holding, the largest, billed NT$645.4 billion in 2025, with its assembly and test business up 23 percent, and Amkor, the largest American one, billed $6.71 billion ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html)) ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000007/amkr123125erex-991.htm)).

The tools are a narrower chokepoint than the assembly houses.

- **Thermocompression bonding.** Pressing dies together under heat and force, one at a time. ASMPT's advanced packaging revenue reached $532.1 million in 2025, that line up about 146 percent; it targets 35 to 40 percent of a market it puts at $1.6 billion by 2028 ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Hybrid bonding.** Solder disappears and copper pads meet directly. Applied Materials built its Kinex bonder with Besi, which makes the placement head ([source](https://www.appliedmaterials.com/eu/en/product-library/kinex-integrated-die-to-wafer-hybrid-bonding-system.html)).
- **Grinding and dicing.** Disco dominates the steps that thin wafers and cut packages apart; see Test and assembly ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)).

America is building, slowly. TSMC's Arizona commitment reached $265 billion in July 2026 and covers two advanced packaging plants alongside 10 fabs ([source](https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/)). Amkor broke ground in Peoria in October 2025 on a $7 billion campus, backed by up to $407 million of CHIPS money, producing from early 2028 ([source](https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced)), and Wei confirms it will open before TSMC's own two packaging fabs ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)).

## The chokepoint

{{figure:china-backend-tools}}

JCET, the largest Chinese assembler, billed RMB 35.96 billion in 2024, up 21 percent ([source](https://www.jcetglobal.com/en/site/news-detail?id=1952)), and Chinese toolmakers took real share in packaging and test equipment over the same years they took none in atomic layer deposition ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Packaging tools are less export-controlled than lithography, and building large chips out of small chiplets cut on SMIC silicon and assembled at home is the most credible route around the restrictions Huawei faces. China still has no silicon-interposer 2.5D at volume with qualified HBM beside it.

Each generation on TSMC's roadmap asks more of the interposer.

- **2028.** A 14-reticle interposer carrying about ten large compute dies and 20 HBM stacks, roughly 12,000 mm2 of silicon, about the area of a compact disc ([source](https://pr.tsmc.com/english/news/3302)).
- **2029.** More than 14 reticles, and a 40-reticle System-on-Wafer beside it ([source](https://pr.tsmc.com/english/news/3302)).

## Key evaluation criteria

- **Interposer area** — the ceiling on how much logic and memory fit, now 5.5x reticle on CoWoS-L ([source](https://pr.tsmc.com/english/news/3302)).
- **Package yield** — nobody publishes it, and it decides whether a generation ships on time.
- **Warpage control** — the expansion mismatch between die, bridge, interposer and substrate that broke early CoWoS-L and gets harder as packages grow ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)).
- **HBM stacks supported** — about 20 on the 14-reticle package due in 2028 ([source](https://pr.tsmc.com/english/news/3302)).
- **Bonder throughput** — thermocompression and hybrid bonding place one die at a time and are slow, and three or four firms hold the tools ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Substrate size** — a 14-reticle interposer needs a resin substrate that will not warp under it, which pushes ABF build-up film to its limits; see Substrates and PCBs.

## Takeaways

Advanced packaging capped AI chip output through 2024 and 2025: the physics was solved and the lines were not built. On Epoch AI's estimate Nvidia alone took 60.3 percent of the world's CoWoS in 2025, and four American designers took around 90 percent ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). By March 2026 the binding constraint had moved back to front-end wafers ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)). The concentration is unchanged: China can package chips but not the 2.5D structures AI accelerators need, and the American alternatives do not start until 2028.
