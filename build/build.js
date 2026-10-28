#!/usr/bin/env node
/* CHOKEPOINTS build: content/*.md + data/*.json + specimens/*.js + src/* -> dist/index.html (the home page and the views), each
   chapter's own page dist/<id>/index.html, the print-only book dist/book/, and the shared files in dist/assets/ (the pages, below) */
const fs = require('fs');
const path = require('path');
const SITE = require('./site.js'); // the public address; see build/site.js
const STAGES = require('./stages.js'); // which chapters are stages of the chain (all but the two that look across it)
const RETIRED = require('./retired-chapters.js'); // the addresses of a chapter merged away, and where each now lands
const keepRanges = require('./keep-ranges.js'); // a figure range never breaks at its hyphen
// the work a citation names, and the token a cite line's day goes in as (filled once every page's date is known, below);
// up here because the figures' citations (figure()) are drawn while the chapters are read
const CITE_WORK = 'Chip Supply Chain: How AI Chips Are Made';
const CITE_DAY = (id) => `{{CITE_DAY:${id}}}`;
// the key at the head of a chapter's Sources: what the A and B beside each source mean, led by its own label
const SOURCE_KEY = `<p class="src-key"><span class="src-key-k">Source tiers</span> <span class="tier tier-A">A</span> company filings, governments, standards bodies, universities and research institutions. <span class="tier tier-B">B</span> SemiAnalysis, Reuters, the Financial Times and Nikkei Asia.</p>`;

