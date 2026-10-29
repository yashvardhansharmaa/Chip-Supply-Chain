#!/usr/bin/env node
/* CONTENT CHECKS, run by build/build.js before it writes anything (and on their own: node build/validate.js).
   Each problem is one plain line naming the file and the field. Any problem stops the build with exit code 1, so a broken
   weekly edit never reaches dist/ or the deploy. What counts as a problem:
   - a data file (data/*.json) that is empty, cut off or not valid JSON, or one of the site's datasets in the wrong shape;
   - a chapter whose front matter is missing or not valid JSON, or that lacks number, title, oneLiner or plain;
   - a stage (every chapter but the two that look across the chain, build/stages.js) with no card, a card.concentration other than Extreme, High, Moderate or
     Low, or a card.substitutability.band other than Very hard, Hard, Moderate or Easy;
   - a {{...}} marker in a chapter's body that is not a {{figure:<id>}} line naming one of the chapter's figures;
   - a figure with no data: a bars, stack or timeline figure with no rows, an animation with no rendered steps in media/,
     or a figure of a type the build cannot draw.
   The allowed words match BANDS and SUBS in build/build.js; change both together. */
'use strict';
const fs = require('fs');
const path = require('path');
const STAGES = require('./stages.js');

const BANDS = ['Extreme', 'High', 'Moderate', 'Low'];
const SUB_BANDS = ['Very hard', 'Hard', 'Moderate', 'Easy'];
const FIGURE_TYPES = ['bars', 'stack', 'columns', 'change', 'timeline', 'animation', 'within']; // columns and change: revision 5, 28 Oct 2026; within: 15.3, 29 Oct 2026
// the datasets the site cannot do without, and the shape each must have; every other data/*.json must still parse
const DATASETS = {
  'bibliography.json': { kind: 'object', what: 'source titles' },
  'suppliers.json': { kind: 'array', what: 'suppliers', needs: ['name', 'country', 'category'] },
  'landscape.json': { kind: 'array', what: 'chips', needs: ['id', 'name'] },
  'landscape-compare.json': { kind: 'object', what: 'chip pairs' },
  'exposure.json': { kind: 'array', what: 'China revenue rows', needs: ['firm'] },
  'control-flows.json': { kind: 'object', what: 'export-control flows', list: 'flows' },
  'export-controls-timeline.json': { kind: 'array', what: 'timeline entries', needs: ['id', 'date'] },
  'glossary.json': { kind: 'array', what: 'glossary entries', needs: ['term', 'plain'] },
  'flashcards.json': { kind: 'object', what: 'flashcard decks' },
  'fx-rates.json': { kind: 'object', what: 'exchange rates' },
  'source-tiers.json': { kind: 'object', what: 'source tiers' },
};

const list = (words) => words.slice(0, -1).join(', ') + ' or ' + words[words.length - 1];
const show = (v) => (v === undefined ? 'missing' : JSON.stringify(v));

// "Unexpected token } in JSON at position 5120" also says where: line and column
function jsonError(text, e) {
  const m = /position (\d+)/.exec(e.message);
  if (!m) return e.message;
  const before = text.slice(0, +m[1]), line = before.split('\n').length, col = +m[1] - before.lastIndexOf('\n');
  return `${e.message.replace(/\s*\(line \d+ column \d+\)$/, '')} (line ${line}, column ${col})`;
}

// returns the parsed value, or undefined after recording the problem
function parseFile(file, rel, problems) {
  if (!fs.existsSync(file)) { problems.push(`${rel}: the file is missing`); return undefined; }
  const text = fs.readFileSync(file, 'utf8');
  if (!text.trim()) { problems.push(`${rel}: the file is empty`); return undefined; }
  try { return JSON.parse(text); } catch (e) { problems.push(`${rel}: not valid JSON, the file may be cut off or have a typo: ${jsonError(text, e)}`); return undefined; }
}

