# AI Chips: the shelves, built (28 October 2026)

Branch `redesign-shelves`, cut from `redesign` at 0d46064. Built from `qa/design7/BUILD-SHELVES.md` and the mockup `qa/design7/b/B-shelves.html` (main checkout). Shots are in `qa/redesign/shots/stage-shelves/`.

## What changed

**The page (`src/app.js` Landscape, `src/modules/chips.css`, `src/template.html`)**
- The tick list is gone. The `Landscape` object is the mockup's `core.js` and `B.js`, ported into the app:
  - the head, with the title, the standfirst and the field chart with its measure select
  - one ruled shelf per maker, the packages drawn from above at one scale, the WSE-3 Turbo's wafer at its own scale inside its own row
  - the chip card, opening in place under its maker's shelf
  - "Compare with another chip", up to four chips, each column headed by its package at one shared scale, the largest of each row in wine
  - the picker, a bottom sheet on a phone
  - `#/landscape?pick=…&measure=…` in the address. Each choice of chips is a history entry, so Back works. A change of figure is written in place.
- Every rule in `chips.css` is scoped to `#aic`, so the other views' shared classes never reach the page.
- The figures come only from `window.CP_DATA` (`landscape`, `landscapeNotes`, `landscapeCompare`, layouts merged). Nothing is rounded or computed. "Not published" and "not supported" follow `compute.support` as in the mockup, and every source keeps the site's rule. The rule's labels and hints now live in `Landscape.SRC`, which `/chips/` and the data check still read.
- The specimen stage no longer shows on this page (`Stage.setVisible`, and the pre-boot strip script in the template).
- The masthead, search, footer, theme toggle and fonts are the site's own. The page's title uses the site's view-head sizes, so it matches the other tabs.
- A chip found by search, or by the Glossary's "On AI Chips", now links to the chip's own address (`#/landscape?pick=<id>`) and lands on its card.

**Changes to the mockup**
1. The owner's paragraph is cut (see the list of lines below).
2. **The head is rebalanced:**
   - The finding ("The Instinct MI455X has the highest published …") moves from under the chart's title to the left column, under the standfirst, over a hairline.
   - The key sits at the foot of the left column, on the shelves' rule, level with the chart's last line.
   - The head stays in two columns down to 981 px, with a 540 px chart from 1180 px down. At 1024 the first screen now shows the Nvidia shelf, where the stacked head showed none. Under 981 px it stacks: title, standfirst, finding, chart, key.
3. **The comparison's top bar** carries "Add a chip" at the left and Close at the right. At four chips the bar says "A comparison holds up to four chips."
4. **Chart labels:**
   - A label for the leader or a chosen chip no longer drops onto the years or another label when its dot is crowded. It takes the place inside the plot, nearest its dot, that covers the fewest dots.
   - The mockup measured small charts' labels at 11.5 px but drew them at 12.5 px. Both are now 12.5 px.
5. **Prose glitches from the data's words:**
   - "It is built for mainly inference" reads "It is built mainly for inference".
   - "The memory maker and the package type and its assembler" reads "The memory maker, the package type and its assembler".
   - In a comparison, chips missing the same parts share one sentence.
6. **The picker** keeps to the room under its control on a short screen, and its list scrolls inside. One listener closes the chart's tip, where the mockup added one more on every render.

**The static `/chips/` page (`build/modules/reference-pages.js`)**
- Its full table is kept.
- Its lede is the page's new standfirst.
- The chart is headed "by the month each chip was announced".
- The lines on how to click and scroll are cut.
- Its largest dot is wine, as the app sets it.
- The template's `{{AIC_FACTS}}` count line went with the old head (the date is in the footer).

**QA tools**
- `qa/redesign/interact-chips.js`, `datacheck-chips.js` and `labels-chips.js` are rewritten for the shelves.
- `qa/scripts/smoke.js` reads the shelves and the field chart.
- `qa/redesign/sweep-full.js` now also measures contrast: text under 4.5:1 against its first solid ground, with a text of marks alone, such as a dash, left out. The brief counted on it, but the tool had no such measure.

## The lines cut and kept

