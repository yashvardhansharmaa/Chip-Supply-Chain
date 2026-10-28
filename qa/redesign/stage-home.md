# The home hero back to the old structure: stage report

Branch `redesign-home`, 27 Oct 2026. The owner found the live home "more minimalist and straight to the point" than the redesign's hero. The hero now follows the live home's structure. The redesign's type, colors and white ground stay, and so does everything below the hero.

## What the hero is now

From top to bottom, at every width:

1. **The title**, "How AI chips are made", in Source Serif 4 at the redesign's page-title size (`--fs-d1`: 66 px at 1440, 47 px at 1024). It sits on one line at every width from 320 px up. On a phone it is `min(46px, 9vw)`: 35 px at 390 and 46 px on a tablet.
2. **The subtitle**, "An introduction to the entire semiconductor supply chain.", in Source Serif 4, balanced so that no word stands alone on a line.
3. **The meta line**: "16 paragraphs · 2,468 words · about 11 min". It is set in Fragment Mono with a dot between items, as a chapter's facts line is. All three counts are computed as the old walk computes them, from the plain paragraphs of the Introduction read below. The live site says 17 paragraphs because it predates the merge of chapters 8 and 9.
4. **An ink rule**, then the kicker "The chain at a glance" in Fragment Mono. It is sentence case, as the redesign sets every kicker, rather than the old letter-spaced capitals.
5. **The sentence**: "**7 of the 14 stages** are rated Extreme, meaning three or fewer firms could supply each today, or one firm holds more than half." The counts come from the cards and the meaning from the card's note (`BAND_NOTE`). The emphasis is ink at weight 600, not wine, because a count is a data value.
6. **The list**: the 14 stages in chain order, one row each. The old home showed only the stages, so the two "across the chain" chapters are not listed. Each row has:
   - the number in Fragment Mono. From 901 px it hangs in the ledger column, right-set where the walk's big numbers are. On a phone it sits in the 34 px column inside the rules.
   - the stage name in Source Serif 4, a link to its chapter (`href="<id>/"` and `data-route="#<id>"`, as the redesign's chapter links are).
   - the band from the card: a four-step meter and the band word in Hanken Grotesk. Extreme is ink and High is the lighter tint (meter `--bar-4`, word `--muted`).
7. **The specimen** on the right, unchanged: the drawing, then the label and the description centered under it, with the description in Hanken Grotesk. On a phone the strip at the foot of the screen stays. The default specimen is chip design (stage 01).

The title, subtitle, meta line, sentence and stage names all share one left edge, the walk's text edge. This was the old layout.

## How the list picks the specimen

- The meter and word together form one button, the row's "meter area". Hovering it picks that stage's specimen once the pointer has rested on it for 110 ms, so a pointer crossing the list on its way to the drawing does not flick through the stages. Only the pointer's own movement arms a pick: content scrolling under a still pointer picks nothing. A click or focus picks at once.
- A click on the name goes to the chapter.
- The row whose specimen is showing is the only row in wine: its number, meter and word. Wine marks the reader's selection here, never a band.
- Keyboard: the names are ordinary links in the Tab order. One meter button is in the Tab order, the picked one. Arrow keys, Home and End move between the buttons and pick as they go, as the Suppliers pipeline and the removed bar chart did. Each button is a toggle (`aria-pressed`) whose name reads "Extreme concentration. Show its specimen".
- On the home page the stage now sits right after the hero, so Tab reaches the list before the specimen (`Stage.place` in `src/app.js`).
- A pick still shows if the reader has scrolled until the walk's first step has crossed the reading line while the last rows are still on screen. Before this fix, the row turned wine but the stage kept the step's specimen. `Sections.hold` in `src/app.js` now keeps the hero on the stage while any part of it is on screen. It clears once the hero has scrolled away, and only the home page sets it.

## Removed, and where their jobs went

- **The bar chart** ("7 of the 14 stages are rated Extreme", 14 bars and the key). Its count and its meaning are now the sentence. Its specimen picking is now the list's meters.
- **The hero's search field.** Search stays in the masthead: the search button, Ctrl+K or Cmd+K, and "/".
- **"Introduction →" and "Each stage, in detail →".** The Introduction read (the walk) follows directly under the hero, as on the old page. The Chain is reached from the masthead tab, from each row of the list, and from Other pages at the end of the walk.
- **The separate "The chain at a glance" section** below the hero, which on 8766 repeated the list under a large heading. It is now the hero's list, so the list appears only once.

Below the hero nothing changed: the walk (16 steps with their facts, leaders, bands and "Read the chapter"), the flashcards, Other pages and the footer with its "Updated" day. `build/page-dates.json` took the home page's new content hash, and its modified day stays 27 Oct 2026.

## Files

- `build/modules/walk.js`: the hero markup (title, subtitle, meta line, glance list with picker buttons). The EVIDENCE and FIND blocks are gone.
- `src/modules/walk.js`: the picker (hover with rest, click, focus, arrow keys, `Sections.hold`), replacing the marks' picker and the search hand-off.
- `src/modules/walk.css`: the hero and list styles, desktop and phone. The evidence, search and link-block styles are gone, as is the 901 to 1199 px title override.
- `src/app.js`: `Stage.place` puts the stage after `#wk-hero`, and `Sections.hold` was added (two small changes, walk only).
- `build/build.js`: one comment updated (it said the home search field shows the glossary count).
- `qa/redesign/interact.js`: rewritten to drive the new list. It used to drive the removed marks, search field and link blocks.
- `dist/`, `build/page-dates.json`: rebuilt.

## Checks (final build)

| Check | Result |
|---|---|
| `node build/build.js` | no warnings |
| `qa/scripts/check-speak.js` | no matches, exit 0 |
| `qa/scripts/check-integrity.js` | no problems, exit 0 (one warning that predates this change: a figure with no year on chapter 06's card) |
| `qa/scripts/check-sources.js` | 2,815 citations, all tier A or B |
| `qa/scripts/check-size.js` | 863 files, none over 5 MB |
| `qa/scripts/smoke.js --port 9401` | 36 page loads, no failures. Smoke never checked the removed hero parts (its home check counts the walk's steps), so it is unchanged. |
| `qa/redesign/stage-chapters.js --base http://127.0.0.1:8774` | 9 of 9 pass (`stage-chapters-home.txt`). Its "home page, a stage in its chain" check now follows the hero list's link. |
| `qa/redesign/sweep-full.js http://127.0.0.1:8774 390,1024,1440`, light and `?theme=dark` | 6 loads, 0 findings: no sideways scroll, no overlap, no text under 11 px, nothing clipped (`sweep-home.txt`). An extra pass at 320, 768 and 1280 was clean too. |
| `qa/redesign/interact.js http://127.0.0.1:8774` | 49 checks at 1440 and 390, all pass (`interact-home.txt`). They cover every row's link (href, data-route, name), every row's meter with a real mouse click (the right specimen, number and title on the stage, that row alone marked), hover with rest, the keyboard (Tab order, Home, End, arrows, Enter on a name), Back, the pick with the walk begun under it, and the masthead search. |

Measured at 1440 × 900, the whole list ends at 891 px, so the hero fits in the first screen. At 1024 the list runs about 20 px past the first screen. At 390 and 320 there is no sideways scroll. Long names such as "Chemicals, Gases and Photoresist" break into two even lines, with the number and meter on the first line.

## Shots

In `qa/redesign/shots/home/` (the folder is git-ignored), all from 127.0.0.1:8774 unless noted:

- `home-1440.png`, `home-1024.png`, `home-390.png`: the hero, light
- `home-1440-dark.png`, `home-390-dark.png`: the hero, dark
- `home-1440-pick07.png`: stage 07 picked, its row in wine and its specimen on the stage
- `home-1440-seam.png`: the end of the list and the start of the walk
- `home-390-full.png`: the whole home page on a phone
- `old-live-1440.png`, `old-live-390.png`: the live home (MAIN's `dist/index.html`, opened from a file with the counter script removed), for comparison
- `before-8766-1440.png`, `before-8766-390.png`: the redesign before this change

## For the lead

- **The meter.** The brief asked for the old "small band meter", so the list uses the old four-step meter in ink and tint. Elsewhere the redesign draws a band as one bar (solid for Extreme, an outline for High): the chapter kicker, the card and the summary. If the two marks should match, the meter could become that bar. It is a CSS-only change.
- **Hover picks only on the meter area**, as the brief says. Hovering a name picks nothing; a click on it opens the chapter.
- **`Sections.hold`** is a small change to the shared scroll tracker in `src/app.js`. Only the home page sets it, and The Chain clears it on its first update.
- Left as they were: `START_HERE` in `build/modules/walk.js` (not placed on any page) and the `glossary` entry in the build's module context, which the home no longer reads.
