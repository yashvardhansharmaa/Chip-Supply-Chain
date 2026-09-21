# Card fields made precise, chapters 01 to 15, and the wider front matter, chapters 01 to 17

The author read the Deposition and Etch card after yesterday's plain-words pass (`qa/card-plain.md`) and made two corrections that apply to every card. First, scope must be explicit: "For most steps a fab can already buy the tool" became "For most of the deposition and etch steps inside a fab, the tool can already be bought", because "most steps" could mean the fifteen stages of the chain. Second, idioms and figurative phrases go: "The thin spot is atomic layer deposition" became "The exception is atomic layer deposition". The standard, in the author's words: if anything can be written in a simpler manner, do it, without dumbing the writing down for the policy staffer audience. Plain, precise, adult.

This pass reads `card.substitutability.test`, `card.substitutability.why`, `card.chinaStatus`, `card.usStatus` and `card.costSignal` in the front matter of `content/01-*.md` to `content/15-*.md`, sentence by sentence, and fixes four things:

- **Ambiguous scope.** A noun that could point at more than one thing ("steps", "tools", "the market", "these tools", "here", "this", "it", "one", "them") is replaced with the stage's own term: "deposition and etch tool makers", "metrology and inspection tools", "the hardest input in this stage", "No test or assembly tool", "the lasers for the optical links", "without an EUV scanner".
- **Idioms and figures of speech.** "From scratch", "sets the standard", "out of reach", "a map to follow", "the path exists", "the live test", "from a standing start", "a step behind", "catch up", "a far longer road", "has the farthest to go", "a credible shot", "keep it that way", "stay put", "is through it", "lock in", "pick up the volume", "the two ends", "skip the line", "on its books", "sit one layer down", "Home to", "Washington", "took in", "billed", "haggle", "gear", "at scale" are replaced with the plain word.
- **Simpler words.** "Exotic" becomes "unusual", "pushing" becomes "developing", "outright" is cut, "entire" is cut, "on Reuters' reporting" becomes "according to Reuters", "runs about" becomes "costs about".
- **Two ideas in one sentence.** Sentences joined by "and" or a semicolon that carry two facts are split, so each sentence makes one claim. Sentences with no subject ("Strong in filters...", "China's weakest position...", "Home to...", "Expect...", "Count...") get one.

Every fact, number, firm name, band and source claim is kept. Where a sentence now states a thing the old one only implied (the FCC order bars new approvals; GlobalWafers' line is a wafer production line; TSMC's gigafabs are its largest fabs), the fact is in that chapter's body. No em dashes; American spelling; "percent" in prose, "%" kept in `costSignal`. Every other front matter field and every chapter body is unchanged. The Deposition and Etch `why` already carried the author's two corrections; this pass touches only its last two sentences.

## Verdict

Sixty fields changed across the fifteen chapters: `why` in every chapter, `chinaStatus` in thirteen (all but 02 and 05), `usStatus` in twelve (all but 02, 05 and 10), `test` in twelve (all but 05, 06 and 10), and `costSignal` in eight (01, 02, 03, 04, 05, 08, 10 and 13; the other seven were already plain). Fifteen fields were left untouched because every sentence in them already passed the four tests. Each edit was an exact string replacement on the JSON value, so every other field and every chapter body is byte-for-byte as before, and every chapter's front matter parses.

Checks after the edit: `node build/build.js` runs with zero warnings; `node qa/scripts/check-speak.js` reports no matches; `node qa/scripts/check-integrity.js` is clean apart from the known "has no supplier entry" lines for Nova, Samsung Electronics and Veeco Instruments. A scan of the four prose fields finds no em dash, no "%" and no British spelling. The summary view takes the first sentence of `chinaStatus` for the Extreme chapters (01, 04, 05, 08, 09, 10, 11, 12), and each of those first sentences still stands on its own.

Three judgment calls to confirm:

- Chapter 09's `test` said "nobody has built a giant fab outside Taiwan", which is only true of TSMC's gigafabs, the fact the chapter body carries; it now says "TSMC has not built one of its largest fabs outside Taiwan". Samsung and Intel run very large fabs in Korea and the United States, so the wider claim was a scope error.
- Chapter 14's `usStatus` said the FCC "moved against imported gear"; it now says the FCC "barred new approvals for imported equipment containing parts from firms on its Covered List", which is what the chapter body states of the July 2026 order.
- Chapter 14's `why` said Quanta and Wistron would replace Foxconn "within a couple of quarters"; it now says "within a few quarters". If the source says two, "two quarters" is better.

"Recipe" in chapter 08 is kept as "process recipe": it is the word fabs use, the `why` defines it in the same sentence, and no plain word carries the same meaning.

## Wider pass: oneLiner, bridge, leaders[].share and keyFacts[].fact, chapters 01 to 17

The coordinator then widened the brief to the other reader-facing front matter fields, after the chapter body editor found figures there it could not touch (chapter 03's "this layer has been squeezed", chapter 08's "still out of reach"). Same rules. Fifty more fields changed across all seventeen chapters: 13 `oneLiner` (01, 02, 03, 05, 06, 07, 08, 10, 11, 14, 15, 16, 17), 3 `bridge` (07, 16, 17), 11 `leaders[].share` and 23 `keyFacts[].fact`. The before and after for each is in the last section of this file.

What went, by kind:

- **Figures of speech.** "Passes through", "is home to", "the wafers that matter", "stand behind", "stand between", "this layer has been squeezed", "the countries hit", "sits under", "pulling away", "land wrong", "paying for itself", "bought with", "out of reach", "caps its height", "siblings", "all comers", "broke ground", "are the bill", "holds the money", "burns", "building an answer", "what a buildout waits for".
- **Trade and finance shorthand.** "Booked" and "billed" and "took" (revenue) become "reported" or "had revenue of"; "capex" becomes "capital spending"; "basis points" becomes "percentage points"; "feedstock" becomes "raw material"; "merchant mask maker" becomes "mask maker selling to outside customers"; "OSAT" is spelled out; "second sources" and "multi-sourcing" say "a second supplier"; "slated" becomes "planned"; "follow-on" becomes "further"; "build-out" becomes "construction"; "slugs" becomes "plates".
- **Scope.** "The market" in chapter 07's oneLiner is the market for measuring and inspecting tools; "the largest American one" and "the largest Chinese one" are assembly and test firms; "the cube" in chapter 10 is the stack; "a 2 nm-class switch" is a transistor; "the lasers" in chapter 14 are the lasers for the optical links; "large load" in chapter 15 is mostly data centers; the interposer in chapter 11's oneLiner is named as the silicon base plate under the chips.
- **Wrong verb.** A multi-beam mask writer draws the pattern; chapter 05's leader line said "cut".

Chapter 16's oneLiner now says "Memory and packaging are most of the cost": the chapter body puts HBM at $2,900 and packaging at about $1,100 of the $6,400 B200 build cost, so the claim is supported. Every number, firm name, date and source is unchanged; `leaders[].share` keeps "%" as data.

Checks after the wider pass: `node build/build.js` runs with zero warnings; `node qa/scripts/check-integrity.js` is clean apart from the known "has no supplier entry" lines; every chapter's front matter parses; no em dash or British spelling in any of the four field kinds. `node qa/scripts/check-speak.js` reports one match, and it is not in any file this pass touched: `data/control-thresholds.json`, line 229, the `jan2026-review-band-tpp` note, "the regime that permits rather than denies". That file was modified at 00:59:42 on 21 September, after this pass's first clean check and by another editor; it is outside this brief and was left alone. A one-word fix ("permits instead of denying") would clear it.

## Before and after, in chapter order

## 01-design-and-eda: Chip Design, EDA and IP (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Only three complete sets of chip design software exist, and a fourth would have to be written from scratch and approved by the foundry.

