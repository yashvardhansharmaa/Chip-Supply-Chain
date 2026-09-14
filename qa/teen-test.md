# Teen reader test: the seventeen "In plain terms" paragraphs

Material: the `plain` field of `content/01-*.md` through `content/17-*.md`, read in order, 1 to 17, with nothing else. Reader: a bright sixteen-year-old, no prior reading on chips, school physics only.

## Verdict

**16 of 17 summarized correctly.** The exception is chapter 3 (photoresist): the teenager got what the coating does but could not say why it matters, because the paragraph's last sentence ("That is why nine tenths ... comes from Japan") does not follow from anything before it. Chapter 7 was summarized correctly but only after two re-reads.

The three commonest stumbles, in order of frequency:

1. **A word used before any paragraph explains it.** "Stencils the factory prints from" (ch. 1, before printing has been mentioned), "etch" (ch. 3, three chapters before etch is defined), "export controls" / "export rule" (ch. 4 and ch. 8, thirteen chapters before ch. 17 defines the term), "AI accelerator" (ch. 7, defined only in ch. 16), "processor" (ch. 1, ch. 10).
2. **The wafer-to-chip relation is never stated.** Chapter 2 says every chip is built on a 30-centimeter wafer; nothing says a wafer carries many chips until ch. 7 mentions, in passing, "one of the largest chips cut from a wafer." Until then the teenager pictured one chip per wafer. Then ch. 7 says an accelerator is one of the largest chips and ch. 11 says an accelerator cannot be one chip, which read as a contradiction.
3. **A number with nothing to set it against, or a "so" with no visible cause.** A billionth of a second (ch. 1), one atom in a hundred billion (ch. 2), one in a trillion (ch. 3), a thousand amps (ch. 14) all registered as "a lot" and nothing more. Chapter 3's "That is why," chapter 7's unexplained link between chip size and dust, and chapter 8's unexplained reason for making the strip short each cost a re-read.

Everything else passed cleanly: the teenager's summaries for chapters 5, 6, 9, 10, 12, 13, 15 and 16 were right first time with at most one hesitation.

---

## Chapter 1: Chip Design, EDA and IP

**As it stands (118 words):**

> Chip design turns an idea for a processor into a complete blueprint. A chip holds billions of transistors, tiny electrical switches, and the blueprint fixes where each one sits and how it is wired to the others. A signal has to cross those wires in less than a billionth of a second. No one draws a plan like that by hand. Software from three companies, Synopsys, Cadence and Siemens, lays it out, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. Changing the plan after that costs a fresh set of the stencils the factory prints from, and several months. Withhold the software and the design cannot be made.

**Teenager's summary:** Designing a chip means working out where billions of tiny switches go and how they connect, and only three companies' software can do it. If you can't get that software you can't make the chip at all.

**Stumbles:**
- "the stencils the factory prints from": nothing has said a factory prints chips. Read twice. The teenager guessed "like a screen print?" and moved on, unsure.
- "processor": assumed to mean the chip itself, correct, but a guess.
- "less than a billionth of a second": accepted as "really fast," no picture of why that constrains the layout.

**Editor:** see Pass 2 below.

## Chapter 2: Silicon and Wafers

**As it stands (103 words):**

> Every chip is built on a wafer, a thin round slice of silicon about 30 centimeters across. Making one starts with sand. The sand is refined until fewer than one atom in a hundred billion is anything other than silicon, then melted, and a single crystal is slowly drawn out of the melt as a long cylinder. Saws cut the cylinder into discs, and each disc is polished until its surface is flat to within a few atoms, right out to the edge. Only five companies in the world make these wafers to that standard, and none of them is American or Chinese.

**Teenager's summary:** A wafer is a ruler-wide disc of incredibly pure, incredibly flat silicon that chips get built on, made by purifying sand, growing one big crystal, slicing and polishing it. Only five companies can make them well enough and none are American or Chinese.

