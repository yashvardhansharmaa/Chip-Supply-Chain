# The Chain's contents page: The line (stage report)

Branch `redesign-chainpage`. The owner chose "The line" from design round six (`MAIN/qa/design6/a/opt1-line.html`, its notes and the review in `MAIN/qa/design6/review/review.md`). This stage builds it into the redesign at `#/chain`, and takes "How to read a chapter" off the page and out of the book PDF, as the owner asked.

## What changed

### The page (`#/chain`)

- **The head.** The title on the left. On the right, the standfirst and, under it, the three downloads as one line of small links: Download the chain as a PDF, Download a short summary, Read the summary online. They were three buttons at the foot of the page (y 2,041 at 1440); now they end at y 303 at 1440 and y 228 at 390.
- **The line.** Under an ink rule, the label "The fourteen stages, in the order a chip is made" and the two-line key: "Extreme: three or fewer firms could supply the stage, or one holds more than half" and "High: four to six firms could supply it". Then the fourteen specimen drawings stand in order on one route. Each has its number, its band mark (a solid wine bar for Extreme, an ink outline for High) and its title under it. The route turns into a wine bar under each Extreme stage (01, 04 to 05, 08 to 11) and ends in an arrow. Each drawing and title links to its chapter with the static page in `href` and the app's route in `data-route`, as chapter links do.
- **The bracket.** One ink bracket under all fourteen, its ends turned up to the route, carries "Across the chain" and chapters 15 and 16. The existing note sits under it.
- **The list.** Each chapter's one line in full: 01 to 07 under the picture's left half, 08 to 14 under its right, then 15 and 16 under a plain ink rule. It keeps `.contents-grid`, `.item`, `.n` and `.t` with `href="#<id>"`, which the book's contents read.
- **Pointing at a chapter** in the picture or the list marks it in wine in both, as in the mockup (`src/app.js`, a few lines in `boot()`).
- **Counts come from the data:** "fourteen", the columns of the line (`--ln-n`, `--ln-half`), the row break, the Extreme runs, "These two chapters" and the list's halves are all computed in `build/build.js` from the chapters.

### Responsive behavior, as the mockup

- **From 1360 px:** one row of fourteen. Each title is set at 14 px, or smaller where its cell is narrower than at 1440 (a container query), so the titles break exactly as at 1440 and no word ever splits. At 1366 the mockup's sizes broke "Lithograph / y"; this is fixed.
- **From 760 to 1359 px:** two rows of seven, the route wrapping with an arrow at the end of each row, titles at 15 px.
- **Under 760 px:** the route runs down the page, one row per stage with its drawing, number, mark and title, ending in a downward arrow. Every title is readable, and all fourteen reach the first screen at 390. The key and the bracket follow the route, then the list, then the standfirst at the foot under a hairline.
- **The phone's specimen strip** stands down on the contents page, before boot and after, and comes back on a chapter. Back to top floats at the window's foot there, as on a wide screen.

### The drawings

- `build/line-stills.py` (new, Python with Pillow, run by hand like `build/cards.py`) makes the mockup's evened stills from `build/assets/specimens/<id>.webp` (Lithography's annotated still, from `data/specimen-parts.json`).
  - Each still is trimmed to its drawing and made at most 300 px on its long side.
  - Each gets its own gamma (1.50 to 3.38), so the gray of its lines averages the same for all fourteen. Only tones change.
  - It also gets the share of its cell it fills in one row, two rows and on a phone, so each covers the same area.
- The output is `build/assets/line/<id>.webp` and `line.json`, 294 KB in all. `build/build.js` copies them to `dist/media/line-<id>.webp`.
  - It warns if a drawing is missing.
  - It also warns if a specimen still has changed since its drawing was made (a hash of the source is kept in `line.json`), so the step is not forgotten.
- The drawings load lazily, so they are fetched only when The Chain's contents show.
- On the light ground they multiply into it. In dark they invert, as the chapter stills do.

### The standfirst

**Today's wording is kept, word for word.** The mockup's two sentences drop facts from the standfirst itself: "from design software to the data center" and the two chapters across the chain. The rule was to change it only if the mockup's version were shorter with the same facts, so it stays.

The cost: at 1440 it runs six lines where the mockup's ran three, so the head is about 75 px taller and the picture starts lower (the line at y 351, against 275).
- At 1440 the bracket's chapters sit at y 670 to 692, so all sixteen chapters are on the 900 px first screen.
- At 1024 they first fell across the fold (y 891 to 914). The two-row layout now sets its gaps a little closer than the mockup's (the picture 32 px under the head instead of 44, the rows 24 px apart instead of 30, the bracket 24 px under the route instead of 30). The bracket now ends at y 890, so all sixteen are on the 1024 x 900 first screen too.

If the owner later approves the mockup's shorter standfirst, the head returns to the mockup's height, and the gaps can go back to the mockup's.

### How to read a chapter