After: Only three complete sets of chip design software exist, and a fourth would have to be written from nothing and approved by a foundry.

Why: "from scratch" is an idiom; "the foundry" had no referent on the card.

**substitutability.why**

Before: Three complete sets of chip design software exist today, and they do not mix. The foundry that makes the chip approves exact versions of each tool, and one tool's sign-off that every signal arrives on time is not accepted by another. A newcomer would have to write a fourth set from nothing, then spend five to ten years finding the rare ways a chip can fail, cases the approved tools already catch. CSET judges that Chinese tools cannot yet handle designs for the newest chips.

After: Three complete sets of chip design software exist today, and tools from one set cannot be combined with tools from another. The foundry that makes the chip approves exact versions of each tool. It accepts the check that every signal arrives on time only from the tool it has approved for that check. A newcomer would have to write a fourth set from nothing. It would then spend five to ten years finding the rare ways a chip can fail, which the approved tools already catch. CSET at Georgetown University judges that Chinese design tools cannot yet handle designs for the newest chips.

Why: "do not mix" said plainly; the sign-off sentence carried two ideas and its "another" was unclear; the newcomer sentence split; CSET named in full.

**chinaStatus**

Before: China designs competitive AI accelerators, but it cannot yet take a design for the newest chips all the way through on Chinese software, and CSET at Georgetown University judges that Chinese tools cannot support designs at that level. Washington cut off access to US and German tools for five weeks in 2025, then restored it.

After: China designs competitive AI accelerators, but it cannot yet complete a design for the newest chips on Chinese software alone. CSET at Georgetown University judges that Chinese design tools cannot support designs for the newest chips. The US government stopped sales of American and German design software to China for five weeks in 2025, then allowed them again.

Why: "take a design all the way through" and "at that level" made explicit; first sentence split; "Washington" and "cut off access" said plainly, with what was stopped and for whom.

**usStatus**

Before: Home to the two largest design-software vendors and the leading custom-chip design houses. Siemens EDA is German-owned, but the American technology inside it still needs US export licenses.

After: The United States has the two largest design-software vendors and the leading custom-chip design houses. Siemens EDA is German-owned, but the American technology inside it still needs US export licenses.

Why: "Home to" is figurative and the subject was missing.

**costSignal**

Before: A 3 nm photomask set runs about $40M, and startups have taken a 7 nm design all the way to the factory for $50-75M

After: A 3 nm photomask set costs about $40M, and startups have designed and made a 7 nm chip for $50-75M

Why: "runs about" and "taken all the way to the factory" said plainly.

## 02-silicon-and-wafers: Silicon and Wafers (Moderate to substitute, High concentration)

**substitutability.test**

Before: Five firms already make approved 300 mm wafers, but a fab has to test and approve a new supplier separately for every chip it makes.

After: Five firms already make 300 mm wafers that fabs have approved, but a fab has to test and approve a new supplier separately for every chip it makes.

Why: "approved" now says who approves.

**substitutability.why**

Before: Five firms make 300 mm wafers good enough for the newest chips, so losing one leaves four. Money can still build a new line: GlobalWafers of Taiwan spent $3.5 billion on a plant in Texas, the first of its kind in the United States in over twenty years. The slow part is approval. A fab tests a new wafer supplier on each chip it makes, each test runs for months, and supply contracts are signed years ahead, so switching takes two to five years.

After: Five firms make 300 mm wafers good enough for the newest chips, so losing one leaves four. A new wafer plant can still be built: GlobalWafers of Taiwan spent $3.5 billion on a plant in Texas, the first wafer production line of its kind in the United States in over twenty years. The slow part is approval. A fab tests a new wafer supplier separately for each chip it makes, and each test runs for months. Supply contracts are also signed years ahead. Switching wafer suppliers therefore takes two to five years.

Why: "Money can still build" said plainly; "the first of its kind" now says a wafer production line; the last sentence carried three ideas and is split.

**costSignal**

Before: The entire world market was $11.4bn of wafer revenue on 12,973 million square inches shipped in 2025

After: The world wafer market was $11.4bn in 2025, on 12,973 million square inches shipped

Why: "entire" did no work; the market named.

## 03-chemicals-gases-and-photoresist: Chemicals, Gases and Photoresist (Moderate to substitute, High concentration)

**substitutability.test**

Before: Rated on photoresist, the hardest input here: Japan makes about four-fifths of it, and Korea needed five years to build substitutes.

After: Rated on photoresist, the hardest input in this stage: Japan makes about four-fifths of it, and Korea needed five years to develop substitutes.

Why: "here" made explicit; "build" a formula is "develop".

**substitutability.why**

Before: Photoresist is the light-sensitive coating that takes the printed pattern onto the wafer. Each formula is approved for one layer of one product at one fab, so a new supplier has to develop its version together with the fab, layer by layer. Korea has run this test: when Japan put resist under individual export licenses in 2019, Korea kept its fabs running and spent five years funding its own substitutes. Expect two to five years, and closer to five for the newest chips.

After: Photoresist is the light-sensitive coating that holds the printed pattern on the wafer. Each formula is approved for one layer of one product at one fab. A new supplier therefore has to develop its version together with the fab, one layer at a time. Korea shows what switching takes. When Japan required an individual export license for each shipment of resist in 2019, Korea kept its fabs running and spent five years funding its own substitutes. Switching takes two to five years, and closer to five for the newest chips.

Why: "takes the pattern onto" said plainly; the approval sentence split; "Korea has run this test" is figurative; "put resist under individual export licenses" made explicit; "Expect" had no subject.

**chinaStatus**

Before: China cannot make photoresist for extreme-ultraviolet printing or for the finest 193 nm printing, and it held under 5 percent of the photoresist market as of 2021. It refines 99 percent of the world's primary low-purity gallium, and since August 2023 it has required licenses to export gallium and germanium.

After: China cannot make photoresist for extreme-ultraviolet printing or for the finest 193 nm printing. It held under 5 percent of the photoresist market as of 2021. It refines 99 percent of the world's primary low-purity gallium. Since August 2023 it has required licenses to export gallium and germanium.

Why: Each sentence carried two facts; split.

**usStatus**

Before: Strong in filters, containers, polishing slurries and gas delivery, through Entegris, DuPont and Air Products. Nearly absent from advanced photoresist since JSR of Japan bought Inpria, the American startup, in 2021.

After: American firms are strong in filters, containers, polishing slurries and gas delivery: Entegris, DuPont and Air Products. They are nearly absent from advanced photoresist since JSR of Japan bought Inpria, an American startup, in 2021.

Why: Both sentences lacked a subject; "the American startup" implied a known firm.

**costSignal**

Before: Wafer fabrication materials were a $45.8bn market in 2025 and packaging materials $27.4bn, $73.2bn between them

After: Wafer fabrication materials were a $45.8bn market in 2025 and packaging materials $27.4bn, $73.2bn in total

Why: "between them" said plainly.

## 04-lithography: Lithography (Very hard to substitute, Extreme concentration)

**substitutability.test**

Before: ASML is the only maker of EUV scanners, only Zeiss can polish their mirrors, and a state-funded Chinese team has made the light but no printed chip.

After: ASML is the only maker of EUV scanners, only Zeiss can polish their mirrors, and a state-funded Chinese team has made the light but has not printed a chip.

Why: "but no printed chip" was elliptical.

**substitutability.why**

Before: Nobody else has ever built an EUV scanner. A newcomer would first have to make mirrors a meter wide and polished smooth to within tens of picometers, a picometer being a trillionth of a meter, and a light source that hits tin droplets with a laser 50,000 times a second. The best-funded attempt so far, in China, has made extreme-ultraviolet light but has printed no chip. CSIS judges working systems out of reach, and no announced program changes that before 2030.

