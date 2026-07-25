(() => {
  'use strict';

  const fmt = new Intl.NumberFormat('de-DE', {
    style:'currency', currency:'EUR', maximumFractionDigits:0
  });

  const STORAGE_KEY = 'derGrosseCoupSaveV01';
  const crew = window.GAME_CREW;
  const tools = window.GAME_TOOLS;
  const cars = window.GAME_CARS;
  const missions = window.GAME_MISSIONS;

  let state = defaultState();
  let executionTimer = null;
  let aborted = false;

  function defaultState() {
    return { version:1, money:10000, heat:0, completed:[false,false], currentMission:0 };
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      state = { ...defaultState(), ...parsed };
      return true;
    } catch (error) {
      console.warn('Spielstand konnte nicht geladen werden.', error);
      state = defaultState();
      return false;
    }
  }

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top:0, behavior:'instant' });
  }

  function newGame() {
    state = defaultState();
    save();
    showHQ();
  }

  function continueGame() {
    load();
    showHQ();
  }

  function showHQ() {
    clearInterval(executionTimer);
    showScreen('hq');
    document.getElementById('money').textContent = fmt.format(state.money);
    document.getElementById('heat').textContent = state.heat;
    const list = document.getElementById('missionList');
    list.innerHTML = '';

    missions.forEach((mission, index) => {
      const locked = index === 1 && !state.completed[0];
      const card = document.createElement('article');
      card.className = `mission-card${locked ? ' locked' : ''}`;
      card.innerHTML = `
        <h3>${mission.title}</h3>
        <p>${mission.desc}</p>
        <span class="badge">Belohnung: ${fmt.format(mission.reward)}</span>
        <span class="badge">Mindestteam: ${mission.minCrew}</span>
        <span class="badge">${state.completed[index] ? 'Abgeschlossen' : 'Offen'}</span><br><br>
        <button ${locked ? 'disabled' : ''}>${state.completed[index] ? 'Erneut spielen' : 'Mission planen'}</button>`;
      card.querySelector('button').addEventListener('click', () => openPlanning(index));
      list.appendChild(card);
    });
  }

  function openPlanning(index) {
    state.currentMission = index;
    const mission = missions[index];
    showScreen('planning');
    document.getElementById('planTitle').textContent = mission.title;
    document.getElementById('planDesc').textContent = mission.desc;
    document.getElementById('budget').textContent = fmt.format(state.money);

    const crewList = document.getElementById('crewList');
    crewList.innerHTML = '';
    crew.forEach(member => {
      const card = document.createElement('label');
      card.className = 'crew-card';
      card.innerHTML = `<input type="checkbox" value="${member.id}"><strong>${member.name}</strong><br><span>${member.role}</span><br><span class="small">Fähigkeit ${member.skill}/10 · Honorar ${fmt.format(member.cost)}</span>`;
      const checkbox = card.querySelector('input');
      checkbox.addEventListener('change', () => card.classList.toggle('selected', checkbox.checked));
      crewList.appendChild(card);
    });

    document.getElementById('toolSelect').innerHTML = tools.map(item => `<option value="${item.id}">${item.name} (${fmt.format(item.cost)})</option>`).join('');
    document.getElementById('carSelect').innerHTML = cars.map(item => `<option value="${item.id}">${item.name} (${fmt.format(item.cost)})</option>`).join('');
    document.getElementById('timelineBody').innerHTML = mission.phases.map(phase => `<tr><td>${phase[0]}</td><td>${phase[1]}</td><td>${phase[2]}</td></tr>`).join('');
  }

  function autoPlan() {
    const targetCount = state.currentMission === 0 ? 2 : 3;
    document.querySelectorAll('#crewList input').forEach((checkbox, index) => {
      checkbox.checked = index < targetCount;
      checkbox.closest('.crew-card').classList.toggle('selected', checkbox.checked);
    });
    document.getElementById('toolSelect').value = state.currentMission === 0 ? 'pro' : 'silent';
    document.getElementById('carSelect').value = state.currentMission === 0 ? 'compact' : 'fast';
  }

  function selectedCrew() {
    return [...document.querySelectorAll('#crewList input:checked')]
      .map(input => crew.find(member => member.id === input.value));
  }

  function startMission() {
    const mission = missions[state.currentMission];
    const team = selectedCrew();
    const tool = tools.find(item => item.id === document.getElementById('toolSelect').value);
    const car = cars.find(item => item.id === document.getElementById('carSelect').value);
    const cost = team.reduce((sum, member) => sum + member.cost, 0) + tool.cost + car.cost;

    if (team.length < mission.minCrew) {
      alert(`Mindestens ${mission.minCrew} Teammitglieder erforderlich.`);
      return;
    }
    if (cost > state.money) {
      alert('Das Kapital reicht für diesen Plan nicht aus.');
      return;
    }

    state.money -= cost;
    save();
    runExecution(mission, team, tool, car, cost);
  }

  function runExecution(mission, team, tool, car, cost) {
    showScreen('execution');
    aborted = false;
    document.getElementById('abortBtn').disabled = false;
    document.getElementById('execTitle').textContent = mission.title;
    document.getElementById('alarm').textContent = '0';
    document.getElementById('progressBar').style.width = '0%';
    const log = document.getElementById('log');
    log.textContent = 'Einsatz beginnt…\n';
    document.getElementById('map').innerHTML = mission.rooms.map((room, index) => `<div class="room" id="room${index}">${room}</div>`).join('');

    let skillBonus = team.reduce((sum, member) => sum + member.skill, 0) * 1.6;
    if (team.some(member => member.bonus === 'locks')) skillBonus += 8;
    if (team.some(member => member.bonus === 'alarm')) skillBonus += state.currentMission === 1 ? 12 : 5;
    if (team.some(member => member.bonus === 'loot')) skillBonus += 4;
    if (team.some(member => member.bonus === 'escape')) skillBonus += 8;

    const chance = Math.min(92, mission.baseChance + skillBonus / 4 + tool.bonus + car.bonus - state.heat * 5);
    let alarm = 0;
    let step = 0;

    executionTimer = window.setInterval(() => {
      if (aborted) {
        clearInterval(executionTimer);
        finishMission(false, mission, cost, true, alarm, chance);
        return;
      }

      document.querySelectorAll('.room').forEach((element, index) => {
        element.classList.toggle('active', index === Math.min(step, mission.rooms.length - 1));
        if (index < step) element.classList.add('done');
      });

      const event = mission.events[Math.min(step, mission.events.length - 1)];
      log.textContent += `\n${String(step + 1).padStart(2, '0')}: ${event}`;
      if (Math.random() * 100 > chance + 8) {
        alarm = Math.min(5, alarm + 1);
        log.textContent += '\n   WARNUNG: Ein Fehler erhöht den Alarmstatus.';
      }
      log.scrollTop = log.scrollHeight;
      document.getElementById('alarm').textContent = alarm;
      document.getElementById('progressBar').style.width = `${Math.min(100, (step + 1) / mission.events.length * 100)}%`;
      step += 1;

      if (step >= mission.events.length) {
        clearInterval(executionTimer);
        const success = Math.random() * 100 < Math.max(15, chance - alarm * 10);
        window.setTimeout(() => finishMission(success, mission, cost, false, alarm, chance), 650);
      }
    }, 850);
  }

  function abortMission() {
    aborted = true;
    document.getElementById('abortBtn').disabled = true;
  }

  function finishMission(success, mission, cost, wasAborted, alarm, chance) {
    showScreen('result');
    const title = document.getElementById('resultTitle');
    const text = document.getElementById('resultText');

    if (success) {
      state.money += mission.reward;
      state.heat = Math.min(5, state.heat + Math.max(0, alarm - 1));
      state.completed[mission.id] = true;
      title.textContent = 'Coup erfolgreich';
      title.className = 'result-success';
      text.innerHTML = `<p>Die Beute wurde gesichert.</p><p><strong>Belohnung:</strong> ${fmt.format(mission.reward)}<br><strong>Einsatzkosten:</strong> ${fmt.format(cost)}<br><strong>Alarmstufe:</strong> ${alarm}/5<br><strong>Erfolgschance des Plans:</strong> ${Math.round(chance)} %</p><p>Aktuelles Kapital: <strong>${fmt.format(state.money)}</strong></p>`;
    } else {
      state.heat = Math.min(5, state.heat + (wasAborted ? 0 : 1));
      title.textContent = wasAborted ? 'Einsatz abgebrochen' : 'Coup gescheitert';
      title.className = 'result-fail';
      text.innerHTML = `<p>${wasAborted ? 'Die Bande zieht sich rechtzeitig zurück.' : 'Der Plan bricht unter dem steigenden Druck zusammen.'}</p><p><strong>Einsatzkosten verloren:</strong> ${fmt.format(cost)}<br><strong>Alarmstufe:</strong> ${alarm}/5<br><strong>Geschätzte Erfolgschance:</strong> ${Math.round(chance)} %</p><p>Verbleibendes Kapital: <strong>${fmt.format(state.money)}</strong></p>`;
    }
    save();
  }

  function restartCurrent() {
    openPlanning(state.currentMission);
  }

  window.CoupGame = {
    newGame, continueGame, showScreen, showHQ, autoPlan,
    startMission, abortMission, restartCurrent, load
  };
})();
