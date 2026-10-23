#!/usr/bin/env python3
"""Build qa/design2/review.html: the owner's review of design round two (23 Oct 2026).

Seven critics (ux, type, color, layout, dataviz, mobile, craft) and four combined systems.
One self-contained page: numbered decisions with shots, then the fixes made unless the owner
objects. Shots are embedded as JPEG data URLs. Run from the repo root: python3 qa/design2/make-review.py
"""
import base64, html, io, os
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SH = os.path.join(HERE, 'shots')
OUT = os.path.join(HERE, 'review.html')
total = 0
missing = []


def img(path, width=1100, crop=None):
    """A shot as a data URL, at most `width` px wide. crop = (top, bottom) in source px."""
    global total
    im = Image.open(os.path.join(SH, path)).convert('RGB')
    if crop:
        im = im.crop((0, crop[0], im.width, min(im.height, crop[1])))
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=78, optimize=True, progressive=True)
    total += buf.tell()
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode(), im.width


def fig(path, cap, width=1100, crop=None):
    if not os.path.exists(os.path.join(SH, path)):
        missing.append(path)
        return f'<figure><figcaption>{html.escape(cap)}</figcaption><p class="miss">Image to come.</p></figure>'
    src, w = img(path, width, crop)
    return f'<figure><figcaption>{html.escape(cap)}</figcaption><img loading="lazy" src="{src}" alt="{html.escape(cap)}" style="max-width:{w}px"></figure>'


def row(*figs, cls='pair'):
    return f'<div class="{cls}">' + ''.join(figs) + '</div>'


def two(a, b, ca='Now', cb='Proposed', width=1100, crop=None, cls='pair'):
    return row(fig(a, ca, width, crop), fig(b, cb, width, crop), cls=cls)


def phones(*items):
    """(path, caption) pairs side by side, phone screenshots."""
    return row(*[fig(p, c, 520, cr) for p, c, cr in items], cls='phones')


def one(path, cap, width=1100, crop=None):
    return row(fig(path, cap, width, crop), cls='one')


X, T, C, L, V, M, F, S = 'ux/', 'type/', 'color/', 'layout/', 'dataviz/', 'mobile/', 'craft/', 'systems/'
PH = (0, 1688)  # a full phone screen at 2x

