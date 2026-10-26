# One chapter per address: stage report

26 October 2026, branch `redesign`. The change the owner approved in design round three and the build left out (design round three, `qa/design3/ux/recommendations.md` in the main checkout, recommendation 1): The Chain shows one chapter at a time, at the address each chapter already has, and each chapter ends on a door to the next one. Before it, The Chain was one page of all 17 chapters, 221,389 px tall at 1440.

## What was built

**The Chain's tab (`#/chain`) is the contents page.** It shows what sat at the top of The Chain (its title, standfirst, How to read a chapter and the contents) and no chapter. Each row links to its chapter. The tab title reads "The Chain · Chip Supply Chain".

**Each chapter shows alone at its address** (`#lithography`). `<html data-chain>` names what The Chain shows: `contents`, a chapter's id, or `pending`. A style the build writes (`{{CHAIN_ONE}}` in `src/template.html`, from `build/build.js`) hides the rest, on screen only. Every deeper address opens its chapter first, then lands: a section (`#memory-and-hbm--how-a-stack-is-built`), a figure (`#fig-advanced-packaging-package-build`), a source, the flashcards. A link from one chapter's text to another opens that chapter at its top. The DOM still holds all 17 chapters, so site search, the Glossary's passages and print read them all.

**Before boot, the right chapter paints and no other.** `src/preroute.js` reads the chapter from the anchor's id (every id in a chapter starts with the chapter's id, or with `fig-`, `cite-` or `cite-fig-` and the chapter's id). The build writes the chapter ids into it and checks every id on the page against it (`preroute:` warnings in `build/build.js`). An id it cannot place waits as `pending` until its element arrives.

