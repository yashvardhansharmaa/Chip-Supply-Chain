# Design round two: charts and visual tools (dataviz, 23 October 2026)

Lens: every chart and visual tool. That covers the 44 chapter figures, the Summary's stage list, the chokepoint card, Suppliers (map, ribbons, ladder), Export Controls (board, scrubber, China revenue panels) and the AI Chips slots. Shots are in `qa/design2/shots/dataviz/` (ports 10440 to 10449). The injected CSS and JS for every pair are in `qa/design2/shots/dataviz/proof/`. Each "after" was made by injecting that code into the live `dist/` page. No repo file was edited.

Method: the dataviz skill's references (anti-patterns, marks and anatomy, interaction) and its palette validator. The folder the brief names (`bundled-skills/2.1.260/…/dataviz/`) does not exist on this machine, so I used the installed copy (`bundled-skills/2.1.308/…/dataviz/`), which has the same files. The validator was run as an ES module from my scratchpad.

## The inventory (measured with `--eval` on `#/chain` at 1440)

- **Chapter figures:** 59 in all. There are 27 bar charts, 15 stacked bars, 2 timelines and 15 animations, plus 7 prose tables (4 of them with right-aligned figure columns).
- **Bars:** in all 27, the label sits beside the bar from 641 px up and above it below that. A value is printed at every bar tip. None needs a legend (one series). Each has an sr-only table twin.
- **Stacks:** all 15 have a legend that prints every value. They have no table, but the legend carries the values. Segment hover is the native `title` only, with no touch or keyboard support. This is harmless because no value depends on it.
- **Titles:** median 58 characters, longest 202. 8 of 44 run to two sentences, and 2 still carry a unit tag.
- **At 320:** `scrollWidth` is 320 on The Chain and on China revenue. Figure text is 11.5 to 15.5 px. No figure overflows.
- **China revenue panels:** 24 panels with 126 tab stops (every bar is a link). In 4 of the 5 visual rows the baselines are 14 px apart. Every panel puts its first-year label at the left edge, up to 123 of 240 viewBox units away from the bar it names (Advantest).
- **AI Chips at 390:** the spec table is 861 px wide inside a 354 px box, so a phone shows one chip column at a time.
- **Validator, current stack hues:**
  - Light: garnet sits outside the lightness band (the known exception), and yellow `#c9a10c` is 2.26:1, which is legal because labels are printed. The other checks pass.
  - Dark: all checks pass.
  - Bars: ink `#3b424c` against garnet `#7a1f2b` fails the normal-vision floor (ΔE 13.6, below 15). The CVD floor is 6.4 (protan). Their luminance ratio is **1.01:1**, and 1.09:1 in dark.

## Verdict

The chart desk is honest and quiet now, and most of it would pass at a good newspaper.
- Bars share one grammar: HTML rows, whole labels, the value at the tip and one highlight.
- Stacks have surface gaps and legends that print every value.
- The China panels are true small multiples on a shared 0 to 60 percent scale.
- Every value is printed, so no tooltip gates anything, and tables stand behind the charts.

Through this lens the ledger identity is the right one for a sourced reference read worldwide. It uses ink plus a single red mark, the discipline of the best chart desks, and it prints and photocopies. Three faults keep it from excellent:
1. **The red ink is a hue-only signal.** Garnet and the ink bars have the same lightness, so in a grayscale printout of the PDFs, or for a red-green colorblind reader, the 27 bar charts lose their only emphasis. The China panels fixed this in round one, but the chapters did not.
2. **The highlight is assigned by rule, not by point.** On three charts it lands on the wrong mark:
   - the 2030 *high case* of a projection range;
   - a 98 percent solar-grade slab, when the chapter's point is the 2 percent that goes into chips;
   - one of eight rows that are really four firms at two dates.
3. **The small multiples lie slightly.** Year labels are pinned to the panel edges, not under their bars, and baselines in a row sit 14 px apart wherever a caption wraps.

