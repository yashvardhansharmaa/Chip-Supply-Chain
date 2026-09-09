# Specimen review — systems, data centers, costs, geopolitics

Four specimens checked against the real objects and redesigned: `gpu-baseboard` (ch 15),
`rack` (ch 16), `wafer-cost` (ch 17) and `globe` (the Geopolitics essay). Every file still
registers under its old name and returns `{cloud, spin, tilt, caption}`. `node build/build.js`
runs clean (the one warning, an unplaced `tool-price` figure in lithography, predates this pass).

| specimen | points before | points after | tilt before | tilt after |
|---|---|---|---|---|
| gpu-baseboard | 109,828 | 107,964 | [0.55, -0.6, 0] | [0.55, -0.6, 0] |
| rack | 123,309 | 101,943 | [0.12, -0.65, 0] | [0.12, -0.65, 0] |
| wafer-cost | 97,458 | 70,014 | [0.95, -0.4, 0] | [0.12, -0.62, 0] |
| globe | 98,982 | 90,862 | [0.78, -1.12, 0] | [-0.30, -1.75, 0] |

---

## 1. `gpu-baseboard` — chapter 15, Systems and Networking

### What was wrong

- **Four NVSwitch chips.** The HGX B200 baseboard has **two**, not four, and Nvidia moved them
  to the centre of the board to shorten the traces. Four was the H100 arrangement. This was the
  one hard factual error in the set.
- **The modules were miniature `package` specimens.** Each of the eight carried a substrate, an
  interposer, two logic dies and eight HBM stacks with copper tops. At this scale none of that
  resolved; it read as grey scribble, it duplicated the hero specimen and the chapter's hero, and
  it put copper on eight separate places so the accent said nothing.
- **A picket fence of power stages.** Forty-four regulator blocks plus six connectors ringed the
  whole board, so the silhouette was dominated by its rim rather than by the modules.
- **No module relief.** Frames stood about 0.02 units proud of a 1.94-unit board, so the object
  read as a printed sheet rather than as a populated baseboard.

### What was changed and why

Redrawn from the ServeTheHome photograph of the real board. Eight SXM modules in two rows of
four, **flipped about the centre line so every land-grid array faces inward** (the reason for
the layout: it shortens the run to the switches). Two NVLink switch chips, centred, in copper.
Each module is now what the photograph shows: a bolted retention frame, a bare machined lid
inside it with a brushed finish, eight screws with washers, printed L-shaped corner fiducials on
the board outside the frame, and the land-grid array beside it. Regulator banks were thinned to
thirteen a side and lowered; the high-density connectors moved to the short end with their
differential pairs fanning out across the board; power blades and bulk capacitors sit at the
opposite end. Module height went to 0.066 on a 0.046 board, which is true to a roughly 30 mm
module on a 6 mm board.

Three levels of detail: board surface and frame bulk; frame, lid and connector edges; screws,
fiducials, land-grid dots, brush lines and the pin rows in the connectors.

**On the accent.** The chapter's own argument is that the tightest supply here is a laser
material, not a chip — indium phosphide for the optical modules. Those modules are not on this
board; they plug into the network cards in the host tray. So copper marks the two NVLink switch
chips, which are the part of *this* object with exactly one supplier. If you would rather the
amber point at the lasers, the specimen has to become a GB200 compute tray with its OSFP cages
along the front panel — say the word and I will build that instead, though it then overlaps
heavily with the rack in chapter 16.

### Sources

- https://www.servethehome.com/ingrasys-shows-big-nvidia-nvlink-switch-chips-change-to-the-hgx-b200-b100/
  — two NVLink switch chips, centre of the board, sets of four GPUs flipped either side, PCIe
  retimers near the edge connectors
- https://www.servethehome.com/wp-content/uploads/2024/06/NVIDIA-HGX-B200-Baseboard-4x-GPUs-and-NVLink-Switches.jpg
  — the photograph the module detail is drawn from
- https://www.nvidia.com/en-us/data-center/hgx/ — eight B200 SXM modules, fourth-generation NVSwitch

### Caption

The chapter caption survives as written. One optional edit, to name the count that the amber marks:

> Right: an eight-GPU baseboard. Four accelerator modules per side, the two NVLink switch chips
> in amber down the centre, voltage regulator banks along the long edges, and the high-density
> connectors that carry scale-out traffic off the board.

---

## 2. `rack` — chapter 16, Data Centers and Power

