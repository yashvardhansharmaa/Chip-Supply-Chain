# first-screen: notes (20 Oct 2026)

Slug `first-screen`, screenshot port 9814. Shots in `qa/round2/shots/first-screen/`. Helper scripts (measure, tab order, throttled load) were kept outside the repo.

## The problem
On a 390 x 844 phone the first screen was the hero, then "Other pages", a five-link menu that repeats the tabs (`00-before-mobile.png`). The walk's first paragraph started at 888 px, below the fold.

## Sketches (real data, injected with `--eval`)
- A, ladder: one line per stage, number, name, four-step meter and word (`01-sketch-a-mobile.png`). **Chosen.**
- B, strip: the 15 bars of the static chapter pages, captioned (`01-sketch-b-mobile.png`). Compact, and paragraph 1 shows, but it has no stage names, so it teaches nothing about the sequence. Each cell is 22.6 px wide, under the 24 px minimum.
- C, two columns (`01-sketch-c-mobile.png`). Reads down and then across, so "09" sits beside "01". Most names wrap, and it looks like a grid of cards.

Why A: it is the summary page's own "chain at a glance" in its phone form, so it reads as the same site. The garnet meters form one column, which is the visual, and each stage takes one line. The names teach the order a chip is made in, and every row is a full-width target.

## What changed
- `build/modules/walk.js`: new `GLANCE` block, placed in the hero header after the meta line and before "Other pages".
  - Rows come from `ctx.stages` and the chapter cards (`data.chapters[].band`), so no list is typed.
  - The count is computed (8 of 15).
  - The sentence's meaning of Extreme comes from `ctx.BAND_NOTE.Extreme` ("this stage" becomes "each", and "of it" is cut so it fits three lines). If the note changes, the clause drops.
  - Each row links to its chapter with the same href as "Read the chapter" (`#<id>`).
  - The screen-reader text is "04 Lithography Extreme concentration".
  - The header comment was updated.
- `src/modules/walk.css`: new block after the Other pages styles.
  - `.wk-gl` is hidden by default. At 700 px or less it shows, and `.wk-head .wk-tabs` is hidden.
  - The number sits in the ledger column (`--gutter`), so names line up with the walk's text below.
  - The meter matches the summary page: 6 px bars, 5/8/11/14 px tall, `--accent-fill` at Extreme, `--bar-4` at High, `--muted` below. Unlit bars use `--line`.
  - The word is garnet and 600 weight at Extreme.
  - `text-wrap: balance` keeps a long name from leaving one word alone on its second line.
  - Hover, active and focus turn the name garnet. The focus outline sits at a 2 px offset.
  - At 380 px or less the meter and word are narrower.
  - No transitions and no motion.
- `src/modules/walk.js`, `src/app.js`, `build/modules/social.js`: unchanged.

## Other pages
On phones it is no longer on the home page. Every page stays one tap away in the masthead tabs and the Contents sheet, and the walk's end links reach three of them. From 701 px up, nothing changed.

## Desktop
Unchanged (`07-after-desktop.png`). The desktop first screen already shows the first paragraph, and its tabs list every page in full. `09-sketch-desktop-option.png` shows the ladder on desktop as an option for the owner. It takes the same height as Other pages, but in two columns six names wrap and the order runs down and then across.

## Static /home/ and JavaScript off
`/home/` is a forwarding page (zero-second refresh plus `location.replace`) that shows one paragraph, not the walk, so it was not touched. With JavaScript off the main page shows no view at all, because every `.view` starts `hidden`; this was already so before this change. The ladder is plain links and CSS and needs no script.

## Measurements (390 x 844 unless noted)
- Hero unchanged: title 96-130, meta ends at 232. Ladder from 256: label, a three-line intro (also three lines at 360 px), rows from 366.
- Rows visible:
  - Above the 48 px strip that headless Chrome shows: 13 of 15 rows.
  - Above the 128 px strip of a WebGL phone: rows 1 to 10 (`08-after-390-with-128px-strip.png`).
  - The last row ends at 852. The walk starts at 887, with paragraph 1 at 952.
- At 360 x 780: the ladder starts at 289 (the title takes two lines), with 12 rows above the 48 px strip.
- Tap targets: 15 of 15 rows are at least 28.8 x 354 px (29 x 324 at 360 px). The two names that wrap make 49 px rows, "Chemicals, Gases / and Photoresist" and "Transistors and / the Front End".
- Keyboard: from the top, Tab reaches the first row after the tabs, search, theme and the strip's Contents button. The focus ring is visible in both themes and the name turns garnet (`06-keyboard-focus-390.png`, `06-keyboard-focus-390-dark.png`).
- Round trip: tapping row 04 opens The Chain at Lithography (chapter top 82 px). Back returns to the home page at the same scroll position (300 to 300).
- Breakpoint: 700 px shows the ladder, 701 px and 768 px show Other pages.
- Contrast:
  - Light: muted 5.6, ink-2 9.4, garnet 9.4 to 1.
  - Dark: muted 6.3, ink-2 10.6, red 5.0, wine bars 3.0 to 1.

## Page weight (slow-network sanity)
- Before this change: 3,770,876 B raw, 810,201 B gzip. That is the current build with the ladder taken out; at the start of the session the page was 3,754,578 B, and other agents' edits make up the rest.
- After: 3,779,599 B raw, 811,411 B gzip. Cost: +8,723 B raw (5,740 markup, 2,983 CSS) and +1,210 B gzip, about 6 ms at 1.6 Mbps.
- No new requests: no images, no scripts, no `url()`.
- The ladder sits 265 bytes after the hero title in the HTML. Under Slow 4G throttling (150 ms, 1.6 Mbps, 4x CPU) the title, the first row and row 10 all appeared at the same moment. The local server sends no gzip, so its absolute time (19.9 s for 3.78 MB) is not comparable to GitHub Pages.

## Checks (final run)
- `node --check` passed on build/modules/walk.js, src/modules/walk.js and src/app.js. The build passed.
- check-speak: no matches.
- check-integrity: only the known "exposure row for Veeco Instruments has no supplier entry".
- check-sources: all citations tier A or B.

## Screenshots
- Before: `00-before-mobile.png`, `00-before-desktop.png`
- Sketches: `01-sketch-a-mobile.png`, `01-sketch-b-mobile.png`, `01-sketch-c-mobile.png`
- After:
  - `02-after-390-light.png`, `03-after-390-dark.png`, `04-after-360-light.png`
  - `05-after-390-full.png` (the whole page, 21,022 px)
  - `06-keyboard-focus-390.png`, `06-keyboard-focus-390-dark.png`
  - `07-after-desktop.png`, `08-after-390-with-128px-strip.png`
  - `09-sketch-desktop-option.png`

## For the owner
1. **Where a row leads:** to the chapter in The Chain (`#lithography`), as briefed. The alternative is the stage's paragraph lower on the same page (`#/walk/lithography`), which keeps a phone reader in the ten-minute walk.
2. **Desktop:** unchanged. The ladder could replace Other pages there at no cost in height (`09-sketch-desktop-option.png`).
3. **Specimen strip:** on a WebGL phone the 128 px strip covers rows 11 to 15 at first. Keeping it at its 48 px button row until the walk begins would show the whole ladder.
4. **Other pages on phones:** if the end of the walk should list every page, add AI Chips and Glossary to its end links. The end belongs to intro-deck, so it was left alone.
5. **Wording:** the intro says "today", taken from the card's own definition (the summary page says the same). The writing guide prefers a date to "today".
