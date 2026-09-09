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
