# Rebuilds site/index.html from dist/index.html: swaps the Google Fonts link, appends folio.css as a <style> at the end of <head>.
import re, pathlib
here = pathlib.Path(__file__).parent
src = (here / '../../../dist/index.html').resolve().read_text()
css = (here / 'folio.css').read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,200..600;1,300..400&family=Literata:ital,opsz,wght@0,7..72,300..600;1,7..72,300..500&display=swap'
out, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', f'<link rel="stylesheet" href="{fonts}">', src, count=1)
assert n == 1
out = out.replace('</head>', f'<style id="folio">\n{css}\n</style>\n</head>', 1)
(here / 'site/index.html').write_text(out)
print('injected', len(css), 'bytes of css')
