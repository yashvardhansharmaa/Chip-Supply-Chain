# anim-final notes (20 October 2026)

Slug `anim-final`. Renders use `python3 build/animate.py <name> --port 9890`; screenshots use `--port 9891`.
`build/animate.py` writes `media/<name>.json` from the page's `STEPS` (duration, fade, size, and each step's k, t0, cap),
so only `animations/<name>.html` is edited by hand and the render rewrites the JSON.
Shots: `qa/round2/shots/anim-final/`.

## Status
- [ ] silicon (ch 2, `silicon-and-wafers`): edits, render light+dark, sheet, static page phone check, json check
- [ ] mask (ch 5, `photomasks-and-pellicles`): edits, render light+dark, sheet, static page phone check, json check
- [ ] fab-loop line 13 comment (no re-render)
- [ ] dep-etch (ch 6, added by main session): STEPS[1].cap "A film a few atoms thick is laid over the whole wafer." -> "A thin film is laid over the whole wafer." (qa/round2/expert-deposition-and-etch.md near line 56)
- [ ] hbm-stack (ch 10, added by main session): Stack caption "...run straight down through all of them." -> "...run straight down through all but the top one." and the drawing skips vias in the top die; leave "about 30 micrometers" (qa/round2/expert-memory-and-hbm.md near line 41)
- [ ] transistor (ch 8, added by main session): steps "Inside a chip" (no colon or semicolon) and "All around" (qa/round2/expert-transistors-and-front-end.md lines 47 to 49)
- [ ] package (ch 11, added by main session): step 2 k "Silicon base" -> "Interposer", its cap, the on-canvas entry label; step 5 "Nearly every one..." -> "Most are put together by TSMC, in Taiwan." (qa/round2/expert-advanced-packaging.md lines 47 to 49)
- [ ] power (ch 15, added by main session): STEPS[3].cap "...Racks are heading for a megawatt each by 2027, so..." -> "...Nvidia plans for racks of a megawatt each from 2027, so..."; HEADS[3].s -> "Nvidia plans racks of a megawatt from 2027" (qa/round2/expert-data-centers-and-power.md lines 92 to 96, A1)
- [ ] chip-design (ch 1, added by main session): step 5 "Checked" cap (timing + printing checks; "a few months"); align any on-canvas label that repeats the old claim (qa/round2/expert-design-and-eda.md lines 59 to 62)
- [ ] wafer-test (ch 13, added by main session): four captions ("The wafer", "Needles", "Chip by chip", "Into the package"); optional sideView() motion (card stays at CARD_DOWN, chip row rises) only if small and safe (qa/round2/expert-test-and-assembly.md lines 61 to 66)
- [ ] defects (ch 7, added by main session): step 1 "puts them at" -> "assumes"; steps 2 and 3 "on a side"; canvas labels "Small chips, 1 × 1 cm" and "Big chips, 2 × 2 cm" (qa/round2/expert-metrology-and-inspection.md section 3, block C)
- [ ] build + checks

## Fixes (sources: qa/round2/expert-silicon-and-wafers.md section 5; qa/round2/expert-photomasks-and-pellicles.md section 3)

DONE. All 12 items applied. 10 re-rendered (light + dark); chemicals and racks caption-only, HTML and JSON edited.
Every media/<name>.json matches its HTML STEPS. Sheets: qa/round2/shots/anim-final/<name>-sheet[-dark].png. Phone
shots of the static chapter pages (figure crops of build/shoot.py --mobile --full): <chapter>-mobile[-dark].png.
Final checks: build exit 0; check-speak no matches; check-integrity only the known Veeco warning; check-sources 2,516
citations, all tier A or B.
Flags for the main session (outside my files): "same loop of steps" also in content/09-foundries-and-fabs.md and a
fab-loop.html comment; ch 13 figure note still says "on a silicon base"; hbm-stack canvas and caption say "silicon base"
(ch 10, not flagged by its expert); mask "sits just above the mask" vs the drawing's face-down mask.

Earlier progress (05:25): edits done in all 10 pages; rendered and sheet-checked silicon, mask, dep-etch, hbm-stack, transistor,
package, power; wafer-test, chip-design, defects rendering; package needs one more render (memory sub-line fix).

### Every string changed (before -> after); captions are page text via media/<name>.json, written by the render
1. silicon (ch 2). Refine cap: "Silicon starts as sand and rock. It is refined into rods so pure that, of every hundred
   billion atoms, fewer than one is anything else." -> "Silicon starts as quartz rock. It is refined into rods so pure that
   metal impurities are no more than a few parts per billion." Polish cap: "...polished until it is flat to within a few
   atoms, right out to the edge." -> "Each disc is ground, etched and polished to a mirror finish, flat right out to the
   edge." Canvas: 'Sand and rock' -> 'Quartz rock'; 'Polished flat to within a few atoms' -> 'Polished to a mirror
   finish'; readout '1' / 'in 100 billion' / 'Atoms that are not silicon' -> 'A few' / 'parts per billion' / 'Metal
   impurities' (expert's 'ppb' / 'Metal impurities, parts per billion' did not fit, see below). Header comment updated.
   Not changed: <title> "From Sand to Wafer" and the figure title (owner question 1 in the expert report).
2. mask (ch 5). The scanner cap: "one for each layer" -> "at least one for each layer". A mirror cap -> "No glass lets
   extreme ultraviolet (EUV) light through. So the mask for EUV layers is a mirror, built up from about forty pairs of
   very thin layers laid on glass, and the light bounces off it." One speck cap -> "A speck of dust on the mask prints on
   every wafer, until someone finds it. So a thin membrane on a frame, called a pellicle, sits just above the mask and
   catches dust where it is too far out of focus to print." HEADS t0 5.0: 'Glass stops this light' / 'The light now in use
   is too short to pass' -> 'Glass stops EUV light' / 'Every kind of glass soaks it up'. Comments: mask.html header,
   fab-loop.html line 13 ("at least one for each layer"; fab-loop not re-rendered).
