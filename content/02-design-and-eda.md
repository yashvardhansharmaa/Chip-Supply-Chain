---json
{
  "id": "design-and-eda",
  "number": 2,
  "title": "Chip Design, EDA and IP",
  "oneLiner": "The cheapest stage in the chain by capital and one of the most concentrated by vendor. Three software firms sell the tools that every leading-edge AI accelerator passes through.",
  "plain": "Designing a chip is like drawing the street plan of a city of billions of buildings, where every road has to be walkable in less than a billionth of a second. No one draws it by hand. The layout is generated, checked and signed off by software sold by three companies, and a foundry will only accept a design that has passed their particular tools. Once the plan goes to the factory, changing one street costs a new set of printing plates and several months. Withhold the software and the design cannot be manufactured.",
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
      {"name": "Broadcom", "country": "US", "share": "$16.7B of AI semiconductor revenue in Q3 FY2026"}
    ],
    "countries": [
      {"code": "US", "note": "Synopsys, Cadence, Broadcom, Marvell, Nvidia, AMD; Siemens EDA's main sites"},
      {"code": "GB", "note": "Arm CPU and interconnect IP, Cambridge"},
      {"code": "TW", "note": "Alchip, Global Unichip, MediaTek design services and tape-out"},
      {"code": "IL", "note": "Annapurna Labs, the AWS design house behind Trainium and Graviton"},
      {"code": "IN", "note": "Nearly 20% of the world's chip design engineers, on the Indian government's count"}
    ],
    "chinaStatus": "Can design competitive accelerators. Cannot yet run a complete leading-edge digital flow on domestic EDA tools, and CSET judges that Chinese EDA firms cannot support designs at those nodes. Access to US and German tools was cut off for five weeks in 2025 and restored.",
    "usStatus": "Owns the two largest EDA vendors and the dominant ASIC design houses, and controls Siemens EDA's US-origin technology through export licensing. This is the fastest-acting lever in the entire chain.",
    "costSignal": "A 3 nm photomask set runs about $40M, and startups have taken a 7 nm design all the way to tape-out for $50-75M",
    "substitution": {"years": "5-10", "why": "Replacing one point tool is feasible. Replacing a signed-off flow means rebuilding foundry-certified reference flows, timing and extraction models, and twenty years of accumulated corner cases."}
  },
  "keyFacts": [
    {"fact": "The EDA and design IP market was about $18B in 2025, with Synopsys, Cadence and Siemens EDA holding over 85%", "source": "https://newsletter.semianalysis.com/p/eda-market-primer"},
    {"fact": "A photomask set costs over $1M at 28 nm, over $10M at 7 nm and about $40M at 3 nm; startups have built leading-edge 7 nm chips end to end for $50-75M", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
    {"fact": "BIS restricted EDA sales to China by letters received 23 and 29 May 2025 and rescinded them on 2 July 2025", "source": "https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm"},
    {"fact": "Arm reported $4.92B revenue and $2.61B of royalty revenue in fiscal 2026", "source": "https://newsroom.arm.com/news/arm-q4-fye26-results"},
    {"fact": "Broadcom booked $16.7B of AI semiconductor revenue in Q3 FY2026, up 221% year on year", "source": "https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm"},
    {"fact": "OpenAI and Broadcom announced a collaboration to deploy 10 gigawatts of OpenAI-designed AI accelerators", "source": "https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10"},
    {"fact": "Broadcom's 3.5D XDSiP packages more than 6,000 mm2 of silicon and 12 HBM stacks in one device", "source": "https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology"},
    {"fact": "Alchip reported $992M of revenue in 2025", "source": "https://www.alchip.com/en/Investors/financials/"},
    {"fact": "UCIe 3.0 adds 48 GT/s and 64 GT/s die-to-die data rates", "source": "https://www.uciexpress.org/specifications"},
    {"fact": "India is home to nearly 20% of the world's chip design engineers", "source": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393"}
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
      "id": "mask-cost",
      "type": "bars",
      "title": "What one photomask set costs, by node ($M). The 28 nm and 7 nm figures are floors",
      "unit": "$M",
      "data": [["28 nm", 1], ["7 nm", 10], ["3 nm", 40]],
      "source": {"label": "SemiAnalysis, The Dark Side of the Semiconductor Design Renaissance, July 2022", "url": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"}
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

Design is the only stage in this chain with no factory. It is also the one a foreign government can shut off fastest, and in 2025 one did: for five weeks, every Chinese chip designer lost the software that turns a design into something a factory can print.

## How it works

Designing a chip is like drawing the street plan of a city of billions of buildings, where every road has to be walkable in less than a billionth of a second. No one draws it by hand. The layout is generated, checked and signed off by software sold by three companies, and a foundry will only accept a design that has passed their particular tools. Once the plan goes to the factory, changing one street costs a new set of printing plates and several months. Withhold the software and the design cannot be manufactured.

A design starts as an architecture and ends as pattern files for the mask shop.

- **Architecture.** Engineers fix the machine's shape: the matrix-multiply unit's width, the SRAM beside it, the HBM stacks on the edges.
- **RTL.** Register-transfer-level code in SystemVerilog fixes what every register holds on every clock edge.
- **Verification.** The largest headcount line in most projects: simulation, formal proofs, and emulators that boot firmware before silicon exists.
- **Physical design.** Synthesis maps the code onto the foundry's standard cells, then placement, routing, timing closure and signoff.
- **Tape-out.** Mask data preparation and optical proximity correction turn the layout into pattern files for the mask shop.

The licence fee is not what disciplines the work; a mistake costs a mask set. A photomask set passes $1 million at 28 nm, $10 million at 7 nm and about $40 million at 3 nm, and a whole leading-edge chip has gone from design to tape-out on TSMC 7 nm for $50 million to $75 million, everything included ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

{{figure:mask-cost}}

## Variants and trade-offs

### Merchant GPU versus custom ASIC

Nvidia designs Blackwell once and sells it to everyone, which buys the customer software and resale value. A custom accelerator is narrower and tuned to the workload it was built for. Google's seventh-generation TPU, Ironwood, carries 192 GB of memory per chip, six times its predecessor's, and delivers twice the performance per watt ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/)).

### The EDA flow

Three complete flows exist, and they do not mix. A team commits to one vendor's chain because the foundry certifies reference flows against specific tool versions, and timing signed off in one tool is not accepted in another. Inside each segment the grip is tighter still: Synopsys alone holds more than 90% of static timing ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:tool-lock}}

### Buy the IP or build it

No one writes an accelerator from scratch: CPU cores, interface controllers and the blocks that drive HBM are licensed. Arm supplies most of the CPU side, with $4.92 billion of revenue, $2.61 billion of royalties and roughly 50% of CPU compute among the top hyperscalers in fiscal 2026 ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)). The HBM PHY is the hardest block to buy: it must close timing across thousands of microbumps into a stacked memory die. RISC-V is the housekeeping core, and Nvidia now uses it in every GPU ([source](https://riscv.org/blog/shd-forecast-2026/)).

### Chiplets

Reticle limits ended the single-die accelerator. Modern parts are chiplets joined by a die-to-die link, and UCIe lets those links come from different vendors: version 3.0 adds 48 and 64 GT/s data rates ([source](https://www.uciexpress.org/specifications)). Broadcom's 3.5D XDSiP goes furthest, packing more than 6,000 mm2 of silicon and 12 HBM stacks into one package ([source](https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology)).

## Who makes it

The EDA and design IP market was about $18 billion in 2025, and Synopsys, Cadence and Siemens EDA took more than 85% of it, with no other vendor above 5% in any core category ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:eda-share}}

Design services are narrower again, and Broadcom is the name on most of the deals. It booked $16.7 billion of AI semiconductor revenue in the third quarter of fiscal 2026, up 221% ([source](https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm)). Its customers no longer hide the arrangement. In October 2025 OpenAI and Broadcom said they would deploy 10 gigawatts of OpenAI-designed accelerators, with Broadcom supplying the silicon implementation and the Ethernet around it ([source](https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10)). In April 2026 Broadcom extended its Meta partnership to multiple gigawatts of MTIA and the first 2 nm AI accelerator ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-extended-partnership-meta-deploy-technology)).