# (title, body, options or None, recommendation, shots)
TD = T + 'directions/'
look = [
    ('The typefaces',
     'Five font families load today, 310 KB of font files. Fraunces sets the titles, Source Serif 4 the reading text and Instrument Sans the labels. Jost sets only the specimen caption, and IBM Plex Mono only some dates. The typography critic measured the reading text and found it well set: 18.5 px on generous leading, 75 to 79 characters a line, close to good university-press editions online. The faults are in the finish, and the type fixes in part four apply whichever direction you pick: no one-word last lines, no number split from its unit, no line starting with a comma after a glossary term, and small headings drawn at their own size. Each direction below is shown on today\'s colors, so only the type changes.',
     [('A', 'Ledger, refined', 'Fraunces, Source Serif 4 and Instrument Sans, as now. Jost and Plex Mono go: the specimen caption moves to Instrument Sans, and the dates take its even-width figures. 264 KB, and 4 font files in place of 8.'),
      ('B', 'Monograph', 'Literata for everything, like a university-press book: titles, text, tabs, labels and figures. Labels in spaced serif capitals, the specimen caption in italic. Made for long reading on screens, and it covers Cyrillic, Greek and Vietnamese. 154 KB. Its small labels are weaker in dense data rows.'),
      ('C', 'Newsroom', 'Archivo for everything, like a newspaper\'s graphics desk. Narrow bold titles, plain text at 17 px, every figure even-width. Its width axis lets long chart labels and table heads fit without a second family. 103 KB, a third of today. It reads as current affairs more than as a book.'),
      ('D', 'Datasheet', 'Source Code Pro, a monospace, for titles, labels and numbers, with Source Serif 4 for reading, like an engineering drawing. 190 KB. Monospace runs wide, so chart labels wrap and phone tabs shrink to 11 px. It looks best on a dark ground.')],
     'A. The serif reading voice suits a sourced reference that people study and cite, and A fixes the finish while cutting 46 KB. If you want a change, C: one family, a third of the bytes, and the best fit for the data pages.',
     one(TD + 'specimen-litho-open.png', 'The Lithography opener at full size: today, then A to D', 1736) +
     one(TD + 'specimen-litho-390.png', 'On a phone: today, A, B, C, D (left to right)', 2400) +
     one(TD + 'sheet-suppliers-1440.png', 'A data page: Suppliers in each direction', 1450) +
     one(TD + 'sheet-pdf-opener.png', 'The chapter PDF\'s first page in each direction', 2400) +
     one(T + 'p-caption-plate-1440-pair.png', 'A: the specimen caption moves from Jost to Instrument Sans (left now, right A)', 912)),
    ('The background and colors',
     'Today: warm paper, blue-black ink and one garnet red, the "ledger". The color critic found the identity right and its discipline weak: red now means four things, a country has two colors on two pages, and dark mode\'s red is a louder coral. Each direction below is shown on today\'s typefaces, on the home page, a chapter, a chart, Suppliers, a phone and the other theme.',
     [('A', 'Ledger, refined', 'Today\'s paper, ink and garnet, with red given one meaning (decision 5), one color per country, and dark mode rebuilt on garnet\'s own hue. The favicon, cards and PDFs keep their look.'),
      ('B', 'Drafting film', 'A pale blue-gray ground, graphite ink and a cobalt accent, like blueprint film. Clean and technical, but it gives up the paper\'s warmth. The favicon tile turns cobalt, and Japan takes crimson because blue becomes the accent.'),
      ('C', 'Yellow room', 'Dark first: a warm graphite ground, paper-white text and an amber accent, after the amber light in a fab\'s lithography bays. The most atmospheric. Amber prints as light gray, so the PDFs and cards must stay light and stop matching the site.'),
      ('D', 'Black and white', 'An off-white ground and black ink with no color in the frame: links, tabs and focus are ink, and one vermilion marks only the data. Rigorous, like a statistics bulletin, and the coldest of the four.')],
     'A. Every fault the critic found is one of meaning or execution, and A fixes them at no cost to the favicon, cards or PDFs. B is the credible alternative, and it pairs best with typeface C.',
     row(fig(C + 'directions/sheet-d0-current.png', 'Today', 1456), fig(C + 'directions/sheet-d1-ledger-refined.png', 'A. Ledger, refined', 1456)) +
     row(fig(C + 'directions/sheet-d2-drafting-film.png', 'B. Drafting film', 1456), fig(C + 'directions/sheet-d3-yellow-room.png', 'C. Yellow room', 1456)) +
     row(fig(C + 'directions/sheet-d4-black-white-data.png', 'D. Black and white', 1456), fig(C + 'identity/tiles-all-directions.png', 'The favicon tile in each direction, on light and dark tab bars', 1180))),
    ('The default theme',
     'Today everyone starts on light, and dark is one button away. You opened this again.',
     [('A', 'Light for everyone', 'As now. The PDFs, cards and specimens are drawn as ink on paper, so the site and its printouts look alike.'),
      ('B', 'Follow the device', 'A reader whose phone is set to dark starts on dark. The button still wins. This needs the rebuilt dark red and warmer dark text (in the fixes) to look designed and not inverted.'),
      ('C', 'Dark for everyone', 'Only with colors C, the Yellow room.')],
     'A. Both critics recommend it. B is safe once the dark fixes land, if you prefer it.',
     one(C + 'proofs/p1-dark-accent-home-before-after.png', 'Dark mode now (left) and with the fixes (right): the red is garnet\'s own hue and the text one warm white', 1040)),
    ('How charts use color',
     'Today the largest bar or segment is garnet and the other segments take the site\'s hues in order. On three charts the largest is the wrong thing to mark: chapter 2 paints the 98 percent of polysilicon that goes to solar panels, when the point is the 2 percent that goes into chips. Chapter 15 paints the high case of a projection. Chapter 17 paints one of eight bars that are really four firms at two dates.',
     [('A', 'Today\'s rule, with an override', 'The largest stays garnet and the colors stay. A chart can name its point when the largest is the wrong one (three charts today).'),
      ('B', 'Red on the point, grays for the rest', 'Every chart marks the one thing it shows, and the other segments alternate two grays. Calm and clear in print, but close to the all-gray charts you found too dull on 21 October.'),
      ('C', 'One red and a gray ramp', 'From colors D. The cleanest, but segments past three are hard to tell apart.')],
     'A. It keeps the colors you chose and fixes the three wrong marks. Either way the gray bars beside the red get lighter, so the red survives grayscale print and colorblind readers (in the fixes).',
     two(V + 'd1-polysilicon-grade-before-1440.png', V + 'd1-polysilicon-grade-after-1440.png', 'Chapter 2 now: red on solar grade', 'With the chart\'s point named: red on the 2 percent', 1100, (0, 300)) +
     two(V + 'd1-pc-share-before-1440.png', V + 'd1-pc-share-after-1440.png', 'A stacked bar now (A)', 'The same bar under B', 1100) +
     one(C + 'directions/charts-all-directions-color-over-gray.png', 'Three chapter 4 charts in each color system, in color (top) and printed in grayscale (bottom)', 1400)),
    ('Red means one thing',
     'Garnet marks Extreme, Critical and the largest value. China wears a second red, and in dark mode the two reds are the same color, so on the Suppliers ribbons "Critical firms" and "China" share one swatch. Giving one country the alarm color is also a framing choice a global site avoids. The change: China takes a teal, Japan and South Korea get colors that are easy to tell apart, the home glance list marks each Extreme row once (the meter and the word, and the number stays gray), and the atlas shows a chosen country in ink.',
     None,
     'Yes. Every country is labeled on every chart, so nothing depends on the color alone.',
     row(fig(C + 'proofs/p1-onered-pipe-light-before-over-after.png', 'Suppliers ribbons. Top: now. Bottom: proposed.', 660),
         fig(C + 'proofs/p1-onered-controls-pair.png', 'Export Controls, light and dark. Before, then after.', 581), cls='pair') +
     one(C + 'proofs/p2-glance-one-red-before-after.png', 'The home glance list now (left) and proposed (right)', 932)),
]

