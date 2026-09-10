# The home map: three readers, an encoding audit, three ways forward

Read-only, at 1440 and 375. Shots: `qa/nav/home-{desktop,mobile,crop-eastasia,crop-legend}.png`.

## Three readers

**Curious newcomer.** In a minute the map said: chips are made in a ring around the North Pacific, plus a bit of Europe, and Taiwan is the answer. It did not say what any country *does*. The two biggest circles, the US and Japan, told me the US designs the chips and Japan makes the chemicals. Then I clicked the small circle over Bulgaria, found it was Germany, and stopped trusting the map. Copper dots are named only on hover, so on the phone the 19 towns are anonymous specks, the nine markers lose their country codes (`.sa-marker-cc { display: none }` under 700px), and the map is 157px tall. I wanted a sentence per country saying what it makes.

**Policy adviser.** I want the sentence I can put in a memo. Taiwan's panel gives it, 72% of leading-edge logic — but every lede ends "named on thirteen of the 17 chokepoint cards", which is not a fact about the world. "Site estimate" sits beside the 72% unexplained, a hedge on the headline number. I clicked the Netherlands last, because its marker is the smallest tier, and found 100% of EUV: the hardest chokepoint on the site, drawn smaller than Malaysia. On the phone the legend explaining the sizing sits 1,350px below the map.

**Think-tank analyst.** Every card names four or five countries, a fixed slot count, so "named on N of 17" measures slots earned, not control. The US (16) and Japan (15) lead the map on it; the Netherlands (6) and Germany (4) trail. Germany's panel opens "Germany holds 17% of specialty gases", when its role is Zeiss optics for every EUV scanner, four items down. Austria holds two 5/5 stages (IMS mask writers, AT&S substrates) yet is a small chip; Mexico, named on chapter 14, has none. The Abu Dhabi pin is clickable but dead: there is no AE panel.

## Encoding audit

| Channel | Encodes | Verdict |
|---|---|---|
| Marker area | cards naming the country | Wrong variable, unreadable. `max(22, 8.25·√n)` gives US 33px, JP 32, TW 30, CN 26, KR 23 and **22px for NL(6), DE(4), MY(1), SG(1) alike**. On a phone six of nine are 18px. |
| Ring weight | named by a 5/5 stage | 8 of 9 carry it. Separates Malaysia, nothing else. |
| Copper vs dark pin | chokepoint vs substitute town | Good idea; dark pins nearly vanish on the dark ground. |
| Pin size | chokepoint score | 8px vs 9px. Imperceptible, and "taller" describes the globe, not this map. |
| Marker position | country | Eight of nine sit offshore: DE on Bulgaria, KR on Russia, NL on the Atlantic; MY and SG leaders cross. |

The panel is far better than the map: shares ranked, sourced, dated and linked, the China block the page's best thing. But its lede takes the *largest* share, not the *most controlling* one, so any country whose role is one irreplaceable component — Germany, Austria, Japan's pellicles — is undersold.

## What the framing should be

CSET defines a chokepoint as a step where one or two firms dominate and substitution is slow: the country is a property of the step. SIA/BCG count the points where one region holds more than about two-thirds. The Economist and FT put *one* number on each country. Miller's *Chip War* names the firm and the town and says what happens if it stops. None rank countries by how often they appear. This site's thesis is the CSET framing, so the page should lead with **the stages where a country holds a sole or dominant position**, each with what it uniquely supplies.

## Three directions

**(a) Role lines.** Keep the map; give every country a role line ("Germany: the optics inside every EUV scanner"), and rail the 15 stages below it with the selection's lit. Wireframe: `hero / map, role on hover / 15-cell chain rail / country list / exits`.

**(b) Who could stop the chain.** Lead with countries ranked by the stages where they hold a sole or dominant position, each carrying the substitution time the cards already hold, the map beside it as the picture. Wireframe: `hero / left: ranked rows — NL 2 sole, 10+ yrs · TW 1 at 72% · KR 2 · JP 4 · US 5 — each a bar of the stages held; right: map, its towns lit / panel / exits`.

**(c) Flows.** Arcs for what moves, carrying the export-control state from `data/control-flows.json`.

**Recommended: (b).** It answers the thesis question in the first screen, fixes the encoding at the root rather than decorating it, and needs no new data: `chokepointScore`, `card.countries`, `card.leaders`, `card.substitution.years` and the 17 share rows are in the repo. (a) needs 21 editorial sentences — cheap, and worth folding into (b). (c) is prettiest and dearest: `control-flows.json` holds nine *political* routes, but the site has no physical volumes for wafers, tools, chips or memory. Under the strict policy that means UN Comtrade or national customs (Taiwan MOF, Korea KITA, Japan METI) plus an HS-code mapping the site must defend — why three matrix rows are already null.

## Ten fixes that need no redesign

1. **Lede formula.** With no rank-1 share, lead on the highest-scoring card's own note, not the biggest percentage: Germany must not open on specialty gases.
2. **Marker size.** Drop the 22px floor, or stop sizing by mention count: NL, DE, MY and SG are one size, and on a phone six of nine are.
3. **Phone markers.** Restore `.sa-marker-cc` under 700px, give the map over 157px of height and markers a 44px hit area.
4. **Legend.** Above the map on phones, not 1,350px below; fix the wrap orphaning the copper dot from "Chokepoint town".
5. **"Site estimate."** Say who estimated it and why, beside the Taiwan and Korea rows carrying it.
6. **Offshore markers.** Keep them in open water: DE on Bulgaria and KR on Russia read as claims.
7. **Substitution years.** "10+ years to replace" is the site's most persuasive number and never reaches the home page.
8. **The dead pin.** Give Abu Dhabi an AE panel or make it inert; stop marking clickable pins `aria-hidden="true"`.
9. **List order.** Rank the chips by stages held, lift Austria and the UK (48% of core IP) out of "also in the chain", add Mexico.
10. **Sub-caption.** Say what the two pin colours mean; drop a size claim 8px and 9px pins cannot carry. "Taller" describes the globe.
