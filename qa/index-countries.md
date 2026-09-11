# Index: country entries

11 September 2026. The Index (`#/glossary`) now has a fourth kind of entry, the country. A reader who types "Japan", "dutch", "prc", "us" or "uk" gets a card that answers "Is this country relevant, and where?"

## What was added

- Fifteen countries: Austria, Canada, China, France, Germany, Israel, Japan, Malaysia, Netherlands, Singapore, South Korea, Switzerland, Taiwan, United Kingdom, United States. Each is an `<li id="lk-country-<code>" data-kind="country" data-key="<ISO code>">` in the list, labelled "Country", sorted into the same alphabetical run as the terms, firms and chips. The count line reads "362 entries · 92 terms · 220 firms · 35 chips · 15 countries" and is computed from the list, so it follows the data.
- Aliases (`data-alias`) carry the ISO code and the adjective and nickname forms: US, USA, American; CN, PRC, Chinese; TW, Taiwanese; KR, ROK, Korea, Korean, South Korean; JP, Japanese; NL, Dutch, Holland; DE, German; GB, UK, Britain, British; and the code plus adjective for the rest. The search matches on any of them, and an exact name or alias match ("us", "uk", "tsmc") now tops the list ahead of names that merely contain the letters; an alias that starts with the query ("dutch", "prc", "foxconn") counts as a name hit and rises above the rest. Both rules apply to every kind of entry.
- The country card (`countryCard` in `src/modules/lookup.js`) shows, in order: the ISO code and name; a meta line ("leads 4 stages, 2 of them extreme · named on 15 of 17 chokepoint cards · 43 firms in the supplier list, 11 Critical"); the home page's one-line role; "Share of each segment", every row of the country-share matrix that carries the country, largest first, with the rank, the basis in the home page's words (measured, estimate, computed, reported by X) and the year, rows under one percent folded into one line; "On the chokepoint cards", every chapter card that names the country, hardest band first, with the card's own note for that country and a link to the chapter; "In the supplier list", the firm count and the categories with counts, the Critical firms named as buttons that open that firm's entry; and two links, "See its leverage on the home page →" (`#/home?country=JP`) and "Its firms in the supplier list →" (opens the Suppliers page with the country filter set).
- Mentions ("Where it appears") work for countries as for firms: the name and every alias go into the same boundary-safe regex, so "Japan" finds "Japan" and "Japanese" in the chapters, the board, the AI chips and the supplier list. Short capitalised aliases (US, UK, PRC) stay case-sensitive, as short firm aliases already did.
- The "Try" buttons on the empty Index draw six now: two terms, two firms that matter, one chip, one country.
- Home page deep link: `#/home?country=<code>` opens the home page and its leverage panel on that country. It is handled by a `home` view module registered in `src/modules/summary-a.js` (`fromHash`), which selects the country through the existing `selectCountry` and scrolls the leverage section into view once the router has finished. `CP.SummaryA.selectCountry` is exposed for other callers. The router itself was not touched; `#/home` already resolves to the home view.
- Index copy: dek "Every term, firm, chip and country, with the passages that use them."; placeholder "A term, a firm, a chip, a country…"; matching aria-label.

## How the country data is derived

Nothing on the card is typed by hand. In `build/build.js` (the LOOKUP_LIST block only):

- A country is included when it has three or more firms in `data/suppliers.json`, or a column in any row of `data/chokepoint-matrix.json` (two-letter codes only, so `EU-other` and `Other` do not become entries), or a line in the home page's `ROLE` table. That rule gives the fifteen above. India and Thailand have home panels but no role line, one firm or none and no matrix column, so they are left out.
- The role line is the home page's own: `build/modules/summary-a.js` now exports its `ROLE` table (`module.exports.ROLE = ROLE`, one added line) and the block reads it. If that export ever goes missing the build warns ("the home page does not export its ROLE table") and the cards simply carry no role line.
- Whether the home page has a panel for the country (and so whether the "See its leverage" link is shown) is read from the built page: the block looks for `class="sa-panel" data-cc="<code>"` in the HTML the home module filled.
- The block writes `data.countries` (code, name, role, panel, aliases) into the DATA blob; the card reads the rest at selection time from `DATA.chapters` (`countries[]` with code and note, `band`, `bandRank`, `number`), `DATA.matrix` (`shares`, `basis`, `relayedVia`, `asOf`/`year`, `method` as a title) and `DATA.suppliers` (`country`, `category`, `chokepoint`).
- "Leads N stages" uses the home page's rule: the first country named on a stage card (chapters 1 to 15) leads it. "Named on N of 17" counts every chapter card, the essay included, as the home page does.

## The European Union

The data does not use the EU as an actor: the matrix has an `EU-other` column (Other Europe, as the site names it), the timeline's actors are national ministries and BIS, and no supplier is coded EU. So there is no EU entry. If a row ever carries an `EU` column the build's rule would need a two-letter exception; the alias map already has room for it.

## Checked

- `node build/build.js`: no lookup warnings. `node qa/scripts/check-integrity.js`: no problems from this change (the "exposure row ... has no supplier entry" lines predate it and come from `data/exposure.json` naming firms the supplier list does not carry).
- Browser (localhost:8841): "Japan" opens the Japan card and 69 mentions; "dutch" opens the Netherlands (27 mentions, "Netherlands" and "Dutch" both marked); "prc" opens China (196 mentions); "us" opens the United States ahead of Advanced Energy Industries and Austria; "uk" opens the United Kingdom. Clicking "Hoya" on the Japan card opens Hoya's entry and clears the search. "Its firms in the supplier list" lands on Suppliers with the country select on KR. `#/home?country=JP` and `#/home?country=NL` open the right panel; headless Chrome shows the page scrolled to the leverage section. No console errors. Phone layout checked at 390 px.

## Unresolved

- "Korea" is an alias so that the search finds it; in the mentions it also marks the one board entry that says "North Korea". Harmless, but a regex negative lookbehind would remove it.
- The Index's own scroll on phones (`select()` scrolls `#lk-entry` to the top) puts the card's heading under the sticky masthead. That is the existing behaviour for every kind of entry, not something the country card introduced; a `scroll-margin-top` on `#lk-entry` would fix it for all of them.
- `qa/scripts/check-integrity.js` lists the routes it accepts and does not include `/home`; the country card's link is rendered at runtime so the check never sees it, but if `#/home?country=` ever lands in static markup, add `/home` to that set.
- The supplier categories on the card are the supplier list's twenty categories, not the seventeen chapters; the heading says "categories" for that reason.
