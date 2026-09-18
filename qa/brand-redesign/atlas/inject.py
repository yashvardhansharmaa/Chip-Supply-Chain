# Re-runnable: swaps the Google Fonts link and (re)places the Atlas <style> block at the end of <head> in the copied site.
import re, pathlib
root = pathlib.Path(__file__).parent
html = root / 'site' / 'index.html'
css = (root / 'atlas.css').read_text()
h = html.read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&family=Alegreya+Sans+SC:ital,wght@0,400;0,500;0,700;1,400&display=swap'
h = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', '<link rel="stylesheet" href="' + fonts + '">', h, count=1)
h = re.sub(r'<style id="atlas-override">.*?</style>\n', '', h, flags=re.S)
h = h.replace('</head>', '<style id="atlas-override">\n' + css + '</style>\n</head>', 1)
html.write_text(h)
print('injected', len(css), 'bytes of css;', 'fonts ok' if fonts in h else 'FONTS LINK NOT FOUND')
