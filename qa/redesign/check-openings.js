#!/usr/bin/env node
/* The chapters that open on their explainer (the owner's choice of 21 Nov 2026: round two's rule, in its simpler layout,
   MAIN/qa/ideas-nov2/chapter-open and MAIN/qa/builds-nov/openings). "openOnExplainer" in a chapter's front matter moves its
   first explainer to sit right after In plain terms, a figure as the text's figures are; every other chapter keeps its order.
   The expectations come from content/*.md, and one check pins the set to the owner's seven. It checks
   - the set: the chapters flagged in content/ are the owner's seven (01, 02, 05, 07, 11, 12, 13);
   - the built pages (dist/<id>/ and the book, which paper prints): in the seven, the head runs In plain terms, the
     explainer (data-open on the article, .fig-open on the figure), In short, and the explainer is nowhere else; in the
     nine, nothing stands between In plain terms and In short and the head holds no figure; in all sixteen the figures
     number NN.1 on in the order the page shows them, and the rail lists the same;
   - each chapter's page at 1440 and 390: the same order on screen; in the seven the explainer stands at a figure's left
     edge and width, with a text figure's margins above and below it (the gap under it is In short's), in a text figure's
     frame and ground; no sideways scroll; no page errors;
   - dark, at 1440 and 390, for two of the seven: the same frame and ground as the text's figures;
   - Hide contents at 1440: the explainer moves with the text column, at 720 px;
   - print: the explainer prints between In plain terms and In short, whole (break-inside avoid), as its still and its steps;
   - motion: a film the chapter opens on plays once it is on screen, as the films in the text do.
   usage: node qa/redesign/check-openings.js [base]   (base http://127.0.0.1:8802). Exits 1 on any failure. */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const root = path.resolve(__dirname, '..', '..');
