#!/usr/bin/env python3
"""Build the three Suppliers-page mockups from a copy of dist/index.html.
Mockup-only: nothing in dist/ or src/ is touched. Each mock rebuilds the suppliers <section> from the
pieces the site already renders (map, stop strip, country roles, country panels, Sankey, filters, ladder)
and appends its own CSS. Output: mock-a.html, mock-b.html, mock-c.html next to this script."""
import re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
SRC = os.path.join(ROOT, 'dist', 'index.html')
html = open(SRC, encoding='utf-8').read()

# ---------- cut the suppliers section into its pieces ----------
A = html.index('<section class="view column wide" data-view="suppliers" hidden>')
B = html.index('<section class="view column wide" data-view="controls"')
sec = html[A:B]

def between(s, start, end, include=True):
    i = s.index(start); j = s.index(end, i) + (len(end) if include else 0)
    return s[i:j]

head = between(sec, '<div class="view-head">', '</div>')
mapblock = between(sec, '<div class="sa-map sa-map--route">', '</div></div>')  # svg + overlay, closes the map div
if '<ol class="sa-strip-stops">' in mapblock or mapblock.count('<div') != 2:
    raise SystemExit('map block anchor moved')
strip = between(sec, '<ol class="sa-strip-stops">', '</ol>')
roles = between(sec, '<ul class="sa-roles">', '</ul>')
panels = between(sec, '<div class="sa-panels" aria-live="polite">', '</article></div>')
pipe = between(sec, '<section class="sup-pipe" id="sup-pipe"', '</section>')
filters = between(sec, '<div class="filters">', '</div>')
toolbar = between(sec, '<div class="sup-toolbar" id="sup-toolbar">', 'Copy as CSV</button>\n      </div>')
ladder_h = between(sec, '<h3 class="label sup-ladder-h"', '</h3>')
ladder = between(sec, '<div class="sup-ladder" id="sup-ladder"', '</div>')
wrap = between(sec, '<div class="sup-wrap" id="sup-wrap" hidden>', '</div>')
route_sub = between(sec, '<p class="sa-sub">', '</p>')
dek = between(head, '<p class="dek">', '</p>')

# the stops carry "Town, Country" in data-town; the mocks label the chosen country's towns, so give each stop the town alone
def add_place(m):
    tag = m.group(0)
    town = re.search(r'data-town="([^",]+)', tag).group(1)
    return tag.replace('<a class="sa-stop"', '<a class="sa-stop" data-place="' + town + '"', 1)
mapblock = re.sub(r'<a class="sa-stop"[^>]*>', add_place, mapblock)
# the chosen country is Taiwan in every mock: the map carries it as state the way the runtime sets it
mapblock = mapblock.replace('<div class="sa-map sa-map--route">', '<div class="sa-map sa-map--route" data-cc="TW">', 1)

# the country roles: name, code, meta and the one-line role, for the chip row in mock A
role_rows = []
for m in re.finditer(r'<button type="button" class="sa-role" data-cc="([A-Z]{2})" aria-pressed="(true|false)"><span class="sa-role-name">([^<]*)</span><span class="sa-role-meta">([^<]*)</span><span class="sa-role-line">([^<]*)</span></button>', roles):
    role_rows.append(dict(cc=m.group(1), on=m.group(2) == 'true', name=m.group(3), meta=m.group(4), line=m.group(5)))
if len(role_rows) < 10:
    raise SystemExit('roles anchor moved: ' + str(len(role_rows)))
WORDS = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'thirteen': 13}
def stages_of(meta):
    m = re.search(r'(leads|named on) (\w+) stage', meta)
    return WORDS.get(m.group(2), 0) if m else 0

CC = ['US', 'NL', 'DE', 'JP', 'TW', 'KR', 'CN', 'MY', 'SG', 'GB', 'IL', 'IN', 'FR', 'AT', 'CH', 'TH']

