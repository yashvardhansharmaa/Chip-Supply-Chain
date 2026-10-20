# Expert review, ch 15 Data Centers and Power (20 October 2026)

Reviewer: hyperscale data-center power engineer (grid connection, transformers and switchgear, cooling, on-site generation). Edited: `content/15-data-centers-and-power.md` only. Proposals for `data/flashcards.json`, `data/glossary.json`, `media/power.json` and `animations/power.html` are below as exact before and after. Downloads: `qa/round2/scratch/expert-data-centers-and-power/` (one folder per source, `file` plus `text.txt`).

## Counts
- Errors fixed: 11 (8 statements a specialist would call wrong or misleading, 3 precision or policy fixes)
- Sentences clarified for a newcomer or a reader outside the US: 5
- Sources replaced: 0. One corrected sentence now cites the Nvidia 800 VDC blog that the chapter already uses. No new sources.
- Links: 0 broken. Three LBNL citations given their missing `#page=`.
- `oneLiner` unchanged, so no share card re-render.

## Changes to content/15-data-centers-and-power.md

| # | Where | Before | After | Why | Source, quote, page |
|---|---|---|---|---|---|
| 1 | `plain` and How it works ¶1 (kept identical) | "...and OpenAI's planned sites add up to more than nine of them by 2029" | "...and OpenAI's seven Stargate sites in the United States add up to more than nine of them by 2029" | Epoch's 9 GW covers only the seven US Stargate sites. "OpenAI's planned sites" reads as all of OpenAI's plans, which go well beyond these sites. | Epoch AI, 17 Apr 2026: "Stargate has seven locations across the US"; "Together, the seven sites add up to over 9 GW of planned capacity" |
| 2 | How it works, busbar ¶ | "because a cable would melt at that current" | "because an ordinary cable would overheat at that current" | Cable can be sized for thousands of amperes. The point is that ordinary cable cannot carry that current. | Uncited sentence; physics |
| 3 | How it works, cooling ¶ | "without turning on chillers ([source])" | "without turning on chillers, the refrigeration machines that cool water ([source])" | Jargon explained at first use | Nvidia blog, 22 Jun 2026: "the facility loop can reject heat without turning on mechanical chillers" |
| 4 | How it works, 800 V ¶ | "So the same conductor carries over 150 percent more power, and the 200 kg busbars that feed a single rack are no longer needed ([OCP blog])." | "Nvidia says that at 800 volts the same copper carries over 150 percent more power than in a traditional 415- or 480-volt alternating current system ([OCP blog]). Inside racks such as the GB300 NVL72, power runs at 54 volts, and at that voltage a one-megawatt rack would need up to 200 kg of copper busbar ([800 VDC blog])." | Two errors. (a) The 150 percent compares 800 V DC with 415/480 V AC distribution, not with the 54 V rack busbar. Nvidia's own figures also differ (85 percent in May 2025, 157 percent in Oct 2025), so the claim is now attributed. (b) 200 kg is what a one-megawatt rack would need at 54 V. Today's racks carry no 200 kg busbar. | OCP blog, 13 Oct 2025: "Transitioning from a traditional 415 or 480 VAC three-phase system to an 800 VDC architecture offers various benefits" and "Over 150% more power is transmitted through the same copper with 800 VDC, enabling eliminating the need for 200-kg copper busbars to feed a single rack." 800 VDC blog, 20 May 2025: "Today's racks in AI factories rely on 54 VDC power distribution"; "The physics of using 54 VDC in a single 1 MW rack requires up to 200 kg of copper busbar." Companion blog (Oct 2025, `scratch/.../nv-800v-eco`): "the same wire gauge can carry 157% more power than 415 VAC" |
| 5 | Cooling, Immersion bullet | "The servers sit in a bath of fluid. It allows higher density still, but the hardware is hard to service." | "The servers sit in a bath of fluid, which makes them hard to service." | "Higher density still" was unsourced and is not true in 2026. Nvidia's Rubin racks are entirely cold-plate cooled, and its 800 V plan targets racks above 1 MW. | Nvidia blog, 22 Jun 2026: Rubin is "the world's first to achieve 100% liquid cooling"; coolant "flows through cold plates that sit directly on processors" |
| 6 | Rack power ¶ | "...the leak detection and the stored energy that keeps the rack running through a power dip." | "...the leak detection and the energy stored in the rack." | The in-rack storage smooths the rack's own swings in power draw; the next sentence says so. Riding through grid dips is the job of facility UPS and batteries. | OCP blog: "20x more energy storage to keep power steady". Nvidia 800 VDC ecosystem blog: capacitors "absorb the high-frequency power spikes and fill the brief valleys"; facility batteries "provide ride-through capability during transfers to backup generators" |
| 7 | Where the electrons come from, Grid | "The slow path, with long queues to connect" | "The slow path in the United States, where the queues to connect are long" | The source covers US grids only (country-neutral rule) | Epoch: "how builders are navigating the key challenges of gigawatt-scale AI data centers in the US. To sidestep lengthy queues for connecting to energy grids..." |
| 8 | Behind-the-meter gas bullet | "OpenAI's seven Stargate sites" | "OpenAI's seven US Stargate sites" | Stargate also has sites outside the US. The seven are the US sites. | Epoch: "at least three of the seven sites will make use of on-site natural gas plants" |
| 9 | Nuclear bullet | "subject to Nuclear Regulatory Commission licensing approvals" | "subject to licensing approvals from the US Nuclear Regulatory Commission" | Names the agency's country for a global reader | DOE, 18 Nov 2025: "pending U.S. Nuclear Regulatory Commission licensing approvals" |
| 10 | Who makes it ¶1 | "...came to $448.2 billion in 2025 ([source])." | "...came to $448.2 billion in 2025, the sum of quarterly figures compiled by Epoch AI, a research group ([source])." | Epoch publishes the quarterly figures but not the annual total; its page says only "nearing half a trillion dollars in 2025". Matches ch 16 ("the sum of Epoch AI's quarterly figures"). | Epoch chart CSV `/data/charts/hyperscaler-capex-trend/stacked_hyperscalers_trend.csv`, CY2025 totals $M 82,301 + 107,459 + 117,824 + 140,648 |
| 11 | Who makes it ¶2 | "Epoch AI, a research group, projects that" | "Epoch AI also projects that" | Epoch is now introduced in #10 | none |
| 12 | Figure `hyperscaler-capex`, source label | "Epoch AI, hyperscaler capex trend, February 2026, from company filings" | "Epoch AI, hyperscaler capex trend, February 2026, quarterly figures from company filings summed for 2025" | Each bar is a four-quarter sum (AMZN 134,730; MSFT 108,315; GOOG 93,053; META 72,494; ORCL 39,640 $M). Same disclosure as ch 16's `market-2025` figure. | Epoch CSV |
| 13 | Capacity and demand, three LBNL citations | `.../united-states-data-center-energy-usage-report-2025-update` (no page) | `#page=10`, `#page=10`, `#page=11` | The energy.gov "documents" URL serves a 36-page PDF (SCHEMA §2). The pages agents missed it because the URL has no `.pdf`. | p. 10 (folio 8): "the energy use of cryptocurrency mining is not included"; "192 terawatt-hours (TWh), accounting for 4.7%"; "464 TWh"; "649 TWh, representing 11.8%". p. 11 (folio 9): "Compounded Uncertainty Range of 521–843 TWh, equal to 9.5–15.3%" |
| 14 | Capacity and demand, EIA | "the Energy Information Administration expects" | "the US Energy Information Administration expects" | Global reader | none |
| 15 | The chokepoint ¶1 | "Far more capacity has been announced than is connected and running." | "On the Texas grid, far more capacity has been requested than is connected and running." | ERCOT counts connection requests, not announcements, and the evidence comes from one grid. | ERCOT Senate deck, 29 Jul 2026, p. 6: "approximately 474 GW of Large Loads seeking interconnection" |
| 16 | Transformers bullet | "By a Commerce Department estimate" | "By a US Commerce Department estimate" | Global reader | DOE LPT report p. 20: "The U.S. Department of Commerce estimated that in 2019 ... 617 units (82 percent) were imported" |
| 17 | Gas turbines bullet | "GE Vernova expects its annual gas turbine output to reach 20 GW in the third quarter of 2026, 24 GW..." | "In July 2026 GE Vernova expected its annual gas turbine output to reach 20 GW in the third quarter of 2026, 24 GW..." | The third quarter ended on 30 September, and the Q3 results are not yet out, so the expectation is dated to its release. | GE Vernova 2Q26 release: "we remain on track to deliver 20 GW of annual gas turbine output in the third quarter of 2026, with 24 GW in 2028, and we are implementing actions to produce 30 GW in 2030" |
| 18 | Card `countries`, CH | "Hitachi Energy and ABB transformer and switchgear engineering" | "Hitachi Energy transformers and switchgear, and ABB switchgear" | ABB sold its Power Grids business, which included the transformers, to Hitachi (80.1 percent on 1 July 2020, the rest in December 2022). ABB still makes medium-voltage switchgear. | Hitachi Energy "Our story": "In 2020, Hitachi and ABB's Power Grids' business came together in a joint venture to form Hitachi ABB Power Grids"; its product list includes "Transformers" and "High-Voltage Switchgear & Breakers". ABB release, 1 Jul 2020: "completion of the divestment of 80.1 percent of its Power Grids business to Hitachi". ABB product pages: UniGear and SafePlus medium-voltage switchgear |

