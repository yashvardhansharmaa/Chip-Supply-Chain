# Reader re-test: the policy staffer

Second unmoderated usability test, read-only. Same tester, same character: a legislative or
executive-branch staffer briefing a principal on chip export controls next week. Not technical.
Twelve minutes now, an hour later. Needs (a) the mental model, (b) the plain meaning of the
controls, (c) defensible sourced facts, (d) two pages of memo.

Tested against `http://localhost:8765/`, build of 2026-09-09, md5
`eb6c2783332b54e1df185a8c6f0256f4`, 2,039,798 bytes — byte-identical to the live copy at
`https://yashvardhansharmaa.github.io/chokepoints/`. Desktop 1440x900, then 375x812.
First visit: `qa/reader-test-policymaker.md`.

*One caveat on method.* The browser pane was hidden for most of this session, so the page was not
being painted. Screenshots came back blank and hover could not be driven; everything below is read
off the DOM, the computed styles and the built file. One thing I could not test as a result: the
Intro's 3D specimen stayed on "Specimen 01" through a 10,133px programmatic scroll, but
`requestAnimationFrame` does not fire in a hidden pane, so I cannot tell whether the specimen fails
to advance or whether I broke it by looking. Somebody should scroll the Intro on a real screen.

---

## 1. Verdict

