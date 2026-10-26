#!/usr/bin/env node
/* QA gate 5, the layout sweep, by DOM measurement on the redesign's preview (127.0.0.1:8766).
   Each page at 320, 390, 768, 1024, 1280 and 1440 px wide, in light and in dark:
     - sideways scroll: document.documentElement.scrollWidth <= innerWidth;
     - small text: every element that holds visible text, and every SVG <text>, renders at 11 px or more (an SVG label's
       size is its font size times the drawing's scale on screen);
     - clipped text: an element that hides its overflow and whose text is wider or taller than its box, unless it ends in an
       ellipsis on purpose (text-overflow: ellipsis or a line clamp);
     - overlapping text: two text boxes from different elements in the same layer that cross by more than 3 px each way,
       in the first three screens;
     - focus: Tab is pressed up to --tabs times and each control it reaches must draw a focus mark (an outline, a box
       shadow or a border that changes).
   --set chapters (stage 2) measures every chapter instead: each of the 17 in The Chain, landed on by its anchor (the first three
   screens are then its opener, specimen and card, and Tab starts at the chapter), and each readable page dist/<chapter>/.
   usage: node qa/redesign/sweep.js [--set chapters|glossary] [--only walk,lithography] [--widths 390,1440] [--tabs 40] [--out qa/redesign/sweep.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, sleep } = require('./cdp.js');

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8766');
const WIDTHS = opt('widths', '320,390,768,1024,1280,1440').split(',').map(Number);
const THEMES = opt('themes', 'light,dark').split(',');
const TABS = +opt('tabs', 40);
const ONLY = (opt('only', '') || '').split(',').filter(Boolean);
const OUT = opt('out', path.join(__dirname, 'sweep.txt'));
const CHAPTERS = fs.readdirSync(path.join(__dirname, '..', '..', 'content')).filter((f) => /^\d\d-.*\.md$/.test(f)).sort()
  .map((f) => { const m = fs.readFileSync(path.join(__dirname, '..', '..', 'content', f), 'utf8').match(/"id":\s*"([^"]+)"/); return m ? m[1] : f.replace(/^\d\d-|\.md$/g, ''); });
const SET = opt('set', '');
const PAGES = SET === 'chapters' ? CHAPTERS.map((id) => ['chain-' + id, '/#' + id]).concat(CHAPTERS.map((id) => ['page-' + id, '/' + id + '/'])).filter(([n]) => !ONLY.length || ONLY.includes(n)) : [['walk', '/#/'], ['chain', '/#/chain'], ['ai-chips', '/#/landscape'], ['suppliers', '/#/suppliers'], ['suppliers-by-country', '/#/suppliers?tab=country'],
  ['export-controls', '/#/controls'], ['china-revenue', '/#/exposure'], ['glossary', '/#/glossary'],
  ['page-lithography', '/lithography/'], ['page-geopolitics', '/geopolitics/'], ['page-summary', '/summary/'], ['page-chips', '/chips/'],
  ['page-suppliers', '/suppliers/'], ['page-export-controls', '/export-controls/'], ['page-glossary', '/glossary/']].filter(([n]) => !ONLY.length || ONLY.includes(n));
// --set glossary (the Glossary as a dictionary, redesign option B): the view at rest, with a term open in the sheet, with a country's card
// open, and /glossary/
if (SET === 'glossary') PAGES.splice(0, PAGES.length, ...[['glossary', '/#/glossary'], ['glossary-entry', '/#gl-euv'], ['glossary-country', '/#lk-country-nl'], ['page-glossary', '/glossary/']].filter(([n]) => !ONLY.length || ONLY.includes(n)));

const MEASURE = `(() => {
  const st = document.createElement('style'); st.textContent = 'article.chapter{content-visibility:visible!important}'; document.head.appendChild(st); // the chain's chapters only: a closed <details> must stay closed
  const W = innerWidth, de = document.documentElement, out = { sw: de.scrollWidth, W, small: [], clipped: [], overlap: [] };
  const name = (el) => (el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\\s+/).slice(0, 2).join('.') : '')).slice(0, 70);
  const shown = (el) => { for (let p = el; p && p.nodeType === 1; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
  const srOnly = (el) => { for (let p = el; p && p.nodeType === 1; p = p.parentElement) { const r = p.getBoundingClientRect(); const cs = getComputedStyle(p); if ((r.width <= 1 && r.height <= 1) || cs.clip === 'rect(0px, 0px, 0px, 0px)' || cs.clipPath === 'inset(50%)') return true; } return false; };
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const texts = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue;
    if (/^(SCRIPT|STYLE|NOSCRIPT|TITLE|OPTION)$/.test(el.tagName)) continue;
    seen.add(el);
    if (!el.getClientRects().length || !shown(el) || srOnly(el)) continue;
    const fold = el.closest('details'); if (fold && !fold.open && !el.closest('summary')) continue; // a closed <details> shows only its summary
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
  // overlap: text boxes in the first three screens, element against element, not one inside the other
  const layer = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.position === 'fixed' || cs.position === 'sticky') return p; } return null; };
  const boxes = [];
  for (const el of texts) {
    const rg = document.createRange(); rg.selectNodeContents(el);
    // a glyph box runs past its line when line-height is under 1, so each box is cut to the line's own height
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    for (const q of rg.getClientRects()) {
      if (q.width < 2 || q.height < 2 || q.bottom < 0 || q.top > innerHeight * 3 || q.right < 0 || q.left > W) continue; // off-screen copies (left: -10000px) are not on the page
      let r = { left: q.left, right: q.right, top: q.top, bottom: q.bottom };
      if (lh && lh < q.height) { const c = (q.top + q.bottom) / 2; r = { left: q.left, right: q.right, top: c - lh / 2, bottom: c + lh / 2 }; }
      // text an ancestor clips (a line clamp, a scroller) counts only where it shows
      for (let p = el; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(cs.overflowX + cs.overflowY)) { const b = p.getBoundingClientRect(); r = { left: Math.max(r.left, b.left), right: Math.min(r.right, b.right), top: Math.max(r.top, b.top), bottom: Math.min(r.bottom, b.bottom) }; } }
      if (r.right - r.left < 2 || r.bottom - r.top < 2) continue;
      boxes.push({ el, r, L: layer(el) });
    }
  }
  for (let i = 0; i < boxes.length && out.overlap.length < 12; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    if (a.el === b.el || a.L !== b.L || a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const ox = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), oy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (ox > 3 && oy > 3) { out.overlap.push(name(a.el) + ' x ' + name(b.el) + ' at ' + Math.round(a.r.left) + ',' + Math.round(a.r.top)); if (out.overlap.length >= 12) break; }
  }
  st.remove();
  return out;
})()`;

const FOCUS = `(() => {
  const a = document.activeElement; if (!a || a === document.body || a === document.documentElement) return null;
  const cs = getComputedStyle(a), ok = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
  let mark = ok;
  if (!ok) { // a field shows focus on its box (:focus-within)
    for (let p = a.parentElement; p && p !== document.body && !mark; p = p.parentElement) { const c = getComputedStyle(p); if (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) mark = true; }
  }
  const r = a.getBoundingClientRect();
  return { ok: mark, name: (a.tagName.toLowerCase() + (a.id ? '#' + a.id : '') + (typeof a.className === 'string' && a.className.trim() ? '.' + a.className.trim().split(/\\s+/)[0] : '')) + ' "' + (a.getAttribute('aria-label') || a.textContent || '').trim().slice(0, 24) + '"', vis: r.width > 0 && r.height > 0 };
})()`;

(async () => {
  const chrome = launch();
  const lines = [], fails = [];
  let loads = 0;
  try {
    for (const [pname, url] of PAGES) for (const theme of THEMES) for (const width of WIDTHS) {
      const { targetId } = await chrome.send('Target.createTarget', { url: 'about:blank' });
      const { sessionId } = await chrome.send('Target.attachToTarget', { targetId, flatten: true });
      const s = (m, p) => chrome.send(m, p, sessionId);
      let loaded = false; const on = (m) => { if (m.sessionId === sessionId && m.method === 'Page.loadEventFired') loaded = true; }; chrome.on(on);
      try {
        const phone = width < 768;
        await s('Page.enable'); await s('Runtime.enable');
        await s('Emulation.setDeviceMetricsOverride', { width, height: phone ? 844 : 900, deviceScaleFactor: 1, mobile: phone });
        if (phone) await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
        await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        const [b, h] = url.split('#');
        await s('Page.navigate', { url: BASE + b + (b.includes('?') ? '&' : '?') + 'theme=' + theme + (h !== undefined ? '#' + h : '') });
        for (let t = 0; !loaded && t < 300; t++) await sleep(100);
        const ev = async (e) => { const r = await s('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text); return r.result.value; };
        await ev('document.fonts.ready.then(() => 1)'); await sleep(1500);
        const m = await ev(MEASURE); loads++;
        // focus: Tab through the page from the top
        const bad = []; let reached = 0;
        // a chapter landed on by its anchor: Tab starts at the chapter (its first control is the next stop); any other page from the top
        const startAt = h && /^[a-z0-9-]+$/.test(h) ? h : '';
        if (startAt) await ev(`(function(){var e=document.getElementById(${JSON.stringify(startAt)});if(!e)return 0;e.setAttribute('tabindex','-1');e.focus({preventScroll:true});e.removeAttribute('tabindex');return 1;})()`);
        else await ev('(window.scrollTo(0,0), document.activeElement && document.activeElement.blur && document.activeElement.blur(), 1)');
        for (let k = 0; k < TABS; k++) {
          await s('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
          await s('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
          await sleep(40);
          const f = await ev(FOCUS); if (!f) continue;
          reached++;
          if (f.vis && !f.ok) bad.push(f.name);
        }
        const where = `${pname} ${theme} ${width}`;
        const probs = [];
        if (m.sw > m.W) probs.push(`scrolls sideways: ${m.sw} > ${m.W}`);
        if (m.small.length) probs.push(`text under 11 px (${m.small.length}): ` + m.small.slice(0, 6).join('; '));
        if (m.clipped.length) probs.push(`clipped (${m.clipped.length}): ` + m.clipped.slice(0, 5).join('; '));
        if (m.overlap.length) probs.push(`overlap (${m.overlap.length}): ` + m.overlap.slice(0, 5).join('; '));
        if (bad.length) probs.push(`no focus mark (${bad.length} of ${reached}): ` + [...new Set(bad)].slice(0, 6).join('; '));
        const line = `${where}: ${probs.length ? probs.join(' | ') : 'ok'} (tabbed ${reached})`;
        lines.push(line); console.log(line);
        if (probs.length) fails.push(line);
      } catch (e) { const line = `${pname} ${theme} ${width}: ERROR ${e.message}`; lines.push(line); fails.push(line); console.log(line); }
      finally { chrome.off(on); await chrome.send('Target.closeTarget', { targetId }).catch(() => {}); }
    }
  } finally { await chrome.close(); }
  fs.writeFileSync(OUT, lines.join('\n') + `\n\n${loads} loads, ${fails.length} with findings\n`);
  console.log(`\nsweep: ${loads} loads, ${fails.length} with findings; wrote ${OUT}`);
  process.exit(0);
})();
