# LLM-speak audit: what was applied

One section per file. Each records the audit items applied, the items skipped and why, and the
body word count before and after. `node build/build.js` runs clean (0 warnings) after every section below.

---

## `content/01-introduction-and-goals.md` — 904 → 893 words

Chapter 01 keeps its own shape, so the range check does not apply.

**Applied**

| Audit item | What I did |
|---|---|
| Card `plain`: `Think of building a car in which` | Rewrote as `Building an AI chip, the kind that trains and runs an artificial intelligence model, is like building a car in which…`. The old second sentence ("The chip that trains and runs an artificial intelligence model is put together that way") became redundant once the opener named the subject, so it was folded into the first clause and cut. Changed byte-identically in the front matter and in the first paragraph under "The chain in one paragraph". |
| Lede: `Every chapter answers three questions` | → `Every chapter covers how the stage works, where the trade-offs sit, and which firms control it and how hard they would be to replace.` Count dropped; the list is right there. |
| `Both are true, and they do not cancel.` | → `Neither finding cancels the other.` Kept as a short opener rather than a closer, which inverts the long-long-short beat instead of repeating it. |
| `The supply chain sets how much AI exists, who can afford it, and which governments can switch it off.` | Folded into the sentence before and cut the middle leg of the triplet: `Cheaper inference has raised total compute consumption, and the supply chain still sets how much AI exists and which governments can switch it off.` Also removed `rather than lowered it`, which the verb already carried and which rhymed with the same construction in Takeaways. |

**Applied beyond the audit (rhythm pass)**

- `What the money buys is a rack.` → `The money buys racks.` (drops the cleft) and the closing kicker `A different supplier sets every one of those numbers.` folded onto the GB300 sentence. The paragraph now runs short-then-long instead of long-long-short.
- `Every chapter opens with a chokepoint card. Read three fields on it first.` → one sentence, `…and three fields on it matter most.` Removes a standalone numeric stem and one of the site's six second-person instructions.
- `The card also gives China's position and the United States'. Chapters run in process order.` → merged into one sentence, so the section no longer ends on two consecutive five-word landers.

**Skipped**

- Card `oneLiner`: `from sand to a rack`. The audit says to keep it here as the site's own line and cut the four echoes in the chrome, which another editor has already done.
- Takeaways: `high-bandwidth memory and advanced packaging, not transistors`. The contrast is the chapter's central empirical finding, so the "X, not Y" earns its place.
- `Transistors were plentiful; what ran short was the ability to stack memory beside them.` Short after long, but it states the finding rather than performing it, and neither adjacent paragraph ends on a beat.

---

## `content/03-silicon-and-wafers.md` — 1,136 → 1,130 words

**Applied**

| Audit item | What I did |
|---|---|
| `Almost every step throws material away.` | Folded onto the preceding sentence with `and`, keeping the 1,200-degree citation attached to its number. |
| `Not one is Chinese.` | Folded into the sentence rather than replaced: `…with five major suppliers, none of them Chinese: Wacker, Hemlock, OCI, Tokuyama and Mitsubishi ([source])`. The audit's `None of the five is Chinese` would have collided with the other "five firms" (the wafer makers) two paragraphs up. |
| `Domestic makers are building, but from that base.` | Folded onto the cited 12/18 percent sentence: `…which is the base domestic makers are building from.` The audit's replacement would have repeated the "under 1 percent of 300 mm" figure already in that paragraph. |
| `Epi costs more, and it carries the leaders' margins.` | Cut. The paragraph now ends on the cited SEMI fact, and the margin claim survives in Takeaways where it is attached to a reason. |
| `Watch the epitaxial mix rather than square inches` | → `The epitaxial mix matters more than the square inches, because…`. Statement, not an instruction to the reader. |

**Applied beyond the audit (rhythm pass)**

- `Solar and electronic polysilicon are separate industries with separate suppliers.` folded onto the sentence before it with `and`, so "How it works" no longer has two paragraphs in a row landing on a short flat line.

**Skipped**

- `SOI matters for RF and low-power logic, not for AI GPUs, which run on bulk epi.` The contrast is the whole point of the subsection: this variant is irrelevant to the subject of the site.
- Takeaways: `the cheapest critical input in the AI chain and among the most concentrated`. One superlative-slot claim in the chapter, and the chapter's own numbers ($11.4bn world market, five firms) support it, so it stays under the one-per-chapter rule.

---

## `content/04-chemicals-gases-and-photoresist.md` — 1,173 → 1,161 words

**Applied**

| Audit item | What I did |
|---|---|
| `A government now controls the company that owns Inpria.` | Cut. The paragraph ends on the cited 84.36 percent tender offer, and the card and Takeaways both still carry the state-ownership point. |
| `Others are expanding on AI demand.` | Deleted, and the two bullets under it turned into a single prose paragraph. Two bold-label bullets were thin enough that removing the stem alone would have left them dangling; running them as prose also varies the texture of a section that already carries a table. |
| `The consumables are tighter still.` | → `The consumables are narrower again.` |
| `None of this touches silicon logic.` | → `Neither metal goes into a silicon logic chip.` |
| `China's own lever is metals, not molecules.` | → `China's lever is the metals rather than the process chemicals.` |

**Applied beyond the audit (rhythm pass)**

- `The most concentrated item is a metal:` → `One metal is tighter than all of them:`. The chapter's own numbers contradicted the superlative (90 percent Japanese photoresist is tighter than a 65 percent target share), and Takeaways already calls photoresist "the sharpest point here". The comparison now points at the consumables actually listed in that paragraph.
- Takeaways: `are real leverage over` → `bite on`, removing the site's abstract-noun `leverage`.
- Takeaways: `Watch the qualification cycle rather than the spot price.` folded into the closing sentence with `because`, so the chapter ends on one long sentence rather than an imperative followed by a beat.

**Skipped**

- Lede: `A modern fab is a chemical plant with lithography attached.` The audit says to keep this epigram and cut the ones in 06, 08 and 12 so it stands out.
- `Twice since 2019 the industry has lost a supplier country` — **quote gone.** Another editor had already rewritten it as `This layer has been squeezed twice since 2019, once by a government and once by a war.` That is a topic sentence with content ("a government" and "a war" are the two paragraphs that follow), not a bare count, so I left it.
- `We think a carve-out is likely, but it is not law yet.` Short after long, but it is a stated editorial judgment on live regulation, which is the site's convention, and the preceding paragraph ends on a cited number.

---

## `content/07-deposition-and-etch.md` — 1,163 → 1,169 words

**Applied**

| Audit item | What I did |
|---|---|
| `AI raises the difficulty in three specific places.` | → `AI hardware asks for sideways cuts, deeper holes and a second metal stack on the wafer's back.` Straight deletion was not available: the bullets under it would have merged with the "Etch families" list above and read as six etch families. The replacement drops the count, names the demands rather than the bullet labels, and keeps the two lists apart. |
| `The controls tightened in four moves.` | → `The controls tightened in stages.` |
| Takeaways: `want better selectivity and deeper holes, not more chambers` | → `need better selectivity and deeper holes rather than more chambers`, removing both the anthropomorphised process and the tag. |

**Applied beyond the audit (rhythm pass)**

- `That is why export controls here are written as process specifications, not as bans on machines.` → `That is why the export controls here name process specifications rather than machines.` Keeps the contrast, which is load-bearing for the whole controls section, but drops the comma-tag shape and the passive.

**Skipped**

- `China is the largest customer and the fastest-improving competitor at once.` — **quote gone.** `at once` had already been removed; the sentence now reads exactly as the audit's replacement.
- `China still takes a large share of every major vendor's sales.` Short after long, but it is the claim the four bullets underneath evidence.
- `That is where the December 2024 rule aims ([source]).` Short and cited; it is the point of the chokepoint section.

---

## `content/09-transistors-and-front-end.md` — 1,099 → 1,096 words

**Applied**

