# China revenue share: four ways to draw it

Mockups for the "China revenue share" tab on the Export Controls page. The page's question is what the three US rules (October 2022, October 2023, December 2024) did to each firm's China sales. Every figure is computed from `data/exposure.json` (108 fiscal years, 21 firms) and drawn as inline SVG with the site's tokens and fonts. Each `.html` here is standalone; append `?theme=dark` to see the dark version. `sheet.png` is the contact sheet.

The baseline throughout is the fiscal year ending in 2022, the last full year before the first rule. "Rose" means the latest share is more than 3 points above that year, "fell" more than 3 points below, "flat" within 3 points. On that rule 8 firms rose, 5 fell, 7 are flat, and 1 (Advantest) has no 2022 year.

## 1. Slope chart (`slope.png`)

One line per firm from fiscal 2022 to the latest year, garnet where the share rose, ink where it fell, gray where it held within 3 points, in nine panels grouped by category so labels do not collide. It answers the headline question in one glance: the equipment makers (ASML, SCREEN, Tokyo Electron, Veeco, BESI) sold a bigger share to China after the rules, and the firms the rules named most directly (Nvidia, Onto, the EDA pair, the memory makers) sold a smaller one. It hides the path. ASML looks like a clean climb from 14% to 29%, but it went through 36% in 2024; Lam and KLA look flat while both spiked above 42% in between. It also hides the rule dates, since there is no time axis. Nine panels for 20 firms is a lot of structure for two numbers each.

## 2. Grouped small multiples (`grouped-multiples.png`, `grouped-multiples-dark.png`)

The existing small multiples, kept on one time axis and one 0 to 60% scale, but sorted into three headed groups (Rose through the controls, Fell, Flat) and ordered within each group by size of change. The three rule dates are dashed verticals in every panel and labeled on the first panel of each group; the peak year is a garnet dot with its value and year; the latest value sits at the end of the line. This is the only view that shows the pre-buying pattern the page is about: most of the "rose" group and half of the "flat" group peak in the fiscal year that closed right after the October 2023 rule, then come off. What it hides is magnitude: a share going from 26% to 9% at Nvidia looks like a shallow slope on a 0 to 60% scale, and the panels give no sense of dollars. Grouping by a 3-point threshold is also a judgment: Applied Materials (+2.0) and Samsung (+2.4) sit in "flat" a point away from "rose".

## 3. Dollars beside share (`dollars.png`)

Two panels per firm: the share line on the shared 0 to 60% scale, and China revenue as bars on each firm's own scale in its own currency, with the fiscal 2022 bar hollow and the latest bar in ink. Ordered by how much China revenue grew from 2022, so Nvidia leads: its share fell from 26% to 9% while its China revenue went from 7,111 to 19,677 USD m, and the reader sees the share collapsed because the total tripled, not because China sales did. Onto is the honest counterexample at the bottom: share and dollars both fell. What it hides is comparability. The 14 dollar firms can be compared bar to bar only within a firm (each has its own scale), and the 7 firms reporting in euros, yen and won are shown but not converted, so their bars are not comparable with anything else on the page. Nova discloses no absolute figure and gets a note instead of bars. Two panels per firm at 21 firms is a long page.

## 4. Ranked table (`table.png`)

One row per firm ranked by latest share: fiscal 2022 share, latest share and year, change in points with a garnet sign and the rose/fell/flat word, peak share and year, latest China revenue with its currency unit, plus a sparkline with the rule dates and peak dot. Tabular figures in IBM Plex Mono. It answers every specific question a reader brings (what is Lam's peak, what does Samsung report, how far did Nvidia fall) and is the accessible and copyable view. It hides the shape of the whole: nothing about the table says that the peaks cluster in 2024, and the reader has to scan the change column to find the groups the multiples hand them.

## Recommendation

Lead with the grouped small multiples (2). The page asks what the rules did to each firm; that needs the rule dates on a time axis and the peak year, and the grouping turns 21 panels into a three-sentence reading order. Keep the current hover layer and the click-through to the filing on each point; add the group heading text as the tab's one paragraph of prose. Beneath it, add the dollars view (3) for the 14 USD firms only, as a second block or a toggle on each panel ("share / dollars"), because the Nvidia case is the single most misread number on the page and the share line alone cannot correct it; show the 7 non-USD firms with a "reports in JPY, not shown in dollars" line rather than bars, unless the page is willing to convert at fiscal-year-average rates and say so. Keep the table (4) as the fallback view for the same tab and as the print and screen-reader version. Drop the ranked dumbbell: the firm's all-time range is not the question the page asks, and the slope chart (1) says the same thing as the group headings with less information, so it is not needed either. A colorblind check: garnet against ink passes CVD separation (Delta E 12.1 protan) and normal-vision separation (22.5) in light, and 28.1 and 31.9 in dark, with contrast above 3:1 on both surfaces; the validator flags ink for lightness and chroma because it is the neutral text color rather than a hue, which is intended. Direction is also carried by the line itself and by the group heading, never by color alone.

## Data gaps

Advantest has no fiscal 2022 (its first year on file is FY2024), so it has no change figure and sits in a fourth group of one; the slope omits it. Nova reports a China percentage only, so it has no revenue bars and its table row says "not disclosed". Seven firms report in currencies other than USD (ASML and BESI in EUR million, Tokyo Electron and SCREEN in JPY million, Advantest in JPY billion, Samsung and SK hynix in KRW million); nothing here is converted, and the KRW figures print as eight-digit millions, which is honest but ugly. Fiscal years end in different months: Nvidia's fiscal 2022 closed in January 2022, nine months before the first rule, while Applied Materials' and Synopsys' closed in October 2022, the month the rule fell, and the calendar-year filers in December 2022, two months after it. The "before" baseline is therefore not the same date for every firm, and the multiples make that visible by plotting each point at its fiscal year-end month. The latest year also varies, from Micron's August 2025 to KLA's and Lam's June 2026.

## Files

- `slope.html`, `slope.png`
- `grouped-multiples.html`, `grouped-multiples.png`, `grouped-multiples-dark.png`
- `dollars.html`, `dollars.png`
- `table.html`, `table.png`
- `sheet.png` (contact sheet)

Rendered at 1440 wide, full page, with headless Chrome. The generator script lived in the session scratchpad and is not part of the site; no site source was changed.
