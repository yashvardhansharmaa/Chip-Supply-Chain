#!/usr/bin/env python3
"""Print each chapter of The Chain to its own PDF, dist/pdf/<id>.pdf, from the running local server.

usage: python3 build/chapter_pdfs.py [<id> ...] [--base http://127.0.0.1:8765/] [--edition YYYY-MM-DD] [--wait 6]

With no ids it prints all seventeen, in order. Each chapter is laid out by build/pdf.py --chapter <id>: Paged.js,
with the notes at the foot of each page, running heads and folios, and a compact title block (the site, the chapter,
the edition, the chapter's own page and how to cite it) in place of the book's cover and contents. One Chrome runs at
a time, on pdf.py's port. The whole run shares one edition date (today, or --edition), so a run that crosses midnight
still makes a single edition.

A new file replaces the old one only if it is at least 100 KB and has text: its chapter title and its edition line,
found by pdftotext or PyMuPDF, and pdf.py did not report text left off a page. Anything else is refused, the old file
(if any) stays, and the run exits non-zero.
Rebuild the site afterwards (node build/build.js): the cite line under each chapter title links the chapter's PDF once
the file exists, and the sitemap lists it.
"""
import datetime, json, os, re, shutil, subprocess, sys, tempfile, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIN_BYTES = 100 * 1024
args = sys.argv[1:]
def opt(name, default):
    if name in args:
        i = args.index(name); v = args[i + 1]; del args[i:i + 2]; return v
    return default
base = opt('--base', 'http://127.0.0.1:8765/')
wait = opt('--wait', '6')
try:
    day = datetime.date.fromisoformat(opt('--edition', datetime.date.today().isoformat()))
except ValueError:
    sys.exit('--edition takes a date as YYYY-MM-DD')
edition = f'Edition of {day.day} {day.strftime("%B")} {day.year}'
wanted = [a for a in args if not a.startswith('--')]

def chapters():
    """the seventeen chapters, as the readable pages and the cards know them (build/modules/social.js manifest())"""
    js = ("process.stdout.write(JSON.stringify(require(%s).manifest().filter(function (p) { return p.kind === 'chapter'; })"
          ".map(function (p) { return { id: p.slug, n: p.number, title: p.title }; })))") % json.dumps(os.path.join(ROOT, 'build', 'modules', 'social.js'))
    r = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit('could not read the chapter list from build/modules/social.js: ' + (r.stderr.strip().splitlines() or ['?'])[-1])
    return json.loads(r.stdout)

def page_count(data):
    return len(re.findall(rb'/Type\s*/Page[^s]', data))

def mupdf():
    try:
        import pymupdf
        return pymupdf
    except ImportError:
        try:
            import fitz
            return fitz
        except ImportError:
            return None

def text_of(path):
    """the PDF's text, by pdftotext (poppler) or else PyMuPDF"""
    if shutil.which('pdftotext'):
        return subprocess.run(['pdftotext', '-q', '-enc', 'UTF-8', path, '-'], capture_output=True).stdout.decode('utf-8', 'replace')
    with mupdf().open(path) as doc:
        return ''.join(page.get_text() for page in doc)

def squash(s):
    return ' '.join(str(s).replace(' ', ' ').split())

all_chapters = chapters()
known = {c['id']: c for c in all_chapters}
unknown = [w for w in wanted if w not in known]
if unknown: sys.exit('no such chapter: ' + ', '.join(unknown) + '\nchapters: ' + ' '.join(known))
todo = [known[w] for w in wanted] if wanted else all_chapters
if not shutil.which('pdftotext') and not mupdf():
    sys.exit('the text check needs pdftotext (poppler) or PyMuPDF, and neither is installed')

url = base.rstrip('/') + '/?theme=light#/chain'
out_dir = os.path.join(ROOT, 'dist', 'pdf')
os.makedirs(out_dir, exist_ok=True)
tmp = tempfile.mkdtemp(prefix='cp-chapter-pdfs-')
print(f'{len(todo)} chapter{"s" if len(todo) != 1 else ""} from {url}, {edition}', flush=True)
done, refused = [], []
try:
    for ch in todo:
        cid, title = ch['id'], ch['title']
        part = os.path.join(tmp, cid + '.pdf')
        t0 = time.time()
        r = subprocess.run([sys.executable, os.path.join(ROOT, 'build', 'pdf.py'), url, part, '--chapter', cid,
                            '--edition', day.isoformat(), '--wait', wait], capture_output=True, text=True)
        log = (r.stdout + r.stderr).strip().splitlines()
        why = None
        if r.returncode != 0 or not os.path.exists(part):
            why = 'pdf.py failed: ' + ' | '.join(log[-3:])
        elif any('PAGED.JS FAILED' in line for line in log):
            why = 'Paged.js could not lay it out, so pdf.py fell back to end-of-chapter notes'
        elif any('TEXT OFF THE PAGE' in line for line in log):
            why = next(line for line in log if 'TEXT OFF THE PAGE' in line).split('] ', 1)[-1]
        else:
            data = open(part, 'rb').read()
            text = squash(text_of(part) or '')
            if len(data) < MIN_BYTES:
                why = f'only {len(data):,} bytes (under {MIN_BYTES // 1024} KB)'
            elif not text:
                why = 'no text in the file'
            elif squash(title) not in text:
                why = f'the title "{title}" is not in its text'
            elif edition not in text:
                why = f'"{edition}" is not in its text'
        if why:
            refused.append((ch, why))
            print(f'{ch["n"]:02d} {cid}: REFUSED, {why}', flush=True)
            continue
        final = os.path.join(out_dir, cid + '.pdf')
        shutil.move(part, final)
        pages = page_count(data)
        done.append((ch, pages, len(data)))
        print(f'{ch["n"]:02d} {cid}: {pages} pages, {len(data) / 1e6:.2f} MB ({time.time() - t0:.0f} s)', flush=True)
finally:
    shutil.rmtree(tmp, ignore_errors=True)

if done:
    print(f'wrote {len(done)} to dist/pdf/: {sum(p for _, p, _ in done)} pages, {sum(b for _, _, b in done) / 1e6:.1f} MB in all')
    print('next: node build/build.js, so the cite lines link them and the sitemap lists them')
if refused:
    sys.exit(f'refused {len(refused)}: ' + ', '.join(c['id'] for c, _ in refused))