# ---------- CSS shared by the mocks: the chosen country lifts out of the map ----------
shared_css = '''
/* ===== mock: the chosen country's stops and towns lift out of the route map ===== */
.sa-map[data-cc] .sa-stop { opacity: 0.42; box-shadow: none; background: var(--ink-2); transition: none; }
.sa-map[data-cc] .sa-route { opacity: 0.22; }
.sa-map[data-cc] .sa-tail { opacity: 0.45; }
''' + ''.join('.sa-map[data-cc="%s"] .sa-stop[data-cc="%s"] { opacity: 1; background: var(--ink); box-shadow: 0 0 0 3px var(--accent); transform: scale(1.16); z-index: 5; }\n' % (c, c) for c in CC) + \
''.join('.sa-map[data-cc="%s"] .sa-stop[data-cc="%s"]::after { content: attr(data-place); }\n' % (c, c) for c in CC) + '''
.sa-stop::after { content: none; position: absolute; left: 27px; top: 50%; transform: translateY(-50%); white-space: nowrap;
  font-family: var(--font-mono); font-weight: 600; font-size: 10.5px; letter-spacing: 0.04em; color: var(--ink);
  background: color-mix(in srgb, var(--bg-2) 88%, transparent); padding: 2px 5px; border-radius: 2px; pointer-events: none; }
.sa-stop.lab-l::after { left: auto; right: 27px; }
.sa-stop.lab-d::after { top: auto; transform: none; left: 50%; margin-left: -50%; top: 24px; transform: translateX(-50%); }
.sa-stop.lab-u::after { top: auto; transform: none; bottom: 24px; left: 50%; transform: translateX(-50%); }
.sa-stop.lab-rd::after { top: calc(50% + 10px); }
/* the strip agrees with the map: it is the map's next sibling, so the runtime's data-cc on the map drives it with no script */
''' + ''.join('.sa-map[data-cc="%s"] ~ .sa-strip-stops .sa-stopcard:not([data-cc="%s"]) .sa-stopcard-t, .sa-map[data-cc="%s"] ~ .sa-strip-stops .sa-stopcard:not([data-cc="%s"]) .sa-stopcard-w { color: var(--muted); }\n.sa-map[data-cc="%s"] ~ .sa-strip-stops .sa-stopcard:not([data-cc="%s"]) { border-top-color: var(--line-2); }\n.sa-map[data-cc="%s"] ~ .sa-strip-stops .sa-stopcard[data-cc="%s"] { border-top-color: var(--accent); border-top-width: 3px; padding-top: 5px; }\n.sa-map[data-cc="%s"] ~ .sa-strip-stops .sa-stopcard[data-cc="%s"] .sa-stopcard-t { color: var(--ink); }\n' % ((c,) * 10) for c in CC) + '''
@media (max-width: 899px) {
  .sa-stop::after { display: none; }
  .sa-map[data-cc] .sa-stop { opacity: 0.5; }
''' + ''.join('  .sa-map[data-cc="%s"] .sa-stop[data-cc="%s"] { transform: none; box-shadow: 0 0 0 2px var(--accent); width: 11px; height: 11px; margin: -5.5px 0 0 -5.5px; }\n' % (c, c) for c in CC) + '''
}
'''

# Taiwan's four towns sit within 3% of one another: send two labels left, two right
def label_sides(block, sides):
    for href, cls in sides.items():
        block = re.sub(r'<a class="sa-stop"( data-place="[^"]*" data-cc="[A-Z]{2}" href="%s")' % re.escape(href), r'<a class="sa-stop %s"\1' % cls, block, count=1)
    return block
SIDES_WIDE = {'#transistors-and-front-end': 'lab-l', '#foundries-and-fabs': 'lab-l', '#advanced-packaging': 'lab-d', '#systems-and-networking': 'lab-u'}
SIDES_NARROW = {'#transistors-and-front-end': 'lab-l', '#foundries-and-fabs': 'lab-l', '#advanced-packaging': 'lab-d', '#systems-and-networking': 'lab-rd'}
mapblock_wide = label_sides(mapblock, SIDES_WIDE)
mapblock_narrow = label_sides(mapblock, SIDES_NARROW)
mapblock = mapblock_narrow  # the right-down Taipei label clears its neighbours at every map width

