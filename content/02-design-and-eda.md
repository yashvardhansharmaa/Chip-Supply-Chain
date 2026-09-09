---json
{
  "id": "design-and-eda",
  "number": 2,
  "title": "Chip Design, EDA and IP",
  "oneLiner": "The cheapest stage in the chain by capital and one of the most concentrated by vendor. Three software firms sell the tools that every leading-edge AI accelerator passes through.",
  "plain": "Designing a chip is like drawing the street plan of a city of billions of buildings, where every road has to be walkable in less than a billionth of a second. No one draws it by hand. The layout is generated, checked and signed off by software sold by three companies, and a foundry will only accept a design that has passed their particular tools. Once the plan goes to the factory, changing one street costs a new set of printing plates and several months. That is why cutting off the software cuts off the chip.",
  "specimen": "die-floorplan",
  "specimenCaption": "Right: the floorplan of a GPU die. Replicated compute tiles fill the centre, SRAM banks sit between them, HBM PHYs run along the two long edges, and the die-to-die interface faces the neighbouring chiplet.",
  "card": {
    "concentration": "Extreme",
    "chokepointScore": 4,
    "leaders": [
      {"name": "Synopsys", "country": "US", "share": "$8B revenue in 2025 including Ansys; 90%+ of static timing"},
      {"name": "Cadence", "country": "US", "share": "$5.30B revenue in 2025; 55-60% of hardware emulation"},
      {"name": "Siemens EDA", "country": "DE", "share": "$2.2-2.5B revenue in 2025; 85%+ of physical verification"},
      {"name": "Arm", "country": "GB", "share": "~50% of CPU compute among top hyperscalers, FYE26"},
      {"name": "Broadcom", "country": "US", "share": "With Marvell, ~95% of custom AI ASIC co-design"}
    ],
    "countries": [
      {"code": "US", "note": "Synopsys, Cadence, Broadcom, Marvell, Nvidia, AMD; Siemens EDA's main sites"},
      {"code": "GB", "note": "Arm CPU and interconnect IP, Cambridge"},
      {"code": "TW", "note": "Alchip, Global Unichip, MediaTek design services and tape-out"},
      {"code": "IL", "note": "Annapurna Labs, the AWS design house behind Trainium and Graviton"},
      {"code": "IN", "note": "~125,000 chip design engineers, roughly 20% of the global design workforce"}
    ],
    "chinaStatus": "Can design competitive accelerators. Cannot yet run a complete leading-edge digital flow on domestic EDA tools; Empyrean is the strongest local vendor and sits in the global second tier. Access to US and German tools was cut off for five weeks in 2025 and restored.",
    "usStatus": "Owns the two largest EDA vendors and the dominant ASIC design houses, and controls Siemens EDA's US-origin technology through export licensing. This is the fastest-acting lever in the entire chain.",
    "costSignal": "IBS estimates ~$585M to design one 3 nm chip; practitioners argue the real figure is roughly half",
    "substitution": {"years": "5-10", "why": "Replacing one point tool is feasible. Replacing a signed-off flow means rebuilding foundry-certified reference flows, timing and extraction models, and twenty years of accumulated corner cases."}
  },
  "keyFacts": [
    {"fact": "The EDA and design IP market was about $18B in 2025, with Synopsys, Cadence and Siemens EDA holding over 85%", "source": "https://newsletter.semianalysis.com/p/eda-market-primer"},
    {"fact": "IBS estimates a 3 nm design at $585M, a 5 nm design at $479M and a 7 nm design at $257M", "source": "https://siliconanalysts.com/market-data/nre-design-cost"},
    {"fact": "BIS restricted EDA sales to China by letter received 29 May 2025 and rescinded it on 2 July 2025", "source": "https://www.sec.gov/Archives/edgar/data/883241/000119312525155294/d80081d8k.htm"},
    {"fact": "Arm reported $4.92B revenue and $2.61B of royalty revenue in fiscal 2026", "source": "https://newsroom.arm.com/news/arm-q4-fye26-results"},
    {"fact": "Broadcom booked $16.7B of AI semiconductor revenue in Q3 FY2026, of which XPUs were 73%", "source": "https://finance.yahoo.com/technology/ai/articles/broadcom-q3-earnings-call-highlights-230318650.html"},
    {"fact": "Broadcom and Marvell together hold roughly 95% of the custom AI ASIC co-design market", "source": "https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia"},
    {"fact": "Alchip reported $992M of revenue in 2025", "source": "https://www.alchip.com/en/Investors/financials/"},
    {"fact": "UCIe 3.0 adds 48 GT/s and 64 GT/s die-to-die data rates", "source": "https://www.uciexpress.org/specifications"}
  ],
  "figures": [
    {
      "id": "eda-share",
      "type": "stack",
      "title": "EDA and design IP revenue share, 2025. Synopsys includes Ansys",
      "unit": "%",
      "data": [["Synopsys", 44], ["Cadence", 29], ["Siemens EDA", 13], ["All others", 14]],
      "source": {"label": "SemiAnalysis, EDA Market Primer, May 2026", "url": "https://newsletter.semianalysis.com/p/eda-market-primer"}
    },
    {
      "id": "design-cost",
      "type": "bars",
      "title": "IBS estimate of the cost to design one leading-edge chip ($M). 7 nm figure is 2022, 5 nm and 3 nm are 2023",
      "unit": "$M",
      "data": [["7 nm", 257], ["5 nm", 479], ["3 nm", 585]],
      "source": {"label": "IBS via Silicon Analysts NRE design cost dataset", "url": "https://siliconanalysts.com/market-data/nre-design-cost"}
    },
    {
      "id": "tool-lock",
      "type": "bars",
      "title": "Leading vendor's share of its own EDA segment, 2025",
      "unit": "%",
      "data": [["Static timing (Synopsys PrimeTime)", 90], ["Physical verification (Siemens Calibre)", 85], ["Synthesis (Synopsys Design Compiler)", 85], ["Emulation (Cadence Palladium)", 58]],
      "source": {"label": "SemiAnalysis, EDA Market Primer, May 2026", "url": "https://newsletter.semianalysis.com/p/eda-market-primer"}
    }
  ]
}
---
# Chip Design, EDA and IP

