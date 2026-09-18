# Feynman pass: the seventeen "In plain terms" paragraphs

Material: the `plain` field of `content/01-*.md` through `content/17-*.md` and its byte-identical copy, the first paragraph under "How it works" (chapter 17: the same paragraph in the body). Read in order, 1 to 17, carrying what earlier paragraphs taught. Floor: the stumble list in `qa/teen-test.md`, whose sentence changes were already in the text when this pass began.

Method, per paragraph: (1) teach it back as a bright fifteen-year-old, three sentences; (2) list what the teach-back lost, guessed at, or leaned on a word for; (3) rewrite, physical thing first, one idea per sentence, no term before the sentence that explains it, every fact and number kept, length within about 20 percent, last sentence keeping its job; (4) teach it back again. A paragraph with nothing lost at step 2 is left alone.

## Verdict

Fifteen paragraphs rewritten, two left alone (chapters 9 and 16). Every number and named firm survives unchanged. Word counts, original to final: 01 127 to 131, 02 127 to 142, 03 142 to 150, 04 106 to 125, 05 109 to 126, 06 112 to 131, 07 145 to 149, 08 140 to 155, 09 117 (unchanged), 10 126 to 138, 11 122 to 133, 12 122 to 122, 13 106 to 121, 14 104 to 118, 15 153 to 154, 16 95 (unchanged), 17 135 to 143. Largest growth is chapter 4 at 18 percent. `node build/build.js` runs with no warnings; each chapter's paragraph occurs exactly twice in its file.

What the pass changed, by kind:

- **Mechanism stated where a "so" or "then" hung in the air.** Why finer lines need shorter light (04), why the shortest light needs a vacuum (04), how a mirror can be a stencil (05), where the deep holes come from (06), why chip size and dust are linked (07), why wrapping the gate stops the leak (08), why a new photoresist supplier takes years (03), why an accelerator cannot be one chip (11), why testing runs hot (13), why copper links are short (14).
- **A picture set beside a number that had none.** The billionth of a second as one tick of the chip (01), the hundred-billion purity read as "of every hundred billion atoms" (02), a finger-wide shaft through several floors for the hole ratio (06), a whole house's wiring for a thousand amps (14), seventy hair dryers for 142 kilowatts (15, restored from the author's earlier version).
- **Terms defined at first use or tied to an earlier definition.** "Processor" dropped from chapter 1 and defined in 10 where it recurs; "AI accelerator" defined in 7; "HBM" tied to its long name in 10 and to "stacked memory" in 11 and 17; "export rule" in 8 and 10 became "export control", the term chapter 4 defines.
- **Long sentences split or reordered so nothing needs a second read.** 02's crystal sentence, 03's dissolve sentence, 12's plywood sentence, 17's "works only when" sentence.
- **Dead comparisons cut.** "The way old photographic film did" (03).

