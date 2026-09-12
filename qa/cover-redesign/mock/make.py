#!/usr/bin/env python3
"""Write the five cover mocks as HTML (sheet 1240 x 1754 px = A4 at 150 dpi; 1 pt = 2.0833 px, 1 mm = 5.9055 px).
usage: python3 qa/cover-redesign/mock/make.py   -> cover-1.html .. cover-5.html next to this file"""
import os
HERE = os.path.dirname(os.path.abspath(__file__))

EYEBROW = 'Chip Supply Chain'
TITLE = 'How AI chips<br>are made'
SUB = 'Every stage of the supply chain, and who controls it.'
BY = 'Yashvardhan Sharma with Claude'
WHAT = 'The Chain: seventeen chapters.'
META = 'Printed from chipsupplychain.org · Updated 11 September 2026'
STAGES = ['Design and EDA', 'Silicon and wafers', 'Chemi&shy;cals and resist', 'Litho&shy;graphy', 'Photo&shy;masks', 'Deposi&shy;tion and etch', 'Metro&shy;logy', 'Transis&shy;tors',
          'Found&shy;ries and fabs', 'Memory and HBM', 'Advanced pack&shy;aging', 'Sub&shy;strates and PCBs', 'Test and assembly', 'Systems and net&shy;working', 'Data centres and power']

HEAD = '''<!doctype html>
<meta charset="utf-8">
<title>%(name)s</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,400&display=swap">
<style>
  :root {
    --pt: 2.08333px; --mm: 5.90551px;
    --ink: #12161a; --ink-2: #3a434c; --muted: #5b646d; --wafer: #edeff0; --line: #b9bec2; --amber: #c98a12;
    --paper: #fff;
    --display: "IBM Plex Sans Condensed", Arial, sans-serif;
    --body: "Newsreader", Georgia, serif;
    --mono: "IBM Plex Mono", Menlo, monospace;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--paper); }
  .sheet { position: relative; width: 1240px; height: 1754px; overflow: hidden; background: var(--paper); color: var(--ink); }
  .art { position: absolute; }
  .art img { display: block; width: 100%%; height: auto; }
  .type { position: absolute; left: calc(20 * var(--mm)); right: calc(20 * var(--mm)); }
  .k { font-family: var(--mono); font-size: calc(8.5 * var(--pt)); font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: var(--muted); margin: 0 0 calc(7 * var(--mm)); }
  .h { font-family: var(--display); font-weight: 700; font-size: calc(68 * var(--pt)); line-height: 0.88; letter-spacing: -0.018em; margin: 0 0 calc(7 * var(--mm)); color: var(--ink); }
  .sub { font-family: var(--body); font-weight: 400; font-size: calc(14.5 * var(--pt)); line-height: 1.3; color: var(--ink-2); margin: 0; max-width: calc(118 * var(--mm)); }
  .foot { position: absolute; left: calc(20 * var(--mm)); right: calc(20 * var(--mm)); bottom: calc(16 * var(--mm)); }
  .foot .rule { border-top: 1px solid var(--line); margin-bottom: calc(3.5 * var(--mm)); }
  .foot .row { display: flex; justify-content: space-between; align-items: baseline; gap: calc(8 * var(--mm)); }
  .by { font-family: var(--display); font-weight: 600; font-size: calc(11 * var(--pt)); letter-spacing: 0.01em; margin: 0; color: var(--ink); }
  .what { font-family: var(--mono); font-size: calc(8 * var(--pt)); color: var(--muted); margin: 0; }
  .meta { font-family: var(--mono); font-size: calc(7.6 * var(--pt)); color: var(--muted); margin: calc(2.6 * var(--mm)) 0 0; }
  %(css)s
</style>
'''

FOOT = '''
  <div class="foot">
    <div class="rule"></div>
    <div class="row"><p class="by">%s</p><p class="what">%s</p></div>
    <p class="meta">%s</p>
  </div>''' % (BY, WHAT, META)

