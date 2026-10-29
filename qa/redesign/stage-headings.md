# Chapter headings: right levels and chapter-specific words (29 October 2026)

Branch `redesign-headings`, cut from `redesign` at 25d8080. It builds SEO fixes 3 and 5 from `MAIN/qa/seo/HEADINGS-BRIEF.md`. No PDF in `dist/pdf/` was reprinted or committed. The proof prints went to a scratch folder.

## What changed

### Fix 3: heading levels

A chapter page's outline is now:

- `h1`: the title;
- `h2`: In plain terms, In short, each section of the text and the flashcards' title;
- `h3`: each subsection, and the flashcards' "Four things to remember";
- `h4`: a `####` heading, if a chapter ever has one. None does today.

In `build/build.js`:

- `markdown()` takes the level of a `##` section from its context. The chapter loop passes 2. Any other Markdown keeps 3, which leaves the AI Chips notes alone.
- The In plain terms and In short boxes are `h2`.
- `deckHTML` takes a level. A chapter's deck passes 2, so its title is `h2` and its things to remember `h3`. The home page's deck keeps `h3` and `h4`.
- `splitTakeaways` and `withCard` look for `h2`.
- The search index reads `h2` and `h3` sections. A snippet now stops at `h1` to `h3`, which is the same set of headings it stopped at before.

The book (`/book/`) holds the same articles, so its outline is: the cover's `h1`, The Chain's `h1`, Contents `h2`, then each chapter's `h1` title over its `h2` sections. The cover and contents keep their levels.

### Fix 5: chapter-specific heading words

- **The data.** `data/section-headings.json` maps a chapter id and a heading, as `content/*.md` writes it, to the words shown. It holds the brief's four placeholders for testing:
  - Lithography: How it works, Who makes it and The chokepoint;
  - Memory and HBM: Who makes it.
- **What takes the new words:** the visible heading in the chapter page and the book (and so in the PDFs), and the search index.
- **What keeps the short heading:**
  - the heading's `id` and `data-k`;
  - the rail's On this page;
  - the phone's sheet and slim bar, which copy the rail;
  - the flashcards' "Reread" links;
  - the PDFs' right running head (see below).
- **Validation.** The build warns on:
  - an unknown chapter id;
  - a heading key the chapter does not have (Takeaways counts as not a heading, since it becomes In short);
  - an entry with no words;
  - an entry with markup or a line break.

  I tested each by breaking the file, then put it back.
- **The running head.** The PDFs' running head now reads each section's `data-k`, so a longer heading never lengthens the head.
  - `src/modules/print.js runningHeads()` writes `data-cp-run` on every source of the head.
  - `print.css` reads it with `string-set: section attr(data-cp-run)`.

  Paged.js keeps one function per string name, so every source carries the attribute. The card label, the source list's heading and the deck's labels carry their own text, as before. If the owner wants the running head to show the new words instead, `runningHeads()` would give the heading's text rather than its `data-k`.
- **Updated days.** Lithography's and Memory's text changed, so their "Updated" day, `dateModified`, `citation_date` and sitemap `lastmod` moved from 28 to 29 October 2026 (`build/page-dates.json`). This is the site's own rule. It is the only visible change besides the four headings, and it will move again when the approved words land.
- **The runbook.** `docs/RUNBOOK.md` names the file in its table of what to edit.

## Every selector moved