## Every figure checked against its source (all match)
- Nvidia NVL72 reference architecture (updated 15 Sep 2026): "8 power shelves of 33 kW", "Full rack requiring up to 142 kW", "the GB300 NVL72 rack is liquid cooled".
- Epoch Colossus 1 (updated 16 Jun 2026): 150k H100, 50k H200, 30k B200 "added" 22 Jul 2025, "previous reports adding up to 230,000 GPUs". The entry now says the site is "owned by SpaceXAI and used by Anthropic", which the chapter does not touch.
- Epoch Stargate (17 Apr 2026): over 9 GW by 2029; seven US sites; at least three with on-site gas; Abilene 0.3 GW ("as of April 22nd") to 1.2 GW "in Q4 2026".
- Nvidia blogs: 45 °C, chillers, 100 percent liquid, "The ecosystem is keeping pace", Motivair "nearly a decade" (22 Jun 2026). 100 kW to over 1 MW, "1 MW IT racks and beyond, starting in 2027", 54 V limits "As racks exceed 200 kilowatts" (20 May 2025). Nine named providers, Kyber "576 NVIDIA Rubin Ultra GPUs by 2027", "20x more energy storage" (13 Oct 2025).
- Talen 8-K exhibit (11 Jun 2025): campus "adjacent to Susquehanna", "1,920 megawatts", "full volume no later than 2032". Constellation (19 Feb 2025): Microsoft PPA, "835 megawatts". DOE (18 Nov 2025): "$1 billion loan", "ceased operations in 2019". Constellation (6 Aug 2026): NRC "approved a fuel license amendment", "restarting operations in 2027".
- Epoch capex: "$770 billion in 2026" if the trend continues. IEA WEO 2025: "Investment in data centres is expected to reach USD 580 billion in 2025."
- GE Vernova 10-K FY2025: "Key Power segment competitors include Siemens Energy, Mitsubishi Power, Westinghouse, Framatome, and Rolls-Royce"; "Key Electrification segment competitors include Hitachi Energy, Siemens Energy, Siemens, Schneider Electric, Mitsubishi Electric, and ABB"; offerings include "power transformers, switchgear". 2Q26 release: "acquisition of the remaining 50% stake in Prolec GE from Xignux" in the six months to 30 June 2026; backlog "grew from 100 to 116 GW"; data center orders "over $5 billion year-to-date, more than double our 2025 total".
- LBNL pages 10 and 11 as above. EIA September STEO p. 4 and p. 10 (as in `pages/15-...json`); Table 7b gives 4,135.2 and 4,210.9 BkWh.
- IEA Energy and AI: US "(45%), followed by China (25%)". IEA Electricity 2025: data centres "accounting for around 3% of the additional demand" in China over 2022-2024. IEA grid report: "up to four years to secure large power transformers"; "almost doubled since 2021".
- Google: "Ironwood perf/watt is 2x relative to Trillium".
- ERCOT Senate deck p. 6 (474 GW, ~90 percent) and p. 10 ("Approximately 205 GW ... eligible for inclusion in Batch Zero based on existing studies"). March update p. 6 (9,042 MW, 3,883 MW). Governor's release dated "August 3, 2026".
- DOE LPT report p. 8 (36 and 60 months), p. 18 ("less than a year"), p. 20 (82 percent). USITC pub 5531 p. 90 (29.2, from 32.5 in 2021; imports 70.8), p. 15 (scope "greater than or equal to 60,000 kilovolt amperes"), p. 35 ("lead times averaged three years in 2023, while U.S. importers' lead times averaged one-and-one-half years").
- Micron 10-Q (period ended 28 May 2026): "AI-driven memory and storage growth is outpacing industry supply."