The best alternative to the current system is a different way of assigning the one color, not a new palette. I propose that below as D1, point-led color. The color critic owns the palette itself.

---

## P1: broken, ugly or confusing

### P1.1 Garnet and ink have the same lightness, so the highlight vanishes in print and for CVD readers
- **Type:** Fix
- **Where:** all 27 chapter bar charts, interactive and static pages, the 17 chapter PDFs and the book, light and dark. The ledger column has the same two tones, but there the bar length already separates Extreme from High, so it can stay.
- **What is wrong:**
  - `.hb-r i` is `--bar-4` (`#3b424c`) and `.hb.top .hb-r i` is `--accent-fill` (`#7a1f2b`). Their luminance ratio is 1.01:1 in light and 1.09:1 in dark (`#636a73` against `#a8414b`).
  - The validator fails the pair on the normal-vision floor (ΔE 13.6) and warns at protan ΔE 6.4.
  - On an office printer or a grayscale photocopy, the "largest" bar is the same gray as the rest (see the gray pair).
  - The China revenue panels solved this in round one with a mid gray (`--ex-bar: #858b94`, 2.97:1 against garnet, validator ΔE 27.8). The chapters never took it.
- **Change:** promote the panels' gray to one site token and use it for every context bar.
  ```css
  /* src/styles.css: tokens (light, then the dark block) */
  :root { --bar-context: #858b94; }               /* 3.17:1 on paper, 2.97:1 against garnet */
  :root[data-theme="dark"] { --bar-context: #9aa0a8; } /* 6.82:1 on the dark ground, 2.26:1 against the wine */
  /* src/styles.css line 292 and build/assets/chapter-page.css line 216 (all three token blocks there) */
  .hb-r i { background: var(--bar-context); }
  /* src/styles.css line 666-667: the panels read the same token */
  .ex-legend, .ex-panel { --ex-bar: var(--bar-context); }
  ```
  Remove the dark override of `--ex-bar` on line 667, since the token now carries the dark value.
- **Shots:**
  - `p1-barcontrast-before-1440.png` / `-after-1440.png` (ch 04, tool price)
  - `p1-barcontrast-gray-before-1440.png` / `-gray-after-1440.png` (the same chart in grayscale, standing in for a printout)
  - `p1-barcontrast-before-1440-dark.png` / `-after-1440-dark.png` (ch 16, gross margins)
- **Proof code:** `proof/p1-barcontrast.css`
- **Risk:** low. The context bars get lighter on screen, so the charts read a little quieter and the garnet bar stands out more. In dark, the gray bars are lighter than the wine, which reads well (see the dark pair).
- **Touches:** the PDFs, which need a re-render of the chapters and the book. The panels change from `#858b94` to the same value (no change in light). The Suppliers drawer's mini chart (`.sup-ex-mini`) uses `.ex-panel`, so it follows.
- **Size:** S

### P1.2 The China revenue panels: year labels not under their years, baselines off by a line, and 126 tab stops
- **Type:** Fix
- **Where:** Export Controls, China revenue share (`#/exposure`) at 1024 and up. The tab stops affect every width.
- **What is wrong:**
  - **Year labels:** `exposureViz()` (`build/build.js` line 783) writes the first and last fiscal year at `px0` and `px1`, the panel edges. All panels share one time axis, so a firm whose first bar is later sits under the wrong label. In 16 of the 24 panels the label sits about one year left of its bar. Advantest's "FY2024" sits more than three years left of its bar (123 of 240 units), under empty space.
  - **Baselines:** where the "peak … in year to …" caption wraps (10 of 24 panels at 1440), that panel's axis drops 14 px. Four of the five rows then have baselines out of line, which defeats the shared scale the legend promises.
  - **Tab stops:** every bar is a link to its filing, so a keyboard reader tabs 126 times to cross the grid. The table under it has the same links (`#exposure-table`, `src/app.js` line 2731).