After: Nobody else has ever built an EUV scanner. A newcomer would first have to make mirrors a meter wide, polished smooth to within tens of picometers, a picometer being a trillionth of a meter. It would also need a light source that hits tin droplets with a laser 50,000 times a second. The best-funded attempt so far, in China, has made extreme-ultraviolet light but has printed no chip. CSIS judges that China cannot yet build a working EUV scanner, and no announced program would change that before 2030.

Why: The mirror and light-source sentence split; "out of reach" said plainly, with the actor named.

**chinaStatus**

Before: No EUV scanner has ever been sold to a customer in China, and CSIS judges the technology firmly out of reach despite state investment. Shanghai Aishengna Electronic Technology Group, a state-owned firm registered in 2023, is reported to have started producing Chinese immersion DUV scanners in 2026. SMEE, the older Chinese supplier, holds about 4 percent of the world market for i-line scanners, the coarsest kind, and nothing finer.

After: No EUV scanner has ever been sold to a customer in China. CSIS judges that China cannot build the technology despite state investment. Shanghai Aishengna Electronic Technology Group, a state-owned firm registered in 2023, is reported to have started producing Chinese immersion DUV scanners in 2026. SMEE, the older Chinese supplier, holds about 4 percent of the world market for i-line scanners, the coarsest kind, and no share of any finer kind.

Why: First sentence split; "firmly out of reach" said plainly; "nothing finer" made explicit.

**usStatus**

Before: No American firm makes scanners. Washington still controls who gets them, through Dutch export licenses, the American-made parts inside each machine, and its entity list of firms that may not be supplied.

After: No American firm makes scanners. The US government still controls who may buy them, through Dutch export licenses, the American-made parts inside each machine, and its entity list of firms that may not be supplied.

Why: "Washington" and "who gets them" said plainly.

**costSignal**

Before: About $200M for a standard EUV scanner, $350-400M for the newer High-NA version and about $60M for a DUV tool, on Reuters' reporting; ASML does not publish per-system prices

After: About $200M for a standard EUV scanner, $350-400M for the newer High-NA version and about $60M for a DUV tool, according to Reuters; ASML does not publish per-system prices

Why: "on Reuters' reporting" said plainly.

## 05-photomasks-and-pellicles: Photomasks and Pellicles (Hard to substitute, Extreme concentration)

**substitutability.why**

Before: An EUV mask starts as a blank plate coated with forty layers, and AGC and Hoya took two decades to learn how to make one. Three firms have now done it and the structure of the plate is published, so a newcomer has a map to follow: five to ten years to a plate that fabs accept. The harder half is inspection, because Lasertec sells the only tool that checks a mask in the same EUV light the scanner uses. Others stayed out because the business was too small to be worth the money, and that is the one barrier a big budget removes.

After: An EUV mask starts as a blank plate coated with forty layers. AGC and Hoya took two decades to learn how to make one. Three firms have now done it and the structure of the plate is published, so a newcomer knows what to build. Reaching a plate that fabs accept would take five to ten years. The harder part is inspection, because Lasertec sells the only tool that checks a mask in the same EUV light the scanner uses. Other tool makers stayed out of EUV mask inspection because the market was too small to be worth the cost, and a large budget removes that barrier.

Why: First sentence split; "a map to follow" is figurative and the colon hid a second idea; "Others stayed out" now says who stayed out of what; "that is the one barrier a big budget removes" said plainly.

**costSignal**

Before: A mask set for the newest chips runs roughly $10M to $40M, depending on the node and on the estimate

After: A mask set for the newest chips costs roughly $10M to $40M, depending on the node and on who is estimating

Why: "runs" and "on the estimate" said plainly.

## 06-deposition-and-etch: Deposition and Etch (Moderate to substitute, High concentration)

**substitutability.why**

Before: For most of the deposition and etch steps inside a fab, the tool can already be bought from three or four makers: Applied Materials, Lam, Tokyo Electron and ASM International. Switching from one to another means testing the new tool on the fab's own line until it matches, which takes two to five years for the newest chips. The exception is atomic layer deposition, which lays down a film one layer of atoms at a time. Chinese tool makers won real share in etch over five years but stayed under 1 percent in this step, so it is the one where China has the farthest to go.

After: For most of the deposition and etch steps inside a fab, the tool can already be bought from three or four makers: Applied Materials, Lam, Tokyo Electron and ASM International. Switching from one maker to another means testing the new tool on the fab's own line until it matches, which takes two to five years for the newest chips. The exception is atomic layer deposition, which lays down a film one layer of atoms at a time. Chinese tool makers gained real share in etch over five years but stayed under 1 percent in atomic layer deposition, so that is the step where China is weakest.

Why: The author's two corrections were already in; "one to another" now names makers; "in this step" made explicit; "has the farthest to go" said plainly.

**chinaStatus**

Before: China's strongest position in any kind of chipmaking tool. Chinese suppliers held about 11 percent of dry etch and 7 percent of deposition in 2024, but under 1 percent of atomic layer deposition.

After: Of all kinds of chipmaking tool, deposition and etch is where Chinese makers are strongest. Chinese suppliers held about 11 percent of dry etch and 7 percent of deposition in 2024, but under 1 percent of atomic layer deposition.

Why: The first sentence was a fragment with no subject.

**usStatus**

Before: Two of the three largest tool makers are American. Washington lists dry etch, atomic layer deposition and deep-hole deposition tools as controlled exports, and one rule reaches tools built outside the United States with American technology.

After: Two of the three largest deposition and etch tool makers are American. The US government lists dry etch, atomic layer deposition and deep-hole deposition tools as controlled exports, and one rule also covers tools built outside the United States with American technology.

Why: "tool makers" scoped to the stage; "Washington" and "reaches" said plainly.

## 07-metrology-and-inspection: Metrology and Inspection (Moderate to substitute, High concentration)

**substitutability.test**

Before: KLA sets the standard, but every kind of measuring and inspecting tool has a second maker, so losing KLA would slow a fab without stopping it.

After: KLA is the largest maker of measuring and inspecting tools, but every kind has a second maker, so losing KLA would slow a fab without stopping it.

Why: "sets the standard" is figurative.

**substitutability.why**

Before: These tools measure and inspect wafers so a fab can find and fix what is going wrong. KLA is the biggest maker, but seven other firms ship approved tools, and three of them lead one kind of tool outright. A fab that loses KLA and buys from the others keeps running; it sees fewer flaws and fixes them more slowly, and it takes two to five years to catch up. A country that is not allowed to buy from any of them has a far longer road: Chinese firms held 0.7 percent of this market in 2025.

After: Metrology and inspection tools measure and inspect wafers so a fab can find and fix faults in its process. KLA is the biggest maker, but seven other firms ship approved tools, and three of them are the leader in one kind of tool. A fab that loses KLA and buys from the others keeps running. It finds fewer flaws and fixes them more slowly, and it needs two to five years to return to its old performance. A country that is not allowed to buy from any of them would take far longer: Chinese firms held 0.7 percent of the market for these tools in 2025.

Why: "These tools" made explicit; "what is going wrong" said plainly; "outright" cut; the semicolon sentence split; "catch up" and "a far longer road" are idioms; "this market" made explicit.

**chinaStatus**

Before: China's weakest position in any major kind of chipmaking tool. In 2019 Chinese firms held 3.4 percent of line-width measurement, 1.3 percent of defect inspection and none of mask or packaging inspection. In 2025 they still held 0.7 percent of the whole market for these tools. CSET's 2026 survey of Chinese share gains covers deposition, etch, polishing, lithography, packaging and test, and never reaches measurement and inspection.

