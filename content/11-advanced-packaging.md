---json
{
  "id": "advanced-packaging",
  "number": 11,
  "title": "Advanced Packaging",
  "oneLiner": "TSMC packages nearly every AI accelerator. Epoch AI found that this packaging and high bandwidth memory were the main bottlenecks on AI chip production in 2025.",
  "plain": "Packaging joins finished chips into one component and mounts them on a base, called a substrate, wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot. Many leading accelerators, Nvidia's Blackwell among them, need more logic than fits in that rectangle. So they are built from several chips, called dies, set side by side on an interposer, which wires them together and sits on the substrate. Stacks of memory chips sit on the same interposer, a few millimeters away. The interposer is either one piece of silicon or layers of fine copper wiring that often carry small silicon bridges where the links are densest. Interposer, chips and substrate all expand at different rates when heated, so the package can warp and its joints crack. Preventing that in high volume is so hard that TSMC, in Taiwan, packages nearly every AI accelerator.",
  "bridge": "Logic and memory are still two separate parts, made in different countries. The next stage puts them side by side in one package.",
  "specimen": "cowos-exploded",
  "specimenCaption": "A CoWoS-L package, pulled apart. Two logic dies and eight HBM stacks sit on the interposer, shown in silver with its copper wiring. In CoWoS-L the interposer is fine redistribution wiring with small embedded silicon bridges. It sits on a resin substrate with a grid of solder balls underneath. The chips together cover about 2,700 mm2, a little over three reticle fields. Footprints are to scale. Thicknesses and the gaps between layers are exaggerated.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "Almost all CoWoS for leading AI accelerators"},
      {"name": "Intel", "country": "US", "share": "Foveros 3D packaging in volume at Rio Rancho, New Mexico; EMIB 2.5D bridges"},
      {"name": "ASE Technology", "country": "TW", "share": "NT$389.2B assembly, test and materials revenue, 2025; the leading provider of outsourced assembly and test"},
      {"name": "Amkor", "country": "US", "share": "$6.71B net sales, 2025; the largest American assembly and test firm"},
      {"name": "JCET", "country": "CN", "share": "RMB 38.87B revenue, 2025; a leading Chinese assembly and test firm"},
      {"name": "ASMPT", "country": "SG", "share": "$532.1M advanced packaging revenue, 2025; thermocompression bonders"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC advanced packaging fabs and a cluster of outsourced assembly and test firms; almost all 2.5D capacity for AI accelerators"},
      {"code": "US", "note": "Intel Foveros packaging in volume at Rio Rancho, New Mexico; Amkor plant in Peoria, Arizona, from 2028; two TSMC advanced packaging plants planned in Arizona"},
      {"code": "CN", "note": "JCET, Tongfu and HT-Tech; four of the top ten outsourced assembly and test firms by 2024 revenue are Chinese"},
      {"code": "NL", "note": "Besi hybrid and die bonders"},
      {"code": "JP", "note": "Disco grinders and dicers; TEL and Shibaura bonding tools"}
    ],
    "chinaStatus": "Four of the top ten outsourced assembly and test firms by 2024 revenue are headquartered in China. JCET alone had revenue of RMB 38.87 billion in 2025. Between 2019 and 2024, Chinese firms gained 5 percentage points of share in test tools and 4 points in fabrication tools built for advanced packaging, especially in etch and clean tools. But they lost share in bonding and other conventional assembly and packaging tools, the category where CSET counts hybrid and thermocompression bonders. In 2024 Chinese firms had 7 percent of the market for advanced packaging fabrication tools, against 65 percent for US firms and 15 percent for Japanese firms.",
    "usStatus": "Intel opened Fab 9 in Rio Rancho, New Mexico, in January 2024 to make its Foveros 3D packages in volume. It called the plant the only US factory producing the most advanced packaging at scale. Intel also offers its EMIB 2.5D packaging to outside customers. SemiAnalysis reported in March 2026 that Amazon's Trainium and Google's TPU were adopting EMIB to different degrees. No US site yet packages Nvidia-class accelerators with HBM on CoWoS. Amkor is building a $7B packaging and test plant in Peoria, Arizona, with up to $407M of CHIPS Act money, and expects production to start in early 2028.",
    "costSignal": "About 65,000 to 75,000 CoWoS wafers a month at the end of 2025, up from 35,000 to 40,000 a year earlier, in industry estimates from SemiWiki and TrendForce compiled by Epoch AI. TSMC does not publish its CoWoS capacity. At its 2024 symposium it projected 60 percent annual growth for the next few years. Epoch AI estimates Nvidia alone used 60.3 percent of the world's CoWoS capacity in 2025",
    "substitutability": {"band": "Moderate", "test": "Intel's EMIB can do the same job as TSMC's CoWoS. But the shortage is in making enough working packages at the volume Nvidia orders.", "why": "None of the packaging steps is unusual. Intel's EMIB is another 2.5D option, and Amazon's Trainium and Google's TPU were adopting it to different degrees as of March 2026. But a newcomer has to buy enough bonding machines and run enough practice lots to make the interposer at 5.5 times the area a scanner prints in one shot. It then has to attach the memory stacks, make sure they work, and do all of that at the volume Nvidia alone orders. Amkor started building its plant in Peoria, Arizona in October 2025 and expects production to start in early 2028, more than two years later. For a newcomer, the wait is two to five years."}
  },
  "keyFacts": [
    {"fact": "A scanner's maximum exposure field is 26 mm by 33 mm, or 858 mm2", "source": "https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400c"},
    {"fact": "TSMC said in April 2026 that it was producing 5.5-reticle CoWoS and planning larger versions", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "CoWoS-S silicon interposers reach 3.3x reticle size, about 2,700 mm2. Larger designs must use CoWoS-R or CoWoS-L", "source": "https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm"},
    {"fact": "TSMC told its 2024 symposium that CoWoS capacity would grow at a 60% compound annual rate over the following years. In July 2024 its chief executive, C.C. Wei, said he could not balance supply and demand", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf"},
    {"fact": "Industry estimates from SemiWiki and TrendForce, compiled by Epoch AI, put CoWoS capacity at about 65,000 to 75,000 wafers a month at the end of 2025, up from 35,000 to 40,000 a year earlier", "source": "https://epoch.ai/data-insights/ai-chip-supply-chain-constraints"},
    {"fact": "On the July 2026 earnings call, Wei said TSMC's packaging capacity was so tight that it limited customers' growth, and that back-end capacity was still in shortage", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf"},
    {"fact": "In October 2025 Wei still would not give an absolute figure for CoWoS capacity in 2026. He said a large outsourced packaging partner, already breaking ground in Arizona, was on an earlier schedule than TSMC's own two packaging fabs there", "source": "https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf"},
    {"fact": "TSMC plans to produce a 14-reticle CoWoS carrying about 10 large compute dies and 20 HBM stacks in 2028. For 2029 it plans more than 14 reticles and a 40-reticle System-on-Wafer", "source": "https://pr.tsmc.com/english/news/3302"},
    {"fact": "ASE Technology Holding had revenue of NT$645.4 billion in 2025, up 8.4%, about 40% of it from electronics manufacturing services. Its assembly, test and materials revenue was NT$389.2 billion, up from NT$325.9 billion in 2024", "source": "https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html"},
    {"fact": "JCET, a leading Chinese assembly and test firm, had record revenue of RMB 38.87 billion in 2025, up 8.1%", "source": "https://www.jcetglobal.com/en/site/news-detail?id=2048"},
    {"fact": "ASMPT's advanced packaging revenue was $532.1M in 2025, up 30.2%, with thermocompression bonder revenue up about 146%. It targets 35-40% of the thermocompression bonding market", "source": "https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/"},
    {"fact": "Amkor started building a $7B two-phase packaging and test campus in Peoria, Arizona in October 2025, with production expected from early 2028", "source": "https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced"},
    {"fact": "In December 2024 the Commerce Department awarded Amkor up to $407M in CHIPS Act direct funding for its Arizona facility", "source": "https://www.sec.gov/Archives/edgar/data/1047127/000104712726000014/amkr-20251231.htm"},
    {"fact": "TSMC's Arizona commitment reached $265 billion in July 2026, covering 10 fabs and 2 advanced packaging facilities", "source": "https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/"},
    {"fact": "Epoch AI estimates Nvidia used 60.3% of the world's CoWoS packaging capacity in 2025, with a 90% confidence interval of 56.5 to 64.3. It estimates that Nvidia, Google, AMD and Amazon together used around 90% of CoWoS capacity, but only about 12% of advanced logic die production", "source": "https://epoch.ai/data-insights/ai-chip-supply-chain-constraints"}
  ],
  "figures": [
    {"id": "package-build", "type": "animation", "src": "package", "title": "The parts of an AI accelerator", "note": "Simplified view of a two-die, eight-stack accelerator. Footprints follow the sizes given in this chapter and chapter 10. Heights are exaggerated so each layer shows."},
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
      "title": "China-based suppliers' share of selected tool segments, 2024",
      "unit": "%",
      "data": [["Test, linear and discrete", 69], ["Burn-in test", 9], ["Advanced packaging fabrication tools", 7], ["SoC test", 5]],
      "source": {"label": "CSET, Inside Beijing’s Chipmaking Offensive", "url": "https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/"}
    },
    {
      "id": "cowos-buyers",
      "type": "stack",
      "title": "Estimated share of CoWoS capacity used, 2025",
      "unit": "%",
      "data": [["Nvidia", 60.3], ["Google", 13.5], ["AMD", 8.4], ["Amazon", 7.4], ["Everyone else", 10.4]],
      "source": {"label": "Epoch AI, advanced packaging and HBM were the bottlenecks on AI chip production in 2025", "url": "https://epoch.ai/data-insights/ai-chip-supply-chain-constraints"}
    }
  ]
}
---
# Advanced Packaging