- **Change:**
  ```js
  // build/build.js exposureViz(), the last line of each panel: each year label under its own bar, kept inside the panel
  const lab = (r) => { const x = X(mid(r.fyEnd)), w = String(r.fiscalYear).length * 6.1; return Math.min(px1 - w / 2, Math.max(px0 + w / 2, x)).toFixed(1); };
  s += `<text x="${lab(f.first)}" y="${PH - 4}" class="tick" text-anchor="middle">${esc(f.first.fiscalYear)}</text><text x="${lab(f.last)}" y="${PH - 4}" class="tick" text-anchor="middle">${esc(f.last.fiscalYear)}</text></svg></figure>`;
  // and each bar's link leaves the tab order (the table is the keyboard twin, with the same links)
  s += `<a href="…" target="_blank" rel="noopener" tabindex="-1" aria-label="…">`;
  ```
  ```css
  /* src/styles.css after line 700: reserve the caption's second line wherever panels sit side by side */
  @container exv (min-width: 500px) { .ex-panel figcaption { min-height: 38px; } }
  ```
- **Shots:** `p1-panels-before-1440.png` / `p1-panels-after-1440.png`. Measured after the change: rows out of line 0 of 5, tab stops in the grid 0, every first-year label under its first bar.
- **Proof code:** `proof/p1-panels.css`, `proof/p1-panels.js`
- **Risk:** low. Removing the bars from the tab order also removes their focus ring, but the table's cells carry the same link and the same peak mark. The 38 px minimum adds one empty line to single-line captions.
- **Touches:** the `#/exposure/<slug>` deep links (they focus the figure, which keeps its `tabindex="-1"`) and the Suppliers drawer mini chart (same SVG, so its labels move too).
- **Size:** S

### P1.3 A projection range is drawn as three facts, and the highlight lands on the high case
- **Type:** Decision
- **Where:**
  - ch 15 "US data center electricity use, 2024 and 2030 projection range", the clearest case;
  - ch 04 "What one lithography system costs", where the High-NA bar is "the low end of an estimated $350-400M range";
  - ch 01 `tool-lock`, "Lower end of each reported range".
- **What is wrong:**
  - **Ch 15:** the low, reference and high cases are three bars that look like three measurements. The largest-value rule paints the *high case* garnet, so the emphasis falls on the most extreme scenario, as if it were the finding.
  - **Ch 04:** the range is drawn as a point at its low end, with the range stated only in the title.
- **Change:** a range row, one mark per quantity.
  - The solid part runs to the low value, a lighter band runs on to the high value, and a 2 px paper notch marks the middle case.
  - The value reads "521–843 TWh".
  - Data: a row may be `[label, low, high]` or `[label, low, high, mid]`. The figures already appear in the chapter and title, so no content changes.
  - The row counts as one value for the highlight (the largest is its high end).
  ```css
  /* src/styles.css after .hb.top (and chapter-page.css) */
  .hb-r i.rng { position: relative; --rc: var(--bar-context); background: linear-gradient(90deg, var(--rc) 0 var(--lo), color-mix(in srgb, var(--rc) 38%, transparent) var(--lo) 100%); }
  .hb.top .hb-r i.rng { --rc: var(--accent-fill); }
  :root[data-theme="dark"] .hb-r i.rng { background: linear-gradient(90deg, var(--rc) 0 var(--lo), color-mix(in srgb, var(--rc) 50%, transparent) var(--lo) 100%); }
  .hb-r i.rng u { position: absolute; top: -3px; bottom: -3px; width: 2px; left: var(--mid); background: var(--bg); }
  ```
  ```js
  // build/build.js figure(), type 'bars': a row with a third number is a range
  // <i class="rng" style="width:${hi/max*100}%;--lo:${lo/hi*100}%;--mid:${mid/hi*100}%"><u></u></i><b>${withUnit(lo)}–${withUnit(hi)}</b>
  ```
  Microcopy where the design needs it:
  - the row label "2030, low to high case";
  - a key line under the chart, "The notch marks the reference case, 649 TWh".
