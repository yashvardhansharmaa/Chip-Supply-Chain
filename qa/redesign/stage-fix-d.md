# Section D and E1 to E5: interface and behavior (fix-d, 28 October 2026)

Branch `redesign-fixd`, worktree `chokepoints-rd-fixd`, cut from `redesign` at fceef96. Preview http://127.0.0.1:8784/. Not merged, not pushed.

Shots are in `qa/redesign/shots/fix-d/` (172 files, in the worktree only: `qa/redesign/shots` is ignored by git), named `<finding>-<page>-<width>[-dark]-before|after.png`. The before shots are from 8766, which had already merged fix-b and fix-c when they were taken, so a before shot can differ from an after shot in places this section did not touch (the summary's money units, the timeline's dates, AI Chips' footnote marks). Check outputs are in `qa/redesign/fixd/`.

No source was added and nothing was fetched from the web. The only network use was the preview's Google Fonts, as every shot and print uses them.

## Each finding

**D1 (blocker), the Paused chip.** Moved out of the frame to the end of the step row (`.anim-bar`, build.js and styles.css), aligned on the steps' baseline. It holds its place while hidden, so the row never jumps. On a phone the fifth step wraps to a second line beside it. Shots `d1-litho-*` at 390, 1024 and 1440, light and dark: "Each patch at most 26 by 33 mm" is whole.

**D2, the reduced-motion poster.** The poster stays the end frame (the whole picture), and under reduced motion the last step is now the one marked and captioned (app.js Anim). Play starts from step 1 as before. Shots `d1-litho-*-after`.

**D3, a supplier search result.** `Suppliers.show` now opens a firm when the filter names one (search results and the Glossary's firm cards), scrolls its segment to the top under the masthead and puts focus on the firm's name. On the way I found that on tablets and phones an opened firm went into an implicit third grid column over the segment's name, because the wide layout's `grid-column: 3` came after the narrow rules (suppliers.css). Fixed. Shots `d3-search-asml-*`.

**D4, Back to top on phones.** Below 900 px it shows only while the reader scrolls back up past most of a screen, and hides on the next move down or after 3 s at rest. Wide screens unchanged. Shots `d4-*`.

**D5, single marks.** Home's stage blocks, the `/summary/` stage cards and the Suppliers strip (and the Suppliers country panel's card lines) draw the four-bar meter. `/supply-chain/` keeps its single marks. Shots `d5-*`.

**D6, the summary page.**
- The glance table says "Moderately hard", as the key and cards do. On a phone each row reads stage, then "Extreme  Hard to substitute", then who leads.
- The key sits above the table at every width.
- The stage cards mark glossary terms and open their definitions (an inline script reading `assets/terms.js`, a sheet on a phone).
- `og:site_name`, `og:image` (with size and alt), `twitter:card` and `twitter:image` are added, with `cards/summary.png` made by `build/cards.py --only summary --port 9364` (the manifest lists `summary` as an own page, so social.js writes no page for it).
- Shots `d6-*`.

**D7, `/supply-chain/` on a phone.** The key sentence sits under the title and downloads, before the rows. Shots `d7-*`.

**D8, the Suppliers country panel.** One list now drives a country's count, its cards and the stops it lights: the card's first-named country. For that, two route stops moved to their leading country, both towns taken from `data/suppliers.json`:
- Test and Assembly moved from Penang to Kaohsiung (ASE).
- Systems and Networking moved from Taipei to Santa Clara (Nvidia).
- Each panel lists every stage its country leads, so Japan shows Substrates again.
- Japan's role line reads "Wafers, photoresist, masks and the substrates that chips are packaged on".
- The subtitle reads "each pinned at a main site in the country that leads it".
- The build warns when a stop leaves its leading country.
- Shots `d8-route-*`: Taiwan lights 8, 10 and 12, and the United States lights five.

**D9, share rows with no source.** Every share row prints its basis and year inside the row, for example "CSET · 2019", "SIA and BCG · 2022", "SIA, via CSET · 2022" (ATP, whose method says it was taken from SIA), "reported by Fuji Keizai · 2023" or "Estimate · 2025". Short names come from the bibliography's publisher. The year no longer sits under the share. Shots `d9-*`.

**D10, citations.** On a chapter's page the footer's How to cite gives the chapter's citation, in the same form as Cite this chapter and the PDF, with the chapter's Updated day and "(accessed 28 October 2026)". Its BibTeX has the chapter title and `howpublished`. Other pages cite the site with day-first dates. Shots `d10-*`.

**D11, figure exports.**
- Cite names a figure by its title's first sentence and ends "Data: <source>, <date>." The date is left off where the label already names a month or lists several sources.
- The CSV keeps the table first, with a year column headed "Year". Under it come Figure, Title, Source, Source date, Source address, Note and Figure address.
- The PNG's source line drops the footnote number and gives the source and date.
- Shots `d11-*`, and `d11-fig-04-4-png-after.png` is a PNG from the button.

**D12, home's Source links.** They open the footnote card on hover or focus, and on a touch screen a tap opens the card (no jump to the outside site). The target is 32 px tall. Shots `d12-*`.

**D13, the double period.** It is added only when the stage's test lacks one. Shots `d13-*`.

**D14, phone strip thumbnails.** The collapsed strip shows the specimen's line still (`media/line-<chapter>.webp`, inverted in dark). The live drawing returns when the strip opens. `terms.js` carries `specimenChapter`. Shots `d14-*`.

**D15, type off the steps.** Every size maps to a token:
- Titles use `--t-title`, which is 58.5 px at 390.
- Standfirsts use `--t-lead`, or `--t-text` on a phone.
- Entry titles, the finding and item names use `--t-lead` or `--t-text`.
- One-liners, captions and the summary's 15 px lines use `--t-small`.

Shots `d15-*`.

**D16, numbering.**
- A stage reads "Stage 4 of 14" in the kicker, on home and on the door ("Previous · Stage 3 of 14", "Next · Stage 5 of 14", "Continue reading"). The two chapters across the chain keep "Chapter 15" and "Chapter 16".
- The card head names the stage without its number.
- The Glossary's head tally is gone. Each kind's count is on its button, and the count line shows only for a search (it is still read out).
- "Card 1 of 4" is for screen readers only, since the squares show the place. It is clipped in place: an off-left `.sr-only` on the turned back of a card widened every phone chapter page by 10,000 px, which I found and fixed before committing it.
- Shots `d16-*`.

**D17, report only. Nothing changed.** I found the three styles the finding names:
- Chapters: `.ch-spec-cap p` is Source Serif 4 at `--t-note` (13.5 px), left aligned, in the text column beside the numbered parts.
- Home: the stage's caption is Hanken Grotesk (`--font-caption`), centered under the drawing, as the owner set it.
- Phone strip: the figcaption is Hanken Grotesk at 11.5 px, left aligned, under the opened drawing. It now follows the parts list (D18).

A single style is not clearly better. The chapter caption reads as part of the chapter's text and sits beside serif notes, so serif suits it. The home and strip captions belong to the drawing, which is a piece of interface. If one change were made, I would raise the strip's 11.5 px to the note step (13.5 px).

**D18, phone details.**
- Tables set their text in the note step on a phone, keep a short hyphenated name whole ("CoWoS-S"), keep the gap after numeric columns, and show a soft edge shadow while more of the table lies past an edge. Chapter 10's table fits ("Blackwell" whole), and chapter 16's scrolls with a visible edge.
- The phone Contents sheet marks the chapter being read in wine, lists its sections under it and opens scrolled to it.
- The opened strip lists the drawing's numbered parts before its caption.
- Tap targets grow without changing their look: footnote numbers and Look it up to 32 by 36 px on touch screens, the strip's pause to 44 px, and the summary's "Read the chapter" to 33 px.
- Every page's phone masthead is 76 px. The static pages' tabs take the app's 1.62 line-height.
- `/summary/` has Back to top, which behaves as the app's does.
- Shots `d18-*`.

**D19, Sources.**
- An address that names a chapter's Sources, or a source in it, opens the folded list.
- Each source has an id, `<chapter>--source-<n>`, where n is its footnote number, and a named source is lit.
- The list opens with a key led by "Source tiers".
- Not changed: the footer's own key ("A company filings…"). FIX-BRIEF lists the footer (`credits`, `footerKey`) under "Do not change". The new key at the head of each Sources list explains the marks where they are used.
- Shots `d19-*`.

**D20, PDFs.**
- Done in source: the print lede reads "This edition covers…" (src/template.html), the PDFs written by pdf.py and summary_pdf.py get Author "Yashvardhan Sharma" (pypdf, after Chrome writes them), and both PDF links name their file in `download`.
- The summary's print layout draws the meter (lit bars in ink).
- Test prints on port 9364 went to my scratchpad, not dist: the summary ran 4 pages with the new faces, meters and Author (page 1 is in `d20-summary-pdf-p1-testprint.png`), and chapter 14 ran 11 pages with Author.
- **Not done: the full reprint.** FIX-BRIEF allows pdf.py only to test print, and the reprint should wait until A to D are merged, so every section's fixes are in the PDFs. `transistors-and-front-end.pdf` stays.

**D21, small.**
- Search names the home page's results "Home".
- "16 paragraphs" is cut from home's meta line.
- Home's title takes one line from 901 to 1199 px.
- Left as the finding says: the explainers' dark coral (it is in the videos) and Fragment Mono on `/supply-chain/` and `/chips/`.
- Shots `d21-*`.

**E1, AI Chips on Back.** Back and Forward within AI Chips keep the chosen measure. An earlier history entry that names none takes the measure chosen since, and its address is rewritten with it. Checked in a browser (four chips, Memory, Back twice, Forward: Memory throughout). Shots `e1-*`.

**E2, the two country counts.** Suppliers says "18 home countries", where its firms are based. The Glossary's 15 is now only on its Countries button, as a count of entries. Shots `e2-*`.

**E3, footer dates.** Each view with a page of its own gives its footer that page's Updated day: AI Chips from /chips/, then Suppliers, Export Controls and the Glossary from their own pages. #/controls and /export-controls/ both say 21 October 2026. Home and the rest keep the home page's day. Shots `e3-*`.

**E4, SEO.**
- Home carries one h1. The other views' titles are level-one headings in a paragraph (`.vt`, role="heading" aria-level="1"), styled as before, and `Keys.land` finds them.
- `/summary/`'s print title is a paragraph.
- `/summary/` has an Article JSON-LD block with its dates, card and author.
- `/intro/` is titled "Start here" with the home page as its canonical, since #/intro is home.
- There is a plain `dist/404.html` with the masthead and links home and to the chapters, in both themes.
- Shots `e4-*`.

**E5, figures 08.2 and 16.1.** Both are timelines. They now take a PNG: the dates in the code face beside each event, on hairlines, with the source and address (`e5-*.png`, made from the button). They take no Table, because a timeline already is its rows, each date beside its event. A figure PNG's file name now keeps a chapter id of several words whole.

## Checks (against 8784, outputs in qa/redesign/fixd/)

All pass.

| Check | Result |
|---|---|
| `node build/build.js` | exit 0, no warnings |
| check-speak | no matches |
| check-integrity | no problems (18 pages, 1,807 ids, 16 chapters) |
| check-sources | 2,817 citations, all tier A or B |
| check-size | none over 5.0 MB |
| check-seo | 16 chapter pages, 23 sitemap entries, no problems |
| check-links --local 8784 | 28 pages, 1,167 addresses, no broken links |
| smoke --port 8794 | 47 page loads, no failures |
| check-perchapter | all 336 checks pass |
| interact-chapter | all passed |
| stage-chapters --base 8784 | 10 of 10 pass |
| check-cites | 3,300 marks, 0 problems |
| check-figs 8784 | 112 of 112 pass |
| interact-glossary | all 90 checks pass |
| interact-suppliers | 65 checks, 0 failed |
| interact-masthead | all passed |

Checks updated, where they asserted what a fix rightly changed:
- `interact-chapter.js`: the kicker reads "Stage 4 of 14" (D16).
- `interact-glossary.js`: the head tally is gone and each kind is counted on its button, and the count line is read out but not shown without a search (D16).
- `stage-chapters.js`: on a phone the reader scrolls up a little before pressing Back to top, which now shows only while heading up (D4).
- `check-cites.js`: a source's `<li>` may carry attributes, since each source now has an id (D19).
- `check-figs.js`: the CSV's data rows end at the first blank row, since the figure's description follows (D11).
- `check-merge89.js`: the door label and button (D16). This check is not in the required list.

The first run failed stage-chapters 9, check-cites (3,300 mismatches) and check-figs (14 CSV rows), all for those three reasons. Each passed on a re-run once its check was updated. No site code changed between the runs.

## Shared lines touched, for the merge
- `build/build.js`: figure cite, CSV and PNG (FIG_JS), the kicker, door and card head, the deck counter, the Sources key, table cells (`keepNames`), the per-view footer days, terms.js `specimenChapter`, the search kind "Home", the Suppliers counts, the Glossary tally (removed).
- `src/app.js`: Anim, Suppliers.show and reveal, Back to top, the footer cite, Cite (home's Source links), Tip, Landscape readAddress, Keys.title, Band's sheet, the Sources opener and Stage.show's thumbnail.
- `build/modules/social.js`: the summary entry in the manifest, `cardURLFor`, `/intro/`'s head and `404.html`.
- `build/modules/summary-a.js`, `summary-brief.js` and `walk.js`.
- `src/template.html`: the view titles, the strip's thumb, the glossary head, the print lede and the download names.
- `build/assets/masthead.css`, `build/pdf.py`, `build/summary_pdf.py` and `build/cards.py`.
- New files: `build/assets/cards/summary.png` and `dist/404.html`.
