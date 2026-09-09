# Compute Chokepoints — information architecture critique

Read-only review, 9 September 2026. Reviewed against the stated ambition: "the one step, one place for
everybody to learn about compute", for curious generalists, think-tank researchers and policymakers.
Evidence is from `http://localhost:8765/` (build of 2026-09-09T16:25) and the repository. No files were
changed and the build was not run.

---

## 1. Executive critique

**The material is here. The architecture assumes everyone reads it end to end.**

The site is one HTML document 125,952 pixels tall, 22,431 words of chapters, 344 sources, seven datasets,
nine tabs and nineteen 3D specimens. The writing is good and the sourcing is unusually disciplined —
322 Tier A citations, 22 Tier B, nothing else. The problem is not the content. It is that the site offers
exactly one shape — a book read in process order — to three audiences with three different errands.

**Nothing on the first screen tells anyone where to go.** At 1024×768 a first-time visitor sees the
masthead, a rotating specimen, the thesis "Fifteen stages. Seven chokepoints.", the subtitle "Who makes
the AI chip, and who could stop it.", and then immediately "The chain, scored / Bar height is the
chokepoint score, 1 to 5." Below that sits a Contents grid 2,201 pixels tall holding roughly 100 links.
There is no sentence saying what this is, who it is for, how long it takes, or what to read first. The
hero is beautiful and it is a dead end: it makes a claim and offers no door. A reader who arrived from
the query "how GPUs are made" is given a bar chart of chokepoint scores.

**The plain-English site already exists and is never assembled.** Every chapter's front matter carries a
`plain` field — a full, jargon-free paragraph. Chapter 5 opens "Lithography is photographic printing,
shrunk." Chapter 1: "Building an AI chip … is like building a car in which the engine, the gearbox and
the wheels each come from a single factory somewhere in the world." Eighteen of these, in process order,
are a ~1,900-word, eight-minute walk from sand to rack. They render only inside each chapter under
"In plain terms". The Summary page does not use them: `build.js:414-416` builds each card from
`oneLiner` + `inShort` (the Takeaways), so Summary is the *conclusions* page, not the *plain-language*
page the README claims. The single highest-value change on this list is to collect the eighteen `plain`
paragraphs into one page and make it the front door.

**The site's own cross-references are not links.** Chapter 5: "The stencil is a photomask, the film is
photoresist, and the machine is a scanner (see Photomasks and pellicles, and Deposition and etch)."
Chapter 17: "See Advanced packaging on why that capacity binds first." Chapter 12: "see Test and
assembly", "see Substrates and PCBs". I counted 13 such phrases across 18 chapters and **none of them is
a link**. A scan of `.prose a[href^="#"]` in four chapters returns zero internal links other than
heading permalinks. What the brief calls "chapter cross-links" is 255 copies of the same chain strip —
every chapter header repeats all fifteen stage links — plus thirteen dead mentions. Lateral movement
through the argument is not possible.

**Trust architecture stops one field short of where it matters.** Every factual sentence carries a
source; the Sources page carries method notes for the country-share matrix, the threshold map and the
exposure series. But the four numbers on the nameplate — chokepoint score, concentration, time to
substitute, cost signal — are the only unsourced figures on the site, and they are the ones the hero,
the chain strip, the rail and the Summary are all built from. Chapter 1 admits as much: "Substitution
time. Our estimate of how long a well-funded state or firm would need to stand up an alternative. It is
the most opinionated number on the card." There is no rubric anywhere — `grep chokepointScore` across
`brief/`, `build/`, `src/` and `data/*.md` finds the field and never a definition of what earns a 4
versus a 5. A researcher asked to cite "Lithography, 5/5" cannot say what 5 means.

Alongside that: there is no about page, no change log, no per-page or per-dataset "last updated" (the
footer prints a bare build date, `new Date()` at build time, labelled nothing), no version, no licence
(no `LICENSE` file, no statement on the site), no contact — the footer says "Corrections and additions
are welcome" and offers no address; there is no `mailto:` and no repository link anywhere in
`dist/index.html`. There is no coverage statement saying what the site does not cover. And `dist/`
contains two files, `index.html` and `build-report.txt`: a researcher invited to "Copy as CSV" cannot
download anything, the Suppliers table offers CSV but not JSON, and the 74-term glossary offers neither.

**A shared link is a bad link and a search engine sees one page.** `dist/index.html` has no
`og:`, no `twitter:`, no `rel=canonical`, no JSON-LD, no favicon; there is no sitemap and no robots.txt.
`document.title` changes per *view* (`app.js:211`) but not per *chapter*: `#lithography`,
`#lithography--the-chokepoint` and `#/nonsense-route` all title the page "Compute Chokepoints". Every
one of the site's 18 chapters, 74 glossary terms and 220 supplier rows shares a single URL, a single
title and a single description.