After: Of all major kinds of chipmaking tool, metrology and inspection is where Chinese makers are weakest. In 2019 Chinese firms held 3.4 percent of line-width measurement, 1.3 percent of defect inspection and none of mask or packaging inspection. In 2025 they still held 0.7 percent of the whole market for these tools. CSET's 2026 survey of Chinese share gains covers deposition, etch, polishing, lithography, packaging and test, and does not cover measurement and inspection.

Why: The first sentence was a fragment; "never reaches" said plainly.

**usStatus**

Before: KLA is the largest maker of these tools in the world. It puts its own 2024 share at 56.5 percent, or 6.5 times its nearest rival; CSET's Supply Chain Explorer puts it at 56.8 percent of the 2025 market. American firms take 72 percent of the segment and Japanese firms 14 percent. A December 2024 rule added inspection and measurement tools for patterned 300 mm wafers to the controlled list, for tools that can find defects 21 nm across or smaller.

After: KLA is the largest maker of metrology and inspection tools in the world. It puts its own 2024 share at 56.5 percent, or 6.5 times its nearest rival. CSET's Supply Chain Explorer puts it at 56.8 percent of the 2025 market. American firms hold 72 percent of this market and Japanese firms 14 percent. A December 2024 US rule added inspection and measurement tools for patterned 300 mm wafers to the controlled list, for tools that can find defects 21 nm across or smaller.

Why: "these tools" and "the segment" made explicit; the semicolon sentence split; "take" is "hold"; the rule is a US rule.

## 08-transistors-and-front-end: Transistors and the Front End (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Three firms make gate-all-around transistors, the newest kind, and none sells its recipe.

After: Three firms make gate-all-around transistors, the newest kind, and none sells its process recipe.

Why: "recipe" is the industry word; "process recipe" says which kind.

**substitutability.why**

Before: The scarce thing is the recipe: which steps, in which order, on which tools. Three firms have written one, so a newcomer knows the path exists but has to work it out again. Rapidus in Japan, backed by the state, is the live test of what that costs from a standing start, on 267.6 billion yen and a 2027 target, so count five to ten years for anyone who can buy extreme-ultraviolet scanners. China cannot buy them; it has reached 5 nm-class features by printing each layer several times, and that keeps it a step behind the newest chips.

After: The scarce thing is the process recipe: which steps, in which order, on which tools. Three firms have written one, so a newcomer knows it can be done but has to work out its own. Rapidus in Japan, backed by the state, is now finding out what that costs when starting with no line, on 267.6 billion yen and a 2027 target. Anyone who can buy extreme-ultraviolet scanners should expect five to ten years. China cannot buy those scanners. It has reached 5 nm-class features by printing each layer several times, and that keeps it behind the newest chips.

Why: "knows the path exists", "the live test", "from a standing start", "count", "a step behind" are figurative; the Rapidus sentence and the China sentence each carried two ideas; "them" made explicit.

**chinaStatus**

Before: SMIC ships a process it calls N+3, measured at 113.4 million transistors per square millimeter. It prints each layer in two or four passes because it cannot buy an extreme-ultraviolet scanner. Its narrowest wires sit closer together than Intel 18A's, which shows what a decade of state money buys without one.

After: SMIC ships a process it calls N+3, measured at 113.4 million transistors per square millimeter. It prints each layer in two or four passes because it cannot buy an extreme-ultraviolet scanner. Its narrowest wires sit closer together than Intel 18A's, which shows what a decade of state money buys without an EUV scanner.

Why: "without one" made explicit.

**usStatus**

Before: Intel runs the only American-owned line that makes the newest transistors. Its 18A process brought gate-all-around transistors and backside power, where power is fed from under the transistors, to market together, and Intel is the first to use High-NA EUV scanners, the newest kind, in volume production.

After: Intel runs the only American-owned line that makes the newest transistors. Its 18A process brought gate-all-around transistors and backside power, where power is fed from under the transistors, to market together. Intel is also the first to use High-NA EUV scanners, the newest kind, in volume production.

Why: Second sentence carried two ideas; split.

**costSignal**

Before: No foundry publishes prices for its newest wafers. The public signal is how much more TSMC packs onto each new process, and that gain falls from 1.2x at N2P to about 1.1x at A16.

After: No foundry publishes prices for its newest wafers. The public measure is how many more transistors TSMC fits on each new process, and that gain falls from 1.2x at N2P to about 1.1x at A16.

Why: "signal" and "packs onto" said plainly; what is packed made explicit.

## 09-foundries-and-fabs: Foundries and Fabs (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Intel and Samsung also run lines for the newest chips, but nobody has built a giant fab outside Taiwan, and the slow part is the crews.

After: Intel and Samsung also run lines for the newest chips, but TSMC has not built one of its largest fabs outside Taiwan, and the slow part is training the workforce.

Why: "nobody has built a giant fab" scoped to what the chapter shows, TSMC's gigafabs; "the crews" said plainly.

**substitutability.why**

Before: Money buys the building. BCG puts the ten-year cost of a fab finished in 2026 at $35 to $43 billion, and Intel and Samsung already run lines for the newest chips, so a newcomer is copying a known path. Money cannot quickly buy a workforce that has run one process for years, and even TSMC has yet to build one of its giant fabs anywhere but Taiwan. Count five to ten years for a working line, and longer to reach real volume.

After: Money can buy the building. BCG puts the ten-year cost of a fab finished in 2026 at $35 to $43 billion. Intel and Samsung already run lines for the newest chips, so a newcomer is copying something that has been done. Money cannot quickly buy a workforce that has run one process for years. Even TSMC has yet to build one of its largest fabs anywhere but Taiwan. A working line takes five to ten years, and reaching high volume takes longer.

Why: "copying a known path" is figurative; two sentences carried two ideas each; "giant" is "largest"; "Count" had no subject; "real volume" said plainly.

**chinaStatus**

Before: SMIC and Hua Hong are China's largest foundries. SMIC took in $9.327 billion in 2025 with its lines 93.5 percent full, but it cannot buy an EUV scanner, so it cannot make the newest chips. China is forecast to have more fab capacity than any other region, and almost none of it is advanced.

After: SMIC and Hua Hong are China's largest foundries. SMIC had revenue of $9.327 billion in 2025 with its lines 93.5 percent full. It cannot buy an EUV scanner, so it cannot make the newest chips. China is forecast to have more fab capacity than any other region, and almost none of it can make the newest chips.

Why: "took in" said plainly; the SMIC sentence split; "advanced" made explicit.

**usStatus**

Before: Intel Foundry is the only American-owned foundry that makes the newest chips, and it lost $2.089 billion on $5.8 billion of revenue in the second quarter of 2026. The federal government owns 9.9 percent of Intel and takes no part in running it.

After: Intel Foundry is the only American-owned foundry that makes the newest chips. It lost $2.089 billion on $5.8 billion of revenue in the second quarter of 2026. The federal government owns 9.9 percent of Intel and takes no part in running it.

Why: First sentence carried two ideas; split.

## 10-memory-and-hbm: Memory and HBM (Hard to substitute, Extreme concentration)

**substitutability.why**

Before: Among the three makers, share moves as soon as a customer approves a new part: Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent by the first quarter of 2026 without adding capacity. A fourth maker is a harder problem. It would need the newest DRAM, a line that drills through and thins wafers, and a way to stack the thinned chips without warping them, all inside one company, and then its stack would have to pass Nvidia's speed test. That takes five to ten years, and no Chinese firm ships HBM3E or HBM4 in volume yet.

After: Among the three HBM makers, market share shifts as soon as a customer approves a new part: Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent by the first quarter of 2026 without adding capacity. A fourth maker would be harder. It would need the newest DRAM, a line that drills through and thins wafers, and a way to stack the thinned chips without warping them, all inside one company. Its stack would then have to pass Nvidia's speed test. That takes five to ten years, and no Chinese firm ships HBM3E or HBM4 in volume yet.

Why: "the three makers" and "share moves" made explicit; "a harder problem" said plainly; the requirements sentence split.

