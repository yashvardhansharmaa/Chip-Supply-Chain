#!/usr/bin/env node
/* Every setting of figure 07.1's sliders (24 chip sizes x 19 densities, 456 in all), ported from the mockup's sweep.js
   (qa/excellence/mocks/explainers/sweep.js, 29 Oct 2026) to the built figure (src/modules/live-yield.js):
   - the wafer drawn shows exactly the flawless chips the formula's share allows, at every setting;
   - the textbook's wafer holds 120 chips of 1 cm and 26 of 2 cm;
   - the chapter's inputs give back its printed 49.2, 11.3 and 20.1, in the model and on the page, through the slider itself;
   - every readout is a number, and the cost reads 1.0 at 1 cm.
   usage: node qa/redesign/sweep-yield.js [base]   (base http://127.0.0.1:8789). Exits 1 on any mismatch. */
'use strict';
const { launch, open } = require('./cdp.js');
const BASE = (process.argv[2] || 'http://127.0.0.1:8789').replace(/\/$/, '');
(async () => {
  const c = launch();
  let bad = 0;
  try {
    const t = await open(c, `${BASE}/metrology-and-inspection/`, { width: 1440, wait: 2000 });
    const r = await t.ev(`(() => {
      const M = window.CP_LIVE.yield, F = M.figs['fig-metrology-and-inspection-defect-yield']; let bad = [], odd = [], n = 0;
      for (let v = 10; v <= 33; v++) for (let k = 0; k <= 18; k++) {
        const d = Math.round((0.1 + k * 0.05) * 100) / 100, R = M.readouts(v, d), W = M.wafer(v, d);
        n++; const good = W.hit.filter((x) => !x).length; if (good !== R.good) bad.push([v, d, good, R.good]);
        if (![R.y1, R.y, R.cost].every(Number.isFinite) || (v === 10 && Math.abs(R.cost - 1) > 1e-9)) odd.push([v, d, R]);
      }
      const a = M.readouts(10, 0.8), b = M.readouts(20, 0.8);
      // the page itself, driven through the slider as a reader drives it
      const f = document.getElementById('fig-metrology-and-inspection-defect-yield'), sv = f.querySelector('.yd-ctl input[min="10"]'), sd = f.querySelector('.yd-ctl input[min="0.1"]');
      sv.value = 12; sv.dispatchEvent(new Event('input', { bubbles: true })); sd.value = 0.8; sd.dispatchEvent(new Event('input', { bubbles: true }));
      sv.value = 20; sv.dispatchEvent(new Event('input', { bubbles: true }));
      const page = [...f.querySelectorAll('.yd-num')].map((e) => e.textContent).join(' / ');
      return { settings: n, mismatches: bad, odd: odd, site: [(a.y * 100).toFixed(1), (b.y * 100).toFixed(1), b.cost.toFixed(1)].join(' / '), dies: [a.n, b.n], page };
    })()`);
    const ok = (name, pass, info) => { if (!pass) bad++; console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${info ? '  ' + info : ''}`); };
    ok(`all ${r.settings} settings: the wafer shows exactly the flawless chips the share allows`, r.settings === 456 && !r.mismatches.length, r.mismatches.length ? JSON.stringify(r.mismatches.slice(0, 10)) : '0 mismatches');
    ok('every readout is a number, and the cost is 1.0 at 1 cm', !r.odd.length, r.odd.length ? JSON.stringify(r.odd.slice(0, 5)) : '');
    ok("the textbook's wafer: 120 chips of 1 cm, 26 of 2 cm", r.dies[0] === 120 && r.dies[1] === 26, r.dies.join(' and '));
    ok("the model at the chapter's inputs: 49.2, 11.3 and 20.1", r.site === '49.2 / 11.3 / 20.1', r.site);
    ok("the page, through the sliders, at the chapter's inputs: 49.2, 11.3 and 20.1", r.page === '49.2 / 11.3 / 20.1', r.page);
    ok('no page errors', !t.errors.length, t.errors.join(' | '));
    await t.close();
  } finally { await c.close(); }
  process.exit(bad ? 1 : 0);
})();
