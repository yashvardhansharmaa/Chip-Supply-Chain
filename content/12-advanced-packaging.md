---json
{
  "id": "advanced-packaging",
  "number": 12,
  "title": "Advanced Packaging",
  "oneLiner": "Lithography stopped being the limit on chip size in 2022. Since then the limit has been how large an interposer TSMC can build, and how many of them per month.",
  "plain": "Think of a printed circuit board shrunk to the size of a playing card and built to the tolerances of a chip. A lithography machine can print only a rectangle about the size of a postage stamp in one shot, so a modern accelerator is cut into pieces and stitched back together on a shared slab of silicon, with its memory a few millimetres away. Slab, chips and board all expand at different rates when heated, so the finished package warps and joints crack. Doing that at scale is why nearly every AI accelerator is packaged by one company in Taiwan.",
  "specimen": "cowos-exploded",
  "specimenCaption": "Right: a CoWoS package pulled apart. Lid and stiffener at the top, then two logic dies and eight HBM stacks, microbumps, the interposer with its through-silicon vias, C4 bumps, and the organic build-up substrate at the bottom.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 5,
    "leaders": [
      {"name": "TSMC", "country": "TW", "share": "Effectively all CoWoS for leading AI accelerators"},
      {"name": "ASE Technology", "country": "TW", "share": "44.6% of top-10 OSAT revenue, 2024"},
      {"name": "Amkor", "country": "US", "share": "15.2% of top-10 OSAT revenue, 2024"},
      {"name": "JCET", "country": "CN", "share": "12.0% of top-10 OSAT revenue, 2024"},
      {"name": "Powertech", "country": "TW", "share": "5.5% of top-10 OSAT revenue, 2024"}
    ],
    "countries": [
      {"code": "TW", "note": "TSMC AP fabs and the OSAT cluster; almost all 2.5D capacity for AI accelerators"},
      {"code": "US", "note": "Amkor Peoria, Arizona from 2028; two TSMC advanced packaging plants planned in Arizona"},
      {"code": "CN", "note": "JCET, Tongfu and HT-Tech, strong in conventional OSAT, weak in 2.5D"},
      {"code": "NL", "note": "Besi hybrid and die bonders"},
      {"code": "JP", "note": "Disco grinders and dicers; TEL and Shibaura bonding tools"}
    ],
    "chinaStatus": "China's back end is far stronger than its front end. JCET, Tongfu and HT-Tech together took about 25% of top-10 OSAT revenue in 2024, but almost none of it is silicon-interposer 2.5D for AI accelerators.",
    "usStatus": "No domestic CoWoS at volume. Amkor is building a $7B packaging and test plant in Peoria with up to $407M of CHIPS funding, production from early 2028.",
    "costSignal": "TSMC forecasts CoWoS capacity growing at over 80% CAGR from 2022 to 2027",
    "substitution": {"years": "3-5", "why": "The unit process steps are not exotic. What is scarce is the yielded integration of a 5.5-reticle interposer with twelve HBM stacks, and the tool base to do it at 130,000 wafers a month."}
  },
  "keyFacts": [
    {"fact": "One reticle is 26 mm by 33 mm (858 mm2); TSMC is mass-producing 5.5-reticle CoWoS packages at over 98% yield with up to 12 HBM3E/HBM4 stacks", "source": "https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump"},
    {"fact": "CoWoS-S silicon interposers reach 3.3x reticle size, about 2,700 mm2; larger designs must use CoWoS-R or CoWoS-L", "source": "https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm"},
    {"fact": "TSMC CoWoS monthly capacity: about 13,000-16,000 wafers end-2023, 35,000-40,000 end-2024, about 75,000 in 2025, 120,000-140,000 by end-2026", "source": "https://xenospectrum.com/en/cowos-packaging-bottleneck-nvidia/"},
    {"fact": "Adding 50,000-60,000 wafers per month of OSAT capacity takes industry CoWoS-class capacity toward 200,000 wafers per month in 2026, narrowing the supply gap from about 20% to about 10%", "source": "https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/"},
    {"fact": "Nvidia has booked more than half of TSMC's 2026-2027 CoWoS expansion", "source": "https://www.digitimes.com/news/a20251210PD218/tsmc-cowos-capacity-nvidia-equipment.html"},
    {"fact": "Top-10 OSAT revenue was $41.56B in 2024; ASE took 44.6% and Amkor 15.2%", "source": "https://www.trendforce.com/presscenter/news/20250513-12577.html"},
    {"fact": "ASMPT advanced packaging revenue was $532.1M in 2025, up 30.2%, with TCB revenue up about 146%; it targets 35-40% of the TCB market", "source": "https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/"},
    {"fact": "TSMC's Arizona commitment reached $265 billion covering 10 fabs and 2 advanced packaging facilities", "source": "https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/"}
  ],
  "figures": [
    {
      "id": "cowos-capacity",
      "type": "bars",
      "title": "TSMC CoWoS capacity, thousand wafers per month at year end",
      "unit": "k wpm",
      "data": [["2023", 15], ["2024", 38], ["2025", 75], ["2026", 130]],
      "source": {"label": "TrendForce and SemiWiki figures compiled by XenoSpectrum, August 2026", "url": "https://xenospectrum.com/en/cowos-packaging-bottleneck-nvidia/"}
    },
    {
      "id": "osat-share",
      "type": "stack",
      "title": "Share of top-10 OSAT revenue, 2024",
      "unit": "%",
      "data": [["ASE (TW)", 44.6], ["Amkor (US)", 15.2], ["JCET (CN)", 12.0], ["Tongfu (CN)", 8.0], ["Powertech (TW)", 5.5], ["HT-Tech (CN)", 4.8], ["Others in top 10", 9.9]],
      "source": {"label": "TrendForce, Top 10 OSAT companies of 2024", "url": "https://www.trendforce.com/presscenter/news/20250513-12577.html"}
    }
  ]
}
---
# Advanced Packaging