- **Gone from the page.** The `howto-read` block and its styles are deleted (`src/template.html`, `src/styles.css`, the old block in `src/modules/chapter.css`). Its Extreme and High meanings survive as the key over the route.
- **Gone from the book.**
  - `src/modules/print.css`: the book prints the cover, then The Chain's title, the standfirst and the contents on one page, then the chapters.
  - The contents keep their page numbers (`target-counter` on `.contents-grid .t[href]`), their band marks and their two group heads with the key and the note. Those heads are print-only elements that build.js writes, because on screen the picture's label and the bracket say the same things.
  - `src/modules/print.js` removes the picture before Paged.js runs (the `GONE` list) and still rewrites the standfirst for paper ("This edition covers…"). Only its comments changed.
  - A chapter printed alone (`--chapter`) is unchanged.

### Where the rules live

- The contents page's styles moved to a new `src/modules/contents.css`, which only the app loads.
  - The readable chapter pages inline `chapter.css` alone, so they no longer carry the contents page's rules. Each is about 5 KB lighter than before this stage.
- The new block sits inside `.howto` and `.contents`, which the `CHAIN_ONE` rules hide above every chapter. Its screen rules are under `@media screen`, so print reads only `print.css`.

## Checks (on the final build)

| Check | Result |
|---|---|
| `node build/build.js` | builds, no warnings |
| `check-speak.js` | no matches |
| `check-integrity.js` | no problems (one existing warn on chapter 06's card, unchanged) |
| `check-sources.js` | 2,815 citations, all tier A or B |
| `check-size.js` | no file over 5 MB |
| `check-seo.js` | 16 chapter pages, 22 sitemap entries, no problems |
| `smoke.js --port 9441` | 36 page loads, no failures |
| `stage-chapters.js --base http://127.0.0.1:8774` | 10 of 10 pass. Checks 1 to 9 passed in the full run on the final build. Check 10 also passed there in an earlier run, then crashed once on a connection the preview server dropped (see below), and passes after the fix |
| `interact-chapter.js http://127.0.0.1:8774` | 85 of 85 ok, all passed |
| `sweep-full.js` at 390, 768, 1024, 1280, 1440, light and dark | 10 loads, 0 with findings (run again after the last layout change) |
| Titles at 1440, 1366, 1360, 1359, 1024, 768, 760, 759, 390 and 320, at text scale 1 and 1.15 | no title overflows its cell and no word splits; one-row titles take one to three lines (03 and 07 three, as in the mockup) |
| Test book PDF (scratch, not committed) | 213 pages. Page 2 holds the title, the standfirst and the contents with page numbers (01 on page 3 to 16 on page 195) and band marks. No "How to read" anywhere; "download" appears only in source addresses, as in the committed PDF |

**What the checks now cover:**
- `qa/scripts/smoke.js` checks the contents page against the page's own data (`CP_DATA.chapters`), at 320, 390 and 1440:
  - every stage on the line, shown, linked to its own chapter (`data-route` and the static `href`), with its drawing fetched and decoded;
  - the wine route under exactly the Extreme stages;
  - the bracket holding exactly the chapters across the chain;
  - all sixteen chapters in the list with `#<id>` links;
  - the three downloads;
  - no How to read.
  - The old check (`#contents a.t` at least 16) is inside these.
- `qa/redesign/stage-chapters.js` has a new check 10, run at 1440, 1024 and 390 with real mouse clicks:
  - every title on the line opens its chapter alone at its top;
  - the bracket carries the two chapters across the chain, in order, and each opens;
  - the three downloads show on the first screen, the two PDFs carry `download`, and each is served with the right type;
  - at 1440, each link's static page is served.
  - It fetches one link at a time and retries only a connection the server dropped. Any answer the server gives, a 404 included, stands, so the check is no weaker.
- Check 9 now expects the phone's strip to stand down on the contents and to come back on Back to a chapter. Before, it expected the strip to show chapter 01's specimen there.

## Shots

In `qa/redesign/shots/chainpage/` (kept out of git by `.gitignore`), taken from 8774 on the final build:

- `chain-1440.png`, `chain-1024.png`, `chain-390.png`, `chain-1440-dark.png`, the four required views;
- `chain-1440-full.png`, the whole page.

Compared with the mockup's shots (`MAIN/qa/design6/a/shots/opt1-line-*`):
- The picture, the bracket, the key, the list and the phone route match.
- The head is taller, because of the kept standfirst (above).
- In dark, the band marks now take the route's own wine, as the mockup draws them. The chapter rail's marks elsewhere use the lighter text wine (`--bar-5`), so the two differ in dark only. In light they are the same.

## For the lead

- **Reprint the book.** `dist/pdf/how-ai-chips-are-made.pdf` in git is the old book, with How to read. Reprint it with `python3 build/pdf.py "http://127.0.0.1:8765/?theme=light#/chain" dist/pdf/how-ai-chips-are-made.pdf --wait 8` before this ships. The test print above shows the result.
- **The preview server on 8774 sometimes drops requests.** It is `python3 -m http.server`, which speaks HTTP/1.0 and keeps a listen queue of 5, so a burst of requests sometimes has a connection reset.
  - In one load out of four or five, it lost the last few drawings.
  - Once, it dropped one of check 10's sixteen page requests.
  - On smoke's own server, 9 loads out of 9 decoded all fourteen drawings, and smoke now fails if one is missing.
  - GitHub Pages is not affected. Screenshots taken from 8774 should be checked for a missing drawing.
- **When a specimen still is re-rendered**, run `python3 build/line-stills.py`. The build warns until it is run.