| Audit item | What I did |
|---|---|
| `Read those numbers as marketing until someone measures the silicon.` | → `Those numbers are vendor claims until someone measures the silicon.` |
| `Two metals are taking the narrow levels:` | → `Two metals are moving into the narrow levels.` Kept as the audit wrote it: deleting it entirely would have left the two bullets hanging off the copper-barrier paragraph with no bridge. |
| `Node names mean nothing physical.` | Merged with the sentence after it: `Node names describe nothing physical: SMIC's N+3, sold as 5 nm-class, has a 32.5 nm minimum metal pitch…` |
| `Logic shrank; cache did not` | Cut the antithesis and folded the consequence onto the cited SRAM sentence: `…the gain comes from the periphery, not the bit cell ([source]), which is much of why accelerators push memory off-die.` The audit's version would have used "bit cell" twice in adjacent clauses. |
| Takeaways: `new materials, not geometry` | → `process steps and new materials rather than geometry`. |

**Applied beyond the audit (rhythm pass)**

- `That leak is short-channel leakage. It has three fixes:` merged into one sentence, so the count is a clause rather than a standalone announcement.
- The chokepoint section ran `It has the money.` / `What it lacks is tools.` back to back. Now: `It has the money: the third National Integrated Circuit Fund raised…` and `The tools are the problem.` Three staccato sentences down to one short one, and the cleft is gone.
- Key evaluation criteria: `so read the shrinking density gain per node as the proxy` → `so the shrinking density gain per node is the proxy`, removing another second-person instruction.

**Skipped**

- `the gain comes from the periphery, not the bit cell` — the contrast is the fact, and it is the one place the SRAM claim is made precisely.
- `See Memory and HBM.` / `See Lithography and Geopolitics.` Cross-references, not aphorisms.
- `Width is continuous again, which TSMC sells as NanoFlex.` Short, but it carries the product name and neither neighbouring paragraph ends on a beat.

---

## `content/10-foundries-and-fabs.md` — 1,130 → 1,118 words

**Applied**

| Audit item | What I did |
|---|---|
| `The model won on arithmetic.` | Cut. The BCG cost sentence that follows makes the argument. |
| `Nobody else earns leading-edge margins, so nobody else can fund the next node from cash flow.` | → `No other foundry earns that margin, so none can fund the next node out of cash flow.` Anaphora dropped. |
| `Washington bought an option on Intel not spinning off its fabs.` | Folded onto the warrant sentence: `…exercisable only if Intel ceases to own 51 percent of the foundry business ([source]), which makes the warrant an option on Intel keeping its fabs.` |
| `That stacks three risks on one island.` + the hedge after it | → `Three risks stack on one island, and we think only the third is unmanageable:` |
| `Until then, the leading edge is Taiwan.` | Cut. The BCG projection before it already says this. |
| Key criteria: `Intel Foundry's loss is a yield story, not a demand story.` | → `Intel Foundry's loss comes from yield, not from a shortage of demand.` This is the one "X, not Y" the audit says to keep in this chapter, so it is the only comma-tag left here. |

**Applied beyond the audit (rhythm pass)**

