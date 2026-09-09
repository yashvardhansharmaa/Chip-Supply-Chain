# Specimen review — packaging group (chapters 11–14)

Reviewed and rebuilt: `hbm-stack`, `cowos-exploded`, `substrate-layers`, `probe-card`.
`node build/build.js` runs clean; all 19 specimens still register.

| specimen | points before | points after | tilt before | tilt after |
|---|---|---|---|---|
| hbm-stack | 99,388 | 73,174 | [0.24, −0.45, 0] | [0.40, −0.68, 0] |
| cowos-exploded | 112,035 | 72,574 | [0.45, −0.60, 0] | [0.66, −0.62, 0] |
| substrate-layers | 87,162 | 51,591 | [0.60, −0.70, 0] | [0.50, −0.64, 0] |
| probe-card | 107,560 | 120,609 | [0.35, −0.60, 0] | [0.46, −0.62, 0] |

A note that applies to all four: the previous versions were drawn with line
densities (`perUnit` 300–520 on outlines only a few hundredths of a unit long)
that were fine on a large flat plate and turned small parts — HBM stacks, logic
dies, needle beds — into solid black. Most of the point-count reduction below is
that ink coming back out, not detail being removed.

---

## 1. `hbm-stack` — chapter 11

### What was wrong

- **It read as a tall slab, not a memory cube.** The explosion pitch was 0.175
  against a drawn die thickness of 0.045: each gap was 2.9 times the thickness of
  the die it sat above, so twelve dies stood 2.2 units tall over a 1-unit
  footprint. The brief asks for gaps of 30–60% of a layer's thickness. This was
  290%.
- **The base die was a thin copper tray at the bottom**, distinguishable only by
  colour. Nothing said "logic die": no floorplan, and it was drawn barely thicker
  than a DRAM die.
- **No molding compound**, although the chapter caption promises it and although
  the mold is the reason the finished part is a cube at all.
- The through-silicon vias ran the full height at a single tone, which put a
  curtain of grey across the whole interior.
- The top view was close to solid black around the rim: twelve `boxEdges` calls
  at `perUnit` 300 put roughly 10,000 points onto the same 4-unit ring.

### What I changed

- **Explosion pitch cut from 0.175 to 0.062** against a die thickness of 0.040 —
  gaps are now 55% of a die's thickness, inside the brief's band. The assembled
  drawing is 0.83 units tall over an 0.99 × 1.08 footprint, so it reads as a cube.
- **Added the molding compound** as a faint shell (tone 0.12 faces, tone 0.30
  edges) enclosing the stack from the base die's top face upward. This does the
  work the caption asks for, and it is what makes the silhouette a cube with dies
  visible inside rather than a pile of plates.
- **Rebuilt the base die**: twice the thickness of a DRAM die, a millimetre wider
  all round (as it is in real cross-sections, with the mold covering the step),
  its own floorplan drawn on top — two wide PHY strips facing the stack and a
  controller block between them — and a copper micro-bump field underneath. The
  step off it is 0.046, wider than the die-to-die gaps, so it reads as a
  different part.
- **TSVs in two tones**: faint (0.15) for the full-height run, brighter (0.55)
  inside each die's own thickness. The vias now read as via segments in silicon
  rather than a curtain.
- **Micro-bumps moved into the gaps** rather than onto the die tops, where they
  were invisible.
- Replaced each die's full wireframe box with one crisp top outline (tone 0.95)
  and a softer bottom one (tone 0.45). Halves the ink and fixes the black rim.
- The DRAM bank floorplan is drawn only on the top die, which is the only one you
  can actually see the face of.

### Proportions checked

11 × 12 mm footprint (to scale), 12 DRAM dies at ~30 µm each, base die ~2× a DRAM
die, 0.72 mm assembled. Thicknesses and gaps are exaggerated about fifteen times,
chosen so the exploded drawing is roughly as tall as it is wide — the caption now
says so and gives the real height.

### Sources

- https://en.wikipedia.org/wiki/High_Bandwidth_Memory — 30 µm die thickness for
  SK hynix HBM3; TSV plus micro-bump interconnect; 1024-bit (HBM3) and 2048-bit
  (HBM4) interfaces. Fetched.
- https://semiconductor.samsung.com/news-events/news/samsung-develops-industry-first-36gb-hbm3e-12h-dram/
  — a 12-high must fit the same height envelope as an 8-high; 7 µm die-to-die
  gap; TC NCF; 36 GB and 1,280 GB/s. Fetched.
- https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/
  — interface widths only; carries no physical dimensions. Fetched.

### Caption

Chapter 11's `specimenCaption` is still accurate and needs no change. If you want
it to match what is now on screen exactly, the last clause could become:

