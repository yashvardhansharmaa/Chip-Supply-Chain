# Precise pass C: scope, idioms, simpler words, one idea per sentence

Changes: 211

Standard applied, from the author's two corrections of 20 September: a noun whose scope was ambiguous is made explicit; idioms and figures of speech are replaced by the plain word; a simpler word replaces a longer one where it serves; a sentence carrying two ideas is split. Explanatory analogies that give a reader scale or a mechanism (a lens cap a photographer can shoot through, a tap on a pipe) stay, since they teach rather than decorate. Numbers, dates, ids, keys, URLs, Federal Register and CFR citations, legal terms of art, quoted source text and the credits line are untouched.

Checks after the pass: every data file parses; `node build/build.js` runs with no warnings; `node qa/scripts/check-speak.js` reports no matches; `node qa/scripts/check-integrity.js` is clean apart from the known "has no supplier entry" lines.

| # | File | Where | Before | After |
|---|---|---|---|---|
| 1 | `data/glossary.json` | ALD why | Atomic layer deposition is what makes stacked memory and wrap-around transistors possible, US export rules name it directly, and it is the one tool category where Chinese suppliers still hold under 1 percent of the market. | Atomic layer deposition is what makes stacked memory and wrap-around transistors possible, and US export rules name it directly. It is the one tool category where Chinese suppliers still hold under 1 percent of the market. |
| 2 | `data/glossary.json` | chokepoint why | Chokepoints are where policy gets purchase, and where one sanction | Chokepoints are where a policy has effect, and where one sanction |
| 3 | `data/glossary.json` | de minimis why | It is the ordinary route out of American jurisdiction, and the reason | It is the ordinary way an item leaves American jurisdiction, and the reason |
| 4 | `data/glossary.json` | ECCN why | so the technical thresholds written into each number are where the policy bites. | so the technical thresholds written into each number are where the policy takes effect. |
| 5 | `data/glossary.json` | EDA why | which is why cutting China off from them in May 2025 took three letters and no lead time. | which is why stopping their sale to China in May 2025 took three letters and no lead time. |
| 6 | `data/glossary.json` | Entity List why | The fastest and bluntest instrument Washington has: it names an organization. | The fastest and simplest instrument Washington has: it names an organization. |
| 7 | `data/glossary.json` | fab why | Fab construction is the slowest and most capital-hungry part of any reshoring plan, which is why | Fab construction is the slowest part of any reshoring plan and the one that needs the most capital, which is why |
| 8 | `data/glossary.json` | HBM why | made by three firms whose entire 2026 output was sold forward before the year began. | made by three firms whose entire 2026 output was sold before the year began. |
| 9 | `data/glossary.json` | is-informed letter why | It is how the fastest moves are made. The A100 | It is the fastest way a control is imposed. The A100 |
| 10 | `data/glossary.json` | known-good die why | running chips hot to shake out early failures, back onto the wafer. | running chips hot to force early failures, back onto the wafer. |
| 11 | `data/glossary.json` | License Exception NAC why | It is the valve in an otherwise closed door: a notification | It is the one way through an otherwise closed policy: a notification |
| 12 | `data/glossary.json` | License Exception AIA plain | as the open door in a worldwide license requirement. | as the exception inside a worldwide license requirement. |
| 13 | `data/glossary.json` | License Exception AIA why | The rule was disowned in May 2025 but never repealed, so AIA | BIS said in May 2025 that it would not enforce the rule, but the rule was never repealed, so AIA |
| 14 | `data/glossary.json` | 15 CFR why | which is why the disowned Diffusion rule still binds. | which is why the unenforced Diffusion rule still binds. |
| 15 | `data/glossary.json` | metrology plain | Inspection is the related job of hunting for flaws. | Inspection is the related job of finding flaws. |
| 16 | `data/glossary.json` | node why | rules and comparisons that lean on them are unreliable | rules and comparisons that rely on them are unreliable |
| 17 | `data/glossary.json` | probe card why | probe card supply and lead time gate how fast a new accelerator | probe card supply and lead time set how fast a new accelerator |
| 18 | `data/glossary.json` | scale-up network why | Scale-up bandwidth sets how large a model can be trained or served without choking, and | Scale-up bandwidth sets how large a model can be trained or served before the network becomes the limit, and |
| 19 | `data/glossary.json` | subject to the EAR why | The phrase decides who has to care. A Dutch | The phrase decides who the rules apply to. A Dutch |
| 20 | `data/glossary.json` | transistor why | and the sheer difficulty of doing that is why | and the difficulty of doing that is why |
| 21 | `data/glossary.json` | TSV plain | in the way a lift shaft makes a tall building usable. | in the way an elevator shaft makes a tall building usable. |
| 22 | `data/glossary.json` | wafer why | and this $11.4 billion market sits underneath trillions of dollars of downstream value. | and this $11.4 billion market supports trillions of dollars of downstream value. |
| 23 | `data/glossary.json` | wafer fab equipment why | is the best early read on how much new chip capacity is being built | is the best early indicator of how much new chip capacity is being built |
| 24 | `data/glossary.json` | scanner why | so scanner is the word behind most of the export-control story. | so the scanner is the tool most of the export-control story is about. |
| 25 | `data/glossary.json` | plasma why | either adds a film or eats one away, which is why | either adds a film or removes one, which is why |
| 26 | `data/glossary.json` | dielectric why | How much signal a dielectric soaks up sets how fast | How much signal a dielectric absorbs sets how fast |
| 27 | `data/glossary.json` | laminate plain | A low-loss laminate soaks up little of the signal | A low-loss laminate absorbs little of the signal |
| 28 | `data/glossary.json` | coater/developer why | one of the tightest grips in the tool industry. | one of the highest shares in the tool industry. |
| 29 | `data/glossary.json` | back end why | and the back end is the part of the chain China is closest to owning. | and the back end is the part of the chain where China is closest to self-sufficiency. |
| 30 | `data/glossary.json` | high-volume manufacturing why | until then a process exists on paper and pilot lines. | until then a process exists only on pilot lines. |
| 31 | `data/glossary.json` | glass cloth why | and it is running flat out. | and its plants are running at full capacity. |
| 32 | `data/glossary.json` | base die why | That change hands TSMC a position inside a product it does not make | That change gives TSMC a share of a product it does not make |
| 33 | `data/glossary.json` | memory bandwidth density why | which is why the HBM control works where the chip controls leaked. | which is why the HBM control works where the chip controls let parts through. |
| 34 | `data/glossary.json` | wafers per month why | and almost none of it is advanced, which is the whole shape of the contest. | and almost none of it is advanced, and that gap is what the contest is about. |
| 35 | `data/glossary.json` | pitch why | Pitch is the honest measure of how fine a process prints. | Pitch is the reliable measure of how fine a process prints. |
| 36 | `data/glossary.json` | mature node why | and is going domestic there on a visible timetable | and is moving to domestic suppliers there on a visible timetable |
| 37 | `data/glossary.json` | consignee why | The 2026 UAE rule attaches its favor to a list of consignees | The 2026 UAE rule attaches its terms to a list of consignees |
| 38 | `data/glossary.json` | MOFCOM why | Beijing's retaliation goes at the inputs, and MOFCOM | Beijing's retaliation targets the raw materials, and MOFCOM |
| 39 | `data/glossary.json` | Macau plain | US export controls name China and Macau together to close that door, and | US export controls name China and Macau together to close that route, and |
| 40 | `data/glossary.json` | specialty gases plain | arrive by the metric ton and are usually made at the fab fence. | arrive by the metric ton and are usually made on the fab site. |
| 41 | `data/glossary.json` | rare earths why | and claimed reach over any foreign product | and claimed jurisdiction over any foreign product |
| 42 | `data/glossary.json` | hybrid bonding why | Taller, cooler memory stacks wait on this step, only two suppliers | Taller, cooler memory stacks depend on this step, only two suppliers |
| 43 | `data/glossary.json` | photoresist why | Japan supplies most of the world's photoresist, between 75 and 90 percent on published estimates, the largest maker is now owned outright by a Japanese state fund, and each resist is approved per layer per chip per fab so switching supplier takes years. | Japan supplies most of the world's photoresist, between 75 and 90 percent on published estimates, and the largest maker is now owned outright by a Japanese state fund. Each resist is approved per layer per chip per fab, so switching supplier takes years. |
| 44 | `data/glossary.json` | NVLink why | and the reason the rest of the industry created the UALink standard to break it. | and the reason the rest of the industry created the UALink standard to compete with it. |
| 45 | `data/glossary.json` | panel-level packaging plain | It is the industry's escape route from the size limits of a 300 mm wafer. | It is the industry's way around the size limits of a 300 mm wafer. |
| 46 | `data/glossary.json` | wafer sort why | now saves the eight memory stacks and the substrate that a bad die would otherwise take down with it. | now saves the eight memory stacks and the substrate that a bad die would otherwise waste. |
| 47 | `data/glossary.json` | burn-in why | so burn-in has become insurance on everything upstream. | so burn-in now protects everything else in the package. |
| 48 | `data/glossary.json` | qualification why | Qualification, counted in quarters, is the clock that makes a second source slow, and | Qualification, counted in quarters, is what makes a second source slow, and |
| 49 | `data/glossary.json` | RISC-V why | and Chinese designers are adopting it to escape a design dependency on foreign firms. | and Chinese designers are adopting it to end their dependence on foreign firms for processor cores. |
| 50 | `data/glossary.json` | baseboard why | Rack-scale systems such as the NVL72 do away with the baseboard and wire 72 GPUs together directly. | Rack-scale systems such as the NVL72 have no baseboard and wire 72 GPUs together directly. |
| 51 | `data/glossary.json` | reexport why | Without a hold on reexports the rules would only bind American ports. | Without a rule on reexports, the controls would bind only American ports. |
| 52 | `data/glossary.json` | presumption of denial plain | and the exporter has to displace that. | and the exporter has to overcome that. |
| 53 | `data/glossary.json` | License Exception LPP why | so the framework still does work. | so the framework still has effect. |
| 54 | `data/export-controls-timeline.json` | 2018-04-15 ZTE summary | The order barred all US persons from exporting anything to ZTE, cutting off Qualcomm processors and Android licensing and halting most of ZTE's production within weeks. | The order barred all US persons from exporting anything to ZTE, which ended its supply of Qualcomm processors and its Android licensing and halted most of its production within weeks. |
| 55 | `data/export-controls-timeline.json` | 2018-10-30 Jinhua summary | The listing cut Jinhua off from Applied Materials, Lam and KLA tools mid-installation and the fab never reached volume production. It was the first use of the Entity List against a Chinese memory maker and the template for later chip listings. | The listing stopped deliveries of Applied Materials, Lam and KLA tools mid-installation, and the fab never reached volume production. It was the first use of the Entity List against a Chinese memory maker and the model for later chip listings. |
| 56 | `data/export-controls-timeline.json` | 2019-05-16 Huawei summary | The action cut Huawei off from Google Mobile Services, Intel and Xilinx parts and from US EDA tools. | The listing ended Huawei's access to Google Mobile Services, Intel and Xilinx parts and US EDA tools. |
| 57 | `data/export-controls-timeline.json` | 2020-05-15 FDPR summary | TSMC stopped taking new HiSilicon orders within days and cut off shipments after 14 September 2020. | TSMC stopped taking new HiSilicon orders within days and stopped shipments after 14 September 2020. |
| 58 | `data/export-controls-timeline.json` | 2020-08-17 FDPR summary | the rule made even off-the-shelf merchant chips unavailable to Huawei. | the rule made even standard merchant chips unavailable to Huawei. |
| 59 | `data/export-controls-timeline.json` | 2020-10-17 Export Control Law summary | Every Chinese move since, from the gallium licensing | Every Chinese measure since, from the gallium licensing |
| 60 | `data/export-controls-timeline.json` | 2020-12-18 SMIC summary | The listing killed SMIC's plan to buy an ASML EUV scanner | The listing ended SMIC's plan to buy an ASML EUV scanner |
| 61 | `data/export-controls-timeline.json` | 2023-09-01 Dutch DUV summary | Chinese customers pulled orders forward through 2023 and 2024, and China rose | Chinese customers ordered ahead of the restriction through 2023 and 2024, and China rose |
| 62 | `data/export-controls-timeline.json` | 2025-01-13 AI Diffusion summary | China, Russia and the rest of Country Group D:5 got neither exception. | China, Russia and the rest of Country Group D:5 received neither exception. |
| 63 | `data/export-controls-timeline.json` | 2025-01-16 foundry rule summary | The rule followed the discovery that a TSMC-made die had ended up inside a Huawei Ascend 910B. | The rule followed the discovery that a TSMC-made die had been found inside a Huawei Ascend 910B. |
| 64 | `data/export-controls-timeline.json` | 2025-05-15 Gulf deals summary | The deals substituted bilateral, security-conditioned arrangements for the rescinded rule's country caps. | The deals substituted bilateral, security-conditioned arrangements for the unenforced rule's country caps. |
| 65 | `data/export-controls-timeline.json` | 2025-07-14 H20 summary | AMD received the same signal for the MI308. | AMD received the same assurance for the MI308. |
| 66 | `data/export-controls-timeline.json` | 2025-07-14 H20 summary | Beijing then pushed back: regulators raised | Beijing then resisted: regulators raised |
| 67 | `data/export-controls-timeline.json` | 2025-09-29 affiliates summary | Industry warned it could sweep in thousands of previously unlisted companies, and it was the trigger that pulled Nexperia into scope two weeks later. | Industry warned it could bring in thousands of previously unlisted companies, and it was what brought Nexperia into scope two weeks later. |
| 68 | `data/export-controls-timeline.json` | 2025-11-10 truce summary | China moved first and in two steps: | China acted first, in two steps: |
| 69 | `data/export-controls-timeline.json` | 2026-03-19 Super Micro summary | staged dummy servers to fool auditors | staged dummy servers to deceive auditors |
| 70 | `data/control-flows.json` | equipment flow, state 5 label | Foreign-owned fabs in China lose their VEU cover | Foreign-owned fabs in China lose their VEU authorization |
| 71 | `data/control-flows.json` | minerals flows, first state label (two flows) | China's Export Control Law builds the licensing machinery | China's Export Control Law creates the licensing system |
| 72 | `data/control-flows.json` | minerals to everyone else, state 4 label | Reach claimed over foreign goods above 0.1 percent | Jurisdiction claimed over foreign goods above 0.1 percent |
| 73 | `data/control-flows.json` | AI chips to the rest of the world, state 4 label | named consignees ship licence-free | named consignees ship license-free |
| 74 | `data/control-flows.json` | industrial policy flow, state 6 label | 25 percent tariff on chips crossing America | 25 percent tariff on chips passing through America |
| 75 | `data/landscape.json` | B200 notes | It set the template every 2025-2026 part copies | It set the pattern every 2025-2026 part copies |
| 76 | `data/landscape.json` | B300 notes | with 12-high HBM3E stacks lifting capacity to 288 GB | with 12-high HBM3E stacks raising capacity to 288 GB |
| 77 | `data/landscape.json` | Rubin notes | The same split runs through NVLink, at 3 TB/s | The same disagreement applies to NVLink, at 3 TB/s |
| 78 | `data/landscape.json` | H20 notes | a chip built to sit inside the rules still needed a license | a chip built to comply with the rules still needed a license |
| 79 | `data/landscape.json` | H800 notes | the loss shows up in long-context inference instead. | the loss appears in long-context inference instead. |
| 80 | `data/landscape.json` | H100 notes | which is why the H200 became the chip Washington eventually let into China. | which is why the H200 became the chip Washington eventually allowed into China. |
| 81 | `data/landscape.json` | MI355X notes | with no rack fabric to answer NVL72. | with no rack fabric to match NVL72. |
| 82 | `data/landscape.json` | MI455X notes | which is the whole positioning: win on capacity | which is its positioning: win on capacity |
| 83 | `data/landscape.json` | MI300X notes | and the first to break a data center GPU into a dozen chiplets | and the first to split a data center GPU into a dozen chiplets |
| 84 | `data/landscape.json` | TPU v7 notes | The chip that made a credible non-Nvidia training and inference stack real at hyperscale | The chip that proved a non-Nvidia training and inference stack works at hyperscale |
| 85 | `data/landscape.json` | TPU 8i notes | Its stablemate TPU 8t is the training part | Its companion TPU 8t is the training part |
| 86 | `data/landscape.json` | TPU v6e notes | Bandwidth pins the memory down even though Google will not: | Bandwidth identifies the memory even though Google does not: |
| 87 | `data/landscape.json` | Trainium3 notes | sidesteps the CoWoS-S and CoWoS-L queue that gates everyone else. | avoids the CoWoS-S and CoWoS-L queue that limits everyone else. |
| 88 | `data/landscape.json` | Maia 200 notes | The odd one out among 2026 flagships: | The exception among 2026 flagships: |
| 89 | `data/landscape.json` | MTIA v2 notes | backed by 256 MB of on-chip SRAM, in a 90 W envelope. | backed by 256 MB of on-chip SRAM, at 90 W. |
| 90 | `data/landscape.json` | Gaudi 3 notes | The only merchant AI accelerator to bet entirely on standard Ethernet for scale-up | The only merchant AI accelerator to rely entirely on standard Ethernet for scale-up |
| 91 | `data/landscape.json` | Gaudi 3 notes | It is also the end of the line: Intel canceled | It is also the last of its line: Intel canceled |
| 92 | `data/landscape.json` | Gaudi 2 notes | The chip that set the Ethernet bet Gaudi 3 inherited: | The chip that made the Ethernet choice Gaudi 3 inherited: |
| 93 | `data/landscape.json` | WSE-3 notes | That removes the packaging and memory chokepoints that gate everyone else | That removes the packaging and memory chokepoints that limit everyone else |
| 94 | `data/landscape.json` | Ascend 910B notes | and the evidence that export controls bite. | and the evidence that export controls have effect. |
| 95 | `data/landscape.json` | Ascend 910C notes | reaching Huawei through Sophgo before TSMC cut it off. Huawei's answer to weak per-chip performance is brute-force scale, and CloudMatrix 384 beats a GB200 NVL72 on aggregate BF16 while burning about four times the power. | reaching Huawei through Sophgo before TSMC stopped supplying it. Huawei's answer to weak per-chip performance is scale, and CloudMatrix 384 beats a GB200 NVL72 on aggregate BF16 while using about four times the power. |
| 96 | `data/landscape.json` | Siyuan 590 notes | The purest read on the SMIC bottleneck, because unlike Huawei, Cambricon has no smuggled TSMC die bank to fall back on. | The clearest measure of the SMIC bottleneck, because unlike Huawei, Cambricon has no stock of smuggled TSMC dies to draw on. |
| 97 | `data/landscape-notes.md` | B300 | Swapping 8-high HBM3E for 12-high lifts capacity from 192 GB to 288 GB | Swapping 8-high HBM3E for 12-high raises capacity from 192 GB to 288 GB |
| 98 | `data/landscape-notes.md` | B300 | the configuration Micron, SK hynix and Samsung tooled up for | the configuration Micron, SK hynix and Samsung built 12-high HBM3E for |
| 99 | `data/landscape-notes.md` | B300 | half again what B200 delivers, while FP16 is unchanged | 1.5 times what B200 delivers, while FP16 is unchanged |
| 100 | `data/landscape-notes.md` | H200 China | the H200's 4,800 GB/s and roughly 15,800 points clear both bars | the H200's 4,800 GB/s and roughly 15,800 points fall below both limits |
| 101 | `data/landscape-notes.md` | MI355X | with no rack-scale fabric to answer NVL72 | with no rack-scale fabric to match NVL72 |
| 102 | `data/landscape-notes.md` | TPU v7 | The headline is how many chips work as one: | The main figure is how many chips work as one: |
| 103 | `data/landscape-notes.md` | TPU v7 | The rest of the supply-chain detail is thin because Google discloses none of it: | Little else about the supply chain is known, because Google discloses none of it: |
| 104 | `data/landscape-notes.md` | Trainium3 | and it sidesteps the CoWoS-S and CoWoS-L queue that gates everyone else | and it avoids the CoWoS-S and CoWoS-L queue that limits everyone else |
| 105 | `data/landscape-notes.md` | Trainium3 | after Samsung lost the socket. | after Samsung lost the order. |
| 106 | `data/landscape-notes.md` | Trainium3 | meaning FP4 buys no throughput at all on this part | meaning FP4 adds no throughput at all on this part |
| 107 | `data/landscape-notes.md` | Maia 200 | in a 750 W envelope for the whole system on chip | at 750 W for the whole system on chip |
| 108 | `data/landscape-notes.md` | MTIA 400 | so each generation drops into halls that already exist | so each generation fits into halls that already exist |
| 109 | `data/landscape-notes.md` | MTIA 400 | but the deck is registration-gated, so this page keeps only the ratios | but the slides are available only on registration, so this page keeps only the ratios |
| 110 | `data/landscape-notes.md` | Jalapeño | The supply chain is entirely Broadcom and its orbit: | The supply chain is entirely Broadcom and its partners: |
| 111 | `data/landscape-notes.md` | Gaudi 3 | the only AI accelerator sold on the open market that bet entirely on standard Ethernet | the only AI accelerator sold on the open market that relies entirely on standard Ethernet |
| 112 | `data/landscape-notes.md` | Gaudi 3 | The absence that killed it is FP4: with no four-bit datapath, Gaudi 3 fell out of contention for 2026 inference work just as the market moved to four-bit arithmetic. | What ended it is the lack of FP4: with no four-bit datapath, Gaudi 3 lost its place in 2026 inference work just as the market moved to four-bit arithmetic. |
| 113 | `data/landscape-notes.md` | Ascend 910C | reaching Huawei through Sophgo before TSMC cut it off, and that Huawei stockpiled | reaching Huawei through Sophgo before TSMC stopped supplying it, and that Huawei stockpiled |
| 114 | `data/landscape-notes.md` | Ascend 910C | Huawei's answer is brute force: CloudMatrix 384 | Huawei's answer is scale: CloudMatrix 384 |
| 115 | `data/landscape-notes.md` | Siyuan 590 | That makes Cambricon the purest read on the SMIC bottleneck, because unlike Huawei it has no smuggled TSMC die bank to fall back on. | That makes Cambricon the clearest measure of the SMIC bottleneck, because unlike Huawei it has no stock of smuggled TSMC dies to draw on. |
| 116 | `data/landscape-notes.md` | Siyuan 590 | Cambricon has been cut off from US-origin technology since | Cambricon has been barred from US-origin technology since |
| 117 | `data/landscape-notes.md` | H20 | a chip built to sit inside the rules still needed a license | a chip built to comply with the rules still needed a license |
| 118 | `data/landscape-notes.md` | H800 | the loss shows up in long-context inference instead. | the loss appears in long-context inference instead. |
| 119 | `data/landscape-notes.md` | H100 | the chip Washington eventually let into China. | the chip Washington eventually allowed into China. |
| 120 | `data/landscape-notes.md` | MI300X | the first to break a data center GPU into a dozen chiplets | the first to split a data center GPU into a dozen chiplets |
| 121 | `data/landscape-notes.md` | TPU v6e | Bandwidth pins the memory down even though Google will not: | Bandwidth identifies the memory even though Google does not: |
| 122 | `data/landscape-notes.md` | MTIA v2 | backed by 256 MB of on-chip SRAM, in a 90 W envelope. | backed by 256 MB of on-chip SRAM, at 90 W. |
| 123 | `data/landscape-notes.md` | Gaudi 2 | The chip that set the Ethernet bet Gaudi 3 inherited: | The chip that made the Ethernet choice Gaudi 3 inherited: |
| 124 | `data/landscape-notes.md` | Ascend 910B | and the evidence that export controls bite. | and the evidence that export controls have effect. |
| 125 | `data/chokepoint-matrix.json` | EDA trend (spelling) | after the 2025 US export-licence episode | after the 2025 US export-license episode |
| 126 | `data/chokepoint-matrix.json` | silicon wafers note | sit inside the five-point Other bucket | sit inside the five-point Other column |
| 127 | `data/chokepoint-matrix.json` | specialty gases note | the Japanese column understates Japan badly and the row understates China's leverage | the Japanese column understates Japan by a wide margin and the row understates China's leverage |
| 128 | `data/chokepoint-matrix.json` | specialty gases note | a position that hardened after Ukrainian neon capacity went offline in 2022 | a position that strengthened after Ukrainian neon production stopped in 2022 |
| 129 | `data/chokepoint-matrix.json` | DUV note | folding i-line in would roughly double | including i-line would roughly double |
| 130 | `data/chokepoint-matrix.json` | mature logic method | on a broader definition that sweeps in discretes, analog and power | on a broader definition that includes discretes, analog and power |
| 131 | `data/chokepoint-matrix.json` | DRAM note | This is revenue, and bits would tell a different story: | This is revenue, and bits would give a different picture: |
| 132 | `data/chokepoint-matrix.json` | DRAM note | it is the bucket holding CXMT, Nanya, Winbond and PSMC | it is the column holding CXMT, Nanya, Winbond and PSMC |
| 133 | `data/chokepoint-matrix.json` | ATP note | The 20-point 'various countries' bucket is not attributed | The 20-point 'various countries' column is not attributed |
| 134 | `data/chokepoint-matrix.json` | substrates note | which is what the 2021 review was complaining about. | which is what the 2021 review pointed out. |
| 135 | `data/chokepoint-matrix-notes.md` | Where the numbers come from | it still carries CSET's original 2019 figures, and it is worth being exact about which. It carries | it still carries CSET's original 2019 figures, and the exact list matters. It carries |
| 136 | `data/chokepoint-matrix-notes.md` | Where the numbers come from | so there was nothing for ETO to lift. | so there was nothing for ETO to take. |
| 137 | `data/chokepoint-matrix-notes.md` | Two derived columns | which flatters concentration slightly in the rows that have a large one | which overstates concentration slightly in the rows that have a large one |
| 138 | `data/chokepoint-matrix-notes.md` | Converting firm shares | Two conversions are contestable, and the segment notes call them out. | Two conversions are contestable, and the segment notes say so. |
| 139 | `data/chokepoint-matrix-notes.md` | Where the numbers are weakest | the year-end wafers-per-month ladder that would let anyone compute it | the year-end wafers-per-month series that would let anyone compute it |
| 140 | `data/control-thresholds.json` | 3A090.b note | it is what turns the control from a wall into a notification regime | it is what turns the control from a ban into a notification regime |
| 141 | `data/control-thresholds.json` | 3A090.c note | It is the control that bites hardest on Chinese accelerators | It is the control that hurts Chinese accelerators most |
| 142 | `data/control-thresholds.json` | License Exception HBM note | The valve that keeps the legitimate HBM trade flowing while 3A090.c stays broad. | The exception that keeps the legitimate HBM trade moving while 3A090.c stays broad. |
| 143 | `data/control-thresholds.json` | 4A090 note | and the entry most of the smuggling cases actually turn on | and the entry most of the smuggling cases turn on |
| 144 | `data/control-thresholds.json` | H200 TPP ceiling note | The first threshold in the regime that opens a door: it draws | The first threshold in the regime that permits rather than denies: it draws |
| 145 | `data/control-thresholds.json` | volume condition note | An industrial-policy condition dressed as an export control: | An industrial-policy condition written as an export control: |
| 146 | `data/control-thresholds.json` | DRAM definition note | because it did not survive contact with a fab. | because it did not work against a real fab. |
| 147 | `data/control-thresholds.json` | DUV overlay note | because multipatterning lives or dies on layer-to-layer alignment | because multipatterning depends entirely on layer-to-layer alignment |
| 148 | `data/control-thresholds.json` | de minimis note | It is aimed squarely at ASML | It is aimed at ASML |
| 149 | `data/control-thresholds.json` | de minimis note | keys the zero threshold to equipment meeting | ties the zero threshold to equipment meeting |
| 150 | `data/control-thresholds.json` | 3B001.d note | dissolved into the general 3B001 list a year later, which multilateralised it. | dissolved into the general 3B001 list a year later, which made it a multilateral control. |
| 151 | `data/control-thresholds.json` | affiliates rule note | due to snap back on 9 November 2026 unless extended | due to return on 9 November 2026 unless extended |
| 152 | `data/control-thresholds.json` | AI Diffusion allocations note | never enforced, rescinded 13 May 2025 with BIS instructing enforcement officials to stand down before the 15 May compliance date. | never enforced: on 13 May 2025, before the 15 May compliance date, BIS told its enforcement officials not to enforce it. |
| 153 | `data/control-thresholds.json` | UVEU note | which suggests the idea survived the rescission even though the rule did not. | which suggests the idea survived even though the rule was set aside. |
| 154 | `data/control-thresholds.json` | model weights note | The seam between chip governance and model governance | The point where chip governance meets model governance |
| 155 | `src/template.html` | How to read a chapter | to stand up an alternative: | to build an alternative: |
| 156 | `src/template.html` | Suppliers ladder heading | Stages, thinnest first | Stages, most concentrated first |
| 157 | `src/template.html` | Suppliers country heading | Which countries feed which stages | Which countries supply which stages |
| 158 | `src/template.html` | AI Chips specs line | the more calculations a chip gets through. | the more calculations a chip can do. |
| 159 | `src/template.html` | controls legend, Prohibited | No license to be had, or a flat ban. | No license is available, or an outright ban. |
| 160 | `src/template.html` | controls legend, Policy | Money and tariffs, with no gate on shipment. | Money and tariffs; nothing stops a shipment. |
| 161 | `src/template.html` | controls mode group aria-label | aria-label="Order the moves" | aria-label="Order the events" |
| 162 | `content/01-design-and-eda.md` | specimenCaption | the largest patch a scanner can print in one shot | the largest area a scanner can print in one shot |
| 163 | `content/03-chemicals-gases-and-photoresist.md` | specimenCaption | The steel-grey panel on the back wall | The steel-gray panel on the back wall |
| 164 | `content/05-photomasks-and-pellicles.md` | specimenCaption | The dark blue band round the top edge is the mirror coating; in life it is 280 nm thick, so it is drawn far thicker than it is. | The dark blue band around the top edge is the mirror coating; the real coating is 280 nm thick, so it is drawn far thicker than it is. |
| 165 | `content/13-test-and-assembly.md` | specimenCaption | The gap between card and wafer is exaggerated; in life it is a millimeter or two. | The gap between card and wafer is exaggerated; the real gap is a millimeter or two. |
| 166 | `content/14-systems-and-networking.md` | specimenCaption | with the module frames standing about 30 mm proud of the board. The two nickel-grey squares | with the module frames standing about 30 mm above the board. The two nickel-gray squares |
| 167 | `content/15-data-centers-and-power.md` | specimenCaption | The grey steel power shelves | The gray steel power shelves |
| 168 | `data/suppliers.json` | Cadence aiRelevance | Emulation capacity is a gating item on AI chip schedules | Emulation capacity is a limiting item on AI chip schedules |
| 169 | `data/suppliers.json` | Empyrean role | the American EDA tools that export controls can switch off. | the American EDA tools that export controls can withdraw. |
| 170 | `data/suppliers.json` | SiFive role | RISC-V is the licence-free alternative to Arm | RISC-V is the license-free alternative to Arm |
| 171 | `data/suppliers.json` | Nvidia role | It also sells the CUDA software stack that locks developers in. | It also sells the CUDA software stack that ties developers to its hardware. |
| 172 | `data/suppliers.json` | Meta aiRelevance | MTIA shows how much inference volume a single application company can pull off merchant GPUs. | MTIA shows how much inference volume a single application company can move off merchant GPUs. |
| 173 | `data/suppliers.json` | Qualcomm aiRelevance | Qualcomm is attacking inference, where | Qualcomm is targeting inference, where |
| 174 | `data/suppliers.json` | Cerebras aiRelevance | Wafer-scale integration sidesteps both HBM supply and advanced packaging capacity | Wafer-scale integration avoids both HBM supply and advanced packaging capacity |
| 175 | `data/suppliers.json` | HiSilicon aiRelevance | the benchmark for how far domestic substitution has got. | the benchmark for how far domestic substitution has come. |
| 176 | `data/suppliers.json` | d-Matrix aiRelevance | In-memory compute attacks the memory bandwidth wall | In-memory compute addresses the memory bandwidth wall |
| 177 | `data/suppliers.json` | Shin-Etsu role | so it touches three separate stages of the chain. | so it supplies three separate stages of the chain. |
| 178 | `data/suppliers.json` | Tokuyama aiRelevance | Polysilicon purity sets the floor on wafer defect density, which sets the yield on large AI dies. | Polysilicon purity sets the lowest defect density a wafer can reach, which sets the yield on large AI dies. |
| 179 | `data/suppliers.json` | DuPont role | Supplies chemical mechanical planarisation pads, photoresist, dry film and electroplating chemistry for interconnect and packaging. Its CMP pad line is the standard consumable for wafer planarisation. | Supplies chemical mechanical planarization pads, photoresist, dry film and electroplating chemistry for interconnect and packaging. Its CMP pad line is the standard consumable for wafer planarization. |
| 180 | `data/suppliers.json` | DuPont aiRelevance | Every metal layer on an AI die is planarised with a CMP pad | Every metal layer on an AI die is planarized with a CMP pad |
| 181 | `data/suppliers.json` | Fujimi role | and to planarise metal and dielectric layers | and to planarize metal and dielectric layers |
| 182 | `data/suppliers.json` | Fujimi aiRelevance | Planarisation quality limits how many metal layers | Planarization quality limits how many metal layers |
| 183 | `data/suppliers.json` | Applied Materials role | ion implantation, chemical mechanical planarisation and electron beam inspection. It owns more process steps than any other vendor. | ion implantation, chemical mechanical planarization and electron beam inspection. It supplies tools for more process steps than any other vendor. |
| 184 | `data/suppliers.json` | Canon aiRelevance | which makes it strategically watched. | which makes it closely watched. |
| 185 | `data/suppliers.json` | Gigaphoton aiRelevance | Keeps a second source alive for DUV light, the workhorse behind multipatterning at mature and middle nodes. | Keeps a second source of DUV light in business, and DUV light is what multipatterning at mature and middle nodes runs on. |
| 186 | `data/suppliers.json` | VDL role | It is one of the anchor suppliers in the Brainport cluster | It is one of the main suppliers in the Brainport cluster |
| 187 | `data/suppliers.json` | Comet aiRelevance | are made by very few firms and gate plasma etch tool builds. | are made by very few firms and limit plasma etch tool builds. |
| 188 | `data/suppliers.json` | Ferrotec aiRelevance | so their supply sets a floor on fab operating capacity. | so their supply limits fab operating capacity. |
| 189 | `data/suppliers.json` | Hoya role | Blank defect levels are the gating item for EUV mask yield. | Blank defect levels are the limiting factor for EUV mask yield. |
| 190 | `data/suppliers.json` | Naura role | It has grown into the global top ten equipment vendors on the back of domestic substitution. | It has grown into the global top ten equipment vendors through domestic substitution. |
| 191 | `data/suppliers.json` | SCREEN aiRelevance | Cleaning defectivity compounds across hundreds of steps and shows up as yield loss | Cleaning defectivity compounds across hundreds of steps and appears as yield loss |
| 192 | `data/suppliers.json` | SMIC aiRelevance | set the hard ceiling on how many | set the ceiling on how many |
| 193 | `data/suppliers.json` | Samsung Memory aiRelevance | Samsung is the only firm that makes HBM, logic at the leading edge and packaging under one roof. | Samsung is the only firm that makes HBM, leading-edge logic and packaging itself. |
| 194 | `data/suppliers.json` | Amkor aiRelevance | Domestic packaging capacity is the missing link in reshoring AI chip manufacture to the United States. | Domestic packaging capacity is what reshoring AI chip manufacture to the United States still lacks. |
| 195 | `data/suppliers.json` | Powertech role | Specialises in memory assembly and test | Specializes in memory assembly and test |
| 196 | `data/suppliers.json` | Chipbond role | Specialises in gold and copper bumping | Specializes in gold and copper bumping |
| 197 | `data/suppliers.json` | Kulicke and Soffa role | Makes wire bonders, the workhorse of low-cost packaging | Makes wire bonders, the standard tool of low-cost packaging |
| 198 | `data/suppliers.json` | Nittobo aiRelevance | so its weaving capacity gates board supply. | so its weaving capacity limits board supply. |
| 199 | `data/suppliers.json` | Panasonic Industry role | where signal loss at 112 Gbps determines whether a link closes. | where signal loss at 112 Gbps determines whether a link works. |
| 200 | `data/suppliers.json` | Teradyne aiRelevance | The second source for the test capacity that gates AI chip output. | The second source for the test capacity that limits AI chip output. |
| 201 | `data/suppliers.json` | Aehr role | to weed out early-life failures | to find early-life failures |
| 202 | `data/suppliers.json` | Quanta aiRelevance | and their capacity paces deployment. | and their capacity sets the pace of deployment. |
| 203 | `data/suppliers.json` | Schneider aiRelevance | now gate AI data center schedules. | now set AI data center schedules. |
| 204 | `data/suppliers.json` | Siemens Energy role | and has an order book stretching years out as data center and electrification demand collides with limited manufacturing capacity. | and has orders booked years ahead, because data center and electrification demand exceeds its manufacturing capacity. |
| 205 | `src/app.js` | controls board empty state | No move has touched this flow yet. | No event has changed this flow yet. |
| 206 | `build/build.js` | geopolitics dek fallback | how the export-control campaign has unfolded since 2018, and where the chips end up. | how the export-control campaign has unfolded since 2018, and where the chips go. |
| 207 | `build/modules/social.js` | Export Controls social card | Every move since 2018, what can still flow to China, and each firm's China sales. | Every rule since 2018, what can still be sold to China, and each firm's China sales. |
| 208 | `build/modules/summary-a.js` | Malaysia role line | Test and assembly, the last stop before the server | Test and assembly, the last stage before the server |
| 209 | `build/build.js` | Export Controls dek | fill('CONTROLS_DEK', `Every move since 2018, what can still flow to China, and each firm's China sales.`); | fill('CONTROLS_DEK', `Every rule since 2018, what can still be sold to China, and each firm's China sales.`); |
| 210 | `src/app.js` | controls year and flow counts, aria-labels (three places) | (n === 1 ? ' move' : ' moves') | (n === 1 ? ' event' : ' events') |
| 211 | `data/control-thresholds.json` | H200 TPP ceiling note (second pass, the checker flags rather than) | The first threshold in the regime that permits rather than denies: it draws | The first threshold in the regime that permits instead of denying: it draws |
