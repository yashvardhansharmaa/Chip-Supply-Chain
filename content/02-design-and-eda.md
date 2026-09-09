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

Design is the only stage in this chain with no fab, no cleanroom and no hazardous gas. It is also the stage a foreign government can shut off fastest. In May 2025 the US Commerce Department wrote three letters and, for five weeks, every Chinese chip designer lost access to the software that turns a design into a manufacturable layout.

The whole stage costs a few hundred million dollars per chip. The equipment it feeds costs hundreds of billions. That asymmetry is why it matters.

## How it works

Designing a chip is like drawing the street plan of a city of billions of buildings, where every road has to be walkable in less than a billionth of a second. No one draws it by hand. The layout is generated, checked and signed off by software sold by three companies, and a foundry will only accept a design that has passed their particular tools. Once the plan goes to the factory, changing one street costs a new set of printing plates and several months. That is why cutting off the software cuts off the chip.

An AI accelerator design runs through five phases.

- **Architecture.** Engineers fix the shape of the machine: how wide the matrix-multiply unit is, how much SRAM sits beside it, how many HBM stacks hang off the edges, and how the on-die network moves activations. Most of the die is one tile repeated, and Google's TPU v7 Ironwood is two TensorCores with 256x256 multiply units plus four SparseCores ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).
- **RTL.** The architecture is written as register-transfer-level code in SystemVerilog, describing what every register holds on every clock edge.
- **Verification.** The largest headcount line in most projects. Simulation catches ordinary bugs, formal methods prove properties exhaustively over small blocks, and hardware emulators run the whole design fast enough to boot real firmware and real models before silicon exists.
- **Physical design.** Synthesis maps the code onto standard cells from the foundry's library, then floorplanning, placement, clock tree synthesis, routing and timing closure, then signoff: parasitic extraction, static timing analysis, power and IR-drop analysis, and design-rule checks.
- **Tape-out.** The layout goes through mask data preparation and optical proximity correction, and the resulting pattern files go to the foundry to be written into a mask set. After that, changing anything costs a new mask and a new lot.

The headline cost numbers are contested. IBS puts a 7 nm design at $257 million, a 5 nm design at $479 million and a 3 nm design at $585 million ([source](https://siliconanalysts.com/market-data/nre-design-cost)). Practitioners argue those figures run high: IBS's own 16/14 nm estimate fell from about $310 million to about $106 million between its 2014 and 2018 charts, and discounting the later numbers by a similar factor puts a 5 nm design nearer $280 million and a 7 nm design nearer $160 million ([source](https://semiengineering.com/what-will-that-chip-cost/)). Treat the IBS series as an upper bound, and the shape of the curve rather than its level as the reliable part.

{{figure:design-cost}}

## Variants and trade-offs

### Merchant GPU versus custom ASIC

A merchant part like Nvidia's Blackwell is designed once and amortised across every buyer, which is why it carries the software ecosystem and the resale value. A custom accelerator is narrower and cheaper to run on the workload it was built for. Google claims total cost of ownership per Ironwood chip is about 44% below a GB200 server on its own procurement, and Microsoft claims Maia 200 delivers 30% better performance per dollar than the best hardware already in its fleet ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). The trade is capability breadth against unit economics, and it only pays above a certain deployed volume.

### The EDA flow

There are three complete flows in the world and they are not interchangeable. A design team commits to one vendor's synthesis, place-and-route and signoff chain because the foundry certifies reference flows against specific tool versions, and because timing signed off in one tool is not accepted in another. The lock-in is tighter inside segments than the headline share suggests: Synopsys holds more than 90% of static timing analysis and 84-85% of synthesis, Siemens EDA more than 85% of physical verification with Calibre, and Cadence 55-60% of hardware emulation with Palladium ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:tool-lock}}

### Buy the IP or build it

No one writes an accelerator from scratch. The CPU cores, the PCIe and Ethernet controllers, the memory controllers and the physical-layer blocks that drive HBM are licensed. Arm supplies most of the CPU side, reporting $4.92 billion of revenue and $2.61 billion of royalties in fiscal 2026 and saying its architectures account for roughly 50% of CPU compute among the top hyperscalers ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)). Synopsys and Cadence sell the interface IP, and an HBM PHY is among the hardest blocks to get right because it must close timing across thousands of microbumps into a stacked memory die.

