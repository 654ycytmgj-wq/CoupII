(() => {
  'use strict';
  const E = window.CoupEngine;
  const $ = id => document.getElementById(id);
  const svgNS = 'http://www.w3.org/2000/svg';

  function bind() {
    $('startBtn').addEventListener('click', () => {
      const result = E.start();
      if (!result.ok) renderValidation(result.issues);
    });
    $('pauseBtn').addEventListener('click', E.pause);
    $('continueBtn').addEventListener('click', E.resume);
    $('stepBtn').addEventListener('click', E.step);
    $('nextEventBtn').addEventListener('click', E.runToNextEvent);
    $('backToPlanningBtn').addEventListener('click', E.backToPlanning);
    $('abortBtn').addEventListener('click', E.abort);
    $('removeLastBtn').addEventListener('click', () => E.removeLast(E.getSnapshot().selectedCrewId));
    $('clearPlanBtn').addEventListener('click', () => E.clearPlan(E.getSnapshot().selectedCrewId));
    $('loadReferenceBtn').addEventListener('click', E.loadReferencePlan);
    $('validateBtn').addEventListener('click', () => renderValidation(E.validatePlan()));
    $('speedSelect').addEventListener('change', event => E.setSpeed(event.target.value));
    document.querySelectorAll('[data-wait]').forEach(btn => btn.addEventListener('click', () => {
      E.addWait(E.getSnapshot().selectedCrewId, Number(btn.dataset.wait));
    }));
    $('eventContinueBtn').addEventListener('click', () => E.acknowledgeEvent('continue'));
    $('eventPauseBtn').addEventListener('click', () => E.acknowledgeEvent('pause'));
    $('eventPlanningBtn').addEventListener('click', () => E.acknowledgeEvent('planning'));
    $('eventAbortBtn').addEventListener('click', () => E.acknowledgeEvent('abort'));
  }

  function render(snapshot) {
    $('modeLabel').textContent = snapshot.mode;
    $('clockLabel').textContent = E.formatTime(snapshot.time);
    $('speedLabel').textContent = `${snapshot.speed}×`;
    $('speedSelect').value = String(snapshot.speed);
    renderCrew(snapshot);
    renderMap(snapshot);
    renderActionLists(snapshot);
    renderTimeline(snapshot);
    renderProtocol(snapshot);
    renderButtons(snapshot);
    renderDialog(snapshot);
  }

  function renderCrew(snapshot) {
    const root = $('crewButtons'); root.innerHTML = '';
    snapshot.crew.forEach(member => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `crew-card ${member.id === snapshot.selectedCrewId ? 'selected' : ''}`;
      btn.innerHTML = `<span class="crew-token" style="--crew:${member.color}">${member.short}</span><span><strong>${member.name}</strong><small>${member.role}</small></span>`;
      btn.addEventListener('click', () => E.setSelectedCrew(member.id));
      root.appendChild(btn);
    });
    const selected = snapshot.crew.find(c => c.id === snapshot.selectedCrewId);
    $('mapInstruction').textContent = `${selected.name} ist ausgewählt.`;
  }

  function svg(tag, attrs = {}) {
    const el = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  }

  function renderMap(snapshot) {
    const root = $('missionMap'); root.innerHTML = '';
    snapshot.mission.rooms.forEach(room => {
      root.appendChild(svg('rect', { x: room.x, y: room.y, width: room.w, height: room.h, class: room.outside ? 'room outside' : 'room' }));
      const label = svg('text', { x: room.x + room.w / 2, y: room.y + room.h / 2, class: 'room-label' });
      label.textContent = room.label; root.appendChild(label);
    });
    snapshot.mission.edges.forEach(([a, b]) => {
      const na = node(snapshot, a), nb = node(snapshot, b);
      root.appendChild(svg('line', { x1: na.x, y1: na.y, x2: nb.x, y2: nb.y, class: 'edge' }));
    });

    snapshot.crew.forEach(member => {
      const actions = snapshot.plans[member.id];
      let current = snapshot.mission.startNode;
      const points = [node(snapshot, current)];
      actions.filter(a => a.type === 'move').forEach(a => { current = a.to; points.push(node(snapshot, current)); });
      if (points.length > 1) root.appendChild(svg('polyline', {
        points: points.map(p => `${p.x},${p.y}`).join(' '), class: 'route', style: `--route:${member.color}`
      }));
    });

    snapshot.mission.nodes.forEach(n => {
      const group = svg('g', { class: `map-node ${n.kind}`, 'data-node': n.id });
      group.appendChild(svg('circle', { cx: n.x, cy: n.y, r: 21 }));
      const mark = svg('text', { x: n.x, y: n.y + 6, class: 'node-mark' }); mark.textContent = n.kind === 'objective' ? '★' : '•'; group.appendChild(mark);
      const label = svg('text', { x: n.x, y: n.y + 42, class: 'node-label' }); label.textContent = n.label; group.appendChild(label);
      group.addEventListener('click', () => E.addMove(snapshot.selectedCrewId, n.id));
      root.appendChild(group);
    });

    const positions = runtimePositions(snapshot);
    drawGroupedMarkers(root, snapshot, positions);
  }

  function node(snapshot, id) { return snapshot.mission.nodes.find(n => n.id === id); }

  function runtimePositions(snapshot) {
    if (!Object.keys(snapshot.runtime).length) {
      return snapshot.crew.map(member => ({ member, x: node(snapshot, snapshot.mission.startNode).x, y: node(snapshot, snapshot.mission.startNode).y }));
    }
    return snapshot.crew.map(member => ({ member, x: snapshot.runtime[member.id].x, y: snapshot.runtime[member.id].y }));
  }

  function drawGroupedMarkers(root, snapshot, positions) {
    const groups = [];
    positions.forEach(pos => {
      const found = groups.find(g => Math.hypot(g.x - pos.x, g.y - pos.y) < 3);
      if (found) found.items.push(pos);
      else groups.push({ x: pos.x, y: pos.y, items: [pos] });
    });
    groups.forEach(group => {
      const g = svg('g', { class: 'crew-marker' });
      const count = group.items.length;
      if (count === 1) {
        g.appendChild(svg('circle', { cx: group.x, cy: group.y, r: 16, fill: group.items[0].member.color }));
      } else {
        group.items.forEach((item, index) => {
          const start = (index / count) * Math.PI * 2 - Math.PI / 2;
          const end = ((index + 1) / count) * Math.PI * 2 - Math.PI / 2;
          const x1 = group.x + Math.cos(start) * 17, y1 = group.y + Math.sin(start) * 17;
          const x2 = group.x + Math.cos(end) * 17, y2 = group.y + Math.sin(end) * 17;
          const large = end - start > Math.PI ? 1 : 0;
          g.appendChild(svg('path', { d: `M ${group.x} ${group.y} L ${x1} ${y1} A 17 17 0 ${large} 1 ${x2} ${y2} Z`, fill: item.member.color }));
        });
      }
      g.appendChild(svg('circle', { cx: group.x, cy: group.y, r: 18, class: 'marker-outline' }));
      const t = svg('text', { x: group.x, y: group.y + 5, class: 'marker-text' });
      t.textContent = count > 1 ? String(count) : group.items[0].member.short; g.appendChild(t);
      const title = svg('title'); title.textContent = group.items.map(i => i.member.name).join(', '); g.appendChild(title);
      root.appendChild(g);
    });
  }

  function renderActionLists(snapshot) {
    const root = $('actionLists'); root.innerHTML = '';
    snapshot.crew.forEach(member => {
      const section = document.createElement('section'); section.className = 'action-list';
      const title = document.createElement('h3'); title.innerHTML = `<span style="color:${member.color}">●</span> ${member.name}`; section.appendChild(title);
      const ol = document.createElement('ol');
      if (!snapshot.plans[member.id].length) {
        const li = document.createElement('li'); li.className = 'empty'; li.textContent = 'Noch keine Aktion'; ol.appendChild(li);
      }
      snapshot.plans[member.id].forEach(action => {
        const li = document.createElement('li');
        li.textContent = action.type === 'move' ? `Gehe zu ${node(snapshot, action.to).label} (${action.duration} s)` : `Warte ${action.duration} s`;
        ol.appendChild(li);
      });
      section.appendChild(ol); root.appendChild(section);
    });
  }

  function renderTimeline(snapshot) {
    const root = $('timeline'); root.innerHTML = '';
    snapshot.crew.forEach(member => {
      const row = document.createElement('div'); row.className = 'timeline-row';
      const label = document.createElement('div'); label.className = 'timeline-label'; label.textContent = member.short; row.appendChild(label);
      const track = document.createElement('div'); track.className = 'timeline-track';
      snapshot.plans[member.id].forEach(action => {
        const block = document.createElement('span'); block.className = `timeline-block ${action.type}`;
        block.style.flexGrow = String(action.duration); block.title = action.type === 'move' ? node(snapshot, action.to).label : `Warten ${action.duration} s`;
        track.appendChild(block);
      });
      row.appendChild(track); root.appendChild(row);
    });
  }

  function renderProtocol(snapshot) {
    const root = $('protocol'); root.innerHTML = '';
    snapshot.protocol.forEach(entry => {
      const line = document.createElement('div'); line.textContent = `${E.formatTime(entry.time)}  ${entry.text}`; root.appendChild(line);
    });
    root.scrollTop = root.scrollHeight;
  }

  function renderButtons(snapshot) {
    const S = snapshot.STATES, mode = snapshot.mode;
    $('startBtn').disabled = mode !== S.READY;
    $('pauseBtn').disabled = mode !== S.RUNNING;
    $('continueBtn').disabled = mode !== S.PAUSED;
    $('stepBtn').disabled = mode !== S.PAUSED;
    $('nextEventBtn').disabled = mode !== S.PAUSED;
    $('backToPlanningBtn').disabled = ![S.PAUSED, S.FINISHED, S.ABORTED].includes(mode);
    $('abortBtn').disabled = ![S.RUNNING, S.PAUSED, S.EVENT_STOP].includes(mode);
    const planning = [S.PLANNING, S.READY].includes(mode);
    document.querySelectorAll('.left-panel button, .map-node').forEach(el => {
      if (el.tagName === 'BUTTON') el.disabled = !planning;
      else el.classList.toggle('disabled', !planning);
    });
  }

  function renderDialog(snapshot) {
    const box = $('eventDialog');
    const show = snapshot.mode === snapshot.STATES.EVENT_STOP && snapshot.lastEvent;
    box.classList.toggle('hidden', !show);
    if (show) {
      $('eventTitle').textContent = snapshot.lastEvent.title;
      $('eventText').textContent = snapshot.lastEvent.text;
    }
  }

  function renderValidation(issues) {
    const box = $('validationBox'); box.innerHTML = '';
    if (!issues.length) { box.className = 'validation-box ok'; box.textContent = 'Plan ist für den Kern-Test vollständig.'; return; }
    box.className = 'validation-box error';
    const ul = document.createElement('ul'); issues.forEach(issue => { const li = document.createElement('li'); li.textContent = issue; ul.appendChild(li); }); box.appendChild(ul);
  }

  window.addEventListener('DOMContentLoaded', () => {
    bind();
    E.subscribe(render);
    render(E.getSnapshot());
    E.loadReferencePlan();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./service-worker.js').catch(error => console.warn('Service Worker:', error));
    }
  });
})();
