---json
{
  "id": "advanced-packaging",
  "number": 11,
  "title": "Advanced Packaging",
  "oneLiner": "Lithography no longer sets the limit on the size of an AI accelerator. The limit now is how large an interposer, the silicon base plate under the chips, TSMC can build, and through 2025 how many it could build a month.",
  "plain": "Packaging joins finished chips into one component and mounts them on a base, called a substrate, wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot, and a modern accelerator needs more circuit than fits in one, so it cannot be one chip. It is made as several pieces, set side by side on a shared slab of silicon and wired together through it, with the stacked memory a few millimeters away. Slab, chips and base all expand at different rates when heated, so the package can warp and its joints crack. Getting that right in large numbers is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan.",
  "bridge": "Logic and memory are still two separate objects, made in different countries, and the next stage exists to close the distance between them.",
  "specimen": "cowos-exploded",
  "specimenCaption": "A CoWoS package pulled apart: two logic dies and eight HBM stacks on a slab of silicon called the interposer, in silver with its copper wiring, which sits on a resin substrate and its ball grid. The chips together cover about 2,700 mm2, a little over three reticle fields. Footprints are to scale; the thicknesses and the gaps between layers are exaggerated.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "Almost all CoWoS for leading AI accelerators"},
      {"name": "ASE Technology", "country": "TW", "share": "NT$645.4B revenue, 2025; the leading provider of outsourced assembly and test"},
      {"name": "Amkor", "country": "US", "share": "$6.71B net sales, 2025; the largest American assembly and test firm"},
      {"name": "JCET", "country": "CN", "share": "RMB 38.87B revenue, 2025; a leading Chinese assembly and test firm"},
      {"name": "ASMPT", "country": "SG", "share": "$532.1M advanced packaging revenue, 2025; thermocompression bonders"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC AP fabs and the OSAT cluster; almost all 2.5D capacity for AI accelerators"},
      {"code": "US", "note": "Amkor Peoria, Arizona from 2028; two TSMC advanced packaging plants planned in Arizona"},
      {"code": "CN", "note": "JCET, Tongfu and HT-Tech; four of the top ten outsourced assembly and test firms by 2024 revenue are Chinese"},
      {"code": "NL", "note": "Besi hybrid and die bonders"},
      {"code": "JP", "note": "Disco grinders and dicers; TEL and Shibaura bonding tools"}
    ],
    "chinaStatus": "Four of the top ten outsourced assembly and test firms by 2024 revenue are headquartered in China, and JCET alone had revenue of RMB 38.87 billion in 2025. Between 2019 and 2024, Chinese tool makers gained share in advanced packaging and test tools, gained none in atomic layer deposition and gained a negligible share in lithography. US and Japanese firms still held significant leads in advanced packaging tools in 2024, when China had 7 percent of that market.",
    "usStatus": "No firm yet does CoWoS-class packaging in volume in the United States. Amkor is building a $7B packaging and test plant in Peoria, Arizona, with up to $407M of CHIPS Act money, and expects production to start in early 2028.",
    "costSignal": "No public wafer counts. TSMC said at its 2024 symposium that CoWoS capacity would grow at a 60% compound annual rate over the next few years, but it does not publish the total. Epoch AI estimates Nvidia alone used 60.3% of the world's CoWoS capacity in 2025",
    "substitutability": {"band": "Moderate", "test": "Intel's EMIB can do the same job as TSMC's CoWoS, and the real shortage is in making enough working packages at the volume Nvidia orders.", "why": "None of the packaging steps is unusual, and Intel's EMIB is another 2.5D option that Trainium and TPU have adopted to different degrees. The hard part is volume. A newcomer has to buy enough bonding machines and run enough practice lots to make the interposer, the silicon base plate under the chips, at 5.5 times the area a scanner prints in one shot. It then has to attach the memory stacks, have them work, and do all of that at the volume Nvidia alone orders. Amkor's plant in Peoria, Arizona shows the timing. Its production is expected to start in early 2028, so the wait is two to five years."}
  },
  "keyFacts": [
    {"fact": "A scanner's maximum exposure field is 26 mm by 33 mm, or 858 mm2", "source": "https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400c"},
    {"fact": "TSMC said in April 2026 that it is now producing 5.5-reticle CoWoS and planning even larger versions", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "CoWoS-S silicon interposers reach 3.3x reticle size, about 2,700 mm2; larger designs must use CoWoS-R or CoWoS-L", "source": "https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm"},
    {"fact": "TSMC told its 2024 symposium that CoWoS capacity would grow at a 60% CAGR over the following years, and C.C. Wei said in July 2024 that he could not reach supply and demand balance", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf"},
    {"fact": "In October 2025 Wei would still not give an absolute CoWoS number for 2026, and said a large outsourced packaging partner already breaking ground in Arizona was on an earlier schedule than TSMC's own two packaging fabs there", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf"},
    {"fact": "A 14-reticle CoWoS carrying about 10 large compute dies and 20 HBM stacks is planned for production in 2028, with more than 14 reticles in 2029 and a 40-reticle System-on-Wafer the same year", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "ASE Technology Holding had revenue of NT$645.4 billion in 2025, up 8.4%, with assembly and test revenue of NT$389.2 billion against NT$325.9 billion in 2024", "source": "https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html"},
    {"fact": "JCET, a leading Chinese assembly and test firm, had record revenue of RMB 38.87 billion in 2025, up 8.1%", "source": "https://www.jcetglobal.com/en/site/news-detail?id=2048"},
    {"fact": "ASMPT advanced packaging revenue was $532.1M in 2025, up 30.2%, with TCB revenue up about 146%; it targets 35-40% of the TCB market", "source": "https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/"},
    {"fact": "Amkor started building a $7B two-phase packaging and test campus in Peoria, Arizona in October 2025, with production from early 2028", "source": "https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced"},
    {"fact": "In December 2024 the Commerce Department awarded Amkor up to $407M in CHIPS Act direct funding for its Arizona facility", "source": "https://www.sec.gov/Archives/edgar/data/1047127/000104712726000014/amkr-20251231.htm"},
    {"fact": "TSMC's Arizona commitment reached $265 billion covering 10 fabs and 2 advanced packaging facilities", "source": "https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/"},
    {"fact": "Epoch AI estimates Nvidia used 60.3% of the world's CoWoS packaging capacity in 2025, with a 90% confidence interval of 56.5 to 64.3, and that Nvidia, Google, AMD and Amazon together used around 90% of it while using only about 12% of advanced logic die production", "source": "https://epoch.ai/data-insights/ai-chip-supply-chain-constraints"}
  ],
  "figures": [
    {"id": "package-build", "type": "animation", "src": "package", "title": "The parts of an AI accelerator", "note": "Simplified view of a two-die, eight-stack accelerator. Footprints follow the sizes in this chapter and chapter 10; heights are exaggerated so each layer shows."},
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

A lithography scanner prints a rectangle 26 mm by 33 mm, or 858 mm2, in one exposure ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400c)). Every AI accelerator worth buying is bigger than that. Packaging is the stage that lets an accelerator be larger than that rectangle, and it decides how much larger.

## How it works

Packaging joins finished chips into one component and mounts them on a base, called a substrate, wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot, and a modern accelerator needs more circuit than fits in one, so it cannot be one chip. It is made as several pieces, set side by side on a shared slab of silicon and wired together through it, with the stacked memory a few millimeters away. Slab, chips and base all expand at different rates when heated, so the package can warp and its joints crack. Getting that right in large numbers is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan.

High bandwidth memory gives a second reason to split the package. An HBM4 stack connects through 2,048 data signals, packed too tightly for a standard resin base board, so the memory sits beside the logic on a shared silicon carrier, the interposer ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)).

