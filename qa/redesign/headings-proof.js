#!/usr/bin/env node
/* The proof for the chapter headings (qa/seo/HEADINGS-BRIEF.md in the main checkout, 29 Oct 2026): the sections moved from h3
   to h2 and the subsections from h4 to h3, and a chapter may give a heading words of its own (data/section-headings.json).
   Nothing else may change. Two parts, each run against the site before (the redesign's preview) and after (this branch's):

   dom    every chapter's page at 1440 and 390, light: every id in its article, in order, before and after; its outline after
          (one h1, its sections h2, no level skipped); every element's computed style in the article, on screen and with the
          print media, before and after (the box's place and size too, where no heading's words changed above it); each
          renamed heading's id, data-k, rail entry and phone sheet entry; and the old addresses of a section,
          /<id>/#<anchor> and /#<anchor>, landing on it. Writes <out>/dom.txt and exits 1 on any failure.
   print  every chapter's page laid out for paper as build/pdf.py lays it out before Paged.js runs (src/modules/print.js
          prepare(), then the print media): every element's computed style in the article, the source list and the questions
          print.js adds among them, before and after (the box too, down to the first renamed heading), and the words each
          source of the right running head gives it (string-set in print.css), which must not change. Writes <out>/print.txt.
   shots  Lithography, Memory and HBM, and Systems and Networking at 1440 light, 1440 dark and 390 light: the top, a section
          in the middle ("Who makes it") and the flashcards, each side scrolled to the same element, before and after, as
          <out>/<chapter>-<size>-<place>-<side>.png, with <out>/shots.json naming each frame's renamed headings and their
          boxes, for headings-pair.py.

   usage: node qa/redesign/headings-proof.js dom|print|shots <before base> <after base> <out dir>
   e.g.   node qa/redesign/headings-proof.js dom http://127.0.0.1:8766 http://127.0.0.1:8785 qa/redesign/shots/headings */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const [MODE, BEFORE, AFTER, OUT] = process.argv.slice(2);
