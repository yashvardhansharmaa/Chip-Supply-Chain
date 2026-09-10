# Data and methods

## What this site covers

Compute Chokepoints follows one AI accelerator through the chain that builds it, from the design software to the rack it ships in. Seventeen chapters cover the fifteen production stages in order, then what a rack costs and the export-control fight over all of it. Each chapter names the firms that lead its stage, rates how hard they would be to replace, and links every number to a public document. Ten datasets sit beside the chapters, listed below with every field, the row count and a download link.

## What it does not cover

Five things a reader might expect are missing. The software stack: CUDA, compilers and kernels are the most-cited moat in AI compute, and no chapter mentions them, because this site covers the physical chain only. Fab economics: what $20 billion buys, cost per wafer, utilisation, depreciation. The workforce: who does this work and how long they take to train. Water and power inside the fab, as against the grid at the far end. And China's own chain: it appears in every chapter as a position and a constraint, never as a subject. There is no history before the controls of 2018, and no reading list.

## How the card is rated

Two fields on the chokepoint card carry judgment rather than measurement: concentration and substitutability. Nobody publishes either. Here is the test behind each, as the site applies it today, with a tally of the chapters in each band.

### Concentration

Concentration counts how many firms could credibly supply a stage now, judged at the narrowest step inside it rather than by counting the firms in the chapter. Where `chokepoint-matrix.json` carries a share for the segment, the top country's share is the second check.

{{table:concentration}}

The supplier count wins where the two disagree, and it disagrees twice. Photomasks is Extreme on a Japanese share of 53 percent, because three firms make extreme-ultraviolet mask blanks and one inspects them. Metrology and inspection is High on an American share of 72 percent, because four firms ship working tools.

### Substitutability

Substitutability asks one question: how hard would it be for a well-funded state or firm, starting today, with the money and the will, to stand up an alternative to the leaders of this stage? The clock runs to qualification at the leading node, not to a prototype, and it never times the inventor's own history. Each card's rating line names the evidence that puts the stage in its band.

{{table:substitutability}}

One rule matters more than the bands: the clock times the same actor everywhere. Earlier versions of the card carried a substitution time in years that timed China on some cards, any second source's qualification on others and the original inventor on two, which is a longer and different question. The rating replaced the years on 10 September 2026 so that every chapter is judged against the same four tests.

### What changed in September 2026

Until 10 September 2026 the card also carried a chokepoint score from 1 to 5. Two reviewers found that the score restated concentration in 15 of the 17 chapters, so it was retired; the number stays in each chapter's data as `chokepointScore` for anyone who wants the history. A measured indicator now sits beside the judgment for researchers: the Herfindahl index and the top-two country share for each segment in `chokepoint-matrix.json` (`hhi` and `top2`), with a `basis` field saying whether each share was measured, derived, estimated or relayed from a firm this site cannot cite directly. The site's own labels stay in plain words.

{{split}}

## Sources

Every number here traces to a Tier A source or to one of four named Tier B exceptions, and there is no Tier C. Tier A is primary and institutional: company filings and investor materials, governments, regulators and courts, standards bodies, universities and national labs, and research institutions that publish their methods and their funding. Tier B is SemiAnalysis, Reuters, the Financial Times and Nikkei Asia and nothing else; where one of those, or a filing, is passing on a number from a source this site cannot cite, the text marks it relayed via that document, as the DRAM and HBM rows do for SK hynix's prospectus.
