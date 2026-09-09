# CHOKEPOINTS — Editing brief (second pass)

The client read the first draft and gave two notes: **there is too much text**, and **"How it works" must be understandable by a policy researcher with no technical background** who is reading in order to write regulation. This pass fixes both without losing any sourced fact.

## Targets

- Cut each component chapter to **1,050 to 1,350 body words** (from 1,500 to 1,900). The Introduction to 800 to 1,000. Geopolitics to 2,000 to 2,600.
- Keep every citation that supports a number that survives. When you cut a sentence, its citation goes with it. Never leave a number without its `([source](url))`.
- Keep the front matter exactly as it is except: (a) fix anything mechanically broken, (b) add the new `plain` field described below.
- No em dashes anywhere except inside the bold-label bullets of "Key evaluation criteria".

## The new opening of "How it works"

Immediately under `## How it works`, write one paragraph of **60 to 110 words** that a smart reader with no engineering background can follow on first read. Rules for it:

- Start from something the reader already knows (a printing press, a kiln, a stack of pancakes, a customs checkpoint), then say what this stage actually does to the chip.
- Name the one or two physical facts that make this stage hard, in plain words ("the light is absorbed by air, so the whole machine runs in a vacuum and every lens has to be a mirror").
- Say why a regulator should care in one clause ("which is why a single Dutch firm can be a chokepoint").
- No acronyms unless spelled out; no units the reader would have to look up.

Put the same paragraph, verbatim, in the front matter as `"plain": "..."` (a top-level string, next to `oneLiner`). The site shows it in a highlighted box and reuses it on the Briefing page.

After that paragraph, keep the technical explanation but shorter: what a regulation drafter needs to know to write a threshold or name a tool, not what a process engineer needs.

## Bullets

Any sentence or paragraph that enumerates three or more parallel items (variants, vendors, steps, criteria, countries, tools) becomes a bullet list. Each bullet: a bold lead phrase, then one sentence, then its citation. Tables stay tables.

## What to cut first

1. Restated context the reader already has from the chapter above or from the nameplate card.
2. Second and third examples that make the same point.
3. History that does not change the present picture (keep dates that set up a chokepoint's origin).
4. Adjectives and hedges. "Notably", "importantly", "it is worth noting".
5. Long parenthetical asides. Either promote to a sentence or delete.

## What never to cut

- The chokepoint argument: who holds the stage, how concentrated, how long to substitute, China's status, what the controls touch.
- Any number with a citation that a policy reader could plausibly cite back.
- Figures and their `{{figure:id}}` markers.
- The "Key evaluation criteria" list and the "Takeaways".

## Style reminders

Plain sentences, one idea each, about 20 words. Active voice. Name the firm, the tool, the city. No hype. Say "we think" when it is a judgment.

## Check before you finish

- Body word count in range (`wc -w` on the body with the front matter stripped, minus citation URLs).
- Front matter parses (`node -e "JSON.parse(require('fs').readFileSync(0,'utf8'))"`).
- `grep -c "—"` counts only the Key-evaluation-criteria bullets.
- Every `{{figure:id}}` still present.
- `plain` field present, 60 to 110 words, and identical to the first paragraph under "How it works".
