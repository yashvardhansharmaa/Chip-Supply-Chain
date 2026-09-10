# Findability: from outside, and inside

Read 10 September against `dist/index.html` (2,000 KB, 22,629 words, 336 sources). Search results from `CP.Tools.search()` in headless Chrome.

## Findings, ranked by effect

**1. The site has no address.** *(2 days)* One file, hash routes, one URL. The head carries a title and a description and nothing else: no Open Graph, no Twitter card, no canonical, no favicon, no sitemap, no robots.txt, no structured data. A hash never reaches a server, so a link to a chapter, the board or the glossary unfurls in Slack as "Compute Chokepoints" plus the same generic line and no image; on X, with no card tag, as a bare link. Google sees one page about seventeen subjects, competing with itself.

**2. The home page does not say where to go.** *(1 hour)* Home is the hero's two lines, the map and two exits, Intro and The Chain. Nothing on it points to Export Controls, AI Chips, the Glossary or Sources, or says what any costs in minutes. Meanwhile `build/modules/walk.js` already returns a `START_HERE` block — a three-way chooser (ten minutes / the whole chain / data and sources) — and `src/template.html` has no `{{START_HERE}}` placeholder, so the build drops it while shipping its CSS. Adding the placeholder is a one-line fix.

**3. The data pages are islands.** *(half a day)* Chapter prose holds 191 links, every one to another chapter. None go to Suppliers, Export Controls, AI Chips, China revenue or Sources. The return path is worse: Suppliers draws 220 firms and links to no chapter; Export Controls carries 289 source links and no chapter link (that connection existed before the thresholds tab was cut); Sources groups 336 citations under seventeen chapter headings and links to none. Only the glossary is sewn in — 227 popovers out, 69 links back.

**4. Search ranks the wrong things.** *(3 hours)* The index holds 657 entries and finds names well: ASML, CoWoS, pellicle, SMIC and AI diffusion rule all rank first. Four faults.
- 103 China-revenue rows are indexed one per firm-year, all pointing at `#/exposure`. "ASML" returns the supplier, then ASML FY2021, FY2022, FY2023, FY2024. Collapse to one row per firm.
- The chokepoint card is not indexed. "concentration", "substitution time", "5 of 5" and "single point of failure" return noise. "how long to replace ASML" returns the supplier and four revenue rows; the answer, 10+ years, is on the Lithography card.
- Sources are not indexed: "CSET" returns four chapter sections, no bibliography.
- Terms match as substrings anywhere, so "what should the US do" ranks the glossary entry *etch* first, on "us" inside a word. Require a word boundary under three letters.

**5. Timeline hits land on the page, not the entry.** *(1 hour)* All 43 event results go to the top of `#/controls`. Every event carries a stable `id` in `data/export-controls-timeline.json`; put those on the rendered entries and scroll to them.

**6. Tab names and order.** *(renames, minutes; reorder, hours)* "Intro" is the weakest label on the bar. The page it opens calls itself "Start here — How a GPU is made" and takes ten minutes, but a first visitor reads "Intro" as throat-clearing and skips it. "AI Chips" names a topic, not the comparison tool it is. On a 390 px phone the row is 439 px against 362 px of space, so Sources sits off-screen with no cue that it exists.

**7. Small breaks.** *(an hour)* Geopolitics appears twice in Contents, both numbered 17. Glossary entries have no ids, so no term can be linked. On a phone the Contents sheet's only trigger sits inside `.stage`, which the CSS hides outright when WebGL is unavailable — no contents, no rail, no "where am I".

What works: the chapter head ("You are here: Lithography, stage 4 of 15", chain strip, previous/next); `document.title`; the sheet; `/` and Ctrl+K; back-to-top.

## The twenty questions

F first visit, R researcher, P policy reader. Clicks count from a cold arrival at `/`.

