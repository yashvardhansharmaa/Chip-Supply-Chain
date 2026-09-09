# Prose pass 4: runtime interface strings

9 September 2026. Scope: the user-facing string literals in `src/app.js` and the HTML text inside the
`<section data-view="landscape">` block of `src/template.html`. Standard:
`.claude/skills/writing-well/SKILL.md` (Zinsser). Test applied to every string: does a first-time
reader know what it means and what it does? Verbs for controls, nouns for labels, and anything a
policy reader would have to look up is spelled out.

This pass covers the interface text written today for the AI Chips page, plus a review of the
glossary popover, search, the Export Controls runtime strings, the phone strip and the cite block.
Nothing outside the two files above was touched; the flags at the end name what belongs to someone else.

After every edit: `node -e "new Function(require('fs').readFileSync('src/app.js','utf8'))"` (parses)
and `node build/build.js` (no warnings, D 0, ? 0). Both clean at every step. Page checked at
`http://localhost:8765/#/landscape`, `#/thresholds` and `#/exposure` at 1280 px and at 389 px.

---

## 1. The AI Chips page

### Page dek (`src/template.html`)

| | |
|---|---|
| Before | … Pick two to four and the page sets their specs side by side and draws their packages at one scale. Click a package to redraw the specimen beside the text. |
| After | … Pick two to four chips: the page sets their specs side by side and draws their packages at one scale. The specimen beside the text follows whichever chip you click. |
| Why | "Pick two to four" had lost its noun, and the sentence ran on two "and"s; the colon splits the instruction from what the page does with it. The last sentence repeated the click instruction that belongs beside the packages themselves, so it now states the one thing only the dek can say: the 3D specimen tracks your choice. |

### The Clear control (`src/template.html`)

| | |
|---|---|
| Before | `Clear` |
| After | `Clear all but one` |
| Why | The button does not clear. `Landscape.clear()` keeps the focused chip and drops the rest, and the page needs one chip selected at all times, so a button labelled "Clear" promised something the page refuses to do. The new label is exactly what happens, and it now agrees with the message the button produces ("Down to one chip. Pick another to compare."). |

### Selection count and its messages (`src/app.js`)

| | |
|---|---|
| Before | `Four is the limit. Remove one first.` |
| After | `Four is the limit. Click a selected chip to remove it.` |
| Why | The refusal told the reader what to do without saying how, and removing a chip is not obvious: you click a chip that is already on. Verified live: picking a fifth gives "4 of 4 chips selected · Four is the limit. Click a selected chip to remove it." |

| | |
|---|---|
| Before | `One chip stays selected.` |
| After | `At least one chip stays selected.` |
| Why | Fired when the reader tries to unpick the last chip, the old line reads as a statement of fact ("one chip is still selected") rather than as the rule it is. |

Kept: **`2 of 4 chips selected`**. "Of 4" could in principle be read as "4 chips exist", but the
picker above it shows nineteen, the dek and the group label both say "two to four", and the line is an
`aria-live` region, where the shortest true sentence wins. Kept: **`Down to one chip. Pick another to
compare.`** It names the state and the next move in seven words.

### Packages at one scale (`src/template.html`)

| | |
|---|---|
| Before | Every plan is drawn at the same millimetres per pixel, so a bigger package looks bigger. Click one to focus that chip. |
| After | Every package is drawn from above at one scale, so a bigger one looks bigger. The logic dies do the computing, the memory stacks feed them, the interposer is the silicon slab that wires the two together, and the substrate is the card underneath. Click a package to highlight that chip in the table and open its notes. |
| Why | Three problems. "Plan" is a draughtsman's word: "drawn from above" says the same thing and teaches it. "The same millimetres per pixel" is the implementation; "at one scale" is the fact, and the clause after it already carries the consequence. "Focus that chip" is interface jargon that describes nothing the reader can see, so the sentence now names the two visible effects. The new middle sentence is the only place on the site where the four words in the key (logic die, memory stack, interposer, substrate) are defined at the point of use; the definitions are the site's own, from the glossary and chapter 1. |

Kept: the heading **`Packages at one scale`**, the key labels **`logic die · memory stack ·
interposer · substrate`** and the scale bar **`50 mm`**. A legend wants short nouns, and the sentence
above it now does the explaining.

### Specs side by side (`src/template.html`)

