---json
{
  "id": "advanced-packaging",
  "number": 12,
  "title": "Advanced Packaging",
  "oneLiner": "Lithography stopped being the limit on chip size in 2022. Since then the limit has been how large an interposer TSMC can build, and how many of them per month.",
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
    "usStatus": "No domestic CoWoS at volume. Amkor is building a $2B packaging and test plant in Peoria with up to $407M of CHIPS funding, production from early 2028.",
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

A lithography scanner can print a rectangle 26 mm by 33 mm, or 858 mm2, in one exposure ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)). Every AI accelerator worth buying is larger than that. Packaging is how the industry escaped the reticle, and it is now the tightest physical constraint in the chain.

## How it works

Two forces push logic off a single die. The first is the reticle limit: past roughly 800 mm2 you cannot print the chip at all, so you cut it into chiplets and stitch them back together in the package. The second is HBM. A memory stack has a 1,024-bit or 2,048-bit interface, which cannot be routed through an ordinary organic substrate at those pitches. The memory has to sit millimetres from the logic on a shared silicon carrier.

That carrier is the interposer. In CoWoS, TSMC first builds a thin silicon wafer carrying only wiring and through-silicon vias, no transistors. Logic dies and HBM stacks are then bonded face down onto it with microbumps at around 30 to 40 micron pitch, and underfill is flowed into the gaps. That is the chip-on-wafer step. The populated interposer is diced out, attached to an organic build-up substrate with larger C4 bumps, molded, and capped with a stiffener and lid. That is the wafer-on-substrate step.

Nothing in the sequence is novel physics. The difficulty is that the pieces have different coefficients of thermal expansion, the assembly is heated and cooled repeatedly, and a package the size of a coaster will warp. Warpage cracks joints and opens circuits, and a single bad joint kills a package that already contains eight qualified HBM stacks and two of the most expensive logic dies ever made.

## Variants and trade-offs

| Family | Carrier | Ceiling | Used for |
|---|---|---|---|
| CoWoS-S | Full silicon interposer | 3.3x reticle, about 2,700 mm2 | H100-class parts |
| CoWoS-R | Organic RDL interposer | Above 3.3x reticle | Cost-sensitive, fewer HBM |
| CoWoS-L | RDL interposer with local silicon bridges | Reported up to 6x reticle | Blackwell, Rubin |

TSMC states that CoWoS-S accommodates interposers up to 3.3x reticle size and recommends CoWoS-L or CoWoS-R above that, and that the platform has been in volume production since 2012 ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)).

### 2.5D: silicon, RDL and bridges

CoWoS-S is the simple case: one large slab of silicon under everything. It gives the finest wiring but the interposer is a monolithic die subject to its own yield loss, and yield falls as area grows.

CoWoS-L replaces the slab with a redistribution layer carrying small local silicon interconnect bridges only where dense wiring is needed. That allows systems in package up to six times reticle size ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)).

Blackwell was the first product to use it, and it went badly. Analysts identified a CTE mismatch between the GPU chiplets, the LSI bridges, the RDL interposer and the substrate, which caused warpage and failure of the whole system in package, and Nvidia had to redesign the top metal layers and bumps of the GPU silicon to improve yields ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)). Bridge placement has to be precise enough to carry the 10 TB/s link between the two compute dies ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)).

Two years later the technology is mature. TSMC is mass-producing 5.5-reticle CoWoS packages carrying up to 12 HBM3E or HBM4 stacks at yields over 98% ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

Intel's EMIB is the same idea reached from the other direction, embedding a silicon bridge in the organic substrate rather than in an RDL layer, which makes it a credible second source when CoWoS supply is tight. Samsung's I-Cube is its silicon-interposer equivalent, and TSMC's InFO fan-out family covers the smaller packages where no interposer is needed at all.

### 3D: SoIC, Foveros, X-Cube

