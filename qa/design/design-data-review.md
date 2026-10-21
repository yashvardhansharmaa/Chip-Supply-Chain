# Design review: the data pages (design-data)

Surfaces: Suppliers (`#/suppliers`, both tabs, the drawer, the table, the exports), Export Controls (`#/controls`, `#/exposure`, `#/exposure/<slug>`), AI Chips (`#/landscape`), the Index (`#/glossary`). Shots: `qa/design/shots/design-data/` (port 9923). Every "after" was made by injecting the CSS, and where needed a small script, into the live page with `build/shoot.py --eval`; nothing in the repo was edited. The prototype CSS and scripts are reproduced below as the change to make.

Note for the merge: `src/app.js` and `dist/index.html` were rebuilt at 23:31 on 20 October, while this review ran (the China share left the ladder's name lines). Every "before" below was shot on the rebuilt page.

## Verdict

These pages are honest, carefully sourced and typographically confident, but as graphics they still read like a well-set document more than the work of a chart desk. Three things a graphics editor would stop at. First, color carries two meanings at once: garnet is both "Critical" and the color of the US export-control category, and it sits next to China's red, so in dark mode the two biggest timeline categories and the ribbons' China and Critical are the same color (1.09:1). Second, the ribbons overstate the chokepoints: a ribbon turns wholly garnet when any one of its firms is Critical, so 67 firms' worth of ribbon is painted for 28 Critical firms, and the largest garnet band (US to accelerator vendors) holds one Critical firm out of fifteen. Third, the peak bar in the China revenue panels has the same luminance as the bars it should stand out from (ink-2 against garnet, 1.01:1), so in grayscale or for a red-green colorblind reader the highlight disappears. Beyond those, each page holds a better chart than its layout lets it show: the board's five states form a scale but are drawn as border styles 500 px from the names they belong to; the ladder's large numerals are a rank that reads like the chapter numbers in the strip above it; the China panels sit one to a row with most of the row empty; the phone ribbons put every stage label off screen. The fixes below keep every form the owner chose (the ribbons, the ladder, the board, the small multiples, the two-pane Index, AI Chips opening with nothing picked) and change how each is drawn.

## P1: broken, ugly or confusing

### P1.1 The ribbons paint whole ribbons garnet for one Critical firm, and garnet sits on top of China's red

- **Where:** Suppliers, By country tab, every width, both themes; the EU-27 view too.
- **Wrong:** `drawPipe` gives a ribbon the class `is-crit` if any firm in it is Critical, and `.sup-rib.is-crit` fills the whole ribbon garnet at 0.82 opacity while the rest sit at 0.3. Counted from `data/suppliers.json`: 20 ribbons carry a Critical firm, they are 67 firms wide, and they hold 28 Critical firms. The widest garnet band, US to accelerator vendors, is Nvidia plus fourteen firms that are not Critical. The country colors at 0.3 opacity also cross into a pastel hairball, and China's ribbons (`--c6`) are pink next to garnet; in dark mode `--c6` `#e0504a` and `--accent` `#e25c57` are 1.09:1, and the legend's "China" and "holds a Critical firm" squares look the same.
- **Change:** split each ribbon into its Critical part and the rest, draw the context in ink, and let a country take its own color only when it is lit (the atlas's country), hovered or filtered. The garnet threads are then exactly the Critical firms, each the width of its count.
  - `src/app.js`, `Suppliers.drawPipe`, replace the body of `st.forEach(function (s, i) { ... })` inside `cols.forEach`:
    ```js
    var k = s.by[c] || 0; if (!k) return;
    var kc = s.rows.filter(function (r) { return self.colOf(r.country) === c && r.chokepoint === 'Critical'; }).length;
    var a0 = curL[c], a1 = a0 + k * uL, b0 = curR[i], b1 = b0 + k * uR;
    curL[c] = a1; curR[i] = b1;
    var am = a0 + kc * uL, bm = b0 + kc * uR, xa = x0 + wL; // the Critical firms ride on top of their ribbon
    var path = function (A0, A1, B0, B1, cls) {
      return '<path class="sup-band sup-rib c-' + c + cls + '" data-c="' + c + '" data-i="' + i + '" d="M' + xa + ',' + A0.toFixed(1) +
        ' C' + mx.toFixed(1) + ',' + A0.toFixed(1) + ' ' + mx.toFixed(1) + ',' + B0.toFixed(1) + ' ' + x1 + ',' + B0.toFixed(1) +
        ' L' + x1 + ',' + B1.toFixed(1) + ' C' + mx.toFixed(1) + ',' + B1.toFixed(1) + ' ' + mx.toFixed(1) + ',' + A1.toFixed(1) + ' ' + xa + ',' + A1.toFixed(1) + 'Z"></path>';
    };
    if (kc) ribs += path(a0, am, b0, bm, ' is-crit');
    if (kc < k) ribs += path(am, a1, bm, b1, '');
    ```
    In the `mouseover` handler, light both halves of a pairing: `var rc = rib.getAttribute('data-c'), ri = rib.getAttribute('data-i'); hot(function (r) { return r.getAttribute('data-c') === rc && r.getAttribute('data-i') === ri; }, true);`. In `legend()`, "holds a Critical firm" becomes "Critical firms". In the SVG `aria-label`, "amber where one is Critical" (stale since the garnet redesign) becomes "garnet for the Critical firms".
  - `src/modules/suppliers.css`, replace the two `.sup-rib` lines and the six state lines under "the ribbons":
    ```css
    /* the ribbons are context in ink; the Critical firms are garnet threads of their own width; a lit, hovered or filtered country takes its color */
    .sup-band.sup-rib { stroke: none; fill: var(--ink); opacity: 0.13; cursor: pointer; transition: opacity 160ms linear; }
    .sup-band.sup-rib.is-crit { fill: var(--accent-fill); opacity: 0.92; }
    .sup-band.sup-rib:not(.is-crit):is([data-lit], [data-hot], [data-on]) { fill: var(--rc, var(--ink)); }
    .sup-rib.c-US { --rc: var(--ink); } .sup-rib.c-JP { --rc: var(--c1); } .sup-rib.c-CN { --rc: var(--c6); } .sup-rib.c-TW { --rc: var(--c3); }
    .sup-rib.c-KR { --rc: var(--c5); } .sup-rib.c-NL { --rc: var(--c2); } .sup-rib.c-DE { --rc: var(--c4); } .sup-rib.c-Other { --rc: var(--c8); } .sup-rib.c-EU { --rc: var(--c2); }
    .sup-pipe[data-lit="1"] .sup-rib, .sup-pipe[data-filtered="1"] .sup-rib { opacity: 0.07; }
    .sup-pipe[data-lit="1"] .sup-rib.is-crit, .sup-pipe[data-filtered="1"] .sup-rib.is-crit { opacity: 0.35; }
    .sup-pipe-svg[data-hot="1"] .sup-rib { opacity: 0.06; }
    .sup-pipe[data-lit="1"] .sup-rib[data-lit], .sup-pipe[data-filtered="1"] .sup-rib[data-on], .sup-pipe-svg[data-hot="1"] .sup-rib[data-hot="1"] { opacity: 0.8; }
    .sup-pipe[data-lit="1"] .sup-rib.is-crit[data-lit], .sup-pipe[data-filtered="1"] .sup-rib.is-crit[data-on], .sup-pipe-svg[data-hot="1"] .sup-rib.is-crit[data-hot="1"] { opacity: 1; }
    .sup-lg .sup-crit-sw { width: 14px; height: 3px; background: var(--accent-fill); } /* a thread, not one more country square */
    ```
    (`.sup-band.sup-rib` must stay after the `.sup-band.c-XX` rules, as the ribbon block already is.)
- **Shots:** no country lit `03-ribbons-unlit-1440.png` → `P01-ribbons-after-A-1440.png`; the default state, Taiwan lit from the atlas, `02-ribbons-1440.png` → `P01-ribbons-after-A-lit-1440.png`; dark `60-d-ribbons-1440.png` → `P01-ribbons-after-A-dark-1440.png`; hover today `08-ribbons-hover-1440.png` (unchanged behavior).
- **Risk:** low. The tooltip, the click-to-filter and the keyboard path are untouched. The country colors now appear only on the nodes, the legend and the lit, hovered or filtered ribbons, which is where a reader asks "which country".
- **Touches:** the atlas's "light this country" hand-off (`Suppliers.light`), the EU switch (P2.6).

### P1.2 Garnet is a category color on Export Controls, and in dark mode it is China's red

- **Where:** Export Controls, the timeline's category chips and every entry's category label, the board's histories; 1440, 1024, phone; worst in dark.
- **Wrong:** `.timeline .cat` (the US export control category, 31 of the 74 entries) is `var(--accent)` and the China category is `var(--c6)`. In light mode they are two reds (1.84:1 between them); in dark mode `#e25c57` against `#e0504a` is 1.09:1, so "US export control" and "China", the two largest categories, are one color in the chips and the labels. It also spends the garnet, which the ledger reserves for "a figure that needs to be seen", on the most common label on the page, and it gives the US a different color here (garnet) than on Suppliers (ink).
- **Change:** the US category takes the ink, as it does on Suppliers. `src/styles.css` line 384: `.timeline .cat { ... color: var(--ink-2); }`. `src/modules/controls.css`: `.cf-hist .cat { ... color: var(--ink-2); }`; `.tl-chip::before { background: var(--ink); }`; `.tl-chip[aria-pressed="true"]::before { background: var(--bg); }` (the pressed chip is ink-filled, so its dot turns paper; the `.cn`, `.ally`, `.policy`, `.corp` pressed rules that follow keep their own colors).
- **Shots:** dark `63-d-timeline-1440.png` → `P07-categories-after-dark-1440.png`; light `P07-categories-before-1440.png` → `P07-categories-after-1440.png`.
- **Risk:** low; text contrast rises (ink-2 is 9.4:1 in light, 10.6:1 in dark). With P1.1 and this, no chart on the data pages puts garnet beside `--c6`.
- **Touches:** nothing outside Export Controls.

### P1.3 The ladder's large numerals are a rank that reads like a chapter number

- **Where:** Suppliers, By stage tab, all widths.
- **Wrong:** the ladder's Fraunces numerals 01 to 20 are the rank after sorting by number of firms. The atlas strip directly above numbers the fifteen chapters the same way, so the page shows "04 Lithography" and, a screen lower, "02 Lithography". The rank carries no information the order does not already give. Nothing on the page says what the three name colors mean (garnet Critical, ink Important or Contested, gray Diversified), and a screen reader hears none of them.
- **Change:** the numeral becomes the stage's number of firms, the value the ladder is sorted by, so ties (7, 7; 9, 9, 9, 9) show the sort at a glance; the meta line keeps only the Critical count, with one garnet square a Critical firm; a one-line key names the three levels in their own colors.
  - `src/app.js`, `buildLadder`: `'<span class="sup-rank" aria-hidden="true">' + s.n + '</span>'`, and the meta: `'<p class="sup-rung-n"><span class="sr-only">' + s.n + ' firms. </span>' + (s.crit.length ? '<span class="sup-crit-n"><span class="sup-crit-sq" aria-hidden="true">' + new Array(s.crit.length + 1).join('<i></i>') + '</span>' + s.crit.length + ' critical</span>' : '') + '</p>'`. In `applyFilter`, the unfiltered text becomes the same markup (the filtered "3 of 9 firms" stays). Give each Critical and Diversified name an `<span class="sr-only">, Critical</span>` (or `, Diversified`) inside its button.
  - `src/template.html` line 173: the heading reads "Stages by number of firms, fewest first", followed by `<p class="sup-key"><b class="k-crit">Critical</b><span aria-hidden="true">·</span><b>Important or contested</b><span aria-hidden="true">·</span><b class="k-div">Diversified</b></p>`.
  - `src/modules/suppliers.css`:
    ```css
    .sup-crit-n { display: inline-flex; align-items: center; gap: 7px; color: var(--accent-ink); }
    .sup-crit-sq { display: inline-flex; gap: 2px; }
    .sup-crit-sq i { display: block; width: 7px; height: 7px; background: var(--accent-fill); }
    .sup-key { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; margin: 6px 0 0; font-size: 13px; }
    .sup-key b { font-weight: 500; color: var(--ink); } .sup-key .k-crit { color: var(--accent); font-weight: 600; } .sup-key .k-div { color: var(--muted); }
    .sup-key span { color: var(--line-2); }
    ```
- **Shots:** `04-ladder-1440.png` → `P02-ladder-after-1440.png`; phone `50-m-suppliers-ladder.png` → `P02-ladder-after-m.png`; dark `P02-ladder-after-dark-1440.png`.
- **Risk:** low. The numerals keep their size and face; only their meaning changes. Microcopy changed: the ladder heading and the key.
- **Touches:** the CSV and the table are unchanged.

### P1.4 The China revenue panels' peak bar has the same luminance as the other bars, and the gridlines look like the rule lines

- **Where:** Export Controls, China revenue share, every panel and `#/exposure/<slug>`; light mode.
- **Wrong:** context bars are `--ink-2` `#3b424c` and the peak bar is `--accent-fill` `#7a1f2b`: 1.01:1 in luminance, so the one mark each panel exists to show is carried by hue alone (see the grayscale strip). The horizontal gridlines (`stroke-dasharray: 2 3`) and the three rule-date lines (`1 3`) are both dotted and gray, so a reader cannot tell a calendar marker from a 20 percent line, and every bar already prints its value, so the gridlines add nothing. Hovering any bar paints it garnet (`.ex-panel a:hover rect`), so a hovered bar reads as the peak.
- **Change:** context bars recede to a mid gray; the gridlines go; the rule lines become solid hairlines; hover darkens instead of turning garnet.
  - `build/build.js`, `exposureViz`: delete the gridline loop `for (let v = 20; v <= YMAX; v += 20) s += ...class="grid"/>`.
  - `src/styles.css` (the `.ex-panel` block):
    ```css
    :root { --ex-bar: #858b94; }                                   /* 3.17:1 on paper, 2.97:1 against garnet */
    :root[data-theme="dark"] { --ex-bar: var(--ink-2); }           /* dark already separates: 3.5:1 against the wine */
    .ex-panel .bar { fill: var(--ex-bar); }
    .ex-panel .rule { stroke: var(--ink); stroke-dasharray: none; opacity: 0.22; }
    .ex-panel .share { fill: var(--muted); }
    .ex-panel .share.top { fill: var(--accent-ink); font-weight: 600; }
    .ex-panel a:hover rect { fill: var(--ink); }
    .ex-legend .lg-bar { background: var(--ex-bar); }
    .ex-legend .lg-rule { border-left: 1px solid var(--ink); opacity: 0.4; }
    ```
- **Shots:** `20-exposure-1440-top.png` → `P04-exposure-after-1440.png`; grayscale proof, before over after, `P04-exposure-grayscale-before-over-after.png`; dark `61-d-exposure-1440.png` → `P04-exposure-after-dark-1440.png`; phone today `53-m-exposure.png`.
- **Risk:** low. The basis-change line (Nvidia) stays dashed and thicker, now the only dashed line in a panel.
- **Touches:** the Index and drawer if they embed a panel (P3.3).

### P1.5 On a phone the ribbons are drawn 820 px wide, so every stage label is off screen

- **Where:** Suppliers, By country, under 600 px.
- **Wrong:** `drawPipe` takes `Math.max(820, host.clientWidth)`. On a 390 phone the reader sees the country nodes and the start of the ribbons; the twenty stages, half of what the chart says, sit past a faded edge.
- **Change:** draw to the phone's width with country codes on the left, the short stage names on the right and a taller field. In `drawPipe`: `var W = Math.max(280, Math.round(host.clientWidth) || 280), tight = W < 1000, phone = W < 600;` `var H = phone ? 720 : tight ? 520 : 580;` `var x0 = phone ? 54 : tight ? 128 : 172, wL = phone ? 10 : 12, x1 = W - (phone ? 150 : tight ? 168 : 214), wR = phone ? 8 : 10;` `var fsL = phone ? 11.5 : tight ? 12 : 13, fsR = phone ? 10.5 : tight ? 11 : 12;` and both country labels print `phone ? c : self.coName(c)`. In `fitPipe` the 820 floor becomes 280. CSS: `@media (max-width: 599px) { .sup-clab { font-family: var(--font-mono); font-weight: 500; letter-spacing: 0.04em; } }`.
- **Shots:** `P05-ribbons-before-m.png` (and `51-m-suppliers-ribbons.png`, Taiwan lit) → `P05-ribbons-after-m.png` (with P1.1). Checked at 320: the page does not scroll sideways.
- **Risk:** low; the hit areas keep their 18 px minimum height. Codes on phones are the ones the ladder already prints after every name.
- **Touches:** none.

### P1.6 The China revenue table's shading fails AA on its darkest cells

- **Where:** Export Controls, China revenue share, "The same figures as a table"; light and dark.
- **Wrong:** `.matrix td .cell` mixes `--accent` up to 71 percent behind ink text: 13 px ink on the darkest light-mode cell (Tokyo Electron FY2024) is 3.61:1. The whole table is a garnet heat wall, in dark mode especially, where the panels above it use garnet for one bar per firm.
- **Change:** shade in ink and mark each firm's highest year in garnet, as the panels do. `src/styles.css`: `#exposure-table td .cell { background: color-mix(in srgb, var(--ink) calc(var(--v) * 0.3%), transparent); } #exposure-table td .cell.is-peak { color: var(--accent-ink); font-weight: 600; box-shadow: inset 0 -2px 0 var(--accent-fill); }`. `src/app.js`, the exposure table renderer (near line 2160): add `is-peak` to the cell holding the row's highest share.
- **Shots:** `P15-extable-before-1440.png` → `P15-extable-after-1440.png` (darkest cell now 10.5:1); dark `P15-extable-before-dark-1440.png` → `P15-extable-after-dark-1440.png` (8.2:1).
- **Risk:** none; scoped to `#exposure-table`, so the shared `.matrix` rule elsewhere is untouched.
- **Touches:** none.

### P1.7 Export controls outweigh the content, most of all on a phone

- **Where:** Export Controls, both modes; worst on phones. The same pattern on the AI Chips table and the China revenue table.
- **Wrong:** on a 390 phone, six rows of controls stand between the mode switch and the first timeline entry: two outlined buttons for the board, five category chips on three rows, "Show full summaries", then two more buttons, with "Copy as JSON" twice. On desktop the board's two buttons float between the mode switch and the scrubber. The exports are for the few readers who want the data; they are set as loud as the content.
- **Change:** each export becomes one quiet line, "Copy the board · Table · JSON", at the foot of what it copies: the board's under the board's key, the timeline's on the filter row. `src/app.js`, `addExport` quiet variant: markup `'<span class="xq-k">Copy the ' + noun + '</span><button type="button" class="btn ghost">Table</button><span class="xq-s" aria-hidden="true">·</span><button type="button" class="btn ghost">JSON</button>'` with `aria-label`s "Copy the board as a table" and "Copy the board as JSON", inserted after `.cf-legend` for the board and appended to `.tl-bar` for the timeline. CSS (`src/styles.css`, after `.export-bar`):
    ```css
    .export-bar.xq { display: flex; align-items: baseline; gap: 2px 8px; margin: 14px 0 0; justify-content: flex-start; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.03em; color: var(--muted); }
    .export-bar.xq .btn.ghost { border: 0; background: none; padding: 4px 0; min-height: 24px; font-size: 11px; letter-spacing: 0.06em; color: var(--ink-2); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
    .export-bar.xq .btn.ghost:hover { color: var(--ink); text-decoration-color: var(--accent); }
    .export-bar.xq .xq-s { color: var(--line-2); }
    .tl-bar .export-bar.xq { margin: 0 0 0 auto; flex: 0 0 auto; }
    .tl-all.btn.ghost { border: 0; padding: 4px 0; min-height: 24px; color: var(--ink-2); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
    .tl-all[aria-pressed="true"] { background: none; color: var(--ink); text-decoration-color: var(--accent); }
    @media (max-width: 899px) { .tl-bar .export-bar.xq { margin: 0; width: 100%; } .tl-all { width: auto; } }
    ```
- **Shots:** phone `52-m-controls-board.png` → `P06-exports-after-m.png` (the first entry rises about 200 px); desktop `P06-exports-before-1440.png` → `P06-exports-after-1440.png`.
- **Risk:** on phones in By date the board (and so its export) is hidden today; its export goes with it, while the timeline's stays. Tap targets stay at 24 px.
- **Touches:** AI Chips (`#cx-table-wrap` bar) and the China revenue table should take the same quiet line.

## P2: clear upgrades

### P2.1 The board as a chart: one scale for every row, one line per row, the key at the top

- **Where:** Export Controls, By subject (and the phone board); 1440, 1024, phone, both themes.
- **Wrong:** the board is the page's index, eleven flows each in one of five states from No license to Prohibited, but the states are drawn as pill border styles (outlined, dashed, garnet, solid) that a reader must decode from a key 1,400 px below. The state sits at the far right, about 500 px from the name it describes; each closed row prints its full description (up to ten lines), against the owner's "one line per item"; in 1,800 px of window the board shows ten of its eleven rows and no key.
- **Change:** each row gets a five-step scale, a hairline with a dot at its state, ink up to Case by case and garnet from Presumption of denial; the scale's two ends are labelled once above the board; closed rows hide the description, which opens with the row. When the scrubber moves, the dots slide along their scales (the only new motion, and it is the information: the state changing with the date). The scrubber's years carry their number of moves as a small bar, so 2025's 28 moves stand out.
  - `src/app.js`, `renderBoard`, after the `.cf-id` span: `'<span class="cf-ramp' + (k === 'policy' ? ' is-policy' : '') + (i >= 3 ? ' is-closed' : '') + (st.suspended ? ' is-susp' : '') + '" style="--i:' + i + '" aria-hidden="true"><i class="cf-ramp-t"></i><i class="cf-ramp-k" style="left:0"></i><i class="cf-ramp-k" style="left:25%"></i><i class="cf-ramp-k" style="left:50%"></i><i class="cf-ramp-k" style="left:75%"></i><i class="cf-ramp-k" style="left:100%"></i><i class="cf-ramp-f"></i><i class="cf-ramp-d"></i></span>'`, where `i` is the state's index in `['open','restricted','case','denial','prohibited']`. `paintBoard` updates `--i` and the three classes on the existing span instead of rebuilding it, so the transition runs. `renderScrub`: prepend `<i class="cf-yb" style="height:' + Math.max(1, Math.round(n / max * 20)) + 'px"></i>` to each year. `src/template.html`, before `#cf-board`: `<div class="cf-scale" aria-hidden="true"><span class="cf-scale-l">What can be sold</span><span class="cf-scale-r"><span>No license</span><i></i><span>Prohibited</span></span><span class="cf-scale-x">The state on the date above; the full key is under the board</span></div>`.
  - `src/modules/controls.css`:
    ```css
    @media (min-width: 900px) {
      .cf[data-mode="subject"] .cf-rowh, .cf-scale { grid-template-columns: minmax(0, 0.85fr) 292px minmax(0, 1.2fr) 64px 14px; }
      .cf-scale { display: grid; column-gap: 16px; align-items: end; padding: 0 2px 7px 0; }
      .cf-scale-l, .cf-scale-x { font-family: var(--font-mono); font-size: 10.5px; color: var(--muted); }
      .cf-scale-l { font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; }
      .cf-scale-x { grid-column: 3 / -1; }
      .cf-scale-r { display: flex; align-items: center; gap: 8px; margin: 0 14px 0 4px; font-family: var(--font-mono); font-size: 10px; color: var(--ink-2); }
      .cf-scale-r i { flex: 1 1 auto; height: 1px; position: relative; background: linear-gradient(to right, var(--line-2), var(--accent-fill)); }
      .cf-scale-r i::after { content: ""; position: absolute; right: -1px; top: -3px; border: 3.5px solid transparent; border-left: 6px solid var(--accent-fill); border-right: 0; }
      .cf-scale-r span:last-child { color: var(--accent-ink); }
      .cf[data-mode="subject"] .cf-route { display: block; margin: 2px 0 0; }
      .cf[data-mode="date"] .cf-ramp, .cf[data-mode="date"] .cf-scale { display: none; }
    }
    @media (min-width: 900px) and (max-width: 1199px) {
      .cf[data-mode="subject"] .cf-rowh, .cf-scale { grid-template-columns: minmax(0, 1fr) 200px minmax(0, 1.1fr) 56px 14px; }
    }
    .cf[data-mode="subject"] .cf-row:not([data-open="1"]) .cf-what { display: none; }   /* one line a row; the description opens with the row */
    .cf-ramp { position: relative; display: block; height: 22px; margin: 6px 14px 0 4px; }
    .cf-ramp-t { position: absolute; left: 0; right: 0; top: 10px; height: 1px; background: var(--line-2); }
    .cf-ramp-k { position: absolute; top: 7px; width: 1px; height: 7px; margin-left: -0.5px; background: var(--line-2); }
    .cf-ramp-f { position: absolute; left: 0; top: 9px; height: 3px; width: calc(var(--i) * 25%); background: var(--ink-2); transition: width 240ms var(--ease); }
    .cf-ramp-d { position: absolute; top: 4px; left: calc(var(--i) * 25%); width: 13px; height: 13px; margin-left: -6.5px; border-radius: 50%; background: var(--ink); box-shadow: 0 0 0 2px var(--bg); transition: left 240ms var(--ease); }
    .cf-ramp.is-closed .cf-ramp-f, .cf-ramp.is-closed .cf-ramp-d { background: var(--accent-fill); }
    .cf-ramp.is-susp .cf-ramp-f { background: var(--line-2); }
    .cf-ramp.is-susp .cf-ramp-d { background: var(--bg); border: 1.5px dashed var(--ink-2); }
    .cf-ramp.is-policy .cf-ramp-f, .cf-ramp.is-policy .cf-ramp-d { display: none; }
    .cf-ramp.is-policy .cf-ramp-t, .cf-ramp.is-policy .cf-ramp-k { background: var(--line); }
    @media (max-width: 899px) { .cf-ramp { grid-column: 1 / -1; grid-row: 2; margin: 8px 7px 0; } .cf-state { grid-row: 3; } .cf-scale { display: flex; margin: 0 0 6px; } .cf-scale-l, .cf-scale-x { display: none; } }
    .cf-yb { display: block; width: 14px; margin: 0 auto 4px; background: var(--muted); opacity: 0.55; }
    .cf-year { justify-content: flex-end; }
    .cf-year[aria-pressed="true"] .cf-yb { background: var(--accent-fill); opacity: 1; }
    @media (prefers-reduced-motion: reduce) { .cf-ramp-f, .cf-ramp-d { transition: none; } }
    ```
- **Shots:** the whole board `P03-board-before-tall-1440.png` → `P03-board-after-tall-1440.png` (all eleven rows and the key now fit in 1,800 px); the first screen `13-board-subject-1440.png` → `P03-board-after-1440.png`; scrubbed to 2022, the dots moved left, `P03-board-after-2022-1440.png`; 1024 `P03-board-before-1024.png` → `P03-board-after-1024.png` (names wrap there, hence the narrower 900–1199 columns above); phone `P03-board-before-m.png` → `P03-board-after-m.png`; dark `62-d-board-1440.png` → `P03-board-after-dark-1440.png`.
- **Risk:** medium; it touches the board's render and paint paths. The row's accessible name (`rowLabel`) already says the state, so the ramp stays `aria-hidden`. The pills and the full key stay, so nothing is lost for readers who prefer words. The Policy row gets an empty track by design: money and tariffs gate nothing.
- **Touches:** By date's compact board (the ramp is hidden there), the summary PDF if it reuses the board's markup.

### P2.2 Pack the China revenue panels so small categories share a row

- **Where:** Export Controls, China revenue share; 1024 and up.
- **Wrong:** every category heading spans the full grid, so Lithography, Photomasks, Chemicals and Foundry (one firm each) and the two-firm groups each take a whole row with four fifths of it empty. The grid is 2,708 px tall at 1440 for 24 small charts.
- **Change:** wrap each category's heading and panels in a group that spans as many columns as it has panels, capped at the grid's column count, and let the grid pack densely. `build/build.js`, `exposureViz`: emit `<div class="ex-group" style="--n:N"><h4 class="ex-cat">…</h4>…panels…</div>` per category. `src/styles.css` (tested in Chrome without any script):
    ```css
    #exposure-viz { container: exv / inline-size; }
    .ex-grid { --cols: 1; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); grid-auto-flow: row dense; gap: 18px 22px; }
    @container exv (min-width: 500px) { .ex-grid { --cols: 2; } }
    @container exv (min-width: 760px) { .ex-grid { --cols: 3; } }
    @container exv (min-width: 1010px) { .ex-grid { --cols: 4; } }
    @container exv (min-width: 1260px) { .ex-grid { --cols: 5; } }
    .ex-group { display: grid; grid-template-columns: subgrid; row-gap: 14px; align-content: start; grid-column: span min(var(--n), var(--cols)); }
    .ex-group .ex-cat { grid-column: 1 / -1; margin: 10px 0 0; }
    ```
- **Shots:** `21-exposure-1440-full.png` → `P04-exposure-after-1440-full.png` (grid 2,708 → 1,244 px); 1024 `P04-exposure-after-1024-full.png` (3,384 → 2,555 px). No sideways scroll at 1024 or 320.
- **Risk:** low-medium. Dense packing moves a few categories next to their neighbors (Metrology now sits beside Lithography), so the chain order holds only roughly; every panel keeps its own address (`#/exposure/<slug>`) and the shared 0 to 60 percent scale. Check `span min()` and subgrid in Safari 17 and Firefox; the fallback is one group a row, as today.
- **Touches:** the `#/exposure/<slug>` scroll offset (unchanged, the panels keep their ids).

### P2.3 AI Chips: the picker as a three-column checklist

- **Where:** AI Chips, 1440, 1024, phone.
- **Wrong:** 49 boxed chips, each repeating "US" or "CN" under a group heading that already says the country, make a picker 1,258 px tall at 1440 (2,230 px on a phone), so after a pick the comparison it produces starts below the second screen. (The page opening with nothing picked is the owner's decision and stays.)
- **Change:** makers in three columns, one line a chip with a square check, the family name moved to the button's `title`. `src/modules/chips.css`:
    ```css
    .cx-picker { display: block; columns: 3 220px; column-gap: 28px; }
    .cx-picker .group { column-span: all; margin: 14px 0 4px; padding-top: 10px; }
    .cx-picker .group:first-child { margin-top: 0; padding-top: 0; border-top: 0; }
    .cx-picker .vrow { display: block; break-inside: avoid; margin: 0 0 12px; }
    .cx-picker .vname { display: block; font-family: var(--font-mono); font-weight: 500; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding: 0 0 3px; border-bottom: 1px solid var(--line); margin-bottom: 2px; }
    .cx-picker .vchips { display: block; }
    .cx-picker button { display: flex; align-items: baseline; gap: 7px; width: 100%; min-width: 0; min-height: 30px; padding: 5px 4px 5px 24px; border: 0; background: none; color: var(--ink); }
    .cx-picker button:hover { background: var(--bg-2); }
    .cx-picker button[data-cc]::after, .cx-picker button span { display: none; }
    .cx-picker button::before { left: 4px; top: 50%; margin-top: -6px; }
    .picker.cx-picker button[data-cc][aria-pressed="true"] { background: var(--bg-2); color: var(--ink); border-color: transparent; }
    .cx-picker button[aria-pressed="true"]::before { left: 4px; top: 50%; margin-top: -6px; width: 12px; height: 12px; transform: none; border: 0; background: var(--ink); box-shadow: inset 0 0 0 2.5px var(--bg), 0 0 0 1px var(--ink); }
    .cx-picker button[aria-pressed="true"] b { font-weight: 600; }
    .cx-picker button[data-focus="1"] { box-shadow: inset 2px 0 0 var(--accent); }
    .cx-picker button b { font-size: 14px; }
    ```
  `src/app.js`, `Landscape.buildUI`: add `title="' + esc(sub) + '"` to each chip button.
- **Shots:** `P11-picker-before-1440.png` → `P11-picker-after-1440.png` (picker 1,258 → 669 px, so the comparison a pick produces starts about 590 px higher); phone `P11-picker-before-m.png` → `P11-picker-after-m.png` (2,230 → 1,656 px). Empty state today: `30-chips-1440-full.png`.
- **Risk:** low. The family names (Blackwell, Hopper) leave the picker; they remain in the plans and the table. The arrow-key navigation is unchanged (same buttons).
- **Touches:** none. (Headless Chrome has no WebGL, so the chip render on the right-hand stage could not be judged.)

### P2.4 Index: every list label on one line

- **Where:** Index, the left list, desktop (the phone list too, when open).
- **Wrong:** a firm's label is its full stage name in tracked capitals, right-aligned in a 46 percent column, so "EQUIPMENT SUBSYSTEMS & COMPONENTS" breaks into three lines, the list reads ragged and fewer entries fit a screen.
- **Change:** the Suppliers page's short stage names (`Suppliers.SHORT`: "Advanced packaging", "Equipment subsystems", "Interconnect", "Accelerator vendors") in sentence case, on one line. `build/build.js`, where `LOOKUP_LIST` labels are set: use the short name for firms. `src/modules/lookup.css`: `#lk-items .lk-lab { font-size: 11px; font-weight: 400; letter-spacing: 0.01em; text-transform: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 48%; } #lk-items .lk-name { min-width: 0; }`. Keep "Design & EDA" as is (the shot shows a trial "Design software", which I withdraw).
- **Shots:** `P09-index-list-before-1440.png` → `P09-index-list-after-1440.png`.
- **Risk:** none; the card states the full category.
- **Touches:** the search text (`data-text` keeps the full name, so "photonics" still finds Optics firms).

### P2.5 Index country card: the shares as a bar chart

- **Where:** Index, country cards, desktop and phone.
- **Wrong:** each share's bar is a 2 px underline at the foot of its row that merges with the row rule, so the card's only chart is close to invisible; the garnet that marks "largest share" shows as a 1 px line.
- **Change:** a 0 to 100 percent track beside the value. `src/modules/lookup.css`:
    ```css
    .lk-share { grid-template-columns: minmax(0, 1fr) minmax(120px, 34%) 58px; column-gap: 14px; align-items: center; }
    .lk-share-k { grid-column: 1; grid-row: 1; }
    .lk-share-bar { position: static; grid-column: 2; grid-row: 1; width: 100%; height: 8px; background: linear-gradient(to right, var(--ink-2) var(--w), var(--bg-3) var(--w)); }
    .lk-share.is-lead .lk-share-bar { background: linear-gradient(to right, var(--accent-fill) var(--w), var(--bg-3) var(--w)); }
    .lk-share-v { grid-column: 3; grid-row: 1; text-align: right; }
    .lk-share.is-lead .lk-share-v { color: var(--accent-ink); }
    .lk-share-m { grid-column: 1 / -1; grid-row: 2; }
    @media (max-width: 760px) { .lk-share { grid-template-columns: minmax(0, 1fr) 46px; } .lk-share-bar { grid-column: 1 / -1; grid-row: 3; margin-top: 4px; } .lk-share-v { grid-column: 2; } }
    ```
- **Shots:** `P10-country-before-1440.png` → `P10-country-after-1440.png`; phone `54-m-index-country.png` → `P10-country-after-m.png`.
- **Risk:** none; CSS only, the markup already carries `--w`.
- **Touches:** none.

### P2.6 The EU-27 column is a second green beside Taiwan's

- **Where:** Suppliers, By country, "EU-27 together".
- **Wrong:** the EU column is `--c7` `#2e7d1e`, the node directly above it is Taiwan's `--c3` `#1f9a6d`; two greens in one legend.
- **Change:** the EU takes `--c2`, the orange of the Netherlands, a member it absorbs and which leaves the drawing in this view. `src/modules/suppliers.css`: `.sup-band.c-EU, .sup-cnode.c-EU { fill: var(--c2); } .sup-sw.c-EU { background: var(--c2); }` (and `--rc` in P1.1).
- **Shots:** `P08-eu-before-1440.png` → `P08-eu-after-1440.png` (with P1.1, in the view's own state: the EU lit as it appears).
- **Risk:** none.
- **Touches:** the Index's EU member cards link here.

## P3: refinements

### P3.1 Coming up: garnet only for what is near

- **Where:** Export Controls, top of What the rules did.
- **Wrong:** all six countdowns are garnet, from "in 19 days" to "in 428 days", and each line ends in an uppercase underlined "TIMELINE ENTRY".
- **Change:** `src/app.js`, `renderUpcoming`: the countdown's inline color is `var(--accent)` when `x.n <= 30`, otherwise `var(--muted)`; the link reads "Entry →" in 11 px muted sentence case.
- **Shots:** `11-controls-1440-top.png` → `P12-upcoming-after-1440.png`.
- **Risk:** none. **Touches:** none.

### P3.2 Suppliers filter row: a search box that fits its prompt, selects in the site's hairline

- **Where:** Suppliers, both tabs.
- **Wrong:** the search box cuts its own placeholder ("Search suppliers, cities, t"); the selects are the browser's own, with rounded native arrows beside square hairline inputs.
- **Change:** `src/modules/suppliers.css` and `src/styles.css` (`.filters`): `.view[data-view="suppliers"] .filters input { flex: 1 1 340px; max-width: 420px; }` `.filters select { -webkit-appearance: none; appearance: none; padding-right: 30px; background-image: linear-gradient(45deg, transparent 50%, var(--ink-2) 50%), linear-gradient(135deg, var(--ink-2) 50%, transparent 50%); background-position: calc(100% - 15px) 52%, calc(100% - 10px) 52%; background-size: 5px 5px; background-repeat: no-repeat; }` `.filters input:focus-visible, .filters select:focus-visible { outline: 1.5px solid var(--accent); outline-offset: 2px; }`.
- **Shots:** before over after, `P13-filters-before-over-after-1440.png` (full frame `P13-filters-after-1440.png`).
- **Risk:** none; the phone rule that makes each control full width still applies. **Touches:** none.

### P3.3 The firm's panel shows the China chart it links to

- **Where:** Suppliers, a firm's panel under its stage (and the Index firm card, which carries the same line).
- **Wrong:** "From China: 34.1% of revenue →" is a bare figure linking to a chart on another tab; the Critical badge touches the firm's name.
- **Change:** `src/app.js`, `Suppliers.detail`: after the From China line, clone the firm's panel SVG (`#ex-<slug> svg`, already in the page) at 240 px, links unwrapped, `aria-hidden="true"` (the figure beside it is the text). `src/modules/suppliers.css`: `.sup-ex-mini { display: block; width: 240px; margin: 6px 0 2px; } .sup-ex-mini svg { width: 240px; height: auto; } .sup-detail-h .chk { margin-left: 8px; vertical-align: 2px; }`.
- **Shots:** `06-suppliers-drawer-1440.png` → `P14-drawer-after-1440.png`.
- **Risk:** low; 24 firms have a chart, the rest keep the panel as it is. **Touches:** P1.4's styles apply inside.

## Noted, not proposed (no before/after yet)

- The ribbons' stage hit areas set `outline: none`, so keyboard focus shows only the ribbon highlight and tooltip. Add `.sup-hit:focus-visible { stroke: var(--accent); stroke-width: 1.5px; }`; headless Chrome would not take focus on the SVG rect, so this needs a check in a real browser.
- AI Chips' plans and the right-hand stage could not be judged: headless Chrome has no WebGL, so the stage is hidden in every shot.
- The route map at the top of Suppliers is outside this brief.

## Top five

1. **Ribbons that count the chokepoints honestly** (P1.1 with P1.5): Critical firms as garnet threads of their own width, the context in ink, country color on demand, and the whole drawing on a phone. `03-ribbons-unlit-1440.png` → `P01-ribbons-after-A-1440.png`; `P05-ribbons-before-m.png` → `P05-ribbons-after-m.png`.
2. **The board as a chart** (P2.1): one scale a row, one line a row, dots that slide with the date, the scrubber showing activity. `P03-board-before-tall-1440.png` → `P03-board-after-tall-1440.png`.
3. **One meaning per color** (P1.2, with P2.6): garnet stops being a category, the US is ink on both pages, the EU stops being a second green. `63-d-timeline-1440.png` → `P07-categories-after-dark-1440.png`.
4. **China revenue panels that work in grayscale and pack tight** (P1.4, P1.6, P2.2). `P04-exposure-grayscale-before-over-after.png`; `21-exposure-1440-full.png` → `P04-exposure-after-1440-full.png`; `P15-extable-before-1440.png` → `P15-extable-after-1440.png`.
5. **Ladder numerals that mean the number of firms** (P1.3), with a key for the name colors. `04-ladder-1440.png` → `P02-ladder-after-1440.png`.
