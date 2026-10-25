# Redesign, stage 3: the Glossary as a dictionary (option B)

Branch `redesign-glossary`, made from `redesign` at 24b10b8. Built to `qa/redesign/BRIEF.md`, the chosen mockup `qa/design4/glossary/B-dictionary.html` with its `notes.md` and shots (all in the main checkout), and the stage 1 to 3 reports. No definition was rewritten, and nothing in `content/` or `data/` changed.

## What was built

### The view, `#/glossary` (`src/modules/lookup.js`, `src/modules/lookup.css`, the Glossary section of `src/template.html`)

**The head.**
- "Glossary" in Fraunces 350 and its standfirst, in the views' shared head (`.view-head.vh`, as on Suppliers and Export Controls).
- Under them, the counts: "208 terms · 226 firms · 38 AI chips · 15 countries". The build counts them from the list (`GLOSSARY_TALLY`, `build/build.js`), so no number is typed by hand.
- Beside them, over an ink rule, the six Try suggestions as pills. They are drawn afresh on every visit, by today's rule: two short terms, two Critical or Important firms, one chip and one country.

**The sticky bar.** It sticks under the masthead and holds:
- the search field;
- the kinds as pills with their counts (All 487, Terms 208, Firms 226, AI chips 38, Countries 15), the pressed one filled black;
- the count line ("487 entries", "65 of 487 entries", "No entry matches.");
- the thumb index of letters. A letter with no entries is grayed out. The letter in view is marked with a red wine rule, and on a phone it stays in view in its strip.

**The dictionary.** All 487 entries stand in columns, A to Z. Each letter has a large Fraunces letter and guide words: "15 CFR to 3B001, 4 entries".
- A term shows its kind ("term" or "export control"), its other names, the definition and the reason it matters, all verbatim from its own block. Under them come "Read it in" and "Also in", with the chapters that use the term.
- A firm shows "firm, Netherlands", its rating as the Suppliers mark in ink, the list's segment label, its subcategory and its one line.
- A chip shows "AI chip, United States", the line "Announced 2024-03 · TSMC 4NP (custom N4P) · HBM3E 192 GB · 1000 W", and its status.
- A country shows its card's meta line and its role line.
- The foot of each entry says what the sheet adds: "Where it appears, 110 places", "Card and 63 places", "Card", or for a term no passage uses, "Only in this entry." The counts are worked out a few entries at a time while the browser is idle. On a phone slowed four times, the longest task while the site opens on the Glossary is 794 ms, against 3,988 ms for the live site.

**Search.** It filters the columns in place, with today's rules:
- every word must be in the entry's text;
- names that contain the query, and other names that start with it, are name matches, and an exact name or alias tops them.

Up to six name matches stand first under "Names that match", with "3 entries, then 62 more below that mention it". The rest stay in their letters. Typing brings the results under the bar.
- Enter opens the first match, and its title takes focus.
- The arrow keys preview the matches in the sheet while focus stays in the field. On a phone, the down arrow moves to the first headword.
- Escape clears the field, and a second Escape closes the sheet.

When nothing matches, the page shows "No entry", the words typed, "Did you mean" with names a typo away, and the passages that mention the words.

**The sheet.** A headword, the line at the foot of an entry, a Try pill, Did you mean or a country card's Critical firm opens the entry in the sheet:
- a term as the page lays it out (kicker, Fraunces title, other names, definition, reason, Read it in and Also in);
- a firm, a chip or a country as the site's own card, unchanged in content: revenue with the filing link, the China share chart, the EU-27 line, the Critical firms as buttons;
- then "Where it appears" with 12 passages and "Show all".

The sheet's bar reads "Term · 140 of 487", with ← and → stepping through the entries in the order shown, and Close. Close and Escape hand focus back to the headword. Its place depends on the width:
- From 1,000 px it hangs beside the columns under the bar, and the columns reflow into the room left.
- From 761 to 999 px it lies over the page under a scrim, as a dialog. The rest of the page is inert, and a click beside the sheet closes it.
- On a phone it takes the whole screen, as a dialog, with the masthead and the page inert.

The open entry is marked in the columns with a red wine rule.

**Addresses.**
- An entry's address still opens it: `#gl-euv`, `#lk-country-nl`, `#lk-firm-asml` and `#lk-chip-nvidia-b200`. The columns bring the entry into view beside the sheet.
- Opening an entry puts its address in the bar without adding history. Closing it, or the Glossary tab, returns to `#/glossary`.
- A passage link opens its chapter and flashes the passage, and Back returns to the open entry.

