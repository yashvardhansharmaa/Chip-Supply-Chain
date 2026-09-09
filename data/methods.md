# Methods

## What this site is, and who made it

Compute Chokepoints follows the AI chip in the order it is built, from the quartz that becomes a wafer to the liquid-cooled rack. Each chapter says how one stage works, which firms control it, and how hard they would be to replace. Beside the chapters sit the datasets: the supplier list, the accelerator specs, the export-control timeline, the licence threshold map, the China share of revenue taken from company filings, and the glossary. The table further down counts them all.

Yashvardhan Sharma made it with Claude in September 2026. He set the brief, the direction and the standards. Claude did the research, writing, design and code. The site was built in the tradition of Humanity's Last Machine and of CSET's semiconductor supply-chain work, both linked in the credits at the foot of the home page.

The whole thing compiles to one HTML file. No framework, no runtime dependencies, no trackers. The 3D specimens are drawn by code from published dimensions rather than scanned from real objects. Every figure links to a public document. Treat the text and the data as a starting point for your own diligence, not as investment advice.

## The chokepoint score

Every chapter opens with a chokepoint card, and three fields on it carry judgment rather than measurement: the chokepoint score, the concentration band and the substitution time. No one publishes any of them. We wrote them, and the rest of this section says how.

The score runs from 1 to 5. It asks one question: what happens to leading-edge AI chip production if the leaders of this stage stop shipping?

| Score | The test | Where it lands |
|---|---|---|
| 5 | The failure mode is total. One firm, or one country's cluster, stops and nothing at the leading edge gets built. Nobody can step in inside the substitution time. | Lithography, photomasks and pellicles, transistors and the front end, foundries and fabs, memory and HBM, advanced packaging, substrates and PCBs. The introduction and the geopolitics essay score the whole chain, and both carry a 5. |
| 4 | A real chokepoint, and a softer one. Two to four credible suppliers, or one firm above half the market with rivals who ship working tools. Losing the leader raises cost and delays output. It does not stop it. | Chip design and EDA, silicon and wafers, chemicals, deposition and etch, metrology and inspection, test and assembly, data centers and power, component costs. |
| 3 | Most of the stage has several capable suppliers and the volume moves between them within a few quarters. The narrow points sit one layer down, not at the level of the stage. | Systems and networking. |
| 2 | Many suppliers, and the scarce input is something another industry already sells at volume. | Not used. |
| 1 | Many substitutes. A buyer switches supplier inside one purchase cycle. | Not used. |

Nothing on the site scores 1 or 2. The chain was chosen for its narrow points, and even the widest stage, systems and networking, still scores a 3.

The score is not the substitution clock in disguise. Metrology and inspection would take ten years or more to replace and scores a 4, because several firms build a good film metrology tool and the leader's hold is concentration rather than physics. Advanced packaging would take three to five years and scores a 5, because TSMC does effectively all the CoWoS the leading accelerators need. The test is the failure mode, not the calendar.

### Concentration

Concentration answers a narrower question: how many firms credibly supply this stage. The brief allows four bands.

- **Extreme.** One to three firms supply it, or a single firm holds most of it. Ten chapters carry it.
- **High.** Four to six credible suppliers, with the top two or three taking most of the revenue. Eight chapters carry it.
- **Moderate** and **Low** are defined and never used, for the same reason no stage scores 1 or 2.

The band is judged at the narrowest step inside the stage rather than on a headcount of the firms in it. Photomasks lists five leaders and is Extreme, because three firms in the world supply EUV mask blanks and one firm inspects them. Silicon and wafers also lists five leaders and is High, because those five firms stand behind the wafer market as a whole.

Concentration and the score are separate judgments, and one chapter shows the gap. Chip design and EDA is Extreme and scores a 4: three vendors each hold a different signoff step, but as the card puts it, "swapping one tool is feasible."

### Substitution time

Substitution time is our estimate of how long a well-funded state or firm would need to stand up an alternative. It is the most opinionated number on the card. It is written as a range in years, from 2 to 3 up to 10+, and every card carries a sentence naming the constraint that sets the clock.

Read those sentences and four constraints do the work. Know-how that was never written down, as with crystal pulling and final wafer polish. The qualification cycle at the customer, since every photoresist formula is qualified for one process at one fab. Physical lead time, as with the 36-month wait for a large power transformer. And the customer's permission: a new HBM entrant needs a stacking line and Nvidia's approval. The estimate takes the slowest of the four, not the sum.

### Who owns these three numbers

Yashvardhan Sharma does. Claude set each score, band and range while writing the chapter, under his brief and his standards, and he is answerable for all of them. They are editorial judgments. Where a chapter argues its own score, the argument is in the section headed "The chokepoint", and you are welcome to reach a different number from the same evidence.

## Where the numbers come from

The sourcing rule is strict, and it is the site's strongest claim to being a reference. Every number must trace to a Tier A source or to one of four named Tier B exceptions. There is no Tier C.

