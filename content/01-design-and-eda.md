---json
{
 "id": "design-and-eda",
 "number": 1,
 "title": "Chip Design, EDA and IP",
 "oneLiner": "The cheapest stage in the chain to fund and one of the most concentrated. Three software firms sell the tools that every leading-edge AI accelerator passes through.",
 "plain": "Chip design turns an idea for a processor into a complete blueprint, with every one of billions of transistors placed and wired. That is the street plan of a city that size, and every road has to be walkable in less than a billionth of a second. No one draws it by hand. Software from three companies, Synopsys, Cadence and Siemens, generates the layout, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. Changing one street afterwards costs a fresh set of printing stencils and several months. Withhold the software and the design cannot be made.",
 "bridge": "The chain starts before any material does, when a company still has nothing but an idea for a processor.",
 "specimen": "die-floorplan",
 "specimenCaption": "The floorplan of a GPU die, one whole reticle field of 26 by 33 mm, the largest patch a scanner can print in a single exposure. 144 compute tiles fill the centre in eight clusters, the L2 cache splits them in a band across the middle, the high-bandwidth memory interfaces run along the two long edges, and the amber strip on the short edge is the link to the chiplet next door, a second die in the same package.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 4,
 "leaders": [
 {"name": "Synopsys", "country": "US", "share": "$7.05B revenue in the fiscal year ended 31 October 2025, Ansys included from July; 90%+ of the timing-signoff market"},
 {"name": "Cadence", "country": "US", "share": "$5.30B revenue in calendar 2025; 55-60% of the hardware emulator market"},
 {"name": "Siemens EDA", "country": "DE", "share": "$2.2-2.5B revenue in 2025; 85%+ of physical verification, the final layout check"},
 {"name": "Arm", "country": "GB", "share": "About 50% of processor compute at the top cloud firms, fiscal 2026"},
 {"name": "Broadcom", "country": "US", "share": "$16.7B of AI chip revenue in the third quarter of fiscal 2026"}
 ],
 "countries": [
 {"code": "US", "note": "Synopsys, Cadence, Broadcom, Marvell, Nvidia, AMD; Siemens EDA's main sites"},
 {"code": "GB", "note": "Arm processor and interconnect designs, licensed from Cambridge"},
 {"code": "TW", "note": "Alchip, Global Unichip and MediaTek: design services that carry a chip to the factory"},
 {"code": "IL", "note": "Annapurna Labs, the AWS design house behind Trainium and Graviton"},
 {"code": "IN", "note": "Nearly 20% of the world's chip design engineers, on the Indian government's count"}
 ],
 "chinaStatus": "Designs competitive accelerators, but cannot yet run a complete leading-edge flow on domestic design software, and CSET at Georgetown University judges that Chinese vendors cannot support designs at those nodes. Washington cut off access to US and German tools for five weeks in 2025, then restored it.",
 "usStatus": "Owns the two largest design-software vendors and the dominant custom-chip design houses, and controls the US-origin technology inside Siemens EDA through export licences.",
 "costSignal": "A 3 nm photomask set runs about $40M, and startups have taken a 7 nm design all the way to the factory for $50-75M",
 "substitutability": {"band": "Hard", "test": "Three certified flows exist and none mixes; a fourth has to be written and foundry-certified, not bought", "why": "Three complete flows exist and they do not mix: the foundry certifies specific tool versions, and timing signed off in one tool is not accepted in another. A well-funded state building a fourth starts from a blank sheet and spends five to ten years on the rare failure cases a foundry has already validated, and CSET judges that Chinese vendors cannot yet support designs at those nodes."}
 },
 "keyFacts": [
 {"fact": "The market for chip design software and licensed circuit blocks was about $18B in 2025, with Synopsys, Cadence and Siemens EDA holding over 85%", "source": "https://newsletter.semianalysis.com/p/eda-market-primer"},
 {"fact": "Synopsys reported $7.054B of revenue for fiscal year 2025, the twelve months to 31 October 2025, of which Ansys contributed $756.6M after the July close", "source": "https://www.sec.gov/Archives/edgar/data/883241/000119312525314200/d29055dex991.htm"},
 {"fact": "A photomask set costs over $1M at 28 nm, over $10M at 7 nm and about $40M at 3 nm; startups have built leading-edge 7 nm chips end to end for $50-75M", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
 {"fact": "The US Bureau of Industry and Security restricted design-software sales to China in letters received 23 and 29 May 2025, then rescinded them on 2 July 2025", "source": "https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm"},
 {"fact": "Arm reported $4.92B revenue and $2.61B of royalty revenue in fiscal 2026", "source": "https://newsroom.arm.com/news/arm-q4-fye26-results"},
 {"fact": "Broadcom booked $16.7B of AI semiconductor revenue in Q3 FY2026, up 221% year on year", "source": "https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm"},
 {"fact": "OpenAI and Broadcom announced a collaboration to deploy 10 gigawatts of OpenAI-designed AI accelerators", "source": "https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10"},
 {"fact": "Broadcom's 3.5D XDSiP packages more than 6,000 mm2 of silicon and 12 high-bandwidth memory stacks in one device", "source": "https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology"},
 {"fact": "Alchip reported $992M of revenue in 2025", "source": "https://www.alchip.com/en/Investors/financials/"},
 {"fact": "UCIe 3.0, the open standard for links between chiplets, adds 48 GT/s and 64 GT/s data rates", "source": "https://www.uciexpress.org/specifications"},
 {"fact": "India is home to nearly 20% of the world's chip design engineers", "source": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393"}
 ],
 "figures": [
 {
 "id": "eda-share",
 "type": "stack",
 "title": "Design software and licensed-block revenue share, 2025. Synopsys includes Ansys",
 "unit": "%",
 "data": [["Synopsys", 44], ["Cadence", 29], ["Siemens EDA", 13], ["All others", 14]],
 "source": {"label": "SemiAnalysis, EDA Market Primer, May 2026", "url": "https://newsletter.semianalysis.com/p/eda-market-primer"}
 },
 {
 "id": "mask-cost",
 "type": "bars",
 "title": "What one photomask set costs, by node ($M). The 28 nm and 7 nm figures are minimums",
 "unit": "$M",
 "data": [["28 nm", 1], ["7 nm", 10], ["3 nm", 40]],
 "source": {"label": "SemiAnalysis, The Dark Side of the Semiconductor Design Renaissance, July 2022", "url": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"}
 },
 {
 "id": "tool-lock",
 "type": "bars",
 "title": "Each leading vendor's share of its own design-software segment, 2025",
 "unit": "%",
 "data": [["Static timing (Synopsys PrimeTime)", 90], ["Physical verification (Siemens Calibre)", 85], ["Synthesis (Synopsys Design Compiler)", 85], ["Emulation (Cadence Palladium)", 58]],
 "source": {"label": "SemiAnalysis, EDA Market Primer, May 2026", "url": "https://newsletter.semianalysis.com/p/eda-market-primer"}
 }
 ]
}
---
# Chip Design, EDA and IP

Design is the only stage in this chain with no factory, and the one a foreign government can shut off fastest. In 2025 one did. For five weeks, every Chinese chip designer lost the software that turns a design into something a factory can print.

## How it works

Chip design turns an idea for a processor into a complete blueprint, with every one of billions of transistors placed and wired. That is the street plan of a city that size, and every road has to be walkable in less than a billionth of a second. No one draws it by hand. Software from three companies, Synopsys, Cadence and Siemens, generates the layout, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. Changing one street afterwards costs a fresh set of printing stencils and several months. Withhold the software and the design cannot be made.

The sequence is the same at every design house:

- **Architecture.** Engineers fix the machine's shape: how wide the matrix-multiply unit is, how much fast on-chip memory sits beside it, how many high-bandwidth memory stacks line the edges.
- **RTL.** Register-transfer-level code, written in the hardware language SystemVerilog, fixes what every register holds on every tick of the clock.
- **Verification.** The biggest team on most projects: simulation, formal proofs, and emulators that boot the firmware before any silicon exists.
- **Physical design.** Software maps the code onto the foundry's prebuilt logic cells, then places them, wires them together and proves the timing holds.
- **Tape-out.** The handover. Mask data preparation and optical proximity correction, which pre-distorts each shape so it prints true, turn the layout into pattern files for the mask shop.

The discipline comes from the cost of a mistake, which is a whole new mask set. One set passes $1 million at 28 nm, $10 million at 7 nm and about $40 million at 3 nm, and a whole leading-edge chip has gone from design to tape-out on TSMC 7 nm for $50 million to $75 million, everything included ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

{{figure:mask-cost}}

## Variants and trade-offs

### Merchant GPU versus custom ASIC

Nvidia designs Blackwell once and sells it to everyone, so the buyer gets mature software and a resale market. A custom accelerator, an ASIC built for one company's own workload, is narrower and tuned to the job in hand. Google's seventh-generation tensor processing unit, Ironwood, carries 192 GB of memory per chip, six times its predecessor's, and delivers twice the performance per watt ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/)).

### The EDA flow

Three complete flows exist, and they do not mix. A team commits to one vendor's chain because the foundry certifies its reference recipes against specific tool versions, and timing signed off in one tool is not accepted in another. Inside each step the grip is tighter still: Synopsys alone holds more than 90 percent of static timing analysis, the check that proves a chip will run at its rated speed ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:tool-lock}}

### Buy the IP or build it

Design houses license the processor cores, the interface controllers and the blocks that drive high-bandwidth memory. Arm supplies most of the processor side: $4.92 billion of revenue, $2.61 billion of it royalties, and roughly 50 percent of processor compute at the top cloud firms in fiscal 2026 ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)). The hardest block to buy is the memory interface, which has to hold its timing across thousands of microscopic solder bumps into a stacked memory die. RISC-V, the open instruction set that needs no licence, handles the housekeeping, and Nvidia now uses it in every GPU ([source](https://riscv.org/blog/shd-forecast-2026/)).

### Chiplets

The reticle limit, the largest area a scanner can print in one exposure, ended the single-die accelerator. Modern parts are chiplets, several smaller dies wired together, and the UCIe standard lets those links come from different vendors: version 3.0 adds 48 and 64 GT/s data rates ([source](https://www.uciexpress.org/specifications)). Broadcom's 3.5D XDSiP goes furthest, packing more than 6,000 mm2 of silicon and 12 high-bandwidth memory stacks into one package ([source](https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology)).

## Who makes it

Design software and licensed blocks were an $18 billion market in 2025, and Synopsys, Cadence and Siemens EDA took more than 85 percent of it, with no other vendor above 5 percent in any core category ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

Synopsys is the largest. Its own results put revenue at $7.054 billion for the fiscal year to 31 October 2025, with Ansys, bought that July, contributing $756.6 million ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525314200/d29055dex991.htm)). Cadence, whose year ends in December, took $5.30 billion in calendar 2025 ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367226000016/R115.htm)). The two years do not line up, so any total for this market depends on where the line is drawn and on how much of Ansys it carries.

