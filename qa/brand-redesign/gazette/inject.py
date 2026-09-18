# Rebuilds site/index.html from dist/index.html: swaps the Google Fonts link, appends gazette.css as a <style> at the end of <head>.
import re, pathlib
here = pathlib.Path(__file__).parent
src = (here / '../../../dist/index.html').resolve().read_text()
css = (here / 'gazette.css').read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wdth,wght@0,18..144,87..112,300..900;1,18..144,87..112,300..900&family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&display=swap'
out, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', f'<link rel="stylesheet" href="{fonts}">', src, count=1)
assert n == 1
out = out.replace('</head>', f'<style id="gazette">\n{css}\n</style>\n</head>', 1)
(here / 'site/index.html').write_text(out)
print('injected', len(css), 'bytes of css')
