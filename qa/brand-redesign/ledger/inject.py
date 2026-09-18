# Rebuilds site/index.html from dist/index.html: swaps the Google Fonts link, appends ledger.css as a <style> at the end of <head>.
import re, pathlib
here = pathlib.Path(__file__).parent
src = (here / '../../../dist/index.html').resolve().read_text()
css = (here / 'ledger.css').read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..500&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..600&family=Instrument+Sans:ital,wght@0,400..700;1,400..600&display=swap'
out, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', f'<link rel="stylesheet" href="{fonts}">', src, count=1)
assert n == 1
out = out.replace('</head>', f'<style id="ledger">\n{css}\n</style>\n</head>', 1)
(here / 'site/index.html').write_text(out)
print('injected', len(css), 'bytes of css')
