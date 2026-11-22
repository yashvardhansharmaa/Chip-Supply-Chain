#!/usr/bin/env node
/* The specimen plates (built 21 Nov 2026: the owner's "exploded plates, refined", src/plate.js and plates/<name>.js), on every
   chapter's page at 1440 and 390, light and dark, driven as a reader would:
   - the plate renders (its canvas carries ink) and settles: the entrance ends, and no frame is asked for once it rests, so a
     settled plate costs nothing; the globe (16) is the one that keeps turning, and its turn goes on;
   - a drag turns it and its labels fade while it turns, then on release it eases back to its drawn view and the labels return
     (under reduced motion it snaps back at once, checked on Lithography);
   - the arrow keys turn it, and after a moment it eases back;
   - pointing at a label, or at a part on the plate, lights that part; in the four chapters with a parts list the list lights
     with it, and a row of the list lights the plate (Stage.setFocus);
   - at 390 the collapsed strip shows the plate's still (light or dark with the page) and the canvas stays out of reach, so the
     page keeps its scroll; opened, the plate draws and a finger turns it;
   - print shows the plate as a vector still (src/modules/print.js stills), and the live canvas does not print;
   - no page errors and no sideways scroll.
   usage: node qa/redesign/check-plates.js [base]   (base http://127.0.0.1:8802). Exits 1 on any failure.
   Nothing leaves this machine but the font requests (qa/redesign/cdp.js resolves every other host to nothing). */