function checkData(root, problems) {
  const dir = path.join(root, 'data');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];
  for (const f of new Set(files.concat(Object.keys(DATASETS)))) {
    const rel = `data/${f}`, spec = DATASETS[f];
    const v = parseFile(path.join(dir, f), rel, problems);
    if (v === undefined || !spec) continue;
    const isArr = Array.isArray(v), isObj = v && typeof v === 'object' && !isArr;
    if (spec.kind === 'array' && !isArr) { problems.push(`${rel}: should be a list of ${spec.what}, found ${isObj ? 'an object' : typeof v}`); continue; }
    if (spec.kind === 'object' && !isObj) { problems.push(`${rel}: should be an object of ${spec.what}, found ${isArr ? 'a list' : typeof v}`); continue; }
    const rows = spec.list ? v[spec.list] : v;
    if (spec.list && !Array.isArray(rows)) { problems.push(`${rel}: "${spec.list}" should be a list of ${spec.what}`); continue; }
    if ((Array.isArray(rows) ? rows.length : Object.keys(rows).length) === 0) { problems.push(`${rel}: holds no ${spec.what}`); continue; }
    (spec.needs || []).forEach((k) => rows.forEach((r, i) => {
      if (!r || typeof r !== 'object' || r[k] == null || r[k] === '') problems.push(`${rel}: entry ${i + 1}${r && (r.name || r.term || r.id || r.firm) ? ` (${r.name || r.term || r.id || r.firm})` : ''} has no "${k}"`);
    }));
  }
  // the bibliography maps each cited url to its title; a value that is not an entry means the file was mangled
  const bib = DATASETS['bibliography.json'] && fs.existsSync(path.join(dir, 'bibliography.json')) ? safeParse(path.join(dir, 'bibliography.json')) : null;
  if (bib && typeof bib === 'object' && !Array.isArray(bib)) {
    Object.keys(bib).forEach((u) => { const b = bib[u]; if (!b || typeof b !== 'object' || !b.title) problems.push(`data/bibliography.json: the entry for ${u} has no "title"`); });
  }
  const gl = safeParse(path.join(dir, 'glossary.json'));
  if (Array.isArray(gl)) {
    const seen = new Set();
    gl.forEach((g) => { const t = String((g && g.term) || '').toLowerCase(); if (t && seen.has(t)) problems.push(`data/glossary.json: the term "${g.term}" appears twice`); seen.add(t); });
  }
}
function safeParse(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; } }

