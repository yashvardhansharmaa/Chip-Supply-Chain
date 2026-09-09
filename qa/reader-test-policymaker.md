# Reader test: the policy staffer

Unmoderated usability test, read-only. Tester in character as a legislative or executive-branch
staffer briefing a principal on chip export controls next week. Not technical: does not know what a
wafer, a node, EUV or packaging are. Twelve minutes now, maybe an hour later. Needs (a) the mental
model, (b) the plain meaning of the controls, (c) defensible sourced facts, (d) two pages of memo.

Tested against `http://localhost:8765/`. The build changed three times during the session
(12:25, 12:40, 12:46). Everything below is verified against the 12:47 snapshot,
md5 `82cf7904072326f78adfbad7830a5419`, 1,687,452 bytes. Desktop 1440x900, then mobile 375x812.

---

## 1. Verdict

I could brief my principal from this site, and I would not be embarrassed doing it, which is more
than I can say for most of what crosses my desk. The Summary page is the reason. Eighteen cards,
each with a score, a concentration label, three or four sentences of conclusion and a "Who leads"
line with country tags — I read the whole chain in about ten minutes and came away able to say the
thing my principal actually needs to hear: that an AI accelerator is roughly a dozen separately made
parts, that seven of the fifteen manufacturing stages have one or two credible suppliers, and that
the binding constraints in 2025 were memory and packaging rather than transistors. The Geopolitics
page then gave me the controls in dated English — "7 October 2022, the break", "17 October 2023, the
density fix", "2 December 2024, the widest package" — which is exactly the register I need. And the
Exposure page is the best thing here: Nvidia's China revenue falling from 23.3% in FY2021 to 9.1% in
FY2026, with the accounting basis spelled out in the row ("based on the customer's headquarters
location, China including Hong Kong"). That caveat is the difference between a fact and a
liability, and almost nobody writes it down.

What I would have to look up elsewhere is, awkwardly, most of what makes a memo a memo. The Summary
page — the one page I actually read — carries no citations at all: 560 footnote links live in the
chapters and zero in the Summary, so every sentence I want to lift is a sentence I cannot source
without going back and finding it again in a 20,000-word chapter. I would have to look up the
authority behind the "chokepoint score", because the site defines the scale ("A 5 means a single
point of failure") but never says whose judgment it is; it flags *substitution time* as "Our
estimate" and "the most opinionated number on the card", which by omission invites me to read the
score as something firmer than it is. I would have to reconcile ASML's China share myself, because
the site gives it as 41% in one chart and 36.1% in another table. I would have to find out for
myself that the site was written with an AI — it says so, candidly, but under the last heading of
the Sources page, where no reader in a hurry will ever see it. And I would have to build the memo by
hand: there is no export, and printing gives me a forty-page document because every chapter is
forced onto a new page. So: brief-able, yes. Memo-ready, no — about ninety minutes short.

---

## 2. Tasks

| # | Task | Start | Steps | Success | Friction |
|---|---|---|---|---|---|
| 1 | Mental model in 12 min | `/` home | 6 | Yes, ~10 min | Home page opens with a bar chart I can't read numbers off, then ~4 screens of Contents. The Summary tab did the work; nothing told me to go there. Chapters are 19,938 words / 88 stated minutes — a non-starter. |
| 2 | Oct 2022 / Oct 2023 / Dec 2024 | nav "Controls" | 5 | Yes, but from the wrong tab | Clicked "Controls" — got 40 rows of ECCN thresholds. Abandoned it, tried "Geopolitics", found the dated bullets under "The US export-control campaign, 2018 to today". Search ("october 2023") would have done it in 1 step. |
| 3 | Litho + HBM dependence, China can/cannot, sourced | Geopolitics | 4 | Yes | Best-served task. "Chokepoints and who holds them" gives EUV lithography / Netherlands / 100% / "revenue, 2025" with a BASIS column. Footnote numbers are live links to source. |
| 4 | What a score of 5 means; opinion or measure? | search "chokepoint score" | 5 | Partial | Scale is defined in "How to read this site". No method note anywhere, and no statement of authorship. Sources page has method notes for three lesser datasets and none for the score. |
| 5 | Nvidia / Lam / ASML China revenue | nav "Exposure" | 4 | Yes | Excellent. Year series FY2021–FY2026, per-firm accounting basis, Copy as CSV/JSON. Undercut by the ASML figure disagreeing with the Geopolitics chart. |
| 6 | Glossary "node" / "nanometre" | nav "Glossary" | 2 | Partial | "node" exists and is very good on the policy point. "nanometre" does not exist. Neither answers "is 2 nm better than 5 nm?". |
| 7 | Assemble a two-page memo | whole site | 8 | No | No export. Print CSS is four lines and sets `.chapter { break-before: page; }`. Chapter source lists are in closed `<details>`, so printing drops every URL. |
| 8 | Mobile: repeat 1 and 2 | 375x812 | 9 | 1 yes, 2 painful | Masthead (109px) + sticky 3D specimen band (309px) = 418px of 812, i.e. **51% of the screen**, permanently, with no control to collapse it. Controls table side-scrolls 1,209px inside a 337px window. |

Notes on individual runs:

**Task 1.** The hero reads "How AI chips are made / Every stage of the supply chain, and who controls
it." Below it, "The chain, scored" with the caption "Bar height is the chokepoint score, 1 to 5."
Fifteen bars, no numbers printed on them, three colours. I could see which stages were worst; I could
not read a score off the chart, which is what the caption promises. The Summary page prints "5/5" as
a numeral on every card and is far better for it.

**Task 2.** The Controls page is organised by instrument, not by date, and it uses effective dates
("US EAR · from 2022-10-21", "from 2023-11-17") while Geopolitics uses publication dates ("7 October
2022", "17 October 2023"). My principal will say "the October 2023 rule". The Controls page calls it
November. Nothing explains the difference.

**Task 4.** The only definition is two sentences: "Chokepoint score. A 1 means many substitutes. A 5
means a single point of failure, where losing one supplier stops leading-edge production worldwide."
Individual chapters do justify their scores in prose — "Lithography scores a 5 because the failure
mode is total and substitution takes decades" — which is good, and I would cite *that*. But I counted
nine 5/5 cards on the Summary against seven gold bars in the hero chain, because the Introduction and
the Geopolitics chapter are both scored 5/5 although neither is a manufacturing stage. Scoring your
own introduction as a single point of failure reads as a category error and costs the whole device
credibility.

**Task 6.** The "node" entry: "The name a foundry gives one generation of its manufacturing process.
The number in the name stopped measuring anything on the chip decades ago: nothing on TSMC's N2 is 2
nanometres wide". Then the policy line: "Because node names are marketing labels rather than
measurements, rules and comparisons that lean on them are unreliable, which is why US export
thresholds specify transistor type and metal spacing instead." That is a genuinely useful warning.
But it leaves a non-engineer believing node numbers are meaningless, when what I need to know is
that they are meaningful down one foundry's own ladder and not across foundries. And the closing
claim is contradicted by this site's own Controls page: the advanced-node definition there is
"<= 16 nanometres ... or any non-planar transistor architecture", and the 2025 rule uses approximated
transistor count. There is no metal-spacing criterion anywhere in the threshold map.

**Task 8.** On the phone, the Summary page hides the 3D band entirely and gives full width to the
cards — it is the right mobile entry point, and nothing says so. The Stack view does not: the
specimen band is `position: sticky; top: 52px; height: 38vh; min-height: 250px` and follows you down
the page. The hero chain becomes `grid-template-columns: repeat(5, 1fr)`, so the chain turns into
three rows of five tiles, bar heights on different rows are no longer comparable against one
baseline, and the labels drop to 8.5px. The Contents block runs about five phone screens before any
prose. The section rail is hidden on mobile, so there is no way to jump between chapters.

---

## 3. The ten problems, ranked

**1. The Summary page carries no citations.** Verified: 0 `<sup class="cite">` links in the briefing
view against 560 in the chapters. The one page a busy reader actually reads is the one page they
cannot quote. *Revision: render the same footnote links into the brief cards.* **An hour.**

**2. "Controls" answers the wrong question.** A staffer clicks the tab named for their task and gets
"40 thresholds across 7 regimes" — ECCN numbers, `TPP >= 4,800`, "Country Groups D:1, D:4 and D:5
that are not also specified in A:5 or A:6". The plain-language history they wanted is on
*Geopolitics*, a tab that sounds like strategy. *Revision: lead the Controls page with the dated
narrative now in "The US export-control campaign, 2018 to today"; make the threshold map a second
sub-tab beside it, as Exposure already is.* **A day.**

**3. "In plain terms" is in the wrong place, twice.** These eighteen boxes are the best writing on
the site — 83 to 109 words each, one analogy apiece: the car whose engine, gearbox and wheels each
come from a single factory; the street plan of a city of billions of buildings; the cook who can chop
faster than anyone can fetch. A reader who takes the fast path never sees one, because the Summary
has none. And inside a chapter the box sits *below* the nameplate, so the first thing a non-technical
reader meets is "Time to substitute 10+ years / Cost signal: Hyperscaler capex reached $448.2B".
*Revision: put the plain-terms sentence on every Summary card, and move the box above the nameplate
in the chapters.* **A day.**

**4. The chokepoint score has no stated author and no method.** The Sources page carries "Method: the
country-share matrix", "Method: the threshold map" and "Method: the exposure series" — and nothing
for the number in the site's title, on every nameplate, in the hero chart and in the sort order of
the whole argument. Worse, the site says "Our estimate" of substitution time and calls it "the most
opinionated number on the card", which implies the score is *not* opinion. "Concentration:
Extreme / High / Moderate / Low" has no thresholds either. *Revision: add "Method: the chokepoint
score" to Sources with the criteria and the firm counts behind each concentration band, and change
the definition line to say plainly that the scores are the site's own judgment.* **A day.**

**5. Mobile gives half the screen to furniture.** 418px of 812 is masthead plus sticky 3D specimen,
permanently, while reading. There is a `data-hidden` mechanism in the code but no button for it: the
only controls on the page are Search, dark mode, Back to top and Copy as CSV/JSON. *Revision:
shrink the band to ~120px once the reader scrolls into a chapter, add a "hide specimen" toggle, and
collapse the nine nav tabs into a menu so the masthead stops wrapping to 109px.* **A day.**

**6. There is no memo output.** Print CSS is four lines, and `.chapter { break-before: page; }` turns
the Stack into a forty-plus-page document. Chapter sources live in `<details>` that are closed by
default, so a printed chapter shows superscripts 1 to 54 and one line reading "Sources for this essay
(54)" with no URLs at all. *Revision: a "Brief" print view — the chokepoint table, the eighteen
plain-terms sentences, and a flat numbered source list — plus `details { open }` and no forced page
breaks in print.* **A day.**

**7. The stage count and the chokepoint count contradict themselves.** "Eighteen stages" appears
twice; "stage N of 15" appears thirty times; the hero chain shows seven 5s and the Summary shows
nine. The Introduction and Geopolitics are scored as stages when they are not stages. *Revision: fix
on fifteen manufacturing stages, number the chain 1–15 rather than 02–16, and either drop the score
from chapters 01, 17 and 18 or mark it "not a stage".* **An hour.**

**8. ASML's China share is given two different ways, one of them mislabelled.** The Lithography
chapter says correctly "China's share of ASML **system sales** from 41% in 2024 to 33% in 2025". The
Geopolitics chart is titled "China's share of **revenue** at the four largest chip-tool makers" and
plots the same 41% / 33%. The Exposure table, on total net sales, gives ASML 36.1% for FY2024 and
29.1% for FY2025. A reader quoting the chart is quoting a number the site's own data page
contradicts. *Revision: retitle the chart "share of net system sales", or plot the Exposure figures.*
**An hour.**

**9. The glossary misses the question a non-engineer actually asks.** There is no "nanometre" entry —
the unit in every headline my principal has read. And "node" never says whether 2 nm is better than
5 nm. *Revision: add a "nanometre" entry that points to "node", and add one sentence to "node": a
smaller number means a newer, denser generation from the same foundry, and node names cannot be
compared between foundries. Fix the "metal spacing" claim to match the threshold map.* **An hour.**

**10. Every source is a bare URL.** All 344 are graded A/B/C, which is excellent, but none has a
title, author or date — the list reads
`https://www.csis.org/analysis/choking-chinas-access-future-ai` and a `csis.org` chip. Building a
reference list means opening every link. *Revision: carry title and publication date in the source
data and render "CSIS, Choking China's Access to the Future of AI, 2022".* **A day** (a week if the
titles have to be recovered by hand).

**Also noted, below the top ten.** The chain chart's caption says "Bar height is the chokepoint
score, 1 to 5", but the CSS sets 100% / 66% / 38% for scores 5 / 4 / 3 — not proportional, and it
overstates the gap between a 5 and a 4, which is precisely the distinction the site rests on; print
the digit on the bar and make the heights linear (an hour). The Controls table on mobile is 1,209px
wide inside a 337px scroller and never reflows to cards (a day). The build output has no
`<!doctype html>`, so the page renders in quirks mode (`document.compatMode === "BackCompat"`); it
works today, but it is a one-line fix in `src/template.html` and worth doing before it bites (an
hour). "Treat the text and data as a starting point for your own diligence, not as investment
advice" is the wrong disclaimer for a policy audience.

---

## 4. Five things that work and must not be changed

**1. The "In plain terms" boxes.** Eighteen of them, one per chapter, 83 to 109 words, each built on
a single concrete analogy. "A transistor is a valve on a pipe." "A foundry is a print shop for
chips." "An export control is a licence requirement, not a ban on ideas." This is the only writing I
have seen on this subject that assumes I am intelligent and uninformed rather than the reverse. Do
not shorten them, do not merge them, do not move them into a sidebar.

**2. Every footnote is a live link, and every source is graded.** Clicking the superscript goes
straight to the filing or the paper, with the domain in the tooltip. The Sources page then grades all
344 by tier — "A: Primary or institutional", "B: Established analyst or top-tier press" — and prints
the mix per chapter ("05 · Lithography 25 sources · A 22 · B 3 · C 0"). That is a stronger provenance
discipline than most think-tank output.

**3. The Exposure page states the accounting basis in every row.** "Revenue by geographic region
based on the customer's headquarters location, China including Hong Kong" for Nvidia; "customer
ship-to location" for Lam; "ship-to location of the customer's fab" for ASML; and a footer saying the
bases differ by firm. Plus Copy as CSV and Copy as JSON. This is the page that would keep me out of
trouble in a principal's meeting.

**4. The dated control narrative on Geopolitics.** Naming each rule — "the break", "the density fix",
"the widest package" — and saying in one sentence what each did and what it missed is precisely how a
briefing note should read. The "Chokepoints and who holds them" table with its BASIS column
("revenue, 2025", "capacity, 2025") belongs in the same category.

**5. The search box.** Typing "october 2023" returned the right event with a plain-language gloss in
one step; "chokepoint score" found the definition and the chapters that justify it. It indexes
chapters, glossary, suppliers, chips and events together. It is the fastest path on the site for a
reader in a hurry — which is an argument for making it more prominent, not for changing it.

Honourable mention: every chart has an accessible data table behind it, the whole site is a single
file with no trackers and works offline, and "How this site was made" tells the reader exactly who
wrote it and how. That last one is rare and right. It just needs to be visible from the chapters,
not only from the foot of the Sources page.
