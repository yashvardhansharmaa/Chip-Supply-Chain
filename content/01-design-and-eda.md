---json
{
 "id": "design-and-eda",
 "number": 1,
 "title": "Chip Design, EDA and IP",
 "oneLiner": "The cheapest stage in the chain to fund and one of the most concentrated. Three software firms sell the tools used to design every leading-edge AI accelerator.",
 "plain": "Chip design turns an idea for a new chip into a complete blueprint. A chip holds billions of transistors, tiny electrical switches, and the blueprint fixes where each one sits and how it is wired to the others. The chip works in ticks, and a signal has to cross those wires within one tick, less than a billionth of a second. Software from three companies, Synopsys, Cadence and Siemens, lays out a plan like that, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. The factory prints each layer of the design onto silicon through a stencil, and changing the plan after that takes new stencils and a few months. Withhold the software and no new chip can be designed.",
 "bridge": "The chain starts before any material does, when a company still has nothing but an idea for a processor.",
 "specimen": "die-floorplan",
 "specimenCaption": "The floorplan of one GPU die, 26 by 33 mm, drawn to scale. That is one reticle field, the largest area a scanner can print in one shot. The 144 compute tiles fill the center in eight clusters; the copper strip on the short edge is the link to the second die in the same package.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 4,
 "leaders": [
 {"name": "Synopsys", "country": "US", "share": "$7.054B revenue in the fiscal year ended 31 October 2025, Ansys included from July; 90%+ of the timing-signoff market"},
 {"name": "Cadence", "country": "US", "share": "$5.30B revenue in calendar 2025; 55-60% of the hardware emulator market"},
 {"name": "Siemens EDA", "country": "DE", "share": "An estimated $2.2-2.5B revenue in 2025; 85%+ of physical verification, the final layout check"},
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
 "chinaStatus": "China designs its own AI accelerators, but Huawei's best, the Ascend 950, delivers about half the computing performance of Nvidia's H100 from 2022, on Epoch AI's estimate. CSET at Georgetown University found in 2021 that Chinese design software largely did not support the newest manufacturing processes. The US government required a license for design-software sales to China from late May to 2 July 2025, then lifted that requirement.",
 "usStatus": "The United States has the two largest design-software vendors and the leading custom-chip design houses. Siemens EDA is German-owned, but the American technology inside it still needs US export licenses.",
 "costSignal": "A 3 nm photomask set costs about $40M, and startups have designed and taped out a 7 nm chip for $50-75M",
 "substitutability": {"band": "Hard", "test": "Only three complete sets of chip design software exist, and a fourth would have to be written from nothing and approved by a foundry.", "why": "Three complete sets of chip design software exist today. Changing one tool, such as the synthesis tool, means re-running the later steps of the design, and the foundry that makes the chip specifies which signoff tools its customers must use. A newcomer would have to write a fourth set from nothing and win that foundry approval. CSET at Georgetown University found in 2021 that Chinese design tools largely did not support the newest manufacturing processes."}
 },
 "keyFacts": [
 {"fact": "The market for chip design software and licensed circuit blocks was about $18B in 2025, with Synopsys, Cadence and Siemens EDA holding over 85%", "source": "https://newsletter.semianalysis.com/p/eda-market-primer"},
 {"fact": "Synopsys reported $7.054B of revenue for fiscal year 2025, the twelve months to 31 October 2025, of which Ansys contributed $756.6M after the July close", "source": "https://www.sec.gov/Archives/edgar/data/883241/000119312525314200/d29055dex991.htm"},
 {"fact": "A photomask set costs over $1M at 28 nm, over $10M at 7 nm and about $40M at 3 nm; startups have designed and taped out leading-edge 7 nm chips for $50-75M", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
 {"fact": "The US Bureau of Industry and Security told Cadence on 23 May 2025 that exports of design software to China needed a license, then rescinded that requirement on 2 July 2025", "source": "https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm"},
 {"fact": "Arm reported $4.92B revenue and $2.61B of royalty revenue in fiscal 2026", "source": "https://newsroom.arm.com/news/arm-q4-fye26-results"},
 {"fact": "Broadcom reported $16.7B of AI semiconductor revenue in Q3 FY2026, up 221% year on year", "source": "https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm"},
 {"fact": "OpenAI and Broadcom announced a collaboration to deploy 10 gigawatts of OpenAI-designed AI accelerators", "source": "https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10"},
 {"fact": "Broadcom's 3.5D XDSiP packages more than 6,000 mm2 of silicon and 12 high-bandwidth memory stacks in one device", "source": "https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology"},
 {"fact": "Alchip reported $992M of revenue in 2025", "source": "https://www.alchip.com/en/Investors/financials/"},
 {"fact": "UCIe 3.0, the open standard for links between chiplets, adds 48 GT/s and 64 GT/s data rates", "source": "https://www.uciexpress.org/specifications"},
 {"fact": "Nearly 20% of the world's chip design engineers work in India", "source": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393"}
 ],
 "figures": [
 {"id": "design-timing", "type": "animation", "src": "chip-design", "title": "How a chip is designed", "note": "Simplified. Not to scale. The floorplan follows a GPU die; one tick, less than a billionth of a second, is slowed to about two seconds."},
 {
 "id": "eda-share",
 "type": "stack",
 "title": "Design software and licensed-block revenue share, 2025. Synopsys includes Ansys",
 "unit": "%",
 "data": [["Synopsys", 44], ["Cadence", 29], ["Siemens EDA", 13], ["All others", 13]],
 "source": {"label": "SemiAnalysis, EDA Market Primer, May 2026. Shares calculated from its revenue figures, with Siemens EDA at the middle of its $2.2-2.5B estimate", "url": "https://newsletter.semianalysis.com/p/eda-market-primer"}
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
 "title": "Each leading vendor's share of its own design-software segment. Lower end of each reported range",
 "unit": "%",
 "data": [["Static timing (Synopsys PrimeTime)", 90], ["Physical verification (Siemens Calibre)", 85], ["Synthesis (Synopsys Design Compiler)", 84], ["Emulation (Cadence Palladium)", 55]],
 "source": {"label": "SemiAnalysis, EDA Market Primer, May 2026", "url": "https://newsletter.semianalysis.com/p/eda-market-primer"}
 }
 ]
}
---
# Chip Design, EDA and IP

Design is the only stage in this chain without a factory, and the easiest for a government to cut off. In late May 2025 the US government required a license to sell chip design software to anyone in China, and Cadence cut off its Chinese customers until the rule was lifted on 2 July ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)).

