#!/usr/bin/env node
/* CHOKEPOINTS build: content/*.md + data/*.json + specimens/*.js + src/* -> dist/index.html (one self-contained file) */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (p) => fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
const readJSON = (p, fallback) => { const s = read(p); if (!s) return fallback; try { return JSON.parse(s); } catch (e) { warn(`bad JSON in ${path.basename(p)}: ${e.message}`); return fallback; } };
const warnings = [];
const warn = (m) => { warnings.push(m); console.warn('warn: ' + m); };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const slug = (s) => String(s).toLowerCase().replace(/[’'"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const COUNTRY = { US: 'United States', NL: 'Netherlands', JP: 'Japan', TW: 'Taiwan', KR: 'South Korea', CN: 'China', DE: 'Germany', CH: 'Switzerland', GB: 'United Kingdom', FR: 'France', IL: 'Israel', SG: 'Singapore', MY: 'Malaysia', AT: 'Austria', IT: 'Italy', BE: 'Belgium', IN: 'India', AE: 'UAE', SA: 'Saudi Arabia', CA: 'Canada', SE: 'Sweden', FI: 'Finland', IE: 'Ireland', TH: 'Thailand', VN: 'Vietnam', PH: 'Philippines', MX: 'Mexico', 'EU-other': 'Other Europe', Other: 'Other' };
const COUNTRY_COLOR = { US: 1, NL: 2, TW: 3, JP: 4, KR: 5, CN: 6, DE: 7, 'EU-other': 8, Other: 8, 'United States': 1, Netherlands: 2, Taiwan: 3, Japan: 4, 'South Korea': 5, Korea: 5, China: 6, Germany: 7, Europe: 8, 'Other Europe': 8, Other: 8, 'Rest of world': 8, 'Others': 8 };

/* ---------------- source tiers ---------------- */
const tiersRaw = readJSON(path.join(root, 'data', 'source-tiers.json'), {});
const tierOf = (url) => { const h = host(url); for (const t of ['A', 'B', 'C', 'D']) { if ((tiersRaw[t] || []).some((d) => h === d || h.endsWith('.' + d))) return t; } return '?'; };
const TIER_LABEL = { A: 'Primary or institutional', B: 'Established analyst or top-tier press', C: 'Specialist press or named analyst', D: 'Below the bar', '?': 'Unclassified' };
const tierTag = (url) => { const t = tierOf(url); return `<span class="tier tier-${t}" title="${TIER_LABEL[t]}">${t}</span>`; };
const tierCounts = (cites) => { const c = { A: 0, B: 0, C: 0, D: 0, '?': 0 }; cites.forEach((x) => { c[tierOf(x.url)]++; }); return c; };

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
  // bold / italic
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, '$1<em>$2</em>');
  // leftover google-docs heading anchors
  s = s.replace(/\s*\{#[^}]*\}/g, '');
  return s;
}
function cite(url, ctx) {
  url = url.replace(/&amp;/g, '&');
  let i = ctx.cites.findIndex((c) => c.url === url);
  if (i < 0) { ctx.cites.push({ url }); i = ctx.cites.length - 1; }
  return `<sup class="cite"><a href="${esc(url)}" target="_blank" rel="noopener" title="${esc(host(url))}">${i + 1}</a></sup>`;
}
function host(url) { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return url; } }

/* ---------------- figures ---------------- */
function fmtNum(v) { if (typeof v !== 'number') return esc(v); return Math.abs(v) >= 1000 ? v.toLocaleString('en-US') : (Number.isInteger(v) ? String(v) : v.toFixed(1)); }
function figure(f, ctx) {
  if (!f) return '';
  const title = `<p class="fig-title">${esc(f.title)}${f.unit ? `<span class="unit">${esc(f.unit)}</span>` : ''}</p>`;
  const source = f.source && f.source.url ? `<p class="fig-source">Source: <a href="${esc(f.source.url)}" target="_blank" rel="noopener">${esc(f.source.label || host(f.source.url))}</a></p>` : (f.source && f.source.label ? `<p class="fig-source">Source: ${esc(f.source.label)}</p>` : '');
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
      let html = `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${inline(h, ctx)}</th>`).join('')}</tr></thead><tbody>`;
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
function pips(n) { let s = '<span class="pips" aria-hidden="true">'; for (let i = 1; i <= 5; i++) s += `<i class="${i <= n ? 'on' : ''}"></i>`; return s + '</span>'; }
function nameplate(card, title) {
  if (!card) return '';
  const leaders = (card.leaders || []).map((l) => `<li><span class="chip">${esc(l.country || '')}</span><span class="who">${esc(l.name)}</span>${l.share ? ` <span class="note">${esc(l.share)}</span>` : ''}</li>`).join('');
  const countries = (card.countries || []).map((c) => `<li><span class="chip">${esc(c.code)}</span><span class="who">${esc(COUNTRY[c.code] || c.code)}</span>${c.note ? ` <span class="note">${esc(c.note)}</span>` : ''}</li>`).join('');
  const sub = card.substitution || {};
  const score = +card.chokepointScore || 0;
  // Cost signal: lead with the number when the sentence starts with one; a sentence that does not gets the small reading face, never the display size
  const costSegs = String(card.costSignal || '').split(/;\s|\.\s/);
  let costHead = costSegs[0] || '', costRest = costSegs.slice(1).join('. ');
  const numLead = costHead.match(/^((?:about |roughly |up to |from |over |under |~|≈)?(?:US)?[$€£¥]?\d[\d,.]*\+?(?:\s?(?:-|–|to)\s?[$€£¥]?\d[\d,.]*)?\s?(?:[kKMBT]n?|bn|mn|billion|million|trillion|%)?)\s+(.+)$/i);
  if (numLead && costHead.length > 30) { costRest = numLead[2] + (costRest ? '. ' + costRest : ''); costHead = numLead[1]; }
  const costLong = costHead.length > 30;
  const cost = [costHead, costRest];
  return `<section class="plate" aria-label="Chokepoint nameplate${title ? ' for ' + esc(title) : ''}">
