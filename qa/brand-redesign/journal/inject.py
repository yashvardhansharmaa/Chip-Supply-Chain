# Rebuilds site/index.html from dist/index.html: swaps the Google Fonts link, appends journal.css as a <style> at the end of <head>.
import re, pathlib
here = pathlib.Path(__file__).parent
src = (here / '../../../dist/index.html').resolve().read_text()
css = (here / 'journal.css').read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..700;1,8..60,300..600&family=Source+Sans+3:ital,wght@0,400..700;1,400&display=swap'
out, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', f'<link rel="stylesheet" href="{fonts}">', src, count=1)
assert n == 1
# the one text change in the copy: the specimen's tag reads Figure N, not Specimen N (three occurrences: one in the markup, two in the tag string; the point-cloud code is untouched)
n2 = out.count('Specimen <b>'); assert n2 == 3, n2
out = out.replace('Specimen <b>', 'Figure <b>')
out = out.replace('</head>', f'<style id="journal">\n{css}\n</style>\n</head>', 1)
(here / 'site/index.html').write_text(out)
print('injected', len(css), 'bytes of css')