if (!/^(dom|print|shots)$/.test(MODE || '') || !BEFORE || !AFTER || !OUT) { console.error('usage: node qa/redesign/headings-proof.js dom|print|shots <before base> <after base> <out dir>'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const root = path.resolve(__dirname, '..', '..');
const CHAPTERS = fs.readdirSync(path.join(root, 'content')).filter((f) => /^\d\d-.*\.md$/.test(f)).sort().map((f) => f.replace(/^\d\d-/, '').replace(/\.md$/, ''));
const RENAMED = (() => { try { return JSON.parse(fs.readFileSync(path.join(root, 'data', 'section-headings.json'), 'utf8')); } catch (e) { return {}; } })();
const slug = (s) => String(s).toLowerCase().replace(/[’'"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// the computed properties compared: everything that draws a heading or moves what follows it
const PROPS = ['display', 'position', 'font-family', 'font-size', 'font-weight', 'font-style', 'font-variation-settings', 'line-height', 'letter-spacing',
  'text-transform', 'text-wrap', 'text-align', 'color', 'background-color', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right',
  'padding-bottom', 'padding-left', 'border-top-width', 'border-top-style', 'border-top-color', 'border-bottom-width', 'max-width', 'width', 'opacity', 'visibility',
  'counter-increment', 'scroll-margin-top', 'break-after', 'break-inside', 'string-set'];
// in the page: every element of the article, in order, with its tag, id, style, its ::before's content and style, its box, and
// whether it holds one of the renamed headings (its height may then change with their words)
const COLLECT = (renamed) => `(function (props, renamed) {
  var art = document.querySelector('article.chapter'); if (!art) return null;
  var els = [art].concat([].slice.call(art.querySelectorAll('*')));
  var y0 = window.scrollY;
  return els.map(function (el) {
    var cs = getComputedStyle(el), b = getComputedStyle(el, '::before'), r = el.getBoundingClientRect();
    var s = {}; props.forEach(function (p) { s[p] = cs.getPropertyValue(p); });
    var heading = /^H[1-6]$/.test(el.tagName);
    var holds = renamed.some(function (i) { var h = document.getElementById(i); return h && h !== el && el.contains(h); });
    return { tag: el.tagName, id: el.id || '', cls: el.getAttribute('class') || '', heading: heading, holds: holds, text: heading ? el.textContent.replace(/#$/, '').trim() : '',
      s: s, before: b.content === 'none' || b.content === 'normal' ? '' : b.content + ' ' + b.fontSize + ' ' + b.fontFamily + ' ' + b.marginBottom + ' ' + b.color,
      box: [Math.round(r.left), Math.round(r.top + y0), Math.round(r.width), Math.round(r.height)] };
  });
})(${JSON.stringify(PROPS)}, ${JSON.stringify(renamed)})`;

async function dom() {
  const chrome = launch(), lines = [], fail = [];
  const say = (s) => { lines.push(s); console.log(s); };
  const bad = (s) => { fail.push(s); say('FAIL ' + s); };
  try {
    for (const id of CHAPTERS) {
      const renamed = RENAMED[id] || {}, renamedIds = new Set(Object.keys(renamed).map((k) => `${id}--${slug(k)}`));
      for (const width of [1440, 390]) {
        const side = {};
        for (const [name, base] of [['before', BEFORE], ['after', AFTER]]) {
          const t = await open(chrome, `${base}/${id}/?theme=light`, { width, wait: 1800 });
          const screen = await t.ev(COLLECT([...renamedIds]));
          // the rail's On this page and, on a phone, the sheet's list of the chapter's sections
          const rail = await t.ev(`[].map.call(document.querySelectorAll('article.chapter .rail-toc a'), function (a) { return [a.getAttribute('href'), a.textContent]; })`);
          let sheet = null;
          if (width < 768) sheet = await t.ev(`(function () { var m = document.querySelector('.stage-menu'); if (!m) return null; m.click(); return [].map.call(document.querySelectorAll('#sheet .sheet-secs a'), function (a) { return [a.getAttribute('href'), a.textContent]; }); })()`);
          await t.s('Emulation.setEmulatedMedia', { media: 'print', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
          await sleep(300);
          const print = await t.ev(COLLECT([...renamedIds]));
          if (t.errors.length) bad(`${id} ${width} ${name}: ${t.errors.join(' | ')}`);
          await t.close();
          side[name] = { screen, print, rail, sheet };
        }
        const A = side.before, B = side.after, tag = `${id} at ${width}`;
        if (!A.screen || !B.screen) { bad(`${tag}: no article`); continue; }
        // 1. ids: every id in the article, in order
        const idsA = A.screen.map((e) => e.id).filter(Boolean), idsB = B.screen.map((e) => e.id).filter(Boolean);
        if (JSON.stringify(idsA) !== JSON.stringify(idsB)) bad(`${tag}: ids differ (${idsA.length} before, ${idsB.length} after): ${idsA.filter((x) => !idsB.includes(x)).concat(idsB.filter((x) => !idsA.includes(x)).map((x) => '+' + x)).slice(0, 6).join(', ')}`);
        // 2. the outline after: one h1, then h2 sections, never a skipped level
        const hs = B.screen.filter((e) => e.heading).map((e) => +e.tag.slice(1));
        const h1s = hs.filter((n) => n === 1).length;
        if (width === 1440) {
          if (h1s !== 1 || hs[0] !== 1) bad(`${tag}: ${h1s} h1, the first heading an h${hs[0]}`);
          for (let k = 1; k < hs.length; k++) if (hs[k] > hs[k - 1] + 1) bad(`${tag}: an h${hs[k]} follows an h${hs[k - 1]}`);
          say(`${id}: ${idsA.length} ids, the same before and after; outline ${hs.map((n) => 'h' + n).join(' ')}`);
        }
        // 3. structure and style: the same elements in the same order, each with the same style; the box too, until the first
        //    renamed heading (below it the words may reflow)
        if (A.screen.length !== B.screen.length) { bad(`${tag}: ${A.screen.length} elements before, ${B.screen.length} after`); continue; }
        for (const [media, a, b] of [['screen', A.screen, B.screen], ['print', A.print, B.print]]) {
          let n = 0, reflow = false;
          a.forEach((ea, k) => {
            const eb = b[k];
            if (ea.cls !== eb.cls || ea.id !== eb.id) { if (n++ < 3) bad(`${tag} ${media}: element ${k} is ${ea.tag}.${ea.cls}#${ea.id} before, ${eb.tag}.${eb.cls}#${eb.id} after`); return; }
            if (ea.heading !== eb.heading) { if (n++ < 3) bad(`${tag} ${media}: element ${k} (${ea.tag}) is a heading on one side only`); return; }
            if (eb.heading && renamedIds.has(eb.id)) reflow = true;
            const diff = PROPS.filter((p) => !(p === 'width' && reflow) && ea.s[p] !== eb.s[p]).map((p) => `${p} ${ea.s[p]} -> ${eb.s[p]}`);
            if (ea.before !== eb.before) diff.push(`::before ${ea.before} -> ${eb.before}`);
            const renamedHere = eb.heading && renamedIds.has(eb.id);
            if (!renamedHere && eb.text !== ea.text) diff.push(`text "${ea.text}" -> "${eb.text}"`);
            const boxOf = (e) => (e.holds ? e.box.slice(0, 3) : e.box); // a block that holds a renamed heading may grow with its words
            if (media === 'screen' && !reflow && JSON.stringify(boxOf(ea)) !== JSON.stringify(boxOf(eb))) diff.push(`box ${ea.box} -> ${eb.box}`);
            if (diff.length && n++ < 6) bad(`${tag} ${media}: ${ea.tag}${ea.id ? '#' + ea.id : ''}.${ea.cls.split(' ')[0]} (${ea.tag} -> ${eb.tag}): ${diff.join('; ')}`);
          });
          if (!n) say(`  ${width} ${media}: ${a.length} elements, every one styled the same${media === 'screen' ? (reflow ? ', each box the same down to the first renamed heading' : ', each box in the same place and size') : ''}`);
        }
        // 4. the renamed headings: shown in their own words, with the short heading's id, data-k and rail entry
        Object.entries(renamed).forEach(([key, words]) => {
          const hid = `${id}--${slug(key)}`, eb = B.screen.find((e) => e.id === hid), ea = A.screen.find((e) => e.id === hid);
          if (!eb || !ea) { bad(`${tag}: no heading #${hid}`); return; }
          if (eb.text !== words) bad(`${tag}: #${hid} reads "${eb.text}", not "${words}"`);
          if (ea.text !== key) bad(`${tag}: #${hid} read "${ea.text}" before, not "${key}"`);
          const ra = A.rail.find((x) => x[0] === '#' + hid), rb = B.rail.find((x) => x[0] === '#' + hid);
          if (!rb || !ra || rb[1] !== ra[1]) bad(`${tag}: the rail's entry for #${hid} is ${JSON.stringify(rb)}, before ${JSON.stringify(ra)}`);
          if (width === 1440) say(`  #${hid}: "${ea.text}" -> "${eb.text}", h${ea.tag.slice(1)} -> h${eb.tag.slice(1)}; rail "${rb && rb[1]}"`);
        });
        if (JSON.stringify(A.rail) !== JSON.stringify(B.rail)) bad(`${tag}: the rail's On this page differs`);
        if (width < 768) {
          if (!A.sheet || !B.sheet || !B.sheet.length) bad(`${tag}: the phone's sheet lists no sections (${JSON.stringify(B.sheet)})`);
          else if (JSON.stringify(A.sheet) !== JSON.stringify(B.sheet)) bad(`${tag}: the phone's sheet differs`);
          else say(`  390: the phone's sheet lists the same ${B.sheet.length} entries as before`);
        }
      }
    }
    // 5. the old addresses of a section still land on it, on both sides
    for (const [name, base] of [['before', BEFORE], ['after', AFTER]]) {
      for (const [url, want] of [['/lithography/#lithography--who-makes-it', 'lithography--who-makes-it'], ['/#lithography--who-makes-it', 'lithography--who-makes-it'],
        ['/memory-and-hbm/#memory-and-hbm--who-makes-it', 'memory-and-hbm--who-makes-it'], ['/#memory-and-hbm--who-makes-it', 'memory-and-hbm--who-makes-it'],
        ['/lithography/#lithography--how-it-works', 'lithography--how-it-works'], ['/systems-and-networking/#systems-and-networking--the-chokepoint', 'systems-and-networking--the-chokepoint']]) {
        const t = await open(chrome, base + url, { width: 1440, wait: 2600 });
        const at = await t.ev(`(function () { var h = document.getElementById(${JSON.stringify(want)}); if (!h) return null; return { path: location.pathname, hash: location.hash, top: Math.round(h.getBoundingClientRect().top), tag: h.tagName, mast: Math.round((document.querySelector('.masthead') || { offsetHeight: 0 }).offsetHeight) }; })()`);
        await t.close();
        const ok = at && at.top >= 0 && at.top <= at.mast + 60;
        (ok ? say : bad)(`${name} ${url}: ${at ? `lands on ${at.path}${at.hash}, the ${at.tag} ${at.top} px from the top (masthead ${at.mast} px)` : 'no such heading'}`);
      }
    }
  } finally { await chrome.close(); }
  say(fail.length ? `\n${fail.length} failures` : '\nall held');
  fs.writeFileSync(path.join(OUT, 'dom.txt'), lines.join('\n') + '\n');
  process.exit(fail.length ? 1 : 0);
}

// the right running head's words on paper, page source by page source: before 29 Oct 2026 each source's text (content(text)),
// since then its data-cp-run (attr(data-cp-run)), which print.js runningHeads() writes; the two selector lists are print.css's,
// before and after
const RUNNING = `(function () {
  if (!document.querySelector('[data-cp-run]')) return [].map.call(document.querySelectorAll('.prose > h3, .plate-head .label, .cp-sources .cp-sources-h, .review .cp-quiz h4.label, .review .rv-keep h4.label'), function (e) { return e.textContent; });
  return [].map.call(document.querySelectorAll('.prose > h2, .plate-head .label, .cp-sources .cp-sources-h, .review .cp-quiz h3.label, .review .rv-keep h3.label'), function (e) { return e.getAttribute('data-cp-run'); });
})()`;
async function print() {
  const chrome = launch(), lines = [], fail = [];
  const say = (s) => { lines.push(s); console.log(s); };
  const bad = (s) => { fail.push(s); say('FAIL ' + s); };
  try {
    for (const id of CHAPTERS) {
      const renamedIds = Object.keys(RENAMED[id] || {}).map((k) => `${id}--${slug(k)}`);
      const side = {};
      for (const [name, base] of [['before', BEFORE], ['after', AFTER]]) {
        const t = await open(chrome, `${base}/${id}/?theme=light`, { width: 1440, wait: 1500 });
        await t.ev(`(function () { window.CP_PRINT.prepare({ chapter: ${JSON.stringify(id)}, edition: '28 October 2026' }); return window.CP_PRINT.fontsReady ? window.CP_PRINT.fontsReady() : 1; })()`);
        await t.s('Emulation.setEmulatedMedia', { media: 'print', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        await sleep(500);
        side[name] = { els: await t.ev(COLLECT(renamedIds)), run: await t.ev(RUNNING) };
        if (t.errors.length) bad(`${id} ${name}: ${t.errors.join(' | ')}`);
        await t.close();
      }
      const a = side.before.els, b = side.after.els;
      if (!a || !b || a.length !== b.length) { bad(`${id}: ${a && a.length} elements before, ${b && b.length} after`); continue; }
      let n = 0, reflow = false;
      a.forEach((ea, k) => {
        const eb = b[k];
        if (ea.cls !== eb.cls || ea.id !== eb.id) { if (n++ < 3) bad(`${id}: element ${k} is ${ea.tag}.${ea.cls}#${ea.id} before, ${eb.tag}.${eb.cls}#${eb.id} after`); return; }
        if (eb.heading && renamedIds.includes(eb.id)) reflow = true;
        const diff = PROPS.filter((p) => !(p === 'width' && reflow) && ea.s[p] !== eb.s[p]).map((p) => `${p} ${ea.s[p]} -> ${eb.s[p]}`);
        if (ea.before !== eb.before) diff.push(`::before ${ea.before} -> ${eb.before}`);
        const boxOf = (e) => (e.holds ? e.box.slice(0, 3) : e.box);
        if (!reflow && JSON.stringify(boxOf(ea)) !== JSON.stringify(boxOf(eb))) diff.push(`box ${ea.box} -> ${eb.box}`);
        if (diff.length && n++ < 6) bad(`${id}: ${ea.tag}${ea.id ? '#' + ea.id : ''}.${ea.cls.split(' ')[0]} (${ea.tag} -> ${eb.tag}): ${diff.join('; ')}`);
      });
      const ra = JSON.stringify(side.before.run), rb = JSON.stringify(side.after.run);
      if (ra !== rb) { bad(`${id}: the running head's words differ: ${ra} -> ${rb}`); n++; }
      const tags = (els) => [...new Set(els.filter((e) => /cp-sources-h|cp-quiz|label/.test(e.cls) && e.heading).map((e) => e.tag + '.' + e.cls))].join(' ');
      if (!n) say(`${id}: ${a.length} elements on paper, every one styled the same${reflow ? ', each box the same down to the first renamed heading' : ', each box in the same place and size'}; running head ${side.after.run.length} sources, the same words (${tags(a)} -> ${tags(b)})`);
    }
  } finally { await chrome.close(); }
  say(fail.length ? `\n${fail.length} failures` : '\nall held');
  fs.writeFileSync(path.join(OUT, 'print.txt'), lines.join('\n') + '\n');
  process.exit(fail.length ? 1 : 0);
}

async function shots() {
  const chrome = launch(), meta = [];
  const PAGES = ['lithography', 'memory-and-hbm', 'systems-and-networking'];
  const SIZES = [['1440-light', 1440, ''], ['1440-dark', 1440, 'dark'], ['390-light', 390, '']];
  try {
    for (const id of PAGES) {
      const renamedIds = Object.keys(RENAMED[id] || {}).map((k) => `${id}--${slug(k)}`);
      for (const [size, width, theme] of SIZES) {
        for (const [place, target] of [['top', ''], ['mid', `${id}--who-makes-it`], ['flashcards', `${id}--flashcards`]]) {
          const frame = { name: `${id}-${size}-${place}`, sides: {} };
          for (const [side, base] of [['before', BEFORE], ['after', AFTER]]) {
            const t = await open(chrome, `${base}/${id}/${theme ? '?theme=' + theme : ''}`, { width, wait: 2600 });
            // the same element at the same height on both sides: the target 120 px under the top of the screen
            if (target) {
              const y = await t.ev(`(function () { var el = document.getElementById(${JSON.stringify(target)}); return el ? Math.round(el.getBoundingClientRect().top + scrollY - 120) : 0; })()`);
              await t.scrollTo(y);
            }
            // every loaded picture decoded first (a lazy one not yet fetched would never settle, so three seconds at most): the
            // phone strip's 52 px still once drew a shade differently in one frame of a run
            await t.ev('Promise.race([Promise.all([].filter.call(document.images, function (i) { return i.complete && i.decode; }).map(function (i) { return i.decode().catch(function () {}); })), new Promise(function (r) { setTimeout(r, 3000); })]).then(function () { return 1; })');
            await sleep(400);
            await t.shot(path.join(OUT, `${frame.name}-${side}.png`));
            // the boxes, in the screenshot's pixels, of the renamed headings and the facts line ("Updated <day>")
            const scale = width < 768 ? 2 : 1;
            frame.sides[side] = await t.ev(`(function (ids, s) { var box = function (el) { if (!el) return null; var r = el.getBoundingClientRect(); return [Math.round(r.left * s), Math.round(r.top * s), Math.round(r.right * s), Math.round(r.bottom * s)]; };
              return { scrollY: Math.round(scrollY), heads: ids.map(function (i) { return [i, box(document.getElementById(i))]; }), meta: box(document.querySelector('article.chapter .ch-meta')) }; })(${JSON.stringify(renamedIds)}, ${scale})`);
            if (t.errors.length) console.log(`${frame.name} ${side}: ${t.errors.join(' | ')}`);
            await t.close();
          }
          meta.push(frame);
        }
        console.log(`${id} ${size}: shot`);
      }
    }
  } finally { await chrome.close(); }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify(meta, null, 1) + '\n');
}

(MODE === 'dom' ? dom() : MODE === 'print' ? print() : shots()).catch((e) => { console.error(e); process.exit(1); });
