#!/bin/bash
# The page revisions of 28 Oct 2026 (MAIN/qa/design9/BUILD-PAGES.md): each changed figure at 1440, clipped to its box.
# usage: bash qa/redesign/shots-stage-pages.sh <before|after> [base] [outdir] [width] [theme]
#   before: http://127.0.0.1:8766 (the redesign at 5428ddb); after: http://127.0.0.1:8778 (this worktree)
K=${1:-after}
if [ "$K" = before ]; then B=${2:-http://127.0.0.1:8766}; else B=${2:-http://127.0.0.1:8778}; fi
O=${3:-qa/redesign/shots/stage-pages}; W=${4:-1440}; T=${5:-}
S=""; [ -n "$T" ] && S="-$T"
specs=()
for p in "04.2 lithography tool-price" "04.3 lithography euv-shipments" "09.2 memory-and-hbm hbm-bandwidth" \
  "14.4 data-centers-and-power us-dc-electricity" "16.2 geopolitics china-tool-revenue" "03.3 chemicals-gases-and-photoresist germanium-price" \
  "06.3 deposition-and-etch equipment-billings" "09.4 memory-and-hbm hbm-revenue" "10.3 advanced-packaging cowos-reticles" \
  "11.2 substrates-and-pcbs abf-layers" "12.4 test-and-assembly ase-testers" "13.2 systems-and-networking nvlink-bandwidth" \
  "13.3 systems-and-networking switch-bandwidth" "14.3 data-centers-and-power turbine-output"; do
  set -- $p
  specs+=("fig-$1-$W$S-$K|$B/#$2|$W|$T|#fig-$2-$3")
done
node qa/redesign/shots-el.js "$O" "${specs[@]}"
