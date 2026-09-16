# How it works: register edit and apply

Date: 16 September 2026. Input: the twelve proposed texts in Pass 2 of `qa/howitworks-test.md`, for chapters 01, 02, 03, 05, 06, 07, 08, 09, 10, 11, 14 and 15. Standard: `.claude/skills/writing-well/SKILL.md` and the categories in `qa/speak-hunt-a.md`. Calibration: the body of `## How it works` in `content/04-lithography.md`, about 300 words after the plain box, mechanism in order, no stems, no clefts, one colon in the whole passage and that one in a citation.

Rule for the edit: every mechanism the tester added stays, every number stays with its citation, every glossary term keeps the form the text already uses. What goes is the register: stem sentences that announce the next one, deictic openers (This is, That is), clefts (What is left is, The reason is, they are what), punchline colons, "X, not Y" framings, restatements of the plain box, and self-reference to the page. The plain box in each chapter is untouched.

Two factual notes, both flagged for the author rather than silently changed:

- 03: the tester's note is right that one exposure covers one patch, not a wafer, and chapter 04 says so in its own words ("the wafer moves under the lens one patch at a time"). The text now says "expose each patch of the wafer in milliseconds". The old sentence carried no citation, so nothing sourced changed.
- 05: the proposal said High-NA scanners "print finer lines through a wider lens". EUV scanners have no lens; chapter 04 says they use mirrors instead. The text now says "with larger mirrors", which is what the cited ASML page describes. No number changed.

Word counts are for the replacement text alone, box excluded.

## 01 Design and EDA (341 words)

Changes from the proposal:

- RTL bullet: "Engineers write the plan as code in the hardware language SystemVerilog. The code is called register-transfer level, or RTL." was two sentences to name one thing. Folded into one, keeping the site's hyphenated form "register-transfer-level code". The semicolon sentence that followed became two plain sentences.
- Closing paragraph: "The numbers below name generations of the process and rank them rather than measure anything" pointed at the page ("below") and sat between the cost of a mistake and the mask prices it introduces. Moved after the citation as "The nanometer labels name generations of the process, each finer than the last, and no longer measure anything", so the price sentence and its source stay together and the explanation comes once the reader has met the labels.
- Everything else reads clean: the stem before the bullets carries three facts (five stages, chained, software) and is the list's heading rather than an announcement, so it stays.

## 02 Silicon and wafers (353 words)

Changes from the proposal:

- "This is the Siemens process, and the rods are what everything downstream is made from." was a deictic opener plus a cleft. Now the name rides on the sentence that describes the process ("...thicken into gray rods of polysilicon, the Siemens process.") and the rods get a plain sentence: "Everything downstream is made from those rods."
- "distill the gas the way a still separates spirit from wash: the impurities boil..." had a colon standing in for "because". Replaced with "because".
- "A small seed crystal on the end of a rod touches the surface of the melt and is drawn upward" had no actor. Now "The grower lowers a small seed crystal on the end of a rod to the surface of the melt and draws it back up, slowly turning." The next sentence starts "The pull starts with a thin neck" rather than a third "The grower".
- The comparisons the tester added (hotter than lava, still hot enough to glow orange, far too small to see, a web of fine wire running through abrasive) all stay; each carries scale.

## 03 Chemicals, gases and photoresist (334 words)

Changes from the proposal:

- "Since the 1990s the workhorse has been the chemically amplified resist, and light does not dissolve it directly." The second clause was an "X is not Y" set-up for the sentence after it. Cut; "nothing more happens until the wafer is baked" already says that light alone does nothing.
- "expose a wafer in milliseconds" is now "expose each patch of the wafer in milliseconds" (see the factual note above).
- Third paragraph: two passives with knowable actors turned active. "Nitrogen trifluoride is torn into charged fragments in a plasma, and the fragments scrub..." is now "A plasma tears nitrogen trifluoride into charged fragments, which scrub the chamber walls clean between wafers." "a machine knocks atoms off them with a plasma" is now "a plasma knocks atoms off them".
- The mechanism chain (photon frees acid, bake multiplies, wash removes) is kept sentence for sentence. "Extreme ultraviolet upsets that arrangement" is kept over the old "breaks that bargain", since "bargain" was a metaphor the section never cashed.