structure = [
    ('The Chain: one long page, or one chapter at a time',
     'The Chain is one page 185 screens tall on a laptop and 286 on a phone, so the scrollbar is about 3 px tall. Its address does not follow the reader, so a reload or a new sitting loses the place. The walk on Home already keeps it.',
     [('A', 'One page, with a memory', 'The address follows the section being read, so a reload or a shared link returns there. A "Continue reading" line under The Chain\'s title names the last chapter and section read. The phone Contents sheet marks the chapter and lists its sections. Printing and Cmd-F over all chapters work as now.'),
      ('B', 'One chapter per view', 'The Chain tab opens the contents, and each chapter shows alone at its own address and ends on Next, its sources and the footer. This is how online textbooks and the static pages work. A larger change: the router, the specimen strip and print all need work.')],
     'A now. It carries over to B unchanged, so B can be decided later with A in place.',
     two(X + 'pD-before-chain-landing-1440.png', X + 'pD-after-chain-landing-1440.png', 'The Chain now', 'A: Continue reading under the title', 1100) +
     two(X + 'pM-before-end-1440.png', X + 'pM-after-end-1440.png', 'Chapter 4\'s end now: chapter 5 starts below', 'B: the chapter ends on Next and the footer', 1100)),
    ('Home names its two ways in',
     'The first screen says what the site is but not where to start. The line under the title counts paragraphs and words. The proposal replaces it with "Start reading, about 11 min" (the walk below) and "The full chain, in 17 chapters". The glance list keeps its links.',
     None, 'Yes.',
     two(X + 'pE-before-home-first-1440.png', X + 'pE-after-home-first-1440.png', 'Now', 'Proposed', 1100, (0, 620))),
    ('Phones: the bars while reading',
     'On a phone the top bar and the specimen strip take 198 px of every screen, 23 percent at 390 px. The strip\'s caption stops mid-sentence after three lines.',
     [('A', 'Keep both bars', 'As now.'),
      ('B', 'A slim strip', 'The strip drops to 72 px. The caption shows when the specimen is expanded.'),
      ('C', 'The bars step aside', 'Scrolling down slides both bars away, and any scroll up brings them back, as in the Economist\'s, FT\'s and Guardian\'s apps. A thin red line at the top shows progress through the chapter. The caption is untouched when the strip shows.')],
     'C. It gives the reader the whole screen for 15 to 21 screens of prose and leaves the caption as you set it.',
     phones((M + 'p2-2-strip-before.png', 'A. Now', PH), (M + 'p2-2-strip-optionA-slim.png', 'B. Slim strip', PH), (M + 'p2-2-strip-optionB-away.png', 'C. Bars step aside', PH))),
    ('Phones: a shorter chapter opener',
     'On a phone the first paragraph of a chapter starts four screens down. The chokepoint card alone is 1,564 px in Lithography, because its three ratings stack and each repeats the definition its glossary term already gives.',
     [('A', 'Ratings in a row, the rest folded', 'The three ratings sit side by side, and Who leads, Where it is made and the status lines fold under "The whole card". The card goes from 1,564 to 196 px. Laptops and the PDF keep the whole card open.'),
      ('B', 'Ratings in a row only', 'Nothing folds. Saves about 330 px per chapter.')],
     'A. The card stays one tap away, and the reading starts 1.6 screens sooner.',
     phones((M + 'p2-3-opener-before.png', 'Now', PH), (M + 'p2-3-opener-after.png', 'A', PH))),
    ('Phones: comparing chips',
     'On a phone the AI Chips table is 861 px wide inside a 354 px box, so a reader sees one chip at a time and swipes back and forth.',
     [('A', 'Chips side by side', 'Each spec\'s name moves above its values, and the chips sit in equal columns. The Comparing bar becomes the column header.'),
      ('B', 'One spec at a time, read down', 'Each spec lists one line per chip, with its value and a full-width meter, so the values being compared sit in one column.')],
     'B. The meters line up, and it reads the same with two chips or four. A\'s columns get narrow with four chips.',
     phones((M + 'p1-3-chips-2-before.png', 'Now', PH), (M + 'p1-3-chips-2-after.png', 'A. Side by side', PH), (V + 'd3-chips-phone-after-390.png', 'B. Read down', PH))),
    ('Wide screens: a frame',
     'Past 1440 px the page stretches. At 2560 px there are 768 px of empty paper between the text and the specimen. The proposal keeps the text column at its 1440 width, gives the specimen the extra room, and past 1920 px centers the whole page in a 1920 px frame. Nothing changes at 1440 or below.',
     None, 'Yes. Many policy staff and engineers read on large monitors.',
     two(L + 's1-frame-litho-2560-before.png', L + 's1-frame-litho-2560-after.png', 'A 2560 px screen now', 'Proposed', 1100)),
    ('The Chain\'s contents on the ledger',
     'The Chain page has two left edges: its title and contents start at 43 px, its chapters at 159 px. The proposal puts the head and contents on the chapters\' edge, with each chapter number in the left column, as on the home page. The contents become one ruled list, about 300 px taller.',
     None, 'Yes.',
     two(L + 'p2-chain-ledger-1440-before.png', L + 'p2-chain-ledger-1440-after.png', 'Now', 'Proposed', 1100, (0, 1100))),
    ('Animations: a play button and a timeline',
     'Nothing shows that an animation can be paused, how long a step lasts or how far it has run. The "Paused" badge sits on the drawing\'s own labels. The proposal adds a square play and pause button like the specimen\'s, and turns the step names into a timeline: each step\'s width is its share of the film, and the current one fills in red as it plays. On a phone the row fits one line.',
     None, 'Yes.',
     two(F + 'anim-litho-1440-paused.png', F + 'anim-litho-1440-after-paused.png', 'Now', 'Proposed', 1100) +
     one(F + 'anim-litho-390-playing-before-vs-after.png', 'On a phone: now (left), proposed (right)', 1100)),
    ('Specimens sway instead of turning a full circle',
     'Each 3D specimen turns a full circle about every 78 seconds, so for part of each turn it stands edge-on or faces away. For about half the turn the EUV scanner contradicts its caption ("plasma at bottom left"). The proposal sways it about 26 degrees either side of its opening view. Plan views such as the wafer keep turning.',
     None, 'Yes.',
     one(F + 'spec-litho-idle-before-0-54s.png', 'Now: a frame every 6 seconds', 1400) +
     one(F + 'spec-litho-idle-after-sway-0-27s.png', 'Proposed: a frame every 3 seconds', 1400)),
    ('Share cards built on the center line',
     'When a chapter link is shared in a chat app or as a square thumbnail, the card is cropped and the title is cut ("graphy"). The home card was rebuilt on its center line on 1 October for this reason. The proposal does the same for the 17 chapter cards and the 6 page cards: wordmark, title and ratings centered over a faint specimen.',
     None, 'Yes. The cost is that the specimen becomes a background at full size.',
     one(F + 'cards-centerline-before-after.png', 'Now (left) and proposed (right), each as a link preview and a small square crop', 1100)),
    ('Ranges drawn as ranges',
     'Chapter 15 draws the low, reference and high cases of the 2030 projection as three bars, and red falls on the high case as if it were the finding. Chapter 17 draws four firms at two dates as eight bars. The proposal draws a range as one bar: solid to the low value, lighter to the high one, a notch at the middle case. The four firms become four rows, each showing the drop from its peak.',
     None, 'Yes.',
     two(V + 'd1-us-dc-electricity-before-1440.png', V + 'd1-us-dc-electricity-after-1440.png', 'Chapter 15 now', 'Proposed', 1100) +
     two(V + 'd2-pairs-before-1440.png', V + 'd2-pairs-after-1440.png', 'Chapter 17 now', 'Proposed', 1100)),
    ('Suppliers: each stage links to its chapter',
     'The ladder\'s rows say "6 firms, 2 critical" but give no way to the chapter or its rating. The proposal adds "Chapter 04 · Extreme concentration" to each row and labels the big number as a count of firms, which today reads like a chapter number.',
     [('A', 'Link and rating', 'As shown.'), ('B', 'Link only', 'No rating, so the row shows one scale only.')],
     'A.',
     two(X + 'pK-before-suppliers-ladder-1440.png', X + 'pK-after-suppliers-ladder-1440.png', 'Now', 'Proposed', 1100, (0, 700))),
]

