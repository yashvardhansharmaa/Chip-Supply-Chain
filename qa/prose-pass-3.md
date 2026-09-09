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

## 05 Lithography

Body words 1,334 to 1,338. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; all four figure markers present; five em dashes, all in "Key evaluation criteria" bullets; build clean, D 0, 25 sources unchanged. The count is flat because the expansions below had to be paid for with the cuts below.

Precision, and an actor for every verb:

- "gets its shape from a machine built by one company" became "from a machine one company builds".
- "The Japanese incumbents are specialists now" became "Nikon and Canon are specialists now". "its Precision Equipment business ran at a loss" became "lost money on Precision Equipment".
- "It is an integrator with 5,100 suppliers" became "It assembles more than it makes, listing 5,100 suppliers".
- "Source power sets output" became "Brighter light means more wafers an hour", in the body and in the Source power criterion.
- Accounting language out of the prose: "ASML recognized four EXE systems in revenue" became "booked four EXE systems as revenue"; "48 EUV systems recognized in 2025" became "booked in 2025"; the figure title "EUV systems recognized in revenue per year" became "EUV systems ASML booked as revenue each year"; "ASML net system sales by ship-to region" became "by the region tools shipped to".
- "only Zeiss makes them to that figure" became "only Zeiss can polish them". "Figure" is optics jargon for a mirror's surface shape and reads as a number.
- "We think the ceiling on EUV output is Zeiss mirror polishing and coating rather than final assembly in Veldhoven" became "We think Zeiss mirror polishing and coating, not final assembly in Veldhoven, caps EUV output."
- "the FPA-1200NZ2C stamps rather than projects" became "stamps the pattern instead of projecting it".
- "Lithography scores a 5 because the failure mode is total and substitution takes decades" was kept, because the policymaker reader test quoted that sentence as the one it would cite, but "the failure mode is total" now carries its own gloss: "if ASML stops shipping, nothing at the leading edge gets printed."

Expansions, each a definition of a term the chapter already used:

- Numerical aperture, the quantity the whole chapter turns on, was a bare term. It now reads "divided by the numerical aperture, which is how wide a cone of light the optics gather. A wider cone prints finer, and a denser medium widens it, so ASML floods the gap above the wafer with ultrapure water". "The smallest printable half-pitch" became "the finest feature a scanner can print".
- Multipatterning: "Each pass adds a mask, cycle time and overlay error" became "Each pass costs another mask, more time on the tool and another chance to misalign".
- "DUV means excimer laser light" became "Deep ultraviolet (DUV) light comes from gas lasers", with krypton fluoride and argon fluoride spelled out at first use and abbreviated afterwards. "54 i-line" became "54 the older, coarser i-line".
- "The optics are anamorphic, demagnifying 4x in one direction and 8x in the other" became "Its optics shrink the mask image four times in one direction and eight in the other".
- "halves the exposure field" became "halves the patch of wafer one exposure covers", and the Field size criterion now opens with that definition.
- "polished to tens of picometres" became "polished flat to within tens of picometres, thousandths of a nanometre".
- "It prints the tightest-pitch layers, the ones that set transistor density and metal pitch" became "the finest layers, the ones that set how densely transistors and wires pack".
- Front matter: the `oneLiner` spells out extreme ultraviolet and says what a scanner is for; `specimenCaption` names the reticle as a mask; the ASML and Canon `leaders` notes spell out EUV, DUV and the two laser gases; the German `countries` note says the Trumpf lasers "drive the light source"; `costSignal` replaces "0.33 NA EUV scanner" with "standard EUV scanner"; `chinaStatus` glosses i-line as the coarsest tier; the tool-price figure title says "The High-NA figure is quoted as a range".

Cuts, all of them repetitions:

- "and fires 50,000 pulses a second" from the Trumpf bullet. The same rate is already in the source paragraph three above, as "dropping molten tin into a vacuum vessel 50,000 times a second", with its citation.
- "which also builds the illumination optics" from the extreme ultraviolet paragraph, and with it the whole clause "A collector mirror hands the light to a six-mirror projection system from Zeiss". The Zeiss supplier bullet in "Who makes it" carries both facts and the same citation.
- "on a stronger source, a new wafer handler and faster stages": the engineering behind a throughput number, which a regulation drafter does not need.
- "of which only a handful exist", superseded by the EXE unit counts one paragraph later.
- "ASML does not publish per-system prices" folded into the Reuters sentence as "prices ASML does not publish".
- The cross-reference at the end of the naming sentence went from two chapters to one.

Left alone: the tin-droplet paragraph, the three-step control chronology, the "we think" judgment, and every other number with its citation.

## 06 Photomasks and Pellicles

Body words 1,175 to 1,240. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; the figure marker present; five em dashes, all in criteria bullets; build clean, D 0, 16 sources unchanged.

Precision and actors:

- "masks are checked as blanks, after patterning and in production" became "fabs check masks three times: as blanks, after patterning and again in production".
- "A mask defect kills yield systematically" became "A mask defect costs yield on every wafer that mask prints", which is the actual mechanism.
- "That number decides who gets to use a node" became "That cost decides who can use a node at all".
- "Mask making splits into captive and merchant" became "splits between fabs that make their own and firms that sell to everyone", and "because turnaround time is a competitive weapon" became "because they want to control turnaround time".
- "every photon it absorbs is productivity the customer loses" became "is light that never reaches the wafer".
- "The blank is where two decades of learning sit: depositing forty bilayers with sub-angstrom uniformity across a six-inch plate, with no buried particles" became "laying down forty layer pairs across a six-inch plate, even to within less than an angstrom, a tenth of a nanometre, with no particle buried anywhere underneath".

Expansions:

- The lead: "a defect-free reticle, built on a blank two Japanese firms supply and cleared by a tool one Japanese firm makes" became "a flawless mask, built on a blank plate that two Japanese firms supply and passed by an inspection tool that one Japanese firm makes".
- "A DUV mask is transmissive" became "A deep ultraviolet mask lets light through". "An EUV mask is a mirror, about 40 molybdenum and silicon bilayers of 7 nm period on low-expansion glass under a tantalum absorber" became "An EUV mask reflects instead, about 40 molybdenum and silicon layer pairs, 7 nm to a pair, laid on low-expansion glass under a tantalum absorber that carries the pattern", so "bilayer" and "period" are both explained without changing the count.
- The Mask 3D bullet now gives the cause: "Light strikes the mirror at an angle rather than head-on, which distorts the printed shape, so software has to correct for it in advance."
- "The absorber has to be cut to single-digit nanometre placement" became "Every edge of the absorber has to sit within a few nanometres of where the design says."
- "Multi-beam writers fire beamlets in parallel" became "fire many beams at once"; "cuts the pattern into resist on the blank" became "into a sensitive coating on the blank".
- "High-NA halves the printable field" became "High-NA scanners halve the patch of wafer one exposure covers".
- "the same set kills an inference ASIC shipping in the thousands" became "a custom inference chip shipping in the thousands". "dense curvilinear EUV patterns" became "dense, curved EUV patterns".
- Front matter: the `oneLiner` explains mask blanks as "the blank plates that EUV masks are built on" and the pellicle as "the dust cover meant to protect them"; `specimenCaption` names both the reticle and the pellicle and says what the 2.5 mm standoff buys ("far enough that a particle landing on it prints out of focus"); "actinic" in the Lasertec note became "at the wavelength the scanner itself uses"; "merchant" became "selling to outside customers" and "captive" became "in-house"; the IMS note says what a mask writer does; `costSignal` turns "depending on node and source" into "depending on the node and on whose estimate you take"; the figure title became "Cost of one mask set by node".

