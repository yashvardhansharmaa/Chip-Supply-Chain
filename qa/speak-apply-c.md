# Claude-speak apply C — interface copy

Applied the 50 rows of `qa/speak-hunt-c.md` to the seven files named in the brief: 46 as written, 3 adapted, 1 skipped by the author's name-check. Nothing but string literals changed — no logic, selectors, ids, classes or data attributes, with the two exceptions noted under *adapted*, both forced by the rule that a CUT which empties an element takes the element with it.

`node build/build.js` ran clean after every file. Every changed view was pulled from the live DOM at `localhost:8841` and shot at 1440×900 into `qa/speak/apply-*.png`. No view shows `undefined` or an empty label where a string was cut: a sweep of the eight views found no `undefined` in any rendered text and no empty visible `<p>`, `<span>`, `<li>`, `<h3>`, `<summary>` or `<th>` at any cut site. (The five `undefined` strings in the built file are all JavaScript — UMD guards and one default value.)

## src/template.html — 12 rows: 11 applied, 1 adapted

| Line | Was | Now | Status |
|---|---|---|---|
| 72 | `…chokepoint card. Three fields on it matter most.` | `…chokepoint card.` | applied |
| 75 | `rated against four written tests.` | `rated against four tests.` | applied |
| 76 | `…earns in a year, from filings.` | `…earns in a year.` | applied |
| 78 | `The chapters run in process order, and every number links to its source.` | `The chapters run in process order.` | applied |
| 96 | `Pick two to four chips.` | `Two to four at a time.` | applied |
| 104 | `Every package is drawn from above at one scale.` | CUT; the paragraph now opens `The logic dies do the computing…` | applied |
| 133 | `aria-label="How to show the firms"` | `aria-label="Firm list layout"` | applied |
| 156 | `aria-label="How to read the moves"` | `aria-label="Order the moves"` | applied |
| 179 | `<p class="controls-intro">Each firm's China revenue share, year by year, as filed.</p>` | element removed (the CUT emptied it) | applied |
| 181 | `Show the same figures as a table` | `The same figures as a table` | applied |
| 191 | `Every term, firm and chip on the site, with the passages that use it.` | `Every term, firm and chip, with the passages that use them.` | applied |
| 201 | `Type a name, or browse the list.` | `Type a name.` | **adapted** |

**Adapted (201).** The row said CUT; judgement rule (a) says keep a prompt, because on a phone the list is hidden behind Browse. Shortened rather than cut. The Try row below it is untouched, and the resting pane still reads as an instruction to someone who cannot see the list.

Shots: `apply-chain.png` (How to read a chapter), `apply-landscape.png` (dek and the package paragraph), `apply-exposure.png` (the cut intro), `apply-glossary.png` (dek and resting pane), `apply-suppliers.png`, `apply-controls.png`.

## build/build.js — 4 rows: 4 applied

| Line | Was | Now |
|---|---|---|
| 368 | `Sources for this chapter (25)` | `Sources (25)` |
| 482 | `Sources for this essay (58)` | `Sources (58)` — the essay twin the row named |
| 372 | `You are here: <b>Lithography</b>, stage 4 of 15` | `<b>Lithography</b>, stage 4 of 15` |
| 562 | `…and each firm's China sales as filed.` | `…and each firm's China sales.` |
| 564 | `…where the customer is based. Each row says which.` | `…where the customer is based.` |

Shots: `apply-chapter-litho.png` (the chapter head), `apply-chapter-sources.png` (an open source list), `apply-controls.png` (the dek), `apply-exposure.png` (the note).

## build/modules/summary-a.js — 6 rows: 5 applied, 1 skipped

| Line | Was | Now | Status |
|---|---|---|---|
| 228 | `estimated here` / `computed here` | `estimate` / `computed` | applied |
| 273 | `Where China stands, from the chokepoint cards` | `Where China stands` | applied |
| 281 | `No firm in the supplier list is based here` | `No firm in the supplier list` | applied |
| 411 | `Stop 4, Lithography: Veldhoven, led by ASML, extreme concentration. Read the chapter.` | ends at `…extreme concentration.` | applied |
| 422 | `Every stage in full, from design to the data centre.` | `Every stage in full, in process order.` | applied |
| 430, 431 | `What leverage does each country have?` | unchanged | **skipped** |

