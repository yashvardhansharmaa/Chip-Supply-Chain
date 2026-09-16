# How it works: reader test, chapters 1 to 16

Date: 16 September 2026. Material: the `## How it works` section of `content/01` to `content/16` (plain box plus the paragraphs after it, up to the next heading). Calibration: chapter 04, Lithography, 395 words including the box, mechanism first and in order, physics after.

Method: the Feynman technique as set out at fs.blog/feynman-technique, four steps. (1) Explain the step as if to a child, plain words, no jargon: that is the teenager's summary under each chapter. (2) Find the gaps, the places where the explanation leans on a word instead of a mechanism, and go back to the source to fill them: those are the stumbles, and the rewrites drew on the chapter, the glossary (`data/glossary.json`) and the specimen captions (the FOUP caption in chapter 09, for instance) to fill them. (3) Simplify, and use an analogy only where it carries the mechanism. (4) Test by teaching it back. Each section is scored on step 4 alone: pass if the teenager could turn round and teach the step to a friend in their own words with the mechanism in it; fail if they could only repeat the section's words, however well those words read. Each rewrite is shaped by steps 1 to 3: the physical thing first, outward from there, stopping as soon as the mechanism is clear.

Pass 1 reads each section once as a bright sixteen-year-old with no background, writes the teach-back, and logs every stumble. Pass 2 (editor) proposes replacement text for every failing section and for every passing section with more than two stumbles. No chapter was edited; this file is the only output.

## Verdict

**10 of 16 sections pass the teach-back.** Failing: 03 Chemicals and photoresist, 05 Photomasks, 06 Deposition and etch, 07 Metrology, 08 Transistors, 09 Foundries.

The six fails share one fault: the body never says how the thing is done, so the teenager can repeat it but not teach it. Each plain box says what the step does and what comes out, and then the paragraphs under it move to physics (07, 08), the composition of the object (05), or business and history (09), leaving the mechanism to the reader's imagination. A teenager who has just read Chemicals can say that a photon frees an acid molecule but not what the acid then does; who has just read Photomasks cannot say how a pattern gets onto a mask; after Deposition and etch cannot say how a film is put down or how an etch stops; after Metrology cannot say what the inspection machine does; after Foundries cannot say what a wafer does inside the building for several months.

Commonest faults across all 16, in order of frequency:

1. **Result named, mechanism not said** (03, 05, 06, 07, 08, 09, and one paragraph each in 10, 14). "A radio-frequency field strips electrons off a process gas, and the charged fragments left over do the chemistry" is the whole of the how in chapter 06.
2. **A word the section never explains and the box does not cover** (every chapter except 04, 12, 16): register, clock, logic cell, seed, charge carriers, contact holes, sputtering targets, absorber, High-NA, clustering constant, tunnels, fins, nanosheets, gigafab, 12-inch equivalent, 1,024-bit interface, vias, microbumps, SXM, switch chips, switchgear, busbar.
3. **A number with no comparison** (01 mask prices by node, 02 both temperatures, 07 the equation, 11 microns, 14 kW and bandwidths).
4. **Business or history before the reader knows how the thing works** (01 last paragraph is fine because it comes last; 06 second paragraph, 09 both body paragraphs, 13 last paragraph is fine because it comes last).

Sections that pass with two or fewer stumbles and need nothing: 04, 12, 13, 16. Sections that pass the teach-back but carry more than two stumbles and get a proposed rewrite: 01, 02, 10, 11, 14, 15.

Teach-back check on the six passes with stumbles: in 01, 02, 10, 11, 14 and 15 the summary above each chapter is in the teenager's own words and carries the mechanism (the pull from the melt, the drilled and copper-filled stack, the face-down bonding onto a wired slab, the cold plates and the chain from substation to busbar). The stumbles there are words in the way, not mechanism missing. In 03 the summary carried only what the plain box said, and the body's one mechanism sentence was repeated, not understood; that is the Feynman fail.

---

## 01 Design and EDA

**Teenager's summary.** Designers decide what the chip should be, then write code that says what every part does each tick, then run it in a simulator to check it, then software turns the code into a map of where every switch and wire goes and checks the signals arrive in time, then they send files to the people who make the stencils. Nobody draws it by hand, it is all software from three companies. What comes out is a set of pattern files, one per layer.

**Stumbles.**

- "fixes what every register holds on every tick of the clock": neither register nor clock is explained. I guessed a register is a memory thing.
- "how wide the matrix-multiply unit is": no idea what that is or why width matters.
- "simulation, formal proofs, and emulators that boot the firmware before any silicon exists": formal proofs and emulators are unexplained; had to read twice.
- "Software maps the code onto the foundry's prebuilt logic cells": what is a logic cell, and how does code get "mapped" onto one? The step is named, the mechanism is not.
- "$1 million at 28 nm, $10 million at 7 nm and about $40 million at 3 nm": the nm numbers are not explained here (the glossary hover would, but a first reader does not know to hover). Also a number with no comparison other than each other.
- "Mask data preparation and optical proximity correction, which pre-distorts each shape so it prints true": the clause explains OPC, but mask data preparation is left.

