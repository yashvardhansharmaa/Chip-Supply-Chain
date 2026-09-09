# Tier 1: chapter head, links, popovers, search, bibliography

9 September 2026. Answers items 2, 3, 5, 6 and 7 of the reader critique, and items 3, 5 and 14 of the
information-architecture critique. Files touched: `build/build.js`, `src/app.js`, `src/styles.css`,
`content/*.md`. Nothing under `build/modules/`, `src/modules/` or `data/` was changed except the one
citation added to chapter 18.

## 1. Chapter head reordered

`chapterHTML` now runs: chain strip, chapter tile with title, lede and meta, **In plain terms**,
**In short**, the chokepoint card. The plain-language paragraph was fourth; it is now first. The
geopolitics essay was assembled separately and got the same order.

No text changed. `.plain` gained `margin-top: 30px` so it opens the head with the same gap "In short"
used to have. Measured on the built page at 1280px: 30 / 34 / 36 px between the four blocks.

## 2. Cross-references are links

Thirteen "see X" phrases in `content/*.md` now link to the chapter they name. Only the chapter name
was wrapped; no other word moved.

| File | Phrase | Target |
|---|---|---|
| 03 silicon-and-wafers | (see Lithography) | `#lithography` |
| 04 chemicals-gases-and-photoresist | (see Lithography) | `#lithography` |
| 05 lithography | (see Photomasks and pellicles) | `#photomasks-and-pellicles` |
| 09 transistors-and-front-end | See Memory and HBM. | `#memory-and-hbm` |
| 09 transistors-and-front-end | See Lithography and Geopolitics. | `#lithography`, `#/geopolitics` |
| 10 foundries-and-fabs | See Advanced packaging. | `#advanced-packaging` |
| 10 foundries-and-fabs | See Geopolitics. | `#/geopolitics` |
| 12 advanced-packaging | see Test and assembly. (x2) | `#test-and-assembly` |
| 12 advanced-packaging | see Substrates and PCBs. | `#substrates-and-pcbs` |
| 14 test-and-assembly | See Memory and HBM. | `#memory-and-hbm` |
| 15 systems-and-networking | see Substrates and PCBs. | `#substrates-and-pcbs` |
| 17 component-costs | See Advanced packaging for why… | `#advanced-packaging` |

Fourteen anchors in all; every href resolves to an id that exists in the built page.

**Previous / Next.** `prevNext()` in `build.js` renders a pair of links at the foot of every chapter,
after the body and before the source list. The spine is chapters 1 to 17 then the geopolitics essay,
so chapter 17 points on to `#/geopolitics` and the essay points back to `#component-costs`. Chapter 1
has a Next only. Eighteen navs. Two columns on desktop, one on phones.

## 3. Controls linked to their chapters

Every row of `control-thresholds.json` carries a `chapter` field that nothing rendered. The Controls
table now shows it in the instrument cell as a chip linking to that chapter, styled `.chip .chip-ch`:
the site's chip, widened, uppercase, with an accent hover. 40 of 40 rows carry one; no broken links.

## 4. Glossary popovers

`glossaryWrap()` in `build.js` walks each chapter's prose and wraps the first use of every glossary
term, and of the `aka` alternates, in `<button type="button" class="gl-term" data-term="…">`. It
matches whole words, ignores case, and prefers the longest term where two overlap. It skips the
subtrees of `a`, `code`, `sup`, `button`, `svg`, `figure`, `h1`–`h6`, `dt` and `dd`, and it never sees
the card, the head or the front matter, because it runs on the prose body alone. HTML entities are left
whole. Four `aka` values are glosses rather than names ("singular of dice", "for example N2 or 18A",
"part of the US Department of Commerce", and the tail of the FLOPS entry); those are filtered out.

242 terms are marked, 7 to 23 a chapter, none inside a link, heading or card.

`Tip` in `app.js` is one shared panel. It reads the definitions from the glossary entries already in
the page, so no data is duplicated into the payload. It opens on hover, focus or tap; it closes on
Escape, which returns focus to the term, on a tap outside, on the focus moving away, and when the
pointer leaves both term and panel. It sits 10px above the term, clamped inside the viewport, and
follows the term as the page scrolls; below 900px it becomes a sheet across the foot of the screen,
10px above the specimen strip. The term takes a dotted underline that turns solid on hover. The colour
does not change.