<header class="plate-head"><span class="label">Chokepoint nameplate</span><span class="plate-score">${pips(score)}<span><b>${score || '—'}</b> / 5</span><span class="sr-only">Chokepoint score ${score} of 5</span></span></header>
<div class="plate-kpis">
<div><span class="k">Concentration</span><b class="v ${esc(card.concentration || '')}">${esc(card.concentration || '—')}</b></div>
<div><span class="k">Time to substitute</span><b class="v">${esc(sub.years || '—')}${sub.years && !/year/i.test(sub.years) ? '<small>years</small>' : ''}</b></div>
<div><span class="k">Cost signal</span><b class="v cost${costLong ? ' long' : ''}">${esc(cost[0] || '—')}</b>${cost[1] ? `<span class="sub">${esc(cost[1])}</span>` : ''}</div>
</div>
<dl class="plate-rows">
${leaders ? `<div class="row"><dt>Who leads</dt><dd><ul>${leaders}</ul></dd></div>` : ''}
${countries ? `<div class="row"><dt>Where it is made</dt><dd><ul>${countries}</ul></dd></div>` : ''}
${sub.why ? `<div class="row"><dt>Why substitution is slow</dt><dd class="why">${esc(sub.why)}</dd></div>` : ''}
</dl>
${card.chinaStatus || card.usStatus ? `<div class="plate-status">${card.chinaStatus ? `<div><span class="k">China</span><p>${esc(card.chinaStatus)}</p></div>` : ''}${card.usStatus ? `<div><span class="k">United States</span><p>${esc(card.usStatus)}</p></div>` : ''}</div>` : ''}
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
const isStage = (ch) => ch.number >= 2 && ch.number <= 16;
const stages = chapters.filter(isStage);
function chainTrack(chs, currentId) {
  return `<ol class="chain-track">${chs.map((c) => { const sc = +((c.meta.card || {}).chokepointScore || 0); return `<li class="stage-cell" data-score="${sc}" data-id="${esc(c.id)}"${c.id === currentId ? ' aria-current="true"' : ''}><a href="#${esc(c.id)}" title="${esc(c.title)}"><span class="n">${pad(c.number)}</span><span class="bar"><i></i></span><span class="t">${esc(SHORT[c.id] || c.title)}</span></a></li>`; }).join('')}</ol>`;
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
function chapterHTML(ch) {
  const m = ch.meta, mins = Math.max(1, Math.round(ch.words / 230));
  const specimen = m.specimen || 'wafer';
  const parts = splitTakeaways(ch.html);
  const pb = plainBox(parts.body, m.plain, { id: ch.id, cites: ch.cites, figures: [] });
  ch.inShort = parts.inShort;
  const sources = ch.cites.length ? `<details class="chapter-sources"><summary>Sources for this chapter (${ch.cites.length})</summary><ol>${ch.cites.map((c) => `<li>${tierTag(c.url)}<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.url.length > 96 ? c.url.slice(0, 94) + '…' : c.url)}</a><span class="host">${esc(host(c.url))}</span></li>`).join('')}</ol></details>` : '';
  const stageIdx = stages.findIndex((c) => c.id === ch.id);
  const next = stageIdx >= 0 ? stages[stageIdx + 1] : null;
  const tile = stageIdx >= 0 ? `<div class="ch-tile"><span class="k">Chapter</span><span class="v">${pad(ch.number)}</span><span class="of">stage ${stageIdx + 1} of ${stages.length}</span></div>` : `<div class="ch-tile"><span class="k">Chapter</span><span class="v">${pad(ch.number)}</span><span class="of">${ch.number === 1 ? 'the map' : 'the bill'}</span></div>`;
  const chain = stageIdx >= 0 ? `<div class="chain chain--compact" aria-label="Where this stage sits in the chain">${chainTrack(stages, ch.id)}<p class="chain-foot"><span>You are here: <b>${esc(ch.title)}</b>, stage ${stageIdx + 1} of ${stages.length}</span><span>${next ? `Next: ${pad(next.number)} ${esc(next.title)}` : 'Last stage in the chain'}</span></p></div>` : '';
  return `<article class="chapter" id="${esc(ch.id)}" data-specimen="${esc(specimen)}" data-number="${pad(ch.number)}" data-title="${esc(ch.title)}" data-caption="${esc(m.specimenCaption || '')}">
<header class="chapter-head">
${chain}
<div class="ch-id">${tile}<div><h2 class="ch-title"><span class="sr-only">Chapter ${ch.number}: </span>${esc(ch.title)}</h2>${m.oneLiner ? `<p class="ch-lede">${esc(m.oneLiner)}</p>` : ''}<p class="ch-meta"><span class="label">${ch.words.toLocaleString('en-US')} words / ${mins} min</span><span class="label">Specimen: ${esc(specimen.replace(/-/g, ' '))}</span></p></div></div>
${parts.inShort ? `<section class="inshort"><h3 class="label">In short</h3>${parts.inShort}</section>` : ''}
${nameplate(m.card, ch.title)}
${pb.box}
</header>
<div class="prose">${pb.html}${sources}</div>
</article>`;
}
const chaptersHTML = chapters.length ? chapters.map(chapterHTML).join('\n') : `<article class="chapter" id="placeholder" data-specimen="wafer" data-number="01" data-title="Placeholder"><header class="chapter-head"><div class="chapter-num">01</div><h2 class="chapter-title">No chapters yet</h2></header><div class="prose"><p>No chapters found. This is a shell build.</p></div></article>`;

