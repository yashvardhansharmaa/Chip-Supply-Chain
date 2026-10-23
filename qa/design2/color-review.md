# Color and visual identity review (slug `color`, 23 Oct 2026)

Shots are in `qa/design2/shots/color/`. Paths below are relative to that folder. The `proofs/` folder holds before and after pairs. `directions/` holds the four direction CSS files, one folder of shots per direction, and a contact sheet per direction. `validator/` holds the palette checks, `identity/` the favicon, tile and card sheets, `pdf/` the PDF pages in color and grayscale, and `survey/` the first look. Ports used: 10420 to 10429.

**Validator.** The path in the brief (`bundled-skills/2.1.260/.../validate_palette.js`) is missing. I used the same script from `bundled-skills/2.1.308/4709f66215adf4d765c68c5239e016d3/dataviz/scripts/validate_palette.js` through an ES-module wrapper in my scratchpad. Every contrast and ΔE below was computed (WCAG relative luminance, OKLab ΔE×100, Machado 2009 CVD). None was eyeballed.

**How the proofs were made.** Each "after" shot injects the direction CSS file, re-keys the chapter country stacks the way the proposed `build.js` change would, and clicks the theme toggle twice so the 3D stage re-reads `--stage-ink` and `--stage-accent`. Each "before" shot is the live `dist/`.

## 1. Verdict

The ledger is the right identity for this subject and these readers. Warm paper, blue-black ink and one bookkeeper's red make a sourced reference work that reads calm, prints well and stays neutral, and the stippled specimens are its best expression. What fails is the discipline the header comment promises. Red now carries four meanings. Garnet marks Extreme, Critical and the largest value. A second red, `#c3302b`, marks China. Garnet also marks the selected country on the atlas, and it doubles as the hover color. In dark mode the text red `#e25c57` and China's `#e0504a` are ΔE 2.4 apart, the same color, so on the Suppliers ribbons "Critical firms" and "China" share one legend color. On Export Controls the China dot, the countdown and the board's scrubber are all one coral. Under that sits a second system: the chapter country stacks paint Japan yellow and the United States blue, while Suppliers paints Japan blue and the United States ink. Japan's blue and South Korea's violet are ΔE 8 apart (3 for a deuteranope). And in grayscale print, the "accent on the largest" rule disappears from every bar chart, because garnet and the slate context bars have the same luminance (1.01:1). These are execution faults. None of them argues for a new identity. I explored three structurally different systems, and the best alternative, a cool "drafting film" world with a cobalt accent, is credible but gives up the warmth and the print parity that make the ledger distinctive. My recommendation is Direction 1: keep the ledger and give the red one meaning.

## 2. Proposals

### P1.1 One red: China leaves the accent's red (Decision, strongly advised)
- **Where:** Suppliers "By country" ribbons and legend, light and dark, every width. Export Controls category chips, labels and board histories. The three chapter country stacks (ch 02, 03, 04) and their static pages and PDFs. The atlas rings in `summary-a.css`.
- **Wrong:** garnet means "a figure that needs to be seen". China wears a second red, `#c3302b`, which sits 1.84:1 and ΔE 16 from garnet in light. In dark, China `#e0504a` against the text accent `#e25c57` is 1.09:1 and ΔE 2.4: one color. In the ribbons, every garnet Critical thread leaves a node column where China is the only red node, so a reader can take the threads as "China". On a site read worldwide, giving one country the alarm color is also a framing choice the site otherwise avoids.
- **Change:** introduce country tokens and point every country rule at them (the full block is in `directions/d1-ledger-refined.css`):
  ```css
  :root { --cty-us: var(--ink); --cty-jp: #1f56a8; --cty-cn: #13a9bb; --cty-cn-ink: #08737f; --cty-tw: #0b7a45; --cty-kr: #a056bf; --cty-nl: #cf5f1a; --cty-de: #d6ab22; --cty-other: #80868d; }
  :root[data-theme="dark"] { --cty-jp: #3f78d4; --cty-cn: #2bbfc9; --cty-cn-ink: #2bbfc9; --cty-tw: #2f8a4c; --cty-kr: #b876c6; --cty-nl: #e08048; --cty-de: #e3be3c; --cty-other: #787d85; }
  .sup-band.c-CN:not(.sup-rib), .sup-cnode.c-CN { fill: var(--cty-cn); } .sup-sw.c-CN { background: var(--cty-cn); } .sup-rib.c-CN { --rc: var(--cty-cn); }   /* and so on for US JP TW KR NL DE Other EU (EU takes --cty-nl) */
  .timeline .cat.cn, .cf-hist .cat.cn { color: var(--cty-cn-ink); }            /* 5.15:1 on paper; the cyan itself is 2.6:1, a mark color only */
  .tl-chip.cn::before, .tl-chip.cn[aria-pressed="true"]::before { background: var(--cty-cn); }
  ```
  Files: `src/modules/suppliers.css` lines 21 to 28, 59 to 66, 197 to 198 and 206 to 207; `src/modules/controls.css` 151 and 182 to 190; `src/styles.css` 462; `src/modules/summary-a.css` 240 and 250; the same tokens in `build/assets/chapter-page.css` (both theme blocks) and `src/modules/print.css` line 45.
