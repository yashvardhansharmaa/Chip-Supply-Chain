# Specimen review — silicon set

Five specimens checked against the real objects and rebuilt: `wafer`, `boule-and-wafer`,
`die-floorplan`, `gaa-transistor`, `foup`. Before renders are in `qa/before/`; after renders are
`qa/<name>.png`. `node build/build.js` runs clean and all 19 specimens register.

| specimen | points before | points after | tilt | spin |
|---|---|---|---|---|
| wafer | 103,456 | 113,615 | [0.92, -0.50, 0] | 0.10 |
| boule-and-wafer | 58,790 | 49,597 | [0.16, -0.62, 0] | 0.075 |
| die-floorplan | 64,006 | 110,875 | [1.02, -0.32, 0] | 0.11 |
| gaa-transistor | 104,139 | 78,612 | [0.52, -0.76, 0] | 0.12 |
| foup | 97,187 | 135,671 | [0.24, -0.72, 0] | 0.11 |

Two techniques were introduced and are worth reusing on the other specimens.

**Meridian hatching for round solids.** A point cloud cannot be lit, because the near and far
surfaces of a cylinder both draw and their shading cancels exactly (a point at azimuth θ pairs with
one at θ+π, and the two tones sum to a constant). Hatching a surface of revolution with N evenly
spaced meridians solves it: the lines crowd toward the silhouette and open out in the middle, which
is how an engraver draws a cylinder, and because the set is invariant under rotation by 2π/N it
looks identical from every angle as the specimen spins. Used on the boule's body, crown and tail.

**Continuous streets rather than per-cell rectangles.** The old wafer drew each die as a closed
rectangle, so every shared edge was inked twice and the grid read as noise. Drawing the scribe
streets as continuous lines clipped to the exclusion circle is cheaper, correct (a wafer really is
ruled by continuous streets with partial fields at the edge), and gives a second, lighter line
weight for the per-die seal rings.

---

## `wafer` — a 300 mm wafer (kit reference example)

### What was wrong

1. The face was a flat, uniform speckle at tone 0.55, which read as sandpaper. A polished wafer is
   a mirror; the one visual fact everyone knows about it was missing.
2. The die grid was drawn as 99 closed rectangles. Shared edges were inked twice, the grid was
   fainter than the surface noise, and it did not reach the wafer edge the way a real exposure grid
   does.
3. The notch was a circular bite of radius 0.06 R — that is 9 mm deep on a 300 mm wafer. SEMI M1
   specifies 1 mm deep with a 90° included angle. It read as damage rather than a datum.
4. No edge exclusion ring, no edge-bead ring, no bevel: the three features that make the rim of a
   wafer look like a wafer rather than a coin.
5. Thickness was 0.035 R = 5.25 mm, about seven times life size.
6. Two accent dies, which reads as decoration rather than as a fact.

### What changed and why

- The front face is shaded: a broad specular band across the disc plus slight rim darkening, tone
  ranging 0.115–0.48. Subtle enough that the grid still dominates, strong enough that the disc reads
  as polished. The band is a function of position in the wafer's own plane, so it turns with the
  wafer, which is what a highlight on a mirror does.
- Scribe streets are continuous lines clipped to the edge-exclusion circle, at tone 1; seal rings
  inside each whole field at tone 0.62 give the second line weight. Field size is one full reticle,
  26 × 33 mm = 0.173 × 0.220 units, so 71 whole fields fall inside the exclusion ring — the caption
  now counts them from the geometry rather than asserting a number.
- The notch is a true 90° V, cut out of the disc and outlined top and bottom with its two walls
  drawn. Depth is 6 × life size (6 mm rather than 1 mm) because at 1 mm it is 1.6 px on a 570 px
  canvas; the exaggeration is stated in the caption.
- Added: edge-exclusion ring at 3 mm in, edge-bead ring at 1.9 mm in, a lathed bevel at the apex,
  and a sparse back face. Thickness cut to 0.012 R ≈ 1.8 mm, a 2.3× exaggeration, noted in the file
  header.
- One accent field instead of two, filled at low alpha with a hint of its own floorplan inside it,
  because the point being made is "this is one exposure, and it is the largest thing a scanner can
  print at once".

### Sources

- https://en.wikipedia.org/wiki/Wafer_(electronics) — 300 mm, 775 µm thick, 125 g, notch (not a
  flat) on 200 mm and above.
- SEMI M1 notch geometry (1 mm depth, 90° included angle) and ~3 mm edge exclusion: standard
  practice figures, cross-checked against the wafer article above.