Cuts:

- "At the leading edge the range is $10 million to $40 million", which restates the SemiAnalysis sentence directly above it. Both numbers survive in that sentence, in `costSignal`, in the criteria and in the takeaways.
- Hoya's "a lead it intends to defend at advanced nodes", which the `leaders` note already says.
- `chinaStatus` lost its opening "No EUV mask capability", because the same field's last sentence lists the three missing capabilities one by one.

## 07 Deposition and Etch

Body words 1,169 to 1,209. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; all three figure markers present; five em dashes, all in criteria bullets; build clean, D 0, 17 sources unchanged. This chapter came out of pass 2 the tightest of the four, so almost all the change here is expansion for the outside reader.

Precision and actors:

- "the ions and radicals do the chemistry" became "the charged fragments left over do the chemistry".
- "sputters atoms off a target onto the wafer" became "knocks atoms off a solid target and lands them on the wafer".
- "lays down a fraction of a monolayer at a time, so it coats vertical walls and horizontal floors alike" became "lays down less than one atomic layer at a time, so it coats vertical walls as evenly as horizontal floors".
- A factual mis-attachment fixed: "HBM needs deep through-silicon vias, which BIS defines as etch at 10:1 or greater above 7 microns per minute" said that BIS defines vias. It now reads "needs holes etched straight through the silicon so chips can be stacked and wired, which BIS controls at 10:1 or deeper above 7 microns a minute", which also drops the unexplained word via.
- "the extreme aspect ratios HBM and 3D memory need" became "the extremely deep, narrow holes that HBM and 3D memory need".
- "Dielectric etch cuts the oxides and nitrides between them" became "the insulating oxides and nitrides".
- The Particles criterion, which was a noun phrase, became a question with a verb: "how much of the defect budget these tools eat, and whether one chamber behaves like the next; the tools in the next chapter measure it".

Expansions:

- `specimenCaption` was a list of five pieces of jargon in a row. It now says what three of them do: the slit valve "is where the wafer goes in and out", the gate valve and turbopump "hold the vacuum", and the gas "enters through the plenum and showerhead".
- Card acronyms spelled out: PVD, CVD and ALD in every `leaders` note; ECCN as "export classification number" and the foreign direct product rule as "a rule that reaches tools built outside the United States from US technology" in `usStatus`.
- `substitution.why` replaced the three jargon nouns "selectivity, particle control and chamber matching" with the three things a Chinese tool cannot yet do: "cut one material while sparing the next, keep particles out, or make one chamber behave like the next".
- The Conformality criterion now defines aspect ratio: "whether a film reaches the bottom of a hole, and how deep that hole is against its width".
- Figure titles: "Global semiconductor equipment billings" became "What the world spent on chipmaking equipment"; "CY2025" became "2025".
- `oneLiner`: "Deposition and etch build the thing" became "build the chip itself", and the sentence was split so the China point stands on its own.

Left alone: the four control-chronology bullets with their ECCN numbers, which are the reason a policy reader opens this chapter, and the Cryo 3.0 and backside-power numbers.

## 08 Metrology and Inspection

Body words 1,328 to 1,334. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; all three figure markers present; five em dashes, all in criteria bullets; build clean, D 0, 15 sources unchanged.

Precision and actors:

- The lead put a subordinate clause in front of its fact. "Against a wafer equipment market of roughly $120 billion in 2025, process control is about a tenth of what a fab spends on tools" became "Process control is about a tenth of what a fab spends on tools, out of a wafer equipment market of roughly $120 billion in 2025", and the 56.5 and 57.2 percent counts were split out of one sixty-word sentence into two.
- "gross-area defects from mishandling, misalignment or over-etching, and spot defects from the process itself, the stray material and airborne particles that kill one circuit" became "whole regions ruined by mishandling, misalignment or over-etching, and single circuits killed by stray material or an airborne particle".
- "The second kind has a governing equation" became "The second kind follows an equation".
- "an 8 square centimetre die, the size of a reticle-limited AI accelerator" became "about as much as one exposure can print".
- "That share of fab spending is still rising" had no clear antecedent after an intervening chart. It became "Process control's share of fab spending is still rising".
- "less redundancy and more logic content in memory" became "less built-in redundancy and more logic inside memory".
- "still fail to ramp" became "still fail to get production going".
- "E-beam metrology resolves what light cannot" became "Electron-beam metrology resolves detail too fine for light".
- "reticle" became "mask" in the mask-inspection bullet and in "Patterning, which covers overlay and mask inspection".
- "the share of flagged events that are not real defects" became "that turn out not to be real defects".

Expansions:

- `specimenCaption` was a noun list. It now says the gun "sits at the top under its high-voltage insulator", that the condenser and objective lenses "are magnets drawn as iron yokes round their coils", and that the detector is "ring-shaped" rather than annular.
- Card: "CD measuring" became "line-width measurement"; "CMP" became "polishing"; "6.5x" became "6.5 times"; "FY2026" became "fiscal 2026"; "YieldStar overlay" became "YieldStar layer alignment"; the Applied Materials note became "electron-beam defect review, line-width measurement and film metrology"; `usStatus` and `costSignal` were re-split into shorter sentences with the numbers leading.
- In the body, CD-SEM now appears once as "CD-SEM line-width tools" before the bare abbreviation is used again.
- The December 2024 threshold sentence was split in two, so the four alternative triggers read as a list rather than as one clause chain.

Cuts:

- "How many wafers and sites to sample is a cost decision as much as a physics one." An orphan sentence stranded between the bullet list and the figure, and the Sampling plan criterion said the same thing. The criterion now carries the phrase.
- The "Who makes it" opener lost "The process control tool market was $13.4 billion in 2024 and KLA took 57.2 percent of it" as a standalone sentence, because the lead paragraph gives both share figures. It now reads "KLA is most of the segment: 57.2 percent of a $13.4 billion market in 2024", keeping the market size and the citation.

Open item for a fact-checker, not changed here: the sentence "An 8 square centimetre die ... yields about 49 percent at a defect density of 0.10 and about 69 percent at 0.05" carries no citation of its own. It is presumably computed from the yield equation cited in the paragraph above, but as printed it is the only unsourced number pair in the chapter, and the `plain` paragraph rests on it.

## 09 Transistors and the Front End

Body words 1,096 to 1,265. Front matter parses; `plain` rewritten and byte-identical in both copies; both figure markers present; six em dashes, all in criteria bullets; build clean, D 0, 16 sources. This is the one chapter of the four that grew. It carried more unexplained vocabulary than any other file I hold, and the glosses cost more than the cuts saved.

Precision and actors:

- Passive with a knowable actor, in the Takeaways: "Every gain since the FinFET era has been bought with process steps and new materials" became "Foundries have bought every gain since the FinFET era with process steps and new materials".
- "Making them is the front end of line; wiring them is the back end" became "Making the switches is the front end of line; wiring them together is the back end", so neither pronoun has to reach back to "208 billion switches".
- "A planar transistor puts the gate on one side" became "lays the gate on one side"; "The fin stands it on edge for three-sided control" became "A fin stands the channel on edge so the gate covers three sides".
- "Copper needs a barrier, a liner and a cap to stop it diffusing into the dielectric" became "Copper seeps into the insulator around it, so every wire needs a barrier, a liner and a cap": the problem now comes before the remedy.
- "AI accelerators sit a node behind: a reticle-limited die needs a mature process to yield" became "AI accelerators sit a node behind the leading edge: a die that large comes out working only on a process that has run for years." Yield as an intransitive verb is trade-speak.
- "which is harder to build and worth more" became "which is harder to build and buys more". Worth more to whom was never said.
- Figure title and card: "TSMC logic roadmap beyond N2, from TSMC's own announcements" became "TSMC's logic roadmap beyond N2, from its own announcements"; `costSignal` lost "The public signal is" as a separate clause.

