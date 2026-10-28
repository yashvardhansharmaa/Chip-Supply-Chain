# The visual pass: stage report

Branch `redesign-visual`, 27 Oct 2026. The owner compared the redesign with the live site and approved five changes. The redesign keeps its structure. It takes back the live site's at-a-glance signals and its lighter chrome. Item 2 changed during the work: the owner chose to keep the redesign's single stage mark, so no four-step meter was added anywhere.

## What changed

### 1. Wine as a signal again

The owner's chart rule of 21 October is back: "garnet on the largest only, site hues for the rest". Wine is `#7a1f2b` on light and `#d98a95`, the dark theme's accent, on dark. `--bar-5`, the Extreme token, now reads `var(--accent)`. High keeps its look: an ink outline, or the mid-gray tint in the meter.

- **Extreme marks are wine** in these places:
  - the home list's meter;
  - the chapter rail's chain list;
  - the contents page and its key;
  - the card's Concentration mark;
  - the kicker's band mark;
  - the walk's Concentration mark;
  - the Suppliers route stops and their key, the strip under the map and the country panel's stage marks;
  - the glossary's stage marks;
  - the summary page: the meter, the word, the Extreme pill and the card's top rule.
- **Extreme words on the home list are wine** at weight 600, as on the live site. The High words stay gray.
- **The home list's picked row** was the one wine row. Wine now means Extreme, so the picked row gets a paper tint instead. The tint reaches the number in the ledger column, the number is wine, and the name is set at 600.
- **On every chart the largest bar is wine**, with its value in bold wine. The other bars keep the light tint. This covers:
  - the chapter figures, in the app and on the readable pages;
  - the glossary country card's shares;
  - the Export Controls exposure panels and the static page's peak marks;
  - the PNG export;
  - the chapter PDF, where print's Extreme marks are wine too.
- The "rule B" comments now state the new rule in `src/styles.css`, `src/modules/chapter.css`, `src/modules/print.css`, `src/modules/lookup.css`, `build/build.js` and `build/assets/*.css`. The checks that asserted ink for the largest bar now assert wine, in `qa/redesign/interact-chapter.js` and `interact-glossary.js`.

### 2. The meter

The owner withdrew this item mid-task. The redesign's single mark stays: solid for Extreme, hollow for High. The home list keeps its meter. Only item 1's colors apply to it.

### 3. Lighter figure chrome

The changes are in `build/build.js` (`figure()` and `FIG_JS`) and `src/modules/chapter.css`.

- **The gray strip is gone.** One quiet source line sits under the chart: "Source:", the linked title and its footnote mark `[17]`, in Hanken at 12.5 px in the muted ink. The actions follow as small text links: Cite · Table · CSV · PNG. When the source is short, they share its line on the right. When it is long, they drop just under it, starting from the left. A Note is one more quiet line.
- **The typed address line is dropped.** "Figure 11.2" still links to the figure's address, and Cite still gives the full citation with the address, now set in Fragment Mono. The PNG export reads the address from the Cite box.
- **The frame is a hairline** (`--line-2`), not `--rule-ink`.
- **The head is tighter:** the figure number in small mono, the finding at 21 px, then the subtitle.
- **Print is unchanged.** The test PDF still prints "Source:" with its title and footnote number under each figure.

### 4. Less Fragment Mono

- **New tokens:** `--font-kicker` is now Hanken Grotesk. `--fs-label` is 11.5 px, `--tr-label` is 0.08em and `--tt-label` is uppercase. The base `.label` rule uses them, giving small spaced capitals in the muted ink at weight 500, as the live site sets its labels.
- **Set in these capitals:** kickers, labels, the chapter kicker, "On this page", "The chain at a glance", the card's labels, the specimen labels, the section kickers, the meta lines on chapters, home and the static page, and the summary page's labels.
- **Hanken on tabular figures:** dates, counts, bar values, axis numbers and table cells. Country codes are Hanken capitals.
- **Fragment Mono stays for:** figure numbers (the head and the rail), code, the address inside Cite and the edition citation.
- **Kept in their own case:** headings that carry the `label` class, such as "In plain terms", "In short", the card title and the static page's section heads. The chapter verdict ("Extreme concentration · Hard to substitute") also keeps its case.
- **Paper is unchanged.** Print resets the capitals, so the PDF keeps its Fragment Mono kickers.
- **AI Chips is untouched.** It keeps its labels through a guard in `src/styles.css` (`section[data-view="landscape"] .label`), because `chips.css` sets some labels in Fragment Mono, which would turn into tracked mono capitals. The AI Chips builder can drop the guard when they move to the new labels.

