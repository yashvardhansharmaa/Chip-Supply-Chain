# Nav test: policy adviser, twelve minutes before a briefing

Legislative staffer, no engineering background. Wants the chain in outline, what is controlled today,
three numbers safe to say aloud, and paper to hand over. Screenshots: `qa/nav/pol-*.png`.

## Verdict

The Export Controls board is the best briefing tool I have seen on a public site. Nine flows, a state
badge, one plain sentence, a date, and a year scrubber that turns "how did it change since 2022" into
one click. Every move opens a sourced paragraph with a Federal Register or SEC link behind it. I would
walk into the room with this. What stopped me was the last mile: the board uses the regulatory terms I
must not get wrong ("21,000 TPP", "affiliates rule") and defines none in place, though the glossary
holds them. The home map answers *who makes what*, never *who licenses what*, so the site's two halves
never meet. And nothing says the site is current until I open the citation box.

## Questions per page

**Home.** Where do I click? Only the top nav answers; the body offers Intro and The Chain, neither of
which is my briefing. Which countries matter and why? Answered well — each pin gives three shares,
three chokepoint cards and the towns. Is this current? No.

**Export Controls.** What can China buy today? Answered. How did it change since 2022? Answered:
end-2022 shows six of nine flows OPEN, today two SHUT, three LICENCE, two CASE BY CASE. Do I trust
it? Yes — primary sources throughout, and Sources states an A/B policy. What is 21,000 TPP? No. What
does a licence mean in practice? Not here (chapter 17). What do the five badges mean? No legend. Did
the rules work? Not here.

**China revenue share.** How exposed is each firm? Answered, and the table gives year by year with
each firm's counting basis stated. The fall in those lines is the best evidence on the site that the
rules bit, and it is nowhere said in words.

**Chapter 17.** Answers "an export control is a licence requirement", "where China stands", "where the
US stands". I reached it by accident.

## Path taken, and dead ends

Home → nav Export Controls (30s) → expand *Advanced AI chips* → 10 moves → MORE → the 2022 Nvidia 8-K
→ scrub to 2022 → NOW → China revenue share → table. Dead ends: clicking "21,000 TPP" (nothing);
hunting for a Print button (none — Cmd+P gives two clean A4 pages with a footer, exactly the handout I
wanted, but source links do not print); clicking a map percentage hoping for a citation (it jumps to a
chapter instead).

On the phone, search saved me: "Dutch" returned three dated events, a supplier and two chapter
sections. But the Contents sheet — very good, seven pages plus 17 chapters with scores — opens only
from the CONTENTS button inside the bottom specimen strip, and that strip hides when WebGL is
unavailable. With it hidden the sheet has no trigger at all, and BACK TO TOP still sits at
`bottom: 144px`, floating over the reading column (pol-07, pol-08).

## What I could not find

A date of currency outside the citation box. A badge legend. Any explanation of TPP on the board. What
"POLICY" means as a state. A verdict on whether the controls worked. My three numbers came easily —
Netherlands 100% of EUV, Nvidia's China share down to 9.1%, ASML's 48 scanners in 2025 at $200m — but
the fourth, Taiwan's 72%, I would not say aloud: `landscape.json` calls it "CHOKEPOINTS estimate, not
a published measurement… capacity by fab location", and that caveat reaches no reader anywhere.

## Ten changes, ranked

1. Link the jargon on the board to the glossary (TPP, FDPR, Entity List). **S**
2. Put "Updated 7 Sept 2026" in the masthead or footer. **S**
3. Legend under the board: one line per badge, including POLICY. **S**
4. Surface the "site estimate" caveat on hover and in the chapter. **S**
5. Print/Save button on Export Controls, and print the source URLs. **M**
6. Give `.to-top` a trigger tied to the strip's real presence. **S**
7. Non-WebGL fallback trigger for the Contents sheet. **M**
8. Link the board to chapter 17's "an export control is a licence requirement". **S**
9. Add a "Where the rules stand" paragraph at the top of the board — the count of flows shut, and one
   sentence on effect. **M**
10. On the map, mark which countries hold licensing jurisdiction, not only production. **M**

## The home map as a briefing tool

Each country's role reads instantly: a headline share, two more, the chokepoint cards, the towns. The
marker grammar (area = cards naming the country, heavier ring = a 5-of-5 stage) is honest and legible.
What it fails to say is jurisdiction. The Netherlands matters on my brief because The Hague licenses
ASML, not because ASML sits in Veldhoven, and the map cannot show that. Two additions would fix it: a
"who controls" toggle shading the four countries that write rules on this chain, and a line in each
panel reading "controls in force: 3 flows", linking to the board. Then the map would answer what the
subtitle promises, in the sense a policy reader means it.