### Caption

The specimen's own caption is rewritten and self-counting. No chapter caption to change — see the
routing note at the end.

---

## `boule-and-wafer` — a Czochralski ingot (chapter 03)

### What was wrong

1. It read as an artillery shell. Body, crown and tail were all smooth tapers of similar length with
   no hard break between them.
2. The body carried both dense horizontal striation rings and four vertical facet lines, which
   crossed into a fishnet and made a 300 kg crystal look like a wireframe.
3. The body was 36,000 points at tone 0.23 on a shell; front and back overdrew into a near-solid
   dark tube. The top view was a solid black blob.
4. The seed assembly was a 135 mm-wide clamp box on a 26 mm neck — a crossbar shape that read as a
   hammer. Real necks are 3–6 mm across, and that thinness is the most striking fact about the
   process.
5. The wafers at the foot were a stack of seven at 24 mm pitch, which projected into a single dark
   puck.

### What changed and why

- Proportions restated: 1.5 m of 300 mm body, a 0.35 m crown, a 0.26 m cropped tail = 2.11 m of
  crystal, hung from a 10 mm neck. A 300 mm × 2 m cylinder of silicon at 2.33 g/cm³ is 330 kg, so
  ~265 kg for a real boule with its tapers is consistent, and that is the figure in the caption.
- Meridian hatching (30 meridians) replaces the tonal shading on tail, body and crown; bulk stipple
  dropped to tone 0.16–0.19. Ink is now roughly a third of what it was and the cylinder reads as a
  cylinder from any angle.
- Crown and tail made distinguishable: the crown is a long ogive tapering to a point, and four of
  its meridians are drawn heavy because those are the facet ridges of a `<100>` crystal, plainly
  visible on an as-grown crown. The tail is shorter, blunter, and ends in a 76 mm flat with a hard
  circle — the crop cut. A crown radius 3% proud of the ground body, with two hard rings at the
  junction, gives the shoulder a visible step.
- Striations cut from 15 rings to 10, at tone 0.28, so they read as growth banding and not as mesh.
- Seed hardware shrunk to a 10 mm neck, a 15 mm square seed and a 52 mm chuck; the pull rod was
  dropped so the crystal is 86% of the drawing's height.
- The wafer stack was replaced with two wafers in two clearly different orientations — one standing
  on its rim in copper, one lying flat — which stay legible from every angle as the specimen turns.
  A row of parallel wafers was tried first and always collapsed into a clump at some rotation.

### Sources

- https://www.researchgate.net/figure/A-single-crystal-of-silicon-300-mm-in-diameter-2-m-long-and-weighing-265-kg-drawn_fig3_8971873
  — 300 mm diameter, 2 m long, 265 kg.
- https://en.wikipedia.org/wiki/Czochralski_method — process, neck and shoulder sequence.
- https://commons.wikimedia.org/wiki/File:Monokristalines_Silizium_f%C3%BCr_die_Waferherstellung.jpg
  — photograph of a crown: used for the crown-height-to-diameter ratio, the facet ridges, the sharp
  shoulder where the as-grown crown meets the ground body, and the ground body's matte finish.

### Proposed caption change (chapter 03)

Current: "Right: a Czochralski ingot and a 300 mm wafer. Seed crystal and narrow neck at the top,
the shoulder where the crystal opens out to full diameter, the cylindrical body, and a polished
wafer sliced from that body."

Proposed: "Right: a Czochralski ingot and the wafers cut from it. A seed crystal on a neck about
10 mm across at the top, the crown where the crystal opens out to full diameter, 1.5 m of ground
300 mm body, and the cropped tail. The wafers at its foot are exactly as wide as the ingot: a
quarter of a tonne of one crystal, hanging from a thread."

---

## `die-floorplan` — a GPU die floorplan (chapter 02)

### What was wrong

1. The compute blocks were small rounded rectangles with internal noise, evenly tiled across the
   whole die. It read as a keyboard, not as a floorplan: no cache band, no cluster grouping, no
   distinction between compute and I/O.
2. Nothing showed the die-to-die interface, so nothing in the picture explained why a two-die part
   exists — which is the reticle-limit point the chapter turns on.
3. HBM PHY strips ran the full length of the long edges and overlapped the I/O strips at the
   corners, producing two black corners.
4. The die was near-square on screen rather than 26 × 33.
5. Side faces at n=5200, tone 0.30 made the edge-on view a solid black bar.

### What changed and why

