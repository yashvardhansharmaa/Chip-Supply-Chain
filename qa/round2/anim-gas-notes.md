# anim-gas: chapter 3 explainer animation (notes)

Slug `anim-gas`, screenshot port 9812. Animation file `animations/chemicals.html`, media `media/chemicals-*`.

## Idea chosen
A ring of six steps, one layer's loop, each fed by its own material from its own container (hydrofluoric acid, silane gas,
photoresist, etch gas, sputtering target, polishing slurry). One wafer goes round once while a list of the materials builds
up beside the ring. Then six wafers run at once, so every material is in use at the same time. Then resist stops arriving:
the fab works through its stock, the resist step goes dry, and the wafers pile up behind it until the loop stands still.
Last, a new supplier's resist waits beside the empty one while it goes through round after round of tests in the fab.

Why this one: the chapter's lede is that a fab uses a few hundred chemicals and gases and a shortage of any one can stop it.
A loop with one material per step shows the mechanism behind that sentence (every wafer needs every step, so the
materials are in series, and one gap jams the loop). The last step adds the chapter's reason the gap lasts (each resist is
tuned to the layers it prints and has to pass rounds of tests in the fab; SIA 2023, pp. 21-22, cited in the chapter).
Rejected: (a) one gas's route from cylinder to chamber teaches purity for one gas only, needs parts the chapter never names
(purifiers, switchover), and repeats the pipes-and-dots look of the power animation. (b) as briefed, a wafer travelling
from tool to tool, would repeat chapter 9's animation (anim-fab's `fab-loop`: a pod on an overhead track, tool to tool,
per its notes) and, in cross-section, the lithography and deposition-and-etch animations. The ring keeps the wafer's
route abstract and makes the materials and their supply the subject.

## Rules kept
- No numbers on the canvas. One number in a caption: "seven to 17 months" (step 4), copied from chapter 3, How it works
  paragraph 1: "Even a resist that passes the first time takes seven to 17 months to approve, the Semiconductor Industry
  Association wrote in 2023" (cited to the SIA PAG case study #page=22). Checked in the PDF, p. 22: "For materials that
  pass yield qualification on the first attempt, the overall timeline for qualification would be seven to 17 months."
  That sentence replaced the uncited "takes years" at 02:31 (another agent's edit, during my run); if it changes again,
  the step-4 caption in animations/chemicals.html must follow and the animation be re-rendered.
- Materials and steps named: all from chapter 3's body (hydrofluoric acid, silane gas, photoresist, etch gases,
  sputtering targets, polishing slurries, layers, stock/stockpiles, tests in the fab).
- Source check: SIA PAG case study (2023), p. 21 "Each substitution needs tuning for the specificity of the layer(s) on
  which it is used"; p. 22 "some of these materials will have to be qualified serially rather than in parallel";
  p. 21 "it has been rare to find a drop-in solution". Saved at qa/round2/scratch/anim-gas/sia-pag.pdf.

## Steps and captions (media/chemicals.json, 24.6 s, 760 x 420)
1. One layer (0.4 s): A chip is built up in layers. For each layer the wafer goes around the same loop of steps, and each
   step uses its own chemical, gas or metal.
2. All at once (8.0 s): A fab runs many wafers through the loop at once, layer after layer, so it uses every one of these
   materials all the time.
3. One runs out (12.6 s): If one material stops arriving, the fab works through its stock. When that runs out, wafers
   pile up at that step, and the whole fab stops.
4. A new supplier (19.0 s): A new supplier's resist goes through round after round of tests in the fab before any wafer
   can use it. Even one that passes the first time takes seven to 17 months to approve.
Headlines on the canvas, one at a time: One layer of a chip / Each step uses its own material / Many wafers at once /
Resist stops arriving / The resist step runs dry / A new supplier's resist needs testing (garnet, the last).

## Files
- New: animations/chemicals.html; media/chemicals-{light,dark}.mp4, -start.jpg, -end.jpg, media/chemicals.json.
- Changed (Edit): content/03-chemicals-gases-and-photoresist.md: figures entry `materials-loop` first in `figures`
  (one line, one-space indent, like ch 1, 5, 8); `{{figure:materials-loop}}` after How it works paragraph 1 (the hidden
  twin of `plain`), the same place as ch 2, 6, 8 and others. Title "Why one missing material can stop a fab"; note
  "Simplified diagram. A few materials stand for the many a fab uses, and each real layer uses its own mix."
- Rendered with `python3 build/animate.py chemicals --port 9812` (own port, so it cannot attach to another agent's
  Chrome on 9412). New bibliography entries: none.

## Checks (20 Oct)
- Front matter parses as JSON. node build/build.js: exit 0, ch 03 "3 figures", no warnings for it. check-speak: no
  matches. check-integrity: exit 0, only the known Veeco warning. check-sources: 2438 citations, all tier A or B.
- Inline script passes node --check. Videos: 590 frames, 24 fps, 1520 x 840, yuv420p, BT.709 tags, about 1 MB each.

## Screenshots (qa/round2/shots/anim-gas/)
static-{desktop,mobile}-{light,dark}.png (poster, steps as text, note); interactive-{desktop,mobile}-{light,dark}.png
(video playing at about 17 s or 22 s; step buttons and caption in sync). Light shots need `?theme=light` explicitly:
headless Chrome follows the Mac's dark appearance otherwise. The interactive page scrolls smoothly, so the screenshot
script must scroll with behavior 'instant'.

## Unsure
- The loop's order (clean, deposit, resist, etch, metal, polish) is a simplified wiring layer; the note says simplified.
- Chapter 9's fab-loop also shows a loop of steps per layer; the two share the word "loop" on purpose, but the owner
  may want to see both side by side.