**Verdict: pass**, with six stumbles. The bullets give the sequence in order, so the teenager can retell it. The rewrite is for the jargon, not the structure.

## 02 Silicon and wafers

**Teenager's summary.** They take rock that is basically sand, burn the oxygen off it in a furnace, turn it into a gas so they can purify it, then grow it back into solid rods. They melt the rods, dip a crystal in, pull it out slowly so a single big crystal forms as a cylinder, then saw it into discs and polish them flat. What comes out is a shiny disc about a foot across that all the chips get printed on.

**Stumbles.**

- "decompose it onto heated filaments inside a bell jar": I do not know what decompose means here or why it makes rods. Read twice.
- "This Siemens process": named after nothing the reader knows.
- "starting with a thin neck that chokes off the flaws formed at the seed": what is the seed? The box says the crystal is "drawn out of the melt" but not from what.
- "whether its charge carriers are positive or negative": unexplained.
- "laps, etches and mirror-polishes each slice with colloidal silica": laps is unknown; colloidal silica is unknown.
- "about 1,420 degrees Celsius" and "about 1,200 degrees Celsius": no comparison for either.

**Verdict: pass**, with six stumbles. The order is right and the box is strong. The rewrite explains the four unknown words in place and gives the temperatures a comparison.

## 03 Chemicals, gases and photoresist

**Teenager's summary.** Photoresist is a light-sensitive coating; they spin it on thin, shine light through a stencil, and where the light hit it washes away, leaving a pattern that gets cut into the wafer. Something about acid and a bake makes that happen faster, I think. The other chemicals put layers on, take them off, or clean the wafer, and everything has to be insanely pure.

**Stumbles.**

- "one photon releases one acid molecule, which then drives hundreds of reactions in a bake after exposure": reactions that do what? The sentence stops before saying the reactions make the film dissolve. Mechanism half said.
- "a scanner": not explained here (it is in 04, which the reader may not have read).
- "193 nm from an argon fluoride laser shining through water": why water? Not said in this chapter.
- "Extreme ultraviolet breaks that bargain": what bargain? Read twice.
- "ragged line edges and missing contact holes": contact holes unexplained.
- "nitrogen trifluoride, split apart in a plasma": plasma unexplained here.
- "sputtering targets supply the metal for the wiring": no idea what a sputtering target is or what sputtering does.

**Verdict: fail** on the teach-back. Asked to teach photoresist, the teenager gives back the plain box (light makes it dissolve) and then recites "one photon releases one acid molecule, which then drives hundreds of reactions" without being able to say what the reactions are for. The body's one mechanism sentence stops before its point, and the last paragraph is a list of chemicals with no verb that explains any of them. Repeating is not teaching. Rewrite proposed.

## 04 Lithography (calibration)

**Teenager's summary.** The wafer gets a light-sensitive coat, a machine shines light through a stencil of one layer and a lens shrinks the picture four times onto the coat, a wash takes the coat away where light hit, and the pattern stands there for the next machine to cut or fill. It does this one small patch at a time, about a hundred per wafer, lining each one up on marks from earlier layers. The newest light is so short it needs a vacuum and mirrors instead of lenses.

**Stumbles.**

- "lines the new layer up on them to within a few nanometers": no comparison for a nanometer in this section (the box uses no size either). One stumble.

**Verdict: pass**, one stumble. This is the model: what goes in, what the machine does, what comes out, then the stepping, then the physics.

## 05 Photomasks and pellicles

**Teenager's summary.** A photomask is the stencil, one per layer, and one stencil prints millions of chips. For the newest light it has to be a mirror made of forty layer pairs instead of a window. I do not know how the pattern gets onto it.

**Stumbles.**

- The mechanism is never said. Nothing in the section says how the pattern is put on the plate. "a tantalum absorber that carries the pattern" says where the pattern lives, not how it got there. "Write precision. Every edge of the absorber has to sit within a few nanometers" hints that something writes, but never names a writer or a beam.
- "quartz carrying a light-blocking film such as molybdenum silicide": accepted, but "blanks" is not explained (a plate before the pattern).
- "about 40 molybdenum and silicon layer pairs, 7 nm to a pair, laid on low-expansion glass under a tantalum absorber": read twice, four unexplained materials in one clause.
- "Mask 3D effects": the bullet explains the effect, fine, but "3D" is never tied to anything the reader can picture.
- "High-NA scanners halve the patch of wafer one exposure covers": High-NA is unexplained.
- "a large die has to be stitched from two masks": die is unexplained here.
- "a move to 12-inch masks": from what size? Not said, so the reader cannot tell if 12 is big.

**Verdict: fail.** The teenager can say what a mask is and that the EUV one is a mirror, but not how it is made. Asked "how does the pattern get on it?", the answer is a shrug.

## 06 Deposition and etch

**Teenager's summary.** Deposition puts a super thin film on the wafer, lithography prints a pattern on it, etch eats away whatever the pattern does not cover, repeat a thousand times. Both happen in a vacuum with gas that has been zapped into charged bits. How the film actually forms, or how the etch knows to stop, I cannot say.

**Stumbles.**