def build(name, section, css):
    out = html[:A] + section + html[B:]
    out = out.replace('</style>', '</style>\n<style id="mock-css">' + shared_css + css + '</style>', 1)
    path = os.path.join(HERE, name)
    open(path, 'w', encoding='utf-8').write(out)
    print('wrote', path, len(out))

# =====================================================================================
# Mock A: Atlas. One plate: country chips across the top, the map with the panel at its right,
# the stop strip as the plate's footer, then two tabs (By stage / By country) for the ladder and the Sankey.
# =====================================================================================
chips = ''.join(
    '<li><button type="button" class="sa-role" data-cc="%s" aria-pressed="%s"><span class="sa-role-name">%s</span><span class="sa-role-meta">%s</span><span class="sa-role-line">%s</span></button></li>'
    % (r['cc'], 'true' if r['on'] else 'false', r['name'], r['meta'], r['line']) for r in role_rows)
chosen = [r for r in role_rows if r['on']][0]
sec_a = '''<section class="view column wide" data-view="suppliers" hidden>
      ''' + head + '''
      <div class="sa sa--home sa--atlas">
<div class="atlas" data-cc="TW">
<div class="atlas-bar"><span class="label atlas-bar-l">The route of one chip</span><ul class="sa-roles atlas-chips" aria-label="Choose a country">''' + chips + '''</ul></div>
<p class="atlas-caption"><b>''' + chosen['name'] + '''</b> <span class="atlas-caption-meta">''' + chosen['meta'] + '''</span> <span class="atlas-caption-line">''' + chosen['line'] + '''</span></p>
<div class="atlas-body">
<div class="atlas-mapcol">
''' + mapblock_narrow + '''
''' + strip + '''
</div>
''' + panels + '''
</div>
</div>
      </div>
      <nav class="subtabs sup-tabs" aria-label="Firms by stage or by country"><a href="#/suppliers" data-tab="stage" aria-current="true">By stage</a><a href="#/suppliers?tab=country" data-tab="country">By country</a></nav>
      <div class="sup-tab" data-tab="stage">
      ''' + filters + '''
      ''' + toolbar + '''
      ''' + ladder_h + '''
      ''' + ladder + '''
      ''' + wrap + '''
      </div>
      <div class="sup-tab" data-tab="country" hidden>
      ''' + pipe + '''
      </div>
    </section>

    '''