Rebuilt to Nvidia's published GH100 block diagram, which is the only annotated leading-edge GPU
floorplan in the open literature, at 26 × 33 mm — one full reticle field:

- 144 SM tiles in 8 GPCs (4 above the cache band, 4 below, 18 tiles each, 3 × 6 per cluster). At
  this size each tile is ~1.6 × 1.7 mm ≈ 2.7 mm², which is the right order for a real SM on an
  814 mm² die with 144 of them.
- L2 split into two partitions in a band across the middle with the crossbar between them, filled
  with fine bank lines; short lines run from the cache out to the memory controllers.
- Twelve memory controllers with their HBM PHYs down the two long edges, six a side, two per HBM
  stack, three stacks a side. The PHY blocks carry eight repeated lane lines each — the third level
  of detail.
- PCI Express host interface and the scheduler strip across one short edge, with nine NVLink ports
  inside them.
- The other short edge carries the die-to-die interface: a strip of 24 fine bump columns, in copper,
  with a 2.3 mm sliver of the neighbouring die and its own matching strip beyond a 0.35 mm gap.
- PHY columns now stop 2 mm short of the I/O strips, which removes the black corners. Side faces cut
  to n=2600 at tone 0.22.

**Note on the Blackwell orientation.** Nvidia's Blackwell Ultra package render shows the two dies
joined along a vertical seam, with four HBM stacks above and four below; the combined die block
measures about 1.5:1 in that image, consistent with two 26 × 33 dies joined along their 33 mm
edges (52 × 33). On that reading Blackwell's HBM PHYs sit on the *short* edges and NV-HBI on a
*long* edge — the opposite of what this specimen draws. I built the Hopper arrangement instead
because it is the published, annotated one, because the H100 package photo shows three HBM stacks
per side (33 mm of edge, so a long edge), and because it is what the existing chapter caption
already describes. If you would rather the specimen be specifically Blackwell, the change is to
swap the PHY strips onto the z = ±16.5 edges and put the D2D on x = -13.

**Note on the accent.** `brief/SPECIMEN_BRIEF.md` says to accent the HBM PHY strips. I accented the
die-to-die interface instead, on the rule that amber marks the chapter's own chokepoint: chapter 02
is about design and the reticle limit, HBM is chapter 11's subject, and using amber for HBM here
would teach the reader that amber means HBM. One-line revert if you disagree: move the
`PC.accent(...)` calls from the D2D block to the PHY block.

### Sources

- https://www.hwcooling.net/en/nvidia-hopper-gpu-architecture-revealed-4nm-die-18432-shaders/ and
  its GH100 block diagram
  https://www.hwcooling.net/wp-content/uploads/2022/03/Sch%C3%A9ma-GPU-Nvidia-GH100.png — GPC/TPC/SM
  counts, the split L2 band, memory controllers on the two long edges, PCIe on one short edge,
  high-speed hub and 18 NVLink blocks on the other. GH100: 814 mm², 80 B transistors, 144 SMs,
  60 MB L2, 6144-bit HBM3.
- H100 SXM package render
  https://www.hwcooling.net/wp-content/uploads/2022/03/Ilustrace-%C4%8Dipu-Nvidia-GH100.jpg — three
  HBM stacks above and three below the die.
- https://developer.nvidia.com/blog/inside-nvidia-blackwell-ultra-the-chip-powering-the-ai-factory-era/
  and its package render
  https://developer-blogs.nvidia.com/wp-content/uploads/2025/08/Blackwell-Ultra-1024x576-png.webp —
  two dies, vertical seam, 4 + 4 HBM stacks.
- https://www.techinsights.com/blog/nvidia-blackwell-b200-processor-floorplan-analysis — GB102-A01,
  208 B transistors. The floorplan detail is paywalled; only the headline figures were used.
- https://www.theregister.com/2024/03/18/nvidia_turns_up_the_ai/ — NV-HBI at 10 TB/s, dual-reticle
  design on TSMC 4NP, eight HBM3e stacks, four L2 partitions.

### Proposed caption change (chapter 02)

Current: "Right: the floorplan of a GPU die. Replicated compute tiles fill the centre, SRAM banks
sit between them, HBM PHYs run along the two long edges, and the die-to-die interface faces the
neighbouring chiplet."

Proposed: "Right: the floorplan of a GPU die — one whole reticle field, 26 by 33 mm. 144 compute
tiles fill the centre in eight clusters, the L2 cache splits them in a band across the middle, HBM
PHYs run along the two long edges, and the copper strip on the short edge is the die-to-die
interface, facing the sliver of the neighbouring chiplet beyond it."