## 05 Photomasks and pellicles (334 words)

Changes from the proposal:

- "For deep ultraviolet the blank is a window: quartz carrying..." and "For EUV the blank is a mirror: about 40..." were two colons doing the work of "of". Now "a window of quartz carrying..." and "a mirror of about 40 molybdenum and silicon layer pairs...".
- "with a tantalum absorber on top that carries the pattern. The absorber is a dark film; the mirror beneath it reflects." The second sentence restated the first. Folded: "with a dark tantalum film on top, the absorber, that will carry the pattern."
- "The mask shop then writes the pattern. The blank is coated with resist, and a mask writer draws..." The first sentence announced the second. Folded: "The mask shop coats the blank with resist, and a mask writer draws the design...".
- "What is left is a plate that passes light..." was a cleft. Now "The plate now passes light, or reflects it, in the exact shape of one layer of the chip".
- "a repair tool fixes stray defects, because any that remain print on every wafer" repeated what the plain box says two paragraphs up and what the Particles bullet says two paragraphs down. Now "a repair tool fixes the stray defects it finds."
- "through a wider lens" is now "with larger mirrors" (see the factual note above).
- The three bullets and the closing High-NA paragraph are otherwise as proposed, including the tester's glosses "the newest EUV machines", "one chip's rectangle" and "larger than today's".

## 06 Deposition and etch (324 words)

Changes from the proposal:

- "What is left is a plasma: charged fragments of gas that react..." was a cleft with a punchline colon. Now "The gas is now a plasma, charged fragments that react far more readily than whole molecules do."
- "For deposition, the gas is chosen to carry the material wanted." and "For etch, the gas is chosen to attack one material..." were passives with no actor doing the choosing. Now "For deposition the gas carries the material wanted." and "For etch the gas attacks one material and leaves the one beside it." The later clause "which the gas was chosen not to touch" stays, since there the choosing is the point.
- "which is how a film gets to the bottom of holes hundreds of times deeper than they are wide" is now "so the film gets to the bottom of holes hundreds of times deeper than they are wide": same link back to the box, shorter.
- "That is why the export controls here name process specifications rather than machines." was a deictic opener (the hunt's category 5) surviving from the old text. Folded into the sentence before it with "which is why".
- "It adds up." was a stem announcing the CSET sentence. Cut; the CSET sentence stands on its own as the section's last paragraph. The old text opened the section with it, before any mechanism, which the tester's fault 4 (business or history before the reader knows how the thing works) is about, so the move to the end is kept.
- The cycle description ("let one gas settle in a single layer on every surface, pump it out, admit a second gas...") keeps its colon, since it introduces a sequence rather than a reveal, and the etch-stop mechanism is kept word for word.

## 07 Metrology and inspection (349 words)

Changes from the proposal:

- "Inspection works by comparison. A tool sweeps..." The first sentence announced the second. Folded: "An inspection tool sweeps a beam of light across the wafer, photographs it, and compares the image of each chip with the image of its neighbors."
- "Metrology measures rather than hunts. It shines light..." was a stem plus "X rather than Y", and the tester's first paragraph ran 130 words. Split into two paragraphs, inspection then metrology, and the metrology sentence now has a subject that does something: "A metrology tool measures rather than hunts. It shines light on a test pattern... and works out from the scatter how wide the lines are...". The contrast is kept because it is the one thing that separates the two tool classes; the semicolon joining the two measurements became "and".
- "The reason the fab pays for this is yield" was a cleft. Now "The fab pays for all this to protect yield, the share of chips on a wafer that work."
- "The second kind follows a rule: a bigger chip is a bigger target, and the loss grows faster than the area." was a stem with a punchline colon. Now "A bigger chip is a bigger target for the second kind, and the loss grows faster than the area." The old text's "Yield falls faster than area rises" is carried by "the loss grows faster than the area".
- The tester's glosses ("which says how much defects bunch together" for the clustering constant, "In the standard formula") stay. The equation, its three numbers and all three citations are unchanged, and the last paragraph is the current text as the tester kept it.

## 08 Transistors and the front end (310 words)

Changes from the proposal:

- "The front end builds that valve in the order the wafer meets each step." The qualifier was circular (every process runs in the order its steps run). Now "in a fixed order", which is the claim the box makes and the third paragraph explains.
- The 190-word first paragraph is split after the implant sentence, so implant is one paragraph and channel shaping the next.
- "Then it shapes the channel. In a FinFET, an etch cuts..." was a stem announcing the next sentence. Folded: "Next it shapes the channel, in a FinFET by etching the silicon into thin fins standing up from the wafer and laying the gate over the top and both sides of each fin, three sides instead of one." The gate-all-around sentence then opens "In a gate-all-around transistor the fab instead grows...".
- "three sides instead of one" and "four sides" were both hung on punchline colons. Now commas: "..., three sides instead of one." and "..., all four sides."
- "they must run in exact order: a sheet cannot be wrapped once the metal is on, and the insulator cannot be added once it is buried" had a colon for "because". Now "they have to run in exact order, since a sheet cannot be wrapped once the metal is on, nor the insulator added once it is buried."
- "The wrapping is the answer to the leak in the plain box, short-channel leakage" referred to the page's own layout. Now "The leak the wrapping fights is short-channel leakage, and it has three fixes:". The three bullets are the current text with the tester's one change ("fewer electrons slip straight through it" for "less current tunnels through it") kept, since "tunnels" was a logged stumble.

## 09 Foundries and fabs (313 words)

Changes from the proposal:

- "the tool does its one job, which is to deposit a film, print a pattern, etch it, clean it or measure it" is now "the tool does its one job, depositing a film, printing a pattern, etching it, cleaning it or measuring it".
- "A chip takes hundreds of those visits, which is why a wafer spends months inside, and the pods are why it can: the wafer never meets the room's air, and the room's air is itself filtered..." was one sentence with a "why... why... :" chain and a punchline colon. Split. The loop paragraph now ends "A chip takes hundreds of those visits, so a wafer spends months inside." and a second paragraph opens "The pod keeps the wafer clean for all of that time, because the wafer never meets the room's air, and even that air is filtered until it carries almost no dust." That also breaks the tester's 230-word single paragraph into two, the loop and then the building.
- "What comes out is a finished wafer, tested (see ...) and sent on to be cut and packaged." was a cleft. Now "The finished wafer is tested (see [Test and assembly](#test-and-assembly)), then cut and packaged."
- The recipe sentence and "an idle tool earns nothing" are as proposed. The two business paragraphs are the current text with the tester's two glosses kept: "counted as if each were the standard 12-inch size" for "12-inch equivalent", and "The six largest plants, all in Taiwan and called gigafabs" for "The six Taiwanese gigafabs". Numbers and citations unchanged.

## 10 Memory and HBM (228 words)

Changes from the proposal:

- "on top of a base die at the bottom that manages the stack" said the bottom twice. Now "and the whole stack sits on a base die that manages it."
- "The copper-filled holes are TSVs, and they are what let a signal reach any layer" was a cleft. Now "The copper-filled holes are TSVs, through-silicon vias, and they let a signal reach any layer without a wire around the outside." The expansion is added because the skill asks for the acronym spelled out on first use; the glossary entry is "TSV", which the text keeps.
- "Ordinary memory cannot be made that wide: the pins would not fit" had a colon for "because". Now "because". The next sentence's "because" became "since" so the two do not echo.
- "Generating one word of an answer is different. The chip reads the whole model..." The first sentence announced the second. Folded: "To generate one word of an answer, the chip reads the whole model from memory, and the whole record of the conversation so far, does a little arithmetic, and waits for the next read."
- "So memory size and speed..." keeps its opening "So"; the skill allows a turn word at the head of a sentence.

## 11 Advanced packaging (168 words)

Reads clean. The proposal is the current text plus three glosses ("that many wires at once", "metal-filled holes that join one layer of wiring to the next", "dots of solder 30 to 40 microns apart, about a third of a hair's width, each dot one electrical joint") and one added step ("and the substrate goes onto its board"). None of the glosses is a stem, cleft or restatement, the two colons ("a second reason to split the package:" and "The name CoWoS says the order:") are the current text's and introduce a list of two and a sequence, and the closing "The individual steps are ordinary. But one cracked joint..." is the current ending. Applied as proposed. It is under the 200-word floor, as the tester noted, because the plain box already carries most of the mechanism.

## 14 Systems and networking (238 words)

Changes from the proposal:

- "An accelerator ships as a module, not a bare chip: the chip on a small board..." was an "X, not Y" framing with a punchline colon. Now "An accelerator ships as a module, the chip on a small board with its power supply and memory stacks."
- "with an optical transceiver at each end: a laser turns the electrical signal..." had a colon before the mechanism. Now "at each end, where a laser turns the electrical signal into pulses of light and a detector at the far end turns the pulses back into current."
- "The lasers are the part few firms can make." restated the plain box's last two sentences ("Only a few can make the lasers that send the light, and that is the narrow point."). Cut.
- "the switch chips, the traffic directors that pass data between any two modules at full speed" stays; the tester added it for a logged stumble and it carries the function. "more than ten times a conventional enterprise rack" stays with its citation, the same page chapter 15 cites for the same comparison. The byte-to-bit sentence and the two-networks paragraph are as proposed.

## 15 Data centers and power (227 words)

Changes from the proposal:

- "Power reaches it in stages, each one a piece of heavy equipment with its own lead time." was a stem announcing the five sentences after it. The five sentences now open with "Between the grid and the rack, a substation steps the high voltage down with transformers." and the lead-time fact closes the paragraph, where the current text also had it: "Every one of those is heavy equipment with its own lead time." That puts the springboard to the rest of the chapter (lead times) at the end of the paragraph rather than the start.
- "Raising the voltage cuts the current for the same power, and it is current that heats copper, so the same conductor carries over 150 percent more power, which retires the 200 kg busbars" had a cleft in the middle. Now "and heat in copper comes from current, so the same conductor carries over 150 percent more power and the 200 kg busbars feeding a single rack can go".
- The glosses for power shelves, switchgear and busbar ("the rack's own power supplies", "the building's heavy circuit breakers", "a solid copper bar doing a job a cable would melt at") stay. The first and third paragraphs are as proposed, and all four citations are unchanged.

## Apply and checks

Applied to the twelve chapters in `content/`: in each, everything after the plain box under `## How it works`, up to the next `## ` heading, was replaced with the text below, with one blank line before the next heading. The plain box was compared to the front-matter `plain` field before writing and matched in all twelve. `{{figure:mask-cost}}` in chapter 01 stays where it was, after the closing paragraph.

- `node build/build.js`: built, no warnings. Source tiers A 327, B 22, disallowed 0, unclassified 0; 349 sources, as before the edit.
- `node qa/scripts/check-integrity.js`: clean apart from the pre-existing "exposure row for ... has no supplier entry" lines (Cadence, Micron, Nova, Samsung Electronics, Veeco Instruments), which were there before the edit.
- Register grep over the twelve texts: no em dashes, no "you", no "we", no "this site", no "US$"; "percent" in prose throughout.

Not run: git. No other file was touched.

## Final texts

Each is the full replacement, box excluded, as now in the chapter.

### 10 Memory and HBM

Each layer in the cube is a DRAM chip, ground thin and bonded to the one below with microbumps, dots of solder, and the whole stack sits on a base die that manages it. The copper-filled holes are TSVs, through-silicon vias, and they let a signal reach any layer without a wire around the outside.

One cube talks to the processor over 1,024 wires at once, a 1,024-bit interface, sixteen times wider than a standard DDR5 memory module, the memory stick in a PC ([source](https://www.micron.com/products/memory/hbm)). Ordinary memory cannot be made that wide, because the pins would not fit on a circuit board. The stack can, since its wires run down through the TSVs and across a few millimeters of silicon to the processor beside it, with no board in the way.

Answering a prompt is where the width earns its cost. Training reuses each stored number across a huge multiplication, so a chip can fetch little and compute a lot. To generate one word of an answer, the chip reads the whole model from memory, and the whole record of the conversation so far, does a little arithmetic, and waits for the next read. That record grows with the length of the conversation and the number of users served at once. So memory size and speed, rather than arithmetic, usually set how many people one chip can serve.

### 11 Advanced packaging

High bandwidth memory gives a second reason to split the package: its 1,024-bit or 2,048-bit connection, that many wires at once, is too wide for a resin base board to carry, so the memory sits beside the logic on a shared silicon carrier, the interposer.

The name CoWoS says the order: chip onto wafer, then wafer onto substrate. TSMC makes a thin silicon wafer carrying wiring and vertical copper vias, metal-filled holes that join one layer of wiring to the next, but no transistors. It bonds the logic dies and memory stacks face down onto that wafer with microbumps, dots of solder 30 to 40 microns apart, about a third of a hair's width, each dot one electrical joint. Then it cuts the interposer out of the wafer, attaches it to the resin substrate, and the substrate goes onto its board.

The individual steps are ordinary. But one cracked joint scraps a package holding eight qualified HBM stacks and two of the most expensive logic dies ever made.

### 14 Systems and networking

An accelerator ships as a module, the chip on a small board with its power supply and memory stacks. Nvidia calls its version SXM, and the open-standards equivalent is the Open Compute Project's accelerator module. Eight bolt onto a baseboard that carries their power and the switch chips, the traffic directors that pass data between any two modules at full speed.

Rack-scale systems do away with the baseboard. An Nvidia GB300 NVL72 holds 18 compute trays plus nine switch trays, 72 GPUs in all, and draws up to 142 kW, more than ten times a conventional enterprise rack ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)); Rubin keeps that shape ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Inside the rack the trays reach each other over copper. Beyond it, every link runs on glass fiber with an optical transceiver at each end, where a laser turns the electrical signal into pulses of light and a detector at the far end turns the pulses back into current.

Every AI cluster runs two networks that are not interchangeable. Scale-up binds a few dozen accelerators tightly enough that they can read each other's memory, at terabytes per second; scale-out joins thousands of those groups at hundreds of gigabits per second. A byte is eight bits, so the inner network is tens of times faster than the outer one. A model too big for one accelerator gets split across the scale-up group, so that group's bandwidth sets the size of model that can be trained.

### 15 Data centers and power

A rack is now the unit of AI compute. A GB300 NVL72 draws up to 142 kW through eight 33 kW power shelves, the rack's own power supplies, more than ten times a conventional enterprise rack in the same floor area ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).

Between the grid and the rack, a substation steps the high voltage down with transformers. Switchgear, the building's heavy circuit breakers, can cut any part of the site off in a fault. Battery-backed supplies hold the load for the seconds it takes backup generators to start. Distribution boards split the feed among the rows of racks. At the back of each rack a busbar, a solid copper bar doing a job a cable would melt at, carries the current down to the trays. Every one of those is heavy equipment with its own lead time.

Heat leaves in water. Cold plates on the GPU packages pass it to a building loop that dumps it outdoors, and Nvidia's Vera Rubin racks run 45 °C supply water, warm enough that many sites can skip chillers ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Nvidia is also moving rack distribution to 800 volts of direct current. Raising the voltage cuts the current for the same power, and heat in copper comes from current, so the same conductor carries over 150 percent more power and the 200 kg busbars feeding a single rack can go ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### 01 Design and EDA

Design runs in five stages, each one's output the next one's input, all of it in software.

- **Architecture.** Engineers fix the shape of the machine: how wide the block that multiplies numbers is, how much fast on-chip memory sits beside it, how many high-bandwidth memory stacks line the edges. The output is a plan.
- **RTL.** Engineers write the plan as register-transfer-level code, RTL, in the hardware language SystemVerilog. A register is a small store on the chip that holds one number, and the clock is the tick that moves every register forward together. The code says what every register holds on every tick, and the output is a text description of the whole chip.
- **Verification.** The biggest team on most projects checks that the code does what the plan says. They run it in simulation, prove parts of it correct with mathematics, and load it into emulators, cabinets of reprogrammable chips that behave like the design, so the chip's own software can boot before any silicon exists.
- **Physical design.** Software swaps each piece of the code for a logic cell, a small ready-made circuit the foundry has already proved it can make, then places the cells on the chip, wires them together and proves that every signal arrives in time.
- **Tape-out.** The handover. Software turns the placed layout into pattern files for the mask shop. First it pre-distorts each shape so that it prints true, which is optical proximity correction; then it cuts the layout into the files a mask writer reads, which is mask data preparation.

The discipline comes from the cost of a mistake, which is a whole new mask set. One set passes $1 million at 28 nm, $10 million at 7 nm and about $40 million at 3 nm, and a whole leading-edge chip has gone from design to tape-out on TSMC 7 nm for $50 million to $75 million, everything included ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)). The nanometer labels name generations of the process, each finer than the last, and no longer measure anything.