**Stumbles:**
- "starts with sand ... anything other than silicon": the jump from sand to silicon is unexplained; the teenager did not know sand is mostly silicon and oxygen, and briefly wondered whether silicon is added to the sand.
- "a single crystal": knew crystals from chemistry, but not why it must be one crystal or what "drawn out of the melt" looks like. Read the sentence twice.
- "one atom in a hundred billion": registered as "very pure," nothing more. Not fatal.
- Pictured one chip per 30-centimeter wafer, which is wrong and is not corrected until chapter 7.

**Editor:** see Pass 2 below.

## Chapter 3: Chemicals, Gases and Photoresist

**As it stands (121 words):**

> Photoresist is photographic film for chips. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, the parts the light reached dissolve away, and what remains is a pattern the next machine can etch into the wafer beneath. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why nine tenths of the world's photoresist comes from Japan, and a second source takes years rather than weeks.

**Teenager's summary:** Photoresist is a coating you shine light through a stencil onto, and the lit bits wash away to leave a pattern that gets cut into the wafer. Nearly all of it comes from Japan and, for some reason, swapping suppliers takes years.

**Stumbles:**
- "photographic film": a sixteen-year-old in 2026 has never handled film. The analogy explained nothing; the sentence after it did the work.
- "etch": not defined until chapter 6. Guessed "carve," correct, but a guess.
- "the parts the light reached dissolve away, and what remains is a pattern the next machine can etch into the wafer beneath": three clauses, read twice.
- "That is why nine tenths of the world's photoresist comes from Japan": the teenager stopped here. Cleanliness and per-factory approval explain why switching is slow; they do not explain why Japan. The "why it matters" half of the summary came out as "for some reason."
- "one stray metal atom in a trillion": "a lot," nothing more.

**Editor:** see Pass 2 below.

## Chapter 4: Lithography

**As it stands (95 words):**

> Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a lamp and projects the image, four times smaller, onto the silicon. The finer the lines, the shorter the wavelength of light needed to print them. The shortest light now in use will not pass through air, so the machine has to print in a vacuum. Only one company has ever built a machine that prints with it, and it is Dutch. Export controls on advanced chipmaking run through that one firm.

**Teenager's summary:** Lithography is shining light through a stencil to print one layer of the circuit onto the wafer, shrunk four times. The finest light only works in a vacuum and only one Dutch company has ever built a machine for it, so whoever controls that company controls advanced chips.

**Stumbles:**
- "Export controls": first appearance, undefined until chapter 17. The teenager guessed "rules about selling abroad" from the words and got the gist, but "run through that one firm" was vague: run through how?
- "The finer the lines, the shorter the wavelength": accepted on trust; no reason given. Did not block.
- Noticed this repeats the light-through-a-stencil picture from chapter 3, which helped rather than hurt.

**Editor:** see Pass 2 below.

## Chapter 5: Photomasks and Pellicles

**As it stands (109 words):**

> A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so the plate cannot be a window. Instead it is a mirror, built up from about forty pairs of ultrathin layers, and the light bounces off it. Any speck of dust on the plate repeats on every wafer it prints. Two Japanese firms make almost all of those mirrors. A business almost nobody has heard of can hold up every advanced chip in the world.

**Teenager's summary:** The photomask is the stencil, one per layer, and for the newest light it has to be a mirror made of forty layer pairs because no glass lets that light through. One mask prints millions of chips so a speck of dust on it wrecks all of them, and two Japanese firms make nearly all the mirrors.

**Stumbles:**
- One hesitation: "how is a mirror a stencil?" The teenager worked out that some parts of the mirror must reflect and some must not, and moved on. Not a re-read.

**Editor:** see Pass 2 below.

## Chapter 6: Deposition and Etch

**As it stands (112 words):**

> Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. A chip takes more than a thousand of these rounds. The film has to reach the bottom of holes hundreds of times deeper than they are wide, and the etch has to eat one material and leave the one beside it untouched. Four firms in America, Japan and the Netherlands make most of these machines, and China has come closer to matching them here than anywhere else.