A lithography scanner prints a rectangle 26 mm by 33 mm, or 858 mm2, in one exposure ([source](https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400c)). That area is called the reticle field. Every leading AI accelerator is bigger than that. Packaging is the stage that lets an accelerator be larger than one reticle field, and the packaging method limits how much larger it can be.

## How it works

Packaging joins finished chips into one component and mounts them on a base, called a substrate, wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot. Many leading accelerators, Nvidia's Blackwell among them, need more logic than fits in that rectangle. So they are built from several chips, called dies, set side by side on an interposer, which wires them together and sits on the substrate. Stacks of memory chips sit on the same interposer, a few millimeters away. The interposer is either one piece of silicon or layers of fine copper wiring that often carry small silicon bridges where the links are densest. Interposer, chips and substrate all expand at different rates when heated, so the package can warp and its joints crack. Preventing that in high volume is so hard that TSMC, in Taiwan, packages nearly every AI accelerator.

A second reason for the interposer is high bandwidth memory (HBM). An HBM4 stack connects through 2,048 data signals, packed too tightly for a standard resin substrate, so the memory sits beside the logic on the interposer ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)). Even Nvidia's H100, whose single logic die is 814 mm2 and fits inside one reticle field, carries five HBM stacks ([source](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/)). Epoch AI counts TSMC's CoWoS packaging among the three inputs the H100 needs, along with its logic die and its HBM ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)).

