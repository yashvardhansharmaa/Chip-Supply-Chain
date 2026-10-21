#!/usr/bin/env python3
"""Main-thread time by activity from a Chrome trace: self time of each event on the renderer main thread, grouped.
usage: tracesum.py trace.json [until_ms]  (until: only count events that start before this many ms after navigationStart)"""
import json, sys
from collections import defaultdict
import os
raw = open(os.environ['TRACE'], 'rb').read().decode('utf-8', 'replace')
try:
    tr = json.loads(raw)
except Exception:
    tr = json.loads(raw.rstrip().rstrip(',') + ']}') if raw.lstrip().startswith('{') else json.loads(raw.rstrip().rstrip(',') + ']')
ev = tr['traceEvents'] if isinstance(tr, dict) else tr
until = None
# the renderer main thread of the page: the thread named CrRendererMain in the process that ran ParseHTML of our URL
names = {}
for e in ev:
    if e.get('ph') == 'M' and e.get('name') == 'thread_name': names[(e['pid'], e['tid'])] = e['args']['name']
mains = [k for k, v in names.items() if v == 'CrRendererMain']
cnt = defaultdict(int)
for e in ev:
    if e.get('name') == 'ParseHTML' and (e['pid'], e['tid']) in mains: cnt[(e['pid'], e['tid'])] += e.get('dur', 0) or 1
main = max(cnt, key=cnt.get)
# navigation start
nav = [e for e in ev if e.get('name') in ('navigationStart',) and e['pid'] == main[0]]
t0 = None
for e in nav:
    if 'args' in e and e['args'].get('data', {}).get('documentLoaderURL', '').startswith('http://127.0.0.1:8765/') and 'robots' not in e['args']['data'].get('documentLoaderURL', ''): t0 = e['ts']
if t0 is None: t0 = min(e['ts'] for e in ev if (e.get('pid'), e.get('tid')) == main and e.get('ts'))
GROUP = {
    'ParseHTML': 'Parse HTML', 'ParseAuthorStyleSheet': 'Parse CSS',
    'EvaluateScript': 'Script', 'v8.compile': 'Script compile', 'v8.compileModule': 'Script compile', 'v8.parseOnBackground': 'Script compile', 'V8.CompileCode': 'Script compile', 'v8.produceCache': 'Script compile', 'V8.CompileLazy': 'Script compile',
    'FunctionCall': 'Script', 'TimerFire': 'Script', 'FireAnimationFrame': 'Script', 'EventDispatch': 'Script', 'RunMicrotasks': 'Script', 'v8.run': 'Script', 'v8.callFunction': 'Script', 'FireIdleCallback': 'Script', 'V8.Execute': 'Script', 'XHRReadyStateChange': 'Script', 'v8.evaluateModule': 'Script',
    'UpdateLayoutTree': 'Style', 'RecalculateStyles': 'Style', 'ScheduleStyleRecalculation': 'Style', 'InvalidateLayout': 'Layout',
    'Layout': 'Layout', 'UpdateLayerTree': 'Layout', 'Layerize': 'Paint & composite', 'PrePaint': 'Paint & composite', 'Paint': 'Paint & composite', 'PaintImage': 'Paint & composite', 'CompositeLayers': 'Paint & composite', 'Commit': 'Paint & composite', 'UpdateLayer': 'Paint & composite', 'IntersectionObserverController::computeIntersections': 'Layout', 'HitTest': 'Layout',
    'MinorGC': 'GC', 'MajorGC': 'GC', 'BlinkGC.AtomicPhase': 'GC', 'V8.GCScavenger': 'GC', 'V8.GCFinalizeMC': 'GC', 'V8.GC_MC_BACKGROUND_EVACUATE_COPY': 'GC', 'ThreadState::performIdleLazySweep': 'GC', 'V8.GCIncrementalMarking': 'GC', 'V8.GCCompactor': 'GC',
    'Decode Image': 'Images', 'ImageDecodeTask': 'Images', 'ResourceReceivedData': 'Loading', 'ResourceReceiveResponse': 'Loading', 'ResourceSendRequest': 'Loading', 'ResourceFinish': 'Loading',
}
def classify(n):
    if n.startswith(('Document::recalcStyle', 'Document::updateStyle', 'StyleEngine', 'Document::UpdateStyle', 'StyleRecalc', 'CSS')): return 'Style'
    if n.startswith(('LocalFrameView::performLayout', 'InlineNode::', 'LayoutView', 'Layout', 'NG', 'LayoutBlock', 'FrameView::layout', 'LocalFrameView::UpdateLayout')): return 'Layout'
    if n.startswith(('Blink.', 'Paint', 'Raster', 'cc::', 'LayerTreeHost', 'ProxyMain', 'PaintArtifact', 'Composit', 'WebFrameWidgetImpl::UpdateLifecycle', 'PageAnimator', 'LocalFrameView::RunPostLifecycleSteps', 'LocalFrameView::UpdateAllLifecyclePhases')): return 'Paint & composite (lifecycle)'
    if n.startswith(('HTMLDocumentParser', 'TextResourceDecoder', 'NavigationBodyLoader', 'DocumentLoader', 'HTMLTreeBuilder', 'HTMLParser', 'BackgroundHTML')): return 'Parse HTML'
    if n.startswith(('v8.', 'V8.', 'BlinkScheduler_PerformMicrotaskCheckpoint', 'AsyncTask', 'FunctionCall')): return 'Script'
    if n.startswith(('IntersectionObserver',)): return 'Layout'
    if 'GC' in n: return 'GC'
    return 'Other: ' + n

def records():
    xs = [e for e in ev if (e.get('pid'), e.get('tid')) == main and e.get('ph') == 'X' and e.get('dur') is not None]
    xs.sort(key=lambda e: (e['ts'], -e['dur']))
    out = []; stack = []
    def close_until(ts):
        while stack and stack[-1]['end'] <= ts:
            out.append(stack.pop())
    for e in xs:
        close_until(e['ts'])
        name = e['name']
        g = 'Other' if name in ('RunTask', 'ThreadControllerImpl::RunTask') else (GROUP.get(name) or classify(name))
        if g.startswith('Other'): g = 'Other'
        if g.startswith('Paint'): g = 'Paint & composite'
        if g == 'Script compile': g = 'Script'
        rec = {'name': name, 'g': g, 'start': (e['ts'] - t0) / 1000.0, 'end': e['ts'] + e['dur'], 'self': e['dur'] / 1000.0}
        if stack: stack[-1]['self'] -= e['dur'] / 1000.0
        stack.append(rec)
    close_until(float('inf'))
    return out