- **Shots:** `proofs/p1-onered-pipe-light-before-over-after.png`, `proofs/p1-onered-pipe-dark-before-over-after.png`, `proofs/p1-onered-controls-pair.png` (light before, light after, dark before, dark after).
- **Risk:** readers who expect a red China. The ribbons and stacks label every country directly, so nothing depends on the color alone. **Touches:** the Index country cards, if they draw a swatch, and the PDFs of ch 02 to 04. **Size:** M.

### P1.2 One country, one color: the chapter stacks use a different map (Fix)
- **Where:** `fig-silicon-and-wafers-wafer-concentration`, `fig-chemicals-gases-and-photoresist-resist-country`, `fig-lithography-asml-region`, on screen, on the static pages and in the PDFs.
- **Wrong:** `build/build.js` line 25 sets `COUNTRY_COLOR = { US: 1, NL: 2, TW: 3, JP: 4, KR: 5, CN: 6, DE: 7 }`, and the comment on line 124 says these are "the Suppliers page's". They are not. Suppliers draws the US in ink, Japan in `--c1` blue and Germany in `--c4` yellow. In ch 04 the United States is blue and Japan is yellow, and Germany would be a second green beside Taiwan, the exact pairing round one removed from Suppliers.
- **Change:** in `build.js` (line 135), write `data-k="cty-<code>"` from a name map (`United States`→us, `Japan`/`Japanese companies`→jp, `China`→cn, `Taiwan`→tw, `South Korea`/`Korea`→kr, `Netherlands`→nl, `Germany`→de, `Europe`→nl), keeping the `used` set. In `src/styles.css` and `chapter-page.css`, add `.stack-bar [data-k="cty-jp"], .stack-legend [data-k="cty-jp"] { --sw: var(--cty-jp); }` and the same for each code.
- **Shots:** `proofs/p1-country-stack-before-over-after.png` (ch 04: Japan turns blue, the US turns ink, China cyan, Korea purple).
- **Risk:** none. **Touches:** three figures, their static pages and their PDFs. **Size:** S.

### P1.3 Dark mode's red is coral on China's hue; rebuild it on garnet's (Fix)
- **Where:** every page in dark: kickers ("In plain terms"), cite links, the ledger's current stage, Extreme words, the tab rule, focus rings.
- **Wrong:** dark `--accent: #e25c57` has hue 25 and chroma 0.168. Garnet has hue 18 and chroma 0.125. The dark theme therefore reads as a different, louder red that matches China's dark red (see P1.1), and it sits beside the garnet tile in the masthead as a second red.
- **Change:** in the `src/styles.css` dark block (and `chapter-page.css` line 31): `--accent: #e0767e; --accent-ink: #e5848a; --accent-soft: rgba(224, 118, 126, 0.14); --stage-accent: 224, 118, 126;`. That is garnet's hue (16) at chroma 0.132. It measures 6.0:1 on `--bg`, 5.6:1 on `--bg-2` and 5.0:1 on `--bg-3`, up from 5.05, 4.65 and 4.17. `--accent-fill` stays `#a8414b`, which is already garnet's hue.
- **Shots:** `proofs/p1-dark-accent-chapter-before-after.png`, `proofs/p1-dark-accent-home-before-after.png`.
- **Risk:** none. Contrast rises everywhere. **Touches:** the static pages' dark block. **Size:** S.

