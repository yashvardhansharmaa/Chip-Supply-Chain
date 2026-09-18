# Sidenote

Direction key `sidenote`, port 8871, DevTools port 9371. Everything is in this folder: the restyled copy of `dist/` in `site/`, the override in `sidenote.css`, the script that rebuilds `site/index.html` from `dist/` (`inject.py`), a private copy of the capture script with WebGL on (`shoot.py`), and the captures (`01` home, `02` the Lithography chapter head, `02b` its chokepoint card, `03` Suppliers, `04` home on a phone, `05` home in the dark theme). No site source was touched.

## The direction

Classic book typography in the Tschichold and Tufte line, built for the screen. One family, EB Garamond, for everything: the running head, the titles, the text, the labels in its small caps, the ledes and links in its true italic. A pale neutral ground with the faintest warmth, not cream and not the Ledger white. A rich near-black ink. One color, a dark madder, used the way a printer used red: for links, for the chosen tab, for the current chapter number, for Extreme and Very hard, for the citation numbers, and for nothing else. No boxes, no fills, no shadows, no radius, and no second face anywhere.

The thing to remember is that the margin does the work. Every page has a left margin column, 140 px wide, and everything that is not the text lives there as a sidenote in small caps, set smaller and aligned to the paragraph it annotates: the chapter number and stage, the word count and specimen name, "In plain terms" and "In short", "Who leads" and "Where it is made", the figure titles, the fact numbers on the home page, and the sources. The sources are the fullest case: every citation keeps its small red number in the text, and the source itself (its number, title, publisher and date) floats into the margin beside the line that cites it, the way a Tufte sidenote does. The text block is one unbroken measure with nothing in it but text. The chokepoint card, which was a boxed dashboard, becomes a run of ruled paragraphs: a hairline above, a hairline between, the label in the margin, the value at the head of the line in the same 23 px the "In short" paragraph uses, the note running on after it in text size. The chain strip becomes a line of fifteen numerals, red for the Extreme stages, ink for High, the current one underlined and named. The specimen keeps its column and its running head ("Specimen 04 · Lithography", small caps, top left of the plate); its caption is set as a sidenote at the plate's foot, small, left-aligned, ragged. Everything sits on a 30 px baseline (20 px text, 1.5) with 7.5 px subdivisions: the lede on 37.5, the small text on 22.5, the sidenotes on 15, the titles on 60 and 75.

It suits a reference on chipmaking because its readers annotate for a living. Policy staff and researchers read with the sources in view, and the margin puts them there without a click. The subject is also a chain of counted things, and a numbered margin (Chapter 04, Fact 1, Source 3, stage 4 of 15) reads as an apparatus rather than a dashboard.

## Token sheet

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#f9f8f6` | `#17171a` | ground, a pale neutral with the faintest warmth |
| `--bg-3` | `#e8e6e1` | `#26262b` | land on the map |
| `--ink` | `#1b1b1f` | `#ebe9e5` | text, 16.2:1 on the ground |
| `--ink-2` | `#44454b` | `#c4c3be` | secondary text, 8.6:1 |
| `--muted` | `#63646a` | `#9d9ea4` | sidenotes, labels and captions, 5.6:1 (4.9:1 on `--bg-3`) |
| `--line` / `--line-2` | `#dcdad5` / `#c3c0ba` | `#2c2c31` / `#3e3e45` | hairlines |
| `--accent` | `#8a2839` | `#e6a0ab` | madder, 8.1:1 light and 8.5:1 dark, so it carries the 12 px citation numbers alone |
| `--accent-ink` | `#741f2f` | `#f0b4bd` | the darker pairing for hover |

Country colors `--c1` to `--c8` keep their hues (blue, orange, green, ochre, violet, red, dark green, gray: `#2f62b8 #d8641f #1f9a6d #c49a12 #5a48b0 #c0393a #2f7d2a #8a8f96`), desaturated a step to sit on the pale ground and lifted for the dark one. The specimen reads `--stage-ink: 27, 27, 31` and `--stage-accent: 138, 40, 57` (dark: `235, 233, 229` and `230, 160, 171`).

Font stacks (one family in all three slots; the fallbacks are the old-style serifs the OS ships):

- display: `"EB Garamond", "Iowan Old Style", "Palatino Linotype", Georgia, serif`, weight 400 only, sentence case
- body: the same, 20 px on a 30 px line, italic for ledes and the tagline
- labels and data (the `--font-mono` slot): the same, 13.5 px in small caps at 0.07 em tracking