| | |
|---|---|
| Before | (no text between the heading and the table) |
| After | Hover any figure to see its source. TFLOPS counts trillions of calculations a second. FP16, FP8 and FP4 are number formats: the fewer the bits, the more calculations a chip gets through. |
| Why | Three rows of the table are the export-control-relevant numbers and every one of them was written in symbols a policy reader does not have: a bare "9,000" under "FP4 TFLOPS". A row label cannot carry a definition, so the gloss goes once, above the table, in the same place and the same `cx-sub` style the packages section already uses. The first sentence tells the reader that every cell carries its source in a tooltip, which nothing said before. |

### The 18 row labels (`src/app.js`)

| Before | After | Why |
|---|---|---|
| `Vendor` | unchanged | The values are Nvidia, AMD, Google. Plain, and a noun. |
| `Status` | `Availability` | "Status" is vague, and the table already ends with an export status row. The values ("Shipping", "Announced", "Sampling; first racks deploying") answer one question: can you get it? |
| `Built for` | unchanged | Settled in the earlier UI copy pass. |
| `Foundry and node` | `Foundry, process node` | The same pass replaced a bare "Node" with "process node" because a node is also a network node; today's rewrite reintroduced it. The comma form matches "Transistors, billion" and keeps the label a character shorter than "and". |
| `Dies` | `Logic dies` | "Die" is a glossary term with no gloss here, and the count excludes the memory stacks. "Logic dies" matches the key under the package plans, which is the reader's other sighting of the word. |
| `Transistors, billion` | unchanged | Plain word, unit spelled out. |
| `Package` | unchanged | The section above it is "Packages at one scale". |
| `Memory type` | unchanged | |
| `Memory, GB` | `Memory, gigabytes` | Spelled out, per the site rule; the chapters write "20 terabytes of GPU memory", not "20 TB". |
| `Bandwidth, TB/s` | `Bandwidth, terabytes/s` | "TB/s" is the densest abbreviation in the table. Also, the chip-to-chip row quotes bandwidth too, so this row sits with the memory rows to say which bandwidth it means. |
| `FP16 TFLOPS` | `Speed at FP16, TFLOPS` | Three consecutive rows looked like three different specifications. They are one quantity measured three ways, which "Speed at" says, and the sentence above the table now defines both TFLOPS and the formats. |
| `FP8 TFLOPS` | `Speed at FP8, TFLOPS` | As above. |
| `FP4 TFLOPS` | `Speed at FP4, TFLOPS` | As above. |
| `Power, watts` | unchanged | Number and unit, no abbreviation. |
| `Chip to chip` | `Chip-to-chip links` | A dangling phrase becomes a noun for a label, and names the thing in the cells (NV-HBI, NVLink, Infinity Fabric). |
| `Scale-up` | `Scale-up, in one rack` | The most opaque term in the table. The gloss is the site's own glossary definition ("joins a few dozen accelerators inside one rack"), so no meaning is added. |
| `Price estimate` | unchanged | |
| `Export status` | `Export-control status` | A bare "Export status" reads as "is it exported?". Every value in the row is about licences and thresholds, and the site has a tab named Export Controls. |

Row labels do not wrap (`.cx-rowhead` is `nowrap`), so the widest label sets the width of the sticky
first column. Measured: 161 px before, 175 px after at a 389 px viewport, 179 px at 1280 px, where the
whole table still fits with no horizontal scroll. The 14 px is the price of spelling out three units.

### Footnote, empty states and the notes block (`src/app.js`)

| | |
|---|---|
| Before | `How the compute figures are measured` |
| After | `How the speed figures are measured` |
| Why | Follows the renamed rows; "compute" as a noun is industry usage. |

| | |
|---|---|
| Before | `In the supply chain` (heading over the per-chip notes) |
| After | `Notes and sources` |
| Why | A location phrase with no subject, and inaccurate: the notes cover the design, the numbers, the price and the filings as well as who makes what. Every note also ends in its source links, which the heading now announces, and it matches the button that jumps here. |

| | |
|---|---|
| Before | `Notes` (button in each column head) |
| After | `Read the notes` |
| Why | It is a control, so it takes a verb, in the house pattern of "Read the chapter". Measured at 90 px inside a 190 px column. |

| | |
|---|---|
| Before | (specimen caption fallback) `… stacks` of `HBM` |
| After | `high-bandwidth memory` |
| Why | The fallback fires only when a chip has no memory type on file, which is exactly the reader least likely to know the acronym. |

Kept: **`not published`** (and `area not published`, `size not published`). Three words, honest, and
they say the vendor withheld the figure rather than that the site failed to find it. Kept: **`No chip
selected.`**, **`No note yet.`**, and the cell tooltips **`Source: <label>`** and **`Sources for the
<chip>: …`**, which are already sentences.

### Export bar (`src/app.js`)

