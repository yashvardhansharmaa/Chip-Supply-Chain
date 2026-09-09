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
  ];
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

function metaContent(html, patterns) {
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1] && m[1].trim()) return decodeEntities(m[1].trim());
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
  const d = new Date(s);
  if (!isNaN(d.getTime()) && d.getFullYear() > 1990 && d.getFullYear() < 2100) {
    return d.toISOString().slice(0, 10);
  }
  return null;
}

function extractFromHtml(html) {
  const out = { title: null, date: null, siteName: null };

  const ogTitle = metaContent(html, [
    /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
    /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']title["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']dc\.title["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']citation_title["'][^>]+content=["']([^"']+)["']/i,
  ]);
  const tagTitle = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];

  out.title =
    cleanTitle(ogTitle) ||
    cleanTitle(tagTitle && tagTitle.replace(/<[^>]+>/g, '')) ||
    cleanTitle(h1 && h1.replace(/<[^>]+>/g, ''));
  out.rawTitle = decodeEntities((tagTitle || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()) || null;

  const dateRaw = metaContent(html, [
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']article:published_time["']/i,
    /<meta[^>]+name=["']article:published_time["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+itemprop=["']datePublished["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']citation_publication_date["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']citation_date["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']publish[-_]?date["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']publication[-_]?date["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']date["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']dc\.date["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']DC\.date\.issued["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']pubdate["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']sailthru\.date["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:published_time["'][^>]+content=["']([^"']+)["']/i,
    /<time[^>]+datetime=["']([^"']+)["']/i,
  ]);
  out.date = normaliseDate(dateRaw);

  if (!out.date) {
    // JSON-LD datePublished
    const ld = html.match(/"datePublished"\s*:\s*"([^"]+)"/i);
    if (ld) out.date = normaliseDate(ld[1]);
  }
  if (!out.date) {
    const mod = metaContent(html, [
      /<meta[^>]+property=["']article:modified_time["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']last-?modified["'][^>]+content=["']([^"']+)["']/i,
    ]);
    if (mod) out.dateModified = normaliseDate(mod);
  }

  out.siteName = metaContent(html, [
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']application-name["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']citation_journal_title["'][^>]+content=["']([^"']+)["']/i,
  ]);

  return out;
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

function titleFromPath(url) {
  try {
    const u = new URL(url);
    const segs = u.pathname.split('/').filter(Boolean);
    let last = segs[segs.length - 1] || u.hostname;
    last = last.replace(/\.(html?|php|aspx?|pdf|json|csv)$/i, '');
    last = decodeURIComponent(last).replace(/[-_+]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!last || /^\d+$/.test(last)) {
      last = segs.slice(-2).join(' ').replace(/[-_+]/g, ' ').trim() || u.hostname;
    }
    return last.charAt(0).toUpperCase() + last.slice(1);
  } catch {
    return url;
  }
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

  await pool(urls, CONCURRENCY, async (url) => {
    const cached = readCache(url);
    const cacheOk = cached && cached.status >= 200 && cached.status < 400 && cached.extracted;
    if (cacheOk && !refetch) return;
    if (cached && !refetch && cached.status !== 0) return; // keep recorded failure
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
      try {
        if (res.isPdf) {
          record.extracted = { kind: 'pdf', ...extractFromPdf(res.body) };
        } else {
          const html = res.body.toString('utf8');
          record.extracted = { kind: 'html', ...extractFromHtml(html) };
        }
      } catch (e) {
        record.extractError = String(e.message || e);
      }
    }
    writeCache(url, record);
  });

  // ------------------------------------------------------------ assemble
  const overrides = MANUAL;

  const bib = {};
  const stats = { total: urls.length, verified: 0, dated: 0, unverified: 0, overridden: 0 };

  for (const url of urls) {
    const ov = overrides[url];
    const rec = readCache(url);
    const ex = rec && rec.extracted;
    let title = null;
    let date = null;
    let unverified = false;

    if (ex) {
      if (ex.kind === 'pdf') {
        title = ex.title || (ex.firstLine ? cleanTitle(ex.firstLine.slice(0, 140)) : null);
      } else {
        title = ex.title;
      }
      date = ex.date || null;
    }
    if (!title || title.length < 3 || /^(access denied|just a moment|error|forbidden|404|page not found|attention required)/i.test(title)) {
      title = titleFromPath(url);
      unverified = true;
    }

    const entry = {
      title,
      publisher: guessPublisher(url, ex),
      date: date || null,
      type: guessType(url, rec),
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
const PUBLISHERS = {};

// ----------------------------------------------------------- hand-checked
// URL -> fields that override whatever the fetcher produced. Every entry here
// was read by a person (page, filing index, Federal Register API or PDF).
const MANUAL = {};
