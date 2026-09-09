# CHOKEPOINTS — Specimen brief (3D point-cloud builders)

Each chapter of the site shows a "specimen" beside the text: a point cloud drawn in ink on paper, like a stipple engraving in an old engineering manual. On humanityslastmachine.com these were scans of real robot parts. Ours are procedural: you build each object from primitives with the kit in `src/kit.js`, and the renderer draws it as ~60k to 150k soft dots that slowly rotate as the reader scrolls. The look we want: a technical illustration that is instantly recognisable in silhouette, with enough internal structure (edges, grids, layers, cavities) that it rewards a second look. Not a blob, not a CAD model with every screw.

## How to work

1. Read `src/kit.js` (the whole file; it is short). Every primitive returns a Float32Array with stride 4 (x, y, z, w). `w` in [0,1] is ink alpha; `PC.accent(cloud, a)` turns points copper (used sparingly to mark the part that matters, like the HBM stacks or the reticle).
2. Read `specimens/wafer.js` as the reference example.
3. Write one file per specimen at `specimens/<name>.js`, registering it with `PC.register('<name>', function (p) { ... return { cloud, spin, tilt, caption }; })`. The file must not use `require`, DOM, or anything outside `PC` and plain JS (it is evaluated with `new Function('PC', src)` in Node and inlined into the browser page).
4. Preview it: `node build/preview.js <name>` writes `qa/<name>.png` (three views: the site's initial tilt, front, top). Open the PNG with the Read tool and look at it. Iterate until it reads clearly from the site-tilt view. Budget at least three preview iterations per specimen.
5. Keep each specimen between 40k and 160k points (the preview prints the count). Use `tone` 0.35 to 0.6 for large plain surfaces and 0.9 to 1 for edges, outlines and small features so structure reads on top of bulk. Use `PC.polyline`/`PC.boxEdges`/`PC.circle` for crisp edges on top of surfaces.
6. Proportions matter more than realism. Check the real dimensions (look them up) and keep the ratios right: a 300 mm wafer is 0.775 mm thick; an HBM stack is ~11 x 12 mm and ~0.7 mm tall; a CoWoS interposer for Blackwell is ~2,500 mm² (about 2.5 reticles); an NVL72 rack is ~2.2 m tall.
7. The renderer shows the cloud rotating about the vertical (Y) axis, tilted by `tilt` (radians, applied X then Y then Z). Choose `tilt` so the object is recognisable in the first view (usually a three-quarter view from slightly above: `[0.3-0.5, -0.5-0.8, 0]`). Flat objects (wafer, mask, substrate) need a steeper tilt (`[0.9, -0.5, 0]`). Vertical objects (rack, boule, column) need a shallow one (`[0.15, -0.6, 0]`).
8. `spin` is the idle rotation in radians per second (0.08 to 0.18). Tall objects spin slower.
9. `caption` is one sentence describing what is shown, in plain words, for the caption under the render. Mention any accent-coloured feature.
10. Parameters: specimens receive a `p` object. Only the `package` specimen must honour parameters (see below). Others may ignore `p`.

## Quality bar

- Silhouette test: in the site-tilt view, a reader who has seen the real object should name it in two seconds.
- Structure test: at least three distinct levels of detail (bulk surfaces, edges/outlines, small repeated features such as bumps, TSVs, fins, tools in a rack).
- No floating debris, no overlapping duplicate surfaces that double the ink, no surfaces so dense they turn solid black in the preview.
- Exploded views: when the brief says "exploded", stack the layers with visible gaps (about 30% to 60% of the layer's own thickness), keep them aligned on the vertical axis, and consider thin `PC.line` guide lines from a layer's corners to the layer below so the eye reads the assembly.

## The specimens

Build the ones assigned to you. Each is listed with what the reader is meant to see.

### `package` — an AI accelerator package (parameterised)
Must accept `p.layout` in this shape (mm, centres relative to package centre; `w` along x, `h` along z):
```
{ "interposer": [85, 85],
  "dies": [{"x": -13, "y": 0, "w": 26, "h": 32}, {"x": 13, "y": 0, "w": 26, "h": 32}],
  "hbm": [{"x": -34, "y": 24, "w": 11, "h": 12}, ...],
  "substrate": [110, 110] }
```
Also accept `{ "waferScale": true, "diameterMm": 300, "dieGrid": [12, 7] }` (render a wafer with a die grid and no substrate) and an empty `hbm` array. Default (no params) is the two-die, eight-HBM Blackwell-style layout above. Render: substrate slab (thin, tone 0.4) with a BGA ball grid underneath (`PC.dots` with small spheres or just dots), interposer slab on top (tone 0.5), logic dies as taller boxes (tone 0.7) with their top edges outlined, HBM stacks as boxes with 8 to 12 visible horizontal layer lines on their sides (accent colour on the HBM tops), a stiffener ring around the edge, and a few micro-bump dots between layers if it reads. Tilt ~[0.55, -0.7, 0].

### `die-floorplan` — a GPU die floorplan
A flat rectangular die (~26 x 32 units ratio) seen from above, with a floorplan drawn as outlines: a grid of ~8 x 16 streaming-multiprocessor blocks in the middle, L2 cache strips, HBM PHY strips along both long edges (accent), NVLink/IO blocks along the short edges, and a few thin bus lines. Think of a die shot. Steep tilt [1.0, -0.35, 0].

### `boule-and-wafer` — a Czochralski ingot and a wafer
A vertical cylindrical boule (~300 mm diameter, ~1.5 m long body) with a tapered shoulder at the top, a thin neck, and a small seed crystal above; a conical tail at the bottom; faint horizontal growth striations (`PC.circle` rings, low tone) along the body; a single wafer sliced off and standing/leaning beside it, or a stack of five wafers next to the base. Tilt [0.2, -0.6, 0], spin 0.08.

### `gas-cabinet` — specialty gas supply
A gas cabinet: a tall rectangular enclosure with the front open, holding three gas cylinders of different heights with valves and regulators (small boxes/tori), manifold tubing (`PC.polyline`), and a second, larger horizontal bulk tank (like a liquid-nitrogen or neon dewar) on legs beside it. Accent the valve manifold. Tilt [0.25, -0.7, 0].

### `euv-scanner` — an EUV scanner in cross-section
The reader should see the light path. Left-bottom: source vessel (a box or drum) with a collector mirror (a large concave dish: use `PC.sphere` with `thetaMax`) and a small accent dot for the tin plasma at its focus. Above and right: the illuminator and projection optics as six mirrors (tilted discs or shallow spherical caps) arranged in a zigzag inside a large vacuum frame (`PC.boxEdges` for the frame). Top: the reticle stage (a thin flat plate, accent) above the mirrors; bottom right: the wafer stage (a flat disc) with a wafer on it. Draw the beam as a dotted polyline from plasma to collector to mirrors to reticle to wafer (low tone). It can be schematic; it must show source, mirrors, reticle, wafer. Tilt [0.15, -0.35, 0], spin 0.08.

### `photomask` — an EUV reticle with pellicle
A 6-inch square mask blank (thin square slab, tone 0.4) with a central patterned area (a dense rectangle of fine lines and small blocks; use `PC.dots` and short `PC.line`s, tone 1) surrounded by a border, and a pellicle frame (a thin rectangular frame, accent) standing a little above it on four short posts, with the pellicle membrane as a very sparse plane (tone 0.15). Tilt [0.9, -0.5, 0].

### `process-chamber` — a deposition/etch chamber
A cylindrical vacuum chamber (hollow: `rIn`) with the front quarter cut away so the inside is visible (filter points by angle). Inside: a showerhead disc at the top with a dot grid of holes, a wafer on a pedestal/chuck at the bottom, a sparse `PC.scatter` haze of plasma between them (very low tone, or accent at low alpha), a gas inlet tube on top, a pumping port on the side, and a slit valve on the wall. Tilt [0.3, -0.6, 0].

### `sem-column` — an electron-beam inspection column
A tall vertical column made from stacked cylinders of different radii (electron gun at the top, condenser lenses as wider rings/tori, deflection coils, objective lens at the bottom), a thin dotted beam line down the axis (accent), and a wafer on a stage below with a tiny accent spot where the beam lands. Tilt [0.15, -0.6, 0], spin 0.08.

### `gaa-transistor` — a gate-all-around nanosheet transistor
Three stacked horizontal nanosheets (thin wide boxes, tone 0.9) with gaps between them, a gate block wrapping around all three (a larger box that encloses the sheet stack in the middle third of their length; render it hollow-looking: use `PC.boxEdges` plus faces with tone 0.3), source and drain blocks at both ends (epitaxial mounds: use `PC.box` or `PC.lathe`), a substrate slab below with a shallow trench isolation, and thin metal contacts rising from source/drain/gate (accent). Tilt [0.35, -0.7, 0].

### `foup` — a wafer carrier
A FOUP: a roughly cubic shell (about 36 x 36 x 32 cm) with the front door removed, showing 25 wafers standing vertically in slots (thin discs with `PC.cylinder` r ~ h very small, stepped in Z), a handle on top (a box), and side rails. Accent one wafer. Tilt [0.25, -0.75, 0].

### `hbm-stack` — a 12-high HBM stack, exploded
Twelve thin square DRAM dies stacked with visible gaps, a thicker base (logic) die at the bottom (accent), a `PC.dots` grid of micro-bumps on top of each die, and vertical TSV lines (`PC.line`, low tone) passing through the stack in a few columns. Show the real aspect: ~11 x 12 mm footprint, each die ~0.05 mm thick (exaggerate thickness x4 so it reads, and say so in the caption). Tilt [0.35, -0.7, 0].

### `cowos-exploded` — a CoWoS package pulled apart
From bottom to top with gaps: PCB fragment (optional), substrate slab with BGA dots underneath, C4 bump layer (dots), silicon interposer slab with a fine TSV dot grid, micro-bump layer, then the top layer: two logic dies and eight HBM stacks (reuse the same layout as `package`), and a lid/stiffener frame floating above. Corner guide lines between layers. Accent the interposer. Tilt [0.5, -0.7, 0].

### `substrate-layers` — an ABF build-up substrate, exploded
A stack of about nine thin square layers: a thicker core in the middle (tone 0.5) with through-holes (a sparse dot grid of small circles), and four build-up layers above and below (thin slabs, tone 0.35) each carrying a different routing pattern of thin lines (`PC.polyline`, tone 1) and via dots; solder mask on top with a ball-grid dot field below. Accent one routing layer. Tilt [0.6, -0.7, 0].

### `probe-card` — a probe card over a wafer
A large circular PCB (thin disc, ~30 cm) with a rectangular probe head underneath, hundreds of fine vertical needles (`PC.line`, short) pointing down from the head, a wafer below on a chuck with the die grid, and an accent rectangle on the wafer where the needles land. Tilt [0.35, -0.6, 0].

### `gpu-baseboard` — an eight-GPU baseboard
A rectangular board (thin slab) carrying eight square accelerator packages in two rows of four (each a small version of the package: die + HBM, with a low heatsink block optional), four NVSwitch-style chips in a row between them (accent), connectors along one edge, power delivery blocks, and mounting holes. Keep it clean; no heatsinks bigger than the packages. Tilt [0.55, -0.6, 0].

### `rack` — a liquid-cooled 72-GPU rack
A tall rack frame (`PC.boxEdges`, ~2.2 m tall, 0.6 m wide, 1.2 m deep) with 18 compute trays (thin wide boxes) and 9 switch trays (accent) stacked in the middle, a cable spine at the back (vertical lines), power shelves at the bottom, and a manifold with two vertical coolant pipes down one side. Trays should have a visible front lip (edge line). Tilt [0.12, -0.65, 0], spin 0.07.

### `wafer-cost` — a wafer with dies binned by yield
Reuse the wafer's die grid, but colour the dies by outcome: most dies drawn with tone 0.9 outlines, roughly a fifth marked as failed (a diagonal cross of two `PC.line`s across the die), and a handful of edge dies left empty. Add one large accent die outline in the centre to represent a reticle-limited die. Steep tilt [0.95, -0.4, 0].

### `globe` — the world with chokepoint sites
A sparse sphere (tone 0.25, ~35k points) with continent outlines drawn as denser points along coastlines (approximate coastlines with polylines from a coarse list of lat/lon vertices you write yourself; it does not need to be precise, but Eurasia, the Americas, Africa, Australia and Japan/Taiwan must be recognisable), and accent points with short vertical "pins" at: Veldhoven, Oberkochen, San Diego, Hillsboro, Boise, Phoenix, Austin, Hsinchu, Tainan, Kaohsiung, Icheon, Pyeongtaek, Kumamoto, Yokkaichi, Tokyo, Shanghai, Beijing, Wuhan, Shenzhen, Penang, Singapore, Dresden, Bengaluru, Abu Dhabi. Convert lat/lon to xyz on the sphere (Y up). Tilt so East Asia and Europe are both visible at first: [0.3, 1.9, 0]. Spin 0.06.

## Checklist before you report back

- `node build/preview.js <name>` runs without warnings for every specimen you built.
- You looked at every PNG and would show it to a designer.
- Each file has a caption and a sensible tilt and spin.
- Report: the specimen names, point counts, and one sentence each on what a reader sees; note anything that did not read well and what you did about it.
