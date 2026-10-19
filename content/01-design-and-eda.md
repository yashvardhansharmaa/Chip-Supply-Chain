---json
{
 "id": "design-and-eda",
 "number": 1,
 "title": "Chip Design, EDA and IP",
 "oneLiner": "Synopsys, Cadence and Siemens EDA sell the software used to design every leading-edge AI accelerator. In 2025 they took over 85 percent of an $18 billion market, licensed blocks included.",
 "plain": "Chip design turns an idea for a new chip into a complete blueprint. A chip holds billions of transistors, tiny electrical switches. The blueprint fixes where each one sits and how it is wired to the others. The chip runs on a clock, and a signal has to cross those wires within one tick, less than a billionth of a second. Software from three companies, Synopsys, Cadence and Siemens, lays out the blueprint, checks it and signs it off. A chip factory, called a foundry, accepts only designs that have passed that software's checks. The foundry prints each layer of the design onto silicon through a stencil called a mask. Changing the blueprint once the masks are made takes new masks and a few months ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).",
 "bridge": "The chain starts before any material does, when a company still has nothing but an idea for a processor.",
 "specimen": "die-floorplan",
 "specimenCaption": "A GPU die based on Nvidia's published H100 block diagram. It is drawn at the size of one full reticle field, 26 by 33 mm, the largest area a scanner can print in one shot. The 144 compute tiles fill the center in eight clusters. H100 is a single die. The copper strip on one short edge stands for the die-to-die link that two-die designs such as Blackwell add.",
 "card": {
 "concentration": "Extreme",
 "chokepointScore": 4,
 "leaders": [
 {"name": "Synopsys", "country": "US", "share": "90%+ of the timing-signoff market"},
 {"name": "Cadence", "country": "US", "share": "55%+ of the hardware emulator market"},
 {"name": "Siemens EDA", "country": "US", "share": "85%+ of physical verification, the final layout check"},
 {"name": "Arm", "country": "GB", "share": "About 50% of processor compute at the top cloud firms, fiscal 2026"},
 {"name": "Broadcom", "country": "US", "share": "$16.7B of AI semiconductor revenue in the third quarter of fiscal 2026, custom accelerators and networking combined"}
 ],
 "countries": [
 {"code": "US", "note": "Synopsys, Cadence, Broadcom, Marvell and Nvidia"},
 {"code": "GB", "note": "Arm processor and interconnect designs licensed from Cambridge, and since 2026 its own server chip"},
 {"code": "TW", "note": "Alchip, Global Unichip and MediaTek: design services that carry a chip to the factory"},
 {"code": "IL", "note": "Annapurna Labs, the AWS design house behind Trainium and Graviton"},
 {"code": "IN", "note": "Nearly 20% of the world's chip design engineers, on the Indian government's count"}
 ],
 "chinaStatus": "China designs its own AI accelerators, but Huawei's best, the Ascend 950, delivers about half the computing performance of Nvidia's H100 from 2022, on Epoch AI's estimate. CSET found in 2021, from 2019 data, that Chinese design software largely did not support processes at 14 nm and below.",
 "usStatus": "The United States has the two largest design-software vendors and the leading custom-chip design houses.",
 "costSignal": "$40M for a leading-edge photomask set, SemiAnalysis's May 2026 figure. In 2022 SemiAnalysis reported that startups had designed and taped out chips on TSMC 7 nm for $50-75M",
 "substitutability": {"band": "Hard", "test": "Only three complete sets of chip design software exist, and a fourth would have to be written from nothing and approved by a foundry.", "why": "Changing one tool, such as the synthesis tool, means re-running the later steps of the design. The foundry that makes the chip also specifies which signoff tools its customers must use."}
 },
 "keyFacts": [
 {"fact": "The market for chip design software and licensed circuit blocks was about $18B in 2025, with Synopsys, Cadence and Siemens EDA holding over 85%, counting Ansys as part of Synopsys", "source": "https://newsletter.semianalysis.com/p/eda-market-primer"},
 {"fact": "Synopsys reported $7.054B of revenue for fiscal year 2025, the twelve months to 31 October 2025, of which Ansys contributed $756.6M after the July close", "source": "https://www.sec.gov/Archives/edgar/data/883241/000119312525314200/d29055dex991.htm"},
 {"fact": "In 2022 SemiAnalysis put a photomask set at over $1M at 28 nm and over $10M at 7 nm, and expected 3 nm sets to push into the $40M range. It also reported that startups had designed and taped out chips on TSMC 7 nm, then a leading-edge process, for $50-75M", "source": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"},
 {"fact": "In May 2026 SemiAnalysis put a leading-edge photomask set at $40M and a single respin at leading-edge nodes at $50-100M", "source": "https://newsletter.semianalysis.com/p/eda-market-primer"},
 {"fact": "In September 2026 CSIS put the cost of developing a leading-edge 2 nm chip at about $725M, against $48M to develop a 28 nm design in the late 2000s", "source": "https://www.csis.org/analysis/billion-dollar-chip-who-can-afford-design-future"},
 {"fact": "The US Bureau of Industry and Security told Cadence on 23 May 2025 that exports of design software to China needed a license, then rescinded that requirement on 2 July 2025", "source": "https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm"},
 {"fact": "Since 14 October 2022, design software specially made for chips with gate-all-around transistors has needed a US export license for national-security reasons, carrying out a December 2021 Wassenaar Arrangement decision", "source": "https://www.federalregister.gov/documents/2022/08/15/2022-17125/implementation-of-certain-2021-wassenaar-arrangement-decisions-on-four-section-1758-technologies"},
 {"fact": "Arm reported $4.92B revenue and $2.61B of royalty revenue in fiscal 2026", "source": "https://newsroom.arm.com/news/arm-q4-fye26-results"},
 {"fact": "Broadcom reported $16.7B of AI semiconductor revenue in Q3 FY2026, up 221% year on year, a figure covering its custom AI accelerators and its AI networking chips", "source": "https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm"},
 {"fact": "OpenAI and Broadcom announced a collaboration to deploy 10 gigawatts of OpenAI-designed AI accelerators", "source": "https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10"},
 {"fact": "Broadcom's 3.5D XDSiP packages more than 6,000 mm2 of silicon and 12 high-bandwidth memory stacks in one device", "source": "https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology"},
 {"fact": "Alchip reported $992M of revenue in 2025", "source": "https://www.alchip.com/en/Investors/financials/"},
 {"fact": "UCIe 3.0, the open standard for links between chiplets, adds 48 GT/s and 64 GT/s data rates", "source": "https://www.uciexpress.org/specifications"},
 {"fact": "Nearly 20% of the world's chip design engineers work in India", "source": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393"}
 ],
 "figures": [
 {"id": "design-timing", "type": "animation", "src": "chip-design", "title": "How a chip is designed", "note": "Simplified. Not to scale. The floorplan follows a GPU die. One tick, less than a billionth of a second, is slowed to about two seconds."},
 {
 "id": "eda-share",
 "type": "stack",
 "title": "Design software and licensed-block revenue share, 2025. Synopsys includes Ansys",
 "unit": "%",
 "data": [["Synopsys", 44], ["Cadence", 29], ["Siemens EDA", 13], ["All others", 13]],
 "source": {"label": "SemiAnalysis, EDA Market Primer, May 2026. Shares calculated from its calendar 2025 revenue figures, with Synopsys at $8B including Ansys and Siemens EDA at the middle of its $2.2-2.5B estimate", "url": "https://newsletter.semianalysis.com/p/eda-market-primer"}
 },
 {
 "id": "mask-cost",
 "type": "bars",
 "title": "What one photomask set costs, by node, 2022 ($M). The 28 nm and 7 nm figures are minimums",
 "unit": "$M",
 "data": [["28 nm", 1], ["7 nm", 10], ["3 nm", 40]],
 "source": {"label": "SemiAnalysis, The Dark Side of the Semiconductor Design Renaissance, July 2022. The 3 nm figure was a 2022 forecast. SemiAnalysis's May 2026 EDA Market Primer puts a leading-edge mask set at $40M", "url": "https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor"}
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

Design is the only stage of the supply chain without a factory, and the US government has already restricted it by letter. In late May 2025 the government required a license to sell chip design software to anyone in China ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Cadence cut off its Chinese customers until the government lifted the rule on 2 July ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)).

## How it works

Chip design turns an idea for a new chip into a complete blueprint. A chip holds billions of transistors, tiny electrical switches. The blueprint fixes where each one sits and how it is wired to the others. The chip runs on a clock, and a signal has to cross those wires within one tick, less than a billionth of a second. Software from three companies, Synopsys, Cadence and Siemens, lays out the blueprint, checks it and signs it off. A chip factory, called a foundry, accepts only designs that have passed that software's checks. The foundry prints each layer of the design onto silicon through a stencil called a mask. Changing the blueprint once the masks are made takes new masks and a few months ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

{{figure:design-timing}}

Design runs in five stages, all in software, and each stage's output is the next one's input.

- **Architecture.** Engineers fix the shape of the chip: the width of the block that multiplies numbers, the amount of fast on-chip memory beside it and the number of high-bandwidth memory stacks along the chip's edges. The output is a plan.
- **RTL.** Engineers write the plan as register-transfer-level code, RTL, in the hardware language SystemVerilog. A register is a small store on the chip that holds one number. On each tick of the chip's clock, every register takes its next value at the same moment. The code says what every register holds on every tick. The output is a text description of the whole chip.
- **Verification.** A large team checks that the code does what the plan says. They run it in simulation and prove parts of it correct with mathematics. They also load it into emulators, cabinets of reprogrammable chips that behave like the design, so the chip's own software can boot before any silicon exists.
- **Physical design.** Software swaps each piece of the code for a logic cell, a small ready-made circuit the foundry has already proved it can make. It then places the cells on the chip, wires them together and proves that every signal arrives in time.
- **Tape-out.** Software turns the placed layout into pattern files for the mask shop. First it pre-distorts each shape so that the shape prints as drawn, a step called optical proximity correction. Then it cuts the layout into the files a mask writer reads, a step called mask data preparation. Handing those files to the mask shop is called tape-out.

All that checking exists because each revision after tape-out, called a respin, needs at least some new masks ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). In 2022 SemiAnalysis put a full mask set at more than $1 million at 28 nm and more than $10 million at 7 nm ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). The nanometer labels name process generations, called nodes, each finer than the last, and no longer measure anything. That year SemiAnalysis also expected 3 nm sets to push into the $40 million range ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). Its May 2026 primer still puts a leading-edge mask set at $40 million, and a single leading-edge respin at $50 million to $100 million ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