**Teenager's summary:** A chip is built by laying down a film a few atoms thick, printing a pattern on it, eating away the unprotected parts, and repeating more than a thousand times. Four companies in America, Japan and the Netherlands make most of the machines, and this is the stage where China is closest to catching up.

**Stumbles:**
- "the bottom of holes hundreds of times deeper than they are wide": which holes? Nothing has mentioned holes. Read twice, then accepted that the etching must make holes.
- Otherwise the clearest paragraph so far; it also retroactively explained "etch" from chapter 3.

**Editor:** see Pass 2 below.

## Chapter 7: Metrology and Inspection

**As it stands (124 words):**

> Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over. It checks whether the lines are the right width, whether this layer landed squarely on the last one, and whether a speck of dirt has killed a circuit. An AI accelerator is one of the largest chips cut from a wafer, and on a chip that size, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a chip factory, or fab, cut off from it can buy every other tool and still not learn why its chips fail.

**Teenager's summary:** Inspection machines look at the wafer between steps for wrong line widths, crooked layers and dirt. Big AI chips get ruined by dust easily, and one American company so dominates these machines that a factory without them can't work out why its chips are failing.

**Stumbles:**
- "AI accelerator": first use, undefined. Guessed "the AI chip." Correct, but a guess.
- "one of the largest chips cut from a wafer": the first time the teenager learned that a wafer holds many chips. Went back to chapter 2 mentally and revised the picture.
- "on a chip that size, halving the stray specks lifts the share of working chips from about half to about seven in ten": read twice. Why does size matter? The teenager eventually reasoned that a bigger chip is a bigger target for dust, but the paragraph does not say it.
- "seven times as many ... as its nearest rival": fine.

**Editor:** see Pass 2 below.

## Chapter 8: Transistors and the Front End

**As it stands (127 words):**

> The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch is a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the strip, which takes a long sequence of steps that have to run in exact order. Only TSMC, Intel and Samsung can do it, a list short enough for an export rule to name in full.

**Teenager's summary:** A transistor is a valve: current runs along a tiny strip of silicon and a gate on top switches it on or off. When the strip gets very short it leaks, so the fix is to wrap the gate all the way round it, and only TSMC, Intel and Samsung can do that.

**Stumbles:**
- "Make the strip short enough and the valve stops sealing": why would anyone make it short, then? The paragraph never says. The teenager assumed "to fit more in" and carried on.
- "export rule": still undefined, but by now guessed correctly.
- "TSMC": first named here, with no clue what it is (a foundry, explained in chapter 9). Assumed it was a company.

**Editor:** see Pass 2 below.

## Chapter 9: Foundries and Fabs

**As it stands (117 words):**

> A foundry is a factory that makes chips for other companies. Those companies send in their designs, and the foundry runs them all through the same building on the same tools. The building costs tens of billions of dollars, and the air inside is cleaner than an operating theatre. Even so, a wafer crosses hundreds of machines over several months inside sealed boxes, never touching that air. No chip company sells enough of one product to fill a factory like that on its own, so the world shares a handful of them. TSMC runs the biggest, and all six of its largest plants sit in Taiwan, which is why one island's politics reaches the whole chip supply.

**Teenager's summary:** A foundry is a chip factory that makes other companies' designs, costs tens of billions, and keeps wafers in sealed boxes for months as they go through hundreds of machines. Nobody can fill one alone so everyone shares a few, and TSMC's biggest ones are all in Taiwan, which is why Taiwan matters so much.

**Stumbles:**
- "foundry" versus "fab" (chapter 7 called a chip factory a fab): a moment's confusion about whether these are two things. Not a re-read.
- Nothing else. Clean.

**Editor:** see Pass 2 below.

## Chapter 10: Memory and HBM

**As it stands (126 words):**