### What was wrong

- **It read as an open crate.** A wire frame with one perforated side panel and trays floating
  inside it. No bezel, no cabinet face.
- **Every tray was over-inked.** A 1U front panel is about ten pixels tall at the size the site
  draws this. The old panels carried two module bays, four cage ports, sixteen switch cages and
  two handles at tone 1, which summed to solid black bands. The tray rhythm — the thing the
  chapter needs — was lost inside them.
- **The switch trays did not read.** Nine copper front panels in the middle of twenty-seven
  identical black bands are invisible.
- **Power shelves at the bottom only,** with no busbar. The chapter's caption promises shelves at
  the top *and* bottom and a vertical busbar at the back. The real rack has both.
- **The spine was forty-four loose vertical lines**, indistinguishable from the side panel's
  perforations.
- **No coolant distribution unit and no hoses**, so the liquid-cooling story stopped at two pipes
  bolted to the outside.

### What was changed and why

Rebuilt to the published dimensions: 600 × 1,068 × 2,236 mm, 48U, about 120 kW. The stack now
runs, from the floor: a 4U coolant distribution unit with two hose ports, three power shelves,
eight compute trays, the nine NVLink switch trays, ten more compute trays, three more power
shelves and a 1U management switch — which is the order in the DGX GB200 NVL72 photographs
(ten compute trays above the switch band, eight below).

Each tray front now carries one idea and no more. Compute: two module bays with a handle bar
and a lamp cluster. Switch: one long port band with eleven cage ticks, on a panel toned
noticeably darker so the nine of them read as a distinct band in the middle of the stack. Power
shelf: six PSU modules with handles, in copper. The whole face sits inside a bezel with a
picture-frame aperture, and the side panels are a border plus a perforation field rather than a
grey wall, so the trays stay visible through them.

The rear is now the cable cartridge: two slabs of dense vertical copper cable with binding bands,
either side of the vertical busbar, plus a clip at every tray. The manifold runs up the near side
with a quick-disconnect at every second tray, and two hoses leave the cabinet at the foot.

**On the accent.** Copper moved from the switch trays to the power path — the six shelves, the
busbar and its clips. Chapter 16's whole argument is that the chips are no longer the long pole
and the electricity is. Putting the accent on the NVLink trays pointed it at chapter 15's story
inside chapter 16's picture.

### Sources

- https://www.sunbirddcim.com/blog/your-data-center-ready-nvidia-gb200-nvl72 — 600 × 1,068 × 2,236 mm, 1.36 t, 120 kW
- https://www.supermicro.com/en/products/system/gpu/48u/srs-gb200-nvl72 — 48U, 18 × 1U compute trays, 9 NVLink switch trays, eight 1U 33 kW power shelves, in-rack CDU
- https://newsletter.semianalysis.com/p/gb200-hardware-architecture-and-component — 18 compute and 9 NVSwitch trays, two Bianca boards per tray, 5,184 copper cables
- https://www.servethehome.com/this-is-the-nvidia-dgx-gb200-nvl72/ — front and top-of-rack photographs (tray order; management switch above three power shelves of six PSUs)
- https://www.servethehome.com/this-is-the-nvidia-dgx-gb200-nvl72/nvidia-dgx-gb200-nvl72-rear/ — rear photograph: full-height cable cartridge, busbar, hoses at the foot

### Caption

The chapter caption is now exactly what is drawn. One optional edit, so the reader knows what the
copper means:

> Right: a liquid-cooled 72-GPU rack. Eighteen compute trays above and below nine NVLink switch
> trays, the NVLink cable cartridge filling the back, and — in amber, because this is the part
> with the queue in front of it — the power shelves at top and bottom and the busbar they feed.
> Cold-plate manifolds run up the side to every tray.

---

## 3. `wafer-cost` — chapter 17, Component Costs

### What was wrong

This is the one specimen I replaced outright rather than refined.

- **It argued against its own chapter.** The chapter's thesis is that the logic die is the cheap
  part and that memory and packaging are the bill. The specimen was a wafer of dies binned by
  yield, which is a picture about *die* cost. The reader was shown the cheap part.
- **A fourth flat wafer.** `boule-and-wafer` (ch 3), `photomask` (ch 6), `probe-card` (ch 14) and
  `die-floorplan` (ch 2) already give the site four disc-and-grid specimens. A fifth had no
  visual work left to do.
