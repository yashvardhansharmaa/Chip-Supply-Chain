# Stage: labels (29 October 2026)

Branch `redesign-labels`, cut from 25d8080, worktree `chokepoints-rd-labels`, preview http://127.0.0.1:8786/. The brief is `MAIN/qa/excellence/BUILD-BRIEF.md`, part "labels".

## What was built

**1. The labels on the HBM, CoWoS and silicon specimens.**
- `data/specimen-parts.json` now holds Silicon and Wafers, Memory and HBM and Advanced Packaging in Lithography's format: number, name, maker or stage, and the points (`at`). The CoWoS and silicon names, makers and points are the mockup's `SPEC`, unchanged. Two small additions to the format, both from the mockup:
  - `label`, the shorter name on a balloon ("TSVs", "Logic dies", "HBM stacks");
  - `link`, a maker line ending in a link to a section ("Microbumps: joined by the memory maker, see How a stack is built"). The build warns if the link names no section of the chapter.
- The silicon parts' short phrases from the chapter are in, as approved.
- HBM's points are new, since the drawing is new (below). All four sit on the cut plane, so the same points serve both versions.
- `build/build.js` (`partsHTML`, `data-parts`) and `build/modules/social.js` (`stillSVG`) read `label` and `link`. Lithography's output is unchanged: its sentence in `stillSVG` still lowercases "Light source" and the rest.

**2. The CoWoS spacing, ported into `src/app.js` `Stage.drawBalloons`.** On a side where any name stands under its balloon, the balloons keep 58 px apart, and the last one keeps 40 px from the foot. Elsewhere they stay 34 px apart and 18 px from the foot. The strip shows no names, so it is unaffected. This is `balloons-wide.js`, with the name's width measured by one shared helper.
- **Lithography does not move.** Its balloon positions are identical to 8766 at 1440, 1280, 1100 and 1024, and in the phone's open strip. Its shots match pixel for pixel at 1440 and 1024, light and dark (`labels/litho-before.txt`, `labels/litho-after.txt` and the `lithography-*-litho-*` shots).
- CoWoS keeps 58 px on both sides, as in the mockup. `labels/advanced-packaging-1440-light-after.png` matches `labels/mock-cowos.png`.

**3. The stills, made as Lithography's is.** Lithography's is a 772 px square render of the live drawing, with its points in still pixels. `qa/redesign/stills-parts.js` makes the same for each other chapter with parts:
- it opens the chapter at 1440 with motion reduced and reads where the runtime projects each part;
- it shoots the drawing alone on white, squares it to 772 px, and writes `build/assets/specimens/<id>-annotated.webp` and the `still` entry.