Facts added that were not in the paragraph before, each backed by the chapter body or the author's earlier draft: the chip's clock tick (01, body defines the clock as "the tick that moves every register forward together"); the seed crystal lowered and drawn back up (02, body's Czochralski passage); the dark pattern on the mirror that soaks up light (05, body's absorber layer); turbines as the equipment that makes the power rather than connects the site (15, body lists turbines beside transformers and switchgear); seventy hair dryers (15, the author's previous paragraph used the same comparison at two kilowatts each). Two comparisons rest on common knowledge rather than the body: a house's wiring being rated well under a thousand amps (14) and a finger-wide shaft through several floors being a few hundred times deeper than wide (06). The author should confirm those two.

---

## Chapter 1: Chip Design, EDA and IP

**Original (127 words):**

> Chip design turns an idea for a processor into a complete blueprint. A chip holds billions of transistors, tiny electrical switches, and the blueprint fixes where each one sits and how it is wired to the others. A signal has to cross those wires in less than a billionth of a second. No one draws a plan like that by hand. Software from three companies, Synopsys, Cadence and Siemens, lays it out, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. The factory prints each layer of the design onto silicon through a stencil, and changing the plan after that costs a fresh set of stencils and several months. Withhold the software and the design cannot be made.

**First teach-back:** A chip is billions of tiny switches, and designing one means deciding where every switch goes and how they are wired. It is far too big to draw by hand, so three companies' software does it, and factories only take designs that went through that software. Cut off the software and nobody can design the chip.

**Gaps:**
- "Processor" is used in the first sentence and not explained until chapter 16. The teach-back silently swapped in "chip".
- "Less than a billionth of a second" was dropped from the teach-back. It is a number with nothing to hold it against and no reason given for why it constrains the layout.
- "The design cannot be made" is ambiguous between "no design can be produced" and "the chip cannot be built"; the teach-back guessed the first.

**Rewrite (131 words):**

> Chip design turns an idea for a new chip into a complete blueprint. A chip holds billions of transistors, tiny electrical switches, and the blueprint fixes where each one sits and how it is wired to the others. The chip works in ticks, and a signal has to cross those wires within one tick, less than a billionth of a second. Software from three companies, Synopsys, Cadence and Siemens, lays out a plan like that, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. The factory prints each layer of the design onto silicon through a stencil, and changing the plan after that costs a fresh set of stencils and several months. Withhold the software and no new chip can be designed.

**Second teach-back:** A chip is billions of tiny switches, and the design says where each one sits and how it is wired. The chip runs in ticks, and every signal has to get across its wires inside one tick, under a billionth of a second, which is why software from three companies has to lay the plan out and check it, and factories take nothing else. Change the plan later and it costs new stencils and months; take the software away and no chip can be designed. Nothing lost.

## Chapter 2: Silicon and Wafers

**Original (127 words):**

> Every chip is built on a wafer, a thin round slice of silicon about 30 centimeters across that carries hundreds of chips at once. Making one starts with sand, which is silicon bound to oxygen. The sand is refined until fewer than one atom in a hundred billion is anything other than silicon, then melted, and a single crystal, its atoms in one unbroken orderly pattern from end to end, is slowly drawn out of the melt as a long cylinder. Saws cut the cylinder into discs, and each disc is polished until its surface is flat to within a few atoms, right out to the edge. Only five companies in the world make these wafers to that standard, and none of them is American or Chinese.

**First teach-back:** Chips are built on wafers, round silicon plates about a foot across that each carry hundreds of chips. They start as sand, which gets purified until it is nearly all silicon, melted, and somehow pulled out as one big crystal log, then sliced into discs and polished flat. Only five companies make them well enough and none is American or Chinese.

**Gaps:**
- "Somehow pulled out": the sentence says the crystal is "drawn out of the melt" but not how, and the teach-back had no picture of it.
- The third sentence carries four steps (refined, melted, single crystal, drawn out) and a definition of "single crystal" in the middle of the fourth; it needed two reads.
- "One atom in a hundred billion" registered as "very pure" and nothing more. The number reads better after the thing it counts.

**Rewrite (142 words):**

> Every chip is built on a wafer, a thin round slice of silicon about 30 centimeters across that carries hundreds of chips at once. Making one starts with sand, which is silicon bound to oxygen. The sand is refined until, of every hundred billion atoms, fewer than one is anything other than silicon. The silicon is melted, a small seed crystal is lowered to the surface and drawn slowly back up, and the melt freezes onto it as one long cylinder, a single crystal with its atoms in one unbroken orderly pattern from end to end. Saws cut the cylinder into discs, and each disc is polished until its surface is flat to within a few atoms, right out to the edge. Only five companies in the world make these wafers to that standard, and none of them is American or Chinese.

**Second teach-back:** A wafer is a 30-centimeter silicon disc holding hundreds of chips, and it starts as sand, which is silicon stuck to oxygen. The sand is purified until under one atom in every hundred billion is anything but silicon, melted, and a small seed crystal is dipped in and pulled slowly up so the melt freezes onto it as one long crystal log with all its atoms lined up. That gets sawn into discs and polished flat to a few atoms, and only five companies, none American or Chinese, can do it to that standard. Nothing lost.

## Chapter 3: Chemicals, Gases and Photoresist

**Original (142 words):**

> Photoresist is a coating that changes wherever light hits it, the way old photographic film did. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, and the parts the light reached dissolve away. What remains is a pattern, and the next machine cuts that pattern into the wafer beneath, a step called etching. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time, so a second source takes years rather than weeks. Nine tenths of the world's photoresist comes from Japan, and no factory can swap it out quickly.

**First teach-back:** Photoresist is a coating that reacts to light; it is spun onto the wafer, light is shone through a stencil, the lit parts dissolve, and the leftover pattern gets etched into the wafer. Hundreds of other chemicals add, strip and clean layers, all of them incredibly pure, and each one is approved for one factory at a time so switching takes years. Most photoresist is Japanese.

**Gaps:**
- "The way old photographic film did" explained nothing to a reader who has never handled film; the teach-back skipped it.
- "Dissolve away" in what? The teach-back said "dissolve" without a picture of the wash that does it.
- "Approved for one factory and one product at a time, so a second source takes years": the teach-back repeated the "so" without the step between them. Why does per-factory approval slow a switch? Because a new supplier's formula has to earn that approval again from nothing.
- "Second source" is a term the reader has not met; the teach-back translated it to "switching" from context.
- The purity sentence and the approval sentence share one long sentence with two unrelated ideas.

**Rewrite (150 words):**

> Photoresist is a coating that changes wherever light hits it. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, and a liquid wash then takes away the parts the light reached. What remains is a pattern, and the next machine cuts that pattern into the wafer beneath, a step called etching. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in every trillion. Each formula is approved for one factory and one product at a time, and a new supplier has to earn that approval from scratch, so a second source takes years rather than weeks. Nine tenths of the world's photoresist comes from Japan, and no factory can swap it out quickly.

**Second teach-back:** Photoresist is a light-sensitive coating spun onto the wafer thinner than a soap bubble; light through a stencil marks it, a wash takes the marked parts off, and the pattern left behind is cut into the wafer, which is called etching. A few hundred other gases and liquids build, strip and clean layers, all clean to about one metal atom in a trillion, and every formula is approved for one factory and one product, so a new supplier has to be approved from scratch and a second source takes years. Nine tenths of photoresist is Japanese and no factory can swap it fast. Nothing lost. "Second source" now sits next to the sentence that shows what it means.

## Chapter 4: Lithography

**Original (106 words):**

> Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a lamp and projects the image, four times smaller, onto the silicon. The finer the lines, the shorter the wavelength of light needed to print them. The shortest light now in use will not pass through air, so the machine has to print in a vacuum. Only one company has ever built a machine that prints with it, and it is Dutch. Export controls, the government rules on who a company may sell to, reach advanced chipmaking mainly by reaching that one firm.

**First teach-back:** Lithography projects a stencil's image onto the wafer, shrunk four times. Finer lines need shorter-wavelength light, and the shortest kind does not go through air, so it has to be done in a vacuum. Only one Dutch company makes that machine, so export rules on chips mostly go through it.

**Gaps:**
- "The finer the lines, the shorter the wavelength": accepted on trust, no mechanism. Light cannot draw a line much finer than its own wave.
- "Will not pass through air": the teach-back repeated it without knowing why. Air absorbs it.
- "Reach advanced chipmaking mainly by reaching that one firm": the teach-back said "go through it", which is the same vagueness. The step is that every advanced chip passes through that firm's machines, so a rule on the firm is a rule on all of them.
- The last sentence packs a definition and the argument into one clause chain.

**Rewrite (125 words):**

> Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a lamp and projects the image, four times smaller, onto the silicon. Light cannot draw a line much finer than its own wave, so the finer the lines, the shorter the wavelength of light needed to print them. Air soaks up the shortest light now in use, so the machine has to print in a vacuum. Only one company has ever built a machine that prints with it, and it is Dutch. Export controls are government rules on who a company may sell to. Every advanced chip passes through that firm's machines, so a rule aimed at it reaches all advanced chipmaking.

**Second teach-back:** Lithography shines light through a stencil of one layer and projects it onto the wafer four times smaller. Light cannot draw lines finer than its own wave, so fine lines need short waves, and the shortest kind gets absorbed by air, so the machine prints in a vacuum. Only one Dutch company has built that machine, and since every advanced chip goes through it, a government rule on who that company may sell to is a rule on all advanced chips. Nothing lost.

## Chapter 5: Photomasks and Pellicles

**Original (109 words):**

> A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so the plate cannot be a window. Instead it is a mirror, built up from about forty pairs of ultrathin layers, and the light bounces off it. Any speck of dust on the plate repeats on every wafer it prints. Two Japanese firms make almost all of those mirrors. A business almost nobody has heard of can hold up every advanced chip in the world.

**First teach-back:** The photomask is the stencil, one per layer, and it is reused so one plate shapes millions of chips. The newest light cannot pass through glass, so the mask is a mirror made of forty pairs of layers and the light bounces off it. Two Japanese firms make nearly all those mirrors, so a company nobody knows could hold up every advanced chip.

**Gaps:**
- How is a mirror a stencil? The teach-back said "mirror" and "stencil" without joining them. A dark pattern on top of the mirror soaks up the light where no line should print; the paragraph never says so.
- "Ultrathin" is a big word where "very thin" does the job.
- The dust sentence was dropped from the teach-back; it is fine as written and the reader can recover it, but it sits better after the mirror is fully explained.

**Rewrite (126 words):**

> A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so instead of a window the plate is a mirror, built up from about forty pairs of very thin layers, and the light bounces off it. A dark pattern drawn on top of the mirror soaks up the light wherever no line should print. Any speck of dust on the plate repeats on every wafer it prints. Two Japanese firms make almost all of those mirrors. A business almost nobody has heard of can hold up every advanced chip in the world.

**Second teach-back:** A photomask is the stencil for one layer, used on wafer after wafer, so one plate shapes millions of chips. The newest light goes through no glass, so the plate is a mirror of forty thin layer pairs with a dark pattern on top that swallows the light where nothing should print, and any dust on it shows up on every wafer. Two Japanese firms make almost all of the mirrors. Nothing lost; the mirror and the stencil are now one picture.

## Chapter 6: Deposition and Etch

**Original (112 words):**

> Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. A chip takes more than a thousand of these rounds. The film has to reach the bottom of holes hundreds of times deeper than they are wide, and the etch has to eat one material and leave the one beside it untouched. Four firms in America, Japan and the Netherlands make most of these machines, and China has come closer to matching them here than anywhere else.

**First teach-back:** Building a chip is a loop: lay a film a few atoms thick, print a pattern on it, etch away whatever the pattern does not cover, repeat more than a thousand times. The hard parts are getting film to the bottom of very deep narrow holes and etching one material without touching the one beside it. Four firms make most of the machines and this is where China is closest to catching up.

**Gaps:**
- "Holes": which holes? Nothing has said where they come from. The teach-back said "very deep narrow holes" without knowing that the etch cuts them.
- "Hundreds of times deeper than they are wide" had no picture; the teach-back flattened it to "very deep narrow".
- The two hard parts share one sentence; each is its own idea.

**Rewrite (131 words):**

> Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. A chip takes more than a thousand of these rounds. Some of the holes the etch cuts are hundreds of times deeper than they are wide, the shape of a finger-wide shaft dropping through several floors, and the film has to coat them right to the bottom. The etch has to eat one material and leave the one beside it untouched. Four firms in America, Japan and the Netherlands make most of these machines, and China has come closer to matching them here than anywhere else.

**Second teach-back:** A chip is built in rounds: lay down a film a few atoms thick, print a pattern on it, etch away everything the pattern does not cover, add the next film, more than a thousand times. Some holes the etch cuts are like a finger-wide shaft several floors deep and the film has to coat all the way down, and the etch has to eat one material and leave its neighbor alone. Four firms make most of these machines and China is closest to matching them here. Nothing lost.

## Chapter 7: Metrology and Inspection

**Original (145 words):**

> Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over. It checks whether the lines are the right width, whether this layer landed squarely on the last one, and whether a speck of dirt has killed a circuit. A wafer carries many chips, and the main chip in an AI accelerator, the one that does the calculating, is one of the largest cut from it, so a speck has more chip to hit. On a chip that size, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a chip factory, or fab, cut off from it can buy every other tool and still not learn why its chips fail.

**First teach-back:** Between build steps a machine inspects the wafer for wrong line widths, crooked layers and dirt. The main chip in an AI accelerator is one of the biggest on a wafer, so dust hits it more, and halving the dust takes the share of good chips from half to seven in ten. One American firm sells seven times more of these machines than anyone, so a factory without them cannot find out why its chips fail.

**Gaps:**
- "AI accelerator" is still used before anything says what it is. The teach-back repeated the words without a meaning.
- "A wafer carries many chips" now repeats what chapter 2 says in its first sentence.
- The fourth sentence carries four clauses; the teach-back got it right but only after a second read.

**Rewrite (149 words):**

> Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over. It checks whether the lines are the right width, whether this layer landed squarely on the last one, and whether a speck of dirt has killed a circuit. An AI accelerator is the part built to run AI, and its main chip, the one that does the calculating, is one of the largest cut from a wafer. A bigger chip is a bigger target for a speck. On a chip that size, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a chip factory, or fab, cut off from it can buy every other tool and still not learn why its chips fail.

**Second teach-back:** Inspection machines check the wafer between steps for wrong line widths, layers that landed off-center, and dirt that killed a circuit. An AI accelerator is the part built to run AI, its main calculating chip is one of the biggest cut from a wafer, and a bigger chip is a bigger target, so halving the dust lifts good chips from about half to seven in ten. One American firm sells seven times as many of these machines as its nearest rival, and a fab without them cannot learn why its chips fail. Nothing lost.

## Chapter 8: Transistors and the Front End

**Original (140 words):**

> The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch is a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Shorter strips switch faster and more of them fit on a chip, but make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the strip, which takes a long sequence of steps that have to run in exact order. Only TSMC, Intel and Samsung can do it, a list short enough for an export rule to name in full.

**First teach-back:** The front end builds the transistors, which work like valves: current runs down a tiny silicon strip and a gate above it opens or shuts the flow. Shorter strips are faster and more fit on a chip, but too short and they leak even when off, wasting power. The fix is wrapping the gate around all sides of the strip, which only TSMC, Intel and Samsung can do.

**Gaps:**
- Why does wrapping the gate around the strip stop the leak? The teach-back repeated the fix without the mechanism: a gate on all sides can squeeze the flow shut from every side.
- "Export rule" is not the term chapter 4 defined ("export controls"); the reader has to match them.
- "TSMC, Intel and Samsung" arrive with no label; the teach-back assumed companies. One word settles it.

**Rewrite (155 words):**

> The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch is a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Shorter strips switch faster and more of them fit on a chip, but make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the strip, so it can squeeze the flow shut from every side, and that takes a long sequence of steps that have to run in exact order. Only three companies, TSMC, Intel and Samsung, can do it, a list so short that an export control can name every one of them.

**Second teach-back:** The front end builds the transistors: each is a valve where current runs along a silicon strip and a gate above it opens or shuts the flow. Shorter strips switch faster and pack tighter, but too short and current leaks past a gate that is off, so the chip wastes power; the fix is to wrap the gate around all four sides so it can pinch the flow shut from everywhere, which takes a long exact sequence of steps. Only three companies can do it, few enough for an export control to name them all. Nothing lost.

## Chapter 9: Foundries and Fabs

**Original (117 words):**

> A foundry is a fab that makes chips for other companies. Those companies send in their designs, and the foundry runs them all through the same building on the same tools. The building costs tens of billions of dollars, and the air inside is cleaner than an operating room. Even so, a wafer crosses hundreds of machines over several months inside sealed boxes, never touching that air. No chip company sells enough of one product to fill a factory like that on its own, so the world shares a handful of them. TSMC runs the biggest, and all six of its largest plants sit in Taiwan, which is why one island's politics reaches the whole chip supply.

**First teach-back:** A foundry is a chip factory that builds other companies' designs, all on the same tools. It costs tens of billions and the air is cleaner than an operating room, yet wafers still ride in sealed boxes for months across hundreds of machines. Nobody sells enough of one product to fill such a factory alone, so the world shares a few, and TSMC's six biggest are all in Taiwan, so Taiwan's politics touch every chip.

**Gaps:** None. Every term is defined here or earlier ("fab" in chapter 7), each number is set against something, and the cause of sharing and the cause of Taiwan's weight are both stated.

**Rewrite:** Left alone.

**Second teach-back:** Not needed.

## Chapter 10: Memory and HBM

**Original (126 words):**

> High bandwidth memory is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker stacks up to sixteen memory chips into a cube, drills holes straight down through the stack, and fills the holes with copper so that every layer is wired to the ones below. The cube then sits beside the processor. Stacking is the hard part. Each chip is ground so thin that the copper shows through its back, the finished cube has to fit under the plate that cools it, and one bad chip ruins the whole cube. Only SK hynix, Samsung and Micron have made it work, and a single line in an American export rule reaches all three.

**First teach-back:** HBM is the memory next to the AI chip that holds the numbers it is working on and hands them over fast. It is made by stacking up to sixteen memory chips, drilling holes down through them and filling the holes with copper so the layers connect. Each chip is ground very thin, one bad chip wrecks the stack, and only three companies can do it.

**Gaps:**
- The title says "HBM" and the paragraph never does; the teach-back matched them by guesswork.
- "The processor" is used with no definition here and none before it (chapter 1's was removed in this pass).
- "The copper shows through its back": the teach-back skipped it. Which copper? The copper in the holes.
- "Export rule" again, where chapter 4 said "export controls".

**Rewrite (138 words):**

> High bandwidth memory, or HBM, is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker stacks up to sixteen memory chips into a cube, drills holes straight down through the stack, and fills the holes with copper so that every layer is wired to the ones below. The cube then sits beside the processor, the chip that does the calculating. Stacking is the hard part, because each chip is ground so thin that the copper in its holes shows through its back, the finished cube has to fit under the plate that cools it, and one bad chip ruins the whole cube. Only SK hynix, Samsung and Micron have made it work, and a single line in an American export control reaches all three.

**Second teach-back:** HBM is the memory beside the calculating chip that holds the numbers being worked on and hands them over fast. Up to sixteen memory chips are stacked into a cube, holes are drilled straight down and filled with copper so every layer is wired to the ones below, and stacking is hard because each chip is ground so thin the copper in its holes pokes out its back, the cube has to fit under its cooling plate, and one bad chip ruins the cube. Only SK hynix, Samsung and Micron manage it, and one line of an American export control covers all three. Nothing lost.

## Chapter 11: Advanced Packaging

**Original (122 words):**

> Packaging joins finished chips into one component and mounts them on a base, called a substrate, wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot, so a modern accelerator cannot be one chip. It is made as several pieces, set side by side on a shared slab of silicon and wired together through it, with the memory a few millimeters away. Slab, chips and base all expand at different rates when heated, so the package can warp and its joints crack. Getting that right in volume is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan.

**First teach-back:** Packaging joins several finished chips into one part on a finely wired base called a substrate. A lithography machine can only print a postage-stamp area at once, so an accelerator has to be several chips side by side on a silicon slab, wired through it, with the memory millimeters away. The parts expand differently when hot so it can warp and crack, and TSMC in Taiwan does nearly all of it.

**Gaps:**
- "Can cover only a postage stamp in one shot, so a modern accelerator cannot be one chip": the teach-back repeated the "so" without the step. The step is that an accelerator needs more circuit than fits in one stamp.
- "The memory": which memory? Chapter 10's stacked cube. One word ties them.
- "In volume" is trade talk for "in large numbers".

**Rewrite (133 words):**

> Packaging joins finished chips into one component and mounts them on a base, called a substrate, wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot, and a modern accelerator needs more circuit than fits in one, so it cannot be one chip. It is made as several pieces, set side by side on a shared slab of silicon and wired together through it, with the stacked memory a few millimeters away. Slab, chips and base all expand at different rates when heated, so the package can warp and its joints crack. Getting that right in large numbers is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan.

**Second teach-back:** Packaging joins finished chips into one part on a substrate, a base wired nearly as finely as the chips. One lithography shot covers only a postage stamp and an accelerator needs more circuit than that, so it is several pieces side by side on a silicon slab, wired through the slab, with the stacked memory a few millimeters off. Slab, chips and base expand at different rates when hot, so the package can warp and crack, and doing it right in large numbers is so hard that TSMC in Taiwan packages nearly every AI accelerator. Nothing lost.

## Chapter 12: Substrates and PCBs

**Original (122 words):**

> A package substrate is the adapter between a chip and the circuit board under it. The chip's connections come out finer than a human hair; the board is wired in millimeters. The substrate is built up like plywood. A stiff core of glass cloth and resin sits in the middle, thin sheets of epoxy film are pressed onto both faces, a laser burns holes through each sheet, and copper is plated into the holes to carry signals from one layer to the next. Every added layer is another set of holes that can fail. A handful of firms build these substrates, and the film and the glass cloth each come from a single Japanese supplier, so a shortage here stops accelerators shipping.

**First teach-back:** The substrate is an adapter between the chip's hair-fine connections and the circuit board's millimeter wiring. It is built like plywood: a stiff core, thin epoxy sheets pressed on each side, laser-burned holes, copper in the holes to link the layers, and every extra layer is more holes that can fail. A few firms build them and two key materials each come from one Japanese supplier, so a shortage stops accelerators.

**Gaps:**
- Only one: the plywood sentence carries four steps and needed a second read. Splitting the core from the build-up gives one idea per sentence. Nothing else was lost.

**Rewrite (122 words):**

> A package substrate is the adapter between a chip and the circuit board under it. The chip's connections come out finer than a human hair; the board is wired in millimeters. The substrate is built up like plywood. A stiff core of glass cloth and resin sits in the middle. Thin sheets of epoxy film are pressed onto both faces, a laser burns holes through each sheet, and copper is plated into the holes to carry signals from one layer to the next. Every added layer is another set of holes that can fail. A handful of firms build these substrates, and the film and the glass cloth each come from a single Japanese supplier, so a shortage here stops accelerators shipping.

**Second teach-back:** A substrate adapts the chip's hair-fine connections to the board's millimeter wiring. It is built like plywood: a stiff glass-and-resin core, then thin epoxy sheets pressed on each face with laser holes plated in copper to carry signals between layers, and every layer is more holes that can fail. A handful of firms make them, the film and the glass cloth each come from one Japanese supplier, and a shortage stops accelerators shipping. Nothing lost, read once.

## Chapter 13: Test and Assembly

**Original (106 words):**

> Before a chip can be sold, a machine has to put questions to it and check every answer. While the chips are still on the wafer, thousands of needles press onto pads on each one, send in signals and read what comes back; the tester marks any chip that answers wrong, and that chip goes no further. A modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests sooner, at higher temperatures and for longer than it used to, and two firms, one Japanese and one American, sell most of the machines that do it.

**First teach-back:** Every chip is tested: while still on the wafer, thousands of needles touch its pads, send signals in and read the answers, and a wrong answer means it is scrapped. Since an accelerator glues a dozen expensive pieces together and one dud ruins them all, testing now happens earlier, hotter and longer. Two firms sell most of the testers.

**Gaps:**
- "Pads" was a guess (correct). Two words settle it.
- "At higher temperatures": why hot? The teach-back repeated "hotter" without the reason, which is to make a weak chip fail on the bench rather than later inside a finished product.

**Rewrite (121 words):**

> Before a chip can be sold, a machine has to put questions to it and check every answer. While the chips are still on the wafer, thousands of needles press onto small metal pads on each one, send in signals and read what comes back; the tester marks any chip that answers wrong, and that chip goes no further. A modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests sooner, hotter and longer than it used to, to make a weak chip fail on the test bench rather than inside a finished product, and two firms, one Japanese and one American, sell most of the machines that do it.

**Second teach-back:** A chip is tested on the wafer by thousands of needles pressing on its metal pads, sending signals and reading the answers, and any chip that answers wrong is dropped. An accelerator glues a dozen expensive pieces together and one bad one wastes all of them, so testing is now earlier, hotter and longer, to make weak chips fail on the bench instead of in the product. Two firms, one Japanese and one American, sell most of the testers. Nothing lost.

## Chapter 14: Systems and Networking

**Original (104 words):**

> One AI chip is not enough to train a model. So seventy-two of them are wired together in a rack, a cabinet the size of a wardrobe, and run as one computer. Each chip sits on its own board and draws more than a thousand amps. The chips have to swap results with each other all the time, and a copper wire can carry those signals only a few meters, so the longer links send them as light down glass fiber. Many companies can build the rack. Only a few can make the lasers that send the light, and that is the narrow point.

**First teach-back:** One AI chip cannot train a model alone, so seventy-two are wired into a wardrobe-sized rack and run as one computer. They swap results constantly, and copper only carries the signals a few meters, so longer links go as light through glass fiber. Many firms can build racks but only a few can make the lasers.

**Gaps:**
- "More than a thousand amps" was dropped; nothing to set it against. A whole house is wired for a small fraction of that.
- "Only a few meters": why? The teach-back repeated the limit without the cause, which is that the signals fade.

**Rewrite (118 words):**

> One AI chip is not enough to train a model. So seventy-two of them are wired together in a rack, a cabinet the size of a wardrobe, and run as one computer. Each chip sits on its own board and draws more than a thousand amps, several times the current a whole house is wired to carry. The chips have to swap results with each other all the time, and a copper wire can carry those signals only a few meters before they fade, so the longer links send them as light down glass fiber. Many companies can build the rack. Only a few can make the lasers that send the light, and that is the narrow point.

**Second teach-back:** Seventy-two AI chips are wired into a wardrobe-sized rack and run as one computer, each on its own board pulling over a thousand amps, several times what a whole house is wired for. They swap results all the time, and copper carries the signals only a few meters before they fade, so longer links go as light down glass fiber. Anyone can build the rack; only a few can make the lasers, and that is the choke. Nothing lost.

## Chapter 15: Data Centers and Power

**Original (153 words):**

> A data center's job is to feed electricity to the machines inside it and carry away the heat they give off. The scale is now that of a power station. One rack of AI chips, a cabinet the size of a wardrobe, draws 142 kilowatts, and every watt of it comes back out as heat, more than air can carry away, so water is piped through the rack instead. A large training site already holds a hundred thousand chips, and the newest sites are planned in gigawatts. One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029. The building is the easy part. Getting that much electricity to the door is the hard one, because the transformers, heavy switches and turbines that connect a site to the grid come from a few suppliers and take years to arrive.

**First teach-back:** A data center feeds the machines power and gets rid of their heat. One rack pulls 142 kilowatts, all of it becoming heat, too much for air, so it is water-cooled; big sites hold a hundred thousand chips and new ones are planned in gigawatts, a gigawatt being a big power station's whole output, and OpenAI plans more than nine of those. The hard part is getting the power to the building, because the grid gear takes years.

**Gaps:**
- "142 kilowatts" registered as a figure with nothing to hold it against; the author's earlier paragraph used hair dryers at about two kilowatts each, and the teenager in the last pass called it the best comparison in the set.
- "Turbines that connect a site to the grid": a turbine makes power; it does not connect anything. Half a second of puzzlement in the last pass, and the teach-back blurred it to "grid gear".
- "The scale is now that of a power station" is announced in sentence two and then stated with a number four sentences later.

**Rewrite (154 words):**

> A data center's job is to feed electricity to the machines inside it and carry away the heat they give off. One rack of AI chips, a cabinet the size of a wardrobe, draws 142 kilowatts, about seventy hair dryers running at once, and every watt of it comes back out as heat, more than air can carry away, so water is piped through the rack instead. A large training site already holds a hundred thousand chips, and the newest sites are planned in gigawatts. One gigawatt is the whole output of a large power station, and OpenAI's planned sites add up to more than nine of them by 2029. Getting that much electricity to the door is harder than putting up the building, because the transformers and heavy switches that connect a site to the grid, and the turbines that make the power, come from a few suppliers and take years to arrive.

**Second teach-back:** A data center feeds its machines electricity and carries off the heat. One wardrobe-sized rack draws 142 kilowatts, like seventy hair dryers at once, and all of it comes out as heat, too much for air, so water runs through the rack; a big site already has a hundred thousand chips, new ones are planned in gigawatts, each the output of a large power station, and OpenAI's plans add up to more than nine by 2029. Getting that power to the door is harder than the building, because the transformers and switches that hook a site to the grid and the turbines that make the power come from a few suppliers with years-long waits. Nothing lost.

## Chapter 16: The Economics of AI Chips

**Original (95 words):**

> A bill of materials is the list of parts inside a product and what each one costs to build. For an AI accelerator, the processor itself, the chip that does the calculating, is the cheap part, about a seventh of the total. The stacked memory beside it is nearly half, and the packaging that wires the two together costs more than the chip. Three firms in the world make that memory and one Taiwanese firm does that packaging, so the costliest parts are also the scarcest, and that is where a government's rules bite hardest.

**First teach-back:** A bill of materials lists a product's parts and what each costs. In an AI accelerator the calculating chip is only about a seventh of the cost, the stacked memory is nearly half, and the packaging costs more than the chip. Only three firms make the memory and one Taiwanese firm does the packaging, so the priciest parts are the scarcest, and that is where government rules hurt most.

**Gaps:** None. The one term is defined in the first sentence, the three fractions hold their own meaning, "stacked memory" and "processor" now tie back to chapters 10 and 7, and the last sentence links scarcity to cost to policy.

**Rewrite:** Left alone.

**Second teach-back:** Not needed.

## Chapter 17: Geopolitics

**Original (135 words):**

> An export control is a rule that makes a sale need the government's permission. The government names an item and a buyer, and from then on its own companies must hold a license before they ship that item to that buyer. Washington stretches the rule to cover goods made abroad with American technology. Few governments can use such a rule to much effect. It works only when the government's own firms sell something the buyer cannot get elsewhere, and the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.

**First teach-back:** An export control means a company needs its government's permission to sell a named item to a named buyer, and the US applies it even to things made abroad with American technology. It only works if your own firms make something the buyer cannot get elsewhere, which is why only the US, the Netherlands, Japan and South Korea can really use it. China can copy the simpler machines in a few years but not the finest printer, its chemistry, or HBM.

**Gaps:**
- "Washington" was read as the US government, which is a guess a fifteen-year-old can make but should not have to.
- The "works only when" sentence carries the condition and the list of countries in one breath and needed a second read.
- "High-bandwidth memory" is the fourth spelling of the same thing across the set (high bandwidth memory, HBM, stacked memory); a tie-back saves the reader a lookup.

**Rewrite (143 words):**

> An export control is a rule that makes a sale need the government's permission. The government names an item and a buyer, and from then on its own companies must hold a license before they ship that item to that buyer. The American government stretches the rule to cover goods made abroad with American technology. Few governments can use such a rule to much effect, because it works only when their own firms sell something the buyer cannot get elsewhere. The machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory, the stacked memory beside an AI chip.

**Second teach-back:** An export control is a government saying a named item cannot ship to a named buyer without a license, and the American one covers things made abroad with American technology too. Few governments can use it well, because it only bites when your own firms sell something the buyer cannot get anywhere else, and the machines, software and chemicals for advanced chips come from a short list of firms in four countries. China can copy the simpler machines in a few years but not yet the finest printer, its chemistry, or the stacked memory. Nothing lost.

---

## Register pass

After the rewrites, every changed paragraph was read once more against `.claude/skills/writing-well/SKILL.md` and the Claude-speak shapes in `qa/speak-hunt-a.md` (stems that announce the next sentence, restatements, "X is not Y" framings, punchline colons, clefts, triplets for rhythm, throat-clearing openers, hedges, second person, first person plural, self-reference, rhetorical questions, em dashes). Six paragraphs carried one; each was folded without dropping a fact, and the teach-back was re-run on each.

| Chapter | Shape caught | Before | After |
|---|---|---|---|
| 01 | "No one does X" stem before the sentence that says who does | `No one draws a plan like that by hand. Software from three companies, Synopsys, Cadence and Siemens, lays it out, checks it and signs it off,` | `Software from three companies, Synopsys, Cadence and Siemens, lays out a plan like that, checks it and signs it off,` |
| 02 | Punchline colon | `as one long cylinder: a single crystal, its atoms in one unbroken orderly pattern` | `as one long cylinder, a single crystal with its atoms in one unbroken orderly pattern` |
| 05 | "Cannot be X. Instead it is Y" framing | `so the plate cannot be a window. Instead it is a mirror, built up from` | `so instead of a window the plate is a mirror, built up from` |
| 10 | Four-word stem announcing its own list | `Stacking is the hard part. Each chip is ground so thin` | `Stacking is the hard part, because each chip is ground so thin` |
| 15 | Stem restated by a later sentence, and an easy-part/hard-part pair | `The scale is now that of a power station.` (cut; the gigawatt sentence already says it) and `The building is the easy part. Getting that much electricity to the door is the hard one, because` | `Getting that much electricity to the door is harder than putting up the building, because` |
| 17 | Stem plus mechanism as two sentences, and a closing restatement | `Few governments can use such a rule to much effect. It works only when the government's own firms sell something the buyer cannot get elsewhere. [list of countries], so those four governments hold most of that power.` | `Few governments can use such a rule to much effect, because it works only when their own firms sell something the buyer cannot get elsewhere. [list of countries].` |

Left as they are, on purpose: "Each switch is a valve." (08) and "The substrate is built up like plywood." (12) are the one-line pictures the next sentences fill in, and the previous pass found both carry the paragraph for this reader; "sooner, hotter and longer" (13) is three facts from the original, not a triplet for rhythm; "One AI chip is not enough to train a model." (14) is the fact that motivates the rack, and "that is the narrow point" is the last sentence doing its job in plain words; "Withhold the software and no new chip can be designed." (01) is the original's shape and is not second person.

Teach-backs after the folds: chapter 1 still gives software from three companies laying out and checking the plan; chapter 2 still gives seed, pull and one crystal; chapter 5 still gives no glass, so a mirror, with a dark pattern on it; chapter 10 still gives the three reasons stacking is hard; chapter 15 still gives seventy hair dryers, water, a hundred thousand chips, gigawatts, nine of them by 2029, and the equipment queues; chapter 17 still gives the condition (your firms sell what the buyer cannot get elsewhere) and the four countries. Nothing lost. Rebuilt afterward with no warnings; copies still identical.