- **It vanished edge-on.** The object was 2.0 × 0.035 units. Once a turn the rotating specimen
  became a horizontal hairline.
- **The amber was lost.** One highlighted die in a field of five hundred crossed rectangles.
- **The crosses read as texture, not information.** At site size the failed dies made a uniform
  hatch over the whole disc.

### What it is now

Epoch AI's teardown of what a B200 costs to build, stacked to scale as a square column on a
graduated plinth:

| line | cost | share | how it is drawn |
|---|---|---|---|
| high-bandwidth memory | $2,900 | 46% | copper, twelve DRAM layer lines over a thicker base die, TSVs up the corners |
| advanced packaging (CoWoS-L) | $1,100 | 17% | build-up lines and a via dot field |
| packaging yield loss | $1,000 | 16% | **hollow** — corner posts and a cross on each face, because it ships nothing |
| logic die fabrication | $900 | 14% | floorplan hatching |
| auxiliary (VRM, PCB, test) | $480 | 8% | small component blocks |
| **total** | **$6,380** | | against a $30,000–$40,000 selling price |

The chart apparatus is what stops it reading as a chip: a rule graduated every $500 standing at
one corner, gridline rings crossing the column at every $1,000 with a tick out to the rule, a
leader from every segment boundary, and a squared plinth. Height is strictly proportional to
dollars; the amber is the largest line, as asked.

Three levels of detail: segment bulk; segment boundaries, posts and plinth edges; layer lines,
via dots, hatch, ticks and grid.

### Sources

- https://epoch.ai/data-insights/b200-cost-breakdown — the itemised table (HBM $2,900; advanced packaging $1,100; logic die $900; packaging yield loss $1,000; auxiliary $480; total $6,250, range $5,700–$7,300)
- https://epochai.substack.com/p/nvidias-b200-costs-around-6400-to — the percentage split and the $30–40k selling price

### Caption — this one must change

The chapter's `specimenCaption` still describes a wafer and is now wrong. The `specimen` key
itself does not need touching: the file still registers as `wafer-cost`. Proposed replacement for
`content/17-component-costs.md`:

> Right: what it costs to build one B200, stacked to scale. From the foot: $2,900 of HBM in
> amber, $1,100 of CoWoS packaging, $1,000 of packaging yield loss drawn hollow because it ships
> nothing, $900 of logic die, and $480 of board, power and test. About $6,400 in all, for a part
> that sells for thirty to forty thousand. The rule is graduated every $500.

If you would rather keep the wafer, the alternative is a wafer whose dies are *toned by cost*
rather than binned by yield — but it would still be a picture of the cheapest line on the bill,
and it cannot carry an amber "most expensive component".

---

## 4. `globe` — the Geopolitics essay

### What was wrong

- **The land was hairline outlines on a grey ball.** Continents had no mass, so at site size the
  Earth read as a wireframe rather than as a map.
- **The pins were a hedgehog.** Heights ran to 0.27 units — a quarter of the globe's diameter —
  and were assigned arbitrarily ("varied so neighbouring towns stay separate"), so a reader could
  not tell a tall pin from a short one. Near the limb they projected as free-floating spikes.
- **The first view showed the wrong hemisphere.** Centred at about 18°N 71°E, over the Arabian
  Sea. Taiwan, Korea and Japan sat at 50–76° from centre, foreshortened into the limb, and Taiwan
  was invisible.
- **No Antarctica**, which left the bottom third of the disc empty.
- **The graticule was invisible** at tone 0.13 with meridians every 45°.
- **The site list did not match the brief.** It carried Dresden, San Diego, Beijing, Wuhan and
  Shenzhen and was missing nothing; the list I was given has nineteen names and drops those five.

### What was changed and why

**Land fill.** The coastline rings are now also used as fill polygons. Each ring is unwrapped
across the antimeridian, given a bounding box, and rejection-sampled equal-area in sin(latitude)
at a fixed 6,100 points per steradian; the Black Sea and Caspian rings are subtracted as holes
inside Eurasia. The result is continents as ink mass under a paler ocean, with the coastline
drawn on top. This is the single change that makes the globe read.

**Antarctica**, added as one latitude per meridian (a ring around the pole cannot be tested by
the even-odd rule), with the Ross and Weddell embayments at −78° and the peninsula reaching −63°.

**Graticule** widened to meridians every 30° and parallels every 20°, tone 0.15, with the equator
and prime meridian a step darker.