const BASE = (process.argv[2] || 'http://127.0.0.1:8802').replace(/\/$/, '');
// the owner's set (21 Nov 2026): when the owner changes it, change it here with the flags in content/
const OWNER_SEVEN = ['design-and-eda', 'silicon-and-wafers', 'photomasks-and-pellicles', 'metrology-and-inspection', 'substrates-and-pcbs', 'test-and-assembly', 'systems-and-networking'];
let n = 0, bad = 0;
const check = (name, pass, info) => { n++; if (!pass) bad++; console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${info !== undefined && (!pass || process.env.VERBOSE) ? '  ' + (typeof info === 'string' ? info : JSON.stringify(info)) : ''}`); };
const pad = (x) => String(x).padStart(2, '0');

// each chapter as content/*.md gives it: its figures in the order its text places them, the explainer it opens on (as
// build/build.js openingExplainer picks it) and so the order the page should show them in
const chapters = fs.readdirSync(path.join(root, 'content')).filter((f) => /^\d\d-.*\.md$/.test(f)).sort().map((f) => {
  const src = fs.readFileSync(path.join(root, 'content', f), 'utf8'), m = src.match(/^---json\s*\n([\s\S]*?)\n---\s*\n?/);
  const meta = JSON.parse(m[1]), body = src.slice(m[0].length);
  const placed = [...body.matchAll(/^\s*\{\{\s*figure:\s*([\w-]+)\s*\}\}\s*$/gm)].map((x) => x[1]);
  const def = (id) => (meta.figures || []).find((g) => g.id === id) || {};
  const isExp = (id) => ['animation', 'explore'].includes(def(id).type);
  const want = meta.openOnExplainer, opens = want ? (typeof want === 'string' ? want : placed.find(isExp)) : null;
  return { id: meta.id, num: pad(meta.number), opens, order: opens ? [opens].concat(placed.filter((x) => x !== opens)) : placed, video: opens ? !!def(opens).src : false };
});

(async () => {
  /* ---------- the set ---------- */
  const flagged = chapters.filter((c) => c.opens).map((c) => c.id);
  check(`content/: the chapters that open on their explainer are the owner's seven (${OWNER_SEVEN.length})`, flagged.join() === OWNER_SEVEN.join(), flagged.join(', '));
  check('content/: each of the seven opens on an explainer it places', chapters.filter((c) => OWNER_SEVEN.includes(c.id)).every((c) => c.opens), chapters.filter((c) => OWNER_SEVEN.includes(c.id) && !c.opens).map((c) => c.id).join(', '));

  /* ---------- the built pages ---------- */
  const book = fs.readFileSync(path.join(root, 'dist', 'book', 'index.html'), 'utf8');
  for (const c of chapters) {
    for (const [where, html] of [[`/${c.id}/`, fs.readFileSync(path.join(root, 'dist', c.id, 'index.html'), 'utf8')], ['/book/', book]]) {
      const a = html.indexOf(`<article class="chapter" id="${c.id}"`), art = a < 0 ? '' : html.slice(a, html.indexOf('</article>', a));
      const head = art.slice(0, art.indexOf('</header>'));
      // the head's blocks after the specimen, in order
      const blocks = [...head.matchAll(/<(div class="plain"|figure class="figure[^"]*" id="([^"]+)"|section class="inshort")/g)].map((x) => (x[2] ? 'figure:' + x[2].replace(`fig-${c.id}-`, '') : x[1].includes('plain') ? 'plain' : 'inshort'));
      const nums = [...art.matchAll(/<figure class="figure[^"]*" id="(fig-[^"]+)" data-num="([^"]+)"/g)].map((x) => `${x[2]}=${x[1].replace(`fig-${c.id}-`, '')}`).join(' ');
      const want = c.order.map((id, i) => `${c.num}.${i + 1}=${id}`).join(' ');
      const W = `${c.num} ${c.id} ${where}`;
      if (c.opens) {
        check(`${W}: the head runs In plain terms, the explainer (${c.opens}), In short`, blocks.join(' ') === `plain figure:${c.opens} inshort`, blocks.join(' '));
        check(`${W}: the article says it opens on its explainer (data-open), and the figure is marked .fig-open`, /^<article [^>]*data-open="explainer"/.test(art) && new RegExp(`<figure class="figure[^"]* fig-open[^"]*" id="fig-${c.id}-${c.opens}"`).test(art));
        const times = (art.match(new RegExp(`id="fig-${c.id}-${c.opens}"`, 'g')) || []).length;
        check(`${W}: the explainer is on the page once (its text marker places nothing)`, times === 1, `${times} times`);
      } else {
        check(`${W}: unchanged, In plain terms then In short, no figure in the head, no data-open`, blocks.join(' ') === 'plain inshort' && !/^<article [^>]*data-open=/.test(art), blocks.join(' '));
      }
      check(`${W}: the figures number ${c.num}.1 on in the order the page shows them`, nums === want, `${nums} (wants ${want})`);
      if (where !== '/book/') {
        const railList = [...art.matchAll(/<li><a href="#(fig-[^"]+)"><span class="n">([^<]+)<\/span>/g)].map((x) => `${x[2]}=${x[1].replace(`fig-${c.id}-`, '')}`).join(' ');
        check(`${W}: the rail's Figures list the same, in the same order`, railList === want, railList);
      }
    }
  }

  /* ---------- on screen ---------- */
  const chrome = launch();
  const STATE = (id) => `(function(){var a=document.getElementById('${id}'),q=function(s){return a.querySelector(s);};
    var R=function(e){var b=e.getBoundingClientRect();return {t:Math.round(b.top+scrollY),b:Math.round(b.bottom+scrollY),l:Math.round(b.left),w:Math.round(b.width)};};
    var p=q('.plain'),s=q('.inshort'),nx=p.nextElementSibling,f=q('.chapter-head > .figure'),pf=q(':scope > .prose .figure');
    var st=function(e){if(!e)return null;var c=getComputedStyle(e);return [c.borderTopWidth,c.borderTopColor,c.borderLeftWidth,c.borderLeftColor,c.backgroundColor,c.paddingTop,c.maxWidth].join(' ');};
    var o={next:nx&&(nx.matches('.figure')?'figure:'+nx.id:nx.className),inHead:a.querySelectorAll('.chapter-head .figure').length,
      nums:[].map.call(a.querySelectorAll('.figure .fig-k'),function(k){return (/[0-9]{2}[.][0-9]+/.exec(k.textContent)||[''])[0]+'='+k.closest('.figure').id.replace('fig-${id}-','');}).join(' '),
      wide:document.documentElement.scrollWidth-document.documentElement.clientWidth};
    if(f){var fr=R(f),pr=R(pf),cf=getComputedStyle(f),cp=getComputedStyle(pf);o.fig=fr;o.pfig=pr;o.above=fr.t-R(p).b;o.below=R(s).t-fr.b;
      o.wantAbove=Math.round(parseFloat(cp.marginTop));o.wantBelow=Math.round(parseFloat(cp.marginBottom));o.style=st(f);o.pstyle=st(pf);
      o.media=!!f.querySelector('video, .anim-stage[data-live], .xp-stage, .anim-print, img');}
    return o;})()`;
  try {
    for (const width of [1440, 390]) {
      for (const c of chapters) {
        const W = `${c.num} ${c.id} ${width}`;
        const t = await open(chrome, `${BASE}/${c.id}/`, { width, wait: 1800 });
        const S = await t.ev(STATE(c.id));
        const want = c.order.map((id, i) => `${c.num}.${i + 1}=${id}`).join(' ');
        check(`${W}: the figures read ${c.num}.1 on in page order`, S.nums === want, `${S.nums} (wants ${want})`);
        if (c.opens) {
          check(`${W}: right after In plain terms stands the explainer`, S.next === `figure:fig-${c.id}-${c.opens}` && S.inHead === 1, S.next);
          if (!S.fig) check(`${W}: the head holds the explainer, so its place, margins and frame can be measured`, false, 'no figure in the head');
          else {
            check(`${W}: at a text figure's left edge and width (${S.pfig.l} px, ${S.pfig.w} px)`, S.fig.l === S.pfig.l && S.fig.w === S.pfig.w, JSON.stringify({ open: S.fig, text: S.pfig }));
            check(`${W}: a text figure's margins above it (${S.wantAbove} px) and under it, In short's included (${S.wantBelow} px)`, S.above === S.wantAbove && S.below === S.wantBelow, `above ${S.above}, below ${S.below}`);
            check(`${W}: a text figure's frame and ground`, S.style === S.pstyle, `${S.style} | text: ${S.pstyle}`);
            check(`${W}: its film or drawing and its print still are there`, S.media);
          }
        } else {
          check(`${W}: unchanged: In short follows In plain terms, no figure in the head`, S.next === 'inshort' && S.inHead === 0, `${S.next}, ${S.inHead} in the head`);
        }
        check(`${W}: no sideways scroll`, S.wide <= 0, `${S.wide} px`);
        if (width === 1440 && c.opens && S.fig) {
          // print: where it now sits, whole, as its still and its steps
          await t.s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(300);
          const P = await t.ev(`(function(){var a=document.getElementById('${c.id}'),f=a.querySelector('.chapter-head > .figure'),p=a.querySelector('.plain'),s=a.querySelector('.inshort');
            var img=f.querySelector('.anim-print, .xp-print img, img'),cs=getComputedStyle(f);
            return {order:p.getBoundingClientRect().bottom<=f.getBoundingClientRect().top+1&&f.getBoundingClientRect().bottom<=s.getBoundingClientRect().top+1,shown:cs.display!=='none'&&f.getClientRects().length>0,
              avoid:cs.breakInside,img:img?getComputedStyle(img).display:'none',steps:[].filter.call(f.querySelectorAll('.anim-transcript li, .xp-print-steps li, li'),function(l){return l.getClientRects().length}).length,k:f.querySelector('.fig-k').textContent};})()`);
          check(`${W}: print: between In plain terms and In short, whole, its still and steps shown, "${P.k.split(' · ')[0]}" kept`, P.order && P.shown && P.avoid === 'avoid' && P.img !== 'none' && P.steps > 1 && P.k.startsWith(`Figure ${c.num}.1`), P);
          await t.s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
        }
        check(`${W}: no page errors`, !t.errors.length, t.errors.join(' | '));
        await t.close();
      }
    }

    /* ---------- dark ---------- */
    for (const id of ['test-and-assembly', 'metrology-and-inspection']) for (const width of [1440, 390]) {
      const c = chapters.find((x) => x.id === id), W = `${c.num} ${id} ${width} dark`;
      const t = await open(chrome, `${BASE}/${id}/`, { width, theme: 'dark', wait: 1800 });
      const S = await t.ev(STATE(id)), theme = await t.ev(`document.documentElement.getAttribute('data-theme')`);
      check(`${W}: the explainer after In plain terms, in a text figure's frame and ground`, theme === 'dark' && S.next === `figure:fig-${id}-${c.opens}` && S.style === S.pstyle, `${theme} ${S.next} ${S.style} | ${S.pstyle}`);
      check(`${W}: no page errors`, !t.errors.length, t.errors.join(' | '));
      await t.close();
    }

    /* ---------- Hide contents ---------- */
    {
      const t = await open(chrome, `${BASE}/design-and-eda/`, { width: 1440, wait: 1800 });
      await t.ev(`document.querySelector('#design-and-eda .rail-hide').click()`); await sleep(400);
      const r = await t.ev(`(function(){var a=document.getElementById('design-and-eda');if(!a.querySelector('.fig-open'))return {off:false,missing:true};var f=a.querySelector('.fig-open').getBoundingClientRect(),p=a.querySelector('.plain').getBoundingClientRect(),g=a.querySelector('.prose .figure').getBoundingClientRect();return {off:document.documentElement.classList.contains('rail-off'),f:[Math.round(f.left),Math.round(f.width)],p:Math.round(p.left),g:[Math.round(g.left),Math.round(g.width)]};})()`);
      check('01 1440, contents hidden: the explainer moves with the text column, on its left edge at 720 px, as the text figures do', r.off && r.f[0] === r.p && r.f[1] === 720 && r.f[0] === r.g[0] && r.g[1] === 720, r);
      await t.close();
    }

    /* ---------- motion ---------- */
    for (const c of chapters.filter((x) => x.opens && x.video).slice(0, 2)) for (const width of [1440, 390]) {
      const W = `${c.num} ${c.id} ${width} motion`, F = `#fig-${c.id}-${c.opens}`;
      const t = await open(chrome, `${BASE}/${c.id}/`, { width, motion: true, wait: 1800 });
      await t.ev(`(function(){document.documentElement.style.scrollBehavior='auto';document.querySelector('${F}').scrollIntoView({block:'center'});return 1})()`); await sleep(2500);
      const a = await t.ev(`(function(){var v=document.querySelector('${F} video');return v?{paused:v.paused,t:v.currentTime}:null;})()`);
      await sleep(800);
      const b = await t.ev(`(function(){var v=document.querySelector('${F} video');return v?{paused:v.paused,t:v.currentTime}:null;})()`);
      check(`${W}: on screen, the film plays`, a && b && !b.paused && b.t > a.t, JSON.stringify({ a, b }));
      check(`${W}: no page errors`, !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(`\n${n - bad} of ${n} checks pass${bad ? `, ${bad} FAIL` : ''}`);
  process.exit(bad ? 1 : 0);
})();
