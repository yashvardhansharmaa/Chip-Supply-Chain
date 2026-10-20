# anim-gas-2 notes (20 October 2026)

Slug `anim-gas-2`. Improve `animations/chemicals.html` (chapter 3, "Why one missing material can stop a fab").
Render: `python3 build/animate.py chemicals --port 9833`. Screenshots: `build/shoot.py ... --port 9834`.
Scratch: `qa/round2/scratch/anim-gas-2/` (before-* copies of the old html, json and both mp4s; contact sheets).

## Read
RULES.md, writing-well, anim-gas-notes.md, chemicals.html, lib.js, animate.py, fab-loop.html, anim-fab-notes.md,
chapter 3 How it works. Contact sheets (12 frames each): chemicals light/dark, dep-etch, litho, silicon, fab-loop.

## Facts (unchanged from anim-gas; nothing new)
- Six materials and what they do, all in ch 3's body: hydrofluoric acid cleans the wafer; silane gas carries the
  silicon for new layers; a machine spins a coat of photoresist; etching cuts the pattern (etch gases); sputtering
  targets give thin metal films; polishing slurries grind each new layer flat. Step names used on the ring: Clean,
  Deposit, Coat, Etch, Metal, Polish (dep-etch also uses Deposit, Coat, Etch).
- Lede: a fab uses a few hundred chemicals and gases, and a shortage of any one can stop it. Stockpiles: ch 3, The
  chokepoint (gas stockpiles after 2014).
- "Seven to 17 months": ch 3 How it works, cited to SIA PAG case study (2023) #page=22. Checked again in
  qa/round2/scratch/anim-gas/sia-pag.pdf, p. 22: "For materials that pass yield qualification on the first attempt,
  the overall timeline for qualification would be seven to 17 months." p. 22 also: "Iterations of the formulations,
  filtration and viscosity are common during this phase" (the chapter's "rounds of tests in the fab", p. 22 cite).

## Critique of the current version (verified frame by frame)
1. House style: confirmed. dep-etch, litho and silicon carry no headline; fab-loop names its tools in 19 px Fraunces
   and uses small uppercase labels. chemicals has a Fraunces headline and subhead in every step (six of them, swapped
   every 2.5 to 4.6 s, one caught mid-fade in the sheet) and a six-row list with role lines: about 40 percent of the
   frame is text. Keep: the ring idea, the six materials, the four-part story, the palette.
2. Stations unlabeled: confirmed. The containers are 16 px wide and the colors close (HF blue, silane blue-grey,
   slurry grey), so the list is the only way to tell them apart.
3. Scale: ring radius 102 in a 760 x 420 frame, wafers 22 px across (10 px on a phone), containers 16 x 30. The first
   wafer is as grey as the rest; only a tiny "WAFER" label for 2.5 s marks it.
4. Stock: the container level dips 12 percent while in use and the resist's drain is about 10 px tall. Deliveries are
   2 px dots on 18 px dashed lines. "Works through its stock" cannot be seen.
5. The stop: the queue is there, but the other stations do not change when the fab stops, so "the whole fab stops"
   rests on the caption. The emphasis is split between the ring, "EMPTY", and "Ran out" in the list.
6. Ending: the rounds are 9 px circles 13 px apart (4 px on a phone) under a 10.5 px label; no sense of rounds
   following one another.
7. Phones: the figure is 354 CSS px wide (scale 0.466). 10.5 px labels show at 4.9 px, role lines at 6.3 px, names
   at 8.4 px. Nothing but the headline reads.
Added:
8. The supply chain (delivery -> stock -> use) is never set up before it breaks; deliveries start at 8.1 s with no
   visible effect on any level, so the cut in step 3 has nothing to break.
9. Four captions of 25 to 31 words over 4.6 to 7.6 s; the stop and the new supplier share little time with the frame.

## Plan
- No headlines, no list. Each station labeled on the ring: step name (Fraunces, phone size) and its material.
- Bigger ring, stations, wafers; one wafer followed in garnet; the station it is at named in garnet (as fab-loop).
- Each container is its own stock gauge (fill level). Lap 1: levels dip with use. Then deliveries arrive along each
  supply line and top them up. Resist's line goes empty (garnet x), its level steps down with each coat, then empty.
- Stop: first wafer at Coat waits, the rest pile up behind it, each other station dims as its last wafer leaves.
- Ending: new supplier's resist waits on the empty supply line; rounds of tests fill one by one, large; 7 to 17
  months only with "if it passes the first time" and "SIA estimate, 2023" (or caption only).
- Every label at least about 8 CSS px on a 390 px phone (canvas text >= ~17 px; uppercase >= ~14 px).

## Progress
Prototype in `qa/round2/scratch/anim-gas-2/proto/` (copies chemicals-v1.html, -v3.html); stills and phone views
(each frame at 354 px, 1x) in `scratch/anim-gas-2/stills/`. Helper: scratchpad `anim-gas-2/stills.py`.
- v1: no headline or list; tag (step) over Fraunces name (material) at each container; containers are stock gauges
  (each use takes a third, a parcel along the delivery line brings it back); queue; idle ripple; ending on the resist
  line. Seen: ring left of center, right 40 percent empty for 19 s; tags 13.5 px small on a phone.
- v2: ring centered (CX 372), R 122, wafers 32 px, containers 1.6x, names 20 px; the scene moves left 60 px at the
  last step for the new supplier. Seen: balanced; long names measured (Hydrofluoric acid 168 px at 20 px) so the left
  labels still fit after the move. Both themes fine.
