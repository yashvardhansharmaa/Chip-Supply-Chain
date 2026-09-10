# Board data rebuilt on the four legal outcomes

Ten flows, 51 states, 50 moves. Each state carries the effective date as `date`, the announcement as
`announced`, and a `cite` of volume and page, CFR section and a link to a document I read. Non-US
instruments put their issuer's own citation in the `fr` slot ("MOFCOM Announcement 2024 No. 46"), so parse
only `/^\d+ FR \d+$/` as Federal Register.

## The sequences

| Flow | Effective date → status, with citation |
|---|---|
| Advanced AI chips | 26.8.22 case (8-K); then denial: 21.10.22 (87 FR 62186, §742.6(b)(10)), 17.11.23 (88 FR 73458), 16.1.25 (90 FR 5298), 9.4.25 (8-K, §744.23), 14.7.25, 11.8.25, 15.1.26 (91 FR 1685) |
| Chipmaking tools | all case: 21.10.22 (87 FR 62186); 17.11.23 (88 FR 73424); 6.9.24 (89 FR 72926); 31.12.24 (89 FR 96790); 31.12.25 (90 FR 42321) |
| Allied controls | all case: 23.7.23 (METI); 1.9.23 (ASML); 7.9.24 (Stcrt. 2024, 29008); 1.4.25 (Stcrt. 15.1.25) |
| High-bandwidth memory | 31.12.24 denial (89 FR 96790, §742.6(a)(6); 740.25) |
| US goods and technology | 15.4.18 prohibited (83 FR 17644); 13.7.18 open (83 FR 34825); then denial at each listing, 30.10.18 (83 FR 54519), 16.5.19 (84 FR 22961), 15.5.20 (85 FR 29849), 17.8.20 (85 FR 51596), 18.12.20 (85 FR 83416), 17.10.23 (88 FR 71991), 25.3.25 (90 FR 14046), 29.9.25 (90 FR 47201); 10.11.25 denial, `suspendedUntil` 10.11.26 (90 FR 50857) |
| Minerals to America | 1.12.20 open; 1.8.23 case (2023 No. 23); 3.12.24 prohibited (2024 No. 46); 9.11.25 prohibited, `suspendedUntil` 27.11.26 (2025 No. 72) |
| Minerals elsewhere | same first two; 4.4.25 case (2025 No. 18); 9.10.25 case (2025 No. 61); 7.11.25 case, `suspendedUntil` 10.11.26 (2025 No. 70) |
| Foreign chips in China | 21.5.23 prohibited (CAC notice); 26.8.26 prohibited (10-Q) |
| Rest of the world | all open: 13.1.25 (90 FR 4544, §740.27); 13.5.25 (BIS); 15.5.25 (White House); 10.7.26 (91 FR 43034) |
| Money and tariffs | seven `policy` states, 9.8.22 to 15.1.26 |

## Split, renamed, dropped

**AI chips stays one flow.** The band is a threshold inside one gate, §742.6(b)(10), not a second gate, and
an honest split needs an undated "the H20 arrives below the line" state. The pill reads the headline parts;
the labels say where the band falls.

**Minerals split in two**, `minerals` (China → United States) and `minerals-world`: one row cannot be
prohibited and licensed at once.

**Dropped** the 8 December 2025 H200 clearance: it set no outcome. BIS implemented it on 13 January 2026,
effective 15 January. It stays a move.

## Added

Moves: the ZTE termination, China's Export Control Law, NDAA §5949, the October 2023 and March 2025
listings, the September 2024 GAAFET and quantum rule, the Dutch tightening of April 2025. All 50 carry
`instrument`, 38 an `frCitation`, 25 a `cfr`.

Glossary: EAR, subject to the EAR, de minimis, presumption of denial, Country Groups, VEU, denial order,
is-informed letter, reexport, in-country transfer, EAR99, and Licence Exceptions NAC, ACA, HBM and LPP.
TPP, performance density, FDPR, Entity List and licence exception rewritten.

Thresholds: 3A090.b's garbled parameter and backwards January 2026 note fixed, NAC and ACA split, the
October 2022 rule dated 21 October in all eight rows, the Dutch date corrected to 7 September 2024,
`frCitation` on all 40 rows and `cfr` on the 33 with one. The supercomputer row already read 100 double and
200 single inside 41,600 cubic feet.

## Left uncited

Three `policy` states — Big Fund III, TSMC's $165bn, the Taiwan MOU — keep a URL but no document name: I
did not read those pages. Nothing I read names the section behind the August 2022 is-informed letters, so
that state has no `cfr`. And `data/source-tiers.json` needs `cac.gov.cn` under Tier A: the Micron row now
cites the Cyberspace Administration notice, and the audit flags it until then.
