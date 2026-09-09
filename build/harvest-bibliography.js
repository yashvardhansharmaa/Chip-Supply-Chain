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
  'npc.com.tw': 'Nan Ya PCB',
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
// URL -> fields that override whatever the fetcher produced. Every entry here
// was read by a person (page, filing index, Federal Register API or PDF).
const MANUAL = {};