- v3: tags 15 px (phone 7 px, as legible as the 20 px names); "Deliveries" tag at the end of the resist's line, where
  the cut will be; a one-time garnet ring when the followed wafer reaches the empty step; lap 1 at 1.0 s a step; five
  steps so the stop gets its own caption; dense frames 13.9 to 15.4 s and 18.4 to 20.6 s checked (hop, stop, pan).
- v4: the old cross fades as the scene moves (it lingered under the new line); EMPTY lower and the rounds 8 px right so
  "EMPTY" and "ROUNDS OF TESTS" do not read as one phrase; last caption cut to 27 words (was 34 in 6.2 s).
- Ported v4 into animations/chemicals.html with Edit (diffed against the prototype: identical but for one comment
  and INFO), rendered, and revised twice more from the renders and page shots:
  - v5: the new supplier and its tag 8 px further from the right edge (tag ended 8 px from it); the old resist line
    fades out under the new dashed one (two dash patterns overlapped); halos on the five unfollowed wafers 0.36 (was
    0.5) so the garnet one leads.
  - v6: idle steps were dimmed to 50 percent alpha, which left their names at about 3.6:1 in the end still that
    reduced-motion readers get as the poster. Now their names turn muted grey, their step tags go 60 percent toward
    faint and only the drawing fades by half: still plainly off, names readable in both themes.
- Decision: "seven to 17 months" stays in the caption only. A readout would need the qualifier "if it passes the first
  time" at a phone-legible size (27 characters, about 290 px at 15 px), and beside five rounds of tests it could read as
  a contradiction (it "passed the first time", yet five rounds). The caption carries the chapter's exact sentence.

## Result (media/chemicals.json: 24.6 s, 760 x 420, five steps; was four)
1. One layer (0.4 s): A chip is built up in layers. For each layer the wafer goes around the same loop of steps, and
   each step uses its own chemical, gas or metal. (unchanged)
2. Many wafers (6.7 s): A fab runs many wafers at once, so every material is always in use. Deliveries keep each
   stock topped up.
3. One runs out (11.1 s): If one material stops arriving, the fab works through its stock.
4. The fab stops (14.1 s): When the stock runs out, wafers pile up at that step, and the rest of the fab stands idle.
5. A new supplier (18.4 s): A new supplier's resist goes through round after round of tests in the fab. Even one that
   passes the first time takes seven to 17 months to approve.
In the frame: tags Clean, Deposit, Coat, Etch, Metal, Polish over the names Hydrofluoric acid, Silane gas,
Photoresist, Etch gas, Sputtering target, Polishing slurry; Deliveries; Empty; New supplier; Rounds of tests in the
fab. No numbers. Smallest text 15 px uppercase (about 7 CSS px on a 390 px phone); names 20 px Fraunces.
Story: the garnet wafer goes around once and each step's words appear as it arrives (its tag in garnet); each use
takes a third of the container and a parcel along the delivery line brings it back; five more wafers join; resist's
line goes dashed with a garnet cross and its bottle drops a third per coat to empty; the garnet wafer reaches the
empty step (one garnet ring), the others pile up behind it and each other step greys out as its last wafer leaves; the
scene moves 60 px left; a new supplier's resist slides in on the resist's line and five rounds fill one by one from
the supplier toward the fab, the last still running at the end.

## Files
- Changed with Edit: animations/chemicals.html (the script reworked block by block; inline script passes
  node --check). Old version kept at scratch/anim-gas-2/before-chemicals.html with its json and both videos. Re-rendered: media/chemicals-{light,dark}.mp4 (590 frames, 24 fps, 1520 x 840, yuv420p, same
  BT.709 tags as dep-etch and fab-loop; 0.84 and 0.78 MB), -start.jpg (blank, as for every animation), -end.jpg,
  media/chemicals.json. Not touched: lib.js, animate.py, chapter files. New bibliography entries: none.

## Checks (20 Oct, after the final render)
node build/build.js exit 0, no warnings; check-speak "no matches"; check-integrity exit 0 (only the known Veeco
line); check-sources "2453 citations, all tier A or B". dist/media holds the new files.

## Screenshots (qa/round2/shots/anim-gas-2/)
static-{desktop,mobile}-{light,dark}.png (static chapter page: poster is the end still, steps as text);
interactive-mobile-light.png (16.6 s, "The fab stops"), interactive-mobile-dark.png (12.4 s, "One runs out"),
interactive-desktop-light.png (3.3 s), interactive-desktop-dark.png (21.4 s); before-after.png (five matched beats,
old left, new right, and both end frames at 354 px). The local server does not answer range requests, so a video
on the main page cannot be seeked there (currentTime stays 0); the in-page shots pause playback at the time instead
(scratchpad anim-gas-2/ishot.py). The step buttons seek on a host that serves ranges.

## Front matter (chapter 3, figures, id materials-loop): not edited
Title: keep "Why one missing material can stop a fab". Note: still true; optional sharper text, since the loop
leaves out steps that the chapter's first paragraph names (light through a stencil, the wash):
"Simplified diagram. Six steps and their materials stand for the many a fab uses, and each real layer uses its own mix."

## For the owner
- The followed garnet wafer is the one that reaches the empty step; that is by design (hop count).
- Five steps now: the stop has its own caption. The step buttons wrap to two lines on a phone, as the four did.
- Chapter 9's designer (anim-fab-2 notes) is moving fab-loop the same way: no uppercase label under 13 px, Fraunces
  names 18 to 20 px, a garnet followed object, tools going dark at the stop.
