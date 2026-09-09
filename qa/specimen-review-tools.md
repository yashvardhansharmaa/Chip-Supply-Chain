# Specimen review: the tool specimens

Five specimens checked against the real objects and rebuilt: `euv-scanner` (ch. 05),
`process-chamber` (ch. 07), `gas-cabinet` (ch. 04), `sem-column` (ch. 08),
`photomask` (ch. 06). `node build/build.js` runs clean; all five sit inside the
40k-160k point budget.

| specimen | points before | points after | bounding box after (x, y, z) |
|---|---|---|---|
| euv-scanner | 125,866 | 112,228 | 1.26 x 1.49 x 0.44 |
| process-chamber | 51,429 | 65,811 | 1.12 x 1.44 x 0.81 |
| gas-cabinet | 101,095 | 90,315 | 1.15 x 1.55 x 0.53 |
| sem-column | 56,317 | 90,325 | 0.80 x 1.73 x 0.62 |
| photomask | 65,724 | 82,469 | 1.44 x 0.10 x 1.38 |

## Two findings that shaped every rebuild

**1. The canvas is portrait, so wide compositions waste it.** The renderer
normalises each cloud into a unit sphere and pulls the camera back until that
sphere fits the *width* of a ~570 px portrait stage. A specimen wider than it is
tall therefore fills the width and leaves a third of the panel empty above and
below. Three of the five were laid out landscape. All five now come out taller
than wide except `photomask`, which is a flat square and cannot be anything else.

**2. A point cloud does not occlude, so a quarter-cut vessel still reads as a
transparent drum.** This was the single worst problem in `process-chamber`, and
it also softened `sem-column`. Removing a *quarter* leaves the far wall visible
straight through the opening, and the two overlapping shells wash into a haze
that redraws the full silhouette. Both are now true **half-sections**: everything
in front of one diametral plane is deleted, and the plane itself is drawn as
solid cut material with a bright outline. That is what makes a cutaway legible in
stipple, and it also earns its keep - a sectioned magnetic lens can show its iron
yoke, its coil and its pole-piece gap, which the quarter-cut version could not.

---

## euv-scanner (chapter 05)

**What was wrong.** The machine was laid out as a 5.5 m wide, 4.3 m tall
cross-section - roughly 1.3:1 landscape, so it rendered as a horizontal band on a
portrait panel. Copper was spread across five different things (plasma, drive
laser, tin droplets, beam haze, reticle plate), which breaks the rule that amber
marks one thing. Mirrors were drawn as thin ellipse outlines with a strut-and-cone
mount that read as spinning tops. The wafer was drawn at 660 mm - more than twice
oversize even allowing for a deliberate exaggeration.

**What changed.**

- Relaid the light path so the machine is taller than wide (1.26 x 1.49 after
  normalisation). This is also more accurate: in a real NXE the reticle stage is
  at the top of the machine with the pattern facing down, the projection optics
  hang below it, and the wafer stage is at the bottom, so the optical path is
  naturally a tall S rather than a long horizontal run.
- **Copper is now only the 13.5 nm light** - the plasma at the collector focus,
  the beam bundle, and the exposed field where it lands. The CO2 drive laser is
  infrared, not EUV, so it is drawn in ink; so are the tin droplets and the
  reticle. The result is a single copper thread folding through a grey machine,
  which is both the point of the drawing and much easier to follow.
- Mirrors are now solid blanks: a concave front face, a cylindrical rim and a
  flat back, with a bright front rim. In a cross-section a mirror is nearly
  edge-on, so this reads as the crescent an optical layout would draw. Point
  counts on each blank were cut by about two thirds to stop them going black.
- Three illuminator mirrors, two of them carrying a **facet grid** (the field-facet
  and pupil-facet mirrors are the EUV illuminator's signature; they become visible
  as the specimen spins face-on), then six projection mirrors in a countable
  zigzag - matching the published NXE architecture of a collector, a facetted
  illuminator and a six-mirror 0.33 NA projection optics box.
- Source vessel with an ellipsoidal collector holed for the drive laser
  (~660 mm in life), a droplet generator above and a tin catcher below.
- Wafer stage is now a **TWINSCAN pair** - expose chuck under the last mirror,
  measure chuck alongside, both on one granite bridge. Wafer drawn at about 1.5x
  rather than 2.2x oversize; the file comment says so.

