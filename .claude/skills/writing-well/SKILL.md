---
name: writing-well
description: Edit or write prose using William Zinsser's principles from On Writing Well (as summarised at peterlunch.com/notes/writing-well-william-zinsser). Use for any chapter, essay, caption, glossary entry or UI copy on Chokepoints, and whenever asked to tighten, simplify, de-clutter or "make it read well".
---

# Writing well (Zinsser) for Chokepoints

Zinsser's thesis: clear writing is clear thinking made visible, and the work is in the rewriting. Most first drafts can lose a third to a half of their words without losing a fact. Apply the checklist below to every paragraph, then read the result aloud.

## 1. Strip every sentence to its cleanest parts

Bracket, then delete, anything that does no work:

- **Long words with short equivalents:** assistance → help, numerous → many, facilitate → ease, initial → first, implement → do, sufficient → enough, utilise → use, approximately → about, in order to → to.
- **Weak qualifiers:** a bit, sort of, kind of, rather, quite, very, too, pretty much, in a sense, somewhat, relatively, fairly. Delete them; if the sentence collapses, the claim was weak.
- **Adverbs that repeat the verb:** blared loudly, clenched tightly, effectively halved. Let the verb carry it.
- **Adjectives stating the known:** tall skyscraper, expensive EUV tool (the reader knows). Keep only adjectives that add information.
- **Inflating openers:** it should be noted that, it is worth noting, importantly, notably, interestingly, as mentioned above. Cut the opener and say the thing.
- **Wordy constructions:** due to the fact that → because; with the possible exception of → except; until such time as → until; for the purpose of → for; in the event that → if; a large number of → many; at this point in time → now.
- **Fad words and jargon:** paradigm, leverage (as a verb), synergy, ecosystem (when you mean industry), landscape (when you mean market), robust, holistic, going forward, at scale (when it adds nothing).
- **Over-explaining and pre-judging:** surprisingly, predictably, of course, obviously, clearly. Trust the material; let the reader judge.

## 2. Use active verbs and name the actor

"ASML shipped 48 systems" beats "48 systems were shipped." Every sentence should have a subject that does something. Prefer verbs with an image (cut, stack, etch, ship, print, refuse) to abstract ones (impact, enable, drive, involve).

## 3. One thought per piece, one idea per paragraph

Each chapter section leaves the reader with one thought. If a paragraph carries two, split it. Keep paragraphs short: writing is visual and a wall of text repels before it is read. Two to four sentences is normal for the web.

## 4. The lead and the ending

- The first sentence of a chapter or section must give the reader a reason to continue: a hard fact, an odd detail, a stake. Never open with background or definition when a fact will do.
- The last sentence of each paragraph is the springboard to the next; the first sentence of the next paragraph should grow from it.
- When you have made the point, stop. No "in conclusion", no restating, no summary of what you just said.

## 5. Know the reader

Do not assume the reader knows what everyone in the industry knows. Spell out the acronym on first use, give the scale ("a mirror flatter than a hair's width across Germany"), and explain a process as a sequence of steps, which also proves you understand it. For a technical subject use the pyramid: the one essential fact first, then its significance, then the detail.

## 6. Say it as you would say it

Never write a sentence you would not say aloud to a smart friend. No pomp, no inflated register. Opinions are allowed and should be plain ("we think", "the evidence is thin"). Specific beats general: one firm, one tool, one price, not "several major vendors".

## 7. Rhythm and sound

People read with the ear. Vary sentence length. Read the passage aloud; where you stumble, rewrite. "But" is a strong first word for a sentence that turns. Use transition words that signal a turn (but, yet, still, instead, meanwhile, so) rather than throat-clearing ones (furthermore, additionally, moreover).

## Procedure for a Chokepoints edit

1. Read the whole section once for its one thought. Write that thought in a sentence; everything that does not serve it is a cut candidate.
2. Bracket clutter with the lists above; delete brackets.
3. Turn every passive sentence with a knowable actor into an active one.
4. Split long paragraphs; keep bullets for three or more parallel items, each with a bold lead phrase, one sentence and its citation.
5. Check the lead and the last sentence of every paragraph.
6. Keep every number and its `([source](url))` citation together; a cut sentence takes its citation with it; never leave a number without a source.
7. Read aloud. Count words. A good pass removes 20 to 40 percent.

## Site-specific rules that override taste

- No em dashes in prose (they are allowed only inside the bold-label bullets of "Key evaluation criteria").
- The `plain` paragraph in the front matter must stay identical to the first paragraph under "How it works".
- Section headings, figure markers `{{figure:id}}`, tables and the front matter JSON are structure, not prose; leave them unless the brief says otherwise.