css_a = '''
/* ===== mock A: atlas ===== */
.sa--atlas { padding-bottom: 0; }
.atlas { margin-top: 8px; border: 1px solid var(--line); border-radius: 3px; background: var(--bg-2); }
.atlas-bar { display: flex; align-items: center; gap: 14px; padding: 10px 14px; border-bottom: 1px solid var(--line); }
.atlas-bar-l { flex: 0 0 auto; color: var(--ink); }
.atlas-chips { display: flex; flex-wrap: wrap; gap: 5px; margin: 0; padding: 0; border: 0; list-style: none; }
.atlas-chips .sa-role { display: inline-flex; align-items: baseline; gap: 6px; width: auto; padding: 6px 9px 7px; border: 1px solid var(--line-2); border-radius: 2px; background: var(--bg); color: var(--ink-2); box-shadow: none; }
.atlas-chips .sa-role:hover { background: var(--bg-3); }
.atlas-chips .sa-role-name { font-size: 13.5px; font-weight: 600; }
.atlas-chips .sa-role-n { font-family: var(--font-mono); font-size: 10px; color: var(--muted); font-variant-numeric: tabular-nums; }
.atlas-chips .sa-role-meta, .atlas-chips .sa-role-line { display: none; }
.atlas-chips .sa-role[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); box-shadow: none; }
.atlas-chips .sa-role[aria-pressed="true"] .sa-role-n { color: var(--bg); opacity: 0.7; }
.atlas-caption { margin: 0; padding: 9px 14px 10px; border-bottom: 1px solid var(--line); font-size: 15px; line-height: 1.4; color: var(--ink-2); }
.atlas-caption b { font-family: var(--font-display); font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink); margin-right: 6px; }
.atlas-caption-meta { font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.05em; color: var(--muted); margin-right: 10px; }
.atlas-body { display: grid; grid-template-columns: minmax(0, 1fr) 360px; align-items: stretch; }
.atlas-mapcol { min-width: 0; border-right: 1px solid var(--line); }
.atlas .sa-map { border: 0; border-radius: 0; background: transparent; }
.atlas .sa-svg { border-radius: 0; }
.atlas .sa-strip-stops { margin: 0; padding: 12px 12px 14px; border-top: 1px solid var(--line); gap: 12px 8px; grid-template-columns: repeat(8, minmax(0, 1fr)); }
.atlas .sa-panels { position: relative; min-width: 0; }
.atlas .sa-panel { position: absolute; inset: 0; max-height: none; overflow: auto; border: 0; border-radius: 0; padding: 16px 18px 14px; }
.atlas .sa-panel-head h4 { font-size: 25px; }
.atlas .sa-panel-lede { font-size: 15.5px; margin: 8px 0 12px; }
.atlas .sa-fact a, .atlas .sa-fact-in { padding: 7px 2px; }
.atlas .sa-panel-foot { margin-top: 10px; }
.sup-tabs { margin: 34px 0 0; }
.sup-tab[hidden] { display: none; }
.sup-tab .filters { margin-top: 18px; }
.sup-tab .sup-pipe { margin-top: 18px; }
@media (max-width: 899px) {
  .atlas-bar { flex-direction: column; align-items: flex-start; gap: 8px; padding: 10px 12px; }
  .atlas-chips .sa-role { padding: 5px 8px 6px; }
  .atlas-chips .sa-role-name { font-size: 13px; }
  .atlas-caption { padding: 8px 12px 9px; font-size: 14.5px; }
  .atlas-body { grid-template-columns: 1fr; }
  .atlas-mapcol { border-right: 0; }
  .atlas .sa-map { margin: 0; border: 0; }
  .atlas .sa-strip-stops { padding: 10px 12px 12px; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px 6px; }
  .atlas-caption-line { display: block; margin-top: 2px; }
  .atlas .sa-panels { border-top: 1px solid var(--line); }
  .atlas .sa-panel { position: static; overflow: visible; padding: 16px 12px 14px; }
}
'''
build('mock-a.html', sec_a, css_a)

# =====================================================================================
# Mock B: map plus table. The map is cropped to the band the chain occupies (half height), the
# leverage list becomes the panel's own list in one frame, the Sankey goes, the ladder follows.
# =====================================================================================
Y0, H = 24.0, 244.0  # crop: the route runs from y=44 to y=233 of 412.6
mapblock_b = mapblock.replace('viewBox="0 0 1000 412.6"', 'viewBox="0 %s 1000 %s"' % (Y0, H), 1)
def retop(m):
    top = float(m.group(2)); y = top / 100 * 412.6
    return 'style="left:%s;top:%.2f%%"' % (m.group(1), (y - Y0) / H * 100)
mapblock_b = re.sub(r'style="left:([\d.]+%);top:([\d.]+)%"', retop, mapblock_b)
mapblock_b = mapblock_b.replace('class="sa-map sa-map--route"', 'class="sa-map sa-map--route sa-map--band"', 1)

roles_b = ''.join(
    '<li><button type="button" class="sa-role" data-cc="%s" aria-pressed="%s"><span class="sa-role-name">%s</span><span class="sa-role-meta">%s</span><span class="sa-role-line">%s</span></button></li>'
    % (r['cc'], 'true' if r['on'] else 'false', r['name'], r['meta'], r['line']) for r in role_rows)