{{figure:package-build}}

CoWoS stands for chip on wafer on substrate, the order in which the parts are joined. For CoWoS-S, TSMC makes a thin silicon wafer that carries wiring and vertical copper vias but no transistors. Vias are metal-filled holes that join one layer of wiring to the next. TSMC bonds the logic dies and memory stacks face down onto that wafer with microbumps. These are dots of solder 30 to 40 microns apart, about a third of a hair's width, and each dot is one electrical joint. Then TSMC cuts the interposer out of the wafer and attaches it to the resin substrate, which later goes onto a circuit board.

Each of those packaging steps is ordinary on its own. But one cracked joint scraps a package holding eight tested HBM stacks and two large, expensive logic dies.

## Variants and trade-offs

| Family | Carrier | Size limit | Used for |
|---|---|---|---|
| CoWoS-S | Full silicon interposer | 3.3x reticle, about 2,700 mm2 | H100-class parts |
| CoWoS-R | Resin interposer with fine redistribution wiring | Above 3.3x reticle | Cost-sensitive, fewer HBM stacks |
| CoWoS-L | Redistribution wiring with local silicon bridges | 5.5x reticle in production, 9.5x in development | Blackwell, Rubin |

### 2.5D: silicon, RDL and bridges

In 2.5D packaging the chips sit side by side and connect through an interposer or silicon bridges beneath them. TSMC has run CoWoS in volume since 2012 ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)). CoWoS-S has the finest wiring, but its interposer is one unbroken piece of silicon whose yield (the share of interposers that work) falls as the area grows. CoWoS-L replaces that piece of silicon with redistribution layers (RDL) of fine copper wiring and embeds small silicon bridges where the wiring is densest ([source](https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf)). Intel's EMIB embeds similar silicon bridges in the resin substrate, and SemiAnalysis reported in March 2026 that Amazon's Trainium and Google's TPU were adopting it to different degrees ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).