{{figure:mask-cost}}

### 02 Silicon and wafers

Silicon starts as quartzite, a rock that is silicon bound to oxygen. An arc furnace melts it with carbon, and the carbon takes the oxygen away as gas, leaving rough silicon metal. Refiners turn the metal into a gas, trichlorosilane, and distill it the way a still separates spirit from wash, because the impurities boil at other temperatures and stay behind. The clean gas then flows over silicon filaments heated inside a bell jar. On the hot surface the gas breaks apart, its silicon settles onto the filaments, and over days the filaments thicken into gray rods of polysilicon, the Siemens process. Everything downstream is made from those rods. The same process serves solar cells and chips, but only the ultra-pure semiconductor grade is any use here ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf)), and the two grades are separate industries with separate suppliers.

A grower melts the polysilicon at about 1,420 degrees Celsius, hotter than lava, and pulls a single crystal out of it by the Czochralski method. The grower lowers a small seed crystal on the end of a rod to the surface of the melt and draws it back up, slowly turning. Silicon freezes onto the seed in the seed's own atomic pattern, and a cylinder grows beneath it, the ingot. The pull starts with a thin neck so that the flaws formed where the seed first touched the melt end in the neck rather than in the ingot. Boron or phosphorus stirred into the melt, a step called doping, sets how readily the wafer conducts and whether the current in it is carried by negative charges or positive ones.

