# Discussion questions: notes (slug `discussion`, 20 October 2026)

## What this covers

- `data/discussion.json` (new file): 51 questions, three for each of the 17 chapters, keyed by each chapter's front matter `id` in chapter order, in the SCHEMA §4 format (indent 2, one trailing newline).
- This file: for each question, its form, the section(s) it draws on, the figures and dates it uses, and the chapter text it rests on. Each quote is verbatim, with the section (or front matter field) where it sits. A search of the chapter file for the quote finds it. Line numbers are not given, because other round-two agents are adding card source fields to the chapters' front matter while this work is done, and every body line moves when they do.
- No other file was edited. No source was opened or added, so there are no new bibliography entries.

Each question asks students to reason with the chapter's facts: a cause, a trade-off, a counterfactual or a comparison. None has a single right answer, and none repeats a flashcard in `data/flashcards.json`. Where a question presents a government action, it asks how the mechanism works or looks at it from more than one side. Across the set, questions take the view of Chinese, Japanese, Korean, Taiwanese, Dutch, European, Malaysian and American firms or governments, and none presumes one country's goals.

## Checks run

1. `python3 -m json.tool data/discussion.json > /dev/null`: valid.
2. A scratch checker, kept outside the repo (`check_discussion.py` in the session scratchpad), run on the draft and then on the written file. It was re-run against the chapter files as they stood at the end of the session, after the other agents' edits described below. Results for all 51 questions:
   - Length: 22 to 34 words (mean 31.6), all within the limit of 35.
   - Exactly one question mark in each, at the end.
   - None of these: em or en dash, semicolon, colon, "you", "we", "our", "us", "X, not Y", "not X but Y", "rather than", "not only", "this site" or "the chapter", a percent sign, "U.S.", British spellings, vague time words ("now", "today", "recently", "currently"), or the inflated and filler words listed in `qa/scripts/style-report.js`.
   - Every quote below was found verbatim in its chapter file.
   - Every number in each question appears in that question's quotes.
   - The written file equals `json.dumps(…, indent=2)` plus one newline, and its key order matches the chapter files.
3. A reread of every question against `.claude/skills/writing-well/SKILL.md` and `qa/round2/RULES.md`. That pass removed a doubled "how", named Huawei as the owner of the Ascend 910B, attributed two KLA shares to CSET's count, used the chapter body's own wording for the Malaysia and ERCOT figures, and shortened six questions.

## Chapter edits by other agents during this work

- Chapters 1 to 8 gained card source fields in their front matter while this work was in progress. The other agents also changed a few body sentences. The full check was re-run afterward, and every quote still matches its chapter.
- Chapter 3: the PFAS paragraph gained two sentences on photoresist qualification after the sentences quoted below. The question is unaffected.
- Chapter 7: the card's substitutability text was rewritten. It no longer says that a fab that loses KLA "keeps running" but "finds fewer flaws and fixes them more slowly". Question 1, which had paraphrased that text, now rests on the body's chokepoint sentence instead. The old and new versions:
  - Before: "A fab that loses KLA keeps running, but it finds fewer flaws and fixes them more slowly. How does a control that slows a fab compare with one that blocks a step outright?"
  - After: "A fab that cannot buy sensitive inspection tools finds fewer defects, so its yield rises more slowly. How does a control that slows a fab compare with one that blocks a step outright?"
- Chapters 9 to 17 may change the same way after this file is written. Before anyone publishes the questions, re-run a quote search, or the scratch checker, against the final chapters.

## No repeated question across the book

Each line names the idea a question tests and the one place it is asked:

- A short-lived control and buyer hedging: ch 1 Q1.
- What a catch-up effort depends on in other stages: ch 1 Q2 (a chip designer) and ch 8 Q1 (two foundry entrants compared).
- Fixed design cost, merchant chip against custom chip: ch 1 Q3.
- Concentration without profit: ch 2 Q1. Margins across stages: ch 16 Q1.
- A subsidy against an import price floor: ch 2 Q2.
- Where a supplier is based, as a selling point: ch 2 Q3. Where a firm is listed against where it makes things: ch 14 Q2.
- Comparing three supply disruptions: ch 3 Q1.
- Supply that is a byproduct of other industries: ch 3 Q2.
- Environmental rules as a supply risk: ch 3 Q3.
- When to adopt a new tool: ch 4 Q1.
- A chokepoint behind a chokepoint (a supplier's suppliers): ch 4 Q2.
- Extraterritorial rules and an ally's own controls: ch 4 Q3.
- A technology change and the incumbents: ch 5 Q1.
- Making in house against buying: ch 5 Q2.
- Adding a second source: ch 5 Q3.
- Entry barriers by tool type: ch 6 Q1.
- Third-country firms' fabs under controls: ch 6 Q2.
- Rules that depend on where a chip was made: ch 6 Q3.
- A control that slows against one that blocks: ch 7 Q1.
- What each side loses when controls tighten: ch 7 Q2.
- How to measure a stage's concentration: ch 7 Q3.
- Controlling know-how: ch 8 Q2.
- Chiplets and the leading edge: ch 8 Q3.
- Conflicting evidence and enforcement: ch 9 Q1.
- Risks firms can plan for against risks they cannot: ch 9 Q2.
- Mature-node capacity as influence: ch 9 Q3.
- Writing a control as a technical threshold: ch 10 Q1.
- Fast share swings among three makers: ch 10 Q2.
- Spillover to buyers outside AI: ch 10 Q3.
- Concentrated buyers bargaining with one supplier: ch 11 Q1.
- Package size against the risk of scrapping it: ch 11 Q2.
- A leader welcoming a rival's technology: ch 11 Q3.
- When to add capacity: ch 12 Q1.
- How chokepoints form: ch 12 Q2.
- Rising exposure to one supplier: ch 12 Q3.
- Switching costs against fast share gains: ch 13 Q1.
- Testing earlier: ch 13 Q2.
- Moving from conventional to advanced work: ch 13 Q3.
- Open against proprietary standards: ch 14 Q1.
- A buyer investing in scarce suppliers: ch 14 Q3.
- Announced against connected demand: ch 15 Q1.
- Speed against cost in getting power: ch 15 Q2.
- Efficiency against total use: ch 15 Q3.
- Choosing a cost measure: ch 16 Q2.
- Which costs fall with scale: ch 16 Q3.
- Applying the export-control test to every segment: ch 17 Q1.
- Whether controls sped up China's own toolmakers: ch 17 Q2.
- Taiwan's rule and the silicon shield debate: ch 17 Q3.

## Questions that build on a flashcard fact

These ask for judgment the card does not give:

- ch 1 Q2: the "How far behind" card gives the gap. The question asks which causes Huawei can fix itself.
- ch 3 Q1: the photoresist card describes the 2019 episode. The question compares all three disruptions.
- ch 6 Q1: the ALD card gives the 2025 share. The question asks why Chinese makers gained no ALD share from 2019 to 2024.
- ch 8 Q1: two cards give Rapidus's IBM base and SMIC's method. The question compares the two paths and asks where each could fall short.
- ch 9 Q3: a card says little of China's capacity is advanced. The question asks what influence that capacity could still give.
- ch 10 Q1: a card states the HBM threshold. The question asks why a control is written as a threshold.
- ch 13 Q2: a card says why chips are tested early. The question asks what testing earlier costs as well as saves.
- ch 14 Q1 and Q2: cards name NVSwitch and indium phosphide. The questions ask about dependence on one firm and what the AXT case shows.
- ch 17 Q1 and Q2: cards state the export-control condition and China's toolmaker share. The questions apply the condition to the table and ask whether the share would have risen without controls.

## For whoever renders these on the site

- `qa/scripts/check-speak.js` counts any sentence that ends in "?" as a rhetorical question unless it is exempted. Flashcard questions get that exemption through `<p class="fc-q">`. Discussion questions need the same treatment if the build renders them. If the file is added to the script's `DATA_JSON` list, its key `questions` would also need to be allowed.
- Two chapters' questions refer to things on their own page. ch 17 Q1 refers to "the chokepoints table" (section "Chokepoints and who holds them"). ch 16 Q3 uses the class names in that chapter's cost table ("Structurally expensive", "Compressible with scale"). Render the questions on the chapter page so those references resolve.
- Quotes from the front matter are marked with their field: `oneLiner` (shown under the chapter title), `plain`, `keyFacts`, or a card field.

## New bibliography entries

None.

## Per-question evidence

### design-and-eda (`content/01-design-and-eda.md`)

1. "A US license requirement on design-software sales to China lasted only from late May to 2 July 2025. How might it still change where Chinese chip designers buy their tools?"
   - Form: consequence. 30 words.
   - Sections: opening paragraph; The chokepoint; Takeaways.
   - Figures and dates: late May to 2 July 2025.
   - Rests on:
     - (Takeaways) "The US government required a license to sell design software to anyone in China from late May to 2 July 2025"
     - (The chokepoint) "Synopsys's China revenue fell from 16 percent of its total in fiscal 2024 to 12 percent in fiscal 2025"
     - (The chokepoint) "companies Synopsys cannot sell to look for alternatives, typically local design-software and licensed-block companies"

2. "Epoch AI puts Huawei's chips three to four years behind Nvidia's until at least 2030, for three reasons. Which could Huawei close on its own, and which depend on other stages?"
   - Form: comparison across stages. 31 words.
   - Sections: The chokepoint.
   - Figures and dates: three to four years; until at least 2030.
   - Rests on:
     - (The chokepoint) "Epoch puts Huawei's chips three to four years behind Nvidia's until at least 2030, for three reasons"
     - (The chokepoint) "SMIC cannot pack transistors as densely as TSMC, which makes Nvidia's."
     - (The chokepoint) "Chinese memory makers are only starting to produce high-bandwidth memory."
     - (The chokepoint) "Huawei's software for programming its chips is far less mature than Nvidia's"

3. "CSIS put the cost of developing a leading-edge 2 nm chip at about $725 million in September 2026. When is a custom ASIC worth that to one company, compared with buying a merchant GPU?"
   - Form: trade-off. 34 words.
   - Sections: How it works; Variants and trade-offs > Merchant GPU versus custom ASIC.
   - Figures and dates: 2 nm; about $725 million; September 2026.
   - Rests on:
     - (How it works) "CSIS put the cost of developing a leading-edge 2 nm chip at about $725 million in September 2026"
     - (Variants and trade-offs > Merchant GPU versus custom ASIC) "Nvidia designs its Blackwell GPU once and sells it to everyone, so the buyer gets mature software and a resale market."
     - (Variants and trade-offs > Merchant GPU versus custom ASIC) "A custom accelerator, an ASIC, is built for one company's own workload."

### silicon-and-wafers (`content/02-silicon-and-wafers.md`)

1. "SUMCO and Siltronic both lost money in 2025, though the top five wafer makers served around 75 percent of the market. What could explain losses in so concentrated a market?"
   - Form: cause. 30 words.
   - Sections: How it works; Who makes it.
   - Figures and dates: 2025; around 75 percent.
   - Rests on:
     - (How it works; same sentence as front matter `plain`) "In 2025 the top five wafer makers served around 75 percent of the world market"
     - (Who makes it) "The wafer makers' 2025 results show strong AI demand and a slump in demand for chips made on older, mature nodes."
     - (Who makes it) "Sold ¥409.7 billion and still lost ¥11.8 billion"
     - (Who makes it) "Lost €77.9 million on €1,346.7 million of sales"

2. "GlobalWafers won CHIPS awards of up to $406 million, and from December 4, 2026, a $100 per kilogram minimum import price covers polysilicon ingots and wafers. Who pays for each, and who gains?"
   - Form: comparison of two policy tools. 33 words.
   - Sections: Who makes it; the chokepoint card.
   - Figures and dates: up to $406 million; $100 per kilogram; from December 4, 2026.
   - Rests on:
     - (card `usStatus`) "GlobalWafers of Taiwan won CHIPS awards of up to $406 million"
     - (Who makes it) "The US government had awarded it up to $406 million under the CHIPS incentives program for wafer plants in Texas and Missouri"
     - (Who makes it) "sets a minimum import price of $100 per kilogram for polysilicon ingots and wafers from December 4, 2026"

3. "Siltronic describes itself as the only Western-based maker among the top five wafer makers. Why might a supplier stress where it is based, and which buyers would care?"
   - Form: motive and audience. 28 words.
   - Sections: Who makes it.
   - Figures and dates: none. The chapter bases the ranking on revenue in the first three quarters of 2025.
   - Rests on:
     - (Who makes it) "Siltronic of Germany describes itself as the only Western-based maker among the top five wafer makers"

### chemicals-gases-and-photoresist (`content/03-chemicals-gases-and-photoresist.md`)

1. "Supply of chip chemicals, gases and metals has been disrupted three times since 2019, twice by governments and once by a war. Which disruption did buyers handle best, and why?"
   - Form: comparison of three cases. 30 words.
   - Sections: oneLiner; The chokepoint (the 2019 Japan licenses, neon after the 2022 invasion, China's metal controls).
   - Figures and dates: three times since 2019.
   - Rests on:
     - (front matter `oneLiner`) "Supply of chip chemicals, gases and metals has been disrupted three times since 2019."
     - (The chokepoint) "Supply at this stage has been disrupted three times since 2019, twice by governments and once by a war."

2. "Gallium is recovered mostly as a byproduct of processing bauxite, and germanium comes from certain zinc ores and coal deposits. What does that mean for how quickly other countries could replace Chinese supply?"
   - Form: counterfactual. 33 words.
   - Sections: The chokepoint.
   - Figures and dates: none.
   - Rests on:
     - (The chokepoint) "Gallium is recovered mostly as a byproduct of processing bauxite"
     - (The chokepoint) "Germanium comes from certain zinc ores and coal deposits, so supply of both depends on another industry's economics"
     - (The chokepoint; why "Chinese supply") "put China's share of world production of primary low-purity gallium at 99 percent"

3. "PFAS chemicals are used throughout a fab. In March 2026 ECHA's scientific committees backed an EU-wide restriction with targeted exemptions. Which fab uses would make the strongest case for an exemption, and why?"
   - Form: trade-off. 33 words.
   - Sections: The chokepoint.
   - Figures and dates: March 2026. The question leaves out "two" before "scientific committees".
   - Rests on:
     - (The chokepoint) "These chemicals are used throughout a fab."
     - (The chokepoint) "The photoacid generators that free the acid in resist are fluorinated, and so are etch gases, chamber liners, pump seals and filter membranes."
     - (The chokepoint) "In March 2026 ECHA's two scientific committees backed an EU-wide restriction with targeted derogations, or exemptions"

### lithography (`content/04-lithography.md`)

1. "Intel says it uses High-NA in volume for select layers of some 18A products, while TSMC says it will use High-NA in high-volume manufacturing from 2030. What does each gain and risk?"
   - Form: trade-off between two firms. 32 words.
   - Sections: Variants and trade-offs > High-NA EUV.
   - Figures and dates: from 2030. "18A" is a process name.
   - Rests on:
     - (Variants and trade-offs > High-NA EUV) "says it uses High-NA in volume production for select layers of some Intel 18A products"
     - (Variants and trade-offs > High-NA EUV) "in September 2026 said it will use High-NA in high-volume manufacturing from 2030"
     - (Variants and trade-offs > High-NA EUV; context for the trade-off) "a High-NA machine at an estimated $350 to $400 million"
     - (Variants and trade-offs > High-NA EUV; context) "halving the patch of wafer one exposure covers and doubling the exposures per wafer"

2. "ASML's 2025 annual report lists 5,100 suppliers, and Zeiss is its sole supplier of optics. Does the EUV chokepoint sit with ASML itself, or with the few suppliers behind it?"
   - Form: comparison (where the chokepoint sits). 30 words.
   - Sections: Who makes it; The chokepoint.
   - Figures and dates: 2025 annual report; 5,100 suppliers.
   - Rests on:
     - (Who makes it) "Its 2025 annual report lists 5,100 suppliers"
     - (Who makes it) "Four of them make the main parts of the EUV machine"
     - (Who makes it) "ASML says the production capacity of Zeiss, its sole supplier of optics, limits how many lithography systems it can build"

3. "A 25 October 2023 US rule reached certain immersion scanners with any American content, unless the country they were first exported from already controlled them. What does that exemption offer each government?"
   - Form: mechanism, seen from both governments. 32 words.
   - Sections: Controls and China's answer.
   - Figures and dates: 25 October 2023.
   - Rests on:
     - (Controls and China's answer) "published on 25 October 2023 put certain immersion scanners bound for advanced chipmaking under US export rules if they held any American content at all"
     - (Controls and China's answer) "The rule did not apply if the country the scanners were first exported from already controlled them"
     - (Controls and China's answer; context) "Dutch national licensing** of advanced DUV took effect on 1 September 2023"

### photomasks-and-pellicles (`content/05-photomasks-and-pellicles.md`)

1. "In September 2026 ASML and TSMC announced plans for 12-inch masks in advanced chip production by 2033. Would the switch weaken the leading makers of blanks, writers and inspection tools, or strengthen them?"
   - Form: counterfactual. 33 words.
   - Sections: How it works; Takeaways.
   - Figures and dates: September 2026; 12-inch; by 2033.
   - Rests on:
     - (How it works) "On 8 September 2026 ASML and TSMC announced a plan to move from the current 6-inch masks to 12-inch masks"
     - (How it works) "High-NA scanners using 12-inch masks can enter advanced chip production by 2033"

2. "Photronics says mask production has tended to move toward independent firms, yet SMIC runs two in-house mask shops in Shanghai. What does a chipmaker gain and give up by making its own masks?"
   - Form: trade-off (make or buy). 33 words.
   - Sections: Who makes it.
   - Figures and dates: none.
   - Rests on:
     - (Who makes it) "production has more recently tended to move toward the independents"
     - (Who makes it) "SMIC, a Chinese foundry, runs two in-house mask shops in Shanghai"

3. "Hoya says its mask blank share is exceptionally high but that customers may gradually start buying EUV blanks from more than one supplier. What could drive that shift, and what slows it?"
   - Form: cause. 32 words.
   - Sections: Variants and trade-offs > Blanks.
   - Figures and dates: none.
   - Rests on:
     - (Variants and trade-offs > Blanks) "Hoya says its share of the mask blank market is exceptionally high, and that customers may gradually start buying EUV blanks from more than one supplier"
     - (Variants and trade-offs > Blanks; context) "AGC says it spent more than a decade meeting the blank's requirements"

### deposition-and-etch (`content/06-deposition-and-etch.md`)

1. "Between 2019 and 2024 China-based suppliers went from 2 to 7 percent of deposition but gained no share in atomic layer deposition. What could explain the difference?"
   - Form: cause. 27 words.
   - Sections: China and the controls.
   - Figures and dates: 2019 to 2024; 2 to 7 percent.
   - Rests on:
     - (China and the controls) "Between 2019 and 2024 China-based suppliers went from 2 to 7 percent of deposition"
     - (China and the controls) "In ALD they gained no share and held less than 1 percent in 2024"

2. "Since 31 December 2025, US tools bound for the Chinese units of Samsung and SK hynix have needed a license. How might that change what those firms build in China and elsewhere?"
   - Form: consequence for third-country firms. 32 words.
   - Sections: China and the controls.
   - Figures and dates: 31 December 2025.
   - Rests on:
     - (China and the controls) "BIS removed the Chinese units of Samsung and SK hynix, and Intel Semiconductor (Dalian), from the Validated End-User program, effective 31 December 2025"
     - (China and the controls) "From that date, US tools bound for them need a license"

3. "A part-finished chip can cross international borders 70 or more times, by a 2020 estimate. What does that mean for tariffs or controls that depend on where a chip was made?"
   - Form: mechanism. 31 words.
   - Sections: How it works.
   - Figures and dates: 70 or more times; 2020 estimate (Accenture and the Global Semiconductor Alliance, repeated by SIA in 2025).
   - Rests on:
     - (How it works) "estimated in 2020 that a part-finished chip can cross international borders 70 or more times"

### metrology-and-inspection (`content/07-metrology-and-inspection.md`)

1. "A fab that cannot buy sensitive inspection tools finds fewer defects, so its yield rises more slowly. How does a control that slows a fab compare with one that blocks a step outright?"
   - Form: comparison (slowing against blocking). 33 words.
   - Sections: The chokepoint; How it works.
   - Figures and dates: none.
   - Rests on:
     - (The chokepoint) "A fab that can buy scanners and etchers but not sensitive inspection tools finds fewer of the defects that lower its yield, so its yield rises more slowly."
     - (The chokepoint) "Every kind of process control tool also had a second maker that year, by CSET's count"
     - (How it works; the same sentence is in front matter `plain`) "cut off from KLA would find fewer of the faults that make its chips fail"

2. "Chinese makers held 0.7 percent of the 2025 market by CSET's count, yet China took 26 percent of KLA's revenue in the June 2026 quarter. What would each side lose if inspection controls tightened?"
   - Form: consequence for both sides. 34 words.
   - Sections: Packaging, AI and China; Who makes it; Takeaways.
   - Figures and dates: 0.7 percent (2025, CSET's count); 26 percent (June 2026 quarter).
   - Rests on:
     - (Takeaways) "Yet China took 26 percent of KLA's revenue in the June 2026 quarter"
     - (Packaging, AI and China) "puts all Chinese firms at 0.7 percent of the market in 2025"

3. "On CSET's 2025 count, KLA held 56.8 percent of process control tools, but Hitachi led line-width measurement with 71.9 percent. How should a stage's concentration be judged when it varies so much by tool?"
   - Form: method. 34 words.
   - Sections: opening paragraphs; Variants and trade-offs.
   - Figures and dates: 2025; 56.8 percent; 71.9 percent.
   - Rests on:
     - (opening paragraph) "CSET's count for 2025, built on TechInsights data, puts KLA at 56.8 percent"
     - (Variants and trade-offs) "also called line-width measurement"
     - (Variants and trade-offs) "Hitachi held 71.9 percent of this $1.2 billion market"
     - (Variants and trade-offs) "All the market sizes and shares below are CSET's, for 2025"

### transistors-and-front-end (`content/08-transistors-and-front-end.md`)

1. "Rapidus builds on IBM's 2 nm technology, while SMIC makes 7 nm-class chips without EUV. What does each path to advanced logic depend on, and where is each most likely to fall short?"
   - Form: comparison of two entrants. 33 words.
   - Sections: Who makes it; Takeaways.
   - Figures and dates: 2 nm; 7 nm-class.
   - Rests on:
     - (Who makes it) "Its process builds on IBM's 2 nm technology"
     - (Takeaways) "China's SMIC makes 7 nm-class chips without extreme-ultraviolet (EUV) lithography"

2. "In September 2024 the United States put a worldwide license requirement on the know-how for building gate-all-around transistors. What can a control on know-how do that one on machines cannot?"
   - Form: mechanism. 30 words.
   - Sections: The chokepoint.
   - Figures and dates: September 2024.
   - Rests on:
     - (The chokepoint) "In September 2024 the United States put a worldwide license requirement on the know-how for building gate-all-around transistors"

3. "AI accelerators have usually trailed the leading edge, because a large die yields well only on a mature process. How might spreading compute across eight dies, as AMD's MI455X does, change that?"
   - Form: cause. 32 words.
   - Sections: Who makes it.
   - Figures and dates: eight dies. "MI455X" is a product name.
   - Rests on:
     - (Who makes it) "AI accelerators have usually trailed the leading edge."
     - (Who makes it) "gets high enough only once a process has run long enough to cut its defect rate"
     - (Who makes it) "AMD's MI455X, launched on 23 July 2026, lists TSMC 2 nm and 3 nm silicon"
     - (Who makes it) "It spreads its compute across eight separate dies"

### foundries-and-fabs (`content/09-foundries-and-fabs.md`)

1. "In June 2024 CSET said Huawei's Ascend 910B was believed to be made at SMIC. In April 2025 SemiAnalysis judged most were made at TSMC. What would each finding imply for export controls?"
   - Form: weighing conflicting evidence. 33 words.
   - Sections: Variants and trade-offs > National champions.
   - Figures and dates: June 2024; April 2025. "910B" is a product name, and N+2 is SMIC's process.
   - Rests on:
     - (Variants and trade-offs > National champions) "reported in June 2024 that Huawei's Ascend 910B AI chip is believed to be made on N+2"
     - (Variants and trade-offs > National champions) "judged in April 2025 that most 910B and 910C chips were made on TSMC's 7 nm process, from wafers Huawei bought through another company"

2. "Chip production in Taiwan faces seismic, power and political risks. Which can firms plan against, and which lie beyond any firm's control?"
   - Form: comparison of risks. 22 words.
   - Sections: The chokepoint.
   - Figures and dates: none.
   - Rests on:
     - (The chokepoint) "Chip production in Taiwan faces three risks:"
     - (The chokepoint; the three bullets) "**Seismic.**"
     - (The chokepoint; the three bullets) "**Power.**"
     - (The chokepoint; the three bullets) "**Political.**"

3. "In June 2024 SEMI forecast that China would have the most installed fab capacity of any region in 2025, though little of it is advanced. What influence, if any, could that capacity give China?"
   - Form: counterfactual. 34 words.
   - Sections: The chokepoint; Variants and trade-offs > Mature-node capacity.
   - Figures and dates: June 2024 forecast; 2025.
   - Rests on:
     - (The chokepoint) "SEMI forecast in June 2024 that China would have installed capacity of 10.1 million wafers a month in 2025, the most of any region"
     - (The chokepoint) "Little of China's capacity is advanced"
     - (Variants and trade-offs > Mature-node capacity; context) "These make power devices, analog chips and microcontrollers, and they compete on price."

### memory-and-hbm (`content/10-memory-and-hbm.md`)

1. "In December 2024 BIS controlled HBM above 2 GB per second per square millimeter, a line every stack then in production crossed. Why define a control by a technical measure instead of naming products?"
   - Form: mechanism (rule design). 34 words.
   - Sections: The chokepoint; Takeaways.
   - Figures and dates: December 2024; 2 GB per second per square millimeter.
   - Rests on:
     - (The chokepoint) "On 5 December 2024 the Bureau of Industry and Security (BIS)"
     - (The chokepoint) "greater than 2 gigabytes per second per square millimeter"
     - (The chokepoint) "BIS stated in the rule that all HBM stacks then in production exceeded that threshold"
     - (Takeaways) "any HBM moving more than 2 GB per second per square millimeter of its area"

2. "Samsung's HBM revenue share fell from 37.8 percent in 2024 to 20.5 percent in the first quarter of 2026, as Micron's rose from 5.8 to 23.1 percent. What could move shares that fast?"
   - Form: cause. 33 words.
   - Sections: Who makes it; Takeaways.
   - Figures and dates: Samsung 37.8 percent (2024) to 20.5 percent (first quarter of 2026); Micron 5.8 percent to 23.1 percent over the same span.
   - Rests on:
     - (Who makes it) "In 2024 the same three stood at 56.4, 37.8 and 5.8 percent"
     - (Who makes it) "In the first quarter of 2026 they stood at 56.4, 20.5 and 23.1 percent"
     - (Takeaways) "US-based Micron went from 5.8 percent of HBM revenue in 2024 to 23.1 percent in the first quarter of 2026"
     - (Takeaways) "Samsung's share fell from 37.8 percent to 20.5 percent"

3. "SK hynix says the shift of capacity to HBM left traditional DRAM undersupplied, helping drive a price recovery from the third quarter of 2025. Which buyers outside AI feel that shift, and how?"
   - Form: consequence beyond AI. 33 words.
   - Sections: Who makes it.
   - Figures and dates: from the third quarter of 2025.
   - Rests on:
     - (Who makes it) "the industry's shift of production capacity to HBM has left traditional DRAM undersupplied"
     - (Who makes it) "helped drive a significant price recovery for that DRAM from the third quarter of 2025"
     - (Who makes it) "traditional DRAM, the kind used in PCs and phones"

### advanced-packaging (`content/11-advanced-packaging.md`)

1. "Epoch AI estimates four chip designers used around 90 percent of CoWoS capacity in 2025 but only 12 percent of advanced logic die production. How might that shape their bargaining with TSMC?"
   - Form: consequence (bargaining). 32 words.
   - Sections: Capacity.
   - Figures and dates: around 90 percent; 12 percent; 2025.
   - Rests on:
     - (Capacity) "It puts Nvidia at 60.3 percent of all CoWoS capacity in 2025"
     - (Capacity) "Together those four used around 90 percent of global CoWoS capacity and HBM supply"
     - (Capacity) "but only 12 percent of advanced logic die production"

2. "TSMC plans a 14-reticle interposer carrying about ten large compute dies and 20 HBM stacks in 2028. What would make a package that large worth the risk that one cracked joint scraps it?"
   - Form: trade-off. 33 words.
   - Sections: The chokepoint (roadmap); How it works.
   - Figures and dates: 14-reticle; about ten compute dies; 20 HBM stacks; 2028.
   - Rests on:
     - (The chokepoint) "**2028.** A 14-reticle interposer of roughly 12,000 mm2, about the area of a compact disc, carrying about ten large compute dies and 20 HBM stacks"
     - (How it works) "But one cracked joint scraps a package holding eight tested HBM stacks and two large, expensive logic dies."

3. "Asked about Intel's EMIB-T in July 2026, TSMC's chief executive said he hoped it would take some of the load off TSMC. Why might TSMC welcome a rival's packaging technology?"
   - Form: cause (motive). 30 words.
   - Sections: Capacity; Takeaways.
   - Figures and dates: July 2026.
   - Rests on:
     - (Capacity) "On the July 2026 earnings call, Wei said TSMC's packaging capacity was so tight that it limited customers' growth"
     - (Capacity) "Asked about Intel's EMIB-T, he said he welcomed the extra flexibility and hoped it would take some of the load off TSMC"

### substrates-and-pcbs (`content/12-substrates-and-pcbs.md`)

1. "Nitto Boseki says demand seems to have risen about two to three times since it set its fiscal 2024 to 2027 plan. What does it risk by expanding too early or too late?"
   - Form: trade-off (timing). 33 words.
   - Sections: The materials underneath; Takeaways.
   - Figures and dates: about two to three times; fiscal 2024 to 2027.
   - Rests on:
     - (The materials underneath) "says market demand seems to have risen about two to three times since that plan was set"
     - (The materials underneath) "It planned about JPY 80 billion of capital spending for fiscal 2024 to 2027"

2. "Ajinomoto, a Japanese food company, told investors in June 2026 that its film has held over 95 percent of its market since launch. What does its case suggest about how chokepoints form?"
   - Form: cause, generalized. 32 words.
   - Sections: oneLiner; Variants and trade-offs > ABF build-up substrates.
   - Figures and dates: June 2026; over 95 percent. "A Japanese food company" appears only in the `oneLiner`, which shows under the chapter title.
   - Rests on:
     - (front matter `oneLiner`) "Ajinomoto, a Japanese food company, told investors in June 2026"
     - (Variants and trade-offs > ABF build-up substrates) "In June 2026 Ajinomoto told investors that the film has held a share of over 95 percent since its launch"
     - (Variants and trade-offs > ABF build-up substrates) "Ajinomoto first developed it in 1999 and says major chipmakers have used it as the de facto standard ever since"

3. "Ajinomoto counts 22 layers of its film in a 2026 AI package substrate, against six when PCs first adopted it in 1999. How does that change the stakes of relying on one supplier?"
   - Form: consequence. 33 words.
   - Sections: How it works; Takeaways.
   - Figures and dates: 22 layers (2026); six layers (1999).
   - Rests on:
     - (How it works) "Ajinomoto counts 22 layers of its film in a 2026 AI package substrate about 100 mm square"
     - (How it works) "PC substrates had six layers of the film when PCs first adopted it in 1999"

### test-and-assembly (`content/13-test-and-assembly.md`)

1. "Advantest argues tester share moves slowly because switching means rebuilding a customer's whole test setup. Yet its system-on-chip tester share rose about ten points in 2025, to 66 percent. What could explain both?"
   - Form: reconciling a claim with data. 33 words.
   - Sections: Who makes it; The chokepoint.
   - Figures and dates: about ten points; 66 percent; 2025. The chapter says "rose about ten points in a year to 66 percent", in its paragraph on 2025.
   - Rests on:
     - (The chokepoint) "Advantest argues that switching to another tester maker means rebuilding the whole test setup used for development, evaluation and production, so market share moves slowly"
     - (Who makes it) "rose about ten points in a year to 66 percent"
     - (Who makes it) "Advantest puts its own share at about 65 percent of an estimated $9.0 billion tester market in 2025"

2. "Aehr's lead AI customer is shifting burn-in for its accelerators from the finished system to the wafer. What does testing earlier save, and what does it cost?"
   - Form: trade-off. 27 words.
   - Sections: How it works.
   - Figures and dates: none.
   - Rests on:
     - (How it works) "Aehr's lead AI customer is shifting burn-in for its AI accelerators from the finished system to the wafer"

3. "Malaysia said in July 2026 that it ships 13 percent of the world's packaged chips and wants 7 percent of advanced packaging shipments by 2035. What makes advanced packaging a different business?"
   - Form: comparison of two businesses. 32 words.
   - Sections: The back end's geography; the chokepoint card (countries).
   - Figures and dates: July 2026; 13 percent; 7 percent by 2035.
   - Rests on:
     - (card country note) "Malaysia said in July 2026 that it ships 13% of the world's packaged chips"
     - (The back end's geography) "Malaysia's investment agency said in July 2026 that the country ships 13 percent of the world's packaged chips and wants 7 percent of advanced packaging shipments by 2035"

### systems-and-networking (`content/14-systems-and-networking.md`)

1. "Since May 2025 NVLink Fusion has let other firms' custom chips use NVLink, while UALink is an open standard for the same job. Which leaves buyers less dependent on one firm, and why?"
   - Form: comparison (open against proprietary). 33 words.
   - Sections: The chokepoint; the chokepoint card (substitutability).
   - Figures and dates: since May 2025.
   - Rests on:
     - (The chokepoint) "Since May 2025 Nvidia's NVLink Fusion program has let other firms' custom chips use NVLink"
     - (The chokepoint) "UALink is an open standard designed for accelerator communications within one scale-up group"
     - (card `substitutability.why`) "UALink is an open specification for the same job as NVLink"

2. "AXT, a US-listed maker of indium phosphide wafers, makes them all in China, which put them on its export control list on 4 February 2025. What does that show about supply risk?"
   - Form: mechanism (listing against location). 32 words.
   - Sections: The chokepoint; Takeaways.
   - Figures and dates: 4 February 2025.
   - Rests on:
     - (The chokepoint) "China added indium phosphide substrates, the wafers the lasers are grown on, to its export control list on 4 February 2025"
     - (The chokepoint) "AXT, a US-listed maker of these wafers, does all its manufacturing in China"
     - (The chokepoint) "it could not estimate when it would resume shipping the wafers to the United States"

3. "In March 2026 Nvidia agreed to invest $2 billion each in Coherent and Lumentum, alongside purchase commitments and rights to future capacity. Why might each side want such a deal?"
   - Form: motives on both sides. 30 words.
   - Sections: Who makes it; The chokepoint.
   - Figures and dates: March 2026; $2 billion in each firm. "Each" joins two stated deals, and the Component Costs chapter writes it the same way.
   - Rests on:
     - (Who makes it) "In March 2026 Nvidia agreed to invest $2 billion in one of them, Lumentum, alongside a multibillion-dollar purchase commitment and future capacity access rights"
     - (The chokepoint) "In March 2026 Nvidia agreed to invest $2 billion in Coherent, alongside a multibillion-dollar purchase commitment and future access and capacity rights"

### data-centers-and-power (`content/15-data-centers-and-power.md`)

1. "ERCOT was tracking about 474 GW of large loads seeking a connection in June 2026, roughly 90 percent of it data centers. Why might requests run so far ahead of what gets connected?"
   - Form: cause. 33 words.
   - Sections: The chokepoint.
   - Figures and dates: about 474 GW; June 2026; roughly 90 percent.
   - Rests on:
     - (The chokepoint) "Far more capacity has been announced than is connected and running."
     - (The chokepoint) "was tracking about 474 GW of large loads (big power users) seeking a connection in June 2026, roughly 90 percent of it data centers"
     - (The chokepoint) "counted 9,042 MW approved to energize, but judging by peak monthly use, ERCOT believed only 3,883 MW of it was operating"

2. "At least three of OpenAI's seven Stargate sites will use gas generation on site to avoid grid queues. What does that path trade for speed, and what could still slow it?"
   - Form: trade-off. 31 words.
   - Sections: Variants and trade-offs > Where the electrons come from; Who makes it; The chokepoint.
   - Figures and dates: at least three of seven sites.
   - Rests on:
     - (Variants and trade-offs > Where the electrons come from) "generation on the site itself. The fast path, which at least three of OpenAI's seven Stargate sites will use to avoid grid queues"
     - (Who makes it; context for "what could still slow it") "GE Vernova's gas equipment backlog and reserved factory slots grew from 100 GW to 116 GW in the second quarter of 2026"
     - (The chokepoint; context) "GE Vernova expects its annual gas turbine output to reach 20 GW in the third quarter of 2026"

3. "Google's Ironwood TPU delivers twice the performance per watt of Trillium, the TPU before it. When would more efficient chips cut total data center electricity use, and when would they raise it?"
   - Form: counterfactual. 32 words.
   - Sections: Capacity and demand.
   - Figures and dates: twice the performance per watt.
   - Rests on:
     - (Capacity and demand) "Google's Ironwood TPU, an AI chip, delivers twice the performance per watt of Trillium, the TPU before it"
     - (Capacity and demand) "Energy per token can fall while total energy use still rises, if the number of tokens rises faster."

### component-costs (`content/16-component-costs.md`)

1. "In quarters ending in 2026, design, equipment and leading-edge wafers earned gross margins of 50.3 to 75.0 percent, and assembly and test 16.8 to 27.3 percent. What explains the gap, and could it close?"
   - Form: cause and counterfactual. 34 words.
   - Sections: Who captures the value; Where the money goes.
   - Figures and dates: 50.3 to 75.0 percent; 16.8 to 27.3 percent; table quarters ending June to September 2026.
   - Rests on:
     - (Who captures the value) "In the table, design, equipment and leading-edge wafers earn gross margins of 50.3 to 75.0 percent, substrates 36.4 percent, and assembly and test 16.8 to 27.3 percent."
     - (Who captures the value; margin table, earliest quarter end) "| Amkor | OSAT | June 2026 | 16.8% |"
     - (Who captures the value; margin table, latest quarter end) "| Micron | HBM and DRAM | September 2026 | 86.8% |"

2. "SemiAnalysis puts a Vera Rubin NVL72 at $3.57 per GPU-hour, against $1.84 for a GB200, yet finds Rubin cheaper per token. Which measure matters more to a buyer, and when?"
   - Form: comparison of two measures. 30 words.
   - Sections: Variants and trade-offs > From package to rack to cluster.
   - Figures and dates: $3.57 and $1.84 per GPU-hour. The chapter gives no year. "NVL72" and "GB200" are product names.
   - Rests on:
     - (Variants and trade-offs > From package to rack to cluster) "SemiAnalysis puts a Vera Rubin NVL72 at $3.57 per GPU-hour, against $1.84 for a GB200"
     - (Variants and trade-offs > From package to rack to cluster) "But SemiAnalysis finds Rubin cheaper per token than GB200 and GB300 at every interactivity level it compared"
     - (Variants and trade-offs > From package to rack to cluster; the caveat a discussion should raise) "SemiAnalysis has not verified them"

3. "Which stage classed as structurally expensive, such as HBM or CoWoS-L packaging, is most likely to become compressible with scale, and what would it take?"
   - Form: counterfactual. 25 words.
   - Sections: Where the money goes (the cost-class table).
   - Figures and dates: none.
   - Rests on:
     - (Where the money goes) "| HBM | Structurally expensive |"
     - (Where the money goes) "| Advanced packaging, CoWoS-L | Structurally expensive |"
     - (Where the money goes; a row in the other class) "| Compressible with scale |"
     - (Where the money goes) "The classes are a judgment drawn from the sources in this chapter and the stage chapters."

### geopolitics (`content/17-geopolitics.md`)

1. "An export control works only when a country's own firms sell something the buyer cannot get elsewhere. Which segments in the chokepoints table pass that test, and which might fail it by 2030?"
   - Form: synthesis across the table. 33 words.
   - Sections: The shape of the contest; Chokepoints and who holds them; Who gains and who pays.
   - Figures and dates: by 2030, a horizon the chapter itself uses.
   - Rests on:
     - (The shape of the contest; the same sentence is in front matter `plain`) "it works only when their own firms sell something the buyer cannot get elsewhere"
     - (heading of the section that holds the table) "## Chokepoints and who holds them"
     - (Who gains and who pays) "out of Taiwan and Korea before 2030"

2. "Chinese toolmakers held 10 to 15 percent of their home market before 2022 and 35 percent in 2025. How much of that rise would have come without export controls, and how could anyone tell?"
   - Form: counterfactual. 34 words.
   - Sections: China's response; Takeaways.
   - Figures and dates: 10 to 15 percent before 2022; 35 percent in 2025. The chapter's middle figure, 25 percent in 2024, is left out.
   - Rests on:
     - (China's response) "Chinese toolmakers held 10 to 15 percent of their home market before 2022, 25 percent in 2024 and 35 percent in 2025"

3. "Taiwan's rules keep TSMC's newest process at home first, so its Arizona fabs have run a generation behind. Which side of the silicon shield debate does that rule support, and why?"
   - Form: weighing two arguments. 31 words.
   - Sections: Taiwan.
   - Figures and dates: none.
   - Rests on:
     - (Taiwan) "Taiwan's rules keep TSMC's newest process at home first, so TSMC's Arizona fabs have run a generation behind its fabs in Taiwan"
     - (Taiwan) "The silicon shield argument holds that this concentration deters an invasion"
     - (Taiwan) "The counterargument is that staying irreplaceable gives Taiwan's government reason to slow the US push to spread chipmaking beyond Taiwan."
