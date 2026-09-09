# Build modules

Each `*.js` here exports `function (ctx) { return { PLACEHOLDER: html } }`. `ctx` carries `all` (chapters with meta and html), `chapters`, `geo`, `stages`, `data` (every dataset), and helpers `esc`, `pad`, `word`, `cap`, `read`, `readJSON`, `markdown`, `inline`, `tierOf`, `wordCount`, `warn`. Placeholders available in the template: START_HERE (landing page, under the hero), WALK (view `#/walk`), METHODS (view `#/methods`), SUMMARY_A and SUMMARY_B (prototype views `#/summary-a`, `#/summary-b`).

Client code goes in `src/modules/*.js` (concatenated after `app.js`; use `window.CP` for `Stage`, `Router`, `DATA`, `$`, `$$`, `esc`, `narrow`, and `CP.register(view, { activate, stage })`) and styles in `src/modules/*.css` (appended after `styles.css`).