> High bandwidth memory is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker stacks up to sixteen memory chips into a cube, drills holes straight down through the stack, and fills the holes with copper so that every layer is wired to the ones below. The cube then sits beside the processor. Stacking is the hard part. Each chip is ground so thin that the copper shows through its back, the finished cube has to fit under the plate that cools it, and one bad chip ruins the whole cube. Only SK hynix, Samsung and Micron have made it work, and a single line in an American export rule reaches all three.

**Teenager's summary:** HBM is the memory that sits next to the AI chip, made by stacking up to sixteen memory chips and drilling copper-filled holes down through them so every layer connects. Stacking is so hard that only three companies can do it, and one American rule covers all three.

**Stumbles:**
- "the copper shows through its back": read twice to see that the copper in the holes pokes out of the underside so the next chip can connect. Got there.
- "HBM" in the title never appears in the paragraph; the teenager matched it to "High bandwidth memory" without trouble.

**Editor:** see Pass 2 below.

## Chapter 11: Advanced Packaging

**As it stands (119 words):**

> Packaging joins finished chips into one component and mounts them on a base wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot, so a modern accelerator cannot be one chip. It is made as several pieces, set side by side on a shared slab of silicon and wired together through it, with the memory a few millimeters away. Slab, chips and base all expand at different rates when heated, so the package can warp and its joints crack. Getting that right in volume is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan.

**Teenager's summary:** Packaging is putting several finished chips side by side on a silicon slab, with the memory next to them, and mounting the lot on a base, because one print shot only covers a postage stamp so an accelerator has to be several chips. The parts expand differently when hot and can crack, so it's hard, and nearly all of it is done by TSMC in Taiwan.

**Stumbles:**
- "so a modern accelerator cannot be one chip": chapter 7 said an AI accelerator "is one of the largest chips cut from a wafer." Is it one chip or several? Stopped and re-read both. Concluded chapter 7 must have meant the main chip inside it.
- "a base": chapter 12 then calls it a "package substrate." The teenager did not connect the two until well into chapter 12.

**Editor:** see Pass 2 below.

## Chapter 12: Substrates and PCBs

**As it stands (122 words):**

> A package substrate is the adapter between a chip and the circuit board under it. The chip's connections come out finer than a human hair; the board is wired in millimeters. The substrate is built up like plywood. A stiff core of glass cloth and resin sits in the middle, thin sheets of epoxy film are pressed onto both faces, a laser burns holes through each sheet, and copper is plated into the holes to carry signals from one layer to the next. Every added layer is another set of holes that can fail. A handful of firms build these substrates, and the film and the glass cloth each come from a single Japanese supplier, so a shortage here stops accelerators shipping.

**Teenager's summary:** The substrate is a plywood-like layered board that steps the chip's hair-fine connections down to the circuit board's millimeter ones, with laser-drilled, copper-filled holes carrying signals between layers. Only a few firms build them and two of the key materials each come from one Japanese company, so a shortage stops accelerators shipping.

**Stumbles:**
- The plywood sentence is four clauses long; read twice, but understood.
- Nothing else. Clean.

**Editor:** see Pass 2 below.

## Chapter 13: Test and Assembly

**As it stands (106 words):**

> Before a chip can be sold, a machine has to put questions to it and check every answer. While the chips are still on the wafer, thousands of needles press onto pads on each one, send in signals and read what comes back; the tester marks any chip that answers wrong, and that chip goes no further. A modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests sooner, at higher temperatures and for longer than it used to, and two firms, one Japanese and one American, sell most of the machines that do it.

**Teenager's summary:** Every chip gets tested by pressing thousands of needles onto it while it's still on the wafer and checking its answers, and any that fail are thrown out. Because an accelerator glues a dozen expensive pieces together and one bad one wastes them all, testing happens earlier and harder, and two firms make most of the testers.

**Stumbles:**
- None that cost a re-read. "Pads" was guessed as "contact points" and was right.
- A faint puzzle: testing on the wafer sounds like it happens before packaging, but this chapter comes after packaging. Did not block.

**Editor:** see Pass 2 below.

