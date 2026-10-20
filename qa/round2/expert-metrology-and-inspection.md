# Expert review: chapter 7, Metrology and Inspection (20 October 2026)

Reviewer: inspection and metrology scientist (optical and e-beam wafer inspection, overlay and CD metrology, yield analysis). Slug `expert-metrology-and-inspection`. File edited: `content/07-metrology-and-inspection.md` only (Edit tool). Downloads: `qa/round2/scratch/expert-metrology-and-inspection/`. Frames and screenshots: `qa/round2/shots/expert-metrology-and-inspection/`. Working notes: `qa/round2/expert-metrology-and-inspection-notes.md`.

Counts: 7 errors fixed, 6 sentences made clearer or more precise, 1 citation re-pointed to the right page, 1 citation added to a sentence that had none, 0 links broken (0 fixed), 0 new sources.

## 1. Changes made in the chapter

| # | Where | Before | After | Why | Source (quote, page) |
|---|---|---|---|---|---|
| 1 | How it works, yield paragraph, first sentence | A bigger chip is a bigger target for the second kind, and the loss grows faster than the area. | A bigger chip is a bigger target for the second kind, so the cost of each good chip grows faster than its area ([source](…f33-book-dep-comp-pt2.pdf#page=8)). | **Error.** Under the cited yield formula the share of dies lost grows more slowly than area (the loss curve bends over: in the textbook's own example four times the area takes the loss from about half to under nine in ten, by my arithmetic, not four times). What grows faster than area is the cost of a good die, which is the source's own conclusion and what the paragraph's last sentence (20.1 times) shows. | Parhami p. 8: "the cost of a die will grow superlinearly with its area" |
| 2 | Packaging, AI and China, December 2024 rule | They must do this using light with a wavelength below 400 nm, an electron beam resolving 1.65 nm, a cold field emission source, or two or more beams | They must do this using light with a wavelength below 400 nm, an electron beam with a resolution of 1.65 nm or better, a cold field emission source, or two or more electron-beam sources | **Error.** The control counts electron-beam *sources*, not beams. A multibeam tool such as the 25-beam eScan 1100 the chapter describes can split one source into many beams, so "two or more beams" misstates what is controlled. "Resolving 1.65 nm" also dropped "or better". | FR 2024-28270 p. 37: "An electron-beam source with a resolution less (better) than or equal to 1.65 nm … Two or more electron-beam sources"; p. 18: "a cold field emission source, or two sources of any type" |
| 3 | How it works, inspection paragraph | …so anything that shows in one and not the others is a defect. The tool records where each defect is. | …so the tool flags anything that shows in one and not the others as a possible defect. It records where each one is. | **Error (overstated).** A die-to-die difference is a candidate. Most of the work in inspection is separating real defects from noise and nuisance events, which the chapter itself mentions later ("filter out noise"). | KLA Q3 FY26 letter p. 4: "AI-driven analytics, noise suppression" |
| 4 | Same paragraph, e-beam | …builds a picture from the electrons that bounce back. | …builds a picture from the electrons the beam knocks loose from the surface. | **Error.** E-beam inspection and review images are built mainly from secondary electrons, which the beam knocks out of the surface. Electrons that bounce back (backscattered) are a minor signal. | ASML eScan 1100 page: "collecting and processing the resulting secondary electrons" |
| 5 | Variants, Defect inspection | scans a whole wafer with light or electrons | scans a whole wafer with light, or small areas of it with electrons, | **Error, and it contradicted How it works** ("across a small patch"). E-beam is far too slow to scan whole wafers in production. That trade is why multibeam tools exist. | Skyverse 2025 summary p. 11: optical "可以较电子束检测技术快 1,000 倍以上"; e-beam "通常用于部分线下抽样测量部分关键区域" (sampling of key areas) |
| 6 | Who makes it, KLA paragraph | KLA says process control's share of fab spending is still rising ([source](…Q3+FY26.pdf#page=4)). | KLA says process control's share of spending on chipmaking equipment is still rising ([source](…Q3+FY26.pdf#page=12)). | **Error (wrong measure).** KLA's "process control intensity" is a share of wafer equipment spending. Fab spending also covers buildings and cleanrooms. Page 4 states the rise only for memory, but page 12 states it in general, so the citation moves there. The next sentence (memory, p. 4) is unchanged. | Investor day p. 30: "Intensity … Share of wafer equipment"; Q3 FY26 letter p. 12: "KLA is seeing consistent growth in process control intensity" |
| 7 | Who makes it, Applied Materials bullet | …next to the deposition and etch tools that create the defects. | …next to the deposition and etch tools whose work they check. | **Misleading.** Defects come from every step (handling, lithography, polishing, particles), not mainly from deposition and etch. | Parhami p. 10: defects from "scratches (e.g., from wafer mishandling), mask misalignment, or over/under-etching" and "airborne particles" |
| 8 | How it works, metrology paragraph | works out from the scattered light | works out from the reflected light | Precision. Film thickness (ellipsometry, reflectometry) and optical line width (scatterometry) both analyze light reflected off the test pad. "Scattered" suggests the diffuse light that darkfield inspection uses. | No new claim |
| 9 | Lead, first sentence | the machines that measure and inspect wafers | the machines that measure and inspect wafers and masks | Precision. CSET's $15.7 billion includes $2.2 billion of mask inspection and repair tools, which the chapter lists as a family. | CSET N60 description: "monitoring wafers, photomasks, and the overall chip manufacturing process"; N62 $2.2 billion |
| 10 | Variants, Overlay metrology | measures whether this layer sits on the one below | measures how well this layer lines up with the one below | Clarity. Every layer sits on the one below. Overlay is how well it lines up. | CSET N114: "the alignment accuracy between successive lithographic layers" |
| 11 | Variants, Film and shape metrology | how flat the wafer sits | how flat the wafer is | Precision. Shape metrology measures the wafer's own bow and warp, not how it lies. | CSET N65: "wafer surfaces, taper, warpage, and bow" |
| 12 | Packaging, AI and China, Onto sentence | Onto signed a volume purchase agreement estimated at over $240 million with an HBM maker for… | In February 2026 Onto said it had signed a volume purchase agreement estimated at over $240 million with a high-bandwidth memory (HBM) maker for… | The figure had no date, and HBM was not spelled out anywhere in the chapter. | Onto, 19 Feb 2026 (Wayback raw copy): "Closed a new volume purchase agreement estimated at over $240 million with a leading high bandwidth memory (HBM) manufacturer" |
| 13 | `plain` and its How it works twin (kept identical) | 49.2 percent of chips 1 centimeter square come out flawless, but only 11.3 percent of chips 2 centimeters square | 49.2 percent of chips 1 centimeter on a side come out flawless, but only 11.3 percent of chips 2 centimeters on a side | Clarity for readers worldwide. "2 centimeters square" is easily read as 2 square centimeters, which halves the area the lesson rests on. The body already says "a 2 by 2 centimeter die". | Parhami p. 8: "dies … 1 × 1 and 2 × 2 cm in size" |

No change to `oneLiner`, card text, keyFacts, figures or figure notes. Every sentence still carries at most one citation (checked by script).

## 2. The yield explanation and the `defects` animation: verdict

They now teach the right lesson: at the same defect density a die with four times the area comes out flawless far less often (49.2 against 11.3 percent), and each good die costs 20.1 times as much. Those are the source's own numbers (Parhami Example 5.2, p. 8) on its own die counts (120 and 26, Fig. 5.5). The frames I pulled from `media/defects-light.mp4` (t = 6.5 s, 10.5 s, end) show exactly that: same specks, half the small dies clean, three big dies clean, three readouts.

- **Fixed:** the one wrong sentence in the text, "the loss grows faster than the area" (change 1).
- **Correct as written:** "a clustering constant of 3 to 4". Parhami p. 7 calls a "a technology-dependent constant … in the range 3-4 for modern CMOS processes". In yield modeling, a in this (negative binomial) formula is the clustering parameter, and a smaller a means more bunching. The value range sits on p. 7 and the cited p. 8 uses a = 3 and a = 4.
- **Fine at this level:** the 49.2 and 11.3 percent leave out wafer yield (the source writes 0.492w and 0.113w). The chapter also says that spare blocks let more dies be sold (H100: 144 SMs designed, 132 enabled, Nvidia).
- **Wording to fix in the animation (proposal C1):** 0.8 defects per square centimeter is the textbook's assumption, far above what a mature leading-edge line runs. The chapter frames it as "a textbook example", but caption 1's "A textbook example puts them at 0.8 per square centimeter" reads like a measurement of real wafers.

## 3. Proposals for shared files (main session applies)

**A. `data/flashcards.json`, "metrology-and-inspection"**
1. Card 2 `why`. Before: "In a textbook example at the same density of defects, 49.2 percent of chips 1 centimeter square come out flawless, but only 11.3 percent of chips 2 centimeters square." After: "In a textbook example at the same density of defects, 49.2 percent of chips 1 centimeter on a side come out flawless, but only 11.3 percent of chips 2 centimeters on a side." (matches the chapter's `plain`)
2. Card 1 `why` (optional, accuracy). Before: "Their measurements tell a fab why its chips fail." After: "Their measurements help a fab find out why its chips fail." Takeaway 1, same change: "…check each wafer between steps and help a fab find out why its chips fail." Inspection shows where defects are and metrology whether a step hit its target. Finding the cause takes yield analysis on top.
3. Card 3 `why`: only if the owner rules out Gartner (section 4, item 1). Before: "Applied Materials, the next largest, held 11.2 percent. KLA, citing Gartner, put its own 2024 share at 56.5 percent. Every kind of tool had a second maker in 2025." After: "Applied Materials, the next largest, held 11.2 percent. Every kind of tool had a second maker in 2025."

**B. `data/glossary.json`**
1. "defect density" `why`. Before: "…49.2 percent of dies 1 centimeter square come out flawless, against 11.3 percent of dies 2 centimeters square. …" After: "…49.2 percent of dies 1 centimeter on a side come out flawless, against 11.3 percent of dies 2 centimeters on a side. …"
2. "critical dimension" `why` (figure has no year). Before: "Fabs measure it to tell whether each lithography and etch step came out the right width. Hitachi holds 71.9 percent of the market for the tools that measure it, the one kind of inspection or measurement tool that Japan leads." After: "Fabs measure it to tell whether each lithography and etch step came out the right width. In 2025 Hitachi held 71.9 percent of the market for the tools that measure it, by CSET's count. They are the one kind of inspection or measurement tool that Japan leads." (CSET N66, 2025: Hitachi 71.9, JPN 72.1)
3. "metrology", "overlay", "lot": correct, no change.

**C. Animation `defects` (`media/defects.json` and `STEPS` in `animations/defects.html`, then re-render)**
1. Step 1 `cap`. Before: "Specks of dust and tiny flaws land at random on every wafer. A textbook example puts them at 0.8 per square centimeter." After: "Specks of dust and tiny flaws land at random on every wafer. A textbook example assumes 0.8 per square centimeter." (Parhami p. 8: "Assuming a defect density of 0.8/cm2")
2. Optional, low priority (the drawing already shows a big die covering four small ones): step 2 "Of chips 1 centimeter on a side, 49.2 percent…", step 3 "Chips 2 centimeters on a side are bigger targets…", canvas labels "Small chips, 1 × 1 cm" and "Big chips, 2 × 2 cm". If applied, I would change the figure note in ch 7 to match: "120 chips 1 centimeter on a side, or 26 chips 2 centimeters on a side". I left the note alone so it matches the captions as they stand.

**D. `data/bibliography.json` dates (taken from PDF metadata, not the documents)**
1. KLA Letter to Shareholders Q4 Fiscal 2026 (`…10668/…Q4+FY26.pdf`): `"date": "2026-07-27"` → `"2026-07-28"`. Cover: "QUARTER ENDED JUNE 30, 2026 | REPORTED JULY 28, 2026". 27 July is the PDF's creation date.
2. KLA investor day deck (`…10653/file/2026+Investor+Day+Master+Final_IR+copy.pdf`): `"date": "2026-03-13"` → `"2026-03-12"`. Cover: "Welcome to Investor Day March 12, 2026". 13 March is the PDF's creation date.

New bibliography entries: none.

## 4. Open questions for the owner

1. **Gartner through KLA (rule: never cite Gartner).** The investor-day chart the chapter cites says "Source: Gartner April 2025" (p. 35). This is the same question as ch 06's TEL chart, so I left it for your decision. It appears in the lead (sentence 3), the card's `usStatus` (sentence 2), keyFact 4 and flashcard 3. Swap if you rule it out:
   - Lead, drop: "At its March 2026 investor day KLA cited Gartner's figures for 2024, which put its share at 56.5 percent, 6.5 times its nearest competitor ([source](…#page=35))."
   - `usStatus` → "In 2025 the American firm KLA was the world's largest maker of metrology and inspection tools." and `usSources` → the N60 URL only. (Alternative second sentence from CSET: "American firms held 71.7 percent of the market that year, by CSET's count." That needs the body sentence "By the same count, American firms held 71.7 percent of the market ([source](https://chipexplorer.eto.tech/?parentNode=N118&selectedNode=N60))." after the lead's CSET sentence.)
   - keyFact 4: remove. Flashcard 3: proposal A3.
2. **KLA's claims that rest on unnamed "industry research reports".** The Q3 FY26 letter (p. 3) introduces its 2025 share claims with "Recently published industry research reports showed…". This covers the lead's "about 7 times", Who makes it sentences 1 and 2 (3.6 points, share gains), the packaging sentence (#1 in advanced wafer-level packaging, +14 points), The chokepoint sentence 4, and keyFacts 2 and 3. keyFact 2 is shown in the home walk. These are KLA's own attributed claims, so I kept them. If you want CSET only, the packaging replacement is "By CSET's count, KLA was also the largest maker of the tools that inspect wafers during advanced packaging in 2025, with 56.5 percent ([source](https://chipexplorer.eto.tech/?parentNode=N69&selectedNode=N63))." and keyFact 2 → "CSET's count puts KLA at 56.5% of the $1.2 billion market for tools that inspect wafers during advanced packaging in 2025, ahead of Onto Innovation at 28.1% and Camtek at 14.4%" (source: the N63 URL). If Who makes it loses its first two sentences, its next sentence should begin "KLA's revenue for fiscal 2026…".
3. **Specimen caption "The column is about a meter tall, drawn to scale."** No source. The size is the model's own (`specimens/sem-column.js`: "About a metre of column"). It is plausible for a column with its high-voltage gun, but if every figure needs a source, drop "about a meter tall".
4. **`oneLiner` (optional, needs a share-card re-render):** "tools that measure and inspect wafers" leaves out mask inspection (14 percent of CSET's market). It could read "…tools that measure and inspect wafers and masks…". I changed only the lead.
5. **For the export-control experts (no change made):** the October 2022 control covers "any item subject to the EAR", which includes US-made items and some foreign-made ones (FR 2022-21658 p. 5). The chapter's "any US-made item" is true but narrower. The control is still in force: eCFR § 744.23(a)(2)(i), version of 15 January 2026, now covers Macau and Country Group D:5.

## 5. Figures checked against their sources (all match)

- **CSET/ETO.** Open data on GitHub (georgetown-cset/eto-supply-chain, provision.csv updated 12 to 13 Aug 2026, "Data … published by TechInsights on July 3, 2026"):
  - Whole market (N60): $15.7B; KLA 56.8, Applied 11.2, Lasertec 6.4, Hitachi 6.2, ASML 5.9, Nova 4.3, Onto 2.6, Camtek 1.6, Rigaku 1.2, others 3.8; China 0.7.
  - Mask inspection and repair (N62): $2.2B, KLA 45.9 / Lasertec 42.0 / Zeiss 10.1, no Chinese row.
  - Film and shape (N65): $2.6B, KLA 45.6 / Nova 24.6 / Onto 10.9; China 2.0, all RSIC.
  - CD metrology (N66): $1.2B, Hitachi 71.9 / Applied 27.5; China 0.4.
  - Defect inspection (N67): $6.7B, KLA 85.9; China 0.6.
  - Overlay (N114): $991.4M, KLA 51.5 / ASML 47.9.
  - E-beam metrology (N115): $1.3B, Applied 45.1 / ASML 35.6 / KLA 18.8.
  - Defect review (N116): $729.1M.
  - Packaging inspection (N63): no Chinese row.
  - Eight firms above 1 percent. KLA leads 4 of 8 kinds. Every kind has a second maker.
  - The `pc-segments` and `pc-share` figures match.
- **KLA.**
  - Q4 FY26 letter: p. 2 ($1.1B packaging process control systems, up more than 70 percent; AI and packaging), p. 5 (product mix 49/22/20/4/4/1; patterning up 61 percent; Taiwan 31, China 26), p. 7 ($120B in 2025).
  - Q3 FY26 letter: p. 3 (360 bp, ~7x, packaging #1 and +14 points), p. 4 (memory reasons, AI analytics and noise suppression, five years of AI).
  - Investor day: p. 35 (56.5 percent, 6.5x, Gartner) and p. 91 ("Actinic 7xx … Early Demo Stage").
  - SEC XBRL revenue: FY2026 13,579,476,000 and FY2025 12,156,162,000.
- **Others.**
  - Nova: XBRL 880,577,000. Its own 6-K of 12 Feb 2026 says "$880.6 million".
  - Onto: $1,005.3M (19 Feb 2026). Rigaku stake: 27 percent for "approximately US$720 million", closed 10 Aug 2026 (8-K Exhibit 99.1).
  - Camtek: $496.1M, up 16 percent from $429.2M (6-K, 18 Feb 2026).
  - Skyverse: p. 12, 2,053,298,171.74 yuan, +48.75 percent. p. 11, low domestic share and KLA largest in China.
  - Parhami: pp. 7, 8, 10, 23.
  - Nvidia: 144 and 132 SMs.
  - ASML eScan 1100: 25 beams, up to 15x, 7 nm.
  - Lasertec ACTIS A150: "World's first EUV patterned mask inspection system", 13.5 nm.
  - FR 2022-21658: pp. 5 and 16. FR 2024-28270: pp. 17, 18, 37 and 38. BIS press release of 2 December 2024: SME FDP covers Macau and D:5.
- **Newer filings.** None replaces a figure the chapter presents as current.
  - KLA's next results (Q1 FY2027) are not out as of 20 October 2026.
  - The FY2026 10-K (6 Aug 2026) matches the chapter.
  - CSET's August 2026 update is the latest.
  - The Commerce Control List text for 3B993.q and 3B994.q.3 is unchanged in eCFR as of 28 August 2026, so "It controls" is still right.

## 6. Links

The chapter cites 22 URLs. I fetched every one with the generic research User-Agent.
- 20 answer 200 and say what their sentences say.
- 2 are Onto investor pages that return 403 to bots. The Q4 2025 release read cleanly from its raw Wayback copy. The Rigaku release has no usable Wayback copy (one 301 capture only), so I read the same press release on sec.gov: Exhibit 99.1 to Onto's 8-K of 10 Aug 2026, https://www.sec.gov/Archives/edgar/data/704532/000119312526341337/d125405dex991.htm. Both pages open in a normal browser, so I left both citations as they are. The SEC copy is a drop-in alternative if you want a link every reader and checker can open.
- Broken links: none.

## 7. Build and checks
See the summary returned to the main session (run once, at the end).