A lithography scanner can print a rectangle 26 mm by 33 mm, or 858 mm2, in one exposure ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)). Every AI accelerator worth buying is larger than that. Packaging is how the industry escaped the reticle, and it is now the tightest constraint in the chain.

## How it works

Think of a printed circuit board shrunk to the size of a playing card and built to the tolerances of a chip. A lithography machine can print only a rectangle about the size of a postage stamp in one shot, so a modern accelerator is cut into pieces and stitched back together on a shared slab of silicon, with its memory a few millimetres away. Slab, chips and board all expand at different rates when heated, so the finished package warps and joints crack. Doing that at scale is why nearly every AI accelerator is packaged by one company in Taiwan.

Past roughly 800 mm2 a chip cannot be printed at all, so it is cut into chiplets. And an HBM stack has a 1,024-bit or 2,048-bit interface that no organic substrate can route at that pitch, so the memory has to sit on a shared silicon carrier beside the logic. That carrier is the interposer.

In CoWoS, TSMC builds a thin silicon wafer carrying only wiring and through-silicon vias, no transistors, then bonds logic dies and HBM stacks face down onto it with microbumps at around 30 to 40 micron pitch. That is the chip-on-wafer step. The populated interposer is diced out, attached to an organic build-up substrate with larger C4 bumps, and capped: the wafer-on-substrate step.

None of it is novel physics. The difficulty is that the parts expand at different rates under repeated heating, so one cracked joint kills a body already holding eight qualified HBM stacks and two of the most expensive logic dies ever made.

## Variants and trade-offs

| Family | Carrier | Ceiling | Used for |
|---|---|---|---|
| CoWoS-S | Full silicon interposer | 3.3x reticle, about 2,700 mm2 | H100-class parts |
| CoWoS-R | Organic RDL interposer | Above 3.3x reticle | Cost-sensitive, fewer HBM |
| CoWoS-L | RDL interposer with local silicon bridges | Reported up to 6x reticle | Blackwell, Rubin |

TSMC has had the platform in volume production since 2012 and recommends CoWoS-L or CoWoS-R above 3.3x reticle ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)).

### 2.5D: silicon, RDL and bridges

CoWoS-S is the simple case: one slab of silicon under everything. It gives the finest wiring, but the interposer is a monolithic die whose own yield falls as area grows. CoWoS-L replaces the slab with a redistribution layer carrying small silicon bridges only where dense wiring is needed, which allows systems in package up to six times reticle size ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)).

Blackwell was the first product to use it, and it went badly. Analysts traced the failures to a thermal expansion mismatch between the GPU chiplets, the bridges, the interposer and the substrate; Nvidia redesigned the top metal layers and bumps of the GPU silicon to recover yield ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)). Two years later TSMC is mass-producing 5.5-reticle packages carrying up to 12 HBM3E or HBM4 stacks at yields over 98% ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

Intel's EMIB embeds the same kind of bridge in the organic substrate instead of an RDL layer, which makes it the one credible second source when CoWoS is tight.

### 3D: SoIC, Foveros, X-Cube

Stacking logic on logic is the vertical axis. TSMC's SoIC and Intel's Foveros bond dies face to face, joining copper pads and oxide directly with no solder, which takes interconnect pitch far below what microbumps allow. The constraint is thermal: the bottom die overheats and the top die is hard to power, which is why many 3D designs put cache underneath rather than compute ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

### The escape routes

Two efforts aim to get off silicon interposers. Panel-level packaging swaps the round 300 mm wafer for a large rectangular panel, which wastes far less area; see Test and assembly. Separately, JEDEC published SPHBM4 on 13 July 2026: the same DRAM as HBM4, but a base die carrying 512 data signals with 4:1 serialisation instead of 2,048, which relaxes bump pitch enough to mount HBM on a standard organic substrate ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)). If it works at volume it takes pressure off the most constrained process in the industry.

## Capacity and allocation

{{figure:cowos-capacity}}

TSMC's CoWoS lines went from roughly 13,000 to 16,000 wafers per month at the end of 2023 to 120,000 to 140,000 by the end of 2026 ([source](https://xenospectrum.com/en/cowos-packaging-bottleneck-nvidia/)). TrendForce adds a further 50,000 to 60,000 a month from OSAT partners in 2026, taking industry capacity toward 200,000 and narrowing the supply gap from about 20% to about 10% by year end; TSMC forecasts capacity growing at more than 80% CAGR from 2022 to 2027 ([source](https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/)).