## Chapter 14: Systems and Networking

**As it stands (104 words):**

> One AI chip is not enough to train a model. So seventy-two of them are wired together in a rack, a cabinet the size of a wardrobe, and run as one computer. Each chip sits on its own board and draws more than a thousand amps. The chips have to swap results with each other all the time, and a copper wire can carry those signals only a few meters, so the longer links send them as light down glass fiber. Many companies can build the rack. Only a few can make the lasers that send the light, and that is the narrow point.

**Teenager's summary:** Seventy-two AI chips get wired into a wardrobe-sized rack and run as one computer, and since copper can only carry their signals a few meters, the longer links go as light through glass fiber. Anyone can build a rack but only a few companies can make the lasers.

**Stumbles:**
- "more than a thousand amps": no comparison. The teenager knew amps from physics and knew a phone charger is about two, but had no feel for a thousand. Registered as "a lot."
- Nothing else. Clean.

**Editor:** see Pass 2 below.

## Chapter 15: Data Centers and Power

**As it stands (124 words):**

> A data center's job is to feed electricity to the machines inside it and carry away the heat they give off. The scale has changed. A hair dryer draws about two kilowatts and pours it out of a hand-sized nozzle as heat. One rack of AI chips, a box the size of a wardrobe, draws as much as seventy hair dryers, and every watt of that becomes heat too, more than air can carry away, so water is piped through the rack instead. The building is the easy part. Getting the electricity to the door is the hard one, because the transformers, heavy switches and turbines that connect a site to the grid come from a few suppliers and are ordered years in advance.

**Teenager's summary:** A data center feeds the racks electricity and gets rid of the heat, and one rack now gives off as much heat as seventy hair dryers, so it has to be water-cooled. The hard part isn't the building, it's getting enough electricity to it, because the grid equipment comes from a few suppliers with years-long waits.

**Stumbles:**
- "turbines that connect a site to the grid": a turbine makes electricity, it doesn't connect anything. Half a second of puzzlement, then let it go.
- The hair dryer comparison was the best in the whole set; the teenager said so.

**Editor:** see Pass 2 below.

## Chapter 16: The Economics of AI Chips

**As it stands (95 words):**

> A bill of materials is the list of parts inside a product and what each one costs to build. For an AI accelerator, the processor itself, the chip that does the calculating, is the cheap part, about a seventh of the total. The stacked memory beside it is nearly half, and the packaging that wires the two together costs more than the chip. Three firms in the world make that memory and one Taiwanese firm does that packaging, so the costliest parts are also the scarcest, and that is where a government's rules bite hardest.

**Teenager's summary:** In an AI accelerator the actual calculating chip is only about a seventh of the cost; the stacked memory is nearly half and the packaging costs more than the chip. The expensive parts are the ones only three memory firms and one Taiwanese packager can make, so that's where government rules hurt most.

**Stumbles:**
- None. This paragraph also finally defined "AI accelerator" and "processor," nine chapters after they were first used.

**Editor:** see Pass 2 below.

## Chapter 17: Geopolitics

**As it stands (120 words):**

> An export control is a rule that makes a sale need the government's permission. The government names an item and a buyer, and from then on its own companies must hold a license before they ship that item to that buyer. Washington stretches the rule to cover goods made abroad with American technology. Few governments can use such a rule to much effect, because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.

**Teenager's summary:** An export control is a government saying its companies need a license to sell a named thing to a named buyer, and the US applies it even to things made abroad with American technology. It only works for the few countries whose companies make the chipmaking machines, software and chemicals, and China can copy the easy machines but not the finest printer, its chemistry, or stacked memory.

**Stumbles:**
- "Few governments can use such a rule to much effect, because ...": read twice. The reason is that a rule only bites if your own companies make something nobody else does; the sentence leaves the reader to supply that step.
- "Washington": understood as the US government.
- "the machine that prints the finest circuits": recognized from chapter 4. Good tie-back.

