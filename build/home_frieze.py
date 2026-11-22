#!/usr/bin/env python3
"""Redraw the home card's row of stage drawings (build/assets/home-card/card.html) from build/assets/cards-art/, the plates'
drawings (21 Nov 2026, node build/plate-card-art.js), with the layout of the generator that made the card
(qa/design3/cards/chain/build.py in the main checkout): each drawing about 62 x 62 px, none over 100 px, its weight evened out
against the others and a little darkened, the row spread from x = 56 to 1144. Only the row's <img> tags change; the card's
words, wordmark and shelf stay as they are. build/cards.py copies the same row onto the view cards (home_row), so run this
first, then python3 build/home_card.py and python3 build/cards.py.

usage: python3 build/home_frieze.py"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.argv = [sys.argv[0]]; sys.path.insert(0, os.path.join(ROOT, 'build'))
import cards  # noqa: E402  (load, sizes, weights, draw, place, uri, and the stage order)

ROOT_AREA, MAX_W, MAX_H = 62.0, 100, 100
WEIGHT_RANGE, INK_GAIN, SHELF_X = (0.62, 1.5), 1.2, 56

pages = cards.manifest()
ids = cards.stage_ids(pages)
ims = [cards.load(i) for i in ids]
sz = cards.sizes(ims, ROOT_AREA, MAX_W, MAX_H)
wt = cards.weights(ims, sz, lo=WEIGHT_RANGE[0], hi=WEIGHT_RANGE[1])
drawn = [cards.draw(im, w, h, weight=k * INK_GAIN) for im, (w, h), k in zip(ims, sz, wt)]
xs = cards.place([w for w, h in sz], SHELF_X, SHELF_X)
row = '\n'.join('<img class="s" style="left:%dpx" src="%s" width="%d" height="%d" alt="">' % (x, cards.uri(d), d.width, d.height) for d, x in zip(drawn, xs))

path = os.path.join(ROOT, 'build', 'assets', 'home-card', 'card.html')
s = open(path, encoding='utf8').read()
sec0 = s.index('<section class="page home">')
f0 = s.index('<div class="frieze">', sec0) + len('<div class="frieze">\n')
f1 = s.index('</div>', f0)
old = re.findall(r'<img class="s[^"]*"', s[f0:f1])
assert len(old) == len(ids), 'expected %d drawings in the home row, found %d' % (len(ids), len(old))
s = s[:f0] + row + '\n' + s[f1:]
s = s.replace('<!-- built by build.py from card.tpl.html (frieze redrawn for the 14 stages on 27 Oct 2026, merge of chapters 8 and 9);',
              '<!-- built by build.py from card.tpl.html (frieze redrawn for the 14 stages on 27 Oct 2026, merge of chapters 8 and 9; redrawn from the plates by build/home_frieze.py on 21 Nov 2026);')
open(path, 'w', encoding='utf8').write(s)
print('home card row: %d drawings, %d px wide in all, heights %d to %d' % (len(ids), sum(w for w, h in sz), min(h for w, h in sz), max(h for w, h in sz)))