{{figure:eda-share}}

Design services, where one firm turns another's specification into a manufacturable chip, are narrower again, and Broadcom's name is on most of the deals. It booked $16.7 billion of AI semiconductor revenue in the third quarter of fiscal 2026, up 221 percent ([source](https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm)).

In October 2025 OpenAI and Broadcom said they would deploy 10 gigawatts of OpenAI-designed accelerators, with Broadcom turning the design into silicon and supplying the Ethernet networking around it ([source](https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10)). In April 2026 Broadcom extended its Meta partnership to multiple gigawatts of MTIA, Meta's in-house chip, and the first 2 nm AI accelerator ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-extended-partnership-meta-deploy-technology)).

Below Broadcom and Marvell sit the Taiwanese houses that carry a customer's circuit list all the way to a finished mask set on TSMC's newest nodes; Alchip reported $992 million of revenue in 2025 ([source](https://www.alchip.com/en/Investors/financials/)). The engineers are spread wider than the firms: India alone holds nearly 20 percent of the world's chip designers ([source](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393)).

## The chokepoint

In late May 2025 the US Bureau of Industry and Security, the agency that writes export licences, told the design-software vendors to stop selling to China. Cadence got its letter on 23 May: exporting design software classified 3D991 and 3E991 to any party in China, or to a Chinese military end user anywhere, now needed a licence ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Synopsys got its letter on 29 May and a rescinding letter on 2 July, after trade talks in which Washington eased technology restrictions ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525155294/d80081d8k.htm)).

