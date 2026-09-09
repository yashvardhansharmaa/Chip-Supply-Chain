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
