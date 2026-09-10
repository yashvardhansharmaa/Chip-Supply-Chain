// Mock images for the author: not part of the site. node qa/mock/make.js
const fs = require('fs');
const M = JSON.parse(fs.readFileSync('data/chokepoint-matrix.json', 'utf8'));
const F = JSON.parse(fs.readFileSync('data/control-flows.json', 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const HEAD = `<meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:wght@500;600;800&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap">
<style>
:root{--bg:#edeff0;--bg-2:#e4e7e9;--bg-3:#d9dde0;--ink:#12161a;--ink-2:#3a434c;--muted:#5b646d;--line:#cbd0d4;--line-2:#b6bcc1;--accent:#c98a12;--accent-ink:#7a5406;--accent-soft:rgba(201,138,18,.14);
--font-display:"IBM Plex Sans Condensed",Arial,sans-serif;--font-body:"Newsreader",Georgia,serif;--font-mono:"IBM Plex Mono",Menlo,monospace}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);font-size:16px;line-height:1.5}
.wrap{padding:36px 44px 40px;max-width:1080px}
h1{font-family:var(--font-display);font-weight:800;font-size:30px;line-height:1.05;margin:0 0 6px;letter-spacing:-.01em}
.dek{color:var(--ink-2);margin:0 0 22px;font-size:17px}
.k{font-family:var(--font-mono);font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:var(--muted)}
.mono{font-family:var(--font-mono)}
.note{font-family:var(--font-mono);font-size:11px;color:var(--muted);line-height:1.5;margin-top:14px;max-width:760px}
.tag{display:inline-block;font-family:var(--font-mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;padding:2px 7px;border:1px solid var(--line-2);border-radius:3px;color:var(--ink-2);margin-left:8px;vertical-align:middle}
.tag.new{background:var(--accent-soft);border-color:var(--accent);color:var(--accent-ink)}
</style>`;

// ---------- 1. The label ----------
const plate = (variant) => {
  const head = variant === 'now'
    ? `<span class="plate-score"><i class="pips"><b></b><b></b><b></b><b></b><b></b></i><b>5</b> / 5</span>`
    : `<span class="plate-score m2"><span class="pill"><span class="k">Concentration</span> <b>Top 2 hold 100%</b> <span class="yr">2025</span></span><span class="pill"><span class="k">Substitutability</span> <b>Very hard</b> <span class="yr">rated</span></span></span>`;
  const kpis = variant === 'now'
    ? `<div><span class="k">Concentration</span><b class="v Extreme">Extreme</b></div>
       <div><span class="k">Substitution time</span><b class="v">10+<small>years</small></b></div>
       <div><span class="k">Price or market size</span><b class="v cost">$380m per scanner</b><span class="sub">High-NA EUV list price, ASML 2024 annual report</span></div>`
    : `<div><span class="k">Concentration</span><b class="v Extreme">HHI 10,000</b><span class="sub">1 supplier of EUV scanners. Top country NL 100%, top 2 100% (2025, measured, ASML Form 20-F)</span></div>
       <div><span class="k">Substitutability</span><b class="v">Very hard <small>4 of 4</small></b><span class="sub">No qualified second source. Physics-limited (light source, optics). Inventor took 17 years. Clock: a well-funded state actor, 10+ years</span></div>
       <div><span class="k">Price or market size</span><b class="v cost">$380m per scanner</b><span class="sub">High-NA EUV list price, ASML 2024 annual report</span></div>`;
  return `<section class="plate">
<header class="plate-head"><span class="label k" style="font-size:11px">Chokepoint card</span>${head}</header>
<div class="plate-kpis">${kpis}</div></section>`;
};
const SHORT=['EDA','Core IP','Wafers','Resist','Gases','EUV','DUV','Deposit.','Etch','Metrology','Masks','Leading','Mature','DRAM','HBM'];
const label = `${HEAD}<style>
.plate{border:1px solid var(--line-2);border-radius:4px;background:var(--bg-2);box-shadow:0 1px 0 rgba(18,22,26,.06),0 8px 24px rgba(18,22,26,.08);overflow:hidden;margin:0 0 10px}
.plate-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:11px 18px;background:var(--bg-3);border-bottom:1px solid var(--line-2)}
.plate-score{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:12px;color:var(--muted)}
.plate-score>b{color:var(--ink);font-weight:600;font-size:13px}
.pips{display:inline-flex;gap:3px}.pips b{width:7px;height:12px;background:var(--accent);border-radius:1px}
.plate-score.m2{gap:8px}.pill{display:inline-flex;align-items:baseline;gap:7px;padding:4px 9px;border:1px solid var(--line-2);border-radius:3px;background:var(--bg-2)}
.pill b{color:var(--ink);font-weight:600;font-size:12px}.pill .yr{font-size:10px;color:var(--muted)}
.plate-kpis{display:grid;grid-template-columns:repeat(3,1fr)}
.plate-kpis>div{padding:15px 18px 16px;border-right:1px solid var(--line);min-width:0}.plate-kpis>div:last-child{border-right:0}
.plate-kpis .k{display:block;margin-bottom:8px}
.plate-kpis .v{display:block;font-family:var(--font-display);font-weight:600;font-size:27px;line-height:1.05;letter-spacing:.005em}
.plate-kpis .v.cost{font-size:22px}.plate-kpis .v small{font-size:14px;font-weight:500;color:var(--muted);margin-left:4px}.plate-kpis .v.Extreme{color:var(--accent-ink)}
.plate-kpis .sub{display:block;font-family:var(--font-mono);font-size:10.5px;line-height:1.5;color:var(--muted);margin-top:8px}
.two{display:grid;grid-template-columns:1fr;gap:26px}
h2{font-family:var(--font-display);font-size:14px;font-weight:600;margin:0 0 8px;color:var(--ink-2);letter-spacing:.02em}
.strip{display:flex;gap:6px;align-items:flex-end;margin:6px 0 0}
.cell{width:52px;text-align:center}.cell .bar{height:34px;background:var(--bg-3);border:1px solid var(--line-2);display:flex;align-items:flex-end;border-radius:2px;overflow:hidden}
.cell .bar i{display:block;width:100%;background:var(--ink-2)}
.cell .t{font-family:var(--font-mono);font-size:9.5px;color:var(--muted);margin-top:4px}
.cell .n{font-family:var(--font-mono);font-size:10px;color:var(--ink);margin-top:2px}
</style><div class="wrap">
<h1>What replaces the 1 to 5 score</h1>
<p class="dek">Two labels the reader can check, on the EUV lithography card. Measured concentration, then rated substitutability.</p>
<div class="two">
<div><h2>Today <span class="tag">score restates the concentration band</span></h2>${plate('now')}</div>
<div><h2>Proposed <span class="tag new">one measured, one rated</span></h2>${plate('new')}
<p class="note">Concentration is computed from the matrix row: HHI over country shares (0 to 10,000) and the top-2 share, with the year and the basis (measured, derived, estimate, relayed). Substitutability is a 4-band rating against four written tests: a qualified second source exists (easy); a second source exists but is not qualified for the leading node (moderate); no second source, replaceable by a well-funded state actor in 5 to 10 years (hard); physics- or IP-limited, 10+ years (very hard). The actor on the clock is always the same: a well-funded state or firm standing up an alternative. Each card shows its scoring line.</p>
</div>
<div><h2>The chain strip with the new measure</h2>
<div class="strip">${M.slice(0,15).map((r)=>{const s=r.shares||{};const v=Object.entries(s).filter(([k])=>k!=='Other').map(([,x])=>x||0).sort((a,b)=>b-a);const top2=(v[0]||0)+(v[1]||0);return `<div class="cell"><div class="bar"><i style="height:${Math.max(4,top2*0.34)}px"></i></div><div class="t">${SHORT[M.indexOf(r)]}</div><div class="n">${top2}%</div></div>`;}).join('')}</div>
<p class="note">Bars are the top-2 country share per segment, in chain order, from the matrix (names shortened). Amber could mark segments whose HHI exceeds 5,000. The strip keeps its job as navigation; the number under each cell is the same on the card, in the CSV and in the note.</p></div>
</div></div>`;
fs.writeFileSync('qa/mock/label.html', label);

// ---------- 2. State chart of the flows ----------
const MAP = { open:'open', licence:'denial', case:'case', shut:'prohibited', policy:'policy', denial:'denial', prohibited:'prohibited' };
const NAME = { open:'No licence', case:'Case by case', denial:'Presumption of denial', prohibited:'Prohibited', policy:'Policy' };
const t0 = new Date('2018-01-01').getTime(), t1 = new Date('2026-12-31').getTime();
const X = (d) => 200 + (new Date(d).getTime() - t0) / (t1 - t0) * 760;
const flows = F.flows.slice().sort((a,b)=>a.order-b.order);
let rows = '', y = 60;
flows.forEach((f) => {
  const sts = f.states.slice().sort((a,b)=>a.date.localeCompare(b.date));
  let segs = '';
  const init = MAP[f.initial] || 'open';
  const first = sts[0] ? X(sts[0].date) : 960;
  segs += `<rect class="s-${init}" x="200" y="${y}" width="${first-200}" height="18"/>`;
  sts.forEach((s, i) => {
    const x0 = X(s.date), x1 = sts[i+1] ? X(sts[i+1].date) : 960;
    const st = MAP[s.status] || 'open';
    segs += `<rect class="s-${st}" x="${x0}" y="${y}" width="${Math.max(2,x1-x0)}" height="18"><title>${esc(s.label||'')} (${s.date})</title></rect>`;
    segs += `<line x1="${x0}" x2="${x0}" y1="${y-3}" y2="${y+21}" stroke="#12161a" stroke-width="1"/>`;
  });
  rows += `<text x="190" y="${y+13}" text-anchor="end" class="lab">${esc(f.name)}</text>${segs}`;
  y += 34;
});
const years = []; for (let yr = 2018; yr <= 2026; yr++) years.push(`<line x1="${X(yr+'-01-01')}" x2="${X(yr+'-01-01')}" y1="40" y2="${y}" stroke="#cbd0d4" stroke-width="1"/><text x="${X(yr+'-01-01')+3}" y="34" class="ax">${yr}</text>`);
const legend = ['open','case','denial','prohibited','policy'].map((s,i)=>`<g transform="translate(${200+[0,130,290,520,660][i]},${y+16})"><rect class="s-${s}" x="0" y="0" width="26" height="12"/><text x="32" y="10" class="ax">${NAME[s]}</text></g>`).join('');
const chart1 = `${HEAD}<style>
svg{display:block;background:var(--bg)}.lab{font-family:var(--font-display);font-size:13px;font-weight:600;fill:#12161a}.ax{font-family:var(--font-mono);font-size:10.5px;fill:#5b646d}
.s-open{fill:#fff;stroke:#b6bcc1;stroke-width:1}.s-case{fill:#fff;stroke:#3a434c;stroke-width:1;stroke-dasharray:3 2}.s-denial{fill:rgba(201,138,18,.28);stroke:#c98a12;stroke-width:1}.s-prohibited{fill:#12161a}.s-policy{fill:#d9dde0;stroke:#b6bcc1}
</style><div class="wrap">
<h1>Every flow, every year, one chart</h1>
<p class="dek">The nine flows across the chokepoint since 2018, drawn as legal outcomes. Each tick is a move; each band is what the law said until the next one.</p>
<svg width="980" height="${y+40}" viewBox="0 0 980 ${y+40}">${years.join('')}${rows}${legend}</svg>
<p class="note">Drawn from data/control-flows.json as coded today (licence mapped to presumption of denial, shut to prohibited). The data pass under way replaces these with effective dates and the four outcomes, so some bands will move. On the site this would sit above the board, share its scrubber (the vertical line would follow the year), and each band would open the same history the row does.</p></div>`;
fs.writeFileSync('qa/mock/chart-states.html', chart1);

// ---------- 3. Concentration along the chain ----------
const CC = { US:'United States', NL:'Netherlands', JP:'Japan', TW:'Taiwan', KR:'South Korea', CN:'China', DE:'Germany', GB:'United Kingdom' };
let bars = '', yy = 44;
M.forEach((r) => {
  const s = r.shares || {}; const ent = Object.entries(s).filter(([k]) => k !== 'Other' && k !== 'EU-other' && typeof s[k] === 'number').sort((a,b)=>b[1]-a[1]);
  const top = ent[0] || ['—', 0], second = ent[1] || ['', 0];
  const hhi = Object.values(s).filter((v)=>typeof v==='number').reduce((a,v)=>a+v*v,0);
  const w = (v) => v * 5.6;
  const empty = !ent.length;
  bars += `<text x="250" y="${yy+12}" text-anchor="end" class="lab">${esc(r.segment)}</text>` + (empty
    ? `<text x="262" y="${yy+12}" class="ax hhi">no country split in the matrix yet</text>`
    : `<rect x="260" y="${yy}" width="${w(top[1])}" height="16" fill="${hhi>=5000?'#c98a12':'#3a434c'}"/>
  <rect x="${260+w(top[1])+2}" y="${yy}" width="${w(second[1])}" height="16" fill="${hhi>=5000?'rgba(201,138,18,.35)':'#b3b9be'}"/>
  <text x="850" y="${yy+12}" class="ax">${esc(top[0])} ${top[1]}%  ·  ${esc(second[0])} ${second[1]}%</text>
  <text x="1040" y="${yy+12}" text-anchor="end" class="ax hhi">${Math.round(hhi).toLocaleString('en-US')}</text>`);
  yy += 26;
});
const chart2 = `${HEAD}<style>svg{display:block}.lab{font-family:var(--font-display);font-size:12.5px;font-weight:600;fill:#12161a}.ax{font-family:var(--font-mono);font-size:10.5px;fill:#3a434c}.hhi{fill:#5b646d}.hd{font-family:var(--font-mono);font-size:10px;letter-spacing:.13em;fill:#5b646d}</style><div class="wrap">
<h1>Concentration along the chain</h1>
<p class="dek">Twenty segments in chain order. The dark bar is the top country's share, the light bar the second; the number at the right is the HHI. Amber where the HHI passes 5,000.</p>
<svg width="1050" height="${yy+30}" viewBox="0 0 1050 ${yy+30}">
<text x="260" y="30" class="hd">SHARE OF THE SEGMENT</text><text x="850" y="30" class="hd">TOP · SECOND</text><text x="1040" y="30" text-anchor="end" class="hd">HHI</text>
${[0,25,50,75,100].map((v)=>`<line x1="${260+v*5.6}" x2="${260+v*5.6}" y1="36" y2="${yy}" stroke="#cbd0d4"/><text x="${260+v*5.6}" y="${yy+14}" class="ax" text-anchor="middle">${v}%</text>`).join('')}
${bars}</svg>
<p class="note">Computed live from data/chokepoint-matrix.json (shares by country, headquarters basis; ${M.length} rows). HHI sums squared country shares including Other, so it is a floor. With the basis field in place, each bar could carry a small letter (M, D, E, R) for measured, derived, estimate or relayed, and the year. This is the chart the site's text promises and the score never gave: it makes photomasks and metrology comparable at a glance.</p></div>`;
fs.writeFileSync('qa/mock/chart-concentration.html', chart2);
console.log('mocks written');
