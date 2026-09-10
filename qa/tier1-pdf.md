# The Chain as a report

`python3 build/pdf.py "http://localhost:8833/?theme=light#/chain" dist/compute-chokepoints-the-chain.pdf --wait 8`
**118 pages, 4.05 MB, A4, 18 seconds** end to end, 2.9 s of it pagination. Was 151 pages, 3.56 MB.
Pages shot to `qa/tier1/`.

## The ramp, before → after, in points

body `10.5/1.6→9.5/1.42`, title `39.6→23`, number `40.5→24`, dek `12.4→11.8`, h3 `20.3→14`, h4 `15→11`, labels `8.6→7`
In short `16.5→11.5`, In plain terms `13.1→10`, card figure `20.3→15.5`, card row `11.6→9.2`
table `11.3→8.6`, its head `8.3→6.8`, figure title `11.6→9.5`, its source `8.3→6.8`, contents `19.5/12.8→14/9.5`
sources `8.5→7.8`, chapter's end to page foot, URLs 6.6 mono

Measure unchanged at 132 mm; title page display kept (head 42 pt, was 44).

## Footnotes

Chrome cannot put a note on the page its call falls on, so Paged.js 0.4.3 paginates: vendored at `build/vendor/paged.polyfill.js`, injected by `pdf.py` after load. `src/modules/print.js` — print-only, inert on screen — writes a `<span class="fn">` after each citation from its `data-*` fields and href. `print.css` floats it to the foot, silences Paged.js's own call and marker so the superscript stays the call and the note keeps the chapter's number, and rules 42 mm above the block. The chapter source lists then go. **557 citations, 487 notes placed, 70 same-page repeats dropped, none stray, none overflowing**, 1,238 live links.

Running heads are margin boxes: `string-set` on the chapter h2 gives "Chapter 4: Lithography" top left, "Compute Chokepoints" top right, the URL bottom left, page n / N bottom right, mono 7.5 pt, none on the title page. The contents carries page numbers.

## Against AI 2027

Shared now: A4, title page, a running head per chapter, notes at the foot under a short rule (theirs 36 mm) at four fifths of body size (theirs 9.4 on 11). Not shared: theirs are sidenotes in a 60 mm outer margin, ours at the foot; their 11 pt ET Bembo reads larger than our 9.5 pt Newsreader; they print no folios.

## Left undone

- Chapter openers carry air under "In short": the 196 mm card will not split, so it starts the second page. 58 of 118 pages leave over 42 mm above the notes, mostly openers and tails.
- Two `string()`s in one margin box cancel out in Paged.js, so the head is one string, not number plus title.
- If Paged.js fails, `pdf.py` reprints with Chrome's pagination, notes under "Notes" at each chapter's end; `--no-paged` forces that, `--only N` paginates N chapters.
