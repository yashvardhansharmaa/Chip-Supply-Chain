#!/usr/bin/env node
/* CHOKEPOINTS build: content/*.md + data/*.json + specimens/*.js + src/* -> dist/index.html (one self-contained file) */
const fs = require('fs');
const path = require('path');
const SITE = require('./site.js'); // the public address; see build/site.js

const root = path.resolve(__dirname, '..');
const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
const readJSON = (p, fallback) => { const s = read(p); if (!s) return fallback; try { return JSON.parse(s); } catch (e) { warn(`bad JSON in ${path.basename(p)}: ${e.message}`); return fallback; } };
const warnings = [];
const warn = (m) => { warnings.push(m); console.warn('warn: ' + m); };
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
const bibOf = (url) => bibliography[url] || bibliography[String(url).replace(/&amp;/g, '&')] || null;
const bibDate = (d) => {
  const p = String(d || '').split('-');
  if (p.length === 3) return `${+p[2]} ${MONTHS[+p[1] - 1] || p[1]} ${p[0]}`;
  if (p.length === 2) return `${MONTHS[+p[1] - 1] || p[1]} ${p[0]}`;
  return p[0] || '';
};
const bibLabel = (url) => { const b = bibOf(url); return b && b.title ? b.title : ''; };
// One citation as a reference line: the title, then publisher and date in small type. A url with no entry stays a url.
function sourceLine(url) {
  const b = bibOf(url);
  const label = b && b.title ? b.title : (url.length > 96 ? url.slice(0, 94) + '…' : url);
  const meta = b ? [b.publisher, bibDate(b.date)].filter(Boolean).join(' · ') : host(url);
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
  // citations: ([source](url)) or [source](url)
  s = s.replace(/\(\s*\[(?:source|Source|src)\]\((https?:[^)\s]+)\)\s*\)/g, (_, url) => cite(url, ctx));
  s = s.replace(/\[(?:source|Source|src)\]\((https?:[^)\s]+)\)/g, (_, url) => cite(url, ctx));
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
  const b = bibOf(url) || {}, tier = tierOf(url), when = bibDate(b.date);
  const label = [b.title || host(url), b.publisher, when].filter(Boolean).join(' · ');
  return `<sup class="cite"><a href="${esc(url)}" target="_blank" rel="noopener" data-t="${esc(b.title || '')}" data-p="${esc(b.publisher || '')}" data-d="${esc(when)}" data-tier="${esc(tier)}" aria-label="Source ${i + 1}: ${esc(label)}">${i + 1}</a></sup>`;
}
function host(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } }

/* ---------------- figures ---------------- */
function fmtNum(v) { if (typeof v !== 'number') return esc(v); return Math.abs(v) >= 1000 ? v.toLocaleString('en-US') : (Number.isInteger(v) ? String(v) : v.toFixed(1)); }
function figure(f, ctx) {
  if (!f) return '';
  const title = `<p class="fig-title">${esc(f.title)}${f.unit ? `<span class="unit">${esc(f.unit)}</span>` : ''}</p>`;
  const source = f.source && f.source.url ? `<p class="fig-source">Source: <a href="${safeUrl(f.source.url)}" target="_blank" rel="noopener">${esc(f.source.label || host(f.source.url))}</a></p>` : (f.source && f.source.label ? `<p class="fig-source">Source: ${esc(f.source.label)}</p>` : '');
  if (f.source && f.source.url) cite(f.source.url, ctx);
  let body = '';
  const data = Array.isArray(f.data) ? f.data.filter((d) => Array.isArray(d) && d.length >= 2) : [];
  if (f.type === 'bars') {
    const max = Math.max(...data.map((d) => +d[1] || 0), 1e-9);
    const rowH = 26, labelW = 176, barX = labelW + 8, barW = 330, W = 600, H = data.length * rowH + 6;
    let svg = `<svg class="bars" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(f.title)}">`;
    data.forEach((d, i) => {
      const y = i * rowH + 3, w = Math.max(2, (+d[1] || 0) / max * barW);
      svg += `<text x="${labelW}" y="${y + 13}" text-anchor="end">${esc(String(d[0]).slice(0, 26))}</text><rect class="track" x="${barX}" y="${y}" width="${barW}" height="16" rx="1"/><rect class="bar" x="${barX}" y="${y}" width="${w.toFixed(1)}" height="16" rx="1"/><text class="val" x="${barX + w + 8}" y="${y + 13}">${fmtNum(d[1])}${f.unit === '%' ? '%' : ''}</text>`;
    });
    svg += `<line class="axis" x1="${barX}" y1="0" x2="${barX}" y2="${H}"/></svg>`;
    body = svg + tableFallback(data, f);
  } else if (f.type === 'stack') {
    const total = data.reduce((a, d) => a + (+d[1] || 0), 0) || 1;
    let seen = 0;
    const colorOf = (name) => { const c = COUNTRY_COLOR[name]; if (c) return c; seen += 1; return ((seen - 1) % 8) + 1; };
    const segs = data.map((d) => ({ name: d[0], v: +d[1] || 0, c: colorOf(d[0]) }));
    body = `<div class="stack-bar" role="img" aria-label="${esc(f.title)}">` + segs.map((s) => `<i style="flex:${(s.v / total * 100).toFixed(2)} 0 0;background:var(--c${s.c})" title="${esc(s.name)}: ${fmtNum(s.v)}${f.unit === '%' ? '%' : ''}"></i>`).join('') + `</div>` +
      `<div class="stack-legend">` + segs.map((s) => `<span style="--sw:var(--c${s.c})">${esc(s.name)}<b>${fmtNum(s.v)}${f.unit === '%' ? '%' : ''}</b></span>`).join('') + `</div>`;
  } else if (f.type === 'timeline') {
    body = `<ol class="tl">` + data.map((d) => `<li><span class="d">${esc(d[0])}</span>${esc(d[1])}</li>`).join('') + `</ol>`;
  } else {
    warn(`${ctx.id}: unknown figure type ${f.type}`);
    return '';
  }
  return `<figure class="figure" id="fig-${esc(ctx.id)}-${esc(f.id)}">${title}${body}${source}</figure>`;
}
function tableFallback(data, f) {
  return `<table class="sr-only"><caption>${esc(f.title)}</caption><tbody>${data.map((d) => `<tr><th scope="row">${esc(d[0])}</th><td>${fmtNum(d[1])}${f.unit ? ' ' + esc(f.unit) : ''}</td></tr>`).join('')}</tbody></table>`;
}

