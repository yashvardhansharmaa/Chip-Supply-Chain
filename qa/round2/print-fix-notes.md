# print-fix notes (round 2, 20 October 2026)

Slug `print-fix`. Renders and contact sheets in `qa/round2/shots/print-fix/` (git-ignored); helper scripts in
`qa/round2/scratch/print-fix/` (sheet.py makes a contact sheet from a PDF).

## Before (dist/pdf as found, 20 October)
Pages: advanced-packaging 16, chemicals 13, component-costs 10, data-centers 13, deposition 12, design 12, foundries 12,
geopolitics 15, lithography 13, memory 11, metrology 17, photomasks 11, silicon 11, substrates 13, systems 10, test 13,
transistors 11 (total 213). Book 180 pages.

## Diagnosis
- Footnote numbers: build.js registered the card's urls first (cardCites) and then the body in Markdown order, so
  In plain terms (the first body paragraph) and In short (the Takeaways section at the end of the body) carried body
  numbers out of order: lithography read 6 13 2 1 8 45 44, then 1 2 3.
- Pagination gaps: (1) print.js removed repeated notes only after Paged.js had laid the page out (finish()), so the
  space reserved for every repeat stayed blank; (2) Paged.js 0.4.3 moves the notes of a whole 1,500-character chunk
  into the note area before it checks for overflow, and when the overflow is cut it removes the notes of the cut calls
  but keeps the area at its full height, so the text ends early; (3) break-inside: avoid on In plain terms, In short,
  the card and figures pushed whole blocks to the next page (lithography p. 1 and 2); (4) each note ran to two or three
  lines (title, publisher, date, tier box and the full URL).
- Animations: styles.css `@media print { .figure--anim { display: none !important } }` hid every animation figure in
  print, so the stills and step lists never printed.

## Progress
- Also found: the print grid (.chapter as a 22mm + 1fr grid) held the whole head as one grid row, which Chrome moves
  whole to the next page when it fits there, so a head shorter than a page left page 1 blank (design, metrology:
  page 1 only the notes, title block on page 2, chapter on page 3). Glossary terms are buttons and never wrapped
  ("for / deep ultraviolet (DUV) lithography"). Bottom margins: Chrome counts a block's bottom margin against the page
  it ends, so a paragraph's last lines or the card after In short went over by a few px.
- (13:00) build.js readingOrderCites(): numbering in reading order; order-check.js (scratch) confirms all 17 chapters
  in order on the main page and the static pages.
- print.js: compact notes (number hung, title clipped near 100 chars, publisher short form, date, page, short URL;
  no tier box); end-of-chapter source list for paper (sourceList, full addresses); noteFlow Paged.js handler
  (per-page dedupe at render time; onOverflow fits the notes to the calls that stay, one call at a time, and returns
  null when the page has room, so Paged.js goes on filling it); glossary buttons become spans; no space before marks;
  notes sorted by number per page; finish() reports fill, short pages, stranded heads, split blocks, overlap, floats
  (figures to move down) and tight (cards to set closer); compact title block (site · chapter, edition, cite as with
  link; the chapter line and URL line repeated the title and the cite).
- pdf.py lay_out(): up to four more layouts with figures moved / cards set closer, kept only if better.
- print.css: 10pt body; float ledger in place of the grid; top margins only; card set closer; .cp-tight; notes and
  source list styles; animation figure prints (styles.css had display:none on .figure--anim in print).
- Tried and dropped: a second tight level (smaller head type) did nothing; moving the card to the head of the next page
  with the end of In short under it overlapped the notes on chemicals (card + notes taller than the page).
- (later) Found and fixed: Paged.js rewrites any "a + b" selector as a weaker attribute rule, so `.inshort p + p` never
  applied (no space between In short paragraphs): print.css now has no "+" selectors (print.js marks .cp-after).
- Found: with the card made breakable (overflow visible), Paged.js skips the children of a break-inside: avoid block
  and left the card's China/US block in the hidden overflow column (chemicals, text lost). The card stays one
  unbreakable block (the screen's overflow: hidden); finish() now reports text left off the page (lost) and pdf.py says
  "TEXT OFF THE PAGE", which chapter_pdfs.py refuses. A card that, set closer, still runs into the notes is laid out
  with .cp-split (breaks only between its parts).
- Notes now name the site only (host); titles cut near 80 characters; most notes fit one line.
- Summary PDF: rendered to qa/round2/shots/print-fix/summary-after.pdf, pixel-identical to dist's (4 pages).
- Found: Paged.js also rewrites ":first/last/nth-of-type" selectors (weaker rules); In short spacing now margin-top on
  every paragraph. Chapter padding-bottom removed (Paged.js copies the chapter box onto each page, padding included,
  which pushed a page's last paragraph out of sight on design p. 4). Cover leading pinned (body 1.45 spilled the
  cover's last line onto p. 2); contents heads and note set closer so all 17 lines share page 2 with How to read.
- QA tools (scratch): order-check.js (numbering on main and static pages), textcheck.py (every paragraph, list item,
  card line and table cell of dist/index.html found in the PDF), gaps.py (longest blank run per page from the
  rendered PDF), sheet.py (contact sheets). Final sheets: qa/round2/shots/print-fix/final/<id>.png, chain.png.

## Follow-up: real text fonts (20 October, after 454b463)
- Cause: Chrome embeds any font file with an fvar table as Type 3. Google Fonts serves one variable file when several
  weights of a family are asked for at once, so even "static" requests came back variable. One request per instance
  (single weight, single optical size) returns fixed instances, which embed as CID TrueType.
- print.js printFonts()/fontsReady(): in print, the page's Google Fonts links give way to one link per instance
  (Fraunces 600@14, 500@48, 400@72, 700@96, 300@144; Source Serif 4 at 12 pt, 400/500/600/700 and italic 400/600;
  Instrument Sans 400-700; IBM Plex Mono; Noto Serif/Sans SC and JP for CJK titles, which otherwise fell back to
  PingFang and Hiragino, also Type 3). pdf.py waits on fontsReady() after prepare(). All OFL; nothing vendored.
- print.css: font tokens with Noto fallbacks; font-variation-settings off; capital labels tracked at 0.05 em (wider
  tracking extracted as "C O N C E N T R A T I O N").
- summary_pdf.py FONTS_JS: the same swap for the summary only (Fraunces 600@24 for its heads).
- Result: 292 font entries across the 17 chapters, the book and the summary, all CID TrueType, no Type 3. Files
  shrank from 23.7 MB to 8.9 MB (chapters), 11.4 to 9.6 MB (book), 0.55 to 0.20 MB (summary).