def typeblock(top):
    return '''
  <div class="type" style="top: calc(%s * var(--mm))">
    <p class="k">%s</p>
    <h1 class="h">%s</h1>
    <p class="sub">%s</p>
  </div>''' % (top, EYEBROW, TITLE, SUB)

def page(name, css, body):
    return HEAD % {'name': name, 'css': css} + '<div class="sheet">' + body + FOOT + '</div>\n'

covers = {}

# 1: the whole die, plan view, one object with margins, title beneath
covers[1] = page('cover 1: the die, whole',
    '.art { left: calc(49 * var(--mm)); top: calc(22 * var(--mm)); width: calc(112 * var(--mm)); }',
    '<div class="art"><img src="art-die.png"></div>' + typeblock(194))

# 2: the packaged GPU with its HBM, three-quarter view, large
covers[2] = page('cover 2: the package',
    '.art { left: calc(6 * var(--mm)); top: calc(16 * var(--mm)); width: calc(198 * var(--mm)); }',
    '<div class="art"><img src="art-pkg.png"></div>' + typeblock(190))

# 3: full-bleed graphite, light points, white title
covers[3] = page('cover 3: graphite',
    ''':root { --paper: #171b1e; --ink: #e7e9ea; --ink-2: #c0c7cc; --muted: #8b959d; --line: #3a434a; --amber: #e6ad2f; }
       .art { left: calc(49 * var(--mm)); top: calc(22 * var(--mm)); width: calc(112 * var(--mm)); }''',
    '<div class="art"><img src="art-die-dark.png"></div>' + typeblock(194))

# 4: a 300 mm wafer, one die amber, title at the foot
covers[4] = page('cover 4: the wafer',
    '.art { left: calc(23 * var(--mm)); top: calc(14 * var(--mm)); width: calc(164 * var(--mm)); }',
    '<div class="art"><img src="art-wafer.png"></div>' + typeblock(194))

# 5: typographic; the fifteen stages as a rule beneath the title
seg = ''.join('<div class="seg"><span class="n">%02d</span><span class="s">%s</span></div>' % (i + 1, s) for i, s in enumerate(STAGES))
covers[5] = page('cover 5: typographic',
    '''.type { top: calc(24 * var(--mm)); }
       .h { font-size: calc(128 * var(--pt)); line-height: 0.86; letter-spacing: -0.03em; margin: 0 0 calc(10 * var(--mm)); margin-left: -0.04em; }
       .sub { font-size: calc(18 * var(--pt)); max-width: calc(150 * var(--mm)); }
       .strip { display: flex; border-top: 1px solid var(--ink); margin-top: calc(16 * var(--mm)); }
       .seg { flex: 1 1 0; min-width: 0; border-left: 1px solid var(--line); padding: calc(1.6 * var(--mm)) 0 0 calc(1 * var(--mm)); min-height: calc(14 * var(--mm)); }
       .seg:first-child { border-left: 0; padding-left: 0; }
       .n { display: block; font-family: var(--mono); font-size: calc(7 * var(--pt)); font-weight: 600; color: var(--amber); letter-spacing: 0.06em; margin-bottom: calc(1.2 * var(--mm)); }
       .s { display: block; font-family: var(--display); font-weight: 500; font-size: calc(6.5 * var(--pt)); line-height: 1.2; color: var(--ink-2); padding-right: calc(0.8 * var(--mm)); hyphens: manual; overflow-wrap: break-word; }''',
    '''<div class="type">
    <p class="k">%s</p>
    <h1 class="h">How AI<br>chips<br>are made</h1>
    <p class="sub">%s</p>
    <div class="strip">%s</div>
  </div>''' % (EYEBROW, SUB, seg))

for n, html in covers.items():
    p = os.path.join(HERE, 'cover-%d.html' % n)
    open(p, 'w').write(html)
    print('wrote', p)