> …through-silicon vias running the full height of the cube, microbumps between
> every layer, and the molding compound drawn as a faint box around the whole
> stack.

---

## 2. `cowos-exploded` — chapter 12

### What was wrong

- **The interposer was more than twice the size it should be, and the wrong
  shape.** It was drawn 85 × 85 mm (7,225 mm²) with the chips clustered in the
  middle and a 20 mm empty margin all round. A real interposer hugs its chips
  with a margin of a millimetre or two, and for a two-die, eight-stack part it is
  a wide oblong, not a square.
- **The gaps between layers were enormous** — 0.30 units between layers 0.05
  thick, on an object 1.8 wide. The result read as five unrelated plates rather
  than one package taken apart.
- **The dies and HBM stacks were solid black.** Twelve layer outlines at
  `perUnit` 240 plus `boxEdges` at 360 inside a box 0.18 × 0.20 units saturates.
- **The interposer was accented only on its edges**, so the chapter's chokepoint
  was the least visible thing in the drawing.
- Nothing showed what an interposer is *for*. There was a TSV dot field but no
  wiring.

### What I changed

- **Re-laid the whole package to Blackwell's geometry**: two 26 × 32 mm dies at
  x = ±13.3 with a die-to-die seam between them; eight 11 × 12 mm HBM stacks in
  two columns of four at x = ±34; an 82 × 53 mm interposer that clears the chips
  by 1.5 mm; a 100 × 72 mm substrate. Chip area on the interposer works out at
  about 2,700 mm², a little over three reticles, which is where Blackwell sits.
- **Gaps cut from 0.30 to 0.075**, about the thickness of the substrate. The
  assembly is now 0.61 tall against 1.54 wide and reads as one object.
- **Drew the interposer's wiring**: a dense bundle of copper traces across the
  die-to-die seam and a fan of traces from each die edge out to each HBM site.
  This is the single most informative addition — it shows why this slab of
  silicon exists.
- **Made the interposer read as copper**, not just outlined in it: its top face
  is now accent at 0.30 alpha, its side band accent at 0.62, thickness raised
  from 0.048 to 0.058.
- **Ringed the substrate with capacitor pads**, which is what the area between
  the interposer shadow and the substrate edge actually carries, and gave the
  substrate its own ball grid at a plausible pitch.
- Cut the die and HBM line densities by a factor of three to five and raised the
  tilt from 0.45 to 0.66 rad, which is what makes the two-die/eight-stack layout
  legible in the first view instead of only from directly above.

### Two things worth flagging

1. **The "3.3× reticle / 2,831 mm²" figure that gets quoted for Blackwell is chip
   area, not interposer area.** The phrasing in TSMC's own coverage is that
   logic, HBM stacks, I/O and other chiplets "can occupy up to 2,831 mm²". Two
   reticle-limited dies plus eight HBM stacks come to about 2,700 mm² of chips
   and need roughly 4,300 mm² of interposer to sit on. If chapter 12's body text
   uses 2,500–2,831 mm² to mean the interposer's own size, that should be
   reworded. I have drawn the interposer at 4,346 mm² and the chips at 2,720 mm²,
   and the caption states the chip figure.
2. **This is drawn as CoWoS-S** — a monolithic silicon interposer with
   through-silicon vias — because the chapter's caption and the specimen brief
   both say TSVs. Blackwell is actually **CoWoS-L**: an RDL interposer with local
   silicon interconnect bridges embedded under the seams, not a single slab of
   silicon (TechInsights' B200 teardown is explicit that this is Nvidia's first
   bridge-based 2.5D part). The drawing is a truthful CoWoS-S and a good generic
   picture of 2.5D, but it is not literally a B200. If you want it literally
   correct I can swap the TSV field for embedded bridge dies under the die-to-die
   seam and under each die/HBM boundary — it is about twenty lines — but the
   chapter caption would have to change with it.

### Sources

- https://www.techinsights.com/blog/nvidia-blackwell-b200-high-performance-interconnect-and-packaging-analysis
  — B200 is two GB100 dies plus eight HBM stacks on CoWoS-L, not CoWoS-S. Seen
  via search summary; the blog itself is gated.
- https://www.tomshardware.com/tech-industry/tsmc-super-carrier-cowos-interposer-gets-bigger-enabling-massive-ai-chips-to-reach-9-reticle-sizes-with-12-hbm4-stacks
  — 3.3× reticle today, 9× and twelve HBM4 stacks by 2027. Search summary.
- https://www.tomshardware.com/tech-industry/semiconductors/tsmcs-details-next-gen-cowos-roadmap-over-14-reticle-packages-and-48x-leap-in-compute-power-expected-by-2029-massive-size-enables-24-hbm5e-stacks-and-additional-memory-bandwidth-jump
  — beyond 14 reticles by 2029. Search summary.
