# Card fields in plain words, chapters 01 to 15

The author read the Deposition and Etch card's "Why substitution is possible" text and asked why so simple a question got so complex an answer. The text had been written to defend the rating against the four substitutability tests; the reader wants the answer. This pass rewrites the reader-facing card fields of the fifteen stage chapters so a bright teenager can read each once and teach it back.

Fields in scope: `card.substitutability.test` (one short sentence, the fact that sets the rating), `card.substitutability.why` (two to four plain sentences: who else can do it today, what a newcomer would have to do, how long it takes), `card.chinaStatus`, `card.usStatus`, and `card.costSignal` only where it was unclear. Every fact, number, firm name and rating is kept. Cut: "a well-funded actor that is not fenced out", "the clock", "leading node" and "qualified" said without saying what they mean, "second source", clefts, "X, not Y" contrasts. Percent signs in the rewritten status sentences become "percent", the site's prose convention; numbers in `leaders[].share` and `costSignal` heads are data and keep "%".

## Verdict

Sixty-five fields changed across the fifteen chapters: `test`, `why`, `chinaStatus` and `usStatus` in every chapter, and `costSignal` in chapters 05, 06, 08, 10 and 11, where a word ("leading-edge", "billings", "density gain per node", "data interface", "guided investors to 60% compound annual growth") stood between the reader and the number. Every other field, and every chapter body, is byte-for-byte as before. Every band, number, firm name and source claim survives; where a sentence now names a thing the old one only implied (GlobalWafers of Taiwan, JSR of Japan, Inpria the American startup, Peoria in Arizona, NVLink as Nvidia's, the EUV source as a laser on tin), the fact is in that chapter's body or evidence list.

What the rewrite does, by kind:

- **Answers the question first.** Each `why` now opens with who else can do the thing today, then what a newcomer would have to do, then how long. The Deposition and Etch text the author flagged now reads: four named makers for most steps, switching means testing the new tool on your own line until it matches, two to five years, and the one thin spot is atomic layer deposition, said as "a film one layer of atoms at a time".
- **Names the terms in the sentence that uses them.** Photoresist (the light-sensitive coating), the interposer (the silicon base plate), a reticle (the area a scanner prints in one shot), probe cards (beds of pins), backside power (fed from under the transistors), a picometer (a trillionth of a meter), BIS (the US export control office), Ajinomoto's film (the insulating layer between wiring layers), low-expansion glass (barely swells with heat), a multi-beam writer (the machine that draws the finest patterns onto a mask).
- **Replaces the rating vocabulary with plain words.** "Qualified" and "requalification" become tested and approved on the fab's own line; "leading node" becomes the newest chips; "second source" becomes a second maker; "a well-funded actor that is not fenced out" becomes a newcomer, and where the point was who is allowed to buy, it says so ("a country that is not allowed to buy from any of them").
- **Drops the defensive scaffolding.** "The clock", "the inventor's clock", "the copier's clock", "which is why", "the chokepoint is concentration", "sets the clock, run per chip and counted in quarters against contracts already fixed years ahead".
- **Removes the constructions the checker flags and the ones it does not.** No "X, not Y", no "rather than", no clefts ("What it cannot buy quickly is", "what holds a customer is"), no rhetorical questions, no em dashes, no first person.

Checks after the edit: `node build/build.js` runs with no warnings; `node qa/scripts/check-speak.js` reports no matches; `node qa/scripts/check-integrity.js` is clean apart from the known "has no supplier entry" lines for Nova, Samsung Electronics and Veeco Instruments. Every chapter's front matter parses. The summary view takes the first sentence of `chinaStatus` for a few Extreme chapters, and each of those first sentences now stands on its own.

Two judgment calls to confirm:

- Percent signs in the rewritten status and `why` sentences became "percent" (the site's prose rule). `costSignal` keeps "%" because the build splits it into a number head and a note, and `leaders[].share` is untouched data. Chapter 07's `usStatus` has the most of these.
- The `test` lines that used to open "Rated on the hardest input" (03, 12, 14) keep that framing in plain form ("Rated on photoresist, the hardest input here") so the reader can see the rating covers one part of a chapter that holds several.

Before and after for every field that changed, in chapter order.

## 01-design-and-eda (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Three certified flows exist and none mixes; a fourth has to be written from scratch and foundry-certified

After: Only three complete sets of chip design software exist, and a fourth would have to be written from scratch and approved by the foundry.

**substitutability.why**

Before: Three complete flows exist and they do not mix: the foundry certifies specific tool versions, and timing signed off in one tool is not accepted in another. A well-funded state building a fourth starts from a blank sheet and spends five to ten years on the rare failure cases a foundry has already validated, and CSET judges that Chinese vendors cannot yet support designs at those nodes.

After: Three complete sets of chip design software exist today, and they do not mix. The foundry that makes the chip approves exact versions of each tool, and one tool's sign-off that every signal arrives on time is not accepted by another. A newcomer would have to write a fourth set from nothing, then spend five to ten years finding the rare ways a chip can fail, cases the approved tools already catch. CSET judges that Chinese tools cannot yet handle designs for the newest chips.

**chinaStatus**

Before: Designs competitive accelerators, but cannot yet run a complete leading-edge flow on domestic design software, and CSET at Georgetown University judges that Chinese vendors cannot support designs at those nodes. Washington cut off access to US and German tools for five weeks in 2025, then restored it.

After: China designs competitive AI accelerators, but it cannot yet take a design for the newest chips all the way through on Chinese software, and CSET at Georgetown University judges that Chinese tools cannot support designs at that level. Washington cut off access to US and German tools for five weeks in 2025, then restored it.

**usStatus**

Before: Owns the two largest design-software vendors and the dominant custom-chip design houses, and controls the US-origin technology inside Siemens EDA through export licenses.

After: Home to the two largest design-software vendors and the leading custom-chip design houses. Siemens EDA is German-owned, but the American technology inside it still needs US export licenses.

## 02-silicon-and-wafers (Moderate to substitute, High concentration)

**substitutability.test**

Before: Five firms already qualify at 300 mm, but a fab has to requalify a new source for every chip it makes

After: Five firms already make approved 300 mm wafers, but a fab has to test and approve a new supplier separately for every chip it makes.

**substitutability.why**

Before: Five firms qualify leading-edge 300 mm today, so losing one leaves four, and GlobalWafers showed money can still build a line: a $3.5 billion plant in Texas, the first of its kind in the United States in over twenty years. Qualification sets the clock, run per chip and counted in quarters against contracts already fixed years ahead, so a well-funded actor needs two to five years to close the gap.

After: Five firms make 300 mm wafers good enough for the newest chips, so losing one leaves four. Money can still build a new line: GlobalWafers of Taiwan spent $3.5 billion on a plant in Texas, the first of its kind in the United States in over twenty years. The slow part is approval. A fab tests a new wafer supplier on each chip it makes, each test runs for months, and supply contracts are signed years ahead, so switching takes two to five years.

**chinaStatus**

Before: Made about 93% of the world's polysilicon in 2023, but 98% of that was solar-grade, too impure for chips. Held under 1% of the 300 mm wafer market as of 2021, and supplies only 12% of the wafers its own 300 mm fabs consume.

After: China made about 93 percent of the world's polysilicon in 2023, but 98 percent of it was solar grade, too impure for chips. It held under 1 percent of the 300 mm wafer market as of 2021, and it supplies only 12 percent of the wafers its own 300 mm fabs use.

**usStatus**

Before: No US-headquartered volume wafer maker. Hemlock supplies polysilicon from Michigan; GlobalWafers took a CHIPS award of up to $406m for a $3.5bn Texas plant that opened in May 2025.

After: No American firm makes wafers in volume. Hemlock makes polysilicon in Michigan, and GlobalWafers of Taiwan took a CHIPS Act award of up to $406 million toward a $3.5 billion Texas plant that opened in May 2025.

## 03-chemicals-gases-and-photoresist (Moderate to substitute, High concentration)

**substitutability.test**

Before: Rated on the hardest input, photoresist: Japan makes about four-fifths of it, and Korea's substitution took five years

After: Rated on photoresist, the hardest input here: Japan makes about four-fifths of it, and Korea needed five years to build substitutes.

**substitutability.why**

Before: Each resist formula is approved for one layer of one product at one fab, so a second source means a joint development program. When Japan put resist under individual license for Korea in 2019, Korea kept its fabs running and spent five years funding domestic substitutes, which is the clock a well-funded actor should expect: two to five years, and closer to five at the leading node.

After: Photoresist is the light-sensitive coating that takes the printed pattern onto the wafer. Each formula is approved for one layer of one product at one fab, so a new supplier has to develop its version together with the fab, layer by layer. Korea has run this test: when Japan put resist under individual export licenses in 2019, Korea kept its fabs running and spent five years funding its own substitutes. Expect two to five years, and closer to five for the newest chips.

**chinaStatus**

Before: Cannot make resist for extreme-ultraviolet or leading-edge 193 nm printing, and held under 5% of the photoresist market as of 2021. It refines 99% of the world's primary low-purity gallium and has licensed exports of gallium and germanium since August 2023.

After: China cannot make photoresist for extreme-ultraviolet printing or for the finest 193 nm printing, and it held under 5 percent of the photoresist market as of 2021. It refines 99 percent of the world's primary low-purity gallium, and since August 2023 it has required licenses to export gallium and germanium.

**usStatus**

Before: Strong in filters, containers, polishing slurries and gas delivery through Entegris, DuPont and Air Products. Nearly absent from advanced photoresist since JSR bought Inpria.

After: Strong in filters, containers, polishing slurries and gas delivery, through Entegris, DuPont and Air Products. Nearly absent from advanced photoresist since JSR of Japan bought Inpria, the American startup, in 2021.

## 04-lithography (Very hard to substitute, Extreme concentration)

**substitutability.test**

Before: No second EUV source; only Zeiss can polish the mirrors, and a funded Chinese team has light but no printed chip

After: ASML is the only maker of EUV scanners, only Zeiss can polish their mirrors, and a state-funded Chinese team has made the light but no printed chip.

**substitutability.why**

Before: A well-funded state starting today would have to reproduce meter-wide mirrors polished to within tens of picometers and a source that hits tin droplets 50,000 times a second before it could assemble a scanner. The best-funded attempt so far has made extreme-ultraviolet light and no chip, CSIS reads working systems as out of reach, and no announced program changes this before 2030.

After: Nobody else has ever built an EUV scanner. A newcomer would first have to make mirrors a meter wide and polished smooth to within tens of picometers, a picometer being a trillionth of a meter, and a light source that hits tin droplets with a laser 50,000 times a second. The best-funded attempt so far, in China, has made extreme-ultraviolet light but has printed no chip. CSIS judges working systems out of reach, and no announced program changes that before 2030.

**chinaStatus**

Before: No EUV scanner has ever been sold to a customer in China, and CSIS judges the technology firmly out of reach despite state investment. Shanghai Aishengna Electronic Technology Group, a state-owned firm registered in 2023, is reported to have started producing domestic immersion DUV scanners in 2026. SMEE, the older domestic supplier, holds about 4% of the global i-line market, the coarsest tier, and nothing above it.

After: No EUV scanner has ever been sold to a customer in China, and CSIS judges the technology firmly out of reach despite state investment. Shanghai Aishengna Electronic Technology Group, a state-owned firm registered in 2023, is reported to have started producing Chinese immersion DUV scanners in 2026. SMEE, the older Chinese supplier, holds about 4 percent of the world market for i-line scanners, the coarsest kind, and nothing finer.

**usStatus**

Before: No domestic scanner maker. Washington controls access through Dutch licensing, US-origin subsystems and entity-list rules.

After: No American firm makes scanners. Washington still controls who gets them, through Dutch export licenses, the American-made parts inside each machine, and its entity list of firms that may not be supplied.

## 05-photomasks-and-pellicles (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Three firms make EUV blanks and one sells the actinic inspection tool; three have already walked the path

After: Only three firms make the blank plates for EUV masks, and only Lasertec sells the tool that checks a finished mask in EUV light.

**substitutability.why**

Before: AGC and Hoya took two decades to learn the forty-layer blank, but that was the inventor's clock. Three firms have now done it and the structure of the plate is published, so a well-funded entrant runs on the copier's clock: five to ten years to a qualified blank, and the harder half is Lasertec's actinic inspection, the only tool that sees a mask at the wavelength the scanner uses. Entrants stayed out because the business was too small to fund, which is the one barrier money removes.

After: An EUV mask starts as a blank plate coated with forty layers, and AGC and Hoya took two decades to learn how to make one. Three firms have now done it and the structure of the plate is published, so a newcomer has a map to follow: five to ten years to a plate that fabs accept. The harder half is inspection, because Lasertec sells the only tool that checks a mask in the same EUV light the scanner uses. Others stayed out because the business was too small to be worth the money, and that is the one barrier a big budget removes.

**chinaStatus**

Before: SMIC runs two in-house mask shops in Shanghai, but only for the older g-line, i-line, KrF and ArF tools. There is no Chinese EUV blank, no Chinese tool that inspects a mask at EUV wavelength and no Chinese multi-beam writer.

After: SMIC runs two mask shops of its own in Shanghai, but only for the older g-line, i-line, KrF and ArF scanners. No Chinese firm makes an EUV mask blank, a tool that checks a mask in EUV light, or a multi-beam writer, the machine that draws the finest patterns onto a mask.

**usStatus**

Before: Photronics is the largest mask maker selling to outside customers and KLA supplies inspection tools, but no US firm makes an EUV blank or an EUV-wavelength inspection tool.

After: Photronics is the largest mask maker that sells to outside customers, and KLA makes mask inspection tools, but no American firm makes an EUV mask blank or a tool that checks a mask in EUV light.

**costSignal**

Before: A leading-edge mask set runs roughly $10M to $40M, depending on the node and on the estimate

After: A mask set for the newest chips runs roughly $10M to $40M, depending on the node and on the estimate

## 06-deposition-and-etch (Moderate to substitute, High concentration)

**substitutability.test**

Before: Three or four vendors qualify at most etch and deposition steps; atomic layer deposition is the thin one

After: Most etch and deposition steps have three or four approved tool makers, and atomic layer deposition is the one thin spot.

**substitutability.why**

Before: For most steps a buyer has three or four qualified vendors, so the work is requalification, two to five years at the leading node. The exception is atomic layer deposition, where Chinese suppliers stayed under 1 percent across the same five years they took real share in etch. A well-funded actor that is not fenced out buys from ASM International, Lam, Tokyo Electron and Applied Materials and starts from a qualified tool, which is why China's clock here is the long one.

After: For most steps a fab can already buy the tool from three or four makers: Applied Materials, Lam, Tokyo Electron and ASM International. Switching from one to another means testing the new tool on the fab's own line until it matches, which takes two to five years for the newest chips. The thin spot is atomic layer deposition, which lays down a film one layer of atoms at a time. Chinese tool makers took real share in etch over five years but stayed under 1 percent here, so this is the step where China has the farthest to go.

**chinaStatus**

Before: The strongest Chinese position in any tool segment. China-based suppliers held about 11% of dry etch and 7% of deposition in 2024, but under 1% of atomic layer deposition.

After: China's strongest position in any kind of chipmaking tool. Chinese suppliers held about 11 percent of dry etch and 7 percent of deposition in 2024, but under 1 percent of atomic layer deposition.

**usStatus**

Before: Two of the three largest suppliers are American. Washington controls dry etch, atomic layer deposition and deep-hole deposition tools by export classification number, and by a rule that reaches tools built outside the United States from US technology.

After: Two of the three largest tool makers are American. Washington lists dry etch, atomic layer deposition and deep-hole deposition tools as controlled exports, and one rule reaches tools built outside the United States with American technology.

**costSignal**

Before: No public list prices. Global semiconductor equipment billings were $135.1B in 2025, with wafer processing up 12%.

After: Tool makers publish no list prices. World sales of chipmaking equipment were $135.1B in 2025, with wafer processing tools up 12%.

## 07-metrology-and-inspection (Moderate to substitute, High concentration)

**substitutability.test**

Before: A named second source in every family; KLA sets the standard, and losing it slows yield learning while the line keeps running

After: KLA sets the standard, but every kind of measuring and inspecting tool has a second maker, so losing KLA would slow a fab without stopping it.

**substitutability.why**

Before: The chokepoint is concentration: seven other firms ship qualified tools, and three of them lead a family outright. A well-funded actor that can buy them keeps the ability to run a fab, loses sensitivity and speed of yield learning, and closes the gap in two to five years. An actor that cannot buy is on a far longer clock: Chinese firms were still at 0.8 percent of the segment in 2024.

After: These tools measure and inspect wafers so a fab can find and fix what is going wrong. KLA is the biggest maker, but seven other firms ship approved tools, and three of them lead one kind of tool outright. A fab that loses KLA and buys from the others keeps running; it sees fewer flaws and fixes them more slowly, and it takes two to five years to catch up. A country that is not allowed to buy from any of them has a far longer road: Chinese firms held 0.8 percent of this market in 2024.

**chinaStatus**

Before: The weakest Chinese position of any major tool segment. In 2019 domestic firms held 3.4% of line-width measurement, 1.3% of defect inspection and none of mask or packaging inspection; in 2024 they were still at 0.8% of the whole process control tool market. CSET's 2026 survey of Chinese share gains runs through deposition, etch, polishing, lithography, packaging and test, and never reaches process control.

After: China's weakest position in any major kind of chipmaking tool. In 2019 Chinese firms held 3.4 percent of line-width measurement, 1.3 percent of defect inspection and none of mask or packaging inspection. In 2024 they still held 0.8 percent of the whole market for these tools. CSET's 2026 survey of Chinese share gains covers deposition, etch, polishing, lithography, packaging and test, and never reaches measurement and inspection.

**usStatus**

Before: KLA is the largest process-control supplier in the world. It puts its own 2024 share at 56.5%, or 6.5 times its nearest rival; CSET's Supply Chain Explorer puts it at 57.2% of the same year's market. US firms take 72% of the segment, Japanese firms 15%. The December 2024 rule pulled inspection and measurement tools for patterned 300 mm wafers onto the controlled list, at a threshold of 21 nm defects.

After: KLA is the largest maker of these tools in the world. It puts its own 2024 share at 56.5 percent, or 6.5 times its nearest rival; CSET's Supply Chain Explorer puts it at 57.2 percent of the same year's market. American firms take 72 percent of the segment and Japanese firms 15 percent. A December 2024 rule added inspection and measurement tools for patterned 300 mm wafers to the controlled list, for tools that can find defects 21 nm across or smaller.

## 08-transistors-and-front-end (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Three firms run gate-all-around at the leading node and none sells the recipe; Rapidus is trying it on state money

After: Three firms make gate-all-around transistors, the newest kind, and none sells its recipe.

**substitutability.why**

Before: The scarce thing is the recipe: which steps, in which order, on which tools. Three firms have written one, so the path is known, and Rapidus is the live test of what it costs a well-funded state from a standing start, at 267.6 billion yen and a 2027 date. An actor that can buy extreme-ultraviolet scanners is on a five to ten year clock; China, which cannot, has reached 5 nm-class geometry by printing each layer several times and stays capped below the leading edge.

After: The scarce thing is the recipe: which steps, in which order, on which tools. Three firms have written one, so a newcomer knows the path exists but has to work it out again. Rapidus in Japan, backed by the state, is the live test of what that costs from a standing start, on 267.6 billion yen and a 2027 target, so count five to ten years for anyone who can buy extreme-ultraviolet scanners. China cannot buy them; it has reached 5 nm-class features by printing each layer several times, and that keeps it a step behind the newest chips.

**chinaStatus**

Before: SMIC ships an N+3 node measured at 113.4 million transistors per square millimeter, printing each layer in two or four passes because it cannot buy an extreme-ultraviolet scanner. Its narrowest wires sit closer together than Intel 18A's, which is what a decade of state money buys without one.

After: SMIC ships a process it calls N+3, measured at 113.4 million transistors per square millimeter. It prints each layer in two or four passes because it cannot buy an extreme-ultraviolet scanner. Its narrowest wires sit closer together than Intel 18A's, which shows what a decade of state money buys without one.

**usStatus**

Before: Intel runs the only leading-edge transistor line owned by an American company. It brought gate-all-around and backside power to market together on 18A and is the first to run High-NA EUV in high-volume manufacturing.

After: Intel runs the only American-owned line that makes the newest transistors. Its 18A process brought gate-all-around transistors and backside power, where power is fed from under the transistors, to market together, and Intel is the first to use High-NA EUV scanners, the newest kind, in volume production.

**costSignal**

Before: No foundry publishes leading-edge wafer prices, so the public signal is TSMC's own density gain per node, which falls from 1.2x at N2P to about 1.1x at A16

After: No foundry publishes prices for its newest wafers. The public signal is how much more TSMC packs onto each new process, and that gain falls from 1.2x at N2P to about 1.1x at A16.

## 09-foundries-and-fabs (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Intel and Samsung run leading nodes, but no gigafab has been built outside Taiwan and the slow part is the crews

After: Intel and Samsung also run lines for the newest chips, but nobody has built a giant fab outside Taiwan, and the slow part is the crews.

**substitutability.why**

Before: Money buys the building: BCG puts the ten-year cost of a fab finished in 2026 at $35 to $43 billion, and Intel and Samsung already run leading-node lines, so a well-funded actor is copying a known path. What it cannot buy quickly is a workforce that has run one process for years, which is why TSMC has yet to build a gigafab anywhere but Taiwan. Five to ten years for a line, and longer for the volume.

After: Money buys the building. BCG puts the ten-year cost of a fab finished in 2026 at $35 to $43 billion, and Intel and Samsung already run lines for the newest chips, so a newcomer is copying a known path. Money cannot quickly buy a workforce that has run one process for years, and even TSMC has yet to build one of its giant fabs anywhere but Taiwan. Count five to ten years for a working line, and longer to reach real volume.

**chinaStatus**

Before: SMIC and Hua Hong are the largest domestic foundries. SMIC turned over $9.327 billion in 2025 at 93.5% utilization, but it cannot buy an EUV scanner, which caps it below the leading edge. China is forecast to hold more installed capacity than any other region, and almost none of it is advanced.

After: SMIC and Hua Hong are China's largest foundries. SMIC took in $9.327 billion in 2025 with its lines 93.5 percent full, but it cannot buy an EUV scanner, so it cannot make the newest chips. China is forecast to have more fab capacity than any other region, and almost none of it is advanced.

**usStatus**

Before: Intel Foundry is the only US-owned leading-edge foundry and lost $2.089 billion on $5.8 billion of revenue in 2Q26. The federal government holds a 9.9% passive equity stake in Intel.

After: Intel Foundry is the only American-owned foundry that makes the newest chips, and it lost $2.089 billion on $5.8 billion of revenue in the second quarter of 2026. The federal government owns 9.9 percent of Intel and takes no part in running it.

## 10-memory-and-hbm (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Three firms ship HBM; no fourth holds leading-edge DRAM and a stacking line at once, and CXMT is still behind

After: Three firms ship HBM, and no fourth firm has both the newest DRAM and a line that stacks it.

**substitutability.why**

Before: Among the three, share moves on qualification alone: Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent by the first quarter of 2026 without new capacity. A fourth is a different problem, because a well-funded actor has to put leading-edge DRAM, a line that drills and thins wafers, and a stacking process that keeps ground dies flat inside one company, then pass Nvidia's data-rate bar. Five to ten years, and no Chinese firm ships HBM3E or HBM4 in volume yet.

After: Among the three makers, share moves as soon as a customer approves a new part: Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent by the first quarter of 2026 without adding capacity. A fourth maker is a harder problem. It would need the newest DRAM, a line that drills through and thins wafers, and a way to stack the thinned chips without warping them, all inside one company, and then its stack would have to pass Nvidia's speed test. That takes five to ten years, and no Chinese firm ships HBM3E or HBM4 in volume yet.

**chinaStatus**

Before: No Chinese firm ships HBM3E or HBM4 in volume. CXMT is the only credible domestic entrant, and the export controls are written to keep it that way.

After: No Chinese firm ships HBM3E or HBM4 in volume. CXMT is the only Chinese firm with a credible shot at it, and the export controls are written to keep it that way.

**usStatus**

Before: Micron is the only US-headquartered HBM maker. BIS controls HBM above 2 GB/s per square millimeter of package or stack area under ECCN 3A090.c, which captures every stack now in production.

After: Micron is the only American HBM maker. BIS, the US export control office, requires a license for HBM faster than 2 GB/s per square millimeter of package or stack area, under control number ECCN 3A090.c, and every stack now in production is faster than that.

**costSignal**

Before: An HBM cube's data interface is 16 times wider than a DDR5 module's, and that width costs die area and stacking yield

After: An HBM stack moves data over a path 16 times wider than a DDR5 memory module's, and that width costs chip area and lowers the share of stacks that come out working.

## 11-advanced-packaging (Moderate to substitute, Extreme concentration)

**substitutability.test**

Before: The steps are ordinary and Intel's EMIB is a credible second source; the shortage is yield at Nvidia's volume

After: Intel's EMIB can do the same job as TSMC's CoWoS, and the real shortage is making enough good parts at the volume Nvidia orders.

**substitutability.why**

Before: The individual steps are not exotic, and Intel's EMIB does the same job when CoWoS is tight. A well-funded actor has to buy enough bonders and enough learning to get a 5.5-reticle interposer and its memory stacks out working at the volume Nvidia alone orders. Amkor's Peoria campus is the live test, producing from early 2028, which puts the clock at two to five years.

After: None of the steps is exotic, and Intel's EMIB does the same job when TSMC's CoWoS is sold out. The hard part is volume. A newcomer has to buy enough bonding machines and run enough practice lots to turn out an interposer, the silicon base plate, 5.5 times the area a scanner prints in one shot, with its memory stacks attached and working, at the volume Nvidia alone orders. Amkor's plant in Peoria, Arizona is the live test, with production from early 2028, which puts the wait at two to five years.

**chinaStatus**

Before: China's back end is far stronger than its front end. JCET alone billed RMB 35.96 billion in 2024, and Chinese suppliers gained share in packaging and test tools while gaining none in atomic layer deposition or lithography. Almost none of it is silicon-interposer 2.5D for AI accelerators.

After: China is far stronger at packaging and testing chips than at making them. JCET alone took in RMB 35.96 billion in 2024, and Chinese tool makers gained share in packaging and test tools while gaining none in atomic layer deposition or lithography. Almost none of that packaging is the kind, built on a silicon interposer, that AI accelerators need.

**usStatus**

Before: No domestic CoWoS at volume. Amkor is building a $7B packaging and test plant in Peoria with up to $407M of CHIPS funding, production from early 2028.

After: Nobody does CoWoS-class packaging in volume in the United States yet. Amkor is building a $7B packaging and test plant in Peoria, Arizona, with up to $407M of CHIPS Act money, and production starts in early 2028.

**costSignal**

Before: No public wafer counts. TSMC guided investors to 60% compound annual growth in CoWoS capacity and adds more every year, but will not publish the absolute number. Epoch AI estimates Nvidia alone consumed 60.3% of the world's CoWoS capacity in 2025

After: No public wafer counts. TSMC told investors CoWoS capacity would grow about 60% a year, and keeps adding to that, but will not publish the total. Epoch AI estimates Nvidia alone used 60.3% of the world's CoWoS capacity in 2025

## 12-substrates-and-pcbs (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Rated on the film: one supplier at about 95 percent by its own figures, requalified layer by layer everywhere

After: Rated on the insulating film inside the substrate: Ajinomoto supplies about 95 percent of it by its own count, and every maker would have to re-approve a replacement layer by layer.

**substitutability.why**

Before: The substrate plants are an oligopoly that money can expand, and every large one is expanding. The single points sit one layer down: Ajinomoto's film, which the company puts at about 95 percent and which has been the reference since 1999, and Nitto Boseki's low-expansion glass cloth beneath it. A well-funded actor can build a laminate line, but every substrate maker and every packaging house then has to requalify the new film layer by layer, which takes years in each of them and puts the clock at five to ten.

After: A handful of firms build substrates, money can expand their plants, and every large one is expanding. The single points of failure sit one layer down. Ajinomoto makes the thin insulating film between the substrate's wiring layers, puts its own share at about 95 percent, and has been the standard since 1999; under it sits Nitto Boseki's glass cloth, woven so it barely swells with heat. A newcomer can build a line to make such a film, but then every substrate maker and every packaging house has to test the new film in each layer of each product before trusting it, which takes years at each of them and puts the whole switch at five to ten years.

**chinaStatus**

Before: China and Taiwan hold most of the circuit board competition, and Nitto Boseki itself calls Chinese and Taiwanese firms aggressive fast followers in special glass. China still has almost no position in high-end build-up film.

After: Most of the firms competing in circuit boards are Chinese or Taiwanese, and Nitto Boseki itself calls them aggressive fast followers in special glass. China still has almost no position in the high-end insulating film.

**usStatus**

Before: No American maker of build-up substrates at scale. TTM Technologies is the main US-listed circuit board maker; data center computing reached 24% of its sales in 2025, up from 14% in 2023. Intel is pushing glass substrates for the second half of the decade.

After: No American firm makes these substrates at scale. TTM Technologies is the main American circuit board maker; data center computing was 24 percent of its sales in 2025, up from 14 percent in 2023. Intel is pushing substrates made of glass for the second half of the decade.

## 13-test-and-assembly (Moderate to substitute, High concentration)

**substitutability.test**

Before: No tool here has a single supplier; the lock is the cost of rebuilding a test environment

After: No tool here has only one maker, but switching testers means rebuilding the customer's whole test setup.

**substitutability.why**

Before: Advantest and Teradyne take about 80 percent between them, but both ship qualified testers and the niches under them have several suppliers each. A customer stays because changing tester vendor means rebuilding the whole development, evaluation and production test environment, which is Advantest's own pitch to investors. A well-funded actor pays that cost once and is through it in two to five years, which is also why four of the top ten assembly and test firms are already Chinese.

After: Advantest and Teradyne sell about 80 percent of the testers between them, but both make approved machines, and the smaller kinds of tool have several makers each. Customers stay put because a new tester means rebuilding every test program, from the first prototype through to the production line, and Advantest tells its investors exactly that. A newcomer pays that cost once and is through it in two to five years. The low barrier shows: four of the top ten assembly and test firms are already Chinese.

**chinaStatus**

Before: Assembly and test is where China is most competitive. Georgetown's CSET counts four of the top ten assembly and test firms by 2024 revenue as China-headquartered, and their equipment is far less tightly controlled than lithography or deposition.

After: Assembly and test is where China is most competitive. CSET at Georgetown counts four of the top ten assembly and test firms by 2024 revenue as Chinese, and the tools they use are far less tightly controlled than lithography or deposition tools.

**usStatus**

Before: Strong in test equipment and probe cards through Teradyne, FormFactor, Cohu and Aehr, weak in assembly capacity. Amkor is building a $7 billion packaging and test campus in Arizona and has a long-term partnership with TSMC to fill it.

After: Strong in test machines and probe cards, the beds of pins that touch each chip on the wafer, through Teradyne, FormFactor, Cohu and Aehr; weak in assembly. Amkor is building a $7 billion packaging and test campus in Arizona and has a long-term deal with TSMC to fill it.

## 14-systems-and-networking (Moderate to substitute, High concentration)

**substitutability.test**

Before: Rated on the tightest inputs: one vendor sells NVLink-class scale-up switching, and few firms make the lasers

After: Rated on the two tightest parts: Nvidia alone sells NVLink, the link that joins the accelerators in a rack, and few firms make the lasers.

**substitutability.why**

Before: Rack assembly is not the chokepoint: if Foxconn stopped, Quanta and Wistron would take the volume in a couple of quarters. The tight inputs sit underneath, and both have answers in flight. UALink is the published alternative to NVLink, at 200 Gb/s a lane and up to 1,024 endpoints, and Nvidia bought $2 billion each of Coherent and Lumentum to secure laser capacity that no purchase order could, which is what a well-funded actor would do too, on a two to five year clock.

After: Putting racks together is easy to replace: if Foxconn stopped, Quanta and Wistron would pick up the volume within a couple of quarters. The tight parts sit inside the rack, and both have fixes under way. UALink is a published rival to NVLink, running 200 Gb/s per lane and joining up to 1,024 accelerators. For the lasers, Nvidia put $2 billion each into Coherent and Lumentum to lock in supply that an ordinary order could not, which is what any newcomer with money would have to do too, over two to five years.

**chinaStatus**

Before: Holds the two ends of the optical link that the United States does not. Chinese firms assemble high-speed modules at scale, mostly from Thai and Suzhou plants, and China accounts for about 70% of world indium production, the feedstock for the lasers inside them.

After: China holds the two ends of the optical link that the United States does not: Chinese firms assemble the high-speed optical modules in volume, mostly in plants in Thailand and Suzhou, and China produces about 70 percent of the world's indium, the raw material for the lasers inside them.

**usStatus**

Before: Owns the switch silicon, the protocols that link accelerators inside a rack, and the laser fabs, but almost none of the rack assembly. Nvidia's partners began US rack production in Houston and Dallas in 2025, and the Federal Communications Commission moved in July 2026 against imported gear containing parts from firms on its Covered List.

After: American firms own the switch chips, the links that join accelerators inside a rack, and the plants that make the lasers, but almost none of the rack assembly. Nvidia's partners began building racks in Houston and Dallas in 2025, and in July 2026 the Federal Communications Commission moved against imported gear containing parts from firms on its Covered List.

## 15-data-centers-and-power (Moderate to substitute, High concentration)

**substitutability.test**

Before: Several qualified vendors; the wait is a three-year transformer queue and six years of booked turbines

After: Several approved vendors sell every part, but a transformer takes three years to arrive and GE Vernova's turbines are booked about six years out.

**substitutability.why**

Before: Nothing here is unbuilt. Nine firms sell the power and cooling equipment for Nvidia's gigawatt designs, so a buyer can get the kit and haggle over the price. A well-funded actor cannot shorten the queue: large power transformers run to 36-month lead times against under a year before 2020, and GE Vernova's book is close to six years of turbine output, which puts new capacity two to five years out.

After: Nothing here has to be invented. Nine firms sell the power and cooling equipment for Nvidia's gigawatt data center designs, so a buyer can get the gear and haggle over the price. Money cannot skip the line. A large power transformer now takes 36 months to arrive, against under a year before 2020, and GE Vernova has close to six years of gas turbine orders on its books, so new capacity is two to five years away.

**chinaStatus**

Before: China has surplus generation, a large domestic transformer and switchgear industry, and can energize sites quickly. Its AI buildout is limited by accelerator supply, with megawatts to spare.

After: China has spare generating capacity, a large home industry making transformers and switchgear, and can connect new sites quickly. Its AI buildout is limited by the supply of accelerators, with megawatts to spare.

**usStatus**

Before: Has the demand and the capital but cannot shorten the equipment queues. Transformers and turbines are both multi-year waits, most large power transformers are imported, and no restarted reactor is running yet.

After: The United States has the demand and the money but cannot skip the equipment queues. Transformers and turbines both take years to arrive, most large power transformers are imported, and no restarted nuclear reactor is running yet.