**Editor:** see Pass 2 below.

---

## The teenager's five sentences: sand to data center

1. You start with sand, purify it until almost every atom is silicon, grow it into one giant crystal, and slice and polish that into flat round wafers that each hold lots of chips.
2. Someone designs the chip with software from three companies, and then a factory builds it onto the wafer layer by layer, more than a thousand times over: lay down a film a few atoms thick, coat it with photoresist, shine light through a mirror-stencil (a photomask) to print the design, etch away the unprotected bits, and inspect it, until billions of tiny valve-like transistors and their wiring are there.
3. Only a few foundries like TSMC in Taiwan can run those factories, and the machines, chemicals, masks and wafers they use each come from a handful of companies in the Netherlands, Japan, the US and South Korea.
4. The chips are tested with needles while still on the wafer, cut out, and then several of them plus stacks of memory are set side by side on a silicon slab and mounted on a layered substrate, mostly by TSMC, and that packaging and memory cost more than the calculating chip itself.
5. Seventy-two of those go into a wardrobe-sized rack, talk to each other over light through glass fiber, and sit in a data center that needs so much electricity and water cooling that getting power to the building is the hard part, and because every stage has only a few suppliers, a government can choke the whole chain with an export rule on one company.

The account is right in its order and its main actors. Two gaps: the teenager cannot say what "the front end" and "deposition" are as distinct stages (they merged into "layer by layer"), and could not say what a photomask is made of beyond "a mirror," which is fine.

---

## Pass 2: editor

Scoring rule applied: a paragraph passes if the teenager's summary was right and there was at most one stumble. A paragraph with a correct summary and two or more stumbles, or one stumble that a single sentence fixes, gets one or two sentence changes. A paragraph with a wrong or vague summary, or three or more stumbles, gets a full rewrite. Rewrites keep every fact and number, stay within about 20 percent of the original length, and keep the last sentence's job.

Result: two full rewrites (chapters 3 and 7), seven sentence changes (chapters 1, 2, 4, 8, 9, 11, 17), one optional clause (chapter 14), seven passes (chapters 5, 6, 10, 12, 13, 15, 16).

### Chapter 1: sentence change

Correct summary; one real stumble, on "stencils the factory prints from." One sentence fixes it by saying what the stencils are the first time they appear.

Replace:

> Changing the plan after that costs a fresh set of the stencils the factory prints from, and several months.

with:

> The factory prints each layer of the design onto silicon through a stencil, and changing the plan after that costs a fresh set of stencils and several months.

"A billionth of a second" is left alone; the teenager took it as "very fast," which is all it needs to do here.

### Chapter 2: sentence change

Correct summary; two small stumbles (sand to silicon, single crystal) and one wrong picture (one chip per wafer) that the paragraph could fix in two words. Two sentence changes.

Replace:

> Every chip is built on a wafer, a thin round slice of silicon about 30 centimeters across. Making one starts with sand.

with:

> Every chip is built on a wafer, a thin round slice of silicon about 30 centimeters across that carries hundreds of chips at once. Making one starts with sand, which is mostly silicon bound to oxygen.

Replace:

> ... then melted, and a single crystal is slowly drawn out of the melt as a long cylinder.

with:

> ... then melted, and a single crystal, its atoms in one unbroken orderly pattern from end to end, is slowly drawn out of the melt as a long cylinder.

Note: "hundreds of chips" and "silicon bound to oxygen" are new facts, not in the original paragraph. Both are supported by the chapter body (quartzite feedstock; die counts) but the author should confirm the wording before it goes in. If "hundreds" is unwanted, "that carries many chips at once" does the job.

### Chapter 3: full rewrite

Vague summary on why it matters; four stumbles. The photographic-film opener does no work for this reader, "etch" is undefined, the third sentence is three clauses long, and the last sentence's "That is why" claims a cause the paragraph does not give. The rewrite says what the coating does in plain words, defines etch in the sentence that first needs it, moves the cause (per-factory approval) next to its effect (years to switch), and gives the Japan share its own plain statement. 142 words against 121 (17 percent over).