**Tier A** is primary and institutional: company filings and investor materials on the company's own domain or on SEC EDGAR; governments, regulators, courts and legislatures, including the Federal Register, eCFR, BIS, DOJ, MOFCOM, METI, government.nl, the EU institutions and Congress; standards bodies such as JEDEC, UCIe and RISC-V; universities and national labs, including imec, LBNL and arXiv; and research institutions with named methods and public funding or governance: CSET and its ETO data, CSIS, SIA and SIA/BCG, SEMI, WSTS, Epoch AI, RAND, Brookings, CFR, IFP, Stimson and USGS.

**Tier B** is four named exceptions and nothing else: **SemiAnalysis**, **Reuters**, the **Financial Times** and **Nikkei Asia**.

Everything else is disallowed. That includes every other analyst and market-research firm, TrendForce, Gartner, IDC, Yole, TechInsights, Dell'Oro, Omdia and the rest; all other press, Bloomberg, the Wall Street Journal, the New York Times and every trade title among them; law-firm client alerts, where the rule itself is cited instead; market-research SEO sites; financial-data aggregators; and personal or anonymous blogs.

To see a source's tier, open the Sources page: every citation is listed by chapter and tagged **A** or **B**. In the chapters themselves the footnote number is the source, and it links straight to the document rather than to a list. The domain map behind the tags is a file you can read, `data/source-tiers.json`, served next to this page.

When a number has no allowed source, one of three things happens.

1. It is replaced. We find the filing, the rule, the standards document or the institutional report that carries the same fact, and correct the number if the better source differs.
2. It is deleted. The sentence is rewritten to claim only what the allowed sources support. A qualitative claim needs an allowed source too.
3. The figure goes. A chart that cannot be rebuilt from allowed sources is removed along with its marker and its data.

That is not a hypothetical. When the rule tightened on 9 September 2026, five rows of the country-share matrix lost their numbers. A second search the same day recovered two of them from a company filing. Advanced packaging, IC substrates and server assembly still carry no shares and render as dots, and their notes say why.

## Estimates and relays

Sometimes an allowed source is repeating a number from a disallowed one. The site cites it anyway, and says so where the number appears.

**SK hynix and IDC.** SK hynix's Form 424B4 prospectus of 10 July 2026 prints the world's HBM and DRAM shares and credits IDC for them. An IDC report is not citable here. A registered prospectus is a company filing, and SK hynix has adopted these figures as its own description of the market it competes in, with securities-law liability attached. The chart label reads "SK hynix Form 424B4 prospectus, 10 July 2026, on IDC data", and the matrix note repeats the reasoning rather than presenting the numbers as SK hynix's own measurement.

**KLA and Gartner.** KLA's March 2026 investor day puts its own 2024 share of the process control market at 56.5 percent, six and a half times its nearest competitor, and footnotes the slide to Gartner. The chapter attributes the figure to KLA rather than stating it flatly, and prints CSET's independent count of 57.2 percent for the same year beside it.

The same rule covers third-party estimates inside an allowed document: a bank's number in a company outlook is labelled "BofA estimate cited in SK hynix's 2026 market outlook", not presented as SK hynix's.

Our own estimates are labelled too. One row of the country-share matrix, leading-edge logic capacity, is rolled forward from the SIA and BCG 2022 baseline for three new fabs, and its note ends: "This is a CHOKEPOINTS estimate, not a published table." In the chapters, a judgment is written in the first person, "we think", so a reader can see where the evidence stops and the argument starts.

## Dates

The build date at the foot of the table below is the site's as-of date. Everything in this copy, every chapter and every dataset, was last touched on or before it. The same date prints in the site footer. No chapter carries a date of its own yet.

Inside the datasets, individual rows carry their own dates, and those are the ones to cite. The country-share matrix gives the year each segment was measured, on every row that carries a number. Every licence threshold carries its effective date and the date of each amendment since. Timeline events carry the event date. The China-revenue series is keyed to each firm's fiscal-year end, which is why the years do not line up across firms. Each accelerator carries its announcement month, and a supplier row carries the year of its revenue figure where one is published.

## What this site does not cover

Five things a reader might reasonably expect are missing.

- **The software stack.** CUDA, compilers and kernels are the most-cited moat in AI compute and the chapters do not mention them. The site covers the physical chain only.
- **Fab economics.** What $20 billion actually buys, cost per wafer by node, utilisation and depreciation. The component costs chapter prices the parts of a rack, not the plant that makes them.
- **The workforce.** Who does this work, how many of them there are, and how long they take to train.
- **Water and energy inside the fab.** Ultrapure water and fab power appear in passing. The data centers chapter covers the grid at the far end of the chain, not the fab's own footprint.
- **China's chain as a subject in its own right.** China appears in every chapter as a position and a constraint, and in the geopolitics essay as a target of controls. It has no chapter of its own.

There is also no history of the industry before the export controls of 2018, and no reading list.

## Corrections and contact

Corrections and additions are welcome, and the sourcing rule means most of them can be checked in one click.

**[Placeholder for the author: put the address for corrections here, an email or a form. No address is published yet.]**

## Licence

**Licence: to be confirmed by the author.** Nothing on this page grants a licence to the text, the datasets or the code until that line is replaced.