**Search cannot answer the question the site is named for.** The index is a plain AND-substring match
over a flat `hay` string (`app.js:~530`), unranked and unweighted. Typing "how a gpu is made" returns
"Nothing matches." So does "timeline", even though a 43-event export-control timeline is one tab away.
Searching "EUV" returns Silicon and Wafers' "Key evaluation criteria" first and the Lithography chapter
sixth. Tabs and views are not in the index, so you cannot search your way to Suppliers or Controls.

**Nine tabs, and two of them are the same page.** "Exposure" and "Controls" both render the section
headed "THE CONTROLS", which already carries its own subtab bar reading "Threshold map / China exposure,
from filings". Meanwhile the things all three audiences need — a start page, a method page, a data page,
an about page — have no home at all.

**Accessibility is close, with one systemic light-mode fault.** Composited contrast testing found 19
distinct failing text styles in light mode and **zero in dark mode**. Every light-mode failure traces to
one token: `--muted: #667079`, which lands at 4.38:1 on `--bg` and 4.07:1 on `--bg-2` against a 4.5:1
requirement. It is used for figure captions, the chain key, reading-time labels, "NEXT: 03 SILICON AND
WAFERS", nameplate labels ("WHO LEADS", "CONCENTRATION"), the cost-signal sub-line, supplier vendor
lines, timeline dates and the whole footer. One hex value fixes almost all of it. Separately, 201
elements render at 9.5px or smaller, including every chain-strip label at 8.5px. There is no
`lang` attribute on `<html>` and no skip link, in a document with 2,097 focusable elements. Motion
handling, by contrast, is exemplary and should be left alone: `prefers-reduced-motion` disables the
specimen spin, the scroll-linked rotation, the stage transition and smooth scrolling.

**Coverage gaps for "everybody learns about compute."** Searching the chapter corpus: "CUDA" — zero
hits. "software stack", "PyTorch", "Moore's law", "depreciation", "cost of a fab", "talent", "hiring",
"emissions", "recycl" — zero hits each. "workforce" appears once. "ultrapure water" appears once. There
is no history of the industry before the 2018 export controls, no fab economics (what $20bn buys, cost
per wafer by node, utilisation, depreciation), no water or fab-energy chapter, no workforce chapter, no
software and compiler layer, and no reading list. The software stack in particular is the most-cited
moat in AI compute and the site does not mention it.

**What is working, and should be protected:** the process-order spine; the specimen beside the text; the
source policy and tier tags; the `plain` paragraph on every chapter; the reduced-motion handling; the
dark palette; the method notes that do exist; the Controls threshold table; the export bars on five
datasets; heading permalinks; and the restraint of the hero.

---

## 2. Proposed site map

### 2.1 Top-level tabs: 9 → 7

| Now | Proposed | Why |
|---|---|---|
| — | **Start here** (`#/start`) | The missing front door. Default landing. |
| The Stack | **The Chain** (`#/chain`) | "Stack" reads as software (LAMP stack, tech stack) to exactly the generalist the site wants. "The Chain" matches the site's own language: "The chain, scored", "The chain in one paragraph", "the chain that serves it". |
| Summary | folded into **The Chain** as a `Cards \| Read` toggle | Summary is 100% duplicated: each card is `oneLiner` + `inShort`, both rendered verbatim at the top of the chapter. It is an index of the same tab, not a peer of it. Keep the route `#/briefing` as a redirect. |
| AI Chips | **Chips** | Unchanged in substance. |
| Suppliers | **Suppliers** | Unchanged. Add a link from each row's category to its chapter. |
| Geopolitics | **Geopolitics** | Unchanged: essay + matrix + timeline. |
| Controls | **Controls** (`Thresholds \| Exposure`) | Unchanged. |
| Exposure | **removed from the top bar** | Already a subtab of Controls; both routes render an `<h2>` reading "THE CONTROLS". Keep `#/exposure` working. |
| Glossary | into **Reference** | |
| Sources | into **Reference** | |
| — | **Reference** (`Glossary \| Sources \| Method \| Data \| About`) | The home for everything a reference site needs and this one lacks. |

Result: `Start here · The Chain · Chips · Suppliers · Geopolitics · Controls · Reference` + search + theme.
Two fewer items in the bar, and the tab strip stops needing an invisible horizontal scroller on a phone.

### 2.2 New page: Start here

One screen, then one long walk. Contents:

1. **What this is**, in three sentences, with the honest size: "18 chapters, 22,000 words, about 100
   minutes. Or take the eight-minute version below."
2. **Three doors**, labelled by errand, not by job title:
   - *"I want to know how a GPU is actually made"* → the walk below.
   - *"I need one trustworthy reference on the chain"* → The Chain (Cards), the datasets, the method
     page, the citation block.
   - *"I need to understand this before I regulate it"* → the seven 5/5 chokepoints, the threshold map,
     the country-share matrix, "what a control actually bites".
3. **How a GPU is made, in eighteen paragraphs.** Assembled from the existing `plain` field, in process
   order, each with the stage number, the chokepoint pip, the specimen thumbnail, and "read the full
   chapter →". This is the page that should answer `howgpusaremade.com`. It requires no new writing.
4. **How to read a nameplate** — the three bullets currently buried in chapter 1 under "How to read this
   site", plus a link to the new scoring rubric.
5. **What this site does not cover** — a short, honest list, and where to go instead.

### 2.3 New page: Reference

Five subtabs, four of them new:

- **Glossary** — as today (74 terms, each already linked to its chapter; keep that). Add an export.
- **Sources** — as today, but with real bibliography entries. Today each line is a bare URL: the first
  entry renders as `A https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year`.
  A researcher needs author, title, publisher, date, and a "last checked" date.
- **Method** (new; promoted, not rewritten) — the three method notes that already exist, plus the one
  that does not: **the chokepoint scoring rubric**. What earns 1, 3, 4, 5; how concentration is banded
  (Extreme / High / Moderate / Low); how "time to substitute" is estimated and what its error bars are;
  what "cost signal" is and is not. Every nameplate and every chain bar links here.
- **Data** (new) — a table of the seven datasets with row counts, field-by-field data dictionary
  (`brief/DATA_SCHEMAS.md` is most of it already), coverage and known nulls, licence, and **file
  downloads**: `.json` and `.csv` per dataset, plus one archive. Today `dist/` holds only `index.html`
  and `build-report.txt`.
- **About** (new) — who made it and how (the existing "How this site was made" text moves here), the
  source policy in the reader's words, a **change log** with dated entries, a version number, a
  **corrections address**, a **licence** for text and data, and the coverage statement.

### 2.4 Chapter template: layer it

The current template is one length for three readers: nameplate → In short → In plain terms → lede →
How it works → Variants → Who makes it → The chokepoint → Key evaluation criteria → sources. Chapter 5
renders 8,133 pixels tall. A staffer who needs lithography before a 3pm meeting must scroll past
"Deep ultraviolet", "Extreme ultraviolet" and "High-NA EUV" to reach "The chokepoint".

Render three tiers from the same front matter, with a `Brief | Full` toggle in the chapter header:

- **Brief** (one screen, ~250 words): title · `oneLiner` · `plain` · the three nameplate KPIs · "The
  chokepoint" · the three leaders · "read the full chapter". Serves the policymaker and the skimmer.
- **Full** (default for The Chain in Read mode): today's chapter, minus the repeated chain strip.
- **Data** (a `<details>` at the foot, closed): `keyFacts` with sources, every figure's underlying
  numbers, the chapter's source list, and per-chapter export. Serves the researcher.

Two structural edits inside the chapter, whichever tier is showing:

- **End on the argument, not the checklist.** Chapters currently close with "Key evaluation criteria" —
  a five-bullet technical rubric. Move it above "The chokepoint" or into the Data tier, so the last
  thing a reader sees is the point.
