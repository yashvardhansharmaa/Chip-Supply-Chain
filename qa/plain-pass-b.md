# Plain-terms pass B: chapters 10 to 17

Brief: rewrite each "In plain terms" paragraph so a reader with no background follows every sentence on first reading, to the standard of the rewritten chapter 02 paragraph. Same facts and numbers, length within about 20 percent, closing sentence keeps its job, glossary terms kept in the form the popover regex matches, both copies (front matter `plain` and the body paragraph) changed identically.

Result: all eight paragraphs rewritten; none passed the test untouched. `node build/build.js` runs with no warnings, and the `plain` field and body copy match in every file. Glossary matches checked before and after with the build's own regex: no term lost.

## 10 Memory and HBM (108 to 126 words, +17 percent)

Before:

> High bandwidth memory is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. It stacks up to sixteen memory chips into a cube, drills copper wires straight down through them, and sets the cube beside the processor. Stacking is the hard part: each chip is ground down until the copper comes through the back, the cube must stay under a fixed height or it fouls the cooling plate, and one bad layer ruins the rest. Only SK hynix, Samsung and Micron have made it work, and a single line in an American export rule reaches all three.

After:

> High bandwidth memory is where an AI chip keeps the numbers it is working on, and it is built to hand them over fast. A memory maker stacks up to sixteen memory chips into a cube, drills holes straight down through the stack, and fills the holes with copper so that every layer is wired to the ones below. The cube then sits beside the processor. Stacking is the hard part. Each chip is ground so thin that the copper shows through its back, the finished cube has to fit under the plate that cools it, and one bad chip ruins the whole cube. Only SK hynix, Samsung and Micron have made it work, and a single line in an American export rule reaches all three.

What stumbled and what changed: "It stacks up to sixteen memory chips" gave the memory itself as the actor; a memory maker now does the stacking. "Drills copper wires straight down through them" asked the reader to picture drilling a wire; it is now holes drilled through the stack and filled with copper, with the purpose (each layer wired to the ones below) stated. The colon sentence carrying three hard things at once is split, and "fouls the cooling plate" (a plate never introduced) becomes "has to fit under the plate that cools it". Closing sentence unchanged.

## 11 Advanced Packaging (101 to 119 words, +18 percent)

Before:

> Packaging wires finished chips into one component and mounts them on a base built to the tolerances of a chip. A lithography machine can print only a rectangle about the size of a postage stamp in one shot, so a modern accelerator is cut into pieces and stitched back together on a shared slab of silicon, with its memory a few millimetres away. Slab, chips and base all expand at different rates when heated, so the package warps and the joints crack. Getting that right in volume is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan.

After:

> Packaging joins finished chips into one component and mounts them on a base wired almost as finely as the chips themselves. A lithography machine, which prints a chip's circuits, can cover only a rectangle about the size of a postage stamp in one shot, so a modern accelerator cannot be one chip. It is made as several pieces, set side by side on a shared slab of silicon and wired together through it, with the memory a few millimetres away. Slab, chips and base all expand at different rates when heated, so the package can warp and its joints crack. Getting that right in volume is hard enough that nearly every AI accelerator is packaged by TSMC, in Taiwan.