Washington can pull this lever alone, and at once. It also speeds up the substitution it was meant to prevent: Synopsys's China revenue fell from 16 percent of the total in fiscal 2024 to 12 percent in fiscal 2025 ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

China's answer is real but partial. CSET at Georgetown University puts it flatly: Chinese designers rely on US tools for all their chip designs, US firms alone sell the full range of software a leading-edge chip needs, and Chinese vendors cannot yet support designs at those nodes ([source](https://cset.georgetown.edu/article/semiconductors-more-u-s-leverage-more-bad-news-for-beijing-part-3/)). No domestic vendor has a certified, complete flow for a 5 nm-class accelerator, and the gap is in the rare failure cases a foundry has already validated rather than in features.

China can design an accelerator. It cannot finish one at the leading edge without foreign tools, or build what it designs without foreign equipment: SMIC's 7 nm capacity is tight enough that Huawei has to choose between its phone chips and its AI chips ([source](https://cset.georgetown.edu/publication/pushing-the-limits-huaweis-ai-chip-tests-u-s-export-controls/)).

## Key evaluation criteria

- **Flow completeness.** How many steps one vendor covers, from the first line of code to final signoff.
- **Foundry certification.** Whether the foundry has validated that exact tool version against its reference flow and process design kit, the file set describing what the factory can print. Without that, it refuses signoff.
- **Verification throughput.** Simulation cycles and emulator capacity per day, which set the schedule more than anything else.
- **IP availability at node.** Whether the licensed blocks, the processor cores, the high-speed serial links, PCIe and the memory interface, have been proven in silicon on that process.
- **Design services depth.** Whether a partner can carry a customer's circuit list to a finished mask set on the newest node.
- **Legal exposure.** How much of the flow is US-origin technology, and so subject to export licensing.

## Takeaways

Three vendors sell every complete design flow used at the leading edge ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Design is cheap next to what it commits: tens of millions of dollars of engineering and masks steer tens of billions of dollars of factory capacity ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). It is the fastest lever a government can pull, and the one China is closest to neutralising, though CSET still puts a complete domestic flow out of reach ([source](https://cset.georgetown.edu/article/semiconductors-more-u-s-leverage-more-bad-news-for-beijing-part-3/)). The largest buyers now design their own parts, with Broadcom's name on the implementation rather than on the box ([source](https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10)).
