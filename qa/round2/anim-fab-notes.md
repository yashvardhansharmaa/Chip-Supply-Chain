# anim-fab notes (20 October 2026)

Task: new explainer animation for chapter 9, Foundries and fabs: `animations/fab-loop.html`, rendered with
`python3 build/animate.py fab-loop` to `media/fab-loop-*`. Screenshot port 9811. Do not edit content/09 (another agent is).

## Read so far
- RULES.md, writing-well skill, build/animate.py, animations/lib.js, dep-etch, litho, transistor, silicon, wafer-test, package.
- Visual language: 760 x 420 canvas at 2x; PAL tokens from lib.js; Fraunces 20 px headline + Source Serif 16 px subhead at
  (40, 62)/(40, 86), one at a time; 10.5 px uppercase Instrument Sans labels; Fraunces 40-44 px readout at x 520 with a
  2 px garnet bar at x 504; names in Fraunces 500 17-20 px; process colors from dep-etch (silicon #2c323b/#343b45,
  film #b7c4cf, resist #c98f2e, copper #b8743d, insulator #d3d9de/#9aa6b0), violet for light and plasma.
- Phone: the figure column is about 354 CSS px wide, so the canvas shows at about 0.47 scale. A 10.5 px label is about
  5 px on a phone; a 20 px Fraunces name is about 9 px. So the tool names here are set in the 20 px Fraunces name style.

## Facts the animation relies on (chapter 9, How it works, paragraphs 2 and 3, unless noted)
- "Inside, a chip is built up in layers, and the same loop of steps repeats for each one."
- Wafers travel in a sealed pod (FOUP) that only a machine opens; an overhead track carries the pod from tool to tool.
- At each tool a robot lifts one wafer out and the tool does its one job: depositing a film, printing a pattern,
  etching it, cleaning it or measuring it. The robot puts it back; the pod moves on, often across the building.
- When a layer is finished, the loop starts again with the next one.
- Chapter 8: the front end builds the transistors; the back end of line wires them together, above them.
- Chapter 4: "A chip takes dozens of masks, at least one per layer." So every layer goes through printing.
- Chapter 13 and chapter 6: the finished wafer is tested, then cut and packaged.

## Numbers
- Only one number is shown: "1,000 to 1,500 steps" to make one chip, Semiconductor Industry Association, 2025.
  Chapter 6, How it works, paragraph 1 ("Making one chip takes 1,000 to 1,500 steps, the Semiconductor Industry
  Association estimated in 2025", cited to the SIA Senate testimony, finance.senate.gov ... #page=2). Also chapter 6
  keyFacts and chapter 13 ("Turning silicon into a finished, packaged chip takes 1,000 to 1,500 steps ... 2025").
- Not used, because the chapters give them without a source or year: 25 wafers per pod (ch 9 body and specimen caption,
  uncited), "hundreds of those visits", "months inside" (ch 9, uncited), "dozens of masks" (ch 4, uncited). No layer
  count is stated with a source anywhere, so the animation shows no layer or lap counter.

## Progress
- v1 (first draft): side view of a fab bay, looped overhead track, five tools, garnet pod, cut-through stack on the right.
  Problems seen in frames: dark tool windows dominated the light theme; stack too small; stack label clipped; queue
  crowded at the left edge.
- v2: light chamber cutaways (dark in the dark theme), bigger pods and stack, layout raised, queue spacing 36. Fixed a
  bug where the job inside a chamber faded out early (envelope peaked at a third of the job).
- v3 (captions and phone legibility): Deposit caption cut to fit its 2.0 s; coda caption says "no more chips" so it
  does not contradict the finished stack on screen; "Missing", "Other wafers, same tools" and "Out, to be tested" set in
  the 17 px Fraunces name style; small garnet pod beside the stack label ties it to the garnet pod. "Our" removed from
  labels (the writing rules ban "our").
- Start poster is blank, as for every existing animation (they all fade in from an empty frame and loop back to it).
- Final: step 8 renamed "No printing tools" (a fab has many printing tools; losing the kind stops it, not one machine).
  Rendered with `python3 build/animate.py fab-loop` (port 9412 was free): 641 frames per theme, 1520x840, 24 fps,
  26.7 s, 0.89 MB each, BT.709 tagged like the others.

## Result
Idea: a garnet pod rides the overhead track through one bay of five tools (deposit, print, etch, clean, measure); each
lap adds one layer to the wafer drawn cut through beside it, transistors first, then wiring. The fab's other pods then
appear on the same tools, the finished wafer leaves to be tested, and when the printing tools are taken away every pod
in the fab jams at the gap.

Sharpened from the brief in two ways, both from the chapters:
1. Other wafers share the tools (ch 9: the foundry runs every design through the same building on the same tools), so
   the coda stops every pod in the building. That makes "the whole fab" literal.
2. "One missing tool" became one missing kind of tool, the printers. A fab has many machines of each kind, so one broken
   machine would not stop it. But every layer needs a print (ch 4: "at least one [mask] per layer"). The coda does not
   claim this for every kind of tool (ch 7: a fab without measuring tools finds fewer faults, it does not stop).

Steps and captions (media/fab-loop.json):
1. The fab: Sealed pods carry wafers from tool to tool on a track near the ceiling.
2. Deposit: The first tool lays a thin film on the wafer.
3. Print: The next prints a pattern on it with light.
4. Etch: An etch tool cuts the pattern into the film.
5. Clean, measure: The wafer is cleaned, then measured to check that the layer came out right.
6. Next layer: Then the loop starts again for the next layer. The transistors come first, then the wiring above them,
   layer after layer.
7. Finished: Making one chip takes 1,000 to 1,500 steps, the Semiconductor Industry Association estimated in 2025.
8. No printing tools: Every layer needs a print. Without printing tools, every pod stops at the gap, and no more chips
   are finished.
In-canvas words: tool names; Other wafers, same tools; Out, to be tested; Missing; Transistors; Wiring; Silicon; One
wafer, cut through; readout "1,000 to 1,500" with "Steps to make one chip" and "SIA estimate, 2025".

## Placement (for the main session; content/09 not edited)
Front matter: insert as the first element of "figures", right after the line ` "figures": [`, one line with four spaces
of indent, as chapters 4, 6 and 7 do for their animations:
    {"id": "fab-loop", "type": "animation", "src": "fab-loop", "title": "How a fab builds a chip, layer by layer", "note": "Simplified. A real fab has many tools of each kind, spread across the building, and a chip has far more layers than shown. The layers are drawn far thicker than they are."},
Body: `{{figure:fab-loop}}` on its own line, blank line before and after, right after the How it works paragraph that
begins "At each tool a robot lifts one wafer out" and ends "A chip takes hundreds of those visits, so a wafer spends
months inside." (line 77 on 20 October 2026), before "The pod keeps the wafer clean...". Reason: paragraphs 2 and 3
describe exactly what the animation shows (pod, overhead track, robot, the five jobs, the loop restarting per layer);
the figure follows the text it illustrates; the clean-air and recipe paragraphs after it are not shown. If those
paragraphs are rewritten, place it after whichever paragraph describes the tool loop.
Tested in a throwaway copy (scratchpad, since deleted): front matter parses, build adds the figure to the main page and
the static chapter page and copies the six media files; check-speak "no matches"; check-integrity only the known
supplier warnings; check-sources flags only three unclassified CSIS links in content/01 (another agent's). Shots:
qa/round2/shots/anim-fab/placed-mobile-light.png, placed-mobile-dark.png, placed-desktop-light.png.

## Unsure
- 26.7 s is the longest animation on the site (others 16.4 to 24.2 s). Captions average about 4.3 words a second, as in
  dep-etch; steps 2 to 4 last about 2 s each, so their captions are 9 to 10 words.
- The 1,000 to 1,500 steps cover the whole chip; ch 13 words it as "a finished, packaged chip". The readout follows
  ch 6's "make one chip", but it appears as the wafer leaves the fab, so a reader could take it as fab steps only.
- "Every layer needs a print" rests on ch 4's How it works sentence ("at least one per layer"), which has no citation of
  its own.
- Simplified drawing: lithography is one box (scanner and coater together); in the cut-through the layer takes its final
  materials at the etch step. Small uppercase labels (SIA estimate, 2025; Silicon; One wafer, cut through) are too small
  to read on a phone, as in the other animations; tool names, Missing, Transistors, Wiring and the number do read.