**chinaStatus**

Before: No Chinese firm ships HBM3E or HBM4 in volume. CXMT is the only Chinese firm with a credible shot at it, and the export controls are written to keep it that way.

After: No Chinese firm ships HBM3E or HBM4 in volume. CXMT is the only Chinese firm that could plausibly get there, and the US export controls are written to prevent that.

Why: "a credible shot" and "keep it that way" are idioms; whose controls made explicit.

**costSignal**

Before: An HBM stack moves data over a path 16 times wider than a DDR5 memory module's, and that width costs chip area and lowers the share of stacks that come out working.

After: An HBM stack moves data over a path 16 times wider than a DDR5 memory module's. That width costs chip area and lowers the share of stacks that come out working.

Why: Two ideas; split.

## 11-advanced-packaging: Advanced Packaging (Moderate to substitute, Extreme concentration)

**substitutability.test**

Before: Intel's EMIB can do the same job as TSMC's CoWoS, and the real shortage is making enough good parts at the volume Nvidia orders.

After: Intel's EMIB can do the same job as TSMC's CoWoS, and the real shortage is in making enough working packages at the volume Nvidia orders.

Why: "good parts" made explicit.

**substitutability.why**

Before: None of the steps is exotic, and Intel's EMIB does the same job when TSMC's CoWoS is sold out. The hard part is volume. A newcomer has to buy enough bonding machines and run enough practice lots to turn out an interposer, the silicon base plate, 5.5 times the area a scanner prints in one shot, with its memory stacks attached and working, at the volume Nvidia alone orders. Amkor's plant in Peoria, Arizona is the live test, with production from early 2028, which puts the wait at two to five years.

After: None of the packaging steps is unusual, and Intel's EMIB does the same job when TSMC's CoWoS is sold out. The hard part is volume. A newcomer has to buy enough bonding machines and run enough practice lots to make the interposer, the silicon base plate under the chips, at 5.5 times the area a scanner prints in one shot. It then has to attach the memory stacks, have them work, and do all of that at the volume Nvidia alone orders. Amkor's plant in Peoria, Arizona shows the timing: production starts in early 2028, so the wait is two to five years.

Why: "the steps" and "exotic" made plain; the long newcomer sentence split; "the live test" and "puts the wait at" said plainly.

**chinaStatus**

Before: China is far stronger at packaging and testing chips than at making them. JCET alone took in RMB 35.96 billion in 2024, and Chinese tool makers gained share in packaging and test tools while gaining none in atomic layer deposition or lithography. Almost none of that packaging is the kind, built on a silicon interposer, that AI accelerators need.

After: China is far stronger at packaging and testing chips than at making them. JCET alone had revenue of RMB 35.96 billion in 2024. Chinese tool makers gained share in packaging and test tools while gaining none in atomic layer deposition or lithography. Almost none of that Chinese packaging is built on a silicon interposer, the kind AI accelerators need.

Why: "took in" said plainly; the JCET sentence split; the last sentence reordered so the kind is named once.

**usStatus**

Before: Nobody does CoWoS-class packaging in volume in the United States yet. Amkor is building a $7B packaging and test plant in Peoria, Arizona, with up to $407M of CHIPS Act money, and production starts in early 2028.

After: No firm yet does CoWoS-class packaging in volume in the United States. Amkor is building a $7B packaging and test plant in Peoria, Arizona, with up to $407M of CHIPS Act money, and production starts in early 2028.

Why: "Nobody" is a person; the actor is a firm.

## 12-substrates-and-pcbs: Substrates and PCBs (Hard to substitute, Extreme concentration)

**substitutability.test**

Before: Rated on the insulating film inside the substrate: Ajinomoto supplies about 95 percent of it by its own count, and every maker would have to re-approve a replacement layer by layer.

After: Rated on the insulating film inside the substrate: Ajinomoto supplies about 95 percent of it by its own count, and every substrate maker would have to re-approve a replacement layer by layer.

Why: "every maker" made explicit.

**substitutability.why**

Before: A handful of firms build substrates, money can expand their plants, and every large one is expanding. The single points of failure sit one layer down. Ajinomoto makes the thin insulating film between the substrate's wiring layers, puts its own share at about 95 percent, and has been the standard since 1999; under it sits Nitto Boseki's glass cloth, woven so it barely swells with heat. A newcomer can build a line to make such a film, but then every substrate maker and every packaging house has to test the new film in each layer of each product before trusting it, which takes years at each of them and puts the whole switch at five to ten years.

After: A few firms build substrates. Money can expand their plants, and every large one is expanding. The single points of failure are in the materials inside the substrate. Ajinomoto makes the thin insulating film between the substrate's wiring layers, puts its own share at about 95 percent, and has been the standard since 1999. Beneath that film is Nitto Boseki's glass cloth, woven so it barely swells with heat. A newcomer can build a line to make such a film. Every substrate maker and every packaging house then has to test the new film in each layer of each product before using it. That takes years at each of them, so the whole switch takes five to ten years.

Why: "A handful" said plainly and the three-idea sentence split; "sit one layer down" is figurative; the semicolon sentence split; the newcomer sentence carried three ideas and is split; "trusting" is "using".

**chinaStatus**

Before: Most of the firms competing in circuit boards are Chinese or Taiwanese, and Nitto Boseki itself calls them aggressive fast followers in special glass. China still has almost no position in the high-end insulating film.

After: Most of the firms competing in circuit boards are Chinese or Taiwanese. Nitto Boseki itself calls them aggressive fast followers in special glass. Chinese firms still make almost none of the high-end insulating film.

Why: First sentence split; "has almost no position" said plainly.

**usStatus**

Before: No American firm makes these substrates at scale. TTM Technologies is the main American circuit board maker; data center computing was 24 percent of its sales in 2025, up from 14 percent in 2023. Intel is pushing substrates made of glass for the second half of the decade.

After: No American firm makes these substrates in volume. TTM Technologies is the main American circuit board maker. Data center computing was 24 percent of its sales in 2025, up from 14 percent in 2023. Intel is developing substrates made of glass for the second half of the decade.

Why: "at scale" is a fad phrase; the semicolon sentence split; "pushing" said plainly.

## 13-test-and-assembly: Test and Assembly (Moderate to substitute, High concentration)

**substitutability.test**

Before: No tool here has only one maker, but switching testers means rebuilding the customer's whole test setup.

After: No test or assembly tool has only one maker, but switching testers means rebuilding every one of the customer's test programs.

Why: "here" and "test setup" made explicit.

**substitutability.why**

Before: Advantest and Teradyne sell about 80 percent of the testers between them, but both make approved machines, and the smaller kinds of tool have several makers each. Customers stay put because a new tester means rebuilding every test program, from the first prototype through to the production line, and Advantest tells its investors exactly that. A newcomer pays that cost once and is through it in two to five years. The low barrier shows: four of the top ten assembly and test firms are already Chinese.

After: Advantest and Teradyne sell about 80 percent of the testers between them, but both make machines that customers have approved, and the smaller kinds of test and assembly tool have several makers each. Customers rarely switch, because a new tester means rebuilding every test program, from the first prototype through to the production line. Advantest tells its investors the same thing. A newcomer pays that cost once and takes two to five years. The barrier is low enough that four of the top ten assembly and test firms are already Chinese.

Why: "approved" says by whom; "the smaller kinds of tool" scoped; "stay put", "is through it", "The low barrier shows" are idioms; the Advantest clause split off.

**chinaStatus**

Before: Assembly and test is where China is most competitive. CSET at Georgetown counts four of the top ten assembly and test firms by 2024 revenue as Chinese, and the tools they use are far less tightly controlled than lithography or deposition tools.