Blackwell was the first high-volume design on CoWoS-L, and packaging problems at TSMC and in Nvidia's design limited its supply ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)). The bridges that carry the 10 TB/s link between the two logic dies must be placed very precisely ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)). The dies, bridges, interposer and substrate also expand at different rates, and that mismatch caused warpage ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)).

### 3D: SoIC and Foveros

TSMC's SoIC and Intel's Foveros bond dies face to face, copper pad to copper pad, with no solder. That lets the connections sit far closer together than microbumps allow. TSMC put 3 nm SoIC into volume production in 2025 ([source](https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf)). An A14-on-A14 version, stacking dies made on TSMC's 1.4 nm process, is due in 2029 ([source](https://pr.tsmc.com/english/news/3302)). It will carry 1.8 times the die-to-die connection density of the 2 nm version ([source](https://pr.tsmc.com/english/news/3302)).

In a stack the bottom die overheats and the top die is hard to power. Because of the heat, 3D designs often put cache memory underneath and compute circuits on top.

SoIC bonding also brings optics into the package. TSMC's COUPE uses SoIC to join a silicon photonics chip, which sends data as light, to its electrical control chip ([source](https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf)). TSMC said in April 2026 that COUPE on substrate would begin production in 2026 ([source](https://pr.tsmc.com/english/news/3302)). It also said that putting COUPE inside the package gives twice the power efficiency of a pluggable version on the circuit board ([source](https://pr.tsmc.com/english/news/3302)).

### Two ways off the silicon interposer

Panel-level packaging replaces the round wafer with a rectangular panel, which wastes far less area. See [Test and assembly](#test-and-assembly). JEDEC, the semiconductor standards body, published a standard called SPHBM4 on 13 July 2026. It puts HBM4 memory on a base chip carrying 512 data signals instead of 2,048 ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)). With fewer signals, the connections can be spaced widely enough to mount the stack on a standard resin substrate instead of the silicon interposer ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)).

## Capacity

TSMC does not publish its CoWoS capacity ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). Industry estimates from SemiWiki and TrendForce, compiled by Epoch AI, put it at about 65,000 to 75,000 wafers a month at the end of 2025, up from 35,000 to 40,000 a year earlier ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)).

At its 2024 symposium TSMC said CoWoS capacity would grow at a 60 percent compound annual rate over the next few years ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf)). But when asked about that rate on the July 2024 earnings call, TSMC's chief executive, C.C. Wei, gave no figure ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf)). He said only that he would keep adding capacity wherever he could, and that he could not yet balance supply and demand ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf)).