- **Shots:**
  - `d1-us-dc-electricity-before-1440.png` / `-after-1440.png`
  - `-before-1440-dark.png` / `-after-1440-dark.png`
  - `-before-390.png` / `-after-390.png`
- **Proof code:** `proof/d1-pointled.css` (range block), `proof/d1-dc.js`
- **Risk:** the data schema gains an optional column, and the sr-only table needs a "low" and a "high" column for range rows. The minimal alternative, if the owner prefers no new mark, is `"focus": "none"` on this one figure (see D1), which leaves three ink bars and no garnet.
- **Touches:** the PDFs (print.css needs `print-color-adjust: exact` on `.rng`, as for `.hb-r i`) and D2 below, which reuses the same mark.
- **Size:** M

---

## P2: clear upgrades

### P2.1 D1, point-led color: garnet on the chart's point, neutrals for the rest
- **Type:** Decision. The owner opened the color rule on 23 Oct. The palette stays the color critic's.
- **Where:** the 15 stacks and the 27 bar charts.
- **What is wrong today:**
  - **Garnet falls by rank, not by meaning.**
    - Ch 02 polysilicon: a 685 px garnet slab for solar grade (98 percent), the very part the chapter sets aside. The 2 percent that goes into chips is a blue sliver.
    - Ch 07 process control share: five saturated hues name Applied, Lasertec, Hitachi, ASML and Nova. The legend already names them in order, and the chart's point is KLA's 56.8 percent.
  - **The hues compete with the one figure the chart exists to show.** They also bring in the palette's weakest member (yellow at 2.26:1).
- **Change:**
  - Each figure may name its point in front matter: `"focus": "Electronic-grade"`, a list of labels, or `"none"`. With no `focus`, the largest keeps the garnet, so 40 of the 44 charts render exactly as under today's rule.
  - In a stack, the segments that are not the point alternate two neutrals in data order, so neighbors part by tone as well as by the 2 px gap. Remainders stay hatched.
  - The three country stacks keep their country colors, since that identity is shared with Suppliers.
  - In `stackKeys()` (`build/build.js` line 130), `lead` goes to the `focus` label when one is given. Every other non-remainder takes `o` or `e` in turn, in place of `1` to `5` and `tail`.
  ```css
  /* src/styles.css and chapter-page.css, beside the --stk tokens */
  :root { --pt-o: #7d838c; --pt-e: #b4b9be; }
  :root[data-theme="dark"] { --pt-o: #9aa0a8; --pt-e: #5f666f; }
  .stack-bar [data-k="o"], .stack-legend [data-k="o"] { --sw: var(--pt-o); }
  .stack-bar [data-k="e"], .stack-legend [data-k="e"] { --sw: var(--pt-e); }
  .stack-legend [data-k="lead"] b { color: var(--accent-ink); }
  ```
- **Validator:**
  - Light (`#7a1f2b,#7d838c,#b4b9be` on `#f7f6f2`): the two neutrals are ΔE 17.5 apart (normal and protan, pass). The lighter one is 1.83:1 against paper, which is legal because every legend entry prints its value.
  - Dark (`#a8414b,#9aa0a8,#5f666f` on `#14171c`): CVD ΔE 18.6, normal-vision ΔE 19.6, contrast all above 3:1 (pass).
  - The chroma and lightness "fails" are expected. These are de-emphasis tones, not categories.
  - Garnet against the first neutral is 2.67:1 in luminance, so the point survives grayscale, unlike today's bars (P1.1).
