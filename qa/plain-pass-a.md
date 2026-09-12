# Plain-terms pass A: chapters 01 to 09

Test applied: would someone with no background follow every sentence on first reading? Calibration is chapter 02's paragraph. Same facts and numbers, length within 20 percent of the original, closing sentence keeps its job, glossary words kept in a form the popover regex matches, both copies (front matter `plain` and the first paragraph under "How it works") changed identically. `node build/build.js` ran clean after the edits: no warnings, `plain` and body match byte for byte in all nine files.

One note for whoever owns the build: the "In plain terms" box is not passed through `glossaryWrap` at build time (build.js line 385 wraps `pb.html` only, after `plainBox` has already removed the paragraph from the body), so no plain box on the site currently carries a popover button. That was true before this pass. The glossary words were kept anyway so the boxes are ready if that changes.

## 01 Chip design and EDA

Stumbles: "transistors" used before anything says what one is; the street-plan metaphor has to be decoded twice ("walkable in less than a billionth of a second", "changing one street"); "printing stencils" arrives with no link to anything the reader has seen.

Before (105 words):

> Chip design turns an idea for a processor into a complete blueprint, with every one of billions of transistors placed and wired. That is the street plan of a city that size, and every road has to be walkable in less than a billionth of a second. No one draws it by hand. Software from three companies, Synopsys, Cadence and Siemens, generates the layout, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. Changing one street afterwards costs a fresh set of printing stencils and several months. Withhold the software and the design cannot be made.

After (118 words):

> Chip design turns an idea for a processor into a complete blueprint. A chip holds billions of transistors, tiny electrical switches, and the blueprint fixes where each one sits and how it is wired to the others. A signal has to cross those wires in less than a billionth of a second. No one draws a plan like that by hand. Software from three companies, Synopsys, Cadence and Siemens, lays it out, checks it and signs it off, and a chip factory accepts only designs that have passed those tools. Changing the plan after that costs a fresh set of the stencils the factory prints from, and several months. Withhold the software and the design cannot be made.

## 02 Silicon and wafers

Left as is: this is the calibration paragraph, rewritten to the standard immediately before this pass.

## 03 Chemicals, gases and photoresist

Stumbles: "the exposed parts" assumes the reader knows "exposed" means "lit"; "a pattern the next machine can etch" does not say etch into what; "deposit, strip and clean around it" is three verbs with no object, and "around it" is vague; "All of it has to be clean" has no clear referent.

Before (103 words):

> Photoresist is photographic film for chips. A coating machine spreads a film thinner than a soap bubble across the wafer, light shines through a stencil, and the exposed parts dissolve away, leaving a pattern the next machine can etch. A few hundred other gases and liquids deposit, strip and clean around it. All of it has to be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why nine tenths of the world's photoresist comes from Japan, and a second source takes years rather than weeks.

After (121 words):

> Photoresist is photographic film for chips. A machine spins a coat of it, thinner than a soap bubble, across the wafer. Light shines through a stencil onto the coat, the parts the light reached dissolve away, and what remains is a pattern the next machine can etch into the wafer beneath. A few hundred other gases and liquids lay down layers, strip them off and clean the wafer between steps. All of them have to be clean to about one stray metal atom in a trillion, and each formula is approved for one factory and one product at a time. That is why nine tenths of the world's photoresist comes from Japan, and a second source takes years rather than weeks.

## 04 Lithography

Stumbles: the opening sentence carries two ideas across a colon; "Finer circuits need shorter wavelengths" states the physics as a bare rule with the number-like idea (wavelength) before the thing (finer lines); "such a machine" points back to nothing concrete.

Before (80 words):

> Lithography prints the pattern of a circuit onto the wafer: the machine holds a stencil of one layer up to a lamp and projects it, four times smaller, onto the silicon. Finer circuits need shorter wavelengths, and the shortest light now in use will not pass through air, so the printing has to happen in a vacuum. Only one company has ever built such a machine, and it is Dutch. Export controls on advanced chipmaking run through that one firm.

After (95 words):

> Lithography prints the pattern of a circuit onto the wafer. A machine holds a stencil of one layer of the circuit up to a lamp and projects the image, four times smaller, onto the silicon. The finer the lines, the shorter the wavelength of light needed to print them. The shortest light now in use will not pass through air, so the machine has to print in a vacuum. Only one company has ever built a machine that prints with it, and it is Dutch. Export controls on advanced chipmaking run through that one firm.

## 05 Photomasks and pellicles

Stumbles: "printing plate" is a new metaphor for the thing chapters 01, 03 and 04 call a stencil; "not a window but a mirror of about forty pairs of ultrathin layers, and any speck of dust" packs three ideas into one sentence, and a reader is left wondering how a mirror prints; "leading-edge" is trade language.

Before (94 words):

> A photomask is the printing plate for one layer of a chip. One plate prints the same layer on wafer after wafer, so it shapes millions of chips. No glass is transparent to the short light now in use, so the plate is not a window but a mirror of about forty pairs of ultrathin layers, and any speck of dust on it repeats on every wafer it prints. Two Japanese firms make almost all of those mirrors. A business almost nobody has heard of can hold up every leading-edge chip in the world.

After (110 words):

> A photomask is the stencil that lithography prints from, one for each layer of a chip. The same plate prints its layer on wafer after wafer, so one plate shapes millions of chips. No glass lets the short light now in use pass through, so the plate cannot be a window. Instead it is a mirror, built up from about forty pairs of ultrathin layers, and the light bounces off it. Any speck of dust on the plate repeats on every wafer it prints. Two Japanese firms make almost all of those mirrors. A business almost nobody has heard of can hold up every advanced chip in the world.

