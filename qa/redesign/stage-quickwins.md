# Quick wins A, B and C, built (29 October 2026)

Branch `redesign-quickwins`, worktree `chokepoints-rd-quickwins`, cut from 25d8080. Preview http://127.0.0.1:8787/. Not merged, not pushed. The brief is `MAIN/qa/excellence/BUILD-BRIEF.md`, and the mockups are in `WT/dist/mock/quick/`.

## A. Component Costs, figure 15.3

Figure 15.3 is now one B200, drawn to scale. The bar runs to $40,000. It is outlined to $30,000 and hatched from $30,000 to $40,000, the way the site draws every range. Epoch AI's build cost sits inside it, carved into its five lines, with memory in wine. Brackets mark the build cost (about $6,400) and the selling price ($30,000 to $40,000), and each line is named under the bar on a leader, the rightmost first. The finding names memory: "Memory, $2,900, is the largest cost of building a B200, which sells for $30,000 to $40,000".

- **Values.** Every value is the chapter's own: $2,900, $1,100, $1,000, $900, $480, about $6,400, and $30,000 to $40,000. They come from Epoch AI (December 2025) and the March 2024 reports Epoch AI cites, as in the chapter's table.
- **Place.** The old 15.3 (`market-2025`, chip sales, capital spending, Nvidia data center revenue and equipment sales) is gone. The new figure sits right after 15.2, in Who captures the value, as in the mockup. The two paragraphs on chip sales and capital spending keep their numbers in the text.
- **How it is built.** It goes through `figure()` as a new type, `within`, so the build draws it as HTML and no script is needed to see it.
  - The data has seven rows: the five parts, then "Build cost" and "Selling price per chip" (a range). `parts`, `total`, `whole` and `about` name the rows, and `validate.js` checks them.
  - A figure may now carry `short`, its name in the rail, the citation and the CSV. This one's is "One B200, its build cost inside its price", the mockup's rail entry, because the title's first sentence is "One B200, drawn to scale".
  - `about` puts "about" before a value in the chart and the Table.
- **As for any figure:**
  - Cite, Table, CSV and PNG all work. The PNG has its own drawing in `FIG_JS`, `pngWithin`.
  - The rail lists it as 15.3. Numbering is unchanged: 15.1, 15.2, 15.3.
  - Dark mode comes from the tokens.
  - Print has its own rules in `print.css`, so it prints in the figures' small type with paper's wine.
  - check-figs now covers it.
- **Hover.** Hovering a line, or its name, lights both and dims the rest, as in the mockup. The listener is delegated, in `FIG_JS`.
- **One loss.** Old links to `#fig-component-costs-market-2025` now land at the top of the chapter.

Files: `content/15-component-costs.md`, `build/build.js` (`figure()`, `figFirst` and `figShort`, `aboutOf`, `tableFallback`, `FIG_JS`), `build/validate.js`, `src/modules/chapter.css` (one block at the end of the figure section, and `.is-table`), `src/modules/print.css` (one block after the change rows).

## B. AI Chips, the chart and the shelves linked

All in `src/app.js` (Landscape) and `src/modules/chips.css`.

- **Hover or focus.** Hovering or focusing a package lights its dot on the head's chart in ink, ringed, with its name and figure ("H100, 989"). A chip with no figure on the chart says so in the chart's own words, for example "Speed at FP16 is not published for the TPU 8t". A touch skips the hover and goes straight to the click.
- **A press on a dot.** A click or a tap on a dot of the head's chart marks that chip's package (ink ring, name in wine), brings it to the middle of the window and flashes it once. The flash is off under reduced motion. Today's tip no longer opens on a press there. A press on the package then opens its card, as today.
- **The keyboard keeps the tip.** Tab to the chart, then the arrow keys and Enter, as today. The card's own chart is unchanged.
- **How.** `chartSVG` draws an empty `<g class="lit">` layer. `drawChart` keeps the head chart's points (each with its chip) in `Lk`, so no dot is matched by its place in the DOM. `interactChart` takes `link`, which a press on a dot calls in place of the tip.
- **One change from the mockup.** In the mockup, hovering any other package cleared the marked package. Here the mark stays until another dot is pressed or the shelves are drawn again, so a pointer that lands on another package after the scroll does not wipe it. Hovering another package still lights that package's dot.
- **The limit at 1440 is not fixed.** Only the first two shelves share the screen with the chart, so a package lower down lights a dot that is out of view. I found no simple, clean fix:
  - a sticky chart would cover half the shelves;
  - a docked copy of the chart is a new element;
  - a figure written on the package would change the shelves' design.

  It needs the owner's call. On a phone, a package still opens its card, and the card's own chart marks the chip.