| File | Before | After |
|---|---|---|
| `src/styles.css` | `.prose h3, .prose h4` (display type) | `.chapter .prose h2, .chapter .prose h3` |
| | `.prose h3`, `.prose h4`, `.prose h5` | `.chapter .prose h2`, `.chapter .prose h3`, `.chapter .prose h4` |
| | `.prose .takeaways h3` | `.chapter .prose .takeaways h2` |
| | `h3:hover .permalink, h4:hover .permalink` | `.chapter h2:hover .permalink, .chapter h3:hover .permalink` |
| | `.inshort h3`; `.inshort h3.label, .prose .inshort h3` | `.chapter .inshort h2`; `.chapter .inshort h2.label, .chapter .prose .inshort h2` |
| | `.review .rv-keep h4.label` | kept, plus `.chapter .review .rv-keep h3.label` (the home page's deck keeps `h4`) |
| `src/modules/chapter.css` | `.chapter .plain h3.label`, `.chapter .inshort h3.label` | `h2.label` |
| | `.chapter > .prose > h3` and its `::before`, and the 900 px rule | `.chapter > .prose > h2` |
| | `.chapter > .prose > h4` | `.chapter > .prose > h3` |
| `src/modules/print.css` | `.chapter .plain h3.label`, `.chapter .inshort h3.label` | `h2.label` |
| | `.chapter > .prose > h3, > h4, > h5` (measure) | `> h2, > h3, > h4` |
| | `.chapter > .prose > h3` and `::before`, `> h4`, `> h5` | `> h2` and `::before`, `> h3`, `> h4` |
| | `.review .rv-keep h4.label, .review .cp-quiz h4.label` | kept, plus `.chapter .review .rv-keep h3.label, .chapter .review .cp-quiz h3.label` |
| | `.cp-sources .cp-sources-h` | `.chapter .cp-sources .cp-sources-h`, so it outweighs `.chapter .prose h2` as it outweighed `.prose h3` |
| | running head: `.prose > h3, …, .review .cp-quiz h4.label, .review .rv-keep h4.label { string-set: section content(text) }` | `.prose > h2, …, h3.label, h3.label { string-set: section attr(data-cp-run) }` |
| `src/app.js` | permalinks: `.prose h3[id], .prose h4[id]` | `.chapter .prose h2[id], .chapter .prose h3[id]` |
| `src/modules/print.js` | section numbers: `:scope > h3` | `:scope > h2` |
| | the source list's heading: `h3` | `h2` |
| | the questions' heading: `h4` | the level of the things to remember beside it (`h3` in a chapter) |
| | `finish()`'s first block on a page: `… h3` | `… h2` |
| | — | `runningHeads()` (new) |
| `build/build.js` | search index `h3`/`h4`, snippet stop `h[1-4]` | `h2`/`h3`, `h[1-3]` |

Checked and left alone, since they are level-blind or already cover both levels:

- the rail's section marking, the phone's slim bar and sheet (they read the rail's links);
- `Keys.land` (`h1` to `h6`);
- `print.js`'s block lists (`h2` to `h5`);
- `styles.css`'s `h1, h2, h3, h4` margin rule and its `h2[id]` to `h5[id]` scroll margin;
- `print.css`'s `h1` to `h5` `break-after`;
- `check-speak` (`h1` to `h4`);
- the Glossary's passages (paragraphs and list items only).

The `.ch-page` rules in `chapter.css` belong to the retired readable pages and match nothing, so I left them.

The one reach of `.chapter .prose h2` I did not foresee was the source list's heading, which `print.js` makes only at print time. As an `h2` it took the screen's section type and moved the list's page breaks in the first test print. The `print.css` row above fixes it (commit 3551bcc).

## Proof

All before shots and prints are from 8766 and all after ones from 8785.

- **Scripts:** `qa/redesign/headings-proof.js` (`dom`, `print`, `shots`) and `qa/redesign/headings-pair.py`.
- **Results:** `headings-dom.txt`, `headings-print.txt`, `headings-shots.txt` and `headings-pdf.txt`, all in `qa/redesign/`.
- **Shots:** in the scratch folder, not committed.

### 1. Nothing visible changes except the test headings

**First, the levels alone** (commit 947e51d, before the data file existed). The three chapters were shot at 1440 light, 1440 dark and 390 light, at the top, at "Who makes it" and at the flashcards. **All 27 pairs were pixel-identical.**

**Then, with the four test headings**, in the same 27 frames:

| Chapter | 1440 light | 1440 dark | 390 light |
|---|---|---|---|
| Lithography | top: the "Updated" day only (0.004%). Mid: the heading only (0.163%). Flashcards: same | the same as light | top: the "Updated" day (0.012%). Mid: the headings, then reflow (5.07%). Flashcards: a half-pixel shift from the reflow above (1.13%) |
| Memory and HBM | top: the "Updated" day (0.004%). Mid: the heading (0.078%). Flashcards: same | the same as light | top: the "Updated" day (0.012%). Mid: the heading (0.181%). Flashcards: same |
| Systems and Networking | same, same, same | same, same, same | same; mid: see below; same |

- **Where the headings wrap.** At 1440 all four headings fit on one line. At 390, "How EUV lithography works" and "Why EUV machines are a chokepoint" take two lines, 31 px more each, so the text under them moves down.
- **The phone strip.** One frame in each full run differed in the phone's specimen strip, the 52 px still outside the article: Systems "mid" at 390 in the final run.
  - That run's flagged copy is on the **before** side, the untouched site. It matches none of the other five strips of that chapter, which all match each other.
  - Earlier runs flagged a different frame each time, on the after side.
  - Re-shot four times on each side, the strip was identical every time.

  This is a flake of the reference, not this change.

### 2. Print is unchanged

- **Laid out for paper.** Every chapter page was laid out for paper on both sides, as `pdf.py` does before Paged.js (`CP_PRINT.prepare`, print media). In all 16 chapters, every element of the article, plus the source list and questions `print.js` adds, has the same computed style and box. The running head's sources give the same words, Lithography's included.
- **Systems and Networking PDF:** 11 pages before and after, every page image identical, the text identical.
- **Lithography PDF:** 14 pages before and after. The text differs in the three headings only. The page images differ only inside those headings' boxes, on pages 3, 7 and 10. The running heads are unchanged.
- **The book (`/book/`):** 187 pages before and after.
  - The text differs in the four headings only.
  - 183 of the 187 page images are identical. Pages 38, 42, 45 and 103 differ only inside the renamed heading.
  - Spot check, page 42 side by side: "Who makes it" became "Who makes EUV machines". The running head still reads "Who makes it". Nothing else moved.
  - The after book's text also matches the committed `dist/pdf/how-ai-chips-are-made.pdf`, but for the same four headings.
- All prints used `build/pdf.py` on port 9365 with `--edition 2026-10-28`. The numbers are in `headings-pdf.txt`.

### 3. Every chapter page's outline

For all 16 chapters at 1440 and 390, against 8766:

- **Outline:** one `h1`, then `h2` sections, no level skipped. For example, Lithography reads `h1 h2 h2 h2 h2 h3 h3 h3 h2 h2 h2 h2 h3`.
- **Ids:** every `id` in each article is the same, in the same order, before and after (46 to 92 per chapter).
- **Style:** every element has the same computed style on screen and in the print media. Every box is in the same place and size, except below a renamed heading.
- **Rail and sheet:** the rail's On this page and the phone's sheet are the same.
- **Renamed headings:** each shows its new words, with its old `id`, `data-k` and rail entry.
- **Old links:** `/lithography/#lithography--who-makes-it`, `/#lithography--who-makes-it` and the same two for Memory, plus two more, land on their section 80 px from the top, under the 64 px masthead, as before.
- **Search:** the index has 901 entries, as before. Only the four titles changed, to the visible words, and their addresses did not.

The section permalink still appears on hover over a section (`h2`) and a subsection (`h3`).

### 4. Checks

| Check | Result |
|---|---|
| `node build/build.js` | no warnings |
| `check-speak.js` | no matches |
| `check-integrity.js` | no problems |
| `check-sources.js` | 2,847 citations, all tier A or B |
| `check-size.js` | none over 5 MB |
| `check-seo.js` (new heading rule) | 16 chapter pages, 22 sitemap entries, no problems. One note, as before: /supply-chain/'s title is 46 characters |
| `check-links.js --local http://127.0.0.1:8785` | 28 pages, 1,224 addresses, no broken links |
| `smoke.js --port 8793` | 47 page loads, no failures |
| `check-perchapter.js` | all 336 checks pass |
| `interact-chapter.js` | 90 of 90 pass; see below |
| `stage-chapters.js --base` | 10 of 10 pass |
| `check-cites.js` | 3,320 marks, 0 problems |
| `check-figs.js` | 112 of 112 pass |
| `interact-glossary.js` | all 90 pass |
| `interact-suppliers.js` | 65 checks, 0 failed |
| `interact-masthead.js` | all 15 pass |
| `headings-proof.js dom`, `print`; `headings-pair.py` | all held; all 27 pairs as described above |

The browser checks ran against 8785, and their output is in `qa/redesign/*-headings.txt`.

`interact-chapter.js` failed one check on its first run, while the other checks ran beside it: "390: the strip's wine rule fills with the share of the chapter read" (0.092 -> 0.092). The code behind it (`src/app.js`, `--read`) does not read headings. Run again on its own, all 90 checks passed (0.092 -> 0.243).

Checks updated where they asserted the old level:

- `qa/scripts/check-seo.js`:
  - It no longer maps `h1` to 2 or forbids `h2`.
  - It now requires every section heading (a heading with `data-k`) to be an `h2`, the first heading under the title to be an `h2`, and no skipped level.
  - Tested on a page with the old `h3` sections (6 failures: each of its four sections, In plain terms an `h3` under the `h1`, and the first heading not an `h2`) and on one with an `h4` under an `h2` (1 failure).
- `qa/redesign/check-perchapter.js`: the old-link test picks each chapter's third section by `> .prose > h2[id]` (it was `h3`).
- `qa/redesign/stage-chapters.js`: tests 2 and 4 pick a section by `> .prose > h2[id]` (they were `h3`).
