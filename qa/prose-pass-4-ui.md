# Prose pass 4: the UI text

9 September 2026. Every string reviewed against `.claude/skills/writing-well/SKILL.md`.
Scope: the home page module, the Methods page, Export Controls, Sources, the chapter
furniture and the changelog summaries. Every edit below was followed by a clean
`node build/build.js` and checked in the browser at `http://localhost:8765/`.

Two strings were left untouched by instruction and verified in the rendered page:
the hero title "How AI chips are made" with its subtitle, and the credits sentence.

---

## 1. Home page — `build/modules/summary-a.js`

### 1.1 "Pick a country" sub-line

**Before.** Copper pins are the chain's nineteen chokepoint towns, taller pins for the harder stages; dark pins are the five towns building substitutes. Markers sit beside crowded coasts, joined to the country by a line.

**After.** Copper pins mark the chain's nineteen chokepoint towns, taller where the stage is harder to replace; dark pins mark the five towns building substitutes. Where a coast is crowded, the marker sits offshore on a line back to its country.

**Why.** "Are" twice for a legend that is describing what the pins *do*: "mark" is
the verb with the image. "The harder stages" does not say harder at what; "harder to
replace" is the thing the score measures and matches the wording of the chain head, so
the two legends now agree. The last sentence led with the abstract subject ("Markers")
and buried the condition; leading with "Where a coast is crowded" tells the reader why
before it tells them what. 44 words to 40.

### 1.2 "Chapter cards" renamed throughout the panels

**Before.** ... is named in fourteen of the 18 chapter cards. (and: the marker
`aria-label`, the country chip `title`, the legend line, the China block label)

**After.** ... is named on fourteen of the 18 chokepoint cards.

**Why.** "Chapter card" is a term the site never defines. "Chokepoint card" is the
label printed at the head of every chapter, so the reader has already met it and can go
and look at one. Also "named **on** a card", not "in" — you are named on a card.
Six places changed, so the page now uses one name for one object:

- the panel lede (both branches, with and without a share figure)
- the map marker `aria-label`, which had drifted to "named in N of the 18 chapters"
- the country chip `title`
- the map legend
- the China block label: "Where China stands, from the chapter cards" to
  "Where China stands, from the chokepoint cards"

### 1.3 Panel lede: the rank clause

**Before.** ... holds 72% of leading-edge logic manufacturing (≤5 nm), the largest share of any country, and ...

**After.** ... holds 72% of leading-edge logic manufacturing (≤5 nm), more than any other country, and ...

**Why.** Seven words to five, and "more than any other country" is how a person would
say it aloud. "The largest share of any country" also repeats "share", which the
percentage has already delivered.

### 1.4 Legend: the heavy-ring line

**Before.** Heavier ring: named by a stage scored 5 of 5

**After.** Heavier ring: named by a stage that scores 5 of 5

**Why.** "A stage scored 5 of 5" reads for a beat as though someone scored the stage
five times. The relative clause costs one word and removes the stumble.

### 1.5 Firms-and-towns footer: the category list

**Before.** 25 firms in the supplier list, mostly systems and servers, advanced packaging and OSAT, substrates and PCBs

**After.** 25 firms in the supplier list, led by systems and servers; advanced packaging and OSAT; substrates and PCBs

**Why.** Two problems. First, "mostly" claims a majority the data does not support:
the three names are the largest categories, not most of the firms. For the United
States they are three of a much longer tail. "Led by" is what is actually true.
Second, the categories themselves contain "and", so a comma list read as six items
("systems and servers, advanced packaging and OSAT, substrates and PCBs"). Semicolons
between the three make the grouping visible at a glance. Only the separator literal
changed.

### 1.6 The two exit cards

**Before.** Intro — Eight minutes, one plain paragraph per stage, with the 3D specimens.

**After.** Intro — Eight minutes: one plain paragraph per stage, each beside its 3D specimen.

**Why.** "With the 3D specimens" is a tack-on that does not say where they are. "Each
beside its 3D specimen" is the actual arrangement, and the colon after the reading time
makes the second half the explanation rather than a third item in a list.

