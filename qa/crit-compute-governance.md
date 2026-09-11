# Critique: compute governance researcher

Read 10 September 2026 against the local build, rules checked against the eCFR (15 CFR parts 740,
742, 772, 774, as of 1 September 2026) and the Federal Register via govinfo. Screenshots in
`qa/crit/cg-*.png`.

## 1. Would I send it to a colleague

Yes, with a specific caveat: it is authoritative on the China rules and eighteen months behind on
everything else. The vocabulary is right where most explainers are wrong. TPP is quoted from the
technical note rather than paraphrased, and 3A090.c is quoted at 2 GB/s per mm2, which is what 89 FR
96790 set and not the 3.3 figure that circulates. I recomputed the TPP of all 35 chips and every one
matches the rule's formula at the highest bit length, as Technical Note 2 requires; eleven Federal
Register citations I spot-checked through govinfo all resolve to the document the site links. But the
site still describes the world outside China under the pre-January-2025 rules, and that is the half a
colleague would quote back at me.

## 2. What the field checks first

**The board.**

*The rest-of-the-world row is wrong,* and it is the row my field opens first. It reads "AI chips to
the rest of the world: NO LICENCE", and the flow text gives the pre-January-2025 scope. Today 15 CFR
742.6(a)(6)(iii)(A) is headed "Worldwide license requirement" and names 3A090.a and 4A090.a "to or
within any destination worldwide". Chips reach allies through License Exception AIA (740.27) for the
nineteen destinations in supplement no. 5 to part 740, and LPP (740.29) for 26,900,000 TPP per
consignee a year elsewhere. Correct label: "Licence required worldwide; AIA for nineteen
destinations."

*The board opens in 2018.* At first paint it says "Board as of 15 Apr 2018" and every row reads NO
LICENCE (`cg-board.png`); it winds forward only as you scroll, so anyone who screenshots the panel on
arrival captures the 2018 world. Default to Now.

*The HBM row overstates denial.* 742.6(b)(10)(ii) sets a presumption of **approval** for 3A090.c to
China or Macau where the entity is not headquartered there, denial otherwise. That is what keeps SK
hynix's and Samsung's Chinese sites and allied packaging houses supplied.

**The Index.** TPP, performance density, 3A090, presumption of denial, NAC and ACA are correct,
including the point most explainers miss, that NAC does not cover datacentre parts meeting 3A090.a.
Two corrections.

- *License Exception LPP* says the diffusion framework "was rescinded on 13 May, so it never bound
  anyone". Sections 740.27 (AIA), 740.28 (ACM), 740.29 (LPP), supplement no. 5 and the 790,000,000
  TPP per-country allocation at 742.6(b)(10)(iii)(B) are in the eCFR today, source notes ending at 90
  FR 5309, with no later rule removing them. Say instead that BIS announced in May 2025 that it would
  not enforce and the text was never withdrawn. It matters because the January 2026 rule hangs its
  presumption of approval on supplement no. 5.
- *License Exception HBM* says "anything above 3.3 needs a licence even for allied supply chains".
  The CCL applies RS controls on 3A090.c only "to or within Macau or a destination specified in
  Country Group D:5", so allied shipments need no licence at any density. The 3.3 GB/s per mm2
  ceiling in 740.25(c) closes co-packaging inside China above that density.

Note 2 to 3A090 also exempts non-datacentre parts under 4800 TPP, the gaming-card question,
unanswered on the site.

**HBM chapter.** The best account I have read of why one density line works as a ban. Add 740.25 and
the approval presumption; CXMT gets an adjective where the rest of the site gives numbers.

**Lithography.** Correct on ASML. Its control paragraph is the thinnest thing in the chapter: nothing
on servicing, parts or the installed DUV base in China, where the rules now bite.

**AI Chips.** The strongest research object here, with one finding unused in it: BIS set the January
2026 ceiling at 21,000 TPP and the MI325X, named in the rule, measures 20,919.