**Tilt** changed to `[-0.30, -1.75, 0]`. Note that the renderer composes `rotY(tilt.y + spin) ·
rotX(tilt.x)`, so the X tilt is applied *first* and then spun about world Y: a large X tilt makes
a globe tumble rather than rotate, and it also caps how far north the view can be centred
(centre latitude = asin(sin rx · cos ry)). Within that constraint the new tilt puts the first
view at about 3°N 100°E, over the Malacca Strait. Thirteen of the nineteen pins are then within
50° of centre — Taiwan at 30°, Korea at 43°, Japan at 49°, Shanghai at 35°, Bengaluru at 24°,
Abu Dhabi at 49°, and Penang and Singapore dead centre. Europe and the four American sites come
round as it turns; there is no tilt that shows Veldhoven and Hsinchu well at the same time, since
they are 116° of longitude apart and Veldhoven is at 51°N.

**Pins.** Nineteen sites, height `0.055 × chokepoint score` at first, cut to `0.032 × score`
after the first render because the taller pins still read as spikes. Score comes from the chapter
each site anchors:

| site | chapter | score | site | chapter | score |
|---|---|---|---|---|---|
| Veldhoven | 05 lithography | 5 | Shanghai | 10 foundries | 5 |
| Oberkochen | 05 lithography | 5 | Penang | 14 test and assembly | 4 |
| Hsinchu | 10 foundries | 5 | Singapore | 14 test and assembly | 4 |
| Tainan | 10 foundries | 5 | Bengaluru | 02 design and EDA | 4 |
| Kaohsiung | 12 advanced packaging | 5 | Abu Dhabi | 16 data centers and power | 4 |
| Icheon | 11 memory | 5 | Hillsboro | 09 transistors and front end | 5 |
| Pyeongtaek | 11 memory | 5 | Phoenix | 10 foundries | 5 |
| Kumamoto | 10 foundries | 5 | Austin | 02 design and EDA | 4 |
| Yokkaichi | 11 memory | 5 | Boise | 11 memory | 5 |
| Tokyo | 07 deposition and etch | 4 | | | |

Most are fives, which is the chapter's point, so the modulation is a fifth rather than a
dramatic step. Each pin is a stem, a small head and a ring laid flat on the surface at the site,
so a pin still marks a place when its stem is foreshortened to nothing at the centre of the disc.

**Coastline and pin placement checked** by hand: Hsinchu, Tainan and Kaohsiung all land on the
correct side of the Taiwanese coast; Icheon and Pyeongtaek are inland of the Korean west coast;
Kumamoto is inside Kyushu; Yokkaichi and Tokyo are inside Honshu; Abu Dhabi sits on the traced
Gulf coast; Austin and Hillsboro are inland. The Persian Gulf, Red Sea, Baltic and Bohai are all
traced as bays, so the fill leaves them as water.

**Taiwan.** It is about 3.6° of arc long, which at the site's size is roughly a ten-pixel sliver.
It cannot read as a shape. What it can do — and now does — is read as a distinct dark speck off
the Chinese coast with a cluster of three amber pins on it: its fill density and coastline weight
are 2.6× the rest of the map (the Japanese islands are 1.3–1.4×). Anything more would mean
drawing Taiwan larger than it is, which on a geopolitics globe I would not do without being asked.

### Caption

The essay caption lives on the `data-caption` attribute of the geopolitics section in
`src/template.html`. It is still true. If you want it to carry the new pin logic and the full
list:

> The world with the chain's chokepoint sites marked in amber — Veldhoven, Oberkochen, Hsinchu,
> Tainan, Kaohsiung, Icheon, Pyeongtaek, Kumamoto, Yokkaichi, Tokyo, Shanghai, Penang, Singapore,
> Bengaluru, Abu Dhabi, Hillsboro, Phoenix, Austin and Boise — each pin standing in proportion to
> how narrow that town's link in the chain is. The first view looks down on the Malacca Strait.

### Open question

`brief/SPECIMEN_BRIEF.md` lists twenty-four sites, including Dresden, San Diego, Beijing, Wuhan
and Shenzhen. The list I was given for this pass has nineteen and drops those five. I built the
nineteen. Dropping Beijing, Wuhan and Shenzhen does cost the globe its Chinese-substitution
story, which every chapter card carries in `chinaStatus`. Adding them back is three lines in
`SITES` — say which list is canonical.
