# Re-runnable: swaps the Google Fonts link and (re)places the Cleanroom <style> block at the end of <head> in the copied site.
import re, pathlib
root = pathlib.Path(__file__).parent
html = root / 'site' / 'index.html'
css = (root / 'cleanroom.css').read_text()
h = html.read_text()
fonts = 'https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@300;400;500;700&family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap'
h = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2\?[^"]*">', '<link rel="stylesheet" href="' + fonts + '">', h, count=1)
h = re.sub(r'<style id="cleanroom-override">.*?</style>\n', '', h, flags=re.S)
h = h.replace('</head>', '<style id="cleanroom-override">\n' + css + '</style>\n</head>', 1)
html.write_text(h)
print('injected', len(css), 'bytes of css;', 'fonts ok' if fonts in h else 'FONTS LINK NOT FOUND')
