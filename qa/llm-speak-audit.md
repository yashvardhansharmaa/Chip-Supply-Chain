# LLM-speak audit

Read of every chapter, the glossary, the landscape notes, the method notes, the UI copy and the built page.
Quotes verified against the live files at **11:26, 9 September 2026**. Chapters are being edited by other
people while this was written; four quotes I had logged an hour earlier (in 18) were already gone by the
time I verified, and chapters 01, 03, 04, 07, 09, 10, 14, 15, 16, 17 and 18 all changed under me during the
read. Anything in the table below was present at 11:26. Grep the phrase, not the line number.

---

## 1. Verdict

The prose is much better than most machine-written work and it is not fooled by the obvious tells. The
vocabulary is clean: no *delve*, no *tapestry*, no *robust*, no *seamless*, no *navigate*, no *unlock*, no
*foster*, no *transformative*, no *game-changer*, no *paradigm*, no *holistic*, no *arms race*, no *stark* or
*sobering* or *striking*, no *testament*, no *underscores*, no *in today's*, no *at the end of the day*, no
chatty *let's*, no *massive/enormous/huge/vast*, no *in order to*, no *utilise*, no *facilitate*, no rhetorical
questions answered in the next sentence, no *not only X but also Y*, no *Whether … or …* openers, no
hedging triad. Somebody has already swept the word list. Sentence lengths vary properly. The numbers are
real and the citations are attached to them.

What gives it away is **rhythm, not vocabulary**. The site has one paragraph shape and uses it about four
hundred times: three or four dense, cited, 20-to-30-word sentences, then a short flat sentence that lands the
point. Roughly 45 body paragraphs end that way, and about 35 of those endings are rhetorical rather than
informative — *Not one is Chinese.* *Washington noticed.* *Neither is finished.* *KLA is the segment.* Read
one chapter and it is a strong writer's tic. Read eighteen and it is a machine cadence: the reader starts
hearing the drumbeat before the sentence arrives.

Three other structures repeat past the point where they read as choices:

- **The "X, not Y" tag** stapled to the end of a sentence — 27 live instances, in every chapter except 14.
  Four appear inside one bullet list in 17.
- **The numeric list stem** — a bare sentence whose whole job is to announce how many bullets follow
  (*A design runs through five phases.* / *Three consequences follow.* / *Adoption splits two ways.*) — 11
  live instances. This is the "Here are three things:" scaffold with the "Here are" filed off.
- **The superlative-slot sentence.** Nearly every chapter contains one sentence of the form "this is the
  [most/cheapest/quietest/tightest] X in the chain". Nine chapters claim the same real estate, so the
  claims cancel each other out and the reader stops believing any of them.

**Worst chapters, by density of machine cadence, not by word count:**

1. **11 Memory and HBM.** Thirteen flagged instances in about 2,000 words, and the highest concentration
   of two-to-five-word kicker sentences on the site (*Washington noticed.* / *Nobody ships the baseline.* /
   *Three firms in the world can do it.*). Nearly every subsection ends on a beat.
2. **08 Metrology and Inspection.** Opens with an antithesis pair that the one-liner has already used
   verbatim, then runs *quietest* → *tightest* → *most durable lever* superlatives, plus the
   absence-of-evidence chiasmus, which is a stock phrase.
3. **12 Advanced Packaging.** Eleven instances; four consecutive paragraphs in *How it works* and
   *Capacity* each end on a kicker, and the section ends by telling the reader that the silence "is itself
   the story".
4. **05 Lithography.** Four numeric list stems in one chapter, plus the *one firm / one town / one optics
   house* anaphora in the takeaways.
5. **18 Geopolitics.** The most flagged instances in absolute terms, and the **Predicted winners** section
   is the single most machine-shaped block on the site: six bullets, each a bold epigram of the form
   "*Country* wins/loses *thing*", in strict parallel, with an aphorism to close. It reads as generated
   rather than argued, which is a shame, because the underlying judgments are the most valuable thing on
   the site and they are the part a sceptical reader will discount first.

**Cleanest chapters:** 07 Deposition and etch and 14 Test and assembly (the latter partly because someone
was rewriting it as I read). 09 Transistors is close behind.

The glossary is well written but has a visible template: 16 of its 74 "why it matters" lines open with
"It is …", and 14 of its 74 definitions end on a kicker sentence beginning "It is …". Two pairs of entries
carry near-identical sentences. Fixed below.