- **Shots:**
  - `d1-pc-share-before-1440.png` / `-after-1440.png`, plus `-before-1440-dark.png` / `-after-1440-dark.png`
  - `d1-polysilicon-grade-before-1440.png` / `-after-1440.png` (with `focus: "Electronic-grade"`)
  - `d1-us-dc-electricity-*` (the range row as the chart's point)
- **Proof code:** `proof/d1-pointled.css`, `proof/d1-pcshare.js`, `proof/d1-poly.js`
- **Risk:**
  - In a 10-segment stack, firms 2 to 9 are told apart by order and the legend, not by hue. The legend reads left to right as the bar does, and the 2 px gaps hold the edges.
  - The owner loses the colorful stacks of the "middle way". The site gains one meaning for garnet everywhere: this is the figure to see.
  - Choosing `focus` is an editorial act, but it adds no figures. Polysilicon and the electricity chart are the only two that need it today.
- **Touches:** static pages, PDFs (fewer hues, so the grayscale print reads better too) and the B200 specimen caption ("memory in garnet", which still matches because memory stays the lead).
- **Size:** M

### P2.2 D2, "peak and latest" as one row per firm
- **Type:** Decision
- **Where:** ch 17 "China's share of revenue at the four largest chip-tool makers, peak fiscal year and latest", all widths.
- **What is wrong:**
  - Two series are drawn as one list of eight bars, and each firm's name is printed twice. The reader has to pair rows to see the drop.
  - The garnet goes to "Tokyo Electron, FY2024", one point of eight, while the chart's message is that all four fell.
- **Change:** four rows. The bar is the latest year, and the light band (the P1.3 range mark) runs on to the peak.
  - Each label names both years in a small second line, "FY2024 to FY2025".
  - The value reads "29.1% from 36.1%".
  - A key line follows: "Latest year", "Down from the peak year".
  - Data: `[label, latest, peak]` plus the years. Alternatively, the build can detect label pairs that share a name before the comma.
  - Under D1 the chart has no single point, so it carries no garnet. Under today's rule the garnet would mark Tokyo Electron's 44.4 percent band.
- **Shots:**
  - `d2-pairs-before-1440.png` / `d2-pairs-after-1440.png`
  - `d2-pairs-after-1440-dark.png`
  - `d2-pairs-before-390.png` / `d2-pairs-after-390.png`
- **Proof code:** `proof/d2-pairs.js` with `proof/d1-pointled.css` and `proof/p1-barcontrast.css`
- **Risk:** low. It is one chart, and the sr-only table becomes Firm, Peak, Latest. In dark, the band needs the 50 percent mix (P1.3).
- **Touches:** the PDFs for ch 17 and the book.
- **Size:** S once P1.3's mark exists.

### P2.3 A figure title is its first sentence, and the qualifiers become a note
- **Type:** Fix
- **Where:** 8 of 44 figures: `eda-share`, `mask-cost`, `tool-lock`, `wafer-concentration`, `polysilicon-grade`, `germanium-price`, `tool-price`, `mask-set-cost`. All widths, the PDFs too.
- **What is wrong:** caveats ("The 28 nm and 7 nm figures are minimums", the germanium rule history) are set in the bold serif title. The germanium title runs three lines at 1440 and the tool-price title four at 390. The headline is no longer the first thing the eye reads, and the caveat reads as a claim.
- **Change:** split in `figTitle()` (`build/build.js` line 146) at the first sentence end. All 8 split cleanly, and no other title matches. Write the rest as a note:
  ```js
  const m = t.match(/^(.+?[a-z0-9%)])\.\s+(.+)$/); // → `${esc(m[1])}<span class="fig-note">${esc(m[2])}.</span>`
  ```
  ```css
  /* src/styles.css after line 281, and chapter-page.css */
  .figure .fig-title .fig-note { display: block; margin-top: 4px; font-family: var(--font-mono); font-weight: 400; font-size: 13px; line-height: 1.45; color: var(--muted); letter-spacing: 0; max-width: 46em; }
  /* src/modules/print.css */
  .figure .fig-title .fig-note { font-size: 7.5pt; }
  ```
  The tool-price note's "$350-400M" should take the en dash ("$350–400M"), as decision 11 set for number ranges.
- **Shots:** `p2-titlenote-before-1440.png` / `-after-1440.png` (ch 03), `p2-titlenote-litho-before-390.png` / `-litho-after-390.png` (ch 04)
- **Proof code:** `proof/p2-titlenote.css`, `proof/p2-titlenote.js`
- **Risk:** none known. The stack's `aria-label` keeps the full title.
- **Touches:** static pages and PDFs. It gives a later "takeaway title" a natural slot (see Noted).
- **Size:** S

### P2.4 D3, AI Chips on a phone: the comparison reads down
- **Type:** Decision. This refines the slots and does not replace them.
- **Where:** AI Chips with two to four chips picked, under 640 px.
- **What is wrong:**
  - The spec table is 861 px wide inside a 354 px box. A phone shows the label column and one chip, so comparing four chips takes sideways scrolling through 2.4 screens of table, row by row.
  - The meters, the page's best comparison device, are never side by side.
- **Change:**
  - Under 640 px each spec becomes a block: the spec's name, then one line per chip (name, value, full-width meter). The values being compared sit in one column.
  - The table head hides. Change and Remove stay on the slot cards and in the sticky bar that follows.
  - `Landscape.cellHTML()` (`src/app.js` line 1153) writes `data-chip="<short name>"` on each cell, and wraps `.cx-v` with its footnote mark in one span, so the mark rides with its value.
  ```css
  /* src/modules/chips.css */
  @media (max-width: 640px) {
    .cx-tablewrap { overflow: visible; -webkit-mask-image: none; mask-image: none; }
    .cx-table, .cx-table tbody, .cx-table tr, .cx-table th.cx-rowhead { display: block; width: auto; }
    .cx-table thead { display: none; }
    .cx-table tr { padding: 12px 0 10px; border-top: 1px solid var(--line); }
    .cx-table tbody th { border: 0; padding: 0 0 6px; position: static; }
    .cx-table td { display: grid; grid-template-columns: 6.6em minmax(0, 1fr); column-gap: 12px; align-items: baseline; padding: 4px 0; border: 0; background: none; }
    .cx-table td::before { content: attr(data-chip); grid-row: 1 / span 4; font-family: var(--font-mono); font-size: 12px; line-height: 1.35; color: var(--muted); }
    .cx-table td > * { grid-column: 2; }
    .cx-table td .cx-meter { max-width: none; margin-top: 5px; }
    .cx-more { display: none; }
  }
  ```
- **Shots:** `d3-chips-phone-before-390.png` / `-after-390.png`, `d3-chips-phone-after-320.png`. `scrollWidth` is 390 and 320. The wrap is 354 and 284 wide, so nothing scrolls sideways.
- **Proof code:** `proof/d3-chips-phone.css`, `proof/d3-chips-phone.js`
- **Risk:**
  - The long text rows (price, export status) now stack per chip, so the page grows, but each line is now read at full width.
  - The "focused" column shading does not carry over. The chip on the stage is still named in the specimen strip.
  - The proof shows the footnote mark dropping to its own line, which the span wrap fixes.
- **Touches:** the quiet export line and print (print.css should keep the table form).
- **Size:** M

---

## P3: refinements

### P3.1 The scrubber's garnet means "selected", not "most"
- **Type:** Fix
- **Where:** Export Controls, the year scrubber, all widths.
- **What is wrong:** each year carries a bar of its number of moves, a small column chart. The selected year's bar is garnet (`controls.css` line 366), so with 2026 selected the 10-move year is red and the 28-move year (2025) is gray. That is the reverse of the site's rule, and it reads as "2026 was the busiest year".
- **Change:** the garnet frame and bold year already show the selection. The bar keeps its ink, and the busiest year's bar takes the garnet (`renderScrub` adds `.is-most` where `n === most`).
  ```css
  .cf-year[aria-pressed="true"] .cf-yb { background: var(--ink-2); opacity: 1; }
  .cf-year.is-most .cf-yb { background: var(--accent-fill); opacity: 1; }
  ```
- **Shots:** `p3-scrub-before-1440.png` / `p3-scrub-after-1440.png`
- **Proof code:** `proof/p3-scrub.css`
- **Risk:** none.
- **Size:** S

### P3.2 AI Chips: the three speed rows share one scale, and a die count loses its meter
- **Type:** Decision
- **Where:** AI Chips spec table, 1440 and 1024 (and the phone blocks of D3).
- **What is wrong:**
  - Each numeric row scales its meters to the row's own largest value. FP16, FP8 and FP4 share a unit (TFLOPS), yet each row's largest chip fills the meter, so the halving of bits that doubles speed is invisible. The page's own intro explains exactly that: "The fewer the bits, the more calculations a chip can do".
  - "Logic dies" draws a meter for a count where more is neither better nor bigger, so the MI355X's 10 dies read as a win.
- **Change:** in `Landscape.rows` (`src/app.js` line 1134), the three speed rows gain `group: 'speed'`. `cellHTML` takes the group's max for the meter, while the bold mark for the best value stays per row. "Logic dies" gets `meter: false`.
- **Shots:** `p3-speedscale-before-1440.png` / `p3-speedscale-after-1440.png`
- **Proof code:** `proof/p3-speedscale.js`
- **Risk:** the FP16 meters get short (a quarter of the FP4 scale). That is the point, but it is a visible change.
- **Size:** S

---

## Noted, not proposed (no before and after yet)
- **The concentration band has four marks for one two-value scale:**
  - the ledger column draws a bar by length (Extreme 100 percent, High 66 percent);
  - Home and `/summary/` draw a four-step signal glyph (4 of 4, 3 of 4);
  - the summary cards draw outlined tags;
  - the card and the summary PDF use the word alone.

  One mark everywhere would help a reader learn it once. The four-step glyph shows the scale honestly.
- **The ribbons (Suppliers, By country) are still the weakest chart on the site.** About 160 gray ribbons cross, the garnet threads run across the whole field, and a count ("how many Japanese firms in photoresist") needs a hover. The owner's own rule, one line per item, points to one row per stage with a bar of its firms split by country in the country colors and Critical firms marked. That would also give the By stage ladder's large count numerals a length. It needs a real prototype, so it is not proposed here.
- **Takeaway titles:** chart titles describe ("EUV systems ASML sold each year") but do not state the finding. The best reference sites lead with the finding. That is content work, and P2.3's note slot and D1's `focus` give it a structure if the owner wants it later.
- **B200 bill of materials (ch 16):** the specimen caption says yield loss is "drawn hollow", while the chart beside it draws that segment solid green. Under D1 it would be a neutral. Either way, the two could agree.

## Top five
1. **P1.1**, context bars in mid gray: the highlight survives print and CVD. `p1-barcontrast-gray-before-1440.png` / `-gray-after-1440.png`. S
2. **P1.2**, China revenue panels: year labels under their bars, baselines in line, bars out of the tab order. `p1-panels-before-1440.png` / `-after-1440.png`. S
3. **P1.3**, ranges drawn as ranges: no garnet on a high-case scenario. `d1-us-dc-electricity-before-1440.png` / `-after-1440.png`. M
4. **P2.1 (D1)**, point-led color: garnet on the chart's point, neutrals for the rest. `d1-polysilicon-grade-before-1440.png` / `-after-1440.png`, `d1-pc-share-before-1440.png` / `-after-1440.png`. M
5. **P2.4 (D3)**, AI Chips on a phone reads down. `d3-chips-phone-before-390.png` / `-after-390.png`. M
