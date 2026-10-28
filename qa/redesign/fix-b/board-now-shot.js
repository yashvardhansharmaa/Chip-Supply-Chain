#!/usr/bin/env node
/* the compact By date board at Now, in a window tall enough that the chronology's first entry sits below the reading line
   (so the board is not moved to 2018): usage node qa/redesign/fix-b/board-now-shot.js <url> <out.png> */
'use strict';
const path = require('path');
const fs = require('fs');
const { launch, open, sleep } = require(path.join(__dirname, '..', 'cdp.js'));
(async () => {
  const [url, out] = process.argv.slice(2);
  const chrome = launch();
  try {
    const t = await open(chrome, url, { width: 1440, height: 3200, wait: 3000 });
    await t.ev('document.fonts ? document.fonts.ready.then(() => 1) : 1'); await sleep(1500);
    const box = await t.ev("(function(){var r=document.querySelector('#cf-side').getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:Math.min(r.height,2000)};})()");
    console.log('as of', await t.ev("document.querySelector('.cf-asof').innerText"));
    const r = await t.s('Page.captureScreenshot', { format: 'png', clip: { x: box.x - 8, y: box.y - 8, width: box.w + 16, height: box.h + 16, scale: 1 } });
    fs.writeFileSync(out, Buffer.from(r.data, 'base64'));
    console.log('wrote', out);
  } finally { await chrome.close(); }
  process.exit(0);
})();
