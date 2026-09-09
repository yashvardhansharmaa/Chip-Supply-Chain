# The walk and the start-here block (9 September 2026)

Tier 1, item 1 of `reader-critique.md`: the site had no front door, and its plainest writing sat
fourth in every chapter. `#/walk` now assembles those 18 paragraphs into one read, and a three-way
chooser sits under the hero.

Files: `build/modules/walk.js` (the two blocks), `src/modules/walk.css`, `src/modules/walk.js`
(progress rail only). Nothing else was touched.

## What was built

**`#/walk` — "How a GPU is made".** The 18 chapters in number order. Each block carries the chapter
number on a spine, the stage number where the chapter is one of the 15 stages, the title, the `plain`
paragraph verbatim, up to three leaders with country codes, the chokepoint score, and a link to the
full chapter. Head: dek, 18 paragraphs, 1,855 words, about 8 minutes.

**`START_HERE`.** One row of three under the hero, above the scored chain strip: the walk, the 18
chapters (`#contents`), and sources for researchers (`#/sources`, with a second link to `#/controls`).
188 px tall at 1280 px. Every entry title is 14.5 px against a 19 px body, so nothing there is a
heading larger than the reading face.

Every string comes from `ctx.all` and `ctx.data` — paragraphs, names, codes, scores, and the counts
in the deks (1,855 / 23,579 words, 344 sources, 40 thresholds) are all computed. Nothing was typed
from memory.

## Two decisions worth flagging

**"Eight minutes", not "ten".** The brief and the domain both say ten. 1,855 words at the site's own
230 wpm is 8, and the reading time had to be computed, so the page and the chooser both say eight
rather than contradict the number beside them. Change the divisor in `build/modules/walk.js` if the
ten-minute framing matters more than consistency with the chapter heads.

**Amber only at 5 of 5.** The chapter nameplates fill every "on" pip amber whatever the score. Here
the pips take the scored chain strip's colours instead — `--bar-5` amber at 5, `--bar-4` ink at 4,
`--bar-3` grey below — so a newcomer reading 18 scores in a row sees amber mean one thing.

## Anchors

A step's id is `/walk/<chapter>`, so `#/walk/<chapter>` both keeps the router on this view (it reads
`walk` out of `/^#\/([a-z-]+)/`) and scrolls natively, with no JavaScript. `src/modules/walk.js` only
adds the sticky progress rail and re-does the jump after a cold load, where the router scrolls to the
top on arrival. It uses a timer, not a frame callback, so a deep link opened in a background tab still
lands on its step.

## Verified

Served build at `http://localhost:8765`, light and dark.

- 18 blocks render; all 18 paragraphs byte-identical to `content/*.md` (compared by script).
- Every href in both blocks resolves to an id in the document or a view the router knows (39 in the
  walk, 4 in start-here).
- 375 px: no horizontal overflow anywhere on the page. The only elements past the viewport are the
  site's own `.skip` link and the masthead's scrolling tab strip, both pre-existing.
- 375 px: previous/next appear at the end of each block, hidden at 1280 px. Step 1 has next only,
  step 18 previous only.
- Start-here sits between the hero and `#chain` at both widths; three across at 1280, stacked at 375.
- Paragraphs hold `var(--measure)` (494 px at 19 px) and the site's reading size (19 / 18 / 17 px).
- Deep links land correctly: `#/walk/advanced-packaging` cold-loads to the block with the masthead
  cleared; in-page previous/next scroll without leaving the view.
- "Read the chapter" from step 5 opens `#lithography` in the stack view.
- Console clean on every view; all ten views still route.
- Dark mode: every colour is a token, no hardcoded values in the stylesheet.

## Not done

The walk has no specimen. `#/walk` registers without `stage: true`, so the 3D panel stays hidden and
the text gets the full width. Worth revisiting if the walk becomes the site's main entrance.
