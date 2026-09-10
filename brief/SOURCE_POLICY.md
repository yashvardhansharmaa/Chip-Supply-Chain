# CHOKEPOINTS — Source policy

The client's instruction: **only very high-quality, extremely reliable sources.** Every number on the site must trace to a Tier A source or one of the four Tier B exceptions below. There is no Tier C any more.

## The rule, as of 9 September 2026 (strict)

Only two tiers may be cited. Everything else is disallowed and must be replaced with an allowed source or the number deleted.

## Tier A — primary and institutional

Company filings and investor materials (SEC EDGAR, annual reports, investor decks and earnings releases on the company's own domain), governments, regulators, courts and legislatures (Federal Register, eCFR, BIS, DOJ, MOFCOM, METI, government.nl, EU institutions, Congress), standards bodies (JEDEC, UCIe, RISC-V), universities and national labs (imec, LBNL, arXiv), and research institutions with named methodologies and public funding or governance: CSET and its ETO data, CSIS, SIA and SIA/BCG reports, SEMI, WSTS, Epoch AI, RAND, Brookings, CFR, IFP, Stimson, USGS.

## Statutory filing systems (added 10 September 2026)

A company's audited statements filed with its home regulator are Tier A wherever they are filed: EDGAR (SEC), DART (Korea's Financial Supervisory Service, dart.fss.or.kr), EDINET (Japan), the UK's Companies House and the Dutch KvK. A filing in another language is cited with the page and the line item quoted in the note, so a reader without the language can still check it.

## Inherited numbers (added 10 September 2026)

A figure that a Tier A institution publishes but attributes to a disallowed firm (IDC in SK hynix's prospectus, TechInsights inside CSET's ETO explorer, Gartner in KLA's deck) may be cited from the Tier A document, and must say so: in prose ("IDC, as reported in SK hynix's prospectus") and in data (`basis: "relayed"`, `relayedVia: "IDC"`). The disallowed firm's own publication is still not a source. Every dataset row carries a `basis` field: `measured` (the source states the number), `derived` (computed from figures the sources state; the method is in the note), `estimate` (the site's own judgment; the reasoning is in the note), or `relayed`.

## Tier B — the four named exceptions

SemiAnalysis (newsletter.semianalysis.com, inferencex.semianalysis.com), Reuters, the Financial Times, and Nikkei Asia. Nothing else.

## Disallowed (formerly Tiers B-other, C and D)

Every other analyst or market-research firm (TrendForce, Counterpoint, Yole, TechInsights, Gartner, IDC, Dell'Oro, LightCounting, Prismark, Z2Data, Futurum, Isaiah Research, Omdia and the like), all other press including Bloomberg, WSJ, NYT, CNBC, SCMP, Caixin, DigiTimes, EE Times, Semiconductor Engineering, Tom's Hardware, SemiWiki, ServeTheHome, The Next Platform, The Register and every trade title, law-firm client alerts (cite the rule itself instead), market-research SEO sites, financial-data aggregators, and personal or anonymous blogs.

## What to do with a disallowed citation

1. Find the Tier A or Tier B source for the same fact: the filing, the rule, the standards document, the institutional report, or a SemiAnalysis, Reuters, FT or Nikkei piece. Replace the URL and correct the number if the better source differs.
2. If none exists, delete the number and rewrite the sentence so it makes only the claim the allowed sources support. A qualitative claim also needs an allowed source.
3. A figure whose data cannot be rebuilt from allowed sources is removed, together with its `{{figure:id}}` marker and front-matter entry.
4. Log every change.

## Presentation

The Sources page tags every citation A or B. `data/source-tiers.json` maps domains; add any new domain you cite under the right tier.