{{figure:package-build}}

The name CoWoS says the order: chip onto wafer, then wafer onto substrate. TSMC makes a thin silicon wafer carrying wiring and vertical copper vias, metal-filled holes that join one layer of wiring to the next, but no transistors. It bonds the logic dies and memory stacks face down onto that wafer with microbumps, dots of solder 30 to 40 microns apart, about a third of a hair's width, each dot one electrical joint. Then it cuts the interposer out of the wafer, attaches it to the resin substrate, and the substrate goes onto its board.

Each of those packaging steps is ordinary on its own. But one cracked joint scraps a package holding eight qualified HBM stacks and two large, expensive logic dies.

## Variants and trade-offs

| Family | Carrier | Size limit | Used for |
|---|---|---|---|
| CoWoS-S | Full silicon interposer | 3.3x reticle, about 2,700 mm2 | H100-class parts |
| CoWoS-R | Resin interposer with fine redistribution wiring | Above 3.3x reticle | Cost-sensitive, fewer HBM stacks |
| CoWoS-L | Redistribution wiring with local silicon bridges | 5.5x reticle in production, 9.5x in development | Blackwell, Rubin |

### 2.5D: silicon, RDL and bridges

TSMC has run CoWoS in volume since 2012 ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)). CoWoS-S wires most finely, but its interposer is one unbroken piece of silicon whose yield falls as the area grows, so CoWoS-L replaces the slab with fine wiring and small silicon bridges only where the wiring is dense. Intel's EMIB buries the same bridge idea in the resin substrate, and SemiAnalysis reported in March 2026 that Trainium and TPU had adopted it to different degrees ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).

