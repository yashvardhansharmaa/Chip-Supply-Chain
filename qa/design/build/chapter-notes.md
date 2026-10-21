# Chapter builder: notes (21 October 2026)

Report: `qa/design/design-chapter-review.md`, with the owner's decisions in `BUILD.md`. Shots: `qa/design/build/chapter/<name>-before.png` and `-after.png`, same viewport and scroll. The before shots come from a copy of `dist/` taken before any builder changed it (shot as `file://`), the after shots from the live server. Port 9942. Readable pages are shot with `?theme=light` unless the name ends in `-dark`, since this machine's system theme is dark and those pages follow it.

## Done

| ID | What | Where | Shots |
|---|---|---|---|
| P1.1 | Bar charts are HTML rows. Each label is whole, beside its bar from 641 px up (label column as wide as the longest label, at most 45 percent) and above it below that. Square bars, no grey track. The sr-only table stays. | `build/build.js` `figure()` (type `bars`); `src/styles.css` and `chapter-page.css`: the `.bars` SVG rules replaced by `.hbars` | `p1-1-bars-eda-1440`, `p1-1-bars-pkg-1024`, `p1-1-bars-eda-390`, `p1-1-bars-tel-320` |
| P1.2 | Footnote marks sit on their word. The space before a citation is swallowed, the mark's margin is 1 px and its padding 0 1px (the `::before` box keeps the 24 px target). | `inline()` (both citation regexes start `\s*`); `sup.cite` in `src/styles.css` | `p1-2-cites-costs-1440`, `p1-2-cites-geo-390` |
| Decision 4 (replaces P1.3) | Stacks: the largest share that is not a remainder is garnet; the rest take `#2b63c4, #1f9a6d, #c9a10c, #5a48b8, #e06a1f` in data order (dark `#4f86dc, #2a9670, #ad8f14, #7f6fd4, #c96a2a`); a light tail past five (`#c9c6bf` / `#4b5159`); remainders hatched with a hairline edge; the lead's legend figure in `--accent-ink`. The three country stacks keep `COUNTRY_COLOR`, never twice in a chart; Europe takes `--c2`; regions and remainders turn `#8a9099`, then `#b4b9be`. "Japanese companies" reads as Japan. | `build.js` `stackKeys()`, `STACK_REST`, `COUNTRY_STACKS`, `COUNTRY_ADJ`; tokens `--stk-*` in a block after `.stack-legend` in `src/styles.css` (light and `[data-theme="dark"]`), and in all three token blocks of `chapter-page.css` plus its print block | `c-stack-pcshare-1440(-dark)`, `c-stack-lithomix-1440(-dark)`, `c-stack-asmlregion-1440(-dark)`, `c-stack-wafer-1440`, `c-stack-resist-1440`, `c-stack-bom-1440`, `c-stack-pkg-390`, `c-static-pcshare-390` |
| P2.3 | Bars in `--bar-4` ink, garnet on the largest (`.hb.top`, ties each), its value in `--accent-ink`. | `figure()`; `.hb-r i`, `.hb.top` | `c-bars-litho-1440(-dark)`, `c-bars-margins-1440`, `c-static-litho-figs-1440(-dark)` |
| P1.4 | No sideways scroll from the flashcards at 320. | `.fc-more` wraps, `.fc-card` one `minmax(0, 1fr)` track, `.fc-marks` wraps | `p1-4-fc-320`, `p1-4-fc-geo-320` (the before shows the card pushed off the left edge) |
| P1.5 | Timeline marks on their rule. | `.prose .tl` in both stylesheets | `p1-5-timeline-1440`, `p1-5-timeline-static-1440` |
| P1.6 | The ledger key replaces the 9 px chain foot: a bar and a name for each band the stages hold (today Extreme and High), hidden at 900 px and below with the rest of the chain. | `build.js` `LEDGER_KEY`, `chapterHTML()`; `.ch-ledger .ledger-key` | `p1-6-ledger-1440`, `p1-6-ledger-1024` |
| P1.7 | Dark `--bar-4: #636a73` in both dark blocks of `chapter-page.css` (frame set it in `src/styles.css`). | `chapter-page.css` | `p1-7-ledger-1440-dark`, `p1-7-static-strip-1440-dark` |
| P2.1 | The fixed rail is gone, code and all: `{{RAIL}}` and its `<nav>` in `src/template.html`; `railHTML` and `fill('RAIL')` in `build.js`; `railItems`, the rail's `aria-current`/`done` loop and its show/hide in `Sections`, the Router's one-line hide and the rail branch of `headerH()` in `src/app.js`; the `.rail` rules and `.chain-foot` rules in `src/styles.css`. The ledger column sits at `--masthead + 28px`. | as listed | `p2-1-rail-1440`, `p2-1-rail-costs-1440` |
| P2.2 | The card says each band once: the head keeps its label, and the two cell values are the glossary buttons the tags were (`.gl-term.v-btn`, same `data-term`, `data-note`, `data-test`, plus `data-head` so the popover still reads "Extreme concentration"). The concentration cell takes `BAND_NOTE` as its `.sub`. The card ends on the text's edge (`max-width: var(--measure)`), and from 901 to 1100 px the bands share a row with the price under them. On the readable page `plainTerms()` turns the buttons into `<span class="v-btn" title="…">`. | `nameplate()`; `.plate`, `.v-btn` in both stylesheets; `.plate-tags` and `.ptag` rules removed | `p2-2-card-1440`, `p2-2-card-1024`, `p2-2-card-390`, `p2-2-card-static-1440`, `p2-2-card-static-390` |
| P2.4 | Tables: a column is a figure column (`th.n`, `td.n`) when 60 percent of its filled body cells are figures (footnote marks aside) or the Markdown aligns it `---:`. Right-aligned, tabular digits, no wrap. Number ranges in those cells only take an en dash, U+2013 (`$2,800–3,100`). Today's hits: ch 03 wavelength, ch 16 estimate, range and gross margin, ch 17 share. | the table branch of `markdown()`, `TABLE_FIGURE`; `.prose td.n` in both stylesheets | `p2-4-table-costs-1440`, `p2-4-table-margins-1440`, `p2-4-table-costs-390`, `p2-4-table-static-1440` |
| P2.5 | Chapter head: facts on one line (words / min · Specimen: … · Updated …), actions on the next (Link to chapter · Cite this chapter · Chapter PDF). The essay and the readable pages take the same split (no Link to chapter on a readable page). A wrapped facts line never starts on a dot: each fact carries its dot in an 18 px slot and the line's left 18 px is clipped. On phones the actions lose their dots. | `chapterHTML()`, `citeBlock(ch, day, page, lead)`, `copyLink()`, `fill('GEO_CITE')`, `geoBody`; `.ch-meta`; the cite-line rules in `src/template.html`; `readableHTML()` and `EXTRA_CSS` in `social.js` | `p2-5-head-1440`, `p2-5-head-1024`, `p2-5-head-390`, `p2-5-head-essay-1440`, `p2-5-head-static-390` |
| P2.7 | Sources close the text, before Previous/Next, under an ink rule, with the +/− at the line's right end. The essay too. The readable page keeps its order, as the report says. | `chapterHTML()`, `geoBody`; `.chapter-sources` | `p2-7-sources-1440` |
| P2.8 | The Chain opens like the other tabs. | `.howto` rules | `p2-8-chainhead-1440`, `p2-8-chainhead-390` |
| P3.1 | Contents: each chapter's one-liner in place of the four section links. | `contentsItem()`; `.contents-grid` | `p3-1-contents-1440`, `p3-1-contents-390` |
| P3.3 | Shorter phone chapter head: the numeral beside its two labels on one ruled line. | a `@media (max-width: 900px)` block before the flashcard section | `p3-3-phonehead-390`, `p3-3-phonehead-geo-390` |
| P3.4 | A unit of eight characters or fewer goes on every value (`$60M`, `$2,900`, `$1,187/kg`, `48 tools`, `1,200 GB/s`, `56.8%`; a word unit joins with a no-break space) and the title tag goes. Longer units keep the tag. The two titles that spell "($M)" drop it, in the build (no content edit). The sr-only tables read the same. | `unitOnValue()`, `withUnit()`, `figTitle()`, `tableFallback()` | `p3-4-units-mask-1440`, `p3-4-units-hbm-1440` |
| P3.5 | Disabled Previous card / Next card are not drawn (space kept). `.fc-nav` loses its 16 px right margin. | `.fc-link…:disabled`, `.fc-nav` | `p3-5-fcsteps-1440` |
| Decision 13 | The leader's China line is gone from the cards: the `.lead-cn` link in `nameplate()`, the now unused `EXPOSURE` index in `build.js`, and its CSS in `src/styles.css` and `social.js`. | as listed | `d13-leadcn-1440`, `d13-leadcn-static-1440` |