const contentsHTML = chapters.map((ch) => `<div class="item"><span class="n">${pad(ch.number)}</span><a class="t" href="#${esc(ch.id)}">${esc(ch.title)}</a><ul>${ch.headings.filter((h) => !/^takeaways?$/i.test(h.text)).map((h) => `<li><a href="#${esc(h.id)}">${esc(h.text)}</a></li>`).join('')}</ul></div>`).join('') +
  (geo ? `<div class="item"><span class="n">${pad(chapters.length + 1)}</span><a class="t" href="#/geopolitics">Geopolitics</a><ul>${geo.headings.slice(0, 6).map((h) => `<li><a href="#/geopolitics">${esc(h.text)}</a></li>`).join('')}</ul></div>` : '');
const railHTML = chainTrack(stages, null);
const score5 = stages.filter((c) => +((c.meta.card || {}).chokepointScore || 0) >= 5).length;
const thesisHTML = `${cap(word(stages.length))} stages turn sand into a GPU. <span class="q">${cap(word(score5))}</span> of them come down to three firms or fewer.`;

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
const exposure = readJSON(path.join(root, 'data', 'exposure.json'), []);
const controlsNotes = read(path.join(root, 'data', 'control-thresholds-notes.md'));
const exposureNotes = read(path.join(root, 'data', 'exposure-notes.md'));
/* ---------------- China exposure: ranking dumbbell + small multiples (static SVG; app.js adds the tooltips) ---------------- */
function exposureViz(rows) {
  const ok = rows.filter((r) => r.chinaShare != null && r.fyEnd);
  if (!ok.length) return '';
  const byFirm = {};
  ok.forEach((r) => { (byFirm[r.firm] = byFirm[r.firm] || []).push(r); });
  const tx = (fy) => { const [y, m] = fy.split('-').map(Number); return y + (m - 0.5) / 12; };
  const firms = Object.keys(byFirm).map((f) => {
    const rs = byFirm[f].slice().sort((a, b) => tx(a.fyEnd) - tx(b.fyEnd));
    const peak = rs.reduce((m, r) => (r.chinaShare > m.chinaShare ? r : m), rs[0]);
    return { firm: f, rows: rs, first: rs[0], last: rs[rs.length - 1], peak, meta: rs[0] };
  }).sort((a, b) => b.last.chinaShare - a.last.chinaShare);
  const T0 = 2021, T1 = 2026.6, YMAX = 60;
  const rules = [[tx('2022-10'), 'Oct 2022'], [tx('2023-10'), 'Oct 2023'], [tx('2024-12'), 'Dec 2024']];
  const pct = (v) => (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10) + '%';
  const attrs = (r) => `data-firm="${esc(r.firm)}" data-fy="${esc(r.fiscalYear)}" data-share="${r.chinaShare}" data-china="${r.chinaRevenue != null ? r.chinaRevenue : ''}" data-total="${r.totalRevenue != null ? r.totalRevenue : ''}" data-cur="${esc(r.currency || '')}" data-basis="${esc(r.basis || '')}"`;
  // ranking: first fiscal year (hollow) to latest (filled), peak year as an amber tick
  const RW = 760, L = 190, R = RW - 40, RH = 24, top = 30;
  const xs = (v) => L + (v / YMAX) * (R - L);
  const H = top + firms.length * RH + 8;
  let d = `<div class="ex-legend"><span><i class="lg-first"></i>First fiscal year on file</span><span><i class="lg-last"></i>Latest fiscal year</span><span><i class="lg-peak"></i>Peak year</span><span>Scale 0 to 60% of revenue</span></div>`;
  d += `<svg class="ex-rank" viewBox="0 0 ${RW} ${H}" role="img" aria-label="China share of revenue by firm: first fiscal year on file against the latest">`;
  [0, 20, 40, 60].forEach((v) => { d += `<line x1="${xs(v)}" y1="${top - 6}" x2="${xs(v)}" y2="${H - 6}" class="grid"/><text x="${xs(v)}" y="${top - 12}" class="tick" text-anchor="middle">${v}%</text>`; });
  firms.forEach((f, i) => {
    const y = top + i * RH + RH / 2, a = xs(f.first.chinaShare), b = xs(f.last.chinaShare);
    d += `<text x="${L - 14}" y="${y + 4}" class="name" text-anchor="end">${esc(f.firm)}</text>`;
    d += `<line x1="${Math.min(a, b).toFixed(1)}" y1="${y}" x2="${Math.max(a, b).toFixed(1)}" y2="${y}" class="link"/>`;
    if (f.peak !== f.first && f.peak !== f.last) d += `<line x1="${xs(f.peak.chinaShare).toFixed(1)}" y1="${y - 7}" x2="${xs(f.peak.chinaShare).toFixed(1)}" y2="${y + 7}" class="peak"/>`;
    d += `<a href="${esc(f.first.source || '#')}" target="_blank" rel="noopener"><circle cx="${a.toFixed(1)}" cy="${y}" r="4.2" class="dot first" ${attrs(f.first)}/></a>`;
    d += `<a href="${esc(f.last.source || '#')}" target="_blank" rel="noopener"><circle cx="${b.toFixed(1)}" cy="${y}" r="4.8" class="dot last" ${attrs(f.last)}/></a>`;
    const right = b >= a;
    d += `<text x="${(b + (right ? 10 : -10)).toFixed(1)}" y="${y + 4}" class="val" text-anchor="${right ? 'start' : 'end'}">${pct(f.last.chinaShare)}</text>`;
  });
  d += '</svg>';
  // small multiples: one panel per firm on a shared time axis and a shared 0 to 60% scale
  const PW = 240, PH = 118, px0 = 10, px1 = 232, py0 = 16, py1 = 96;
  const X = (t) => px0 + ((t - T0) / (T1 - T0)) * (px1 - px0), Y = (v) => py1 - (v / YMAX) * (py1 - py0);
  d += `<div class="ex-legend"><span><i class="lg-rule"></i>US rules of Oct 2022, Oct 2023 and Dec 2024</span><span><i class="lg-peakdot"></i>Peak year</span><span>Shared scale, 0 to 60%</span></div><div class="ex-grid">`;
  firms.forEach((f) => {
    const pts = f.rows.map((r) => [X(tx(r.fyEnd)), Y(r.chinaShare)]);
    const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = line + ` L${pts[pts.length - 1][0].toFixed(1)} ${py1} L${pts[0][0].toFixed(1)} ${py1} Z`;
    let s = `<figure class="ex-panel"><figcaption><b>${esc(f.firm)}</b><span>${esc(f.meta.category || '')}${f.meta.country ? ' · ' + esc(f.meta.country) : ''}</span></figcaption>`;
    s += `<svg viewBox="0 0 ${PW} ${PH}" role="img" aria-label="${esc(f.firm)}: China share of revenue by fiscal year, ${esc(f.first.fiscalYear)} to ${esc(f.last.fiscalYear)}">`;
    [20, 40, 60].forEach((v) => { s += `<line x1="${px0}" y1="${Y(v).toFixed(1)}" x2="${px1}" y2="${Y(v).toFixed(1)}" class="grid"/>`; });
    rules.forEach((r) => { s += `<line x1="${X(r[0]).toFixed(1)}" y1="${py0 - 4}" x2="${X(r[0]).toFixed(1)}" y2="${py1}" class="rule"/>`; });
    s += `<line x1="${px0}" y1="${py1}" x2="${px1}" y2="${py1}" class="axis"/><path d="${area}" class="area"/><path d="${line}" class="line"/>`;
    f.rows.forEach((r, i) => { const p = pts[i]; s += `<a href="${esc(r.source || '#')}" target="_blank" rel="noopener"><circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r === f.peak ? 3.6 : 2.8}" class="pt${r === f.peak ? ' peak' : ''}" ${attrs(r)}/></a>`; });
    const lp = pts[pts.length - 1];
    s += `<text x="${(lp[0] - 6).toFixed(1)}" y="${Math.max(10, lp[1] - 7).toFixed(1)}" class="val" text-anchor="end">${pct(f.last.chinaShare)}</text>`;
    s += `<text x="${px0}" y="${PH - 4}" class="tick">${esc(f.first.fiscalYear)}</text><text x="${px1}" y="${PH - 4}" class="tick" text-anchor="end">${esc(f.last.fiscalYear)}</text></svg></figure>`;
    d += s;
  });
  return d + '</div>';
}