## How it works

Chip design turns an idea for a new chip into a complete blueprint. A chip holds billions of transistors, tiny electrical switches, and the blueprint fixes where each one sits and how it is wired to the others. The chip works in ticks, and a signal has to cross those wires within one tick, less than a billionth of a second. Software from three companies, Synopsys, Cadence and Siemens, lays out a plan like that, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. The factory prints each layer of the design onto silicon through a stencil, and changing the plan after that takes new stencils and a few months ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). Withhold the software and no new chip can be designed.

{{figure:design-timing}}

Design runs in five stages, each one's output the next one's input, all of it in software.

- **Architecture.** Engineers fix the shape of the chip: how wide the block that multiplies numbers is, how much fast on-chip memory sits beside it, how many high-bandwidth memory stacks line the edges. The output is a plan.
- **RTL.** Engineers write the plan as register-transfer-level code, RTL, in the hardware language SystemVerilog. A register is a small store on the chip that holds one number, and the clock is the tick that moves every register forward together. The code says what every register holds on every tick, and the output is a text description of the whole chip.
- **Verification.** A large team checks that the code does what the plan says. They run it in simulation, prove parts of it correct with mathematics, and load it into emulators, cabinets of reprogrammable chips that behave like the design, so the chip's own software can boot before any silicon exists.
- **Physical design.** Software swaps each piece of the code for a logic cell, a small ready-made circuit the foundry has already proved it can make, then places the cells on the chip, wires them together and proves that every signal arrives in time.
- **Tape-out.** The handover. Software turns the placed layout into pattern files for the mask shop. First it pre-distorts each shape so that it prints as drawn, which is optical proximity correction; then it cuts the layout into the files a mask writer reads, which is mask data preparation.