Design is the only stage in this chain with no fab, no cleanroom and no hazardous gas. It is also the stage a foreign government can shut off fastest: in May 2025 the US Commerce Department wrote three letters and, for five weeks, every Chinese chip designer lost the software that turns a design into something a factory can print.

## How it works

Designing a chip is like drawing the street plan of a city of billions of buildings, where every road has to be walkable in less than a billionth of a second. No one draws it by hand. The layout is generated, checked and signed off by software sold by three companies, and a foundry will only accept a design that has passed their particular tools. Once the plan goes to the factory, changing one street costs a new set of printing plates and several months. That is why cutting off the software cuts off the chip.

An AI accelerator design runs through five phases.

- **Architecture.** Engineers fix the shape of the machine: the width of the matrix-multiply unit, the SRAM beside it, the number of HBM stacks on the edges. Most of the die is one tile repeated.
- **RTL.** The design is written as register-transfer-level code in SystemVerilog, fixing what every register holds on every clock edge.
- **Verification.** The largest headcount line in most projects: simulation, formal proofs over small blocks, and emulators that boot real firmware before silicon exists.
- **Physical design.** Synthesis maps the code onto the foundry's standard cells, then placement, clock trees, routing, timing closure and signoff.
- **Tape-out.** Mask data preparation and optical proximity correction turn the layout into pattern files for the mask shop. Changing anything after that costs a new mask and a new lot.