- `The Taiwanese gigafabs are 13 million of it. Arizona, Kumamoto, Nanjing and Washington are the rest.` merged into one sentence. With `No design house sells enough of one product to fill that.` kept in the paragraph above (the audit's instruction), leaving both would have put two short landers back to back.
- Two remaining tags reworded to `rather than` so the chapter keeps only the one privileged comma-tag: `compete on cost, not density` → `compete on cost rather than density`; `usually packaging, not wafers` → `usually packaging rather than wafers`.

**Skipped**

- `No design house sells enough of one product to fill that.` The audit flags it for the tally and says to keep it; it is the reason the pure-play model exists.
- `See Advanced packaging.` Cross-reference.

---

## `data/landscape-notes.md` — 3,146 → 3,132 words

The audit could only flag this file; the brief opened it for editing. Thirteen of the nineteen chip
sections opened on a superlative-identity sentence and now open on a fact, an actor, a date or an action.
Three superlative openers were kept deliberately, exactly the ones the audit named as the actual story:
**Cerebras** ("the only vendor that ignores the reticle limit"), **Groq** ("the purest SRAM-only design in
production") and **Ascend 910C** ("the clearest case in the industry"). Three sections (B300, TPU 8i,
MTIA 400) already opened on something else and were left alone.

**Openers rewritten**

| Chip | Now opens |
|---|---|
| Nvidia B200 | `Nvidia fuses two TSMC 4NP dies, 208 billion transistors in total…`, with "the design that made reticle-crossing normal" folded on as an appositive |
| Nvidia Rubin | `Two reticle-limited compute dies on TSMC 3 nm carry 336 billion transistors…`; the HBM4-first claim moved to sentence two, and `memory, not logic` became `memory rather than logic` |
| Nvidia H200 | The audit's own line: `The H200 is the standard 2023 Hopper part, not a China-specific SKU: an 814 mm2 monolithic die…`. This was the last `It is not X. It is Y.` on the site |
| AMD MI355X | `AMD matched Nvidia on memory a year early here: the MI355X carries 288 GB…` |
| AMD MI455X | `AMD gives the lithography as TSMC 2 nm and 3 nm…`; the two "first"s moved to sentence two |
| Google TPU v7 | `Google's own documentation gives 2,307 TFLOPS BF16…`; the GA date and the credibility claim now close the opening |
| AWS Trainium3 | `Trainium3 uses TSMC CoWoS-R with an organic thin-film interposer…`, with "a deliberate move away from the silicon interposer" folded in, so the uniqueness is shown rather than announced |
| Microsoft Maia 200 | `Microsoft puts Maia 200 on TSMC 3 nm with over 140 billion transistors…`; "the odd one out among 2026 flagships" moved to sentence two |
| OpenAI Jalapeño | `OpenAI taped out Jalapeño, its first silicon, in nine months: a reticle-sized inference ASIC…` |
| Intel Gaudi 3 | `Intel documents eight matrix multiplication engines…`; the Ethernet claim now grows out of the 24 NIC ports rather than preceding them |
| Huawei 950PR | `Xu Zhijun laid out Huawei's accelerator roadmap at Huawei Connect in September 2025…` |
| Cambricon Siyuan 590 | `Almost nothing about the Siyuan 590 is public: Cambricon's own site still lists only the MLU270 and MLU370…` |
| Moore Threads MTT S5000 | `Moore Threads builds the MTT S5000 on its PH100 chip…`; the software-compatibility judgment moved onto the "publishes nothing" sentence, where it is earned |

The rewritten openers are deliberately not all one new shape: five lead with a vendor and an active verb,
two with the hardware itself, one with a person and a date, one with an absence of disclosure, one with a
plain identity, and one with a comparison.

**Other audit items in this file, all applied**

- AMD MI455X: `and that capacity gap is the entire positioning` → `and the capacity gap is what AMD is selling`.
- Nvidia Rubin: `and memory is the line item that moved` **cut** rather than replaced. Moving the
  memory-dominates-cost claim into the section's opening sentence made the tag redundant, and the audit's
  replacement ("accounts for most of the increase") would have been a slightly stronger quantitative claim
  than the source carries.
- Intel Gaudi 3: `It is also the end of the line.` → `It is also Intel's last Gaudi part.`

**Skipped**

- Cerebras, Groq and Ascend 910C openers, per the audit's own carve-out.
- `Google's own documentation gives` was left, but Gaudi 3's near-identical `Intel's documentation gives`
  became `Intel documents` so the two sections do not rhyme.

---

## Checks (all six chapters plus the notes)

- `node build/build.js` from the project root: **0 warnings, 0 errors.**
- Front matter parses as JSON in all six chapters.
- `plain` is byte-identical to the first paragraph under "How it works" in 03, 04, 07, 09 and 10, and under
  "The chain in one paragraph" in 01. Verified programmatically, and confirmed in `dist/index.html`, where
  each `plain` string appears exactly twice (the "In plain terms" box and the Summary card) rather than
  three times, which is what the build's de-duplication produces when the match is exact.
- Every `{{figure:…}}` marker still placed; figure, heading and table structure untouched.
- Em dashes appear only inside the bold-label bullets of "Key evaluation criteria"; none added to prose or
  to `landscape-notes.md`.
- Source counts per chapter are unchanged from before the pass (01: 8, 03: 13, 04: 15, 07: 17, 09: 16,
  10: 12). No number was separated from its `([source](url))`, and no number or fact was added.
- Body word counts, all component chapters inside 1,050-1,350: 03 1,130 · 04 1,161 · 07 1,169 · 09 1,096 ·
  10 1,118. Chapter 01 is 893 and keeps its own shape.

---

## `content/11-memory-and-hbm.md` — 1,184 → 1,090 words

The audit's densest chapter. All thirteen items addressed; the paragraph shape was the real work.

**Applied**

| Audit item | What I did |
|---|---|
| Card `plain`: `The fix is not a faster runner but a wider door` | Took the audit's stronger option and dropped the negation: `A cook can chop faster than anyone can fetch the ingredients, so the answer is a wider door.` The "Think of …" reader-instruction went with it, which also removes one of the four analogy openers counted in §3. Changed byte-identically in the front matter and under "How it works". `plain` is now 95 words. |
| Card `plain`: `Three firms in the world can do it.` | → `Only SK hynix, Samsung and Micron can do it.` Names beat a count, as the audit says. |
| Lede: `The arithmetic got cheap. The dragging did not.` | Folded into the first sentence: `An AI accelerator is a machine for dragging numbers past arithmetic units, and arithmetic got cheap faster than the dragging did.` Also cut `it is the largest block of silicon in the package`, which the `oneLiner` already says four lines above. |
| How it works: `The width is the whole trick.` | Cut. The 1,024-bit sentence that follows does the job. |
| How it works: `capacity and bandwidth, not arithmetic` | → `Capacity and bandwidth rather than arithmetic usually set how many users one chip can serve.` |
| HBM4: `Nobody ships the baseline.` | Merged forward: `Nobody ships at that baseline: SK hynix completed HBM4 at over 10 Gb/s per pin…` |
| HBM4: `The standard is now a floor the buyers negotiate above.` | Cut. |
| HBM4: `That hands TSMC a position inside a product it does not make.` | **Kept**, per the audit's own note that if one kicker survives in this chapter it should be this one. The section's throat-clearing opener became `HBM4's other change is commercial.` |
| Who makes it: `That is the mechanism by which AI demand raises the price of a laptop.` | → `That is how AI demand raises the price of a laptop.` |
| The chokepoint: `None exists without Korean or American HBM.` | Better than the audit's swap: promoted the claim to the paragraph's first sentence (`Every leading accelerator depends on Korean or American HBM.`) so the paragraph now ends on the three cited products instead of on a lander. |
| The chokepoint: `Washington noticed.` | Deleted; the paragraph opens on the BIS rule. Also cut `Read against the JEDEC numbers` (a second-person instruction) and `which is what makes it a clean control` (a restatement of the clause after it). |
| The chokepoint: `not the DRAM die but the stacking line` | → `what binds a new entrant is the stacking line and the Nvidia qualification behind it rather than the DRAM die`. Also sharpened the hedge the audit flagged in §3, `We think the gap is real but closing` → `We think the gap is closing`. |
| Takeaways: `the cleanest instrument in the whole American toolkit` | Dropped the ranking and kept the reason: `The export control on HBM works because one bandwidth-density threshold catches every part worth buying.` |

**Applied beyond the audit**

- `HBM is the hardest chokepoint in the chain after lithography` **cut** from the Takeaways. It competed directly with chapter 12's `the second great chokepoint after lithography` for the same slot, which is the superlative problem the audit describes. One superlative survives in the chapter (`the most expensive component in an AI accelerator`), and it is the one the chapter's own market numbers support.
- `The workhorse.` (two-word fragment opening HBM3E) folded into the Micron sentence.
- `and that is the barrier`, `The Korean core is now growing an American edge`, `How the three divide the market is on the record` — three restatement or flourish clauses cut or compressed in "Who makes it".
- Criteria bullet: `so yield, not wafer cost, sets the price` → `so yield sets the price more than wafer cost does.`

**Caption**

`specimenCaption` last clause changed from `molding compound filling the gaps` to `and the molding compound as a faint box around the whole stack`, following `qa/specimen-review-packaging.md` §1: the rebuilt specimen adds molding compound as a faint shell enclosing the stack, so the old wording described something no longer on screen. The rest of the caption (base die, twelve DRAM dies, TSVs, microbumps) still matches and is unchanged.

**Left alone**

- `Hybrid bonding is the next step and it is not ready.` Short, but it is a lead, not a lander, and the sentence after it carries the numbers.
- The stacking bullets keep their imperative verbs (`Etch`, `Stack`, `Stay under`), which read as a process recipe rather than as instructions to the reader.

---

## `content/12-advanced-packaging.md` — 1,488 → 1,348 words

**Applied**

| Audit item | What I did |
|---|---|
| Lede: `Packaging is how the industry escaped the reticle. It is now the tightest constraint in the chain.` | Replaced the epigram-plus-superlative pair and dated the claim (see the structural note below). |
| How it works: `That carrier is the interposer.` | Folded: `…the memory has to sit beside the logic on a shared silicon carrier, the interposer.` |
| How it works: `CoWoS builds it in two steps.` | → `CoWoS builds it in two passes, chip-on-wafer and then wafer-on-substrate`, with the two colon-tagged half-sentences merged into one active sentence. |
| How it works: `None of it is novel physics.` | → `The unit processes are ordinary. One joint cracked by thermal cycling, though, kills a body holding…` |
| Capacity: `that silence is itself the story` | → `and the omission is deliberate`. |
| Capacity: `because the number is the constraint` | Cut. |
| Who makes it: `Two industries share the word packaging.` | → `The word packaging covers two industries.` |
| Who makes it: `and bonding is the narrowest` | Cut the escalation; the bullet stem is now `The tools are a narrower chokepoint than the assembly houses.` |
| Who makes it: `Neither replaces Taiwan this decade.` | Cut. The dates say it and the Takeaways says it once. |
| The chokepoint: `TSMC's roadmap makes the chokepoint worse before it gets better.` | → `Each generation on TSMC's roadmap asks more of the interposer.` |
| Takeaways: `it is a capacity problem, not a physics problem` | → `the physics was solved and the lines were not built`. |

**Structural fix: the framing versus the re-sourced SemiAnalysis paragraph**

The chapter opened by calling packaging "the tightest constraint in the chain" while a paragraph added by the
re-sourcing cites SemiAnalysis (March 2026) saying front-end wafer capacity is now the dominant bottleneck and
CoWoS is easing. Resolved by dating the claim rather than deleting either half, and without adding a number or
a source:

- **Lede** now reads `Packaging is how the industry got around the reticle, and through 2024 and 2025 it was what capped how many accelerators the world could build.`
- **`oneLiner`** changed from `Since then the limit has been how large an interposer TSMC can build, and how many of them per month` to `What replaced it is how large an interposer TSMC can build, and through 2025 how many of them per month.`
- **Capacity** section: the Epoch paragraph's closer moved to past tense (`which is why packaging ran out and logic did not`), and the SemiAnalysis paragraph now turns the section: `The ordering has since flipped… The queue has eased and the concentration has not.`
- **Takeaways** opens `Advanced packaging capped AI chip output through 2024 and 2025`, then carries the turn with its citation attached (`By March 2026 the binding constraint had moved back to front-end wafers`) and closes on what has not changed.

**Caption**

`specimenCaption` replaced per `qa/specimen-review-packaging.md` §2, which reports that a Blackwell-class package has no lid and that none is drawn. `Lid and stiffener at the top` → `A stiffener frame at the top`, the dies are now `reticle-sized`, and the interposer clause gains the wiring the rebuild added: `the silicon interposer with its through-silicon vias and the wiring that stitches the dies together and fans out to the memory`. The reviewer's proposal was tightened to two sentences.

**Cut for length (1,488 was 138 words over the ceiling)**

- The lede no longer paraphrases the plain-English box, which had said "cut into pieces and stitched back together on a shared slab of silicon" four lines below.
- `The reticle limit is why logic is cut into chiplets.` — the same sentence as the plain box's second clause.
- `TSMC certified the 5.5-reticle version in 2025 and now produces it.` — the table row, the roadmap figure and the criteria bullet all carry 5.5x; this was the fourth rendering, and it sat in the middle of the paragraph about Blackwell going badly.
- The `**Now.**` roadmap bullet, for the same reason: `{{figure:cowos-reticles}}` plots 3.5 → 5.5 → 9.5 → 14 directly above it.
- `SK hynix expects full adoption only at HBM4E or HBM5, where stacks pass 20 layers` removed from the hybrid-bonding bullet. The sentence and its citation live in chapter 11, where the HBM roadmap is the subject; here the bullet is about who builds the bonder. This is the one source-count change in the pass (20 → 19); the number went with its citation and nothing is left unsourced.
- Also cut or compressed: "the second great chokepoint after lithography", "Demand is as narrow as supply", "the industry's most constrained process", "China's back end is much stronger than its front end" (a verbatim echo of the nameplate's `chinaStatus` field), and the fabs-and-R&D-centre detail in the Arizona paragraph, which belongs to chapter 10.

**Skipped / left because changing it would change a fact**

- The `Variants and trade-offs` table still gives CoWoS-S a ceiling of `3.3x reticle, about 2,700 mm2`. `qa/specimen-review-packaging.md` §2 argues that the 3.3× / 2,831 mm² figure quoted for Blackwell is *chip* area rather than interposer area, and that a real interposer for that chip is closer to 4,300 mm². That is a factual correction, it lives in a table and a `keyFact`, and the source cited (TSMC's own CoWoS page) is what the number is drawn from. Flagged here rather than edited.
- `two of the most expensive logic dies ever made` kept: it is a cost descriptor rather than a "most X in the chain" claim, and it is the reason the cracked-joint sentence lands.

---

## `content/13-substrates-and-pcbs.md` — 1,433 → 1,334 words

**Applied**

| Audit item | What I did |
|---|---|
| Glass core: `Both dates are the giveaway. Glass is the answer to the next problem, not this one.` | → `Both programmes point past 2027, so glass answers the next problem rather than this one.` (The audit proposed "Both dates are after 2027"; Intel's cited date is a 2023 announcement targeting the late decade, so "programmes point past 2027" is what the two sources actually support.) |
| The materials underneath: `Ajinomoto's film is a rounding error in a food company's accounts and a chokepoint in everyone else's.` | **Kept.** The audit says to keep one of the two balanced-antithesis section openers and cut chapter 06's; 06 belongs to another editor, so this is flagged rather than coordinated. |
| The materials underneath: `Buyers have noticed:` | → `Apple and Qualcomm are both among the customers worried about Japanese glass cloth supply`. |
| The boards under the GPU: `has quietly become an engineering problem of its own` | → `has become an engineering problem of its own`. |
| Who makes it: `The substrate fabs themselves are an oligopoly, and all of them are building.` | → `The substrate fabs are an entirely Asian oligopoly, and all of the large merchant makers are expanding.` This also absorbed the following clause, `The oligopoly is entirely Asian, and Washington noticed early:` — the same two-word tic that chapter 11 uses. |
| The chokepoint: `That is why a product first adopted in 1999 still sets the standard.` | Cut. |
| Criteria: `Second-sourcing a film or a laminate takes years, not quarters.` | → `takes years.` |
| Criteria: `is the commercial moat` | → `is what protects the incumbents`. |
| Takeaways: `The substrate is the least glamorous and most binding part of an AI package.` | Cut, per the audit's stronger option: the Takeaways now opens on the TSMC capacity claim. The chapter is left with no "most X in the chain" claim in its body. |

**Applied beyond the audit**

- `Scale is what makes it bite.` cut; the Ajinomoto layer count that follows is the scale.
- `Every added layer is another lamination, drill, plate and pattern loop, and yield compounds down the stack.` cut — the criteria bullet `Each added build-up layer multiplies the yield risk` already carries it, and the process loop is spelled out under "How it works".
- `It is candid about what that money defends.` and `Asked in May 2026 how competition would evolve as the parts got harder, management said that…` compressed to `In May 2026 management said that…`.
- `The demand shift shows up in TTM's own mix.` and `TTM also names where its competition lives:` — two stub sentences, merged into the sentences they introduced.
- `What breaks first as packages grow is flatness.` → `Flatness breaks first as packages grow.` (cleft removed).
- Criteria: `warpage and handling, not wiring, set the process window` → `warpage and handling set the process window rather than wiring.`

**Caption**

`specimenCaption` replaced per `qa/specimen-review-packaging.md` §3: the specimen was rebuilt as a cutaway, so `pulled apart` was wrong. Now `Right: an ABF build-up substrate with a quarter cut away. A glass-cloth core drilled with plated through-holes, eight layers of build-up film laminated onto each face with their own copper wiring and laser-drilled microvias, landing pads above and solder balls underneath, with the film itself drawn in copper.` The reviewer's three-sentence proposal was tightened to two, and "picked out in copper" became "drawn in copper" to match the vocabulary the other two captions use.

**Left alone**

- `Money can expand an oligopoly of substrate fabs, and it is being spent.` A judgment stated plainly, which the brief allows.
- The Ibiden, Unimicron and Samsung Electro-Mechanics bullets keep every figure and citation; only the framing sentences around them changed.

---

## Checks (chapters 11, 12 and 13)

- `node build/build.js` from the project root: **0 warnings, 0 errors.** `D 0` and `? 0` for all three chapters.
- Front matter parses as JSON in all three.
- `plain` is byte-identical to the first paragraph under "How it works" in all three, verified programmatically after every edit. Lengths: 11 is 95 words, 12 is 105, 13 is 93 (unchanged) — all inside the brief's 60-110.
- Every `{{figure:…}}` marker still placed and still matching a figure defined in the front matter: 11 has `hbm-bandwidth`, `hbm-suppliers`, `hbm-revenue`; 12 has `cowos-buyers`, `cowos-reticles`, `china-backend-tools`; 13 has `abf-layers`, `unimicron-mix`. Headings and tables untouched.
- Em dashes appear only inside the bold-label bullets of "Key evaluation criteria" (six in 11, six in 12, none in 13, which uses plain verbs there).
- Source counts: 11 unchanged at 15, 13 unchanged at 19, 12 down from 20 to 19 for the one reason given above. No number lost its `([source](url))`, and no number or fact was added.
- Body word counts, all inside 1,050-1,350: **11 1,090 · 12 1,348 · 13 1,334.**
- Paragraph-shape check: no two consecutive body paragraphs end on a short lander in any of the three. Chapter 11 went from the site's highest concentration of two-to-five-word kickers to three short closers, each of them a fact (`Only SK hynix, Samsung and Micron can do it.` / `Nobody else has leading-edge DRAM and a stacking line inside one company.` / `That is how AI demand raises the price of a laptop.`).
- Superlative slots: one per chapter at most. 11 keeps `the most expensive component in an AI accelerator`; 12 and 13 now make none in the body. Zero instances of `leverage`, `moat`, `ecosystem`, `quietly`, `essentially` or `at scale` remain in the three files, and zero numeric list stems.

---

# Chapters 14 to 18 (second editor)

Applied to `content/14-test-and-assembly.md`, `15-systems-and-networking.md`,
`16-data-centers-and-power.md`, `17-component-costs.md` and `18-geopolitics.md`, after the Zinsser pass
recorded in `qa/prose-pass-2.md`. Items the audit logged that the Zinsser pass had already removed are not
repeated here. Beyond the audit's own list, each chapter was read again end to end for the pattern the audit
could only count: the long-long-long-short paragraph, repeated. Endings were broken up by folding the closer
into the sentence before it, by cutting it where the cited numbers already made the point, and by leaving it
alone where the short sentence carried a fact. No two consecutive paragraphs now end on an aphorism in any
of the five.

## `content/14-test-and-assembly.md` — 1,129 → 1,129 words

**Applied**

| Audit item | What I did |
|---|---|
| How it works: `Test happens at least three times and increasingly four.` | Numeric stem replaced with the thing itself: `Each round of test catches failures the round before it cannot see.` The bullets already number themselves, and the new line says what the four insertions are for. |
| Who makes it: `The rest of the floor is more fragmented.` | → `Below the two testers the floor breaks into separate niches with separate suppliers.` I first wrote "each segment has its own leader", then changed it: the probe-card and handler bullets name two firms each without ranking them, so "leader" would have over-claimed. |

**Also fixed (flagged by the prose editor, not the audit)**

| Item | What I did |
|---|---|
| `A three-way race with a long tail` for probe cards names two firms | Cut the phrase. The bullet now reads `**Probe cards.** FormFactor took US$785.0 million in fiscal 2025 ([source]); Technoprobe grew 15.7% to EUR 628.4 million…`, which is exactly the two firms the chapter cites. Naming a third would have needed a source we do not have; dropping the count needs none. |

**Rhythm, beyond the audit**

- Lede: `Everything before this chapter makes dies. The back end decides which of them are allowed into a package.` became one sentence joined by a semicolon. Two short sentences in a row at the top of a chapter is the site's drumbeat in miniature.
- The chokepoint: `That is a small share of the money for a step every chip has to pass through.` folded into the sentence before it, so the paragraph ends on the SIA figure and its reading in one breath.
- Takeaways: `Advantest has turned a duopoly into a two-thirds share. The back end is also the one segment where Chinese firms are genuinely competitive, so export policy has less grip here than anywhere else in the chain.` became `Advantest has turned a duopoly into a two-thirds share of the machines. The assembly floor beneath it stays fragmented, and four of the top ten OSATs are Chinese ([source]), which is why export policy has little grip here.` This removes the second chain-wide superlative (the chapter keeps one, `the tightest niche`, for thermocompression bonders), removes `genuinely`, and lands the takeaway on the CSET count instead of on a claim. The CSET source is already cited in "The back end's geography", so the chapter's source count is unchanged at 27.

**Skipped**

- Nothing else. The audit had only two items for this chapter and said most of what it logged an hour earlier was already gone.

## `content/15-systems-and-networking.md` — 1,140 → 1,141 words

**Applied**

| Audit item | What I did |
|---|---|
| Card `plain`: `Think of a rowing eight.` | Dropped the analogy, as the audit suggested, since nothing later in the chapter uses it: `A cluster runs only as fast as its slowest link, so this stage is built to keep every accelerator in step. It bolts each finished package onto a board…` Changed byte-identically in the front matter and in the first paragraph under "How it works". |
| Card `plain`: `the tightest supply in this layer is a laser material, not a chip` | → `the tightest supply in this layer is a laser material`. The `oneLiner` already runs the reversal. |
| How it works: `Two networks run through every AI cluster and they are not interchangeable.` | → `Every AI cluster runs two networks that are not interchangeable.` |
| Scale-up: `Three architectures matter` | → `The architectures differ in how many accelerators share one coherent domain.` |
| Scale-out: `and two things did the work` | Deleted, and the two paragraphs merged into one: `Ethernet took it back on raw capacity first: Broadcom doubled merchant switch bandwidth every generation, from 25.6 Tbps … to 51.2 … and 102.4 …. Then the Ultra Ethernet Consortium published its 1.0 stack in June 2025 …`. The "first … Then" does the counting the stem was doing. |
| The chokepoint: `Three things are genuinely narrow.` | → `What cannot be replaced that fast sits underneath the assembly.` The stem is gone and the sentence now says what the three bullets have in common, which is the point the paragraph above it sets up. Knock-on fix: `Optical module assembly is a fourth case` became `a separate case`, because with the count gone "fourth" had no antecedent. |
| Key evaluation criteria: `count the suppliers of the laser, not the module` | → `many firms assemble the modules; far fewer can make the lasers inside them`. Drops both the imperative and the "X, not Y". |
| Takeaways: `The leverage sits in NVLink-class scale-up switching` | → `The control point is NVLink-class scale-up switching` |

**Also fixed (flagged by the prose editor, not the audit)**

| Item | What I did |
|---|---|
| `Marvell holds the other half, with AWS and Microsoft.` — a share claim with no citation | Replaced with a claim that needs no number, supported by Marvell's own words: `The other custom-silicon designer is Marvell, whose five-year agreement with AWS, announced in December 2024, covers custom AI products alongside optical DSPs, PCIe retimers and Ethernet switching silicon ([source](https://www.sec.gov/Archives/edgar/data/1835632/000183563224000193/final2024_12x02xmarvell-.htm))`. That is Marvell's 2 December 2024 8-K exhibit on EDGAR (Tier A), which says the agreement covers "custom AI products, optical digital signal processors (DSPs), active electrical cable (AEC) DSPs, PCIe retimers, data center interconnect (DCI) optical modules and Ethernet switching silicon solutions". **Microsoft was cut.** Marvell's FY2026 10-K names no customers at all (its concentration table says only "Customer A", 14% of net revenue), and I found nothing in Marvell's own investor materials naming Microsoft as a custom-silicon customer; `marvell.com` returns 403 to the fetcher, so its investor-day PDFs could not be read. The "other half" share claim was cut for the same reason: Marvell publishes no such figure. Chapter source count 21 → 22, tier A. |

**Rhythm, beyond the audit**

- The chapter said the same thing three times in the first screen: the `oneLiner` ("few can make the lasers"), the `plain` box ("the tightest supply in this layer is a laser material") and the lede ("the scarcest input in that industry is a laser material"). The lede's second clause was cut, so the lede now states the stage and the payoff arrives once, in the plain box: `Bolting it down, powering it and linking it to its neighbours is a separate industry from making it.`
- `Rubin keeps that shape.` (four words, after a 30-word cited sentence) joined to that sentence with a semicolon, each half keeping its own citation.
- `Large buyers run both fabrics.` folded into the Nvidia quotation sentence as `…, because large buyers run both fabrics.`
- Indium phosphide bullet: a three-clause `and … and …` chain broken with a colon.

**Skipped**

- `An accelerator ships as a module, not a bare chip` kept. The contrast is the definition, as the Zinsser pass already argued.

## `content/16-data-centers-and-power.md` — 1,190 → 1,160 words

**Applied**

| Audit item | What I did |
|---|---|
| Card `oneLiner`: `The chips are no longer the long pole.` | → `The chips are no longer what a buildout waits on.` |
| Card `plain`: `Picture a domestic hair dryer` | → `A domestic hair dryer pours about two kilowatts of heat out of a hand-sized nozzle.` Same image, no instruction to the reader. Changed byte-identically in the front matter and in the first paragraph under "How it works". |
| Card `plain`: `That queue is where an AI buildout now waits.` | Cut, in both copies. The sentence before already says the equipment is ordered years ahead. |
| Rack power: `A megawatt rack is not a bigger version of a 142 kW one.` | Merged into the sentence that proves it: `A megawatt rack changes the busbar, the floor loading, the coolant flow, the leak detection and the ride-through storage: …`. |
| Capacity and demand: `Energy per token falls; total energy still rises` | → `Energy per token falls while total energy rises, because token volume rises faster.` |
| Capacity and demand: `Supply is not growing at data center speed.` | Cut. The LBNL projection and the EIA growth figures in the two sentences before it make the point. |
| The chokepoint: `Six years of output is already spoken for.` | Folded in: `…against a book of 116 GW, close to six years of output ([source])`. |

**Rhythm, beyond the audit**

- Nuclear bullet: `No restarted reactor is serving data centers yet.` folded onto the licence clause before it with `so`, which removes a kicker at the end of a bullet list without losing the judgment.

**Skipped**

- `**Energy per token** — the only efficiency metric that matters commercially` left alone. It is a strong unsourced opinion, but it is pre-existing, the house style allows judgments, and it is this chapter's single superlative.
- Card `chinaStatus` ("Power is not China's binding constraint…") untouched: front-matter JSON is out of bounds for this pass except `oneLiner` and `plain`.

## `content/17-component-costs.md` — 1,259 → 1,259 words

**Applied**

| Audit item | What I did |
|---|---|
| Card `oneLiner` / Takeaways duplication | Kept the `oneLiner` ("the silicon turns out to be the cheap part") and cut the Takeaways repeat `The silicon is the cheap part.`, so the section now opens on the arithmetic: `On a B200 the logic dies are 14 percent of the build, HBM 45, and packaging with its scrap another 33 ([source])`. |
| Card `plain`: `Think of the receipt for a new car.` | → `An accelerator's bill of materials works like a car's.` The redundant `An accelerator is the same.` went with it. Changed byte-identically in the front matter and in the first paragraph under "How it works (the cost model)". |
| `which is where a regulator finds leverage` | → `which is where a regulator has the most purchase`, in both copies. (The audit filed this under `chinaStatus`; it is in `plain`.) |
| How it works: `Die cost has three inputs.` | Replaced with the plain statement rather than the count: `Die cost is set by the wafer price, the number of dies that fit on a wafer, and the share of those that work.` The sentence after the bullets ("Run those three numbers…") still lands. |
| The chokepoint: `We sort the stages into three classes.` | Deleted. The table's own `Class` column says it, and `The classification is ours; its yield and margin figures are cited above.` follows the table. |
| Who captures the value: `Value moved from Nvidia to Nvidia's suppliers.` | Folded into the Micron sentence: `…and 84.6 percent in the quarter to May 2026 ([source]), so the margin moved upstream to Nvidia's suppliers.` Kills the chiasmus and the kicker in one move. |
| Key evaluation criteria: `Cost per good die, not per wafer.` and `Rack watts, not rack dollars.` | → `Cost per good die.` and `Rack watts.` The sentence under each already draws the contrast. |
| Key evaluation criteria: `Ask whether the line falls when volume doubles.` | → `The test is whether the line falls when volume doubles.` |

**Rhythm, beyond the audit**

- `so the table carries one generation, not three` → `so the table carries one generation only`. A fifth negation-contrast in a chapter the audit already called the worst cluster for them.

**Skipped**

- The three parenthetical headings (`## How it works (the cost model)`, `## Variants and trade-offs (the BOMs)`, `## The chokepoint (what is structurally expensive)`). The audit wants them shortened; headings are structure and out of bounds for this pass. **Left for whoever owns the headings.**
- `| ABF substrates | Compressible with scale | A laminate line, not a physics frontier. |` — an "X, not Y" inside the class table. Tables are out of bounds.
- `Epoch AI builds these as distributions, not point estimates` kept: the contrast is the methodological fact.
- `Follow that $6,400 and you learn…` in the lede kept. It is second person, but it is the chapter's driving question and it was not on the audit's list of six.

## `content/18-geopolitics.md` — 2,498 → 2,493 words

**Applied**

| Audit item | What I did |
|---|---|
| The shape of the contest: `Licensing once asked who was buying and why; …` | Kept, as the audit asked, but merged into the paragraph above it. With `The yard has not stayed small.` already gone it had become a one-sentence paragraph closing the section, which is the shape the audit is objecting to. |
| The US export-control campaign: `Three moves have set the current settlement.` | → `Early 2026 set the current settlement.` The count is gone and the date does the work; the third item is an enforcement penalty rather than a rule, so the audit's "Three rules since January 2026" would not have been accurate. |
| China's response: `The minerals followed.` | → `Export controls on minerals followed.` |
| China's response: `Nothing was repealed.` | → `Nothing was repealed; the licensing regimes stand.` The audit's merge also restated "one ban was paused for twelve months", which the November 2025 bullet directly above already says, so that clause was cut instead. |
| Where the chips go: `Southeast Asia is the leak.` | → `Southeast Asia is where the controls leak.` |
| Where the chips go: `It is not law yet.` | Folded in: `…passed it 42-0 on 26 March 2026 ([source]), and it has not become law.` |
| Predicted winners: the whole block | Rewritten, see below. |
| Predicted winners: `The United States wins the top of the stack, not the middle.` | Bold label reduced to `**The United States.**`; the judgment moved into plain sentences. |
| Predicted winners: `Our judgment, not a source's.` | → `These are our judgments, not any source's.` |
| Allies: `Europe's leverage at the leading edge` | → `Europe's position at the leading edge` |
| What to watch: `The two policies point in opposite directions and one will give.` | → `The two policies contradict each other, and one of them will be dropped.` |

**Predicted winners, in detail**

Six bullets, each a bold epigram of the form "*Country* wins/loses *thing*", in strict parallel, with an
aphorism to close. What survives is four bullets and a closing paragraph:

- The four bold labels are now the jurisdiction alone (`**Taiwan and Korea.**`, `**The Netherlands and Japan.**`, `**The United States.**`, `**China.**`), so the prediction and its reason are in the sentences, where the evidence is, instead of being compressed into an epigram the reader has to unpack. These four are genuinely parallel — a jurisdiction, an outcome, a reason — so they stay bullets.
- The last two were not parallel with them (one is a region that makes nothing; one is an idea), so they became an ordinary closing paragraph: `The Gulf comes out ahead without making anything: UAE entities now buy advanced compute licence-free while European ones do not. The small yard is the clearest casualty. A 25 percent tariff, an expected 15 percent cut of licensed sales, a 9.9 percent equity stake and a case-by-case licence queue add up to industrial policy rather than a narrow security perimeter.`
- `are industrial policy, not a narrow security perimeter` → `add up to industrial policy rather than a narrow security perimeter`, removing the last "X, not Y" tag in the section.
- `They keep what they hold.` was cut from the Taiwan and Korea bullet after a first pass: with the bold label reduced to the jurisdiction, a five-word epigram immediately after it rebuilt the rhythm the change was meant to break.

**Also fixed (flagged by the prose editor, not the audit)**

| Item | What I did |
|---|---|
| `$31 billion of grants will not` against `$30.9 billion` two sections earlier | Now `$30.9 billion of grants will not`, matching the GAO figure in "Industrial policy". |
| `off an island and a peninsula` under the **Taiwan and Korea** bullet | **Confirmed correct and kept.** The bullet covers Taiwan (an island) and South Korea (a peninsula), and the three things it names sit in exactly those two places: leading-edge logic and CoWoS in Taiwan, HBM in Korea. The bold label supplies the referent, so the figure of speech reads without ambiguity. |

**Rhythm, beyond the audit**

- The lede was a near-verbatim restatement of the `oneLiner`, which renders as the dek at the top of the same page: `Since 2018 Washington has turned this supply chain into a control regime, and Beijing has built an answer.` It is now `Washington's control regime and Beijing's answer to it are both unfinished, and this chapter is a status report on each.` — the chapter's scope and its live-contest framing, which is what `Neither is finished.` used to carry before the Zinsser pass cut it as an aphorism.
- `Advanced packaging belongs in that table…` and `No country in the table is self-sufficient…` were two consecutive one-sentence paragraphs closing a section. Merged into one paragraph.
- `No regulation codifies it.` folded onto the Nvidia filing quotation as `…, though no regulation codifies it ([source])`.
- Sourcing bullet under the table: `SK hynix's US listing prospectus, which puts its HBM share at…` was a fragment; `which` deleted.
- `so they end up with a say in who gets what and less of the business that paid for it` → `so they gain a say in who gets what and lose the business that paid for it`.
- `for accelerators in Chinese data centres` → `for accelerators in its data centres`, the subject of the sentence being Chinese regulators.

**Skipped**

- Card `substitution.why`: `supplier ecosystem that a single national programme cannot conjure`. The audit wants `ecosystem` and `conjure` gone and I agree, but front-matter JSON other than `oneLiner` and `plain` is out of bounds for this pass. **Left for whoever owns the nameplate fields**; it is the last `ecosystem` meaning "industry" in `content/`.
- `An export control is a licence requirement, not a ban on ideas.` kept in `plain` and in the body, per the audit: the negation is the definition a policy reader needs.
- `Domestic HBM, not logic wafers, is the constraint on Chinese accelerator volume.` kept: the contrast is the fact the bullet exists to state.
- `Nothing was repealed; the licensing regimes stand.` stays a one-sentence paragraph. It summarises the four bullets above it and carries the section's conclusion.

## Checks (chapters 14 to 18)

- `node build/build.js` from the project root: **0 warnings, 0 errors.** `D 0` and `? 0` for all five chapters.
- Front matter parses as JSON in all five.
- `plain` is byte-identical to the first paragraph under "How it works" in 14, 15, 16 and 17, and under "The shape of the contest" in 18. Verified programmatically after every edit; the pairs in 14, 15, 16 and 17 were edited together.
- All figure markers still placed: 14 three, 15 two, 16 three, 17 three, 18 three. No heading, table, figure marker or front-matter field other than `oneLiner` (16) and `plain` (15, 16, 17) was changed.
- Em dashes: none in prose. The only em dashes in these five files are the bold-label bullets of "Key evaluation criteria" in 15 (5) and 16 (5); 14, 17 and 18 have none at all.
- Sources: 14 unchanged at 27, 16 at 14, 17 at 21, 18 at 54. 15 goes 21 → 22, the added source being Marvell's 2 December 2024 8-K on SEC EDGAR (Tier A; `sec.gov` is already in `data/source-tiers.json` under A). No number was separated from its `([source](url))`; the one number removed from prose (`one ban was paused for twelve months`) is stated in the cited bullet directly above it.
- Body word counts: 14 1,129 · 15 1,141 · 16 1,160 · 17 1,259, all inside 1,050-1,350; 18 is 2,493, inside 1,800-2,500.
- Paragraph-ending sweep after the pass: no paragraph in any of the five ends on a short rhetorical sentence following long cited ones, and no two consecutive paragraphs end on an aphorism. The short paragraph endings that remain are cross-references (`See Memory and HBM.`, `See Advanced packaging on why that capacity binds first.`) or facts (`Saudi Arabia still works licence by licence.`).

---

## `content/02-design-and-eda.md` — 1,162 → 1,155 words

**Applied**

| Audit item | What I did |
|---|---|
| Card `plain`: `That is why cutting off the software cuts off the chip.` | → `Withhold the software and the design cannot be manufactured.` Changed byte-identically in the front matter and in the first paragraph under "How it works". |
| Lede: `no fab, no cleanroom and no hazardous gas` | → `no factory`. The triplet of negations was doing one job. |
| `A design runs through five phases.` | Count deleted. Replaced with a lead-in that carries its own content, `The sequence is the same at every design house:`, because the build strips the `plain` paragraph out of the body and the section would otherwise open on a bare bullet list. |
| `What disciplines the work is not the licence fee but the cost of a mistake.` | → `The licence fee is not what disciplines the work; a mistake costs a mask set.` |
| `Design services are tighter still` | → `Design services are narrower again`. The chapter used "tighter still" twice; the other one, on segment share, is the apter and stays. |
| `The lever works, and needs no allied coordination and no lead time.` | → `The lever needs no allied coordination and no lead time.` |
| `the gap is foundry-validated corner cases, not features.` | → `the gap is in foundry-validated corner cases rather than in features.` |
| Criteria: `A point tool is replaceable; a signed-off flow is not.` | Cut. The nameplate's `substitution.why` says it two inches higher on the same page. |
| Takeaways: `Closest is not close.` | Cut, and the sentence before finished as the audit proposes: `…and the one China is closest to neutralising, though CSET still puts a complete domestic flow out of reach ([source])`. The citation is the CSET piece already used in the body, so no new source. |

**Applied beyond the audit (rhythm pass)**

- The Broadcom paragraph in "Who makes it" ran five sentences and two ideas (how big Broadcom is, and which customers admit to using it). Split after the $16.7 billion figure.

**Skipped**

- Card `usStatus`: `This is the fastest-acting lever in the entire chain.` The audit is right, but front-matter fields other than `oneLiner`, `plain` and `specimenCaption` are out of bounds for this pass. **Left for whoever owns the nameplate fields.**
- `specimenCaption` untouched: the `die-floorplan` specimen is still being redesigned.

---

## `content/05-lithography.md` — 1,446 → 1,334 words

Back inside the 1,050 to 1,350 band. Nothing cut was a sourced number: the citation multiset is unchanged except one Reuters price citation, which was the second copy of the same prices in Takeaways.

**Applied**

| Audit item | What I did |
|---|---|
| Lede: `No other stage in this chain has a single point of failure this sharp.` | Cut. 48 systems and nobody else selling one is harder than the claim about it. The chapter's one superlative now sits in the `oneLiner`, where the numbers support it. |
| `That is the commercial case for EUV.` | Cut. |
| `Adoption splits two ways.` | → `Intel and TSMC have split on High-NA:` (names the split, and runs into the bullets). |
| `Four carry the EUV machine.` | → `Four of them carry the EUV machine:` |
| `It is a real technology with no leading-edge logic customer.` | Folded onto the Canon sentence: `…at a 14 nm minimum linewidth ([source]), and no leading-edge logic customer has adopted it.` |
| `Below EUV, the restrictions came in three moves.` | → `Below EUV, the restrictions arrived in this order:` |
| `China's answer has two tracks.` | Deleted; `On DUV it is real.` became `On DUV, China's answer is real.` |
| `Mirrors are the reason: only Zeiss makes optics to that figure.` | → `Between the light and a printed chip sit the mirrors, and only Zeiss makes them to that figure.` (drops the colon-reveal, keeps the causal point). |
| `the hardest parts sit at Zeiss and Trumpf, not in Veldhoven` | → `…since its optics come from Zeiss and its drive laser from Trumpf.` The Zeiss-versus-Veldhoven contrast was being made twice in one chapter; it now happens once, in the "We think" judgment under "Who makes it". |
| `For AI accelerators the leverage is in EUV` | → `For AI accelerators, EUV is the point of control.` |
| Takeaways: `One firm, in one Dutch town, using mirrors from one German optics house` | → `ASML, in Veldhoven, using Zeiss mirrors from Oberkochen`. Reporting instead of anaphora. |
| Takeaways: `Nothing on the horizon changes the shape of this bottleneck before 2030.` | → `No announced programme changes this bottleneck before 2030.` |

**Applied beyond the audit (Zinsser pass and word budget)**

- `We think Zeiss mirror polishing and coating, not final assembly in Veldhoven, sets the ceiling…` → `We think the ceiling on EUV output is Zeiss mirror polishing and coating rather than final assembly in Veldhoven.` The judgment is the contrast, so it stays; the stapled-tag shape does not.
- `Treat claims of Huawei EUV mass production in 2026 as unverified.` was a second-person instruction closing a paragraph. It is now a statement at the head of that paragraph, which also stops the paragraph landing on a ten-word beat: `On EUV the record is thinner, and claims of Huawei EUV mass production in 2026 remain unverified.`
- `Source power sets output.` and `The price moves with the aperture.` were both stems. The first is now a clause carrying the 1,000-watt fact; the second is gone and the price moved into its own two-sentence paragraph.
- Merged the long-then-short pairs at `These tools still dominate by volume.`, `Immersion is the contested tier.`, `The effect shows in ASML's mix.` and `A DUV scanner costs roughly $60 million.`
- Removed two repetitions rather than facts: the $200M / $350-400M prices in Takeaways (they stand in the body under High-NA with the same Reuters citation) and the significance clause on the 1,000-watt source (it stands in the "Source power" criterion).
- Clutter: `polished smooth to tens of picometres` → `polished to tens of picometres`; `the number of exposures needed to cover a wafer` → `the exposures per wafer`; `divided by the numerical aperture of the optics` → `divided by numerical aperture`; `CSIS judges the technology firmly out of reach there despite heavy state spending` → `out of reach there despite state spending`; `raised its 2026 guidance to` → `raised its forecast for the year to`.

**Caption changed** (`specimenCaption`), per `qa/specimen-review-tools.md`. The reticle is no longer the copper thread, so:

> Right: an EUV scanner in cross-section. Tin plasma source at the bottom left, collector and three illuminator mirrors, the reticle held pattern-down at the top, six projection mirrors, the wafer stage at the bottom right, and in copper the 13.5 nm light itself.

The proposal ran to three sentences; the copper clause is folded into the parts list to keep it to two.

---

## `content/06-photomasks-and-pellicles.md` — 1,237 → 1,175 words

**Applied**

| Audit item | What I did |
|---|---|
| Lede: `A scanner can only print what is on the mask.` | Cut; the chapter opens on the reticle sentence, as the audit proposes. |
| `Three consequences follow.` | Count deleted. The lead-in is now attached to the paragraph above it as `Making the plate a mirror creates its own problems:`, so the bullets are not orphaned under the heading. |
| `The blank is the hard part.` | → `The blank is where two decades of learning sit: depositing forty bilayers with sub-angstrom uniformity across a six-inch plate, with no buried particles.` (merged with the sentence after it). |
| `Call the leading edge $10 million to $40 million.` | → `At the leading edge the range is $10 million to $40 million.` |
| `That is the quiet reason so much AI silicon converges…` | → `That is why so much AI silicon converges…` |
| `Pellicles are the open sore.` | → `Pellicles are the unsolved part:` merged with the sentence after it. |
| Takeaways: `Photomasks are the cheapest critical chokepoint in this chain, and that is what makes them dangerous.` | → `Photomasks are the cheapest chokepoint in this chain, which is why nobody has funded an entrant.` This is the chapter's single superlative and the numbers under it (three suppliers, a ¥40 billion business) support it; the least/most paradox tag, which was the twin of 13's Ajinomoto line, is gone. |
| Takeaways: `quietly decide which AI chips get designed at all` | → `decide which AI chips get designed`. |

**Applied beyond the audit (rhythm pass)**

- Three subsections in a row (Blanks, Writers, Inspection and repair) ended on a short sentence naming one more supplier: *Shin-Etsu supplies the DUV blanks.* / *Japan's NuFlare is the other supplier.* / *KLA sells optical reticle inspection; Zeiss sells e-beam repair.* Shin-Etsu moved up into the DUV-mask sentence under "How it works" with its citation; NuFlare moved into the multi-beam sentence, so Writers now ends on the $4.3 billion valuation. The third was left alone, since it is two facts and no longer part of a run.
- The Blanks paragraph was 140 words and six sentences. Split after AGC's data book.
- `China has mask capability at trailing nodes and nothing at the leading edge.` cut: the three-part negative that closed the paragraph already says it, and the paragraph now opens on SMIC's two Shanghai mask shops.
- The chokepoint paragraph repeated the METI subsidy and the 30 percent capacity addition from the Blanks section, plus Hoya's "exceptionally high" share from Blanks and Takeaways. Both repetitions cut; ¥40 billion kept with its citation, and every fact removed still stands elsewhere in the chapter with the same source.
- The carbon nanotube paragraph ended on the concession (`Neither is yet a production part in a leading-edge fab.`). The concession now arrives with the claim (`Carbon nanotube membranes are the intended fix, still short of production in a leading-edge fab.`) and the paragraph ends on the Mitsui capacity fact.

**Skipped**

- `plain`: `the plate is not a window but a mirror`. This is the site's fourth `not X but Y`, but the contrast is the chapter's central physical fact and the sentence is written for a reader with no background, where "a mirror, not a window" is the whole explanation. Kept, and `plain` and the body paragraph remain byte-identical.

**Caption changed** (`specimenCaption`), per `qa/specimen-review-tools.md`. The copper is now the Mo/Si multilayer rather than the pellicle frame:

> Right: a six-inch EUV reticle with its pellicle. Low-thermal-expansion glass at the base, the molybdenum and silicon multilayer mirror in copper round the top edge, a tantalum absorber carrying the pattern, and a membrane held 2.5 mm off the surface on four glued pads to keep particles out of focus.

`inside its black border` dropped from the proposal to keep the second sentence readable.

---

## `content/08-metrology-and-inspection.md` — 1,339 → 1,328 words

The audit named this chapter second worst, for the lede that repeats the one-liner's joke and for four competing superlatives. Both are gone: the body now makes no "most X in the chain" claim at all, and the no/every antithesis happens once on the page, in the `oneLiner`.

**Applied**

| Audit item | What I did |
|---|---|
| Lede: `No fab is built around its inspection tools. Every fab fails without them.` | Cut. The chapter opens on the size of the segment and KLA's share, as the audit proposes. |
| Lede: `Process control is the quietest chokepoint in this chain and one of the tightest` | Cut. The audit's replacement fact, that process control is about a tenth of fab tool spending, moved up from "Who makes it" into the lede with its citation, and the paragraph that carried it there is now one sentence about the share still rising. |
| `Six families of tool do the work, trading sensitivity against speed.` | → `The tools trade sensitivity against speed.` |
| `Optical carries the volume; e-beam catches what optical cannot see.` | Cut; the bullets above say it. |
| `KLA is the segment.` | → `KLA is most of the segment.` |
| `The rest is specialised, not second.` | → `The rest are specialists, and nobody else reaches 11 percent.` (merged with the sentence after). |
| `The moat is analytics as much as optics` | → `The advantage is analytics as much as optics`. |
| `That is an absence of evidence rather than evidence of absence.` | The chiasmus had already gone; the stub left behind, `Nobody has published a Chinese gain here.`, now carries the audit's second clause: `…, which is not the same as there being none.` |
| `Process control is a chokepoint by concentration, not by physics.` | → `a chokepoint of concentration rather than of physics`. Kept as a contrast because it is the section's argument. |
| Takeaways: `which makes it the most durable lever in the chain` | → `which is why the controls on it are the hardest for China to work around`. Also cut `so process control matters more here than anywhere else` from the takeaway's first sentence, which was the fourth superlative in the chapter. |

**Applied beyond the audit**

- The only em dash in prose in these four files was in "Who makes it", introducing a second copy of KLA's 56.5 percent. Both gone; the 56.5 percent stands in the lede with the investor-day citation, and 57.2 percent with CSET's.
- The new lede was rewritten once more so it does not echo the plain-English box below it (`One American firm sells about seven times as many…`): it now names KLA in its second clause.
- `That is yield learning: find which of the thousand-odd steps is bleeding, fix it, move on.` → `Getting from one to the other is yield learning: find which of the thousand-odd steps is losing dies, fix it, move on.`
- `the direct lever on process control cost` → `which is what sets the cost of process control` (the last `lever` in the chapter).
- `The AI packaging build-out is the fastest-growing part of this segment.` → `…is where this segment is growing fastest.` and Takeaways' `Advanced packaging is the growth engine` → the plain fact, `KLA's packaging process control revenue is heading toward $1.1 billion in 2026`.
- Merged `The December 2024 rule wrote process control into the export lists.` with the sentence listing what it controls.

**Skipped**

- Nothing from the audit's table for 08. Card `chinaStatus` opens `The weakest Chinese position of any major tool segment`, which is a fifth superlative in spirit, but nameplate fields are out of bounds for this pass. **Flagged for whoever owns them**; the body's own version of that claim is now a comparative backed by the cited 0.8 percent.

**Caption changed** (`specimenCaption`), per `qa/specimen-review-tools.md`. The column is now a half-section with the beam in amber:

> Right: a scanning electron microscope column over a wafer, cut in half, with the electron beam in copper. Electron gun under its high-voltage insulator at the top, condenser and objective lenses drawn as iron yokes round their coils, scan coils, an annular detector, and the wafer on a precision stage.

Compressed from the proposal's three sentences to two, and `secondary electron detector` kept as `annular detector`, which is what the specimen draws.

## Checks (chapters 02, 05, 06 and 08)

- `node build/build.js` from the project root: **0 warnings, 0 errors.** `D 0` and `? 0` for all four chapters.
- Body word counts: 02 1,155 · 05 1,334 · 06 1,175 · 08 1,328. All inside 1,050 to 1,350; 05 came down from 1,446.
- Front matter parses as JSON in all four. `plain` is byte-identical to the first paragraph under "How it works" in all four; the pair in 02 was edited together.
- Figure markers all still placed: 02 three, 05 four, 06 one, 08 three. No heading, table, figure marker or front-matter field other than `plain` (02) and `specimenCaption` (05, 06, 08) was changed. `oneLiner` was left alone in all four.
- Em dashes: none in prose. The only ones in these files are the bold-label bullets of "Key evaluation criteria" in 02 (none, the list uses full stops), 05 (5), 06 (5) and 08 (5).
- Sources unchanged: 02 16, 05 25, 06 16, 08 15. Two citation instances were removed as duplicates (the Reuters prices repeated in 05's Takeaways, the Shin-Etsu blank line repeated in 06), and one was added, the CSET article already cited in 02's body, now attached to the same claim in Takeaways. No number lost its `([source](url))`, and no fact was added. The one number that appears in a place it did not before is the year in 08's takeaway, `heading toward $1.1 billion in 2026`, which is the date in the cited KLA letter and in the body sentence the takeaway summarises.
- Numbers diffed against the pre-edit files: identical in 02, and in 05, 06 and 08 the only differences are second copies of numbers that still stand elsewhere in the same chapter with the same source ($200M / $350-400M in 05, 30 percent in 06, 56.5 percent in 08).
- Paragraph-ending sweep: no two consecutive paragraphs in any of the four end on a short sentence after long cited ones. What remains is colon lead-ins into bullet lists, one cross-reference and two short facts.
