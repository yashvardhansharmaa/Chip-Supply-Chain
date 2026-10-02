#!/usr/bin/env node
'use strict';

/*
 * harvest-bibliography.js
 *
 * Collects every citation URL used on the site, fetches each one, extracts a
 * title / publisher / date, and writes data/bibliography.json keyed by URL.
 *
 *   node build/harvest-bibliography.js            fetch (using the cache) and write
 *   node build/harvest-bibliography.js --list     just print the collected URLs
 *   node build/harvest-bibliography.js --refetch  ignore cached failures and retry
 *   node build/harvest-bibliography.js --only=<substring>  restrict to matching URLs
 *
 * Responses are cached under qa/bib-cache/ so re-runs are cheap. Hand-checked
 * corrections live in the MANUAL table at the bottom of this file and always
 * win over anything scraped, so a verified entry survives a re-run.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'content');
const DATA_DIR = path.join(ROOT, 'data');
const CACHE_DIR = path.join(ROOT, 'qa', 'bib-cache');
const OUT_FILE = path.join(DATA_DIR, 'bibliography.json');

const ACCESSED = '2026-09-09';
const TIMEOUT_MS = 20000;
const CONCURRENCY = 6;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

// ---------------------------------------------------------------- collection

function walkFiles(dir, exts) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => exts.some((e) => f.endsWith(e)))
    .map((f) => path.join(dir, f))
    .sort();
}

// Trailing characters that are punctuation of the surrounding prose, not URL.
function trimUrl(u) {
  let s = u.trim();
  s = s.replace(/[)\]\}>,;:'"`]+$/, (m) => {
    // Keep a closing paren if the URL has an unmatched opening one
    // (e.g. Wikipedia-style paths).
    const opens = (s.match(/\(/g) || []).length;
    const closes = (s.match(/\)/g) || []).length;
    if (m === ')' && opens >= closes) return ')';
    return '';
  });
  s = s.replace(/[.,;:]+$/, '');
  return s;
}

function collectUrls() {
  const files = [
    ...walkFiles(CONTENT_DIR, ['.md']),
    ...walkFiles(DATA_DIR, ['.json', '.md']),
  ].filter((f) => path.resolve(f) !== OUT_FILE); // never scan our own output
  const found = new Map(); // url -> Set of files

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const add = (raw) => {
      const url = trimUrl(raw);
      if (!/^https?:\/\/\S+$/.test(url)) return;
      if (!found.has(url)) found.set(url, new Set());
      found.get(url).add(rel);
    };

    // ([source](url)) and any other markdown link
    for (const m of text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) add(m[1]);
    // "source": "url" / "url": "..." and any other JSON string value
    for (const m of text.matchAll(/"\s*:\s*"(https?:\/\/[^"]+)"/g)) add(m[1]);
    // bare URLs anywhere else (data notes, prose)
    for (const m of text.matchAll(/https?:\/\/[^\s"'`)\]<>]+/g)) add(m[0]);
  }

  // Skip the bibliography file's own keys if it is ever placed in data/.
  found.delete('');
  return found;
}

// ------------------------------------------------------------------ fetching

function cachePath(url) {
  const h = crypto.createHash('sha1').update(url).digest('hex');
  return path.join(CACHE_DIR, h + '.json');
}

function readCache(url) {
  const p = cachePath(url);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function writeCache(url, record) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath(url), JSON.stringify(record, null, 2));
}

// Bodies are kept beside the record so extraction can be improved and re-run
// without going back to the network. HTML is truncated; only the head matters.
function bodyPath(url, ext) {
  const h = crypto.createHash('sha1').update(url).digest('hex');
  return path.join(CACHE_DIR, h + ext);
}

function writeBody(url, buf, isPdf) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  if (isPdf) fs.writeFileSync(bodyPath(url, '.pdf'), buf);
  else fs.writeFileSync(bodyPath(url, '.html'), buf.slice(0, 400 * 1024));
}

// A few hosts accept the connection and then never finish the body. The abort
// signal covers the request, but wrap the whole call in a hard deadline too so
// one dead host cannot stall the pool indefinitely.
function withDeadline(promise, ms, url) {
  let timer;
  const guard = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ url, status: 0, error: `hard timeout after ${ms}ms` }), ms);
  });
  return Promise.race([promise, guard]).finally(() => clearTimeout(timer));
}

async function fetchUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': UA,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
      },
    });
    const ctype = (res.headers.get('content-type') || '').toLowerCase();
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      url,
      status: res.status,
      finalUrl: res.url || url,
      contentType: ctype,
      lastModified: res.headers.get('last-modified') || null,
      isPdf: ctype.includes('pdf') || buf.slice(0, 4).toString() === '%PDF',
      body: buf,
    };
  } catch (err) {
    return { url, status: 0, error: String(err && err.message ? err.message : err) };
  } finally {
    clearTimeout(timer);
  }
}

// --------------------------------------------------------------- extraction

function decodeEntities(s) {
  if (!s) return s;
  const named = {
    amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
    ndash: '–', mdash: '—', lsquo: '‘', rsquo: '’',
    ldquo: '“', rdquo: '”', hellip: '…', trade: '™',
    reg: '®', copy: '©', deg: '°', middot: '·',
    eacute: 'é', egrave: 'è', uuml: 'ü', ouml: 'ö',
    auml: 'ä', szlig: 'ß', shy: '', laquo: '«', raquo: '»',
    bull: '•', euro: '€', pound: '£', times: '×',
  };
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => (n in named ? named[n] : m));
}

// A PDF with a broken font encoding yields mojibake rather than text. Reject a
// string where too much of it is control characters or lone accented bytes,
// which is what that failure looks like — real CJK or European titles score low
// here because their letters are not interleaved with control codes.
function looksLikeMojibake(s) {
  if (!s) return false;
  const chars = [...s];
  if (chars.length < 8) return false;
  const ctrl = chars.filter((c) => c.codePointAt(0) < 32 || (c.codePointAt(0) >= 127 && c.codePointAt(0) < 160)).length;
  const latin1Odd = chars.filter((c) => /[ -ÿ]/.test(c)).length;
  const wordish = chars.filter((c) => /[\p{L}\p{N}\s]/u.test(c)).length;
  return ctrl / chars.length > 0.05 || latin1Odd / chars.length > 0.25 || wordish / chars.length < 0.6;
}

function cleanTitle(t) {
  if (!t) return null;
  let s = decodeEntities(t)
    .replace(/\s+/g, ' ')
    .replace(/[ ​‎‏]/g, ' ')
    .trim();
  // Strip a trailing " | Site", " - Site", " – Site", " :: Site" suffix once.
  s = s.replace(/\s*[|–—·•]\s*[^|–—·•]{2,60}$/, (m, off, full) => {
    // Only strip when there is enough title left.
    return off > 18 ? '' : m;
  });
  s = s.replace(/\s+$/, '').replace(/[\s\-|–]+$/, '').trim();
  return s || null;
}

// Titles a bot wall or an error page serves instead of the document's own.
const WALL_TITLE =
  /^(access denied|just a moment|forbidden|403|404|401|429|error\b|page not found|not found|attention required|are you a robot|robot check|请稍候|security check|redirecting|challenge|blocked|service unavailable|bad gateway|site maintenance|sec\.gov \||azure waf|cloudflare|incapsula|request rejected|the request could not be satisfied)/i;

// "K&S - 404", "Something | Page not found": the error marker can also come last.
const WALL_SUFFIX = /[\s|–—-]+(404|page not found|not found|error)\s*$/i;

// Real page titles that name no document: a bare "Home", "Index", "Untitled",
// or a language switcher's label standing in for the page.
const GENERIC_TITLE =
  /^(home|home ?page|index|untitled|document|default|welcome|main|top|english|en|global)$/i;

const JUNK_TITLE = new RegExp(
  `(${WALL_TITLE.source})|(${GENERIC_TITLE.source})|(${WALL_SUFFIX.source})`,
  'i'
);

// Pull the content of a <meta> tag. `key` is the attribute value to look for
// (og:title, article:published_time, ...) matched on name=, property=, or
// itemprop=. The quote character is captured and required to close, so a title
// containing an apostrophe ("NVIDIA's B200...") is not cut short — the bug this
// replaced a hand-written pattern list to avoid.
function metaTag(html, key) {
  // Cheap reject first: without this, a key that is absent from a 400 KB page
  // still costs a full backtracking scan for every candidate <meta.
  if (!html.includes(key)) return null;
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Named groups keep the two orderings (attr-then-content, content-then-attr)
  // from renumbering the backreferences that close each quote. The value is
  // bounded and excludes angle brackets so it cannot run past its own tag.
  const attr = `(?:name|property|itemprop)\\s*=\\s*(?<aq>["'])${k}\\k<aq>`;
  const content = `content\\s*=\\s*(?<cq>["'])(?<val>[^<>]{0,600}?)\\k<cq>`;
  for (const re of [
    new RegExp(`<meta[^>]*?${attr}[^>]*?${content}[^>]*>`, 'i'),
    new RegExp(`<meta[^>]*?${content}[^>]*?${attr}[^>]*>`, 'i'),
  ]) {
    const m = html.match(re);
    if (m && m.groups) {
      const v = decodeEntities((m.groups.val || '').trim());
      // Some sites ship an unrendered template placeholder here.
      if (v && !/^%%.*%%$/.test(v) && !/^\{\{.*\}\}$/.test(v)) return v;
    }
  }
  return null;
}

function metaContent(html, keysOrPatterns) {
  for (const k of keysOrPatterns) {
    const v = typeof k === 'string' ? metaTag(html, k) : (html.match(k) || [])[1];
    if (v && String(v).trim()) return typeof k === 'string' ? v : decodeEntities(String(v).trim());
  }
  return null;
}

function normaliseDate(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  let m;
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return `${m[1]}-${m[2]}-${m[3]}`;
  if ((m = s.match(/^(\d{4})[-/](\d{1,2})$/))) return `${m[1]}-${String(m[2]).padStart(2, '0')}`;
  if ((m = s.match(/^(\d{4})$/))) return m[1];
  if ((m = s.match(/^(\d{8})$/))) return `${m[1].slice(0, 4)}-${m[1].slice(4, 6)}-${m[1].slice(6, 8)}`;
  // D:20240115... (PDF date)
  if ((m = s.match(/^D:(\d{4})(\d{2})(\d{2})/))) return `${m[1]}-${m[2]}-${m[3]}`;
  // Drupal's "Tue, 10/11/2022 - 12:00" (US month/day/year), used by CSIS.
  if ((m = s.match(/(?:^|,\s*)(\d{1,2})\/(\d{1,2})\/((?:19|20)\d{2})/))) {
    return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
  }
  const d = new Date(s);
  if (!isNaN(d.getTime()) && d.getFullYear() > 1990 && d.getFullYear() < 2100) {
    return d.toISOString().slice(0, 10);
  }
  return null;
}

function extractFromHtml(html) {
  const out = { title: null, date: null, siteName: null };

  const ogTitle = metaContent(html, [
    'og:title',
    'twitter:title',
    'citation_title',
    'dc.title',
    'DC.title',
    'title',
  ]);
  const tagTitle = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];

  out.title =
    cleanTitle(ogTitle) ||
    cleanTitle(tagTitle && tagTitle.replace(/<[^>]+>/g, '')) ||
    cleanTitle(h1 && h1.replace(/<[^>]+>/g, ''));
  out.rawTitle = decodeEntities((tagTitle || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()) || null;

  const dateRaw = metaContent(html, [
    'article:published_time',
    'og:published_time',
    'datePublished',
    'citation_publication_date',
    'citation_date',
    'publish-date',
    'publish_date',
    'publication-date',
    'publication_date',
    'pubdate',
    'sailthru.date',
    'dc.date',
    'DC.date',
    'DC.date.issued',
    'date',
    // Pagefind index metadata (Epoch AI and other Astro sites)
    'pagefind:date',
    // Nikkei / Newsvault and Sitecore style
    'nv-pub-date',
    'sc:publication_date',
    /<time[^>]+datetime=["']([^"']+)["']/i,
  ]);
  out.date = normaliseDate(dateRaw);

  if (!out.date) {
    // JSON-LD datePublished, then a bare "date" field
    const ld =
      html.match(/"datePublished"\s*:\s*"([^"]+)"/i) || html.match(/"date"\s*:\s*"((?:19|20)\d{2}[^"]{0,25})"/i);
    if (ld) out.date = normaliseDate(ld[1]);
  }
  if (!out.date) {
    const mod = metaContent(html, ['article:modified_time', 'og:updated_time', 'last-modified', 'lastmodified']);
    if (mod) out.dateModified = normaliseDate(mod);
  }

  out.siteName = metaContent(html, [
    'og:site_name',
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']citation_journal_title["'][^>]+content=["']([^"']+)["']/i,
  ]);

  return out;
}

// PyMuPDF, when present, reads the document properties and the first page of
// real text — far better than guessing at content streams. Falls back to the
// pure-JS peek below when Python or the module is missing.
const PY_PDF = `
import sys, json
try:
    import pymupdf as fitz
except Exception:
    import fitz
doc = fitz.open(sys.argv[1])
meta = doc.metadata or {}
lines = []
if doc.page_count:
    text = doc.load_page(0).get_text("text")
    lines = [l.strip() for l in text.splitlines() if l.strip()]
print(json.dumps({
    "title": meta.get("title") or None,
    "author": meta.get("author") or None,
    "subject": meta.get("subject") or None,
    "creationDate": meta.get("creationDate") or None,
    "modDate": meta.get("modDate") or None,
    "pages": doc.page_count,
    "lines": lines[:25],
}))
`;

let PY_PDF_OK = null;
function extractPdfWithPython(file) {
  if (PY_PDF_OK === false) return null;
  const r = spawnSync('python3', ['-c', PY_PDF, file], { encoding: 'utf8', timeout: 60000 });
  if (r.status !== 0 || !r.stdout) {
    if (/ModuleNotFoundError|No module named/.test(r.stderr || '')) PY_PDF_OK = false;
    return null;
  }
  PY_PDF_OK = true;
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
}

// Very small PDF text peek: pull /Title from the Info dictionary or XMP, and
// the first readable text run from an uncompressed or FlateDecode stream.
function extractFromPdf(buf) {
  const out = { title: null, date: null, firstLine: null };
  const head = buf.toString('latin1');

  let m = head.match(/\/Title\s*\(((?:[^()\\]|\\.)*)\)/);
  if (m) {
    let t = m[1].replace(/\\([()\\])/g, '$1');
    if (/^\xfe\xff/.test(t)) {
      t = Buffer.from(t, 'latin1').slice(2).swap16().toString('utf16le');
    }
    out.title = cleanTitle(t);
  }
  if (!out.title) {
    m = head.match(/<dc:title>[\s\S]*?<rdf:li[^>]*>([\s\S]*?)<\/rdf:li>/i);
    if (m) out.title = cleanTitle(m[1].replace(/<[^>]+>/g, ''));
  }
  m = head.match(/\/CreationDate\s*\(([^)]+)\)/) || head.match(/<xmp:CreateDate>([^<]+)</i);
  if (m) out.date = normaliseDate(m[1]);
  const mm = head.match(/<xmp:ModifyDate>([^<]+)</i);
  if (mm) out.dateModified = normaliseDate(mm[1]);

  // First text run: decompress the first few Flate streams and read Tj/TJ text.
  const chunks = [];
  const streamRe = /stream\r?\n/g;
  let sm;
  let tried = 0;
  while ((sm = streamRe.exec(head)) && tried < 12 && chunks.length < 40) {
    tried++;
    const start = sm.index + sm[0].length;
    const end = head.indexOf('endstream', start);
    if (end < 0) break;
    let raw = buf.slice(start, end);
    let text = null;
    try {
      text = zlib.inflateSync(raw).toString('latin1');
    } catch {
      const s = raw.toString('latin1');
      if (/\(|Tj|TJ/.test(s)) text = s;
    }
    if (!text) continue;
    for (const t of text.matchAll(/\(((?:[^()\\]|\\.){1,200})\)\s*(?:Tj|TJ|')/g)) {
      const piece = t[1].replace(/\\([()\\])/g, '$1').replace(/\\[0-7]{1,3}/g, ' ');
      if (piece.trim()) chunks.push(piece);
      if (chunks.length >= 40) break;
    }
  }
  if (chunks.length) {
    const line = chunks.join('').replace(/\s+/g, ' ').trim();
    out.firstLine = line.slice(0, 200) || null;
  }
  return out;
}

// A PDF's title is, in order of trust: its Info-dictionary /Title, then the
// first substantial line of text on page one (which is what a reader sees as
// the heading). Boilerplate first lines are skipped.
const PDF_SKIP_LINE =
  /^(page\s*\d|\d+$|confidential|draft|for immediate release|press release|news release|table of contents|contents|©|copyright|all rights reserved|www\.|https?:|\(|\[|—|-{2,}|\.{3,})/i;

function extractPdf(url, buf) {
  const file = bodyPath(url, '.pdf');
  if (!fs.existsSync(file)) {
    try {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
      fs.writeFileSync(file, buf);
    } catch {}
  }
  const py = extractPdfWithPython(file);
  if (py) {
    const lines = (py.lines || []).map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
    let heading = null;
    for (const l of lines) {
      if (l.length < 6 || l.length > 200) continue;
      if (PDF_SKIP_LINE.test(l)) continue;
      heading = l;
      break;
    }
    // A heading often wraps onto the next line; join when the first is short
    // and the next continues it in the same register.
    if (heading && heading.length < 45) {
      const i = lines.indexOf(heading);
      const next = lines[i + 1];
      if (next && next.length < 90 && !PDF_SKIP_LINE.test(next) && !/[.:;]$/.test(heading)) {
        heading = `${heading} ${next}`.trim();
      }
    }
    const metaTitle = cleanTitle(py.title);
    return {
      title: metaTitle && metaTitle.length > 4 && !JUNK_TITLE.test(metaTitle) ? metaTitle : cleanTitle(heading),
      metaTitle,
      firstLine: heading,
      author: py.author || null,
      subject: py.subject || null,
      pages: py.pages || null,
      date: normaliseDate(py.creationDate),
      dateModified: normaliseDate(py.modDate),
      via: 'pymupdf',
    };
  }
  return { ...extractFromPdf(buf), via: 'js' };
}

// ------------------------------------------------------------ classification

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

function guessPublisher(url, extracted) {
  const host = hostOf(url);
  if (PUBLISHERS[host]) return PUBLISHERS[host];
  // Fall back to og:site_name, then a tidied hostname.
  if (extracted && extracted.siteName && extracted.siteName.length < 60) {
    return extracted.siteName;
  }
  const base = host.split('.').filter((p) => !['com', 'org', 'net', 'gov', 'edu', 'co', 'io', 'ai', 'jp', 'tw', 'kr', 'cn', 'uk', 'eu', 'de', 'nl', 'www'].includes(p));
  const word = base[base.length - 1] || host;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Hosts whose every page is the same kind of document, so the path says nothing
// extra. Checked after the PDF test and before the path patterns.
const HOST_TYPE = {
  'reuters.com': 'article',
  'asia.nikkei.com': 'article',
  'ft.com': 'article',
  'technode.com': 'article',
  'eetimes.com': 'article',
  'eetasia.com': 'article',
  'semianalysis.com': 'article',
  'newsletter.semianalysis.com': 'article',
  'inferencex.semianalysis.com': 'article',
  'arxiv.org': 'report',
  'prnewswire.com': 'press release',
  'globenewswire.com': 'press release',
  'businesswire.com': 'press release',
  'rand.org': 'report',
  'cfr.org': 'report',
  'stimson.org': 'report',
  'bcg.com': 'report',
  'ifp.org': 'report',
};

function guessType(url, rec) {
  const u = url.toLowerCase();
  const host = hostOf(url);
  if (rec && rec.isPdf) return 'pdf';
  if (u.endsWith('.pdf')) return 'pdf';
  if (HOST_TYPE[host]) return HOST_TYPE[host];
  if (host === 'epoch.ai') {
    if (u.includes('/publications/')) return 'report';
    if (u.includes('/blog/') || u.includes('/data-insights/')) return 'article';
  }
  if (host === 'sec.gov' || host === 'data.sec.gov' || u.includes('/edgar/')) return 'filing';
  if (host === 'federalregister.gov' || host === 'ecfr.gov' || host === 'eur-lex.europa.eu' || u.includes('/federal-register/')) return 'regulation';
  if (host === 'congress.gov') return 'regulation';
  if (/news-release|press-release|pressrelease|\/news\/|newsroom|press\/|\/pr\//.test(u)) return 'press release';
  if (/transcript/.test(u)) return 'transcript';
  if (/\.(csv|json|xlsx?|zip)$/.test(u)) return 'dataset';
  if (/\/(publication|report|analysis|research)s?\//.test(u)) return 'report';
  if (/\/(news|article|story|blog|posts?)\//.test(u)) return 'article';
  return 'page';
}

// Path segments that carry no meaning of their own.
const NOISE_SEG = /^(en|en-us|en_us|us|eng|english|global|www|index|home|site|default|content|pages?|ww|worldwide|jp|kr|tw|cn|de|nl)$/i;

// Last resort: read the URL's own path as a title. Marked unverified wherever
// it is used, because it is our words rather than the document's.
function titleFromPath(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    const org = PUBLISHERS[host] || null;
    const segs = u.pathname
      .split('/')
      .filter(Boolean)
      .map((s) => decodeURIComponent(s))
      .filter((s) => !NOISE_SEG.test(s));

    // Nothing meaningful in the path: this is the organisation's front page.
    if (!segs.length) return org ? `${org} home page` : `${host} home page`;

    let last = segs[segs.length - 1].replace(/\.(html?|php|aspx?|pdf|json|csv|xml|htm)$/i, '');
    last = last.replace(/[-_+]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!last || /^\d+$/.test(last)) {
      last = segs.slice(-2).join(' ').replace(/[-_+]/g, ' ').trim();
    }
    if (!last) return org ? `${org} home page` : `${host} home page`;
    const phrase = last.charAt(0).toUpperCase() + last.slice(1);
    return org ? `${phrase} (${org} website)` : phrase;
  } catch {
    return url;
  }
}

// --------------------------------------------------- authoritative resolvers
// Two sources answer with structured metadata rather than a scraped page, so
// they get their own pass: the Federal Register document API and the SEC's
// EDGAR submissions API. Both are the publisher's own record of the document.

// GovInfo serves each Federal Register document as .../pdf/<num>.pdf and .../html/<num>.htm; the HTML
// page's own <title> is only the issue ("Federal Register, Volume 83 Issue 78 ..."), so resolve it too.
const FR_DOC_RE = /(?:\/documents\/\d{4}\/\d{2}\/\d{2}\/|\/pdf\/|\/html\/)((?:19|20)\d{2}-\d{3,6})(?:\/|\.pdf|\.htm)/;

function frDocNumber(url) {
  const m = url.match(FR_DOC_RE);
  return m ? m[1] : null;
}

async function jsonGet(url, cacheKey) {
  const p = path.join(CACHE_DIR, cacheKey + '.json');
  if (fs.existsSync(p)) {
    try {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {}
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(p, JSON.stringify(data));
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function resolveFederalRegister(urls) {
  const out = {};
  const targets = urls.filter((u) => /federalregister\.gov|govinfo\.gov\/content\/pkg\/FR-/.test(u) && frDocNumber(u));
  for (const url of targets) {
    const num = frDocNumber(url);
    const doc = await jsonGet(
      `https://www.federalregister.gov/api/v1/documents/${num}.json?fields[]=title&fields[]=publication_date&fields[]=type&fields[]=agencies&fields[]=document_number`,
      'fr-' + num
    );
    if (!doc || !doc.title) continue;
    const agencies = (doc.agencies || []).map((a) => a.name).filter(Boolean);
    const isGovinfo = url.includes('govinfo.gov');
    out[url] = {
      title: doc.title,
      publisher: isGovinfo
        ? 'U.S. Government Publishing Office (Federal Register)'
        : agencies.length
          ? `Federal Register (${agencies.join('; ')})`
          : 'Federal Register',
      date: doc.publication_date || null,
      type: isGovinfo && /\.pdf$/i.test(url) ? 'pdf' : 'regulation',
    };
  }
  return out;
}

// /Archives/edgar/data/<cik>/<accession-without-dashes>/<file>
const SEC_RE = /\/Archives\/edgar\/data\/(\d+)\/(\d{18})\/?(.*)$/;

function secParts(url) {
  const m = url.match(SEC_RE);
  if (!m) return null;
  return { cik: String(parseInt(m[1], 10)), accession: m[2], file: m[3] || '' };
}

function accessionDashed(a) {
  return `${a.slice(0, 10)}-${a.slice(10, 12)}-${a.slice(12)}`;
}

// A form type plus the period it covers, in the terms EDGAR itself uses.
function secTitle(company, form, reportDate, filingDate, description) {
  const period = reportDate || filingDate || null;
  let what = `Form ${form}`;
  if (/10-K/.test(form)) what = `Form ${form} annual report`;
  else if (/10-Q/.test(form)) what = `Form ${form} quarterly report`;
  else if (/20-F/.test(form)) what = `Form ${form} annual report`;
  else if (/^8-K/.test(form)) what = `Form ${form} current report`;
  else if (/^6-K/.test(form)) what = `Form ${form} report of foreign private issuer`;
  else if (/424B/.test(form)) what = `Form ${form} prospectus`;
  let t = `${company}, ${what}`;
  if (period) t += /10-K|20-F/.test(form) ? ` for the period ended ${period}` : ` for the period ended ${period}`;
  if (description && description.length < 90 && !/^Form/i.test(description)) {
    t += ` (${description})`;
  }
  return t;
}

async function resolveSec(urls) {
  const out = {};
  const targets = urls.filter((u) => /(^|\/\/)(www\.)?sec\.gov\//.test(u) && secParts(u));
  const byCik = new Map();
  for (const url of targets) {
    const p = secParts(url);
    if (!byCik.has(p.cik)) byCik.set(p.cik, []);
    byCik.get(p.cik).push({ url, ...p });
  }

  for (const [cik, items] of byCik) {
    const padded = cik.padStart(10, '0');
    const sub = await jsonGet(`https://data.sec.gov/submissions/CIK${padded}.json`, 'sec-CIK' + padded);
    if (!sub) continue;
    const company = sub.name || null;

    // Index every filing this company has on file, recent plus the archives.
    const index = new Map();
    const addBlock = (b) => {
      if (!b || !b.accessionNumber) return;
      for (let i = 0; i < b.accessionNumber.length; i++) {
        index.set(b.accessionNumber[i].replace(/-/g, ''), {
          form: b.form[i],
          filingDate: b.filingDate[i],
          reportDate: b.reportDate ? b.reportDate[i] : null,
          primaryDocDescription: b.primaryDocDescription ? b.primaryDocDescription[i] : null,
        });
      }
    };
    addBlock(sub.filings && sub.filings.recent);

    const missing = () => items.some((it) => !index.has(it.accession));
    if (missing() && sub.filings && Array.isArray(sub.filings.files)) {
      for (const f of sub.filings.files) {
        if (!missing()) break;
        const extra = await jsonGet(`https://data.sec.gov/submissions/${f.name}`, 'sec-' + f.name.replace(/\.json$/, ''));
        addBlock(extra);
      }
    }

    for (const it of items) {
      const f = index.get(it.accession);
      if (!f || !company) continue;
      // R##.htm files are single statements inside the XBRL financial report.
      const rMatch = it.file.match(/^R(\d+)\.htm$/i);
      let title = secTitle(company, f.form, f.reportDate, f.filingDate, f.primaryDocDescription);
      if (rMatch) {
        title = `${secTitle(company, f.form, f.reportDate, f.filingDate, null)} (financial statement R${rMatch[1]})`;
      }
      out[it.url] = {
        title,
        publisher: `U.S. Securities and Exchange Commission (filing by ${company})`,
        date: f.filingDate || null,
        type: 'filing',
        accession: accessionDashed(it.accession),
      };
    }
  }
  return out;
}

// data.sec.gov XBRL "company concept" endpoints are datasets, not pages: the
// JSON itself carries the filer's name and the accounting tag's own label.
async function resolveSecXbrl(urls) {
  const out = {};
  const re = /data\.sec\.gov\/api\/xbrl\/companyconcept\/CIK(\d{10})\/([^/]+)\/([^/]+)\.json/;
  for (const url of urls) {
    const m = url.match(re);
    if (!m) continue;
    const data = await jsonGet(url, 'xbrl-' + m[1] + '-' + m[2] + '-' + m[3]);
    if (!data) continue;
    const entity = data.entityName || null;
    const label = data.label || m[3];
    if (!entity) continue;
    out[url] = {
      title: `${label} (${m[2]}:${m[3]}) reported by ${entity}, XBRL company concept data`,
      publisher: `U.S. Securities and Exchange Commission (XBRL data for ${entity})`,
      date: null,
      type: 'dataset',
    };
  }
  return out;
}

// ------------------------------------------------------------------- driving

async function pool(items, n, worker) {
  const queue = items.slice();
  let done = 0;
  const total = items.length;
  const runners = Array.from({ length: Math.min(n, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      await worker(item);
      done++;
      if (done % 20 === 0 || done === total) {
        process.stderr.write(`  ${done}/${total}\n`);
      }
    }
  });
  await Promise.all(runners);
}

async function main() {
  const args = process.argv.slice(2);
  const listOnly = args.includes('--list');
  const refetch = args.includes('--refetch');
  const onlyArg = args.find((a) => a.startsWith('--only='));
  const only = onlyArg ? onlyArg.slice('--only='.length) : null;

  const found = collectUrls();
  let urls = [...found.keys()].sort();
  if (only) urls = urls.filter((u) => u.includes(only));

  if (listOnly) {
    urls.forEach((u) => console.log(u));
    console.error(`\n${urls.length} unique URLs`);
    return;
  }

  console.error(`Collected ${urls.length} unique URLs. Fetching...`);
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const wantBodies = args.includes('--bodies');
  const hasBody = (u) => fs.existsSync(bodyPath(u, '.pdf')) || fs.existsSync(bodyPath(u, '.html'));

  await pool(urls, CONCURRENCY, async (url) => {
    const cached = readCache(url);
    const needBody = wantBodies && cached && cached.status >= 200 && cached.status < 400 && !hasBody(url);
    const cacheOk = cached && cached.status >= 200 && cached.status < 400 && cached.extracted;
    if (cacheOk && !refetch && !needBody) return;
    if (cached && !refetch && !needBody && cached.status !== 0) return; // keep recorded failure
    const res = await withDeadline(fetchUrl(url), TIMEOUT_MS + 5000, url);
    const record = {
      url,
      status: res.status,
      finalUrl: res.finalUrl || url,
      contentType: res.contentType || null,
      lastModified: res.lastModified || null,
      error: res.error || null,
      fetchedAt: new Date().toISOString(),
      extracted: null,
    };
    if (res.body && res.body.length) {
      writeBody(url, res.body, res.isPdf);
      try {
        record.extracted = res.isPdf
          ? { kind: 'pdf', ...extractPdf(url, res.body) }
          : { kind: 'html', ...extractFromHtml(res.body.toString('utf8')) };
      } catch (e) {
        record.extractError = String(e.message || e);
      }
    }
    writeCache(url, record);
  });

  // Re-run extraction over anything already cached whose body we kept, so an
  // improved extractor benefits old entries without re-fetching.
  console.error('Re-extracting cached bodies...');
  const forceReextract = args.includes('--reextract');
  let reExtracted = 0;
  for (const url of urls) {
    const rec = readCache(url);
    if (!rec) continue;
    const complete = rec.extracted && rec.extracted.title && rec.extracted.date;
    if (complete && !forceReextract) continue;
    const pdf = bodyPath(url, '.pdf');
    const html = bodyPath(url, '.html');
    try {
      if (fs.existsSync(pdf)) {
        // Re-reading a PDF costs a Python process and, for a 15 MB annual
        // report, real time. Only do it when the last read produced nothing.
        if (rec.extracted && rec.extracted.via === 'pymupdf' && rec.extracted.title) continue;
        rec.extracted = { kind: 'pdf', ...extractPdf(url, fs.readFileSync(pdf)) };
      } else if (fs.existsSync(html)) {
        rec.extracted = { kind: 'html', ...extractFromHtml(fs.readFileSync(html, 'utf8')) };
      } else {
        continue;
      }
    } catch {
      continue;
    }
    writeCache(url, rec);
    if (rec.extracted && rec.extracted.title) reExtracted++;
  }
  console.error(`  ${reExtracted} titles recovered`);

  // -------------------------------------------------- authoritative passes
  console.error('Resolving Federal Register documents...');
  const frResolved = await resolveFederalRegister(urls);
  console.error(`  ${Object.keys(frResolved).length} resolved`);
  console.error('Resolving SEC EDGAR filings...');
  const secResolved = await resolveSec(urls);
  console.error(`  ${Object.keys(secResolved).length} resolved`);
  console.error('Resolving SEC XBRL company-concept datasets...');
  const xbrlResolved = await resolveSecXbrl(urls);
  console.error(`  ${Object.keys(xbrlResolved).length} resolved`);

  // ------------------------------------------------------------ assemble
  const overrides = MANUAL;

  const bib = {};
  const stats = { total: urls.length, verified: 0, dated: 0, unverified: 0, overridden: 0 };

  for (const url of urls) {
    const ov = overrides[url];
    const auth = secResolved[url] || frResolved[url] || xbrlResolved[url] || null;
    const rec = readCache(url);
    const ex = rec && rec.extracted;
    let title = null;
    let date = null;
    let unverified = false;

    if (ex) {
      if (ex.kind === 'pdf') {
        title = ex.title || (ex.firstLine ? cleanTitle(ex.firstLine.slice(0, 160)) : null);
      } else {
        title = ex.title;
      }
      date = ex.date || null;
    }
    // "Home | ASM" cleans down to "Home", which says nothing. When the trimmed
    // title is useless but the page's untrimmed <title> is not, keep the whole
    // thing: it is still the document's own words.
    if (ex && ex.kind === 'html' && (!title || JUNK_TITLE.test(title)) && ex.rawTitle) {
      const raw = ex.rawTitle.replace(/\s*[|–—-]\s*$/, '').trim();
      if (raw && raw.length > 6 && !WALL_TITLE.test(raw) && !WALL_SUFFIX.test(raw) && !GENERIC_TITLE.test(raw)) {
        title = raw;
      }
    }
    if (!title || title.length < 3 || JUNK_TITLE.test(title) || looksLikeMojibake(title)) {
      title = null;
      date = null;
      unverified = true;
    }

    // The publisher's own structured record beats anything scraped off a page.
    if (auth) {
      title = auth.title;
      date = auth.date || date;
      unverified = false;
    }
    if (!title) title = titleFromPath(url);

    const entry = {
      title,
      publisher: (auth && auth.publisher) || guessPublisher(url, ex),
      date: date || null,
      type: (auth && auth.type) || guessType(url, rec),
      accessed: ACCESSED,
    };
    if (unverified) entry.unverified = true;

    if (ov) {
      stats.overridden++;
      Object.assign(entry, ov);
      if (ov.unverified === false || (!('unverified' in ov) && ov.title)) delete entry.unverified;
      if (ov.unverified === true) entry.unverified = true;
    }

    if (!entry.date) delete entry.date;
    // Keep a stable key order.
    const ordered = {
      title: entry.title,
      publisher: entry.publisher,
      ...(entry.date ? { date: entry.date } : {}),
      type: entry.type,
      accessed: entry.accessed,
      ...(entry.unverified ? { unverified: true } : {}),
    };
    bib[url] = ordered;

    if (!ordered.unverified) stats.verified++;
    else stats.unverified++;
    if (ordered.date) stats.dated++;
  }

  // with --only, keep every entry the run did not touch: a partial harvest must never shrink the bibliography
  if (only && fs.existsSync(OUT_FILE)) { try { const prev = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')); for (const u of Object.keys(prev)) if (!(u in bib)) bib[u] = prev[u]; } catch (e) { } }
  fs.writeFileSync(OUT_FILE, JSON.stringify(bib, null, 2) + '\n');
  console.error(
    `\nWrote ${path.relative(ROOT, OUT_FILE)}\n` +
      `  urls:       ${stats.total}\n` +
      `  verified:   ${stats.verified}\n` +
      `  with date:  ${stats.dated}\n` +
      `  unverified: ${stats.unverified}\n` +
      `  overrides:  ${stats.overridden}`
  );
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { collectUrls, extractFromHtml, extractFromPdf, normaliseDate, cleanTitle, titleFromPath };

// -------------------------------------------------------- publisher mapping
// Hostname -> the organisation that published the document. Filled in by hand
// so citations name a body, not a domain.
const PUBLISHERS = {
  // --- governments and regulators
  'sec.gov': 'U.S. Securities and Exchange Commission',
  'data.sec.gov': 'U.S. Securities and Exchange Commission',
  'federalregister.gov': 'Federal Register',
  'ecfr.gov': 'Electronic Code of Federal Regulations',
  'govinfo.gov': 'U.S. Government Publishing Office',
  'bis.gov': 'U.S. Bureau of Industry and Security',
  'commerce.gov': 'U.S. Department of Commerce',
  'energy.gov': 'U.S. Department of Energy',
  'justice.gov': 'U.S. Department of Justice',
  'whitehouse.gov': 'The White House',
  'bidenwhitehouse.archives.gov': 'The White House (Biden administration archive)',
  'congress.gov': 'U.S. Congress',
  'chinaselectcommittee.house.gov': 'U.S. House Select Committee on the Chinese Communist Party',
  'huizenga.house.gov': 'U.S. House of Representatives (Office of Rep. Bill Huizenga)',
  'foreign.senate.gov': 'U.S. Senate Committee on Foreign Relations',
  'epw.senate.gov': 'U.S. Senate Committee on Environment and Public Works',
  'finance.senate.gov': 'U.S. Senate Committee on Finance',
  'usitc.gov': 'U.S. International Trade Commission',
  'hts.usitc.gov': 'U.S. International Trade Commission',
  'gov.texas.gov': 'Office of the Texas Governor',
  'meti.go.jp': 'Ministry of Economy, Trade and Industry (Japan)',
  'files.gao.gov': 'U.S. Government Accountability Office',
  'eia.gov': 'U.S. Energy Information Administration',
  'pubs.usgs.gov': 'U.S. Geological Survey',
  'usgs.gov': 'U.S. Geological Survey',
  'docs.fcc.gov': 'U.S. Federal Communications Commission',
  'newscenter.lbl.gov': 'Lawrence Berkeley National Laboratory',
  'government.nl': 'Government of the Netherlands',
  'digital-strategy.ec.europa.eu': 'European Commission',
  'ec.europa.eu': 'European Commission',
  'eur-lex.europa.eu': 'Official Journal of the European Union',
  'echa.europa.eu': 'European Chemicals Agency',
  'english.mofcom.gov.cn': "Ministry of Commerce of the People's Republic of China",
  'mofcom.gov.cn': "Ministry of Commerce of the People's Republic of China",
  'exportcontrol.mofcom.gov.cn': "Ministry of Commerce of the People's Republic of China",
  'english.www.gov.cn': "The State Council of the People's Republic of China",
  'pib.gov.in': 'Press Information Bureau, Government of India',
  'rieti.go.jp': 'Research Institute of Economy, Trade and Industry (Japan)',
  'mida.gov.my': 'Malaysian Investment Development Authority',
  'miti.gov.my': 'Ministry of Investment, Trade and Industry (Malaysia)',
  'azcommerce.com': 'Arizona Commerce Authority',
  'phoenix.gov': 'City of Phoenix',
  'ercot.com': 'Electric Reliability Council of Texas',
  'disc.static.szse.cn': 'Shenzhen Stock Exchange',

  // --- research bodies, standards groups, trade associations
  'cset.georgetown.edu': 'Center for Security and Emerging Technology (CSET)',
  'csis.org': 'Center for Strategic and International Studies',
  'rand.org': 'RAND Corporation',
  'cfr.org': 'Council on Foreign Relations',
  'stimson.org': 'Stimson Center',
  'brookings.edu': 'Brookings Institution',
  'ifp.org': 'Institute for Progress',
  'epoch.ai': 'Epoch AI',
  'chipexplorer.eto.tech': 'Emerging Technology Observatory (ETO)',
  'bcg.com': 'Boston Consulting Group',
  'semiconductors.org': 'Semiconductor Industry Association',
  'semi.org': 'SEMI',
  'wsts.org': 'World Semiconductor Trade Statistics',
  'jedec.org': 'JEDEC Solid State Technology Association',
  'arxiv.org': 'arXiv',
  'web.ece.ucsb.edu': 'University of California, Santa Barbara',
  'purdue.edu': 'Purdue University',
  'imec-int.com': 'imec',
  'riscv.org': 'RISC-V International',
  'uciexpress.org': 'UCIe Consortium',
  'ualinkconsortium.org': 'UALink Consortium',
  'ultraethernet.org': 'Ultra Ethernet Consortium',

  // --- news and newsletters
  'reuters.com': 'Reuters',
  'asia.nikkei.com': 'Nikkei Asia',
  'ft.com': 'Financial Times',
  'newsletter.semianalysis.com': 'SemiAnalysis',
  'semianalysis.com': 'SemiAnalysis',
  'inferencex.semianalysis.com': 'SemiAnalysis',
  'prnewswire.com': 'PR Newswire',
  'globenewswire.com': 'GlobeNewswire',
  'businesswire.com': 'Business Wire',
  'technode.com': 'TechNode',
  'eetimes.com': 'EE Times',
  'eetasia.com': 'EE Times Asia',

  // --- chip designers and platform firms
  'nvidia.com': 'Nvidia',
  'nvidianews.nvidia.com': 'Nvidia',
  'developer.nvidia.com': 'Nvidia',
  'blogs.nvidia.com': 'Nvidia',
  'docs.nvidia.com': 'Nvidia',
  'amd.com': 'AMD',
  'ir.amd.com': 'AMD',
  'rocm.blogs.amd.com': 'AMD',
  'intel.com': 'Intel',
  'intc.com': 'Intel',
  'download.intel.com': 'Intel',
  'docs.habana.ai': 'Intel (Habana Labs)',
  'broadcom.com': 'Broadcom',
  'investors.broadcom.com': 'Broadcom',
  'docs.broadcom.com': 'Broadcom',
  'marvell.com': 'Marvell Technology',
  'qualcomm.com': 'Qualcomm',
  'corp.mediatek.com': 'MediaTek',
  'newsroom.arm.com': 'Arm',
  'investors.arm.com': 'Arm',
  'rambus.com': 'Rambus',
  'awavesemi.com': 'Alphawave Semi',
  'sifive.com': 'SiFive',
  'imaginationtech.com': 'Imagination Technologies',
  'alchip.com': 'Alchip Technologies',
  'guc-asic.com': 'Global Unichip Corporation (GUC)',
  'hisilicon.com': 'HiSilicon',
  'huawei.com': 'Huawei',
  'hygon.cn': 'Hygon Information Technology',
  'cambricon.com': 'Cambricon Technologies',
  'birentech.com': 'Biren Technology',
  'metax-tech.com': 'MetaX',
  'iluvatar.com': 'Iluvatar CoreX',
  'mthreads.com': 'Moore Threads',
  'en.mthreads.com': 'Moore Threads',
  'tenstorrent.com': 'Tenstorrent',
  'sambanova.ai': 'SambaNova Systems',
  'cerebras.ai': 'Cerebras Systems',
  'groq.com': 'Groq',
  'd-matrix.ai': 'd-Matrix',
  'etched.com': 'Etched',
  'rebellions.ai': 'Rebellions',
  'furiosa.ai': 'FuriosaAI',
  'lightmatter.co': 'Lightmatter',
  'ayarlabs.com': 'Ayar Labs',
  'asteralabs.com': 'Astera Labs',
  'credosemi.com': 'Credo Technology Group',
  'monolithicpower.com': 'Monolithic Power Systems',
  'infineon.com': 'Infineon Technologies',

  // --- hyperscalers and model developers
  'cloud.google.com': 'Google Cloud',
  'docs.cloud.google.com': 'Google Cloud',
  'blog.google': 'Google',
  'aws.amazon.com': 'Amazon Web Services',
  'awsdocs-neuron.readthedocs-hosted.com': 'Amazon Web Services',
  'azure.microsoft.com': 'Microsoft Azure',
  'blogs.microsoft.com': 'Microsoft',
  'techcommunity.microsoft.com': 'Microsoft',
  'engineering.fb.com': 'Meta',
  'about.fb.com': 'Meta',
  'ai.meta.com': 'Meta',
  'openai.com': 'OpenAI',

  // --- foundries and memory makers
  'tsmc.com': 'TSMC',
  'pr.tsmc.com': 'TSMC',
  'investor.tsmc.com': 'TSMC',
  '3dfabric.tsmc.com': 'TSMC',
  'semiconductor.samsung.com': 'Samsung Electronics',
  'images.samsung.com': 'Samsung Electronics',
  'news.skhynix.com': 'SK hynix',
  'sk.com': 'SK Group',
  'micron.com': 'Micron Technology',
  'investors.micron.com': 'Micron Technology',
  'smics.com': 'SMIC',
  'huahonggrace.com': 'Hua Hong Semiconductor',
  'gf.com': 'GlobalFoundries',
  'umc.com': 'United Microelectronics Corporation (UMC)',
  'towersemi.com': 'Tower Semiconductor',
  'rapidus.inc': 'Rapidus',
  'cxmt.com': 'ChangXin Memory Technologies (CXMT)',
  'ymtc.com': 'Yangtze Memory Technologies (YMTC)',
  'kioxia-holdings.com': 'Kioxia Holdings',
  'sandisk.com': 'SanDisk',
  'nanya.com': 'Nanya Technology',
  'winbond.com': 'Winbond Electronics',

  // --- lithography, optics and equipment
  'asml.com': 'ASML',
  'ourbrand.asml.com': 'ASML',
  'zeiss.com': 'Carl Zeiss',
  'trumpf.com': 'TRUMPF',
  'vdlgroep.com': 'VDL Groep',
  'nikon.com': 'Nikon',
  'global.canon': 'Canon',
  'gigaphoton.com': 'Gigaphoton',
  'jenoptik.com': 'Jenoptik',
  'smee.com.cn': 'Shanghai Micro Electronics Equipment (SMEE)',
  'tel.com': 'Tokyo Electron',
  'lamresearch.com': 'Lam Research',
  'newsroom.lamresearch.com': 'Lam Research',
  'appliedmaterials.com': 'Applied Materials',
  'ir.appliedmaterials.com': 'Applied Materials',
  'asm.com': 'ASM International',
  'asmpt.com': 'ASMPT',
  'kokusai-electric.com': 'Kokusai Electric',
  'screen.co.jp': 'SCREEN Holdings',
  'amec-inc.com': 'Advanced Micro-Fabrication Equipment (AMEC)',
  'naura.com': 'NAURA Technology Group',
  'piotech.com': 'Piotech',
  'semes.com': 'SEMES',
  'acmrcsh.com': 'ACM Research (Shanghai)',
  'disco.co.jp': 'DISCO Corporation',
  'evgroup.com': 'EV Group',
  'suss.com': 'SUSS MicroTec',
  'kns.com': 'Kulicke & Soffa',
  'hanmisemi.com': 'Hanmi Semiconductor',
  'besi.com': 'BE Semiconductor Industries (Besi)',
  'edwardsvacuum.com': 'Edwards Vacuum',
  'mks.com': 'MKS Instruments',
  'advancedenergy.com': 'Advanced Energy Industries',
  'ichorsystems.com': 'Ichor Systems',
  'uct.com': 'Ultra Clean Holdings',
  'vatgroup.com': 'VAT Group',
  'pfeiffer-vacuum.com': 'Pfeiffer Vacuum',
  'comet.tech': 'Comet Group',
  'ferrotec.com': 'Ferrotec',

  // --- metrology, inspection and masks
  'ir.kla.com': 'KLA Corporation',
  'd1io3yog0oux5.cloudfront.net': 'KLA Corporation',
  'ontoinnovation.com': 'Onto Innovation',
  'investors.ontoinnovation.com': 'Onto Innovation',
  'novami.com': 'Nova Ltd',
  'camtek.com': 'Camtek',
  'parksystems.com': 'Park Systems',
  'skyverse.com': 'Skyverse Technology',
  'wuhanjingce.com': 'Wuhan Jingce Electronic Group',
  'hitachi-hightech.com': 'Hitachi High-Tech',
  'horiba.com': 'HORIBA',
  'lasertec.co.jp': 'Lasertec',
  'nuflare.co.jp': 'NuFlare Technology',
  'ims.co.at': 'IMS Nanofabrication',
  'photronics.com': 'Photronics',
  'toppan.com': 'TOPPAN',
  'global.dnp': 'Dai Nippon Printing',
  'hoya.com': 'HOYA',
  'agc.com': 'AGC Inc.',

  // --- wafers, silicon and chemicals
  'shinetsu.co.jp': 'Shin-Etsu Chemical',
  'sumcosi.com': 'SUMCO',
  'siltronic.com': 'Siltronic',
  'globalwafers.com': 'GlobalWafers',
  'sas-globalwafers.com': 'GlobalWafers',
  'sksiltron.com': 'SK siltron',
  'soitec.com': 'Soitec',
  'nsig.com': 'National Silicon Industry Group (NSIG)',
  'hscpoly.com': 'Hemlock Semiconductor',
  'wacker.com': 'Wacker Chemie',
  'tokuyama.co.jp': 'Tokuyama Corporation',
  // ocichem.com belongs to Ocichem S.R.L., not the Korean OCI the site cites.
  'ocichem.com': 'Ocichem S.R.L.',
  'sumitomo-chem.co.jp': 'Sumitomo Chemical',
  'jsr.co.jp': 'JSR Corporation',
  'tok.co.jp': 'Tokyo Ohka Kogyo',
  'fujifilm.com': 'Fujifilm',
  'dupont.com': 'DuPont',
  'inpria.com': 'Inpria',
  'dongjin.com': 'Dongjin Semichem',
  'soulbrain.co.kr': 'Soulbrain',
  'adeka.co.jp': 'ADEKA Corporation',
  'fujimiinc.co.jp': 'Fujimi Incorporated',
  'emdgroup.com': 'Merck KGaA (EMD Electronics)',
  'entegris.com': 'Entegris',
  'blog.entegris.com': 'Entegris',
  'resonac.com': 'Resonac',
  'jp.mitsuichemicals.com': 'Mitsui Chemicals',
  'mgc.co.jp': 'Mitsubishi Gas Chemical',
  'stella-chemifa.co.jp': 'Stella Chemifa',
  'morita-kagaku.co.jp': 'Morita Chemical Industries',
  'kantodenka.co.jp': 'Kanto Denka Kogyo',
  'jx-nmm.com': 'JX Advanced Metals',
  'linde.com': 'Linde',
  'airliquide.com': 'Air Liquide',
  'airproducts.com': 'Air Products',
  'nipponsanso-hd.co.jp': 'Nippon Sanso Holdings',
  'skspecialty.com': 'SK specialty',
  'jiccapital.co.jp': 'Japan Investment Corporation',

  // --- packaging, substrates and boards
  'amkor.com': 'Amkor Technology',
  'ir.amkor.com': 'Amkor Technology',
  'jcetglobal.com': 'JCET Group',
  'pti.com.tw': 'Powertech Technology',
  'tfme.com': 'Tongfu Microelectronics',
  'kyec.com.tw': 'King Yuan Electronics (KYEC)',
  'chipbond.com.tw': 'Chipbond Technology',
  'utacgroup.com': 'UTAC',
  'ajinomoto.co.jp': 'Ajinomoto',
  'ajinomoto.com': 'Ajinomoto',
  'ibiden.com': 'Ibiden',
  'shinko.co.jp': 'Shinko Electric Industries',
  'unimicron.com': 'Unimicron Technology',
  'kinsus.com.tw': 'Kinsus Interconnect Technology',
  'npc.com.tw': 'Nan Ya Plastics Corporation', // the site cited for Nan Ya PCB is the parent company's
  'samsungsem.com': 'Samsung Electro-Mechanics',
  'm.samsungsem.com': 'Samsung Electro-Mechanics',
  'ats.net': 'AT&S',
  'lginnotek.com': 'LG Innotek',
  'nittobo.co.jp': 'Nitto Boseki (Nittobo)',
  'industrial.panasonic.com': 'Panasonic Industry',
  'victorypcb.com': 'Victory Giant Technology',
  'wuspcb.com': 'Wus Printed Circuit',
  'gce.com.tw': 'Gold Circuit Electronics',
  'ttm.com': 'TTM Technologies',
  'corning.com': 'Corning',

  // --- test
  'advantest.com': 'Advantest',
  'teradyne.com': 'Teradyne',
  'investors.teradyne.com': 'Teradyne',
  'aehr.com': 'Aehr Test Systems',
  'formfactor.com': 'FormFactor',
  'technoprobe.com': 'Technoprobe',
  'mjc.co.jp': 'Micronics Japan (MJC)',
  'mpi-corporation.com': 'MPI Corporation',
  'cohu.com': 'Cohu',
  'chromaate.com': 'Chroma ATE',

  // --- systems, networking and optics
  'arista.com': 'Arista Networks',
  'cisco.com': 'Cisco Systems',
  'accton.com': 'Accton Technology',
  'amphenol.com': 'Amphenol',
  'luxshare-ict.com': 'Luxshare Precision',
  'coherent.com': 'Coherent',
  'lumentum.com': 'Lumentum',
  'fabrinet.com': 'Fabrinet',
  'innolight.com': 'InnoLight Technology',
  'eoptolink.com': 'Eoptolink Technology',
  'foxconn.com': 'Hon Hai Precision Industry (Foxconn)',
  'honhai.com': 'Hon Hai Precision Industry (Foxconn)',
  'qct.io': 'Quanta Cloud Technology',
  'wistron.com': 'Wistron',
  'wiwynn.com': 'Wiwynn',
  'inventec.com': 'Inventec',
  'supermicro.com': 'Supermicro',
  'dell.com': 'Dell Technologies',
  'hpe.com': 'Hewlett Packard Enterprise',
  'lenovo.com': 'Lenovo',
  'celestica.com': 'Celestica',
  'jabil.com': 'Jabil',
  'blogs.sw.siemens.com': 'Siemens Digital Industries Software',
  'ansys.com': 'Ansys',
  'empyrean.com.cn': 'Empyrean Technology',
  'primarius-tech.com': 'Primarius Technologies',
  'semitronix.com': 'Semitronix',

  // --- data centres and power
  'vertiv.com': 'Vertiv',
  'se.com': 'Schneider Electric',
  'eaton.com': 'Eaton',
  'deltaww.com': 'Delta Electronics',
  'coolitsystems.com': 'CoolIT Systems',
  'asetek.com': 'Asetek',
  'hitachienergy.com': 'Hitachi Energy',
  'siemens-energy.com': 'Siemens Energy',
  'gevernova.com': 'GE Vernova',
  'nidec.com': 'Nidec',
  'constellationenergy.com': 'Constellation Energy',

  // --- exchanges, data sites and company subdomains the fallback turned into a
  // domain fragment ("Sse", "Cninfo", "Tech", "Hotchips", "Asml", "Dupont")
  'static.sse.com.cn': 'Shanghai Stock Exchange',
  'static.cninfo.com.cn': 'CNINFO',
  'eto.tech': 'Emerging Technology Observatory (ETO)',
  'hc2024.hotchips.org': 'Hot Chips',
  'investor.asml.com': 'ASML',
  'investors.dupont.com': 'DuPont',
  'hiascend.com': 'Huawei Ascend',
  'qnityelectronics.com': 'Qnity Electronics',
  'shpcb.com': 'Victory Giant Technology',
  'skyverse.cn': 'Skyverse Technology',
};

// ----------------------------------------------------------- hand-checked
// URL -> fields that override whatever the fetcher produced. Every entry below
// was read off the page itself (headline and dateline) after the automated
// fetch was refused by a bot wall. Where a page would not show its date, the
// date is left out rather than guessed.
const MANUAL = {
  // --- ASML product page (throughput rating: 26 x 33 mm die, 96 shots per wafer)
  'https://www.asml.com/en/products/euv-lithography-systems/twinscan-nxe3400b': {
    title: 'TWINSCAN NXE:3400B: EUV lithography systems',
    publisher: 'ASML',
    type: 'page',
    accessed: '2026-09-27',
  },
  // --- Epoch AI report (revised 24 Sept 2026 for Huawei's updated roadmap)
  'https://epoch.ai/publications/huaweis-roadmap-to-2031': {
    title: 'Will Huawei catch up to Nvidia by 2030?',
    publisher: 'Epoch AI',
    date: '2026-09-24',
    type: 'report',
    accessed: '2026-09-25',
  },
  // --- Reuters (bot wall; headline and dateline read from the article)
  'https://www.reuters.com/world/asia-pacific/250-million-asml-printer-behind-nvidias-chips-2026-07-28/': {
    title: "Explainer: The $400 million ASML 'printers' key for the AI chip boom",
    publisher: 'Reuters',
    date: '2026-01-28',
    type: 'article',
  },
  'https://www.reuters.com/world/china/china-starts-production-home-grown-immersion-duv-chipmaking-tools-source-2026-07-28/': {
    title: 'China starts production of home-grown immersion DUV chipmaking tools, source says',
    publisher: 'Reuters',
    date: '2026-07-28',
    type: 'article',
  },
  'https://www.reuters.com/world/china/how-china-built-its-manhattan-project-rival-west-ai-chips-2025-12-17/': {
    title: "How China built its 'Manhattan Project' to rival the West in AI chips",
    publisher: 'Reuters',
    date: '2025-12-17',
    type: 'article',
  },

  // --- TSMC newsroom (Cloudflare wall)
  'https://pr.tsmc.com/english/news/3174': {
    title: 'Amkor and TSMC to Expand Partnership and Collaborate on Advanced Packaging in Arizona',
    publisher: 'TSMC',
    date: '2024-10-04',
    type: 'press release',
  },
  'https://pr.tsmc.com/english/news/3210': {
    title: 'TSMC Intends to Expand Its Investment in the United States to US$165 Billion to Power the Future of AI',
    publisher: 'TSMC',
    date: '2025-03-04',
    type: 'press release',
  },
  'https://pr.tsmc.com/english/news/3228': {
    title: 'TSMC Unveils Next-Generation A14 Process at North America Technology Symposium',
    publisher: 'TSMC',
    date: '2025-04-24',
    type: 'press release',
  },
  'https://pr.tsmc.com/english/news/3302': {
    title: 'TSMC Debuts A13 Technology at 2026 North America Technology Symposium',
    publisher: 'TSMC',
    date: '2026-04-23',
    type: 'press release',
  },
  'https://pr.tsmc.com/english/news/3326': {
    title: 'TSMC Reports Second Quarter EPS of NT$27.25',
    publisher: 'TSMC',
    date: '2026-07-16',
    type: 'press release',
  },
  'https://pr.tsmc.com/english/news/3338': {
    title: 'ASML and TSMC Announce Initiative to Pioneer Industry Transition to Large-Format Photomasks for High NA EUV',
    publisher: 'TSMC',
    date: '2026-09-08',
    type: 'press release',
  },
  'https://www.tsmc.com/english/dedicatedFoundry/manufacturing/fab_capacity': {
    title: 'Fab Capacity',
    publisher: 'TSMC',
    type: 'page',
  },
  'https://www.tsmc.com/english/dedicatedFoundry/manufacturing/gigafab': {
    title: 'GIGAFAB® Facilities',
    publisher: 'TSMC',
    type: 'page',
  },
  'https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm': {
    title: '2nm Technology',
    publisher: 'TSMC',
    type: 'page',
  },
  'https://www.tsmc.com/english/dedicatedFoundry/technology/platform_HPC_tech_advancedTech': {
    title: 'HPC Platform – Advanced Technologies',
    publisher: 'TSMC',
    type: 'page',
  },

  // --- investor-relations platforms that refuse scripted requests
  'https://investors.micron.com/news/press-release/2025/Micron-Technology-Inc--Reports-Results-for-the-Fourth-Quarter-and-Full-Year-of-Fiscal-2025-09-23-2025/default.aspx': {
    title: 'Micron Technology, Inc. Reports Results for the Fourth Quarter and Full Year of Fiscal 2025',
    publisher: 'Micron Technology',
    date: '2025-09-23',
    type: 'press release',
  },
  'https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Results-for-the-Third-Quarter-of-Fiscal-2026/default.aspx': {
    title: 'Micron Technology, Inc. Reports Record Results for the Third Quarter of Fiscal 2026',
    publisher: 'Micron Technology',
    date: '2026-06-24',
    type: 'press release',
  },
  'https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Completes-Strategic-Investment-in-Rigaku-Holdings-Corporation/default.aspx': {
    title: 'Onto Innovation Completes Strategic Investment in Rigaku Holdings Corporation',
    publisher: 'Onto Innovation',
    date: '2026-08-10',
    type: 'press release',
  },
  'https://investors.ontoinnovation.com/news/news-details/2026/Onto-Innovation-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx': {
    title: 'Onto Innovation Reports 2025 Fourth Quarter and Full Year Results',
    publisher: 'Onto Innovation',
    date: '2026-02-19',
    type: 'press release',
  },
  'https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-extended-partnership-meta-deploy-technology': {
    title: "Broadcom Announces Extended Partnership with Meta to Deploy Technology to Support Multi-Gigawatts of Meta's Custom Silicon, MTIA",
    publisher: 'Broadcom',
    date: '2026-04-14',
    type: 'press release',
  },
  'https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-5-industrys-highest-bandwidth-switch': {
    title: "Broadcom Ships Tomahawk 5, Industry's Highest Bandwidth Switch Chip to Accelerate AI/ML Workloads",
    publisher: 'Broadcom',
    type: 'press release',
  },
  'https://investors.broadcom.com/news-releases/news-release-details/openai-and-broadcom-announce-strategic-collaboration-deploy-10': {
    title: 'OpenAI and Broadcom announce strategic collaboration to deploy 10 gigawatts of OpenAI-designed AI accelerators',
    publisher: 'Broadcom',
    type: 'press release',
  },
  'https://ir.amkor.com/news-releases/news-release-details/amkor-technology-breaks-ground-new-semiconductor-advanced': {
    title: 'Amkor Technology Breaks Ground on New Semiconductor Advanced Packaging and Test Campus in Arizona; Expands Investment to $7 Billion',
    publisher: 'Amkor Technology',
    type: 'press release',
  },
  'https://ir.amkor.com/news-releases/news-release-details/tsmc-and-amkor-technology-announce-long-term-partnership': {
    title: 'TSMC and Amkor Technology Announce Long Term Partnership to Accelerate Advanced Packaging in the United States',
    publisher: 'Amkor Technology',
    type: 'press release',
  },
  'https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-third-quarter-2026-results': {
    title: 'Applied Materials Announces Third Quarter 2026 Results',
    publisher: 'Applied Materials',
    date: '2026-08-13',
    type: 'press release',
  },
  'https://investors.arm.com/': {
    title: 'Investor Relations – Arm®',
    publisher: 'Arm',
    type: 'page',
  },

  // --- standards bodies and trade associations
  'https://www.jedec.org/news/pressreleases/jedec%C2%AE-and-industry-leaders-collaborate-release-jesd270-4-hbm4-standard-advancing': {
    title: 'JEDEC® and Industry Leaders Collaborate to Release JESD270-4 HBM4 Standard: Advancing Bandwidth, Efficiency, and Capacity for AI and HPC',
    publisher: 'JEDEC Solid State Technology Association',
    date: '2025-04-16',
    type: 'press release',
  },
  'https://www.jedec.org/news/pressreleases/new-jedec%C2%AE-sphbm4-standard-enables-hbm4-class-bandwidth-organic-substrates': {
    title: 'New JEDEC® SPHBM4 Standard Enables HBM4-Class Bandwidth on Organic Substrates',
    publisher: 'JEDEC Solid State Technology Association',
    date: '2026-07-13',
    type: 'press release',
  },
  'https://www.semi.org/en/SEMI-Reports-Global-Semiconductor-Equipment-Billings-Reached-135-Billion-in-2025': {
    title: 'SEMI Reports Global Semiconductor Equipment Billings Reached $135 Billion in 2025, Up 15% Year-on-Year',
    publisher: 'SEMI',
    date: '2026-04-07',
    type: 'press release',
  },
  'https://www.semi.org/en/news-media-press-releases/semi-press-releases/global-semiconductor-fab-capacity-projected-to-expand-6%25-in-2024-and-7%25-in-2025-semi-reports': {
    title: 'Global Semiconductor Fab Capacity Projected to Expand 6% in 2024 and 7% in 2025, SEMI Reports',
    publisher: 'SEMI',
    date: '2024-06-18',
    type: 'press release',
  },

  // --- other pages behind bot walls
  'https://www.smics.com/en/site/news_read/7951': {
    title: 'SMIC Announces 2025 Annual Results',
    publisher: 'SMIC',
    type: 'press release',
  },
  'https://www.smics.com/en/site/mask': {
    title: 'Mask Service',
    publisher: 'SMIC',
    type: 'page',
  },
  'https://www.jcetglobal.com/en/site/news-detail?id=1952': {
    title: 'JCET Releases 2024 Annual Report, Achieves Record-High Revenue',
    publisher: 'JCET Group',
    date: '2025-04-20',
    type: 'press release',
  },
  'https://www.azcommerce.com/news-events/news/2026/7/tsmc-announcement/': {
    title: 'TSMC Announces Additional $100 Billion Investment in Arizona',
    publisher: 'Arizona Commerce Authority',
    date: '2026-07-16',
    type: 'press release',
  },
  'https://www.congress.gov/bill/119th-congress/senate-bill/1705/text': {
    title: 'S.1705 – Chip Security Act, 119th Congress (2025-2026), bill text',
    publisher: 'U.S. Congress (Congress.gov, Library of Congress)',
    type: 'regulation',
  },
  'https://www.intel.com/content/www/us/en/content-details/817486/intel-gaudi-3-ai-accelerator-white-paper.html': {
    title: 'Intel® Gaudi® 3 AI Accelerator White Paper',
    publisher: 'Intel',
    date: '2025-07-14',
    type: 'report',
  },
  'https://www.intel.com/pressroom/archive/releases/2007/20070128comp.htm': {
    title: "Intel's Transistor Technology Breakthrough Represents Biggest Change to Computer Chips in 40 Years",
    publisher: 'Intel',
    date: '2007-01-27',
    type: 'press release',
  },
  'https://www.bcg.com/publications/2024/emerging-resilience-in-semiconductor-supply-chain': {
    title: 'Emerging Resilience in the Semiconductor Supply Chain',
    publisher: 'Boston Consulting Group',
    date: '2024-05-08',
    type: 'report',
  },
  'https://www.bcg.com/publications/2023/navigating-the-semiconductor-manufacturing-costs': {
    title: 'Navigating the Costly Economics of Chip Making',
    publisher: 'Boston Consulting Group',
    date: '2023-09-28',
    type: 'report',
  },
  'https://www.globenewswire.com/news-release/2026/08/13/3344890/0/en/applied-materials-announces-third-quarter-2026-results.html': {
    title: 'Applied Materials Announces Third Quarter 2026 Results',
    publisher: 'GlobeNewswire (release by Applied Materials)',
    date: '2026-08-13',
    type: 'press release',
  },
  'https://www.globenewswire.com/news-release/2025/12/10/3203040/0/en/Photronics-Reports-Full-Year-and-Fourth-Quarter-Fiscal-2025-Results.html': {
    title: 'Photronics Reports Full Year and Fourth Quarter Fiscal 2025 Results',
    publisher: 'GlobeNewswire (release by Photronics)',
    date: '2025-12-10',
    type: 'press release',
  },
  'https://www.globenewswire.com/news-release/2024/07/08/2909540/0/en/applied-materials-unveils-chip-wiring-innovations-for-more-energy-efficient-computing.html': {
    title: 'Applied Materials Unveils Chip Wiring Innovations for More Energy-Efficient Computing',
    publisher: 'GlobeNewswire (release by Applied Materials)',
    date: '2024-07-08',
    type: 'press release',
  },
  'https://ai.meta.com/blog/meta-mtia-scale-ai-chips-for-billions/': {
    title: 'Four MTIA Chips in Two Years: Scaling AI Experiences for Billions',
    publisher: 'Meta',
    date: '2026-03-11',
    type: 'article',
  },
  'https://raw.githubusercontent.com/georgetown-cset/eto-chip-explorer/main/data/provision.csv': {
    title: 'ETO Chip Explorer source data: provision.csv',
    publisher: 'Center for Security and Emerging Technology (CSET) / Emerging Technology Observatory',
    type: 'dataset',
  },
  'https://www.commerce.gov/news/press-releases/2024/12/biden-harris-administration-announces-chips-incentives-awards': {
    title: 'Biden-Harris Administration Announces CHIPS Incentives Awards with GlobalWafers to Support Domestic Production of Silicon Wafers',
    publisher: 'U.S. Department of Commerce',
    date: '2024-12-17',
    type: 'press release',
  },
  'https://www.commerce.gov/news/press-releases/2025/11/statement-uae-and-saudi-chip-exports': {
    title: 'Statement on UAE and Saudi Chip Exports',
    publisher: 'U.S. Department of Commerce',
    date: '2025-11',
    type: 'press release',
  },

  // --- TSMC investor documents (site refuses scripted requests; PDFs read
  //     directly, so these titles and event dates are the documents' own)
  'https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2024-08/5122725a56670882d777a8e8bfe0ed247cc55330/TSMC%202Q24%20Transcript.pdf': {
    title: 'Q2 2024 Taiwan Semiconductor Manufacturing Co Ltd Earnings Call (Chinese, English) — edited transcript',
    publisher: 'Refinitiv StreetEvents (transcript of a TSMC earnings call), via TSMC',
    date: '2024-07-18',
    type: 'transcript',
  },
  'https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2025-10/6860312f04fd291d0f26b46c1234f84e6332717e/TSMC%203Q25%20Transcript.pdf': {
    title: 'Q3 2025 Taiwan Semiconductor Manufacturing Co Ltd Earnings Call (Chinese, English) — edited transcript',
    publisher: 'Refinitiv StreetEvents (transcript of a TSMC earnings call), via TSMC',
    date: '2025-10-16',
    type: 'transcript',
  },
  'https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-08/3e494f0c14dd0890f897aa044415e21d93486cc4/TSMC%202Q26%20Transcript.pdf': {
    title: 'Q2 2026 Taiwan Semiconductor Manufacturing Co Ltd Earnings Call (Chinese, English) — edited transcript',
    publisher: 'LSEG StreetEvents (transcript of a TSMC earnings call), via TSMC',
    date: '2026-07-16',
    type: 'transcript',
  },
  'https://investor.tsmc.com/static/annualReports/2025/english/index.html': {
    title: 'TSMC 2025 Annual Report',
    publisher: 'TSMC',
    type: 'report',
  },
  // Scanned pages, no extractable text; title read off the file name and path.
  'https://investor.tsmc.com/static/annualReports/2025/english/pdf/2025_tsmc_ar_e_ch5.pdf': {
    title: 'TSMC 2025 Annual Report, chapter 5',
    publisher: 'TSMC',
    type: 'pdf',
    unverified: true,
  },
  'https://www.unimicron.com/files/money/Earnings/en/2026-Q2-consolidated-en.pdf': {
    // cover reads "Unimicron 2026 Q2 Earnings Conference" (July 2026), not financial statements
    title: 'Unimicron 2026 Q2 Earnings Conference',
    publisher: 'Unimicron Technology',
    date: '2026-07',
    type: 'pdf',
    accessed: '2026-10-02',
  },

  // --- company pages read in the browser after the fetcher was refused
  'https://industrial.panasonic.com/ww/products/pt/megtron': {
    title: 'Multi-layer Circuit Board Materials for ICT infrastructure equipment "MEGTRON" series',
    publisher: 'Panasonic Industry',
    type: 'page',
  },
  'https://www.amphenol.com/markets/it-datacom': {
    title: 'Amphenol, IT and datacom market page',
    publisher: 'Amphenol',
    type: 'page',
  },
  'https://www.appliedmaterials.com/us/en/semiconductor.html': {
    title: 'Semiconductor Systems',
    publisher: 'Applied Materials',
    type: 'page',
  },
  'https://www.appliedmaterials.com/eu/en/product-library/kinex-integrated-die-to-wafer-hybrid-bonding-system.html': {
    title: 'Applied Materials, Kinex integrated die-to-wafer hybrid bonding system product page',
    publisher: 'Applied Materials',
    type: 'page',
  },
  'https://www.arista.com/en/solutions/ai-networking': {
    title: 'AI Networking Center',
    publisher: 'Arista Networks',
    type: 'page',
  },
  'https://www.cisco.com/site/us/en/products/networking/silicon-one/index.html': {
    title: 'Cisco Silicon One – Processors for Unified Network Architecture',
    publisher: 'Cisco Systems',
    type: 'page',
  },
  'https://www.corning.com/worldwide/en/products/communication-networks.html': {
    title: 'Corning Optical Communications: Fiber Optic Connectivity Solutions',
    publisher: 'Corning',
    type: 'page',
  },
  'https://www.eaton.com/us/en-us/markets/data-centers.html': {
    title: 'Data centers: digitalization and efficiency',
    publisher: 'Eaton',
    type: 'page',
  },
  'https://www.foxconn.com/': {
    title: 'Hon Hai Precision Industry (Foxconn), company website (鴻海科技集團)',
    publisher: 'Hon Hai Precision Industry (Foxconn)',
    type: 'page',
  },
  'https://www.hitachi-hightech.com/global/en/products/semiconductor-manufacturing/': {
    title: 'Semiconductor Manufacturing Equipment',
    publisher: 'Hitachi High-Tech',
    type: 'page',
  },
  'https://www.hpe.com/us/en/servers.html': {
    title: 'Compute Solutions',
    publisher: 'Hewlett Packard Enterprise',
    type: 'page',
  },
  'https://www.huahonggrace.com/': {
    title: 'Hua Hong Semiconductor, company website (华虹宏力半导体有限公司)',
    publisher: 'Hua Hong Semiconductor',
    type: 'page',
  },
  'https://www.intel.com/content/www/us/en/foundry/overview.html': {
    title: 'Semiconductor Manufacturing Company for the AI Era',
    publisher: 'Intel Foundry',
    type: 'page',
  },
  'https://www.jcetglobal.com/en/': {
    title: 'JCET Group, company website',
    publisher: 'JCET Group',
    type: 'page',
  },
  'https://www.marvell.com/company/investor-relations.html': {
    title: 'Investor Relations, Marvell Technology, Inc. (MRVL)',
    publisher: 'Marvell Technology',
    type: 'page',
  },
  'https://www.npc.com.tw/': {
    title: '南亞塑膠工業股份有限公司 (Nan Ya Plastics Corporation home page)',
    publisher: 'Nan Ya Plastics Corporation',
    type: 'page',
  },
  'https://www.primarius-tech.com/en/': {
    title: 'Primarius Technologies, company website',
    publisher: 'Primarius Technologies',
    type: 'page',
  },
  'https://www.supermicro.com/en/products/gpu': {
    title: 'GPU Servers For AI, Deep / Machine Learning & HPC',
    publisher: 'Supermicro',
    type: 'page',
  },
  'https://www.wacker.com/cms/en-us/products/product-groups/polysilicon/polysilicon.html': {
    title: 'Wacker Chemie, polysilicon product page',
    publisher: 'Wacker Chemie',
    type: 'page',
  },

  // --- BIS press releases. The page is a JavaScript shell whose <title> is the
  //     .gov banner's "Lock"; headline and dateline read from the rendered page.
  'https://www.bis.gov/press-release/applied-materials-pay-252-million-penalty-bis-illegally-exporting-semiconductor-manufacturing-equipment': {
    title: 'Applied Materials to Pay $252 Million Penalty to BIS for Illegally Exporting Semiconductor Manufacturing Equipment',
    publisher: 'U.S. Bureau of Industry and Security',
    date: '2026-02-11',
    type: 'press release',
  },
  'https://www.bis.gov/press-release/commerce-strengthens-export-controls-restrict-chinas-capability-produce-advanced-semiconductors-military': {
    title: "Commerce Strengthens Export Controls to Restrict China's Capability to Produce Advanced Semiconductors for Military Applications",
    publisher: 'U.S. Bureau of Industry and Security',
    date: '2024-12-02',
    type: 'press release',
  },
  'https://www.bis.gov/press-release/department-commerce-announces-rescission-biden-era-artificial-intelligence-diffusion-rule-strengthens': {
    title: 'Department of Commerce Announces Rescission of Biden-Era Artificial Intelligence Diffusion Rule, Strengthens Chip-Related Export Controls',
    publisher: 'U.S. Bureau of Industry and Security',
    date: '2025-05-13',
    type: 'press release',
  },
  // Redirects to the release above; same document under an older slug.
  'https://www.bis.gov/press-release/department-commerce-rescinds-biden-era-artificial-intelligence-diffusion-rule-strengthens-chip-related': {
    title: 'Department of Commerce Announces Rescission of Biden-Era Artificial Intelligence Diffusion Rule, Strengthens Chip-Related Export Controls',
    publisher: 'U.S. Bureau of Industry and Security',
    date: '2025-05-13',
    type: 'press release',
  },
  'https://www.bis.gov/press-release/department-commerce-closes-export-controls-loophole-foreign-owned-semiconductor-fabs-china': {
    title: 'Department of Commerce Closes Export Controls Loophole for Foreign-Owned Semiconductor Fabs in China',
    publisher: 'U.S. Bureau of Industry and Security',
    date: '2025-08-29',
    type: 'press release',
  },
  'https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china': {
    title: 'Department of Commerce Revises License Review Policy for Semiconductors Exported to China',
    publisher: 'U.S. Bureau of Industry and Security',
    date: '2026-01-13',
    type: 'press release',
  },

  // ---------------------------------------------------------------------
  // Bibliography pass, 10 September 2026. Scraping left these entries with a
  // title a reader could not use: a CMS heading ('Home | ASM'), the authoring
  // program ('PowerPoint Presentation', 'Microsoft Word - ...'), a file name
  // ('fy26q4presentations-e'), a bare company name, or a title only in
  // Chinese, Japanese or Korean. Each title below was written from the
  // document itself - cover page, first slide, headline and dateline - in
  // English, with the original in parentheses where the document is in
  // another language. A date is given only where the document states one;
  // date: null clears a page-modification timestamp the fetcher mistook for
  // a publication date.

  // --- government notices, laws and rules (title translated; original in parentheses)
  'http://exportcontrol.mofcom.gov.cn/article/zcfg/gnzcfg/zcfggzqd/202307/847.html': {
    title: 'MOFCOM and General Administration of Customs announcement, export controls on gallium- and germanium-related items (对镓、锗相关物项实施出口管制)',
    publisher: 'Ministry of Commerce of the People\'s Republic of China',
    date: '2023-07-03',
    type: 'regulation',
  },
  'https://exportcontrol.mofcom.gov.cn/article/zcfg/gnzcfg/flfg/202111/226.html': {
    title: 'Export Control Law of the People\'s Republic of China (中华人民共和国出口管制法)',
    publisher: 'Ministry of Commerce of the People\'s Republic of China',
    date: '2020-10-17',
    type: 'regulation',
  },
  'https://www.mofcom.gov.cn/zwgk/zcfb/art/2025/art_b1ec77dd3f0d4762952904df7cdaadec.html': {
    title: 'MOFCOM and GAC Announcement 2025 No. 70, suspending the October 2025 export-control measures, Announcements Nos. 55 to 58, 61 and 62 (商务部、海关总署公告2025年第70号)',
    date: '2025-11-07',
    type: 'regulation',
  },
  'https://www.mofcom.gov.cn/zwgk/zcfb/art/2026/art_01c15948864a45d186abb146fe30a42b.html': {
    title: 'MOFCOM Announcement 2026 No. 37, preliminary determination in the anti-dumping investigation into dichlorosilane imported from Japan (商务部公告2026年第37号)',
    date: '2026-09-07',
    type: 'regulation',
  },
  'https://www.cac.gov.cn/2023-05/21/c_1686348043518073.htm': {
    title: 'Cyberspace Administration of China, notice on the cybersecurity review of Micron products (美光公司在华销售的产品未通过网络安全审查), 21 May 2023',
    publisher: 'Cyberspace Administration of China',
    date: '2023-05-21',
    type: 'regulation',
  },
  'https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0014/handeji14-4.pdf': {
    title: 'METI, Semiconductor and digital industry strategy: future direction (半導体・デジタル産業戦略の今後の方向性), 23 December 2025',
    publisher: 'Ministry of Economy, Trade and Industry (Japan)',
    date: '2025-12-23',
    type: 'pdf',
  },
  'https://echa.europa.eu/-/echa-supports-pfas-restriction-with-targeted-derogations': {
    title: 'ECHA supports PFAS restriction with targeted derogations',
    publisher: 'European Chemicals Agency',
    date: '2026-03-26',
    type: 'press release',
  },

  // --- filings (company, document type, period)
  'https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2021_con_quarter04_all.pdf': {
    title: 'Samsung Electronics, consolidated financial statements, fourth quarter 2021',
    publisher: 'Samsung Electronics',
    date: '2022-02-17',
    type: 'filing',
  },
  'https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2025_con_quarter04_all.pdf': {
    title: 'Samsung Electronics, consolidated financial statements, fourth quarter 2025',
    publisher: 'Samsung Electronics',
    date: '2026-02-12',
    type: 'filing',
  },
  'https://disc.static.szse.cn/disc/disk03/finalpage/2026-03-31/a0209878-88e7-443c-b062-6a33047d9c98.PDF': {
    title: 'Tianshui Huatian Technology, 2025 annual report (2025年年度报告)',
    publisher: 'Shenzhen Stock Exchange',
    date: '2026-03-30',
    type: 'filing',
  },
  'https://www.screen.co.jp/download_file/view/6d6c7bf6-ec75-4f44-82d6-b67d0052b45a/451': {
    title: 'SCREEN Holdings, securities report (有価証券報告書), 81st fiscal year',
    publisher: 'SCREEN Holdings',
    date: '2022-06-27',
    type: 'filing',
  },
  'https://www.screen.co.jp/download_file/view/95fd5713-120c-43ce-ab1c-83791af24040/1857': {
    title: 'SCREEN Holdings, securities report (有価証券報告書), 83rd fiscal year',
    publisher: 'SCREEN Holdings',
    date: '2024-06-20',
    type: 'filing',
  },
  'https://www.screen.co.jp/download_file/view/7e03d9a8-88eb-4a7d-ab77-509eba1422ac/2540': {
    title: 'SCREEN Holdings, securities report (有価証券報告書), 85th fiscal year',
    publisher: 'SCREEN Holdings',
    date: '2026-06-23',
    type: 'filing',
  },
  'https://dart.fss.or.kr/report/viewer.do?rcpNo=20220322000590&dcmNo=8490476&eleId=20&offset=345759&length=564559&dtd=dart3.xsd': {
    title: 'SK hynix, notes to the consolidated financial statements (연결재무제표 주석), 74th fiscal year, 2021',
    publisher: 'Financial Supervisory Service (DART)',
    date: '2022-03-22',
    type: 'filing',
  },
  'https://dart.fss.or.kr/report/viewer.do?rcpNo=20230321001209&dcmNo=9083795&eleId=20&offset=336980&length=497577&dtd=dart3.xsd': {
    title: 'SK hynix, notes to the consolidated financial statements (연결재무제표 주석), 75th fiscal year, 2022',
    publisher: 'Financial Supervisory Service (DART)',
    date: '2023-03-21',
    type: 'filing',
  },
  'https://dart.fss.or.kr/report/viewer.do?rcpNo=20240319000684&dcmNo=9731387&eleId=49&offset=1689059&length=20688&dtd=dart4.xsd': {
    title: 'SK hynix, revenue note to the consolidated financial statements (매출액), fiscal year 2023',
    publisher: 'Financial Supervisory Service (DART)',
    date: '2024-03-19',
    type: 'filing',
  },
  'https://dart.fss.or.kr/report/viewer.do?rcpNo=20250319000665&dcmNo=10428620&eleId=48&offset=1773970&length=22955&dtd=dart4.xsd': {
    title: 'SK hynix, revenue note to the consolidated financial statements (매출액), fiscal year 2024',
    publisher: 'Financial Supervisory Service (DART)',
    date: '2025-03-19',
    type: 'filing',
  },
  'https://dart.fss.or.kr/report/viewer.do?rcpNo=20260317000635&dcmNo=11132576&eleId=48&offset=2673284&length=29807&dtd=dart4.xsd': {
    title: 'SK hynix, revenue note to the consolidated financial statements (매출액), fiscal year 2025',
    publisher: 'Financial Supervisory Service (DART)',
    date: '2026-03-17',
    type: 'filing',
  },

  // --- slide decks and investor documents (deck name read off the first slide)
  'https://www.ercot.com/files/docs/2026/03/12/March-TAC-Report.pdf': {
    title: 'Electric Reliability Council of Texas, Large Load Interconnection Status Update, 13 March 2026',
    date: '2026-03-13',
    type: 'pdf',
  },
  'https://www.ercot.com/files/docs/2026/07/29/ERCOT-Senate-July-29-Panel-1-Assessing-The-Grid.pdf': {
    title: 'Electric Reliability Council of Texas, ERCOT update to the Senate Committee on Business and Commerce, 29 July 2026',
    date: '2026-07-29',
    type: 'pdf',
  },
  'https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/011117/teaserItems1/01/linkList/03/link/20260630_presentation_E.pdf': {
    title: 'Ajinomoto, Growth Strategy for the Electronic Materials Business, 30 June 2026',
    publisher: 'Ajinomoto',
    date: '2026-06-30',
    type: 'pdf',
  },
  'https://www.ajinomoto.co.jp/company/en/ir/event/business_briefing/main/01113/teaserItems1/01/linkList/00/link/3_ICT_E.pdf': {
    title: 'Ajinomoto, Business Briefing: ABF-Based Growth Strategy in ICT, 12 June 2023',
    publisher: 'Ajinomoto',
    date: '2023-06-12',
    type: 'pdf',
  },
  'https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4presentations-e.pdf': {
    title: 'Tokyo Electron, FY2026 (April 2025 to March 2026) financial announcement, 30 April 2026',
    publisher: 'Tokyo Electron',
    date: '2026-04-30',
    type: 'pdf',
  },
  'https://www.ibiden.com/ir/items/en_QA_FY25Q4.pdf': {
    title: 'Ibiden, questions and answers from the financial presentation for the year ended 31 March 2026',
    publisher: 'Ibiden',
    date: '2026-05-12',
    type: 'pdf',
  },
  'https://www.advantest.com/document/en/investors/ir-library/result/JE_BIZ_260427_note.pdf': {
    title: 'Advantest, presentation notes for the FY2025 (year ended 31 March 2026) results briefing, 27 April 2026',
    publisher: 'Advantest',
    date: '2026-04-27',
    type: 'pdf',
  },
  'https://technoprobe.com/wp-content/uploads/2026/03/PR-FY-2025_.pdf': {
    title: 'Technoprobe, press release: the Board of Directors approves the draft statutory and consolidated annual report as at 31 December 2025',
    publisher: 'Technoprobe',
    date: '2026-03-18',
    type: 'press release',
  },
  'https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-3-white-paper.pdf': {
    title: 'AMD CDNA 3 Architecture: The All-New AMD GPU Architecture for the Modern Era of HPC and AI',
    publisher: 'AMD',
    date: null,
    type: 'pdf',
  },
  'https://www.semiconductors.org/wp-content/uploads/2021/05/BCG-x-SIA-Strengthening-the-Global-Semiconductor-Value-Chain-April-2021_1.pdf': {
    title: 'Strengthening the Global Semiconductor Supply Chain in an Uncertain Era',
    publisher: 'Boston Consulting Group and Semiconductor Industry Association',
    date: '2021-04',
    type: 'report',
  },
  'https://web.ece.ucsb.edu/~parhami/docs_folder/f33-book-dep-comp-pt2.pdf': {
    title: 'Behrooz Parhami, Dependable Computing: A Multilevel Approach, part 2',
    publisher: 'University of California, Santa Barbara',
    date: '2020-10-11',
    type: 'pdf',
  },

  // --- press releases and articles whose page title carried a site-name tail
  'https://www.agc.com/en/news/detail/1201109_2814.html': {
    title: 'AGC to Make Drastic Expansion to Supply System for EUVL Mask Blanks',
    publisher: 'AGC',
    date: '2020-07-27',
    type: 'press release',
  },
  'https://www.agc.com/en/news/detail/1203819_2814.html': {
    title: 'AGC to Boost Production Capacity of EUVL Photomask Blanks',
    publisher: 'AGC',
    date: '2023-04-27',
    type: 'press release',
  },
  'https://www.agc.com/en/hub/pr/the-japanese-glass-behind-next-generation-chips.html': {
    title: 'The Japanese glass behind next-generation chips',
    publisher: 'AGC',
    date: null,
    type: 'article',
  },
  'https://www.hoya.com/ir/2026/en/review/it.html': {
    title: 'HOYA, Information Technology business, review of operations, Integrated Report 2026',
    publisher: 'HOYA',
    date: null,
    type: 'report',
  },
  'https://www.ibiden.com/company/2026/02/notice-regarding-capital-investment-plan-for-high-performance-ic-package-substrates.html': {
    title: 'Ibiden, Notice Regarding Capital Investment Plan for High-Performance IC Package Substrates',
    publisher: 'Ibiden',
    date: '2026-02-03',
    type: 'press release',
  },
  'https://www.sumcosi.com/english/products/process/': {
    title: 'SUMCO, production processes page',
    publisher: 'SUMCO',
    date: null,
    type: 'page',
  },
  'https://www.sumcosi.com/english/products/': {
    title: 'SUMCO, products page',
    publisher: 'SUMCO',
    date: null,
    type: 'page',
  },
  'https://www.amec-inc.com/news/708.html': {
    title: 'AMEC holds its 2025 annual results briefing (中微公司成功举办2025年度业绩说明会)',
    publisher: 'Advanced Micro-Fabrication Equipment (AMEC)',
    date: '2026-04-01',
    type: 'press release',
  },
  'https://www.intel.com/content/www/us/en/newsroom/news/intel-foundry/intel-foundry-asml-accelerate-industry-readiness-for-high-na-euv.html': {
    title: 'Intel Foundry and ASML Accelerate Industry Readiness for High-NA EUV',
    publisher: 'Intel',
    date: '2026-09-07',
    type: 'press release',
  },
  'https://ai.meta.com/blog/next-generation-meta-training-inference-accelerator-AI-MTIA/': {
    title: 'Our next generation Meta Training and Inference Accelerator',
    publisher: 'Meta',
    date: '2024-04-10',
    type: 'article',
  },
  'https://www.rieti.go.jp/en/columns/v01_0201.html': {
    title: 'The impact of export controls on international trade: evidence from the Japan–Korea trade dispute in the semiconductor industry',
    publisher: 'Research Institute of Economy, Trade and Industry (Japan)',
    date: '2023-05-08',
    type: 'article',
  },
  'https://www.vdlgroep.com/en/vdl-groep/innovation-projects/vdl-etg-builds-complex-frames-for-zeiss': {
    title: 'VDL Groep, VDL ETG builds complex frames for Zeiss, innovation project page',
    publisher: 'VDL Groep',
    date: null,
    type: 'page',
  },

  // --- product and section pages (page title alone said nothing)
  'https://3dfabric.tsmc.com/english/dedicatedFoundry/technology/cowos.htm': {
    title: 'TSMC, CoWoS technology page',
    publisher: 'TSMC',
    date: null,
    type: 'page',
  },
  'https://www.micron.com/products/memory/hbm/hbm3e': {
    title: 'Micron, HBM3E product page',
    publisher: 'Micron Technology',
    date: null,
    type: 'page',
  },
  'https://www.micron.com/products/memory/hbm/hbm4': {
    title: 'Micron, HBM4 product page',
    publisher: 'Micron Technology',
    date: null,
    type: 'page',
  },
  'https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators.html': {
    title: 'Intel, AI accelerators product page',
    publisher: 'Intel',
    date: null,
    type: 'page',
  },
  'https://www.airproducts.com/industries/electronics': {
    title: 'Air Products, electronics industry page',
    publisher: 'Air Products',
    date: null,
    type: 'page',
  },
  'https://www.ansys.com/products/semiconductors': {
    title: 'Ansys, semiconductor products page',
    publisher: 'Ansys',
    date: null,
    type: 'page',
  },
  'https://www.camtek.com/products/': {
    title: 'Camtek, products page',
    publisher: 'Camtek',
    date: null,
    type: 'page',
  },
  'https://www.dongjin.com/en/business/semiconductor.php': {
    title: 'Dongjin Semichem, semiconductor materials page',
    publisher: 'Dongjin Semichem',
    date: null,
    type: 'page',
  },
  'https://www.qct.io/solution/index/AI-Solutions': {
    title: 'Quanta Cloud Technology, AI solutions page',
    publisher: 'Quanta Cloud Technology',
    date: null,
    type: 'page',
  },
  'https://www.se.com/us/en/work/solutions/for-business/data-centers-and-networks/': {
    title: 'Schneider Electric, data centers and networks page',
    publisher: 'Schneider Electric',
    date: null,
    type: 'page',
  },
  'https://www.umc.com/en/Product/technologies/Overview': {
    title: 'UMC, process technologies overview page',
    publisher: 'United Microelectronics Corporation (UMC)',
    date: null,
    type: 'page',
  },
  'https://www.vdlgroep.com/en/markets/semiconductor': {
    title: 'VDL Groep, semiconductor market page',
    publisher: 'VDL Groep',
    date: null,
    type: 'page',
  },
  'https://www.wistron.com/en/Business/Solutions': {
    title: 'Wistron, business solutions page',
    publisher: 'Wistron',
    date: null,
    type: 'page',
  },
  'https://www.aehr.com/products/': {
    title: 'Aehr Test Systems, products page',
    publisher: 'Aehr Test Systems',
    date: null,
    type: 'page',
  },
  'https://www.evgroup.com/products/': {
    title: 'EV Group, products page',
    publisher: 'EV Group',
    date: null,
    type: 'page',
  },
  'https://www.siemens-energy.com/global/en/home/products-services/product-offerings.html': {
    title: 'Siemens Energy, product offerings page',
    publisher: 'Siemens Energy',
    date: null,
    type: 'page',
  },
  'https://www.siltronic.com/en/products': {
    title: 'Siltronic, products page',
    publisher: 'Siltronic',
    date: null,
    type: 'page',
  },
  'https://www.screen.co.jp/spe/en/products': {
    title: 'SCREEN Semiconductor Solutions, products page',
    publisher: 'SCREEN Holdings',
    date: null,
    type: 'page',
  },
  'https://www.mks.com/semiconductor': {
    title: 'MKS Instruments, semiconductor page',
    publisher: 'MKS Instruments',
    date: null,
    type: 'page',
  },
  'https://www.innolight.com/about': {
    title: 'InnoLight Technology, company overview page',
    publisher: 'InnoLight Technology',
    date: null,
    type: 'page',
  },
  'https://www.eoptolink.com/about-us/contacts': {
    title: 'Eoptolink Technology, contacts page',
    publisher: 'Eoptolink Technology',
    date: null,
    type: 'page',
  },
  'https://www.nanya.com/en/Product': {
    title: 'Nanya Technology, products page',
    publisher: 'Nanya Technology',
    date: null,
    type: 'page',
  },
  'https://www.mjc.co.jp/en/products/': {
    title: 'Micronics Japan, products and services page (製品・サービス)',
    publisher: 'Micronics Japan (MJC)',
    date: null,
    type: 'page',
  },
  'https://www.lginnotek.com/product/substrate.do': {
    title: 'LG Innotek, substrate products page (LG이노텍)',
    publisher: 'LG Innotek',
    date: null,
    type: 'page',
  },

  // --- company home pages cited for what the firm does
  'https://jp.mitsuichemicals.com/': {
    title: 'Mitsui Chemicals, company website (三井化学株式会社)',
    publisher: 'Mitsui Chemicals',
    date: null,
    type: 'page',
  },
  'https://rebellions.ai/': {
    title: 'Rebellions, company website',
    publisher: 'Rebellions',
    date: null,
    type: 'page',
  },
  'https://tenstorrent.com/': {
    title: 'Tenstorrent, company website',
    publisher: 'Tenstorrent',
    date: null,
    type: 'page',
  },
  'https://www.adeka.co.jp/': {
    title: 'ADEKA, company website (株式会社ADEKA)',
    publisher: 'ADEKA Corporation',
    date: null,
    type: 'page',
  },
  'https://www.advancedenergy.com/': {
    title: 'Advanced Energy Industries, company website',
    publisher: 'Advanced Energy Industries',
    date: null,
    type: 'page',
  },
  'https://www.airliquide.com/': {
    title: 'Air Liquide, company website',
    publisher: 'Air Liquide',
    date: null,
    type: 'page',
  },
  'https://www.asetek.com/': {
    title: 'Asetek, company website',
    publisher: 'Asetek',
    date: null,
    type: 'page',
  },
  'https://www.asm.com/': {
    title: 'ASM International, company website',
    publisher: 'ASM International',
    date: null,
    type: 'page',
  },
  'https://www.birentech.com/': {
    title: 'Biren Technology, company website (壁仞科技)',
    publisher: 'Biren Technology',
    date: null,
    type: 'page',
  },
  'https://www.cambricon.com/': {
    title: 'Cambricon Technologies, company website (寒武纪)',
    publisher: 'Cambricon Technologies',
    date: null,
    type: 'page',
  },
  'https://www.chipbond.com.tw/en/': {
    title: 'Chipbond Technology, company website',
    publisher: 'Chipbond Technology',
    date: null,
    type: 'page',
  },
  'https://www.cohu.com/': {
    title: 'Cohu, company website',
    publisher: 'Cohu',
    date: null,
    type: 'page',
  },
  'https://www.comet.tech/': {
    title: 'Comet Group, company website',
    publisher: 'Comet Group',
    date: null,
    type: 'page',
  },
  'https://www.dupont.com/': {
    title: 'DuPont, company website',
    publisher: 'DuPont',
    date: null,
    type: 'page',
  },
  'https://www.edwardsvacuum.com/': {
    title: 'Edwards Vacuum, company website',
    publisher: 'Edwards Vacuum',
    date: null,
    type: 'page',
  },
  'https://www.empyrean.com.cn/': {
    title: 'Empyrean Technology, company website (华大九天)',
    publisher: 'Empyrean Technology',
    date: null,
    type: 'page',
  },
  'https://www.etched.com/': {
    title: 'Etched, company website',
    publisher: 'Etched',
    date: null,
    type: 'page',
  },
  'https://www.fabrinet.com/': {
    title: 'Fabrinet, company website',
    publisher: 'Fabrinet',
    date: null,
    type: 'page',
  },
  'https://www.fujimiinc.co.jp/': {
    title: 'Fujimi Incorporated, company website (フジミインコーポレーテッド)',
    publisher: 'Fujimi Incorporated',
    date: null,
    type: 'page',
  },
  'https://www.gce.com.tw/en/': {
    title: 'Gold Circuit Electronics, company website (金像電子)',
    publisher: 'Gold Circuit Electronics',
    date: null,
    type: 'page',
  },
  'https://www.guc-asic.com/en/': {
    title: 'Global Unichip Corporation, company website',
    publisher: 'Global Unichip Corporation (GUC)',
    date: null,
    type: 'page',
  },
  'https://www.hisilicon.com/': {
    title: 'HiSilicon, company website (海思)',
    publisher: 'HiSilicon',
    date: null,
    type: 'page',
  },
  'https://www.hscpoly.com/': {
    title: 'Hemlock Semiconductor, company website',
    publisher: 'Hemlock Semiconductor',
    date: null,
    type: 'page',
  },
  'https://www.hygon.cn/': {
    title: 'Hygon Information Technology, company website (海光)',
    publisher: 'Hygon Information Technology',
    date: null,
    type: 'page',
  },
  'https://www.iluvatar.com/': {
    title: 'Iluvatar CoreX, company website (天数智芯)',
    publisher: 'Iluvatar CoreX',
    date: null,
    type: 'page',
  },
  'https://www.ims.co.at/': {
    title: 'IMS Nanofabrication, company website',
    publisher: 'IMS Nanofabrication',
    date: null,
    type: 'page',
  },
  'https://www.inventec.com/': {
    title: 'Inventec, company website (英業達)',
    publisher: 'Inventec',
    date: null,
    type: 'page',
  },
  'https://www.kantodenka.co.jp/': {
    title: 'Kanto Denka Kogyo, company website (関東電化工業)',
    publisher: 'Kanto Denka Kogyo',
    date: null,
    type: 'page',
  },
  'https://www.kinsus.com.tw/en/': {
    title: 'Kinsus Interconnect Technology, company website',
    publisher: 'Kinsus Interconnect Technology',
    date: null,
    type: 'page',
  },
  'https://www.kokusai-electric.com/': {
    title: 'Kokusai Electric, company website (株式会社KOKUSAI ELECTRIC)',
    publisher: 'Kokusai Electric',
    date: null,
    type: 'page',
  },
  'https://www.kyec.com.tw/en/': {
    title: 'King Yuan Electronics, company website (京元電子)',
    publisher: 'King Yuan Electronics (KYEC)',
    date: null,
    type: 'page',
  },
  'https://www.lumentum.com/': {
    title: 'Lumentum, company website',
    publisher: 'Lumentum',
    date: null,
    type: 'page',
  },
  'https://www.metax-tech.com/en/': {
    title: 'MetaX, company website',
    publisher: 'MetaX',
    date: null,
    type: 'page',
  },
  'https://www.mgc.co.jp/': {
    title: 'Mitsubishi Gas Chemical, company website (三菱ガス化学株式会社)',
    publisher: 'Mitsubishi Gas Chemical',
    date: null,
    type: 'page',
  },
  'https://www.morita-kagaku.co.jp/': {
    title: 'Morita Chemical Industries, company website (森田化学工業株式会社)',
    publisher: 'Morita Chemical Industries',
    date: null,
    type: 'page',
  },
  'https://www.mthreads.com/': {
    title: 'Moore Threads, company website (摩尔线程)',
    publisher: 'Moore Threads',
    date: null,
    type: 'page',
  },
  'https://www.nanyapcb.com.tw/': {
    title: 'Nan Ya Printed Circuit Board, company website',
    publisher: 'Nan Ya Printed Circuit Board',
    date: null,
    type: 'page',
  },
  'https://www.naura.com/en/': {
    title: 'NAURA Technology Group, company website (北方华创)',
    publisher: 'NAURA Technology Group',
    date: null,
    type: 'page',
  },
  'https://www.nikon.com/': {
    title: 'Nikon, company website',
    publisher: 'Nikon',
    date: null,
    type: 'page',
  },
  'https://www.nipponsanso-hd.co.jp/': {
    title: 'Nippon Sanso Holdings, company website (日本酸素ホールディングス株式会社)',
    publisher: 'Nippon Sanso Holdings',
    date: null,
    type: 'page',
  },
  'https://www.nsig.com/en/': {
    title: 'National Silicon Industry Group, company website',
    publisher: 'National Silicon Industry Group (NSIG)',
    date: null,
    type: 'page',
  },
  'https://www.nuflare.co.jp/': {
    title: 'NuFlare Technology, company website (株式会社ニューフレアテクノロジー)',
    publisher: 'NuFlare Technology',
    date: null,
    type: 'page',
  },
  'https://www.oci.co.kr/': {
    title: 'OCI, company website (OCI 주식회사)',
    publisher: 'OCI',
    date: null,
    type: 'page',
  },
  'https://www.pti.com.tw/en/': {
    title: 'Powertech Technology, company website',
    publisher: 'Powertech Technology',
    date: null,
    type: 'page',
  },
  'https://www.resonac.com/': {
    title: 'Resonac, company website (レゾナック)',
    publisher: 'Resonac',
    date: null,
    type: 'page',
  },
  'https://www.samsungsem.com/': {
    title: 'Samsung Electro-Mechanics, company website (삼성전기)',
    publisher: 'Samsung Electro-Mechanics',
    date: null,
    type: 'page',
  },
  'https://www.sas-globalwafers.com/': {
    title: 'GlobalWafers, company website',
    publisher: 'GlobalWafers',
    date: null,
    type: 'page',
  },
  'https://www.semes.com/en/': {
    title: 'SEMES, company website',
    publisher: 'SEMES',
    date: null,
    type: 'page',
  },
  'https://www.semitronix.com/': {
    title: 'Semitronix, company website',
    publisher: 'Semitronix',
    date: null,
    type: 'page',
  },
  'https://www.shinetsu.co.jp/': {
    title: 'Shin-Etsu Chemical, company website',
    publisher: 'Shin-Etsu Chemical',
    date: null,
    type: 'page',
  },
  'https://www.sk.com/en/': {
    title: 'SK Group, company website',
    publisher: 'SK Group',
    date: null,
    type: 'page',
  },
  'https://www.sksiltron.com/': {
    title: 'SK siltron, company website',
    publisher: 'SK siltron',
    date: null,
    type: 'page',
  },
  'https://www.skspecialty.com/': {
    title: 'SK specialty, company website (SK스페셜티)',
    publisher: 'SK specialty',
    date: null,
    type: 'page',
  },
  'https://www.skyverse.com/': {
    title: 'Skyverse Technology, company website',
    publisher: 'Skyverse Technology',
    date: null,
    type: 'page',
  },
  'https://www.smee.com.cn/': {
    title: 'Shanghai Micro Electronics Equipment, company website (上海微电子装备集团股份有限公司)',
    publisher: 'Shanghai Micro Electronics Equipment (SMEE)',
    date: null,
    type: 'page',
  },
  'https://www.smics.com/': {
    title: 'SMIC, company website',
    publisher: 'SMIC',
    date: null,
    type: 'page',
  },
  'https://www.soulbrain.co.kr/en/': {
    title: 'Soulbrain, company website',
    publisher: 'Soulbrain',
    date: null,
    type: 'page',
  },
  'https://www.stella-chemifa.co.jp/': {
    title: 'Stella Chemifa, company website (ステラケミファ株式会社)',
    publisher: 'Stella Chemifa',
    date: null,
    type: 'page',
  },
  'https://www.sumitomo-chem.co.jp/': {
    title: 'Sumitomo Chemical, company website (住友化学株式会社)',
    publisher: 'Sumitomo Chemical',
    date: null,
    type: 'page',
  },
  'https://www.teradyne.com/': {
    title: 'Teradyne, company website',
    publisher: 'Teradyne',
    date: null,
    type: 'page',
  },
  'https://www.tfme.com/': {
    title: 'Tongfu Microelectronics, company website (通富微电子股份有限公司)',
    publisher: 'Tongfu Microelectronics',
    date: null,
    type: 'page',
  },
  'https://www.tokuyama.co.jp/': {
    title: 'Tokuyama Corporation, company website',
    publisher: 'Tokuyama Corporation',
    date: null,
    type: 'page',
  },
  'https://www.toppan.com/': {
    title: 'TOPPAN, company website (TOPPANグループサイト)',
    publisher: 'TOPPAN',
    date: null,
    type: 'page',
  },
  'https://www.unimicron.com/': {
    title: 'Unimicron Technology, company website',
    publisher: 'Unimicron Technology',
    date: null,
    type: 'page',
  },
  'https://www.winbond.com/': {
    title: 'Winbond Electronics, company website',
    publisher: 'Winbond Electronics',
    date: null,
    type: 'page',
  },
  'https://www.wuspcb.com/en/': {
    title: 'Wus Printed Circuit, company website',
    publisher: 'Wus Printed Circuit',
    date: null,
    type: 'page',
  },
  'https://www.ymtc.com/en/': {
    title: 'Yangtze Memory Technologies, company website',
    publisher: 'Yangtze Memory Technologies (YMTC)',
    date: null,
    type: 'page',
  },

  // ---------------------------------------------------------------------
  // Same pass, second sweep. Three eCFR sections came back as the site's
  // 'Request Access' wall and a few pages gave the site navigation instead of
  // the headline; the rest below are press releases and rules that state a
  // date the fetcher did not find. Section headings were read from the eCFR
  // structure API, datelines from the release itself.

  // --- titles that were a bot wall or the site navigation
  'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.4': {
    title: '15 CFR 734.4, De minimis U.S. content',
    type: 'regulation',
  },
  'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-734/section-734.9': {
    title: '15 CFR 734.9, Foreign-Direct Product (FDP) Rules',
    type: 'regulation',
  },
  'https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.6': {
    title: '15 CFR 742.6, Regional stability',
    type: 'regulation',
  },
  'https://www.sandisk.com/company/newsroom': {
    title: 'Sandisk, newsroom',
    publisher: 'SanDisk',
    type: 'page',
  },
  'https://www.bis.gov/news-updates': {
    title: 'U.S. Bureau of Industry and Security, news and updates',
    type: 'page',
  },
  'https://m.samsungsem.com/global/newsroom/news/view.do?id=10462': {
    title: 'Samsung Electro-Mechanics, Q2 2026 business results',
    publisher: 'Samsung Electro-Mechanics',
    date: '2026-07-30',
    type: 'press release',
  },
  'https://samsungsem.com/global/newsroom/news/view.do?id=9850': {
    title: 'Samsung Electro-Mechanics Signs MOU with Sumitomo Chemical Group to Establish a Joint Venture for Glass Core Used in Package Substrates',
    publisher: 'Samsung Electro-Mechanics',
    date: '2025-11-05',
    type: 'press release',
  },
  'https://www.disco.co.jp/eg/news/corp/20251215_1.html': {
    title: 'DISCO develops the DFD6080 fully automatic dicing saw for work sizes up to 400 mm square (最大400mm角のパッケージ切断に対応したダイシングソー「DFD6080」を開発)',
    publisher: 'DISCO Corporation',
    date: '2025-12-15',
    type: 'press release',
  },

  // --- dates read off the document (the fetcher found none)
  'https://english.www.gov.cn/news/202312/27/content_WS658b72afc6d0868f4e8e28ba.html': {
    date: '2023-12-27',
  },
  'https://english.www.gov.cn/news/202405/29/content_WS66569746c6d0868f4e8e7987.html': {
    date: '2024-05-29',
  },
  'https://global.canon/en/news/2024/20240926.html': {
    date: '2024-09-26',
  },
  'https://newsroom.lamresearch.com/2024-07-31-Lam-Research-Introduces-Lam-Cryo-TM-3-0-Cryogenic-Etch-Technology-to-Accelerate-Scaling-of-3D-NAND-for-the-AI-Era': {
    date: '2024-07-31',
  },
  'https://newsroom.lamresearch.com/2026-07-29-Lam-Research-Corporation-Reports-Financial-Results-for-the-Quarter-Ended-June-28,-2026': {
    date: '2026-07-29',
  },
  'https://www.fujifilm.com/jp/en/news/hq/11842': {
    date: '2024-10-29',
  },
  'https://www.fujifilm.com/jp/en/news/hq/11942': {
    date: '2024-12-05',
  },
  'https://www.honhai.com/en-us/press-center/press-releases/latest-news/1978': {
    title: 'Hon Hai Technology Group (Foxconn) Announces FY2025 & 4Q25 Financial Results',
    date: '2026-03-16',
  },
  'https://www.huawei.com/en/news/2025/9/hc-superpod-innovation': {
    title: 'Huawei Launches Open-Access SuperPoD Architecture for All-Scenario Computing',
    date: '2025-09-18',
  },
  'https://www.huawei.com/en/news/2025/9/hc-xu-keynote-speech': {
    title: 'Groundbreaking SuperPoD Interconnect: Leading a New Paradigm for AI Infrastructure',
    date: '2025-09-18',
  },
  'https://www.imec-int.com/en/press/imec-demonstrates-16nm-pitch-ru-lines-record-low-resistance-obtained-using-semi-damascene': {
    date: '2025-06-03',
  },
  'https://www.imec-int.com/en/press/imec-demonstrates-cnt-pellicle-utilization-euv-scanner': {
    date: '2020-10-06',
  },
  'https://www.phoenix.gov/newsroom/ced-news/tsmc-announces-additional--100-billion-investment-in-arizona.html': {
    date: '2026-07-16',
  },
  'https://www.besi.com/investor-relations/press-releases/2025/details-1/be-semiconductor-industries-nv-announces-q2-26-and-h1-26-results/': {
    date: '2026-07-23',
  },
  'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026': {
    date: '2026-02-25',
  },
  'https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027': {
    date: '2026-08-26',
  },
  'https://nvidianews.nvidia.com/news/nvidia-and-coherent-announce-strategic-partnership-to-develop-optics-technology-to-scale-next-generation-data-center-architecture': {
    date: '2026-03-02',
  },
  'https://nvidianews.nvidia.com/news/nvidia-announces-strategic-partnership-with-lumentum-to-develop-state-of-the-art-optics-technology': {
    date: '2026-03-02',
  },
  'https://nvidianews.nvidia.com/news/nvidia-spectrum-x-co-packaged-optics-networking-switches-ai-factories': {
    date: '2025-03-18',
  },
  // ===== Citation clean-up, 2 Oct 2026. Each title below replaces a scraped one that was a
  // filename, a bare domain, a site label, a cut-off line, a date line or a slug. It was read off the
  // document (cover, headline, dateline) or, where noted, a syndicated copy; dates only where shown.
  // --- Titles read off the document itself (filename, cover line, date line or cut-off title before)
  'https://aisystemcodesign.github.io/papers/MTIA300_ISCA2026.pdf': {
    title: 'MTIA 300: Meta’s First Training Chip Featuring Built-in NICs and Collective Offloading Engines',
    publisher: 'Meta (ISCA 2026 paper)',
    accessed: '2026-10-02',
  },
  'https://arxiv.org/pdf/1912.09075': {
    title: 'The refined EUV mask model',
    date: '2019-12-19',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://bidenwhitehouse.archives.gov/wp-content/uploads/2021/06/100-day-supply-chain-review-report.pdf': {
    title: 'Building Resilient Supply Chains, Revitalizing American Manufacturing, and Fostering Broad-Based Growth: 100-Day Reviews under Executive Order 14017',
    date: '2021-06',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://cdrdv2-public.intel.com/839363/Intel-Gaudi2-AI-Accelerators-whitepaper.pdf': {
    title: 'Intel® Gaudi®2 AI Accelerators White Paper',
    date: '2023-10',
    accessed: '2026-10-02',
  },
  'https://docs.fcc.gov/public/attachments/FCC-26-50A1.pdf': {
    title: 'Protecting Against National Security Threats to the Communications Supply Chain through the Equipment Authorization Program: Third Report and Order and Third Further Notice of Proposed Rulemaking (FCC-26-50)',
    date: '2026-07-23',
    type: 'regulation',
    accessed: '2026-10-02',
  },
  'https://download.intel.com/newsroom/archive/2025/en-us-2023-09-18-intel-unveils-industryleading-glass-substrates-to-meet-demand-for-more-powerful-compute.pdf': {
    title: 'Intel Unveils Industry-Leading Glass Substrates to Meet Demand for More Powerful Compute',
    date: '2023-09-18',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://images.samsung.com/is/content/samsung/assets/global/ir/docs/2023_con_quarter04_all.pdf': {
    title: 'Samsung Electronics, consolidated financial statements, fourth quarter 2023',
    accessed: '2026-10-02',
  },
  'https://ourbrand.asml.com/m/3136300aa4999bc1/original/2026_01_28_Presentation-Investor-Relations-Q4-2025.pdf': {
    title: 'ASML 2025 fourth-quarter and full-year results (investor presentation)',
    date: '2026-01-28',
    accessed: '2026-10-02',
  },
  'https://ourbrand.asml.com/m/419103cb23dfeaa4/original/asml-2025-annual-report-financial-performance-section.pdf': {
    title: "Financial performance: From ASML's Annual Report 2025",
    accessed: '2026-10-02',
  },
  'https://ourbrand.asml.com/m/8ab959d4926657b/original/asml-2025-annual-report-strategic-report-section.pdf': {
    title: "Strategic report: From ASML's Annual Report 2025",
    accessed: '2026-10-02',
  },
  'https://pubs.usgs.gov/myb/vol3/2023/myb3-2023-china.pdf': {
    title: '2023 Minerals Yearbook: China (advance release)',
    date: '2026-02',
    accessed: '2026-10-02',
  },
  'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-gallium.pdf': {
    title: 'Mineral Commodity Summaries 2026: Gallium',
    accessed: '2026-10-02',
  },
  'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-germanium.pdf': {
    title: 'Mineral Commodity Summaries 2026: Germanium',
    accessed: '2026-10-02',
  },
  'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-indium.pdf': {
    title: 'Mineral Commodity Summaries 2026: Indium',
    accessed: '2026-10-02',
  },
  'https://pubs.usgs.gov/periodicals/mcs2026/mcs2026-silicon.pdf': {
    title: 'Mineral Commodity Summaries 2026: Silicon',
    accessed: '2026-10-02',
  },
  'https://www.accretech.com/en/ir/index/main/00/teaserItems1/00/linkList/02/link/IntegratedReport2025_E.pdf': {
    title: 'Tokyo Seimitsu Integrated Report 2025',
    accessed: '2026-10-02',
  },
  'https://www.agc.com/en/ir/library/bizbriefing/pdf/2026_0602esemiconductor_transcript.pdf': {
    title: 'Semiconductor-related Business Briefing: Event Summary',
    date: '2026-06-02',
    type: 'transcript',
    accessed: '2026-10-02',
  },
  'https://www.agc.com/en/ir/library/outline/pdf/c_overview.pdf': {
    title: 'AGC Company Overview',
    date: '2026-08',
    accessed: '2026-10-02',
  },
  'https://www.ajinomoto.co.jp/company/en/ir/library/result/main/014/teaserItems1/0/linkList/06/link/FY25Q4_Tanshin_E.pdf': {
    title: 'Consolidated Financial Results for the Fiscal Year Ended March 31, 2026 (Under IFRS)',
    date: '2026-05-07',
    accessed: '2026-10-02',
  },
  'https://www.amd.com/content/dam/amd/en/documents/products/accelerators/instinct/amd-instinct-mi455x_brochure.pdf': {
    title: 'AMD Instinct MI455X GPU',
    accessed: '2026-10-02',
  },
  'https://www.asm.com/media/yvxbavwe/20260303-asm-reports-q4-and-full-year-2025-results.pdf': {
    title: 'ASM reports Q4 and full-year 2025 results',
    date: '2026-03-03',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.eia.gov/outlooks/steo/archives/sep26.pdf': {
    title: 'Short-Term Energy Outlook, September 2026',
    accessed: '2026-10-02',
  },
  'https://www.energy.gov/documents/united-states-data-center-energy-usage-report-2025-update': {
    title: 'United States Data Center Energy Usage Report: 2025 Update',
    publisher: 'Lawrence Berkeley National Laboratory',
    date: '2026-06-18',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://www.epw.senate.gov/public/_cache/files/a/c/ac4552ff-551b-40d5-bea6-19dd17a1cfea/1F7BCD91016CBE352434701BE58395874BEA6A892A23ABEE1D7214EC924EC0EB.03-04-2026-isaacs-testimony.pdf': {
    title: 'Testimony of the Semiconductor Industry Association (SIA) before the Senate Committee on Environment & Public Works',
    date: '2026-03-04',
    accessed: '2026-10-02',
  },
  'https://www.finance.senate.gov/download/051425-isaacs-testimony&download=1': {
    title: 'Testimony of David Isaacs, Semiconductor Industry Association, hearing on “Trade in Critical Supply Chains”',
    date: '2025-05-14',
    type: 'pdf',
    accessed: '2026-10-02',
  },
  'https://www.ibiden.com/ir/items/tannshinn2026Q1.pdf': {
    title: 'Consolidated Financial Results for the First Quarter Ended June 30, 2026',
    date: '2026-08-04',
    accessed: '2026-10-02',
  },
  'https://www.jiccapital.co.jp/en/news/.assets/E_20240417_JIC_JICC_PressRelease.pdf': {
    title: 'Announcement Regarding Result of Tender Offer for JSR Corporation (Securities Code: 4185)',
    date: '2024-04-17',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.jiccapital.co.jp/en/news/.assets/E_20250217_JIC_JICC_PressRelease.pdf': {
    title: 'Announcement Regarding Commencement of the Tender Offer for the Shares of Shinko Electric Industries Co., Ltd. (Securities Code: 6967) by JICC-04, Ltd.',
    date: '2025-02-17',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.meti.go.jp/policy/mono_info_service/joho/conference/semicon_digital/0016/handeji16-5.pdf': {
    title: '基礎資料集（資料5）',
    date: '2026-06-23',
    accessed: '2026-10-02',
  },
  'https://www.mgc.co.jp/eng/ir/files/2410022e.pdf': {
    title: 'Electronics Materials Business (Mitsubishi Gas Chemical business briefing)',
    date: '2024-10-02',
    accessed: '2026-10-02',
  },
  'https://www.miti.gov.my/miti/resources/Media%20Release/%5BFINAL%5D_MITI_Press_Stmt_Malaysia_Regulates_Trade_of_US_AI_Chips_2025-07-14.pdf': {
    title: 'Export, Transshipment and Transit of High-Performance AI Chips of US Origin',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.nikon.com/content/dam/web-assets/nikoncom/company/local/global/en/ir/ir_library/result/pdf/2026/26_all_e.pdf': {
    title: 'Financial Results: The Year Ended March 31, 2026',
    date: '2026-05-08',
    accessed: '2026-10-02',
  },
  'https://www.nittobo.co.jp/eng/ir/pdf/Nittobo_Integrated-Report_2025.pdf': {
    title: 'Nittobo Group Integrated Report 2025',
    accessed: '2026-10-02',
  },
  'https://www.sas-globalwafers.com/wp-content/uploads/2026/04/GlobalWafers_2025-Annual-Report-EN.pdf': {
    title: 'GlobalWafers Co., Ltd. Annual Report 2025',
    accessed: '2026-10-02',
  },
  'https://www.semiconductors.org/wp-content/uploads/2024/05/Report_Emerging-Resilience-in-the-Semiconductor-Supply-Chain.pdf': {
    title: 'Emerging Resilience in the Semiconductor Supply Chain',
    publisher: 'Boston Consulting Group and Semiconductor Industry Association',
    date: '2024-05',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://www.semiconductors.org/wp-content/uploads/2025/07/SIA-State-of-the-Industry-Report-2025.pdf': {
    title: '2025 State of the U.S. Semiconductor Industry',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://www.semiconductors.org/wp-content/uploads/2026/07/SIA_2026_State-of-the-Semiconductor-Industry.pdf': {
    title: '2026 State of the U.S. Semiconductor Industry',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://www.siltronic.com/fileadmin/investorrelations/2026/Q1/20260429_Siltronic_InvestorPresentation__.pdf': {
    title: 'Investor Presentation: Foundation of Digital Life',
    date: '2026-04',
    accessed: '2026-10-02',
  },
  'https://www.sumcosi.com/english/pdf/ir/library/shareholders/27/pdf/nc_e_27.pdf': {
    title: 'Notice of Convocation of the 27th Ordinary General Meeting of Shareholders',
    date: '2026-03-06',
    accessed: '2026-10-02',
  },
  'https://www.tel.com/ir/library/consolidated-financial-statements/i242su00000000yk-att/Consolidated_Financial_Statements_FY2026.pdf': {
    title: 'Consolidated Financial Statements FY2026',
    accessed: '2026-10-02',
  },
  'https://www.tel.com/ir/library/report/pjuomj00000000tf-att/fy26q4transcript-e.pdf': {
    title: 'FY2026 (April 2025-March 2026) Financial Announcement, transcript',
    date: '2026-04-30',
    type: 'transcript',
    accessed: '2026-10-02',
  },
  'https://www.usitc.gov/publications/701_731/pub5531.pdf': {
    title: 'Large Power Transformers from South Korea, Investigation No. 731-TA-1189 (Second Review), Publication 5531',
    date: '2024-08',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://www.wsts.org/esraCMS/extension/media/f/WST/7618/WSTS_FC-Release-2026-May.pdf': {
    title: 'Global Semiconductor Market Surges Beyond USD 1.5 Trillion in 2026 Driven by Extraordinary Memory Expansion',
    date: '2026-06-02',
    type: 'press release',
    accessed: '2026-10-02',
  },
  // --- Chinese exchange filings: clean titles from the cover (CNINFO) or the exchange listing (SSE, whose PDFs sit behind a script check)
  'https://static.cninfo.com.cn/finalpage/2026-03-27/1225036148.PDF': {
    title: '湖北鼎龙控股股份有限公司2025年年度报告摘要',
  },
  'https://static.cninfo.com.cn/finalpage/2026-04-25/1225182755.PDF': {
    title: '深圳中科飞测科技股份有限公司2025年年度报告摘要',
  },
  'https://static.cninfo.com.cn/finalpage/2026-04-28/1225217315.PDF': {
    title: '北京华大九天科技股份有限公司2025年年度报告全文',
  },
  'https://static.cninfo.com.cn/finalpage/2026-08-26/1225503057.PDF': {
    title: '西安奕斯伟材料科技股份有限公司2026年半年度报告',
  },
  'https://static.sse.com.cn/disclosure/listedinfo/announcement/c/new/2025-10-22/688783_20251022_UYMD.pdf': {
    title: '西安奕材首次公开发行股票并在科创板上市招股说明书',
    date: '2025-10-22',
    type: 'filing',
    accessed: '2026-10-02',
  },
  'https://static.sse.com.cn/disclosure/listedinfo/announcement/c/new/2026-04-21/688783_20260421_6JVC.pdf': {
    title: '西安奕斯伟材料科技股份有限公司2025年年度报告摘要',
    date: '2026-04-21',
    type: 'filing',
    accessed: '2026-10-02',
  },
  'https://static.sse.com.cn/disclosure/listedinfo/announcement/c/new/2026-05-15/688347_20260515_XRZ3.pdf': {
    title: '华虹公司2025年年度报告（修订版）',
    date: '2026-05-15',
    type: 'filing',
    accessed: '2026-10-02',
  },
  'https://static.sse.com.cn/stock/disclosure/announcement/c/202509/002098_20250919_IP6Z.pdf': {
    title: '摩尔线程智能科技（北京）股份有限公司首次公开发行股票并在科创板上市招股说明书（上会稿）',
    type: 'filing',
    accessed: '2026-10-02',
  },
  // --- Press releases and articles: headline read off the page, a mirror of it, or the publisher API
  'https://aws.amazon.com/about-aws/whats-new/2025/12/amazon-ec2-trn3-ultraservers/': {
    title: 'Announcing Amazon EC2 Trn3 UltraServers for faster, lower-cost generative AI training',
  },
  'https://blogs.microsoft.com/blog/2026/01/26/maia-200-the-ai-accelerator-built-for-inference/': {
    title: 'Maia 200: The AI accelerator built for inference',
    accessed: '2026-10-02',
  },
  'https://investor.asml.com/news-releases/news-release-details/statement-regarding-partial-revocation-export-license': {
    title: 'Statement regarding partial revocation export license',
    date: '2024-01-01',
  },
  'https://investors.broadcom.com/news-releases/news-release-details/broadcom-announces-tomahawkr-6-davisson-industrys-first-1024': {
    title: "Broadcom Announces Tomahawk 6 – Davisson, the Industry's First 102.4-Tbps Ethernet Switch with Co-Packaged Optics",
    accessed: '2026-10-02',
  },
  'https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-4-industrys-highest-bandwidth-ethernet': {
    title: 'Broadcom Ships Tomahawk 4, Industry’s Highest Bandwidth Ethernet Switch Chip at 25.6 Terabits per Second',
    accessed: '2026-10-02',
  },
  'https://investors.broadcom.com/news-releases/news-release-details/broadcom-ships-tomahawk-6-worlds-first-1024-tbps-switch': {
    title: 'Broadcom Ships Tomahawk 6: World’s First 102.4 Tbps Switch',
    accessed: '2026-10-02',
  },
  'https://investors.micron.com/news/press-release/2026/Micron-Technology-Inc--Reports-Record-Fiscal-Fourth-Quarter-and-Full-Year-2026-Results/default.aspx': {
    title: 'Micron Technology, Inc. Reports Record Fiscal Fourth-Quarter and Full-Year 2026 Results',
    date: '2026-09-30',
    accessed: '2026-10-02',
  },
  'https://ir.kla.com/news-events/press-releases/detail/518/kla-corporation-reports-fiscal-2026-fourth-quarter-and-full': {
    title: 'KLA Corporation Reports Fiscal 2026 Fourth Quarter and Full Year Results',
  },
  'https://news.samsung.com/global/samsung-begins-chip-production-using-3nm-process-technology-with-gaa-architecture': {
    title: 'Samsung Begins Chip Production Using 3nm Process Technology With GAA Architecture',
  },
  'https://news.samsung.com/global/samsung-develops-industry-first-36gb-hbm3e-12h-dram': {
    title: 'Samsung Develops Industry-First 36GB HBM3E 12H DRAM',
  },
  'https://news.samsung.com/global/samsung-ships-industry-first-commercial-hbm4': {
    title: 'Samsung Ships Industry-First Commercial HBM4 With Ultimate Performance for AI Computing',
  },
  'https://newsroom.amd.com/news/aai-2026-helios-update/': {
    title: 'AAI 2026: AMD Launches AMD Helios Rackscale Solution for Frontier AI',
    date: '2026-07-23',
    accessed: '2026-10-02',
  },
  'https://pr.tsmc.com/english/news/3136': {
    title: 'TSMC Celebrates 30th North America Technology Symposium with Innovations Powering AI with Silicon Leadership',
    date: '2024-04-24',
    accessed: '2026-10-02',
  },
  'https://pr.tsmc.com/english/news/3204': {
    title: 'TSMC January 2025 Revenue Report and the Statement on the Impact of Earthquake',
    date: '2025-02-10',
    accessed: '2026-10-02',
  },
  'https://ultraethernet.org/ultra-ethernet-consortium-uec-launches-specification-1-0-transforming-ethernet-for-ai-and-hpc-at-scale/': {
    title: 'Ultra Ethernet Consortium (UEC) Launches Specification 1.0 Transforming Ethernet for AI and HPC at Scale',
  },
  'https://www.ajinomoto.com/stories/the-ajinomoto-groups-unexpected-role-in-semiconductor-manufacturing-the-insulating-film-abf-born-from-aminoscience': {
    title: 'The Ajinomoto Group’s Unexpected Role in Semiconductor Manufacturing: The Insulating Film “ABF” Born from “AminoScience”',
  },
  'https://www.csis.org/blogs/perspectives-innovation/russias-invasion-ukraine-impacts-gas-markets-critical-chip-production': {
    title: "Russia's Invasion of Ukraine Impacts Gas Markets Critical to Chip Production",
  },
  'https://www.csis.org/blogs/strategic-technologies-blog/breakthroughs-or-boasts-assessing-recent-chinese-lithography': {
    title: 'Breakthroughs or Boasts? Assessing Recent Chinese Lithography Advancements',
  },
  'https://www.doosan.com/en/media-center/press-release_view?id=20172812': {
    title: 'Doosan Signs Share Purchase Agreement with SK for SK Siltron',
    date: '2026-07-31',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.investors.dupont.com/news-and-media/press-release-details/2025/DuPont-Completes-Separation-of-Qnity-Electronics/default.aspx': {
    title: 'DuPont Completes Separation of Qnity Electronics',
    date: '2025-11-03',
    accessed: '2026-10-02',
  },
  'https://www.jcetglobal.com/en/site/news-detail?id=2048': {
    title: 'JCET Releases 2025 Annual Report, Posts Record-High Full-Year Revenue and Higher Profit Before Tax',
    date: '2026-04-09',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.jcetglobal.com/en/site/news-detail?id=2052': {
    title: 'JCET Accelerates Strategic Shift Toward High-End Advanced Packaging, 2025 Advanced Packaging Revenue Hits Record High',
    date: '2026-04-21',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.jsr.co.jp/jsr_e/news/2021/20210917.html': {
    title: 'JSR Agrees to Acquire EUV Pioneer Inpria Corporation',
  },
  // live page removed by METI ("page does not exist", 2 Oct 2026); cited through the Wayback copy of 8 April 2025
  'https://web.archive.org/web/20250408171837/https://www.meti.go.jp/english/press/2023/0323_001.html': {
    publisher: 'Ministry of Economy, Trade and Industry (Japan)',
    title: 'Circular Notice on Partial Amendment to the Circular Notice on the Operation of the Cabinet Order on Export Trade Control and other circular notices (Review of Export Control to South Korea)',
    date: '2023-03-23',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.rapidus.inc/en/news_topics/information/20260605-2/': {
    title: 'Rapidus Completes 150 Billion Yen Funding Round from Japan Government',
    date: '2026-06-05',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.rapidus.inc/en/news_topics/information/rapidus-achieves-significant-milestone-at-its-state-of-the-art-foundry-with-prototyping-of-leading-edge-2nm-gaa-transistors/': {
    title: 'Rapidus Achieves Significant Milestone at its State-of-the-Art Foundry with Prototyping of Leading-Edge 2nm GAA Transistors',
    date: '2025-07-18',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.rapidus.inc/en/news_topics/information/rapidus-secures-267-6-billion-yen-in-funding-from-japan-government-and-private-sector-companies/': {
    title: 'Rapidus Secures 267.6 Billion Yen in Funding from Japan Government and Private Sector Companies',
    date: '2026-02-27',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://www.reuters.com/technology/nvidias-new-china-focused-ai-chip-set-be-sold-similar-price-huawei-product-2024-02-01/': {
    title: "Nvidia's new China-focused AI chip set to be sold at similar price to Huawei product",
    date: '2024-02-01',
    accessed: '2026-10-02',
  },
  'https://www.sas-globalwafers.com/en/gwc_news_en_20250516/': {
    title: 'GlobalWafers America Officially Opens for Business',
  },
  'https://www.sas-globalwafers.com/en/gwc_news_en_20260303/': {
    title: 'GlobalWafers Reports Full Year 2025 Results',
  },
  'https://www.semiconductors.org/global-annual-semiconductor-sales-increase-25-6-to-791-7-billion-in-2025/': {
    title: 'Global Annual Semiconductor Sales Increase 25.6% to $791.7 Billion in 2025',
  },
  'https://www.sumitomo-chem.co.jp/english/news/detail/20260702e_2.html': {
    title: 'Sumitomo Chemical Subsidiary to Establish of a Joint Venture with Samsung Electro-Mechanics for the Glass Core Substrate Business',
    date: '2026-07-02',
    accessed: '2026-10-02',
  },
  'https://www.whitehouse.gov/presidential-actions/2026/01/adjusting-imports-of-semiconductors-semiconductor-manufacturing-equipment-and-their-derivative-products-into-the-united-states/': {
    title: 'Adjusting Imports of Semiconductors, Semiconductor Manufacturing Equipment, and Their Derivative Products Into the United States',
  },
  // --- SEMI press releases (Cloudflare wall; headline confirmed on syndicated copies, so no date is given)
  'https://www.semi.org/en/products-services/market-data/world-fab-forecast': {
    title: 'World Fab Forecast',
  },
  'https://www.semi.org/en/semi-press-release/eighteen-new-semiconductor-fabs-to-start-construction-in-2025-semi-reports': {
    title: 'Eighteen New Semiconductor Fabs to Start Construction in 2025, SEMI Reports',
    accessed: '2026-10-02',
  },
  'https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.1-billion-dollars-in-revenue-in-q1-2025': {
    title: 'ESD Alliance Reports Electronic System Design Industry Posts $5.1 Billion in Revenue in Q1 2025',
    accessed: '2026-10-02',
  },
  'https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.1-billion-dollars-in-revenue-in-q2-2025': {
    title: 'ESD Alliance Reports Electronic System Design Industry Posts $5.1 Billion in Revenue in Q2 2025',
    accessed: '2026-10-02',
  },
  'https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.5-billion-dollars-in-revenue-in-q4-2025': {
    title: 'ESD Alliance Reports Electronic System Design Industry Posts $5.5 Billion in Revenue in Q4 2025',
    accessed: '2026-10-02',
  },
  'https://www.semi.org/en/semi-press-release/esd-alliance-reports-electronic-system-design-industry-posts-5.6-billion-dollars-in-revenue-in-q3-2025': {
    title: 'ESD Alliance Reports Electronic System Design Industry Posts $5.6 Billion in Revenue in Q3 2025',
  },
  'https://www.semi.org/en/semi-press-release/semi-reports-2025-annual-worldwide-silicon-wafer-shipments-and-revenue-results': {
    title: 'SEMI Reports 2025 Annual Worldwide Silicon Wafer Shipments and Revenue Results',
    accessed: '2026-10-02',
  },
  // --- Product, documentation and regulation pages whose title was a site label or carried the site name
  'https://corp.mediatek.com/investor-relations': {
    title: 'MediaTek Investor Relations',
  },
  'https://docs.cloud.google.com/tpu/docs/tpu7x': {
    title: 'TPU7x (Ironwood)',
  },
  'https://docs.cloud.google.com/tpu/docs/v4': {
    title: 'TPU v4',
  },
  'https://docs.cloud.google.com/tpu/docs/v5e': {
    title: 'TPU v5e',
  },
  'https://docs.cloud.google.com/tpu/docs/v5p': {
    title: 'TPU v5p',
  },
  'https://docs.cloud.google.com/tpu/docs/v6e': {
    title: 'TPU v6e',
  },
  'https://docs.habana.ai/en/latest/Gaudi_Overview/Gaudi_Architecture.html': {
    title: 'Gaudi Architecture',
  },
  'https://en.mthreads.com/product/KUAE': {
    title: 'MTT KUAE',
  },
  'https://en.mthreads.com/product/S5000': {
    title: 'MTT S5000: Universal GPU for AI Training and Inference',
  },
  'https://furiosa.ai/rngd': {
    title: 'RNGD product page',
  },
  'https://groq.com/inference': {
    title: 'Groq Cloud',
  },
  'https://hts.usitc.gov/search?query=3818.00.00': {
    title: 'Harmonized Tariff Schedule, heading 3818.00.00',
  },
  'https://ontoinnovation.com/products': {
    title: 'Onto Innovation, products page',
  },
  'https://power.mhi.com/products/gasturbines': {
    title: 'Gas Turbines',
  },
  'https://sambanova.ai/technology/sn40l-rdu-ai-chip': {
    title: 'RDU: Next-Gen AI Chip for Inference at Scale',
  },
  'https://semiconductor.samsung.com/foundry/': {
    title: 'Samsung Foundry overview',
  },
  'https://semiconductor.samsung.com/sas/company/taylor/': {
    title: 'Taylor, US Fab',
  },
  'https://towersemi.com/technology/rf-and-hpa/silicon-photonics-rf/': {
    title: 'Silicon Photonics (SiPho)',
  },
  'https://www.airliquide.com/group/activities/electronics': {
    title: 'Air Liquide, electronics page',
  },
  'https://www.alchip.com/en/Investors/financials/': {
    title: 'Alchip Technologies, financials page',
  },
  'https://www.appliedmaterials.com/eu/en/semiconductor/semiconductor-technologies/pvd.html': {
    title: 'Applied Materials, PVD technology page',
  },
  'https://www.asteralabs.com/products/': {
    title: 'Astera Labs, products page',
  },
  'https://www.bis.gov/ear/title-15/subtitle-b/chapter-vii/subchapter-c/part-744/ss-74423-supercomputer-advanced-node': {
    title: '15 CFR 744.23, “Supercomputer,” “advanced-node integrated circuits,” and semiconductor manufacturing equipment end use controls',
    type: 'regulation',
    accessed: '2026-10-02',
  },
  'https://www.celestica.com/hardware-platform-solutions': {
    title: 'Celestica, hardware platform solutions page',
  },
  'https://www.cerebras.ai/cs4': {
    title: 'Cerebras CS-4: Fastest AI Inference System',
    accessed: '2026-10-02',
  },
  'https://www.cerebras.ai/product-chip': {
    title: 'Cerebras WSE-3 Turbo: Wafer-Scale AI Chip',
    accessed: '2026-10-02',
  },
  'https://www.coherent.com/networking': {
    title: 'Coherent, networking page',
  },
  'https://www.credosemi.com/products/': {
    title: 'Credo, products page',
  },
  'https://www.ferrotec.com/products/': {
    title: 'Ferrotec, products and technologies page',
  },
  'https://www.gevernova.com/gas-power': {
    title: 'Gas Power',
  },
  'https://www.gigaphoton.com/company': {
    title: 'Gigaphoton, company profile',
  },
  'https://www.global.dnp/en/biz/solution/semiconductors/': {
    title: 'DNP, semiconductors page',
  },
  'https://www.govinfo.gov/app/details/PLAW-117publ167': {
    title: 'Public Law 117-167 (H.R. 4346), CHIPS and Science Act',
    accessed: '2026-10-02',
  },
  'https://www.hanmisemi.com/en/product/index.html': {
    title: 'Hanmi Semiconductor, products page',
  },
  'https://www.hiascend.com/hardware/ai-server?tag=900A2': {
    title: 'Atlas 800T A2 服务器',
    accessed: '2026-10-02',
  },
  'https://www.hiascend.com/hardware/cluster?tag=900a3': {
    title: 'Atlas 900 A3 SuperPoD 液冷超节点',
    accessed: '2026-10-02',
  },
  'https://www.hiascend.com/hardware/processor?tag=950dt': {
    title: 'Ascend 950DT',
    accessed: '2026-10-02',
  },
  'https://www.hitachienergy.com/products-and-solutions/transformers': {
    title: 'Transformers',
  },
  'https://www.horiba.com/int/semiconductor/': {
    title: 'HORIBA, semiconductor page',
  },
  'https://www.hoya.com/ir/2025/en/review/it.html': {
    title: 'HOYA Report 2025: Information Technology Business, Review of Operations',
  },
  'https://www.jsr.co.jp/jsr_e/products/em/': {
    title: 'JSR, Electronic Materials Business',
  },
  'https://www.jx-nmm.com/english/company/glance/': {
    title: 'Quick Guide to JX Advanced Metals',
  },
  'https://www.kyec.com.tw/en/about': {
    title: 'About KYEC',
    accessed: '2026-10-02',
  },
  'https://www.lamresearch.com/product/sabre/': {
    title: 'SABRE Product Family',
  },
  'https://www.lasertec.co.jp/en/ir/plan/message.html': {
    title: 'Lasertec, business report',
  },
  'https://www.lasertec.co.jp/en/products/semiconductor/actis_a150.html': {
    title: 'ACTIS A150',
  },
  'https://www.mks.com/s/semiconductor-solutions': {
    title: 'Semiconductor Solutions',
    accessed: '2026-10-02',
  },
  'https://www.monolithicpower.com/en/applications/enterprise-computing.html': {
    title: 'Monolithic Power Systems, enterprise computing applications page',
  },
  'https://www.morita-kagaku.co.jp/en/company/profile/': {
    title: 'Morita Chemical Industries, company outline',
    accessed: '2026-10-02',
  },
  'https://www.mpi-corporation.com/ast/': {
    title: 'Advanced Semiconductor Test',
  },
  'https://www.nikon.com/business/semi/lineup/': {
    title: 'Nikon, semiconductor lithography systems lineup',
  },
  'https://www.nittobo.co.jp/eng/business/electronicmaterials/t-glass.htm': {
    title: 'T-glass',
  },
  'https://www.nuflare.co.jp/english/products/beam/': {
    title: 'EB Mask Writer',
  },
  'https://www.parksystems.com/en/company/about-us': {
    title: 'Park Systems, About Us page',
    accessed: '2026-10-02',
  },
  'https://www.photronics.com/products/': {
    title: 'Photronics, products page',
  },
  'https://www.semes.com/en/company/management-information/view': {
    title: 'SEMES, management information page',
    accessed: '2026-10-02',
  },
  'https://www.shinetsu.co.jp/en/products/electronics-materials/photomask-blanks/': {
    title: 'Photomask blanks',
  },
  'https://www.shinko.co.jp/english/product/': {
    title: 'Shinko Electric Industries, products page',
  },
  'https://www.soitec.com/en/products': {
    title: 'Soitec, products page',
  },
  'https://www.soitec.com/home/group': {
    title: 'Soitec, key figures',
  },
  'https://www.tsmc.com/english/aboutTSMC/company_profile': {
    title: 'TSMC, company profile page',
  },
  'https://www.uciexpress.org/specifications': {
    title: 'UCIe specifications',
  },
  'https://www.utacgroup.com/services/': {
    title: 'UTAC, services page',
  },
  'https://www.wiwynn.com/products': {
    title: 'Wiwynn, products page',
  },
  // --- Company home pages: a tagline, keyword list, bot-wall notice or bare company name, put in the house style
  'https://ats.net/': {
    title: 'AT&S, company website',
    date: null,
  },
  'https://awavesemi.com/': {
    title: 'Qualcomm Data Center Products (Qualcomm Dragonfly)',
    publisher: 'Qualcomm (formerly Alphawave Semi)',
    accessed: '2026-10-02',
  },
  'https://ayarlabs.com/': {
    title: 'Ayar Labs, company website',
    date: null,
  },
  'https://gf.com/': {
    title: 'GlobalFoundries, company website',
    date: null,
  },
  'https://groq.com/': {
    title: 'Groq, company website',
  },
  'https://www.accton.com/': {
    title: 'Accton Technology, company website',
  },
  'https://www.acmrcsh.com/': {
    title: 'ACM Research (Shanghai), company website',
  },
  'https://www.alchip.com/en/': {
    title: 'Alchip Technologies, company website',
  },
  'https://www.amec-inc.com/en/': {
    title: 'AMEC, company website (中微公司)',
  },
  'https://www.asml.com/': {
    title: 'ASML, company website',
    date: null,
  },
  'https://www.asmpt.com/': {
    title: 'ASMPT, company website',
  },
  'https://www.broadcom.com/': {
    title: 'Broadcom, company website',
  },
  'https://www.chromaate.com/': {
    title: 'Chroma ATE, company website',
  },
  'https://www.cxmt.com/en/': {
    title: 'CXMT, company website',
  },
  'https://www.deltaww.com/': {
    title: 'Delta Electronics, company website',
  },
  'https://www.emdgroup.com/': {
    title: 'EMD Group, company website',
  },
  'https://www.eoptolink.com/en/': {
    title: 'Eoptolink Technology, company website',
  },
  'https://www.ibiden.com/': {
    title: 'Ibiden, company website',
  },
  'https://www.ichorsystems.com/': {
    title: 'Ichor Systems, company website',
  },
  'https://www.imaginationtech.com/': {
    title: 'Imagination Technologies, company website',
    date: null,
  },
  'https://www.innolight.com/en/': {
    title: 'InnoLight Technology, company website',
  },
  'https://www.inpria.com/': {
    title: 'Inpria, company website',
  },
  'https://www.jabil.com/': {
    title: 'Jabil, company website',
  },
  'https://www.kns.com/': {
    title: 'Kulicke & Soffa, company website',
  },
  'https://www.lenovo.com/': {
    title: 'Lenovo, company website',
  },
  'https://www.luxshare-ict.com/en/': {
    title: 'Luxshare Precision, company website',
  },
  'https://www.novami.com/': {
    title: 'Nova, company website',
    date: null,
  },
  'https://www.pfeiffer-vacuum.com/': {
    title: 'Pfeiffer Vacuum, company website',
  },
  'https://www.piotech.cn/': {
    title: 'Piotech, company website (拓荆科技)',
  },
  'https://www.qualcomm.com/': {
    title: 'Qualcomm, company website',
  },
  'https://www.rapidus.inc/en/': {
    title: 'Rapidus, company website',
    date: null,
  },
  'https://www.shpcb.com/': {
    title: 'Victory Giant Technology, company website (胜宏科技)',
  },
  'https://www.sifive.com/': {
    title: 'SiFive, company website',
  },
  'https://www.skyverse.cn/': {
    title: 'Skyverse Technology, company website (中科飞测)',
    accessed: '2026-10-02',
  },
  'https://www.technoprobe.com/': {
    title: 'Technoprobe, company website',
  },
  'https://www.ttm.com/': {
    title: 'TTM Technologies, company website',
    date: null,
  },
  'https://www.uct.com/': {
    title: 'Ultra Clean Holdings, company website',
  },
  'https://www.vertiv.com/': {
    title: 'Vertiv, company website',
    accessed: '2026-10-02',
  },
  'https://www.wuhanjingce.com/en/': {
    title: 'Wuhan Jingce Electronic Group, company website',
  },
  // --- Archived copies (web.archive.org): cite the original publisher, not the archive
  'https://web.archive.org/web/20240726075938/https://www.vdlgroep.com/en/news/vdl-etg-builds-complex-frames-for-zeiss': {
    title: 'VDL ETG builds complex frames for Zeiss',
    publisher: 'VDL Groep',
    date: '2019-03-22',
    type: 'press release',
    accessed: '2026-10-02',
  },
  'https://web.archive.org/web/20250809220519/http://nsig.com/en/about': {
    title: 'National Silicon Industry Group, company overview (硅产业集团)',
    publisher: 'National Silicon Industry Group (NSIG)',
    type: 'page',
    accessed: '2026-10-02',
  },
  'https://web.archive.org/web/20260911215719/https://www.dongjin.com/en/business/semiconductor.php': {
    title: 'Dongjin Semichem, semiconductor materials page',
    publisher: 'Dongjin Semichem',
    type: 'page',
    accessed: '2026-10-02',
  },
  // --- Pages that could not be opened (bot wall): plain title from the URL, no date
  'https://echa.europa.eu/-/echa-publishes-updated-pfas-restriction-proposal': {
    title: 'ECHA publishes updated PFAS restriction proposal',
    type: 'press release',
  },
  // --- Second pass: a cover set in capitals, a Federal Register title that runs the respondents'
  // street addresses into it (kept to its own order clause), and leftover site labels
  'https://www.semiconductors.org/wp-content/uploads/2025/01/SIA_WINNING-THE-CHIP-RACE_2025.pdf': {
    title: 'Winning the Chip Race: American Semiconductor Innovation and Competitiveness under the Trump Administration & the 119th Congress',
    date: '2025-01',
    type: 'report',
    accessed: '2026-10-02',
  },
  'https://www.federalregister.gov/documents/2018/04/23/2018-08354/in-the-matter-of-zhongxing-telecommunications-equipment-corporation-zte-plaza-keji-road-south': {
    title: 'Order Activating Suspended Denial Order Relating to Zhongxing Telecommunications Equipment Corporation and ZTE Kangxun Telecommunications Ltd.',
  },
  'https://www.govinfo.gov/content/pkg/FR-2018-04-23/html/2018-08354.htm': {
    title: 'Order Activating Suspended Denial Order Relating to Zhongxing Telecommunications Equipment Corporation and ZTE Kangxun Telecommunications Ltd.',
  },
  'https://www.tel.com/product/precio.html': {
    title: 'Precio™ Series',
  },
  'https://www.tel.com/product/telindy.html': {
    title: 'TELINDY™ Series',
  },
  'https://epoch.ai/data/ai-data-centers/directory/colossus-1': {
    title: 'Colossus 1, AI data centers directory',
  },
};
