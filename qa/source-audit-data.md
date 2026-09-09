# Source audit — data files

Audit of every citation URL in `data/suppliers.json`, `data/landscape.json`,
`data/landscape-notes.md` and `data/export-controls-timeline.json` against
`brief/SOURCE_POLICY.md`. Tiers are assigned from `data/source-tiers.json`.

Status: IN PROGRESS (written incrementally).

## Tier counts before

Counted by URL, not by record. "A (own site)" is a supplier citing its own
corporate domain, which the policy treats as Tier A for the firm's role;
those domains were absent from `source-tiers.json` and are added under A.

| File | URLs | A | B | C | D | unmapped |
|---|---|---|---|---|---|---|
| suppliers.json | 220 | 38 | 10 | 0 | 11 | 161 |
| landscape.json (`sources`) | 59 | 29 | 12 | 15 | 3 | 0 |
| landscape-notes.md | 58 | 28 | 12 | 15 | 3 | 0 |
| export-controls-timeline.json | 45 | 33 | 7 | 0 | 0 | 5 |

Of the 161 unmapped supplier URLs, 160 are the supplier's own corporate or IR
domain (Tier A by policy) and 1 is a venture-capital marketing blog
(`wing.vc`, cited for Advantest's tester share) which is Tier D in substance.
Of the 5 unmapped timeline URLs, 1 is an official PRC State Council page
(Tier A), 2 are IEA policy-database mirrors of MOFCOM announcements and 2 are
Global Times, PRC state media.

## Replacements

(filled in below as work proceeds)

## Claims downgraded or removed

(filled in below as work proceeds)