The same 2022 SemiAnalysis article reported that startups had taken chips on TSMC 7 nm, then a leading-edge process, from design to tape-out for $50 million to $75 million, everything included ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). Using a different measure, CSIS put the cost of developing a leading-edge 2 nm chip at about $725 million in September 2026 ([source](https://www.csis.org/analysis/billion-dollar-chip-who-can-afford-design-future)). It put the cost of developing a 28 nm design in the late 2000s at $48 million ([source](https://www.csis.org/analysis/billion-dollar-chip-who-can-afford-design-future)).

{{figure:mask-cost}}

## Variants and trade-offs

### Merchant GPU versus custom ASIC

Nvidia designs its Blackwell GPU once and sells it to everyone, so the buyer gets mature software and a resale market. A custom accelerator, an ASIC, is built for one company's own workload. It handles a narrower range of tasks and is tuned to that workload. Google's seventh-generation tensor processing unit, Ironwood, carries 192 GB of memory per chip, six times its predecessor's, and delivers twice the performance per watt ([source](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/ironwood-tpu-age-of-inference/)).

### The EDA flow

Chip design software is known as electronic design automation, or EDA. Three complete EDA flows exist, each a set of tools that covers every step from code to signoff ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Changing the synthesis tool, which swaps the code for logic cells, means re-running the steps that follow: placing and wiring the cells, signoff and physical verification ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Foundries also specify which signoff tools their customers must use for tape-out ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

Inside some steps of the flow, one vendor holds most of the market. Synopsys alone has more than 90 percent of the market for static timing analysis, the check that proves a chip will run at its rated speed ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:tool-lock}}