**Chapter 17.** The best chapter, and two rows of its table contradict the matrix that feeds it.
Photoresist reads "Japan, 75%, revenue, 2024" and credits CSET's 2021 map; `chokepoint-matrix.json`
carries 78.4 percent for 2023 from METI's December 2025 deck, and its note says CSET's brief
"contains no photoresist country table at all" and that the 75 split was retired as unsourced.
Silicon wafers reads 51 percent, 2025 against the matrix's 53 percent, 2023. It dates the H200 move
13 January; 91 FR 1685 is effective 15 January.

## 3. What a compute governance reader expects and does not find

**Cloud and remote access. Belongs, and it is the biggest hole.** Your own source makes the consignee
"prevent unauthorized remote access to unauthorized parties" (91 FR 1685). Renting an H200 in
Singapore is not an export. 250 words in chapter 17 and one board row.

**The diffusion rescission and its replacement. Belongs, and is currently wrong.** 200 words: what
survived in the CFR, what BIS stopped enforcing, and the named-consignee mechanism the UAE rule uses
instead of quotas, as your `uae-a5-2026` note says.

**Compute thresholds. Belongs, 120 words in the Index.** 10^26 in the 2023 executive order and the
4E091 control, 10^25 in Article 51(3) of the EU AI Act. Both sit in `control-thresholds.json`, which
the site never renders. "FLOP" appears zero times in seventeen chapters.

**Chinese capacity. Half there.** SMIC wafer starts and the 13 million stack arithmetic are the best
public version I know; CXMT and yield are adjectives. 150 words, with ranges and a confidence.

**Energy as a control point. Belongs, 120 words in chapter 15,** which treats power as a build
constraint only.

**Location verification: out of scope** beyond the Chip Security Act sentence. **Smuggling: no gap.**
**Leverage against enforcement:** BIS licence counts belong on the board.

## 4. The ratings

The two tests behind Substitutability, a qualified second source at the leading node and time to
qualification, are the right two. Two the field also uses are missing. Consumable against capital: a
photoresist cut-off bites in weeks, a scanner cut-off in years, and the card cannot say so. Legal
against physical: Very hard lumps physics, know-how and IP, and only the first survives a government
decision. Add a third line, "time to bite", and split that test.

Concentration is Extreme or High on all seventeen cards, so it separates nothing. Re-rate three:
chemicals and photoresist from Moderate to Hard (one country at 78 percent, requalified layer by
layer); advanced packaging from Moderate to Hard (your B200 note calls CoWoS-L the binding constraint
on AI compute, and EMIB is a technology, not a qualified second source at volume); and chapter 17
should carry no rating, because geopolitics is not a stage.

## 5. The launch post

It lands and the voice is right. Three edits.

The opener is the most familiar fact in the field. Replace "One Dutch company built every
extreme-ultraviolet lithography machine sold in 2025. It shipped 48 of them, at around $200 million
each" with the line only you can write: "In January 2026 Washington set the ceiling for legal AI chip
sales to China at 21,000 points of processing performance. The AMD MI325X measures 20,919. Export
control is now written to four significant figures, and this site does the arithmetic for 35 chips."
That is the sentence that would make me click.

Push back on the Nvidia claim. "Nvidia's went from 26.4 percent of sales in fiscal 2022 to 9.1
percent in fiscal 2026" invites the reading that China sales collapsed; your `exposure.json` shows
China revenue rising from $7.1bn to $19.7bn across those years. Write it as "Nvidia's China sales
nearly tripled while falling from 26.4 to 9.1 percent of revenue, which is what a control that
redirects demand rather than destroying it looks like."

Two fixes: the 48 EUV systems were booked as revenue rather than shipped, and four were High-NA at
$350m to $400m, so "around $200 million each" understates them; and "most of them in one country" is
not true of your cards, where the eight Extreme stages sit across five.

## 6. Five improvements, ranked

1. **Fix the rest-of-the-world row and the diffusion entries.** Board, Index. Half a day.
2. **Default the board to Now.** Board. Two hours.
3. **A cloud and remote access section, plus a board row.** Chapter 17, board. One day.
4. **Reconcile chapter 17's table to the matrix, and link the four notes files,** still referenced
   nowhere in `index.html`. Chapter 17. Half a day.
5. **Add "time to bite" to the card and re-rate three stages.** All chapters. One day.