---

## `gaa-transistor` — a gate-all-around nanosheet transistor (chapter 09)

### What was wrong

This one failed the silhouette test outright: it was a jumble of overlapping wireframe boxes with
heavy dark bars crossing the sheets, and no reading of "gate wrapped around a channel" at any angle.

1. Amber was spread over four separate contact blocks, so it marked nothing.
2. The source/drain epitaxy was drawn as large trapezoidal masses that dominated the frame.
3. Nothing showed the gate metal *between* the sheets, which is the entire point of the
   architecture.
4. No stated dimensions, so the sheet aspect ratio was arbitrary.

### What changed and why

Rebuilt in nanometres at published 2 nm-class dimensions: sheet thickness 6 nm, width 30 nm, length
28 nm; three sheets 10 nm apart; gate length 15 nm; 5 nm inner spacers; source-and-drain epitaxy
sized so the gate centre to epi edge is 24 nm, i.e. a 48 nm contacted gate pitch. Width-to-thickness
is 5:1, which is the ratio that says "ribbon, not wire".

- The gate is the only copper, and it is drawn as a cage rather than a solid: a strong wireframe box
  plus four accent bands on the front and back faces, one for each gap of metal (below the bottom
  sheet, between sheets 1–2 and 2–3, above the top sheet), plus thin walls just outside the sheet
  edges for the metal that wraps them sideways. The alternation of amber bands and ink sheets inside
  an amber box is what makes "all around" legible; the sheets stay visible through it because the
  gate has no solid faces.
- The three sheets carry the heaviest edges in the drawing (perUnit 15, tone 0.95) plus a denser top
  face and three lengthwise rules, so each reads as a plate rather than a wire box.
- Inner spacers are now only where they belong — 5 nm blocks in each inter-sheet gap at both ends of
  the gate, keeping the metal off the epitaxy — and the tall low-k spacer walls that were cluttering
  the top were removed.
- Epitaxy is a chamfered octagonal prism (extruded at 1/100 scale, then scaled up, to keep the point
  count sane) at tone 0.20 with alternating heavy and light vertical edges, so it reads as a faceted
  crystal block without competing with the sheets.
- Substrate and bottom dielectric isolation compressed to thin slabs at tone 0.09/0.16; contacts
  shortened to 8 mm-equivalent blocks. The device is now most of the frame instead of half of it.
- Tilt raised from [0.35, -0.70, 0] to [0.52, -0.76, 0] so the sheets show their top faces.

### Sources

- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9146649/ (vertically stacked GAA nanosheet and
  nanowire scaling beyond 5 nm) — sheet thickness 3–8 nm, width 6–60 nm, vertical spacing 8–20 nm
  with a 7–8 nm floor set by gate oxide and metal thickness; nanosheet length 16–34 nm (typ. 25),
  end portions (inner spacers) 3–7 nm.
- https://en.wikipedia.org/wiki/Multigate_device — sheet widths 8–50 nm, up to 7 sheets
  demonstrated, width and count as the two knobs for drive strength.
- https://www.imec-int.com/en/press/imec-reports-first-electrical-demonstration-integrated-forksheet-devices-extend-nanosheets
  — short-channel control comparable to GAA nanosheet down to 22 nm gate length.
- https://www.nature.com/articles/s41928-024-01320-y — TSMC N2 as a nanosheet platform, 1.15×
  density and 15% speed over N3.

### Caption

The existing chapter 09 caption already matches what is drawn. The only change worth making is to
name the copper explicitly. Proposed: "Right: a gate-all-around nanosheet transistor. Three stacked
silicon sheets run source to drain, the gate metal in copper wraps all four sides of each sheet,
inner spacers isolate the gate from the source and drain epitaxy, and the contacts land on top."

---

## `foup` — a 300 mm wafer carrier (chapter 10)

### What was wrong

1. Dimensions were wrong in the wrong direction: 380 × 340 × 390 mm with the depth greater than the
   width. A real 300 mm FOUP is 388 wide × 342 deep × 332 tall, wider than it is deep.
2. The wafers were drawn as rim circles only, with a 300-point disc each. Twenty-five bare rings
   inside a translucent box read as a coil of wire.
3. The robotic flange was a plain box hat; there was no door, no latch keys, no registration bosses,
   no hand grips, no base plate, no wafer teeth.