3. dep-etch (ch 6). Deposit cap: "A film a few atoms thick is laid over the whole wafer." -> "A thin film is laid over the
   whole wafer."
4. hbm-stack (ch 10). Stack cap: "...run straight down through all of them." -> "...run straight down through all but the
   top one." Drawing: stack() gives the top chip no vias (both stacks). Header comment cites Micron's HBM4 page.
5. transistor (ch 8). Inside a chip cap -> "An AI chip does all its work with transistors, tiny switches built into the
   silicon. One Nvidia Blackwell GPU holds 208 billion of them. Making the switches is the front end of the factory, and
   wiring them together comes after." All around cap -> "Split it into thin sheets and wrap the gate around every side,
   and it shuts far tighter. That lets the switches keep shrinking, so each new chip can pack in more of them."
   Beyond the list: HEADS[5].s 'Shut tight, so switches can keep shrinking' -> 'Shut far tighter, so switches can keep
   shrinking' (same overstatement as the caption).
6. package (ch 11). Step 2 k 'Silicon base' -> 'Interposer'; cap -> "On it sits an interposer, a thin layer of very fine
   wiring that joins everything placed on top."; canvas entry 'Silicon base' -> 'Interposer'. Step 5: "Nearly every one is
   put together by TSMC, in Taiwan." -> "Most are put together by TSMC, in Taiwan." Comments (header, line 57) updated.
   Pre-existing overflow fixed: entry sub-line 'Hold the model’s weights and working data' -> 'Hold model weights and
   working data'.
7. power (ch 15). Water out cap: "Racks are heading for a megawatt each by 2027, so..." -> "Nvidia plans for racks of a
   megawatt each from 2027, so..."; HEADS[3].s -> 'Nvidia plans racks of a megawatt from 2027'.
8. chip-design (ch 1). Checked cap -> "The software checks that every signal arrives in time and that every shape can be
   printed, and a chip factory accepts only designs that pass the printing checks. The factory then prints the blueprint
   onto silicon through stencils, and changing it after that costs new stencils and a few months." No canvas label
   repeated the old claim (head: 'Checked before anything is made' / 'Only then is it printed onto silicon'). Header
   comment updated.
9. wafer-test (ch 13). The wafer: "Every stage so far makes chips." -> "Earlier stages make the chips." Needles -> "Thousands
   of needles on a probe card press onto one chip. They touch small metal pads on its surface." Chip by chip -> "The wafer
   moves under the needles, chip by chip. The tester marks any chip that answers wrong, and that chip goes no further."
   Into the package: "glues together" -> "bonds together". Motion change applied (card fixed, wafer row moves up and
   down). Comments updated ("silicon base" -> "interposer" in two comments).
10. defects (ch 7). Specks land: "puts them at 0.8" -> "assumes 0.8". Small chips: "1 centimeter square" -> "1 centimeter
   on a side". Big chips: "2 centimeters square" -> "2 centimeters on a side". Canvas: 'Small chips, 1 cm square' ->
   'Small chips, 1 × 1 cm'; 'Big chips, 2 cm square' -> 'Big chips, 2 × 2 cm'.

11. chemicals (ch 3, added by main session; caption only, no re-render). One layer cap: "...goes around the same loop of
   steps, and..." -> "A chip is built up in layers. For each layer the wafer goes around a loop of steps like this one,
   and each step uses its own chemical, gas or metal." Edited in animations/chemicals.html STEPS and media/chemicals.json
   (the page never draws `cap` on the canvas; animate.py only copies STEPS into the JSON). "Coat" -> "Print" not applied.

12. racks (ch 14, added by main session; caption only, no re-render). Light between cap: "Training a large model takes
   many racks, too far apart for copper. The links between racks carry..." -> "Training a large model takes many racks,
   most of them too far apart for copper. The links between them carry the signal as flashes of light in glass fiber."
   Edited in animations/racks.html STEPS and media/racks.json (STEPS used only for timing on the canvas).

### Measured (real fonts, scratch tool)
- silicon readout: expert's label 'METAL IMPURITIES, PARTS PER BILLION' = 248.4 px from x 520, ends at 768 > 760 canvas.
  Used value 'A few' + unit 'parts per billion' + label 'Metal impurities' (unit ends at x 719). Same words, no 'ppb'.
- mask head 'Glass stops EUV light' 200.5 px; sub 'Every kind of glass soaks it up' 222.2 px (old 292.1). Fit.
- transistor sub 'Shut far tighter, so switches can keep shrinking' 350.6 px from x 40 (readout at 504). Fit.
  This head change is mine, beyond the expert's list: "Shut tight" made the claim the expert corrected in the caption.
- package: pre-existing overflow. 'Hold the model’s weights and working data' = 293.4 px from x 470, ends at 763 > 760.
  Now 'Hold model weights and working data' (259.2 px, ends 729; 'Connects the part to the circuit board' ends 726).
- hbm-stack: top chip drawn without vias in both stacks (stack(): `i < n - 1 ? tsvA(i) : 0`); checked zoomed frames
  at t 10.4 and the end, light and dark. Micron HBM4 page fetched: "Another produces thicker top dies without TSVs."
- wafer-test motion: card fixed at CARD_DOWN; row translated by drop = (1 - S.c) * 56; 'Metal pads' and 'One chip,
  still on the wafer' ride with the row (else the lowered row overlaps the second label, t 5.4 to 6.8).
