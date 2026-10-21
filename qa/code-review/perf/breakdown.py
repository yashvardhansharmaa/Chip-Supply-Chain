#!/usr/bin/env python3
"""Break dist/index.html down by part: raw bytes, gzip -9 alone, brotli -11 alone."""
import re, gzip, json, sys
try:
    import brotli
except Exception:
    brotli = None

path = sys.argv[1]
h = open(path, encoding='utf-8').read()
B = lambda s: s.encode('utf-8')
def sz(s):
    b = B(s)
    return len(b), len(gzip.compress(b, 9)), (len(brotli.compress(b, quality=11)) if brotli else 0)
rows = []
def row(name, s, extra=''):
    r, g, br = sz(s)
    rows.append((name, r, g, br, extra))

total = sz(h)
print('TOTAL raw %d gzip %d brotli %d' % total)

# head
head_end = h.index('</head>')
head = h[:head_end]
styles = re.findall(r'<style>([\s\S]*?)</style>', head)
row('CSS: main <style> (styles.css + modules/*.css)', styles[0])
row('CSS: cite-line <style> (template)', styles[1])
heads_other = re.sub(r'<style>[\s\S]*?</style>', '', head)
row('Head: meta, JSON-LD, fonts link, theme + analytics scripts', heads_other)

# scripts at end of body
body_start = h.index('<body>')
tail_start = h.index('<script>', h.index('</main>'))
tail = h[tail_start:]
scripts = re.findall(r'<script>([\s\S]*?)</script>', tail)
# first: KIT; then specimens split; then DATA; APP; CITE_JS; art
kit = scripts[0]
row('JS: kit.js (point-cloud engine)', kit)
spec = []
i = 1
while not scripts[i].startswith('window.CP_DATA'):
    spec.append(scripts[i]); i += 1
spec_all = '\n'.join(spec)
row('JS: 19 specimen scripts', spec_all, '%d blocks' % len(spec))
data_js = scripts[i]; i += 1
app = scripts[i]; i += 1
row('JS: app.js + modules/*.js', app)
rest = '\n'.join(scripts[i:])
row('JS: CITE_JS + print-art loader', rest)
row('JSON: window.CP_DATA', data_js)

# body markup
body = h[body_start:tail_start]
row('HTML: body markup, all views', body)

def section(view):
    m = re.search(r'<section class="view[^"]*" data-view="%s"' % view, body)
    if not m: return ''
    # find matching </section> by counting
    depth = 0; pos = m.start()
    for t in re.finditer(r'<(/?)section\b', body[pos:]):
        if t.group(1): depth -= 1
        else: depth += 1
        if depth == 0:
            return body[pos: pos + t.end() + len('>')]
    return body[pos:]

pre_main = body[:body.index('<main>')]
row('  HTML: sheet + masthead + stage (pre-main)', pre_main)
views = {}
for v in ['stack', 'landscape', 'suppliers', 'controls', 'walk', 'glossary']:
    views[v] = section(v)
    row('  HTML view: ' + v, views[v])

# inside stack: chapters
stack = views['stack']
arts = re.findall(r'<article class="chapter[\s\S]*?</article>', stack)
row('    stack: 17 <article class="chapter">', ''.join(arts), '%d articles' % len(arts))
for a in arts:
    cid = re.search(r'id="([^"]+)"', a).group(1)
    r, g, br = sz(a)
    rows.append(('      ch ' + cid, r, g, br, ''))
footers = re.findall(r'<footer class="site-footer">[\s\S]*?</footer>', body)
row('  HTML: site footers (x%d)' % len(footers), ''.join(footers))

# glossary internals
gl = views['glossary']
m = re.search(r'<ul id="lk-items"[^>]*>([\s\S]*?)</ul>', gl)
row('    glossary: LOOKUP_LIST <ul>', m.group(1) if m else '')
m = re.search(r'<dl class="glossary" id="glossary">([\s\S]*?)</dl>', gl)
row('    glossary: GLOSSARY <dl>', m.group(1) if m else '')

# suppliers HOME_MAP
sup = views['suppliers']
row('    suppliers: inline SVG', ''.join(re.findall(r'<svg[\s\S]*?</svg>', sup)))
ctl = views['controls']
m = re.search(r'<div id="exposure-viz">([\s\S]*?)</div>\s*<details', ctl)
row('    controls: EXPOSURE_VIZ', m.group(1) if m else '')
row('    controls: inline SVG', ''.join(re.findall(r'<svg[\s\S]*?</svg>', ctl)))

# all SVGs
svgs = re.findall(r'<svg[\s\S]*?</svg>', body)
row('HTML: all inline <svg> in body', ''.join(svgs), '%d svgs' % len(svgs))
big = sorted(svgs, key=len, reverse=True)[:8]
for s in big:
    ctxpos = body.index(s)
    before = body[max(0, ctxpos-160):ctxpos]
    idm = re.findall(r'(?:id|class)="([^"]+)"', before)
    r, g, br = sz(s)
    rows.append(('      svg near ' + (idm[-1] if idm else '?'), r, g, br, ''))

# pieces of chapter markup by type
allch = ''.join(arts)
for name, pat in [
    ('cite <sup> marks', r'<sup class="cite">[\s\S]*?</sup>'),
    ('glossary popover buttons .gl-term', r'<button[^>]*class="gl-term[^"]*"[^>]*>[\s\S]*?</button>'),
    ('source lists ol.sources / .src', r'<ol class="sources[\s\S]*?</ol>'),
    ('flashcard decks', r'<section class="fc[\s\S]*?</section>'),
    ('anim figures', r'<figure class="figure figure--anim"[\s\S]*?</figure>'),
    ('ledger asides', r'<aside class="ch-ledger"[\s\S]*?</aside>'),
    ('chokepoint cards', r'<(?:section|div|aside) class="card[\s\S]*?</(?:section|div|aside)>'),
]:
    found = re.findall(pat, allch)
    row('    in chapters: ' + name, ''.join(found), '%d' % len(found))

# data keys
dj = data_js[len('window.CP_DATA = '):].rstrip().rstrip(';')
D = json.loads(dj)
for k, v in sorted(D.items(), key=lambda kv: -len(json.dumps(kv[1], ensure_ascii=False))):
    s = json.dumps(v, ensure_ascii=False, separators=(',', ':'))
    n = len(v) if hasattr(v, '__len__') else ''
    row('    DATA.' + k, s, '%s items' % n)

w = max(len(r[0]) for r in rows)
print('%-*s %10s %9s %9s  %s' % (w, 'part', 'raw', 'gzip', 'brotli', ''))
for name, r, g, br, extra in rows:
    print('%-*s %10d %9d %9d  %s' % (w, name, r, g, br, extra))