- Mechanism never said for deposition: how does a gas become a film on the wafer? "the charged fragments left over do the chemistry" is the whole answer.
- Mechanism never said for etch: how does it "eat one material and leave the one beside it untouched" (from the box)? How does it get to the bottom of a hole hundreds of times deeper than wide? The body never returns to either promise the box makes.
- "a radio-frequency field strips electrons off a process gas": what is a radio-frequency field? Unexplained.
- "CSET puts a single chip at more than 1,000 process steps, with the part-finished product crossing international borders 70 or more times": a logistics fact placed before the reader knows how a single step works.
- "That is why the export controls here name process specifications rather than machines": policy, in a section that has not yet explained the process.

**Verdict: fail.** At 196 words it is the shortest section, and the shortness is the fault: it has room for the logistics fact and the policy line but not for the how.

## 07 Metrology and inspection

**Teenager's summary.** Between steps a machine checks the wafer for wrong line widths, misaligned layers and specks of dirt, because on a big chip a speck is much more likely to land on it. Then there is an equation about how yield drops as chips get bigger. I do not know what the checking machine does.

**Stumbles.**

- Mechanism never said. The box says "another machine looks the wafer over", and the body never says with what (light, electrons), or how it decides something is a defect, or how it measures a line width. The whole body is about yield.
- "die yield is (1 + D0A/a) to the power minus a, where D0 is defects per square centimeter, A is die area and a is a clustering constant of 3 to 4": an equation with three letters, one of which ("clustering constant") is unexplained. Read three times, understood none.
- "at a defect density of 0.8": 0.8 of what? The units were given a sentence earlier but easy to lose.
- "Run that equation with a clustering constant of 3 for an 8 square centimeter die": second time through the equation.
- "yield learning: find which of the thousand-odd steps is losing dies, fix it, move on": good, but "dies" is unexplained here.

**Verdict: fail.** The section is a good explanation of why inspection matters and no explanation of how it works.

## 08 Transistors and the front end

**Teenager's summary.** A transistor is a valve: current runs along a strip of silicon and a gate above it opens or shuts the flow. Make the strip too short and it leaks, so they wrap the gate around all four sides. There are three fixes: a thicker insulator, more gate, a thinner channel. How they build any of that, I do not know.

**Stumbles.**

- Mechanism never said. The box promises "a long sequence of steps that have to run in exact order" and the body never gives one step of it. How a fin is cut, how a sheet is freed, how the gate metal gets underneath it: none of it appears.
- "so less current tunnels through it": tunnels is unexplained (electrons passing through a solid).
- "as fins and nanosheets do": neither word is explained. The box describes wrapping the gate on four sides but never calls that a nanosheet.
- "Intel switched the gate insulator from silicon dioxide to hafnium at 45 nm in 2007": fine as history, but arrives before the reader knows what the insulator is between (gate and channel is implied, never stated).

**Verdict: fail.** The teenager can explain what a transistor does from the box, and cannot say how the front end builds one, which is the chapter's subject.

## 09 Foundries and fabs

**Teenager's summary.** A foundry is a factory that makes chips for other companies, all on the same machines. It costs tens of billions, the air is super clean, and a wafer spends months going through hundreds of machines in sealed boxes. TSMC is the biggest and mostly in Taiwan. The rest is about money and how many wafers they make.

**Stumbles.**

- Mechanism never said. What happens to a wafer inside for several months? Why sealed boxes, what moves them, how does one building run everyone's designs on the same tools? The body has no process at all.
- "TSMC, founded in 1987, invented the pure-play model": history before mechanism.
- "BCG puts the ten-year cost of owning a fab completed in 2026 at $35 to $43 billion, a third to two thirds above one finished three years earlier": business before mechanism.
- "17 million 12-inch equivalent wafers a year": "12-inch equivalent" unexplained.
- "The six Taiwanese gigafabs hold 13 million of that": gigafab unexplained.

**Verdict: fail.** Both body paragraphs are business. After reading, the teenager can only repeat the box.

## 10 Memory and HBM

**Teenager's summary.** HBM is a cube of up to sixteen memory chips stacked up, with holes drilled through and filled with copper so every layer connects, sitting right next to the processor. It has a super wide connection, sixteen times wider than normal memory, which is only possible because it is stacked. When the chip is answering you, it spends most of its time reading memory, so the memory sets how many people it can serve.

**Stumbles.**

- "One cube presents a 1,024-bit interface": what is a bit interface? Guessed it means wires.
- "sixteen times wider than a standard DDR5 memory module": DDR5 unexplained (the memory stick in a PC).
- "Generating one word of an answer reads the whole model and the whole running record of the conversation, then waits on memory": read twice; "running record" and "the whole model" need a beat.
- The box says the chip is "ground so thin that the copper shows through its back" and the body never says how layers are joined or what the holes are called.

**Verdict: pass**, with four stumbles. The box carries the mechanism cleanly; the body explains why width matters, which the reader needs. Light rewrite.

## 11 Advanced packaging

**Teenager's summary.** The chip is too big to print in one go, so it is made as several pieces that sit side by side on a slab of silicon and are wired through it, with the memory cubes a few millimeters away. TSMC makes the slab with wiring and vertical copper holes but no transistors, sticks the logic and memory face down on it with tiny bumps, cuts it out, and glues it to a resin base. The pieces expand differently when hot, so the joints can crack, and one crack throws away the whole thing.