Also: a glossary term inside a table head now takes the head's capitals (`.prose th .gl-term`), so "Gross margin" no longer sits in mixed case among capitals.

## Class names for print
- Bars: `.hbars` (holds `--lw`, `--vw`), `.hb`, `.hb.top`, `.hb-l` (label), `.hb-r` (bar `i` and value `b`). The old `svg.bars` is gone.
- Stacks: `data-k` on each `.stack-bar i` and `.stack-legend span`: `lead`, `1` to `5`, `tail`, `rest`, and in the country stacks `c1` to `c7`, `n1`, `n2`. Tokens `--stk-1` to `--stk-5`, `--stk-tail`, `--stk-edge`, `--stk-n1`, `--stk-n2`. `data-k` also names print.js's footnotes, but on other elements.
- Ledger key: `.ch-ledger .ledger-key`, `.lgk[data-band]`.
- Contents: `.contents-grid .item` is now a grid; the one-liner is `.contents-grid .ol`; the `ul`/`li` are gone.
- Card: `.gl-term.v-btn` inside `.plate-kpis .v`; the head has no `.plate-tags`/`.ptag` now. print.js line 255 (`button.gl-term:not(.ptag)`) will now treat the two cell buttons as glossary terms; it probably wants `:not(.v-btn)`. print.css `.plate-head .ptag` and `.plate .lead-cn` are dead.
- Tables: `th.n`, `td.n`.
- Head: `.ch-meta` now holds the Updated day; the cite line's first action is `a.ch-copy.ch-cite-copylink`.
- Sources: `.chapter-sources summary::after` carries the +/− (no `::before` now), and the block comes before `.prevnext`.