Expansions:

- "reticle-limited dies" became "dies, each the largest a lithography machine can print in one shot". The reticle limit is chapter 12's subject; here it needed a clause, not a term.
- "electrically as thin as the oxide it replaced: Intel's hafnium high-k dielectric" became "gripping the channel as tightly as before: Intel switched the gate insulator from silicon dioxide to hafnium". High-k, the industry's name for the property, is gone and the property is stated.
- "width then comes in whole fins: nobody gets 1.5 fins of drive" became "current then comes in whole fins: a designer who needs more adds one, and nobody gets half a fin". Drive current is now called current, and "Width is continuous again" became "The sheets can be drawn any width, so current comes in fine steps again".
- "a tenfold cut in dynamic voltage droop" gained "the sag in supply voltage when a block of logic switches on at once".
- "imec expects complementary FETs to stack the n-type and p-type devices, which sit side by side today, and roughly halve a CMOS pair's area" became "A logic gate needs two transistors that switch on opposite signals, and today they sit side by side. The research institute imec expects complementary FETs to stack them and roughly halve the pair's area." Three terms replaced by one plain sentence, and imec identified: the site names it three times and nowhere says what it is.
- "with EUV" became "with extreme ultraviolet lithography" on first use, and "enough to keep SMIC's DUV multipatterning lines running" became "Those are deep-ultraviolet machines, a generation behind EUV, and SMIC gets fine features out of them by printing each layer in several passes."
- "113.4 MTr/mm2" became "113.4 million transistors per square millimetre" in the body, the keyFact and `chinaStatus`; "has a 32.5 nm minimum metal pitch" became "sets its narrowest wires 32.5 nm apart".
- "SRAM is the scaling failure" became "SRAM, the fast memory on the logic die, is the scaling failure", and "the gain comes from the periphery, not the bit cell" became "from the circuits around the array rather than from the cell that holds one bit".
- CSIS spelled out on first use in the body; the Takeaways keep the abbreviation.
- Criteria glossed in place: "off-state leakage and the minimum supply voltage" became "how much the switch leaks when off, and the lowest supply voltage it can run on"; "IR drop across the die" became "the voltage lost carrying power across the die"; "one library type" became "one kind of cell".

Cuts:

- "SemiAnalysis puts the generic gain at 15 to 20 percent on power for high-performance designs ([source])" deleted. The sentence immediately before it gives 15 to 20 percent less power for A16, so the reader met the same range twice in two sentences. The source survives in the chapter through the SRAM and SMIC teardown citations.
- "self-aligned quadruple and double patterning" in `chinaStatus` became "printing each layer in two or four passes", and "semi-damascene scheme" left the ruthenium bullet. The demonstrated 16 nm pitch and its citation stayed.
- "Three companies build gate-all-around nodes with EUV: TSMC, Intel and Samsung" became "TSMC, Intel and Samsung build gate-all-around nodes with extreme ultraviolet lithography", because the rewritten `plain` now names the three and the sentence no longer has to count them.

Left alone:

- `substitution.why` says "over a thousand steps" and `plain` says "about a thousand steps". Both were already in the file, neither is cited, and reconciling them would mean choosing a number.
- "Node names describe nothing physical." Kept as a flat assertion; the sentence after it is the evidence.
- "That is the largest foreign direct investment in US history" is in chapter 10, not here, but the same rule applied throughout: uncited claims already in the file were left for the fact-checker rather than quietly rewritten.

## 10 Foundries and Fabs

Body words 1,118 to 1,183. Front matter parses; `plain` rewritten and byte-identical in both copies; both figure markers present; six em dashes, all in criteria bullets; build clean, D 0, 12 sources.

Precision and actors:

- "TSMC was founded in 1987 and pioneered the pure-play model by promising never to compete with its customers" became "TSMC, founded in 1987, invented the pure-play model: it builds chips for other companies and promises never to compete with them." The model is now defined where the term first appears rather than a section later.
- "Everything TSMC and its subsidiaries manage came to" became "Every plant TSMC and its subsidiaries run came to", and "The Taiwanese gigafabs are 13 million of it" became "The six Taiwanese gigafabs hold 13 million of that".
- "Intel and Samsung make their own products and sell capacity too" became "design and sell their own chips and rent out capacity too", which also unpacks the section heading's "integrated device makers"; "internal products absorb the good capacity" became "the house products take the best capacity".
- "Samsung's swing factor is Taylor, Texas" became "Samsung's bet outside Korea is Taylor, Texas".
- The Intel stake paragraph was one chain of clauses. It is now three sentences; "The stake is passive" became "The stake carries no control"; and the warrant's trigger is stated as something Washington does, "a five-year warrant for a further 5 percent that Washington can exercise only if Intel drops below 51 percent ownership of the foundry business".
- "Below 10 nm the United States had almost no share in 2022" became "The United States had almost no capacity below 10 nm in 2022", so the share has an object.
- "compete on cost rather than density" became "compete on price rather than density". They compete on price.
- Consistency fix using facts already on the site: "The binding constraint is usually packaging rather than wafers" became "Through 2024 and 2025 the binding constraint was packaging rather than wafers", because chapter 12 reports the constraint moving back to front-end wafers in March 2026. In the present tense the two chapters contradicted each other.

Expansions:

- The lead now anchors the unit once for the whole chapter: "more than 100,000 300 mm wafers a month" became "more than 100,000 wafers a month, each a 300 mm disc, twelve inches across", so "12-inch equivalent wafers" two paragraphs later needs no lookup. SMIC's "8-inch-equivalent wafers" became "wafers counted in the smaller 8-inch size".
- "Chips at 7 nm and below" gained "meaning the newest processes" on first use.
- "SEMI expects" became "The industry association SEMI expects".
- "put 18A-P into risk production" gained "the trial runs a process goes through before it is signed off"; "ASML's High-NA EUV" became "ASML's High-NA extreme ultraviolet scanners".
- Criteria: "Yield at ramp" now says what it measures, "how many good chips a new process gives in its first year"; "Utilisation" gained "how full the lines run", and "what a captive home market does for loading" became "for volume"; "an IDM-owned foundry" became "a foundry owned by a chipmaker"; "grid margin" became "spare generating capacity".
- Card: `chinaStatus` now reads "it cannot buy an EUV scanner, which caps it below the leading edge", and the China country note's "almost all of it mature" became "almost all of it on older nodes".

Cuts:

- "No design house sells enough of one product to fill that." Deleted from the body: the rewritten `plain`, which is the paragraph directly above it, now makes that point in almost the same words.
- The lead lost "their combined output passed 13 million 12-inch equivalent wafers in 2025", which the third paragraph gives alongside the 17 million total that makes it mean something. The gigafab citation moved with it, so the 13 million figure is sourced where it now sits.

Left alone:

- "That is the largest foreign direct investment in US history" carries no citation of its own. Flagged for the fact-checker rather than cut, because the sentence it sits in is the chapter's point about scale.
- "Diversification is real and slow." A judgment stated flat, in the site's voice; the sentence after it supplies the reason.

## 11 Memory and HBM

Body words 1,090 to 1,197. Front matter parses; `plain` rewritten and byte-identical in both copies; all three figure markers present; six em dashes, all in criteria bullets; build clean, D 0, 15 sources.

Precision and actors:

- "that width is bought with die area and stacking yield" became "that width costs die area and stacking yield" in `costSignal`.
- "The base die is now a logic die, so it goes to a foundry" became "The chip at the bottom of the stack is now a logic chip rather than a memory one, so it has to be made in a foundry".
- "melting the bumps between stacked dies and moulding underfill around them" became "which melts the solder bumps between stacked chips and moulds a filler around them", and "which controls heat and warpage" became "holding heat and warping in check".
- "A finished cube is capped at 775 micrometres, raised from 720 for HBM4" became "HBM4 raised the cap on a finished cube from 720 micrometres to 775, still under a millimetre", which gives the change an actor and the unit a scale.
- "what binds a new entrant is the stacking line and the Nvidia qualification behind it rather than the DRAM die" became "what stops a new entrant is the stacking line and Nvidia's approval, rather than the memory chip itself"; the Takeaways' "What binds now is heat and height" became "The limit now is heat and height".
- "The filing attributes the figures to IDC, and they move fast" became "The filing credits the research firm IDC, and the numbers move fast", because "they" could have been read as the firms.
- The first-quarter 2026 split, "Micron was at 23.1 percent and Korea down to 76.9", ended its paragraph with no citation beside it. The prospectus citation is now repeated on that sentence.
- Spellings brought into line with the rest of the site: "molding compound" became "moulding compound", and "cold plate" became "cooling plate" to match `plain`.

Expansions:

- The hardest paragraph in the chapter used weight, token, key-value cache, context and batch size in four sentences. It now reads: "Answering a prompt is where the width earns its cost. Training reuses each stored number across a huge multiplication, so a chip can fetch little and compute a lot. Generating one word of an answer reads the whole model and the whole running record of the conversation, then waits on memory, and that record grows with the length of the conversation and the number of users served at once."
- "Ordinary DRAM cannot be made that wide" became "Ordinary memory cannot be made that wide", and DRAM is introduced later as "Ordinary computer memory, DRAM".
- "24 GB 8-high and 36 GB 12-high" became "24 GB with eight chips stacked and 36 GB with twelve"; the table's "(8-high)", "(12-high)" and "(16-high)" became "(8 chips)", "(12 chips)" and "(16 chips)".
- "Etch through-silicon vias into a DRAM wafer" became "Etch vertical holes, the through-silicon vias, into a memory wafer"; "Bonding copper to copper directly cuts the pitch ... and removes the underfill" became "Pressing copper pad straight onto copper pad, with no solder and no filler, would cut the spacing between connections".
- "JEDEC published" became "The standards body JEDEC published"; "BofA" became "Bank of America" in the body and in the figure's title and source label; "first through Nvidia qualification" became "first to pass Nvidia's qualification tests".
- The export paragraph, the one a policy reader is most likely to cite, now spells out the agency and glosses the mechanism: "The Bureau of Industry and Security rule of 5 December 2024 added an export classification, ECCN 3A090.c, ... and reached stacks made outside the United States through a foreign direct product rule, which catches goods made abroad with American technology".
- Criteria: "sets inference throughput" became "sets how fast a chip can serve answers"; "the base die runs hottest, and every added layer raises resistance to the heatsink above" became "the chip at the bottom runs hottest, and every layer added above it makes the heat harder to get out".
- `specimenCaption`: "a 12-high HBM stack, exploded" became "a twelve-high HBM stack, pulled apart", and "thinned DRAM dies" became "thinned memory chips".

Cuts: none of substance. This chapter was the tightest of the four, and the growth is all glossing.

Two open items for a fact-checker, neither changed here:

- The variants table gives HBM3E as "1,024-bit, 16 channels" while the body and the keyFact, both from Micron, say "1,024 bits wide across 32 channels". Channels against pseudo-channels is the likely explanation, but as printed the chapter contradicts itself, and fixing it means choosing a number.
- "Generating one word of an answer" simplifies "generating one token". It is the plainest available rendering, and it is not exact.

## 12 Advanced Packaging

Body words 1,348 to 1,338. Front matter parses; `plain` rewritten and byte-identical in both copies; all three figure markers present; six em dashes, all in criteria bullets; build clean, D 0, 19 sources. This was the only one of the four already at the top of the range, so every gloss had to be paid for with a cut.

Precision and actors:

- "CoWoS builds it in two passes, chip-on-wafer and then wafer-on-substrate" became "The name CoWoS says the order: chip onto wafer, then wafer onto substrate", which stops the sentence expanding the acronym and then restating it.
- "its interposer is one monolithic die whose yield falls as area grows" became "one unbroken piece of silicon whose yield falls as the area grows".
- "Intel's EMIB embeds the same bridge idea in the organic substrate" became "buries the same bridge idea in the resin substrate".
- "taking interconnect pitch far below what microbumps allow" became "packing the connections far closer than microbumps allow".
- "Epoch AI models each designer's component consumption against global supply" became "weighs each designer's component use against world supply".
- "front-end wafer capacity is now the dominant bottleneck and that CoWoS constraints are easing" became "front-end wafers are now the dominant bottleneck and CoWoS is easing"; "The queue has eased and the concentration has not" became "The queue has eased; the concentration has not".
- "%" became "percent" in the thermocompression bullet, the only place in the chapter that mixed the two.
- "TSMC does not publish a CoWoS wafer number, and the omission is deliberate" became "and will not", which is what the next paragraph demonstrates.

Expansions:

- "organic substrate" and "organic build-up substrate" became "resin base board" and "resin substrate" throughout, including the table cell "Organic RDL interposer", now "Resin interposer with fine redistribution wiring", which is also where RDL first appears.
- "thermal cycling" became "repeated heating and cooling", and then, once the `plain` paragraph above had made the point, simply "one cracked joint".
- "TSMC does the 2.5D work for AI accelerators" gained "chips side by side on a shared carrier", the only place the chapter says what its own section headings mean.
- The thermocompression bullet now says what the tool does before it gives ASMPT's revenue.
- "chiplets on SMIC silicon plus domestic assembly" became "building big chips from small chiplets cut on SMIC silicon and assembled at home"; "they took none in ALD" became "none in atomic layer deposition", matching the figure's own axis label.
- "relaxes bump pitch enough to mount HBM on a standard organic substrate" became "spaces the connections widely enough to mount the stack on a standard resin substrate".
- Card: OSAT spelled out in the leaders and the China country note; "60% CAGR" became "60% compound annual growth"; `substitution.why`'s "the yielded integration of a 5.5-reticle interposer with its HBM stacks" became "getting a 5.5-reticle interposer and its HBM stacks to come out working"; `specimenCaption`'s "C4 bumps" became "the larger solder bumps beneath it".
- The lead's "got around the reticle" became "got around that reticle limit", so the unit used later, "5.5x reticle" and "14-reticle", has an antecedent.

Cuts, to pay for the above and get back under 1,350:

- "Bridges, dies, organic interposer and substrate all expand at different rates, so the package warps" deleted from the Blackwell paragraph. The `plain` paragraph a screen above says it in nearly the same words; what survives is the consequence, "the bridges ... have to be placed to a tolerance that the package's warping fights".
- "Fifteen months later the answer had not changed" deleted and the October 2025 paragraph folded onto the July 2024 one. The section said "no number" four times and now says it twice, keeping every date, figure and quote.
- Smaller: "and expected supply to stay tight" (the same call already says he could not reach balance); "one at a time" from the thermocompression bullet, since the Bonder throughput criterion carries it; "would give the real number the following year" trimmed to "give the real figure the year after".

Left alone:

- "Lithography stopped being the limit on chip size in 2022" in `oneLiner`, an uncited date already in the file.
- "the most expensive logic dies ever made" and "Every AI accelerator worth buying is bigger than that". Both are the site's voice, and both carry the chapter's argument.

## 13 Substrates and PCBs

Body words 1,334 to 1,323. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; both figure markers present; no em dashes; build clean, D 0.

Precision and actors:

- The lead lost a possessive tangle and a category word: "the company's packaging capacity is now so tight that it limits its customers' growth" became "packaging capacity is now so tight that it limits customers' growth", and "Everything after it is organic chemistry" became "Past its edge the chain turns to epoxy and glass", which names the materials instead of a branch of science.
- "The hard part is that silicon and epoxy expand at different rates when heated, and warpage grows with area" became "Silicon and epoxy swell at different rates when heated, so the larger the package, the more it warps."
- Throat-clearing openers replaced by the point: "It expands on a slow clock" became "Capacity comes slowly"; "The core laminate has the same problem one level down" became "One layer down, the core tells the same story."
- "TTM names its competition as mostly Chinese and Taiwanese, and the hedge against that is Southeast Asia" split in two so the hedge is its own claim rather than a trailing clause.
- Unsourced number removed: "a part that already costs hundreds of dollars before a die touches it" became "a part that is already expensive before a die touches it". It was the only quantity in the chapter with no citation behind it.
- Attribution restored after a draft loosened it: the 2021 review does not itself flag build-up substrate, so the sentence reads "recorded build-up substrate among the materials commenters called vulnerable".

Cuts:

- Intel's rationale for glass ("organic materials run into shrinkage and warping limits as packages grow") deleted. The chapter makes that argument twice already, in "How it works" and in "The chokepoint".
- Also cut, each time with the fact and not the citation that supports the surviving numbers: the varnish-and-coating aside in the Ajinomoto paragraph, Samsung's interim agreement date, Unimicron's half-year fixed-asset spend, Shinko's two co-investors, and the section opener "Under the substrate is a board that has become an engineering problem of its own", which delayed TTM's 30-to-70-layer fact by fourteen words.

Expansions:

- "Microvias" replaced by what they do: "burns holes through it with a laser, plates copper into the holes to link the layers, and etches the wiring on top".
- "Reticle-sized logic die" became "a large logic die", and "its CoWoS roadmap goes beyond 14 times reticle size" became "its CoWoS packaging roadmap goes beyond 14 times the area a lithography machine can print in one shot". The same gloss is used in chapter 14 so the two agree.
- ABF is now spelled out and defined on first use: "Ajinomoto Build-up Film, or ABF, is the insulating sheet between the copper layers". "The flip-chip BGA insulating market" became simply "its share", since the paragraph has just said what the film is.
- "Merchant" unpacked into "The plants that build substrates for other firms"; "FC-BGA insulating film" in the leaders note became "insulating film in high-end processor packages"; "PCB" spelled out in the country notes, `chinaStatus` and `usStatus`.
- Criteria glossed in place: coefficient of thermal expansion as "how much a material swells when heated", dielectric properties as "how much signal the core laminate soaks up", and "warpage and handling set the process window" as "warping and handling decide what can be built, not the wiring".
- `specimenCaption`: "an ABF build-up substrate" became "an epoxy build-up substrate", "laser-drilled microvias" became "laser-drilled holes down to the layer below", and the confusing tail "with the film itself drawn in copper" became its own sentence.

## 14 Test and Assembly

Body words 1,129 to 1,212. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; all three figure markers present; no em dashes; build clean, D 0. The chapter grew: this is the most acronym-dense of the four, and the glosses listed below cost about 90 words against about 25 words of cuts.

Precision and actors:

- Passives given actors: "the ones that answer wrong are marked and never leave" became "the tester marks the ones that answer wrong, and they never leave"; "The packaged part is tested again" became "The tester runs the packaged part again".
- "Advantest counts test as the only one that handles electricity" became "the only one that puts electricity through the chip", which is what the claim means.
- "Every die in a body that size is another chance to throw the whole assembly away, which is why test insertions multiply instead of consolidating" became "Every added die is another chance to lose the whole assembly, which is why the number of test steps keeps rising."
- "What holds a customer is the cost of leaving: Advantest argues that switching tester vendor means rebuilding a customer's entire device development, evaluation and production test environment" split into two sentences and lost the second "customer".
- Amkor's second-quarter revenue gained the word "alone", which is what makes it a growth fact rather than a second number.

Expansions:

- "Known-good die is what changed", a term of art used as a sentence, became "What changed is the value of proving a die good before it is packaged."
- "Back end" glossed at first use: "the back end of the industry, assembly and test, decides which of them are allowed into a package". "OSAT" now arrives as "Outsourced assembly and test, the OSAT business", and is spelled out in the card, the key facts and the third figure title.
- "Handlers" defined in the bullet label: "the machines that feed parts into a tester and cook them". "Panel-level work" became "for packaging on rectangular panels rather than round wafers", which also sets up Powertech two paragraphs later. "Dicing saws" became "the saws that cut wafers into dies".
- "SoC test" became "test for logic chips" in the body, the takeaways and the key facts; "HBM" became "a high-bandwidth memory stack"; "CSET" now carries "Georgetown's"; "turnkey packaging and test" became "run packaging and test there for TSMC".
- Criteria de-jargoned: "latent failures" to "hidden failures", "a package that cannot be reworked" to "cannot be taken apart", "probe card planarity" to "probe card flatness", "decide sort economics" to "decide what wafer sort costs".
- `specimenCaption`: "a MEMS probe head" became "a micro-machined probe head". `oneLiner`: "The back end decides" became "Assembly and test decide".

## 15 Systems and Networking

Body words 1,141 to 1,224. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; both figure markers present; em dashes only in the five "Key evaluation criteria" bullets; build clean, D 0. Same trade as chapter 14: the glosses below cost more than the cuts.

Precision and actors:

- "Rack-scale systems dissolve the baseboard" became "do away with the baseboard"; "Integration is moving toward the customer" became "Assembly is moving closer to the customer"; "The architectures differ in how many accelerators share one coherent domain" became "The designs differ in how many accelerators can share one pool of memory."
- "A model too big for one accelerator is split across the scale-up group" became "gets split", and the sentence now ends "sets the size of model you can train" rather than "sets how large a model you can shard".
- "The control point is NVLink-class scale-up switching ... and in indium phosphide lasers" was broken parallelism; it now reads "The control points are ... and indium phosphide lasers".
- "Switch and accelerator silicon is a US duopoly" became "Custom accelerator and switch silicon is a US duopoly", which is the claim the next two sentences actually support.
- Repetition cut: the chokepoint section repeated InnoLight's 2019 move to Thailand, with its citation, twelve lines after the same fact in "Who makes it". The second copy is gone.

Expansions:

- Jargon replaced by its meaning: "memory-coherent domain" became "bound tightly enough that they can read each other's memory"; "model parallelism lives on scale-up" became "a model too big for one accelerator gets split across the scale-up group"; "the rack fabric" became "the rack's own network"; "both fabrics" became "both networks"; "ODMs" became "contract manufacturers"; "merchant" became "sells to all comers".
- Terms defined on first use: transceivers as "the modules that turn electricity into light and back"; InfiniBand as "the specialised network supercomputers grew up on"; SXM and the Open Compute Project module named in full; Ironwood as "the seventh generation of Google's own TPU accelerator".
- Units spelled out: "800G" became "800 gigabits", "800G and 1.6T optics" became "800-gigabit and 1.6-terabit optics", "picojoules per bit" gained "the energy cost of moving data".
- "The FCC's July 2026 order" became "the Federal Communications Commission's July 2026 order", in the body and in `usStatus`; "logic-bearing components" became "logic chips".
- Marvell's shopping list ("optical DSPs, PCIe retimers and Ethernet switching silicon") became "the optical and networking parts that go with them"; "Meta's MTIA" became "Meta's own".
- Card notes rewritten for outsiders: Nvidia's share note now says "for links inside a rack" and "between racks" rather than "scale-up" and naming protocols alone; "InP lasers" became "indium phosphide lasers"; "ODM design and rack integration; high-layer-count PCBs" became "Contract design and rack assembly; high-layer-count circuit boards".
- Two accuracy reversals after drafting: "four lanes to a station" was restored from "port", and "stitch cubes into superpods" from "cubes of racks", because both changes went beyond what the sources say.

## 16 Data Centers and Power

Body words 1,160 to 1,215. Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; all three figure markers present; em dashes only in the five "Key evaluation criteria" bullets; build clean, D 0.

Precision and actors:

- "That has inverted" became "That has flipped". "Cooling ... passes it to a facility loop that rejects it outdoors" became "a building loop that dumps it outdoors".
- The nuclear bullet was one 60-word sentence with two citations and a "so" clause; it is now three sentences, and Constellation is named as the seller of the Crane plant instead of "sold forward to Microsoft" hanging on the plant as a participle.
- The power chain sentence was split: "Utility power steps down through a substation, switchgear, uninterruptible supplies and distribution units before it reaches the rack busbar, each stage with its own lead time" became two sentences ending "Each stage has its own lead time."
- Duplicate fact removed: "A GB300 NVL72 draws up to 142 kW today", with its citation, opened "Rack power" eight paragraphs after the identical figure in "How it works".
- "The only efficiency metric that matters commercially, and it is falling faster than demand is rising per unit of output" was unreadable; it now reads "It keeps falling, but the number of tokens rises faster."

Expansions:

- "800 VDC" became "800 volts of direct current" on first use and "800-volt DC" thereafter, including in the key facts and the Schneider Electric card note; "54 VDC distribution" became "the 54-volt distribution in today's racks".
- "Ride-through storage" became "the stored energy that carries the rack through a dip"; "uninterruptible supplies" became "battery-backed supplies"; "rear-door heat exchangers" became "heat exchangers in the rack door"; "poor serviceability and almost no installed base at hyperscale" became "hard to service and barely used at scale".
- "Behind-the-meter gas" gained "generation on the site itself"; "firm new generation" gained "the kind that runs whatever the weather"; "slot reservations" became "reserved factory slots" in the body, the card and the cost signal.
- Institutions named in full on first use: "ERCOT, the grid operator for most of Texas", "The Energy Information Administration". "Approved to energise" became "approved to switch on".
- "The hyperscalers pay for it" became "The largest data center operators pay for it", and the figure title "Capital expenditure by hyperscaler, 2025" became "Capital spending by the five largest US data center operators, 2025". "Token" is now glossed once, as "the chunk of text a model reads or writes".
- `specimenCaption` ends "the part of the machine that waits on the grid" instead of the riddle "the part with the queue in front of it".

## 17 Component Costs

Body words 1,250 to 1,279 (range 1,050 to 1,350). Front matter parses; `plain` byte-identical to the first paragraph under "How it works"; all three figure markers present; no em dashes; build clean, D 0, 21 sources unchanged.

This chapter talks to a reader who knows money better than silicon, so the pass spent words naming the parts and took them back out of the machinery.

Precision, and an actor for every verb:

- "It is also the line the buyer controls least" became "Nvidia controls it least of all", which names the buyer the sentence was hiding.
- "At rack scale the useful number becomes cost of ownership" became "Buy a whole rack and the number that matters is the cost of a GPU-hour". "In the operator case" moved to the front of the SemiAnalysis sentence as "For an operator that owns the machine", so the qualifier survives where it can be read.
- "Die cost is set by the wafer price, the number of dies that fit on a wafer, and the share of those that work" became "Three numbers set the cost of a die: the price of the wafer, how many dies fit on it, and how many of those work."
- "an 800 mm2 die ... steps out to 68 whole dies" became "fits 68 times", after "so the edge of the disc goes to waste" replaced the bare geometry.
- "Micron's gross margin was 39.8 percent" became "Micron earned 39.8 percent", and "so the margin moved upstream to Nvidia's suppliers" became its own sentence, "The margin moved up the chain, to Nvidia's suppliers."
- Takeaways: "a custom ASIC can attack it" became "a custom chip can attack it".

Expansions, each a gloss on a term already in the text, never a new claim:

- "die" now carries "the finished rectangle of circuitry cut out of a wafer".
- "CoWoS-L packaging adds about $1,100" became "CoWoS-L, the TSMC process that mounts dies and memory on one carrier and wires them together, adds about $1,100".
- "The 192 GB of HBM3E beside those dies" became "The 192 GB of high-bandwidth memory beside those dies, sold as HBM3E".
- WSTS and SIA spelled out as World Semiconductor Trade Statistics and the Semiconductor Industry Association, in the body, the key facts and the figure note. "The industry totals disagree with each other" became "The two bodies that count this industry disagree".
- "earn 50 to 75 points" became "earn gross margins of 50 to 75 percent"; "distributions, not point estimates" became "each line as a range rather than a single figure"; "a package that fails after memory attach" became "a package that fails after the memory goes on".
- Compressibility table: "TSVs" became "through-silicon vias", "scrap kills dies and HBM" became "scrap destroys dies and memory".
- Front matter: the `countries` notes lost OSAT, HBM and ABF ("outsourced assembly and test", "High-bandwidth memory", "Ajinomoto build-up film and the substrates made from it"); `substitution.why` lost ASIC and became two active sentences; `chinaStatus` lost "pay a worse cost structure" for "dodge Nvidia's margin and pay for it elsewhere"; `specimenCaption` says "high-bandwidth memory" and "stacked to scale from the bottom up" instead of "from the foot".

Cuts:

- "Micron's gross margin, further down this page, shows what that is worth to a seller" (15 words), because "Who captures the value" makes the same point two screens later with the numbers attached.
- "Memory is 45 percent of a B200 build" from "The chokepoint", which was the third statement of that figure in the chapter; the Epoch citation moved onto the packaging claim beside it, so no number lost its source.
- "One level up again" to "One level up"; "carries over $4B of server capex" to "costs over $4B in servers"; "The test is whether the line falls when volume doubles" to "Does the line fall when volume doubles?"

Left alone:

- "Doubling the wafer price moves the whole bill by a few hundred dollars." The claim is derived rather than cited, and restating the arithmetic would mean adding a number, so it stands as pass 2 left it. Flagged here for whoever owns the sourcing.
- Both tables, every heading, and the row labels "EUV lithography" and "HBM", which are table structure rather than prose.

## 18 Geopolitics

Body words 2,493 to 2,493 (range 1,800 to 2,500). Front matter parses; `plain` byte-identical to the first paragraph under "The shape of the contest"; all three figure markers present; no em dashes; build clean, D 0, 54 sources unchanged.

The count did not move, and that is the honest summary: about 130 words of plain-English expansion went in and about 130 words of wordiness and repetition came out. The chapter had already been cut twice, so the fat left was in its acronyms rather than its sentences.

Expansions, all glosses on terms the chapter already used:

- "the Entity List" now carries "Commerce's roster of buyers that need a licence".
- "New ECCNs 3A090 and 3B090" became "Two new export classifications, 3A090 and 3B090".
- "BIS" is now introduced as "Commerce's Bureau of Industry and Security (BIS)" at first use, then abbreviated.
- "4,800 TPP, or at 1,600 TPP" became "4,800 points of that performance score, or at 1,600", after the two parameters are named in the sentence before.
- "to D:5 countries" became "to the D:5 group of arms-embargoed countries"; "A Section 232 proclamation" became "A national-security proclamation under Section 232"; "into A:5" now carries "the tier that holds Washington's close allies".
- "MOFCOM Notice 46" became "Notice 46, from China's Ministry of Commerce", and the November entry now says "the ministry" and "the Asia-Pacific summit" rather than "MOFCOM" and "APEC".
- "SMIC runs 7 nm-class logic on multipatterned immersion DUV" became "SMIC prints 7 nm-class logic on older deep-ultraviolet scanners, exposing each layer several times because it cannot buy the finer light", which is the largest single expansion in the chapter.
- "CXMT's own HBM" became "CXMT, China's own memory maker"; "PRC entities" became "Chinese entities"; "The House Select Committee" became "The House select committee on China"; "an OSAT partner" became "an assembly and test partner"; "immersion DUV sales" became "sales of immersion deep-ultraviolet scanners".
- "front-end and back-end capacity were 'very tight'" became "wafer and packaging capacity both 'very tight'", which is the same quotation with the trade's two words translated.
- Predicted winners and Takeaways: "HBM or CoWoS" became "memory stacking or advanced packaging", "EUV, EUV resist and HBM at scale" became "Extreme-ultraviolet machines, their resist and high-bandwidth memory at scale", "no wafer, HBM or OSAT industry" became "no wafer, memory or assembly industry".
- Front matter: `leaders` lost EUV, DUV, HBM and "process control"; `countries` lost EDA; `chinaStatus` and `substitution.why` lost EUV and HBM; the second key fact now reads "Since 15 January 2026 Commerce has reviewed H200 and MI325X sales to China case by case" instead of the actorless "are reviewed case by case".

Cuts and actives:

- "In 2022 the goal changed" became "In 2022 Washington changed the goal"; "The regime was built one rule at a time" became "Commerce built the regime one rule at a time"; "Cumulative state funding since 2014 is estimated at $150 billion" became "CSIS puts cumulative state funding since 2014 at $150 billion"; "Arizona is not expected to reach 2 nm" became "nobody expects Arizona to reach 2 nm".
- The 55-word Nexperia sentence split in two, and "Neither measure lasted" lost its second "suspended".
- "The rule follows ownership, so a Chinese firm cannot buy through a subsidiary abroad" folded into the sentence above it, which already said "headquartered or ultimately owned there": "so no Chinese buyer could route the order through a foreign subsidiary".
- The closing paragraph of "Predicted winners" dropped the four percentages it was restating from earlier in the chapter, each of which is cited where it first appears: "A 25 percent tariff, an expected 15 percent cut of licensed sales, a 9.9 percent equity stake and a case-by-case licence queue" became "tariffs, equity stakes, a cut of licensed sales and a licence queue".
- "Europe's position at the leading edge does not reach the mature nodes its car industry runs on" became "Europe holds a chokepoint at the leading edge and none at the mature nodes its car industry runs on", which says the same thing without the double negative.
- Smaller: "were meant to push China backwards, not just slow it" to "aimed to push China backwards rather than merely slow it"; "Export controls on minerals followed" to "Mineral controls followed"; "the catch-all clause of its Strategic Trade Act" to "its Strategic Trade Act"; "Taiwan's ban on making its newest chips abroad, against the $250 billion investment commitment" to "Taiwan's overseas-production ban against its $250 billion investment promise".

Left alone, and flagged:

- "Chinese regulators discouraged customers from buying, importing or using Nvidia's data-centre products, and endorsed performance-per-watt and bandwidth standards for accelerators in Chinese data centres." This is the one sentence in the chapter that carries factual claims with no citation. It was not mine to delete and I could not source it, so it is flagged here for the source editor.
- The chokepoint table, including the rows still labelled "EUV lithography", "DUV lithography" and "HBM".
- The quotation from Nvidia's filing, including "USG".

## data/landscape-notes.md

Words 3,132 to 3,233. Nineteen chip panels, read by researchers, so the pass added definitions where a non-specialist would stall and took out the slack elsewhere; the file grew by about 100 words, all of it explanation.

Expansions:

- "the design that made reticle-crossing normal" became "the design that made it normal to build a chip larger than one lithography exposure"; "Two reticle-limited compute dies" became "Two compute dies, each as large as one lithography exposure allows"; "a reticle-sized inference ASIC" became "an inference part the size of one lithography exposure"; and the Cerebras panel now defines the reticle limit in place, as "the largest rectangle a scanner can print in one shot".
- "hybrid-bonded onto two N6 I/O dies" became "bonded copper to copper onto two N6 input-output dies".
- "specifically to hold KV cache" became "to hold the key-value cache that a model builds up as it answers"; Groq's "KV cache" likewise.
- "The rest of the uplift is in attention" became "The rest of the gain is in attention, the step that decides which earlier words a model looks at".
- "4,000 tokens per second of single-GPU prefill and 1,000 per second of decode" now names both passes: "prefill, the pass that reads the prompt" and "decode, the pass that writes the answer".
- "merchant accelerator" and "merchant AI accelerator" became "accelerator sold on the open market"; "not a China-specific SKU" became "not a China-specific model"; "a 20-build-up-layer ABF substrate" became "a 20-layer build-up substrate"; "six copper RDL layers" became "six copper wiring layers".
- Acronyms retired in favour of words: TDP to "power draw" or "power figure" in four panels, ODM to "the system builder", NIC to "network interface", SoC to "the whole system on chip", BIS to "the Bureau of Industry and Security", MOFCOM to "China's Ministry of Commerce", TPP to "points of total processing performance".

Actives and cuts:

- "Boards and racks are built by Foxconn, Quanta, Wistron, Wiwynn and Supermicro" became "Foxconn, Quanta, Wistron, Wiwynn and Supermicro build the boards and racks".
- "the B30A ... was blocked in November 2025" became "Washington blocked the purpose-built B30A ... in November 2025"; "the RTX Pro 6000D was rejected by Beijing" became "Beijing rejected the RTX Pro 6000D".
- "HBM allocation between Samsung and SK hynix is disputed between analysts" became "analysts disagree over how the memory orders split between Samsung and SK hynix".
- "Note the two configurations:" became "The part ships in two configurations:"; "What it does document is the MUSA stack" became "It does document the MUSA stack"; "The 2026 development is that Groq's roadmap product is now" became "In 2026 Groq's roadmap product became".
- "a single monolithic die" became "one die"; "which is what forced liquid cooling to become the default rather than an option" became "which made liquid cooling the default rather than an option"; "It drops SparseCores entirely" became "It drops SparseCores".
- Three sentences over 50 words were split: the Trainium3 packaging sentence, the Groq wafer-cost sentence and the Jalapeño supply-chain sentence.
- "The 910C is the clearest case in the industry of a domestic chip that materially is not one" became "The 910C is the industry's clearest case of a domestic chip that is not really domestic."