4. There was one real geometry bug in the rebuild that is worth recording because it is easy to
   repeat: a helper built rectangles from `[x, y, 0]` points (already in the XY plane) and then also
   applied `rot: [π/2, 0, 0]`, which laid the door's outline flat and threw a 300 mm spike out of
   the side of the pod. Points built in XY need no rotation; only `PC.plane` (which builds in XZ)
   does.

### What changed and why

- Rebuilt to the real envelope: 388 × 342 × 332 mm shell, 420 mm across the hand grips, 25 slots at
  10 mm pitch with the first wafer 44 mm above the base datum, so the stack occupies 240 mm of the
  332. The proportion that carries the chapter is that a 300 mm wafer is 300 of the 342 mm of depth:
  the box is barely bigger than what it holds.
- The shell is a rounded-rectangle extrusion (built at 1/1000 scale and scaled up so the point count
  stays controllable), drawn translucent as the real polycarbonate is, with hard rings top and
  bottom and four corner posts.
- Wafers: sparse disc plus a crisp rim each, so 25 of them read as a stack of stripes rather than a
  coil, with the moulded comb of support teeth on both side walls at every slot.
- Added from the Entegris A300 photographs: the front door with its two latch-key ports, two round
  registration bosses and two moulded ribs; the robotic flange as a pedestal, a plate, a central
  boss and four bolt pads; two hand grips with finger ribs; the projecting base plate with three
  kinematic coupling pads underneath; ribs across the roof.
- One wafer in copper, filled rather than outlined so it reads as a wafer and not as a line.

### Sources

- https://www.epak.com/products/efoup-wafer-handling/ — 420 × 342 × 338 mm with handle, 388 × 342 ×
  332 mm without, 5.4 kg empty, 25 slots, 10 mm ± 0.5 non-cumulative pitch, first wafer 44 mm from
  the horizontal datum plane, three-point kinematic coupling per SEMI E57, SEMI E84 carrier handoff.
- https://store-us.semi.org/products/e04701-semi-e47-1-mechanical-specification-for-foups-used-to-transport-and-store-300-mm-wafers
  — SEMI E47.1 is the governing mechanical specification (abstract only; the standard is paywalled).
- https://www.entegris.com/shop/en/USD/products/wafer-handling/wafer-processing/300-mm-front-opening-unified-pods-(foups)/A300-FOUPs/p/A300FOUPs
  — A300 product photographs, used for the shell's rounded corners and projecting base plate, the
  small square robotic flange with its central boss standing off the roof, the shape and position
  of the side grips, the door's two latch-key slots and two registration bosses, and the comb of 25
  slot teeth on the side walls.
- SEMI E57 (kinematic couplings) and SEMI E62, referenced via the search results above.

### Proposed caption change (chapter 10)

Current: "Right: a front-opening unified pod, the sealed carrier that moves 25 wafers between tools.
Wafers never touch fab air; the FOUP is the cleanroom."

Proposed: "Right: a front-opening unified pod, 388 by 342 by 332 mm, the sealed carrier that moves
25 wafers between tools. It is barely wider than the 300 mm wafers stacked inside it. Wafers never
touch fab air; the FOUP is the cleanroom, and the fab around it is only the corridor."

---

## Routing note: the `wafer` specimen is not on any page

`grep '"specimen"' content/*.md` shows chapter 01 uses `package`, and `src/template.html` uses
`package` for both the hero and the landscape view. Nothing references `wafer`; it appears only as
the fallback default in `build/build.js:275` and in the placeholder chapter markup at
`build/build.js:295`. It is also the kit's reference example, so it is worth keeping and worth being
the best-looking one — but if the intent was for the first thing a visitor sees to be a wafer rather
than a package, that is a one-word change in `src/template.html`, not in these files. I did not touch
either file.

## Checks

- All five pass the silhouette test in the site-tilt panel at thumbnail size (checked on a
  five-across contact sheet at 62% scale, roughly phone size).
- Three levels of detail each: bulk stipple / block or edge outlines / small repeated features
  (seal rings, PHY lanes, SM sub-rows, growth striations, slot teeth, micro-bump columns).
- No solid-black regions in any site-tilt view; no floating debris; no duplicated coincident
  surfaces.
- Point counts 49.6k–135.7k, inside the 40k–160k budget. The site drops `PC.density` to 0.55 on
  narrow screens and 0.85 on retina, so these are worst-case numbers; the previews are drawn at
  density 1 without the shader's depth fade, which makes them slightly darker than the site.
- `node build/preview.js <name>` runs warning-free for all five; `node build/build.js` completes
  with no errors and lists all 19 specimens.
