#!/bin/bash
# "Updated" dates by content only (PLAN item 12). Builds a scratch copy of the site on faked days and prints which pages
# changed their date. Nothing in the repository is written.
#   bash qa/code-review/fixes/safety/dates-test.sh new   # the working tree's build.js and summary-brief.js
#   bash qa/code-review/fixes/safety/dates-test.sh old   # the same two files as committed at HEAD (before the fix)
set -u
MODE=${1:-new}
HERE=$(cd "$(dirname "$0")" && pwd)
REPO=$(cd "$HERE/../../../.." && pwd)
T=$(mktemp -d)
trap 'rm -rf "$T"' EXIT
rsync -a --exclude qa --exclude .git --exclude node_modules --exclude 'build/__pycache__' "$REPO/" "$T/site/"
cd "$T/site" || exit 1
if [ "$MODE" = old ]; then
  git -C "$REPO" show HEAD:build/build.js > build/build.js
  git -C "$REPO" show HEAD:build/modules/summary-brief.js > build/modules/summary-brief.js
  rm -f build/validate.js
fi
build() { FAKE_NOW="$1" node -r "$HERE/fake-date.js" build/build.js > "$T/build.log" 2>&1 || { echo "build failed"; tail -5 "$T/build.log"; exit 1; }; }
report() {
  node -e '
    const fs = require("fs"), d = JSON.parse(fs.readFileSync("build/page-dates.json", "utf8")), day = process.argv[1];
    const pages = Object.keys(d).filter((k) => k.endsWith("/") && k !== "/" && k !== "/summary/");
    const moved = pages.filter((k) => d[k].modified === day);
    const shown = (f, re) => { const m = fs.readFileSync(f, "utf8").match(re); return m ? m[1] : "none"; };
    const lastmod = (u) => { const m = fs.readFileSync("dist/sitemap.xml", "utf8").match(new RegExp("<loc>[^<]*" + u + "</loc><lastmod>([^<]+)")); return m ? m[1] : "none"; };
    console.log(`  "/" ${d["/"].modified} | "/summary/" ${(d["/summary/"] || {}).modified || "not dated"} | chapter pages moved to this day: ${moved.length} of ${pages.length}${moved.length && moved.length < 4 ? " (" + moved.join(", ") + ")" : ""}`);
    console.log(`  shown: main footer "${shown("dist/index.html", /class="updated">Updated ([^<]+)</)}", summary "${shown("dist/summary/index.html", /Updated ([0-9]+ [A-Za-z]+ [0-9]+)/)}", /lithography/ "${shown("dist/lithography/index.html", /<span>Updated ([^<]+)<\/span>/)}", sitemap /summary/ ${lastmod("summary/")}`);
  ' "$1"
}
echo "mode: $MODE"
build 2026-10-21T12:00:00; echo "21 Oct, first build (settles the dates file)"; report 2026-10-21
build 2026-11-09T12:00:00; echo "9 Nov, no change at all"; report 2026-11-09
# design-only edits: a CSS rule on both sheets, a JS comment, two classes renamed in figure(), the template reindented
# (not fig-title: social.js finds an animation's title by that class, so renaming it alone drops visible words, which is content)
printf '\n.x-test { color: red; }\n' >> src/styles.css
printf '\n.x-test { color: red; }\n' >> build/assets/chapter-page.css
printf '\n// a comment\n' >> src/app.js
sed -i '' -e 's/class="hb-l"/class="hb-label"/' -e 's/<ol class="tl">/<ol class="tl tl-v2">/' build/build.js
sed -i '' 's/^    <section class="view column" data-view="stack" hidden>/      <section class="view column"  data-view="stack" hidden>/' src/template.html
build 2026-11-10T12:00:00; echo "10 Nov, design only: CSS on both sheets, a JS comment, two classes renamed in figure(), the template reindented"; report 2026-11-10
# one sentence added to chapter 4's body
printf '\nA sentence added for the date test.\n' >> content/04-lithography.md
build 2026-11-11T12:00:00; echo "11 Nov, one sentence added to chapter 4"; report 2026-11-11
# one supplier's role reworded (data only)
node -e 'const fs=require("fs");const f="data/suppliers.json";const s=JSON.parse(fs.readFileSync(f,"utf8"));s[0].role=(s[0].role||"")+" Reworded.";fs.writeFileSync(f,JSON.stringify(s,null,2)+"\n");'
build 2026-11-12T12:00:00; echo "12 Nov, one supplier row reworded in data/suppliers.json"; report 2026-11-12
# chapter 4's one-line summary, which the summary page prints
node -e 'const fs=require("fs");const f="content/04-lithography.md";const s=fs.readFileSync(f,"utf8");fs.writeFileSync(f,s.replace(/"oneLiner": "([^"]*)"/,(m,t)=>`"oneLiner": "${t} Again."`));'
build 2026-11-13T12:00:00; echo "13 Nov, chapter 4's oneLiner changed"; report 2026-11-13