**The Chain card: reviewed, no change.** "Every stage in full: 18 chapters, every
number linked to its source." One bold line, one sentence, a promise that contrasts
cleanly with the Intro card's. Nothing to cut.

### 1.7 Reviewed, no change

- **"Pick a country"** — an imperative, two words, says what to do.
- **"Also in the chain"** and **"Pinned on the map"** — the pair distinguishes the two
  chip rows in four words each.
- **"Marker area: how many of the 18 chokepoint cards name the country"** — "area"
  rather than "size" is deliberate: the marker diameter goes as the square root of the
  count, so area is the quantity that is proportional. "Size" would read easier and be
  wrong.
- **"No firm in the supplier list is based here"** — the empty-state line. Short, and
  the passive has no better actor.

---

## 2. Methods — `data/methods.md` and `build/modules/methods.js`

### 2.1 The length target: not reached, and why

**2,096 words before, 2,023 after: a 3.5% cut, not the fifth the brief asked for.**

The brief allowed this ("precision beats brevity where the two conflict"), but the
arithmetic is worth recording so nobody re-runs the exercise expecting a different
answer. Of the 2,023 words:

- **223 words are the score rubric table.** Five rows, each defining one band and
  naming the chapters that land in it. Every cell is the method.
- **about 150 words are the two source roll-calls** — the Tier A institutions and the
  named disallowed firms and titles. These are the policy itself; a reader checking
  whether a source is citable needs the names.
- **about 95 words are the per-dataset date rules** in "Dates", one clause per dataset.
- **about 175 words are the five coverage gaps**, one bullet each.

That leaves roughly 1,380 words of connective prose, and the tightening below took
about 70 out of it — a real 5% off the prose. Working against that, four acronym
expansions were **added** (see 2.3), which cost about 35 words. The page is close to
its floor: cutting a fifth from here means deleting a rubric band, a coverage gap, or
names from the source policy.

Both author placeholders were left byte-for-byte identical and verified after the
rewrite: the contact line and "Licence: to be confirmed by the author."

### 2.2 Sentence-level cuts