- https://www.nextpcb.com/blog/cowos-packaging-h100-b200 — 2,831 mm² of chip area,
  80 × 80 mm maximum substrate. Search summary.
- https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm —
  TSMC's own CoWoS page returns HTTP 403 to WebFetch. Not read.

### Caption change proposed (chapter 12)

The current caption says "Lid and stiffener at the top". A Blackwell-class package
has no lid: the cold plate touches the bare dies, and only a stiffener frame is
fitted. There is no lid in the drawing either. Suggested replacement:

> Right: a CoWoS package pulled apart. The stiffener frame at the top, then two
> reticle-sized logic dies and eight HBM stacks, microbumps, the silicon
> interposer with its through-silicon vias and the wiring that stitches the two
> dies together and fans out to the memory, C4 bumps, and the organic build-up
> substrate at the bottom.

---

## 3. `substrate-layers` — chapter 13

### What was wrong

- **Nine separated plates of nearly equal thickness, read from the site tilt as a
  grey muddle.** The core was drawn only 2.7× a build-up layer and, seen at an
  angle through eight other plates, was indistinguishable from them. Routing
  polylines on every plate stacked up into noise.
- **The top view was almost solid black at the rim** — nine `boxEdges` on the
  same square.
- **The exploded treatment was wrong for its neighbours.** Chapters 11, 12 and 13
  run consecutively, and all three specimens were exploded stacks of square
  plates. The reader would have seen the same drawing three times.
- Small floating dashes from the corner guide lines sat clear of the object at
  the right-hand side.
- Nothing showed the two things the chapter is actually about: the film, and the
  holes burned through it.

### What I changed

Rebuilt it as **a cutaway** — the brief you gave me says "cut away", and it fixes
all of the above at once.

- A solid 100 × 72 mm board with a quarter removed. The exposed faces carry the
  full section: solder resist, eight build-up layers above and eight below, the
  core between them, with copper traces drawn as discrete dashes in section
  rather than continuous lines, tapered laser-drilled microvias climbing from
  layer to layer (some stacked, some staggered), plated through-hole barrels with
  their capping pads through the core, and a hint of woven glass cloth inside it.
  That is an 8-2-8: eighteen layers of copper.
- **The build-up film is the accent**, not the metal. It is the chokepoint —
  Ajinomoto's film — so the dielectric bands are copper-coloured and the copper
  is drawn in ink. The caption says which is which.
- **The ball grid is drawn as balls**, 40 × 28 flipped hemispheres, so the
  underside is scalloped in silhouette. That single change is what makes the
  object identifiable as a BGA package from any angle.
- The top face carries the interposer's landing shadow, a fine pad field inside
  it and a ring of capacitor pads outside it — the same features as the substrate
  in the chapter-12 drawing, so the two chapters visibly show the same part.
- The outer sawn edges are left plain so the two cut faces are the only busy
  thing in the picture.

### Proportions checked

100 × 72 mm footprint to scale; core 0.8 mm, build-up layers ~40 µm each, PTH
about 1:8 of the core's thickness, microvias tapered. Total real thickness ~1.5 mm;
drawn thickness is exaggerated about twenty times, which the caption states.

### Sources

- https://www.nwengineeringllc.com/article/abf-for-hdi-uhdi-and-substrate-like-pcbs.php
  — ABF is glass-free and used for CPU/GPU substrates; advanced AI GPU substrates
  run fifteen or more ABF layers per side; core thickness 0.8–1.2 mm. Search
  summary.
- https://polymerinnovationblog.com/polymers-in-electronic-packaging-semiconductor-substrates-for-flip-chip/
  — one copper routing layer per build-up pass; BT laminate glass-reinforced core;
  build-up dielectric around 50 µm. Search summary.
- https://www.kla.com/advance/innovation/a-fine-future-ic-substrates-essentials-part-i
  — over 95% of FCBGA packages use ABF substrate. Page itself blocks WebFetch;
  figure taken from the search summary.
- Ibiden's package-substrate page (https://www.ibiden.com/en/product/electronics/package-substrate/)
  and Ajinomoto's ABF page (https://www.ajinomoto.com/innovation/co-creation/abf)
  both return 404. Not read.

### Caption change needed (chapter 13)

The current caption says "pulled apart". The specimen is now a cutaway, so this
must change. Suggested replacement:

> Right: an ABF build-up substrate with a quarter cut away. A glass-cloth-
> reinforced core drilled with plated through-holes in the middle, eight layers of
> build-up film laminated onto each face, each with its own copper wiring and its
> own laser-drilled microvias, the pad field the package lands on above, BGA balls
> underneath. The build-up film is picked out in copper.

