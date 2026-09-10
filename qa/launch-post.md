# Substack launch post, draft 1

Title: **How AI chips are made, and who holds each step**
Subtitle: I spent the summer turning the best work on the chip supply chain into one free site. Here is what it shows.

Alternative titles: "The fifteen stages of an AI chip" · "Where the AI chip supply chain can be squeezed"

---

One Dutch company built every extreme-ultraviolet lithography machine sold in 2025. It shipped 48 of them, at around $200 million each. Without those machines nothing at the leading edge gets printed, in Taiwan or anywhere else.

That is one stage out of fifteen. An AI accelerator passes through all fifteen before it reaches a rack: design software, silicon wafers, chemicals, lithography, photomasks, deposition and etch, metrology, the transistor itself, the fab, memory, packaging, substrates, test, the server, the data centre. Eight of the fifteen sit with a handful of firms, most of them in one country.

I work on compute governance, and for two years I have wanted one place that lays this out end to end, with the numbers attached to the documents they came from. The work exists. CSET mapped the chain. SIA and SEMI count it. The firms file it. Every rule sits in the Federal Register. But it is scattered across a hundred PDFs, and most of it was written for people who already knew the vocabulary.

So I built the place: [Compute Chokepoints](https://yashvardhansharmaa.github.io/chokepoints/).

## What is on it

**The Chain.** Seventeen chapters, one per stage plus what a rack costs and the geopolitics. Each opens with a plain-language paragraph, then a card: how concentrated the stage is, how hard it would be for a well-funded state or firm to stand up an alternative, who leads it, and where China and the United States stand. Every number links to its source. A 3D model of the object in question sits beside the text, from a wafer to an EUV mask to a gate-all-around transistor.

**Export Controls.** A board of the ten things that cross the chokepoint between the West and China, from advanced chips to critical minerals, with the licence outcome each stands in today: no licence needed, case by case, presumption of denial, or prohibited. Every state carries its effective date and its Federal Register citation, and a scrubber winds the board back to any date since 2018. Beneath it, each firm's China revenue from its own filings. Nvidia's went from 26.4 percent of sales in fiscal 2022 to 9.1 percent in fiscal 2026.

**Suppliers.** The 220 firms that make up the chain, drawn as ribbons from eight countries into twenty stages, then ranked by stage, thinnest first. Japan holds 78 percent of photoresist. South Korea holds 82.5 percent of high-bandwidth memory. The Netherlands holds all of EUV.

**AI Chips.** Thirty-five accelerators, from the A100 to the parts shipping in 2026, with the foundry, node, memory supplier and packaging plant behind each, and the number formats each one supports.

**The Index.** Every term, firm and chip on the site, with what it is and every passage that mentions it. Type "FDPR" or "Applied Materials" and you get the entry and the eight places the site uses it.

## How it was made

The site admits only company filings, governments and regulators, standards bodies, universities, and a short list of research institutions, plus four outlets: SemiAnalysis, Reuters, the Financial Times and Nikkei Asia. Where a Tier A document relays a private firm's estimate, the row says so. The country-share table records the basis of every figure: measured, derived, estimated, or relayed. The data files are downloadable.

I built it with Claude as research partner, drafter and critic, under those rules. Then I ran the site through reviewers playing an export-control lawyer, a semiconductor economist, a China specialist, a policy adviser and a compute-governance researcher, and rebuilt what they broke. The test I set for the policy adviser was whether a staffer could write a memo on where the controls stand from the site alone, with a citation behind every line. The board, the CSV it exports with its as-of date, the revenue chart and the countermeasures got that memo written in forty minutes.

Two things are mine rather than any source's. The concentration band on each card is my judgment from supplier counts. The substitutability rating is my judgment against four written tests. Both are labelled as such, and the tests are on the page.

## What I want from you

Tell me where it is wrong. A share that is stale, a firm that is misfiled, a rule I have misread, a stage you would have rated differently. Every chapter ends with its source list, every footnote opens the document, and I will fix what you find and say so.

If you teach, brief, or write on any of this, use it. It is free, it has no ads, and it will stay that way.

[Compute Chokepoints](https://yashvardhansharmaa.github.io/chokepoints/)

---

Word count: about 780. Figures used and where they live on the site: 48 EUV systems at about $200 million (Lithography chapter); fifteen stages, eight Extreme (the chain strip and the cards); ten flows, four outcomes, since 2018 (Export Controls); Nvidia 26.4 to 9.1 percent (China revenue share, FY2022 and FY2026 rows); 220 firms (Suppliers); Japan 78 percent of photoresist, 2023, and Korea 82.5 percent of HBM, 2025 (country-share matrix, relayed rows); 35 chips (AI Chips); the four reviewers and the forty-minute memo (qa/crit-*.md).