The `data/landscape-notes.md` chip pages are the best prose on the site and also the most formulaic in
structure: 15 of 18 sections open with the same superlative-identity sentence ("X is the only / the first /
the purest / the clearest …"). Off limits to edit; flagged in §3.

The UI copy was the weakest layer, because it repeats one rhetorical sweep — "from sand to a rack" — in
four different places, and had two flourish sentences that exist only for cadence. Fixed; see §4.

---

## 2. Instances I would change

Chapter files are `content/NN-*.md`. "Card" means the JSON front matter (one-liner, plain, card fields,
specimen caption), which renders in the chapter head and on the Summary page.

### 01 Introduction and Goals — `content/01-introduction-and-goals.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Card, `oneLiner` | `from sand to a rack` | The sweeping "from X to Y" range, and the same sweep appears four more times in the UI chrome and in the body. One use is a phrase; five is a template. | Keep it here (it is the site's own line) and cut it everywhere else — done in §4. |
| Card, `plain` | `Think of building a car in which` | One of three "Think of …" analogy openers (11, 15, 17 also use it) plus one "Picture …" (16). Four of eighteen plain-English boxes open with the same instruction to the reader. | `Building an AI chip is like building a car in which the engine, the gearbox and the wheels each come from a single factory somewhere in the world, with no second factory able to make them.` |
| Lede | `Every chapter answers three questions` | Numeric stem, then a rhythm triplet ("how the stage works, where the trade-offs sit, and who controls it"). | `Every chapter covers how the stage works, where the trade-offs sit, and who controls it.` (drop the count; the list is right there) |
| Why does the supply chain matter? | `Both are true, and they do not cancel.` | Aphoristic kicker closing the paragraph; the sentence carries no information the reader does not already have. | `Neither finding cancels the other.` — or cut, and start the next sentence `Cheaper inference has raised…` |
| Why does the supply chain matter? | `The supply chain sets how much AI exists, who can afford it, and which governments can switch it off.` | Rhythm triplet as a closing flourish. The third item is the real claim; the first two are padding for the cadence. | `What the supply chain sets is the volume, the price, and which governments can switch it off.` (or keep only the third clause) |

### 02 Chip Design, EDA and IP — `content/02-design-and-eda.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Card, `plain` | `That is why cutting off the software cuts off the chip.` | Aphoristic close plus chiasmus ("cutting off … cuts off"). | `That is why a government that controls the software controls the chip.` — or plainer: `Withhold the software and the design cannot be manufactured.` |
| Card, `usStatus` | `This is the fastest-acting lever in the entire chain.` | "The [superlative] X in the entire chain" — the site makes nine competing versions of this claim. "entire" is filler. | `No other control in the chain acts this fast.` |
| Lede | `Design is the only stage in this chain with no fab, no cleanroom and no hazardous gas.` | Rhythm triplet of negations. | `Design is the only stage in this chain with no factory.` |
| How it works | `A design runs through five phases.` | Numeric list stem: a sentence whose only content is the number of bullets below it. | Delete. The bold labels already number themselves. |
| How it works | `What disciplines the work is not the licence fee but the cost of a mistake.` | "not X but Y" plus a fronted "What … is" cleft — two constructions doing one job. | `The licence fee is not what disciplines the work. A mistake costs a mask set.` |
| Who makes it | `Design services are tighter still` | "tighter still" is used three times on the site (also 04 twice). | `Design services are narrower again` |
| The chokepoint | `The lever works, and needs no allied coordination and no lead time.` | Aphoristic close built on paired negations. | `The lever needs no allied coordination and no lead time.` |
| The chokepoint | `the gap is foundry-validated corner cases, not features.` | "X, not Y" tag. | `the gap is in foundry-validated corner cases rather than in features.` |
| Key evaluation criteria | `A point tool is replaceable; a signed-off flow is not.` | "X, not Y" in semicolon form, and it restates the sentence before it. | Cut; the preceding sentence already says a point tool is replaceable. |
| Takeaways | `Closest is not close.` | Three-word aphoristic fragment. The most machine-flavoured sentence in the chapter. | Cut, and finish the previous sentence: `…and the one China is closest to neutralising, though CSET still puts a complete domestic flow out of reach.` |

### 03 Silicon and Wafers — `content/03-silicon-and-wafers.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| How it works | `Almost every step throws material away.` | Kicker sentence after a 40-word technical paragraph. | Fold in: `…grown on top at about 1,200 degrees Celsius, with almost every step throwing material away.` |
| Who makes it | `Not one is Chinese.` | Four-word aphoristic fragment. | `None of the five is Chinese.` |
| The chokepoint | `Domestic makers are building, but from that base.` | Kicker; "from that base" is a gesture rather than a fact. | `Domestic makers are building, from under 1 percent of the 300 mm market.` |
| Prime versus epitaxial | `Epi costs more, and it carries the leaders' margins.` | Kicker with an unattributed claim about margins. | `Epi costs more, which is where the five suppliers make their money.` |
| Takeaways | `Watch the epitaxial mix rather than square inches` | Imperative "Watch X rather than Y" closer; the same shape closes 04 and 16. | `The number to follow is the epitaxial mix, not total area shipped.` — or, better, vary it: only one chapter should end on an instruction to the reader. |

### 04 Chemicals, Gases and Photoresist — `content/04-chemicals-gases-and-photoresist.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Lede | `A modern fab is a chemical plant with lithography attached.` | Epigram opener. Every chapter opens with one; the effect across eighteen is mechanical. | Keep this one — it is the best of them — and cut the epigram openers in 06, 08 and 12 so it stands out. |
| Who makes it | `A government now controls the company that owns Inpria.` | Kicker restating the previous sentence (which already said a state-backed fund took 84.36 percent). | Cut, and end on the cited fact. |
| Who makes it | `Others are expanding on AI demand.` | Numeric-stem variant: a stub sentence whose only job is to introduce two bullets. | Delete; run the bullets straight on. |
| Who makes it | `The consumables are tighter still.` | Second "tighter still" in one chapter. | `The consumables are narrower again.` |
| The chokepoint | `Twice since 2019 the industry has lost a supplier country` | Numeric stem opening the section, then two dated paragraphs that make the count obvious. | `The industry has lost a supplier country twice since 2019, and neither time did a fab stop.` (one sentence, no count-then-list) |
| The chokepoint | `None of this touches silicon logic.` | Kicker fragment opening a paragraph. | `Neither metal goes into a silicon logic chip.` |
| The chokepoint | `China's own lever is metals, not molecules.` | "X, not Y" plus alliteration; the alliteration is what marks it. | `China's lever is the metals rather than the process chemicals.` |

### 05 Lithography — `content/05-lithography.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Lede | `No other stage in this chain has a single point of failure this sharp.` | The superlative slot again. Chapters 06, 08, 11, 12 and 13 each claim a version of the same title. | Cut. The preceding sentence — 48 EUV systems, nobody else sells one — has already made the point harder. |
| How it works | `That is the commercial case for EUV.` | Kicker restating the sentence before it. | Cut. |
| High-NA EUV | `Adoption splits two ways.` | Numeric stem. | `Intel and TSMC have split on it.` (says something; still introduces the bullets) |
| Who makes it | `Four carry the EUV machine.` | Numeric stem, four words. | `Four of them carry the EUV machine:` and run into the bullets. |
| Who makes it | `It is a real technology with no leading-edge logic customer.` | Kicker; "It is a real X with no Y" is a stock concessive. | `No leading-edge logic customer has adopted it.` |
| Controls and China's answer | `Below EUV, the restrictions came in three moves.` | Numeric stem. | `Below EUV, the restrictions arrived in this order.` |
| Controls and China's answer | `China's answer has two tracks.` | Second numeric stem in the same section. | Delete; the two paragraphs that follow are visibly two tracks. |
| Controls and China's answer | `Mirrors are the reason: only Zeiss makes optics to that figure.` | Colon-reveal construction ("The reason: X"), used four times on the site. | `Only Zeiss makes mirrors to that figure.` |
| The chokepoint | `the hardest parts sit at Zeiss and Trumpf, not in Veldhoven` | "X, not Y" tag. | `the hardest parts sit at Zeiss and Trumpf rather than in Veldhoven` |
| The chokepoint | `For AI accelerators the leverage is in EUV` | *leverage* used as an abstract noun; it appears eight times across the site. | `For AI accelerators, EUV is the point of control` |
| Takeaways | `One firm, in one Dutch town, using mirrors from one German optics house` | Anaphora on "one" — a rhetorical figure, not reporting. | `ASML, in Veldhoven, using Zeiss mirrors from Oberkochen, gates the resolution of every leading-edge AI chip.` |
| Takeaways | `Nothing on the horizon changes the shape of this bottleneck before 2030.` | Aphoristic close on a vague image ("on the horizon", "the shape of"). | `No announced programme changes this bottleneck before 2030.` |

### 06 Photomasks and Pellicles — `content/06-photomasks-and-pellicles.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Lede | `A scanner can only print what is on the mask.` | Epigram opener of the "X can only Y" kind. | `Every EUV layer on an AI accelerator needs a defect-free reticle.` (promote the second sentence) |
| How it works | `Three consequences follow.` | Numeric stem, three words. | Delete; run straight into the bullets. |
| Blanks | `The blank is the hard part.` | Five-word kicker opening a paragraph. | `The blank is where two decades of learning sit.` (merge with the sentence after) |
| Cost and design economics | `Call the leading edge $10 million to $40 million.` | Imperative-to-the-reader flourish. | `At the leading edge the range is $10 million to $40 million.` |
| Cost and design economics | `That is the quiet reason so much AI silicon converges on a handful of designs.` | *quiet* used as a rhetorical intensifier. Three "quiet/quietly" on the site, all doing the same job. | `That is why so much AI silicon converges on a handful of designs.` |
| The chokepoint | `Pellicles are the open sore.` | Metaphor-as-label opener; the metaphor does no work. | `Pellicles are the unsolved part.` |
| Takeaways | `Photomasks are the cheapest critical chokepoint in this chain, and that is what makes them dangerous.` | Superlative slot plus a paradox tag ("cheapest … dangerous") of the same shape as 13's "least glamorous and most binding". | `Photomasks are the cheapest chokepoint in this chain, which is why nobody has funded an entrant.` |
| Takeaways | `quietly decide which AI chips get designed at all` | Second *quietly* in one chapter; "at all" is filler. | `decide which AI chips get designed` |

### 07 Deposition and Etch — `content/07-deposition-and-etch.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Etch families | `AI raises the difficulty in three specific places.` | Numeric stem; "specific" is filler. | `AI raises the difficulty in three places.` → better, delete and let the bullets stand. |
| China and the controls | `The controls tightened in four moves.` | Numeric stem. | `The controls tightened in stages.` |
| China and the controls | `China is the largest customer and the fastest-improving competitor at once.` | Antithesis-as-topic-sentence; "at once" is the tell. | `China is both the largest customer and the fastest-improving competitor.` |
| Takeaways | `want better selectivity and deeper holes, not more chambers` | Anthropomorphised process ("gate-all-around, HBM and backside power **want**") plus an "X, not Y" tag. | `need better selectivity and deeper holes rather than more chambers` |

### 08 Metrology and Inspection — `content/08-metrology-and-inspection.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Lede | `No fab is built around its inspection tools. Every fab fails without them.` | A no/every antithesis pair — and the card one-liner has already used the identical construction ("Nobody builds a fab around process control, and every fab fails without it"). The reader meets the same joke twice in four lines. | Cut the lede pair entirely and open on the cited fact: `KLA tells its shareholders it holds roughly seven times the share of its nearest competitor…` |
| Lede | `Process control is the quietest chokepoint in this chain and one of the tightest` | *quietest* plus superlative slot, doubled. | `Process control is about a tenth of fab tool spending and one of the tightest segments in it.` |
| Variants and trade-offs | `Five families of tool do the work, trading sensitivity against speed.` | Numeric stem with a rhythm clause attached. | `The tools trade sensitivity against speed.` |
| Variants and trade-offs | `Optical carries the volume; e-beam catches what optical cannot see.` | Balanced-clause restatement of the two bullets above it. | Cut; both bullets already say it. |
| Who makes it | `KLA is the segment.` | Four-word aphorism. | `KLA is most of the segment.` (also more accurate) |
| Who makes it | `The rest is specialised, not second.` | "X, not Y" fragment. | `The rest are specialists rather than runners-up.` |
| Who makes it | `The moat is analytics as much as optics` | *moat* — investor jargon used as metaphor, twice on the site. | `The advantage is analytics as much as optics` |
| Packaging, AI and China | `That is an absence of evidence rather than evidence of absence.` | A stock epigram. Nothing in the sentence is about semiconductors. | `Nobody has published a Chinese gain here, which is not the same as there being none.` (replaces both this and the sentence after it) |
| The chokepoint | `Process control is a chokepoint by concentration, not by physics.` | "X, not Y". | `Process control is a chokepoint of concentration rather than of physics.` |
| Takeaways | `which makes it the most durable lever in the chain` | Superlative slot again — the fourth in one chapter — and *lever* is the site's third-favourite abstract noun. | `which is why the controls on it are the hardest for China to work around` |

### 09 Transistors and the Front End — `content/09-transistors-and-front-end.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Gate-all-around nanosheets | `Read those numbers as marketing until someone measures the silicon.` | Second-person instruction to the reader; the site does this five times. | `Those numbers are vendor claims until someone measures the silicon.` |
| The back end of line | `Two metals are taking the narrow levels:` | Numeric stem with a colon. | `Two metals are moving into the narrow levels.` → or just delete and lead with the bullets. |
| Who makes it | `Node names mean nothing physical.` | Four-word aphorism opening a paragraph. | Merge with the sentence after it: `Node names describe nothing physical: SMIC's N+3, sold as 5 nm-class, has a 32.5 nm minimum metal pitch…` |
| Who makes it | `Logic shrank; cache did not` | Balanced-clause antithesis; also restates the sentence before. | `The logic shrank and the bit cell did not, which is much of why accelerators push memory off-die.` |
| Takeaways | `new materials, not geometry` | "X, not Y" tag closing the first takeaway. | `process steps and new materials rather than geometry` |

### 10 Foundries and Fabs — `content/10-foundries-and-fabs.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| How it works | `The model won on arithmetic.` | Five-word kicker. | Cut; the BCG sentence that follows makes the argument. |
| How it works | `No design house sells enough of one product to fill that.` | Kicker closing the paragraph. | Keep — this one earns its place; it is the reason the model exists. (Flagged only so the tally is complete.) |
| Pure-play foundries | `Nobody else earns leading-edge margins, so nobody else can fund the next node from cash flow.` | Anaphora on "nobody else". | `Nobody else earns leading-edge margins, so nobody else can fund the next node from cash flow alone.` → or drop the repetition: `No other foundry earns those margins, so none can fund the next node from cash flow.` |
| Who makes it | `Washington bought an option on Intel not spinning off its fabs.` | Aphoristic reframing of the cited warrant terms; clever, but it is the third such reframing in the chapter. | Cut, or fold into the sentence above: `…exercisable only if Intel ceases to own 51 percent of the foundry business, which makes the warrant an option on Intel keeping its fabs.` |
| The chokepoint | `That stacks three risks on one island.` | Numeric stem before three bullets, plus a hedge ("We think the first two are manageable and the third is not"). | `Three risks stack on one island, and we think only the third is unmanageable:` |
| The chokepoint | `Until then, the leading edge is Taiwan.` | Kicker. | Cut; the BCG projection sentence before it already says this. |
| Key evaluation criteria | `Intel Foundry's loss is a yield story, not a demand story.` | "X, not Y" tag. | `Intel Foundry's loss comes from yield, not from a shortage of demand.` (same shape but the contrast is doing real work — if only one "X, not Y" survives per chapter, keep this one) |

### 11 Memory and HBM — `content/11-memory-and-hbm.md`

The highest density on the site. Almost every subsection ends on a beat.

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Card, `plain` | `The fix is not a faster runner but a wider door` | "not X but Y" inside the analogy. | `The fix is a wider door, not a faster runner` → better, drop the negation: `so the door is made wider: high bandwidth memory stacks up to sixteen memory chips into a cube…` |
| Card, `plain` | `Three firms in the world can do it.` | Numeric kicker closing the plain-English box. Chapter 09's box ends the same way ("Three companies can run that sequence"), and 02's one-liner opens with "Three software firms". | `Only SK hynix, Samsung and Micron can do it.` (names beat a count) |
| Lede | `The arithmetic got cheap. The dragging did not.` | Two-clause antithesis pair of the kind the site uses in 08, 09, 16 and 18. | `Arithmetic got cheap faster than memory bandwidth did.` |
| How it works | `The width is the whole trick.` | Six-word kicker. | Cut; the next sentence explains the width and does it better. |
| How it works | `capacity and bandwidth, not arithmetic` | "X, not Y" tag. | `capacity and bandwidth rather than arithmetic` |
| HBM4 | `Nobody ships the baseline.` | Four-word kicker. | Merge forward: `Nobody ships at that baseline: SK hynix completed HBM4 at over 10 Gb/s per pin…` |
| HBM4 | `The standard is now a floor the buyers negotiate above.` | Kicker restating the two sentences before it. | Cut. |
| HBM4 | `That hands TSMC a position inside a product it does not make.` | Kicker. | Keep — it is the point of the subsection. (Listed for the tally; if one kicker survives in this chapter, make it this one.) |
| Who makes it | `That is the mechanism by which AI demand raises the price of a laptop.` | Kicker; "the mechanism by which" is inflated register. | `That is how AI demand raises the price of a laptop.` |
| The chokepoint | `None exists without Korean or American HBM.` | Kicker after a list of three cited products. | `All three depend on Korean or American HBM.` |
| The chokepoint | `Washington noticed.` | Two-word paragraph-opening aphorism. The single most machine-flavoured sentence on the site. | Delete and open on the rule: `The BIS rule of 5 December 2024 added ECCN 3A090.c…` |
| The chokepoint | `not the DRAM die but the stacking line` | "not X but Y". | `is the stacking line and the Nvidia qualification behind it, rather than the DRAM die` |
| Takeaways | `the cleanest instrument in the whole American toolkit` | Superlative slot plus "the whole" filler. | `the most precisely drawn instrument in the American set` — or drop the ranking and keep the reason, which is the good part. |

### 12 Advanced Packaging — `content/12-advanced-packaging.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Lede | `Packaging is how the industry escaped the reticle. It is now the tightest constraint in the chain.` | Epigram plus superlative slot, back to back, in the first three lines. | `Packaging is how the industry escaped the reticle, and it is now what limits output.` |
| How it works | `That carrier is the interposer.` | Five-word kicker defining a term. | `That shared silicon carrier is the interposer.` (fold into the previous sentence) |
| How it works | `CoWoS builds it in two steps.` | Numeric stem. | `CoWoS builds it in two passes, chip-on-wafer and then wafer-on-substrate.` (says what the two are) |
| How it works | `None of it is novel physics.` | "None of it is X. But Y." concessive kicker. | `The unit processes are ordinary. What is not is that one joint cracked by thermal cycling kills a body holding eight qualified HBM stacks…` |
| Capacity | `that silence is itself the story` | "the story" as a rhetorical noun; the site does this again with "the leak", "the giveaway", "the whole story". | `and the omission is deliberate` |
| Capacity | `because the number is the constraint` | Kicker closing the section on a restatement. | Cut; the paragraph has already said it twice. |
| Who makes it | `Two industries share the word packaging.` | Numeric stem. | `The word packaging covers two different industries.` |
| Who makes it | `and bonding is the narrowest` | Superlative escalation inside a sentence that already says "narrower". | `and bonding is the narrowest of them` → or cut the escalation and let the ASMPT numbers carry it. |
| Who makes it | `Neither replaces Taiwan this decade.` | Kicker. | `Neither plant replaces Taiwan this decade.` (or cut; the dates say it) |
| The chokepoint | `TSMC's roadmap makes the chokepoint worse before it gets better.` | Idiom kicker introducing three bullets. | `TSMC's roadmap tightens the constraint before it loosens it:` |
| Takeaways | `it is a capacity problem, not a physics problem` | "X, not Y" with a colon-gloss after it. | `the physics is solved and the lines are not built` |

### 13 Substrates and PCBs — `content/13-substrates-and-pcbs.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Glass core substrates | `Both dates are the giveaway. Glass is the answer to the next problem, not this one.` | "the giveaway" rhetorical noun, then an "X, not Y". Two tics in eleven words. | `Both dates are after 2027, so glass answers the next problem rather than this one.` |
| The materials underneath | `Ajinomoto's film is a rounding error in a food company's accounts and a chokepoint in everyone else's.` | Balanced antithesis opener. Good line; the problem is that 06 and 13 both open a section this way. | Keep one of the two. If this survives, cut 06's "Photomasks are the cheapest critical chokepoint…". |
| The materials underneath | `Buyers have noticed:` | Colon-reveal, and 11 does the same thing with "Washington noticed." | `Apple and Qualcomm have both raised concerns about Japanese glass cloth supply` |
| The boards under the GPU | `has quietly become an engineering problem of its own` | Third *quietly* on the site. | `has become an engineering problem of its own` |
| Who makes it | `The substrate fabs themselves are an oligopoly, and all of them are building.` | Stub sentence introducing three bullets. | `All three of the large merchant substrate makers are expanding.` |
| The chokepoint | `That is why a product first adopted in 1999 still sets the standard.` | Kicker closing on a restatement of the section's opening. | Cut. |
| Key evaluation criteria | `Second-sourcing a film or a laminate takes years, not quarters.` | "X, not Y". | `Second-sourcing a film or a laminate takes years.` |
| Key evaluation criteria | `is the commercial moat` | Second *moat* on the site. | `is what protects the incumbents` |
| Takeaways | `The substrate is the least glamorous and most binding part of an AI package.` | least/most paradox tag, same shape as 06 and 14. | `The substrate is the part of an AI package that gets least attention and binds hardest.` — or drop the ranking entirely and open on the TSMC quote, which is stronger. |

### 14 Test and Assembly — `content/14-test-and-assembly.md`

Being rewritten while I read; most of what I logged an hour ago is already gone. Two left.

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| How it works | `Test happens at least three times and increasingly four.` | Numeric stem before four bullets. | `Test happens at four points, and the fourth is new.` → or delete and let the bullets speak. |
| Who makes it | `The rest of the floor is more fragmented.` | Stub sentence introducing four bullets. | `Below the two testers the floor is fragmented.` (merge into the preceding paragraph) |

### 15 Systems and Networking — `content/15-systems-and-networking.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Card, `plain` | `Think of a rowing eight.` | Third "Think of …" analogy opener. The rowing image is also the least load-bearing of the four; nothing later in the chapter uses it. | `A cluster only goes as fast as its slowest link, so this stage is built to keep every accelerator in step.` (drops the analogy entirely) |
| Card, `plain` | `the tightest supply in this layer is a laser material, not a chip` | "X, not Y" — and the one-liner already runs the same reversal ("Assembly is diversified. The lasers are not."). | `the tightest supply in this layer is a laser material` |
| How it works | `Two networks run through every AI cluster and they are not interchangeable.` | Numeric stem. | `Every AI cluster runs two networks that are not interchangeable.` |
| Scale-up | `Three architectures matter` | Numeric stem before three bullets. | `The architectures differ in how many accelerators share one coherent domain.` |
| Scale-out | `and two things did the work` | Third numeric stem in one chapter. | `and did it in two ways.` → or delete: the two paragraphs that follow are self-evidently two. |
| The chokepoint | `Three things are genuinely narrow.` | Fourth numeric stem. "genuinely" is filler. | `Three points are narrow:` → or `The narrow points are these:` |
| Key evaluation criteria | `count the suppliers of the laser, not the module` | Imperative "X, not Y". | `the supplier count that matters is for the laser, not the module` → or `count laser suppliers rather than module assemblers` |
| Takeaways | `The leverage sits in NVLink-class scale-up switching` | *leverage* again. | `The control point is NVLink-class scale-up switching` |

### 16 Data Centers and Power — `content/16-data-centers-and-power.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Card, `oneLiner` | `The chips are no longer the long pole.` | Project-management idiom used as an epigram opener. | `The chips are no longer what a buildout waits on.` |
| Card, `plain` | `Picture a domestic hair dryer` | The fourth reader-instruction analogy opener. | `A domestic hair dryer pours about two kilowatts of heat out of a hand-sized nozzle. One rack of AI chips draws seventy of them…` (same image, no instruction) |
| Card, `plain` | `That queue is where an AI buildout now waits.` | Kicker closing the plain box. | Cut; the sentence before it already says the equipment is ordered years ahead. |
| Rack power | `A megawatt rack is not a bigger version of a 142 kW one.` | Negation-then-list opener ("not a bigger X"). | `A megawatt rack changes the busbar, the floor loading, the coolant flow, the leak detection and the ride-through storage.` (merge the two sentences) |
| Capacity and demand | `Energy per token falls; total energy still rises` | Balanced-clause antithesis. | `Energy per token falls while total energy rises, because token volume rises faster.` |
| Capacity and demand | `Supply is not growing at data center speed.` | Kicker. | Cut; the EIA growth figures in the sentence before make the point. |
| The chokepoint | `Six years of output is already spoken for.` | Kicker doing the reader's arithmetic for them, which is fine, but it is the third kicker in the section. | Fold in: `…against a book of 116 GW, which is roughly six years of output.` |

### 17 Component Costs — `content/17-component-costs.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Card, `oneLiner` | `the silicon turns out to be the cheap part` | Fine on its own — but the Takeaways repeat it as `The silicon is the cheap part.` and the body says it a third time. Three renders of one epigram. | Keep the one-liner; cut the Takeaways repeat. |
| Card, `plain` | `Think of the receipt for a new car.` | Fourth "Think of …" opener. | `An accelerator's bill of materials works like a car's. The engine is the famous part…` |
| Card, `chinaStatus` | `which is where a regulator finds leverage` | *leverage*. | `which is where a regulator has the most purchase` |
| Headings | `## How it works (the cost model)`, `## Variants and trade-offs (the BOMs)`, `## The chokepoint (what is structurally expensive)` | Template heading plus a bolted-on parenthetical gloss — the visible seam of a chapter written to a form. | `## The cost model`, `## The bills of materials`, `## What is structurally expensive` |
| How it works | `Die cost has three inputs.` | Numeric stem. | `Three numbers set die cost.` → or delete; the bold labels are self-counting. |
| The chokepoint | `We sort the stages into three classes.` | Numeric stem plus over-signposting of the table that follows. | `The stages sort into three classes.` → or delete; the table's own column says "Class". |
| Who captures the value | `Value moved from Nvidia to Nvidia's suppliers.` | Kicker; the chiasmus on "Nvidia" is the tell. | `The margin moved upstream, to Nvidia's suppliers.` |
| Key evaluation criteria | `Cost per good die, not per wafer.` and `Rack watts, not rack dollars.` | Two "X, not Y" bullet labels inside one six-bullet list, alongside two more "not" clauses in the same list. Four negation-contrasts in one screen. | `Cost per good die` and `Rack watts` — the explanatory sentence under each already draws the contrast. |
| Key evaluation criteria | `Ask whether the line falls when volume doubles.` | Second-person instruction. | `The test is whether the line falls when volume doubles.` |

### 18 Geopolitics — `content/18-geopolitics.md`

| Section | Phrase | Why it reads as machine prose | Replacement |
|---|---|---|---|
| Lede | `Neither is finished.` | Three-word aphorism, first paragraph. | Cut, or extend: `Neither project is finished, and this chapter is a status report on both.` |
| The shape of the contest | `The yard has not stayed small.` | Kicker paragraph of one sentence, then a second kicker. | Merge with what follows: `The yard has not stayed small: licensing once asked who was buying and why, and country-wide prohibition asks only where the box is going.` |
| The shape of the contest | `Licensing once asked who was buying and why; country-wide prohibition asks only where the box is going.` | Balanced-clause antithesis with semicolon. Good sentence; flagged only because the chapter has six more like it. | Keep this one and cut the weaker twins. |
| The US export-control campaign | `Three moves have set the current settlement.` | Numeric stem. | `Three rules since January 2026 set the current settlement.` (adds a date; still introduces the bullets) |
| China's response | `The minerals followed.` | Three-word kicker introducing four bullets. | `Export controls on minerals followed.` |
| China's response | `Nothing was repealed.` | Three-word kicker, second in the same section. | Merge: `Nothing was repealed: one ban was paused for twelve months, and the licensing regimes stand.` |
| Where the chips go | `Southeast Asia is the leak.` | Metaphor-as-label ("the leak", like 13's "the giveaway", 12's "the story"). | `Southeast Asia is where the controls leak.` |
| Where the chips go | `It is not law yet.` | Five-word kicker. | Fold into the sentence before: `…passed it 42-0 on 26 March 2026, and it has not become law.` |
| Predicted winners | `The clearest loser is the idea of a small yard.` | The whole six-bullet block is a machine set-piece: bold epigram + strict "X wins / X loses / X gains and loses" parallelism + a closing aphorism. Individually each judgment is good; collectively they read as generated. | Break the parallelism. Keep two or three bullets in this shape, and write the rest as ordinary sentences with their reasons attached — the reasons are the valuable part and the epigram format buries them. |
| Predicted winners | `The United States wins the top of the stack, not the middle.` | "X, not Y" bold label. | `The United States keeps the top of the stack and will not gain the middle.` |
| Predicted winners | `Our judgment, not a source's.` | "X, not Y" fragment as a standalone paragraph. | `These are our judgments, not any source's.` |
| Allies | `Europe's leverage at the leading edge` | *leverage* — the eighth on the site. | `Europe's position at the leading edge` |
| Card, `substitution.why` | `supplier ecosystem that a single national programme cannot conjure` | *ecosystem* meaning "industry", plus "conjure". | `supplier base that a single national programme cannot build from nothing` |
| What to watch | `The two policies point in opposite directions and one will give.` | Aphoristic close. | `The two policies contradict each other, and one of them will be dropped.` |

### `data/glossary.json` — fixed, see §4

### `data/landscape-notes.md` — off limits to edit, flagged only

| Chip section | Phrase | Why it reads as machine prose | Suggested replacement |
|---|---|---|---|
| (all) | `is the part that made …`, `is the only vendor that …`, `is the purest …`, `is the clearest …`, `is the odd one out …`, `is the first …` | Fifteen of eighteen sections open with the same superlative-identity sentence. Read in sequence on the AI Chips page, every chip is the most-something, so none of them is. | Open five or six of them on a fact instead — a number, a date, a supplier — and keep the superlative frame for the three or four chips where it is the actual story (Cerebras, Groq, Ascend 910C). |
| Nvidia H200 | `This is not a China SKU. It is the standard 2023 Hopper part` | "It is not X. It is Y." — the only surviving instance of this construction on the site. | `The H200 is the standard 2023 Hopper part, not a China-specific SKU: an 814 mm2 monolithic die on TSMC 4N…` |
| AMD MI455X | `and that capacity gap is the entire positioning` | Aphoristic tag; "entire" is filler. | `and the capacity gap is what AMD is selling` |
| Nvidia Rubin | `and memory is the line item that moved` | Aphoristic tag. | `and memory accounts for most of the increase` |
| Intel Gaudi 3 | `It is also the end of the line.` | Six-word kicker. | `It is also Intel's last Gaudi part.` |

### `data/chokepoint-matrix-notes.md` and `data/control-thresholds-notes.md` — flagged only

These are the best-written files in the repository and I would change almost nothing. Two small things:

| File | Phrase | Why | Replacement |
|---|---|---|---|
| `chokepoint-matrix-notes.md` (`0.trend` in `chokepoint-matrix.json`) | `Essentially static concentration since 2021` | *essentially* as a hedge-intensifier. | `Concentration has been static since 2021` |
| `control-thresholds.json` (`36.scope`) | `the model layer that the chip controls ultimately govern` | *ultimately* as filler. | `the model layer that the chip controls are aimed at` |
| `suppliers.json` (Nvidia row) | `the CUDA software stack that locks the ecosystem in` | *ecosystem* meaning "industry". | `the CUDA software stack that locks customers in` |

---

## 3. Site-wide patterns, with counts

Counted across `content/*.md` (front matter and body) at 11:26 on 9 September 2026, after other editors had
already removed a first tranche. Numbers in brackets are what I measured at 10:40, before those edits, so
the delta shows what is already being fixed.

| Pattern | Live count | (at 10:40) | Notes |
|---|---|---|---|
| Paragraphs ending on a short sentence after long ones (≤12 words following a ≥16-word average) | **45** | (50) | About 35 are rhetorical kickers rather than short facts. The single most identifying feature of the site's prose. |
| `X, not Y` tag at the end of a sentence or bullet | **27** | (39) | In 17 of 18 chapters. Worst cluster: 17's *Key evaluation criteria*, four in one list. |
| Numeric list stem ("A design runs through five phases.", "Three consequences follow.") | **11** | (18) | Chapters 05 and 15 have four each. |
| `not X but Y` | **4** | (7) | 02, 06, 11 (×2). |
| `It is not X. It is Y.` | **0** in chapters | (3) | One survives in `data/landscape-notes.md` (H200). |
| "Think of / Picture …" analogy openers in the plain-English box | **4** of 18 | (4) | 11, 15, 17 use *Think of*; 16 uses *Picture*. |
| Superlative-slot claims ("the [most/cheapest/quietest/tightest] X in the chain") | **9** | (9) | 02, 05, 06, 08 (×2), 11, 12, 13, 15. They compete with each other. |
| `leverage` as an abstract noun | **8** | (8) | 04, 05, 15, 17, 18 (×3, incl. card). |
| `quiet` / `quietly` as a rhetorical intensifier | **4** | (5) | 06 (×2), 10, 13. |
| `moat` | **2** | (2) | 08, 13. |
| `ecosystem` meaning "industry" | **2** | (2) | 18 card; `suppliers.json` Nvidia row. |
| `essentially` / `ultimately` as filler | **2** | (2) | `chokepoint-matrix.json`, `control-thresholds.json`. |
| `critical` | **2** | (11 raw, 2 non-URL) | Both legitimate ("critical layers", "critical minerals"). Not overused. |
| `key` | **36** | | All 36 are the heading "Key evaluation criteria" or "keyFacts" in the front matter. Zero in prose. |
| `crucial`, `pivotal`, `robust`, `seamless`, `delve`, `tapestry`, `harness`, `foster`, `streamline`, `transformative`, `unprecedented`, `paradigm`, `synergy`, `holistic`, `multifaceted`, `nuanced`, `vibrant`, `testament`, `underscores`, `arms race`, `chokehold`, `stranglehold`, `double-edged`, `mixed bag`, `far cry`, `elephant in the room`, `in today's`, `at the end of the day`, `the bottom line`, `in other words`, `put simply`, `here's the thing`, `this matters because`, `the stakes`, `in order to`, `utilise`, `facilitate`, `let's`, `we'll`, `massive`, `enormous`, `huge`, `vast` | **0** | | Already swept. |
| Rhetorical questions answered in the next sentence | **0** | | Two question-form headings in 01, which is fine. |
| `not only X but also Y` | **0** | | |
| `Whether … or …` sentence openers | **0** | | |
| `The result:` / `The lesson:` colon constructions | **0** | | But four *colon-reveal* variants exist: "Mirrors are the reason:", "The lock-in is stickiness:", "Buyers have noticed:", "Be precise:". |
| "In short" inside body prose | **0** | | Used only as the section label the build generates from Takeaways, which is correct. |
| Hedging triad (*may … might … could* in one sentence) | **0** | | |
| `As of 2026` timestamp tic | **0** | | Dated claims carry real dates. |
| Second-person instructions to the reader ("Read those numbers as…", "Call the leading edge…", "Ask whether…", "Watch X, not Y", "count the suppliers of…") | **6** | (7) | Fine once a site; six times it is a house mannerism. |
| Headings in "Noun: subtitle" form | **7** | | 12 (×2), 15 (×2), 18 (×3). Mostly benign label-plus-contents; the three parenthetical glosses in 17 are the ones to fix. |
| "We think" / "Our judgment" editorial markers | **7** | (8) | A good convention, not a tic — but two of the seven ("We think the gap is real but closing", "We think a carve-out is likely") hedge instead of judging. |
| Glossary `why` lines opening "It is …" | **16** of 74 | | Fixed 8 below. |
| Glossary `plain` definitions ending on a kicker beginning "It is …" | **14** of 74 | | Fixed 4 below. |
| `landscape-notes.md` sections opening with a superlative-identity sentence | **15** of 18 | | Off limits to edit. |
| "from X to Y" sweeping range in UI chrome | **1** | (4) | Fixed; see §4. |

---

## 4. Fixes applied

These three files are mine to edit; nobody else is touching them. `node build/build.js` runs clean after
each change (0 errors; the pre-existing warnings about missing specimens are unrelated).

### `src/template.html`

| Where | Before | After | Reason |
|---|---|---|---|
| `<meta name="description">` | `A deep dive on the AI chip supply chain: every stage from sand to a rack in a data center, with a 3D specimen of each stage beside the text.` | `The AI chip supply chain, stage by stage: who makes each part, how concentrated each stage is, and what a substitute would cost. Every stage has a 3D specimen beside the text.` | "A deep dive" is itself an LLM-ish label; "from sand to a rack" was the second of four uses of the same sweep. |
| Hero dek | `Chokepoints walks the chain one stage at a time and scores each one: what the stage does, who can actually do it, what the tool costs, and how long a substitute would take to build. Every number links to its source.` | `Eighteen stages, one chapter each, scored on how few firms can do the work. What the stage does, who can do it, what it costs, and how long a substitute would take to build. Every number links to its source.` | The colon-plus-four-part list was pure cadence; "actually" was filler; "walks the chain" anthropomorphises the site. |
| AI Chips dek | `…with the supply chain behind each one: which foundry, which node, whose memory, which packaging line. Pick a chip; the package beside the text follows its real die and HBM layout.` | `…with the foundry, node, memory supplier and packaging line behind each one. Pick a chip and the package beside the text follows its real die and HBM layout.` | Four-part `which… which… whose… which…` anaphora. |
| Summary dek | `…the chokepoint score and who leads. Read it before you regulate the chain, invest in it, or build on it. Each card links to the full chapter.` | `…the chokepoint score and who leads. Each card links to the full chapter.` | The removed sentence was a rhetorical triplet imperative that told the reader who they are. |
| Controls threshold intro | `Every quantitative line that decides whether a chip or a tool needs a licence, as data rather than prose: the parameter, the value, where it applies, its status and the rule that set it. Filter by regime.` | `Every quantitative line that decides whether a chip or a tool needs a licence: the parameter, the value, where it applies, its status and the rule that set it. Filter by regime.` | "as data rather than prose" was a self-congratulatory aside. |

### `build/build.js`

| Where | Before | After | Reason |
|---|---|---|---|
| `claimsHTML` | `Stages from<br>quartz to a rack` | `Stages, quartz<br>to a finished rack` | Third instance of the "from X to Y" sweep in the chrome; the hero thesis already says "turn sand into a GPU". |
| `suppliersIntro` | `220 firms across the chain, from polysilicon to liquid cooling, with what each one makes…` | `220 firms across the chain, with what each one makes…` | Fourth instance of the same sweep. |
| `CONTROLS_DEK` | `…from their own filings. The control surface of the chain in two tables.` | `…from their own filings.` | Tacked-on aphoristic fragment. |
| `footer` | `Chokepoints · A deep dive on the AI chip supply chain · …` | `Chokepoints · The AI chip supply chain, stage by stage · …` | "A deep dive". |
| `footer` | `Built with a dependency-free point-cloud renderer; no scans, no tracking.` | `Built with a dependency-free point-cloud renderer. No scans and no tracking.` | The `no X, no Y` parallel fragment. |
| "How this site was made" | `The specimens are procedural point clouds built from primitives, not scans, with proportions taken from published dimensions.` | `The specimens are procedural point clouds built from primitives, with proportions taken from published dimensions. None of them is a scan.` | One of two "X, not Y" tags in three sentences; the other one ("not as investment advice") is a disclaimer and stays. |
| Empty states (×5) | `The geopolitics essay has not been delivered yet.` / `The glossary has not been delivered yet.` / `The supplier database has not been delivered yet.` / `Content agents have not delivered yet. This is a shell build.` / `Chapters are being written` | `The geopolitics essay is not written yet.` / `The glossary is not written yet.` / `The supplier database is not compiled yet.` / `No chapters found. This is a shell build.` / `No chapters yet` | Four strings shared one formula, and "delivered" leaked the production process into reader-facing copy. |

### `data/glossary.json`

Facts, numbers and chapter links unchanged; only the sentence shapes.

| Term | Field | Change | Reason |
|---|---|---|---|
| capex | `why` | `…which is the demand signal every firm in this chain plans against.` → `…and the number every firm in this chain plans against.` | Near-duplicate of the `hyperscaler` entry, which used the same numbers and the same closing clause. |
| hyperscaler | `why` | `Their combined capital spending, guided at roughly $660 to $690 billion for 2026, is the single demand number that the entire chip supply chain plans against.` → `Their combined capital spending is guided at roughly $660 to $690 billion for 2026, most of which is committed years before the hardware exists.` | Removes the duplication and says something the capex entry does not. |
| accelerator | `why` | `Accelerators are the product this entire supply chain exists to deliver, and the unit…` → `Accelerators are what the whole supply chain is for, and the unit…` | "this entire supply chain exists to deliver" duplicated the `transistor` entry's "Everything in this supply chain exists to…". |
| advanced packaging | `why` | `It is the second tightest bottleneck… and in 2025 it, not transistor supply, was what limited how many AI accelerators could be built.` → `The second tightest bottleneck… and in 2025 it limited how many AI accelerators could be built, while transistor capacity went spare.` | Drops the "It is" opener and the awkward `, not X,` insert. |
| scale-out network | `plain` | `It is ordinary data centre networking, done at extraordinary scale.` → `The technology is ordinary data centre networking; the scale is not.` | ordinary/extraordinary antithesis flourish, and the second of two "…, done X" tags. |
| license exception | `plain` | `It is permission granted in advance to a whole category rather than to one transaction.` → cut. | Restated the sentence before it word for word in different words. |
| small yard, high fence | `plain` | `The yard is what gets fenced in, and the fence is how hard it is to climb.` → `Coined by Jake Sullivan in 2022 and now the standard shorthand for the policy's stated intent.` | Explaining a metaphor by restating it; replaced with a fact. |
| multipatterning | `plain` | `It is the workaround for not having sharper light.` → `It is what a fab does when it cannot get sharper light.` | Kept the substance, dropped the epigram cadence. |
| DUV | `why` | `…which is exactly where Dutch export licensing draws its line.` → `…which is where Dutch export licensing draws its line.` | "exactly" filler. |
| NVLink | `why` | `…which is precisely what the industry's UALink standard was created to break.` → `…which is what the industry's UALink standard was created to break.` | "precisely" filler. |
| EDA | `why` | `…took three letters and no lead time at all.` → `…took three letters and no lead time.` | "at all" filler. |
| chokepoint | `why` | `Chokepoints are where policy has leverage, and where a single sanction, factory fire or earthquake propagates to the whole industry.` → `Chokepoints are where policy gets purchase, and where one sanction or one factory fire reaches the whole industry.` | *leverage*; three-item rhythm list trimmed to two. |
| ALD | `why` | `It is the step that makes stacked memory and wrap-around transistors possible, US export rules name it directly, and…` → `ALD is what makes stacked memory and wrap-around transistors possible. US export rules name it directly, and…` | One of sixteen `why` lines opening "It is"; also a three-clause run-on. |
| FLOPS | `why` | `It is the standard unit of AI compute and the basis of export thresholds, but…` → `The standard unit of AI compute and the basis of export thresholds, but…` | "It is" opener. |
| gate-all-around | `why` | `It is the transistor of the 2 nanometre generation, only TSMC…` → `The transistor of the 2 nanometre generation. Only TSMC…` | "It is" opener, three-clause run-on. |
| HBM | `why` | `It is the most expensive line on an AI accelerator's bill of materials, all of it…` → `The most expensive line on an AI accelerator's bill of materials. All of it…` | "It is" opener. |
| lithography | `why` | `It is the most concentrated stage in the whole chain, and…` → `The most concentrated stage in the chain, and…` | "It is" opener; "whole" filler. |
| OSAT | `why` | `It is a low-margin business at 14 to 20 percent, four of the ten…` → `A low-margin business at 14 to 20 percent. Four of the ten…` | "It is" opener. |
| TPP | `why` | `It is the real dividing line for sales to China, with control…` → `The real dividing line for sales to China: control…` | "It is" opener. |
| TPU | `why` | `It is the leading proof that a large buyer can build a real alternative…` → `The clearest evidence that a large buyer can build a real alternative…` | "It is" opener. |

Nine of the sixteen "It is …" `why` openers now vary. I stopped there rather than rewriting all sixteen,
because flattening every one of them into the same non-"It is" shape would just install a new template.

---

## 5. What I did not touch

- `content/*.md` — read-only for this pass, per the brief. Everything in §2 is a recommendation.
- `data/landscape-notes.md` — off limits. Flagged in §2.
- `data/chokepoint-matrix.json`, `data/control-thresholds.json`, `data/suppliers.json` — three small tics
  flagged in §2; not mine to edit.
- `src/app.js` UI strings — checked; the labels, placeholders and empty states there are terse and clean.
  `Nothing matches.` is the right empty state. No changes needed.
- `dist/index.html` — rebuilt from source, not hand-edited.