Allocation is the real story. Nvidia has booked more than half of TSMC's 2026 to 2027 CoWoS expansion ([source](https://www.digitimes.com/news/a20251210PD218/tsmc-cowos-capacity-nvidia-equipment.html)), and is estimated to hold around 60% of 2026 capacity, roughly 595,000 wafers across TSMC and its OSAT partners, on a Morgan Stanley estimate TSMC has not confirmed ([source](https://xenospectrum.com/en/cowos-packaging-bottleneck-nvidia/)). AMD and the custom-silicon programmes compete for the rest.

Public per-unit cost estimates for a finished package do not trace to a primary source, so we treat them with suspicion. The direction is documented: advanced packaging is growing faster than TSMC's foundry business, and interposer yield now moves the price of an accelerator.

## Who makes it

{{figure:osat-share}}

Two industries share the word packaging. The 2.5D work for AI accelerators happens almost entirely inside TSMC's own advanced backend fabs in Taiwan. Everything else goes to outsourced assembly and test firms, which billed $41.56 billion between the top ten in 2024, ASE alone taking $18.54 billion of it ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)).

The tools are a narrower chokepoint than the OSATs, and bonding is where the concentration sits.

- **Thermocompression bonding.** ASMPT's advanced packaging revenue reached $532.1 million in 2025, up 30.2%, with TCB revenue up about 146%; it puts the TCB market at $1.6 billion by 2028 and targets 35 to 40% of it ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Hybrid bonding.** Effectively a two-supplier market: SK hynix's first mass-production order was one inline system pairing Applied Materials and Besi tools for about 20 billion won, or $15 million ([source](https://www.tomshardware.com/tech-industry/semiconductors/sk-hynix-says-hybrid-bonding-wont-be-ready-for-hbm4e-as-ai-memory-runs-into-a-775-micron-ceiling)).
- **Grinding and dicing.** Disco dominates the steps that thin wafers and singulate packages, covered in Test and assembly ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)).

TSMC's Arizona commitment reached $265 billion in July 2026, covering 10 fabs, two advanced packaging plants and an R&D centre ([source](https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/)). Amkor's $7 billion Peoria plant, with TSMC as its process partner, starts production in early 2028 ([source](https://www.trendforce.com/news/2025/10/14/news-amkor-breaks-ground-on-usd-7-billion-advanced-semiconductor-packaging-facility-in-arizona/)). Neither replaces Taiwan this decade.

## The chokepoint

China's back end is much stronger than its front end. JCET, Tongfu and HT-Tech together took about 25% of top-10 OSAT revenue in 2024 ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)). Packaging tools are less export-controlled than lithography, and a chiplet strategy built on SMIC silicon plus domestic assembly is the most credible route around the node restrictions Huawei faces. What China does not have is silicon-interposer 2.5D at volume with qualified HBM beside it.

TSMC's own roadmap makes the chokepoint worse before it gets better.

- **2027.** A 9.5-reticle interposer supporting 12 HBM5 stacks on a 120 mm by 150 mm substrate ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **2028.** A 14-reticle interposer with 20 HBM5 modules and, we think, on the order of ten to twenty compute chiplets, depending on how stacked pairs are counted ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **2029.** More than 14 reticles with up to 24 HBM5E stacks, which at 12,020 mm2 is roughly the area of a compact disc ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

Optics arrive on the same platform: TSMC's COUPE stacks an electrical die on a photonic die using SoIC-X and targets volume production in 2026, claiming 5 to 10 times better power efficiency than pluggable modules ([source](https://www.trendforce.com/news/2026/04/01/news-silicon-photonics-race-intensifies-as-tsmc-targets-2026-coupe-production-samsung-eyes-2029-cpo-turnkey/)).

## Key evaluation criteria

- **Interposer area** — the ceiling on how much logic and memory fit. 3.3x reticle for CoWoS-S, 5.5x in production today ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)).
- **Package yield** — over 98% on 5.5-reticle CoWoS today, against a much worse start on Blackwell ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **Warpage control** — the expansion mismatch that broke early CoWoS-L is the recurring failure mode as packages grow ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)).
- **HBM stacks supported** — 12 today, 20 planned for 2028, 24 for 2029 ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **Bonder throughput** — thermocompression and hybrid bonding are slow and serial, and three or four firms hold the tool market ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Substrate size** — the 120 mm by 150 mm substrate planned for 2027 pushes the limits of ABF build-up film, covered in Substrates and PCBs ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

## Takeaways

Advanced packaging is the second great chokepoint after lithography, and unlike lithography it is a capacity problem rather than a physics problem: the steps are known, there simply are not enough lines. TSMC's CoWoS capacity grew roughly ninefold in three years and is still short, with Nvidia holding more than half of the expansion. China can package chips but cannot yet build the 2.5D structures AI accelerators need, and the American alternatives do not start production until 2028.