## 5. Search ranks instead of filtering

`Tools.search()` replaces the every-term-must-appear filter. Both the query and the index are
normalised so hyphens read as spaces, which makes "export-control" and "export control" the same
search. Stop words are dropped, so a question still finds its subject. Scoring per term: 40 for an
exact title word, 30 for a title-word prefix, 22 elsewhere in the title, 6 in the body; then 300 for a
title that equals the whole query, 90 for one that starts with it, 55 for one that contains it, 45 for
covering every term, 20 for a glossary entry, 10 for a chapter, and up to 15 for a short title. When
nothing matches, the three glossary entries sharing the longest opening run of letters are offered.
Rendering and the Enter and Escape keys are unchanged.

Before and after:

| Query | Before | After |
|---|---|---|
| how a gpu is made | Nothing matches | Glossary: GPU, then Memory and HBM, Substrates and PCBs, Chip Design |
| EUV | Silicon and Wafers' criteria first, Lithography sixth | Glossary: EUV, then High-NA EUV, then Lithography |
| export-control | different results from "export control" | identical to "export control" |
| lithograpy (typo) | Nothing matches | nearest glossary entries: lithography first |

## 6. Bibliography

`data/bibliography.json` covers all 308 cited URLs. `sourceLine()` renders a citation as its title,
linked, with the publisher and date under it in mono 11px (`.src-meta`); a URL with no entry stays a
URL. Applied to the Sources page, to each chapter's own source list and to the geopolitics essay's.
All 344 lines on the Sources page now carry a title and a publisher; none is a bare URL. Inline
citation superscripts carry the title in their `title` attribute, so hovering a footnote number names
the document instead of the host.

## 7. The uncited sentence in chapter 18

The sentence read: "Chinese regulators discouraged customers from buying, importing or using Nvidia's
data-centre products, and endorsed performance-per-watt and bandwidth standards for accelerators in
Chinese data centres."

Nvidia's own 10-Q for the quarter ended 26 July 2026 states both halves. Fetched and read at
`sec.gov`: the filing says China's actions "discouraged customers from purchasing, importing, or using
our data center products", and that "an agency of the Chinese government announced an Action Plan that
endorses new standards regarding the compute performance per watt and per memory bandwidth of
accelerators used in new and renovated data centers in China." That filing is Tier A and was already
cited two clauses later, so the citation was attached and nothing was deleted. Reuters headlines found
through Google News RSS corroborate the first half ("China cautions tech firms over Nvidia H20 AI chip
purchases", 12 August 2025; "China bans foreign AI chips from state-funded data centres", 5 November
2025) but were not needed.

Source tiers after the change: A 322, B 22, disallowed 0, unclassified 0.

## Verification

Built and checked at `http://localhost:8765/`.

- Chapter head order on Lithography: chain, tile, In plain terms, In short, card. Even 30/34/36 gaps.
- `(see Photomasks and pellicles)` resolves to an id that exists; Next reaches `#photomasks-and-pellicles`.
- Popover on "EUV": opens 10px above the term, inside the viewport, centred; Escape closes it and
  returns focus; a tap outside closes it; a tap on the term toggles it. On focus it opens against the
  focused term. At 375px it becomes a sheet 10px above the specimen strip.
- Search: the four queries above.
- Controls: 40 chips, 40 rows, no broken hrefs.
- 375 x 812: `document.scrollWidth` is 375, so the page does not scroll sideways. Everything wider sits
  inside a scroller that already existed (`.tabs`, `.table-wrap`, `.sup-wrap`) or is off-screen
  `.sr-only` text. Previous/Next, the plain box and the marked terms all stop at 357px.
- `node build/build.js` reports one warning, the pre-existing summary-b one. `new Function(app.js)`
  parses.

Screenshots were not possible: the browser pane was hidden, so the page never composited a frame. Every
claim above comes from DOM measurement.
