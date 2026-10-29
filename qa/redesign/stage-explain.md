# Stage "explain": the two approved explainers, built (29 October 2026)

Branch `redesign-explain`, cut from 25d8080, in `chokepoints-rd-explain`. Preview http://127.0.0.1:8789/. Brief: `MAIN/qa/excellence/BUILD-BRIEF-2.md`, the "explain" part. Nothing pushed or merged.

## What was built

### Figure 04.2, "How several passes turn one line into four" (Lithography)
- **Where:** right after the multipatterning paragraph at the end of How it works, before Variants and trade-offs.
- **Version:** the mockup's latest:
  - no mask drawn in the EUV lane, which carries the label "Light reflected off a mirror mask";
  - the cut removes a teal line, so the four wine lines stay four;
  - no step-total line.
  - The six steps, captions, ghost target, brackets, colors and tiles are the mockup's.
- **Link:** "in several passes per layer" in Deep ultraviolet links to the figure and reads "(figure 04.2)", as in the mockup.
- **Kicker:** "Figure 04.2 · Explainer, 26 seconds".
- **Motion:**
  - it plays while on screen and loops;
  - a click on the drawing pauses it and shows the Paused mark;
  - a step plays from where that step starts.
  - Under reduced motion it opens paused on the last step (Cut), as the videos do.

### Figure 07.1, "Why big chips lose more to defects" (Metrology and Inspection), in place
- **Steps:** today's four steps and captions, unchanged. Each step sets the sliders and plays its own change.
- **Sliders:** chip size, 1 cm to 26 × 33 mm, and defects per square centimeter, 0.1 to 1.0, with 0.8 marked "textbook example".
- **Readouts:** under "The model's output". At the chapter's inputs they read 49.2, 11.3 and 20.1.
- **Kicker:** "Figure 07.1 · Interactive explainer". The old video is gone from the page.

### Links from other chapters
- Foundries and Fabs (08) and Who Controls the Chain (16) now point to the new figure with "(see figure 04.2)". It goes after the sentence on SMIC printing its tightest layers in several passes.
- The mockup notes list these two links as part of the proposal the mockup could not show.
- The link sits on "figure 04.2" and leaves "several passes" alone. When the link sat on "several passes", chapter 16 lost its multipatterning look-up.

### How it goes through `figure()`
- **Front matter:** a figure of type `animation` with `"live": "<name>"` takes its steps (`k`, `cap`) from the front matter. `"seconds"` makes it a timed explainer, and without it the figure is interactive.
- **`build/build.js`:** one new branch in `figure()` draws the step bar, the stage (`.anim-stage[data-live]`), the caption, the transcript, the print still and the note.
- **Through that path:**
  - numbering;
  - the rail's figure list;
  - the figure's address;
  - the Paused mark;
  - the print rules.
- **`build/validate.js`:** a live figure needs its steps and its module.
- **`src/modules/live-saqp.js` and `live-yield.js`:** each draws into its stage. They are ported from the mockups, one instance per figure, with nothing from the mock switch.
  - `src/modules/live.css` holds their styles.
  - Every label is 11.5 px or more, in place of the mockup's 11 px tick notes.
- **`src/app.js`:** the video code, `Anim.init`, now skips figures without a video. This is a one-line change.
- **Print and PDF:**
  - the live parts hide;
  - the still `media/<name>-print-end.jpg` prints with the number, title, steps and note.
  - The stills are shot from the preview, light, with the ground taken to white, by `qa/redesign/live-stills.js`.
  - On paper, 04.2's near-square still is held to 100 mm tall.
- **Table, CSV, PNG and Cite:** none, as for every explainer. The owner ruled on 27 October that an explainer has no Cite, and it holds no data rows. 04.1 has none either.
- **Unused files:** `dist/media/defects-*`, the old 07.1 video and stills, are no longer used and were removed from `dist/`. The sources in `media/` and `animations/defects.html` stay.
- **Rail spacing:** Lithography's rail, with six figures, ran 2 px past a 900 px window. The gap between rail parts went from 14 px to 12 px in `src/modules/chapter.css`.

## Renumbering and references

| Figure | Was | Now |
|---|---|---|
| several-passes | new | 04.2 |
| tool-price | 04.2 | 04.3 |
| euv-shipments | 04.3 | 04.4 |
| litho-mix | 04.4 | 04.5 |
| asml-region | 04.5 | 04.6 |

**References updated:**
- the rail's figure list, which follows the figures;
- `qa/redesign/interact-chapter.js`, which expected asml-region as 04.5 in two checks and now expects 04.6;
- the comment in `build/build.js` on the range figure: "04.2's $350–400M" now reads "04.3's".

**Searched for other references:** `content/`, `data/`, `build/modules/`, `src/` and `specimens/`. Before this change, nothing referred to a Lithography figure by number. Chapters 08 and 16 only linked to the chapter.

**check-figs:** it names figures by id, not number. Its expected count stays 112 of 112, so it needed no change.

**`qa/redesign/check-perchapter.js`:** it took a chapter's first explainer to be a video. It now seeks the first video explainer, because 07.1 has none. Its count is 335 checks, the same as before.