small = [
    ('Note numbers after the punctuation', 'Book and journal practice puts the note number after the period or comma ("light.¹"), and 1,415 of 1,514 marks stand before it today. The space beside each mark also tightens.', 'Yes.',
     one(T + 'p-notemark-pair.png', 'Now (left) and proposed (right)', 1400)),
    ('One short form for money in short fields', 'Card notes and the summary PDF spell billions three ways ("$16.7B", "$5.8bn", "$175 billion"). Running text would keep "billion", "million" and "percent". Short fields (card notes, chart values, tables) would use one form: "$5.8B", "$293M", "84%". The figures do not change.', 'Yes.', ''),
    ('AI Chips: the three speed rows share one scale', 'FP16, FP8 and FP4 speeds are in the same unit, yet each row fills its own meter, so halving the bits shows no gain, which is the point the page explains. "Logic dies" loses its meter, since more dies is not better.', 'Yes.',
     two(V + 'p3-speedscale-before-1440.png', V + 'p3-speedscale-after-1440.png', 'Now', 'Proposed', 1100)),
    ('Phones: Next comes first at a chapter\'s end', 'Previous sits above Next. A reader going front to back wants Next, so it moves up and grows. Screen readers keep the order.', 'Yes.',
     phones((X + 'pJ-before-chapter-end-390.png', 'Now', (0, 1100)), (X + 'pJ-after-chapter-end-390.png', 'Proposed', (0, 1100)))),
    ('Export Controls: rename the two views', '"By subject" and "By date" read like two sorts of one list, so phone readers never find the board. The views become "The board" and "Timeline", and each year in the timeline links to the board at the end of that year.', 'Yes.',
     phones((X + 'pB-before-controls-phone-390.png', 'Now', PH), (X + 'pB-after-controls-phone-390.png', 'Proposed', PH))),
]

