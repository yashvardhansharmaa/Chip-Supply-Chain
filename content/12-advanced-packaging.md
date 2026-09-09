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
    {"fact": "TSMC's CoWoS monthly capacity reached about 35,000 wafers in 2024 and a record 75,000 in 2025", "source": "https://www.trendforce.com/news/2025/01/02/news-tsmc-set-to-expand-cowos-capacity-to-record-75000-wafers-in-2025-doubling-2024-output/"},
    {"fact": "TSMC CoWoS capacity is set to reach 120,000-140,000 wafers a month in 2026; adding 50,000-60,000 from OSAT partners takes industry capacity toward 200,000, narrowing the supply gap from about 20% to about 10%", "source": "https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/"},
    {"fact": "Nvidia has reserved about 800,000 to 850,000 wafers of TSMC's 2026 CoWoS capacity, more than 50% of the total", "source": "https://www.trendforce.com/news/2026/08/05/news-tsmc-reportedly-expands-outsourcing-of-key-cowos-front-end-step-to-osats-amid-rising-nvidia-asic-demand/"},
    {"fact": "Top-10 OSAT revenue was $41.56B in 2024; ASE took 44.6% and Amkor 15.2%", "source": "https://www.trendforce.com/presscenter/news/20250513-12577.html"},
    {"fact": "ASMPT advanced packaging revenue was $532.1M in 2025, up 30.2%, with TCB revenue up about 146%; it targets 35-40% of the TCB market", "source": "https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/"},
    {"fact": "TSMC's Arizona commitment reached $265 billion covering 10 fabs and 2 advanced packaging facilities", "source": "https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/"}
  ],
  "figures": [
    {
      "id": "cowos-capacity",
      "type": "bars",
      "title": "TSMC CoWoS capacity, thousand wafers per month",
      "unit": "k wpm",
      "data": [["2024", 35], ["2025", 75], ["2026", 130]],
      "source": {"label": "TrendForce press releases, December 2024, January 2025 and June 2026 (2026 is the midpoint of 120,000-140,000)", "url": "https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/"}
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

A lithography scanner prints a rectangle 26 mm by 33 mm, or 858 mm2, in one exposure ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)). Every AI accelerator worth buying is bigger than that. Packaging is how the industry escaped the reticle, and it is now the tightest constraint in the chain.

## How it works

Think of a printed circuit board shrunk to the size of a playing card and built to the tolerances of a chip. A lithography machine can print only a rectangle about the size of a postage stamp in one shot, so a modern accelerator is cut into pieces and stitched back together on a shared slab of silicon, with its memory a few millimetres away. Slab, chips and board all expand at different rates when heated, so the finished package warps and joints crack. Doing that at scale is why nearly every AI accelerator is packaged by one company in Taiwan.

The reticle limit is why logic is cut into chiplets. HBM adds a second reason: its 1,024-bit or 2,048-bit interface is too wide for an organic substrate to route, so the memory must sit on a shared silicon carrier beside the logic. That carrier is the interposer.

CoWoS builds it in two steps. TSMC makes a thin silicon wafer carrying wiring and through-silicon vias but no transistors, then bonds logic dies and HBM stacks face down onto it with microbumps at 30 to 40 micron pitch: chip-on-wafer. It dices the populated interposer out, attaches it to an organic build-up substrate with larger C4 bumps, and caps it: wafer-on-substrate.

None of it is novel physics. But one joint cracked by thermal cycling kills a body holding eight qualified HBM stacks and two of the most expensive logic dies ever made.

## Variants and trade-offs

| Family | Carrier | Ceiling | Used for |
|---|---|---|---|
| CoWoS-S | Full silicon interposer | 3.3x reticle, about 2,700 mm2 | H100-class parts |
| CoWoS-R | Organic RDL interposer | Above 3.3x reticle | Cost-sensitive, fewer HBM |
| CoWoS-L | RDL interposer with local silicon bridges | Reported up to 6x reticle | Blackwell, Rubin |

TSMC has run CoWoS in volume since 2012 ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)).

### 2.5D: silicon, RDL and bridges

CoWoS-S puts one slab of silicon under everything. It gives the finest wiring, but the interposer is a monolithic die whose yield falls as area grows. CoWoS-L replaces the slab with a redistribution layer carrying silicon bridges only where dense wiring is needed ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)). Intel's EMIB embeds the same bridge idea in the organic substrate instead, and is the one credible second source when CoWoS is tight.

Blackwell was the first product on CoWoS-L, and it went badly. Analysts traced the failures to expansion mismatch between the GPU chiplets, the bridges, the interposer and the substrate; Nvidia redesigned the GPU's top metal and bumps to recover yield ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)). Two years later TSMC mass-produces 5.5-reticle packages carrying 12 HBM3E or HBM4 stacks at yields over 98% ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

### 3D: SoIC, Foveros, X-Cube

TSMC's SoIC and Intel's Foveros bond dies face to face, copper pad to copper pad with no solder, taking interconnect pitch far below what microbumps allow. Heat decides the layout: the bottom die overheats and the top is hard to power, so many 3D designs put cache underneath rather than compute ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

### The escape routes