### 5. The whole specimen caption in the phone strip

- **The whole caption shows.** On phones and narrow windows the strip shows the full caption in Hanken at 11.5 px, with no clamp and no "…".
- **The caption flows around the thumbnail.** It runs beside the thumbnail, then under it at the strip's full width. Contents and Expand sit at the foot on the right. A float at the caption's end keeps their space free, so they share the last line when it is short.
- **The strip is only as tall as it needs to be,** and never under 128 px. At 390 px wide it is 182 to 214 px, against 189 to 255 px when the caption keeps to its column. At 360 px it is 197 to 245 px. `src/app.js` Band measures the strip into `--strip-h`, and the page's foot padding and Tab scroll padding follow it.
- **Expand still works.** The expanded strip is unchanged.

## Checks

| Check | Result |
|---|---|
| `node build/build.js` | builds |
| `check-speak` | no matches |
| `check-integrity` | no problems |
| `check-sources` | 2,815 citations, all tier A or B |
| `check-size` | nothing over 5 MB |
| `smoke.js --port 9421` | 36 loads, no failures |
| `stage-chapters.js --base http://127.0.0.1:8774` | 9 of 9 |
| `interact-chapter.js http://127.0.0.1:8774` | 65 of 65 on a quiet machine (see the notes) |
| `interact-glossary.js http://127.0.0.1:8774` | 90 of 90 |
| `interact-suppliers.js http://127.0.0.1:8774` | 65 of 65 |
| `interact.js` (home, not required) | all pass |
| `sweep-full.js` at 390, 1024 and 1440, light | 21 loads, no findings |
| `sweep-full.js` at 390, 1024 and 1440, dark | 21 loads, no findings |

`interact-chapter.js` gained these checks:

- Extreme marks are wine in the kicker, the card and the rail, and High stays an outline.
- The kicker and the facts line are Hanken capitals.
- On every chart, wine marks every largest bar and no other bar.
- The phone strip shows the whole caption, it is under 260 px tall, and its Contents button takes a tap.

`interact-glossary.js` now matches three labels without regard to case, because `innerText` returns their capitals.

Contrast:

- Wine `#7a1f2b` is 9.9:1 on the ground and 9.3:1 on the paper tint.
- The dark accent `#d98a95` is 7.2:1 on the dark ground and 6.5:1 on the dark tint.
- The muted labels are 7.3:1 light and 7.8:1 dark.
- The stop numbers on wine are 9.9:1 light and 7.2:1 dark.

The test PDF of chapter 11 was printed to a scratch folder, 13 pages, and `dist/pdf/substrates-and-pcbs.pdf` was restored. Page 5 shows Figure 11.2 with the wine largest bar and "Source: Ajinomoto, … [17]" under it.

## Shots

The shots are in `qa/redesign/shots/visual/`, which git ignores. All are from 8774 unless noted.

- `home-1440.png`
- `opener-1440.png`: the Substrates and PCBs opener
- `figure-1440.png`: `#fig-substrates-and-pcbs-abf-layers` with the text around it
- `fig-short.png`: Lithography's Figure 04.5, a short source sharing its line with the actions
- `chapter-390.png`: the chapter on a phone, with the strip
- `figure-390.png`
- `figure-1440-dark.png`
- `home-390-dark.png`
- `before-figure-1440.png` (from 8766) and `live-figure-1440.png` (from 8765, the live site), for comparison

## Notes for the lead

- **Interact checks under load.** In the last runs the machine's load average was 40 to 150, from builders working in parallel. Under that load, `interact-chapter.js` fails up to four scroll-timing checks: the masthead rising and returning, the rail marking How it works, and the glossary passage landing. They fail the same way against 8766. The full run passed 65 of 65 earlier, on a quieter machine.
- **AI Chips.** The app view's charts still draw the largest value in ink (rule B), and its labels are still Fragment Mono. That code is the AI Chips builder's: the Landscape module in `src/app.js`, `chips.css`, and `/chips/` in `reference-pages.js`. The static `/chips/` page picks up the new capitals from the shared sheet, but its FP16 chart keeps ink and mono.
- **The summary PDF is unchanged.** Its print layout still sets Extreme in ink. The brief named the summary page, and changing the PDF means printing it again.
- **The redirect pages are unchanged.** Their small `.eyebrow` in `build/modules/social.js` stays Fragment Mono, because it sits in a page `<head>` there and another builder is working on that file's head.