A wire saw, a web of fine wire running through abrasive, slices the ingot into discs. The maker then laps each disc, grinding both faces flat between rotating plates, etches off the damaged surface with acid, and polishes it to a mirror with colloidal silica, a slurry of silica particles far too small to see. Epitaxial wafers get one more layer of near-perfect silicon grown on top at about 1,200 degrees Celsius ([source](https://www.sumcosi.com/english/products/process/)), still hot enough to glow orange, and almost every step throws material away.

### 03 Chemicals, gases and photoresist

The resist has to change only where the light lands, and change fast enough that the scanner, the machine that projects the pattern, can expose each patch of the wafer in milliseconds. Since the 1990s the workhorse has been the chemically amplified resist. Each photon that lands frees one acid molecule inside the film, and nothing more happens until the wafer is baked. In the bake, each acid molecule sets off hundreds of reactions around itself that turn the film soluble, so a little light does a lot of chemistry. The wash then takes away the exposed film and leaves the rest. The light comes at 248 nm from a krypton fluoride laser or 193 nm from an argon fluoride laser shining through a layer of water, which sharpens the image.

Extreme ultraviolet upsets that arrangement (see [Lithography](#lithography)). A 13.5 nm photon carries about fourteen times the energy of a 193 nm one, so the same dose of light arrives as far fewer photons. With fewer photons, where each one happens to land matters, and the luck shows up as ragged line edges and missing contact holes, the small wells that join one layer of wiring to the next. Resist makers answered by absorbing more of the light: metal-oxide resists, built on clusters of tin and oxygen, take up extreme ultraviolet far better than carbon films, which is why JSR bought Inpria in 2021 ([source](https://www.jsr.co.jp/jsr_e/news/2021/20210917.html)).

Everything else puts material on the wafer, takes it off, or keeps it clean. Bulk gases arrive by the metric ton, specialty gases in grams. Silane carries silicon into the chamber for deposition. A plasma tears nitrogen trifluoride into charged fragments, which scrub the chamber walls clean between wafers. Hydrofluoric acid cleans the wafer itself. Polishing slurries grind each new layer flat before the next goes on. Sputtering targets are slabs of pure metal; a plasma knocks atoms off them, and the atoms settle on the wafer as the metal for the wiring. Filters and carriers keep contamination out.

### 05 Photomasks and pellicles

A mask starts as a blank, a polished plate with nothing on it yet. For deep ultraviolet the blank is a window of quartz carrying a light-blocking film such as molybdenum silicide, and Shin-Etsu supplies those blanks ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)). For EUV the blank is a mirror of about 40 molybdenum and silicon layer pairs, 7 nm to a pair, laid on low-expansion glass, with a dark tantalum film on top, the absorber, that will carry the pattern ([source](https://arxiv.org/pdf/1912.09075)).

The mask shop coats the blank with resist, and a mask writer draws the design into the coating with a beam of electrons, one shape at a time, over many hours, because no light draws finely enough. A wash removes the drawn resist, an etch removes the blocking film or absorber wherever the resist is gone, and the rest of the resist is stripped. The plate now passes light, or reflects it, in the exact shape of one layer of the chip, four times larger than it will print. An inspection tool compares the plate to the design, and a repair tool fixes the stray defects it finds.

Making the plate a mirror creates its own problems:

- **Mask 3D effects.** Light strikes the mirror at an angle rather than head-on, and the absorber has height, so its edges throw small shadows that distort the printed shape; software has to correct for it in advance.
- **Write precision.** Every edge of the absorber has to sit within a few nanometers of where the design says.
- **Particles.** Anything on the reflector prints on every wafer until someone finds it.

High-NA scanners, the newest EUV machines, print finer lines with larger mirrors, and each exposure then covers half the patch of wafer, doubling the exposures needed, so a large die, one chip's rectangle, has to be stitched from two masks ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). On 8 September 2026 ASML and TSMC announced a move to 12-inch masks, larger than today's, to remove that limit, with a pilot line in 2031 ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).

### 06 Deposition and etch

Both steps happen in a vacuum chamber that holds one wafer at a time. A pump empties the chamber of air, a measured flow of gas comes in, and an electric field that reverses millions of times a second, a radio-frequency field, strips electrons off the gas molecules. The gas is now a plasma, charged fragments that react far more readily than whole molecules do.

For deposition the gas carries the material wanted. The fragments land on the wafer and stick, and the film builds from the bottom up, a few atoms at a time. To coat the floor of a deep hole as thickly as its rim, the machine can work in cycles: let one gas settle in a single layer on every surface, pump it out, admit a second gas that reacts with that layer and nothing else, pump again. Each cycle adds one layer of atoms wherever the gas reached, so the film gets to the bottom of holes hundreds of times deeper than they are wide.

For etch the gas attacks one material and leaves the one beside it. Wherever the photoresist pattern covers the wafer, nothing happens. Wherever it does not, the fragments react with the surface and turn it into a gas, which the pump carries away. A second field pulls the charged fragments straight down at the wafer, so the etch cuts vertically and a narrow hole keeps its width as it deepens. When the etch reaches the material underneath, which the gas was chosen not to touch, it slows almost to a stop, and the tool ends the step.

Change the gas, the pressure, the power and the temperature, and the same hardware either adds material or takes it away, which is why the export controls here name process specifications rather than machines.

CSET puts a single chip at more than 1,000 process steps, with the part-finished product crossing international borders 70 or more times ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

### 07 Metrology and inspection

An inspection tool sweeps a beam of light across the wafer, photographs it, and compares the image of each chip with the image of its neighbors. The chips on a wafer are meant to be identical, so anything that shows in one and not the others is a defect, and the tool records where it is. For faults too small for light to show, a second tool scans a beam of electrons across a small patch and builds a picture from the electrons that bounce back.

A metrology tool measures rather than hunts. It shines light on a test pattern printed beside the circuits and works out from the scatter how wide the lines are and how thick the film is, and it reads marks printed in this layer and the last to measure how far the two are out of line, which is overlay.

The fab pays for all this to protect yield, the share of chips on a wafer that work. A wafer loses value two ways: whole regions ruined by mishandling, misalignment or over-etching, and single circuits killed by stray material or an airborne particle ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

A bigger chip is a bigger target for the second kind, and the loss grows faster than the area. In the standard formula, die yield is (1 + D0A/a) to the power minus a, where D0 is defects per square centimeter, A is die area and a is a clustering constant of 3 to 4, which says how much defects bunch together. At a defect density of 0.8 a 1 square centimeter die yields 49 percent and a 2 by 2 centimeter die 11 percent, so the bigger die costs about twenty times as much ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

Run that equation with a clustering constant of 3 for an 8 square centimeter die, about as much as one exposure can print, and it yields about 49 percent at a defect density of 0.10 and about 69 percent at 0.05 ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)). Getting from one to the other is yield learning: find which of the thousand-odd steps is losing dies, fix it, move on.

### 08 Transistors and the front end

The front end builds that valve in a fixed order. First it marks where each transistor will sit and fires atoms of boron or phosphorus into the silicon there, a step called ion implantation, so that those patches conduct the way the design needs.

Next it shapes the channel, in a FinFET by etching the silicon into thin fins standing up from the wafer and laying the gate over the top and both sides of each fin, three sides instead of one. In a gate-all-around transistor the fab instead grows alternating layers of silicon and silicon-germanium, cuts the stack into a narrow bar, then dissolves the silicon-germanium away, leaving thin silicon sheets held at their ends like shelves, and fills the gaps above, below and beside each sheet with gate metal, all four sides. Before the metal goes in, a film of insulator a few atoms thick is laid over every sheet, so that the gate controls the channel without touching it. Last come the contacts, small metal plugs down to the two ends of the channel and to the gate, ready for the wiring layers above.

Each of those is a deposition, an etch or an implant of its own, and they have to run in exact order, since a sheet cannot be wrapped once the metal is on, nor the insulator added once it is buried.

The leak the wrapping fights is short-channel leakage, and it has three fixes:

- **Better insulator.** Thicker, so fewer electrons slip straight through it, yet gripping the channel as tightly as before: Intel switched the gate insulator from silicon dioxide to hafnium at 45 nm in 2007 ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Wrap gate metal around more sides of the channel, as fins and nanosheets do.
- **Thinner channel.** Thin the silicon until no current can flow where the gate cannot reach it.

### 09 Foundries and fabs

Inside, the work is one loop repeated for every layer. Wafers travel in a lot, a batch of 25 in a sealed pod called a FOUP that only a machine opens. An overhead track carries the pod from tool to tool. At each tool a robot lifts one wafer out, the tool does its one job, depositing a film, printing a pattern, etching it, cleaning it or measuring it, and the robot puts the wafer back. The pod moves on to the next tool, often across the building, and the loop starts again with the next layer. A chip takes hundreds of those visits, so a wafer spends months inside.

The pod keeps the wafer clean for all of that time, because the wafer never meets the room's air, and even that air is filtered until it carries almost no dust. Every design in the building runs on the same tools because each tool is set by recipe, the list of gases, temperatures and times for one step, and a foundry offers each customer the same menu of recipes rather than a machine of its own. The tools run around the clock, since an idle tool earns nothing. The finished wafer is tested (see [Test and assembly](#test-and-assembly)), then cut and packaged.

TSMC, founded in 1987, invented the pure-play model: it builds chips for other companies and promises never to compete with them. BCG puts the ten-year cost of owning a fab completed in 2026 at $35 to $43 billion, a third to two thirds above one finished three years earlier ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)).

Every plant TSMC and its subsidiaries run came to more than 17 million wafers a year in 2025, counted as if each were the standard 12-inch size ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)). The six largest plants, all in Taiwan and called gigafabs, hold 13 million of that ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)); Arizona, Kumamoto, Nanjing and Washington hold the rest.