**The end of a chapter is a door to the next one**, the hybrid mockup's `.nextx` (`qa/design3/directions/hybrid/chapter.html`). On an ink rule: Previous, small, in the first quarter ("Previous, stage 03", the title). In the rest: "Next, stage 05 / 15", the next chapter's title as large as a chapter's own, its one line, a "Continue to chapter 05" pill with the arrow in an ink circle, and a still of its specimen, as the mockup's door has. The whole of it is one link. Chapters 16 and 17 are not stages, and the site groups them as "Across the chain" (the contents, the phone's sheet), so the door into chapter 16 and 17 reads "Next, across the chain", and Previous from chapter 17 "Previous, across the chain". The last chapter's door leads back to the contents: "Contents", "All seventeen chapters", one line on what the chain covers, and "Back to the contents". On a phone the next chapter comes first, its still under the button, then Previous. The existing `prevnext` was restyled (one builder, `chapterDoor` in `build/build.js`), and the readable pages `dist/<chapter>/` end on the same door, leading to the next readable page.

**Moving to another chapter starts it at its top. Back and Forward return the reader to their place** in the chapter they left. The router's history marks (`cpPlace`) now restore a place on any Back or Forward within The Chain, not only on a return from another view. After a link to another chapter, focus goes to that chapter's title (the link it was on is hidden).

**Print stays whole.** The hiding rules are for the screen alone, so the browser's print and print emulation show all 17 chapters with the head and the contents. `build/pdf.py` lays the page out with Paged.js on screen, so `CP_PRINT.prepare` (`src/modules/print.js`) drops `data-chain` first. That serves the book and `build/chapter_pdfs.py`, which runs `pdf.py --chapter <id>` on `#/chain`.

**Smaller changes that came with it:**
- `Sizes` (`src/app.js`), which laid out the long page's chapters while the browser was idle, is gone. One chapter shows, laid out whole (`content-visibility: visible` while The Chain shows one), so a deep link or a returned place never lands on an estimated height. The `content-visibility: auto` rule stays for a page whose script does not run.
- Section tracking reads each view's own elements (`.view[data-view=…]`). `<html>` carries `data-view` too, so the bare selector took in the home page's hero, and the contents page put Lithography in the phone's strip. It shows chapter 01's specimen again, as before.
- Back to top on a chapter shows after one screen, as on other long pages. On the contents it follows the contents box, as before.
- `qa/scripts/smoke.js`: the chain route checks the contents shows with its 17 rows and no chapter shows; a new `chapter` route checks `#lithography` shows that chapter alone with its card and its door.
- `qa/redesign/sweep.js` gains `--set doors`.

Files: `build/build.js`, `build/modules/social.js`, `src/app.js`, `src/preroute.js`, `src/template.html`, `src/styles.css`, `src/modules/chapter.css`, `src/modules/print.js`, `qa/scripts/smoke.js`, `qa/redesign/sweep.js`, and the QA files below. The page dates were put back with `qa/redesign/keep-dates.js 11aeb7b` (no chapter's text changed).

## Checks

All on the final build unless marked.

| Check | Result |
|---|---|
| `node build/build.js` | no warnings (the new preroute check finds every id in its own chapter) |
| `check-speak`, `check-integrity`, `check-sources`, `check-size` | all pass (exit 0) |
| `node qa/scripts/smoke.js --port 9351` | 36 loads, no failures (adds the `chapter` route) |
| 1. Every chapter opens alone at its address | PASS, 17 of 17 on a slow line: one chapter, at y 0, under its own title; before boot each painted only itself. Run on the build before the last two commits (door still, strip fix, focus tweak), which do not touch what it measures |
| 2. A section and a figure in another chapter | PASS: by a link and on a fresh load, each lands 0 px from its mark in the right chapter; a link in chapter 02's text to Lithography opens it at y 0 |
| 3. The door, Back, Forward | PASS: door from Lithography (left at y 13,538) opens chapter 05 at y 0, focus on its title; Back returns to y 13,538; Forward to chapter 05's top. The rail, the Glossary tab and the contents rows behave the same; chapter 17's door opens the contents |
| 4. A search result inside a chapter | PASS: from chapter 01, "Controls and China's answer" opens Lithography with the heading 0 px from its mark, focused |
| 5. A Glossary passage link | PASS: "EUV", its passage in chapter 03 lands 0 px from its mark and flashes |
| 6. Suppliers or AI Chips stage link | PASS for Suppliers (Japan's atlas panel to chapter 03). AI Chips has no link to a stage, so nothing to follow |
| 7. Print emulation | PASS: at `#/chain` and at `#lithography`, all 17 chapters, the head and the contents print; no door prints |
| 8. Page height at 1440 | Lithography 14,532 px (scroll thumb 56 px), chapters 11,878 to 17,309 px; the whole chain as one page 221,389 px |
| 9. Every other way in | PASS: home, a look-up card, Export Controls' Read the chapter, the phone's contents sheet, slim bar and strip's Top, The Chain's tab |
| Text census (`census-chapters.js` against `git archive 11aeb7b dist`) | 0 lines lost, 0 added in all 17 chapters, the contents and 17 readable pages, door aside (`census-chapters.txt`, which also lists each old and new door). `census.js` on the other six views: no difference |
| Layout sweep, 390 and 1440, light and dark | 0 findings in 20 loads: four doors (Lithography, 15 to 16, 17 to the contents, the readable page) and the contents. Door text overflow probed at 13 widths, 320 to 1920: none |
| Test PDFs | not finished: `build/pdf.py` on `#/chain` (port 9352) was paginating its second pass when stopped to finish on time; the chapter run (`--chapter lithography`) did not start |

Output: `qa/redesign/stage-chapters.txt`, `census-chapters.txt`, `sweep-doors.txt`, `sweep-contents.txt`.

## Known issues and open questions

- **The book PDF and a chapter PDF were not completed as a test.** The code path is covered (print.js drops `data-chain` before Paged.js; print emulation shows every chapter), but a full `pdf.py` run should confirm page counts against the last edition.
- **The full sweep (`--set doors` and `--set chapters`, all 17) was cut short.** Only the four doors and the contents above were swept.
- The contents' standfirst still reads "This page covers each of the fifteen stages ... one chapter per stage". Left as written (content unchanged, and print.js rewrites its start for the book), but now the chapters live one per address the owner may want "The Chain covers".
- The browser's own find (Cmd-F) now searches one chapter, a cost the plan accepted. Site search covers all.
- A place kept for Back and Forward lives in memory, so a reload returns to the address's anchor (recommendation 2 is the fix).
- The door's still is about 100 KB, loaded lazily when the reader reaches the end of a chapter.
- `build/pdf.py` runs Chrome without the QA host block, so its page loads the fonts and the counter script from the web.

## Shots

`sh qa/redesign/shots-stage-chapters.sh` writes them to `qa/redesign/shots/stage-chapters/` (ignored by git), at 1440 and 390: `contents-top`, `contents-list`, `chapter-top`, `door`, `door-*-dark`, `door-15-to-16`, `door-17-to-contents`, `page-door`, `deep-section`. Taken before the strip fix, so `contents-top-390` still shows Lithography in the strip; rerun to refresh.

Art direction against the mockup: the door first had an empty right third and a pill stretched to its column; it now carries the next specimen's still as the mockup does, and the pill keeps its own width. In dark the still sat in a black box (the app's layer has no ground to blend with), so its box now carries the ground. The readable page's door was capped at the text's measure and its title ran into the still; it now runs the column's width.