Below Broadcom and Marvell sit the Taiwanese houses that take a netlist to tape-out on TSMC's newest nodes; Alchip reported $992 million of revenue in 2025 ([source](https://www.alchip.com/en/Investors/financials/)). The engineers are spread wider than the firms: India alone holds nearly 20% of the world's chip designers ([source](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393)).

## The chokepoint

In late May 2025 the Bureau of Industry and Security told the EDA vendors to stop selling to China. Cadence got its letter on 23 May: exporting design software classified 3D991 and 3E991 to any party in China, or to a Chinese military end user anywhere, now needed a licence ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Synopsys got its letter on 29 May and a rescinding letter on 2 July, after trade talks in which Washington eased technology restrictions ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525155294/d80081d8k.htm)).

The lever needs no allied coordination and no lead time. It is also expensive: it speeds the substitution it was meant to prevent, and Synopsys's China revenue fell from 16% of the total in fiscal 2024 to 12% in fiscal 2025 ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

China's answer is real but partial. CSET puts it flatly: Chinese designers rely on US tools for all their chip designs, US firms are the only ones selling the full-spectrum software a leading-edge chip needs, and Chinese EDA firms cannot yet support designs at those nodes ([source](https://cset.georgetown.edu/article/semiconductors-more-u-s-leverage-more-bad-news-for-beijing-part-3/)). No domestic vendor has a certified, complete digital flow for a 5 nm-class accelerator, and the gap is in foundry-validated corner cases rather than in features.

China can architect an accelerator. It cannot design one at the leading edge without foreign tools, or build what it designs without foreign equipment: SMIC's 7 nm capacity is tight enough that Huawei has to choose between its phone chips and its AI chips ([source](https://cset.georgetown.edu/publication/pushing-the-limits-huaweis-ai-chip-tests-u-s-export-controls/)).

## Key evaluation criteria

- **Flow completeness.** How many steps a vendor covers from RTL to signoff.
- **Foundry certification.** Whether the foundry has validated that tool version against its reference flow and process design kit. Without it, signoff is refused.
- **Verification throughput.** Simulation cycles and emulator capacity per day, which sets schedule more than anything else.
- **IP availability at node.** Whether the CPU, SerDes, PCIe and HBM PHY blocks are silicon-proven on that process.
- **Design services depth.** Whether a partner can take a netlist to tape-out on the newest node.
- **Legal exposure.** How much of the flow is US-origin technology, and so subject to export licensing.

## Takeaways

Three vendors sell every complete design flow used at the leading edge ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Design is cheap next to what it commits: tens of millions of dollars of engineering and masks direct tens of billions of fab capacity ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). It is the fastest lever a government can pull, and the one China is closest to neutralising, though CSET still puts a complete domestic flow out of reach ([source](https://cset.georgetown.edu/article/semiconductors-more-u-s-leverage-more-bad-news-for-beijing-part-3/)). And the largest buyers now design their own parts, with Broadcom's name on the implementation rather than on the box ([source](https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10)).