Panel-level packaging swaps the round wafer for a rectangular panel, wasting far less area; see Test and assembly. JEDEC published SPHBM4 on 13 July 2026: HBM4's DRAM on a base die carrying 512 data signals instead of 2,048, which relaxes bump pitch enough to mount HBM on a standard organic substrate ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)). If it works at volume it relieves the industry's most constrained process.

## Capacity and allocation

{{figure:cowos-capacity}}

TSMC ran about 35,000 CoWoS wafers a month in 2024 and a record 75,000 in 2025 ([source](https://www.trendforce.com/news/2025/01/02/news-tsmc-set-to-expand-cowos-capacity-to-record-75000-wafers-in-2025-doubling-2024-output/)). It is heading for 120,000 to 140,000 by the end of 2026, with OSAT partners adding another 50,000 to 60,000. That takes industry capacity toward 200,000 a month and narrows the supply gap from about 20% to about 10%. TSMC forecasts more than 80% CAGR from 2022 to 2027 ([source](https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/)).

Nvidia has reserved 800,000 to 850,000 of those wafers for 2026, more than half of TSMC's total ([source](https://www.trendforce.com/news/2026/08/05/news-tsmc-reportedly-expands-outsourcing-of-key-cowos-front-end-step-to-osats-amid-rising-nvidia-asic-demand/)). AMD and the custom-silicon programmes take the rest.

## Who makes it

{{figure:osat-share}}

Two industries share the word packaging. The 2.5D work for AI accelerators happens almost entirely inside TSMC's own backend fabs in Taiwan. Everything else goes to outsourced assembly and test firms; the top ten billed $41.56 billion in 2024, ASE alone $18.54 billion ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)).

The tools are a narrower chokepoint than the OSATs, and bonding is the narrowest.

- **Thermocompression bonding.** ASMPT's advanced packaging revenue reached $532.1 million in 2025, with TCB revenue up about 146%; it targets 35 to 40% of a market it puts at $1.6 billion by 2028 ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Hybrid bonding.** A two-supplier market: SK hynix's first mass-production order was one inline system pairing Applied Materials and Besi tools for about 20 billion won, or $15 million ([source](https://www.tomshardware.com/tech-industry/semiconductors/sk-hynix-says-hybrid-bonding-wont-be-ready-for-hbm4e-as-ai-memory-runs-into-a-775-micron-ceiling)).
- **Grinding and dicing.** Disco dominates the steps that thin wafers and singulate packages; see Test and assembly ([source](https://newsletter.semianalysis.com/p/disco-corporation-the-world-leader)).

TSMC's Arizona commitment reached $265 billion in July 2026, covering 10 fabs, two advanced packaging plants and an R&D centre ([source](https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/)). Amkor's $7 billion Peoria plant, with TSMC as its process partner, starts production in early 2028 ([source](https://www.trendforce.com/news/2025/10/14/news-amkor-breaks-ground-on-usd-7-billion-advanced-semiconductor-packaging-facility-in-arizona/)). Neither replaces Taiwan this decade.

## The chokepoint

China's back end is much stronger than its front end. JCET, Tongfu and HT-Tech together took about 25% of top-10 OSAT revenue in 2024 ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)). Packaging tools are less export-controlled than lithography, and chiplets on SMIC silicon plus domestic assembly is the most credible route around the restrictions Huawei faces. What China lacks is silicon-interposer 2.5D at volume with qualified HBM beside it.

TSMC's roadmap makes the chokepoint worse before it gets better.

- **2027.** A 9.5-reticle interposer supporting 12 HBM5 stacks on a 120 mm by 150 mm substrate ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **2028.** A 14-reticle interposer with 20 HBM5 modules and, we think, ten to twenty compute chiplets ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **2029.** More than 14 reticles with up to 24 HBM5E stacks, which at 12,020 mm2 is roughly the area of a compact disc ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

Optics arrive on the same platform. TSMC's COUPE stacks an electrical die on a photonic die with SoIC-X, targets volume production in 2026 and claims 5 to 10 times better power efficiency than pluggable modules ([source](https://www.trendforce.com/news/2026/04/01/news-silicon-photonics-race-intensifies-as-tsmc-targets-2026-coupe-production-samsung-eyes-2029-cpo-turnkey/)).

## Key evaluation criteria

- **Interposer area** — the ceiling on how much logic and memory fit. 3.3x reticle for CoWoS-S, 5.5x in production today ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)).
- **Package yield** — over 98% on 5.5-reticle CoWoS, after a much worse start on Blackwell ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **Warpage control** — the expansion mismatch that broke early CoWoS-L is the recurring failure mode as packages grow ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)).
- **HBM stacks supported** — 12 today, 20 planned for 2028, 24 for 2029 ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **Bonder throughput** — thermocompression and hybrid bonding are slow and serial, and three or four firms hold the tools ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Substrate size** — the 120 mm by 150 mm substrate planned for 2027 pushes the limits of ABF build-up film, see Substrates and PCBs ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

## Takeaways

Advanced packaging is the second great chokepoint after lithography, and unlike lithography it is a capacity problem, not a physics problem: the steps are known, there are not enough lines. CoWoS capacity roughly quadrupled between 2024 and 2026 and is still short, with Nvidia holding more than half of it. China can package chips but cannot build the 2.5D structures AI accelerators need, and the American alternatives do not start production until 2028.