fixes = [
    ('Reading and type', [
        'A glossary term keeps its comma or period, so no line starts with punctuation on a phone (9 at 390 px today).',
        'A number never splits from its unit at a line end ("3 / nm"): 166 splits at 390 px today, 0 after.',
        'Paragraphs no longer end on one word (53 of 456 at 1440 px today, 4 after).',
        'Number ranges outside tables take an en dash ("$350–400M"), as decided for tables in round one.',
        'Small headings in Fraunces use its text drawing, so they no longer look pinched beside the body text.',
        'Long figure titles keep their first sentence as the title, and the caveats move to a quiet note below.',
     ], [two(T + 'p-glpunct-320-pair.png', T + 'p-runt-plain-1440-pair.png', 'Punctuation after a term, before and after', 'One-word last lines, before and after', 980),
         one(V + 'p2-titlenote-before-1440.png', 'A figure title today', 1100)]),
    ('Color and charts', [
        'The gray bars beside the red one get lighter, so the red survives grayscale printing and red-green colorblindness (they measure 1.01:1 today).',
        'A country has one color everywhere: the chapter charts paint Japan yellow and the US blue, while Suppliers paints Japan blue and the US ink.',
        'Japan and South Korea, and the Netherlands and Germany, get colors that are easy to tell apart, checked for colorblind readers.',
        'Dark mode: its red is rebuilt on garnet\'s hue (contrast up from 5.05:1 to 6.0:1), and the gray text is warmed to match the white.',
        'Dark mode: the Critical swatch in the ribbons legend matches its threads.',
        'China revenue panels: each year label sits under its own bar (Advantest\'s is three years off today), the rows line up, and the 126 bar links leave the Tab order (the table below has the same links).',
        'The Export Controls year strip puts red on the busiest year. Today it marks the selected year, which already has a frame.',
     ], [two(V + 'p1-barcontrast-gray-before-1440.png', V + 'p1-barcontrast-gray-after-1440.png', 'Printed in grayscale now', 'After', 1100),
         one(C + 'proofs/p1-country-stack-before-over-after.png', 'Chapter 4 by region. Top: now. Bottom: the Suppliers colors.', 576)]),
    ('Layout', [
        'The static pages\' masthead fits one row on a phone (127 px tall today, with "Glossary" alone on a row). Three critics found this.',
        'The masthead, the page and the static pages share one left and right edge at every width.',
        'The spacing scale is used: 32 px between the blocks of a chapter head, 48 px before the text and before the end, 32 px around figures (eleven different gaps today). Screen only, so the PDFs keep their spacing.',
        'The home glance list stops at the text\'s measure, and the Suppliers atlas keeps the page edge with its stops in rows of five.',
     ], [one(L + 'p1-static-masthead-zoom.png', 'Static page mastheads at 390, 360 and 320 px. Left: now. Right: fixed.', 1400)]),
    ('Phones', [
        'The Suppliers search box and selects use 16 px type, so iOS no longer zooms the page when they are tapped.',
        'A phone on its side gets one 44 px top bar and a 48 px strip: six lines of text become nine.',
        'The Contents sheet rises over a dimmed page, closes with a 44 px button or a tap outside, marks the chapter being read and lists its sections.',
        'The strip\'s buttons clear the iPhone\'s home bar.',
        'All five tabs fit at 320 px.',
     ], [phones((M + 'p2-1-sheet-before.png', 'Contents now', PH), (M + 'p2-1-sheet-after.png', 'Fixed', PH)),
         two(M + 'p1-2-landscape-before.png', M + 'p1-2-landscape-after.png', 'A phone on its side now', 'Fixed', 1100)]),
    ('Finding your way', [
        'Export Controls: picking a year moves the timeline to that year, so the next scroll no longer snaps the board back to 2018.',
        'A 404 page in the site\'s own frame, listing the 17 chapters (a mistyped address shows GitHub\'s blank page today). Two critics found this.',
        'Guessed addresses work: #/chips opens AI Chips, #/summary opens the Summary, #/lithography opens the chapter. Anything else shows Home with one line saying nothing was found.',
        'An AI Chips comparison has its own address, so it survives a reload and can be shared. Its foundry, package and memory rows link to their chapters and suppliers.',
        'Site search finds the 59 figures ("hbm revenue" finds the chart and its source).',
        'Browser tabs name the page first, and The Chain\'s tab follows the chapter being read (all 17 read "Chip Supply Chain · The Chain" today).',
     ], [two(X + 'pA-before-2-scroll-1440.png', X + 'pA-after-2-scroll-1440.png', 'Pick 2023, scroll once: the board is back at 2018', 'Fixed', 1100),
         two(F + '404-1440-after.png', X + 'pH-after-search-hbm-revenue-1440.png', 'The 404 page', 'Search finds the figure', 1100)]),
    ('Motion and finish', [
        'With reduced motion on, an animation\'s step and caption match its still, which shows the last step (all 15 show the first step\'s words today).',
        'Source and term cards open over the text column and no longer cover the left column.',
        'Search uses the site\'s own clear button (Chrome\'s blue × today), marks where each result matched, and fades the cut-off last row.',
        'Buttons and tabs show a pressed state when tapped, without the gray rounded flash iOS adds.',
        'The 174-page book gets bookmarks for every chapter, and every PDF names its author and the site in place of a browser\'s name.',
     ], [one(F + 'pop-cite-hover-1440-before-over-after.png', 'A source card. Top: now, over the left column. Bottom: fixed.', 900),
         one(F + 'search-euv-before-after-light-dark.png', 'Search for "euv". Left: now. Right: fixed. Light above, dark below.', 1100)]),
]

