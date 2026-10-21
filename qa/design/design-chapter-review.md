# Design review: The Chain and the chapter (design-chapter, 21 October 2026)

Shots: `qa/design/shots/design-chapter/` (each proposal has a `-before.png` / `-after.png` pair at the same viewport and scroll). The injected CSS and JS for every pair is in `qa/design/shots/design-chapter/proof/` (`all.css` + `all.js` apply everything at once). Chapters studied closely: 01 Design, 04 Lithography, 07 Metrology, 10 Memory and HBM, 11 Advanced Packaging, 16 Economics, 17 Geopolitics, plus the static pages `/lithography/`, `/memory-and-hbm/`, `/component-costs/`, `/geopolitics/`. Viewports: 1440 x 900, 1024 x 768, 390 phone, 320; light and dark. Shots were taken with a scratch copy of `build/shoot.py` that adds `--enable-unsafe-swiftshader` so the WebGL specimen renders (the stock script's `--disable-gpu` hides the stage, so stock shots show no specimen); port 9922.

## Verdict

The chapter is a good page with a few bad habits. The ledger column, the ruled card, the Fraunces numerals and the plain-terms box set a calm, credible voice, and the prose reads well at 37em. What lets it down is what a reader looks at second. The figures don't follow the ledger. The bar charts cut their own labels mid-word ("Static timing (Synopsys Pr"), and the stacked bars use an eight-hue rainbow that repeats colors inside one chart. Footnote marks hang a space away from their word and wrap onto lines of their own. In dark mode the High bars come out brighter than the Extreme ones, so the main rating reads backwards. Then there are the doubles. The chain is drawn twice, once in the fixed rail and once in the ledger. The card says both bands twice, the cells and the head both carrying them. The head runs five meta items over two lines, with a link to the chapter set among the facts. And the card stops 35 px short of the text's right edge. None of this needs a new idea. It needs the ledger's rules (ink, one garnet mark, hairlines, figures that line up) applied to the charts and the furniture as strictly as they already are to the type. Two things are plainly broken: horizontal scroll at 320 px from the flashcards, and a 9 px label under the site's own 9.5 px floor.

---

## P1: broken, ugly or confusing

### P1.1 Bar charts cut their labels at 26 characters
- **Where:** every `bars` figure. Affected now: ch 01 `tool-lock` (all four labels lose the product name: "Static timing (Synopsys Pr", "Physical verification (Sie", "Synthesis (Synopsys Design", "Emulation (Cadence Palladi"), ch 06 `tel-tool-share` ("Deposition (furnace, ALD, "), ch 10 `hbm-bandwidth`, ch 11 `china-backend-tools` ("Advanced packaging fabrica"). On phones the 600-unit SVG puts every label at about 8 px.
- **Wrong:** `figure()` in `build/build.js` line 111 writes `String(d[0]).slice(0, 26)` into SVG text. The truncation drops what the label is there to say, and an SVG label can't wrap or keep a readable size on a phone.
- **Change:** draw `bars` as HTML rows. Keep the sr-only table. Label beside the bar from 641 px up (the label column is as wide as the longest label, at most 45 percent). Below that, the label sits on its own line above its bar. Square bars, no grey track (the track ran to the chart's maximum, not to 100, so on share charts it implied a total that isn't there).
  ```js
  // build/build.js, figure(), type 'bars': replaces the <svg class="bars"> string
  const lw = Math.max(...data.map((d) => String(d[0]).length)), vals = data.map((d) => fmtNum(d[1]) + (f.unit === '%' ? '%' : ''));
  const vw = Math.max(...vals.map((v) => v.length));
  body = `<div class="hbars" aria-hidden="true" style="--lw:${(lw * 0.56 + 0.4).toFixed(1)}em;--vw:${(vw * 0.62 + 0.9).toFixed(1)}em">`
    + data.map((d, i) => `<div class="hb${(+d[1] || 0) === max ? ' top' : ''}"><span class="hb-l">${esc(d[0])}</span><span class="hb-r"><i style="width:${Math.max(0.6, (+d[1] || 0) / max * 100).toFixed(1)}%"></i><b>${vals[i]}</b></span></div>`).join('')
    + `</div>` + tableFallback(data, f);
  ```
  ```css
  /* src/styles.css, replacing the .bars rules (lines 225-234); the same block in build/assets/chapter-page.css (201-208) */
  .hbars { display: grid; gap: 9px; margin: 2px 0 4px; font-family: var(--font-mono); font-size: 12.5px; }
  .hb { display: grid; gap: 4px; }
  .hb-l { line-height: 1.3; color: var(--ink-2); }
  .hb-r { display: flex; align-items: center; gap: 8px; padding-right: var(--vw, 3.6em); }
  .hb-r i { display: block; flex: none; height: 12px; background: var(--accent-fill); }
  .hb-r b { flex: none; font-weight: 500; font-variant-numeric: tabular-nums; color: var(--ink); white-space: nowrap; margin-right: calc(-1 * var(--vw, 3.6em)); }
  @media (min-width: 641px) { .hbars { gap: 7px; } .hb { grid-template-columns: min(var(--lw, 14em), 45%) minmax(0, 1fr); align-items: center; column-gap: 12px; } .hb-l { text-align: right; } }
  @media print { .hbars { font-size: 7.5pt; } .hb-r i { height: 2.6mm; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  ```
- **Shots:** `p1-barlabels-before/after.png` (ch 01, 1440), `p1-barlabels-pkg-before/after.png` (ch 11), `p1-barlabels-phone-before/after.png` (390).
- **Risk:** low. 27 charts change structure at once. The text gets bigger on phones, so the charts grow taller there. Print and the Paged.js PDF need checking (see the end). `src/modules/print.css` has no `.bars` rules to remove.
- **Touches:** static chapter pages (same HTML), the chapter PDFs and The Chain PDF, and P2.3 and P3.4 below.

### P1.2 Footnote marks stand a space away from their word and wrap alone
- **Where:** all 1,500 marks in the interactive chapters (1,302 have a space before them). Examples: ch 16 "a GB300 ¹⁰", ch 17 `"are not prohibited"` then "¹⁵ ." on the next line (visible in `base-geo-timeline.png`). The static pages already strip the space (`plainCites` in `build/modules/social.js` line 310), so the two copies set the same text differently.
- **Wrong:** `inline()` (build.js lines 66-67) replaces ` ([source](url))` but keeps the space before the parenthesis, and the mark carries `padding: 1px 3px` and `margin-left: 2px`. The mark floats off its word, and a line can break between the two.
- **Change:**
  ```js
  // build/build.js inline(): swallow the space before a citation
  s = s.replace(/\s*\(\s*\[(?:source|Source|src)\]\((https?:[^)\s]+)\)\s*\)/g, (_, url) => cite(url, ctx));
  s = s.replace(/\s*\[(?:source|Source|src)\]\((https?:[^)\s]+)\)/g, (_, url) => cite(url, ctx));
  ```
  ```css
  /* src/styles.css lines 192-193 */
  sup.cite { margin-left: 1px; }
  sup.cite a { padding: 0 1px; } /* the ::before box keeps the 24 px target */
  ```
- **Shots:** `p1-cites-costs-before/after.png` (1440), `p1-cites-phone-before/after.png` (390).
- **Risk:** none known. Search snippets and the Glossary's "Where the site uses it" strip cites the same way. `check-speak.js` is unaffected.
- **Touches:** every chapter, the card, In short, the PDFs (print.css line 297 already sets `margin-left: 1px`).

### P1.3 Stacked bars use a rainbow that repeats colors within a chart
- **Where:** all 15 `stack` figures. In ch 04 "by region", Rest of Asia gets United States blue. In ch 07 "process control share", Rigaku gets KLA's blue and All others gets Applied's orange. In ch 02 "wafers by HQ", Europe and Other share grey. Eight saturated hues sit beside a page whose only accent is garnet.
- **Wrong:** `colorOf()` (build.js line 118) cycles `--c1`…`--c8`, and `COUNTRY_COLOR` maps several names to the same index. There are duplicate colors in 3 charts. Yellow `--c4` is 2.3:1 on paper.
- **Change:** use the ledger's own tones. The largest share is garnet. The rest step down in ink, in data order (`data-k="1"`…`"5"`, with the smallest segments sharing the lightest tone). A residual ("Other", "All others", "Everyone else", "… and all others") is hatched. The legend's figure for the lead is garnet.
  ```js
  // build/build.js, type 'stack': replaces colorOf(); write data-k on each <i> and legend <span>
  const REST = /^(other|others|all others|everyone else|rest of world|.* and all others|.*other companies)$/i;
  const lead = segs.reduce((m, s, i) => (s.v > segs[m].v ? i : m), 0); let n = 0;
  segs.forEach((s, i) => { s.k = i === lead ? 'lead' : REST.test(s.name) ? 'rest' : String(Math.min(5, ++n)); });
  // <i data-k="${s.k}" style="flex:…"> and <span data-k="${s.k}">; drop background:var(--cN) and --sw:var(--cN)
  ```
  ```css
  /* src/styles.css after .stack-legend; same in chapter-page.css */
  :root { --stk-lead: var(--accent-fill); --stk-1: #3b424c; --stk-2: #636a73; --stk-3: #8a8f96; --stk-4: #b0afab; --stk-5: #cfcbc3; --stk-edge: #a9a49b;
    --stk-rest: repeating-linear-gradient(135deg, var(--stk-edge) 0 1px, transparent 1px 4px); }
  :root[data-theme="dark"] { --stk-1: #858b93; --stk-2: #6d747c; --stk-3: #5a6069; --stk-4: #4b5159; --stk-5: #40454c; --stk-edge: #6d747c; }
  .stack-bar i[data-k], .stack-legend span[data-k] { --sw: var(--stk-1); }
  [data-k="lead"] { --sw: var(--stk-lead); } [data-k="2"] { --sw: var(--stk-2); } [data-k="3"] { --sw: var(--stk-3); }
  [data-k="4"] { --sw: var(--stk-4); } [data-k="5"] { --sw: var(--stk-5); } [data-k="rest"] { --sw: var(--stk-rest); }
  .stack-bar i[data-k] { background: var(--sw); }
  .stack-bar i[data-k="rest"], .stack-legend span[data-k="rest"]::before { box-shadow: inset 0 0 0 1px var(--stk-edge); }
  .stack-legend span[data-k="lead"] b { color: var(--accent-ink); }
  ```
  (Chapter-page.css's dark block also needs the dark ramp under `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])`.)
- **Shots:** `p1-stack-region-before/after.png` (ch 04), `p1-stack-pcshare-before/after.png` (ch 07), `p1-stack-bom-before/after.png` (ch 16), `p1-stack-region-dark-before/after.png` (dark).
- **Risk:** medium, in two places. (1) The lighter steps fall below 3:1 against paper (step 3 is 3.0, step 4 is 2.0, step 5 is 1.5; the current yellow is 2.3 and grey 3.0). Segments are still identified by order, since the legend reads left to right as the bar does, and by the legend figures. (2) Three country stacks (ch 02 wafers, ch 03 resist, ch 04 region) lose country hues. If the data-page reviewer settles a site-wide country palette, those three should take it and the other twelve the ramp.
- **Touches:** static pages, PDFs, and the B200 specimen's caption, which says "memory in garnet". It still matches, because memory is the lead segment.

### P1.4 Flashcards scroll the page sideways at 320 px
- **Where:** ch 04, 16 and 17 decks at 320 px. `scrollWidth` is 354 with card 1 showing and up to 445 with the later cards.
- **Wrong:** `.fc-more { white-space: nowrap }` (styles.css line 823). "Reread: Chokepoints and who holds them" in tracked capitals is about 390 px, and the card's single grid track grows to fit it.
- **Change:**
  ```css
  .fc-more { white-space: normal; }
  .fc-card { grid-template-columns: minmax(0, 1fr); }
  .fc-marks { flex-wrap: wrap; justify-content: flex-end; }
  ```
- **Shots:** `p1-fc320-before/after.png` (320 x 700). With every proposal in this report applied, `scrollWidth` is 320 across The Chain.
- **Risk:** none.
- **Touches:** the Start here deck (same `deckHTML`).

### P1.5 Timeline marks float 24 px off their rule
- **Where:** ch 17 "Eight US actions" and ch 08 node roadmap, interactive and static.
- **Wrong:** `.prose ol` (0,1,1) beats `.tl` (0,1,0), so the list keeps a 1.3em indent and the garnet squares hang in space away from the vertical rule.
- **Change:** `.prose .tl { padding-left: 0; margin-left: 4px; } .prose .tl li { margin-bottom: 0; }` in styles.css and chapter-page.css.
- **Shots:** `p1-timeline-before/after.png` (interactive), `p1-timeline-static-before/after.png` (`/geopolitics/`).
- **Risk:** none.

### P1.6 The ledger column's foot is 9 px, wraps to seven lines and gives no key
- **Where:** the ledger column under the fifteen stages, 1440 and 1024.
- **Wrong:** `.ch-ledger .chain-foot` is 9 px, below the site's own 9.5 px floor (HANDOFF Tier 0). At 1024 "Memory and HBM, stage 10 of 15 / Next: 11 Advanced packaging" breaks into seven lines. It repeats the title beside it. Meanwhile the bars, the one thing in the column a reader can't decode, have no key.
- **Change:** in `build.js` line 576, replace the `chain-foot` paragraph with a key drawn like the rows, built from the bands present in the data (today Extreme and High):
  ```html
  <p class="ledger-key" aria-hidden="true"><span class="lgk" data-band="4"><i></i>Extreme</span><span class="lgk" data-band="3"><i></i>High</span></p>
  ```
  ```css
  .ch-ledger .ledger-key { margin: 12px 0 0; padding-left: 23px; text-align: left; font-family: var(--font-mono); font-weight: 500; font-size: 10px; line-height: 1.3; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-2); }
  .ch-ledger .ledger-key .lgk { display: block; margin: 0 0 8px; }
  .ch-ledger .ledger-key .lgk i { display: block; height: 5px; width: 100%; margin: 0 0 4px; background: var(--bar-5); }
  .ch-ledger .ledger-key .lgk[data-band="3"] i { width: 66%; background: var(--bar-4); }
  @media (max-width: 1100px) { .ch-ledger .ledger-key { padding-left: 0; } }
  @media (max-width: 900px) { .ch-ledger .ledger-key { display: none; } }
  ```
  The rows already carry `title="Lithography · Extreme concentration"` for the stage names.
- **Shots:** `p1-ledger-key-before/after.png` (1440), `p1-ledger-key-1024-before/after.png`.
- **Risk:** low. "Next: 05 …" leaves the column. The next row and the foot's Previous/Next still carry it.
- **Touches:** print.css line 75 hides `.chain-foot`, so add `.ledger-key` there.

### P1.7 Dark theme draws High brighter than Extreme
- **Where:** dark theme, the ledger column, the rail, the static page's fifteen-bar strip and its key (and any other `--bar-4` user).
- **Wrong:** `--bar-4: #c3c7cd` is 10.6:1 on the dark ground and the wine `--accent-fill` is 3.0:1, so the near-white High bars shout and Extreme recedes.
- **Change:** styles.css dark block: `--bar-4: #5f666f;` (3.1:1). Chapter-page.css: the same value in both dark blocks (`:root[data-theme="dark"]` and the `prefers-color-scheme` block).
- **Shots:** `p2-darkbar-ledger-before/after.png` (interactive), `p2-darkbar-static-before/after.png` (`/lithography/?theme=dark`), `p2-rail-dark-before/after.png`.
- **Risk:** low. The token is shared with the Suppliers and home tiles (`summary-a.css`), which gain the same fix. The owner of those surfaces should confirm.

---

## P2: clear upgrades

### P2.1 Retire the fixed rail on desktop. The ledger column is the chain.
- **Where:** 901 px and up, every chapter.
- **Wrong:** once Contents scrolls past, a second fixed 60 px band (`nav.rail`) repeats the fifteen stages the ledger column already shows beside every chapter. It adds a fifth tone (the "done" bars at 0.55 opacity, a pink), and it puts two rules under the masthead.
- **Change:** `@media (min-width: 901px) { .rail { display: none; } .ch-ledger { top: calc(var(--masthead) + 28px); } }`. Then remove `{{RAIL}}` from `src/template.html` and the rail code in `Sections` (`app.js` lines 400, 437-445), since phones already hide it.
- **Shots:** `p2-rail-litho-before/after.png`, `p2-rail-costs-before/after.png` (ch 16, where the rail shows no current stage at all), `p2-rail-dark-before/after.png`.
- **Risk:** chapters 16 and 17 have no chain in their ledger, so they lose a strip that only ever showed every stage as done. Reading space gains 60 px.
- **Touches:** none beyond The Chain.

### P2.2 Chokepoint card: each band said once, on the text's right edge
- **Where:** every stage chapter, all widths, interactive and static.
- **Wrong:** the head tags ("Extreme concentration", "Very hard to substitute") repeat the two cells under them. The card ends at `--frame` 650 px while the text, plain box, figures and flashcards end 35 px further right, so the eye catches a ragged edge. At 1024 the head stacks its tags and the three cells squeeze "Very / hard" onto two lines.
- **Change:** in `nameplate()` (build.js line 357), drop `.plate-tags` from the head. The cell values become the glossary buttons the tags were, with the same `data-term`, `data-note` and `data-test`. The concentration cell gets the band's rule as its `.sub` (`BAND_NOTE[conc]`).
  ```html
  <div><span class="k">Concentration</span><b class="v Extreme"><button type="button" class="gl-term v-btn" data-band="4" data-term="concentration" data-note="…">Extreme</button></b><span class="sub">Three or fewer firms could supply this stage today, or one firm holds more than half of it.</span></div>
  ```
  ```css
  .plate { max-width: var(--measure); }
  .plate-kpis .v .v-btn { font: inherit; color: inherit; letter-spacing: inherit; text-decoration: underline dotted; text-decoration-color: color-mix(in srgb, currentColor 45%, transparent); text-decoration-thickness: 1.5px; text-underline-offset: 6px; cursor: help; }
  .plate-kpis .v .v-btn:hover { text-decoration-color: currentColor; }
  @media (min-width: 901px) and (max-width: 1100px) {
    .plate-kpis { grid-template-columns: 1fr 1fr; }
    .plate-kpis > div:nth-child(2) { border-right: 0; }
    .plate-kpis > div:last-child { grid-column: 1 / -1; padding-left: 0; border-top: 1px solid var(--line); }
  }
  ```
- **Shots:** `p2-card-1440-before/after.png`, `p2-card-1024-before/after.png`, `p2-card-phone-before/after.png`, and `p2-edge-before/after.png` (the right edge alone).
- **Risk:** the head tags were glossary buttons and the cells now are, so nothing is lost. The phone card is 100 px shorter. Print.css lines 139-141 style `.plate-head .ptag`, which becomes dead CSS. The static page writes "plain tags" in place of buttons, so `social.js` should convert `.v-btn` the same way.
- **Touches:** static pages, PDFs, the Summary PDF if it reuses `nameplate()`.

### P2.3 Bars in ink, garnet only on the largest
- **Where:** all 27 bar charts.
- **Wrong:** every bar is garnet, so a chart of nine margins is a wall of the accent. The ledger's rule is red ink only where a figure needs to be seen, as on the China revenue panels and the Summary PDF ("red bar = highest year").
- **Change:** class `top` on the largest row (built into the P1.1 markup), then `.hb-r i { background: var(--bar-4); } .hb.top .hb-r i { background: var(--accent-fill); } .hb.top .hb-r b { color: var(--accent-ink); }`. The proof was made on the current SVG with `.bars rect.bar { fill: var(--bar-4) } .bars rect.bar.top { fill: var(--accent-fill) }`.
- **Shots:** `p2-bars-costs-before/after.png`, `p2-bars-litho-before/after.png`, `p2-bars-litho-dark-before/after.png`, and with P1.1 `all-costs-figs-before/after.png`.
- **Risk:** a chart whose point is not its largest bar would want a different mark. None found among the 27. Ties mark all tied rows.

### P2.4 Tables: figure columns right-aligned, figures on tabular digits, ranges unbroken
- **Where:** ch 16 bill of materials and margins tables, ch 17 matrix, ch 03 wavelengths. Interactive and static.
- **Wrong:** "$2,900 / $1,100 / $900" sit flush left, so magnitudes don't line up, and "$2,800-3,100" can break at the hyphen on phones.
- **Change:** in the table renderer (build.js lines 204-210), mark a column `n` when at least 60 percent of its body cells (cites stripped) match a figure pattern. Honor markdown `---:` too. Join numeric ranges with an en dash inside those cells only, if the house style allows (the no-em-dash rule doesn't cover it; owner to confirm, and the alignment stands without it).
  ```css
  .prose td.n, .prose th.n { text-align: right; white-space: nowrap; padding-left: 18px; padding-right: 0; font-variant-numeric: tabular-nums lining-nums; }
  .prose th:not(.n):last-child, .prose td:not(.n):last-child { padding-right: 0; }
  ```
- **Shots:** `p2-table-costs-before/after.png`, `p2-table-margins-before/after.png`, `p2-table-geo-before/after.png`, `p2-table-phone-before/after.png` (390; the wrap scrolls inside its own frame as before).
- **Risk:** low. The detector is in `proof/p2-table.js`. Its only hits are the 7 columns that are figures.

### P2.5 Chapter head: one line of facts, one line of actions
- **Where:** chapter heads, all widths.
- **Wrong:** five items over two lines mix kinds. On the first line, "2,223 words / 10 min · Specimen: EUV scanner · Link to chapter". On the second, "Updated … · Cite this chapter · Chapter PDF". On a phone that becomes four lines with a dangling dot. "Specimen: EUV scanner" names the object a second time, apart from its plate, while the plate repeats the chapter title ("Specimen 04 · Lithography"). On phones the plate is cut to "Specimen 11 · Advanced packagi…".
- **Change:** `.ch-meta` holds the facts, words / min · Updated date. `.ch-cite-line` holds the actions, Link to chapter · Cite this chapter · Chapter PDF. The specimen name moves to the stage plate: build.js line 584 adds `data-specimen-name="${SPECIMEN_NAME[specimen]}"`, and `app.js` line 434 uses it in place of `data-title`.
  ```css
  .ch-meta { gap: 0 8px; margin-top: 16px; }
  .ch-meta .label + .label::before { content: "\00b7"; margin-right: 8px; color: var(--muted); }
  .ch-cite { margin-top: 4px; }
  .ch-cite-copylink { font: inherit; letter-spacing: inherit; text-transform: inherit; color: var(--accent); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--line-2); }
  @media (max-width: 640px) { .ch-cite-line { gap: 0 20px; } .ch-cite-line .ch-cite-sep { display: none; } .ch-cite-line > span:first-child { flex-basis: auto; } }
  ```
  (The template's 640 px rule for `.ch-cite-line > span:first-child` goes.)
- **Shots:** `p2-meta-1440-before/after.png` (the stage plate reads "Specimen 04 · EUV scanner"), `p2-meta-phone-before/after.png`.
- **Risk:** the stage tag stops naming the chapter. The ledger, title and phone strip context still do. The essay (ch 17) builds its meta separately (build.js line 721) and needs the same move.
- **Touches:** the phone specimen strip, the static page head (`social.js`).

### P2.6 Glossary terms: a dotted rule, lighter than a link's
- **Where:** prose, In plain terms, In short, card. About 630 terms.
- **Wrong:** glossary buttons and real links both get a solid underline, and the glossary one is darker (`--muted`, 5.6:1). A paragraph of plain terms with eight terms reads as eight links, and the reader can't tell "define this" from "go there".
- **Change:**
  ```css
  .gl-term { text-decoration-style: dotted; text-decoration-color: color-mix(in srgb, var(--muted) 75%, var(--bg)); text-decoration-thickness: 1.5px; text-underline-offset: 0.24em; }
  .gl-term:hover, .gl-term[aria-describedby] { text-decoration-style: solid; text-decoration-color: var(--accent); }
  ```
- **Shots:** `p2-gl-plain-before/after.png`, `p2-gl-prose-before/after.png`, `p2-gl-dark-before/after.png`, `p2-gl-phone-before/after.png`.
- **Risk:** the rule is about 3:1. It is decoration on full-contrast text and the focus ring is unchanged.
- **Touches:** the Start here walk and the board's glossary labels (same class).

### P2.7 Sources close the text, previous/next turns the page
- **Where:** foot of every chapter.
- **Wrong:** the order is flashcards → Previous/Next → a 11 px "+ Sources (46)" under a hairline, so the chapter's evidence comes after its exit. On open, the "−" hugs the label.
- **Change:** build.js line 592 becomes `${reviewHTML(ch)}${sources}${prevNext(ch)}`, and the same at line 721 for the essay.
  ```css
  .chapter-sources { margin: 2.8em 0 0; padding-top: 0; border-top: 1px solid var(--ink); max-width: var(--measure); }
  .chapter-sources summary { display: flex; justify-content: space-between; align-items: baseline; margin: 0; padding: 13px 0 12px; color: var(--ink); }
  .chapter-sources summary::before, .chapter-sources[open] summary::before { content: none; display: none; }
  .chapter-sources summary::after { content: "+"; font-size: 16px; line-height: 1; color: var(--muted); }
  .chapter-sources[open] summary::after { content: "\2212"; }
  .chapter-sources li { padding-left: 27px; text-indent: -27px; margin-bottom: 7px; }
  .chapter-sources li .tier, .chapter-sources li .src-meta { text-indent: 0; }
  .chapter-sources + .prevnext { margin-top: 2.2em; }
  ```
- **Shots:** `p2-sources-before/after.png`, `p2-sources-open-before/after.png`.
- **Risk:** print.css line 241 clears `summary::before`, and it needs `summary::after { content: "" }` too. Leave the static page's order alone: its sources are always open and 46 long, so its Previous/Next rightly comes first.

### P2.8 The Chain opens like the other tabs
- **Where:** `#/chain`, top.
- **Wrong:** AI Chips and Suppliers open with 72 px of air and a 62 px title. The Chain opens 8 px under the masthead with a second ink rule and a 40 px title, so it looks like a section, not a page. The criteria list keeps an 18 px indent with no bullets.
- **Change:**
  ```css
  .howto { border-top: 0; margin-top: 0; padding-top: clamp(36px, 7vh, 72px); }
  .howto h2.howto-title { font-size: clamp(40px, 4.4vw, 62px); line-height: 1; letter-spacing: -0.015em; margin-bottom: 14px; }
  .howto .howto-lede { font-size: 20px; line-height: 1.45; max-width: 30em; margin-bottom: 26px; }
  .howto ul { padding-left: 0; }
  ```
- **Shots:** `p2-chainhead-before/after.png`, `p2-chainhead-phone-before/after.png`.
- **Risk:** none. The view-head reviewer may unify all tab heads, in which case this should follow that rule.

---

## P3: refinements

### P3.1 Contents: each chapter's one-line summary in place of the four shared section names
- **Where:** `#/chain`, Contents.
- **Wrong:** every entry lists the same four links (How it works, Variants…, Who makes it, The chokepoint), so 60 lines say nothing that tells one chapter from another.
- **Change:** `contentsItem()` in build.js writes `<p class="ol">${esc(m.oneLiner)}</p>` in place of the `<ul>`.
  ```css
  .contents-grid { grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr)); gap: 0 36px; }
  .contents-grid .item { display: grid; grid-template-columns: 30px minmax(0, 1fr); column-gap: 10px; align-content: start; padding: 14px 0 16px; border-top: 1px solid var(--line); }
  .contents-grid .n { grid-row: 1 / span 2; padding-top: 6px; }
  .contents-grid .t { margin: 0 0 5px; font-size: 19px; line-height: 1.2; }
  .contents-grid .ol { grid-column: 2; margin: 0; font-size: 15px; line-height: 1.45; color: var(--ink-2); }
  ```
- **Shots:** `p3-contents-before/after.png`. The block is 86 px shorter.
- **Risk:** the section deep links leave the Contents. They are still in search and the permalinks. Print.css styles `.contents-grid li` for The Chain PDF's contents page, which should keep its own layout or be checked.

### P3.2 Specimen plate set as a museum label, left-aligned
- **Where:** desktop stage caption.
- **Wrong:** eight centered lines of 12.5 px Jost under a centered tracked tag are hard to read back along.
- **Change:** `@media (min-width: 901px) { .stage .stage-tag, .stage figcaption { width: min(340px, calc(100% - 48px)); max-width: none; padding-left: 0; padding-right: 0; text-align: left; } .stage .stage-tag::before { left: 0; margin-left: 0; } .stage figcaption { font-size: 13px; } }`
- **Shots:** `p3-caption-before/after.png`, `p3-caption-costs-before/after.png`.
- **Risk:** taste. The centered plate was a deliberate 18 Sept choice, so show the owner both.

### P3.3 Phone chapter head: the numeral beside its labels, one ruled line
- **Where:** 390 px chapter head.
- **Wrong:** "Chapter / 04 / Stage 4 of 15" stacks 150 px above the title, so the title sits a third of the way down the first screen.
- **Change:** `@media (max-width: 900px) { .ch-tile { display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 14px; align-items: end; padding-bottom: 10px; border-bottom: 1px solid var(--ink); } .ch-tile .v { grid-row: 1 / span 2; font-size: 56px; margin: 0; line-height: 0.82; } .ch-tile .k { grid-column: 2; grid-row: 1; } .ch-tile .of { grid-column: 2; grid-row: 2; margin-top: 3px; } .ch-id { margin-bottom: 0; } .chapter { padding-top: 36px; } .ch-ledger { margin-bottom: 18px; } }`
- **Shots:** `p3-phonehead-before/after.png`, `p3-phonehead-geo-before/after.png`. Combined with P2.5: `all-phone-head-before/after.png`.
- **Risk:** none.

### P3.4 Units travel with the numbers
- **Where:** figures with a unit tag (`$M`, `$`, `$B`, `tools`, `GB/s`…).
- **Wrong:** the unit is a 10.5 px tag after the last word of a two-line title ("…December 2025 $"), and the values carry none ("60 / 200 / 350", "2,900"). Ch 01 and 05 also print "($M)" in the title text.
- **Change:** in `fmtNum` use, units of eight characters or fewer go onto each value (`$60M`, `$2,900`, `48 tools`, `1,229 GB/s`) and the tag is dropped. Longer units ("million 8-inch-equivalent wafers per month") keep the tag. See `proof/p3-units.js`.
- **Shots:** `p3-units-price-before/after.png`, `p3-units-bom-before/after.png`.
- **Risk:** this touches figure formatting, not wording. The two titles that spell "($M)" should drop it, which needs the owner's word.

### P3.5 Flashcards: steps the reader can't take yet aren't drawn
- **Where:** below each deck.
- **Wrong:** "Previous card · Next card" sit at 0.45 opacity on card 1 and read as broken links.
- **Change:** `.fc-link.fc-prev:disabled, .fc-link.fc-next:disabled { visibility: hidden; } .fc-nav { margin-right: 0; }`. The space stays, so nothing shifts.
- **Shots:** `p3-fc-before/after.png`.
- **Risk:** none. Disabled buttons were never focusable.

---

## Looked at and left alone
Footnote and glossary popovers (`base-litho-cite-pop.png`, `base-litho-gl-pop.png`) are clean. In plain terms and In short have the right hierarchy. Prose headings and the 37em measure are good. The animation frame and step list work at all widths (`base-anim-1440.png`, `base-m-anim.png`, `base-1024-hbm-anim.png`). The flashcard back and end screen are good (`base-fc-back.png`, `base-fc-end.png`; the `.rv-keep li.miss` rules are dead CSS, since app.js no longer sets `.miss`). On the static pages, the head, CTA and track read well (`base-static-litho-top.png`, `base-static-review.png`), and their footnote marks already sit tight.

## Not yet proved
- P1.1 HTML bars in print and the Paged.js PDF (`build/pdf.py`, `build/chapter_pdfs.py`). The print CSS is written, but I didn't shoot `--print` or rebuild a PDF.
- P2.2, P2.4 and P1.3 on the static chapter pages. They were proved on the interactive page, and the static pages share the HTML, but their CSS copy in `chapter-page.css` needs the same rules and a shot.

## Top five
1. **P1.1 HTML bar charts with whole labels**: `p1-barlabels-before/after.png`, `p1-barlabels-phone-before/after.png`.
2. **P1.3 Stacks in the ledger's tones, garnet on the lead**: `p1-stack-pcshare-before/after.png`, `p1-stack-region-before/after.png`.
3. **P1.2 Footnote marks tight to their word**: `p1-cites-costs-before/after.png`, `p1-cites-phone-before/after.png`.
4. **P2.2 Card says each band once, on the text's edge**: `p2-card-1440-before/after.png`, `p2-card-1024-before/after.png`.
5. **P2.1 + P1.6 The ledger column is the chain: retire the rail, give the column a key**: `p2-rail-litho-before/after.png`, `p1-ledger-key-before/after.png`.

Do these with them, since they are one-line fixes: P1.4 (320 px overflow, `p1-fc320`), P1.5 (timeline, `p1-timeline`), P1.7 (dark High bars, `p2-darkbar-ledger`). Everything together: `all-litho-head`, `all-litho-card`, `all-costs-figs`, `all-litho-dark`, `all-phone-head` (before/after).