Stacking logic on logic is the vertical axis. TSMC's SoIC and Intel's Foveros bond dies face to face, and in their hybrid-bonding forms they join copper pads and oxide directly with no solder at all, which takes interconnect pitch far below what microbumps allow. TSMC frames AI compute scaling as the combination of advanced logic, SoIC 3D stacking and CoWoS ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)). The constraint is thermal: the bottom die overheats and the top die is hard to power, which is why many 3D designs put cache underneath rather than compute ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

### The escape routes

Two efforts aim to get off silicon interposers. Panel-level packaging replaces the round 300 mm wafer with a large rectangular panel, which wastes far less area on a package the size of a small plate; TSMC's CoPoS is the version to watch. Separately, JEDEC published SPHBM4 (JESD330-4) on 13 July 2026, which uses the same DRAM as HBM4 but a different base die that carries 512 data signals with 4:1 serialisation instead of 2,048, relaxing bump pitch enough to mount HBM on a standard organic substrate ([source](https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates)). If that works at volume it takes pressure off the single most constrained process in the industry.

## Capacity and allocation

{{figure:cowos-capacity}}

TSMC's CoWoS lines went from roughly 13,000 to 16,000 wafers per month at the end of 2023 to 35,000 to 40,000 at the end of 2024, about 75,000 in 2025 and 120,000 to 140,000 by the end of 2026 ([source](https://xenospectrum.com/en/cowos-packaging-bottleneck-nvidia/)). TrendForce reported the 2024 exit rate at 35,000 to 40,000 ([source](https://www.trendforce.com/news/2024/10/21/news-cowos-capacity-doubles-for-two-years-still-insufficient-positive-outlook-for-suppliers/)) and the 2025 target at a record 75,000, helped by the Innolux AP8 site and Taichung ([source](https://www.trendforce.com/news/2025/01/02/news-tsmc-set-to-expand-cowos-capacity-to-record-75000-wafers-in-2025-doubling-2024-output/)).