### Buy the IP or build it

Design houses license ready-made circuit blocks, known as intellectual property or IP, including the processor cores, the interface controllers and the blocks that drive high-bandwidth memory. Arm licenses processor designs. In fiscal 2026 it reported $4.92 billion of revenue, $2.61 billion of it royalties ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)). It said it held about 50 percent of processor compute at the top cloud firms ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)).

In 2026 Arm also launched the Arm AGI CPU, its first production silicon product ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)). By May 2026, servers built on it could be ordered from ASRock, Lenovo, Quanta and Supermicro ([source](https://newsroom.arm.com/news/arm-q4-fye26-results)).

The memory interface is hard to design, because its signals have to stay on time across thousands of microscopic solder bumps into a stacked memory die.

RISC-V is an open instruction set, the basic list of commands a processor understands, and it needs no license. Small RISC-V processors handle control tasks on the chip, and Nvidia uses them in every GPU ([source](https://riscv.org/blog/shd-forecast-2026/)).

### Chiplets

The reticle limit caps the size of a single die, one piece of silicon ([source](https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology)). That limit is the largest area a scanner, the machine that prints the chip's pattern, can expose in one shot. Many large accelerators are built from chiplets, several smaller dies wired together, and UCIe is an open industry standard for the links between them inside a package ([source](https://www.uciexpress.org/specifications)). Version 3.0 of UCIe adds 48 and 64 GT/s data rates ([source](https://www.uciexpress.org/specifications)). Broadcom's 3.5D XDSiP platform packs more than 6,000 mm2 of silicon and 12 high-bandwidth memory stacks into one package ([source](https://docs.broadcom.com/doc/3-5d-xdsip-platform-technology)).

## Who makes it

Design software and licensed blocks were an $18 billion market in 2025 ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Synopsys, Cadence and Siemens EDA took more than 85 percent of it, counting Ansys as part of Synopsys ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). No other vendor had more than 5 percent of any core category ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). Siemens EDA is a US-based subsidiary of the German firm Siemens, so country shares that count each firm by its parent company's headquarters put its sales under Germany ([source](https://www.csis.org/analysis/double-edged-sword-semiconductor-export-controls-electronic-design-automation)).

Synopsys is the largest. Its own results put revenue at $7.054 billion for the fiscal year to 31 October 2025, with Ansys, bought that July, contributing $756.6 million ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525314200/d29055dex991.htm)). Cadence, whose year ends in December, took $5.297 billion in calendar 2025 ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367226000016/R115.htm)).