**Skipped (430, 431).** The brief names this heading as fixed by the author, question mark kept. The `aria-label` on the section at 430 was left alone with it, so the accessible name still matches the visible heading.

Rule (b) governs 411: the instruction went, the label still opens with the stop's name and town, which is what a screen reader needs from a link.

Shots: `apply-home.png` (the doors), `apply-home-panel.png` (China: the flags, the *Where China stands* head, the firm line).

## src/modules/summary-a.js — 1 row: 1 adapted

| Line | Was | Now | Status |
|---|---|---|---|
| 73 | `Extreme concentration · click for the chapter` | `Extreme concentration` | **adapted** |

**Adapted.** Cutting the clause left both a dangling ` · ` and, for a stop with no band, an empty `<span class="sa-stop-tip-s">` — which carries `margin-top: 4px`, so it would have opened a gap under the town line. The span now sits inside the `d.band` test that was already there: `+ (d.band ? '<span class="sa-stop-tip-s">' + d.band + ' concentration</span>' : '')`. No new condition, no class or selector changed; the empty case simply produces no element, per the brief's rule on CUTs that empty an element.

Shot: `apply-home-stoptip.png` (stop 4 hovered).

## build/modules/walk.js — 2 rows: 2 applied

| Line | Was | Now |
|---|---|---|
| 46 | `aria-label="Two sourced facts"` | `aria-label="Two facts from the chapter"` |
| 93 | `<p class="wk-end-t">That is the chain, end to end.</p>` | element removed (the CUT emptied it) |

The ending now runs from the last paragraph's rule straight into the three links, with no hole where the line was.

Shot: `apply-walk-end.png`.

## src/modules/lookup.js — 7 rows: 7 applied

| Line | Was | Now |
|---|---|---|
| 75 | `No entry matches. Anything the site says about it is below.` | `No entry matches.` |
| 119 | `No entry of its own.` | `No entry.` |
| 155 | `See it among the suppliers →` | `In the supplier list →` |
| 176 | `Open it on AI Chips →` | `On AI Chips →` |
| 238 | `Only in the supplier list so far.` / `Only on the AI Chips page so far.` / `Only in this entry so far.` | the same three without `so far` |
| 238 | `Nowhere on the site.` | `Nowhere else.` |
| 238, 242 | `Where the site uses it` | `Where it appears` (both the empty and the counted head) |

Checked live: the ASML card (`In the supplier list →`, `Where it appears · 38 places`), a chip card (`On AI Chips →`), six chips that show the empty state (`Only on the AI Chips page.`), and a nonsense query (`No entry matches.`, `No entry.`, `Nowhere else.`).

Shots: `apply-index-entry.png`, `apply-index-miss.png`.

## src/app.js — 18 rows: 17 applied, 1 adapted

| Line | Was | Now | Status |
|---|---|---|---|
| 413 | `Four is the limit. Click a selected chip to remove it.` | `Four is the limit.` | applied |
| 440 | `An AI accelerator package, drawn from above. Pick a chip to see its own layout.` | `An AI accelerator package, drawn from above.` | applied |
| 440 | `AI chips · <b>pick a chip</b>` | `AI chips · <b>package</b>` | applied |
| 770 | `Lithography: 6 firms, 2 critical. Show this stage in the list.` | `Lithography: 6 firms, 2 critical.` | applied |
| 846 | legend's second sentence | CUT; `Ribbon width is the number of firms a country has at a stage.` stands | applied |
| 891 | `<span class="sup-tip-more">Click to show these firms</span>` | element removed (the CUT emptied it) | applied |
| 969 | `Showing 220 of 220 suppliers` | `220 of 220 suppliers` | **adapted, part done** |
| 1053 | `What they make and why it matters` | `What they make` | applied |
| 1179 | `Ten things move across the chokepoint, each with the licence outcome it stands in today.` | `Ten things move across the chokepoint.` | applied |
| 1642 | `Open the source · asml.com ↗` | `asml.com ↗`, and `Source ↗` where the host is unknown | applied |
| 1777 | `<br>Click to open the filing` | CUT, the break with it | applied |
| 1810 | `…with the specimens: the chain in one sitting` | `…with the specimens` | applied |
| 1875 | `Nothing matches. The nearest entries in the Index.` | `Nothing matches. Nearest terms:` | applied |
| 1881 | `Type to search · Enter opens the first result · Esc closes` | `Enter opens the first result · Esc closes` | applied |
| 1892 | `Nothing matches. Try fewer words.` | `Nothing matches.` | applied |
| 1880, 1908 | `Search the site` / `Search the site (Ctrl+K, or press /)` | `Search` / `Search (Ctrl+K, or press /)` | applied |
| 341, 1929 | `the chips you picked` | `chips compared` (both twins) | applied |
| 1936 | `Cite this site` | `How to cite` | applied |

