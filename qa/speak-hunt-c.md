# Claude-speak hunt C — interface copy

Method: read every reader-visible string in `src/template.html`, `build/build.js`, the two `summary-a.js` files, `build/modules/walk.js`, `src/modules/lookup.js`, `src/modules/print.js` and the visible-string half of `src/app.js`; confirmed each one renders by pulling the live DOM text of every view at `localhost:8841` and shooting the eight views at 1440×900 (`qa/speak/home.png`, `intro`, `chain`, `landscape`, `suppliers`, `controls`, `exposure`, `glossary`, `c-chapter-litho`); dropped everything the 9 September sweep already cut and everything the build no longer emits.

| File | Where (line · page) | Exact quote | Cat | Proposed |
|---|---|---|---|---|
| src/template.html | 72 · The Chain, How to read a chapter | `Every chapter opens with a chokepoint card. Three fields on it matter most.` | 5 | `Every chapter opens with a chokepoint card.` — the second sentence is a numeric list stem, the tic the audit counted 11 times in the chapters; the three bold labels below already announce themselves. |
| src/template.html | 75 · The Chain, How to read | `Easy, Moderate, Hard or Very hard, rated against four written tests.` | 3 | `Easy, Moderate, Hard or Very hard, rated against four tests.` — "written" is there to prove the tests exist. |
| src/template.html | 76 · The Chain, How to read | `<b>Price or market size.</b> What one unit costs, or what the stage earns in a year, from filings.` | 3 | `<b>Price or market size.</b> What one unit costs, or what the stage earns in a year.` — the other two fields carry no provenance tail; this one is decoration. |
| src/template.html | 78 · The Chain, How to read | `The chapters run in process order, and every number links to its source.` | 3 | `The chapters run in process order.` — every citation number on the page is a live footnote card; saying so is the transparency flourish. |
| src/template.html | 96 · AI Chips dek | `Pick two to four chips.` | 4 | `Two to four at a time.` — keeps the cap (which is genuinely invisible) and drops the instruction; the picker is in view and already carries `aria-label="Choose two to four chips to compare"`. |
| src/template.html | 104 · AI Chips, under "Packages at one scale" | `Every package is drawn from above at one scale.` | 1 | CUT — it repeats the heading three words later. The rest of the paragraph (what a die, stack, interposer and substrate are) is the sentence that earns its place. |
| src/template.html | 133 · Suppliers, Ladder/Table group | `aria-label="How to show the firms"` | 1 | `aria-label="Firm list layout"` — a screen reader hears an explanation where a name will do. |
| src/template.html | 156 · Export Controls, By subject / By date | `aria-label="How to read the moves"` | 1 | `aria-label="Order the moves"`. |
| src/template.html | 179 · Export Controls › China revenue share | `Each firm's China revenue share, year by year, as filed.` | 1, 3 | CUT — it restates the heading directly above it ("China share of revenue, from company filings") and "as filed" restates the restatement. |
| src/template.html | 181 · China revenue share | `Show the same figures as a table` | 4 | `The same figures as a table` — a disclosure triangle is the "show". |
| src/template.html | 191 · Index dek | `Every term, firm and chip on the site, with the passages that use it.` | 4 | `Every term, firm and chip, with the passages that use them.` — "on the site" is the site talking about itself. |
| src/template.html | 201 · Index, resting pane | `Type a name, or browse the list.` | 4 | CUT — the search box has a placeholder ("A term, a firm, a chip…") and on desktop the 346-entry list sits beside it; on a phone the visible control is labelled "Browse all entries". The Try row below does the work. |
| build/build.js | 368 · every chapter (and 482, the essay) | `Sources for this chapter (25)` | 4 | `Sources (25)` — since the Sources page was removed there is no other list to distinguish it from. |
| build/build.js | 372 · every stage chapter head | `You are here: <b>Lithography</b>, stage 4 of 15` | 4, 1 | `<b>Lithography</b>, stage 4 of 15` — the strip above it highlights and names stage 04, and the tile beside it already reads "STAGE 4 OF 15". Screenshot: `qa/speak/c-chapter-litho.png`. |
| build/build.js | 562 · Export Controls dek | `Every move since 2018, what can still flow to China, and each firm's China sales as filed.` | 3 | `Every move since 2018, what can still flow to China, and each firm's China sales.` — third "filings/as filed" flourish within two screens of the same page. |
| build/build.js | 564 · China revenue share, note | `Each row says which.` | 1 | CUT — the basis is printed in every row, under the firm's name. |
| build/modules/summary-a.js | 228 · Home, country panel share lines | `estimated here` / `computed here` | 4 | `estimate` / `computed` — "here" is the site pointing at itself; the flag reads fine as a bare noun ("Leading-edge logic manufacturing (≤5 nm) ESTIMATE 72% 2025"). |
| build/modules/summary-a.js | 273 · Home, China panel | `Where China stands, from the chokepoint cards` | 3 | `Where China stands` — each line under it is already a link to the chapter it came from. |
| build/modules/summary-a.js | 281 · Home, Malaysia panel | `No firm in the supplier list is based here` | 4 | `No firm in the supplier list` — the panel head names the country, so "here" is doing nothing. (Renders on Malaysia, which the home page lists.) |
| build/modules/summary-a.js | 411 · Home, route stops (screen readers) | `Stop 4, Lithography: Veldhoven, led by ASML, extreme concentration. Read the chapter.` | 4 | Drop `Read the chapter.` from the label — the element is a link and is announced as one; the label should end at the facts. |
| build/modules/summary-a.js | 422 · Home, The Chain door | `Every stage in full, from design to the data centre.` | 5 | `Every stage in full, in process order.` — the "from X to Y" sweep the audit cut four times; this one sits 300 px above a second use of the same sweep ("from design in California to the data centre in Virginia"), which is the one that earns it. |
| build/modules/summary-a.js | 430, 431 · Home section heading and its aria-label | `What leverage does each country have?` | 5 | `What each country holds` — a rhetorical question as a heading, built on *leverage*, the abstract noun the audit counted eight times. (Flagging with the caveat that the client named this section; the question mark is the part to lose.) |
| src/modules/summary-a.js | 73 · Home, hover card on a route stop | `click for the chapter` | 4 | CUT — the sweep already removed "Each stop opens its chapter"; this is the same sentence surviving inside the tooltip. |
| build/modules/walk.js | 46 · Start here, the two facts per stage | `aria-label="Two sourced facts"` | 3 | `aria-label="Two facts from the chapter"` — "sourced" is a boast, not a description. |
| build/modules/walk.js | 93 · Start here, the end | `That is the chain, end to end.` | 5 | CUT — a summary of what the reader just read, in the voice of something wrapping up. The three links below it are the ending. |
| src/modules/lookup.js | 75 · Index, count line on a miss | `No entry matches. Anything the site says about it is below.` | 4, 1 | `No entry matches.` — the block below has its own heading; the count line does not need to narrate the page. |
| src/modules/lookup.js | 119 · Index, unmatched query card | `No entry of its own.` | 2 | `No entry.` |
| src/modules/lookup.js | 155 · Index, firm card | `See it among the suppliers →` | 4 | `In the supplier list →` — name the destination, not the act. |
| src/modules/lookup.js | 176 · Index, chip card | `Open it on AI Chips →` | 4 | `On AI Chips →`. |
| src/modules/lookup.js | 238 · Index, "Where the site uses it" empty states | `Only in the supplier list so far.` / `Only on the AI Chips page so far.` / `Only in this entry so far.` | 2 | Drop "so far" from all three: `Only in the supplier list.` / `Only on the AI Chips page.` / `Only in this entry.` The hedge implies a backlog that does not exist. |
| src/modules/lookup.js | 238 · Index, same block | `Nowhere on the site.` | 2, 4 | `Nowhere else.` |
| src/modules/lookup.js | 238, 242 · Index, heading over the passages | `Where the site uses it` | 4 | `Where it appears` — the site referring to itself in the third person. |
| src/app.js | 413 · AI Chips, live message on a fifth pick | `Four is the limit. Click a selected chip to remove it.` | 4 | `Four is the limit.` — the chips are pressed toggles and Clear sits beside the count. |
| src/app.js | 440 · AI Chips, specimen caption with nothing picked | `An AI accelerator package, drawn from above. Pick a chip to see its own layout.` | 4 | `An AI accelerator package, drawn from above.` — the caption's job is to say what the specimen is. |
| src/app.js | 440 · AI Chips, specimen tag | `AI chips · <b>pick a chip</b>` | 4 | `AI chips · <b>package</b>` — the tag names the specimen everywhere else on the site; here it turns into an instruction. |
| src/app.js | 770 · Suppliers, ribbon stage targets (screen readers) | `Lithography: 6 firms, 2 critical. Show this stage in the list.` | 4 | Drop `Show this stage in the list.` — the element already carries `role="button"`. |
| src/app.js | 846 · Suppliers, legend under the ribbons | `Click a country or a stage to filter the list; click a ribbon for both.` | 4 | CUT the second sentence; keep `Ribbon width is the number of firms a country has at a stage.` Everything clickable draws a cursor and a hover card. Screenshot: `qa/speak/suppliers.png`. |
| src/app.js | 891 · Suppliers, ribbon hover card | `Click to show these firms` | 4 | CUT. |
| src/app.js | 969 · Suppliers, count line | `Showing 220 of 220 suppliers` | 1 | `220 suppliers`, and `31 of 220 suppliers` only when a filter is on. "Showing" narrates, and 220 of 220 is a tautology on first load. |
| src/app.js | 1053 · Suppliers, Table view header | `What they make and why it matters` | 5 | `What they make` — the cell holds one sentence, and "why it matters" is the tic the audit swept out of the prose. |
| src/app.js | 1179 · Export Controls, board intro (twin at template.html:154) | `Ten things move across the chokepoint, each with the licence outcome it stands in today.` | 1 | `Ten things move across the chokepoint.` — the count is the information; the rest describes the shape of a table the reader is looking at, and the legend names every outcome. |
| src/app.js | 1642 · footnote card, any chapter | `Open the source` (renders as `Open the source · asml.com ↗`) | 4 | Drop the verb: `asml.com ↗`, and `Source ↗` when the host is unknown. The arrow and the host already say it opens, and the card above it carries the title, publisher and date. |
| src/app.js | 1777 · China revenue share, hover card | `Click to open the filing` | 4 | CUT — the dot is a link whose aria-label already ends "opens the filing". |
| src/app.js | 1810 · search results, the Start here entry | `One plain paragraph per stage, in order, with the specimens: the chain in one sitting` | 5 | `One plain paragraph per stage, in order, with the specimens` — colon-as-drama with a flourish behind it. |
| src/app.js | 1875 · search panel, near-miss note | `Nothing matches. The nearest entries in the Index.` | 1 | `Nothing matches. Nearest terms:` — the second sentence narrates the list directly beneath it. |
| src/app.js | 1881 · search panel, hint line | `Type to search · Enter opens the first result · Esc closes` | 4 | `Enter opens the first result · Esc closes` — the placeholder in the box says the first clause; keep the two key hints, which are invisible. |
| src/app.js | 1892 · search panel, empty state | `Nothing matches. Try fewer words.` | 4 | `Nothing matches.` — the audit already blessed the bare form. |
| src/app.js | 1880, 1908 · masthead search button | `Search the site` / `Search the site (Ctrl+K, or press /)` | 4 | `Search` / `Search (Ctrl+K, or press /)`. |
| src/app.js | 1929, 341 · AI Chips export bar | `the chips you picked` (renders as `2 rows · the chips you picked`) | 4 | `chips compared` — the other four export labels are plain nouns ("chokepoint board", "export-control timeline"); only this one speaks to the reader. |
| src/app.js | 1936 · footer | `Cite this site` | 4 | `How to cite`. |