### P2.1 Japan and South Korea read as one blue; the Netherlands and Germany as one orange (Fix)
- **Where:** the Suppliers stream and legend, the chapter country stacks, both themes.
- **Wrong (validator, `validator/current-country.txt`):** in light, Japan `#2b63c4` against Korea `#5a48b8` is ΔE 8.0 for normal vision and 3.0 for a deuteranope. In dark it is 7.6 and 2.7. The stream's adjacent pair Netherlands `#e06a1f` and Germany `#c9a10c` fails the normal-vision floor: 13.6 in light and 13.0 in dark, with CVD 6.6 and 6.4.
- **Change:** the P1.1 palette. Japan deepens to `#1f56a8`, Korea moves to purple `#a056bf`, the Netherlands deepens to `#cf5f1a`, Germany becomes a clearer gold `#d6ab22` and Taiwan a deeper green `#0b7a45`. **Validator, light, stream order JP CN TW KR NL DE:** lightness, chroma, CVD and normal-vision all pass on adjacent pairs (worst CVD 14.3, worst normal 18.3). Contrast warns for cyan (2.6) and gold (2.0), which is legal because every band and segment is labelled. Japan against Korea rises to 19.1 normal. **Dark:** adjacent CVD and normal pass (12.1 and 15.8) and contrast passes. The lightness band fails for cyan, orange and gold, as it already does for today's dark palette. All pairs, both modes: the worst CVD pair is orange against green at 4.4 to 4.9. They are never adjacent and both are labelled. Every hue clears garnet by ΔE 21 or more. Full output: `validator/d1-country.txt`.
- **Shots:** the P1.1 pipe pairs. Look at the left node column and the legend.
- **Risk:** low. **Touches:** as P1.1. **Size:** S, with P1.1.