For 2026, TrendForce puts TSMC at 120,000 to 140,000 wafers per month with a further 50,000 to 60,000 from OSAT partners, taking industry capacity toward 200,000, and expects the supply-demand gap to narrow from about 20% to about 10% by year end. TSMC forecasts CoWoS capacity growing at more than 80% CAGR from 2022 to 2027 ([source](https://www.trendforce.com/news/2026/06/15/news-tsmc-cowos-supply-demand-gap-reportedly-seen-narrowing-from-20-to-10-by-end-2026-as-capacity-expands/)).

Allocation is the real story. Nvidia has booked more than half of TSMC's 2026 to 2027 CoWoS expansion ([source](https://www.digitimes.com/news/a20251210PD218/tsmc-cowos-capacity-nvidia-equipment.html)), and is estimated to hold around 60% of 2026 capacity, roughly 595,000 wafers across TSMC and its OSAT partners, on a Morgan Stanley estimate TSMC has not confirmed ([source](https://xenospectrum.com/en/cowos-packaging-bottleneck-nvidia/)). Everyone else, including AMD and the custom-silicon programmes, competes for what is left.

Public cost estimates for a finished CoWoS package are unreliable and none of the widely circulated per-unit figures traces to a primary source, so treat them with suspicion. What is documented is direction: TSMC's advanced packaging is growing faster than its foundry business, and the interposer is now large enough that its own yield materially affects the price of an accelerator.

## Who makes it

{{figure:osat-share}}

Two different industries share the word packaging. The 2.5D work for AI accelerators is done almost entirely inside TSMC's own advanced backend fabs in Taiwan. Everything else is done by outsourced assembly and test firms. In 2024 the top ten OSATs took $41.56 billion between them, with ASE at $18.54 billion or 44.6%, Amkor at $6.32 billion or 15.2%, JCET at $5.0 billion or 12.0%, Tongfu at 8.0% and Powertech at 5.5% ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)).

The tools are a narrower chokepoint than the OSATs. Bonding is where the concentration sits. ASMPT's advanced packaging revenue reached $532.1 million in 2025, up 30.2%, with thermocompression bonding revenue up about 146%; it puts the TCB market at $760 million in 2025 growing to $1.6 billion by 2028 and targets 35 to 40% of it ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)). Hybrid bonding is effectively a two-supplier market: SK hynix's first mass-production hybrid bonding order was a single inline system pairing Applied Materials and Besi tools for about 20 billion won, or $15 million ([source](https://www.tomshardware.com/tech-industry/semiconductors/sk-hynix-says-hybrid-bonding-wont-be-ready-for-hbm4e-as-ai-memory-runs-into-a-775-micron-ceiling)). Disco dominates the grinding and dicing steps that thin wafers and singulate packages, and Hanmi and Semes supply the Korean memory makers.

Geographically the chain is being stretched westward slowly and expensively. TSMC's Arizona commitment reached $265 billion in July 2026, covering 10 fabs, two advanced packaging facilities and an R&D centre ([source](https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/)). Amkor is building a $2 billion packaging and test plant on 104 acres in Peoria, Arizona with more than 2,000 jobs, up to $407 million of CHIPS funding and production from early 2028, with Apple as its first and largest customer and TSMC as its process partner ([source](https://www.manufacturingdive.com/news/amkor-relocates-2-billion-semiconductor-facility-larger-site-Peoria-Arizona/759238/)). Neither replaces Taiwan this decade.

## The chokepoint

China's back end is much stronger than its front end. JCET, Tongfu and HT-Tech together took about 25% of top-10 OSAT revenue in 2024 and were the fastest growers in the ranking, with JCET up 19.3% and HT-Tech up 26% ([source](https://www.trendforce.com/presscenter/news/20250513-12577.html)). Packaging tools are less export-controlled than lithography, and a chiplet strategy built on SMIC front-end silicon plus domestic assembly is the most credible route around the node restrictions Huawei faces. What China does not have is silicon-interposer 2.5D at volume with qualified HBM beside it.

The roadmap makes the chokepoint worse before it gets better. TSMC plans a 9.5-reticle interposer supporting 12 HBM5 stacks on a 120 mm by 150 mm substrate in 2027, a 14-reticle interposer carrying 20 3D-stacked compute chiplets and 20 HBM5 modules in 2028, and over 14 reticles with up to 24 HBM5E stacks in 2029, which at 12,020 mm2 is roughly the area of a compact disc ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)). Optics arrive at the same time: TSMC's COUPE platform stacks an electrical die on a photonic die using SoIC-X, targets volume production in 2026 with CoWoS-based co-packaged optics, and claims 5 to 10 times better power efficiency and 10 to 20 times lower latency than pluggable modules ([source](https://www.trendforce.com/news/2026/04/01/news-silicon-photonics-race-intensifies-as-tsmc-targets-2026-coupe-production-samsung-eyes-2029-cpo-turnkey/)).

## Key evaluation criteria

- **Interposer area** — the hard ceiling on how much logic and memory fit. 3.3x reticle for CoWoS-S, 5.5x in production today ([source](https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm)).
- **Package yield** — over 98% on 5.5-reticle CoWoS after two years of learning, against a much worse start on Blackwell ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **Warpage control** — the CTE mismatch that broke early CoWoS-L is the recurring failure mode as packages grow ([source](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/)).
- **HBM stacks supported** — 12 today, 20 planned for 2028, 24 for 2029 ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).
- **Bonder throughput** — thermocompression and hybrid bonding are slow and serial, and the tool market is held by three or four firms ([source](https://www.asmpt.com/en/investor-relations/news-events/asmpt-announces-2025-annual-results/)).
- **Substrate size** — a 120 mm by 150 mm substrate in 2027 pushes the limits of ABF build-up technology, covered in Substrates and PCBs ([source](https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump)).

## Takeaways

Advanced packaging is the second great chokepoint after lithography, and unlike lithography it is a capacity problem rather than a physics problem: the steps are known, there simply are not enough lines. TSMC's CoWoS capacity grew roughly ninefold in three years and is still short, with Nvidia holding more than half of the expansion. The technology is now the primary scaling engine, with interposers heading past 14 reticles and co-packaged optics arriving on the same platform. China can package chips but cannot yet build the 2.5D structures that AI accelerators need, and the American alternatives do not start production until 2028.