The stills are used in three places:
- **Print:** the chapter prints the still with its balloons (`stillSVG`, in the figure's template). Checked in the PDFs below.
- **The door to the chapter:** the next-chapter door shows it (`doorStill`).
- **The Chain's contents and the phone's 52 px strip thumbnail:** both use the line drawing made from the still. `python3 build/line-stills.py` was rerun, and only these three changed.

The three plain stills go: `build/assets/specimens/<id>.webp`, their `stills.json` entries and `dist/media/spec-<id>.webp`. Lithography has none. `qa/redesign/stills.js` now skips any chapter with an annotated still.

Two items in the brief no longer exist in the code:
- **The readable page** was retired on 28 October. The chapter page is the only page.
- **No WebGL:** the page hides the drawing's slot and keeps the caption and the parts list, as for Lithography. No still is shown, and none was before. Checked for all four chapters (`qa/redesign/check-labels.js`).

## The HBM drawing

**Why today's is hard to read** (`labels/memory-and-hbm-1440-light-before.png`):
- Every die is a stippled box: four sides, a top face and two outlines, all inside a stippled molding shell.
- The renderer draws through solids, in perspective. The near and far sides of twelve thin dies therefore land in different places, up to about three die thicknesses apart at the top and bottom, and the layers fuse into a gray box.
- The 36 vias run as faint haze through the middle.
- The gaps are only 55 percent of a die thick.
- The stack spins about the screen's upright after its tilt, so as it turns it leans and shows its underside.
- At 52 px the strip's thumbnail is a gray cube.

**What both versions change:**
- The inside is drawn on a cut plane, where nothing behind falls out of step, as figure 09.1 does in 2D.
- No molding shell.
- Gaps of about one die thickness. Each die is drawn 15 times its 30 micrometers, and the whole stack stands 15 times the cube's 0.72 mm, so the caption's "about fifteen times" holds.
- The base die is copper, wider and twice as thick.
- Copper vias run from the base die to the top, with copper microbumps in every gap on the vias' pitch.
- The stack turns on its own axis. `turntable` in `src/app.js` now makes every turn, including the idle spin, the scroll and the swing, about the specimen's own axis. No other page uses a turntable specimen.

**The two versions** (`specimens/hbm-stack.js`, `?hbm=a` and `?hbm=b`):
- **A, the cutaway (set as the default).** The whole stack seen from above at three quarters, with the quarter nearest the reader cut away. The two cut faces show the dies, the gaps and the vias in section. The outside shows the twelve square plates. It reads from every angle as it turns.
- **B, the slice.** A slice 1 mm thick through the middle, seen nearly face on inside a faint outline of the cube. It is the clearest of the three at a glance and at 52 px. But it repeats figure 09.1's view, and as it turns it narrows to a thin column for about a quarter of each turn.

**The owner picks.** A is the default because it shows the object as well as its inside, and it never turns edge on.

To keep B instead:
1. Set `DEFAULT = 'b'` in `specimens/hbm-stack.js`.
2. Run `node qa/redesign/stills-parts.js --only memory-and-hbm`, then `python3 build/line-stills.py`, then `node build/build.js`.
3. Delete the other version's branch of the file.

The parts and points need no change.

**The HBM caption** now says the stack is "pulled apart and cut open", so the cut is not read as part of the object. The rest is unchanged.

## Shots (in `qa/redesign/labels/`, local only)
- **HBM before:** `memory-and-hbm-{1440,390}-{light,dark}-before*.png`.
- **HBM after:** `memory-and-hbm-hbma-…-after*.png` and `memory-and-hbm-hbmb-…-after*.png`. At 390 there is `-strip.png` (the strip at three times its size) and `-open.png`.
- **Side by side:** `hbm-compare-1440.png`, `hbm-compare-390.png`, and `thumbs-hbm.png` (the 52 px thumbnail, today against A against B).
- **CoWoS and silicon:** `advanced-packaging-*`, `silicon-and-wafers-*`.
- **The doors:** `doors-after.png`.
- **The stills with their points marked:** `stills-points.png`.

## Checks
- **Build and static checks:** `node build/build.js` passes, with no warnings. `check-speak`, `check-integrity`, `check-sources`, `check-size` and `check-seo` all pass.
- **`check-links --local` on 8786:** no broken links.
- **`smoke.js --port 8791`:** 47 page loads, no failures.
- **Against 8786, all pass:** `check-perchapter`, `stage-chapters --base`, `check-cites`, `check-figs`, `interact-chips --base`, `datacheck-chips --base`, `interact-glossary`, `interact-suppliers` and `interact-masthead`.
- **`interact-chapter`:**
  - The first run failed two phone checks on Lithography: the masthead coming back on the way up, and the strip's read rule. Both depend on timing, and this branch does not touch scrolling.
  - On a second run every check passed. Every check also passed on 8766.
- **New: `qa/redesign/check-labels.js`, all pass.** It checks, for all four chapters:
  - the balloons and their spacing;
  - the parts list against the data file;
  - the print still's template and picture;
  - the page without WebGL.

  It also checks that both HBM versions draw with four balloons and that the default is A.
- **PDFs:** silicon, HBM and CoWoS were printed on DevTools port 9366 with `build/chapter_pdfs.py`, Edition of 29 October 2026. They come to 11, 10 and 12 pages (before: 10, 10 and 11).
  - Each prints its still with numbered balloons over the caption and parts list (`labels/pdf/parts-pages.png`).
  - Final layout pass: no notes lost or stranded and no overflow. HBM's pass is fully clean.
  - Silicon and CoWoS are one page longer, because the still adds about a third of a page to page 1. Each now ends with its last few sources, the colophon and the citation on a page of their own. `pdf.py` reports this as `sources` and could not pull them back (`labels/pdf/*.log`, `labels/pdf/tails.png`).
  - **Not committed.** quickwins changes the same chapters, so the lead should reprint them after merging. The copies are in `labels/pdf/`.
- **No check was changed.**

## Left for later
- **The social cards still show today's HBM drawing.** This includes each card's 14-stage shelf and the home card. Rerun `qa/redesign/card-art.py`, `build/cards.py` and `build/home_card.py` once the owner has picked.
- **On a phone, `?hbm=b` still shows A's thumbnail in the collapsed strip.** That thumbnail is the default's line drawing. The B shots show B's own, made from its still.
- **HBM's still is 123 KB,** against Lithography's 87 KB.
