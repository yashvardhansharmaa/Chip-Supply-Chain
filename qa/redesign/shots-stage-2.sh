#!/bin/sh
# The look gate's shots for stage 2: the chapter page in The Chain and on every readable page, at 1440 and 390, a few in dark,
# and the views the stage also touched (the home's caption and tab order, Export Controls' countdown, AI Chips' key).
# usage: sh qa/redesign/shots-stage-2.sh [outdir]   (default qa/redesign/shots/stage-2)
O=${1:-qa/redesign/shots/stage-2}
B=http://127.0.0.1:8766
set --
for w in 1440 390; do
  set -- "$@" "chain-litho-open-$w|$B/#lithography|$w" "chain-litho-card-$w|$B/#lithography|$w||#lithography .plate" \
    "chain-litho-plain-$w|$B/#lithography|$w||#lithography--plain" "chain-litho-fig-$w|$B/#lithography|$w||#fig-lithography-asml-region" \
    "chain-litho-anim-$w|$B/#lithography|$w||#fig-lithography-litho-print" "chain-litho-deck-$w|$B/#lithography|$w||#lithography--flashcards" \
    "chain-chem-open-$w|$B/#chemicals-gases-and-photoresist|$w" "chain-front-end-tl-$w|$B/#transistors-and-front-end|$w||#fig-transistors-and-front-end-node-roadmap" \
    "chain-costs-night-$w|$B/#component-costs|$w||#component-costs .ch-spec" "chain-geo-night-$w|$B/#geopolitics|$w||#geopolitics .ch-spec" \
    "page-litho-spec-$w|$B/lithography/|$w||.ch-spec" "page-litho-body-$w|$B/lithography/|$w||#lithography--plain" "page-litho-fig-$w|$B/lithography/|$w||#fig-lithography-asml-region" \
    "home-$w|$B/#/|$w" "export-controls-$w|$B/#/controls|$w" "ai-chips-$w|$B/#/landscape|$w"
  for c in design-and-eda silicon-and-wafers chemicals-gases-and-photoresist lithography photomasks-and-pellicles deposition-and-etch metrology-and-inspection transistors-and-front-end foundries-and-fabs memory-and-hbm advanced-packaging substrates-and-pcbs test-and-assembly systems-and-networking data-centers-and-power component-costs geopolitics; do
    set -- "$@" "page-$c-$w|$B/$c/|$w"
  done
done
set -- "$@" "chain-litho-open-1440-dark|$B/#lithography|1440|dark" "chain-litho-card-1440-dark|$B/#lithography|1440|dark|#lithography .plate" \
  "chain-litho-fig-1440-dark|$B/#lithography|1440|dark|#fig-lithography-asml-region" "chain-litho-open-390-dark|$B/#lithography|390|dark" \
  "page-litho-spec-1440-dark|$B/lithography/|1440|dark|.ch-spec" "page-litho-390-dark|$B/lithography/|390|dark" \
  "chain-litho-1024|$B/#lithography|1024||#lithography .ch-spec" "chain-litho-rail-1024|$B/#lithography|1024||#lithography .ch-rail" "page-litho-768|$B/lithography/|768" "home-1024|$B/#/|1024" "chain-litho-320|$B/#lithography|320"
node qa/redesign/shots.js "$O" "$@"
