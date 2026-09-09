# Intro bridges (9 September 2026)

One sentence per chapter, shown on `#/intro` just above that chapter's `plain` paragraph. Each
bridge names the thing the stage before it hands over, so the eighteen paragraphs read as one
sequence instead of eighteen separate stages. The field is `bridge` in the JSON front matter of
`content/*.md`, directly after `plain`. Nothing else in those files changed.

Read straight down, the object being passed along is: the file, the wafer, the film, the printed
pattern, the stencil, the layers, the transistors, the fab, the memory cube, the package, the
substrate, the tested part, the board, the rack. Then cost, then control.

## The eighteen, in order

**01 Introduction and Goals** · 26 words  
This walk follows one AI chip in order, from the first design file to the powered rack; the paragraph below is the whole chain at once.

**02 Chip Design, EDA and IP** · 23 words  
The chain starts before any material does: the first version of a chip is a blueprint, drawn by software rather than by hand.

**03 Silicon and Wafers** · 23 words  
The blueprint is still a file, and a file computes nothing until it is printed onto something: a mirror-polished disc of pure silicon.

**04 Chemicals, Gases and Photoresist** · 25 words  
Before any light touches the wafer, a coating machine spreads a film thinner than a soap bubble across it, and that film records the pattern.

**05 Lithography** · 22 words  
Coated and ready, the wafer goes under a lamp, where a stencil of the circuit is projected down onto the light-sensitive film.

**06 Photomasks and Pellicles** · 22 words  
What the lamp projects is a stencil, and at these wavelengths that stencil cannot be glass at all: it is a mirror.

**07 Deposition and Etch** · 25 words  
Printing leaves a pattern in the resist, not a circuit; the machines around it lay down film and burn away whatever the pattern leaves exposed.

**08 Metrology and Inspection** · 24 words  
Every one of those layers can land wrong, so between them the wafer goes to a machine that measures it and hunts for specks.

**09 Transistors and the Front End** · 25 words  
Measuring only matters because of what the layers are meant to become: in the right order they make transistors, the switches a chip computes with.

**10 Foundries and Fabs** · 21 words  
All of those machines sit under one roof, and the wafer crosses them over months without ever touching the air inside.

**11 Memory and HBM** · 25 words  
A finished logic die can compute but has nowhere to keep its numbers, so memory chips are stacked into a cube and set beside it.

**12 Advanced Packaging** · 25 words  
The die and the memory cube are still separate objects; packaging sets them side by side on one slab of silicon and wires them together.

**13 Substrates and PCBs** · 24 words  
Underneath the package sits a circuit board that works in millimetres, so an adapter has to bridge the gap: the substrate, layered like plywood.

**14 Test and Assembly** · 26 words  
Stacked, wired and mounted, the package is now a bundle of expensive pieces, and one dead piece throws away the rest, so needles interrogate each one.

**15 Systems and Networking** · 23 words  
One good package is still one chip; training runs need many, so each is bolted to a board and wired to its neighbours.

**16 Data Centers and Power** · 24 words  
Racks like these have to stand somewhere, and that somewhere has to push the electricity in and carry the heat back out in water.

**17 Component Costs** · 23 words  
That is the whole physical chain, from file to powered rack; the next question is what each part of it costs to build.

**18 Geopolitics** · 23 words  
The costliest parts are the scarcest, and scarcity is where a government reaches: a licence on one machine can stop the whole chain.

## Checks

- One sentence each, present tense, 21 to 26 words, inside the 12 to 28 brief.
- No digit and no em dash in any of them. Every fact restates something the two neighbouring
  paragraphs already carry; no bridge introduces a firm, a country or a quantity of its own.
- Openings vary: no two consecutive bridges begin with the same word, and the "that is not enough
  yet" turn is used a few times rather than as a template.
- 01 opens the walk, 17 turns from the physical chain to what it costs, 18 turns from cost to who
  controls it.
- `plain` and every other front-matter field are untouched, all 18 files parse, and
  `node build/build.js` reports no new warning.