### P2.2 The largest bar vanishes in grayscale print and for red-blind readers (Fix)
- **Where:** every horizontal bar chart (`.hbars`): screen, static pages and every chapter PDF.
- **Wrong:** context bars are `--bar-4` `#3b424c` (Y 0.053) and the top bar is garnet `#7a1f2b` (Y 0.053), so they measure 1.01:1. A protanope sees ΔE 6.4 between them. Printed in black and white, the bar the rule exists to show matches its neighbors (`pdf/litho-bars-color-vs-gray.png`). Round one fixed this for the exposure panels only (`--ex-bar: #858b94`).
- **Change:** `src/styles.css` line 292 and `chapter-page.css` line 216 become `.hb-r i { background: var(--bar-ctx); }`, with `:root { --bar-ctx: #858b94; }` (the exposure panels' value, 3.17:1 on paper), `:root[data-theme="dark"] { --bar-ctx: #535a63; }`, and `@media print { :root { --bar-ctx: #9ba1a7; } }`. `--bar-4` keeps its job as the High rating.
- **Shots:** `proofs/p2-bars-grayscale-before-over-after.png` (color left, grayscale right, before on top). Also `directions/charts-all-directions-color-over-gray.png`.
- **Risk:** none. **Touches:** every chapter PDF (re-render). **Size:** S.

### P2.3 Three garnet marks a row on the home glance list (Decision)
- **Where:** home, "The chain at a glance", 1440 and 1024, both themes.
- **Wrong:** each Extreme row turns its number, its meter and its word garnet, so 24 garnet marks sit above the fold and half the list is red. Red that is everywhere stops being seen.
- **Change:** `src/modules/walk.css` line 98: `.wk-gl-list li[data-level="4"] .wk-gl-w { color: var(--accent); }`. Drop `.wk-gl-n` from that rule so the numbers stay `--muted`. The meter and the word carry Extreme.
- **Shots:** `proofs/p2-glance-one-red-before-after.png`.
- **Risk:** none. **Touches:** none. **Size:** S.

### P2.4 Dark legend swatches for Critical do not match the threads (Fix)
- **Where:** Suppliers ribbons legend and the Critical squares above the stream, dark.
- **Wrong:** the threads use `--accent-fill` (wine) while the legend's `.sup-crit-sw` and `.sup-crit` use `--accent` (coral). The ladder's squares already use `--accent-fill`.
- **Change:** `src/modules/suppliers.css` lines 32 and 67: `var(--accent)` becomes `var(--accent-fill)`.
- **Shots:** `proofs/p1-onered-pipe-dark-before-over-after.png` (the legend row).
- **Risk:** none. **Size:** S.

### P3.1 The atlas spends garnet on selection (Decision)
- **States audit.** The site has a clear grammar. Ink fill means "chosen": the filter chips, the By subject and By date modes, the atlas country chips, the AI Chips picker. A garnet rule means "where you are": the current tab, the sub-tab, the current stage, the animation step, the board year. Hover turns an underline or a title garnet. Focus is a 1.5 px garnet outline (9.4:1 in light, and 6.0:1 in dark with P1.3). Disabled is `--muted` at 45 to 60 percent opacity, which is exempt. Two places break the grammar: the AI Chips picker's pressed state uses `--bg-2`, a third style, and the atlas uses garnet for selection.
- **Wrong:** on `#/suppliers?country=JP` the chosen country's stops ring garnet, its stop cards take a garnet bar, its panel code is garnet, its share bars are tinted garnet, and the route arcs are garnet at 45 percent, all beside the garnet Extreme tags in the same panel.
- **Change:** `src/modules/summary-a.css`: `.atlas .sa-stop.is-on { box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--ink); } .atlas .sa-stopcard.is-on { border-top-color: var(--ink); } .sa-route { stroke: var(--ink-2); opacity: 0.3; } .sa-panel-cc { color: var(--ink); } .sa-fact-bar { background: var(--bg-3); }`.
- **Shots:** `proofs/p3-atlas-selection-pair.png` (light) and `proofs/p3-atlas-selection-dark-pair.png`.
- **Risk:** low. The selection stays obvious at 4 px. **Size:** S.

### P3.2 The dark text ramp mixes temperatures (Fix)
- **Where:** dark, all pages.
- **Wrong:** dark `--ink` `#ece9e2` is warm (hue 87). `--ink-2` `#c3c7cd` and `--muted` `#939aa3` are cool (hue 258), so headings and body text sit in two different whites. This is where the dark theme still looks inverted rather than designed.
- **Change:** dark `--ink-2: #c9c6bf` (8.7:1 on `--bg-3`) and `--muted: #9b988f` (5.1:1 on `--bg-3`). The cool blue-black ground stays: it is the ink itself, which is the right idea.
- **Shots:** in the P1.3 pairs.
- **Risk:** none. **Size:** S.

### Noted, not proposed (no pair)
- `.tier-D, .tier-?` (`src/styles.css` line 506) borrow China's `--c6` red for weak sources, a fifth red meaning. After P1.1 they would turn cyan, so they need their own rule, for example a dotted `--accent` border.
- The wordmark tile keeps `#7a1f2b` in dark at 1.76:1 against the ground. The paper "C" carries it, and on a dark browser tab bar the tile still holds (`identity/tiles-all-directions.png`). Keep it.
- Specimens: ink stipple plus material colors (copper 176/102/44, silicon steel 111/139/166, EUV blue-violet). They sit well on paper and the dark lift rule works. Their copper and violet are close to the Netherlands' orange and Korea's purple, but the two never share a view. The share cards' globe renders as a heavy mid-gray, denser than the site's stipple (`identity/cards-sheet.png`, `identity/cards-sheet-gray.png`).
- `#/summary` opens the home walk. The brief lists it as a route, so the router may need a check (outside this lens).

## 3. Color directions

Each direction is one override file in `directions/`: tokens for both themes, the wordmark tile, the country block, chart tokens and the role rules. All keep the current fonts. Each folder holds the brief's screens: `home-1440`, `litho-1440` (chapter opener), `chart-1440` (body page with the ch 04 country stack), `suppliers-1440` (atlas with Japan chosen), `pipe-1440` (country hues), `home-390`, `chapter-390`, one screen in the other theme, and `charts` (three ch 04 charts: tool price bars, the technology stack and the region stack). Contact sheets: `directions/sheet-<name>.png`. Current site: `directions/sheet-d0-current.png`. Validator output: `validator/directions.txt`.

| | Ground / ink / accent | Accent's role | Countries (JP CN TW KR NL DE) | Default theme |
|---|---|---|---|---|
| **D1 Ledger, refined** | paper `#f7f6f2` / blue-black `#14181f` / garnet `#7a1f2b` | the one red: Extreme, Critical, largest, current place | blue, cyan, deep green, purple, orange, gold | light |
| **D2 Drafting film** | cool film `#eef2f4` / graphite `#161b21` / cobalt `#1f45b0` | same role, a cool hue | crimson, gold, green, violet, orange, teal | light |
| **D3 Yellow room** | warm graphite `#161613` / paper-white `#eeebe1` / amber `#e9a83a` | same role, lit amber | blue, cyan, green, violet, red, magenta | **dark** |
| **D4 Black and white, color for data** | white `#ffffff` / neutral black `#111111` / vermilion `#d4351c` for data only | chrome carries no color; the accent appears only in data | blue, sand, green, violet, teal, plum | light |

**D1 Ledger, refined** (`d1-ledger-refined.css`, `sheet-d1-ledger-refined.png`). This is proposals P1.1 to P3.2 in one file. Tile, favicon and cards are unchanged. Charts keep the owner's rule, with garnet as the only red and context bars that hold in grayscale. PDFs need one token in print. The cards change only where they show a country color (none do today). Validator: country adjacency passes in light. Dark adjacency passes but the lightness band fails, as it does today. Stacks: light passes except garnet's own band, which is the documented exception. Dark stacks pass every check.

**D2 Drafting film** (`d2-drafting-film.css`, `sheet-d2-drafting-film.png`). The ground differs clearly: pale blue-gray film, graphite ink and a blueprint cobalt. It suits the technical subject and reads very clean, but it loses the paper's warmth and becomes one more cool tech site. Costs: the tile and favicon turn cobalt (`identity/tiles-all-directions.png`; it holds on light and dark tab bars). Blue goes to the accent, so Japan takes crimson. Charts put cobalt on the largest, then green, gold, violet, orange and teal. PDFs: cobalt prints dark (Y 0.077), so the highlight survives. The cards need a new ground and badge color in `build/cards-art.js`. Validator: adjacency passes in light. Teal's chroma (0.085) and gold's contrast (1.9) fail and need tuning. The dark band fails on five hues. Type pairing: Instrument Sans fits the film. Fraunces' warmth pulls against it, so this direction pairs best with the typography critic's technical or all-sans direction.

**D3 Yellow room, dark first** (`d3-yellow-room.css`, `sheet-d3-yellow-room.png`; its light screen is `d3-home-1440-light.png`). The name comes from the amber light in a fab's lithography bays. It is the most atmospheric of the four, and the amber Extreme meters glow. Costs: `src/template.html` must default to dark. The tile becomes amber with a dark "C", the most visible favicon of the four. Charts put amber on the largest, but amber prints as a light gray (Y 0.46), so the highlight inverts in grayscale. The PDFs and cards must stay light, so the site and its printouts stop matching, and the specimens, designed as ink on paper, become light on dark everywhere. Long reading on a dark ground suits fewer of these readers. Validator: dark country adjacency fails narrowly (red against magenta, 14.7). The light toggle palette fails narrowly too (green against cyan, 13.5). Type: Fraunces' 300 numerals thin out on dark. Use 400.

**D4 Black and white, color for data** (`d4-black-white-data.css`, `sheet-d4-black-white-data.png`). This changes the accent's role: kickers, links, the current tab and focus are ink, and one vermilion marks only data (Extreme, Critical, the largest value). Stacks become vermilion plus a gray ramp, which is an alternative chart system. It is the most rigorous of the four and reads like a statistical bulletin, but it is also the coldest. Costs: the black tile vanishes on a dark tab bar (1.17:1 against `#202124`; see `identity/tiles-all-directions.png`) and needs a light keyline. In grayscale the vermilion lead (Y 0.17) prints lighter than the first ramp step (Y 0.07), so the ramp must start lighter (`directions/charts-all-directions-color-over-gray.png`). The ramp's light end fails the validator's 2:1 floor. Dark countries fail CVD on teal against plum (3.5). PDFs simplify and the cards turn white. Type: pure white sharpens Source Serif's contrast. An off-white (`#fbfbfa`) would read better.

**Chart color system.** Keep "accent on the largest, site hues on the rest" (D1). D4's one-color-plus-gray stacks are the real alternative. They are calmer and cleaner, but they lose segment identity past three segments and need a lighter ramp to survive print. Chart grammar is left to the dataviz critic.

**Default theme.** Keep light. The PDFs, the cards and the specimens are designed as ink on paper, a reference work is read and printed in light, and dark-first (D3) breaks print parity. Following the device is acceptable only after P1.3 and P3.2 make dark a design of its own. Even then, light keeps one face for the site, its printouts and its cards.

**Recommendation: D1.** The identity is right, and the owner chose its wordmark three days ago. Every fault found is a fault of meaning or execution, and D1 fixes all of them with tokens and one build change, at no cost to the tile, favicon, cards or type.

## 4. Top five
1. **One red** (P1.1 with P2.1): China leaves garnet's red, and Japan and Korea separate. `proofs/p1-onered-pipe-dark-before-over-after.png`, `proofs/p1-onered-pipe-light-before-over-after.png`, `proofs/p1-onered-controls-pair.png`.
2. **One country, one color** (P1.2): the chapter stacks use the Suppliers map. `proofs/p1-country-stack-before-over-after.png`.
3. **Dark built on garnet's hue** (P1.3 with P3.2). `proofs/p1-dark-accent-chapter-before-after.png`, `proofs/p1-dark-accent-home-before-after.png`.
4. **The largest bar survives grayscale** (P2.2). `proofs/p2-bars-grayscale-before-over-after.png`.
5. **Direction 1, the ledger refined**, chosen over three alternatives (cool film, dark-first amber, black and white with color for data). `directions/sheet-d1-ledger-refined.png` against `directions/sheet-d0-current.png` and the other sheets.