## Proposals for shared files (exact before and after)

### data/flashcards.json, "data-centers-and-power"
P1. `cards[1]`. Fixes the scope as in #1. The `section` drives the "Reread" link (build.js line 477), and "Capacity and demand" does not hold this fact.
- Before: `{"q": "How big are the newest AI data centers?", "a": "They are planned in gigawatts, and each gigawatt is the output of a large power station.", "why": "OpenAI's planned sites add up to more than nine gigawatts by 2029.", "section": "Capacity and demand"}`
- After: `{"q": "How big are the newest AI data centers?", "a": "They are planned in gigawatts, and each gigawatt is the output of a large power station.", "why": "OpenAI's seven Stargate sites in the United States add up to more than nine gigawatts by 2029.", "section": "How it works"}`

P2. `cards[3]` and `takeaways[3]`. The answer and the first "why" sentence survive from a card text that round two replaced (see `qa/card-precise.md` line 543). No chapter now states or cites "spare generating capacity", "makes its own transformers" or that chips limit China's buildout. The replacement uses the chapter's own IEA figures.
- Before: `{"q": "What limits China's AI data center buildout?", "a": "The supply of AI chips.", "why": "China has spare generating capacity and makes its own transformers. The United States imports most of its large transformers.", "section": "The chokepoint"}`
- After: `{"q": "Which two countries used the most data center electricity in 2024?", "a": "The United States, with 45 percent of the world's total, and China, with 25 percent.", "why": "Those are the International Energy Agency's estimates. Data centers made up around 3 percent of the growth in China's electricity demand from 2022 to 2024.", "section": "Capacity and demand"}`
- Takeaway before: `"China has power to spare, but the supply of AI chips limits its buildout."`
- Takeaway after: `"The United States used 45 percent of the world's data center electricity in 2024 and China 25 percent, by the International Energy Agency's estimate."`