| Before | After | Why |
|---|---|---|
| Beside the chapters sit the datasets: the supplier list, the accelerator specs, the export-control timeline, the licence threshold map, the China share of revenue taken from company filings, and the glossary. The table further down counts them all. | Beside the chapters sit the datasets, every one of them listed with its file and its size in the table below. | The Datasets table lower on this same page lists every one of them with its filename and its row count. The prose enumeration was a worse copy of a table 1,200 words away. 39 words to 20, no fact lost. |
| Every chapter opens with a chokepoint card, and three fields on it carry judgment rather than measurement: ... | Three fields on every chapter's chokepoint card carry judgment rather than measurement: ... | The subject of the sentence is the three fields, not the card. Naming them first drops the throat-clearing clause. |
| Nothing on the site scores 1 or 2. The chain was chosen for its narrow points, and even the widest stage, systems and networking, still scores a 3. | Nothing here scores 1 or 2: the chain was chosen for its narrow points. | The table directly above says "Not used" against 1 and 2, and lists systems and networking against 3. The only new information in the sentence was the reason. 26 words to 13. |
| ... because TSMC does effectively all the CoWoS the leading accelerators need. **The test is the failure mode, not the calendar.** | (closing sentence cut) | The paragraph opens "The score is not the substitution clock in disguise" and then proves it with two examples. The closer restates the opener. Make the point and stop. |
| ... and he is answerable for all of them. **They are editorial judgments.** Where a chapter argues ... | ... and he is answerable for all of them. Where a chapter argues ... | The section is headed "Who owns these three numbers" and has just said a person set them under a brief. The reader knows they are judgments. |
| The sourcing rule is strict, and it is the site's strongest claim to being a reference. | The sourcing rule is strict, and it is what makes the site a reference rather than an essay. | "Strongest claim to being a reference" is a boast with no content. The replacement names the actual distinction, which is a claim a reader can test. |
| Everything else is disallowed. That includes every other analyst ... | Everything else is disallowed: every other analyst ... | "That includes" is three words of hinge for a colon. |
| law-firm client alerts, where the rule itself is cited instead | law-firm client alerts, where we cite the rule itself instead | Passive with a knowable actor. |
| The band is judged at the narrowest step inside the stage rather than on a headcount of the firms in it. | The band is judged at the narrowest step inside the stage, not on a headcount of its firms. | "Rather than on a headcount of the firms in it" is nine words for four. |
| Silicon and wafers also lists five leaders and is High, because those five firms stand behind the wafer market as a whole. | ... because those five stand behind the wafer market as a whole. | "Five firms" was named one clause earlier. |
| Concentration and the score are separate judgments, and one chapter shows the gap. Chip design and EDA is Extreme and scores a 4: three vendors each hold a different signoff step, but as the card puts it, ... | Concentration and the score are separate judgments. One chapter shows the gap: chip design and EDA (electronic design automation) is Extreme and scores a 4, because three vendors each hold a different signoff step but, as the card puts it, ... | The full stop lands the general point before the example starts, and "because" states the causal link the colon only implied. |
| It is written as a range in years | It runs as a range in years | Active, and one word shorter. |
| The sentence is rewritten to claim only what the allowed sources support. | We rewrite the sentence to claim only what the allowed sources support. | See 2.4. |
| The domain map behind the tags is a file you can read, `data/source-tiers.json`, served next to this page. | The domain map behind the tags is a file you can read: `data/source-tiers.json`. | "Served next to this page" is stated again under the Datasets table on the same page. |
| ..., and the matrix note repeats the reasoning rather than presenting the numbers as SK hynix's own measurement. | ..., and the matrix note repeats the reasoning. | The 70 words immediately before are that reasoning, including the point about it not being SK hynix's own measurement. |
| CUDA, compilers and kernels are the most-cited moat in AI compute and the chapters do not mention them. | CUDA, compilers and kernels are the most-cited moat in AI compute, and no chapter mentions them. | "The chapters do not mention them" to "no chapter mentions them": the negative moves to the subject and the verb goes active. |

### 2.3 Acronyms spelled out on first use

Four expansions added, at a cost of about 35 words. These run against the length
target and are worth it: each one is a concept the sentence depends on, and this page
does not run the glossary auto-linking that the chapters do, so an unfamiliar reader
has nowhere to click.

| Term | Now reads |
|---|---|
| CSET | "the semiconductor supply-chain work of CSET, the Center for Security and Emerging Technology" |
| CoWoS | "TSMC does effectively all the chip-on-wafer-on-substrate packaging (CoWoS) the leading accelerators need" |
| EUV | "three firms in the world supply extreme ultraviolet (EUV) mask blanks" |
| EDA | "chip design and EDA (electronic design automation) is Extreme and scores a 4" |
| HBM | "a new entrant in high-bandwidth memory (HBM) needs a stacking line and Nvidia's approval" |

**Deliberately not expanded**, and the reasoning, so the decision is reviewable:

- **The Tier A and disallowed roll-calls** (BIS, DOJ, MOFCOM, METI, JEDEC, UCIe,
  RISC-V, LBNL, CSIS, SIA, SEMI, WSTS, RAND, CFR, IFP, USGS, ETO, IDC, Gartner,
  TrendForce, Yole, Dell'Oro, Omdia). These are used as *names of sources*, not as
  concepts a sentence turns on. The reader has to recognise them, not understand them.
  Expanding all twenty-three would add well over 200 words to a page being cut.
- **TSMC, DRAM, PCB, IC.** Judged known to the policy reader, and each is in the
  glossary. Flagging rather than changing, in case the standard is meant to be absolute.
- **HBM, EDA and PCB inside the rubric table.** Their first appearance on the page is
  inside a table cell, where they are being used as chapter titles ("memory and HBM",
  "substrates and PCBs"). Expanding a chapter's name inside a list of chapter names
  would read as an error. The expansion happens at the first use in running prose.

### 2.4 The "three things happen" list made active

**Before.** 1. It is replaced. ... 2. It is deleted. The sentence is rewritten to
claim only what the allowed sources support. ... 3. The figure goes. A chart that
cannot be rebuilt from allowed sources is removed along with its marker and its data.

**After.** 1. We replace it. ... 2. We cut it. We rewrite the sentence to claim only
what the allowed sources support. ... 3. The figure goes. We delete a chart that
cannot be rebuilt from allowed sources, along with its marker and its data.

**Why.** Five passives in a row, in the one passage on the page describing what the
authors actually do when a source fails. The rest of the section says "we" ("We find
the filing", "We wrote them"), so the passive was also inconsistent. "It is deleted"
became "We cut it" because "deleted" and then "removed" in item 3 was the same verb
twice for two different acts.

### 2.5 Methods page headings and labels — `build/modules/methods.js`

| | Before | After | Why |
|---|---|---|---|
| Page dek | ... how estimates and relayed figures **are labelled**, what **the site** does not cover, and what changed when. | ... how **it labels** estimates and relayed figures, what **it** does not cover, and what changed when. | The dek is a list of what the page tells you. Three of the five clauses had "the site" as the actor; making one active and pronouning the other keeps the parallel and drops the passive. |
| Method notes intro | Four datasets carry a note on how they were built, including where their numbers are weakest. **They used to sit at the foot of the Sources page.** Open one to read it. | Four datasets carry a note on how they were built, and on where their numbers are weakest. Open one to read it. | Where the notes used to live is site history, and the changelog on this same page already records the move. It told the reader nothing about the notes. |
| As-of intro | Word counts and source counts **are measured** at build time from the chapters themselves, so this table cannot drift ... | **The build counts** the words and the sources from the chapters themselves, so this table cannot drift ... | Names the actor, and the whole point of the sentence is that a machine does the counting. 23 words to 21. |
| Chapter table foot | The count is taken at build time, so **it is this copy's own audit rather than a claim about an earlier one.** | The count is taken at build time, so **it audits this copy rather than an earlier one.** | "Is ... an audit" to "audits". 14 words to 9. |
| Dataset table foot | ... so `data/exposure.json` and the rest **can be fetched** directly. | ... so **you can fetch** `data/exposure.json` and the rest directly. | The reader is the actor. |

**Reviewed, no change:** the four collapsed note summaries ("The China share of
revenue", "The country-share matrix", "The licence thresholds", "The accelerators,
chip by chip"), each paired with its filename; both table captions ("Chapters, as of
2026-09-09"); the changelog heading and its intro, which admits in one plain sentence
why every date is the same day.

---

## 3. Export Controls — `src/template.html`

### 3.1 Timeline: a wrong date fixed

**Before.** Heading: "What the rules did, dated". Intro: "Every export-control move
**since 2019** that touched the AI chip chain, in plain words and in order: the United
States, the Netherlands, Japan and China. Filter by type."

**After.** Heading: "Every move since 2018, in order". Intro: "Every export-control
move that touched the AI chip chain, in plain words: rules from the United States,
countermeasures from China, and the Dutch and Japanese controls beside them. Filter by
type."

**Why.** Three things.

1. **The date was wrong.** The first row in `data/export-controls-timeline.json` is
   15 April 2018, the ZTE denial order; the second is Fujian Jinhua's Entity List
   addition on 30 October 2018. Eight of the 43 events predate 2019. The Methods page
   says "no history of the industry before the export controls of 2018", so the page
   also contradicted itself.
2. **The heading repeated the sub-tab** word for word. The tab above already reads
   "What the rules did"; the heading now carries the span and the ordering instead.
3. **The flat list of four countries** implied four equal parties. The counts are
   27 US moves, 8 Chinese, 3 Dutch, 1 Japanese, and the rest corporate. Naming the
   shape ("rules from ..., countermeasures from ..., and the Dutch and Japanese
   controls beside them") is both shorter to read and closer to what the timeline holds.
   "The United States" is spelled out rather than abbreviated on its first use here.

### 3.2 Thresholds

**Before.** Heading: "Licence thresholds". Intro: "Every number that decides whether a
chip or a tool needs an export licence: what is measured, **the value, where the rule
applies**, whether it is still in force, and the rule that set it. Filter by regime."

**After.** Heading: "The numbers that trigger a licence". Intro: "... what is measured,
**the limit, where it applies**, whether it is still in force, and the rule that set it.
Filter by regime."

**Why.** The heading was the sub-tab label repeated exactly. "The value" is the vaguest
possible word for what is in that column; "the limit" is what a threshold is. "Where
the rule applies" says "rule" one clause before "the rule that set it" — the pronoun
removes the collision. "Whether it is still in force" kept: that is the term of art a
policy reader wants, and no plainer phrase is as exact.

### 3.3 China revenue share

**Before.** The ranking **compares** each firm's first year on file **with** its latest;
the panels below trace every year against the three US rule dates. Hover a point for
the filed figures, click it to open the filing.

**After.** The ranking **sets** each firm's first year on file **against** its latest;
the panels below trace every year against the three US rule dates. Hover a point for
the filed figures, **or** click it to open the filing.

**Why.** The chart is a dumbbell: two dots joined by a bar, first year against latest.
"Sets against" is what the picture does; "compares with" would fit any chart at all.
The comma splice in the last sentence made hovering and clicking sound like one act;
they are two, and the dots are wrapped in links to the filings.

An earlier draft of this line named the three dates (October 2022, October 2023,
December 2024). **Reverted:** the small-multiples legend a few centimetres below
already prints "US export rules of Oct 2022, Oct 2023 and Dec 2024", and repeating them
in the intro was 12 words of duplication.

### 3.4 Reviewed, no change

- The three sub-tab labels — "What the rules did", "Licence thresholds", "China
  revenue share". Plain, parallel, and each distinguishable at a glance from the other
  two. "What the rules did" is the only one that promises a reading rather than a
  table, which is correct: it is the only narrative section.
- The exposure heading "China share of revenue, from company filings" — unlike the
  other two headings it adds something the tab does not (the provenance), so it stays.

### 3.5 Not changed, out of the file allowlist — for whoever owns `build.js`

Two Export Controls strings named in the brief turned out to live in `build.js` rather
than `template.html`, outside the four literals this pass was allowed to touch there.
Both are flagged, not edited:

- **The page dek** (`CONTROLS_DEK`, `build/build.js`). Currently: "40 licensing
  thresholds across 7 regimes, and the China share of revenue for 20 firms that sell
  controlled tools or chips, taken from their own filings." Suggested: "**40 licence
  thresholds** across seven regimes, and the China share of revenue for 20 firms that
  sell controlled tools or chips, from their own filings." — "licensing thresholds"
  should match the "licence thresholds" used on the sub-tab and everywhere else on the
  site; "7" should be spelled as a word beside "20" or neither should be; "taken from"
  is two words for "from".
- **The note under the exposure table** (`EXPOSURE_NOTE`, `build/build.js`). Its last
  sentence, "Method notes are on the Sources page", is **stale**: the four dataset
  method notes moved to the Methods page, which is what the Methods page and the
  changelog both now say. The link should point at `#/methods`.

---

## 4. Sources, chapter furniture — `src/template.html` and `build/build.js`

### 4.1 Sources dek

**Before.** Every number on this site links to where it came from. The full list
follows, chapter by chapter. How the sources are graded, how the chokepoint score is
judged, and what changed when are on the Methods page.

**After.** Every number on this site links to the document it came from. The full list
follows, chapter by chapter. The Methods page says how sources are graded, how the
chokepoint score is judged, and what changed when.

**Why.** "Where it came from" could be a page, a claim, an anecdote; "the document it
came from" is the promise the site actually keeps. The third sentence had a
27-word subject before its verb ("How ... and what changed when **are** on the Methods
page"), which is the kind of sentence you have to read twice. Putting the Methods page
first makes it a subject doing something.

### 4.2 Sources tier key

**Before.** Every source is one of two kinds: **A** primary or institutional (company
filings and investor materials, governments and regulators, standards bodies,
universities and labs, and research institutions such as CSET, CSIS, SIA, SEMI and
Epoch AI) · **B** one of four named exceptions: SemiAnalysis, Reuters, the Financial
Times and Nikkei Asia. Nothing else is cited.

**After.** Every source here is one of two kinds. **A** primary or institutional:
company filings and investor materials, governments and regulators, standards bodies,
universities and national labs, and research institutions that publish their methods.
**B** four named exceptions: SemiAnalysis, Reuters, the Financial Times and Nikkei
Asia. Nothing else is cited.

**Why.** 63 words to 48, and one problem solved. The parenthesis held four
unexpanded acronyms (CSET, CSIS, SIA, SEMI) on a page where they appear nowhere else,
so a reader met them cold; spelling out all four would have doubled the key.
Replacing the four examples with the criterion they satisfy — "research institutions
that publish their methods" — is what the reader needs to judge the tier, and the full
named list is on the Methods page one click away, which the dek directly above already
points to. Two sentences instead of one clause chain with a middot in the middle.
"One of four named exceptions" to "four named exceptions": the "B" tag has already
said this source is one of them.

### 4.3 The chain head

**Before.** One bar per stage. The taller the bar, the harder that stage **would be**
to replace: the chokepoint score, 1 to 5.

**After.** One bar per stage. The taller the bar, the harder that stage **is** to
replace: the chokepoint score, 1 to 5.

**Why.** The conditional hedges a claim the site is willing to make flatly everywhere
else. Two words to one. This wording is now also the wording of the map legend on the
home page.

### 4.4 Previous / Next — reviewed, no change

The labels are "Previous" and "Next", each sitting above the chapter's number and
title ("PREVIOUS / 04 Chemicals, Gases and Photoresist"). Nothing to strip, and the
enclosing `nav` already carries "Previous and next chapter" for screen readers, so
padding the visible label to "Previous chapter" would only repeat it.

### 4.5 Chapter-head labels — reviewed, no change

All eleven were read against the standard in the rendered chapter. They pass:

| Label | Verdict |
|---|---|
| In plain terms | Says exactly what the box contains, in the reader's words. |
| In short | Three syllables for a summary. Nothing shorter is clearer. |
| Chokepoint card | The site's own object, now also the term the home page uses (1.2). |
| Concentration | One word, defined on the Methods page, used consistently. |
| Substitution time | Names the quantity, not the judgment. |
| Price or market size | Ungainly, and correct: the field holds a tool price on some cards and a market size on others, and any single-word label would be wrong on half of them. Kept for that reason. |
| Who leads | Question form, two words, active verb. |
| Where it is made | Plain, and parallel with "Who leads". |
| Why substitution is slow | States the answer's shape before the answer. |
| Where China stands | Parallel with the one below it. |
| Where the US stands | Parallel with the one above it. |

---

## 5. Changelog summaries — `data/changelog.json`

All 21 entries reviewed; 8 rewritten. The test applied to each: plain, past tense, one
line. Entries not listed below already passed — including "Renamed the site Compute
Chokepoints.", which is the model the others were edited towards.

| # | Before | After | Why |
|---|---|---|---|
| 1 | Added **this** Methods page: the chokepoint scoring rubric, the sourcing rule with the four Tier B exceptions named, how estimates and relayed figures are labelled, the coverage statement, and the four dataset method notes moved here from the foot of the Sources page. Added a print stylesheet so a printed chapter keeps its sources and its charts. | Added the Methods page: the scoring rubric, the sourcing rule, how estimates are labelled, what the site does not cover, and the four dataset notes moved from the Sources page. Added a print stylesheet that keeps a chapter's sources and charts on paper. | 58 words to 42. "This Methods page" points at where the entry happens to be displayed; a log entry should read the same anywhere. "The coverage statement" is internal vocabulary — "what the site does not cover" is the section's own heading. |
| 2 | Opened the build to modules, so new pages **can be added** without touching the main build script. | Opened the build to modules: a new page no longer means editing the main build script. | Passive with no actor, in an entry about who can now do what. |
| 3 | Rebuilt the site for phones. The specimen became ... | Rebuilt the site for phones: the specimen became ... | Two sentences to one line, which is the format for the rest of the log. |
| 4 | **AI Chips now draws** every package from above, turning in its own plane, so one chip's die and memory layout **can be compared with** another's. | **Redrew** every package on AI Chips from above, turning in its own plane, so one chip's die and memory layout **sit beside** another's. | The only present-tense entry in the log, and the only one that opened with a feature name rather than a verb. The passive "can be compared with" also became a plain image. |
| 5 | ... a CSV export that dropped any field **absent from** the first row. **The datasets are now served as** files next to the page. | ... a CSV export that dropped any field **missing from** the first row. **Started serving** the datasets as files beside the page. | Present tense to past, matching every other entry. "Absent from" to "missing from". |
| 8 | Summary cards **now lead** with the one-liner ... Every specimen caption **was rewritten** ..., and chapter 1 **shows** the wafer. | **Made** the summary cards lead with the one-liner ... **Rewrote** every specimen caption ..., and **put** the wafer on chapter 1. | Three tense and voice faults in two sentences: present, passive, present. |
| 10 | Chapters and datasets **now stand** at zero disallowed citations. ... **An audit script checks** the datasets on every run. | Chapters and datasets **came out** at zero disallowed citations. ... **Added an audit script that checks** the datasets on every run. | Same fault. The last sentence described a standing state; the log records what was done. |
| 13 | Built the licence threshold map, **every quantitative line** in the US, Dutch, Japanese, EU and Chinese regimes ... | Built the licence threshold map, **every number that triggers a licence** in the US, Dutch, Japanese, EU and Chinese regimes ... | "Every quantitative line" is the vocabulary of whoever built the dataset, not of anyone reading the log. The replacement is the wording now used as the Thresholds heading (3.2), so the two agree. |

Four entries are still long (46 to 68 words): the phone rebuild, the reader-test
fixes, the source-rule tightening and the design port. Each is a list of distinct
facts — seven separate defects in the reader-test entry, four in the source-rule
one — and the only way to shorten them is to drop a fact or split one entry into
several rows, which would change the data rather than the summary strings this pass
owns. Left as they are.

---

## Verification

`node build/build.js` run after every edit; no warnings at any point. Final run:
322 Tier A citations, 22 Tier B, 0 disallowed, 0 unclassified — unchanged from the
start of the pass, so no citation was disturbed. 21 changelog entries before and
after.

Rendered and read in the browser at `http://localhost:8765/`: the home page (map
legend, the Taiwan, United States, China, Singapore and United Kingdom panels, both
exit cards, the credits line), Methods (prose, the four collapsed notes, both tables
and their feet, the changelog), Export Controls on all three sub-tabs, Sources (dek and
tier key), and chapter 05 Lithography (the "In plain terms" box, "In short", the full
chokepoint card and the Previous/Next pair).

Hero title, subtitle and credits sentence confirmed byte-identical in the rendered
page. Both Methods placeholders confirmed intact.

## Left for others

- `CONTROLS_DEK` and `EXPOSURE_NOTE` in `build/build.js` — see 3.5. The exposure note
  contains a stale pointer to the Sources page and should be corrected by whoever owns
  those literals.
- **Supplier category names** surface in the home-page footer sentence and read oddly
  there: "led by AI accelerator vendor; interconnect and networking; optics and
  photonics". "AI accelerator vendor" is singular in a list of plural categories, and
  "OSAT" is never expanded on the home page. These come from `category` in
  `data/suppliers.json`, not from any string in this pass's files.
- **Mixed number styles** in the panel lede: "named on fourteen of the 18 chokepoint
  cards" spells one number and prints the other. The spelled form comes from `ctx.word`
  and the numeral from `chapters.length`, so making them agree is a code change.
