# Specimen captions rewrite

Date: 15 September 2026. Scope: the `specimenCaption` field in `content/01-*.md` to `content/17-*.md`. Nothing else in the chapters changed; `node build/build.js` runs with no warnings.

Brief (author): each caption says what the specimen is, its real size with an everyday comparison only where the scale is genuinely notable, one or two things to notice in the render (always naming the amber part), how true to size the render is, and nothing about process beyond naming the thing. 35 to 60 words, no "you", no "we", no em dashes, American spelling, metric with the number first.

Rules applied: every number below comes from the specimen file, the chapter body or a well-known physical fact, listed per chapter. Renders that are not to scale (the exploded HBM stack and CoWoS package, the cut-away substrate, the probe card gap, the chamber gap, the EUV reticle and wafer, the cost column, the globe pins) say so. The AI Chips page keeps the dynamic caption in `specimens/package.js`; the home page uses the chapter 1 die floorplan. The fallback captions inside `specimens/*.js` were left as they were.

Comparisons kept, per the author update: the EUV scanner (bus, 180 metric tons, 40 containers), the ingot (door, three grown men), the nanosheet (atoms, hair), the rack (door, small car, a hundred homes), the HBM die thickness (hair), the wafer (dinner plate, once, in the FOUP caption) and the reticle (small floor tile). The other ten captions state the real size in plain units and stop.

Word counts: 51 to 60 per caption.

## 01-design-and-eda.md

**Old:** The floorplan of a GPU die, one whole reticle field of 26 by 33 mm, the largest patch a scanner can print in a single exposure. 144 compute tiles fill the center in eight clusters, the L2 cache splits them in a band across the middle, the high-bandwidth memory interfaces run along the two long edges, and the amber strip on the short edge is the link to the chiplet next door, a second die in the same package.

**New (56 words):** The floorplan of one GPU die, 26 by 33 mm, drawn to scale. That is one reticle field, the largest patch a scanner can print in one shot. The 144 compute tiles fill the center in eight clusters; the amber strip on the short edge is the link to the second die in the same package.

**Sources:**
- 26 by 33 mm, one reticle field, 144 tiles in eight clusters: `specimens/die-floorplan.js` header and caption (also chapter body, 'The reticle limit')
- 'drawn to scale': the file is drawn in millimeters at 26 x 33

## 02-silicon-and-wafers.md

**Old:** A Czochralski ingot, one crystal pulled whole from molten silicon, and the wafers cut from it. A seed crystal on a 10 mm neck at the top, the crown where the crystal opens out to full diameter, 1.5 m of body ground to a true 300 mm, and the cropped tail. The wafers at its foot are as wide as the ingot: a quarter of a metric ton of one crystal, hung from a neck the width of a finger.

**New (58 words):** A silicon ingot, one crystal pulled whole from a melt, with two wafers sawn from it. It is 2.1 m long, 300 mm across and about 265 kg: taller than a door and about as heavy as three grown men, hanging from a neck about 10 mm wide. Drawn to scale. The wafer on its rim is amber.

**Sources:**
- 2.1 m, about 265 kg, 300 mm, neck about 10 mm: `specimens/boule-and-wafer.js` caption and header
- 'taller than a door': a standard door is about 2 m (well-known)
- 'about as heavy as three grown men': 265 kg over three is 88 kg each, about the average adult male weight in the US (well-known)

## 03-chemicals-gases-and-photoresist.md

**Old:** A specialty gas cabinet beside a bulk liquid cylinder. It shows the purge and process lines, the double-block-and-bleed valve panel that isolates the cylinder before anyone opens it, the pressure gauges, and in amber the point-of-use filter between cylinder and chamber.

**New (52 words):** A specialty gas cabinet with its door off, and a bulk liquid cylinder standing behind it. The cabinet is about 1 m wide and 1.9 m tall and holds three gas cylinders; drawn to scale. The amber panel on the back wall is the valves, regulator and gauges that control the flow.

