# Rebuilds site/index.html from dist/index.html: swaps the Google Fonts link, appends signal.css as a <style> at the end of <head>.
import re, pathlib
here = pathlib.Path(__file__).parent
src = (here / '../../../dist/index.html').resolve().read_text()
css = (here / 'signal.css').read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Source+Sans+3:ital,wght@0,300..700;1,300..700&display=swap'
out, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', f'<link rel="stylesheet" href="{fonts}">', src, count=1)
assert n == 1
out = out.replace('</head>', f'<style id="signal">\n{css}\n</style>\n</head>', 1)
(here / 'site/index.html').write_text(out)
print('injected', len(css), 'bytes of css')