/* ---------------- block markdown ---------------- */
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
        out.push(`<h3 id="${id}">${inline(text, ctx)}</h3>`);
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
      const head = cells(rows[0]);
      let html = `<div class="table-wrap" tabindex="0"><table><thead><tr>${head.map((h) => `<th>${inline(h, ctx)}</th>`).join('')}</tr></thead><tbody>`;
      for (let r = 2; r < rows.length; r++) { const cs = cells(rows[r]); html += `<tr>${cs.map((c) => `<td>${inline(c, ctx)}</td>`).join('')}</tr>`; }
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
const SUBS = { 'Very hard': 4, Hard: 3, Moderate: 2, Easy: 1 };
const SUBWORD = { 'Very hard': 'Very hard to substitute', Hard: 'Hard to substitute', Moderate: 'Moderately hard to substitute', Easy: 'Easy to substitute' };
// one sentence per band, shown when a reader hovers the tag on the card (the full definitions stay in the Index)
const BAND_NOTE = { Extreme: 'Three or fewer firms could supply this stage today, or one firm holds more than half of it.', High: 'Four to six firms could supply this stage today, and the top two take most of the revenue.', Moderate: 'Seven or more firms could supply this stage today, none of them dominant.', Low: 'Many firms could supply this stage today, and the scarce input is something another industry sells at volume.' };
const SUB_NOTE = { 'Very hard': 'No second source at the leading node, and the path runs through physics, decades of unwritten know-how or protected IP: ten years or more, and nobody has repeated it yet.', Hard: 'No second source at the leading node. The path is known and takes five to ten years.', Moderate: 'A second source exists but is not yet qualified at the leading node: two to five years to close the gap.', Easy: 'A qualified second source ships today at the leading node.' };
const SPECIMEN_NAME = { 'boule-and-wafer': 'boule and wafer', 'cowos-exploded': 'CoWoS package, exploded', 'die-floorplan': 'die floorplan', 'euv-scanner': 'EUV scanner', foup: 'wafer carrier (FOUP)', 'gaa-transistor': 'gate-all-around transistor', 'gas-cabinet': 'gas cabinet', globe: 'globe', 'gpu-baseboard': 'GPU baseboard', 'hbm-stack': 'HBM stack', package: 'chip package', photomask: 'photomask', 'probe-card': 'probe card', 'process-chamber': 'process chamber', rack: 'server rack', 'sem-column': 'electron microscope column', 'substrate-layers': 'substrate layers', 'wafer-cost': 'wafer cost', wafer: 'wafer' };
function nameplate(card, title) {
  if (!card) return '';
  const leaders = (card.leaders || []).map((l) => `<li><span class="chip">${esc(l.country || '')}</span><span class="who">${esc(l.name)}</span>${l.share ? ` <span class="note">${esc(l.share)}</span>` : ''}</li>`).join('');
  const countries = (card.countries || []).map((c) => `<li><span class="chip">${esc(c.code)}</span><span class="who">${esc(COUNTRY[c.code] || c.code)}</span>${c.note ? ` <span class="note">${esc(c.note)}</span>` : ''}</li>`).join('');
  const sub = card.substitution || {};
  const sb = card.substitutability && card.substitutability.band ? card.substitutability : null;
  const conc = card.concentration || '';
  // Cost signal: lead with the number when the sentence starts with one; a sentence that does not gets the small reading face, never the display size
  const costSegs = String(card.costSignal || '').split(/;\s|\.\s/);
  let costHead = costSegs[0] || '', costRest = costSegs.slice(1).join('. ');
  const numLead = costHead.match(/^((?:about |roughly |up to |from |over |under |~|≈)?(?:US)?[$€£¥]?\d[\d,.]*\+?(?:\s?(?:-|–|to)\s?[$€£¥]?\d[\d,.]*)?\s?(?:[kKMBT]n?|bn|mn|billion|million|trillion|%)?)\s+(.+)$/i);
  if (numLead && costHead.length > 30) { costRest = numLead[2] + (costRest ? '. ' + costRest : ''); costHead = numLead[1]; }
  const costLong = costHead.length > 30;
  const cost = [costHead, costRest];
  return `<section class="plate" aria-label="Chokepoint card${title ? ' for ' + esc(title) : ''}">
<header class="plate-head"><span class="label">Chokepoint card</span><span class="plate-tags">${conc ? `<button type="button" class="gl-term ptag ptag-conc" data-band="${BANDS[conc] || 0}" data-term="concentration" data-note="${esc(BAND_NOTE[conc] || '')}">${esc(conc)} concentration</button>` : ''}${sb ? `<button type="button" class="gl-term ptag ptag-sub" data-band="${SUBS[sb.band] || 0}" data-term="substitutability" data-note="${esc(SUB_NOTE[sb.band] || '')}" data-test="${esc(sb.test || '')}">${esc(SUBWORD[sb.band] || sb.band)}</button>` : (sub.years ? `<span class="ptag ptag-sub">${esc(sub.years)} years to substitute</span>` : '')}</span></header>
<div class="plate-kpis">
<div><span class="k">Concentration</span><b class="v ${esc(card.concentration || '')}">${esc(card.concentration || '—')}</b></div>
${sb ? `<div><span class="k">Substitutability</span><b class="v sub-${SUBS[sb.band] || 0}">${esc(sb.band)}</b>${sb.test ? `<span class="sub">${esc(sb.test)}</span>` : ''}</div>` : `<div><span class="k">Substitution time</span><b class="v">${esc(sub.years || '—')}${sub.years && !/year/i.test(sub.years) ? '<small>years</small>' : ''}</b></div>`}
<div><span class="k">Price or market size</span><b class="v cost${costLong ? ' long' : ''}">${esc(cost[0] || '—')}</b>${cost[1] ? `<span class="sub">${esc(cost[1])}</span>` : ''}</div>
</div>
<dl class="plate-rows">
${leaders ? `<div class="row"><dt>Who leads</dt><dd><ul>${leaders}</ul></dd></div>` : ''}
${countries ? `<div class="row"><dt>Where it is made</dt><dd><ul>${countries}</ul></dd></div>` : ''}
${(sb && sb.why) || sub.why ? `<div class="row"><dt>Why substitution is ${sb && SUBS[sb.band] <= 2 ? 'possible' : 'slow'}</dt><dd class="why">${esc((sb && sb.why) || sub.why)}</dd></div>` : ''}
</dl>
${card.chinaStatus || card.usStatus ? `<div class="plate-status">${card.chinaStatus ? `<div><span class="k">Where China stands</span><p>${esc(card.chinaStatus)}</p></div>` : ''}${card.usStatus ? `<div><span class="k">Where the US stands</span><p>${esc(card.usStatus)}</p></div>` : ''}</div>` : ''}
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
  const ctx = { id, cites: [], figures: meta.figures || [] };
  const { html, headings } = markdown(body, ctx);
  const words = wordCount(body);
  const ch = { file: f, id, meta, html, headings, words, cites: ctx.cites, number: meta.number || chapters.length + 1, title: meta.title || id };
  (meta.figures || []).forEach((fig) => { if (!body.includes(`{{figure:${fig.id}}}`)) warn(`${id}: figure ${fig.id} defined but never placed`); });
  if (id === 'geopolitics') geo = ch; else chapters.push(ch);
}
chapters.sort((a, b) => a.number - b.number);
if (!chapters.length) warn('no chapters found; building with a placeholder');

const pad = (n) => String(n).padStart(2, '0');
const SHORT = { 'design-and-eda': 'Design', 'silicon-and-wafers': 'Silicon', 'chemicals-gases-and-photoresist': 'Chem­icals', lithography: 'Litho', 'photomasks-and-pellicles': 'Masks', 'deposition-and-etch': 'Dep / etch', 'metrology-and-inspection': 'Metro­logy', 'transistors-and-front-end': 'Front end', 'foundries-and-fabs': 'Foundry', 'memory-and-hbm': 'Memory', 'advanced-packaging': 'Pack­aging', 'substrates-and-pcbs': 'Sub­strate', 'test-and-assembly': 'Test', 'systems-and-networking': 'Systems', 'data-centers-and-power': 'Power', 'introduction-and-goals': 'Intro', 'component-costs': 'Costs', geopolitics: 'Geopolitics' };
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const word = (n) => WORDS[n] || String(n);
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
const isStage = (ch) => ch.number >= 1 && ch.number <= 15; // chapters 1 to 15 are the stages; 16 is costs, 17 the essay
const stages = chapters.filter(isStage);
function chainTrack(chs, currentId) {
  return `<ol class="chain-track">${chs.map((c) => { const cb = (c.meta.card || {}).concentration || ''; return `<li class="stage-cell" data-band="${BANDS[cb] || 0}" data-id="${esc(c.id)}"${c.id === currentId ? ' aria-current="true"' : ''}><a href="#${esc(c.id)}" title="${esc(c.title)}${cb ? ' · ' + esc(cb) + ' concentration' : ''}"><span class="n">${pad(c.number)}</span><span class="bar"><i></i></span><span class="t">${esc(SHORT[c.id] || c.title)}</span></a></li>`; }).join('')}</ol>`;
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
  return { html, box: `<div class="plain"><span class="label">In plain terms</span><p>${inline(plain, ctx)}</p></div>` };
}
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
function glossaryWrap(html) {
  if (!glRE) return html;
  const used = new Set();
  const wrapText = (text) => text.split(/(&[a-zA-Z#][a-zA-Z0-9]*;)/).map((part, i) => {
    if (i % 2) return part; // an HTML entity: leave it whole
    return part.replace(glRE, (match) => {
      const term = glTermOf.get(match.toLowerCase().replace(/\s+/g, ' '));
      if (!term || used.has(term)) return match;
      used.add(term);
      return `<button type="button" class="gl-term" data-term="${esc(term.toLowerCase())}">${match}</button>`;
    });
  }).join('');
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
const chapterHref = (c) => '#' + esc(c.id); // the essay is chapter 18 inside the chain
function prevNext(ch) {
  const seq = chapters.concat(geo ? [geo] : []);
  const i = seq.findIndex((c) => c.id === ch.id);
  if (i < 0) return '';
  const prev = seq[i - 1], next = seq[i + 1];
  if (!prev && !next) return '';
  const link = (c, dir, label) => (c ? `<a class="pn ${dir}" href="${chapterHref(c)}"><span class="label">${label}</span><span class="t"><span class="n">${pad(c.number)}</span> ${esc(c.title)}</span></a>` : '');
  return `<nav class="prevnext" aria-label="Previous and next chapter">${link(prev, 'prev', 'Previous')}${link(next, 'next', 'Next')}</nav>`;
}
function chapterHTML(ch) {
  const m = ch.meta, mins = Math.max(1, Math.round(ch.words / 230));
  const specimen = m.specimen || 'wafer';
  const parts = splitTakeaways(ch.html);
  const pb = plainBox(parts.body, m.plain, { id: ch.id, cites: ch.cites, figures: [] });
  ch.inShort = parts.inShort;
  const sources = ch.cites.length ? `<details class="chapter-sources"><summary>Sources (${ch.cites.length})</summary><ol>${ch.cites.map((c) => `<li>${tierTag(c.url)}${sourceLine(c.url)}</li>`).join('')}</ol></details>` : '';
  const stageIdx = stages.findIndex((c) => c.id === ch.id);
  const next = stageIdx >= 0 ? stages[stageIdx + 1] : null;
  const tile = stageIdx >= 0 ? `<div class="ch-tile"><span class="k">Chapter</span><span class="v">${pad(ch.number)}</span><span class="of">stage ${stageIdx + 1} of ${stages.length}</span></div>` : `<div class="ch-tile"><span class="k">Chapter</span><span class="v">${pad(ch.number)}</span><span class="of">${ch.id === 'geopolitics' ? 'the contest' : 'the economics'}</span></div>`;
  const chain = stageIdx >= 0 ? `<div class="chain chain--compact" aria-label="Where this stage sits in the chain">${chainTrack(stages, ch.id)}<p class="chain-foot"><span><b>${esc(ch.title)}</b>, stage ${stageIdx + 1} of ${stages.length}</span><span>${next ? `Next: ${pad(next.number)} ${esc(next.title)}` : 'Last stage in the chain'}</span></p></div>` : '';
  return `<article class="chapter" id="${esc(ch.id)}" data-specimen="${esc(specimen)}" data-number="${pad(ch.number)}" data-title="${esc(ch.title)}" data-caption="${esc(m.specimenCaption || '')}">
<aside class="ch-ledger" aria-label="Chapter ${ch.number}${stageIdx >= 0 ? ', stage ' + (stageIdx + 1) + ' of ' + stages.length : ''}">${tile}${chain}</aside>
<header class="chapter-head">
<div class="ch-id"><div><h2 class="ch-title"><span class="sr-only">Chapter ${ch.number}: </span>${esc(ch.title)}</h2>${m.oneLiner ? `<p class="ch-lede">${esc(m.oneLiner)}</p>` : ''}<p class="ch-meta"><span class="label">${ch.words.toLocaleString('en-US')} words / ${mins} min</span><span class="label">Specimen: ${esc(SPECIMEN_NAME[specimen] || specimen.replace(/-/g, ' '))}</span><button type="button" class="label ch-copy" data-copy="${SITE.url}${esc(ch.id)}/" aria-label="Copy a link to this chapter">Link to chapter</button></p></div></div>
${pb.box}
${parts.inShort ? `<section class="inshort"><h3 class="label">In short</h3>${parts.inShort}</section>` : ''}
${isStage(ch) ? nameplate(m.card, ch.title) : ''}
</header>
<div class="prose">${glossaryWrap(pb.html)}${prevNext(ch)}${sources}</div>
</article>`;
}
const chaptersHTML = chapters.length ? chapters.map(chapterHTML).join('\n') : `<article class="chapter" id="placeholder" data-specimen="wafer" data-number="01" data-title="Placeholder"><header class="chapter-head"><div class="chapter-num">01</div><h2 class="chapter-title">No chapters yet</h2></header><div class="prose"><p>No chapters found. This is a shell build.</p></div></article>`;

const contentsHTML = chapters.concat(geo ? [geo] : []).map((ch) => `<div class="item"><span class="n">${pad(ch.number)}</span><a class="t" href="#${esc(ch.id)}">${esc(ch.title)}</a><ul>${ch.headings.filter((h) => !/^takeaways?$/i.test(h.text)).map((h) => `<li><a href="#${esc(h.id)}">${esc(h.text)}</a></li>`).join('')}</ul></div>`).join('');
const railHTML = chainTrack(stages, null);
const score5 = stages.filter((c) => +((c.meta.card || {}).chokepointScore || 0) >= 5).length;
const thesisHTML = 'How AI chips are made';
const subtitleHTML = 'Every stage of the supply chain, and who controls it.';

/* ---------------- data ---------------- */
function readJSONSafe(f) { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } }
const landscape = readJSON(path.join(root, 'data', 'landscape.json'), []);
// per-chip package layouts live in their own file so the specimen designers and the data editors never touch the same JSON
const landscapeLayouts = readJSONSafe(path.join(root, 'data', 'landscape-layouts.json')) || {};
landscape.forEach((c) => { if (landscapeLayouts[c.id]) c.layout = landscapeLayouts[c.id]; }); // the researched layouts file wins over the inline field
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
/* ---------------- China exposure: one bar chart per firm, China revenue by fiscal year in the firm's own currency (static SVG; app.js adds the tooltips) ---------------- */
function exposureViz(rows) {
  const ok = rows.filter((r) => r.chinaShare != null && r.fyEnd);
  if (!ok.length) return '';
  const byFirm = {};
  ok.forEach((r) => { (byFirm[r.firm] = byFirm[r.firm] || []).push(r); });
  const tx = (fy) => { const [y, m] = fy.split('-').map(Number); return y + (m - 0.5) / 12; };
  const CAT_ORDER = ['Lithography', 'Deposition', 'Etch', 'Process Control', 'Metrology', 'Test', 'Assembly', 'Materials', 'Memory', 'AI Accelerator Vendor', 'EDA'];
  const catRank = (c) => { const i = CAT_ORDER.findIndex((k) => String(c || '').toLowerCase().includes(k.toLowerCase())); return i < 0 ? CAT_ORDER.length : i; };
  const firms = Object.keys(byFirm).map((f) => {
    const rs = byFirm[f].slice().sort((a, b) => tx(a.fyEnd) - tx(b.fyEnd));
    const peak = rs.reduce((m, r) => (r.chinaShare > m.chinaShare ? r : m), rs[0]);
    return { firm: f, rows: rs, first: rs[0], last: rs[rs.length - 1], peak, meta: rs[0], hasMoney: rs.every((r) => r.chinaRevenue != null) };
  }).sort((a, b) => catRank(a.meta.category) - catRank(b.meta.category) || b.last.chinaRevenue - a.last.chinaRevenue || a.firm.localeCompare(b.firm));
  const T0 = 2021, T1 = 2026.6;
  const rules = [[tx('2022-10'), 'Oct 2022'], [tx('2023-10'), 'Oct 2023'], [tx('2024-12'), 'Dec 2024']];
  const pct = (v) => (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10) + '%';
  const unit = (cur) => { const c = String(cur || '').toUpperCase(); if (c.startsWith('USD')) return ['$', 'bn', 1000]; if (c.startsWith('EUR')) return ['€', 'bn', 1000]; if (c.startsWith('JPY')) return ['¥', 'bn', 1000]; if (c.startsWith('KRW')) return ['₩', 'tn', 1000000]; return [c.split(' ')[0] + ' ', 'm', 1]; };
  const money = (v, cur) => { const [sym, suf, div] = unit(cur); const n = v / div; return sym + (n >= 100 ? Math.round(n) : n >= 10 ? Math.round(n * 10) / 10 : Math.round(n * 100) / 100) + suf; };
  const attrs = (r) => `data-firm="${esc(r.firm)}" data-fy="${esc(r.fiscalYear)}" data-share="${r.chinaShare}" data-china="${r.chinaRevenue != null ? r.chinaRevenue : ''}" data-total="${r.totalRevenue != null ? r.totalRevenue : ''}" data-cur="${esc(r.currency || '')}" data-basis="${esc(r.basis || '')}"`;
  // one panel per firm: bars of China revenue by fiscal year on the firm's own scale, the share of revenue written above each bar
  const PW = 240, PH = 122, px0 = 10, px1 = 232, py0 = 18, py1 = 98;
  const X = (t) => px0 + ((t - T0) / (T1 - T0)) * (px1 - px0);
  let d = `<div class="ex-legend"><span><i class="lg-bar"></i>China revenue by fiscal year, in the firm's own currency</span><span><i class="lg-top"></i>The year it peaked</span><span><i class="lg-rule"></i>US export rules of Oct 2022, Oct 2023 and Dec 2024</span><span>The figure above each bar is China's share of the firm's revenue that year</span></div><div class="ex-grid">`;
  let lastCat = null;
  firms.forEach((f) => {
    const cat = f.meta.category || '';
    if (cat !== lastCat) { d += `<h4 class="ex-cat">${esc(cat)}</h4>`; lastCat = cat; }
    const topRow = f.hasMoney ? f.rows.reduce((m, r) => (r.chinaRevenue > m.chinaRevenue ? r : m), f.rows[0]) : null;
    const capNote = f.hasMoney ? `peak ${money(topRow.chinaRevenue, topRow.currency)} in ${esc(topRow.fiscalYear)}${topRow === f.last ? '' : ', ' + money(f.last.chinaRevenue, f.last.currency) + ' in ' + esc(f.last.fiscalYear)}` : 'share of revenue only';
    let s = `<figure class="ex-panel"><figcaption><b>${esc(f.firm)}</b><span>${f.meta.country ? esc(f.meta.country) + ' · ' : ''}${capNote}</span></figcaption>`;
    s += `<svg viewBox="0 0 ${PW} ${PH}" role="group" aria-label="${esc(f.firm)}: China revenue by fiscal year, ${esc(f.first.fiscalYear)} to ${esc(f.last.fiscalYear)}">`;
    rules.forEach((r) => { s += `<line x1="${X(r[0]).toFixed(1)}" y1="${py0 - 8}" x2="${X(r[0]).toFixed(1)}" y2="${py1}" class="rule"/>`; });
    s += `<line x1="${px0}" y1="${py1}" x2="${px1}" y2="${py1}" class="axis"/>`;
    const n = f.rows.length, slot = (px1 - px0) / Math.max(n, 5), bw = Math.min(26, slot * 0.62);
    if (f.hasMoney) {
      const max = Math.max(...f.rows.map((r) => r.chinaRevenue));
      const top = f.rows.reduce((m, r) => (r.chinaRevenue > m.chinaRevenue ? r : m), f.rows[0]); // the year China revenue peaked, in garnet
      f.rows.forEach((r) => {
        const cx = X(tx(r.fyEnd)), h = (r.chinaRevenue / max) * (py1 - py0), y = py1 - h, isTop = r === top;
        s += `<a href="${safeUrl(r.source || '#')}" target="_blank" rel="noopener" aria-label="${esc(f.firm)} ${esc(r.fiscalYear)}: China revenue ${money(r.chinaRevenue, r.currency)}, ${pct(r.chinaShare)} of the total, opens the filing"><rect x="${(cx - bw / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" class="bar${isTop ? ' top' : ''}" ${attrs(r)}/></a>`;
        s += `<text x="${cx.toFixed(1)}" y="${(y - 4).toFixed(1)}" class="share${isTop ? ' top' : ''}" text-anchor="middle">${pct(r.chinaShare)}</text>`;
      });
    } else { // no filed China revenue: the share alone, as points on the same time axis
      const Y = (v) => py1 - (v / 60) * (py1 - py0);
      const pts = f.rows.map((r) => [X(tx(r.fyEnd)), Y(r.chinaShare)]);
      s += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')}" class="line"/>`;
      f.rows.forEach((r, i) => { const p = pts[i]; s += `<a href="${safeUrl(r.source || '#')}" target="_blank" rel="noopener" aria-label="${esc(f.firm)} ${esc(r.fiscalYear)}: ${pct(r.chinaShare)} from China, opens the filing"><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.4" class="dot${r === f.last ? ' last' : ''}" ${attrs(r)}/></a><text x="${p[0].toFixed(1)}" y="${(p[1] - 7).toFixed(1)}" class="share" text-anchor="middle">${pct(r.chinaShare)}</text>`; });
    }
    s += `<text x="${px0}" y="${PH - 4}" class="tick">${esc(f.first.fiscalYear)}</text><text x="${px1}" y="${PH - 4}" class="tick" text-anchor="end">${esc(f.last.fiscalYear)}</text></svg></figure>`;
    d += s;
  });
  return d + '</div>';
}


