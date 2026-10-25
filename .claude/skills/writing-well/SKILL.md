---
name: writing-well
description: Edit or write prose using William Zinsser's principles from On Writing Well (as summarised at peterlunch.com/notes/writing-well-william-zinsser). Use for any chapter, essay, caption, glossary entry or UI copy on Chokepoints, and whenever asked to tighten, simplify, de-clutter or "make it read well".
---

# Writing well (Zinsser) for Chokepoints

Zinsser's thesis: clear writing is clear thinking made visible, and the work is in the rewriting. Most first drafts can lose a third to a half of their words without losing a fact. Apply the checklist below to every paragraph, then read the result aloud.

## 0. Make the argument before polishing the words

Cutting clutter does not fix muddled thinking, and it can make the muddle worse. The owner found this paragraph in Lithography (October 2026):

> If ASML stopped shipping, no fab anywhere could add EUV scanners. Tools already in fabs would keep printing for as long as they were serviced. [95 percent of systems still in use.] It guarantees service and spare parts for each platform until at least a committed date, subject to export controls. ASML itself could not quickly rebuild its production, because Zeiss makes its optics and Trumpf its drive laser.

It read smoothly and said little:
- **No stated point.** It stacked facts without saying what a halt would mean.
- **A placeholder.** "Until at least a committed date" hides a fact the reader needs.
- **A last sentence that does not follow.** It answers a different question (what if ASML's own suppliers stopped?), and it got that way during a plain-writing pass that compressed an earlier sentence.

The rewrite:

> If ASML stopped shipping, no fab anywhere could add EUV capacity, because no other company makes EUV scanners. The scanners already in fabs would keep printing only as long as they were serviced. ASML has around 10,000 customer support employees who maintain and upgrade those machines around the clock. Serviced this way, ASML's machines stay in use for a long time. [95 percent still in use.] The same report warned that export controls may limit the service ASML can provide for machines already installed.
>
> ASML has a chokepoint of its own. Zeiss SMT is its only supplier of lenses, mirrors and other critical optics. ASML says that if Zeiss could not supply them for a long period, it would effectively be unable to run its business.

The rules, taken from that fix and from the two pieces the owner named as models (techstatecraft.org/duv/ and IFP's "How to increase America's AI lead over China"):

1. **State each paragraph's point first, in one plain sentence.** Write it before anything else. If a reader who knows nothing could not restate the paragraph in one sentence, the paragraph has no point yet.
2. **Every sentence must follow from the one before it.** Read the premise, then each sentence in turn, and ask whether it answers the question the paragraph asked. A sentence that answers a different question goes in its own paragraph, under its own point sentence.
3. **Explain a chokepoint as a chain of dependency.** Say who needs what from whom, and what happens when it stops: "no fab could add EUV capacity, because no other company makes EUV scanners." Say the "because" outright, and never leave the reader to infer the link.
4. **Name a turn in the argument.** When the topic shifts, open a new paragraph with a sentence that says so ("ASML has a chokepoint of its own").
5. **A placeholder is a missing fact.** "A committed date", "certain tools", "some customers": give the date, the tools, the customers from the source, or cut the clause. Never hint at a fact the source does not give.
6. **Compressing must not change the meaning.** After every cut, reread the sentence alone and then with its neighbors. A shorter sentence that says something different is a new error.
7. **Paraphrase a source into its plain meaning.** A vague paraphrase hides the fact it was meant to carry. Check every paraphrase against the page it cites.
8. **Findings in short declarative sentences, then the evidence.** State a caveat right after the claim it limits. Translate a scale the reader cannot picture.
9. **Close off the second reading.** If a sentence can be read two ways, add the fact that rules one out. "ASML's machines last a long time" after "only as long as they were serviced" left the owner unsure whether the machines need no service or last because they are serviced. Naming who does the work fixed it: "ASML has around 10,000 customer support employees who maintain and upgrade those machines around the clock. Serviced this way, ASML's machines stay in use for a long time."

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

Never write a sentence you would not say aloud to a smart friend. No pomp, no inflated register. A judgment is allowed when it is plain and owned by its source ("Reuters reported", "the firm estimates", "no public count exists"); the site never speaks as "we" or "you". Specific beats general: one firm, one tool, one price, never "several major vendors".

## 7. Rhythm and sound

People read with the ear. Vary sentence length. Read the passage aloud; where you stumble, rewrite. "But" is a strong first word for a sentence that turns. Use transition words that signal a turn (but, yet, still, instead, meanwhile, so) rather than throat-clearing ones (furthermore, additionally, moreover).

## 8. Machine-written habits to remove

Text drafted by a language model has tells that readers notice even when they cannot name them. Each one makes the writer sound clever and the reader work harder. Replace each with the plain statement of the fact.

- **Aphorism and paired antithesis:** "No fab is planned around X, and no fab works without it." "The silicon is the cheap part." "X is less a Y than a Z." Say what happens and give the number.
- **Abstraction in place of the event:** "Since 2018 the United States has been converting that fact into policy." Name the actor, the action and the date: "Since 2018 the United States has used export rules to..."
- **Personification and metaphor:** stages that "decide", markets that "reward", a firm that "sits at the heart" of the chain, a bottleneck that "moves". Use the literal verb.
- **Set-up before the point:** "The reason is simple:", "Here is why", "The answer is", "What matters is", "This means that", "The catch:". Start with the point.
- **Significance without the fact:** "plays a key role", "is critical to", "matters because". State what the thing does, and the reader sees why it matters.
- **Elegant variation:** ASML, then "the Dutch firm", then "the Veldhoven company". Call a thing by one name throughout.
- **Stacked clauses:** a sentence that chains three clauses with "and", ", which" or "while" is two or three sentences. Over about 30 words, split it, keeping one citation at the end of each sentence that carries a sourced fact.
- **Semicolons and colons that stitch two sentences:** use a period.
- **Vague time:** "now", "today", "recently", "currently". Give the month or year.
- **Rhythm tics:** three-part lists of abstract nouns, every paragraph ending on a quotable line, a summary sentence that restates the paragraph. Cut them.

Do not over-correct. Plain writing still links its facts with "because", "so" and "but", explains a term the first time a non-specialist meets it, and keeps the calibrated hedges that make it accurate ("about", "by its own estimate", "Reuters reported"). A run of five-word sentences reads as badly as one sentence of sixty words.

## Procedure for a Chokepoints edit

1. Read the whole section once for its one thought. Write that thought in a sentence; everything that does not serve it is a cut candidate.
2. Bracket clutter with the lists above; delete brackets.
3. Turn every passive sentence with a knowable actor into an active one.
4. Split long paragraphs; keep bullets for three or more parallel items, each with a bold lead phrase, one sentence and its citation.
5. Check the lead and the last sentence of every paragraph.
6. Keep every number and its `([source](url))` citation together; a cut sentence takes its citation with it; never leave a number without a source.
7. Read aloud. Count words. A good pass removes 20 to 40 percent.

## Site-specific rules that override taste

- No em dashes, no "X, not Y", no "not X but Y", no "rather than", no "not only ... but", no colon punchlines, no rhetorical questions, no "we", "you" or "our", and no reference to the site itself ("this site"). `node qa/scripts/check-speak.js` enforces these; `node qa/scripts/style-report.js --file <path>` lists the softer habits above for one file.
- American spelling; "percent" in prose; one `([source](url))` per sentence, at its end, from the more reliable source.
- The `plain` paragraph in the front matter must stay identical to the first paragraph under "How it works": the build hides that paragraph and shows `plain` in its place, so a citation found only in the paragraph disappears.
- A chapter's `oneLiner` is also its search-result description: one or two whole sentences, about 110 to 160 characters, stating the chapter's main fact plainly.
- Glossary entries say what the thing is first, then give the reason it matters directly, with no "why it matters" signposting.
- Section headings, figure markers `{{figure:id}}`, tables and the front matter JSON are structure, not prose; leave them unless the brief says otherwise.