**Cut**
- "Below, each maker's chips, oldest first. Every package is drawn from above, at one scale. Open a chip for its figures and the makers of its parts." (the owner)
- "Select a dot for its name and figure." (the owner's example)
- "Chip card", the card's kicker. It named what is in view.
- "Comparison" and "Two/Three/Four chips side by side", the comparison's kicker and meta. Both described the visible layout. The section's screen-reader heading now names the chips.
- "Drawn from above, at one scale for every chip card.", the card's caption. It is the same claim the owner cut from the shelves. The package's size stays.
- "Every package drawn from above, at one scale.", the comparison's scale caption. The scale bar stays.
- "Remove a chip to add another." It said how to click. It is now "A comparison holds up to four chips.", which states the limit.
- ", so it is not on this chart" (and "so they are …") in the card chart's note. The "… is not published for the …" part stays.
- "Try a maker, such as Nvidia or Huawei." after "No chip matches." in the picker.
- ", shown below" in the shelf buttons' spoken names. `aria-expanded` now carries it.
- On `/chips/`:
  - "Each dot links to its chip's row in the table."
  - "Scroll the table sideways to see every column."
  - "Each dot is a chip, placed at the month its maker announced it."

**Kept, because readers cannot see what they say**
- The head:
  - the title and the standfirst
  - the finding
  - the chart's title with its select ("… of each chip, by the month it was announced")
  - "Speed at FP16 is not published for the TPU 8t, …", the chips each figure leaves off
  - the arrow sentence for a value above the scale, when there is one.
- The key: Logic die, Memory stack, Package, and the scale bar.
- "A whole wafer, drawn smaller than the rest." with its own scale bar.
- "The TPU 8t and the Ascend 950DT have no drawing, because their package layouts are not published."
- The card:
  - the maker and family line ("Nvidia, Blackwell") and the standfirst
  - the callouts (Logic dies, Memory stacks, Package) and the size ("95 × 68 mm, estimated.")
  - "The WSE-3 Turbo is a whole wafer, so it is drawn at a smaller scale than the other chips, beside a B200 package at the same scale." and "B200, for scale"
  - "No drawing. Google has not published the layout of the TPU 8t package."
  - the figures' labels, the sentences naming what is not published or not supported, and "Figures from the …"
  - the row labels, "No source gives …", "How the speed is counted" and the TFLOPS sentence.
- The comparison:
  - the column heads (size, name, maker and year)
  - the section heads (Figures, Who makes it, About both or all four, Where they stand, Notes and sources)
  - "A dash marks a figure that is not published." It explains a mark.
- The picker and the tip:
  - the picker's title, "Often set beside the B200", "Chosen" and "No chip matches."
  - the tip's name, figure and month.
- **Controls kept, each saying what it does:** "Compare with another chip", "Add a chip", "Remove", "Close", "Open the …", and the picker's field, "Find a chip or maker".
- **Kept but worth a look:**
  - The chart's spoken name ends "The arrow keys move from chip to chip." Only screen readers hear it, and it is their only route to the dots.
  - The picker's placeholder "Find a chip or maker" names the field, but could be read as an instruction.

## Checks (final build, all against http://127.0.0.1:8775)

| Check | Result |
|---|---|
| `node build/build.js` | built, no warnings |
| `qa/scripts/check-speak.js` | no matches |
| `check-integrity.js` | no problems |
| `check-sources.js` | 2,815 citations, all tier A or B |
| `check-size.js` | none over 5.0 MB |
| `check-seo.js` | no problems |
| `qa/scripts/smoke.js --port 8791` (and 8792 on the final build) | 36 page loads, no failures. AI Chips: 38 chips on the shelves, 36 drawings, 30 dots at 320, 390 and 1440 |
| `qa/redesign/interact-chips.js` | all 93 checks pass, at 1440 (mouse) and 390 (touch), light and dark (`interact-chips.txt`) |
| `qa/redesign/datacheck-chips.js` | 1,322 values read back at 1440 and 390, 0 mismatches, wine included (`datacheck-chips.json`) |
| `qa/redesign/sweep-full.js` at 390, 1024, 1440, light and dark | 36 loads, 0 findings: no sideways scroll, overlap, clipped or small text, or text under 4.5:1. States: arrival, one card, two, four, the wafer's card, the TPU 8t's card (`sweep-shelves.txt`) |
| `qa/redesign/labels-chips.js` | 216 charts, 688 labels, 0 collisions (`labels-chips.txt`) |
| `interact-chapter.js` | 85 of 85 pass on the final build (see the known issues) |
| `interact-glossary.js` | all 90 checks pass |
| `interact-suppliers.js` | 65 checks, 0 failed |

`interact-chips.js` covers:
- both tasks and their counts, and the memory leader
- Remove, both selects and Back, including Back after Remove and after Close
- a fifth chip refused in words
- `?pick=` from a shared link, in dark
- four cards on lower shelves landing in view
- the wafer inside its row
- every dot reached by the arrow keys and by a tap
- "Open the …" opening one chip, and presses on every dot of both charts choosing nothing
- all 38 cards opening from their shelves
- a search result and the Glossary's link landing on the chip's card
- `/chips/`, with its full table and its intro.

## Click counts

| Task | 1440 (mouse) | 390 (touch) |
|---|---|---|
| H100 with H20 | 3: H100 on the Nvidia shelf, Compare with another chip, H20 under "Often set beside the H100" | 3, the same |
| B300, Instinct MI355X, Rubin and Instinct MI455X | 7: B300, Compare with another chip, Instinct MI355X (suggested), Add a chip, Rubin, Add a chip, Instinct MI455X | 7, the same. The MI455X is one swipe down the sheet |
| Which chip leads on memory | 2: open the select at the head, choose Memory | 2 |

## Known issues
- **`interact-chapter.js` "390: scrolling up brings the masthead back, the slim bar under it"** failed on two of three runs here. It failed the same way against the 8766 preview, which has none of these changes, and it passed on the final run. It tests the chapter's phone masthead, which this branch does not touch.
- **The select in the counts.** A native select's popup cannot be driven headless. The checks focus it and set its value, counted as 2 clicks, as the mockup's check did.
- **Labels over dots.** Where dots crowd, mostly at 320 and 390, 95 of the 688 labels lie over a neighboring dot, on their halo. None touches another label, an axis figure or the chart's edge.
- **The phone's Top and Contents bar.** It shows at the foot on phones, as on Suppliers. It is the site's own strip. The stage stays hidden on this page.
- **Departures from the mockup** are the ones listed under "Changes to the mockup": the head at 1024 and 1440, the finding's place, and the comparison's top bar.
- **`build/record.py`**, the demo-recording script, still looks for `#cx-table`. It falls back to any table. Nothing here runs it.
