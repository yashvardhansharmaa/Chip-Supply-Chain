# AI Chips: making the comparison ask for its chips

Stage one, design only. No repo file outside `qa/design/chips-ux/` was edited. Every option below is proven on the live dev site (`http://127.0.0.1:8765/#/landscape`, WebGL on) by injecting its CSS and JS into the running page and shooting it with `qa/design/shots/design-chapter/proof/dc_shoot.py` on port 9970.

- `shoot.py` is the driver: `python3 qa/design/chips-ux/shoot.py qa/design/chips-ux/<option> <state> <1440|390> [out.png] [--full]`. It injects `<option>/option.css`, runs `<option>/option.js`, sets the state through the option's own controls (a select, a tick, a set), waits for the specimen, and captures.
- `00-today/` holds the page as it ships today. `a-slots/`, `b-tray/`, `c-sets/` hold one option each: `option.css`, `option.js` and the shots.
- `sheet-1440.png` and `sheet-390.png` put today and the three options side by side (empty, one pick, more), so the structures can be compared at a glance.

Fixed by the owner and kept in every option: the page opens with nothing picked, the comparison takes two to four chips, Clear empties it, only the 38 widely used chips are listed, no rotate or zoom, light theme by default.

---

## 1. Where a first-time reader gets stuck today

Measured on the live page. Positions are from the top of the document in CSS pixels. The 1440 window shows 900 px. The phone (390 × 844) shows about 716 px above the specimen strip.

| Moment | 1440 | Phone 390 |
|---|---|---|
| First screen | Title, dek, then 38 unlabeled check boxes from y 381. Right third of the screen blank. | Title and an eight-line dek fill the screen. The list starts at y 491. |
| What tells the reader to act | Nothing visible. The only instruction, "Choose two to four chips to compare", is the picker's `aria-label`, so only a screen reader hears it. | Same. |
| After one pick | The row tints and the 3D render appears. The count "1 of 4 chips selected" is at y 1,062 and the one-column table at 1,664, both below the fold. | The strip at the bottom shows a thumbnail. The count is at y 2,152, the plans at 2,417, the table at 2,790: about 1,650 px of list away. |
| After two | First screen unchanged apart from the render. The comparison starts 380 px below the fold, with no cue and no Compare control. | Still only check boxes on screen (`00-today/two-390.png`). |
| At four | A fifth tick does nothing visible. The refusal goes to the count line under the list, out of view. The other boxes look as available as before. | Same, further away. |

The problems, in order of cost to the reader:

1. **No visible instruction and no visible result.** The check boxes read as a filter list. Nothing names the comparison or shows what it looks like, so ticking a box is a guess. (`00-today/empty-1440.png`)
2. **One pick shows nothing to compare and asks for nothing.** "1 of 4 chips selected" frames four as a quota and never says two is the minimum. It sits below the list. (`00-today/one-1440.png`)
3. **The list sits between the reader and the result.** 669 px at 1440, about 1,650 px on a phone. After every pick the reader has to scroll past the rest of the list, with no sign that anything changed below. (`00-today/one-390.png`, `two-390.png`)
4. **The stage is blank on open, or wrong.** `Landscape.activate` draws nothing when no chip is picked. Landing on the page shows "Specimen 00 · the whole chip" over an empty canvas. Arriving from The Chain keeps that page's specimen: an H100 die captioned "Specimen 01 · Chip design, EDA and IP", which reads as a chip already chosen. (`00-today/empty-1440.png`, `from-chain-1440.png`)
5. **The limit is silent.** At four, a fifth tick is refused with a message nobody sighted can see. (`00-today/four-refused-1440.png`)
6. **Clear shows when there is nothing to clear**, alone under the list.
7. **Changing a chip from the table means scrolling back up** 1,000 to 2,000 px. Column heads focus a chip but cannot remove it.

Seen in passing (not part of this brief): the table's "Read the notes" buttons are 18 px tall, under the 24 px target. The stage caption for the Ascend 910C reads "on Two silicon interposers", because `showStage` drops `package.type` mid-sentence with its capital.

---

## 2. Three options

Each differs in structure, visible in the first screen:

- **A, Slots.** The comparison asks for its own chips: two ruled column slots, each a "Choose a chip" menu, above an empty comparison frame. The checklist folds away behind "Browse all 38 chips by maker".
- **B, Steps and tray.** The checklist stays. Two numbered steps frame the page (1 Pick, 2 Compare), and the count line becomes a tray that rides the bottom of the window, with four slots and a Compare button.
- **C, Starting sets.** Six named comparisons open the page, each one tap from a full table. The checklist follows under "Or choose from all 38", with a status line that rides the top of the list.

All three share one fix: on open with nothing picked, the stage draws the generic package, exactly as Clear already does (`Stage.show('package', { plan: true }, 'An AI accelerator package, drawn from above.', 'AI chips · <b>package</b>')`, called from `Landscape.activate`).

![1440: today and the three options](sheet-1440.png)

### Option A: Slots

**What it does.** Under the dek, one sentence, "Choose two chips to compare. Add up to four.", sits over a ruled row of two slots, "Chip 1" and "Chip 2", each a native menu of all 38 chips grouped by maker and country. Below it the comparison shows its frame from the start: dashed package outlines and a table whose row names (Vendor, Availability, Built for, Foundry...) already show, with two empty columns that fade after a few rows. An "Or start from a pair" line offers five one-tap pairs. The checklist stays, folded, under "Browse all 38 chips by maker". A tick there fills the next free slot.

- **After one pick:** slot 1 shows the chip, its maker and country, and Remove. Slot 2 turns garnet and reads "Chip 2 · pick one more", with "Try with H100 · Instinct MI355X · Ascend 910C" under it. The table shows the chip's column beside an empty "Chip 2, choose it above". The next step sits beside the last one, on both widths.
- **After two:** a third slot appears, dashed, "Chip 3, optional". The sentence reads "Add up to two more, or read the comparison below." Clear appears at the right of the sentence.
- **At four:** four slots, no empty one, so there is no fifth to refuse. The sentence reads "Four chips, the most the table holds." In the folded checklist, unpicked chips dim and say so.
- **Phone:** the slots sit two to a row, so the pair still reads as two columns. The third and fourth wrap beneath. After one pick the comparison starts at y 1,029, against 2,417 today.

**Shots.** 1440: `a-slots/empty-1440.png`, `one-1440.png`, `three-1440.png`, `four-1440.png`, `three-table-1440.png` (the comparison below), `browse-1440.png` (checklist unfolded, a tick filling slot 2), full pages `empty-1440-full.png` and `one-1440-full.png`. Phone: `empty-390.png`, `empty-slots-390.png`, `one-390.png`, `three-390.png`, `one-dark-390.png` (dark check).

**Data.** A new file, `data/landscape-compare.json`, read by `build/build.js` into `DATA.landscapeCompare`, next to `landscape-layouts.json`:

