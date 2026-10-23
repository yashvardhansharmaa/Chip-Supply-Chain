#!/usr/bin/env python3
"""Prints one block per viewport and theme from checks.py's JSON: python3 summarize.py <label>"""
import json, glob, sys
label = sys.argv[1]
for f in sorted(glob.glob(label + '-*.json'), key=lambda x: (-int(x.split('-')[1]), x)):
    d = json.load(open(f)); print('=====', f)
    for r, v in (d.get('obscured') or {}).items():
        print('  obscured %-8s fwd %s | back %s' % (r, v['forward'], v['back']))
        for x in v['hidden'][:3]: print('      e.g.', x['el'][:60], x['state'], x['top'], x['bottom'], 'bars', x['barTop'], x['barBottom'])
    ch = d.get('chips')
    if ch: print('  AI Chips, %s chips in, --cx-sticky %s, scroll-padding-top %s: 30 Shift+Tabs %s, %s of them with the Comparing bar shown %s' % (ch['picked'], ch['cxSticky'], ch['paddingTop'], ch['back'], ch.get('stepsWithBar'), [(y['el'][:40], y['state'], y['top'], y['barTop']) for y in ch['hidden']]))
    for r, v in (d.get('skip') or {}).items():
        print('  skip %-11s first Tab: %s | Enter: %s, focus %s | next Tab: %s (in main: %s)' % (r, v['firstTab'][:34], v['afterEnter']['hash'], v['afterEnter']['active'][:30], v['nextTab']['active'][:40], v['nextTab']['inMain']))
    se = d.get('search') or {}
    if se:
        print('  search: aria-modal %s, #app inert %s | status %r | 24 Tabs: %s inside, %s outside | Esc with focus on body: closed %s | Esc from a result: closed %s, focus %s' % (
            se['open']['modal'], se['open']['appInert'], se.get('status'), se['tab24_inside'], str(se['tab24_outside']) + ' ' + str(se.get('outside', '')), se['escFromBody']['closed'], se['escFromResult']['closed'], se['escFromResult']['active'][:30]))
        for k, v in (se.get('picks') or {}).items():
            print('     pick %-24s -> %s' % (k, v if isinstance(v, str) else '%s  heading=%s where=%s' % (v['active'][:58], v['heading'], v['where'])))
    sh = d.get('sheet')
    if sh:
        print('  sheet: aria-modal %s, #app inert %s | 40 Tabs: %s inside, %s outside | Esc -> %s | Close -> %s | chapter link -> %s (%s) | page link -> %s' % (
            sh['open']['modal'], sh['open']['appInert'], sh['tab40_inside'], str(sh['tab40_outside']) + ' ' + str(sh.get('outside', '')), sh['escape']['active'][:30], sh['closeBtn']['active'][:30], sh['chapter']['active'][:40], sh['chapter']['where'], sh['page']['active'][:40]))
    c = d.get('contrast') or {}
    if c:
        print('  contrast: step numbers %s to %s (%s) | atlas stops %s to %s | table peaks min %s, under 4.5: %s of %s | search placeholder %s' % (
            c['animStepN']['min'], c['animStepN']['max'], c['animStepN']['n'], c['atlasStops']['min'], c['atlasStops']['max'], c['peaks']['min'], c['peaks']['under45'], c['peaks']['n'], c['placeholder']['ratio']))
        print('  control edges:', ', '.join('%s %s' % (k, (v or {}).get('ratio')) for k, v in (c.get('edges') or {}).items()))
    fo = d.get('focus') or {}
    if fo:
        print('  Back to top: hidden but focused in first 14 Tabs: %s; hidden state %s | .wk-tabs a outline: %s | .cf-jump-btn outline: %s' % (fo['toTopHiddenStops'], fo['toTopShown'], (fo.get('wkTabs') or {}).get('outline'), (fo.get('cfJump') or {}).get('outline')))
    sp = d.get('spin')
    if sp: print('  spin:', sp)
    hm = d.get('home')
    if hm: print('  Home tab (%s): before %s -> after %s' % (hm.get('how', 'Enter'), hm['before'], hm['after']))
    ax = d.get('axe') or {}
    if ax: print('  axe:', '; '.join('%s %s %s' % (k, v['total'], v['rules']) for k, v in ax.items()))