/* ---------------- geopolitics view ---------------- */
let geoBody = '<p>The geopolitics essay is not written yet.</p>', geoDek ='Who holds each chokepoint, how the export-control campaign has unfolded since 2018, and where the chips go.';
if (geo) {
  geoDek = geo.meta.oneLiner || geoDek;
  const sources = geo.cites.length ? `<details class="chapter-sources"><summary>Sources (${geo.cites.length})</summary><ol>${geo.cites.map((c) => `<li>${tierTag(c.url)}${sourceLine(c.url)}</li>`).join('')}</ol></details>` : '';
  const gparts = splitTakeaways(geo.html); geo.inShort = gparts.inShort;
  const gpb = plainBox(gparts.body, geo.meta.plain, { id: 'geopolitics', cites: geo.cites, figures: [] });
  geoBody = gpb.box + (gparts.inShort ? `<section class="inshort"><h3 class="label">In short</h3>${gparts.inShort}</section>` : '') + `<p class="label" style="margin:10px 0 26px">${geo.words.toLocaleString('en-US')} words / ${Math.max(1, Math.round(geo.words / 230))} min</p>` + glossaryWrap(gpb.html) + prevNext(geo) + sources;
}

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
const credits = `Made by <b><a href="https://www.linkedin.com/in/yashvardhan07/" target="_blank" rel="noopener">Yashvardhan Sharma</a></b> with Claude. Inspired by <a href="https://www.humanityslastmachine.com/" target="_blank" rel="noopener">Humanity's Last Machine</a> and <a href="https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/" target="_blank" rel="noopener">CSET's supply-chain work</a>. Corrections and questions: <a href="mailto:contact@chipsupplychain.org">contact@chipsupplychain.org</a>.`;
const builtOn = new Date(); const builtStr = `${builtOn.getDate()} ${MONTHS[builtOn.getMonth()]} ${builtOn.getFullYear()}`;
const footer = `<p class="credits">${credits}<span class="updated">Updated ${builtStr}</span></p>`;
const footerKey = footer + `<p class="sources-key"><span class="tier tier-A">A</span> company filings, governments, standards bodies, universities and research institutions; <span class="tier tier-B">B</span> SemiAnalysis, Reuters, the Financial Times and Nikkei Asia.</p>`;
const suppliersIntro = suppliers.length ? `What each of the ${suppliers.length} firms makes, where it sits, and how hard it would be to replace.` : 'The supplier list is not compiled yet.';

