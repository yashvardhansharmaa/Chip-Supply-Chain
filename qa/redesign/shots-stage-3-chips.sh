#!/bin/sh
# The look gate's shots for the AI Chips redesign (option C, "The timeline"): the view as it opens, with the pair B200 and
# Ascend 910C, with four chips, and /chips/, at 1440 and 390, with dark and the widths between. A shot of a part of the
# comparison scrolls there in its own script, clear of the masthead and the bar that follows the reader.
# usage: sh qa/redesign/shots-stage-3-chips.sh [outdir] [base]   (defaults qa/redesign/shots/stage-3-chips, http://127.0.0.1:8768)
O=${1:-qa/redesign/shots/stage-3-chips}
B=${2:-http://127.0.0.1:8768}
P="CP.Landscape.setPair(['nvidia-b200','huawei-ascend-910c']);"
F="CP.Landscape.setPair(['nvidia-b200','huawei-ascend-910c','amd-mi355x','cerebras-wse3-turbo']);"
# go <selector>: bring a part of the page under the masthead and the bar
go() { echo "await new Promise(function(r){setTimeout(r,300);});document.documentElement.style.scrollBehavior='auto';var e=document.querySelector('$1');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-(innerWidth<900?150:130));"; }
set --
for w in 1440 390; do
  set -- "$@" "chips-empty-$w|$B/#/landscape|$w" "chips-pair-$w|$B/#/landscape|$w||||$P" "chips-pair-full-$w|$B/#/landscape|$w|||full|$P" \
    "chips-chart-$w|$B/#/landscape|$w||.aic-atlas||$P" "chips-picks-$w|$B/#/landscape|$w||#cx-slots||$P" \
    "chips-packages-$w|$B/#/landscape|$w||||$P$(go '#cx-title')" "chips-figures-$w|$B/#/landscape|$w||||$P$(go '#cx-strips')" "chips-words-$w|$B/#/landscape|$w||||$P$(go '#cx-table-wrap')" \
    "chips-notes-$w|$B/#/landscape|$w||||$P$(go '#cx-notes')" "chips-four-words-$w|$B/#/landscape|$w||||$F$(go '#cx-table-wrap')" \
    "chips-bandwidth-$w|$B/#/landscape|$w||.aic-atlas||document.querySelector('#cx-measures [data-m=bw]').click()" \
    "chips-picker-$w|$B/#/landscape|$w||#cx-slots||$P document.querySelector('#cxa-row .cxa-slot[data-i=\"2\"] [data-act=choose]').click()" \
    "ref-chips-$w|$B/chips/|$w" "ref-chips-chart-$w|$B/chips/|$w||.ctl"
done
set -- "$@" "chips-pair-1440-dark|$B/#/landscape|1440|dark|||$P" "chips-figures-1440-dark|$B/#/landscape|1440|dark|||$P$(go '#cx-strips')" "chips-pair-390-dark|$B/#/landscape|390|dark|.aic-atlas||$P" \
  "ref-chips-chart-1440-dark|$B/chips/|1440|dark|.ctl" "chips-pair-1024|$B/#/landscape|1024||||$P" "chips-pair-768|$B/#/landscape|768||.aic-atlas||$P" \
  "chips-pair-320|$B/#/landscape|320||.aic-atlas||$P" "ref-chips-chart-768|$B/chips/|768||.ctl" "ref-chips-chart-320|$B/chips/|320||.ctl"
node qa/redesign/shots.js "$O" "$@"
