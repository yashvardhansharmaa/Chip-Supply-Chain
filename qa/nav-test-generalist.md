# Nav test: the curious generalist

Engineer who googled "how are GPUs made" after a story about Nvidia and China. Never heard of a
fab, a wafer or an ECCN. Phone (375 px), then laptop.

## Verdict

The writing is the best thing here, and not what the home page sells. The Intro is what I came
for — "HOW A GPU IS MADE", seven minutes, a plain paragraph a stage — one tap away. But the first
screen is a map answering a question I did not have yet, with both doors below it.
The vocabulary help points the wrong way: deep chapters gloss every term on tap, the beginner's
Intro has none. Search is the strongest feature. Fix the first screen and the phone tabs and this
works for me.

## Questions on each page

**Home.** *What is a "chokepoint"?* Used four times here, defined nowhere here; the glossary entry
and the 1–5 score are a page away. *Where do I start?* Not answered above the fold. *What do the
circles mean?* By a legend below the country chips — on the phone, past the whole Taiwan panel: the
key to a map I had already left.

**Intro.** *Jargon-free?* Mostly: wafer, photomask and photoresist each get an explaining
sentence. The acronyms do not — HBM3E, NVL72, ASIC, CoWoS, gate-all-around — and none is tappable.

**The Chain.** *What is 4/5?* Answered up top under "How to read a chapter": 1 means many
substitutes, 5 a single point of failure. That box belongs where the badge first appears.

**Country panels.** *Why can't China make its own?* One click, better than the news story: "No EUV
scanner has ever been sold to a customer in China." *The Netherlands?* One click: 100% of EUV
tools, "the hardest single chokepoint in the chain."

## Paths I took

Home → "Intro": one tap, right answer. Intro → "Read the chapter" lands correctly deep inside The
Chain, a 169,642-px page on the phone. Home → chips CN, NL, US: one click each, excellent.
"AI Chips" opens on "B200: 2 logic dies and 8 HBM3E stacks on CoWoS-L": the friendliest-sounding
tab is the most technical page, so I backed out. "/" and the magnifier both open search;
"netherlands", "nvidia" and "ECCN" land, "most important company" returned noise.

**Surprises.** On the phone, Glossary and Sources sit off the right edge of the tab strip; it
scrolls, but nothing says so, and Glossary is the one I needed most. Nothing in the nav or the
Contents sheet goes home — the only route back is the wordmark, unstyled as a link. "BACK TO TOP"
sits on the body text, covering a line of every chapter I read. The Contents sheet is the site's
best navigation, and it hides behind a strip that vanishes without WebGL.

## What I could not find

A one-line answer to "which company matters most": Suppliers implies it by sorting stages
thinnest-first, never states it. And "chokepoint", defined anywhere reachable from the home page.

## Ten changes, ranked

1. "Start here: how a GPU is made, 7 min" button in the hero, above the map. **S**
2. Rename the "Intro" tab to what its page says — "How it's made". **S**
3. Phone tabs: a scroll fade, or five tabs plus "More", so Glossary shows. **S**
4. Add Home/Map to the nav and the Contents sheet. **S**
5. Glossary links in the Intro and country panels — the mechanism fires 244 times in the
   chapters, 0 here. **M**
6. Define "chokepoint" on the home page. **S**
7. Move "BACK TO TOP" out of the phone reading column. **S**
8. Encode criticality on the map, not mention counts. **M/L**
9. A phone Contents control that survives no-WebGL. **S/M**
10. "AI Chips": rename to "Compare chips", or open with a plain sentence. **S**

## The home page and its world map

It tells me which countries are in the chain, how many of the 17 cards name each (bubble area),
which are named by a 5-of-5 stage (heavier ring), and where the 19 chokepoint towns sit. Clicking a
country is rewarding.

It fails at what I wanted: what each country *does*. Area encodes mentions, so Japan (15) and the
US (16) loom over the Netherlands (6), while the site's own text says the Dutch hold the hardest
chokepoint in the chain — the map ranks countries against its own argument. It also opens on Taiwan
unexplained, puts its legend below the chips on the phone, and its town pins are about 6 px.

What would fix it: size by criticality, not mentions; print a two-word role on each bubble ("prints
the circuits", "makes the wafers") so it teaches without a click; move the legend beside the map;
and put it second, after a start button.