The cost numbers are contested. IBS puts a 7 nm design at $257 million, a 5 nm design at $479 million and a 3 nm design at $585 million ([source](https://siliconanalysts.com/market-data/nre-design-cost)). Practitioners say those run high by roughly a factor of two ([source](https://semiengineering.com/what-will-that-chip-cost/)). Trust the shape of the curve, not the level.

{{figure:design-cost}}

## Variants and trade-offs

### Merchant GPU versus custom ASIC

A merchant part like Nvidia's Blackwell is designed once and amortised across every buyer, which buys the software ecosystem and the resale value. A custom accelerator is narrower and cheaper on the workload it was built for: Google claims about 44% lower total cost of ownership per Ironwood chip than a GB200 server ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). It only pays above a certain deployed volume.

### The EDA flow

Three complete flows exist and they are not interchangeable. A team commits to one vendor's chain because the foundry certifies reference flows against specific tool versions, and timing signed off in one tool is not accepted in another. The grip is tighter inside segments than the headline share suggests: Synopsys holds more than 90% of static timing and 84-85% of synthesis, Siemens EDA more than 85% of physical verification with Calibre, and Cadence 55-60% of emulation with Palladium ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:tool-lock}}

### Buy the IP or build it

No one writes an accelerator from scratch. CPU cores, interface controllers and the physical-layer blocks that drive HBM are licensed. Arm supplies most of the CPU side, reporting $4.92 billion of revenue and $2.61 billion of royalties in fiscal 2026 and roughly 50% of CPU compute among the top hyperscalers ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)). The HBM PHY, sold by Synopsys or Cadence, is the hardest of these blocks: it must close timing across thousands of microbumps into a stacked memory die. RISC-V, the open alternative, is mostly the housekeeping core scattered across an accelerator die; Nvidia says it now uses RISC-V microcontrollers in all of its GPUs ([source](https://riscv.org/blog/shd-forecast-2026/)).

### Chiplets

Reticle limits ended the single-die accelerator. Modern parts are chiplets joined by a die-to-die link, and UCIe lets those links come from different vendors; UCIe 3.0 adds 48 GT/s and 64 GT/s data rates ([source](https://www.uciexpress.org/specifications)). Broadcom's 3.5D XDSiP carries this furthest, with packages of more than 6,000 mm2 of silicon ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). See Advanced packaging.

## Who makes it

The EDA and design IP market was about $18 billion in 2025: Synopsys roughly $8 billion including Ansys, Cadence $5.30 billion and Siemens EDA an estimated $2.2 to $2.5 billion, together more than 85% of it, and no other vendor above 5% in any core category ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:eda-share}}

Design services are more concentrated still: Broadcom and Marvell hold roughly 95% of custom AI ASIC co-design ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). Broadcom booked $16.7 billion of AI semiconductor revenue in the third quarter of fiscal 2026, 73% of it custom XPUs ([source](https://finance.yahoo.com/technology/ai/articles/broadcom-q3-earnings-call-highlights-230318650.html)); Marvell projects up to $11 billion in 2026 ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). Below them sit the Taiwanese firms that take a netlist to tape-out on TSMC's newest nodes; Alchip alone reported $992 million of revenue in 2025 ([source](https://www.alchip.com/en/Investors/financials/)).

| Chip | Owner | Design partner | Process |
|---|---|---|---|
| TPU v7 Ironwood | Google | Broadcom and MediaTek | TSMC N3P |
| MTIA 300 series | Meta | Broadcom | TSMC 3 nm |
| Trainium3 | AWS (Annapurna Labs) | Marvell, Alchip | TSMC 3 nm |
| Maia 200 | Microsoft | Marvell | TSMC 3 nm |
| Custom accelerator | OpenAI | Broadcom | 3 nm and 2 nm |

Design partners and processes per Tom's Hardware, May 2026 ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).

## Where the designers sit

- **United States.** Architecture and program ownership: Nvidia, AMD, Broadcom, Marvell and the hyperscalers' silicon groups.
- **Israel.** Annapurna Labs, bought by Amazon in 2015, designs all of AWS's silicon ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).
- **India.** Roughly 125,000 chip design engineers, about 20% of the global total ([source](https://www.semiconhunt.com/article/india-employs-20-percent-global-chip-design-workforce-125000-engineers/)).
- **China.** Architecture talent at HiSilicon and Cambricon, cut off from the newest nodes.

## The chokepoint

In late May 2025 the Bureau of Industry and Security ordered Synopsys, Cadence and Siemens EDA to halt exports of design tools and services to China ([source](https://www.design-reuse.com/news/202528998-synopsys-cadence-and-siemens-resume-eda-supply-to-china/)). Synopsys got its letter on 29 May 2025 and a rescinding letter on 2 July 2025, after June trade talks in which Washington agreed to ease technology restrictions ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525155294/d80081d8k.htm)) ([source](https://www.design-reuse.com/news/202528998-synopsys-cadence-and-siemens-resume-eda-supply-to-china/)). The cut-off lasted five weeks.

Two things follow. The lever works, needing no allied coordination and no lead time. It is also expensive to pull, because it accelerates the substitution it was meant to prevent: Synopsys's China revenue fell from 16% of the total in fiscal 2024 to 12% in fiscal 2025 ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

China's domestic answer is real but partial. Empyrean holds about half the domestic market among more than 100 Chinese EDA firms and is the only Chinese vendor analysts place in the global second tier ([source](https://www.scmp.com/tech/article/3315237/chinas-top-player-empyrean-eyes-opportunities-us-chip-curbs-design-software)). None has a certified, complete digital flow for a 5 nm-class accelerator, and that gap is measured in foundry-validated corner cases rather than features.

So China's position is narrow. It can architect an accelerator: Huawei's Ascend 910C targets 600,000 units in 2026 and Cambricon plans to triple output to 500,000 chips ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). It cannot design at the leading edge without foreign tools, or build what it designs without foreign equipment.

## Key evaluation criteria

- **Flow completeness.** How many steps a vendor covers from RTL to signoff. A point tool is replaceable; a signed-off flow is not.
- **Foundry certification.** Whether the foundry has validated that tool version against its own reference flow and process design kit. Without it, signoff is not accepted.
- **Verification throughput.** Simulation cycles and emulator capacity per day, which sets schedule more than any other input.
- **IP availability at node.** Whether the CPU, SerDes, PCIe and HBM PHY blocks are silicon-proven on that process.
- **Design services depth.** Whether a partner can take a netlist to tape-out on the newest node.
- **Legal exposure.** The share of the flow that is US-origin technology, and therefore subject to export licensing.

## Takeaways

Three vendors sell every complete design flow used at the leading edge, and their grip is tighter inside segments than the headline 85% suggests ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Design is cheap relative to what it commits: a few hundred million dollars of engineering directs tens of billions of dollars of capacity ([source](https://siliconanalysts.com/market-data/nre-design-cost)). It is the fastest lever a government can pull and the one China is closest to neutralising, but closest is not close. And a growing share of the world's accelerators are designed not by the company whose name is on them but by Broadcom, Marvell and a few Taiwanese design houses.
