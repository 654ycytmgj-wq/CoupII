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
  const doorIds = mission.nodes.filter(n => n.kind === 'door').map(n => n.id);

  const state = {
    mode: STATES.PLANNING, selectedCrewId: 'bruno', speed: 4, time: 0, timer: null,
    plans: Object.fromEntries(crew.map(c => [c.id, []])), runtime: {}, eventQueue: [],
    objectiveReached: false, protocol: [], lastEvent: null, doorStates: initialDoorStates()
  };

  function initialDoorStates() { return Object.fromEntries(doorIds.map(id => [id, 'closed'])); }
  function buildAdjacency(edges) {
    const map = {}; mission.nodes.forEach(n => { map[n.id] = []; });
    edges.forEach(([a,b]) => { map[a].push(b); map[b].push(a); }); return map;
  }
  function shortestPath(from,to) {
    if (from === to) return [from]; const queue=[[from]], seen=new Set([from]);
    while(queue.length){const path=queue.shift(), last=path[path.length-1]; for(const next of adjacency[last]){
      if(seen.has(next)) continue; const candidate=[...path,next]; if(next===to) return candidate;
      seen.add(next); queue.push(candidate);
    }} throw new Error(`Kein Weg von ${from} nach ${to}`);
  }
  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
  function secondsForEdge(a,b){return Math.max(2,Math.round(distance(nodeById[a],nodeById[b])/28))}
  function currentPlannedNode(crewId){const actions=state.plans[crewId]; for(let i=actions.length-1;i>=0;i--){if(actions[i].type==='move')return actions[i].to;} return mission.startNode;}
  function doorAlreadyPlannedOpen(crewId,doorId){return state.plans[crewId].some(a=>a.type==='openDoor'&&a.door===doorId)}

  function appendPath(crewId, from, to, autoDoors=true){
    const path=shortestPath(from,to);
    for(let i=1;i<path.length;i++){
      const prev=path[i-1], next=path[i];
      state.plans[crewId].push({type:'move',from:prev,to:next,duration:secondsForEdge(prev,next)});
      if(autoDoors && nodeById[next].kind==='door' && !doorAlreadyPlannedOpen(crewId,next)){
        state.plans[crewId].push({type:'openDoor',door:next,at:next,duration:nodeById[next].doorDuration||4});
      }
    }
  }
  function addMove(crewId,targetNode){if(!isPlanning())return; appendPath(crewId,currentPlannedNode(crewId),targetNode,true); setMode(STATES.PLANNING); notify();}
  function addWait(crewId,seconds){if(!isPlanning())return; const value=Math.max(1,Math.min(300,Math.round(Number(seconds)||0))); state.plans[crewId].push({type:'wait',duration:value,at:currentPlannedNode(crewId)}); setMode(STATES.PLANNING); notify();}
  function removeLast(crewId){if(!isPlanning())return; state.plans[crewId].pop(); setMode(STATES.PLANNING); notify();}
  function deleteAction(crewId,index){if(!isPlanning())return; state.plans[crewId].splice(index,1); normalizePlan(crewId); setMode(STATES.PLANNING); notify();}
  function moveAction(crewId,index,direction){if(!isPlanning())return; const actions=state.plans[crewId], target=index+direction; if(target<0||target>=actions.length)return; [actions[index],actions[target]]=[actions[target],actions[index]]; normalizePlan(crewId); setMode(STATES.PLANNING); notify();}
  function updateWait(crewId,index,seconds){if(!isPlanning())return; const action=state.plans[crewId][index]; if(!action||action.type!=='wait')return; action.duration=Math.max(1,Math.min(300,Math.round(Number(seconds)||1))); notify();}
  function clearPlan(crewId){if(!isPlanning())return; state.plans[crewId]=[]; setMode(STATES.PLANNING); notify();}
  function normalizePlan(crewId){
    let cursor=mission.startNode;
    for(const action of state.plans[crewId]){
      if(action.type==='move'){action.from=cursor; cursor=action.to; action.duration=secondsForEdge(action.from,action.to);}
      else action.at=cursor;
    }
  }
  function isPlanning(){return [STATES.PLANNING,STATES.READY].includes(state.mode)}

  function loadReferencePlan(){
    state.plans={bruno:[],emil:[]};
    appendPath('bruno','car','cash',true); addWaitSilent('bruno',5); appendPath('bruno','cash','car',false);
    appendPath('emil','car','rear',true); appendPath('emil','rear','shop',false); addWaitSilent('emil',8); appendPath('emil','shop','rear',false); appendPath('emil','rear','car',false);
    setMode(STATES.READY); resetRuntimeOnly(); state.protocol=[]; log('Referenzplan geladen. Bereit zum Start.'); notify();
  }
  function addWaitSilent(id,seconds){state.plans[id].push({type:'wait',duration:seconds,at:currentPlannedNode(id)})}

  function scheduleFor(crewId){let t=0; return state.plans[crewId].map((action,index)=>{const item={crewId,index,action,start:t,end:t+action.duration}; t=item.end; return item;});}
  function bottleneckIssues(){
    const issues=[]; const all=crew.flatMap(m=>scheduleFor(m.id));
    for(const doorId of doorIds){
      const uses=all.filter(x => (x.action.type==='openDoor'&&x.action.door===doorId) || (x.action.type==='move'&&(x.action.from===doorId||x.action.to===doorId)));
      for(let i=0;i<uses.length;i++) for(let j=i+1;j<uses.length;j++){
        const a=uses[i],b=uses[j]; if(a.crewId===b.crewId)continue;
        if(Math.max(a.start,b.start)<Math.min(a.end,b.end)){
          const an=crew.find(c=>c.id===a.crewId).name,bn=crew.find(c=>c.id===b.crewId).name;
          issues.push(`Engstelle „${nodeById[doorId].label}“: ${an} und ${bn} überschneiden sich zwischen ${formatTime(Math.max(a.start,b.start))} und ${formatTime(Math.min(a.end,b.end))}.`);
        }
      }
    }
    return [...new Set(issues)];
  }
  function validatePlan(){
    const issues=[];
    for(const member of crew){const actions=state.plans[member.id]; if(!actions.length)issues.push(`${member.name}: keine Aktionen geplant.`); if(currentPlannedNode(member.id)!==mission.startNode)issues.push(`${member.name}: endet nicht am Fluchtwagen.`);}
    if(!state.plans.bruno.some(a=>a.type==='move'&&a.to===mission.objectiveNode))issues.push('Bruno erreicht die Kasse nicht.');
    for(const member of crew){
      const open=new Set(); for(const action of state.plans[member.id]){
        if(action.type==='move' && !adjacency[action.from]?.includes(action.to)) issues.push(`${member.name}: ungültiger direkter Weg von „${nodeById[action.from]?.label || action.from}“ nach „${nodeById[action.to]?.label || action.to}“.`);
        if(action.type==='openDoor')open.add(action.door);
        if(action.type==='move'&&nodeById[action.from]?.kind==='door'&&!open.has(action.from))issues.push(`${member.name}: „${nodeById[action.from].label}“ wird passiert, ohne sie vorher zu öffnen.`);
      }
    }
    issues.push(...bottleneckIssues()); if(!issues.length)setMode(STATES.READY); notify(); return issues;
  }

  function prepareRuntime(){
    state.time=0; state.objectiveReached=false; state.eventQueue=[]; state.lastEvent=null; state.protocol=[]; state.runtime={}; state.doorStates=initialDoorStates();
    for(const member of crew)state.runtime[member.id]={node:mission.startNode,x:nodeById[mission.startNode].x,y:nodeById[mission.startNode].y,actionIndex:0,elapsed:0,done:state.plans[member.id].length===0,announcedAction:-1};
    log('Einsatz vorbereitet.');
  }
  function resetRuntimeOnly(){stopTimer(); state.time=0; state.runtime={}; state.eventQueue=[]; state.lastEvent=null; state.objectiveReached=false; state.doorStates=initialDoorStates();}
  function start(){const issues=validatePlan(); if(issues.length)return{ok:false,issues}; prepareRuntime(); setMode(STATES.RUNNING); log('Einsatz gestartet.'); beginTimer(); notify(); return{ok:true};}
  function beginTimer(){stopTimer(); state.timer=setInterval(()=>{if(state.mode!==STATES.RUNNING)return; for(let i=0;i<state.speed;i++){if(state.mode!==STATES.RUNNING)break; simulateOneSecond();}},1000)}
  function stopTimer(){if(state.timer)clearInterval(state.timer); state.timer=null}
  function pause(){if(state.mode!==STATES.RUNNING)return; stopTimer(); setMode(STATES.PAUSED); log('Simulation pausiert.'); notify();}
  function resume(){if(state.mode!==STATES.PAUSED)return; setMode(STATES.RUNNING); log('Simulation fortgesetzt.'); beginTimer(); notify();}
  function step(){if(state.mode!==STATES.PAUSED)return; simulateOneSecond();}
  function runToNextEvent(){if(state.mode!==STATES.PAUSED)return; let guard=0; while(state.mode===STATES.PAUSED&&guard<3600){simulateOneSecond(true);guard++;if([STATES.EVENT_STOP,STATES.FINISHED].includes(state.mode))break;}}
  function simulateOneSecond(fromFastForward=false){
    if(![STATES.RUNNING,STATES.PAUSED].includes(state.mode))return; state.time++;
    for(const member of crew)updateMember(member);
    if(state.eventQueue.length){stopTimer(); state.lastEvent=state.eventQueue.shift(); setMode(STATES.EVENT_STOP); log(`Ereignis: ${state.lastEvent.text}`);}
    else if(crew.every(m=>state.runtime[m.id].done)){stopTimer(); setMode(STATES.FINISHED); log(state.objectiveReached?'Mission erfolgreich beendet.':'Mission beendet, Ziel jedoch nicht erreicht.');}
    else if(fromFastForward)setMode(STATES.PAUSED); notify();
  }
  function actionLabel(action){if(action.type==='move')return `Gehe zu „${nodeById[action.to].label}“`; if(action.type==='wait')return `Warte ${action.duration} Sekunden`; return `Öffne „${nodeById[action.door].label}“`;}
  function updateMember(member){
    const r=state.runtime[member.id]; if(!r||r.done)return; const actions=state.plans[member.id], action=actions[r.actionIndex]; if(!action){r.done=true;return;}
    if(r.announcedAction!==r.actionIndex){r.announcedAction=r.actionIndex; log(`${member.name} beginnt: ${actionLabel(action)}.`);}
    r.elapsed++;
    if(action.type==='move'){
      const start=nodeById[action.from],end=nodeById[action.to],ratio=Math.min(1,r.elapsed/action.duration); r.x=start.x+(end.x-start.x)*ratio;r.y=start.y+(end.y-start.y)*ratio;
      if(ratio>=1){r.node=action.to;log(`${member.name} beendet: ${actionLabel(action)}.`);if(member.id==='bruno'&&action.to===mission.objectiveNode&&!state.objectiveReached){state.objectiveReached=true;state.eventQueue.push({type:'objective',title:'Zielpunkt erreicht',text:`${formatTime(state.time)} – Bruno hat die Kasse erreicht.`,resume:true});}advanceAction(member.id,r);}
    } else if(action.type==='wait'&&r.elapsed>=action.duration){log(`${member.name} beendet: ${actionLabel(action)}.`);advanceAction(member.id,r);}
    else if(action.type==='openDoor'&&r.elapsed>=action.duration){state.doorStates[action.door]='open';log(`${member.name} beendet: ${actionLabel(action)}. Tür ist offen.`);advanceAction(member.id,r);}
  }
  function advanceAction(id,r){r.actionIndex++;r.elapsed=0;r.announcedAction=-1;if(r.actionIndex>=state.plans[id].length)r.done=true;}
  function acknowledgeEvent(action){if(state.mode!==STATES.EVENT_STOP)return;state.lastEvent=null;if(action==='continue'){setMode(STATES.RUNNING);log('Ereignis bestätigt. Simulation wird fortgesetzt.');beginTimer();}else if(action==='planning'){stopTimer();setMode(STATES.PLANNING);log('Zur Planung zurückgekehrt; Plan bleibt erhalten.');}else if(action==='abort'){abort();return;}notify();}
  function backToPlanning(){if(![STATES.PAUSED,STATES.FINISHED,STATES.ABORTED].includes(state.mode))return;stopTimer();setMode(STATES.PLANNING);notify();}
  function abort(){if([STATES.PLANNING,STATES.READY].includes(state.mode))return;stopTimer();setMode(STATES.ABORTED);log('Einsatz abgebrochen.');notify();}
  function setMode(mode){state.mode=mode} function setSelectedCrew(id){state.selectedCrewId=id;notify()} function setSpeed(speed){state.speed=Number(speed);notify()}
  function log(text){state.protocol.push({time:state.time,text})} function formatTime(seconds){const m=Math.floor(seconds/60).toString().padStart(2,'0'),s=(seconds%60).toString().padStart(2,'0');return`${m}:${s}`}
  let listener=()=>{}; function subscribe(fn){listener=fn} function notify(){listener(getSnapshot())}
  function getSnapshot(){return{...state,plans:JSON.parse(JSON.stringify(state.plans)),runtime:JSON.parse(JSON.stringify(state.runtime)),protocol:[...state.protocol],doorStates:{...state.doorStates},crew,mission,STATES}}

  window.CoupEngine={STATES,subscribe,getSnapshot,setSelectedCrew,addMove,addWait,removeLast,deleteAction,moveAction,updateWait,clearPlan,loadReferencePlan,validatePlan,start,pause,resume,step,runToNextEvent,acknowledgeEvent,backToPlanning,abort,setSpeed,formatTime,shortestPath,_test:{prepareRuntime,simulateOneSecond,bottleneckIssues,scheduleFor}};
})();