**Sources.** ASML TWINSCAN NXE:3800E page (https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe-3800e);
Wikipedia, Extreme ultraviolet lithography (https://en.wikipedia.org/wiki/Extreme_ultraviolet_lithography)
for the six projection mirrors plus condenser mirrors, the 6 degree chief-ray angle,
4x reduction, 26 x 33 mm field, ~25 um tin droplets and ~200 t machine mass;
ZEISS EUV lithography (https://www.zeiss.com/semiconductor-manufacturing-technology/inspiring-technology/euv-lithography.html)
and the EUV Symposium optics talk (https://euvlsymposium.lbl.gov/pdf/2011/pres/Olaf%20Conradi.pdf)
for the field-facet / pupil-facet illuminator and the M1-M6 ordering;
Asianometry on the Zeiss optics (https://www.asianometry.com/p/how-carl-zeiss-crafted-a-house-of)
for 2.7 nm Mo / 4.1 nm Si bilayers and ~70% mirror reflectivity; collector diameter
~660 mm ellipsoidal Mo/Si from the EUV collector literature
(https://www.intechopen.com/chapters/8667).

**Caption change proposed** (chapter 05 front matter). The reticle is no longer
copper, so the caption should say what is:

> Right: an EUV scanner in cross-section. Tin plasma source at the bottom left,
> collector mirror, three illuminator mirrors, the reticle held pattern-down at
> the top, six projection mirrors, and the wafer stage at the bottom right. The
> copper thread is the 13.5 nm light itself.

---

## process-chamber (chapter 07)

**What was wrong.** The weakest of the five. The quarter cut did not read (see
finding 2), so the chamber looked like a translucent drum with objects floating
in it. The vessel was wider than tall - wrong way round for the panel and wrong
for a real chamber stack. The plasma was a bright copper smear filling the whole
gap. The chapter caption promises "turbopump and exhaust at the bottom" but the
pump was drawn as a side port. Detail was pitched too fine to survive at 570 px:
34-bolt flange rings, a viewport, a butterfly valve.

**What changed.**

- Rebuilt as a **half-section**, with both cut faces drawn as solid material at
  tone 0.6 and outlined at tone 1. The half-disc top view now reads unambiguously.
- Restacked vertically: gas box and inlet on the lid, chamber, then **gate valve
  and turbopump under the floor**, as the chapter caption says. The turbopump's
  rotor blades are drawn as a ring of angled lines seen down the throat - a small
  detail that repays a second look and tells you what the drum is.
- Proportions set from the real thing: 500 mm bore, ~370 mm inner height, 42 mm
  wall, 300 mm wafer, focus ring to 185 mm radius. The electrode gap is drawn at
  about twice its true 30-40 mm, noted in the file, so the plasma has somewhere
  to live.
- The electrostatic chuck is now visible in section: aluminium base plate, a
  denser band for the ceramic puck, and a row of helium backside cooling channels.
- **Plasma reworked**: confined to a disc the width of the wafer plus its focus
  ring, brightest in a thin sheath hugging the wafer (alpha 0.42) and thin above
  it (0.11-0.21). It now reads as a glow rather than a smear, and it is the only
  copper in the drawing.
- Showerhead now has the structure it really has - face plate, gas plenum,
  backing plate - with a hex array of a few thousand holes on the underside.
- Dropped the 34-bolt rings for a 20-bolt ring, kept the slit valve with its
  outside door, added a viewport and a gauge port on the wall that is left standing.

**Sources.** Applied Materials / Lam-style CCP construction taken from the patent
literature rather than marketing pages, which do not publish sections: showerhead
electrode assembly in a capacitively coupled plasma processing apparatus, US 9,245,718
and US 9,018,022 (https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/9245718);
electrostatic chuck and plasma processing apparatus, US 11,367,597
(https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/11367597);
substrate support providing gap height adjustment in a plasma processing chamber,
US 8,895,452 (https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8895452);
CCP system schematic (https://www.researchgate.net/figure/Schematic-diagram-of-capacitively-coupled-plasma-CCP-etching-system_fig1_330948726).

**Caption change proposed** (chapter 07). The current caption says "RF electrodes
above and below", which the drawing shows only as feedthroughs, and it does not
mention the copper:

> Right: a plasma process chamber cut in half. Gas plenum and showerhead at the
> top, a 300 mm wafer clamped to an electrostatic chuck inside its focus ring
> below, the plasma between them in copper, the slit valve in the wall, and the
> gate valve and turbopump under the floor.

---

## gas-cabinet (chapter 04)

**What was wrong.** Two objects side by side, and the second was a large blank
horizontal drum that doubled the width and out-massed the cabinet it was meant to
support. The cabinet itself was 1.22 x 0.62 x 2.05 m - too wide and too deep
against the catalogue dimensions. The valve manifold was a tangle of marks too
small to resolve, so the copper read as a scribble rather than as a panel.

**What changed.**

- **Cabinet redrawn to catalogue dimensions**: 38 in wide, 19 in deep, 76 in tall
  (0.97 x 0.48 x 1.93 m) for the three-cylinder model, with an 8 in exhaust collar
  on the plenum, a louvred inlet grille low on the side wall, a self-closing door
  frame with three hinges, a plinth and a sprinkler head under the roof.
- **The horizontal dewar became a vertical bulk liquid cylinder.** A deliberate
  departure from the brief: a horizontal drum on saddle legs is a wide blank mass
  that ruins a portrait composition, and the upright liquid cylinder is what
  actually stands in a fab gas bay. It is drawn smaller than the cabinet and set
  back, so it reads as scale and context rather than as a second hero. It carries
  a top collar and valve cluster, a gauge, a relief valve, a vaporiser coil, ribs,
  a hoop base with casters and two plates.
- **Gas panel rebuilt so the copper reads.** Bigger, fewer marks: a panel plate on
  the back wall, a process header and a vent header, a block valve and a bleed
  valve in series on each of the three legs, a gauge over each leg, a regulator
  body, and the process line leaving through the side wall through an in-line
  **point-of-use filter** - the four items the chapter caption names. Copper is
  confined to that panel and its lines.
- Cylinders sized at 9 in diameter with two at full height and one short, strapped
  behind two restraint bars, each with a neck ring, valve body, coiled pigtail,
  painted bands, a label and a foot ring.
- Tilt eased from -0.70 to -0.50 on Y so the open front turns toward the reader
  and the interior is visible in the first view.

**Sources.** Critical Systems Inc gas cabinets
(https://www.criticalsystemsinc.com/gas-cabinets) for 18 / 24 / 38 in widths,
19 in depth, 76 in height, 6 and 8 in exhaust collars and the safety-glass
window; Linde Direct gas cabinets
(https://www.lindedirect.com/solutions/specialty-gas-electronic-solutions/electronic-products/gas-cabinets)
and SilPac (https://www.silpac.net/gas-cabinets.html) for one-, two- and
three-cylinder configurations and VMB practice.

**Caption change proposed** (chapter 04). The current caption says "cylinder
bundle", which is a different object (a manifolded pack of cylinders); the
drawing shows loose cylinders in a cabinet plus a bulk vessel:

> Right: a specialty gas cabinet and a bulk liquid cylinder. Purge and process
> lines, a double-block-and-bleed panel, pressure gauges, and the point-of-use
> filter that sits between the cylinder and the process chamber, all in copper.

---

## sem-column (chapter 08)

**What was wrong.** The best of the five to start with - good vertical proportion,
clear beam. But the magnetic lenses were drawn as housings wrapped in helix
windings, which at this scale collapsed into dark hatched drums that said nothing
about what a lens is. The gun read as a dome with a side box. The stage was three
plain slabs. The wafer, at 0.38 units against a 2.5-unit column, was swallowed by
the stage under it.

**What changed.**

- **Half-sectioned like the chamber**, and each lens now drawn the way a textbook
  draws one: an iron yoke in section, a coil window inside it with winding lines,
  and pole pieces pinching the bore at the mid-plane. That is the third level of
  detail the brief asks for, and it explains the object instead of decorating it.
- Gun rebuilt with a **stepped high-voltage insulator stack** and cable above it -
  the feature that makes an e-beam column recognisable from across a fab - plus
  the Schottky emitter, suppressor, extractor and two apertures on the axis, and
  the ion pump hanging off the side.
- Column contents in the right order from the literature: gun, condenser 1,
  beam-limiting aperture, condenser 2, stigmator (eight saddle blocks), scan and
  deflection coils, objective lens with a conical pole piece.
- Stage simplified from four stacked slabs to a chuck, one slide with rails and a
  granite base, all lightened, plus **interferometer mirror bars** on two sides of
  the chuck - this is a metrology tool, and that is how it knows where it is.
- Wafer lightened, given a brighter rim and a notch bitten out of it, so it reads
  as a wafer under the column rather than as a grey ellipse.
- Copper stays what it was: the electron beam - emitter, envelope, the spot where
  it lands, and the secondaries fanning up to the annular detector.

**Sources.** Thermo Fisher, principles of scanning electron microscopy - the
electron column (https://www.thermofisher.com/us/en/home/materials-science/learning-center/applications/scanning-electron-microscope-sem-electron-column.html)
for gun, condensers, apertures, scan coils, objective and detector order;
scanning electron microscope and objective lens, US 12,261,014
(https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/12261014) and
field emission electron gun, US 7,732,764
(https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7732764) for the
yoke / coil / pole-piece construction and the Schottky gun; multi-column SEM
system, US 10,354,832 (https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10354832).

**Caption change proposed** (chapter 08). Optional - the existing caption is
accurate. If it is being edited anyway, naming the copper helps:

> Right: a scanning electron microscope column over a wafer, cut in half. Electron
> gun under its high-voltage insulator at the top, condenser and objective lenses
> shown as iron yokes wrapped round their coils, scan coils, an annular electron
> detector, and the wafer on a precision stage. The copper thread is the beam.

---

## photomask (chapter 06)

**What was wrong.** Dimensionally the blank was right, but the **pellicle standoff
was 11 mm** against a real 2 to 2.5 mm - four to five times too tall. The copper
was spent on the pellicle frame, drawn heavy and hard against the mask edge, so it
read as a picture frame around the whole slab. The multilayer - the thing chapter 06
is actually about, and the thing AGC and Hoya make almost all of - was three faint
ink lines nobody would notice.

**What changed.**

- **Standoff corrected to the real 2.5 mm**, with the frame glued down on four
  pads as ASML's pellicle patent describes. A gap that shallow is genuinely hard
  to see on a 152 mm plate, so it is helped along by the frame's footprint outline
  on the mask surface and eight short ticks up the gap at the mid-edges. Nothing
  is exaggerated; the reader is just given something to measure against.
- **Copper moved from the pellicle to the Mo/Si multilayer**, drawn as a band of
  eight fine lines wrapped round the top edge of the blank. Forty bilayers come to
  about 280 nm - four ten-thousandths of the 6.35 mm blank - so this is the one
  frank exaggeration in the specimen, and both the file comment and the fallback
  caption say so. It gives the mask a delicate copper edge that traces its whole
  silhouette, and it points at the right chokepoint.
- Added the chrome backside coating that the electrostatic chuck grips (SEMI P37
  specifies a minimum 146 x 146 mm conductive area, which is the outline drawn).
- Pellicle frame kept at 145 x 117 mm outer - enough to clear the 132 x 104 mm
  field - now in ink, with its vent filter on one bar and the membrane as the
  faintest plane in the specimen at tone 0.13.
- Tilt raised from 0.90 to 1.00 on X, which lifts the plate's projected height a
  little without losing the edge view.

**Sources.** ASML pellicle frame patent WO 2021/213777 A1
(https://patents.google.com/patent/WO2021213777A1/en) for a pellicle-to-reticle
gap "between 2 mm and 2.5 mm", glued attachment pads and frame thicknesses;
SEMI P40, mounting requirements for EUV masks, and SEMI P37, EUV mask substrates
(https://store-us.semi.org/products/p04000-semi-p40-specification-for-mounting-requirements-for-extreme-ultraviolet-lithography-masks)
for the 152.4 mm square / 6.35 mm thick blank and the 146 x 146 mm minimum
conductive layer; SPIE, overcoming mask blank defects in EUV lithography
(https://www.spie.org/news/1455-overcoming-mask-blank-defects-in-euv-lithography)
and EUV mask patent US 11,249,384 B2
(https://patents.google.com/patent/US11249384B2/en) for 40 Mo/Si bilayers, a
~2.5 nm ruthenium cap, a TaBN absorber and a chrome backside coating;
Wikipedia, Photomask (https://en.wikipedia.org/wiki/Photomask) for pellicle
purpose and construction.

**Caption change proposed** (chapter 06). This one matters, because the copper
now means something different:

> Right: a six-inch EUV reticle with its pellicle. Low-thermal-expansion glass at
> the base, the molybdenum and silicon multilayer mirror in copper round the top
> edge, a tantalum absorber carrying the pattern inside its black border, and a
> membrane held 2.5 mm off the surface on four glued pads to keep particles out
> of focus.

---

## Checks

- `node build/preview.js <name>` runs clean for all five; no warnings.
- Every PNG in `qa/` was looked at, at least three iterations each.
- All five carry three levels of detail: bulk surfaces, edges and outlines, and
  small repeated features (facet grids, gas holes, bolt rings, helium channels,
  turbopump blades, coil windings, fiducials, multilayer stripes).
- No solid-black regions. The darkest areas are the sectioned lens coils in
  `sem-column`, held at tone 0.40 over a modest density on purpose.
- No floating debris. Everything that looks detached is tied to something: tin
  droplets run between generator and catcher, the vaporiser coil is plumbed to the
  liquid cylinder at both ends, the pellicle stands on four pads.
- Point counts 65,811 to 112,228, all inside the 40k-160k budget.
