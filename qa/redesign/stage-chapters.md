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

RESULTS
