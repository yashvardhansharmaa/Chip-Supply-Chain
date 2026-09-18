# Re-applies the Monograph override to the site copy: swaps the Google Fonts link and appends the style block to <head>.
import re, pathlib
root = pathlib.Path(__file__).parent
site = root / 'site' / 'index.html'
css = (root / 'monograph.css').read_text()
h = site.read_text()
fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200..600;1,9..144,300..500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,8..60,400..500&display=swap">'
h, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', fonts, h, count=1)
assert n == 1, 'fonts link not found'
h = re.sub(r'<style id="monograph">.*?</style>\s*</head>', '</head>', h, count=1, flags=re.S)
h = h.replace('</head>', '<style id="monograph">\n' + css + '\n</style>\n</head>', 1)
site.write_text(h)
print('injected', len(css), 'bytes of css; fonts link replaced')