```json
{
  "pairs": [
    { "label": "B200 and Ascend 910C", "ids": ["nvidia-b200", "huawei-ascend-910c"] },
    { "label": "H100 and H20", "ids": ["nvidia-h100", "nvidia-h20"] },
    { "label": "A100 and Rubin", "ids": ["nvidia-a100", "nvidia-vr200"] },
    { "label": "TPU v7 and Trainium3", "ids": ["google-tpu-v7-ironwood", "aws-trainium3"] },
    { "label": "B200 and WSE-3 Turbo", "ids": ["nvidia-b200", "cerebras-wse3-turbo"] }
  ],
  "with": {
    "nvidia-b200": ["nvidia-h100", "amd-mi355x", "huawei-ascend-910c"],
    "nvidia-h100": ["nvidia-b200", "nvidia-h20", "huawei-ascend-910c"],
    "huawei-ascend-910c": ["nvidia-h100", "nvidia-h20", "huawei-ascend-950pr"],
    "google-tpu-v7-ironwood": ["google-tpu-v6e", "nvidia-b200", "aws-trainium3"]
  }
}
```

`with` should list two or three chips for each of the 38. The proof falls back to a heuristic (the same maker's previous chip, the nearest chip by date from another maker, the nearest from another country), which picks odd partners for the China variants, so the authored list is the real fix. The pairs and partners are editorial choices with no figures in them, so they need no source. `build.js` should warn on any id that names no chip:

```js
const landscapeCompare = readJSONSafe(path.join(root, 'data', 'landscape-compare.json')) || { pairs: [], with: {}, sets: [] };
const chipIds = new Set(landscape.map((c) => c.id));
[...(landscapeCompare.pairs || []), ...(landscapeCompare.sets || [])].forEach((p) => p.ids.forEach((id) => { if (!chipIds.has(id)) warn('landscape-compare: no chip ' + id); }));
Object.entries(landscapeCompare.with || {}).forEach(([k, v]) => [k, ...v].forEach((id) => { if (!chipIds.has(id)) warn('landscape-compare: no chip ' + id); }));
// and add landscapeCompare to the `data` object (line 916)
```

**Markup, `src/template.html`.** Lines 129 to 133 (`#picker` and `.cx-bar`) become:

```html
      <div class="cxa" id="cx-slots">
        <div class="cxa-head"><p class="cxa-ask" id="cxa-ask">Choose two chips to compare. Add up to four.</p><button type="button" class="cxa-clear" id="cx-clear" hidden>Clear</button></div>
        <div class="cxa-row" id="cxa-row" role="group" aria-labelledby="cxa-ask"></div>
        <div class="cxa-foot"><p class="cxa-pairs" id="cxa-pairs"></p></div>
        <details class="cxa-browse"><summary>Browse all chips by maker</summary>
          <div id="picker" class="picker cx-picker" role="group" aria-label="All chips, by maker"></div></details>
        <p class="sr-only" id="cxa-live" aria-live="polite"></p>
      </div>
```

The Clear button keeps `id="cx-clear"`, so its listener in `buildUI` works unchanged. `#cx-count` goes.

**JS, `src/app.js`, object `Landscape`.**

```js
    compare: DATA.landscapeCompare || { pairs: [], with: {} },
    said: '',
    short: function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); },
    showGeneric: function () { Stage.show('package', { plan: true }, 'An AI accelerator package, drawn from above.', 'AI chips · <b>package</b>'); },
```

`activate`: draw the generic package when nothing is picked.

```js
    activate: function () {
      if (!this.built) this.buildUI();
      var c = this.byId(this.sel);
      if (c) this.showStage(c); else this.showGeneric();
    },
```

`buildUI`: after `pk.innerHTML = html;`, build the four slot menus from the same `ccs` and `byCC`, the pairs, and their listeners. In the existing Clear listener, add `$('#cxa-s0').focus()`.

```js
      var opts = '';
      ccs.forEach(function (cc) { byCC[cc].vendors.forEach(function (v) {
        opts += '<optgroup label="' + esc(v) + ' · ' + esc(cname(cc)) + '">' + byCC[cc].byV[v].map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>'; }).join('') + '</optgroup>';
      }); });
      $('#cxa-row').innerHTML = [0, 1, 2, 3].map(function (i) {
        return '<div class="cxa-slot" data-i="' + i + '">' +
          '<div class="cxa-top"><label class="cxa-k" for="cxa-s' + i + '">Chip ' + (i + 1) + '</label><button type="button" class="cxa-x" hidden>Remove</button></div>' +
          '<select class="cxa-sel" id="cxa-s' + i + '"><option value="">Choose a chip</option>' + opts + '</select>' +
          '<span class="cxa-meta"></span><p class="cxa-try" hidden></p></div>';
      }).join('');
      $('#cxa-pairs').innerHTML = '<span class="cxa-pk">Or start from a pair:</span>' + this.compare.pairs.map(function (p, k) { return '<button type="button" data-pair="' + k + '">' + esc(p.label) + '</button>'; }).join('');
      $('.cxa-browse summary').textContent = 'Browse all ' + this.chips.length + ' chips by maker';
      var slots = $('#cx-slots');
      slots.addEventListener('change', function (e) { var s = e.target.closest('select.cxa-sel'); if (s) self.setSlot(+s.closest('.cxa-slot').getAttribute('data-i'), s.value); });
      slots.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.classList.contains('cxa-x')) { var i = +b.closest('.cxa-slot').getAttribute('data-i'); self.setSlot(i, ''); $('#cxa-s' + Math.min(i, self.picked.length)).focus(); }
        else if (b.hasAttribute('data-try')) self.setSlot(self.picked.length, b.getAttribute('data-try'));
        else if (b.hasAttribute('data-pair')) self.setPair(self.compare.pairs[+b.getAttribute('data-pair')].ids);
      });
```

New functions, next to `toggle`:

```js
    compareWith: function (id) { // the authored partners first; otherwise the maker's previous chip and the nearest chips by date
      var c = this.byId(id), self = this; if (!c) return [];
      if (this.compare.with[id]) return this.compare.with[id];
      var yr = function (x) { return parseFloat(String(x.announced || '0').replace('-', '.')) || 0; };
      var same = this.chips.filter(function (x) { return x.vendor === c.vendor && x.id !== id && yr(x) < yr(c); }).sort(function (a, b) { return yr(b) - yr(a); });
      var near = this.chips.filter(function (x) { return x.vendor !== c.vendor; }).sort(function (a, b) { return Math.abs(yr(a) - yr(c)) - Math.abs(yr(b) - yr(c)); });
      return [same[0], near[0], near.filter(function (x) { return x.vendorCountry !== c.vendorCountry; })[0]].filter(Boolean)
        .map(function (x) { return x.id; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
    },
    setSlot: function (i, id) { // a menu or a Try button: put the chip in that column, or empty it
      var p = this.picked.slice();
      if (!id) { if (i < p.length) p.splice(i, 1); } else if (i < p.length) p[i] = id; else p.push(id);
      this.picked = p; this.sel = id || p[p.length - 1] || null; this.hint = '';
      this.render();
      if (this.sel) this.showStage(this.byId(this.sel)); else this.showGeneric();
    },
    setPair: function (ids) {
      this.picked = ids.slice(0, this.max); this.sel = this.picked[0]; this.hint = '';
      this.render(); this.showStage(this.byId(this.sel));
    },
    sayNow: function () { // what the live region says after a change
      var self = this, n = this.picked.length, names = this.picked.map(function (id) { return self.short(self.byId(id)); });
      if (!n) return 'No chips chosen.';
      if (n === 1) return names[0] + ' added. Choose a second chip to compare.';
      return 'Comparing ' + names.slice(0, -1).join(', ') + ' and ' + names[n - 1] + '.' + (n === this.max ? ' Four is the most.' : '');
    },
    announce: function (msg) { var el = $('#cxa-live'); if (!el) return; el.textContent = ''; setTimeout(function () { el.textContent = msg; }, 60); },
    renderSlots: function () {
      var self = this, n = this.picked.length, shown = n < 2 ? 2 : Math.min(this.max, n + 1), host = $('#cx-slots'); if (!host) return;
      host.style.setProperty('--slots', String(shown));
      $$('.cxa-slot', host).forEach(function (el, i) {
        var id = self.picked[i] || '', c = id ? self.byId(id) : null, sel = $('select', el), x = $('.cxa-x', el), tryEl = $('.cxa-try', el);
        var state = c ? 'filled' : (n === 1 && i === 1) ? 'next' : (i >= 2 ? 'more' : 'empty');
        el.hidden = i >= shown; el.setAttribute('data-state', state);
        $('.cxa-k', el).textContent = 'Chip ' + (i + 1) + (state === 'next' ? ' · pick one more' : state === 'more' ? ', optional' : '');
        sel.options[0].textContent = c ? 'None' : 'Choose a chip';
        if (sel.value !== id) sel.value = id;
        $$('option', sel).forEach(function (o) { if (o.value) o.disabled = o.value !== id && self.picked.indexOf(o.value) >= 0; });
        x.hidden = !c; if (c) x.setAttribute('aria-label', 'Remove ' + c.name);
        $('.cxa-meta', el).textContent = c ? c.vendor + ' · ' + cname(c.vendorCountry) : '';
        var sug = state === 'next' ? self.compareWith(self.picked[0]).filter(function (s) { return self.picked.indexOf(s) < 0 && self.byId(s); }).slice(0, 3) : [];
        tryEl.hidden = !sug.length;
        tryEl.innerHTML = sug.length ? '<span class="cxa-pk">Try with</span>' + sug.map(function (s) { var t = self.short(self.byId(s)); return '<button type="button" data-try="' + esc(s) + '" aria-label="Add ' + esc(t) + ' as chip 2">' + esc(t) + '</button>'; }).join('') : '';
      });
      var ask = $('#cxa-ask');
      ask.textContent = this.hint || (n === 2 ? 'Add up to two more, or read the comparison below.' : n === 3 ? 'Add a fourth, or read the comparison below.' : n === 4 ? 'Four chips, the most the table holds.' : 'Choose two chips to compare. Add up to four.');
      if (this.hint) ask.setAttribute('data-warn', '1'); else ask.removeAttribute('data-warn');
      $('#cx-clear').hidden = !n;
      $('.cxa-foot', host).hidden = n > 0;
      $$('#picker button').forEach(function (b) { if (n >= self.max && b.getAttribute('aria-pressed') !== 'true') b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled'); });
    },
```

Changed functions:

```js
    say: function (msg) { this.hint = msg; this.renderSlots(); this.announce(msg); }, // the refusal at four now shows in the sentence over the slots

    render: function () {
      // ...the existing body, unchanged, then:
      this.renderSlots();
      var key = this.picked.join(','); // one announcement per change, whichever control made it: a menu, Try, a pair, a tick, search
      if (key !== this.said) { if (this.said || key) this.announce(this.sayNow()); this.said = key; }
    },

    renderCount: function () { // the count line is gone: the slots say where the reader is
      var sec = $('section[data-view="landscape"]'); if (!sec) return;
      sec.setAttribute('data-empty', this.picked.length ? '0' : '1');
      sec.setAttribute('data-full', this.picked.length >= this.max ? '1' : '0');
    },
```

`renderPlans`: append the empty outlines after the chips (`host.innerHTML = sel.map(...).join('') + this.ghostPlans(sel.length);`), so a resize keeps them:

```js
    ghostPlans: function (n) {
      var h = '';
      for (var i = n + 1; i <= 2; i++) h += '<div class="cx-plan cx-plan--ghost" aria-hidden="true"><span class="cx-plan-name"><b>Chip ' + i + '</b><em>' + (n && i === n + 1 ? 'pick one more' : 'not chosen') + '</em></span><span class="cx-plan-art"><i></i></span><span class="cx-plan-size">&nbsp;</span></div>';
      return h;
    },
```

`renderTable`: one empty column for each missing chip up to two. After the `sel.forEach` that writes the column heads add `html += gh;`, after each row's cells add `html += gd;`, set `data-n` to `sel.length + g`, and hide the preview from screen readers while it holds no chip:

```js
      var g = Math.max(0, 2 - sel.length), gh = '', gd = '';
      for (var k = 0; k < g; k++) {
        gh += '<th scope="col" class="cx-col cx-col--ghost"><span class="cx-ghost-h">Chip ' + (sel.length + k + 1) + '</span><span class="cx-ghost-s">' + (sel.length ? 'Choose it above' : 'Not chosen') + '</span></th>';
        gd += '<td class="cx-ghost"><span aria-hidden="true">–</span></td>';
      }
      // ...
      tb.setAttribute('data-n', String(sel.length + g));
      var wrap = $('#cx-table-wrap'); if (sel.length) wrap.removeAttribute('aria-hidden'); else wrap.setAttribute('aria-hidden', 'true');
```

`toggle`, `select` (search) and `clear` stay as they are: they change `picked` and call `render`, which now updates the slots too. `clear` should call `this.showGeneric()` in place of its own `Stage.show`.

**CSS, `src/modules/chips.css`.** Delete the `.cx-bar`, `.cx-count`, `.cx-count b`, `.cx-count i` and `.cx-clear` rules (lines 34 to 38). In the last rule (the `data-empty="1"` list), remove `.cx-plans`, `.cx-tablewrap` and `.cx-h`, so the frame shows before any pick. Then add the block below. It is `a-slots/option.css` with the `.cxa-on` hook removed (the hook only let the proof beat the live rule) and the proof's `.cx-bar { display: none }` dropped.

```css
/* the slots: two to four ruled columns, each a menu; the checklist folds under them */
.cxa { margin: 4px 0 40px; }
.cxa-head { display: flex; align-items: baseline; gap: 16px; margin: 0 0 14px; }
.cxa-head .cxa-ask { margin: 0 auto 0 0; }
.cxa-ask { font-family: var(--font-display); font-variation-settings: var(--opsz-title); font-weight: 400; font-size: var(--fs-d3); line-height: 1.2; color: var(--ink); margin: 0 0 14px; }
.cxa-ask[data-warn="1"] { color: var(--accent-ink); }
.cxa-row { display: grid; grid-template-columns: repeat(var(--slots, 2), minmax(0, 1fr)); border-top: 1px solid var(--ink); }
.cxa-slot { min-width: 0; padding: 12px 16px 14px; border-right: 1px solid var(--line); }
.cxa-slot:first-child { padding-left: 0; }
.cxa-slot:last-child { border-right: 0; padding-right: 0; }
.cxa-slot[hidden] { display: none; }
.cxa-top { display: flex; align-items: center; gap: 10px; height: 24px; margin: 0 0 6px; }
.cxa-k { font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-cap); letter-spacing: var(--tr-cap); text-transform: uppercase; color: var(--muted); margin-right: auto; }
.cxa-x { min-height: 24px; padding: 2px 0; font-family: var(--font-mono); font-size: var(--fs-ui-s); color: var(--ink-2); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
.cxa-x:hover { color: var(--ink); text-decoration-color: var(--accent); }
.cxa-x[hidden] { display: none; }
/* the menu: square, hairline, the Suppliers filter chevron */
.cxa-sel {
  display: block; width: 100%; min-height: 44px; padding: 10px 32px 10px 12px;
  font: inherit; font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-ui); color: var(--ink);
  border: 1px solid var(--line-2); border-radius: 0; background-color: var(--bg);
  -webkit-appearance: none; appearance: none; text-overflow: ellipsis; cursor: pointer;
  background-image: linear-gradient(45deg, transparent 50%, var(--ink-2) 50%), linear-gradient(135deg, var(--ink-2) 50%, transparent 50%);
  background-position: calc(100% - 17px) 52%, calc(100% - 12px) 52%; background-size: 5px 5px; background-repeat: no-repeat;
}
.cxa-sel:hover { border-color: var(--ink); }
.cxa-sel:focus-visible { outline: 1.5px solid var(--accent); outline-offset: 2px; }
.cxa-slot[data-state="empty"] .cxa-sel, .cxa-slot[data-state="next"] .cxa-sel, .cxa-slot[data-state="more"] .cxa-sel { color: var(--ink-2); font-weight: 400; }
.cxa-slot[data-state="filled"] .cxa-sel { border-color: var(--ink); }
/* the slot that wants a chip next: garnet, the one place the page asks for an action */
.cxa-slot[data-state="next"] .cxa-k { color: var(--accent-ink); }
.cxa-slot[data-state="next"] .cxa-sel { border-color: var(--accent); box-shadow: inset 0 0 0 1px var(--accent); }
.cxa-slot[data-state="more"] .cxa-sel { border-style: dashed; }
.cxa-meta { display: block; min-height: 16px; margin-top: 6px; font-family: var(--font-mono); font-size: var(--fs-cap-s); letter-spacing: var(--tr-cap-s); text-transform: uppercase; color: var(--muted); }
.cxa-try { margin: 8px 0 0; font-family: var(--font-mono); font-size: var(--fs-ui-s); color: var(--muted); line-height: 1.5; }
.cxa-try[hidden] { display: none; }
.cxa-try button, .cxa-pairs button {
  min-height: 24px; padding: 2px 0; margin-right: 12px; font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-ui-s); color: var(--ink);
  text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px;
}
.cxa-try button:hover, .cxa-pairs button:hover { text-decoration-color: var(--accent); }
.cxa-foot[hidden] { display: none; }
.cxa-foot { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 0; margin: 12px 0 0; padding-top: 10px; border-top: 1px solid var(--line); }
.cxa-pairs { margin: 0 auto 0 0; font-family: var(--font-mono); font-size: var(--fs-ui-s); color: var(--muted); line-height: 1.5; }
.cxa-pk { margin-right: 12px; }
.cxa-clear { min-height: 24px; padding: 2px 0; font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-cap); letter-spacing: var(--tr-cap); text-transform: uppercase; color: var(--ink-2); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
.cxa-clear[hidden] { display: none; }
/* the checklist, folded */
.cxa-browse { margin: 14px 0 0; }
.cxa-browse summary { display: inline-flex; align-items: center; gap: 8px; min-height: 32px; cursor: pointer; list-style: none; font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-cap); letter-spacing: var(--tr-cap); text-transform: uppercase; color: var(--ink-2); }
.cxa-browse summary::-webkit-details-marker { display: none; }
.cxa-browse summary::before { content: "+"; width: 12px; font-size: var(--fs-ui); color: var(--muted); }
.cxa-browse[open] summary::before { content: "\2212"; }
.cxa-browse summary:hover { color: var(--ink); }
.cxa-browse .cx-picker { margin: 12px 0 0; }
section[data-view="landscape"][data-full="1"] .cx-picker button[aria-pressed="false"] { opacity: 0.42; }

/* the empty frame: dashed plans, empty columns, and before any chip the table fades after its first rows */
.cx-plan--ghost { border: 1px dashed var(--line-2); cursor: default; min-width: 150px; }
.cx-plan--ghost:hover { border-color: var(--line-2); }
.cx-plan--ghost .cx-plan-name b, .cx-plan--ghost .cx-plan-name em { color: var(--muted); }
.cx-plan--ghost .cx-plan-art i { display: block; width: 128px; height: 92px; background: repeating-linear-gradient(135deg, transparent 0 7px, var(--line) 7px 8px); }
.cx-col--ghost .cx-ghost-h { display: block; font-family: var(--font-display); font-variation-settings: var(--opsz-title); font-weight: 400; font-size: var(--fs-d5); line-height: 1.1; color: var(--muted); }
.cx-col--ghost .cx-ghost-s { display: block; font-family: var(--font-mono); font-size: var(--fs-cap-s); letter-spacing: var(--tr-cap-s); text-transform: uppercase; color: var(--muted); margin-top: 3px; }
.cx-table td.cx-ghost { color: var(--line-2); font-family: var(--font-mono); }
section[data-view="landscape"][data-empty="1"] .cx-tablewrap { max-height: 360px; overflow: hidden; -webkit-mask-image: linear-gradient(#000 50%, transparent); mask-image: linear-gradient(#000 50%, transparent); }

@media (max-width: 900px) {
  .cxa-ask { font-size: var(--fs-d4); }
  /* two slots a row, so the pair still reads as two columns; a third and fourth wrap under them */
  .cxa-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .cxa-slot { padding: 10px 10px 12px; }
  .cxa-slot:nth-child(odd) { padding-left: 0; }
  .cxa-slot:nth-child(even) { padding-right: 0; border-right: 0; }
  .cxa-slot:nth-child(n+3) { border-top: 1px solid var(--line); }
  .cxa-sel { font-size: 16px; padding-left: 10px; } /* 16 px, or iOS zooms the page when the menu opens */
  .cx-col--ghost { min-width: 104px; }
  .cx-plan--ghost { min-width: 120px; }
  .cx-plan--ghost .cx-plan-art i { width: 96px; height: 70px; }
}
```

**Risks.**
- The checklist folds away. It was restyled today as an overview of every maker by country, and that overview now takes a click. The menu keeps the same grouping (one group per maker, with its country), and the folded list is one tap away.
- A native menu takes two clicks per chip and cannot show the family or the year. On a phone the closed menu clips long names ("H200 (China-licensed configuration)").
- Chrome on Windows changes a closed menu's value on each arrow key, so arrowing through it redraws the table and the specimen once per step. Debouncing `showStage` by about 150 ms keeps that smooth.
- The empty frame could read as missing data. The dashed outlines, "Not chosen" and the fade mark it as a frame, and the explanations (`.cx-sub`) wait for the first chip.
- The "Try with" partners need an authored `with` list for all 38 chips. Without it the heuristic pairs some China variants oddly.
- Search (`Landscape.select`) is unchanged and fills the next slot. At four it replaces the focused chip, as it does today.
- Size: about 110 lines of JS and 80 of CSS. The table, plans, notes, footnotes and export line are untouched apart from the empty columns.

**Accessibility.**
- Keyboard: each slot is a native `<select>` with its own `<label>` ("Chip 1"). Tab reaches Chip 1, Remove, Chip 2, the Try buttons, the pairs, Clear and the Browse summary. The 38 checklist buttons leave the tab order while folded, so a keyboard reader no longer tabs through 38 chips to reach the table. After Remove, focus moves to the menu that now holds the next chip. After Clear, it moves to Chip 1.
- Screen reader: the slot row is a group named by the sentence above it. `#cxa-live` announces every change once, whichever control made it: "B200 added. Choose a second chip to compare.", then "Comparing B200 and Ascend 910C.", and at four "Four is the most." A refused fifth tick announces the refusal. Remove buttons read "Remove B200". Try buttons read "Add H100 as chip 2". The empty preview table carries `aria-hidden` until a chip is in, and its dashes are hidden, so a screen reader hears no grid of dashes. At four, unpicked chips in the checklist carry `aria-disabled="true"` and stay focusable.
- Targets: menus 44 px tall. Remove, Try, the pairs and Clear are 24 px tall or more (measured in the proof). The summary is 32 px. The phone menus use 16 px type so iOS does not zoom.

### Option B: Steps and tray

**What it does.** The page keeps today's order. A ruled step head, "1 Pick two to four chips" with "Each chip ticked adds a column to the comparison under the list.", opens the checklist. The count bar under the list becomes a tray: the count in words, four slots, Clear and a Compare button. It is `position: sticky; bottom: 0`, so it rides the bottom of the window while the list scrolls, then docks in its own place above step 2. A second step head, "2 Compare them", opens the comparison. Before two chips it waits in grey: "The comparison appears here once two chips are picked."

- **Empty:** the tray sits at the bottom of the first screen: "None picked yet. Pick at least two.", slot 1 garnet, slots 3 and 4 marked optional, Compare in grey.
- **After one pick:** "B200 picked. Pick one more to compare." Slot 1 holds B200 with a ×. Slot 2 turns garnet. Compare stays grey and, if pressed, says "Pick one more chip first."
- **After two or three:** "3 picked. Add one more, or compare." Compare fills in ink: "Compare 3 chips ↓". It glides to step 2 and moves focus there. Step 2 has "Change the chips" to go back.
- **At four:** the unpicked chips dim. A fifth tick puts "Compare up to four. Remove one to add another." in garnet in the tray, which is in view.
- **Phone:** the tray is one line (count, Clear, Compare) riding just above the specimen strip.

**Shots.** 1440: `b-tray/empty-1440.png`, `one-1440.png`, `three-1440.png`, `four-1440.png`, `compare-1440.png` (after Compare). Phone: `empty-390.png`, `one-390.png`, `three-390.png`, `four-390.png`.

**Markup, `src/template.html`.** Lines 129 to 133 become:

```html
      <div class="cxb-step" id="cxb-step1"><span class="cxb-n" aria-hidden="true">1</span><h2 class="cxb-t" id="cxb-t1" tabindex="-1">Pick two to four chips</h2><p class="cxb-s">Each chip ticked adds a column to the comparison under the list.</p></div>
      <div id="picker" class="picker cx-picker" role="group" aria-labelledby="cxb-t1"></div>
      <div class="cx-bar cxb-tray" role="region" aria-label="Chips picked">
        <p class="count cxb-say" id="cx-count" aria-live="polite"></p>
        <button type="button" class="btn ghost cx-clear" id="cx-clear" hidden>Clear</button>
        <button type="button" class="btn cxb-go" id="cxb-go" aria-disabled="true" aria-describedby="cx-count">Compare</button>
        <ol class="cxb-slots" id="cxb-slots" aria-label="Chips picked, in table order"></ol>
      </div>
      <div class="cxb-step" id="cxb-step2"><span class="cxb-n" aria-hidden="true">2</span><h2 class="cxb-t" id="cxb-t2" tabindex="-1">Compare them</h2><button type="button" class="cxb-back">Change the chips</button><p class="cxb-s" id="cxb-s2"></p></div>
```

The step heads are `h2`, so the outline reads h1 AI Chips, h2 step, h3 the existing labels. "Change the chips" is a button because a `#fragment` link would hit the hash router.

**JS, `src/app.js`, object `Landscape`.** `activate` and `showGeneric` as in Option A. `buildUI`, after the Clear listener (and add `$('#cxb-t1').focus()` to it):

```js
      $('#cxb-slots').addEventListener('click', function (e) {
        var b = e.target.closest('button[data-rm]'); if (!b) return;
        self.toggle(b.getAttribute('data-rm'));
        ($('#cxb-slots button') || $('#cxb-go')).focus();
      });
      $('#cxb-go').addEventListener('click', function () {
        if (this.getAttribute('aria-disabled') === 'true') { self.say(self.picked.length ? 'Pick one more chip first.' : 'Pick two chips first.'); return; }
        scrollToEl($('#cxb-step2'), true); $('#cxb-t2').focus({ preventScroll: true });
      });
      $('#cxb-step2 .cxb-back').addEventListener('click', function () { scrollToEl($('#cxb-step1'), true); $('#cxb-t1').focus({ preventScroll: true }); });
```

`renderCount`, rewritten (the proof's version, verbatim):

```js
    renderCount: function () {
      var self = this, n = this.picked.length, el = $('#cx-count'); if (!el) return;
      var short = function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); };
      el.innerHTML = this.hint ? esc(this.hint)
        : n === 0 ? 'None picked yet. Pick at least two.'
        : n === 1 ? '<b>' + esc(short(this.byId(this.picked[0]))) + '</b> picked. Pick one more to compare.'
        : n < this.max ? '<b>' + n + ' picked.</b> Add ' + (n === 2 ? 'up to two more' : 'one more') + ', or compare.'
        : '<b>4 picked</b>, the most. Remove one to add another.';
      el.setAttribute('data-warn', this.hint ? '1' : '0');
      var h = '';
      for (var i = 0; i < this.max; i++) {
        var id = this.picked[i], c = id && this.byId(id);
        h += c ? '<li class="cxb-tok"><b title="' + esc(c.name) + '">' + esc(short(c)) + '</b><button type="button" data-rm="' + esc(id) + '" aria-label="Remove ' + esc(c.name) + '">×</button></li>'
          : '<li class="cxb-tok is-empty' + (i === n && n < 2 ? ' is-next' : '') + '">Chip ' + (i + 1) + (i >= 2 ? ', optional' : '') + '</li>';
      }
      $('#cxb-slots').innerHTML = h;
      var go = $('#cxb-go');
      go.setAttribute('aria-disabled', n >= 2 ? 'false' : 'true');
      go.innerHTML = n >= 2 ? 'Compare ' + n + ' chips <span aria-hidden="true">&darr;</span>' : 'Compare';
      $('#cx-clear').hidden = !n;
      $('#cxb-step1').setAttribute('data-now', n < 2 ? '1' : '0');
      $('#cxb-step2').setAttribute('data-now', n >= 2 ? '1' : '0');
      $('#cxb-step2').setAttribute('data-wait', n < 2 ? '1' : '0');
      var s2 = $('#cxb-s2'); s2.textContent = n === 0 ? 'The comparison appears here once two chips are picked.' : n === 1 ? 'One chip so far. Its specs are below. Pick one more to compare.' : ''; s2.hidden = n >= 2;
      var sec = $('section[data-view="landscape"]');
      sec.setAttribute('data-empty', n ? '0' : '1'); sec.setAttribute('data-full', n >= this.max ? '1' : '0');
      $$('#picker button').forEach(function (b) { if (n >= self.max && b.getAttribute('aria-pressed') !== 'true') b.setAttribute('aria-disabled', 'true'); else b.removeAttribute('aria-disabled'); });
    },
```

`toggle`, `say`, `select`, `clear` and `render` are unchanged.

**CSS, `src/modules/chips.css`.** Delete the `.cx-bar`, `.cx-count`, `.cx-count b`, `.cx-count i` and `.cx-clear` rules (lines 34 to 38) and add `b-tray/option.css` as written:

```css
/* ---------- the steps ---------- */
.cxb-step { display: grid; grid-template-columns: 44px minmax(0, 1fr) auto; align-items: baseline; column-gap: 4px; margin: 8px 0 18px; padding-top: 12px; border-top: 1px solid var(--ink); }
.cxb-n { font-family: var(--font-display); font-variation-settings: var(--opsz-title); font-weight: 400; font-size: 34px; line-height: 1; color: var(--muted); font-variant-numeric: lining-nums; }
.cxb-step[data-now="1"] .cxb-n { color: var(--accent); }
.cxb-t { font-family: var(--font-display); font-variation-settings: var(--opsz-title); font-weight: 400; font-size: var(--fs-d3); line-height: 1.2; margin: 0; color: var(--ink); text-transform: none; letter-spacing: 0; }
.cxb-s { grid-column: 2 / -1; margin: 4px 0 0; font-size: var(--fs-small); color: var(--muted); }
.cxb-back { align-self: center; min-height: 24px; padding: 2px 0; font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-cap); letter-spacing: var(--tr-cap); text-transform: uppercase; color: var(--ink-2); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
#cxb-step2 { margin-top: 8px; }
#cxb-step2[data-wait="1"] .cxb-t { color: var(--muted); }
#cxb-step2[data-wait="1"] .cxb-back { display: none; }

/* ---------- the tray ---------- */
.cx-bar.cxb-tray {
  position: sticky; bottom: 0; z-index: 6; margin: 10px 0 34px; padding: 12px 0 12px;
  display: grid; grid-template-columns: minmax(0, 1fr) auto auto; grid-template-rows: auto auto; align-items: center; gap: 10px 16px;
  background: var(--bg); border-top: 1px solid var(--ink); border-bottom: 1px solid var(--line);
}
.cxb-say { grid-column: 1; grid-row: 1; margin: 0; font-family: var(--font-mono); font-size: var(--fs-ui); color: var(--ink-2); }
.cxb-say b { font-weight: 600; color: var(--ink); }
.cxb-say[data-warn="1"] { color: var(--accent-ink); }
.cxb-tray .cx-clear { grid-column: 2; grid-row: 1; min-height: 32px; }
.cxb-tray .cx-clear[hidden] { display: none; }
.cxb-go { grid-column: 3; grid-row: 1; min-height: 36px; padding: 8px 16px; }
.cxb-go[aria-disabled="true"] { background: transparent; color: var(--muted); border-color: var(--line-2); cursor: default; }
.cxb-go[aria-disabled="true"]:hover { opacity: 1; }
.cxb-slots { grid-column: 1 / -1; grid-row: 2; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin: 0; padding: 0; list-style: none; }
.cxb-tok { display: flex; align-items: center; gap: 6px; min-width: 0; min-height: 36px; padding: 4px 4px 4px 10px; border: 1px solid var(--ink); }
.cxb-tok b { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--font-mono); font-weight: 600; font-size: var(--fs-ui); color: var(--ink); }
.cxb-tok button { flex: none; width: 28px; height: 28px; font-size: 17px; line-height: 1; color: var(--ink-2); }
.cxb-tok button:hover { color: var(--ink); background: var(--bg-2); }
.cxb-tok.is-empty { border: 1px dashed var(--line-2); font-family: var(--font-mono); font-size: var(--fs-ui-s); color: var(--muted); }
.cxb-tok.is-next { border-color: var(--accent); border-style: solid; color: var(--accent-ink); box-shadow: inset 0 0 0 1px var(--accent); }
/* at four, the chips not picked step back; they stay focusable, and a tick on one says why it did nothing */
section[data-view="landscape"][data-full="1"] .cx-picker button[aria-pressed="false"] { opacity: 0.42; }
section[data-view="landscape"][data-full="1"] .cx-picker button[aria-pressed="false"]:hover { opacity: 0.7; }
/* a focused chip must never sit under the tray (WCAG 2.4.11) */
html:has(section[data-view="landscape"]:not([hidden])) { scroll-padding-bottom: 120px; }

@media (max-width: 900px) {
  .cxb-step { grid-template-columns: 34px minmax(0, 1fr) auto; }
  .cxb-n { font-size: 26px; }
  .cxb-t { font-size: var(--fs-d4); }
  /* on a phone the tray rides on the specimen strip, one line: the count in words, Clear and Compare */
  .cx-bar.cxb-tray { bottom: 128px; grid-template-columns: minmax(0, 1fr) auto auto; gap: 8px 12px; padding: 8px 18px; margin-left: -18px; margin-right: -18px; }
  .cxb-tray .cx-clear { border: 0; padding: 4px 0; min-height: 24px; text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
  .cxb-slots { display: none; }
  .cxb-say { font-size: var(--fs-ui-s); line-height: 1.35; }
  html:has(section[data-view="landscape"]:not([hidden])) { scroll-padding-bottom: 200px; }
}
```

**Risks.**
- The empty first screen still opens on a 38-chip list. The step head says what to do, but the reader still cannot see what the comparison looks like until two chips are in and Compare is pressed.
- On a phone the tray and the specimen strip together take about 200 px of an 844 px screen while the list scrolls (`four-390.png`). The `128px` offset copies the strip's height, so a change to the strip must change the tray too. iOS Safari's collapsing toolbar can make a sticky bottom bar jump.
- The step heads add about 290 px above the comparison (plans at y 1,568 against 1,281 today). Compare closes that gap in one press.
- The tray is a second place that lists the picks, so the table's column heads and the tray must stay in step (they do, both read `picked`).
- Lowest code cost of the three: about 50 lines of JS, 55 of CSS, and no new data.

**Accessibility.**
- Keyboard: the checklist is as today, every chip a tab stop and the arrow keys walking it (a roving tabindex would cut 38 tab stops to one, a small change to `arrows`). Then the tray: the × buttons, Clear, Compare. Compare moves focus to the "Compare them" heading. "Change the chips" moves it back to step 1.
- Screen reader: `#cx-count` stays the live region, now in words: "B200 picked. Pick one more to compare.", "3 picked. Add one more, or compare.", and the refusal at four. Compare uses `aria-disabled`, so it stays focusable and says why it waits when pressed. At four, unpicked chips carry `aria-disabled="true"`. The tray is a region named "Chips picked" and its slots a list in table order.
- Sticky: `scroll-padding-bottom` keeps a focused chip clear of the tray (WCAG 2.4.11).
- Targets: chip rows 30 px, tray buttons 32 to 36 px, × 28 px, "Change the chips" 24 px.

### Option C: Starting sets

**What it does.** Under the dek, "Start with a comparison" heads six named sets in two ruled columns. Each row is one button: a title, the chips it holds and "Compare →". A tap picks those chips, glides to the comparison and moves focus there. The checklist follows under "Or choose from all 38", with a status line ("Two to four chips. Tick one to start.") that sticks under the masthead while the list scrolls and lets go where the list ends.

The six sets, editorial and country-neutral, with no figures in their titles:

| Title | Chips |
|---|---|
| Nvidia across four generations | A100, H100, B200, Rubin |
| Flagships of 2025 from four makers | B300, Instinct MI355X, TPU v7, Trainium3 |
| The H100 and its China versions | H100, H800, H20 |
| Huawei and Nvidia | Ascend 910C, Ascend 950PR, H100, B200 |
| In-house chips at Google, Amazon, Microsoft and Meta | TPU v7, Trainium3, Maia 200, MTIA 400 |
| A whole-wafer chip beside the B200 | WSE-3 Turbo, B200 |

- **After one pick (own):** the status line, stuck at the top, reads "B200 picked. Pick one more to compare." with Clear.
- **After two or three:** it names them, "B200, Ascend 910C and Instinct MI355X. Add one more.", and offers "See the comparison ↓".
- **After a set:** the page glides to "Packages at one scale". The set's row keeps a garnet rule while the picks match it.
- **At four:** "… Four is the most." A fifth tick shows the refusal in garnet in the status line.
- **Phone:** the sets stack in one column of 64 px rows. The status line spans the width under the masthead.

**Shots.** 1440: `c-sets/empty-1440.png`, `one-1440.png`, `three-1440.png`, `set-1440.png` (after tapping the first set). Phone: `empty-390.png`, `one-390.png`, `three-390.png`, `set-390.png`.

**Data.** A `sets` array in the same `data/landscape-compare.json` (validated by the same `build.js` lines as Option A):

```json
  "sets": [
    { "title": "Nvidia across four generations", "ids": ["nvidia-a100", "nvidia-h100", "nvidia-b200", "nvidia-vr200"] },
    { "title": "Flagships of 2025 from four makers", "ids": ["nvidia-b300", "amd-mi355x", "google-tpu-v7-ironwood", "aws-trainium3"] },
    { "title": "The H100 and its China versions", "ids": ["nvidia-h100", "nvidia-h800", "nvidia-h20"] },
    { "title": "Huawei and Nvidia", "ids": ["huawei-ascend-910c", "huawei-ascend-950pr", "nvidia-h100", "nvidia-b200"] },
    { "title": "In-house chips at Google, Amazon, Microsoft and Meta", "ids": ["google-tpu-v7-ironwood", "aws-trainium3", "microsoft-maia-200", "meta-mtia-400"] },
    { "title": "A whole-wafer chip beside the B200", "ids": ["cerebras-wse3-turbo", "nvidia-b200"] }
  ]
```

**Markup, `src/template.html`.** Lines 129 to 133 become (and the first `.cx-h` gets an id and `tabindex="-1"` so focus can land on it):

```html
      <section class="cxc" aria-labelledby="cxc-h"><h2 class="cxc-h" id="cxc-h">Start with a comparison</h2><ul class="cxc-list" id="cxc-list"></ul></section>
      <div class="cxc-pick">
        <div class="cxc-own"><h2 class="cxc-h2" id="cxc-own-h">Or choose from all 38</h2>
          <p class="cxc-say" id="cx-count" aria-live="polite"></p>
          <button type="button" class="cxc-see" hidden>See the comparison <span aria-hidden="true">&darr;</span></button>
          <button type="button" class="cxc-clear" id="cx-clear" hidden>Clear</button></div>
        <div id="picker" class="picker cx-picker" role="group" aria-labelledby="cxc-own-h"></div>
      </div>
      <h3 class="label cx-h" id="cx-compare-h" tabindex="-1">Packages at one scale</h3>
```

The status line and the list share `.cxc-pick`, so the sticky line lets go where the list ends.

**JS, `src/app.js`, object `Landscape`.** `activate`, `showGeneric` and `compare` as in Option A. In `buildUI`:

```js
      var short = function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); };
      $('#cxc-list').innerHTML = (this.compare.sets || []).map(function (s, k) {
        return '<li><button type="button" class="cxc-set" data-set="' + k + '" aria-pressed="false" aria-describedby="cxc-d' + k + '">' +
          '<span class="cxc-t">' + esc(s.title) + '</span><span class="cxc-c" id="cxc-d' + k + '">' + s.ids.map(function (id) { return esc(short(self.byId(id))); }).join(' · ') + '</span>' +
          '<span class="cxc-go" aria-hidden="true">Compare &rarr;</span></button></li>';
      }).join('');
      $('#cxc-list').addEventListener('click', function (e) { var b = e.target.closest('.cxc-set'); if (b) self.loadSet(+b.getAttribute('data-set')); });
      $('.cxc-see').addEventListener('click', function () { var h = $('#cx-compare-h'); scrollToEl(h, true); h.focus({ preventScroll: true }); });
```

New `loadSet`, and `renderCount` rewritten:

```js
    loadSet: function (k) {
      var s = this.compare.sets[k]; this.picked = s.ids.slice(0, this.max); this.sel = this.picked[0]; this.hint = '';
      this.render(); this.showStage(this.byId(this.sel));
      var h = $('#cx-compare-h'); scrollToEl(h, true); h.focus({ preventScroll: true });
    },
    renderCount: function () {
      var self = this, n = this.picked.length, el = $('#cx-count'); if (!el) return;
      var short = function (c) { return String(c.name).replace(/\s*\(.*\)\s*$/, ''); };
      var nm = this.picked.map(function (id) { return short(self.byId(id)); });
      var list = nm.length < 2 ? nm.join('') : nm.slice(0, -1).join(', ') + ' and ' + nm[nm.length - 1];
      el.innerHTML = this.hint ? esc(this.hint)
        : n === 0 ? 'Two to four chips. Tick one to start.'
        : n === 1 ? '<b>' + esc(list) + '</b> picked. Pick one more to compare.'
        : n < this.max ? '<b>' + esc(list) + '</b>. ' + (n === 2 ? 'Add up to two more.' : 'Add one more.')
        : '<b>' + esc(list) + '</b>. Four is the most.';
      el.setAttribute('data-warn', this.hint ? '1' : '0');
      $('.cxc-see').hidden = n < 2;
      $('#cx-clear').hidden = !n;
      var same = function (a, b) { return a.length === b.length && a.every(function (x) { return b.indexOf(x) >= 0; }); };
      $$('.cxc-set').forEach(function (b) { b.setAttribute('aria-pressed', n && same(self.picked, self.compare.sets[+b.getAttribute('data-set')].ids) ? 'true' : 'false'); });
      $('section[data-view="landscape"]').setAttribute('data-empty', n ? '0' : '1');
    },
```

**CSS, `src/modules/chips.css`.** Delete the `.cx-bar`, `.cx-count` and `.cx-clear` rules (lines 34 to 38) and add `c-sets/option.css` as written, minus its `.cx-bar { display: none }` line (the template no longer has the bar):

```css
/* ---------- the sets ---------- */
.cxc { margin: 6px 0 44px; }
.cxc-h, .cxc-h2 { font-family: var(--font-display); font-variation-settings: var(--opsz-title); font-weight: 400; font-size: var(--fs-d3); line-height: 1.2; color: var(--ink); text-transform: none; letter-spacing: 0; margin: 0 0 12px; }
.cxc-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 28px; margin: 0; padding: 0; list-style: none; border-top: 1px solid var(--ink); }
.cxc-list li { border-bottom: 1px solid var(--line); }
.cxc-set {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-rows: auto auto; column-gap: 12px; row-gap: 4px;
  width: 100%; min-height: 72px; padding: 13px 8px 13px 0; text-align: left; color: var(--ink);
}
.cxc-t { grid-column: 1; font-family: var(--font-display); font-variation-settings: var(--opsz-title); font-weight: 400; font-size: var(--fs-d5); line-height: 1.2; }
.cxc-c { grid-column: 1; font-family: var(--font-mono); font-size: var(--fs-ui-s); color: var(--muted); letter-spacing: 0.01em; }
.cxc-go { grid-column: 2; grid-row: 1 / -1; align-self: center; font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-cap); letter-spacing: var(--tr-cap); text-transform: uppercase; color: var(--ink-2); }
.cxc-set:hover .cxc-t { text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 0.18em; }
.cxc-set:hover .cxc-go { color: var(--ink); }
.cxc-set[aria-pressed="true"] { box-shadow: inset 2px 0 0 var(--accent); padding-left: 12px; background: var(--bg-2); }
.cxc-set[aria-pressed="true"] .cxc-go { color: var(--accent-ink); }

/* ---------- or choose from all 38 ---------- */
.cxc-own {
  position: sticky; top: var(--masthead); z-index: 6; background: var(--bg);
  display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 16px; margin: 0 0 14px; padding: 10px 0 10px; border-bottom: 1px solid var(--line);
}
.cxc-own .cxc-h2 { margin: 0; font-size: var(--fs-d4); }
.cxc-say { margin: 0 auto 0 0; font-family: var(--font-mono); font-size: var(--fs-ui); color: var(--ink-2); }
.cxc-say b { font-weight: 600; color: var(--ink); }
.cxc-say[data-warn="1"] { color: var(--accent-ink); }
.cxc-see, .cxc-clear { min-height: 24px; padding: 2px 0; font-family: var(--font-mono); font-weight: 500; font-size: var(--fs-cap); letter-spacing: var(--tr-cap); text-transform: uppercase; color: var(--ink); text-decoration: underline; text-decoration-color: var(--line-2); text-underline-offset: 3px; }
.cxc-see { color: var(--accent-ink); text-decoration-color: var(--accent); }
.cxc-see[hidden], .cxc-clear[hidden] { display: none; }
.cxc-pick { margin-bottom: 34px; }
html:has(section[data-view="landscape"]:not([hidden])) { scroll-padding-top: calc(var(--masthead) + 64px); }

@media (max-width: 900px) {
  .cxc-list { grid-template-columns: minmax(0, 1fr); }
  .cxc-h, .cxc-h2 { font-size: var(--fs-d4); }
  .cxc-set { min-height: 64px; padding: 11px 0; }
  .cxc-own { margin-left: -18px; margin-right: -18px; padding-left: 18px; padding-right: 18px; }
  .cxc-own .cxc-h2 { font-size: var(--fs-d5); flex: 1 0 100%; }
}
```

**Risks.**
- Editorial upkeep: six titles and their chips to keep current as chips ship. Each title frames the chips, so it must stay plain, neutral for a global reader and free of figures. A curated set can read as the site's view of which comparisons matter.
- The own-pick path moves down: the list starts at y 784 at 1440 (381 today) and 1,154 on a phone (491 today). That reader still depends on the sticky status line, and after one own pick the comparison is as far away as today.
- A set tap scrolls the page for the reader. `scrollToEl` already jumps without the glide when reduced motion is set.
- Code: about 45 lines of JS, 45 of CSS, plus the `sets` data.

**Accessibility.**
- Keyboard: six set buttons, then the status line's buttons, then the checklist as today. A set moves focus to the "Packages at one scale" heading, so the next Tab continues in the comparison.
- Screen reader: each set is a toggle button (`aria-pressed`) whose description lists its chips ("A100 · H100 · B200 · Rubin"). `#cx-count` is the live region in the status line and announces the picks in words after a set or a tick, and the refusal at four.
- Sticky: `scroll-padding-top` keeps a focused chip clear of the stuck line.
- Targets: set rows 64 to 72 px tall. "See the comparison" and Clear are 24 px.

---

## 3. Recommendation

**Option A, Slots.**

- It puts the action where the result appears. The reader picks in the comparison's own column heads, so the next step after each pick is beside the last one. On a phone the comparison starts at y 1,029 after one pick, against 2,417 today, and the 1,650 px list leaves the path.
- The empty page shows what it does. Two empty columns under row names such as Foundry and Export-control status explain "compare" before the reader touches anything.
- One pick asks for the second: the next slot turns garnet with three partners to try. Four is a full row, so the limit needs no refusal. These are the two moments the owner's complaint is about, and A answers both in structure where B and C answer them with a status line.
- It is the comparison pattern most readers already know from product pages, which matters for the students, staff and journalists who will not guess at check boxes.
- The checklist is kept, folded, for readers who want the overview by maker and country.

What to decide before stage two:
1. The `with` partners for all 38 chips and the five empty-page pairs in `data/landscape-compare.json`. The proof's list covers four chips.
2. Whether the folded checklist should open by default at 1440, where there is room. Opening it there brings back the overview at the cost of the frame below the fold.
3. If the owner wants starting points with names, three of Option C's sets can replace the pair line in A's empty state without changing A's structure.

If the owner would rather keep the checklist as the main control, Option B is the low-risk alternative: least code, no data, and the tray fixes the silent limit and the invisible count. It leaves the empty page without a picture of the result.

The generic package on open (problem 4) is worth doing whichever option is chosen. It is one line in `Landscape.activate`.