## C. The four "The chokepoint" openings

Each opening is made of sentences and sources already in its chapter. Every sentence that moved up is cut from where it was.

| Chapter | The opening | Cut from |
|---|---|---|
| Advanced Packaging | CoWoS users; Epoch AI's 90 percent of CoWoS in 2025; TSMC doubling in 2024 and still short; Wei in July 2026, "so tight"; outsourcing to ASE and Amkor | Capacity: the 2024 topic sentence, the CoWoS half of Epoch AI's 90 percent, SemiAnalysis's outsourcing sentence, Wei's "so tight" |
| Memory and HBM | the leading accelerators outside China use the three makers' HBM; the rule of 5 December 2024; CXMT still struggling in June 2026, with SemiAnalysis's judgment | The chokepoint: the accelerators sentence, the rule's topic sentence, CXMT's topic sentence and SemiAnalysis's sentence |
| Chip Design | CSIS's three companies; the BIS letters of late May 2025; Synopsys's two letters; CSIS on Chinese tools | The chokepoint: the same four sentences, from later in the section |
| Silicon | almost all advanced capacity on 300 mm; the top five at 75 percent, none American or Chinese; losing one would leave four; qualifying a new plant, Siltronic in July 2025 | The chokepoint: the 300 mm topic sentence and the qualification sentence |

**Every figure stays.**
- Every `{{figure:...}}` line is unchanged, and the script that made the edits checked it.
- Each chapter's figure count matches 8766 for all 16 chapters, 58 in all.
- Figure 10.4 (`china-backend-tools`) is still in Advanced Packaging's The chokepoint, still numbered 10.4, and still directly before the JCET paragraph. The opening is the only thing added above it. The mockup had moved the figure below the JCET paragraph; I kept it where it is, as the brief asks.

**Sources.** Each of the four sentences the mockup gave a source was checked against the source's text, in `MAIN/qa/round2/scratch/` (cached copies):

| Sentence | Source | Result |
|---|---|---|
| "Nvidia, Google, AMD and Amazon all use TSMC's interposer packaging, called CoWoS, made in Taiwan" | Epoch AI, AI chip supply chain constraints | **Does not say it.** The page names the four as CoWoS buyers, but says nothing of Taiwan or an interposer. Kept unsourced, word for word as in How it works. |
| "In 2024 TSMC was more than doubling CoWoS capacity and still could not keep up with demand" | TSMC 2Q24 call, p. 6 | **Says it.** Wei: "this year, I doubled ... More than double", and "I also tried to reach the supply and demand balance, but I cannot today. The demand is so high." Source added. |
| "Only SK hynix, Samsung and Micron make HBM in volume, and the leading accelerators made outside China use HBM from one of the three" | SK hynix 424B4 | **Does not say it all.** The prospectus's HBM chart lists only the three, but nothing in it says which accelerators use whose HBM. The opening uses the chapter's own unsourced sentence instead: "The leading accelerators made outside China use HBM from SK hynix, Samsung or Micron." |
| "Almost all fab capacity for advanced chips runs on 300 mm wafers" | CSET, January 2021, p. 57 | **Says it.** 300 mm wafers "are used for 99.7 percent of the world's fab capacity capable of manufacturing chips at ≤45 nm nodes" and "are necessary for supporting the smallest chip features sizes". Source added. |

Two rewordings in the mockup were checked as well:
- Packaging's "still so tight" is not in TSMC's 2Q26 call. Page 10 has "our packaging capacity is so tight that now it limits my customers' growth". The opening keeps the chapter's "so tight".
- Memory's "had yet to stabilize supply" stays. SemiAnalysis has "still struggling to stabilize supply for HBM3 8-hi, with even greater challenges in 12-hi".

The other moved sentences keep the sources they had.

**Repeats, and the rewording they needed.**
- **Advanced Packaging, Capacity.**
  - Epoch AI's sentence keeps its HBM half: "The four also used around 90 percent of global HBM supply in 2025, measured by value", from the same source.
  - The July 2026 paragraph keeps its other two sentences, the shortage first, so that "a different account" is followed by the account: "On the July 2026 earnings call, Wei said back-end capacity was still in shortage (p. 17). Asked about Intel's EMIB-T, he said … (p. 10)."
- **Left as they are, for the owner.**
  - In plain terms is the chapter's standalone summary, and it also appears on the walk, the summary page and PDF and the share cards. Two openings repeat a sentence from it: Advanced Packaging (the CoWoS users) and Silicon (the top five at 75 percent, word for word). Lithography's opening, the model, also restates its In plain terms ("Only ASML … makes them"). I left In plain terms unchanged. Cutting the sentence there would change those other pages.
  - Memory's BIS paragraph still dates the rule ("published the rule on 5 December 2024") and explains the foreign direct product rule after the opening has named both. This is as in the mockup.