In October 2025 Wei would still say only that TSMC was working to increase capacity in 2026 and would probably give the real number in 2026 ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)). He said front-end capacity (making the chips) and back-end capacity (packaging them) were both, in his words, very tight ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)).

Epoch AI compared each chip designer's use of components with world supply ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). It puts Nvidia at 60.3 percent of all CoWoS capacity in 2025, with a 90 percent confidence interval of 56.5 to 64.3 ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). Google took 13.5 percent, AMD 8.4 and Amazon 7.4 ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). Together those four used around 90 percent of global CoWoS capacity and HBM supply, with HBM measured by value, but only 12 percent of advanced logic die production ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)).

{{figure:cowos-buyers}}

In March 2026 the research firm SemiAnalysis judged that front-end capacity had become the dominant bottleneck and that CoWoS constraints were easing ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)). It said TSMC was planning CoWoS capacity around how many wafers N3, its 3 nm process, could produce, because added packaging capacity is of no use without front-end wafers to fill it ([source](https://newsletter.semianalysis.com/p/the-great-ai-silicon-shortage)).

TSMC gave a different account four months later. On the July 2026 earnings call, Wei said TSMC's packaging capacity was so tight that it limited customers' growth, and that back-end capacity was still in shortage ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)). Asked about Intel's EMIB-T, he said he welcomed the extra flexibility and hoped it would take some of the load off TSMC ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)).

## Who makes it

{{figure:cowos-reticles}}

Three kinds of firm package chips. TSMC, which makes chips for others, and Intel, which makes its own, do it in their own back-end fabs. Outsourced assembly and test firms do the rest. Intel opened Fab 9 in Rio Rancho, New Mexico, in January 2024 to make its Foveros 3D packages in volume ([source](https://www.intel.com/content/www/us/en/newsroom/news/intel-opens-fab-9-new-mexico.html)). It called the plant the only US factory producing the most advanced packaging at scale ([source](https://www.intel.com/content/www/us/en/newsroom/news/intel-opens-fab-9-new-mexico.html)).

ASE Technology Holding, the leading provider of assembly and test services, had revenue of NT$645.4 billion in 2025, about 40 percent of it from electronics manufacturing services ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html)). Its assembly, test and materials business brought in NT$389.2 billion, up from NT$325.9 billion in 2024 ([source](https://www.prnewswire.com/news-releases/ase-technology-holding-co-ltd-reports-its-unaudited-consolidated-financial-results-for-the-fourth-quarter-and-the-full-year-of-2025-302679779.html)). Amkor, the largest US-headquartered assembly and test firm, had net sales of $6.71 billion in 2025 ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000007/amkr123125erex-991.htm)).

The packaging tools are a narrower chokepoint than the assembly firms.

- **Thermocompression bonding.** Pressing dies together under heat and force. ASMPT's advanced packaging revenue reached $532.1 million in 2025, with thermocompression bonder revenue up about 146 percent ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)). ASMPT targets 35 to 40 percent of a market it puts at $1.6 billion in 2028 ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Hybrid bonding.** Copper pads bond directly, with no solder. Applied Materials co-developed its Kinex hybrid bonding system with Besi, which Applied calls the industry leader in hybrid bonding ([source](https://www.appliedmaterials.com/eu/en/product-library/kinex-integrated-die-to-wafer-hybrid-bonding-system.html)).
- **Grinding and dicing.** Disco held 87 percent of the $1.9 billion world market for dicing tools in 2025, by CSET's count from TechInsights data ([source](https://chipexplorer.eto.tech/?parentNode=N69&selectedNode=N71)). The category covers the grinders that thin wafers and the saws that cut them into chips ([source](https://chipexplorer.eto.tech/?parentNode=N69&selectedNode=N71)). See [Test and assembly](#test-and-assembly).

TSMC's Arizona commitment reached $265 billion in July 2026 and covers two advanced packaging plants alongside 10 fabs ([source](https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/)). Amkor started building a $7 billion campus in Peoria in October 2025 and expects production from early 2028 ([source](https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced)). The Commerce Department awarded Amkor up to $407 million in CHIPS Act funding for the site in December 2024 ([source](https://www.sec.gov/Archives/edgar/data/1047127/000104712726000014/amkr-20251231.htm)). In October 2025 Wei said a large outsourced packaging partner, already breaking ground in Arizona, was on an earlier schedule than TSMC's own two packaging fabs there ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf)).