/* ---------------- geopolitics view ---------------- */
let geoBody = '<p>The geopolitics essay is not written yet.</p>', geoDek ='Who holds each chokepoint, how the export-control campaign has unfolded since 2018, and where the chips actually go.';
if (geo) {
  geoDek = geo.meta.oneLiner || geoDek;
  const sources = geo.cites.length ? `<details class="chapter-sources"><summary>Sources for this essay (${geo.cites.length})</summary><ol>${geo.cites.map((c) => `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.url.length > 96 ? c.url.slice(0, 94) + '…' : c.url)}</a><span class="host">${esc(host(c.url))}</span></li>`).join('')}</ol></details>` : '';
  const gparts = splitTakeaways(geo.html); geo.inShort = gparts.inShort;
  const gpb = plainBox(gparts.body, geo.meta.plain, { id: 'geopolitics', cites: geo.cites, figures: [] });
  geoBody = (gparts.inShort ? `<section class="inshort"><h3 class="label">In short</h3>${gparts.inShort}</section>` : '') + nameplate(geo.meta.card, 'Geopolitics') + gpb.box + `<p class="label" style="margin:10px 0 26px">${geo.words.toLocaleString('en-US')} words / ${Math.max(1, Math.round(geo.words / 230))} min</p>` + gpb.html + sources;
}