All that checking exists because each revision after tape-out needs at least some new masks ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). A full set costs more than $1 million at 28 nm, more than $10 million at 7 nm and about $40 million at 3 nm, and a whole leading-edge chip has gone from design to tape-out on TSMC 7 nm for $50 million to $75 million, everything included ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). The nanometer labels name generations of the process, each finer than the last, and no longer measure anything.

{{figure:mask-cost}}

## Variants and trade-offs

### Merchant GPU versus custom ASIC

Nvidia designs Blackwell once and sells it to everyone, so the buyer gets mature software and a resale market. A custom accelerator, an ASIC built for one company's own workload, is narrower and tuned to that one workload. Google's seventh-generation tensor processing unit, Ironwood, carries 192 GB of memory per chip, six times its predecessor's, and delivers twice the performance per watt ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/)).

### The EDA flow

Three complete flows exist, and a change of synthesis tool means re-running place-and-route, signoff and physical verification ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Foundries also specify which signoff tools their customers must use for tape-out ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Synopsys alone holds more than 90 percent of static timing analysis, the check that proves a chip will run at its rated speed ([source](https://newsletter.semianalysis.com/p/eda-market-primer)), so inside some steps of the flow one vendor holds most of the market.

{{figure:tool-lock}}

### Buy the IP or build it

Design houses license the processor cores, the interface controllers and the blocks that drive high-bandwidth memory. Arm licenses processor designs, and in fiscal 2026 it reported $4.92 billion of revenue, $2.61 billion of it royalties, and said it held about 50 percent of processor compute at the top cloud firms ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)). The memory interface is a demanding block, because it has to hold its timing across thousands of microscopic solder bumps into a stacked memory die. RISC-V, the open instruction set that needs no license, handles the small control tasks on the chip, and Nvidia now uses it in every GPU ([source](https://riscv.org/blog/shd-forecast-2026/)).

### Chiplets

The reticle limit, the largest area a scanner can print in one exposure, limits how large a single die can grow ([source](https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology)). Many large accelerators are built from chiplets, several smaller dies wired together, and UCIe is an open industry standard for the links between them inside a package ([source](https://www.uciexpress.org/specifications)). Version 3.0 of UCIe adds 48 and 64 GT/s data rates ([source](https://www.uciexpress.org/specifications)). Broadcom's 3.5D XDSiP platform packs more than 6,000 mm2 of silicon and 12 high-bandwidth memory stacks into one package ([source](https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology)).

## Who makes it

Design software and licensed blocks were an $18 billion market in 2025, and Synopsys, Cadence and Siemens EDA took more than 85 percent of it, with no other vendor above 5 percent in any core category ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

Synopsys is the largest. Its own results put revenue at $7.054 billion for the fiscal year to 31 October 2025, with Ansys, bought that July, contributing $756.6 million ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525314200/d29055dex991.htm)). Cadence, whose year ends in December, took $5.297 billion in calendar 2025 ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367226000016/R115.htm)). The two fiscal years do not line up, so any total for this market depends on which twelve months are counted and on how much of Ansys it includes.

{{figure:eda-share}}

Design services, where one firm turns another's specification into a manufacturable chip, are narrower again. Broadcom booked $16.7 billion of AI semiconductor revenue in the third quarter of fiscal 2026, up 221 percent year over year ([source](https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm)).