**Unchanged on purpose.** `#lk-items` and `#glossary` stay in the page as hidden data, with every id. Four things keep reading them untouched:
- the look-up popovers in the chapters (`src/app.js` Tip);
- the site search's index and its suggestions;
- the router's bare anchors;
- the smoke test.

`src/app.js` is not changed.

### The static page, `/glossary/` (`build/modules/reference-pages.js`, the Glossary block of `build/assets/reference-page.css`)

- The page keeps everything it had: the head, Open the interactive page, the DefinedTermSet JSON-LD with all 208 terms, every term's anchor (`/glossary/#euv`), the letter jumps, and the Firms, AI chips and Countries lists linking to Suppliers and AI Chips.
- The terms take the dictionary's columns: large letters with guide words, the headword with its kind in italic, other names, definition, reason, Read it in and Also in.
- The letters are a thumb index that sticks to the top of the window. A linked entry is marked with the red wine rule (`:target`).
- There is no script or button on the page. It weighs 359 KB, against 352 KB before and the 400 KB budget.
- The chapters each term is read in are worked out once, here, and handed to the app as `DATA.glossaryRefs`, so the two pages print the same lines.

## Departures from the mockup

1. **Each letter is set as pages.** A long letter ran to 4,900 px of columns at 1440 and 6,800 px at 1024. A reader finishing one column would scroll back up several screens to start the next. Each letter is now set as pages of three entries to a column, nine on a wide screen, with a hairline between pages, as a printed dictionary turns its page. On a phone it is one column with no pages. The first screen is unchanged from the mockup.
2. **No "Reference · Updated" kicker over the title.** The other views' heads (Suppliers, Export Controls) do not have it, as stage 3 decided for Suppliers.
3. **A firm's line uses the list's own segment label** ("Advanced packaging", "Substrates & PCBs"), where the mockup printed the full category. These are the labels the Glossary list has always shown, so every firm keeps its kind word for word. The full category is still on the card.
4. **Below 1,000 px the sheet is modal.** The mockup let it lie over a live page between 761 and 999 px.
5. **The arrows preview** in the sheet, as today's page does, where the mockup moved focus to the first headword. On a phone they still move focus, since the sheet would cover the field.
6. **On a phone up to 360 px the field drops its icon**, so its hint, "A term, a firm, a chip, a country", is never cut off.

## QA gates

| Gate | Result |
| --- | --- |
| 1. `node build/build.js` | Passes with no warnings, as in MAIN. |
| 2. The four checks | All pass. `check-speak`: no matches. `check-integrity`: no problems (17 chapters). `check-sources`: 2,851 citations, all tier A or B. `check-size`: no file over 5 MB (`dist/index.html` 4.63 MB). |
| 3. `node qa/scripts/smoke.js --port 9646` | Passes: 33 page loads, no failures. The light ground stays white, and `?theme=dark` turns it dark. |
| 4. Text census, against 8765 (`qa/redesign/census.js --only glossary,/glossary/`, output `qa/redesign/census-glossary.txt`) | No text lost. The view loses no word. The static page's only lost "words" are the old page's run-together tokens, plus one chapter link that main's newer chapter 11 adds (both listed below). |
| 5. Layout sweep (`qa/redesign/sweep.js --set glossary`, output `qa/redesign/sweep-glossary.txt`) | 48 loads, no findings. The loads cover the view at rest, with a term open (`#gl-euv`), with a country's card open (`#lk-country-nl`) and `/glossary/`, each at 320, 390, 768, 1024, 1280 and 1440 px, in light and dark. The checks are no sideways scroll, no text under 11 px, no clipped or overlapping text, and a focus mark on each of the 1,896 Tab stops reached. One finding on the way was fixed: the static page's letters overflowed by 19 px at 768. |
| 6. Look-up cards in a chapter | They still open, as popovers. In Lithography, a term opens its card over the text at 1440. At 390 it opens as a sheet over the foot of the screen. The card reads the same definition as the Glossary, and Look it up opens the entry in the sheet, with focus on its title at 1440 and full screen on a phone (`qa/redesign/interact-glossary.js`). |
| 7. Look | 33 shots (list below) were compared with `B-1440.png`, `B-1440-entry.png`, `B-1440-dark.png`, `B-390.png`, `B-390-entry.png` and `B-390-search.png`. The first screens match the mockup at both widths, in light and dark. The changes made after review are the departures above: the pages, the static letters at 761 to 900 px, and the field at 320 px. A fourth fix came from an innerText check: the static "Read it in" labels had taken the chapter pages' `.k` rule and broken onto their own lines. |