/* ---------------- sources view ---------------- */
const all = chapters.concat(geo ? [geo] : []);
const sourcesHTML = `<div class="tier-key"><span class="tier tier-A">A</span> primary or institutional · <span class="tier tier-B">B</span> established analyst or top-tier press · <span class="tier tier-C">C</span> specialist press or named analyst</div>` +
  all.map((ch) => { const tc = tierCounts(ch.cites); return `<h3>${pad(ch.number)} · ${esc(ch.title)} <span class="label">${ch.cites.length} sources · A ${tc.A} · B ${tc.B} · C ${tc.C}${tc.D ? ' · below bar ' + tc.D : ''}${tc['?'] ? ' · unclassified ' + tc['?'] : ''}</span></h3><ol>${ch.cites.map((c) => `<li>${tierTag(c.url)}<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.url)}</a></li>`).join('')}</ol>`; }).join('') +
  (matrixNotes ? `<h3>Method: the country-share matrix</h3><div class="prose">${markdown(matrixNotes, { id: 'matrix-notes', cites: [], figures: [] }).html}</div>` : '') +
  (controlsNotes ? `<h3>Method: the threshold map</h3><div class="prose">${markdown(controlsNotes, { id: 'controls-notes', cites: [], figures: [] }).html}</div>` : '') +
  (exposureNotes ? `<h3>Method: the exposure series</h3><div class="prose">${markdown(exposureNotes, { id: 'exposure-notes', cites: [], figures: [] }).html}</div>` : '') +
  `<h3>How this site was made</h3><div class="prose"><p>Compute Chokepoints was made by Yashvardhan Sharma with Claude in September 2026. Yashvardhan set the brief, direction and standards. Claude did the research, writing, design and code: Fable 5.1 orchestrated and designed, and Opus agents wrote the chapters, compiled the datasets and modelled the specimens. Every number links to a public source, and we redraw the figures from those sources. The specimens are procedural point clouds built from primitives, with proportions taken from published dimensions. None of them is a scan. Treat the text and data as a starting point for your own diligence, not as investment advice.</p></div>`;