What stumbled and what changed: "A base built to the tolerances of a chip" was an abstraction; it is now a base wired almost as finely as the chips themselves. "A lithography machine" arrived unexplained, so the sentence now says what it does (prints a chip's circuits) before the postage-stamp limit, and the consequence is spelled out in its own clause: the accelerator cannot be one chip. "Cut into pieces and stitched back together" implied a finished chip is sawn up; the pieces are now made separately and wired together through the slab. "The package warps and the joints crack" read as if it always happens; now "can warp". Closing sentence unchanged.

## 12 Substrates and PCBs (103 to 122 words, +18 percent)

Before:

> A package substrate is the adapter between a chip and the circuit board under it. The chip's connections come out finer than a human hair; the board works in millimetres. The substrate is built like plywood: a stiff core of glass cloth and resin, thin sheets of epoxy film pressed onto both faces, holes burned through each sheet by laser, and copper plated into the holes. Every added layer is another hole that can fail. A handful of firms build these substrates, and the film and the glass cloth each come from a single Japanese supplier, so a shortage here stops accelerators shipping.

After:

> A package substrate is the adapter between a chip and the circuit board under it. The chip's connections come out finer than a human hair; the board is wired in millimetres. The substrate is built up like plywood. A stiff core of glass cloth and resin sits in the middle, thin sheets of epoxy film are pressed onto both faces, a laser burns holes through each sheet, and copper is plated into the holes to carry signals from one layer to the next. Every added layer is another set of holes that can fail. A handful of firms build these substrates, and the film and the glass cloth each come from a single Japanese supplier, so a shortage here stops accelerators shipping.

What stumbled and what changed: Closest to passing already. The plywood sentence was a list of five noun phrases held behind a colon; it is now a short claim ("built up like plywood") followed by one sentence in which each layer is put down in order with a verb, and the copper's job (carrying signals between layers) is stated. "Another hole that can fail" became "another set of holes", which is what a layer adds. Opening, hair-versus-millimetres contrast and closing sentence kept.

## 13 Test and Assembly (90 to 106 words, +18 percent)

Before:

> Before a chip can be sold, a machine has to interrogate it and check every answer. Thousands of needles land on pads on the wafer and drive test patterns into each chip; the tester marks the ones that answer wrong, and they never leave. A modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests earlier, hotter and longer than it used to, and two firms, one Japanese and one American, sell most of the machines that do it.

After:

> Before a chip can be sold, a machine has to put questions to it and check every answer. While the chips are still on the wafer, thousands of needles press onto pads on each one, send in signals and read what comes back; the tester marks any chip that answers wrong, and that chip goes no further. A modern accelerator glues together a dozen expensive pieces, and one bad piece throws away all of them. So the industry tests sooner, at higher temperatures and for longer than it used to, and two firms, one Japanese and one American, sell most of the machines that do it.

What stumbled and what changed: "Interrogate" became "put questions to". "Drive test patterns into each chip" was jargon; the needles now press onto pads, send in signals and read what comes back, and the sentence says up front that this happens while the chips are still on the wafer. "They never leave" had no clear referent; the failed chip now "goes no further". "Earlier, hotter and longer" was three adverbs the reader had to unpack; it is now sooner, at higher temperatures and for longer. Closing sentence unchanged.

## 14 Systems and Networking (91 to 102 words, +12 percent)

Before:

> A rack is where finished chips become one machine. Builders bolt each package onto a board, feed it more than a thousand amps, and wire it to seventy-one neighbours so that a training run sees one computer instead of seventy-two. A cluster runs only as fast as its slowest link, and copper carries a signal a few metres at most, so the longer links have to become light. Many firms can bolt racks together. Far fewer can make the lasers that carry the light, and that is where the chain narrows.

After:

> A rack is where finished chips become one machine. Builders bolt each packaged chip onto a board, feed it more than a thousand amps of current, and wire it to seventy-one neighbours, so that a training run sees one computer instead of seventy-two. The linked machines run only as fast as their slowest link, and a copper wire can carry these signals a few metres at most, so the longer links carry them as light through glass fibre instead. Many firms can bolt racks together. Far fewer can make the lasers that produce the light, and that is where the chain narrows.

What stumbled and what changed: "Each package" became "each packaged chip" and "a thousand amps" now says what it is a thousand of (current). "A cluster" appeared without introduction and "the longer links have to become light" needed decoding; the linked machines now run as fast as their slowest link, copper wire carries the signals a few metres, and the longer links carry them as light through glass fibre. "Lasers that carry the light" became "lasers that produce the light", which is what a laser does. Closing job unchanged.

## 15 Data Centres and Power (107 to 124 words, +16 percent)

Before:

> A data centre's job is to feed and cool the machines inside it. The scale has changed: a hair dryer pours about two kilowatts of heat out of a hand-sized nozzle, and one rack of AI chips draws seventy of them in a box the size of a wardrobe, every watt of it turning into heat that has to be carried away in water rather than air. The building is the easy part. Getting the electricity to the door is the hard one, because the transformers, switchgear and turbines that connect a site to the grid come from a few suppliers and are ordered years in advance.

After:

> A data centre's job is to feed electricity to the machines inside it and carry away the heat they give off. The scale has changed. A hair dryer draws about two kilowatts and pours it out of a hand-sized nozzle as heat. One rack of AI chips, a box the size of a wardrobe, draws as much as seventy hair dryers, and every watt of that becomes heat too, more than air can carry away, so water is piped through the rack instead. The building is the easy part. Getting the electricity to the door is the hard one, because the transformers, heavy switches and turbines that connect a site to the grid come from a few suppliers and are ordered years in advance.

What stumbled and what changed: "Feed and cool" now says feed electricity and carry away heat. The 62-word second sentence, which asked the reader to hold the hair dryer, the rack, "seventy of them", the watt-to-heat conversion and water-versus-air all at once, is split into three: what a hair dryer draws, what a rack draws in hair dryers, and why that heat needs water. "Switchgear" became "heavy switches". The building-easy, electricity-hard turn and the closing sentence are kept.

## 16 The Economics of AI Chips (91 to 100 words, +10 percent)

Before:

> A bill of materials is the list of parts inside a product and what each one costs to build. For an AI accelerator, the famous logic chip is the cheap part, about a seventh of the total. The stacked memory beside it is nearly half, and the packaging that wires the two together costs more than the chip. Three firms in the world make that memory and one Taiwanese firm does that packaging, so the costliest parts are also the scarcest, and that is where a government has the most purchase.

After:

> A bill of materials is the list of parts inside a product and what each one costs to build. For an AI accelerator, the processor itself, the chip that does the calculating and carries the famous name, is the cheap part, about a seventh of the total. The stacked memory beside it is nearly half, and the packaging that wires the two together costs more than the chip. Three firms in the world make that memory and one Taiwanese firm does that packaging, so the costliest parts are also the scarcest, and that is where a government's rules bite hardest.

What stumbled and what changed: "The famous logic chip" used a term the reader has not met; it is now the processor itself, the chip that does the calculating and carries the famous name. "Where a government has the most purchase" used purchase to mean leverage in a paragraph about prices, which invites the wrong reading; it is now "where a government's rules bite hardest". Numbers, the seventh, the nearly half, the three firms and the one Taiwanese firm are unchanged.

## 17 Geopolitics (106 to 120 words, +13 percent)

Before:

> An export control is a licence requirement. A government names an item and a buyer, and its own companies then need a licence to ship that item to that buyer; Washington stretches the rule to cover foreign-made goods built with American technology. Few governments can enforce such a rule, because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.

After:

> An export control is a rule that makes a sale need the government's permission. The government names an item and a buyer, and from then on its own companies must hold a licence before they ship that item to that buyer. Washington stretches the rule to cover goods made abroad with American technology. Few governments can use such a rule to much effect, because the machines, software and chemicals that make an advanced chip come from a short list of firms in the United States, the Netherlands, Japan and South Korea. China can copy the simpler machines within a few years. It cannot yet copy the machine that prints the finest circuits, the chemistry that machine needs, or high-bandwidth memory.

What stumbled and what changed: "A licence requirement" defined the term with a second abstraction; the paragraph now opens with what the rule does (a sale needs the government's permission) and then how it works, in one sentence per step instead of a semicolon joining the domestic rule to the foreign-made extension. "Few governments can enforce such a rule" said enforce when the point is effect, so it is now "can use such a rule to much effect". The four countries, the copying claim and the three things China cannot yet copy are unchanged. This chapter has no How it works heading; the second copy sits as a body paragraph and was replaced identically.