**Stumbles.**

- "vertical copper vias": vias unexplained here.
- "with microbumps 30 to 40 microns apart": microbumps unexplained (they are the joints), and 30 to 40 microns has no comparison.
- "The individual steps are ordinary. But one cracked joint scraps a package": fine once, but "ordinary" reads as an aside.

**Verdict: pass**, three stumbles. The CoWoS paragraph is the mechanism in order. Light rewrite.

## 12 Substrates and PCBs

**Teenager's summary.** The substrate is an adapter between the tiny chip connections and the big board wiring. It is built like plywood: a stiff core, then a film pressed on, a laser burns holes, copper is plated in the holes, wiring is etched on top, repeat. AI parts need eighteen layers instead of six and the bigger they are the more they warp, so the core has to barely move when hot.

**Stumbles.**

- "plates copper into the holes": how plating works is not said (minor; the verb carries it).
- "which means low-expansion glass cloth and tighter control of the resin": accepted.

**Verdict: pass**, two stumbles at most. The box and the body give the same cycle twice, the second time with numbers and comparisons (hair ten times thicker than the film; 18 layers against six on three and a half times the area). Nothing to change.

## 13 Test and assembly

**Teenager's summary.** Before a chip is sold, a machine asks it questions and checks the answers. First thousands of needles press on each chip while it is still on the wafer and the failures are marked; then they run it hot for hours so weak ones die early; then they test it again after packaging; then they put the finished part in a socket and run something like real work. They test earlier now because one bad piece throws away a dozen expensive ones.

**Stumbles.**

- "Thousands of needles land on each die": die unexplained here.
- The Aehr paragraph is a vendor story, but it comes last, after the mechanism, so it does not block understanding.

**Verdict: pass**, two stumbles. The bullets are in order and each says what the round does and why. Nothing to change.

## 14 Systems and networking

**Teenager's summary.** One chip is not enough, so seventy-two are wired together in a wardrobe-sized rack and run as one computer. Each chip is a module on a board with switch chips that let them talk; short links are copper, long ones send light down glass fiber. There are two networks, a tight one that lets a few dozen chips read each other's memory, and a loose one that joins thousands of those groups.

**Stumbles.**

- "Nvidia calls its version SXM, and the open-standards equivalent is the Open Compute Project's accelerator module": two names for a thing the reader has only just met.
- "the switch chips that let them reach each other at full speed": switch chip unexplained.
- "draws up to 142 kW": no comparison in this section.
- "at terabytes per second ... at hundreds of gigabits per second": the contrast is the point, but neither number is anchored, and a teenager may not know a byte is eight bits, so the gap looks smaller than it is.
- The box says the narrow point is "the lasers that send the light" and the body never says how a laser gets an electrical signal onto a fiber or back.

**Verdict: pass**, five stumbles. The rack mechanism is there; the light link, which the box calls the chokepoint, is not. Rewrite proposed.

## 15 Data centers and power

**Teenager's summary.** A data center feeds electricity to the racks and carries away the heat. One rack draws 142 kW, more than ten times a normal rack, so water goes through cold plates on the chips out to a loop that dumps the heat outside. Electricity comes from the grid through a chain of big equipment, each with a long wait to buy, before it reaches the copper bar at the back of the rack.

**Stumbles.**

- "steps down through a substation, then through switchgear, battery-backed supplies and distribution boards, before it reaches the busbar": the order is given, but not one of the five things is explained.
- "800 volts of direct current, which pushes over 150 percent more power through the same copper": why does higher voltage push more power through the same wire? Not said.
- "retires the 200 kg busbars feeding a single rack": busbar still unexplained.

**Verdict: pass**, three stumbles. The heat path is clear and in order; the power path is a list. Light rewrite.

## 16 Component costs

**Teenager's summary.** A bill of materials is the list of parts and what each costs. For an AI chip the processor is only about a seventh, the memory is nearly half, and packaging costs more than the chip. The chip's cost comes from three numbers: what a wafer costs, how many chips fit on the round wafer, and how many of them work.

**Stumbles.**

- "Epoch AI's model of Blackwell's custom TSMC 4NP process": 4NP unexplained, but the sentence still reads.
- "an 800 mm2 die, near the largest a scanner can print in one shot, fits 68 times": scanner unexplained here, but the comparison is given.

**Verdict: pass**, two stumbles. Three bullets, each a number with its reason and its source, then the total. Nothing to change.

---

## Pass 2: editor's proposals

Each proposal replaces everything under `## How it works` after the plain box, up to the next `## ` heading, and nothing else. The plain box is untouched. Citations stay on the facts they support; every number is as in the current text; glossary words keep the spellings the text uses now. Word counts are for the replacement alone. Where the current text is right, the proposal keeps its sentences.

Two things the editor added without a citation, in the way chapter 04 does: mechanism in plain words (how a plasma etch stops, how a mask writer draws, what a FOUP is), and comparisons for temperatures and sizes that are scaled from figures the site already cites (a hair is 100 micrometers, from the Ajinomoto figure in chapter 12). No new number that would need a source.