/* ---------------- briefing (all the "in short" blocks on one page) ---------------- */
const briefingHTML = all.map((ch) => {
  const c = ch.meta.card || {};
  const leaders = (c.leaders || []).slice(0, 3).map((l) => `${esc(l.name)}${l.country ? ` <span class="chip">${esc(l.country)}</span>` : ''}`).join(' · ');
  const href = ch.id === 'geopolitics' ? '#/geopolitics' : `#${esc(ch.id)}`;
  return `<article class="brief-card" id="brief-${esc(ch.id)}">
<div class="brief-head"><span class="n">${pad(ch.number)}</span><a href="${href}" class="t">${esc(ch.title)}</a>
<span class="brief-meta">${c.chokepointScore ? pips(+c.chokepointScore) + `<span class="num">${c.chokepointScore}/5</span>` : ''}${c.concentration ? `<span class="conc ${esc(c.concentration)}">${esc(c.concentration)}</span>` : ''}</span></div>
${ch.meta.oneLiner ? `<p class="brief-lede">${esc(ch.meta.oneLiner)}</p>` : ''}
${ch.inShort ? `<div class="brief-short">${ch.inShort.replace(/<sup class="cite">[\s\S]*?<\/sup>/g, '').replace(/\s+([.,;:])/g, '$1')}</div>` : ''}
${leaders ? `<p class="brief-leaders"><span class="label">Who leads</span> ${leaders}</p>` : ''}
</article>`;
}).join('');