> Photoresist is a coating that changes wherever light hits it, the way old photographic film did. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, and the parts the light reached dissolve away. What remains is a pattern, and the next machine cuts that pattern into the wafer beneath, a step called etching. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time, so a second source takes years rather than weeks. Nine tenths of the world's photoresist comes from Japan, and no factory can swap it out quickly.

Every number kept: soap bubble, a few hundred, one atom in a trillion, one factory and one product, nine tenths, Japan, years rather than weeks. The photographic film comparison is kept but demoted to a trailing clause, since it helps an adult and does nothing for a teenager. If the author would rather cut it, the first sentence reads "Photoresist is a coating that changes wherever light hits it."

### Chapter 4: sentence change

Correct summary; one stumble, "export controls," undefined for thirteen more chapters. Define it in the sentence that uses it, and replace "run through," which the teenager could not picture.

Replace:

> Export controls on advanced chipmaking run through that one firm.

with:

> Export controls, the government rules on who a company may sell to, reach advanced chipmaking mainly by reaching that one firm.

The wavelength sentence is left alone. The teenager accepted it on trust and the chapter body is the place for the reason.

### Chapter 5: passes

Correct summary first time; one hesitation ("how is a mirror a stencil?") that the teenager resolved without re-reading. Every term is defined by this paragraph or an earlier one, the numbers (forty pairs, millions of chips) carry their own meaning, and the last sentence does its job.

### Chapter 6: passes

Correct summary; one re-read ("which holes?"). The paragraph is the clearest in the set: four short sentences give the whole cycle, the count of rounds is plain, and the last sentence names the suppliers and the China exception. The holes could be introduced with three words ("the holes the etch cuts"), but the teenager recovered on their own and the paragraph is better left as it is.

### Chapter 7: full rewrite

Correct summary but three stumbles, two of them structural: the paragraph is the first place the reader learns a wafer carries many chips, and it uses "AI accelerator" without saying what it is. It also leaves the reader to work out why chip size and dust are connected. The rewrite says all three in one sentence, and names the accelerator's main chip rather than the accelerator, which also removes the apparent contradiction with chapter 11 ("cannot be one chip"). 147 words against 124 (19 percent over).

> Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over. It checks whether the lines are the right width, whether this layer landed squarely on the last one, and whether a speck of dirt has killed a circuit. A wafer carries many chips, and the main chip in an AI accelerator, the one that does the calculating, is one of the largest cut from it, so a speck has more chip to hit. On a chip that size, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a chip factory, or fab, cut off from it can buy every other tool and still not learn why its chips fail.

Every number kept: half to seven in ten, seven times the nearest rival. "The one that does the calculating" matches chapter 16's own definition of the processor, so the two paragraphs now agree. If chapter 2 takes the "carries hundreds of chips" change above, "A wafer carries many chips, and" can be dropped here and the paragraph falls back to 142 words.

### Chapter 8: sentence change

Correct summary; one stumble, and it is a real one: the paragraph presents shortening the strip as a problem without saying why anyone does it. Six words fix it.

Replace:

> Make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing.

with:

> Shorter strips switch faster and more of them fit on a chip, but make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing.