## data/chokepoint-matrix-notes.md

Words 1,508 to 1,508, with the expansions paid for out of the wordiness.

Expansions: CSET spelled out as "Georgetown's Center for Security and Emerging Technology" on first use; SIA and BCG as "The Semiconductor Industry Association and Boston Consulting Group"; ETO as "the Emerging Technology Observatory (ETO) Supply Chain Explorer"; ATP as "assembly, test and packaging"; OSAT as "outsourced assembly and test"; IDMs as "the assembly that chipmakers and foundries do in-house"; ODMs as "the contract manufacturers"; EDA as "the design-software arm" and "design software"; EUV as "extreme-ultraviolet"; "2.5D capacity" as "interposer-based (2.5D) capacity"; and "a client-rendered app" as "the explorer draws its charts in the browser".

Actives: "was read row by row" to "we read ... row by row"; "were all checked" to "we checked"; "The figures are modelled" to "We model the figures"; "that is flagged in the segment note" to "the segment note says so"; "That is recorded in the row's note" to "The row's note records it"; "it has been emptied instead" to "we emptied it instead"; "had to be rolled forward" to "We rolled the sub-5 nm figure forward"; "is not used" to "we do not use it"; "are called out in the segment notes" to "the segment notes call them out".

Cuts: the Amkor example appeared twice, in the assembly-and-test paragraph and again under headquarters conversion; the second instance now reads "a headquarters cut erases Southeast Asia, which does about a fifth of the world's assembly", which is the part the first instance did not say. Also "Memory is the clearest illustration of why the distinction matters" to "Memory shows why the distinction matters"; "which was a market-research count" kept but "It also completely misses" to "It also misses"; "The 38 used here" to "The 38 in the table"; "is a function of" to "depends on"; "Micron is US but fabs most of its bits" to "Micron is American but makes most of its bits".

## data/control-thresholds-notes.md

Words 768 to 804. A short file that was already precise; the growth is all acronym expansion.

- "ECCN 3A090.a catches a chip at TPP 4800" became "Export classification 3A090.a catches a chip at 4,800 points of total processing performance (TPP)", and the same treatment ran through the 2026 entry and the closing list.
- "BIS added ECCN 3A090.c and set the HBM line" became "the Bureau of Industry and Security (BIS) added export classification 3A090.c and set the line for high-bandwidth memory".
- "the current eCFR text" became "the current text in the electronic Code of Federal Regulations (eCFR)"; "A Section 232 proclamation" became "A national-security proclamation under Section 232"; "Article 51(3)" became "Article 51(3) of the AI Act".
- "The zero de minimis entry is the clearest case" now defines the term in place: "where no amount of American content is too small to trigger control".
- Fixes: "holds 40 quantitative thresholds ... Each object records one number" became "holds the 40 thresholds ... Each entry records one threshold", because a third of the file's entries carry no number at all and the old wording contradicted the file's own third paragraph. "Read four fields first" became "Start with four things", since what follows is four groups and seven fields. "It expires in two months and reimposes automatically" became "The stay expires in two months and the rule comes back automatically", which gives each verb the right subject.
- Actives and cuts: "the detail was checked against the rule text and corrected" to "we checked the detail ... and corrected it"; "The third group carries most of the regime's reach, and it is the group that catches people out" to "The third group carries most of the regime's reach and catches people out"; "for United States end use" to "for American use".

## data/exposure-notes.md

Words 726 to 729.

- The Nvidia restatement sentence was the hardest line in the file to read: "FY2025 China revenue was $17,108m, 13.1%, on the old billing basis and is $25,048m, 19.2%, restated" became "was $17,108m, or 13.1 percent, on the old billing basis, and $25,048m, or 19.2 percent, restated".
- The 90-word Samsung sentence split in three. "on the company's investor-relations asset host" became "on its own investor-relations site"; "Samsung is the one firm here that is not an SEC registrant" became "the one firm here that files with no US regulator"; "The figures were checked against those documents" became "We checked the figures against those documents".
- "`chinaShare` is computed here from the filed absolute figures, never copied from" became "We compute `chinaShare` from the filed absolute figures, never copying".
- "DART" now carries "Korea's disclosure system".
- The ASM International note said the disclosure "is neither absolute nor on a total-revenue basis", which contradicted the quotation printed beside it; it now says what the reader can check: "which gives no absolute figure and sets equipment sales against a total-revenue denominator".
- Smaller: "where a controlled tool physically lands" to "where a controlled tool lands"; "No China line appears anywhere in it" to "No China line appears in it"; "Veeco is absent from that file and is classed as" to "Veeco does not appear there, so this file classes it as".

## data/glossary.json

Twenty-four edits across 23 of the 74 entries. The `plain` and `why` fields together fall from 4,970 words to 4,938. JSON parses; the entry count is still 74.

Definitions that repeated themselves:

- FLOPS: the `plain` field ended "One teraflop, written TFLOPS, is a trillion operations per second", which the term line already says as "a TFLOPS is a trillion of them". Cut.
- HBM: "A single HBM chip moves data roughly thirty times faster" became "One such stack moves data roughly thirty times faster", which also removes the acronym and fixes "chip", since the entry has just defined a stack.

`why` lines that were two sentences became one, as the brief asks: gate-all-around ("The transistor of the 2 nanometre generation. Only TSMC, Intel and Samsung can build it in volume" became "Only TSMC, Intel and Samsung can build the 2 nanometre generation's transistor in volume"), HBM and OSAT. No `why` field now runs to more than one sentence.

Acronyms inside the definitions, where the reader had to know the term to read its own entry: ALD to "Atomic layer deposition", EUV to "extreme ultraviolet" twice, DUV to "Immersion deep ultraviolet", "merchant chips" to "chips bought on the open market", and the BIS entry no longer uses "BIS" twice in the line that explains what BIS does.

Openers varied, because seven `why` lines began "It is": the foreign direct product rule now opens "This rule is what makes US controls extraterritorial"; hybrid bonding, "Taller, cooler memory stacks wait on this step"; memory wall, "This gap is why"; multipatterning, "China reaches advanced processes this way"; NVL72, "AI capacity is now bought and priced by the rack"; NVLink, "A genuine single-vendor chokepoint"; silicon shield, "The central and contested assumption behind Taiwan policy". Four `plain` fields opened "A chip"; the ASIC entry now opens "A one-customer chip", and the parallel between fabless and integrated device manufacturer was left in place because it teaches the pair.

Passives and clutter: "Their combined capital spending is guided at" to "They have guided to"; "the cost of catching a bad one late is what is pushing testing" to "pushes testing"; "the word is used interchangeably with photomask" to "the word means the same as photomask"; "a material share of an accelerator's cost" to "a real share"; "the enabling step for high bandwidth memory" to "what make high bandwidth memory possible"; "solving this would move the cost of EUV" to "would cut the cost of that printing".
