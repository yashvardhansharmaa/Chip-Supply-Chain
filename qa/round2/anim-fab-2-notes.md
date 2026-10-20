# anim-fab-2 notes (20 October 2026)

Task: critique and improve `animations/fab-loop.html` (chapter 9, "How a fab builds a chip, layer by layer") before it is
published. Render port 9831, screenshot port 9832. Do not edit chapter files.

Backup of the version I started from (source, both videos, stills, step file):
`qa/round2/scratch/anim-fab-2/before/`. Contact sheets of it and of dep-etch, litho and transistor:
`qa/round2/scratch/anim-fab-2/sheet-*.png`.

## Critique of the starting version (verified on its contact sheets and full frames)

Keep
- The idea: one garnet pod rides an overhead track through five tools, and each lap adds one layer to a wafer drawn cut
  through. It teaches the chapter's two paragraphs exactly (pod, track, robot, one job per tool, loop per layer).
- The sync between a tool's job and the change in the cut-through (film at Deposit, violet pattern at Print, final
  materials at Etch, a sweep at Clean, a scan at Measure). This is the best idea in the piece.
- The robot transfer, the hoist lowering the pod, the "Other wafers, same tools" beat, the jam logic (each pod stops a
  pod's length behind the one ahead), the step names and caption meanings, the single sourced number.

Change, and why
1. Hierarchy (agree). The cut-through is 144 px wide with layers 11 to 24 px thick, tucked bottom right under a 10.5 px
   label; the first lap adds a 15 px band. The top right is empty for 18 s. The teaching object is the smallest thing on
   screen. Fix: a right-hand column with the counter on top and a cut-through about 1.5 times wider per layer and 1.5
   times thicker, so each lap visibly adds a band of 20 to 34 px.
2. No counter (agree). Nothing says how many laps have run, so the fast laps read as a blur. Fix: house counter
   ("LAYER" label over a 46 px Fraunces number, as dep-etch's "ROUND"), counting only the laps drawn; the SIA figure takes
   its place when the finished wafer leaves, with the house readout bar.
3. Clutter (agree). Ceiling line, eight hanger lines, two rails of nearly equal weight and a hatched floor all sit in the
   band the pod moves through. Every pod has the same dark vehicle, so the followed pod differs only by its outline.
   Fix: drop the ceiling, hangers and hatch; one solid front rail, the return drawn as a faint hairline; the followed
   pod garnet (vehicle, outline, cables), the others pale grey.
4. Identical cabinets (agree). The chambers are empty grey windows until a wafer arrives, and the small top shapes do not
   read at phone size. Fix: larger chamber windows, each always showing its job at rest (a shower of material over a
   film, a lens and cone of light, a plasma glow with ions, a spray fan, a probe beam), which brighten and move when a
   wafer is inside.
5. Quiet ending (agree). The print tool fades to a dashed box and pods crawl to the left over 4.7 s; the cut-through is
   already finished, so nothing on the wafer side shows the loss. Fix: a next wafer enters as the finished one leaves;
   it gets its first film, then the printing tools go, every pod rushes to the gap and stops, the new wafer's film stays
   unprinted, and the counter freezes in garnet ("STOPPED AT LAYER 1"). The chamber jobs go dark.
   Design decision: the brief asks both for the SIA figure to take the counter's place when the finished wafer leaves and
   for the counter to stop at the end. A stopped counter needs a wafer in progress, so the slot reads LAYER 1 to 7, then
   the SIA figure while the finished wafer leaves (step 7), then the next wafer's LAYER 1, which stops (step 8).
6. Pacing (agree). 26.7 s. Idle time: 1.2 s before the pod moves, a slow 4.1 s exit, a 4.7 s crawl into the jam.
   Target 23 to 23.5 s with steps 2 to 4 kept at 1.8 s.
7. Phones (agree, and the house labels have the same problem). The figure shows at about 354 CSS px on a 390 px phone, a
   scale of 0.47: a 10.5 px label is 4.9 px. Fix: no uppercase label under 13 px, names in Fraunces 18 to 20 px, numbers
   44 px or more; check each frame downscaled to 708 px (354 CSS px at 2x).
Own additions
8. "Every layer needs a print" now rests on chapter 5's How it works ("A photomask is the stencil that lithography prints
   from, one for each layer of a chip"); chapter 4 no longer has the "at least one per layer" sentence the first notes
   cite.
9. Caption 6 repeats itself ("for the next layer ... layer after layer"); the counter now shows that. Cut it.

## Progress
- Draft built in `qa/round2/scratch/anim-fab-2/draft/` (with a copy of lib.js), then ported into
  `animations/fab-loop.html` with Edit calls; every later revision was an Edit on the repo file. Rendered with
  `python3 build/animate.py fab-loop --port 9831`. Frame checks with a small DevTools script (port 9831) in my scratchpad.
  (I overwrote an old `frames.py` at the top of the shared session scratchpad by mistake; nothing referenced it.)
- v1 (sheets `scratch/anim-fab-2/v1/`): new layout and everything in the critique. Seen: the cut-through still small
  for the whole first lap; "Next wafer" note appeared before its pod; pods faded in already lowered into tools.
- v2 (`v2/`): first layer shown at 2x in the cut-through, pulling back to 1x during the trip round the loop (no cut);
  pods fade in on the rail; bigger deposit dots and a stronger spray for phones. Seen: steps 5 and 7 captions were tight
  (about 5 words a second); the next wafer's slab drifted in from the left over the gap.
- v3 (`v3/`): time moved from the fast laps to steps 5 and 7, end hold trimmed; slab fades in place; notes retimed;
  caption 5 loses "that". v4 (`v4/`): fainter garnet motion trail. Pod overlap check over the whole timeline: none.

## What changed (final)
- Layout: fab bay on the left (x 24 to 476); a right-hand column at x 512 with the counter on top and the cut-through
  below (128 px wide, layers 16 to 34 px, 164 px for seven; first lap at 2x). Ceiling, hangers and floor hatch removed;
  front rail solid, return a hairline. Followed pod garnet (vehicle, cables, outline), other pods pale grey.
- Tools: larger chamber windows (42 x 70) that always show their job at rest, faint and still: shower head and settling
  particles (deposit), lens and cone of light (print), plasma glow and ions (etch), spray fan (clean), probe beam
  (measure). They brighten and move only while a wafer is in.
- Counter: "LAYER 1" to "LAYER 7", one per lap drawn. When the finished wafer leaves, the SIA readout takes its place
  with the house garnet bar. The next wafer then shows "LAYER 1", which turns garnet as "STOPPED AT LAYER 1".
- Ending: the finished pod leaves ("Out, to be tested"), a next garnet pod comes in ("Next wafer") and takes its place in
  the loop, gets its first film, then the printing tools go: every pod rolls to the gap and stops (queue a pod length
  apart, the garnet pod first), the chamber jobs go still, the new wafer keeps an unprinted film and a dashed garnet
  outline marks the layers it will not get (same dashes as the missing tool).
- Type: uppercase labels 13.5 px (house 10.5 px), names 20 px, notes 19 px, brackets 18 px, numbers 42 to 46 px.
  Checked downscaled to 708 px and on the real page at 390 px: every label reads.
- Length 23.5 s (was 26.7). 564 frames per theme, 1520 x 840, 24 fps, 0.79 MB each, same BT.709 tags as the others.

## Final steps and captions (media/fab-loop.json)
1. The fab (0.4): Sealed pods carry wafers from tool to tool on a track near the ceiling.
2. Deposit (2.8): The first tool lays a thin film on the wafer.
3. Print (4.6): The next prints a pattern on it with light.
4. Etch (6.4): An etch tool cuts the pattern into the film.
5. Clean, measure (8.2): The wafer is cleaned, then measured to check the layer came out right.
6. Next layer (10.9): Then the loop starts again for the next layer. The transistors come first, then the wiring above
   them.
7. Finished (15.3): Making one chip takes 1,000 to 1,500 steps, the Semiconductor Industry Association estimated in 2025.
8. No printing tools (18.9): Every layer needs a print. Without printing tools, every pod stops at the gap, and no more
   chips are finished.
Changed wording: step 5 drops "that"; step 6 drops ", layer after layer" (the counter shows it). Meanings unchanged.
In-canvas words: tool names; LAYER; Other wafers, same tools; Out, to be tested; STEPS TO MAKE ONE CHIP; 1,000 to 1,500;
SIA ESTIMATE, 2025; Next wafer; Missing; STOPPED AT LAYER; Transistors; Wiring; SILICON; ONE WAFER, CUT THROUGH.
Facts: no new numbers. The only figure is the SIA 2025 estimate as chapter 6 states it. "Every layer needs a print" now
rests on chapter 5 ("one for each layer of a chip"). "Next wafer" and "Stopped at layer 1" describe the drawing only.

## Figure title and note (chapter 9 front matter; not edited)
Title: keep "How a fab builds a chip, layer by layer". Note: no change needed. Optional, to tie the note to the counter:
"Simplified. A real fab has many tools of each kind, spread across the building, and a chip has far more layers than the
seven shown. The layers are drawn far thicker than they are."

## Checks (20 October 2026, after the final render)
`node build/build.js` ok; check-speak: no matches; check-integrity: only the known Veeco Instruments warning;
check-sources: 2453 citations, all tier A or B. Inline script parses with `node --check`.

## Shots (qa/round2/shots/anim-fab-2/)
- before-after.png: six matched beats, old (26.7 s) beside new (23.5 s).
- static-desktop-light.png, static-desktop-dark.png, static-mobile-light.png, static-mobile-dark.png: the static
  chapter page `/foundries-and-fabs/` (poster is the end still, native controls over it).
- main-desktop-light-print.png, main-desktop-dark-laps.png, main-mobile-light-finished.png,
  main-mobile-dark-finished.png, main-mobile-dark-stopped.png: the interactive page, video paused mid-play. (The local server does not seek MP4s, so
  these were taken by letting the video play to the moment.)
- Light shots need `?theme=light`: without it headless Chrome here renders dark.

## Owner change, 20 October 2026: ending removed
Removed the second wafer, the jam, "Missing", "Next wafer", "STOPPED AT LAYER 1", the dashed outline and step 8. The
animation ends on the finished pod leaving ("Out, to be tested", now held) with the SIA readout held to the last frame;
the pod has faded by 16.4 s, the final state holds until the fade at 18.8 s. Length 19.6 s, 7 steps, 470 frames per
theme, about 0.6 MB each. Kept the expert's comment change on line 13 ("at least one for each layer"). Figure note
(now "...far more layers than the seven shown...") still fits. Build and checks pass (check-sources: 2516 citations).
Sheets: `scratch/anim-fab-2/v5/`. The shots and before-after.png above show the earlier 23.5 s version.

## For the owner (earlier version)
- The ending now follows a second wafer so the counter and the cut-through can visibly stop; the SIA figure shows for
  3.6 s (step 7) and is not in the end still. If the SIA figure should stay to the end, the stopped counter has to go.
- New bibliography entries: none.
