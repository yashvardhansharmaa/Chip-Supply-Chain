# Claude-speak hunt, the interface copy

**4 changes.** Every user-visible string in `src/template.html`, `build/modules/walk.js`, `build/modules/social.js`, `build/modules/summary-a.js` (the HOME_MAP atlas), `build/build.js`, `src/app.js` and `src/modules/*.js` was read against `SKILL.md` and the categories in `qa/speak-hunt-a.md`: control-explaining sublines, sentences about what something is not, self-reference, first and second person, heading restatements, hedges, throat-clearing, triplets, punchline colons, decorative questions, em dashes, American spellings, `US$`, `data center`. Three passes had already run over this copy, so what remained was small and is listed in full below. Ids, classes, hrefs, data attributes and placeholder tokens are untouched; the credits line, the hero title and subtitle, and every question heading are as they were.

| # | File | Line | Before | After | Category |
|---|---|---|---|---|---|
| 1 | `src/template.html` | 109 | `…with the foundry, process node, memory supplier and packaging plant behind each one. Two to four at a time.` | `…with the foundry, process node, memory supplier and packaging plant behind each one.` | Subline explaining a visible control. The picker's aria-label says "Choose two to four chips to compare", the count line prints "N of 4 chips selected" and a fifth pick answers "Four is the limit." |
| 2 | `src/template.html` | 217 | `<p>Type a name.</p><p class="lk-try">…` | `<p class="lk-try">…` | Instruction for a visible control. The search box carries the placeholder "A term, a firm, a chip, a country…" and the resting panel keeps its "Try" suggestions. |
| 3 | `build/modules/social.js` | 89 | `Every term, firm and chip, with the passages that use them.` | `Every term, firm, chip and country, with the passages that use them.` | Consistency. The Index dek on the page (template line 207) already names countries, added to the Index on 11 Sept; the share card and its page said otherwise. |
| 4 | `build/build.js` | 483 | `…how the export-control campaign has unfolded since 2018, and where the chips actually go.` | `…how the export-control campaign has unfolded since 2018, and where the chips end up.` | Hedge. "actually" was carrying the contrast with the paper route; "end up" carries it without the qualifier. This is the fallback dek: line 485 replaces it with the chapter's own `oneLiner` whenever `content/17` builds, so the page shows the chapter's line and this one only appears if the essay is missing. |

## Read and left alone

- `build/modules/summary-a.js` lines 400 to 440 (`Pick a country`, `Four numbers that matter`, `Read the whole chain, stage by stage`, the map legend) build `SUMMARY_A`, which no template placeholder uses; only `HOME_MAP` renders. `build/build.js` line 494 (`sourcesHTML`, ending "Nothing else is cited.") fills `SOURCES`, which the template no longer carries, and `src/app.js` line 1179 writes to `#matrix-note`, which no longer exists. Dead strings were not edited.
- The em dash appears in the owned files only as the empty-value glyph on a chokepoint card (`build/build.js` lines 249 to 251) and in the Founded column of the supplier table (`src/app.js` line 1081): a symbol for "no figure", not prose, and left.
- `Policy: Money and tariffs, not a gate.` in the board legend (template line 184) is a contrast that separates the one non-licence state from the four licence states; the positive half is there and the negation does work, so it stays.
- `license` in the Britain role line (`build/modules/summary-a.js` line 81) is the verb, spelt correctly. `Specialty gases` and `specialty chemicals` follow the data files' segment names.
- `Ribbon width is the number of firms a country has at a stage.` (`src/app.js` line 866) explains an encoding, not a control, and stays. `Enter opens the first result · Esc closes` names keys the reader cannot see and stays.

## Checks

- `node build/build.js`: clean, no warnings; `dist/index.html` no longer contains "Two to four at a time" or "Type a name", and `dist/index/index.html` carries the corrected Index line.
- `node qa/scripts/check-integrity.js`: clean apart from the pre-existing "has no supplier entry" lines (views: suppliers, controls, glossary, geopolitics, home, landscape, summary-a, walk, stack · ids: 737 · chapters: 17).
