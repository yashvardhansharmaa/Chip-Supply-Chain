#!/usr/bin/env node
/* The full-page layout check (redesign-type, 27 Oct 2026). qa/redesign/sweep.js looks for overlapping text in the first three
   screens only; this looks at every text box on the whole page, element against element in the same layer (bucketed by
   64 px bands, so a long page stays quick), plus sideways scroll, text under 11 px and clipped text, as sweep.js measures
   them. Content-visibility is forced visible, so every part is laid out; the far face of a turned flashcard is skipped.
   usage: node qa/redesign/sweep-full.js <base> <widths> <out> "<name>|<url>" ...
   e.g.   node qa/redesign/sweep-full.js http://127.0.0.1:8773 320,390,768,1024,1280,1440 /tmp/full.txt "lithography|/#lithography" */
'use strict';
const fs = require('fs');
const [BASE, widths, OUT, ...specs] = process.argv.slice(2);
const { launch, open } = require('./cdp.js');
const MEASURE = `(async () => {
  const st = document.createElement('style'); st.textContent = '*{content-visibility:visible!important}'; document.head.appendChild(st);
  await new Promise((r) => setTimeout(r, 400));
  const W = innerWidth, de = document.documentElement, out = { sw: de.scrollWidth, W, small: [], clipped: [], overlap: [], boxes: 0 };
  const name = (el) => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '')).slice(0, 70);
  const shown = (el) => { for (let p = el; p && p.nodeType === 1; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
  const srOnly = (el) => { for (let p = el; p && p.nodeType === 1; p = p.parentElement) { const r = p.getBoundingClientRect(); const cs = getComputedStyle(p); if ((r.width <= 1 && r.height <= 1) || cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)') return true; } return false; };
  const seen = new Set(), texts = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue;
    if (/^(SCRIPT|STYLE|NOSCRIPT|TITLE|OPTION)$/.test(el.tagName)) continue;
    seen.add(el);
    if (!el.getClientRects().length || !shown(el) || srOnly(el)) continue;
    let away = false; for (let p = el; p && p !== document.body; p = p.parentElement) { const c = getComputedStyle(p); if (c.backfaceVisibility === 'hidden' && c.transform !== 'none' && new DOMMatrix(c.transform).m11 < 0) { away = true; break; } }
    if (away) continue; // the far face of a flipped card
    const fold = el.closest('details'); if (fold && !fold.open && !el.closest('summary')) continue;
    const cs = getComputedStyle(el);
    let px = parseFloat(cs.fontSize);
    if (el instanceof SVGElement && el.getScreenCTM) { const m = el.getScreenCTM(); if (m) px = px * Math.hypot(m.a, m.b); }
    if (px < 10.95) out.small.push(name(el) + ' ' + px.toFixed(1) + 'px "' + n.nodeValue.trim().slice(0, 30) + '"');
    if (!(el instanceof SVGElement)) {
      const clips = /(hidden|clip)/.test(cs.overflowX + cs.overflowY);
      const ell = cs.textOverflow === 'ellipsis' || cs.webkitLineClamp !== 'none';
      if (clips && !ell && (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 3) && el.clientWidth > 0) out.clipped.push(name(el) + ' ' + el.scrollWidth + 'x' + el.scrollHeight + ' in ' + el.clientWidth + 'x' + el.clientHeight);
    }
    texts.push(el);
  }
  const layer = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.position === 'fixed' || cs.position === 'sticky') return p; } return null; };
  const boxes = [];
  for (const el of texts) {
    const rg = document.createRange(); rg.selectNodeContents(el);
    const lh = parseFloat(getComputedStyle(el).lineHeight); const L = layer(el);
    for (const q of rg.getClientRects()) {
      if (q.width < 2 || q.height < 2 || q.right < 0 || q.left > W) continue;
      let r = { left: q.left, right: q.right, top: q.top, bottom: q.bottom };
      if (lh && lh < q.height) { const c = (q.top + q.bottom) / 2; r = { left: q.left, right: q.right, top: c - lh / 2, bottom: c + lh / 2 }; }
      for (let p = el; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(cs.overflowX + cs.overflowY)) { const b = p.getBoundingClientRect(); r = { left: Math.max(r.left, b.left), right: Math.min(r.right, b.right), top: Math.max(r.top, b.top), bottom: Math.min(r.bottom, b.bottom) }; } }
      if (r.right - r.left < 2 || r.bottom - r.top < 2) continue;
      boxes.push({ el, r, L });
    }
  }
  out.boxes = boxes.length;
  const B = 64, buckets = new Map();
  boxes.forEach((b, i) => { for (let k = Math.floor(b.r.top / B); k <= Math.floor(b.r.bottom / B); k++) { if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(i); } });
  const done = new Set();
  for (const idx of buckets.values()) {
    for (let x = 0; x < idx.length && out.overlap.length < 20; x++) for (let y = x + 1; y < idx.length; y++) {
      const i = idx[x], j = idx[y], key = i * 1e6 + j; if (done.has(key)) continue; done.add(key);
      const a = boxes[i], b = boxes[j];
      if (a.el === b.el || a.L !== b.L || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
      if (ox > 3 && oy > 3) { out.overlap.push(name(a.el) + ' "' + a.el.textContent.trim().slice(0, 20) + '" x ' + name(b.el) + ' "' + b.el.textContent.trim().slice(0, 20) + '" at ' + Math.round(a.r.left) + ',' + Math.round(a.r.top + scrollY)); if (out.overlap.length >= 20) break; }
    }
  }
  st.remove();
  return out;
})()`;
(async () => {
  const chrome = launch(); const lines = []; let bad = 0, loads = 0;
  try {
    for (const spec of specs) for (const w of widths.split(',').map(Number)) {
      const [name, url] = spec.split('|');
      const t = await open(chrome, BASE + url, { width: w, wait: 1800 });
      try {
        const m = await t.ev(MEASURE); loads++;
        const probs = [];
        if (m.sw > m.W) probs.push(`scrolls sideways: ${m.sw} > ${m.W}`);
        if (m.small.length) probs.push(`under 11 px (${m.small.length}): ` + m.small.slice(0, 6).join('; '));
        if (m.clipped.length) probs.push(`clipped (${m.clipped.length}): ` + m.clipped.slice(0, 6).join('; '));
        if (m.overlap.length) probs.push(`overlap (${m.overlap.length}): ` + m.overlap.slice(0, 8).join('; '));
        if (probs.length) bad++;
        const line = `${name} ${w}: ${probs.length ? probs.join(' | ') : 'ok'} (${m.boxes} boxes)`; lines.push(line); console.log(line);
      } catch (e) { bad++; const line = `${name} ${w}: ERROR ${e.message}`; lines.push(line); console.log(line); }
      finally { await t.close(); }
    }
  } finally { await chrome.close(); }
  fs.writeFileSync(OUT, lines.join('\n') + `\n\n${loads} loads, ${bad} with findings\n`);
  console.log(`full page: ${loads} loads, ${bad} with findings`);
})();