later = [
    'The Suppliers ribbons are still the weakest chart on the site. The best replacement, one row per stage split by country, needs a real prototype first.',
    'Export Controls by date is 24 screens on a phone. A row of years under the filters would let a reader jump.',
    'A tablet held upright gets the phone layout stretched. The laptop\'s side specimen could start at 768 px.',
    'Self-hosting the fonts would give true small caps for ASML, EUV and TSMC, and real superior note numbers. It is already on the code review\'s later list.',
]

css = """
:root{--bg:#f7f6f2;--card:#fff;--ink:#14181f;--ink2:#3b424c;--mute:#5c636d;--line:#e2dfd8;--garnet:#7a1f2b;--tint:#f3ecea;--opt:#efede7}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#12151a;--card:#191d23;--ink:#ecebe6;--ink2:#c9c6bf;--mute:#9b988f;--line:#2b3038;--garnet:#e0767e;--tint:#241a1c;--opt:#1b1f25;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#12151a;--card:#191d23;--ink:#ecebe6;--ink2:#c9c6bf;--mute:#9b988f;--line:#2b3038;--garnet:#e0767e;--tint:#241a1c;--opt:#1b1f25;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.55 "Source Serif 4",Georgia,serif}
.wrap{max-width:1240px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:0 80px}
header{padding:40px 0 10px;border-bottom:1px solid var(--ink)}
.kicker{font:600 12px/1.3 "Instrument Sans",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--garnet);margin:0 0 12px}
h1{font:500 clamp(30px,4vw,44px)/1.08 "Fraunces",Georgia,serif;margin:0 0 12px;letter-spacing:-.01em;text-wrap:balance}
.lede{max-width:46em;color:var(--ink2);margin:0 0 14px}
.how{max-width:46em;background:var(--tint);border-left:3px solid var(--garnet);padding:12px 16px;margin:18px 0 8px}
.how p{margin:0}
h2{font:500 28px/1.15 "Fraunces",Georgia,serif;margin:50px 0 4px;padding-top:14px;border-top:1px solid var(--line)}
h2 + p{color:var(--mute);margin:0 0 10px;max-width:46em}
.dec{display:grid;grid-template-columns:52px minmax(0,1fr);column-gap:14px;padding:26px 0 8px;border-bottom:1px solid var(--line)}
.dec .n{font:400 40px/1 "Fraunces",Georgia,serif;color:var(--garnet);text-align:right;font-variant-numeric:lining-nums}
.dec h3{font:600 21px/1.25 "Source Serif 4",Georgia,serif;margin:2px 0 8px;text-wrap:balance}
.dec p{margin:0 0 10px;max-width:46em;text-wrap:pretty}
.opts{list-style:none;margin:4px 0 12px;padding:0;max-width:52em;display:grid;gap:8px}
.opts li{display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px;background:var(--opt);padding:10px 14px 11px 10px}
.opts .k{font:600 15px/1.5 "Instrument Sans",system-ui,sans-serif;color:var(--garnet);text-align:center}
.opts b{font-weight:600}
.rec{font:500 14.5px/1.45 "Instrument Sans",system-ui,sans-serif;color:var(--ink)}
.rec b{color:var(--garnet);font-weight:600;letter-spacing:.04em;text-transform:uppercase;font-size:12px;margin-right:6px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:10px 0 16px;align-items:start}
.phones{display:flex;flex-wrap:wrap;gap:14px;margin:10px 0 16px;align-items:flex-start}
.phones figure{flex:0 1 300px}
.one{margin:10px 0 16px}
figure{margin:0;min-width:0}
figcaption{font:600 11.5px/1.35 "Instrument Sans",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin:0 0 6px}
figure img{display:block;width:100%;height:auto;border:1px solid var(--line);background:#fff}
.miss{border:1px dashed var(--line);padding:30px;color:var(--mute);margin:0}
.fx{padding:10px 0 6px;border-bottom:1px solid var(--line)}
.fx h3{font:600 13px/1 "Instrument Sans",system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;margin:16px 0 8px;color:var(--ink2)}
.fx ul{margin:0 0 12px;padding-left:20px;max-width:50em}
.fx li{margin:0 0 5px}
.next{max-width:46em}
.next li{margin:0 0 6px}
code{font-size:.9em}
figure img{cursor:zoom-in}
.zoom{position:fixed;inset:0;z-index:9;background:var(--bg);overflow:auto;cursor:zoom-out;padding:16px}
.zoom img{display:block;max-width:none;margin:0 auto;border:1px solid var(--line)}
.tip{font:500 13px/1.4 "Instrument Sans",system-ui,sans-serif;color:var(--mute);margin:8px 0 0}
.pairings{padding:24px 0 8px 66px;border-bottom:1px solid var(--line)}
.pairings h3{font:600 21px/1.25 "Source Serif 4",Georgia,serif;margin:0 0 8px}
.pairings p{margin:0 0 10px;max-width:46em}
@media (max-width:700px){.pairings{padding-left:44px}}
@media (max-width:700px){.pair{grid-template-columns:1fr}.dec{grid-template-columns:34px minmax(0,1fr);column-gap:10px}.dec .n{font-size:30px}.phones figure{flex:1 1 140px}}
"""