| | |
|---|---|
| Before | `2 rows · AI chips, selected` |
| After | `2 rows · the chips you picked` |
| Why | "AI chips, selected" is a dataset name with a modifier stapled on, and the bar sits under a heading that already says AI chips. The reader needs to know one thing: the copy button will give them their own selection, not all nineteen. Changed in both places that build the line (`Landscape.syncExport` and the `addExport` call), which must match. |

Kept: **`Copy as CSV`** / **`Copy as JSON`** / **`Copied`** / **`Copy failed`**. Each names the format
and the action in three words; a button cannot carry a definition of JSON, and the reader who does not
know the word does not want the file.

## 2. The glossary popover

| | |
|---|---|
| Before | `Glossary →` |
| After | `Open the glossary →` |
| Why | The link leaves the page the reader is on and switches the whole view, which "Glossary" does not warn of. "Open" is the verb the site already uses for this ("Each card opens the full chapter"). |

The popover has no other copy: it shows the term, the plain definition already published in the
Glossary view, and this link. Nothing is duplicated and nothing needs a hint.

## 3. Search

Reviewed, all kept.

- Placeholder `Search chapters, glossary, suppliers, chips, rules and events…` names all six kinds in the index.
- Hint `Type to search · Enter opens the first result · Esc closes` documents all three keys.
- Empty state `Nothing matches. Try fewer words.` gives the fix for the commonest failure, since every typed word has to match.
- Fallback `Nothing matches. The nearest glossary entries:` says both that the search failed and what the three results below it are.
- Result kinds: `Chapter`, `Glossary`, `Supplier`, `Chip`, `Essay`, `Export rule`, `China revenue`, `Event <date>`, and for a section hit the chapter's own title. The brief lists these as "Firm", "Control" and "Exposure"; those were renamed in the earlier UI copy pass, and the current words each say what the reader would be opening. Verified live: a search for "hbm" returns Glossary, Memory and HBM, Chapter, Event 2024-12-02, Export rule and Supplier rows.
- Dialog label `Search the site`, button tooltip `Search the site (Ctrl+K, or press /)`.

## 4. Export Controls runtime strings

Reviewed, all kept.

- Chapter chip tooltip `Read the chapter: Geopolitics`. Verb, then the destination by name.
- Table headers `Legal instrument · Scope · Threshold · Destinations and licence policy · Status · Source`, and the count `Showing 40 of 40 thresholds`.
- Exposure tooltip: `Camtek · FY2021` / `China was 54.8% of revenue · USD 147.7m of 269.7m` / the firm's own basis line / `Click to open the filing`. Past tense for a closed fiscal year, the filed absolute figures beside the share so the reader can check the arithmetic, and an action rather than a destination. "m" for million is left as is: the currency is named beside it and spelling it out would double the width of the busiest line in the tooltip.
- The status labels in the Status column (`In force`, `Superseded`, `Suspended`, `Rescinded`, `Proposed, never in force`) are data values from `data/control-thresholds.json`, not strings in `app.js`. All five are plain English; no change needed, and none is mine to make.
- The basis tags under each firm (`counted where it ships`, `counted where it is billed`, …) were rewritten in the earlier pass and still read as answers to "counted how?".

## 5. The phone specimen strip

Reviewed, all kept. `Expand` / `Collapse` in `app.js` describe what the button does to a strip that is
already visible, which "Show" / "Hide" did not. The `Contents` button and the sheet's `Contents`
heading are in `src/template.html` outside the landscape section, so they are not mine this pass; both
read correctly, and the button naming its destination is what makes the pair work.

## 6. The cite block

Reviewed, kept. The `Cite this site` summary is a verb phrase, which is right for a control. The two
blocks below it are a plain citation and a BibTeX record: labelling them would tell the reader who
wants BibTeX something they can already see, and the reader who does not want it ignores both. The
date is inserted twice, once as "September 2026" in the citation and once as the accessed date, which
is the convention rather than an inconsistency.

---

## Flags, for whoever owns these

1. **`app.js` has a duplicate key in the browser-title map** (`Router.route`): `walk` appears twice, as `'Intro'` and later as `'How a GPU is made'`. The second wins, so the first string is dead. The visible title is fine; removing the dead key is a code change and outside this pass.
2. **The plan-card tooltips** on the package drawings are the `layout.note` fields in `data/landscape.json`, some of them 300 words long. They are well written but they are a data field, not an interface string, and a tooltip that long cannot be read on a phone. Worth a look from whoever owns the data.
3. **The Notes and sources block** opens the focused chip's note and leaves the others closed. Nothing says so, and no string I own can: it is behaviour, not copy.