Blackwell was the first high-volume design on CoWoS-L, and packaging issues at TSMC and in Nvidia's design limited its supply ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)). The bridges carrying the 10 TB/s link between the two compute dies need very high placement accuracy, and the different expansion rates of the dies, bridges, interposer and substrate caused warpage ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)).

### 3D: SoIC, Foveros, X-Cube

TSMC's SoIC and Intel's Foveros bond dies face to face, copper pad to copper pad with no solder, packing the connections far closer than microbumps allow. TSMC put 3 nm SoIC into volume production in 2025 ([source](https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf)). An A14-on-A14 version due in 2029 will carry 1.8 times the die-to-die connection density of the 2 nm version ([source](https://pr.tsmc.com/english/news/3302)). Heat decides the layout: the bottom die overheats and the top is hard to power, so 3D designs often put cache underneath and compute on top.

### Two ways off the silicon interposer

Panel-level packaging swaps the round wafer for a rectangular panel and wastes far less area; see [Test and assembly](#test-and-assembly). JEDEC published SPHBM4 on 13 July 2026. It puts HBM4 memory on a base chip carrying 512 data signals instead of 2,048, which spaces the connections widely enough to mount the stack on a standard resin substrate, off the silicon interposer altogether ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)).

## Capacity

TSMC does not publicly disclose its CoWoS capacity ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). At its 2024 symposium it said capacity would grow at a 60 percent compound annual rate over the next few years, and on the July 2024 earnings call C.C. Wei said he could not reach supply and demand balance ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf)).

In October 2025 Wei would still say only that TSMC was working to increase capacity in 2026 and would probably give the real number in 2026, and that front-end and back-end capacity were both, in his words, very tight ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)).

Epoch AI weighs each designer's component use against world supply and puts Nvidia at 60.3 percent of all CoWoS in 2025, with a 90 percent confidence interval of 56.5 to 64.3; Google took 13.5, AMD 8.4 and Amazon 7.4 ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). Those four consumed around 90 percent of global CoWoS capacity and HBM supply, with HBM measured by value, while consuming only 12 percent of advanced logic die production ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)).

{{figure:cowos-buyers}}

SemiAnalysis reported in March 2026 that front-end capacity is now the dominant bottleneck and CoWoS constraints are easing, and that TSMC plans CoWoS capacity around its N3 limits because added packaging capacity is of no use without front-end wafers to fill it ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).

## Who makes it

{{figure:cowos-reticles}}

The word packaging covers two industries. TSMC does the 2.5D work, chips side by side on a shared carrier, in its own back-end fabs; everything else goes to outsourced assembly and test firms. ASE Technology Holding, the leading provider of assembly and test services, billed NT$645.4 billion in 2025, with its assembly and test business at NT$389.2 billion against NT$325.9 billion in 2024 ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html)). Amkor, the world's largest US-headquartered one, billed $6.71 billion ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000007/amkr123125erex-991.htm)).