The two fiscal years do not line up, so any total for this market depends on which twelve months are counted. It also depends on how much of Ansys it includes, because Ansys sells to other industries too. SemiAnalysis counts Synopsys at $8 billion for calendar 2025 with Ansys included ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). It puts 31 percent of Ansys's business in semiconductors and high technology, 22 percent in aerospace and 18 percent in automotive ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

{{figure:eda-share}}

Some chip firms also build custom accelerators to a customer's design and sell the finished chips. Broadcom booked $16.7 billion of AI semiconductor revenue in the third quarter of fiscal 2026, up 221 percent year over year ([source](https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm)). That figure covers both its custom AI accelerators and its AI networking chips ([source](https://www.sec.gov/Archives/edgar/data/0001730168/000173016826000076/avgo-08022026x8kxex99.htm)).

In October 2025 OpenAI and Broadcom said they would deploy 10 gigawatts of OpenAI-designed accelerators ([source](https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10)). Broadcom would turn the design into silicon and supply the Ethernet networking around it ([source](https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10)). In April 2026 Broadcom extended its Meta partnership to multiple gigawatts of MTIA, Meta's in-house chip, and the first 2 nm AI accelerator ([source](https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-extended-partnership-meta-deploy-technology)).

Marvell, another US firm, also builds custom accelerators. Below Broadcom and Marvell are the Taiwanese design-service houses. They carry a customer's circuit list all the way to a finished mask set on TSMC's newest nodes. One of them, Alchip, reported $992 million of revenue in 2025 ([source](https://www.alchip.com/en/Investors/financials/)).

Chip design engineers are spread across more countries than these firms are. India alone has nearly 20 percent of the world's chip designers ([source](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148393)).

## The chokepoint

Before the 2025 letters, a narrower control already applied. Since 14 October 2022, design software specially made for chips with gate-all-around transistors has needed a US export license for national-security reasons ([source](https://www.federalregister.gov/documents/2022/08/15/2022-17125/implementation-of-certain-2021-wassenaar-arrangement-decisions-on-four-section-1758-technologies)). The rule calls that transistor design key to processes at 3 nm and below ([source](https://www.federalregister.gov/documents/2022/08/15/2022-17125/implementation-of-certain-2021-wassenaar-arrangement-decisions-on-four-section-1758-technologies)). That license requirement covers exports to China ([source](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-738/appendix-Supplement%20No.%201%20to%20Part%20738)). The control carried out a December 2021 decision of the Wassenaar Arrangement, a group of countries that coordinate export controls ([source](https://www.federalregister.gov/documents/2022/08/15/2022-17125/implementation-of-certain-2021-wassenaar-arrangement-decisions-on-four-section-1758-technologies)).

In late May 2025 the US Bureau of Industry and Security, the agency that issues export licenses, told the design-software vendors that sales to China now needed a license ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Cadence got its letter on 23 May ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). The letter required a license to export design software classified 3D991 and 3E991 to any party in China, or to a Chinese military end user anywhere ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Synopsys got its letter on 29 May and a second letter lifting the requirement on 2 July ([source](https://www.sec.gov/Archives/edgar/data/883241/000119312525155294/d80081d8k.htm)).

Unlike the 2022 control, the 2025 requirement came from the United States alone and took effect immediately. Synopsys's China revenue fell from 16 percent of its total in fiscal 2024 to 12 percent in fiscal 2025 ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). SemiAnalysis links the decline to tighter export restrictions and to local design-software companies winning share at mature nodes ([source](https://newsletter.semianalysis.com/p/eda-market-primer)). SemiAnalysis also quoted Synopsys's management saying that companies Synopsys cannot sell to look for alternatives, typically local design-software and licensed-block companies ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).

In October 2025 CSIS found that only a few companies, Cadence, Synopsys and Siemens, make design software that supports the entire chip design flow of more than 40 steps ([source](https://www.csis.org/analysis/double-edged-sword-semiconductor-export-controls-electronic-design-automation)). In a January 2021 report built on 2019 market data, CSET at Georgetown University found that one Chinese firm, Empyrean, could reportedly run a complete design flow only for certain analog and mixed-signal chips ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). Mixed-signal chips combine analog and digital circuits. For all other chips, Chinese designers then relied on US tools ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)). The report found that other Chinese tools covered only narrow parts of the design flow or supplemented US tools, and largely did not support processes at 14 nm and below ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

In its 2025 annual report, filed in April 2026, Empyrean says it now has complete design flows for analog, memory, radio-frequency and flat-panel display circuits ([source](https://static.cninfo.com.cn/finalpage/2026-04-28/1225217315.PDF)). It says its digital tools cover 80 percent of the main tools for digital design ([source](https://static.cninfo.com.cn/finalpage/2026-04-28/1225217315.PDF)). The same report lists foundry certifications for its circuit simulator at 8, 5 and 4 nm and for its physical verification tool, the final layout check, at 28 nm ([source](https://static.cninfo.com.cn/finalpage/2026-04-28/1225217315.PDF)). But CSIS found that as of 2025 Chinese design tools were still far from replacing the full range of advanced capabilities US firms offer, especially for 5 nm and 3 nm chip design ([source](https://www.csis.org/analysis/double-edged-sword-semiconductor-export-controls-electronic-design-automation)).

China can design accelerators, but it cannot finish one at the leading edge without foreign tools, or build what it designs without foreign equipment. SMIC, a Chinese foundry, makes Huawei's chips. In June 2024 CSET found that SMIC's limited 7 nm capacity forced Huawei to choose between making its most advanced phone chips and its AI chips ([source](https://cset.georgetown.edu/publication/pushing-the-limits-huaweis-ai-chip-tests-u-s-export-controls/)).

On Epoch AI's estimates, Huawei's flagship chip for 2026, the Ascend 950, delivers about half the computing performance of Nvidia's H100, which began shipping in 2022 ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)). Epoch puts Nvidia's B300 at 6.75 times the 950's theoretical peak performance ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)). Epoch's median estimate is that Huawei will make about 1.5 million Ascend chips in 2026, against 5.9 million for Nvidia ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)). On those estimates, Huawei's 2026 output would carry less than 4 percent of the computing power Nvidia ships that year ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)).

Epoch puts Huawei's chips three to four years behind Nvidia's until at least 2030, for three reasons ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)). SMIC cannot pack transistors as densely as TSMC, which makes Nvidia's. Chinese memory makers are only starting to produce high-bandwidth memory. And Huawei's software for programming its chips is far less mature than Nvidia's ([source](https://epoch.ai/publications/huaweis-roadmap-to-2031)).

## Takeaways

The US government required a license to sell design software to anyone in China from late May to 2 July 2025 ([source](https://www.sec.gov/Archives/edgar/data/813672/000081367225000093/cdns-20250702.htm)). Since October 2022 a narrower requirement has covered software specially made for chips with gate-all-around transistors, a transistor design the rule calls key to processes at 3 nm and below ([source](https://www.federalregister.gov/documents/2022/08/15/2022-17125/implementation-of-certain-2021-wassenaar-arrangement-decisions-on-four-section-1758-technologies)).

As of 2025, the think tank CSIS found Chinese design tools still far from replacing the full range of advanced capabilities US firms offer, especially for 5 nm and 3 nm chip design ([source](https://www.csis.org/analysis/double-edged-sword-semiconductor-export-controls-electronic-design-automation)). But Chinese design-software companies were winning share at older manufacturing processes, the research firm SemiAnalysis reported ([source](https://newsletter.semianalysis.com/p/eda-market-primer)).
