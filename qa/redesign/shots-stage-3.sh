#!/bin/sh
# The look gate's shots for stage 3: the other views (Suppliers, Export Controls, China revenue share, The Chain's top, the walk,
# the summary page, the four reference pages), the readable pages' openings and the stage 2 review's fixes, at 1440 and 390,
# with a few states, 1024 and dark. usage: sh qa/redesign/shots-stage-3.sh [outdir]   (default qa/redesign/shots/stage-3)
O=${1:-qa/redesign/shots/stage-3}
B=http://127.0.0.1:8766
set --
for w in 1440 390; do
  set -- "$@" "sup-top-$w|$B/#/suppliers|$w" "sup-route-$w|$B/#/suppliers|$w||#the-route" "sup-route-jp-$w|$B/#/suppliers?country=JP|$w||#the-route" \
    "sup-flow-$w|$B/#/suppliers|$w||#sup-pipe" "sup-flow-jp-$w|$B/#/suppliers|$w||#sup-pipe||document.querySelector('.sup-chip[data-c=JP]').click()" \
    "sup-flow-eu-$w|$B/#/suppliers?group=eu|$w||#sup-pipe" "sup-segment-$w|$B/#/suppliers|$w||#sup-reg" "sup-country-$w|$B/#/suppliers?tab=country|$w||#sup-reg" \
    "sup-table-$w|$B/#/suppliers?tab=table|$w||#sup-reg" \
    "ec-top-$w|$B/#/controls|$w" "ec-board-$w|$B/#/controls|$w||#cf" "ec-subject-$w|$B/#/controls|$w||#cf||document.querySelector('.cf-mode[data-mode=subject]').click()" \
    "exposure-$w|$B/#/exposure|$w" "exposure-panels-$w|$B/#/exposure|$w||#exposure-viz" \
    "chain-top-$w|$B/#/chain|$w" "chain-contents-$w|$B/#/chain|$w||#contents" "walk-$w|$B/#/walk/lithography|$w" \
    "summary-$w|$B/summary/|$w" "summary-glance-$w|$B/summary/|$w||#glance-h" "summary-cards-$w|$B/summary/|$w||#stages-h" \
    "ref-suppliers-$w|$B/suppliers/|$w" "ref-export-controls-$w|$B/export-controls/|$w" "ref-chips-$w|$B/chips/|$w" "ref-glossary-$w|$B/glossary/|$w" \
    "chain-litho-fig-cite-$w|$B/#lithography|$w||#fig-lithography-asml-region||document.querySelector('#fig-lithography-asml-region .ch-cite-btn').click()" \
    "page-litho-spec-$w|$B/lithography/|$w||.ch-spec" "page-geo-spec-$w|$B/geopolitics/|$w||.ch-spec"
done
for c in design-and-eda silicon-and-wafers chemicals-gases-and-photoresist photomasks-and-pellicles deposition-and-etch metrology-and-inspection transistors-and-front-end foundries-and-fabs memory-and-hbm advanced-packaging substrates-and-pcbs test-and-assembly systems-and-networking data-centers-and-power component-costs; do
  set -- "$@" "page-$c-spec-1440|$B/$c/|1440||.ch-spec"
done
set -- "$@" "sup-route-1024|$B/#/suppliers|1024||#the-route" "sup-route-1280|$B/#/suppliers|1280||#the-route" "sup-flow-768|$B/#/suppliers|768||#sup-pipe" \
  "sup-route-1440-dark|$B/#/suppliers?country=TW|1440|dark|#the-route" "sup-flow-1440-dark|$B/#/suppliers|1440|dark|#sup-pipe||document.querySelector('.sup-chip[data-c=JP]').click()" \
  "ec-board-1440-dark|$B/#/controls|1440|dark|#cf||document.querySelector('.cf-mode[data-mode=subject]').click()" "exposure-1440-dark|$B/#/exposure|1440|dark|#exposure-viz" \
  "chain-top-1440-dark|$B/#/chain|1440|dark" "summary-1440-dark|$B/summary/|1440|dark|#stages-h" "page-mem-spec-1440-dark|$B/memory-and-hbm/|1440|dark|.ch-spec" \
  "page-litho-rail-1024|$B/lithography/|1024||.ch-rail" "page-litho-rail-390|$B/lithography/|390||.ch-rail" \
  "chain-litho-card-390|$B/#lithography|390||#lithography .plate" "chain-litho-strip-390|$B/#lithography|390||#lithography--how-it-works||document.querySelector('.stage-toggle').click()"
node qa/redesign/shots.js "$O" "$@"