def decision(i, title, body, opts, rec, shots):
    o = ''
    if opts:
        o = '<ul class="opts">' + ''.join(f'<li><span class="k">{k}</span><span><b>{html.escape(t)}.</b> {html.escape(d)}</span></li>' for k, t, d in opts) + '</ul>'
    return (f'<section class="dec" id="d{i}"><div class="n">{i}</div><div><h3>{html.escape(title)}</h3><p>{html.escape(body)}</p>{o}'
            f'<p class="rec"><b>Recommend</b>{html.escape(rec)}</p>{shots}</div></section>')


pairings = ('<section class="pairings"><h3>How they pair</h3><p>Any typeface works with any color. The two critics named four pairings that fit best, shown here as complete looks on the same screens. To take one, give its two letters, typefaces first: Ledger refined is A and A, Drafting film is C and B, Yellow room is D and C, Bulletin is B and D.</p>' +
            one(S + 'compare-litho-open.png', 'The Lithography chapter in each pairing: Ledger refined top left, Drafting film top right, Yellow room bottom left, Bulletin bottom right', 2200) +
            one(S + 'sheet-ledger-refined.png', 'Ledger, refined (A and A): home, chapter, chart, Suppliers, phone and the other theme', 2000) +
            one(S + 'sheet-drafting-film.png', 'Drafting film (C and B): the same screens', 2000) +
            one(S + 'sheet-yellow-room.png', 'Yellow room (D and C): the same screens', 2000) +
            one(S + 'sheet-bulletin.png', 'Bulletin (B and D): the same screens', 2000) + '</section>')