const root = path.resolve(__dirname, '..');
const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
const readJSON = (p, fallback) => { const s = read(p); if (!s) return fallback; try { return JSON.parse(s); } catch (e) { warn(`bad JSON in ${path.basename(p)}: ${e.message}`); return fallback; } };
const warnings = [];
const warn = (m) => { warnings.push(m); console.warn('warn: ' + m); };
// broken content stops the build here, before anything is written: bad or cut-off JSON, a chapter missing a field, a band
// outside its four words, a figure marker with no figure or a figure with no data (build/validate.js names the file and field)
{
  const problems = require('./validate.js')(root);
  if (problems.length) { console.error(`build failed: ${problems.length} content problem${problems.length === 1 ? '' : 's'}, nothing was written`); problems.forEach((p) => console.error('  ' + p)); process.exit(1); }
}
// failures found later (a build module that throws) are collected here; the build finishes its report, then exits 1
const fatal = [];
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// a URL from a data file may only be http(s), mailto, a fragment or a site-relative path; anything else becomes a dead fragment
const safeUrl = (u) => { const v = String(u == null ? '' : u).trim(); return /^(https?:|mailto:|#|\/)/i.test(v) ? esc(v) : '#'; };
const slug = (s) => String(s).toLowerCase().replace(/[’'"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', TW: 'Taiwan', KR: 'South Korea', CN: 'China', DE: 'Germany', CH: 'Switzerland', GB: 'United Kingdom', FR: 'France', IL: 'Israel', SG: 'Singapore', MY: 'Malaysia', AT: 'Austria', IT: 'Italy', BE: 'Belgium', IN: 'India', AE: 'UAE', SA: 'Saudi Arabia', CA: 'Canada', SE: 'Sweden', FI: 'Finland', IE: 'Ireland', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', MX: 'Mexico', 'EU-other': 'Other Europe', Other: 'Other' };
const COUNTRY_COLOR = { US: 1, NL: 2, TW: 3, JP: 4, KR: 5, CN: 6, DE: 7, 'EU-other': 8, Other: 8, 'United States': 1, Netherlands: 2, Taiwan: 3, Japan: 4, 'South Korea': 5, Korea: 5, China: 6, Germany: 7, Europe: 8, 'Other Europe': 8, Other: 8, 'Rest of world': 8, 'Others': 8 };

/* ---------------- source tiers ---------------- */
const tiersRaw = readJSON(path.join(root, 'data', 'source-tiers.json'), {});
const tierOf = (url) => { const h = host(url); for (const t of ['A', 'B', 'C', 'D']) { if ((tiersRaw[t] || []).some((d) => h === d || h.endsWith('.' + d))) return t; } return '?'; };
const TIER_LABEL = { A: 'Primary or institutional', B: 'SemiAnalysis, Reuters, the Financial Times or Nikkei Asia', C: 'Not cited under the current policy', D: 'Not cited under the current policy', '?': 'Unclassified' };
const tierTag = (url) => { const t = tierOf(url); return `<span class="tier tier-${t}" title="${TIER_LABEL[t]}">${t}</span>`; };
const tierCounts = (cites) => { const c = { A: 0, B: 0, C: 0, D: 0, '?': 0 }; cites.forEach((x) => { c[tierOf(x.url)]++; }); return c; };

/* ---------------- bibliography: url -> { title, publisher, date, type, accessed } ---------------- */
const bibliography = readJSON(path.join(root, 'data', 'bibliography.json'), {});
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// A citation into a long PDF carries its page as a fragment, #page=N (qa/round2/SCHEMA.md §2). The entry is the document's,
// so a url is looked up as written first (one entry keys a #section of its own), then without its fragment.
const bibOf = (url) => { const u = String(url).replace(/&amp;/g, '&'); return bibliography[url] || bibliography[u] || bibliography[u.replace(/#.*$/, '')] || null; };
// the page a citation points at: the N of #page=N when it is a positive integer, else ''
const pageOf = (url) => { const m = String(url).match(/#(?:[^#]*&)?page=([^&#]*)/); return m && /^[1-9]\d*$/.test(m[1]) ? m[1] : ''; };
const bibDate = (d) => {
  const p = String(d || '').split('-');
  if (p.length === 3) return `${+p[2]} ${MONTHS[+p[1] - 1] || p[1]} ${p[0]}`;
  if (p.length === 2) return `${MONTHS[+p[1] - 1] || p[1]} ${p[0]}`;
  return p[0] || '';
};
// what sits in the date's place: the date the source carries, or, when it shows none, the day it was read
const bibWhen = (b) => (b && b.date ? bibDate(b.date) : b && b.accessed ? 'Accessed ' + bibDate(b.accessed) : '');
const bibLabel = (url) => { const b = bibOf(url); return b && b.title ? b.title : ''; };
// One citation as a reference line: the title, then publisher, date and page in small type. A url with no entry stays a url.
function sourceLine(url) {
  const b = bibOf(url), pg = pageOf(url);
  const label = b && b.title ? b.title : (url.length > 96 ? url.slice(0, 94) + '…' : url);
  const meta = (b ? [b.publisher, bibWhen(b)] : [host(url)]).concat(pg ? ['p. ' + pg] : []).filter(Boolean).join(' · ');
  return `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>${meta ? `<span class="src-meta">${esc(meta)}</span>` : ''}`;
}

/* ---------------- front matter ---------------- */
function parseChapter(src, file) {
  const m = src.match(/^---json\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) { warn(`${file}: no ---json front matter`); return { meta: {}, body: src }; }
  let meta = {};
  try { meta = JSON.parse(m[1]); } catch (e) { warn(`${file}: front matter JSON error: ${e.message}`); }
  return { meta, body: src.slice(m[0].length) };
}

/* ---------------- inline markdown ---------------- */
function inline(text, ctx) {
  let s = esc(text);
  // code spans
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  // citations: ([source](url)) or [source](url); the space before one goes too, so the mark sits on its word and a line
  // never breaks between them (the readable pages already set it so, plainCites in build/modules/social.js)
  s = s.replace(/\s*\(\s*\[(?:source|Source|src)\]\((https?:[^)\s]+)\)\s*\)/g, (_, url) => cite(url, ctx));
  s = s.replace(/\s*\[(?:source|Source|src)\]\((https?:[^)\s]+)\)/g, (_, url) => cite(url, ctx));
  // links
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, (_, t, url) => `<a href="${url}" target="_blank" rel="noopener">${t}</a>`);
  // internal anchors [text](#id)
  s = s.replace(/\[([^\]]+)\]\(#([^)\s]+)\)/g, (_, t, id) => `<a href="#${id}">${t}</a>`);
  // bold / italic, with every tag made so far held aside: a URL's underscore must never open an italic
  const held = [];
  s = s.replace(/<[^>]+>/g, (m) => { held.push(m); return '\u0001' + (held.length - 1) + '\u0001'; });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/\u0001(\d+)\u0001/g, (_, i) => held[+i]);
  // leftover google-docs heading anchors
  s = s.replace(/\s*\{#[^}]*\}/g, '');
  return s;
}
function cite(url, ctx) {
  url = url.replace(/&amp;/g, '&');
  let i = ctx.cites.findIndex((c) => c.url === url);
  if (i < 0) { ctx.cites.push({ url }); i = ctx.cites.length - 1; }
  // the same document at two pages is two sources (two urls); data-pg carries the page to the popover and the printed note
  const b = bibOf(url) || {}, tier = tierOf(url), when = bibWhen(b), pg = pageOf(url);
  const label = [b.title || host(url), b.publisher, when, pg ? 'p. ' + pg : ''].filter(Boolean).join(' · ');
  return `<sup class="cite"><a href="${esc(url)}" target="_blank" rel="noopener" data-t="${esc(b.title || '')}" data-p="${esc(b.publisher || '')}" data-d="${esc(when)}"${pg ? ` data-pg="${pg}"` : ''} data-tier="${esc(tier)}" aria-label="Source ${i + 1}: ${esc(label)}">${i + 1}</a></sup>`;
}
// an archived page (web.archive.org/web/<stamp>/<original>) is rated and labelled by its original publisher
function host(url) { try { const m = String(url).match(/^https?:\/\/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/); return new URL(m ? m[1] : url).hostname.replace(/^www\./, ''); } catch (e) { return url; } }

/* ---------------- figures ---------------- */
function fmtNum(v) { if (typeof v !== 'number') return esc(v); return Math.abs(v) >= 1000 ? v.toLocaleString('en-US') : (Number.isInteger(v) ? String(v) : v.toFixed(1)); }
const USED_MEDIA = new Set(); // animations placed in a chapter; only their files are copied to dist/media
/* A figure's unit (decision 11, 21 Oct 2026). A unit of eight characters or fewer travels with every value, and the tag after
   the title goes: "%" gives 56.8%, a currency unit puts its sign before the figure and the rest after it ($60M, $2,900,
   $1,187/kg), and a word follows the figure (48 tools, 1,200 GB/s). A longer unit ("million 8-inch-equivalent wafers per
   month") stays a tag after the title and the values stand bare. */
const unitOnValue = (u) => !!u && String(u).length <= 8;
function withUnit(v, unit) {
  const n = fmtNum(v), u = String(unit || '');
  if (!unitOnValue(u)) return n;
  if (u === '%') return n + '%';
  const sign = u.match(/^[$€£¥]/);
  if (sign) return sign[0] + n + esc(u.slice(1));
  return n + '\u00a0' + esc(u); // a no-break space: the figure and its unit never part
}
/* The chart rule (the owner's of 21 Oct 2026, "garnet on the largest only", brought back in the visual pass of 27 Oct over the
   redesign's rule B of 25 Oct, which drew it in ink), as the owner amended it on 28 Oct 2026 (design round nine's page review,
   revisions 4 and 5). Wine marks the one value that matters:
   - the largest value, by default;
   - the value the chart's title names, where the title names one (the figure's "mark": a row's label, or a range's);
   - the largest change, for change charts.
   The rest take the site's tint, --ctx, with their values in ink-2. A remainder ("Other", "All others", "… and all others")
   is hatched, and is never marked. Ranges are drawn as ranges: a solid bar to the low end and a hatched span to the high end
   inside a 1.5 px outline (figMarks below). A stack (shares of one whole) is drawn as bars, one per share in the data's order,
   as the hybrid mockup draws them, so each share keeps its label and no legend is needed. figure() applies the rule; app.js
   Figs and the PNG (FIG_JS) read the marks it drew. */
const STACK_REST = /^(other|others|all others|everyone else|rest of world|.* and all others|.*other companies)$/i;
// a unit that moves onto the values leaves the title, and so does any copy of it the title spells out ("2022 ($M)", "price in Europe ($/kg)", decision 11)
const figTitle = (f) => (unitOnValue(f.unit) ? String(f.title || '').split(` (${f.unit})`).join('') : String(f.title || ''));
// the figure's short name in the chapter's contents rail: its title's first sentence
const figShort = (f) => figTitle(f).split(/(?<=[a-z0-9)%])\.\s+(?=[A-Z])/)[0].replace(/\.$/, '');
// the figure's data as a CSV file, a data: link the browser saves without any script (the readable pages carry it too)
// The table comes first, so a spreadsheet reads its header row as one; under it, after a blank row, what the file is: the
// figure, its title, its source and the source's date, any note (an estimate says so there) and the figure's address
// (28 Oct 2026). A first column of years is headed Year.
function figCSV(f, data, meta) {
  const q = (v) => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const years = data.length && data.every((d) => /^(FY ?)?\d{4}$/.test(String(d[0]).trim()));
  const head = f.type === 'timeline' ? ['Date', 'Event'] : [years ? 'Year' : 'Item', f.unit ? `Value (${f.unit})` : 'Value'];
  // a row with its own range (["High-NA EUV", 350, 400]) gives its high end in a third column
  const hasHi = f.type !== 'timeline' && data.some((d) => typeof d[2] === 'number');
  if (hasHi) head.push(f.unit ? `High end of range (${f.unit})` : 'High end of range');
  const rows = [head].concat(data.map((d) => (hasHi ? [d[0], d[1], typeof d[2] === 'number' ? d[2] : ''] : [d[0], d[1]])));
  const m = meta || {};
  const about = [['Figure', m.num ? `Figure ${m.num}` : ''], ['Title', figShort(f)], ['Source', m.source || ''], ['Source date', m.when || ''], ['Source address', m.url || ''], ['Note', f.note || ''], ['Figure address', m.page || '']].filter((r) => r[1]);
  const all = about.length ? rows.concat([[]], about) : rows;
  return 'data:text/csv;charset=utf-8,' + encodeURIComponent('﻿' + all.map((r) => r.map(q).join(',')).join('\r\n') + '\r\n');
}
/* The marks a bars or columns figure draws, in the data's order (the owner's chart rule as amended on 28 Oct 2026, above).
   A row is ["label", value], or ["label", low, high] for a value known only as a range (04.2's "$350–400M"). A figure's
   "range" joins rows that are the cases of one estimate into one mark ({ label, low, high, ref, refLabel }, each naming a
   row: 14.4's 2030 low, reference and high cases), drawn where its first row stood; the rows stay as they are in the Table
   and the CSV. Each mark is { label, v (its value or low end), hi (high end or null), ref (a reference value inside the
   range, or null), span (true for a joined range: the span, not the bar under it, is what the title names), rest, top }.
   top is the figure's "mark" when it names a mark, else the largest (by its high end) that is not a remainder (ties mark each). */
function figMarks(f, data) {
  const rg = f.range && typeof f.range === 'object' ? f.range : null;
  const row = (lab) => data.find((d) => String(d[0]) === String(lab));
  const joined = rg ? [rg.low, rg.high, rg.ref].filter(Boolean).map(String) : [];
  if (rg && (!row(rg.low) || !row(rg.high) || (rg.ref && !row(rg.ref)))) { warn(`figure ${f.id}: its range names a row it does not have`); return figMarks({ ...f, range: null }, data); }
  const marks = []; let placed = false;
  data.forEach((d) => {
    if (joined.includes(String(d[0]))) {
      if (placed) return; placed = true;
      marks.push({ label: rg.label, v: +row(rg.low)[1], hi: +row(rg.high)[1], ref: rg.ref ? +row(rg.ref)[1] : null, refLabel: rg.refLabel || '', span: true, rest: false });
      return;
    }
    marks.push({ label: String(d[0]), v: +d[1] || 0, hi: typeof d[2] === 'number' ? d[2] : null, ref: null, refLabel: '', span: false, rest: STACK_REST.test(String(d[0]).trim()) });
  });
  const named = f.mark != null ? marks.findIndex((m) => m.label === String(f.mark)) : -1;
  if (f.mark != null && named < 0) warn(`figure ${f.id}: its mark "${f.mark}" names no row`);
  const top = Math.max(...marks.filter((m) => !m.rest).map((m) => (m.hi != null ? m.hi : m.v)), -Infinity);
  marks.forEach((m, i) => { m.top = named >= 0 ? i === named : !m.rest && (m.hi != null ? m.hi : m.v) === top; });
  return marks;
}
// a value known as a range, or a change from one value to another: "$350–400M" with a currency unit, otherwise "521 to 843 TWh"
// and "44.4 to 34.1%" (the unit once, at the end, as decision 11 writes a single value)
function spanText(a, b, unit, dash) {
  const u = String(unit || '');
  if (!unitOnValue(u)) return `${fmtNum(a)} to ${fmtNum(b)}`;
  const sign = u.match(/^[$€£¥]/);
  if (sign && dash) return sign[0] + fmtNum(a) + '\u2013' + fmtNum(b) + esc(u.slice(1));
  if (sign) return withUnit(a, u) + ' to ' + withUnit(b, u);
  return fmtNum(a) + ' to ' + withUnit(b, u);
}
const markText = (m, unit) => (m.hi != null ? spanText(m.v, m.hi, unit, !m.span) : withUnit(m.v, unit));
/* One grammar for every figure (the hybrid's): a head with the figure's number ("Figure 04.5"), a link to the figure's own
   address, a large line and, when the figure has a finding, the title under it; then the chart; then one quiet source line,
   as the live site sets it (the visual pass of 27 Oct 2026): "Source:", the linked title and its footnote number, and the
   actions as small text links, Cite (a citation that opens in place, as the chapter's does, with the figure's full address),
   Table and PNG (added by the runtime, src/app.js Figs, and by the readable pages' script) and CSV (a plain download); any
   note is one more quiet line. The typed address line under the source was dropped in that pass: the number links to the
   address and Cite gives it in full. A figure without a finding shows its title as the large line and nothing under it. */
function figure(f, ctx) {
  if (!f) return '';
  ctx.figNo = (ctx.figNo || 0) + 1;
  const num = `${String(ctx.number || 0).padStart(2, "0")}.${ctx.figNo}`, fid = `fig-${ctx.id}-${f.id}`;
  const shortUnit = unitOnValue(f.unit);
  const unitTag = f.unit && !shortUnit ? `<span class="unit">${esc(f.unit)}</span>` : '';
  const finding = String(f.finding || '').trim();
  const isAnim = f.type === 'animation';
  (ctx.figList = ctx.figList || []).push({ id: fid, num, label: isAnim ? figTitle(f) : figShort(f) });
  // the source's footnote number is the chapter's own (the figure registers its source as it always has)
  const srcMark = f.source && f.source.url ? cite(f.source.url, ctx) : '';
  const data = Array.isArray(f.data) ? f.data.filter((d) => Array.isArray(d) && d.length >= 2) : [];
  let body = '', kick = `Figure ${num}`;
  if (f.type === 'bars' || f.type === 'stack') {
    // HTML rows, so a label is never cut and wraps at a readable size on a phone: the label beside its bar from 641 px up
    // (its column as wide as the longest label, at most 45 percent), above it below that. --lw and --vw size the label column
    // and the room for the value. The marked value is wine (.top, the chart rule above), a remainder is hatched, and a range
    // (.range) is solid to its low end (--lo, a share of the bar) and hatched to its high end.
    const marks = figMarks(f, data);
    const max = Math.max(...marks.map((m) => (m.hi != null ? m.hi : m.v)), 1e-9);
    const vals = marks.map((m) => markText(m, f.unit));
    const lw = Math.max(...marks.map((m) => m.label.length)), vw = Math.max(...vals.map((v) => v.replace(/&[a-z]+;/g, '&').length));
    body = `<div class="hbars" aria-hidden="true" style="--lw:${(lw * 0.56 + 0.4).toFixed(1)}em;--vw:${(vw * 0.62 + 0.9).toFixed(1)}em">`
      + marks.map((m, i) => {
        const hi = m.hi != null ? m.hi : m.v, cls = (m.rest ? ' rest' : m.top ? ' top' : '') + (m.hi != null ? ' range' : '') + (m.span ? ' span' : '');
        const lo = m.hi != null ? `;--lo:${(m.v / hi * 100).toFixed(1)}%` : '';
        const ref = m.ref != null ? `<span class="hb-ref" style="left:${(m.ref / hi * 100).toFixed(1)}%"><span>${esc(m.refLabel)} ${fmtNum(m.ref)}</span></span>` : '';
        return `<div class="hb${cls}" data-v="${m.v}"${m.hi != null ? ` data-hi="${m.hi}"` : ''}${m.ref != null ? ` data-ref="${m.ref}"` : ''}><span class="hb-l">${esc(m.label)}</span><span class="hb-r"><i style="width:${Math.max(0.6, hi / max * 100).toFixed(1)}%${lo}">${ref}</i><b>${vals[i]}</b></span></div>`;
      }).join('')
      + `</div>` + tableFallback(data, f);
  } else if (f.type === 'columns') {
    // a series over time or generations (revision 5, 28 Oct 2026): columns in the data's order, years left to right, on an ink
    // baseline, each value over its column and each label under it; the marked column wine (the chart rule above). A range is
    // a column solid to its low end and hatched to its high end, its reference value an ink tick named beside it.
    const marks = figMarks(f, data);
    const max = Math.max(...marks.map((m) => (m.hi != null ? m.hi : m.v)), 1e-9);
    body = `<div class="cols" aria-hidden="true" style="--n:${marks.length}"><div class="cols-plot">`
      + marks.map((m) => {
        const hi = m.hi != null ? m.hi : m.v, cls = (m.rest ? ' rest' : m.top ? ' top' : '') + (m.hi != null ? ' range' : '') + (m.span ? ' span' : '');
        const lo = m.hi != null ? `;--lo:${(m.v / hi * 100).toFixed(1)}%` : '';
        const ref = m.ref != null ? `<span class="col-ref" style="bottom:${(m.ref / hi * 100).toFixed(1)}%"><span>${esc(m.refLabel)} ${fmtNum(m.ref)}</span></span>` : '';
        return `<div class="col${cls}" data-v="${m.v}"${m.hi != null ? ` data-hi="${m.hi}"` : ''}${m.ref != null ? ` data-ref="${m.ref}"` : ''}><b>${markText(m, f.unit)}</b><i style="--h:${Math.max(0.004, hi / max).toFixed(3)}${lo}">${ref}</i></div>`;
      }).join('')
      + `</div><div class="cols-lab">` + marks.map((m) => `<span${m.top ? ' class="top"' : ''}>${esc(m.label)}</span>`).join('') + `</div></div>` + tableFallback(data, f);
  } else if (f.type === 'change') {
    // a change, before and after (revision 5, 28 Oct 2026): one row per subject, the data's rows taken in pairs ("ASML,
    // FY2024" then "ASML, FY2025"). An open circle marks the earlier value and an arrow runs to the later one, on one axis
    // with hairline ticks; the figure's "ends" ("peak", "latest") name the two marks once, on the first row; the change is
    // written at the right. Wine goes on the largest change (the chart rule above), or on the figure's "mark".
    const pairs = [];
    for (let i = 0; i + 1 < data.length; i += 2) {
      const a = String(data[i][0]).match(/^(.*?),\s*(.+)$/) || [null, String(data[i][0]), ''], b = String(data[i + 1][0]).match(/^(.*?),\s*(.+)$/) || [null, String(data[i + 1][0]), ''];
      if (a[1] !== b[1]) warn(`figure ${f.id}: rows "${data[i][0]}" and "${data[i + 1][0]}" are not one subject's pair`);
      pairs.push({ name: a[1], when: a[2] && b[2] ? `${a[2]} to ${b[2]}` : '', a: +data[i][1], b: +data[i + 1][1] });
    }
    if (data.length % 2) warn(`figure ${f.id}: a change figure needs its rows in pairs`);
    const named = f.mark != null ? pairs.findIndex((p) => p.name === String(f.mark)) : -1;
    const most = Math.max(...pairs.map((p) => Math.abs(p.b - p.a)));
    pairs.forEach((p, i) => { p.top = named >= 0 ? i === named : Math.abs(p.b - p.a) === most; });
    const vs = pairs.flatMap((p) => [p.a, p.b]), step = f.step || 10;
    const lo = Math.floor(Math.min(...vs) / step) * step, hi = Math.ceil(Math.max(...vs) / step) * step;
    const x = (v) => ((v - lo) / (hi - lo || 1) * 100).toFixed(2) + '%';
    const ticks = []; for (let t = lo; t <= hi + 1e-9; t += step) ticks.push(t);
    const tickHTML = ticks.map((t) => `<i class="cg-tick" style="left:${x(t)}"></i>`).join('');
    const ends = Array.isArray(f.ends) ? f.ends : [];
    const vals = pairs.map((p) => spanText(p.a, p.b, f.unit));
    const lw = Math.max(...pairs.map((p) => Math.max(p.name.length, p.when.length * 0.86))), vw = Math.max(...vals.map((v) => v.replace(/&[a-z]+;/g, '&').length));
    body = `<div class="cg" aria-hidden="true" style="--lw:${(lw * 0.58 + 0.6).toFixed(1)}em;--vw:${(vw * 0.62 + 1).toFixed(1)}em">`
      + `<div class="cg-row cg-axis"><span class="cg-l"></span><span class="cg-t">${ticks.map((t) => `<span style="left:${x(t)}">${withUnit(t, f.unit)}</span>`).join('')}</span><span class="cg-v"></span></div>`
      + pairs.map((p, i) => {
        const l = Math.min(p.a, p.b), dir = p.b < p.a ? 'down' : 'up';
        const endsHTML = i === 0 && ends.length === 2 ? `<span class="cg-end" style="left:${x(p.a)}">${esc(ends[0])}</span><span class="cg-end" style="left:${x(p.b)}">${esc(ends[1])}</span>` : '';
        return `<div class="cg-row${p.top ? ' top' : ''}${endsHTML ? ' has-ends' : ''}" data-a="${p.a}" data-b="${p.b}" data-lo="${lo}" data-hi="${hi}"><span class="cg-l"><b>${esc(p.name)}</b>${p.when ? `<small>${esc(p.when)}</small>` : ''}</span>`
          + `<span class="cg-t">${tickHTML}${endsHTML}<span class="cg-arrow" data-dir="${dir}" style="left:${x(l)};width:${(Math.abs(p.b - p.a) / (hi - lo || 1) * 100).toFixed(2)}%"></span><span class="cg-from" style="left:${x(p.a)}"></span></span>`
          + `<b class="cg-v">${vals[i]}</b></div>`;
      }).join('')
      + `</div>` + tableFallback(data, f);
  } else if (isAnim) {
    // an explainer animation rendered by build/animate.py: the step names and captions are page text, kept in time
    // with the video by app.js; the transcript is read by screen readers and printed in place of the video
    const meta = readJSON(path.join(root, 'media', f.src + '.json'), null);
    if (!meta || !Array.isArray(meta.steps)) { warn(`${ctx.id}: animation ${f.src} has not been rendered (run build/animate.py ${f.src})`); return ''; }
    USED_MEDIA.add(f.src);
    const m = `media/${esc(f.src)}`, steps = meta.steps;
    if (meta.duration) kick += ` · Explainer, ${Math.round(meta.duration)} seconds`;
    // the Paused mark sits at the end of the step row, outside the frame, so it never covers a label drawn in the video (28 Oct 2026)
    body = `<div class="anim-bar"><ol class="anim-steps">${steps.map((st, i) => `<li><button type="button" data-t="${+st.t0}"${i ? '' : ' aria-current="step"'}><span class="n">${String(i + 1).padStart(2, "0")}</span>${esc(st.k)}</button></li>`).join('')}</ol><span class="anim-state" aria-hidden="true">Paused</span></div>`
      + `<div class="anim-stage" role="button" tabindex="0" aria-label="Pause the animation" style="aspect-ratio:${meta.width}/${meta.height}">`
      + `<video muted loop playsinline preload="none" aria-hidden="true" data-src="${m}"></video>` // no poster attribute: app.js sets it (theme-matched) once the figure nears the screen, and for print
      + `<img class="anim-print" src="${m}-print-end.jpg" alt="" loading="lazy"></div>`
      + `<p class="anim-cap" aria-hidden="true">${esc(steps[0].cap)}</p>`
      + `<ol class="anim-transcript">${steps.map((st) => `<li><b>${esc(st.k)}.</b> ${esc(st.cap)}</li>`).join('')}</ol>`;
  } else if (f.type === 'timeline') {
    // a row's date is a day (2019-05-16), a month (2028-03) or a bare year (2028), written as the source gave it; a year sits
    // at the start of that year and is labelled with the year alone. Rows are put in date order (ties keep their order).
    const dated = data.map((d, k) => ({ d, k, t: figDate(d[0]) }));
    if (dated.every((r) => r.t)) dated.sort((a, b) => a.t.key.localeCompare(b.t.key) || a.k - b.k);
    body = `<ol class="tl">` + dated.map((r) => `<li><span class="d">${r.t ? `<time datetime="${esc(r.t.iso)}">${esc(r.t.label)}</time>` : esc(r.d[0])}</span>${esc(r.d[1])}</li>`).join('') + `</ol>`;
  } else {
    warn(`${ctx.id}: unknown figure type ${f.type}`);
    return '';
  }
  // the large line is the finding when the figure has one, with the title under it; without one, the title's first sentence,
  // with any sentences after it under it ("What one lithography system costs" over "The DUV bar is one figure …")
  const tt = figTitle(f), first = figShort(f), rest = tt.length > first.length ? tt.slice(first.length).replace(/^\.\s*/, '').trim() : '';
  const [big, small] = finding ? [finding, tt] : rest ? [first, /[.!?)]$/.test(rest) ? rest : rest + '.'] : [tt, ''];
  const head = `<div class="fig-head"><a class="fig-k" href="#${fid}">${esc(kick)}</a>`
    + `<p class="fig-title${finding ? ' fig-find' : ''}">${esc(big)}${small ? '' : unitTag}</p>${small ? `<p class="fig-sub">${esc(small)}${unitTag}</p>` : ''}</div>`;
  // the source line: Source (or a note) first, then the actions
  const src = f.source && f.source.url ? `<span class="fs-src"><span class="fs-k">Source:</span> <a href="${safeUrl(f.source.url)}" target="_blank" rel="noopener">${esc(f.source.label || host(f.source.url))}</a> ${srcMark}</span>`
    : (f.source && f.source.label ? `<span class="fs-src"><span class="fs-k">Source:</span> ${esc(f.source.label)}</span>` : '');
  const note = f.note ? `<span class="fs-note fig-source"><span class="fs-k">Note:</span> ${esc(f.note)}</span>` : '';
  const box = `cite-${fid}`;
  // the figure's source by name and date, for the citation's Data line and the CSV (28 Oct 2026): the bibliography's date, or none
  const srcB = f.source && f.source.url ? bibOf(f.source.url) : null;
  const srcName = f.source ? String(f.source.label || (f.source.url ? host(f.source.url) : '')) : '';
  // (a label that already gives a day, or names more than one source, keeps its own words: one date would be wrong for it)
  const srcWhen = srcB && srcB.date && !/\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}|;/.test(srcName) ? bibDate(srcB.date) : '';
  const figURL = SITE.url + ctx.id + '/#' + fid;
  const csv = data.length && !isAnim ? `<a class="fs-csv" href="${figCSV(f, data, { num, source: srcName, when: srcWhen, url: f.source && f.source.url ? String(f.source.url) : '', page: figURL })}" download="chip-supply-chain-figure-${num.replace('.', '-')}-${esc(f.id)}.csv">CSV</a>` : '';
  // an explainer animation has no Cite (owner, 27 Oct): it explains a process and holds no figures of its own to cite
  const acts = isAnim ? '' : `<span class="fs-acts" data-kind="${esc(f.type)}"><button type="button" class="ch-cite-btn" aria-expanded="false" aria-controls="${box}">Cite</button>${csv}</span>`;
  // the citation names the figure by its title's first sentence (the sentences after it, and the note, are not its title) and
  // ends on the data it shows: "Data: <source>, <date>." (28 Oct 2026)
  const dataLine = srcName ? ` Data: ${esc(srcName)}${srcWhen ? ', ' + esc(srcWhen) : ''}.` : '';
  const citeText = isAnim ? '' : `<div class="ch-cite-box fig-cite-box" id="${box}" role="region" aria-label="Citation for figure ${num}" hidden><p class="ch-cite-text">Sharma, Yashvardhan. “Figure ${num}: ${esc(figShort(f))}.” <i>${CITE_WORK}</i>. Updated ${CITE_DAY(ctx.id)}. <a href="${esc(figURL)}">${esc(figURL)}</a>.${dataLine}</p></div>`;
  const strip = `<div class="fig-strip">${src}${acts}${note}${citeText}</div>`;
  return `<figure class="figure${isAnim ? ' figure--anim' : ''}" id="${fid}" data-num="${num}">${head}<div class="fig-body">${body}</div>${strip}</figure>`;
}
// A date in a figure: { key, the day it sorts as; iso, for <time datetime>; label, what the reader sees }. A full day keeps the
// form the data gives; a month reads "March 2028"; a bare year reads "2028" and sorts as 1 January. Anything else is not a date.
function figDate(s) {
  const v = String(s == null ? '' : s).trim();
  const m = v.match(/^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  if (!m || (m[2] && (+m[2] < 1 || +m[2] > 12)) || (m[3] && (+m[3] < 1 || +m[3] > 31))) return null;
  return { key: `${m[1]}-${m[2] || '01'}-${m[3] || '01'}`, iso: v, label: m[3] ? v : m[2] ? `${MONTHS[+m[2] - 1]} ${m[1]}` : m[1] };
}
function tableFallback(data, f) {
  return `<table class="sr-only fig-table"><caption>${esc(figTitle(f))}</caption><tbody>${data.map((d) => `<tr><th scope="row">${esc(d[0])}</th><td>${typeof d[2] === 'number' ? spanText(d[1], d[2], f.unit, true) + (unitOnValue(f.unit) || !f.unit ? '' : ' ' + esc(f.unit)) : unitOnValue(f.unit) ? withUnit(d[1], f.unit) : fmtNum(d[1]) + (f.unit ? ' ' + esc(f.unit) : '')}</td></tr>`).join('')}</tbody></table>`;
}

/* ---------------- block markdown ---------------- */
// a table cell that is a figure: an amount, a share or a range, with an optional sign, unit and bracketed note ("$2,900",
// "86.8%", "$2,800-3,100", "~$6,400", "about 40 percent" is prose and does not count)
const TABLE_FIGURE = /^[~≈<>+\-−]?\s?(about\s)?[$€£¥]?\s?\d[\d.,]*(\s?(%|bn|billion|million|M|B|k|x|×|nm|mm|W|kW|MW|GW|TWh|GB|TB\/s|GB\/s|mm2|mm²|pp))?(\s?[-–]\s?[$€£¥]?\d[\d.,]*(\s?(%|bn|M|B|k|x|nm|mm|W|GB))?)?\s*(\(.*\))?$/i;
function markdown(src, ctx) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = [];
  const headings = [];
  let i = 0, inTakeaways = false, para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(' '), ctx)}</p>`); para = []; } };
  const closeTakeaways = () => { if (inTakeaways) { out.push('</div>'); inTakeaways = false; } };
  while (i < lines.length) {
    let line = lines[i];
    const t = line.trim();
    if (!t) { flushPara(); i++; continue; }
    // headings
    let hm = t.match(/^(#{1,4})\s+(.*)$/);
    if (hm) {
      flushPara();
      const level = hm[1].length;
      let text = hm[2].replace(/\s*\{#[^}]*\}\s*$/, '').replace(/\*\*/g, '').trim();
      if (level === 1) { i++; continue; } // chapter title comes from front matter
      const id = `${ctx.id}--${slug(text)}`;
      if (level === 2) {
        closeTakeaways();
        if (/^takeaways?$/i.test(text)) { out.push(`<div class="takeaways"><h3 id="${id}">Takeaways</h3>`); inTakeaways = true; i++; continue; }
        headings.push({ id, text });
        // data-k: the section's name in plain words, for its kicker ("05 · The chokepoint", src/modules/chapter.css)
        const kick = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();
        out.push(`<h3 id="${id}" data-k="${esc(kick)}">${inline(text, ctx)}</h3>`);
      } else if (level === 3) out.push(`<h4 id="${id}">${inline(text, ctx)}</h4>`);
      else out.push(`<h5 id="${id}">${inline(text, ctx)}</h5>`);
      i++; continue;
    }
    // figure marker
    let fm = t.match(/^\{\{\s*figure:\s*([\w-]+)\s*\}\}$/);
    if (fm) {
      flushPara();
      const f = (ctx.figures || []).find((x) => x.id === fm[1]);
      if (!f) warn(`${ctx.id}: figure ${fm[1]} not found in front matter`);
      out.push(figure(f, ctx));
      i++; continue;
    }
    // hr
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) { flushPara(); out.push('<hr>'); i++; continue; }
    // table
    if (t.startsWith('|') && i + 1 < lines.length && /^\|?\s*:?-{2,}/.test(lines[i + 1].trim())) {
      flushPara();
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
      const cells = (r) => r.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      // every cell is read in reading order first, so the footnotes number as before; then a column whose filled body cells
      // are at least 60 percent figures (footnote marks aside), or that the Markdown aligns right (---:), is a figure column,
      // class "n": right-aligned on tabular digits, and a number range in its cells takes an en dash, $2,800–3,100 (decision 11)
      const head = cells(rows[0]).map((h) => inline(h, ctx));
      const body = rows.slice(2).map((r) => cells(r).map((c) => inline(c, ctx)));
      const align = cells(rows[1]);
      const plainCell = (h) => h.replace(/<sup class="cite[^"]*">[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, '').replace(/&nbsp;|\u00a0/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
      const isFig = (h) => TABLE_FIGURE.test(plainCell(h));
      const numCol = head.map((_, c) => {
        if (/^-+:$/.test(align[c] || '')) return true;
        if (!c) return false; // the first column names the rows
        const filled = body.map((r) => r[c]).filter((h) => h != null && plainCell(h) !== '');
        return filled.length > 0 && filled.filter(isFig).length / filled.length >= 0.6;
      });
      const dashRanges = (h) => h.split(/(<[^>]+>)/).map((part, k) => (k % 2 ? part : part.replace(/(\d)-(?=[$€£¥]?\d)/g, '$1\u2013'))).join('');
      let html = `<div class="table-wrap" tabindex="0"><table><thead><tr>${head.map((h, c) => `<th${numCol[c] ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>`;
      body.forEach((cs) => { html += `<tr>${cs.map((h, c) => (numCol[c] ? `<td class="n">${dashRanges(h)}</td>` : `<td>${h}</td>`)).join('')}</tr>`; });
      out.push(html + '</tbody></table></div>');
      continue;
    }
    // blockquote
    if (t.startsWith('>')) {
      flushPara();
      const q = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) { q.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
      out.push(`<blockquote><p>${inline(q.join(' '), ctx)}</p></blockquote>`);
      continue;
    }
    // lists
    let lm = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (lm) {
      flushPara();
      const items = [];
      while (i < lines.length) {
        const l = lines[i];
        const mm = l.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
        if (mm) { items.push({ depth: mm[1].replace(/\t/g, '  ').length >= 2 ? 1 : 0, ordered: /\d/.test(mm[2]), text: mm[3] }); i++; }
        else if (l.trim() && /^\s{2,}/.test(l) && items.length) { items[items.length - 1].text += ' ' + l.trim(); i++; }
        else break;
      }
      const tag = items[0].ordered ? 'ol' : 'ul';
      let html = `<${tag}>`, open = false;
      items.forEach((it, k) => {
        if (it.depth === 1) {
          if (!open) { html = html.replace(/<\/li>$/, ''); html += `<${it.ordered ? 'ol' : 'ul'}>`; open = true; }
          html += `<li>${inline(it.text, ctx)}</li>`;
          const next = items[k + 1];
          if (!next || next.depth === 0) { html += `</${it.ordered ? 'ol' : 'ul'}></li>`; open = false; }
        } else {
          html += `<li>${inline(it.text, ctx)}</li>`;
        }
      });
      out.push(html + `</${tag}>`);
      continue;
    }
    para.push(t);
    i++;
  }
  flushPara();
  closeTakeaways();
  return { html: out.join('\n'), headings };
}

function wordCount(body) {
  return body.replace(/\{\{[^}]*\}\}/g, '').replace(/\(\[source\]\([^)]*\)\)/g, '').replace(/https?:\S+/g, '').split(/\s+/).filter((w) => /\w/.test(w)).length;
}

/* ---------------- nameplate ---------------- */
const BANDS = { Extreme: 4, High: 3, Moderate: 2, Low: 1 };
// the band's meter (28 Oct 2026): four rising bars, as many lit as the band's rank, Extreme's in wine (src/modules/chapter.css .meter).
// Hidden from assistive technology: the link's label or the visible word beside it carries the band
const meterHTML = (b) => { const l = BANDS[b] || 0; return `<span class="meter" data-level="${l}" aria-hidden="true">${[1, 2, 3, 4].map((k) => `<b${k <= l ? ' class="on"' : ''}></b>`).join('')}</span>`; };
const SUBS = { 'Very hard': 4, Hard: 3, Moderate: 2, Easy: 1 };
const SUBWORD = { 'Very hard': 'Very hard to substitute', Hard: 'Hard to substitute', Moderate: 'Moderately hard to substitute', Easy: 'Easy to substitute' };
// one sentence per band, shown when a reader hovers the tag on the card (the full definitions stay in the Index)
const BAND_NOTE = { Extreme: 'Three or fewer firms could supply this stage today, or one firm holds more than half of it.', High: 'Four to six firms could supply this stage today, and the top two take most of the revenue.', Moderate: 'Seven or more firms could supply this stage today, none of them dominant.', Low: 'Many firms could supply this stage today, and the scarce input is something another industry sells at volume.' };
const SUB_NOTE = { 'Very hard': 'No second supplier exists at the leading node, and the path to one depends on physics, decades of unwritten know-how or protected intellectual property. No one has yet repeated what the leaders did, and closing the gap takes ten years or more.', Hard: 'No second supplier exists at the leading node. The path to one is known, and closing the gap takes five to ten years.', Moderate: 'A second supplier exists but is not yet qualified at the leading node. Closing the gap takes two to five years.', Easy: 'A qualified second supplier ships today at the leading node.' };
const SPECIMEN_NAME = { 'boule-and-wafer': 'boule and wafer', 'cowos-exploded': 'CoWoS package, exploded', 'die-floorplan': 'die floorplan', 'euv-scanner': 'EUV scanner', foup: 'wafer carrier (FOUP)', 'gaa-transistor': 'gate-all-around transistor', 'gas-cabinet': 'gas cabinet', globe: 'globe', 'gpu-baseboard': 'GPU baseboard', 'hbm-stack': 'HBM stack', package: 'chip package', photomask: 'photomask', 'probe-card': 'probe card', 'process-chamber': 'process chamber', rack: 'server rack', 'sem-column': 'electron microscope column', 'substrate-layers': 'substrate layers', 'wafer-cost': 'wafer cost', wafer: 'wafer' };
/* The card's footnote marks (qa/round2/SCHEMA.md §1). The card's text carries no citations. Beside each text sits a list of
   urls, one per sentence, each one also cited in the chapter's body, so a mark is the chapter's own footnote number and a
   url cited on the card and in the body has one number. The chapter loop numbers sources in the order a reader meets them
   (readingOrderCites): In plain terms and In short, then the card (cardCites), then the body. */
// a sentence ends at . ! or ? followed by a space and a capital, a digit, a currency sign or an opening quote, or at the end
const cardSentences = (t) => String(t || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+(?=[\p{Lu}\p{Nd}\p{Sc}"“‘'])/u).filter(Boolean);
const CARD_STOP = /[.!?]["”’)\]]*$/; // a sentence's closing stop; its mark goes just before it, as the body's marks do
// the card's sourced texts in reading order: the substitutability test, the cost slot, each leader's share, the reason, the
// China line, the US line
function cardFields(card) {
  const sb = card.substitutability && card.substitutability.band ? card.substitutability : {};
  return [['substitutability test', sb.test, sb.testSources], ['costSignal', card.costSignal, card.costSources]]
    .concat((card.leaders || []).map((l) => [`${l.name} share`, l.share, l.source ? [l.source] : []]))
    .concat([['substitutability why', sb.why, sb.whySources], ['chinaStatus', card.chinaStatus, card.chinaSources], ['usStatus', card.usStatus, card.usSources]])
    .map(([what, text, urls]) => ({ what, text: String(text || ''), urls: (Array.isArray(urls) ? urls : []).map((u) => (u ? String(u) : '')) }));
}
// called by the chapter loop before the body is read; warns when a field's url count differs from its sentence count
function cardCites(card, ctx) {
  if (!card) return;
  const off = [];
  let any = false;
  cardFields(card).forEach((f) => {
    const urls = f.urls.filter(Boolean), n = f.text ? cardSentences(f.text).length : 0;
    if (f.urls.length) any = true;
    urls.forEach((u) => cite(u, ctx));
    if (n !== urls.length) off.push(`${f.what} ${n} sentence${n === 1 ? '' : 's'} / ${urls.length} url${urls.length === 1 ? '' : 's'}`);
  });
  if (!any) warn(`${ctx.id}: the card has no source fields (qa/round2/SCHEMA.md §1)`);
  else if (off.length) warn(`${ctx.id}: card url and sentence counts differ: ${off.join(', ')}`);
}
// The chapter is numbered in the order the page shows it (the column, design round five, 27 Oct 2026): In plain terms
// (meta.plain, the first paragraph of How it works), In short (the body's Takeaways section, which splitTakeaways moves to the
// head), the lead (the body's text before its first section), then the chokepoint card, which stands in the text after the
// lead and before section 01 (chapterHTML). Their sources are numbered first, in that order, before markdown() numbers the
// rest of the body as it reads it; a source met again keeps its number, and every mark looks its number up by its url (cite).
function readingOrderCites(meta, body, ctx, hasCard) {
  if (meta.plain) inline(String(meta.plain), ctx);
  const lines = String(body || '').replace(/\r/g, '').split('\n');
  const at = lines.findIndex((l) => /^##\s+takeaways?\s*(\{#[^}]*\})?\s*$/i.test(l.trim().replace(/\*\*/g, '')));
  if (at >= 0) {
    const rest = lines.slice(at + 1), end = rest.findIndex((l) => /^#{1,2}\s/.test(l.trim()));
    inline((end < 0 ? rest : rest.slice(0, end)).join('\n'), ctx);
  }
  if (!hasCard) return;
  // the lead: every line before the first section heading (the chapter's # title aside; a lead holds no figure)
  const first = lines.findIndex((l) => /^##\s/.test(l.trim()));
  inline((first < 0 ? [] : lines.slice(0, first)).filter((l) => !/^#\s/.test(l.trim())).join('\n'), ctx);
  cardCites(meta.card, ctx);
}
// the card in the text: after the lead, before the first section heading (an <h3> in The Chain, an <h2> on the readable page)
const withCard = (prose, card, tag) => { if (!card) return prose; const i = prose.search(new RegExp('<' + (tag || 'h3') + '[\\s>]')); return i < 0 ? prose + card : prose.slice(0, i) + card + '\n' + prose.slice(i); };
// The marks for one place in the text. More urls than sentences: the extras sit with the last sentence, a comma between
// marks so that 1 and 2 never read as 12. A sentence with no url gets no mark.
const cardMarks = (urls, ctx) => (ctx ? urls.filter(Boolean).map((u) => cite(u, ctx)).join('<sup class="cite-sep" aria-hidden="true">,</sup>') : '');
// a card text with its marks, sentence by sentence; g wraps glossary terms (escaped HTML in and out)
function cardText(text, urls, ctx, g) {
  const ss = cardSentences(text), us = urls || [];
  return ss.map((s, i) => {
    const stop = (s.match(CARD_STOP) || [''])[0];
    return g(esc(s.slice(0, s.length - stop.length))) + cardMarks(i < ss.length - 1 ? [us[i]] : us.slice(i), ctx) + esc(stop);
  }).join(' ');
}
// a figure at the head of the cost slot: an amount, a range or a share, with its unit
const COST_LEAD = /^((?:about |roughly |up to |from |over |under |~|≈)?(?:US)?[$€£¥]?\d[\d,.]*\+?(?:\s?(?:-|–|to)\s?[$€£¥]?\d[\d,.]*)?\s?(?:[kKMBT]n?|bn|mn|billion|million|trillion|%)?)\s+(.+)$/i;
// gl, when given, marks glossary terms in the card's prose (the substitutability test, the reason and the China and US
// lines), the first use of each across the card; it takes and returns escaped HTML. ctx is the chapter's citation context
// ({ id, cites }); without it the card is drawn without marks.
// where, when given, names the stage at the card's head ("Lithography")
function nameplate(card, title, gl, ctx, where) {
  if (!card) return '';
  const g = gl || ((s) => s), plain = (s) => s;
  const F = {}; cardFields(card).forEach((f) => { F[f.what] = f.urls; });
  // a leader's share with its mark (the firm's China share of revenue is not repeated here, decision 13 of 21 Oct 2026: it stays
  // in the Suppliers drawer, the Glossary's firm card and the Export Controls chart)
  const leaders = (card.leaders || []).map((l) => `<li><span class="chip">${esc(l.country || '')}</span><span class="who">${esc(l.name)}</span>${l.share ? ` <span class="note">${cardText(l.share, l.source ? [String(l.source)] : [], ctx, plain)}</span>` : ''}</li>`).join('');
  const countries = (card.countries || []).map((c) => `<li><span class="chip">${esc(c.code)}</span><span class="who">${esc(COUNTRY[c.code] || c.code)}</span>${c.note ? ` <span class="note">${esc(c.note)}</span>` : ''}</li>`).join('');
  const sub = card.substitution || {};
  const sb = card.substitutability && card.substitutability.band ? card.substitutability : null;
  const conc = card.concentration || '';
  // Cost signal: lead with the number when the first sentence starts with one, the rest of that sentence and any others in
  // small type below; a first sentence that does not gets the small reading face, never the display size. The first mark
  // goes at the end of the first sentence, wherever that falls, and each later sentence carries its own.
  const costSS = cardSentences(card.costSignal), costU = F.costSignal || [];
  const first = costSS[0] || '', firstStop = (first.match(CARD_STOP) || [''])[0], firstBody = first.slice(0, first.length - firstStop.length);
  const firstMarks = cardMarks(costSS.length > 1 ? [costU[0]] : costU, ctx);
  const numLead = firstBody.match(COST_LEAD), lead = !!(numLead && firstBody.length > 30);
  const costLong = !lead && firstBody.length > 30;
  const restHTML = costSS.length > 1 ? cardText(costSS.slice(1).join(' '), costU.slice(1), ctx, plain) : '';
  // a figure set large drops its full stop; a first sentence in the reading face keeps it
  const costHeadHTML = lead ? esc(numLead[1]) : first ? esc(firstBody) + firstMarks + (costLong ? esc(firstStop) : '') : '—';
  const costSubHTML = lead ? esc(numLead[2]) + firstMarks + esc(firstStop) + (restHTML ? ' ' + restHTML : '') : restHTML;
  const costLabel = card.costLabel ? esc(card.costLabel) : 'Price or market size';
  return `<section class="plate" aria-label="Chokepoint card${title ? ' for ' + esc(title) : ''}">
<header class="plate-head"><span class="label">Chokepoint card</span>${where ? `<span class="plate-where">${esc(where)}</span>` : ''}</header>
<div class="plate-kpis">
<div><span class="k">Concentration</span><b class="v ${esc(conc)}">${conc ? `${meterHTML(conc)}<button type="button" class="gl-term v-btn" data-band="${BANDS[conc] || 0}" data-term="concentration" data-head="${esc(conc)} concentration" data-note="${esc(BAND_NOTE[conc] || '')}">${esc(conc)}</button>` : '—'}</b>${BAND_NOTE[conc] ? `<span class="sub">${esc(BAND_NOTE[conc])}</span>` : ''}</div>
${sb ? `<div><span class="k">Substitutability</span><b class="v sub-${SUBS[sb.band] || 0}"><button type="button" class="gl-term v-btn" data-band="${SUBS[sb.band] || 0}" data-term="substitutability" data-head="${esc(SUBWORD[sb.band] || sb.band)}" data-note="${esc(SUB_NOTE[sb.band] || '')}" data-test="${esc(sb.test || '')}">${esc(sb.band)}</button></b>${sb.test ? `<span class="sub">${cardText(sb.test, F['substitutability test'], ctx, g)}</span>` : ''}</div>` : `<div><span class="k">Substitution time</span><b class="v">${esc(sub.years || '—')}${sub.years && !/year/i.test(sub.years) ? '<small>years</small>' : ''}</b></div>`}
<div><span class="k">${costLabel}</span><b class="v cost${costLong ? ' long' : ''}">${costHeadHTML}</b>${costSubHTML ? `<span class="sub">${costSubHTML}</span>` : ''}</div>
</div>
<dl class="plate-rows">
${leaders ? `<div class="row row--leads"><dt>Who leads</dt><dd><ul>${leaders}</ul></dd></div>` : ''}
${countries ? `<div class="row row--where"><dt>Where it is made</dt><dd><ul>${countries}</ul></dd></div>` : ''}
${(sb && sb.why) || sub.why ? `<div class="row row--why"><dt>Why substitution is ${sb && SUBS[sb.band] <= 2 ? 'possible' : 'slow'}</dt><dd class="why">${sb && sb.why ? cardText(sb.why, F['substitutability why'], ctx, g) : g(esc(sub.why))}</dd></div>` : ''}
</dl>
${card.chinaStatus || card.usStatus ? `<div class="plate-status">${card.chinaStatus ? `<div><span class="k">Where China stands</span><p>${cardText(card.chinaStatus, F.chinaStatus, ctx, g)}</p></div>` : ''}${card.usStatus ? `<div><span class="k">Where the US stands</span><p>${cardText(card.usStatus, F.usStatus, ctx, g)}</p></div>` : ''}</div>` : ''}
</section>`;
}

/* ---------------- chapters ---------------- */
const contentDir = path.join(root, 'content');
const files = fs.existsSync(contentDir) ? fs.readdirSync(contentDir).filter((f) => /^\d\d-.*\.md$/.test(f)).sort() : [];
const chapters = [];
let geo = null;
for (const f of files) {
  const { meta, body } = parseChapter(read(path.join(contentDir, f)), f);
  const id = meta.id || f.replace(/^\d\d-/, '').replace(/\.md$/, '');
  const ctx = { id, cites: [], figures: meta.figures || [], number: meta.number || chapters.length + 1, figList: [] };
  readingOrderCites(meta, body, ctx, STAGES.isStage({ id, number: meta.number }));
  const { html, headings } = markdown(body, ctx);
  const words = wordCount(body);
  // figList: the figures in the order they are placed, numbered "04.1" on, for the contents rail (chapterHTML)
  const ch = { file: f, id, meta, html, headings, words, cites: ctx.cites, figList: ctx.figList, number: meta.number || chapters.length + 1, title: meta.title || id };
  (meta.figures || []).forEach((fig) => { if (!body.includes(`{{figure:${fig.id}}}`)) warn(`${id}: figure ${fig.id} defined but never placed`); });
  if (id === 'geopolitics') geo = ch; else chapters.push(ch);
}
chapters.sort((a, b) => a.number - b.number);
if (!chapters.length) warn('no chapters found; building with a placeholder');

const pad = (n) => String(n).padStart(2, '0');
const SHORT = { 'design-and-eda': 'Design', 'silicon-and-wafers': 'Silicon', 'chemicals-gases-and-photoresist': 'Chem­icals', lithography: 'Litho', 'photomasks-and-pellicles': 'Masks', 'deposition-and-etch': 'Dep / etch', 'metrology-and-inspection': 'Metro­logy', 'foundries-and-fabs': 'Foundry', 'memory-and-hbm': 'Memory', 'advanced-packaging': 'Pack­aging', 'substrates-and-pcbs': 'Sub­strate', 'test-and-assembly': 'Test', 'systems-and-networking': 'Systems', 'data-centers-and-power': 'Power', 'introduction-and-goals': 'Intro', 'component-costs': 'Costs', geopolitics: 'Geopolitics' };
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const word = (n) => WORDS[n] || String(n);
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const isStage = (ch) => STAGES.isStage(ch); // every chapter but the economics chapter and the essay is a stage (build/stages.js)
const stages = chapters.filter(isStage);
function chainTrack(chs, currentId) {
  return `<ol class="chain-track">${chs.map((c) => { const cb = (c.meta.card || {}).concentration || ''; return `<li class="stage-cell" data-band="${BANDS[cb] || 0}" data-id="${esc(c.id)}"${c.id === currentId ? ' aria-current="true"' : ''}><a href="${esc(c.id)}/" data-route="#${esc(c.id)}" title="${esc(c.title)}${cb ? ' · ' + esc(cb) + ' concentration' : ''}"><span class="n">${pad(c.number)}</span><span class="bar"><i></i></span><span class="t">${esc(SHORT[c.id] || c.title)}</span></a></li>`; }).join('')}</ol>`;
}
const textOf = (html) => String(html || '').replace(/<sup class="cite">[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const norm = (t) => textOf(t).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
// Pull the Takeaways block out of the body so it can lead the chapter as "In short".
function splitTakeaways(html) {
  const m = html.match(/<div class="takeaways"><h3[^>]*>Takeaways<\/h3>([\s\S]*?)<\/div>\s*$/) || html.match(/<div class="takeaways"><h3[^>]*>Takeaways<\/h3>([\s\S]*?)<\/div>/);
  if (!m) return { body: html, inShort: '' };
  return { body: html.replace(m[0], ''), inShort: m[1].trim() };
}
// Replace the paragraph that repeats meta.plain with a highlighted "In plain terms" box (or insert one after the first h3).
// Remove the paragraph that repeats meta.plain from the body; the head shows it as the "In plain terms" box.
function plainBox(html, plain, ctx) {
  if (!plain) return { html, box: '' };
  const key = norm(plain).slice(0, 60);
  let done = false;
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (whole, inner) => { if (!done && key && norm(inner).slice(0, 60) === key) { done = true; return ''; } return whole; });
  return { html, box: `<div class="plain" id="${esc(ctx.id)}--plain"><h3 class="label">In plain terms</h3><p>${inline(plain, ctx)}</p></div>` };
}
// the main page's "In plain terms" box, with the first use of each glossary term in its paragraph marked (the label is left alone)
const glPlain = (box) => String(box || '').replace(/<p>([\s\S]*)<\/p>/, (m, inner) => `<p>${glossaryWrap(inner)}</p>`);
/* ---------------- glossary terms in the prose ----------------
   The first time a chapter uses a glossary term, it is wrapped in a button the runtime hangs a
   definition popover on. Headings, links, code, citation marks, figures and the card are left alone. */
const glossary = readJSON(path.join(root, 'data', 'glossary.json'), []);
const GL_SKIP = /^(a|code|sup|button|svg|figure|h1|h2|h3|h4|h5|h6|dt|dd)$/i;
const glVariants = (() => {
  const canon = new Set(glossary.map((g) => String(g.term).toLowerCase()));
  const map = new Map();
  glossary.forEach((g) => map.set(String(g.term).toLowerCase(), g.term));
  glossary.forEach((g) => String(g.aka || '').split(/,\s*/).forEach((a) => {
    a = a.trim();
    // some aka fields carry a gloss rather than an alternate name ("singular of dice", "for example N2 or 18A")
    if (!a || a.includes(';') || /^(part of|singular of|when |for example|also )/i.test(a)) return;
    if (canon.has(a.toLowerCase()) || map.has(a.toLowerCase())) return;
    map.set(a.toLowerCase(), g.term);
  }));
  return [...map.entries()].map(([v, term]) => ({ v, term })).sort((a, b) => b.v.length - a.v.length);
})();
const glRE = glVariants.length
  ? new RegExp('(?<![A-Za-z0-9])(' + glVariants.map((t) => t.v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')).join('|') + ')(?![A-Za-z0-9])', 'gi')
  : null;
const glTermOf = new Map(glVariants.map((t) => [t.v, t.term]));
// `used` lets several pieces of one block share a single first use (the card's test, reason and China and US lines)
function glossaryWrap(html, used) {
  if (!glRE) return html;
  used = used || new Set();
  // a term's button keeps the punctuation after it on its line: a button is a box of its own, so the browser could otherwise
  // start a line with the comma (font check, 27 Oct)
  const keepLine = (s) => s.replace(/(<button type="button" class="gl-term" data-term="[^"]*">[^<]*<\/button>)([,.;:!?)\]]+)/g, '<span class="nw">$1$2</span>');
  const wrapText = (text) => keepLine(text.split(/(&[a-zA-Z#][a-zA-Z0-9]*;)/).map((part, i) => {
    if (i % 2) return part; // an HTML entity: leave it whole
    return part.replace(glRE, (match, _v, offset, str) => {
      const term = glTermOf.get(match.toLowerCase().replace(/\s+/g, ' '));
      if (!term || used.has(term)) return match;
      if (/^lot$/i.test(match) && /\ba\s+$/i.test(str.slice(Math.max(0, offset - 3), offset))) return match; // "a lot" is not a wafer lot
      used.add(term);
      return `<button type="button" class="gl-term" data-term="${esc(term.toLowerCase())}">${match}</button>`;
    });
  }).join(''));
  let out = '', last = 0, m, depth = 0;
  const tag = /<(\/?)([a-zA-Z][\w-]*)\b[^>]*?(\/?)>/g;
  while ((m = tag.exec(html))) {
    const text = html.slice(last, m.index);
    out += depth ? text : wrapText(text);
    out += m[0];
    last = tag.lastIndex;
    if (GL_SKIP.test(m[2]) && !m[3]) depth += m[1] ? -1 : 1;
    if (depth < 0) depth = 0;
  }
  out += depth ? html.slice(last) : wrapText(html.slice(last));
  return out;
}

// The reading spine: the numbered chapters, then the geopolitics essay, which sits on its own route.
const chapterHref = (c) => '#' + esc(c.id); // the essay is the last chapter inside the chain
/* The end of a chapter is a door to the next one (the hybrid mockup's .nextx, approved in design round three): where the next
   chapter sits in the chain, its title large, its one line, a button and a still of its specimen, with Previous as a small
   second link. The Chain shows one chapter at a time, so the door is the way on. The last chapter's door leads back to the
   contents. prevNext passes how a chapter is linked (attrs), the element the door is (tag) and where the media folder is
   (media); the readable pages, which drew it too until 28 Oct 2026, passed their own. The last two chapters are not stages, and the site groups them as "Across the chain" (the
   contents, the phone's sheet), so their doors say so. */
// the still of a chapter's specimen: Lithography's is the one its numbered parts are drawn over (data/specimen-parts.json)
function doorStill(c) {
  const pe = specimenParts[c.id];
  if (pe && pe.still && pe.still.file) { const S = +pe.still.size || 772; return { file: pe.still.file, w: S, h: S }; }
  const sz = stillSizes[c.id];
  return sz ? { file: `spec-${c.id}.webp`, w: sz[0], h: sz[1] } : null;
}
function chapterDoor(ch, attrs, tag, media) {
  const seq = chapters.concat(geo ? [geo] : []);
  const i = seq.findIndex((c) => c.id === ch.id);
  if (i < 0) return '';
  const prev = seq[i - 1], next = seq[i + 1];
  // the door numbers a chapter as the kicker does: "Stage 5 of 14", or "Across the chain" (28 Oct 2026)
  const where = (c) => { const si = stages.findIndex((x) => x.id === c.id); return si >= 0 ? `Stage ${si + 1} of ${stages.length}` : 'Across the chain'; };
  const go = (words) => `<span class="go">${words}<span class="circ" aria-hidden="true">→</span></span>`;
  // the drawing is the title's picture, so it has no words of its own; the two chapters that are not stages keep their night ground
  const st = next ? doorStill(next) : null;
  const ex = st ? `<span class="ex"${!isStage(next) ? ' data-night="1"' : ''}><img src="${media || ''}${esc(st.file)}" width="${Math.round(st.w / 2)}" height="${Math.round(st.h / 2)}" alt="" loading="lazy" decoding="async"></span>` : '';
  const nx = next
    ? `<a class="pn next" ${attrs(next)}><span class="label">Next · ${where(next)}</span><span class="t">${esc(next.title)}</span>${next.meta.oneLiner ? `<span class="ol">${esc(next.meta.oneLiner)}</span>` : ''}${go('Continue reading')}${ex}</a>`
    : `<a class="pn next" href="#/chain"><span class="label">Contents</span><span class="t">All ${word(seq.length)} chapters</span><span class="ol">The ${word(stages.length)} stages run from chip design to the data center. The last ${word(seq.length - stages.length)} chapters cover what a chip costs and who controls the chain.</span>${go('Back to the contents')}</a>`;
  const pv = prev ? `<a class="pn prev" ${attrs(prev)}><span class="label">Previous · ${where(prev)}</span><span class="t">${esc(prev.title)}</span></a>` : '';
  return tag === 'div' ? `<div class="prevnext">${nx}${pv}</div>` : `<nav class="prevnext" aria-label="Next chapter">${nx}${pv}</nav>`;
}
const prevNext = (ch) => chapterDoor(ch, (c) => `href="${esc(c.id)}/" data-route="${chapterHref(c)}"`, 'nav', 'media/');
// End-of-chapter flashcards: four cards (question on the front, answer and reason on the back), then the four things to
// remember (data/flashcards.json, keyed by chapter id). Start here ends with a deck of its own, "intro" in the same file,
// built by the same deckHTML in build/modules/walk.js (ctx.deckHTML).
const flashcards = readJSON(path.join(root, 'data', 'flashcards.json'), {});
const NUM_WORD = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
function reviewHTML(ch) {
  const fc = flashcards[ch.id];
  if (!fc || !Array.isArray(fc.cards) || !fc.cards.length) return '';
  // each card's reason ends with a link back to the section of the chapter that covers it
  return deckHTML(fc, { id: ch.id, title: ch.title, more: (c, i) => {
    const anchor = c.section ? `${ch.id}--${slug(c.section)}` : '';
    if (anchor && !ch.html.includes(`id="${anchor}"`)) warn(`flashcards ${ch.id} #${i + 1}: no section "${c.section}"`);
    return anchor ? { href: '#' + anchor, text: 'Reread: ' + c.section } : null;
  } });
}
// one deck, wherever it sits: o.id makes its address ("<id>--flashcards"), o.title its label, o.more(card, i) the link that
// ends a card's reason ({ href, text } or null), o.attrs any attributes of its own (Start here's names its storage key) and
// o.sub the line beside its title
function deckHTML(fc, o) {
  const n = fc.cards.length;
  const cards = fc.cards.map((c, i) => {
    if (!c.q || !c.a) warn(`flashcards ${o.id} #${i + 1}: needs q and a`);
    const link = o.more(c, i);
    const more = link ? ` <a class="fc-more" href="${esc(link.href)}">${esc(link.text)}</a>` : '';
    // the squares under the deck show the place; a screen reader hears it here. Clipped in place, not moved off to the left as
    // .sr-only is: on the turned card's back a left offset becomes a right one and widened the page by 10,000 px
    const count = `<span class="fc-n">Card ${i + 1} of ${n}. </span>`;
    return `<div class="fc-card" data-i="${i}"${i ? ' hidden' : ''}>`
      + `<div class="fc-face fc-front"><div class="fc-row">${count}<span class="label">Question</span></div><p class="fc-q">${esc(c.q)}</p><div class="fc-row fc-row--end"><button type="button" class="fc-btn fc-btn--solid fc-show">Show answer</button></div></div>`
      + `<div class="fc-face fc-back" inert><div class="fc-row">${count}<span class="label">Answer</span></div><p class="fc-a">${esc(c.a)}</p>${c.why || more ? `<p class="fc-why">${esc(c.why || '')}${more}</p>` : ''}<div class="fc-row fc-row--foot"><button type="button" class="fc-link fc-flipback">Show question</button><span class="fc-marks"><button type="button" class="fc-btn fc-mark" data-known="0">Didn’t know</button><button type="button" class="fc-btn fc-btn--solid fc-mark" data-known="1">Knew it</button></span></div></div>`
      + `</div>`;
  }).join('');
  const dots = `<span class="fc-dots" aria-hidden="true">${fc.cards.map((_, i) => `<i${i ? '' : ' class="on"'}></i>`).join('')}</span>`;
  const keep = Array.isArray(fc.takeaways) && fc.takeaways.length ? `<div class="rv-keep"><h4 class="label">${NUM_WORD[fc.takeaways.length] || fc.takeaways.length} things to remember</h4><ul>${fc.takeaways.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>` : '';
  // the deck's id is the address search links to (src/app.js opens the deck at the card that was found)
  return `<section class="review fc" id="${esc(o.id)}--flashcards"${o.attrs || ''} aria-label="Flashcards: ${esc(o.title)}"><header class="rv-head"><h3 class="rv-title">Flashcards</h3><p class="rv-sub">${esc(o.sub || 'Recall each answer, then turn the card.')}</p></header>`
    + `<div class="fc-deck"><div class="fc-behind fc-behind--2"></div><div class="fc-behind"></div>${cards}</div>`
    + `<div class="fc-nav">${dots}<span class="fc-steps"><button type="button" class="fc-link fc-prev" disabled>Previous card</button><button type="button" class="fc-link fc-next" disabled>Next card</button></span></div>`
    + `<div class="fc-end" hidden><p class="fc-score"><span class="fc-big"></span><span class="fc-score-t"></span></p>${keep}<p class="fc-row fc-row--gap"><button type="button" class="fc-btn fc-back-to-cards">Previous card</button><button type="button" class="fc-btn fc-reset">Start over</button></p></div></section>`;
}
// the chapter's share link: a plain link to its own page; a click copies the address
// (src/app.js). It leads the cite line's actions (citeBlock).
const copyLink = (id) => `<a class="ch-copy ch-cite-copylink" href="${esc(id)}/" data-copy="${SITE.url}${esc(id)}/" aria-label="Copy a link to this chapter">Link to chapter</a>`;
/* ---------------- the cite line under each chapter title ----------------
   The chapter head is one line of facts (.ch-meta: words / minutes, the specimen, "Updated <day>") and one line of actions,
   this one: "Link to chapter · Cite this chapter · Chapter PDF" (lead, the copy link). The day is the chapter's own (page
   dates, below). The citation names the chapter and its page; Chapter PDF downloads the chapter's own PDF. The toggle is a
   button (CITE_JS). Until 28 Oct 2026 the readable pages drew it as a link to the citation too. */
// each chapter's PDF, dist/pdf/<id>.pdf (written by build/chapter_pdfs.py, not by the build): the cite line links it and the
// sitemap lists it once the file exists, so a chapter not yet printed never shows a broken link
const chapterPDFs = new Map();
function chapterPDF(id) {
  if (!chapterPDFs.has(id)) {
    let v = null;
    try {
      const bytes = fs.readFileSync(path.join(root, 'dist', 'pdf', id + '.pdf'));
      v = { href: 'pdf/' + id + '.pdf', bytes, pages: (bytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length };
    } catch (e) { v = null; }
    chapterPDFs.set(id, v);
  }
  return chapterPDFs.get(id);
}
function citeBlock(ch, day, lead) {
  const url = SITE.url + ch.id + '/', box = 'cite-' + ch.id;
  const toggle = `<button type="button" class="ch-cite-btn" aria-expanded="false" aria-controls="${box}">Cite this chapter</button>`;
  // saved under a name that says what it is: chip-supply-chain-lithography.pdf, not lithography.pdf
  const pdf = chapterPDF(ch.id);
  const pdfLink = pdf ? `<span class="ch-cite-sep" aria-hidden="true">·</span><a class="ch-cite-pdf" href="${pdf.href}" download="chip-supply-chain-${esc(ch.id)}.pdf" type="application/pdf" title="${esc(ch.title)} as a PDF${pdf.pages ? `, ${pdf.pages} pages` : ''}">Chapter PDF</a>` : '';
  return `<div class="ch-cite"><p class="ch-cite-line">${lead ? lead + '<span class="ch-cite-sep" aria-hidden="true">·</span>' : ''}${toggle}${pdfLink}</p>`
    + `<div class="ch-cite-box" id="${box}" role="region" aria-label="Citation for this chapter" hidden><p class="ch-cite-text">Sharma, Yashvardhan. “${esc(ch.title)}.” <i>${CITE_WORK}</i>. Updated ${esc(day)}. <a href="${esc(url)}">${esc(url)}</a></p></div></div>`;
}
// the toggle and the copy control, part of the shared app (dist/assets/app.js; the readable pages carried it too until 28 Oct 2026)
const CITE_JS = `(function(){
function copyBtn(b){if(b.querySelector('.ch-cite-copy')||!(navigator.clipboard&&navigator.clipboard.writeText))return;var c=document.createElement('button');c.type='button';c.className='ch-cite-copy';c.textContent='Copy citation';b.appendChild(c);}
function set(t,open){var b=document.getElementById(t.getAttribute('aria-controls'));if(!b)return;t.setAttribute('aria-expanded',open?'true':'false');b.hidden=!open;b.classList.toggle('is-open',open);if(open)copyBtn(b);}
document.addEventListener('click',function(e){var t=e.target.closest?e.target.closest('.ch-cite-btn, .ch-cite-copy'):null;if(!t)return;
if(t.classList.contains('ch-cite-btn')){e.preventDefault();set(t,t.getAttribute('aria-expanded')!=='true');return;}
var p=t.parentNode.querySelector('.ch-cite-text'),text=p?p.textContent.replace(/\\s+/g,' ').trim():'';
navigator.clipboard.writeText(text).then(function(){t.textContent='Copied';setTimeout(function(){t.textContent='Copy citation';},1600);},function(){t.textContent='Copy failed';});});
document.addEventListener('keydown',function(e){if(e.key!==' ')return;var t=e.target.closest?e.target.closest('a.ch-cite-btn'):null;if(!t)return;e.preventDefault();set(t,t.getAttribute('aria-expanded')!=='true');});
Array.prototype.forEach.call(document.querySelectorAll('a.ch-cite-btn'),function(a){a.setAttribute('role','button');a.setAttribute('aria-expanded','false');});
try{var o=location.hash.length>1?document.getElementById(location.hash.slice(1)):null;if(o&&o.classList.contains('ch-cite-box')){var t=document.querySelector('.ch-cite-btn[aria-controls="'+o.id+'"]');if(t)set(t,true);}}catch(e){}
})();`;
// A figure's Table and PNG actions (figure() above draws Cite and CSV, which need no script). Part of the shared app, as
// CITE_JS is. Table shows the figure's own rows in place of its chart, and back; PNG draws the figure, always on the light
// ground, to a 1,600 px wide picture and saves it: bars (with their ranges), columns and change rows, read back from the marks
// figure() drew, with the chart rule's wine where the page has it.
const FIG_JS = `(function(){
var D=document;
function el(t,c,x){var e=D.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e;}
function wrap(g,s,w){var out=[],line='';String(s).split(/\\s+/).forEach(function(word){var t=line?line+' '+word:word;if(g.measureText(t).width>w&&line){out.push(line);line=word;}else line=t;});if(line)out.push(line);return out;}
function txt(n){return n?n.textContent.replace(/\\s+/g,' ').trim():'';}
function save(cv,fig,k){cv.toBlob(function(b){if(!b)return;var a=el('a');a.href=URL.createObjectURL(b);a.download='chip-supply-chain-'+(k.replace(/^Figure\\s*/,'figure-').replace(/[^0-9a-z]+/gi,'-').toLowerCase())+'-'+(fig.id.replace(/^fig-/,'').replace(((fig.closest('article.chapter')||{}).id||'x')+'-','')||'chart')+'.png';D.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},2000);},'image/png');}
/* a timeline (08.2, 16.1; 28 Oct 2026): its dates in the code face down the left, each event beside its date, on hairlines */
function pngTl(fig){
var items=[].slice.call(fig.querySelectorAll('.fig-body .tl li'));if(!items.length)return;
var k=txt(fig.querySelector('.fig-k')),t1=txt(fig.querySelector('.fig-title')),t2=txt(fig.querySelector('.fig-sub'));
var dl=(/Data: (.+)\\.$/.exec(txt(fig.querySelector('.fig-cite-box .ch-cite-text')))||[])[1],src=fig.querySelector('.fs-src'),sc=src?src.cloneNode(true):null;if(sc)[].forEach.call(sc.querySelectorAll('.fs-k'),function(x){x.remove();});
var srcT=dl||(sc?txt(sc).replace(/\\s*\\d+$/,''):''),addr=txt(fig.querySelector('.fig-cite-box a')).replace(/^https?:\\/\\//,'');
var W=800,P=40,S=2,DW=150,cv=el('canvas'),g=cv.getContext('2d');
var FD='"Fraunces",Georgia,serif',FB='"Source Serif 4",Georgia,serif',FU='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',FM='"Fragment Mono",Menlo,monospace',INK='#171716',INK2='#45443f',LINE='#e1e0db';
g.font='500 24px '+FD;var L1=wrap(g,t1,W-2*P);g.font='400 16px '+FB;var L2=t2?wrap(g,t2,W-2*P):[];
var rows=items.map(function(li){var d=txt(li.querySelector('.d')),c=li.cloneNode(true),x=c.querySelector('.d');if(x)x.remove();g.font='400 15px '+FB;return{d:d,L:wrap(g,txt(c),W-2*P-DW)};});
var chartH=rows.reduce(function(a,r){return a+r.L.length*21+16;},0);
var H=P+18+L1.length*31+(L2.length?6+L2.length*21:0)+24+chartH+20+56;
cv.width=W*S;cv.height=H*S;g.scale(S,S);g.fillStyle='#ffffff';g.fillRect(0,0,W,H);
var y=P;g.textBaseline='alphabetic';g.fillStyle='#56554f';g.font='400 13px '+FM;g.fillText(k,P,y+12);y+=22;
g.fillStyle=INK;g.font='500 24px '+FD;L1.forEach(function(s){y+=28;g.fillText(s,P,y);y+=3;});
if(L2.length){y+=6;g.fillStyle=INK2;g.font='400 16px '+FB;L2.forEach(function(s){y+=19;g.fillText(s,P,y);y+=2;});}
y+=24;g.fillStyle=INK;g.fillRect(P,y,W-2*P,1);
rows.forEach(function(r){y+=8;g.fillStyle='#56554f';g.font='400 13px '+FM;g.fillText(r.d,P,y+15);g.fillStyle=INK;g.font='400 15px '+FB;r.L.forEach(function(s,j){g.fillText(s,P+DW,y+15+j*21);});y+=r.L.length*21+8;g.fillStyle=LINE;g.fillRect(P,y,W-2*P,1);});
y+=20;g.fillStyle='#45443f';g.font='400 12.5px '+FU;var sl=wrap(g,(srcT?'Source: '+srcT:''),W-2*P);sl.slice(0,1).forEach(function(s){g.fillText(s,P,y);});
g.fillStyle='#56554f';g.font='400 12px '+FM;g.fillText(addr,P,y+20);
save(cv,fig,k);
}
function png(fig){
if(fig.querySelector('.fig-body .tl'))return pngTl(fig);
var hb=[].slice.call(fig.querySelectorAll('.hbars .hb')),cl=[].slice.call(fig.querySelectorAll('.cols-plot .col')),cg=[].slice.call(fig.querySelectorAll('.cg-row:not(.cg-axis)'));
var kind=hb.length?'hb':cl.length?'cols':'cg',labs=fig.querySelectorAll('.cols-lab span');
var num=function(r,a){var v=r.getAttribute(a);return v==null||v===''?null:+v;};
var rows=(hb.length?hb:cl.length?cl:cg).map(function(r,i){return{l:kind==='hb'?txt(r.querySelector('.hb-l')):kind==='cols'?txt(labs[i]):txt(r.querySelector('.cg-l b')),s:kind==='cg'?txt(r.querySelector('.cg-l small')):'',v:txt(r.querySelector(kind==='hb'?'.hb-r > b':kind==='cols'?'b':'.cg-v')),n:num(r,'data-v')||0,hi:num(r,'data-hi'),ref:num(r,'data-ref'),rl:txt(r.querySelector('.hb-ref span,.col-ref span')),a:num(r,'data-a'),b:num(r,'data-b'),lo:num(r,'data-lo'),top:r.classList.contains('top'),rest:r.classList.contains('rest'),span:r.classList.contains('span')};});
if(!rows.length)return;
var k=txt(fig.querySelector('.fig-k')),t1=txt(fig.querySelector('.fig-title')),t2=txt(fig.querySelector('.fig-sub'));
var src=fig.querySelector('.fs-src'),sc=src?src.cloneNode(true):null;if(sc)[].forEach.call(sc.querySelectorAll('.fs-k'),function(x){x.remove();});
var dl=(/Data: (.+)\\.$/.exec(txt(fig.querySelector('.fig-cite-box .ch-cite-text')))||[])[1];
var srcT=dl||(sc?txt(sc).replace(/\\s*\\d+$/,''):''),addr=txt(fig.querySelector('.fig-cite-box a')).replace(/^https?:\\/\\//,'');
var W=800,P=40,S=2,cv=el('canvas'),g=cv.getContext('2d');
var FD='"Fraunces",Georgia,serif',FB='"Source Serif 4",Georgia,serif',FU='"Hanken Grotesk","Helvetica Neue",Arial,sans-serif',FM='"Fragment Mono",Menlo,monospace';
var WINE='#7a1f2b',TINT='#d2d1cc',INK='#171716',INK2='#45443f',RULE='#8c8a84',LINE='#e1e0db';
var hi=function(r){return r.hi!=null?r.hi:r.n;},max=Math.max.apply(null,rows.map(hi))||1;
var vwid=function(){return Math.max.apply(null,rows.map(function(r){g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;return g.measureText(r.v).width;}));};
function hatch(x,y,w,h,c){if(w<=0||h<=0)return;g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.strokeStyle=c;g.lineWidth=1.5;for(var i=-h;i<w+h;i+=6){g.beginPath();g.moveTo(x+i,y+h);g.lineTo(x+i+h,y);g.stroke();}g.restore();}
function range(r,x,y,w,h,lo,vert){var c=r.top?WINE:RULE;g.fillStyle=r.top&&!r.span?WINE:TINT;if(vert){g.fillRect(x,y+h-lo,w,lo);hatch(x,y,w,h-lo,c);}else{g.fillRect(x,y,lo,h);hatch(x+lo,y,w-lo,h,c);}g.strokeStyle=c;g.lineWidth=1.5;g.strokeRect(x+0.75,y+0.75,w-1.5,h-1.5);}
g.font='500 24px '+FD;var L1=wrap(g,t1,W-2*P);g.font='400 16px '+FB;var L2=t2?wrap(g,t2,W-2*P):[];
var lw=0,cw=0,sp=0,LL=[],hasRef=rows.some(function(r){return r.ref!=null;}),chartH;
if(kind==='hb'){g.font='400 14px '+FU;lw=Math.min(W*0.42,Math.max.apply(null,rows.map(function(r){return g.measureText(r.l).width;}))+8);chartH=rows.length*34+(hasRef?20:0);}
else if(kind==='cols'){var n=rows.length;cw=Math.min(140,(W-2*P-(n-1)*18)/n);sp=(W-2*P-n*cw)/(n+1);g.font='600 13.5px '+FU;LL=rows.map(function(r){return wrap(g,r.l,cw+sp-6);});chartH=26+190+10+Math.max.apply(null,LL.map(function(l){return l.length;}))*18;}
else{g.font='600 14.5px '+FU;lw=Math.max.apply(null,rows.map(function(r){g.font='600 14.5px '+FU;var a=g.measureText(r.l).width;g.font='400 12.5px '+FU;return Math.max(a,g.measureText(r.s).width);}))+20;chartH=30+rows.length*50;}
var H=P+18+L1.length*31+(L2.length?6+L2.length*21:0)+24+chartH+20+56;
cv.width=W*S;cv.height=H*S;g.scale(S,S);g.fillStyle='#ffffff';g.fillRect(0,0,W,H);
var y=P;g.textBaseline='alphabetic';g.fillStyle='#56554f';g.font='400 13px '+FM;g.fillText(k,P,y+12);y+=22;
g.fillStyle=INK;g.font='500 24px '+FD;L1.forEach(function(s){y+=28;g.fillText(s,P,y);y+=3;});
if(L2.length){y+=6;g.fillStyle=INK2;g.font='400 16px '+FB;L2.forEach(function(s){y+=19;g.fillText(s,P,y);y+=2;});}
y+=24;
if(kind==='hb'){var x0=P+lw+12,bw=W-P-x0-Math.max(90,vwid()+14);
rows.forEach(function(r){var w=Math.max(1,hi(r)/max*bw);
g.textAlign='right';g.fillStyle=r.top?INK:INK2;g.font=(r.top?'600':'400')+' 14px '+FU;g.fillText(r.l,P+lw,y+16);g.textAlign='left';
if(r.rest){g.save();g.beginPath();g.rect(x0,y,w,22);g.clip();g.strokeStyle=RULE;g.lineWidth=1;for(var i=-22;i<w+22;i+=5){g.beginPath();g.moveTo(x0+i,y+22);g.lineTo(x0+i+22,y);g.stroke();}g.restore();g.strokeRect(x0+0.5,y+0.5,w-1,21);}
else if(r.hi!=null){range(r,x0,y,w,22,r.n/r.hi*w,false);if(r.ref!=null){var rx=x0+r.ref/r.hi*w;g.fillStyle=INK;g.fillRect(rx-1,y-5,2,32);g.fillStyle=INK2;g.font='400 12.5px '+FU;g.textAlign='center';g.fillText(r.rl,rx,y+44);g.textAlign='left';}}
else{g.fillStyle=r.top?WINE:TINT;g.fillRect(x0,y,w,22);}
g.fillStyle=r.top?WINE:INK2;g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;g.fillText(r.v,x0+w+10,y+16);y+=34+(r.ref!=null?20:0);});}
else if(kind==='cols'){var yb=y+26+190;
rows.forEach(function(r,i){var x=P+sp*(i+1)+cw*i,cx=x+cw/2,h=Math.max(1,hi(r)/max*190);
if(r.rest){g.save();g.beginPath();g.rect(x,yb-h,cw,h);g.clip();g.strokeStyle=RULE;g.lineWidth=1;for(var j=-h;j<cw+h;j+=5){g.beginPath();g.moveTo(x+j,yb);g.lineTo(x+j+h,yb-h);g.stroke();}g.restore();g.strokeRect(x+0.5,yb-h+0.5,cw-1,h-1);}
else if(r.hi!=null){range(r,x,yb-h,cw,h,r.n/r.hi*h,true);if(r.ref!=null){var ry=yb-r.ref/r.hi*h;g.fillStyle=INK;g.fillRect(x-5,ry-1,cw+10,2);g.fillStyle=INK2;g.font='400 12.5px '+FU;g.fillText(r.rl,x+cw+10,ry+4);}}
else{g.fillStyle=r.top?WINE:TINT;g.fillRect(x,yb-h,cw,h);}
g.textAlign='center';g.fillStyle=r.top?WINE:INK2;g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;g.fillText(r.v,cx,yb-h-8);
g.fillStyle=r.top?INK:INK2;g.font=(r.top?'600':'400')+' 13.5px '+FU;LL[i].forEach(function(s,j){g.fillText(s,cx,yb+20+j*18);});g.textAlign='left';});
g.fillStyle=INK;g.fillRect(P,yb,W-2*P,1);y+=chartH;}
else{var vw=vwid()+16,x0=P+lw,x1=W-P-vw,lo=rows[0].lo,top=num(cg[0],'data-hi'),X=function(v){return x0+(x1-x0)*(v-lo)/((top-lo)||1);};
g.textAlign='center';g.fillStyle='#56554f';g.font='400 12px '+FU;[].forEach.call(fig.querySelectorAll('.cg-axis .cg-t span'),function(s){var p=parseFloat(s.style.left)/100;g.fillText(txt(s),x0+(x1-x0)*p,y+12);g.fillStyle=LINE;g.fillRect(Math.round(x0+(x1-x0)*p),y+22,1,rows.length*50);g.fillStyle='#56554f';});g.textAlign='left';y+=30;
var ends=[].map.call(fig.querySelectorAll('.cg-end'),txt);
rows.forEach(function(r,i){var cy=y+20,c=r.top?WINE:INK,xa=X(r.a),xb=X(r.b),d=xb<xa?-1:1,hl=r.top?11:8,hw=r.top?6:4.5;
g.fillStyle=INK;g.font=(r.top?'600':'500')+' 14.5px '+FU;g.fillText(r.l,P,cy-2);g.fillStyle='#56554f';g.font='400 12.5px '+FU;g.fillText(r.s,P,cy+15);
if(i===0&&ends.length===2){g.textAlign='center';g.fillStyle=INK2;g.font='400 12px '+FU;g.fillText(ends[0],xa,cy-12);g.fillText(ends[1],xb,cy-12);g.textAlign='left';}
g.strokeStyle=c;g.lineWidth=r.top?2.6:1.6;g.beginPath();g.moveTo(xa+d*5,cy);g.lineTo(xb-d*hl,cy);g.stroke();
g.fillStyle=c;g.beginPath();g.moveTo(xb,cy);g.lineTo(xb-d*hl,cy-hw);g.lineTo(xb-d*hl,cy+hw);g.closePath();g.fill();
g.fillStyle='#ffffff';g.strokeStyle=c;g.lineWidth=1.6;g.beginPath();g.arc(xa,cy,5,0,Math.PI*2);g.fill();g.stroke();
g.fillStyle=c;g.font=r.top?'700 15px '+FU:'400 13.5px '+FU;g.fillText(r.v,x1+16,cy+5);y+=50;});}
y+=14;g.fillStyle=LINE;g.fillRect(P,y,W-2*P,1);y+=22;
g.fillStyle='#45443f';g.font='400 12.5px '+FU;var sl=wrap(g,(srcT?'Source: '+srcT:''),W-2*P);sl.slice(0,1).forEach(function(s){g.fillText(s,P,y);});
g.fillStyle='#56554f';g.font='400 12px '+FM;g.fillText(addr,P,y+20);
save(cv,fig,k);
}
function add(acts){
if(acts.getAttribute('data-ready'))return;acts.setAttribute('data-ready','1');
var kind=acts.getAttribute('data-kind'),fig=acts.closest('.figure');if(!fig||['bars','stack','columns','change','timeline'].indexOf(kind)<0)return;
var tl=kind==='timeline'; /* a timeline takes a PNG but no Table: it is already its rows, each date beside its event (28 Oct 2026) */
var tb=tl?null:el('button','fs-tab','Table');if(tb){tb.type='button';tb.setAttribute('aria-pressed','false');
tb.addEventListener('click',function(){var on=!fig.classList.contains('is-table'),t=fig.querySelector('table.fig-table');fig.classList.toggle('is-table',on);if(t)t.classList.toggle('sr-only',!on);tb.setAttribute('aria-pressed',on?'true':'false');});}
var pb=el('button','fs-png','PNG');pb.type='button';pb.setAttribute('aria-label','Save the figure as a PNG picture');
pb.addEventListener('click',function(){var go=function(){png(fig);};if(D.fonts&&D.fonts.ready)D.fonts.ready.then(go);else go();});
var cite=acts.querySelector('.ch-cite-btn');if(tb)acts.insertBefore(tb,cite?cite.nextSibling:acts.firstChild);acts.appendChild(pb);
}
[].forEach.call(D.querySelectorAll('.figure .fs-acts'),add);
})();`;
/* Hide contents: a quiet button at the end of the rail's first line ("On this page") hides the rail's parts, and the text column
   moves to the middle of the page (src/modules/chapter.css, html.rail-off). Show contents, a small pill at the top of the left
   margin, stays in view while the rail is hidden and brings it back. Focus goes from the button pressed to the one that takes
   its place, so a keyboard reader stays on the control. Both name the rail's parts (aria-controls) and say whether they show
   (aria-expanded). The choice is the reader's on this device (localStorage "cp-rail"), the same for every chapter, in the app
   on every chapter's page; the head of each page sets html.rail-off before the first paint. Wide screens only (1200 px and
   up): narrower, the rail is a line of links and neither button shows. The script adds the buttons, so a page read without
   scripts has none, and their words stay out of the text the page dates are taken from. Part of the shared app, as CITE_JS
   is. */
const RAIL_TOGGLE_JS = `(function(){
var D=document,H=D.documentElement,K='cp-rail';
var IC='<svg class="rt-ic" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5"/><path d="M6 2.5v11"/></svg>';
function mk(cls,id,words,open){var b=D.createElement('button');b.type='button';b.className='rail-tog '+cls;b.setAttribute('aria-controls',id);b.setAttribute('aria-expanded',open?'true':'false');b.innerHTML=IC+'<span class="rt-t">'+words+'</span>';return b;}
[].forEach.call(D.querySelectorAll('nav.ch-rail'),function(n){var body=n.querySelector('.rail-body');if(!body||!body.id||n.querySelector('.rail-tog'))return;
var k=body.querySelector('.rail-on .rail-k')||body;k.appendChild(mk('rail-hide',body.id,'Hide contents',true));n.insertBefore(mk('rail-show',body.id,'Show contents',false),body);});
D.addEventListener('click',function(e){var b=e.target.closest?e.target.closest('.ch-rail .rail-tog'):null;if(!b)return;
var off=b.classList.contains('rail-hide');H.classList.toggle('rail-off',off);try{if(off)localStorage.setItem(K,'off');else localStorage.removeItem(K);}catch(x){}
var n=b.closest('.ch-rail'),to=n&&n.querySelector(off?'.rail-show':'.rail-hide');if(to)try{to.focus({preventScroll:true});}catch(x){to.focus();}
try{window.dispatchEvent(new Event('resize'));}catch(x){}});
})();`;
// the key under the ledger column's rows, one per stage: each band the stages hold, its bar drawn as the rows draw it
const LEDGER_KEY = (() => {
  const used = ['Extreme', 'High', 'Moderate', 'Low'].filter((b) => stages.some((c) => (c.meta.card || {}).concentration === b));
  return used.length ? `<p class="ledger-key" aria-hidden="true">${used.map((b) => `<span class="lgk" data-band="${BANDS[b]}"><i></i>${b}</span>`).join('')}</p>` : '';
})();
/* ---------------- the chapter page (redesign stage 2, qa/redesign/BRIEF.md; its opener is "the column" of design round five,
   chosen 27 Oct 2026, MAIN/qa/design5/opener/b) ----------------
   The contents rail on the left (On this page, Figures, The chain) from the article's first line, beside one column of text:
   1. the opener: a kicker (the chapter, the stage and the card's verdict in the card's own words, "Extreme concentration ·
      Very hard to substitute"), the title, the standfirst (oneLiner), the facts line and the cite line (Link to chapter, Cite
      this chapter, Chapter PDF);
   2. the specimen, the chapter's first plate: a slot the live 3D drawing moves into while it is on screen (src/app.js
      Stage.host), and under it its plain caption (a mono label and the chapter's own specimenCaption) beside the parts list,
      where data/specimen-parts.json has one;
   3. In plain terms and In short;
   4. the prose: the lead, then the chokepoint card, the chapter's first table (withCard), then the sections, the flashcards,
      the sources and the door to the next chapter.
   The head keeps its class (.chapter-head) and the prose stays the article's own child, which the search index and the print
   path read (src/app.js Tools, src/modules/print.js). The title is the page's h1 since each chapter has a page of its own (28
   Oct 2026; it was an h2 under the home page's views), and its styles go by its class, so it looks as it did; the sections
   keep their levels (h3, h4), which the styles and the print path read. */
// the chapters whose drawing carries numbered parts (the owner's decision of 25 Oct 2026: Lithography only for now). The file is
// keyed by chapter id; each part has its number, its name, either its maker or the stage that covers it, and the points on the
// specimen its balloon points at ("at", in the specimen's own units, as specimens/<name>.js draws it)
const specimenParts = readJSON(path.join(root, 'data', 'specimen-parts.json'), {});
// each chapter's still of its specimen (qa/redesign/stills.js; [width, height] at twice the pixels shown), for the door that
// leads to the chapter
const stillSizes = readJSON(path.join(root, 'build', 'assets', 'specimens', 'stills.json'), {});
const partsOf = (ch) => { const e = specimenParts[ch.id]; return e && Array.isArray(e.parts) ? e.parts : []; };
const chapterById = (id) => chapters.find((c) => c.id === id) || (geo && geo.id === id ? geo : null);
function partsHTML(ch) {
  const ps = partsOf(ch);
  if (!ps.length) return '';
  const e = specimenParts[ch.id];
  if (e.specimen && e.specimen !== (ch.meta.specimen || '')) warn(`specimen-parts: ${ch.id} lists parts for ${e.specimen}, but the chapter shows ${ch.meta.specimen}`);
  const line = (p) => {
    if (p.stage) {
      const c = chapterById(p.stage), si = stages.findIndex((x) => x.id === p.stage);
      if (!c) { warn(`specimen-parts: ${ch.id} part ${p.n} names no chapter ${p.stage}`); return esc(p.name); }
      return `${esc(p.name)}: <a href="${esc(c.id)}/" data-route="#${esc(c.id)}">see stage ${pad(si >= 0 ? si + 1 : c.number)}, ${esc(c.title)}</a>`;
    }
    return `${esc(p.name)}: ${esc(p.maker || '')}`;
  };
  return `<p class="ch-parts-k">Parts, as numbered on the drawing</p><ol class="ch-parts">${ps.map((p) => `<li><b aria-hidden="true">${+p.n}</b><span>${line(p)}</span></li>`).join('')}</ol>`;
}
// the card's verdict in the kicker: the band's meter (four bars, as the home's list draws it), then both ratings in the words
// the card's look-up heads use, "Extreme concentration · Very hard to substitute"
const bandMark = (b, sub) => (b ? `<span class="ch-band ch-verdict" data-band="${BANDS[b] || 0}">${meterHTML(b)}<span>${esc(b)} concentration</span>${sub ? `<span class="sep" aria-hidden="true">·</span><span>${esc(SUBWORD[sub] || sub)}</span>` : ''}</span>` : '');
const TILE_WORD = { 'component-costs': 'The economics', geopolitics: 'The contest' }; // the second item of the kicker for the two chapters that are not stages
// the contents rail: the chapter's sections, its figures by number, and the chain (the stages with their meters, the
// current one in wine, then the two chapters that look across them). Under 1200 px only On this page shows, as a line of links
function railHTML(ch, stageIdx, toc) {
  const figs = ch.figList || [];
  const item = (c, i) => {
    const b = (c.meta.card || {}).concentration || '', cur = c.id === ch.id;
    return `<li class="stage-cell"${i != null ? ` data-band="${BANDS[b] || 0}"` : ''}${cur ? ' aria-current="true"' : ''}><a href="${esc(c.id)}/" data-route="#${esc(c.id)}" aria-label="${pad(c.number)} ${esc(c.title)}${b && i != null ? ', ' + esc(b) : ''}"${cur ? ' aria-current="page"' : ''}><span class="n">${pad(c.number)}</span><span class="t">${esc(c.title)}</span>${i != null ? meterHTML(b) : ''}</a></li>`;
  };
  const across = chapters.filter((c) => !isStage(c)).concat(geo ? [geo] : []);
  return `<nav class="ch-rail ch-ledger" aria-label="${esc(ch.title)}: contents">`
    // the chapter's number and stage, for paper only (src/modules/print.css sets it in the ledger column)
    + `<div class="ch-tile print-only"><span class="k">Chapter</span><span class="v">${pad(ch.number)}</span><span class="of">${stageIdx >= 0 ? `Stage ${stageIdx + 1} of ${stages.length}` : esc(TILE_WORD[ch.id] || '')}</span></div>`
    // the three parts sit in one box, which the reader can hide (RAIL_TOGGLE_JS adds Hide contents to its first line)
    + `<div class="rail-body" id="${esc(ch.id)}--rail">`
    + `<div class="rail-part rail-on"><p class="rail-k">On this page</p><ol class="rail-toc">${toc.map(([id, t]) => `<li><a href="#${esc(id)}">${t}</a></li>`).join('')}</ol></div>`
    + (figs.length ? `<div class="rail-part rail-figs-w"><p class="rail-k">Figures</p><ol class="rail-figs">${figs.map((f) => `<li><a href="#${esc(f.id)}"><span class="n">${esc(f.num)}</span><span class="t">${esc(f.label)}</span></a></li>`).join('')}</ol></div>` : '')
    + `<div class="rail-part rail-chain-w"><p class="rail-k">The chain</p>`
    + `<ol class="chain-track rail-chain">${stages.map((c, i) => item(c, i)).join('')}</ol>`
    + (across.length ? `<ol class="rail-chain rail-across">${across.map((c) => item(c, null)).join('')}</ol>` : '') + `</div></div></nav>`;
}
// The annotated still a chapter whose drawing carries numbered parts prints in place of the live drawing (src/modules/print.js
// stills): the picture with its balloons, drawn by build/modules/social.js stillSVG as the readable page drew it. It waits in a
// <template>, which the screen never shows or fetches, since 28 Oct 2026, when the readable page it was fetched from went
const stillSVG = require('./modules/social.js').stillSVG;
function printStill(ch) {
  const pe = specimenParts[ch.id], ps = partsOf(ch), m = ch.meta;
  if (!pe || !pe.still || !ps.length) return '';
  return `<template class="cp-still-src">${stillSVG(pe.still, ps, m.specimenCaption ? m.specimenCaption.split('. ')[0] : ch.title)}</template>`;
}
function chapterHTML(ch) {
  const m = ch.meta, mins = Math.max(1, Math.round(ch.words / 230));
  const specimen = m.specimen || (ch.id === 'geopolitics' ? 'globe' : 'wafer');
  const parts = splitTakeaways(ch.html);
  const pb = plainBox(parts.body, m.plain, { id: ch.id, cites: ch.cites, figures: [] });
  ch.inShort = parts.inShort;
  // each source has an address of its own (<chapter>--source-<n>, n its footnote number), and the list opens with the key to
  // its tier marks (28 Oct 2026)
  const sources = ch.cites.length ? `<details class="chapter-sources" id="${esc(ch.id)}--sources"><summary>Sources (${ch.cites.length})</summary>${SOURCE_KEY}<ol>${ch.cites.map((c, i) => `<li id="${esc(ch.id)}--source-${i + 1}">${tierTag(c.url)}${sourceLine(c.url)}</li>`).join('')}</ol></details>` : '';
  const stageIdx = stages.findIndex((c) => c.id === ch.id);
  const conc = stageIdx >= 0 ? (m.card || {}).concentration || '' : '';
  const where = stageIdx >= 0 ? ch.title : ''; // the card names its stage; the kicker above gives its number (28 Oct 2026)
  const cardCtx = { id: ch.id, cites: ch.cites, figures: [] }; // the card's marks number with the body's (its urls were registered in reading order)
  // the card has an address of its own (On this page lists it), and stands in the text after the lead (withCard)
  const cardId = (h) => h.replace('<section class="plate"', `<section class="plate" id="${esc(ch.id)}--card"`);
  const plate = isStage(ch) ? cardId(nameplate(m.card, ch.title, null, cardCtx, where)) : '';
  // the same pieces, kept on the chapter (its minutes for the chapter page's JSON-LD, build/modules/social.js); the prose is the
  // copy before glossary buttons, with the card in its place after the lead
  ch.rendered = { plain: pb.box, inShort: parts.inShort, plate, prose: withCard(pb.html, plate), mins, parts: partsHTML(ch) };
  // the main page's blocks (In plain terms, In short, the card's prose) each mark the first use of each glossary term in them
  const cardUsed = new Set();
  const plateGl = isStage(ch) ? cardId(nameplate(m.card, ch.title, (h) => glossaryWrap(h, cardUsed), cardCtx, where)) : '';
  // one numbering (28 Oct 2026): a stage is "Stage 4 of 14" (its chapter number is the same, so "Chapter 04" went); the two
  // chapters across the chain keep their chapter number and their word
  const kick = `<p class="ch-kick">${stageIdx >= 0 ? `<span>Stage ${stageIdx + 1} of ${stages.length}</span>` : `<span>Chapter ${pad(ch.number)}</span><span>${esc(TILE_WORD[ch.id] || '')}</span>`}${bandMark(conc, ((m.card || {}).substitutability || {}).band)}</p>`;
  const facts = `<p class="ch-meta"><span class="label">${ch.words.toLocaleString('en-US')} words / ${mins} min</span><span class="label">Specimen: ${esc(SPECIMEN_NAME[specimen] || specimen.replace(/-/g, ' '))}</span><span class="label">Updated ${CITE_DAY(ch.id)}</span>${ch.cites.length ? `<span class="label">${ch.cites.length} sources</span>` : ''}</p>`;
  // the specimen's slot and its caption; the two chapters that are not stages set their drawing on the night ground (data-night)
  const ps = partsOf(ch), night = !isStage(ch);
  const spec = `<figure class="ch-spec"${night ? ' data-night="1"' : ''}${ps.length ? ` data-parts="${esc(JSON.stringify(ps.map((p) => ({ n: +p.n, name: p.name, at: p.at || [] }))))}"` : ''}>`
    + `<div class="ch-spec-draw"></div>`
    + `<figcaption class="ch-spec-cap${ch.rendered.parts ? ' has-parts' : ''}"><span class="label">Specimen ${pad(ch.number)} · ${esc(ch.title)}</span>${m.specimenCaption ? `<p>${esc(m.specimenCaption)}</p>` : ''}${ch.rendered.parts}</figcaption>${printStill(ch)}</figure>`;
  // On this page: In plain terms, the chokepoint card, the chapter's own sections, the flashcards and the sources
  const fc = flashcards[ch.id], hasDeck = fc && Array.isArray(fc.cards) && fc.cards.length;
  const toc = (m.plain ? [[`${ch.id}--plain`, 'In plain terms']] : []).concat(plate ? [[`${ch.id}--card`, 'Chokepoint card']] : []).concat((ch.headings || []).map((h) => [h.id, inline(h.text, { id: ch.id, cites: [], figures: [] }).replace(/<sup[\s\S]*?<\/sup>/g, '')]))
    .concat(hasDeck ? [[`${ch.id}--flashcards`, 'Flashcards']] : []).concat(ch.cites.length ? [[`${ch.id}--sources`, 'Sources']] : []);
  return `<article class="chapter" id="${esc(ch.id)}" data-specimen="${esc(specimen)}" data-number="${pad(ch.number)}" data-title="${esc(ch.title)}" data-caption="${esc(m.specimenCaption || '')}">
<header class="chapter-head">
<div class="ch-open">${kick}<h1 class="ch-title${ch.title.length > 16 ? ' is-long' : ''}"><span class="sr-only">Chapter ${ch.number}: </span>${esc(ch.title)}</h1>${m.oneLiner ? `<p class="ch-lede">${esc(m.oneLiner)}</p>` : ''}<div class="ch-omet">${facts}${citeBlock(ch, CITE_DAY(ch.id), copyLink(ch.id))}</div></div>
${spec}
${glPlain(pb.box)}
${parts.inShort ? `<section class="inshort"><h3 class="label">In short</h3>${glossaryWrap(parts.inShort)}</section>` : ''}
</header>
${railHTML(ch, stageIdx, toc)}
<div class="prose">${withCard(glossaryWrap(pb.html), plateGl)}${reviewHTML(ch)}${sources}${prevNext(ch)}</div>
</article>`;
}
// each chapter's article, by id: on its own page alone, and all of them in the book (the pages, below)
const articleOf = new Map(chapters.map((c) => [c.id, chapterHTML(c)]));
const chaptersHTML = chapters.length ? chapters.map((c) => articleOf.get(c.id)).join('\n') : `<article class="chapter" id="placeholder" data-specimen="wafer" data-number="01" data-title="Placeholder"><header class="chapter-head"><div class="chapter-num">01</div><h2 class="chapter-title">No chapters yet</h2></header><div class="prose"><p>No chapters found. This is a shell build.</p></div></article>`;

/* The Chain's contents page (design round eight, option 3 "clean", chosen by the owner on 28 Oct 2026; MAIN/qa/design8/b/
   b1-clean.html, its builder src/build_clean.py and the "B1 clean" section of its notes.md). Under the head (src/template.html
   .howto: the title with the three downloads, and one sentence that is also the key, chainStandfirst below) one row per
   chapter: its drawing in a fixed box on the page's ground, its number with the band's mark, its title, and its one line in
   quieter ink. The stages run in two columns, the first half on the left (one column on a phone); the two chapters across
   the chain follow as the same rows under a small label. src/modules/contents.css lays it out.
   The rows are the list the book PDF reads (.contents-grid .item, .n and .t with href="#<id>", src/modules/print.css, which
   turns them into its contents with page numbers). The drawings and the label are not printed, and the group heads that only
   the book prints (.print-only) stand where the label is on screen. Every count comes from the chapters. */
// the band's mark, one per stage: a solid bar for Extreme (wine), an outline for High
const bandOf = (ch) => ((ch.meta && ch.meta.card) || {}).concentration || '';
const contentsMark = (band) => (band === 'Extreme' || band === 'High' ? `<i class="ct-bmk${band === 'High' ? ' h' : ''}" aria-hidden="true"></i>` : '');
const stageIds = new Set(stages.map((c) => c.id));
const acrossChapters = chapters.filter((c) => !stageIds.has(c.id)).concat(geo ? [geo] : []);
// the drawings: each stage's still, trimmed, evened in size and tone, and the two chapters across the chain turned to the
// day side (python3 build/line-stills.py writes build/assets/line/), copied to dist/media/line-<id>.webp. wt is the share
// of the row's box a drawing fills
const LINE_DIR = path.join(root, 'build', 'assets', 'line');
const lineStills = readJSON(path.join(LINE_DIR, 'line.json'), {});
{
  const parts = readJSON(path.join(root, 'data', 'specimen-parts.json'), {});
  const stale = [], missing = [];
  stages.concat(acrossChapters).forEach((c) => {
    const s = lineStills[c.id], file = path.join(LINE_DIR, c.id + '.webp');
    if (!s || !fs.existsSync(file)) { missing.push(c.id); return; }
    const from = path.join(root, 'build', 'assets', 'specimens', (((parts[c.id] || {}).still || {}).file) || c.id + '.webp');
    if (fs.existsSync(from) && require('crypto').createHash('sha256').update(fs.readFileSync(from)).digest('hex').slice(0, 16) !== s.src) stale.push(c.id);
    fs.mkdirSync(path.join(root, 'dist', 'media'), { recursive: true });
    fs.copyFileSync(file, path.join(root, 'dist', 'media', `line-${c.id}.webp`));
  });
  if (missing.length) warn(`The Chain's contents: no drawing for ${missing.join(', ')} in build/assets/line/ (run python3 build/line-stills.py)`);
  if (stale.length) warn(`The Chain's contents: the specimen still of ${stale.join(', ')} changed since its drawing was made (run python3 build/line-stills.py)`);
}
// a row: the drawing, the number with the mark, the title (the link, which covers the row) and the chapter's one line
const contentsItem = (ch) => {
  const b = bandOf(ch), s = lineStills[ch.id];
  const img = s ? `<img src="media/line-${esc(ch.id)}.webp" width="${s.w}" height="${s.h}" alt="" loading="lazy" decoding="async" style="--w:${s.wt}%">` : '';
  return `<li class="item" data-ch="${esc(ch.id)}"><span class="ct-tile">${img}</span><span class="n">${pad(ch.number)}${contentsMark(b)}</span>`
    + `<a class="t" href="#${esc(ch.id)}" aria-label="${pad(ch.number)} ${esc(ch.title)}${b ? `, ${esc(b)} concentration` : ''}">${esc(ch.title)}</a>`
    + `${ch.meta.oneLiner ? `<p class="ol">${esc(ch.meta.oneLiner)}</p>` : ''}</li>`;
};
const contentsHTML = (() => {
  const n = stages.length, half = Math.ceil(n / 2);
  const col = (list, from) => `<ol class="contents-grid ct-col"${from > 1 ? ` start="${from}"` : ''}>${list.map(contentsItem).join('')}</ol>`;
  const note = `These ${word(acrossChapters.length)} chapters are not stages. They look across all ${word(n)}, at what a chip costs and at the contest over who controls each stage.`;
  // the book's own heads (print only): the stages with the key, then Across the chain with its note
  const bookK = `<div class="contents-kr print-only"><h3 class="contents-k">The ${word(n)} stages of the chain</h3><p class="ct-key"><span><i class="ct-bmk"></i>Extreme</span><span><i class="ct-bmk h"></i>High</span></p></div>`;
  const list = `<section class="ct-st" aria-label="The ${word(n)} stages">${col(stages.slice(0, half), 1)}${col(stages.slice(half), half + 1)}</section>`;
  const xlist = acrossChapters.length ? `<section class="ct-x" aria-labelledby="ct-xk"><h3 class="ct-xk" id="ct-xk">Across the chain</h3>`
    + `<div class="print-only"><h3 class="contents-k">Across the chain</h3><p class="contents-note">${note}</p></div>`
    + `<div class="ct-st">${acrossChapters.map((c, i) => col([c], n + i + 1)).join('')}</div></section>` : '';
  return bookK + list + xlist;
})();
/* The standfirst, one sentence that is also the key: how many stages are rated Extreme and what that means, as the home page
   says it (build/modules/walk.js, from the card's own note), and the rest High, with each band's mark before its word. The
   counts come from the chapters' cards. The printed contents keep their own standfirst (src/template.html .howto-lede) */
const chainStandfirst = (() => {
  const nX = stages.filter((c) => bandOf(c) === 'Extreme').length, nH = stages.filter((c) => bandOf(c) === 'High').length;
  // "Three or fewer firms could supply this stage today, or one firm holds more than half of it." follows "meaning"
  const xNote = String(BAND_NOTE.Extreme || ''), hNote = String(BAND_NOTE.High || '');
  const xMeaning = /this stage/.test(xNote) ? xNote.replace('this stage', 'each').replace(/ of it\.$/, '.').replace(/\.$/, '').replace(/^\w/, (m) => m.toLowerCase()) : '';
  // "Four to six firms could supply this stage today, ..." gives "four to six could"
  const hm = /^(.+?) firms could supply this stage/.exec(hNote), hMeaning = hm ? `${hm[1].toLowerCase()} could` : '';
  const mark = (b) => `${contentsMark(b)}${b}`;
  const x = `${nX} of the ${stages.length} stages are rated ${mark('Extreme')}${xMeaning ? `, meaning ${esc(xMeaning)}` : ' concentration'}`;
  const h = nH ? `${nX + nH === stages.length ? 'the other' : ''} ${nH} ${mark('High')}${hMeaning ? `, meaning ${esc(hMeaning)}` : ''}`.trim() : '';
  return nX ? `${x}${h ? `, and ${h}` : ''}.` : '';
})();
const thesisHTML = 'How AI chips are made';
const subtitleHTML = 'Every stage of the supply chain, and who controls it.';

/* ---------------- data ---------------- */
function readJSONSafe(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } }
const landscape = readJSON(path.join(root, 'data', 'landscape.json'), []);
// per-chip package layouts live in their own file so the specimen designers and the data editors never touch the same JSON
const landscapeLayouts = readJSONSafe(path.join(root, 'data', 'landscape-layouts.json')) || {};
landscape.forEach((c) => { if (landscapeLayouts[c.id]) c.layout = landscapeLayouts[c.id]; }); // the researched layouts file wins over the inline field
// AI Chips starting points: the empty page's pairs and each chip's "Try with" partners (editorial, no figures); every id must name a chip
const landscapeCompareRaw = readJSONSafe(path.join(root, 'data', 'landscape-compare.json')) || {};
const landscapeCompare = { pairs: landscapeCompareRaw.pairs || [], with: landscapeCompareRaw.with || {} };
{
  const chipIds = new Set(landscape.map((c) => c.id));
  landscapeCompare.pairs.forEach((p) => (p.ids || []).forEach((id) => { if (!chipIds.has(id)) warn('landscape-compare: pair "' + p.label + '" names no chip ' + id); }));
  Object.keys(landscapeCompare.with).forEach((k) => [k].concat(landscapeCompare.with[k]).forEach((id) => { if (!chipIds.has(id)) warn('landscape-compare: with.' + k + ' names no chip ' + id); }));
  landscape.forEach((c) => { if (!landscapeCompare.with[c.id]) warn('landscape-compare: no partners for ' + c.id); });
}
const suppliers = readJSON(path.join(root, 'data', 'suppliers.json'), []);
const timeline = readJSON(path.join(root, 'data', 'export-controls-timeline.json'), []);
const matrix = readJSON(path.join(root, 'data', 'chokepoint-matrix.json'), []);
// landscape notes: "## <heading>" blocks matched to chips by id or name
const landscapeNotes = {};
const notesSrc = read(path.join(root, 'data', 'landscape-notes.md'));
if (notesSrc && landscape.length) {
  const blocks = notesSrc.split(/^##\s+/m).slice(1);
  for (const b of blocks) {
    const nl = b.indexOf('\n'); const head = b.slice(0, nl).trim().toLowerCase(); const text = b.slice(nl + 1).trim();
    const chip = landscape.find((c) => head.includes(c.id) || head.includes(c.name.toLowerCase()))
      || landscape.find((c) => !landscapeNotes[c.id] && c.family && head.includes(c.family.toLowerCase()) && head.includes(c.vendor.toLowerCase()));
    if (chip) { const ctx = { id: 'landscape-' + chip.id, cites: [], figures: [] }; landscapeNotes[chip.id] = markdown(text, ctx).html; }
  }
  const missing = landscape.filter((c) => !landscapeNotes[c.id]).map((c) => c.id);
  if (missing.length) warn('landscape notes missing for: ' + missing.join(', '));
}
const matrixNotes = read(path.join(root, 'data', 'chokepoint-matrix-notes.md'));
const controls = readJSON(path.join(root, 'data', 'control-thresholds.json'), []);
const flows = readJSON(path.join(root, 'data', 'control-flows.json'), null); // the nine things that move across the chokepoint, with dated states (may not exist yet)
const exposure = readJSON(path.join(root, 'data', 'exposure.json'), []);
const controlsNotes = read(path.join(root, 'data', 'control-thresholds-notes.md'));
const exposureNotes = read(path.join(root, 'data', 'exposure-notes.md'));
// the China revenue panel joined to the supplier list by build/exposure.js (aliases, divisions, slugs, labels), so src/app.js needs no name logic
const exposureJoin = require('./exposure.js').exposureIndex(exposure), exSlug = require('./exposure.js').slug;
/* ---------------- China exposure: one bar chart per firm, China's share of revenue by fiscal year (static SVG; app.js adds the tooltips) ---------------- */
function exposureViz(rows) {
  const ok = rows.filter((r) => r.chinaShare != null && r.fyEnd);
  if (!ok.length) return '';
  const byFirm = {};
  ok.forEach((r) => { (byFirm[r.firm] = byFirm[r.firm] || []).push(r); });
  const tx = (fy) => { const [y, m] = fy.split('-').map(Number); return y + (m - 0.5) / 12; };
  // the toolmakers first, front end to back end, then materials, the chipmakers and design software; a category the data adds
  // later goes after these in alphabetical order, and the sort keeps each category's firms together under its one heading
  const CAT_ORDER = ['Lithography', 'Deposition', 'Etch', 'Process Control', 'Metrology', 'Packaging', 'Assembly', 'Test', 'Photomask', 'Materials', 'Chemicals', 'Foundry', 'Memory', 'AI Accelerator Vendor', 'EDA'];
  const catRank = (c) => { const i = CAT_ORDER.findIndex((k) => String(c || '').toLowerCase().includes(k.toLowerCase())); return i < 0 ? CAT_ORDER.length : i; };
  // a long name squeezes its caption into four lines; the chart shows the firm's own short name, and the full one on hover
  const SHOWN = { 'BE Semiconductor Industries': 'Besi' };
  // how a firm counts China, as one word for the chart; the same reading as the table's labels in src/app.js (basisShort)
  const basisWord = (b) => { b = String(b || '').toLowerCase(); if (!b) return ''; if (/ship-to|ship to|destination|fab\)/.test(b)) return 'ship-to'; if (/bill|invoice/.test(b)) return 'billing'; if (/headquarters/.test(b)) return 'headquarters'; if (/seat|licen/.test(b)) return 'seats'; if (/used|usage/.test(b)) return 'use'; if (/own operating|operating units|own units/.test(b)) return 'own units'; return 'customer'; };
  const firms = Object.keys(byFirm).map((f) => {
    const rs = byFirm[f].slice().sort((a, b) => tx(a.fyEnd) - tx(b.fyEnd));
    // a firm can change how it counts China between years (Nvidia: billing location to FY2023, customer headquarters from FY2024);
    // the dashed line marks where the counting changed; the garnet bar is always the highest year shown
    const breaks = rs.map((r, i) => i).filter((i) => i && basisWord(rs[i].basis) !== basisWord(rs[i - 1].basis));
    const peak = rs.reduce((m, r) => (r.chinaShare > m.chinaShare ? r : m), rs[0]);
    return { firm: f, rows: rs, first: rs[0], last: rs[rs.length - 1], peak, breaks, meta: rs[0], hasMoney: rs.every((r) => r.chinaRevenue != null) };
  }).sort((a, b) => catRank(a.meta.category) - catRank(b.meta.category) || String(a.meta.category || '').localeCompare(String(b.meta.category || '')) || b.last.chinaShare - a.last.chinaShare || a.firm.localeCompare(b.firm));
  const anyBreak = firms.some((f) => f.breaks.length);
  // a bar stands for a whole fiscal year, so it is centered on the middle of that year (six months before it ends); the rule lines
  // then fall inside the year in which each rule came
  const mid = (fy) => tx(fy) - 0.5;
  // one time axis for every panel, widened only when a firm files a year outside it, so no bar falls off the edge
  const mids = ok.map((r) => mid(r.fyEnd));
  const T0 = Math.min(2020.2, Math.min(...mids) - 0.34), T1 = Math.max(2026.3, Math.max(...mids) + 0.34);
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // a fiscal year that does not end in December is named by its end month, so firms whose years end in March are not read as calendar years
  const fyName = (r) => { const [y, m] = String(r.fyEnd).split('-').map(Number); return m === 12 ? r.fiscalYear : `year to ${MON[m - 1]} ${y}`; };
  const rules = [[tx('2022-10'), 'Oct 2022'], [tx('2023-10'), 'Oct 2023'], [tx('2024-12'), 'Dec 2024']];
  const pct = (v) => (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10) + '%';
  const unit = (cur) => { const c = String(cur || '').toUpperCase(); if (c.startsWith('USD')) return ['$', 'bn', 1000]; if (c.startsWith('EUR')) return ['€', 'bn', 1000]; if (c.startsWith('JPY')) return ['¥', 'bn', 1000]; if (c.startsWith('KRW')) return ['₩', 'tn', 1000000]; return [c.split(' ')[0] + ' ', 'm', 1]; };
  const money = (v, cur) => { const [sym, suf, div] = unit(cur); const n = v / div; return sym + (n >= 100 ? Math.round(n) : n >= 10 ? Math.round(n * 10) / 10 : Math.round(n * 100) / 100) + suf; };
  const attrs = (r) => `data-firm="${esc(r.firm)}" data-fy="${esc(r.fiscalYear)}" data-share="${r.chinaShare}" data-china="${r.chinaRevenue != null ? r.chinaRevenue : ''}" data-total="${r.totalRevenue != null ? r.totalRevenue : ''}" data-cur="${esc(r.currency || '')}" data-basis="${esc(r.basis || '')}"`;
  // one panel per firm: bars of China's share of revenue by fiscal year on a shared 0 to 60% scale, the peak year in garnet
  // (the scale runs higher, in steps of 20, only if a share on file passes 60%)
  const YMAX = Math.max(60, Math.ceil(Math.max(...ok.map((r) => r.chinaShare)) / 20) * 20);
  const PW = 240, PH = 122, px0 = 10, px1 = 232, py0 = 18, py1 = 98;
  const X = (t) => px0 + ((t - T0) / (T1 - T0)) * (px1 - px0), Y = (v) => py1 - (Math.min(v, YMAX) / YMAX) * (py1 - py0);
  let d = `<div class="ex-legend"><span><i class="lg-bar"></i>China's share of the firm's revenue, by fiscal year</span><span><i class="lg-top"></i>The year it peaked</span><span><i class="lg-rule"></i>US export rules of Oct 2022, Oct 2023 and Dec 2024</span>${anyBreak ? `<span><svg width="8" height="12" viewBox="0 0 8 12" aria-hidden="true" style="vertical-align:middle;margin-right:7px"><line x1="4" y1="0" x2="4" y2="12" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3 2"/></svg>The firm changed how it counts China</span>` : ''}<span>Same scale on every panel, 0 to ${YMAX}%</span></div><div class="ex-grid">`;
  // each category is a group as wide as its panels (--n), so the grid can set small categories side by side (src/styles.css);
  // every bar prints its value, so the panels carry no gridlines
  const nIn = {}; firms.forEach((f) => { const c = f.meta.category || ''; nIn[c] = (nIn[c] || 0) + 1; });
  let lastCat = null;
  firms.forEach((f) => {
    const cat = f.meta.category || '';
    if (cat !== lastCat) { d += `${lastCat === null ? '' : '</div>'}<div class="ex-group" style="--n:${nIn[cat]}"><h4 class="ex-cat">${esc(cat)}</h4>`; lastCat = cat; }
    const changes = f.breaks.map((i) => `${basisWord(f.rows[i - 1].basis)} to ${f.rows[i - 1].fiscalYear}, ${basisWord(f.rows[i].basis)} from ${f.rows[i].fiscalYear}`).join('; ');
    // each chart has its own address, #/exposure/<slug> (build/exposure.js names the slug); the router scrolls to the id and focuses the figure
    let s = `<figure class="ex-panel" id="ex-${esc(exSlug(f.firm))}" tabindex="-1"><figcaption><b${SHOWN[f.firm] ? ` title="${esc(f.firm)}"` : ''}>${esc(SHOWN[f.firm] || f.firm)}</b><span${changes ? ` title="Counted by ${esc(changes)}."` : ''}>${f.meta.country ? esc(f.meta.country) + ' · ' : ''}peak ${pct(f.peak.chinaShare)} in ${esc(fyName(f.peak))}</span></figcaption>`;
    s += `<svg viewBox="0 0 ${PW} ${PH}" role="group" aria-label="${esc(f.firm)}: China share of revenue by fiscal year, ${esc(f.first.fiscalYear)} to ${esc(f.last.fiscalYear)}${changes ? `, counted by ${esc(changes)}` : ''}">`;
    rules.forEach((r) => { s += `<line x1="${X(r[0]).toFixed(1)}" y1="${py0 - 8}" x2="${X(r[0]).toFixed(1)}" y2="${py1}" class="rule"/>`; });
    s += `<line x1="${px0}" y1="${py1}" x2="${px1}" y2="${py1}" class="axis"/>`;
    const n = f.rows.length, slot = (px1 - px0) / Math.max(n, 5), bw = Math.min(26, slot * 0.62);
    f.rows.forEach((r) => {
      const cx = X(mid(r.fyEnd)), y = Y(r.chinaShare), h = py1 - y, isTop = r === f.peak;
      s += `<a href="${safeUrl(r.source || '#')}" target="_blank" rel="noopener" aria-label="${esc(f.firm)} ${esc(r.fiscalYear)}: ${pct(r.chinaShare)} of revenue from China, opens the filing"><rect x="${(cx - bw / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" class="bar${isTop ? ' top' : ''}" ${attrs(r)}/></a>`;
      s += `<text x="${cx.toFixed(1)}" y="${(y - 4).toFixed(1)}" class="share${isTop ? ' top' : ''}" text-anchor="middle">${pct(r.chinaShare)}</text>`;
    });
    // a change of counting basis: a dashed line between the two years, the old basis named to its left and the new to its right
    f.breaks.forEach((i) => {
      const bx = (X(mid(f.rows[i - 1].fyEnd)) + X(mid(f.rows[i].fyEnd))) / 2, was = basisWord(f.rows[i - 1].basis), now = basisWord(f.rows[i].basis), cw = 6.1;
      s += `<line x1="${bx.toFixed(1)}" y1="${py0 - 8}" x2="${bx.toFixed(1)}" y2="${py1}" class="line basis" stroke-dasharray="3 2"/>`;
      s += `<text x="${Math.max(2 + was.length * cw, bx - 3).toFixed(1)}" y="${py0 - 10}" class="tick" text-anchor="end">${esc(was)}</text>`;
      s += `<text x="${Math.min(PW - 2 - now.length * cw, bx + 3).toFixed(1)}" y="${py0 - 10}" class="tick">${esc(now)}</text>`;
    });
    s += `<text x="${px0}" y="${PH - 4}" class="tick">${esc(f.first.fiscalYear)}</text><text x="${px1}" y="${PH - 4}" class="tick" text-anchor="end">${esc(f.last.fiscalYear)}</text></svg></figure>`;
    d += s;
  });
  return d + (lastCat === null ? '' : '</div>') + '</div>';
}


/* ---------------- geopolitics view ---------------- */
let geoArticle = '', geoDek = 'Who holds each chokepoint, how the export-control campaign has unfolded since 2018, and where the chips go.';
// the essay, the last chapter, is drawn by the same chapterHTML as the others (redesign stage 2): the opener, its specimen on the night ground and
// the rail; it has no card, being no stage
if (geo) { geoDek = geo.meta.oneLiner || geoDek; geoArticle = chapterHTML(geo); articleOf.set(geo.id, geoArticle); }

/* ---------------- sources view ---------------- */
const all = chapters.concat(geo ? [geo] : []);
const sourcesHTML = `<div class="tier-key"><span class="tier tier-A">A</span> primary or institutional: company filings and investor materials, governments and regulators, standards bodies, universities and national labs, and research institutions that publish their methods. <span class="tier tier-B">B</span> four named exceptions: SemiAnalysis, Reuters, the Financial Times and Nikkei Asia. Nothing else is cited.</div>` +
  all.map((ch) => { const tc = tierCounts(ch.cites); return `<h3>${pad(ch.number)} · ${esc(ch.title)} <span class="label">${ch.cites.length} sources · A ${tc.A} · B ${tc.B}${tc.C + tc.D ? ' · disallowed ' + (tc.C + tc.D) : ''}${tc['?'] ? ' · unclassified ' + tc['?'] : ''}</span></h3><ol>${ch.cites.map((c) => `<li>${tierTag(c.url)}${sourceLine(c.url)}</li>`).join('')}</ol>`; }).join('');

/* ---------------- briefing (all the "in short" blocks on one page) ---------------- */
const briefingHTML = all.map((ch) => {
  const c = ch.meta.card || {};
  const leaders = (c.leaders || []).slice(0, 3).map((l) => `${esc(l.name)}${l.country ? ` <span class="chip">${esc(l.country)}</span>` : ''}`).join(' · ');
  const href = ch.id === 'geopolitics' ? '#geopolitics' : `#${esc(ch.id)}`;
  return `<article class="brief-card" id="brief-${esc(ch.id)}">
<div class="brief-head"><span class="n">${pad(ch.number)}</span><a href="${href}" class="t">${esc(ch.title)}</a>
<span class="brief-meta">${c.concentration ? `<span class="conc ${esc(c.concentration)}">${esc(c.concentration)}</span>` : ''}</span></div>
${ch.meta.oneLiner ? `<p class="brief-lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${ch.inShort ? `<div class="brief-short">${ch.inShort.replace(/<sup class="cite">[\s\S]*?<\/sup>/g, '').replace(/\s+([.,;:])/g, '$1')}</div>` : ''}
${leaders ? `<p class="brief-leaders"><span class="label">Who leads</span> ${leaders}</p>` : ''}
</article>`;
}).join('');

/* ---------------- glossary ---------------- */
const chapterTitle = (id) => { const c = all.find((x) => x.id === id); return c ? c.title : null; };
const glossaryHTML = glossary.length ? glossary.slice().sort((a, b) => a.term.localeCompare(b.term)).map((g) => `<div class="gl-entry" id="gl-${esc(String(g.term).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}" data-term="${esc(String(g.term).toLowerCase())}" data-text="${esc((g.term + ' ' + (g.aka || '') + ' ' + g.plain + ' ' + (g.why || '')).toLowerCase())}">
<dt>${esc(g.term)}${g.aka ? `<span class="aka">${esc(g.aka)}</span>` : ''}</dt>
<dd><p>${esc(g.plain)}</p>${g.why ? `<p class="why">${esc(g.why)}</p>` : ''}${g.chapter && chapterTitle(g.chapter) ? `<a class="gl-link" href="${g.chapter === 'geopolitics' ? '#geopolitics' : '#' + esc(g.chapter)}">Read it in ${esc(chapterTitle(g.chapter))} →</a>` : ''}</dd>
</div>`).join('') : '<p>The glossary is not written yet.</p>';

/* ---------------- assemble ---------------- */
const totalWords = all.reduce((a, c) => a + c.words, 0);
const credits = `Made by <b><a href="https://www.linkedin.com/in/yashvardhan07/" target="_blank" rel="noopener">Yashvardhan Sharma</a></b> with Claude. Corrections and questions: <a href="mailto:contact@chipsupplychain.org">contact@chipsupplychain.org</a>.`;
const builtOn = new Date(); const builtStr = `${builtOn.getDate()} ${MONTHS[builtOn.getMonth()]} ${builtOn.getFullYear()}`;
const footer = `<p class="credits">${credits}<span class="updated">Updated ${builtStr}</span></p>`;

/* ---------------- page dates ----------------
   The day each page last changed. build/page-dates.json keeps, for each page, a hash of its content, the day that hash
   last changed and the day the page first appeared, so a rebuild that changes nothing leaves the dates, the footer's
   "Updated" day and the sitemap's lastmod alone. Days are local, like builtStr, so all three name the same day.
   Commit the file with the build: a fresh checkout (the deploy) then keeps the same dates.
   The rule: a page's date moves only when its words, figures or data change, never for markup, CSS or JS. So the hash is
   taken over what a reader reads (contentKey): <style> and <script> blocks, comments, every tag and all whitespace are
   dropped and entities decoded, keeping the text (figures are text: bar values, table cells, captions), the address of each
   outside link (a changed source counts) and each image's alt text. The main page adds DATA, the data its views draw from.
   A renamed class, a new wrapper, a CSS or JS edit or a reindented template leave every date alone. The day is written into
   a page through the DAY_TOKEN after hashing, never found by its text, so a figure dated the build day cannot hide a change.
   A PDF is hashed by its bytes. Entries hashed by the old whole-page rule ("hash", before 21 Oct 2026) take the new hash once
   and keep their day. */
const DAY_TOKEN = '{{DAY:UPDATED}}'; // has a colon, so the sweep of unfilled {{PLACEHOLDERS}} leaves it for the step after hashing
const ENTITY = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', shy: '' };
const contentKey = (html) => String(html)
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<\/?[a-zA-Z][^>]*>/g, (tag) => {
    const keep = [], href = /\shref=\\?"((?:https?|mailto):[^"\\]*)/i.exec(tag), alt = /\salt=\\?"([^"\\]+)/i.exec(tag);
    if (href) keep.push(href[1]); if (alt) keep.push(alt[1]);
    return ' ' + keep.join(' ') + ' ';
  })
  .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : +e.slice(1)) : ENTITY[e.toLowerCase()] != null ? ENTITY[e.toLowerCase()] : m))
  .replace(/[\s\u00ad\u200b\u2060]+/g, '');
const isoOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayStr = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const today = isoOf(builtOn);
const datesFile = path.join(root, 'build', 'page-dates.json');
const pageDates = readJSONSafe(datesFile) || {};
// the day a chapter first appeared: the commit that added its Markdown file, when git can say; asked once per page
const firstDay = (file) => {
  if (!file) return today;
  try {
    const out = require('child_process').execFileSync('git', ['log', '--follow', '--diff-filter=A', '--format=%as', '--', path.join('content', file)], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim().split('\n').pop();
    return /^\d{4}-\d\d-\d\d$/.test(out) ? out : today;
  } catch (e) { return today; }
};
// content: a page's HTML (hashed by contentKey) or a PDF's bytes (hashed as they are)
const pageDate = (key, content, file) => {
  const hash = require('crypto').createHash('sha256').update(Buffer.isBuffer(content) ? content : contentKey(content)).digest('hex').slice(0, 16);
  const e = pageDates[key] || (pageDates[key] = { published: firstDay(file) });
  if (e.content === undefined && e.hash && e.modified) e.content = hash; // the one-time switch from the whole-page hash
  delete e.hash;
  if (e.content !== hash) { e.content = hash; e.modified = today; }
  if (!e.published || e.published > e.modified) e.published = e.modified;
  e.seen = true;
  return e;
};

const footerKey = footer + `<p class="sources-key"><span class="tier tier-A">A</span> company filings, governments, standards bodies, universities and research institutions; <span class="tier tier-B">B</span> SemiAnalysis, Reuters, the Financial Times and Nikkei Asia.</p>`;
const suppliersIntro = suppliers.length ? `What each of the ${suppliers.length} firms makes, where it is based, and how hard it would be to replace.` : 'The supplier list is not compiled yet.';
// the four counts beside the Suppliers title, from the list itself: firms, the countries they are based in, the segments (the
// list's 20 categories) and the firms rated Critical, whose mark is the page's one red wine
const suppliersFacts = suppliers.length ? `<dl class="sup-facts-row">${[
  // "home countries": where the firms are based (the Glossary counts its country entries, a different number; 28 Oct 2026)
  [suppliers.length, 'firms'], [new Set(suppliers.map((r) => r.country)).size, 'home countries'], [new Set(suppliers.map((r) => r.category)).size, 'segments'],
  [suppliers.filter((r) => r.chokepoint === 'Critical').length, 'Critical']
].map(([n, k], i) => `<div><dt>${i === 3 ? '<i class="sup-mk" aria-hidden="true"></i>' : ''}${k}</dt><dd>${n}</dd></div>`).join('')}</dl>` : '';
// the Export Controls dek and the note under the China revenue charts, printed by the main page and by /export-controls/ (build/modules/reference-pages.js)
const exposureFirms = new Set(exposure.map((r) => r.firm)).size;
const controlsDek = `The main rules since 2018, what can still be sold to China, and China's share of revenue at ${exposureFirms} firms, from their filings.`;
const exposureNote = exposure.length ? `The charts cover ${exposureFirms} firms, each of which gives a figure for China in its own filings. Other firms are not shown, and some, such as Lasertec, AGC and Axcelis, give no China figure. Each share is computed from the revenue amounts the firm filed, except Nova's, which its filings give only as a rounded percentage. Firms count China differently, for example by where the goods ship, where they are billed, or where the customer is based. Fiscal years are labeled by the calendar year in which they end.` : '';

const kit = read(path.join(root, 'src', 'kit.js')) || '';
const specDir = path.join(root, 'specimens');
// the specimens share one file with the kit (dist/assets/kit.js, below). Each keeps its own try, so one that throws as it
// loads leaves the others drawing; and each is parsed here first, so one with a syntax error, which a try cannot catch in a
// shared file, is left out with a warning rather than stopping the file (each had a <script> of its own until 28 Oct 2026)
const specimens = fs.existsSync(specDir) ? fs.readdirSync(specDir).filter((f) => f.endsWith('.js')).sort().map((f) => {
  const code = `/* ${f} */\ntry{(function(PC){\n${read(path.join(specDir, f))}\n})(window.PC);}catch(e){console.warn('specimen ${f} failed to load', e);}`;
  try { new (require('vm').Script)(code, { filename: f }); } catch (e) { warn(`specimen ${f} does not parse, so it is left out: ${e.message}`); return ''; }
  return code;
}).filter(Boolean).join('\n') : '';
const specNames = new Set((specimens.match(/PC\.register\('([\w-]+)'/g) || []).map((s) => s.match(/'([\w-]+)'/)[1]));
all.forEach((ch) => { const s = ch.meta.specimen; if (s && !specNames.has(s)) warn(`${ch.id}: specimen "${s}" is not built yet`); });
['package', 'globe'].forEach((s) => { if (!specNames.has(s)) warn(`specimen "${s}" (used by hero/geopolitics) is not built yet`); });

/* ---------------- supplier revenue: as filed, and about how much in dollars (qa/round3/SPEC.md section 2) ----------------
   A supplier's revenue object (data/suppliers.json) holds its latest annual revenue exactly as its filing prints it. Here, in
   memory only, each such supplier gains revenueShown, what the Suppliers rows and the Index card print ("¥2,443,533 million",
   "year to March 2026", "about $16.2 billion", the filing's link and its note), and the dollar figure build/fx.js converts: the
   filed amount over the mean of the Federal Reserve's G.5 monthly rates across the fiscal year (data/fx-rates.json), as
   revenueUSD (dollars) with revenueUSDBasis (the months, series and mean rate, for the export). revenueUSDb, which the home page's
   comparison reads, becomes that figure in billions, or null when the currency or a month has no rate. No data file is written.
   A supplier with no revenue object keeps its earlier revenueUSDb, and the build report names it. */
const fxConv = require('./fx.js')(readJSON(path.join(root, 'data', 'fx-rates.json'), {}));
const CUR_SIGN = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: 'CN¥', TWD: 'NT$', KRW: '₩', HKD: 'HK$', SGD: 'S$', CAD: 'C$', AUD: 'A$', INR: '₹' }; // any other code prints as itself: "CHF 1,073,516 thousand"
// each amount as data/suppliers.json types it, by supplier name, since JSON.parse drops a filed trailing zero ("2054.0")
const filedText = {};
(read(path.join(root, 'data', 'suppliers.json')) || '').split(/\n  \{\n/).forEach((chunk) => {
  const n = /"name": ("(?:[^"\\]|\\.)*")/.exec(chunk), a = /"revenue": \{\s*"amount": (\d+(?:\.\d+)?)[,\s]/.exec(chunk);
  if (n && a) filedText[JSON.parse(n[1])] = a[1];
});
const groupDigits = (t) => { const [i, f] = String(t).split('.'); return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (f != null ? '.' + f : ''); };
// the fiscal year by the month it ends, since firms name the same April-to-March year FY2025 or FY2026: "year to March 2026", or "2025"
const fyShown = (v) => { const m = /^(\d{4})-(\d{2})$/.exec(v.fyEnd || ''); return !m ? String(v.fiscalYear || '') : +m[2] === 12 ? m[1] : `year to ${MONTHS[+m[2] - 1]} ${m[1]}`; };
// the note for the Index card, less the sentences and clauses that speak to the editors (how a filing was fetched, how the figure
// compares with the one the page used to print); what stays is word for word, so no figure in it changes
const NOTE_INTERNAL = /\bthis machine\b|\brefused\b|\bWebFetch\b|\bHTTP 403\b|\bcould not be opened\b|\bqa\/|\bscratch\b|\bearlier agents\b|revenueUSDb|\bthe site(?:'s)?\b|\bsite figure\b/i;
const NOTE_TAIL = /,\s*(?:which matches|matching) the (?:scale|scope) of the site(?:'s)? (?:current )?figure(?: \([^)]*\))?|,\s*if the row should[^.;]*|:\s*the site's current figure[^.;]*/gi;
const NOTE_ABBR = /\b(?:U\.S|Inc|Ltd|Pte|Co|Corp|No|p|pp|plc|e\.g|i\.e|vs|S\.A|N\.V)$/; // a full stop after these does not end a sentence
// split at a separator outside parentheses, so "(accession ...; primary document ...)" stays one piece
const splitTop = (s, re) => { const out = []; let depth = 0, from = 0; for (let i = 0; i < s.length; i++) { const c = s[i]; if (c === '(' || c === '（') depth++; else if ((c === ')' || c === '）') && depth) depth--; else if (!depth) { const m = re.exec(s.slice(i, i + 4)); if (m) { out.push(s.slice(from, i + m[1].length)); from = i + m[0].length; i = from - 1; } } } out.push(s.slice(from)); return out.filter((x) => x.trim()); };
const readerNote = (note) => {
  const sents = [];
  splitTop(String(note || '').replace(NOTE_TAIL, '').trim(), /^([.!?])\s+(?=[A-Z(“"])/).forEach((p) => { const last = sents[sents.length - 1]; if (last != null && NOTE_ABBR.test(last.replace(/[.!?]$/, ''))) sents[sents.length - 1] = last + ' ' + p; else sents.push(p); });
  return sents.map((s) => { const cl = splitTop(s.replace(/[.!?]$/, ''), /^(;)\s+/).map((c) => c.replace(/;$/, '')); return NOTE_INTERNAL.test(cl[0]) ? '' : cl.filter((c) => !NOTE_INTERNAL.test(c)).join('; ') + '.'; }).filter(Boolean).join(' ');
};
const revenueOld = [];
suppliers.forEach((r) => {
  const v = r.revenue;
  if (!v || typeof v !== 'object') { if (r.revenueUSDb != null) revenueOld.push(r.name); return; }
  const code = String(v.currency || '').toUpperCase(), out = typeof v.amount === 'number' ? fxConv.toUSD(v) : null;
  r.revenueUSDb = out ? Math.round(out.usd / 1e6) / 1e3 : null;
  r.revenueUSD = out ? Math.round(out.usd) : null;
  r.revenueUSDBasis = out ? out.basis : null;
  const y = /^(\d{4})-\d{2}$/.exec(v.fyEnd || ''); if (y) r.revenueYear = +y[1];
  if (typeof v.amount !== 'number') return; // no public filing: no figure on the page, and the note in the data says why
  if (!out) warn(`revenue: ${r.name} (${code || 'no currency'}, ${v.fyStart} to ${v.fyEnd}) has no Federal Reserve rate for every month, so it shows only its filed figure`);
  const t = filedText[r.name] != null && +filedText[r.name] === v.amount ? filedText[r.name] : String(v.amount);
  r.revenueShown = { amount: t, filed: (CUR_SIGN[code] || code + ' ') + groupDigits(t) + (v.unit && v.unit !== 'one' ? ' ' + v.unit : ''), year: fyShown(v), about: code !== 'USD' && out ? fxConv.label(out.usd) : '', href: v.source || '', note: readerNote(v.note), group: v.scope === 'group' };
});
if (revenueOld.length) warn(`revenue: ${revenueOld.length} suppliers have no filed revenue yet and show their earlier dollar figure: ${revenueOld.join(', ')}`);
// the method note under the Suppliers list: the first paragraph of data/suppliers-revenue-notes.md
const revNotePara = (read(path.join(root, 'data', 'suppliers-revenue-notes.md')) || '').split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !p.startsWith('#')) || '';
const suppliersRevenueNote = revNotePara ? inline(revNotePara.replace(/\s+/g, ' '), { id: 'suppliers-revenue', cites: [], figures: [] }) : '';

// each supplier the China revenue panel covers carries its latest China share, ready to print: label for its detail ("China 29.1% of
// revenue, FY2025"), short for its line in the list ("China 29.1%", or "China 14.2% of Samsung Electronics" for a division, whose
// figure is its parent's) and href for its chart. A supplier the panel does not cover goes in unchanged.
const suppliersData = suppliers.map((r) => {
  const href = exposureJoin.href(r.name); if (!href) return r;
  const firm = exposureJoin.firmOf(r.name), share = require('./exposure.js').shareText(exposureJoin.latest(r.name)); // "33%" where only a percentage was filed
  return Object.assign({}, r, { china: { label: exposureJoin.label(r.name), short: 'China ' + share + (require('./exposure.js').PARENTS[r.name] ? ' of ' + firm : ''), href } });
});
// each firm's chart address, for the search entries of the China revenue rows (the rows themselves stay as filed, since the page exports them)
const exposureLinks = {}; Object.keys(exposureJoin.byFirm).forEach((f) => { exposureLinks[f] = exposureJoin.href(f); });
const data = { specimenNames: SPECIMEN_NAME, landscape, landscapeNotes, landscapeCompare, suppliers: suppliersData, timeline, matrix, flows, exposure, exposureLinks, chapters: all.map((c) => { const card = c.meta.card || {}; return { id: c.id, number: c.number, stage: isStage(c), title: c.title, specimen: c.meta.specimen, oneLiner: c.meta.oneLiner || '', plain: String(c.meta.plain || '').replace(/\s*\(\[source\]\([^)\s]*\)\)/g, ''), score: +card.chokepointScore || 0, concentration: card.concentration || '', band: card.concentration || '', bandRank: BANDS[card.concentration] || 0, substitutability: card.substitutability || null, leaders: card.leaders || [], countries: card.countries || [], substitution: card.substitution || {}, chinaStatus: card.chinaStatus || '', usStatus: card.usStatus || '' }; }) };
let html = read(path.join(root, 'src', 'template.html'));
const fill = (k, v) => { html = html.split(`{{${k}}}`).join(v); };
// the route before boot, inlined in <head>: it shows the routed view while the rest of the page arrives (src/preroute.js),
// and on The Chain the chapter the address names, from the chapters' ids
const chainIds = chapters.concat(geo ? [geo] : []).map((c) => c.id);
const PRE_CHAPTERS = 'var CHAPTERS = []; // the chapters of The Chain, in order: build/build.js writes their ids here';
const preSrc = read(path.join(root, 'src', 'preroute.js'));
if (!preSrc.includes(PRE_CHAPTERS)) warn('preroute: src/preroute.js has lost the line the build writes the chapter ids into');
// ...and the addresses of a chapter merged away, each with the merged chapter's nearest anchor (build/retired-chapters.js). A
// target must be on the page, and an old address must not be one, or the swap would hide a live anchor
const PRE_MOVED = 'var MOVED = {}; // the addresses of a chapter merged away: build/build.js writes { chapters: { old: new }, anchors: { old: new } } here';
if (!preSrc.includes(PRE_MOVED)) warn('preroute: src/preroute.js has lost the line the build writes the retired chapters into');
const movedMap = { chapters: {}, anchors: RETIRED.ANCHORS || {} };
Object.entries(RETIRED.chapters || {}).forEach(([old, e]) => {
  if (!chapterById(e.to)) warn(`retired chapter ${old}: it forwards to ${e.to}, which is not a chapter`);
  if (chapterById(old)) warn(`retired chapter ${old} is still a chapter in content/`);
  movedMap.chapters[old] = e.to;
});
{
  const onPage = (id) => chaptersHTML.includes(` id="${id}"`) || geoArticle.includes(` id="${id}"`);
  Object.entries(movedMap.anchors).forEach(([from, to]) => {
    if (!onPage(to)) warn(`retired chapters: #${from} forwards to #${to}, which is not on the page`);
    if (onPage(from)) warn(`retired chapters: #${from} is still an anchor on the page, so it must not be forwarded`);
  });
}
// the page's own line (its kind, its chapter and the way to the root) goes in page by page (the pages, below)
const PRE_PAGE = "var PAGE = { kind: 'book', chapter: '', root: '' }; // this page: build/build.js writes its kind (home, contents, chapter or book), its chapter and the way to the site's root here";
if (!preSrc.includes(PRE_PAGE)) warn('preroute: src/preroute.js has lost the line the build writes the page into');
const preBase = preSrc.replace(PRE_CHAPTERS, `var CHAPTERS = ${JSON.stringify(chainIds)};`).replace(PRE_MOVED, `var MOVED = ${JSON.stringify(movedMap)};`);
// one chapter at a time on The Chain (src/template.html, the style after the pre-boot rules): for each value of
// html[data-chain], what of The Chain stays hidden on screen, for the chapters a page holds
const chainOne = (ids) => {
  const S = '.view[data-view="stack"] >';
  const off = [`html[data-chain]:not([data-chain="contents"]) ${S} .howto`, `html[data-chain]:not([data-chain="contents"]) ${S} .contents`,
    `html[data-chain="contents"] ${S} article.chapter`, `html[data-chain="pending"] ${S} article.chapter`]
    .concat(ids.map((id) => `html[data-chain="${id}"] ${S} article.chapter:not(#${id})`));
  return `@media screen {\n${off.join(',\n')} { display: none; }\nhtml[data-chain] ${S} article.chapter { content-visibility: visible; border-top: 0; }\n}`;
};
const modDir = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => !f.startsWith('.')).sort() : []);
const moduleCSS = modDir(path.join(root, 'src', 'modules')).filter((f) => f.endsWith('.css')).map((f) => `\n/* module: ${f} */\n` + read(path.join(root, 'src', 'modules', f))).join('\n');
const siteCSS = read(path.join(root, 'src', 'styles.css')) + moduleCSS; // dist/assets/site.css (the shared files, below)
// build modules: build/modules/*.js each export a function (ctx) returning { PLACEHOLDER: html, ... }
const ctx = { root, fs, path, all, chapters, geo, stages, data, esc, pad, word, cap, read, readJSON, markdown, inline, tierOf, wordCount, warn, glossaryWrap, BAND_NOTE, SUB_NOTE,
  // the footer and the dates as the main page prints them, for the reference pages and the summary
  slug, footerKey, builtOn, builtStr, flashcards, pageDate, dayStr,
  // the flashcard deck, for the one that ends Start here (build/modules/walk.js), and the glossary (the home search field that showed its count went on 27 Oct 2026)
  deckHTML, glossary,
  // the numbered parts of a specimen and the stills of the others, which social.js copies to dist/media
  specimenParts, stillSizes,
  // for the reference pages (build/modules/reference-pages.js): the views' own words and helpers, as the main page uses them
  suppliersIntro, suppliersRevenueNote, controlsDek, exposureNote, safeUrl, COUNTRY };
for (const f of modDir(path.join(root, 'build', 'modules')).filter((x) => x.endsWith('.js'))) {
  try { const out = require(path.join(root, 'build', 'modules', f))(ctx) || {}; Object.keys(out).forEach((k) => fill(k, String(out[k]))); }
  catch (e) { warn(`build module ${f} failed: ${e.message}`); fatal.push(`build/modules/${f} threw: ${e.message}`); }
}
fill('SITE_URL', SITE.url); fill('SITE_HOST', SITE.host);
// the template's counts of the chain (the home card's alt text, the printed title page, The Chain's standfirst): never typed
fill('N_STAGES', String(stages.length)); fill('STAGES_WORD', word(stages.length)); fill('CHAPTERS_WORD', word(all.length));
// the counter: each hash route counts as its own page ("/lithography", "/suppliers"), and the query string is dropped;
// the walk's step addresses (#/walk/<chapter>, replaced as the reader scrolls Start here) all count as the home page; a chapter's
// own page counts as its address, /lithography/, whatever section it is at (as the readable pages counted until 28 Oct 2026)
fill('ANALYTICS', SITE.analytics ? `<script>window.goatcounter={path:function(){var p=location.pathname.replace(/index\\.html$/,'');if(p!=='/')return p;return (location.hash||'').replace(/^#\\/?/,'/').replace(/\\?.*$/,'').replace(/^\\/walk\\/.*$/,'/')||'/';}};</script>\n<script async src="https://gc.zgo.at/count.js" data-goatcounter="${esc(SITE.analytics)}"></script>` : ''); fill('THESIS', thesisHTML); fill('SUBTITLE', subtitleHTML); fill('CHAIN', chainTrack(stages, null));
// Home is the Start here walk (#/ and #/intro open the same view), so it has one entry
const sheetPages = [['#/', 'Home'], ['#/chain', 'Supply Chain'], ['#/landscape', 'AI Chips'], ['#/suppliers', 'Suppliers'], ['#/controls', 'Export Controls'], ['#/glossary', 'Glossary']].map((p) => `<a href="${p[0]}">${p[1]}</a>`).join('');
const sheetItem = (ch) => `<li><a href="${ch.id === 'geopolitics' ? '#geopolitics' : '#' + esc(ch.id)}"><span class="n">${pad(ch.number)}</span><span class="t">${esc(ch.title)}</span></a></li>`;
const sheetChapters = stages.map(sheetItem).join('') + (acrossChapters.length ? `<li class="sheet-k" aria-hidden="true">Across the chain</li>` + acrossChapters.map(sheetItem).join('') : '');
fill('SHEET_PAGES', sheetPages); fill('SHEET_CHAPTERS', sheetChapters);
fill('CONTENTS', contentsHTML); fill('CHAIN_STANDFIRST', chainStandfirst); fill('CREDITS', credits); // the chapters go in page by page (the pages, below)
// the footer opens with the masthead's own tile (src/template.html), which signs off in the ledger column on the walk and
// The Chain (styles.css .ft-mark) and stays hidden elsewhere. It is added here, so footer and footerKey, which the readable
// pages and the summary reuse, keep their words and markup.
const ftMark = (html.match(/<svg class="wm-tile"[\s\S]*?<\/svg>/) || [])[0] || '';
const ftLead = ftMark ? `<span class="ft-mark" aria-hidden="true">${ftMark}</span>` : '';
fill('FOOTER', ftLead + footer); fill('FOOTER_KEY', ftLead + footerKey);
fill('SUPPLIERS_INTRO', suppliersIntro); fill('SUPPLIERS_FACTS', suppliersFacts); fill('SUPPLIERS_REVENUE_NOTE', suppliersRevenueNote); fill('BUILT', builtStr);
// the PDF title page's art ships beside the page
// explainer animations: the rendered videos and stills go to dist/media
{ const md = path.join(root, 'media'); if (fs.existsSync(md)) { fs.mkdirSync(path.join(root, 'dist', 'media'), { recursive: true }); fs.readdirSync(md).filter((f) => /\.(mp4|jpg)$/.test(f) && [...USED_MEDIA].some((u) => f.startsWith(u + '-'))).forEach((f) => fs.copyFileSync(path.join(md, f), path.join(root, 'dist', 'media', f))); } }
for (const asset of ['print-title.png']) { const from = path.join(root, 'build', 'assets', asset); if (fs.existsSync(from)) fs.copyFileSync(from, path.join(root, 'dist', asset)); }
// the site icons (drawn by `python3 build/icons.py`) go to the root of dist/, where browsers look for /favicon.ico
for (const icon of ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png']) { const from = path.join(root, 'build', 'assets', 'icons', icon); if (fs.existsSync(from)) fs.copyFileSync(from, path.join(root, 'dist', icon)); else warn(`icon ${icon} is missing; run python3 build/icons.py`); }
fill('BRIEFING', briefingHTML); fill('GLOSSARY_COUNT', String(glossary.length)); // the Glossary's two lists go to dist/assets/glossary.js (below)
// the Look up page: one list of every term, firm and chip, alphabetical, each with the kind a reader would call it
const lkSlug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lkItems = [];
// the list's labels sit on one line in sentence case: a firm's stage by the short name the Suppliers ribbons print
// (Suppliers.SHORT in src/app.js), any other stage name with its later words in lower case unless they are acronyms
// ("Optics & photonics", "Substrates & PCBs"); data-text keeps the full category, so search still finds it
const LK_SHORT = {
  'Equipment Subsystems & Components': 'Equipment subsystems', 'Advanced Packaging & OSAT': 'Advanced packaging',
  'Interconnect & Networking': 'Interconnect', 'AI Accelerator Vendor': 'Accelerator vendors',
  'Photoresist & Materials': 'Photoresist', 'Metrology & Inspection': 'Metrology',
  'Deposition & Etch': 'Deposition & etch', 'Chemicals & Gases': 'Chemicals & gases',
  'Systems & Servers': 'Systems & servers', 'Power & Cooling': 'Power & cooling',
  'Silicon & Wafers': 'Silicon wafers', 'IP & Architecture': 'IP & architecture'
};
const lkStage = (c) => LK_SHORT[c] || String(c || 'Firm').split(' ').map((w, i) => (i && !/[A-Z].*[A-Z]/.test(w) ? w.toLowerCase() : w)).join(' ');
// what the prose calls each entry: the name minus its corporate tail, a known nickname, a chip's model code and codename, a term's acronyms
const LK_SUFFIX = /\s+(Holdings?|Inc\.?|Incorporated|Corporation|Corp\.?|Co\.?|Ltd\.?|Limited|Group|Technologies|Technology|Electronics|Semiconductors?|Industries|International|Systems|Design|Precision|Information|Chemical|Semi)$/i;
const LK_NICK = { 'Hon Hai Precision': 'Foxconn', 'Carl Zeiss SMT': 'Zeiss', 'Hewlett Packard Enterprise': 'HPE', 'Tokyo Ohka Kogyo': 'TOK', 'Samsung Electronics': 'Samsung', 'Taiwan Semiconductor Manufacturing': 'TSMC', 'Semiconductor Manufacturing International': 'SMIC', 'Advanced Micro Devices': 'AMD', 'BE Semiconductor Industries': 'Besi', 'Yangtze Memory Technologies': 'YMTC', 'ChangXin Memory Technologies': 'CXMT', 'Shanghai Micro Electronics Equipment': 'SMEE', 'Alphawave Semi': 'Alphawave', 'Nippon Sanso Holdings': 'Nippon Sanso', 'Shin-Etsu Chemical': 'Shin-Etsu', 'Super Micro Computer': 'Supermicro' };
const lkAliases = (name) => { const out = []; let n = name; for (let i = 0; i < 3; i++) { const m = n.replace(LK_SUFFIX, ''); if (m === n) break; n = m; if (n.length >= 3 && n !== name) out.push(n); } if (LK_NICK[name]) out.push(LK_NICK[name]); return out; };
glossary.forEach((g) => { const akas = String(g.aka || '').split(/[;,]/).map((x) => x.trim()).filter((x) => x.length >= 3 && x.toLowerCase() !== g.term.toLowerCase() && !/^[a-z]+$/.test(x)); lkItems.push({ kind: 'term', id: 'lk-term-' + lkSlug(g.term), key: 'gl-' + lkSlug(g.term), name: g.term, alias: akas, label: g.chapter === 'geopolitics' ? 'Export control' : 'Term', text: [g.term, g.aka || '', g.plain].join(' ') }); });
suppliers.forEach((r) => lkItems.push({ kind: 'firm', id: 'lk-firm-' + lkSlug(r.name), name: r.name, alias: lkAliases(r.name).concat(r.nativeName ? [r.nativeName] : []), label: lkStage(r.category), key: r.name, text: [r.name, r.nativeName || '', r.city || '', COUNTRY[r.country] || r.country || '', r.ticker || '', r.category || '', r.subcategory || '', r.role || '', LK_NICK[r.name] || ''].join(' ') }));
landscape.forEach((c) => { const al = []; const bare = c.name.replace(/\s*\(.*\)$/, ''); al.push(bare); bare.split(/\s+/).forEach((t) => { if (/\d/.test(t) && t.length >= 3 && t !== bare) al.push(t); }); const paren = (c.name.match(/\(([^)]*)\)/) || [])[1] || ''; paren.split(/[\s,]+/).forEach((t) => { if ((/^[A-Z][a-z]{3,}$/.test(t) && !/variant|configuration|China|licensed|of|the/i.test(t)) || (/\d/.test(t) && t.length >= 4)) al.push(t); }); if (c.family && c.family.length >= 5 && !/^(TPU|Ascend|Siyuan|Pinghu)\b/.test(c.family) && !/\(/.test(c.family)) al.push(c.family); lkItems.push({ kind: 'chip', id: 'lk-chip-' + lkSlug(c.id), name: `${c.vendor} ${c.name}`, alias: al.filter((x, i, arr) => arr.indexOf(x) === i), label: 'AI chip', key: c.id, text: [c.vendor, c.name, c.family || '', (c.process || {}).node || '', (c.memory || {}).type || ''].join(' ') }); });
// countries: any with three or more firms in the supplier list, a share in the country-share matrix, or a line on the home page's leverage table.
// The role line is the home page's own (build/modules/summary-a.js exports ROLE), never retyped here; the card reads it from DATA.countries.
const LK_CC_ALIAS = { US: ['US', 'USA', 'American'], CN: ['CN', 'PRC', 'Chinese'], TW: ['TW', 'Taiwanese'], KR: ['KR', 'ROK', 'Korea', 'Korean', 'South Korean'], JP: ['JP', 'Japanese'], NL: ['NL', 'Dutch', 'Holland'], DE: ['DE', 'German'], GB: ['GB', 'UK', 'Britain', 'British'], CA: ['CA', 'Canadian'], FR: ['FR', 'French'], CH: ['CH', 'Swiss'], AT: ['AT', 'Austrian'], IL: ['IL', 'Israeli'], SG: ['SG', 'Singaporean'], MY: ['MY', 'Malaysian'], IN: ['IN', 'Indian'], TH: ['TH', 'Thai'], IT: ['IT', 'Italian'], IE: ['IE', 'Irish'], DK: ['DK', 'Danish'] };
let LK_ROLE = {}; try { LK_ROLE = require(path.join(root, 'build', 'modules', 'summary-a.js')).ROLE || {}; } catch (e) { }
if (!Object.keys(LK_ROLE).length) warn('lookup: the home page does not export its ROLE table, so the country cards carry no role line');
const lkSupByCC = {}; suppliers.forEach((r) => { lkSupByCC[r.country] = (lkSupByCC[r.country] || 0) + 1; });
const lkMatrixCC = new Set(); matrix.forEach((r) => Object.keys(r.shares || {}).forEach((c) => { if (/^[A-Z]{2}$/.test(c)) lkMatrixCC.add(c); }));
data.countries = Object.keys(COUNTRY).filter((cc) => /^[A-Z]{2}$/.test(cc) && ((lkSupByCC[cc] || 0) >= 3 || lkMatrixCC.has(cc) || LK_ROLE[cc]))
  .map((cc) => ({ code: cc, name: COUNTRY[cc], role: LK_ROLE[cc] || '', panel: html.indexOf(`class="sa-panel" data-cc="${cc}"`) >= 0, aliases: LK_CC_ALIAS[cc] || [cc] }));
data.countries.forEach((c) => lkItems.push({ kind: 'country', id: 'lk-country-' + c.code.toLowerCase(), key: c.code, name: c.name, alias: c.aliases, label: 'Country', text: [c.name, c.code, c.aliases.join(' '), 'country', c.role].join(' ') }));
lkItems.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
const lookupListHTML = lkItems.map((i) => `<li id="${esc(i.id)}" data-kind="${i.kind}" data-key="${esc(i.key || i.name)}"${i.alias && i.alias.length ? ` data-alias="${esc(i.alias.join('|'))}"` : ''} data-text="${esc(i.text.toLowerCase().replace(/\s+/g, ' '))}"><button type="button"><span class="lk-name">${esc(i.name)}</span><span class="lk-lab">${esc(i.label)}</span></button></li>`).join('');
// the Glossary's head: how many entries of each kind the list holds (src/template.html, the Glossary view)
const lkKinds = (k) => lkItems.filter((i) => i.kind === k).length;
// the Glossary's head no longer tallies its kinds: each kind's button carries its count (28 Oct 2026; the counts showed three times)
fill('CONTROLS_DEK', controlsDek);
fill('EXPOSURE_VIZ', exposureViz(exposure));
fill('EXPOSURE_NOTE', exposureNote);
/* ---------------- search, the glossary's terms and its passages, as shared data ----------------
   While the home page held every chapter, the app read these from the page: the search index from the chapters, the
   Glossary and the data (src/app.js Tools.buildIndex), the pop-ups' definitions from the Glossary's list (Tip.def), and the
   Glossary's "Where it appears" from the chapters' paragraphs (src/modules/lookup.js corpus). Now each chapter has its own
   page, so the build reads the same parts of the same markup by the same rules (build/page-text.js) and ships them:
   - search.js, the whole index, in the order and words the app made it, fetched when the search opens (Tools.need);
   - terms.js, every glossary term's definition and the names the empty search suggests, on every page;
   - glossary.js, the Glossary's two lists (#lk-items and #glossary) and every chapter's paragraphs, fetched when the
     Glossary opens (src/modules/lookup.js). */
const PT = require('./page-text.js');
// the app's own country names (src/app.js COUNTRY, "United Arab Emirates" where the build says "UAE"), as the index wrote them
const APP_COUNTRY = (() => { const m = /var COUNTRY = (\{[^;]*\});/.exec(read(path.join(root, 'src', 'app.js')) || ''); try { return m ? new Function('return ' + m[1])() : COUNTRY; } catch (e) { warn('search: src/app.js COUNTRY could not be read, so the build\'s country names stand in'); return COUNTRY; } })();
const ptFind = (n, test) => PT.all(n).find(test) || null;
const chArticle = (id) => ptFind(PT.parse(articleOf.get(id) || ''), (n) => n.tag === 'article');
const chTitle = (art) => { const t = art && ptFind(art, (n) => PT.hasClass(n, 'ch-title')); return (t ? PT.textContent(t) : '').replace(/^Chapter \d+: /, ''); };
const glossaryDoc = PT.parse(glossaryHTML);
const glEntries = PT.all(glossaryDoc).filter((n) => PT.hasClass(n, 'gl-entry')).map((el) => {
  const dt = ptFind(el, (n) => n.tag === 'dt'), dd = ptFind(el, (n) => n.tag === 'dd'), p = dd && ptFind(dd, (n) => n.tag === 'p');
  return { id: el.attrs.id, key: el.attrs['data-term'], term: dt && dt.kids[0] ? PT.textContent(dt.kids[0]) : '', plain: p ? PT.textContent(p) : '' };
});
const searchData = (() => {
  const idx = [];
  // the home page is "Home" in the results, as the masthead names it (28 Oct 2026; it said "Start here", a page the home replaced)
  idx.push({ kind: 'Home', title: 'How AI chips are made', text: 'One plain paragraph per stage, in order, with the specimens', href: '#/intro' });
  data.chapters.forEach((c) => { if (c.plain && c.id !== 'introduction-and-goals') idx.push({ kind: 'Home', title: c.title + ', in plain terms', text: c.plain, href: '#/walk/' + c.id }); });
  const arts = all.map((c) => chArticle(c.id)).filter(Boolean);
  arts.forEach((art) => {
    const title = chTitle(art), lede = ptFind(art, (n) => PT.hasClass(n, 'ch-lede'));
    idx.push({ kind: 'Chapter', title, text: lede ? PT.textContent(lede) : '', href: '#' + art.attrs.id });
    PT.all(art).filter((h) => (h.tag === 'h3' || h.tag === 'h4') && h.attrs.id && PT.closest(h.parent, (x) => PT.hasClass(x, 'prose'))).forEach((h) => {
      // the snippet is the reading text: each block after the heading, to the next, without its footnote marks
      let t = '', p = PT.nextElement(h);
      while (p && !/^h[1-4]$/.test(p.tag) && t.length < 900) { if (/^(p|div|ul|ol|table)$/.test(p.tag)) t += ' ' + PT.textContent(PT.without(p, (k) => k.tag === 'sup' && PT.hasClass(k, 'cite'))); p = PT.nextElement(p); }
      idx.push({ kind: title, title: PT.textContent(h), text: t.replace(/\s+/g, ' ').replace(/\s+([.,;:)])/g, '$1').trim().slice(0, 900), href: '#' + h.attrs.id });
    });
  });
  glEntries.forEach((g) => idx.push({ kind: 'Term', title: g.term, text: g.plain, href: '#' + g.id }));
  (data.suppliers || []).forEach((r) => idx.push({ kind: 'Supplier', title: r.name, text: r.category + ' · ' + (APP_COUNTRY[r.country] || r.country) + (r.role ? ' · ' + r.role : ''), href: '#/suppliers', q: r.name }));
  (data.landscape || []).forEach((c) => idx.push({ kind: 'Chip', title: c.vendor + ' ' + c.name, text: ((c.process || {}).node || '') + ' · ' + ((c.memory || {}).type || '') + ' · ' + (c.status || ''), href: '#/landscape?pick=' + encodeURIComponent(c.id), chip: c.id }));
  (data.timeline || []).forEach((e) => idx.push({ kind: 'Event ' + e.date, title: e.title, text: e.summary || '', href: e.id ? '#/controls/' + encodeURIComponent(e.id) : '#/controls' }));
  (data.exposure || []).forEach((r) => { if (r.chinaShare != null) idx.push({ kind: 'China revenue', title: r.firm + ' ' + r.fiscalYear, text: 'China was ' + r.chinaShare + '% of revenue' + (r.basis ? ' · ' + r.basis : ''), href: (data.exposureLinks || {})[r.firm] || '#/exposure' }); });
  // each flashcard: Start here's deck (the walk comes first in the page), then each chapter's
  const walkDoc = PT.parse(html.slice(html.indexOf('data-view="walk"'), html.indexOf('<!--/home-->')));
  const decks = PT.all(walkDoc).filter((n) => PT.hasClass(n, 'fc') && n.attrs.id).map((fc) => [fc, fc.attrs['data-name'] || ''])
    .concat(...arts.map((art) => PT.all(art).filter((n) => PT.hasClass(n, 'fc') && n.attrs.id).map((fc) => [fc, chTitle(art)])));
  decks.forEach(([fc, name]) => {
    const cards = PT.all(fc).filter((n) => PT.hasClass(n, 'fc-card'));
    cards.forEach((c, k) => {
      const q = ptFind(c, (n) => PT.hasClass(n, 'fc-q')), a = ptFind(c, (n) => PT.hasClass(n, 'fc-a'));
      idx.push({ kind: 'Flashcard', title: q ? PT.textContent(q) : '', text: name + ' · card ' + (k + 1) + ' of ' + cards.length, more: 'flashcards ' + (a ? PT.textContent(a) : ''), href: '#' + fc.attrs.id, card: { id: fc.attrs.id, i: k } });
    });
  });
  return idx;
})();
// the definitions the pop-ups show, by the term's key (its data-term), the specimens' names, and the names the empty search suggests: two short
// terms, two firms that matter (Critical or Important), a chip by its own name and a country (src/app.js Tools.tryNames)
const termsData = (() => {
  const defs = {}; glEntries.forEach((g) => { defs[g.key] = [g.term.trim(), g.plain]; });
  const big = new Set(suppliers.filter((r) => r.chokepoint === 'Critical' || r.chokepoint === 'Important').map((r) => r.name));
  const chipName = {}; landscape.forEach((c) => { chipName[c.id] = c.name; });
  const of = (k) => lkItems.filter((i) => i.kind === k);
  // ...and each specimen's own name, which the phone's strip shows ("EUV scanner"), since a chapter's page loads no data.js
  // ...and the chapter whose line drawing stands for each specimen in the phone's collapsed strip (media/line-<id>.webp), a
  // still at 52 px where the live drawing was a dark blob (28 Oct 2026)
  const specimenChapter = {}; all.forEach((c) => { if (c.meta.specimen && lineStills[c.id] && !specimenChapter[c.meta.specimen]) specimenChapter[c.meta.specimen] = c.id; });
  return { defs, specimenNames: SPECIMEN_NAME, specimenChapter, try: { term: of('term').map((i) => i.name.trim()).filter((n) => n.length <= 22), firm: of('firm').filter((i) => big.has(i.key)).map((i) => i.name.trim()),
    chip: of('chip').map((i) => chipName[i.key] || i.name.trim()), country: of('country').map((i) => i.name.trim()) } };
})();
// every chapter's paragraphs and list items, as the Glossary's "Where it appears" reads them (src/modules/lookup.js corpus):
// [chapter, its k-th passage's text], with each chapter's title and number once
const passagesData = (() => {
  const SKIP = (n) => n.tag === 'figure' || n.tag === 'nav' || ['chapter-sources', 'plate-head', 'ch-meta', 'ch-cite', 'chain', 'chapter-nav'].some((c) => PT.hasClass(n, c));
  const chs = {}, paras = [];
  all.forEach((c) => {
    const art = chArticle(c.id); if (!art) return;
    chs[c.id] = [art.attrs['data-title'] || c.id, art.attrs['data-number'] || ''];
    PT.all(art).filter((n) => n.tag === 'p' || n.tag === 'li').forEach((el) => {
      if (PT.closest(el, SKIP)) return;
      const clone = PT.without(el, (k) => (k.tag === 'sup' && (PT.hasClass(k, 'cite') || PT.hasClass(k, 'cite-sep'))) || PT.hasClass(k, 'gl-tip') || PT.hasClass(k, 'chip'));
      const text = PT.text(clone).replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
      if (text.length > 40) paras.push([c.id, text]);
    });
  });
  return { chapters: chs, paras };
})();

const moduleJS = modDir(path.join(root, 'src', 'modules')).filter((f) => f.endsWith('.js')).map((f) => `\n/* module: ${f} */\ntry {\n${read(path.join(root, 'src', 'modules', f))}\n} catch (e) { console.warn('module ${f} failed', e); }`).join('\n');

/* ---------------- the shared files ----------------
   What every page shares is written once to dist/assets/, so a reader's browser fetches it once and keeps it: the styles, the
   specimen kit with every specimen, the app with its modules, and the data the views draw from. Each is linked with ?v= and
   a hash of its bytes, so a changed file is fetched afresh and an unchanged one stays cached. Until 28 Oct 2026 all of it was
   inlined into index.html. The app's parts keep a try each, as their separate <script> tags kept them apart: one that throws
   as it loads leaves the others running. A file this build did not write is removed. */
const ASSET_DIR = path.join(root, 'dist', 'assets'), assetURL = {};
const assetHash = (s) => require('crypto').createHash('sha256').update(s).digest('hex').slice(0, 10);
const writeAsset = (name, text) => { fs.mkdirSync(ASSET_DIR, { recursive: true }); fs.writeFileSync(path.join(ASSET_DIR, name), text); assetURL[name] = `assets/${name}?v=${assetHash(text)}`; return assetURL[name]; };
const tryPart = (name, code) => `/* ${name} */\ntry {\n${code}\n} catch (e) { console.warn('${name} failed', e); }\n`;
writeAsset('site.css', siteCSS);
writeAsset('kit.js', kit + '\n' + specimens + '\n');
writeAsset('data.js', `window.CP_DATA = ${JSON.stringify(data)};\n`);
writeAsset('terms.js', `window.CP_TERMS = ${JSON.stringify(termsData)};\n`);
writeAsset('search.js', `window.CP_SEARCH = ${JSON.stringify(searchData)};\n`);
writeAsset('app.js', read(path.join(root, 'src', 'app.js')) + moduleJS + '\n' + tryPart('cite line', CITE_JS) + tryPart('figure actions', FIG_JS) + tryPart('rail toggle', RAIL_TOGGLE_JS));
fill('STYLESHEET', `<link rel="stylesheet" href="${assetURL['site.css']}">`);

/* ---------------- the pages ----------------
   One template, four kinds of page (28 Oct 2026; src/template.html marks the parts that differ):
   - the home page, dist/index.html: home, AI Chips, Suppliers, Export Controls and the Glossary, and no chapter's text;
   - The Chain's contents, dist/supply-chain/index.html: its title, the downloads, the standfirst and a row per chapter,
     under their own head (social.js contentsHead);
   - each chapter's own page, dist/<id>/index.html: The Chain with that chapter alone, under the chapter's own head
     (social.js chapterHead), so it is the full chapter at its own address, and the one page that carries its text;
   - the book, dist/book/index.html: The Chain's cover, contents and every chapter, which build/pdf.py prints. It is for
     print only: noindex, linked from nowhere and disallowed in robots.txt.
   Each page's preroute line says which page it is (src/preroute.js PAGE), and relink settles its links for where it sits.
   Until 28 Oct 2026 dist/index.html held every chapter and dist/<id>/ a static readable copy of it. */
const pre = require(path.join(root, 'src', 'preroute.js'));
const unmark = (h) => h.replace(/[ \t]*<!--\/?(head|home|chain|book|cover)-->\n?/g, '');
const cutOut = (h, mark) => h.replace(new RegExp(`[ \\t]*<!--${mark}-->[\\s\\S]*?<!--/${mark}-->\\n?`, 'g'), '');
// the page's scripts, in order, after the addresses of the two the app fetches when it needs them (src/app.js need())
const scriptTags = (names, up) => `<script>window.CP_ASSETS = ${JSON.stringify({ 'search.js': up + assetURL['search.js'], 'glossary.js': up + assetURL['glossary.js'] })};</script>\n`
  + names.map((n) => `<script src="${up}${assetURL[n]}"></script>`).join('\n');
/* Links, settled for the page they sit on (the same rules src/preroute.js away() applies at run time, and src/app.js addr()
   to the links the app writes): a fragment whose place is on this page stays; one whose place is elsewhere becomes that
   place's address (a chapter's anchor from the home page, <id>/#<anchor>; a view's route from a chapter's page, ../#/<view>);
   a relative path gains the way to the root (../media/, ../pdf/, ../<id>/). A chapter's link to its own page goes to its
   top in place. data-route, which kept a chapter link in the app while every chapter was on one page, stays only on the
   book. The scripts' and styles' own text is left alone. */
function relink(h, page) {
  const ids = new Set(), held = [];
  for (const m of h.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
  h = h.replace(/(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2>)/gi, (m, open, tag, body, close) => { held.push(body); return `${open}\u0000${held.length - 1}\u0000${close}`; });
  const fix = (v, routed) => {
    if (v.charAt(0) === '#') {
      let id = v.slice(1).replace(/&amp;/g, '&'); try { id = decodeURIComponent(id); } catch (e) { }
      if (v.length < 2 || ids.has(id)) return v;
      const to = pre.away(v.replace(/&amp;/g, '&'), '', page, chainIds);
      if (!to && page.kind === 'contents' && v.charAt(1) === '/') return page.root + pre.CONTENTS + '/'; // its own route (the Supply Chain tab): its own address
      return to ? esc(to) : v;
    }
    if (routed && page.chapter && v === page.chapter + '/') return '#' + page.chapter; // the chapter's own page: its top, in place
    if (!page.root || /^([a-z][a-z0-9+.-]*:|\/|\?|\.\.\/)/i.test(v)) return v;
    return page.root + v;
  };
  h = h.replace(/<[a-zA-Z][^>\u0000]*>/g, (tag) => {
    const routed = /\sdata-route="/.test(tag);
    let t = tag.replace(/(\s(?:href|src|data-src|poster))="([^"]*)"/g, (m, a, v) => `${a}="${fix(v, routed)}"`);
    if (page.kind !== 'book') t = t.replace(/\sdata-route="[^"]*"/, '');
    return t;
  });
  return h.replace(/\u0000(\d+)\u0000/g, (m, i) => held[+i]);
}
// the Glossary's two lists, with their chapter links as the home page has them, and the chapters' passages (the shared data, above)
writeAsset('glossary.js', `window.CP_GLOSSARY = ${JSON.stringify({ items: lookupListHTML, terms: relink(glossaryHTML, { kind: 'home', chapter: '', root: '' }), passages: passagesData })};\n`);
// the page from the template: the parts it does not hold cut, its own head, preroute line, chapters and scripts in
function makePage(kind, o) {
  let h = html;
  const put = (k, v) => { h = h.split(`{{${k}}}`).join(v); };
  if (kind !== 'home') h = cutOut(h, 'home');
  else h = cutOut(h, 'chain'); // the home page holds no part of The Chain: its contents have their own page
  if (kind === 'chapter') h = cutOut(h, 'book');
  if (kind === 'contents') h = cutOut(h, 'cover'); // the cover is the book's
  if (o.head) h = h.replace(/<!--head-->[\s\S]*?<!--\/head-->/, () => o.head); // as a function: a head's "$6,400" is text
  h = unmark(h);
  const page = { kind, chapter: o.chapter || '', root: o.root };
  put('PREROUTE', preBase.replace(PRE_PAGE, `var PAGE = ${JSON.stringify(page)};`).replace(/<\/script/gi, '<\\/script'));
  put('CHAIN_ONE', chainOne(o.ids));
  put('CHAPTERS', o.chapters); put('GEO_ARTICLE', '');
  put('SCRIPTS', scriptTags(o.scripts, o.root));
  // any placeholder no module filled is removed rather than shipped as braces
  h = h.replace(/\{\{[A-Z_]+\}\}/g, () => '');
  return { h, page };
}
// a page's "Updated" day: the footers and the printed title page say "Updated <build day>" until the page is dated, then the
// day its content last changed (page dates, above); and each cite line its chapter's own day, which goes in last, so that
// no page's hash or "Updated" rewrite ever sees a chapter's day
const citeDays = (h) => h.replace(/\{\{CITE_DAY:([a-z0-9-]+)\}\}/g, (m, id) => { const e = pageDates['/' + id + '/']; if (!e || !e.modified) warn(`cite line: chapter ${id} has no page date`); return dayStr((e && e.modified) || today); });
const writePage = (rel, h) => { fs.mkdirSync(path.dirname(path.join(root, 'dist', rel)), { recursive: true }); fs.writeFileSync(path.join(root, 'dist', rel), keepRanges(h)); };

// the contents page, /supply-chain/ (The Chain's title, standfirst and a row per chapter; until 28 Oct 2026 the home page's
// #/chain): dated by its text, headed by social.js
if (pre.CONTENTS !== 'supply-chain') warn(`preroute: src/preroute.js names the contents page ${pre.CONTENTS}/, but the build writes supply-chain/`);
{
  const { h, page } = makePage('contents', { root: '../', chapters: '', ids: [], scripts: ['kit.js', 'terms.js', 'app.js'], head: '<!--contents-head-->' });
  const x = h.split(`Updated ${builtStr}`).join(`Updated ${DAY_TOKEN}`);
  const dates = pageDate('/supply-chain/', x.slice(x.indexOf('<main'), x.indexOf('</main>')));
  const head = ctx.contentsHead ? ctx.contentsHead(dates) : '';
  if (!head) warn('contents page: social.js gave it no head');
  writePage('supply-chain/index.html', relink(citeDays(x.split(DAY_TOKEN).join(dayStr(dates.modified)).replace('<!--contents-head-->', () => head)), page));
}
// the home page: dated by its text and DATA, the data its views draw from
let homeHTML;
{
  const { h, page } = makePage('home', { root: '', chapters: '', ids: [], scripts: ['kit.js', 'data.js', 'terms.js', 'app.js'] });
  let x = h.split(`Updated ${builtStr}`).join(`Updated ${DAY_TOKEN}`);
  const homeDates = pageDate('/', x + JSON.stringify(data));
  // a view with a page of its own (build/modules/reference-pages.js, which runs first) gives its footer that page's day, so
  // #/controls and /export-controls/ say the same "Updated" day for the same data (28 Oct 2026; the views all said the home
  // page's); the rest say the home page's
  const VIEW_PAGE = { landscape: '/chips/', suppliers: '/suppliers/', controls: '/export-controls/', glossary: '/glossary/' };
  const homeDay = dayStr(homeDates.modified);
  x = x.split(/(?=<section class="view\b)/).map((part) => {
    const v = (/^<section class="view\b[^"]*" data-view="([a-z-]+)"/.exec(part) || [])[1], e = v && VIEW_PAGE[v] ? pageDates[VIEW_PAGE[v]] : null;
    return e && e.modified ? part.split(DAY_TOKEN).join(dayStr(e.modified)) : part;
  }).join('');
  homeHTML = relink(citeDays(x.split(DAY_TOKEN).join(homeDay)), page);
  writePage('index.html', homeHTML);
}
// each chapter's page: dated by its article (the chapter's own text, figures and sources, as the readable page was), headed
// by social.js, and carrying, for print, the annotated still of a drawing with numbered parts (src/modules/print.js)
for (const ch of all) {
  const art = articleOf.get(ch.id);
  if (!art || !ctx.chapterHead) { warn(`chapter page ${ch.id}: no article or no head, so it has no page`); continue; }
  const dates = pageDate('/' + ch.id + '/', art, ch.file);
  const { h, page } = makePage('chapter', { root: '../', chapter: ch.id, chapters: art, ids: [ch.id], head: ctx.chapterHead(ch, dates), scripts: ['kit.js', 'terms.js', 'app.js'] });
  writePage(ch.id + '/index.html', relink(citeDays(h.split(`Updated ${builtStr}`).join(`Updated ${dayStr(dates.modified)}`)), page));
}
// the book: every chapter, for print only, dated by the latest of the home page and its chapters
{
  const last = ['/'].concat(all.map((c) => '/' + c.id + '/')).map((k) => (pageDates[k] || {}).modified || today).sort().pop();
  const head = `<title>How AI chips are made · Chip Supply Chain</title>\n<meta name="robots" content="noindex">\n<link rel="canonical" href="${SITE.url}">`;
  const { h, page } = makePage('book', { root: '../', chapters: all.map((c) => articleOf.get(c.id)).filter(Boolean).join('\n'), ids: chainIds, head, scripts: ['kit.js', 'terms.js', 'app.js'] });
  writePage('book/index.html', relink(citeDays(h.split(`Updated ${builtStr}`).join(`Updated ${dayStr(last)}`)), page));
}

// the route before boot: an address that names an id in one view must not show another view while the page loads (checked
// over the home page's views and the book's chapters, which between them hold every view and every chapter)
{
  const full = unmark(html).split('{{CHAPTERS}}').join(all.map((c) => articleOf.get(c.id)).filter(Boolean).join('\n'));
  const main = full.slice(full.indexOf('<main'), full.indexOf('</main>'));
  const cuts = [...main.matchAll(/<section class="view\b[^"]*" data-view="([a-z]+)"/g)], wrong = [], strays = [];
  cuts.forEach((c, i) => {
    const part = main.slice(c.index, i + 1 < cuts.length ? cuts[i + 1].index : main.length);
    for (const m of part.matchAll(/\sid="([^"']+)"/g)) { const got = pre.route('#' + m[1]).view; if (got !== c[1]) wrong.push(`#${m[1]} (in ${c[1]}, opens ${got})`); }
    // on The Chain, each id must name its own chapter (an id outside the chapters, as the contents', may name none; it then
    // waits for its element, as an unknown id does)
    if (c[1] !== 'stack') return;
    const arts = [...part.matchAll(/<article class="chapter[^"]*" id="([^"]+)"/g)];
    for (const m of part.matchAll(/\sid="([^"']+)"/g)) {
      const home = arts.filter((a) => a.index <= m.index).pop(), end = home ? part.indexOf('</article>', home.index) : -1;
      const want = home && m.index < end ? home[1] : '', got = pre.chapterOf(m[1], chainIds);
      if (got !== want) strays.push(`#${m[1]} (in ${want || 'the contents'}, shows ${got || 'none'})`);
    }
  });
  if (cuts.length < 6) warn(`preroute: found ${cuts.length} views on the page, expected 6`);
  if (wrong.length) warn(`preroute: ${wrong.length} ids would show the wrong view while the page loads, so add their prefix to OWN in src/preroute.js: ${wrong.slice(0, 8).join(', ')}`);
  if (strays.length) warn(`preroute: ${strays.length} ids in The Chain would show the wrong chapter while the page loads, so start them with their chapter's id (src/preroute.js chapterOf): ${strays.slice(0, 8).join(', ')}`);
}
if (SITE.cname) fs.writeFileSync(path.join(root, 'dist', 'CNAME'), SITE.cname + '\n'); else if (fs.existsSync(path.join(root, 'dist', 'CNAME'))) fs.unlinkSync(path.join(root, 'dist', 'CNAME'));
// for search engines: everything may be crawled, and the sitemap lists the HTML pages that carry their own content
// (the site itself, each chapter's page, the summary, and the four reference pages that reference-pages.js writes; the
// other view share pages only forward to the site, and the book is for print, so they are left out). The PDFs are still dated
// here, by their bytes. Each with the day its content last changed (page dates, above): a chapter's page hashes its article,
// a PDF its bytes
const chapterPages = (ctx.chapterPages || []).map((id) => '/' + id + '/'); // social.js lists the chapters that have a page
if (chapterPages.length !== all.length) warn(`sitemap: ${all.length - chapterPages.length} of ${all.length} chapters have no page`);
const pdfName = 'pdf/how-ai-chips-are-made.pdf', pdfFile = path.join(root, 'dist', pdfName);
if (fs.existsSync(pdfFile)) pageDate('/' + pdfName, fs.readFileSync(pdfFile)); else warn(`sitemap: dist/${pdfName} is missing`);
const summaryPdf = 'pdf/summary.pdf', summaryPdfFile = path.join(root, 'dist', summaryPdf);
if (fs.existsSync(summaryPdfFile)) pageDate('/' + summaryPdf, fs.readFileSync(summaryPdfFile));
// the two PDFs' first addresses (until 26 Oct 2026) keep working for links already shared: each is a copy of the renamed
// file, and robots.txt below asks search engines to skip them, so only the new addresses are found. A chapter merged away
// (build/retired-chapters.js) keeps its PDF address the same way, as a copy of the merged chapter's PDF
const OLD_PDFS = { 'chip-supply-chain-the-chain.pdf': pdfFile, 'chip-supply-chain-summary.pdf': summaryPdfFile };
Object.entries(RETIRED.chapters || {}).forEach(([old, e]) => { OLD_PDFS[`pdf/${old}.pdf`] = path.join(root, 'dist', 'pdf', e.to + '.pdf'); });
Object.entries(OLD_PDFS).forEach(([old, now]) => { if (fs.existsSync(now)) fs.copyFileSync(now, path.join(root, 'dist', old)); });
// each chapter's own PDF that has been printed (chapterPDF, above), dated by its bytes as the chain's is
const chapterPdfs = all.filter((c) => chapterPDF(c.id)).map((c) => { const p = chapterPDF(c.id); pageDate('/' + p.href, p.bytes); return '/' + p.href; });
if (chapterPdfs.length < all.length) warn(`chapter PDFs: ${all.length - chapterPdfs.length} of ${all.length} are not in dist/pdf/ yet (python3 build/chapter_pdfs.py), so their cite lines carry no PDF link: ${all.filter((c) => !chapterPDF(c.id)).map((c) => c.id).join(', ')}`);
const lastmod = (key) => (pageDates[key] || {}).modified || today;
// the book (dist/book/, the pages above) is for print alone, so it is kept from search engines too
fs.writeFileSync(path.join(root, 'dist', 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /book/\n${Object.keys(OLD_PDFS).map((o) => `Disallow: /${o}\n`).join('')}\nSitemap: ${SITE.url}sitemap.xml\n`);
fs.writeFileSync(path.join(root, 'dist', 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  // HTML pages only (the owner, 21 Oct 2026): the PDFs stay on the site and are linked from their pages, but are not listed
  ['/', '/supply-chain/', ...chapterPages, '/summary/', ...(ctx.referencePages || [])].map((k) => `  <url><loc>${SITE.url}${k.slice(1)}</loc><lastmod>${lastmod(k)}</lastmod></url>`).join('\n') + `\n</urlset>\n`);
// keep the dates of the pages this build wrote (a retired page drops out); the file is rewritten only when a date or hash moved
{
  const kept = {};
  Object.keys(pageDates).sort().forEach((k) => { const e = pageDates[k]; if (e.seen) kept[k] = { published: e.published, modified: e.modified, content: e.content }; });
  const text = JSON.stringify(kept, null, 2) + '\n';
  if (read(datesFile) !== text) fs.writeFileSync(datesFile, text);
}
// the datasets are served next to the page so the method notes' links resolve and researchers can fetch them directly
fs.mkdirSync(path.join(root, 'dist', 'data'), { recursive: true });
const dataFiles = fs.readdirSync(path.join(root, 'data')).filter((f) => /\.(json|md)$/.test(f));
fs.readdirSync(path.join(root, 'dist', 'data')).forEach((f) => { if (!dataFiles.includes(f)) fs.unlinkSync(path.join(root, 'dist', 'data', f)); }); // a retired dataset must not linger in the published folder
dataFiles.forEach((f) => fs.copyFileSync(path.join(root, 'data', f), path.join(root, 'dist', 'data', f)));
// and a shared file this build did not write (renamed or retired) leaves dist/assets/
fs.readdirSync(ASSET_DIR).forEach((f) => { if (!assetURL[f]) fs.unlinkSync(path.join(ASSET_DIR, f)); });
const tierTotal = tierCounts([].concat(...all.map((c) => c.cites)));
const report = [`built ${new Date().toISOString()}`, `source tiers: A ${tierTotal.A} · B ${tierTotal.B} · disallowed ${tierTotal.C + tierTotal.D} · unclassified ${tierTotal['?']}`, `chapters: ${chapters.length}${geo ? ' + geopolitics' : ''}`, `words: ${totalWords}`, `sources: ${all.reduce((a, c) => a + c.cites.length, 0)}`,
  `landscape: ${landscape.length} chips · suppliers: ${suppliers.length} · timeline: ${timeline.length} · matrix: ${matrix.length} · glossary: ${glossary.length} · controls: ${controls.length} · exposure: ${exposure.length}`, `specimens: ${[...specNames].join(', ')}`,
  `size: home ${(homeHTML.length / 1024).toFixed(0)} KB`, ...all.map((c) => { const tc = tierCounts(c.cites); return `  ${pad(c.number)} ${c.id}: ${c.words} words, ${c.cites.length} sources (D ${tc.D}, ? ${tc['?']}), ${(c.meta.figures || []).length} figures`; }), ...warnings.map((w) => 'WARN ' + w)].join('\n');
fs.writeFileSync(path.join(root, 'dist', 'build-report.txt'), report);
console.log(report);
if (fatal.length) { console.error(`build failed: ${fatal.length} problem${fatal.length === 1 ? '' : 's'}; dist/ is incomplete, do not deploy it`); fatal.forEach((p) => console.error('  ' + p)); process.exit(1); }