The site has moved from *brief-able* to *nearly memo-ready*, and it did it by fixing the three things
I complained loudest about. Export Controls now opens on "What the rules did", a dated timeline in
plain paragraphs, and it gave me October 2022, October 2023 and December 2024 on the first click
instead of the fifth — and it prints both dates for each rule, the publication and the effective one,
which is exactly the distinction that would have embarrassed me in a principal's meeting. The Methods
page is the single best addition: it prints the scoring table with a test for each band, states in as
many words that the score, the concentration and the substitution clock are judgment rather than
measurement, names the person answerable for them, and then sets out a sourcing rule strict enough to
be worth quoting — Tier A plus four named exceptions, no Tier C, 336 sources at A 314 / B 22 / 0
disallowed. And every source now carries a title, a publisher and a date, so the reference list at
the bottom of my memo is a paste rather than an afternoon. The Intro is the other big win: seventeen
plain paragraphs, 1,713 words, joined by bridge sentences that genuinely connect ("Nothing in a file
computes; the drawing has to be printed onto something"), with the jargon defined where it lands.
I got the mental model in about nine minutes and I could hold it afterwards.

What still stops me is narrower than last time but sharper. The fast paths carry no citations: the
Intro has zero footnote links across all seventeen cards, the chokepoint card on each chapter has
zero while the chapter body around it has twenty-six, and the home map's country panels have zero.
So the numbers I most want — Netherlands 100% of EUV tools, SK hynix 63.2% of HBM revenue in 2025 —
are unsourced at the exact moment I read them, and I have to go find them again in the prose. Two
outright errors would cost me credibility if my principal spotted them: every town pin on the home
map is labelled with the wrong stage (ASML's Veldhoven is tagged "Photomasks and Pellicles", TSMC's
Hsinchu is tagged "Memory and HBM"), and filtering the control timeline then pressing Copy as CSV
hands you all 43 rows under a label that still says 43 while the screen shows 24. And two lines of
housekeeping are, for a government reader, blocking: the Methods page carries a visible
`[Placeholder for the author: put the address for corrections here...]`, and under Licence it says
"Nothing on this page grants a licence to the text, the datasets or the code until that line is
replaced." My counsel reads that as: do not reuse. So — could I brief from this site alone? Yes,
comfortably, and I would say where the numbers came from. Could I *build the memo* from it alone?
Not until the licence line is replaced and the cards carry their footnotes. About a day of work, not
the ninety minutes' worth I estimated last time.

---

## 2. Tasks

| # | Task | Start | Steps | Success | Friction |
|---|---|---|---|---|---|
| 1 | Mental model in 12 min | `/` home | 5 | Yes, ~9 min | Home is a country map. The "Intro" and "The Chain" doors sit at y=1,015 on a 900px screen — 115px below the fold — and the first screen contains no list of stages at all. The Intro itself is excellent, but it never defines the score printed on all seventeen cards, and it ends with no recap of which stages are the 5s. |
| 2 | Oct 2022 / Oct 2023 / Dec 2024 | nav "Export Controls" | 2 | Yes, first click | Fixed outright. All three in plain paragraphs, each with publication *and* effective date. Cost: the paragraphs run on undefined jargon — ECCN 3A090, TPP, FDPR, 18 nm half-pitch, General Prohibition Three — and there are no hover definitions on this page. |
| 3 | Litho + HBM dependence, China can/cannot, sourced | home map | 4 | Yes | Panels are accurate (NL 100% EUV; KR HBM 82.5%) and each figure links to its chapter, but they carry no citation and no basis, and the pin tooltips name the wrong stage. I got the citable versions from the chapters and the "Chokepoints and who holds them" table. |
| 4 | What a 5 means; is it opinion? | nav "Methods" | 2 | Yes | Answered completely and honestly, which is rare. Marred by counts that do not match the site: "Ten chapters carry [Extreme]" against nine in the build, and a reference to "the introduction" scoring a 5 when no such chapter exists. |
| 5 | Nvidia / Lam / ASML China revenue | Export Controls → China revenue share | 3 | Yes | The best data page I have seen on this subject. Twenty firms, first year to latest, basis stated per row ("ship-to location of the customer's fab"), filed absolutes behind every share, source URL per row. ASML still reads 33% in one chart and 29.1% in the table under the same phrase "share of revenue". |
| 6 | Glossary "node" / "nanometre" | nav Glossary, then a chapter hover | 4 | Partial | "node" is word-for-word what it was on my first visit; still no "nanometre" entry; still never says whether 2 nm beats 5 nm. The in-chapter hover works well but shows only the first paragraph, dropping the policy sentence — the half I need. |
| 7 | Assemble a two-page memo | whole site | 6 | Partial | "Cite this site" (plain + BibTeX, with access date) and the titled source list make citation easy. Print CSS is now serious work. But there is no brief view, the shortest printable thing is the Intro at six pages or so, the print footer stamps a domain that does not resolve, and the site grants no licence. |
| 8 | Mobile: repeat 1 and 2 | 375x812 | 8 | Both yes | Furniture down from 418px to 203px of 812 — 51% to 25%. The Contents sheet is the best scoreboard on the whole site. Still broken: the licence-thresholds table is 1,322px inside a 337px scroller; sixteen specimen captions open "Right:" while the specimen is a strip at the bottom; 7 October 2022 is 5.9 screens down a timeline whose year labels do not stick. |

### Notes on individual runs

**Task 1.** The Intro does the job the old Summary page did, and does it better as prose. The bridge
sentences are the reason: each one names the gap the next stage closes, so by chapter 11 I understood
*why* packaging exists rather than just that it does. What is missing is the arithmetic at the end. I
had to count the cards myself to be able to say "seven of the fifteen manufacturing stages score 5 of
5". The site knows the answer; it never tells me. Nor does the Intro ever say what the 5 means — the
legend lives on Methods, and the Intro's closing link that says "Sources and method" goes to
`#/sources`, the 336-item bibliography, not to `#/methods`.

**Task 3.** The map is the right tool for this question and the panels are right. Clicking the
Netherlands: "holds 100% of EUV lithography tools", "Lithography 5/5 — ASML design and final
assembly, Veldhoven", "one chokepoint town: Veldhoven". Then I hovered the pin over Veldhoven and it
said "Veldhoven — Photomasks and Pellicles (5/5)". Every town is mislabelled the same way: Hsinchu
and Tainan read "Memory and HBM", Kaohsiung reads "Substrates and PCBs", Icheon and Pyeongtaek read
"Advanced Packaging", Boise reads "Advanced Packaging", Phoenix reads "Memory and HBM". The pins are
also `aria-hidden="true"`, so a keyboard user gets nothing at all.

For the memo I ended up with three facts I would stand behind, all from the chapters rather than the
map: "China was 41% of ASML's net system sales in 2024 and 33% in 2025" (ASML Q4 2025 investor
presentation); "SK hynix took 63.2% of HBM revenue in 2025 and the two Korean firms 82.5%" (SK
hynix's Form 424B4, which the site openly flags as adopting IDC's figures — the honesty is the
reason I would use it); and "BIS controls HBM above 2 GB/s per mm² under ECCN 3A090.c, which captures
every stack now in production" (Federal Register, 5 December 2024). The threshold data's own note is
the best sentence on the site for my purposes: the entry "is a ban on selling HBM into China rather
than a performance line ... a Chinese AI chip without HBM cannot feed its own compute."

**Task 4.** "A 5 means the failure mode is total. One firm, or one country's cluster, stops and
nothing at the leading edge gets built." Then the criteria, then where each band lands, then: "No one
publishes any of them. We wrote them," and a section headed "Who owns these three numbers". I can
cite this with attribution and defend it. The only thing that would trip me is that the page's own
counts are stale — the Extreme/High split is 9/8 in the build and the page says 10/8, and it
describes an "introduction" chapter that the site no longer has.

**Task 6.** The hover works and is well built: `<button class="gl-term">`, so keyboard-reachable, and
the popover ends with "Open the glossary". But the popover shows only the definition paragraph, and
the definition alone leaves a non-engineer worse off than before: "nothing on TSMC's N2 is 2
nanometres wide, and SMIC's 5 nanometre-class process has a tighter metal spacing than Intel's 18A."
Read cold in a briefing, that says SMIC is ahead of Intel. And the entry's policy sentence — "which is
why US export thresholds specify transistor type and metal spacing instead" — is contradicted by the
site's own threshold data three tabs away, which reads "transistors on a logic die made at the 16/14
nm node or below, or with a non-planar transistor architecture". That is a node name and a transistor
type. There is no metal-spacing criterion in the threshold map for logic.

**Task 8.** The phone layout is transformed. Masthead 75px, specimen strip 128px at the bottom, and
the Contents sheet — full-screen, all eight tabs, all seventeen chapters with their scores — is the
clearest single view of the argument anywhere on the site. It exists only on mobile.

---

## 3. The ten problems that remain, ranked

**1. The three fast paths carry no citations.** Verified: 0 `sup.cite` links in the Intro view across
1,713 words and seventeen cards; 0 in the chokepoint card `.plate` of the Memory chapter against 26
in the chapter around it; 0 in the home map's country panels. So "SK hynix — 63.2% of HBM revenue,
2025" appears on the card with no link, while the "In short" paragraph two inches below carries the
same figure with footnote 11 attached. The pages a hurried reader actually reads are the pages they
cannot quote. *Revision: render the existing footnote link into each card field that carries a
number, into the map panel's share rows, and once per Intro card. The data is already there; this is
a template change, not research.* **A day.**

**2. Every town pin on the home map names the wrong stage.** Veldhoven → "Photomasks and Pellicles";
Hsinchu, Tainan, Kumamoto, Phoenix, Shanghai → "Memory and HBM"; Icheon, Pyeongtaek, Yokkaichi, Boise
→ "Advanced Packaging"; Kaohsiung → "Substrates and PCBs"; Austin and Bengaluru → "Silicon and
Wafers". The country panels are correct, so this is a pairing bug in the `title` attribute, not bad
data. It is the first interactive thing on the site and the one a principal is most likely to poke.
The pins are also `aria-hidden="true"` with no keyboard equivalent. *Revision: pair each town to its
own chokepoint card; make the pin a `<button>` with the same label as its accessible name.*
**Half a day.**

**3. The Methods page contradicts the site it documents.** "Ten chapters carry it" for Extreme — the
build has nine Extreme and eight High across seventeen chapters. "The introduction and the
geopolitics essay score the whole chain, and both carry a 5" — there is no introduction chapter; what
sits outside the fifteen stages is Component Costs, which carries a 4 and is a bill of materials, not
a stage that can stop shipping. The page's word-and-source table is generated at build time and is
therefore exact; the prose above it is hand-written and has drifted. *Revision: generate the band
counts and the "where it lands" lists from the chapter data the same way; decide whether Component
Costs is scored as a chokepoint at all and say so on the card.* **Half a day.**

**4. No licence, and a bracketed placeholder in the published page.** "Licence: to be confirmed by the
author. Nothing on this page grants a licence to the text, the datasets or the code until that line
is replaced," and immediately above it, "[Placeholder for the author: put the address for corrections
here, an email or a form. No address is published yet.]" For a government audience these are the two
lines that decide whether the site can be used at all: the first tells counsel no, the second tells
my principal the thing is unfinished. *Revision: publish a licence — CC BY 4.0 on text and data would
cover every use I have — and put a real correction address in. Ten minutes of decision, ten minutes
of typing.* **An hour.**

**5. Filter the data, then copy it, and you get the unfiltered set.** `addExport('#timeline',
'export-control timeline', DATA.timeline, 'before')` binds the whole array once at boot. Filtering
the timeline to "US export control" shrinks the page from 22,596px to 13,284px, but the label still
reads "43 rows · export-control timeline" and Copy as CSV still yields 43. The same holds for the
licence thresholds. The code comment on the AI Chips table shows the author knew the difference —
"a live array: Landscape keeps it in step with the selection" — and the other four did not get it.
Someone will filter to the US rules, paste, and publish a table with China's countermeasures in it.
*Revision: pass a getter instead of an array; recompute the count on every filter change.*
**Two hours.**

**6. The print footer stamps a domain that does not exist.** The print stylesheet writes
"Compute Chokepoints · computechokepoints.com" onto the bottom of every page; that domain returns
NXDOMAIN. The "Cite this site" block, four inches away in the DOM, correctly gives
`https://yashvardhansharmaa.github.io/chokepoints/`. Anything I attach to a memo carries a dead
address in the place a reader looks for provenance. *Revision: stamp the same URL the citation block
uses, or make the string a build variable.* **Ten minutes.**

**7. There is still no two-page brief.** The print CSS is now real work — light tokens forced over
dark mode, `print-color-adjust: exact` so the score pips survive, `details` forced open so chapter
sources print with their URLs, `thead` repeated, break rules on every card. Credit where it is due.
But the shortest thing I can print is the Intro at roughly six pages, and The Chain is still
`.chapter { break-before: page; }` across seventeen chapters. The old Summary page's scannable
scoreboard is gone, and the only place all seventeen scores appear together is now the mobile
Contents sheet. *Revision: a `#/brief` route holding four things — the "Chokepoints and who holds
them" table with its BASIS column, the seventeen plain-terms sentences each with its score, the three
rule dates in one paragraph apiece, and a flat numbered source list. That is the memo, and it is all
existing content.* **A day.**

**8. "Node" is unchanged, "nanometre" is still missing, and the policy sentence is still wrong.**
Same entry as my first visit. It still never answers the only question a non-engineer asks — is 2 nm
better than 5 nm, and does it matter for the rules — and its illustration ("SMIC's 5 nanometre-class
process has a tighter metal spacing than Intel's 18A") reads, without context, as "SMIC is ahead of
Intel". Its closing claim that thresholds "specify transistor type and metal spacing instead" is
contradicted by `data/control-thresholds.json`, which sets the logic line at "the 16/14 nm node or
below, or ... a non-planar transistor architecture". The hover popover drops that sentence entirely
and shows only the definition. *Revision: add a "nanometre" entry that redirects to "node"; add one
sentence — a smaller number means a newer, denser generation from the same foundry, and names cannot
be compared between foundries; correct the threshold claim to "transistor architecture and node
generation"; show both paragraphs in the popover.* **Two hours.**

**9. The front door answers "where" when the brief needs "what".** At 1440x900 the first screen is a
headline, a one-line dek and a world map; the Intro and The Chain cards are at y=1,015, and the home
view contains no stage list of any kind. The map is genuinely good — it is the best thing on the site
for task 3 — but a reader whose question is "what are the stages and which ones are chokepoints" has
to scroll past it and guess. *Revision: lift the two doors above the fold, or run a fifteen-stage
strip with its scores down the side of the map so both questions are answered on screen one.*
**Half a day.**

**10. Two labels still promise more than the number delivers.** The Geopolitics chart is titled
"China's share of revenue at the four largest chip-tool makers" and plots ASML at 41% and 33%; the
Exposure page, computed from total net sales, gives ASML 36.1% at peak and 29.1% for FY2025. The
Exposure data now carries the note that explains the gap — "Total net sales, not the narrower net
system sales base on which ASML's quarterly China percentages are quoted" — which is a real
improvement over last time, but the chart title does not say it. Separately, the "Chokepoints and who
holds them" table reads "HBM · South Korea · 56% · SK hynix alone, revenue, 1Q26" while the same site
says the two Korean firms hold 82.5%; a reader scanning the Leader and Share columns reports "Korea
holds 56% of HBM" and understates the thing the table exists to show. *Revision: retitle the chart
"China's share of net system sales"; change that row's leader to "SK hynix" or give the Korean
total.* **An hour.**

### Also noted, below the ten

The licence-thresholds table on the phone is 1,322px wide inside a 337px scroller, 41 rows, and never
reflows to cards — worse in absolute pixels than the 1,209px I measured last time, though it now sits
behind a sub-tab rather than being the landing (a day). Sixteen specimen captions begin "Right: …"
while on the phone the specimen is a strip along the bottom (an hour, or make it "Below:" under the
mobile breakpoint). The Intro's closing link is labelled "Sources and method" and goes to
`#/sources`, not `#/methods` (five minutes). The Chain still puts 3.2 screens of "How to read a
chapter" plus Contents in front of chapter 1 on desktop (half a day). The phone specimen strip has
"Contents" and "Expand" but no way to hide it, so 25% of the screen is permanent furniture (two
hours). The control timeline's year labels are not sticky and there is no year jump, which puts 7
October 2022 5.9 screens down on a phone (two hours). Three source rows carry scraped page titles
rather than document titles — "Note: This document has been translated from the Japanese original…"
and two GlobalWafers releases ending "All rights reserved" — and SEMI's wafer-shipment release is
attributed to PR Newswire, its wire distributor, rather than to SEMI (an hour). Each chapter now
opens with three summaries in a row — the lede, "In plain terms", "In short" — which is one more than
a hurried reader needs (half a day of editorial judgment). And the disclaimer is still "not as
investment advice", which is the wrong sentence for the audience this site is plainly written for
(five minutes).

---

## 4. What improved, and must not regress

**1. Export Controls opens on what the rules did.** This was my second-ranked problem last time and it
is gone. Three sub-tabs — "What the rules did", "Licence thresholds", "China revenue share" — and the
first one is a dated narrative in plain paragraphs, filterable by actor, running from the 2018 ZTE
denial order to the present, with China's countermeasures and the Dutch and Japanese controls
interleaved rather than hidden. Crucially, each entry now prints both dates: "published on 25 October
2023 and took effect from 17 November". That single habit removes the exact trap I fell into on my
first visit. Do not reorganise this page by instrument again.

**2. "In plain terms" comes first, and there is a box explaining the card.** The plain-terms
paragraph is now the first thing in every chapter, ahead of the nameplate and the numbers, and The
Chain opens with "How to read a chapter" defining concentration, the score and the substitution
clock, with a pointer to Methods. Both were direct recommendations and both landed. The writing in
those boxes is still the best thing on the site — "A foundry is a print shop for chips", "each one is
a valve on a pipe" — and the Intro now strings all seventeen of them into a single readable piece.

**3. The Methods page.** The score table with a test per band; the flat statement that these are
judgments and not measurements; "Who owns these three numbers"; the sourcing rule written out with
its allowed institutions and its four named exceptions, and the disallowed list printed by name; the
two relay cases (SK hynix on IDC, KLA on Gartner) explained rather than hidden; and "What this site
does not cover", which names five real gaps including the software stack. A page that tells me what
it does not know is a page I trust on what it does.

**4. Sources have titles, publishers and dates.** All 336, graded A or B, grouped by chapter with the
mix printed per chapter, and the footnote `title` attributes carry the document title as well as the
domain. This turned the reference section of my memo from an afternoon into a paste.

**5. The memo furniture.** "Cite this site" gives a formatted citation and a BibTeX record with
today's access date. Deep links into the Intro work (`#/walk/memory-and-hbm` lands on the right
paragraph), so I can send a colleague one stage rather than a site. The print stylesheet forces light
tokens, opens the collapsed source lists, keeps cards off page breaks and repeats table headers. The
phone gave back a quarter of its screen and gained a Contents sheet that lists every chapter with its
score. And the doctype is fixed — the page is out of quirks mode.

Honourable mentions, unchanged and still right: the search box (typing "october 2023" still returns
the right event with a plain gloss in one step); the accessible data table behind every chart; the
per-row accounting basis on the exposure data; and the single-file, no-tracker build. The authorship
line — "Made by Yashvardhan Sharma with Claude" — is now in the home page footer instead of buried at
the foot of Sources. That is exactly where it belongs.
