#!/bin/bash
# The deploy workflow's build job (.github/workflows/pages.yml), step by step, on this Mac: the same commands in the same
# order, with the job's TZ and CI settings. It builds into the repository's dist/ as node build/build.js always does.
#   bash qa/code-review/fixes/safety/ci-local.sh
set -u
cd "$(dirname "$0")/../../../.." || exit 1
export TZ=America/New_York CI=true
step() { echo "== $*"; local t0=$(date +%s); "$@"; local code=$?; echo "   exit $code, $(( $(date +%s) - t0 )) s"; [ $code = 0 ] || { echo "the job stops here; nothing would deploy"; exit $code; }; }
step node qa/scripts/check-size.js
step sh -c 'node build/build.js > /dev/null'
git diff --quiet -- build/page-dates.json || echo "   warning: this build moved page dates (build/page-dates.json differs from the last commit)"
step node qa/scripts/check-sources.js
step node qa/scripts/check-integrity.js
step node qa/scripts/check-speak.js
step node qa/scripts/smoke.js
echo "all steps passed; the job would upload dist/ and deploy"