/* ---------------- glossary ---------------- */
const glossary = readJSON(path.join(root, 'data', 'glossary.json'), []);
const chapterTitle = (id) => { const c = all.find((x) => x.id === id); return c ? c.title : null; };
const glossaryHTML = glossary.length ? glossary.slice().sort((a, b) => a.term.localeCompare(b.term)).map((g) => `<div class="gl-entry" data-text="${esc((g.term + ' ' + (g.aka || '') + ' ' + g.plain + ' ' + (g.why || '')).toLowerCase())}">
<dt>${esc(g.term)}${g.aka ? `<span class="aka">${esc(g.aka)}</span>` : ''}</dt>
<dd><p>${esc(g.plain)}</p>${g.why ? `<p class="why">${esc(g.why)}</p>` : ''}${g.chapter && chapterTitle(g.chapter) ? `<a class="gl-link" href="${g.chapter === 'geopolitics' ? '#/geopolitics' : '#' + esc(g.chapter)}">${esc(chapterTitle(g.chapter))} →</a>` : ''}</dd>
</div>`).join('') : '<p>The glossary is not written yet.</p>';

/* ---------------- assemble ---------------- */
const totalWords = all.reduce((a, c) => a + c.words, 0);
const credits = `Made by <b>Yashvardhan Sharma</b> with Claude. Inspired by <a href="https://www.humanityslastmachine.com/" target="_blank" rel="noopener">Humanity's Last Machine</a> and <a href="https://cset.georgetown.edu/publication/the-semiconductor-supply-chain/" target="_blank" rel="noopener">CSET's supply-chain work</a>.`;
const footer = `<p>Compute Chokepoints · The AI chip supply chain, stage by stage · Made by Yashvardhan Sharma with Claude · ${new Date().toISOString().slice(0, 10)}</p><p>Every number on this site links to its source. Corrections and additions are welcome. Built with a dependency-free point-cloud renderer. No scans and no tracking.</p>`;
const suppliersIntro = suppliers.length ? `${suppliers.length} firms across the chain, with what each one makes, where it is based and how hard it would be to replace. Filter by category, country or chokepoint status; copy the result as CSV.` : 'The supplier database is not compiled yet.';

