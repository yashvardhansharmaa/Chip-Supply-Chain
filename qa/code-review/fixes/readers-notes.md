# Readers fixes: notes (21 October 2026)

PLAN.md items 3, 4, 5, 6 and 8, plus the accessibility items in the same components. All 15 repros failed on the build as it stood at 11:29 and pass on the current build. A 16th test checks that a real click and a phone tap still reach a ribbon (it passes before and after).

## Proof
Everything is in `qa/code-review/fixes/readers/`.
- `repro.py` runs each repro. `before.json` holds the 11:29 build, replayed from a saved copy of its `index.html` (the harness answers the page request itself, so no second server is needed). `after.json` holds the live build.
- `cdp.py` is the headless Chrome harness. It blocks external hosts, can fake the clock, sends real key events, emulates page focus and collects console errors.
- `shots.py` writes the `before-*.png` and `after-*.png` pairs: the board on 11 Nov, Look it up on desktop and phone, a passage link, Japan's firms, and Tab from a term.
- `sweep.py` checks eight routes at 1440, 1024, 390 and 320, in light and dark. Results are in `sweep.json` and `sweep-*.jpg`. It found 0 console errors and no sideways scroll, 320 included.
- `check-speak`: no matches. `check-integrity`: no problems. `check-sources`: all tier A or B.

## Items
| ID | Fix | Where | Before → after |
|---|---|---|---|
| correctness P1-3 | The board's Now is the later of the last entry and the reader's today | `Geo.build` | On a faked 11 Nov: "7 Sept 2026" with all three stays showing → "11 Nov 2026" with only the 27 Nov stay. Today it reads "21 Oct 2026" |
| a11y #5 (board) | One polite status, `#cf-status`. It speaks when a reader moves the board (a year, the arrow keys, Now) and when a filter chip changes the events shown. Board moves made by scrolling are not announced | `Geo.build`, `pickYear`, `setAsOf` (now returns the rows changed), `paintBoard`, new `sayAsOf` and `say` | No status → "Board as of 31 Dec 2022. 11 rows changed." and "13 of 74 events shown: China." |
| correctness P1-1 | `Router.settle` takes a generation number, and a newer settle retires the older. The passage link jumps to the passage, then settles it | `Router.settle`; `Lookup.wire` | The passage was never on screen (top 9,258 px) → 71 px from the top from 250 ms to 2.6 s |
| correctness P1-5 | The popover hides on a click on its own link and on every hashchange (Cite does too). An anchored Glossary route starts at the top on desktop, or at the entry on a phone. The list scrolls itself, never the window | `Tip.init`, `Cite.init`; `Lookup.activate`, new `land` and `inList` | Tip open over the Glossary, entry head at −117 px → tip hidden, head at 322 px (desktop) and 109 px (phone). Entry to entry: −51 px → visible |
| correctness P1-4 | `.ch-meta` and `.ch-cite` are left out of the passage index. The stale `.brief-head` and `.lead-cn` are gone. The index is built in the browser (`Lookup.corpus`), not in `build/build.js` | `Lookup.corpus` | 1,035 indexed, 51 of them chapter-head lines → 984 indexed, 0. A search for "Yashvardhan" found 17 places → none |
| a11y #1 | A choice (click, Enter, a suggestion, a card's button) moves focus to the entry's heading (`tabindex=-1`). Arrows in the search box only preview. The list is one Tab stop: arrow keys, Home and End walk it | `Lookup.select(id, push, focus)`, new `focusCard` and `rove`, `init` | 483 Tabs to the card → 1. Tab from the search box: list, then the card |
| QA / a11y #1 | Enter in the Glossary search moves focus to the entry, not to the page | `Lookup.init` | BODY → the entry's DT |
| a11y #5 (Glossary) | `#lk-count` is a polite status, set after the first count | `Lookup.init` | none → `role=status` |
| PLAN #6 | Company page and From China links: `safeUrl` already escapes, so its output is no longer escaped again | `Lookup.firmCard` | `…N46&amp;selectedNode…` → `…N46&selectedNode…` (Lam Research and Wistron) |
| correctness P1-2 (ribbons) | A ribbon sets its country, never toggles it. Country labels still toggle | `Suppliers.setCountry(c, scroll, force)`, the ribbon click in `drawPipe` | "10 of 226 suppliers · Photomasks" → "6 of 226 suppliers · Photomasks · Japan" |
| correctness P1-2 (links) | New `Suppliers.show({q, country, stage, chk})` sets the whole filter, so an older search or stage cannot narrow it. The Glossary's links use it. The count line names the search | `Suppliers.show`, `render`; `Lookup.wire` | Japan "3 of 226" with "ASML" still typed → "45 of 226 suppliers · Japan", box empty. ASML now reads "13 of 226 suppliers · matching “asml”" |
| a11y #5 (Suppliers) | `#sup-count` is a polite status, set after the first render | `Suppliers.render` | none → `role=status` |
| a11y #12 | After a sort, focus goes to the new header button. `aria-sort` moves from the button to its `th`, and the arrow CSS follows | `Suppliers.sortBy`, `renderTable`; `styles.css` `.sup th[aria-sort] button::after` | BODY → the button. `th` ascending, then descending |
| correctness P1-6 | Timeline mentions link to `#/controls/<id>`. A board state's mention links to the entry that set it. All 60 state events resolve | `Lookup.mentions` | 13 mentions, all `#/controls` → each to its own entry |
| correctness P1-7a, a11y #18 | While the popover is open, Tab from the term goes to its link. From the link, Tab goes to the next stop after the term and Shift+Tab goes back. Escape returns to the term with the popover shut | new `Tip.tab` and `Tip.after`, `Tip.init` | Tab skipped the link → reached it on desktop and phone |
| correctness P1-9 | The stale "Essay · Who Controls the Chain → #/controls" search entry is deleted | `Tools.buildIndex` (one line) | 1 such entry → none. The Chapter entry still comes first |
| a11y #10 (WCAG 1.4.13) | The ribbon, China revenue and atlas tips close on Escape. They wait 260 ms before closing and stay while the mouse is on them. They take the pointer only under `(hover: hover)`, so taps still reach the drawing. The ribbon tip now opens just above the pointer, never under it | `Suppliers.build`, `drawPipe`, `showRibTip`, `hideTip`; `Controls.build`; `src/modules/summary-a.js`; the `.sup-tip`, `.ex-tip` and `.sa-stop-tip` rules | Escape did nothing and moving onto a tip closed it → both work |

Shared files were edited with small anchored Edits only. Nothing in `template.html` or `build/build.js` changed. `src/modules/lookup.js` changed only for these fixes.

## Not done, or for someone else
- **The board's labels are data.** After 9 Nov the Entity List row drops "Suspended until", but its label still reads "Affiliates rule suspended until 9 November 2026". The weekly refresh should add the lapse, or an extension, as a new state: 10 Nov for `entity`, 11 Nov for `minerals-world`.
- **Supplier results in site search** still set only the search box (`Tools`, a11y's code), so an older country filter stays. The fix is one call in the result's click handler: `Suppliers.show({ q: h.q })`.
- **The router's `!anchor` scroll gap** was left alone. The only bare anchor outside The Chain, Home and the Glossary is the skip link's `#main`, and the Glossary now places itself.
- **Arrow-key previews in the Glossary search** are still silent. Announcing them needs a combobox and listbox rework.
- **PDFs were not re-rendered.** No fix touches print: the tip, sort-arrow and focus changes are screen-only, and print.js is untouched.
