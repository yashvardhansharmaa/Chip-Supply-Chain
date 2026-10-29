#!/usr/bin/env node
/* Shots of a chapter's specimen (the labels branch, 29 Oct 2026): the plate at 1440 (the drawing in its slot, its caption and
   parts list), and on a phone at 390 the strip at the foot of the screen, collapsed (64 px, shot at three times its size so the
   52 px thumbnail can be judged) and opened. Light and dark. Motion is reduced, so the drawing holds the angle it opens on.
   It also prints where each balloon stands, so a change to the runtime can be checked for balloons that moved.
   usage: node qa/redesign/shots-labels.js <base> <out dir> <tag> <chapter>[?query] [<chapter>[?query] ...]
   e.g.   node qa/redesign/shots-labels.js http://127.0.0.1:8786 qa/redesign/labels before memory-and-hbm memory-and-hbm?hbm=a */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const [BASE, OUT, TAG, ...PAGES] = process.argv.slice(2);
if (!BASE || !OUT || !TAG || !PAGES.length) { console.error('usage: node qa/redesign/shots-labels.js <base> <out dir> <tag> <chapter>[?query] ...'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const WIDTHS = (process.env.WIDTHS || '1440,390').split(',').map(Number);
const THEMES = (process.env.THEMES || 'light,dark').split(',');
const BALLOONS = `(function(){var s=document.querySelector('.ch-balloons');if(!s||s.style.display==='none')return [];return [].map.call(s.querySelectorAll('g'),function(g){var b=g.querySelector('.bal'),n=g.querySelector('.nm');return g.querySelector('.num').textContent+' '+n.textContent+' @'+Math.round(+b.getAttribute('cx'))+','+Math.round(+b.getAttribute('cy'))+' name@'+Math.round(+n.getAttribute('x'))+','+Math.round(+n.getAttribute('y'))+' '+n.getAttribute('text-anchor');});})()`;
(async () => {
  const chrome = launch();
  try {
    for (const pg of PAGES) {
      const [id, q] = pg.split('?');
      const name = id + (q ? '-' + q.replace(/[=&]/g, '') : '');
      for (const width of WIDTHS) {
        for (const theme of THEMES) {
          const url = `${BASE}/${id}/${q ? '?' + q : ''}`;
          const t = await open(chrome, url, { width, theme: theme === 'dark' ? 'dark' : '', wait: 2500 });
          const f = `${name}-${width}-${theme}-${TAG}`;
          if (width >= 900) {
            await t.ev(`(function(){var s=document.querySelector('.ch-spec');document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,s.getBoundingClientRect().top+scrollY-90);return 1;})()`);
            await sleep(2600);
            const r = await t.ev(`(function(){var s=document.querySelector('.ch-spec'),c=s.querySelector('canvas'),b=s.getBoundingClientRect(),cb=c?c.getBoundingClientRect():b,top=Math.min(b.top,cb.top);return {x:b.left-40,y:top+scrollY-10,w:b.width+80,h:b.bottom-top+20};})()`);
            const shot = await t.s('Page.captureScreenshot', { format: 'png', clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 } });
            fs.writeFileSync(path.join(OUT, f + '.png'), Buffer.from(shot.data, 'base64'));
            console.log(f, JSON.stringify(await t.ev(BALLOONS)));
          } else {
            await t.ev("(document.documentElement.style.scrollBehavior='auto', window.scrollTo(0, 1400), 1)"); await sleep(1200);
            const r = await t.ev(`(function(){var b=document.querySelector('.stage').getBoundingClientRect();return {x:b.left,y:b.top+scrollY,w:b.width,h:b.height};})()`);
            const shot = await t.s('Page.captureScreenshot', { format: 'png', clip: { x: r.x, y: r.y, width: r.w, height: r.h, scale: 3 } });
            fs.writeFileSync(path.join(OUT, f + '-strip.png'), Buffer.from(shot.data, 'base64'));
            await t.ev("(function(){var r=document.querySelector('.stage .stage-tag').getBoundingClientRect(),e=document.elementFromPoint(r.left+20,r.top+r.height/2);if(e)e.click();return 1;})()");
            await sleep(2600);
            await t.shot(path.join(OUT, f + '-open.png'));
            console.log(f, JSON.stringify(await t.ev(BALLOONS)));
          }
          if (t.errors.length) console.log(`  errors: ${t.errors.join(' | ')}`);
          await t.close();
        }
      }
    }
  } finally { await chrome.close(); }
  process.exit(0);
})();
