#!/usr/bin/env node
/* Screenshots for the look gate. usage: node qa/redesign/shots.js <outdir> "<name>|<url>|<width>[|<theme>[|<scrollY or #selector>[|full]]]" ...
   e.g. node qa/redesign/shots.js /tmp/shots "home-1440|http://127.0.0.1:8766/#/|1440" "home-390-dark|http://127.0.0.1:8766/#/|390|dark"
   A scroll target is a pixel offset or a CSS selector to bring to the top; after it the faces are awaited again and 1.5 s
   passes, so Literata never falls back to Georgia in a shot. */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open } = require('./cdp.js');

(async () => {
  const [outdir, ...specs] = process.argv.slice(2);
  if (!outdir || !specs.length) { console.error('usage: shots.js <outdir> "<name>|<url>|<width>[|theme[|scroll[|full]]]" ...'); process.exit(1); }
  fs.mkdirSync(outdir, { recursive: true });
  const chrome = launch();
  try {
    for (const spec of specs) {
      const [name, url, w, theme, scroll, full] = spec.split('|');
      const t = await open(chrome, url, { width: +w || 1440, theme: theme || '', wait: 2500 });
      if (scroll) {
        if (/^\d+$/.test(scroll)) await t.scrollTo(+scroll);
        else { const y = await t.ev(`(function(){var e=document.querySelector(${JSON.stringify(scroll)});return e?Math.round(e.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--masthead'))||64)-16):0;})()`); await t.scrollTo(y); }
      }
      const file = path.join(outdir, name + '.png');
      await t.shot(file, full === 'full');
      console.log('wrote', file, t.errors.length ? 'ERRORS: ' + t.errors.join(' | ') : '');
      await t.close();
    }
  } finally { await chrome.close(); }
  process.exit(0);
})();
