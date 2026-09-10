# Critique: the policy adviser

Read-only, 10 September 2026 build, 1440x1000. Screenshot: `qa/crit/staff-board.png`. I do not repeat
open items from `qa/nav-test-policy.md`, `qa/nav-export-controls.md`, `qa/reader-retest-policymaker.md`.

## Verdict

The board is the best public rendering of the control regime I have used, and the China revenue page is
the best evidence anywhere that the rules cost somebody something. But the site explains a *system* and
a principal asks about a *calendar*. Everything here has already happened: none of the 43 moves is a rule
in comment, a bill, or a clock running out. The page that answers "where do the controls stand" cannot
answer "what do we decide next" — one field and one view away.

## The memo I could and could not write

**Written from the site alone, in about 40 minutes.** Where the fence sits: nine flows, their state, the
move that set each, a Federal Register or SEC link behind every one — the visible Copy as CSV returns
exactly that and stamps the as-of date, so scrubbing to 31 Dec 2022 gives a "how it changed" annex in one
paste. Who holds what: chapter 17's twelve-row table with a Basis column. Whether it bit: twenty firms'
China revenue with the three rule dates on the axis — Tokyo Electron 47.4% to 26.8%, Nvidia to 9.1%. What
China did back: seven MOFCOM countermeasures. What China can do alone by 2028: chapter 17's stockpile
arithmetic (~13m memory stacks, ~1.6m Ascend 910C packages).

**Left out.** Anything with a date in front of it: the affiliates-rule and gallium suspensions both expire
around 10 November 2026, and only a prose bullet says so. Cloud access and lobbying: silent. A quantified
Taiwan disruption: concentration is there (78% foundry, 92% of the most advanced), consequence is not.

**Would not sign.** Chapter 17's table reads `HBM | South Korea | 56% | SK hynix alone, revenue, 1Q26`:
the Leader column names a country, the Share column gives one firm. Korea's 1Q26 share is 76.9%, 82.5%
for 2025. The same bullet calls Samsung's share one "no source we trust splits"; chapter 10 splits it at
19.3%, from the same Form 424B4. Nor would I sign `SHUT — Affiliates rule suspended for a year`.

## The board as a decision tool

| Does it | |
|---|---|
| Distinguish announced / in force / suspended / rescinded | **No.** Four states plus an initial open. "Suspended" is prose inside a label, and the same 10 Nov 2025 truce is a loosening for minerals (shut→licence) and no change for entity. Only 2 of 43 summaries give an effective date. |
| Show each rule's aim, and whether it worked | Aim yes — `gist` is an effect sentence. Worked, only obliquely: the revenue page shows cost borne by suppliers, not the objective met. |
| Show the other side's response | **Yes**, well. Seven countermeasures, their own rows. |
| Show what is pending or proposed | **No.** The Chip Security Act (42-0 in committee, not law) and the MATCH Act live only in chapter 17 prose. |
| Want "what changed this month" and a feed | **Yes, badly.** Dates and ids exist; nothing makes a diff. |

## The principal's six questions

| Question | Site | What would answer it, under the strict rule |
|---|---|---|
| Chokepoints the US could lose | **Partly.** Chinese tools 10-15% → 35% of their home market, ~40% of etch and deposition (CSIS). | A trend arrow per matrix row; CSET/ETO carries the series. |
| What China can do alone by 2028 | **Yes** — the best answer here. | Surface it on the board. |
| What allies must agree to | **Partly.** Three Dutch/Japanese moves; MATCH Act is prose. | A state for "US rule with no allied equivalent", from government.nl and METI. |
| A Taiwan disruption | **Silent** on consequence. | Chapter 16's bill of materials plus the matrix gives a defensible "share of a B200 that stops". |
| Where enforcement fails | **Partly.** 140,000 chips (House Select Committee), Thai front companies and Super Micro (DOJ), Applied Materials $252.5m. Cloud: silent. | An enforcement row: DOJ releases and BIS penalty notices are Tier A. |
| What industry lobbies for | **Silent.** | Nvidia and ASML 10-K risk factors and earnings transcripts. |

## Ten changes, ranked

1. **Fix the HBM row and the "no source splits it" line** in chapter 17. Wrong in the most quoted table. **XS**
2. **Split state from status:** add `inForce`, `suspendedUntil`, `rescinded` to `control-flows.json`. Ends the SHUT/suspended contradiction and makes minerals and entity consistent. **M**
3. **A pending lane:** `status: proposed|pending` on the timeline, and a tenth row for what is not yet law. **M**
4. **An expiry strip — "3 states expire within 90 days."** The decision calendar, from one field. **S**
5. **Deep links:** `#/controls?asof=2022-12-31&flow=ai-chips`. `replaceState` appears nowhere in `app.js`. **M**
6. **"What changed since" — pick a date, get the diff.** **M**
7. **A per-flow and per-country one-pager that prints to one page.** A template, not new content. **M**
8. **Any way to get a chart out.** No `toBlob` or SVG download anywhere; one button makes every figure a slide. **S**
9. **"Controls in force: 3 flows" in each country panel.** The map answers who *makes*, never who *licenses*. **S**
10. **An enforcement row: penalties, prosecutions, the cloud gap.** All Tier A. **M**

## Framing risks

It reads as analysis, not advocacy, and earns that by labelling its judgments: "These are our judgments,
not any source's" above Predicted winners, "We think the shield is real and weakening", the SITE ESTIMATE
tag on Taiwan's 72%. Three places a hostile reader goes. The heading **Predicted winners** invites the
reading that the site picks sides; *Who gains and who pays* costs nothing and defends better. **"The
small yard is the clearest casualty"** and "industrial policy rather than a narrow security perimeter"
are the only sentences that grade US policy rather than describe it — quotable against the author and
anyone citing him. And the **source policy versus the data**: the policy bans TechInsights by name,
while the equipment row of the headline table is TechInsights revenue reached through CSET's explorer,
as the site says. The honesty is right; the rule as written is too absolute to survive it. Say that a
Tier A institution's vendor inputs are inherited, not laundered.

## The tab I keep open

I keep a tab open because it tells me something I did not know this morning. This site tells me,
superbly, what happened between 2018 and last week — and a reference I have already read is a bookmark,
not a tab. Give the board a pending lane, an expiry strip and a since-my-last-visit diff and it stops
being a record and becomes a watch list; put those three in a monthly email and it reaches me instead.
The reporting already beats the paid trackers. What it lacks is a clock.
