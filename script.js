(()=>{'use strict';
function bind(id,fn,event='click'){document.getElementById(id).addEventListener(event,fn)}
window.addEventListener('DOMContentLoaded',()=>{
 bind('newGameBtn',CoupGame.newGame);bind('continueBtn',CoupGame.continueGame);bind('backToTitleBtn',()=>CoupGame.showScreen('start'));bind('autoPlanBtn',CoupGame.autoPlan);bind('startMissionBtn',CoupGame.startMission);bind('cancelPlanningBtn',CoupGame.showHQ);bind('abortBtn',CoupGame.abortMission);bind('resultToHqBtn',CoupGame.showHQ);bind('restartBtn',CoupGame.restartCurrent);bind('undoWaypointBtn',CoupGame.undoWaypoint);bind('clearRouteBtn',CoupGame.clearRoute);bind('clearAllRoutesBtn',CoupGame.clearAllRoutes);bind('simulatePlanBtn',CoupGame.simulatePlan);bind('savePlanBtn',CoupGame.savePlan);bind('godModeToggle',CoupGame.setGodMode,'change');bind('showHazards',CoupGame.renderMap,'change');bind('showConnections',CoupGame.renderMap,'change');bind('showTimes',CoupGame.renderMap,'change');bind('toolSelect',CoupGame.updateCost,'change');bind('carSelect',CoupGame.updateCost,'change');CoupGame.load();
});
if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.warn));
})();
