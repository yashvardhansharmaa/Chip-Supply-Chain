#!/bin/bash
# Shows that the smoke tour (qa/scripts/smoke.js) fails when a build breaks. Each case copies a site, breaks one thing,
# builds it and runs the tour on the routes concerned. Nothing in the repository is written.
#   bash qa/code-review/fixes/safety/break-smoke.sh [<site folder, default: this repository>]
set -u
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=$(cd "${1:-$HERE/../../../..}" && pwd)
T=$(mktemp -d)
trap 'rm -rf "$T"' EXIT
rsync -a --exclude .git --exclude node_modules --exclude 'build/__pycache__' --exclude 'qa/*' --include 'qa/scripts/***' "$SRC/" "$T/clean/"
mkdir -p "$T/clean/qa/scripts" && cp "$SRC/qa/scripts/smoke.js" "$T/clean/qa/scripts/"
run() { # name, routes, then a command that breaks the copy
  local name=$1 only=$2; shift 2
  rm -rf "$T/case" && cp -Rc "$T/clean" "$T/case" 2>/dev/null || cp -R "$T/clean" "$T/case"
  (cd "$T/case" && eval "$@")
  (cd "$T/case" && node build/build.js > "$T/build.log" 2>&1) || { echo "== $name: the build itself failed"; tail -3 "$T/build.log"; return; }
  (cd "$T/case" && SMOKE_PORT=10362 node qa/scripts/smoke.js --only "$only" > "$T/smoke.log" 2>&1); local code=$?
  echo "== $name (smoke --only $only): exit $code"
  sed -n '/failure/,$p' "$T/smoke.log" | cut -c1-240
}
echo "site: $SRC"
run "a thrown error in app.js" chain "printf '\nsetTimeout(function () { throw new Error(\"broken on purpose\"); }, 0);\n' >> src/app.js"
run "a module that fails to load" glossary "printf 'throw new Error(\"broken on purpose\");\n' | cat - src/modules/lookup.js > x && mv x src/modules/lookup.js"
run "a wide element at 320 and 390" walk,chapter-page "printf '\n.wk-step { min-width: 360px; }\n' >> src/styles.css; printf '\n.ch-title { min-width: 400px; }\n' >> build/assets/chapter-page.css"
run "the chokepoint card renamed away" chain,chapter-page "sed -i '' 's/<section class=\"plate\"/<section class=\"plate-x\"/' build/build.js"
run "pages that follow the device's dark setting" theme "printf '\n@media (prefers-color-scheme: dark) { :root:not([data-theme=\"light\"]) { --bg: #14171c !important; } }\n' | tee -a src/styles.css >> build/assets/chapter-page.css; sed -i '' 's/:root { --bg: #f7f6f2;/@media (prefers-color-scheme: dark) { :root:not([data-theme=\"light\"]) { --bg: #14171c !important; } } :root { --bg: #f7f6f2;/' build/modules/summary-brief.js"
run "a missing file the page asks for" chapter-page "rm -f media/litho-light-end.jpg dist/media/litho-light-end.jpg"