sec_b = '''<section class="view column wide" data-view="suppliers" hidden>
      ''' + head + '''
      <div class="sa sa--home sa--b">
<section class="sa-route-wrap sa-route-wrap--band" id="the-route" aria-label="The route of one chip" data-cc="TW">
<div class="sa-map-head"><h3 class="sa-h">The route of one chip</h3>''' + route_sub + '''</div>
''' + mapblock_b + '''
''' + strip + '''
</section>
<section class="sa-leverage sa-leverage--frame" aria-label="What leverage does each country have">
<div class="sa-map-head"><h3 class="sa-h">What leverage does each country have?</h3><p class="sa-sub">Choose a country for its shares by segment, the chapters that name it and its firms in the list.</p></div>
<div class="lev-frame"><ul class="sa-roles">''' + roles_b + '''</ul>''' + panels + '''</div>
</section>
      </div>
      <div class="sup-tab" data-tab="country" hidden>''' + pipe + '''</div>
      <h3 class="label sup-ladder-h sup-ladder-h--b" id="sup-ladder-h-top">The firms, by stage</h3>
      ''' + filters + '''
      ''' + toolbar + '''
      ''' + ladder_h + '''
      ''' + ladder + '''
      ''' + wrap + '''
    </section>

    '''
css_b = '''
/* ===== mock B: map plus table ===== */
.sa--b { padding-bottom: 0; }
.sa-map--band .sa-svg { aspect-ratio: 1000 / %s; }
.sa-route-wrap--band .sa-strip-stops { margin-top: 10px; }
.sa-leverage--frame { margin-top: 36px; }
.lev-frame { display: grid; grid-template-columns: minmax(0, 0.86fr) minmax(380px, 1.14fr); border: 1px solid var(--line); border-radius: 3px; background: var(--bg-2); align-items: stretch; }
.lev-frame .sa-roles { border: 0; border-right: 1px solid var(--line); background: var(--bg); border-radius: 3px 0 0 3px; }
.lev-frame .sa-role { grid-template-columns: 1fr; grid-template-areas: "name" "line"; gap: 1px 0; padding: 8px 14px 9px 16px; border-bottom: 1px solid var(--line); }
.lev-frame .sa-roles li:last-child .sa-role { border-bottom: 0; }
.lev-frame .sa-role-name { font-size: 15px; }
.lev-frame .sa-role-name::after { content: " " attr(data-meta); }
.lev-frame .sa-role-meta { grid-area: name; justify-self: end; align-self: baseline; padding-left: 10px; text-align: right; }
.lev-frame .sa-role-line { font-size: 13.5px; line-height: 1.35; color: var(--ink-2); }
.lev-frame .sa-role[aria-pressed="true"] { background: var(--bg-2); box-shadow: inset 3px 0 0 var(--accent); margin-right: -1px; position: relative; z-index: 1; }
.lev-frame .sa-role[aria-pressed="true"] .sa-role-line { color: var(--ink); }
.lev-frame .sa-panels { min-width: 0; }
.lev-frame .sa-panel { border: 0; border-radius: 0; max-height: none; overflow: visible; padding: 18px 22px 16px; }
.sup-ladder-h--b { margin-top: 44px; padding-top: 22px; border-top: 1px solid var(--line); font-family: var(--font-display); font-size: 15px; font-weight: 700; letter-spacing: 0.09em; color: var(--ink); }
.sup-tab[hidden] { display: none; }
.sup-ladder-h--b + .filters { margin-top: 14px; }
@media (max-width: 899px) {
  .lev-frame { grid-template-columns: 1fr; }
  .lev-frame .sa-roles { border-right: 0; border-bottom: 1px solid var(--line); border-radius: 3px 3px 0 0; }
  .lev-frame .sa-role { padding: 8px 12px 9px 14px; grid-template-areas: "name" "meta" "line"; }
  .lev-frame .sa-role-meta { grid-area: meta; justify-self: start; padding-left: 0; text-align: left; }
  .lev-frame .sa-panel { padding: 16px 12px 14px; }
}
@media (max-width: 700px) {
  .sa-map--band { margin: 0 -16px; }
}
''' % H
build('mock-b.html', sec_b, css_b)

# =====================================================================================
# Mock C: stages first. The ladder leads, each rung carrying the country tiles of its firms; the map
# and the country list follow as the "where" section; the Sankey goes.
# =====================================================================================
rendered = open(os.path.join(HERE, 'ladder-rendered.html'), encoding='utf-8').read()
def add_flags(m):
    rung = m.group(0)
    codes = re.findall(r'<i class="sup-cc">([A-Z]{2})</i>', rung)
    counts = {}
    for c in codes: counts[c] = counts.get(c, 0) + 1
    order = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    tiles = ''.join('<span class="sup-flag" data-cc="%s">%s<b>%d</b></span>' % (c, c, n) for c, n in order)
    row = '<p class="sup-flags" aria-label="Countries of the firms at this stage">' + tiles + '</p>'
    rung = rung.replace('</div><p class="sup-names">', '</div>' + row + '<p class="sup-names">', 1)
    return rung
