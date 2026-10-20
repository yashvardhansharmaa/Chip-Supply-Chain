# pdf-print notes (round 2, 20 October 2026)

Slug `pdf-print`; screenshot port 9803; pdf.py port 9334; summary_pdf.py checks on 9763.

## Plan
1. `build/pdf.py --chapter <id>` and `CP_PRINT.prepare({chapter})`: one chapter, compact title block, footnotes, heads, folios.
2. `build/chapter_pdfs.py`: all seventeen into `dist/pdf/<id>.pdf`, refuses < 100 KB or no text.
3. Cite line "PDF" link (build.js `citeBlock`, both pages), sitemap entries, phone layout.
4. Edition "Edition of <d Month yyyy>" (build date, `--edition` to pin) on title block + footer of all PDFs; citations carry it.
5. Browser print: static page Sources print full URLs; main page opens Sources lists (app.js beforeprint/afterprint) and prints URLs.
6. print.css token selector `:root, :root:not([data-theme="light"]), :root[data-theme="dark"]`.

## Progress
- (started 01:13) read RULES, pdf.py, summary_pdf.py, print.js/css, build.js citeBlock/sitemap, social.js, reviews.
- 01:40 print.js: prepare({chapter, edition, site}); title block; edition @page foot; colophon "How to cite this
  edition/chapter" (plain + BibTeX, no access date); readable() now prints the full URL minus scheme (was cut at 92
  chars and dropped query strings: 139 of 453 cited URLs were cut).
- print.css: dark-proof token selector; chapter-mode styles; Paged.js applies breaks by selector order inside body,
  so `.pt-chapter + .chapter` / `.pt-chapter ~ .site-footer` come after the rules they undo.
- pdf.py: --chapter, --edition, --port (waits while busy); chapter_pdfs.py written; summary_pdf.py dates the summary
  (--edition, --dark).
- build.js: chapterPDF() + PDF link in citeBlock (only when dist/pdf/<id>.pdf exists), sitemap lists chapter PDFs and
  dates the summary PDF by bytes; template.html + social.js cite-line CSS (phones: day on own line, no dots).
- app.js: beforeprint/afterprint opens closed <details>.
- 01:55 rendered test-and-assembly (10 pp, 1.24 MB), geopolitics (15 pp, 1.38 MB), lithography (13 pp, 1.37 MB).
- full run 1: 17 chapters, 187 pages, 21.8 MB; chain 171 pp, 8.7 MB, 0 overflow/stray notes, 0 cut URLs (old: 234).
- static page browser print (summary_pdf.py --force): 39/39 source URLs printed; review answers open; specimen gone.
- main page browser print (?only=lithography): sources open (CSS + app.js handler), URLs printed, marks stay numbers.
- dark mode (--dark / ?theme=dark): static and main prints light (mean luminance 233-251).
- pdf.py fallback printed head/foot twice (Chrome now draws CSS margin boxes natively): fallback now empties them;
  print.css margin boxes got type so the browser's own print matches the PDF heads.
- coordinator change (owner): cite line is now "Updated <day> · Cite this chapter · Chapter PDF"; "Report an error"
  mailto removed (CITE_MAIL, mail var, .ch-cite-mail CSS); link has download="chip-supply-chain-<id>.pdf". Full line
  is 428 px at 11 px labels vs 358 px phone column, so phones put the day on its own line, links on one line.
- takeaways print: list 10pt (was 12.75pt from the screen's 17px), label 7pt.
- run 2: chain into dist (170 pp, 9.0 MB, 0 overflow/stray, 0 cut URLs); chapter run hit a transient social.js
  load error from another agent's edit, so chapter_pdfs.py now exits with a one-line message there.
- run 3 (final code): 17 chapters, 195 pages, 22.4 MB (logs in qa/round2/scratch/pdf-print/chapter-pdfs-run3.log).
  Summary re-dated (4 pp, 0.55 MB). Build, check-speak, check-integrity (exit 0), check-sources all pass. Done.
