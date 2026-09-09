# UI copy pass

9 September 2026. Interface strings only, in `src/template.html`, `build/build.js` and `src/app.js`.
Standard: `.claude/skills/writing-well/SKILL.md` (Zinsser). Test applied to each string: does a
first-time reader know what it means, what it does and why it is there? Verbs for controls, nouns for
labels, industry words spelled out.

Unchanged by instruction: the hero title "How AI chips are made", its subtitle "Every stage of the
supply chain, and who controls it.", and the credits sentence in the footer.

After every edit: `node -e "new Function(require('fs').readFileSync('src/app.js','utf8'))"` (parses)
and `node build/build.js` (no warnings). Both clean at every step.

---

## src/template.html

### Masthead tabs

| | |
|---|---|
| Before | `The Stack` |
| After | `The Chain` |
| Why | Nothing else on the site calls it "the stack"; everything calls it the chain ("The chain, scored", "Progress through the chain", "stage 4 of 15", "Last stage in the chain", and chapter 1's "The chain in one paragraph"). Worse, on a chip site "stack" already means an HBM stack. One vocabulary, and it is the reader's. **Flag:** `README.md` and `HANDOFF.md` still record the tab as "The Stack"; those files are outside this pass. |

| | |
|---|---|
| Before | `Controls` |
| After | `Export Controls` |
| Why | In a row of nav tabs, "Controls" reads as settings or sliders. Two words say what the page holds. |

### Hero specimen caption (`data-caption`)

| | |
|---|---|
| Before | An AI accelerator package: two reticle-sized logic dies and eight HBM stacks on a silicon interposer, on a build-up substrate. Highlighted: the HBM. |
| After | One AI chip package: two logic dies, each as big as a lithography machine can print, with eight stacks of high-bandwidth memory (highlighted) on a silicon interposer above the substrate. |
| Why | This is the first prose a newcomer meets, and it carried four unglossed terms (accelerator, reticle-sized, HBM, build-up substrate). "Reticle-sized" is now shown rather than named, HBM is spelled out, and the trailing fragment "Highlighted: the HBM." folds into the sentence. Every fact kept. |

### Chain strip head

| | |
|---|---|
| Before | Bar height is the chokepoint score, 1 to 5. |
| After | One bar per stage. The taller the bar, the harder that stage would be to replace: the chokepoint score, 1 to 5. |
| Why | The old line named the score without saying what it measures, and the score is the site's main claim. The gloss matches chapter 1's own definition ("A 5 means one supplier failing would stop leading-edge production worldwide"). The `<h2>` "The chain, scored" is kept: it is short and the dek now carries the meaning. |

### View heads

**Summary**

| | |
|---|---|
| Before | The whole chain in one sitting: for every stage, the conclusions, the chokepoint score and who leads. Each card links to the full chapter. |
| After | The whole chain in one sitting: for every stage, what we found, its chokepoint score and who leads it. Each card opens the full chapter. |
| Why | "The conclusions" is abstract; "what we found" is what the cards actually show. "Opens" is a verb the reader can act on. |

**AI Chips**

| | |
|---|---|
| Before | The accelerators that matter in 2026, with the foundry, node, memory supplier and packaging line behind each one. Pick a chip and the package beside the text follows its real die and HBM layout. |
| After | The chips that train and run AI models in 2026, with the foundry, process node, memory supplier and packaging plant behind each one. Pick one and the specimen beside the text redraws to that chip's real die and memory layout. |
| Why | "Accelerator" is defined by what it does instead of assumed. "Node" alone is ambiguous (network node); "process node" is the industry term. "Packaging line" becomes "packaging plant". "The package beside the text" becomes "the specimen", the site's own word for the 3D model, and "redraws" says what happens when you click. |

**Suppliers** (built in `build/build.js`, see below)

**Geopolitics** — dek comes from the chapter front matter, untouched.

**Controls**

| | |
|---|---|
| Before | `<h2>The Controls</h2>` |
| After | `<h2>Export Controls</h2>` |
| Why | Matches the tab, and no other view head starts with "The". |

**Glossary**

| | |
|---|---|
| Before | … each with one line on why it matters for policy or investment and a link to the chapter where it lives. |
| After | … each with a line on why it matters for policy or investment and a link to the chapter where it comes up. |
| Why | A term does not live in a chapter; it comes up in one. |

**Sources**

| | |
|---|---|
| Before | Every number on this site links to where it came from. This is the full list, by chapter, plus the method notes. |
| After | Every number on this site links to where it came from. The full list follows, chapter by chapter, with the method notes. |
| Why | "This is … plus …" is a flat inventory sentence; the new one has a subject and a verb. |

**Placeholder views** (`{{WALK}}`, `{{METHODS}}`, `{{SUMMARY_A}}`, `{{SUMMARY_B}}`): no view head and no
user-facing text of their own, so nothing to edit. Their browser-tab titles live in `app.js` and are
left as the prototype names their owners chose.

### Geopolitics page

| | |
|---|---|
| Before | Share of each segment by country. Darker cells are larger shares. We convert firm shares to country shares where needed; hover a row for the method and source. |
| After | How much of each segment each country holds. Darker cells are larger shares. Where the source counts firms, we credit each firm's share to its home country; hover a row for the method and the source. |
| Why | The first sentence had no verb. "We convert firm shares to country shares" is method jargon; the new clause says what the conversion actually does. |

| | |
|---|---|
| Before | `<h3>The control regime, event by event</h3>` |
| After | `<h3>The contest, event by event</h3>` |
| Why | "Control regime" is jargon and too narrow: the timeline's five categories are US export control, allied control, China countermeasure, industrial policy and corporate. "The contest" is the essay's own framing (its first heading is "The shape of the contest") and covers all five. |

| | |
|---|---|
| Before | (`data-caption`) The world with the chain's chokepoint towns pinned in copper, taller where the link is narrower, and the towns building substitutes pinned in ink: … |
| After | The chain's chokepoint towns, pinned in copper and taller where fewer suppliers exist. The towns building substitutes are pinned in dark: … |
| Why | "Where the link is narrower" asks the reader to hold a metaphor; "where fewer suppliers exist" is the thing itself. "In ink" is a house colour name, not a reader's word. |
| **Flag** | **This attribute never reaches the page.** `Geo.activate()` in `app.js` reads `$('[data-view="geopolitics"]')`, which matches the masthead `<a data-view="geopolitics">` before the `<section>`, so the override never runs and the caption a reader sees comes from `specimens/globe.js`. Fixing it means changing a selector (`section[data-view="geopolitics"]`), which is outside this pass. The improved text is in place for whenever that is fixed. |

### Controls page

| | |
|---|---|
| Before | Sub-tabs: `Threshold map` / `China exposure, from filings` |
| After | Sub-tabs: `Licence thresholds` / `China revenue share` |
| Why | There is no map: it is a table of the numeric lines that trigger a licence. "Exposure" is finance shorthand; "revenue share" is the quantity actually plotted. Names now match the headings, the browser-tab titles, the export button and the Sources method headings. |

| | |
|---|---|
| Before | `<h3>Threshold map</h3>` + intro: Every quantitative line that decides whether a chip or a tool needs a licence: the parameter, the value, where it applies, its status and the rule that set it. Filter by regime. |
| After | `<h3>Licence thresholds</h3>` + intro: Every number that decides whether a chip or a tool needs an export licence: what is measured, the value, where the rule applies, whether it is still in force, and the rule that set it. Filter by regime. |
| Why | "Quantitative line" → "number". "The parameter" → "what is measured". "Its status" → "whether it is still in force", which is what the Status column tells you. "An export licence" removes the ambiguity of a bare "licence". |

| | |
|---|---|
| Before | `<h3>China exposure, from filings</h3>` + intro: Share of each controlled-tool or chip vendor's revenue that came from China, computed from the absolute figures in the company's own filings. The ranking compares each firm's latest fiscal year with its first; the panels trace every year against the three US rule dates. Hover a point for the filed figures, click it for the filing. |
| After | `<h3>China share of revenue, from company filings</h3>` + intro: How much of each firm's revenue came from China, worked out from the absolute figures in its own filings. The ranking compares each firm's first year on file with its latest; the panels below trace every year against the three US rule dates. Hover a point for the filed figures, click it to open the filing. |
| Why | Opens with a question the reader has ("how much"), not a noun stack. First-then-latest matches the order the chart draws. "The panels below" says where to look. "Click it to open the filing" is the action, not a destination. |

| | |
|---|---|
| Before | `<summary>Table view</summary>` |
| After | `<summary>Show the same figures as a table</summary>` |
| Why | A `<details>` toggle is a control, so it gets a verb, and "the same figures" tells the reader this is the chart's data, not a new dataset. |

### Suppliers filters

| | |
|---|---|
| Before | `aria-label="Filter by chokepoint status"` |
| After | `aria-label="Filter by chokepoint level"` |
| Why | The visible option said "All chokepoint levels" and the column header said "Chokepoint". All three now say level. |

### Phone specimen strip

| | |
|---|---|
| Before | `Show` / `Hide` |
| After | `Expand` / `Collapse` |
| Why | The specimen is already on screen as a live thumbnail, so "Show" describes something the reader can see is not true; the button grows the strip to full height. Measured on a 375 px viewport: the two buttons take 150 px collapsed, 164 px expanded, no overflow. "Contents" is kept for both the button and the sheet heading so the control names its destination. |

---

## build/build.js

### Chapter head

| | |
|---|---|
| Before | `Chokepoint nameplate` (visible label and the section's `aria-label`) |
| After | `Chokepoint card` |
| Why | Chapter 1 tells the reader "Every chapter opens with a chokepoint card, and three fields on it matter most", then the card called itself a nameplate. The reader's instructions now point at what the reader sees. **Flag:** `README.md` and `HANDOFF.md` still say "nameplate". |

| | |
|---|---|
| Before | KPI label `Time to substitute` |
| After | `Substitution time` |
| Why | Chapter 1 lists the field as "Substitution time". Same word, and a noun for a label. |

| | |
|---|---|
| Before | KPI label `Cost signal` |
| After | `Money, for scale` |
| Why | "Cost signal" is vague and, for several stages, wrong: the values are market sizes and revenue ($11.4bn of wafer revenue, $135.1B of equipment billings) as often as costs. The new label says what the number is for. |

| | |
|---|---|
| Before | Status labels `China` / `United States` |
| After | `Where China stands` / `Where the US stands` |
| Why | A bare country name over a paragraph does not say what the paragraph is. Chapter 1 promises "the card also gives China's position and America's"; these labels deliver it. Both render on one line. |

| | |
|---|---|
| Before | Chapter tile: `the bill` (chapter 17, Component costs) |
| After | `the costs` |
| Why | "The bill" is an in-joke about the bill of materials. |

Kept: `In short`, `In plain terms`, `Concentration`, `Who leads`, `Where it is made`,
`Why substitution is slow`, `stage 4 of 15`, `You are here: …`, `Sources for this chapter (25)`,
`Specimen 05 · Lithography`. Each already passes the test.

### Exposure charts (`exposureViz`)

| | |
|---|---|
| Before | First fiscal year on file · Latest fiscal year · Peak year · Scale 0 to 60% of revenue |
| After | First fiscal year on file · Latest fiscal year · Highest year · Axis: China's share of revenue, 0 to 60% |
| Why | "Peak year" leaves "peak of what" open; "highest" is the plain word. The scale note never said what was being scaled, which is the one thing the axis needs to say. |

| | |
|---|---|
| Before | US rules of Oct 2022, Oct 2023 and Dec 2024 · Peak year · Shared scale, 0 to 60% |
| After | US export rules of Oct 2022, Oct 2023 and Dec 2024 · Highest year · Same scale on every panel, 0 to 60% |
| Why | "US rules" does not say which rules the vertical lines mark. "Shared scale" is chart-speak for "same scale on every panel", which is why the note is there at all. |

### Page copy

| | |
|---|---|
| Before | (Controls dek) 40 thresholds across 7 regimes, and China revenue exposure for 20 controlled-tool and chip vendors from their own filings. |
| After | 40 licensing thresholds across 7 regimes, and the China share of revenue for 20 firms that sell controlled tools or chips, taken from their own filings. |
| Why | "Thresholds" alone does not say thresholds for what. "Controlled-tool and chip vendors" is a compressed noun stack; "firms that sell controlled tools or chips" is the same set, said. Fallback string updated to match ("The licence thresholds and the revenue series are being compiled."). |

| | |
|---|---|
| Before | (Exposure note) Shares computed from filed absolute figures; bases differ by firm (ship-to, bill-to or headquarters) and are stated in each row. Method notes are on the Sources page. |
| After | Shares are computed from the absolute figures each firm filed. Firms count China differently: where the goods ship, where they are billed, or where the customer is based. Each row says which. Method notes are on the Sources page. |
| Why | "Bases differ by firm (ship-to, bill-to or headquarters)" is the single most important caveat on the page and was written for people who already knew it. Three short sentences instead of one semicolon sentence. |

| | |
|---|---|
| Before | (Suppliers dek) 220 firms across the chain, with what each one makes, where it is based and how hard it would be to replace. Filter by category, country or chokepoint status; copy the result as CSV. |
| After | 220 firms across the chain: what each one makes, where it is based and how hard it would be to replace. Filter by category, country or chokepoint level, then copy what you find as CSV. |
| Why | Colon instead of "with", "level" for consistency with the filter and column, and "then copy what you find" makes the two controls a sequence rather than a list. |

### Sources page

| | |
|---|---|
| Before | A primary or institutional · B established analyst or top-tier press · C specialist press or named analyst |
| After | Every source is graded by how close it is to the evidence: A primary or institutional · B established analyst or top-tier press · C specialist press or named analyst. Anything below C is not cited. |
| Why | The key listed three letters without saying what the grading is or why it stops at C. The last sentence states the site's own bar (the build report confirms zero D and zero unclassified sources). |

| | |
|---|---|
| Before | `Method: the threshold map` / `Method: the exposure series` |
| After | `Method: the licence thresholds` / `Method: the China share of revenue` |
| Why | Follows the renamed sections. |

| | |
|---|---|
| Before | … and the 3D specimens are procedural models built from published dimensions, not scans. |
| After | … and the 3D specimens are drawn by code from published dimensions, not scanned from real objects. |
| Why | "Procedural models" is a graphics term. Only this clause changed: the paragraph is still four sentences and still carries every fact (who made it, who did what, sources, specimens, not investment advice). |

### Footer

| | |
|---|---|
| Before | Compute Chokepoints · The AI chip supply chain, stage by stage · 2026-09-09 |
| After | … · Built 2026-09-09 |
| Why | A bare date does not say what happened on it. |

| | |
|---|---|
| Before | Every number on this site links to its source. Corrections and additions are welcome. Built with a dependency-free point-cloud renderer. No scans and no tracking. |
| After | Every number on this site links to its source. Corrections and additions are welcome. The 3D specimens are drawn by code, with no outside libraries and no scanned objects, and the site carries no trackers. |
| Why | Two sentence fragments, one of them ("No scans and no tracking") joining two unrelated claims, and "dependency-free point-cloud renderer" written for developers. Same three claims, in a sentence. |

Not changed: the geopolitics dek fallback string, which only renders if the geopolitics chapter is
missing from `content/`.

---

## src/app.js

### Browser tab titles

| | |
|---|---|
| Before | `Controls` / `China exposure` |
| After | `Export controls` / `China revenue share` |
| Why | Follows the tab and sub-tab names. |

### AI Chips panel

| | |
|---|---|
| Before | KPI `TDP`; row `TDP`; compare column `TDP` |
| After | `Power (TDP)` in all three |
| Why | The number is watts; the abbreviation is kept for readers who look for it. |

| | |
|---|---|
| Before | Compare column `Node` |
| After | `Process node` |
| Why | Matches the panel label and disambiguates "node". |

| | |
|---|---|
| Before | `Scale-up` / `Scale-out` |
| After | `Scale-up (inside a rack)` / `Scale-out (rack to rack)` |
| Why | Two of the most opaque terms on the page. The glosses are taken from the site's own glossary entries ("joins a few dozen accelerators inside one rack" / "joins thousands of accelerator groups into one cluster"), so no meaning is added or changed. |

| | |
|---|---|
| Before | `Target` |
| After | `Built for` |
| Why | The values are "Training and inference"; "Target" could be a market, a customer or a performance goal. |

| | |
|---|---|
| Before | `BOM estimate` |
| After | `Bill of materials, estimated` |
| Why | An unexpanded acronym in a label. Meaning unchanged. |

### Suppliers table

| | |
|---|---|
| Before | Column `Chokepoint` |
| After | `Chokepoint level` |
| Why | The cell values are Critical / Important / Contested / Diversified, which are levels; matches the filter. |

| | |
|---|---|
| Before | Link text `src` |
| After | `source` |
| Why | Developer shorthand in the reader's row. |

### Controls table

| | |
|---|---|
| Before | Column `Instrument` |
| After | `Legal instrument` |
| Why | On a site full of tools and metrology instruments, a bare "Instrument" points the wrong way. The values are ECCNs, CFR sections, ministerial orders and proclamations, so "legal" is exact; "rule" would not be (some rows are definitions). |

| | |
|---|---|
| Before | Column `Destinations and policy` |
| After | `Destinations and licence policy` |
| Why | The cell's second line is the licence policy (presumption of denial, case-by-case); "policy" alone is too broad. |

| | |
|---|---|
| Before | `40 of 40 thresholds` |
| After | `Showing 40 of 40 thresholds` |
| Why | Parallel with the suppliers count ("Showing 220 of 220 suppliers"), and a bare "40 of 40" reads as a score. |

### Exposure tooltip and table

| | |
|---|---|
| Before | China 32.9% of revenue … Click for the filing |
| After | China was 32.9% of revenue … Click to open the filing |
| Why | The figure is for a stated past fiscal year, so the verb belongs in the past. "Click to open" names the action and its result. |

| | |
|---|---|
| Before | Basis tags: `ship-to`, `bill-to`, `headquarters`, `licence seats`, `place of use`, `own units`, `customer location` |
| After | `counted where it ships`, `counted where it is billed`, `counted by headquarters`, `counted by licence seats`, `counted where it is used`, `counted by own units`, `counted by customer location` |
| Why | These sit under each firm's name with no frame. Trade shorthand ("ship-to", "bill-to") becomes a phrase that says what the firm did, and every tag now reads as an answer to "counted how?". Same meanings. |

### Geopolitics matrix note

| | |
|---|---|
| Before | Metric and year are shown under each segment. … / empty state: Matrix data is not loaded. |
| After | Each segment shows what is measured and in which year. … / empty state: The matrix has no data to show. |
| Why | A subject that does something, and "metric" replaced by plain words. The empty state described a loading mechanism rather than what the reader sees. |

### Search

| | |
|---|---|
| Before | Placeholder: Search chapters, glossary, suppliers, chips, events… |
| After | Search chapters, glossary, suppliers, chips, rules and events… |
| Why | The index also holds every export-control threshold, and rules are a main reason a policy reader searches. |

| | |
|---|---|
| Before | Empty state: Nothing matches. |
| After | Nothing matches. Try fewer words. |
| Why | Search requires every typed word to match, so the commonest failure has a fix the reader can act on. |

| | |
|---|---|
| Before | Button tooltip: Search (Ctrl+K) |
| After | Search the site (Ctrl+K, or press /) |
| Why | `/` already opens search and was undocumented. |

| | |
|---|---|
| Before | Result kinds `Control` / `Exposure` |
| After | `Export rule` / `China revenue` |
| Why | Against neighbours like "Chapter", "Glossary" and "Supplier", "Control" and "Exposure" do not say what the reader would be opening. |

Kept: `Type to search · Enter opens the first result · Esc closes`, and the result kinds
`Chapter`, `Essay`, `Glossary`, `Supplier`, `Chip`, `Event <date>`.

### Export bars

| | |
|---|---|
| Before | `19 rows · accelerators`, `40 rows · control thresholds`, `103 rows · China exposure by firm and year` |
| After | `19 rows · AI chips`, `40 rows · licence thresholds`, `103 rows · China revenue share by firm and year` |
| Why | Each dataset is now named the way its page is named. `Copy as CSV` / `Copy as JSON` / `Copied` / `Copy failed` kept: verbs, and they report what happened. |

### Cite this site

| | |
|---|---|
| Before | Plain: "Compute Chokepoints: a deep dive on the AI chip supply chain." BibTeX title: "Chokepoints: a deep dive on the AI chip supply chain" |
| After | Both: "Compute Chokepoints: the AI chip supply chain, stage by stage" |
| Why | Two bugs in one block: the BibTeX entry dropped "Compute" and cited the site under its old name, and the two forms disagreed. The new subtitle is the site's own line, already in the `<meta name="description">` and the footer, and it retires "deep dive". |

---

## Left alone, deliberately

- Hero title, hero subtitle, credits sentence: fixed by the client.
- `Contents` (heading, sheet heading and phone button): a control that names its destination, and the same word in all three places.
- `Skip to content`, `Back to top`, `Copy as CSV`, `All chips side by side`, `Who leads`, `Where it is made`, `Why substitution is slow`, `Concentration`, `In short`, `In plain terms`, `Specimen 05 · Lithography`, `You are here: Lithography, stage 4 of 15`, `Sources for this chapter (25)`, `No events in this category.`, the theme toggle's `Switch to dark mode`, and the suppliers and glossary search placeholders.
- `Dense compute`, `FP8 dense`, `Reticle-limited`: real distinctions where a plainer word would change the claim. All three are in the glossary.
- Browser-tab titles for the unbuilt views (`How a GPU is made`, `Methods`, `Summary A`, `Summary B`): their owners' prototype names.

## Open items for other owners

1. `Geo.activate()` in `app.js` reads `$('[data-view="geopolitics"]')`, which matches the masthead tab link before the section, so the geopolitics `data-caption` never renders; the globe's own caption shows instead. A selector fix (`section[data-view="geopolitics"]`) is outside a copy pass.
2. `README.md` and `HANDOFF.md` still call the first tab "The Stack" and the chapter card a "nameplate".