## Changed from the report, and why
- **Chart colors** follow the owner's middle way, not P1.3's ink ramp. The lead is the largest share that is not a remainder, so a remainder is never garnet (no chart is affected today).
- **P2.5**: the specimen name stays among the facts ("Specimen: EUV scanner"), since the plate keeps its wording (decision 8) and the name would otherwise leave the page. The facts line's dots use a clip, so a wrapped line does not start on a dot (the report's `.label + .label::before` rule did, at 1024). At 1024 the Lithography facts still take two lines, the day on the second; the column is about 530 px.
- **P2.4** applied to five columns; the memory table's bandwidth and capacity cells are phrases ("over 1.2 TB/s"), so they stay left.
- **P3.4**: only the two "($M)" titles change, as decided. The germanium chart's title still says "($/kg)" while its values now read "$1,187/kg", which repeats the unit; the owner may want that title trimmed too. "% of wafer revenue" (ch 09) is longer than eight characters, so its values stay bare with the tag.
- **P2.1**: the template's `.chapter--essay .ch-cite` margin and the 640 px rule for the old first span were removed with the cite-line change. The phone's walk rail (`#wk-rail`, frame's) is untouched.

## Not done
- P3.2 and the plate renaming in P2.5 (owner kept them as they are), P2.6 (frame's).

## Checks
- `node build/build.js`: no warnings. `check-speak`: no matches. `check-integrity`: the one known Veeco line. `check-sources`: all tier A or B.
- `document.documentElement.scrollWidth` at 320: 320 on The Chain (every chapter, with every flashcard shown and turned) and on `/lithography/`, `/component-costs/` and `/geopolitics/`.
- `src/modules/lookup.js` (data's) still names `.lead-cn` in a list of things to strip; it is harmless now.
- Building rewrites `build/page-dates.json` for every chapter whose page changed (bars, card, head), so their Updated day moves to today.