static_ladder = re.sub(r'<section class="sup-rung".*?</section>', add_flags, rendered, flags=re.S)
static_ladder = static_ladder.replace('id="sup-rung-', 'id="mock-rung-').replace('aria-controls="sup-rung-', 'aria-controls="mock-rung-').replace('aria-labelledby="sup-rung-', 'aria-labelledby="mock-rung-')
if static_ladder.count('sup-flags') < 15:
    raise SystemExit('flag rows missing: ' + str(static_ladder.count('sup-flags')))

sec_c = '''<section class="view column wide" data-view="suppliers" hidden>
      ''' + head + '''
      <div class="sa-map-head ladder-head"><h3 class="sa-h">Stages, thinnest first</h3><p class="sa-sub">Twenty stages ranked by how few firms can do the work, every firm named, with the countries its firms sit in.</p></div>
      ''' + filters + '''
      ''' + toolbar + '''
      ''' + ladder_h + '''
      <div class="sup-ladder sup-ladder--flags" id="mock-ladder" data-cc="TW" aria-labelledby="sup-ladder-h">''' + static_ladder + '''</div>
      ''' + ladder + '''
      ''' + wrap + '''
      <section class="where" id="where" aria-label="Where it happens">
      <div class="where-head"><h3 class="sa-h">Where it happens</h3><p class="sa-sub">The town that leads each stage, and what each country holds.</p></div>
      <div class="sa sa--home sa--c">
<section class="sa-route-wrap" id="the-route" aria-label="The route of one chip" data-cc="TW">
''' + mapblock + '''
''' + strip + '''
</section>
<section class="sa-leverage" aria-label="What leverage does each country have">
<div class="sa-lev-grid">''' + roles + panels + '''</div>
</section>
      </div>
      </section>
      <div class="sup-tab" data-tab="country" hidden>''' + pipe + '''</div>
    </section>

    '''
css_c = '''
/* ===== mock C: stages first ===== */
#sup-ladder, #sup-ladder-h { display: none !important; }
.ladder-head { margin: 4px 0 0; }
.ladder-head + .filters { margin-top: 16px; }
#mock-ladder { margin-top: 14px; }
.sup-ladder--flags .sup-rank { grid-row: 1 / span 4; }
.sup-flags { grid-column: 2; display: flex; flex-wrap: wrap; gap: 4px; margin: 0 0 7px; }
.sup-flag { display: inline-flex; align-items: baseline; gap: 4px; font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.06em; line-height: 1; padding: 4px 5px 4px 6px; border: 1px solid var(--line-2); border-radius: 2px; background: var(--bg-2); color: var(--ink-2); }
.sup-flag b { font-weight: 400; color: var(--muted); font-variant-numeric: tabular-nums; }
.sup-ladder--flags[data-cc="TW"] .sup-flag[data-cc="TW"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.sup-ladder--flags[data-cc="TW"] .sup-flag[data-cc="TW"] b { color: var(--bg); opacity: 0.7; }
.where { margin-top: 56px; padding-top: 26px; border-top: 1px solid var(--line-2); }
.where-head { margin-bottom: 16px; }
.sa--c .sa-leverage { margin-top: 36px; }
.sup-tab[hidden] { display: none; }
@media (max-width: 699px) {
  .sup-ladder--flags .sup-rank { grid-row: 1; }
  .sup-ladder--flags .sup-flags { grid-column: 1 / -1; grid-row: 2; margin: 8px 0 0; }
  .sup-ladder--flags .sup-names { grid-row: 3; }
  .sup-ladder--flags .sup-panel { grid-row: 4; }
}
'''
build('mock-c.html', sec_c, css_c)
