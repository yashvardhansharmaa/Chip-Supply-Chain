#!/bin/zsh
# The phone measurement from qa/code-review/performance.md: four pages, five cold loads each, one after another
# (never in parallel, so the runs do not compete for CPU). Needs the local server on 127.0.0.1:8765 serving dist/.
# usage: qa/code-review/perf/run_phone.sh [label]    results go to qa/code-review/perf/out/<label>/ (git-ignored)
cd "$(dirname "$0")"
label=${1:-$(date +%Y-%m-%d-%H%M)}
out="out/$label"; mkdir -p "$out"
PY=${PY:-python3}
$PY measure.py 9980 "http://127.0.0.1:8765/#/"           "$out/home.json"      --runs 5 --wait 10 | tee "$out/home.log"
$PY measure.py 9981 "http://127.0.0.1:8765/#/chain"      "$out/chain.json"     --runs 5 --wait 10 | tee "$out/chain.log"
$PY measure.py 9982 "http://127.0.0.1:8765/#/suppliers"  "$out/suppliers.json" --runs 5 --wait 10 | tee "$out/suppliers.log"
$PY measure.py 9983 "http://127.0.0.1:8765/lithography/" "$out/litho.json"     --runs 5 --wait 8  | tee "$out/litho.log"
$PY agg.py "$out/home.json" "$out/chain.json" "$out/suppliers.json" "$out/litho.json" | tee "$out/summary.txt"