'use strict';
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const STAGES = require('../../build/stages.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8802').replace(/\/$/, '');
const root = path.resolve(__dirname, '..', '..');
const parts = require(path.join(root, 'data', 'specimen-parts.json'));
const chapters = STAGES.fromContent(root);
const out = []; let bad = 0, n = 0;
// the lit rows: the chapter's list and, where the page has one, the phone strip's copy of it, all on the one part
const sameN = (on, n) => !!on && on.split(',').every((x) => x === String(n));
const check = (name, ok, detail) => { n++; out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail != null && detail !== '' ? ': ' + detail : ''}`); if (!ok) bad++; };

// the plate's state, read from the stage
const STATE = `(function () { var S = CP.Stage, c = S.canvas, x = c.getContext('2d'), d = c.width && c.height ? x.getImageData(0, 0, c.width, c.height).data : [], ink = 0;
  for (var i = 3; i < d.length; i += 4 * 7) if (d[i] > 40) ink++;
  return { name: S.cur && S.cur.name, wants: (document.querySelector('article.chapter') || { getAttribute: function () { return ''; } }).getAttribute('data-specimen'), k: S.inK(), raf: S.raf, yaw: S.userYaw, pitch: S.userPitch, labA: S.labA, max: S.turnMax, spin: S.spinYaw, spins: !!(S.cur && S.cur.spin), ink: ink, w: Math.round(S.w), h: Math.round(S.h),
    focus: S.cur && S.cur.pl.focus ? (S.cur.pl.focus.n || S.cur.pl.focus.text) : null, focusN: S.focusN, on: [].map.call(document.querySelectorAll('.ch-parts li.on'), function (li) { return li.getAttribute('data-n'); }).join(),
    sw: document.documentElement.scrollWidth > innerWidth + 1 }; })()`;

(async () => {
  const chrome = launch();
  try {
    for (const width of [1440, 390]) for (const theme of ['light', 'dark']) for (const c of chapters) {
      const id = c.id, W = `${id} ${width} ${theme}`, phone = width < 900, hasParts = !!(parts[id] && (parts[id].parts || []).length);
      const t = await open(chrome, `${BASE}/${id}/`, { width, theme, motion: true, wait: 600 });
      const s = t.s;
      const mouse = async (type, x, y, extra) => s('Input.dispatchMouseEvent', Object.assign({ type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1 }, extra || {}));
      const touch = async (type, x, y) => s('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
      const key = async (k, code, vk, up) => { await s('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk }); if (up !== false) await s('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk }); };
      // bring the plate into view: the slot on a wide screen, the opened strip on a phone
      if (phone) {
        const th = await t.ev(`(function () { var s = document.querySelector('.stage'), i = s.querySelector('.stage-thumb'), cv = s.querySelector('canvas'); return { collapsed: s.getAttribute('data-collapsed'), src: i.getAttribute('src') || '', shown: !i.hidden && getComputedStyle(i).display !== 'none' && i.naturalWidth > 0, canvasOut: getComputedStyle(cv).visibility === 'hidden' }; })()`);
        check(`${W}: the collapsed strip shows the plate's still, ${theme}`, th.collapsed === '1' && th.shown && new RegExp(`plate-${id}-thumb${theme === 'dark' ? '-dark' : ''}\\.webp$`).test(th.src), JSON.stringify(th));
        check(`${W}: the collapsed strip's canvas is out of reach, so the page keeps its scroll`, th.canvasOut);
        await t.ev(`(document.querySelector('.stage-toggle').click(), 1)`);
      } else {
        await t.ev(`(function () { document.documentElement.style.scrollBehavior = 'auto'; var c = document.querySelector('.ch-spec-draw'); scrollTo(0, c.getBoundingClientRect().top + scrollY - 120); return 1; })()`);
      }
      await sleep(3300); // the entrance (2.6 s) and the labels after it
      let S = await t.ev(STATE);
      check(`${W}: the plate renders`, !!S.name && S.name === S.wants && S.ink > 200, `${S.name}, ${S.ink} inked samples, ${S.w}x${S.h}`);
      check(`${W}: the plate settles${S.spins ? ' (the globe keeps turning)' : ''}`, S.k === 1 && S.labA === 1 && (S.spins ? S.raf !== 0 : S.raf === 0), JSON.stringify({ k: S.k, labA: S.labA, raf: S.raf }));
      if (S.spins) {
        const a = S.spin; await sleep(1000); const b = (await t.ev(STATE)).spin;
        check(`${W}: the globe keeps turning`, b > a + 0.02, `${a.toFixed(3)} to ${b.toFixed(3)}`);
      }
      // a drag: the plate turns and its labels fade, then it eases back and the labels return
      const box = await t.ev(`(function () { var r = CP.Stage.canvas.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      if (phone) { await touch('touchStart', box.x, box.y); for (let k = 1; k <= 8; k++) { await touch('touchMove', box.x + k * 12, box.y + k * 2); await sleep(25); } }
      else { await mouse('mouseMoved', box.x, box.y); await mouse('mousePressed', box.x, box.y); for (let k = 1; k <= 8; k++) { await mouse('mouseMoved', box.x + k * 14, box.y + k * 2, { button: 'left', buttons: 1 }); await sleep(25); } }
      await sleep(250);
      const mid = await t.ev(STATE);
      if (phone) await touch('touchEnd'); else await mouse('mouseReleased', box.x + 112, box.y + 16);
      check(`${W}: a drag turns the plate${phone ? ' (a finger, in the opened strip)' : ''}`, Math.abs(mid.yaw) > 0.15, `yaw ${mid.yaw.toFixed(2)}`);
      check(`${W}: its labels fade while it turns`, mid.labA === 0, `labels at ${mid.labA}`);
      check(`${W}: the turn stays in range (40 degrees of yaw, 20 of tilt)`, S.spins || (Math.abs(mid.yaw) <= 0.7 && Math.abs(mid.pitch) <= 0.35), `yaw ${mid.yaw.toFixed(2)}, tilt ${mid.pitch.toFixed(2)}`);
      await sleep(1300);
      const back = await t.ev(STATE);
      check(`${W}: on release it eases back to its drawn view and the labels return`, back.yaw === 0 && back.pitch === 0 && back.labA === 1 && (back.spins || back.raf === 0), JSON.stringify({ yaw: back.yaw, labA: back.labA, raf: back.raf }));
      // the arrow keys
      await t.ev(`(CP.Stage.canvas.focus({ preventScroll: true }), 1)`);
      await key('ArrowRight', 'ArrowRight', 39); await key('ArrowRight', 'ArrowRight', 39); await key('ArrowDown', 'ArrowDown', 40);
      await sleep(120);
      const kb = await t.ev(STATE);
      check(`${W}: the arrow keys turn it`, kb.yaw > 0.15 && kb.pitch > 0.05 && kb.labA < 1, `yaw ${kb.yaw.toFixed(2)}, tilt ${kb.pitch.toFixed(2)}, labels ${kb.labA.toFixed(2)}`);
      await sleep(1800);
      const kb2 = await t.ev(STATE);
      check(`${W}: and it eases back after the keys`, kb2.yaw === 0 && kb2.pitch === 0 && kb2.labA === 1, JSON.stringify({ yaw: kb2.yaw, labA: kb2.labA }));
      await t.ev(`(CP.Stage.canvas.blur(), 1)`);
      // pointing at a label, then at a part, lights it; a row of the parts list lights the plate
      const tgt = await t.ev(`(function () { var S = CP.Stage, pl = S.cur.pl, r = S.canvas.getBoundingClientRect(), hits = pl._hit || [], lab = hits[0], part = null;
        for (var i = (pl._pick || []).length - 1; i >= 0 && !part; i--) { var e = pl._pick[i], cx = 0, cy = 0; if (e.pts) { e.pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= e.pts.length; cy /= e.pts.length; } else { cx = e.dots[0][0]; cy = e.dots[0][1]; }
          if (cx < 2 || cy < 2 || cx > S.w - 2 || cy > S.h - 2) continue;
          if (hits.some(function (b) { return cx >= b.x0 && cx <= b.x1 && cy >= b.y0 && cy <= b.y1; })) continue; var c = pl.hitAt(cx, cy); if (c) part = { x: r.left + cx, y: r.top + cy, n: c.n, text: c.text }; }
        return { lab: lab ? { x: r.left + (lab.x0 + lab.x1) / 2, y: r.top + (lab.y0 + lab.y1) / 2, n: lab.c.n, text: lab.c.text } : null, part: part }; })()`);
      if (!phone) {
        if (tgt.lab) {
          await mouse('mouseMoved', tgt.lab.x, tgt.lab.y); await sleep(150);
          const h = await t.ev(STATE);
          check(`${W}: pointing at a label lights its part${hasParts ? ' and the parts list' : ''}`, h.focus === (tgt.lab.n || tgt.lab.text) && (!hasParts || (h.focusN === tgt.lab.n && sameN(h.on, tgt.lab.n))), JSON.stringify({ want: tgt.lab.n || tgt.lab.text, focus: h.focus, on: h.on }));
          await mouse('mouseMoved', 4, 4); await sleep(100);
        } else check(`${W}: the plate has labels to point at`, false);
        if (tgt.part) {
          await mouse('mouseMoved', tgt.part.x, tgt.part.y); await sleep(150);
          const h = await t.ev(STATE);
          check(`${W}: pointing at a part on the plate lights it${hasParts && tgt.part.n ? ' and the list' : ''}`, h.focus === (tgt.part.n || tgt.part.text) && (!(hasParts && tgt.part.n) || sameN(h.on, tgt.part.n)), JSON.stringify({ want: tgt.part.n || tgt.part.text, focus: h.focus, on: h.on }));
          await mouse('mouseMoved', 4, 4); await sleep(100);
        } else check(`${W}: a part on the plate answers the pointer`, false, 'no labelled part found under a face');
        if (hasParts) {
          const li = await t.ev(`(function () { var li = document.querySelector('#${id} .ch-parts li[data-n="2"]'); li.scrollIntoView({ block: 'center' }); var r = li.getBoundingClientRect(); return { x: r.left + 40, y: r.top + r.height / 2 }; })()`);
          await mouse('mouseMoved', li.x, li.y); await sleep(150);
          const h = await t.ev(STATE);
          check(`${W}: a row of the parts list lights its part on the plate`, h.focusN === 2 && h.focus === 2, JSON.stringify({ focusN: h.focusN, focus: h.focus }));
          await mouse('mouseMoved', 4, 4);
        }
      } else if (hasParts) {
        // a tap on a row of the opened strip's list lights its part, and a second tap lets it go
        const li = await t.ev(`(function () { var li = document.querySelector('#stage-caption .ch-parts li[data-n="1"]'); if (!li) return null; li.scrollIntoView({ block: 'nearest' }); var r = li.getBoundingClientRect(); return { x: r.left + 30, y: r.top + r.height / 2 }; })()`);
        if (li) { await touch('touchStart', li.x, li.y); await touch('touchEnd'); await sleep(250); }
        const h = await t.ev(STATE);
        check(`${W}: a tap on a part in the opened strip's list lights it on the plate`, !!li && h.focusN === 1 && h.focus === 1, JSON.stringify({ focusN: h.focusN, focus: h.focus }));
      } else if (tgt.lab) {
        await touch('touchStart', tgt.lab.x, tgt.lab.y); await touch('touchEnd'); await sleep(250);
        const h = await t.ev(STATE);
        check(`${W}: a tap on a label in the opened strip lights its part`, h.focus === tgt.lab.text, JSON.stringify({ want: tgt.lab.text, focus: h.focus }));
      }
      // print: the vector still, and no live canvas
      const pr = await t.ev(`(function () { CP_PRINT.stills(); var s = document.querySelector('article.chapter .ch-spec .cp-still svg'); return { svg: !!s, items: s ? s.querySelectorAll('*').length : 0, label: s ? s.getAttribute('aria-label').slice(0, 30) : '' }; })()`);
      await s('Emulation.setEmulatedMedia', { media: 'print' }); await sleep(150);
      const pr2 = await t.ev(`(function () { var d = document.querySelector('article.chapter .ch-spec-draw'), s = document.querySelector('article.chapter .ch-spec .cp-still svg'); return { draw: getComputedStyle(d).display, still: s ? getComputedStyle(s).display : 'none' }; })()`);
      await s('Emulation.setEmulatedMedia', { media: 'screen', features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
      check(`${W}: print shows the plate as a vector still, and not the live canvas`, pr.svg && pr.items > 60 && pr2.draw === 'none' && pr2.still !== 'none', JSON.stringify(Object.assign(pr, pr2)));
      const fin = await t.ev(STATE);
      check(`${W}: no sideways scroll`, !fin.sw);
      check(`${W}: no page errors`, !t.errors.length, t.errors.slice(0, 3).join(' | '));
      await t.close();
    }
    // reduced motion: no entrance, and a release snaps straight back
    {
      const t = await open(chrome, `${BASE}/lithography/`, { width: 1440, wait: 1200 });
      await t.ev(`(function () { document.documentElement.style.scrollBehavior = 'auto'; var c = document.querySelector('.ch-spec-draw'); scrollTo(0, c.getBoundingClientRect().top + scrollY - 120); return 1; })()`);
      await sleep(500);
      const S0 = await t.ev(STATE);
      check('lithography reduced motion: drawn at rest at once, nothing moving', S0.k === 1 && S0.labA === 1 && S0.raf === 0, JSON.stringify({ k: S0.k, raf: S0.raf }));
      const box = await t.ev(`(function () { var r = CP.Stage.canvas.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      await t.s('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
      for (let k = 1; k <= 6; k++) await t.s('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x + k * 15, y: box.y, button: 'left', buttons: 1 });
      const mid = await t.ev(STATE);
      await t.s('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x + 90, y: box.y, button: 'left', clickCount: 1 });
      await sleep(80);
      const S1 = await t.ev(STATE);
      check('lithography reduced motion: a drag turns it, and the release snaps back with no easing', Math.abs(mid.yaw) > 0.15 && S1.yaw === 0 && S1.labA === 1, JSON.stringify({ mid: mid.yaw, after: S1.yaw, labA: S1.labA }));
      check('lithography reduced motion: no page errors', !t.errors.length, t.errors.join(' | '));
      await t.close();
    }
  } finally { await chrome.close(); }
  console.log(out.join('\n'));
  console.log(`\n${n - bad} of ${n} checks pass${bad ? `; ${bad} fail` : ''}`);
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