## Counts

| File | Rows |
|---|---|
| src/template.html | 12 |
| build/build.js | 4 |
| build/modules/summary-a.js | 6 |
| src/modules/summary-a.js | 1 |
| build/modules/walk.js | 2 |
| src/modules/lookup.js | 7 |
| src/app.js | 18 |
| src/modules/print.js | 0 |
| **Total** | **50** |

## Notes

- **`src/modules/print.js` is clean.** Its one prose string, `Every source is a note at the foot of the page it is cited on.`, is a `String.replace` of a footer sentence ("Hover any footnote for the document; each chapter ends with its own source list.") that no longer exists anywhere in the build, so it never renders. Worth deleting as dead code, but not a copy fault. Its other string, the endnote heading `Notes`, is right.
- **Three dead strings I did not flag**, because nothing renders them: `Nothing else is cited.` in `build/build.js:490` (the Sources view lost its placeholder when the page was removed), the whole `SUMMARY_A` prototype block in `build/modules/summary-a.js` ("Pick a country", "The chain in one strip", "Four numbers that matter", "Copper pins mark…", "Read the whole chain, stage by stage"), and `START_HERE` in `build/modules/walk.js`. The template fills only `HOME_MAP` and `WALK`. If any of them is ever wired back in, "Nothing else is cited" and "Pick a country" are category 3 and 4 on sight.
- **Two more dead strings** in `src/app.js`: the matrix note at 1156 (`Every figure links to its filing or report; hover a footnote for the document.` and `The matrix has no data to show.`) and the flows fallback at 1190 (`Every move since 2018, newest last. Open any entry for the full account and its source.`). There is no `#matrix` in the built page and `control-flows.json` always loads, so neither ever appears. The 1190 fallback is category 4 if it ever does.
- **Deliberately not flagged**: the board's five state descriptions and `no change`, `Suspended until`, `Board as of` (the author's, and precise); `not supported` / `not published` / `Not filed for this year` (the precision audit earned these); `No events in this category.`; `Nothing matches.` on its own; the four band names; the tier key; `Read the chapter` as a link label, which names its destination rather than instructing.
- **The pattern behind the list**: 21 of the 50 are category 4, and almost all of them are one shape — a sentence bolted onto a control that already shows what it does ("Click…", "Pick…", "Type…", "Show this stage in the list", "Open the source"). The second-largest group is provenance said out loud ("as filed", "from filings", "from the chokepoint cards", "sourced", "every number links to its source"): five separate places where the site tells the reader it is honest, on a page whose every number is already a footnote. Cutting those two families would take the interface most of the way.
