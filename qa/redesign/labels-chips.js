#!/usr/bin/env node
/* AI Chips: every label on the chart against every mark and every other label. For five sets of ticked chips (none; B300 and
   Instinct MI355X; those two with Rubin and Instinct MI455X; B200 and Ascend 910C; H100, H20, Instinct MI300X and H200), at all
   six measures, with no card open and with the H100's or the TPU v7's card open, at 1440, 1024, 390 and 320 px, it reads each
   label's box on screen (getBBox, less 2 px of the face's line gap above and below) and each dot, ring and card ring, and lists
   every label that runs into one of them or into another label, with the depth in px. The layout sweep checks text against text
   only, so a label on a neighbor's ring passed it.
   usage: node qa/redesign/labels-chips.js [--base http://127.0.0.1:8772] [--out qa/redesign/labels-chips.txt] */
'use strict';
const fs = require('fs');
const path = require('path');
const { launch, open } = require('./cdp.js');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const BASE = opt('base', 'http://127.0.0.1:8772'), OUT = opt('out', path.join(__dirname, 'labels-chips.txt'));
const SETS = { none: '', two: 'nvidia-b300,amd-mi355x', four: 'nvidia-b300,amd-mi355x,nvidia-vr200,amd-mi455x', pair: 'nvidia-b200,huawei-ascend-910c', mix: 'nvidia-h100,nvidia-h20,amd-mi300x,nvidia-h200' };
const MEASURES = ['fp16', 'fp8', 'fp4', 'mem', 'bw', 'tdp'], LOOKS = ['', 'nvidia-h100', 'google-tpu-v7-ironwood'], WIDTHS = [1440, 1024, 390, 320];

(async () => {
  const chrome = launch(), lines = [], byWidth = {};
  let n = 0, deep = 0, charts = 0;
  try {
    for (const width of WIDTHS) for (const [set, ids] of Object.entries(SETS)) {
      const t = await open(chrome, BASE + '/#/landscape' + (ids ? '?pick=' + ids : ''), { width, wait: 1600 });
      for (const m of MEASURES) for (const look of LOOKS) {
        charts++;
        const hits = await t.ev(`(function(){ var L=CP.Landscape; L.measure=${JSON.stringify(m)}; L.view='year'; L.open=${look ? JSON.stringify(look) : 'null'}; L.renderChart();
          var svg=document.querySelector('#cx-chart svg'), out=[]; if(!svg) return out;
          var lab=[].map.call(svg.querySelectorAll('text.lab'),function(e){var b=e.getBBox();return {t:e.textContent,b:[b.x,b.y+2,b.x+b.width,b.y+b.height-2]};});
          var marks=[]; svg.querySelectorAll('g.pt').forEach(function(g){ g.querySelectorAll('circle.dot,circle.ring,circle.look').forEach(function(c){var r=+c.getAttribute('r')+(c.classList.contains('dot')?0:1),x=+c.getAttribute('cx'),y=+c.getAttribute('cy'); marks.push({k:c.getAttribute('class')+' '+g.getAttribute('data-id'),b:[x-r,y-r,x+r,y+r]});}); });
          var d=function(a,b){return Math.min(Math.min(a[2],b[2])-Math.max(a[0],b[0]), Math.min(a[3],b[3])-Math.max(a[1],b[1]));};
          lab.forEach(function(A,i){ marks.forEach(function(M){ var v=d(A.b,M.b); if(v>0) out.push([A.t,M.k,Math.round(v*10)/10]); }); lab.forEach(function(B,j){ var v=d(A.b,B.b); if(j>i&&v>0) out.push([A.t,'label '+B.t,Math.round(v*10)/10]); }); });
          return out; })()`);
        hits.forEach((h) => { n++; if (h[2] > 2) deep++; byWidth[width] = (byWidth[width] || 0) + 1; lines.push(`${width} ${set} ${m} ${look ? 'card ' + look : 'no card'}: "${h[0]}" into ${h[1]} by ${h[2]} px`); });
      }
      await t.close();
    }
  } finally { await chrome.close(); }
  const head = `labels-chips: ${charts} charts, ${n} labels touching a mark or a label (${deep} by more than 2 px); by width: ` + WIDTHS.map((w) => w + ' px ' + (byWidth[w] || 0)).join(', ');
  fs.writeFileSync(OUT, head + '\n\n' + lines.join('\n') + '\n');
  console.log(lines.join('\n') + '\n\n' + head);
  process.exit(0);
})();
