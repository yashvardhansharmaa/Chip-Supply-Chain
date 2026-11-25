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
   Since 22 Nov 2026 (the plates critique, qa/builds-nov/plates-critique/CURATED.md, builder A) also:
   - each label lights its own part and nothing else, on all sixteen (in Node, from the kit): every leader's target lights, and
     no part another label points at lights with it;
   - no leader crosses another leader or a dimension (src/plate.js layCols, read from the plate's layout); how far any leader
     runs over a part it does not name is printed, as information;
   - the first entrance ends with one slow turn of about 12 degrees and back; a drag turns about 0.16 degrees a pixel; the
     labels start back before the plate is at rest; a click that does not move pins a part, and a second one lets it go;
   - the canvas is named for its specimen and its labels and described by its caption; a plate with no parts list has a list
     of its labels for the keyboard, and an item with the focus lights its part;
   - the drawing stands 40 px under the opener's links and 24 px over its caption; the small stills read: at least 10 percent ink
     and at most 35 percent of their box near black (since 24 Nov 2026, colour C; see the check below);
   - from 640 px the plate shows in the page and the strip keeps Contents alone (768); on a phone the opened strip sizes its
     canvas to the plate, shows the whole parts list, and keeps the plate's first dimension and the HBM loupe.
   Since 22 Nov 2026 (plates refine) also: every label stands inside the plate's width, and on a phone also with the names
   spelled out in rows, as a page that shows the names rather than the numbers draws it.
   usage: node qa/redesign/check-plates.js [base] [--only id,id] [--widths 1440,390] [--themes light,dark]   (base http://127.0.0.1:8802).
   With no --widths or --themes: 1440 and 390 in both themes, and 768 in light.
   Exits 1 on any failure.
   Nothing leaves this machine but the font requests (qa/redesign/cdp.js resolves every other host to nothing). */
'use strict';
const path = require('path');
const { launch, open, sleep } = require('./cdp.js');
const STAGES = require('../../build/stages.js');
const opt = (k) => { const i = process.argv.indexOf('--' + k); return i > 0 ? String(process.argv[i + 1] || '').split(',').filter(Boolean) : null; };
const BASE = (process.argv[2] && !/^--/.test(process.argv[2]) ? process.argv[2] : 'http://127.0.0.1:8802').replace(/\/$/, '');
const root = path.resolve(__dirname, '..', '..');
const parts = require(path.join(root, 'data', 'specimen-parts.json'));
const chapters = STAGES.fromContent(root).filter((c) => !opt('only') || opt('only').includes(c.id));
const out = []; let bad = 0, n = 0;
// the lit rows: the chapter's list and, where the page has one, the phone strip's copy of it, all on the one part
const sameN = (on, n) => !!on && on.split(',').every((x) => x === String(n));
const check = (name, ok, detail) => { n++; out.push(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail != null && detail !== '' ? ': ' + detail : ''}`); if (!ok) bad++; };
const info = (line) => out.push(`info ${line}`);

// each label lights its own part and nothing else: run the kit in Node, as build/build.js does
{
  const kit = require(path.join(root, 'build', 'plates.js'))(root, () => {});
  const P = kit.load();
  kit.names.filter((nm) => nm !== 'hbm-loupe').forEach((nm) => {
    const m = P.build(nm), solidLit = (f, it) => P.lit(f, it), decalLit = (f, it) => it.kind === 'solid' && it.decals.some((d) => d.items.some((q) => P.lit(f, q, it)));
    m.callouts.forEach((c) => {
      const f = P.focusOf(c), T = c._targets || [];
      const unlit = T.filter((t) => !t.beam && !(t.decal ? decalLit(f, t.it) : solidLit(f, t.it)));
      const theirs = m.callouts.filter((o) => o !== c).flatMap((o) => (o._targets || []).filter((t) => t.it && !t.decal && !T.some((u) => u.it === t.it)).map((t) => t.it));
      const stray = m.S.filter((it) => solidLit(f, it) && theirs.includes(it));
      check(`${nm}: "${c.text}" lights its own part and nothing else`, T.length > 0 && !unlit.length && !stray.length, `${T.length} targets${unlit.length ? `, ${unlit.length} unlit` : ''}${stray.length ? `, lights ${stray.length} another label points at` : ''}`);
    });
  });
}

// the plate's state, read from the stage
const STATE = `(function () { var S = CP.Stage, c = S.canvas, x = c.getContext('2d'), d = c.width && c.height ? x.getImageData(0, 0, c.width, c.height).data : [], ink = 0;
  for (var i = 3; i < d.length; i += 4 * 7) if (d[i] > 40) ink++;
  return { name: S.cur && S.cur.name, wants: (document.querySelector('article.chapter') || { getAttribute: function () { return ''; } }).getAttribute('data-specimen'), k: S.inK(), raf: S.raf, yaw: S.userYaw, pitch: S.userPitch, labA: S.labA, max: S.turnMax, spin: S.spinYaw, spins: !!(S.cur && S.cur.spin), ink: ink, w: Math.round(S.w), h: Math.round(S.h),
    focus: S.cur && S.cur.pl.focus ? (S.cur.pl.focus.n || S.cur.pl.focus.text) : null, focusN: S.focusN, on: [].map.call(document.querySelectorAll('.ch-parts li.on'), function (li) { return li.getAttribute('data-n'); }).join(),
    sw: document.documentElement.scrollWidth > innerWidth + 1 }; })()`;

(async () => {
  const chrome = launch();
  try {
    const runs = opt('widths') || opt('themes') ? [].concat(...(opt('widths') || ['1440', '390']).map((wd) => (opt('themes') || ['light', 'dark']).map((th) => [+wd, th])))
      : [[1440, 'light'], [1440, 'dark'], [768, 'light'], [390, 'light'], [390, 'dark']];
    for (const [width, theme] of runs) for (const c of chapters) {
      const id = c.id, W = `${id} ${width} ${theme}`, phone = width < 640, hasParts = !!(parts[id] && (parts[id].parts || []).length);
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
      // the entrance (2.6 s, and the 0.9 s turn that ends it) and the labels after it, watched frame by frame for the cue's turn
      const ent = await t.ev(`new Promise(function (res) { var S = CP.Stage, t0 = performance.now(), cue = 0; (function f() { cue = Math.max(cue, Math.abs(S.cueYaw ? S.cueYaw() : 0)); if (performance.now() - t0 < 4300) requestAnimationFrame(f); else res({ cue: cue, spins: !!(S.cur && S.cur.spin) }); })(); })`);
      if (!ent.spins) check(`${W}: the first entrance ends with one slow turn and back, about 12 degrees`, Math.abs(ent.cue * 180 / Math.PI - 12) < 1.5, `${(ent.cue * 180 / Math.PI).toFixed(1)} degrees`);
      await sleep(300);
      let S = await t.ev(STATE);
      check(`${W}: the plate renders`, !!S.name && S.name === S.wants && S.ink > 200, `${S.name}, ${S.ink} inked samples, ${S.w}x${S.h}`);
      check(`${W}: the plate settles${S.spins ? ' (the globe keeps turning)' : ''}`, S.k === 1 && S.labA === 1 && (S.spins ? S.raf !== 0 : S.raf === 0), JSON.stringify({ k: S.k, labA: S.labA, raf: S.raf }));
      if (S.spins) {
        const a = S.spin; await sleep(1000); const b = (await t.ev(STATE)).spin;
        check(`${W}: the globe keeps turning`, b > a + 0.02, `${a.toFixed(3)} to ${b.toFixed(3)}`);
      }
      // the labels' layout: no leader over another leader or a dimension
      const lay = await t.ev(`(function () { var pl = CP.Stage.cur.pl, s = pl._layStats; return { rows: pl.rowsOn(CP.Stage.w), stats: s ? { cross: s.cross, dims: s.dims, labels: s.labels.map(function (x) { return x.text + ' ' + Math.round(x.foreign) + ' px'; }) } : null }; })()`);
      if (!lay.rows) {
        check(`${W}: no leader crosses another leader or a dimension`, !!lay.stats && lay.stats.cross === 0 && lay.stats.dims === 0, lay.stats ? `${lay.stats.cross} crossings, ${lay.stats.dims} over a dimension` : 'no layout');
        if (lay.stats && width === 1440 && theme === 'light') info(`${id}: leaders over parts they do not name: ${lay.stats.labels.join(', ')}`);
      }
      // every label stands inside the plate's width (its hit box, 4 px round the label), on the stage; on a phone also with the
      // names spelled out in rows (as a page that shows the names rather than the numbers draws it), laid out off screen at the
      // strip's width (22 Nov 2026 plates refine: the transistor's lower row ran off a phone's right edge)
      const fitW = await t.ev(`(function () { var S = CP.Stage, pl = S.cur.pl, w = S.w, out = function (hs, ww) { return (hs || []).filter(function (b) { return b.x0 < -4.5 || b.x1 > ww + 4.5; }).map(function (b) { return b.c.text + ' ' + Math.round(b.x0) + '..' + Math.round(b.x1); }); };
        var r = { stage: out(pl._hit, w), w: Math.round(w), names: null };
        if (${phone ? 'true' : 'false'}) { var p2 = new PLATE.Plate(S.cur.name, {}); if (S.parts) p2.names(S.parts); var h2 = p2.heightFor(w, 150, 560), c2 = document.createElement('canvas'); c2.width = Math.round(w); c2.height = h2;
          var st = { k: 1, mode: { oneDim: true }, dark: false, el: S.canvas }; p2.render(c2.getContext('2d'), w, h2, 1, st); p2.render(c2.getContext('2d'), w, h2, 1, st); if (p2.wantsFrame) p2.render(c2.getContext('2d'), w, h2, 1, st);
          r.names = out(p2._hit, w); r.rows = p2.rowsOn(w); r.n = (p2._hit || []).length; }
        return r; })()`);
      check(`${W}: every label stands inside the plate's width`, !fitW.stage.length, fitW.stage.join(', ') || `${fitW.w} px`);
      if (phone) check(`${W}: with the names spelled out${fitW.rows ? ' in rows' : ''}, every label stands inside the width`, fitW.names && !fitW.names.length && fitW.n > 0, (fitW.names || []).join(', ') || `${fitW.n} labels in ${fitW.w} px`);
      // the canvas's name and description; the keyboard's list of labels on a plate with no parts list
      const a11y = await t.ev(`(function () { var S = CP.Stage, c = S.canvas, d = document.getElementById(c.getAttribute('aria-describedby') || ''), names = (window.CP_TERMS || {}).specimenNames || {}, nm = names[S.cur.name] || '';
        var keys = document.querySelectorAll('.plate-keys li'); return { label: c.getAttribute('aria-label') || '', role: c.getAttribute('role'), desc: d ? d.textContent.slice(0, 40) : '', name: nm, texts: S.cur.pl.m.callouts.map(function (x) { return x.text.replace(/\u00a0/g, ' '); }), keys: keys.length, parts: !!S.parts }; })()`);
      check(`${W}: the canvas is named for its specimen and its labels, and described by its caption`, a11y.role === 'img' && !!a11y.name && a11y.label.toLowerCase().indexOf(a11y.name.toLowerCase()) === 0 && a11y.texts.every((x) => a11y.label.indexOf(x) >= 0) && a11y.desc.length > 20 && !/drag/i.test(a11y.label), a11y.label.slice(0, 90));
      if (!a11y.parts && !phone) {
        check(`${W}: a plate with no parts list has its labels in a list for the keyboard`, a11y.keys === a11y.texts.length, `${a11y.keys} of ${a11y.texts.length}`);
        if (a11y.keys) {
          await t.ev(`(document.querySelector('.plate-keys li').focus(), 1)`); await sleep(150);
          const kf = await t.ev(STATE);
          check(`${W}: an item of that list with the focus lights its part`, String(kf.focus || '').replace(/\u00a0/g, ' ') === a11y.texts[0], JSON.stringify({ focus: kf.focus }));
          await t.ev(`(document.activeElement.blur(), 1)`); await sleep(100);
        }
      }
      if (!phone) {
        // one rhythm round the plate: 40 px from the opener's links to the drawing's ink, 24 px from its lowest ink to the caption
        const sp = await t.ev(`(function () { var S = CP.Stage, c = S.canvas, x = c.getContext('2d'), W = c.width, H = c.height, d = x.getImageData(0, 0, W, H).data, top = -1, bot = -1;
          for (var y = 0; y < H && top < 0; y++) for (var i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 25) { top = y; break; }
          for (y = H - 1; y >= 0 && bot < 0; y--) for (i = 0; i < W; i++) if (d[(y * W + i) * 4 + 3] > 25) { bot = y; break; }
          var k = c.getBoundingClientRect().height / H, r = c.getBoundingClientRect(), art = c.closest('article.chapter'), cap = art.querySelector('.ch-spec-cap');
          // what stands over the plate: the opener, or under 1200 px the line of links between them
          var pb = [art.querySelector('.ch-open'), art.querySelector('.ch-rail')].map(function (e) { return e ? e.getBoundingClientRect().bottom : -1e9; }).filter(function (b) { return b <= r.top + 1; });
          return { above: Math.round(r.top + top * k - Math.max.apply(null, pb)), below: Math.round(cap.getBoundingClientRect().top - (r.top + bot * k)), hosted: !!S.hostEl, strip: document.querySelector('.stage').getAttribute('data-hosted') }; })()`);
        check(`${W}: the plate shows in the page${width < 900 ? ', and the strip keeps Contents alone' : ''}`, sp.hosted && (width >= 900 || sp.strip === '1'), JSON.stringify({ hosted: sp.hosted, strip: sp.strip }));
        // (the globe keeps room round it for the pins that come round as it turns)
        if (!S.spins) check(`${W}: the drawing stands about 40 px under the opener and 24 px over its caption`, Math.abs(sp.above - 40) <= 10 && Math.abs(sp.below - 24) <= 10, `${sp.above} px above, ${sp.below} px below`);
      }
      if (width === 1440 && theme === 'light') {
        // the small stills (the phone strip's and the contents') read: not too faint and not too heavy or dark.
        // - ink, as build/plate-stills.js measures it: each pixel's cover times its darkness, over the drawing's box. At least 10
        //   percent, so a still is never faint.
        // - near black: the share of the box whose colour over the white ground is darker than luminance 0.3. At most 35 percent,
        //   so no still turns into a dark mass that hides its parts.
        // Until 24 Nov 2026 the rule was 10 to 25 percent ink, written for the line drawings. In colour every face's fill counts as
        // ink (the twelve final plates' stills carry 16 to 42 percent), so its upper bound no longer measured weight. The near
        // black share does: those twelve stills carry 0 to 31 percent (the dark baseboard and the black rack the most).
        const ink = await t.ev(`Promise.all(['thumb', 'line'].map(function (k) { return new Promise(function (res) { var im = new Image(); im.onload = function () { var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d'); x.drawImage(im, 0, 0); var d = x.getImageData(0, 0, c.width, c.height).data, W = c.width, H = c.height, x0 = W, y0 = H, x1 = 0, y1 = 0, s = 0, dk = 0, i, a, b, al, lu;
          for (b = 0; b < H; b++) for (a = 0; a < W; a++) if (d[(b * W + a) * 4 + 3] > 8) { if (a < x0) x0 = a; if (a > x1) x1 = a; if (b < y0) y0 = b; if (b > y1) y1 = b; }
          for (b = y0; b <= y1; b++) for (a = x0; a <= x1; a++) { i = (b * W + a) * 4; al = d[i + 3] / 255; lu = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; s += al * (1 - lu); if (al * lu + 1 - al < 0.3) dk++; }
          var n = (x1 - x0 + 1) * (y1 - y0 + 1); res(x1 < x0 ? [0, 0] : [s / n, dk / n]); }; im.onerror = function () { res([-1, -1]); }; im.src = '../media/plate-${id}-' + k + '.webp'; }); }))`);
        check(`${W}: the small stills read: at least 10 percent ink, at most 35 percent near black`, ink.every((v) => v[0] >= 0.10 && v[1] <= 0.35),
          `strip ${(ink[0][0] * 100).toFixed(0)} percent ink, ${(ink[0][1] * 100).toFixed(0)} near black; contents ${(ink[1][0] * 100).toFixed(0)} percent ink, ${(ink[1][1] * 100).toFixed(0)} near black`);
      }
      // a drag: the plate turns and its labels fade, then it eases back and the labels return
      const box = await t.ev(`(function () { var r = CP.Stage.canvas.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
      if (phone) { await touch('touchStart', box.x, box.y); for (let k = 1; k <= 8; k++) { await touch('touchMove', box.x + k * 12, box.y + k * 2); await sleep(25); } }
      else { await mouse('mouseMoved', box.x, box.y); await mouse('mousePressed', box.x, box.y); for (let k = 1; k <= 8; k++) { await mouse('mouseMoved', box.x + k * 14, box.y + k * 2, { button: 'left', buttons: 1 }); await sleep(25); } }
      await sleep(250);
      const mid = await t.ev(STATE);
      if (phone) await touch('touchEnd'); else await mouse('mouseReleased', box.x + 112, box.y + 16);
      check(`${W}: a drag turns the plate${phone ? ' (a finger, in the opened strip)' : ''}`, Math.abs(mid.yaw) > 0.15, `yaw ${mid.yaw.toFixed(2)}`);
      // about 0.16 degrees a pixel while the turn is in the middle of its range (the drag ran 112 px across, less the 3 px that
      // tell a turn from a click)
      if (!S.spins) check(`${W}: the turn follows the hand at about 0.16 degrees a pixel`, Math.abs(Math.abs(mid.yaw) * 180 / Math.PI / (phone ? 96 : 112) - 0.16) < 0.03, `${(Math.abs(mid.yaw) * 180 / Math.PI).toFixed(1)} degrees for ${phone ? 96 : 112} px`);
      check(`${W}: its labels fade while it turns`, mid.labA === 0, `labels at ${mid.labA}`);
      check(`${W}: the turn stays in range (40 degrees of yaw, 20 of tilt)`, S.spins || (Math.abs(mid.yaw) <= 0.7 && Math.abs(mid.pitch) <= 0.35), `yaw ${mid.yaw.toFixed(2)}, tilt ${mid.pitch.toFixed(2)}`);
      if (!S.spins) {
        // the labels start back while the plate is still turning in, within about 4 degrees of its drawn view
        const lb = await t.ev(`new Promise(function (res) { var S = CP.Stage, t0 = performance.now(), seen = null; (function f() { if (seen == null && S.labA > 0.02 && (Math.abs(S.userYaw) > 1e-4 || S.back)) seen = S.userYaw * 180 / Math.PI; if (performance.now() - t0 < 900) requestAnimationFrame(f); else res(seen); })(); })`);
        check(`${W}: the labels start back before the plate is at rest, within about 4 degrees`, lb != null && Math.abs(lb) <= 4.5, lb == null ? 'not before rest' : `at ${lb.toFixed(1)} degrees`);
      }
      await sleep(600);
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
      // pointing at a label, then at a part, lights it; a row of the parts list lights the plate (since 24 Nov 2026 the pick list
      // also holds lines, a wire, a heavy line on a face or a light path, as { line })
      const tgt = await t.ev(`(function () { var S = CP.Stage, pl = S.cur.pl, r = S.canvas.getBoundingClientRect(), hits = pl._hit || [], lab = hits[0], part = null;
        for (var i = (pl._pick || []).length - 1; i >= 0 && !part; i--) { var e = pl._pick[i], cx = 0, cy = 0; if (e.pts) { e.pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= e.pts.length; cy /= e.pts.length; } else if (e.line) { cx = (e.line[0][0] + e.line[1][0]) / 2; cy = (e.line[0][1] + e.line[1][1]) / 2; } else { cx = e.dots[0][0]; cy = e.dots[0][1]; }
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
        if (tgt.lab) {
          // a click that does not move pins the label's part; the pointer leaving keeps it; a second click lets it go
          const lb2 = await t.ev(`(function () { var S = CP.Stage, pl = S.cur.pl, r = S.canvas.getBoundingClientRect(), b = (pl._hit || [])[0]; return b ? { x: r.left + (b.x0 + b.x1) / 2, y: r.top + (b.y0 + b.y1) / 2, n: b.c.n, text: b.c.text } : null; })()`);
          await mouse('mouseMoved', lb2.x, lb2.y); await mouse('mousePressed', lb2.x, lb2.y); await mouse('mouseReleased', lb2.x, lb2.y); await sleep(120);
          await mouse('mouseMoved', 4, 4); await sleep(150);
          const pin = await t.ev(STATE);
          await mouse('mouseMoved', lb2.x, lb2.y); await mouse('mousePressed', lb2.x, lb2.y); await mouse('mouseReleased', lb2.x, lb2.y); await sleep(120);
          await mouse('mouseMoved', 4, 4); await sleep(150);
          const unpin = await t.ev(STATE);
          check(`${W}: a still click pins a part, and a second one lets it go`, pin.focus === (lb2.n || lb2.text) && !unpin.focus, JSON.stringify({ pinned: pin.focus, after: unpin.focus }));
        }
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
        // a tap on a label; read again after a moment if the first read comes before the frame that lights it
        await touch('touchStart', tgt.lab.x, tgt.lab.y); await touch('touchEnd'); await sleep(250);
        let h = await t.ev(STATE);
        if (h.focus !== tgt.lab.text) { await sleep(400); h = await t.ev(STATE); }
        check(`${W}: a tap on a label in the opened strip lights its part`, h.focus === tgt.lab.text, JSON.stringify({ want: tgt.lab.text, focus: h.focus }));
      }
      if (phone) {
        // the opened strip: the canvas as tall as the plate needs, the whole parts list in view, the plate's first dimension and
        // the HBM loupe kept
        const op = await t.ev(`(function () { var S = CP.Stage, st = document.querySelector('.stage'), cv = S.canvas, cap = document.querySelector('#stage-caption'), cr = cap.getBoundingClientRect(), lis = cap.querySelectorAll('.ch-parts li'), pl = S.cur.pl;
          var allIn = [].every.call(lis, function (li) { var r = li.getBoundingClientRect(); return r.top >= cr.top - 1 && r.bottom <= cr.bottom + 1 && r.bottom <= innerHeight + 1; });
          return { h: Math.round(cv.getBoundingClientRect().height), want: parseFloat(st.style.getPropertyValue('--strip-draw-h')) || 0, rows: lis.length, allIn: allIn, scrolled: cap.scrollTop, oneDim: !!pl.o.oneDim, dims: pl.m.dims.length, loupe: !!pl.m.loupe, loupeOn: pl.loupeOn() }; })()`);
        check(`${W}: the opened strip sizes its canvas to the plate`, op.want > 100 && Math.abs(op.h - op.want) <= 1, JSON.stringify({ canvas: op.h, want: op.want }));
        if (op.rows) check(`${W}: the opened strip shows the whole parts list`, op.allIn, `${op.rows} rows`);
        if (op.dims) check(`${W}: the opened strip keeps the plate's first dimension`, op.oneDim);
        if (op.loupe) check(`${W}: the opened strip keeps the loupe`, op.loupeOn);
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