n = 0
look_html, struct_html, small_html = [], [], []
for t, b, o, r, s in look:
    n += 1; look_html.append(decision(n, t, b, o, r, s))
    if n == 2:
        look_html.append(pairings)
first_struct = n + 1
for t, b, o, r, s in structure:
    n += 1; struct_html.append(decision(n, t, b, o, r, s))
first_small = n + 1
for t, b, r, s in small:
    n += 1; small_html.append(decision(n, t, b, None, r, s))
fix_html = []
for head, items, shots in fixes:
    fix_html.append(f'<div class="fx"><h3>{html.escape(head)}</h3><ul>' + ''.join(f'<li>{html.escape(x)}</li>' for x in items) + '</ul>' + ''.join(shots) + '</div>')

page = f"""<title>Design Round Two</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Instrument+Sans:wght@500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap">
<style>{css}</style><div class="wrap">
<header><p class="kicker">Chip Supply Chain · design review two · 23 October 2026</p>
<h1>What seven designers would change</h1>
<p class="lede">Seven critics each took one discipline across the whole site: user experience, typography, color, layout, charts, phones, and motion and finish. The typography and color critics also built alternative looks, paired here into four complete systems. Every proposal was proved on real screenshots, now and proposed. Nothing has been built yet. The full reports are in <code>qa/design2/</code>.</p>
<div class="how"><p><b>How to answer.</b> {n} numbered decisions, each with my recommendation. Reply with something like "all as recommended, but C on 1, B on 2 and no on 13". Decisions {first_small} to {n} are small, so answer them only if you disagree. The fixes at the end will be made unless you object to one.</p></div>
<p class="tip">Click any picture to see it at full size. Click again or press Escape to close.</p>
</header>
<h2>Part one: the look</h2>
<p>Typefaces, then background and color, then how they pair. These shape every page, so they come first.</p>
{''.join(look_html)}
<h2>Part two: how pages work</h2>
<p>Changes to structure and behavior. Each one keeps the look you pick above.</p>
{''.join(struct_html)}
<h2>Part three: smaller calls</h2>
<p>Each has a default. Say no to any you would rather keep as it is.</p>
{''.join(small_html)}
<h2>Part four: fixes I will make</h2>
<p>Errors and clear improvements that keep every choice above. A few pictures per group as examples. Every item has its own before and after in the reports.</p>
{''.join(fix_html)}
<h2>Noted for later</h2>
<p>Found by the critics, but not proved yet, so not proposed.</p>
<ul class="next">{''.join(f'<li>{html.escape(x)}</li>' for x in later)}</ul>
<h2>How it gets built</h2>
<ol class="next">
<li>The speed fixes from the code review land first. The accessibility fixes are already done.</li>
<li>Builders by file ownership: the look (tokens and fonts, cards, PDFs), chapters and charts, the data pages, and phones with the frame.</li>
<li>A check at 320, 390, 1024, 1440 and 2560 px, light and dark, with every PDF and share card rendered again.</li>
<li>A review page of the finished result, and the push only when you say so.</li>
</ol>
</div>
<script>
document.addEventListener('click', function (e) {{
  var z = document.querySelector('.zoom'); if (z) {{ z.remove(); return; }}
  var i = e.target.closest('figure img'); if (!i) return;
  var d = document.createElement('div'); d.className = 'zoom';
  var c = new Image(); c.src = i.src; c.alt = i.alt; d.appendChild(c); document.body.appendChild(d);
}});
document.addEventListener('keydown', function (e) {{ var z = document.querySelector('.zoom'); if (e.key === 'Escape' && z) z.remove(); }});
</script>"""

open(OUT, 'w').write(page)
print(f'wrote {OUT}: {len(page)/1e6:.2f} MB, images {total/1e6:.2f} MB, {n} decisions; missing: {missing}')