const kit = read(path.join(root, 'src', 'kit.js')) || '';
const specDir = path.join(root, 'specimens');
// each specimen gets its own <script> so a syntax error in one cannot take the others down
const specimens = fs.existsSync(specDir) ? fs.readdirSync(specDir).filter((f) => f.endsWith('.js')).sort().map((f) => `</script><script>/* ${f} */\ntry{(function(PC){\n${read(path.join(specDir, f)).replace(/<\/script/gi, '<\\/script')}\n})(window.PC);}catch(e){console.warn('specimen ${f} failed to load', e);}`).join('\n') : '';
const specNames = new Set((specimens.match(/PC\.register\('([\w-]+)'/g) || []).map((s) => s.match(/'([\w-]+)'/)[1]));
all.forEach((ch) => { const s = ch.meta.specimen; if (s && !specNames.has(s)) warn(`${ch.id}: specimen "${s}" is not built yet`); });
['package', 'globe'].forEach((s) => { if (!specNames.has(s)) warn(`specimen "${s}" (used by hero/geopolitics) is not built yet`); });

const data = { landscape, landscapeNotes, suppliers, timeline, matrix, flows, exposure, chapters: all.map((c) => { const card = c.meta.card || {}; return { id: c.id, number: c.number, title: c.title, specimen: c.meta.specimen, oneLiner: c.meta.oneLiner || '', plain: c.meta.plain || '', score: +card.chokepointScore || 0, concentration: card.concentration || '', band: card.concentration || '', bandRank: BANDS[card.concentration] || 0, substitutability: card.substitutability || null, leaders: card.leaders || [], countries: card.countries || [], substitution: card.substitution || {}, chinaStatus: card.chinaStatus || '', usStatus: card.usStatus || '' }; }) };
let html = read(path.join(root, 'src', 'template.html'));
const fill = (k, v) => { html = html.split(`{{${k}}}`).join(v); };
const modDir = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => !f.startsWith('.')).sort() : []);
const moduleCSS = modDir(path.join(root, 'src', 'modules')).filter((f) => f.endsWith('.css')).map((f) => `\n/* module: ${f} */\n` + read(path.join(root, 'src', 'modules', f))).join('\n');
fill('STYLES', read(path.join(root, 'src', 'styles.css')) + moduleCSS);
// build modules: build/modules/*.js each export a function (ctx) returning { PLACEHOLDER: html, ... }
const ctx = { root, fs, path, all, chapters, geo, stages, data, esc, pad, word, cap, read, readJSON, markdown, inline, tierOf, wordCount, warn, glossaryWrap, BAND_NOTE, SUB_NOTE };
for (const f of modDir(path.join(root, 'build', 'modules')).filter((x) => x.endsWith('.js'))) {
  try { const out = require(path.join(root, 'build', 'modules', f))(ctx) || {}; Object.keys(out).forEach((k) => fill(k, String(out[k]))); }
  catch (e) { warn(`build module ${f} failed: ${e.message}`); }
}
const totalCites = all.reduce((a, c) => a + c.cites.length, 0);
const claimsHTML = `<div><b class="num">${stages.length}</b><span>Stages, quartz<br>to a finished rack</span></div><div class="of-five"><b class="num">${score5}</b><span>Score 5 of 5<br>for concentration</span></div><div><b class="num">${totalCites}</b><span>Sources, one<br>per claim</span></div>`;
fill('SITE_URL', SITE.url); fill('SITE_HOST', SITE.host);
// the counter: each hash route counts as its own page ("/lithography", "/suppliers"), and the query string is dropped
fill('ANALYTICS', SITE.analytics ? `<script>window.goatcounter={path:function(){return (location.hash||'').replace(/^#\\/?/,'/').replace(/\\?.*$/,'')||'/';}};</script>\n<script async src="https://gc.zgo.at/count.js" data-goatcounter="${esc(SITE.analytics)}"></script>` : ''); fill('THESIS', thesisHTML); fill('SUBTITLE', subtitleHTML); fill('CLAIMS', claimsHTML); fill('CHAIN', chainTrack(stages, null));
const sheetPages = [['#/', 'Home'], ['#/intro', 'Start here'], ['#/chain', 'The Chain'], ['#/landscape', 'AI Chips'], ['#/suppliers', 'Suppliers'], ['#/controls', 'Export Controls'], ['#/glossary', 'Glossary']].map((p) => `<a href="${p[0]}">${p[1]}</a>`).join('');
const sheetChapters = all.map((ch) => { const sc = +((ch.meta.card || {}).chokepointScore || 0); return `<li><a href="${ch.id === 'geopolitics' ? '#geopolitics' : '#' + esc(ch.id)}"><span class="n">${pad(ch.number)}</span><span class="t">${esc(ch.title)}</span><span class="s${sc >= 5 ? ' hi' : ''}">${sc ? sc + ' / 5' : ''}</span></a></li>`; }).join('');
fill('SHEET_PAGES', sheetPages); fill('SHEET_CHAPTERS', sheetChapters);
fill('RAIL', railHTML); fill('CONTENTS', contentsHTML); fill('CHAPTERS', chaptersHTML); fill('CREDITS', credits); fill('FOOTER', footer); fill('FOOTER_KEY', footerKey);
fill('SUPPLIERS_INTRO', suppliersIntro); fill('BUILT', builtStr);
// the PDF title page's art ships beside the page
for (const asset of ['print-title.png']) { const from = path.join(root, 'build', 'assets', asset); if (fs.existsSync(from)) fs.copyFileSync(from, path.join(root, 'dist', asset)); } fill('GEO_DEK', esc(geoDek)); fill('GEO_BODY', geoBody);
fill('BRIEFING', briefingHTML); fill('GLOSSARY', glossaryHTML); fill('GLOSSARY_COUNT', String(glossary.length));
// the Look up page: one list of every term, firm and chip, alphabetical, each with the kind a reader would call it
const lkSlug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lkItems = [];
// what the prose calls each entry: the name minus its corporate tail, a known nickname, a chip's model code and codename, a term's acronyms
const LK_SUFFIX = /\s+(Holdings?|Inc\.?|Incorporated|Corporation|Corp\.?|Co\.?|Ltd\.?|Limited|Group|Technologies|Technology|Electronics|Semiconductors?|Industries|International|Systems|Design|Precision|Information|Chemical|Semi)$/i;
const LK_NICK = { 'Hon Hai Precision': 'Foxconn', 'Carl Zeiss SMT': 'Zeiss', 'Hewlett Packard Enterprise': 'HPE', 'Tokyo Ohka Kogyo': 'TOK', 'Samsung Electronics': 'Samsung', 'Taiwan Semiconductor Manufacturing': 'TSMC', 'Semiconductor Manufacturing International': 'SMIC', 'Advanced Micro Devices': 'AMD', 'BE Semiconductor Industries': 'Besi', 'Yangtze Memory Technologies': 'YMTC', 'ChangXin Memory Technologies': 'CXMT', 'Shanghai Micro Electronics Equipment': 'SMEE', 'Alphawave Semi': 'Alphawave', 'Nippon Sanso Holdings': 'Nippon Sanso', 'Shin-Etsu Chemical': 'Shin-Etsu', 'Super Micro Computer': 'Supermicro' };
const lkAliases = (name) => { const out = []; let n = name; for (let i = 0; i < 3; i++) { const m = n.replace(LK_SUFFIX, ''); if (m === n) break; n = m; if (n.length >= 3 && n !== name) out.push(n); } if (LK_NICK[name]) out.push(LK_NICK[name]); return out; };
glossary.forEach((g) => { const akas = String(g.aka || '').split(/[;,]/).map((x) => x.trim()).filter((x) => x.length >= 3 && x.toLowerCase() !== g.term.toLowerCase() && !/^[a-z]+$/.test(x)); lkItems.push({ kind: 'term', id: 'lk-term-' + lkSlug(g.term), key: 'gl-' + lkSlug(g.term), name: g.term, alias: akas, label: g.chapter === 'geopolitics' ? 'export control' : 'term', text: [g.term, g.aka || '', g.plain].join(' ') }); });
suppliers.forEach((r) => lkItems.push({ kind: 'firm', id: 'lk-firm-' + lkSlug(r.name), name: r.name, alias: lkAliases(r.name).concat(r.nativeName ? [r.nativeName] : []), label: r.category || 'firm', key: r.name, text: [r.name, r.nativeName || '', r.city || '', COUNTRY[r.country] || r.country || '', r.ticker || '', r.category || '', r.subcategory || '', r.role || '', LK_NICK[r.name] || ''].join(' ') }));
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
fill('LOOKUP_LIST', lkItems.map((i) => `<li id="${esc(i.id)}" data-kind="${i.kind}" data-key="${esc(i.key || i.name)}"${i.alias && i.alias.length ? ` data-alias="${esc(i.alias.join('|'))}"` : ''} data-text="${esc(i.text.toLowerCase().replace(/\s+/g, ' '))}"><button type="button"><span class="lk-name">${esc(i.name)}</span><span class="lk-lab">${esc(i.label)}</span></button></li>`).join(''));
fill('CONTROLS_DEK', `Every rule since 2018, what can still be sold to China, and each firm's China sales.`);
fill('EXPOSURE_VIZ', exposureViz(exposure));
fill('EXPOSURE_NOTE', exposure.length ? 'Shares are computed from the absolute figures each firm filed. Firms count China differently: where the goods ship, where they are billed, or where the customer is based.' : '');
fill('KIT', kit); fill('SPECIMENS', specimens);
fill('DATA', JSON.stringify(data).replace(/<\/script/gi, '<\\/script'));
const moduleJS = modDir(path.join(root, 'src', 'modules')).filter((f) => f.endsWith('.js')).map((f) => `\n/* module: ${f} */\ntry {\n${read(path.join(root, 'src', 'modules', f)).replace(/<\/script/gi, '<\\/script')}\n} catch (e) { console.warn('module ${f} failed', e); }`).join('\n');
fill('APP', read(path.join(root, 'src', 'app.js')) + moduleJS);
// any placeholder no module filled is removed rather than shipped as braces
html = html.replace(/\{\{[A-Z_]+\}\}/g, () => '');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
if (SITE.cname) fs.writeFileSync(path.join(root, 'dist', 'CNAME'), SITE.cname + '\n'); else if (fs.existsSync(path.join(root, 'dist', 'CNAME'))) fs.unlinkSync(path.join(root, 'dist', 'CNAME'));
// the datasets are served next to the page so the method notes' links resolve and researchers can fetch them directly
fs.mkdirSync(path.join(root, 'dist', 'data'), { recursive: true });
const dataFiles = fs.readdirSync(path.join(root, 'data')).filter((f) => /\.(json|md)$/.test(f));
fs.readdirSync(path.join(root, 'dist', 'data')).forEach((f) => { if (!dataFiles.includes(f)) fs.unlinkSync(path.join(root, 'dist', 'data', f)); }); // a retired dataset must not linger in the published folder
dataFiles.forEach((f) => fs.copyFileSync(path.join(root, 'data', f), path.join(root, 'dist', 'data', f)));
const tierTotal = tierCounts([].concat(...all.map((c) => c.cites)));
const report = [`built ${new Date().toISOString()}`, `source tiers: A ${tierTotal.A} · B ${tierTotal.B} · disallowed ${tierTotal.C + tierTotal.D} · unclassified ${tierTotal['?']}`, `chapters: ${chapters.length}${geo ? ' + geopolitics' : ''}`, `words: ${totalWords}`, `sources: ${all.reduce((a, c) => a + c.cites.length, 0)}`,
  `landscape: ${landscape.length} chips · suppliers: ${suppliers.length} · timeline: ${timeline.length} · matrix: ${matrix.length} · glossary: ${glossary.length} · controls: ${controls.length} · exposure: ${exposure.length}`, `specimens: ${[...specNames].join(', ')}`,
  `size: ${(html.length / 1024).toFixed(0)} KB`, ...all.map((c) => { const tc = tierCounts(c.cites); return `  ${pad(c.number)} ${c.id}: ${c.words} words, ${c.cites.length} sources (D ${tc.D}, ? ${tc['?']}), ${(c.meta.figures || []).length} figures`; }), ...warnings.map((w) => 'WARN ' + w)].join('\n');
fs.writeFileSync(path.join(root, 'dist', 'build-report.txt'), report);
console.log(report);