Measure: `--measure: 31em` at 20 px, about 74 characters of Garamond. The text column is `--col: 61%` (was 58%) to pay for the margin; the margin is `--margin: 140px` with a 22 px gap and a 30 px edge, so the text block starts 192 px from the page edge. Masthead 60 px.

## What changed beyond tokens

- Masthead: solid ground, no blur; the wordmark in small caps at 23 px with the tagline as an italic running head; the tabs are small caps, the current one madder with no underline or fill; the icon buttons are square hairlines.
- The page: `.column` gains the margin as left padding; the wide pages (Suppliers, Export Controls, Glossary) take the same margin on both sides, so the atlas sits in a book page rather than filling the screen.
- Sidenotes: one rule positions every annotation (`position: absolute; left: -162px; width: 140px; text-align: right`) relative to the element it belongs to, which is given `position: relative`. The citation sidenotes are the link's `::after`, filled from its `aria-label` and floated left with `clear: left` into the margin, so they stack in reading order beside the lines that cite them; the number in the text stays.
- Home: the title at 66 px, the dek in italic, the reading-time line in the margin beside the title. "What the site covers" becomes five annotated lines under a rule: the section name in the margin, one line of text beside it, the whole line a link. The spine and its nodes are gone; each chapter's "Chapter 01 / Stage 1 of 15" sits in the margin beside its title, madder when current. The two facts are numbered "Fact 1", "Fact 2" in the margin with "source" as a small-caps link; "Who leads" and "Concentration" go to the margin; the score pips are dropped because the word "Extreme" already carries the score.
- Chapters: the chain strip is fifteen numerals with the bars hidden (color and weight carry the band; the `title` on each still names it); the tile becomes the margin's "Chapter / 04 / stage 4 of 15" with the number in madder at 34 px; the word count, specimen name and Copy link stack in the margin beside the lede; "In plain terms" and "In short" lose their box and rail for a margin label in madder; figures lose their box and put their title in the margin; the previous/next links are ruled lines; chapter sources are a margin label.
- The chokepoint card: the tags become plain text in madder; the KPI grid, the rows and the two status blocks are all restated as one column of ruled paragraphs with margin labels; country codes become small caps without their boxes.
- Data pages: titles in Garamond sentence case with italic deks; the atlas loses its border and fill, the countries are plain words with the pressed one underlined in madder, the stop cards and facts are set in the body face, the band words are red text rather than filled badges; tables, spec sheets, pickers, chips and buttons lose their radius and tinted fills.
- Dark theme: full token set, the same layout, madder lifted to a pale rose that clears 8.5:1.
- Phone: the margin folds back into the column and every sidenote becomes a small-caps line above its paragraph; the citation sidenotes are hidden and the inline numbers remain.

Checked beyond the captures: the card in full (`02b`), the sticky chain rail during a chapter scroll, the phone masthead and bottom specimen strip, the dark home.

## What would need real work to ship

- Google Fonts strips OpenType layout features from EB Garamond (tested `smcp`, `c2sc` and `onum`; the Fontsource mirror on jsDelivr strips them too), so every small cap on the page is synthesized by the browser from scaled capitals, and the figures are lining rather than old-style. It reads well at 13.5 px but the synthesized caps are a shade light. Shipping wants self-hosted EB Garamond with `smcp` and `onum` kept, which also gives the true old-style figures the direction asks for.
- The sidenotes are absolutely positioned against their paragraph, so a long label ("Why substitution is slow", "Specimen: EUV scanner") wraps to two or three lines in the 140 px margin and can run past a short paragraph. A built version should put the margin in a grid track and let the label and its paragraph share a row.
- The citation sidenotes are floats generated from `aria-label`, so their text is "Source 3: title · publisher · date" and cannot be styled in parts (the number is not red in the margin). Two citations in one line stack correctly, but a paragraph with five citations grows a margin taller than itself and the notes drift below it. Shipping should render the sidenote in the chapter template with a number, a title and a link, and clamp it.
- The chain strip encodes the concentration band in color and weight only; the bars are hidden. A shipped version should keep a second cue, for instance a small-caps "e" or "h" after the numeral, or restore a 2 px bar under it.
- Between 1100 and 1240 px the margin narrows to 118 px and the text block to about 560 px; a tighter step at 1000 px is wanted.
- The picker on AI Chips keeps the base stylesheet's light-blue and light-red tints for US and CN makers; on the Suppliers panel the fact rows keep the base's overlap between a year label and the next row's value.
- The print stylesheet and the share cards under `cards/` still carry the old tokens and faces.
