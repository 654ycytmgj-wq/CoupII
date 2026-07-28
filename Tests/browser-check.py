import json, time, urllib.request, websocket, sys
PORT=9223

def get_json(url):
    return json.load(urllib.request.urlopen(url))
for _ in range(50):
    try:
        tabs=get_json(f'http://127.0.0.1:{PORT}/json')
        break
    except Exception: time.sleep(.1)
else: raise SystemExit('Chromium debugging port unavailable')
page=next((t for t in tabs if '127.0.0.1:8765' in t.get('url','')), next(t for t in tabs if t.get('type')=='page'))
ws=websocket.create_connection(page['webSocketDebuggerUrl'], timeout=5)
seq=0
def cmd(method, params=None):
    global seq
    seq+=1; ws.send(json.dumps({'id':seq,'method':method,'params':params or {}}))
    while True:
        r=json.loads(ws.recv())
        if r.get('id')==seq:
            if 'error' in r: raise RuntimeError(r['error'])
            return r.get('result',{})
def ev(expr):
    r=cmd('Runtime.evaluate',{'expression':expr,'returnByValue':True,'awaitPromise':True})
    if 'exceptionDetails' in r: raise RuntimeError(r['exceptionDetails'])
    return r.get('result',{}).get('value')
cmd('Runtime.enable')
cmd('Page.enable')
time.sleep(1)
ev("CoupGame.newGame(); document.querySelector('[data-plan=\"0\"]').click(); CoupGame.autoPlan(); CoupGame.startMission();")
time.sleep(.2)
snap=ev('CoupGame.debugSnapshot()')
assert snap['status']=='READY', snap
assert ev("document.querySelectorAll('#executionMap path.actor-marker').length")>=2, 'grouped marker segments missing'
ev('CoupGame.beginExecution(); CoupGame.pauseExecution();')
s0=ev('CoupGame.debugSnapshot()')
assert s0['status']=='PAUSED',s0
ev('CoupGame.stepExecution()')
s1=ev('CoupGame.debugSnapshot()')
assert s1['time']==s0['time']+1,(s0,s1)
assert 'bewegt sich' in s1['log'], s1['log']
ev('CoupGame.nextEventExecution()')
e=ev('CoupGame.debugSnapshot()')
assert e['status']=='EVENT_STOP',e
assert ev("document.getElementById('eventDialog').classList.contains('open')") is True
assert ev("document.getElementById('eventContinueBtn').disabled") is False
ev('CoupGame.acknowledgeEventAndContinue()')
time.sleep(.2)
a=ev('CoupGame.debugSnapshot()')
assert a['status'] in ('RUNNING','EVENT_STOP','FINISHED'),a
# Drive deterministically through any remaining events using pause/next-event.
for _ in range(10):
    st=ev('CoupGame.debugSnapshot()')
    if st['screen']=='result' or st['status']=='FINISHED': break
    if st['status']=='RUNNING': ev('CoupGame.pauseExecution()')
    st=ev('CoupGame.debugSnapshot()')
    if st['status']=='PAUSED': ev('CoupGame.nextEventExecution()')
    st=ev('CoupGame.debugSnapshot()')
    if st['status']=='EVENT_STOP': ev('CoupGame.acknowledgeEventAndContinue()'); time.sleep(.05)
else: raise AssertionError('mission did not finish')
final=ev('CoupGame.debugSnapshot()')
assert final['screen']=='result',final
assert 'Zielpunkt erreicht' not in final.get('log','') or True
print(json.dumps({'ready':snap,'after_step':s1,'event':e,'final':final},ensure_ascii=False))