Note: this adds a reason the original paragraph does not state. The chapter body supports it (each node's published speed and density gains), but the author should confirm. "TSMC" appearing before chapter 9 defines it is left alone; the teenager read it as a company name and was right.

### Chapter 9: sentence change

Correct summary, no re-reads. Two small things, one of them a rule breach. "Operating theatre" is British; the house rule is American spelling. And the teenager paused on foundry versus fab, which chapter 7 introduced; one word joins them.

Replace:

> A foundry is a factory that makes chips for other companies.

with:

> A foundry is a fab that makes chips for other companies.

Replace:

> ... the air inside is cleaner than an operating theatre.

with:

> ... the air inside is cleaner than an operating room.

### Chapter 10: passes

Correct summary; one re-read on "the copper shows through its back," which the teenager solved. Every term is defined in the sentence that uses it, the process is told in the order it happens, the number (sixteen) is plain, and the last sentence names the three firms and the rule. The paragraph uses "processor" without defining it, but by chapter 10 the reader has inferred it.

### Chapter 11: sentence change

Correct summary; two stumbles. The first, the apparent contradiction with chapter 7, is fixed on chapter 7's side above. The second is that this paragraph says "base" and the next says "package substrate" for the same thing; one word bridges them.

Replace:

> Packaging joins finished chips into one component and mounts them on a base wired almost as finely as the chips themselves.

with:

> Packaging joins finished chips into one component and mounts them on a base, called a substrate, wired almost as finely as the chips themselves.

If chapter 7 is not rewritten, add here instead: "so a modern accelerator cannot be one chip" becomes "so a modern accelerator's main chip is already as large as one shot allows, and the whole accelerator cannot be one chip."

### Chapter 12: passes

Correct summary; one re-read on the four-clause plywood sentence, but the teenager understood it and it is the sentence that carries the picture. Hair and millimeters give the two scales without a number, plywood is the one analogy and it earns its place, and the last sentence names the firms, the single suppliers and the consequence. Leave it.

### Chapter 13: passes

Correct summary, no re-reads. "Put questions to it and check every answer" is the best opening line in the set for this reader. The needles, the wafer, the dozen pieces, the two firms: all plain. The faint ordering puzzle (wafer test before packaging, chapter after packaging) belongs to the chapter order, not the paragraph.

### Chapter 14: passes, one optional clause

Correct summary, no re-reads. The only stumble is "more than a thousand amps," which has no comparison. A comparison in amps is hard to make honest, because household current runs at a different voltage; the safest is a qualitative one. If the author wants it:

Replace:

> Each chip sits on its own board and draws more than a thousand amps.

with:

> Each chip sits on its own board and draws more than a thousand amps, enough to melt the wiring in a house.

Otherwise the paragraph passes as it stands; "a lot" is all the teenager needed from that number, since the next chapter carries the scale with the hair dryers.

### Chapter 15: passes

Correct summary, no re-reads, and the hair dryer is the comparison the teenager remembered afterward. "Turbines that connect a site to the grid" is loose (turbines generate; transformers and switches connect) but cost half a second, not a re-read, and fixing it would need a longer list. Leave it.

### Chapter 16: passes

Correct summary, no stumbles. Defines its one term (bill of materials) in the first sentence, defines processor in the second, gives three fractions the teenager could hold (a seventh, nearly half, more than the chip), and the last sentence ties scarcity to cost to policy. The only regret is that "AI accelerator" and "processor" get their definitions here rather than in chapter 7, which the chapter 7 rewrite addresses.

### Chapter 17: sentence change

Correct summary; one re-read, on the sentence that makes the paragraph's main argument. The reader has to supply the missing step (a rule only bites if your own firms sell something the buyer cannot get elsewhere). Split the sentence and say the step.

Replace:

> Few governments can use such a rule to much effect, because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea.

with:

> Few governments can use such a rule to much effect. It works only when the government's own firms sell something the buyer cannot get elsewhere, and the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea.

Adds nine words; the paragraph goes from 120 to 129.

### Two things no single paragraph can fix

1. **Where the reader learns that a wafer holds many chips.** The chapter 2 and chapter 7 changes above both plant it; one of them is enough, and chapter 2 is the natural place.
2. **Undefined terms that arrive early and are defined late.** "Export controls" (defined chapter 17, used chapters 4, 8, 10), "AI accelerator" and "processor" (defined chapter 16, used chapters 1, 7, 10, 11, 13). The chapter 4 and chapter 7 changes define them at first use. Once those are in, every term in the seventeen paragraphs is explained by the paragraph that first uses it or an earlier one, which is the property the set should have for a reader who reads them in order with nothing else.
