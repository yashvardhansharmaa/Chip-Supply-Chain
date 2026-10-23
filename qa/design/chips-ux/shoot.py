#!/usr/bin/env python3
"""Shoot one AI Chips design option on the live dev site (http://127.0.0.1:8765/), WebGL on.

usage: python3 qa/design/chips-ux/shoot.py <option-dir> <state> <1440|390> [out.png] [--full]

<option-dir> holds option.css and option.js. option.js must define window.CXP.states, a map of
state name -> function returning a promise (or nothing); the function sets the page to that state
(picks chips through the option's own controls, scrolls). The driver injects the CSS, runs the JS,
runs the state, waits for the specimen to settle, then captures through dc_shoot.py.
Nothing in src/ or dist/ is touched: every change lives in the injected code.
"""
import json, os, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
shoot = os.path.join(here, '..', 'shots', 'design-chapter', 'proof', 'dc_shoot.py')
args = sys.argv[1:]
full = '--full' in args
args = [a for a in args if a != '--full']
opt, state, width = args[0], args[1], args[2]
out = args[3] if len(args) > 3 else os.path.join(opt, f'{state}-{width}.png')
css = open(os.path.join(opt, 'option.css')).read() if os.path.exists(os.path.join(opt, 'option.css')) else ''
js = open(os.path.join(opt, 'option.js')).read() if os.path.exists(os.path.join(opt, 'option.js')) else ''

ev = (
    "(async () => {"
    " const st = document.createElement('style'); st.id = 'cxp-css'; st.textContent = " + json.dumps(css) + "; document.head.appendChild(st);"
    " (0, eval)(" + json.dumps(js) + ");"
    " await new Promise(r => setTimeout(r, 300));"
    " const fn = window.CXP && CXP.states && CXP.states[" + json.dumps(state) + "];"
    " if (!fn) return 'no state " + state + "';"
    " await fn();"
    " await new Promise(r => setTimeout(r, 2200));"
    " const cnt = document.querySelector('[aria-live]:not(:empty)');"
    " return { y: scrollY, h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth,"
    "   picked: CP.Landscape.picked.slice(), live: Array.from(document.querySelectorAll('section[data-view=landscape] [aria-live]')).map(e => e.textContent.trim()) };"
    "})()"
)
cmd = ['python3', shoot, 'http://127.0.0.1:8765/#/landscape', out, '--wait', '7', '--port', '9970', '--eval', ev]
cmd += ['--mobile'] if width == '390' else ['--width', '1440', '--height', '900']
if full: cmd.append('--full')
subprocess.run(cmd, check=True)