P3. The `"intro"` deck card "For the newest AI data centers, what is harder than putting up the building?": change it only if the owner changes the `plain` sentence in open question 1, since its "why" copies that sentence.

### data/glossary.json
G1. `busbar` (same errors as #2 and #4)
- plain before: "A busbar is a thick bar of solid copper that carries large currents down the back of a rack to the boards that need them. A cable carrying the same current would melt. The busbars feeding a single AI rack can weigh 200 kilograms."
- plain after: "A busbar is a thick bar of solid copper that carries large currents down the back of a rack to the boards that need them. An ordinary cable carrying the same current would overheat. At the 54 volts used inside racks such as the GB300 NVL72, a one-megawatt rack would need up to 200 kilograms of busbar, by Nvidia's estimate."
- why before: "Nvidia is moving to 800-volt distribution so the same copper carries over 150 percent more power and those heavy bars are no longer needed."
- why after: "Nvidia is moving its racks to 800 volts, which cuts the current, so a megawatt rack will not need bars that heavy."

G2. `rack` why (same error as #6)
- before: "... It also changes the weight the floor must bear, the coolant flow and the stored energy that carries the rack through a dip in power."
- after: "... It also changes the weight the floor must bear, the coolant flow and the energy stored in the rack to keep its power draw steady."

G3. `power shelf` why. "Few suppliers" is unsourced and conflicts with the card's own "why" (GE Vernova names six key grid-equipment competitors). The constraint the chapter documents is lead time.
- before: "Many firms supply the shelves and the boards behind them, but the transformers upstream have few suppliers."
- after: "Many firms supply the shelves and the boards behind them. The large transformers upstream commonly took three years to arrive in 2024."

G4. `kilowatt` plain. Most campuses are tens to hundreds of megawatts.
- before: "... A data center campus is now sized in gigawatts."
- after: "... The largest data center campuses are planned in gigawatts."

G5. `large power transformer` plain. These transformers also step generator output up and link transmission voltages, so data centers are only one use.
- before: "A large power transformer is the machine that steps grid electricity down from transmission voltage to a level a data center can use."
- after: "A large power transformer is a machine that changes grid electricity from one voltage to another, for example from transmission voltage down to a level a data center can use."

G6. `capex` why and `hyperscaler` why (same disclosure as #10)
- before: "Alphabet, Amazon, Meta, Microsoft and Oracle spent $448.2 billion of capital in 2025."
- after: "Alphabet, Amazon, Meta, Microsoft and Oracle spent $448.2 billion of capital in 2025, the sum of Epoch AI's quarterly figures."

### media/power.json and animations/power.html (optional, low priority)
A1. Nvidia's source says its 800 V system is "to support 1 MW IT racks and beyond, starting in 2027", and the caption states this as where all racks are heading. The figure note already says "The megawatt racks from 2027 are Nvidia's plan".
- `steps[3].cap` (and `STEPS[3].cap` in power.html) before: "So water runs through plates on the chips, carries the heat to coolers outdoors and comes back. Racks are heading for a megawatt each by 2027, so the power coming in and the heat going out keep growing."
- after: "So water runs through plates on the chips, carries the heat to coolers outdoors and comes back. Nvidia plans for racks of a megawatt each from 2027, so the power coming in and the heat going out keep growing."
- `HEADS[3].s` in power.html before: "Racks are heading for a megawatt each by 2027". After: "Nvidia plans racks of a megawatt from 2027".

## Newer releases (text not changed: the chapter's dated wording is still correct)
1. ERCOT Monthly Operational Overview (September 2026), 16 Oct 2026, PDF p. 9 of 31: "Of the 9,456 MW that have received Approval to Energize, ERCOT has observed a non-simultaneous monthly peak consumption of 4,132 MW in September 2026, which is a slight decrease since August 2026." The chapter uses the 13 March 2026 figures (9,042 and 3,883 MW). The June overview (17 Jul 2026, p. 10) gives 8,926 and 3,966 MW.
2. ERCOT Board, Item 14 "Batch Zero Update", 14-15 Sep 2026 (8 pp). p. 1: "204 projects (66.4 GW) met the qualifications to be conditionally included as base load; 158 projects (127.9 GW) met the qualifications to be conditionally included as studied load." p. 3: "Paused approvals to energize data centers or virtual currency mining facilities (crypto facilities) that are 75 MW or greater." p. 4: verification report due "by December 10, 2026", with final classification "provided in December". ERCOT gives no combined September total, so do not add the two figures.
3. EIA STEO October 2026 (6 Oct 2026), Table 7b, PDF p. 46 of 60: US sales 4,152.0 BkWh in 2026 and 4,216.6 in 2027 (September: 4,135.2 and 4,210.9). West South Central 2027: 782.9 (September: 789.8). The October text no longer mentions the Texas pause. ERCOT's Board deck (item 2, p. 3) confirms the pause continues.
4. Micron Form 10-K for the year ended 3 Sep 2026, filed 9 Oct 2026: "AI-driven memory and storage demand growth is outpacing industry supply." This is the same claim as the cited 10-Q.
5. Not yet out on 20 October: GE Vernova Q3 2026 results, Constellation Q3 2026, IEA WEO 2026.

## Links
- `links.json` lists 26 URLs for ch 15, none broken or error. The four IEA pages marked "blocked" were read through raw Wayback copies, and each says what its sentence says (quotes above).
- sec.gov answered 403 ("Your Request Originates from an Undeclared Automated Tool") to this network for most of the session, even with the generic User-Agent. I read the Talen release from `qa/bib-cache/`, and the GE Vernova 10-K, the 2Q26 release and the Micron 10-Q from raw Wayback copies. Later data.sec.gov and www.sec.gov answered 200, and the Micron 10-K was fetched directly. The links themselves are fine.
- usitc.gov returns an Akamai 403 to curl, so I read the project's cached copy (pages 15, 35 and 90 checked).

## Open questions for the owner
1. `plain` and How it works: "All of them come from a few suppliers and take years to arrive." This holds for heavy gas turbines. Transformers and switchgear have many makers worldwide, and the constraint is factory capacity. A sourced alternative: "Their makers cannot keep up with demand, and they take years to arrive.", citing GE Vernova's 10-K ("increasing demand exceeding available capacity for products and services that supply the electrical power industry"). The change would also need the intro flashcard (P3). Not changed.
2. Should The chokepoint and Takeaways move to ERCOT's September 2026 figures (9,456 and 4,132 MW, `#page=9`)? That needs the bibliography entry below.
3. Should the EIA paragraph move to the October outlook? Its Texas pause sentence would then need ERCOT's Board deck as its source.
4. Should the citation move from Micron's 10-Q to its new 10-K?
5. "One rack of AI chips ... draws up to 142 kilowatts" (`plain`, flashcards, animation): 142 kW is the GB300 NVL72's maximum. Vera Rubin racks were ramping by July 2026 (ch 16), but no allowed source in the chapter gives their power. "can draw 142 kilowatts" would stop readers taking 142 kW as a ceiling. Not changed.
6. Nvidia's own same-copper figures disagree: 85 percent (May 2025, row busways against 415 V AC), "over 150%" (OCP blog, Oct 2025) and "157%" (ecosystem blog, Oct 2025). The chapter keeps the OCP figure, now attributed to Nvidia.
7. "No restarted reactor is serving data centers yet." is an uncited absence claim. It is still true as far as I checked (Crane restarts in 2027). Consider "by October 2026", or cutting it.

## Notes for the main session
- A dry run of `qa/round2/apply-pages.py 15` will report "sentence not found" for two changed sentences that already carry their pages: "By a US Commerce Department estimate, 82 percent…" (`#page=20`) and "In its September 2026 Short-Term Energy Outlook, the US Energy Information Administ…" (`#page=4`). Ignore both. The three LBNL citations now carry `#page=10`, `10` and `11`. The pages JSON never listed them.
- Key facts are unchanged. Only the first two show (walk page), and `walk.js` looks them up in bibliography.json by exact URL, so no `#page=` was added to key-fact sources.
- No new bibliography entries are needed for the edits.

## New bibliography entries (only if the owner adopts the newer figures)
```json
{
  "https://www.ercot.com/files/docs/2026/10/16/ERCOT-Monthly-Operational-Overview-September.pdf": {"title": "Electric Reliability Council of Texas, ERCOT Monthly Operational Overview (September 2026)", "publisher": "Electric Reliability Council of Texas", "date": "2026-10-16", "type": "pdf", "accessed": "2026-10-20"},
  "https://www.ercot.com/files/docs/2026/09/11/14-Batch-Zero-Update.pdf": {"title": "Electric Reliability Council of Texas, Item 14: Batch Zero Update, Board of Directors meeting, 14-15 September 2026", "publisher": "Electric Reliability Council of Texas", "date": "2026-09-11", "type": "pdf", "accessed": "2026-10-20"},
  "https://www.eia.gov/outlooks/steo/archives/oct26.pdf": {"title": "Short-Term Energy Outlook, October 2026", "publisher": "U.S. Energy Information Administration", "date": "2026-10-06", "type": "pdf", "accessed": "2026-10-20"},
  "https://www.sec.gov/Archives/edgar/data/723125/000072312526000023/mu-20260903.htm": {"title": "MICRON TECHNOLOGY INC, Form 10-K annual report for the fiscal year ended 2026-09-03 (10-K)", "publisher": "U.S. Securities and Exchange Commission (filing by MICRON TECHNOLOGY INC)", "date": "2026-10-09", "type": "filing", "accessed": "2026-10-20"}
}
```

## Checks (once, after the last edit)
- `node build/build.js`: exit 0, no warnings for ch 15 ("15 data-centers-and-power: 1831 words, 32 sources (D 0, ? 0), 4 figures"), "source tiers: A 601 · B 29 · disallowed 0 · unclassified 0".
- `node qa/scripts/check-speak.js`: "check-speak: no matches".
- `node qa/scripts/check-integrity.js`: only the known "exposure row for Veeco Instruments has no supplier entry".
- `node qa/scripts/check-sources.js`: "check-sources: 2477 citations, all tier A or B".
- My own check: front matter valid JSON, `plain` identical to the first How it works paragraph, every card URL cited in the body, no sentence with two citations. The rebuilt static page (`/data-centers-and-power/`, fetched with curl) shows every edit, and the LBNL footnotes read "p. 10" and "p. 11". No screenshots were needed.