After: Assembly and test is the stage where China is most competitive. CSET at Georgetown counts four of the top ten assembly and test firms by 2024 revenue as Chinese. The tools those firms use are far less tightly controlled than lithography or deposition tools.

Why: "where" scoped to the stage; the second sentence split and "they" made explicit.

**usStatus**

Before: Strong in test machines and probe cards, the beds of pins that touch each chip on the wafer, through Teradyne, FormFactor, Cohu and Aehr; weak in assembly. Amkor is building a $7 billion packaging and test campus in Arizona and has a long-term deal with TSMC to fill it.

After: American firms are strong in test machines and probe cards, the beds of pins that touch each chip on the wafer: Teradyne, FormFactor, Cohu and Aehr. They are weak in assembly. Amkor is building a $7 billion packaging and test campus in Arizona and has a long-term deal with TSMC to fill it.

Why: The first sentence lacked a subject and carried two ideas.

**costSignal**

Before: ASE and Amkor alone billed $27.3 billion in 2025; ASE spent $4.1 billion on machinery and buildings in the first half of 2026

After: ASE and Amkor alone had $27.3 billion of revenue in 2025; ASE spent $4.1 billion on machinery and buildings in the first half of 2026

Why: "billed" said plainly.

## 14-systems-and-networking: Systems and Networking (Moderate to substitute, High concentration)

**substitutability.test**

Before: Rated on the two tightest parts: Nvidia alone sells NVLink, the link that joins the accelerators in a rack, and few firms make the lasers.

After: Rated on the two most concentrated parts: Nvidia alone sells NVLink, the link that joins the accelerators in a rack, and few firms make the lasers for the optical links.

Why: "tightest" said plainly; which lasers made explicit.

**substitutability.why**

Before: Putting racks together is easy to replace: if Foxconn stopped, Quanta and Wistron would pick up the volume within a couple of quarters. The tight parts sit inside the rack, and both have fixes under way. UALink is a published rival to NVLink, running 200 Gb/s per lane and joining up to 1,024 accelerators. For the lasers, Nvidia put $2 billion each into Coherent and Lumentum to lock in supply that an ordinary order could not, which is what any newcomer with money would have to do too, over two to five years.

After: Rack assembly is easy to replace: if Foxconn stopped, Quanta and Wistron would take over the volume within a few quarters. The two concentrated parts are inside the rack, and a fix is under way for each. UALink is a published rival to NVLink, running 200 Gb/s per lane and joining up to 1,024 accelerators. For the lasers, Nvidia put $2 billion each into Coherent and Lumentum to secure supply that an ordinary order could not. Any newcomer with money would have to do the same, over two to five years.

Why: "Putting racks together", "pick up", "tight parts", "lock in" said plainly; the last sentence split.

**chinaStatus**

Before: China holds the two ends of the optical link that the United States does not: Chinese firms assemble the high-speed optical modules in volume, mostly in plants in Thailand and Suzhou, and China produces about 70 percent of the world's indium, the raw material for the lasers inside them.

After: China holds two parts of the optical link that the United States does not. Chinese firms assemble the high-speed optical modules in volume, mostly in plants in Thailand and Suzhou. China also produces about 70 percent of the world's indium, the raw material for the lasers inside those modules.

Why: "the two ends" is figurative; one sentence carried three ideas; "them" made explicit.

**usStatus**

Before: American firms own the switch chips, the links that join accelerators inside a rack, and the plants that make the lasers, but almost none of the rack assembly. Nvidia's partners began building racks in Houston and Dallas in 2025, and in July 2026 the Federal Communications Commission moved against imported gear containing parts from firms on its Covered List.

After: American firms make the switch chips, the links that join accelerators inside a rack, and the lasers, but do almost none of the rack assembly. Nvidia's partners began building racks in Houston and Dallas in 2025. In July 2026 the Federal Communications Commission barred new approvals for imported equipment containing parts from firms on its Covered List.

Why: "own" the chips and "the plants that make" said as "make"; the second sentence split; "moved against" replaced with what the order does, as the chapter body states it.

## 15-data-centers-and-power: Data Centers and Power (Moderate to substitute, High concentration)

**substitutability.test**

Before: Several approved vendors sell every part, but a transformer takes three years to arrive and GE Vernova's turbines are booked about six years out.

After: Several approved vendors sell every piece of power and cooling equipment, but a transformer takes three years to arrive and GE Vernova's gas turbines have orders for about six years ahead.

Why: "every part" made explicit; "booked about six years out" said plainly; which turbines.

**substitutability.why**

Before: Nothing here has to be invented. Nine firms sell the power and cooling equipment for Nvidia's gigawatt data center designs, so a buyer can get the gear and haggle over the price. Money cannot skip the line. A large power transformer now takes 36 months to arrive, against under a year before 2020, and GE Vernova has close to six years of gas turbine orders on its books, so new capacity is two to five years away.

After: Nothing in a data center's power and cooling has to be invented. Nine firms sell the power and cooling equipment for Nvidia's gigawatt data center designs, so a buyer can get the equipment and negotiate the price. Money cannot shorten the wait. A large power transformer now takes 36 months to arrive, against under a year before 2020. GE Vernova has close to six years of gas turbine orders waiting. New capacity is therefore two to five years away.

Why: "here" made explicit; "gear", "haggle", "skip the line", "on its books" said plainly; the last sentence carried three ideas and is split.

**chinaStatus**

Before: China has spare generating capacity, a large home industry making transformers and switchgear, and can connect new sites quickly. Its AI buildout is limited by the supply of accelerators, with megawatts to spare.

After: China has spare generating capacity, a large domestic industry making transformers and switchgear, and can connect new sites quickly. Its AI buildout is limited by the supply of accelerators, and it has power to spare.

Why: "home industry" is "domestic industry"; "with megawatts to spare" said plainly.

**usStatus**

Before: The United States has the demand and the money but cannot skip the equipment queues. Transformers and turbines both take years to arrive, most large power transformers are imported, and no restarted nuclear reactor is running yet.

After: The United States has the demand and the money but cannot shorten the wait for equipment. Transformers and turbines both take years to arrive. Most large power transformers are imported, and no restarted nuclear reactor is running yet.

Why: "skip the equipment queues" said plainly; the three-idea sentence split.

## Wider fields: oneLiner, bridge, leaders[].share and keyFacts[].fact, chapters 01 to 17

### 01-design-and-eda

**oneLiner**

Before: The cheapest stage in the chain to fund and one of the most concentrated. Three software firms sell the tools that every leading-edge AI accelerator passes through.

After: The cheapest stage in the chain to fund and one of the most concentrated. Three software firms sell the tools used to design every leading-edge AI accelerator.

Why: "passes through" is figurative.

**keyFacts[2].fact**

Before: A photomask set costs over $1M at 28 nm, over $10M at 7 nm and about $40M at 3 nm; startups have built leading-edge 7 nm chips end to end for $50-75M

After: A photomask set costs over $1M at 28 nm, over $10M at 7 nm and about $40M at 3 nm; startups have designed and made leading-edge 7 nm chips for $50-75M

Why: "end to end" is an idiom.

**keyFacts[5].fact**

Before: Broadcom booked $16.7B of AI semiconductor revenue in Q3 FY2026, up 221% year on year

After: Broadcom reported $16.7B of AI semiconductor revenue in Q3 FY2026, up 221% year on year

Why: "booked" is accounting shorthand.

**keyFacts[10].fact**

Before: India is home to nearly 20% of the world's chip design engineers

After: Nearly 20% of the world's chip design engineers work in India

Why: "is home to" is figurative.

### 02-silicon-and-wafers

**oneLiner**

Before: China makes almost all of the world's polysilicon and almost none of the wafers that matter. Five firms in Japan, Taiwan, Germany and South Korea hold the 300 mm wafer every AI accelerator starts on.

