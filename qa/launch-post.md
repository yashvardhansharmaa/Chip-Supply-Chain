# Substack launch post, draft 2

Title: **How AI chips are made, and who holds each step**
Subtitle: I spent the summer turning the best work on the chip supply chain into one free site. Here is what it shows.

Alternative titles: "The fifteen stages of an AI chip" · "Export control is now written to four significant figures"

---

In January 2026 Washington set the ceiling for legal AI chip sales to China at 21,000 points of total processing performance. AMD's MI325X measures 20,919. Export control is now written to four significant figures, and the arithmetic has to be done chip by chip.

That rule sits at one stage out of fifteen. An AI accelerator passes through all fifteen before it reaches a rack: design software, silicon wafers, chemicals, lithography, photomasks, deposition and etch, metrology, the transistor itself, the fab, memory, packaging, substrates, test, the server, the data center. Eight of the fifteen sit with a handful of firms, spread across five countries. One Dutch company built every extreme-ultraviolet lithography machine in the world; it booked 48 of them in 2025, four of them the newer High-NA kind, and a standard tool costs around $200 million.

I work on compute governance, and for two years I have wanted one place that lays this out end to end, with the numbers attached to the documents they came from. The work exists. CSET mapped the chain. SIA and SEMI count it. The firms file it. Every rule sits in the Federal Register. But it is scattered across a hundred PDFs, and most of it was written for people who already knew the vocabulary.

So I built the place: [Chip Supply Chain](https://yashvardhansharmaa.github.io/chokepoints/).

## What is on it

**The Chain.** Seventeen chapters, one per stage plus what a rack costs and the geopolitics. Each opens with a plain-language paragraph, then a card: how concentrated the stage is, how hard it would be for a well-funded state or firm to stand up an alternative, who leads it, and where China and the United States stand. Every number links to its source. A 3D model of the object in question sits beside the text, from a wafer to an EUV mask to a gate-all-around transistor.

**Export Controls.** A board of the ten things that cross the chokepoint between the West and China, from advanced chips to critical minerals, with the license outcome each stands in today: no license needed, case by case, presumption of denial, or prohibited. Every state carries its effective date and its Federal Register citation, and a scrubber winds the board back to any date since 2018. Beneath it, each firm's China revenue from its own filings. Nvidia's China sales nearly tripled between fiscal 2022 and fiscal 2026, from $7.1 billion to $19.7 billion, while falling from 26.4 percent of its revenue to 9.1 percent. That is what a control that redirects demand rather than destroying it looks like.

**Suppliers.** The 220 firms that make up the chain, drawn as ribbons from eight countries into twenty stages, then ranked by stage, thinnest first. Japan holds 78 percent of photoresist. South Korea holds 82.5 percent of high-bandwidth memory. The Netherlands holds all of EUV.

**AI Chips.** Thirty-five accelerators, from the A100 to the parts shipping in 2026, with the foundry, node, memory supplier and packaging plant behind each, the number formats each one supports, and its processing performance against the rule.

**The Index.** Every term, firm and chip on the site, with what it is and every passage that mentions it. Type "FDPR" or "Applied Materials" and you get the entry and the places the site uses it.

## How it was made

The site admits only company filings, governments and regulators, standards bodies, universities, and a short list of research institutions, plus four outlets: SemiAnalysis, Reuters, the Financial Times and Nikkei Asia. Where a Tier A document relays a private firm's estimate, the row says so. The country-share table records the basis of every figure: measured, derived, estimated, or relayed. The data files are downloadable.

I built it with Claude as research partner, drafter and critic, under those rules. Then I ran the site through reviewers playing an export-control lawyer, a semiconductor economist, a China specialist, a policy adviser and two compute-governance researchers, and rebuilt what they broke. The test I set for the policy adviser was whether a staffer could write a memo on where the controls stand from the site alone, with a citation behind every line. The board, the CSV it exports with its as-of date, the revenue chart and the countermeasures got that memo written in forty minutes.

Two things are mine rather than any source's. The concentration band on each card is my judgment from supplier counts. The substitutability rating is my judgment against four written tests. Both are labeled as such, and the tests are on the page.

## What I want from you

Tell me where it is wrong. A share that is stale, a firm that is misfiled, a rule I have misread, a stage you would have rated differently. Every chapter ends with its source list, every footnote opens the document, and I will fix what you find and say so.

If you teach, brief, or write on any of this, use it. It is free, it has no ads, and it will stay that way.

[Chip Supply Chain](https://yashvardhansharmaa.github.io/chokepoints/)

---

Draft 2 changes, from the compute governance review: the opener is now the 21,000 TPP ceiling and the MI325X at 20,919 (AI Chips page, MI325X export status; TPP = 8 × 2,614.9 FP8 TFLOPS); the Nvidia figure is stated in dollars and share together (exposure rows FY2022 $7,111m of $26,914m, FY2026 $19,677m of $215,938m); "48 shipped at $200 million each" became "booked 48, four High-NA, a standard tool around $200 million" (Lithography chapter); "most of them in one country" became "spread across five countries" (the eight Extreme cards name five countries). Word count about 820.
