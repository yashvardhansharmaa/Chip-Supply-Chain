# Rebuilds site/index.html from dist/index.html: swaps the Google Fonts link, appends plate.css as a <style> at the end
# of <head>, and appends plate.js (Roman plate numbers) as a <script> at the end of <body>. No site source is touched.
import re, pathlib
here = pathlib.Path(__file__).parent
src = (here / '../../../dist/index.html').resolve().read_text()
css = (here / 'plate.css').read_text()
js = (here / 'plate.js').read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..700;1,8..60,300..500&family=Literata:ital,opsz,wght@0,7..72,300..500;1,7..72,300..400&display=swap'
out, n = re.subn(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', f'<link rel="stylesheet" href="{fonts}">', src, count=1)
assert n == 1
out = out.replace('</head>', f'<style id="plate">\n{css}\n</style>\n</head>', 1)
assert out.rstrip().endswith('</html>')
i = out.rfind('</body>')
out = out[:i] + f'<script id="plate-js">\n{js}\n</script>\n' + out[i:]
(here / 'site/index.html').write_text(out)
print('injected', len(css), 'bytes of css and', len(js), 'bytes of js')