The tools are a narrower chokepoint than the assembly houses.

- **Thermocompression bonding.** Pressing dies together under heat and force. ASMPT's advanced packaging revenue reached $532.1 million in 2025, with thermocompression bonder revenue up about 146 percent; it targets 35 to 40 percent of a market it puts at $1.6 billion in 2028 ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Hybrid bonding.** Solder disappears and copper pads meet directly. Applied Materials co-developed its Kinex hybrid bonding system with Besi, which Applied calls the industry leader in hybrid bonding ([source](https://www.appliedmaterials.com/eu/en/product-library/kinex-integrated-die-to-wafer-hybrid-bonding-system.html)).
- **Grinding and dicing.** Disco holds the leading market share in wafer grinders and dicing saws, the tools that thin wafers and cut them into chips; see [Test and assembly](#test-and-assembly) ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)).

TSMC's Arizona commitment reached $265 billion in July 2026 and covers two advanced packaging plants alongside 10 fabs ([source](https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/)). Amkor started building a $7 billion campus in Peoria in October 2025 and expects production from early 2028 ([source](https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced)). The Commerce Department awarded Amkor up to $407 million in CHIPS Act funding for the site in December 2024 ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000014/amkr-20251231.htm)). In October 2025 Wei said a large outsourced packaging partner already breaking ground in Arizona was on an earlier schedule than TSMC's own two packaging fabs there ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)).

## The chokepoint

{{figure:china-backend-tools}}

JCET, a leading Chinese assembler, billed a record RMB 38.87 billion in 2025, up 8.1 percent ([source](https://www.jcetglobal.com/en/site/news-detail?id=2048)). Chinese toolmakers gained share in advanced packaging and test tools between 2019 and 2024, the same years they gained none in atomic layer deposition ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Four of the top ten outsourced assembly and test firms by 2024 revenue are headquartered in China, but US and Japanese firms still held significant leads in advanced packaging tools in 2024 ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). JCET says its XDFOI platform has entered high-volume manufacturing with redistribution-layer interposer, silicon interposer and silicon bridge options ([source](https://www.jcetglobal.com/en/site/news-detail?id=2052)).

Each generation on TSMC's roadmap needs a larger interposer.

- **2028.** A 14-reticle interposer carrying about ten large compute dies and 20 HBM stacks, roughly 12,000 mm2 of silicon, about the area of a compact disc ([source](https://pr.tsmc.com/english/news/3302)).
- **2029.** More than 14 reticles, and a 40-reticle System-on-Wafer beside it ([source](https://pr.tsmc.com/english/news/3302)).

## Key evaluation criteria

- **Interposer area** is the limit on how much logic and memory fit, now 5.5x reticle on CoWoS-L ([source](https://pr.tsmc.com/english/news/3302)).
- **Package yield** decides whether a generation ships on time, and nobody publishes it.
- **Warpage control** covers the expansion mismatch between die, bridge, interposer and substrate that caused warpage in Blackwell, the first high-volume CoWoS-L design ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)).
- **HBM stacks supported** is about 20 on the 14-reticle package due in 2028 ([source](https://pr.tsmc.com/english/news/3302)).
- **Bonder throughput** depends on the toolmakers, and ASMPT alone targets 35 to 40 percent of the thermocompression bonding market ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Substrate size** limits everything above it. A 14-reticle interposer needs a resin substrate that will not warp under it, which pushes ABF build-up film to its limits; see [Substrates and PCBs](#substrates-and-pcbs).

## Takeaways

TSMC's chief executive said in July 2024 that demand for its CoWoS advanced packaging was so high that he could not yet balance supply and demand ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf)). Epoch AI found that CoWoS, which joins an AI chip's logic dies to its memory, and the memory itself were the main limits on AI chip production in 2025 ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). By March 2026, SemiAnalysis judged that CoWoS supply was easing and that the factories that print the chips had become the main bottleneck ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).