function checkChapters(root, problems) {
  const dir = path.join(root, 'content');
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^\d\d-.*\.md$/.test(f)).sort() : [];
  if (!files.length) { problems.push('content/: no chapters found (files named like 04-lithography.md)'); return; }
  const numbers = {}, ids = {};
  for (const f of files) {
    const rel = `content/${f}`;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    const m = src.match(/^---json\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!m) { problems.push(`${rel}: no front matter; the file must start with a ---json block`); continue; }
    let meta;
    try { meta = JSON.parse(m[1]); } catch (e) { problems.push(`${rel}: the front matter is not valid JSON: ${jsonError(m[1], e)}`); continue; }
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) { problems.push(`${rel}: the front matter should be one JSON object`); continue; }
    const id = meta.id || f.replace(/^\d\d-/, '').replace(/\.md$/, '');
    // the fields every chapter needs
    if (!Number.isInteger(meta.number) || meta.number < 1) problems.push(`${rel}: "number" is ${show(meta.number)}; it must be a whole number, 1 or more`);
    else (numbers[meta.number] = numbers[meta.number] || []).push(f);
    (ids[id] = ids[id] || []).push(f);
    ['title', 'oneLiner', 'plain'].forEach((k) => { if (typeof meta[k] !== 'string' || !meta[k].trim()) problems.push(`${rel}: "${k}" is ${meta[k] === undefined ? 'missing' : 'empty'}`); });
    // the stages carry a chokepoint card (build/stages.js: every chapter but the economics chapter and the geopolitics essay)
    if (STAGES.isStage({ id, number: meta.number })) {
      const c = meta.card;
      if (!c || typeof c !== 'object') problems.push(`${rel}: "card" is missing; every chapter but the economics chapter and the essay is a stage and needs a chokepoint card`);
      else {
        if (!BANDS.includes(c.concentration)) problems.push(`${rel}: card.concentration is ${show(c.concentration)}; it must be ${list(BANDS)}`);
        const band = c.substitutability && c.substitutability.band;
        if (!SUB_BANDS.includes(band)) problems.push(`${rel}: card.substitutability.band is ${show(band)}; it must be ${list(SUB_BANDS)}`);
      }
    }
    // figures: every marker names a figure, and every figure has something to draw
    const figures = Array.isArray(meta.figures) ? meta.figures : [];
    if (meta.figures !== undefined && !Array.isArray(meta.figures)) problems.push(`${rel}: "figures" should be a list`);
    const figIds = new Set(figures.map((x) => x && x.id));
    const body = src.slice(m[0].length);
    body.split('\n').forEach((line, i) => {
      const at = `${rel} line ${src.slice(0, m[0].length).split('\n').length + i}`;
      for (const mk of line.matchAll(/\{\{([^}]*)\}\}/g)) {
        const fm = /^\s*figure:\s*([\w-]+)\s*$/.exec(mk[1]);
        if (!fm) problems.push(`${at}: ${mk[0]} is not a figure marker; write {{figure:<id>}} on a line of its own`);
        else if (line.trim() !== mk[0]) problems.push(`${at}: ${mk[0]} must sit on a line of its own, or the figure is not drawn`);
        else if (!figIds.has(fm[1])) problems.push(`${at}: ${mk[0]} names no figure; "figures" in the front matter has ${figures.length ? figures.map((x) => x && x.id).join(', ') : 'none'}`);
      }
    });
    figures.forEach((fig, i) => {
      const name = `figure ${fig && fig.id ? `"${fig.id}"` : i + 1}`;
      if (!fig || typeof fig !== 'object') { problems.push(`${rel}: ${name} is not an object`); return; }
      if (!fig.id) problems.push(`${rel}: ${name} has no "id"`);
      if (!FIGURE_TYPES.includes(fig.type)) { problems.push(`${rel}: ${name} has type ${show(fig.type)}; it must be ${list(FIGURE_TYPES)}`); return; }
      if (fig.type === 'animation' && fig.live) {
        // a live explainer (29 Oct 2026): drawn in the page by src/modules/live-<live>.js, its steps and captions here
        if (!fs.existsSync(path.join(root, 'src', 'modules', `live-${fig.live}.js`))) problems.push(`${rel}: ${name} is live, but src/modules/live-${fig.live}.js does not exist`);
        if (!(Array.isArray(fig.steps) && fig.steps.length && fig.steps.every((st) => st && st.k && st.cap))) problems.push(`${rel}: ${name} is live and needs "steps", each with "k" and "cap"`);
        return;
      }
      if (fig.type === 'animation') {
        if (!fig.src) { problems.push(`${rel}: ${name} is an animation with no "src"`); return; }
        const mediaRel = `media/${fig.src}.json`, meta2 = parseFile(path.join(root, mediaRel), mediaRel, problems);
        if (meta2 !== undefined && !(meta2 && Array.isArray(meta2.steps) && meta2.steps.length)) problems.push(`${mediaRel}: has no "steps", so ${rel} ${name} has nothing to show (run python3 build/animate.py ${fig.src})`);
        return;
      }
      const rows = Array.isArray(fig.data) ? fig.data.filter((d) => Array.isArray(d) && d.length >= 2) : [];
      if (!rows.length) problems.push(`${rel}: ${name} has no data; "data" needs rows like ["label", value]`);
      else if (rows.length < fig.data.length) problems.push(`${rel}: ${name} has ${fig.data.length - rows.length} row(s) in "data" that are not ["label", value]`);
      // a figure's mark and range name its rows; a change figure takes its rows in pairs (figure() in build/build.js)
      const labels = new Set(rows.map((d) => String(d[0])));
      if (fig.range) ['low', 'high', 'ref'].forEach((k) => { if (fig.range[k] != null && !labels.has(String(fig.range[k]))) problems.push(`${rel}: ${name}'s range ${k} "${fig.range[k]}" names no row`); });
      if (fig.mark != null && fig.type !== 'change' && !labels.has(String(fig.mark)) && !(fig.range && fig.range.label === fig.mark)) problems.push(`${rel}: ${name}'s mark "${fig.mark}" names no row`);
      if (fig.type === 'within') { // its first "parts" rows are the parts; "total" names the row that totals them and "whole" a range row
        const np = +fig.parts, whole = rows.find((d) => String(d[0]) === String(fig.whole));
        if (!(np >= 1 && np < rows.length)) problems.push(`${rel}: ${name} is a within figure; "parts" must count its first rows, the parts`);
        if (!labels.has(String(fig.total))) problems.push(`${rel}: ${name}'s total "${fig.total}" names no row`);
        if (!whole || typeof whole[2] !== 'number') problems.push(`${rel}: ${name}'s whole "${fig.whole}" must name a row with a range, ["label", low, high]`);
        if (Array.isArray(fig.about)) fig.about.forEach((a) => { if (!labels.has(String(a))) problems.push(`${rel}: ${name}'s about "${a}" names no row`); });
      }
      if (fig.type === 'change' && rows.length % 2) problems.push(`${rel}: ${name} is a change figure with ${rows.length} rows; it needs them in pairs, earlier then later`);
      rows.forEach((d) => { if (d.length > 2 && typeof d[2] === 'number' && !(d[2] > d[1])) problems.push(`${rel}: ${name} row "${d[0]}" has a range whose high end ${d[2]} is not above its low end ${d[1]}`); });
    });
  }
  Object.keys(numbers).filter((n) => numbers[n].length > 1).forEach((n) => problems.push(`content/: chapter number ${n} is used by ${numbers[n].join(' and ')}`));
  Object.keys(ids).filter((k) => ids[k].length > 1).forEach((k) => problems.push(`content/: chapter id "${k}" is used by ${ids[k].join(' and ')}`));
}

function validate(root) {
  const problems = [];
  checkData(root, problems);
  checkChapters(root, problems);
  return problems;
}
module.exports = validate;

if (require.main === module) {
  const root = path.resolve(process.argv[2] || path.join(__dirname, '..'));
  const problems = validate(root);
  if (problems.length) {
    console.error(`content check: ${problems.length} problem${problems.length === 1 ? '' : 's'}`);
    problems.forEach((p) => console.error('  ' + p));
    process.exit(1);
  }
  console.log('content check: no problems');
}