## 06 Deposition and etch

Stumbles: the layer-cake metaphor plus a colon plus four imperatives plus "more than a thousand times over" is one sentence a newcomer has to hold in full; "burn away" is not what etch does and clashes with "the burn has to eat"; nothing says which step prints the pattern.

Before (100 words):

> Deposition and etch build the chip itself, like a layer cake: lay down a film a few atoms thick, print a pattern on it, burn away everything the pattern does not protect, then do it again, more than a thousand times over. The film has to reach the bottom of a hole hundreds of times deeper than it is wide, and the burn has to eat one material and leave the one beside it untouched. Four firms in America, Japan and the Netherlands make most of these machines, and China has come closer to matching them here than anywhere else.

After (112 words):

> Deposition and etch build the chip itself, one layer at a time. Deposition lays down a film a few atoms thick. Lithography prints a pattern on it. Etch then eats away everything the pattern does not protect, and the next film goes down on top. A chip takes more than a thousand of these rounds. The film has to reach the bottom of holes hundreds of times deeper than they are wide, and the etch has to eat one material and leave the one beside it untouched. Four firms in America, Japan and the Netherlands make most of these machines, and China has come closer to matching them here than anywhere else.

## 07 Metrology and inspection

Stumbles: "die" and "AI accelerator" are both used before anything says what they are; "fab" likewise; the three checks are written as unpunctuated questions. Kept "die", "accelerator" and "fab" because the glossary matches them, but each now sits beside its plain meaning.

Before (105 words):

> Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over: are the lines the right width, did this layer land on the last one, has a speck of dirt killed a circuit. On a die as big as an AI accelerator, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a fab cut off from it can buy every other tool and still not learn why its chips fail.

After (124 words):

> Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over. It checks whether the lines are the right width, whether this layer landed squarely on the last one, and whether a speck of dirt has killed a circuit. An AI accelerator is one of the largest chips cut from a wafer, and on a die that size, halving the stray specks lifts the share of working chips from about half to about seven in ten. One American firm sells seven times as many of those machines as its nearest rival, so a chip factory, or fab, cut off from it can buy every other tool and still not learn why its chips fail.

## 08 Transistors and front end

Stumbles: "builds the switches" never says the switches are transistors, so the chapter's own subject is missing from its paragraph; "channel", "gate" and "voltage" arrive together in one sentence inside the valve metaphor; "a sequence that has to run in exact order" hangs off a sentence that described a shape, not a sequence.

Before (107 words):

> The front end of a chip factory builds the switches. Each one is a valve on a pipe: current runs along a silicon channel, and a voltage on the gate above it opens or shuts the flow. Make the channel short enough and the valve stops sealing, so current leaks through even when the gate is off and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the channel, a sequence that has to run in exact order. Only TSMC, Intel and Samsung can do it, a list short enough for an export rule to name in full.

After (127 words):

> The front end of a chip factory is the part that builds the transistors, the billions of tiny switches in every chip. Each switch is a valve. Current runs along a narrow strip of silicon called the channel, and a small voltage on a gate above the strip opens or shuts the flow. Make the strip short enough and the valve stops sealing: current leaks through even when the gate is off, and the chip burns power doing nothing. The fix is to wrap the gate around all four sides of the strip, which takes a long sequence of steps that have to run in exact order. Only TSMC, Intel and Samsung can do it, a list short enough for an export rule to name in full.

## 09 Foundries and fabs

Stumbles: "print shop" is a metaphor that has to be decoded, and "fill a shop like that" leans on it again; "design house" is trade language; "the air inside is cleaner than an operating theatre, and a wafer crosses hundreds of machines ... without ever touching that air" reads as a contradiction unless the reader already knows wafers travel in sealed pods.

Before (105 words):

> A foundry is a print shop for chips: other companies send in designs, and the foundry runs them through the same building on the same tools. The building costs tens of billions of dollars, the air inside is cleaner than an operating theatre, and a wafer crosses hundreds of machines over several months without ever touching that air. No design house sells enough of one product to fill a shop like that, so the world shares a handful of them. TSMC runs the biggest, and all six of its largest plants sit in Taiwan, which is why one island's politics reaches the whole chip supply.

After (117 words):

> A foundry is a factory that makes chips for other companies. Those companies send in their designs, and the foundry runs them all through the same building on the same tools. The building costs tens of billions of dollars, and the air inside is cleaner than an operating theatre. Even so, a wafer crosses hundreds of machines over several months inside sealed boxes, never touching that air. No chip company sells enough of one product to fill a factory like that on its own, so the world shares a handful of them. TSMC runs the biggest, and all six of its largest plants sit in Taiwan, which is why one island's politics reaches the whole chip supply.

## Checks

- Every paragraph within 20 percent of its original length (ratios 1.11 to 1.19).
- No em dashes, "you", "we", "imagine", question marks, exclamation marks or "US$" in any new paragraph; British spelling kept.
- Numbers unchanged: billionth of a second, three companies, soap bubble, one atom in a trillion, nine tenths, four times smaller, forty pairs, two Japanese firms, more than a thousand, hundreds of times deeper, four firms, half to seven in ten, seven times, TSMC/Intel/Samsung, tens of billions, six plants.
- Two small clarifications added, both true and both already in the chapter bodies: "the light bounces off it" (05, what a mirror mask does) and "inside sealed boxes" (09, the wafer pods).
