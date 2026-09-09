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
  /^(access denied|just a moment|forbidden|403|404|401|429|error\b|page not found|not found|attention required|are you a robot|robot check|请稍候|security check|redirecting|challenge|blocked|service unavailable|bad gateway|site maintenance|sec\.gov \|)/i;

// Real page titles that name no document: a bare "Home", "Index", "Untitled".
const GENERIC_TITLE = /^(home|home ?page|index|untitled|document|default|welcome|main|top)$/i;

const JUNK_TITLE = new RegExp(`(${WALL_TITLE.source})|(${GENERIC_TITLE.source})`, 'i');

// Pull the content of a <meta> tag. `key` is the attribute value to look for
// (og:title, article:published_time, ...) matched on name=, property=, or
// itemprop=. The quote character is captured and required to close, so a title
// containing an apostrophe ("NVIDIA's B200...") is not cut short — the bug this
// replaced a hand-written pattern list to avoid.
function metaTag(html, key) {
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const attr = `(?:name|property|itemprop)\\s*=\\s*(["'])${k}\\1`;
  const content = `content\\s*=\\s*(["'])([\\s\\S]*?)\\2`;
  for (const re of [
    new RegExp(`<meta[^>]*?${attr}[^>]*?${content}[^>]*>`, 'i'),
    new RegExp(`<meta[^>]*?${content}[^>]*?${attr}[^>]*>`, 'i'),
  ]) {
    const m = html.match(re);
    if (m) {
      const v = decodeEntities((m[3] || m[2] || '').trim());
      if (v && !/^%%.*%%$/.test(v)) return v;
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

function guessType(url, rec) {
  const u = url.toLowerCase();
  const host = hostOf(url);
  if (rec && rec.isPdf) return 'pdf';
  if (u.endsWith('.pdf')) return 'pdf';
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

const FR_DOC_RE = /(?:\/documents\/\d{4}\/\d{2}\/\d{2}\/|\/pdf\/)((?:19|20)\d{2}-\d{3,6})(?:\/|\.pdf)/;

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
      type: isGovinfo ? 'pdf' : 'regulation',
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
    const res = await fetchUrl(url);
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
      if (raw && raw.length > 6 && !WALL_TITLE.test(raw) && !GENERIC_TITLE.test(raw)) title = raw;
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
  'files.gao.gov': 'U.S. Government Accountability Office',
  'eia.gov': 'U.S. Energy Information Administration',
  'pubs.usgs.gov': 'U.S. Geological Survey',
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
  'ocichem.com': 'OCI Company',
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
};

// ----------------------------------------------------------- hand-checked
// URL -> fields that override whatever the fetcher produced. Every entry below
// was read off the page itself (headline and dateline) after the automated
// fetch was refused by a bot wall. Where a page would not show its date, the
// date is left out rather than guessed.
const MANUAL = {
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

  // --- company pages read in the browser after the fetcher was refused
  'https://industrial.panasonic.com/ww/products/pt/megtron': {
    title: 'Multi-layer Circuit Board Materials for ICT infrastructure equipment "MEGTRON" series',
    publisher: 'Panasonic Industry',
    type: 'page',
  },
  'https://www.amphenol.com/markets/it-datacom': {
    title: 'IT Datacom',
    publisher: 'Amphenol',
    type: 'page',
  },
  'https://www.appliedmaterials.com/us/en/semiconductor.html': {
    title: 'Semiconductor Systems',
    publisher: 'Applied Materials',
    type: 'page',
  },
  'https://www.appliedmaterials.com/eu/en/product-library/kinex-integrated-die-to-wafer-hybrid-bonding-system.html': {
    title: 'Kinex',
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
    title: '首頁 — 鴻海科技集團 (Hon Hai Technology Group home page)',
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
    title: '华虹宏力半导体有限公司 (Hua Hong Grace Semiconductor home page)',
    publisher: 'Hua Hong Semiconductor',
    type: 'page',
  },
  'https://www.intel.com/content/www/us/en/foundry/overview.html': {
    title: 'Semiconductor Manufacturing Company for the AI Era',
    publisher: 'Intel Foundry',
    type: 'page',
  },
  'https://www.jcetglobal.com/en/': {
    title: 'JCET Group home page',
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
    title: 'PRIMARIUS',
    publisher: 'Primarius Technologies',
    type: 'page',
  },
  'https://www.supermicro.com/en/products/gpu': {
    title: 'GPU Servers For AI, Deep / Machine Learning & HPC',
    publisher: 'Supermicro',
    type: 'page',
  },
  'https://www.wacker.com/cms/en-us/products/product-groups/polysilicon/polysilicon.html': {
    title: 'Polysilicon',
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
};
