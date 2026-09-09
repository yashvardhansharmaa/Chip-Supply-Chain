## 01 Introduction and Goals

Body words 820 to 909 (range for this chapter 800 to 1,000). Front matter parses; `plain` byte-identical to the first paragraph under "The chain in one paragraph"; both figure markers present; no em dashes; build clean, D 0.

The chapter was already tight, so this pass spent its words on the reader rather than on length. Every term a policy reader would have to look up now carries a short gloss, and the front matter lost its acronyms.

Precision, and an actor for every verb:

- "only one company in the world can assemble them at volume" became "only one company, TSMC, can assemble them at volume". The nameplate already made the claim; the sentence now makes it checkable.
- "Capex at the five largest hyperscalers" became "Capital spending by the five biggest cloud firms", in the body, the key facts, the cost signal and the figure title.
- "Compute used to train frontier AI models" became "The computing power used to train frontier AI models"; likewise in the takeaways and the key facts.
- "The case for hardware as the binding constraint is empirical" became "The case that hardware sets the limit rests on numbers", answered by "The counter-case rests on numbers too."
- "the chapters run in process order" became "The chapters then follow the chip in the order it is built."
- "stand up an alternative" became "build an alternative". "A 5 means a single point of failure, where losing one supplier stops leading-edge production worldwide" became "A 5 means one supplier failing would stop leading-edge production worldwide."
- "Sixty to 95 percent of measured performance gains ... trace to scaling compute and data rather than to algorithms" became "... trace to running more computing power over more data rather than to better algorithms."

Expansions, each a definition of a term already used, never a new claim:

- Wafer, mask set, foundry, interposer, substrate: "the 300 mm discs, called wafers, that everything else is built on"; "the mask set, the stencils that carry the pattern, to a foundry that makes chips for other firms"; "a silicon interposer, a slab of silicon that wires them together"; "an ABF substrate, the stiff resin card underneath".
- Process words in plain English: "metrology" to "measurement"; "dice the wafers" to "cut them into separate chips"; "stacks bare DRAM dies with through-silicon vias into an HBM cube" to "stacks bare memory dies, wired vertically through the silicon, into a cube of high-bandwidth memory"; "lithography" now carries "which projects the pattern in light".
- Units spelled out: "20 TB of GPU memory and 576 TB/s" became "20 terabytes of GPU memory and 576 terabytes a second".
- "Cheaper inference" now carries "the cost of running a trained model".
- Front matter: EUV, HBM, EDA, ASIC, DUV, CoWoS and FYE-style abbreviations spelled out across `leaders`, `countries`, `chinaStatus`, `usStatus`, `substitution.why`, `keyFacts` and both figure titles. `specimenCaption` now explains what an exposure field and a scribe street are.
- `costSignal` rewritten so the number leads and the nameplate renders it at display size: "$448.2B of capital spending by the five biggest cloud firms in 2025".

Cuts:

- "where the trade-offs sit" replaced by the concrete list it stood for.
- "the size of a coaster" cut from `plain`, because the walkthrough two paragraphs later uses the same image for the same object.
- "the United States'" possessive replaced by "America's".
- "Systems integrators solder several onto a baseboard" gained its missing noun: "several of those packages".

Left alone:

- "an order of magnitude below what comparable Western models were thought to cost". Pass 2 declined to convert it to a fraction the citation does not give, and so does this pass.
- "fifteen stages" in the `oneLiner`, which matches chapters 02 to 16.

## 02 Chip Design, EDA and IP

Body words 1,155 to 1,318. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; all three figure markers present; no em dashes; build clean, D 0.

The chapter's problem was not length but density: it named a dozen terms of art without defining any of them. Almost all of the growth is glosses; the tightening is real but smaller.

Precision and actors:

- "The licence fee is not what disciplines the work; a mistake costs a mask set" became "The discipline comes from the cost of a mistake, which is a whole new mask set."
- "Synthesis maps the code onto the foundry's standard cells, then placement, routing, timing closure and signoff" became a sentence with a subject and verbs: "Software maps the code onto the foundry's prebuilt logic cells, then places them, wires them together and proves the timing holds."
- "CPU cores, interface controllers and the blocks that drive HBM are licensed" became "Design houses license the processor cores, the interface controllers and the blocks that drive high-bandwidth memory."
- "The lever needs no allied coordination and no lead time" became "Washington can pull this lever alone, and at once."
- "Below Broadcom and Marvell sit the Taiwanese houses that take a netlist to tape-out" became "... that carry a customer's circuit list all the way to a finished mask set".
- "Simulation cycles and emulator capacity per day, which sets schedule" corrected to "which set the schedule".
- Takeaways: "masks direct tens of billions of fab capacity" became "masks steer tens of billions of dollars of factory capacity", and the "And" opener was removed.

Expansions:

- Acronyms spelled out or replaced throughout: EDA to "design software", IP to "licensed blocks" or "licensed circuit blocks", ASIC to "an ASIC built for one company's own workload", TPU to "tensor processing unit", HBM PHY to "the memory interface", SerDes to "high-speed serial links", MTIA to "Meta's in-house chip", RTL kept but spelled out with "written in the hardware language SystemVerilog".
- Terms of art defined where they first appear: static timing analysis ("the check that proves a chip will run at its rated speed"), the reticle limit ("the largest area a scanner can print in one exposure"), chiplets ("several smaller dies wired together"), optical proximity correction ("which pre-distorts each shape so it prints true"), process design kit ("the file set describing what the factory can print"), design services ("where one firm turns another's specification into a manufacturable chip"), RISC-V ("the open instruction set that needs no licence"), BIS ("the agency that writes export licences"), CSET ("at Georgetown University").
- "Tape-out" now says what it is: "The handover."

Cuts:

- "which buys the customer software and resale value" became "so the buyer gets mature software and a resale market", which says the same thing without the compressed possessive.
- "Washington can pull this lever alone and at once, without waiting for allies" trimmed to "alone, and at once" after "without waiting for allies" proved to repeat "alone".
- "the foundry" three times in one criteria bullet reduced to one plus a pronoun.

## 03 Silicon and Wafers

Body words 1,130 to 1,230. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; both figure markers present; no em dashes; build clean, D 0.

Precision and actors:

- The lead's comparison was loosened to stay honest. "That is under a quarter of Nvidia's data-center revenue" became "That is a small fraction of Nvidia's data center revenue". The original comparison is unsourced in this chapter and much looser than the true ratio; a vaguer word is the safer claim, and no number was added.
- Passives given actors: "Silicon starts as quartzite reduced with carbon in an arc furnace, then turned into trichlorosilane gas, distilled and decomposed" became "Silicon starts as quartzite, which an arc furnace strips of oxygen with carbon. Refiners then turn that into trichlorosilane gas, distil it, and decompose it onto heated filaments"; "the slices are lapped, etched and mirror-polished" became "then the maker laps, etches and mirror-polishes each slice".
- "A new source must be proved out per device and per fab" became "A fab has to qualify each new wafer source for every chip it makes".
- "That is changing at the margin" became "That is starting to change"; "Feedstock is a separate map" became "The raw material is a separate map"; "a mature-node hangover" became "a slump in the older, mature nodes".
- "which is the base domestic makers are building from" promoted from a trailing clause to its own sentence.
- Duplicate wording removed: "Bigger discs make lithography a bigger share of the bill: photolithography takes half..." became "Bigger discs make printing a bigger share of the bill".

Expansions:

- Doping named where it happens: "Boron or phosphorus stirred into the melt, a step called doping, sets how readily the wafer conducts and whether its charge carriers are positive or negative", replacing "sets resistivity and conductivity type".
- "starves out dislocations at the seed" became "chokes off the flaws formed at the seed".
- "latch-up" kept but glossed as "a parasitic short between power and ground"; "nanotopography" glossed as "the fine ripple across the surface"; "superlinearly" replaced by the plain comparison "A big AI die loses more good silicon per defect than a small chip does".
- Acronyms removed: SOI became "silicon on insulator" described in words ("a buried layer of oxide, which is glass, separates a thin working layer of silicon from the bulk"), RF became "radio", EUV became "extreme-ultraviolet", "epi" became "epitaxial wafers", "Mt" became "million tonnes", SEMI now carries "the industry association", CSET "at Georgetown".
- "One killer defect ruins far more silicon on a reticle-limited GPU die" became "One fatal defect ruins far more silicon on a GPU die that fills a whole printed field".
- `specimenCaption` now explains a Czochralski ingot ("one crystal pulled whole from molten silicon") and "ground 300 mm body" ("body ground to a true 300 mm"). `oneLiner` says "the 300 mm wafer" rather than "the 300 mm substrate", which collided with the packaging substrates of chapter 13.

## 04 Chemicals, Gases and Photoresist

Body words 1,161 to 1,252. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; both figure markers present; no em dashes; build clean, D 0.

Precision and actors:

- "A wafer is coated with a film" became "A coating machine spreads a film ... across the wafer" (in both copies of `plain`).
- "cracked in a plasma to strip chamber walls" became "split apart in a plasma to strip the chamber walls"; "slurries flatten" became "polishing slurries flatten each layer"; "sputtering targets supply the interconnect metal" became "supply the metal for the wiring".
- "Fujifilm added 30 percent of CMP slurry capacity at Kumamoto" became "lifted its polishing-slurry capacity at Kumamoto by 30 percent", which is what the sentence was trying to say.
- "What they gate is price" became "What they move is price". "the targets stockpiled" in the `oneLiner` became "the countries hit stockpiled".
- The causal chain in the extreme-ultraviolet paragraph was made explicit: "so a dose has far fewer of them, and where they land shows up as line-edge roughness and missing contacts" became "so the same dose of light arrives as far fewer photons, and the luck of where each one lands shows up as ragged line edges and missing contact holes."

Expansions:

- KrF and ArF replaced by "a krypton fluoride laser" and "an argon fluoride laser shining through water", which also explains what immersion means.
- CMP replaced by "polishing slurries" everywhere it appeared (card, countries, body, table); FOUP by "wafer carriers"; NF3 by "nitrogen trifluoride"; HF by "hydrofluoric acid"; JIC by "Japan Investment Corporation, a state-backed fund"; USGS by "The US Geological Survey"; PFAS by "PFAS, the long-lived fluorinated chemicals"; ECHA by "ECHA, the EU chemicals agency"; "derogations" by "exemptions"; "RF front ends" by "radio front ends"; "compound-semiconductor wafers" by "non-silicon wafers"; "tin-oxo clusters" by "clusters of tin and oxygen".
- Table cells made readable: "ArF immersion CAR" to "ArF immersion chemically amplified", "Needs multipatterning" to "Needs several exposures per layer", "Photon shot noise" to "Shot noise from too few photons", "Cost, defectivity, outgassing" to "Cost, defects, outgassing", "High-NA and tight-pitch layers" to "High-NA tools, tightest pitches".
- The photon-efficiency criterion, which was a three-clause chain of jargon, now reads as a chain of consequences: "how much light the resist absorbs sets the dose, the dose sets how many wafers an hour the scanner prints, and too few photons per dose set the defect rate."
- `specimenCaption` now explains the double-block-and-bleed panel rather than only naming it.

Open item for a fact-checker, not changed here because it would mean moving a sourced date: the body says Beijing "licensed gallium and germanium exports from July 2023" (Stimson), while `chinaStatus` and the key fact say August 2023 (USGS). Both are defensible readings of announcement versus effective date, but the chapter should pick one.