| # | | Question | Where the answer is | Clicks |
|---|---|---|---|---|
| 1 | F | What is this and who made it? | Hero, then the footer credits | 0 + scroll |
| 2 | F | How is a chip made, start to finish? | Intro, 17 paragraphs | 1 |
| 3 | F | What does "chokepoint" mean here? | "How to read a chapter" box; glossary | 2 |
| 4 | F | Why does Taiwan matter so much? | Home map, click TW | 1 |
| 5 | F | What is EUV / a pellicle / an interposer? | Glossary, or the popover in prose | 1 |
| 6 | F | Which single company matters most? | Implied by Lithography's 5/5 card | 3, never stated |
| 7 | F | How long is this, where do I start? | Only after you open Intro | **missing on home** |
| 8 | R | Who makes HBM, and at what share? | Chapter 10 (search ranks it first) | 2 |
| 9 | R | What is the source for this number? | Inline cite; Sources, by chapter | 1 |
| 10 | R | Can I download the data? | CSV/JSON bars on chips, timeline, exposure | 1; the other 5 datasets in `dist/data/` are never linked |
| 11 | R | How is the chokepoint score defined? | "How to read a chapter"; glossary entry | 2, no own URL since Methods was cut |
| 12 | R | How do I cite this? | Footer, "Cite this site" + BibTeX | 1 |
| 13 | R | Which firms sit in stage X? | Suppliers ladder, thinnest stage first | 1, no link to the chapter |
| 14 | R | Compare a B200 and an MI300X | AI Chips, pick two | 3 |
| 15 | R | What share of ASML's revenue is China? | Export Controls → China revenue share | 2 |
| 16 | R | What is a chapter's substitution time? | Chokepoint card | 3; **search cannot find it** |
| 17 | P | What can still ship to China today? | The board: nine flows, state and date | 1 |
| 18 | P | What did the 7 October 2022 rule do? | By date; search drops you at page top | 2 + hunt |
| 19 | P | Is the AI diffusion rule still in force? | Board and timeline (announced, rescinded) | 2 |
| 20 | P | Which chokepoint could the US lose next? | Geopolitics, "What to watch" | 3, unlabelled |

## The architecture to move to

**Sitemap, phase one (~45 URLs).** `/` · `/how-ai-chips-are-made/` (the Intro) · `/chain/` and `/chain/<chapter>/` ×17 · `/ai-chips/` · `/suppliers/` and `/suppliers/<stage>/` ×20 · `/export-controls/`, `/export-controls/timeline/`, `/export-controls/china-revenue/` · `/glossary/`, an anchor per term · `/sources/` · `/sitemap.xml`, `/robots.txt`. Phase two adds `/ai-chips/<chip>/` ×35 and `/export-controls/<event-id>/` ×43; both already have stable ids. Each page ships the whole app and boots to its own view, so the JS need not change. Chapter title: `Lithography: one firm builds every EUV scanner — Compute Chokepoints`; description: the chapter's own `oneLiner`; OG image: its specimen. Plausible targets: "how AI chips are made", "who makes HBM", "EUV scanner price", "CoWoS capacity", "AI diffusion rule", "October 7 2022 export controls", "Nvidia China revenue by year", plus 75 definitional queries against the glossary anchors.

**Home's job:** say what the site claims and open three doors — ten minutes, the whole chain, the data — with the map under them as evidence, not as the only exit.

**Top-level names:** Start here · The Chain · Chips · Suppliers · Export Controls · Glossary · Sources.

**The three changes with the biggest effect:** prerender one URL per page with its own title, description, canonical and card; sew the data pages to the chapters in both directions; wire `{{START_HERE}}` into the home page.

## The next two days

Day one is the export: teach `build.js` to write a directory per route with its own `<title>`, description, canonical, OG and Twitter tags and specimen image, plus `sitemap.xml` and `robots.txt`, and let the router boot from the path as well as the hash. Day two, morning, the cheap internal wins: wire `{{START_HERE}}`; put chapter links on the Suppliers ladder, the board and the Sources headings; give timeline entries and glossary terms real ids; drop the duplicate Geopolitics row. Afternoon, search: collapse the revenue rows to one per firm, index the card fields and the bibliography, require a word boundary for short terms, land event hits on the entry. The order is deliberate — the export decides whether anyone arrives, the rest whether they reach a second page.
