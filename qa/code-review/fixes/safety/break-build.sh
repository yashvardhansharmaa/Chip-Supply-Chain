#!/bin/bash
# The build fails on broken content (PLAN item 10). Copies the site to a temp folder, times a clean build, then breaks a
# fresh copy in each way below and shows the build's exit code and message, and that dist/index.html was not rewritten.
# The first five are the reviewer's (structure.md P1-1). Nothing in the repository is written.
#   bash qa/code-review/fixes/safety/break-build.sh [<site folder, default: this repository>]
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "${1:-$HERE/../../../..}" && pwd)
T=$(mktemp -d)
trap 'rm -rf "$T"' EXIT
rsync -a --exclude qa --exclude .git --exclude node_modules --exclude 'build/__pycache__' "$SRC/" "$T/clean/"
echo "site: $SRC"
echo "== clean build, three runs"
for i in 1 2 3; do (cd "$T/clean" && /usr/bin/time -p node build/build.js > "$T/clean.log" 2> "$T/time.txt"; echo "   exit $?, $(grep real "$T/time.txt")"); done
grep -c '^WARN' "$T/clean.log" | sed 's/^/   warnings: /'
case_() { # name, then a node script that breaks the copy (run in the copy, with fs loaded)
  local name=$1 js=$2
  rm -rf "$T/case" && cp -Rc "$T/clean" "$T/case" 2>/dev/null || cp -R "$T/clean" "$T/case"
  (cd "$T/case" && node -e "const fs=require('fs');const R=(f)=>fs.readFileSync(f,'utf8'),W=(f,s)=>fs.writeFileSync(f,s);$js")
  local before; before=$(stat -f %m "$T/case/dist/index.html" 2>/dev/null || stat -c %Y "$T/case/dist/index.html")
  (cd "$T/case" && node build/build.js > "$T/case.log" 2>&1); local code=$?
  local after; after=$(stat -f %m "$T/case/dist/index.html" 2>/dev/null || stat -c %Y "$T/case/dist/index.html")
  echo "== $name: exit $code$([ "$before" = "$after" ] && echo ', dist/index.html not rewritten')"
  sed -n '/^build failed/,$p' "$T/case.log" | head -6 | cut -c1-220
}
# the reviewer's five
case_ "1. bibliography.json cut off mid-file" "const f='data/bibliography.json',s=R(f);W(f,s.slice(0,s.length>>1));"
case_ "2. five figure markers mistyped in chapter 4" "const f='content/04-lithography.md';W(f,R(f).replace(/\{\{figure:([\w-]+)\}\}/g,(m,id)=>'{{figure:'+id+'s}}'));"
case_ "3. card concentration typed extreme" "const f='content/04-lithography.md';W(f,R(f).replace('\"concentration\": \"Extreme\"','\"concentration\": \"extreme\"'));"
case_ "4. a syntax error in suppliers.json" "const f='data/suppliers.json',s=R(f),i=s.indexOf('\",\n',2000);W(f,s.slice(0,i+1)+s.slice(i+2));"
case_ "5. a syntax error in chapter 9's front matter" "const f='content/09-foundries-and-fabs.md',s=R(f),i=s.indexOf('\",\n');W(f,s.slice(0,i+1)+s.slice(i+2));"
# the other required fields and values
case_ "6. chapter 4 loses its title" "const f='content/04-lithography.md',s=R(f),m=s.match(/^---json\n([\s\S]*?)\n---/),j=JSON.parse(m[1]);delete j.title;W(f,s.replace(m[1],JSON.stringify(j,null,1)));"
case_ "7. chapter 12 loses number, oneLiner and plain" "const f='content/12-substrates-and-pcbs.md',s=R(f),m=s.match(/^---json\n([\s\S]*?)\n---/),j=JSON.parse(m[1]);delete j.number;delete j.oneLiner;delete j.plain;W(f,s.replace(m[1],JSON.stringify(j,null,1)));"
case_ "8. chapter 6 loses its card" "const f='content/06-deposition-and-etch.md',s=R(f),m=s.match(/^---json\n([\s\S]*?)\n---/),j=JSON.parse(m[1]);delete j.card;W(f,s.replace(m[1],JSON.stringify(j,null,2)));"
case_ "9. a substitutability band misspelt" "const f='content/02-silicon-and-wafers.md',s=R(f),m=s.match(/^---json\n([\s\S]*?)\n---/),j=JSON.parse(m[1]);j.card.substitutability.band='Moderat';W(f,s.replace(m[1],JSON.stringify(j,null,2)));"
case_ "10. a figure with no data" "const f='content/16-component-costs.md',s=R(f),m=s.match(/^---json\n([\s\S]*?)\n---/),j=JSON.parse(m[1]);j.figures[1].data=[];W(f,s.replace(m[1],JSON.stringify(j,null,2)));"
case_ "11. an animation whose steps were never rendered" "fs.unlinkSync('media/litho.json');"
case_ "12. glossary.json left empty" "W('data/glossary.json','');"
case_ "13. fx-rates.json cut off" "const f='data/fx-rates.json',s=R(f);W(f,s.slice(0,s.length-40));"
case_ "14. a figure marker inside a sentence" "const f='content/10-memory-and-hbm.md';W(f,R(f).replace(/\n\{\{figure:([\w-]+)\}\}\n/,(m,id)=>'\nSee the chart {{figure:'+id+'}} below.\n'));"
case_ "15. a build module that throws" "const f='build/modules/walk.js';W(f,'throw new Error(\"broken on purpose\");\n'+R(f));"
