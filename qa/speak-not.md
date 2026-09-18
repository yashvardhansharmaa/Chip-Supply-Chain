# Contrast constructions removed ("X, not Y", "not X but Y", "X rather than Y")

**290 distinct edits, 311 occurrences, across 29 files.** Every "X, not Y", "not X but Y" and "X rather than Y" used as a rhetorical contrast is gone from the reader-facing text: the 17 chapters (body prose and front matter, including the card fields, `specimenCaption` and `oneLiner`), the glossary, the control flows, the timeline, the AI chips landscape and its notes, the chokepoint matrix and its notes, the control thresholds, the suppliers, the China-exposure notes, the board legend in `src/template.html` and the FOUP specimen caption. Each is now a plain statement of what the thing is; where the contrast carried a legal or factual distinction (a license against a ban, capacity counted by fab location, a data cell reading "not published" against "not supported") the fact is kept as a plain sentence, and a negative appears only where a reader needs it ("A ban is not in force."). No fact, number, citation or glossary term form changed. No `plain` field changed except in chapters 3 and 13, where the identical sentence in the first paragraph under "How it works" changed with it (the build's byte-identity check passes).

Also cleared, because `qa/scripts/check-speak.js` must pass on the finished text: one "That is why" opener (chapter 5), one "whether or not" (timeline), one "the site's" that meant a data-center site (glossary, now "the gate of the campus"), three "the site's" in the matrix notes (now "Chip Supply Chain's"), and four notes in `data/exposure.json`.

Left as they are: code comments in `specimens/*.js`, `src/app.js` and `build/modules/*.js` ("a chart, not an object" survives only as a comment in `specimens/wafer-cost.js` and in the superseded draft in `qa/specimen-captions.md`; the caption a reader sees never carried it), verbatim quotations from sources, and the bibliography titles.

## Checks

- `node qa/scripts/check-speak.js`: no matches.
- `node build/build.js`: no warnings.
- `node qa/scripts/check-integrity.js`: clean apart from the known "has no supplier entry" lines.
- Every `data/*.json` parses.

## Changes


### content/01-design-and-eda.md

| Before | After |
|---|---|
| a fourth has to be written and foundry-certified, not bought | a fourth has to be written from scratch and foundry-certified |
| the gap is in the rare failure cases a foundry has already validated rather than in features | the domestic flows match on features and fall short in the rare failure cases a foundry has already validated |
| with Broadcom's name on the implementation rather than on the box | with Broadcom's name on the implementation and the buyer's on the box |

### content/02-silicon-and-wafers.md

| Before | After |
|---|---|
| so a well-funded actor closes the gap in two to five years rather than in months | so a well-funded actor needs two to five years to close the gap |
| end in the neck rather than in the ingot | end in the neck and never reach the ingot |
| It matters for radio and low-power chips, not for AI GPUs, which run on plain epitaxial silicon. | It matters for radio and low-power chips. AI GPUs run on plain epitaxial silicon. |
| rest on know-how that was never written down rather than on any machine a rival could buy, and | rest on know-how that was never written down and that no machine a rival could buy contains, and |
| so flatness has to hold everywhere on the disc rather than on average | so flatness has to hold at every point on the disc |

### content/03-chemicals-gases-and-photoresist.md

| Before | After |
|---|---|
| so a second source takes years rather than weeks *(2 occurrences)* | so a second source takes years |
| so a second source is joint development rather than a purchase order | so a second source means a joint development program |
| China's lever is the metals rather than the process chemicals. | China's lever is the metals. |
| with targeted exemptions rather than a flat ban, and | with targeted exemptions, and |
| of metallic contamination, not per million, which | of metallic contamination, a million times finer than parts per million, which |

### content/04-lithography.md

| Before | After |
|---|---|
| 50,000 times a second, not merely assemble a scanner. | 50,000 times a second before it could assemble a scanner. |
| Zeiss mirror polishing and coating, not final assembly in Veldhoven, caps EUV output. | Zeiss mirror polishing and coating caps EUV output. Final assembly in Veldhoven waits on the optics. |

### content/05-photomasks-and-pellicles.md

| Before | After |
|---|---|
| but that is the inventor's clock, not the buyer's. | but that was the inventor's clock. |
| so a well-funded entrant is copying rather than inventing: five | so a well-funded entrant runs on the copier's clock: five |
| Light strikes the mirror at an angle rather than head-on, and | Light strikes the mirror at a slant, and |
| Particles land on it rather than on the pattern, too far out of focus to print. | Particles land on it, too far out of focus to print, and the pattern below stays clean. |
| What has kept the count at three is money rather than physics. | A business too small to fund a fourth entrant has kept the count at three. |

### content/06-deposition-and-etch.md

| Before | After |
|---|---|
| so the work is requalification rather than invention, two | so the work is requalification, two |
| name process specifications rather than machines | are written as process specifications |
| need better selectivity and deeper holes rather than more chambers | ask each chamber for better selectivity and deeper holes |

### content/07-metrology-and-inspection.md

| Before | After |
|---|---|
| losing it costs yield learning, not the line | losing it slows yield learning while the line keeps running |
| The chokepoint is concentration rather than physics: seven | The chokepoint is concentration: seven |
| loses sensitivity and speed of yield learning rather than the ability to run a fab, and closes | keeps the ability to run a fab, loses sensitivity and speed of yield learning, and closes |
| A metrology tool measures rather than hunts. | A metrology tool measures known shapes. |
| Process control is a chokepoint of concentration rather than of physics. | Process control is a chokepoint of concentration. |

### content/08-transistors-and-front-end.md

| Before | After |
|---|---|
| source and drain rather than on a buried rail, which | source and drain, with no buried rail between, which |
| from the circuits around the array rather than from the cell that holds one bit | from the circuits around the array, and none of it from the cell that holds one bit |
| the wire rather than the transistor sets the delay | the wire becomes the slower part and sets the delay |
| with process steps and new materials rather than with geometry. | with process steps and new materials, while geometry gave less each node. |

### content/09-foundries-and-fabs.md

| Before | After |
|---|---|
| the same menu of recipes rather than a machine of its own | the same menu of recipes on shared machines |
| and compete on price rather than density. | and compete on price. |
| the binding constraint was packaging rather than wafers. | the binding constraint was packaging. |
| Spare generating capacity, rather than anything about silicon, sets | Spare generating capacity sets |
| Intel Foundry's loss comes from yield rather than from weak demand. | Intel Foundry's loss comes from yield. |
| a fact about the 2020s and 2030s rather than a problem being solved | a fact about the 2020s and 2030s |

### content/10-memory-and-hbm.md

| Before | After |
|---|---|
| So memory size and speed, rather than arithmetic, usually set | So memory size and speed usually set |
| is now a logic chip rather than a memory one, so | is now a logic chip, so |
| on qualification wins rather than on new capacity | on qualification wins alone |
| the stacking line and Nvidia's approval rather than the memory chip itself | the stacking line and Nvidia's approval |
| above 10 Gb/s rather than JEDEC's 8 | above 10 Gb/s, against JEDEC's 8 |

### content/11-advanced-packaging.md

| Before | After |
|---|---|
| put cache underneath rather than compute | put cache underneath and compute on top |

### content/12-substrates-and-pcbs.md

| Before | After |
|---|---|
| so glass answers the next problem rather than this one. | so glass answers a problem still years away. |
| warping and handling decide what can be built, not the wiring. | warping and handling take over from the wiring in deciding what can be built. |

### content/13-test-and-assembly.md

| Before | After |
|---|---|
| fail on the test bench rather than inside a finished product *(2 occurrences)* | fail on the test bench before it reaches a finished product |
| the lock is the cost of rebuilding a test environment, not a missing tool | the lock is the cost of rebuilding a test environment |
| for packaging on rectangular panels rather than round wafers | for packaging on rectangular panels |

### content/14-systems-and-networking.md

| Before | After |
|---|---|
| for laser capacity rather than placing a larger order, which | to secure laser capacity that no purchase order could, which |
| The rules now follow the firm rather than the site: | The rules now follow the firm, wherever its plants sit: |
| buying research, future capacity and access rights rather than parts | buying research, future capacity and access rights |
| to buy into two laser makers rather than place a bigger order | to buy into two laser makers |
| the hard parts are power and light, not silicon. | the hard parts are power and light. |

### content/15-data-centers-and-power.md

| Before | After |
|---|---|
| limited by accelerator supply, not megawatts. | limited by accelerator supply, with megawatts to spare. |
| six years of booked turbines, not skill | six years of booked turbines |
| two to five years out rather than one purchase cycle | two to five years out |
| sited next to gas rather than next to fiber. | sited next to gas. |
| in the substation yard rather than the fab. | in the substation yard. |

### content/16-component-costs.md

| Before | After |
|---|---|
| as a range rather than a single figure, deriving | as a range, deriving |
| A laminate line, not a physics frontier. | A laminate line, buildable at scale. |

### content/17-geopolitics.md

| Before | After |
|---|---|
| What is left is not how a chip gets built but who can stop it, and | What is left is who can stop a chip getting built, and |
| to push China backwards rather than merely slow it | to push China backwards |
| apply to all destinations rather than naming China | apply to all destinations and name no country |
| The retaliation itself goes at the inputs rather than the chips. | The retaliation itself goes at the inputs. |
| has produced a domestic tool industry rather than a leading-edge node. | has produced a domestic tool industry and no leading-edge node. |
| a Chip Supply Chain figure rather than a published measurement | a Chip Supply Chain estimate |
| attaches to the named list rather than to the country | attaches to the named list |
| Domestic memory rather than logic wafers caps Chinese accelerator volume | Domestic memory caps Chinese accelerator volume before logic wafers do |

### data/glossary.json

| Before | After |
|---|---|
| designed for a single job rather than sold on the open market. | designed for a single job and never sold on the open market. |
| using a grid of small solder balls across the underside, rather than a row of pins around the edge. | using a grid of small solder balls across the underside in place of a row of pins around the edge. |
| the bureau can change a threshold with a Federal Register notice rather than an act of Congress. | the bureau can change a threshold with a Federal Register notice, with no act of Congress needed. |
| A chip built this way is a house assembled from prefabricated rooms rather than poured as one slab. | A chip built this way is a house assembled from prefabricated rooms. |
| A limit set on the amount of arithmetic used to train an AI model, rather than on the chips that do the arithmetic. | A limit set on the amount of arithmetic used to train an AI model. It counts operations, whichever chips run them. |
| which is the only place the rules reach a capability rather than a box. | which is the only place the rules reach a capability itself. |
| The license rule for AI chips is written as country groups, not country names: a license | The license rule for AI chips is written in country groups: a license |
| inferred from how many chips come out working rather than counted directly. | inferred from how many chips come out working. |
| An order from BIS that shuts a named party out of trade in US-controlled items as a penalty, rather than a policy for reviewing licenses. | An order from BIS that shuts a named party out of trade in US-controlled items, as a penalty. It is a punishment, and no license policy is involved. |
| They are changed by a notice in the Federal Register, not by an act of Congress, which | They are changed by a notice in the Federal Register, with no act of Congress, which |
| It is a residual category, not a free pass: an EAR99 item | It is a residual category with conditions: an EAR99 item |
| what they will do with the item, rather than on what the item is. | what they will do with the item, whatever the item is. |
| need a license before anyone, not only an American supplier, may send them | need a license before anyone anywhere, American or foreign, may send them |
| it names an organization rather than a technology. | it names an organization. |
| control etch tools by hole shape and selectivity rather than by product name. | control etch tools by hole shape and selectivity. |
| wraps all the way round the channel that current flows through, rather than touching three sides as a fin does. | wraps all the way round the channel that current flows through; a fin's gate touches three sides. |
| which lets BIS inform a person individually rather than by amending the EAR. | which lets BIS inform a person individually, with no amendment to the EAR. |
| from the company's own filing rather than the Federal Register. | from the company's own filing. |
| a notification rather than a license, for chips below the top band. | a notification, with no license needed, for chips below the top band. |
| spend most of their cost and silicon area on memory rather than arithmetic, and | spend most of their cost and silicon area on memory, and |
| Because node names are marketing labels rather than measurements, rules and comparisons that lean on them are unreliable, which is why US export thresholds specify transistor type and metal spacing instead. | Because node names are marketing labels and measure nothing, rules and comparisons that lean on them are unreliable, which is why US export thresholds specify transistor type and metal spacing. |
| so that dust settles on it rather than on the pattern, far enough out of focus that it does not print. | so that dust settles on it, far enough out of focus that it does not print, and the pattern stays clean. |
| the clearest case of a control written as a formula rather than a product name. | the clearest case of a control written as a formula. |
| A license review policy, not a ban. An application | A license review policy. An application |
| It is set by the machine's optics, not by anything about the design. | It is set by the machine's optics and is the same for every design. |
| because the item, not the exporter, is what the rules reach. | because the rules follow the item. |
| runs to qualification, not to a prototype. | stops at qualification, well after a prototype. |
| designed in-house rather than bought from Nvidia and used only | designed in-house and used only |
| Yield, not wafer price, sets the cost of a working AI chip, and a ten point | Yield sets the cost of a working AI chip: a ten point |
| the transistors are built in the layer rather than in the original slice. | the transistors are built in that layer. |
| which is why export rules name process recipes rather than machines. | which is why export rules name process recipes. |
| to finish in hours rather than days. | to finish in hours. |
| one of the few tool families Japan rather than the United States leads. | one of the few tool families Japan leads. |
| Power arrives through holes drilled up from below rather than down through the crowded top. | Power arrives through holes drilled up from below, clear of the crowded top. |
| By 2026 front-end wafers rather than packaging had become the tightest constraint | By 2026 front-end wafers had overtaken packaging as the tightest constraint |
| Intel Foundry's losses come from the ramp rather than from weak demand. | Intel Foundry's losses come from the ramp. |
| the newest saws handle rectangular panels rather than round wafers. | the newest saws handle rectangular panels as well as round wafers. |
| adding one means joint development and a fresh qualification rather than a purchase order. | adding one means joint development and a fresh qualification. |
| that a design house licenses rather than draws itself. | that a design house licenses. |
| laid down in resin rather than silicon, that spreads | laid down in resin, that spreads |
| From HBM4 it is a logic chip made in a foundry rather than a memory chip. | From HBM4 it is a logic chip made in a foundry. |
| and that queue rather than the fab is where AI buildouts slip. | and that queue is where AI buildouts slip. |
| and power rather than chips is what limits it. | and power is what limits it. |
| counts bits rather than bytes, eight times smaller. | counts bits, each an eighth of a byte. |
| Pitch, not the node name, is the honest measure | Pitch is the honest measure |
| Most stages of this chain are oligopolies rather than monopolies, and the difference | Most stages of this chain are oligopolies, a few are monopolies, and the difference |
| that has run for years and competes on price rather than density. | that has run for years and competes on price. |
| Inference is where memory size and speed rather than arithmetic set how many | Inference is where memory size and speed set how many |
| and it reaches people rather than goods. | and it reaches people directly. |
| on the terms attached to its own name rather than to its country. | on the terms attached to its own name. |
| so the deal follows the buyer rather than the border. | so the deal follows the buyer across borders. |
| BIS said it would not enforce it four months later but withdrew none of the text, so | Four months later BIS said it would leave the rule unenforced, and it withdrew none of the text, so |
| Japan's controls apply to every destination rather than naming China, and | Japan's controls apply to every destination and name no country, and |
| Beijing's retaliation goes at the inputs rather than the chips, and | Beijing's retaliation goes at the inputs, and |
| and it has bought a tool industry rather than a leading-edge node. | and it has bought a tool industry and no leading-edge node. |
| Wet processing is any step done in liquid rather than in a plasma. | Wet processing is any step done in liquid. |
| built on clusters of tin and oxygen rather than on carbon polymers. | built on clusters of tin and oxygen. |
| the version of a node tuned for those chips rather than for phones. | the version of a node tuned for those chips. |
| they make up the substation at the site's gate. | they make up the substation at the gate of the campus. |

### data/control-flows.json

| Before | After |
|---|---|
| sold anywhere but America. A license, not a ban. | sold anywhere but America. A license is required. A ban is not in force. |
| These are Chinese measures on Chinese buyers, not export controls. | These are Chinese measures on Chinese buyers; no export is involved. |

### data/export-controls-timeline.json

| Before | After |
|---|---|
| that barred exports outright rather than requiring a license. | that barred exports outright. |
| China's Cybersecurity Review Office, not an export regulator, concluded | China's Cybersecurity Review Office, a body outside the export-control system, concluded |
| on a case-by-case basis rather than as a ban. | on a case-by-case basis. |
| Unlike the 2023 measures this was a country-specific prohibition rather than a licensing regime. | Unlike the 2023 measures, which set up licensing, this was a country-specific prohibition. |
| under a general authorization rather than individual licenses. | under a single general authorization. |
| The 950 splits in two around memory rather than compute. | The 950 splits in two around memory. |
| A named list of approved companies, not a country quota, now governs | A named list of approved companies now governs |
| whether or not Huawei designed it. | whatever firm designed it. |

### data/chokepoint-matrix.json

| Before | After |
|---|---|
| is why the row is an estimate rather than a derivation. | is why the row is an estimate. |
| still concentrated in analog and packaging tools rather than full digital flows. | still concentrated in analog and packaging tools, short of a full digital flow. |
| so an ownership-based rather than headquarters-based cut would move | so a cut by ownership would move |
| Shares are of design-IP licensing and royalty revenue, not of chips shipped using the IP, and | Shares are of design-IP licensing and royalty revenue, with no count of chips shipped using the IP, and |
| A CHOKEPOINTS model, not a measurement: no allowed source | A CHOKEPOINTS model: no allowed source |
| The shares are TechInsights' measurement, relayed by CSET, not an independent count. | The shares are TechInsights' measurement, relayed by CSET. |
| Capacity by fab location, not by company headquarters, which is the right cut | Capacity is counted by fab location, wherever the company is headquartered, which is the right cut |
| This is revenue, not bits, and 2025 was a price spike, so | This is revenue, and bits would tell a different story: 2025 was a price spike, so |
| It is headquarters, not production: Micron fabs most of its bits in Taiwan and Japan. | It is by headquarters: Micron fabs most of its bits in Taiwan and Japan, so a production cut would move them. |
| in DDR4 and consumer parts rather than the server DDR5 and HBM that AI buyers compete for. | in DDR4 and consumer parts, away from the server DDR5 and HBM that AI buyers compete for. |
| how fast the ranking moves on qualification rather than capacity: | how fast the ranking moves on qualification: |
| moves on qualification wins rather than on capacity, and | moves on qualification wins, and |
| That is a split by buyer rather than by producing country, and | That is a split by buyer, and |
| so the figure is relayed rather than measured by an institution. | so the figure is relayed market research, with no institutional measurement behind it. |
| It is by site rather than by headquarters, so Amkor's plants count in Korea, the Philippines, Vietnam and China rather than in the United States, which | It is by site, so Amkor's plants count in Korea, the Philippines, Vietnam and China and none of them in the United States, which |
| Design location, not fabrication location: almost all | Design location: almost all |

### data/chokepoint-matrix-notes.md

| Before | After |
|---|---|
| broke those markets out by sub-category rather than by country, so | broke those markets out by sub-category only, so |
| at the stage level rather than the node level: | at the stage level: |
| and they came from a filing rather than a report. | and they came from a filing. |
| Both row notes say so plainly rather than presenting the figures as SK hynix's own measurement. | Both row notes say so plainly. |
| but it is demand, not geography, so it cannot fill the row, and | but it measures demand, so it cannot fill a geography row, and |
| The outsourced assembly and test row was rebuilt rather than emptied. | The outsourced assembly and test row was rebuilt. |
| Most published market data is by company, not by country, so nearly every row required a conversion. | Most published market data is by company, so nearly every row required a conversion to country. |
| Israel is broken out in the metrology row rather than left in Other, because | Israel is broken out in the metrology row because |
| use full-year 2025 actuals rather than a quarter for that reason, and | use full-year 2025 actuals for that reason, and |
| The three with no numbers are absent rather than weak, and the notes above say why. | The three with no numbers are absent because no allowed source fills them, and the notes above say why. |
| which dominate specific molecules rather than the category as a whole: | which dominate specific molecules: |
| and it is a judgment rather than a measurement. | and it is a judgment. |
| so it relays a market-research number rather than an institutional estimate. | so it relays a market-research number. |
| - `estimate`: the site's own judgment, with | - `estimate`: Chip Supply Chain's own judgment, with |
| are the site's own estimates, and | are Chip Supply Chain's own estimates, and |
| because it is the site's single most-quoted number. | because it is Chip Supply Chain's single most-quoted number. |

### data/control-thresholds.json

| Before | After |
|---|---|
| learns about chips just under the main line rather than banning them, and | learns about chips just under the main line while they keep shipping, and |
| so the entry is a ban on selling HBM into China rather than a performance line. | so the entry works as a ban on selling HBM into China. |
| is a transshipment problem rather than a classification problem. | is a transshipment problem. |
| The first threshold in the regime that opens a door rather than closing one: | The first threshold in the regime that opens a door: |
| drawn a licensing line on DRAM bandwidth rather than on compute. | drawn a licensing line on DRAM bandwidth. |
| that is a plain count rather than a derived metric, and | that is a plain count, and |
| match real 18 nm-class production rather than the theoretical IRDS model. | match real 18 nm-class production. |
| A catch-all that works on installations rather than parts: | A catch-all that works on whole installations: |
| Overlay, not resolution, is the parameter that separates | Overlay is the parameter that separates |
| process capability, not a numeric parameter. Control is by function | process capability, with no numeric parameter. Control is by function |
| most etch controls are functional rather than numeric: BIS names the process, not a performance figure, because | most etch controls are functional: BIS names the process, because |
| the control map is drawn around processes, not products: ECCN 3B090 | the control map is drawn around processes: ECCN 3B090 |
| A control on the consumable rather than the machine. | A control on the consumable itself. |
| Deliberately narrow: two ECCNs, not the whole 3B001 list, because | Deliberately narrow: two ECCNs out of the whole 3B001 list, because |
| became a fence around specific Chinese companies rather than a specification. | became a fence around specific Chinese companies. |
| The test is ownership, not location" | The test is ownership" |
| is drawn by model number rather than by a physical parameter, which | is drawn by model number, which |
| Case-by-case, decided in The Hague rather than Washington" | Case-by-case, decided in The Hague" |
| must apply to The Hague rather than to Washington for export licenses | must apply to The Hague for export licenses |
| A control on where American compute physically sits rather than on who buys it. | A control on where American compute physically sits. |
| the first US export control on a model rather than a chip" | the first US export control on a model" |
| It catches the diversion risk by identity rather than by volume, and | It catches the diversion risk by identity, and |
| US persons and companies; a reporting duty, not an export control" | US persons and companies; a reporting duty with no export bar" |
| The only US threshold ever drawn on a data center rather than a chip or a model, and | The only US threshold ever drawn on a data center, and |
| applied to materials rather than technology" | applied to materials" |

### data/suppliers.json

| Before | After |
|---|---|
| It sells silicon IP rather than chips. | It sells silicon IP. |
| Supplies inference GPU IP for edge devices rather than data-center accelerators. | Supplies inference GPU IP for edge devices. |
| It sells systems and inference cloud capacity rather than chips. | It sells systems and inference cloud capacity. |
| It sells tokens through its own cloud rather than selling many chips. | It sells tokens through its own cloud, and few chips. |
| Moore Threads is China's attempt at a general-purpose GPU rather than a fixed-function AI ASIC. | Moore Threads is China's attempt at a general-purpose GPU. |
| attempting a full training-class GPU rather than an inference part. | attempting a full training-class GPU. |
| hard-wires the transformer architecture into silicon rather than running it on a programmable engine, trading | hard-wires the transformer architecture into silicon, trading |
| Relevant to the RF and edge silicon around AI systems rather than to the accelerators themselves. | Relevant to the RF and edge silicon around AI systems. |
| Most of its polysilicon output serves solar rather than semiconductor customers. | Most of its polysilicon output serves solar customers. |
| Its products are consumed continuously rather than bought as capital equipment. | Its products are consumed continuously. |
| Relevant to the mature-node parts around AI systems, not to the accelerator die itself. | Relevant to the mature-node parts around AI systems. |
| which stamps a pattern rather than projecting it. | which stamps a pattern into the resist. |
| using 13.5 nm light rather than a visible-light proxy. | using the scanner's own 13.5 nm light. |
| China's effort to build process control at home rather than import it. | China's effort to build process control at home. |
| Supplies the power management and analog parts that surround AI compute rather than the accelerators. | Supplies the power management and analog parts that surround AI compute. |
| NAND matters for AI storage tiers rather than for the accelerator, but | NAND matters for AI storage tiers, well away from the accelerator, but |
| need lithography on panels and reconstituted wafers, not just on silicon. | need lithography on panels and reconstituted wafers as well as on silicon. |
| is one of the few firms that makes the laser chips inside optical modules rather than only assembling them. | is one of the few module makers that also makes the laser chips inside them. |
| integrates AI racks rather than outsourcing to Taiwanese ODMs. | integrates AI racks in-house. |
| mostly arrives through the large server OEMs rather than direct from ODMs. | mostly arrives through the large server OEMs. |
| so it could ship complete racks rather than accelerator boards. | so it could ship complete racks. |
| Competing with Nvidia now requires shipping an integrated rack, not just a chip. | Competing with Nvidia now requires shipping an integrated rack. |
| is now part of the AI buildout rather than an assumed input. | is now part of the AI buildout. |

### data/landscape.json

| Before | After |
|---|---|
| HGX B200 baseboards ship 180 GB per GPU rather than 192 GB. | HGX B200 baseboards ship 180 GB per GPU, under the 192 GB quoted for the chip. |
| reads not published rather than not supported *(3 occurrences)* | reads not published |
| reads not supported rather than not published *(7 occurrences)* | reads not supported |
| read not published rather than not supported *(4 occurrences)* | read not published |
| read not supported rather than not published *(6 occurrences)* | read not supported |
| the first Nvidia GPU where memory rather than logic dominates the bill of materials. | the first Nvidia GPU where memory dominates the bill of materials. |
| export policy setting the product roadmap rather than the other way round. | export policy setting the product roadmap. |
| The chip drawn to the 2023 line rather than around it. | The chip drawn to sit just under the 2023 line. |
| comes from Epoch AI’s database rather than from the vendor. | comes from Epoch AI’s database. |
| both figures are carried rather than averaged. | both figures are carried as they stand. |
| a product designed against a regulation rather than a workload. | a product designed against a regulation. |
| under 15 CFR 742.6(b)(10) rather than refusing outright, so applications may be filed. | under 15 CFR 742.6(b)(10), so applications may be filed. |
| which is why the H200 rather than the H100 became the chip | which is why the H200 became the chip |
| on an open Ethernet-based scale-up fabric rather than NVLink. | on an open Ethernet-based scale-up fabric. |
| is the total across all twelve dies, not one of them. | is the total across all twelve dies. |
| The rule names the H200 and the MI325X, not the MI300X. | The rule names the H200 and the MI325X. The MI300X is absent from it. |
| The stack count is not printed on AMD’s page but follows from it, since | AMD’s page prints no stack count, but the count follows from it, since |
| the total silicon across all twelve dies rather than any one of them, so | the total silicon across all twelve dies, so |
| the four SparseCores are embedding-lookup engines rather than structured-sparsity units. | the four SparseCores are embedding-lookup engines. |
| Four-bit arithmetic arrives with the next generation, not this one: | Four-bit arithmetic arrives with the next generation: |
| under the EAR advanced-computing rules rather than a per-chip license. | under the EAR advanced-computing rules. |
| so it stays in this note rather than the FP8 field. | so it stays in this note, out of the FP8 field. |
| the physical shipment of racks abroad rather than a per-chip license. | the physical shipment of racks abroad. |
| that is an estimate, not a Google figure, so the TDP field is empty. | that is an estimate, and Google publishes none, so the TDP field is empty. |
| taken from BF16 (16 x 459) rather than FP8 (8 x 459 = 3,672), because | taken from BF16 (16 x 459), which beats FP8 (8 x 459 = 3,672), because |
| The eight-bit path is INT8 rather than FP8, so eight-bit work on a v5e runs as integer quantisation and not in hardware floating point; | The eight-bit path is INT8, so eight-bit work on a v5e runs as integer quantization with no hardware floating point; |
| rests on Epoch rather than the vendor. | rests on Epoch. |
| sold on performance per dollar rather than peak: | sold on performance per dollar: |
| the TDP is the measured maximum rather than a rating. | the TDP is that measured maximum. |
| HBM2 rather than the unnamed HBM of later parts, and a 3D mesh instead of the torus that came later. | HBM2, named where later parts leave the generation unnamed, and a 3D mesh before the torus that came later. |
| it comes from the BF16 rate (16 x 667) rather than FP8 (8 x 1,299 = 10,392), because | it comes from the BF16 rate (16 x 667), which beats FP8 (8 x 1,299 = 10,392), because |
| Epoch AI puts the draw at about 500 W, which is an estimate rather than an AWS number. | Epoch AI puts the draw at about 500 W, its own estimate. |
| is for Maia 100 rather than for this part, and | is for Maia 100, the earlier part, and |
| The die area and power come from Epoch AI rather than from Microsoft. | The die area and power come from Epoch AI. |
| is delivered tokens per second rather than peak FLOPS. | is delivered tokens per second. |
| to bet entirely on standard Ethernet rather than a proprietary scale-up fabric, with | to bet entirely on standard Ethernet for scale-up, with |
| taken from FP8 (8 x 865) rather than BF16 (16 x 432 = 6,912), above | taken from FP8 (8 x 865), which beats BF16 (16 x 432 = 6,912), above |
| is an archived page rather than a primary document. | is an archived page, with no primary document behind it. |
| Derived, not published per chip: Groq quotes | Derived from a rack figure: Groq quotes |
| Derived, not a vendor datasheet and not independently measured: SemiAnalysis | Derived from a system figure, with no vendor datasheet and no independent measurement: SemiAnalysis |
| are a Substack newsletter and a LinkedIn post rather than anything primary, so | are a Substack newsletter and a LinkedIn post, with nothing primary behind them, so |
| sold on software compatibility rather than measured silicon. | sold on software compatibility; no measurement of its silicon is published. |

### data/landscape-notes.md

| Before | After |
|---|---|
| and is software documentation rather than a datasheet. | and is software documentation, with no datasheet behind it. |
| which is why CoWoS-L allocation rather than wafer starts became the constraint | which is why CoWoS-L allocation became the constraint |
| made liquid cooling the default rather than an option | made liquid cooling the default |
| where memory rather than logic dominates cost. | where memory dominates cost. |
| The H200 is the standard 2023 Hopper part, not a China-specific model: | The H200 is the standard 2023 Hopper part, sold worldwide: |
| on UALink over Ethernet rather than NVLink, at | on UALink over Ethernet, at |
| with 160 GB of LPDDR5X rather than HBM, and | with 160 GB of LPDDR5X and no HBM, and |
| the largest rectangle a scanner can print in one shot, rather than working around it. | the largest rectangle a scanner can print in one shot. |
| with Huawei's own high-bandwidth memory rather than stockpiled Korean stacks | with Huawei's own high-bandwidth memory in place of stockpiled Korean stacks |
| The constraint is the foundry rather than demand: | The constraint is the foundry: |
| on software compatibility rather than on measured silicon looks like. | on software compatibility, with no measured silicon, looks like. |
| comes from Epoch AI’s database rather than from the vendor. | comes from Epoch AI’s database. |
| Both are recorded above rather than averaged. | Both are recorded above as they stand. |
| a product designed against a regulation rather than a workload. | a product designed against a regulation. |
| which is why the H200 rather than the H100 became the chip | which is why the H200 became the chip |
| The stack count is not printed on AMD’s page but follows from it, since | AMD’s page prints no stack count, but the count follows from it, since |
| Those fields are empty here rather than filled from unofficial reporting. *(4 occurrences)* | Those fields stay empty here for lack of an allowed source. |
| that is an estimate, not a Google figure, so the TDP field is empty. | that is an estimate, and Google publishes none, so the TDP field is empty. |
| sold on performance per dollar rather than peak: | sold on performance per dollar: |
| so the TDP field above carries the measured maximum rather than a rating. | so the TDP field above carries that measured maximum. |
| HBM2 rather than the unnamed HBM of later parts, and a 3D mesh instead of the torus that came later. | HBM2, named where later parts leave the generation unnamed, and a 3D mesh before the torus that came later. |
| Epoch AI puts the draw at about 500 W, which is an estimate rather than an AWS number. | Epoch AI puts the draw at about 500 W, its own estimate. |
| The die area and power here come from Epoch AI, not from Microsoft. | The die area and power here come from Epoch AI. |
| is an archived page rather than a primary document. | is an archived page, with no primary document behind it. |

### src/template.html

| Before | After |
|---|---|
| <span>Money and tariffs, not a gate.</span> | <span>Money and tariffs, with no gate on shipment.</span> |

### specimens/foup.js

| Before | After |
|---|---|
| and it is the ' +       'wafers, not the fab, that the clean air is for. | and the ' +       'clean air is for the wafers inside it. |

### content/05-photomasks-and-pellicles.md

| Before | After |
|---|---|
| That is why so much AI silicon converges on a handful of designs. | That cost pushes AI silicon onto a handful of designs. |

### data/exposure.json

| Before | After |
|---|---|
| Total net sales, not the narrower net system sales base on which ASML's quarterly China percentages are quoted. | Total net sales. ASML's quarterly China percentages are quoted on the narrower net system sales base. |
| and China's own procurement restrictions, not only the basis change. | and China's own procurement restrictions as well as the basis change. |
| Group-wide, not memory alone: the figure covers phones, displays, appliances and Harman as well as semiconductors, and is the region of the reporting operations rather than a customer ship-to split. | Group-wide: the figure covers phones, displays, appliances and Harman as well as semiconductors, and it is the region of the reporting operations, with no customer ship-to split. |