## The imec source on "core" and "etched back"
I checked the cached copy, `MAIN/qa/bib-cache/0e391ad12ecd3a4541631bdda431c7264acfc90a.html`, "EUV lithography: weighing the options", imec, June 2019. This is the source the multipatterning paragraph cites.
- **Not in the source:** "core", "mandrel", "etched back" and "etch back". The one "core" in the article is about STT-MRAM, not patterning.
- **The source's own words:** SAQP "relies on one lithography step (to create a pre-pattern of lines) and additional deposition and etch steps (to create spacer-like features)". Each initial line "of the pre-pattern ends up in four lines". The breaks are a "block layer" or "blocks".
- **The glossary's words:** "deposits and etches thin spacer films along its edges" and "Cut masks".
- **What I did:** I kept the approved words: "Core", "called cores" and the step "Etch back". If the owner wants the source's words, two swaps would do it, and both are in content/04's front matter and `live-saqp.js`'s labels:
  - "Core" becomes "Printed line";
  - "Etch back" becomes "Etch".

## Checks
All were run on the final commit against http://127.0.0.1:8789/. Outputs are in `qa/redesign/explain/`.

- **Static checks:** after `node build/build.js` (no warnings), all five pass.
  - `check-speak`: no matches.
  - `check-integrity`: no problems. Its one warning, on chapter 06, was there before.
  - `check-sources`: 2,847 citations, all tier A or B.
  - `check-size`: no file over 5 MB.
  - `check-seo`: no problems. Its one note, the /supply-chain/ title length, was there before.
- **`check-links --local`:** no broken links in 28 pages and 1,221 addresses.
- **`smoke.js --port 8795`:** 47 page loads, no failures.
- **`check-perchapter.js`:** all 335 pass.
- **`interact-chapter.js`:** all pass.
  - One earlier run failed "the rail fits the window" at 810 px in 808, which the rail spacing above fixed.
  - The same run failed "the strip's wine rule fills" once. Every run alone, before and since, passes it.
- **`stage-chapters.js --base`:** 10 of 10.
- **`check-cites.js`:** 3,320 marks, 0 problems.
- **`check-figs.js`:** 112 of 112.
- **Chips:**
  - `interact-chips.js --base`: 93 of 93.
  - `datacheck-chips.js --base`: 1,384 values, 0 mismatches.
- **Other pages:**
  - `interact-glossary.js`: 90 of 90.
  - `interact-suppliers.js`: 65, 0 failed.
  - `interact-masthead.js`: all pass.
- **`qa/redesign/check-explain.js` (new):** 74 of 74. It covers:
  - placement, numbering 04.1 to 04.6 and the rail;
  - the three links;
  - the latest version, read from the canvas pixels: no mask pixels in the EUV lane at 2.4 s, and at the end teal ×3, wine ×4, teal, the cut's gap, teal;
  - no total line;
  - reduced motion and motion;
  - dark;
  - 07.1's readouts at the chapter's inputs and the sliders;
  - labels at 11.5 px or more, and no sideways scroll at 390;
  - phone fit: wafer, readouts and sliders take 603 px of 844;
  - print, with the still shown and the live parts hidden;
  - errors.
- **`qa/redesign/sweep-yield.js` (the ported `sweep.js`):** 6 of 6. All 456 settings have 0 mismatches, and the wafer holds 120 and 26 chips. 49.2, 11.3 and 20.1 come back from the model and from the page through the sliders.

## PDFs
- **Printed:** Lithography, Metrology and Inspection, Foundries and Fabs, and Who Controls the Chain. I used `build/chapter_pdfs.py --base http://127.0.0.1:8789/ --port 9369`, Edition of 29 October 2026. Logs are in `qa/redesign/explain/pdf-logs/`.
- **Pages:** 14, 11, 16 and 16, the same as the last edition.
- **Fonts:** all embedded, no Type 3 and no Times.
- **First Lithography run:** refused. 04.2's tall still pushed a step off page 5. I capped the still at 100 mm tall on paper, and the second run printed clean.
- **What I checked in the PDFs:**
  - 04.2 prints on page 5 as its still, under "Figure 04.2 · Explainer, 26 seconds" and its title, with the six steps and the note.
  - 07.1 prints on page 4 as its still at the chapter's inputs, with its four steps and note.
  - Figures 04.3 to 04.6 carry their new numbers.
  - The text reads "several passes per layer (figure 04.2)".
- **The retired chapter's copy:** `transistors-and-front-end.pdf` follows Foundries and Fabs, as the build makes it.

## Not done, or left for the merge
- **The book PDF and the summary PDF:** not reprinted. The book is printed once per edition, so it belongs after the five branches merge. Until then its chapter 4 shows the old numbers and its 07.1 is the old video still.
- **The Paused mark:** 11 px (`--fs-cap-s`) on every explainer, 04.1 included. It is the site's shared mark, so I left it as is. `check-explain.js` leaves it out of the 11.5 px count and says so.
- **Labels inside the drawings:** they are written by the modules, which `check-speak` does not read, because it strips scripts. I read them against the writing rules by hand and found nothing.
- **Browser pane:** not used. It was shared, and another session moved its tab. All shots and checks ran in headless Chrome over a pipe (`qa/redesign/cdp.js`).
