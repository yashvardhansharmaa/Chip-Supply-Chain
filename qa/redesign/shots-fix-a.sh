#!/bin/sh
# Before-and-after shots for section A of the final QA (fix-a, 28 Oct 2026).
# usage: sh qa/redesign/shots-fix-a.sh before http://127.0.0.1:8766   |   sh qa/redesign/shots-fix-a.sh after http://127.0.0.1:8781
P=$1; B=$2; O=qa/redesign/shots/fix-a
cd "$(dirname "$0")/../.." || exit 1
S() { node qa/redesign/shots.js "$O" "$P-$1" >/dev/null 2>&1 || echo "failed: $1"; }
S "b200-figs-1440|$B/#/landscape?pick=nvidia-b200|1440||#aic-card .card-stats"
S "b300-figs-1440|$B/#/landscape?pick=nvidia-b300|1440||#aic-card .card-stats"
S "b200-b300-cmp-1440|$B/#/landscape?pick=nvidia-b200,nvidia-b300|1440||#aic-card"
S "rubin-figs-1440|$B/#/landscape?pick=nvidia-vr200|1440||#aic-card .card-stats"
S "rubin-rows-1440|$B/#/landscape?pick=nvidia-vr200|1440||#aic-card .card-rows"
S "h20-rows-1440|$B/#/landscape?pick=nvidia-h20|1440||#aic-card .card-rows"
S "h100-rows-1440|$B/#/landscape?pick=nvidia-h100|1440||#aic-card .card-rows"
S "h100-rows-390|$B/#/landscape?pick=nvidia-h100|390||#aic-card .card-rows"
S "mi355x-parts-1440|$B/#/landscape?pick=amd-mi355x|1440||#aic-card .card-stats"
S "mi455x-parts-1440|$B/#/landscape?pick=amd-mi455x|1440||#aic-card .card-stats"
S "field-fp16-1440|$B/#/landscape|1440"
S "field-tdp-1440|$B/#/landscape?measure=tdp|1440"
S "chips-table-1440|$B/chips/|1440||#specs"
S "glossary-gaudi3-1440|$B/#/glossary|1440||||document.querySelector('[data-id=lk-chip-intel-gaudi3]').scrollIntoView({block:'center'})"
S "glossary-mi455x-1440|$B/#/glossary|1440||||document.querySelector('[data-id=lk-chip-amd-mi455x]').scrollIntoView({block:'center'})"
S "h100-export-1440|$B/#/landscape?pick=nvidia-h100|1440||#aic-card .card-rows .cr:nth-of-type(8)"
S "h20-export-1440|$B/#/landscape?pick=nvidia-h20|1440||#aic-card .card-rows .cr:nth-of-type(8)"
S "mi455x-plan-1440|$B/#/landscape?pick=amd-mi455x|1440||#aic-card"