## Checks

Run on 29 October 2026 against http://127.0.0.1:8787, after the last build. Other builders were running the same browser checks at the same time, and the machine's load average was about 27.

| Check | Result |
|---|---|
| `node build/build.js` | no warnings |
| `check-speak` | no matches |
| `check-integrity` | no problems. One warning, on 06's card, which 25d8080 has too |
| `check-sources` | 2,853 citations, all tier A or B |
| `check-size` | none over 5 MB |
| `check-seo` | 16 chapter pages, 22 sitemap entries, no problems. One note, on /supply-chain/'s title, which 25d8080 has too |
| `check-links --local http://127.0.0.1:8787` | 28 pages, 1,224 addresses, no broken links |
| `smoke.js --port 8792` | 47 page loads, no failures |
| `check-perchapter.js` | all 336 checks pass |
| `interact-chapter.js` | 89 of 90 in each of three runs. One phone check fails at random: the strip's wine rule, or the masthead coming back on scrolling up. 8766 fails the same two in the same conditions, and nothing in this branch touches the strip, the masthead or scrolling. |
| `stage-chapters.js --base` | 10 of 10 |
| `check-cites.js` | 3,332 marks, 0 problems |
| `check-figs.js` | **120 of 120**: the 112 from before, plus 8 for the new 15.3 |
| `interact-chips.js --base` | **93 of 93**, two checks updated (below) |
| `datacheck-chips.js --base` | 1,384 values at 1440 and 390, 0 mismatches |
| `interact-glossary.js` | all 90 pass |
| `interact-suppliers.js` | 65 checks, 0 failed |
| `interact-masthead.js` | all passed |
| Figures per chapter | All 16 chapters match 8766, 58 figures in all, and the book has 58 too |

**Checks updated, because they asserted what this branch changes:**
- `check-figs.js` now lists `component-costs/b200-price` and reads a `within` figure's marks: the parts, the total and the whole.
- `interact-chips.js`, two checks:
  - "A tap on each of 30 dots pins its tip" is now "… marks its package on its shelf, with no tip".
  - "Open the … in a tip" now reaches the head chart's tip by the keys, not by a press on a dot.

**The PDFs.** I printed the five chapters I touched with `build/pdf.py --chapter <id> --port 9367` into scratch. Copies and their logs are in `qa/redesign/shots/quickwins/pdf/`, which git ignores. `dist/pdf/` was not touched, so it needs the lead's reprint.

| Chapter | Pages (committed) | Layout report |
|---|---|---|
| Component Costs | 10 (9) | No short, stranded or split pages. 15.3 prints whole on page 6 (`costs-pdf-p6.png`). |
| Advanced Packaging | 12 (11) | The opening ends page 8, and figure 10.4 opens page 9 (`packaging-pdf-p9.png`). There is one stranded head and one split, both on figure 10.1 on page 3. Pages 3 and 4 match the committed PDF, so that split was already there. |
| Memory and HBM | 10 (10) | clean |
| Chip Design | 11 (11) | the card splits across pages 2 and 3, as before |
| Silicon | 10 (10) | the card splits across pages 2 and 3, as before |

None says "TEXT OFF THE PAGE" or fell back from Paged.js. Each is dated "Edition of 29 October 2026".

## Shots

In `qa/redesign/shots/quickwins/`, which git ignores:
- `costs-1440.png`, `costs-390.png`, `costs-320.png`, `costs-1440-dark.png`;
- `costs-hover-1440.png` (CoWoS-L hovered), `costs-png.png` (the PNG export), `costs-pdf-p6.png`;
- `aic-hover-1440.png` (the H100 hovered), `aic-tapdot-1440.png` (the TPU v5p dot pressed), `aic-tapdot-390.png`;
- `opening-packaging-1440.png` (the opening over figure 10.4), `opening-memory-390.png`, `packaging-pdf-p9.png`.

## For the merge

- `build/build.js`: this branch adds a branch to `figure()` for `within`, `figFirst` and `aboutOf`, and two functions plus two listeners in `FIG_JS`. The headings branch changes heading levels in `markdown()` and the rail. No line is shared that I know of.
- `src/modules/chapter.css` gains one block at the end of the figure section. `print.css` gains one block after the change rows. `chips.css` gains one block after the chart's focus ring.
- `src/app.js` changes only inside Landscape: `chartSVG`'s closing markup, `interactChart`'s click, `Lk` before `drawChart`, `render` and `wire`.
- Rebuild `dist/` after merging, as usual. The chapter PDFs and the book need reprinting for the openings and 15.3.