const kit = read(path.join(root, 'src', 'kit.js')) || '';
const specDir = path.join(root, 'specimens');
// each specimen gets its own <script> so a syntax error in one cannot take the others down
const specimens = fs.existsSync(specDir) ? fs.readdirSync(specDir).filter((f) => f.endsWith('.js')).sort().map((f) => `</script><script>/* ${f} */\ntry{(function(PC){\n${read(path.join(specDir, f)).replace(/<\/script/gi, '<\\/script')}\n})(window.PC);}catch(e){console.warn('specimen ${f} failed to load', e);}`).join('\n') : '';
const specNames = new Set((specimens.match(/PC\.register\('([\w-]+)'/g) || []).map((s) => s.match(/'([\w-]+)'/)[1]));
all.forEach((ch) => { const s = ch.meta.specimen; if (s && !specNames.has(s)) warn(`${ch.id}: specimen "${s}" is not built yet`); });
['package', 'globe'].forEach((s) => { if (!specNames.has(s)) warn(`specimen "${s}" (used by hero/geopolitics) is not built yet`); });

const data = { landscape, landscapeNotes, suppliers, timeline, matrix, controls, exposure, chapters: all.map((c) => ({ id: c.id, number: c.number, title: c.title, specimen: c.meta.specimen })) };
let html = read(path.join(root, 'src', 'template.html'));
const fill = (k, v) => { html = html.split(`{{${k}}}`).join(v); };
fill('STYLES', read(path.join(root, 'src', 'styles.css')));
const totalCites = all.reduce((a, c) => a + c.cites.length, 0);
const claimsHTML = `<div><b class="num">${stages.length}</b><span>Stages, quartz<br>to a finished rack</span></div><div class="of-five"><b class="num">${score5}</b><span>Score 5 of 5<br>for concentration</span></div><div><b class="num">${totalCites}</b><span>Sources, one<br>per claim</span></div>`;
fill('THESIS', thesisHTML); fill('CLAIMS', claimsHTML); fill('CHAIN', chainTrack(stages, null));
fill('RAIL', railHTML); fill('CONTENTS', contentsHTML); fill('CHAPTERS', chaptersHTML); fill('CREDITS', credits); fill('FOOTER', footer);
fill('SUPPLIERS_INTRO', suppliersIntro); fill('GEO_DEK', esc(geoDek)); fill('GEO_BODY', geoBody); fill('SOURCES', sourcesHTML);
fill('BRIEFING', briefingHTML); fill('GLOSSARY', glossaryHTML); fill('GLOSSARY_COUNT', String(glossary.length));
fill('CONTROLS_DEK', controls.length ? `${controls.length} thresholds across ${[...new Set(controls.map((c) => c.regime))].length} regimes, and China revenue exposure for ${[...new Set(exposure.map((e) => e.firm))].length} controlled-tool and chip vendors from their own filings.` : 'The threshold map and exposure series are being compiled.');
fill('EXPOSURE_VIZ', exposureViz(exposure));
fill('EXPOSURE_NOTE', exposure.length ? 'Shares computed from filed absolute figures; bases differ by firm (ship-to, bill-to or headquarters) and are stated in each row. Method notes are on the <a href="#/sources">Sources</a> page.' : '');
fill('KIT', kit); fill('SPECIMENS', specimens);
fill('DATA', JSON.stringify(data).replace(/<\/script/gi, '<\\/script'));
fill('APP', read(path.join(root, 'src', 'app.js')));

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'index.html'), html);
const tierTotal = tierCounts([].concat(...all.map((c) => c.cites)));
const report = [`built ${new Date().toISOString()}`, `source tiers: A ${tierTotal.A} · B ${tierTotal.B} · C ${tierTotal.C} · D ${tierTotal.D} · unclassified ${tierTotal['?']}`, `chapters: ${chapters.length}${geo ? ' + geopolitics' : ''}`, `words: ${totalWords}`, `sources: ${all.reduce((a, c) => a + c.cites.length, 0)}`,
  `landscape: ${landscape.length} chips · suppliers: ${suppliers.length} · timeline: ${timeline.length} · matrix: ${matrix.length} · glossary: ${glossary.length} · controls: ${controls.length} · exposure: ${exposure.length}`, `specimens: ${[...specNames].join(', ')}`,
  `size: ${(html.length / 1024).toFixed(0)} KB`, ...all.map((c) => { const tc = tierCounts(c.cites); return `  ${pad(c.number)} ${c.id}: ${c.words} words, ${c.cites.length} sources (D ${tc.D}, ? ${tc['?']}), ${(c.meta.figures || []).length} figures`; }), ...warnings.map((w) => 'WARN ' + w)].join('\n');
fs.writeFileSync(path.join(root, 'dist', 'build-report.txt'), report);
console.log(report);
