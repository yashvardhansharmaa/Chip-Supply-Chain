# Prose pass 4: the Intro page read as one sequence (9 September 2026)

The Intro page (`#/intro`, rendered by `build/modules/walk.js`) now strings all eighteen `plain`
paragraphs together, each preceded by its `bridge`. Until today every `plain` was written to stand
alone at the top of its chapter, so read in a row the eighteen repeated each other. This pass edits
for flow across the sequence. Every `plain` still opens with a self-sufficient sentence, because it
also appears at the top of its own chapter, and every changed `plain` was written back to its twin
in the body so the two stay byte-identical.

Scope: `plain` and `bridge` in `content/*.md`, the body twin of each changed `plain`, and the string
literals in `build/modules/walk.js`. Nothing else was touched. No number, firm, country or claim was
added anywhere; the only new words are connective, and several facts were dropped where a neighbour
already carried them.

---

## 1. The sequence problems found

Read straight down, twice, in the order a reader meets them.

### A. Bridges that said the paragraph before the paragraph did

Ten of the eighteen bridges duplicated a whole clause of the `plain` directly beneath them, so the
reader was told the same thing twice in eight seconds. The worst:

| Ch | Bridge said | `plain` then said |
|---|---|---|
| 04 | "a coating machine spreads a film thinner than a soap bubble across it" | "A coating machine spreads a film thinner than a soap bubble across the wafer" |
| 10 | "the wafer crosses them over months without ever touching the air inside" | "a wafer crosses hundreds of machines over several months without ever touching that air" |
| 11 | "has nowhere to keep its numbers, so memory chips are stacked into a cube" | "keeps the numbers it is working on... stacks up to sixteen memory chips into a cube" |
| 13 | "a circuit board that works in millimetres... an adapter... layered like plywood" | "the adapter... the board works in millimetres... built like plywood" |
| 14 | "a bundle of expensive pieces, and one dead piece throws away the rest, so needles..." | "a dozen expensive pieces, and one bad piece throws away all of them... Needles..." |
| 17 | "what each part of it costs to build" | "what each one costs to build" |
| 18 | "The costliest parts are the scarcest... a licence" | (17's closer) "the costliest parts are also the scarcest"; "a licence requirement" |

Also 02 ("drawn by software rather than by hand" / "No one draws it by hand"), 06 (gave away the
mirror before the paragraph revealed it), 07 ("lay down film and burn away" / "lay down a film...
burn away"), 08 ("measures it and hunts for specks" / "inspects the wafer... a speck of dirt"),
09, 12, 15, 16. Every bridge was rewritten.

### B. Facts explained twice in consecutive paragraphs

- **Glass is opaque to this light.** 05: "the shortest light now in use is absorbed by air and by
  glass, so the machine runs in a vacuum and every lens has to be a mirror." 06: "No glass is
  transparent to the short light now in use, so the plate is not a window but a mirror." The same
  physics, twice, back to back. Fixed by giving 05 the vacuum and 06 the mirror.
- **The four-times reduction.** 05 "projects it, four times smaller" and 06 "shrinks its picture
  four times onto the wafer". Kept in 05, cut from 06.
- **The light-sensitive coating.** 04 defines photoresist in full; 05 then re-specified the wafer as
  "coated in a light-sensitive film". Cut from 05.
- **A thousand steps.** 07 "more than a thousand times over", 08 "in a thousand steps", 09 "about a
  thousand steps in exact order". Three in three paragraphs. Kept in 07, cut from 08 and 09.
- **A few millimetres from the processor.** 11 and 12, consecutive. Kept in 12.
- **Purity as one atom in N.** 03 "pure to about one foreign atom in a hundred billion" and 04
  "clean to about one stray metal atom in a trillion", the same sentence shape twice running. 03
  recast.

### C. Analogies arriving twice

- **Photography.** 04 "Photoresist is photographic film for chips" and 05 "It is photography,
  shrunk". Kept the definition in 04, cut the compression from 05.
- **Thinner or finer than a human hair.** 11 "each chip is ground thinner than a human hair", 13
  "connections come out finer than a human hair", 14 "Needles finer than a hair". Three. Kept 13,
  where the hair-against-millimetres contrast is the paragraph's argument; 11 and 14 now use
  material already in their own chapters.
- **"It is like X" as the second or third sentence.** 01 and 02 back to back. Recast 01.
- **"The size of X."** 12 carried two in three sentences (playing card, postage stamp) and 16 two
  more. Cut the playing card, which was decorative; the postage stamp explains why a die is cut up.

### D. Templates visible only in a row

- **"which is why" / "that is why" as the closing clause** ran in ten of eighteen paragraphs, and
  clustered at 10, 12, 13. Broken at 05, 06, 09, 12, 13.
- **"Only N firms can do it"** at 03, 09, 11, 13, twice with the identical verb phrase "can do it".
  Varied at 11 and 13.
- **"This stage is / This stage turns"** opened both 08 and 15. Both replaced.

### E. A term used before it was introduced, and one used two ways

- 03 never says **wafer**; it says "disc" throughout, and 04 then opens on "the wafer". The
  sequential reader meets the word cold. 03 now names it.
- 12 called the package substrate a **board** ("a board the size of a playing card"), and 13 then
  distinguishes the substrate from "the circuit board under it". Read in sequence the two boards
  collide. 12 now says "base", which is the chapter's own word ("resin base board"), and 13's bridge
  hands that base over.
- 15 ended on "that is where this layer is tight", where "layer" means an industry layer and every
  other use on the page means a layer of a chip. Now "that is where the chain narrows".

### F. One internal contradiction, caught on the second read

01: "a car whose engine, gearbox and wheels each come from a single factory, **with no second
factory anywhere able to make them**" followed immediately by "Most of those objects have **one or
two** credible suppliers". The analogy overstated what the next sentence walked back. Cut.

---

## 2. Every change, before and after

### `plain` paragraphs (twelve changed; 04, 07, 10, 16, 17, 18 untouched)

**01 Introduction and Goals** · 99w to 88w
- before: "It is like building a car whose engine, gearbox and wheels each come from a single factory, with no second factory anywhere able to make them."
- after: "Think of a car whose engine, gearbox and wheels each come from one particular factory."
- why: removes the contradiction in F, and the second consecutive "It is like".

**02 Chip Design, EDA and IP** · 107w to 105w
- before: "It is like drawing the street plan of a city that size, where every road has to be walkable in less than a billionth of a second."
- after: "That is the street plan of a city that size, and every road has to be walkable in less than a billionth of a second."
- why: 01 now carries the only simile of the opening pair; this is stronger as a flat statement.

**03 Silicon and Wafers** · 108w to 108w
- before: "Every chip starts as a mirror-polished disc of silicon 300 millimetres across."
- after: "Every chip starts as a wafer: a mirror-polished disc of silicon 300 millimetres across."
- before: "The silicon has to be pure to about one foreign atom in a hundred billion, and the flatness has to hold right to the edge."
- after: "Fewer than one atom in a hundred billion may be anything but silicon, and the flatness has to hold right to the edge."
- why: names the object the next thirteen paragraphs call a wafer; breaks the sentence shape 04 repeats.

**05 Lithography** · 100w to 80w
- before: "Lithography prints the pattern of a circuit onto the chip. It is photography, shrunk: the machine holds a stencil of one layer up to a lamp and projects it, four times smaller, onto a silicon wafer coated in a light-sensitive film. Finer circuits need shorter wavelengths, and the shortest light now in use is absorbed by air and by glass, so the machine runs in a vacuum and every lens has to be a mirror. Only one company has ever built such a machine, and it is Dutch, which is why export controls on advanced chipmaking run through one firm."
- after: "Lithography prints the pattern of a circuit onto the wafer: the machine holds a stencil of one layer up to a lamp and projects it, four times smaller, onto the silicon. Finer circuits need shorter wavelengths, and the shortest light now in use will not pass through air, so the printing has to happen in a vacuum. Only one company has ever built such a machine, and it is Dutch. Export controls on advanced chipmaking run through that one firm."
- why: hands the glass-and-mirror point to 06, which needs it; drops the second photography analogy
  and the re-specified coating; splits the closer off the "which is why" template. Also fixes
  "onto the chip... onto a silicon wafer" inside one sentence.

**06 Photomasks and Pellicles** · 106w to 95w
- before: "The machine shrinks its picture four times onto the wafer and prints that layer over and over, so one plate shapes millions of chips."
- after: "One plate prints the same layer on wafer after wafer, so it shapes millions of chips."
- before: "Two Japanese firms make almost all of those mirrors, which is why an obscure business almost nobody has heard of can hold up every leading-edge chip in the world."
- after: "Two Japanese firms make almost all of those mirrors. An obscure business almost nobody has heard of can hold up every leading-edge chip in the world."
- why: the four-times reduction now belongs to 05 only; the split lands the point harder than the clause did.

**08 Metrology and Inspection** · 109w to 105w
- before: "This stage is the factory's quality control. Machines build a chip in a thousand steps, and after many of them another machine inspects the wafer: are the lines..."
- after: "Metrology and inspection are the factory's quality control. Between the steps that build a chip, another machine looks the wafer over: are the lines..."
- why: names itself instead of pointing at itself, drops the second "thousand steps" and the
  "This stage is" template it shared with 15.

**09 Transistors and the Front End** · 106w to 107w
- before: "...wrap the gate around all four sides of the channel, which takes about a thousand steps in exact order. Only TSMC, Intel and Samsung can run that sequence, which is why an export rule can name them all."
- after: "...wrap the gate around all four sides of the channel, a sequence that has to run in exact order. Only TSMC, Intel and Samsung can do it, a list short enough for an export rule to name in full."
- why: third "thousand steps" gone; third "which is why" in four paragraphs gone.

**11 Memory and HBM** · 107w to 108w
- before: "...and sits the cube a few millimetres from the processor."
- after: "...and sets the cube beside the processor."
- before: "each chip is ground thinner than a human hair"
- after: "each chip is ground down until the copper comes through the back"
- before: "Only SK hynix, Samsung and Micron can do it"
- after: "Only SK hynix, Samsung and Micron have made it work"
- why: hands "a few millimetres" to 12; drops the first of three hairs, using the chapter's own
  process line ("grind the wafer from behind until the copper comes through"); breaks the
  "can do it" phrase it shared with 03.

**12 Advanced Packaging** · 103w to 101w
- before: "mounts them on a board the size of a playing card, built to the tolerances of a chip"
- after: "mounts them on a base built to the tolerances of a chip"
- before: "Slab, chips and board all expand at different rates"
- after: "Slab, chips and base all expand at different rates"
- before: "Getting that right in volume is why TSMC packages nearly every AI accelerator, in Taiwan."
- after: "Getting that right in volume is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan."
- why: "board" here and "circuit board" in 13 were two different objects under one word; the second
  size-of comparison in three sentences goes; and the "is why" closer goes.

**13 Substrates and PCBs** · 107w to 103w
- before: "Only a handful of firms build these substrates, and the film and the glass cloth each come from a single Japanese supplier, which is why a shortage here stops AI accelerators shipping."
- after: "A handful of firms build these substrates, and the film and the glass cloth each come from a single Japanese supplier, so a shortage here stops accelerators shipping."
- why: fourth "Only N firms" and third "which is why" in four paragraphs.

**14 Test and Assembly** · 100w to 98w
- before: "Needles finer than a hair land on pads on the wafer"
- after: "Thousands of needles land on pads on the wafer"
- why: third hair. "Thousands of needles land on each die while it is still on the wafer" is already
  the chapter's own wafer-sort line, so nothing new enters.

**15 Systems and Networking** · 91w to 91w
- before: "This stage turns finished chips into a machine. It bolts each package onto a board, feeds it more than a thousand amps, and wires it to seventy-one neighbours..."
- after: "A rack is where finished chips become one machine. Builders bolt each package onto a board, feed it more than a thousand amps, and wire it to seventy-one neighbours..."
- before: "...and that is where this layer is tight."
- after: "...and that is where the chain narrows."
- why: drops the "This stage" template, gives the sentence an actor rather than an "It", names the
  rack that 16's bridge picks up, and stops "layer" meaning two things on one page.

### Bridges

All eighteen rewritten. Before and after, in order:

| Ch | Before | After |
|---|---|---|
| 01 | This walk follows one AI chip in order, from the first design file to the powered rack; the paragraph below is the whole chain at once. | Before the stages arrive one at a time, here is the whole chain at once: what an AI chip is and where it comes from. |
| 02 | The chain starts before any material does: the first version of a chip is a blueprint, drawn by software rather than by hand. | The chain starts before any material does, when a company still has nothing but an idea for a processor. |
| 03 | The blueprint is still a file, and a file computes nothing until it is printed onto something: a mirror-polished disc of pure silicon. | Nothing in a file computes; the drawing has to be printed onto something, and that something is a disc of pure silicon. |
| 04 | Before any light touches the wafer, a coating machine spreads a film thinner than a soap bubble across it, and that film records the pattern. | A bare disc records nothing, so before any light reaches it the wafer is coated in a chemical that reacts where the beam lands. |
| 05 | Coated and ready, the wafer goes under a lamp, where a stencil of the circuit is projected down onto the light-sensitive film. | Coated and still blank, the wafer goes to the machine that decides how small the circuit can be. |
| 06 | What the lamp projects is a stencil, and at these wavelengths that stencil cannot be glass at all: it is a mirror. | Look next at the stencil itself, because everything the machine prints is decided by what is written on that one plate. |
| 07 | Printing leaves a pattern in the resist, not a circuit; the machines around it lay down film and burn away whatever the pattern leaves exposed. | A printed pattern is not yet a circuit, and the machines that turn it into one run more often than anything else in the fab. |
| 08 | Every one of those layers can land wrong, so between them the wafer goes to a machine that measures it and hunts for specks. | Every one of those films can land wrong, and wrong is invisible until something goes looking for it. |
| 09 | Measuring only matters because of what the layers are meant to become: in the right order they make transistors, the switches a chip computes with. | Measured and clean, the layers mean nothing on their own; laid in the right order they become switches. |
| 10 | All of those machines sit under one roof, and the wafer crosses them over months without ever touching the air inside. | The designers of the chip own none of these machines; they rent time in someone else's building, and that building is a business of its own. |
| 11 | A finished logic die can compute but has nowhere to keep its numbers, so memory chips are stacked into a cube and set beside it. | A die that computes fast still sits idle if its data arrives slowly, and nothing on the chip itself can fix that. |
| 12 | The die and the memory cube are still separate objects; packaging sets them side by side on one slab of silicon and wires them together. | Logic and memory are still two separate objects, made in different countries, and the next stage exists to close the distance between them. |
| 13 | Underneath the package sits a circuit board that works in millimetres, so an adapter has to bridge the gap: the substrate, layered like plywood. | Everything so far builds upward, and the base under the package now has to carry all of it down to an ordinary board. |
| 14 | Stacked, wired and mounted, the package is now a bundle of expensive pieces, and one dead piece throws away the rest, so needles interrogate each one. | Nothing yet proves that any of it works, and a package this far along is worth too much to guess about. |
| 15 | One good package is still one chip; training runs need many, so each is bolted to a board and wired to its neighbours. | A tested package is still a single chip, and the machine that trains a model is a room full of them acting as one. |
| 16 | Racks like these have to stand somewhere, and that somewhere has to push the electricity in and carry the heat back out in water. | Racks like that have to stand somewhere, and the somewhere has to be built around what they consume. |
| 17 | That is the whole physical chain, from file to powered rack; the next question is what each part of it costs to build. | The physical chain ends at a powered rack, and the next question is which part of it holds the money. |
| 18 | The costliest parts are the scarcest, and scarcity is where a government reaches: a licence on one machine can stop the whole chain. | What is left is not how a chip gets built but who can stop it, and that answer is written into law. |

Each new bridge hands over an object or a state that the next paragraph's first sentence picks up:
an idea for a processor (02), a disc of silicon (03), a coating (04), the machine (05), that one
plate (06), the machines that build (07), something looking (08), switches (09), someone else's
building (10), data arriving (11), two separate objects (12), the base (13), proof that it works
(14), the machine that trains a model (15), the somewhere (16), which part holds the money (17),
the answer written into law (18).

### `build/modules/walk.js`

Only string literals and HTML text; no code, placeholder, class or data attribute touched.

- **Eyebrow.** "Start here · no background needed" to "Start here". The reassurance moved into the
  dek, where it belongs with the rest of what the page is.
- **Dek.** "Each of the eighteen chapters has one paragraph written without jargon. Here they are,
  in order, unedited." to "One plain paragraph from each of the eighteen chapters, in the order a
  chip is made, then what it costs and who controls it. No jargon, no background, one sitting."
  The old dek claimed the paragraphs were unedited, which after this pass is false, and it did not
  say what the page is for or what the last two chapters are doing in a build sequence. The exact
  length sits in the meta line directly beneath, so the dek gives the shape of the commitment
  ("one sitting") rather than repeating the number.
- **First end link.** "The whole chain, eighteen chapters in full" to "All eighteen chapters in
  full", because the closing line one row above already says "That is the chain".
- **Left as they are, having been read against the same standard:** the title "How a GPU is made"
  (plain, concrete, and it matches the document title set in `src/app.js`); the meta line
  "18 paragraphs · 1,801 words · about 8 min", which is already three plain facts and now carries
  the minute count the dek deliberately does not; the labels "Who leads", "Chokepoint" and
  "not scored"; "Read the chapter", which is the clearest thing a link out of a step can say when
  read on its own; and "That is the chain, end to end."

---

## 3. Checks

| Check | Result |
|---|---|
| All eighteen front matters parse | pass |
| `plain` byte-identical to its body twin | pass, 18 of 18 |
| `plain` within 60 to 110 words | pass, range 80 to 108 |
| `bridge` one sentence, 12 to 28 words | pass, range 18 to 26 |
| `bridge` present tense, no digit | pass |
| No em dash or en dash in any `plain` or `bridge` | pass |
| No two consecutive bridges open with the same word | pass |
| Shared five-word runs between a bridge and its own `plain` | one, "an idea for a processor" in 02, which is the intended handover |
| Shared five-word runs between consecutive `plain` paragraphs | none |
| `node build/build.js` | clean, no warnings |
| Source tiers | A 322 · B 22 · **D 0** · unclassified 0, and D 0 on every chapter line |

Site word count fell from 23,581 to 23,527; the eighteen paragraphs on this page from 1,855 to
1,801 words, about eight minutes either way. No number, firm, country, claim or citation was added; six facts already carried
by a neighbouring paragraph were dropped from the paragraph that repeated them.

## 4. The eighteen bridges, final

1. Before the stages arrive one at a time, here is the whole chain at once: what an AI chip is and where it comes from.
2. The chain starts before any material does, when a company still has nothing but an idea for a processor.
3. Nothing in a file computes; the drawing has to be printed onto something, and that something is a disc of pure silicon.
4. A bare disc records nothing, so before any light reaches it the wafer is coated in a chemical that reacts where the beam lands.
5. Coated and still blank, the wafer goes to the machine that decides how small the circuit can be.
6. Look next at the stencil itself, because everything the machine prints is decided by what is written on that one plate.
7. A printed pattern is not yet a circuit, and the machines that turn it into one run more often than anything else in the fab.
8. Every one of those films can land wrong, and wrong is invisible until something goes looking for it.
9. Measured and clean, the layers mean nothing on their own; laid in the right order they become switches.
10. The designers of the chip own none of these machines; they rent time in someone else's building, and that building is a business of its own.
11. A die that computes fast still sits idle if its data arrives slowly, and nothing on the chip itself can fix that.
12. Logic and memory are still two separate objects, made in different countries, and the next stage exists to close the distance between them.
13. Everything so far builds upward, and the base under the package now has to carry all of it down to an ordinary board.
14. Nothing yet proves that any of it works, and a package this far along is worth too much to guess about.
15. A tested package is still a single chip, and the machine that trains a model is a room full of them acting as one.
16. Racks like that have to stand somewhere, and the somewhere has to be built around what they consume.
17. The physical chain ends at a powered rack, and the next question is which part of it holds the money.
18. What is left is not how a chip gets built but who can stop it, and that answer is written into law.

The object handed down the page: the idea, the drawing, the disc, the coating, the machine, the
plate, the printed pattern, the flaw, the switch, the building, the data, the two objects, the base,
the proof, the rack, the site. Then what it costs, then who can stop it.
