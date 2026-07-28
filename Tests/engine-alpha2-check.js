const fs = require('fs');
const vm = require('vm');
const context = { window: {}, console, setInterval: () => 1, clearInterval: () => {} };
vm.createContext(context);
for (const file of ['characters.js','levels.js','game.js']) vm.runInContext(fs.readFileSync(file,'utf8'), context, {filename:file});
const E = context.window.CoupEngine;
let snapshots=[]; E.subscribe(s=>snapshots.push(s));
E.loadReferencePlan();
let s=E.getSnapshot();

// Bearbeitungsfunktionen isoliert prüfen und anschließend Referenzplan wiederherstellen.
E.addWait('bruno', 17);
let edited=E.getSnapshot();
if(edited.plans.bruno.at(-1).duration!==17) throw new Error('Freie Wartezeit nicht hinzugefügt');
const waitIndex=edited.plans.bruno.length-1;
E.updateWait('bruno',waitIndex,23);
if(E.getSnapshot().plans.bruno[waitIndex].duration!==23) throw new Error('Wartezeit nicht geändert');
E.moveAction('bruno',waitIndex,-1);
E.deleteAction('bruno',waitIndex-1);
E.loadReferencePlan();
if (s.mode !== E.STATES.READY) throw new Error('Referenzplan nicht READY');
if (!s.plans.bruno.some(a=>a.type==='openDoor'&&a.door==='front')) throw new Error('Haupteingang wird nicht geöffnet');
if (!s.plans.emil.some(a=>a.type==='openDoor'&&a.door==='rear')) throw new Error('Hintertür wird nicht geöffnet');
const issues=E.validatePlan(); if(issues.length) throw new Error('Referenzplan fehlerhaft: '+issues.join(' | '));
const result=E.start(); if(!result.ok) throw new Error('Start fehlgeschlagen');
let guard=0;
while(![E.STATES.FINISHED,E.STATES.ABORTED].includes(E.getSnapshot().mode)&&guard<1000){
  let mode=E.getSnapshot().mode;
  if(mode===E.STATES.EVENT_STOP) E.acknowledgeEvent('continue');
  else E._test.simulateOneSecond();
  guard++;
}
s=E.getSnapshot();
if(s.mode!==E.STATES.FINISHED) throw new Error('Simulation endet nicht: '+s.mode);
if(!s.objectiveReached) throw new Error('Kasse nicht erreicht');
if(s.doorStates.front!=='open'||s.doorStates.rear!=='open') throw new Error('Türen nicht geöffnet');
if(!s.protocol.some(p=>p.text.includes('beginnt: Öffne'))) throw new Error('Türbeginn fehlt im Protokoll');
if(!s.protocol.some(p=>p.text.includes('Tür ist offen'))) throw new Error('Türende fehlt im Protokoll');
console.log(JSON.stringify({ok:true,time:s.time,protocol:s.protocol.length,front:s.doorStates.front,rear:s.doorStates.rear}));