If you would rather keep the exploded treatment for consistency with chapters 11
and 12, say so and I will restore it — but I think three exploded stacks in a row
is the weaker outcome.

---

## 4. `probe-card` — chapter 14

### What was wrong

- **The card was smaller than the wafer.** It was drawn at 216 mm across against
  a 300 mm wafer. A probe card is about twelve inches — 305 mm — wider than the
  wafer it works on. This is the single biggest accuracy error in the group.
- **It had a hole through the middle.** That is a cantilever-card feature. A
  vertical or MEMS card is a solid disc with the space transformer and probe head
  hung underneath.
- **No space transformer.** The block under the card was labelled one in the
  comment but drawn as two plain boxes; the part that fans the tester's coarse
  pitch down to the die's pitch was not represented as a ceramic stack.
- **The needle bed was a solid black rectangle** — 180 straight lines at
  `perUnit` 210 inside a region a few tens of pixels across.
- The probe head had no guide plates, which is the defining feature of a vertical
  head.

### What I changed

- **Card diameter 305 mm, solid, wider than the wafer**, with a keying flat on
  the rim.
- **Built the real stack**: stiffener bridge bolted across the top with three
  levelling screws and a central boss (the stiffener sets the datum plane — that
  is why it is there); the PCB; a multi-layer ceramic space transformer beneath
  it with its layer lines and its coarse fan-out pad field; then a probe head of
  an upper and a lower guide plate on four posts.
- **The probes are drawn bowed between the two guide plates**, which is what a
  buckling-beam probe does under overdrive, and drawn in two tones — a faint
  shank and a bright tip where it lands. That is what stopped the bed being a
  black bar: 168 needles at tone 0.38 instead of 180 at 0.8.
- **Tester interface on the card's top face**: three concentric rings of pogo
  pads (72/84/96), a ring of edge fingers and six stiffener bolts. This is now
  the most recognisable thing about the object in the first view, which is why
  the tilt went up from 0.35 to 0.46 rad.
- Chuck reduced from 336 mm to 324 mm so it no longer dwarfs the card, and given
  concentric vacuum grooves.
- The probed site is four dies rather than six, in copper, and the needle array
  sits over exactly those four.

### Proportions checked

12-inch card over a 300 mm wafer; reticle-sized dies; a probe head serving a
2 × 2 block. Real cards for large logic parts carry 4,000–5,000 probes at
80–150 µm pitch and hold every tip within about 25 µm of one plane; the drawing
shows 168 probes because several thousand at this scale is a black rectangle.
The card-to-wafer height is exaggerated — in the prober it is a millimetre or
two — and the caption says so.

### Sources

- https://www.tek.com/en/documents/whitepaper/probe-card-tutorial — PCB materials
  and layer counts (more than 32 signal layers), 1.0 mil TIR planarity, 25–76 µm
  overdrive, 0.7–1.0 mil tip diameters. Fetched.
- https://www.glewengineering.com/tester-prober-interfaces-direct-probe-part-2/ —
  a typical probe card is twelve inches in diameter; a GPU probe card can carry
  4,000 pins over one square inch; the stiffener ring provides the datum and
  mounting points. Search summary.
- https://patents.google.com/patent/US8322020B2/en — space transformer
  construction, multi-layer ceramic. Search summary.
- USPTO 11733267 (probe head with upper and lower guide plates) and 10151775
  (stiffener improving PCB flatness from 500 µm–1 mm to 50–100 µm). Search
  summaries.
- https://www.formfactor.com/products/probe-cards/300mm-probe-cards/ — product
  families only, no construction detail. Fetched.

### Caption

Chapter 14's caption is accurate. If you want it to name what is now visible:

> Right: a probe card over a wafer. A twelve-inch board — wider than the wafer —
> carries the tester's signals through a ceramic space transformer to a probe head
> whose needles land on pads a few tens of micrometres across, all of them within
> microns of the same plane.

---

## Checks

- All four pass the silhouette test in the site-tilt view at the size the site
  renders them (I cropped and enlarged the left panel of each contact sheet to
  700–820 px to judge this, which is roughly the 570 px stage plus margin).
- Three levels of detail in each: bulk surfaces, edges and outlines, and repeated
  small features (micro-bumps and TSVs; capacitor and C4 fields; microvias and
  solder balls; pogo pads and probes).
- No solid-black regions remain. The worst survivors are the HBM stack's rim in
  the top-down view and the probe card's needle bed, both dense grey rather than
  black, and both lighter still on the site because the renderer fades far points.
- No floating debris: the substrate's stray guide-line dashes are gone with the
  exploded treatment; every guide line elsewhere spans a gap between two parts.
- Point counts: 73,174 / 72,574 / 51,591 / 120,609 — all inside 40k–160k.