Also run, all passing:
- `qa/redesign/interact-glossary.js`, 90 checks. They cover:
  - the columns, every definition shown, the counts, Try and the pages;
  - the counts of passages, and that the sheet and the column agree;
  - search with the names first, Enter, ← and →, Escape and focus, the arrows' preview, the kinds;
  - no entry, Did you mean, the letters and the spy;
  - the four kinds of address, the card's facts, Show all, a passage link out and Back, and the Glossary tab;
  - the popovers at 1440 and 390, and the overlay at 768 with a click beside it;
  - the phone's full-screen sheet with the page inert and released, and a link out leaving nothing inert;
  - dark mode, and the static page (JSON-LD, lists, CTA, no button);
  - no script errors.
- `qa/redesign/interact.js` (the home) and `interact-review2.js` (16 checks).

## Census differences

**The view (`#/glossary`).** It had 995 lines and now has 3,489, because every definition now shows. No word is lost. The lines that went:
- The list's labels stood alone beside each name: "AI chip" (38), "Accelerator vendors" (28), "Substrates & PCBs" (17), and so on, 264 in all. They now sit inside each entry's line under the name, so the same words appear:
  - a firm's label in its meta line ("Critical · Substrates & PCBs · …");
  - a chip's "AI chip" in "AI chip, United States".
- "Term" and "Export control" now read "term" and "export control" beside the headword. That is a change of letter case only (226 lines).
- "487 entries · 208 terms · 226 firms · 38 chips · 15 countries" is now two lines: the head's "208 terms · 226 firms · 38 AI chips · 15 countries" and the bar's "487 entries".

New text:
- every definition, other name, reason and chapter line;
- the guide words and letters;
- the kinds' pills;
- each entry's foot line ("Where it appears, N places", "Card and N places", "Card", "Only in this entry.").

**The static page (`/glossary/`).**
- 118 lost lines differ only by a space. The old page ran "Read it in Who Controls the ChainAlso in Memory and HBM" together, and the new page puts a space before "Also in". The census's lost words ("chainalso", "lithographyalso" and so on) are these tokens.
- One line is truly different: TSV's "Also in Deposition and Etch, Advanced Packaging" now reads "Also in Deposition and Etch". This branch's chapter 11 does not yet have main's newer sentence on through-silicon vias (main 737b96d). The page will list Advanced Packaging again once main is merged.
- New text: "term" or "export control" beside each headword, and the guide words under each letter.

## Known issues and notes for the merge

- **Files touched outside the Glossary's own modules:**
  - `build/build.js`: three lines after `LOOKUP_LIST` (the head's counts).
  - `qa/redesign/sweep.js`: an added `--set glossary` line.
  - `build/assets/reference-page.css`: only the Glossary block. The old `.jump.letters` rules went, since only this page used them.

  `src/app.js` and `src/styles.css` are unchanged. The old `.glossary` and `.gl-entry` rules in `styles.css` now style only the hidden data.
- **Countries differ between the two pages**, as before: the app lists 15 and the static page 12. This is not new.
- **The Back to top pill** floats over the columns' lower right corner on a wide screen, as it does over every long page.
- **Page dates:** `/` and `/glossary/` have new content hashes, but both already read 25 October, so no day moved.
- **The static page** has no script, so its thumb index does not mark the letter in view. It is plain links.

## Shot list

In `qa/redesign/shots/glossary/` (not committed; remake with `node qa/redesign/shots-glossary.js`), from 127.0.0.1:8769, with the faces loaded and 1.5 s after any scroll or press.

At 1440 and 390:
- `glossary`;
- `glossary-search` ("hbm");
- `glossary-nomatch`;
- `glossary-didyoumean`;
- `glossary-term` (EUV);
- `glossary-firm` (ASML);
- `glossary-chip` (Nvidia B200);
- `glossary-country` and `glossary-country-firms` (the Netherlands);
- `glossary-letter-s`;
- `page-glossary`;
- `page-glossary-columns`.

At one width only:
- `glossary-1440-dark` and `glossary-term-1440-dark`;
- `glossary-term-390-dark`;
- `glossary-term-768` (the overlay) and `glossary-term-1024` (beside);
- `glossary-1024`, `glossary-768` and `glossary-320`;
- `page-glossary-390-dark`.