**Adapted, part done (969).** Only the literal half is in: `Showing ` is gone, so a filtered list now reads `31 of 220 suppliers`. The rest of the row — `220 suppliers` when no filter is on — cannot be done with a string literal; it needs a test of `rows.length === this.rows.length`, and the brief bars logic in this file. The one line, if you want it:

```js
$('#sup-count').textContent = (rows.length === this.rows.length ? rows.length + ' suppliers' : rows.length + ' of ' + this.rows.length + ' suppliers')
```

Two rows sit inside conditionals that were already there, so no branch was added: 1642 swaps the literals in the existing `hostName ?` test (`Source` is now the fallback the row asked for), and 1777 drops a trailing literal.

Shots: `apply-landscape-limit.png` (the fifth pick), `apply-suppliers.png` and `apply-suppliers-legend.png` (legend, count, table head), `apply-suppliers-tip.png` (ribbon card), `apply-controls.png` (board intro), `apply-footnote.png` (footnote card), `apply-search.png` (hint line), `apply-footer.png` and `apply-footer-cite.png` (*How to cite*, credits line untouched).

## Counts

| File | Rows | Applied | Adapted | Skipped |
|---|---|---|---|---|
| src/template.html | 12 | 11 | 1 | 0 |
| build/build.js | 4 | 4 | 0 | 0 |
| build/modules/summary-a.js | 6 | 5 | 0 | 1 |
| src/modules/summary-a.js | 1 | 0 | 1 | 0 |
| build/modules/walk.js | 2 | 2 | 0 | 0 |
| src/modules/lookup.js | 7 | 7 | 0 | 0 |
| src/app.js | 18 | 17 | 1 | 0 |
| **Total** | **50** | **46** | **3** | **1** |

Untouched, as instructed: the hero title and subtitle, the credits line (`Made by Yashvardhan Sharma with Claude…`), the tab names, the board legend's five state descriptions and `Suspended`, the four band names, the four legal outcomes, and the *What leverage does each country have?* heading with its question mark.

## Final build

```
$ node build/build.js
built 2026-09-11T00:25:22.815Z
source tiers: A 322 · B 22 · disallowed 0 · unclassified 0
chapters: 16 + geopolitics
words: 22969
sources: 344
landscape: 35 chips · suppliers: 220 · timeline: 50 · matrix: 20 · glossary: 91 · controls: 40 · exposure: 108
size: 2396 KB
exit 0 · no errors, no warnings
```

Word, source and size counts move under you while the sister lists land in the chapters and the data files; a build ten minutes later read `size: 2405 KB`, also clean.

## Three things found on the way, none of them mine to fix

- **`four written tests` survives in `data/glossary.json:565`**, in the `substitutability` entry's plain-language definition. The template's copy of the phrase is cut; this one renders in the Index and belongs to the data list, not to C.
- **The AI Chips export label never renders.** `addExport` returns early when its rows are empty (`!get().length`), and the page opens with no chip chosen, so the bar is never built. Both twins now read `chips compared`, but neither can be seen until a selection exists at boot.
- **The *How to cite* block lands on the home page, not the chapter page.** The template has two `.site-footer` elements (home at line 58, the chain at line 90) and `$('.site-footer')` takes the first. Long-standing, unrelated to this list, but worth knowing when hunting for the block.

Also left alone deliberately: the board intro's twin in `src/template.html:154` (`Each row is a thing that moves across the chokepoint…`), the pre-JS default that `app.js:1179` overwrites the moment the flows load. The hunt list scoped the row to `app.js`; the template default was not counted among its 12 rows, so it still carries the older wording if the flows ever fail to load.