- **Replace the per-chapter chain strip.** Every chapter header repeats all fifteen stage links. Replace
  it with the "you are here / next" line it already carries ("YOU ARE HERE: LITHOGRAPHY, STAGE 4 OF 15 /
  NEXT: 06 PHOTOMASKS AND PELLICLES") plus a "previous" link and 2–3 *related* chapters drawn from the
  cross-references. Removes ~240 redundant tab stops and gives the site the lateral links it lacks.

### 2.5 Duplication audit

| Content | Appears in | Verdict |
|---|---|---|
| `oneLiner` | chapter head, Summary card, Contents hover | Keep. It is the index line. |
| `inShort` (= Takeaways) | chapter "In short", Summary card | Keep, but this makes Summary an *index*, not a page. Fold it into The Chain. |
| `plain` | chapter "In plain terms" only | **Under-used.** Should also build the Start-here walk. |
| Chain strip (15 links) | hero, fixed rail, ×17 chapter headers | **Cut to two.** Hero + rail is enough. |
| Contents grid (~100 links) | home page, below the chain strip | Move below the chapters or into Start here; it is not an orientation device. |
| Method notes | bottom of a 52,000-character Sources page | Promote to Reference → Method. |
| Exposure | its own tab *and* a Controls subtab | Merge. |

### 2.6 Does the chain strip earn its place in the hero?

Yes — but not in its current form. It is the site's best single idea: fifteen stages in process order,
bar height = chokepoint score, seven bars at full height. It is the whole argument in one glance. Three
fixes:

1. **Label it as a judgment.** "Bar height is the chokepoint score, 1 to 5" states a fact about the
   drawing, not about the number. Say who scored it and link the rubric.
2. **Fix the arithmetic.** The hero says "Fifteen stages", chapter 1's one-liner says "Eighteen stages",
   the Contents lists 18 items, The Stack renders 17 chapters, and the strip has 15 cells (02–16;
   Introduction, Component Costs and Geopolitics are excluded without explanation). Pick one number and
   say what the others are.
3. **Give it a destination.** Every bar is a link to a chapter 29,000 pixels away. On the first screen it
   should also be able to open the Brief.

---

## 3. Fifteen revisions, ranked

Effort is calendar effort for one person: **hour** / **day** / **week**.
Audience: **G** generalist · **R** researcher · **P** policymaker.

| # | Revision | Effort | Serves | Why it ranks here |
|---|---|---|---|---|
| 1 | **Build "How a GPU is made" from the 18 existing `plain` paragraphs** and make it the Start-here spine and the `howgpusaremade.com` target. No new writing — the text is already in front matter and rendered nowhere but inside each chapter. | day | **G** R P | The stated ambition's first audience currently has no entry point, and the answer is already written. |
| 2 | **Publish the chokepoint scoring rubric** as Reference → Method; link it from every nameplate, every chain bar and every Summary card; label score / concentration / time-to-substitute as editorial estimates. | day | R **P** G | The four most load-bearing numbers on the site are the only unsourced ones. Chapter 1 calls substitution time "the most opinionated number on the card" and never defines it. |
| 3 | **Make cross-references clickable.** Link the 13 "see X" phrases; add prev/next/related to every chapter foot; render the `chapter` field that already exists on all 40 rows of `control-thresholds.json` as a "Stage" column linking to the chapter; link supplier categories to chapters. | day | **P** R G | Zero internal prose links today. This is the controls-to-chapter map, and half the data is already there and simply not rendered. |
| 4 | **Darken `--muted` in light mode; raise 8.5px labels to ≥11px; add `lang="en"` and a skip link.** | hour | **G R P** | 19 failing text styles, all from one hex value; dark mode already passes. Cheapest large win on the list. |
| 5 | **Fix search.** Weight title and one-liner above body; index tab and section names; add aliases ("gpu", "how it's made", "timeline", "chip war"); never return "Nothing matches" for the site's own subject. | day | **G** R P | "how a gpu is made" → "Nothing matches." "timeline" → "Nothing matches." "EUV" ranks Lithography sixth. |
| 6 | **Real URLs.** Prerender one page per chapter and per view with its own `<title>`, description and `rel=canonical`; add `og:`/`twitter:` with a specimen image; sitemap; favicon; per-chapter title on hash routes as a stopgap. | week | **G R P** | One URL, one title, one description for 18 chapters, 74 terms and 220 suppliers. Already flagged in `HANDOFF.md`; it is the difference between findable and invisible. |
| 7 | **Add the Reference hub**: about, method index, change log with dated entries, version, corrections address, licence, coverage statement ("what this site does not cover"). | week | **R** P G | No about, no changelog, no last-updated, no licence, no contact — "Corrections and additions are welcome" with no address, no `mailto:`, no repo link. |
| 8 | **Ship the data as files.** `.json` + `.csv` per dataset in `dist/`, one archive, a field-level data dictionary (mostly `brief/DATA_SCHEMAS.md`), plus "Copy as JSON" on Suppliers and an export on Glossary. | day | **R** P | `dist/` holds two files. Clipboard-only export is unusable for 220 rows and impossible to cite. |
| 9 | **Restructure the top bar**: add Start here, merge Exposure into Controls, fold Summary into The Chain as a `Cards \| Read` toggle, group Glossary + Sources + Method + Data + About under Reference. | day | **G R P** | Nine tabs, two of which are the same page; and the four pages every audience needs have no home. |
| 10 | **Layer the chapter** with a `Brief \| Full` toggle; Brief = `plain` + KPIs + "The chokepoint"; move "Key evaluation criteria" out of the closing position. | week | **P** R G | Chapter 5 is 8,133px. A staffer needs one screen and cannot get one. |
| 11 | **Remove the per-chapter chain strip**, keep the fixed rail and the "you are here / next" line; restore a compact rail below 900px, where `.rail` is `display:none`. | day | **G R P** | 15 links × 17 chapters = ~255 duplicate tab stops; mobile loses in-page navigation entirely. |
| 12 | **Write the three missing chapters**: the software stack (CUDA, compilers, kernels — currently zero mentions in the corpus); fab economics (what $20bn buys, cost per wafer by node, utilisation, depreciation); water, power and the fab's footprint ("ultrapure water" appears once). | week each | **G** P R | "Everybody learns about compute" cannot skip the software moat or what a fab costs. |
| 13 | **Reconcile the stage count** — 15 (hero) vs 17 (chapters) vs 18 (Contents, chapter 1's one-liner, Summary) vs "17 component chapters" (README) — and say why Introduction, Component Costs and Geopolitics sit outside the strip. | hour | **R P** G | A reference site that cannot count its own stages invites doubt about everything else. |
| 14 | **Give the Sources page a bibliography**: author, title, publisher, date and a "last checked" date per entry, rather than 344 bare URLs; add per-dataset "as of" dates and replace the unlabelled build date in the footer. | week | **R** P | "Every number on this site links to where it came from" is true; a citable reference list is what turns that into something a researcher can use. |
| 15 | **Mobile tab strip and reading spine.** `.tabs` is `overflow-x: auto` with `scrollbar-width: none`: nine tabs plus search plus theme collapse into an invisible scroller. Add an edge fade or collapse to a menu; and give the sticky specimen (309px of a 812px phone screen) a collapse control. | day | **G** R P | Most "how are GPUs made" traffic arrives on a phone. |

**Add a reading list** (CSET, SIA/BCG, ETO, Epoch AI, the primary filings) inside item 7 — an hour of
work that costs nothing and is the first thing a researcher looks for.

---

## 4. What must not change

1. **Process order as the spine.** Sand to rack, one chapter per stage, is the correct organising idea
   and the reason the site can serve three audiences from one body of work. Every proposal above is a
   different door onto the same corridor.
2. **The specimen beside the text.** It is the site's signature and it is doing real explanatory work
   ("Right: an EUV scanner in cross-section. Tin plasma source at the bottom left…"). Do not turn it into
   decoration and do not add the rejected drag-to-rotate.
3. **The source policy and the tier tags.** Tier A plus four named exceptions, 322/22/0, per-sentence
   citations, and the build report that counts violations. This is the site's strongest claim to being a
   reference. Do not loosen it to fill a gap.
4. **The `plain` paragraph on every chapter.** It is the most valuable asset in the front matter. Use it
   in more places; do not edit it toward the technical.
5. **The `prefers-reduced-motion` handling.** Specimen spin, scroll-linked rotation, stage transition and
   smooth scroll are all disabled correctly. This is better than most sites of this ambition.
6. **The dark palette.** Zero contrast failures in dark mode. Change light-mode `--muted` only.
7. **The one-file, dependency-free build.** Prerendering real URLs (item 6) means emitting several files,
   not adopting a framework.
8. **The nameplate's four fields.** Score, concentration, time to substitute, cost signal is the right
   set. Label them as judgments and document the rubric — do not remove them.
9. **The hero's restraint.** One title, one subtitle. Add a single "Start here" link beneath the
   subtitle; do not turn the hero into a landing page.
10. **The measure and the type stack.** 26em on chapters, 29.5em on Geopolitics, Newsreader for reading
    and IBM Plex Mono for data. The reading experience at the paragraph level is already right.

---

### Appendix: how the evidence was gathered

- Live DOM measurement via `javascript_tool` against `http://localhost:8765/` (build of
  2026-09-09T16:25:35Z): geometry, view routing, `document.title` per route, search index behaviour,
  focusable-element counts, and WCAG 2.1 contrast with full alpha compositing of ancestor backgrounds in
  both themes.
- Repository reading: `README.md`, `HANDOFF.md`, `src/template.html`, `src/app.js`, `src/styles.css`,
  `build/build.js`, `dist/build-report.txt`, all 18 `content/*.md` front matter blocks, and the field
  schemas of the seven files in `data/`.
- Scroll-position tests are inconclusive in this environment: `html { scroll-behavior: smooth }` does not
  animate in a hidden browser pane, so anchor navigation could not be verified from the client side.
  `app.js:200-206` handles the cold-load case correctly (`scrollBehavior: 'auto'` on first paint) and
  honours reduced motion, so no deep-link scrolling defect is claimed here.
