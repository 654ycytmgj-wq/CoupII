(() => {
  'use strict';

  const STATES = Object.freeze({
    PLANNING: 'PLANNING', READY: 'READY', RUNNING: 'RUNNING', PAUSED: 'PAUSED',
    EVENT_STOP: 'EVENT_STOP', FINISHED: 'FINISHED', ABORTED: 'ABORTED'
  });

  const mission = window.GAME_MISSION;
  const crew = window.GAME_CREW;
  const nodeById = Object.fromEntries(mission.nodes.map(n => [n.id, n]));
  const adjacency = buildAdjacency(mission.edges);

  const state = {
    mode: STATES.PLANNING,
    selectedCrewId: 'bruno',
    speed: 4,
    time: 0,
    timer: null,
    plans: Object.fromEntries(crew.map(c => [c.id, []])),
    runtime: {},
    eventQueue: [],
    objectiveReached: false,
    protocol: [],
    lastEvent: null
  };

  function buildAdjacency(edges) {
    const map = {};
    mission.nodes.forEach(n => { map[n.id] = []; });
    edges.forEach(([a, b]) => { map[a].push(b); map[b].push(a); });
    return map;
  }

  function shortestPath(from, to) {
    if (from === to) return [from];
    const queue = [[from]];
    const seen = new Set([from]);
    while (queue.length) {
      const path = queue.shift();
      const last = path[path.length - 1];
      for (const next of adjacency[last]) {
        if (seen.has(next)) continue;
        const candidate = [...path, next];
        if (next === to) return candidate;
        seen.add(next);
        queue.push(candidate);
      }
    }
    throw new Error(`Kein Weg von ${from} nach ${to}`);
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function secondsForEdge(aId, bId) {
    return Math.max(2, Math.round(distance(nodeById[aId], nodeById[bId]) / 28));
  }

  function currentPlannedNode(crewId) {
    const actions = state.plans[crewId];
    for (let i = actions.length - 1; i >= 0; i -= 1) {
      if (actions[i].type === 'move') return actions[i].to;
    }
    return mission.startNode;
  }

  function addMove(crewId, targetNode) {
    if (state.mode !== STATES.PLANNING && state.mode !== STATES.READY) return;
    const from = currentPlannedNode(crewId);
    const path = shortestPath(from, targetNode);
    for (let i = 1; i < path.length; i += 1) {
      state.plans[crewId].push({
        type: 'move', from: path[i - 1], to: path[i], duration: secondsForEdge(path[i - 1], path[i])
      });
    }
    setMode(STATES.PLANNING);
    notify();
  }

  function addWait(crewId, seconds) {
    if (state.mode !== STATES.PLANNING && state.mode !== STATES.READY) return;
    state.plans[crewId].push({ type: 'wait', duration: seconds, at: currentPlannedNode(crewId) });
    setMode(STATES.PLANNING);
    notify();
  }

  function removeLast(crewId) {
    state.plans[crewId].pop();
    setMode(STATES.PLANNING);
    notify();
  }

  function clearPlan(crewId) {
    state.plans[crewId] = [];
    setMode(STATES.PLANNING);
    notify();
  }

  function loadReferencePlan() {
    state.plans = {
      bruno: [
        ...pathActions('car', 'cash'),
        { type: 'wait', duration: 5, at: 'cash' },
        ...pathActions('cash', 'car')
      ],
      emil: [
        ...pathActions('car', 'shop'),
        { type: 'wait', duration: 10, at: 'shop' },
        ...pathActions('shop', 'car')
      ]
    };
    setMode(STATES.READY);
    resetRuntimeOnly();
    log('Referenzplan geladen. Bereit zum Start.');
    notify();
  }

  function pathActions(from, to) {
    const path = shortestPath(from, to);
    return path.slice(1).map((node, index) => ({
      type: 'move', from: path[index], to: node, duration: secondsForEdge(path[index], node)
    }));
  }

  function validatePlan() {
    const issues = [];
    for (const member of crew) {
      const actions = state.plans[member.id];
      if (!actions.length) issues.push(`${member.name}: keine Aktionen geplant.`);
      const end = currentPlannedNode(member.id);
      if (end !== mission.startNode) issues.push(`${member.name}: endet nicht am Fluchtwagen.`);
    }
    const brunoVisitsCash = state.plans.bruno.some(a => a.type === 'move' && a.to === mission.objectiveNode);
    if (!brunoVisitsCash) issues.push('Bruno erreicht die Kasse nicht.');
    if (!issues.length) setMode(STATES.READY);
    notify();
    return issues;
  }

  function prepareRuntime() {
    state.time = 0;
    state.objectiveReached = false;
    state.eventQueue = [];
    state.lastEvent = null;
    state.protocol = [];
    state.runtime = {};
    for (const member of crew) {
      state.runtime[member.id] = {
        node: mission.startNode,
        x: nodeById[mission.startNode].x,
        y: nodeById[mission.startNode].y,
        actionIndex: 0,
        elapsed: 0,
        done: state.plans[member.id].length === 0,
        announcedAction: -1
      };
    }
    log('Einsatz vorbereitet.');
  }

  function resetRuntimeOnly() {
    stopTimer();
    state.time = 0;
    state.runtime = {};
    state.eventQueue = [];
    state.lastEvent = null;
    state.objectiveReached = false;
  }

  function start() {
    const issues = validatePlan();
    if (issues.length) return { ok: false, issues };
    prepareRuntime();
    setMode(STATES.RUNNING);
    log('Einsatz gestartet.');
    beginTimer();
    notify();
    return { ok: true };
  }

  function beginTimer() {
    stopTimer();
    state.timer = setInterval(() => {
      if (state.mode !== STATES.RUNNING) return;
      for (let i = 0; i < state.speed; i += 1) {
        if (state.mode !== STATES.RUNNING) break;
        simulateOneSecond();
      }
    }, 1000);
  }

  function stopTimer() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
  }

  function pause() {
    if (state.mode !== STATES.RUNNING) return;
    stopTimer();
    setMode(STATES.PAUSED);
    log('Simulation pausiert.');
    notify();
  }

  function resume() {
    if (state.mode !== STATES.PAUSED) return;
    setMode(STATES.RUNNING);
    log('Simulation fortgesetzt.');
    beginTimer();
    notify();
  }

  function step() {
    if (state.mode !== STATES.PAUSED) return;
    simulateOneSecond();
  }

  function runToNextEvent() {
    if (state.mode !== STATES.PAUSED) return;
    let guard = 0;
    while (state.mode === STATES.PAUSED && guard < 3600) {
      simulateOneSecond(true);
      guard += 1;
      if (state.mode === STATES.EVENT_STOP || state.mode === STATES.FINISHED) break;
    }
  }

  function simulateOneSecond(fromFastForward = false) {
    if (![STATES.RUNNING, STATES.PAUSED].includes(state.mode)) return;
    state.time += 1;

    for (const member of crew) updateMember(member);

    if (state.eventQueue.length) {
      stopTimer();
      state.lastEvent = state.eventQueue.shift();
      setMode(STATES.EVENT_STOP);
      log(`Ereignis: ${state.lastEvent.text}`);
    } else if (crew.every(member => state.runtime[member.id].done)) {
      stopTimer();
      setMode(STATES.FINISHED);
      log(state.objectiveReached ? 'Mission erfolgreich beendet.' : 'Mission beendet, Ziel jedoch nicht erreicht.');
    } else if (fromFastForward) {
      setMode(STATES.PAUSED);
    }
    notify();
  }

  function updateMember(member) {
    const runtime = state.runtime[member.id];
    if (!runtime || runtime.done) return;
    const actions = state.plans[member.id];
    const action = actions[runtime.actionIndex];
    if (!action) {
      runtime.done = true;
      return;
    }

    if (runtime.announcedAction !== runtime.actionIndex) {
      runtime.announcedAction = runtime.actionIndex;
      if (action.type === 'move') log(`${member.name} bewegt sich zu „${nodeById[action.to].label}“.`);
      else log(`${member.name} wartet ${action.duration} Sekunden bei „${nodeById[action.at].label}“.`);
    }

    runtime.elapsed += 1;
    if (action.type === 'move') {
      const start = nodeById[action.from];
      const end = nodeById[action.to];
      const ratio = Math.min(1, runtime.elapsed / action.duration);
      runtime.x = start.x + (end.x - start.x) * ratio;
      runtime.y = start.y + (end.y - start.y) * ratio;
      if (ratio >= 1) {
        runtime.node = action.to;
        log(`${member.name} erreicht „${end.label}“.`);
        if (member.id === 'bruno' && action.to === mission.objectiveNode && !state.objectiveReached) {
          state.objectiveReached = true;
          state.eventQueue.push({
            type: 'objective', title: 'Zielpunkt erreicht',
            text: `${formatTime(state.time)} – Bruno hat die Kasse erreicht.`
          });
        }
        advanceAction(runtime);
      }
    } else if (action.type === 'wait' && runtime.elapsed >= action.duration) {
      log(`${member.name} beendet die Wartezeit.`);
      advanceAction(runtime);
    }
  }

  function advanceAction(runtime) {
    runtime.actionIndex += 1;
    runtime.elapsed = 0;
    runtime.announcedAction = -1;
    const actions = state.plans[Object.keys(state.runtime).find(id => state.runtime[id] === runtime)];
    if (runtime.actionIndex >= actions.length) runtime.done = true;
  }

  function acknowledgeEvent(action) {
    if (state.mode !== STATES.EVENT_STOP) return;
    state.lastEvent = null;
    if (action === 'continue') {
      setMode(STATES.RUNNING);
      log('Ereignis bestätigt. Simulation wird fortgesetzt.');
      beginTimer();
    } else if (action === 'pause') {
      setMode(STATES.PAUSED);
      log('Ereignis bestätigt. Simulation bleibt pausiert.');
    } else if (action === 'planning') {
      stopTimer();
      setMode(STATES.PLANNING);
      log('Zur Planung zurückgekehrt; Plan bleibt erhalten.');
    } else if (action === 'abort') {
      abort();
      return;
    }
    notify();
  }

  function backToPlanning() {
    if (![STATES.PAUSED, STATES.FINISHED, STATES.ABORTED].includes(state.mode)) return;
    stopTimer();
    setMode(STATES.PLANNING);
    notify();
  }

  function abort() {
    if ([STATES.PLANNING, STATES.READY].includes(state.mode)) return;
    stopTimer();
    setMode(STATES.ABORTED);
    log('Einsatz abgebrochen.');
    notify();
  }

  function setMode(mode) { state.mode = mode; }
  function setSelectedCrew(id) { state.selectedCrewId = id; notify(); }
  function setSpeed(speed) { state.speed = Number(speed); notify(); }
  function log(text) { state.protocol.push({ time: state.time, text }); }
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  let listener = () => {};
  function subscribe(fn) { listener = fn; }
  function notify() { listener(getSnapshot()); }
  function getSnapshot() {
    return {
      ...state,
      plans: JSON.parse(JSON.stringify(state.plans)),
      runtime: JSON.parse(JSON.stringify(state.runtime)),
      protocol: [...state.protocol],
      crew, mission, STATES
    };
  }

  window.CoupEngine = {
    STATES, subscribe, getSnapshot, setSelectedCrew, addMove, addWait, removeLast, clearPlan,
    loadReferencePlan, validatePlan, start, pause, resume, step, runToNextEvent,
    acknowledgeEvent, backToPlanning, abort, setSpeed, formatTime, shortestPath,
    _test: { prepareRuntime, simulateOneSecond }
  };
})();