RISC-V is the open alternative, and on AI silicon it is mostly the housekeeping core scattered across the die rather than the main compute core. Nvidia has said it now uses RISC-V microcontrollers in all of its GPUs, and one forecast puts AI accelerators at roughly $222 billion of a $318 billion RISC-V chip market by 2031, close to 70% of the revenue ([source](https://riscv.org/blog/shd-forecast-2026/)).

### Chiplets

Reticle limits ended the single-die accelerator. Modern parts are chiplets joined by a die-to-die link, and UCIe is the standard that lets those links come from different vendors. UCIe 3.0 adds 48 GT/s and 64 GT/s data rates ([source](https://www.uciexpress.org/specifications)). Broadcom's 3.5D XDSiP platform pushes this furthest, supporting packages of more than 6,000 mm2 of silicon with up to twelve HBM stacks ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). See Advanced packaging for what happens to those pieces next.

## Who makes it

The EDA and design IP market was about $18 billion in 2025. Synopsys booked roughly $8 billion including Ansys, Cadence $5.30 billion and Siemens EDA an estimated $2.2 to $2.5 billion, together more than 85% of the market, with no other vendor above 5% in any core category ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:eda-share}}

Design services are more concentrated still. Broadcom and Marvell hold roughly 95% of the custom AI ASIC co-design market ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). Broadcom reported $16.7 billion of AI semiconductor revenue in its third quarter of fiscal 2026, with custom XPUs making up 73% of it ([source](https://finance.yahoo.com/technology/ai/articles/broadcom-q3-earnings-call-highlights-230318650.html)). Marvell projects up to $11 billion of AI ASIC revenue in 2026 ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).

| Chip | Owner | Design partner | Process |
|---|---|---|---|
| TPU v7 Ironwood | Google | Broadcom and MediaTek | TSMC N3P |
| MTIA 300 series | Meta | Broadcom | TSMC 3 nm |
| Trainium3 | AWS (Annapurna Labs) | Marvell, Alchip | TSMC 3 nm |
| Maia 200 | Microsoft | Marvell | TSMC 3 nm |
| Custom accelerator | OpenAI | Broadcom | 3 nm and 2 nm |

Design partners and processes per Tom's Hardware, May 2026 ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).

Below the top two sit the Taiwanese design service firms that take a hyperscaler's netlist to tape-out on TSMC's newest nodes. Alchip reported $992 million of revenue in 2025 ([source](https://www.alchip.com/en/Investors/financials/)). Global Unichip and MediaTek play the same role, with MediaTek co-developing Ironwood alongside Broadcom ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).

## Where the designers sit

- **United States.** Architecture and program ownership, at Nvidia, AMD, Broadcom, Marvell and the hyperscalers' own silicon groups.
- **Israel.** AWS's entire custom silicon line runs out of Annapurna Labs, the design house Amazon bought in 2015 ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)).
- **India.** The largest pool of implementation and verification engineers, roughly 125,000 of them, close to 20% of the global design workforce and second only to the United States ([source](https://www.semiconhunt.com/article/india-employs-20-percent-global-chip-design-workforce-125000-engineers/)).
- **Taiwan.** The physical implementation and tape-out layer, next to the foundry.
- **China.** Deep architecture talent at Huawei's HiSilicon and Cambricon, cut off from the newest process nodes.

## The chokepoint

In late May 2025 the Bureau of Industry and Security ordered Synopsys, Cadence and Siemens EDA to halt exports of design tools and services to China ([source](https://www.design-reuse.com/news/202528998-synopsys-cadence-and-siemens-resume-eda-supply-to-china/)). Synopsys received its letter on 29 May 2025, and on 2 July 2025 received a further letter rescinding the restriction with immediate effect ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525155294/d80081d8k.htm)). All three vendors resumed supply within days, after June trade talks in which Washington agreed to ease technology restrictions ([source](https://www.design-reuse.com/news/202528998-synopsys-cadence-and-siemens-resume-eda-supply-to-china/)). The restriction lasted about five weeks.

Two things follow. The lever works: it needs no allied coordination, no shipping interdiction and no lead time. It was also expensive to pull, because it was reversible only by giving something up, and because it accelerates exactly the substitution it was meant to prevent. Synopsys's China revenue fell from 16% of the total in fiscal 2024 to 12% in fiscal 2025, and Cadence has guided China to 12-13% of fiscal 2026 revenue ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

China's domestic answer is real but partial. Empyrean holds about half of the domestic market among more than 100 Chinese EDA firms, and is the only Chinese company industry analysts place in the global second tier, while the three leaders hold roughly 80% of the global market ([source](https://www.scmp.com/tech/article/3315237/chinas-top-player-empyrean-eyes-opportunities-us-chip-curbs-design-software)). Primarius covers device modelling and circuit simulation; Semitronix covers yield and test-chip analysis. Together they cover point tools and mature nodes well. What none of them has is a certified, complete digital flow for a 5 nm-class accelerator, and that gap is measured in foundry-validated corner cases rather than in features.

So the answer on China is narrow. It can architect an accelerator: Huawei's Ascend 910C targets 600,000 units in 2026 and Cambricon plans to triple output to 500,000 chips ([source](https://www.tomshardware.com/tech-industry/semiconductors/custom-ai-asics-examined-from-broadcom-to-mtia)). What it cannot do is design at the leading edge without foreign tools, or manufacture what it designs without foreign equipment. Design is the link where China is closest to independence and still not there.

## Key evaluation criteria

- **Flow completeness.** The number of steps a vendor covers from RTL to signoff. Point tools are replaceable; a signed-off flow is not.
- **Foundry certification.** Whether the foundry has validated the tool version against its own reference flow and process design kit. Without this, timing signoff is not accepted.
- **Verification throughput.** Simulation cycles and emulator capacity per day, which sets schedule more than any other input on a large accelerator.
- **IP availability at node.** Whether the CPU, SerDes, PCIe and HBM PHY blocks exist and are silicon-proven on the target process.
- **Design services depth.** Whether a partner can take a netlist to tape-out on the newest node, which is what separates Broadcom, Marvell, Alchip and GUC from the rest.
- **Legal exposure.** The share of the flow that is US-origin technology and therefore subject to export licensing.

## Takeaways

Three vendors sell every complete design flow used at the leading edge, and their grip is tighter inside individual segments than the headline 85% suggests ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Design is cheap relative to what it commits: a few hundred million dollars of engineering directs tens of billions of dollars of fab, memory and packaging capacity ([source](https://siliconanalysts.com/market-data/nre-design-cost)). It is the fastest lever a government can pull and the one China is closest to neutralising, but closest is not close. And a growing share of the world's accelerators are no longer designed by the company whose name is on them, but by Broadcom, Marvell and a small group of Taiwanese design service firms.
