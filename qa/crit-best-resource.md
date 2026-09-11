# Is this the best single resource on the chip supply chain?

Read 10 September 2026: Start here, Lithography, Memory and HBM, the board, the Index (FDPR, TPP, Entity List), the China revenue panel.

## 1. Verdict

Yes with conditions. For a junior researcher who needs to know how an AI chip is made and where the leverage sits, this is the best single starting point I know, and I would send it before Chip War or any one CSET brief, because nothing else walks the whole chain this currently with every figure traced to a filing or a rule. For a staffer who must answer "can we ship this, to that buyer, today", the board and the Index beat anything else free on the web, but the site stops at the supply chain and leaves out the rest of compute governance, so it cannot be the only link. It is not yet what I would cite in a paper: the methods page was built and deleted, and there are no per-chapter URLs.

## 2. The comparison

| Resource | Correctness | Currency | Chain | Rules | Entry | Citability | Time to first grasp |
|---|---|---|---|---|---|---|---|
| **Compute Chokepoints** | Every number to a filing or rule | Current to this month | All 15 stages, uniquely | 10 flows with FR and CFR cites | Best here, no background needed | Site BibTeX only, no methods page | 7 minutes |
| CSET briefs (Khan, Mann) | Peer-reviewed, methods stated | 2021 to 2023, shares now stale | Deep per topic, never end to end | Strong on rule design, not current rules | Assumes some fluency | The standard citation | A day per brief |
| ETO Supply Chain Explorer | Best provenance on data | Refreshed, vendor-derived | Nodes and inputs, no narrative | None | Interface easy, meaning is not | Citable dataset | Hours, and no story |
| Chip War (Miller) | History is sound | Ends before the AI build-out | The history, not today's chain | Pre-2022 only | Best of all, it is a good book | Cite for history only | Twelve hours |
| SemiAnalysis | Usually right, rarely shows work | The most current anywhere | Deep on packaging, memory, racks | Read through economics | Assumes fluency | Paywalled, contested in review | Hours, if you can read it |
| Epoch AI hardware pages | Transparent, reproducible | Kept current | Accelerators only | None | Clean | Versioned and citable | An hour |
| CSIS chip-control explainers | Reliable, lawyer-checked | Good, tracks each rule | Little chain | Best free account of the rules | Written for staffers | Citable | Two hours |
| Heim and collaborators | Careful, the field's frame | 2024 to 2025, frame holds | Treats the chain as a premise | Why compute is governable | Academic prose | The standard citations | A day |
| BIS summaries, eCFR, UK and EU primers | Authoritative by definition | Same day | None | The rule itself | Impenetrable cold | The only thing to cite in advice | Days, or minutes if you know the section |

## 3. What a newcomer would get wrong after a day

**Concentration read as leverage.** Start here labels stage after stage "CONCENTRATION / Extreme" and shows nothing beside it. Only the full chapter card pairs it: "EXTREME CONCENTRATION · VERY HARD TO SUBSTITUTE". The seven-minute read is the page most people finish, and it teaches that eight stages are equally squeezable. Page: `#/intro`.

**The cloud is invisible.** Nothing on the site mentions remote access, IaaS or KYC. A staffer asked whether the rules stop a Chinese lab renting H200s abroad finds nothing on the board, in the Index, or in Geopolitics.

**No demand side.** No model-level threshold appears anywhere. `data/control-thresholds.json` still holds the EU AI Act and 10^26 figures, but the thresholds tab was removed, so they never render. The reader leaves believing compute policy is export licences.

**Everything looks settled.** Geopolitics closes with five sharp items under "What to watch" but never says what serious people disagree about, including the argument that the 2022 rules accelerated indigenisation.

**Provenance rule invisible.** The data carries `basis` (measured, derived, estimate, relayed) and `asOf`, and the prose says things like "The filing credits the research firm IDC", but no page explains the scheme. A reader cannot separate the site's own estimate from a filed figure without opening JSON.

## 4. Five changes, ranked

1. **Substitutability on Start here and the home stops.** Add the band already in `card.substitutability` beside the concentration tag: "Extreme concentration, very hard to replace". Structure. Half a day. Highest understanding gained per hour of work.
2. **One screen of methods, not a page.** Under Start here or the board: 200 words on what measured, derived, estimate and relayed mean, what `asOf` is, links to the four notes and the JSON. Mostly structure. One day. Without it the site is quotable but not citable.
3. **"What is contested" in Geopolitics.** Three disagreements, the strongest version of each side, a named holder for each: did 2022 accelerate indigenisation, is TPP the right instrument, is Taiwan's concentration deterrent or vulnerability. Content only the author can write. 400 words, one day.
4. **The routes the rules do not close.** A Geopolitics section or an eleventh board row: cloud and remote access, the model-level thresholds already unused in the data, the smuggling enforcement the chapter documents. Content. Two days. This turns a supply-chain site into a compute-governance one.
5. **A real URL and a cite line per chapter.** Already a logged open item. Prerender one page per chapter with its own title and canonical, and put "Cite this chapter" under each. Structure. Two to three days. Until then every citation resolves to the whole site.

## 5. The email

"Start with the seven-minute read here, then the export-control board: it is the clearest end-to-end account of how an AI chip is made and where the chokepoints are, every figure traced to a filing or a Federal Register page and current to this month, but it is a supply-chain site rather than a compute-governance one, so pair it with CSET on data and Heim on why compute is the lever at all, and read the rule itself before you advise anyone on a licence."