After: China makes almost all of the world's polysilicon and almost none of the 300 mm wafers. Five firms in Japan, Taiwan, Germany and South Korea make the 300 mm wafer every AI accelerator starts on.

Why: "the wafers that matter" left the reader to guess which; "hold" is "make".

**leaders[3].share**

Before: One of the five firms behind the whole wafer market

After: One of the five firms that supply the whole wafer market

Why: "behind" is figurative.

**keyFacts[1].fact**

Before: Five major suppliers stand behind the entire $11.4bn semiconductor silicon wafer market

After: Five major suppliers supply the entire $11.4bn semiconductor silicon wafer market

Why: "stand behind" is figurative.

**keyFacts[6].fact**

Before: Siltronic booked a €77.9m net loss in 2025 on €1,346.7m of sales, with capex of €369.1m concentrated on its Singapore fab

After: Siltronic reported a €77.9m net loss in 2025 on €1,346.7m of sales, with capital spending of €369.1m concentrated on its Singapore fab

Why: "booked" and "capex" said plainly.

### 03-chemicals-gases-and-photoresist

**oneLiner**

Before: A few hundred molecules stand between a blank wafer and a working chip. Japan makes about four-fifths of the photoresist, and the two times this layer has been squeezed, no fab stopped, because the countries hit stockpiled and built substitutes instead.

After: A few hundred chemicals separate a blank wafer from a working chip. Japan makes about four-fifths of the photoresist. Twice the supply of these materials has been restricted, and no fab stopped, because the countries affected stockpiled and developed substitutes instead.

Why: "stand between", "this layer has been squeezed" and "the countries hit" are figurative; the second sentence carried two ideas.

**leaders[4].share**

Before: About 65% of sputtering targets, the metal slugs that supply chip wiring

After: About 65% of sputtering targets, the metal plates that chip wiring is made from

Why: "slugs" is jargon; "supply" said plainly.

### 04-lithography

**leaders[1].share**

Before: 22 new chipmaking scanners in the year to March 2026, in a market Nikon sizes at 570 units

After: 22 new chipmaking scanners in the year to March 2026, in a market Nikon estimates at 570 units

Why: "sizes at" said plainly.

### 05-photomasks-and-pellicles

**oneLiner**

Before: A business worth tens of billions of yen sits under every leading-edge chip. Two Japanese firms make almost all the blank plates that EUV masks are built on, one Japanese firm inspects them, and the dust cover meant to protect them is still not in production.

After: Every leading-edge chip depends on a business worth tens of billions of yen. Two Japanese firms make almost all the blank plates that EUV masks are built on, one Japanese firm inspects them, and the dust cover meant to protect them is still not in production.

Why: "sits under" is figurative.

**leaders[1].share**

Before: Says its share of mask blanks is exceptionally high, and expects to keep its lead as customers add second sources

After: Says its share of mask blanks is exceptionally high, and expects to keep its lead as customers add a second supplier

Why: "second sources" is industry shorthand.

**leaders[3].share**

Before: Intel calls it the established industry leader in multi-beam mask writers, the machines that cut the pattern

After: Intel calls it the established industry leader in multi-beam mask writers, the machines that draw the pattern onto the mask

Why: A writer draws; "cut" was the wrong verb and the object was missing.

**keyFacts[1].fact**

Before: Hoya says it holds an exceptionally high share of the mask blank market and expects customers to move gradually toward multi-sourcing EUV blanks

After: Hoya says it holds an exceptionally high share of the mask blank market and expects customers to move gradually to buying EUV blanks from more than one supplier

Why: "multi-sourcing" said plainly.

**keyFacts[5].fact**

Before: ASML's EUV pellicle is a membrane 13 nm thick that must survive 500C in vacuum, and every photon it absorbs costs customer productivity

After: ASML's EUV pellicle is a membrane 13 nm thick that must survive 500C in vacuum, and every photon it absorbs costs the customer output

Why: "productivity" said plainly.

**keyFacts[8].fact**

Before: Mask sets cost beyond $1M at 28 nm, beyond $10M at 7 nm and approach $40M at 3 nm (2022 estimate)

After: Mask sets cost over $1M at 28 nm, over $10M at 7 nm and about $40M at 3 nm (2022 estimate)

Why: "beyond" and "approach" said plainly, matching chapter 01.

**keyFacts[11].fact**

Before: Photronics, the largest merchant mask maker, had $849.3 million of revenue in fiscal 2025, of which $615.1 million was IC masks

After: Photronics, the largest mask maker selling to outside customers, had $849.3 million of revenue in fiscal 2025, of which $615.1 million was IC masks

Why: "merchant" is industry shorthand; the card already says it plainly.

### 06-deposition-and-etch

**oneLiner**

Before: Lithography prints the pattern; deposition and etch do the rest, over a thousand steps per wafer, and it is the one tool segment where China has taken real share.

After: Lithography prints the pattern; deposition and etch do the rest, over a thousand steps per wafer, and it is the one kind of chipmaking tool where Chinese makers have gained real share.

Why: "tool segment" and "China has taken" made explicit.

**keyFacts[1].fact**

Before: Global semiconductor equipment billings reached $135.1B in 2025, up 15% from $117.1B in 2024, with wafer processing equipment up 12% (SEMI)

After: Global sales of chipmaking equipment reached $135.1B in 2025, up 15% from $117.1B in 2024, with wafer processing equipment up 12% (SEMI)

Why: "billings" said plainly, as the card already does.

### 07-metrology-and-inspection

**oneLiner**

Before: Nobody builds a fab around process control, and no fab works without it. One American firm holds about 57% of the market, roughly seven times its nearest rival, and is still pulling away.

After: No fab is planned around measuring and inspecting wafers, and no fab works without it. One American firm holds about 57% of the market for those tools, roughly seven times its nearest rival, and its share is still growing.

Why: "process control" and "the market" made explicit; "pulling away" is an idiom.

**bridge**

Before: Every one of those films can land wrong, and wrong is invisible until something goes looking for it.

After: Every one of those films can be laid down wrong, and the fault is invisible until a tool looks for it.

Why: "land wrong" and "something goes looking" are figurative.

**keyFacts[1].fact**

Before: KLA took the number one position in advanced wafer-level packaging process control in calendar 2025, adding 14 percentage points of share and growing that revenue about 70%

After: KLA became the largest supplier of process control tools for advanced wafer-level packaging in calendar 2025, adding 14 percentage points of share and growing that revenue about 70%

Why: "took the number one position" said plainly.

**keyFacts[2].fact**

Before: KLA's process control share has grown 360 basis points since 2021 and is about 7x the nearest competitor

After: KLA's process control share has grown 3.6 percentage points since 2021 and is about 7x the nearest competitor

Why: "basis points" is finance shorthand.

### 08-transistors-and-front-end

**oneLiner**

Before: Three companies can build a 2 nm-class switch. Shrinking stopped paying for itself about a decade ago, and every gain since has been bought with extra process steps.

After: Three companies can build a 2 nm-class transistor. Shrinking stopped lowering the cost per transistor about a decade ago, and every gain since has come from extra process steps.

Why: "switch" made explicit; "paying for itself" and "bought with" are figurative.

**keyFacts[8].fact**

Before: China has announced $43 billion for domestic EUV development; CSIS judges working EUV systems still out of reach

After: China has announced $43 billion for domestic EUV development; CSIS judges that China cannot yet build a working EUV system

Why: "out of reach" is an idiom.

### 09-foundries-and-fabs

**leaders[2].share**

Before: Hwaseong and Pyeongtaek; a minimum $17bn build-out at Taylor, Texas

After: Hwaseong and Pyeongtaek; at least $17bn of construction at Taylor, Texas

Why: "a minimum build-out" said plainly.

### 10-memory-and-hbm

**oneLiner**