## The chokepoint

{{figure:china-backend-tools}}

Four of the top ten outsourced assembly and test firms by 2024 revenue are headquartered in China ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). JCET, a leading Chinese assembly and test firm, had record revenue of RMB 38.87 billion in 2025, up 8.1 percent ([source](https://www.jcetglobal.com/en/site/news-detail?id=2048)). JCET says its XDFOI platform has entered high-volume manufacturing with redistribution-layer interposer, silicon interposer and silicon bridge options ([source](https://www.jcetglobal.com/en/site/news-detail?id=2052)).

Between 2019 and 2024, Chinese firms gained 5 percentage points of share in test tools and 4 points in fabrication tools built for advanced packaging ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). But they lost share in bonding and other conventional assembly and packaging tools, the category where CSET counts hybrid and thermocompression bonders ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). Within the advanced packaging fabrication tools, Chinese firms gained 10 points in etch and clean tools and 3 points in deposition tools, and lost 2 points each in lithography and polishing (CMP) tools ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). In 2024 Chinese firms had 7 percent of the market for advanced packaging fabrication tools, against 65 percent for US firms and 15 percent for Japanese firms ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).

Each generation on TSMC's roadmap needs a larger interposer.

- **2028.** A 14-reticle interposer of roughly 12,000 mm2, about the area of a compact disc, carrying about ten large compute dies and 20 HBM stacks ([source](https://pr.tsmc.com/english/news/3302)).
- **2029.** More than 14 reticles, plus a 40-reticle System-on-Wafer ([source](https://pr.tsmc.com/english/news/3302)).

## Key evaluation criteria

- **Interposer area** limits how much logic and memory fit in one package, and stood at 5.5x reticle on CoWoS-L in April 2026 ([source](https://pr.tsmc.com/english/news/3302)).
- **Package yield**, the share of finished packages that work, determines whether a generation ships on time. Nobody publishes it.
- **Warpage control** means managing the different expansion rates of die, bridge, interposer and substrate. That mismatch caused warpage in Blackwell, the first high-volume CoWoS-L design ([source](https://semianalysis.com/2024/08/04/nvidias-blackwell-reworked-shipment/)).
- **HBM stacks supported** reach about 20 on the 14-reticle package due in 2028 ([source](https://pr.tsmc.com/english/news/3302)).
- **Bonder throughput** depends on the toolmakers. ASMPT alone targets 35 to 40 percent of the thermocompression bonding market ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Substrate size** limits everything above it. A 14-reticle interposer needs a resin substrate that will not warp under it, and that pushes ABF build-up film, the insulating material in the substrate's layers, to its limits. See [Substrates and PCBs](#substrates-and-pcbs).

## Takeaways

Epoch AI estimates that in 2025 Nvidia used 60.3 percent of all capacity for CoWoS, TSMC's interposer packaging ([source](https://epoch.ai/data-insights/ai-chip-supply-chain-constraints)). On the July 2026 earnings call, TSMC's chief executive, C.C. Wei, said its packaging capacity was so tight that it limited customers' growth ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)). Asked about Intel's EMIB-T packaging, he said he hoped it would take some of the load off TSMC ([source](https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf)).

Ranked by 2024 revenue, four of the top ten outsourced firms that package and test chips are headquartered in China ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)). But in 2024 Chinese firms had 7 percent of the market for advanced packaging fabrication tools, against 65 percent for US firms ([source](https://cset.georgetown.edu/article/inside-beijings-chipmaking-offensive/)).