In October 2025 OpenAI and Broadcom said they would deploy 10 gigawatts of OpenAI-designed accelerators, with Broadcom turning the design into silicon and supplying the Ethernet networking around it ([source](https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10)). In April 2026 Broadcom extended its Meta partnership to multiple gigawatts of MTIA, Meta's in-house chip, and the first 2 nm AI accelerator ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-extended-partnership-meta-deploy-technology)).

Below Broadcom and Marvell sit the Taiwanese houses that carry a customer's circuit list all the way to a finished mask set on TSMC's newest nodes; Alchip reported $992 million of revenue in 2025 ([source](https://www.alchip.com/en/Investors/financials/)). The engineers are spread across more countries than the firms, and India alone holds nearly 20 percent of the world's chip designers ([source](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393)).

## The chokepoint

In late May 2025 the US Bureau of Industry and Security, the agency that writes export licenses, told the design-software vendors that sales to China now needed a license ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Cadence got its letter on 23 May: exporting design software classified 3D991 and 3E991 to any party in China, or to a Chinese military end user anywhere, now needed a license ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Synopsys got its letter on 29 May and a rescinding letter on 2 July ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525155294/d80081d8k.htm)).

Washington can impose this control alone, and at once. Synopsys's China revenue fell from 16 percent of its total in fiscal 2024 to 12 percent in fiscal 2025 ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). SemiAnalysis links the decline to tighter export restrictions and to local design-software companies winning share at mature nodes ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

In a January 2021 report, CSET at Georgetown University found that US firms alone sold design software with the full range of capabilities needed for leading-edge chips, and that outside one Chinese firm's niche products, Chinese designers relied on US tools for all chip designs ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The report found that other Chinese tools covered only narrow parts of the design flow or supplemented US tools, and largely did not support processes at 14 nm and below ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

China can design an accelerator. It cannot finish one at the leading edge without foreign tools, or build what it designs without foreign equipment. In June 2024 CSET found that SMIC's limited 7 nm capacity forced Huawei to choose between making its most advanced phone chips and its AI chips ([source](https://cset.georgetown.edu/publication/pushing-the-limits-huaweis-ai-chip-tests-u-s-export-controls/)).

On Epoch AI's estimates, Huawei's flagship chip for 2026, the Ascend 950, delivers about half the computing performance of Nvidia's H100, which began shipping in 2022, and Nvidia's B300 has 6.75 times the 950's theoretical peak performance ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)). Huawei will make about 1.5 million Ascend chips in 2026 against Nvidia's 5.9 million. With fewer and weaker chips, Huawei's 2026 output will carry less than 4 percent of the computing power Nvidia ships that year ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)). Epoch puts Huawei's chips three to four years behind Nvidia's until at least 2030, for three reasons. SMIC, which makes Huawei's chips, cannot pack transistors as densely as TSMC, which makes Nvidia's. Chinese memory makers are only starting to produce high-bandwidth memory. And Huawei's software for programming its chips is far less mature than Nvidia's ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)).

## Key evaluation criteria

- **Flow completeness.** How many steps one vendor covers, from the first line of code to final signoff.
- **Foundry certification.** Whether the foundry has validated that exact tool version against its reference flow and process design kit, the file set describing what the factory can print. Without that, the foundry refuses signoff.
- **Verification throughput.** Simulation cycles and emulator capacity per day, which set the schedule more than anything else.
- **IP availability at node.** Whether the licensed blocks, the processor cores, the high-speed serial links, PCIe and the memory interface, have been proven in silicon on that process.
- **Design services depth.** Whether a partner can carry a customer's circuit list to a finished mask set on the newest node.
- **Legal exposure.** How much of the flow is US-origin technology, and so subject to export licensing.

## Takeaways

In January 2021 CSET at Georgetown University found that only US firms sold design software with the full range of capabilities needed to design leading-edge chips ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The US government can cut that software off with a letter, and in 2025 it did so for China from late May to 2 July ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). In May 2026 SemiAnalysis reported that every advanced chip is designed with software from Synopsys, Cadence and Siemens EDA, and that local design-software companies in China were winning share at mature nodes ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).