Before: Three firms make every HBM stack in the world. The cube is the largest block of silicon in an AI package, and the cooling plate above it now caps its height.

After: Three firms make every HBM stack in the world. The stack is the largest block of silicon in an AI package, and the cooling plate above it now limits how tall it can be.

Why: "The cube" switched terms mid-sentence; "caps" is figurative.

**keyFacts[1].fact**

Before: A single HBM cube's data interface is 1,024 bits wide, which Micron counts as 32 independent channels (the JEDEC standard calls them 16 channels of two pseudo-channels each), 16 times wider than a standard DDR5 module

After: A single HBM stack's data path is 1,024 bits wide, which Micron counts as 32 independent channels (the JEDEC standard calls them 16 channels of two pseudo-channels each), 16 times wider than a standard DDR5 module's

Why: "cube" is "stack" everywhere else; "data interface" is "data path", as the card says; the comparison needed its possessive.

### 11-advanced-packaging

**oneLiner**

Before: Lithography stopped being the limit on chip size in 2022. The limit now is how large an interposer TSMC can build, and through 2025 how many it could build a month.

After: Lithography stopped being the limit on chip size in 2022. The limit now is how large an interposer, the silicon base plate under the chips, TSMC can build, and through 2025 how many it could build a month.

Why: The interposer named in the sentence that uses it.

**leaders[0].share**

Before: Effectively all CoWoS for leading AI accelerators

After: Almost all CoWoS for leading AI accelerators

Why: "Effectively all" said plainly.

**leaders[2].share**

Before: $6.71B net sales, 2025; the largest American one

After: $6.71B net sales, 2025; the largest American assembly and test firm

Why: "one" made explicit.

**leaders[3].share**

Before: RMB 35.96B revenue, 2024; the largest Chinese one

After: RMB 35.96B revenue, 2024; the largest Chinese assembly and test firm

Why: "one" made explicit.

**keyFacts[5].fact**

Before: A 14-reticle CoWoS carrying about 10 large compute dies and 20 HBM stacks is slated for production in 2028, with more than 14 reticles in 2029 and a 40-reticle System-on-Wafer the same year

After: A 14-reticle CoWoS carrying about 10 large compute dies and 20 HBM stacks is planned for production in 2028, with more than 14 reticles in 2029 and a 40-reticle System-on-Wafer the same year

Why: "slated" said plainly.

**keyFacts[6].fact**

Before: ASE Technology Holding billed NT$645.4 billion in 2025 with assembly and test revenue up 23%; Amkor billed $6.71 billion, up 6%

After: ASE Technology Holding had revenue of NT$645.4 billion in 2025 with assembly and test revenue up 23%; Amkor had revenue of $6.71 billion, up 6%

Why: "billed" said plainly.

**keyFacts[7].fact**

Before: JCET, China's largest OSAT, billed RMB 35.96 billion in 2024, up 21.2%

After: JCET, China's largest outsourced assembly and test firm, had revenue of RMB 35.96 billion in 2024, up 21.2%

Why: "OSAT" spelled out; "billed" said plainly.

**keyFacts[9].fact**

Before: Amkor broke ground in Peoria, Arizona in October 2025 on a $7B two-phase packaging and test campus, with up to $407M of CHIPS funding and production from early 2028

After: Amkor started building a $7B two-phase packaging and test campus in Peoria, Arizona in October 2025, with up to $407M of CHIPS funding and production from early 2028

Why: "broke ground" is an idiom.

**keyFacts[11].fact**

Before: Epoch AI estimates Nvidia consumed 60.3% of the world's CoWoS packaging capacity in 2025, with a 90% confidence interval of 56.5 to 64.3, and that Nvidia, Google, AMD and Amazon together took around 90% of it while using only about 12% of advanced logic die production

After: Epoch AI estimates Nvidia used 60.3% of the world's CoWoS packaging capacity in 2025, with a 90% confidence interval of 56.5 to 64.3, and that Nvidia, Google, AMD and Amazon together used around 90% of it while using only about 12% of advanced logic die production

Why: "consumed" and "took" are "used".

### 12-substrates-and-pcbs

**leaders[2].share**

Before: Says it takes close to 100% of each new generation of interposer substrates at launch

After: Says it wins close to 100% of each new generation of interposer substrates at launch

Why: "takes" said plainly.

**keyFacts[10].fact**

Before: TTM Technologies took $2.91 billion of revenue in fiscal 2025 and regularly builds boards of more than 30 layers, up to over 70

After: TTM Technologies had $2.91 billion of revenue in fiscal 2025 and regularly builds boards of more than 30 layers, up to over 70

Why: "took" said plainly.

### 13-test-and-assembly

**keyFacts[5].fact**

Before: Aehr received a $22 million follow-on order for AI processor wafer-level burn-in systems in August 2026

After: Aehr received a further $22 million order for AI processor wafer-level burn-in systems in August 2026

Why: "follow-on" said plainly.

### 14-systems-and-networking

**oneLiner**

Before: A finished package is useless until it is bolted to a baseboard, fed a thousand amps and wired to seventy-one siblings. Many firms can do the bolting; few can make the lasers.

After: A finished package is useless until it is bolted to a baseboard, fed a thousand amps and wired to seventy-one other packages. Many firms can do the assembly; few can make the lasers for the optical links.

Why: "siblings" is figurative; "the bolting" and "the lasers" made explicit.

**leaders[1].share**

Before: Switch chips sold to all comers (Tomahawk, Jericho) and most custom AI accelerators

After: Switch chips sold to any buyer (Tomahawk, Jericho) and most custom AI accelerators

Why: "all comers" is an idiom.

**keyFacts[5].fact**

Before: China accounted for about 70% of world indium production, the feedstock for indium phosphide lasers

After: China accounted for about 70% of world indium production, the raw material for indium phosphide lasers

Why: "feedstock" said plainly, as the card does.

### 15-data-centers-and-power

**oneLiner**

Before: The chips are no longer what a buildout waits for. A large transformer takes three years, turbine output does not reach 30 GW a year until 2030, and Texas has fifty times more large load queued than it has approved to switch on.

After: The chips are no longer the slowest part of a data center buildout. A large transformer takes three years, turbine output does not reach 30 GW a year until 2030, and Texas has fifty times more large loads, mostly data centers, waiting to connect than it has approved to switch on.

Why: "what a buildout waits for" and "queued" said plainly; "large load" is a grid term and now says what it mostly is.

### 16-component-costs

**oneLiner**

Before: Inside an AI accelerator the silicon is the cheap part. Memory and packaging are the bill.

After: Inside an AI accelerator the silicon is the cheap part. Memory and packaging are most of the cost.

Why: "are the bill" is an idiom; HBM ($2,900) and packaging ($1,100) are $4,000 of the $6,400 B200 build cost in the chapter body.

**bridge**

Before: The physical chain ends at a powered rack, and the next question is which part of it holds the money.

After: The physical chain ends at a powered rack, and the next question is which part of it costs the most.

Why: "holds the money" is figurative.

**keyFacts[6].fact**

Before: A 100,000 H100 cluster needs about 150 MW and burns 1.59 TWh per year

After: A 100,000 H100 cluster needs about 150 MW and uses 1.59 TWh per year

Why: "burns" is figurative.

### 17-geopolitics

**oneLiner**

Before: Every stage in this chain sits in someone's jurisdiction. Since 2018 the United States has been converting that fact into policy, and China has been building an answer.

After: Every stage in this chain sits in someone's jurisdiction. Since 2018 the United States has been converting that fact into policy, and China has been building substitutes.

Why: "building an answer" is figurative.

**bridge**

Before: What is left is who can stop a chip getting built, and that answer is written into law.

After: The last question is who can stop a chip getting built, and the answer is written into law.

Why: "What is left" is a cleft; said plainly.
