const fs = require('fs');
const vm = require('vm');
const context = { window: {}, console, setInterval: () => 1, clearInterval: () => {} };
vm.createContext(context);
for (const file of ['characters.js','levels.js','game.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
}
const E = context.window.CoupEngine;
let snap;
E.subscribe(s => { snap = s; });
E.loadReferencePlan();
const issues = E.validatePlan();
if (issues.length) throw new Error(`Referenzplan ungültig: ${issues.join('; ')}`);
const started = E.start();
if (!started.ok) throw new Error('Start fehlgeschlagen');
E.pause();
let guard = 0;
while (guard++ < 1000) {
  const s = E.getSnapshot();
  if (s.mode === s.STATES.EVENT_STOP) E.acknowledgeEvent('pause');
  else if (s.mode === s.STATES.PAUSED) E.step();
  else if (s.mode === s.STATES.FINISHED) break;
  else throw new Error(`Unerwarteter Zustand ${s.mode}`);
}
const final = E.getSnapshot();
if (final.mode !== final.STATES.FINISHED) throw new Error('Simulation endet nicht');
if (!final.objectiveReached) throw new Error('Kasse wurde nicht erreicht');
for (const member of final.crew) {
  if (final.runtime[member.id].node !== final.mission.startNode) throw new Error(`${member.id} endet nicht am Fluchtwagen`);
}
if (!final.protocol.some(p => p.text.includes('Mission erfolgreich'))) throw new Error('Abschluss fehlt im Protokoll');
console.log(`PASS: deterministischer Referenzplan in ${final.time} Sekunden, ${final.protocol.length} Protokolleinträge.`);
