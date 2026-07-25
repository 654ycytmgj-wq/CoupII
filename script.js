(() => {
  'use strict';

  function bind(id, handler) {
    document.getElementById(id).addEventListener('click', handler);
  }

  window.addEventListener('DOMContentLoaded', () => {
    bind('newGameBtn', CoupGame.newGame);
    bind('continueBtn', CoupGame.continueGame);
    bind('backToTitleBtn', () => CoupGame.showScreen('start'));
    bind('autoPlanBtn', CoupGame.autoPlan);
    bind('startMissionBtn', CoupGame.startMission);
    bind('cancelPlanningBtn', CoupGame.showHQ);
    bind('abortBtn', CoupGame.abortMission);
    bind('resultToHqBtn', CoupGame.showHQ);
    bind('restartBtn', CoupGame.restartCurrent);
    CoupGame.load();
  });

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch(error => {
        console.warn('Service Worker konnte nicht registriert werden.', error);
      });
    });
  }
})();