### 01 Design and EDA: proposed text (about 340 words)

Design runs in five stages, each one's output the next one's input, all of it in software.

- **Architecture.** Engineers fix the shape of the machine: how wide the block that multiplies numbers is, how much fast on-chip memory sits beside it, how many high-bandwidth memory stacks line the edges. The output is a plan.
- **RTL.** Engineers write the plan as code in the hardware language SystemVerilog. The code is called register-transfer level, or RTL. A register is a small store on the chip that holds one number, and the clock is the tick that moves every register forward together; the code says what every register holds on every tick. The output is a text description of the whole chip.
- **Verification.** The biggest team on most projects checks that the code does what the plan says. They run it in simulation, prove parts of it correct with mathematics, and load it into emulators, cabinets of reprogrammable chips that behave like the design, so the chip's own software can boot before any silicon exists.
- **Physical design.** Software swaps each piece of the code for a logic cell, a small ready-made circuit the foundry has already proved it can make, then places the cells on the chip, wires them together and proves that every signal arrives in time.
- **Tape-out.** The handover. Software turns the placed layout into pattern files for the mask shop. First it pre-distorts each shape so that it prints true, which is optical proximity correction; then it cuts the layout into the files a mask writer reads, which is mask data preparation.

The discipline comes from the cost of a mistake, which is a whole new mask set. The numbers below name generations of the process and rank them rather than measure anything: one set passes $1 million at 28 nm, $10 million at 7 nm and about $40 million at 3 nm, and a whole leading-edge chip has gone from design to tape-out on TSMC 7 nm for $50 million to $75 million, everything included ([source](https://newsletter.semianalysis.com/p/the-dark-side-of-the-semiconductor)).

{{figure:mask-cost}}

### 02 Silicon and wafers: proposed text (about 350 words)

Silicon starts as quartzite, a rock that is silicon bound to oxygen. An arc furnace melts it with carbon, and the carbon takes the oxygen away as gas, leaving rough silicon metal. Refiners turn the metal into a gas, trichlorosilane, and distill the gas the way a still separates spirit from wash: the impurities boil at other temperatures and stay behind. The clean gas then flows over silicon filaments heated inside a bell jar. On the hot surface the gas breaks apart, its silicon settles onto the filaments, and over days the filaments thicken into gray rods of polysilicon. This is the Siemens process, and the rods are what everything downstream is made from. The same process serves solar cells and chips, but only the ultra-pure semiconductor grade is any use here ([source](https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf)), and the two grades are separate industries with separate suppliers.

A grower melts the polysilicon at about 1,420 degrees Celsius, hotter than lava, and pulls a single crystal out of it by the Czochralski method. A small seed crystal on the end of a rod touches the surface of the melt and is drawn upward, slowly turning. Silicon freezes onto the seed in the seed's own atomic pattern, and a cylinder grows beneath it, the ingot. The grower starts with a thin neck so that the flaws formed where the seed first touched the melt end in the neck rather than in the ingot. Boron or phosphorus stirred into the melt, a step called doping, sets how readily the wafer conducts and whether the current in it is carried by negative charges or positive ones.

A wire saw, a web of fine wire running through abrasive, slices the ingot into discs. The maker then laps each disc, grinding both faces flat between rotating plates, etches off the damaged surface with acid, and polishes it to a mirror with colloidal silica, a slurry of silica particles far too small to see. Epitaxial wafers get one more layer of near-perfect silicon grown on top at about 1,200 degrees Celsius ([source](https://www.sumcosi.com/english/products/process/)), still hot enough to glow orange, and almost every step throws material away.

### 03 Chemicals, gases and photoresist: proposed text (about 345 words)

The resist has to change only where the light lands, and change fast enough that the scanner, the machine that projects the pattern, can expose a wafer in milliseconds. Since the 1990s the workhorse has been the chemically amplified resist, and light does not dissolve it directly. Each photon that lands frees one acid molecule inside the film, and nothing more happens until the wafer is baked. In the bake, each acid molecule sets off hundreds of reactions around itself that turn the film soluble, so a little light does a lot of chemistry. The wash then takes away the exposed film and leaves the rest. The light comes at 248 nm from a krypton fluoride laser or 193 nm from an argon fluoride laser shining through a layer of water, which sharpens the image.

Extreme ultraviolet upsets that arrangement (see [Lithography](#lithography)). A 13.5 nm photon carries about fourteen times the energy of a 193 nm one, so the same dose of light arrives as far fewer photons. With fewer photons, where each one happens to land matters, and the luck shows up as ragged line edges and missing contact holes, the small wells that join one layer of wiring to the next. Resist makers answered by absorbing more of the light: metal-oxide resists, built on clusters of tin and oxygen, take up extreme ultraviolet far better than carbon films, which is why JSR bought Inpria in 2021 ([source](https://www.jsr.co.jp/jsr_e/news/2021/20210917.html)).

Everything else puts material on the wafer, takes it off, or keeps it clean. Bulk gases arrive by the metric ton, specialty gases in grams. Silane carries silicon into the chamber for deposition. Nitrogen trifluoride is torn into charged fragments in a plasma, and the fragments scrub the chamber walls clean between wafers. Hydrofluoric acid cleans the wafer itself. Polishing slurries grind each new layer flat before the next goes on. Sputtering targets are slabs of pure metal; a machine knocks atoms off them with a plasma, and the atoms settle on the wafer as the metal for the wiring. Filters and carriers keep contamination out.

(Editor's note: "expose a wafer in milliseconds" is kept as written, but one exposure covers one patch, not a wafer; the author may want "expose each patch in milliseconds".)

### 04 Lithography: passes

The calibration. Mechanism in order (coat, mask, shrink, expose, wash, etch or fill, strip, next mask), then the stepping and alignment, then the wavelength physics, then multipatterning as the one variant the rest of the chapter needs. One stumble, no rewrite.

### 05 Photomasks and pellicles: proposed text (about 350 words)

A mask starts as a blank, a polished plate with nothing on it yet. For deep ultraviolet the blank is a window: quartz carrying a light-blocking film such as molybdenum silicide, and Shin-Etsu supplies those blanks ([source](https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/)). For EUV the blank is a mirror: about 40 molybdenum and silicon layer pairs, 7 nm to a pair, laid on low-expansion glass, with a tantalum absorber on top that carries the pattern ([source](https://arxiv.org/pdf/1912.09075)). The absorber is a dark film; the mirror beneath it reflects.

The mask shop then writes the pattern. The blank is coated with resist, and a mask writer draws the design into the coating with a beam of electrons, one shape at a time, over many hours, because no light draws finely enough. A wash removes the drawn resist, an etch removes the blocking film or absorber wherever the resist is gone, and the rest of the resist is stripped. What is left is a plate that passes light, or reflects it, in the exact shape of one layer of the chip, four times larger than it will print. An inspection tool compares the plate to the design and a repair tool fixes stray defects, because any that remain print on every wafer.

Making the plate a mirror creates its own problems:

- **Mask 3D effects.** Light strikes the mirror at an angle rather than head-on, and the absorber has height, so its edges throw small shadows that distort the printed shape; software has to correct for it in advance.
- **Write precision.** Every edge of the absorber has to sit within a few nanometers of where the design says.
- **Particles.** Anything on the reflector prints on every wafer until someone finds it.

High-NA scanners, the newest EUV machines, print finer lines through a wider lens, and each exposure then covers half the patch of wafer, doubling the exposures needed, so a large die, one chip's rectangle, has to be stitched from two masks ([source](https://www.asml.com/en/company/stories/2024/5-things-high-na-euv)). On 8 September 2026 ASML and TSMC announced a move to 12-inch masks, larger than today's, to remove that limit, with a pilot line in 2031 ([source](https://www.asml.com/en/news/press-releases/2026/tsmc-and-asml-announce-industry-transition-to-large-format-photomasks-for-high-na-euv)).

### 06 Deposition and etch: proposed text (about 330 words)

Both steps happen in a vacuum chamber that holds one wafer at a time. A pump empties the chamber of air, a measured flow of gas comes in, and an electric field that reverses millions of times a second, a radio-frequency field, strips electrons off the gas molecules. What is left is a plasma: charged fragments of gas that react far more readily than whole molecules do.

For deposition, the gas is chosen to carry the material wanted. The fragments land on the wafer and stick, and the film builds from the bottom up, a few atoms at a time. To coat the floor of a deep hole as thickly as its rim, the machine can work in cycles: let one gas settle in a single layer on every surface, pump it out, admit a second gas that reacts with that layer and nothing else, pump again. Each cycle adds one layer of atoms everywhere the gas could reach, which is how a film gets to the bottom of holes hundreds of times deeper than they are wide.

For etch, the gas is chosen to attack one material and leave the one beside it. Wherever the photoresist pattern covers the wafer, nothing happens. Wherever it does not, the fragments react with the surface and turn it into a gas, which the pump carries away. A second field pulls the charged fragments straight down at the wafer, so the etch cuts vertically and a narrow hole keeps its width as it deepens. When the etch reaches the material underneath, which the gas was chosen not to touch, it slows almost to a stop, and the tool ends the step.

Change the gas, the pressure, the power and the temperature, and the same hardware either adds material or takes it away. That is why the export controls here name process specifications rather than machines.

It adds up. CSET puts a single chip at more than 1,000 process steps, with the part-finished product crossing international borders 70 or more times ([source](https://cset.georgetown.edu/wp-content/uploads/The-Semiconductor-Supply-Chain-Issue-Brief-1.pdf)).

### 07 Metrology and inspection: proposed text (about 350 words)

Inspection works by comparison. A tool sweeps a beam of light across the wafer and photographs it, then compares the image of each chip with the image of its neighbors. The chips on a wafer are meant to be identical, so anything that shows in one and not the others is a defect, and the tool records where it is. For faults too small for light to show, a second tool scans a beam of electrons across a small patch and builds a picture from the electrons that bounce back. Metrology measures rather than hunts. It shines light on a test pattern printed beside the circuits and works out, from how the light scatters, how wide the lines are and how thick the film is; and it reads marks printed in this layer and the last to measure how far the two are out of line, which is overlay.

The reason the fab pays for this is yield, the share of chips on a wafer that work. A wafer loses value two ways: whole regions ruined by mishandling, misalignment or over-etching, and single circuits killed by stray material or an airborne particle ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

The second kind follows a rule: a bigger chip is a bigger target, and the loss grows faster than the area. In the standard formula, die yield is (1 + D0A/a) to the power minus a, where D0 is defects per square centimeter, A is die area and a is a clustering constant of 3 to 4, which says how much defects bunch together. At a defect density of 0.8 a 1 square centimeter die yields 49 percent and a 2 by 2 centimeter die 11 percent, so the bigger die costs about twenty times as much ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)).

Run that equation with a clustering constant of 3 for an 8 square centimeter die, about as much as one exposure can print, and it yields about 49 percent at a defect density of 0.10 and about 69 percent at 0.05 ([source](https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf)). Getting from one to the other is yield learning: find which of the thousand-odd steps is losing dies, fix it, move on.

### 08 Transistors and the front end: proposed text (about 340 words)

The front end builds that valve in the order the wafer meets each step. First it marks where each transistor will sit and fires atoms of boron or phosphorus into the silicon there, a step called ion implantation, so that those patches conduct the way the design needs. Then it shapes the channel. In a FinFET, an etch cuts the silicon into thin fins standing up from the wafer, and the gate is laid over the top and both sides of each fin: three sides instead of one. In a gate-all-around transistor the fab first grows alternating layers of silicon and silicon-germanium, cuts the stack into a narrow bar, then dissolves the silicon-germanium away, leaving thin silicon sheets held at their ends like shelves, and fills the gaps above, below and beside each sheet with gate metal: four sides. Before the metal goes in, a film of insulator a few atoms thick is laid over every sheet, so that the gate controls the channel without touching it. Last come the contacts, small metal plugs down to the two ends of the channel and to the gate, ready for the wiring layers above.

Each of those is a deposition, an etch or an implant of its own, and they must run in exact order: a sheet cannot be wrapped once the metal is on, and the insulator cannot be added once it is buried.

The wrapping is the answer to the leak in the plain box, short-channel leakage, and it has three fixes:

- **Better insulator.** Thicker, so fewer electrons slip straight through it, yet gripping the channel as tightly as before: Intel switched the gate insulator from silicon dioxide to hafnium at 45 nm in 2007 ([source](https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm)).
- **More gate.** Wrap gate metal around more sides of the channel, as fins and nanosheets do.
- **Thinner channel.** Thin the silicon until no current can flow where the gate cannot reach it.

### 09 Foundries and fabs: proposed text (about 350 words)

Inside, the work is one loop repeated for every layer. Wafers travel in a lot, a batch of 25 in a sealed pod called a FOUP that only a machine opens. An overhead track carries the pod from tool to tool. At each tool a robot lifts one wafer out, the tool does its one job, which is to deposit a film, print a pattern, etch it, clean it or measure it, and the robot puts the wafer back. The pod moves on to the next tool, often across the building, and the loop starts again with the next layer. A chip takes hundreds of those visits, which is why a wafer spends months inside, and the pods are why it can: the wafer never meets the room's air, and the room's air is itself filtered until it carries almost no dust. Every design in the building runs on the same tools because each tool is set by recipe, the list of gases, temperatures and times for one step, and a foundry offers each customer the same menu of recipes rather than a machine of its own. The tools run around the clock, since an idle tool earns nothing. What comes out is a finished wafer, tested (see [Test and assembly](#test-and-assembly)) and sent on to be cut and packaged.

TSMC, founded in 1987, invented the pure-play model: it builds chips for other companies and promises never to compete with them. BCG puts the ten-year cost of owning a fab completed in 2026 at $35 to $43 billion, a third to two thirds above one finished three years earlier ([source](https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs)).

Every plant TSMC and its subsidiaries run came to more than 17 million wafers a year in 2025, counted as if each were the standard 12-inch size ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity)). The six largest plants, all in Taiwan and called gigafabs, hold 13 million of that ([source](https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab)); Arizona, Kumamoto, Nanjing and Washington hold the rest.

### 10 Memory and HBM: proposed text (about 230 words)

Each layer in the cube is a DRAM chip, ground thin and bonded to the one below with microbumps, dots of solder, on top of a base die at the bottom that manages the stack. The copper-filled holes are TSVs, and they are what let a signal reach any layer without a wire around the outside.

One cube talks to the processor over 1,024 wires at once, a 1,024-bit interface, sixteen times wider than a standard DDR5 memory module, the memory stick in a PC ([source](https://www.micron.com/products/memory/hbm)). Ordinary memory cannot be made that wide: the pins would not fit on a circuit board. The stack can, because its wires run down through the TSVs and across a few millimeters of silicon to the processor beside it, with no board in the way.

Answering a prompt is where the width earns its cost. Training reuses each stored number across a huge multiplication, so a chip can fetch little and compute a lot. Generating one word of an answer is different. The chip reads the whole model from memory, and the whole record of the conversation so far, does a little arithmetic, and waits for the next read. That record grows with the length of the conversation and the number of users served at once. So memory size and speed, rather than arithmetic, usually set how many people one chip can serve.

### 11 Advanced packaging: proposed text (about 220 words)

High bandwidth memory gives a second reason to split the package: its 1,024-bit or 2,048-bit connection, that many wires at once, is too wide for a resin base board to carry, so the memory sits beside the logic on a shared silicon carrier, the interposer.

The name CoWoS says the order: chip onto wafer, then wafer onto substrate. TSMC makes a thin silicon wafer carrying wiring and vertical copper vias, metal-filled holes that join one layer of wiring to the next, but no transistors. It bonds the logic dies and memory stacks face down onto that wafer with microbumps, dots of solder 30 to 40 microns apart, about a third of a hair's width, each dot one electrical joint. Then it cuts the interposer out of the wafer, attaches it to the resin substrate, and the substrate goes onto its board.

The individual steps are ordinary. But one cracked joint scraps a package holding eight qualified HBM stacks and two of the most expensive logic dies ever made.

### 12 Substrates and PCBs: passes

The box gives the plywood picture and the cycle; the body gives the same cycle with its numbers, each with a comparison (a hair is ten times thicker than the film; 18 layers against six on three and a half times the area) and its source. Two stumbles at most, both minor. No rewrite.

### 13 Test and assembly: passes

Four rounds in the order they happen, each bullet saying what is done, how (needles, heat, socket) and why the round before could not catch it. The vendor paragraph comes after the mechanism, where it belongs. Two stumbles. No rewrite.

### 14 Systems and networking: proposed text (about 300 words)

An accelerator ships as a module, not a bare chip: the chip on a small board with its power supply and memory stacks. Nvidia calls its version SXM, and the open-standards equivalent is the Open Compute Project's accelerator module. Eight bolt onto a baseboard that carries their power and the switch chips, the traffic directors that pass data between any two modules at full speed.

Rack-scale systems do away with the baseboard. An Nvidia GB300 NVL72 holds 18 compute trays plus nine switch trays, 72 GPUs in all, and draws up to 142 kW, more than ten times a conventional enterprise rack ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)); Rubin keeps that shape ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)). Inside the rack the trays reach each other over copper. Beyond it, every link runs on glass fiber with an optical transceiver at each end: a laser turns the electrical signal into pulses of light, and a detector at the far end turns the pulses back into current. The lasers are the part few firms can make.

Every AI cluster runs two networks that are not interchangeable. Scale-up binds a few dozen accelerators tightly enough that they can read each other's memory, at terabytes per second; scale-out joins thousands of those groups at hundreds of gigabits per second. A byte is eight bits, so the inner network is tens of times faster than the outer one. A model too big for one accelerator gets split across the scale-up group, so that group's bandwidth sets the size of model that can be trained.

### 15 Data centers and power: proposed text (about 290 words)

A rack is now the unit of AI compute. A GB300 NVL72 draws up to 142 kW through eight 33 kW power shelves, the rack's own power supplies, more than ten times a conventional enterprise rack in the same floor area ([source](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html)).

Power reaches it in stages, each one a piece of heavy equipment with its own lead time. A substation takes the grid's high voltage and steps it down with transformers. Switchgear, the building's heavy circuit breakers, can cut any part of the site off in a fault. Battery-backed supplies hold the load for the seconds it takes backup generators to start. Distribution boards split the feed among the rows of racks. At the back of each rack a busbar, a solid copper bar doing a job a cable would melt at, carries the current down to the trays.

Heat leaves in water. Cold plates on the GPU packages pass it to a building loop that dumps it outdoors, and Nvidia's Vera Rubin racks run 45 °C supply water, warm enough that many sites can skip chillers ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

Nvidia is also moving rack distribution to 800 volts of direct current. Raising the voltage cuts the current for the same power, and it is current that heats copper, so the same conductor carries over 150 percent more power, which retires the 200 kg busbars feeding a single rack ([source](https://blogs.nvidia.com/blog/gigawatt-ai-factories-ocp-vera-rubin)).

### 16 Component costs: passes

Three bullets, each a number, its reason and its source, then the total they give. The teenager reproduced all three without prompting. Two stumbles, neither blocking. No rewrite.

---

## Notes for the author

- The six fails are all the same fix: a paragraph, before anything else, that walks the reader through the step in order. Chapters 05 and 06 need about 150 new words each; 03 needs its one mechanism sentence finished; 07, 08 and 09 need a mechanism paragraph in front of text that can otherwise stay.
- The 11 proposal is 170 words, under the 200 floor, because the box already holds most of the mechanism and the body only needed its three unexplained words explained.
- Chapter 06 at 196 words is the only section under 200. It has the least room and the most missing.
- Numbers that still lack a comparison after the rewrite, because none is available without a new source: the mask-set prices in 01 (only compared with each other), the bandwidths in 14 (compared with each other after the byte-to-bit note).
- The plain boxes carried the mechanism in 08, 09 and 10; the bodies then dropped it. Where the box is the best paragraph in the section, the body reads as a step down. The rewrites for 08 and 09 pick the box's promise up in their first sentence.
