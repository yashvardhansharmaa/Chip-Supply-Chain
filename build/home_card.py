#!/usr/bin/env python3
"""Render the home social card (build/assets/cards/home.png) from build/assets/home-card/card.html.

usage: python3 build/home_card.py

The home card is laid out on the center line: wordmark, "How AI chips are made", a garnet rule and the domain, over the
GPU die drawn faint behind them. LinkedIn crops a link's image to about 1.5:1 when the link sits in a comment and to a
square in some thumbnails, both from the center, so everything that must be read sits inside the middle 630 px.
build/cards.py skips the home slug so it never overwrites this card. The art (art-light.png) is the die-floorplan cloud
drawn by cards.render_art at a 1100 x 760 box with the specimen's own light-ground colors.
"""
import os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.argv = [sys.argv[0]]; sys.path.insert(0, os.path.join(ROOT, 'build'))
import cards  # noqa: E402  (for shrink and LIMIT)
src = os.path.join(ROOT, 'build', 'assets', 'home-card', 'card.html')
out = os.path.join(ROOT, 'build', 'assets', 'cards', 'home.png')
subprocess.run(['python3', os.path.join(ROOT, 'build', 'shoot.py'), 'file://' + src, out, '--width', '1200', '--height', '630', '--wait', '3', '--port', '9462'],
               check=True, stdout=subprocess.DEVNULL)
size = cards.shrink(out)
for n in (128, 96, 64):  # the faint cloud has many tones; fewer palette colors keep the card under the limit
    if size <= cards.LIMIT: break
    size = cards.shrink(out, colors=n)
print('wrote %s, %d KB%s' % (out, size // 1024, '' if size <= cards.LIMIT else ' (over the 150 KB limit)'))