**Sources:**
- about 1 m wide, 1.9 m tall, three cylinders: `specimens/gas-cabinet.js` header (0.97 x 0.48 x 1.93 m, from a supplier's catalogue)
- amber = the gas panel (regulator, block and bleed valves, gauges): `specimens/gas-cabinet.js` header and caption. Note: the old chapter caption said the amber part was the point-of-use filter; the specimen file says the panel is the copper part, so the new caption follows the file

## 04-lithography.md

**Old:** An extreme ultraviolet scanner in cross-section. Tin plasma source at the bottom left, collector and three illuminator mirrors, the mask, or reticle, held pattern-down at the top, six projection mirrors, the wafer stage at the bottom right, and in copper the 13.5 nm light itself.

**New (59 words):** An extreme ultraviolet scanner cut open along its light path. The machine is the size of a bus, weighs about 180 metric tons and ships in 40 containers. The amber thread is the 13.5 nm light, bouncing mirror to mirror from the tin plasma at bottom left to the wafer; both ends are drawn about twice their true size.

**Sources:**
- 13.5 nm, tin plasma, mirrors, reticle and wafer drawn about twice oversize: `specimens/euv-scanner.js` header and caption; 13.5 nm also in the chapter body
- size of a bus, about 180 metric tons, 40 containers: ASML's own description of its EUV systems (180,000 kg, 40 freight containers, 20 trucks, three cargo planes), as given in the brief; not in the chapter body

## 05-photomasks-and-pellicles.md

**Old:** A six-inch EUV mask, or reticle, with its pellicle dust cover. Low-thermal-expansion glass at the base, the molybdenum and silicon multilayer mirror in copper round the top edge, a tantalum absorber carrying the pattern, and the membrane held 2.5 mm off the surface on four glued pads, far enough that a particle landing on it prints out of focus.

**New (60 words):** An EUV photomask, or reticle, with its pellicle dust cover. The mask is a 152 mm square of glass, 6.35 mm thick, about the size of a small floor tile, drawn to scale. The amber band round the top edge is the mirror coating; in life it is 280 nm thick, so it is drawn far thicker than it is.

**Sources:**
- 152 mm square, 6.35 mm thick, multilayer 280 nm in life and drawn far thicker: `specimens/photomask.js` header and caption
- 'small floor tile': 150 mm is a standard small tile size (well-known); the brief's comparison

## 06-deposition-and-etch.md

**Old:** A plasma process chamber cut in half. Gas enters through the plenum and showerhead at the top, a 300 mm wafer sits below on an electrostatic chuck inside its focus ring, the plasma glows amber between them, the slit valve in the wall is where the wafer goes in and out, and the gate valve and turbopump under the floor hold the vacuum.

**New (54 words):** A plasma etch chamber cut in half. The vessel is 500 mm across inside and holds one 300 mm wafer on the chuck at the bottom. The amber haze above the wafer is the plasma. The gap it fills is drawn about twice its true 30 to 40 mm; the rest is to scale.

**Sources:**
- 500 mm bore, 300 mm wafer, electrode gap drawn about twice its true 30 to 40 mm, plasma in copper: `specimens/process-chamber.js` header

## 07-metrology-and-inspection.md

**Old:** A scanning electron microscope column over a wafer, cut in half, with the electron beam in copper. The electron gun sits at the top under its high-voltage insulator, the condenser and objective lenses are magnets drawn as iron yokes round their coils, then the scan coils, a ring-shaped detector, and the wafer on a precision stage.

**New (52 words):** An electron-beam inspection column standing over a 300 mm wafer, cut in half down its axis. The column is about a meter tall, drawn to scale. The amber line is the electron beam, running from the emitter at the top through the lenses to the spot where it lands on the wafer.

**Sources:**
- about a meter of column over a 300 mm wafer, beam in copper: `specimens/sem-column.js` header. The file states no exaggeration, so the caption says 'drawn to scale'

## 08-transistors-and-front-end.md

**Old:** A gate-all-around nanosheet transistor. Three stacked silicon sheets run from the source at one end to the drain at the other, the gate metal in amber wraps all four sides of each sheet, inner spacers keep that metal from touching the two ends, and the contacts land on top.

**New (59 words):** A gate-all-around transistor, the switch in a 2 nm-class chip, drawn at true proportions. The three silicon sheets are each 6 nm thick and 30 nm wide: a few dozen atoms from top to bottom, and roughly ten thousand times thinner than a human hair. The amber cage is the gate metal wrapping all four sides of each sheet.

**Sources:**
- 6 nm thick, 30 nm wide, three sheets, 2 nm-class, gate in copper: `specimens/gaa-transistor.js` header and caption
- 'a few dozen atoms from top to bottom': silicon atomic planes are spaced 0.14 to 0.27 nm apart, so 6 nm is roughly 22 to 44 planes (well-known crystal constants, lattice 0.543 nm)
- 'roughly ten thousand times thinner than a human hair': a hair is about 50 to 100 micrometers across (well-known); 70,000 nm over 6 nm is about 11,700

## 09-foundries-and-fabs.md

**Old:** A front-opening unified pod, the sealed carrier that moves 25 wafers between tools, barely wider than the 300 mm wafers inside it. Wafers never touch fab air: the FOUP is the cleanroom, and the fab around it is the corridor.

**New (60 words):** A FOUP, the sealed pod that carries 25 wafers between tools. It is 388 by 342 by 332 mm, drawn to scale, and barely bigger than what it holds: the 300 mm wafers inside, each the width of a dinner plate, nearly fill it. The shell is translucent, as the real polycarbonate is. One wafer is picked out in amber.

**Sources:**
- 388 by 342 by 332 mm, 25 wafers, 300 mm, translucent polycarbonate, one wafer in copper: `specimens/foup.js` header and caption
- 'the width of a dinner plate': a dinner plate is 250 to 300 mm (well-known); the brief's comparison

## 10-memory-and-hbm.md

**Old:** A twelve-high HBM stack, pulled apart. A logic chip at the bottom, twelve thinned memory chips above it, copper through-silicon vias running the full height of the cube, microbumps between every layer, and the molding compound as a faint box around the whole stack.

**New (58 words):** A twelve-high HBM stack pulled apart: a logic die at the base, in amber, and twelve memory dies above it. The finished part is 11 by 12 mm and 0.72 mm tall; each memory die is ground to about 30 micrometers, thinner than a human hair. The footprint is to scale; the heights are exaggerated about fifteen times.

**Sources:**
- 11 by 12 mm, 0.72 mm tall, twelve dies about 30 micrometers, base die in copper, heights exaggerated about fifteen times: `specimens/hbm-stack.js` header and caption; the 720 micrometer height is also in the chapter body
- 'thinner than a human hair': hair is about 50 to 100 micrometers (well-known)

## 11-advanced-packaging.md

**Old:** A CoWoS package pulled apart. A stiffener frame at the top, then two reticle-sized logic dies and eight HBM stacks, microbumps, the silicon interposer with its vertical vias and the wiring that stitches the dies together and fans out to the memory, then the larger solder bumps beneath it and the resin build-up substrate at the bottom.

**New (57 words):** A CoWoS package pulled apart: two logic dies and eight HBM stacks on a slab of silicon, the interposer, in amber, which sits on a resin substrate and its ball grid. The chips together cover about 2,700 mm2, a little over three reticle fields. Footprints are to scale; the thicknesses and the gaps between layers are exaggerated.

**Sources:**
- two logic dies, eight HBM stacks, interposer in copper, about 2,700 mm2, a little over three reticles, footprints to scale, thicknesses and gaps exaggerated: `specimens/cowos-exploded.js` header and caption

## 12-substrates-and-pcbs.md

**Old:** An epoxy build-up substrate with a quarter cut away. A glass-cloth core drilled through and plated with copper, eight layers of build-up film pressed onto each face, each with its own copper wiring and laser-drilled holes down to the layer below, landing pads for the chip above and solder balls underneath. The film itself is drawn in copper.

**New (52 words):** A build-up substrate, the board a chip sits on, with a quarter cut away. It is about 100 by 72 mm and 1.5 mm thick, with eighteen copper layers inside. The amber bands are the build-up film between the layers. The footprint is to scale; the thickness is exaggerated about twenty times.

**Sources:**
- about 100 by 72 mm, 1.5 mm thick, eighteen copper layers, film in copper, thickness exaggerated about twenty times: `specimens/substrate-layers.js` header and caption

## 13-test-and-assembly.md

**Old:** A probe card over a wafer. A printed circuit board carries the tester's signals to a micro-machined probe head whose needles land on pads a few tens of micrometers across, all of them within microns of the same plane.

**New (56 words):** A vertical probe card over a wafer. The card is round, about 305 mm across, a little wider than the 300 mm wafer beneath it. Thousands of needles under it land on four dies at once, picked out in amber. The gap between card and wafer is exaggerated; in life it is a millimeter or two.

**Sources:**
- 305 mm card over a 300 mm wafer, thousands of probes, four dies in copper, card-to-wafer gap exaggerated from a millimeter or two: `specimens/probe-card.js` header, constants (card 305 mm) and caption

## 14-systems-and-networking.md

**Old:** An eight-GPU baseboard. Four accelerator modules per side, the two NVLink switch chips in amber down the center, voltage regulator banks along the long edges, and the connectors that carry traffic off the board to the rest of the cluster.

**New (51 words):** An eight-GPU baseboard, the board that carries eight accelerator modules and the switch chips joining them. It is about 510 by 400 mm and drawn to scale, with the module frames standing about 30 mm proud of the board. The two amber squares in the middle are the NVLink switch chips.

**Sources:**
- about 510 by 400 mm, frames about 30 mm proud of the board, vertical relief to scale, switch chips in copper: `specimens/gpu-baseboard.js` comments and caption

## 15-data-centers-and-power.md

**Old:** A liquid-cooled 72-GPU rack. Eighteen compute trays above and below nine NVLink switch trays, the NVLink cable cartridge filling the back, cold-plate manifolds up the side, and in amber the power shelves at top and bottom with the busbar they feed, the part of the machine that waits on the grid.

**New (56 words):** A liquid-cooled rack of 72 GPUs. It is 2.24 m tall, 600 mm wide and about 1.36 metric tons: taller than a door, heavier than a small car, and drawing about 120 kW, roughly what a hundred homes use on average. Drawn to scale. The amber parts are the power shelves and the busbar they feed.

**Sources:**
- 2.24 m (2,236 mm), 600 mm wide, about 1.36 t, about 120 kW, power shelves and busbar in copper: `specimens/rack.js` header and caption. Note: the chapter body cites 142 kW for a GB300 NVL72 (Nvidia); the specimen is drawn from the GB200 NVL72 at about 120 kW, so the caption keeps the drawn object's figure
- 'taller than a door': a door is about 2 m (well-known)
- 'heavier than a small car': small cars weigh about 1.0 to 1.3 t (well-known)
- 'roughly what a hundred homes use on average': the average US household uses about 10,500 to 10,800 kWh a year (EIA), about 1.2 kW on average; 120 kW over 1.2 kW is about 100

## 16-component-costs.md

**Old:** The cost of one B200, stacked to scale from the bottom up: $2,900 of high-bandwidth memory in amber, $1,100 of CoWoS packaging, $1,000 of packaging yield loss drawn hollow because it ships nothing, $900 of logic dies and $480 of substrate, board and test. About $6,400 in all, for a part that sells for $30,000 to $40,000.

**New (60 words):** A chart, not an object: what it costs to build one B200, stacked as a column, each layer as tall as its share. From the foot: $2,900 of memory in amber, $1,100 of packaging, $1,000 of yield loss drawn hollow, $900 of logic dies, $480 of board and test: about $6,400, for a part that sells for $30,000 to $40,000.

**Sources:**
- $2,900, $1,100, $1,000 drawn hollow, $900, $480, about $6,400 ($6,380), memory in copper: `specimens/wafer-cost.js` header (Epoch AI's B200 cost breakdown); the $6,400 and the $30,000 to $40,000 sale price are in the chapter body with the Epoch AI citation

## 17-geopolitics.md

**Old:** The world with the chain's chokepoint sites marked. Veldhoven and Oberkochen for lithography, Hsinchu and Tainan for leading-edge logic, Icheon and Pyeongtaek for high-bandwidth memory, Shanghai and Wuhan for China's substitution effort, and the Gulf and Southeast Asian hubs the finished accelerators now flow through.

**New (54 words):** The world, with nineteen chokepoint towns pinned in amber and five towns building substitutes, Beijing, Wuhan, Shenzhen, Hefei and Dresden, pinned in ink. The taller the amber pin, the narrower that town's link in the chain. The pins are not to scale: at the globe's size the tallest would stand about 1,000 km high.

**Sources:**
- nineteen towns in copper, pin height in proportion to the chokepoint score, five substitute towns in ink (Beijing, Wuhan, Shenzhen, Hefei, Dresden): `specimens/globe.js` SITES, SUBS and caption
- 'about 1,000 km': a score-5 pin is 0.032 x 5 = 0.16 of the globe's radius (`globe.js`, `pin(... 0.032 * s[3] ...)`, RS = 1.0); Earth's mean radius is 6,371 km (well-known), so 0.16 x 6,371 is about 1,020 km

