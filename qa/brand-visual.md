# Brand and visual review

Options only; nothing outside `qa/` was touched. Mocks are copies of `dist/index.html` with the token block overridden, plus two standalone pages. Ratios are computed WCAG 2.1; font sizes are the latin woff2 bytes Google serves.

## Verdict on the current identity

Nearly right. Body ink is 15.76:1 light and 15.31:1 dark (`current-chapter-light.png`, `-dark.png`), and the specimen is the best thing here: a grey point cloud of an EUV scanner with the 13.5 nm beam in amber (`current-chapter-specimen-light.png`, `-dark.png`; software WebGL, since plain headless capture hides the stage and leaves the right column empty elsewhere).

Two faults. Amber does three jobs at once: the severity band on the rail, the "In plain terms" border, and the emitted light in the specimen. Nine of fifteen stages are band 4, so on a chapter page amber is the majority state, not the alarm. And it is too weak to signal in light mode: `#c98a12` on `#edeff0` is **2.55:1**, under the 3:1 floor for graphical objects, against **9.22:1** in dark. `palette-ramp-compare.png` shows the cost. The board ramp runs open, case by case, presumption of denial, prohibited, yet the amber "presumption of denial" pill reads lighter than the dashed pill one rung below it (`current-board-now-light.png`).

The wordmark is weakest (`wordmark-detail.png`, row 1): 0.06em tracking makes it wide, and the mono tagline at `--muted`, 5.22:1, has nothing between it and the wordmark, so the two fuse into one grey band matching the tab labels. Index category labels at 10px wrap to three lines (`current-index-light.png`).

## Three palettes

**Bay** (close to current; greys and accent tuned). `palette-bay-*.png`.
Light: ground `#edeff0`, second `#e3e6e8`, ink `#12161a`, secondary `#37404a`, muted `#545d66`, line `#c3c9ce`, accent `#a06a05`, accent ink `#6d4703`, accent soft at 13%.
Dark: `#101315`, `#171b1e`, `#e7e9ea`, `#c0c7cc`, `#949ea6`, `#2f363c`, `#d9a12a`, `#eec063`, 16%.
Body 15.76:1 / 15.31:1; accent **3.99:1 / 8.07:1**, so the two themes differ by 2.0x rather than 3.6x; muted rises to 5.81:1. The pill ramp now reads in order (`palette-bay-board-now-light.png`).

**Foolscap** (warm paper ground: the export control record, Federal Register stock, licence letters). `palette-foolscap-*.png`.
Light: `#f4f1ea`, `#ece8df`, `#191614`, `#4a443d`, `#6b6459`, `#d5cfc3`, accent `#9c4a12`, accent ink `#7a3809`, soft 11%.
Dark: `#17140f`, `#1e1b15`, `#ece7dd`, `#c8c1b4`, `#948d80`, `#322d25`, `#e0763a`, `#f0996a`, 16%.
Body 15.96:1 / 14.90:1; accent **5.47:1 / 5.97:1**, the only option where the themes match. The map turns sand (`palette-foolscap-home-light.png`); dark reads as a lamp on a document (`palette-foolscap-board-dark.png`). Cost: the accent stops being litho bay yellow.

**Reticle** (bolder: chrome on quartz, near white ground, true black ink). `palette-reticle-*.png`.
Light: `#f7f8f8`, `#eceef0`, `#0b0e11`, `#333c45`, `#4f5860`, `#c9ced3`, accent `#b03a20`, accent ink `#8c2c16`, soft 10%.
Dark: `#0b0e11`, `#13171b`, `#f2f4f5`, `#c7ced4`, `#929ca4`, `#2b3238`, `#e8654a`, `#f28f78`, 16%.
Body 18.19:1 / 17.54:1; accent **5.68:1 / 5.89:1**. Strongest signal, worst fit: with nine stages at band 4 the rail becomes a wall of red and the chain reads as a crisis (`palette-reticle-chapter-light.png`). Needs band 4 re-cut first.

## Three type pairings

Current payload, latin woff2: **292.0 KB**. Newsreader alone is 195.1 KB of it.

**Archivo display, Newsreader body, Plex Mono** (`type-archivo-hero-light.png`, `-chapter-light.png`). One variable file with a width axis replaces five static condensed files, so wordmark, tabs and chapter number share a family at different widths. **348.9 KB**, up 56.9 KB.

**Plex Sans Condensed, Source Serif 4 body, Plex Mono** (`type-sourceserif-*.png`). Larger x-height, sturdier figures inside sentences. **270.2 KB**, down 21.8 KB. `--measure` is calibrated to Newsreader and needs re-cutting; at 25em the dek runs short.

**IBM Plex throughout: Condensed, Serif, Mono** (`type-plex-*.png`). One superfamily, so a figure in a table and in a sentence match. **146.8 KB**, half the current payload, against the 2.6 s throttled LCP in `qa/audit-performance.md`. Plex Serif reads more technical, less literary.

## Wordmark

`wordmark-options.png` (four bars at 56px, four 375px phone shells); `wordmark-detail.png` (2x crops).

**A, set solid**: tracking to 0.018em, a hairline rule between the texts, tagline lifted to `--ink-2` (8.72:1). Same words, now a nameplate with a caption.
**B, weight break**: COMPUTE in 400, CHOKEPOINTS in 700, no tagline in the bar. Quietest, and the tabs gain room, but every page loses its one line of description.
**C, mark and stack**: a four bar mark taken from the chain rail, wordmark over tagline. The only option identical on phone and desktop, but the stack cuts cap height from 21px to 17.5px and loses presence at 1440. All four fit the 375px shell with room to spare.

## Social card

`social-card.png`, 1200x630, current identity (source `social-card.html`). Wordmark, "How AI chips are made", the home dek, "Seventeen chapters", "Nothing else is cited.", "Updated 10 September 2026", and the fifteen stage rail with its true bands. Every string is the site's own.

## Recommendation

Take **Bay**, and split the accent token. `palette-bay-chapter-specimen-light.png` shows why: the deeper `#a06a05` fixes the rail and the pill ramp but turns the EUV beam into paint rather than light. So set `--accent: #a06a05` for fills, borders and pills, and keep `--stage-accent: 201, 138, 18` for the specimen, where amber is an emission and not a warning. Pair it with **wordmark A**, three CSS lines. Foolscap wins on the numbers and the story but trades away the litho bay yellow the site was built on; keep it as the fallback. Reticle should wait for a re-cut band scale. On type, **Plex throughout** is the one change that pays for itself, 146.8 KB against 292.0 KB, if a more technical body face is acceptable; otherwise keep Newsreader.
